/**
 * Channel member service integration tests — Issue #567
 *
 * Verifies: add/remove member, access control for private channels,
 * permission enforcement (ADMIN+ only), and error conditions.
 */

import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { channelMemberService } from '../src/services/channelMember.service';

const prisma = new PrismaClient();

let serverId: string;
let privateChannelId: string;
let publicChannelId: string;
let adminUserId: string;
let memberUserId: string;
let nonMemberUserId: string;

beforeAll(async () => {
  const ts = Date.now();

  const admin = await prisma.user.create({
    data: {
      email: `cm-admin-${ts}@example.com`,
      username: `cm_admin_${ts}`,
      passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
      displayName: 'CM Admin',
    },
  });
  adminUserId = admin.id;

  const member = await prisma.user.create({
    data: {
      email: `cm-member-${ts}@example.com`,
      username: `cm_member_${ts}`,
      passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
      displayName: 'CM Member',
    },
  });
  memberUserId = member.id;

  const nonMember = await prisma.user.create({
    data: {
      email: `cm-nonmember-${ts}@example.com`,
      username: `cm_nonmember_${ts}`,
      passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
      displayName: 'CM Non-Member',
    },
  });
  nonMemberUserId = nonMember.id;

  const server = await prisma.server.create({
    data: {
      name: `CM Test Server ${ts}`,
      slug: `cm-test-server-${ts}`,
      ownerId: adminUserId,
      isPublic: false,
    },
  });
  serverId = server.id;

  await prisma.serverMember.createMany({
    data: [
      { userId: adminUserId, serverId, role: 'ADMIN' },
      { userId: memberUserId, serverId, role: 'MEMBER' },
    ],
  });

  const privateChannel = await prisma.channel.create({
    data: { serverId, name: 'private', slug: `private-${ts}`, type: 'TEXT', visibility: 'PRIVATE' },
  });
  privateChannelId = privateChannel.id;

  const publicChannel = await prisma.channel.create({
    data: { serverId, name: 'public', slug: `public-${ts}`, type: 'TEXT', visibility: 'PUBLIC_NO_INDEX' },
  });
  publicChannelId = publicChannel.id;
});

afterAll(async () => {
  if (serverId) await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
  await Promise.all([adminUserId, memberUserId, nonMemberUserId].map(id =>
    prisma.user.delete({ where: { id } }).catch(() => {}),
  ));
  await prisma.$disconnect();
});

describe('channelMemberService.addMember', () => {
  it('adds a server member to a private channel', async () => {
    const result = await channelMemberService.addMember(privateChannelId, serverId, memberUserId);
    expect(result.userId).toBe(memberUserId);
    expect(result.channelId).toBe(privateChannelId);
  });

  it('throws CONFLICT when member is already added', async () => {
    await expect(
      channelMemberService.addMember(privateChannelId, serverId, memberUserId),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('throws BAD_REQUEST when target user is not a server member', async () => {
    await expect(
      channelMemberService.addMember(privateChannelId, serverId, nonMemberUserId),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });

  it('throws NOT_FOUND when channel does not belong to server', async () => {
    await expect(
      channelMemberService.addMember('00000000-0000-0000-0000-000000000001', serverId, memberUserId),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('throws BAD_REQUEST when channel is not PRIVATE', async () => {
    await expect(
      channelMemberService.addMember(publicChannelId, serverId, memberUserId),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});

describe('channelMemberService.getChannelMembers', () => {
  it('returns the channel member list with user profile', async () => {
    const members = await channelMemberService.getChannelMembers(privateChannelId, serverId);
    expect(Array.isArray(members)).toBe(true);
    const entry = members.find(m => m.userId === memberUserId);
    expect(entry).toBeDefined();
    expect(entry!.user).toHaveProperty('username');
    expect(entry!.user).toHaveProperty('displayName');
  });
});

describe('channelMemberService.removeMember', () => {
  it('removes a member from the channel', async () => {
    await channelMemberService.removeMember(privateChannelId, serverId, memberUserId);
    const members = await channelMemberService.getChannelMembers(privateChannelId, serverId);
    expect(members.find(m => m.userId === memberUserId)).toBeUndefined();
  });

  it('throws NOT_FOUND when user is not a channel member', async () => {
    await expect(
      channelMemberService.removeMember(privateChannelId, serverId, memberUserId),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('channelMemberService.canAccessPrivateChannel', () => {
  it('returns true for ADMIN regardless of channel membership', async () => {
    const result = await channelMemberService.canAccessPrivateChannel(
      adminUserId,
      privateChannelId,
      serverId,
    );
    expect(result).toBe(true);
  });

  it('returns false for MEMBER with no channel membership', async () => {
    const result = await channelMemberService.canAccessPrivateChannel(
      memberUserId,
      privateChannelId,
      serverId,
    );
    expect(result).toBe(false);
  });

  it('returns true for MEMBER after being added to channel', async () => {
    await channelMemberService.addMember(privateChannelId, serverId, memberUserId);
    const result = await channelMemberService.canAccessPrivateChannel(
      memberUserId,
      privateChannelId,
      serverId,
    );
    expect(result).toBe(true);
    // cleanup
    await channelMemberService.removeMember(privateChannelId, serverId, memberUserId);
  });

  it('returns false for a non-member of the server', async () => {
    const result = await channelMemberService.canAccessPrivateChannel(
      nonMemberUserId,
      privateChannelId,
      serverId,
    );
    expect(result).toBe(false);
  });
});
