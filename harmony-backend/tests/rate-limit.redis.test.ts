/**
 * Tests for the Redis-backed public API rate limiter — Issue #318
 *
 * Replaces the in-process token-bucket tests (which required fake timers and
 * _clearBucketsForTesting) with tests that work against any Store implementation.
 * Store is injected as a constructor argument, so:
 *   - These tests use MemoryStore (the default when no store is passed), which
 *     is hermetic — no Redis connection required.
 *   - In production, createPublicRateLimiter() is called with a RedisStore.
 *
 * The key property being verified: the limiter delegates counting to whichever
 * store is configured — no process-local state lives in the middleware itself.
 */

import express, { Request, Response } from 'express';
import request from 'supertest';
import type { Store, IncrementResponse, ClientRateLimitInfo, Options } from 'express-rate-limit';
import {
  createPublicRateLimiter,
  isVerifiedBot,
  detectVerifiedBot,
} from '../src/middleware/rate-limit.middleware';

function buildApp(store?: Store) {
  const app = express();
  app.set('trust proxy', true);
  app.use(createPublicRateLimiter(store));
  app.get('/test', (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });
  return app;
}

// ─── Bot detection (pure functions — unchanged from previous implementation) ──

describe('isVerifiedBot', () => {
  it('identifies Googlebot as a verified bot', () => {
    expect(
      isVerifiedBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
    ).toBe(true);
  });

  it('identifies Bingbot case-insensitively', () => {
    expect(
      isVerifiedBot('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'),
    ).toBe(true);
    expect(
      isVerifiedBot('Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)'),
    ).toBe(true);
  });

  it('returns false for a normal browser User-Agent', () => {
    expect(
      isVerifiedBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
    ).toBe(false);
  });

  it('returns false for undefined User-Agent', () => {
    expect(isVerifiedBot(undefined)).toBe(false);
  });

  it('returns false for empty string User-Agent', () => {
    expect(isVerifiedBot('')).toBe(false);
  });
});

describe('detectVerifiedBot', () => {
  it('returns the bot name when matched', () => {
    expect(
      detectVerifiedBot(
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      ),
    ).toBe('googlebot');
  });

  it('returns null for a human UA', () => {
    expect(detectVerifiedBot('Mozilla/5.0 Chrome/120')).toBeNull();
  });
});

// ─── Rate limit behavior ──────────────────────────────────────────────────────

describe('createPublicRateLimiter — allows requests within limit', () => {
  it('returns 200 on the first request', async () => {
    const app = buildApp();
    const res = await request(app).get('/test').set('X-Forwarded-For', '1.2.3.4');
    expect(res.status).toBe(200);
  });

  it('includes RateLimit-Limit header of 100', async () => {
    const app = buildApp();
    const res = await request(app).get('/test').set('X-Forwarded-For', '1.2.3.4');
    expect(res.headers['ratelimit-limit']).toBe('100');
  });

  it('includes a decrementing RateLimit-Remaining header', async () => {
    const app = buildApp();
    const ip = '2.2.2.2';
    const first = await request(app).get('/test').set('X-Forwarded-For', ip);
    const second = await request(app).get('/test').set('X-Forwarded-For', ip);

    const remaining1 = Number(first.headers['ratelimit-remaining']);
    const remaining2 = Number(second.headers['ratelimit-remaining']);
    expect(remaining2).toBe(remaining1 - 1);
  });
});

describe('createPublicRateLimiter — enforces limit', () => {
  it('returns 429 after 100 requests from the same IP', async () => {
    const app = buildApp();
    const ip = '5.5.5.5';

    for (let i = 0; i < 100; i++) {
      const res = await request(app).get('/test').set('X-Forwarded-For', ip);
      expect(res.status).toBe(200);
    }

    const blocked = await request(app).get('/test').set('X-Forwarded-For', ip);
    expect(blocked.status).toBe(429);
    expect(blocked.body).toMatchObject({ error: expect.stringContaining('Too many requests') });
  });

  it('includes Retry-After header on 429', async () => {
    const app = buildApp();
    const ip = '6.6.6.6';

    for (let i = 0; i < 100; i++) {
      await request(app).get('/test').set('X-Forwarded-For', ip);
    }

    const blocked = await request(app).get('/test').set('X-Forwarded-For', ip);
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);
  });

  it('isolates buckets per IP — exhausting one IP does not block another', async () => {
    const app = buildApp();

    for (let i = 0; i < 100; i++) {
      await request(app).get('/test').set('X-Forwarded-For', '10.0.0.1');
    }
    const blocked = await request(app).get('/test').set('X-Forwarded-For', '10.0.0.1');
    expect(blocked.status).toBe(429);

    const unaffected = await request(app).get('/test').set('X-Forwarded-For', '10.0.0.2');
    expect(unaffected.status).toBe(200);
  });
});

describe('createPublicRateLimiter — store delegation (replica-safe wiring)', () => {
  /**
   * Mock store that records every increment() call and always returns a low hit
   * count so requests are never actually blocked. This lets us isolate the
   * "is the store actually wired?" question from the "does limiting work?" question.
   */
  function createMockStore(): Store & { incrementCalls: string[] } {
    const incrementCalls: string[] = [];
    return {
      incrementCalls,
      init(_options: Options) {},
      async increment(key: string): Promise<IncrementResponse> {
        incrementCalls.push(key);
        return { totalHits: 1, resetTime: new Date(Date.now() + 60_000) };
      },
      async decrement(_key: string): Promise<void> {},
      async resetKey(_key: string): Promise<void> {},
      async get(_key: string): Promise<ClientRateLimitInfo | undefined> {
        return { totalHits: 1, resetTime: new Date(Date.now() + 60_000) };
      },
    };
  }

  it('calls increment() on the injected store for each request', async () => {
    const store = createMockStore();
    const app = buildApp(store);

    await request(app).get('/test').set('X-Forwarded-For', '7.7.7.7');

    expect(store.incrementCalls.length).toBe(1);
  });

  it('keys increment() by IP address', async () => {
    const store = createMockStore();
    const app = buildApp(store);

    await request(app).get('/test').set('X-Forwarded-For', '8.8.8.8');

    expect(store.incrementCalls[0]).toContain('8.8.8.8');
  });
});
