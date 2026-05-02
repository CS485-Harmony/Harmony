import { TRPCError } from '@trpc/server';
import { channelMemberRepository } from '../repositories/channelMember.repository';
import { channelRepository } from '../repositories/channel.repository';
import { serverMemberRepository } from '../repositories/serverMember.repository';
import { createLogger } from '../lib/logger';

const logger = createLogger({ component: 'channel-member-service' });

export const channelMemberService = {
  /** Returns all explicit members of a channel with their user profile. */
  async getChannelMembers(channelId: string, serverId: string) {
    const channel = await channelRepository.findById(channelId);
    if (!channel || channel.serverId !== serverId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
    }
    return channelMemberRepository.findByChannel(channelId);
  },

  /** Adds a server member to a channel. The target user must be a member of the server. */
  async addMember(channelId: string, serverId: string, targetUserId: string) {
    const channel = await channelRepository.findById(channelId);
    if (!channel || channel.serverId !== serverId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
    }
    if (channel.visibility !== 'PRIVATE') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Explicit membership is only applicable to private channels' });
    }

    // Target must be a member of the server
    const serverMember = await serverMemberRepository.findByUserAndServer(targetUserId, serverId);
    if (!serverMember) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'User is not a member of this server' });
    }

    const existing = await channelMemberRepository.findByChannelAndUser(channelId, targetUserId);
    if (existing) {
      throw new TRPCError({ code: 'CONFLICT', message: 'User is already a member of this channel' });
    }

    const membership = await channelMemberRepository.create(targetUserId, channelId);
    logger.info({ channelId, targetUserId }, 'Channel member added');
    return membership;
  },

  /** Removes a user from a channel's explicit membership list. */
  async removeMember(channelId: string, serverId: string, targetUserId: string) {
    const channel = await channelRepository.findById(channelId);
    if (!channel || channel.serverId !== serverId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
    }

    const existing = await channelMemberRepository.findByChannelAndUser(channelId, targetUserId);
    if (!existing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User is not a member of this channel' });
    }

    await channelMemberRepository.delete(targetUserId, channelId);
    logger.info({ channelId, targetUserId }, 'Channel member removed');
  },

  /** Returns true if the user can access a private channel (is admin+ or explicit channel member). */
  async canAccessPrivateChannel(userId: string, channelId: string, serverId: string): Promise<boolean> {
    const serverMember = await serverMemberRepository.findByUserAndServerSelect(userId, serverId);
    if (!serverMember) return false;

    if (serverMember.role === 'OWNER' || serverMember.role === 'ADMIN') return true;

    return channelMemberRepository.isMember(userId, channelId);
  },
};
