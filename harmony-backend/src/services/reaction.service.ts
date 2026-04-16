import { TRPCError } from '@trpc/server';
import { createLogger } from '../lib/logger';
import { cacheService, sanitizeKeySegment } from './cache.service';
import { eventBus, EventChannels } from '../events/eventBus';
import { reactionRepository } from '../repositories/reaction.repository';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddReactionInput {
  messageId: string;
  channelId: string;
  userId: string;
  emoji: string;
  serverId: string;
}

export interface RemoveReactionInput {
  messageId: string;
  channelId: string;
  userId: string;
  emoji: string;
  serverId: string;
}

export interface GetMessageReactionsInput {
  messageId: string;
  channelId: string;
  serverId: string;
}

export interface ReactionGroup {
  emoji: string;
  count: number;
  userIds: string[];
}

const logger = createLogger({ component: 'reaction-service' });

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve a message (non-deleted) and assert it belongs to both the given
 * channel and server. Throws NOT_FOUND for any mismatch to prevent callers
 * from probing channel or server IDs across boundaries.
 */
async function requireMessageInChannel(messageId: string, channelId: string, serverId: string) {
  const message = await reactionRepository.findMessageWithChannel(messageId);
  if (
    !message ||
    message.isDeleted ||
    message.channelId !== channelId ||
    message.channel.serverId !== serverId
  ) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this channel' });
  }
  return message;
}

/** Cache key for all reactions on a message, scoped to server to prevent cross-server probing. */
function reactionCacheKey(serverId: string, messageId: string): string {
  return `reactions:${sanitizeKeySegment(serverId)}:${sanitizeKeySegment(messageId)}`;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const reactionService = {
  /**
   * Add an emoji reaction to a message.
   * Validates the message exists in the server; throws CONFLICT if the user
   * has already reacted with the same emoji.
   */
  async addReaction(input: AddReactionInput) {
    const { messageId, channelId, userId, emoji, serverId } = input;

    const message = await requireMessageInChannel(messageId, channelId, serverId);

    try {
      const reaction = await reactionRepository.create({ message: { connect: { id: messageId } }, user: { connect: { id: userId } }, emoji });

      cacheService
        .invalidatePattern(reactionCacheKey(serverId, messageId))
        .catch((err) =>
          logger.warn(
            { err, messageId, serverId },
            'Failed to invalidate reaction cache after add',
          ),
        );

      eventBus
        .publish(EventChannels.REACTION_ADDED, {
          messageId,
          channelId: message.channel.id,
          userId,
          emoji,
          timestamp: reaction.createdAt.toISOString(),
        })
        .catch((err) =>
          logger.warn(
            { err, messageId, channelId, serverId },
            'Failed to publish reaction added event',
          ),
        );

      return reaction;
    } catch (err: unknown) {
      // Prisma unique constraint violation — P2002
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already reacted with this emoji',
        });
      }
      throw err;
    }
  },

  /**
   * Remove an emoji reaction from a message.
   * Only the reaction owner may remove it; throws FORBIDDEN otherwise.
   *
   * Uses an atomic delete-first pattern to avoid the TOCTOU race between a
   * findUnique check and the subsequent delete. If Prisma returns P2025
   * (record not found), we do a single findFirst to decide FORBIDDEN vs
   * NOT_FOUND.
   */
  async removeReaction(input: RemoveReactionInput) {
    const { messageId, channelId, userId, emoji, serverId } = input;

    const message = await requireMessageInChannel(messageId, channelId, serverId);

    try {
      // Attempt delete atomically — no separate pre-check needed
      await reactionRepository.delete(messageId, userId, emoji);
    } catch (err: unknown) {
      // P2025: the caller's reaction did not exist
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2025'
      ) {
        // Distinguish: does this emoji exist on the message for someone else?
        const anyReaction = await reactionRepository.findFirst({ messageId, emoji });
        if (anyReaction) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You can only remove your own reactions',
          });
        }
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Reaction not found' });
      }
      throw err;
    }

    cacheService
      .invalidatePattern(reactionCacheKey(serverId, messageId))
      .catch((err) =>
        logger.warn(
          { err, messageId, serverId },
          'Failed to invalidate reaction cache after removal',
        ),
      );

    eventBus
      .publish(EventChannels.REACTION_REMOVED, {
        messageId,
        channelId: message.channel.id,
        userId,
        emoji,
        timestamp: new Date().toISOString(),
      })
      .catch((err) =>
        logger.warn(
          { err, messageId, channelId, serverId },
          'Failed to publish reaction removed event',
        ),
      );
  },

  /**
   * Return all reactions for a message, grouped by emoji with counts and
   * the list of user IDs who reacted.
   * Shape: `{ emoji, count, userIds[] }[]`
   */
  async getMessageReactions(input: GetMessageReactionsInput): Promise<ReactionGroup[]> {
    const { messageId, channelId, serverId } = input;

    await requireMessageInChannel(messageId, channelId, serverId);

    const reactions = await reactionRepository.findByMessageId(messageId);

    // Group by emoji
    const grouped = new Map<string, string[]>();
    for (const r of reactions) {
      const existing = grouped.get(r.emoji);
      if (existing) {
        existing.push(r.userId);
      } else {
        grouped.set(r.emoji, [r.userId]);
      }
    }

    return Array.from(grouped.entries()).map(([emoji, userIds]) => ({
      emoji,
      count: userIds.length,
      userIds,
    }));
  },
};
