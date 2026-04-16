import { Server, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { channelService } from './channel.service';
import { serverMemberService } from './serverMember.service';
import { isSystemAdmin } from '../lib/admin.utils';
import { eventBus, EventChannels } from '../events/eventBus';
import { serverRepository } from '../repositories/server.repository';
import { serverMemberRepository } from '../repositories/serverMember.repository';

// Role hierarchy for sorting: lower rank = higher privilege
const ROLE_RANK: Record<string, number> = {
  OWNER: 0,
  ADMIN: 1,
  MODERATOR: 2,
  MEMBER: 3,
  GUEST: 4,
};

export interface ServerMemberWithUser {
  userId: string;
  serverId: string;
  role: string;
  joinedAt: Date;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    status: string;
  };
}

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
  if (!base)
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot generate slug from name' });

  const MAX_ATTEMPTS = 10;
  let candidate = base;
  for (let suffix = 1; suffix <= MAX_ATTEMPTS; suffix++) {
    if ((await serverRepository.countBySlug(candidate)) === 0) return candidate;
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
    return serverRepository.findPublic(Math.min(limit, 100));
  },

  /** Dev admin: returns all servers regardless of visibility. */
  async getAllServers(limit = 50): Promise<Server[]> {
    return serverRepository.findAll(Math.min(limit, 100));
  },

  /** Returns only the servers the given user is a member of. */
  async getMemberServers(userId: string, limit = 50): Promise<Server[]> {
    const memberships = await serverMemberRepository.findByUserIdWithServer(userId, Math.min(limit, 100));
    return memberships.map((m) => m.server);
  },

  async getServer(slug: string): Promise<Server | null> {
    return serverRepository.findBySlug(slug);
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
      serverRepository.create({ ...input, slug: s }),
    );
    await channelService.createDefaultChannel(server.id);
    await serverMemberService.addOwner(input.ownerId, server.id);
    return server;
  },

  async updateServer(
    id: string,
    actorId: string,
    data: { name?: string; description?: string; iconUrl?: string; isPublic?: boolean },
  ): Promise<Server> {
    const server = await serverRepository.findById(id);
    if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    if (server.ownerId !== actorId && !(await isSystemAdmin(actorId)))
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the server owner can update' });

    let updated: Server;
    if (data.name && data.name !== server.name) {
      const slug = await generateUniqueSlug(data.name);
      updated = await withSlugRetry(data.name, slug, (s) =>
        serverRepository.update(id, { ...data, slug: s }),
      );
    } else {
      updated = await serverRepository.update(id, data);
    }

    void eventBus.publish(EventChannels.SERVER_UPDATED, {
      serverId: id,
      name: updated.name,
      iconUrl: updated.iconUrl ?? null,
      description: updated.description ?? null,
      timestamp: new Date().toISOString(),
    });

    return updated;
  },

  async deleteServer(id: string, actorId: string): Promise<Server> {
    const server = await serverRepository.findById(id);
    if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    if (server.ownerId !== actorId && !(await isSystemAdmin(actorId)))
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the server owner can delete' });
    return serverRepository.delete(id);
  },

  async incrementMemberCount(id: string): Promise<Server> {
    return serverRepository.update(id, { memberCount: { increment: 1 } });
  },

  async decrementMemberCount(id: string): Promise<Server> {
    const server = await serverRepository.findById(id);
    if (!server || server.memberCount <= 0) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Member count is already zero' });
    }
    return serverRepository.update(id, { memberCount: { decrement: 1 } });
  },

  async getMembers(serverId: string): Promise<ServerMemberWithUser[]> {
    const members = await serverMemberRepository.findMembersByServerId(serverId);
    return members
      .map((m) => ({ ...m, role: m.role as string }))
      .sort(
        (a, b) =>
          (ROLE_RANK[a.role] ?? 99) - (ROLE_RANK[b.role] ?? 99) ||
          a.joinedAt.getTime() - b.joinedAt.getTime(),
      );
  },
};
