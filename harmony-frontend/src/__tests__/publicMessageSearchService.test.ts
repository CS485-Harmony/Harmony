import {
  searchPublicChannelMessages,
  type PublicMessageSearchResponse,
} from '@/services/publicMessageSearchService';

const mockFetch = jest.fn();

global.fetch = mockFetch as unknown as typeof fetch;

function makeResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('publicMessageSearchService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it('searches the current public channel with URL-encoded channel and query values', async () => {
    const payload: PublicMessageSearchResponse = {
      query: 'Guest Search',
      limit: 20,
      results: [
        {
          id: 'msg-1',
          content: 'Guest Search is available now',
          context: 'Guest Search is available now',
          createdAt: '2026-05-01T12:00:00.000Z',
          editedAt: null,
          author: { id: 'user-1', username: 'alice' },
        },
      ],
    };
    mockFetch.mockResolvedValue(makeResponse(payload));

    await expect(
      searchPublicChannelMessages('channel/with space', 'Guest Search'),
    ).resolves.toEqual(payload);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/public/channels/channel%2Fwith%20space/messages/search?q=Guest%20Search',
      { cache: 'no-store' },
    );
  });

  it('returns an empty result without calling fetch for blank queries', async () => {
    await expect(searchPublicChannelMessages('channel-1', '   ')).resolves.toEqual({
      query: '',
      limit: 20,
      results: [],
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns an empty result when the backend rejects or the request fails', async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({}, { ok: false, status: 404 }));

    await expect(searchPublicChannelMessages('channel-1', 'missing')).resolves.toEqual({
      query: 'missing',
      limit: 20,
      results: [],
    });

    mockFetch.mockRejectedValueOnce(new Error('network down'));

    await expect(searchPublicChannelMessages('channel-1', 'offline')).resolves.toEqual({
      query: 'offline',
      limit: 20,
      results: [],
    });
  });
});
