import { PrismaClient } from '@prisma/client';
import { redis } from '../src/db/redis';
import { inviteService } from '../src/services/invite.service';

describe('inviteService (integration)', () => {
  const prisma = new PrismaClient();

  let ownerUserId: string;
  let memberUserId: string;
  let outsiderUserId: string;
  let publicServerId: string;
  let privateServerId: string;

  beforeAll(async () => {
    const ts = Date.now();

    const owner = await prisma.user.create({
      data: {
        email: `inv-owner-${ts}@example.com`,
        username: `inv_owner_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'Invite Owner',
      },
    });
    ownerUserId = owner.id;

    const member = await prisma.user.create({
      data: {
        email: `inv-member-${ts}@example.com`,
        username: `inv_member_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'Invite Member',
      },
    });
    memberUserId = member.id;

    const outsider = await prisma.user.create({
      data: {
        email: `inv-out-${ts}@example.com`,
        username: `inv_out_${ts}`,
        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
        displayName: 'Invite Outsider',
      },
    });
    outsiderUserId = outsider.id;

    const publicServer = await prisma.server.create({
      data: {
        name: `Invite Public ${ts}`,
        slug: `inv-pub-${ts}`,
        ownerId: ownerUserId,
        isPublic: true,
      },
    });
    publicServerId = publicServer.id;

    const privateServer = await prisma.server.create({
      data: {
        name: `Invite Private ${ts}`,
        slug: `inv-priv-${ts}`,
        ownerId: ownerUserId,
        isPublic: false,
      },
    });
    privateServerId = privateServer.id;

    // Add owner as member on both servers
    await prisma.serverMember.createMany({
      data: [
        { userId: ownerUserId, serverId: publicServerId, role: 'OWNER' },
        { userId: ownerUserId, serverId: privateServerId, role: 'OWNER' },
        { userId: memberUserId, serverId: publicServerId, role: 'MEMBER' },
      ],
    });
  });

  afterAll(async () => {
    await prisma.serverInvite.deleteMany({ where: { serverId: { in: [publicServerId, privateServerId] } } });
    await prisma.serverMember.deleteMany({ where: { serverId: { in: [publicServerId, privateServerId] } } });
    await prisma.server.deleteMany({ where: { id: { in: [publicServerId, privateServerId] } } });
    await prisma.user.deleteMany({ where: { id: { in: [ownerUserId, memberUserId, outsiderUserId] } } });
    await prisma.$disconnect();
    await redis.quit();
  });

  describe('generate', () => {
    it('creates an invite for a public server', async () => {
      const invite = await inviteService.generate(publicServerId, ownerUserId);
      expect(invite.code).toBeTruthy();
      expect(invite.serverId).toBe(publicServerId);
      expect(invite.creatorId).toBe(ownerUserId);
      expect(invite.uses).toBe(0);
      expect(invite.creator).toMatchObject({
        id: ownerUserId,
        displayName: 'Invite Owner',
      });
      expect(invite.creator.username).toContain('inv_owner_');
    });

    it('creates an invite for a private server', async () => {
      const invite = await inviteService.generate(privateServerId, ownerUserId, { maxUses: 5 });
      expect(invite.maxUses).toBe(5);
      expect(invite.serverId).toBe(privateServerId);
    });

    it('throws NOT_FOUND for unknown server', async () => {
      await expect(
        inviteService.generate('00000000-0000-0000-0000-000000000000', ownerUserId),
      ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    });
  });

  describe('list', () => {
    it('returns invites for a server including creator info', async () => {
      const invites = await inviteService.list(publicServerId);
      expect(Array.isArray(invites)).toBe(true);
      expect(invites.length).toBeGreaterThan(0);
      expect(invites[0]).toHaveProperty('creator');
    });
  });

  describe('preview', () => {
    it('returns server info for a valid invite code', async () => {
      const invite = await inviteService.generate(publicServerId, ownerUserId);
      const preview = await inviteService.preview(invite.code);
      expect(preview).not.toBeNull();
      expect(preview!.server.id).toBe(publicServerId);
      expect(preview!.code).toBe(invite.code);
    });

    it('returns null for expired invite', async () => {
      const past = new Date(Date.now() - 1000);
      const invite = await inviteService.generate(publicServerId, ownerUserId, { expiresAt: past });
      const preview = await inviteService.preview(invite.code);
      expect(preview).toBeNull();
    });

    it('returns null for exhausted invite', async () => {
      const invite = await inviteService.generate(publicServerId, ownerUserId, { maxUses: 1 });
      await prisma.serverInvite.update({ where: { id: invite.id }, data: { uses: 1 } });
      const preview = await inviteService.preview(invite.code);
      expect(preview).toBeNull();
    });

    it('returns null for unknown code', async () => {
      const preview = await inviteService.preview('nonexistent1');
      expect(preview).toBeNull();
    });
  });

  describe('redeem', () => {
    it('joins a private server via invite code', async () => {
      const invite = await inviteService.generate(privateServerId, ownerUserId);
      const result = await inviteService.redeem(invite.code, outsiderUserId);
      expect(result.alreadyMember).toBe(false);
      expect(result.serverId).toBe(privateServerId);

      const membership = await prisma.serverMember.findUnique({
        where: { userId_serverId: { userId: outsiderUserId, serverId: privateServerId } },
      });
      expect(membership).not.toBeNull();
      expect(membership!.role).toBe('MEMBER');

      const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
      expect(updated!.uses).toBe(1);
    });

    it('is idempotent for already-a-member (no double join)', async () => {
      const invite = await inviteService.generate(publicServerId, ownerUserId);
      const result = await inviteService.redeem(invite.code, memberUserId);
      expect(result.alreadyMember).toBe(true);

      const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
      expect(updated!.uses).toBe(0);
    });

    it('rejects expired invite', async () => {
      const past = new Date(Date.now() - 1000);
      const invite = await inviteService.generate(publicServerId, ownerUserId, { expiresAt: past });
      await expect(inviteService.redeem(invite.code, outsiderUserId)).rejects.toMatchObject({
        code: 'BAD_REQUEST',
        message: expect.stringContaining('expired'),
      });
    });

    it('rejects exhausted invite', async () => {
      const invite = await inviteService.generate(publicServerId, ownerUserId, { maxUses: 1 });
      await prisma.serverInvite.update({ where: { id: invite.id }, data: { uses: 1 } });
      await expect(inviteService.redeem(invite.code, outsiderUserId)).rejects.toMatchObject({
        code: 'BAD_REQUEST',
        message: expect.stringContaining('maximum uses'),
      });
    });

    it('throws NOT_FOUND for unknown code', async () => {
      await expect(inviteService.redeem('unknown_code', outsiderUserId)).rejects.toMatchObject({
        code: 'NOT_FOUND',
      });
    });

    it('enforces maxUses atomically under concurrent redemptions', async () => {
      const ts2 = Date.now();
      const concurrentUsers = await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          prisma.user.create({
            data: {
              email: `conc-${ts2}-${i}@example.com`,
              username: `conc_${ts2}_${i}`,
              passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
              displayName: `Concurrent ${i}`,
            },
          })
        )
      );

      try {
        const invite = await inviteService.generate(publicServerId, ownerUserId, { maxUses: 1 });
        const results = await Promise.allSettled(
          concurrentUsers.map((u) => inviteService.redeem(invite.code, u.id))
        );

        const succeeded = results.filter((r) => r.status === 'fulfilled');
        expect(succeeded).toHaveLength(1);

        const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
        expect(updated!.uses).toBe(1);
      } finally {
        await prisma.serverMember.deleteMany({
          where: { userId: { in: concurrentUsers.map((u) => u.id) } },
        });
        await prisma.user.deleteMany({ where: { id: { in: concurrentUsers.map((u) => u.id) } } });
      }
    });
  });

  describe('delete', () => {
    it('deletes an invite', async () => {
      const invite = await inviteService.generate(publicServerId, ownerUserId);
      await inviteService.delete(invite.id, publicServerId, ownerUserId);
      const found = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
      expect(found).toBeNull();
    });

    it('throws NOT_FOUND for wrong server', async () => {
      const invite = await inviteService.generate(publicServerId, ownerUserId);
      await expect(
        inviteService.delete(invite.id, privateServerId, ownerUserId),
      ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    });
  });
});
