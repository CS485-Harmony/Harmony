/**
 * events.router.sse-server-updated.test.ts — Issue #188
 *
 * Tests that the SSE endpoint forwards SERVER_UPDATED events as
 * `server:updated` SSE events to connected clients when the serverId matches.
 *
 * Uses the same mock infrastructure as events.router.test.ts.
 */

import http from 'http';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';
const VALID_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
const SERVER_ID = '660e8400-e29b-41d4-a716-446655440001';
const OTHER_SERVER_ID = '770e8400-e29b-41d4-a716-446655440001';

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
    SERVER_UPDATED: 'harmony:SERVER_UPDATED',
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

type SubscriberHandler = (payload: unknown) => void;

/**
 * Collect SSE data from an open streaming connection for a window of time,
 * optionally triggering an event bus publish mid-stream, then resolve with
 * all received text chunks concatenated.
 */
function sseGetWithEvent(
  server: http.Server,
  path: string,
  onConnected: (triggerEvent: () => void) => void,
  timeoutMs = 600,
): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    if (!addr || typeof addr === 'string') return reject(new Error('Bad server address'));
    const port = addr.port;

    let body = '';

    const req = http.get({ hostname: 'localhost', port, path }, (res) => {
      const statusCode = res.statusCode ?? 0;

      res.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });

      // Allow caller to trigger the event once connected
      onConnected(() => {});

      const timer = setTimeout(() => {
        res.destroy();
        resolve({ statusCode, body });
      }, timeoutMs);

      res.on('close', () => {
        clearTimeout(timer);
        resolve({ statusCode, body });
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

// Map to capture registered handlers by channel name
const capturedHandlers = new Map<string, SubscriberHandler>();

let app: Express;
let server: http.Server;

beforeAll((done) => {
  mockSubscribe.mockImplementation((channel: string, handler: SubscriberHandler) => {
    capturedHandlers.set(channel, handler);
    return { unsubscribe: jest.fn(), ready: Promise.resolve() };
  });

  app = createApp();
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  capturedHandlers.clear();

  mockSubscribe.mockImplementation((channel: string, handler: SubscriberHandler) => {
    capturedHandlers.set(channel, handler);
    return { unsubscribe: jest.fn(), ready: Promise.resolve() };
  });

  (prisma.channel.findUnique as jest.Mock).mockResolvedValue({ serverId: SERVER_ID });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
});

// ─── SERVER_UPDATED subscription ─────────────────────────────────────────────

describe('GET /api/events/channel/:channelId — SERVER_UPDATED subscription', () => {
  const sseUrl = `/api/events/channel/${VALID_CHANNEL_ID}?token=${VALID_TOKEN}`;

  it('subscribes to SERVER_UPDATED event channel', async () => {
    await new Promise<void>((resolve, reject) => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') return reject(new Error('Bad server address'));
      const port = (addr as { port: number }).port;

      const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
        res.on('data', () => {});
        setTimeout(() => {
          res.destroy();
          resolve();
        }, 300);
      });
      req.on('error', reject);
    });

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:SERVER_UPDATED');
  });

  it('sends a server:updated SSE event when SERVER_UPDATED fires for matching serverId', async () => {
    const serverUpdatedPayload = {
      serverId: SERVER_ID,
      name: 'New Name',
      iconUrl: 'https://example.com/icon.png',
      description: 'New description',
      timestamp: '2024-01-01T00:00:00.000Z',
    };

    let receivedBody = '';

    await new Promise<void>((resolve, reject) => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') return reject(new Error('Bad server address'));
      const port = (addr as { port: number }).port;

      const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
        res.on('data', (chunk: Buffer) => {
          receivedBody += chunk.toString();
        });

        // Fire the event after a brief moment to let subscriptions register
        setTimeout(() => {
          const handler = capturedHandlers.get('harmony:SERVER_UPDATED');
          if (handler) handler(serverUpdatedPayload);
        }, 100);

        setTimeout(() => {
          res.destroy();
          resolve();
        }, 400);
      });
      req.on('error', reject);
    });

    expect(receivedBody).toContain('event: server:updated');
    expect(receivedBody).toContain(SERVER_ID);
    expect(receivedBody).toContain('New Name');
  });

  it('does NOT send server:updated event when serverId does NOT match', async () => {
    const serverUpdatedPayload = {
      serverId: OTHER_SERVER_ID, // different server
      name: 'Other Server',
      iconUrl: null,
      description: null,
      timestamp: '2024-01-01T00:00:00.000Z',
    };

    let receivedBody = '';

    await new Promise<void>((resolve, reject) => {
      const addr = server.address();
      if (!addr || typeof addr === 'string') return reject(new Error('Bad server address'));
      const port = (addr as { port: number }).port;

      const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
        res.on('data', (chunk: Buffer) => {
          receivedBody += chunk.toString();
        });

        setTimeout(() => {
          const handler = capturedHandlers.get('harmony:SERVER_UPDATED');
          if (handler) handler(serverUpdatedPayload);
        }, 100);

        setTimeout(() => {
          res.destroy();
          resolve();
        }, 400);
      });
      req.on('error', reject);
    });

    expect(receivedBody).not.toContain('event: server:updated');
  });
});
