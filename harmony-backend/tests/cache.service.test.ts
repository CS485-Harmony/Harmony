/**
 * Cache service tests — Issue #109
 *
 * Tests cache hit, miss, invalidation, stale-while-revalidate,
 * and key pattern invalidation.
 * Requires REDIS_URL pointing at a running Redis instance.
 */

import { cacheService, CacheKeys, CacheTTL, CacheEntry, sanitizeKeySegment } from '../src/services/cache.service';
import { redis } from '../src/db/redis';

beforeAll(async () => {
  await redis.connect().catch(() => {});
});

afterAll(async () => {
  await redis.quit();
});

afterEach(async () => {
  // Clean up test keys
  const keys = await redis.keys('test:*');
  if (keys.length > 0) await redis.del(...keys);
});

// ─── Cache key patterns ──────────────────────────────────────────────────────

describe('CacheKeys', () => {
  it('generates correct channel visibility key', () => {
    expect(CacheKeys.channelVisibility('abc-123')).toBe('channel:abc-123:visibility');
  });

  it('generates correct channel messages key', () => {
    expect(CacheKeys.channelMessages('abc-123', 2)).toBe('channel:msgs:abc-123:page:2');
  });

  it('generates correct server info key', () => {
    expect(CacheKeys.serverInfo('srv-1')).toBe('server:srv-1:info');
  });
});

// ─── Key sanitization ───────────────────────────────────────────────────────

describe('sanitizeKeySegment', () => {
  it('strips glob-special characters from keys', () => {
    expect(sanitizeKeySegment('abc*def')).toBe('abcdef');
    expect(sanitizeKeySegment('abc?def')).toBe('abcdef');
    expect(sanitizeKeySegment('abc[0]def')).toBe('abc0def');
  });

  it('leaves valid UUIDs unchanged', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    expect(sanitizeKeySegment(uuid)).toBe(uuid);
  });

  it('produces safe cache keys via CacheKeys helpers', () => {
    expect(CacheKeys.channelVisibility('*')).toBe('channel::visibility');
    expect(CacheKeys.channelMessages('a]b[c', 1)).toBe('channel:msgs:abc:page:1');
  });
});

// ─── TTL values ──────────────────────────────────────────────────────────────

describe('CacheTTL', () => {
  it('has correct TTL values from spec', () => {
    expect(CacheTTL.channelVisibility).toBe(3600);
    expect(CacheTTL.channelMessages).toBe(60);
    expect(CacheTTL.serverInfo).toBe(300);
  });
});

// ─── set / get (cache miss → cache hit) ──────────────────────────────────────

describe('cacheService.set / get', () => {
  it('returns null on cache miss', async () => {
    const result = await cacheService.get('test:nonexistent');
    expect(result).toBeNull();
  });

  it('returns cached entry on cache hit', async () => {
    const data = { visibility: 'PUBLIC_INDEXABLE' };
    await cacheService.set('test:hit', data, { ttl: 60 });

    const entry = await cacheService.get<typeof data>('test:hit');
    expect(entry).not.toBeNull();
    expect(entry!.data).toEqual(data);
    expect(entry!.createdAt).toBeLessThanOrEqual(Date.now());
  });

  it('stores entry with correct TTL in Redis', async () => {
    await cacheService.set('test:ttl', 'value', { ttl: 120 });

    const ttl = await redis.ttl('test:ttl');
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(120);
  });

  it('adds staleTtl to total Redis TTL', async () => {
    await cacheService.set('test:stale-ttl', 'value', { ttl: 60, staleTtl: 30 });

    const ttl = await redis.ttl('test:stale-ttl');
    expect(ttl).toBeGreaterThan(60);
    expect(ttl).toBeLessThanOrEqual(90);
  });
});

// ─── invalidate ──────────────────────────────────────────────────────────────

