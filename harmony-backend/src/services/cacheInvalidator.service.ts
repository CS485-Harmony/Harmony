/**
 * CacheInvalidator — subscribes to domain events and invalidates the
 * corresponding Redis cache keys per the §4.4 cache schema.
 *
 * Invalidation rules:
 *   VISIBILITY_CHANGED  → channel:{id}:visibility
 *                       → server:{id}:public_channels
 *   MESSAGE_CREATED     → channel:msgs:{id}:* (all pages)
 *   MESSAGE_EDITED      → channel:msgs:{id}:* (all pages)
 *   MESSAGE_DELETED     → channel:msgs:{id}:* (all pages)
 */

import { eventBus, EventChannels } from './eventBus.service';
import { cacheService, CacheKeys, sanitizeKeySegment } from './cache.service';

type UnsubscribeFn = () => void;

let unsubscribers: UnsubscribeFn[] = [];

export const cacheInvalidator = {
  /** Start all event subscriptions. Call once at server startup. */
  start(): void {
    if (unsubscribers.length > 0) return; // already started

    const u1 = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
      cacheService
        .invalidate(CacheKeys.channelVisibility(payload.channelId))
        .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED invalidation failed:', err));

      cacheService
        .invalidate(`server:${sanitizeKeySegment(payload.serverId)}:public_channels`)
        .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED server key failed:', err));
    });

    const u2 = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
      cacheService
        .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
        .catch((err) => console.error('[CacheInvalidator] MESSAGE_CREATED invalidation failed:', err));
    });

    const u3 = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
      cacheService
        .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
        .catch((err) => console.error('[CacheInvalidator] MESSAGE_EDITED invalidation failed:', err));
    });

    const u4 = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
      cacheService
        .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
        .catch((err) => console.error('[CacheInvalidator] MESSAGE_DELETED invalidation failed:', err));
    });

    unsubscribers = [u1, u2, u3, u4];
  },

  /** Stop all subscriptions and disconnect the subscriber client. */
  async stop(): Promise<void> {
    for (const unsub of unsubscribers) unsub();
    unsubscribers = [];
    await eventBus.disconnect();
  },
};
