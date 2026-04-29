// CL-C2.6 MetaTagCache — Redis-backed cache for generated meta tags (D7.1)
import { cacheService, CacheKeys } from '../cache.service';
import type { MetaTagSet } from './types';

const DEFAULT_TTL = 3600; // seconds, per spec D7.1

export const MetaTagCache = {
  ttl: DEFAULT_TTL,

  async get(channelId: string): Promise<MetaTagSet | null> {
    const entry = await cacheService.get<MetaTagSet>(CacheKeys.metaChannel(channelId));
    return entry?.data ?? null;
  },

  async set(channelId: string, tags: MetaTagSet, ttl?: number): Promise<void> {
    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl: ttl ?? DEFAULT_TTL });
  },

  async invalidate(channelId: string): Promise<void> {
    await cacheService.invalidate(CacheKeys.metaChannel(channelId));
  },
};
