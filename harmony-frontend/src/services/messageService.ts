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
  const author = raw.author as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    channelId: (raw.channelId ?? raw.channel_id ?? '') as string,
    authorId: (raw.authorId ?? raw.author_id ?? author?.id ?? '') as string,
    author: author
      ? {
          id: author.id as string,
          username: author.username as string,
          displayName: (author.displayName ?? author.display_name) as string | undefined,
          avatarUrl: (author.avatarUrl ?? author.avatar_url) as string | undefined,
        }
      : undefined,
    content: raw.content as string,
    timestamp: (raw.createdAt ?? raw.created_at ?? raw.timestamp) as string,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns a page of messages for a channel.
 * Uses the public REST endpoint for PUBLIC_INDEXABLE channels.
 * Falls back to tRPC for authenticated access.
 */
export async function getMessages(
  channelId: string,
  page = 1,
  options?: { serverId?: string },
): Promise<{ messages: Message[]; hasMore: boolean }> {
  try {
    // Try public endpoint first (works for PUBLIC_INDEXABLE channels)
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
    // If public endpoint fails (e.g., non-public channel), try tRPC
    if (options?.serverId) {
      try {
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
      } catch (trpcError) {
        console.error('[messageService.getMessages] tRPC fallback failed:', trpcError);
      }
    }
    return { messages: [], hasMore: false };
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
