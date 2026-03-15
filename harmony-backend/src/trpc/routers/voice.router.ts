import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { ChannelType } from '@prisma/client';
import { router, withPermission } from '../init';
import { voiceService, participantsKey } from '../../services/voice.service';
import { prisma } from '../../db/prisma';
import { redis } from '../../db/redis';

/**
 * Resolve a channel and assert it belongs to the given server and is a VOICE
 * channel. Used by all voice procedures to prevent cross-server authorization
 * bypass (a member of Server A passing a channelId from Server B).
 *
 * Throws NOT_FOUND if the channel doesn't exist or belongs to a different server.
 * Throws BAD_REQUEST if the channel is not a VOICE channel.
 */
async function requireVoiceChannel(channelId: string, serverId: string) {
  const channel = await prisma.channel.findUnique({ where: { id: channelId } });
  if (!channel || channel.serverId !== serverId) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
  }
  if (channel.type !== ChannelType.VOICE) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Channel is not a voice channel' });
  }
  return channel;
}

export const voiceRouter = router({
  /**
   * Join a voice channel. Returns the Twilio access token and the current
   * participant list so the client can render existing participants immediately.
   *
   * Requires channel:read (server membership) to prevent unauthenticated or
   * non-member users from obtaining a Twilio room token for private channels.
   * Also verifies channelId belongs to serverId to prevent cross-server bypass.
   */
  join: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await requireVoiceChannel(input.channelId, input.serverId);
      return voiceService.join(ctx.userId, input.channelId);
    }),

  /**
   * Leave a voice channel. The service removes the user from Redis and
   * publishes a USER_LEFT_VOICE event. If no participants remain, the
   * Twilio room is destroyed (no-op in mock mode).
   *
   * Requires channel:read and verifies channelId belongs to serverId.
   */
  leave: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await requireVoiceChannel(input.channelId, input.serverId);

      // Guard against spurious USER_LEFT_VOICE events from non-participants.
      // Callers who are not in the channel get an idempotent no-op rather than
      // triggering a leave event or unnecessary Twilio room destruction.
      const isMember = await redis.sismember(participantsKey(input.channelId), ctx.userId);
      if (!isMember) {
        return { success: true as const };
      }

      await voiceService.leave(ctx.userId, input.channelId);
      return { success: true as const };
    }),

  /**
   * Update muted / deafened state for the calling user. Publishes
   * VOICE_STATE_CHANGED so connected clients can reflect the new state.
   *
   * Three-layer guard:
   *  1. withPermission('channel:read') — caller must be a server member.
   *  2. requireVoiceChannel — channelId must belong to serverId (cross-server check).
   *  3. sismember check — caller must currently be in the voice channel's
   *     Redis participant set to prevent writing state for channels never joined.
   *     Uses the exported participantsKey helper to guarantee key consistency
   *     with the service layer's own sanitization.
   */
  updateState: withPermission('channel:read')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        muted: z.boolean(),
        deafened: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await requireVoiceChannel(input.channelId, input.serverId);

      const isMember = await redis.sismember(participantsKey(input.channelId), ctx.userId);
      if (!isMember) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not in this voice channel' });
      }

      await voiceService.updateState(ctx.userId, input.channelId, {
        muted: input.muted,
        deafened: input.deafened,
      });
      return { success: true as const };
    }),

  /**
   * Return the current participant list for a channel, including each
   * participant's mute / deafen state from Redis.
   *
   * Requires channel:read and verifies channelId belongs to serverId to
   * prevent cross-server presence enumeration.
   */
  getParticipants: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .query(async ({ input }) => {
      await requireVoiceChannel(input.channelId, input.serverId);
      return voiceService.getParticipants(input.channelId);
    }),
});
