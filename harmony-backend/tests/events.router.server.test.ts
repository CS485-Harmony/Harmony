/**
 * events.router.server.test.ts — Issue #185
 *
 * Integration tests for GET /api/events/server/:serverId.
 * eventBus, prisma, and authService are mocked — no running Redis/DB needed.
 */

import http from 'http';
import request from 'supertest';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';
const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440001';

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
let server: http.Server;

beforeAll((done) => {
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  app = createApp();
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  (prisma.server.findUnique as jest.Mock).mockResolvedValue({ id: VALID_SERVER_ID });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
});

// ─── SSE headers ──────────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — SSE headers', () => {
  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;

  it('sets Content-Type: text/event-stream', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['content-type']).toMatch(/text\/event-stream/);
  });

  it('sets Cache-Control: no-cache', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['cache-control']).toBe('no-cache');
  });

  it('sets Connection: keep-alive', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['connection']).toBe('keep-alive');
  });

  it('sets X-Accel-Buffering: no', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['x-accel-buffering']).toBe('no');
  });

  it('subscribes to all three CHANNEL event channels', async () => {
    await sseGet(server, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:CHANNEL_CREATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_UPDATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_DELETED');
  });
});

// ─── Input validation ──────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — input validation', () => {
  it('returns 400 for a short non-UUID serverId', async () => {
    const res = await request(app).get('/api/events/server/not-valid');
    expect(res.status).toBe(400);
  });

  it('returns 400 for a numeric-only serverId', async () => {
    const res = await request(app).get('/api/events/server/12345');
    expect(res.status).toBe(400);
  });

  it('accepts a valid UUID-formatted serverId and returns 200', async () => {
    const { statusCode } = await sseGet(
      server,
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );
    expect(statusCode).toBe(200);
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — auth', () => {
  it('returns 401 when token is missing', async () => {
    const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}`);
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is invalid', async () => {
    const { authService } = await import('../src/services/auth.service');
    (authService.verifyAccessToken as jest.Mock).mockImplementationOnce(() => {
      throw new Error('invalid token');
    });

    const res = await request(app).get(
      `/api/events/server/${VALID_SERVER_ID}?token=bad-token`,
    );
    expect(res.status).toBe(401);
  });
});

// ─── Authorisation ─────────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — authorisation', () => {
  it('returns 404 when server is not found', async () => {
    (prisma.server.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const res = await request(app).get(
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );
    expect(res.status).toBe(404);
  });

  it('returns 403 when user is not a member of the server', async () => {
    (prisma.serverMember.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const res = await request(app).get(
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );
    expect(res.status).toBe(403);
  });
});
