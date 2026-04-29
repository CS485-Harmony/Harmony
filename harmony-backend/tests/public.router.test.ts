/**
 * Public REST API route tests — Issue #108
 *
 * Coverage for unauthenticated endpoints:
 *   GET /api/public/servers/:serverSlug
 *   GET /api/public/servers/:serverSlug/channels
 *   GET /api/public/channels/:channelId/messages
 *   GET /api/public/channels/:channelId/messages/:messageId
 *
 * Prisma and cacheService are mocked so no running database or Redis is required.
 */

import request from 'supertest';
import { createApp } from '../src/app';
import { ChannelVisibility, ChannelType } from '@prisma/client';
// _clearBucketsForTesting removed in Issue #318 — no in-process bucket state remains

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    server: { findUnique: jest.fn(), findMany: jest.fn() },
    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    message: { findMany: jest.fn(), findFirst: jest.fn() },
  },
}));

jest.mock('../src/services/metaTag/metaTagService', () => ({
  metaTagService: {
    getMetaTagsForPreview: jest.fn(),
    getFallbackMetaTagsForPreview: jest.fn(),
  },
}));

import { prisma } from '../src/db/prisma';
import { cacheService } from '../src/services/cache.service';
import { metaTagService } from '../src/services/metaTag/metaTagService';

const mockCacheService = cacheService as unknown as {
  get: jest.Mock;
  isStale: jest.Mock;
  getOrRevalidate: jest.Mock;
};

const mockPrisma = prisma as unknown as {
  server: { findUnique: jest.Mock; findMany: jest.Mock };
  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
  message: { findMany: jest.Mock; findFirst: jest.Mock };
};

const mockMetaTagService = metaTagService as unknown as {
  getMetaTagsForPreview: jest.Mock;
  getFallbackMetaTagsForPreview: jest.Mock;
};

// ─── Mock cacheService (bypass Redis) ────────────────────────────────────────
//
// Always returning null from get() means every request is a cache miss,
// so the route handler runs in full on every test.

jest.mock('../src/services/cache.service', () => {
  const { ChannelVisibility } = jest.requireActual('@prisma/client');

  return {
    cacheService: {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      isStale: jest.fn().mockReturnValue(false),
      getOrRevalidate: jest
        .fn()
        .mockImplementation(async (_key: string, fetcher: () => Promise<unknown>) => fetcher()),
    },
    // Re-export constants that the router imports
    CacheKeys: {
      channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
      serverInfo: (id: string) => `server:${id}:info`,
    },
    CacheTTL: {
      channelMessages: 60,
      serverInfo: 300,
    },
    sanitizeKeySegment: (s: string) => s.replace(/[*?[\]]/g, ''),
    ChannelVisibility, // keep the real enum available if needed elsewhere
  };
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const SERVER = {
  id: 'srv-0000-0000-0000-000000000001',
  name: 'Test Server',
  slug: 'test-server',
  iconUrl: null,
  description: 'A test server',
  memberCount: 42,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

const CHANNEL = {
  id: 'chn-0000-0000-0000-000000000001',
  serverId: SERVER.id,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  topic: 'General discussion',
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
};

const MESSAGE = {
  id: 'msg-0000-0000-0000-000000000001',
  content: 'Hello, world!',
  createdAt: new Date('2025-06-01T12:00:00Z'),
  editedAt: null,
  author: { id: 'usr-0000-0000-0000-000000000001', username: 'alice' },
};

// ─── Test setup ───────────────────────────────────────────────────────────────

let app: ReturnType<typeof createApp>;

async function withSilencedConsoleError<T>(run: () => Promise<T>): Promise<T> {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

  try {
    return await run();
  } finally {
    consoleErrorSpy.mockRestore();
  }
}

beforeEach(() => {
  // Recreate the app each test so the in-memory MemoryStore (used in dev/test)
  // starts fresh — prevents rate-limit state from leaking across tests.
  app = createApp();
  jest.clearAllMocks();
});

// ─── GET /api/public/servers/:serverSlug ─────────────────────────────────────

describe('GET /api/public/servers/:serverSlug', () => {
  it('returns 200 with server info when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: SERVER.id,
      name: SERVER.name,
      slug: SERVER.slug,
      memberCount: SERVER.memberCount,
    });
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('CWE-862: returns 404 for a private server slug (isPublic filter enforced)', async () => {
    // Prisma returns null because isPublic: true is in the where clause and server is private
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/private-server');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Server not found');
    expect(mockPrisma.server.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isPublic: true }) }),
    );
  });
});

