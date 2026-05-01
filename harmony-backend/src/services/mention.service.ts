import { UserStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';
import { eventBus, EventChannels } from '../events/eventBus';
import { createLogger } from '../lib/logger';

const logger = createLogger({ component: 'mention-service' });

/** Broadcast mention tokens that target a group rather than a specific user. */
export const BROADCAST_MENTIONS = ['everyone', 'here'] as const;
export type BroadcastMention = (typeof BROADCAST_MENTIONS)[number];

/**
 * Parse @username tokens from message content and return unique lowercase usernames.
 * Broadcast tokens (@everyone, @here) are excluded — they are handled separately.
 * A fresh RegExp is created per call so `lastIndex` state never bleeds between calls.
 */
export function extractMentionedUsernames(content: string): string[] {
  const names = new Set<string>();
  const broadcastSet = new Set<string>(BROADCAST_MENTIONS);
  for (const m of content.matchAll(/@([a-zA-Z0-9_-]{1,32})/g)) {
    const name = m[1].toLowerCase();
    if (!broadcastSet.has(name)) {
      names.add(name);
    }
  }
  return [...names];
}

/**
 * Detect which broadcast mention tokens (@everyone, @here) appear in content.
 * Returns at most one entry per token type regardless of repetition.
 */
export function extractBroadcastMentions(content: string): BroadcastMention[] {
  const found = new Set<BroadcastMention>();
  for (const m of content.matchAll(/@(everyone|here)\b/gi)) {
    found.add(m[1].toLowerCase() as BroadcastMention);
  }
  return [...found];
}

/**
 * After a message is created or edited, resolve mentioned usernames to server members,
 * persist MessageMention + Notification records, and fire USER_MENTIONED events.
 *
 * Idempotent: both MessageMention and Notification rows have unique constraints on
 * (messageId, userId) and (userId, type, messageId) respectively, so repeated calls
 * (e.g. on edit) silently skip already-notified users.
 *
 * Failures are logged but never thrown — mention creation is best-effort and must
 * not block message delivery.
 */
export async function processMentions(params: {
  messageId: string;
  channelId: string;
  serverId: string;
  authorId: string;
  authorUsername: string;
  content: string;
}): Promise<void> {
  const { messageId, channelId, serverId, authorId, authorUsername, content } = params;

  const usernames = extractMentionedUsernames(content);
  if (usernames.length === 0) return;

  try {
    // Resolve usernames to users who are also members of this server.
    // Skip the author — no self-mention notifications.
    const members = await prisma.serverMember.findMany({
      where: {
        serverId,
        user: {
          username: { in: usernames, mode: 'insensitive' },
          id: { not: authorId },
        },
      },
      select: {
        userId: true,
        user: { select: { username: true } },
      },
    });

    if (members.length === 0) return;

    const now = new Date();

    // Upsert mentions — unique on (messageId, userId), skips duplicates on edits.
    await prisma.messageMention.createMany({
      data: members.map((m) => ({ messageId, userId: m.userId })),
      skipDuplicates: true,
    });

    // Upsert notifications — unique on (userId, type, messageId), skips duplicates
    // on edits so the same user is never notified twice for the same message.
    const notificationData = members.map((m) => ({
      userId: m.userId,
      type: 'mention',
      messageId,
      channelId,
      serverId,
      createdAt: now,
    }));

    await prisma.notification.createMany({
      data: notificationData,
      skipDuplicates: true,
    });

    // Fetch the newly created notifications so we have their IDs for SSE events.
    // Only fire events for notifications that were just inserted (skipped duplicates
    // already had events fired on first creation).
    const inserted = await prisma.notification.findMany({
      where: {
        userId: { in: members.map((m) => m.userId) },
        type: 'mention',
        messageId,
        createdAt: now,
      },
      select: { id: true, userId: true },
    });

    // Fire real-time events — fire-and-forget
    for (const notif of inserted) {
      eventBus
        .publish(EventChannels.USER_MENTIONED, {
          notificationId: notif.id,
          userId: notif.userId,
          messageId,
          channelId,
          serverId,
          authorId,
          authorUsername,
          timestamp: now.toISOString(),
        })
        .catch((err) =>
          logger.warn({ err, userId: notif.userId, messageId }, 'Failed to publish USER_MENTIONED'),
        );
    }
  } catch (err) {
    logger.warn({ err, messageId, serverId }, 'Failed to process mentions');
  }
}

/**
 * Fan out notifications for @everyone and @here broadcast mentions.
 *
 * - @everyone: all server members who are not the author.
 * - @here:     only server members whose status is ONLINE or IDLE at send time.
 *
 * If both tokens appear in the same message, each eligible user receives at
 * most one notification (de-duplicated by the unique constraint on Notification).
 *
 * Best-effort: failures are logged but never thrown.
 */
export async function processBroadcastMentions(params: {
  messageId: string;
  channelId: string;
  serverId: string;
  authorId: string;
  authorUsername: string;
  content: string;
}): Promise<void> {
  const { messageId, channelId, serverId, authorId, authorUsername, content } = params;

  const broadcastTokens = extractBroadcastMentions(content);
  if (broadcastTokens.length === 0) return;

  const hasEveryone = broadcastTokens.includes('everyone');

  try {
    // Build the status filter: @here → ONLINE/IDLE, @everyone → any status.
    const statusFilter: Prisma.ServerMemberWhereInput = hasEveryone
      ? {}
      : { user: { status: { in: [UserStatus.ONLINE, UserStatus.IDLE] } } };

    const members = await prisma.serverMember.findMany({
      where: {
        serverId,
        userId: { not: authorId },
        ...statusFilter,
      },
      select: { userId: true },
    });

    if (members.length === 0) return;

    const now = new Date();

    await prisma.messageMention.createMany({
      data: members.map((m) => ({ messageId, userId: m.userId })),
      skipDuplicates: true,
    });

    await prisma.notification.createMany({
      data: members.map((m) => ({
        userId: m.userId,
        type: hasEveryone ? 'mention_everyone' : 'mention_here',
        messageId,
        channelId,
        serverId,
        createdAt: now,
      })),
      skipDuplicates: true,
    });

    const inserted = await prisma.notification.findMany({
      where: {
        userId: { in: members.map((m) => m.userId) },
        type: { in: ['mention_everyone', 'mention_here'] },
        messageId,
        createdAt: now,
      },
      select: { id: true, userId: true },
    });

    for (const notif of inserted) {
      eventBus
        .publish(EventChannels.USER_MENTIONED, {
          notificationId: notif.id,
          userId: notif.userId,
          messageId,
          channelId,
          serverId,
          authorId,
          authorUsername,
          timestamp: now.toISOString(),
        })
        .catch((err) =>
          logger.warn(
            { err, userId: notif.userId, messageId },
            'Failed to publish broadcast USER_MENTIONED',
          ),
        );
    }
  } catch (err) {
    logger.warn({ err, messageId, serverId }, 'Failed to process broadcast mentions');
  }
}
