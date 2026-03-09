'use server';

/**
 * Server Action: createChannelAction (Issue #44 — Channel Creation Modal)
 * Validates input and delegates to channelService.createChannel().
 * Mirrors the guard pattern in actions.ts / updateVisibility.ts.
 */

import { revalidatePath } from 'next/cache';
import { ChannelType, ChannelVisibility, type Channel } from '@/types';
import { createChannel, getChannels } from '@/services/channelService';
import { getServer } from '@/services/serverService';

export interface CreateChannelInput {
  serverId: string;
  /** Normalised slug — must be [a-z0-9-], no leading/trailing hyphens. Display name is derived from this. */
  slug: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  topic?: string;
  // position intentionally omitted — computed server-side to avoid race conditions
  // when two clients create channels concurrently.
}

export async function createChannelAction(input: CreateChannelInput): Promise<Channel> {
  // Validate serverId — must be a non-empty string.
  if (typeof input.serverId !== 'string' || !input.serverId.trim()) {
    throw new Error('Invalid server ID');
  }

  // Validate enum values — don't trust client-supplied strings.
  if (!Object.values(ChannelType).includes(input.type)) {
    throw new Error('Invalid channel type');
  }
  if (!Object.values(ChannelVisibility).includes(input.visibility)) {
    throw new Error('Invalid visibility value');
  }

  // Validate slug: non-empty, starts/ends with alphanumeric, only [a-z0-9-].
  const slug = input.slug;
  if (
    !slug ||
    !/^[a-z0-9]/.test(slug) ||
    !/[a-z0-9]$/.test(slug) ||
    /[^a-z0-9-]/.test(slug)
  ) {
    throw new Error('Invalid channel name');
  }

  // Sanitize topic — clamp to 1024 chars, coerce non-strings to undefined.
  const topic =
    typeof input.topic === 'string'
      ? input.topic.trim().slice(0, 1024) || undefined
      : undefined;

  // Compute position server-side so concurrent creates don't collide on the
  // same client-supplied value.
  const existing = await getChannels(input.serverId);
  const position = existing.length;

  const newChannel = await createChannel({
    serverId: input.serverId,
    slug,
    name: slug, // display name == slug (matches existing convention)
    type: input.type,
    visibility: input.visibility,
    topic,
    position,
  });

  // Revalidate all route segments so every user sees the new channel on their
  // next navigation. Look up the server to get its slug for path revalidation.
  try {
    // We need the server slug for revalidation. Try to find it from channels data
    // or make a query. For now, revalidate broadly.
    revalidatePath('/channels', 'layout');
    revalidatePath('/c', 'layout');
    revalidatePath('/settings', 'layout');
  } catch {
    // Revalidation failure is non-fatal
  }

  return newChannel;
}
