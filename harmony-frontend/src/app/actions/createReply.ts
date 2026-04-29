'use server';

import { createReply } from '@/services/messageService';
import { TrpcHttpError } from '@/lib/trpc-client';
import type { Message } from '@/types';

export type CreateReplyResult =
  | { ok: true; message: Message }
  | { ok: false; forbidden: boolean; message?: undefined };

export async function createReplyAction(
  parentMessageId: string,
  channelId: string,
  serverId: string,
  content: string,
): Promise<CreateReplyResult> {
  try {
    const message = await createReply(parentMessageId, channelId, serverId, content);
    return { ok: true, message };
  } catch (err) {
    return { ok: false, forbidden: err instanceof TrpcHttpError && err.status === 403 };
  }
}
