/**
 * Auth route tests — Issue #97 / #313
 *
 * Covers the challenge-based verifier flow so raw passwords never reach the
 * auth REST endpoints that mint tokens.
 */

import crypto from 'crypto';
import request from 'supertest';
import { createApp } from '../src/app';
import type { Express } from 'express';
import bcrypt from 'bcryptjs';

const PASSWORD_SALT = '00112233445566778899aabbccddeeff';

function derivePasswordVerifier(password: string, passwordSalt = PASSWORD_SALT): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(passwordSalt, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
}

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
      upsert: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    server: {
      findFirst: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    serverMember: {
      create: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

jest.mock('../src/services/serverMember.service', () => ({
  serverMemberService: { joinServer: jest.fn().mockResolvedValue(undefined) },
}));

import { prisma } from '../src/db/prisma';

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    upsert: jest.Mock;
  };
  refreshToken: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
  server: {
    findFirst: jest.Mock;
    findMany: jest.Mock;
  };
  serverMember: {
    create: jest.Mock;
    upsert: jest.Mock;
  };
};

let app: Express;

beforeAll(async () => {
  const verifierHash = await bcrypt.hash(derivePasswordVerifier('password123'), 4);
  mockUser.passwordHash = `v1$${PASSWORD_SALT}$${verifierHash}`;
  app = createApp();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/auth/register/challenge', () => {
  it('returns a 32-char hexadecimal password salt', async () => {
    const res = await request(app)
      .post('/api/auth/register/challenge')
      .set('Origin', 'http://localhost:3000')
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.passwordSalt).toMatch(/^[0-9a-f]{32}$/i);
  });
});

describe('POST /api/auth/register', () => {
  it('creates a new user and returns access + refresh tokens', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'alice@example.com',
        username: 'alice',
        passwordSalt: PASSWORD_SALT,
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    expect(res.status).toBe(201);
    expect(typeof res.body.accessToken).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  it('returns 400 when the verifier payload is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'bad-email', username: 'a' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it.each(['--admin', '_admin', '__system'])(
    'rejects username %s because usernames must start with a letter or number',
    async (username) => {
      const res = await request(app)
        .post('/api/auth/register')
        .set('Origin', 'http://localhost:3000')
        .send({
          email: `${username.replace(/[^a-zA-Z0-9]/g, '')}@example.com`,
          username,
          passwordSalt: PASSWORD_SALT,
          passwordVerifier: derivePasswordVerifier('password123'),
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    },
  );

  it('accepts usernames that start with a number', async () => {
    const numericUsernameUser = { ...mockUser, username: '0validname' };
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(numericUsernameUser);
    mockPrisma.refreshToken.create.mockResolvedValue({
      ...mockRefreshToken,
      userId: numericUsernameUser.id,
    });

    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: '0validname@example.com',
        username: numericUsernameUser.username,
        passwordSalt: PASSWORD_SALT,
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    expect(res.status).toBe(201);
    expect(typeof res.body.accessToken).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ username: numericUsernameUser.username }),
      }),
    );
  });

  it('returns 409 when email is already in use', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'alice@example.com',
        username: 'alice2',
        passwordSalt: PASSWORD_SALT,
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/email/i);
  });
});

describe('POST /api/auth/register — reserved identities (issue #466)', () => {
  it('rejects registration with the reserved admin email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'admin@harmony.dev',
        username: 'notadmin',
        passwordSalt: PASSWORD_SALT,
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/reserved/i);
  });

  it('rejects registration with the reserved admin email regardless of case', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'Admin@Harmony.Dev',
        username: 'notadmin',
        passwordSalt: PASSWORD_SALT,
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/reserved/i);
  });

  it('rejects registration with the reserved username "admin"', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'someone@example.com',
        username: 'admin',
        passwordSalt: PASSWORD_SALT,
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/reserved/i);
  });
});

describe('POST /api/auth/login/challenge', () => {
  it('returns the stored password salt for existing users', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login/challenge')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'alice@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.passwordSalt).toBe(PASSWORD_SALT);
  });

  it('returns a deterministic dummy salt for unknown users', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const first = await request(app)
      .post('/api/auth/login/challenge')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'nobody@example.com' });
    const second = await request(app)
      .post('/api/auth/login/challenge')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'nobody@example.com' });

    expect(first.status).toBe(200);
    expect(first.body.passwordSalt).toMatch(/^[0-9a-f]{32}$/i);
    expect(second.body.passwordSalt).toBe(first.body.passwordSalt);
  });
});

describe('POST /api/auth/login', () => {
  it('returns access + refresh tokens on a valid verifier payload', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'alice@example.com',
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    expect(res.status).toBe(200);
    expect(typeof res.body.accessToken).toBe('string');
    expect(typeof res.body.refreshToken).toBe('string');
  });

  it('returns 401 for the wrong verifier', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'alice@example.com',
        passwordVerifier: derivePasswordVerifier('wrongpassword'),
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('returns 401 for an unknown email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'nobody@example.com',
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    expect(res.status).toBe(401);
  });

  it('returns 400 for malformed request payloads', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/logout', () => {
  it('revokes the refresh token and returns 204', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'alice@example.com',
        passwordVerifier: derivePasswordVerifier('password123'),
      });

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

describe('POST /api/auth/refresh', () => {
  it('issues new tokens when given a valid refresh token', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'alice@example.com',
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    const { refreshToken } = loginRes.body as { refreshToken: string };

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

describe('tRPC health check with Bearer token', () => {
  it('returns 200 for /trpc/health with a valid Bearer token', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({
        email: 'alice@example.com',
        passwordVerifier: derivePasswordVerifier('password123'),
      });

    const { accessToken } = loginRes.body as { accessToken: string };

    const res = await request(app)
      .get('/trpc/health')
      .set('Origin', 'http://localhost:3000')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
  });
});
