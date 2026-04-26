import crypto from 'crypto';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createApp } from '../src/app';
import { generateSlug, serverService } from '../src/services/server.service';
import { authService } from '../src/services/auth.service';
import type { Express } from 'express';

const TEST_PASSWORD_SALT = '00112233445566778899aabbccddeeff';

function derivePasswordVerifier(password: string, salt = TEST_PASSWORD_SALT): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(salt, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
}

// ─── Unit tests: slug generation ─────────────────────────────────────────────

describe('generateSlug', () => {
  it('converts name to lowercase kebab-case', () => {
    expect(generateSlug('My Cool Server')).toBe('my-cool-server');
  });

  it('strips special characters', () => {
    expect(generateSlug('Game Dev!!! @#$')).toBe('game-dev');
  });

  it('collapses multiple spaces and hyphens', () => {
    expect(generateSlug('a   b---c')).toBe('a-b-c');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug(' --hello-- ')).toBe('hello');
  });

  it('handles unicode by stripping non-ascii', () => {
    expect(generateSlug('café lounge')).toBe('caf-lounge');
  });

  it('returns empty string for fully special-char names', () => {
    expect(generateSlug('!@#$%')).toBe('');
  });
});

// ─── Service-level happy path tests ──────────────────────────────────────────

describe('serverService (integration)', () => {
  const prisma = new PrismaClient();

  let ownerUserId: string;
  let otherUserId: string;
  let createdServerId: string;

  beforeAll(async () => {
    const ts = Date.now();
    const owner = await prisma.user.create({
      data: {
        email: `server-owner-${ts}@example.com`,
        username: `server_owner_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'Server Owner',
      },
    });
    ownerUserId = owner.id;

    const other = await prisma.user.create({
      data: {
        email: `server-other-${ts}@example.com`,
        username: `server_other_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'Other User',
      },
    });
    otherUserId = other.id;

    const server = await serverService.createServer({
      name: 'My Test Server',
      ownerId: ownerUserId,
      isPublic: true,
    });
    createdServerId = server.id;
  });

  afterAll(async () => {
    if (createdServerId) {
      await prisma.server.delete({ where: { id: createdServerId } }).catch(() => {});
    }
    if (ownerUserId) {
      await prisma.user.delete({ where: { id: ownerUserId } }).catch(() => {});
    }
    if (otherUserId) {
      await prisma.user.delete({ where: { id: otherUserId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('serverService.createServer', () => {
    it('created a server with auto-generated slug in beforeAll', async () => {
      const server = await prisma.server.findUnique({ where: { id: createdServerId } });
      expect(server).not.toBeNull();
      expect(server!.name).toBe('My Test Server');
      expect(server!.slug).toBe('my-test-server');
      expect(server!.ownerId).toBe(ownerUserId);
      expect(server!.isPublic).toBe(true);
      expect(server!.memberCount).toBe(1); // owner auto-added as member
    });

    it('adds the owner to server_members with OWNER role (issue #169)', async () => {
      const membership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: ownerUserId, serverId: createdServerId } },
      });
      expect(membership).not.toBeNull();
      expect(membership!.role).toBe('OWNER');
    });

    it('rejects a name that generates an empty slug', async () => {
      await expect(
        serverService.createServer({ name: '!@#$%', ownerId: ownerUserId }),
      ).rejects.toThrow(TRPCError);
    });
  });

  describe('serverService.getServer', () => {
    it('returns the server by slug for a member', async () => {
      const server = await serverService.getServer('my-test-server', ownerUserId);
      expect(server.id).toBe(createdServerId);
    });

    it('returns the server by slug for a non-member when public', async () => {
      const server = await serverService.getServer('my-test-server', otherUserId);
      expect(server.id).toBe(createdServerId);
    });

    it('throws NOT_FOUND for unknown slug', async () => {
      await expect(serverService.getServer('no-such-server-xyz', ownerUserId)).rejects.toMatchObject({
        code: 'NOT_FOUND',
      });
    });

    it('throws NOT_FOUND for private server when non-member requests it', async () => {
      const privateServer = await serverService.createServer({
        name: `Private ${Date.now()}`,
        ownerId: ownerUserId,
        isPublic: false,
      });
      try {
        await expect(
          serverService.getServer(privateServer.slug, otherUserId),
        ).rejects.toMatchObject({ code: 'NOT_FOUND' });
      } finally {
        await prisma.server.delete({ where: { id: privateServer.id } }).catch(() => {});
      }
    });

    it('returns private server data when the requester is a member', async () => {
      const privateServer = await serverService.createServer({
        name: `PrivateMember ${Date.now()}`,
        ownerId: ownerUserId,
        isPublic: false,
      });
      try {
        const result = await serverService.getServer(privateServer.slug, ownerUserId);
        expect(result.id).toBe(privateServer.id);
      } finally {
        await prisma.server.delete({ where: { id: privateServer.id } }).catch(() => {});
      }
    });
  });

  describe('serverService.getPublicServers', () => {
    it('returns only public servers', async () => {
      const servers = await serverService.getPublicServers();
      expect(Array.isArray(servers)).toBe(true);
      expect(servers.every((s) => s.isPublic)).toBe(true);
      expect(servers.some((s) => s.id === createdServerId)).toBe(true);
    });

    it('respects the limit parameter', async () => {
      const servers = await serverService.getPublicServers(1);
      expect(servers.length).toBeLessThanOrEqual(1);
    });
  });

  describe('serverService.updateServer', () => {
    it('updates server name and regenerates slug', async () => {
      const updated = await serverService.updateServer(createdServerId, ownerUserId, {
        name: 'Renamed Server',
      });
      expect(updated.name).toBe('Renamed Server');
      expect(updated.slug).toBe('renamed-server');
    });

    it('updates description without changing slug', async () => {
      const updated = await serverService.updateServer(createdServerId, ownerUserId, {
        description: 'A great server',
      });
      expect(updated.description).toBe('A great server');
      expect(updated.slug).toBe('renamed-server');
    });

    it('throws FORBIDDEN when non-owner tries to update', async () => {
      await expect(
        serverService.updateServer(createdServerId, otherUserId, { name: 'Hijacked' }),
      ).rejects.toThrow(TRPCError);
      const err = await serverService
        .updateServer(createdServerId, otherUserId, { name: 'Hijacked' })
        .catch((e: TRPCError) => e);
      expect((err as TRPCError).code).toBe('FORBIDDEN');
    });

    it('throws NOT_FOUND for unknown server id', async () => {
      await expect(
        serverService.updateServer('00000000-0000-0000-0000-000000000000', ownerUserId, {
          name: 'Ghost',
        }),
      ).rejects.toThrow(TRPCError);
    });
  });

  describe('serverService.incrementMemberCount / decrementMemberCount', () => {
    it('increments member count', async () => {
      const updated = await serverService.incrementMemberCount(createdServerId);
      // Starts at 1 (owner auto-added), so after increment → 2
      expect(updated.memberCount).toBe(2);
    });

    it('decrements member count', async () => {
      const updated = await serverService.decrementMemberCount(createdServerId);
      expect(updated.memberCount).toBe(1);
    });

    it('decrements member count to zero', async () => {
      const updated = await serverService.decrementMemberCount(createdServerId);
      expect(updated.memberCount).toBe(0);
    });

    it('throws BAD_REQUEST when decrementing at zero', async () => {
      await expect(serverService.decrementMemberCount(createdServerId)).rejects.toThrow(TRPCError);
    });
  });

  describe('serverService.deleteServer', () => {
    it('throws FORBIDDEN when non-owner tries to delete', async () => {
      const err = await serverService
        .deleteServer(createdServerId, otherUserId)
        .catch((e: TRPCError) => e);
      expect((err as TRPCError).code).toBe('FORBIDDEN');
    });

    it('deletes the server when called by owner', async () => {
      await serverService.deleteServer(createdServerId, ownerUserId);
      createdServerId = ''; // prevent afterAll from double-deleting
      const server = await prisma.server.findUnique({ where: { slug: 'renamed-server' } });
      expect(server).toBeNull();
    });

    it('throws NOT_FOUND for already-deleted server', async () => {
      await expect(
        serverService.deleteServer('00000000-0000-0000-0000-000000000000', ownerUserId),
      ).rejects.toThrow(TRPCError);
    });
  });
}); // end serverService (integration)

// ─── tRPC router integration tests ──────────────────────────────────────────

describe('server tRPC router', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  it('server.getServer requires authentication', async () => {
    const res = await request(app).get(
      '/trpc/server.getServer?input=%7B%22slug%22%3A%22some-server%22%7D',
    );
    expect(res.status).toBe(401);
  });

  it('server.getServer returns NOT_FOUND for private server when requester is not a member', async () => {
    const prismaLocal = new PrismaClient();
    const ts = Date.now();
    const { accessToken } = await authService.register(
      `getserver-nonmember-${ts}@example.com`,
      `gs_nonmember_${ts}`,
      TEST_PASSWORD_SALT,
      derivePasswordVerifier('password123'),
    );
    const owner = await prismaLocal.user.create({
      data: {
        email: `getserver-owner-${ts}@example.com`,
        username: `gs_owner_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'GS Owner',
      },
    });
    const privateServer = await prismaLocal.server.create({
      data: { name: `Private ${ts}`, slug: `private-${ts}`, ownerId: owner.id, isPublic: false },
    });

    const input = encodeURIComponent(JSON.stringify({ slug: privateServer.slug }));
    const res = await request(app)
      .get(`/trpc/server.getServer?input=${input}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(404);

    await prismaLocal.server.delete({ where: { id: privateServer.id } }).catch(() => {});
    const nonMember = await prismaLocal.user.findUnique({
      where: { email: `getserver-nonmember-${ts}@example.com` },
    });
    if (nonMember) await prismaLocal.user.delete({ where: { id: nonMember.id } }).catch(() => {});
    await prismaLocal.user.delete({ where: { id: owner.id } }).catch(() => {});
    await prismaLocal.$disconnect();
  });

  it('server.getServers requires authentication', async () => {
    const res = await request(app).get('/trpc/server.getServers');
    expect(res.status).toBe(401);
  });

  it('server.createServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.createServer')
      .send({ name: 'Test Server' })
      .set('Content-Type', 'application/json');
    // tRPC returns 401 for unauthenticated mutations
    expect(res.status).toBe(401);
  });

  it('server.updateServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.updateServer')
      .send({ id: '00000000-0000-0000-0000-000000000000', name: 'New Name' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
  });

  it('server.deleteServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.deleteServer')
      .send({ id: '00000000-0000-0000-0000-000000000000' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
  });

  it('server.getMembers requires authentication', async () => {
    const input = encodeURIComponent(JSON.stringify({ serverId: '00000000-0000-0000-0000-000000000000' }));
    const res = await request(app).get(`/trpc/server.getMembers?input=${input}`);
    expect(res.status).toBe(401);
  });

  it('server.getMembers returns FORBIDDEN for non-member', async () => {
    const prismaLocal = new PrismaClient();
    const ts = Date.now();
    const { accessToken } = await authService.register(
      `getmembers-nonmember-${ts}@example.com`,
      `gm_nonmember_${ts}`,
      TEST_PASSWORD_SALT,
      derivePasswordVerifier('password123'),
    );
    const user = await prismaLocal.user.findUnique({
      where: { email: `getmembers-nonmember-${ts}@example.com` },
    });

    const input = encodeURIComponent(JSON.stringify({ serverId: '00000000-0000-0000-0000-000000000000' }));
    const res = await request(app)
      .get(`/trpc/server.getMembers?input=${input}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(403);

    if (user) await prismaLocal.user.delete({ where: { id: user.id } }).catch(() => {});
    await prismaLocal.$disconnect();
  });

  it('server.getMembers returns member list for authenticated server member', async () => {
    const prismaLocal = new PrismaClient();
    const ts = Date.now();

    const { accessToken } = await authService.register(
      `getmembers-member-${ts}@example.com`,
      `gm_member_${ts}`,
      TEST_PASSWORD_SALT,
      derivePasswordVerifier('password123'),
    );
    const user = await prismaLocal.user.findUniqueOrThrow({
      where: { email: `getmembers-member-${ts}@example.com` },
    });
    const server = await prismaLocal.server.create({
      data: { name: `GM Router ${ts}`, slug: `gm-router-${ts}`, ownerId: user.id },
    });
    await prismaLocal.serverMember.create({
      data: { userId: user.id, serverId: server.id, role: 'OWNER' },
    });

    const input = encodeURIComponent(JSON.stringify({ serverId: server.id }));
    const res = await request(app)
      .get(`/trpc/server.getMembers?input=${input}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    const members = res.body.result.data as { userId: string; role: string }[];
    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThanOrEqual(1);
    expect(members.some((m) => m.userId === user.id && m.role === 'OWNER')).toBe(true);

    await prismaLocal.server.delete({ where: { id: server.id } }).catch(() => {});
    await prismaLocal.user.delete({ where: { id: user.id } }).catch(() => {});
    await prismaLocal.$disconnect();
  });
});
