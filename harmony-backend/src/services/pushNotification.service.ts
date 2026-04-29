import webpush from 'web-push';
import { prisma } from '../db/prisma';
import { createLogger } from '../lib/logger';
import { NotificationLevel } from '@prisma/client';

const logger = createLogger({ component: 'push-notification-service' });

// Lazily initialise VAPID so the service can be imported even without keys set
// (e.g. in test environments).
let vapidReady = false;

function ensureVapid() {
  if (vapidReady) return;
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
    logger.warn('VAPID env vars not set — push notifications disabled');
    return;
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  vapidReady = true;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

// ─── Mention parsing ──────────────────────────────────────────────────────────

/** Extract @username handles from message content. */
export function parseMentionedUsernames(content: string): string[] {
  const matches = content.match(/@([a-zA-Z0-9_]{1,32})/g) ?? [];
  return [...new Set(matches.map((m) => m.slice(1)))];
}

// ─── Notification level resolution ───────────────────────────────────────────

/**
 * Resolve the effective notification level for a user in a channel.
 * Priority: channel pref > server pref > global default (MENTIONS).
 */
async function resolveLevel(
  userId: string,
  channelId: string,
  serverId: string,
): Promise<NotificationLevel> {
  const prefs = await prisma.notificationPreference.findMany({
    where: {
      userId,
      OR: [
        { channelId },
        { serverId, channelId: null },
        { serverId: null, channelId: null },
      ],
    },
  });

  const channelPref = prefs.find((p) => p.channelId === channelId);
  if (channelPref) return channelPref.level;

  const serverPref = prefs.find((p) => p.serverId === serverId && p.channelId === null);
  if (serverPref) return serverPref.level;

  const globalPref = prefs.find((p) => p.serverId === null && p.channelId === null);
  if (globalPref) return globalPref.level;

  return NotificationLevel.MENTIONS; // system default
}

// ─── Core send ────────────────────────────────────────────────────────────────

async function sendToUser(userId: string, payload: PushPayload): Promise<void> {
  ensureVapid();
  if (!vapidReady) return;

  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  if (subs.length === 0) return;

  const body = JSON.stringify(payload);

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body,
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          // Subscription is gone — clean it up
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          logger.warn({ err, userId, endpoint: sub.endpoint }, 'Failed to send push notification');
        }
      }
    }),
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const pushNotificationService = {
  /**
   * Notify users who are mentioned in a message.
   * Does not notify the author themselves.
   */
  async notifyMentions(opts: {
    content: string;
    authorId: string;
    channelId: string;
    serverId: string;
    channelName: string;
    authorUsername: string;
    serverSlug: string;
    channelSlug: string;
  }): Promise<void> {
    const { content, authorId, channelId, serverId, channelName, authorUsername, serverSlug, channelSlug } = opts;
    const usernames = parseMentionedUsernames(content);
    if (usernames.length === 0) return;

    const mentionedUsers = await prisma.user.findMany({
      where: { username: { in: usernames } },
      select: { id: true, username: true },
    });

    const targets = mentionedUsers.filter((u) => u.id !== authorId);
    if (targets.length === 0) return;

    const frontendBase = process.env.BASE_URL ?? '';

    await Promise.allSettled(
      targets.map(async (target) => {
        const level = await resolveLevel(target.id, channelId, serverId);
        if (level === NotificationLevel.NONE) return;

        await sendToUser(target.id, {
          title: `${authorUsername} mentioned you in #${channelName}`,
          body: content.length > 120 ? content.slice(0, 117) + '…' : content,
          tag: `mention:${channelId}`,
          data: {
            url: `${frontendBase}/c/${serverSlug}/${channelSlug}`,
            channelId,
            serverId,
          },
        });
      }),
    );
  },

  /**
   * Notify server members about a new message (for channels set to ALL level).
   * Skips the author and handles DMs (no serverId lookup needed if caller passes members).
   */
  async notifyNewMessage(opts: {
    authorId: string;
    channelId: string;
    serverId: string;
    channelName: string;
    authorUsername: string;
    content: string;
    serverSlug: string;
    channelSlug: string;
  }): Promise<void> {
    const { authorId, channelId, serverId, channelName, authorUsername, content, serverSlug, channelSlug } = opts;

    // Only notify members who have push subscriptions to avoid unnecessary DB work
    const subscribedMembers = await prisma.serverMember.findMany({
      where: {
        serverId,
        userId: { not: authorId },
        user: { pushSubscriptions: { some: {} } },
      },
      select: { userId: true },
    });

    if (subscribedMembers.length === 0) return;

    const frontendBase = process.env.BASE_URL ?? '';
    const preview = content.length > 120 ? content.slice(0, 117) + '…' : content;

    await Promise.allSettled(
      subscribedMembers.map(async ({ userId }) => {
        const level = await resolveLevel(userId, channelId, serverId);
        if (level !== NotificationLevel.ALL) return;

        await sendToUser(userId, {
          title: `#${channelName}`,
          body: `${authorUsername}: ${preview}`,
          tag: `msg:${channelId}`,
          data: {
            url: `${frontendBase}/c/${serverSlug}/${channelSlug}`,
            channelId,
            serverId,
          },
        });
      }),
    );
  },
};
