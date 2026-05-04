import { notFound } from 'next/navigation';
import { getChannelAuthenticated, getChannels } from '@/services/channelService';
import { ChannelSettingsPage } from '@/components/settings/ChannelSettingsPage';
import { requireServerSettingsAccess } from '@/app/settings/[serverSlug]/settings-access';
import { ChannelType } from '@/types';

interface PageProps {
  params: Promise<{ serverSlug: string; channelSlug: string }>;
}

export default async function SettingsPage({ params }: PageProps) {
  const { serverSlug, channelSlug } = await params;
  const server = await requireServerSettingsAccess(serverSlug);

  const channel = await getChannelAuthenticated(server.id, channelSlug);
  if (!channel) notFound();

  const allChannels = await getChannels(channel.serverId);
  const textChannelCount = allChannels.filter(c => c.type === ChannelType.TEXT).length;
  const isLastTextChannel = channel.type === ChannelType.TEXT && textChannelCount <= 1;

  return (
    <ChannelSettingsPage
      channel={channel}
      serverSlug={serverSlug}
      canManageSeo
      isLastTextChannel={isLastTextChannel}
    />
  );
}
