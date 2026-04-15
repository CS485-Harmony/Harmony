'use client';

/**
 * ServerErrorPage (global-error.tsx) — root-level error boundary
 * Next.js requires this file to be named global-error.tsx. It catches errors
 * thrown in the root layout (app/layout.tsx) and must render its own
 * <html> and <body> tags since it replaces the entire page.
 * Issue #36 — Build 404 and error pages
 */

import { useEffect } from 'react';
import { createFrontendLogger } from '@/lib/frontend-logger';

interface ServerErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ServerErrorPage({ error, reset }: ServerErrorPageProps) {
  useEffect(() => {
    createFrontendLogger({ component: 'global-error-boundary' }).error(
      'Root error boundary rendered',
      {
        feature: 'react-error-boundary',
        event: 'render_root_error_boundary',
        route: typeof window !== 'undefined' ? window.location.pathname : '/',
        error,
      },
    );
  }, [error]);

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <style>{`
          .retry-btn:hover { background-color: #4752c4; }
          .retry-btn:focus-visible { outline: 2px solid #5865f2; outline-offset: 2px; }
          .support-link:hover { color: #7983f5; }
          .support-link:focus-visible { outline: 2px solid #5865f2; outline-offset: 2px; border-radius: 2px; }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#36393f',
          color: '#dcddde',
          fontFamily: 'Inter, Open Sans, Arial, Helvetica, sans-serif',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        <p
          style={{
            fontSize: '4rem',
            fontWeight: 900,
            color: '#5865f2',
            userSelect: 'none',
            margin: 0,
          }}
        >
          500
        </p>

        <h1
          style={{
            marginTop: '1rem',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          Something went wrong on our end.
        </h1>

        <p
          style={{
            marginTop: '0.5rem',
            maxWidth: '24rem',
            fontSize: '0.875rem',
            color: '#72767d',
          }}
        >
          We&apos;re having trouble loading this page. If this keeps happening, please reach out at{' '}
          <a
            href='mailto:support@harmony.app'
            className='support-link'
            style={{ color: '#5865f2', textDecoration: 'underline' }}
          >
            support@harmony.app
          </a>
          .
        </p>

        <button
          onClick={reset}
          className='retry-btn'
          style={{
            marginTop: '2rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: '#5865f2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
