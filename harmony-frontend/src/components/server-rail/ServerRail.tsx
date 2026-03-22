/**
 * Component: ServerRail
 * Leftmost 72px server icon rail. Renders server icons, Home button, divider,
 * active-server pill indicator, hover tooltips, and an Add Server placeholder.
 * Hidden on mobile (sm:flex), always visible on desktop.
 */

'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DEFAULT_HOME_PATH } from '@/lib/constants';
import { ChannelType } from '@/types';
import type { Server, Channel } from '@/types';

// ─── ServerPill ───────────────────────────────────────────────────────────────

function ServerPill({
  server,
  defaultChannelSlug,
  isActive,
  basePath,
}: {
  server: Server;
  defaultChannelSlug: string;
  isActive: boolean;
  basePath: string;
}) {
  const [iconError, setIconError] = useState(false);
  // Render-phase derived-state reset: when the icon URL changes (including A→B→A),
  // reset iconError so the new URL is always attempted.
  const [prevIcon, setPrevIcon] = useState(server.icon);
  if (prevIcon !== server.icon) {
    setPrevIcon(server.icon);
    if (iconError) setIconError(false);
  }

  const initials = server.name
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`${basePath}/${server.slug}/${defaultChannelSlug}`}
      title={server.name}
      aria-label={server.name}
      aria-current={isActive ? 'page' : undefined}
      className='group relative flex items-center'
    >
      <span
        className={cn(
          'absolute -left-1 w-1 rounded-r-full bg-white transition-all',
          isActive ? 'h-8' : 'h-0 group-hover:h-4',
        )}
      />
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-[24px] transition-all duration-200 text-white font-bold text-sm overflow-hidden',
          isActive
            ? 'rounded-[16px] bg-[#5865f2]'
            : 'bg-[#36393f] group-hover:rounded-[16px] group-hover:bg-[#5865f2]',
        )}
      >
        {server.icon && !iconError ? (
          <Image
            src={server.icon}
            alt={server.name}
            width={48}
            height={48}
            unoptimized
            className='h-full w-full object-cover'
            onError={() => setIconError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    </Link>
  );
}

// ─── ServerRail ───────────────────────────────────────────────────────────────

export function ServerRail({
  servers,
  allChannels,
  currentServerId,
  basePath,
  onAddServer,
  onBrowseServers,
  isMobileVisible = false,
}: {
  servers: Server[];
  /** All channels across every server — used to derive the default channel slug per server. */
  allChannels: Channel[];
  currentServerId: string;
  basePath: string;
  onAddServer?: () => void;
  /** Opens the Browse Public Servers modal. */
  onBrowseServers?: () => void;
  /** When true, the rail is shown on mobile (inside the menu drawer). */
  isMobileVisible?: boolean;
}) {
  // Memoized so the map is only rebuilt when allChannels changes, not on every
  // parent re-render (e.g. search/menu toggles in HarmonyShell).
  const defaultChannelByServer = useMemo(() => {
    const map = new Map<string, string>();
    const textOrAnnouncement = allChannels
      .filter(c => c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT)
      .sort((a, b) => a.position - b.position);
    for (const channel of textOrAnnouncement) {
      if (!map.has(channel.serverId)) {
        map.set(channel.serverId, channel.slug);
      }
    }
    return map;
  }, [allChannels]);

  // Home links to a stable, hardcoded entry point (DEFAULT_HOME_PATH) rather
  // than deriving from servers[0], which would change if server ordering changes.
  //
  // TODO: When real user/server data is wired up, revisit this. "Home" should
  // ideally navigate to the user's DM inbox or a personalized landing route —
  // not a hardcoded server channel. Update DEFAULT_HOME_PATH or replace this
  // with a user-context-aware route at that point.
  const homeHref = `${basePath}${DEFAULT_HOME_PATH}`;

  return (
    <nav
      aria-label='Servers'
      className={cn(
        'w-[72px] flex-shrink-0 flex-col items-center gap-2 overflow-y-auto py-3 bg-[#202225]',
        isMobileVisible
          ? 'fixed inset-y-0 left-0 z-30 flex sm:static sm:z-auto'
          : 'hidden sm:flex',
      )}
    >
      {/* Home button */}
      <Link
        href={homeHref}
        className='group relative mb-2 flex items-center'
        title='Home'
        aria-label='Home'
      >
        <div className='flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#5865f2] text-white transition-all duration-200 group-hover:rounded-[16px]'>
          <svg
            className='h-6 w-6'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.030z' />
          </svg>
        </div>
      </Link>

      {/* Divider */}
      <div className='mx-auto h-0.5 w-8 rounded-full bg-[#36393f]' />

      {/* Server list */}
      {servers.map(server => {
        const defaultChannelSlug = defaultChannelByServer.get(server.id) ?? 'general';
        return (
          <ServerPill
            key={server.id}
            server={server}
            defaultChannelSlug={defaultChannelSlug}
            isActive={server.id === currentServerId}
            basePath={basePath}
          />
        );
      })}

      {/* Divider before actions */}
      <div className='mx-auto h-0.5 w-8 rounded-full bg-[#36393f]' />

      {/* Browse Public Servers */}
      <button
        type='button'
        title='Browse Public Servers'
        aria-label='Browse Public Servers'
        className='group relative flex items-center'
        disabled={!onBrowseServers}
        onClick={onBrowseServers}
      >
        <div className='flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#36393f] text-[#3ba55c] transition-all duration-200 group-hover:rounded-[16px] group-hover:bg-[#3ba55c] group-hover:text-white'>
          {/* Compass / explore icon */}
          <svg
            className='h-6 w-6'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z' />
          </svg>
        </div>
      </button>

      {/* Add Server */}
      <button
        type='button'
        title='Add a Server'
        aria-label='Add a Server'
        className='group relative flex items-center'
        disabled={!onAddServer}
        onClick={onAddServer}
      >
        <div className='flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#36393f] text-[#3ba55c] transition-all duration-200 group-hover:rounded-[16px] group-hover:bg-[#3ba55c] group-hover:text-white'>
          <svg
            className='h-6 w-6'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M20 11.0001H13V4.00006C13 3.44778 12.5523 3.00006 12 3.00006C11.4477 3.00006 11 3.44778 11 4.00006V11.0001H4C3.44772 11.0001 3 11.4478 3 12.0001C3 12.5523 3.44772 13.0001 4 13.0001H11V20.0001C11 20.5523 11.4477 21.0001 12 21.0001C12.5523 21.0001 13 20.5523 13 20.0001V13.0001H20C20.5523 13.0001 21 12.5523 21 12.0001C21 11.4478 20.5523 11.0001 20 11.0001Z' />
          </svg>
        </div>
      </button>
    </nav>
  );
}
