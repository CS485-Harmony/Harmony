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
  // Warn on missing required fields to catch backend shape mismatches early.
  if (typeof raw.id !== 'string') console.warn('[toFrontendServer] missing or non-string "id"');
  if (typeof raw.slug !== 'string') console.warn('[toFrontendServer] missing or non-string "slug"');
  if (typeof raw.createdAt !== 'string') console.warn('[toFrontendServer] missing or non-string "createdAt"');
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
 * Errors propagate to the caller — returning [] on failure would silently render
 * an empty server list with no indication to the user that something went wrong.
 */
export async function getServers(): Promise<Server[]> {
  const data = await trpcQuery<Record<string, unknown>[]>('server.getServers');
  return (data ?? []).map(toFrontendServer);
}

/**
 * Returns a single server by its slug, or null if not found.
 */
export const getServer = cache(async (slug: string): Promise<Server | null> => {
  try {
    const data = await publicGet<Record<string, unknown>>(`/servers/${encodeURIComponent(slug)}`);
    if (!data) return null;
    return toFrontendServer(data);
  } catch (error) {
    console.error(`[serverService.getServer] API call failed for slug "${slug}":`, error);
    return null;
  }
});

/**
 * Mirrors the backend's exported `ServerMemberWithUser` shape.
 * Defined locally to avoid a cross-package import; must be kept in sync with
 * `harmony-backend/src/services/server.service.ts → ServerMemberWithUser`.
 */
interface BackendServerMember {
  userId: string;
  serverId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    status: string;
  };
}

/** Maps a backend ServerMember+User record to the frontend User type. */
function toFrontendMember(raw: BackendServerMember): User {
  const user = raw.user;
  const roleMap: Record<string, User['role']> = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    MEMBER: 'member',
    GUEST: 'guest',
  };
  const statusMap: Record<string, User['status']> = {
    ONLINE: 'online',
    IDLE: 'idle',
    DND: 'dnd',
    OFFLINE: 'offline',
  };
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName ?? undefined,
    avatar: user.avatarUrl ?? undefined,
    status: statusMap[user.status] ?? 'offline',
    role: roleMap[raw.role] ?? 'member',
  };
}

/**
 * Returns all members of a server by server ID.
 * Calls the authenticated tRPC `server.getMembers` endpoint.
 * Returns [] if the request fails (e.g. unauthenticated callers on guest views).
 */
export async function getServerMembers(serverId: string): Promise<User[]> {
  try {
    const data = await trpcQuery<BackendServerMember[]>('server.getMembers', { serverId });
    return (data ?? []).map(toFrontendMember);
  } catch (error) {
    console.warn('[serverService.getServerMembers] failed, returning []:', error);
    return [];
  }
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
 * Join a public server by ID via the tRPC API.
 * Throws if the server is private or the user is already a member.
 */
export async function joinServer(serverId: string): Promise<void> {
  await trpcMutate('serverMember.joinServer', { serverId });
}

/**
 * Creates a new server via the tRPC API.
 * The backend auto-creates a default "general" channel.
 */
export async function createServer(input: CreateServerInput): Promise<Server> {
  const data = await trpcMutate<Record<string, unknown>>('server.createServer', {
    name: input.name,
    description: input.description,
    isPublic: input.isPublic ?? false,
  });
  return toFrontendServer(data);
}
