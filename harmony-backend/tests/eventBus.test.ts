/**
 * EventBus and CacheInvalidator tests — Issue #111
 *
 * Tests:
 *   - EventBus: typed publish/subscribe round-trip for VISIBILITY_CHANGED
 *     and MESSAGE_* events.
 *   - CacheInvalidator: verifies the correct cache keys are invalidated
 *     when events are received.
 *
 * Requires REDIS_URL pointing at a running Redis instance.
 */

import { eventBus, EventChannels } from '../src/services/eventBus.service';
import { cacheInvalidator } from '../src/services/cacheInvalidator.service';
import { cacheService } from '../src/services/cache.service';
import { redis } from '../src/db/redis';

const TEST_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
const TEST_SERVER_ID = '550e8400-e29b-41d4-a716-446655440002';
const TEST_ACTOR_ID = '550e8400-e29b-41d4-a716-446655440003';
const TEST_MESSAGE_ID = '550e8400-e29b-41d4-a716-446655440004';

/** Wait for an async side-effect to propagate (pub/sub is async). */
function waitForPropagation(ms = 100): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeAll(async () => {
  await redis.connect().catch(() => {});
});

afterAll(async () => {
  await cacheInvalidator.stop();
  await redis.quit();
});

// ─── EventBus: publish / subscribe ───────────────────────────────────────────

describe('EventBus.publish / subscribe', () => {
  afterEach(async () => {
    // Disconnect subscriber so each test group starts clean
    await eventBus.disconnect();
  });

  it('delivers VISIBILITY_CHANGED payload to subscriber', async () => {
    const received: unknown[] = [];
    const unsub = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
      received.push(payload);
    });

    await waitForPropagation(50); // allow subscribe handshake

    const payload = {
      channelId: TEST_CHANNEL_ID,
      serverId: TEST_SERVER_ID,
      oldVisibility: 'PRIVATE',
      newVisibility: 'PUBLIC_INDEXABLE',
      actorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish(EventChannels.VISIBILITY_CHANGED, payload);
    await waitForPropagation();

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(payload);

    unsub();
  });

  it('delivers MESSAGE_CREATED payload to subscriber', async () => {
    const received: unknown[] = [];
    const unsub = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
      received.push(payload);
    });

    await waitForPropagation(50);

    const payload = {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      authorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish(EventChannels.MESSAGE_CREATED, payload);
    await waitForPropagation();

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(payload);

    unsub();
  });

  it('delivers MESSAGE_EDITED payload to subscriber', async () => {
    const received: unknown[] = [];
    const unsub = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
      received.push(payload);
    });

    await waitForPropagation(50);

    const payload = {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish(EventChannels.MESSAGE_EDITED, payload);
    await waitForPropagation();

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(payload);

    unsub();
  });

  it('delivers MESSAGE_DELETED payload to subscriber', async () => {
    const received: unknown[] = [];
    const unsub = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
      received.push(payload);
    });

    await waitForPropagation(50);

    const payload = {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish(EventChannels.MESSAGE_DELETED, payload);
    await waitForPropagation();

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(payload);

    unsub();
  });

  it('unsubscribe stops handler from receiving further messages', async () => {
    const received: unknown[] = [];
    const unsub = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
      received.push(payload);
    });

    await waitForPropagation(50);
    unsub(); // unsubscribe before publishing

    await eventBus.publish(EventChannels.VISIBILITY_CHANGED, {
      channelId: TEST_CHANNEL_ID,
      serverId: TEST_SERVER_ID,
      oldVisibility: 'PRIVATE',
      newVisibility: 'PUBLIC_NO_INDEX',
      actorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    });
    await waitForPropagation();

    expect(received).toHaveLength(0);
  });
});

// ─── CacheInvalidator: event-driven cache invalidation ───────────────────────

describe('CacheInvalidator', () => {
  let invalidateSpy: jest.SpyInstance;
  let invalidatePatternSpy: jest.SpyInstance;

  beforeAll(async () => {
    invalidateSpy = jest.spyOn(cacheService, 'invalidate').mockResolvedValue();
    invalidatePatternSpy = jest.spyOn(cacheService, 'invalidatePattern').mockResolvedValue();
    cacheInvalidator.start();
    await waitForPropagation(100); // allow subscribe handshakes
  });

  afterAll(async () => {
    invalidateSpy.mockRestore();
    invalidatePatternSpy.mockRestore();
    await cacheInvalidator.stop();
  });

  afterEach(() => {
    invalidateSpy.mockClear();
    invalidatePatternSpy.mockClear();
  });

  it('VISIBILITY_CHANGED invalidates channel visibility cache key', async () => {
    await eventBus.publish(EventChannels.VISIBILITY_CHANGED, {
      channelId: TEST_CHANNEL_ID,
      serverId: TEST_SERVER_ID,
      oldVisibility: 'PRIVATE',
      newVisibility: 'PUBLIC_INDEXABLE',
      actorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    });
    await waitForPropagation();

    expect(invalidateSpy).toHaveBeenCalledWith(`channel:${TEST_CHANNEL_ID}:visibility`);
  });

  it('VISIBILITY_CHANGED invalidates server public_channels cache key', async () => {
    await eventBus.publish(EventChannels.VISIBILITY_CHANGED, {
      channelId: TEST_CHANNEL_ID,
      serverId: TEST_SERVER_ID,
      oldVisibility: 'PRIVATE',
      newVisibility: 'PUBLIC_INDEXABLE',
      actorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    });
    await waitForPropagation();

    expect(invalidateSpy).toHaveBeenCalledWith(`server:${TEST_SERVER_ID}:public_channels`);
  });

  it('MESSAGE_CREATED invalidates all message page caches for the channel', async () => {
    await eventBus.publish(EventChannels.MESSAGE_CREATED, {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      authorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    });
    await waitForPropagation();

    expect(invalidatePatternSpy).toHaveBeenCalledWith(`channel:msgs:${TEST_CHANNEL_ID}:*`);
  });

  it('MESSAGE_EDITED invalidates all message page caches for the channel', async () => {
    await eventBus.publish(EventChannels.MESSAGE_EDITED, {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    });
    await waitForPropagation();

    expect(invalidatePatternSpy).toHaveBeenCalledWith(`channel:msgs:${TEST_CHANNEL_ID}:*`);
  });

  it('MESSAGE_DELETED invalidates all message page caches for the channel', async () => {
    await eventBus.publish(EventChannels.MESSAGE_DELETED, {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    });
    await waitForPropagation();

    expect(invalidatePatternSpy).toHaveBeenCalledWith(`channel:msgs:${TEST_CHANNEL_ID}:*`);
  });

  it('cacheInvalidator.start() is idempotent (double-start safe)', () => {
    // Second call should not throw or double-register handlers
    expect(() => cacheInvalidator.start()).not.toThrow();
  });
});
