import { requireServerSettingsAccess } from '@/app/settings/[serverSlug]/settings-access';
import { getCurrentUser } from '@/services/authService';
import { getServerAuthenticated, getServerMembersWithRole } from '@/services/serverService';

const mockRedirect = jest.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});
const mockNotFound = jest.fn(() => {
  throw new Error('NOT_FOUND');
});

jest.mock('next/navigation', () => ({
  redirect: (path: string) => mockRedirect(path),
  notFound: () => mockNotFound(),
}));

jest.mock('@/services/authService', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('@/services/serverService', () => ({
  getServerAuthenticated: jest.fn(),
  getServerMembersWithRole: jest.fn(),
}));

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;
const mockGetServerAuthenticated = getServerAuthenticated as jest.MockedFunction<
  typeof getServerAuthenticated
>;
const mockGetServerMembersWithRole = getServerMembersWithRole as jest.MockedFunction<
  typeof getServerMembersWithRole
>;

describe('requireServerSettingsAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the server for the owner', async () => {
    const server = { id: 'server-1', ownerId: 'owner-1', slug: 'test-server' } as Awaited<
      ReturnType<typeof getServerAuthenticated>
    >;
    mockGetServerAuthenticated.mockResolvedValue(server);
    mockGetServerMembersWithRole.mockResolvedValue([]);
    mockGetCurrentUser.mockResolvedValue({
      id: 'owner-1',
      username: 'owner',
      displayName: 'Owner',
      role: 'member',
      status: 'online',
      isSystemAdmin: false,
    });

    await expect(requireServerSettingsAccess('test-server')).resolves.toBe(server);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('returns the server for a system admin', async () => {
    const server = { id: 'server-1', ownerId: 'owner-1', slug: 'test-server' } as Awaited<
      ReturnType<typeof getServerAuthenticated>
    >;
    mockGetServerAuthenticated.mockResolvedValue(server);
    mockGetServerMembersWithRole.mockResolvedValue([]);
    mockGetCurrentUser.mockResolvedValue({
      id: 'admin-1',
      username: 'admin',
      displayName: 'Admin',
      role: 'member',
      status: 'online',
      isSystemAdmin: true,
    });

    await expect(requireServerSettingsAccess('test-server')).resolves.toBe(server);
  });

  it('returns the server for a server admin', async () => {
    const server = { id: 'server-1', ownerId: 'owner-1', slug: 'test-server' } as Awaited<
      ReturnType<typeof getServerAuthenticated>
    >;
    mockGetServerAuthenticated.mockResolvedValue(server);
    mockGetServerMembersWithRole.mockResolvedValue([
      {
        userId: 'admin-member-1',
        username: 'admin-member',
        displayName: 'Admin Member',
        avatarUrl: null,
        role: 'admin',
        joinedAt: '2026-04-17T00:00:00.000Z',
      },
    ]);
    mockGetCurrentUser.mockResolvedValue({
      id: 'admin-member-1',
      username: 'admin-member',
      displayName: 'Admin Member',
      role: 'member',
      status: 'online',
      isSystemAdmin: false,
    });

    await expect(requireServerSettingsAccess('test-server')).resolves.toBe(server);
  });

  it('redirects unauthorized users to the channel view', async () => {
    const server = { id: 'server-1', ownerId: 'owner-1', slug: 'test-server' } as Awaited<
      ReturnType<typeof getServerAuthenticated>
    >;
    mockGetServerAuthenticated.mockResolvedValue(server);
    mockGetServerMembersWithRole.mockResolvedValue([
      {
        userId: 'member-1',
        username: 'member',
        displayName: 'Member',
        avatarUrl: null,
        role: 'member',
        joinedAt: '2026-04-17T00:00:00.000Z',
      },
    ]);
    mockGetCurrentUser.mockResolvedValue({
      id: 'member-1',
      username: 'member',
      displayName: 'Member',
      role: 'member',
      status: 'online',
      isSystemAdmin: false,
    });

    await expect(requireServerSettingsAccess('test-server')).rejects.toThrow(
      'REDIRECT:/channels/test-server',
    );
  });

  it('throws in server-action mode for unauthorized users', async () => {
    const server = { id: 'server-1', ownerId: 'owner-1', slug: 'test-server' } as Awaited<
      ReturnType<typeof getServerAuthenticated>
    >;
    mockGetServerAuthenticated.mockResolvedValue(server);
    mockGetServerMembersWithRole.mockResolvedValue([
      {
        userId: 'member-1',
        username: 'member',
        displayName: 'Member',
        avatarUrl: null,
        role: 'member',
        joinedAt: '2026-04-17T00:00:00.000Z',
      },
    ]);
    mockGetCurrentUser.mockResolvedValue({
      id: 'member-1',
      username: 'member',
      displayName: 'Member',
      role: 'member',
      status: 'online',
      isSystemAdmin: false,
    });

    await expect(requireServerSettingsAccess('test-server', 'throw')).rejects.toThrow('Forbidden');
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('delegates missing servers to notFound', async () => {
    mockGetServerAuthenticated.mockResolvedValue(null);

    await expect(requireServerSettingsAccess('missing-server')).rejects.toThrow('NOT_FOUND');
  });
});
