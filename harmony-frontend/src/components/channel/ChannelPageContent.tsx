import { redirect } from 'next/navigation';
import { getServers, getServerMembers } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import { getMessages } from '@/services/messageService';
import { getCurrentUser } from '@/services/authService';
import { TrpcHttpError } from '@/lib/trpc-client';
import { HarmonyShell } from '@/components/layout/HarmonyShell';
import { VisibilityGuard } from '@/components/channel/VisibilityGuard';
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
    // User is authenticated but not a member of this server — show public guest view.
    redirect(`/c/${serverSlug}/${channelSlug}`);
  }
  const channel = serverChannels.find(c => c.slug === channelSlug);
  // Channel not found — redirect to channels index rather than showing a dead-end 404.
  if (!channel) redirect('/channels');

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
