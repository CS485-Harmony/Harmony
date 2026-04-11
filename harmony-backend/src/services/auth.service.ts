import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';
import { TRPCError } from '@trpc/server';
import { serverMemberService } from './serverMember.service';
import { ADMIN_EMAIL } from '../lib/admin.utils';

const BCRYPT_ROUNDS = 12;
// Dummy hash used to equalise bcrypt timing when the email is not found
const TIMING_DUMMY_HASH = '$2a$12$invalidhashfortimingequalizerXXXXXXXXXXXXXXXXXXXXXXXX';
const PASSWORD_VERIFIER_PREFIX = 'v1';
const PASSWORD_SALT_BYTES = 16;
const DEV_ADMIN_PASSWORD_SALT = 'f6f0e4f9f5f841caa4dd4ac4ef0bf9e8';

const ACCESS_SECRET = (() => {
  const value = process.env.JWT_ACCESS_SECRET;
  // istanbul ignore next -- NODE_ENV guard makes this unreachable in Jest (ts-jest transform cache)
  if (!value && process.env.NODE_ENV !== 'test') {
    throw new Error('JWT_ACCESS_SECRET environment variable is not set');
  }
  return value ?? 'dev-access-secret-change-in-prod';
})();

const REFRESH_SECRET = (() => {
  const value = process.env.JWT_REFRESH_SECRET;
  // istanbul ignore next -- NODE_ENV guard makes this unreachable in Jest (ts-jest transform cache)
  if (!value && process.env.NODE_ENV !== 'test') {
    throw new Error('JWT_REFRESH_SECRET environment variable is not set');
  }
  return value ?? 'dev-refresh-secret-change-in-prod';
})();

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';

