/**
 * events.router.test.ts — Issue #180
 *
 * Integration tests for the SSE endpoint GET /api/events/channel/:channelId.
 * eventBus, prisma, and cacheService are mocked so no running Redis/DB is needed.
 *
 * SSE connections are tested by starting a real HTTP server on a random port and
 * using Node's built-in http.get(), which handles streaming responses correctly
 * without supertest hanging on open connections.
 */

import http from 'http';
import request from 'supertest';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';

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
    serverMember: { findFirst: jest.fn() },
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
    getOrRevalidate: jest.fn(),
  },
  CacheTTL: { channelMessages: 60 },
  CacheKeys: { channelMessages: jest.fn() },
  sanitizeKeySegment: (s: string) => s,
}));

// ─── Mock rate-limit middleware ────────────────────────────────────────────────

jest.mock('../src/middleware/rate-limit.middleware', () => ({
  tokenBucketRateLimiter: (_req: unknown, _res: unknown, next: () => void) => next(),
  _clearBucketsForTesting: jest.fn(),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Make an HTTP GET request to a streaming SSE endpoint.
 * Resolves with the response headers and first chunk of data (or empty string)
 * after a brief window, then destroys the socket to avoid test hangs.
 */
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
      // Drain data to prevent socket from stalling
      res.on('data', () => {});
      // Resolve after a short window — we've already captured headers
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
  server = app.listen(0, done); // random available port
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  // Default prisma mocks for auth path through SSE endpoint
  (prisma.channel.findUnique as jest.Mock).mockResolvedValue({ serverId: 'test-server-id' });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
});

// ─── SSE headers ──────────────────────────────────────────────────────────────

describe('GET /api/events/channel/:channelId — SSE headers', () => {
  const VALID_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
  const sseUrl = (id: string) => `/api/events/channel/${id}?token=${VALID_TOKEN}`;

  it('sets Content-Type: text/event-stream', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
    expect(headers['content-type']).toMatch(/text\/event-stream/);
  });

  it('sets Cache-Control: no-cache', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
    expect(headers['cache-control']).toBe('no-cache');
  });

  it('sets Connection: keep-alive', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
    expect(headers['connection']).toBe('keep-alive');
  });

  it('sets X-Accel-Buffering: no', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
    expect(headers['x-accel-buffering']).toBe('no');
  });

  it('subscribes to all three MESSAGE event channels', async () => {
    await sseGet(server, sseUrl(VALID_CHANNEL_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:MESSAGE_CREATED');
    expect(subscribedChannels).toContain('harmony:MESSAGE_EDITED');
    expect(subscribedChannels).toContain('harmony:MESSAGE_DELETED');
  });
});

// ─── Input validation ──────────────────────────────────────────────────────────

describe('GET /api/events/channel/:channelId — input validation', () => {
  it('returns 400 for a short non-UUID channelId', async () => {
    const res = await request(app).get('/api/events/channel/not-valid');
    expect(res.status).toBe(400);
  });

  it('returns 400 for a numeric-only channelId', async () => {
    const res = await request(app).get('/api/events/channel/12345');
    expect(res.status).toBe(400);
  });

  it('returns 400 for a channelId with spaces', async () => {
    const res = await request(app).get('/api/events/channel/not%20a%20uuid');
    expect(res.status).toBe(400);
  });

  it('accepts a valid UUID-formatted channelId and returns 200', async () => {
    const { statusCode } = await sseGet(
      server,
      `/api/events/channel/550e8400-e29b-41d4-a716-446655440001?token=${VALID_TOKEN}`,
    );
    expect(statusCode).toBe(200);
  });
});
