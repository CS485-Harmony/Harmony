/**
 * Unit tests for channelService.ts
 * Issue #266 — Sprint 3 (P5 Testing)
 */

// Mock next/headers before any imports (required by trpc-client)
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock the trpc-client module used by channelService
jest.mock('@/lib/trpc-client', () => ({
  publicGet: jest.fn(),
  trpcQuery: jest.fn(),
  trpcMutate: jest.fn(),
  TrpcHttpError: class TrpcHttpError extends Error {
    procedure: string;
    status: number;
    constructor(procedure: string, status: number, body: string) {
      super(body);
      this.name = 'TrpcHttpError';
      this.procedure = procedure;
      this.status = status;
    }
  },
}));

// Mock react cache to pass through
jest.mock('react', () => ({
  cache: <T extends (...args: never[]) => unknown>(fn: T): T => fn,
}));

import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';
import { ChannelType } from '@/types';
import {
  getChannels,
  getChannel,
  updateVisibility,
  updateChannel,
  createChannel,
  getAuditLog,
  deleteChannel,
  ChannelVisibility,
} from '@/services/channelService';

const mockedPublicGet = jest.mocked(publicGet);
const mockedTrpcQuery = jest.mocked(trpcQuery);
const mockedTrpcMutate = jest.mocked(trpcMutate);

// ─── Test fixtures ───────────────────────────────────────────────────────────

function makeRawChannel(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'ch-1',
    serverId: 'srv-1',
    name: 'general',
    slug: 'general',
    type: 'TEXT',
    visibility: 'PUBLIC_INDEXABLE',
    topic: 'Welcome',
    position: 0,
    description: 'The general channel',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    ...overrides,
  };
}

