/**
 * Message Service (M3 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-guest-public-channel-view.md
 */

import type { Message, AttachmentInput } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

// ─── Type adapters ────────────────────────────────────────────────────────────

/** Maps backend message shape to frontend Message type. */
function toFrontendMessage(raw: Record<string, unknown>, fallbackChannelId = ''): Message {
  // Warn on missing required fields to catch backend shape mismatches early.
  if (typeof raw.id !== 'string') console.warn('[toFrontendMessage] missing or non-string "id"');
  if (!raw.channelId && !raw.channel_id && !fallbackChannelId)
    console.warn('[toFrontendMessage] missing "channelId"/"channel_id"');
  if (!raw.createdAt && !raw.created_at && !raw.timestamp)
    console.warn('[toFrontendMessage] missing timestamp field');
  const author = raw.author as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    channelId: (raw.channelId ?? raw.channel_id ?? fallbackChannelId) as string,
    authorId: (raw.authorId ?? raw.author_id ?? author?.id ?? '') as string,
    author: {
      id: (author?.id ?? '') as string,
      username: (author?.username ?? '') as string,
      displayName: (author?.displayName ?? author?.display_name) as string | undefined,
      avatarUrl: (author?.avatarUrl ?? author?.avatar_url) as string | undefined,
    },
    content: raw.content as string,
    timestamp: (raw.createdAt ?? raw.created_at ?? raw.timestamp) as string,
    attachments: Array.isArray(raw.attachments)
      ? (raw.attachments as Array<Record<string, unknown>>).map(a => ({
          id: a.id as string,
          messageId: raw.id as string,
          url: a.url as string,
          filename: (a.filename ?? '') as string,
          type: (a.contentType ?? a.type ?? '') as string,
          size: typeof a.sizeBytes === 'number' ? a.sizeBytes : 0,
        }))
      : undefined,
    parentMessageId: (raw.parentMessageId ?? raw.parent_message_id ?? null) as
      | string
      | null
      | undefined,
    parentMessage: (() => {
      const p = (raw.parentMessage ?? raw.parent) as Record<string, unknown> | null | undefined;
      if (!p) return null;
      const pa = p.author as Record<string, unknown> | undefined;
      return {
        id: p.id as string,
        content: (p.content ?? '') as string,
        isDeleted: (p.isDeleted ?? p.is_deleted ?? false) as boolean,
        author: {
          id: (pa?.id ?? '') as string,
          username: (pa?.username ?? '') as string,
          displayName: (pa?.displayName ?? pa?.display_name) as string | undefined,
          avatarUrl: (pa?.avatarUrl ?? pa?.avatar_url) as string | undefined,
        },
      };
    })(),
    replyCount:
      typeof raw.replyCount === 'number'
        ? raw.replyCount
        : typeof raw.reply_count === 'number'
          ? raw.reply_count
          : 0,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns a page of messages for a channel.
 *
 * When serverId is provided (authenticated context), fetches via tRPC so that
 * responses are always fresh and include attachment data. The public REST
 * endpoint is ISR-cached and omits attachments, so it is only used for
 * unauthenticated / SEO access when no serverId is available.
 *
 * Errors propagate to the caller — the UI is responsible for rendering
 * failure state so users can distinguish a fetch error from an empty channel.
 */
export async function getMessages(
  channelId: string,
  page = 1,
  options?: { serverId?: string },
): Promise<{ messages: Message[]; hasMore: boolean }> {
  // Authenticated path: tRPC returns fresh data and includes attachments.
  if (options?.serverId) {
    const data = await trpcQuery<{
      messages: Record<string, unknown>[];
      nextCursor?: string;
    }>('message.getMessages', {
      serverId: options.serverId,
      channelId,
      limit: 50,
    });
    if (data === null)
      throw new Error(`getMessages: tRPC returned no data for channelId=${channelId}`);
    // tRPC returns oldest-first; reverse so callers get newest-first.
    return {
      messages: [...data.messages].reverse().map(m => toFrontendMessage(m, channelId)),
      hasMore: !!data.nextCursor,
    };
  }

  // Unauthenticated path: public REST endpoint (ISR-cached, SEO-friendly).
  const data = await publicGet<{
    messages: Record<string, unknown>[];
    page: number;
    pageSize: number;
  }>(`/channels/${encodeURIComponent(channelId)}/messages?page=${page}`);

  if (data === null)
    throw new Error(`getMessages: public channel not found for channelId=${channelId}`);

  return {
    messages: data.messages.map(m => toFrontendMessage(m, channelId)),
    hasMore: data.messages.length >= (data.pageSize ?? 50),
  };
}

/**
 * Sends a new message to a channel via tRPC.
 */
export async function sendMessage(
  channelId: string,
  content: string,
  serverId?: string,
  attachments?: AttachmentInput[],
): Promise<Message> {
  if (!serverId) {
    throw new Error('serverId is required for sendMessage');
  }
  const data = await trpcMutate<Record<string, unknown>>('message.sendMessage', {
    serverId,
    channelId,
    content,
    ...(attachments?.length ? { attachments } : {}),
  });
  return toFrontendMessage(data);
}

/**
 * Edits a message's content via tRPC. Returns the updated message.
 */
export async function editMessage(
  messageId: string,
  serverId: string,
  content: string,
): Promise<Message> {
  const data = await trpcMutate<Record<string, unknown>>('message.editMessage', {
    serverId,
    messageId,
    content,
  });
  return toFrontendMessage(data);
}

/**
 * Deletes a message by ID via tRPC. Returns true if deleted.
 */
export async function deleteMessage(id: string, serverId?: string): Promise<boolean> {
  if (!serverId) {
    throw new Error('serverId is required for deleteMessage');
  }
  await trpcMutate('message.deleteMessage', { serverId, messageId: id });
  return true;
}

/**
 * Creates a reply to a top-level message via tRPC.
 */
export async function createReply(
  parentMessageId: string,
  channelId: string,
  serverId: string,
  content: string,
): Promise<Message> {
  const data = await trpcMutate<Record<string, unknown>>('message.createReply', {
    serverId,
    channelId,
    parentMessageId,
    content,
  });
  return toFrontendMessage(data, channelId);
}

/**
 * Fetches paginated replies for a message thread via tRPC.
 */
export async function getThreadMessages(
  parentMessageId: string,
  channelId: string,
  serverId: string,
  cursor?: string,
): Promise<{ replies: Message[]; nextCursor: string | null; hasMore: boolean }> {
  const data = await trpcQuery<{
    replies: Record<string, unknown>[];
    nextCursor: string | null;
    hasMore: boolean;
  }>('message.getThreadMessages', {
    serverId,
    channelId,
    parentMessageId,
    limit: 20,
    ...(cursor ? { cursor } : {}),
  });
  return {
    replies: data.replies.map(r => toFrontendMessage(r, channelId)),
    nextCursor: data.nextCursor,
    hasMore: data.hasMore,
  };
}
