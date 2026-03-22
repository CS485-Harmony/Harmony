import { notFound, redirect } from 'next/navigation';
import { getServers, getServerMembers } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import { getMessages } from '@/services/messageService';
import { getCurrentUser } from '@/services/authService';
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

  let serverChannels;
  try {
    serverChannels = await getChannels(server.id);
  } catch {
    // User is authenticated but not a member of this server — show public guest view.
    redirect(`/c/${serverSlug}/${channelSlug}`);
  }
  const channel = serverChannels.find(c => c.slug === channelSlug);
  if (!channel) notFound();

  // Gather all channels across servers for cross-server navigation.
  // Use .catch(() => []) so a FORBIDDEN error for servers the authenticated
  // user is not a member of degrades gracefully instead of crashing the page.
  const allChannels = (
    await Promise.all(
      servers.map(s =>
        s.id === server.id ? Promise.resolve(serverChannels) : getChannels(s.id).catch(() => []),
      ),
    )
  ).flat();

  // Service returns newest-first (both public and tRPC paths); reverse for chronological display
  const [{ messages }, members, currentUser] = await Promise.all([
    getMessages(channel.id, 1, { serverId: server.id }),
    getServerMembers(server.id),
    getCurrentUser(),
  ]);
  const sortedMessages = [...messages].reverse();

  // Derive the current user's server-scoped admin status from the member list.
  // We cannot rely on AuthContext isAdmin() with no arg here because it checks
  // the global User.role, which mapBackendUser always sets to 'member' for
  // non-system-admin users. The member list carries the correct server-scoped role.
  const currentMember = currentUser ? members.find(m => m.id === currentUser.id) : undefined;
  const isServerAdmin =
    currentMember?.role === 'admin' || currentMember?.role === 'owner';

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
    <VisibilityGuard
      visibility={channel.visibility}
      isLoading={false}
      serverOwnerId={server.ownerId}
      isServerAdmin={isServerAdmin}
    >
      {shell}
    </VisibilityGuard>
  );
}
