/**
 * Unit tests for publicApiService.ts
 * Issue #290 — Sprint 3 (P5 Testing)
 */

const mockCache = jest.fn(<T extends (...args: never[]) => unknown>(fn: T): T => fn);

jest.mock('react', () => ({
  cache: mockCache,
}));

import { CACHE_DURATION } from '@/lib/constants';
import { ChannelType, ChannelVisibility } from '@/types';
import {
  fetchPublicServer,
  fetchPublicChannel,
  fetchPublicMessages,
  fetchPublicChannels,
  isChannelGuestAccessible,
} from '@/services/publicApiService';

const mockFetch = jest.fn();

global.fetch = mockFetch as unknown as typeof fetch;

function makePublicServerResponse(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id: 'srv-1',
    name: 'Harmony HQ',
    slug: 'harmony-hq',
    iconUrl: 'https://cdn.test/icon.png',
    description: 'Public landing server',
    memberCount: 42,
    createdAt: '2026-02-15T00:00:00.000Z',
    ...overrides,
  };
}

function makePublicChannelResponse(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id: 'ch-1',
    name: 'general',
    slug: 'general',
    serverId: 'srv-1',
    type: 'TEXT',
    visibility: 'PUBLIC_INDEXABLE',
    topic: 'Welcome',
    position: 0,
    createdAt: '2026-02-15T00:00:00.000Z',
    ...overrides,
  };
}

function makePublicMessageResponse(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id: 'msg-1',
    content: 'First public message',
    createdAt: '2026-02-15T10:00:00.000Z',
    editedAt: '2026-02-15T10:05:00.000Z',
    author: { id: 'user-1', username: 'alice' },
    ...overrides,
  };
}

function makeResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('publicApiService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  describe('fetchPublicServer', () => {
    it('maps the public server response and encodes the slug', async () => {
      mockFetch.mockResolvedValue(makeResponse(makePublicServerResponse()));

      const result = await fetchPublicServer('harmony hq');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/public/servers/harmony%20hq',
        { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
      );
      expect(result).toEqual({
        id: 'srv-1',
        name: 'Harmony HQ',
        slug: 'harmony-hq',
        icon: 'https://cdn.test/icon.png',
        description: 'Public landing server',
        memberCount: 42,
        createdAt: '2026-02-15T00:00:00.000Z',
      });
    });

    it.each([403, 404, 500])(
      'returns null when the public server request responds with %s',
      async status => {
        mockFetch.mockResolvedValue(makeResponse({}, { ok: false, status }));

        await expect(fetchPublicServer('missing')).resolves.toBeNull();
      },
    );

    it('returns null when fetching the public server throws', async () => {
      mockFetch.mockRejectedValue(new Error('offline'));

      await expect(fetchPublicServer('missing')).resolves.toBeNull();
    });
  });

  describe('fetchPublicChannel', () => {
    it.each([
      {
        label: 'voice channels and public no-index visibility',
        response: makePublicChannelResponse({
          name: 'help and support',
          slug: 'help-support',
          type: 'VOICE',
          visibility: 'PUBLIC_NO_INDEX',
          topic: null,
          position: 3,
        }),
        serverSlug: 'harmony hq',
        channelSlug: 'help & support',
        expectedType: ChannelType.VOICE,
        expectedVisibility: ChannelVisibility.PUBLIC_NO_INDEX,
        expectedTopic: undefined,
      },
      {
        label: 'announcement channels and public indexable visibility',
        response: makePublicChannelResponse({
          id: 'ch-2',
          type: 'ANNOUNCEMENT',
          visibility: 'PUBLIC_INDEXABLE',
          topic: 'Release notes',
          position: 1,
        }),
        serverSlug: 'harmony-hq',
        channelSlug: 'general',
        expectedType: ChannelType.ANNOUNCEMENT,
        expectedVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
        expectedTopic: 'Release notes',
      },
      {
        label: 'private visibility mapping in a successful payload',
        response: makePublicChannelResponse({
          id: 'ch-private',
          visibility: 'PRIVATE',
        }),
        serverSlug: 'harmony-hq',
        channelSlug: 'general',
        expectedType: ChannelType.TEXT,
        expectedVisibility: ChannelVisibility.PRIVATE,
        expectedTopic: 'Welcome',
      },
      {
        label: 'unknown backend enum values via safe defaults',
        response: makePublicChannelResponse({
          id: 'ch-3',
          type: 'UNRECOGNIZED',
          visibility: 'UNRECOGNIZED',
          topic: 'Start here',
        }),
        serverSlug: 'harmony-hq',
        channelSlug: 'general',
        expectedType: ChannelType.TEXT,
        expectedVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
        expectedTopic: 'Start here',
      },
    ])(
      'maps $label',
      async ({
        response,
        serverSlug,
        channelSlug,
        expectedType,
        expectedVisibility,
        expectedTopic,
      }) => {
        mockFetch.mockResolvedValue(makeResponse(response));

        const result = await fetchPublicChannel(serverSlug, channelSlug);

        expect(mockFetch).toHaveBeenCalledWith(
          `http://localhost:4000/api/public/servers/${encodeURIComponent(serverSlug)}/channels/${encodeURIComponent(channelSlug)}`,
          { cache: 'no-store' },
        );
        expect(result).toEqual({
          channel: {
            ...response,
            type: expectedType,
            visibility: expectedVisibility,
            topic: expectedTopic,
          },
          isPrivate: false,
        });
      },
    );

    it('returns a private marker when the guest hits a private channel', async () => {
      mockFetch.mockResolvedValue(makeResponse({}, { ok: false, status: 403 }));

      await expect(fetchPublicChannel('company', 'internal-hr')).resolves.toEqual({
        isPrivate: true,
      });
    });

    it.each([404, 500])(
      'returns null when the public channel endpoint responds with %s',
      async status => {
        mockFetch.mockResolvedValue(makeResponse({}, { ok: false, status }));

        await expect(fetchPublicChannel('company', 'missing')).resolves.toBeNull();
      },
    );

    it('returns null when the public channel request throws', async () => {
      mockFetch.mockRejectedValue(new Error('network down'));

      await expect(fetchPublicChannel('company', 'general')).resolves.toBeNull();
    });
  });

  describe('fetchPublicMessages', () => {
    it('maps public messages and reports more results when the page is full', async () => {
      mockFetch.mockResolvedValue(
        makeResponse({
          messages: [
            makePublicMessageResponse(),
            makePublicMessageResponse({
              id: 'msg-2',
              content: 'Second public message',
              createdAt: '2026-02-15T11:00:00.000Z',
              editedAt: undefined,
              author: { id: 'user-2', username: 'bob' },
            }),
          ],
          page: 2,
          pageSize: 2,
        }),
      );

      const result = await fetchPublicMessages('c1', 1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/public/channels/c1/messages?page=1',
      );
      expect(result).toEqual({
        messages: [
          {
            id: 'msg-1',
            channelId: 'c1',
            authorId: 'user-1',
            author: { id: 'user-1', username: 'alice' },
            content: 'First public message',
            timestamp: '2026-02-15T10:00:00.000Z',
            editedAt: '2026-02-15T10:05:00.000Z',
          },
          {
            id: 'msg-2',
            channelId: 'c1',
            authorId: 'user-2',
            author: { id: 'user-2', username: 'bob' },
            content: 'Second public message',
            timestamp: '2026-02-15T11:00:00.000Z',
            editedAt: undefined,
          },
        ],
        hasMore: true,
      });
    });

    it('returns hasMore=false when the backend page is not full', async () => {
      mockFetch.mockResolvedValue(
        makeResponse({
          messages: [
            makePublicMessageResponse({
              id: 'msg-3',
              content: 'Only message',
              createdAt: '2026-02-16T10:00:00.000Z',
              editedAt: null,
              author: { id: 'user-3', username: 'charlie' },
            }),
          ],
          page: 1,
          pageSize: 2,
        }),
      );

      const result = await fetchPublicMessages('c1', 2);

      expect(result).toEqual({
        messages: [
          {
            id: 'msg-3',
            channelId: 'c1',
            authorId: 'user-3',
            author: { id: 'user-3', username: 'charlie' },
            content: 'Only message',
            timestamp: '2026-02-16T10:00:00.000Z',
            editedAt: undefined,
          },
        ],
        hasMore: false,
      });
    });

    it('defaults page to 1 and URL-encodes the channel id', async () => {
      mockFetch.mockResolvedValue(
        makeResponse({
          messages: [],
          page: 1,
          pageSize: 2,
        }),
      );

      const result = await fetchPublicMessages('channel/with space');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/public/channels/channel%2Fwith%20space/messages?page=1',
      );
      expect(result).toEqual({
        messages: [],
        hasMore: false,
      });
    });

    it('forwards an explicit page number in the request URL', async () => {
      mockFetch.mockResolvedValue(
        makeResponse({
          messages: [],
          page: 3,
          pageSize: 2,
        }),
      );

      await fetchPublicMessages('c1', 3);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/public/channels/c1/messages?page=3',
      );
    });

    it.each([403, 404, 500])(
      'returns an empty result when the messages request responds with %s',
      async status => {
        mockFetch.mockResolvedValue(makeResponse({}, { ok: false, status }));

        await expect(fetchPublicMessages('channel-3')).resolves.toEqual({
          messages: [],
          hasMore: false,
        });
      },
    );

    it('returns an empty result when the messages request throws', async () => {
      mockFetch.mockRejectedValue(new Error('timeout'));

      await expect(fetchPublicMessages('channel-3')).resolves.toEqual({
        messages: [],
        hasMore: false,
      });
    });
  });

  describe('isChannelGuestAccessible', () => {
    it.each([
      {
        label: 'the channel is public',
        responseBody: makePublicChannelResponse({
          id: 'ch-4',
          type: 'ANNOUNCEMENT',
          visibility: 'PUBLIC_INDEXABLE',
          position: 1,
          createdAt: '2026-02-17T00:00:00.000Z',
        }),
        expected: true,
      },
      {
        label: 'the channel is public but no-index',
        responseBody: makePublicChannelResponse({
          id: 'ch-5',
          visibility: 'PUBLIC_NO_INDEX',
          createdAt: '2026-02-18T00:00:00.000Z',
        }),
        expected: true,
      },
      {
        label: 'the channel is private',
        responseBody: {},
        responseInit: { ok: false, status: 403 },
        expected: false,
      },
      {
        label: 'the channel does not exist',
        responseBody: {},
        responseInit: { ok: false, status: 404 },
        expected: false,
      },
      {
        label: 'the channel lookup fails',
        rejectWith: new Error('network down'),
        expected: false,
      },
    ])(
      'returns $expected when $label',
      async ({ responseBody, responseInit, rejectWith, expected }) => {
        if (rejectWith) {
          mockFetch.mockRejectedValue(rejectWith);
        } else {
          mockFetch.mockResolvedValue(makeResponse(responseBody, responseInit));
        }

        await expect(isChannelGuestAccessible('harmony-hq', 'general')).resolves.toBe(expected);
      },
    );
  });

  describe('fetchPublicChannels', () => {
    const makeChannelListResponse = (channels: unknown[]) => ({ channels });

    it('URL-encodes the server slug', async () => {
      mockFetch.mockResolvedValue(makeResponse(makeChannelListResponse([])));
      await fetchPublicChannels('my server/slug');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('my%20server%2Fslug'),
        expect.anything(),
      );
    });

    it('returns [] on a non-OK response', async () => {
      mockFetch.mockResolvedValue(makeResponse({}, { status: 404 }));
      await expect(fetchPublicChannels('missing')).resolves.toEqual([]);
    });

    it('returns [] on a network error', async () => {
      mockFetch.mockRejectedValue(new Error('network'));
      await expect(fetchPublicChannels('harmony-hq')).resolves.toEqual([]);
    });

    it('maps id, name, slug, type, and topic from the response', async () => {
      mockFetch.mockResolvedValue(
        makeResponse(
          makeChannelListResponse([
            { id: 'chn-1', name: 'general', slug: 'general', type: 'TEXT', topic: 'Chat here' },
            { id: 'chn-2', name: 'voice', slug: 'voice', type: 'VOICE', topic: null },
            { id: 'chn-3', name: 'news', slug: 'news', type: 'ANNOUNCEMENT', topic: undefined },
          ]),
        ),
      );
      const result = await fetchPublicChannels('harmony-hq');
      expect(result).toEqual([
        { id: 'chn-1', name: 'general', slug: 'general', type: ChannelType.TEXT, topic: 'Chat here' },
        { id: 'chn-2', name: 'voice', slug: 'voice', type: ChannelType.VOICE, topic: undefined },
        { id: 'chn-3', name: 'news', slug: 'news', type: ChannelType.ANNOUNCEMENT, topic: undefined },
      ]);
    });
  });
});
