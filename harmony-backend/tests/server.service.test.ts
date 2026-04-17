/**
 * server.service unit tests — Issue #264
 *
 * All Prisma calls, channelService, serverMemberService, isSystemAdmin, and
 * eventBus are mocked so the suite is fully isolated — no DB or Redis
 * connection is required.
 *
 * Covers every program path listed in docs/test-specs/server-service-spec.md.
 */

import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';

// ─── Module mocks (must appear before any import that resolves them) ──────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    server: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    serverMember: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock('../src/events/eventBus', () => ({
  eventBus: { publish: jest.fn().mockResolvedValue(undefined) },
  EventChannels: { SERVER_UPDATED: 'harmony:SERVER_UPDATED' },
}));

jest.mock('../src/services/channel.service', () => ({
  channelService: { createDefaultChannel: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('../src/services/serverMember.service', () => ({
  serverMemberService: { addOwner: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('../src/lib/admin.utils', () => ({
  isSystemAdmin: jest.fn().mockResolvedValue(false),
}));

// ─── Imports (after mocks so the mocked versions are resolved) ───────────────

import { prisma } from '../src/db/prisma';
import { eventBus, EventChannels } from '../src/events/eventBus';
import { channelService } from '../src/services/channel.service';
import { serverMemberService } from '../src/services/serverMember.service';
import { isSystemAdmin } from '../src/lib/admin.utils';
import { generateSlug, serverService } from '../src/services/server.service';

// ─── Typed mock references ────────────────────────────────────────────────────

const mockServer = prisma.server as unknown as {
  findMany: jest.Mock;
  findUnique: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  count: jest.Mock;
};

const mockServerMember = prisma.serverMember as unknown as {
  findMany: jest.Mock;
};

// ─── Test helpers ─────────────────────────────────────────────────────────────

/** Build a minimal Server-shaped object, overriding any fields. */
function makeServer(overrides: Record<string, unknown> = {}) {
  return {
    id: 'server-1',
    name: 'Test Server',
    slug: 'test-server',
    ownerId: 'owner-1',
    isPublic: true,
    memberCount: 5,
    description: null,
    iconUrl: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  };
}

/** Create a real PrismaClientKnownRequestError with P2002. */
function p2002(): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('Unique constraint violation', {
    code: 'P2002',
    clientVersion: '5.0.0',
  });
}

/** Create a real PrismaClientKnownRequestError with a non-P2002 code. */
function prismaErr(code = 'P2000'): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('Prisma error', {
    code,
    clientVersion: '5.0.0',
  });
}

// ─── Global beforeEach ────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  (eventBus.publish as jest.Mock).mockResolvedValue(undefined);
  (channelService.createDefaultChannel as jest.Mock).mockResolvedValue(undefined);
  (serverMemberService.addOwner as jest.Mock).mockResolvedValue(undefined);
  (isSystemAdmin as jest.Mock).mockResolvedValue(false);
});

// ═══════════════════════════════════════════════════════════════════════════════
// generateSlug
// ═══════════════════════════════════════════════════════════════════════════════

describe('generateSlug', () => {
  it('converts mixed-case name with spaces to lowercase kebab', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('trims leading and trailing whitespace before processing', () => {
    expect(generateSlug('  My Server  ')).toBe('my-server');
  });

  it('strips non-alphanumeric characters (non-ASCII and symbols)', () => {
    expect(generateSlug('Café & Lounge!')).toBe('caf-lounge');
  });

  it('collapses multiple consecutive spaces into a single hyphen', () => {
    expect(generateSlug('foo   bar')).toBe('foo-bar');
  });

  it('collapses consecutive hyphens into one', () => {
    expect(generateSlug('foo--bar')).toBe('foo-bar');
  });

  it('strips leading hyphens from the result', () => {
    expect(generateSlug('-leading')).toBe('leading');
  });

  it('strips trailing hyphens from the result', () => {
    expect(generateSlug('trailing-')).toBe('trailing');
  });

  it('returns empty string when all characters are stripped', () => {
    expect(generateSlug('!!!')).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(generateSlug('')).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getPublicServers
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.getPublicServers', () => {
  it('applies isPublic:true filter and default take:50', async () => {
    mockServer.findMany.mockResolvedValue([]);
    await serverService.getPublicServers();
    expect(mockServer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublic: true }, take: 50 }),
    );
  });

  it('orders results by createdAt descending', async () => {
    mockServer.findMany.mockResolvedValue([]);
    await serverService.getPublicServers();
    expect(mockServer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
    );
  });

  it('respects a caller-supplied limit smaller than 50', async () => {
    mockServer.findMany.mockResolvedValue([]);
    await serverService.getPublicServers(10);
    expect(mockServer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 }),
    );
  });

  it('caps the effective limit at 100', async () => {
    mockServer.findMany.mockResolvedValue([]);
    await serverService.getPublicServers(200);
    expect(mockServer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
  });

  it('returns an empty array when no public servers exist', async () => {
    mockServer.findMany.mockResolvedValue([]);
    expect(await serverService.getPublicServers()).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getAllServers
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.getAllServers', () => {
  it('calls findMany without a visibility filter and default take:50', async () => {
    mockServer.findMany.mockResolvedValue([]);
    await serverService.getAllServers();
    const arg = mockServer.findMany.mock.calls[0][0] as Record<string, unknown>;
    expect(arg.take).toBe(50);
    expect(arg.where).toBeUndefined();
  });

  it('respects a caller-supplied limit', async () => {
    mockServer.findMany.mockResolvedValue([]);
    await serverService.getAllServers(20);
    expect(mockServer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 20 }),
    );
  });

  it('caps the effective limit at 100', async () => {
    mockServer.findMany.mockResolvedValue([]);
    await serverService.getAllServers(500);
    expect(mockServer.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
  });

  it('returns an empty array when no servers exist', async () => {
    mockServer.findMany.mockResolvedValue([]);
    expect(await serverService.getAllServers()).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getMemberServers
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.getMemberServers', () => {
  it('returns servers extracted from memberships in the order returned (ascending joinedAt)', async () => {
    const s1 = makeServer({ id: 's1' });
    const s2 = makeServer({ id: 's2' });
    mockServerMember.findMany.mockResolvedValue([{ server: s1 }, { server: s2 }]);
    const result = await serverService.getMemberServers('user-1');
    expect(result).toEqual([s1, s2]);
    expect(mockServerMember.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-1' }, orderBy: { joinedAt: 'asc' } }),
    );
  });

  it('returns empty array when user has no memberships', async () => {
    mockServerMember.findMany.mockResolvedValue([]);
    expect(await serverService.getMemberServers('no-memberships-user')).toEqual([]);
  });

  it('respects a caller-supplied limit', async () => {
    mockServerMember.findMany.mockResolvedValue([]);
    await serverService.getMemberServers('user-1', 5);
    expect(mockServerMember.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    );
  });

  it('caps the effective limit at 100', async () => {
    mockServerMember.findMany.mockResolvedValue([]);
    await serverService.getMemberServers('user-1', 200);
    expect(mockServerMember.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getServer
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.getServer', () => {
  it('returns the matching server for a known slug', async () => {
    const server = makeServer();
    mockServer.findUnique.mockResolvedValue(server);
    const result = await serverService.getServer('test-server');
    expect(result).toEqual(server);
    expect(mockServer.findUnique).toHaveBeenCalledWith({ where: { slug: 'test-server' } });
  });

  it('returns null for an unknown slug', async () => {
    mockServer.findUnique.mockResolvedValue(null);
    expect(await serverService.getServer('nonexistent')).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// createServer
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.createServer', () => {
  it('creates server with all optional fields and calls createDefaultChannel then addOwner', async () => {
    const created = makeServer({ id: 'new-id', name: 'New Server', slug: 'new-server' });
    mockServer.count.mockResolvedValue(0);
    mockServer.create.mockResolvedValue(created);

    const result = await serverService.createServer({
      name: 'New Server',
      description: 'desc',
      iconUrl: 'https://img',
      isPublic: true,
      ownerId: 'owner-1',
    });

    expect(result).toEqual(created);
    expect(channelService.createDefaultChannel).toHaveBeenCalledWith('new-id', true);
    expect(serverMemberService.addOwner).toHaveBeenCalledWith('owner-1', 'new-id');
    // createDefaultChannel must be called before addOwner
    const createOrder = (channelService.createDefaultChannel as jest.Mock).mock.invocationCallOrder[0];
    const ownerOrder = (serverMemberService.addOwner as jest.Mock).mock.invocationCallOrder[0];
    expect(createOrder).toBeLessThan(ownerOrder);
  });

  it('creates server with only required fields', async () => {
    const created = makeServer({ id: 'min-id', name: 'Minimal', slug: 'minimal' });
    mockServer.count.mockResolvedValue(0);
    mockServer.create.mockResolvedValue(created);

    const result = await serverService.createServer({ name: 'Minimal', ownerId: 'owner-1' });
    expect(result).toEqual(created);
    expect(channelService.createDefaultChannel).toHaveBeenCalledWith('min-id', false);
    expect(serverMemberService.addOwner).toHaveBeenCalledWith('owner-1', 'min-id');
  });

  it('throws BAD_REQUEST when name produces an empty slug', async () => {
    await expect(serverService.createServer({ name: '!!!', ownerId: 'owner-1' }))
      .rejects.toMatchObject({ code: 'BAD_REQUEST', message: 'Cannot generate slug from name' });
    expect(mockServer.create).not.toHaveBeenCalled();
  });

  it('throws CONFLICT when all 10 generateUniqueSlug candidates are occupied', async () => {
    // count always non-zero → base, base-1 … base-9 all taken
    mockServer.count.mockResolvedValue(1);
    await expect(serverService.createServer({ name: 'New Server', ownerId: 'owner-1' }))
      .rejects.toMatchObject({ code: 'CONFLICT', message: 'Unable to generate a unique slug' });
    expect(mockServer.create).not.toHaveBeenCalled();
  });

  it('retries once on a transient P2002, regenerates slug, and persists the new slug on the second attempt', async () => {
    // On the retry generateUniqueSlug call, 'new-server' is now taken so it
    // falls through to 'new-server-1'.  Sequence:
    //   call 1 → 0   (initial: 'new-server' free  → use it)
    //   call 2 → 1   (retry:   'new-server' taken → try next)
    //   call 3 → 0   (retry:   'new-server-1' free → use it)
    const created = makeServer({ id: 'retry-id', slug: 'new-server-1' });
    mockServer.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0);
    mockServer.create
      .mockRejectedValueOnce(p2002())
      .mockResolvedValueOnce(created);

    const result = await serverService.createServer({ name: 'New Server', ownerId: 'owner-1' });
    expect(result).toEqual(created);
    expect(mockServer.create).toHaveBeenCalledTimes(2);
    expect(mockServer.count).toHaveBeenCalledTimes(3); // 1 initial + 2 inside retry

    // Verify the slug actually changed between the first and second create calls
    const firstSlug = (mockServer.create.mock.calls[0][0] as Record<string, Record<string, unknown>>).data.slug;
    const secondSlug = (mockServer.create.mock.calls[1][0] as Record<string, Record<string, unknown>>).data.slug;
    expect(firstSlug).toBe('new-server');
    expect(secondSlug).toBe('new-server-1');
  });

  it('rethrows the raw P2002 (not TRPCError) when withSlugRetry exhausts all 3 attempts', async () => {
    const error = p2002();
    mockServer.count.mockResolvedValue(0);
    mockServer.create.mockRejectedValue(error);

    await expect(serverService.createServer({ name: 'New Server', ownerId: 'owner-1' }))
      .rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    await expect(serverService.createServer({ name: 'New Server', ownerId: 'owner-1' }))
      .rejects.not.toBeInstanceOf(TRPCError);
  });

  it('rethrows a non-P2002 Prisma error immediately on the first attempt without retry', async () => {
    const error = prismaErr('P2000');
    mockServer.count.mockResolvedValue(0);
    mockServer.create.mockRejectedValue(error);

    await expect(serverService.createServer({ name: 'New Server', ownerId: 'owner-1' }))
      .rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    expect(mockServer.create).toHaveBeenCalledTimes(1);
  });

  it('propagates a createDefaultChannel rejection and does not proceed to addOwner', async () => {
    // createServer is implemented as sequential awaits (no prisma.$transaction), so a
    // failure in createDefaultChannel stops execution at that point.  The server record
    // created by prisma.server.create is NOT rolled back — this test documents that
    // actual sequential behavior: addOwner is never reached when the prior step throws.
    const created = makeServer({ id: 'new-id' });
    mockServer.count.mockResolvedValue(0);
    mockServer.create.mockResolvedValue(created);
    const channelError = new Error('channel creation failed');
    (channelService.createDefaultChannel as jest.Mock).mockRejectedValue(channelError);

    await expect(serverService.createServer({ name: 'New Server', ownerId: 'owner-1' }))
      .rejects.toThrow('channel creation failed');
    // Execution must stop at createDefaultChannel; addOwner must not be called.
    expect(serverMemberService.addOwner).not.toHaveBeenCalled();
  });

  it('propagates an addOwner rejection after createDefaultChannel has already succeeded', async () => {
    // Documents that createDefaultChannel ran and completed before addOwner was called,
    // confirming the sequential execution order.  Neither the server record nor the
    // default channel is rolled back (no prisma.$transaction in the implementation).
    const created = makeServer({ id: 'new-id' });
    mockServer.count.mockResolvedValue(0);
    mockServer.create.mockResolvedValue(created);
    const ownerError = new Error('addOwner failed');
    (serverMemberService.addOwner as jest.Mock).mockRejectedValue(ownerError);

    await expect(serverService.createServer({ name: 'New Server', ownerId: 'owner-1' }))
      .rejects.toThrow('addOwner failed');
    // createDefaultChannel was called and completed before addOwner threw.
    expect(channelService.createDefaultChannel).toHaveBeenCalledWith('new-id', false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// updateServer
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.updateServer', () => {
  const existing = makeServer({ id: 'srv-1', name: 'Old Name', slug: 'old-name', ownerId: 'owner-1' });

  beforeEach(() => {
    mockServer.findUnique.mockResolvedValue(existing);
    mockServer.update.mockResolvedValue({ ...existing });
    mockServer.count.mockResolvedValue(0);
  });

  it('throws NOT_FOUND when the server does not exist', async () => {
    mockServer.findUnique.mockResolvedValue(null);
    await expect(serverService.updateServer('srv-1', 'owner-1', {}))
      .rejects.toMatchObject({ code: 'NOT_FOUND', message: 'Server not found' });
  });

  it('throws FORBIDDEN when actor is not owner and not a system admin', async () => {
    (isSystemAdmin as jest.Mock).mockResolvedValue(false);
    await expect(serverService.updateServer('srv-1', 'other-user', {}))
      .rejects.toMatchObject({ code: 'FORBIDDEN', message: 'Only the server owner can update' });
  });

  it('allows the owner to update without renaming and does not call server.count', async () => {
    const updated = { ...existing, description: 'new desc' };
    mockServer.update.mockResolvedValue(updated);

    const result = await serverService.updateServer('srv-1', 'owner-1', { description: 'new desc' });
    expect(result).toEqual(updated);
    expect(mockServer.count).not.toHaveBeenCalled();
  });

  it('allows the owner to rename, regenerates slug, and persists the generated slug', async () => {
    const updated = { ...existing, name: 'New Name', slug: 'new-name' };
    mockServer.update.mockResolvedValue(updated);

    const result = await serverService.updateServer('srv-1', 'owner-1', { name: 'New Name' });
    expect(result.name).toBe('New Name');
    expect(mockServer.count).toHaveBeenCalled(); // generateUniqueSlug probed DB for the new slug

    // Verify the slug written to the DB matches what generateUniqueSlug produced
    const updateArg = mockServer.update.mock.calls[0][0] as Record<string, Record<string, unknown>>;
    expect(updateArg.data.slug).toBe('new-name'); // generateSlug('New Name') → 'new-name'
  });

  it('skips slug regeneration when the name is identical to the current name', async () => {
    await serverService.updateServer('srv-1', 'owner-1', { name: 'Old Name' });
    expect(mockServer.count).not.toHaveBeenCalled();
  });

  it('allows a system admin who is not the owner to update the server', async () => {
    (isSystemAdmin as jest.Mock).mockResolvedValue(true);
    const updated = { ...existing, description: 'admin update' };
    mockServer.update.mockResolvedValue(updated);

    const result = await serverService.updateServer('srv-1', 'admin-user', { description: 'admin update' });
    expect(result).toEqual(updated);
  });

  it('publishes SERVER_UPDATED with the correct payload fields after every successful update', async () => {
    await serverService.updateServer('srv-1', 'owner-1', {});

    expect(eventBus.publish).toHaveBeenCalledWith(
      EventChannels.SERVER_UPDATED,
      expect.objectContaining({
        serverId: 'srv-1',
        name: existing.name,
        iconUrl: null,
        description: null,
        timestamp: expect.any(String),
      }),
    );
  });

  it('publishes SERVER_UPDATED even when only non-name fields are changed', async () => {
    mockServer.update.mockResolvedValue({ ...existing, description: 'changed' });
    await serverService.updateServer('srv-1', 'owner-1', { description: 'changed' });
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
  });

  it('throws CONFLICT when all 10 generateUniqueSlug candidates are occupied on rename', async () => {
    mockServer.count.mockResolvedValue(1);
    await expect(serverService.updateServer('srv-1', 'owner-1', { name: 'New Name' }))
      .rejects.toMatchObject({ code: 'CONFLICT', message: 'Unable to generate a unique slug' });
  });

  it('rethrows the raw P2002 (not TRPCError) when withSlugRetry exhausts all 3 attempts on rename', async () => {
    const error = p2002();
    mockServer.count.mockResolvedValue(0);
    mockServer.update.mockRejectedValue(error);

    await expect(serverService.updateServer('srv-1', 'owner-1', { name: 'New Name' }))
      .rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    await expect(serverService.updateServer('srv-1', 'owner-1', { name: 'New Name' }))
      .rejects.not.toBeInstanceOf(TRPCError);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// deleteServer
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.deleteServer', () => {
  const existing = makeServer({ id: 'srv-del', ownerId: 'owner-1' });

  beforeEach(() => {
    mockServer.findUnique.mockResolvedValue(existing);
    mockServer.delete.mockResolvedValue(existing);
  });

  it('throws NOT_FOUND when the server does not exist', async () => {
    mockServer.findUnique.mockResolvedValue(null);
    await expect(serverService.deleteServer('srv-del', 'owner-1'))
      .rejects.toMatchObject({ code: 'NOT_FOUND', message: 'Server not found' });
  });

  it('throws FORBIDDEN when actor is not owner and not a system admin', async () => {
    (isSystemAdmin as jest.Mock).mockResolvedValue(false);
    await expect(serverService.deleteServer('srv-del', 'other-user'))
      .rejects.toMatchObject({ code: 'FORBIDDEN', message: 'Only the server owner can delete' });
  });

  it('allows the owner to delete and returns the deleted record', async () => {
    const result = await serverService.deleteServer('srv-del', 'owner-1');
    expect(result).toEqual(existing);
    expect(mockServer.delete).toHaveBeenCalledWith({ where: { id: 'srv-del' } });
  });

  it('allows a system admin who is not the owner to delete the server', async () => {
    (isSystemAdmin as jest.Mock).mockResolvedValue(true);
    const result = await serverService.deleteServer('srv-del', 'admin-user');
    expect(result).toEqual(existing);
    expect(mockServer.delete).toHaveBeenCalledWith({ where: { id: 'srv-del' } });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// incrementMemberCount
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.incrementMemberCount', () => {
  it('increments memberCount by 1 and returns the updated server', async () => {
    const updated = makeServer({ memberCount: 4 });
    mockServer.update.mockResolvedValue(updated);

    const result = await serverService.incrementMemberCount('srv-1');
    expect(result.memberCount).toBe(4);
    expect(mockServer.update).toHaveBeenCalledWith({
      where: { id: 'srv-1' },
      data: { memberCount: { increment: 1 } },
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// decrementMemberCount
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.decrementMemberCount', () => {
  it('decrements memberCount by 1 and returns the updated server', async () => {
    mockServer.findUnique.mockResolvedValue(makeServer({ memberCount: 2 }));
    const updated = makeServer({ memberCount: 1 });
    mockServer.update.mockResolvedValue(updated);

    const result = await serverService.decrementMemberCount('srv-1');
    expect(result.memberCount).toBe(1);
    expect(mockServer.update).toHaveBeenCalledWith({
      where: { id: 'srv-1' },
      data: { memberCount: { decrement: 1 } },
    });
  });

  it('throws BAD_REQUEST when the server does not exist (null branch of compound guard)', async () => {
    mockServer.findUnique.mockResolvedValue(null);
    await expect(serverService.decrementMemberCount('unknown'))
      .rejects.toMatchObject({ code: 'BAD_REQUEST', message: 'Member count is already zero' });
    expect(mockServer.update).not.toHaveBeenCalled();
  });

  it('throws BAD_REQUEST when memberCount is already zero (zero branch of compound guard)', async () => {
    mockServer.findUnique.mockResolvedValue(makeServer({ memberCount: 0 }));
    await expect(serverService.decrementMemberCount('srv-1'))
      .rejects.toMatchObject({ code: 'BAD_REQUEST', message: 'Member count is already zero' });
    expect(mockServer.update).not.toHaveBeenCalled();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// getMembers
// ═══════════════════════════════════════════════════════════════════════════════

describe('serverService.getMembers', () => {
  function makeUser(id: string) {
    return { id, username: `u_${id}`, displayName: `User ${id}`, avatarUrl: null, status: 'OFFLINE' };
  }

  function makeMember(role: string, joinedAt: Date, userId: string) {
    return { userId, serverId: 'srv-1', role, joinedAt, user: makeUser(userId) };
  }

  it('returns members sorted by role hierarchy: OWNER first, GUEST last', async () => {
    const now = new Date();
    mockServerMember.findMany.mockResolvedValue([
      makeMember('GUEST', now, 'u-guest'),
      makeMember('MEMBER', now, 'u-member'),
      makeMember('ADMIN', now, 'u-admin'),
      makeMember('MODERATOR', now, 'u-mod'),
      makeMember('OWNER', now, 'u-owner'),
    ]);

    const result = await serverService.getMembers('srv-1');
    expect(result.map((m) => m.role)).toEqual(['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST']);
  });

  it('preserves ascending joinedAt order within the same role', async () => {
    const earlier = new Date('2024-01-01');
    const later = new Date('2024-06-01');
    mockServerMember.findMany.mockResolvedValue([
      makeMember('MEMBER', later, 'u-late'),
      makeMember('MEMBER', earlier, 'u-early'),
    ]);

    const result = await serverService.getMembers('srv-1');
    expect(result[0].userId).toBe('u-early');
    expect(result[1].userId).toBe('u-late');
  });

  it('returns an empty array when the server has no members', async () => {
    mockServerMember.findMany.mockResolvedValue([]);
    expect(await serverService.getMembers('srv-1')).toEqual([]);
  });

  it('includes all user profile fields on each returned member', async () => {
    const user = {
      id: 'u1',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: 'https://img.example.com/a.png',
      status: 'ONLINE',
    };
    mockServerMember.findMany.mockResolvedValue([
      { userId: 'u1', serverId: 'srv-1', role: 'MEMBER', joinedAt: new Date(), user },
    ]);

    const result = await serverService.getMembers('srv-1');
    expect(result[0].user).toMatchObject({
      id: 'u1',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: 'https://img.example.com/a.png',
      status: 'ONLINE',
    });
  });

  it('sorts members with unknown roles after GUEST using rank 99 fallback', async () => {
    const now = new Date();
    mockServerMember.findMany.mockResolvedValue([
      makeMember('CUSTOM', now, 'u-custom'),
      makeMember('GUEST', now, 'u-guest'),
    ]);

    const result = await serverService.getMembers('srv-1');
    expect(result[0].role).toBe('GUEST');
    expect(result[1].role).toBe('CUSTOM');
  });
});
