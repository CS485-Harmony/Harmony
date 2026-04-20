// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
import type { ChannelContext, StructuredData } from './types';

export const StructuredDataGenerator = {
  generateDiscussionForum(channel: ChannelContext, title: string, description: string): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      headline: title,
      description,
      mainEntity: {
        '@type': 'WebPage',
        url: channel.canonicalUrl,
      },
    };
  },

  generateBreadcrumbList(channel: ChannelContext): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: channel.serverName,
          item: `https://harmony.chat/s/${channel.serverSlug}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: channel.name,
          item: channel.canonicalUrl,
        },
      ],
    };
  },

  generateOrganization(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Harmony',
      url: 'https://harmony.chat',
    };
  },

  generateWebPage(channel: ChannelContext, title: string, description: string): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      headline: title,
      description,
      mainEntity: {
        '@type': 'WebPage',
        url: channel.canonicalUrl,
      },
    };
  },
};
