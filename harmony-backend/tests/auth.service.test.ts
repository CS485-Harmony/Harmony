/**
 * Auth service unit tests — Issue #258
 *
 * Covers authService.register, login, logout, refreshTokens, verifyAccessToken.
 * Prisma and serverMemberService are fully mocked — no real DB required.
 *
 * IMPORTANT: JWT secrets are read at module import time. Tests use the
 * module re-import pattern (jest.resetModules + jest.isolateModules) whenever
 * env vars need to differ between tests (e.g. production mode).
 */

// ─── Set env vars before any imports ─────────────────────────────────────────

process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_DAYS = '7';
process.env.NODE_ENV = 'test';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    server: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    serverMember: {
      upsert: jest.fn(),
    },
  },
}));

jest.mock('../src/services/serverMember.service', () => ({
  serverMemberService: { joinServer: jest.fn() },
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../src/db/prisma';
import { serverMemberService } from '../src/services/serverMember.service';
import { authService } from '../src/services/auth.service';

// ─── Typed mock helpers ───────────────────────────────────────────────────────

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    upsert: jest.Mock;
  };
  refreshToken: {
    create: jest.Mock;
    updateMany: jest.Mock;
  };
  server: {
    findFirst: jest.Mock;
    findMany: jest.Mock;
  };
  serverMember: {
    upsert: jest.Mock;
  };
};

const mockJoinServer = serverMemberService.joinServer as jest.Mock;

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const ACCESS_SECRET = 'test-access-secret';
const REFRESH_SECRET = 'test-refresh-secret';
const ADMIN_EMAIL = 'admin@harmony.dev';

const mockUserId = '00000000-0000-0000-0000-000000000001';
const mockUser = {
  id: mockUserId,
  email: 'user@example.com',
  username: 'testuser',
  passwordHash: '', // set in beforeAll
  displayName: 'testuser',
  avatarUrl: null,
  publicProfile: true,
  createdAt: new Date(),
};

const mockRefreshTokenRecord = {
  id: '00000000-0000-0000-0000-000000000002',
  tokenHash: '',
  userId: mockUserId,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  revokedAt: null,
  createdAt: new Date(),
};

// ─── Utility: sign a real refresh token with the test secret ─────────────────

function signTestRefreshToken(userId: string, overrides?: jwt.SignOptions): string {
  return jwt.sign(
    { sub: userId, jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: '7d', ...overrides },
  );
}

function signTestAccessToken(userId: string, overrides?: jwt.SignOptions): string {
  return jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: '15m', ...overrides });
}

// ─── Global setup ─────────────────────────────────────────────────────────────

beforeAll(async () => {
  mockUser.passwordHash = await bcrypt.hash('SecurePass123!', 4); // fast for tests
});

beforeEach(() => {
  // resetAllMocks clears mock call history AND the Once queue so that
  // unconsumed mockResolvedValueOnce values from a previous test do not
  // bleed into the next one.
  jest.resetAllMocks();
  // Default stubs — override per test as needed
  mockPrisma.user.findUnique.mockResolvedValue(null);
  mockPrisma.user.create.mockResolvedValue(mockUser);
  mockPrisma.user.upsert.mockResolvedValue({ ...mockUser, email: ADMIN_EMAIL, username: 'admin' });
  mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);
  mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
  mockPrisma.server.findFirst.mockResolvedValue(null);
  mockPrisma.server.findMany.mockResolvedValue([]);
  mockPrisma.serverMember.upsert.mockResolvedValue({});
  mockJoinServer.mockResolvedValue(undefined);
});

// ─── 4.1 register ─────────────────────────────────────────────────────────────

