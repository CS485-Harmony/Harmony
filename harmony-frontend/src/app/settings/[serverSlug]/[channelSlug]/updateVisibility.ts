'use server';

/**
 * Server Action: updateChannelVisibility (Issue #30 — VisibilityToggle)
 * Resolves channel by route params, updates visibility via the tRPC API, and
 * revalidates all affected routes so guests and admins see fresh data.
 * Mirrors the pattern from actions.ts (saveChannelSettings).
 *
 * Auth note: `channel.setVisibility` tRPC procedure uses
 * `withPermission('channel:manage_visibility')`, which enforces authentication
 * and verifies the caller has admin-level permission in the server.
 * Unauthenticated or unauthorised requests are rejected with UNAUTHORIZED/FORBIDDEN.
 * See: harmony-backend/src/trpc/routers/channel.router.ts
 */

import { revalidatePath } from 'next/cache';
import { ChannelVisibility } from '@/types';
import { updateVisibility, getChannelAuthenticated } from '@/services/channelService';
import { getServerAuthenticated } from '@/services/serverService';

export async function updateChannelVisibility(
  serverSlug: string,
  channelSlug: string,
  visibility: ChannelVisibility,
): Promise<void> {
  // Validate the incoming enum value — don't trust client-supplied strings.
  if (!Object.values(ChannelVisibility).includes(visibility)) {
    throw new Error('Invalid visibility value');
  }

  // Resolve server first (authenticated — works for private servers too)
  const server = await getServerAuthenticated(serverSlug);
  if (!server) {
    throw new Error('Server not found');
  }

  // Resolve channel by slug using server ID so the client cannot target an arbitrary ID.
  const channel = await getChannelAuthenticated(server.id, channelSlug);
  if (!channel) {
    throw new Error('Channel not found');
  }

  await updateVisibility(channel.id, visibility, server.id);

  // Invalidate all route segments that render channel visibility data.
  revalidatePath(`/c/${serverSlug}`, 'layout');
  revalidatePath(`/channels/${serverSlug}`, 'layout');
  revalidatePath(`/settings/${serverSlug}`, 'layout');
}