// ─── GET /api/public/servers/:serverSlug/channels ────────────────────────────

const NO_INDEX_CHANNEL = {
  id: 'chn-0000-0000-0000-000000000002',
  serverId: SERVER.id,
  name: 'announcements',
  slug: 'announcements',
  type: ChannelType.TEXT,
  topic: null,
  visibility: ChannelVisibility.PUBLIC_NO_INDEX,
  position: 1,
};

describe('GET /api/public/servers/:serverSlug/channels', () => {
  it('returns 200 with PUBLIC_INDEXABLE and PUBLIC_NO_INDEX channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([
      { id: CHANNEL.id, name: CHANNEL.name, slug: CHANNEL.slug, type: CHANNEL.type, topic: CHANNEL.topic },
      { id: NO_INDEX_CHANNEL.id, name: NO_INDEX_CHANNEL.name, slug: NO_INDEX_CHANNEL.slug, type: NO_INDEX_CHANNEL.type, topic: null },
    ]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('channels');
    expect(res.body.channels).toHaveLength(2);
    expect(res.body.channels[0]).toMatchObject({ id: CHANNEL.id, name: CHANNEL.name });
    expect(res.body.channels[1]).toMatchObject({ id: NO_INDEX_CHANNEL.id, name: NO_INDEX_CHANNEL.name });
    expect(res.body.channels[0]).not.toHaveProperty('visibility');
    expect(res.body.channels[1]).not.toHaveProperty('visibility');
    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ visibility: { in: [ChannelVisibility.PUBLIC_INDEXABLE, ChannelVisibility.PUBLIC_NO_INDEX] } }),
      }),
    );
  });

  it('returns 200 with an empty array when the server has no public channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body.channels).toHaveLength(0);
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist/channels');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('CWE-862: returns 404 for a private server (isPublic filter enforced on channels endpoint)', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/private-server/channels');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Server not found');
    expect(mockPrisma.server.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isPublic: true }) }),
    );
  });
});

// ─── GET /api/public/channels/:channelId/messages ────────────────────────────

