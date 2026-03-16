/**
 * events.router.member.test.ts — Issue #186
 *
 * Integration tests for member:joined / member:left SSE events on
 * GET /api/events/server/:serverId.
 *
 * eventBus, prisma, and authService are mocked — no running Redis/DB needed.
 */

import http from 'http';
import request from 'supertest';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';
const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440002';
const JOINING_USER_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

// ─── Mock eventBus ─────────────────────────────────────────────────────────────

jest.mock('../src/events/eventBus', () => ({
  eventBus: {
    subscribe: jest.fn(),
    publish: jest.fn().mockResolvedValue(undefined),
  },
  EventChannels: {
    MESSAGE_CREATED: 'harmony:MESSAGE_CREATED',
    MESSAGE_EDITED: 'harmony:MESSAGE_EDITED',
    MESSAGE_DELETED: 'harmony:MESSAGE_DELETED',
    CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
    CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
    CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
    MEMBER_JOINED: 'harmony:MEMBER_JOINED',
    MEMBER_LEFT: 'harmony:MEMBER_LEFT',
  },
}));

// ─── Mock authService ──────────────────────────────────────────────────────────

jest.mock('../src/services/auth.service', () => ({
  authService: {
    verifyAccessToken: jest.fn(() => ({ sub: 'test-user-id' })),
  },
}));

// ─── Mock Prisma ───────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    message: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    channel: { findUnique: jest.fn() },
    server: { findUnique: jest.fn() },
    serverMember: { findFirst: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
    getOrRevalidate: jest.fn(),
  },
  CacheTTL: { channelMessages: 60, channelVisibility: 60 },
  CacheKeys: { channelMessages: jest.fn(), channelVisibility: jest.fn() },
  sanitizeKeySegment: (s: string) => s,
}));

// ─── Mock rate-limit middleware ────────────────────────────────────────────────

jest.mock('../src/middleware/rate-limit.middleware', () => ({
  tokenBucketRateLimiter: (_req: unknown, _res: unknown, next: () => void) => next(),
  _clearBucketsForTesting: jest.fn(),
}));

// ─── SSE helper ───────────────────────────────────────────────────────────────

