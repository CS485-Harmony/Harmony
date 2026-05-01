import { TRPCError } from '@trpc/server';
import { prisma } from '../db/prisma';
import { createLogger } from '../lib/logger';
import { cacheService, CacheTTL, sanitizeKeySegment } from './cache.service';
import { permissionService } from './permission.service';
import { eventBus, EventChannels } from '../events/eventBus';
import { channelRepository } from '../repositories/channel.repository';
import { messageRepository } from '../repositories/message.repository';
import { processMentions, processBroadcastMentions } from './mention.service';
import { pushNotificationService } from './pushNotification.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GetMessagesInput {
  serverId: string;
  channelId: string;
  cursor?: string; // messageId to paginate from (exclusive)
  limit?: number; // default 20
}

export interface CreateReplyInput {
  parentMessageId: string;
  channelId: string;
  serverId: string;
  authorId: string;
  content: string;
}

export interface GetThreadMessagesInput {
  parentMessageId: string;
  channelId: string;
  serverId: string;
  cursor?: string;
  limit?: number;
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

const logger = createLogger({ component: 'message-service' });

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Group flat reaction rows into the `{ emoji, count, userIds }` shape expected by the frontend. */
function groupReactions(raw: { emoji: string; userId: string }[]) {
  const map = new Map<string, string[]>();
  for (const r of raw) {
    const users = map.get(r.emoji);
    if (users) users.push(r.userId);
    else map.set(r.emoji, [r.userId]);
  }
  return Array.from(map.entries()).map(([emoji, userIds]) => ({
    emoji,
    count: userIds.length,
    userIds,
  }));
}

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
  const channel = await channelRepository.findById(channelId);
  if (!channel || channel.serverId !== serverId) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
  }
  return channel;
}

/**
 * Resolve a message (non-deleted) and assert its channel belongs to `serverId`.
 */
