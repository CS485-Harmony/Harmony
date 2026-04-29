/**
 * issue-505-reaction-toggle.test.tsx
 *
 * Tests for issue #505: wiring addReaction / removeReaction on reaction pills.
 * Clicking a reaction pill the user has not yet reacted to calls addReaction.
 * Clicking a reaction pill the user has already reacted to calls removeReaction.
 * Count updates optimistically; errors revert the count and show a toast.
 * Guests clicking a pill are redirected to login.
 */

// ─── Module-level mock variables ─────────────────────────────────────────────

const mockTrpcMutation = jest.fn();
const mockShowToast = jest.fn();
const mockPush = jest.fn();

// ─── Jest module mocks ────────────────────────────────────────────────────────

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    trpcMutation: (...args: unknown[]) => mockTrpcMutation(...args),
  },
}));

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/c/testserver/general',
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/app/actions/pinMessage', () => ({
  pinMessageAction: jest.fn(),
  unpinMessageAction: jest.fn(),
}));

jest.mock('@/app/actions/editMessage', () => ({
  editMessageAction: jest.fn(),
}));

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFn: () => Promise<{ default: React.ComponentType<unknown> }>) => {
    let ResolvedComponent: React.ComponentType<unknown> | null = null;
    const DynamicWrapper = (props: Record<string, unknown>) => {
      if (!ResolvedComponent) return null;
      return <ResolvedComponent {...props} />;
    };
    importFn().then(mod => {
      ResolvedComponent = mod.default;
    });
    return DynamicWrapper;
  },
}));

jest.mock('@/components/channel/EmojiPickerPopover', () => ({
  EmojiPickerPopover: () => <div data-testid='emoji-picker' />,
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageItem } from '@/components/message/MessageItem';
import type { Message } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockUseAuth = jest.fn();

const CURRENT_USER_ID = 'user-1';
const OTHER_USER_ID = 'user-2';

const baseMessage: Message = {
  id: 'msg-1',
  channelId: 'channel-1',
  authorId: OTHER_USER_ID,
  author: { id: OTHER_USER_ID, username: 'bob', displayName: 'Bob' },
  content: 'Hello world',
  timestamp: '2026-04-28T12:00:00.000Z',
  reactions: [
    { emoji: '👍', count: 2, userIds: [OTHER_USER_ID, 'user-3'] },
    { emoji: '❤️', count: 1, userIds: [CURRENT_USER_ID] },
  ],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Issue #505 — reaction pill toggle (addReaction / removeReaction)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: CURRENT_USER_ID, username: 'alice' },
    });
    mockTrpcMutation.mockResolvedValue(undefined);
  });

  it('renders existing reaction pills', () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);
    expect(screen.getByRole('button', { name: /React with 👍/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /React with ❤️/ })).toBeInTheDocument();
  });

  it('marks reactions the current user has already made as pressed', () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);
    expect(screen.getByRole('button', { name: /React with ❤️/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /React with 👍/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('clicking an unreacted pill calls addReaction with correct args', async () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /React with 👍/ }));
    });

    expect(mockTrpcMutation).toHaveBeenCalledWith('reaction.addReaction', {
      serverId: 'srv-1',
      channelId: 'channel-1',
      messageId: 'msg-1',
      emoji: '👍',
    });
  });

  it('clicking an unreacted pill optimistically increments the count', async () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /React with 👍/ }));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /React with 👍/ })).toHaveTextContent('3');
    });
  });

  it('clicking an already-reacted pill calls removeReaction with correct args', async () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /React with ❤️/ }));
    });

    expect(mockTrpcMutation).toHaveBeenCalledWith('reaction.removeReaction', {
      serverId: 'srv-1',
      channelId: 'channel-1',
      messageId: 'msg-1',
      emoji: '❤️',
    });
  });

  it('clicking an already-reacted pill optimistically decrements the count', async () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /React with ❤️/ }));
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /React with ❤️/ })).not.toBeInTheDocument();
    });
  });

  it('reverts add and shows toast on non-CONFLICT API error', async () => {
    mockTrpcMutation.mockRejectedValue(new Error('Network error'));

    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /React with 👍/ }));
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Failed to add reaction. Please try again.',
        type: 'error',
      });
    });
    // count reverted back to 2
    expect(screen.getByRole('button', { name: /React with 👍/ })).toHaveTextContent('2');
  });

  it('reverts remove and shows toast on API error', async () => {
    mockTrpcMutation.mockRejectedValue(new Error('Network error'));

    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /React with ❤️/ }));
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Failed to remove reaction. Please try again.',
        type: 'error',
      });
    });
    // reaction restored
    expect(screen.getByRole('button', { name: /React with ❤️/ })).toBeInTheDocument();
  });

  it('silently keeps optimistic add on CONFLICT (user already reacted)', async () => {
    const conflictError = { response: { data: { error: { json: { code: 'CONFLICT' } } } } };
    mockTrpcMutation.mockRejectedValue(conflictError);

    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /React with 👍/ }));
    });

    await waitFor(() => expect(mockTrpcMutation).toHaveBeenCalled());
    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it('redirects guests to login when clicking a reaction pill', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });

    render(<MessageItem message={baseMessage} serverId='srv-1' />);
    fireEvent.click(screen.getByRole('button', { name: /React with 👍/ }));

    expect(mockPush).toHaveBeenCalledWith(
      '/auth/login?returnUrl=%2Fc%2Ftestserver%2Fgeneral',
    );
    expect(mockTrpcMutation).not.toHaveBeenCalled();
  });
});
