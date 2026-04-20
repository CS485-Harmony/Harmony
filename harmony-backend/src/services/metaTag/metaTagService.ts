// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
import { TitleGenerator } from './titleGenerator';
import { DescriptionGenerator } from './descriptionGenerator';
import { OpenGraphGenerator } from './openGraphGenerator';
import { StructuredDataGenerator } from './structuredDataGenerator';
import { MetaTagCache } from './metaTagCache';
import type { MetaTagSet, ChannelContext, MessageContext } from './types';
import { createLogger } from '../../lib/logger';

const logger = createLogger({ component: 'meta-tag-service' });

const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

function buildFallbackTags(channel: ChannelContext): MetaTagSet {
  const title = `${channel.name} — ${channel.serverName}`;
  const description = `Discussions in #${channel.name} on ${channel.serverName}.`;
  return {
    title: TitleGenerator.truncateWithEllipsis(title),
    description: DescriptionGenerator.enforceLength(description),
    canonical: channel.canonicalUrl,
    robots: 'index, follow',
    openGraph: OpenGraphGenerator.generateOGTags(channel, title, description),
    twitter: OpenGraphGenerator.generateTwitterCard(title, description),
    structuredData: StructuredDataGenerator.generateDiscussionForum(channel, title, description),
    keywords: [],
    needsRegeneration: true,
  };
}

export const metaTagService = {
  async generateMetaTags(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
    try {
      const title = TitleGenerator.generateFromThread(messages, channel);
      const description = DescriptionGenerator.generateFromMessages(messages, channel);
      const og = OpenGraphGenerator.generateOGTags(channel, title, description);
      const twitter = OpenGraphGenerator.generateTwitterCard(title, description, og.ogImage);
      const structuredData = StructuredDataGenerator.generateDiscussionForum(
        channel,
        title,
        description,
      );
      const keywords = DescriptionGenerator.extractKeyPhrases(messages);

      return {
        title,
        description,
        canonical: channel.canonicalUrl,
        robots: 'index, follow',
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

  async getOrGenerateCached(
    channel: ChannelContext,
    messages: MessageContext[],
    ttl?: number,
  ): Promise<MetaTagSet> {
    const cached = await MetaTagCache.get(channel.id);
    if (cached) return cached;

    const tags = await this.generateMetaTags(channel, messages);
    await MetaTagCache.set(channel.id, tags, ttl);
    return tags;
  },

  async invalidateCache(channelId: string): Promise<void> {
    await MetaTagCache.invalidate(channelId);
  },

  // scheduleRegeneration and getRegenerationJobStatus are stubs —
  // full implementation depends on M4 (worker/queue) from issue #356
  async scheduleRegeneration(_channelId: string): Promise<void> {
    // Queuing logic wired by M4 MetaTagUpdateWorker
  },

  async getRegenerationJobStatus(_channelId: string): Promise<{ status: string } | null> {
    return null;
  },

  async getMetaTagsForPreview(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
    return this.generateMetaTags(channel, messages);
  },

  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;
  },
};