describe('authService.register', () => {
  it('returns tokens when registering with valid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);

    const result = await authService.register('user@example.com', 'testuser', 'SecurePass123!');

    expect(typeof result.accessToken).toBe('string');
    expect(result.accessToken.length).toBeGreaterThan(0);
    expect(typeof result.refreshToken).toBe('string');
    expect(result.refreshToken.length).toBeGreaterThan(0);
  });

  it('stores the refresh token hash in the database with correct expiry', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);

    const before = Date.now();
    await authService.register('user@example.com', 'testuser', 'SecurePass123!');
    const after = Date.now();

    expect(mockPrisma.refreshToken.create).toHaveBeenCalledTimes(1);
    const createArg = mockPrisma.refreshToken.create.mock.calls[0][0] as {
      data: { tokenHash: string; userId: string; expiresAt: Date };
    };
    expect(createArg.data.userId).toBe(mockUserId);
    expect(typeof createArg.data.tokenHash).toBe('string');
    expect(createArg.data.tokenHash).toHaveLength(64); // sha256 hex
    // Verify expiresAt is ~7 calendar days in the future using the same
    // Date#setDate logic as the implementation to avoid DST-related flakiness.
    const expiresMs = createArg.data.expiresAt.getTime();
    const expectedMin = new Date(before);
    expectedMin.setDate(expectedMin.getDate() + 7);
    const expectedMax = new Date(after);
    expectedMax.setDate(expectedMax.getDate() + 7);
    expect(expiresMs).toBeGreaterThanOrEqual(expectedMin.getTime());
    expect(expiresMs).toBeLessThanOrEqual(expectedMax.getTime());
  });

  it('rejects duplicate email with CONFLICT', async () => {
    // First findUnique (email check) returns existing user → throws before username check
    mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

    await expect(
      authService.register('user@example.com', 'newuser', 'pass'),
    ).rejects.toMatchObject({ code: 'CONFLICT', message: 'Email already in use' });
  });

  it('rejects duplicate username with CONFLICT', async () => {
    mockPrisma.user.findUnique
      .mockResolvedValueOnce(null) // email check: not taken
      .mockResolvedValueOnce(mockUser); // username check: taken

    await expect(
      authService.register('new@example.com', 'testuser', 'pass'),
    ).rejects.toMatchObject({ code: 'CONFLICT', message: 'Username already taken' });
  });

  it('maps Prisma P2002 race condition to CONFLICT', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const p2002 = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '5.0.0',
    });
    mockPrisma.user.create.mockRejectedValue(p2002);

    await expect(
      authService.register('user@example.com', 'testuser', 'SecurePass123!'),
    ).rejects.toMatchObject({ code: 'CONFLICT', message: 'Email or username already in use' });
  });

  it('re-throws non-P2002 Prisma errors', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const unknownError = new Error('DB connection lost');
    mockPrisma.user.create.mockRejectedValue(unknownError);

    await expect(
      authService.register('user@example.com', 'testuser', 'SecurePass123!'),
    ).rejects.toThrow('DB connection lost');
  });

  it('calls joinServer when default server exists', async () => {
    const defaultServerId = 'server-id-001';
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);
    mockPrisma.server.findFirst.mockResolvedValue({ id: defaultServerId });

    await authService.register('user@example.com', 'testuser', 'SecurePass123!');

    expect(mockJoinServer).toHaveBeenCalledWith(mockUserId, defaultServerId);
  });

  it('succeeds without calling joinServer when no default server exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);
    mockPrisma.server.findFirst.mockResolvedValue(null);

    const result = await authService.register('user@example.com', 'testuser', 'SecurePass123!');

    expect(result.accessToken).toBeTruthy();
    expect(mockJoinServer).not.toHaveBeenCalled();
  });

  it('continues registration when joinServer fails (soft fail)', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);
    mockPrisma.server.findFirst.mockResolvedValue({ id: 'server-001' });
    mockJoinServer.mockRejectedValue(new Error('Server join failed'));

    // Should NOT throw — soft fail
    const result = await authService.register('user@example.com', 'testuser', 'SecurePass123!');

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it('hashes the password with bcrypt before storing', async () => {
    const bcryptSpy = jest.spyOn(bcrypt, 'hash');
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);

    await authService.register('user@example.com', 'testuser', 'SecurePass123!');

    expect(bcryptSpy).toHaveBeenCalledWith('SecurePass123!', 12);

    // Verify the user was created with a hash, not the plaintext password
    const createArgs = mockPrisma.user.create.mock.calls[0][0] as {
      data: { passwordHash: string };
    };
    expect(createArgs.data.passwordHash).not.toBe('SecurePass123!');
    expect(createArgs.data.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt format

    bcryptSpy.mockRestore();
  });

  it('sets displayName to username by default', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue(mockUser);

    await authService.register('user@example.com', 'testuser', 'SecurePass123!');

    const createArgs = mockPrisma.user.create.mock.calls[0][0] as {
      data: { displayName: string; username: string };
    };
    expect(createArgs.data.displayName).toBe(createArgs.data.username);
  });
});

