/**
 * TDD — HarmonyShell passes canPin only when the user may pin (MODERATOR+)
 *
 * When the current user appears in `members` with role `member`, MessageList
 * must receive canPin={false} so the ⋯ More / Pin UI is not shown.
 *
 * Implementation will derive this from server-scoped membership (or equivalent),
 * not merely isAuthenticated.
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HarmonyShell } from '@/components/layout/HarmonyShell';
import { MessageList } from '@/components/channel/MessageList';
import { ChannelType, ChannelVisibility } from '@/types';
import type { Server, Channel, Message, User } from '@/types';

const MEMBER_USER_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

jest.mock('@/components/channel/MessageList', () => ({
  MessageList: jest.fn((props: { canPin?: boolean }) => (
    <div data-testid='message-list-stub' data-can-pin={String(props.canPin)} />
  )),
}));

jest.mock('@/components/server-rail/ServerRail', () => ({ ServerRail: () => null }));
jest.mock('@/components/channel/ChannelSidebar', () => ({ ChannelSidebar: () => null }));
jest.mock('@/components/channel/TopBar', () => ({ TopBar: () => null }));
jest.mock('@/components/channel/MembersSidebar', () => ({ MembersSidebar: () => null }));
jest.mock('@/components/channel/SearchModal', () => ({ SearchModal: () => null }));
jest.mock('@/components/channel/PinnedMessagesPanel', () => ({ PinnedMessagesPanel: () => null }));
jest.mock('@/components/channel/MessageInput', () => ({ MessageInput: () => null }));
jest.mock('@/components/channel/CreateChannelModal', () => ({ CreateChannelModal: () => null }));
jest.mock('@/components/server-rail/BrowseServersModal', () => ({ BrowseServersModal: () => null }));
jest.mock('@/components/server-rail/CreateServerModal', () => ({ CreateServerModal: () => null }));
jest.mock('@/components/channel/GuestPromoBanner', () => ({ GuestPromoBanner: () => null }));

jest.mock('@/hooks/useChannelEvents', () => ({ useChannelEvents: () => {} }));
jest.mock('@/hooks/useServerEvents', () => ({ useServerEvents: () => {} }));
jest.mock('@/hooks/useServerListSync', () => ({
  useServerListSync: () => ({
    notifyServerCreated: jest.fn(),
    notifyServerJoined: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock('@/contexts/VoiceContext', () => ({
  VoiceProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: MEMBER_USER_ID,
      username: 'memberuser',
      displayName: 'Member User',
      status: 'online' as const,
      role: 'member' as const,
    },
    isAuthenticated: true,
    isLoading: false,
    isAdmin: () => false,
  }),
}));

const SERVER_ID = '11111111-2222-3333-4444-555555555555';
const OWNER_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

const currentServer: Server = {
  id: SERVER_ID,
  name: 'Test',
  slug: 'test',
  ownerId: OWNER_ID,
  memberCount: 2,
  createdAt: new Date().toISOString(),
};

const currentChannel: Channel = {
  id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  serverId: SERVER_ID,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  visibility: ChannelVisibility.PRIVATE,
  position: 0,
  createdAt: new Date().toISOString(),
};

const sampleMessage: Message = {
  id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  channelId: currentChannel.id,
  authorId: OWNER_ID,
  author: {
    id: OWNER_ID,
    username: 'owner',
    displayName: 'Owner',
  },
  content: 'hello',
  timestamp: new Date().toISOString(),
};

const members: User[] = [
  {
    id: MEMBER_USER_ID,
    username: 'memberuser',
    displayName: 'Member User',
    status: 'online',
    role: 'member',
  },
];

const messageListSpy = MessageList as jest.MockedFunction<typeof MessageList>;

describe('HarmonyShell — canPin vs server membership role', () => {
  beforeEach(() => {
    messageListSpy.mockClear();
  });

  it('passes canPin=false to MessageList when the current user is a server member (not moderator+)', () => {
    render(
      <HarmonyShell
        servers={[currentServer]}
        currentServer={currentServer}
        channels={[currentChannel]}
        allChannels={[currentChannel]}
        currentChannel={currentChannel}
        messages={[sampleMessage]}
        members={members}
      />,
    );

    expect(messageListSpy).toHaveBeenCalled();
    expect(messageListSpy.mock.calls[0][0]).toEqual(expect.objectContaining({ canPin: false }));
  });
});
