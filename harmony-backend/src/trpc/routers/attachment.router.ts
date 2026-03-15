import { z } from 'zod';
import { router, withPermission } from '../init';
import { attachmentService } from '../../services/attachment.service';

export const attachmentRouter = router({
  /**
   * List all attachments for a message.
   * Requires message:read (GUEST+) scoped to the server.
   */
  listByMessage: withPermission('message:read')
    .input(
      z.object({
        serverId: z.string().uuid(),
        messageId: z.string().uuid(),
      }),
    )
    .query(({ input }) => attachmentService.listByMessage(input.messageId)),
});
