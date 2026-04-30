/**
 * notification.router.test.ts — Issue #574
 *
 * Integration-style tests for the tRPC notification endpoints using supertest.
 * Prisma is mocked so no live database is required.
 *
 * Covers:
 *   - notification.markAsRead   : persists the read flag for the authed user
 *   - notification.markAllAsRead: persists read for all unread of the authed user
 *   - Both endpoints reject unauthenticated requests
 */

// ─── Prisma mock ──────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    notification: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    notificationPreference: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    },
    pushSubscription: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    serverMember: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
  },
}));

// ─── Auth service mock ────────────────────────────────────────────────────────

const AUTHED_USER_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

jest.mock('../src/services/auth.service', () => ({
  authService: {
    verifyAccessToken: jest.fn((token: string) => {
      if (token === 'valid-token') return { sub: AUTHED_USER_ID };
      throw new Error('Invalid token');
    }),
  },
}));

jest.mock('../src/services/presence.service', () => ({
  presenceService: { startSweeper: jest.fn() },
}));

jest.mock('../src/db/redis', () => ({
  redis: { call: jest.fn(), quit: jest.fn() },
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/db/prisma';

const mockPrisma = prisma as unknown as {
  notification: {
    findMany: jest.Mock;
    count: jest.Mock;
    updateMany: jest.Mock;
  };
};

const app = createApp();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authedPost(path: string, body?: object) {
  return request(app)
    .post(path)
    .set('Authorization', 'Bearer valid-token')
    .set('Origin', 'http://localhost:3000')
    .send(body ?? {});
}

function authedGet(path: string) {
  return request(app)
    .get(path)
    .set('Authorization', 'Bearer valid-token')
    .set('Origin', 'http://localhost:3000');
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });
  mockPrisma.notification.findMany.mockResolvedValue([]);
  mockPrisma.notification.count.mockResolvedValue(0);
});

describe('POST /trpc/notification.markAsRead', () => {
  const NOTIF_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  it('returns 200 and calls updateMany with correct args for the authed user', async () => {
    const res = await authedPost('/trpc/notification.markAsRead', {
      notificationId: NOTIF_ID,
    });

    expect(res.status).toBe(200);
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
      where: { id: NOTIF_ID, userId: AUTHED_USER_ID },
      data: { read: true },
    });
  });

  it('returns the batch payload in the tRPC result envelope', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });

    const res = await authedPost('/trpc/notification.markAsRead', {
      notificationId: NOTIF_ID,
    });

    expect(res.body).toMatchObject({ result: { data: { count: 1 } } });
  });

  it('rejects requests without a valid token with UNAUTHORIZED', async () => {
    const res = await request(app)
      .post('/trpc/notification.markAsRead')
      .set('Origin', 'http://localhost:3000')
      .send({ notificationId: NOTIF_ID });

    expect(res.status).toBe(401);
  });

  it('rejects requests with an invalid notificationId (not a UUID)', async () => {
    const res = await authedPost('/trpc/notification.markAsRead', {
      notificationId: 'not-a-uuid',
    });

    expect(res.status).toBe(400);
    expect(mockPrisma.notification.updateMany).not.toHaveBeenCalled();
  });
});

describe('POST /trpc/notification.markAllAsRead', () => {
  it('returns 200 and calls updateMany scoped to userId and read:false', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 3 });

    const res = await authedPost('/trpc/notification.markAllAsRead');

    expect(res.status).toBe(200);
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: AUTHED_USER_ID, read: false },
      data: { read: true },
    });
  });

  it('returns the batch payload in the tRPC result envelope', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 3 });

    const res = await authedPost('/trpc/notification.markAllAsRead');

    expect(res.body).toMatchObject({ result: { data: { count: 3 } } });
  });

  it('rejects unauthenticated requests with UNAUTHORIZED', async () => {
    const res = await request(app)
      .post('/trpc/notification.markAllAsRead')
      .set('Origin', 'http://localhost:3000')
      .send({});

    expect(res.status).toBe(401);
    expect(mockPrisma.notification.updateMany).not.toHaveBeenCalled();
  });

  it('returns count 0 when there are no unread notifications', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 0 });

    const res = await authedPost('/trpc/notification.markAllAsRead');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ result: { data: { count: 0 } } });
  });
});

describe('GET /trpc/notification.getUnreadCount', () => {
  it('returns the unread count for the authed user', async () => {
    mockPrisma.notification.count.mockResolvedValue(4);

    const res = await authedGet('/trpc/notification.getUnreadCount');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ result: { data: 4 } });
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app)
      .get('/trpc/notification.getUnreadCount')
      .set('Origin', 'http://localhost:3000');

    expect(res.status).toBe(401);
  });
});
