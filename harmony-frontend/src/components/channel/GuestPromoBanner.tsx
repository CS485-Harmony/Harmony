/**
 * Channel Component: GuestPromoBanner
 * Non-intrusive sticky bottom banner encouraging guests to join Harmony.
 * Dismiss state persists for the browser session via sessionStorage.
 * Based on dev spec C1.4 GuestPromoBanner
 */

'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeDisplayLabel } from '@/lib/utils';

const DISMISS_KEY = 'harmony_guest_banner_dismissed';

function isDismissedInStorage(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === 'true';
  } catch {
    return false;
  }
}

interface GuestPromoBannerProps {
  serverName: string;
  memberCount: number;
}

export function GuestPromoBanner({ serverName, memberCount }: GuestPromoBannerProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const safeServerName = sanitizeDisplayLabel(serverName) || 'Server';
  // useSyncExternalStore with a server snapshot of `true` (hidden) prevents
  // hydration mismatch: SSR and initial client render both produce null, then
  // React reconciles with the real client snapshot after hydration — no
  // setState-in-effect needed.
  const storageDismissed = useSyncExternalStore(
    () => () => {}, // sessionStorage has no change events
    isDismissedInStorage, // client snapshot
    () => true, // server snapshot: always hidden
  );

  // Tracks in-memory dismiss for the current render cycle, covering the case
  // where sessionStorage.setItem throws (private browsing, etc.).
  const [manuallyDismissed, setManuallyDismissed] = useState(false);

  const handleDismiss = useCallback(() => {
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // sessionStorage unavailable — still dismiss in-memory
    }
    setManuallyDismissed(true);
  }, []);

  if (storageDismissed || manuallyDismissed || isAuthenticated) return null;

  const returnUrl = encodeURIComponent(pathname);

  return (
    <aside
      aria-label='Join server promotion'
      className='sticky bottom-0 z-20 border-t border-[#2a2d31] bg-[#2f3136] px-4 py-3 shadow-lg'
    >
      <div className='mx-auto flex max-w-4xl items-center gap-3'>
        {/* Server icon — first letter avatar */}
        <div
          className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white'
          aria-hidden='true'
        >
          {safeServerName[0].toUpperCase()}
        </div>

        {/* Server info */}
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold text-white'>{safeServerName}</p>
          <p className='text-xs text-gray-400'>{memberCount.toLocaleString()} members</p>
        </div>

        {/* CTAs */}
        <div className='flex shrink-0 items-center gap-2'>
          <Link
            href={`/auth/signup?returnUrl=${returnUrl}`}
            className='inline-flex h-8 items-center justify-center rounded-md bg-[#5865f2] px-3 text-sm font-medium text-white transition-colors hover:bg-[#4752c4]'
          >
            <span className='hidden sm:inline'>Create Account</span>
            <span className='sm:hidden'>Join</span>
          </Link>
          <Link
            href={`/auth/login?returnUrl=${returnUrl}`}
            className='inline-flex h-8 items-center justify-center rounded-md border border-white/20 bg-[#40444b] px-3 text-sm font-medium text-gray-200 transition-colors hover:bg-[#3d4148]'
          >
            Log In
          </Link>
          <button
            type='button'
            onClick={handleDismiss}
            className='ml-1 rounded p-1 text-gray-400 transition-colors hover:bg-[#40444b] hover:text-white'
            aria-label='Dismiss banner'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
              focusable='false'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
