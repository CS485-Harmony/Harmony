/**
 * Auth service unit tests — Issues #258 / #313
 */

process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_DAYS = '7';
process.env.NODE_ENV = 'test';

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

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../src/db/prisma';
import { serverMemberService } from '../src/services/serverMember.service';
import { authService } from '../src/services/auth.service';

const PASSWORD_SALT = '00112233445566778899aabbccddeeff';
const DEV_ADMIN_SALT = 'f6f0e4f9f5f841caa4dd4ac4ef0bf9e8';

function derivePasswordVerifier(password: string, passwordSalt = PASSWORD_SALT): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(passwordSalt, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
}

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

const ACCESS_SECRET = 'test-access-secret';
const REFRESH_SECRET = 'test-refresh-secret';
const ADMIN_EMAIL = 'admin@harmony.dev';

const mockUserId = '00000000-0000-0000-0000-000000000001';
const mockUser = {
  id: mockUserId,
  email: 'user@example.com',
  username: 'testuser',
  passwordHash: '',
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

function signTestRefreshToken(userId: string, overrides?: jwt.SignOptions): string {
  return jwt.sign({ sub: userId, jti: crypto.randomUUID() }, REFRESH_SECRET, {
    expiresIn: '7d',
    ...overrides,
  });
}

function signTestAccessToken(userId: string, overrides?: jwt.SignOptions): string {
  return jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: '15m', ...overrides });
}

beforeAll(async () => {
  mockUser.passwordHash = `v1$${PASSWORD_SALT}$${await bcrypt.hash(derivePasswordVerifier('SecurePass123!'), 4)}`;
});

beforeEach(() => {
  jest.resetAllMocks();
  mockPrisma.user.findUnique.mockResolvedValue(null);
  mockPrisma.user.create.mockResolvedValue(mockUser);
  mockPrisma.user.upsert.mockResolvedValue({
    ...mockUser,
    email: ADMIN_EMAIL,
    username: 'admin',
    displayName: 'System Admin',
  });
  mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshTokenRecord);
  mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });
  mockPrisma.server.findFirst.mockResolvedValue(null);
  mockPrisma.server.findMany.mockResolvedValue([]);
  mockPrisma.serverMember.upsert.mockResolvedValue({});
  mockJoinServer.mockResolvedValue(undefined);
});

describe('authService password-verifier helpers', () => {
  it('generates 16-byte hex salts for new registrations', () => {
    expect(authService.generatePasswordSalt()).toMatch(/^[0-9a-f]{32}$/i);
  });

  it('returns the stored salt for existing users', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ passwordHash: mockUser.passwordHash });

    await expect(authService.getLoginPasswordSalt(mockUser.email)).resolves.toBe(PASSWORD_SALT);
  });

  it('returns deterministic dummy salts for unknown users', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const first = await authService.getLoginPasswordSalt('missing@example.com');
    const second = await authService.getLoginPasswordSalt('missing@example.com');

    expect(first).toBe(second);
    expect(first).toMatch(/^[0-9a-f]{32}$/i);
  });
});

