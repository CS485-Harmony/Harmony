/**
 * Channel Component: TopBar
 * Full-width navigation bar displayed above the message area.
 * Shows channel name/topic on the left and action icons on the right.
 * Ref: dev-spec-channel-visibility-toggle.md — C1.3 TopBar
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { truncate } from '@/lib/utils';
import { NotificationBell } from '@/components/channel/NotificationBell';
import type { Channel } from '@/types';

// ─── Icons (inline SVG to avoid extra dependencies) ──────────────────────────

function HashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <line x1='4' y1='9' x2='20' y2='9' />
      <line x1='4' y1='15' x2='20' y2='15' />
      <line x1='10' y1='3' x2='8' y2='21' />
      <line x1='16' y1='3' x2='14' y2='21' />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.35-4.35' />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

function MembersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <line x1='4' y1='6' x2='20' y2='6' />
      <line x1='4' y1='12' x2='20' y2='12' />
      <line x1='4' y1='18' x2='20' y2='18' />
    </svg>
  );
}

// ─── Icon button helper ───────────────────────────────────────────────────────

function IconButton({
  onClick,
  title,
  active,
  ariaPressed,
  disabled,
  children,
}: {
  onClick?: () => void;
  title: string;
  active?: boolean;
  /** Set for toggle buttons so screen readers announce pressed state */
  ariaPressed?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={ariaPressed}
      className={cn(
        'rounded p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        active ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/10 hover:text-gray-200',
      )}
    >
      {children}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface TopBarProps {
  /** The channel currently being viewed */
  channel: Pick<Channel, 'name' | 'topic' | 'slug'>;
  /** The server slug, used to build the settings link */
  serverSlug: string;
  /** Whether the current user has admin access (owner of the server) */
  isAdmin?: boolean;
  /** Whether the members sidebar is currently open */
  isMembersOpen?: boolean;
  /** Callback to toggle the members sidebar */
  onMembersToggle?: () => void;
  /** Whether the channel sidebar drawer is currently open (mobile) */
  isMenuOpen?: boolean;
  /** Callback to toggle the channel sidebar drawer (mobile) */
  onMenuToggle?: () => void;
  /** Callback fired when the search icon is clicked */
  onSearchOpen?: () => void;
  /** Callback fired when the pinned messages icon is clicked */
  onPinsOpen?: () => void;
  /** Disable actions that would reveal message content while the channel is locked. */
  disableMessageActions?: boolean;
  /** Authenticated user ID — enables the notification bell when present. */
  userId?: string;
  /** Called when unread mention counts change per server — forwarded to NotificationBell. */
  onUnreadCountsByServerChange?: (counts: Record<string, number>) => void;
  /** Called when unread mention counts change per channel — forwarded to NotificationBell. */
  onUnreadCountsByChannelChange?: (counts: Record<string, number>) => void;
  /** ID of the channel currently being viewed — used to auto-mark mentions as read. */
  currentChannelId?: string;
}

export function TopBar({
  channel,
  serverSlug,
  isAdmin = false,
  isMembersOpen,
  onMembersToggle,
  isMenuOpen,
  onMenuToggle,
  onSearchOpen,
  onPinsOpen,
  disableMessageActions = false,
  userId,
  onUnreadCountsByServerChange,
  onUnreadCountsByChannelChange,
  currentChannelId,
}: TopBarProps) {
  const settingsHref = `/settings/${serverSlug}/${channel.slug}`;

  return (
    <header className='flex h-12 items-center gap-2 border-b border-black/20 bg-[#36393f] px-4 shadow-sm'>
      {/* ── Hamburger (mobile only) ── */}
      <button
        onClick={onMenuToggle}
        aria-label='Open channel list'
        aria-expanded={isMenuOpen ?? false}
        className='rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-gray-200 sm:hidden'
      >
        <MenuIcon />
      </button>

      {/* ── Left: channel identity ── */}
      <div className='flex min-w-0 flex-1 items-center gap-2'>
        <HashIcon className='flex-shrink-0 text-gray-400' />
        <span className='truncate font-semibold text-white'>{channel.name}</span>

        {channel.topic && (
          <>
            <span className='hidden select-none text-gray-600 sm:inline'>|</span>
            <span className='hidden min-w-0 truncate text-sm text-gray-400 sm:block'>
              {truncate(channel.topic, 80)}
            </span>
          </>
        )}
      </div>

      {/* ── Right: action icons ── */}
      <div className='flex flex-shrink-0 items-center gap-0.5'>
        {/* Search */}
        <IconButton
          onClick={disableMessageActions ? undefined : onSearchOpen}
          title='Search'
          disabled={disableMessageActions}
        >
          <SearchIcon />
        </IconButton>

        {/* Pinned messages */}
        <IconButton
          onClick={disableMessageActions ? undefined : onPinsOpen}
          title='Pinned messages'
          disabled={disableMessageActions}
        >
          <PinIcon />
        </IconButton>

        {/* Members sidebar toggle */}
        <IconButton
          onClick={onMembersToggle}
          title='Show member list'
          active={isMembersOpen}
          ariaPressed={isMembersOpen}
        >
          <MembersIcon />
        </IconButton>

        {/* Notification bell — authenticated users only */}
        <NotificationBell userId={userId} onUnreadCountsByServerChange={onUnreadCountsByServerChange} onUnreadCountsByChannelChange={onUnreadCountsByChannelChange} currentChannelId={currentChannelId} />

        {/* Settings gear — admin/owner only */}
        {isAdmin && (
          <Link
            href={settingsHref}
            title='Channel settings'
            aria-label='Channel settings'
            className='rounded p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200'
          >
            <GearIcon />
          </Link>
        )}
      </div>
    </header>
  );
}
