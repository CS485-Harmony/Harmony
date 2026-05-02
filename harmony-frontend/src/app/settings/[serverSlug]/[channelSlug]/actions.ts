'use server';

/**
 * Auth note: `channel.updateChannel` tRPC procedure uses `withPermission('channel:update')`,
 * which enforces authentication and verifies membership + role before any mutation is applied.
 * Unauthenticated or unauthorised requests are rejected by the backend with UNAUTHORIZED/FORBIDDEN.
 * See: harmony-backend/src/trpc/routers/channel.router.ts
 */

import { revalidatePath } from 'next/cache';
import {
  updateChannel,
  getChannel,
  getAuditLog,
  getChannelMembers,
  addChannelMember,
  removeChannelMember,
  type ChannelMemberEntry,
} from '@/services/channelService';
import { getServer, getServerMembersWithRole } from '@/services/serverService';
import type { ServerMemberInfo } from '@/types';
import type { Channel } from '@/types';
import type { AuditLogPage } from '@/services/channelService';
import {
  getMetaTagPreview,
  getMetaTagRegenerationStatus,
  triggerMetaTagRegeneration,
  updateMetaTagOverrides,
  type MetaTagJobAccepted,
  type MetaTagJobStatus,
  type MetaTagPreview,
} from '@/services/metaTagAdminService';

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

async function resolveChannelForSeo(serverSlug: string, channelSlug: string) {
  const channel = await getChannel(serverSlug, channelSlug);
  if (!channel) throw new Error('Channel not found');
  return channel;
}

export async function fetchSeoPreview(
  serverSlug: string,
  channelSlug: string,
): Promise<MetaTagPreview> {
  const channel = await resolveChannelForSeo(serverSlug, channelSlug);
  return getMetaTagPreview(channel.id);
}

export async function saveSeoOverrides(
  serverSlug: string,
  channelSlug: string,
  overrides: {
    customTitle?: string | null;
    customDescription?: string | null;
    customOgImage?: string | null;
  },
): Promise<MetaTagPreview> {
  const channel = await resolveChannelForSeo(serverSlug, channelSlug);
  const preview = await updateMetaTagOverrides(channel.id, overrides);
  revalidatePath(`/c/${serverSlug}/${channelSlug}`);
  revalidatePath(`/settings/${serverSlug}/${channelSlug}`);
  return preview;
}

export async function triggerSeoRegeneration(
  serverSlug: string,
  channelSlug: string,
): Promise<MetaTagJobAccepted> {
  const channel = await resolveChannelForSeo(serverSlug, channelSlug);
  return triggerMetaTagRegeneration(channel.id);
}

export async function fetchSeoRegenerationStatus(
  serverSlug: string,
  channelSlug: string,
  jobId: string,
): Promise<MetaTagJobStatus> {
  const channel = await resolveChannelForSeo(serverSlug, channelSlug);
  return getMetaTagRegenerationStatus(channel.id, jobId);
}

// ─── Channel membership actions ───────────────────────────────────────────────

async function resolveChannelAndServer(serverSlug: string, channelSlug: string) {
  const channel = await getChannel(serverSlug, channelSlug);
  if (!channel) throw new Error('Channel not found');
  const server = await getServer(serverSlug);
  if (!server) throw new Error('Server not found');
  return { channel, server };
}

export async function fetchChannelMembers(
  serverSlug: string,
  channelSlug: string,
): Promise<ChannelMemberEntry[]> {
  const { channel, server } = await resolveChannelAndServer(serverSlug, channelSlug);
  return getChannelMembers(server.id, channel.id);
}

export async function addChannelMemberAction(
  serverSlug: string,
  channelSlug: string,
  userId: string,
): Promise<void> {
  const { channel, server } = await resolveChannelAndServer(serverSlug, channelSlug);
  await addChannelMember(server.id, channel.id, userId);
}

export async function removeChannelMemberAction(
  serverSlug: string,
  channelSlug: string,
  userId: string,
): Promise<void> {
  const { channel, server } = await resolveChannelAndServer(serverSlug, channelSlug);
  await removeChannelMember(server.id, channel.id, userId);
}

export async function fetchServerMembersForChannel(
  serverSlug: string,
): Promise<ServerMemberInfo[]> {
  const server = await getServer(serverSlug);
  if (!server) throw new Error('Server not found');
  return getServerMembersWithRole(server.id);
}
