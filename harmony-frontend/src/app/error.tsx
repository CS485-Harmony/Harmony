'use client';

/**
 * ErrorPage — generic client-side error boundary
 * Next.js App Router automatically renders this when an unhandled error is
 * thrown inside a route segment. Must be a Client Component.
 * Issue #36 — Build 404 and error pages
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createFrontendLogger } from '@/lib/frontend-logger';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const pathname = usePathname();

  useEffect(() => {
    createFrontendLogger({ component: 'app-error-boundary' }).error(
      'Route segment error boundary rendered',
      {
        feature: 'react-error-boundary',
        event: 'render_error_boundary',
        route: pathname ?? '/',
        error,
      },
    );
  }, [error, pathname]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-discord-bg-primary px-4 text-center'>
      <p className='text-6xl font-black text-discord-accent select-none'>:(</p>

      <h1 className='mt-4 text-2xl font-bold text-white'>Something went wrong.</h1>

      <p className='mt-2 max-w-sm text-sm text-discord-text-muted'>
        An unexpected error occurred. You can try again, or head back home if the problem persists.
      </p>

      <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row'>
        <button
          onClick={reset}
          className='rounded bg-discord-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-discord-accent focus-visible:ring-offset-2 focus-visible:ring-offset-discord-bg-primary'
        >
          Try again
        </button>

        <Link
          href='/'
          className='text-sm font-medium text-discord-text-muted underline-offset-4 hover:text-white hover:underline transition-colors'
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