describe('GET /api/public/channels/:channelId/messages', () => {
  it('returns 200 with paginated messages for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(res.body.messages).toHaveLength(1);
    expect(res.body.messages[0]).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('pageSize', 50);
  });

  it('PR-2: returns correct page and passes skip/take to Prisma when ?page=3', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=3`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page', 3);
    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 100, take: 50 }),
    );
  });

  it('PR-3/PR-4: clamps invalid ?page values to 1 and passes skip:0 to Prisma', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
    expect(zeroPage.status).toBe(200);
    expect(zeroPage.body).toHaveProperty('page', 1);
    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 50 }),
    );

    jest.clearAllMocks();
    // _clearBucketsForTesting() removed in Issue #318 — no in-process bucket state
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
    expect(negPage.status).toBe(200);
    expect(negPage.body).toHaveProperty('page', 1);
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/channels/no-such-channel/messages');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 200 for a PUBLIC_NO_INDEX channel (guest-navigable but not indexed)', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messages');
  });
});

// ─── GET /api/public/channels/:channelId/messages/:messageId ─────────────────

describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
  it('returns 200 with the message when it exists in a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body.author).toMatchObject({ username: 'alice' });
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 200 for a PUBLIC_NO_INDEX channel (guest-navigable but not indexed)', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });
    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: MESSAGE.id });
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/no-such-channel/messages/${MESSAGE.id}`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the message does not exist in the channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/${CHANNEL.id}/messages/no-such-message`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('PR-15: returns 404 when message is soft-deleted (isDeleted: false filter)', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    // findFirst returns null because the soft-deleted message is excluded by isDeleted: false
    mockPrisma.message.findFirst.mockResolvedValue(null);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Message not found');
    expect(mockPrisma.message.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
    );
  });

  it('PR-16: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await withSilencedConsoleError(() =>
      request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`),
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────

describe('GET /api/public/channels/:channelId/messages — additional', () => {
  it('PR-5: defaults page to 1 when ?page is non-numeric', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=abc`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page', 1);
  });

  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
    );
  });

  it('PR-10: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await withSilencedConsoleError(() =>
      request(app).get(`/api/public/channels/${CHANNEL.id}/messages`),
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── Cache middleware behavior (routes 1 and 2) ───────────────────────────────

describe('Cache middleware behavior (routes 1 and 2)', () => {
  it('PR-17: sets X-Cache: HIT and does not call Prisma on a fresh cache entry', async () => {
    const cachedBody = { messages: [MESSAGE], page: 1, pageSize: 50 };
    mockCacheService.get.mockResolvedValueOnce({ data: cachedBody, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
    expect(mockPrisma.channel.findUnique).not.toHaveBeenCalled();
  });

  it('PR-18: sets X-Cache: STALE and serves stale body on a stale cache entry', async () => {
    // Use pre-serialized plain objects (no Date instances) to match what the HTTP
    // response body looks like after JSON round-trip.
    const staleBody = {
      messages: [{ id: MESSAGE.id, content: MESSAGE.content }],
      page: 1,
      pageSize: 50,
    };
    mockCacheService.get.mockResolvedValueOnce({ data: staleBody, createdAt: Date.now() - 999999 });
    mockCacheService.isStale.mockReturnValueOnce(true);
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
    expect(res.body).toMatchObject(staleBody);
    // Background revalidation: handler must have reached Prisma to refresh the cache
    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
  });

  it('PR-19: sets X-Cache: MISS and calls through to handler on a cache miss', async () => {
    // Default: cacheService.get returns null (cache miss)
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
  });

  it('PR-20: falls through to handler without crashing when Redis throws on cache read', async () => {
    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
  });

  it('PR-21: cache key for message list includes channelId and page number', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: 'ch-abc',
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    await request(app).get('/api/public/channels/ch-abc/messages?page=2');

    expect(mockCacheService.get).toHaveBeenCalledWith('channel:msgs:ch-abc:page:2');
  });

  it('PR-21b: cache key for single message uses channelId and messageId', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);

    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(mockCacheService.get).toHaveBeenCalledWith(`channel:msg:${CHANNEL.id}:${MESSAGE.id}`);
  });
});

// ─── GET /api/public/servers ──────────────────────────────────────────────────

describe('GET /api/public/servers', () => {
  it('PR-24: returns servers ordered by memberCount descending', async () => {
    const servers = [
      { ...SERVER, id: 'srv-1', memberCount: 50 },
      { ...SERVER, id: 'srv-2', memberCount: 25 },
      { ...SERVER, id: 'srv-3', memberCount: 10 },
    ];
    mockPrisma.server.findMany.mockResolvedValue(servers);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
    );
  });

  it('PR-25: caps results at 20 servers', async () => {
    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));

    await request(app).get('/api/public/servers');

    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
  });

  it('PR-26: returns empty array when no public servers exist', async () => {
    mockPrisma.server.findMany.mockResolvedValue([]);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('PR-27: only queries servers where isPublic is true', async () => {
    mockPrisma.server.findMany.mockResolvedValue([SERVER]);

    await request(app).get('/api/public/servers');

    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublic: true } }),
    );
  });

  it('PR-28: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));

    const res = await withSilencedConsoleError(() => request(app).get('/api/public/servers'));

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────

describe('GET /api/public/servers/:serverSlug — cache headers', () => {
  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
  });

  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
    mockCacheService.isStale.mockReturnValueOnce(true);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
  });

  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
  });

  it('PR-29: returns 200 with X-Cache: MISS and X-Cache-Key on a cache miss', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    // Default: cacheService.get returns null (cache miss)

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:info`);
    expect(res.headers['cache-control']).toContain('max-age=300');
  });

  it('PR-33: returns 404 and never calls cacheService.getOrRevalidate when server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/no-such-server');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Server not found');
    expect(mockCacheService.getOrRevalidate).not.toHaveBeenCalled();
  });

  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

    const res = await withSilencedConsoleError(() =>
      request(app).get(`/api/public/servers/${SERVER.slug}`),
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────

describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
  it('PR-35: queries channels with orderBy position ascending and sets cache headers', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { position: 'asc' } }),
    );
    expect(res.headers['cache-control']).toContain('max-age=300');
    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:public_channels`);
  });

  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
  });

  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockResolvedValueOnce({
      data: { channels: [] },
      createdAt: Date.now() - 999999,
    });
    mockCacheService.isStale.mockReturnValueOnce(true);
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
  });

  it('PR-39: continues with X-Cache: MISS and returns 200 when Redis throws on cache read', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
  });

  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

    const res = await withSilencedConsoleError(() =>
      request(app).get(`/api/public/servers/${SERVER.slug}/channels`),
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────

const CHANNEL_FULL = {
  id: CHANNEL.id,
  name: CHANNEL.name,
  slug: CHANNEL.slug,
  serverId: SERVER.id,
  type: CHANNEL.type,
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  topic: CHANNEL.topic,
  position: CHANNEL.position,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
  it('PR-41: returns 200 with channel data and Cache-Control for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
    expect(res.headers['cache-control']).toContain('max-age=300');
  });

  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue({
      ...CHANNEL_FULL,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
  });

  it('PR-43: returns 403 for a PRIVATE channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue({
      ...CHANNEL_FULL,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Channel is private');
  });

  it('PR-44: returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Server not found');
  });

  it('CWE-862: returns 404 for a private server on channel slug lookup (isPublic filter enforced)', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/private-server/channels/general');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Server not found');
    expect(mockPrisma.server.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isPublic: true }) }),
    );
  });

  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Channel not found');
  });

  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);

    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);

    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),
      }),
    );
  });

  it('PR-46: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await withSilencedConsoleError(() =>
      request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`),
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug/meta-tags ─────

