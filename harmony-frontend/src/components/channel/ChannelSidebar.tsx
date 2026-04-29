/**
 * Channel Component: ChannelSidebar
 * Second column in the 3-column layout — lists channels for the selected server,
 * grouped into collapsible Text/Voice categories, with a user info bar at the bottom.
 * Ref: dev-spec-channel-visibility-toggle.md — M2, CL-C2
 */

'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn, getUserErrorMessage } from '@/lib/utils';
import { UserStatusBar } from '@/components/channel/UserStatusBar';
import { ChannelVisibility, ChannelType } from '@/types';
import type { Server, Channel, User } from '@/types';
import { useVoiceOptional } from '@/contexts/VoiceContext';
import { useToast } from '@/hooks/useToast';
import { apiClient } from '@/lib/api-client';

// ─── Colour tokens (Discord palette) ─────────────────────────────────────────

const BG_SIDEBAR = 'bg-[#2f3136]';
const BG_ACTIVE = 'bg-[#3d4148]';

// ─── Channel type icons ───────────────────────────────────────────────────────

function ChannelIcon({ type }: { type: ChannelType }) {
  if (type === ChannelType.VOICE) {
    return (
      <svg className='h-4 w-4 flex-shrink-0' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29904L6 8.00204H3C2.45 8.00204 2 8.45204 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.707C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59704 11.757 3.23204 11.383 3.07904ZM14 5.00004V7.00004C16.757 7.00004 19 9.24304 19 12C19 14.757 16.757 17 14 17V19C17.86 19 21 15.86 21 12C21 8.14004 17.86 5.00004 14 5.00004ZM14 9.00004V11C14.552 11 15 11.45 15 12C15 12.55 14.552 13 14 13V15C15.654 15 17 13.654 17 12C17 10.346 15.654 9.00004 14 9.00004Z' />
      </svg>
    );
  }
  if (type === ChannelType.ANNOUNCEMENT) {
    return (
      <svg className='h-4 w-4 flex-shrink-0' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z' />
        <path d='M7 9H17V11H7V9ZM7 12H14V14H7V12ZM7 6H17V8H7V6Z' />
      </svg>
    );
  }
  // Default: text channel hash icon
  return (
    <svg className='h-4 w-4 flex-shrink-0' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.871 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41001 9L8.35001 15H14.35L15.41 9H9.41001Z' />
    </svg>
  );
}

// ─── Visibility badge ─────────────────────────────────────────────────────────

const VISIBILITY_BADGE: Record<ChannelVisibility, string | null> = {
  [ChannelVisibility.PRIVATE]: '🔒',
  [ChannelVisibility.PUBLIC_NO_INDEX]: '👁',
  [ChannelVisibility.PUBLIC_INDEXABLE]: null,
};

const VISIBILITY_LABEL: Record<ChannelVisibility, string> = {
  [ChannelVisibility.PRIVATE]: 'Private channel',
  [ChannelVisibility.PUBLIC_NO_INDEX]: 'Public channel, not indexed',
  [ChannelVisibility.PUBLIC_INDEXABLE]: '',
};

// ─── Collapsible category header ─────────────────────────────────────────────

