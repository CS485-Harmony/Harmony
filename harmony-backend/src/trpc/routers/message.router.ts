import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, withPermission } from '../init';
import { messageService } from '../../services/message.service';

/**
 * Returns the base URL that all attachment URLs must start with.
 * Computed from STORAGE_PROVIDER and the corresponding base URL env var.
 * Returns null when the base URL is not configured (skips validation).
 */
function getAllowedAttachmentBase(): string | null {
  if (process.env.STORAGE_PROVIDER === 's3') {
    return process.env.R2_PUBLIC_URL ?? null;
  }
  return process.env.LOCAL_UPLOAD_BASE_URL ?? 'http://localhost:4000';
}

/**
 * Reject prefix-stripping tricks (e.g. https://allowed.example.com.evil/...) by
 * comparing URL origins and, when the allowlist has a path, requiring a path prefix.
 */
function isAllowedAttachmentUrl(attUrl: string, allowedBase: string): boolean {
  let allowed: URL;
  let candidate: URL;
  try {
    allowed = new URL(allowedBase);
    candidate = new URL(attUrl);
  } catch {
    return false;
  }
  if (candidate.origin !== allowed.origin) {
    return false;
  }
  const basePath = allowed.pathname.replace(/\/$/, '') || '';
  if (!basePath) {
    return true;
  }
  const p = candidate.pathname;
  return p === basePath || p.startsWith(`${basePath}/`);
}

// sizeBytes is accepted as a plain number (JSON-safe).
// The service layer casts it to BigInt before writing to Prisma.
const AttachmentInputSchema = z.object({
  filename: z.string().min(1).max(255),
  url: z.string().url().max(500),
  contentType: z.string().min(1).max(100),
  sizeBytes: z.number().int().positive(),
});

export const messageRouter = router({
  /** Fetch a page of messages for a channel. Requires channel membership (message:read). */
  getMessages: withPermission('message:read')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        cursor: z.string().uuid().optional(),
        limit: z.number().int().min(1).max(100).default(20),
      }),
    )
    .query(({ input }) =>
      messageService.getMessages({
        serverId: input.serverId,
        channelId: input.channelId,
        cursor: input.cursor,
        limit: input.limit,
      }),
    ),

  /** Send a message to a channel. Requires message:create (MEMBER+). */
  sendMessage: withPermission('message:create')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        content: z.string().max(4000),
        attachments: z.array(AttachmentInputSchema).max(10).optional(),
      }).refine(
        data => data.content.trim().length > 0 || (data.attachments?.length ?? 0) > 0,
        { message: 'Message must have content or at least one attachment.' },
      ),
    )
    .mutation(({ input, ctx }) => {
      if (input.attachments?.length) {
        const allowedBase = getAllowedAttachmentBase();
        if (allowedBase) {
          for (const att of input.attachments) {
            if (!isAllowedAttachmentUrl(att.url, allowedBase)) {
              throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid attachment URL' });
            }
          }
        }
      }
      return messageService.sendMessage({
        serverId: input.serverId,
        channelId: input.channelId,
        authorId: ctx.userId,
        content: input.content,
        attachments: input.attachments,
      });
    }),

  /**
   * Edit the content of a message the caller authored.
   * Gated on message:update_own; ownership is enforced in the service layer.
   */
  editMessage: withPermission('message:update_own')
    .input(
      z.object({
        serverId: z.string().uuid(),
        messageId: z.string().uuid(),
        content: z.string().min(1).max(4000),
      }),
    )
    .mutation(({ input, ctx }) =>
      messageService.editMessage({
        serverId: input.serverId,
        messageId: input.messageId,
        authorId: ctx.userId,
        content: input.content,
      }),
    ),

  /**
   * Soft-delete a message.
   * Gated on message:delete_own (MEMBER+). The service additionally checks
   * message:delete_any when the caller is not the message author.
   */
  deleteMessage: withPermission('message:delete_own')
    .input(
      z.object({
        serverId: z.string().uuid(),
        messageId: z.string().uuid(),
      }),
    )
    .mutation(({ input, ctx }) =>
      messageService.deleteMessage({
        messageId: input.messageId,
        actorId: ctx.userId,
        serverId: input.serverId,
      }),
    ),

  /** Pin a message. Requires message:pin (MODERATOR+). */
  pinMessage: withPermission('message:pin')
    .input(
      z.object({
        serverId: z.string().uuid(),
        messageId: z.string().uuid(),
      }),
    )
    .mutation(({ input }) => messageService.pinMessage(input.messageId, input.serverId)),

  /** Unpin a message. Requires message:pin (MODERATOR+). */
  unpinMessage: withPermission('message:pin')
    .input(
      z.object({
        serverId: z.string().uuid(),
        messageId: z.string().uuid(),
      }),
    )
    .mutation(({ input }) => messageService.unpinMessage(input.messageId, input.serverId)),

  /** Get all pinned messages for a channel. Requires message:read (GUEST+). */
  getPinnedMessages: withPermission('message:read')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
      }),
    )
    .query(({ input }) => messageService.getPinnedMessages(input.channelId, input.serverId)),

  /** Reply to a message. Requires message:create (MEMBER+). */
  createReply: withPermission('message:create')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        parentMessageId: z.string().uuid(),
        content: z.string().min(1).max(4000),
      }),
    )
    .mutation(({ input, ctx }) =>
      messageService.createReply({
        parentMessageId: input.parentMessageId,
        channelId: input.channelId,
        serverId: input.serverId,
        authorId: ctx.userId,
        content: input.content,
      }),
    ),

  /** Get paginated replies for a message thread. Requires message:read (GUEST+). */
  getThreadMessages: withPermission('message:read')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        parentMessageId: z.string().uuid(),
        cursor: z.string().uuid().optional(),
        limit: z.number().int().min(1).max(100).default(20),
      }),
    )
    .query(({ input }) =>
      messageService.getThreadMessages({
        parentMessageId: input.parentMessageId,
        channelId: input.channelId,
        serverId: input.serverId,
        cursor: input.cursor,
        limit: input.limit,
      }),
    ),
});
