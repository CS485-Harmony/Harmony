/**
 * tRPC errorFormatter tests — Issue #165
 *
 * Verifies that the errorFormatter in src/trpc/init.ts strips stack traces
 * from error responses in non-development environments.
 *
 * Strategy: call an authedProcedure endpoint (/trpc/user.getCurrentUser)
 * without an Authorization header so the middleware throws UNAUTHORIZED.
 * The HTTP response body carries the shaped error, including (or excluding)
 * the `data.stack` field depending on NODE_ENV.
 *
 * Prisma is mocked so no running database is required.
 */

import request from 'supertest';
import { createApp } from '../src/app';

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    server: { findUnique: jest.fn(), create: jest.fn() },
    serverMember: { findUnique: jest.fn() },
    refreshToken: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    auditLog: { create: jest.fn() },
  },
}));

// ─────────────────────────────────────────────────────────────────────────────

const AUTHED_ENDPOINT = '/trpc/user.getCurrentUser';

describe('tRPC errorFormatter — stack trace suppression', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('omits stack trace when NODE_ENV is production', async () => {
    process.env.NODE_ENV = 'production';
    const app = createApp();

    const res = await request(app)
      .get(AUTHED_ENDPOINT)
      .set('Accept', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.data.stack).toBeUndefined();
  });

  it('includes stack trace when NODE_ENV is development and EXPOSE_STACK=1', async () => {
    process.env.NODE_ENV = 'development';
    process.env.EXPOSE_STACK = '1';
    const app = createApp();

    try {
      const res = await request(app)
        .get(AUTHED_ENDPOINT)
        .set('Accept', 'application/json');

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
      expect(typeof res.body.error.data.stack).toBe('string');
    } finally {
      delete process.env.EXPOSE_STACK;
    }
  });

  it('omits stack trace when NODE_ENV is development but EXPOSE_STACK is unset', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.EXPOSE_STACK;
    const app = createApp();

    const res = await request(app)
      .get(AUTHED_ENDPOINT)
      .set('Accept', 'application/json');

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.data.stack).toBeUndefined();
  });
});
