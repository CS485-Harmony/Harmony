import { z } from 'zod';
import { router, withPermission } from '../init';
import { channelMemberService } from '../../services/channelMember.service';

export const channelMemberRouter = router({
  /** List explicit members of a channel. Admin+ only. */
  getMembers: withPermission('channel:manage_members')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .query(({ input }) => channelMemberService.getChannelMembers(input.channelId, input.serverId)),

  /** Add a server member to a private channel. Admin+ only. */
  addMember: withPermission('channel:manage_members')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        userId: z.string().uuid(),
      }),
    )
    .mutation(({ input }) =>
      channelMemberService.addMember(input.channelId, input.serverId, input.userId),
    ),

  /** Remove a user from a channel's explicit member list. Admin+ only. */
  removeMember: withPermission('channel:manage_members')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        userId: z.string().uuid(),
      }),
    )
    .mutation(({ input }) =>
      channelMemberService.removeMember(input.channelId, input.serverId, input.userId),
    ),
});
