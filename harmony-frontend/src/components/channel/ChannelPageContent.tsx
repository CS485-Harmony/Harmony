import { redirect } from 'next/navigation';
import { getServers, getServerMembers } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import { getMessages } from '@/services/messageService';
import { TrpcHttpError, getSessionUser } from '@/lib/trpc-client';
import { HarmonyShell } from '@/components/layout/HarmonyShell';
import { PrivateChannelLockedPane } from '@/components/channel/PrivateChannelLockedPane';
import { ChannelVisibility } from '@/types';
import type { Server } from '@/types';

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
  let servers: Server[];
  try {
    servers = await getServers();
  } catch (err) {
    // Only redirect to login for auth failures; rethrow other errors (network, 5xx) so
    // Next.js surfaces them honestly rather than masking them as an auth problem.
    if (err instanceof TrpcHttpError && err.status === 401) redirect('/auth/login');
    throw err;
  }
  const server = servers.find(s => s.slug === serverSlug);
  // Server not found in member list — redirect to channels index which resolves
  // the user's first valid server dynamically.
  if (!server) redirect('/channels');

  let serverChannels;
  try {
    serverChannels = await getChannels(server.id);
  } catch {
    redirect(`/c/${serverSlug}/${channelSlug}`);
  }
  const channel = serverChannels.find(c => c.slug === channelSlug);
  // Channel not found — redirect to channels index rather than showing a dead-end 404.
  if (!channel) redirect('/channels');

  const allChannels = (
    await Promise.all(
      servers.map(s =>
        s.id === server.id ? Promise.resolve(serverChannels) : getChannels(s.id).catch(() => []),
      ),
    )
  ).flat();

  const [members, sessionUser] = await Promise.all([
    getServerMembers(server.id),
    getSessionUser(),
  ]);

  const currentMember = sessionUser ? members.find(m => m.id === sessionUser.id) : undefined;
  const isServerAdmin =
    sessionUser?.isSystemAdmin ||
    currentMember?.role === 'admin' ||
    currentMember?.role === 'owner';
  // Non-admin, non-authenticated users should not reach here with a private channel
  // because getChannels filters inaccessible channels server-side. The lock pane
  // still displays for unauthenticated guest views (/c/* route).
  const isLockedPrivateChannel = channel.visibility === ChannelVisibility.PRIVATE && !isServerAdmin && !sessionUser;
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
          <PrivateChannelLockedPane mode={sessionUser ? 'member' : 'guest'} />
        ) : undefined
      }
    />
  );
}
