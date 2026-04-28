import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageItem } from '@/components/message/MessageItem';
import type { Message } from '@/types';

const mockUseAuth = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/c/testserver/new-channel',
  useRouter: () => ({ push: jest.fn() }),
}));

const baseMessage: Message = {
  id: 'msg-1',
  channelId: 'channel-1',
  authorId: 'user-1',
  author: {
    id: 'user-1',
    username: 'alice',
    displayName: 'Alice',
  },
  content: 'Public channel message',
  timestamp: '2026-04-28T12:00:00.000Z',
};

describe('MessageItem guest actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render Reply or Add Reaction controls for guest users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<MessageItem message={baseMessage} />);

    expect(screen.queryByRole('button', { name: 'Reply' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add Reaction' })).not.toBeInTheDocument();
  });

  it('keeps Reply and Add Reaction controls available for authenticated users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
    });

    render(<MessageItem message={baseMessage} />);

    expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Reaction' })).toBeInTheDocument();
  });
});
