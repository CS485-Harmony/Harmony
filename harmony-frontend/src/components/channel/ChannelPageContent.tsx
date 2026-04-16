import { notFound, redirect } from 'next/navigation';
import { getServers, getServerMembers } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import { getMessages } from '@/services/messageService';
import { getCurrentUser } from '@/services/authService';
import { HarmonyShell } from '@/components/layout/HarmonyShell';
import { PrivateChannelLockedPane } from '@/components/channel/PrivateChannelLockedPane';
import { ChannelVisibility } from '@/types';

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

  let serverChannels;
  try {
    serverChannels = await getChannels(server.id);
  } catch {
    redirect(`/c/${serverSlug}/${channelSlug}`);
  }
  const channel = serverChannels.find(c => c.slug === channelSlug);
  if (!channel) notFound();

  const allChannels = (
    await Promise.all(
      servers.map(s =>
        s.id === server.id ? Promise.resolve(serverChannels) : getChannels(s.id).catch(() => []),
      ),
    )
  ).flat();

  const [members, currentUser] = await Promise.all([getServerMembers(server.id), getCurrentUser()]);

  const currentMember = currentUser ? members.find(m => m.id === currentUser.id) : undefined;
  const isServerAdmin =
    currentUser?.isSystemAdmin ||
    currentMember?.role === 'admin' ||
    currentMember?.role === 'owner';
  const isLockedPrivateChannel = channel.visibility === ChannelVisibility.PRIVATE && !isServerAdmin;
  const sortedMessages = isLockedPrivateChannel
    ? []
    : [...(await getMessages(channel.id, 1, { serverId: server.id })).messages].reverse();

  return (
    <HarmonyShell
      servers={servers}
      currentServer={server}
      channels={serverChannels}
      allChannels={allChannels}
      currentChannel={channel}
      messages={sortedMessages}
      members={members}
      basePath={isGuestView ? '/c' : '/channels'}
      lockedMessagePane={
        isLockedPrivateChannel ? (
          <PrivateChannelLockedPane mode={currentUser ? 'member' : 'guest'} />
        ) : undefined
      }
    />
  );
}
