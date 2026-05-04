/**
 * channel.service.events.test.ts — Issue #185
 *
 * Verifies that channel.service publishes Redis events after each mutating operation.
 * eventBus is mocked so no Redis connection is required.
 */

import { TRPCError } from '@trpc/server';

// ─── Mock eventBus ─────────────────────────────────────────────────────────────

const mockPublish = jest.fn().mockResolvedValue(undefined);

jest.mock('../src/events/eventBus', () => ({
  eventBus: {
    publish: mockPublish,
  },
  EventChannels: {
    CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
    CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
    CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
  },
}));

// ─── Mock Prisma ───────────────────────────────────────────────────────────────

const mockChannelCreate = jest.fn();
const mockChannelUpdate = jest.fn();
const mockChannelDelete = jest.fn();
const mockChannelFindUnique = jest.fn();
const mockChannelCount = jest.fn();
const mockServerFindUnique = jest.fn();

jest.mock('../src/db/prisma', () => ({
  prisma: {
    channel: {
      create: mockChannelCreate,
      update: mockChannelUpdate,
      delete: mockChannelDelete,
      findUnique: mockChannelFindUnique,
      count: mockChannelCount,
    },
    server: {
      findUnique: mockServerFindUnique,
    },
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    set: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
  },
  CacheKeys: { channelVisibility: (id: string) => `channel:${id}:visibility` },
  CacheTTL: { channelVisibility: 60 },
  sanitizeKeySegment: (s: string) => s,
}));

import { channelService } from '../src/services/channel.service';
import { ChannelType, ChannelVisibility } from '@prisma/client';

// ─── Fixture data ─────────────────────────────────────────────────────────────

const SERVER_ID = '550e8400-e29b-41d4-a716-446655440001';
const CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440002';

const MOCK_SERVER = { id: SERVER_ID };

const MOCK_CHANNEL = {
  id: CHANNEL_ID,
  serverId: SERVER_ID,
  name: 'test-channel',
  slug: 'test-channel',
  type: ChannelType.TEXT,
  visibility: ChannelVisibility.PRIVATE,
  topic: null,
  position: 0,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockServerFindUnique.mockResolvedValue(MOCK_SERVER);
  mockChannelFindUnique.mockResolvedValue(null); // no slug conflict by default
  mockChannelCreate.mockResolvedValue(MOCK_CHANNEL);
  mockChannelUpdate.mockResolvedValue({ ...MOCK_CHANNEL, name: 'renamed' });
  mockChannelDelete.mockResolvedValue(MOCK_CHANNEL);
  mockChannelCount.mockResolvedValue(2); // >1 text channel by default so deletes succeed
});

// ─── createChannel publishes CHANNEL_CREATED ──────────────────────────────────

describe('channelService.createChannel — transactional side-effect suppression', () => {
  it('does NOT publish or update cache when a tx is passed (outer transaction path)', async () => {
    // Build a minimal tx client that mirrors what Prisma's TransactionClient exposes,
    // reusing the same mock functions already set up for the global prisma client.
    const mockTx = {
      server: { findUnique: mockServerFindUnique },
      channel: { findUnique: mockChannelFindUnique, create: mockChannelCreate },
    };

    mockChannelFindUnique.mockResolvedValue(null);
    mockChannelCreate.mockResolvedValue(MOCK_CHANNEL);

    const { cacheService } = jest.requireMock('../src/services/cache.service') as {
      cacheService: { set: jest.Mock; invalidate: jest.Mock };
    };

    await channelService.createChannel(
      {
        serverId: SERVER_ID,
        name: 'test-channel',
        slug: 'test-channel',
        type: ChannelType.TEXT,
        visibility: ChannelVisibility.PRIVATE,
      },
      mockTx as never,
    );

    expect(mockPublish).not.toHaveBeenCalled();
    expect(cacheService.set).not.toHaveBeenCalled();
    expect(cacheService.invalidate).not.toHaveBeenCalled();
  });
});