describe('authService.register', () => {
  it('returns tokens when registering with a verifier payload', async () => {
    const result = await authService.register(
      'user@example.com',
      'testuser',
      PASSWORD_SALT,
      derivePasswordVerifier('SecurePass123!'),
    );

    expect(typeof result.accessToken).toBe('string');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('encodes the salt and hashes the verifier before storing', async () => {
    await authService.register(
      'user@example.com',
      'testuser',
      PASSWORD_SALT,
      derivePasswordVerifier('SecurePass123!'),
    );

    const createArgs = mockPrisma.user.create.mock.calls[0][0] as {
      data: { passwordHash: string };
    };
    expect(createArgs.data.passwordHash).toMatch(new RegExp(`^v1\\$${PASSWORD_SALT}\\$\\$2`));
    expect(createArgs.data.passwordHash).not.toContain('SecurePass123!');
  });

  it('rejects duplicate email with CONFLICT', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

    await expect(
      authService.register(
        'user@example.com',
        'newuser',
        PASSWORD_SALT,
        derivePasswordVerifier('pw'),
      ),
    ).rejects.toMatchObject({ code: 'CONFLICT', message: 'Email already in use' });
  });

  it('rejects duplicate username with CONFLICT', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(mockUser);

    await expect(
      authService.register(
        'new@example.com',
        'testuser',
        PASSWORD_SALT,
        derivePasswordVerifier('pw'),
      ),
    ).rejects.toMatchObject({ code: 'CONFLICT', message: 'Username already taken' });
  });

  it('maps Prisma P2002 race conditions to CONFLICT', async () => {
    const p2002 = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '5.0.0',
    });
    mockPrisma.user.create.mockRejectedValue(p2002);

    await expect(
      authService.register(
        'user@example.com',
        'testuser',
        PASSWORD_SALT,
        derivePasswordVerifier('pw'),
      ),
    ).rejects.toMatchObject({ code: 'CONFLICT', message: 'Email or username already in use' });
  });

  it('re-throws non-P2002 Prisma errors', async () => {
    const unknownError = new Error('DB connection lost');
    mockPrisma.user.create.mockRejectedValue(unknownError);

    await expect(
      authService.register(
        'user@example.com',
        'testuser',
        PASSWORD_SALT,
        derivePasswordVerifier('SecurePass123!'),
      ),
    ).rejects.toThrow('DB connection lost');
  });

  it('calls joinServer when the default server exists', async () => {
    mockPrisma.server.findFirst.mockResolvedValue({ id: 'server-001' });

    await authService.register(
      'user@example.com',
      'testuser',
      PASSWORD_SALT,
      derivePasswordVerifier('SecurePass123!'),
    );

    expect(mockJoinServer).toHaveBeenCalledWith(mockUserId, 'server-001');
  });

  it('returns tokens when no default server exists and skips joinServer', async () => {
    mockPrisma.server.findFirst.mockResolvedValue(null);

    const result = await authService.register(
      'user@example.com',
      'testuser',
      PASSWORD_SALT,
      derivePasswordVerifier('SecurePass123!'),
    );

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(mockJoinServer).not.toHaveBeenCalled();
  });

  it('continues registration when joinServer fails', async () => {
    mockPrisma.server.findFirst.mockResolvedValue({ id: 'server-001' });
    mockJoinServer.mockRejectedValue(new Error('Server join failed'));

    const result = await authService.register(
      'user@example.com',
      'testuser',
      PASSWORD_SALT,
      derivePasswordVerifier('SecurePass123!'),
    );

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it('defaults displayName to username', async () => {
    await authService.register(
      'user@example.com',
      'testuser',
      PASSWORD_SALT,
      derivePasswordVerifier('SecurePass123!'),
    );

    const createArgs = mockPrisma.user.create.mock.calls[0][0] as {
      data: { displayName: string; username: string };
    };
    expect(createArgs.data.displayName).toBe(createArgs.data.username);
  });
});

