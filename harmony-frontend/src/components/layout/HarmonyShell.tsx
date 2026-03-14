/**
 * Layout: HarmonyShell
 * Full Discord-like 3-column layout shell.
 * Wires together ServerRail, ChannelSidebar, TopBar, MessageList, MembersSidebar, SearchModal.
 */

'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { TopBar } from '@/components/channel/TopBar';
import { MembersSidebar } from '@/components/channel/MembersSidebar';
import { SearchModal } from '@/components/channel/SearchModal';
import { ChannelSidebar } from '@/components/channel/ChannelSidebar';
import { MessageInput } from '@/components/channel/MessageInput';
import { MessageList } from '@/components/channel/MessageList';
import { ServerRail } from '@/components/server-rail/ServerRail';
import { GuestPromoBanner } from '@/components/channel/GuestPromoBanner';
import { CreateChannelModal } from '@/components/channel/CreateChannelModal';
import { useAuth } from '@/hooks/useAuth';
import { useChannelEvents } from '@/hooks/useChannelEvents';
import { useServerEvents } from '@/hooks/useServerEvents';
import { ChannelType } from '@/types';
import { useRouter } from 'next/navigation';
import { CreateServerModal } from '@/components/server-rail/CreateServerModal';
import type { Server, Channel, Message, User } from '@/types';

// ─── Discord colour tokens ────────────────────────────────────────────────────

const BG = {
  tertiary: 'bg-[#202225]',
  primary: 'bg-[#36393f]',
};

// ─── Main Shell ───────────────────────────────────────────────────────────────

export interface HarmonyShellProps {
  servers: Server[];
  currentServer: Server;
  /** Channels belonging to the current server — used by ChannelSidebar */
  channels: Channel[];
  /**
   * All channels across every server — used by ServerRail to derive the
   * correct default channel slug when navigating to another server.
   * #c32: passing only serverChannels here caused other server icons to link
   * to a non-existent route because their channels weren't in the list.
   */
  allChannels: Channel[];
  currentChannel: Channel;
  messages: Message[];
  members: User[];
  /** Base path for navigation links. Use "/c" for public guest routes, "/channels" for authenticated routes. */
  basePath?: string;
}

