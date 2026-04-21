/**
 * Unit tests for M2 Meta Tag Generation Service skeleton — Issue #350
 *
 * Covers AC-2 (length limits), sanitization, template application,
 * and AC-9 (fallback on failure, needsRegeneration=true).
 *
 * MetaTagCache uses Redis via cacheService — mocked here for unit speed.
 */

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
    getOrRevalidate: jest.fn(),
  },
  CacheKeys: {
    metaChannel: (id: string) => `meta:channel:${id}`,
    channelVisibility: (id: string) => `channel:${id}:visibility`,
    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
    serverInfo: (id: string) => `server:${id}:info`,
    analysisChannel: (id: string) => `analysis:channel:${id}`,
  },
  sanitizeKeySegment: (s: string) => s.replace(/[*?\[\]]/g, ''),
}));

import { TitleGenerator } from '../src/services/metaTag/titleGenerator';
import { DescriptionGenerator } from '../src/services/metaTag/descriptionGenerator';
import { MetaTagCache } from '../src/services/metaTag/metaTagCache';
import { metaTagService } from '../src/services/metaTag/metaTagService';
import { cacheService } from '../src/services/cache.service';
import type { ChannelContext, MessageContext } from '../src/services/metaTag/types';

const mockCacheService = cacheService as jest.Mocked<typeof cacheService>;

const channel: ChannelContext = {
  id: 'chan-001',
  name: 'unity-physics-help',
  slug: 'unity-physics-help',
  topic: 'Ask about Unity physics',
  serverName: 'Game Dev Hub',
  serverSlug: 'game-dev-hub',
  canonicalUrl: 'https://harmony.chat/c/game-dev-hub/unity-physics-help',
};

const messages: MessageContext[] = [
  { content: 'How do I handle collision detection in Unity?', createdAt: new Date() },
  { content: 'Use OnCollisionEnter for physics-based collisions.', createdAt: new Date() },
];

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── TitleGenerator ──────────────────────────────────────────────────────────

