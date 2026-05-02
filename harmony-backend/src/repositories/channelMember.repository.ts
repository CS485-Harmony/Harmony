import { prisma } from '../db/prisma';
import type { Prisma } from '@prisma/client';

type Client = typeof prisma | Prisma.TransactionClient;

export const channelMemberRepository = {
  findByChannelAndUser(channelId: string, userId: string, client: Client = prisma) {
    return client.channelMember.findUnique({
      where: { userId_channelId: { userId, channelId } },
    });
  },

  findByChannel(channelId: string, client: Client = prisma) {
    return client.channelMember.findMany({
      where: { channelId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { addedAt: 'asc' },
    });
  },

  create(userId: string, channelId: string, client: Client = prisma) {
    return client.channelMember.create({
      data: { userId, channelId },
    });
  },

  delete(userId: string, channelId: string, client: Client = prisma) {
    return client.channelMember.delete({
      where: { userId_channelId: { userId, channelId } },
    });
  },

  isMember(userId: string, channelId: string, client: Client = prisma) {
    return client.channelMember
      .findUnique({ where: { userId_channelId: { userId, channelId } } })
      .then(Boolean);
  },
};
