/**
 * Unit tests for the Tenor GIF proxy API route.
 * Issue #499 — GIF picker for message input.
 */

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const mockCookiesGet = jest.fn();

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({ get: mockCookiesGet }),
}));

import { cookies } from 'next/headers';

// Minimal NextRequest / NextResponse shims
jest.mock('next/server', () => ({
  NextRequest: class {
    nextUrl: URL;
    constructor(url: string) {
      this.nextUrl = new URL(url);
    }
  },
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      _body: body,
      _status: init?.status ?? 200,
    }),
  },
}));

import { GET } from '@/app/api/tenor/route';
import { NextRequest } from 'next/server';

function makeRequest(url: string): InstanceType<typeof NextRequest> {
  return new NextRequest(url) as unknown as InstanceType<typeof NextRequest>;
}

function makeTenorResponse(results: unknown[]) {
  return { results };
}

function makeTenorResult(overrides: Record<string, unknown> = {}) {
  return {
    id: 'gif-1',
    title: 'funny cat',
    media_formats: {
      gif: { url: 'https://media.tenor.com/gif1.gif' },
      tinygif: { url: 'https://media.tenor.com/gif1_small.gif' },
    },
    ...overrides,
  };
}

describe('GET /api/tenor', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    // jest.resetAllMocks() wipes mockResolvedValue on the cookies factory; restore it.
    (cookies as jest.Mock).mockResolvedValue({ get: mockCookiesGet });
    process.env = { ...OLD_ENV, TENOR_API_KEY: 'test-key' };
    // Default: authenticated user
    mockCookiesGet.mockReturnValue({ value: 'token-abc' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('returns 401 when no auth_token cookie is present', async () => {
    mockCookiesGet.mockReturnValue(undefined);
    const req = makeRequest('http://localhost/api/tenor');
    const res = await GET(req as never);
    expect((res as { _status: number })._status).toBe(401);
  });

  it('returns 503 when TENOR_API_KEY is not set', async () => {
    delete process.env.TENOR_API_KEY;
    const req = makeRequest('http://localhost/api/tenor');
    const res = await GET(req as never);
    expect((res as { _status: number })._status).toBe(503);
  });

  it('calls the Tenor featured endpoint when no query is given', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(makeTenorResponse([makeTenorResult()])),
    });

    const req = makeRequest('http://localhost/api/tenor');
    const res = await GET(req as never);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('tenor.googleapis.com/v2/featured'),
      expect.anything(),
    );
    expect((res as { _status: number })._status).toBe(200);
    const body = (res as { _body: { gifs: unknown[] } })._body;
    expect(body.gifs).toHaveLength(1);
    expect(body.gifs[0]).toMatchObject({
      id: 'gif-1',
      title: 'funny cat',
      url: 'https://media.tenor.com/gif1.gif',
      previewUrl: 'https://media.tenor.com/gif1_small.gif',
    });
  });

  it('calls the Tenor search endpoint when a query is given', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(makeTenorResponse([makeTenorResult()])),
    });

    const req = makeRequest('http://localhost/api/tenor?q=cats');
    await GET(req as never);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('tenor.googleapis.com/v2/search'),
      expect.anything(),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('q=cats'),
      expect.anything(),
    );
  });

  it('URL-encodes special characters in the search query', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(makeTenorResponse([])),
    });

    // "hello world!" pre-encoded in the URL as "hello+world%21"
    const req = makeRequest('http://localhost/api/tenor?q=hello+world%21');
    await GET(req as never);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('q=hello%20world!'),
      expect.anything(),
    );
  });

  it('returns 502 when Tenor API responds with an error', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 429 });

    const req = makeRequest('http://localhost/api/tenor?q=cats');
    const res = await GET(req as never);

    expect((res as { _status: number })._status).toBe(502);
  });

  it('returns 500 when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('network'));

    const req = makeRequest('http://localhost/api/tenor?q=cats');
    const res = await GET(req as never);

    expect((res as { _status: number })._status).toBe(500);
  });

  it('filters out results with empty URLs', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(
        makeTenorResponse([
          makeTenorResult({ id: 'ok', media_formats: { gif: { url: 'https://media.tenor.com/ok.gif' } } }),
          makeTenorResult({ id: 'empty', media_formats: {} }),
        ]),
      ),
    });

    const req = makeRequest('http://localhost/api/tenor');
    const res = await GET(req as never);
    const body = (res as { _body: { gifs: unknown[] } })._body;
    expect(body.gifs).toHaveLength(1);
    expect((body.gifs[0] as { id: string }).id).toBe('ok');
  });
});
