/**
 * Verifies that the auth rate limiters in createApp() use the injected store,
 * not an implicit process-local MemoryStore. This is the key property that
 * makes rate limits shared across replicas: every limiter must delegate
 * counting to whatever store is passed in — if it doesn't call increment(),
 * it has its own internal state and won't share across processes.
 *
 * Issue #318 — Shared Rate Limiting + Proxy-Aware Networking
 */

import request from 'supertest';
import type { Store, IncrementResponse, ClientRateLimitInfo, Options } from 'express-rate-limit';
import { createApp } from '../src/app';

/**
 * Builds a mock store that records every increment() call to a shared array.
 * The factory is called once per limiter so each limiter gets its own Store
 * instance (required by express-rate-limit v8 to avoid "unsharedStore" errors),
 * while all instances push to the same incrementCalls array so tests can
 * observe calls across all limiters from one place.
 */
function createStoreFactory(): { factory: () => Store; incrementCalls: string[] } {
  const incrementCalls: string[] = [];

  function factory(): Store {
    return {
      init(_options: Options) {},
      async increment(key: string): Promise<IncrementResponse> {
        incrementCalls.push(key);
        return { totalHits: 1, resetTime: new Date(Date.now() + 15 * 60 * 1000) };
      },
      async decrement(_key: string): Promise<void> {},
      async resetKey(_key: string): Promise<void> {},
      async get(_key: string): Promise<ClientRateLimitInfo | undefined> {
        return { totalHits: 1, resetTime: new Date(Date.now() + 15 * 60 * 1000) };
      },
    };
  }

  return { factory, incrementCalls };
}

describe('auth rate limiters — store delegation (Issue #318)', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalTrustProxyHops = process.env.TRUST_PROXY_HOPS;

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
    if (originalTrustProxyHops === undefined) {
      delete process.env.TRUST_PROXY_HOPS;
    } else {
      process.env.TRUST_PROXY_HOPS = originalTrustProxyHops;
    }
  });

  it('calls increment() on the injected store for POST /api/auth/login', async () => {
    const { factory, incrementCalls } = createStoreFactory();
    const app = createApp({ rateLimitStore: factory });

    await request(app).post('/api/auth/login').send({});

    expect(incrementCalls.length).toBeGreaterThan(0);
  });

  it('calls increment() on the injected store for POST /api/auth/register', async () => {
    const { factory, incrementCalls } = createStoreFactory();
    const app = createApp({ rateLimitStore: factory });

    await request(app).post('/api/auth/register').send({});

    expect(incrementCalls.length).toBeGreaterThan(0);
  });

  it('calls increment() on the injected store for POST /api/auth/refresh', async () => {
    const { factory, incrementCalls } = createStoreFactory();
    const app = createApp({ rateLimitStore: factory });

    await request(app).post('/api/auth/refresh').send({});

    expect(incrementCalls.length).toBeGreaterThan(0);
  });

  it('uses the injected store for all three auth limiters (shared counting via factory)', async () => {
    const { factory, incrementCalls } = createStoreFactory();
    const app = createApp({ rateLimitStore: factory });

    await request(app).post('/api/auth/login').send({});
    await request(app).post('/api/auth/register').send({});
    await request(app).post('/api/auth/refresh').send({});

    // All three routes delegated to stores created by the same factory →
    // 3 increment calls recorded in the shared array
    expect(incrementCalls.length).toBe(3);
  });

  it('does not lock out local development after 10 login attempts', async () => {
    process.env.NODE_ENV = 'development';

    const app = createApp();
    let lastStatus = 0;

    for (let attempt = 0; attempt < 11; attempt += 1) {
      const res = await request(app).post('/api/auth/login').send({});
      lastStatus = res.status;
    }

    expect(lastStatus).not.toBe(429);
  });

  it('throws in production when TRUST_PROXY_HOPS is unset', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.TRUST_PROXY_HOPS;

    expect(() => createApp({ rateLimitStore: createStoreFactory().factory })).toThrow(
      'TRUST_PROXY_HOPS must be set to a positive integer in production.',
    );
  });

  it('throws in production when TRUST_PROXY_HOPS is zero', () => {
    process.env.NODE_ENV = 'production';
    process.env.TRUST_PROXY_HOPS = '0';

    expect(() => createApp({ rateLimitStore: createStoreFactory().factory })).toThrow(
      'TRUST_PROXY_HOPS must be set to a positive integer in production.',
    );
  });

  it('sets trust proxy in production when TRUST_PROXY_HOPS is positive', () => {
    process.env.NODE_ENV = 'production';
    process.env.TRUST_PROXY_HOPS = '1';

    const app = createApp({ rateLimitStore: createStoreFactory().factory });

    expect(app.get('trust proxy')).toBe(1);
  });

  it('allows local development without TRUST_PROXY_HOPS', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.TRUST_PROXY_HOPS;

    expect(() => createApp()).not.toThrow();
  });
});
