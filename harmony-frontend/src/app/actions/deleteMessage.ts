'use server';

import { trpcMutate, TrpcHttpError } from '@/lib/trpc-client';

export type DeleteMessageResult = { ok: true } | { ok: false; forbidden: boolean };

export async function deleteMessageAction(
  messageId: string,
  serverId: string,
): Promise<DeleteMessageResult> {
  try {
    await trpcMutate('message.deleteMessage', { serverId, messageId });
    return { ok: true };
  } catch (err) {
    return { ok: false, forbidden: err instanceof TrpcHttpError && err.status === 403 };
  }
}
