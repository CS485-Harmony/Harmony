import { Request, Response, NextFunction } from 'express';

/**
 * Verified crawler User-Agent substrings per §9.3 of the unified backend architecture.
 * Used to grant elevated rate limits (1000 req/min) to known search engine bots.
 */
const VERIFIED_BOT_AGENTS = ['Googlebot', 'Bingbot'];

/**
 * Determines whether an incoming request is from a verified search engine bot
 * by checking the User-Agent header against the known bot list.
 */
export function isVerifiedBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  return VERIFIED_BOT_AGENTS.some((bot) => userAgent.includes(bot));
}

/**
 * Token bucket entry stored per IP (or bot identity).
 */
interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

/**
 * In-process token bucket store.
 * Maps IP (or bot UA key) -> bucket state.
 */
const buckets = new Map<string, TokenBucket>();

const HUMAN_CAPACITY = 100;   // tokens per window
const BOT_CAPACITY = 1000;    // tokens per window
const WINDOW_MS = 60_000;     // 1 minute

/**
 * Refills the token bucket for a given key based on elapsed time.
 * Returns the bucket after refilling.
 */
function getOrRefillBucket(key: string, capacity: number): TokenBucket {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing) {
    const bucket: TokenBucket = { tokens: capacity, lastRefill: now };
    buckets.set(key, bucket);
    return bucket;
  }

  const elapsed = now - existing.lastRefill;

  if (elapsed >= WINDOW_MS) {
    // Window has elapsed — full refill
    const bucket: TokenBucket = { tokens: capacity, lastRefill: now };
    buckets.set(key, bucket);
    return bucket;
  }

  // Still within the same window
  return existing;
}

/**
 * Consume one token from an existing bucket (caller must check tokens > 0 first).
 */
function consumeToken(key: string, bucket: TokenBucket): void {
  bucket.tokens -= 1;
  buckets.set(key, bucket);
}

/**
 * Compute seconds until the current window resets for a bucket.
 */
function retryAfterSeconds(bucket: TokenBucket): number {
  const elapsed = Date.now() - bucket.lastRefill;
  return Math.ceil((WINDOW_MS - elapsed) / 1000);
}

/**
 * Token-bucket rate limiting middleware for the public API.
 *
 * Limits:
 *   - Verified bots (Googlebot, Bingbot): 1000 req/min per bot identity (User-Agent)
 *   - Human users / other clients:         100 req/min per IP
 *
 * Responses:
 *   - 429 Too Many Requests + Retry-After header when limit is exceeded
 *   - RateLimit-Limit / RateLimit-Remaining / RateLimit-Reset on every response
 */
export function tokenBucketRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const userAgent = req.headers['user-agent'];
  const bot = isVerifiedBot(userAgent);

  // Bot identity key uses User-Agent string; human key uses IP
  const key = bot ? `bot:${userAgent}` : `ip:${req.ip ?? 'unknown'}`;
  const capacity = bot ? BOT_CAPACITY : HUMAN_CAPACITY;

  const bucket = getOrRefillBucket(key, capacity);

  // Set standard rate-limit response headers
  const resetAt = Math.ceil((bucket.lastRefill + WINDOW_MS) / 1000);
  res.set('RateLimit-Limit', String(capacity));
  res.set('RateLimit-Remaining', String(Math.max(0, bucket.tokens)));
  res.set('RateLimit-Reset', String(resetAt));

  if (bucket.tokens <= 0) {
    const retryAfter = retryAfterSeconds(bucket);
    res.set('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  consumeToken(key, bucket);
  // Update Remaining header after consumption
  res.set('RateLimit-Remaining', String(bucket.tokens));

  next();
}

/**
 * Clears the in-process bucket store.
 * Intended for use in tests only.
 */
export function _clearBucketsForTesting(): void {
  buckets.clear();
}
