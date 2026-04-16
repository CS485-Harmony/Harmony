/**
 * Channel Component: VisibilityGuard
 * Gates guest access based on channel visibility state.
 *
 * Visibility rules:
 *   PUBLIC_INDEXABLE  → render children
 *   PUBLIC_NO_INDEX   → render children (same guest experience)
 *   PRIVATE           → unauthenticated: AccessDeniedPage (with login/signup CTAs)
 *                       authenticated non-admin/non-owner: NoPermissionPage
 *                       authenticated admin/owner: render children
 *
 * Ref: dev-spec-guest-public-channel-view.md — VisibilityGuard (C1.2)
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChannelVisibility } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { PrivateChannelLockedPane } from '@/components/channel/PrivateChannelLockedPane';

function VisibilityLoading() {
  return (
    <div className='flex h-screen flex-1 items-center justify-center bg-[#36393f] p-8'>
      <div className='flex flex-col items-center gap-3 text-gray-400'>
        <svg
          className='h-8 w-8 animate-spin'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path d='M21 12a9 9 0 1 1-6.219-8.56' />
        </svg>
        <p className='text-sm'>Checking access…</p>
      </div>
    </div>
  );
}

function VisibilityError({ message }: { message?: string }) {
  return (
    <div className='flex h-screen flex-1 items-center justify-center bg-[#36393f] p-8'>
      <div className='flex max-w-sm flex-col items-center gap-4 text-center'>
        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-[#f04747]/20'>
          <svg
            className='h-7 w-7 text-red-400'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
          >
            <circle cx='12' cy='12' r='10' />
            <path d='M12 8v4M12 16h.01' />
          </svg>
        </div>

        <div>
          <h2 className='text-lg font-semibold text-white'>Channel not found</h2>
          <p className='mt-1 text-sm text-gray-400'>
            {message ?? "This channel doesn't exist or could not be loaded."}
          </p>
        </div>

        <Link
          href='/'
          className='rounded-md bg-[#5865f2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4752c4]'
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

export interface VisibilityGuardProps {
  /** Current channel visibility state. Pass null while loading. */
  visibility: ChannelVisibility | null;
  /** Set to true while the channel is being fetched */
  isLoading?: boolean;
  /** Set to an error message if the channel fetch failed */
  error?: string | null;
  /**
   * The ownerId of the server that owns this channel. When provided,
   * VisibilityGuard uses it to check whether the authenticated user is an
   * admin/owner and therefore allowed to view PRIVATE channels. Authenticated
   * non-admin members are shown NoPermissionPage for PRIVATE channels, covering
   * the direct-URL access path that the real-time SSE redirect cannot guard.
   */
  serverOwnerId?: string;
  /**
   * Whether the current authenticated user has admin or owner role within this
   * server, derived from the server-scoped member list. This is required because
   * isAdmin() with no arg checks AuthContext user.role, which is always 'member'
   * for non-system-admin users (mapBackendUser sets role: 'member' for everyone
   * except system admins). Passing this prop lets VisibilityGuard correctly allow
   * access for server admins when viewing PRIVATE channels directly by URL.
   */
  isServerAdmin?: boolean;
  /** Content to render when the channel is accessible */
  children: React.ReactNode;
}

export function VisibilityGuard({
  visibility,
  isLoading,
  error,
  serverOwnerId,
  isServerAdmin,
  children,
}: VisibilityGuardProps) {
  const { isAuthenticated, isLoading: isAuthLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <VisibilityLoading />;
  }

  if (error) {
    return <VisibilityError message={error} />;
  }

  if (visibility === null) {
    return <VisibilityLoading />;
  }

  if (visibility === ChannelVisibility.PRIVATE && isAuthLoading) {
    return <VisibilityLoading />;
  }

  if (visibility === ChannelVisibility.PRIVATE) {
    if (!isAuthenticated) {
      return <PrivateChannelLockedPane mode='guest' fullScreen />;
    }

    const userIsAdminOrOwner = isAdmin(serverOwnerId) || isServerAdmin;
    if (!userIsAdminOrOwner) {
      return <PrivateChannelLockedPane mode='member' fullScreen />;
    }
  }

  return <>{children}</>;
}
