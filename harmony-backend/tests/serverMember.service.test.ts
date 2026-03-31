import { Prisma, RoleType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

const mockTx = {
  serverMember: {
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
  server: {
    update: jest.fn(),
  },
};

const mockPrisma = {
  $transaction: jest.fn(),
  server: {
    findUnique: jest.fn(),
  },
  serverMember: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};

const mockEventChannels = {
  MEMBER_JOINED: 'member.joined',
  MEMBER_LEFT: 'member.left',
};

const mockEventBus = {
  publish: jest.fn(),
};

jest.mock('../src/db/prisma', () => ({
  prisma: mockPrisma,
}));

jest.mock('../src/events/eventBus', () => ({
  eventBus: mockEventBus,
  EventChannels: mockEventChannels,
}));

import { serverMemberService } from '../src/services/serverMember.service';

describe('serverMemberService', () => {
  function makeKnownRequestError(code: string): Prisma.PrismaClientKnownRequestError {
    return new Prisma.PrismaClientKnownRequestError('Known request error', {
      code,
      clientVersion: 'test',
    });
  }

  function makeServer(
    overrides: Partial<{ id: string; isPublic: boolean; memberCount: number }> = {},
  ) {
    return {
      id: 'server-1',
      isPublic: true,
      memberCount: 0,
      ...overrides,
    };
  }

  function makeMembership(
    overrides: Partial<{
      userId: string;
      serverId: string;
      role: RoleType;
      joinedAt: Date;
    }> = {},
  ) {
    return {
      userId: 'user-1',
      serverId: 'server-1',
      role: 'MEMBER' as RoleType,
      joinedAt: new Date('2026-01-01T00:00:00.000Z'),
      ...overrides,
    };
  }

  function makeMemberWithUser(
    overrides: Partial<{
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
    }> = {},
  ) {
    const base = makeMembership(overrides);
    return {
      ...base,
      user: {
        id: base.userId,
        username: `${base.userId}_name`,
        displayName: `${base.userId} display`,
        avatarUrl: null,
      },
      ...overrides,
    };
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

  beforeEach(() => {
    jest.resetAllMocks();
    mockPrisma.$transaction.mockImplementation(async (callback: (tx: typeof mockTx) => unknown) =>
      callback(mockTx),
    );
    mockEventBus.publish.mockResolvedValue(undefined);
  });

  describe('addOwner', () => {
    it('creates the owner membership and increments memberCount', async () => {
      const membership = makeMembership({ userId: 'owner-1', serverId: 'server-1', role: 'OWNER' });
      mockTx.serverMember.create.mockResolvedValue(membership);
      mockTx.server.update.mockResolvedValue(makeServer({ id: 'server-1', memberCount: 1 }));

      const result = await serverMemberService.addOwner('owner-1', 'server-1');

      expect(result).toEqual(membership);
      expect(mockTx.serverMember.create).toHaveBeenCalledWith({
        data: { userId: 'owner-1', serverId: 'server-1', role: 'OWNER' },
      });
      expect(mockTx.server.update).toHaveBeenCalledWith({
        where: { id: 'server-1' },
        data: { memberCount: { increment: 1 } },
      });
    });

    it('bubbles transaction failures during owner creation', async () => {
      const txError = new Error('owner transaction failed');
      mockPrisma.$transaction.mockRejectedValueOnce(txError);

      await expect(serverMemberService.addOwner('owner-1', 'server-1')).rejects.toBe(txError);
      expect(mockTx.serverMember.create).not.toHaveBeenCalled();
      expect(mockTx.server.update).not.toHaveBeenCalled();
    });
  });

  describe('joinServer', () => {
    it('joins a public server, increments memberCount, and publishes MEMBER_JOINED', async () => {
      const server = makeServer({ id: 'server-1', isPublic: true });
      const membership = makeMembership({
        userId: 'member-1',
        serverId: 'server-1',
        role: 'MEMBER',
      });
      mockPrisma.server.findUnique.mockResolvedValue(server);
      mockTx.serverMember.create.mockResolvedValue(membership);
      mockTx.server.update.mockResolvedValue(makeServer({ id: 'server-1', memberCount: 2 }));

      const result = await serverMemberService.joinServer('member-1', 'server-1');

      expect(result).toEqual(membership);
      expect(mockPrisma.server.findUnique).toHaveBeenCalledWith({
        where: { id: 'server-1' },
      });
      expect(mockTx.serverMember.create).toHaveBeenCalledWith({
        data: { userId: 'member-1', serverId: 'server-1', role: 'MEMBER' },
      });
      expect(mockTx.server.update).toHaveBeenCalledWith({
        where: { id: 'server-1' },
        data: { memberCount: { increment: 1 } },
      });
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        mockEventChannels.MEMBER_JOINED,
        expect.objectContaining({
          userId: 'member-1',
          serverId: 'server-1',
          role: 'MEMBER',
          timestamp: expect.any(String),
        }),
      );
      expectIsoTimestamp(mockEventBus.publish.mock.calls[0]?.[1]?.timestamp);
    });

    it('rejects join when the server does not exist', async () => {
      mockPrisma.server.findUnique.mockResolvedValue(null);

      await expectTrpcError(
        serverMemberService.joinServer('member-1', 'missing-server'),
        'NOT_FOUND',
        'Server not found',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('rejects join when the server is private', async () => {
      mockPrisma.server.findUnique.mockResolvedValue(
        makeServer({ id: 'server-1', isPublic: false }),
      );

      await expectTrpcError(
        serverMemberService.joinServer('member-1', 'server-1'),
        'FORBIDDEN',
        'This server is private',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('maps duplicate join attempts to CONFLICT and does not publish an event', async () => {
      mockPrisma.server.findUnique.mockResolvedValue(
        makeServer({ id: 'server-1', isPublic: true }),
      );
      mockPrisma.$transaction.mockRejectedValueOnce(makeKnownRequestError('P2002'));

      await expectTrpcError(
        serverMemberService.joinServer('member-1', 'server-1'),
        'CONFLICT',
        'Already a member of this server',
      );
      expect(mockTx.server.update).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('bubbles unexpected transaction failures during join', async () => {
      const txError = new Error('join transaction failed');
      mockPrisma.server.findUnique.mockResolvedValue(
        makeServer({ id: 'server-1', isPublic: true }),
      );
      mockPrisma.$transaction.mockRejectedValueOnce(txError);

      await expect(serverMemberService.joinServer('member-1', 'server-1')).rejects.toBe(txError);
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });

  describe('leaveServer', () => {
    it('removes a non-owner membership, decrements memberCount, and publishes MEMBER_LEFT', async () => {
      mockPrisma.serverMember.findUnique.mockResolvedValue(
        makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MEMBER' }),
      );
      mockTx.serverMember.delete.mockResolvedValue(undefined);
      mockTx.server.update.mockResolvedValue(makeServer({ id: 'server-1', memberCount: 1 }));

      await expect(
        serverMemberService.leaveServer('member-1', 'server-1'),
      ).resolves.toBeUndefined();

      expect(mockPrisma.serverMember.findUnique).toHaveBeenCalledWith({
        where: { userId_serverId: { userId: 'member-1', serverId: 'server-1' } },
      });
      expect(mockTx.serverMember.delete).toHaveBeenCalledWith({
        where: { userId_serverId: { userId: 'member-1', serverId: 'server-1' } },
      });
      expect(mockTx.server.update).toHaveBeenCalledWith({
        where: { id: 'server-1' },
        data: { memberCount: { decrement: 1 } },
      });
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        mockEventChannels.MEMBER_LEFT,
        expect.objectContaining({
          userId: 'member-1',
          serverId: 'server-1',
          reason: 'LEFT',
          timestamp: expect.any(String),
        }),
      );
      expectIsoTimestamp(mockEventBus.publish.mock.calls[0]?.[1]?.timestamp);
    });

    it('rejects leave when the membership does not exist', async () => {
      mockPrisma.serverMember.findUnique.mockResolvedValue(null);

      await expectTrpcError(
        serverMemberService.leaveServer('member-1', 'server-1'),
        'NOT_FOUND',
        'Not a member of this server',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('rejects leave when the caller is the owner', async () => {
      mockPrisma.serverMember.findUnique.mockResolvedValue(
        makeMembership({ userId: 'owner-1', serverId: 'server-1', role: 'OWNER' }),
      );

      await expectTrpcError(
        serverMemberService.leaveServer('owner-1', 'server-1'),
        'BAD_REQUEST',
        'Server owner cannot leave. Transfer ownership or delete the server.',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('bubbles transaction failures during leave', async () => {
      const txError = new Error('leave transaction failed');
      mockPrisma.serverMember.findUnique.mockResolvedValue(
        makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MEMBER' }),
      );
      mockPrisma.$transaction.mockRejectedValueOnce(txError);

      await expect(serverMemberService.leaveServer('member-1', 'server-1')).rejects.toBe(txError);
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });

  describe('getServerMembers', () => {
    it('returns members in role-priority order with user data', async () => {
      const ownerId = 'owner-1';
      const adminId = 'admin-1';
      const moderatorId = 'moderator-1';
      const memberId = 'member-1';
      const guestId = 'guest-1';

      mockPrisma.server.findUnique.mockResolvedValue({ id: 'server-1' });
      mockPrisma.serverMember.findMany.mockResolvedValue([
        makeMemberWithUser({ userId: memberId, role: 'MEMBER' }),
        makeMemberWithUser({ userId: guestId, role: 'GUEST' }),
        makeMemberWithUser({ userId: ownerId, role: 'OWNER' }),
        makeMemberWithUser({ userId: moderatorId, role: 'MODERATOR' }),
        makeMemberWithUser({ userId: adminId, role: 'ADMIN' }),
      ]);

      const members = await serverMemberService.getServerMembers('server-1');

      expect(mockPrisma.serverMember.findMany).toHaveBeenCalledWith({
        where: { serverId: 'server-1' },
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
        orderBy: { joinedAt: 'asc' },
      });
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
            userId: ownerId,
            user: expect.objectContaining({
              id: ownerId,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
          expect.objectContaining({
            userId: adminId,
            user: expect.objectContaining({
              id: adminId,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
          expect.objectContaining({
            userId: moderatorId,
            user: expect.objectContaining({
              id: moderatorId,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
          expect.objectContaining({
            userId: memberId,
            user: expect.objectContaining({
              id: memberId,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
          expect.objectContaining({
            userId: guestId,
            user: expect.objectContaining({
              id: guestId,
              username: expect.any(String),
              displayName: expect.any(String),
              avatarUrl: null,
            }),
          }),
        ]),
      );
    });

    it('preserves ascending joinedAt order within the same role', async () => {
      mockPrisma.server.findUnique.mockResolvedValue({ id: 'server-1' });
      mockPrisma.serverMember.findMany.mockResolvedValue([
        makeMemberWithUser({
          userId: 'member-older',
          role: 'MEMBER',
          joinedAt: new Date('2026-01-01T10:00:00.000Z'),
        }),
        makeMemberWithUser({
          userId: 'member-middle',
          role: 'MEMBER',
          joinedAt: new Date('2026-01-01T11:00:00.000Z'),
        }),
        makeMemberWithUser({
          userId: 'member-newer',
          role: 'MEMBER',
          joinedAt: new Date('2026-01-01T12:00:00.000Z'),
        }),
      ]);

      const members = await serverMemberService.getServerMembers('server-1');

      expect(members.map((entry) => entry.userId)).toEqual([
        'member-older',
        'member-middle',
        'member-newer',
      ]);
    });

    it('returns an empty list when the server has no members', async () => {
      mockPrisma.server.findUnique.mockResolvedValue({ id: 'server-1' });
      mockPrisma.serverMember.findMany.mockResolvedValue([]);

      await expect(serverMemberService.getServerMembers('server-1')).resolves.toEqual([]);
    });

    it('rejects lookup when the server does not exist', async () => {
      mockPrisma.server.findUnique.mockResolvedValue(null);

      await expectTrpcError(
        serverMemberService.getServerMembers('missing-server'),
        'NOT_FOUND',
        'Server not found',
      );
      expect(mockPrisma.serverMember.findMany).not.toHaveBeenCalled();
    });
  });

  describe('changeRole', () => {
    it('changes a lower-privileged member role successfully', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(
          makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MEMBER' }),
        );
      mockPrisma.serverMember.update.mockResolvedValue(
        makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MODERATOR' }),
      );

      const result = await serverMemberService.changeRole(
        'member-1',
        'server-1',
        'MODERATOR',
        'admin-1',
      );

      expect(result.role).toBe('MODERATOR');
      expect(mockPrisma.serverMember.update).toHaveBeenCalledWith({
        where: { userId_serverId: { userId: 'member-1', serverId: 'server-1' } },
        data: { role: 'MODERATOR' },
      });
    });

    it('rejects assigning OWNER directly', async () => {
      await expectTrpcError(
        serverMemberService.changeRole('member-1', 'server-1', 'OWNER', 'admin-1'),
        'BAD_REQUEST',
        'Cannot assign OWNER role. Use ownership transfer.',
      );
      expect(mockPrisma.serverMember.findUnique).not.toHaveBeenCalled();
    });

    it('rejects role changes when the actor is not a server member', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(
          makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MEMBER' }),
        );

      await expectTrpcError(
        serverMemberService.changeRole('member-1', 'server-1', 'GUEST', 'outsider-1'),
        'FORBIDDEN',
        'You are not a member of this server',
      );
      expect(mockPrisma.serverMember.update).not.toHaveBeenCalled();
    });

    it('rejects role changes when the target is not a server member', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(null);

      await expectTrpcError(
        serverMemberService.changeRole('member-1', 'server-1', 'GUEST', 'admin-1'),
        'NOT_FOUND',
        'Target user is not a member of this server',
      );
      expect(mockPrisma.serverMember.update).not.toHaveBeenCalled();
    });

    it('rejects role changes on the server owner', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(
          makeMembership({ userId: 'owner-1', serverId: 'server-1', role: 'OWNER' }),
        );

      await expectTrpcError(
        serverMemberService.changeRole('owner-1', 'server-1', 'MEMBER', 'admin-1'),
        'FORBIDDEN',
        'Cannot change the role of the server owner',
      );
      expect(mockPrisma.serverMember.update).not.toHaveBeenCalled();
    });

    it('rejects changes when the actor does not outrank the target', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(
          makeMembership({ userId: 'other-admin-1', serverId: 'server-1', role: 'ADMIN' }),
        );

      await expectTrpcError(
        serverMemberService.changeRole('other-admin-1', 'server-1', 'MEMBER', 'admin-1'),
        'FORBIDDEN',
        'Cannot change role of a member with equal or higher privilege',
      );
      expect(mockPrisma.serverMember.update).not.toHaveBeenCalled();
    });

    it('rejects assigning a role equal to or higher than the actor', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(
          makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MEMBER' }),
        );

      await expectTrpcError(
        serverMemberService.changeRole('member-1', 'server-1', 'ADMIN', 'admin-1'),
        'FORBIDDEN',
        'Cannot assign a role equal to or higher than your own',
      );
      expect(mockPrisma.serverMember.update).not.toHaveBeenCalled();
    });

    it('rejects self-role changes through the hierarchy guard', async () => {
      const selfMembership = makeMembership({
        userId: 'member-1',
        serverId: 'server-1',
        role: 'MEMBER',
      });
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(selfMembership)
        .mockResolvedValueOnce(selfMembership);

      await expectTrpcError(
        serverMemberService.changeRole('member-1', 'server-1', 'GUEST', 'member-1'),
        'FORBIDDEN',
        'Cannot change role of a member with equal or higher privilege',
      );
      expect(mockPrisma.serverMember.update).not.toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('removes a lower-privileged member, decrements memberCount, and publishes MEMBER_LEFT', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(
          makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MEMBER' }),
        );
      mockTx.serverMember.delete.mockResolvedValue(undefined);
      mockTx.server.update.mockResolvedValue(makeServer({ id: 'server-1', memberCount: 2 }));

      await expect(
        serverMemberService.removeMember('member-1', 'server-1', 'admin-1'),
      ).resolves.toBeUndefined();

      expect(mockTx.serverMember.delete).toHaveBeenCalledWith({
        where: { userId_serverId: { userId: 'member-1', serverId: 'server-1' } },
      });
      expect(mockTx.server.update).toHaveBeenCalledWith({
        where: { id: 'server-1' },
        data: { memberCount: { decrement: 1 } },
      });
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        mockEventChannels.MEMBER_LEFT,
        expect.objectContaining({
          userId: 'member-1',
          serverId: 'server-1',
          reason: 'KICKED',
          timestamp: expect.any(String),
        }),
      );
      expectIsoTimestamp(mockEventBus.publish.mock.calls[0]?.[1]?.timestamp);
    });

    it('rejects removal when the actor is not a server member', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(
          makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MEMBER' }),
        );

      await expectTrpcError(
        serverMemberService.removeMember('member-1', 'server-1', 'outsider-1'),
        'FORBIDDEN',
        'You are not a member of this server',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects removal when the target is not a server member', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(null);

      await expectTrpcError(
        serverMemberService.removeMember('member-1', 'server-1', 'admin-1'),
        'NOT_FOUND',
        'Target user is not a member of this server',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects removal of the owner', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(
          makeMembership({ userId: 'owner-1', serverId: 'server-1', role: 'OWNER' }),
        );

      await expectTrpcError(
        serverMemberService.removeMember('owner-1', 'server-1', 'admin-1'),
        'FORBIDDEN',
        'Cannot remove the server owner',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects removal when the actor does not outrank the target', async () => {
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'moderator-1', serverId: 'server-1', role: 'MODERATOR' }),
        )
        .mockResolvedValueOnce(
          makeMembership({ userId: 'other-moderator-1', serverId: 'server-1', role: 'MODERATOR' }),
        );

      await expectTrpcError(
        serverMemberService.removeMember('other-moderator-1', 'server-1', 'moderator-1'),
        'FORBIDDEN',
        'Cannot remove a member with equal or higher privilege',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects self-removal through the moderation path', async () => {
      const selfMembership = makeMembership({
        userId: 'moderator-1',
        serverId: 'server-1',
        role: 'MODERATOR',
      });
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(selfMembership)
        .mockResolvedValueOnce(selfMembership);

      await expectTrpcError(
        serverMemberService.removeMember('moderator-1', 'server-1', 'moderator-1'),
        'FORBIDDEN',
        'Cannot remove a member with equal or higher privilege',
      );
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('bubbles transaction failures during removal', async () => {
      const txError = new Error('remove transaction failed');
      mockPrisma.serverMember.findUnique
        .mockResolvedValueOnce(
          makeMembership({ userId: 'admin-1', serverId: 'server-1', role: 'ADMIN' }),
        )
        .mockResolvedValueOnce(
          makeMembership({ userId: 'member-1', serverId: 'server-1', role: 'MEMBER' }),
        );
      mockPrisma.$transaction.mockRejectedValueOnce(txError);

      await expect(
        serverMemberService.removeMember('member-1', 'server-1', 'admin-1'),
      ).rejects.toBe(txError);
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });
});
