import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createLogger } from '../lib/logger';
import { authService } from '../services/auth.service';

export const authRouter = Router();
const logger = createLogger({ component: 'auth-router' });
const REFRESH_COOKIE_NAME = 'harmony_refresh_token';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_PATHS = ['/api/auth/refresh', '/api/auth/logout'] as const;
type RefreshCookieSameSite = 'strict' | 'lax' | 'none';

// ─── Input schemas ────────────────────────────────────────────────────────────

const passwordSaltSchema = z
  .string()
  .length(32, { message: 'Password salt must be 32 hexadecimal characters' })
  .regex(/^[0-9a-f]+$/i, { message: 'Password salt must be hexadecimal' });

const passwordVerifierSchema = z
  .string()
  .length(44, { message: 'Password verifier must be a 44-character base64 string' });

const challengeSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(32, { message: 'Username must be at most 32 characters' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: 'Username may only contain letters, numbers, underscores, and hyphens',
    }),
  passwordSalt: passwordSaltSchema,
  passwordVerifier: passwordVerifierSchema,
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  passwordVerifier: passwordVerifierSchema,
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

// ─── Error helper ─────────────────────────────────────────────────────────────

function trpcCodeToHttp(code: TRPCError['code']): number {
  switch (code) {
    case 'UNAUTHORIZED':
      return 401;
    case 'FORBIDDEN':
      return 403;
    case 'NOT_FOUND':
      return 404;
    case 'CONFLICT':
      return 409;
    case 'BAD_REQUEST':
      return 400;
    default:
      return 500;
  }
}

function handleError(res: Response, err: unknown): void {
  if (err instanceof TRPCError) {
    res.status(trpcCodeToHttp(err.code)).json({ error: err.message });
    return;
  }
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: 'Validation failed', details: err.errors });
    return;
  }
  logger.error({ err }, 'Auth route failed');
  res.status(500).json({ error: 'Internal server error' });
}

function parseCookieHeader(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((cookies, part) => {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) return cookies;
    const name = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (name) {
      try {
        cookies[name] = decodeURIComponent(value);
      } catch {
        cookies[name] = value;
      }
    }
    return cookies;
  }, {});
}

function getRefreshTokenFromRequest(req: Request, bodyToken?: string): string | undefined {
  return bodyToken ?? parseCookieHeader(req.headers.cookie)[REFRESH_COOKIE_NAME];
}

function getRefreshCookieSameSite(): RefreshCookieSameSite {
  const configured = process.env.AUTH_REFRESH_COOKIE_SAMESITE?.toLowerCase();
  if (configured === 'strict' || configured === 'lax' || configured === 'none') {
    return configured;
  }

  // Production currently runs frontend and backend on separate Vercel/Railway
  // sites. SameSite=None is required for browser credentialed API calls there;
  // CORS origin checks remain the CSRF gate for refresh/logout POSTs.
  return process.env.NODE_ENV === 'production' ? 'none' : 'strict';
}

function setRefreshTokenCookies(res: Response, refreshToken: string): void {
  const sameSite = getRefreshCookieSameSite();
  for (const path of REFRESH_COOKIE_PATHS) {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
      sameSite,
      path,
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });
  }
}

function clearRefreshTokenCookies(res: Response): void {
  const sameSite = getRefreshCookieSameSite();
  for (const path of REFRESH_COOKIE_PATHS) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
      sameSite,
      path,
    });
  }
}

function sendAuthTokens(
  res: Response,
  status: number,
  tokens: { accessToken: string; refreshToken: string },
): void {
  setRefreshTokenCookies(res, tokens.refreshToken);
  res.status(status).json({ accessToken: tokens.accessToken });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register/challenge
 * Returns a fresh salt for client-side verifier derivation during signup.
 */
authRouter.post('/register/challenge', (_req: Request, res: Response) => {
  res.status(200).json({ passwordSalt: authService.generatePasswordSalt() });
});

/**
 * POST /api/auth/register
 * Creates a new user account and returns access + refresh tokens.
 */
authRouter.post('/register', async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    return;
  }

  try {
    const { email, username, passwordSalt, passwordVerifier } = parsed.data;
    const tokens = await authService.register(email, username, passwordSalt, passwordVerifier);
    sendAuthTokens(res, 201, tokens);
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * POST /api/auth/login/challenge
 * Returns the stored password salt (or a deterministic dummy salt).
 */
authRouter.post('/login/challenge', async (req: Request, res: Response) => {
  const parsed = challengeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    return;
  }

  try {
    res.status(200).json({
      passwordSalt: await authService.getLoginPasswordSalt(parsed.data.email),
    });
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * POST /api/auth/login
 * Authenticates a user and returns access + refresh tokens.
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    return;
  }

  try {
    const { email, passwordVerifier } = parsed.data;
    const tokens = await authService.login(email, passwordVerifier);
    sendAuthTokens(res, 200, tokens);
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * POST /api/auth/logout
 * Revokes the provided refresh token.
 */
authRouter.post('/logout', async (req: Request, res: Response) => {
  const parsed = logoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    return;
  }

  const refreshToken = getRefreshTokenFromRequest(req, parsed.data.refreshToken);

  try {
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    clearRefreshTokenCookies(res);
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * POST /api/auth/refresh
 * Issues new access + refresh tokens using a valid refresh token (rotation).
 */
authRouter.post('/refresh', async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    return;
  }

  const refreshToken = getRefreshTokenFromRequest(req, parsed.data.refreshToken);
  if (!refreshToken) {
    res
      .status(400)
      .json({ error: 'Validation failed', details: [{ message: 'Refresh token is required' }] });
    return;
  }

  try {
    const tokens = await authService.refreshTokens(refreshToken);
    sendAuthTokens(res, 200, tokens);
  } catch (err) {
    clearRefreshTokenCookies(res);
    handleError(res, err);
  }
});
