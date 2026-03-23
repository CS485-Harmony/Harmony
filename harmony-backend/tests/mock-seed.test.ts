import { ChannelType, PrismaClient } from '@prisma/client';
import {
  assertMockSeedAllowed,
  assertNoUniqueConflicts,
  buildMockSeedData,
  legacyIdToUuid,
  RawSnapshot,
} from '../src/dev/mockSeed';

describe('legacyIdToUuid', () => {
  it('returns a stable UUID for the same legacy id', () => {
    expect(legacyIdToUuid('user-001')).toBe(legacyIdToUuid('user-001'));
  });

  it('returns different UUIDs for different legacy ids', () => {
    expect(legacyIdToUuid('user-001')).not.toBe(legacyIdToUuid('user-002'));
  });

  it('returns a UUID-shaped value', () => {
    expect(legacyIdToUuid('server-001')).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});

describe('buildMockSeedData', () => {
  const data = buildMockSeedData();

  it('keeps the frozen mock dataset counts', () => {
    expect(data.users).toHaveLength(10);
    expect(data.servers).toHaveLength(3);
    expect(data.channels).toHaveLength(25);
    expect(data.messages).toHaveLength(660);
  });

  it('preserves server slugs and derives public visibility from channel data', () => {
    expect(data.servers.map((server) => server.slug)).toEqual([
      'harmony-hq',
      'open-source-hub',
      'design-lab',
    ]);
    expect(data.servers.every((server) => server.isPublic === true)).toBe(true);
  });

  it('maps all foreign keys to deterministic UUIDs', () => {
    const userIds = new Set(data.users.map((user) => user.id));
    const serverIds = new Set(data.servers.map((server) => server.id));
    const channelIds = new Set(data.channels.map((channel) => channel.id));

    expect(data.channels.every((channel) => serverIds.has(channel.serverId))).toBe(true);
    expect(data.messages.every((message) => channelIds.has(message.channelId))).toBe(true);
    expect(data.messages.every((message) => userIds.has(message.authorId))).toBe(true);
  });

  it('sets synthetic email and placeholder passwordHash for every user', () => {
    expect(data.users.every((user) => user.email === `${user.username}@mock.harmony.test`)).toBe(
      true,
    );
    // alice_admin is user-001 in mock-seed-data.json — the only loginable mock account.
    // Identified by username here because mapped users don't carry the raw JSON id.
    // Keep in sync with the ALICE_ADMIN_HASH constant in mockSeed.ts.
    const alice = data.users.find((u) => u.username === 'alice_admin');
    const others = data.users.filter((u) => u.username !== 'alice_admin');
    expect(alice?.passwordHash).toMatch(/^\$2[ab]\$\d+\$/);
    expect(others.every((u) => u.passwordHash === '!')).toBe(true);
  });

  it('keeps voice channels free of messages', () => {
    const voiceChannelIds = new Set(
      data.channels
        .filter((channel) => channel.type === ChannelType.VOICE)
        .map((channel) => channel.id),
    );

    expect(data.messages.some((message) => voiceChannelIds.has(message.channelId))).toBe(false);
  });
});

describe('assertMockSeedAllowed', () => {
  it('rejects production execution without an explicit override', () => {
    expect(() => assertMockSeedAllowed({ NODE_ENV: 'production' })).toThrow(
      'Mock seed is disabled in production.',
    );
  });

  it('allows non-production execution by default', () => {
    expect(() => assertMockSeedAllowed({ NODE_ENV: 'test' })).not.toThrow();
  });

  it('allows explicit production override', () => {
    expect(() =>
      assertMockSeedAllowed({
        NODE_ENV: 'production',
        HARMONY_ALLOW_MOCK_SEED: 'true',
      }),
    ).not.toThrow();
  });
});

describe('assertNoUniqueConflicts', () => {
  // Minimal raw snapshot with one user and one server so fixtures stay small.
  const minimalRaw = {
    users: [
      { id: 'u1', username: 'alice', displayName: 'Alice', avatar: '', status: '', role: '' },
    ],
    servers: [
      {
        id: 's1',
        name: 'Test',
        slug: 'test-server',
        icon: '',
        ownerId: 'u1',
        description: '',
        memberCount: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
    channels: [],
    messages: [],
  };
  const minimalData = buildMockSeedData(minimalRaw as RawSnapshot);

  const expectedUserId = legacyIdToUuid('u1');
  const expectedEmail = 'alice@mock.harmony.test';
  const expectedServerId = legacyIdToUuid('s1');

  function makeDb(
    overrides: {
      usersByUsername?: { id: string; username: string }[];
      usersByEmail?: { id: string; email: string }[];
      servers?: { id: string; slug: string }[];
      channels?: { id: string; serverId: string; slug: string }[];
    } = {},
  ): PrismaClient {
    const { usersByUsername = [], usersByEmail = [], servers = [], channels = [] } = overrides;

    return {
      user: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce(usersByUsername)
          .mockResolvedValueOnce(usersByEmail),
      },
      server: { findMany: jest.fn().mockResolvedValue(servers) },
      channel: { findMany: jest.fn().mockResolvedValue(channels) },
    } as unknown as PrismaClient;
  }

  it('resolves without throwing when the database is empty', async () => {
    await expect(
      assertNoUniqueConflicts(makeDb(), minimalRaw as RawSnapshot, minimalData),
    ).resolves.toBeUndefined();
  });

  it('resolves without throwing when existing rows match expected UUIDs', async () => {
    const db = makeDb({
      usersByUsername: [{ id: expectedUserId, username: 'alice' }],
      usersByEmail: [{ id: expectedUserId, email: expectedEmail }],
      servers: [{ id: expectedServerId, slug: 'test-server' }],
    });
    await expect(
      assertNoUniqueConflicts(db, minimalRaw as RawSnapshot, minimalData),
    ).resolves.toBeUndefined();
  });

  it('throws when a username exists with a different UUID', async () => {
    const db = makeDb({
      usersByUsername: [{ id: 'aaaaaaaa-0000-5000-8000-000000000000', username: 'alice' }],
    });
    await expect(
      assertNoUniqueConflicts(db, minimalRaw as RawSnapshot, minimalData),
    ).rejects.toThrow(/username/);
  });

  it('throws when an email exists with a different UUID', async () => {
    const db = makeDb({
      usersByEmail: [{ id: 'aaaaaaaa-0000-5000-8000-000000000000', email: expectedEmail }],
    });
    await expect(
      assertNoUniqueConflicts(db, minimalRaw as RawSnapshot, minimalData),
    ).rejects.toThrow(/email/);
  });
});