// ─── 4.2 login ────────────────────────────────────────────────────────────────

describe('authService.login', () => {
  it('returns tokens on valid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);

    const result = await authService.login('user@example.com', 'SecurePass123!');

    expect(typeof result.accessToken).toBe('string');
    expect(result.accessToken.length).toBeGreaterThan(0);
    expect(typeof result.refreshToken).toBe('string');
    expect(result.refreshToken.length).toBeGreaterThan(0);
  });

  it('rejects wrong password with UNAUTHORIZED', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    await expect(
      authService.login('user@example.com', 'wrongpassword'),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
  });

  it('rejects non-existent email with UNAUTHORIZED', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login('nobody@example.com', 'anypassword'),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
  });

  it('calls bcrypt.compare with timing-dummy hash for non-existent email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await authService.login('nobody@example.com', 'anypassword').catch(() => {/* expected */});

    expect(compareSpy).toHaveBeenCalledTimes(1);
    const [, hashArg] = compareSpy.mock.calls[0];
    // The timing dummy hash starts with the bcrypt prefix
    expect(hashArg).toMatch(/^\$2[aby]\$/);

    compareSpy.mockRestore();
  });

  it('admin override works in non-production (development)', async () => {
    const adminUser = {
      ...mockUser,
      id: 'admin-id-001',
      email: ADMIN_EMAIL,
      username: 'admin',
      displayName: 'System Admin',
    };
    mockPrisma.user.upsert.mockResolvedValue(adminUser);
    mockPrisma.server.findMany.mockResolvedValue([]);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);

    // NODE_ENV is 'test' which is !== 'production', so override should work
    const result = await authService.login(ADMIN_EMAIL, 'admin');

    expect(typeof result.accessToken).toBe('string');
    expect(typeof result.refreshToken).toBe('string');
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: ADMIN_EMAIL },
      }),
    );
  });

  it('disables admin override in production', async () => {
    // The admin-override check is runtime (process.env.NODE_ENV !== 'production'),
    // not import-time, so we can just toggle the env var directly.
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    mockPrisma.user.findUnique.mockResolvedValue(null);

    try {
      await expect(
        authService.login(ADMIN_EMAIL, 'admin'),
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });

  it('admin override upserts admin user with correct fields', async () => {
    const adminUser = {
      ...mockUser,
      id: 'admin-id-001',
      email: ADMIN_EMAIL,
      username: 'admin',
      displayName: 'System Admin',
    };
    mockPrisma.user.upsert.mockResolvedValue(adminUser);
    mockPrisma.server.findMany.mockResolvedValue([]);
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);

    await authService.login(ADMIN_EMAIL, 'admin');

    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          email: ADMIN_EMAIL,
          username: 'admin',
          displayName: 'System Admin',
        }),
      }),
    );
  });

  it('admin override makes admin OWNER of all servers', async () => {
    const adminUser = { ...mockUser, id: 'admin-id-001', email: ADMIN_EMAIL };
    mockPrisma.user.upsert.mockResolvedValue(adminUser);
    mockPrisma.server.findMany.mockResolvedValue([
      { id: 'server-001' },
      { id: 'server-002' },
      { id: 'server-003' },
    ]);
    mockPrisma.serverMember.upsert.mockResolvedValue({});
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);

    await authService.login(ADMIN_EMAIL, 'admin');

    expect(mockPrisma.serverMember.upsert).toHaveBeenCalledTimes(3);
    for (const call of mockPrisma.serverMember.upsert.mock.calls) {
      const arg = call[0] as { update: { role: string }; create: { role: string } };
      expect(arg.update.role).toBe('OWNER');
      expect(arg.create.role).toBe('OWNER');
    }
  });

  it('propagates error when admin user upsert fails', async () => {
    mockPrisma.user.upsert.mockRejectedValue(new Error('DB error during upsert'));

    await expect(
      authService.login(ADMIN_EMAIL, 'admin'),
    ).rejects.toThrow('DB error during upsert');
  });

  it('propagates error when admin serverMember upsert fails', async () => {
    const adminUser = { ...mockUser, id: 'admin-id-001', email: ADMIN_EMAIL };
    mockPrisma.user.upsert.mockResolvedValue(adminUser);
    mockPrisma.server.findMany.mockResolvedValue([{ id: 'server-001' }, { id: 'server-002' }, { id: 'server-003' }]);
    // Fail on 3rd iteration
    mockPrisma.serverMember.upsert
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('serverMember upsert failed'));

    await expect(
      authService.login(ADMIN_EMAIL, 'admin'),
    ).rejects.toThrow('serverMember upsert failed');
  });
});

