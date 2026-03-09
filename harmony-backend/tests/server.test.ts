import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createApp } from '../src/app';
import { generateSlug, serverService } from '../src/services/server.service';
import type { Express } from 'express';
import type { Server } from '@prisma/client';

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

  it('rejects a name that generates an empty slug', async () => {
    await expect(
      serverService.createServer({ name: '!@#$%', ownerId: ownerUserId }),
    ).rejects.toThrow(TRPCError);
  });
});

describe('serverService.getServer', () => {
  it('returns the server by slug', async () => {
    const server = await serverService.getServer('my-test-server');
    expect(server).not.toBeNull();
    expect(server!.id).toBe(createdServerId);
  });

  it('returns null for unknown slug', async () => {
    const server = await serverService.getServer('no-such-server-xyz');
    expect(server).toBeNull();
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
    await expect(
      serverService.decrementMemberCount(createdServerId),
    ).rejects.toThrow(TRPCError);
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
    const res = await request(app).get('/trpc/server.getServer?input=%7B%22slug%22%3A%22some-server%22%7D');
    expect(res.status).toBe(401);
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
});
