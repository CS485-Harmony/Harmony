import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createLogger } from '../lib/logger';
import { authService } from '../services/auth.service';

export const authRouter = Router();
const logger = createLogger({ component: 'auth-router' });

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

const resetRequiredPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  passwordSalt: passwordSaltSchema,
  passwordVerifier: passwordVerifierSchema,
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
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
    res.status(201).json(tokens);
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
    res.status(200).json(tokens);
  } catch (err) {
    handleError(res, err);
  }
});

/**
 * POST /api/auth/password-reset-required/challenge
 * Returns a fresh salt for replacing an invalid stored verifier record.
 */
authRouter.post('/password-reset-required/challenge', (_req: Request, res: Response) => {
  res.status(200).json({ passwordSalt: authService.generatePasswordSalt() });
});

/**
 * POST /api/auth/password-reset-required
 * Replaces the password verifier only for accounts already flagged by an invalid hash.
 */
authRouter.post('/password-reset-required', async (req: Request, res: Response) => {
  const parsed = resetRequiredPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    return;
  }

  try {
    const { email, passwordSalt, passwordVerifier } = parsed.data;
    await authService.resetRequiredPassword(email, passwordSalt, passwordVerifier);
    res.status(204).send();
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

  try {
    await authService.logout(parsed.data.refreshToken);
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

  try {
    const tokens = await authService.refreshTokens(parsed.data.refreshToken);
    res.status(200).json(tokens);
  } catch (err) {
    handleError(res, err);
  }
});
