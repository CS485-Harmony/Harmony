'use server';

/**
 * Server Action: updateChannelVisibility (Issue #30 — VisibilityToggle)
 * Resolves channel by route params, updates visibility via the tRPC API, and
 * revalidates all affected routes so guests and admins see fresh data.
 * Mirrors the pattern from actions.ts (saveChannelSettings).
 */

import { revalidatePath } from 'next/cache';
import { ChannelVisibility } from '@/types';
import { updateVisibility, getChannel } from '@/services/channelService';
import { getServer } from '@/services/serverService';

export async function updateChannelVisibility(
  serverSlug: string,
  channelSlug: string,
  visibility: ChannelVisibility,
): Promise<void> {
  // Validate the incoming enum value — don't trust client-supplied strings.
  if (!Object.values(ChannelVisibility).includes(visibility)) {
    throw new Error('Invalid visibility value');
  }

  // Resolve channel by slug so the client cannot target an arbitrary ID.
  const channel = await getChannel(serverSlug, channelSlug);
  if (!channel) {
    throw new Error('Channel not found');
  }

  // Resolve server to get serverId for the API call
  const server = await getServer(serverSlug);
  if (!server) {
    throw new Error('Server not found');
  }

  await updateVisibility(channel.id, visibility, server.id);

  // Invalidate all route segments that render channel visibility data.
  revalidatePath(`/c/${serverSlug}`, 'layout');
  revalidatePath(`/channels/${serverSlug}`, 'layout');
  revalidatePath(`/settings/${serverSlug}`, 'layout');
}
