/**
 * Dev-only system admin utilities.
 *
 * The admin override is only active when BOTH conditions hold:
 *   NODE_ENV === 'development'  AND  ENABLE_DEV_ADMIN === 'true'
 *
 * This ensures the backdoor is never reachable on staging, CI, e2e, or
 * production environments — only on an explicitly opted-in local machine.
 */

import { prisma } from '../db/prisma';

export const ADMIN_EMAIL = 'admin@harmony.dev';

/** Lowercase emails that must not be claimable via public registration. */
export const RESERVED_EMAILS = new Set<string>([ADMIN_EMAIL]);

/** Lowercase usernames that must not be claimable via public registration. */
export const RESERVED_USERNAMES = new Set<string>(['admin']);

/** Cached admin user ID to avoid repeated DB lookups. */
let _adminUserId: string | null = null;

function isDevAdminEnabled(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.ENABLE_DEV_ADMIN === 'true';
}

/**
 * Returns true if the given userId belongs to the system admin account.
 * Only active when NODE_ENV=development AND ENABLE_DEV_ADMIN=true.
 * Caches the result after the first positive lookup.
 */
export async function isSystemAdmin(userId: string): Promise<boolean> {
  if (!isDevAdminEnabled()) return false;
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
