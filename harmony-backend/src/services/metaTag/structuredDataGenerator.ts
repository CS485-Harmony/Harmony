// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
import type { ChannelContext, MessageContext, MetaTagSet, StructuredData } from './types';

const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

export const StructuredDataGenerator = {
  // Spec §9.1.5: generateDiscussionForum(channel, messages, server)
  // M2 skeleton: derived from channel context; message/server integration by M4
  generateDiscussionForum(channel: ChannelContext, _messages: MessageContext[], _server: unknown): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      headline: `${channel.name} — ${channel.serverName}`,
      description: `Discussions in #${channel.name} on ${channel.serverName}.`,
      // author and datePublished are stub fields — populated by M4 when message data is available
      author: undefined,
      datePublished: undefined,
      dateModified: undefined,
      mainEntity: {
        '@type': 'WebPage',
        url: channel.canonicalUrl,
      },
    };
  },

  // Spec §9.1.5: generateBreadcrumbList(server, channel): StructuredData
  generateBreadcrumbList(_server: unknown, channel: ChannelContext): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: channel.serverName,
          item: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,
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

  // Spec §9.1.5: generateOrganization(server): StructuredData
  generateOrganization(_server: unknown): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Harmony',
      url: BASE_URL,
    };
  },

  // Spec §9.1.5: generateWebPage(channel, metaTags)
  generateWebPage(channel: ChannelContext, metaTags: MetaTagSet): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      headline: metaTags.title,
      description: metaTags.description,
      mainEntity: {
        '@type': 'WebPage',
        url: channel.canonicalUrl,
      },
    };
  },
};