describe('GET /api/public/servers/:serverSlug/channels/:channelSlug/meta-tags', () => {
  const preview = {
    title: 'General - Test Server | Harmony',
    description: 'General discussion in Test Server.',
    ogTitle: 'General - Test Server | Harmony',
    ogDescription: 'General discussion in Test Server.',
    ogImage: 'https://harmony.test/og.png',
    keywords: ['general'],
    generatedAt: '2026-04-28T00:00:00.000Z',
    isFallbackPreview: false,
    isCustom: false,
    generatedTitle: 'General - Test Server | Harmony',
    generatedDescription: 'General discussion in Test Server.',
    customTitle: null,
    customDescription: null,
    customOgImage: null,
    searchPreview: {
      title: 'General - Test Server | Harmony',
      description: 'General discussion in Test Server.',
      url: 'https://harmony.test/c/test-server/general',
    },
    socialPreview: {
      title: 'General - Test Server | Harmony',
      description: 'General discussion in Test Server.',
      image: 'https://harmony.test/og.png',
    },
  };

  it('returns 200 with preview metadata for a guest-accessible public channel', async () => {
    mockPrisma.channel.findFirst.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockMetaTagService.getMetaTagsForPreview.mockResolvedValue(preview);

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}/meta-tags`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      title: preview.title,
      generatedTitle: preview.generatedTitle,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    expect(mockMetaTagService.getFallbackMetaTagsForPreview).not.toHaveBeenCalled();
  });

  it('falls back to ephemeral preview generation when cached/persisted preview lookup fails', async () => {
    mockPrisma.channel.findFirst.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockMetaTagService.getMetaTagsForPreview.mockRejectedValue(
      new Error('generated_meta_tags missing'),
    );
    mockMetaTagService.getFallbackMetaTagsForPreview.mockResolvedValue(preview);

    const res = await withSilencedConsoleError(() =>
      request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}/meta-tags`),
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      title: preview.title,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    expect(mockMetaTagService.getFallbackMetaTagsForPreview).toHaveBeenCalledWith(CHANNEL.id);
  });

  it('returns 404 when the channel is missing or private', async () => {
    mockPrisma.channel.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}/meta-tags`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Channel not found');
    expect(mockMetaTagService.getMetaTagsForPreview).not.toHaveBeenCalled();
    expect(mockMetaTagService.getFallbackMetaTagsForPreview).not.toHaveBeenCalled();
  });
});

// ─── Rate limiting ────────────────────────────────────────────────────────────

describe('Rate limiting on publicRouter', () => {
  it('PR-22: allows requests within the rate limit', async () => {
    mockPrisma.server.findMany.mockResolvedValue([SERVER]);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(res.headers).toHaveProperty('ratelimit-limit');
  });

  it('PR-23: returns 429 after exhausting the token bucket', async () => {
    mockPrisma.server.findMany.mockResolvedValue([]);

    // Freeze time so the token bucket cannot partially refill between requests,
    // making the 101st call deterministically return 429 on any CI speed.
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    try {
      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs
      for (let i = 0; i < 100; i++) {
        await request(app).get('/api/public/servers');
      }

      const res = await request(app).get('/api/public/servers');
      expect(res.status).toBe(429);
      expect(res.body).toHaveProperty('error');
    } finally {
      nowSpy.mockRestore();
    }
  });
});
