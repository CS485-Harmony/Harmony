import { redirect } from 'next/navigation';
import { publicGet } from '@/lib/trpc-client';

interface PublicServer {
  slug: string;
}

interface PublicChannel {
  slug: string;
}

/**
 * Home page — redirects to the first public channel if one exists,
 * otherwise falls back to the login page.
 */
async function getFirstPublicChannelPath(): Promise<string | null> {
  try {
    const servers = await publicGet<PublicServer[]>('/servers');
    if (!servers || servers.length === 0) return null;
    const result = await publicGet<{ channels: PublicChannel[] }>(
      `/servers/${servers[0].slug}/channels`,
    );
    const firstChannel = result?.channels?.[0];
    if (!firstChannel) return null;
    return `/c/${servers[0].slug}/${firstChannel.slug}`;
  } catch {
    return null;
  }
}

export default async function Home() {
  const path = await getFirstPublicChannelPath();
  redirect(path ?? '/auth/login');
}
