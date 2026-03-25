/**
 * Pin permission HTTP contract (message:pin / MODERATOR+)
 *
 * Verifies that when the permission layer denies message:pin, the tRPC Express
 * adapter returns HTTP 403 (not 500) with a FORBIDDEN-shaped payload.
 *
 * Uses jest.spyOn(permissionService.requirePermission) so Postgres does not need
 * to be running — the real withPermission middleware still runs end-to-end.
 */

import request from 'supertest';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { createApp } from '../src/app';
import { permissionService } from '../src/services/permission.service';
import type { Express } from 'express';

let app: Express;

beforeAll(() => {
  app = createApp();
});

describe('POST /trpc/message.pinMessage — permission denial (FORBIDDEN → HTTP)', () => {
  let requirePermissionSpy: jest.SpiedFunction<typeof permissionService.requirePermission>;

  beforeEach(() => {
    requirePermissionSpy = jest.spyOn(permissionService, 'requirePermission').mockImplementation(async () => {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You do not have permission to perform 'message:pin' in this server`,
      });
    });
  });

  afterEach(() => {
    requirePermissionSpy.mockRestore();
  });

  it('returns HTTP 403 when message:pin is denied', async () => {
    // Must match auth.service ACCESS_SECRET (dev fallback mirrors src/services/auth.service.ts).
    const secret = process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-in-prod';

    const userId = '00000000-0000-0000-0000-000000000099';
    const token = jwt.sign({ sub: userId }, secret, { expiresIn: '15m' });
    const serverId = '00000000-0000-0000-0000-0000000000aa';
    const messageId = '00000000-0000-0000-0000-0000000000bb';

    const res = await request(app)
      .post('/trpc/message.pinMessage')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send({ serverId, messageId });

    expect(res.status).toBe(403);
    expect(JSON.stringify(res.body)).toMatch(/FORBIDDEN|forbidden/i);
  });
});
