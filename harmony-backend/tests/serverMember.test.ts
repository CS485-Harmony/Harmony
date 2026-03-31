import { RoleType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '../src/db/prisma';
import { eventBus, EventChannels } from '../src/events/eventBus';
import { serverMemberService } from '../src/services/serverMember.service';

describe('serverMemberService (spec integration)', () => {
  let createdUserIds: string[] = [];
  let createdServerIds: string[] = [];
  let publishSpy: jest.SpyInstance;
  let uniqueCounter = 0;

  function nextSuffix(): string {
    uniqueCounter += 1;
    return `${Date.now().toString(36)}${uniqueCounter.toString(36)}`;
  }

  async function createUser(label: string) {
    const suffix = nextSuffix();
    const user = await prisma.user.create({
      data: {
        email: `${label}-${suffix}@example.com`,
        username: `sm_${label}_${suffix}`.slice(0, 32),
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: `SM ${label} ${suffix}`,
      },
    });

    createdUserIds.push(user.id);
    return user;
  }

  async function createServer(ownerId: string, isPublic = true) {
    const suffix = nextSuffix();
    const server = await prisma.server.create({
      data: {
        name: `SM Server ${suffix}`,
        slug: `sm-server-${suffix}`,
        ownerId,
        isPublic,
      },
    });

    createdServerIds.push(server.id);
    return server;
  }

  async function createMembership(
    userId: string,
    serverId: string,
    role: RoleType,
    joinedAt?: Date,
  ) {
    return prisma.$transaction(async (tx) => {
      const member = await tx.serverMember.create({
        data: { userId, serverId, role },
      });

      await tx.server.update({
        where: { id: serverId },
        data: { memberCount: { increment: 1 } },
      });

      if (!joinedAt) {
        return member;
      }

      return tx.serverMember.update({
        where: { userId_serverId: { userId, serverId } },
        data: { joinedAt },
      });
    });
  }

  async function expectTrpcError<T>(
    promise: Promise<T>,
    code: TRPCError['code'],
    message: string,
  ): Promise<void> {
    await expect(promise).rejects.toBeInstanceOf(TRPCError);
    await expect(promise).rejects.toMatchObject({ code, message });
  }

  function expectIsoTimestamp(value: unknown): void {
    expect(typeof value).toBe('string');
    expect(new Date(value as string).toISOString()).toBe(value);
  }

  // Each test owns its own fixture set so spec cases do not depend on prior mutations.
  beforeEach(() => {
    publishSpy = jest.spyOn(eventBus, 'publish').mockResolvedValue(undefined);
  });

  afterEach(async () => {
    jest.restoreAllMocks();

    if (createdServerIds.length > 0) {
      await prisma.server.deleteMany({ where: { id: { in: createdServerIds } } });
    }

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }

    createdServerIds = [];
    createdUserIds = [];
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('addOwner', () => {
    it('creates an OWNER membership and increments memberCount', async () => {
      const owner = await createUser('owner');
      const server = await createServer(owner.id);

      const membership = await serverMemberService.addOwner(owner.id, server.id);

      expect(membership.userId).toBe(owner.id);
      expect(membership.serverId).toBe(server.id);
      expect(membership.role).toBe('OWNER');

      const persistedMembership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: owner.id, serverId: server.id } },
      });
      const updatedServer = await prisma.server.findUnique({ where: { id: server.id } });

      expect(persistedMembership?.role).toBe('OWNER');
      expect(updatedServer?.memberCount).toBe(1);
    });

    it('bubbles transaction failures during owner creation', async () => {
      const owner = await createUser('owner');
      const server = await createServer(owner.id);
      const txError = new Error('owner transaction failed');

      jest.spyOn(prisma, '$transaction').mockRejectedValueOnce(txError);

      await expect(serverMemberService.addOwner(owner.id, server.id)).rejects.toBe(txError);

      const membership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: owner.id, serverId: server.id } },
      });
      const unchangedServer = await prisma.server.findUnique({ where: { id: server.id } });

      expect(membership).toBeNull();
      expect(unchangedServer?.memberCount).toBe(0);
    });
  });

  describe('joinServer', () => {
    it('joins a public server, increments memberCount, and publishes MEMBER_JOINED', async () => {
      const owner = await createUser('owner');
      const joiner = await createUser('member');
      const server = await createServer(owner.id, true);
      await createMembership(owner.id, server.id, 'OWNER');

      const membership = await serverMemberService.joinServer(joiner.id, server.id);

      expect(membership.userId).toBe(joiner.id);
      expect(membership.serverId).toBe(server.id);
      expect(membership.role).toBe('MEMBER');

      const updatedServer = await prisma.server.findUnique({ where: { id: server.id } });
      expect(updatedServer?.memberCount).toBe(2);

      expect(publishSpy).toHaveBeenCalledTimes(1);
      expect(publishSpy).toHaveBeenCalledWith(
        EventChannels.MEMBER_JOINED,
        expect.objectContaining({
          userId: joiner.id,
          serverId: server.id,
          role: 'MEMBER',
          timestamp: expect.any(String),
        }),
      );
      expectIsoTimestamp(publishSpy.mock.calls[0]?.[1]?.timestamp);
    });

    it('rejects join when the server does not exist', async () => {
      const joiner = await createUser('member');

      await expectTrpcError(
        serverMemberService.joinServer(joiner.id, '00000000-0000-0000-0000-000000000000'),
        'NOT_FOUND',
        'Server not found',
      );
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('rejects join when the server is private', async () => {
      const owner = await createUser('owner');
      const joiner = await createUser('member');
      const server = await createServer(owner.id, false);

      await expectTrpcError(
        serverMemberService.joinServer(joiner.id, server.id),
        'FORBIDDEN',
        'This server is private',
      );
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('maps duplicate membership attempts to CONFLICT without double incrementing', async () => {
      const owner = await createUser('owner');
      const joiner = await createUser('member');
      const server = await createServer(owner.id, true);
      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(joiner.id, server.id, 'MEMBER');

      await expectTrpcError(
        serverMemberService.joinServer(joiner.id, server.id),
        'CONFLICT',
        'Already a member of this server',
      );

      const updatedServer = await prisma.server.findUnique({ where: { id: server.id } });
      expect(updatedServer?.memberCount).toBe(2);
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('bubbles unexpected transaction failures during join', async () => {
      const owner = await createUser('owner');
      const joiner = await createUser('member');
      const server = await createServer(owner.id, true);
      const txError = new Error('join transaction failed');

      jest.spyOn(prisma, '$transaction').mockRejectedValueOnce(txError);

      await expect(serverMemberService.joinServer(joiner.id, server.id)).rejects.toBe(txError);
      expect(publishSpy).not.toHaveBeenCalled();
    });
  });

  describe('leaveServer', () => {
    it('deletes a non-owner membership, decrements memberCount, and publishes MEMBER_LEFT', async () => {
      const owner = await createUser('owner');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);
      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(member.id, server.id, 'MEMBER');

      await expect(serverMemberService.leaveServer(member.id, server.id)).resolves.toBeUndefined();

      const deletedMembership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: member.id, serverId: server.id } },
      });
      const updatedServer = await prisma.server.findUnique({ where: { id: server.id } });

      expect(deletedMembership).toBeNull();
      expect(updatedServer?.memberCount).toBe(1);
      expect(publishSpy).toHaveBeenCalledTimes(1);
      expect(publishSpy).toHaveBeenCalledWith(
        EventChannels.MEMBER_LEFT,
        expect.objectContaining({
          userId: member.id,
          serverId: server.id,
          reason: 'LEFT',
          timestamp: expect.any(String),
        }),
      );
      expectIsoTimestamp(publishSpy.mock.calls[0]?.[1]?.timestamp);
    });

    it('rejects leave when the membership does not exist', async () => {
      const owner = await createUser('owner');
      const outsider = await createUser('outsider');
      const server = await createServer(owner.id, true);

      await expectTrpcError(
        serverMemberService.leaveServer(outsider.id, server.id),
        'NOT_FOUND',
        'Not a member of this server',
      );
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('rejects leave when the caller is the owner', async () => {
      const owner = await createUser('owner');
      const server = await createServer(owner.id, true);
      await createMembership(owner.id, server.id, 'OWNER');

      await expectTrpcError(
        serverMemberService.leaveServer(owner.id, server.id),
        'BAD_REQUEST',
        'Server owner cannot leave. Transfer ownership or delete the server.',
      );
      expect(publishSpy).not.toHaveBeenCalled();
    });

    it('bubbles transaction failures during leave', async () => {
      const owner = await createUser('owner');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);
      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(member.id, server.id, 'MEMBER');
      const txError = new Error('leave transaction failed');

      jest.spyOn(prisma, '$transaction').mockRejectedValueOnce(txError);

      await expect(serverMemberService.leaveServer(member.id, server.id)).rejects.toBe(txError);

      const membership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: member.id, serverId: server.id } },
      });
      const unchangedServer = await prisma.server.findUnique({ where: { id: server.id } });

      expect(membership).not.toBeNull();
      expect(unchangedServer?.memberCount).toBe(2);
      expect(publishSpy).not.toHaveBeenCalled();
    });
  });

  describe('getServerMembers', () => {
    it('returns members ordered by role hierarchy with user profile data', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const moderator = await createUser('moderator');
      const member = await createUser('member');
      const guest = await createUser('guest');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER', new Date('2026-01-01T10:00:00.000Z'));
      await createMembership(admin.id, server.id, 'ADMIN', new Date('2026-01-01T11:00:00.000Z'));
      await createMembership(
        moderator.id,
        server.id,
        'MODERATOR',
        new Date('2026-01-01T12:00:00.000Z'),
      );
      await createMembership(member.id, server.id, 'MEMBER', new Date('2026-01-01T13:00:00.000Z'));
      await createMembership(guest.id, server.id, 'GUEST', new Date('2026-01-01T14:00:00.000Z'));

      const members = await serverMemberService.getServerMembers(server.id);

      expect(members.map((entry) => entry.role)).toEqual([
        'OWNER',
        'ADMIN',
        'MODERATOR',
        'MEMBER',
        'GUEST',
      ]);
      expect(members).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: owner.id,
            user: expect.objectContaining({
              id: owner.id,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
          expect.objectContaining({
            userId: admin.id,
            user: expect.objectContaining({
              id: admin.id,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
          expect.objectContaining({
            userId: moderator.id,
            user: expect.objectContaining({
              id: moderator.id,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
          expect.objectContaining({
            userId: member.id,
            user: expect.objectContaining({
              id: member.id,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
          expect.objectContaining({
            userId: guest.id,
            user: expect.objectContaining({
              id: guest.id,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
        ]),
      );
    });

    it('preserves ascending joinedAt order within the same role', async () => {
      const owner = await createUser('owner');
      const firstMember = await createUser('membera');
      const secondMember = await createUser('memberb');
      const thirdMember = await createUser('memberc');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER', new Date('2026-01-01T09:00:00.000Z'));
      await createMembership(
        firstMember.id,
        server.id,
        'MEMBER',
        new Date('2026-01-01T10:00:00.000Z'),
      );
      await createMembership(
        secondMember.id,
        server.id,
        'MEMBER',
        new Date('2026-01-01T11:00:00.000Z'),
      );
      await createMembership(
        thirdMember.id,
        server.id,
        'MEMBER',
        new Date('2026-01-01T12:00:00.000Z'),
      );

      const members = await serverMemberService.getServerMembers(server.id);
      const memberIds = members
        .filter((entry) => entry.role === 'MEMBER')
        .map((entry) => entry.userId);

      expect(memberIds).toEqual([firstMember.id, secondMember.id, thirdMember.id]);
    });

    it('returns an empty list when the server has no memberships', async () => {
      const owner = await createUser('owner');
      const server = await createServer(owner.id, true);

      await expect(serverMemberService.getServerMembers(server.id)).resolves.toEqual([]);
    });

    it('rejects lookup when the server does not exist', async () => {
      await expectTrpcError(
        serverMemberService.getServerMembers('00000000-0000-0000-0000-000000000000'),
        'NOT_FOUND',
        'Server not found',
      );
    });
  });

  describe('changeRole', () => {
    it('changes a lower-privileged member role successfully', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(admin.id, server.id, 'ADMIN');
      await createMembership(member.id, server.id, 'MEMBER');

      const updated = await serverMemberService.changeRole(
        member.id,
        server.id,
        'MODERATOR',
        admin.id,
      );

      expect(updated.role).toBe('MODERATOR');

      const persistedMembership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: member.id, serverId: server.id } },
      });
      expect(persistedMembership?.role).toBe('MODERATOR');
    });

    it('rejects assigning OWNER directly', async () => {
      const owner = await createUser('owner');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(member.id, server.id, 'MEMBER');

      await expectTrpcError(
        serverMemberService.changeRole(member.id, server.id, 'OWNER', owner.id),
        'BAD_REQUEST',
        'Cannot assign OWNER role. Use ownership transfer.',
      );
    });

    it('rejects role changes when the actor is not a server member', async () => {
      const owner = await createUser('owner');
      const outsider = await createUser('outsider');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(member.id, server.id, 'MEMBER');

      await expectTrpcError(
        serverMemberService.changeRole(member.id, server.id, 'GUEST', outsider.id),
        'FORBIDDEN',
        'You are not a member of this server',
      );
    });

    it('rejects role changes when the target is not a server member', async () => {
      const owner = await createUser('owner');
      const missing = await createUser('missing');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');

      await expectTrpcError(
        serverMemberService.changeRole(missing.id, server.id, 'MEMBER', owner.id),
        'NOT_FOUND',
        'Target user is not a member of this server',
      );
    });

    it('rejects role changes on the server owner', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(admin.id, server.id, 'ADMIN');

      await expectTrpcError(
        serverMemberService.changeRole(owner.id, server.id, 'MEMBER', admin.id),
        'FORBIDDEN',
        'Cannot change the role of the server owner',
      );
    });

    it('rejects changes when the actor does not outrank the target', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const otherAdmin = await createUser('otheradmin');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(admin.id, server.id, 'ADMIN');
      await createMembership(otherAdmin.id, server.id, 'ADMIN');

      await expectTrpcError(
        serverMemberService.changeRole(otherAdmin.id, server.id, 'MEMBER', admin.id),
        'FORBIDDEN',
        'Cannot change role of a member with equal or higher privilege',
      );
    });

    it('rejects assigning a role equal to or higher than the actor', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(admin.id, server.id, 'ADMIN');
      await createMembership(member.id, server.id, 'MEMBER');

      await expectTrpcError(
        serverMemberService.changeRole(member.id, server.id, 'ADMIN', admin.id),
        'FORBIDDEN',
        'Cannot assign a role equal to or higher than your own',
      );
    });

    it('rejects self-role changes through the hierarchy guard', async () => {
      const owner = await createUser('owner');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(member.id, server.id, 'MEMBER');

      await expectTrpcError(
        serverMemberService.changeRole(member.id, server.id, 'GUEST', member.id),
        'FORBIDDEN',
        'Cannot change role of a member with equal or higher privilege',
      );
    });
  });

  describe('removeMember', () => {
    it('removes a lower-privileged member, decrements memberCount, and publishes MEMBER_LEFT', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(admin.id, server.id, 'ADMIN');
      await createMembership(member.id, server.id, 'MEMBER');

      await expect(
        serverMemberService.removeMember(member.id, server.id, admin.id),
      ).resolves.toBeUndefined();

      const deletedMembership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: member.id, serverId: server.id } },
      });
      const updatedServer = await prisma.server.findUnique({ where: { id: server.id } });

      expect(deletedMembership).toBeNull();
      expect(updatedServer?.memberCount).toBe(2);
      expect(publishSpy).toHaveBeenCalledTimes(1);
      expect(publishSpy).toHaveBeenCalledWith(
        EventChannels.MEMBER_LEFT,
        expect.objectContaining({
          userId: member.id,
          serverId: server.id,
          reason: 'KICKED',
          timestamp: expect.any(String),
        }),
      );
      expectIsoTimestamp(publishSpy.mock.calls[0]?.[1]?.timestamp);
    });

    it('rejects removal when the actor is not a server member', async () => {
      const owner = await createUser('owner');
      const outsider = await createUser('outsider');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(member.id, server.id, 'MEMBER');

      await expectTrpcError(
        serverMemberService.removeMember(member.id, server.id, outsider.id),
        'FORBIDDEN',
        'You are not a member of this server',
      );
    });

    it('rejects removal when the target is not a server member', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const missing = await createUser('missing');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(admin.id, server.id, 'ADMIN');

      await expectTrpcError(
        serverMemberService.removeMember(missing.id, server.id, admin.id),
        'NOT_FOUND',
        'Target user is not a member of this server',
      );
    });

    it('rejects removal of the owner', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(admin.id, server.id, 'ADMIN');

      await expectTrpcError(
        serverMemberService.removeMember(owner.id, server.id, admin.id),
        'FORBIDDEN',
        'Cannot remove the server owner',
      );
    });

    it('rejects removal when the actor does not outrank the target', async () => {
      const owner = await createUser('owner');
      const moderator = await createUser('moderator');
      const otherModerator = await createUser('othermoderator');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(moderator.id, server.id, 'MODERATOR');
      await createMembership(otherModerator.id, server.id, 'MODERATOR');

      await expectTrpcError(
        serverMemberService.removeMember(otherModerator.id, server.id, moderator.id),
        'FORBIDDEN',
        'Cannot remove a member with equal or higher privilege',
      );
    });

    it('rejects self-removal through the moderation path', async () => {
      const owner = await createUser('owner');
      const moderator = await createUser('moderator');
      const server = await createServer(owner.id, true);

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(moderator.id, server.id, 'MODERATOR');

      await expectTrpcError(
        serverMemberService.removeMember(moderator.id, server.id, moderator.id),
        'FORBIDDEN',
        'Cannot remove a member with equal or higher privilege',
      );
    });

    it('bubbles transaction failures during removal', async () => {
      const owner = await createUser('owner');
      const admin = await createUser('admin');
      const member = await createUser('member');
      const server = await createServer(owner.id, true);
      const txError = new Error('remove transaction failed');

      await createMembership(owner.id, server.id, 'OWNER');
      await createMembership(admin.id, server.id, 'ADMIN');
      await createMembership(member.id, server.id, 'MEMBER');

      jest.spyOn(prisma, '$transaction').mockRejectedValueOnce(txError);

      await expect(serverMemberService.removeMember(member.id, server.id, admin.id)).rejects.toBe(
        txError,
      );

      const membership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: member.id, serverId: server.id } },
      });
      const unchangedServer = await prisma.server.findUnique({ where: { id: server.id } });

      expect(membership).not.toBeNull();
      expect(unchangedServer?.memberCount).toBe(3);
      expect(publishSpy).not.toHaveBeenCalled();
    });
  });
});
