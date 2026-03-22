/**
 * message.service.events.test.ts — Issue #180
 *
 * Verifies that message.service publishes Redis events after each mutating operation.
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
    MESSAGE_CREATED: 'harmony:MESSAGE_CREATED',
    MESSAGE_EDITED: 'harmony:MESSAGE_EDITED',
    MESSAGE_DELETED: 'harmony:MESSAGE_DELETED',
  },
}));

// ─── Mock Prisma ───────────────────────────────────────────────────────────────

const mockMessageCreate = jest.fn();
const mockMessageUpdate = jest.fn();
const mockMessageUpdateMany = jest.fn();
const mockMessageFindUnique = jest.fn();
const mockChannelFindUnique = jest.fn();

const mockExecuteRaw = jest.fn().mockResolvedValue(1);

// $transaction: execute the callback with the same mock client
const mockTransaction = jest.fn((cb: (tx: unknown) => Promise<unknown>) =>
  cb({
    message: {
      create: mockMessageCreate,
      update: mockMessageUpdate,
      updateMany: mockMessageUpdateMany,
      findUnique: mockMessageFindUnique,
    },
    channel: {
      findUnique: mockChannelFindUnique,
    },
    $executeRaw: mockExecuteRaw,
  }),
);

jest.mock('../src/db/prisma', () => ({
  prisma: {
    message: {
      create: mockMessageCreate,
      update: mockMessageUpdate,
      updateMany: mockMessageUpdateMany,
      findUnique: mockMessageFindUnique,
    },
    channel: {
      findUnique: mockChannelFindUnique,
    },
    $transaction: mockTransaction,
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
    getOrRevalidate: jest.fn(),
  },
  CacheTTL: { channelMessages: 60 },
  sanitizeKeySegment: (s: string) => s,
}));

// ─── Mock permissionService ────────────────────────────────────────────────────

jest.mock('../src/services/permission.service', () => ({
  permissionService: {
    checkPermission: jest.fn().mockResolvedValue(false),
  },
}));

import { messageService } from '../src/services/message.service';

// ─── Fixture data ─────────────────────────────────────────────────────────────

const CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
const SERVER_ID = '550e8400-e29b-41d4-a716-446655440002';
const AUTHOR_ID = '550e8400-e29b-41d4-a716-446655440003';
const MESSAGE_ID = '550e8400-e29b-41d4-a716-446655440004';

const MOCK_CHANNEL = { id: CHANNEL_ID, serverId: SERVER_ID };

const MOCK_MESSAGE = {
  id: MESSAGE_ID,
  channelId: CHANNEL_ID,
  authorId: AUTHOR_ID,
  content: 'hello',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  editedAt: null,
  isDeleted: false,
  pinned: false,
  pinnedAt: null,
  parentMessageId: null,
  replyCount: 0,
  author: { id: AUTHOR_ID, username: 'testuser', displayName: 'Test User', avatarUrl: null },
  attachments: [],
  channel: { serverId: SERVER_ID },
};

const MOCK_UPDATED_MESSAGE = {
  ...MOCK_MESSAGE,
  content: 'edited',
  editedAt: new Date('2024-01-01T01:00:00.000Z'),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockChannelFindUnique.mockResolvedValue(MOCK_CHANNEL);
  mockMessageCreate.mockResolvedValue(MOCK_MESSAGE);
  mockMessageFindUnique.mockResolvedValue(MOCK_MESSAGE);
  mockMessageUpdate.mockResolvedValue(MOCK_UPDATED_MESSAGE);
});

// ─── sendMessage publishes MESSAGE_CREATED ─────────────────────────────────────

describe('messageService.sendMessage — event publishing', () => {
  it('publishes MESSAGE_CREATED with correct channelId, messageId, authorId after send', async () => {
    await messageService.sendMessage({
      serverId: SERVER_ID,
      channelId: CHANNEL_ID,
      authorId: AUTHOR_ID,
      content: 'hello',
    });

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:MESSAGE_CREATED',
      expect.objectContaining({
        messageId: MESSAGE_ID,
        channelId: CHANNEL_ID,
        authorId: AUTHOR_ID,
        timestamp: expect.any(String),
      }),
    );
  });

  it('timestamp in MESSAGE_CREATED is a valid ISO 8601 string', async () => {
    await messageService.sendMessage({
      serverId: SERVER_ID,
      channelId: CHANNEL_ID,
      authorId: AUTHOR_ID,
      content: 'hello',
    });

    const [, payload] = mockPublish.mock.calls[0] as [string, { timestamp: string }];
    expect(() => new Date(payload.timestamp).toISOString()).not.toThrow();
  });

  it('does NOT publish when channel validation throws (NOT_FOUND)', async () => {
    mockChannelFindUnique.mockResolvedValue(null);

    await expect(
      messageService.sendMessage({
        serverId: SERVER_ID,
        channelId: '00000000-0000-0000-0000-000000000000',
        authorId: AUTHOR_ID,
        content: 'ghost',
      }),
    ).rejects.toThrow(TRPCError);

    expect(mockPublish).not.toHaveBeenCalled();
  });
});

// ─── editMessage publishes MESSAGE_EDITED ─────────────────────────────────────

describe('messageService.editMessage — event publishing', () => {
  it('publishes MESSAGE_EDITED with correct messageId and channelId after edit', async () => {
    await messageService.editMessage({
      serverId: SERVER_ID,
      messageId: MESSAGE_ID,
      authorId: AUTHOR_ID,
      content: 'edited',
    });

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:MESSAGE_EDITED',
      expect.objectContaining({
        messageId: MESSAGE_ID,
        channelId: CHANNEL_ID,
        timestamp: expect.any(String),
      }),
    );
  });

  it('timestamp in MESSAGE_EDITED matches the updated editedAt', async () => {
    await messageService.editMessage({
      serverId: SERVER_ID,
      messageId: MESSAGE_ID,
      authorId: AUTHOR_ID,
      content: 'edited',
    });

    const [, payload] = mockPublish.mock.calls[0] as [string, { timestamp: string }];
    // Should match MOCK_UPDATED_MESSAGE.editedAt ISO string
    expect(payload.timestamp).toBe(MOCK_UPDATED_MESSAGE.editedAt!.toISOString());
  });

  it('does NOT publish when author check fails (FORBIDDEN)', async () => {
    // Simulate different author
    mockMessageFindUnique.mockResolvedValue({
      ...MOCK_MESSAGE,
      authorId: 'different-user-id',
    });

    await expect(
      messageService.editMessage({
        serverId: SERVER_ID,
        messageId: MESSAGE_ID,
        authorId: AUTHOR_ID,
        content: 'hijacked',
      }),
    ).rejects.toThrow(TRPCError);

    expect(mockPublish).not.toHaveBeenCalled();
  });
});

// ─── deleteMessage publishes MESSAGE_DELETED ───────────────────────────────────

describe('messageService.deleteMessage — event publishing', () => {
  it('publishes MESSAGE_DELETED with correct messageId and channelId after delete', async () => {
    await messageService.deleteMessage({
      messageId: MESSAGE_ID,
      actorId: AUTHOR_ID,
      serverId: SERVER_ID,
    });

    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(mockPublish).toHaveBeenCalledWith(
      'harmony:MESSAGE_DELETED',
      expect.objectContaining({
        messageId: MESSAGE_ID,
        channelId: CHANNEL_ID,
        timestamp: expect.any(String),
      }),
    );
  });

  it('timestamp in MESSAGE_DELETED is a valid ISO 8601 string', async () => {
    await messageService.deleteMessage({
      messageId: MESSAGE_ID,
      actorId: AUTHOR_ID,
      serverId: SERVER_ID,
    });

    const [, payload] = mockPublish.mock.calls[0] as [string, { timestamp: string }];
    expect(() => new Date(payload.timestamp).toISOString()).not.toThrow();
  });

  it('does NOT publish when message lookup fails (NOT_FOUND)', async () => {
    mockMessageFindUnique.mockResolvedValue(null);

    await expect(
      messageService.deleteMessage({
        messageId: '00000000-0000-0000-0000-000000000000',
        actorId: AUTHOR_ID,
        serverId: SERVER_ID,
      }),
    ).rejects.toThrow(TRPCError);

    expect(mockPublish).not.toHaveBeenCalled();
  });
});
