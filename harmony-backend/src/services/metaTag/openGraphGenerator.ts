// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
import type { ChannelContext, OpenGraphTags, TwitterCardTags } from './types';

const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
const SITE_NAME = 'Harmony';
const TWITTER_SITE = '@harmonychat';

export const OpenGraphGenerator = {
  defaultImage: DEFAULT_IMAGE,

  generateOGTags(channel: ChannelContext, title: string, description: string): OpenGraphTags {
    return {
      ogTitle: title,
      ogDescription: description,
      ogImage: this.selectPreviewImage(channel),
      ogType: 'website',
      ogUrl: channel.canonicalUrl,
      ogSiteName: SITE_NAME,
    };
  },

  generateTwitterCard(title: string, description: string, image?: string): TwitterCardTags {
    return {
      card: 'summary_large_image',
      title,
      description,
      image: image ?? DEFAULT_IMAGE,
      site: TWITTER_SITE,
    };
  },

  selectPreviewImage(_channel: ChannelContext): string {
    return DEFAULT_IMAGE;
  },
};
