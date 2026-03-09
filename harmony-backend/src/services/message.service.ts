import { TRPCError } from '@trpc/server';
import { prisma } from '../db/prisma';
import { cacheService, CacheTTL, sanitizeKeySegment } from './cache.service';
import { permissionService } from './permission.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetMessagesInput {
  serverId: string;
  channelId: string;
  cursor?: string; // messageId to paginate from (exclusive)
  limit?: number; // default 20
}

export interface SendMessageInput {
  serverId: string;
  channelId: string;
  authorId: string;
  content: string;
  // sizeBytes is number on the wire (JSON-safe); cast to BigInt for Prisma
  attachments?: Array<{
    filename: string;
    url: string;
    contentType: string;
    sizeBytes: number;
  }>;
}

export interface EditMessageInput {
  serverId: string;
  messageId: string;
  authorId: string;
  content: string;
}

export interface DeleteMessageInput {
  messageId: string;
  actorId: string;
  serverId: string;
}

// ─── Author / attachment projections ─────────────────────────────────────────

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const;

// sizeBytes excluded from select — Prisma returns it as BigInt which JSON
// cannot serialize with the default tRPC transformer. Clients that need the
// raw byte count should read it from the HTTP Content-Length header or a
// dedicated metadata endpoint once superjson is configured end-to-end.
const ATTACHMENT_SELECT = {
  id: true,
  filename: true,
  url: true,
  contentType: true,
} as const;

const MESSAGE_INCLUDE = {
  author: { select: AUTHOR_SELECT },
  attachments: { select: ATTACHMENT_SELECT },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Cache key scoped to both server and channel so that private-channel entries
 * cannot be hit by users authorized on a different server.
 */
function msgCacheKey(
  serverId: string,
  channelId: string,
  cursor: string | undefined,
  limit: number,
): string {
  const c = sanitizeKeySegment(cursor ?? 'start');
  return (
    `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(channelId)}` +
    `:cursor:${c}:limit:${limit}`
  );
}

/**
 * Resolve a channel and assert it belongs to the given server.
 * Throws NOT_FOUND (collapsed from both "no channel" and "wrong server") to
 * prevent callers from probing channel IDs across servers.
 */
async function requireChannelInServer(channelId: string, serverId: string) {
  const channel = await prisma.channel.findUnique({ where: { id: channelId } });
  if (!channel || channel.serverId !== serverId) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
  }
  return channel;
}

/**
 * Resolve a message (non-deleted) and assert its channel belongs to `serverId`.
 */
