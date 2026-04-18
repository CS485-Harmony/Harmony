/**
 * EventBus — Redis Pub/Sub transport for cross-service events.
 *
 * Design notes:
 * - Redis Pub/Sub requires a dedicated subscriber connection that cannot
 *   issue other commands. We create one lazy subscriber client here and
 *   reuse the shared `redis` publisher client for publishing.
 * - Payloads are serialized as JSON strings on the wire.
 * - All channelId / serverId values in payloads are UUIDs emitted by the
 *   application after DB lookup — they never contain raw user input.
 */

import Redis from 'ioredis';
import { redis } from '../db/redis';
import { createLogger } from '../lib/logger';
import { EventChannelName, EventPayloadMap, EventHandler, EventChannels } from './eventTypes';

export { EventChannels, EventChannelName, EventPayloadMap, EventHandler };
export type {
  VisibilityChangedPayload,
  MessageCreatedPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  MetaTagsUpdatedPayload,
  ServerUpdatedPayload,
  ReactionAddedPayload,
  ReactionRemovedPayload,
} from './eventTypes';

let subscriberClient: Redis | null = null;
const logger = createLogger({ component: 'event-bus' });

// Central handler registry — maps each Redis channel to its active JS handlers.
// A single 'message' listener on the ioredis client dispatches to these sets,
// avoiding per-subscription client.on() calls that accumulate and trigger
// MaxListenersExceededWarning under concurrent SSE connections.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const channelHandlers = new Map<string, Set<(payload: any) => void>>();

// Per-channel ready promise — resolves when Redis confirms the subscription.
// All subscribers on the same channel share this promise so latecomers don't
// get a false-immediate-ready before the handshake completes.
const channelReadyPromises = new Map<string, Promise<void>>();

function getSubscriberClient(): Redis {
  if (!subscriberClient) {
    subscriberClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null, // subscriber clients must not timeout on blocked commands
      lazyConnect: true,
    });

    // Single dispatcher — routes all incoming Redis messages to registered JS handlers.
    // This replaces per-subscription client.on('message', ...) calls, keeping the
    // ioredis emitter's listener count at 1 regardless of how many SSE connections exist.
    subscriberClient.on('message', (ch: string, rawMessage: string) => {
      const handlers = channelHandlers.get(ch);
      if (!handlers) return;
      let payload: unknown;
      try {
        payload = JSON.parse(rawMessage);
      } catch (err) {
        logger.error({ err, channel: ch }, 'Failed to parse event payload');
        return;
      }
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (err) {
          logger.error({ err, channel: ch }, 'Event handler threw synchronously');
        }
      }
    });
  }
  return subscriberClient;
}

export const eventBus = {
  /**
   * Publish a typed event. Fire-and-forget: errors are logged, not thrown,
   * so a Redis hiccup never blocks the calling service transaction.
   */
  async publish<C extends EventChannelName>(
    channel: C,
    payload: EventPayloadMap[C],
  ): Promise<void> {
    try {
      await redis.publish(channel, JSON.stringify(payload));
    } catch (err) {
      logger.warn({ err, channel }, 'Failed to publish event');
    }
  },

  /**
   * Subscribe to a typed event channel.
   * Returns `{ unsubscribe, ready }`:
   *   - `unsubscribe()` removes this handler (and unsubscribes at the Redis level
   *     when the last handler for the channel is removed).
   *   - `ready` is a Promise that resolves when the Redis subscribe handshake
   *     completes, so callers can await it before publishing test messages.
   * Safe to call multiple times — each call registers an additional handler.
   */
  subscribe<C extends EventChannelName>(
    channel: C,
    handler: EventHandler<C>,
  ): { unsubscribe: () => void; ready: Promise<void> } {
    const client = getSubscriberClient();

    // Register the typed handler in the central registry.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let handlers = channelHandlers.get(channel) as Set<(p: any) => void> | undefined;
    const isFirstSubscriber = !handlers || handlers.size === 0;
    if (!handlers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handlers = new Set<(p: any) => void>();
      channelHandlers.set(channel, handlers);
    }
    handlers.add(handler);

    let ready: Promise<void>;
    if (isFirstSubscriber) {
      // First subscriber — issue SUBSCRIBE and store the in-flight handshake promise
      // so subsequent subscribers on the same channel wait for the same confirmation.
      const handshake = new Promise<void>((resolve, reject) => {
        client.subscribe(channel, (err) => {
          if (err) {
            logger.error({ err, channel }, 'Failed to subscribe to event channel');
            reject(err);
          } else {
            resolve();
          }
        });
      });
      ready = handshake;
      channelReadyPromises.set(channel, handshake);
    } else {
      // Subsequent subscribers share the same in-flight promise so they wait until
      // Redis actually confirms the subscription rather than resolving immediately.
      ready = channelReadyPromises.get(channel) ?? Promise.resolve();
    }

    return {
      unsubscribe: () => {
        const set = channelHandlers.get(channel);
        if (set) {
          set.delete(handler);
          if (set.size === 0) {
            channelHandlers.delete(channel);
            channelReadyPromises.delete(channel);
            client
              .unsubscribe(channel)
              .catch((err) =>
                logger.warn({ err, channel }, 'Failed to unsubscribe from event channel'),
              );
          }
        }
      },
      ready,
    };
  },

  /** Gracefully disconnect the subscriber client (call on server shutdown). */
  async disconnect(): Promise<void> {
    if (subscriberClient) {
      await subscriberClient
        .quit()
        .catch((err) => logger.warn({ err }, 'Failed to close event subscriber client cleanly'));
      subscriberClient = null;
      channelHandlers.clear();
      channelReadyPromises.clear();
    }
  },
};
