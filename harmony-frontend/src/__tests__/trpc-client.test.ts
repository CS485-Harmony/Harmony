jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('../lib/frontend-logger', () => ({
  createFrontendLogger: jest.fn(() => mockLogger),
}));

import { cookies } from 'next/headers';
import { publicGet, TrpcHttpError, trpcMutate, trpcQuery } from '../lib/trpc-client';

const mockedCookies = jest.mocked(cookies);
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

function createJsonResponse(body: unknown, status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

function createTextResponse(body: string, status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockRejectedValue(new Error('json() not expected')),
    text: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('trpc-client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
  });

  describe('publicGet', () => {
    it('returns parsed JSON for successful public API responses', async () => {
      mockFetch.mockResolvedValue(createJsonResponse({ id: 'server-1' }, 200));

      await expect(publicGet<{ id: string }>('/servers/server-1')).resolves.toEqual({
        id: 'server-1',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/public/servers/server-1',
        expect.objectContaining({
          next: { revalidate: 60 },
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('returns null for 404 public API responses', async () => {
      mockFetch.mockResolvedValue(createTextResponse('', 404));

      await expect(publicGet('/servers/missing')).resolves.toBeNull();
    });

    it('throws for non-404 public API failures', async () => {
      mockFetch.mockResolvedValue(createTextResponse('', 500));

      await expect(publicGet('/servers/failing')).rejects.toThrow('Public API error: 500');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Public API request failed',
        expect.objectContaining({
          feature: 'public-api',
          event: 'http_failure',
          route: '/servers/failing',
          statusCode: 500,
        }),
      );
    });
  });

  describe('trpcQuery', () => {
    it('serializes input and attaches the auth token when available', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => ({ name: 'auth_token', value: 'secret-token' })),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: { data: { ok: true } } }, 200));

      await expect(
        trpcQuery<{ ok: boolean }>('channel.getChannels', { serverId: 'server-1' }),
      ).resolves.toEqual({ ok: true });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.getChannels?input=%7B%22serverId%22%3A%22server-1%22%7D',
        expect.objectContaining({
          cache: 'no-store',
          headers: { Authorization: 'Bearer secret-token' },
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('omits input and authorization when no auth token is available', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: { data: ['a', 'b'] } }, 200));

      await expect(trpcQuery<string[]>('channel.list')).resolves.toEqual(['a', 'b']);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.list',
        expect.objectContaining({
          cache: 'no-store',
          headers: {},
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('continues without authorization when cookies() throws outside request context', async () => {
      mockedCookies.mockRejectedValue(new Error('No request context'));
      mockFetch.mockResolvedValue(createJsonResponse({ result: { data: { ok: true } } }, 200));

      await expect(trpcQuery<{ ok: boolean }>('channel.health')).resolves.toEqual({ ok: true });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.health',
        expect.objectContaining({ headers: {} }),
      );
    });

    it('throws a typed HTTP error for non-ok tRPC responses without warning on 403', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createTextResponse('Forbidden', 403));

      await expect(trpcQuery('channel.getChannels')).rejects.toEqual(
        expect.objectContaining<Partial<TrpcHttpError>>({
          name: 'TrpcHttpError',
          procedure: 'channel.getChannels',
          status: 403,
        }),
      );
      // 403 is an expected auth-flow response (e.g. membership probe) — should not warn
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('throws a typed HTTP error for 401 without warning', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createTextResponse('Unauthorized', 401));

      await expect(trpcQuery('channel.getChannels')).rejects.toEqual(
        expect.objectContaining<Partial<TrpcHttpError>>({
          name: 'TrpcHttpError',
          procedure: 'channel.getChannels',
          status: 401,
        }),
      );
      // 401 is an expected auth-flow response — should not warn
      expect(mockLogger.warn).not.toHaveBeenCalled();
    });

    it('logs a warning for unexpected non-auth tRPC failures', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createTextResponse('Internal Server Error', 500));

      await expect(trpcQuery('channel.getChannels')).rejects.toEqual(
        expect.objectContaining<Partial<TrpcHttpError>>({
          name: 'TrpcHttpError',
          procedure: 'channel.getChannels',
          status: 500,
        }),
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'tRPC query failed',
        expect.objectContaining({
          feature: 'trpc',
          event: 'http_failure',
          procedure: 'channel.getChannels',
          route: '/trpc/channel.getChannels',
          statusCode: 500,
        }),
      );
    });

    it('throws when the tRPC query response is missing result.data', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: {} }, 200));

      await expect(trpcQuery('channel.getChannels')).rejects.toThrow(
        'tRPC query [channel.getChannels]: response missing result.data',
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        'tRPC query response missing result.data',
        expect.objectContaining({
          feature: 'trpc',
          event: 'invalid_response',
          procedure: 'channel.getChannels',
        }),
      );
    });
  });

  describe('trpcMutate', () => {
    it('posts JSON input and attaches the auth token when available', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => ({ name: 'auth_token', value: 'secret-token' })),
      } as never);
      mockFetch.mockResolvedValue(
        createJsonResponse({ result: { data: { id: 'channel-1' } } }, 200),
      );

      await expect(
        trpcMutate<{ id: string }>('channel.createChannel', {
          serverId: 'server-1',
          name: 'general',
        }),
      ).resolves.toEqual({ id: 'channel-1' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.createChannel',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer secret-token',
          },
          body: JSON.stringify({ serverId: 'server-1', name: 'general' }),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('sends an empty JSON object when mutation input is undefined', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: { data: { ok: true } } }, 200));

      await expect(trpcMutate<{ ok: boolean }>('channel.touch')).resolves.toEqual({ ok: true });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.touch',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }),
      );
    });

    it('throws a typed HTTP error for non-ok mutation responses', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createTextResponse('Bad Request', 400));

      await expect(trpcMutate('channel.createChannel')).rejects.toEqual(
        expect.objectContaining<Partial<TrpcHttpError>>({
          name: 'TrpcHttpError',
          procedure: 'channel.createChannel',
          status: 400,
        }),
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'tRPC mutation failed',
        expect.objectContaining({
          feature: 'trpc',
          event: 'http_failure',
          procedure: 'channel.createChannel',
          route: '/trpc/channel.createChannel',
          statusCode: 400,
        }),
      );
    });

    it('throws when the mutation response is missing result.data', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: {} }, 200));

      await expect(trpcMutate('channel.createChannel')).rejects.toThrow(
        'tRPC mutation [channel.createChannel]: response missing result.data',
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        'tRPC mutation response missing result.data',
        expect.objectContaining({
          feature: 'trpc',
          event: 'invalid_response',
          procedure: 'channel.createChannel',
        }),
      );
    });
  });
});
