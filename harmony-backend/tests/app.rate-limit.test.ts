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
  it('calls increment() on the injected store for POST /api/auth/login', async () => {
    const { factory, incrementCalls } = createStoreFactory();
    const app = createApp({ rateLimitStore: factory });

    await request(app).post('/api/auth/login').send({});

    expect(incrementCalls.length).toBeGreaterThan(0);
  });

  it('calls increment() on the injected store for POST /api/auth/login/challenge', async () => {
    const { factory, incrementCalls } = createStoreFactory();
    const app = createApp({ rateLimitStore: factory });

    await request(app).post('/api/auth/login/challenge').send({ email: 'alice@example.com' });

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

  it('uses the injected store for all four auth limiters (shared counting via factory)', async () => {
    const { factory, incrementCalls } = createStoreFactory();
    const app = createApp({ rateLimitStore: factory });

    await request(app).post('/api/auth/login').send({});
    await request(app).post('/api/auth/login/challenge').send({ email: 'alice@example.com' });
    await request(app).post('/api/auth/register').send({});
    await request(app).post('/api/auth/refresh').send({});

    // All four routes delegated to stores created by the same factory.
    expect(incrementCalls.length).toBe(4);
  });

  it('does not lock out local development after 10 login attempts', async () => {
    const previousEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      const app = createApp();
      let lastStatus = 0;

      for (let attempt = 0; attempt < 11; attempt += 1) {
        const res = await request(app).post('/api/auth/login').send({});
        lastStatus = res.status;
      }

      expect(lastStatus).not.toBe(429);
    } finally {
      process.env.NODE_ENV = previousEnv;
    }
  });
});