describe('authService.login', () => {
  it('returns tokens on valid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const result = await authService.login(
      mockUser.email,
      derivePasswordVerifier('SecurePass123!'),
    );

    expect(typeof result.accessToken).toBe('string');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('rejects wrong verifiers with UNAUTHORIZED', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    await expect(
      authService.login(mockUser.email, derivePasswordVerifier('wrongpassword')),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
  });

  it('rejects non-existent email with UNAUTHORIZED', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login('nobody@example.com', derivePasswordVerifier('anypassword')),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
  });

  it('rejects legacy hashes that have no verifier metadata', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      ...mockUser,
      passwordHash: '$2b$12$legacyHashValue',
    });

    await expect(
      authService.login(mockUser.email, derivePasswordVerifier('SecurePass123!')),
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'This account must reset its password before signing in.',
    });
  });

  it('equalizes timing for legacy bcrypt-only hashes', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      ...mockUser,
      passwordHash: '$2b$12$legacyHashValue',
    });
    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await expect(
      authService.login(mockUser.email, derivePasswordVerifier('SecurePass123!')),
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'This account must reset its password before signing in.',
    });

    expect(compareSpy).toHaveBeenCalledWith(
      derivePasswordVerifier('SecurePass123!'),
      expect.stringMatching(/^\$2[aby]\$/),
    );
    compareSpy.mockRestore();
  });

  it('admin override works when NODE_ENV=development and ENABLE_DEV_ADMIN=true', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_DEV_ADMIN = 'true';

    try {
      const adminUser = {
        ...mockUser,
        id: 'admin-id-001',
        email: ADMIN_EMAIL,
        username: 'admin',
        displayName: 'System Admin',
      };
      mockPrisma.user.upsert.mockResolvedValue(adminUser);

      const adminVerifier = derivePasswordVerifier('admin', DEV_ADMIN_SALT);
      const result = await authService.login(ADMIN_EMAIL, adminVerifier);

      expect(typeof result.accessToken).toBe('string');
      expect(mockPrisma.user.upsert).toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      delete process.env.ENABLE_DEV_ADMIN;
    }
  });

  it('admin override upserts the expected system-admin fields', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_DEV_ADMIN = 'true';

    try {
      await authService.login(ADMIN_EMAIL, derivePasswordVerifier('admin', DEV_ADMIN_SALT));

      expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            email: ADMIN_EMAIL,
            username: 'admin',
            displayName: 'System Admin',
          }),
        }),
      );
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      delete process.env.ENABLE_DEV_ADMIN;
    }
  });

  it('admin override makes the admin OWNER of every server', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_DEV_ADMIN = 'true';

    try {
      mockPrisma.server.findMany.mockResolvedValue([{ id: 'server-001' }, { id: 'server-002' }]);

      await authService.login(ADMIN_EMAIL, derivePasswordVerifier('admin', DEV_ADMIN_SALT));

      expect(mockPrisma.serverMember.upsert).toHaveBeenCalledTimes(2);
      for (const [call] of mockPrisma.serverMember.upsert.mock.calls) {
        expect(call).toEqual(
          expect.objectContaining({
            update: { role: 'OWNER' },
            create: expect.objectContaining({ role: 'OWNER' }),
          }),
        );
      }
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      delete process.env.ENABLE_DEV_ADMIN;
    }
  });

  it('propagates admin upsert failures', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_DEV_ADMIN = 'true';

    try {
      mockPrisma.user.upsert.mockRejectedValue(new Error('DB error during upsert'));

      await expect(
        authService.login(ADMIN_EMAIL, derivePasswordVerifier('admin', DEV_ADMIN_SALT)),
      ).rejects.toThrow('DB error during upsert');
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      delete process.env.ENABLE_DEV_ADMIN;
    }
  });

  it('propagates admin membership upsert failures', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_DEV_ADMIN = 'true';

    try {
      mockPrisma.server.findMany.mockResolvedValue([{ id: 'server-001' }, { id: 'server-002' }]);
      mockPrisma.serverMember.upsert.mockRejectedValueOnce(new Error('membership upsert failed'));

      await expect(
        authService.login(ADMIN_EMAIL, derivePasswordVerifier('admin', DEV_ADMIN_SALT)),
      ).rejects.toThrow('membership upsert failed');
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      delete process.env.ENABLE_DEV_ADMIN;
    }
  });

  it('disables admin override in production', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.env.ENABLE_DEV_ADMIN = 'true';
    mockPrisma.user.findUnique.mockResolvedValue(null);

    try {
      await expect(
        authService.login(ADMIN_EMAIL, derivePasswordVerifier('admin', DEV_ADMIN_SALT)),
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      delete process.env.ENABLE_DEV_ADMIN;
    }
  });

  it('disables admin override when ENABLE_DEV_ADMIN is not set', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    delete process.env.ENABLE_DEV_ADMIN;
    mockPrisma.user.findUnique.mockResolvedValue(null);

    try {
      await expect(
        authService.login(ADMIN_EMAIL, derivePasswordVerifier('admin', DEV_ADMIN_SALT)),
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
    }
  });
});

describe('authService.logout', () => {
  it('revokes the matching refresh token hash', async () => {
    const rawToken = signTestRefreshToken(mockUserId);

    await authService.logout(rawToken);

    const args = mockPrisma.refreshToken.updateMany.mock.calls[0][0] as {
      where: { tokenHash: string; revokedAt: null };
      data: { revokedAt: Date };
    };
    expect(args.where.tokenHash).toBe(crypto.createHash('sha256').update(rawToken).digest('hex'));
    expect(args.data.revokedAt).toBeInstanceOf(Date);
  });

  it('is idempotent when called twice with the same token', async () => {
    mockPrisma.refreshToken.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });
    const rawToken = signTestRefreshToken(mockUserId);

    await expect(authService.logout(rawToken)).resolves.toBeUndefined();
    await expect(authService.logout(rawToken)).resolves.toBeUndefined();
    expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledTimes(2);
  });

  it('does not throw for unknown tokens', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });

    await expect(authService.logout('not-a-real-token')).resolves.toBeUndefined();
  });

  it('only revokes the matching token hash', async () => {
    const rawToken = signTestRefreshToken(mockUserId);

    await authService.logout(rawToken);

    const args = mockPrisma.refreshToken.updateMany.mock.calls[0][0] as {
      where: { tokenHash: string };
    };
    expect(args.where.tokenHash).toBe(
      crypto.createHash('sha256').update(rawToken).digest('hex'),
    );
  });
});

