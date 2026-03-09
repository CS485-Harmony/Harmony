import { Server, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '../db/prisma';
import { channelService } from './channel.service';

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = generateSlug(name);
  if (!base) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot generate slug from name' });

  const MAX_ATTEMPTS = 10;
  let candidate = base;
  for (let suffix = 1; suffix <= MAX_ATTEMPTS; suffix++) {
    if ((await prisma.server.count({ where: { slug: candidate } })) === 0) return candidate;
    candidate = `${base}-${suffix}`;
  }
  throw new TRPCError({ code: 'CONFLICT', message: 'Unable to generate a unique slug' });
}

/**
 * Generic slug-collision retry helper.
 * Calls fn(slug) up to maxRetries times, regenerating the slug on a P2002 unique violation.
 */
async function withSlugRetry(
  name: string,
  initialSlug: string,
  fn: (slug: string) => Promise<Server>,
  maxRetries = 3,
): Promise<Server> {
  let slug = initialSlug;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) slug = await generateUniqueSlug(name);
    try {
      return await fn(slug);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        attempt < maxRetries - 1
      ) {
        continue;
      }
      throw err;
    }
  }
  throw new TRPCError({ code: 'CONFLICT', message: 'Unable to generate a unique slug' });
}

export const serverService = {
  async getPublicServers(limit = 50): Promise<Server[]> {
    return prisma.server.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    });
  },

  async getServer(slug: string): Promise<Server | null> {
    return prisma.server.findUnique({ where: { slug } });
  },

  async createServer(input: {
    name: string;
    description?: string;
    iconUrl?: string;
    isPublic?: boolean;
    ownerId: string;
  }): Promise<Server> {
    const slug = await generateUniqueSlug(input.name);
    const server = await withSlugRetry(input.name, slug, (s) =>
      prisma.server.create({ data: { ...input, slug: s } }),
    );
    await channelService.createDefaultChannel(server.id);
    // Add the owner as an OWNER member (inlined to avoid circular dependency)
    await prisma.$transaction([
      prisma.serverMember.create({
        data: { userId: input.ownerId, serverId: server.id, role: 'OWNER' },
      }),
      prisma.server.update({
        where: { id: server.id },
        data: { memberCount: { increment: 1 } },
      }),
    ]);
    return server;
  },

  async updateServer(
    id: string,
    actorId: string,
    data: { name?: string; description?: string; iconUrl?: string; isPublic?: boolean },
  ): Promise<Server> {
    const server = await prisma.server.findUnique({ where: { id } });
    if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    if (server.ownerId !== actorId)
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the server owner can update' });

    if (data.name && data.name !== server.name) {
      const slug = await generateUniqueSlug(data.name);
      return withSlugRetry(data.name, slug, (s) =>
        prisma.server.update({ where: { id }, data: { ...data, slug: s } }),
      );
    }
    return prisma.server.update({ where: { id }, data });
  },

  async deleteServer(id: string, actorId: string): Promise<Server> {
    const server = await prisma.server.findUnique({ where: { id } });
    if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    if (server.ownerId !== actorId)
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the server owner can delete' });
    return prisma.server.delete({ where: { id } });
  },

  async incrementMemberCount(id: string): Promise<Server> {
    return prisma.server.update({
      where: { id },
      data: { memberCount: { increment: 1 } },
    });
  },

  async decrementMemberCount(id: string): Promise<Server> {
    const server = await prisma.server.findUnique({ where: { id } });
    if (!server || server.memberCount <= 0) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Member count is already zero' });
    }
    return prisma.server.update({
      where: { id },
      data: { memberCount: { decrement: 1 } },
    });
  },
};
