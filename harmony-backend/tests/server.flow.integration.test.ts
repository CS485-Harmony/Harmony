/**
 * True server lifecycle integration tests
 *
 * These tests exercise authenticated server tRPC routes together with
 * auth, permission checks, service side effects, and Prisma persistence.
 */

import crypto from 'crypto';
import request from 'supertest';
import type { Express } from 'express';
import { ChannelVisibility, ChannelType, RoleType } from '@prisma/client';
import { createApp } from '../src/app';
import { prisma } from '../src/db/prisma';
import { generateSlug } from '../src/services/server.service';

interface RegisteredUser {
  accessToken: string;
  email: string;
  response: request.Response;
  userId: string;
  username: string;
}

interface CreatedServer {
  id: string;
  response: request.Response;
  slug: string;
}

function createCredentials(label: string) {
  const suffix = `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    email: `server-flow-${suffix}@example.com`,
    username: `server_flow_${suffix}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32),
  };
}

function createServerName(base: string) {
  return `${base} ${Date.now()} ${Math.random().toString(36).slice(2, 8)}`;
}

async function deriveRegistrationPayload(app: Express, email: string, password: string) {
  const challengeRes = await request(app).post('/api/auth/register/challenge').send({});
  const passwordSalt = challengeRes.body.passwordSalt as string;

  return {
    passwordSalt,
    passwordVerifier: crypto
      .pbkdf2Sync(password, Buffer.from(passwordSalt, 'hex'), 310000, 32, 'sha256')
      .toString('base64'),
  };
}

