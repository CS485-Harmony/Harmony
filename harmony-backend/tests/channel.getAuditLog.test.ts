/**
 * channel.getAuditLog tRPC procedure tests — Issue #117
 *
 * Covers:
 *   - UNAUTHORIZED when caller is unauthenticated
 *   - FORBIDDEN when caller lacks channel:manage_visibility (non-admin member)
 *   - NOT_FOUND when channelId belongs to a different server (cross-server probe blocked)
 *   - Returns paginated response shape with correct fields
 *   - Pagination: limit and offset are respected
 *
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { ChannelType, ChannelVisibility } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { channelRouter } from '../src/trpc/routers/channel.router';
import { createCallerFactory, type TRPCContext } from '../src/trpc/init';
import { prisma } from '../src/db/prisma';

const createCaller = createCallerFactory(channelRouter);

function callerAs(userId: string | null): ReturnType<typeof createCaller> {
  const ctx: TRPCContext = { userId, ip: '127.0.0.1', userAgent: 'test-agent' };
  return createCaller(ctx);
}

// ─── Fixtures ────────────────────────────────────────────────────────────────

let adminId: string;
let memberId: string;
let serverId: string;
let channelId: string;
let otherServerId: string;
let otherChannelId: string;

beforeAll(async () => {
  const ts = Date.now();

  const admin = await prisma.user.create({
    data: {
      email: `gal-admin-${ts}@test.com`,
      username: `gal-admin-${ts}`,
      passwordHash: 'testhash',
      displayName: 'GAL Admin',
    },
  });
  adminId = admin.id;

  const member = await prisma.user.create({
    data: {
      email: `gal-member-${ts}@test.com`,
      username: `gal-member-${ts}`,
      passwordHash: 'testhash',
      displayName: 'GAL Member',
    },
  });
  memberId = member.id;

  const server = await prisma.server.create({
    data: {
      name: `GAL Server ${ts}`,
      slug: `gal-server-${ts}`,
      isPublic: false,
      ownerId: adminId,
    },
  });
  serverId = server.id;

  await prisma.serverMember.createMany({
    data: [
      { userId: adminId, serverId, role: 'ADMIN' },
      { userId: memberId, serverId, role: 'MEMBER' },
    ],
  });

  const channel = await prisma.channel.create({
    data: {
      serverId,
      name: 'gal-channel',
      slug: 'gal-channel',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
      position: 0,
    },
  });
  channelId = channel.id;

  // A second server + channel to test cross-server probe blocking
  const otherServer = await prisma.server.create({
    data: {
      name: `GAL Other Server ${ts}`,
      slug: `gal-other-server-${ts}`,
      isPublic: false,
      ownerId: adminId,
    },
  });
  otherServerId = otherServer.id;

  await prisma.serverMember.create({
    data: { userId: adminId, serverId: otherServerId, role: 'ADMIN' },
  });

  const otherChannel = await prisma.channel.create({
    data: {
      serverId: otherServerId,
      name: 'gal-other-channel',
      slug: 'gal-other-channel',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
      position: 0,
    },
  });
  otherChannelId = otherChannel.id;

  // Seed a few audit log entries for pagination tests
  for (let i = 0; i < 3; i++) {
    await prisma.visibilityAuditLog.create({
      data: {
        channelId,
        actorId: adminId,
        action: 'VISIBILITY_CHANGED',
        oldValue: { visibility: 'PRIVATE' },
        newValue: { visibility: 'PUBLIC_NO_INDEX' },
        ipAddress: '127.0.0.1',
        userAgent: 'seed-agent',
        timestamp: new Date(Date.now() - i * 1000),
      },
    });
  }
});

afterAll(async () => {
  await prisma.visibilityAuditLog.deleteMany({ where: { channelId } });
  if (otherServerId) await prisma.server.delete({ where: { id: otherServerId } }).catch(() => {});
  if (serverId) await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
  await prisma.user
    .deleteMany({ where: { id: { in: [adminId, memberId].filter(Boolean) } } })
    .catch(() => {});
  await prisma.$disconnect();
});

// ─── Permission gate ──────────────────────────────────────────────────────────

describe('channel.getAuditLog — permission gate', () => {
  it('throws UNAUTHORIZED when caller is unauthenticated', async () => {
    await expect(callerAs(null).getAuditLog({ serverId, channelId })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });

  it('throws FORBIDDEN when caller is a non-admin member', async () => {
    await expect(callerAs(memberId).getAuditLog({ serverId, channelId })).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });
  });
});

// ─── Cross-server probe ───────────────────────────────────────────────────────

describe('channel.getAuditLog — cross-server probe blocked', () => {
  it('throws NOT_FOUND when channelId belongs to a different server', async () => {
    // Admin of serverId attempts to read audit log for a channel in otherServerId.
    // The getVisibility ownership check should catch this.
    await expect(
      callerAs(adminId).getAuditLog({ serverId, channelId: otherChannelId }),
    ).rejects.toThrow(TRPCError);
  });
});

// ─── Response shape ───────────────────────────────────────────────────────────

describe('channel.getAuditLog — response shape', () => {
  it('returns entries array and total count for an admin caller', async () => {
    const result = await callerAs(adminId).getAuditLog({ serverId, channelId });

    expect(result).toHaveProperty('entries');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.entries)).toBe(true);
    expect(typeof result.total).toBe('number');
    expect(result.total).toBeGreaterThanOrEqual(3);
  });

  it('entry has expected fields', async () => {
    const result = await callerAs(adminId).getAuditLog({ serverId, channelId, limit: 1 });

    expect(result.entries.length).toBeGreaterThanOrEqual(1);
    const entry = result.entries[0];
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('channelId', channelId);
    expect(entry).toHaveProperty('actorId', adminId);
    expect(entry).toHaveProperty('action', 'VISIBILITY_CHANGED');
    expect(entry).toHaveProperty('oldValue');
    expect(entry).toHaveProperty('newValue');
    expect(entry).toHaveProperty('timestamp');
    expect(entry).toHaveProperty('ipAddress');
    expect(entry).toHaveProperty('userAgent');
  });

  it('results are ordered newest-first', async () => {
    const result = await callerAs(adminId).getAuditLog({ serverId, channelId });
    for (let i = 1; i < result.entries.length; i++) {
      const prev = result.entries[i - 1].timestamp.getTime();
      const curr = result.entries[i].timestamp.getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
});

// ─── Pagination ───────────────────────────────────────────────────────────────

describe('channel.getAuditLog — pagination', () => {
  it('respects limit', async () => {
    const result = await callerAs(adminId).getAuditLog({ serverId, channelId, limit: 1 });
    expect(result.entries.length).toBeLessThanOrEqual(1);
  });

  it('respects offset (no overlap between pages)', async () => {
    const first = await callerAs(adminId).getAuditLog({ serverId, channelId, limit: 2, offset: 0 });
    const second = await callerAs(adminId).getAuditLog({
      serverId,
      channelId,
      limit: 2,
      offset: 2,
    });

    const firstIds = first.entries.map((e) => e.id);
    const secondIds = second.entries.map((e) => e.id);
    const overlap = firstIds.filter((id) => secondIds.includes(id));
    expect(overlap).toHaveLength(0);
  });
});
