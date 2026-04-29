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
  getServerMembersWithRole,
  changeMemberRole,
  removeMember,
} from '@/services/serverService';
import type { Server, ServerMemberInfo } from '@/types';
import { requireServerSettingsAccess } from './settings-access';
import { trpcMutate, trpcQuery } from '@/lib/trpc-client';

export interface InviteInfo {
  id: string;
  code: string;
  serverId: string;
  creatorId: string;
  uses: number;
  maxUses: number | null;
  expiresAt: string | null;
  createdAt: string;
  creator: { id: string; username: string; displayName: string };
}

export async function saveServerSettings(
  serverSlug: string,
  patch: Partial<Pick<Server, 'name' | 'description' | 'icon' | 'isPublic'>>,
): Promise<void> {
  const server = await requireServerSettingsAccess(serverSlug, 'throw');

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
  const server = await requireServerSettingsAccess(serverSlug, 'throw');

  // The backend deleteServer takes the server ID and handles cascade deletion
  await deleteServer(server.id);

  revalidatePath('/channels', 'layout');
  revalidatePath('/c', 'layout');

  // redirect() throws internally — must not be inside a try/catch.
  // Redirect to root; homepage handles routing to a valid server.
  redirect('/');
}

export async function getServerMembersAction(serverSlug: string): Promise<ServerMemberInfo[]> {
  const server = await requireServerSettingsAccess(serverSlug, 'throw');
  return getServerMembersWithRole(server.id);
}

export async function changeMemberRoleAction(
  serverSlug: string,
  targetUserId: string,
  newRole: 'ADMIN' | 'MODERATOR' | 'MEMBER',
): Promise<void> {
  const server = await requireServerSettingsAccess(serverSlug, 'throw');
  await changeMemberRole(server.id, targetUserId, newRole);
  revalidatePath(`/settings/${serverSlug}`);
}

export async function removeMemberAction(serverSlug: string, targetUserId: string): Promise<void> {
  const server = await requireServerSettingsAccess(serverSlug, 'throw');
  await removeMember(server.id, targetUserId);
  revalidatePath(`/settings/${serverSlug}`);
}

export async function listInvitesAction(serverSlug: string): Promise<InviteInfo[]> {
  const server = await requireServerSettingsAccess(serverSlug, 'throw');
  return trpcQuery<InviteInfo[]>('invite.list', { serverId: server.id });
}

export async function generateInviteAction(serverSlug: string): Promise<InviteInfo> {
  const server = await requireServerSettingsAccess(serverSlug, 'throw');
  return trpcMutate<InviteInfo>('invite.generate', { serverId: server.id });
}

export async function deleteInviteAction(serverSlug: string, inviteId: string): Promise<void> {
  const server = await requireServerSettingsAccess(serverSlug, 'throw');
  await trpcMutate('invite.delete', { serverId: server.id, inviteId });
}
