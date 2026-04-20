import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HarmonyShell } from '@/components/layout/HarmonyShell';
import { ChannelType, ChannelVisibility } from '@/types';
import type { Channel, Message, Server, User } from '@/types';

const mockUseAuth = jest.fn();
const mockUseServerEvents = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/contexts/VoiceContext', () => ({
  VoiceProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/hooks/useServerEvents', () => ({
  useServerEvents: (options: unknown) => mockUseServerEvents(options),
}));

jest.mock('@/hooks/useServerListSync', () => ({
  useServerListSync: () => ({
    notifyServerCreated: jest.fn(),
    notifyServerJoined: jest.fn(),
  }),
}));

jest.mock('@/components/server-rail/ServerRail', () => ({
  ServerRail: () => <div>Server rail</div>,
}));

jest.mock('@/components/channel/ChannelSidebar', () => ({
  ChannelSidebar: () => <div>Channel sidebar</div>,
}));

jest.mock('@/components/channel/TopBar', () => ({
  TopBar: ({
    onSearchOpen,
    onPinsOpen,
    disableMessageActions,
  }: {
    onSearchOpen?: () => void;
    onPinsOpen?: () => void;
    disableMessageActions?: boolean;
  }) => (
    <div>
      <div>Top bar</div>
      <button onClick={onSearchOpen} disabled={disableMessageActions}>
        Search
      </button>
      <button onClick={onPinsOpen} disabled={disableMessageActions}>
        Pinned messages
      </button>
    </div>
  ),
}));

jest.mock('@/components/channel/MessageList', () => ({
  MessageList: () => <div>Message list</div>,
}));

jest.mock('@/components/channel/MessageInput', () => ({
  MessageInput: () => <div>Message input</div>,
}));

jest.mock('@/components/channel/MembersSidebar', () => ({
  MembersSidebar: () => <div>Members sidebar</div>,
}));

jest.mock('@/components/channel/PinnedMessagesPanel', () => ({
  PinnedMessagesPanel: () => <div>Pinned messages panel</div>,
}));

jest.mock('@/components/channel/GuestPromoBanner', () => ({
  GuestPromoBanner: () => <div>Guest promo banner</div>,
}));

jest.mock('@/components/channel/CreateChannelModal', () => ({
  CreateChannelModal: () => null,
}));

jest.mock('@/components/server-rail/BrowseServersModal', () => ({
  BrowseServersModal: () => null,
}));

jest.mock('@/components/server-rail/CreateServerModal', () => ({
  CreateServerModal: () => null,
}));

jest.mock('@/components/channel/SearchModal', () => ({
  SearchModal: () => <div>Search modal</div>,
}));

const server: Server = {
  id: 'server-1',
  name: 'Product',
  slug: 'product',
  ownerId: 'owner-1',
  memberCount: 3,
  createdAt: '2026-04-16T12:00:00.000Z',
};

const channel: Channel = {
  id: 'channel-1',
  name: 'Roadmap',
  slug: 'roadmap',
  serverId: 'server-1',
  type: ChannelType.TEXT,
  visibility: ChannelVisibility.PRIVATE,
  position: 0,
  createdAt: '2026-04-16T12:00:00.000Z',
};

const members: User[] = [
  {
    id: 'member-1',
    username: 'alex',
    displayName: 'Alex',
    status: 'online',
    role: 'member',
  },
];

const messages: Message[] = [
  {
    id: 'message-1',
    channelId: 'channel-1',
    authorId: 'member-1',
    author: { id: 'member-1', username: 'alex' },
    content: 'Hello',
    timestamp: '2026-04-16T12:00:00.000Z',
  },
];

function renderShell(overrides?: Partial<React.ComponentProps<typeof HarmonyShell>>) {
  return render(
    <HarmonyShell
      servers={[server]}
      currentServer={server}
      channels={[channel]}
      allChannels={[channel]}
      currentChannel={channel}
      messages={messages}
      members={members}
      {...overrides}
    />,
  );
}

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      matches: true,
      media: '(min-width: 640px)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isAdmin: () => false,
  });
});

describe('Issue #338 — private channel denial keeps the shell mounted', () => {
  it('renders the standard shell by default', () => {
    renderShell();

    expect(screen.getByText('Server rail')).toBeInTheDocument();
    expect(screen.getByText('Channel sidebar')).toBeInTheDocument();
    expect(screen.getByText('Top bar')).toBeInTheDocument();
    expect(screen.getByText('Message list')).toBeInTheDocument();
    expect(screen.getByText('Message input')).toBeInTheDocument();
  });

  it('replaces only the message pane when a locked private-channel pane is supplied', () => {
    renderShell({
      lockedMessagePane: <div>Private channel lock panel</div>,
    });

    expect(screen.getByText('Server rail')).toBeInTheDocument();
    expect(screen.getByText('Channel sidebar')).toBeInTheDocument();
    expect(screen.getByText('Top bar')).toBeInTheDocument();
    expect(screen.getByText('Private channel lock panel')).toBeInTheDocument();
    expect(screen.queryByText('Message list')).not.toBeInTheDocument();
    expect(screen.queryByText('Message input')).not.toBeInTheDocument();
    expect(screen.queryByText('Pinned messages panel')).not.toBeInTheDocument();
    expect(screen.queryByText('Search modal')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Pinned messages' })).toBeDisabled();
    // Message callbacks must be undefined when the channel is locked so stale
    // real-time messages do not accumulate in locked state.
    expect(mockUseServerEvents).toHaveBeenCalledWith(
      expect.objectContaining({
        onMessageCreated: undefined,
        onMessageEdited: undefined,
        onMessageDeleted: undefined,
      }),
    );
  });
});
