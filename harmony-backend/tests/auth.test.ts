/**
 * Auth route tests — Issue #97
 *
 * Happy-path coverage for POST /api/auth/register, /login, /logout, /refresh.
 * Prisma is mocked so no running database is required.
 */

import request from 'supertest';
import { createApp } from '../src/app';
import type { Express } from 'express';
import bcrypt from 'bcryptjs';

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

const mockUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'alice@example.com',
  username: 'alice',
  passwordHash: '',
  displayName: 'alice',
  avatarUrl: null,
  publicProfile: true,
  createdAt: new Date(),
};

const mockRefreshToken = {
  id: '00000000-0000-0000-0000-000000000002',
  tokenHash: '',
  userId: mockUser.id,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  revokedAt: null,
  createdAt: new Date(),
};

jest.mock('../src/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    server: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
    serverMember: {
      create: jest.fn(),
    },
  },
}));

import { prisma } from '../src/db/prisma';

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
  refreshToken: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
};

// ─── Setup ────────────────────────────────────────────────────────────────────

let app: Express;

beforeAll(async () => {
  mockUser.passwordHash = await bcrypt.hash('password123', 4);
  app = createApp();
});

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('creates a new user and returns access + refresh tokens', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null); // email not taken
    mockPrisma.user.create.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'alice@example.com', username: 'alice', password: 'password123' });

    expect(res.status).toBe(201);
    expect(typeof res.body.accessToken).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'bad-email', username: 'a' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 409 when email is already in use', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser); // email taken

    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'alice@example.com', username: 'alice2', password: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/email/i);
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('returns access + refresh tokens on valid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'alice@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(typeof res.body.accessToken).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  it('returns 401 for wrong password', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'alice@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('returns 401 for unknown email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('returns 400 for malformed request', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('revokes the refresh token and returns 204', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

    // Get a real refresh token first by logging in
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'alice@example.com', password: 'password123' });

    const { refreshToken } = loginRes.body as { refreshToken: string };

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Origin', 'http://localhost:3000')
      .send({ refreshToken });

    expect(logoutRes.status).toBe(204);
    expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
  });

  it('returns 400 when refreshToken is missing', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Origin', 'http://localhost:3000')
      .send({});

    expect(res.status).toBe(400);
  });
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────

describe('POST /api/auth/refresh', () => {
  it('issues new tokens when given a valid refresh token', async () => {
    // Step 1: get a real signed refresh token via login
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'alice@example.com', password: 'password123' });

    const { refreshToken } = loginRes.body as { refreshToken: string };

    // Step 2: use the refresh token — atomic updateMany returns count: 1 on success
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Origin', 'http://localhost:3000')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(typeof refreshRes.body.accessToken).toBe('string');
    expect(typeof refreshRes.body.refreshToken).toBe('string');
  });
});

// ─── tRPC health endpoint with auth header ───────────────────────────────────

describe('tRPC health check with Bearer token', () => {
  it('returns 200 for /trpc/health with a valid Bearer token', async () => {
    // Login to get an access token
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'alice@example.com', password: 'password123' });

    const { accessToken } = loginRes.body as { accessToken: string };

    const res = await request(app)
      .get('/trpc/health')
      .set('Origin', 'http://localhost:3000')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
  });
});
