/**
 * Meta tag worker integration tests — Issue #354
 *
 * Requires DATABASE_URL pointing at a running Postgres instance and REDIS_URL
 * pointing at a running Redis instance.
 */

process.env.DATABASE_URL ??= 'postgresql://harmony:harmony@localhost:5432/harmony_dev';
process.env.REDIS_URL ??= 'redis://:devsecret@localhost:6379';
process.env.BASE_URL ??= 'http://localhost:3000';

import { ChannelVisibility, PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';
import type { MetaTagUpdateJobData } from '../src/workers/metaTagUpdate.queue';

const prisma = new PrismaClient();
const ts = Date.now();

let userId: string;
let serverId: string;
let channelId: string;

async function waitFor<T>(
  read: () => Promise<T>,
  predicate: (value: T) => boolean,
  timeoutMs = 10_000,
): Promise<T> {
  const startedAt = Date.now();
  // Polling is acceptable here because the integration test waits on real Redis
  // pub/sub + BullMQ worker state changes rather than mocked callbacks.
  while (Date.now() - startedAt < timeoutMs) {
    const value = await read();
    if (predicate(value)) return value;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return read();
}

describe('meta tag worker burst integration', () => {
  let eventBus: typeof import('../src/events/eventBus').eventBus;
  let EventChannels: typeof import('../src/events/eventBus').EventChannels;
  let startMetaTagUpdateRuntime: typeof import('../src/workers/metaTagUpdate.runtime').startMetaTagUpdateRuntime;
  let stopMetaTagUpdateRuntime: typeof import('../src/workers/metaTagUpdate.runtime').stopMetaTagUpdateRuntime;
  let startMetaTagUpdateWorker: typeof import('../src/workers/metaTagUpdate.worker').startMetaTagUpdateWorker;
  let stopMetaTagUpdateWorker: typeof import('../src/workers/metaTagUpdate.worker').stopMetaTagUpdateWorker;
  let metaTagUpdateQueue: typeof import('../src/workers/metaTagUpdate.queue').metaTagUpdateQueue;
  let metaTagService: typeof import('../src/services/metaTag/metaTagService').metaTagService;
  let metaTagRepository: typeof import('../src/repositories/metaTag.repository').metaTagRepository;
  let queueInspector: Queue<MetaTagUpdateJobData>;

  beforeAll(async () => {
    process.env.META_TAG_UPDATE_DEBOUNCE_MS = '100';
    jest.resetModules();

    ({ eventBus, EventChannels } = await import('../src/events/eventBus'));
    ({ startMetaTagUpdateRuntime, stopMetaTagUpdateRuntime } = await import('../src/workers/metaTagUpdate.runtime'));
    ({ startMetaTagUpdateWorker, stopMetaTagUpdateWorker } = await import('../src/workers/metaTagUpdate.worker'));
    ({ metaTagUpdateQueue } = await import('../src/workers/metaTagUpdate.queue'));
    ({ metaTagService } = await import('../src/services/metaTag/metaTagService'));
    ({ metaTagRepository } = await import('../src/repositories/metaTag.repository'));

    queueInspector = new Queue<MetaTagUpdateJobData>('meta-tag-updates', {
      connection: {
        url: process.env.REDIS_URL ?? 'redis://localhost:6379',
        maxRetriesPerRequest: 3,
      },
    });

    const user = await prisma.user.create({
      data: {
        email: `metatag-worker-${ts}@test.local`,
        username: `metatag_worker_${ts}`,
        passwordHash: 'hashed',
        displayName: 'MetaTag Worker Tester',
      },
    });
    userId = user.id;

    const server = await prisma.server.create({
      data: {
        name: `MetaTag Worker Server ${ts}`,
        slug: `metatag-worker-srv-${ts}`,
        ownerId: userId,
      },
    });
    serverId = server.id;

    const channel = await prisma.channel.create({
      data: {
        serverId,
        name: 'meta-tag-worker-channel',
        slug: `meta-tag-worker-channel-${ts}`,
        topic: 'Burst traffic should collapse into one regeneration job',
        visibility: ChannelVisibility.PUBLIC_INDEXABLE,
      },
    });
    channelId = channel.id;
  });

  afterAll(async () => {
    await stopMetaTagUpdateRuntime().catch(() => {});
    await stopMetaTagUpdateWorker().catch(() => {});
    await metaTagUpdateQueue.close().catch(() => {});
    await eventBus.disconnect().catch(() => {});
    await queueInspector.close().catch(() => {});

    if (channelId) {
      await prisma.generatedMetaTags.deleteMany({ where: { channelId } }).catch(() => {});
      await prisma.message.deleteMany({ where: { channelId } }).catch(() => {});
      await prisma.channel.delete({ where: { id: channelId } }).catch(() => {});
    }

    if (serverId) {
      await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
    }

    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }

    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await stopMetaTagUpdateRuntime().catch(() => {});
    await stopMetaTagUpdateWorker().catch(() => {});
    await metaTagUpdateQueue.close().catch(() => {});
    await prisma.generatedMetaTags.deleteMany({ where: { channelId } });
    await prisma.message.deleteMany({ where: { channelId } });
    await queueInspector.obliterate({ force: true }).catch(() => {});

    await prisma.message.createMany({
      data: [
        {
          channelId,
          authorId: userId,
          content: 'First burst message for the worker integration test.',
        },
        {
          channelId,
          authorId: userId,
          content: 'Second burst message so generated tags have multiple inputs.',
        },
      ],
    });
  });

  it('collapses burst traffic into one processed regeneration job per debounce window', async () => {
    const generateSpy = jest.spyOn(metaTagService, 'generateMetaTags');

    await startMetaTagUpdateWorker();
    await startMetaTagUpdateRuntime();

    await Promise.all([
      eventBus.publish(EventChannels.MESSAGE_CREATED, {
        messageId: 'msg-created-1',
        channelId,
        authorId: userId,
        timestamp: new Date().toISOString(),
      }),
      eventBus.publish(EventChannels.MESSAGE_EDITED, {
        messageId: 'msg-edited-1',
        channelId,
        timestamp: new Date().toISOString(),
      }),
      eventBus.publish(EventChannels.MESSAGE_DELETED, {
        messageId: 'msg-deleted-1',
        channelId,
        timestamp: new Date().toISOString(),
      }),
    ]);

    const record = await waitFor(
      () => metaTagRepository.findByChannelId(channelId),
      (value) => value !== null,
    );

    const primaryJob = await queueInspector.getJob(`meta-tag-update:${channelId}:channel`);
    const followUpJob = await queueInspector.getJob(`meta-tag-update:${channelId}:channel:followup`);

    expect(record).not.toBeNull();
    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(primaryJob).not.toBeNull();
    expect(await primaryJob!.getState()).toBe('completed');
    expect(followUpJob).toBeFalsy();

    generateSpy.mockRestore();
  });
});
