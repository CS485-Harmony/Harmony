/**
 * issue-497-reaction-emoji-picker.test.tsx
 *
 * Tests for issue #497: emoji picker on "Add Reaction" button in MessageItem.
 * Verifies that clicking Add Reaction opens the picker for authenticated users,
 * selecting an emoji calls the reaction API and updates local state,
 * CONFLICT errors are silently ignored, and other errors show a toast.
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

// Mock next/dynamic to render children synchronously in tests
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

// Mock EmojiPickerPopover so tests don't need to load emoji-mart's full bundle
jest.mock('@/components/channel/EmojiPickerPopover', () => ({
  EmojiPickerPopover: ({ onEmojiSelect }: { onEmojiSelect: (e: { native: string }) => void }) => (
    <div data-testid='emoji-picker'>
      <button
        type='button'
        data-testid='emoji-option'
        onClick={() => onEmojiSelect({ native: '👍' })}
      >
        👍
      </button>
    </div>
  ),
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageItem } from '@/components/message/MessageItem';
import type { Message } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockUseAuth = jest.fn();

const baseMessage: Message = {
  id: 'msg-1',
  channelId: 'channel-1',
  authorId: 'user-2',
  author: {
    id: 'user-2',
    username: 'bob',
    displayName: 'Bob',
  },
  content: 'Hello world',
  timestamp: '2026-04-28T12:00:00.000Z',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Issue #497 — MessageItem: reaction emoji picker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user-1', username: 'alice' },
    });
    mockTrpcMutation.mockResolvedValue(undefined);
  });

  it('renders the Add Reaction button for authenticated users', () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);
    expect(screen.getByRole('button', { name: 'Add Reaction' })).toBeInTheDocument();
  });

  it('Add Reaction button has aria-expanded=false initially', () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);
    const btn = screen.getByRole('button', { name: 'Add Reaction' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking Add Reaction opens the emoji picker dialog', async () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Add Reaction' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('clicking Add Reaction again closes the picker', async () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));
    });
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeInTheDocument(),
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Emoji picker' })).not.toBeInTheDocument();
    });
  });

  it('selecting an emoji calls addReaction mutation with correct args and closes picker', async () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));
    });
    await waitFor(() => expect(screen.getByTestId('emoji-option')).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByTestId('emoji-option'));
    });

    expect(mockTrpcMutation).toHaveBeenCalledWith('reaction.addReaction', {
      serverId: 'srv-1',
      channelId: 'channel-1',
      messageId: 'msg-1',
      emoji: '👍',
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Emoji picker' })).not.toBeInTheDocument();
    });
  });

  it('adds the reaction to the local reaction list after a successful API call', async () => {
    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));
    });
    await waitFor(() => expect(screen.getByTestId('emoji-option')).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByTestId('emoji-option'));
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /React with 👍/ }),
      ).toBeInTheDocument();
    });
  });

  it('silently ignores CONFLICT errors (user already reacted)', async () => {
    const conflictError = {
      response: { data: { error: { json: { code: 'CONFLICT' } } } },
    };
    mockTrpcMutation.mockRejectedValue(conflictError);

    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));
    });
    await waitFor(() => expect(screen.getByTestId('emoji-option')).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByTestId('emoji-option'));
    });

    await waitFor(() => {
      expect(mockShowToast).not.toHaveBeenCalled();
    });
  });

  it('shows a toast on non-CONFLICT errors', async () => {
    mockTrpcMutation.mockRejectedValue(new Error('Network error'));

    render(<MessageItem message={baseMessage} serverId='srv-1' />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));
    });
    await waitFor(() => expect(screen.getByTestId('emoji-option')).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByTestId('emoji-option'));
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Failed to add reaction. Please try again.',
        type: 'error',
      });
    });
  });

  it('redirects guests to login instead of opening picker', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, user: null });

    render(<MessageItem message={baseMessage} serverId='srv-1' />);
    fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));

    expect(mockPush).toHaveBeenCalledWith(
      '/auth/login?returnUrl=%2Fc%2Ftestserver%2Fgeneral',
    );
    expect(screen.queryByRole('dialog', { name: 'Emoji picker' })).not.toBeInTheDocument();
  });

  it('clicking outside the picker closes it', async () => {
    render(
      <div>
        <MessageItem message={baseMessage} serverId='srv-1' />
        <div data-testid='outside'>Outside</div>
      </div>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Reaction' }));
    });
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeInTheDocument(),
    );

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('outside'));
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Emoji picker' })).not.toBeInTheDocument();
    });
  });
});