describe('TitleGenerator', () => {
  it('maxLength is 60', () => {
    expect(TitleGenerator.maxLength).toBe(60);
  });

  it('generateFromChannel produces title ≤60 chars', () => {
    const title = TitleGenerator.generateFromChannel(channel);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  it('truncates long titles with ellipsis and stays ≤60 chars', () => {
    const longChannel: ChannelContext = {
      ...channel,
      name: 'this-is-a-very-long-channel-name-that-exceeds-limits',
      serverName: 'An Extremely Long Server Name That Will Overflow',
    };
    const title = TitleGenerator.generateFromChannel(longChannel);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title.endsWith('…')).toBe(true);
  });

  it('sanitizeForTitle strips HTML tags', () => {
    const result = TitleGenerator.sanitizeForTitle('<b>Hello</b> <em>world</em>');
    expect(result).toBe('Hello world');
  });

  it('sanitizeForTitle collapses whitespace', () => {
    const result = TitleGenerator.sanitizeForTitle('foo   bar\n  baz');
    expect(result).toBe('foo bar baz');
  });

  it('applyTemplate replaces template variables', () => {
    const result = TitleGenerator.applyTemplate('{channelName} on {serverName}', {
      channelName: 'general',
      serverName: 'My Server',
    });
    expect(result).toBe('general on My Server');
  });

  it('generateFromThread falls back to channel when no messages', () => {
    const title = TitleGenerator.generateFromThread([], channel);
    expect(title).toBe(TitleGenerator.generateFromChannel(channel));
  });

  it('generateFromMessage uses first message content', () => {
    const title = TitleGenerator.generateFromMessage(messages[0], channel);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toContain('Game Dev Hub');
  });
});

// ─── DescriptionGenerator ───────────────────────────────────────────────────

describe('DescriptionGenerator', () => {
  it('maxLength is 160', () => {
    expect(DescriptionGenerator.maxLength).toBe(160);
  });

  it('minLength is 50', () => {
    expect(DescriptionGenerator.minLength).toBe(50);
  });

  it('generateFromMessages produces description 50-160 chars', () => {
    const desc = DescriptionGenerator.generateFromMessages(messages, channel);
    expect(desc.length).toBeGreaterThanOrEqual(50);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it('truncates long descriptions to ≤160 chars with ellipsis', () => {
    const longMessages: MessageContext[] = [
      {
        content: 'A'.repeat(200),
        createdAt: new Date(),
      },
    ];
    const desc = DescriptionGenerator.generateFromMessages(longMessages, channel);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc.endsWith('…')).toBe(true);
  });

  it('returns text unchanged when within valid range', () => {
    const valid = 'A'.repeat(80);
    expect(DescriptionGenerator.enforceLength(valid)).toBe(valid);
  });

  it('AC-2: generateFromMessages produces ≥50 chars even for a very short message', () => {
    const shortMessages: MessageContext[] = [{ content: 'hi', createdAt: new Date() }];
    const desc = DescriptionGenerator.generateFromMessages(shortMessages, channel);
    expect(desc.length).toBeGreaterThanOrEqual(50);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it('extractKeyPhrases returns non-empty array for non-empty content', () => {
    const content = messages.map((m) => m.content).join(' ');
    const phrases = DescriptionGenerator.extractKeyPhrases(content, 5);
    expect(Array.isArray(phrases)).toBe(true);
    expect(phrases.length).toBeGreaterThan(0);
  });

  it('extractKeyPhrases respects maxPhrases limit', () => {
    const content = messages.map((m) => m.content).join(' ');
    const phrases = DescriptionGenerator.extractKeyPhrases(content, 2);
    expect(phrases.length).toBeLessThanOrEqual(2);
  });

  it('summarizeThread returns empty string for no messages', () => {
    const summary = DescriptionGenerator.summarizeThread([]);
    expect(summary).toBe('');
  });

  it('summarizeThread returns first message content for non-empty messages', () => {
    const summary = DescriptionGenerator.summarizeThread(messages);
    expect(summary.length).toBeGreaterThan(0);
  });

  it('generateFromMessages includes channel info for empty messages', () => {
    const desc = DescriptionGenerator.generateFromMessages([], channel);
    expect(desc).toContain(channel.name);
    expect(desc.length).toBeGreaterThanOrEqual(50);
    expect(desc.length).toBeLessThanOrEqual(160);
  });
});

// ─── MetaTagCache ────────────────────────────────────────────────────────────

describe('MetaTagCache', () => {
  it('ttl defaults to 3600', () => {
    expect(MetaTagCache.ttl).toBe(3600);
  });

  it('get returns null on cache miss', async () => {
    mockCacheService.get.mockResolvedValue(null);
    const result = await MetaTagCache.get('chan-001');
    expect(result).toBeNull();
    expect(mockCacheService.get).toHaveBeenCalledWith('meta:channel:chan-001');
  });

  it('get returns cached data on hit', async () => {
    const fakeSet = { title: 'Cached Title' } as never;
    mockCacheService.get.mockResolvedValue({ data: fakeSet, createdAt: Date.now() });
    const result = await MetaTagCache.get('chan-001');
    expect(result).toEqual(fakeSet);
  });

  it('set calls cacheService.set with correct key and ttl', async () => {
    mockCacheService.set.mockResolvedValue(undefined);
    const tags = { title: 'T' } as never;
    await MetaTagCache.set('chan-001', tags, 1800);
    expect(mockCacheService.set).toHaveBeenCalledWith(
      'meta:channel:chan-001',
      tags,
      { ttl: 1800 },
    );
  });

  it('invalidate calls cacheService.invalidate with correct key', async () => {
    mockCacheService.invalidate.mockResolvedValue(undefined);
    await MetaTagCache.invalidate('chan-001');
    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
  });
});

// ─── MetaTagService ──────────────────────────────────────────────────────────

describe('metaTagService', () => {
  it('generateMetaTagsFromContext returns valid MetaTagSet', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    expect(tags.title.length).toBeGreaterThan(0);
    expect(tags.title.length).toBeLessThanOrEqual(60);
    expect(tags.description.length).toBeGreaterThanOrEqual(50);
    expect(tags.description.length).toBeLessThanOrEqual(160);
    expect(tags.canonical).toBe(channel.canonicalUrl);
    expect(tags.needsRegeneration).toBe(false);
  });

  it('generateMetaTagsFromContext sets robots to index, follow', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    expect(tags.robots).toBe('index, follow');
  });

  it('generateMetaTagsFromContext includes openGraph and twitter tags', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    expect(tags.openGraph.ogTitle).toBeDefined();
    expect(tags.twitter.card).toBeDefined();
  });

  it('AC-9: returns fallback with needsRegeneration=true on generation error', async () => {
    const spy = jest
      .spyOn(TitleGenerator, 'generateFromThread')
      .mockImplementation(() => { throw new Error('NLP timeout'); });
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    spy.mockRestore();
    expect(tags.needsRegeneration).toBe(true);
    expect(tags.title.length).toBeGreaterThan(0);
  });

  it('getOrGenerateCachedFromContext returns cache hit without regenerating', async () => {
    const cachedTags = { title: 'Cached', needsRegeneration: false } as never;
    mockCacheService.get.mockResolvedValue({ data: cachedTags, createdAt: Date.now() });

    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
    expect(tags).toEqual(cachedTags);
    expect(mockCacheService.set).not.toHaveBeenCalled();
  });

  it('getOrGenerateCachedFromContext generates and caches on miss', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockResolvedValue(undefined);

    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
    expect(tags.title.length).toBeGreaterThan(0);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('getOrGenerateCachedFromContext does not cache fallback tags on generation failure', async () => {
    mockCacheService.get.mockResolvedValue(null);
    const spy = jest
      .spyOn(TitleGenerator, 'generateFromThread')
      .mockImplementation(() => { throw new Error('NLP timeout'); });

    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
    spy.mockRestore();

    expect(tags.needsRegeneration).toBe(true);
    expect(mockCacheService.set).not.toHaveBeenCalled();
  });

  it('invalidateCache delegates to MetaTagCache.invalidate', async () => {
    mockCacheService.invalidate.mockResolvedValue(undefined);
    await metaTagService.invalidateCache('chan-001');
    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
  });

  it('buildCanonicalUrl constructs correct path', () => {
    const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
    expect(url).toContain('/c/game-dev-hub/unity-physics-help');
  });

  it('buildCanonicalUrl encodes reserved characters in slug segments', () => {
    const url = metaTagService.buildCanonicalUrl('my server', 'q&a channel');
    expect(url).toContain('/c/my%20server/q%26a%20channel');
    expect(url).not.toContain(' ');
    expect(url).not.toContain('&');
  });

  it('generateMetaTagsFromContext emits index,follow for PUBLIC_INDEXABLE', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(
      { ...channel, visibility: 'PUBLIC_INDEXABLE' },
      messages,
    );
    expect(tags.robots).toBe('index, follow');
  });

  it('generateMetaTagsFromContext emits noindex,follow for PUBLIC_NO_INDEX', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(
      { ...channel, visibility: 'PUBLIC_NO_INDEX' },
      messages,
    );
    expect(tags.robots).toBe('noindex, follow');
  });

  it('generateMetaTagsFromContext emits noindex,nofollow for PRIVATE', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(
      { ...channel, visibility: 'PRIVATE' },
      messages,
    );
    expect(tags.robots).toBe('noindex, nofollow');
  });
});
