// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
import { createHash } from 'crypto';
import { Prisma, type GeneratedMetaTags } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { redis } from '../../db/redis';
import { TitleGenerator } from './titleGenerator';
import { DescriptionGenerator } from './descriptionGenerator';
import { OpenGraphGenerator } from './openGraphGenerator';
import { StructuredDataGenerator } from './structuredDataGenerator';
import { MetaTagCache } from './metaTagCache';
import { ContentFilter } from './contentFilter';
import { metaTagRepository } from '../../repositories/metaTag.repository';
import type {
  MetaTagSet,
  ChannelContext,
  ChannelVisibility,
  MessageContext,
  MetaTagPreview,
  MetaTagJobStatus,
  ContentAnalysis,
  StructuredData,
} from './types';
import { createLogger } from '../../lib/logger';
import { metaTagUpdateQueue } from '../../workers/metaTagUpdate.queue';

const logger = createLogger({ component: 'meta-tag-service' });

const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
const META_TAG_SCHEMA_VERSION = 1;
const META_TAG_MESSAGE_LIMIT = 20;

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

function applyPersistedOverrides(
  tags: MetaTagSet,
  record: Pick<GeneratedMetaTags, 'customTitle' | 'customDescription' | 'customOgImage'> | null,
): MetaTagSet {
  if (!record) return tags;

  const title = record.customTitle ?? tags.title;
  const description = record.customDescription ?? tags.description;
  const image = record.customOgImage ?? tags.openGraph.ogImage;

  return {
    ...tags,
    title,
    description,
    openGraph: {
      ...tags.openGraph,
      ogTitle: title,
      ogDescription: description,
      ogImage: image,
    },
    twitter: {
      ...tags.twitter,
      title,
      description,
      image,
    },
  };
}

function buildChannelContext(channel: {
  id: string;
  name: string;
  slug: string;
  topic: string | null;
  visibility: ChannelVisibility;
  server: {
    name: string;
    slug: string;
  };
}): ChannelContext {
  return {
    id: channel.id,
    name: channel.name,
    slug: channel.slug,
    topic: channel.topic,
    serverName: channel.server.name,
    serverSlug: channel.server.slug,
    canonicalUrl: `${BASE_URL}/c/${encodeURIComponent(channel.server.slug)}/${encodeURIComponent(channel.slug)}`,
    visibility: channel.visibility,
  };
}

function buildPersistedMetaTagSet(channel: ChannelContext, record: GeneratedMetaTags): MetaTagSet {
  const baseTags: MetaTagSet = {
    title: record.title,
    description: record.description,
    canonical: channel.canonicalUrl,
    robots: getRobotsDirective(channel.visibility),
    openGraph: {
      ogTitle: record.title,
      ogDescription: record.description,
      ogImage: record.ogImage ?? `${BASE_URL}/og-default.png`,
      ogType: 'article',
      ogUrl: channel.canonicalUrl,
      ogSiteName: channel.serverName,
    },
    twitter: {
      card: record.twitterCard,
      title: record.title,
      description: record.description,
      image: record.ogImage ?? `${BASE_URL}/og-default.png`,
      site: '@harmonychat',
    },
    structuredData: record.structuredData as StructuredData,
    keywords: record.keywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    needsRegeneration: record.needsRegeneration,
  };

  return applyPersistedOverrides(baseTags, record);
}

function buildContentHash(channel: ChannelContext, messages: MessageContext[]): string {
  return createHash('sha256')
    .update(
      JSON.stringify({
        visibility: channel.visibility ?? 'PUBLIC_INDEXABLE',
        topic: channel.topic ?? null,
        messages: messages.map((message) => ({
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          authorDisplayName: message.authorDisplayName ?? null,
        })),
      }),
    )
    .digest('hex');
}

function mapQueueStateToStatus(state: string): MetaTagJobStatus['status'] {
  if (state === 'completed') return 'succeeded';
  if (state === 'failed') return 'failed';
  if (state === 'active') return 'processing';
  return 'queued';
}

// ─── Admin Redis job helpers (distinct from BullMQ-based scheduleRegeneration) ────

const ADMIN_JOB_TTL_SECONDS = 86400; // 24 hours

function adminJobKey(jobId: string): string {
  return `meta-tag:job:${jobId}`;
}

async function storeAdminJob(job: MetaTagJobStatus): Promise<void> {
  await redis.set(adminJobKey(job.jobId), JSON.stringify(job), 'EX', ADMIN_JOB_TTL_SECONDS);
}

