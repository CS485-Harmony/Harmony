import { Prisma, RoleType } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const serverMemberRepository = {
  findByUserAndServer(userId: string, serverId: string, client: Client = prisma) {
    return client.serverMember.findUnique({
      where: { userId_serverId: { userId, serverId } },
    });
  },

  findByUserAndServerSelect(userId: string, serverId: string, client: Client = prisma) {
    return client.serverMember.findUnique({
      where: { userId_serverId: { userId, serverId } },
      select: { role: true },
    });
  },

  findByServerId(
    serverId: string,
    client: Client = prisma,
  ) {
    return client.serverMember.findMany({
      where: { serverId },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  },

  findMembersByServerId(serverId: string, client: Client = prisma) {
    return client.serverMember.findMany({
      where: { serverId },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, status: true },
        },
      },
    });
  },

  findByUserIdWithServer(userId: string, take?: number, client: Client = prisma) {
    return client.serverMember.findMany({
      where: { userId },
      include: { server: true },
      orderBy: { joinedAt: 'asc' },
      ...(take !== undefined && { take }),
    });
  },

  findByUserIdSelect(userId: string, client: Client = prisma) {
    return client.serverMember.findMany({
      where: { userId },
      select: { serverId: true },
    });
  },

  findFirst(where: Prisma.ServerMemberWhereInput, client: Client = prisma) {
    return client.serverMember.findFirst({ where });
  },

  create(data: Prisma.ServerMemberUncheckedCreateInput, client: Client = prisma) {
    return client.serverMember.create({ data });
  },

  upsert(
    where: Prisma.ServerMemberWhereUniqueInput,
    update: Prisma.ServerMemberUpdateInput,
    create: Prisma.ServerMemberUncheckedCreateInput,
    client: Client = prisma,
  ) {
    return client.serverMember.upsert({ where, update, create });
  },

  update(userId: string, serverId: string, role: RoleType, client: Client = prisma) {
    return client.serverMember.update({
      where: { userId_serverId: { userId, serverId } },
      data: { role },
    });
  },

  delete(userId: string, serverId: string, client: Client = prisma) {
    return client.serverMember.delete({
      where: { userId_serverId: { userId, serverId } },
    });
  },
};
