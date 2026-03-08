import express, { Request, Response } from 'express';
import request from 'supertest';
import { tokenBucketRateLimiter, isVerifiedBot, _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware';

function createTestApp() {
  const app = express();
  app.set('trust proxy', true);
  app.use(tokenBucketRateLimiter);
  app.get('/test', (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });
  return app;
}

beforeEach(() => {
  _clearBucketsForTesting();
});

describe('isVerifiedBot', () => {
  it('identifies Googlebot as a verified bot', () => {
    expect(isVerifiedBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
  });

  it('identifies Bingbot as a verified bot', () => {
    expect(isVerifiedBot('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(false);
    expect(isVerifiedBot('Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(true);
  });

  it('returns false for a normal browser User-Agent', () => {
    expect(isVerifiedBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')).toBe(false);
  });

  it('returns false for undefined User-Agent', () => {
    expect(isVerifiedBot(undefined)).toBe(false);
  });

  it('returns false for empty string User-Agent', () => {
    expect(isVerifiedBot('')).toBe(false);
  });
});

describe('tokenBucketRateLimiter — human users', () => {
  it('allows requests within the 100 req/min limit', async () => {
    const app = createTestApp();
    const res = await request(app).get('/test').set('X-Forwarded-For', '1.2.3.4');
    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-limit']).toBe('100');
  });

  it('includes RateLimit-Remaining header that decrements', async () => {
    const app = createTestApp();

    const first = await request(app).get('/test').set('X-Forwarded-For', '1.2.3.100');
    expect(first.status).toBe(200);
    const remaining1 = Number(first.headers['ratelimit-remaining']);

    const second = await request(app).get('/test').set('X-Forwarded-For', '1.2.3.100');
    expect(second.status).toBe(200);
    const remaining2 = Number(second.headers['ratelimit-remaining']);

    expect(remaining2).toBe(remaining1 - 1);
  });

  it('returns 429 after exhausting the 100-request budget', async () => {
    const app = createTestApp();
    const ip = '5.5.5.5';

    // Exhaust the 100-token budget
    for (let i = 0; i < 100; i++) {
      const res = await request(app).get('/test').set('X-Forwarded-For', ip);
      expect(res.status).toBe(200);
    }

    // 101st request should be rate-limited
    const res = await request(app).get('/test').set('X-Forwarded-For', ip);
    expect(res.status).toBe(429);
    expect(res.body).toMatchObject({ error: expect.stringContaining('Too many requests') });
  });

  it('includes Retry-After header on 429 response', async () => {
    const app = createTestApp();
    const ip = '6.6.6.6';

    for (let i = 0; i < 100; i++) {
      await request(app).get('/test').set('X-Forwarded-For', ip);
    }

    const res = await request(app).get('/test').set('X-Forwarded-For', ip);
    expect(res.status).toBe(429);
    expect(res.headers['retry-after']).toBeDefined();
    expect(Number(res.headers['retry-after'])).toBeGreaterThan(0);
  });

  it('isolates rate limit buckets per IP', async () => {
    const app = createTestApp();

    // Exhaust budget for IP A
    for (let i = 0; i < 100; i++) {
      await request(app).get('/test').set('X-Forwarded-For', '10.0.0.1');
    }
    const exhausted = await request(app).get('/test').set('X-Forwarded-For', '10.0.0.1');
    expect(exhausted.status).toBe(429);

    // IP B should still have its full budget
    const ipB = await request(app).get('/test').set('X-Forwarded-For', '10.0.0.2');
    expect(ipB.status).toBe(200);
  });
});

describe('tokenBucketRateLimiter — verified bots', () => {
  const GOOGLEBOT_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
  const BINGBOT_UA = 'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)';

  it('grants Googlebot the 1000 req/min capacity', async () => {
    const app = createTestApp();
    const res = await request(app).get('/test').set('User-Agent', GOOGLEBOT_UA);
    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-limit']).toBe('1000');
  });

  it('grants Bingbot the 1000 req/min capacity', async () => {
    const app = createTestApp();
    const res = await request(app).get('/test').set('User-Agent', BINGBOT_UA);
    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-limit']).toBe('1000');
  });

  it('allows Googlebot through while a human IP is rate-limited', async () => {
    const app = createTestApp();
    const ip = '9.9.9.9';

    // Exhaust human budget
    for (let i = 0; i < 100; i++) {
      await request(app).get('/test').set('X-Forwarded-For', ip);
    }
    const humanBlocked = await request(app).get('/test').set('X-Forwarded-For', ip);
    expect(humanBlocked.status).toBe(429);

    // Googlebot from the same IP should still succeed (different bucket key)
    const botRes = await request(app).get('/test').set('User-Agent', GOOGLEBOT_UA);
    expect(botRes.status).toBe(200);
  });

  it('returns 429 for a bot that exceeds 1000 req/min', async () => {
    const app = createTestApp();

    // Exhaust bot budget
    for (let i = 0; i < 1000; i++) {
      const res = await request(app).get('/test').set('User-Agent', GOOGLEBOT_UA);
      expect(res.status).toBe(200);
    }

    const res = await request(app).get('/test').set('User-Agent', GOOGLEBOT_UA);
    expect(res.status).toBe(429);
    expect(res.headers['retry-after']).toBeDefined();
  });
});

describe('tokenBucketRateLimiter — response headers', () => {
  it('includes RateLimit-Reset header on every response', async () => {
    const app = createTestApp();
    const res = await request(app).get('/test').set('X-Forwarded-For', '20.0.0.1');
    expect(res.headers['ratelimit-reset']).toBeDefined();
    expect(Number(res.headers['ratelimit-reset'])).toBeGreaterThan(0);
  });
});
