import { redirect } from 'next/navigation';
import { getServers } from '@/services/serverService';
import { NoServersView } from '@/components/channel/NoServersView';

export const dynamic = 'force-dynamic';

/**
 * /channels index — redirects to the user's first server,
 * or renders NoServersView with a "Create a Server" prompt if they haven't joined any.
 */
export default async function ChannelsPage() {
  const servers = await getServers();
  const first = servers[0];
  if (first) redirect(`/channels/${first.slug}`);

  return <NoServersView />;
}
