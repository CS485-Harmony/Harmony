// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
import type { ChannelContext, OpenGraphTags, TwitterCardTags, MetaTagSet, IMetaTagGenerator, ContentAnalysis } from './types';

const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
const SITE_NAME = 'Harmony';
const TWITTER_SITE = '@harmonychat';

export const OpenGraphGenerator: IMetaTagGenerator & {
  defaultImage: string;
  // Spec §9.1.4: generateOGTags(channel, server, analysis)
  generateOGTags(channel: ChannelContext, server: unknown, analysis: ContentAnalysis): OpenGraphTags;
  // Spec §9.1.4: generateTwitterCard(channel, server, analysis)
  generateTwitterCard(channel: ChannelContext, server: unknown, analysis: ContentAnalysis, image?: string): TwitterCardTags;
  // Spec §9.1.4: selectPreviewImage(channel, messages): string | null
  selectPreviewImage(channel: ChannelContext, messages: unknown[]): string | null;
} = {
  defaultImage: DEFAULT_IMAGE,

  // M2 skeleton: title from analysis.topics[0], description from analysis.summary; full NLP integration by M4
  generateOGTags(channel: ChannelContext, _server: unknown, analysis: ContentAnalysis): OpenGraphTags {
    return {
      ogTitle: analysis.topics[0] ?? channel.name,
      ogDescription: analysis.summary,
      ogImage: OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE,
      ogType: 'website',
      ogUrl: channel.canonicalUrl,
      ogSiteName: SITE_NAME,
    };
  },

  generateTwitterCard(
    channel: ChannelContext,
    _server: unknown,
    analysis: ContentAnalysis,
    image?: string,
  ): TwitterCardTags {
    const resolvedImage = image ?? OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE;
    const isCustomImage = resolvedImage !== DEFAULT_IMAGE;
    return {
      card: isCustomImage ? 'summary_large_image' : 'summary',
      title: analysis.topics[0] ?? channel.name,
      description: analysis.summary,
      image: resolvedImage,
      site: TWITTER_SITE,
    };
  },

  // M2 skeleton: always returns default image; real selection by M4 (messages/channel avatars)
  selectPreviewImage(_channel: ChannelContext, _messages: unknown[]): string | null {
    return DEFAULT_IMAGE;
  },

  // CL-I1 stubs — full generate/validate wired by M4
  generate(): MetaTagSet {
    throw new Error('OpenGraphGenerator.generate() not yet implemented — wired by M4');
  },
  validate(): boolean {
    throw new Error('OpenGraphGenerator.validate() not yet implemented — wired by M4');
  },
};