// ─── 4.3 logout ───────────────────────────────────────────────────────────────

describe('authService.logout', () => {
  it('calls updateMany to revoke the token', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    const rawToken = signTestRefreshToken(mockUserId);

    await authService.logout(rawToken);

    expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
    const args = mockPrisma.refreshToken.updateMany.mock.calls[0][0] as {
      where: { tokenHash: string; revokedAt: null };
      data: { revokedAt: Date };
    };
    const expectedHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    expect(args.where.tokenHash).toBe(expectedHash);
    expect(args.where.revokedAt).toBeNull();
    expect(args.data.revokedAt).toBeInstanceOf(Date);
  });

  it('is idempotent when called twice with the same token', async () => {
    mockPrisma.refreshToken.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 }); // already revoked
    const rawToken = signTestRefreshToken(mockUserId);

    await expect(authService.logout(rawToken)).resolves.toBeUndefined();
    await expect(authService.logout(rawToken)).resolves.toBeUndefined();
    expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledTimes(2);
  });

  it('does not throw for unknown/invalid token (idempotent)', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });

    await expect(authService.logout('not-a-real-token')).resolves.toBeUndefined();
    // Verify updateMany is still called (not silently skipped) even for unknown tokens
    expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
  });

  it('only revokes the matching token hash', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    const tokenToRevoke = signTestRefreshToken(mockUserId);

    await authService.logout(tokenToRevoke);

    const args = mockPrisma.refreshToken.updateMany.mock.calls[0][0] as {
      where: { tokenHash: string };
    };
    const expectedHash = crypto.createHash('sha256').update(tokenToRevoke).digest('hex');
    expect(args.where.tokenHash).toBe(expectedHash);
    // updateMany is called with a specific hash — only that record is affected
    expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
  });
});

// ─── 4.4 refreshTokens ────────────────────────────────────────────────────────

