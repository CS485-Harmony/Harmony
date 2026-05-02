import type { ReactNode } from 'react';
import { getServers } from '@/services/serverService';
import { getChannels } from '@/services/channelService';
import { getSessionUser } from '@/lib/trpc-client';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { ChannelType } from '@/types/channel';

interface ServerLayoutProps {
  children: ReactNode;
  params: Promise<{ serverSlug: string }>;
}

/**
 * Layout: Server voice scope
 *
 * Wraps VoiceProvider at the [serverSlug] segment so it persists across
 * text-channel navigations within the same server. Without this layout,
 * VoiceProvider lived inside HarmonyShell (rendered by the page), which
 * caused it to unmount and disconnect the Twilio room on every channel switch.
 *
 * Next.js App Router preserves layouts across child navigations, so the
 * provider only remounts when the user switches to a different server.
 */
export default async function ServerVoiceLayout({ children, params }: ServerLayoutProps) {
  const { serverSlug } = await params;

  let serverId: string | undefined;
  let voiceChannelIds: string[] = [];
  let currentUserId: string | undefined;

  try {
    const [servers, sessionUser] = await Promise.all([getServers(), getSessionUser()]);
    const server = servers.find(s => s.slug === serverSlug);
    if (server) {
      serverId = server.id;
      const channels = await getChannels(server.id);
      voiceChannelIds = channels.filter(c => c.type === ChannelType.VOICE).map(c => c.id);
    }
    currentUserId = sessionUser?.id;
  } catch {
    // Data fetch failed — render children without voice context.
    // VoiceProvider is skipped; HarmonyShell's voice UI will be inert.
  }

  if (!serverId) {
    return <>{children}</>;
  }

  return (
    <VoiceProvider serverId={serverId} voiceChannelIds={voiceChannelIds} currentUserId={currentUserId}>
      {children}
    </VoiceProvider>
  );
}
