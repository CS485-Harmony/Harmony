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
import { createDeferred, waitFor } from './helpers/async';
import type { Express } from 'express';
import type { ChannelCreatedPayload, MessageCreatedPayload } from '../src/events/eventTypes';

const VALID_TOKEN = 'valid-token';
const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440001';
const CREATED_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440009';

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
    SERVER_UPDATED: 'harmony:SERVER_UPDATED',
    USER_STATUS_CHANGED: 'harmony:USER_STATUS_CHANGED',
    MEMBER_JOINED: 'harmony:MEMBER_JOINED',
    MEMBER_LEFT: 'harmony:MEMBER_LEFT',
    VISIBILITY_CHANGED: 'harmony:VISIBILITY_CHANGED',
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
    message: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    channel: { findUnique: jest.fn(), findMany: jest.fn() },
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
  createPublicRateLimiter: () => (_req: unknown, _res: unknown, next: () => void) => next(),
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
  (prisma.channel.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.message.findMany as jest.Mock).mockResolvedValue([]);
  (prisma.channel.findUnique as jest.Mock).mockResolvedValue({
    id: CREATED_CHANNEL_ID,
    serverId: VALID_SERVER_ID,
    name: 'general',
    slug: 'general',
    type: 'TEXT',
    visibility: 'PUBLIC_INDEXABLE',
    topic: null,
    position: 0,
    createdAt: new Date('2026-04-19T10:00:00.000Z'),
    updatedAt: new Date('2026-04-19T10:00:00.000Z'),
  });
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

describe('GET /api/events/server/:serverId — subscription readiness', () => {
  const sseUrl = `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`;

  it('waits for all server-scoped subscriptions before flushing SSE headers', async () => {
    const ready = createDeferred<void>();
    mockSubscribe.mockImplementation(() => ({
      unsubscribe: jest.fn(),
      ready: ready.promise,
    }));

    const addr = server.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
    const port = addr.port;

    let headersReceived = false;
    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
      headersReceived = true;
      res.resume();
    });

    await new Promise((resolve) => setTimeout(resolve, 75));
    expect(headersReceived).toBe(false);

    ready.resolve();
    await waitFor(() => headersReceived);

    req.destroy();
  });

  it('buffers server events that arrive before the stream becomes live', async () => {
    const ready = createDeferred<void>();
    const responseStarted = createDeferred<void>();
    let channelCreatedHandler: ((payload: ChannelCreatedPayload) => Promise<void>) | null = null;

    mockSubscribe.mockImplementation(
      (channel: string, handler: (payload: ChannelCreatedPayload) => Promise<void>) => {
        if (channel === 'harmony:CHANNEL_CREATED') {
          channelCreatedHandler = handler;
        }
        return {
          unsubscribe: jest.fn(),
          ready: ready.promise,
        };
      },
    );

    const addr = server.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
    const port = addr.port;

    const chunks: string[] = [];
    let response: http.IncomingMessage | null = null;
    await new Promise<void>((resolve, reject) => {
      const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
        response = res;
        responseStarted.resolve();
        res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
        res.on('error', reject);
      });

      req.on('error', reject);

      setTimeout(async () => {
        if (!channelCreatedHandler) {
          reject(new Error('CHANNEL_CREATED handler was not registered'));
          return;
        }

        await channelCreatedHandler({
          channelId: CREATED_CHANNEL_ID,
          serverId: VALID_SERVER_ID,
          timestamp: new Date('2026-04-19T10:00:00.000Z').toISOString(),
        });

        ready.resolve();
        await responseStarted.promise;

        setTimeout(() => {
          response?.destroy();
          req.destroy();
          resolve();
        }, 75);
      }, 50);
    });

    const body = chunks.join('');
    expect(body).toContain('event: channel:created');
    expect(body).toContain(CREATED_CHANNEL_ID);
    expect(body).toContain('"name":"general"');
  });

  it('buffers message:created events that arrive before the stream becomes live', async () => {
    const ready = createDeferred<void>();
    const responseStarted = createDeferred<void>();
    const MESSAGE_ID = '550e8400-e29b-41d4-a716-446655440010';
    const CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440011';
    let messageCreatedHandler: ((payload: MessageCreatedPayload) => Promise<void>) | null = null;

    // Pre-populate serverChannelIds by returning one channel from the preload query.
    (prisma.channel.findMany as jest.Mock).mockResolvedValue([{ id: CHANNEL_ID }]);

    mockSubscribe.mockImplementation(
      (channel: string, handler: (payload: MessageCreatedPayload) => Promise<void>) => {
        if (channel === 'harmony:MESSAGE_CREATED') {
          messageCreatedHandler = handler;
        }
        return { unsubscribe: jest.fn(), ready: ready.promise };
      },
    );

    (prisma.message.findUnique as jest.Mock).mockResolvedValue({
      id: MESSAGE_ID,
      channelId: CHANNEL_ID,
      authorId: 'author-1',
      author: { id: 'author-1', username: 'bob', displayName: 'Bob', avatarUrl: null },
      content: 'live message during setup window',
      createdAt: new Date('2026-04-19T11:00:00.000Z'),
      editedAt: null,
      attachments: [],
      isDeleted: false,
    });

    const addr = server.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
    const port = addr.port;

    const chunks: string[] = [];
    let response: http.IncomingMessage | null = null;
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        { hostname: 'localhost', port, path: sseUrl },
        (res) => {
          response = res;
          responseStarted.resolve();
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
          res.on('error', reject);
        },
      );

      req.on('error', reject);

      setTimeout(async () => {
        if (!messageCreatedHandler) {
          reject(new Error('MESSAGE_CREATED handler was not registered'));
          return;
        }

        await messageCreatedHandler({
          messageId: MESSAGE_ID,
          channelId: CHANNEL_ID,
          authorId: 'author-1',
          timestamp: new Date('2026-04-19T11:00:00.000Z').toISOString(),
        });

        ready.resolve();
        await responseStarted.promise;

        setTimeout(() => {
          response?.destroy();
          req.destroy();
          resolve();
        }, 75);
      }, 50);
    });

    const body = chunks.join('');
    expect(body).toContain('event: message:created');
    expect(body).toContain('live message during setup window');
  });
});

