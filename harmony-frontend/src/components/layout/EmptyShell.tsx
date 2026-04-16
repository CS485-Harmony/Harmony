/**
 * EmptyShell — 3-column layout for states where no channel is active.
 *
 * Used for:
 *   - "no servers": ServerRail with no entries, no channel sidebar, empty-state content
 *   - "no channels": ServerRail with servers, channel sidebar (no active channel), empty-state content
 *
 * Keeps the full ServerRail + Browse/Create server modals functional so the user
 * can join or create a server without leaving the shell.
 */

'use client';

import { useState, useMemo, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ServerRail } from '@/components/server-rail/ServerRail';
import { ChannelSidebar } from '@/components/channel/ChannelSidebar';
import { CreateServerModal } from '@/components/server-rail/CreateServerModal';
import { BrowseServersModal } from '@/components/server-rail/BrowseServersModal';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { useAuth } from '@/hooks/useAuth';
import { useServerListSync } from '@/hooks/useServerListSync';
import { ChannelType, ChannelVisibility } from '@/types';
import type { ReactNode } from 'react';
import type { Server, Channel } from '@/types';

// Module-internal context so NoServersContent (a child) can trigger shell-owned modals
// without duplicating modal state or mounting duplicate modal trees.
const EmptyShellModalContext = createContext<{
  openBrowseServers: () => void;
  openCreateServer: () => void;
} | null>(null);

export function useEmptyShellModals() {
  return useContext(EmptyShellModalContext);
}

export interface EmptyShellProps {
  servers: Server[];
  /** When provided, the channel sidebar is rendered for this server. */
  currentServer?: Server;
  /** Channels to display in the sidebar (pass [] for "empty channel list" appearance). */
  channels?: Channel[];
  /** All channels across every server — used by ServerRail to derive default channel per server. */
  allChannels?: Channel[];
  children: ReactNode;
  basePath?: string;
}

export function EmptyShell({
  servers,
  currentServer,
  channels = [],
  allChannels = [],
  children,
  basePath = '/channels',
}: EmptyShellProps) {
  const { user: authUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isBrowseServersOpen, setIsBrowseServersOpen] = useState(false);
  const [localServers, setLocalServers] = useState<Server[]>(servers);
  const [prevServers, setPrevServers] = useState<Server[]>(servers);
  if (prevServers !== servers) {
    setPrevServers(servers);
    setLocalServers(servers);
  }
  const { notifyServerCreated, notifyServerJoined } = useServerListSync();

  const defaultChannelByServerId = useMemo(() => {
    const map = new Map<string, string>();
    const textOrAnn = allChannels
      .filter(
        c =>
          (c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT) &&
          c.visibility !== ChannelVisibility.PRIVATE,
      )
      .sort((a, b) => a.position - b.position);
    for (const ch of textOrAnn) {
      if (!map.has(ch.serverId)) map.set(ch.serverId, ch.slug);
    }
    return map;
  }, [allChannels]);

  // Voice channel IDs for VoiceProvider — scoped to the current server's channels.
  const voiceChannelIds = useMemo(
    () => channels.filter(c => c.type === ChannelType.VOICE).map(c => c.id),
    [channels],
  );

  // Fallback guest user — mirrors the pattern used in HarmonyShell.
  const currentUser = authUser ?? {
    id: 'guest',
    username: 'Guest',
    displayName: 'Guest',
    status: 'online' as const,
    role: 'guest' as const,
  };

  function handleServerCreated(server: Server, defaultChannel: Channel) {
    setLocalServers(prev => [...prev, server]);
    notifyServerCreated(server.id);
    router.push(`${basePath}/${server.slug}/${defaultChannel.slug}`);
  }

  const content = (
    <EmptyShellModalContext.Provider
      value={{
        openBrowseServers: () => setIsBrowseServersOpen(true),
        openCreateServer: () => setIsCreateServerOpen(true),
      }}
    >
      <div className='flex h-screen overflow-hidden bg-[#202225] font-sans'>
        <ServerRail
          servers={localServers}
          allChannels={allChannels}
          currentServerId={currentServer?.id ?? ''}
          basePath={basePath}
          onBrowseServers={isAuthenticated ? () => setIsBrowseServersOpen(true) : undefined}
          onAddServer={
            isAuthLoading
              ? undefined
              : () => {
                  if (!isAuthenticated) {
                    router.push('/auth/login');
                    return;
                  }
                  setIsCreateServerOpen(true);
                }
          }
        />

        {currentServer && (
          <ChannelSidebar
            server={currentServer}
            channels={channels}
            currentChannelId=''
            currentUser={currentUser}
            isOpen={false}
            onClose={() => {}}
            basePath={basePath}
            isAuthenticated={isAuthenticated}
            serverId={currentServer.id}
          />
        )}

        <main className='flex flex-1 items-center justify-center bg-[#36393f]'>
          {children}
        </main>

        <CreateServerModal
          isOpen={isCreateServerOpen}
          onClose={() => setIsCreateServerOpen(false)}
          onCreated={handleServerCreated}
        />

        <BrowseServersModal
          isOpen={isBrowseServersOpen}
          onClose={() => setIsBrowseServersOpen(false)}
          joinedServerIds={new Set(localServers.map(s => s.id))}
          defaultChannelByServerId={defaultChannelByServerId}
          basePath={basePath}
          onJoined={notifyServerJoined}
        />
      </div>
    </EmptyShellModalContext.Provider>
  );

  // VoiceProvider is only needed when a server is active (enables voice channel joining).
  if (currentServer) {
    return (
      <VoiceProvider serverId={currentServer.id} voiceChannelIds={voiceChannelIds}>
        {content}
      </VoiceProvider>
    );
  }
  return content;
}
