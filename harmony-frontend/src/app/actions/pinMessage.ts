'use server';

import { trpcMutate } from '@/lib/trpc-client';

/**
 * Server actions for pinning/unpinning messages.
 * Require message:pin permission (MODERATOR, ADMIN, OWNER) — enforced by the backend.
 */
export async function pinMessageAction(messageId: string, serverId: string): Promise<void> {
  await trpcMutate('message.pinMessage', { messageId, serverId });
}

export async function unpinMessageAction(messageId: string, serverId: string): Promise<void> {
  await trpcMutate('message.unpinMessage', { messageId, serverId });
}
