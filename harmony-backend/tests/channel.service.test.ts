/**
 * Channel service unit tests — Issue #294
 *
 * Covers all 28 spec cases (CS-1 through CS-28) from
 * docs/test-specs/channel-service-spec.md.
 *
 * All external dependencies (Prisma, cacheService, eventBus) are mocked;
 * no real DB, Redis, or network connections are required.
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

// ─── Mock Prisma ───────────────────────────────────────────────────────────────

const mockChannelFindMany = jest.fn();
const mockChannelFindUnique = jest.fn();
const mockChannelCreate = jest.fn();
const mockChannelUpdate = jest.fn();
const mockChannelDelete = jest.fn();
const mockServerFindUnique = jest.fn();

jest.mock('../src/db/prisma', () => ({
  prisma: {
    channel: {
      findMany: mockChannelFindMany,
      findUnique: mockChannelFindUnique,
      create: mockChannelCreate,
      update: mockChannelUpdate,
      delete: mockChannelDelete,
    },
    server: {
      findUnique: mockServerFindUnique,
    },
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

import { TRPCError } from '@trpc/server';
import { channelService } from '../src/services/channel.service';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const SERVER_ID = '550e8400-e29b-41d4-a716-446655440001';
const CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440002';
const SERVER_SLUG = 'test-server';

const MOCK_SERVER = { id: SERVER_ID, slug: SERVER_SLUG };

const MOCK_CHANNEL = {
  id: CHANNEL_ID,
  serverId: SERVER_ID,
  name: 'test-channel',
  slug: 'test-channel',
  type: 'TEXT' as const,
  visibility: 'PRIVATE' as const,
  topic: null,
  position: 0,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

beforeEach(() => {
  jest.clearAllMocks();
  // Restore all mocks to their default resolved state after each test
  mockCacheSet.mockResolvedValue(undefined);
  mockCacheInvalidate.mockResolvedValue(undefined);
  mockCacheInvalidatePattern.mockResolvedValue(undefined);
  mockPublish.mockResolvedValue(undefined);
});

// ─── CS-1, CS-2: getChannels ──────────────────────────────────────────────────

describe('channelService.getChannels', () => {
  it('CS-1: returns channels in ascending position order', async () => {
    // Mock returns channels already sorted by position (as Prisma would with orderBy)
    const orderedChannels = [
      { ...MOCK_CHANNEL, id: 'id-0', position: 0 },
      { ...MOCK_CHANNEL, id: 'id-1', position: 1 },
      { ...MOCK_CHANNEL, id: 'id-2', position: 2 },
    ];
    mockChannelFindMany.mockResolvedValue(orderedChannels);

    const result = await channelService.getChannels(SERVER_ID);

    expect(mockChannelFindMany).toHaveBeenCalledWith({
      where: { serverId: SERVER_ID },
      orderBy: { position: 'asc' },
    });
    expect(result).toHaveLength(3);
    expect(result[0].position).toBe(0);
    expect(result[1].position).toBe(1);
    expect(result[2].position).toBe(2);
  });

  it('CS-2: returns empty array when server has no channels', async () => {
    mockChannelFindMany.mockResolvedValue([]);

    const result = await channelService.getChannels(SERVER_ID);

    expect(result).toEqual([]);
  });
});

// ─── CS-3, CS-4, CS-5: getChannelBySlug ──────────────────────────────────────

describe('channelService.getChannelBySlug', () => {
  it('CS-3: returns channel when both slugs match', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);

    const result = await channelService.getChannelBySlug(SERVER_SLUG, 'test-channel');

    expect(result).toEqual(MOCK_CHANNEL);
  });

  it('CS-4: throws NOT_FOUND when server slug does not match any server', async () => {
    mockServerFindUnique.mockResolvedValue(null);

    await expect(
      channelService.getChannelBySlug('no-such-server', 'test-channel'),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Server not found' }),
    );
  });

  it('CS-5: throws NOT_FOUND when channel slug does not match any channel in the server', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(null);

    await expect(
      channelService.getChannelBySlug(SERVER_SLUG, 'no-such-channel'),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found' }),
    );
  });
});

// ─── CS-6 through CS-13: createChannel ───────────────────────────────────────

describe('channelService.createChannel', () => {
  it('CS-6: creates a TEXT channel and fires cache + event side effects', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(null); // no slug conflict
    mockChannelCreate.mockResolvedValue(MOCK_CHANNEL);

    const result = await channelService.createChannel({
      serverId: SERVER_ID,
      name: 'test-channel',
      slug: 'test-channel',
      type: 'TEXT',
      visibility: 'PUBLIC_INDEXABLE',
    });

    expect(result).toEqual(MOCK_CHANNEL);

    // Wait for fire-and-forget promises to settle
    await Promise.resolve();

    expect(mockCacheSet).toHaveBeenCalledWith(
      `channel:${CHANNEL_ID}:visibility`,
      expect.anything(),
      expect.anything(),
    );
    expect(mockCacheInvalidate).toHaveBeenCalledWith(`server:${SERVER_ID}:public_channels`);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_CREATED',
      expect.objectContaining({ channelId: CHANNEL_ID, serverId: SERVER_ID, timestamp: expect.any(String) }),
    );
  });

  it('CS-7: defaults position to 0 when not supplied', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(null);
    mockChannelCreate.mockResolvedValue({ ...MOCK_CHANNEL, position: 0 });

    const result = await channelService.createChannel({
      serverId: SERVER_ID,
      name: 'test-channel',
      slug: 'test-channel',
      type: 'TEXT',
      visibility: 'PRIVATE',
    });

    expect(mockChannelCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ position: 0 }) }),
    );
    expect(result.position).toBe(0);
  });

  it('CS-8: throws BAD_REQUEST for VOICE + PUBLIC_INDEXABLE before any Prisma call', async () => {
    await expect(
      channelService.createChannel({
        serverId: SERVER_ID,
        name: 'voice-pub',
        slug: 'voice-pub',
        type: 'VOICE',
        visibility: 'PUBLIC_INDEXABLE',
      }),
    ).rejects.toThrow(
      expect.objectContaining({
        code: 'BAD_REQUEST',
        message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
      }),
    );

    // Guard fires before any Prisma call
    expect(mockServerFindUnique).not.toHaveBeenCalled();
    expect(mockChannelCreate).not.toHaveBeenCalled();
  });

  it('CS-9: allows VOICE channel with PRIVATE visibility', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(null);
    mockChannelCreate.mockResolvedValue({ ...MOCK_CHANNEL, type: 'VOICE', visibility: 'PRIVATE' });

    await expect(
      channelService.createChannel({
        serverId: SERVER_ID,
        name: 'voice-private',
        slug: 'voice-private',
        type: 'VOICE',
        visibility: 'PRIVATE',
      }),
    ).resolves.toBeDefined();
  });

  it('CS-10: allows VOICE channel with PUBLIC_NO_INDEX visibility', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(null);
    mockChannelCreate.mockResolvedValue({ ...MOCK_CHANNEL, type: 'VOICE', visibility: 'PUBLIC_NO_INDEX' });

    await expect(
      channelService.createChannel({
        serverId: SERVER_ID,
        name: 'voice-noindex',
        slug: 'voice-noindex',
        type: 'VOICE',
        visibility: 'PUBLIC_NO_INDEX',
      }),
    ).resolves.toBeDefined();
  });

  it('CS-11: throws NOT_FOUND when server does not exist', async () => {
    mockServerFindUnique.mockResolvedValue(null);

    await expect(
      channelService.createChannel({
        serverId: '00000000-0000-0000-0000-000000000000',
        name: 'orphan',
        slug: 'orphan',
        type: 'TEXT',
        visibility: 'PRIVATE',
      }),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Server not found' }),
    );
  });

  it('CS-12: throws CONFLICT when channel slug already exists in the server', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL); // slug exists

    await expect(
      channelService.createChannel({
        serverId: SERVER_ID,
        name: 'test-channel',
        slug: 'test-channel',
        type: 'TEXT',
        visibility: 'PRIVATE',
      }),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'CONFLICT', message: 'Channel slug already exists in this server' }),
    );
  });

  it('CS-13: side effect rejections do not propagate from createChannel', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(null);
    mockChannelCreate.mockResolvedValue(MOCK_CHANNEL);

    mockCacheSet.mockRejectedValue(new Error('cache set error'));
    mockCacheInvalidate.mockRejectedValue(new Error('cache invalidate error'));
    mockPublish.mockRejectedValue(new Error('event bus error'));

    // Must still resolve — rejections are swallowed by .catch(() => {})
    await expect(
      channelService.createChannel({
        serverId: SERVER_ID,
        name: 'test-channel',
        slug: 'test-channel',
        type: 'TEXT',
        visibility: 'PRIVATE',
      }),
    ).resolves.toEqual(MOCK_CHANNEL);
  });
});

// ─── CS-14 through CS-20, CS-28: updateChannel ───────────────────────────────

describe('channelService.updateChannel', () => {
  it('CS-14: updates channel name and fires cache + event side effects', async () => {
    const updated = { ...MOCK_CHANNEL, name: 'new-name' };
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelUpdate.mockResolvedValue(updated);

    const result = await channelService.updateChannel(CHANNEL_ID, SERVER_ID, { name: 'new-name' });

    expect(result.name).toBe('new-name');

    await Promise.resolve();

    expect(mockCacheInvalidatePattern).toHaveBeenCalledWith(`channel:msgs:${CHANNEL_ID}:*`);
    expect(mockCacheInvalidate).toHaveBeenCalledWith(`server:${SERVER_ID}:public_channels`);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_UPDATED',
      expect.objectContaining({ channelId: CHANNEL_ID, serverId: SERVER_ID, timestamp: expect.any(String) }),
    );
  });

  it('CS-15: updates channel topic', async () => {
    const updated = { ...MOCK_CHANNEL, topic: 'new topic' };
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelUpdate.mockResolvedValue(updated);

    const result = await channelService.updateChannel(CHANNEL_ID, SERVER_ID, { topic: 'new topic' });

    expect(result.topic).toBe('new topic');
  });

  it('CS-16: updates channel position', async () => {
    const updated = { ...MOCK_CHANNEL, position: 5 };
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelUpdate.mockResolvedValue(updated);

    const result = await channelService.updateChannel(CHANNEL_ID, SERVER_ID, { position: 5 });

    expect(result.position).toBe(5);
  });

  it('CS-17: throws NOT_FOUND when channel does not exist', async () => {
    mockChannelFindUnique.mockResolvedValue(null);

    await expect(
      channelService.updateChannel('00000000-0000-0000-0000-000000000000', SERVER_ID, { name: 'x' }),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found in this server' }),
    );
  });

  it('CS-18: throws NOT_FOUND when channel belongs to a different server', async () => {
    const OTHER_SERVER_ID = '550e8400-e29b-41d4-a716-446655440099';
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL); // belongs to SERVER_ID

    await expect(
      channelService.updateChannel(CHANNEL_ID, OTHER_SERVER_ID, { name: 'x' }),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found in this server' }),
    );
  });

  it('CS-19: CHANNEL_UPDATED event payload contains channelId, serverId, and timestamp', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelUpdate.mockResolvedValue(MOCK_CHANNEL);

    await channelService.updateChannel(CHANNEL_ID, SERVER_ID, { name: 'renamed' });

    await Promise.resolve();

    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_UPDATED',
      expect.objectContaining({
        channelId: CHANNEL_ID,
        serverId: SERVER_ID,
        timestamp: expect.any(String),
      }),
    );
    const [, payload] = mockPublish.mock.calls[0] as [string, { timestamp: string }];
    expect(() => new Date(payload.timestamp).toISOString()).not.toThrow();
  });

  it('CS-20: side effect rejections do not propagate from updateChannel', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelUpdate.mockResolvedValue(MOCK_CHANNEL);

    mockCacheInvalidatePattern.mockRejectedValue(new Error('invalidatePattern error'));
    mockCacheInvalidate.mockRejectedValue(new Error('invalidate error'));
    mockPublish.mockRejectedValue(new Error('event bus error'));

    await expect(
      channelService.updateChannel(CHANNEL_ID, SERVER_ID, { name: 'renamed' }),
    ).resolves.toEqual(MOCK_CHANNEL);
  });

  it('CS-28: all-undefined patch still calls update and fires side effects exactly once each', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelUpdate.mockResolvedValue(MOCK_CHANNEL);

    await channelService.updateChannel(CHANNEL_ID, SERVER_ID, {
      name: undefined,
      topic: undefined,
      position: undefined,
    });

    expect(mockChannelUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: {} }),
    );

    await Promise.resolve();

    expect(mockCacheInvalidatePattern).toHaveBeenCalledTimes(1);
    expect(mockCacheInvalidate).toHaveBeenCalledTimes(1);
    expect(mockPublish).toHaveBeenCalledTimes(1);
  });
});

// ─── CS-21 through CS-25: deleteChannel ──────────────────────────────────────

describe('channelService.deleteChannel', () => {
  it('CS-21: deletes channel and fires all three cache operations + event', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelDelete.mockResolvedValue(MOCK_CHANNEL);

    const result = await channelService.deleteChannel(CHANNEL_ID, SERVER_ID);

    expect(mockChannelDelete).toHaveBeenCalledWith({ where: { id: CHANNEL_ID } });
    expect(result).toBeUndefined();

    await Promise.resolve();

    expect(mockCacheInvalidate).toHaveBeenCalledWith(`channel:${CHANNEL_ID}:visibility`);
    expect(mockCacheInvalidatePattern).toHaveBeenCalledWith(`channel:msgs:${CHANNEL_ID}:*`);
    expect(mockCacheInvalidate).toHaveBeenCalledWith(`server:${SERVER_ID}:public_channels`);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_DELETED',
      expect.objectContaining({ channelId: CHANNEL_ID, serverId: SERVER_ID, timestamp: expect.any(String) }),
    );
  });

  it('CS-22: throws NOT_FOUND when channel does not exist', async () => {
    mockChannelFindUnique.mockResolvedValue(null);

    await expect(
      channelService.deleteChannel('00000000-0000-0000-0000-000000000000', SERVER_ID),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found in this server' }),
    );
  });

  it('CS-23: throws NOT_FOUND when channel belongs to a different server', async () => {
    const OTHER_SERVER_ID = '550e8400-e29b-41d4-a716-446655440099';
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL); // belongs to SERVER_ID

    await expect(
      channelService.deleteChannel(CHANNEL_ID, OTHER_SERVER_ID),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Channel not found in this server' }),
    );
  });

  it('CS-24: CHANNEL_DELETED event payload contains channelId, serverId, and timestamp', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelDelete.mockResolvedValue(MOCK_CHANNEL);

    await channelService.deleteChannel(CHANNEL_ID, SERVER_ID);

    await Promise.resolve();

    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_DELETED',
      expect.objectContaining({
        channelId: CHANNEL_ID,
        serverId: SERVER_ID,
        timestamp: expect.any(String),
      }),
    );
    const [, payload] = mockPublish.mock.calls[0] as [string, { timestamp: string }];
    expect(() => new Date(payload.timestamp).toISOString()).not.toThrow();
  });

  it('CS-25: side effect rejections (all three cache + event) do not propagate from deleteChannel', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
    mockChannelDelete.mockResolvedValue(MOCK_CHANNEL);

    mockCacheInvalidate.mockRejectedValue(new Error('invalidate error'));
    mockCacheInvalidatePattern.mockRejectedValue(new Error('invalidatePattern error'));
    mockPublish.mockRejectedValue(new Error('event bus error'));

    await expect(
      channelService.deleteChannel(CHANNEL_ID, SERVER_ID),
    ).resolves.toBeUndefined();
  });
});

// ─── CS-26, CS-27: createDefaultChannel ──────────────────────────────────────

describe('channelService.createDefaultChannel', () => {
  it('CS-26: delegates to createChannel with the correct fixed arguments', async () => {
    mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
    mockChannelFindUnique.mockResolvedValue(null);
    const defaultChannel = {
      ...MOCK_CHANNEL,
      name: 'general',
      slug: 'general',
      type: 'TEXT' as const,
      visibility: 'PRIVATE' as const,
      position: 0,
    };
    mockChannelCreate.mockResolvedValue(defaultChannel);

    const result = await channelService.createDefaultChannel(SERVER_ID);

    expect(mockChannelCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          serverId: SERVER_ID,
          name: 'general',
          slug: 'general',
          type: 'TEXT',
          visibility: 'PRIVATE',
          position: 0,
        }),
      }),
    );
    expect(result.name).toBe('general');
    expect(result.slug).toBe('general');
    expect(result.type).toBe('TEXT');
    expect(result.visibility).toBe('PRIVATE');
    expect(result.position).toBe(0);
  });

  it('CS-27: propagates error when underlying createChannel fails (server not found)', async () => {
    mockServerFindUnique.mockResolvedValue(null);

    await expect(
      channelService.createDefaultChannel('00000000-0000-0000-0000-000000000000'),
    ).rejects.toThrow(
      expect.objectContaining({ code: 'NOT_FOUND', message: 'Server not found' }),
    );
  });
});
