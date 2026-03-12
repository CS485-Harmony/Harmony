import { redirect, notFound } from 'next/navigation';
import { getServers } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import { publicGet } from '@/lib/trpc-client';
import { ChannelType } from '@/types';

interface PageProps {
  params: Promise<{ serverSlug: string }>;
}

export default async function ServerPage({ params }: PageProps) {
  const { serverSlug } = await params;

  const servers = await getServers();
  const server = servers.find(s => s.slug === serverSlug);

  // Not in the user's member list — try the public channel view instead.
  if (!server) {
    const result = await publicGet<{ channels: { slug: string }[] }>(
      `/servers/${serverSlug}/channels`,
    );
    const firstPublic = result?.channels?.[0];
    if (firstPublic) redirect(`/c/${serverSlug}/${firstPublic.slug}`);
    notFound();
  }

  let channels;
  try {
    channels = await getChannels(server.id);
  } catch {
    // Not a member — fall back to public guest view.
    const result = await publicGet<{ channels: { slug: string }[] }>(
      `/servers/${serverSlug}/channels`,
    );
    const firstPublic = result?.channels?.[0];
    if (firstPublic) redirect(`/c/${serverSlug}/${firstPublic.slug}`);
    notFound();
  }

  const firstChannel = channels
    .filter(c => c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT)
    .sort((a, b) => a.position - b.position)[0];
  if (!firstChannel) notFound();

  redirect(`/channels/${serverSlug}/${firstChannel.slug}`);
}
