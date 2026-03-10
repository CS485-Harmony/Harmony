/**
 * Channel Service (M2 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-channel-visibility-toggle.md
 */

import { cache } from 'react';
import { ChannelVisibility, type Channel } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

// ─── Type adapters ────────────────────────────────────────────────────────────

/** Maps the backend Prisma Channel shape to the frontend Channel type. */
function toFrontendChannel(raw: Record<string, unknown>): Channel {
  // Warn on missing required fields to catch backend shape mismatches early.
  if (typeof raw.id !== 'string') console.warn('[toFrontendChannel] missing or non-string "id"');
  if (typeof raw.serverId !== 'string') console.warn('[toFrontendChannel] missing or non-string "serverId"');
  if (typeof raw.slug !== 'string') console.warn('[toFrontendChannel] missing or non-string "slug"');
  if (typeof raw.createdAt !== 'string') console.warn('[toFrontendChannel] missing or non-string "createdAt"');
  return {
    id: raw.id as string,
    serverId: raw.serverId as string,
    name: raw.name as string,
    slug: raw.slug as string,
    type: raw.type as Channel['type'],
    visibility: raw.visibility as ChannelVisibility,
    topic: (raw.topic as string | undefined) ?? undefined,
    position: (raw.position as number) ?? 0,
    description: raw.description as string | undefined,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns all channels for a given server.
 * Uses tRPC authed endpoint for full channel list (including PRIVATE channels).
 * Errors propagate to the caller — callers that use the channel count (e.g.
 * createChannelAction position computation) must not silently receive [] on a
 * transient failure, which would corrupt channel ordering.
 */
export async function getChannels(serverId: string): Promise<Channel[]> {
  const data = await trpcQuery<Record<string, unknown>[]>('channel.getChannels', { serverId });
  return (data ?? []).map(toFrontendChannel);
}

/**
 * Returns a single channel by server slug + channel slug, or null if not found.
 *
 * Strategy: try the public REST endpoint first so that guest `/c/*` pages work
 * for PUBLIC_INDEXABLE channels without requiring an auth cookie. If the channel
 * is not listed there (non-public or not found), fall back to the authenticated
 * tRPC procedure.
 *
 * Note: the public endpoint returns only PUBLIC_INDEXABLE channels and omits
 * fields like `serverId`, `visibility`, `position`, and `createdAt`. These are
 * filled in from context (serverId from the server lookup, visibility hardcoded
 * to PUBLIC_INDEXABLE).
 */
export const getChannel = cache(async (serverSlug: string, channelSlug: string): Promise<Channel | null> => {
  // Resolve server first — needed both to supply serverId for the public channel
  // list and as input to the tRPC fallback.
  const serverData = await publicGet<Record<string, unknown>>(
    `/servers/${encodeURIComponent(serverSlug)}`,
  );
  if (!serverData) return null;
  const serverId = serverData.id as string;

  // Try the public REST endpoint. It returns only PUBLIC_INDEXABLE channels, so
  // a hit here means we can serve the guest view without an auth cookie.
  try {
    const publicData = await publicGet<{ channels: Record<string, unknown>[] }>(
      `/servers/${encodeURIComponent(serverSlug)}/channels`,
    );
    if (publicData) {
      const match = publicData.channels.find(
        (c) => (c.slug as string) === channelSlug,
      );
      if (match) {
        return toFrontendChannel({
          ...match,
          serverId,
          visibility: 'PUBLIC_INDEXABLE',
          position: (match.position as number | undefined) ?? 0,
          createdAt: (match.createdAt as string | undefined) ?? new Date(0).toISOString(),
        });
      }
    }
  } catch {
    // Public endpoint failed — continue to tRPC fallback.
  }

  // Fall back to the authenticated tRPC procedure (for PRIVATE / PUBLIC_NO_INDEX channels).
  try {
    const data = await trpcQuery<Record<string, unknown>>('channel.getChannel', {
      serverId,
      serverSlug,
      channelSlug,
    });
    if (!data) return null;
    return toFrontendChannel(data);
  } catch (error) {
    console.error(`[channelService.getChannel] API call failed for "${serverSlug}/${channelSlug}":`, error);
    return null;
  }
});

/**
 * Updates the visibility of a channel via tRPC.
 * Returns the visibility change result (not a full Channel object).
 */
export async function updateVisibility(
  channelId: string,
  visibility: ChannelVisibility,
  serverId?: string,
): Promise<void> {
  if (!serverId) {
    throw new Error('serverId is required for updateVisibility');
  }
  await trpcMutate('channel.setVisibility', {
    serverId,
    channelId,
    visibility,
  });
}

/**
 * Updates editable metadata (name, topic) of a channel via tRPC.
 * Note: `description` is not forwarded — the backend only supports `name`, `topic`, and `position`.
 */
export async function updateChannel(
  channelId: string,
  serverId: string,
  patch: Partial<Pick<Channel, 'name' | 'topic'>>,
): Promise<Channel> {
  const data = await trpcMutate<Record<string, unknown>>('channel.updateChannel', {
    serverId,
    channelId,
    ...(patch.name !== undefined && { name: patch.name }),
    ...(patch.topic !== undefined && { topic: patch.topic }),
  });
  return toFrontendChannel(data);
}

/**
 * Creates a new channel via tRPC.
 */
export async function createChannel(
  channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Channel> {
  const data = await trpcMutate<Record<string, unknown>>('channel.createChannel', {
    serverId: channel.serverId,
    name: channel.name,
    slug: channel.slug,
    type: channel.type,
    visibility: channel.visibility,
    topic: channel.topic,
    position: channel.position,
  });
  return toFrontendChannel(data);
}

/**
 * Deletes a channel by ID via tRPC. Returns true if deleted.
 */
export async function deleteChannel(channelId: string, serverId?: string): Promise<boolean> {
  if (!serverId) {
    throw new Error('serverId is required for deleteChannel');
  }
  await trpcMutate('channel.deleteChannel', { serverId, channelId });
  return true;
}

// Re-export ChannelVisibility for convenience
export { ChannelVisibility };
