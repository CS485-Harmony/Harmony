/**
 * Message Service (M3 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-guest-public-channel-view.md
 */

import type { Message } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

// ─── Type adapters ────────────────────────────────────────────────────────────

/** Maps backend message shape to frontend Message type. */
function toFrontendMessage(raw: Record<string, unknown>): Message {
  // Warn on missing required fields to catch backend shape mismatches early.
  if (typeof raw.id !== 'string') console.warn('[toFrontendMessage] missing or non-string "id"', raw);
  if (!raw.channelId && !raw.channel_id) console.warn('[toFrontendMessage] missing "channelId"/"channel_id"', raw);
  if (!raw.createdAt && !raw.created_at && !raw.timestamp) console.warn('[toFrontendMessage] missing timestamp field', raw);
  const author = raw.author as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    channelId: (raw.channelId ?? raw.channel_id ?? '') as string,
    authorId: (raw.authorId ?? raw.author_id ?? author?.id ?? '') as string,
    author: {
      id: (author?.id ?? '') as string,
      username: (author?.username ?? '') as string,
      displayName: (author?.displayName ?? author?.display_name) as string | undefined,
      avatarUrl: (author?.avatarUrl ?? author?.avatar_url) as string | undefined,
    },
    content: raw.content as string,
    timestamp: (raw.createdAt ?? raw.created_at ?? raw.timestamp) as string,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns a page of messages for a channel.
 * Uses the public REST endpoint for PUBLIC_INDEXABLE channels.
 * Falls back to tRPC for authenticated access (pass options.serverId).
 *
 * Errors propagate to the caller — the UI is responsible for rendering
 * failure state so users can distinguish a fetch error from an empty channel.
 */
export async function getMessages(
  channelId: string,
  page = 1,
  options?: { serverId?: string },
): Promise<{ messages: Message[]; hasMore: boolean }> {
  // Try public endpoint first (works for PUBLIC_INDEXABLE channels).
  // A non-2xx response throws, which we catch only to attempt the tRPC fallback.
  try {
    const data = await publicGet<{
      messages: Record<string, unknown>[];
      page: number;
      pageSize: number;
    }>(`/channels/${encodeURIComponent(channelId)}/messages?page=${page}`);

    if (data?.messages) {
      return {
        messages: data.messages.map(toFrontendMessage),
        hasMore: data.messages.length >= (data.pageSize ?? 50),
      };
    }
    return { messages: [], hasMore: false };
  } catch {
    // Public endpoint unavailable or channel is not PUBLIC_INDEXABLE — try tRPC.
    // If serverId is not provided we cannot authenticate, so re-throw.
    if (!options?.serverId) throw new Error('getMessages: channel is not publicly accessible and no serverId was provided');

    // tRPC errors propagate to the caller.
    const data = await trpcQuery<{
      messages: Record<string, unknown>[];
      nextCursor?: string;
    }>('message.getMessages', {
      serverId: options.serverId,
      channelId,
      limit: 50,
    });
    return {
      messages: (data?.messages ?? []).map(toFrontendMessage),
      hasMore: !!data?.nextCursor,
    };
  }
}

/**
 * Sends a new message to a channel via tRPC.
 */
export async function sendMessage(
  channelId: string,
  content: string,
  serverId?: string,
): Promise<Message> {
  if (!serverId) {
    throw new Error('serverId is required for sendMessage');
  }
  const data = await trpcMutate<Record<string, unknown>>('message.sendMessage', {
    serverId,
    channelId,
    content,
  });
  return toFrontendMessage(data);
}

/**
 * Deletes a message by ID via tRPC. Returns true if deleted.
 */
export async function deleteMessage(
  id: string,
  serverId?: string,
): Promise<boolean> {
  if (!serverId) {
    throw new Error('serverId is required for deleteMessage');
  }
  await trpcMutate('message.deleteMessage', { serverId, messageId: id });
  return true;
}
