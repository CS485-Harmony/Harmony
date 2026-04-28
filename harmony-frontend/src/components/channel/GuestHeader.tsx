'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeDisplayLabel } from '@/lib/utils';
import type { Server } from '@/types';

type PublicServer = Omit<Server, 'ownerId'>;

export function GuestHeader({ server }: { server: PublicServer }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const returnUrl = encodeURIComponent(pathname);
  const safeServerName = sanitizeDisplayLabel(server.name) || 'Server';

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

      {/* Auth CTAs — hidden for authenticated users (e.g. non-member 403 path) */}
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
    </header>
  );
}
