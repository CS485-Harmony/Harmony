import { Prisma, RoleType, ServerMember } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '../db/prisma';
import { eventBus, EventChannels } from '../events/eventBus';

export interface ServerMemberWithUser {
  userId: string;
  serverId: string;
  role: RoleType;
  joinedAt: Date;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

/** Role hierarchy — lower index = higher privilege. */
const ROLE_HIERARCHY: RoleType[] = ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST'];

function roleRank(role: RoleType): number {
  return ROLE_HIERARCHY.indexOf(role);
}

export const serverMemberService = {
  /**
   * Add the server owner as an OWNER member. Called when a server is created.
   */
  async addOwner(userId: string, serverId: string): Promise<ServerMember> {
    return prisma.$transaction(async (tx) => {
      const member = await tx.serverMember.create({
        data: { userId, serverId, role: 'OWNER' },
      });
      await tx.server.update({
        where: { id: serverId },
        data: { memberCount: { increment: 1 } },
      });
      return member;
    });
  },

  /**
   * Join a server as a MEMBER (default role).
   * Throws CONFLICT if already a member. Rejects private servers.
   */
  async joinServer(userId: string, serverId: string): Promise<ServerMember> {
    const server = await prisma.server.findUnique({ where: { id: serverId } });
    if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    if (!server.isPublic) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'This server is private' });
    }

    try {
      const member = await prisma.$transaction(async (tx) => {
        const created = await tx.serverMember.create({
          data: { userId, serverId, role: 'MEMBER' },
        });
        await tx.server.update({
          where: { id: serverId },
          data: { memberCount: { increment: 1 } },
        });
        return created;
      });

      void eventBus.publish(EventChannels.MEMBER_JOINED, {
        userId,
        serverId,
        role: 'MEMBER' as RoleType,
        timestamp: new Date().toISOString(),
      });

      return member;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new TRPCError({ code: 'CONFLICT', message: 'Already a member of this server' });
      }
      throw err;
    }
  },

  /**
   * Leave a server. Owners cannot leave — they must transfer ownership or delete.
   */
  async leaveServer(userId: string, serverId: string): Promise<void> {
    const membership = await prisma.serverMember.findUnique({
      where: { userId_serverId: { userId, serverId } },
    });
    if (!membership) throw new TRPCError({ code: 'NOT_FOUND', message: 'Not a member of this server' });
    if (membership.role === 'OWNER') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Server owner cannot leave. Transfer ownership or delete the server.' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.serverMember.delete({
        where: { userId_serverId: { userId, serverId } },
      });
      await tx.server.update({
        where: { id: serverId },
        data: { memberCount: { decrement: 1 } },
      });
    });

    void eventBus.publish(EventChannels.MEMBER_LEFT, {
      userId,
      serverId,
      reason: 'LEFT',
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * List all members of a server with user profile info.
   * Sorted by role hierarchy (OWNER first) then join date.
   */
  async getServerMembers(serverId: string): Promise<ServerMemberWithUser[]> {
    const server = await prisma.server.findUnique({ where: { id: serverId }, select: { id: true } });
    if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });

    const members = await prisma.serverMember.findMany({
      where: { serverId },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    // Sort by role hierarchy (Prisma enum ordering is alphabetical, not semantic)
    return members.sort((a, b) => roleRank(a.role) - roleRank(b.role));
  },

  /**
   * Change a member's role. Only ADMIN+ can change roles, and only for members
   * with lower privilege than the actor. Cannot change OWNER role.
   */
  async changeRole(
    targetUserId: string,
    serverId: string,
    newRole: RoleType,
    actorId: string,
  ): Promise<ServerMember> {
    if (newRole === 'OWNER') {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot assign OWNER role. Use ownership transfer.' });
    }

    const [actorMembership, targetMembership] = await Promise.all([
      prisma.serverMember.findUnique({ where: { userId_serverId: { userId: actorId, serverId } } }),
      prisma.serverMember.findUnique({ where: { userId_serverId: { userId: targetUserId, serverId } } }),
    ]);

    if (!actorMembership) throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not a member of this server' });
    if (!targetMembership) throw new TRPCError({ code: 'NOT_FOUND', message: 'Target user is not a member of this server' });
    if (targetMembership.role === 'OWNER') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot change the role of the server owner' });
    }

    // Actor must outrank the target's current role and the new role
    if (roleRank(actorMembership.role) >= roleRank(targetMembership.role)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot change role of a member with equal or higher privilege' });
    }
    if (roleRank(actorMembership.role) >= roleRank(newRole)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot assign a role equal to or higher than your own' });
    }

    return prisma.serverMember.update({
      where: { userId_serverId: { userId: targetUserId, serverId } },
      data: { role: newRole },
    });
  },

  /**
   * Remove a member from the server. Actor must outrank the target.
   * Cannot kick the owner.
   */
  async removeMember(targetUserId: string, serverId: string, actorId: string): Promise<void> {
    const [actorMembership, targetMembership] = await Promise.all([
      prisma.serverMember.findUnique({ where: { userId_serverId: { userId: actorId, serverId } } }),
      prisma.serverMember.findUnique({ where: { userId_serverId: { userId: targetUserId, serverId } } }),
    ]);

    if (!actorMembership) throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not a member of this server' });
    if (!targetMembership) throw new TRPCError({ code: 'NOT_FOUND', message: 'Target user is not a member of this server' });
    if (targetMembership.role === 'OWNER') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot remove the server owner' });
    }
    if (roleRank(actorMembership.role) >= roleRank(targetMembership.role)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot remove a member with equal or higher privilege' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.serverMember.delete({
        where: { userId_serverId: { userId: targetUserId, serverId } },
      });
      await tx.server.update({
        where: { id: serverId },
        data: { memberCount: { decrement: 1 } },
      });
    });

    void eventBus.publish(EventChannels.MEMBER_LEFT, {
      userId: targetUserId,
      serverId,
      reason: 'KICKED',
      timestamp: new Date().toISOString(),
    });
  },
};
