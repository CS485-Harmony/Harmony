import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const serverRepository = {
  findBySlug(slug: string, client: Client = prisma) {
    return client.server.findUnique({ where: { slug } });
  },

  findById(id: string, client: Client = prisma) {
    return client.server.findUnique({ where: { id } });
  },

  findByIdSelect<T extends Prisma.ServerSelect>(id: string, select: T, client: Client = prisma) {
    return client.server.findUnique({ where: { id }, select });
  },

  findPublic(limit: number, client: Client = prisma) {
    return client.server.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  findAll(limit: number, client: Client = prisma) {
    return client.server.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
  },

  findPublicBySlugSelect(client: Client = prisma) {
    return client.server.findMany({
      where: { isPublic: true },
      orderBy: { memberCount: 'desc' },
      select: { slug: true },
    });
  },

  findFirst(where: Prisma.ServerWhereInput, select: Prisma.ServerSelect, client: Client = prisma) {
    return client.server.findFirst({ where, select });
  },

  countBySlug(slug: string, client: Client = prisma) {
    return client.server.count({ where: { slug } });
  },

  create(data: Prisma.ServerUncheckedCreateInput, client: Client = prisma) {
    return client.server.create({ data });
  },

  update(id: string, data: Prisma.ServerUpdateInput, client: Client = prisma) {
    return client.server.update({ where: { id }, data });
  },

  delete(id: string, client: Client = prisma) {
    return client.server.delete({ where: { id } });
  },
};
