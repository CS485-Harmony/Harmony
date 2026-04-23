import express, { NextFunction, Request, Response } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import helmet from 'helmet';
import rateLimit, { type Store } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import corsMiddleware, { CorsError } from './middleware/cors';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/init';
import { authRouter } from './routes/auth.router';
import { createPublicRouter } from './routes/public.router';
import { seoRouter } from './routes/seo.router';
import { eventsRouter } from './routes/events.router';
import { attachmentRouter } from './routes/attachment.router';
import { adminMetaTagRouter } from './routes/admin.metaTag.router';
import { instanceId } from './lib/instance-identity';
import { createLogger } from './lib/logger';
import { redis } from './db/redis';

const logger = createLogger({ component: 'app', instanceId });

/**
 * Creates one Redis store per rate-limit route in production.
 * Each store gets a unique prefix so login/register/refresh counters don't
 * collide in Redis, while all replicas share the same keyspace.
 *
 * Returns undefined in dev/test so express-rate-limit falls back to
 * MemoryStore — keeps tests hermetic with no Redis dependency.
 *
 * Uses ioredis `.call()` which runs the rate-limit-redis Lua script as a
 * single atomic command, satisfying the "no non-atomic INCR + EXPIRE"
 * constraint from the replica-readiness audit (§3.1).
 *
 * express-rate-limit v8 requires each limiter to have its own store instance
 * (it validates against shared instances to prevent route counter mixing),
 * so callers must invoke this once per limiter.
 */
function buildProductionStore(prefix: string): Store | undefined {
  if (process.env.NODE_ENV !== 'production') return undefined;
  return new RedisStore({
    prefix,
    sendCommand: (...args: string[]) =>
      redis.call(args[0] as string, ...(args.slice(1) as [string, ...string[]])) as Promise<number>,
  });
}

export interface CreateAppOptions {
  /**
   * Store factory called once per limiter so each gets a distinct instance.
   * express-rate-limit v8 requires separate instances per limiter to avoid
   * counter mixing and to suppress the "unsharedStore" validation error.
   * In tests: return a new mock per call but share an incrementCalls array
   * to observe all calls across limiters. In production this is left undefined
   * and buildProductionStore(prefix) is used instead.
   */
  rateLimitStore?: () => Store;
}

export function createApp(options: CreateAppOptions = {}) {
  const isE2E = process.env.NODE_ENV === 'e2e';
  // Each limiter calls makeStore() independently so it gets its own instance.
  const makeStore = (prefix: string): Store | undefined =>
    options.rateLimitStore ? options.rateLimitStore() : buildProductionStore(prefix);

  // ─── Auth rate limiters ─────────────────────────────────────────────────────
  // Each limiter gets its own store instance (express-rate-limit v8 requirement).
  // In production: separate RedisStore per route with a unique prefix so
  // login/register/refresh counters are independent in Redis.

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isE2E ? 1000 : 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: makeStore('rl:login:'),
    message: { error: 'Too many login attempts. Please try again later.' },
  });

  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: process.env.NODE_ENV === 'production' ? 5 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    store: makeStore('rl:register:'),
    message: { error: 'Too many registration attempts. Please try again later.' },
  });

  const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isE2E ? 1000 : 30,
    standardHeaders: true,
    legacyHeaders: false,
    store: makeStore('rl:refresh:'),
    message: { error: 'Too many token refresh attempts. Please try again later.' },
  });
  const app = express();

  // Trust N proxy hops so req.ip and express-rate-limit can read
  // X-Forwarded-For safely. Gated on TRUST_PROXY_HOPS so running the backend
  // without a proxy in front (local dev, direct port exposure) doesn't let
  // clients spoof XFF and poison rate-limit buckets. Set to `1` on Railway.
  const trustProxyHopsEnv = process.env.TRUST_PROXY_HOPS;
  if (trustProxyHopsEnv !== undefined && trustProxyHopsEnv.trim() === '') {
    throw new Error(
      `Invalid TRUST_PROXY_HOPS value "${trustProxyHopsEnv}". Expected a non-negative integer.`,
    );
  }
  const trustProxyHops = trustProxyHopsEnv === undefined ? 0 : Number(trustProxyHopsEnv);
  if (!Number.isInteger(trustProxyHops) || trustProxyHops < 0) {
    throw new Error(
      `Invalid TRUST_PROXY_HOPS value "${trustProxyHopsEnv}". Expected a non-negative integer.`,
    );
  }
  if (trustProxyHops > 0) {
    app.set('trust proxy', trustProxyHops);
  }

  app.use(helmet());

  // Replica identity header — stamped on every response (including CORS errors)
  // so load-balancer distribution across 2+ backend-api replicas is externally
  // observable (curl -I /health across repeated requests should cycle through ids).
  app.use((_req, res, next) => {
    res.setHeader('X-Instance-Id', instanceId);
    next();
  });

  // CORS must come before body parsers so error responses include CORS headers
  app.use(corsMiddleware);
  app.use(express.json());

  // Health check (plain HTTP — no tRPC client required)
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'backend-api',
      instanceId,
      timestamp: new Date().toISOString(),
    });
  });

  // SEO endpoints (robots.txt, sitemaps) — before auth so they're publicly accessible
  // Backend SEO routes remain available as transitional XML sources; the
  // frontend apex domain owns the canonical crawler-facing entrypoints.
  app.use(seoRouter);

  // Auth endpoints
  app.use('/api/auth/login', loginLimiter);
  app.use('/api/auth/register', registerLimiter);
  app.use('/api/auth/refresh', refreshLimiter);
  app.use('/api/auth', authRouter);

  // Public API endpoints (cached, no auth required)
  app.use('/api/public', createPublicRouter(makeStore('rl:public:')));

  // Real-time SSE endpoints
  app.use('/api/events', eventsRouter);

  // Attachment upload + file serving
  app.use('/api/attachments', attachmentRouter);

  // Admin meta-tag management endpoints (server admin only)
  app.use('/api/admin', adminMetaTagRouter);

  // tRPC endpoint
  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError({ error, path }) {
        // Only log unexpected server errors; auth/validation errors (4xx) are routine
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          logger.error({ err: error, path }, 'Unhandled tRPC error');
        }
      },
    }),
  );

  // 404 — unknown routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Global error handler — must have 4 params for Express to treat it as an error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const isCorsError = err instanceof CorsError;
    const status = isCorsError ? 403 : 500;
    const message = isCorsError ? err.message : 'Internal server error';
    if (!isCorsError) {
      logger.error({ err, status }, 'Unhandled Express error');
    }
    res.status(status).json({ error: message });
  });

  return app;
}
