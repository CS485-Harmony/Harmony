/**
 * True auth integration tests
 *
 * These tests exercise assembled application components together:
 * Express routes, auth service, JWT auth context, tRPC user procedures,
 * and Prisma persistence against a real database.
 */

import crypto from 'crypto';
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

async function derivePasswordVerifier(
  app: Express,
  path: '/api/auth/register/challenge' | '/api/auth/login/challenge',
  email: string,
  password: string,
) {
  const challengeRes =
    path === '/api/auth/register/challenge'
      ? await request(app).post(path).send({})
      : await request(app).post(path).send({ email });

  const passwordSalt = challengeRes.body.passwordSalt as string;
  return {
    passwordSalt,
    passwordVerifier: crypto
      .pbkdf2Sync(password, Buffer.from(passwordSalt, 'hex'), 310000, 32, 'sha256')
      .toString('base64'),
  };
}

function expectJwtForUser(token: string, userId: string) {
  expect(token.split('.')).toHaveLength(3);
  const decoded = jwt.decode(token) as { sub?: string } | null;
  expect(decoded?.sub).toBe(userId);
}

function getSetCookieHeaders(res: request.Response): string[] {
  const header = res.headers['set-cookie'];
  if (!header) return [];
  return Array.isArray(header) ? header : [header];
}

function getRefreshCookie(res: request.Response): string {
  const refreshCookie = getSetCookieHeaders(res).find((cookie) =>
    cookie.startsWith('harmony_refresh_token='),
  );
  expect(refreshCookie).toBeDefined();
  return refreshCookie!;
}

function getRefreshTokenFromCookie(res: request.Response): string {
  return decodeURIComponent(getRefreshCookie(res).split(';')[0].split('=')[1]);
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
    const { passwordSalt, passwordVerifier } = await derivePasswordVerifier(
      app,
      '/api/auth/register/challenge',
      email,
      'password123',
    );
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email, username, passwordSalt, passwordVerifier });

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
      refreshToken: getRefreshTokenFromCookie(response),
    };
  }

  it('registers a user, persists auth state, and exposes the user over authenticated tRPC', async () => {
    const registered = await registerUser('register');

    expect(registered.response.status).toBe(201);
    expect(typeof registered.accessToken).toBe('string');
    expect(typeof registered.refreshToken).toBe('string');
    expect(registered.response.body.refreshToken).toBeUndefined();
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
    const firstVerifier = await derivePasswordVerifier(
      app,
      '/api/auth/register/challenge',
      email,
      'password123',
    );

    const firstRes = await request(app)
      .post('/api/auth/register')
      .send({ email, username, ...firstVerifier });

    expect(firstRes.status).toBe(201);

    const createdUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    expect(createdUser).not.toBeNull();
    createdUserIds.push(createdUser!.id);

    const duplicateVerifier = await derivePasswordVerifier(
      app,
      '/api/auth/register/challenge',
      email,
      'password123',
    );
    const duplicateRes = await request(app)
      .post('/api/auth/register')
      .send({ email, username, ...duplicateVerifier });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.error).toMatch(/email|username/i);
  });

  it('rejects login with the wrong password', async () => {
    const registered = await registerUser('wrong-password');

    expect(registered.response.status).toBe(201);
    const wrongVerifier = await derivePasswordVerifier(
      app,
      '/api/auth/login/challenge',
      registered.email,
      'wrong-password',
    );
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: registered.email, passwordVerifier: wrongVerifier.passwordVerifier });

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
      .set('Cookie', getRefreshCookie(registered.response))
      .send({});

    expect(initialLogoutRes.status).toBe(204);

    const loginVerifier = await derivePasswordVerifier(
      app,
      '/api/auth/login/challenge',
      registered.email,
      'password123',
    );
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: registered.email, passwordVerifier: loginVerifier.passwordVerifier });

    expect(loginRes.status).toBe(200);

    const loginTokens: AuthTokens = {
      accessToken: loginRes.body.accessToken,
      refreshToken: getRefreshTokenFromCookie(loginRes),
    };
    expect(loginRes.body.refreshToken).toBeUndefined();
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
      .set('Cookie', getRefreshCookie(loginRes))
      .send({});

    expect(refreshRes.status).toBe(200);
    expect(typeof refreshRes.body.accessToken).toBe('string');
    expect(refreshRes.body.refreshToken).toBeUndefined();
    const rotatedRefreshToken = getRefreshTokenFromCookie(refreshRes);
    expect(rotatedRefreshToken).not.toBe(loginTokens.refreshToken);
    expectJwtForUser(refreshRes.body.accessToken, registered.userId);
    expectJwtForUser(rotatedRefreshToken, registered.userId);

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
      .set('Cookie', getRefreshCookie(refreshRes))
      .send({});

    expect(logoutRes.status).toBe(204);

    const revokedRefreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: rotatedRefreshToken });

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
