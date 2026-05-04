import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { ReactNode } from 'react';
import { ChannelSidebar } from '@/components/channel/ChannelSidebar';
import { ChannelType, ChannelVisibility } from '@/types';
import type { User } from '@/types';

const mockReplace = jest.fn();
const mockRefresh = jest.fn();
const mockShowToast = jest.fn();
const mockTrpcMutation = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    trpcMutation: (...args: unknown[]) => mockTrpcMutation(...args),
  },
}));

jest.mock('@/contexts/VoiceContext', () => ({
  useVoiceOptional: () => null,
}));

jest.mock('@/components/channel/UserStatusBar', () => ({
  UserStatusBar: () => <div data-testid='user-status' />,
}));

const baseServer = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'MEEE',
  slug: 'meee',
  ownerId: 'owner-1',
  createdAt: new Date().toISOString(),
};

const baseChannel = {
  id: '22222222-2222-4222-8222-222222222222',
  serverId: baseServer.id,
  name: 'general',
  slug: 'general',
  topic: '',
  type: ChannelType.TEXT,
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
  createdAt: new Date().toISOString(),
};

const voiceChannel = {
  ...baseChannel,
  id: '33333333-3333-4333-8333-333333333333',
  name: 'Voice',
  slug: 'voice',
  type: ChannelType.VOICE,
};

const baseUser: User = {
  id: 'member-1',
  username: 'member',
  status: 'online' as const,
  role: 'member' as const,
  isSystemAdmin: false,
};

function renderSidebar(
  userOverrides: Partial<typeof baseUser> = {},
  isAuthenticated = true,
  options: {
    channels?: (typeof baseChannel)[];
    onCreateChannel?: (defaultType: ChannelType) => void;
  } = {},
) {
  return render(
    <ChannelSidebar
      server={baseServer}
      channels={options.channels ?? [baseChannel]}
      currentChannelId={baseChannel.id}
      currentUser={{ ...baseUser, ...userOverrides }}
      isOpen
      onClose={() => {}}
      isAuthenticated={isAuthenticated}
      serverId={baseServer.id}
      members={[]}
      onCreateChannel={options.onCreateChannel}
    />,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ChannelSidebar server menu', () => {
  it('shows server settings for admin users', () => {
    renderSidebar({ role: 'admin' });

    fireEvent.click(screen.getByRole('button', { name: /open server menu/i }));

    expect(screen.getByRole('menuitem', { name: /server settings/i })).toBeInTheDocument();
  });

  it('shows channel management entrypoints for server admin users', () => {
    const onCreateChannel = jest.fn();
    renderSidebar({ role: 'admin' }, true, {
      channels: [baseChannel, voiceChannel],
      onCreateChannel,
    });

    expect(screen.getByRole('button', { name: /add text channel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add voice channel/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings for general/i })).toHaveAttribute(
      'href',
      '/settings/meee/general',
    );
    expect(screen.getByRole('link', { name: /settings for voice/i })).toHaveAttribute(
      'href',
      '/settings/meee/voice',
    );
  });

  it('hides server settings for non-admin users', () => {
    renderSidebar();

    fireEvent.click(screen.getByRole('button', { name: /open server menu/i }));

    expect(screen.queryByRole('menuitem', { name: /server settings/i })).not.toBeInTheDocument();
  });

  it('hides channel management entrypoints for non-admin users', () => {
    renderSidebar({}, true, {
      channels: [baseChannel, voiceChannel],
      onCreateChannel: jest.fn(),
    });

    expect(screen.queryByRole('button', { name: /add text channel/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add voice channel/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /settings for general/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /settings for voice/i })).not.toBeInTheDocument();
  });

  it('shows leave flow and redirects after successful leave', async () => {
    mockTrpcMutation.mockResolvedValue(undefined);
    renderSidebar();

    fireEvent.click(screen.getByRole('button', { name: /open server menu/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /leave server/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^leave server$/i }));

    await waitFor(() => {
      expect(mockTrpcMutation).toHaveBeenCalledWith('serverMember.leaveServer', {
        serverId: baseServer.id,
      });
      expect(mockReplace).toHaveBeenCalledWith('/channels');
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith({ message: 'You left MEEE.', type: 'success' });
    });
  });

  it('shows error toast when leave fails', async () => {
    mockTrpcMutation.mockRejectedValue(new Error('Server owner cannot leave'));
    renderSidebar();

    fireEvent.click(screen.getByRole('button', { name: /open server menu/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /leave server/i }));
    fireEvent.click(screen.getByRole('button', { name: /^leave server$/i }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Server owner cannot leave',
        type: 'error',
      });
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('hides leave server for owner role', () => {
    renderSidebar({ role: 'owner', id: baseServer.ownerId });

    fireEvent.click(screen.getByRole('button', { name: /open server menu/i }));

    expect(screen.queryByRole('menuitem', { name: /leave server/i })).not.toBeInTheDocument();
  });

  it('hides leave server for guest role even with non-guest id', () => {
    renderSidebar({ role: 'guest', id: '99999999-9999-4999-8999-999999999999' });

    fireEvent.click(screen.getByRole('button', { name: /open server menu/i }));

    expect(screen.queryByRole('menuitem', { name: /leave server/i })).not.toBeInTheDocument();
  });
});
