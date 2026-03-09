/**
 * Server Service (M1 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-channel-visibility-toggle.md
 */

import { cache } from 'react';
import type { Server, User, CreateServerInput } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

// ─── Type adapters ────────────────────────────────────────────────────────────

/** Maps the backend Prisma Server shape to the frontend Server type. */
function toFrontendServer(raw: Record<string, unknown>): Server {
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    icon: (raw.iconUrl as string | undefined) ?? (raw.icon as string | undefined),
    ownerId: raw.ownerId as string,
    description: (raw.description as string | undefined) ?? undefined,
    bannerUrl: raw.bannerUrl as string | undefined,
    memberCount: (raw.memberCount as number | undefined) ?? 0,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns all public servers from the backend.
 */
export async function getServers(): Promise<Server[]> {
  try {
    const data = await trpcQuery<Record<string, unknown>[]>('server.getServers');
    return (data ?? []).map(toFrontendServer);
  } catch (error) {
    console.error('[serverService.getServers] API call failed, returning empty list:', error);
    return [];
  }
}

/**
 * Returns a single server by its slug, or null if not found.
 */
export const getServer = cache(async (slug: string): Promise<Server | null> => {
  try {
    const data = await publicGet<Record<string, unknown> | null>(`/servers/${encodeURIComponent(slug)}`);
    if (!data) return null;
    return toFrontendServer(data);
  } catch (error) {
    console.error(`[serverService.getServer] API call failed for slug "${slug}":`, error);
    return null;
  }
});

/**
 * Returns all members (users) of a server by server ID.
 * TODO: Wire to a real backend endpoint when getServerMembers is implemented.
 * Currently the backend has no member list endpoint, so we return the memberCount
 * from the server and an empty array. The UI should show memberCount from server data.
 */
export async function getServerMembers(_serverId: string): Promise<User[]> {
  // The backend does not yet expose a getServerMembers endpoint.
  // Return an empty array; callers should use server.memberCount for display.
  return [];
}

/**
 * Updates editable metadata of a server via the tRPC API.
 */
export async function updateServer(
  id: string,
  patch: Partial<Pick<Server, 'name' | 'description' | 'icon'>>,
): Promise<Server> {
  const data = await trpcMutate<Record<string, unknown>>('server.updateServer', {
    id,
    ...(patch.name !== undefined && { name: patch.name }),
    ...(patch.description !== undefined && { description: patch.description }),
    ...(patch.icon !== undefined && { iconUrl: patch.icon }),
  });
  return toFrontendServer(data);
}

/**
 * Deletes a server by ID via the tRPC API. Returns true if deleted.
 */
export async function deleteServer(id: string): Promise<boolean> {
  await trpcMutate('server.deleteServer', { id });
  return true;
}

/**
 * Creates a new server via the tRPC API.
 * The backend auto-creates a default "general" channel.
 */
export async function createServer(input: CreateServerInput): Promise<Server> {
  const data = await trpcMutate<Record<string, unknown>>('server.createServer', {
    name: input.name,
    description: input.description,
  });
  return toFrontendServer(data);
}