async function requireMessageInServer(messageId: string, serverId: string) {
  const message = await messageRepository.findByIdWithChannel(messageId);
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
        const messages = await messageRepository.findManyPaginatedWithReactions(
          { channelId, isDeleted: false },
          clampedLimit + 1,
          cursor,
          { createdAt: 'desc' },
        );

        const hasMore = messages.length > clampedLimit;
        const page = hasMore ? messages.slice(0, clampedLimit) : messages;
        const nextCursor = hasMore ? page[page.length - 1].id : null;

        const messagesWithReactions = page.map(msg => ({
          ...msg,
          reactions: groupReactions(msg.reactions),
        }));

        return { messages: messagesWithReactions, nextCursor, hasMore };
      },
      { ttl: CacheTTL.channelMessages },
    );
  },

  /**
   * Send a new message to a channel, optionally with attachment metadata.
   */
  async sendMessage(input: SendMessageInput) {
    const { serverId, channelId, authorId, content, attachments } = input;

    const channel = await requireChannelInServer(channelId, serverId);

    const message = await messageRepository.create({
      channel: { connect: { id: channelId } },
      author: { connect: { id: authorId } },
      content,
      ...(attachments &&
        attachments.length > 0 && {
          attachments: {
            // Cast number → BigInt for Prisma; sizeBytes is excluded from responses
            create: attachments.map((a) => ({ ...a, sizeBytes: BigInt(a.sizeBytes) })),
          },
        }),
    });

    try {
      await cacheService.invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(channelId)}:*`,
      );
    } catch (err) {
      logger.warn({ err, channelId, serverId }, 'Failed to invalidate channel message cache after send');
    }

    eventBus
      .publish(EventChannels.MESSAGE_CREATED, {
        messageId: message.id,
        channelId,
        authorId,
        timestamp: message.createdAt.toISOString(),
      })
      .catch((err) =>
        logger.warn(
          { err, messageId: message.id, channelId, serverId },
          'Failed to publish message created event',
        ),
      );

    // Process @mentions — fire-and-forget, best-effort
    const authorUsername = message.author.username;
    processMentions({
      messageId: message.id,
      channelId,
      serverId,
      authorId,
      authorUsername,
      content,
    }).catch((err) =>
      logger.warn({ err, messageId: message.id }, 'processMentions failed on sendMessage'),
    );
    processBroadcastMentions({
      messageId: message.id,
      channelId,
      serverId,
      authorId,
      authorUsername,
      content,
    }).catch((err) =>
      logger.warn({ err, messageId: message.id }, 'processBroadcastMentions failed on sendMessage'),
    );

    // Dispatch push notifications fire-and-forget
    (async () => {
      try {
        const server = await prisma.server.findUnique({ where: { id: serverId }, select: { slug: true } });
        if (!server) return;

        const ctx = {
          authorId,
          channelId,
          serverId,
          channelName: channel.name,
          authorUsername,
          serverSlug: server.slug,
          channelSlug: channel.slug,
          content,
        };

        await Promise.all([
          pushNotificationService.notifyMentions(ctx),
          pushNotificationService.notifyNewMessage(ctx),
        ]);
      } catch (err) {
        logger.warn({ err, messageId: message.id }, 'Push notification dispatch failed');
      }
    })();

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

    const updated = await messageRepository.update(messageId, { content, editedAt: new Date() });

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(message.channelId)}:*`,
      )
      .catch((err) =>
        logger.warn(
          { err, channelId: message.channelId, serverId },
          'Failed to invalidate channel message cache after edit',
        ),
      );

    eventBus
      .publish(EventChannels.MESSAGE_EDITED, {
        messageId,
        channelId: message.channelId,
        timestamp: updated.editedAt!.toISOString(),
      })
      .catch((err) =>
        logger.warn(
          { err, messageId, channelId: message.channelId, serverId },
          'Failed to publish message edited event',
        ),
      );

    // Re-process mentions on edit; both MessageMention and Notification rows have
    // unique constraints so repeated calls are idempotent — no duplicate notifications.
    processMentions({
      messageId,
      channelId: message.channelId,
      serverId,
      authorId,
      authorUsername: updated.author.username,
      content,
    }).catch((err) =>
      logger.warn({ err, messageId }, 'processMentions failed on editMessage'),
    );
    processBroadcastMentions({
      messageId,
      channelId: message.channelId,
      serverId,
      authorId,
      authorUsername: updated.author.username,
      content,
    }).catch((err) =>
      logger.warn({ err, messageId }, 'processBroadcastMentions failed on editMessage'),
    );

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

    await prisma.$transaction(async (tx) => {
      // Soft-delete the message itself
      await messageRepository.updateRaw(messageId, { isDeleted: true }, tx);

      // If this message is a reply, decrement the parent's replyCount floored at 0.
      // Prisma's { decrement: 1 } maps to raw subtraction with no floor; use
      // GREATEST(..., 0) to guard against negative counts from races or anomalies.
      if (message.parentMessageId) {
        await messageRepository.decrementReplyCountFloored(message.parentMessageId, tx);
      }

      // Cascade soft-delete any non-deleted replies and reset the denormalised counter
      await messageRepository.updateMany(
        { parentMessageId: messageId, isDeleted: false },
        { isDeleted: true },
        tx,
      );
      await messageRepository.updateRaw(messageId, { replyCount: 0 }, tx);
    });

    // If this message is a reply, its thread cache lives under the parent's id.
    // If it's a parent, the thread cache lives under its own id.
    const threadCacheId = message.parentMessageId ?? messageId;

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(message.channelId)}:*`,
      )
      .catch((err) =>
        logger.warn(
          { err, channelId: message.channelId, serverId },
          'Failed to invalidate channel message cache after delete',
        ),
      );
    cacheService
      .invalidatePattern(`thread:msgs:${sanitizeKeySegment(threadCacheId)}:*`)
      .catch((err) =>
        logger.warn({ err, threadCacheId }, 'Failed to invalidate thread cache after delete'),
      );

    eventBus
      .publish(EventChannels.MESSAGE_DELETED, {
        messageId,
        channelId: message.channelId,
        timestamp: new Date().toISOString(),
      })
      .catch((err) =>
        logger.warn(
          { err, messageId, channelId: message.channelId, serverId },
          'Failed to publish message deleted event',
        ),
      );
  },

  /**
   * Pin a message. Requires message:pin (MODERATOR+), checked via router RBAC.
   * Uses a transaction to atomically check-and-set, preventing concurrent
   * double-pin races.
   */
  async pinMessage(messageId: string, serverId: string) {
    const updated = await prisma.$transaction(async (tx) => {
      const msg = await messageRepository.findByIdWithChannel(messageId, tx);

      if (!msg || msg.isDeleted || msg.channel.serverId !== serverId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this server' });
      }
      if (msg.pinned) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Message is already pinned' });
      }

      return messageRepository.update(messageId, { pinned: true, pinnedAt: new Date() }, tx);
    });

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(updated.channelId)}:*`,
      )
      .catch((err) =>
        logger.warn(
          { err, channelId: updated.channelId, serverId },
          'Failed to invalidate channel message cache after pin',
        ),
      );

    return updated;
  },

  /**
   * Unpin a message. Requires message:pin (MODERATOR+), checked via router RBAC.
   * Uses a transaction to atomically check-and-clear.
   */
  async unpinMessage(messageId: string, serverId: string) {
    const updated = await prisma.$transaction(async (tx) => {
      const msg = await messageRepository.findByIdWithChannel(messageId, tx);

      if (!msg || msg.isDeleted || msg.channel.serverId !== serverId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this server' });
      }
      if (!msg.pinned) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Message is not pinned' });
      }

      return messageRepository.update(messageId, { pinned: false, pinnedAt: null }, tx);
    });

    cacheService
      .invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(updated.channelId)}:*`,
      )
      .catch((err) =>
        logger.warn(
          { err, channelId: updated.channelId, serverId },
          'Failed to invalidate channel message cache after unpin',
        ),
      );

    return updated;
  },

  /**
   * Retrieve all pinned messages for a channel in pin order (pinnedAt DESC).
   */
  async getPinnedMessages(channelId: string, serverId: string) {
    await requireChannelInServer(channelId, serverId);
    return messageRepository.findPinnedByChannel(channelId);
  },

  /**
   * Create a reply to an existing, non-deleted message.
   * - Validates the parent belongs to the given channel/server.
   * - Atomically creates the reply and increments parent.replyCount.
   */
  async createReply(input: CreateReplyInput) {
    const { parentMessageId, channelId, serverId, authorId, content } = input;

    await requireChannelInServer(channelId, serverId);

    const reply = await prisma.$transaction(async (tx) => {
      const parent = await messageRepository.findByIdWithChannelFull(parentMessageId, tx);

      if (
        !parent ||
        parent.isDeleted ||
        parent.channel.id !== channelId ||
        parent.channel.serverId !== serverId
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Parent message not found in this channel',
        });
      }

      // Replies cannot themselves be parents (one level of threading)
      if (parent.parentMessageId !== null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot reply to a reply — only top-level messages can be threaded',
        });
      }

      const created = await messageRepository.create(
        {
          channel: { connect: { id: channelId } },
          author: { connect: { id: authorId } },
          content,
          parent: { connect: { id: parentMessageId } },
        },
        tx,
      );

      await messageRepository.updateRaw(
        parentMessageId,
        { replyCount: { increment: 1 } },
        tx,
      );

      return created;
    });

    // Invalidate channel-level and thread-level caches
    try {
      await cacheService.invalidatePattern(
        `channel:msgs:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(channelId)}:*`,
      );
    } catch (err) {
      logger.warn({ err, channelId, serverId }, 'Failed to invalidate channel message cache after reply');
    }
    try {
      await cacheService.invalidatePattern(`thread:msgs:${sanitizeKeySegment(parentMessageId)}:*`);
    } catch (err) {
      logger.warn({ err, parentMessageId }, 'Failed to invalidate thread cache after reply');
    }

    eventBus
      .publish(EventChannels.MESSAGE_CREATED, {
        messageId: reply.id,
        channelId,
        authorId,
        parentMessageId,
        timestamp: reply.createdAt.toISOString(),
      })
      .catch((err) =>
        logger.warn(
          { err, messageId: reply.id, channelId, serverId },
          'Failed to publish reply created event',
        ),
      );

    processMentions({
      messageId: reply.id,
      channelId,
      serverId,
      authorId,
      authorUsername: reply.author.username,
      content,
    }).catch((err) =>
      logger.warn({ err, messageId: reply.id }, 'processMentions failed on createReply'),
    );
    processBroadcastMentions({
      messageId: reply.id,
      channelId,
      serverId,
      authorId,
      authorUsername: reply.author.username,
      content,
    }).catch((err) =>
      logger.warn({ err, messageId: reply.id }, 'processBroadcastMentions failed on createReply'),
    );

    return reply;
  },

  /**
   * Retrieve paginated replies for a parent message, ordered chronologically (ASC).
   */
  async getThreadMessages(input: GetThreadMessagesInput) {
    const { parentMessageId, channelId, serverId, cursor, limit = 20 } = input;
    const clampedLimit = Math.min(Math.max(1, limit), 100);

    await requireChannelInServer(channelId, serverId);

    const cacheKey =
      `thread:msgs:${sanitizeKeySegment(parentMessageId)}` +
      `:cursor:${sanitizeKeySegment(cursor ?? 'start')}:limit:${clampedLimit}`;

    return cacheService.getOrRevalidate(
      cacheKey,
      async () => {
        // Validate the parent on every cache miss. This costs a serial DB round-trip,
        // but it is sound: deleteMessage invalidates `thread:msgs:<messageId>:*`, so a
        // soft-deleted parent's cache entries are always busted before this guard could
        // serve a stale thread. The check is therefore redundant in the happy path and
        // only fires for genuinely invalid requests.
        const parent = await messageRepository.findByIdWithChannelFull(parentMessageId);

        if (
          !parent ||
          parent.isDeleted ||
          parent.channel.id !== channelId ||
          parent.channel.serverId !== serverId
        ) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Parent message not found in this channel',
          });
        }

        // Enforce one-level threading: only top-level messages have threads
        if (parent.parentMessageId !== null) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot fetch thread for a reply — only top-level messages have threads',
          });
        }

        const replies = await messageRepository.findManyPaginated(
          { parentMessageId, isDeleted: false },
          clampedLimit + 1,
          cursor,
          { createdAt: 'asc' },
        );

        const hasMore = replies.length > clampedLimit;
        const page = hasMore ? replies.slice(0, clampedLimit) : replies;
        const nextCursor = hasMore ? page[page.length - 1].id : null;

        return { replies: page, nextCursor, hasMore };
      },
      { ttl: CacheTTL.channelMessages },
    );
  },
};
