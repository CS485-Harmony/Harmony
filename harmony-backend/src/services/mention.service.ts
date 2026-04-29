import { prisma } from '../db/prisma';
import { eventBus, EventChannels } from '../events/eventBus';
import { createLogger } from '../lib/logger';

const logger = createLogger({ component: 'mention-service' });

/**
 * Parse @username tokens from message content and return unique lowercase usernames.
 * A fresh RegExp is created per call so `lastIndex` state never bleeds between calls.
 */
export function extractMentionedUsernames(content: string): string[] {
  const names = new Set<string>();
  for (const m of content.matchAll(/@([\w]{1,32})/g)) {
    names.add(m[1].toLowerCase());
  }
  return [...names];
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
