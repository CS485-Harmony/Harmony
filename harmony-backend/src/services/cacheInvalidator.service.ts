/**
 * CacheInvalidator — subscribes to domain events and invalidates the
 * corresponding Redis cache keys per the §4.4 cache schema.
 *
 * Invalidation rules:
 *   VISIBILITY_CHANGED  → channel:{id}:visibility
 *                       → server:{id}:public_channels
 *                       → meta:channel:{id}
 *   MESSAGE_CREATED     → channel:msgs:{id}:* (all pages)
 *                       → analysis:channel:{id}
 *                       → meta:channel:{id}
 *   MESSAGE_EDITED      → channel:msgs:{id}:* (all pages)
 *                       → analysis:channel:{id}
 *                       → meta:channel:{id}
 *   MESSAGE_DELETED     → channel:msgs:{id}:* (all pages)
 *                       → analysis:channel:{id}
 *                       → meta:channel:{id}
 */

import { eventBus, EventChannels } from '../events/eventBus';
import { createLogger } from '../lib/logger';
import { cacheService, CacheKeys, sanitizeKeySegment } from './cache.service';
import { indexingService } from './indexing.service';

type UnsubscribeFn = () => void;

let unsubscribers: UnsubscribeFn[] = [];
const logger = createLogger({ component: 'cache-invalidator' });
// Shared startup promise — concurrent callers all await the same initialization
// so no caller returns before subscriptions are confirmed ready.
let startPromise: Promise<void> | null = null;

export const cacheInvalidator = {
  /**
   * Start all event subscriptions.
   * Returns a Promise that resolves once all Redis subscribe handshakes
   * are confirmed — await this in tests to avoid timing-dependent failures.
   * Idempotent: concurrent or repeated calls share the same startup promise.
   */
  start(): Promise<void> {
    if (startPromise !== null) return startPromise;

    startPromise = (async () => {
      const sub1 = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
        cacheService
          .invalidate(CacheKeys.channelVisibility(payload.channelId))
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Visibility cache invalidation failed',
            ),
          );

        cacheService
          .invalidate(`server:${sanitizeKeySegment(payload.serverId)}:public_channels`)
          .catch((err) =>
            logger.warn(
              { err, serverId: payload.serverId },
              'Public channel cache invalidation failed',
            ),
          );

        cacheService
          .invalidate(CacheKeys.metaChannel(payload.channelId))
          .catch((err) =>
            logger.warn({ err, channelId: payload.channelId }, 'Meta cache invalidation failed'),
          );

        // Update sitemap on visibility changes
        indexingService
          .onVisibilityChanged(payload)
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Sitemap update on visibility change failed',
            ),
          );
      });

      const sub2 = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
        cacheService
          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Message cache invalidation failed after create',
            ),
          );

        cacheService
          .invalidate(CacheKeys.analysisChannel(payload.channelId))
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Analysis cache invalidation failed after create',
            ),
          );

        cacheService
          .invalidate(CacheKeys.metaChannel(payload.channelId))
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Meta cache invalidation failed after create',
            ),
          );
      });

      const sub3 = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
        cacheService
          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Message cache invalidation failed after edit',
            ),
          );

        cacheService
          .invalidate(CacheKeys.analysisChannel(payload.channelId))
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Analysis cache invalidation failed after edit',
            ),
          );

        cacheService
          .invalidate(CacheKeys.metaChannel(payload.channelId))
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Meta cache invalidation failed after edit',
            ),
          );
      });

      const sub4 = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
        cacheService
          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Message cache invalidation failed after delete',
            ),
          );

        cacheService
          .invalidate(CacheKeys.analysisChannel(payload.channelId))
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Analysis cache invalidation failed after delete',
            ),
          );

        cacheService
          .invalidate(CacheKeys.metaChannel(payload.channelId))
          .catch((err) =>
            logger.warn(
              { err, channelId: payload.channelId },
              'Meta cache invalidation failed after delete',
            ),
          );
      });

      unsubscribers = [sub1.unsubscribe, sub2.unsubscribe, sub3.unsubscribe, sub4.unsubscribe];

      // Wait for all Redis subscribe handshakes to complete
      await Promise.all([sub1.ready, sub2.ready, sub3.ready, sub4.ready]);
    })();

    return startPromise;
  },

  /** Stop all subscriptions and disconnect the subscriber client. */
  async stop(): Promise<void> {
    startPromise = null; // allow restart after stop
    for (const unsub of unsubscribers) unsub();
    unsubscribers = [];
    await eventBus.disconnect();
  },
};
