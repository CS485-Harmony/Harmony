/**
 * HTTP status mapping test for permission denials on pin actions.
 *
 * Regression guard for: member pin attempts must return HTTP 403 (FORBIDDEN),
 * not HTTP 500.
 */

import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

jest.mock('../src/services/auth.service', () => ({
  authService: {
    verifyAccessToken: jest.fn(() => ({ sub: '00000000-0000-0000-0000-0000000000aa' })),
  },
}));

jest.mock('../src/services/permission.service', () => ({
  permissionService: {
    requirePermission: jest.fn(async () => {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
    }),
  },
}));

import { createContext, router, withPermission } from '../src/trpc/init';

const testRouter = router({
  pinMessage: withPermission('message:pin')
    .input(z.object({ serverId: z.string().uuid() }))
    .query(() => ({ ok: true })),
});

function createTestApp() {
  const app = express();
  app.use(
    '/trpc',
    createExpressMiddleware({
      router: testRouter,
      createContext,
    }),
  );
  return app;
}

describe('message pin permission denial HTTP mapping', () => {
  it('returns 403 (not 500) when permission middleware throws FORBIDDEN', async () => {
    const app = createTestApp();
    const serverId = '00000000-0000-0000-0000-000000000001';

    const res = await request(app)
      .get(`/trpc/pinMessage?input=${encodeURIComponent(JSON.stringify({ serverId }))}`)
      .set('Authorization', 'Bearer test-token')
      .set('Accept', 'application/json');

    expect(res.status).toBe(403);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.data.code).toBe('FORBIDDEN');
  });
});

