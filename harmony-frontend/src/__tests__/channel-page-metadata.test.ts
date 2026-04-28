/**
 * Unit tests for generateMetadata in the public channel page.
 * Issue #357 — Sprint 5 (M1 PublicChannelPage + generateMetadata integration)
 */

const mockCache = jest.fn(<T extends (...args: never[]) => unknown>(fn: T): T => fn);
jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return { ...actualReact, cache: mockCache };
});

jest.mock('@/services/publicApiService', () => ({
  fetchPublicServer: jest.fn(),
  fetchPublicChannel: jest.fn(),
  fetchPublicMetaTags: jest.fn().mockResolvedValue(null),
}));

jest.mock('@/components/channel/GuestChannelView', () => ({
  GuestChannelView: () => null,
}));

import { renderToStaticMarkup } from 'react-dom/server';
import GuestChannelPage, { generateMetadata } from '@/app/c/[serverSlug]/[channelSlug]/page';
import {
  fetchPublicServer,
  fetchPublicChannel,
  fetchPublicMetaTags,
} from '@/services/publicApiService';
import { ChannelType, ChannelVisibility } from '@/types';

const mockFetchPublicServer = fetchPublicServer as jest.Mock;
const mockFetchPublicChannel = fetchPublicChannel as jest.Mock;
const mockFetchPublicMetaTags = fetchPublicMetaTags as jest.Mock;

const originalEnv = process.env;

function makeParams(
  serverSlug = 'harmony-hq',
  channelSlug = 'general',
): { params: Promise<{ serverSlug: string; channelSlug: string }> } {
  return { params: Promise.resolve({ serverSlug, channelSlug }) };
}