async function getAdminJob(jobId: string): Promise<MetaTagJobStatus | null> {
  const raw = await redis.get(adminJobKey(jobId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MetaTagJobStatus;
  } catch {
    logger.warn(
      { jobId, key: adminJobKey(jobId) },
      'Failed to parse admin meta-tag job from Redis — treating as not found',
    );
    return null;
  }
}

async function loadGenerationInputs(channelId: string): Promise<{
  channel: ChannelContext;
  persisted: GeneratedMetaTags | null;
  messages: MessageContext[];
}> {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    select: {
      id: true,
      name: true,
      slug: true,
      topic: true,
      visibility: true,
      server: {
        select: {
          name: true,
          slug: true,
        },
      },
      generatedMetaTags: true,
    },
  });

  if (!channel) {
    throw new Error(`Channel ${channelId} not found`);
  }

  const messages = await prisma.message.findMany({
    where: {
      channelId,
      isDeleted: false,
    },
    take: META_TAG_MESSAGE_LIMIT,
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      content: true,
      createdAt: true,
      author: {
        select: {
          displayName: true,
        },
      },
    },
  });

  return {
    channel: buildChannelContext(channel),
    persisted: channel.generatedMetaTags,
    messages: messages.map((message) => ({
      content: message.content,
      createdAt: message.createdAt,
      authorDisplayName: message.author.displayName,
    })),
  };
}

async function loadPreviewFallbackInputs(channelId: string): Promise<{
  channel: ChannelContext;
  messages: MessageContext[];
}> {
  // Keep this loader separate from loadGenerationInputs(): the fallback path is
  // specifically for cases where reading persisted generated_meta_tags may be
  // the failing step, so it intentionally avoids selecting that relation.
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    select: {
      id: true,
      name: true,
      slug: true,
      topic: true,
      visibility: true,
      server: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!channel) {
    throw new Error(`Channel ${channelId} not found`);
  }

  const messages = await prisma.message.findMany({
    where: {
      channelId,
      isDeleted: false,
    },
    take: META_TAG_MESSAGE_LIMIT,
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      content: true,
      createdAt: true,
      author: {
        select: {
          displayName: true,
        },
      },
    },
  });

  return {
    channel: buildChannelContext(channel),
    messages: messages.map((message) => ({
      content: message.content,
      createdAt: message.createdAt,
      authorDisplayName: message.author.displayName,
    })),
  };
}

function buildPreviewFromTags(
  tags: MetaTagSet,
  persisted: GeneratedMetaTags | null,
): MetaTagPreview {
  return {
    title: tags.title,
    description: tags.description,
    ogTitle: tags.openGraph.ogTitle,
    ogDescription: tags.openGraph.ogDescription,
    ogImage: tags.openGraph.ogImage,
    keywords: tags.keywords,
    generatedAt: persisted?.generatedAt.toISOString() ?? new Date().toISOString(),
    isFallbackPreview: persisted === null,
    isCustom: Boolean(
      persisted?.customTitle || persisted?.customDescription || persisted?.customOgImage,
    ),
    generatedTitle: persisted?.title ?? tags.title,
    generatedDescription: persisted?.description ?? tags.description,
    customTitle: persisted?.customTitle ?? null,
    customDescription: persisted?.customDescription ?? null,
    customOgImage: persisted?.customOgImage ?? null,
    searchPreview: {
      title: tags.title,
      description: tags.description,
      url: tags.canonical,
    },
    socialPreview: {
      title: tags.openGraph.ogTitle,
      description: tags.openGraph.ogDescription,
      image: tags.openGraph.ogImage,
    },
  };
}

/**
 * Runs meta tag regeneration for an admin-initiated job stored in Redis as `queued`.
 * Transitions: queued → processing → succeeded | failed.
 * Exported for direct use in tests.
 */
