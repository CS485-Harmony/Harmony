/**
 * NotificationBell.test.tsx — Issue #574
 *
 * Covers:
 *   - Single mark-as-read: clicking ✓ calls the correct mutation and marks the
 *     notification as read in the UI.
 *   - Bulk mark-as-read: clicking "Mark all as read" calls the correct mutation
 *     and marks every notification as read in the UI.
 *   - Unread badge/count reflects changes for both flows.
 *   - Silent mutation failure leaves the UI unchanged (no crash, no phantom read).
 */

// ─── Module-level mock variables ─────────────────────────────────────────────

const mockTrpcQuery = jest.fn();
const mockTrpcMutation = jest.fn();

// ─── Jest module mocks ────────────────────────────────────────────────────────

jest.mock('@/lib/api-client', () => ({
  apiClient: {
    trpcQuery: (...args: unknown[]) => mockTrpcQuery(...args),
    trpcMutation: (...args: unknown[]) => mockTrpcMutation(...args),
  },
  getAccessToken: () => null,
  fetchSseTicket: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationBell } from '@/components/channel/NotificationBell';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER_ID = '00000000-0000-0000-0000-000000000001';

const makeNotification = (id: string, read: boolean) => ({
  id,
  type: 'mention',
  messageId: `msg-${id}`,
  channelId: 'channel-1',
  serverId: 'server-1',
  read,
  createdAt: new Date().toISOString(),
  message: {
    id: `msg-${id}`,
    content: `Hello @user from ${id}`,
    isDeleted: false,
    author: { id: 'author-1', username: 'alice', displayName: 'Alice', avatarUrl: null },
  },
});

const unread1 = makeNotification('notif-1111-1111-1111-111111111111', false);
const unread2 = makeNotification('notif-2222-2222-2222-222222222222', false);
const alreadyRead = makeNotification('notif-3333-3333-3333-333333333333', true);

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function renderOpenBell(notifications = [unread1, unread2, alreadyRead]) {
  mockTrpcQuery.mockResolvedValueOnce(notifications);
  const utils = render(<NotificationBell userId={USER_ID} />);

  // Wait for the async load to complete
  await waitFor(() => expect(mockTrpcQuery).toHaveBeenCalledWith('notification.getNotifications'));

  // Open the panel
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /notifications/i }));
  });

  return utils;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('NotificationBell — mark-as-read flows (Issue #574)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrpcMutation.mockResolvedValue({ count: 1 });
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  it('shows the unread badge with correct count on initial load', async () => {
    await renderOpenBell();
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('hides the unread badge when all notifications are read', async () => {
    await renderOpenBell([alreadyRead]);
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it('renders "Mark all as read" button only when there are unread notifications', async () => {
    await renderOpenBell();
    expect(screen.getByRole('button', { name: /mark all as read/i })).toBeInTheDocument();
  });

  it('does not render "Mark all as read" when all are already read', async () => {
    await renderOpenBell([alreadyRead]);
    expect(screen.queryByRole('button', { name: /mark all as read/i })).not.toBeInTheDocument();
  });

  // ── Single mark-as-read ───────────────────────────────────────────────────

  it('calls markAsRead mutation with the correct notificationId', async () => {
    await renderOpenBell();

    const [firstCheckmark] = screen.getAllByTitle('Mark as read');
    await act(async () => {
      fireEvent.click(firstCheckmark);
    });

    await waitFor(() =>
      expect(mockTrpcMutation).toHaveBeenCalledWith('notification.markAsRead', {
        notificationId: unread1.id,
      }),
    );
  });

  it('removes the unread highlight and ✓ button after marking a single notification read', async () => {
    await renderOpenBell();

    const checkmarks = screen.getAllByTitle('Mark as read');
    await act(async () => {
      fireEvent.click(checkmarks[0]);
    });

    await waitFor(() => {
      // The first ✓ button should be gone (notification is now read)
      expect(screen.getAllByTitle('Mark as read')).toHaveLength(1);
    });
  });

  it('decrements the unread badge count by 1 after single mark-as-read', async () => {
    await renderOpenBell();
    expect(screen.getByText('2')).toBeInTheDocument();

    const [firstCheckmark] = screen.getAllByTitle('Mark as read');
    await act(async () => {
      fireEvent.click(firstCheckmark);
    });

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('leaves the notification unread when the markAsRead mutation fails', async () => {
    mockTrpcMutation.mockRejectedValue(new Error('Network error'));
    await renderOpenBell();

    const [firstCheckmark] = screen.getAllByTitle('Mark as read');
    await act(async () => {
      fireEvent.click(firstCheckmark);
    });

    // Badge and ✓ buttons should be unchanged
    await waitFor(() => {
      expect(screen.getAllByTitle('Mark as read')).toHaveLength(2);
    });
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  // ── Bulk mark-all-as-read ─────────────────────────────────────────────────

  it('calls markAllAsRead mutation when "Mark all as read" is clicked', async () => {
    await renderOpenBell();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /mark all as read/i }));
    });

    await waitFor(() =>
      expect(mockTrpcMutation).toHaveBeenCalledWith('notification.markAllAsRead'),
    );
  });

  it('removes all unread indicators after bulk mark-as-read', async () => {
    await renderOpenBell();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /mark all as read/i }));
    });

    await waitFor(() => {
      expect(screen.queryByTitle('Mark as read')).not.toBeInTheDocument();
    });
  });

  it('resets the unread badge to zero after bulk mark-as-read', async () => {
    await renderOpenBell();
    expect(screen.getByText('2')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /mark all as read/i }));
    });

    await waitFor(() => {
      expect(screen.queryByText('2')).not.toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  it('hides "Mark all as read" button after all notifications are marked read', async () => {
    await renderOpenBell();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /mark all as read/i }));
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /mark all as read/i })).not.toBeInTheDocument();
    });
  });

  it('leaves all notifications unread when the markAllAsRead mutation fails', async () => {
    mockTrpcMutation.mockRejectedValue(new Error('Network error'));
    await renderOpenBell();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /mark all as read/i }));
    });

    await waitFor(() => {
      expect(screen.getAllByTitle('Mark as read')).toHaveLength(2);
    });
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
