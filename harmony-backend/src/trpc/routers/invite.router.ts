import { z } from 'zod';
import { router, authedProcedure, withPermission } from '../init';
import { inviteService } from '../../services/invite.service';

export const inviteRouter = router({
  /** Generate a new invite code for a server. Requires server:manage_members. */
  generate: withPermission('server:manage_members')
    .input(
      z.object({
        serverId: z.string().uuid(),
        maxUses: z.number().int().positive().optional(),
        expiresAt: z.string().datetime().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return inviteService.generate(input.serverId, ctx.userId, {
        maxUses: input.maxUses,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
      });
    }),

  /** List all invite codes for a server. Requires server:manage_members. */
  list: withPermission('server:manage_members')
    .input(z.object({ serverId: z.string().uuid() }))
    .query(async ({ input }) => {
      return inviteService.list(input.serverId);
    }),

  /** Delete an invite code. Requires server:manage_members. */
  delete: withPermission('server:manage_members')
    .input(z.object({ serverId: z.string().uuid(), inviteId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await inviteService.delete(input.inviteId, input.serverId, ctx.userId);
      return { success: true };
    }),

  /** Redeem an invite code and join the server. Any authenticated user. */
  redeem: authedProcedure
    .input(z.object({ code: z.string().min(1).max(16) }))
    .mutation(async ({ input, ctx }) => {
      return inviteService.redeem(input.code, ctx.userId);
    }),
});