describe('server flow integration', () => {
  let app: Express;
  const createdUserIds = new Set<string>();
  const createdServerIds = new Set<string>();

  beforeAll(() => {
    app = createApp();
  });

  afterAll(async () => {
    const serverIds = Array.from(createdServerIds);
    if (serverIds.length > 0) {
      await prisma.server.deleteMany({ where: { id: { in: serverIds } } }).catch(() => {});
    }

    const userIds = Array.from(createdUserIds);
    if (userIds.length > 0) {
      await prisma.refreshToken.deleteMany({ where: { userId: { in: userIds } } }).catch(() => {});
      await prisma.user.deleteMany({ where: { id: { in: userIds } } }).catch(() => {});
    }

    await prisma.$disconnect();
  });

  async function registerUser(label: string): Promise<RegisteredUser> {
    const { email, username } = createCredentials(label);
    const verifierPayload = await deriveRegistrationPayload(app, email, 'password123');

    const response = await request(app)
      .post('/api/auth/register')
      .send({ email, username, ...verifierPayload });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new Error(
        `registerUser(${label}) did not persist a user for ${email}. HTTP status: ${response.status}`,
      );
    }

    createdUserIds.add(user!.id);

    return {
      accessToken: response.body.accessToken,
      email,
      response,
      userId: user!.id,
      username,
    };
  }

  async function createServer(
    accessToken: string,
    input: { name: string; description?: string; isPublic?: boolean },
  ): Promise<CreatedServer> {
    const response = await request(app)
      .post('/trpc/server.createServer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(input);

    const server = response.body?.result?.data as { id?: string; slug?: string } | undefined;
    if (!server?.id || !server.slug) {
      throw new Error(
        `createServer(${input.name}) did not return server data. HTTP status: ${response.status}`,
      );
    }

    createdServerIds.add(server.id);
    return { id: server.id, response, slug: server.slug };
  }

  it('rejects unauthenticated access to protected server routes', async () => {
    const getServersRes = await request(app).get('/trpc/server.getServers');
    expect(getServersRes.status).toBe(401);

    const createServerRes = await request(app).post('/trpc/server.createServer').send({
      name: 'Unauthed Server',
    });
    expect(createServerRes.status).toBe(401);

    const joinServerRes = await request(app)
      .post('/trpc/serverMember.joinServer')
      .send({ serverId: '00000000-0000-0000-0000-000000000000' });
    expect(joinServerRes.status).toBe(401);
  });

  it('creates a server via tRPC and wires owner membership, default channel, and member queries', async () => {
    const owner = await registerUser('create-owner');
    const serverName = createServerName('Integration Hub');
    const created = await createServer(owner.accessToken, {
      name: serverName,
      description: 'Primary integration test server',
      isPublic: true,
    });

    expect(owner.response.status).toBe(201);
    expect(created.response.status).toBe(200);
    expect(created.response.body.result.data).toMatchObject({
      id: created.id,
      name: serverName,
      slug: created.slug,
    });

    const persistedServer = await prisma.server.findUnique({
      where: { id: created.id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isPublic: true,
        ownerId: true,
        memberCount: true,
      },
    });

    expect(persistedServer).toMatchObject({
      id: created.id,
      name: serverName,
      slug: created.slug,
      description: 'Primary integration test server',
      isPublic: true,
      ownerId: owner.userId,
      memberCount: 1,
    });

    const defaultChannel = await prisma.channel.findFirst({
      where: { serverId: created.id, slug: 'general' },
      select: {
        name: true,
        slug: true,
        type: true,
        visibility: true,
        position: true,
      },
    });

    expect(defaultChannel).toMatchObject({
      name: 'general',
      slug: 'general',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
      position: 0,
    });

    const ownerMembership = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: owner.userId,
          serverId: created.id,
        },
      },
      select: { role: true },
    });

    expect(ownerMembership?.role).toBe(RoleType.OWNER);

    const getServerInput = encodeURIComponent(JSON.stringify({ slug: created.slug }));
    const getServerRes = await request(app)
      .get(`/trpc/server.getServer?input=${getServerInput}`)
      .set('Authorization', `Bearer ${owner.accessToken}`);

    expect(getServerRes.status).toBe(200);
    expect(getServerRes.body.result.data).toMatchObject({
      id: created.id,
      slug: created.slug,
      ownerId: owner.userId,
    });

    const getServersRes = await request(app)
      .get('/trpc/server.getServers')
      .set('Authorization', `Bearer ${owner.accessToken}`);

    expect(getServersRes.status).toBe(200);
    expect(getServersRes.body.result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: created.id,
          slug: created.slug,
        }),
      ]),
    );

    const getMembersInput = encodeURIComponent(JSON.stringify({ serverId: created.id }));
    const getMembersRes = await request(app)
      .get(`/trpc/server.getMembers?input=${getMembersInput}`)
      .set('Authorization', `Bearer ${owner.accessToken}`);

    expect(getMembersRes.status).toBe(200);
    expect(getMembersRes.body.result.data).toEqual([
      expect.objectContaining({
        userId: owner.userId,
        role: 'OWNER',
      }),
    ]);
  });

  it('keeps server listings scoped to memberships and forbids non-members from reading members', async () => {
    const owner = await registerUser('scope-owner');
    const outsider = await registerUser('scope-outsider');
    const created = await createServer(owner.accessToken, {
      name: 'Scoped Server',
      isPublic: true,
    });

    expect(owner.response.status).toBe(201);
    expect(outsider.response.status).toBe(201);
    expect(created.response.status).toBe(200);

    const ownerServersRes = await request(app)
      .get('/trpc/server.getServers')
      .set('Authorization', `Bearer ${owner.accessToken}`);

    expect(ownerServersRes.status).toBe(200);
    expect(ownerServersRes.body.result.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: created.id })]),
    );

    const outsiderServersRes = await request(app)
      .get('/trpc/server.getServers')
      .set('Authorization', `Bearer ${outsider.accessToken}`);

    expect(outsiderServersRes.status).toBe(200);
    expect(Array.isArray(outsiderServersRes.body.result.data)).toBe(true);
    expect(
      outsiderServersRes.body.result.data.every(
        (server: { id: string }) => server.id !== created.id,
      ),
    ).toBe(true);

    const getMembersInput = encodeURIComponent(JSON.stringify({ serverId: created.id }));
    const outsiderMembersRes = await request(app)
      .get(`/trpc/server.getMembers?input=${getMembersInput}`)
      .set('Authorization', `Bearer ${outsider.accessToken}`);

    expect(outsiderMembersRes.status).toBe(403);
  });

  it('forbids non-owners from updating or deleting a server', async () => {
    const owner = await registerUser('guard-owner');
    const outsider = await registerUser('guard-outsider');
    const created = await createServer(owner.accessToken, {
      name: 'Guarded Server',
      isPublic: true,
    });

    expect(owner.response.status).toBe(201);
    expect(outsider.response.status).toBe(201);
    expect(created.response.status).toBe(200);

    const updateRes = await request(app)
      .post('/trpc/server.updateServer')
      .set('Authorization', `Bearer ${outsider.accessToken}`)
      .send({ id: created.id, name: 'Hijacked Server' });

    expect(updateRes.status).toBe(403);

    const deleteRes = await request(app)
      .post('/trpc/server.deleteServer')
      .set('Authorization', `Bearer ${outsider.accessToken}`)
      .send({ id: created.id });

    expect(deleteRes.status).toBe(403);

    const persistedServer = await prisma.server.findUnique({
      where: { id: created.id },
      select: { name: true, slug: true },
    });

    expect(persistedServer).toMatchObject({
      name: 'Guarded Server',
      slug: 'guarded-server',
    });
  });

  it('allows a second user to join and leave a public server and reflects membership changes', async () => {
    const owner = await registerUser('join-owner');
    const member = await registerUser('join-member');
    const created = await createServer(owner.accessToken, {
      name: 'Joinable Server',
      isPublic: true,
    });

    expect(owner.response.status).toBe(201);
    expect(member.response.status).toBe(201);
    expect(created.response.status).toBe(200);

    const joinRes = await request(app)
      .post('/trpc/serverMember.joinServer')
      .set('Authorization', `Bearer ${member.accessToken}`)
      .send({ serverId: created.id });

    expect(joinRes.status).toBe(200);
    expect(joinRes.body.result.data).toMatchObject({
      userId: member.userId,
      serverId: created.id,
      role: 'MEMBER',
    });

    const joinedMembership = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: member.userId,
          serverId: created.id,
        },
      },
      select: { role: true },
    });
    expect(joinedMembership?.role).toBe(RoleType.MEMBER);

    const joinedServer = await prisma.server.findUnique({
      where: { id: created.id },
      select: { memberCount: true },
    });
    expect(joinedServer?.memberCount).toBe(2);

    const getMembersInput = encodeURIComponent(JSON.stringify({ serverId: created.id }));
    const getMembersRes = await request(app)
      .get(`/trpc/server.getMembers?input=${getMembersInput}`)
      .set('Authorization', `Bearer ${owner.accessToken}`);

    expect(getMembersRes.status).toBe(200);
    expect(getMembersRes.body.result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userId: owner.userId, role: 'OWNER' }),
        expect.objectContaining({ userId: member.userId, role: 'MEMBER' }),
      ]),
    );

    const leaveRes = await request(app)
      .post('/trpc/serverMember.leaveServer')
      .set('Authorization', `Bearer ${member.accessToken}`)
      .send({ serverId: created.id });

    expect(leaveRes.status).toBe(200);
    expect(leaveRes.body.result.data).toMatchObject({ success: true });

    const leftMembership = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: member.userId,
          serverId: created.id,
        },
      },
    });
    expect(leftMembership).toBeNull();

    const serverAfterLeave = await prisma.server.findUnique({
      where: { id: created.id },
      select: { memberCount: true },
    });
    expect(serverAfterLeave?.memberCount).toBe(1);
  });

  it('rejects joining a private server', async () => {
    const owner = await registerUser('private-owner');
    const outsider = await registerUser('private-outsider');
    const created = await createServer(owner.accessToken, {
      name: 'Private Server',
      isPublic: false,
    });

    expect(created.response.status).toBe(200);

    const joinRes = await request(app)
      .post('/trpc/serverMember.joinServer')
      .set('Authorization', `Bearer ${outsider.accessToken}`)
      .send({ serverId: created.id });

    expect(joinRes.status).toBe(403);
    expect(joinRes.body.error.message).toMatch(/private/i);

    const membership = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: outsider.userId,
          serverId: created.id,
        },
      },
    });
    expect(membership).toBeNull();
  });

  it('prevents the owner from leaving their own server', async () => {
    const owner = await registerUser('owner-leave');
    const created = await createServer(owner.accessToken, {
      name: 'Owner Locked Server',
      isPublic: true,
    });

    expect(created.response.status).toBe(200);

    const leaveRes = await request(app)
      .post('/trpc/serverMember.leaveServer')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({ serverId: created.id });

    expect(leaveRes.status).toBe(400);
    expect(leaveRes.body.error.message).toMatch(/owner cannot leave/i);

    const ownerMembership = await prisma.serverMember.findUnique({
      where: {
        userId_serverId: {
          userId: owner.userId,
          serverId: created.id,
        },
      },
      select: { role: true },
    });
    expect(ownerMembership?.role).toBe(RoleType.OWNER);

    const persistedServer = await prisma.server.findUnique({
      where: { id: created.id },
      select: { memberCount: true },
    });
    expect(persistedServer?.memberCount).toBe(1);
  });

  it('updates server metadata, resolves slug collisions, and deletes the server through tRPC', async () => {
    const owner = await registerUser('lifecycle-owner');
    const otherOwner = await registerUser('collision-owner');
    const originalName = createServerName('Project Space');
    const collidingName = createServerName('Renamed Project');
    const expectedBaseSlug = generateSlug(collidingName);

    const created = await createServer(owner.accessToken, {
      name: originalName,
      description: 'Original server',
      isPublic: true,
    });

    const colliding = await createServer(otherOwner.accessToken, {
      name: collidingName,
      isPublic: true,
    });

    expect(owner.response.status).toBe(201);
    expect(otherOwner.response.status).toBe(201);
    expect(created.response.status).toBe(200);
    expect(colliding.response.status).toBe(200);
    expect(colliding.slug).toBe(expectedBaseSlug);

    const updateRes = await request(app)
      .post('/trpc/server.updateServer')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({
        id: created.id,
        name: collidingName,
        description: 'Updated description',
        isPublic: false,
      });

    expect(updateRes.status).toBe(200);
    const updatedSlug = updateRes.body.result.data.slug as string;
    expect(updateRes.body.result.data).toMatchObject({
      id: created.id,
      name: collidingName,
      description: 'Updated description',
      isPublic: false,
    });
    expect(updatedSlug).toMatch(new RegExp(`^${expectedBaseSlug}-\\d+$`));
    expect(updatedSlug).not.toBe(colliding.slug);

    const updatedServer = await prisma.server.findUnique({
      where: { id: created.id },
      select: {
        slug: true,
        description: true,
        isPublic: true,
      },
    });

    expect(updatedServer).toMatchObject({
      slug: updatedSlug,
      description: 'Updated description',
      isPublic: false,
    });

    const deleteRes = await request(app)
      .post('/trpc/server.deleteServer')
      .set('Authorization', `Bearer ${owner.accessToken}`)
      .send({ id: created.id });

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.result.data).toMatchObject({ id: created.id });

    createdServerIds.delete(created.id);

    const [deletedServer, deletedChannels, deletedMemberships] = await Promise.all([
      prisma.server.findUnique({ where: { id: created.id } }),
      prisma.channel.findMany({ where: { serverId: created.id } }),
      prisma.serverMember.findMany({ where: { serverId: created.id } }),
    ]);

    expect(deletedServer).toBeNull();
    expect(deletedChannels).toHaveLength(0);
    expect(deletedMemberships).toHaveLength(0);
  });
});
