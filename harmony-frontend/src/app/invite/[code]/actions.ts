'use server';

import { revalidatePath } from 'next/cache';
import { trpcMutate } from '@/lib/trpc-client';
import { getChannels } from '@/services/channelService';
import { ChannelType } from '@/types';

interface RedeemResult {
  serverId: string;
  serverSlug: string;
  alreadyMember: boolean;
}

export async function redeemInviteAction(
  code: string,
): Promise<{ serverSlug: string; channelSlug: string }> {
  const result = await trpcMutate<RedeemResult>('invite.redeem', { code });

  const channels = await getChannels(result.serverId);
  const firstChannel =
    channels.find(c => c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT) ??
    channels[0];

  if (!firstChannel) throw new Error('Server has no accessible channels.');

  revalidatePath('/channels', 'layout');
  return { serverSlug: result.serverSlug, channelSlug: firstChannel.slug };
}