const REFRESH_EXPIRES_IN_DAYS: number = (() => {
  const raw = process.env.JWT_REFRESH_EXPIRES_DAYS;
  if (raw === undefined) return 7;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid JWT_REFRESH_EXPIRES_DAYS value "${raw}". Expected a positive number.`);
  }
  return parsed;
})();

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string; // userId
  jti?: string; // unique token ID (present on refresh tokens)
}

function encodePasswordVerifierRecord(passwordSalt: string, bcryptHash: string): string {
  return `${PASSWORD_VERIFIER_PREFIX}$${passwordSalt}$${bcryptHash}`;
}

function decodePasswordVerifierRecord(
  record: string,
): { passwordSalt: string; bcryptHash: string } | null {
  const prefix = `${PASSWORD_VERIFIER_PREFIX}$`;
  if (!record.startsWith(prefix)) {
    return null;
  }

  const firstSeparator = record.indexOf('$', prefix.length);
  if (firstSeparator === -1) {
    return null;
  }

  const passwordSalt = record.slice(prefix.length, firstSeparator);
  const bcryptHash = record.slice(firstSeparator + 1);
  if (!passwordSalt || !bcryptHash) {
    return null;
  }

  return { passwordSalt, bcryptHash };
}

function createDummyPasswordSalt(email: string): string {
  return crypto
    .createHash('sha256')
    .update(`missing-user:${email.toLowerCase()}`)
    .digest('hex')
    .slice(0, PASSWORD_SALT_BYTES * 2);
}

function decodePasswordSalt(passwordSalt: string): Buffer {
  return Buffer.from(passwordSalt, 'hex');
}

function createDevAdminPasswordVerifier(): string {
  return crypto
    .pbkdf2Sync('admin', decodePasswordSalt(DEV_ADMIN_PASSWORD_SALT), 310000, 32, 'sha256')
    .toString('base64');
}

// ─── Token helpers ────────────────────────────────────────────────────────────

function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId } as JwtPayload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, jti: crypto.randomUUID() } as JwtPayload, REFRESH_SECRET, {
    expiresIn: `${REFRESH_EXPIRES_IN_DAYS}d` as jwt.SignOptions['expiresIn'],
  });
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function storeRefreshToken(userId: string, rawToken: string): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_IN_DAYS);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(rawToken),
      userId,
      expiresAt,
    },
  });
}

// ─── Dev admin bootstrap ──────────────────────────────────────────────────────

/**
 * Upserts the dev admin user and ensures they are an OWNER member of every
 * existing server. Called on admin login only.
 */
async function ensureAdminUser() {
  const passwordHash = await bcrypt.hash(createDevAdminPasswordVerifier(), BCRYPT_ROUNDS);
  const encodedPasswordHash = encodePasswordVerifierRecord(DEV_ADMIN_PASSWORD_SALT, passwordHash);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash: encodedPasswordHash },
    create: {
      email: ADMIN_EMAIL,
      username: 'admin',
      displayName: 'System Admin',
      passwordHash: encodedPasswordHash,
    },
  });

  // Auto-join every server as OWNER so the admin can access everything.
  const servers = await prisma.server.findMany({ select: { id: true } });
  for (const server of servers) {
    await prisma.serverMember.upsert({
      where: { userId_serverId: { userId: admin.id, serverId: server.id } },
      update: { role: 'OWNER' },
      create: { userId: admin.id, serverId: server.id, role: 'OWNER' },
    });
  }

  return admin;
}

// ─── Auth service ─────────────────────────────────────────────────────────────

export const authService = {
  generatePasswordSalt(): string {
    return crypto.randomBytes(PASSWORD_SALT_BYTES).toString('hex');
  },

  async getLoginPasswordSalt(email: string): Promise<string> {
    if (process.env.NODE_ENV !== 'production' && email === ADMIN_EMAIL) {
      return DEV_ADMIN_PASSWORD_SALT;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { passwordHash: true },
    });
    const decoded = user ? decodePasswordVerifierRecord(user.passwordHash) : null;
    return decoded?.passwordSalt ?? createDummyPasswordSalt(email);
  },

  async register(
    email: string,
    username: string,
    passwordSalt: string,
    passwordVerifier: string,
  ): Promise<AuthTokens> {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Username already taken' });
    }

    // Store a bcrypt hash of the client-derived verifier so the raw password
    // never traverses the wire or lands in request-body logs.
    const passwordHash = encodePasswordVerifierRecord(
      passwordSalt,
      await bcrypt.hash(passwordVerifier, BCRYPT_ROUNDS),
    );

    let user: Awaited<ReturnType<typeof prisma.user.create>>;
    try {
      user = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash,
          displayName: username,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email or username already in use' });
      }
      throw err;
    }

    // Auto-join the default public server so new users land in a usable state.
    const defaultServer = await prisma.server.findFirst({
      where: { slug: 'harmony-hq', isPublic: true },
      select: { id: true },
    });
    if (defaultServer) {
      try {
        await serverMemberService.joinServer(user.id, defaultServer.id);
      } catch {
        // Best-effort: don't block registration if the join fails
      }
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  },

  async login(email: string, passwordVerifier: string): Promise<AuthTokens> {
    // ── Dev-only admin override ────────────────────────────────────────────
    // Login as admin@harmony.dev / admin to get a system-admin account that
    // bypasses all permission and ownership checks. Remove before production.
    if (
      process.env.NODE_ENV !== 'production' &&
      email === ADMIN_EMAIL &&
      passwordVerifier === createDevAdminPasswordVerifier()
    ) {
      const admin = await ensureAdminUser();
      const accessToken = signAccessToken(admin.id);
      const refreshToken = signRefreshToken(admin.id);
      await storeRefreshToken(admin.id, refreshToken);
      return { accessToken, refreshToken };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Equalise timing so unknown emails are indistinguishable from wrong passwords
      await bcrypt.compare(passwordVerifier, TIMING_DUMMY_HASH);
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }

    const decoded = decodePasswordVerifierRecord(user.passwordHash);
    if (!decoded) {
      await bcrypt.compare(passwordVerifier, TIMING_DUMMY_HASH);
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'This account must reset its password before signing in.',
      });
    }

    // This protects request bodies and logs from raw-password exposure, but a
    // captured verifier is still replayable. HTTPS remains load-bearing here.
    const valid = await bcrypt.compare(passwordVerifier, decoded.bcryptHash);
    if (!valid) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    await storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  },

  async logout(rawRefreshToken: string): Promise<void> {
    const hash = hashToken(rawRefreshToken);
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  async refreshTokens(rawRefreshToken: string): Promise<AuthTokens> {
    let payload: JwtPayload;
    try {
      payload = jwt.verify(rawRefreshToken, REFRESH_SECRET) as JwtPayload;
    } catch {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid refresh token' });
    }

    const hash = hashToken(rawRefreshToken);

    // Atomic compare-and-revoke: succeeds only if the token exists, is not revoked, and is not expired.
    // Two concurrent requests with the same token will race; exactly one will get count === 1.
    const revoked = await prisma.refreshToken.updateMany({
      where: { tokenHash: hash, revokedAt: null, expiresAt: { gt: new Date() } },
      data: { revokedAt: new Date() },
    });

    if (revoked.count === 0) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Refresh token revoked or expired' });
    }

    const accessToken = signAccessToken(payload.sub);
    const newRefreshToken = signRefreshToken(payload.sub);
    await storeRefreshToken(payload.sub, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  },

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    } catch {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired access token' });
    }
  },
};
