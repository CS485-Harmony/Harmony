jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    trpcQuery: jest.fn(),
    trpcMutation: jest.fn(),
  },
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
  getAccessToken: jest.fn(() => null),
  getRefreshToken: jest.fn(() => null),
}));

jest.mock('@/lib/passwordAuth', () => ({
  derivePasswordVerifier: jest.fn(),
}));

import { apiClient, setTokens } from '@/lib/api-client';
import { derivePasswordVerifier } from '@/lib/passwordAuth';
import { login, register } from '@/services/authService';

const mockedApiClient = jest.mocked(apiClient);
const mockedSetTokens = jest.mocked(setTokens);
const mockedDerivePasswordVerifier = jest.mocked(derivePasswordVerifier);

describe('authService password transport hardening', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      .mockResolvedValueOnce({ accessToken: 'access', refreshToken: 'refresh' });

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
    expect(mockedSetTokens).toHaveBeenCalledWith('access', 'refresh');
  });

  it('requests a registration salt and never posts the raw password during signup', async () => {
    mockedApiClient.post
      .mockResolvedValueOnce({ passwordSalt: 'ffeeddccbbaa99887766554433221100' })
      .mockResolvedValueOnce({ accessToken: 'access', refreshToken: 'refresh' });

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
  });
});
