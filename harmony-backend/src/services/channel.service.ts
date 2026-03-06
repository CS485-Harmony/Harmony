import { TRPCError } from '@trpc/server';
import { ChannelType, ChannelVisibility } from '@prisma/client';
import { prisma } from '../db/prisma';

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

    return prisma.channel.create({
      data: { serverId, name, slug, type, visibility, topic, position },
    });
  },

  async updateChannel(channelId: string, patch: UpdateChannelInput) {
    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });
    }

    return prisma.channel.update({
      where: { id: channelId },
      data: {
        ...(patch.name !== undefined && { name: patch.name }),
        ...(patch.topic !== undefined && { topic: patch.topic }),
        ...(patch.position !== undefined && { position: patch.position }),
      },
    });
  },

  async deleteChannel(channelId: string) {
    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });
    }

    await prisma.channel.delete({ where: { id: channelId } });
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
