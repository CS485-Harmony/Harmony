import { z } from 'zod';
import { NotificationLevel } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { router, authedProcedure } from '../init';
import { prisma } from '../../db/prisma';
import { notificationService } from '../../services/notification.service';

const NotificationLevelSchema = z.nativeEnum(NotificationLevel);

/** Upsert helper for nullable-field compound unique constraints. */
async function upsertPref(
  userId: string,
  serverId: string | null,
  channelId: string | null,
  level: NotificationLevel,
) {
  const existing = await prisma.notificationPreference.findFirst({
    where: { userId, serverId: serverId ?? null, channelId: channelId ?? null },
  });
  if (existing) {
    return prisma.notificationPreference.update({ where: { id: existing.id }, data: { level } });
  }
  return prisma.notificationPreference.create({
    data: { userId, serverId, channelId, level },
  });
}

export const notificationRouter = router({
  // ─── In-app mention notifications ───────────────────────────────────────────

  /** List the 50 most-recent notifications for the authenticated user. */
  getNotifications: authedProcedure.query(({ ctx }) =>
    notificationService.getNotifications(ctx.userId),
  ),

  /** Count of unread notifications. */
  getUnreadCount: authedProcedure.query(({ ctx }) =>
    notificationService.getUnreadCount(ctx.userId),
  ),

  /** Mark a single notification as read. */
  markAsRead: authedProcedure
    .input(z.object({ notificationId: z.string().uuid() }))
    .mutation(({ ctx, input }) =>
      notificationService.markAsRead(input.notificationId, ctx.userId),
    ),

  /** Mark all notifications as read. */
  markAllAsRead: authedProcedure.mutation(({ ctx }) =>
    notificationService.markAllAsRead(ctx.userId),
  ),

  /** Mark all unread notifications in a channel as read. */
  markChannelAsRead: authedProcedure
    .input(z.object({ channelId: z.string().uuid() }))
    .mutation(({ ctx, input }) =>
      notificationService.markChannelAsRead(input.channelId, ctx.userId),
    ),

  // ─── Web Push subscriptions ─────────────────────────────────────────────────

  /** Return the VAPID public key so the frontend can subscribe. */
  getVapidPublicKey: authedProcedure.query(() => {
    const key = process.env.VAPID_PUBLIC_KEY;
    if (!key) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Push notifications not configured' });
    }
    return { vapidPublicKey: key };
  }),

  /** Register a Web Push subscription for the current user. */
  subscribe: authedProcedure
    .input(
      z.object({
        endpoint: z.string().url().max(2048),
        p256dh: z.string().max(512),
        auth: z.string().max(128),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.pushSubscription.upsert({
        where: { endpoint: input.endpoint },
        update: { p256dh: input.p256dh, auth: input.auth, userId: ctx.userId! },
        create: { userId: ctx.userId!, ...input },
      });
      return { success: true };
    }),

  /** Remove a push subscription (e.g., when the user disables notifications). */
  unsubscribe: authedProcedure
    .input(z.object({ endpoint: z.string().url().max(2048) }))
    .mutation(async ({ ctx, input }) => {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: input.endpoint, userId: ctx.userId! },
      });
      return { success: true };
    }),

  /** List all push subscriptions for the current user. */
  listSubscriptions: authedProcedure.query(async ({ ctx }) => {
    return prisma.pushSubscription.findMany({
      where: { userId: ctx.userId! },
      select: { id: true, endpoint: true, createdAt: true },
    });
  }),

  // ─── Notification preferences ────────────────────────────────────────────────

  /** Get notification preferences for the current user. */
  getPreferences: authedProcedure.query(async ({ ctx }) => {
    return prisma.notificationPreference.findMany({
      where: { userId: ctx.userId! },
    });
  }),

  /** Set the global notification level (no server or channel scope). */
  setGlobalLevel: authedProcedure
    .input(z.object({ level: NotificationLevelSchema }))
    .mutation(async ({ ctx, input }) => {
      return upsertPref(ctx.userId!, null, null, input.level);
    }),

  /** Set notification level for a server (overrides global). */
  setServerLevel: authedProcedure
    .input(z.object({ serverId: z.string().uuid(), level: NotificationLevelSchema }))
    .mutation(async ({ ctx, input }) => {
      const member = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: ctx.userId!, serverId: input.serverId } },
      });
      if (!member) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this server' });
      }
      return upsertPref(ctx.userId!, input.serverId, null, input.level);
    }),

  /** Set notification level for a channel (overrides server & global). */
  setChannelLevel: authedProcedure
    .input(
      z.object({
        channelId: z.string().uuid(),
        serverId: z.string().uuid(),
        level: NotificationLevelSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const member = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: ctx.userId!, serverId: input.serverId } },
      });
      if (!member) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not a member of this server' });
      }
      return upsertPref(ctx.userId!, input.serverId, input.channelId, input.level);
    }),
});
