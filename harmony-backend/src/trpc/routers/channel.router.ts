import { z } from 'zod';
import { router, authedProcedure } from '../init';
import { channelService } from '../../services/channel.service';

const ChannelTypeSchema = z.enum(['TEXT', 'VOICE', 'ANNOUNCEMENT']);
const ChannelVisibilitySchema = z.enum(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);

export const channelRouter = router({
  getChannels: authedProcedure
    .input(z.object({ serverId: z.string().uuid() }))
    .query(({ input }) => channelService.getChannels(input.serverId)),

  getChannel: authedProcedure
    .input(z.object({ serverSlug: z.string(), channelSlug: z.string() }))
    .query(({ input }) => channelService.getChannelBySlug(input.serverSlug, input.channelSlug)),

  createChannel: authedProcedure
    .input(
      z.object({
        serverId: z.string().uuid(),
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        type: ChannelTypeSchema.default('TEXT'),
        visibility: ChannelVisibilitySchema.default('PRIVATE'),
        topic: z.string().optional(),
        position: z.number().int().min(0).optional(),
      }),
    )
    .mutation(({ input }) => channelService.createChannel(input)),

  updateChannel: authedProcedure
    .input(
      z.object({
        channelId: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        topic: z.string().optional(),
        position: z.number().int().min(0).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { channelId, ...patch } = input;
      return channelService.updateChannel(channelId, patch);
    }),

  deleteChannel: authedProcedure
    .input(z.object({ channelId: z.string().uuid() }))
    .mutation(({ input }) => channelService.deleteChannel(input.channelId)),
});
