import { redirect } from 'next/navigation';
import { getServers } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import { publicGet, TrpcHttpError } from '@/lib/trpc-client';
import { ChannelType, ChannelVisibility } from '@/types';
import type { Server, Channel } from '@/types';
import { EmptyShell } from '@/components/layout/EmptyShell';
import { NoChannelsContent } from '@/components/channel/NoChannelsContent';

interface PageProps {
  params: Promise<{ serverSlug: string }>;
}

export default async function ServerPage({ params }: PageProps) {
  const { serverSlug } = await params;

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

  // Not in the user's member list — try the public channel view instead.
  if (!server) {
    const result = await publicGet<{ channels: { slug: string }[] }>(
      `/servers/${serverSlug}/channels`,
    );
    const firstPublic = result?.channels?.[0];
    if (firstPublic) redirect(`/c/${serverSlug}/${firstPublic.slug}`);
    // Server not found publicly either — fall back to channels index.
    redirect('/channels');
  }

  let channels: Channel[];
  try {
    channels = await getChannels(server.id);
  } catch {
    // Not a member — fall back to public guest view.
    const result = await publicGet<{ channels: { slug: string }[] }>(
      `/servers/${serverSlug}/channels`,
    );
    const firstPublic = result?.channels?.[0];
    if (firstPublic) redirect(`/c/${serverSlug}/${firstPublic.slug}`);
    // No public channels either — fall back to channels index.
    redirect('/channels');
  }

  // Only route to non-PRIVATE text/announcement channels. PRIVATE channels require
  // an admin/owner role to read; routing a regular member there causes VisibilityGuard
  // to show a dead-end full-screen "no permission" page with no navigation. Admins
  // can still reach private channels by clicking them in the channel sidebar.
  const firstChannel = channels
    .filter(
      c =>
        (c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT) &&
        c.visibility !== ChannelVisibility.PRIVATE,
    )
    .sort((a, b) => a.position - b.position)[0];

  if (firstChannel) {
    redirect(`/channels/${serverSlug}/${firstChannel.slug}`);
  }

  // No non-private navigable channel found. Fetch all channels across every server
  // so ServerRail can derive default channel slugs for navigation.
  const allChannels = (
    await Promise.all(
      servers.map(s =>
        s.id === server.id ? Promise.resolve(channels) : getChannels(s.id).catch(() => []),
      ),
    )
  ).flat();

  // Determine what to show in the main area:
  //   • Text/announcement channels exist but are all PRIVATE → user lacks permission
  //   • No channels at all → empty server
  //   • Only voice channels → user CAN access them; leave main blank so they can join
  const hasInaccessibleTextChannels = channels.some(
    c =>
      (c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT) &&
      c.visibility === ChannelVisibility.PRIVATE,
  );
  const showNoAccessMessage = channels.length === 0 || hasInaccessibleTextChannels;

  // Only show channels members can actually navigate to in the sidebar. Private
  // text/announcement channels are excluded so regular members don't see links they
  // can't open; voice channels are kept so members can still join them.
  const sidebarChannels = showNoAccessMessage
    ? channels.filter(
        c =>
          c.type === ChannelType.VOICE ||
          c.visibility !== ChannelVisibility.PRIVATE,
      )
    : channels;

  return (
    <EmptyShell
      servers={servers}
      currentServer={server}
      channels={sidebarChannels}
      allChannels={allChannels}
      basePath='/channels'
    >
      {showNoAccessMessage ? <NoChannelsContent /> : null}
    </EmptyShell>
  );
}
