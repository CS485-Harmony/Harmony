import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const reactionRepository = {
  findMessageWithChannel(messageId: string, client: Client = prisma) {
    return client.message.findUnique({
      where: { id: messageId },
      include: { channel: { select: { serverId: true, id: true } } },
    });
  },

  findByMessageId(messageId: string, client: Client = prisma) {
    return client.messageReaction.findMany({
      where: { messageId },
      select: { emoji: true, userId: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  findFirst(where: Prisma.MessageReactionWhereInput, client: Client = prisma) {
    return client.messageReaction.findFirst({ where });
  },

  create(data: Prisma.MessageReactionCreateInput, client: Client = prisma) {
    return client.messageReaction.create({ data });
  },

  delete(messageId: string, userId: string, emoji: string, client: Client = prisma) {
    return client.messageReaction.delete({
      where: { messageId_userId_emoji: { messageId, userId, emoji } },
    });
  },
};
