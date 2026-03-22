/**
 * Layout: HarmonyShell
 * Full Discord-like 3-column layout shell.
 * Wires together ServerRail, ChannelSidebar, TopBar, MessageList, MembersSidebar, SearchModal.
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { TopBar } from '@/components/channel/TopBar';
import { MembersSidebar } from '@/components/channel/MembersSidebar';
import { SearchModal } from '@/components/channel/SearchModal';
import { PinnedMessagesPanel } from '@/components/channel/PinnedMessagesPanel';
import { ChannelSidebar } from '@/components/channel/ChannelSidebar';
import { MessageInput } from '@/components/channel/MessageInput';
import { MessageList } from '@/components/channel/MessageList';
import { ServerRail } from '@/components/server-rail/ServerRail';
import { GuestPromoBanner } from '@/components/channel/GuestPromoBanner';
import { CreateChannelModal } from '@/components/channel/CreateChannelModal';
import { useAuth } from '@/hooks/useAuth';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { BrowseServersModal } from '@/components/server-rail/BrowseServersModal';
import { useChannelEvents } from '@/hooks/useChannelEvents';
import { useServerEvents } from '@/hooks/useServerEvents';
import { useServerListSync } from '@/hooks/useServerListSync';
import { ChannelType, ChannelVisibility, UserStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { CreateServerModal } from '@/components/server-rail/CreateServerModal';
import type { Server, Channel, Message, User } from '@/types';

// ─── Discord colour tokens ────────────────────────────────────────────────────

const BG = {
  tertiary: 'bg-[#202225]',
  primary: 'bg-[#36393f]',
};

// ─── useSyncExternalStore helpers — module-level so references are stable ─────
// React re-subscribes whenever the subscribe function reference changes. Inline
// arrow functions create a new reference every render, causing the MediaQueryList
// listener to be torn down and re-added on every message receive / state update.

const subscribeToViewport = (cb: () => void) => {
  const mql = window.matchMedia('(min-width: 640px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};
const getViewportSnapshot = () => window.matchMedia('(min-width: 640px)').matches;
const getServerViewportSnapshot = () => false;

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
    subscribeToViewport,
    getViewportSnapshot,
    getServerViewportSnapshot,
  );

  const isMembersOpen = membersOverride !== null ? membersOverride : isDesktopViewport;
  const setIsMembersOpen = useCallback((val: boolean) => setMembersOverride(val), []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPinsOpen, setIsPinsOpen] = useState(false);
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
    setIsPinsOpen(false);
    // Only auto-close the members sidebar on mobile so desktop keeps it open by default.
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 640px)').matches) {
      setIsMembersOpen(false);
    }
  }
  // Local channels state so newly created channels appear immediately in the sidebar.
  const [localChannels, setLocalChannels] = useState<Channel[]>(channels);
  // Map of serverId → default channel slug — used by BrowseServersModal for "Open" navigation.
  // Mirrors the same derivation in ServerRail so both always agree on the default channel.
  const defaultChannelByServerId = useMemo(() => {
    const map = new Map<string, string>();
    const textOrAnnouncement = allChannels
      .filter(c => c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT)
      .sort((a, b) => a.position - b.position);
    for (const channel of textOrAnnouncement) {
      if (!map.has(channel.serverId)) map.set(channel.serverId, channel.slug);
    }
    return map;
  }, [allChannels]);

  // Stable list of voice channel IDs for VoiceProvider — recomputed only when channels change.
  const voiceChannelIds = useMemo(
    () => localChannels.filter(c => c.type === ChannelType.VOICE).map(c => c.id),
    [localChannels],
  );
  // Track the channels prop reference so localChannels resets whenever the server
  // passes a fresh array (server navigation or revalidatePath refresh) — same
  // render-time derivation pattern used above for localMessages/prevChannelId.
  const [prevChannelsProp, setPrevChannelsProp] = useState(channels);
  if (prevChannelsProp !== channels) {
    setPrevChannelsProp(channels);
    setLocalChannels(channels);
  }
  // Local members state so join/leave/status events update the sidebar without reload.
  const [localMembers, setLocalMembers] = useState<User[]>(members);
  // Reset when the members prop changes (server navigation or SSR revalidation).
  const [prevMembersProp, setPrevMembersProp] = useState(members);
  if (prevMembersProp !== members) {
    setPrevMembersProp(members);
    setLocalMembers(members);
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
  const [isBrowseServersOpen, setIsBrowseServersOpen] = useState(false);
  const [localServers, setLocalServers] = useState<Server[]>(servers);
  const [prevServers, setPrevServers] = useState<Server[]>(servers);
  if (prevServers !== servers) {
    setPrevServers(servers);
    setLocalServers(servers);
  }

  const { notifyServerCreated } = useServerListSync();

  // Show the pin UI to all authenticated members — the backend enforces message:pin
  // permission (MODERATOR+) and will reject unauthorized calls with 403.
  // Client-side role filtering is unreliable here because localMembers carries the
  // global platform role, not the server-scoped membership role.
  const canPin = isAuthenticated;

  const handleServerCreated = useCallback(
    (server: Server, defaultChannel: Channel) => {
      setLocalServers(prev => [...prev, server]);
      notifyServerCreated(server.id);
      router.push(`${basePath}/${server.slug}/${defaultChannel.slug}`);
    },
    [basePath, notifyServerCreated, router],
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

  const handleServerUpdated = useCallback((updatedServer: Server) => {
    setLocalServers(prev =>
      prev.map(s => (s.id === updatedServer.id ? { ...s, ...updatedServer } : s)),
    );
  }, []);

  useChannelEvents({
    channelId: currentChannel.id,
    onMessageCreated: handleRealTimeCreated,
    onMessageEdited: handleRealTimeEdited,
    onMessageDeleted: handleRealTimeDeleted,
    onServerUpdated: handleServerUpdated,
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

  // ── Real-time member list updates ─────────────────────────────────────────

  const handleMemberJoined = useCallback((user: User) => {
    setLocalMembers(prev => {
      // Dedup: ignore if the user is already in the list
      if (prev.some(m => m.id === user.id)) return prev;
      return [...prev, user];
    });
  }, []);

  const handleMemberLeft = useCallback((userId: string) => {
    setLocalMembers(prev => prev.filter(m => m.id !== userId));
  }, []);

  const handleMemberStatusChanged = useCallback(({ id, status }: { id: string; status: UserStatus }) => {
    setLocalMembers(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
  }, []);

  // ── Real-time visibility changes ──────────────────────────────────────────

  const handleChannelVisibilityChanged = useCallback(
    (channel: Channel, oldVisibility: ChannelVisibility) => {
      // Update the channel's visibility in the sidebar immediately.
      setLocalChannels(prev => prev.map(c => (c.id === channel.id ? channel : c)));

      // If the current user is viewing this channel and it just became PRIVATE,
      // redirect non-admin members to the server root so VisibilityGuard can
      // gate access on re-render. Server owners and admins are not redirected
      // because they retain access to PRIVATE channels.
      // Note: useServerEvents is only enabled for authenticated users, so this
      // callback only fires for authenticated sessions.
      //
      // checkIsAdmin(ownerId) covers the server owner and system admins.
      // We look up the member record for the current user to check their
      // server-scoped role ('owner'/'admin') because checkIsAdmin() with no arg
      // checks AuthContext user.role, which is always 'member' for non-system-admin
      // users (mapBackendUser sets role: 'member' for all non-system-admin users).
      const memberRecord = localMembers.find(m => m.id === authUser?.id);
      const userIsAdminOrOwner =
        checkIsAdmin(currentServer.ownerId) ||
        memberRecord?.role === 'owner' ||
        memberRecord?.role === 'admin';
      if (
        channel.id === currentChannel.id &&
        oldVisibility !== ChannelVisibility.PRIVATE &&
        channel.visibility === ChannelVisibility.PRIVATE &&
        !userIsAdminOrOwner
      ) {
        router.push(`${basePath}/${currentServer.slug}`);
      }
    },
    [currentChannel.id, checkIsAdmin, currentServer.ownerId, basePath, currentServer.slug, router, localMembers, authUser?.id],
  );

  useServerEvents({
    serverId: currentServer.id,
    onChannelCreated: handleChannelCreated,
    onChannelUpdated: handleChannelUpdated,
    onChannelDeleted: handleChannelDeleted,
    onMemberJoined: handleMemberJoined,
    onMemberLeft: handleMemberLeft,
    onMemberStatusChanged: handleMemberStatusChanged,
    onChannelVisibilityChanged: handleChannelVisibilityChanged,
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
    <VoiceProvider serverId={currentServer.id} voiceChannelIds={voiceChannelIds}>
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
          serverId={currentServer.id}
          members={members}
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
            onPinsOpen={() => setIsPinsOpen(true)}
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(v => !v)}
          />

          <div className='flex flex-1 overflow-hidden'>
            <div className={cn('flex flex-1 flex-col overflow-hidden', BG.primary)}>
              <MessageList
                key={currentChannel.id}
                channel={currentChannel}
                messages={localMessages}
                serverId={currentServer.id}
                canPin={canPin}
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
            <PinnedMessagesPanel
              channelId={currentChannel.id}
              serverId={currentServer.id}
              channelName={currentChannel.name}
              isOpen={isPinsOpen}
              onClose={() => setIsPinsOpen(false)}
            />
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

        <BrowseServersModal
          isOpen={isBrowseServersOpen}
          onClose={() => setIsBrowseServersOpen(false)}
          joinedServerIds={new Set(localServers.map(s => s.id))}
          defaultChannelByServerId={defaultChannelByServerId}
          basePath={basePath}
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
    </VoiceProvider>
  );
}
