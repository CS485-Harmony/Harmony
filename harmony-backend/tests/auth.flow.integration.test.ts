/**
 * True auth integration tests
 *
 * These tests exercise assembled application components together:
 * Express routes, auth service, JWT auth context, tRPC user procedures,
 * and Prisma persistence against a real database.
 */

import jwt from 'jsonwebtoken';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../src/app';
import { prisma } from '../src/db/prisma';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RegisteredUser extends AuthTokens {
  email: string;
  response: request.Response;
  username: string;
  userId: string;
}

function createCredentials(label: string) {
  const suffix = `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    email: `auth-flow-${suffix}@example.com`,
    username: `auth_flow_${suffix}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32),
  };
}

function expectJwtForUser(token: string, userId: string) {
  expect(token.split('.')).toHaveLength(3);
  const decoded = jwt.decode(token) as { sub?: string } | null;
  expect(decoded?.sub).toBe(userId);
}

describe('auth flow integration', () => {
  let app: Express;
  const createdUserIds: string[] = [];

  beforeAll(() => {
    app = createApp();
  });

  afterAll(async () => {
    if (createdUserIds.length > 0) {
      await prisma.refreshToken
        .deleteMany({ where: { userId: { in: createdUserIds } } })
        .catch(() => {});
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  async function registerUser(label: string): Promise<RegisteredUser> {
    const { email, username } = createCredentials(label);
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email, username, password: 'password123' });

    const createdUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!createdUser) {
      throw new Error(
        `registerUser(${label}) did not persist a user for ${email}. HTTP status: ${response.status}`,
      );
    }
    createdUserIds.push(createdUser!.id);

    return {
      email,
      response,
      username,
      userId: createdUser!.id,
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
    };
  }

  it('registers a user, persists auth state, and exposes the user over authenticated tRPC', async () => {
    const registered = await registerUser('register');

    expect(registered.response.status).toBe(201);
    expect(typeof registered.accessToken).toBe('string');
    expect(typeof registered.refreshToken).toBe('string');
    expectJwtForUser(registered.accessToken, registered.userId);
    expectJwtForUser(registered.refreshToken, registered.userId);

    const createdUser = await prisma.user.findUnique({
      where: { id: registered.userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        status: true,
      },
    });

    expect(createdUser).toMatchObject({
      id: registered.userId,
      email: registered.email,
      username: registered.username,
      displayName: registered.username,
      status: 'OFFLINE',
    });

    const storedTokens = await prisma.refreshToken.findMany({
      where: { userId: registered.userId },
    });
    expect(storedTokens).toHaveLength(1);
    expect(storedTokens[0].revokedAt).toBeNull();

    const meRes = await request(app)
      .get('/trpc/user.getCurrentUser')
      .set('Authorization', `Bearer ${registered.accessToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.result.data).toMatchObject({
      id: registered.userId,
      email: registered.email,
      username: registered.username,
      displayName: registered.username,
      status: 'OFFLINE',
      isSystemAdmin: false,
    });
  });

  it('rejects duplicate registration for the same email and username', async () => {
    const { email, username } = createCredentials('duplicate');

    const firstRes = await request(app)
      .post('/api/auth/register')
      .send({ email, username, password: 'password123' });

    expect(firstRes.status).toBe(201);

    const createdUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    expect(createdUser).not.toBeNull();
    createdUserIds.push(createdUser!.id);

    const duplicateRes = await request(app)
      .post('/api/auth/register')
      .send({ email, username, password: 'password123' });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.error).toMatch(/email|username/i);
  });

  it('rejects login with the wrong password', async () => {
    const registered = await registerUser('wrong-password');

    expect(registered.response.status).toBe(201);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: registered.email, password: 'wrong-password' });

    expect(loginRes.status).toBe(401);
    expect(loginRes.body.error).toMatch(/invalid credentials/i);
  });

  it('rotates refresh tokens, updates the user via tRPC, and revokes the full login token lifecycle', async () => {
    const registered = await registerUser('lifecycle');

    expect(registered.response.status).toBe(201);
    // Revoke the registration-issued refresh token so the remaining assertions
    // describe only the login -> refresh -> logout lifecycle under test.
    const initialLogoutRes = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: registered.refreshToken });

    expect(initialLogoutRes.status).toBe(204);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: registered.email, password: 'password123' });

    expect(loginRes.status).toBe(200);

    const loginTokens = loginRes.body as AuthTokens;
    expectJwtForUser(loginTokens.accessToken, registered.userId);
    expectJwtForUser(loginTokens.refreshToken, registered.userId);

    const updateRes = await request(app)
      .post('/trpc/user.updateUser')
      .set('Authorization', `Bearer ${loginTokens.accessToken}`)
      .send({ displayName: 'Integration Renamed' });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.result.data).toMatchObject({
      id: registered.userId,
      email: registered.email,
      username: registered.username,
      displayName: 'Integration Renamed',
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: registered.userId },
      select: { displayName: true },
    });
    expect(updatedUser?.displayName).toBe('Integration Renamed');

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: loginTokens.refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(typeof refreshRes.body.accessToken).toBe('string');
    expect(typeof refreshRes.body.refreshToken).toBe('string');
    expect(refreshRes.body.refreshToken).not.toBe(loginTokens.refreshToken);
    expectJwtForUser(refreshRes.body.accessToken, registered.userId);
    expectJwtForUser(refreshRes.body.refreshToken, registered.userId);

    const reusedOldRefreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: loginTokens.refreshToken });

    expect(reusedOldRefreshRes.status).toBe(401);
    expect(reusedOldRefreshRes.body.error).toMatch(/revoked|expired/i);

    const refreshedMeRes = await request(app)
      .get('/trpc/user.getCurrentUser')
      .set('Authorization', `Bearer ${refreshRes.body.accessToken}`);

    expect(refreshedMeRes.status).toBe(200);
    expect(refreshedMeRes.body.result.data.displayName).toBe('Integration Renamed');

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: refreshRes.body.refreshToken });

    expect(logoutRes.status).toBe(204);

    const revokedRefreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: refreshRes.body.refreshToken });

    expect(revokedRefreshRes.status).toBe(401);
    expect(revokedRefreshRes.body.error).toMatch(/revoked|expired/i);

    const remainingActiveTokens = await prisma.refreshToken.findMany({
      where: { userId: registered.userId, revokedAt: null },
    });
    expect(remainingActiveTokens).toHaveLength(0);

    const allStoredTokens = await prisma.refreshToken.findMany({
      where: { userId: registered.userId },
      orderBy: { createdAt: 'asc' },
    });
    expect(allStoredTokens).toHaveLength(3);
    expect(allStoredTokens.every((token) => token.revokedAt !== null)).toBe(true);
  });

  it('rejects protected tRPC access when the bearer token is invalid', async () => {
    const res = await request(app)
      .get('/trpc/user.getCurrentUser')
      .set('Authorization', 'Bearer not-a-valid-jwt');

    expect(res.status).toBe(401);
  });
});
