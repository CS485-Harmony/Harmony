/**
 * issue-236-pin-permissions.test.tsx
 *
 * Regression tests for Issue #236:
 * - Pin UI should be visible only to MODERATOR+ (MEMBER must not see it).
 * - FORBIDDEN pin attempts should show an actionable permission message.
 */
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TrpcHttpError } from '@/lib/trpc-errors';
import { HarmonyShell } from '@/components/layout/HarmonyShell';
import { MessageItem } from '@/components/message/MessageItem';
import { ChannelType, ChannelVisibility } from '@/types';
import type { Server, Channel, Message, User } from '@/types';
import { pinMessageAction } from '@/app/actions/pinMessage';

// ─── Global/browser shims ─────────────────────────────────────────────────────

beforeAll(() => {
  // HarmonyShell uses matchMedia via useSyncExternalStore.
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('min-width'),
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
});

// ─── Module mocks ─────────────────────────────────────────────────────────────

// Keep a mutable auth stub so each test can set it.
let mockAuthState: {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: (serverOwnerId?: string) => boolean;
} = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isAdmin: () => false,
};

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock('@/hooks/useChannelEvents', () => ({
  useChannelEvents: () => undefined,
}));
jest.mock('@/hooks/useServerEvents', () => ({
  useServerEvents: () => undefined,
}));
jest.mock('@/hooks/useServerListSync', () => ({
  useServerListSync: () => ({ notifyServerCreated: jest.fn(), notifyServerJoined: jest.fn() }),
}));

// Prevent unrelated UI from complicating these unit tests.
jest.mock('@/contexts/VoiceContext', () => ({
  VoiceProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/channel/TopBar', () => ({
  TopBar: () => <div data-testid='TopBar' />,
}));
jest.mock('@/components/channel/MembersSidebar', () => ({
  MembersSidebar: () => <div data-testid='MembersSidebar' />,
}));
jest.mock('@/components/channel/SearchModal', () => ({
  SearchModal: () => null,
}));
jest.mock('@/components/channel/PinnedMessagesPanel', () => ({
  PinnedMessagesPanel: () => null,
}));
jest.mock('@/components/channel/ChannelSidebar', () => ({
  ChannelSidebar: () => <div data-testid='ChannelSidebar' />,
}));
jest.mock('@/components/channel/MessageInput', () => ({
  MessageInput: () => <div data-testid='MessageInput' />,
}));
jest.mock('@/components/server-rail/ServerRail', () => ({
  ServerRail: () => <div data-testid='ServerRail' />,
}));
jest.mock('@/components/channel/GuestPromoBanner', () => ({
  GuestPromoBanner: () => null,
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

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img alt='' {...props} />,
}));

jest.mock('@/app/actions/pinMessage', () => ({
  pinMessageAction: jest.fn(),
  unpinMessageAction: jest.fn(),
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const SERVER: Server = {
  id: '660e8400-e29b-41d4-a716-446655440001',
  name: 'Test Server',
  slug: 'test-server',
  ownerId: 'user-owner',
  createdAt: '2026-03-25T00:00:00.000Z',
};

const CHANNEL: Channel = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  serverId: SERVER.id,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  visibility: ChannelVisibility.PRIVATE,
  position: 0,
  createdAt: '2026-03-25T00:00:00.000Z',
};

const MEMBER_USER: User = {
  id: 'user-member',
  username: 'member',
  displayName: 'Member',
  status: 'online',
  role: 'member',
};

const MESSAGE: Message = {
  id: 'msg-001',
  channelId: CHANNEL.id,
  authorId: MEMBER_USER.id,
  author: { id: MEMBER_USER.id, username: MEMBER_USER.username, displayName: MEMBER_USER.displayName },
  content: 'Hello',
  timestamp: '2026-03-25T00:00:00.000Z',
  pinned: false,
  attachments: [],
  reactions: [],
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Test 2A: Visibility gating ───────────────────────────────────────────────

describe('Issue #236 — pin UI visibility', () => {
  it('does not render "More actions" (pin menu) for an authenticated MEMBER', () => {
    mockAuthState = {
      user: { ...MEMBER_USER, role: 'member' },
      isAuthenticated: true,
      isLoading: false,
      isAdmin: () => false,
    };

    render(
      <HarmonyShell
        servers={[SERVER]}
        currentServer={SERVER}
        channels={[CHANNEL]}
        allChannels={[CHANNEL]}
        currentChannel={CHANNEL}
        messages={[MESSAGE]}
        members={[{ ...MEMBER_USER, role: 'member' }]}
        basePath='/channels'
      />,
    );

    // Oracle: MEMBER must not see pin UI at all.
    expect(screen.queryByRole('button', { name: /more actions/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/pin message/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/unpin message/i)).not.toBeInTheDocument();
  });
});

// ─── Test 2B: FORBIDDEN error message ─────────────────────────────────────────

describe('Issue #236 — pin error messages', () => {
  it('shows a permission-specific message when pin fails with FORBIDDEN (403)', async () => {
    (pinMessageAction as unknown as jest.Mock).mockRejectedValueOnce(
      new TrpcHttpError('message.pinMessage', 403, '{"error":"FORBIDDEN"}'),
    );

    render(<MessageItem message={MESSAGE} canPin={true} serverId={SERVER.id} />);

    // Open ⋯ dropdown and click "Pin Message"
    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /pin message/i }));
    });

    // Oracle: permission errors must be actionable (not generic "Failed").
    expect(
      await screen.findByText(/you don't have permission to pin messages/i),
    ).toBeInTheDocument();
  });
});

