import { notFound } from 'next/navigation';
import { getServers, getServerMembers } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import { getMessages } from '@/services/messageService';
import { HarmonyShell } from '@/components/layout/HarmonyShell';
import { VisibilityGuard } from '@/components/channel/VisibilityGuard';

interface ChannelPageContentProps {
  serverSlug: string;
  channelSlug: string;
  /** When true, uses the /c basePath so sidebar links stay on the guest route. */
  isGuestView?: boolean;
}

export async function ChannelPageContent({
  serverSlug,
  channelSlug,
  isGuestView = false,
}: ChannelPageContentProps) {
  const servers = await getServers();
  const server = servers.find(s => s.slug === serverSlug);
  if (!server) notFound();

  const serverChannels = await getChannels(server.id);
  const channel = serverChannels.find(c => c.slug === channelSlug);
  if (!channel) notFound();

  // Gather all channels across servers for cross-server navigation
  const allChannels = (
    await Promise.all(
      servers.map(s => (s.id === server.id ? Promise.resolve(serverChannels) : getChannels(s.id))),
    )
  ).flat();

  // Service returns newest-first (both public and tRPC paths); reverse for chronological display
  const [{ messages }, members] = await Promise.all([
    getMessages(channel.id, 1, { serverId: server.id }),
    getServerMembers(server.id),
  ]);
  const sortedMessages = [...messages].reverse();

  const shell = (
    <HarmonyShell
      servers={servers}
      currentServer={server}
      channels={serverChannels}
      allChannels={allChannels}
      currentChannel={channel}
      messages={sortedMessages}
      members={members}
      basePath={isGuestView ? '/c' : '/channels'}
    />
  );

  return (
    <VisibilityGuard visibility={channel.visibility} isLoading={false}>
      {shell}
    </VisibilityGuard>
  );
}
