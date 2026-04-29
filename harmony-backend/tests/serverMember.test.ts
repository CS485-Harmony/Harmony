import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { redis } from '../src/db/redis';
import { serverMemberService, JOIN_RATE_MAX, JOIN_RATE_WINDOW_SECS } from '../src/services/serverMember.service';

describe('serverMemberService (integration)', () => {
  const prisma = new PrismaClient();

  let ownerUserId: string;
  let memberUserId: string;
  let otherUserId: string;
  let serverId: string;
  let privateServerId: string;

  beforeAll(async () => {
    const ts = Date.now();

    // Create test users
    const owner = await prisma.user.create({
      data: {
        email: `sm-owner-${ts}@example.com`,
        username: `sm_owner_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'SM Owner',
      },
    });
    ownerUserId = owner.id;

    const member = await prisma.user.create({
      data: {
        email: `sm-member-${ts}@example.com`,
        username: `sm_member_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'SM Member',
      },
    });
    memberUserId = member.id;

    const other = await prisma.user.create({
      data: {
        email: `sm-other-${ts}@example.com`,
        username: `sm_other_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'SM Other',
      },
    });
    otherUserId = other.id;

    // Create a public test server (raw, without the createServer flow to avoid auto-adding owner)
    const server = await prisma.server.create({
      data: {
        name: `SM Test Server ${ts}`,
        slug: `sm-test-server-${ts}`,
        ownerId: ownerUserId,
        isPublic: true,
      },
    });
    serverId = server.id;

    // Create a private test server
    const pvtServer = await prisma.server.create({
      data: {
        name: `SM Private Server ${ts}`,
        slug: `sm-private-server-${ts}`,
        ownerId: ownerUserId,
        isPublic: false,
      },
    });
    privateServerId = pvtServer.id;

    // Manually add owner as OWNER member
    await serverMemberService.addOwner(ownerUserId, serverId);
  });

  afterAll(async () => {
    // Clean up in reverse order of dependencies
    await prisma.serverMember.deleteMany({ where: { serverId: { in: [serverId, privateServerId] } } }).catch(() => {});
    await prisma.channel.deleteMany({ where: { serverId: { in: [serverId, privateServerId] } } }).catch(() => {});
    await prisma.server.deleteMany({ where: { id: { in: [serverId, privateServerId] } } }).catch(() => {});
    await prisma.user.deleteMany({
      where: { id: { in: [ownerUserId, memberUserId, otherUserId] } },
    }).catch(() => {});
    await prisma.$disconnect();
  });

  // ─── Join Server ────────────────────────────────────────────────────────────

  describe('joinServer', () => {
    it('allows a user to join a server as MEMBER', async () => {
      const membership = await serverMemberService.joinServer(memberUserId, serverId);
      expect(membership.userId).toBe(memberUserId);
      expect(membership.serverId).toBe(serverId);
      expect(membership.role).toBe('MEMBER');
    });

    it('increments the server member count', async () => {
      const server = await prisma.server.findUnique({ where: { id: serverId } });
      // Owner (1) + member (1) = 2
      expect(server!.memberCount).toBe(2);
    });

    it('throws CONFLICT if user is already a member', async () => {
      const err = await serverMemberService
        .joinServer(memberUserId, serverId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('CONFLICT');
    });

    it('throws NOT_FOUND for non-existent server', async () => {
      const err = await serverMemberService
        .joinServer(memberUserId, '00000000-0000-0000-0000-000000000000')
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('NOT_FOUND');
    });

    it('throws FORBIDDEN when joining a private server', async () => {
      const err = await serverMemberService
        .joinServer(memberUserId, privateServerId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('FORBIDDEN');
    });
  });

  // ─── Join Rate Limiting ─────────────────────────────────────────────────────

  describe('joinServer rate limiting', () => {
    let rateLimitUserId: string;
    const rateLimitKey = () => `rl:join:${rateLimitUserId}`;
    // Non-existent serverId so we can test rate limiting without DB side effects.
    // The rate limit check runs before the server lookup, so NOT_FOUND means the limit passed.
    const NON_EXISTENT_SERVER = '00000000-0000-0000-0000-000000000000';

    beforeAll(async () => {
      const ts = Date.now();
      const user = await prisma.user.create({
        data: {
          email: `sm-ratelimit-${ts}@example.com`,
          username: `sm_ratelimit_${ts}`,
          passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
          displayName: 'SM RateLimit',
        },
      });
      rateLimitUserId = user.id;
    });

    afterAll(async () => {
      await redis.del(rateLimitKey());
      await prisma.user.delete({ where: { id: rateLimitUserId } }).catch(() => {});
    });

    beforeEach(async () => {
      await redis.del(rateLimitKey());
    });

    it('allows joins up to the rate limit', async () => {
      // Set counter to one below the limit; next call increments to JOIN_RATE_MAX (still allowed)
      await redis.set(rateLimitKey(), JOIN_RATE_MAX - 1, 'EX', JOIN_RATE_WINDOW_SECS);

      const err = await serverMemberService
        .joinServer(rateLimitUserId, NON_EXISTENT_SERVER)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('NOT_FOUND'); // rate limit passed; server lookup failed
    });

    it('blocks the (JOIN_RATE_MAX + 1)th join with TOO_MANY_REQUESTS', async () => {
      // Pre-fill the counter at the limit; next INCR pushes it over
      await redis.set(rateLimitKey(), JOIN_RATE_MAX, 'EX', JOIN_RATE_WINDOW_SECS);

      const err = await serverMemberService
        .joinServer(rateLimitUserId, NON_EXISTENT_SERVER)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('TOO_MANY_REQUESTS');
    });

    it('rate limit resets after the window expires', async () => {
      // Simulate an expired key — no Redis key means counter starts fresh
      // (key was cleared in beforeEach)
      const err = await serverMemberService
        .joinServer(rateLimitUserId, NON_EXISTENT_SERVER)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('NOT_FOUND'); // rate limit passed; server lookup failed
    });
  });

  // ─── Get Server Members ─────────────────────────────────────────────────────

  describe('getServerMembers', () => {
    it('returns all members with user info and roles', async () => {
      const members = await serverMemberService.getServerMembers(serverId);
      expect(members.length).toBe(2);

      const ownerMember = members.find((m) => m.userId === ownerUserId);
      expect(ownerMember).toBeDefined();
      expect(ownerMember!.role).toBe('OWNER');
      expect(ownerMember!.user.username).toBeDefined();

      const regularMember = members.find((m) => m.userId === memberUserId);
      expect(regularMember).toBeDefined();
      expect(regularMember!.role).toBe('MEMBER');
    });

    it('orders by role hierarchy then join date', async () => {
      const members = await serverMemberService.getServerMembers(serverId);
      // OWNER should come before MEMBER in role ordering
      expect(members[0].role).toBe('OWNER');
      expect(members[1].role).toBe('MEMBER');
    });

    it('throws NOT_FOUND for non-existent server', async () => {
      const err = await serverMemberService
        .getServerMembers('00000000-0000-0000-0000-000000000000')
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('NOT_FOUND');
    });
  });

  // ─── Change Role ────────────────────────────────────────────────────────────

  describe('changeRole', () => {
    it('allows owner to promote a member to MODERATOR', async () => {
      const updated = await serverMemberService.changeRole(
        memberUserId,
        serverId,
        'MODERATOR',
        ownerUserId,
      );
      expect(updated.role).toBe('MODERATOR');
    });

    it('allows owner to demote back to MEMBER', async () => {
      const updated = await serverMemberService.changeRole(
        memberUserId,
        serverId,
        'MEMBER',
        ownerUserId,
      );
      expect(updated.role).toBe('MEMBER');
    });

    it('throws BAD_REQUEST when assigning OWNER role', async () => {
      const err = await serverMemberService
        .changeRole(memberUserId, serverId, 'OWNER', ownerUserId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('BAD_REQUEST');
    });

    it('throws FORBIDDEN when changing the owner role', async () => {
      const err = await serverMemberService
        .changeRole(ownerUserId, serverId, 'ADMIN', ownerUserId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('FORBIDDEN');
    });

    it('throws FORBIDDEN when a MEMBER tries to change roles', async () => {
      // memberUserId is MEMBER, cannot change otherUserId's role
      // First add otherUser
      await serverMemberService.joinServer(otherUserId, serverId);

      const err = await serverMemberService
        .changeRole(otherUserId, serverId, 'GUEST', memberUserId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('FORBIDDEN');
    });

    it('throws NOT_FOUND for non-member target', async () => {
      // Remove otherUser first so it's not a member
      await prisma.serverMember.delete({
        where: { userId_serverId: { userId: otherUserId, serverId } },
      });
      await prisma.server.update({
        where: { id: serverId },
        data: { memberCount: { decrement: 1 } },
      });

      const err = await serverMemberService
        .changeRole(otherUserId, serverId, 'MEMBER', ownerUserId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('NOT_FOUND');
    });
  });

  // ─── Remove Member ──────────────────────────────────────────────────────────

  describe('removeMember', () => {
    let kickTargetId: string;

    beforeAll(async () => {
      // Re-add otherUser for kick tests
      await serverMemberService.joinServer(otherUserId, serverId);
      kickTargetId = otherUserId;
    });

    it('allows owner to kick a member', async () => {
      await serverMemberService.removeMember(kickTargetId, serverId, ownerUserId);

      const membership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: kickTargetId, serverId } },
      });
      expect(membership).toBeNull();
    });

    it('decrements member count after kick', async () => {
      const server = await prisma.server.findUnique({ where: { id: serverId } });
      // Owner (1) + member (1) = 2 (otherUser was kicked)
      expect(server!.memberCount).toBe(2);
    });

    it('throws FORBIDDEN when trying to kick the owner', async () => {
      const err = await serverMemberService
        .removeMember(ownerUserId, serverId, memberUserId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('FORBIDDEN');
    });

    it('throws NOT_FOUND for non-member target', async () => {
      const err = await serverMemberService
        .removeMember(kickTargetId, serverId, ownerUserId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('NOT_FOUND');
    });
  });

  // ─── Leave Server ───────────────────────────────────────────────────────────

  describe('leaveServer', () => {
    it('allows a member to leave the server', async () => {
      await serverMemberService.leaveServer(memberUserId, serverId);

      const membership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: memberUserId, serverId } },
      });
      expect(membership).toBeNull();
    });

    it('decrements member count on leave', async () => {
      const server = await prisma.server.findUnique({ where: { id: serverId } });
      expect(server!.memberCount).toBe(1); // Only owner remains
    });

    it('throws BAD_REQUEST when owner tries to leave', async () => {
      const err = await serverMemberService
        .leaveServer(ownerUserId, serverId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('BAD_REQUEST');
    });

    it('throws NOT_FOUND when non-member tries to leave', async () => {
      const err = await serverMemberService
        .leaveServer(memberUserId, serverId)
        .catch((e: TRPCError) => e);
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe('NOT_FOUND');
    });
  });
});
