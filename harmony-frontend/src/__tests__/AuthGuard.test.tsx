import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockReplace = jest.fn();
const mockUseAuth = jest.fn();
let mockSearchParams = new URLSearchParams('');

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/channels/server-1/general',
  useSearchParams: () => mockSearchParams,
}));

// Import after mocks are set up
import { AuthGuard } from '@/components/layout/AuthGuard';

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams('');
  });

  it('suppresses children while loading', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    render(
      <AuthGuard>
        <span data-testid="protected">Protected content</span>
      </AuthGuard>
    );

    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('renders children when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    render(
      <AuthGuard>
        <span data-testid="protected">Protected content</span>
      </AuthGuard>
    );

    expect(screen.getByTestId('protected')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects to login when unauthenticated and not loading', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    render(
      <AuthGuard>
        <span data-testid="protected">Protected content</span>
      </AuthGuard>
    );

    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith(
      '/auth/login?returnUrl=%2Fchannels%2Fserver-1%2Fgeneral'
    );
  });

  it('preserves query params in the returnUrl', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });
    mockSearchParams = new URLSearchParams('highlight=123');

    render(
      <AuthGuard>
        <span data-testid="protected">Protected content</span>
      </AuthGuard>
    );

    expect(mockReplace).toHaveBeenCalledWith(
      '/auth/login?returnUrl=%2Fchannels%2Fserver-1%2Fgeneral%3Fhighlight%3D123'
    );
  });
});
