/**
 * Unit tests for serverService.ts
 * Issue #265 — Sprint 3 (P5 Testing)
 */

// Mock next/headers before any imports (required by trpc-client)
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock the trpc-client module used by serverService
jest.mock('@/lib/trpc-client', () => ({
  publicGet: jest.fn(),
  trpcQuery: jest.fn(),
  trpcMutate: jest.fn(),
}));

// Mock react cache to pass through
jest.mock('react', () => ({
  cache: <T extends (...args: never[]) => unknown>(fn: T): T => fn,
}));

import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';
import {
  getServers,
  getServer,
  getServerAuthenticated,
  getServerMembers,
  updateServer,
  deleteServer,
  joinServer,
  createServer,
  getServerMembersWithRole,
  changeMemberRole,
  removeMember,
} from '@/services/serverService';

const mockedPublicGet = jest.mocked(publicGet);
const mockedTrpcQuery = jest.mocked(trpcQuery);
const mockedTrpcMutate = jest.mocked(trpcMutate);

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeRawServer(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'server-1',
    name: 'Test Server',
    slug: 'test-server',
    ownerId: 'user-1',
    iconUrl: undefined,
    icon: undefined,
    description: undefined,
    bannerUrl: undefined,
    memberCount: 5,
    isPublic: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makePublicRawServer(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'server-1',
    name: 'Test Server',
    slug: 'test-server',
    iconUrl: undefined,
    description: undefined,
    bannerUrl: undefined,
    memberCount: 5,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeRawMember(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    userId: 'user-1',
    serverId: 'server-1',
    role: 'MEMBER',
    joinedAt: '2026-01-01T00:00:00.000Z',
    user: {
      id: 'user-1',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      status: 'ONLINE',
    },
    ...overrides,
  };
}

function makeRawMemberWithRole(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    userId: 'user-1',
    serverId: 'server-1',
    role: 'MEMBER',
    joinedAt: '2026-01-01T00:00:00.000Z',
    user: {
      id: 'user-1',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
    },
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('serverService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── getServers ─────────────────────────────────────────────────────────────

  describe('getServers', () => {
    it('returns adapted servers for valid API response', async () => {
      const raw = [makeRawServer(), makeRawServer({ id: 'server-2', slug: 'test-server-2' })];
      mockedTrpcQuery.mockResolvedValue(raw);

      const result = await getServers();

      expect(mockedTrpcQuery).toHaveBeenCalledWith('server.getServers');
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 'server-1', name: 'Test Server', slug: 'test-server' });
      expect(result[1]).toMatchObject({ id: 'server-2' });
    });

    it('returns empty array when API returns null', async () => {
      mockedTrpcQuery.mockResolvedValue(null);

      const result = await getServers();

      expect(result).toEqual([]);
    });

    it('propagates rejection to caller', async () => {
      mockedTrpcQuery.mockRejectedValue(new Error('Network error'));

      await expect(getServers()).rejects.toThrow('Network error');
    });

    it('propagates 401 unauthorized rejection', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcQuery.mockRejectedValue(err);

      await expect(getServers()).rejects.toThrow('Unauthorized');
    });

    it('maps iconUrl to icon field', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawServer({ iconUrl: 'https://example.com/icon.png', icon: undefined }),
      ]);

      const [server] = await getServers();

      expect(server.icon).toBe('https://example.com/icon.png');
    });

    it('defaults memberCount to 0 when absent', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawServer({ memberCount: undefined })]);

      const [server] = await getServers();

      expect(server.memberCount).toBe(0);
    });
  });

  // ── getServer ──────────────────────────────────────────────────────────────

  describe('getServer', () => {
    it('returns adapted server for valid API response', async () => {
      mockedPublicGet.mockResolvedValue(makePublicRawServer());

      const result = await getServer('test-server');

      expect(result).toMatchObject({ id: 'server-1', slug: 'test-server' });
    });

    it('returns null for 404 (publicGet resolves null)', async () => {
      mockedPublicGet.mockResolvedValue(null);

      const result = await getServer('test-server');

      expect(result).toBeNull();
    });

    it('returns null when API rejects with network error', async () => {
      mockedPublicGet.mockRejectedValue(new Error('Network error'));

      const result = await getServer('test-server');

      expect(result).toBeNull();
    });

    it('returns null when API rejects with 401', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedPublicGet.mockRejectedValue(err);

      const result = await getServer('test-server');

      expect(result).toBeNull();
    });

    it('URL-encodes the slug', async () => {
      mockedPublicGet.mockResolvedValue(makePublicRawServer({ slug: 'my server' }));

      await getServer('my server');

      expect(mockedPublicGet).toHaveBeenCalledWith('/servers/my%20server');
    });

    it('warns on missing id field', async () => {
      mockedPublicGet.mockResolvedValue(makePublicRawServer({ id: undefined }));

      await getServer('test-server');

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('"id"'),
      );
    });

    it('warns on missing slug field', async () => {
      mockedPublicGet.mockResolvedValue(makePublicRawServer({ slug: undefined }));

      await getServer('test-server');

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('"slug"'),
      );
    });

    it('warns on missing createdAt field', async () => {
      mockedPublicGet.mockResolvedValue(makePublicRawServer({ createdAt: undefined }));

      await getServer('test-server');

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('"createdAt"'),
      );
    });
  });

  // ── getServerAuthenticated ─────────────────────────────────────────────────

  describe('getServerAuthenticated', () => {
    it('returns adapted server for valid API response', async () => {
      mockedTrpcQuery.mockResolvedValue(makeRawServer());

      const result = await getServerAuthenticated('test-server');

      expect(result).toMatchObject({ id: 'server-1', ownerId: 'user-1' });
    });

    it('returns null when API returns null', async () => {
      mockedTrpcQuery.mockResolvedValue(null);

      const result = await getServerAuthenticated('test-server');

      expect(result).toBeNull();
    });

    it('returns null when API returns falsy', async () => {
      mockedTrpcQuery.mockResolvedValue(false);

      const result = await getServerAuthenticated('test-server');

      expect(result).toBeNull();
    });

    it('returns null when API rejects with 401', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcQuery.mockRejectedValue(err);

      const result = await getServerAuthenticated('test-server');

      expect(result).toBeNull();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('returns null when API rejects with 403', async () => {
      const err = Object.assign(new Error('Forbidden'), { status: 403 });
      mockedTrpcQuery.mockRejectedValue(err);

      const result = await getServerAuthenticated('test-server');

      expect(result).toBeNull();
    });

    it('forwards slug to tRPC query', async () => {
      mockedTrpcQuery.mockResolvedValue(makeRawServer({ slug: 'test-server' }));

      await getServerAuthenticated('test-server');

      expect(mockedTrpcQuery).toHaveBeenCalledWith('server.getServer', { slug: 'test-server' });
    });
  });

  // ── getServerMembers ───────────────────────────────────────────────────────

  describe('getServerMembers', () => {
    it('returns adapted members for valid API response', async () => {
      const raw = [makeRawMember(), makeRawMember({ userId: 'user-2' })];
      mockedTrpcQuery.mockResolvedValue(raw);

      const result = await getServerMembers('s1');

      expect(mockedTrpcQuery).toHaveBeenCalledWith('server.getMembers', { serverId: 's1' });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 'user-1', username: 'alice' });
    });

    it('returns empty array when API returns null', async () => {
      mockedTrpcQuery.mockResolvedValue(null);

      const result = await getServerMembers('s1');

      expect(result).toEqual([]);
    });

    it('returns empty array when API rejects with network error', async () => {
      mockedTrpcQuery.mockRejectedValue(new Error('Network error'));

      const result = await getServerMembers('s1');

      expect(result).toEqual([]);
    });

    it('returns empty array when API rejects with 401', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcQuery.mockRejectedValue(err);

      const result = await getServerMembers('s1');

      expect(result).toEqual([]);
    });

    it('maps OWNER role to owner', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMember({ role: 'OWNER' })]);

      const [member] = await getServerMembers('s1');

      expect(member.role).toBe('owner');
    });

    it('maps ADMIN role to admin', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMember({ role: 'ADMIN' })]);

      const [member] = await getServerMembers('s1');

      expect(member.role).toBe('admin');
    });

    it('maps unknown role to member', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMember({ role: 'SUPERUSER' })]);

      const [member] = await getServerMembers('s1');

      expect(member.role).toBe('member');
    });

    it('maps ONLINE status to online', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMember()]);

      const [member] = await getServerMembers('s1');

      expect(member.status).toBe('online');
    });

    it('maps DND status to dnd', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawMember({ user: { id: 'user-1', username: 'alice', displayName: 'Alice', avatarUrl: null, status: 'DND' } }),
      ]);

      const [member] = await getServerMembers('s1');

      expect(member.status).toBe('dnd');
    });

    it('maps unknown status to offline', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawMember({ user: { id: 'user-1', username: 'alice', displayName: 'Alice', avatarUrl: null, status: 'INVISIBLE' } }),
      ]);

      const [member] = await getServerMembers('s1');

      expect(member.status).toBe('offline');
    });

    it('uses null avatarUrl as undefined', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMember()]);

      const [member] = await getServerMembers('s1');

      expect(member.avatar).toBeUndefined();
    });
  });

  // ── updateServer ───────────────────────────────────────────────────────────

  describe('updateServer', () => {
    it('updates all four editable fields', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer());

      const result = await updateServer('server-1', {
        name: 'New',
        description: 'Desc',
        icon: 'url',
        isPublic: true,
      });

      expect(mockedTrpcMutate).toHaveBeenCalledWith('server.updateServer', {
        id: 'server-1',
        name: 'New',
        description: 'Desc',
        iconUrl: 'url',
        isPublic: true,
      });
      expect(result).toMatchObject({ id: 'server-1' });
    });

    it('updates name only', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer({ name: 'New Name' }));

      await updateServer('server-1', { name: 'New Name' });

      const call = mockedTrpcMutate.mock.calls[0][1] as Record<string, unknown>;
      expect(call).toHaveProperty('name', 'New Name');
      expect(call).not.toHaveProperty('description');
      expect(call).not.toHaveProperty('iconUrl');
      expect(call).not.toHaveProperty('isPublic');
    });

    it('updates description only', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer({ description: 'New desc' }));

      await updateServer('server-1', { description: 'New desc' });

      const call = mockedTrpcMutate.mock.calls[0][1] as Record<string, unknown>;
      expect(call).toHaveProperty('description', 'New desc');
      expect(call).not.toHaveProperty('name');
      expect(call).not.toHaveProperty('iconUrl');
      expect(call).not.toHaveProperty('isPublic');
    });

    it('updates isPublic only', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer({ isPublic: false }));

      await updateServer('server-1', { isPublic: false });

      expect(mockedTrpcMutate).toHaveBeenCalledWith('server.updateServer', {
        id: 'server-1',
        isPublic: false,
      });
    });

    it('sends only id for empty patch', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer());

      await updateServer('server-1', {});

      expect(mockedTrpcMutate).toHaveBeenCalledWith('server.updateServer', { id: 'server-1' });
    });

    it('maps icon patch key to iconUrl mutation key', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer());

      await updateServer('server-1', { icon: 'https://example.com/img.png' });

      const call = mockedTrpcMutate.mock.calls[0][1] as Record<string, unknown>;
      expect(call).toHaveProperty('iconUrl', 'https://example.com/img.png');
      expect(call).not.toHaveProperty('icon');
    });

    it('propagates 401 unauthorized rejection', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(updateServer('server-1', { name: 'New' })).rejects.toThrow('Unauthorized');
    });

    it('propagates 403 rejection to caller', async () => {
      const err = Object.assign(new Error('Forbidden'), { status: 403 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(updateServer('server-1', { name: 'New' })).rejects.toThrow('Forbidden');
    });
  });

  // ── deleteServer ───────────────────────────────────────────────────────────

  describe('deleteServer', () => {
    it('returns true on successful deletion', async () => {
      mockedTrpcMutate.mockResolvedValue(undefined);

      const result = await deleteServer('s1');

      expect(mockedTrpcMutate).toHaveBeenCalledWith('server.deleteServer', { id: 's1' });
      expect(result).toBe(true);
    });

    it('propagates 401 unauthorized rejection', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(deleteServer('s1')).rejects.toThrow('Unauthorized');
    });

    it('propagates rejection to caller', async () => {
      const err = Object.assign(new Error('Not found'), { status: 404 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(deleteServer('s1')).rejects.toThrow('Not found');
    });
  });

  // ── joinServer ─────────────────────────────────────────────────────────────

  describe('joinServer', () => {
    it('returns void on successful join', async () => {
      mockedTrpcMutate.mockResolvedValue(undefined);

      const result = await joinServer('s1');

      expect(mockedTrpcMutate).toHaveBeenCalledWith('serverMember.joinServer', { serverId: 's1' });
      expect(result).toBeUndefined();
    });

    it('propagates 401 unauthorized rejection', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(joinServer('s1')).rejects.toThrow('Unauthorized');
    });

    it('propagates rejection for private server', async () => {
      const err = Object.assign(new Error('Forbidden'), { status: 403 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(joinServer('s1')).rejects.toThrow('Forbidden');
    });

    it('propagates rejection for duplicate membership', async () => {
      const err = Object.assign(new Error('Conflict'), { status: 409 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(joinServer('s1')).rejects.toThrow('Conflict');
    });
  });

  // ── createServer ───────────────────────────────────────────────────────────

  describe('createServer', () => {
    it('creates server with all fields', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer({ isPublic: true }));

      const result = await createServer({ name: 'My Server', description: 'Desc', isPublic: true });

      expect(mockedTrpcMutate).toHaveBeenCalledWith('server.createServer', {
        name: 'My Server',
        description: 'Desc',
        isPublic: true,
      });
      expect(result).toMatchObject({ id: 'server-1' });
    });

    it('defaults isPublic to false when omitted', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer({ isPublic: false }));

      await createServer({ name: 'My Server' });

      expect(mockedTrpcMutate).toHaveBeenCalledWith('server.createServer', {
        name: 'My Server',
        description: undefined,
        isPublic: false,
      });
    });

    it('creates public server', async () => {
      mockedTrpcMutate.mockResolvedValue(makeRawServer({ isPublic: true }));

      const result = await createServer({ name: 'My Server', isPublic: true });

      expect(result).toMatchObject({ id: 'server-1' });
    });

    it('propagates 401 unauthorized rejection', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(createServer({ name: 'My Server' })).rejects.toThrow('Unauthorized');
    });

    it('propagates 400 rejection to caller', async () => {
      const err = Object.assign(new Error('Bad Request'), { status: 400 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(createServer({ name: 'My Server' })).rejects.toThrow('Bad Request');
    });
  });

  // ── getServerMembersWithRole ───────────────────────────────────────────────

  describe('getServerMembersWithRole', () => {
    it('returns adapted member info for valid response', async () => {
      const raw = [makeRawMemberWithRole(), makeRawMemberWithRole({ userId: 'user-2' })];
      mockedTrpcQuery.mockResolvedValue(raw);

      const result = await getServerMembersWithRole('s1');

      expect(mockedTrpcQuery).toHaveBeenCalledWith('serverMember.getMembers', { serverId: 's1' });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        userId: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        avatarUrl: null,
        role: 'member',
        joinedAt: '2026-01-01T00:00:00.000Z',
      });
    });

    it('returns empty array when API returns null', async () => {
      mockedTrpcQuery.mockResolvedValue(null);

      const result = await getServerMembersWithRole('s1');

      expect(result).toEqual([]);
    });

    it('maps OWNER role to owner', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMemberWithRole({ role: 'OWNER' })]);

      const [member] = await getServerMembersWithRole('s1');

      expect(member.role).toBe('owner');
    });

    it('maps MODERATOR role to moderator', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMemberWithRole({ role: 'MODERATOR' })]);

      const [member] = await getServerMembersWithRole('s1');

      expect(member.role).toBe('moderator');
    });

    it('maps unknown role to member fallback', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMemberWithRole({ role: 'SUPERUSER' })]);

      const [member] = await getServerMembersWithRole('s1');

      expect(member.role).toBe('member');
    });

    it('preserves null avatarUrl', async () => {
      mockedTrpcQuery.mockResolvedValue([makeRawMemberWithRole()]);

      const [member] = await getServerMembersWithRole('s1');

      expect(member.avatarUrl).toBeNull();
    });

    it('forwards displayName from user', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawMemberWithRole({
          user: { id: 'user-1', username: 'alice', displayName: 'Alice', avatarUrl: null },
        }),
      ]);

      const [member] = await getServerMembersWithRole('s1');

      expect(member.displayName).toBe('Alice');
    });

    it('null-coerces missing displayName', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawMemberWithRole({
          user: { id: 'user-1', username: 'alice', displayName: undefined, avatarUrl: null },
        }),
      ]);

      const [member] = await getServerMembersWithRole('s1');

      expect(member.displayName).toBeNull();
    });

    it('propagates 401 unauthorized rejection', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcQuery.mockRejectedValue(err);

      await expect(getServerMembersWithRole('s1')).rejects.toThrow('Unauthorized');
    });

    it('propagates rejection to caller', async () => {
      mockedTrpcQuery.mockRejectedValue(new Error('Network error'));

      await expect(getServerMembersWithRole('s1')).rejects.toThrow('Network error');
    });
  });

  // ── changeMemberRole ───────────────────────────────────────────────────────

  describe('changeMemberRole', () => {
    it('changes role to ADMIN', async () => {
      mockedTrpcMutate.mockResolvedValue(undefined);

      const result = await changeMemberRole('s1', 'u1', 'ADMIN');

      expect(mockedTrpcMutate).toHaveBeenCalledWith('serverMember.changeRole', {
        serverId: 's1',
        targetUserId: 'u1',
        newRole: 'ADMIN',
      });
      expect(result).toBeUndefined();
    });

    it('changes role to MODERATOR', async () => {
      mockedTrpcMutate.mockResolvedValue(undefined);

      const result = await changeMemberRole('s1', 'u1', 'MODERATOR');

      expect(mockedTrpcMutate).toHaveBeenCalledWith('serverMember.changeRole', {
        serverId: 's1',
        targetUserId: 'u1',
        newRole: 'MODERATOR',
      });
      expect(result).toBeUndefined();
    });

    it('changes role to MEMBER', async () => {
      mockedTrpcMutate.mockResolvedValue(undefined);

      const result = await changeMemberRole('s1', 'u1', 'MEMBER');

      expect(mockedTrpcMutate).toHaveBeenCalledWith('serverMember.changeRole', {
        serverId: 's1',
        targetUserId: 'u1',
        newRole: 'MEMBER',
      });
      expect(result).toBeUndefined();
    });

    it('propagates 401 unauthorized rejection', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(changeMemberRole('s1', 'u1', 'ADMIN')).rejects.toThrow('Unauthorized');
    });

    it('propagates 403 rejection to caller', async () => {
      const err = Object.assign(new Error('Forbidden'), { status: 403 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(changeMemberRole('s1', 'u1', 'ADMIN')).rejects.toThrow('Forbidden');
    });
  });

  // ── removeMember ───────────────────────────────────────────────────────────

  describe('removeMember', () => {
    it('returns void on successful removal', async () => {
      mockedTrpcMutate.mockResolvedValue(undefined);

      const result = await removeMember('s1', 'u1');

      expect(mockedTrpcMutate).toHaveBeenCalledWith('serverMember.removeMember', {
        serverId: 's1',
        targetUserId: 'u1',
      });
      expect(result).toBeUndefined();
    });

    it('propagates 401 unauthorized rejection', async () => {
      const err = Object.assign(new Error('Unauthorized'), { status: 401 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(removeMember('s1', 'u1')).rejects.toThrow('Unauthorized');
    });

    it('propagates 404 rejection to caller', async () => {
      const err = Object.assign(new Error('Not found'), { status: 404 });
      mockedTrpcMutate.mockRejectedValue(err);

      await expect(removeMember('s1', 'u1')).rejects.toThrow('Not found');
    });
  });

  // ── toFrontendServer field mapping (tested indirectly) ────────────────────

  describe('toFrontendServer (via getServers)', () => {
    it('maps all fields correctly from raw backend shape', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawServer({
          description: 'A server',
          bannerUrl: 'https://example.com/banner.png',
          isPublic: false,
        }),
      ]);

      const [server] = await getServers();

      expect(server).toMatchObject({
        id: 'server-1',
        name: 'Test Server',
        slug: 'test-server',
        ownerId: 'user-1',
        memberCount: 5,
        isPublic: false,
        description: 'A server',
        bannerUrl: 'https://example.com/banner.png',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      });
    });

    it('prefers iconUrl over icon when both are present', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawServer({ iconUrl: 'icon-url', icon: 'fallback-icon' }),
      ]);

      const [server] = await getServers();

      expect(server.icon).toBe('icon-url');
    });

    it('falls back to icon when iconUrl is absent', async () => {
      mockedTrpcQuery.mockResolvedValue([
        makeRawServer({ iconUrl: undefined, icon: 'fallback-icon' }),
      ]);

      const [server] = await getServers();

      expect(server.icon).toBe('fallback-icon');
    });
  });
});
