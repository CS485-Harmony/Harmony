import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import * as authService from '@/services/authService';
import { usePresenceTracker } from '@/hooks/usePresenceTracker';

jest.mock('@/services/authService', () => ({
  __esModule: true,
  getCurrentUser: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  updateCurrentUser: jest.fn(),
  setCurrentUser: jest.fn(),
  isAuthenticated: jest.fn(),
  shouldEnablePresenceTracking: jest.fn(),
}));

jest.mock('@/hooks/usePresenceTracker', () => ({
  __esModule: true,
  usePresenceTracker: jest.fn(),
}));

jest.mock('@/lib/api-client', () => ({
  getAccessToken: jest.fn(() => null),
}));

jest.mock('@/app/actions/session', () => ({
  setSessionCookie: jest.fn(),
  clearSessionCookie: jest.fn(),
}));

const mockedAuthService = jest.mocked(authService);
const mockedUsePresenceTracker = jest.mocked(usePresenceTracker);

function AuthStatusProbe() {
  const { user, isLoading } = useAuth();

  return (
    <div>
      <span data-testid='loading'>{String(isLoading)}</span>
      <span data-testid='status'>{user?.status ?? 'none'}</span>
    </div>
  );
}

describe('AuthProvider presence tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthService.getCurrentUser.mockResolvedValue({
      id: 'user-1',
      username: 'alice',
      displayName: 'Alice',
      status: 'offline',
      role: 'member',
      isSystemAdmin: false,
    });
    mockedAuthService.shouldEnablePresenceTracking.mockImplementation(
      user => user?.id === 'user-1' && user.status === 'offline',
    );
    mockedUsePresenceTracker.mockImplementation((enabled, onStatusChanged) => {
      React.useEffect(() => {
        if (enabled) onStatusChanged?.('online');
      }, [enabled, onStatusChanged]);
    });
  });

  it('marks an authenticated offline session online once global presence tracking starts', async () => {
    render(
      <AuthProvider>
        <AuthStatusProbe />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('online'));
    expect(mockedAuthService.shouldEnablePresenceTracking).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'user-1', status: 'offline' }),
    );
  });
});
