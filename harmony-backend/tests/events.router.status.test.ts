/**
 * events.router.status.test.ts — Issue #231
 *
 * Integration tests for member:statusChanged SSE events on
 * GET /api/events/server/:serverId.
 *
 * eventBus, prisma, and authService are mocked — no running Redis/DB needed.
 */

import http from 'http';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';
const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440002';
const CHANGING_USER_ID = 'aaaaaaaa-bbbb-cccc-dddd-ffffffffffff';

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
    USER_STATUS_CHANGED: 'harmony:USER_STATUS_CHANGED',
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
});

// ─── Status event subscription ────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — status event subscription', () => {
  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;

  it('subscribes to USER_STATUS_CHANGED event channel', async () => {
    await sseGet(httpServer, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:USER_STATUS_CHANGED');
  });

  it('subscribes to channel events alongside the status event', async () => {
    await sseGet(httpServer, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:CHANNEL_CREATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_UPDATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_DELETED');
  });
});

// ─── member:statusChanged event delivery ──────────────────────────────────────

describe('GET /api/events/server/:serverId — member:statusChanged event', () => {
  it('fires the USER_STATUS_CHANGED handler and emits member:statusChanged', async () => {
    let statusChangedHandler: ((payload: unknown) => void) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
      if (channel === 'harmony:USER_STATUS_CHANGED') {
        statusChangedHandler = handler;
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
            if (statusChangedHandler) {
              statusChangedHandler({
                userId: CHANGING_USER_ID,
                serverId: VALID_SERVER_ID,
                status: 'IDLE',
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
    expect(body).toContain('event: member:statusChanged');
    expect(body).toContain(CHANGING_USER_ID);
    // SSE emits lowercase (Prisma enum 'IDLE' → frontend 'idle' via .toLowerCase())
    expect(body).toContain('"status":"idle"');
  });

  it('does not emit member:statusChanged for a different server', async () => {
    let statusChangedHandler: ((payload: unknown) => void) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
      if (channel === 'harmony:USER_STATUS_CHANGED') {
        statusChangedHandler = handler;
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
            if (statusChangedHandler) {
              // Fire with a different serverId — should be filtered out
              statusChangedHandler({
                userId: CHANGING_USER_ID,
                serverId: 'different-server-id',
                status: 'OFFLINE',
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
    expect(body).not.toContain('event: member:statusChanged');
  });

  it('emits member:statusChanged regardless of publicProfile (status reflects presence not identity)', async () => {
    // Status is presence-only data — it is always emitted regardless of publicProfile.
    // This test verifies no extra DB lookup occurs (the payload has everything needed).
    let statusChangedHandler: ((payload: unknown) => void) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
      if (channel === 'harmony:USER_STATUS_CHANGED') {
        statusChangedHandler = handler;
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
            if (statusChangedHandler) {
              statusChangedHandler({
                userId: CHANGING_USER_ID,
                serverId: VALID_SERVER_ID,
                status: 'ONLINE',
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
    expect(body).toContain('event: member:statusChanged');
    // Verify no DB lookup was needed (user.findUnique not called for status changes)
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
