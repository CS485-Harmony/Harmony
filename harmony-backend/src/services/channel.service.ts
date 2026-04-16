import { TRPCError } from '@trpc/server';
import { ChannelType, ChannelVisibility } from '@prisma/client';
import { prisma } from '../db/prisma';
import { createLogger } from '../lib/logger';
import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from './cache.service';
import { eventBus, EventChannels } from '../events/eventBus';

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

const logger = createLogger({ component: 'channel-service' });

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
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Channel slug already exists in this server',
      });
    }

    const channel = await prisma.channel.create({
      data: { serverId, name, slug, type, visibility, topic, position },
    });

    // Write-through: cache new visibility and invalidate server channel list (best-effort)
    cacheService
      .set(CacheKeys.channelVisibility(channel.id), channel.visibility, {
        ttl: CacheTTL.channelVisibility,
      })
      .catch((err) =>
        logger.warn(
          { err, channelId: channel.id },
          'Failed to cache channel visibility after creation',
        ),
      );
    cacheService
      .invalidate(`server:${sanitizeKeySegment(serverId)}:public_channels`)
      .catch((err) =>
        logger.warn(
          { err, serverId },
          'Failed to invalidate public channel cache after channel creation',
        ),
      );

    // Notify connected clients (fire-and-forget)
    eventBus
      .publish(EventChannels.CHANNEL_CREATED, {
        channelId: channel.id,
        serverId: channel.serverId,
        timestamp: new Date().toISOString(),
      })
      .catch((err) =>
        logger.warn(
          { err, channelId: channel.id, serverId },
          'Failed to publish channel created event',
        ),
      );

    return channel;
  },

  async updateChannel(channelId: string, serverId: string, patch: UpdateChannelInput) {
    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel || channel.serverId !== serverId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
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
    cacheService
      .invalidatePattern(`channel:msgs:${sanitizeKeySegment(channelId)}:*`)
      .catch((err) =>
        logger.warn({ err, channelId }, 'Failed to invalidate channel message cache after update'),
      );
    cacheService
      .invalidate(`server:${sanitizeKeySegment(channel.serverId)}:public_channels`)
      .catch((err) =>
        logger.warn(
          { err, serverId: channel.serverId },
          'Failed to invalidate public channel cache after channel update',
        ),
      );

    // Notify connected clients (fire-and-forget)
    eventBus
      .publish(EventChannels.CHANNEL_UPDATED, {
        channelId: updated.id,
        serverId: updated.serverId,
        timestamp: new Date().toISOString(),
      })
      .catch((err) =>
        logger.warn(
          { err, channelId: updated.id, serverId },
          'Failed to publish channel updated event',
        ),
      );

    return updated;
  },

  async deleteChannel(channelId: string, serverId: string) {
    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel || channel.serverId !== serverId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
    }

    await prisma.channel.delete({ where: { id: channelId } });

    // Write-through: invalidate all caches for deleted channel (best-effort)
    cacheService
      .invalidate(CacheKeys.channelVisibility(channelId))
      .catch((err) =>
        logger.warn(
          { err, channelId },
          'Failed to invalidate channel visibility cache after deletion',
        ),
      );
    cacheService
      .invalidatePattern(`channel:msgs:${sanitizeKeySegment(channelId)}:*`)
      .catch((err) =>
        logger.warn(
          { err, channelId },
          'Failed to invalidate channel message cache after deletion',
        ),
      );
    cacheService
      .invalidate(`server:${sanitizeKeySegment(channel.serverId)}:public_channels`)
      .catch((err) =>
        logger.warn(
          { err, serverId: channel.serverId },
          'Failed to invalidate public channel cache after channel deletion',
        ),
      );

    // Notify connected clients (fire-and-forget)
    eventBus
      .publish(EventChannels.CHANNEL_DELETED, {
        channelId: channel.id,
        serverId: channel.serverId,
        timestamp: new Date().toISOString(),
      })
      .catch((err) =>
        logger.warn(
          { err, channelId: channel.id, serverId },
          'Failed to publish channel deleted event',
        ),
      );
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
};
