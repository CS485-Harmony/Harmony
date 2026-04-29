/**
 * Temporary dev-only system admin utilities.
 *
 * The admin override lets a developer log in as admin@harmony.dev / admin
 * and bypass all permission and ownership checks. Remove this file before
 * deploying to production.
 */

import { prisma } from '../db/prisma';

export const ADMIN_EMAIL = 'admin@harmony.dev';

/** Lowercase emails that must not be claimable via public registration. */
export const RESERVED_EMAILS = new Set<string>([ADMIN_EMAIL]);

/** Lowercase usernames that must not be claimable via public registration. */
export const RESERVED_USERNAMES = new Set<string>(['admin']);

/** Cached admin user ID to avoid repeated DB lookups. */
let _adminUserId: string | null = null;

/**
 * Returns true if the given userId belongs to the system admin account.
 * Never returns true in production — this utility is dev/test only.
 * Caches the result after the first positive lookup.
 */
export async function isSystemAdmin(userId: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'production') return false;
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
