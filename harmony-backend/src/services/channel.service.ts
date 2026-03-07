import { TRPCError } from '@trpc/server';
import { ChannelType, ChannelVisibility } from '@prisma/client';
import { prisma } from '../db/prisma';
import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from './cache.service';
import { eventBus, EventChannels } from './eventBus.service';

export interface CreateChannelInput {
  serverId: string;
  name: string;
  slug: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  topic?: string;
  position?: number;
}

export interface UpdateChannelInput {
  name?: string;
  topic?: string;
  position?: number;
}

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

export const channelService = {
  async getChannels(serverId: string) {
    return prisma.channel.findMany({
      where: { serverId },
      orderBy: { position: 'asc' },
    });
  },

  async getChannelBySlug(serverSlug: string, channelSlug: string) {
    const server = await prisma.server.findUnique({ where: { slug: serverSlug } });
    if (!server) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    }

    const channel = await prisma.channel.findUnique({
      where: { serverId_slug: { serverId: server.id, slug: channelSlug } },
    });
    if (!channel) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });
    }

    return channel;
  },

  async createChannel(input: CreateChannelInput) {
    const { serverId, name, slug, type, visibility, topic, position = 0 } = input;

    // VOICE channels cannot be PUBLIC_INDEXABLE
    if (type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
      });
    }

    // Verify server exists
    const server = await prisma.server.findUnique({ where: { id: serverId } });
    if (!server) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    }

    // Check slug uniqueness per server
    const existing = await prisma.channel.findUnique({
      where: { serverId_slug: { serverId, slug } },
    });
    if (existing) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Channel slug already exists in this server' });
    }

    const channel = await prisma.channel.create({
      data: { serverId, name, slug, type, visibility, topic, position },
    });

    // Write-through: cache new visibility and invalidate server channel list (best-effort)
    cacheService.set(
      CacheKeys.channelVisibility(channel.id),
      channel.visibility,
      { ttl: CacheTTL.channelVisibility },
    ).catch(() => {});
    cacheService.invalidate(`server:${sanitizeKeySegment(serverId)}:public_channels`).catch(() => {});

    return channel;
  },

  async updateChannel(channelId: string, patch: UpdateChannelInput) {
    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });
    }

    const updated = await prisma.channel.update({
      where: { id: channelId },
      data: {
        ...(patch.name !== undefined && { name: patch.name }),
        ...(patch.topic !== undefined && { topic: patch.topic }),
        ...(patch.position !== undefined && { position: patch.position }),
      },
    });

    // Write-through: invalidate message caches and server channel list (best-effort)
    cacheService.invalidatePattern(`channel:msgs:${sanitizeKeySegment(channelId)}:*`).catch(() => {});
    cacheService.invalidate(`server:${sanitizeKeySegment(channel.serverId)}:public_channels`).catch(() => {});

    return updated;
  },

  async deleteChannel(channelId: string) {
    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });
    }

    await prisma.channel.delete({ where: { id: channelId } });

    // Write-through: invalidate all caches for deleted channel (best-effort)
    cacheService.invalidate(CacheKeys.channelVisibility(channelId)).catch(() => {});
    cacheService.invalidatePattern(`channel:msgs:${sanitizeKeySegment(channelId)}:*`).catch(() => {});
    cacheService.invalidate(`server:${sanitizeKeySegment(channel.serverId)}:public_channels`).catch(() => {});
  },

  async createDefaultChannel(serverId: string) {
    return channelService.createChannel({
      serverId,
      name: 'general',
      slug: 'general',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
      position: 0,
    });
  },

  /**
   * Change a channel's visibility.
   *
   * Per §6.3: the channel UPDATE and audit log INSERT are wrapped in a single
   * Prisma $transaction — if either fails, both roll back. After a successful
   * commit, a VISIBILITY_CHANGED event is published fire-and-forget so that
   * downstream consumers (CacheInvalidator, IndexingService, MetaTagService)
   * can react without blocking this call.
   */
  async setVisibility(input: SetVisibilityInput): Promise<VisibilityChangeResult> {
    const { channelId, visibility, actorId, ip, userAgent = '' } = input;

    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });
    }

    // VOICE channels cannot be made PUBLIC_INDEXABLE
    if (channel.type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
      });
    }

    // Atomic DB write: re-read the current visibility inside the transaction to
    // avoid a race where two concurrent setVisibility calls record stale oldValue.
    const { updatedChannel, auditEntry, oldVisibility } = await prisma.$transaction(async (tx) => {
      const current = await tx.channel.findUnique({ where: { id: channelId } });
      if (!current) throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });

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
