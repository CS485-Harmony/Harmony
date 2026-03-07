/**
 * User service tests — Issue #98
 *
 * Covers happy-path CRUD operations for user profile management.
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { userService } from '../src/services/user.service';

const prisma = new PrismaClient();

let userId: string;
let privateUserId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: `testuser-${Date.now()}@test.com`,
      username: `testuser-${Date.now()}`,
      passwordHash: 'testhash',
      displayName: 'Test User',
      publicProfile: true,
    },
  });
  userId = user.id;

  const privateUser = await prisma.user.create({
    data: {
      email: `private-${Date.now()}@test.com`,
      username: `private-${Date.now()}`,
      passwordHash: 'testhash',
      displayName: 'Private User',
      publicProfile: false,
    },
  });
  privateUserId = privateUser.id;
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { id: { in: [userId, privateUserId].filter(Boolean) } },
  }).catch((e) => console.error('afterAll cleanup failed:', e));
  await prisma.$disconnect();
});

// ─── getUser ──────────────────────────────────────────────────────────────────

describe('userService.getUser', () => {
  it('returns a public user by id', async () => {
    const user = await userService.getUser(userId);
    expect(user.id).toBe(userId);
    expect(user.displayName).toBe('Test User');
    expect(user.status).toBe('OFFLINE');
  });

  it('never exposes passwordHash or email for a public user', async () => {
    const user = await userService.getUser(userId);
    expect(user).not.toHaveProperty('passwordHash');
    expect(user).not.toHaveProperty('email');
  });

  it('anonymises a user with publicProfile=false', async () => {
    const user = await userService.getUser(privateUserId);
    expect(user.id).toBe(privateUserId);
    expect(user.displayName).toBe('Anonymous');
    expect(user.username).toBe('anonymous');
    expect(user.avatarUrl).toBeNull();
    expect(user.status).toBe('OFFLINE');
    expect(user.publicProfile).toBe(true); // flag itself is masked
  });

  it('never exposes passwordHash or email for a private user', async () => {
    const user = await userService.getUser(privateUserId);
    expect(user).not.toHaveProperty('passwordHash');
    expect(user).not.toHaveProperty('email');
  });

  it('throws NOT_FOUND for unknown userId', async () => {
    await expect(
      userService.getUser('00000000-0000-0000-0000-000000000000'),
    ).rejects.toThrow(TRPCError);
  });
});

// ─── getCurrentUser ───────────────────────────────────────────────────────────

describe('userService.getCurrentUser', () => {
  it('returns the authenticated user by id', async () => {
    const user = await userService.getCurrentUser(userId);
    expect(user.id).toBe(userId);
  });

  it('bypasses publicProfile filter — returns own full profile even when private', async () => {
    const user = await userService.getCurrentUser(privateUserId);
    expect(user.id).toBe(privateUserId);
    expect(user.displayName).toBe('Private User');
    expect(user.username).not.toBe('anonymous');
  });

  it('includes email for self but never exposes passwordHash', async () => {
    const user = await userService.getCurrentUser(userId);
    expect(user).toHaveProperty('email');
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('throws NOT_FOUND for unknown userId', async () => {
    await expect(
      userService.getCurrentUser('00000000-0000-0000-0000-000000000000'),
    ).rejects.toThrow(TRPCError);
  });
});

// ─── updateUser ───────────────────────────────────────────────────────────────

describe('userService.updateUser', () => {
  it('empty patch is a no-op — returns unchanged user', async () => {
    const before = await userService.getCurrentUser(userId);
    const after = await userService.updateUser(userId, {});
    expect(after.displayName).toBe(before.displayName);
    expect(after.publicProfile).toBe(before.publicProfile);
    expect(after.status).toBe(before.status);
  });

  it('never exposes passwordHash in update response', async () => {
    const updated = await userService.updateUser(userId, { displayName: 'Safe Name' });
    expect(updated).not.toHaveProperty('passwordHash');
  });

  it('updates displayName', async () => {
    const updated = await userService.updateUser(userId, { displayName: 'Updated Name' });
    expect(updated.displayName).toBe('Updated Name');
  });

  it('updates publicProfile to false', async () => {
    const updated = await userService.updateUser(userId, { publicProfile: false });
    expect(updated.publicProfile).toBe(false);
  });

  it('updates status to ONLINE', async () => {
    const updated = await userService.updateUser(userId, { status: 'ONLINE' });
    expect(updated.status).toBe('ONLINE');
  });

  it('updates status to IDLE', async () => {
    const updated = await userService.updateUser(userId, { status: 'IDLE' });
    expect(updated.status).toBe('IDLE');
  });

  it('updates status to DND', async () => {
    const updated = await userService.updateUser(userId, { status: 'DND' });
    expect(updated.status).toBe('DND');
  });

  it('updates status to OFFLINE', async () => {
    const updated = await userService.updateUser(userId, { status: 'OFFLINE' });
    expect(updated.status).toBe('OFFLINE');
  });

  it('updates avatarUrl', async () => {
    const updated = await userService.updateUser(userId, {
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    });
    expect(updated.avatarUrl).toContain('dicebear');
  });

  it('clears avatarUrl when set to null', async () => {
    const updated = await userService.updateUser(userId, { avatarUrl: null });
    expect(updated.avatarUrl).toBeNull();
  });

  it('throws NOT_FOUND for unknown userId', async () => {
    await expect(
      userService.updateUser('00000000-0000-0000-0000-000000000000', { displayName: 'Ghost' }),
    ).rejects.toThrow(TRPCError);
  });
});
