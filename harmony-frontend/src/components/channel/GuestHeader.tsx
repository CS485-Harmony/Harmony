'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeDisplayLabel, getUserErrorMessage } from '@/lib/utils';
import type { Server } from '@/types';

type PublicServer = Omit<Server, 'ownerId'>;

interface GuestHeaderProps {
  server: PublicServer;
  /** Server action bound to the current server's ID. Omit for contexts where joining is not available. */
  joinAction?: () => Promise<{ channelSlug: string }>;
}

export function GuestHeader({ server, joinAction }: GuestHeaderProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [joinError, setJoinError] = useState<string | null>(null);
  const returnUrl = encodeURIComponent(pathname);
  const safeServerName = sanitizeDisplayLabel(server.name) || 'Server';

  function handleJoin() {
    if (!joinAction) return;
    setJoinError(null);
    startTransition(async () => {
      try {
        const { channelSlug } = await joinAction();
        router.push(`/channels/${server.slug}/${channelSlug}`);
      } catch (err) {
        setJoinError(getUserErrorMessage(err, 'Could not join server. Please try again.'));
      }
    });
  }

  return (
    <header className='flex h-14 shrink-0 items-center gap-3 border-b border-black/20 bg-[#2f3136] px-4'>
      {/* Harmony logo wordmark */}
      <span className='text-lg font-bold text-[#5865f2]'>Harmony</span>

      {/* Divider */}
      <span className='text-gray-600' aria-hidden='true'>
        /
      </span>

      {/* Server name — min-w-0 flex-1 prevents overflow when CTAs are present */}
      <span className='min-w-0 flex-1 truncate text-sm font-semibold text-white'>
        {safeServerName}
      </span>

      {/* Auth CTAs for unauthenticated visitors */}
      {!isAuthenticated && (
        <div className='flex shrink-0 items-center gap-2'>
          <Link
            href={`/auth/signup?returnUrl=${returnUrl}`}
            className='inline-flex h-7 items-center justify-center rounded-md bg-[#5865f2] px-3 text-xs font-medium text-white transition-colors hover:bg-[#4752c4]'
          >
            <span className='hidden sm:inline'>Create Account</span>
            <span className='sm:hidden'>Join</span>
          </Link>
          <Link
            href={`/auth/login?returnUrl=${returnUrl}`}
            className='inline-flex h-7 items-center justify-center rounded-md border border-white/20 bg-[#40444b] px-3 text-xs font-medium text-gray-200 transition-colors hover:bg-[#3d4148]'
          >
            Log In
          </Link>
        </div>
      )}

      {/* CTAs for authenticated non-members */}
      {isAuthenticated && (
        <div className='flex shrink-0 items-center gap-2'>
          {joinError && (
            <span role='alert' className='text-xs text-red-400'>
              {joinError}
            </span>
          )}
          <Link
            href='/channels'
            className='inline-flex h-7 items-center justify-center rounded-md border border-white/20 bg-[#40444b] px-3 text-xs font-medium text-gray-200 transition-colors hover:bg-[#3d4148]'
          >
            My Servers
          </Link>
          {joinAction && (
            <button
              type='button'
              onClick={handleJoin}
              disabled={isPending}
              className='inline-flex h-7 items-center justify-center rounded-md bg-[#5865f2] px-3 text-xs font-medium text-white transition-colors hover:bg-[#4752c4] disabled:opacity-60'
            >
              {isPending ? 'Joining…' : 'Join Server'}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
