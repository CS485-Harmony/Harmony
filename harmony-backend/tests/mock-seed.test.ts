import { ChannelType } from '@prisma/client';
import {
  assertMockSeedAllowed,
  buildMockSeedData,
  legacyIdToUuid,
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
