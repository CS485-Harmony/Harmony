'use server';

import { trpcMutate, TrpcHttpError } from '@/lib/trpc-client';

export type PinResult = { ok: true } | { ok: false; forbidden: boolean };

/**
 * Server actions for pinning/unpinning messages.
 * Require message:pin permission (MODERATOR, ADMIN, OWNER) — enforced by the backend.
 * Returns a typed result rather than throwing so callers can distinguish 403 from other errors.
 */
export async function pinMessageAction(messageId: string, serverId: string): Promise<PinResult> {
  try {
    await trpcMutate('message.pinMessage', { messageId, serverId });
    return { ok: true };
  } catch (err) {
    return { ok: false, forbidden: err instanceof TrpcHttpError && err.status === 403 };
  }
}

export async function unpinMessageAction(messageId: string, serverId: string): Promise<PinResult> {
  try {
    await trpcMutate('message.unpinMessage', { messageId, serverId });
    return { ok: true };
  } catch (err) {
    return { ok: false, forbidden: err instanceof TrpcHttpError && err.status === 403 };
  }
}
