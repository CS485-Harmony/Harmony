/**
 * Pin permission tests — Issue #248 (mocked, no database required)
 *
 * Validates the acceptance criteria for the pin/unpin permission bug:
 *
 * 1. `message:pin` is granted only to MODERATOR, ADMIN, OWNER — never MEMBER or GUEST.
 * 2. The tRPC `pinMessage` / `unpinMessage` endpoints return FORBIDDEN (HTTP 403)
 *    when a MEMBER or GUEST attempts the action — NOT an HTTP 500.
 * 3. The FORBIDDEN error includes a human-readable permission-denied message.
 * 4. Existing backend permission enforcement for MODERATOR+ is unchanged.
 *
 * All Prisma calls are mocked so no running database is required.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Stable IDs ──────────────────────────────────────────────────────────────

const SERVER_ID = '00000000-0000-0000-0000-000000000001';
const CHANNEL_ID = '00000000-0000-0000-0000-000000000002';
const MESSAGE_ID = '00000000-0000-0000-0000-000000000003';

const USER_IDS: Record<string, string> = {
  OWNER: '10000000-0000-0000-0000-000000000001',
  ADMIN: '10000000-0000-0000-0000-000000000002',
  MODERATOR: '10000000-0000-0000-0000-000000000003',
  MEMBER: '10000000-0000-0000-0000-000000000004',
  GUEST: '10000000-0000-0000-0000-000000000005',
  nonMember: '10000000-0000-0000-0000-000000000006',
};

// Map userId → role for mock lookup
const USER_ROLES: Record<string, string> = {
  [USER_IDS.OWNER]: 'OWNER',
  [USER_IDS.ADMIN]: 'ADMIN',
  [USER_IDS.MODERATOR]: 'MODERATOR',
  [USER_IDS.MEMBER]: 'MEMBER',
  [USER_IDS.GUEST]: 'GUEST',
  // nonMember has no entry → findUnique returns null
};

// ─── Mutable mock state ──────────────────────────────────────────────────────
// Tests can flip this before calling unpinMessage so the mock returns pinned: true.
let mockMessagePinned = false;

// ─── Mock Prisma ─────────────────────────────────────────────────────────────
// Must be declared before any import that transitively touches prisma.

jest.mock('../src/db/prisma', () => {
  const mockServerMemberFindUnique = jest.fn().mockImplementation(({ where }: any) => {
    const { userId, serverId } = where.userId_serverId ?? {};
    if (serverId !== SERVER_ID) return Promise.resolve(null);
    const role = USER_ROLES[userId];
    if (!role) return Promise.resolve(null);
    return Promise.resolve({ userId, serverId, role });
  });

  const mockServerFindUnique = jest.fn().mockImplementation(({ where }: any) => {
    if (where.id === SERVER_ID) return Promise.resolve({ id: SERVER_ID });
    return Promise.resolve(null);
  });

  // user.findUnique is called by admin.utils → isSystemAdmin; return non-admin
  const mockUserFindUnique = jest.fn().mockResolvedValue({ email: 'regular@test.com' });

  // Build a fake message returned by pinMessage / unpinMessage transactions
  const makeFakeMessage = (pinned: boolean) => ({
    id: MESSAGE_ID,
    channelId: CHANNEL_ID,
    content: 'message to pin',
    pinned,
    pinnedAt: pinned ? new Date() : null,
    isDeleted: false,
    author: { id: USER_IDS.OWNER, username: 'owner', displayName: 'Owner', avatarUrl: null },
    attachments: [],
    channel: { serverId: SERVER_ID },
  });

  // $transaction receives an async callback; give it a tx object with message ops.
  // Reads mockMessagePinned at call time so tests can control the initial state.
  const mock$transaction = jest.fn().mockImplementation(async (cb: any) => {
    const tx = {
      message: {
        findUnique: jest.fn().mockImplementation(() =>
          Promise.resolve({
            id: MESSAGE_ID,
            channelId: CHANNEL_ID,
            isDeleted: false,
            pinned: mockMessagePinned,
            channel: { serverId: SERVER_ID },
          }),
        ),
        update: jest.fn().mockImplementation(({ data }: any) =>
          Promise.resolve(makeFakeMessage(data.pinned)),
        ),
      },
    };
    return cb(tx);
  });

  return {
    prisma: {
      server: { findUnique: mockServerFindUnique },
      serverMember: { findUnique: mockServerMemberFindUnique },
      user: { findUnique: mockUserFindUnique },
      message: {
        findUnique: jest.fn().mockResolvedValue(makeFakeMessage(false)),
        update: jest.fn().mockImplementation(({ data }: any) =>
          Promise.resolve(makeFakeMessage(data?.pinned ?? false)),
        ),
        findMany: jest.fn().mockResolvedValue([]),
      },
      channel: {
        findUnique: jest.fn().mockResolvedValue({ id: CHANNEL_ID, serverId: SERVER_ID }),
      },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
      refreshToken: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
      $transaction: mock$transaction,
    },
  };
});

// Mock Redis-backed cache service so it doesn't try to connect
jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    getOrRevalidate: jest.fn().mockImplementation((_key: string, _ttl: number, fetcher: () => any) => fetcher()),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
  },
  CacheTTL: { SHORT: 60, MEDIUM: 300, LONG: 3600, VERY_LONG: 86400 },
  sanitizeKeySegment: (s: string) => s,
}));

// Mock eventBus so it doesn't error
jest.mock('../src/events/eventBus', () => ({
  eventBus: { emit: jest.fn() },
  EventChannels: {},
}));

// ─── Imports (after mocks) ───────────────────────────────────────────────────

import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { permissionService } from '../src/services/permission.service';
import { createCallerFactory, type TRPCContext } from '../src/trpc/init';
import { appRouter } from '../src/trpc/router';
import { createApp } from '../src/app';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-in-prod';

const createCaller = createCallerFactory(appRouter);

function callerAs(userId: string | null): ReturnType<typeof createCaller> {
  const ctx: TRPCContext = { userId, ip: '127.0.0.1', userAgent: 'test-agent' };
  return createCaller(ctx);
}

// ─── 1. Permission matrix for message:pin ────────────────────────────────────

describe('message:pin permission matrix', () => {
  const ALLOWED = ['OWNER', 'ADMIN', 'MODERATOR'] as const;
  const DENIED = ['MEMBER', 'GUEST', 'nonMember'] as const;

  for (const role of ALLOWED) {
    it(`${role} can message:pin`, async () => {
      const result = await permissionService.checkPermission(USER_IDS[role], SERVER_ID, 'message:pin');
      expect(result).toBe(true);
    });
  }

  for (const role of DENIED) {
    it(`${role} cannot message:pin`, async () => {
      const result = await permissionService.checkPermission(USER_IDS[role], SERVER_ID, 'message:pin');
      expect(result).toBe(false);
    });
  }
});

// ─── 2. requirePermission throws FORBIDDEN with clear message ────────────────

describe('requirePermission rejects MEMBER/GUEST for message:pin', () => {
  it('throws FORBIDDEN for MEMBER with human-readable message', async () => {
    await expect(
      permissionService.requirePermission(USER_IDS.MEMBER, SERVER_ID, 'message:pin'),
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
      message: expect.stringContaining('message:pin'),
    });
  });

  it('throws FORBIDDEN for GUEST with human-readable message', async () => {
    await expect(
      permissionService.requirePermission(USER_IDS.GUEST, SERVER_ID, 'message:pin'),
    ).rejects.toMatchObject({
      code: 'FORBIDDEN',
      message: expect.stringContaining('message:pin'),
    });
  });

  it('resolves without error for MODERATOR', async () => {
    await expect(
      permissionService.requirePermission(USER_IDS.MODERATOR, SERVER_ID, 'message:pin'),
    ).resolves.toBeUndefined();
  });
});

// ─── 3. tRPC caller — pinMessage returns FORBIDDEN for MEMBER ────────────────

describe('tRPC message.pinMessage — permission enforcement', () => {
  it('MODERATOR can pin a message via tRPC', async () => {
    const caller = callerAs(USER_IDS.MODERATOR);
    const result = await caller.message.pinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID });
    expect(result.pinned).toBe(true);
  });

  it('MEMBER receives FORBIDDEN when trying to pin', async () => {
    const caller = callerAs(USER_IDS.MEMBER);
    const err = await caller.message
      .pinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID })
      .catch((e: TRPCError) => e);
    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe('FORBIDDEN');
  });

  it('GUEST receives FORBIDDEN when trying to pin', async () => {
    const caller = callerAs(USER_IDS.GUEST);
    const err = await caller.message
      .pinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID })
      .catch((e: TRPCError) => e);
    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe('FORBIDDEN');
  });

  it('unauthenticated user receives UNAUTHORIZED', async () => {
    const caller = callerAs(null);
    const err = await caller.message
      .pinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID })
      .catch((e: TRPCError) => e);
    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe('UNAUTHORIZED');
  });
});

// ─── 4. tRPC caller — unpinMessage returns FORBIDDEN for MEMBER ──────────────

describe('tRPC message.unpinMessage — permission enforcement', () => {
  beforeAll(() => { mockMessagePinned = true; });
  afterAll(() => { mockMessagePinned = false; });

  it('MODERATOR can unpin a message via tRPC', async () => {
    const caller = callerAs(USER_IDS.MODERATOR);
    const result = await caller.message.unpinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID });
    expect(result.pinned).toBe(false);
  });

  it('MEMBER receives FORBIDDEN when trying to unpin', async () => {
    const caller = callerAs(USER_IDS.MEMBER);
    const err = await caller.message
      .unpinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID })
      .catch((e: TRPCError) => e);
    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe('FORBIDDEN');
  });

  it('GUEST receives FORBIDDEN when trying to unpin', async () => {
    const caller = callerAs(USER_IDS.GUEST);
    const err = await caller.message
      .unpinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID })
      .catch((e: TRPCError) => e);
    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe('FORBIDDEN');
  });
});

// ─── 5. HTTP layer — FORBIDDEN maps to 403 (not 500) ────────────────────────

describe('HTTP status code for pin permission denial', () => {
  const app = createApp();
  const memberToken = jwt.sign({ sub: USER_IDS.MEMBER }, ACCESS_SECRET, { expiresIn: '15m' });
  const guestToken = jwt.sign({ sub: USER_IDS.GUEST }, ACCESS_SECRET, { expiresIn: '15m' });

  it('returns HTTP 403 (not 500) when MEMBER tries to pin', async () => {
    const res = await request(app)
      .post('/trpc/message.pinMessage')
      .set('Authorization', `Bearer ${memberToken}`)
      .set('Content-Type', 'application/json')
      .send({ serverId: SERVER_ID, messageId: MESSAGE_ID });

    expect(res.status).toBe(403);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.data.code).toBe('FORBIDDEN');
  });

  it('returns HTTP 403 (not 500) when MEMBER tries to unpin', async () => {
    const res = await request(app)
      .post('/trpc/message.unpinMessage')
      .set('Authorization', `Bearer ${memberToken}`)
      .set('Content-Type', 'application/json')
      .send({ serverId: SERVER_ID, messageId: MESSAGE_ID });

    expect(res.status).toBe(403);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.data.code).toBe('FORBIDDEN');
  });

  it('returns HTTP 403 (not 500) when GUEST tries to pin', async () => {
    const res = await request(app)
      .post('/trpc/message.pinMessage')
      .set('Authorization', `Bearer ${guestToken}`)
      .set('Content-Type', 'application/json')
      .send({ serverId: SERVER_ID, messageId: MESSAGE_ID });

    expect(res.status).toBe(403);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.data.code).toBe('FORBIDDEN');
  });

  it('returns HTTP 401 when unauthenticated user tries to pin', async () => {
    const res = await request(app)
      .post('/trpc/message.pinMessage')
      .set('Content-Type', 'application/json')
      .send({ serverId: SERVER_ID, messageId: MESSAGE_ID });

    expect(res.status).toBe(401);
  });
});

// ─── 6. Existing enforcement unchanged — MODERATOR+ can still pin ────────────

describe('existing pin enforcement unchanged', () => {
  it('OWNER can pin via tRPC', async () => {
    const caller = callerAs(USER_IDS.OWNER);
    const result = await caller.message.pinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID });
    expect(result.pinned).toBe(true);
    expect(result.pinnedAt).toBeTruthy();
  });

  it('ADMIN can pin via tRPC', async () => {
    const caller = callerAs(USER_IDS.ADMIN);
    const result = await caller.message.pinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID });
    expect(result.pinned).toBe(true);
  });

  it('MODERATOR can pin via tRPC', async () => {
    const caller = callerAs(USER_IDS.MODERATOR);
    const result = await caller.message.pinMessage({ serverId: SERVER_ID, messageId: MESSAGE_ID });
    expect(result.pinned).toBe(true);
  });
});
