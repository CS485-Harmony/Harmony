'use server';

import { getThreadMessages } from '@/services/messageService';
import type { Message } from '@/types';

export type GetThreadMessagesResult =
  | { ok: true; replies: Message[]; nextCursor: string | null; hasMore: boolean }
  | { ok: false; error: string };

export async function getThreadMessagesAction(
  parentMessageId: string,
  channelId: string,
  serverId: string,
  cursor?: string,
): Promise<GetThreadMessagesResult> {
  try {
    const result = await getThreadMessages(parentMessageId, channelId, serverId, cursor);
    return { ok: true, ...result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load replies.';
    return { ok: false, error: message };
  }
}