export async function processAdminRegenerationJob(channelId: string, jobId: string): Promise<void> {
  const startedAt = new Date().toISOString();

  try {
    await storeAdminJob({
      jobId,
      channelId,
      status: 'processing',
      attempts: 1,
      startedAt,
      completedAt: null,
      errorCode: null,
      errorMessage: null,
    });

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: { server: { select: { name: true, slug: true } } },
    });

    if (!channel) throw new Error('Channel not found during regeneration');

    const rawMessages = await prisma.message.findMany({
      where: { channelId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { author: { select: { displayName: true } } },
    });

    const channelCtx: ChannelContext = {
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      topic: channel.topic,
      serverName: channel.server.name,
      serverSlug: channel.server.slug,
      canonicalUrl: metaTagService.buildCanonicalUrl(channel.server.slug, channel.slug),
      visibility: channel.visibility as unknown as ChannelVisibility,
    };

    const msgCtxs: MessageContext[] = rawMessages.map((m) => ({
      content: m.content,
      createdAt: m.createdAt,
      authorDisplayName: m.author.displayName,
    }));

    const tags = await metaTagService.generateMetaTagsFromContext(channelCtx, msgCtxs);

    await metaTagRepository.saveGeneratedFields(channelId, {
      title: tags.title,
      description: tags.description,
      ogTitle: tags.openGraph.ogTitle,
      ogDescription: tags.openGraph.ogDescription,
      ogImage: tags.openGraph.ogImage,
      twitterCard: tags.twitter.card,
      keywords: tags.keywords.join(','),
      structuredData: tags.structuredData as Prisma.InputJsonValue,
      contentHash: buildContentHash(channelCtx, msgCtxs),
      needsRegeneration: tags.needsRegeneration ?? false,
      generatedAt: new Date(),
      schemaVersion: META_TAG_SCHEMA_VERSION,
    });

    await storeAdminJob({
      jobId,
      channelId,
      status: 'succeeded',
      attempts: 1,
      startedAt,
      completedAt: new Date().toISOString(),
      errorCode: null,
      errorMessage: null,
    });

    logger.info({ jobId, channelId }, 'Admin meta tag regeneration succeeded');
  } catch (err) {
    logger.error({ err, jobId, channelId }, 'Admin meta tag regeneration failed');
    await storeAdminJob({
      jobId,
      channelId,
      status: 'failed',
      attempts: 1,
      startedAt,
      completedAt: new Date().toISOString(),
      errorCode: 'REGEN_FAILED',
      errorMessage: err instanceof Error ? err.message : 'Unknown error',
    }).catch((storeErr) =>
      logger.error({ err: storeErr, jobId }, 'Failed to store failed admin job status'),
    );
  }
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
      const rawTitle = TitleGenerator.generateFromThread(messages, channel);
      const rawDescription = DescriptionGenerator.generateFromMessages(messages, channel);
      const title = ContentFilter.filterContent(rawTitle);
      const description = ContentFilter.filterContent(rawDescription);
      const filteredContent = ContentFilter.filterContent(messages.map((m) => m.content).join(' '));
      // Drop placeholder tokens that filterContent inserts — they leak filter presence into og/twitter tags
      const FILTER_PLACEHOLDERS = new Set(['email', 'phone', 'user']);
      const keywords = DescriptionGenerator.extractKeyPhrases(filteredContent, 5).filter(
        (k) => !FILTER_PLACEHOLDERS.has(k) && !/^\*+$/.test(k),
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
   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #354).
   */
  async generateMetaTags(
    channelId: string,
    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
  ): Promise<MetaTagSet> {
    const { channel, persisted, messages } = await loadGenerationInputs(channelId);

    if (channel.visibility === 'PRIVATE') {
      await MetaTagCache.invalidate(channelId);
      if (persisted) {
        await metaTagRepository.deleteByChannelId(channelId).catch(() => undefined);
      }
      return buildFallbackTags(channel);
    }

    const generated = await metaTagService.generateMetaTagsFromContext(channel, messages);
    const contentHash = buildContentHash(channel, messages);
    const generatedAt = new Date();

    if (persisted) {
      const rowsUpdated = await metaTagRepository.saveGeneratedFields(channelId, {
        title: generated.title,
        description: generated.description,
        ogTitle: generated.openGraph.ogTitle,
        ogDescription: generated.openGraph.ogDescription,
        ogImage: generated.openGraph.ogImage,
        twitterCard: generated.twitter.card,
        keywords: generated.keywords.join(','),
        structuredData: generated.structuredData as Prisma.InputJsonValue,
        contentHash,
        needsRegeneration: generated.needsRegeneration ?? false,
        generatedAt,
        schemaVersion: META_TAG_SCHEMA_VERSION,
      });

      const record =
        rowsUpdated > 0 ? await metaTagRepository.findByChannelId(channelId) : persisted;
      const finalTags = buildPersistedMetaTagSet(channel, record ?? persisted);

      if (finalTags.needsRegeneration) {
        await MetaTagCache.invalidate(channelId);
      } else {
        await MetaTagCache.set(channelId, finalTags);
      }

      return finalTags;
    }

    const created = await metaTagRepository.create({
      channelId,
      title: generated.title,
      description: generated.description,
      ogTitle: generated.openGraph.ogTitle,
      ogDescription: generated.openGraph.ogDescription,
      ogImage: generated.openGraph.ogImage,
      twitterCard: generated.twitter.card,
      keywords: generated.keywords.join(','),
      structuredData: generated.structuredData as Prisma.InputJsonValue,
      contentHash,
      needsRegeneration: generated.needsRegeneration ?? false,
      generatedAt,
      schemaVersion: META_TAG_SCHEMA_VERSION,
    });

    const finalTags = buildPersistedMetaTagSet(channel, created);
    if (finalTags.needsRegeneration) {
      await MetaTagCache.invalidate(channelId);
    } else {
      await MetaTagCache.set(channelId, finalTags);
    }

    return finalTags;
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
   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #354).
   */
  async getOrGenerateCached(channelId: string): Promise<MetaTagSet> {
    const cached = await MetaTagCache.get(channelId);
    if (cached) return cached;

    const { channel, persisted } = await loadGenerationInputs(channelId);
    if (persisted && !persisted.needsRegeneration) {
      const tags = buildPersistedMetaTagSet(channel, persisted);
      await MetaTagCache.set(channelId, tags);
      return tags;
    }

    return metaTagService.generateMetaTags(channelId);
  },

  async invalidateCache(channelId: string): Promise<void> {
    await MetaTagCache.invalidate(channelId);
  },

  sanitizeCustomOverride(value: string | null | undefined): string | null {
    if (value == null) return null;
    const stripped = value
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return ContentFilter.escapeHtml(ContentFilter.filterContent(stripped));
  },

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
      sanitized.customTitle = metaTagService.sanitizeCustomOverride(overrides.customTitle);
    }
    if (overrides.customDescription !== undefined) {
      sanitized.customDescription = metaTagService.sanitizeCustomOverride(
        overrides.customDescription,
      );
    }
    if (overrides.customOgImage !== undefined) {
      sanitized.customOgImage = overrides.customOgImage; // URL already validated by Zod
    }
    if (Object.keys(sanitized).length === 0) {
      const existing = await metaTagRepository.findByChannelId(channelId);
      if (!existing) throw new Error(`Meta tags not found for channel ${channelId}`);
      return existing;
    }
    const updated = await metaTagRepository.updateCustomOverrides(channelId, sanitized);
    await MetaTagCache.invalidate(channelId);
    return updated;
  },
  async scheduleRegeneration(
    channelId: string,
    priority: 'high' | 'normal' | 'low' = 'normal',
    idempotencyKey?: string,
  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
    return metaTagUpdateQueue.scheduleUpdate({
      channelId,
      triggeredBy: 'manual',
      priority,
      idempotencyKey,
    });
  },

  async getRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus> {
    const job = await metaTagUpdateQueue.getJob(jobId);
    if (!job || job.data.channelId !== channelId) {
      throw new Error(`Meta tag regeneration job ${jobId} not found for channel ${channelId}`);
    }

    const state = await job.getState();
    return {
      jobId,
      channelId,
      status: mapQueueStateToStatus(state),
      attempts: job.attemptsMade,
      startedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
      completedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
      errorCode: null,
      errorMessage: job.failedReason ?? null,
    };
  },

  async getMetaTagsForPreview(channelId: string): Promise<MetaTagPreview> {
    const tags = await metaTagService.getOrGenerateCached(channelId);
    const { persisted } = await loadGenerationInputs(channelId);

    return buildPreviewFromTags(tags, persisted);
  },

  async getFallbackMetaTagsForPreview(channelId: string): Promise<MetaTagPreview> {
    const { channel, messages } = await loadPreviewFallbackInputs(channelId);
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    return buildPreviewFromTags(tags, null);
  },

  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
    return `${BASE_URL}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(channelSlug)}`;
  },

  async enqueueAdminJob(channelId: string, jobId: string): Promise<void> {
    await storeAdminJob({
      jobId,
      channelId,
      status: 'queued',
      attempts: 0,
      startedAt: null,
      completedAt: null,
      errorCode: null,
      errorMessage: null,
    });
    setImmediate(() => void processAdminRegenerationJob(channelId, jobId));
  },

  async getAdminJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus | null> {
    return getAdminJob(jobId);
  },
};
