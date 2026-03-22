import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, withPermission } from '../init';
import { attachmentService, AttachmentNotFoundError } from '../../services/attachment.service';

export const attachmentRouter = router({
  /**
   * List all attachments for a message.
   * Requires message:read (GUEST+) scoped to the server.
   * Maps AttachmentNotFoundError (plain domain error) to TRPCError NOT_FOUND.
   */
  listByMessage: withPermission('message:read')
    .input(
      z.object({
        serverId: z.string().uuid(),
        messageId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      try {
        return await attachmentService.listByMessage(input.messageId, input.serverId);
      } catch (err) {
        if (err instanceof AttachmentNotFoundError) {
          throw new TRPCError({ code: 'NOT_FOUND', message: err.message });
        }
        throw err;
      }
    }),
});
