/**
 * Temporary dev-only system admin utilities.
 *
 * The admin override lets a developer log in as admin@harmony.dev / admin
 * and bypass all permission and ownership checks. Remove this file before
 * deploying to production.
 */

import { prisma } from '../db/prisma';

export const ADMIN_EMAIL = 'admin@harmony.dev';

/** Cached admin user ID to avoid repeated DB lookups. */
let _adminUserId: string | null = null;

/**
 * Returns true if the given userId belongs to the system admin account.
 * Caches the result after the first positive lookup.
 */
export async function isSystemAdmin(userId: string): Promise<boolean> {
  if (_adminUserId === userId) return true;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (user?.email === ADMIN_EMAIL) {
    _adminUserId = userId;
    return true;
  }
  return false;
}
