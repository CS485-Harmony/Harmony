import { ServerSettingsPage } from '@/components/settings/ServerSettingsPage';
import { requireServerSettingsAccess } from './settings-access';
import { getSessionUser } from '@/lib/trpc-client';

interface PageProps {
  params: Promise<{ serverSlug: string }>;
}

export default async function ServerSettingsRoute({ params }: PageProps) {
  const { serverSlug } = await params;
  const [server, sessionUser] = await Promise.all([
    requireServerSettingsAccess(serverSlug),
    getSessionUser(),
  ]);

  return (
    <ServerSettingsPage
      server={server}
      serverSlug={serverSlug}
      canDeleteServer={Boolean(
        sessionUser && (sessionUser.isSystemAdmin || sessionUser.id === server.ownerId),
      )}
    />
  );
}
