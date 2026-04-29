/**
 * Regression tests for admin.utils — Issue #466
 *
 * Verifies that isSystemAdmin is gated by NODE_ENV so a user whose email
 * matches ADMIN_EMAIL cannot escalate privileges in production.
 */

import { isSystemAdmin, ADMIN_EMAIL, RESERVED_EMAILS, RESERVED_USERNAMES } from '../src/lib/admin.utils';

const ADMIN_USER_ID = '00000000-0000-0000-0000-000000000099';

jest.mock('../src/db/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

import { prisma } from '../src/db/prisma';
const mockPrisma = prisma as unknown as { user: { findUnique: jest.Mock } };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('isSystemAdmin — production env guard (issue #466)', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: originalEnv, writable: true });
  });

  it('returns false in production even when the user email matches ADMIN_EMAIL', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true });
    mockPrisma.user.findUnique.mockResolvedValue({ email: ADMIN_EMAIL });

    const result = await isSystemAdmin(ADMIN_USER_ID);

    expect(result).toBe(false);
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('returns true in test env when the user email matches ADMIN_EMAIL', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ email: ADMIN_EMAIL });

    const result = await isSystemAdmin(ADMIN_USER_ID);

    expect(result).toBe(true);
  });

  it('returns false in test env when the user email does not match ADMIN_EMAIL', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ email: 'attacker@example.com' });

    const result = await isSystemAdmin('attacker-id');

    expect(result).toBe(false);
  });
});

describe('RESERVED_EMAILS and RESERVED_USERNAMES sets (issue #466)', () => {
  it('includes the admin email (lowercase)', () => {
    expect(RESERVED_EMAILS.has(ADMIN_EMAIL)).toBe(true);
  });

  it('includes the username "admin"', () => {
    expect(RESERVED_USERNAMES.has('admin')).toBe(true);
  });
});
