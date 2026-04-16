import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

const AUTHOR_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} as const;

const ATTACHMENT_SELECT = {
  id: true,
  filename: true,
  url: true,
  contentType: true,
} as const;

export const MESSAGE_INCLUDE = {
  author: { select: AUTHOR_SELECT },
  attachments: { select: ATTACHMENT_SELECT },
} as const;

export const messageRepository = {
  findByIdWithChannel(id: string, client: Client = prisma) {
    return client.message.findUnique({
      where: { id },
      include: { channel: { select: { serverId: true } } },
    });
  },

  findByIdWithChannelFull(id: string, client: Client = prisma) {
    return client.message.findUnique({
      where: { id },
      include: { channel: { select: { id: true, serverId: true } } },
    });
  },

  findManyPaginated(
    where: Prisma.MessageWhereInput,
    take: number,
    cursor: string | undefined,
    orderBy: Prisma.MessageOrderByWithRelationInput,
    client: Client = prisma,
  ) {
    return client.message.findMany({
      where,
      take,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy,
      include: MESSAGE_INCLUDE,
    });
  },

  findPinnedByChannel(channelId: string, client: Client = prisma) {
    return client.message.findMany({
      where: { channelId, pinned: true, isDeleted: false },
      orderBy: { pinnedAt: 'desc' },
      include: MESSAGE_INCLUDE,
    });
  },

  create(data: Prisma.MessageCreateInput, client: Client = prisma) {
    return client.message.create({ data, include: MESSAGE_INCLUDE });
  },

  update(id: string, data: Prisma.MessageUpdateInput, client: Client = prisma) {
    return client.message.update({ where: { id }, data, include: MESSAGE_INCLUDE });
  },

  updateRaw(id: string, data: Prisma.MessageUpdateInput, client: Client = prisma) {
    return client.message.update({ where: { id }, data });
  },

  updateMany(where: Prisma.MessageWhereInput, data: Prisma.MessageUpdateManyMutationInput, client: Client = prisma) {
    return client.message.updateMany({ where, data });
  },

  decrementReplyCountFloored(parentId: string, client: Prisma.TransactionClient | typeof prisma = prisma) {
    // Prisma's { decrement: 1 } has no floor; GREATEST(..., 0) guards against
    // negative counts from concurrent races or anomalies.
    return client.$executeRaw`
      UPDATE "messages"
      SET reply_count = GREATEST(reply_count - 1, 0)
      WHERE id = ${parentId}::uuid
    `;
  },
};
