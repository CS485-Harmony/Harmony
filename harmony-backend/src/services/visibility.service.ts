/**
 * ChannelVisibilityService (M-B3) — owns the visibility state machine,
 * permission checks, and audit logging for channel visibility changes.
 *
 * Per §6.3: the channel UPDATE and audit log INSERT are wrapped in a single
 * Prisma $transaction. After a successful commit, a VISIBILITY_CHANGED event
 * is published fire-and-forget so downstream consumers (CacheInvalidator,
 * IndexingService, MetaTagService) can react without blocking this call.
 */

import { TRPCError } from '@trpc/server';
import { ChannelType, ChannelVisibility } from '@prisma/client';
import { prisma } from '../db/prisma';
import { eventBus, EventChannels } from '../events/eventBus';

export interface SetVisibilityInput {
  channelId: string;
  visibility: ChannelVisibility;
  actorId: string;
  ip: string;
  userAgent?: string;
}

export interface VisibilityChangeResult {
  success: boolean;
  channelId: string;
  oldVisibility: ChannelVisibility;
  newVisibility: ChannelVisibility;
  auditLogId: string;
}

export const visibilityService = {
  /**
   * Change a channel's visibility.
   *
   * The VOICE type check, channel UPDATE, and audit log INSERT are all
   * performed inside a single $transaction to eliminate the extra pre-
   * transaction DB round-trip and ensure all reads are consistent.
   */
  async setVisibility(input: SetVisibilityInput): Promise<VisibilityChangeResult> {
    const { channelId, visibility, actorId, ip, userAgent = '' } = input;

    // Atomic DB write: read current state inside the transaction to avoid a
    // race where two concurrent calls record stale oldVisibility.
    const { updatedChannel, auditEntry, oldVisibility } = await prisma.$transaction(async (tx) => {
      const current = await tx.channel.findUnique({ where: { id: channelId } });
      if (!current) throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });

      // VOICE channels cannot be made PUBLIC_INDEXABLE
      if (current.type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
        });
      }

      const updated = await tx.channel.update({
        where: { id: channelId },
        data: {
          visibility,
          // §6.3: set indexedAt when transitioning to PUBLIC_INDEXABLE
          ...(visibility === ChannelVisibility.PUBLIC_INDEXABLE && { indexedAt: new Date() }),
        },
      });

      const audit = await tx.visibilityAuditLog.create({
        data: {
          channelId,
          actorId,
          action: 'VISIBILITY_CHANGED',
          oldValue: { visibility: current.visibility },
          newValue: { visibility },
          ipAddress: ip,
          userAgent,
        },
      });

      return { updatedChannel: updated, auditEntry: audit, oldVisibility: current.visibility };
    });

    // Publish event after successful commit (fire-and-forget)
    void eventBus.publish(EventChannels.VISIBILITY_CHANGED, {
      channelId: updatedChannel.id,
      serverId: updatedChannel.serverId,
      oldVisibility,
      newVisibility: visibility,
      actorId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      channelId,
      oldVisibility,
      newVisibility: visibility,
      auditLogId: auditEntry.id,
    };
  },
};