describe('authService.refreshTokens', () => {
  it('returns new tokens for a valid, non-revoked, non-expired token', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);
    const rawToken = signTestRefreshToken(mockUserId);

    const result = await authService.refreshTokens(rawToken);

    expect(typeof result.accessToken).toBe('string');
    expect(result.accessToken.length).toBeGreaterThan(0);
    expect(typeof result.refreshToken).toBe('string');
    expect(result.refreshToken.length).toBeGreaterThan(0);
  });

  it('rejects token with invalid/tampered signature', async () => {
    const rawToken = signTestRefreshToken(mockUserId);
    const tampered = rawToken.slice(0, -5) + 'XXXXX';

    await expect(authService.refreshTokens(tampered)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid refresh token',
    });
  });

  it('rejects token signed with the wrong secret', async () => {
    const wrongSecretToken = jwt.sign(
      { sub: mockUserId, jti: crypto.randomUUID() },
      'wrong-secret',
      { expiresIn: '7d' },
    );

    await expect(authService.refreshTokens(wrongSecretToken)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid refresh token',
    });
  });

  it('rejects an expired JWT token', async () => {
    const expiredToken = signTestRefreshToken(mockUserId, { expiresIn: -1 });

    await expect(authService.refreshTokens(expiredToken)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid refresh token',
    });
  });

  it('rejects revoked token when updateMany returns count 0', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });
    const rawToken = signTestRefreshToken(mockUserId);

    await expect(authService.refreshTokens(rawToken)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Refresh token revoked or expired',
    });
  });

  it('rejects token whose DB expiresAt is in the past (count 0 from date filter)', async () => {
    // Distinct from "revoked" — the token is NOT revoked (revokedAt === null)
    // but updateMany returns count: 0 because the expiresAt < now filter fails.
    // We verify the updateMany where clause includes the expiresAt > now condition.
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });
    const rawToken = signTestRefreshToken(mockUserId);

    await expect(authService.refreshTokens(rawToken)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Refresh token revoked or expired',
    });

    // Verify the atomic query includes both revokedAt and expiresAt conditions
    const whereClause = mockPrisma.refreshToken.updateMany.mock.calls[0][0].where;
    expect(whereClause).toHaveProperty('revokedAt', null);
    expect(whereClause).toHaveProperty('expiresAt');
    expect(whereClause.expiresAt).toEqual({ gt: expect.any(Date) });
  });

  it('revokes old token atomically (updateMany called with correct hash)', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);
    const rawToken = signTestRefreshToken(mockUserId);

    await authService.refreshTokens(rawToken);

    const updateArgs = mockPrisma.refreshToken.updateMany.mock.calls[0][0] as {
      where: { tokenHash: string; revokedAt: null };
      data: { revokedAt: Date };
    };
    const expectedHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    expect(updateArgs.where.tokenHash).toBe(expectedHash);
    expect(updateArgs.where.revokedAt).toBeNull();
    expect(updateArgs.data.revokedAt).toBeInstanceOf(Date);
  });

  it('prevents token reuse — second refresh with same token fails', async () => {
    mockPrisma.refreshToken.updateMany
      .mockResolvedValueOnce({ count: 1 }) // first refresh succeeds
      .mockResolvedValueOnce({ count: 0 }); // second fails (already revoked)
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);
    const rawToken = signTestRefreshToken(mockUserId);

    await expect(authService.refreshTokens(rawToken)).resolves.toBeDefined();
    await expect(authService.refreshTokens(rawToken)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Refresh token revoked or expired',
    });
  });

  it('rejects token at exact JWT expiry boundary (exp === now)', async () => {
    // jsonwebtoken treats tokens as expired when now_seconds >= exp
    jest.useFakeTimers();
    try {
      const now = Date.now();
      jest.setSystemTime(now);

      // Sign a token that expires exactly "now" (exp = floor(now/1000))
      const expiredAtBoundary = jwt.sign(
        { sub: mockUserId, jti: crypto.randomUUID() },
        REFRESH_SECRET,
        { expiresIn: 0 },
      );

      await expect(authService.refreshTokens(expiredAtBoundary)).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Invalid refresh token',
      });
    } finally {
      jest.useRealTimers();
    }
  });

  it('new tokens are properly signed JWTs with correct claims', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);
    const rawToken = signTestRefreshToken(mockUserId);

    const result = await authService.refreshTokens(rawToken);

    const accessPayload = jwt.verify(result.accessToken, ACCESS_SECRET) as {
      sub: string;
      exp: number;
      iat: number;
    };
    expect(accessPayload.sub).toBe(mockUserId);
    expect(typeof accessPayload.exp).toBe('number');

    const refreshPayload = jwt.verify(result.refreshToken, REFRESH_SECRET) as {
      sub: string;
      jti: string;
      exp: number;
    };
    expect(refreshPayload.sub).toBe(mockUserId);
    expect(typeof refreshPayload.jti).toBe('string');
    expect(refreshPayload.jti.length).toBeGreaterThan(0);
  });

  it('stores the new refresh token in the DB with correct expiry after refresh', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);
    const rawToken = signTestRefreshToken(mockUserId);

    const before = Date.now();
    await authService.refreshTokens(rawToken);
    const after = Date.now();

    expect(mockPrisma.refreshToken.create).toHaveBeenCalledTimes(1);
    const createArg = mockPrisma.refreshToken.create.mock.calls[0][0] as {
      data: { tokenHash: string; userId: string; expiresAt: Date };
    };
    expect(createArg.data.userId).toBe(mockUserId);
    expect(createArg.data.tokenHash).toHaveLength(64);
    // Verify expiresAt is ~7 calendar days in the future using the same
    // Date#setDate logic as the implementation to avoid DST-related flakiness.
    const expiresMs = createArg.data.expiresAt.getTime();
    const expectedMin = new Date(before);
    expectedMin.setDate(expectedMin.getDate() + 7);
    const expectedMax = new Date(after);
    expectedMax.setDate(expectedMax.getDate() + 7);
    expect(expiresMs).toBeGreaterThanOrEqual(expectedMin.getTime());
    expect(expiresMs).toBeLessThanOrEqual(expectedMax.getTime());
  });
});

