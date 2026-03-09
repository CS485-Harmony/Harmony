import { notFound } from 'next/navigation';
import { getChannel } from '@/services/channelService';
import { getServer } from '@/services/serverService';
import { ChannelSettingsPage } from '@/components/settings/ChannelSettingsPage';

interface PageProps {
  params: Promise<{ serverSlug: string; channelSlug: string }>;
}

export default async function SettingsPage({ params }: PageProps) {
  const { serverSlug, channelSlug } = await params;

  const [channel, server] = await Promise.all([
    getChannel(serverSlug, channelSlug),
    getServer(serverSlug),
  ]);
  if (!channel) notFound();

  return (
    <ChannelSettingsPage
      channel={channel}
      serverSlug={serverSlug}
      serverOwnerId={server?.ownerId}
    />
  );
}
