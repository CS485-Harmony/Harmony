'use server';

import type { Message, AttachmentInput } from '@/types';
import { sendMessage as sendMessageService } from '@/services/messageService';

/**
 * Server action wrapping sendMessage for use in client components.
 * Client components cannot import messageService directly because it
 * depends on next/headers (server-only).
 */
export async function sendMessageAction(
  channelId: string,
  content: string,
  serverId: string,
  attachments?: AttachmentInput[],
): Promise<Message> {
  return sendMessageService(channelId, content, serverId, attachments);
}
