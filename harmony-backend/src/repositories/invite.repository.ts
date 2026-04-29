import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const inviteRepository = {
  findByCode(code: string, client: Client = prisma) {
    return client.serverInvite.findUnique({ where: { code } });
  },

  findByCodeWithServer(code: string, client: Client = prisma) {
    return client.serverInvite.findUnique({
      where: { code },
      include: {
        server: {
          select: { id: true, name: true, slug: true, iconUrl: true, description: true, memberCount: true },
        },
      },
    });
  },

  findByServerId(serverId: string, client: Client = prisma) {
    return client.serverInvite.findMany({
      where: { serverId },
      include: {
        creator: { select: { id: true, username: true, displayName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string, client: Client = prisma) {
    return client.serverInvite.findUnique({ where: { id } });
  },

  findByIdWithCreator(id: string, client: Client = prisma) {
    return client.serverInvite.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, username: true, displayName: true } },
      },
    });
  },

  create(data: Prisma.ServerInviteUncheckedCreateInput, client: Client = prisma) {
    return client.serverInvite.create({ data });
  },

  incrementUses(id: string, client: Client = prisma) {
    return client.serverInvite.update({
      where: { id },
      data: { uses: { increment: 1 } },
    });
  },

  // Returns count of updated rows; 0 means the invite was already exhausted.
  conditionalIncrementUses(id: string, maxUses: number | null, client: Client = prisma) {
    return client.serverInvite.updateMany({
      where: { id, ...(maxUses !== null ? { uses: { lt: maxUses } } : {}) },
      data: { uses: { increment: 1 } },
    });
  },

  delete(id: string, client: Client = prisma) {
    return client.serverInvite.delete({ where: { id } });
  },
};
