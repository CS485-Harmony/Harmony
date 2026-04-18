import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/services/authService';
import { getServerAuthenticated } from '@/services/serverService';

type UnauthorizedMode = 'redirect' | 'throw';

function isSettingsAdmin(
  user: Awaited<ReturnType<typeof getCurrentUser>>,
  ownerId: string,
): boolean {
  return Boolean(user && (user.isSystemAdmin || user.id === ownerId));
}

export async function requireServerSettingsAccess(
  serverSlug: string,
  mode: UnauthorizedMode = 'redirect',
) {
  const server = await getServerAuthenticated(serverSlug);
  if (!server) notFound();

  const user = await getCurrentUser();
  if (isSettingsAdmin(user, server.ownerId)) {
    return server;
  }

  if (mode === 'throw') {
    throw new Error('Forbidden');
  }

  redirect(`/channels/${serverSlug}`);
}
