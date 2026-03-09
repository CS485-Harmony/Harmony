'use server';

import { revalidatePath } from 'next/cache';
import { updateChannel, getChannel } from '@/services/channelService';
import { getServer } from '@/services/serverService';
import type { Channel } from '@/types';

export async function saveChannelSettings(
  serverSlug: string,
  channelSlug: string,
  patch: Partial<Pick<Channel, 'name' | 'topic' | 'description'>>,
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
  const sanitizedPatch: Partial<Pick<Channel, 'name' | 'topic' | 'description'>> = {};

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
  if (patch.description !== undefined) {
    if (typeof patch.description !== 'string') throw new Error('Invalid channel description');
    sanitizedPatch.description = patch.description;
  }

  // The backend updateChannel requires channelId and serverId
  await updateChannel(channel.id, server.id, sanitizedPatch);

  // Invalidate at layout level so sidebars (channel lists) across all pages
  // under the server segment also receive fresh data after a rename.
  revalidatePath(`/channels/${serverSlug}`, 'layout');
  revalidatePath(`/c/${serverSlug}`, 'layout');
  revalidatePath(`/settings/${serverSlug}`, 'layout');
}