function CategoryHeader({
  label,
  isCollapsed,
  onToggle,
  onAdd,
  addLabel,
}: {
  label: string;
  isCollapsed: boolean;
  onToggle: () => void;
  /** When provided, renders a "+" button visible on hover (admins only). */
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className='group/cat mb-1 flex items-center'>
      <button
        onClick={onToggle}
        aria-expanded={!isCollapsed}
        className='flex flex-1 items-center gap-0.5 rounded px-1 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-200'
      >
        {/* Caret: points down when expanded, right when collapsed */}
        <svg
          className={cn(
            'h-3 w-3 flex-shrink-0 transition-transform duration-150',
            isCollapsed && '-rotate-90',
          )}
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='m6 9 6 6 6-6'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          />
        </svg>
        <span className='ml-0.5'>{label}</span>
      </button>

      {/* Add channel "+" — only rendered for admins, visible on category hover */}
      {onAdd && (
        <button
          type='button'
          onClick={onAdd}
          aria-label={addLabel ?? `Add channel`}
          className='ml-auto rounded p-0.5 text-gray-400 opacity-0 transition-opacity hover:text-gray-200 group-hover/cat:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2]'
        >
          <svg
            className='h-3.5 w-3.5'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2.5}
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M12 5v14M5 12h14' />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface ChannelSidebarProps {
  server: Server;
  channels: Channel[];
  currentChannelId: string;
  currentUser: User;
  /** Controls mobile drawer visibility — desktop is always visible */
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  /** URL base path for channel links — defaults to "/c" */
  basePath?: string;
  /** Server UUID — required for voice join/leave tRPC calls. */
  serverId: string;
  /** Members of the server — used to resolve userIds to display names in voice participant lists. */
  members?: User[];
  /**
   * Called when an admin clicks the "+" button next to a category header.
   * Receives the default ChannelType for that category.
   * Only shown when the current user is owner/admin.
   */
  onCreateChannel?: (defaultType: ChannelType) => void;
}

export function ChannelSidebar({
  server,
  channels,
  currentChannelId,
  currentUser,
  isOpen,
  onClose,
  isAuthenticated,
  basePath = '/c',
  serverId,
  members,
  onCreateChannel,
}: ChannelSidebarProps) {
  const [textCollapsed, setTextCollapsed] = useState(false);
  const [voiceCollapsed, setVoiceCollapsed] = useState(false);
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeavingServer, setIsLeavingServer] = useState(false);
  const serverMenuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const voice = useVoiceOptional();
  const connectedChannelId = voice?.connectedChannelId ?? null;
  const allChannelParticipants = voice?.channelParticipants ?? {};
  const dominantSpeakerId = voice?.dominantSpeakerId ?? null;
  const localSpeaking = voice?.localSpeaking ?? false;
  const joining = voice?.joining ?? false;
  const joinChannel = voice?.joinChannel;

  // Precompute userId → User map to avoid O(members × participants) lookups on every render.
  const memberMap = useMemo(() => new Map(members?.map(m => [m.id, m]) ?? []), [members]);

  const isAdmin =
    isAuthenticated && (currentUser.isSystemAdmin || currentUser.id === server.ownerId);
  const hasServerSettingsAccess =
    isAuthenticated &&
    (currentUser.isSystemAdmin ||
      currentUser.id === server.ownerId ||
      currentUser.role === 'owner' ||
      currentUser.role === 'admin');
  const canLeaveServer =
    isAuthenticated &&
    currentUser.role !== 'guest' &&
    currentUser.role !== 'owner' &&
    !isLeavingServer;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (serverMenuRef.current && !serverMenuRef.current.contains(event.target as Node)) {
        setIsServerMenuOpen(false);
      }
    }
    if (isServerMenuOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isServerMenuOpen]);

  async function handleLeaveServerConfirm() {
    try {
      setIsLeavingServer(true);
      await apiClient.trpcMutation('serverMember.leaveServer', { serverId: server.id });
      showToast({ message: `You left ${server.name}.`, type: 'success' });
      setShowLeaveConfirm(false);
      setIsServerMenuOpen(false);
      router.replace('/channels');
      router.refresh();
    } catch (err) {
      showToast({ message: getUserErrorMessage(err, 'Could not leave server.'), type: 'error' });
    } finally {
      setIsLeavingServer(false);
    }
  }

  const textChannels = channels.filter(
    c =>
      (c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT) &&
      (isAuthenticated || c.visibility !== ChannelVisibility.PRIVATE),
  );
  const voiceChannels = channels.filter(
    c =>
      c.type === ChannelType.VOICE &&
      (isAuthenticated || c.visibility !== ChannelVisibility.PRIVATE),
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/40 sm:hidden'
          onClick={onClose}
          aria-hidden='true'
        />
      )}

      <nav
        aria-label='Channels'
        className={cn(
          'flex w-60 flex-shrink-0 flex-col overflow-hidden',
          BG_SIDEBAR,
          // Desktop: always visible in layout flow
          // Mobile: hidden by default, fixed overlay from left when open
          'hidden sm:flex',
          isOpen && 'fixed inset-y-0 left-[72px] z-30 flex sm:static sm:z-auto',
        )}
      >
        {/* Server name header */}
        <div className='flex h-12 flex-shrink-0 items-center border-b border-black/20 px-4 font-semibold text-white shadow-sm'>
          <span className='truncate'>{server.name}</span>
          <div className='relative ml-auto' ref={serverMenuRef}>
            <button
              type='button'
              aria-haspopup='menu'
              aria-expanded={isServerMenuOpen}
              aria-label='Open server menu'
              onClick={() => setIsServerMenuOpen(v => !v)}
              className='flex flex-shrink-0 items-center rounded p-0.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200'
            >
              <svg
                className='h-4 w-4'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                aria-hidden='true'
                focusable='false'
              >
                <path d='m6 9 6 6 6-6' />
              </svg>
            </button>
            {isServerMenuOpen && (
              <div
                role='menu'
                aria-label='Server actions'
                className='absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-black/30 bg-[#18191c] p-1 shadow-lg'
              >
                {hasServerSettingsAccess && (
                  <Link
                    href={`/settings/${server.slug}`}
                    role='menuitem'
                    onClick={() => setIsServerMenuOpen(false)}
                    className='block rounded px-2 py-1.5 text-sm text-gray-200 hover:bg-white/10'
                  >
                    Server settings
                  </Link>
                )}
                {canLeaveServer && (
                  <button
                    type='button'
                    role='menuitem'
                    onClick={() => {
                      setShowLeaveConfirm(true);
                      setIsServerMenuOpen(false);
                    }}
                    className='block w-full rounded px-2 py-1.5 text-left text-sm text-red-300 hover:bg-red-500/20'
                  >
                    Leave server
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Channel list */}
        <div className='flex-1 overflow-y-auto px-2 py-2'>
          {textChannels.length > 0 && (
            <div className='mb-2'>
              <CategoryHeader
                label='Text Channels'
                isCollapsed={textCollapsed}
                onToggle={() => setTextCollapsed(v => !v)}
                onAdd={
                  isAdmin && onCreateChannel ? () => onCreateChannel(ChannelType.TEXT) : undefined
                }
                addLabel='Add text channel'
              />
              {!textCollapsed && (
                <ul className='list-none'>
                  {textChannels.map(channel => {
                    const isActive = channel.id === currentChannelId;
                    const badge = VISIBILITY_BADGE[channel.visibility];
                    return (
                      <li key={channel.id}>
                        <Link
                          href={`${basePath}/${server.slug}/${channel.slug}`}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'group flex items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors',
                            isActive
                              ? cn(BG_ACTIVE, 'text-white')
                              : 'text-gray-400 hover:bg-[#393c43] hover:text-gray-200',
                          )}
                        >
                          <ChannelIcon type={channel.type} />
                          <span className='flex-1 truncate'>{channel.name}</span>
                          {badge && (
                            <span
                              className='text-xs opacity-60'
                              role='img'
                              aria-label={VISIBILITY_LABEL[channel.visibility]}
                            >
                              {badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {voiceChannels.length > 0 && (
            <div className='mb-2'>
              <CategoryHeader
                label='Voice Channels'
                isCollapsed={voiceCollapsed}
                onToggle={() => setVoiceCollapsed(v => !v)}
                onAdd={
                  isAdmin && onCreateChannel ? () => onCreateChannel(ChannelType.VOICE) : undefined
                }
                addLabel='Add voice channel'
              />
              {!voiceCollapsed && (
                <ul className='list-none'>
                  {voiceChannels.map(channel => (
                    <li key={channel.id}>
                      <button
                        type='button'
                        disabled={!isAuthenticated || joining}
                        aria-disabled={!isAuthenticated || joining}
                        onClick={() => {
                          if (joinChannel) void joinChannel(channel.id, serverId, channel.name);
                        }}
                        className={cn(
                          'group flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors',
                          connectedChannelId === channel.id
                            ? cn(BG_ACTIVE, 'text-white')
                            : 'text-gray-400 hover:bg-[#393c43] hover:text-gray-200',
                          !isAuthenticated && 'cursor-default opacity-60',
                        )}
                      >
                        <ChannelIcon type={channel.type} />
                        <span className='flex-1 truncate text-left'>{channel.name}</span>
                      </button>
                      {/* Participant list for this voice channel — from all-channels map */}
                      {(() => {
                        const channelParticipants = allChannelParticipants[channel.id] ?? [];
                        if (channelParticipants.length === 0) return null;
                        return (
                          <ul className='mb-1 ml-8 mt-1 list-none space-y-0.5'>
                            {channelParticipants.map(p => {
                              const member = memberMap.get(p.userId);
                              const displayName =
                                member?.displayName ?? member?.username ?? p.userId.slice(0, 8);
                              const initial = (displayName[0] ?? '?').toUpperCase();
                              // Show ring for Twilio's dominant speaker OR when local mic level is high.
                              const isSpeaking =
                                dominantSpeakerId === p.userId ||
                                (localSpeaking && p.userId === currentUser.id);
                              return (
                                <li
                                  key={p.userId}
                                  className='flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs text-gray-400'
                                >
                                  {/* Avatar with green ring when speaking */}
                                  <div
                                    className={cn(
                                      'h-5 w-5 flex-shrink-0 overflow-hidden rounded-full',
                                      isSpeaking &&
                                        'ring-2 ring-green-400 ring-offset-1 ring-offset-[#2f3136]',
                                    )}
                                  >
                                    {member?.avatar ? (
                                      <Image
                                        src={member.avatar}
                                        alt={displayName}
                                        width={20}
                                        height={20}
                                        className='h-5 w-5 rounded-full'
                                        unoptimized
                                      />
                                    ) : (
                                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-[#5865f2] text-[9px] font-bold text-white'>
                                        {initial}
                                      </div>
                                    )}
                                  </div>
                                  <span
                                    className={cn(
                                      'flex-1 truncate',
                                      isSpeaking && 'text-green-400',
                                    )}
                                  >
                                    {displayName}
                                  </span>
                                  {p.muted && (
                                    <span className='ml-auto text-[10px] opacity-60'>🔇</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        );
                      })()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* User status bar */}
        <UserStatusBar currentUser={currentUser} isAuthenticated={isAuthenticated} />
      </nav>

      {showLeaveConfirm && (
        <div className='fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4'>
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='leave-server-title'
            className='w-full max-w-md rounded-lg border border-black/30 bg-[#2f3136] p-4 text-gray-100 shadow-xl'
          >
            <h2 id='leave-server-title' className='text-base font-semibold'>
              Leave server?
            </h2>
            <p className='mt-2 text-sm text-gray-300'>
              You are about to leave <span className='font-medium text-white'>{server.name}</span>.
            </p>
            <div className='mt-4 flex items-center justify-end gap-2'>
              <button
                type='button'
                onClick={() => setShowLeaveConfirm(false)}
                className='rounded px-3 py-1.5 text-sm text-gray-200 hover:bg-white/10'
                disabled={isLeavingServer}
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => void handleLeaveServerConfirm()}
                className='rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60'
                disabled={isLeavingServer}
              >
                {isLeavingServer ? 'Leaving...' : 'Leave server'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
