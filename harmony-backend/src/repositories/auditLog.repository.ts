import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const auditLogRepository = {
  create(data: Prisma.VisibilityAuditLogCreateInput, client: Client = prisma) {
    return client.visibilityAuditLog.create({ data });
  },

  findMany(where: Prisma.VisibilityAuditLogWhereInput, skip: number, take: number, client: Client = prisma) {
    return client.visibilityAuditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip,
      take,
    });
  },

  count(where: Prisma.VisibilityAuditLogWhereInput, client: Client = prisma) {
    return client.visibilityAuditLog.count({ where });
  },
};
