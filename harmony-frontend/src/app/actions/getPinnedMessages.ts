'use server';

import type { Message } from '@/types';
import { trpcQuery } from '@/lib/trpc-client';

/**
 * Server action to fetch pinned messages for a channel.
 * Wraps the tRPC getPinnedMessages query (server-only, requires next/headers).
 */
export async function getPinnedMessagesAction(
  channelId: string,
  serverId: string,
): Promise<Message[]> {
  // The backend returns Prisma Message records with `createdAt` instead of `timestamp`.
  // Map to the frontend Message shape so consumers can safely read message.timestamp.
  const raw = await trpcQuery<Record<string, unknown>[]>('message.getPinnedMessages', {
    channelId,
    serverId,
  });
  return raw.map((m): Message => ({
    ...(m as unknown as Message),
    timestamp: (m.timestamp ?? m.createdAt) as string,
  }));
}
