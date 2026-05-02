'use server';

import { getMessages } from '@/services/messageService';
import type { Message } from '@/types';

export type GetOlderMessagesResult =
  | { ok: true; messages: Message[]; nextCursor: string | undefined; hasMore: boolean }
  | { ok: false; error: string };

export async function getOlderMessagesAction(
  channelId: string,
  serverId: string,
  cursor: string,
): Promise<GetOlderMessagesResult> {
  try {
    const result = await getMessages(channelId, undefined, { serverId, cursor });
    return { ok: true, ...result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load older messages.';
    return { ok: false, error: message };
  }
}