describe('cacheService.invalidate', () => {
  it('removes a single cached key', async () => {
    await cacheService.set('test:del', 'to-delete', { ttl: 60 });
    expect(await cacheService.get('test:del')).not.toBeNull();

    await cacheService.invalidate('test:del');
    expect(await cacheService.get('test:del')).toBeNull();
  });
});

// ─── invalidatePattern ───────────────────────────────────────────────────────

describe('cacheService.invalidatePattern', () => {
  it('removes all keys matching a glob pattern', async () => {
    await Promise.all([
      cacheService.set('test:msgs:ch1:page:1', 'p1', { ttl: 60 }),
      cacheService.set('test:msgs:ch1:page:2', 'p2', { ttl: 60 }),
      cacheService.set('test:msgs:ch2:page:1', 'other', { ttl: 60 }),
    ]);

    await cacheService.invalidatePattern('test:msgs:ch1:*');

    expect(await cacheService.get('test:msgs:ch1:page:1')).toBeNull();
    expect(await cacheService.get('test:msgs:ch1:page:2')).toBeNull();
    // ch2 should be untouched
    expect(await cacheService.get('test:msgs:ch2:page:1')).not.toBeNull();
  });
});

// ─── isStale ─────────────────────────────────────────────────────────────────

describe('cacheService.isStale', () => {
  it('returns false for fresh entries', () => {
    const entry: CacheEntry = { data: 'fresh', createdAt: Date.now() };
    expect(cacheService.isStale(entry, 60)).toBe(false);
  });

  it('returns true for entries older than TTL', () => {
    const entry: CacheEntry = { data: 'old', createdAt: Date.now() - 120_000 };
    expect(cacheService.isStale(entry, 60)).toBe(true);
  });
});

// ─── getOrRevalidate (stale-while-revalidate) ────────────────────────────────

describe('cacheService.getOrRevalidate', () => {
  it('calls fetcher on cache miss and caches result', async () => {
    const fetcher = jest.fn().mockResolvedValue({ id: 1, name: 'test' });

    const result = await cacheService.getOrRevalidate('test:swr-miss', fetcher, { ttl: 60 });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 1, name: 'test' });

    // Verify it was cached
    const entry = await cacheService.get('test:swr-miss');
    expect(entry).not.toBeNull();
    expect(entry!.data).toEqual({ id: 1, name: 'test' });
  });

  it('returns cached data without calling fetcher on fresh hit', async () => {
    await cacheService.set('test:swr-hit', { cached: true }, { ttl: 60 });
    const fetcher = jest.fn().mockResolvedValue({ cached: false });

    const result = await cacheService.getOrRevalidate('test:swr-hit', fetcher, { ttl: 60 });

    expect(fetcher).not.toHaveBeenCalled();
    expect(result).toEqual({ cached: true });
  });

  it('returns stale data immediately and triggers background revalidation', async () => {
    // Set entry with createdAt in the past (stale)
    const staleEntry: CacheEntry = { data: { version: 'old' }, createdAt: Date.now() - 120_000 };
    await redis.set('test:swr-stale', JSON.stringify(staleEntry), 'EX', 300);

    let resolveRevalidation: (v: unknown) => void;
    const revalidationDone = new Promise((r) => { resolveRevalidation = r; });

    const fetcher = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ version: 'new' });
          resolveRevalidation(undefined);
        }, 50);
      });
    });

    // Should return stale data immediately
    const result = await cacheService.getOrRevalidate('test:swr-stale', fetcher, {
      ttl: 60,
      staleTtl: 300,
    });
    expect(result).toEqual({ version: 'old' });
    expect(fetcher).toHaveBeenCalledTimes(1);

    // Wait for background revalidation to complete
    await revalidationDone;
    // Small delay for the set to complete
    await new Promise((r) => setTimeout(r, 50));

    // Cache should now have fresh data
    const updated = await cacheService.get('test:swr-stale');
    expect(updated!.data).toEqual({ version: 'new' });
  });
});
