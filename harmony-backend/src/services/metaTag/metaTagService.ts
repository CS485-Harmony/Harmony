// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
import { TitleGenerator } from './titleGenerator';
import { DescriptionGenerator } from './descriptionGenerator';
import { OpenGraphGenerator } from './openGraphGenerator';
import { StructuredDataGenerator } from './structuredDataGenerator';
import { MetaTagCache } from './metaTagCache';
import { metaTagRepository } from '../../repositories/metaTag.repository';
import type {
  MetaTagSet,
  ChannelContext,
  ChannelVisibility,
  MessageContext,
  MetaTagPreview,
  MetaTagJobStatus,
  ContentAnalysis,
} from './types';
import { createLogger } from '../../lib/logger';

const logger = createLogger({ component: 'meta-tag-service' });

const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

// Strip HTML, redact PII (emails, @mentions), and HTML-encode remaining special chars.
// Applied to free-text custom overrides (title, description) before DB storage (AC-8 / §12.3).
function sanitizeOverrideText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[email]') // redact emails
    .replace(/@\w+/g, '[mention]') // redact @mentions
    .replace(/&/g, '&amp;') // HTML-encode (ampersand first to avoid double-encoding)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\s+/g, ' ')
    .trim();
}

// Spec §9.1.1 visibility → robots mapping
function getRobotsDirective(visibility: ChannelVisibility | undefined): string {
  if (visibility === 'PUBLIC_NO_INDEX') return 'noindex, follow';
  if (visibility === 'PRIVATE') return 'noindex, nofollow';
  return 'index, follow'; // PUBLIC_INDEXABLE or unset
}

function sanitizeChannelContext(channel: ChannelContext): ChannelContext {
  return {
    ...channel,
    name: TitleGenerator.sanitizeForTitle(channel.name),
    serverName: TitleGenerator.sanitizeForTitle(channel.serverName),
  };
}

function buildFallbackTags(channel: ChannelContext): MetaTagSet {
  const safe = sanitizeChannelContext(channel);
  const title = `${safe.name} — ${safe.serverName}`;
  const description = `Discussions in #${safe.name} on ${safe.serverName}.`;
  const analysis: ContentAnalysis = {
    keywords: [],
    topics: [TitleGenerator.truncateWithEllipsis(title)],
    summary: DescriptionGenerator.enforceLength(description),
    sentiment: 'neutral',
    readingLevel: 'basic',
  };
  return {
    title: TitleGenerator.truncateWithEllipsis(title),
    description: DescriptionGenerator.enforceLength(description),
    canonical: safe.canonicalUrl,
    robots: getRobotsDirective(safe.visibility),
    openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
    twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
    keywords: [],
    needsRegeneration: true,
  };
}

export const metaTagService = {
  /**
   * Generate meta tags from pre-resolved context (used internally and in unit tests).
   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
   */
  async generateMetaTagsFromContext(
    channel: ChannelContext,
    messages: MessageContext[],
  ): Promise<MetaTagSet> {
    try {
      const title = TitleGenerator.generateFromThread(messages, channel);
      const description = DescriptionGenerator.generateFromMessages(messages, channel);
      const keywords = DescriptionGenerator.extractKeyPhrases(
        messages.map((m) => m.content).join(' '),
        5,
      );
      const analysis: ContentAnalysis = {
        keywords,
        topics: [title],
        summary: description,
        sentiment: 'neutral',
        readingLevel: 'basic',
      };
      const og = OpenGraphGenerator.generateOGTags(channel, {}, analysis);
      const twitter = OpenGraphGenerator.generateTwitterCard(channel, {}, analysis, og.ogImage);
      const structuredData = StructuredDataGenerator.generateDiscussionForum(channel, messages, {});

      return {
        title,
        description,
        canonical: channel.canonicalUrl,
        robots: getRobotsDirective(channel.visibility),
        openGraph: og,
        twitter,
        structuredData,
        keywords,
        needsRegeneration: false,
      };
    } catch (err) {
      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
      return buildFallbackTags(channel);
    }
  },

  /**
   * Spec-aligned stub: generateMetaTags(channelId, options?).
   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
   */
  async generateMetaTags(
    _channelId: string,
    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
  ): Promise<MetaTagSet> {
    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
  },

  /**
   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
   */
  async getOrGenerateCachedFromContext(
    channel: ChannelContext,
    messages: MessageContext[],
    ttl?: number,
  ): Promise<MetaTagSet> {
    const cached = await MetaTagCache.get(channel.id);
    if (cached) return cached;

    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    // Do not cache fallback tags — a transient failure must not poison the cache for the full TTL
    if (!tags.needsRegeneration) {
      await MetaTagCache.set(channel.id, tags, ttl);
    }
    return tags;
  },

  /**
   * Spec-aligned stub: getOrGenerateCached(channelId).
   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
   */
  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
    throw new Error(
      'getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)',
    );
  },

  async invalidateCache(channelId: string): Promise<void> {
    await MetaTagCache.invalidate(channelId);
  },

  /**
   * Sanitize and persist admin custom overrides (AC-8 / §12.3).
   * Strips HTML, redacts PII, HTML-encodes text fields, then invalidates the meta cache.
   * Only fields present in `overrides` are written — absent fields are left unchanged.
   */
  async setCustomOverrides(
    channelId: string,
    overrides: {
      customTitle?: string | null;
      customDescription?: string | null;
      customOgImage?: string | null;
    },
  ) {
    const sanitized: typeof overrides = {};
    if (overrides.customTitle !== undefined) {
      sanitized.customTitle =
        overrides.customTitle !== null ? sanitizeOverrideText(overrides.customTitle) : null;
    }
    if (overrides.customDescription !== undefined) {
      sanitized.customDescription =
        overrides.customDescription !== null
          ? sanitizeOverrideText(overrides.customDescription)
          : null;
    }
    if (overrides.customOgImage !== undefined) {
      sanitized.customOgImage = overrides.customOgImage; // URL already validated by Zod; no text sanitization
    }
    const updated = await metaTagRepository.updateCustomOverrides(channelId, sanitized);
    await MetaTagCache.invalidate(channelId);
    return updated;
  },

  // scheduleRegeneration and getRegenerationJobStatus are stubs —
  // full implementation depends on M4 (worker/queue) from issue #356
  async scheduleRegeneration(
    channelId: string,
    _priority?: 'high' | 'normal' | 'low',
    _idempotencyKey?: string,
  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
    // Queuing logic wired by M4 MetaTagUpdateWorker
    return {
      jobId: `meta-tag-regeneration:${channelId}`,
      status: 'queued',
    };
  },

  async getRegenerationJobStatus(_channelId: string, _jobId: string): Promise<MetaTagJobStatus> {
    throw new Error('getRegenerationJobStatus not yet implemented — wired by M4 (issue #356)');
  },

  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
    throw new Error(
      'getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)',
    );
  },

  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
    return `${BASE_URL}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(channelSlug)}`;
  },
};
