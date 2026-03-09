/**
 * Permission service tests — Issue #102
 *
 * Covers the permission matrix for all five roles (OWNER, ADMIN, MODERATOR,
 * MEMBER, GUEST) as well as non-member and unknown-server edge cases.
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { PrismaClient, RoleType } from '@prisma/client';
import { permissionService, type Action } from '../src/services/permission.service';

const prisma = new PrismaClient();

// ─── Test fixtures ────────────────────────────────────────────────────────────

let serverId: string;
const userIds: Record<RoleType | 'nonMember', string> = {
  OWNER: '',
  ADMIN: '',
  MODERATOR: '',
  MEMBER: '',
  GUEST: '',
  nonMember: '',
};

beforeAll(async () => {
  const ts = Date.now();

  // Create users for each role + one non-member
  const roles = ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST', 'nonMember'] as const;
  for (const role of roles) {
    const user = await prisma.user.create({
      data: {
        email: `perm-${role.toLowerCase()}-${ts}@test.com`,
        username: `perm-${role.toLowerCase()}-${ts}`,
        passwordHash: 'testhash',
        displayName: `Perm ${role}`,
      },
    });
    userIds[role] = user.id;
  }

  // Create a server
  const server = await prisma.server.create({
    data: {
      name: `Test Server ${ts}`,
      slug: `test-server-${ts}`,
      ownerId: userIds['OWNER'],
    },
  });
  serverId = server.id;

  // Add members with their respective roles (skip nonMember)
  const memberRoles: RoleType[] = ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST'];
  for (const role of memberRoles) {
    await prisma.serverMember.create({
      data: { userId: userIds[role], serverId, role },
    });
  }
});

afterAll(async () => {
  await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
  const ids = Object.values(userIds).filter(Boolean);
  await prisma.user.deleteMany({ where: { id: { in: ids } } }).catch(() => {});
  await prisma.$disconnect();
});

// ─── Helper ───────────────────────────────────────────────────────────────────

async function can(role: RoleType | 'nonMember', action: Action) {
  return permissionService.checkPermission(userIds[role], serverId, action);
}

// ─── getMemberRole ────────────────────────────────────────────────────────────

describe('permissionService.getMemberRole', () => {
  it('returns the correct role for each member', async () => {
    for (const role of ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST'] as RoleType[]) {
      await expect(permissionService.getMemberRole(userIds[role], serverId)).resolves.toBe(role);
    }
  });

  it('returns null for a non-member', async () => {
    await expect(permissionService.getMemberRole(userIds.nonMember, serverId)).resolves.toBeNull();
  });
});

// ─── checkPermission — unknown server ─────────────────────────────────────────

describe('permissionService.checkPermission — unknown server', () => {
  it('throws NOT_FOUND for an unknown serverId', async () => {
    await expect(
      permissionService.checkPermission(userIds.OWNER, '00000000-0000-0000-0000-000000000000', 'server:read'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});

// ─── OWNER — all permissions ──────────────────────────────────────────────────

describe('OWNER permissions', () => {
  const ownerActions: Action[] = [
    'server:read', 'server:update', 'server:delete', 'server:manage_members',
    'channel:read', 'channel:create', 'channel:update', 'channel:delete', 'channel:manage_visibility',
    'message:read', 'message:create', 'message:update_own', 'message:delete_own', 'message:delete_any',
    'settings:read', 'settings:update',
  ];

  for (const action of ownerActions) {
    it(`owner can: ${action}`, async () => {
      await expect(can('OWNER', action)).resolves.toBe(true);
    });
  }
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

describe('ADMIN permissions', () => {
  it('admin cannot delete the server', async () => {
    await expect(can('ADMIN', 'server:delete')).resolves.toBe(false);
  });

  it('admin can manage channels', async () => {
    for (const action of ['channel:create', 'channel:update', 'channel:delete', 'channel:manage_visibility'] as Action[]) {
      await expect(can('ADMIN', action)).resolves.toBe(true);
    }
  });

  it('admin can manage settings', async () => {
    await expect(can('ADMIN', 'settings:update')).resolves.toBe(true);
  });

  it('admin can delete any message', async () => {
    await expect(can('ADMIN', 'message:delete_any')).resolves.toBe(true);
  });

  it('admin can manage members', async () => {
    await expect(can('ADMIN', 'server:manage_members')).resolves.toBe(true);
  });
});

// ─── MODERATOR ────────────────────────────────────────────────────────────────

describe('MODERATOR permissions', () => {
  it('moderator can delete any message', async () => {
    await expect(can('MODERATOR', 'message:delete_any')).resolves.toBe(true);
  });

  it('moderator cannot create channels', async () => {
    await expect(can('MODERATOR', 'channel:create')).resolves.toBe(false);
  });

  it('moderator cannot change channel visibility', async () => {
    await expect(can('MODERATOR', 'channel:manage_visibility')).resolves.toBe(false);
  });

  it('moderator cannot update settings', async () => {
    await expect(can('MODERATOR', 'settings:update')).resolves.toBe(false);
  });

  it('moderator cannot delete the server', async () => {
    await expect(can('MODERATOR', 'server:delete')).resolves.toBe(false);
  });

  it('moderator can read and create messages', async () => {
    await expect(can('MODERATOR', 'message:read')).resolves.toBe(true);
    await expect(can('MODERATOR', 'message:create')).resolves.toBe(true);
  });
});

// ─── MEMBER ───────────────────────────────────────────────────────────────────

describe('MEMBER permissions', () => {
  it('member can read and create messages', async () => {
    await expect(can('MEMBER', 'message:read')).resolves.toBe(true);
    await expect(can('MEMBER', 'message:create')).resolves.toBe(true);
  });

  it('member can update and delete own messages', async () => {
    await expect(can('MEMBER', 'message:update_own')).resolves.toBe(true);
    await expect(can('MEMBER', 'message:delete_own')).resolves.toBe(true);
  });

  it('member cannot delete other users messages', async () => {
    await expect(can('MEMBER', 'message:delete_any')).resolves.toBe(false);
  });

  it('member cannot create channels', async () => {
    await expect(can('MEMBER', 'channel:create')).resolves.toBe(false);
  });

  it('member cannot change settings', async () => {
    await expect(can('MEMBER', 'settings:update')).resolves.toBe(false);
  });
});

// ─── GUEST ────────────────────────────────────────────────────────────────────

describe('GUEST permissions', () => {
  it('guest can read server, channels, and messages', async () => {
    await expect(can('GUEST', 'server:read')).resolves.toBe(true);
    await expect(can('GUEST', 'channel:read')).resolves.toBe(true);
    await expect(can('GUEST', 'message:read')).resolves.toBe(true);
  });

  it('guest cannot create messages', async () => {
    await expect(can('GUEST', 'message:create')).resolves.toBe(false);
  });

  it('guest cannot create channels', async () => {
    await expect(can('GUEST', 'channel:create')).resolves.toBe(false);
  });

  it('guest cannot update settings', async () => {
    await expect(can('GUEST', 'settings:update')).resolves.toBe(false);
  });
});

// ─── Non-member ───────────────────────────────────────────────────────────────

describe('non-member permissions', () => {
  it('non-member is denied common actions (spot-check)', async () => {
    const actions: Action[] = [
      'server:read',
      'channel:read',
      'message:read',
      'message:create',
      'settings:update',
    ];
    for (const action of actions) {
      await expect(can('nonMember', action)).resolves.toBe(false);
    }
  });
});

// ─── requirePermission ────────────────────────────────────────────────────────

describe('permissionService.requirePermission', () => {
  it('resolves (no throw) when permission is granted', async () => {
    await expect(
      permissionService.requirePermission(userIds.OWNER, serverId, 'server:delete'),
    ).resolves.toBeUndefined();
  });

  it('throws FORBIDDEN when permission is denied', async () => {
    await expect(
      permissionService.requirePermission(userIds.MEMBER, serverId, 'server:delete'),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('throws FORBIDDEN for a non-member', async () => {
    await expect(
      permissionService.requirePermission(userIds.nonMember, serverId, 'server:read'),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });
});