function makeRawAuditEntry(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'audit-1',
    channelId: 'ch-1',
    actorId: 'user-1',
    action: 'VISIBILITY_CHANGE',
    oldValue: { visibility: 'PRIVATE' },
    newValue: { visibility: 'PUBLIC_INDEXABLE' },
    timestamp: '2025-06-01T12:00:00.000Z',
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
    ...overrides,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('channelService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── getChannels ──────────────────────────────────────────────────────────

  describe('getChannels', () => {
    it('returns mapped channels from tRPC query', async () => {
      const raw = [makeRawChannel(), makeRawChannel({ id: 'ch-2', name: 'random', slug: 'random' })];
      mockedTrpcQuery.mockResolvedValue(raw);

      const result = await getChannels('srv-1');

      expect(mockedTrpcQuery).toHaveBeenCalledWith('channel.getChannels', { serverId: 'srv-1' });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 'ch-1', name: 'general' });
      expect(result[1]).toMatchObject({ id: 'ch-2', name: 'random' });
    });

    it('returns empty array when API returns null/undefined', async () => {
      mockedTrpcQuery.mockResolvedValue(null);

      const result = await getChannels('srv-1');

      expect(result).toEqual([]);
    });

    it('propagates errors to the caller', async () => {
      mockedTrpcQuery.mockRejectedValue(new Error('Network error'));

      await expect(getChannels('srv-1')).rejects.toThrow('Network error');
    });
  });

  // ── getChannel ───────────────────────────────────────────────────────────

  describe('getChannel', () => {
    it('returns channel from public endpoint when found', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never) // server lookup
        .mockResolvedValueOnce({
          channels: [makeRawChannel({ serverId: undefined, visibility: undefined })],
        } as never); // public channels

      const result = await getChannel('my-server', 'general');

      expect(result).toMatchObject({
        id: 'ch-1',
        serverId: 'srv-1',
        slug: 'general',
        visibility: 'PUBLIC_INDEXABLE',
      });
    });

    it('returns null when server is not found', async () => {
      mockedPublicGet.mockResolvedValueOnce(null);

      const result = await getChannel('missing-server', 'general');

      expect(result).toBeNull();
      expect(mockedTrpcQuery).not.toHaveBeenCalled();
    });

    it('falls back to tRPC when public endpoint has no matching channel', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never) // server lookup
        .mockResolvedValueOnce({ channels: [] } as never); // no public match
      mockedTrpcQuery.mockResolvedValue(makeRawChannel({ visibility: 'PRIVATE' }));

      const result = await getChannel('my-server', 'general');

      expect(mockedTrpcQuery).toHaveBeenCalledWith('channel.getChannel', {
        serverId: 'srv-1',
        serverSlug: 'my-server',
        channelSlug: 'general',
      });
      expect(result).toMatchObject({ id: 'ch-1', visibility: 'PRIVATE' });
    });

    it('falls back to tRPC when public endpoint throws', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never) // server lookup
        .mockRejectedValueOnce(new Error('Public API error: 500')); // public fails
      mockedTrpcQuery.mockResolvedValue(makeRawChannel());

      const result = await getChannel('my-server', 'general');

      expect(mockedTrpcQuery).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 'ch-1' });
    });

    it('falls back to tRPC when public endpoint returns null', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never) // server lookup
        .mockResolvedValueOnce(null); // public returns null
      mockedTrpcQuery.mockResolvedValue(makeRawChannel());

      const result = await getChannel('my-server', 'general');

      expect(mockedTrpcQuery).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 'ch-1' });
    });

    it('returns null when tRPC fallback returns null', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never)
        .mockResolvedValueOnce({ channels: [] } as never);
      mockedTrpcQuery.mockResolvedValue(null);

      const result = await getChannel('my-server', 'general');

      expect(result).toBeNull();
    });

    it('returns null and logs error when tRPC fallback throws', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never)
        .mockResolvedValueOnce({ channels: [] } as never);
      mockedTrpcQuery.mockRejectedValue(new Error('Auth failed'));

      const result = await getChannel('my-server', 'general');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('my-server/general'),
        expect.any(Error),
      );
    });

    it('propagates server-lookup rejection (uncaught path)', async () => {
      mockedPublicGet.mockRejectedValueOnce(new Error('DNS failure'));

      await expect(getChannel('my-server', 'general')).rejects.toThrow('DNS failure');
      expect(mockedTrpcQuery).not.toHaveBeenCalled();
    });

    it('fills default position=0 and createdAt=epoch for public hit missing those fields', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never)
        .mockResolvedValueOnce({
          channels: [
            {
              id: 'ch-pub',
              name: 'public-chan',
              slug: 'public-chan',
              type: 'TEXT',
              // position and createdAt intentionally omitted
            },
          ],
        } as never);

      const result = await getChannel('my-server', 'public-chan');

      expect(result).toMatchObject({
        id: 'ch-pub',
        serverId: 'srv-1',
        visibility: 'PUBLIC_INDEXABLE',
        position: 0,
        createdAt: new Date(0).toISOString(),
      });
    });

    it('encodes server slug in URL', async () => {
      mockedPublicGet.mockResolvedValueOnce(null);

      await getChannel('my server', 'general');

      expect(mockedPublicGet).toHaveBeenCalledWith('/servers/my%20server');
    });
  });

  // ── updateVisibility ─────────────────────────────────────────────────────

  describe('updateVisibility', () => {
    it.each([
      ['PRIVATE', ChannelVisibility.PRIVATE],
      ['PUBLIC_INDEXABLE', ChannelVisibility.PUBLIC_INDEXABLE],
      ['PUBLIC_NO_INDEX', ChannelVisibility.PUBLIC_NO_INDEX],
    ] as const)('forwards %s through the mutation payload', async (_label, value) => {
      mockedTrpcMutate.mockResolvedValue(undefined);

      await updateVisibility('ch-1', value, 'srv-1');

      expect(mockedTrpcMutate).toHaveBeenCalledWith('channel.setVisibility', {
        serverId: 'srv-1',
        channelId: 'ch-1',
        visibility: value,
      });
    });

    it('propagates mutation errors', async () => {
      mockedTrpcMutate.mockRejectedValue(new Error('Forbidden'));

      await expect(
        updateVisibility('ch-1', ChannelVisibility.PUBLIC_INDEXABLE, 'srv-1'),
      ).rejects.toThrow('Forbidden');
    });
  });

  // ── updateChannel ────────────────────────────────────────────────────────

  describe('updateChannel', () => {
    it('sends name and topic when both provided', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawChannel({ name: 'updated', topic: 'new topic' }));

      const result = await updateChannel('ch-1', 'srv-1', { name: 'updated', topic: 'new topic' });

      expect(mockedTrpcMutate).toHaveBeenCalledWith('channel.updateChannel', {
        serverId: 'srv-1',
        channelId: 'ch-1',
        name: 'updated',
        topic: 'new topic',
      });
      expect(result).toMatchObject({ name: 'updated', topic: 'new topic' });
    });

    it('sends only name when topic is not provided', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawChannel({ name: 'renamed' }));

      await updateChannel('ch-1', 'srv-1', { name: 'renamed' });

      expect(mockedTrpcMutate).toHaveBeenCalledWith('channel.updateChannel', {
        serverId: 'srv-1',
        channelId: 'ch-1',
        name: 'renamed',
      });
    });

    it('sends only topic when name is not provided', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawChannel({ topic: 'new topic' }));

      await updateChannel('ch-1', 'srv-1', { topic: 'new topic' });

      expect(mockedTrpcMutate).toHaveBeenCalledWith('channel.updateChannel', {
        serverId: 'srv-1',
        channelId: 'ch-1',
        topic: 'new topic',
      });
    });

    it('sends neither name nor topic when patch is empty', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawChannel());

      await updateChannel('ch-1', 'srv-1', {});

      expect(mockedTrpcMutate).toHaveBeenCalledWith('channel.updateChannel', {
        serverId: 'srv-1',
        channelId: 'ch-1',
      });
    });
  });

  // ── createChannel ────────────────────────────────────────────────────────

  describe('createChannel', () => {
    it('sends all channel fields and returns mapped channel', async () => {
      const input = {
        serverId: 'srv-1',
        name: 'announcements',
        slug: 'announcements',
        type: ChannelType.ANNOUNCEMENT,
        visibility: ChannelVisibility.PUBLIC_INDEXABLE,
        topic: 'News',
        position: 2,
      };
      mockedTrpcMutate.mockResolvedValue(makeRawChannel({ ...input, id: 'ch-new' }));

      const result = await createChannel(input);

      expect(mockedTrpcMutate).toHaveBeenCalledWith('channel.createChannel', {
        serverId: 'srv-1',
        name: 'announcements',
        slug: 'announcements',
        type: 'ANNOUNCEMENT',
        visibility: 'PUBLIC_INDEXABLE',
        topic: 'News',
        position: 2,
      });
      expect(result).toMatchObject({ id: 'ch-new', name: 'announcements' });
    });

    it('sends topic as undefined when omitted from input', async () => {
      const input = {
        serverId: 'srv-1',
        name: 'no-topic',
        slug: 'no-topic',
        type: ChannelType.TEXT,
        visibility: ChannelVisibility.PUBLIC_INDEXABLE,
        position: 0,
      };
      mockedTrpcMutate.mockResolvedValue(makeRawChannel({ ...input, id: 'ch-no-topic' }));

      await createChannel(input);

      expect(mockedTrpcMutate).toHaveBeenCalledWith('channel.createChannel', {
        serverId: 'srv-1',
        name: 'no-topic',
        slug: 'no-topic',
        type: 'TEXT',
        visibility: 'PUBLIC_INDEXABLE',
        topic: undefined,
        position: 0,
      });
    });

    it('does not forward description to the mutation payload', async () => {
      const input = {
        serverId: 'srv-1',
        name: 'with-desc',
        slug: 'with-desc',
        type: ChannelType.TEXT,
        visibility: ChannelVisibility.PRIVATE,
        description: 'Should not appear in payload',
        position: 1,
      };
      mockedTrpcMutate.mockResolvedValue(makeRawChannel({ ...input, id: 'ch-desc' }));

      await createChannel(input);

      const payload = mockedTrpcMutate.mock.calls[0][1] as Record<string, unknown>;
      expect(payload).not.toHaveProperty('description');
    });

    it.each([
      ['PUBLIC_NO_INDEX', ChannelVisibility.PUBLIC_NO_INDEX],
      ['PRIVATE', ChannelVisibility.PRIVATE],
    ] as const)('forwards %s visibility through the mutation payload', async (_label, vis) => {
      const input = {
        serverId: 'srv-1',
        name: 'vis-test',
        slug: 'vis-test',
        type: ChannelType.TEXT,
        visibility: vis,
        position: 0,
      };
      mockedTrpcMutate.mockResolvedValue(makeRawChannel({ ...input, id: 'ch-vis' }));

      await createChannel(input);

      expect(mockedTrpcMutate).toHaveBeenCalledWith(
        'channel.createChannel',
        expect.objectContaining({ visibility: vis }),
      );
    });

    it('propagates creation errors', async () => {
      mockedTrpcMutate.mockRejectedValue(new Error('Duplicate slug'));

      await expect(
        createChannel({
          serverId: 'srv-1',
          name: 'general',
          slug: 'general',
          type: ChannelType.TEXT,
          visibility: ChannelVisibility.PUBLIC_INDEXABLE,
          position: 0,
        }),
      ).rejects.toThrow('Duplicate slug');
    });
  });

  // ── getAuditLog ──────────────────────────────────────────────────────────

  describe('getAuditLog', () => {
    it('returns mapped audit log entries with total', async () => {
      mockedTrpcQuery.mockResolvedValue({
        entries: [makeRawAuditEntry()],
        total: 1,
      });

      const result = await getAuditLog('srv-1', 'ch-1');

      expect(mockedTrpcQuery).toHaveBeenCalledWith('channel.getAuditLog', {
        serverId: 'srv-1',
        channelId: 'ch-1',
      });
      expect(result.total).toBe(1);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0]).toMatchObject({
        id: 'audit-1',
        action: 'VISIBILITY_CHANGE',
        actorId: 'user-1',
      });
    });

    it('passes pagination options to the query', async () => {
      mockedTrpcQuery.mockResolvedValue({ entries: [], total: 0 });

      await getAuditLog('srv-1', 'ch-1', { limit: 10, offset: 20, startDate: '2025-01-01' });

      expect(mockedTrpcQuery).toHaveBeenCalledWith('channel.getAuditLog', {
        serverId: 'srv-1',
        channelId: 'ch-1',
        limit: 10,
        offset: 20,
        startDate: '2025-01-01',
      });
    });

    it('propagates query errors', async () => {
      mockedTrpcQuery.mockRejectedValue(new Error('Unauthorized'));

      await expect(getAuditLog('srv-1', 'ch-1')).rejects.toThrow('Unauthorized');
    });
  });

  // ── deleteChannel ────────────────────────────────────────────────────────

  describe('deleteChannel', () => {
    it('calls tRPC mutate and returns true', async () => {
      mockedTrpcMutate.mockResolvedValue(undefined);

      const result = await deleteChannel('ch-1', 'srv-1');

      expect(mockedTrpcMutate).toHaveBeenCalledWith('channel.deleteChannel', {
        serverId: 'srv-1',
        channelId: 'ch-1',
      });
      expect(result).toBe(true);
    });

    it('propagates deletion errors', async () => {
      mockedTrpcMutate.mockRejectedValue(new Error('Not found'));

      await expect(deleteChannel('ch-1', 'srv-1')).rejects.toThrow('Not found');
    });
  });

  // ── toFrontendChannel (tested indirectly) ────────────────────────────────

  describe('toFrontendChannel (via getChannels)', () => {
    it('maps all fields correctly from raw backend shape', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawChannel()]);

      const [channel] = await getChannels('srv-1');

      expect(channel).toEqual({
        id: 'ch-1',
        serverId: 'srv-1',
        name: 'general',
        slug: 'general',
        type: 'TEXT',
        visibility: 'PUBLIC_INDEXABLE',
        topic: 'Welcome',
        position: 0,
        description: 'The general channel',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-02T00:00:00.000Z',
      });
    });

    it('defaults position to 0 when missing', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawChannel({ position: undefined })]);

      const [channel] = await getChannels('srv-1');

      expect(channel.position).toBe(0);
    });

    it('sets topic to undefined when missing', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawChannel({ topic: undefined })]);

      const [channel] = await getChannels('srv-1');

      expect(channel.topic).toBeUndefined();
    });

    it('warns on missing required fields', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawChannel({ id: 123, serverId: null, slug: undefined, createdAt: 456 }),
      ]);

      await getChannels('srv-1');

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or non-string "id"'));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or non-string "serverId"'));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or non-string "slug"'));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or non-string "createdAt"'));
    });
  });

  // ── toAuditLogEntry (tested indirectly) ──────────────────────────────────

  describe('toAuditLogEntry (via getAuditLog)', () => {
    it('maps all fields correctly from raw backend shape', async () => {
      mockedTrpcQuery.mockResolvedValue({
        entries: [makeRawAuditEntry()],
        total: 1,
      });

      const { entries } = await getAuditLog('srv-1', 'ch-1');

      expect(entries[0]).toEqual({
        id: 'audit-1',
        channelId: 'ch-1',
        actorId: 'user-1',
        action: 'VISIBILITY_CHANGE',
        oldValue: { visibility: 'PRIVATE' },
        newValue: { visibility: 'PUBLIC_INDEXABLE' },
        timestamp: '2025-06-01T12:00:00.000Z',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      });
    });

    it('warns on missing required string fields', async () => {
      mockedTrpcQuery.mockResolvedValue({
        entries: [makeRawAuditEntry({ id: 999, channelId: null, actorId: undefined, action: 42 })],
        total: 1,
      });

      await getAuditLog('srv-1', 'ch-1');

      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or non-string "id"'));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or non-string "channelId"'));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or non-string "actorId"'));
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or non-string "action"'));
    });

    it('defaults to epoch timestamp when timestamp is invalid', async () => {
      mockedTrpcQuery.mockResolvedValue({
        entries: [makeRawAuditEntry({ timestamp: 'not-a-date' })],
        total: 1,
      });

      const { entries } = await getAuditLog('srv-1', 'ch-1');

      expect(entries[0].timestamp).toBe(new Date(0).toISOString());
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('missing or invalid "timestamp"'),
        'not-a-date',
      );
    });

    it('defaults to epoch timestamp when timestamp is missing', async () => {
      mockedTrpcQuery.mockResolvedValue({
        entries: [makeRawAuditEntry({ timestamp: undefined })],
        total: 1,
      });

      const { entries } = await getAuditLog('srv-1', 'ch-1');

      expect(entries[0].timestamp).toBe(new Date(0).toISOString());
    });
  });

  // ── ChannelVisibility re-export ──────────────────────────────────────────

  describe('ChannelVisibility re-export', () => {
    it('exposes all visibility enum values', () => {
      expect(ChannelVisibility.PUBLIC_INDEXABLE).toBe('PUBLIC_INDEXABLE');
      expect(ChannelVisibility.PUBLIC_NO_INDEX).toBe('PUBLIC_NO_INDEX');
      expect(ChannelVisibility.PRIVATE).toBe('PRIVATE');
    });
  });
});
