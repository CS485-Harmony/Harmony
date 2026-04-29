import { ServerSettingsPage } from '@/components/settings/ServerSettingsPage';
import { requireServerSettingsAccess } from './settings-access';
import { getSessionUser, trpcQuery } from '@/lib/trpc-client';
import type { PermissionMatrix } from '@/components/settings/PermissionsSection';

interface PageProps {
  params: Promise<{ serverSlug: string }>;
}

export default async function ServerSettingsRoute({ params }: PageProps) {
  const { serverSlug } = await params;
  const [server, sessionUser, permissionMatrix] = await Promise.all([
    requireServerSettingsAccess(serverSlug),
    getSessionUser(),
    trpcQuery<PermissionMatrix>('permission.getMatrix').catch((): null => null),
  ]);

  return (
    <ServerSettingsPage
      server={server}
      serverSlug={serverSlug}
      canDeleteServer={Boolean(
        sessionUser && (sessionUser.isSystemAdmin || sessionUser.id === server.ownerId),
      )}
      permissionMatrix={permissionMatrix}
    />
  );
}
