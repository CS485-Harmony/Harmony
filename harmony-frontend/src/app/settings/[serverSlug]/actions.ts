'use server';

/**
 * Auth note: `server.updateServer` and `server.deleteServer` tRPC procedures use
 * `authedProcedure` and verify ownership/membership server-side before any mutation
 * is applied. Unauthenticated requests are rejected by the backend with UNAUTHORIZED.
 * See: harmony-backend/src/trpc/routers/server.router.ts
 */

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  updateServer,
  deleteServer,
  getServerAuthenticated,
  getServerMembersWithRole,
  changeMemberRole,
  removeMember,
} from '@/services/serverService';
import type { Server, ServerMemberInfo } from '@/types';

export async function saveServerSettings(
  serverSlug: string,
  patch: Partial<Pick<Server, 'name' | 'description' | 'icon' | 'isPublic'>>,
): Promise<void> {
  // Resolve server by route param (don't trust a raw serverId from the client)
  const server = await getServerAuthenticated(serverSlug);
  if (!server) {
    throw new Error('Server not found');
  }

  // Build an explicit whitelist so callers cannot sneak in extra fields
  const sanitizedPatch: Partial<Pick<Server, 'name' | 'description' | 'icon' | 'isPublic'>> = {};

  if (patch.name !== undefined) {
    if (typeof patch.name !== 'string') throw new Error('Invalid server name');
    const trimmed = patch.name.trim();
    if (!trimmed) throw new Error('Server name cannot be empty');
    if (trimmed.length > 100) throw new Error('Server name must be 100 characters or fewer.');
    sanitizedPatch.name = trimmed;
  }
  if (patch.description !== undefined) {
    if (typeof patch.description !== 'string') throw new Error('Invalid server description');
    sanitizedPatch.description = patch.description.trim();
  }
  if (patch.icon !== undefined) {
    if (typeof patch.icon !== 'string') throw new Error('Invalid server icon');
    sanitizedPatch.icon = patch.icon.trim();
  }
  if (patch.isPublic !== undefined) {
    if (typeof patch.isPublic !== 'boolean') throw new Error('Invalid visibility');
    sanitizedPatch.isPublic = patch.isPublic;
  }

  // The backend updateServer takes the server ID, not slug
  await updateServer(server.id, sanitizedPatch);

  revalidatePath(`/channels/${serverSlug}`, 'layout');
  revalidatePath(`/c/${serverSlug}`, 'layout');
  revalidatePath(`/settings/${serverSlug}`, 'layout');
}

export async function deleteServerAction(serverSlug: string): Promise<void> {
  // Resolve server first to confirm it exists
  const server = await getServerAuthenticated(serverSlug);
  if (!server) {
    throw new Error('Server not found');
  }

  // The backend deleteServer takes the server ID and handles cascade deletion
  await deleteServer(server.id);

  revalidatePath('/channels', 'layout');
  revalidatePath('/c', 'layout');

  // redirect() throws internally — must not be inside a try/catch.
  // Redirect to root; homepage handles routing to a valid server.
  redirect('/');
}

export async function getServerMembersAction(serverId: string): Promise<ServerMemberInfo[]> {
  return getServerMembersWithRole(serverId);
}

export async function changeMemberRoleAction(
  serverSlug: string,
  targetUserId: string,
  newRole: 'ADMIN' | 'MODERATOR' | 'MEMBER',
): Promise<void> {
  const server = await getServerAuthenticated(serverSlug);
  if (!server) throw new Error('Server not found');
  await changeMemberRole(server.id, targetUserId, newRole);
  revalidatePath(`/settings/${serverSlug}`);
}

export async function removeMemberAction(
  serverSlug: string,
  targetUserId: string,
): Promise<void> {
  const server = await getServerAuthenticated(serverSlug);
  if (!server) throw new Error('Server not found');
  await removeMember(server.id, targetUserId);
  revalidatePath(`/settings/${serverSlug}`);
}
