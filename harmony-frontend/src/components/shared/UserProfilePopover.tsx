'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import type { UserStatus } from '@/types';

interface UserProfileData {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  status: string;
}

interface UserProfilePopoverProps {
  userId: string;
  /** Pre-loaded data shown immediately while full profile loads */
  seed?: {
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  /** Position anchor (bounding rect of the clicked element) */
  anchorRect: DOMRect;
  onClose: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  online: 'bg-green-500',
  idle: 'bg-yellow-400',
  dnd: 'bg-red-500',
  offline: 'bg-gray-400',
};

const STATUS_LABEL: Record<string, string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline',
};

export function UserProfilePopover({
  userId,
  seed,
  anchorRect,
  onClose,
}: UserProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  // Capture seed at mount — call sites pass inline object literals, so
  // including `seed` in the effect deps would re-fetch on every parent render.
  const seedRef = useRef(seed);

  useEffect(() => {
    apiClient
      .trpcQuery<UserProfileData>('user.getUser', { userId })
      .then(setUser)
      .catch(() => {
        // If fetch fails, fall back to seed data with offline status
        const s = seedRef.current;
        if (s) setUser({ id: userId, ...s, status: 'offline' });
      });
  }, [userId]); // seed intentionally omitted — captured via seedRef

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Compute position: prefer right of anchor, flip left if near viewport edge
  const style = (() => {
    const GAP = 8;
    const POPOVER_WIDTH = 240;
    const viewportWidth = window.innerWidth;

    let left = anchorRect.right + GAP;
    if (left + POPOVER_WIDTH > viewportWidth - GAP) {
      left = anchorRect.left - POPOVER_WIDTH - GAP;
    }
    if (left < GAP) left = GAP;

    // Clamp top so the popover stays visible on short/mobile viewports
    const POPOVER_HEIGHT_APPROX = 210;
    const top = Math.min(
      Math.max(GAP, anchorRect.top),
      window.innerHeight - POPOVER_HEIGHT_APPROX - GAP,
    );

    return { top, left, width: POPOVER_WIDTH };
  })();

  const displayed = user ?? (seed ? { ...seed, id: userId, status: 'offline' } : null);
  const displayName = displayed?.displayName || displayed?.username || '…';
  const username = displayed?.username || '';
  const avatarUrl = displayed?.avatarUrl;
  const status = (user?.status?.toLowerCase() ?? 'offline') as UserStatus;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      ref={popoverRef}
      role='dialog'
      aria-label={`${displayName}'s profile`}
      className='fixed z-50 rounded-lg bg-[#18191c] shadow-2xl ring-1 ring-black/40'
      style={style}
    >
      {/* Banner */}
      <div className='h-10 rounded-t-lg bg-[#5865f2]' />
      {/* Avatar + name side-by-side */}
      <div className='flex items-center gap-3 px-4 py-3'>
        <div className='relative flex-shrink-0'>
          {avatarUrl && !avatarError ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={56}
              height={56}
              unoptimized
              className='h-14 w-14 rounded-full ring-4 ring-[#18191c]'
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#5865f2] text-xl font-bold text-white ring-4 ring-[#18191c]'>
              {initial}
            </div>
          )}
          <span
            className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-[#18191c] ${STATUS_COLOR[status] ?? STATUS_COLOR.offline}`}
            aria-label={STATUS_LABEL[status] ?? 'Offline'}
          />
        </div>

        <div>
          <p className='text-base font-bold leading-tight text-white'>
            {displayName}
          </p>
          {username && username !== displayName && (
            <p className='mt-0.5 text-xs text-gray-400'>@{username}</p>
          )}
          <p className='mt-1 text-xs text-gray-500'>{STATUS_LABEL[status] ?? 'Offline'}</p>
        </div>
      </div>
    </div>
  );
}
