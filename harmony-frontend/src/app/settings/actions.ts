'use server';

import { API_CONFIG } from '@/lib/constants';

/**
 * Returns true if the channel at the given slugs is publicly accessible to
 * unauthenticated users (PUBLIC_INDEXABLE or PUBLIC_NO_INDEX). Returns false
 * for PRIVATE channels and channels that don't exist.
 *
 * Deliberately does NOT expose the raw ChannelVisibility enum to avoid
 * channel-existence probing by iterating slug combinations.
 */
export async function isChannelGuestAccessible(
  serverSlug: string,
  channelSlug: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}/channels/${encodeURIComponent(channelSlug)}`,
      { cache: 'no-store' },
    );
    // 200 = accessible (PUBLIC_INDEXABLE or PUBLIC_NO_INDEX)
    // 403 = PRIVATE (not guest accessible)
    // 404 = doesn't exist (not accessible)
    return res.status === 200;
  } catch {
    return false;
  }
}
