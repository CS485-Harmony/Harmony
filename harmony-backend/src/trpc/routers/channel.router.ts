import { z } from 'zod';
import { router, withPermission } from '../init';
import { channelService } from '../../services/channel.service';
import { visibilityService } from '../../services/visibility.service';
import { auditLogService } from '../../services/auditLog.service';

const ChannelTypeSchema = z.enum(['TEXT', 'VOICE', 'ANNOUNCEMENT']);
const ChannelVisibilitySchema = z.enum(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);

export const channelRouter = router({
  /** Requires server membership (server:read) — prevents leaking channel metadata to non-members. */
  getChannels: withPermission('server:read')
    .input(z.object({ serverId: z.string().uuid() }))
    .query(({ input }) => channelService.getChannels(input.serverId)),

  /** Requires channel:read — prevents leaking PRIVATE channel metadata to non-members. */
  getChannel: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), serverSlug: z.string(), channelSlug: z.string() }))
    .query(({ input }) => channelService.getChannelBySlug(input.serverSlug, input.channelSlug)),

  createChannel: withPermission('channel:create')
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

  updateChannel: withPermission('channel:update')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        topic: z.string().optional(),
        position: z.number().int().min(0).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { channelId, serverId, ...patch } = input;
      return channelService.updateChannel(channelId, serverId, patch);
    }),

  deleteChannel: withPermission('channel:delete')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .mutation(({ input }) =>
      channelService.deleteChannel(input.channelId, input.serverId),
    ),

  /** Change a channel's visibility. Requires channel:manage_visibility (admin+). */
  setVisibility: withPermission('channel:manage_visibility')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        visibility: ChannelVisibilitySchema,
      }),
    )
    .mutation(({ input, ctx }) =>
      visibilityService.setVisibility({
        channelId: input.channelId,
        serverId: input.serverId,
        visibility: input.visibility,
        actorId: ctx.userId,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      }),
    ),

  /** Read a channel's visibility. Requires channel:read with serverId. */
  getVisibility: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .query(({ input }) => visibilityService.getVisibility(input.channelId, input.serverId)),

  /**
   * Retrieve paginated visibility audit log for a channel.
   * Requires channel:manage_visibility (admin+) because audit rows contain
   * sensitive per-actor metadata (ipAddress, userAgent).
   * Uses serverId to verify the channel belongs to the caller's server.
   */
  getAuditLog: withPermission('channel:manage_visibility')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        limit: z.number().int().min(1).max(100).optional(),
        offset: z.number().int().min(0).optional(),
        startDate: z.string().datetime().optional(),
      }),
    )
    .query(async ({ input }) => {
      // withPermission validates the caller has admin rights in `serverId`, but does NOT
      // verify that `channelId` belongs to that server. Without this check, an admin of
      // server A could supply a channelId from server B and read its audit data.
      await visibilityService.getVisibility(input.channelId, input.serverId);
      return auditLogService.getVisibilityAuditLog(input.channelId, {
        limit: input.limit,
        offset: input.offset,
        startDate: input.startDate !== undefined ? new Date(input.startDate) : undefined,
      });
    }),
});
