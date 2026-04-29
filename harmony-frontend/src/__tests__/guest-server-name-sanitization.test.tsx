import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GuestHeader } from '@/components/channel/GuestHeader';
import { GuestPromoBanner } from '@/components/channel/GuestPromoBanner';

const mockUseAuth = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/c/admin/general',
}));

describe('guest server name sanitization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: () => false,
    });
  });

  it('sanitizes the guest header server label', () => {
    render(
      <GuestHeader
        server={{
          id: 'server-1',
          name: '../../../admin',
          slug: 'admin',
          createdAt: '2026-04-28T00:00:00.000Z',
        }}
      />,
    );

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.queryByText('../../../admin')).not.toBeInTheDocument();
  });

  it('sanitizes the guest promo banner label and avatar initial', () => {
    render(<GuestPromoBanner serverName='../../../admin' memberCount={2} />);

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.queryByText('../../../admin')).not.toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
