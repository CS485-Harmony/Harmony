import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginPage from '@/app/auth/login/page';
import { resetRequiredPassword } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

const resetRequiredMessage = 'This account must reset its password before signing in.';
const push = jest.fn();
const login = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: () => null }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/authService', () => ({
  resetRequiredPassword: jest.fn(),
}));

const mockedUseAuth = jest.mocked(useAuth);
const mockedResetRequiredPassword = jest.mocked(resetRequiredPassword);

describe('login password-reset-required flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      user: null,
      login,
      register: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn(),
      setLocalUserStatus: jest.fn(),
      isAdmin: jest.fn(() => false),
      isLoading: false,
      isAuthenticated: false,
    });
  });

  it('shows reset UI after the reset-required login error and lets the user set a new password', async () => {
    login.mockRejectedValueOnce(new Error(resetRequiredMessage)).mockResolvedValueOnce(undefined);
    mockedResetRequiredPassword.mockResolvedValueOnce(undefined);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'old-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('heading', { name: /reset your password/i })).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: { value: 'new-password-123' },
    });
    fireEvent.change(screen.getByLabelText(/^confirm new password$/i), {
      target: { value: 'new-password-123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() =>
      expect(mockedResetRequiredPassword).toHaveBeenCalledWith(
        'alice@example.com',
        'new-password-123',
      ),
    );
    await waitFor(() =>
      expect(login).toHaveBeenLastCalledWith('alice@example.com', 'new-password-123'),
    );
    expect(push).toHaveBeenCalledWith('/channels');
  });

  it('does not reset when confirmation does not match', async () => {
    login.mockRejectedValueOnce(new Error(resetRequiredMessage));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'old-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('heading', { name: /reset your password/i })).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: { value: 'new-password-123' },
    });
    fireEvent.change(screen.getByLabelText(/^confirm new password$/i), {
      target: { value: 'different-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect((await screen.findByRole('alert')).textContent).toBe('Passwords do not match.');
    expect(mockedResetRequiredPassword).not.toHaveBeenCalled();
  });
});
