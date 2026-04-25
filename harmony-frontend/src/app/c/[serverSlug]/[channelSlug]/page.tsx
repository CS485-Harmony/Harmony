import type { Metadata } from 'next';
import { GuestChannelView } from '@/components/channel/GuestChannelView';
import {
  fetchPublicServer,
  fetchPublicChannel,
  fetchPublicMetaTags,
} from '@/services/publicApiService';
import { ChannelVisibility } from '@/types';
import { getChannelUrl } from '@/lib/runtime-config';

interface PageProps {
  params: Promise<{ serverSlug: string; channelSlug: string }>;
}

function getSeoContent(
  serverSlug: string,
  channelSlug: string,
  server: Awaited<ReturnType<typeof fetchPublicServer>>,
  channelResult: Awaited<ReturnType<typeof fetchPublicChannel>>,
  publicMetaTags: Awaited<ReturnType<typeof fetchPublicMetaTags>>,
) {
  const channel = channelResult && !channelResult.isPrivate ? channelResult.channel : null;
  const channelName = channel?.name ?? channelSlug;
  const serverName = server?.name ?? serverSlug;
  const title = publicMetaTags?.title ?? `${channelName} - ${serverName} | Harmony`;
  const description =
    publicMetaTags?.description ??
    channel?.topic ??
    server?.description ??
    `Join ${serverName} on Harmony`;

  return {
    channel,
    serverName,
    title,
    description,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serverSlug, channelSlug } = await params;
  const [server, channelResult, publicMetaTags] = await Promise.all([
    fetchPublicServer(serverSlug),
    fetchPublicChannel(serverSlug, channelSlug),
    fetchPublicMetaTags(serverSlug, channelSlug),
  ]);

  const { channel, title, description } = getSeoContent(
    serverSlug,
    channelSlug,
    server,
    channelResult,
    publicMetaTags,
  );
  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;
  const canonicalUrl = getChannelUrl(serverSlug, channelSlug);

  return {
    title,
    description,
    robots: { index: isIndexable, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: publicMetaTags?.ogTitle ?? title,
      description: publicMetaTags?.ogDescription ?? description,
      type: 'website',
      url: canonicalUrl,
      ...(publicMetaTags?.ogImage ? { images: [{ url: publicMetaTags.ogImage }] } : {}),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function GuestChannelPage({ params }: PageProps) {
  const { serverSlug, channelSlug } = await params;

  // Fetch data for JSON-LD; React cache deduplicates these within the same render pass
  const [server, channelResult, publicMetaTags] = await Promise.all([
    fetchPublicServer(serverSlug),
    fetchPublicChannel(serverSlug, channelSlug),
    fetchPublicMetaTags(serverSlug, channelSlug),
  ]);

  const { channel, serverName, title, description } = getSeoContent(
    serverSlug,
    channelSlug,
    server,
    channelResult,
    publicMetaTags,
  );
  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;

  const jsonLd = isIndexable
    ? {
        '@context': 'https://schema.org',
        '@type': 'DiscussionForumPosting',
        'name': title,
        'headline': title,
        'url': getChannelUrl(serverSlug, channelSlug),
        'description': description,
        'text': description,
        'author': {
          '@type': 'Organization',
          'name': serverName,
        },
        ...(channel?.createdAt && { datePublished: channel.createdAt }),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type='application/ld+json'
          // Escape </script> breakout sequences per OWASP JSON-LD injection guidance
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
              .replace(/</g, '\\u003c')
              .replace(/>/g, '\\u003e')
              .replace(/&/g, '\\u0026'),
          }}
        />
      )}
      <GuestChannelView serverSlug={serverSlug} channelSlug={channelSlug} />
    </>
  );
}
