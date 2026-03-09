import { z } from 'zod';
import { router, withPermission } from '../init';
import { messageService } from '../../services/message.service';

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
        content: z.string().min(1).max(4000),
        attachments: z.array(AttachmentInputSchema).max(10).optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      messageService.sendMessage({
        serverId: input.serverId,
        channelId: input.channelId,
        authorId: ctx.userId,
        content: input.content,
        attachments: input.attachments,
      }),
    ),

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
});
