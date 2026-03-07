/**
 * withPermission middleware tests — Issue #102 (PR #141 review)
 *
 * Tests the tRPC withPermission middleware in isolation using a minimal
 * in-process test router + createCallerFactory.
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { router, withPermission, createCallerFactory, type TRPCContext } from '../src/trpc/init';

const prisma = new PrismaClient();

// ─── Minimal test router ─────────────────────────────────────────────────────

const testRouter = router({
  doChannelCreate: withPermission('channel:create')
    .input(z.object({ serverId: z.string().uuid() }))
    .query(() => ({ ok: true })),

  missingServerId: withPermission('channel:create')
    .input(z.object({ name: z.string() }))
    .query(() => ({ ok: true })),
});

const createCaller = createCallerFactory(testRouter);

function callerAs(userId: string | null): ReturnType<typeof createCaller> {
  const ctx: TRPCContext = { userId, ip: '127.0.0.1' };
  return createCaller(ctx);
}

// ─── Fixtures ────────────────────────────────────────────────────────────────

let serverId: string;
let ownerId: string;
let memberId: string;
const UNKNOWN_SERVER = '00000000-0000-0000-0000-000000000001';

beforeAll(async () => {
  const ts = Date.now();

  const owner = await prisma.user.create({
    data: {
      email: `mw-owner-${ts}@test.com`,
      username: `mw-owner-${ts}`,
      passwordHash: 'testhash',
      displayName: 'MW Owner',
    },
  });
  ownerId = owner.id;

  const member = await prisma.user.create({
    data: {
      email: `mw-member-${ts}@test.com`,
      username: `mw-member-${ts}`,
      passwordHash: 'testhash',
      displayName: 'MW Member',
    },
  });
  memberId = member.id;

  const server = await prisma.server.create({
    data: { name: `MW Server ${ts}`, slug: `mw-server-${ts}` },
  });
  serverId = server.id;

  await prisma.serverMember.createMany({
    data: [
      { userId: ownerId, serverId, role: 'OWNER' },
      { userId: memberId, serverId, role: 'MEMBER' },
    ],
  });
});

afterAll(async () => {
  await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
  await prisma.user
    .deleteMany({ where: { id: { in: [ownerId, memberId].filter(Boolean) } } })
    .catch(() => {});
  await prisma.$disconnect();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('withPermission middleware — UNAUTHORIZED', () => {
  it('throws UNAUTHORIZED when userId is null (unauthenticated caller)', async () => {
    await expect(
      callerAs(null).doChannelCreate({ serverId }),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });
});

describe('withPermission middleware — BAD_REQUEST', () => {
  it('throws BAD_REQUEST when input has no serverId', async () => {
    await expect(
      callerAs(ownerId).missingServerId({ name: 'test' }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});

describe('withPermission middleware — unknown server', () => {
  it('throws FORBIDDEN (not NOT_FOUND) for an unknown serverId to prevent info leakage', async () => {
    const err = await callerAs(ownerId)
      .doChannelCreate({ serverId: UNKNOWN_SERVER })
      .catch((e: TRPCError) => e);
    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe('FORBIDDEN');
  });
});

describe('withPermission middleware — permission granted', () => {
  it('resolves when the caller holds the required permission (OWNER → channel:create)', async () => {
    await expect(
      callerAs(ownerId).doChannelCreate({ serverId }),
    ).resolves.toEqual({ ok: true });
  });
});

describe('withPermission middleware — permission denied', () => {
  it('throws FORBIDDEN when caller lacks the action (MEMBER → channel:create)', async () => {
    await expect(
      callerAs(memberId).doChannelCreate({ serverId }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });
});