// ─── 4.5 verifyAccessToken ────────────────────────────────────────────────────

describe('authService.verifyAccessToken', () => {
  it('returns payload for a valid access token', () => {
    const token = signTestAccessToken(mockUserId);

    const payload = authService.verifyAccessToken(token);

    expect(payload.sub).toBe(mockUserId);
  });

  it('rejects token with invalid/tampered signature', () => {
    const token = signTestAccessToken(mockUserId);
    const tampered = token.slice(0, -4) + 'XXXX';

    expect(() => authService.verifyAccessToken(tampered)).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED' }),
    );
  });

  it('rejects token signed with wrong secret', () => {
    const wrongToken = jwt.sign({ sub: mockUserId }, 'wrong-secret', { expiresIn: '15m' });

    expect(() => authService.verifyAccessToken(wrongToken)).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED' }),
    );
  });

  it('rejects expired access token', () => {
    const expiredToken = signTestAccessToken(mockUserId, { expiresIn: -1 });

    expect(() => authService.verifyAccessToken(expiredToken)).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED', message: 'Invalid or expired access token' }),
    );
  });

  it('does not call any database methods', () => {
    const token = signTestAccessToken(mockUserId);

    authService.verifyAccessToken(token);

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.refreshToken.create).not.toHaveBeenCalled();
    expect(mockPrisma.refreshToken.updateMany).not.toHaveBeenCalled();
  });

  it('rejects a malformed token string', () => {
    expect(() => authService.verifyAccessToken('not.a.jwt')).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED' }),
    );

    expect(() => authService.verifyAccessToken('invalid')).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED' }),
    );

    expect(() => authService.verifyAccessToken('')).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED' }),
    );
  });
});

// ─── Module-initialization tests ─────────────────────────────────────────────
// Module-level IIFE tests (JWT secret validation, expiry validation, fallback
// defaults) live in a dedicated file: tests/auth.service.init.test.ts
// They require a fresh module registry per test, which is impossible when the
// module is already imported at the top of this file.
