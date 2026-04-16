import { type RequestHandler } from 'express';
import rateLimit, { type Store } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../db/redis';

/**
 * Known crawler User-Agent substrings (lowercase). Matched via case-insensitive
 * substring check. Reverse-DNS verification is not yet implemented — see §9.3
 * of the unified backend architecture for the full verification spec.
 */
const VERIFIED_BOT_TOKENS: { token: string; name: string }[] = [
  { token: 'googlebot', name: 'googlebot' },
  { token: 'bingbot', name: 'bingbot' },
  { token: 'slackbot', name: 'slackbot' },
];

/**
 * Determines whether an incoming request is from a verified search engine bot
 * by performing a case-insensitive check against the known bot list.
 * Returns the normalized bot name if matched, or null otherwise.
 */
export function detectVerifiedBot(userAgent: string | undefined): string | null {
  if (!userAgent) return null;
  const lower = userAgent.toLowerCase();
  const match = VERIFIED_BOT_TOKENS.find((b) => lower.includes(b.token));
  return match?.name ?? null;
}

/** Backwards-compatible helper used in tests. */
export function isVerifiedBot(userAgent: string | undefined): boolean {
  return detectVerifiedBot(userAgent) !== null;
}

const PUBLIC_RATE_LIMIT = 100; // requests per window
const PUBLIC_WINDOW_MS = 60_000; // 1 minute

/**
 * Creates the Redis-backed store for the public API rate limiter in production.
 * Returns undefined in dev/test so express-rate-limit falls back to MemoryStore,
 * keeping tests hermetic with no Redis dependency.
 *
 * Uses ioredis `.call()` which executes the rate-limit-redis Lua script as a
 * single atomic Redis command — satisfying the "no non-atomic INCR + EXPIRE"
 * constraint from the replica-readiness audit (§3.2).
 */
function buildProductionStore(): Store | undefined {
  if (process.env.NODE_ENV !== 'production') return undefined;
  return new RedisStore({
    prefix: 'rl:public:',
    sendCommand: (...args: string[]) =>
      redis.call(args[0] as string, ...(args.slice(1) as [string, ...string[]])) as Promise<number>,
  });
}

/**
 * Token-bucket rate limiting middleware for the public API.
 *
 * Replaced the prior in-process Map<string, TokenBucket> (Issue #318) with a
 * Redis-backed express-rate-limit instance so limits are shared across replicas.
 * Algorithm changes from continuous token-bucket to fixed-window (60 s), which
 * is acceptable for a public read API and removes the need for a Lua token-bucket
 * script. Per the replica-readiness audit §3.2 recommendation.
 *
 * All requests are limited at 100 req/min per IP. Bot detection identifies
 * crawlers but does NOT grant elevated limits until reverse-DNS verification
 * is implemented per §9.3.
 *
 * @param store - Optional store override for tests. In production the Redis
 *   store is created automatically via buildProductionStore().
 */
export function createPublicRateLimiter(store?: Store): RequestHandler {
  return rateLimit({
    windowMs: PUBLIC_WINDOW_MS,
    max: PUBLIC_RATE_LIMIT,
    standardHeaders: true,
    legacyHeaders: false,
    store: store ?? buildProductionStore(),
    message: { error: 'Too many requests. Please try again later.' },
  });
}
