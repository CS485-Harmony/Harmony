/**
 * Meta tag service integration tests — Issue #354
 *
 * Requires DATABASE_URL pointing at a running Postgres instance and REDIS_URL
 * pointing at a running Redis instance.
 */

import { ChannelVisibility, PrismaClient } from '@prisma/client';
import { MetaTagCache } from '../src/services/metaTag/metaTagCache';
import { metaTagRepository } from '../src/repositories/metaTag.repository';
import { metaTagService } from '../src/services/metaTag/metaTagService';

const prisma = new PrismaClient();
const ts = Date.now();
const originalDatabaseUrl = process.env.DATABASE_URL;
const originalRedisUrl = process.env.REDIS_URL;
const originalBaseUrl = process.env.BASE_URL;

let userId: string;
let serverId: string;
let channelId: string;

beforeAll(async () => {
  process.env.DATABASE_URL ??= 'postgresql://harmony:harmony@localhost:5432/harmony_dev';
  process.env.REDIS_URL ??= 'redis://:devsecret@localhost:6379';
  process.env.BASE_URL ??= 'http://localhost:3000';

  const user = await prisma.user.create({
    data: {
      email: `metatag-svc-${ts}@test.local`,
      username: `metatag_svc_${ts}`,
      passwordHash: 'hashed',
      displayName: 'MetaTag Service Tester',
    },
  });
  userId = user.id;

  const server = await prisma.server.create({
    data: {
      name: `MetaTag Service Server ${ts}`,
      slug: `metatag-service-srv-${ts}`,
      ownerId: userId,
    },
  });
  serverId = server.id;

  const channel = await prisma.channel.create({
    data: {
      serverId,
      name: 'meta-tag-service-channel',
      slug: `meta-tag-service-channel-${ts}`,
      topic: 'Background worker integration coverage',
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    },
  });
  channelId = channel.id;

  await prisma.message.createMany({
    data: [
      {
        channelId,
        authorId: userId,
        content: 'How should the worker regenerate SEO tags after message bursts?',
      },
      {
        channelId,
        authorId: userId,
        content: 'It should debounce channel events and generate a single fresh tag set.',
      },
    ],
  });
});

afterAll(async () => {
  if (channelId) {
    await MetaTagCache.invalidate(channelId).catch(() => {});
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

  process.env.DATABASE_URL = originalDatabaseUrl;
  process.env.REDIS_URL = originalRedisUrl;
  process.env.BASE_URL = originalBaseUrl;
});

beforeEach(async () => {
  await MetaTagCache.invalidate(channelId).catch(() => {});
  await prisma.generatedMetaTags.deleteMany({ where: { channelId } });
});

describe('metaTagService.generateMetaTags', () => {
  it('generates and persists tags from real channel + message data', async () => {
    const tags = await metaTagService.generateMetaTags(channelId);

    expect(tags.title.length).toBeGreaterThan(0);
    expect(tags.description.length).toBeGreaterThanOrEqual(50);
    expect(tags.robots).toBe('index, follow');
    expect(tags.canonical).toContain('/c/');

    const record = await metaTagRepository.findByChannelId(channelId);
    expect(record).not.toBeNull();
    expect(record!.title).toBe(tags.title);
    expect(record!.description).toBe(tags.description);
    expect(record!.needsRegeneration).toBe(false);
  });
});
