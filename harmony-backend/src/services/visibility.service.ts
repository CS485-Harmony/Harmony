/**
 * ChannelVisibilityService (M-B3) — owns the visibility state machine
 * and audit logging for channel visibility changes.
 *
 * Authorization is handled at the router level via `withPermission`
 * middleware (RBAC from PR #141). This service no longer performs its
 * own permission checks.
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
import { auditLogService } from './auditLog.service';

export interface SetVisibilityInput {
  channelId: string;
  serverId: string;
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
  /** Null when the request was a no-op (visibility unchanged — no audit entry created). */
  auditLogId: string | null;
}

export const visibilityService = {
  /**
   * Get the current visibility of a channel.
   *
   * Validates that the channel belongs to the given server to prevent
   * cross-server channel probing.
   */
  async getVisibility(channelId: string, serverId: string): Promise<ChannelVisibility> {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { visibility: true, serverId: true },
    });
    if (!channel || channel.serverId !== serverId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
    }
    return channel.visibility;
  },

  /**
   * Change a channel's visibility.
   *
   * Verifies the channel belongs to `serverId` before applying the change,
   * preventing cross-server authorization bypass. The VOICE type check,
   * channel UPDATE, and audit log INSERT are all performed inside a single
   * $transaction to ensure consistency.
   */
  async setVisibility(input: SetVisibilityInput): Promise<VisibilityChangeResult> {
    const { channelId, serverId, visibility, actorId, ip, userAgent = '' } = input;

    // Atomic DB write: read current state inside the transaction to avoid a
    // race where two concurrent calls record stale oldVisibility.
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.channel.findUnique({ where: { id: channelId } });
      if (!current || current.serverId !== serverId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
      }

      // No-op guard: skip DB write, audit log, and event emission if visibility is unchanged.
      if (current.visibility === visibility) {
        return { isNoOp: true as const, oldVisibility: current.visibility };
      }

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
          // §6.3: set indexedAt only when transitioning TO PUBLIC_INDEXABLE (not on no-op updates)
          ...(visibility === ChannelVisibility.PUBLIC_INDEXABLE &&
            current.visibility !== ChannelVisibility.PUBLIC_INDEXABLE && { indexedAt: new Date() }),
          // §5.2: clear indexedAt when transitioning TO PRIVATE
          ...(visibility === ChannelVisibility.PRIVATE &&
            current.visibility !== ChannelVisibility.PRIVATE && { indexedAt: null }),
        },
      });

      const audit = await auditLogService.logVisibilityChange(
        {
          channelId,
          actorId,
          oldValue: { visibility: current.visibility },
          newValue: { visibility },
          ipAddress: ip,
          userAgent,
        },
        tx,
      );

      return { isNoOp: false as const, updatedChannel: updated, auditEntry: audit, oldVisibility: current.visibility };
    });

    if (result.isNoOp) {
      return {
        success: true,
        channelId,
        oldVisibility: result.oldVisibility,
        newVisibility: visibility,
        auditLogId: null,
      };
    }

    // Publish event after successful commit (fire-and-forget)
    void eventBus.publish(EventChannels.VISIBILITY_CHANGED, {
      channelId: result.updatedChannel.id,
      serverId: result.updatedChannel.serverId,
      oldVisibility: result.oldVisibility,
      newVisibility: visibility,
      actorId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      channelId,
      oldVisibility: result.oldVisibility,
      newVisibility: visibility,
      auditLogId: result.auditEntry.id,
    };
  },
};
