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

const ACCESS_SECRET = (() => {
  const value = process.env.JWT_ACCESS_SECRET;
  if (!value && process.env.NODE_ENV !== 'test') {
    throw new Error('JWT_ACCESS_SECRET environment variable is not set');
  }
  return value ?? 'dev-access-secret-change-in-prod';
})();

const REFRESH_SECRET = (() => {
  const value = process.env.JWT_REFRESH_SECRET;
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
    throw new Error(
      `Invalid JWT_REFRESH_EXPIRES_DAYS value "${raw}". Expected a positive number.`,
    );
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
  const passwordHash = await bcrypt.hash('admin', BCRYPT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: {
      email: ADMIN_EMAIL,
      username: 'admin',
      displayName: 'System Admin',
      passwordHash,
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
  async register(email: string, username: string, password: string): Promise<AuthTokens> {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

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

  async login(email: string, password: string): Promise<AuthTokens> {
    // ── Dev-only admin override ────────────────────────────────────────────
    // Login as admin@harmony.dev / admin to get a system-admin account that
    // bypasses all permission and ownership checks. Remove before production.
    if (email === ADMIN_EMAIL && password === 'admin') {
      const admin = await ensureAdminUser();
      const accessToken = signAccessToken(admin.id);
      const refreshToken = signRefreshToken(admin.id);
      await storeRefreshToken(admin.id, refreshToken);
      return { accessToken, refreshToken };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Equalise timing so unknown emails are indistinguishable from wrong passwords
      await bcrypt.compare(password, TIMING_DUMMY_HASH);
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
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
