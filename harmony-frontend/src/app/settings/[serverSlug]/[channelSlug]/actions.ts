'use server';

/**
 * Auth note: `channel.updateChannel` tRPC procedure uses `withPermission('channel:update')`,
 * which enforces authentication and verifies membership + role before any mutation is applied.
 * Unauthenticated or unauthorised requests are rejected by the backend with UNAUTHORIZED/FORBIDDEN.
 * See: harmony-backend/src/trpc/routers/channel.router.ts
 */

import { revalidatePath } from 'next/cache';
import { updateChannel, getChannel, getAuditLog } from '@/services/channelService';
import { getServer } from '@/services/serverService';
import type { Channel } from '@/types';
import type { AuditLogPage } from '@/services/channelService';

export async function saveChannelSettings(
  serverSlug: string,
  channelSlug: string,
  patch: Partial<Pick<Channel, 'name' | 'topic'>>,
): Promise<void> {
  // Resolve channel by route params (don't trust a raw channelId from the client)
  const channel = await getChannel(serverSlug, channelSlug);
  if (!channel) {
    throw new Error('Channel not found');
  }

  // Resolve server to get serverId for the API call
  const server = await getServer(serverSlug);
  if (!server) {
    throw new Error('Server not found');
  }

  // Build an explicit whitelist so callers cannot sneak in extra fields
  // (e.g. serverId, visibility) even though TS types restrict them at compile time.
  // Note: `description` is intentionally excluded — the backend `channel.updateChannel`
  // procedure only supports `name`, `topic`, and `position`.
  const sanitizedPatch: Partial<Pick<Channel, 'name' | 'topic'>> = {};

  if (patch.name !== undefined) {
    if (typeof patch.name !== 'string') throw new Error('Invalid channel name');
    const trimmed = patch.name.trim();
    if (!trimmed) throw new Error('Channel name cannot be empty');
    sanitizedPatch.name = trimmed;
  }
  if (patch.topic !== undefined) {
    if (typeof patch.topic !== 'string') throw new Error('Invalid channel topic');
    sanitizedPatch.topic = patch.topic;
  }

  // The backend updateChannel requires channelId and serverId
  await updateChannel(channel.id, server.id, sanitizedPatch);

  // Invalidate at layout level so sidebars (channel lists) across all pages
  // under the server segment also receive fresh data after a rename.
  revalidatePath(`/channels/${serverSlug}`, 'layout');
  revalidatePath(`/c/${serverSlug}`, 'layout');
  revalidatePath(`/settings/${serverSlug}`, 'layout');
}

/**
 * Server action: fetch paginated audit log for a channel.
 * Resolves IDs from route slugs (don't trust raw IDs from the client),
 * matching the same defense-in-depth pattern used by saveChannelSettings.
 */
export async function fetchAuditLog(
  serverSlug: string,
  channelSlug: string,
  options: { limit?: number; offset?: number } = {},
): Promise<AuditLogPage> {
  const channel = await getChannel(serverSlug, channelSlug);
  if (!channel) throw new Error('Channel not found');

  // channel.serverId is already resolved by getChannel — no redundant server lookup needed.
  return getAuditLog(channel.serverId, channel.id, options);
}