function sseGet(
  server: http.Server,
  path: string,
  timeoutMs = 400,
): Promise<{ statusCode: number; headers: Record<string, string | string[] | undefined> }> {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    if (!addr || typeof addr === 'string') return reject(new Error('Bad server address'));
    const port = addr.port;

    const req = http.get({ hostname: 'localhost', port, path }, (res) => {
      const headers = res.headers as Record<string, string | string[] | undefined>;
      const statusCode = res.statusCode ?? 0;
      res.on('data', () => {});
      const timer = setTimeout(() => {
        res.destroy();
        resolve({ statusCode, headers });
      }, timeoutMs);
      res.on('close', () => {
        clearTimeout(timer);
        resolve({ statusCode, headers });
      });
    });

    req.on('error', reject);
    req.setTimeout(timeoutMs + 500, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

// ─── Test setup ───────────────────────────────────────────────────────────────

const mockSubscribe = eventBus.subscribe as jest.Mock;

let app: Express;
let httpServer: http.Server;

beforeAll((done) => {
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  app = createApp();
  httpServer = app.listen(0, done);
});

afterAll((done) => {
  httpServer.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  (prisma.server.findUnique as jest.Mock).mockResolvedValue({ id: VALID_SERVER_ID });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
  (prisma.user.findUnique as jest.Mock).mockResolvedValue({
    id: JOINING_USER_ID,
    username: 'newmember',
    displayName: 'New Member',
    avatarUrl: null,
    status: 'ONLINE',
  });
});

// ─── Member event subscriptions ───────────────────────────────────────────────

describe('GET /api/events/server/:serverId — member event subscriptions', () => {
  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;

  it('subscribes to MEMBER_JOINED and MEMBER_LEFT event channels', async () => {
    await sseGet(httpServer, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:MEMBER_JOINED');
    expect(subscribedChannels).toContain('harmony:MEMBER_LEFT');
  });

  it('subscribes to channel events alongside member events', async () => {
    await sseGet(httpServer, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    // Channel events from issue #185 must still be present
    expect(subscribedChannels).toContain('harmony:CHANNEL_CREATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_UPDATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_DELETED');
  });
});

// ─── member:joined event delivery ─────────────────────────────────────────────

describe('GET /api/events/server/:serverId — member:joined event', () => {
  it('fires the MEMBER_JOINED handler when a user joins', async () => {
    // Capture the MEMBER_JOINED subscriber so we can invoke it directly
    let memberJoinedHandler: ((payload: unknown) => Promise<void>) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => Promise<void>) => {
      if (channel === 'harmony:MEMBER_JOINED') {
        memberJoinedHandler = handler;
      }
      return { unsubscribe: jest.fn(), ready: Promise.resolve() };
    });

    // Open the SSE connection (captures subscribers)
    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
        (res) => {
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));

          // Give the server a tick to register subscribers, then fire the event
          setTimeout(async () => {
            if (memberJoinedHandler) {
              await memberJoinedHandler({
                userId: JOINING_USER_ID,
                serverId: VALID_SERVER_ID,
                role: 'MEMBER',
                timestamp: new Date().toISOString(),
              });
            }

            // Give the response a tick to receive the SSE frame
            setTimeout(() => {
              res.destroy();
              resolve();
            }, 50);
          }, 50);

          res.on('error', reject);
        },
      );
      req.on('error', reject);
    });

    const body = chunks.join('');
    // The SSE frame must be a member:joined event
    expect(body).toContain('event: member:joined');
    // The payload must include the user's id
    expect(body).toContain(JOINING_USER_ID);
    // User profile fields must be present
    expect(body).toContain('newmember');
  });

  it('does not emit member:joined for a different server', async () => {
    let memberJoinedHandler: ((payload: unknown) => Promise<void>) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => Promise<void>) => {
      if (channel === 'harmony:MEMBER_JOINED') {
        memberJoinedHandler = handler;
      }
      return { unsubscribe: jest.fn(), ready: Promise.resolve() };
    });

    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
        (res) => {
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));

          setTimeout(async () => {
            if (memberJoinedHandler) {
              // Fire with a different serverId — should be filtered out
              await memberJoinedHandler({
                userId: JOINING_USER_ID,
                serverId: 'different-server-id',
                role: 'MEMBER',
                timestamp: new Date().toISOString(),
              });
            }

            setTimeout(() => {
              res.destroy();
              resolve();
            }, 50);
          }, 50);

          res.on('error', reject);
        },
      );
      req.on('error', reject);
    });

    const body = chunks.join('');
    expect(body).not.toContain('event: member:joined');
  });
});

// ─── member:left event delivery ───────────────────────────────────────────────

describe('GET /api/events/server/:serverId — member:left event', () => {
  it('fires the MEMBER_LEFT handler when a user leaves', async () => {
    let memberLeftHandler: ((payload: unknown) => void) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
      if (channel === 'harmony:MEMBER_LEFT') {
        memberLeftHandler = handler;
      }
      return { unsubscribe: jest.fn(), ready: Promise.resolve() };
    });

    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
        (res) => {
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));

          setTimeout(() => {
            if (memberLeftHandler) {
              memberLeftHandler({
                userId: JOINING_USER_ID,
                serverId: VALID_SERVER_ID,
                reason: 'LEFT',
                timestamp: new Date().toISOString(),
              });
            }

            setTimeout(() => {
              res.destroy();
              resolve();
            }, 50);
          }, 50);

          res.on('error', reject);
        },
      );
      req.on('error', reject);
    });

    const body = chunks.join('');
    expect(body).toContain('event: member:left');
    expect(body).toContain(JOINING_USER_ID);
  });

  it('does not emit member:left for a different server', async () => {
    let memberLeftHandler: ((payload: unknown) => void) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
      if (channel === 'harmony:MEMBER_LEFT') {
        memberLeftHandler = handler;
      }
      return { unsubscribe: jest.fn(), ready: Promise.resolve() };
    });

    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
        (res) => {
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));

          setTimeout(() => {
            if (memberLeftHandler) {
              // Fire with a different serverId — should be filtered out
              memberLeftHandler({
                userId: JOINING_USER_ID,
                serverId: 'different-server-id',
                reason: 'LEFT',
                timestamp: new Date().toISOString(),
              });
            }

            setTimeout(() => {
              res.destroy();
              resolve();
            }, 50);
          }, 50);

          res.on('error', reject);
        },
      );
      req.on('error', reject);
    });

    const body = chunks.join('');
    expect(body).not.toContain('event: member:left');
  });
});
