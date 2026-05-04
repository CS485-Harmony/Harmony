import { ChannelVisibility, Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

type Client = Prisma.TransactionClient | typeof prisma;

export const channelRepository = {
  findById(id: string, client: Client = prisma) {
    return client.channel.findUnique({ where: { id } });
  },

  findByServerId(serverId: string, client: Client = prisma) {
    return client.channel.findMany({ where: { serverId }, orderBy: { position: 'asc' } });
  },

  /** Returns channels accessible to a non-admin user: non-private + private channels they're explicitly added to. */
  findAccessibleByServerId(serverId: string, userId: string, client: Client = prisma) {
    return client.channel.findMany({
      where: {
        serverId,
        OR: [
          { visibility: { not: ChannelVisibility.PRIVATE } },
          { channelMembers: { some: { userId } } },
        ],
      },
      orderBy: { position: 'asc' },
    });
  },

  findByServerAndSlug(serverId: string, slug: string, client: Client = prisma) {
    return client.channel.findUnique({ where: { serverId_slug: { serverId, slug } } });
  },

  findVisibilityAndServerId(id: string, client: Client = prisma) {
    return client.channel.findUnique({
      where: { id },
      select: { visibility: true, serverId: true },
    });
  },

  findForSitemap(id: string, client: Client = prisma) {
    return client.channel.findUnique({
      where: { id },
      select: { serverId: true, server: { select: { slug: true } } },
    });
  },

  findPublicIndexableByServerId(
    serverId: string,
    client: Client = prisma,
  ) {
    return client.channel.findMany({
      where: { serverId, visibility: ChannelVisibility.PUBLIC_INDEXABLE },
      orderBy: { position: 'asc' },
      select: { slug: true, updatedAt: true },
    });
  },

  create(data: Prisma.ChannelUncheckedCreateInput, client: Client = prisma) {
    return client.channel.create({ data });
  },

  update(id: string, data: Prisma.ChannelUpdateInput, client: Client = prisma) {
    return client.channel.update({ where: { id }, data });
  },

  delete(id: string, client: Client = prisma) {
    return client.channel.delete({ where: { id } });
  },
};