describe('authService.refreshTokens', () => {
  it('returns new tokens for a valid token', async () => {
    const rawToken = signTestRefreshToken(mockUserId);

    const result = await authService.refreshTokens(rawToken);

    expect(typeof result.accessToken).toBe('string');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('rejects invalid refresh tokens', async () => {
    await expect(authService.refreshTokens('not-a-token')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid refresh token',
    });
  });

  it('rejects tampered refresh tokens', async () => {
    const rawToken = signTestRefreshToken(mockUserId);
    const tampered = rawToken.slice(0, -5) + 'XXXXX';

    await expect(authService.refreshTokens(tampered)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid refresh token',
    });
  });

  it('rejects refresh tokens signed with the wrong secret', async () => {
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

  it('rejects expired refresh tokens', async () => {
    const expiredToken = signTestRefreshToken(mockUserId, { expiresIn: -1 });

    await expect(authService.refreshTokens(expiredToken)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Invalid refresh token',
    });
  });

  it('rejects revoked or expired tokens when updateMany returns count 0', async () => {
    mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 0 });

    await expect(authService.refreshTokens(signTestRefreshToken(mockUserId))).rejects.toMatchObject(
      {
        code: 'UNAUTHORIZED',
        message: 'Refresh token revoked or expired',
      },
    );
  });

  it('prevents refresh token reuse', async () => {
    mockPrisma.refreshToken.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });
    const rawToken = signTestRefreshToken(mockUserId);

    await expect(authService.refreshTokens(rawToken)).resolves.toBeDefined();
    await expect(authService.refreshTokens(rawToken)).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      message: 'Refresh token revoked or expired',
    });
  });

  it('rejects tokens at the exact expiry boundary', async () => {
    jest.useFakeTimers();
    try {
      const now = Date.now();
      jest.setSystemTime(now);
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

  it('issues refresh/access tokens with the expected claims', async () => {
    const rawToken = signTestRefreshToken(mockUserId);

    const result = await authService.refreshTokens(rawToken);

    const accessPayload = jwt.verify(result.accessToken, ACCESS_SECRET) as {
      sub: string;
      exp: number;
    };
    const refreshPayload = jwt.verify(result.refreshToken, REFRESH_SECRET) as {
      sub: string;
      jti: string;
      exp: number;
    };
    expect(accessPayload.sub).toBe(mockUserId);
    expect(typeof accessPayload.exp).toBe('number');
    expect(refreshPayload.sub).toBe(mockUserId);
    expect(typeof refreshPayload.jti).toBe('string');
  });

  it('stores the rotated refresh token with the expected expiry window', async () => {
    const rawToken = signTestRefreshToken(mockUserId);
    const before = Date.now();

    await authService.refreshTokens(rawToken);
    const after = Date.now();

    const createArg = mockPrisma.refreshToken.create.mock.calls[0][0] as {
      data: { tokenHash: string; userId: string; expiresAt: Date };
    };
    expect(createArg.data.userId).toBe(mockUserId);
    expect(createArg.data.tokenHash).toHaveLength(64);
    const expectedMin = new Date(before);
    expectedMin.setDate(expectedMin.getDate() + 7);
    const expectedMax = new Date(after);
    expectedMax.setDate(expectedMax.getDate() + 7);
    expect(createArg.data.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime());
    expect(createArg.data.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax.getTime());
  });
});

describe('authService.verifyAccessToken', () => {
  it('returns payload for a valid access token', () => {
    const payload = authService.verifyAccessToken(signTestAccessToken(mockUserId));
    expect(payload.sub).toBe(mockUserId);
  });

  it('rejects malformed access tokens', () => {
    expect(() => authService.verifyAccessToken('invalid')).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED' }),
    );
  });

  it('rejects tampered access tokens', () => {
    const token = signTestAccessToken(mockUserId);
    const tampered = token.slice(0, -4) + 'XXXX';

    expect(() => authService.verifyAccessToken(tampered)).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED' }),
    );
  });

  it('rejects access tokens signed with the wrong secret', () => {
    const wrongToken = jwt.sign({ sub: mockUserId }, 'wrong-secret', { expiresIn: '15m' });

    expect(() => authService.verifyAccessToken(wrongToken)).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED' }),
    );
  });

  it('rejects expired access tokens', () => {
    const expiredToken = signTestAccessToken(mockUserId, { expiresIn: -1 });

    expect(() => authService.verifyAccessToken(expiredToken)).toThrow(
      expect.objectContaining({ code: 'UNAUTHORIZED', message: 'Invalid or expired access token' }),
    );
  });

  it('does not call the database when verifying access tokens', () => {
    authService.verifyAccessToken(signTestAccessToken(mockUserId));

    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockPrisma.refreshToken.create).not.toHaveBeenCalled();
    expect(mockPrisma.refreshToken.updateMany).not.toHaveBeenCalled();
  });
});
