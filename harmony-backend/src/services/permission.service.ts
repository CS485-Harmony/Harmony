import { RoleType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '../db/prisma';
import { isSystemAdmin } from '../lib/admin.utils';

// ─── Action types ─────────────────────────────────────────────────────────────

export type ServerAction =
  | 'server:read'
  | 'server:update'
  | 'server:delete'
  | 'server:manage_members';

export type ChannelAction =
  | 'channel:read'
  | 'channel:create'
  | 'channel:update'
  | 'channel:delete'
  | 'channel:manage_visibility';

export type MessageAction =
  | 'message:read'
  | 'message:create'
  | 'message:update_own'
  | 'message:delete_own'
  | 'message:delete_any'
  | 'message:pin';

export type SettingsAction = 'settings:read' | 'settings:update';

export type Action = ServerAction | ChannelAction | MessageAction | SettingsAction;

// ─── Permission matrix ────────────────────────────────────────────────────────
// Maps each role to the set of actions it may perform.
// Higher-privilege roles include all permissions of lower-privilege roles plus
// their own additions (accumulated below).

const GUEST_PERMISSIONS = new Set<Action>(['server:read', 'channel:read', 'message:read']);

const MEMBER_PERMISSIONS = new Set<Action>([
  ...GUEST_PERMISSIONS,
  'message:create',
  'message:update_own',
  'message:delete_own',
]);

const MODERATOR_PERMISSIONS = new Set<Action>([
  ...MEMBER_PERMISSIONS,
  'message:delete_any',
  'message:pin',
]);

const ADMIN_PERMISSIONS = new Set<Action>([
  ...MODERATOR_PERMISSIONS,
  'channel:create',
  'channel:update',
  'channel:delete',
  'channel:manage_visibility',
  'settings:read',
  'settings:update',
  'server:update',
  'server:manage_members',
]);

const OWNER_PERMISSIONS = new Set<Action>([...ADMIN_PERMISSIONS, 'server:delete']);

const ROLE_PERMISSIONS: Record<RoleType, Set<Action>> = {
  OWNER: OWNER_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  MODERATOR: MODERATOR_PERMISSIONS,
  MEMBER: MEMBER_PERMISSIONS,
  GUEST: GUEST_PERMISSIONS,
};

// ─── Permission service ───────────────────────────────────────────────────────

export const permissionService = {
  /**
   * Returns the RoleType for the given user in the given server, or null if
   * the user is not a member.
   */
  async getMemberRole(userId: string, serverId: string): Promise<RoleType | null> {
    const membership = await prisma.serverMember.findUnique({
      where: { userId_serverId: { userId, serverId } },
      select: { role: true },
    });
    return membership?.role ?? null;
  },

  /**
   * Checks whether `userId` is permitted to perform `action` in `serverId`.
   *
   * Throws `NOT_FOUND` when the server does not exist.
   * Returns `false` (does not throw) when the user is not a member at all.
   */
  async checkPermission(userId: string, serverId: string, action: Action): Promise<boolean> {
    // Dev admin bypass — remove before production
    if (await isSystemAdmin(userId)) return true;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      select: { id: true },
    });
    if (!server) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    }

    const role = await permissionService.getMemberRole(userId, serverId);
    if (role === null) return false;

    return ROLE_PERMISSIONS[role].has(action);
  },

  /**
   * Like `checkPermission` but throws `FORBIDDEN` instead of returning false.
   * Use this inside tRPC procedures that should reject unauthorized callers.
   */
  async requirePermission(userId: string, serverId: string, action: Action): Promise<void> {
    const allowed = await permissionService.checkPermission(userId, serverId, action);
    if (!allowed) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You do not have permission to perform '${action}' in this server`,
      });
    }
  },
};