// ─── Last-Event-ID replay ──────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — Last-Event-ID replay', () => {
  const REPLAY_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440020';
  const REPLAY_MESSAGE_ID = '550e8400-e29b-41d4-a716-446655440021';
  const lastEventId = '2026-04-19T09:59:00.000Z';
  const sseUrlWithReplay = `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}&lastEventId=${encodeURIComponent(lastEventId)}`;

  it('replays message:created events missed during the reconnect gap', async () => {
    (prisma.channel.findMany as jest.Mock).mockResolvedValue([{ id: REPLAY_CHANNEL_ID }]);

    const missedMessage = {
      id: REPLAY_MESSAGE_ID,
      channelId: REPLAY_CHANNEL_ID,
      authorId: 'author-2',
      author: { id: 'author-2', username: 'carol', displayName: 'Carol', avatarUrl: null },
      content: 'missed during disconnect',
      createdAt: new Date('2026-04-19T09:59:30.000Z'),
      editedAt: null,
      attachments: [],
      isDeleted: false,
    };
    (prisma.message.findMany as jest.Mock).mockResolvedValue([missedMessage]);

    const addr = server.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
    const port = addr.port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get({ hostname: 'localhost', port, path: sseUrlWithReplay }, (res) => {
        res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
        res.on('error', reject);
        setTimeout(() => {
          res.destroy();
          req.destroy();
          resolve();
        }, 150);
      });
      req.on('error', reject);
    });

    const body = chunks.join('');
    expect(body).toContain('event: message:created');
    expect(body).toContain('missed during disconnect');
    expect(body).toContain(lastEventId.slice(0, 10)); // id: field contains the date
  });

  it('emits replay frames before buffered live events', async () => {
    const ready = createDeferred<void>();
    const LIVE_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440022';
    const LIVE_MESSAGE_ID = '550e8400-e29b-41d4-a716-446655440023';
    let messageCreatedHandler: ((payload: MessageCreatedPayload) => Promise<void>) | null = null;

    (prisma.channel.findMany as jest.Mock).mockResolvedValue([{ id: LIVE_CHANNEL_ID }]);

    const replayMsg = {
      id: REPLAY_MESSAGE_ID,
      channelId: LIVE_CHANNEL_ID,
      authorId: 'author-2',
      author: { id: 'author-2', username: 'carol', displayName: 'Carol', avatarUrl: null },
      content: 'replay message',
      createdAt: new Date('2026-04-19T09:59:30.000Z'),
      editedAt: null,
      attachments: [],
      isDeleted: false,
    };
    const liveMsg = {
      id: LIVE_MESSAGE_ID,
      channelId: LIVE_CHANNEL_ID,
      authorId: 'author-3',
      author: { id: 'author-3', username: 'dave', displayName: 'Dave', avatarUrl: null },
      content: 'live message',
      createdAt: new Date('2026-04-19T10:01:00.000Z'),
      editedAt: null,
      attachments: [],
      isDeleted: false,
    };

    (prisma.message.findMany as jest.Mock).mockResolvedValue([replayMsg]);
    (prisma.message.findUnique as jest.Mock).mockResolvedValue(liveMsg);

    mockSubscribe.mockImplementation(
      (channel: string, handler: (payload: MessageCreatedPayload) => Promise<void>) => {
        if (channel === 'harmony:MESSAGE_CREATED') messageCreatedHandler = handler;
        return { unsubscribe: jest.fn(), ready: ready.promise };
      },
    );

    const addr = server.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
    const port = addr.port;

    const chunks: string[] = [];
    const responseStarted = createDeferred<void>();
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        { hostname: 'localhost', port, path: sseUrlWithReplay },
        (res) => {
          responseStarted.resolve();
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
          res.on('error', reject);
        },
      );
      req.on('error', reject);

      setTimeout(async () => {
        if (!messageCreatedHandler) {
          reject(new Error('MESSAGE_CREATED handler was not registered'));
          return;
        }
        // Simulate a live event arriving during the readiness window.
        await messageCreatedHandler({
          messageId: LIVE_MESSAGE_ID,
          channelId: LIVE_CHANNEL_ID,
          authorId: 'author-3',
          timestamp: new Date('2026-04-19T10:01:00.000Z').toISOString(),
        });
        ready.resolve();
        await responseStarted.promise;
        setTimeout(() => {
          req.destroy();
          resolve();
        }, 150);
      }, 50);
    });

    const body = chunks.join('');
    const replayPos = body.indexOf('replay message');
    const livePos = body.indexOf('live message');
    expect(replayPos).toBeGreaterThanOrEqual(0);
    expect(livePos).toBeGreaterThan(replayPos);
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

    const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}?token=bad-token`);
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

describe('GET /api/events/server/:serverId — subscription readiness', () => {
  it('returns 503 when first-batch subscriptions fail to become ready', async () => {
    const firstUnsub = jest.fn();
    const failingReady = Promise.reject(new Error('redis subscribe failed'));
    failingReady.catch(() => undefined);
    mockSubscribe.mockReturnValueOnce({ unsubscribe: firstUnsub, ready: failingReady });
    mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });

    const res = await request(app).get(
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );

    expect(res.status).toBe(503);
    expect(res.body).toEqual({ error: 'Failed to establish event stream' });
    expect(firstUnsub).toHaveBeenCalled();
  });

  it('returns 503 when second-batch subscriptions fail before headers are flushed', async () => {
    // Let CHANNEL_CREATED and CHANNEL_DELETED (first batch) succeed.
    const firstUnsub = jest.fn();
    const secondUnsub = jest.fn();
    mockSubscribe.mockReturnValueOnce({ unsubscribe: firstUnsub, ready: Promise.resolve() });
    mockSubscribe.mockReturnValueOnce({ unsubscribe: secondUnsub, ready: Promise.resolve() });

    // Fail MESSAGE_CREATED (third subscribe call — first in the second batch).
    const thirdUnsub = jest.fn();
    const failingReady = Promise.reject(new Error('redis message-sub failed'));
    failingReady.catch(() => undefined);
    mockSubscribe.mockReturnValueOnce({ unsubscribe: thirdUnsub, ready: failingReady });
    mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });

    const res = await request(app).get(
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );

    // Headers must NOT have been flushed — client receives a proper 503 JSON response.
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ error: 'Failed to establish event stream' });
    // Cleanup must have run — all registered unsubscribes are called.
    expect(firstUnsub).toHaveBeenCalled();
    expect(secondUnsub).toHaveBeenCalled();
    expect(thirdUnsub).toHaveBeenCalled();
  });
});
