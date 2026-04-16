import { redirect } from 'next/navigation';
import { getServers } from '@/services/serverService';
import { TrpcHttpError } from '@/lib/trpc-client';
import { EmptyShell } from '@/components/layout/EmptyShell';
import { NoServersContent } from '@/components/channel/NoServersContent';
import type { Server } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * /channels index — redirects to the user's first server, or renders the
 * empty shell with a "no servers" prompt if the user hasn't joined any.
 */
export default async function ChannelsPage() {
  let servers: Server[];
  try {
    servers = await getServers();
  } catch (err) {
    // Only redirect to login for auth failures; rethrow other errors (network, 5xx) so
    // Next.js surfaces them honestly rather than masking them as an auth problem.
    if (err instanceof TrpcHttpError && err.status === 401) redirect('/auth/login');
    throw err;
  }
  const first = servers[0];
  if (first) redirect(`/channels/${first.slug}`);

  return (
    <EmptyShell servers={[]} basePath='/channels'>
      <NoServersContent />
    </EmptyShell>
  );
}
