/**
 * VisibilityGuard.test.tsx — Issue #240
 *
 * Ensures that authenticated users who lack access to a PRIVATE channel see
 * a permission-denied message rather than "Sign up or log in" copy.
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisibilityGuard } from '../components/channel/VisibilityGuard';
import { ChannelVisibility } from '../types';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: jest.fn() }),
  usePathname: () => '/test-server/general',
}));

const mockUseAuth = jest.fn();

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderGuard(overrides?: Partial<Parameters<typeof VisibilityGuard>[0]>) {
  return render(
    <VisibilityGuard visibility={ChannelVisibility.PRIVATE} {...overrides}>
      <div>Channel content</div>
    </VisibilityGuard>,
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe('VisibilityGuard — unauthenticated user on PRIVATE channel', () => {
  it('shows "Sign up or log in" message', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isAdmin: () => false,
    });

    renderGuard();

    expect(screen.getByText(/sign up or log in/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  it('does not show the channel content', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isAdmin: () => false,
    });

    renderGuard();

    expect(screen.queryByText('Channel content')).not.toBeInTheDocument();
  });
});

describe('VisibilityGuard — authenticated non-admin on PRIVATE channel', () => {
  it('does NOT show "Sign up or log in" message', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: () => false,
    });

    renderGuard({ isServerAdmin: false });

    expect(screen.queryByText(/sign up or log in/i)).not.toBeInTheDocument();
  });

  it('shows a permission-denied message', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: () => false,
    });

    renderGuard({ isServerAdmin: false });

    expect(screen.getByText(/you don't have permission/i)).toBeInTheDocument();
  });

  it('does not show login or signup CTAs', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: () => false,
    });

    renderGuard({ isServerAdmin: false });

    expect(screen.queryByRole('link', { name: /create account/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /log in/i })).not.toBeInTheDocument();
  });

  it('does not show the channel content', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: () => false,
    });

    renderGuard({ isServerAdmin: false });

    expect(screen.queryByText('Channel content')).not.toBeInTheDocument();
  });
});

describe('VisibilityGuard — authenticated admin on PRIVATE channel', () => {
  it('renders children for a server admin', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: () => false,
    });

    renderGuard({ isServerAdmin: true });

    expect(screen.getByText('Channel content')).toBeInTheDocument();
  });

  it('renders children for a system admin (isAdmin returns true)', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      isAdmin: () => true,
    });

    renderGuard({ isServerAdmin: false });

    expect(screen.getByText('Channel content')).toBeInTheDocument();
  });
});

describe('VisibilityGuard — public channels', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      isAdmin: () => false,
    });
  });

  it('renders children for PUBLIC_INDEXABLE', () => {
    renderGuard({ visibility: ChannelVisibility.PUBLIC_INDEXABLE });
    expect(screen.getByText('Channel content')).toBeInTheDocument();
  });

  it('renders children for PUBLIC_NO_INDEX', () => {
    renderGuard({ visibility: ChannelVisibility.PUBLIC_NO_INDEX });
    expect(screen.getByText('Channel content')).toBeInTheDocument();
  });
});
