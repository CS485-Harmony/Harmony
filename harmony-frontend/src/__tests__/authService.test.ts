jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    trpcQuery: jest.fn(),
    trpcMutation: jest.fn(),
  },
  setTokens: jest.fn(),
  clearTokens: jest.fn(() => window.localStorage.removeItem('harmony_refresh_token')),
  getAccessToken: jest.fn(() => null),
}));

jest.mock('@/lib/passwordAuth', () => ({
  derivePasswordVerifier: jest.fn(),
}));

jest.mock('@/app/actions/session', () => ({
  setSessionCookie: jest.fn().mockResolvedValue(undefined),
  clearSessionCookie: jest.fn().mockResolvedValue(undefined),
}));

import { apiClient, getAccessToken, setTokens } from '@/lib/api-client';
import { derivePasswordVerifier } from '@/lib/passwordAuth';
import { clearSessionCookie, setSessionCookie } from '@/app/actions/session';
import {
  getCurrentUser,
  login,
  register,
  shouldEnablePresenceTracking,
  updateCurrentUser,
} from '@/services/authService';

const mockedApiClient = jest.mocked(apiClient);
const mockedGetAccessToken = jest.mocked(getAccessToken);
const mockedSetTokens = jest.mocked(setTokens);
const mockedDerivePasswordVerifier = jest.mocked(derivePasswordVerifier);

describe('authService password transport hardening', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    mockedDerivePasswordVerifier.mockResolvedValue('derived-password-verifier');
    mockedApiClient.trpcQuery.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      publicProfile: true,
      status: 'ONLINE',
      createdAt: '2026-01-01T00:00:00.000Z',
      isSystemAdmin: false,
    });
    mockedApiClient.trpcMutation.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      publicProfile: true,
      status: 'ONLINE',
      createdAt: '2026-01-01T00:00:00.000Z',
      isSystemAdmin: false,
    });
  });

  it('requests a login salt and never posts the raw password during login', async () => {
    mockedApiClient.post
      .mockResolvedValueOnce({ passwordSalt: '00112233445566778899aabbccddeeff' })
      .mockResolvedValueOnce({ accessToken: 'access' });

    await login('user@example.com', 'plain-text-password');

    expect(mockedApiClient.post).toHaveBeenNthCalledWith(1, '/api/auth/login/challenge', {
      email: 'user@example.com',
    });
    expect(mockedDerivePasswordVerifier).toHaveBeenCalledWith(
      'plain-text-password',
      '00112233445566778899aabbccddeeff',
    );
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(2, '/api/auth/login', {
      email: 'user@example.com',
      passwordVerifier: 'derived-password-verifier',
    });
    expect(mockedApiClient.post).not.toHaveBeenNthCalledWith(2, '/api/auth/login', {
      email: 'user@example.com',
      password: 'plain-text-password',
    });
    expect(mockedSetTokens).toHaveBeenCalledWith('access');
    expect(window.localStorage.getItem('harmony_refresh_token')).toBeNull();
    expect(setSessionCookie).toHaveBeenCalledWith('access');
  });

  it('requests a registration salt and never posts the raw password during signup', async () => {
    mockedApiClient.post
      .mockResolvedValueOnce({ passwordSalt: 'ffeeddccbbaa99887766554433221100' })
      .mockResolvedValueOnce({ accessToken: 'access' });

    await register('user@example.com', 'alice', 'Alice', 'plain-text-password');

    expect(mockedApiClient.post).toHaveBeenNthCalledWith(1, '/api/auth/register/challenge');
    expect(mockedDerivePasswordVerifier).toHaveBeenCalledWith(
      'plain-text-password',
      'ffeeddccbbaa99887766554433221100',
    );
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(2, '/api/auth/register', {
      email: 'user@example.com',
      username: 'alice',
      passwordSalt: 'ffeeddccbbaa99887766554433221100',
      passwordVerifier: 'derived-password-verifier',
    });
    expect(mockedApiClient.post).not.toHaveBeenNthCalledWith(2, '/api/auth/register', {
      email: 'user@example.com',
      username: 'alice',
      password: 'plain-text-password',
    });
    expect(mockedSetTokens).toHaveBeenCalledWith('access');
    expect(window.localStorage.getItem('harmony_refresh_token')).toBeNull();
    expect(setSessionCookie).toHaveBeenCalledWith('access');
  });

  it('logs out without posting a refresh token from localStorage', async () => {
    const { logout } = await import('@/services/authService');
    window.localStorage.setItem('harmony_refresh_token', 'refresh-token');
    mockedApiClient.post.mockResolvedValueOnce(undefined);

    await logout();

    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/auth/logout');
    expect(clearSessionCookie).toHaveBeenCalled();
    expect(window.localStorage.getItem('harmony_refresh_token')).toBeNull();
  });

  it('preserves backend OFFLINE until live presence tracking marks the session online', async () => {
    mockedGetAccessToken.mockReturnValue('access');
    mockedApiClient.trpcQuery.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      publicProfile: true,
      status: 'OFFLINE',
      createdAt: '2026-01-01T00:00:00.000Z',
      isSystemAdmin: false,
    });

    const user = await getCurrentUser();

    expect(user?.status).toBe('offline');
  });

  it('persists manual offline override when saving settings', async () => {
    mockedApiClient.trpcMutation.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      publicProfile: true,
      status: 'OFFLINE',
      createdAt: '2026-01-01T00:00:00.000Z',
      isSystemAdmin: false,
    });

    const updated = await updateCurrentUser({ status: 'offline' });

    expect(updated.status).toBe('offline');
    expect(window.localStorage.getItem('harmony_manual_status:user-1')).toBe('offline');
  });

  it('persists manual idle override when saving settings', async () => {
    mockedApiClient.trpcMutation.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      publicProfile: true,
      status: 'IDLE',
      createdAt: '2026-01-01T00:00:00.000Z',
      isSystemAdmin: false,
    });

    const updated = await updateCurrentUser({ status: 'idle' });

    expect(updated.status).toBe('idle');
    expect(window.localStorage.getItem('harmony_manual_status:user-1')).toBe('idle');
  });

  it('clears manual override when saving online status', async () => {
    window.localStorage.setItem('harmony_manual_status:user-1', 'offline');
    mockedApiClient.trpcMutation.mockResolvedValueOnce({
      id: 'user-1',
      email: 'user@example.com',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      publicProfile: true,
      status: 'ONLINE',
      createdAt: '2026-01-01T00:00:00.000Z',
      isSystemAdmin: false,
    });

    const updated = await updateCurrentUser({ status: 'online' });

    expect(updated.status).toBe('online');
    expect(window.localStorage.getItem('harmony_manual_status:user-1')).toBeNull();
  });

  it('enables presence tracking for active users even when the backend still says offline', () => {
    expect(shouldEnablePresenceTracking({ id: 'user-1', status: 'offline' })).toBe(true);
  });

  it('disables presence tracking when the current browser stored an offline override', () => {
    window.localStorage.setItem('harmony_manual_status:user-1', 'offline');

    expect(shouldEnablePresenceTracking({ id: 'user-1', status: 'offline' })).toBe(false);
  });

  it('disables presence tracking when the current browser stored an idle override', () => {
    window.localStorage.setItem('harmony_manual_status:user-1', 'idle');

    expect(shouldEnablePresenceTracking({ id: 'user-1', status: 'online' })).toBe(false);
  });

  it('disables presence tracking for dnd status', () => {
    expect(shouldEnablePresenceTracking({ id: 'user-1', status: 'dnd' })).toBe(false);
  });
});