export function HarmonyShell({
  servers,
  currentServer,
  channels,
  allChannels,
  currentChannel,
  messages,
  members,
  basePath = '/c',
}: HarmonyShellProps) {
  // Track the user's explicit toggle preference; null means "follow viewport default".
  const [membersOverride, setMembersOverride] = useState<boolean | null>(null);

  // useSyncExternalStore: SSR returns false (getServerSnapshot), client returns live viewport.
  // No useEffect setState needed — avoids both hydration mismatch and the linter rule.
  const isDesktopViewport = useSyncExternalStore(
    cb => {
      const mql = window.matchMedia('(min-width: 640px)');
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia('(min-width: 640px)').matches,
    () => false,
  );

  const isMembersOpen = membersOverride !== null ? membersOverride : isDesktopViewport;
  const setIsMembersOpen = useCallback((val: boolean) => setMembersOverride(val), []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // #c25: track mobile channel-sidebar state so aria-expanded on hamburger reflects reality
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Local message state so sent messages appear immediately without a page reload
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  // Track previous channel so we can reset localMessages synchronously on channel
  // switch — avoids a one-render flash where old messages show under the new channel header.
  const [prevChannelId, setPrevChannelId] = useState(currentChannel.id);
  if (prevChannelId !== currentChannel.id) {
    setPrevChannelId(currentChannel.id);
    setLocalMessages(messages);
    setIsMenuOpen(false);
    // Only auto-close the members sidebar on mobile so desktop keeps it open by default.
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 640px)').matches) {
      setIsMembersOpen(false);
    }
  }
  // Local channels state so newly created channels appear immediately in the sidebar.
  const [localChannels, setLocalChannels] = useState<Channel[]>(channels);
  // Track the channels prop reference so localChannels resets whenever the server
  // passes a fresh array (server navigation or revalidatePath refresh) — same
  // render-time derivation pattern used above for localMessages/prevChannelId.
  const [prevChannelsProp, setPrevChannelsProp] = useState(channels);
  if (prevChannelsProp !== channels) {
    setPrevChannelsProp(channels);
    setLocalChannels(channels);
  }
  // Channel creation modal state.
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [createChannelDefaultType, setCreateChannelDefaultType] = useState<ChannelType>(
    ChannelType.TEXT,
  );

  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    isAdmin: checkIsAdmin,
  } = useAuth();

  // Fallback for guest/unauthenticated view
  const currentUser: User = authUser ?? {
    id: 'guest',
    username: 'Guest',
    displayName: 'Guest',
    status: 'online',
    role: 'guest',
  };

  const router = useRouter();
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [localServers, setLocalServers] = useState<Server[]>(servers);
  const [prevServers, setPrevServers] = useState<Server[]>(servers);
  if (prevServers !== servers) {
    setPrevServers(servers);
    setLocalServers(servers);
  }

  const handleServerCreated = useCallback(
    (server: Server, defaultChannel: Channel) => {
      setLocalServers(prev => [...prev, server]);
      router.push(`${basePath}/${server.slug}/${defaultChannel.slug}`);
    },
    [basePath, router],
  );

  const handleMessageSent = useCallback((msg: Message) => {
    // Dedup: the SSE event for the sender's own message can arrive before the tRPC
    // response (Redis pub/sub on the same backend + established SSE connection beats
    // the HTTP round-trip). Without this check, the message would be added twice.
    setLocalMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
  }, []);

  // ── Real-time SSE handlers ────────────────────────────────────────────────

  const handleRealTimeCreated = useCallback((msg: Message) => {
    // Dedup: skip if the message was already optimistically added (e.g. sent by this client)
    setLocalMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
  }, []);

  const handleRealTimeEdited = useCallback((msg: Message) => {
    setLocalMessages(prev => prev.map(m => (m.id === msg.id ? msg : m)));
  }, []);

  const handleRealTimeDeleted = useCallback((messageId: string) => {
    setLocalMessages(prev => prev.filter(m => m.id !== messageId));
  }, []);

  useChannelEvents({
    channelId: currentChannel.id,
    onMessageCreated: handleRealTimeCreated,
    onMessageEdited: handleRealTimeEdited,
    onMessageDeleted: handleRealTimeDeleted,
    enabled: isAuthenticated,
  });

  // ── Real-time channel list updates ────────────────────────────────────────

  const handleChannelCreated = useCallback((channel: Channel) => {
    setLocalChannels(prev => {
      // Dedup: ignore if already in list (e.g. added optimistically by the creator)
      if (prev.some(c => c.id === channel.id)) return prev;
      // Insert before VOICE channels so text/announcement channels stay grouped
      const insertIdx =
        channel.type === ChannelType.VOICE
          ? prev.length
          : prev.findIndex(c => c.type === ChannelType.VOICE);
      const at = insertIdx === -1 ? prev.length : insertIdx;
      return [...prev.slice(0, at), channel, ...prev.slice(at)];
    });
  }, []);

  const handleChannelUpdated = useCallback((channel: Channel) => {
    setLocalChannels(prev => prev.map(c => (c.id === channel.id ? channel : c)));
  }, []);

  const handleChannelDeleted = useCallback(
    (channelId: string) => {
      setLocalChannels(prev => prev.filter(c => c.id !== channelId));
      // Navigate away if the deleted channel is the one currently viewed
      if (channelId === currentChannel.id) {
        router.push(`${basePath}/${currentServer.slug}`);
      }
    },
    [currentChannel.id, currentServer.slug, basePath, router],
  );

  useServerEvents({
    serverId: currentServer.id,
    onChannelCreated: handleChannelCreated,
    onChannelUpdated: handleChannelUpdated,
    onChannelDeleted: handleChannelDeleted,
    enabled: isAuthenticated,
  });

  // #c10/#c23: single global Ctrl+K / Cmd+K handler — SearchModal no longer needs its own
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(v => !v);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className='flex h-screen overflow-hidden bg-[#202225] font-sans'>
      {/* Skip-to-content: visually hidden, appears on keyboard focus (WCAG 2.4.1) */}
      <a
        href='#main-content'
        className='sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:m-2 focus-visible:rounded focus-visible:bg-[#5865f2] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline-none'
      >
        Skip to content
      </a>

      {/* 1. Server rail — uses allChannels (full set) to derive default slug per server */}
      <ServerRail
        servers={localServers}
        allChannels={allChannels}
        currentServerId={currentServer.id}
        basePath={basePath}
        isMobileVisible={isMenuOpen}
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

      {/* 2. Channel sidebar — mobile overlay when isMenuOpen, always visible on desktop */}
      <ChannelSidebar
        server={currentServer}
        channels={localChannels}
        currentChannelId={currentChannel.id}
        currentUser={currentUser}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        basePath={basePath}
        isAuthenticated={isAuthenticated}
        onCreateChannel={defaultType => {
          setCreateChannelDefaultType(defaultType);
          setIsCreateChannelOpen(true);
        }}
      />

      {/* 3. Main column */}
      <main
        id='main-content'
        className='flex flex-1 flex-col overflow-hidden'
        aria-label={`${currentChannel.name} channel`}
        tabIndex={-1}
      >
        <TopBar
          channel={currentChannel}
          serverSlug={currentServer.slug}
          isAdmin={checkIsAdmin(currentServer.ownerId)}
          isMembersOpen={isMembersOpen}
          onMembersToggle={() => setIsMembersOpen(!isMembersOpen)}
          onSearchOpen={() => setIsSearchOpen(true)}
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen(v => !v)}
        />

        <div className='flex flex-1 overflow-hidden'>
          <div className={cn('flex flex-1 flex-col overflow-hidden', BG.primary)}>
            <MessageList
              key={currentChannel.id}
              channel={currentChannel}
              messages={localMessages}
            />
            <MessageInput
              channelId={currentChannel.id}
              channelName={currentChannel.name}
              serverId={currentServer.id}
              isReadOnly={currentUser.role === 'guest'}
              onMessageSent={handleMessageSent}
            />
            {!isAuthLoading && !isAuthenticated && (
              <GuestPromoBanner
                serverName={currentServer.name}
                memberCount={currentServer.memberCount ?? members.length}
              />
            )}
          </div>
          <MembersSidebar
            members={members}
            isOpen={isMembersOpen}
            onClose={() => setIsMembersOpen(false)}
          />
        </div>
      </main>

      <CreateServerModal
        isOpen={isCreateServerOpen}
        onClose={() => setIsCreateServerOpen(false)}
        onCreated={handleServerCreated}
      />

      <SearchModal
        messages={localMessages}
        channelName={currentChannel.name}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {isCreateChannelOpen && (
        <CreateChannelModal
          serverId={currentServer.id}
          serverSlug={currentServer.slug}
          existingChannels={localChannels}
          defaultType={createChannelDefaultType}
          onCreated={newChannel =>
            setLocalChannels(prev => {
              // Insert before voice channels so text/announcement channels stay grouped correctly.
              const insertIdx =
                newChannel.type === ChannelType.VOICE
                  ? prev.length
                  : prev.findIndex(c => c.type === ChannelType.VOICE);
              const at = insertIdx === -1 ? prev.length : insertIdx;
              return [...prev.slice(0, at), newChannel, ...prev.slice(at)];
            })
          }
          onClose={() => setIsCreateChannelOpen(false)}
        />
      )}
    </div>
  );
}