async function requireMessageInServer(messageId: string, serverId: string) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: { channel: { select: { serverId: true } } },
  });
  if (!message || message.isDeleted || message.channel.serverId !== serverId) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this server' });
  }
  return message;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const messageService = {
  /**
   * Retrieve messages for a channel using cursor-based pagination.
   * Messages are returned in ascending chronological order (oldest first).
   * Pass the last returned message's id as `cursor` to get the next page.
   */
  async getMessages(input: GetMessagesInput) {
    const { serverId, channelId, cursor, limit = 20 } = input;
    const clampedLimit = Math.min(Math.max(1, limit), 100);

    await requireChannelInServer(channelId, serverId);

    const cacheKey = msgCacheKey(serverId, channelId, cursor, clampedLimit);

    return cacheService.getOrRevalidate(
      cacheKey,
      async () => {
        const messages = await prisma.message.findMany({
          where: { channelId, isDeleted: false },
          take: clampedLimit + 1, // fetch one extra to determine hasMore
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : 0,
          orderBy: { createdAt: 'asc' },
          include: MESSAGE_INCLUDE,
        });

        const hasMore = messages.length > clampedLimit;
        const page = hasMore ? messages.slice(0, clampedLimit) : messages;
        const nextCursor = hasMore ? page[page.length - 1].id : null;

        return { messages: page, nextCursor, hasMore };
      },
      { ttl: CacheTTL.channelMessages },
    );
  },

  /**
   * Send a new message to a channel, optionally with attachment metadata.
   */
  async sendMessage(input: SendMessageInput) {
    const { serverId, channelId, authorId, content, attachments } = input;

    await requireChannelInServer(channelId, serverId);

    const message = await prisma.message.create({
      data: {
        channelId,
        authorId,
        content,
        ...(attachments &&
          attachments.length > 0 && {
            attachments: {
              // Cast number → BigInt for Prisma; sizeBytes is excluded from responses
              create: attachments.map((a) => ({ ...a, sizeBytes: BigInt(a.sizeBytes) })),
            },
          }),
      },
      include: MESSAGE_INCLUDE,
    });

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(channelId)}:*`,
      )
      .catch(() => {});

    return message;
  },

  /**
   * Edit a message's content. Only the message author may edit.
   */
  async editMessage(input: EditMessageInput) {
    const { serverId, messageId, authorId, content } = input;

    const message = await requireMessageInServer(messageId, serverId);

    if (message.authorId !== authorId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own messages' });
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { content, editedAt: new Date() },
      include: MESSAGE_INCLUDE,
    });

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(message.channelId)}:*`,
      )
      .catch(() => {});

    return updated;
  },

  /**
   * Soft-delete a message.
   * - Own messages: requires message:delete_own (checked via router RBAC).
   * - Other users' messages: additionally requires message:delete_any.
   */
  async deleteMessage(input: DeleteMessageInput) {
    const { messageId, actorId, serverId } = input;

    const message = await requireMessageInServer(messageId, serverId);

    if (message.authorId !== actorId) {
      const canDeleteAny = await permissionService.checkPermission(
        actorId,
        serverId,
        'message:delete_any',
      );
      if (!canDeleteAny) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this message',
        });
      }
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true },
    });

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(message.channelId)}:*`,
      )
      .catch(() => {});
  },

  /**
   * Pin a message. Requires message:pin (MODERATOR+), checked via router RBAC.
   * Uses a transaction to atomically check-and-set, preventing concurrent
   * double-pin races.
   */
  async pinMessage(messageId: string, serverId: string) {
    const updated = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.findUnique({
        where: { id: messageId },
        include: { channel: { select: { serverId: true } } },
      });

      if (!msg || msg.isDeleted || msg.channel.serverId !== serverId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this server' });
      }
      if (msg.pinned) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Message is already pinned' });
      }

      return tx.message.update({
        where: { id: messageId },
        data: { pinned: true, pinnedAt: new Date() },
        include: MESSAGE_INCLUDE,
      });
    });

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(updated.channelId)}:*`,
      )
      .catch(() => {});

    return updated;
  },

  /**
   * Unpin a message. Requires message:pin (MODERATOR+), checked via router RBAC.
   * Uses a transaction to atomically check-and-clear.
   */
  async unpinMessage(messageId: string, serverId: string) {
    const updated = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.findUnique({
        where: { id: messageId },
        include: { channel: { select: { serverId: true } } },
      });

      if (!msg || msg.isDeleted || msg.channel.serverId !== serverId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this server' });
      }
      if (!msg.pinned) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Message is not pinned' });
      }

      return tx.message.update({
        where: { id: messageId },
        data: { pinned: false, pinnedAt: null },
        include: MESSAGE_INCLUDE,
      });
    });

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(updated.channelId)}:*`,
      )
      .catch(() => {});

    return updated;
  },

  /**
   * Retrieve all pinned messages for a channel in pin order (pinnedAt DESC).
   */
  async getPinnedMessages(channelId: string, serverId: string) {
    await requireChannelInServer(channelId, serverId);

    return prisma.message.findMany({
      where: { channelId, pinned: true, isDeleted: false },
      orderBy: { pinnedAt: 'desc' },
      include: MESSAGE_INCLUDE,
    });
  },
};
