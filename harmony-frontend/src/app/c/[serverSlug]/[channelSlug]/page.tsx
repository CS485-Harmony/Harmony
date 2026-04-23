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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serverSlug, channelSlug } = await params;
  const [server, channelResult, publicMetaTags] = await Promise.all([
    fetchPublicServer(serverSlug),
    fetchPublicChannel(serverSlug, channelSlug),
    fetchPublicMetaTags(serverSlug, channelSlug),
  ]);

  const channel = channelResult && !channelResult.isPrivate ? channelResult.channel : null;
  const channelName = channel?.name ?? channelSlug;
  const serverName = server?.name ?? serverSlug;
  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;
  const description =
    publicMetaTags?.description ??
    channel?.topic ??
    server?.description ??
    `Join ${serverName} on Harmony`;
  const title = publicMetaTags?.title ?? `${channelName} - ${serverName} | Harmony`;
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
  };
}

export default async function GuestChannelPage({ params }: PageProps) {
  const { serverSlug, channelSlug } = await params;
  return <GuestChannelView serverSlug={serverSlug} channelSlug={channelSlug} />;
}
