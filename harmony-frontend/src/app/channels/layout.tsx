import { Suspense, type ReactNode } from 'react';
import { AuthGuard } from '@/components/layout/AuthGuard';

/** Wraps all /channels/* authenticated routes. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
