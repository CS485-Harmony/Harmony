'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

/**
 * Client-side authentication guard for protected route layouts.
 *
 * Defense-in-depth layer that catches session expiration during an active
 * session — the Next.js middleware already handles the server-side check on
 * initial navigation. Redirects unauthenticated users to /auth/login with a
 * returnUrl so they land back where they were after signing in.
 *
 * Suppresses children during the loading window to prevent a flash of
 * protected content when middleware misses an invalid cookie.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const fullPath = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      router.replace(`/auth/login?returnUrl=${encodeURIComponent(fullPath)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router, searchParams]);

  if (isLoading || !isAuthenticated) return null;
  return <>{children}</>;
}
