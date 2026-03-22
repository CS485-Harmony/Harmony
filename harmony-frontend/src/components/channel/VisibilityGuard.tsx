/**
 * Channel Component: VisibilityGuard
 * Gates guest access based on channel visibility state.
 *
 * Visibility rules:
 *   PUBLIC_INDEXABLE  → render children
 *   PUBLIC_NO_INDEX   → render children (same guest experience)
 *   PRIVATE           → render AccessDeniedPage
 *
 * Ref: dev-spec-guest-public-channel-view.md — VisibilityGuard (C1.2)
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ChannelVisibility } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// ─── Loading state ────────────────────────────────────────────────────────────

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

// ─── Error state (channel not found / fetch failed) ───────────────────────────

function VisibilityError({ message }: { message?: string }) {
  return (
    <div className='flex h-screen flex-1 items-center justify-center bg-[#36393f] p-8'>
      <div className='flex max-w-sm flex-col items-center gap-4 text-center'>
        {/* Icon */}
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

// ─── Access denied page (PRIVATE channel) ────────────────────────────────────

function AccessDeniedPage() {
  const router = useRouter();
  const pathname = usePathname();
  const returnUrl = encodeURIComponent(pathname);

  return (
    <div className='flex h-screen flex-1 items-center justify-center bg-[#36393f] p-8'>
      <div className='flex max-w-sm flex-col items-center gap-5 text-center'>
        {/* Lock icon */}
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#40444b]'>
          <svg
            className='h-8 w-8 text-gray-300'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
          >
            <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
            <path d='M7 11V7a5 5 0 0 1 10 0v4' />
          </svg>
        </div>

        {/* Copy */}
        <div>
          <h2 className='text-xl font-semibold text-white'>This channel is private</h2>
          <p className='mt-2 text-sm text-gray-400'>
            Sign up or log in to request access to this channel.
          </p>
        </div>

        {/* CTAs */}
        <div className='flex w-full flex-col gap-2'>
          <Link
            href={`/auth/signup?returnUrl=${returnUrl}`}
            className='flex w-full items-center justify-center rounded-md bg-[#5865f2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4]'
          >
            Create Account
          </Link>
          <Link
            href={`/auth/login?returnUrl=${returnUrl}`}
            className='flex w-full items-center justify-center rounded-md border border-white/20 bg-[#40444b] px-4 py-2.5 text-sm font-semibold text-gray-200 transition-colors hover:bg-[#3d4148]'
          >
            Log In
          </Link>
          <button
            onClick={() => router.back()}
            className='flex w-full cursor-pointer items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:text-gray-200'
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

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
   * non-admin members are shown AccessDeniedPage for PRIVATE channels, covering
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

  // #c35: explicit errors go to VisibilityError; null visibility (still unknown)
  // falls through to VisibilityLoading rather than showing "Channel not found".
  if (error) {
    return <VisibilityError message={error} />;
  }

  if (visibility === null) {
    return <VisibilityLoading />;
  }

  // Wait for auth state to be restored before deciding on private channel access
  if (visibility === ChannelVisibility.PRIVATE && isAuthLoading) {
    return <VisibilityLoading />;
  }

  if (visibility === ChannelVisibility.PRIVATE) {
    // Unauthenticated users never have access to PRIVATE channels.
    if (!isAuthenticated) {
      return <AccessDeniedPage />;
    }

    // Authenticated non-admin members also cannot access PRIVATE channels.
    // Admins and the server owner retain access. This guards the direct-URL
    // path: a non-admin member who navigates to a PRIVATE channel URL after
    // the real-time SSE redirect was missed will be blocked here.
    // isAdmin(serverOwnerId) covers the server owner and system admins.
    // isServerAdmin is the server-scoped member role passed from the parent,
    // because isAdmin() with no arg checks AuthContext user.role which is always
    // 'member' for non-system-admin users (mapBackendUser hardcodes this).
    const userIsAdminOrOwner = isAdmin(serverOwnerId) || isServerAdmin;
    if (!userIsAdminOrOwner) {
      return <AccessDeniedPage />;
    }
  }

  // PUBLIC_INDEXABLE or PUBLIC_NO_INDEX, or PRIVATE + admin/owner — show content
  return <>{children}</>;
}