function makeServer(overrides = {}) {
  return {
    id: 'srv-1',
    name: 'Harmony HQ',
    slug: 'harmony-hq',
    description: 'A public server',
    memberCount: 10,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeChannel(visibility: ChannelVisibility, overrides = {}) {
  return {
    id: 'ch-1',
    name: 'general',
    slug: 'general',
    serverId: 'srv-1',
    type: ChannelType.TEXT,
    visibility,
    topic: 'Welcome to general',
    position: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  process.env = { ...originalEnv, NEXT_PUBLIC_BASE_URL: 'https://harmony.chat' };
  jest.resetAllMocks();
});

afterAll(() => {
  process.env = originalEnv;
});

describe('generateMetadata — PUBLIC_INDEXABLE channel', () => {
  beforeEach(() => {
    mockFetchPublicServer.mockResolvedValue(makeServer());
    mockFetchPublicChannel.mockResolvedValue({
      channel: makeChannel(ChannelVisibility.PUBLIC_INDEXABLE),
      isPrivate: false,
    });
  });

  it('sets title and description from channel and server data', async () => {
    const meta = await generateMetadata(makeParams());
    expect(meta.title).toBe('general - Harmony HQ | Harmony');
    expect(meta.description).toBe('Welcome to general');
  });

  it('sets robots to index, follow', async () => {
    const meta = await generateMetadata(makeParams());
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  it('sets canonical URL using the frontend domain', async () => {
    const meta = await generateMetadata(makeParams());
    expect(meta.alternates?.canonical).toBe('https://harmony.chat/c/harmony-hq/general');
  });

  it('includes Open Graph tags', async () => {
    const meta = await generateMetadata(makeParams());
    expect(meta).toMatchObject({
      openGraph: {
        title: 'general - Harmony HQ | Harmony',
        type: 'website',
        url: 'https://harmony.chat/c/harmony-hq/general',
      },
    });
  });

  it('includes Twitter card tags', async () => {
    const meta = await generateMetadata(makeParams());
    expect(meta).toMatchObject({
      twitter: {
        card: 'summary',
        title: 'general - Harmony HQ | Harmony',
        description: 'Welcome to general',
      },
    });
  });

  it('renders JSON-LD with author, text, and headline for rich results', async () => {
    const page = await GuestChannelPage(makeParams());
    const html = renderToStaticMarkup(page);
    const ldMatch = html.match(/<script[^>]+type="application\/ld\+json">([\s\S]*?)<\/script>/i);

    expect(ldMatch).not.toBeNull();
    const jsonLd = JSON.parse(ldMatch![1]);
    expect(jsonLd).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      'name': 'general - Harmony HQ | Harmony',
      'headline': 'general - Harmony HQ | Harmony',
      'description': 'Welcome to general',
      'text': 'Welcome to general',
      'author': {
        '@type': 'Organization',
        'name': 'Harmony HQ',
      },
      'url': 'https://harmony.chat/c/harmony-hq/general',
      'datePublished': '2026-01-01T00:00:00.000Z',
    });
  });

  it('reuses persisted SEO metadata in JSON-LD when present', async () => {
    mockFetchPublicMetaTags.mockResolvedValue({
      title: 'Custom SEO Title',
      description: 'Custom SEO Description',
      ogTitle: 'Custom OG Title',
      ogDescription: 'Custom OG Description',
      ogImage: 'https://example.com/custom.png',
      generatedAt: '2026-01-01T00:00:00.000Z',
      visibility: 'PUBLIC_INDEXABLE',
    });

    const page = await GuestChannelPage(makeParams());
    const html = renderToStaticMarkup(page);
    const ldMatch = html.match(/<script[^>]+type="application\/ld\+json">([\s\S]*?)<\/script>/i);

    expect(ldMatch).not.toBeNull();
    const jsonLd = JSON.parse(ldMatch![1]);
    expect(jsonLd).toMatchObject({
      name: 'Custom SEO Title',
      headline: 'Custom SEO Title',
      description: 'Custom SEO Description',
      text: 'Custom SEO Description',
    });
  });

  it('uses the same server-name fallback for JSON-LD author as the page metadata', async () => {
    mockFetchPublicServer.mockResolvedValue(null);

    const page = await GuestChannelPage(makeParams('fallback-server', 'general'));
    const html = renderToStaticMarkup(page);
    const ldMatch = html.match(/<script[^>]+type="application\/ld\+json">([\s\S]*?)<\/script>/i);

    expect(ldMatch).not.toBeNull();
    const jsonLd = JSON.parse(ldMatch![1]);
    expect(jsonLd).toMatchObject({
      name: 'general - fallback-server | Harmony',
      headline: 'general - fallback-server | Harmony',
      description: 'Welcome to general',
      text: 'Welcome to general',
      author: {
        '@type': 'Organization',
        'name': 'fallback-server',
      },
    });
  });

  it('sanitizes path-like server names before building fallback metadata', async () => {
    mockFetchPublicServer.mockResolvedValue(
      makeServer({
        name: '../../../admin',
      }),
    );

    const meta = await generateMetadata(makeParams('admin', 'general'));
    const page = await GuestChannelPage(makeParams('admin', 'general'));
    const html = renderToStaticMarkup(page);
    const ldMatch = html.match(/<script[^>]+type="application\/ld\+json">([\s\S]*?)<\/script>/i);

    expect(meta.title).toBe('general - admin | Harmony');
    expect(meta.description).toBe('Welcome to general');
    expect(ldMatch).not.toBeNull();
    expect(JSON.parse(ldMatch![1])).toMatchObject({
      author: {
        '@type': 'Organization',
        'name': 'admin',
      },
      name: 'general - admin | Harmony',
      headline: 'general - admin | Harmony',
    });
  });
});

describe('generateMetadata — PUBLIC_NO_INDEX channel', () => {
  beforeEach(() => {
    mockFetchPublicServer.mockResolvedValue(makeServer());
    mockFetchPublicChannel.mockResolvedValue({
      channel: makeChannel(ChannelVisibility.PUBLIC_NO_INDEX, { topic: 'Staff updates' }),
      isPrivate: false,
    });
  });

  it('sets robots to noindex, follow', async () => {
    const meta = await generateMetadata(makeParams('harmony-hq', 'staff'));
    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it('still includes Twitter card tags', async () => {
    const meta = await generateMetadata(makeParams('harmony-hq', 'staff'));
    expect(meta).toMatchObject({ twitter: { card: 'summary' } });
    expect(meta.twitter?.title).toBeTruthy();
  });
});

describe('generateMetadata — PRIVATE channel', () => {
  beforeEach(() => {
    mockFetchPublicServer.mockResolvedValue(makeServer());
    mockFetchPublicChannel.mockResolvedValue({ isPrivate: true });
  });

  it('sets robots to noindex, follow', async () => {
    const meta = await generateMetadata(makeParams('harmony-hq', 'secret'));
    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it('falls back to the slug for title when channel data is unavailable', async () => {
    const meta = await generateMetadata(makeParams('harmony-hq', 'secret'));
    expect(meta.title).toContain('secret');
  });
});

describe('generateMetadata — API fallback (both fetches return null)', () => {
  beforeEach(() => {
    mockFetchPublicServer.mockResolvedValue(null);
    mockFetchPublicChannel.mockResolvedValue(null);
  });

  it('falls back to slugs for title', async () => {
    const meta = await generateMetadata(makeParams('my-server', 'my-channel'));
    expect(meta.title).toBe('my-channel - my-server | Harmony');
  });

  it('falls back to a template description', async () => {
    const meta = await generateMetadata(makeParams('my-server', 'my-channel'));
    expect(meta.description).toBe('Join my-server on Harmony');
  });

  it('still sets canonical URL and Twitter card', async () => {
    const meta = await generateMetadata(makeParams('my-server', 'my-channel'));
    expect(meta.alternates?.canonical).toBe('https://harmony.chat/c/my-server/my-channel');
    expect(meta).toMatchObject({ twitter: { card: 'summary' } });
  });

  it('sets robots to noindex when channel is unknown', async () => {
    const meta = await generateMetadata(makeParams('my-server', 'my-channel'));
    expect(meta.robots).toEqual({ index: false, follow: true });
  });
});