describe('channelService.createChannel — event publishing', () => {
  it('publishes CHANNEL_CREATED with channelId and serverId after create', async () => {
    // findUnique for slug conflict check returns null (no conflict), then create returns channel
    mockChannelFindUnique.mockResolvedValue(null);
    mockChannelCreate.mockResolvedValue(MOCK_CHANNEL);

    await channelService.createChannel({
      serverId: SERVER_ID,
      name: 'test-channel',
      slug: 'test-channel',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
    });

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_CREATED',
      expect.objectContaining({
        channelId: CHANNEL_ID,
        serverId: SERVER_ID,
        timestamp: expect.any(String),
      }),
    );
  });

  it('timestamp in CHANNEL_CREATED is a valid ISO 8601 string', async () => {
    await channelService.createChannel({
      serverId: SERVER_ID,
      name: 'test-channel',
      slug: 'test-channel',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
    });

    const [, payload] = mockPublish.mock.calls[0] as [string, { timestamp: string }];
    expect(() => new Date(payload.timestamp).toISOString()).not.toThrow();
  });

  it('does NOT publish when server is not found (NOT_FOUND)', async () => {
    mockServerFindUnique.mockResolvedValue(null);

    await expect(
      channelService.createChannel({
        serverId: '00000000-0000-0000-0000-000000000000',
        name: 'ghost',
        slug: 'ghost',
        type: ChannelType.TEXT,
        visibility: ChannelVisibility.PRIVATE,
      }),
    ).rejects.toThrow(TRPCError);

    expect(mockPublish).not.toHaveBeenCalled();
  });

  it('does NOT publish when slug conflict occurs (CONFLICT)', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL); // slug already exists

    await expect(
      channelService.createChannel({
        serverId: SERVER_ID,
        name: 'test-channel',
        slug: 'test-channel',
        type: ChannelType.TEXT,
        visibility: ChannelVisibility.PRIVATE,
      }),
    ).rejects.toThrow(TRPCError);

    expect(mockPublish).not.toHaveBeenCalled();
  });
});

// ─── updateChannel publishes CHANNEL_UPDATED ──────────────────────────────────

describe('channelService.updateChannel — event publishing', () => {
  it('publishes CHANNEL_UPDATED with channelId and serverId after update', async () => {
    // findUnique for channel ownership check
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);

    await channelService.updateChannel(CHANNEL_ID, SERVER_ID, { name: 'renamed' });

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_UPDATED',
      expect.objectContaining({
        channelId: CHANNEL_ID,
        serverId: SERVER_ID,
        timestamp: expect.any(String),
      }),
    );
  });

  it('timestamp in CHANNEL_UPDATED is a valid ISO 8601 string', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);

    await channelService.updateChannel(CHANNEL_ID, SERVER_ID, { name: 'renamed' });

    const [, payload] = mockPublish.mock.calls[0] as [string, { timestamp: string }];
    expect(() => new Date(payload.timestamp).toISOString()).not.toThrow();
  });

  it('does NOT publish when channel is not found (NOT_FOUND)', async () => {
    mockChannelFindUnique.mockResolvedValue(null);

    await expect(
      channelService.updateChannel('00000000-0000-0000-0000-000000000000', SERVER_ID, {
        name: 'ghost',
      }),
    ).rejects.toThrow(TRPCError);

    expect(mockPublish).not.toHaveBeenCalled();
  });
});

// ─── deleteChannel publishes CHANNEL_DELETED ──────────────────────────────────

describe('channelService.deleteChannel — event publishing', () => {
  it('publishes CHANNEL_DELETED with channelId and serverId after delete', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);

    await channelService.deleteChannel(CHANNEL_ID, SERVER_ID);

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:CHANNEL_DELETED',
      expect.objectContaining({
        channelId: CHANNEL_ID,
        serverId: SERVER_ID,
        timestamp: expect.any(String),
      }),
    );
  });

  it('timestamp in CHANNEL_DELETED is a valid ISO 8601 string', async () => {
    mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);

    await channelService.deleteChannel(CHANNEL_ID, SERVER_ID);

    const [, payload] = mockPublish.mock.calls[0] as [string, { timestamp: string }];
    expect(() => new Date(payload.timestamp).toISOString()).not.toThrow();
  });

  it('does NOT publish when channel is not found (NOT_FOUND)', async () => {
    mockChannelFindUnique.mockResolvedValue(null);

    await expect(
      channelService.deleteChannel('00000000-0000-0000-0000-000000000000', SERVER_ID),
    ).rejects.toThrow(TRPCError);

    expect(mockPublish).not.toHaveBeenCalled();
  });
});
