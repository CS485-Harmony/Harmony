'use server';

import { editMessage } from '@/services/messageService';
import { TrpcHttpError } from '@/lib/trpc-client';
import type { Message } from '@/types';

export type EditMessageResult =
  | { ok: true; message: Message }
  | { ok: false; forbidden: boolean; message?: undefined };

export async function editMessageAction(
  messageId: string,
  serverId: string,
  content: string,
): Promise<EditMessageResult> {
  try {
    const message = await editMessage(messageId, serverId, content);
    return { ok: true, message };
  } catch (err) {
    return { ok: false, forbidden: err instanceof TrpcHttpError && err.status === 403 };
  }
}
