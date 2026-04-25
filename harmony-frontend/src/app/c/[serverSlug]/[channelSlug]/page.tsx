import type { Metadata } from 'next';
import { GuestChannelView } from '@/components/channel/GuestChannelView';
import { fetchPublicServer, fetchPublicChannel } from '@/services/publicApiService';
import { ChannelVisibility } from '@/types';
import { getChannelUrl } from '@/lib/runtime-config';

interface PageProps {
  params: Promise<{ serverSlug: string; channelSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serverSlug, channelSlug } = await params;
  const [server, channelResult] = await Promise.all([
    fetchPublicServer(serverSlug),
    fetchPublicChannel(serverSlug, channelSlug),
  ]);

  const channel = channelResult && !channelResult.isPrivate ? channelResult.channel : null;
  const channelName = channel?.name ?? channelSlug;
  const serverName = server?.name ?? serverSlug;
  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;
  const description = channel?.topic ?? server?.description ?? `Join ${serverName} on Harmony`;
  const title = `${channelName} - ${serverName} | Harmony`;
  const canonicalUrl = getChannelUrl(serverSlug, channelSlug);

  return {
    title,
    description,
    robots: { index: isIndexable, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
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
  const [server, channelResult] = await Promise.all([
    fetchPublicServer(serverSlug),
    fetchPublicChannel(serverSlug, channelSlug),
  ]);

  const channel = channelResult && !channelResult.isPrivate ? channelResult.channel : null;
  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;

  const jsonLd = isIndexable
    ? {
        '@context': 'https://schema.org',
        '@type': 'DiscussionForumPosting',
        name: `${channel?.name ?? channelSlug} - ${server?.name ?? serverSlug} | Harmony`,
        url: getChannelUrl(serverSlug, channelSlug),
        description:
          channel?.topic ??
          server?.description ??
          `Join ${server?.name ?? serverSlug} on Harmony`,
        ...(channel?.createdAt && { datePublished: channel.createdAt }),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <GuestChannelView serverSlug={serverSlug} channelSlug={channelSlug} />
    </>
  );
}
