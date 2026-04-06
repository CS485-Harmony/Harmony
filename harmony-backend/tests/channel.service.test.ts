/**
 * Channel service unit tests — Issue #294
 *
 * Covers all 28 spec cases (CS-1 through CS-28) from
 * docs/test-specs/channel-service-spec.md.
 *
 * Uses a real test database with isolated fixtures per the spec.
 * Only cache (cacheService) and event (eventBus) dependencies are mocked.
 *
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

// ─── Mock eventBus ─────────────────────────────────────────────────────────────

const mockPublish = jest.fn().mockResolvedValue(undefined);

jest.mock('../src/events/eventBus', () => ({
  eventBus: { publish: mockPublish },
  EventChannels: {
    CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
    CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
    CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

const mockCacheSet = jest.fn().mockResolvedValue(undefined);
const mockCacheInvalidate = jest.fn().mockResolvedValue(undefined);
const mockCacheInvalidatePattern = jest.fn().mockResolvedValue(undefined);

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    set: mockCacheSet,
    invalidate: mockCacheInvalidate,
    invalidatePattern: mockCacheInvalidatePattern,
  },
  CacheKeys: {
    channelVisibility: (id: string) => `channel:${id}:visibility`,
  },
  CacheTTL: { channelVisibility: 3600 },
  sanitizeKeySegment: (s: string) => s,
}));

import { PrismaClient, ChannelType, ChannelVisibility } from '@prisma/client';
import { channelService } from '../src/services/channel.service';
import { prisma as servicePrisma } from '../src/db/prisma';

const prisma = new PrismaClient();
const ts = Date.now();

// ─── Shared fixture IDs ─────────────────────────────────────────────────────

let userId: string;
let serverId: string;
let serverSlug: string;
let emptyServerId: string;
let channelId: string;
let channelSlug: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: `cs-test-${ts}@example.com`,
      username: `cs_test_${ts}`,
      passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
      displayName: 'Channel Service Test User',
    },
  });
  userId = user.id;

  serverSlug = `cs-test-${ts}`;
  const server = await prisma.server.create({
    data: {
      name: 'Channel Service Test Server',
      slug: serverSlug,
      isPublic: false,
      ownerId: userId,
    },
  });
  serverId = server.id;

  // A second server with no channels, for CS-2
  const emptyServer = await prisma.server.create({
    data: {
      name: 'Empty Server',
      slug: `cs-empty-${ts}`,
      isPublic: false,
      ownerId: userId,
    },
  });
  emptyServerId = emptyServer.id;

  // Seed three channels at different positions for CS-1
  const ch = await prisma.channel.create({
    data: {
      serverId,
      name: 'channel-b',
      slug: `channel-b-${ts}`,
      type: 'TEXT',
      visibility: 'PRIVATE',
      position: 1,
    },
  });
  channelId = ch.id;
  channelSlug = ch.slug;

  await prisma.channel.create({
    data: {
      serverId,
      name: 'channel-a',
      slug: `channel-a-${ts}`,
      type: 'TEXT',
      visibility: 'PRIVATE',
      position: 0,
    },
  });

  await prisma.channel.create({
    data: {
      serverId,
      name: 'channel-c',
      slug: `channel-c-${ts}`,
      type: 'TEXT',
      visibility: 'PRIVATE',
      position: 2,
    },
  });
});

afterAll(async () => {
  await prisma.channel.deleteMany({ where: { serverId: { in: [serverId, emptyServerId] } } }).catch(() => {});
  await prisma.server.deleteMany({ where: { id: { in: [serverId, emptyServerId] } } }).catch(() => {});
  await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  await prisma.$disconnect();
});

beforeEach(() => {
  jest.clearAllMocks();
  mockCacheSet.mockResolvedValue(undefined);
  mockCacheInvalidate.mockResolvedValue(undefined);
  mockCacheInvalidatePattern.mockResolvedValue(undefined);
  mockPublish.mockResolvedValue(undefined);
});

// ─── CS-1, CS-2: getChannels ──────────────────────────────────────────────────

describe('channelService.getChannels', () => {
  it('CS-1: returns channels in ascending position order', async () => {
    const result = await channelService.getChannels(serverId);

    expect(result.length).toBeGreaterThanOrEqual(3);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].position).toBeGreaterThanOrEqual(result[i - 1].position);
    }
  });

  it('CS-2: returns empty array when server has no channels', async () => {
    const result = await channelService.getChannels(emptyServerId);

    expect(result).toEqual([]);
  });
});

// ─── CS-3, CS-4, CS-5: getChannelBySlug ──────────────────────────────────────

describe('channelService.getChannelBySlug', () => {
  it('CS-3: returns channel when both slugs match', async () => {
    const result = await channelService.getChannelBySlug(serverSlug, channelSlug);

    expect(result.id).toBe(channelId);
    expect(result.serverId).toBe(serverId);
  });

  it('CS-4: throws NOT_FOUND when server slug does not match any server', async () => {
    await expect(
      channelService.getChannelBySlug('no-such-server', channelSlug),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Server not found' }),
    );
  });

  it('CS-5: throws NOT_FOUND when channel slug does not match any channel in the server', async () => {
    await expect(
      channelService.getChannelBySlug(serverSlug, 'no-such-channel'),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found' }),
    );
  });
});

// ─── CS-6 through CS-13: createChannel ───────────────────────────────────────

describe('channelService.createChannel', () => {
  // Clean up channels created by these tests
  const createdChannelIds: string[] = [];

  afterAll(async () => {
    for (const id of createdChannelIds) {
      await prisma.channel.delete({ where: { id } }).catch(() => {});
    }
  });

  it('CS-6: creates a TEXT channel and fires cache + event side effects', async () => {
    const result = await channelService.createChannel({
      serverId,
      name: 'cs6-channel',
      slug: `cs6-channel-${ts}`,
      type: 'TEXT' as ChannelType,
      visibility: 'PUBLIC_INDEXABLE' as ChannelVisibility,
    });
    createdChannelIds.push(result.id);

    expect(result.serverId).toBe(serverId);
    expect(result.name).toBe('cs6-channel');
    expect(result.type).toBe('TEXT');

    // Wait for fire-and-forget promises to settle
    await new Promise((r) => setImmediate(r));

    expect(mockCacheSet).toHaveBeenCalledWith(
      `channel:${result.id}:visibility`,
      expect.anything(),
      expect.anything(),
    );
    expect(mockCacheInvalidate).toHaveBeenCalledWith(`server:${serverId}:public_channels`);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_CREATED',
      expect.objectContaining({ channelId: result.id, serverId }),
    );
  });

  it('CS-7: defaults position to 0 when not supplied', async () => {
    const result = await channelService.createChannel({
      serverId,
      name: 'cs7-channel',
      slug: `cs7-channel-${ts}`,
      type: 'TEXT' as ChannelType,
      visibility: 'PRIVATE' as ChannelVisibility,
    });
    createdChannelIds.push(result.id);

    expect(result.position).toBe(0);
  });

  it('CS-8: throws BAD_REQUEST for VOICE + PUBLIC_INDEXABLE before any DB call', async () => {
    const serverSpy = jest.spyOn(servicePrisma.server, 'findUnique');
    const channelCreateSpy = jest.spyOn(servicePrisma.channel, 'create');

    await expect(
      channelService.createChannel({
        serverId,
        name: 'voice-pub',
        slug: 'voice-pub',
        type: 'VOICE' as ChannelType,
        visibility: 'PUBLIC_INDEXABLE' as ChannelVisibility,
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 'BAD_REQUEST',
        message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
      }),
    );

    // Guard fires before any Prisma call
    expect(serverSpy).not.toHaveBeenCalled();
    expect(channelCreateSpy).not.toHaveBeenCalled();

    serverSpy.mockRestore();
    channelCreateSpy.mockRestore();
  });

  it('CS-9: allows VOICE channel with PRIVATE visibility', async () => {
    const result = await channelService.createChannel({
      serverId,
      name: 'voice-private',
      slug: `voice-private-${ts}`,
      type: 'VOICE' as ChannelType,
      visibility: 'PRIVATE' as ChannelVisibility,
    });
    createdChannelIds.push(result.id);

    expect(result.type).toBe('VOICE');
    expect(result.visibility).toBe('PRIVATE');
  });

  it('CS-10: allows VOICE channel with PUBLIC_NO_INDEX visibility', async () => {
    const result = await channelService.createChannel({
      serverId,
      name: 'voice-noindex',
      slug: `voice-noindex-${ts}`,
      type: 'VOICE' as ChannelType,
      visibility: 'PUBLIC_NO_INDEX' as ChannelVisibility,
    });
    createdChannelIds.push(result.id);

    expect(result.type).toBe('VOICE');
    expect(result.visibility).toBe('PUBLIC_NO_INDEX');
  });

  it('CS-11: throws NOT_FOUND when server does not exist', async () => {
    await expect(
      channelService.createChannel({
        serverId: '00000000-0000-0000-0000-000000000000',
        name: 'orphan',
        slug: 'orphan',
        type: 'TEXT' as ChannelType,
        visibility: 'PRIVATE' as ChannelVisibility,
      }),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Server not found' }),
    );
  });

  it('CS-12: throws CONFLICT when channel slug already exists in the server', async () => {
    await expect(
      channelService.createChannel({
        serverId,
        name: 'duplicate',
        slug: channelSlug, // already exists from beforeAll
        type: 'TEXT' as ChannelType,
        visibility: 'PRIVATE' as ChannelVisibility,
      }),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'CONFLICT', message: 'Channel slug already exists in this server' }),
    );
  });

  it('CS-13: side effect rejections do not propagate from createChannel', async () => {
    mockCacheSet.mockRejectedValue(new Error('cache set error'));
    mockCacheInvalidate.mockRejectedValue(new Error('cache invalidate error'));
    mockPublish.mockRejectedValue(new Error('event bus error'));

    const result = await channelService.createChannel({
      serverId,
      name: 'cs13-channel',
      slug: `cs13-channel-${ts}`,
      type: 'TEXT' as ChannelType,
      visibility: 'PRIVATE' as ChannelVisibility,
    });
    createdChannelIds.push(result.id);

    expect(result).toBeDefined();
  });
});

// ─── CS-14 through CS-20, CS-28: updateChannel ───────────────────────────────

describe('channelService.updateChannel', () => {
  it('CS-14: updates channel name and fires cache + event side effects', async () => {
    const result = await channelService.updateChannel(channelId, serverId, { name: 'new-name' });

    expect(result.name).toBe('new-name');

    await new Promise((r) => setImmediate(r));

    expect(mockCacheInvalidatePattern).toHaveBeenCalledWith(`channel:msgs:${channelId}:*`);
    expect(mockCacheInvalidate).toHaveBeenCalledWith(`server:${serverId}:public_channels`);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_UPDATED',
      expect.objectContaining({ channelId, serverId }),
    );

    // Restore original name
    await prisma.channel.update({ where: { id: channelId }, data: { name: 'channel-b' } });
  });

  it('CS-15: updates channel topic', async () => {
    const result = await channelService.updateChannel(channelId, serverId, { topic: 'new topic' });

    expect(result.topic).toBe('new topic');

    await prisma.channel.update({ where: { id: channelId }, data: { topic: null } });
  });

  it('CS-16: updates channel position', async () => {
    const result = await channelService.updateChannel(channelId, serverId, { position: 5 });

    expect(result.position).toBe(5);

    await prisma.channel.update({ where: { id: channelId }, data: { position: 1 } });
  });

  it('CS-17: throws NOT_FOUND when channel does not exist', async () => {
    await expect(
      channelService.updateChannel('00000000-0000-0000-0000-000000000000', serverId, { name: 'x' }),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found in this server' }),
    );
  });

  it('CS-18: throws NOT_FOUND when channel belongs to a different server', async () => {
    await expect(
      channelService.updateChannel(channelId, emptyServerId, { name: 'x' }),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found in this server' }),
    );
  });

  // CS-19: event payload shape is verified in channel.service.events.test.ts
  // to avoid duplicate coverage per issue #294.

  it('CS-20: side effect rejections do not propagate from updateChannel', async () => {
    mockCacheInvalidatePattern.mockRejectedValue(new Error('invalidatePattern error'));
    mockCacheInvalidate.mockRejectedValue(new Error('invalidate error'));
    mockPublish.mockRejectedValue(new Error('event bus error'));

    await expect(
      channelService.updateChannel(channelId, serverId, { name: 'renamed' }),
    ).resolves.toBeDefined();

    await prisma.channel.update({ where: { id: channelId }, data: { name: 'channel-b' } });
  });

  it('CS-28: all-undefined patch still calls update and fires side effects exactly once each', async () => {
    await channelService.updateChannel(channelId, serverId, {
      name: undefined,
      topic: undefined,
      position: undefined,
    });

    await new Promise((r) => setImmediate(r));

    expect(mockCacheInvalidatePattern).toHaveBeenCalledTimes(1);
    expect(mockCacheInvalidate).toHaveBeenCalledTimes(1);
    expect(mockPublish).toHaveBeenCalledTimes(1);
  });
});

// ─── CS-21 through CS-25: deleteChannel ──────────────────────────────────────

describe('channelService.deleteChannel', () => {
  let deleteChannelId: string;

  beforeAll(async () => {
    const ch = await prisma.channel.create({
      data: {
        serverId,
        name: 'to-delete',
        slug: `to-delete-${ts}`,
        type: 'TEXT',
        visibility: 'PRIVATE',
        position: 99,
      },
    });
    deleteChannelId = ch.id;
  });

  it('CS-21: deletes channel and fires all three cache operations + event', async () => {
    const result = await channelService.deleteChannel(deleteChannelId, serverId);

    expect(result).toBeUndefined();

    // Verify the channel is actually gone from the DB
    const gone = await prisma.channel.findUnique({ where: { id: deleteChannelId } });
    expect(gone).toBeNull();

    await new Promise((r) => setImmediate(r));

    expect(mockCacheInvalidate).toHaveBeenCalledWith(`channel:${deleteChannelId}:visibility`);
    expect(mockCacheInvalidatePattern).toHaveBeenCalledWith(`channel:msgs:${deleteChannelId}:*`);
    expect(mockCacheInvalidate).toHaveBeenCalledWith(`server:${serverId}:public_channels`);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_DELETED',
      expect.objectContaining({ channelId: deleteChannelId, serverId }),
    );
  });

  it('CS-22: throws NOT_FOUND when channel does not exist', async () => {
    await expect(
      channelService.deleteChannel('00000000-0000-0000-0000-000000000000', serverId),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found in this server' }),
    );
  });

  it('CS-23: throws NOT_FOUND when channel belongs to a different server', async () => {
    // Use one of the seeded channels (belongs to serverId), pass emptyServerId
    await expect(
      channelService.deleteChannel(channelId, emptyServerId),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found in this server' }),
    );
  });

  // CS-24: event payload shape is verified in channel.service.events.test.ts
  // to avoid duplicate coverage per issue #294.

  it('CS-25: side effect rejections (all three cache + event) do not propagate from deleteChannel', async () => {
    // Create a throwaway channel for this test
    const ch = await prisma.channel.create({
      data: {
        serverId,
        name: 'cs25-delete',
        slug: `cs25-delete-${ts}`,
        type: 'TEXT',
        visibility: 'PRIVATE',
        position: 99,
      },
    });

    mockCacheInvalidate.mockRejectedValue(new Error('invalidate error'));
    mockCacheInvalidatePattern.mockRejectedValue(new Error('invalidatePattern error'));
    mockPublish.mockRejectedValue(new Error('event bus error'));

    await expect(
      channelService.deleteChannel(ch.id, serverId),
    ).resolves.toBeUndefined();
  });
});

// ─── CS-26, CS-27: createDefaultChannel ──────────────────────────────────────

describe('channelService.createDefaultChannel', () => {
  let defaultChannelServerId: string;

  beforeAll(async () => {
    const server = await prisma.server.create({
      data: {
        name: 'Default Channel Test Server',
        slug: `cs26-server-${ts}`,
        isPublic: false,
        ownerId: userId,
      },
    });
    defaultChannelServerId = server.id;
  });

  afterAll(async () => {
    await prisma.channel.deleteMany({ where: { serverId: defaultChannelServerId } }).catch(() => {});
    await prisma.server.delete({ where: { id: defaultChannelServerId } }).catch(() => {});
  });

  it('CS-26: delegates to createChannel with the correct fixed arguments', async () => {
    const spy = jest.spyOn(channelService, 'createChannel');

    const result = await channelService.createDefaultChannel(defaultChannelServerId);

    expect(spy).toHaveBeenCalledWith({
      serverId: defaultChannelServerId,
      name: 'general',
      slug: 'general',
      type: 'TEXT',
      visibility: 'PRIVATE',
      position: 0,
    });
    expect(result.name).toBe('general');
    expect(result.slug).toBe('general');

    spy.mockRestore();
  });

  it('CS-27: propagates error when underlying createChannel fails (server not found)', async () => {
    await expect(
      channelService.createDefaultChannel('00000000-0000-0000-0000-000000000000'),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Server not found' }),
    );
  });
});
