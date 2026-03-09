'use server';

import { revalidatePath } from 'next/cache';
import { createServer } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import type { Server, Channel } from '@/types';

export async function createServerAction(
  name: string,
  description?: string,
): Promise<{ server: Server; defaultChannel: Channel }> {
  if (typeof name !== 'string') throw new Error('Invalid server name');
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Server name is required.');
  if (trimmed.length > 100) throw new Error('Server name must be 100 characters or fewer.');

  let sanitizedDescription: string | undefined;
  if (typeof description === 'undefined') {
    sanitizedDescription = undefined;
  } else if (typeof description === 'string') {
    const descTrimmed = description.trim();
    sanitizedDescription = descTrimmed || undefined;
  } else {
    throw new Error('Invalid server description');
  }

  // The backend createServer auto-creates a default "general" channel
  const server = await createServer({ name: trimmed, description: sanitizedDescription });

  // Fetch the default channel created by the backend
  const channels = await getChannels(server.id);
  const defaultChannel = channels.find(c => c.slug === 'general') ?? channels[0];

  if (!defaultChannel) {
    throw new Error('Server created but no default channel found');
  }

  revalidatePath('/channels', 'layout');
  revalidatePath('/c', 'layout');
  revalidatePath('/settings', 'layout');

  return { server, defaultChannel };
}
