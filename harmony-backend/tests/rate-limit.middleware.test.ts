/**
 * Rate-limit middleware — bot detection unit tests.
 *
 * tokenBucketRateLimiter and _clearBucketsForTesting were removed in Issue #318
 * when the in-process Map was replaced with a Redis-backed express-rate-limit
 * instance. Full rate-limit behavior tests live in rate-limit.redis.test.ts.
 *
 * These tests cover the pure bot-detection helpers, which are unchanged.
 */
import { isVerifiedBot, detectVerifiedBot } from '../src/middleware/rate-limit.middleware';

describe('isVerifiedBot', () => {
  it('identifies Googlebot as a verified bot', () => {
    expect(isVerifiedBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
  });

  it('identifies Bingbot as a verified bot (case-insensitive)', () => {
    expect(isVerifiedBot('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(true);
    expect(isVerifiedBot('Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)')).toBe(true);
  });

  it('returns false for a normal browser User-Agent', () => {
    expect(isVerifiedBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')).toBe(false);
  });

  it('returns false for undefined User-Agent', () => {
    expect(isVerifiedBot(undefined)).toBe(false);
  });

  it('returns false for empty string User-Agent', () => {
    expect(isVerifiedBot('')).toBe(false);
  });
});

describe('detectVerifiedBot', () => {
  it('returns the bot name when matched', () => {
    expect(detectVerifiedBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe('googlebot');
    expect(detectVerifiedBot('Mozilla/5.0 (compatible; Slackbot-LinkExpanding 1.0; +https://api.slack.com/robots)')).toBe('slackbot');
  });

  it('returns null for a human UA', () => {
    expect(detectVerifiedBot('Mozilla/5.0 Chrome/120')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(detectVerifiedBot(undefined)).toBeNull();
  });
});
