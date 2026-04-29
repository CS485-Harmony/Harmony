import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/trpc-client';
import { getServerAuthenticated, getServerMembersWithRole } from '@/services/serverService';

type UnauthorizedMode = 'redirect' | 'throw';

function isSettingsAdmin(
  user: Awaited<ReturnType<typeof getSessionUser>>,
  ownerId: string,
): boolean {
  return Boolean(user && (user.isSystemAdmin || user.id === ownerId));
}

async function hasServerAdminAccess(userId: string, serverId: string): Promise<boolean> {
  try {
    const members = await getServerMembersWithRole(serverId);
    const currentMembership = members.find(member => member.userId === userId);
    return currentMembership?.role === 'owner' || currentMembership?.role === 'admin';
  } catch {
    return false;
  }
}

export async function requireServerSettingsAccess(
  serverSlug: string,
  mode: UnauthorizedMode = 'redirect',
) {
  const server = await getServerAuthenticated(serverSlug);
  if (!server) {
    // In server-action mode, notFound() propagates as a page-level 404 that
    // bypasses the client try-catch. Throw a plain error instead so the
    // action's caller can surface it as an inline message.
    if (mode === 'throw') throw new Error('Server not found');
    notFound();
  }

  const user = await getSessionUser();
  if (isSettingsAdmin(user, server.ownerId)) {
    return server;
  }

  if (user && (await hasServerAdminAccess(user.id, server.id))) {
    return server;
  }

  if (mode === 'throw') {
    throw new Error('Forbidden');
  }

  redirect(`/channels/${serverSlug}`);
}
