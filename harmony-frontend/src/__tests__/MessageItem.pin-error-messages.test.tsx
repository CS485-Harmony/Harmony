/**
 * TDD — Pin failure feedback in MessageItem
 *
 * On FORBIDDEN (HTTP 403 / message:pin), the user should see a clear permission message.
 * Other failures should show a generic retry message — not a bare "Failed".
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MessageItem } from '@/components/message/MessageItem';
import { TrpcHttpError } from '@/lib/trpc-errors';

const mockPinMessageAction = jest.fn();

jest.mock('@/app/actions/pinMessage', () => ({
  pinMessageAction: (...args: unknown[]) => mockPinMessageAction(...args),
  unpinMessageAction: jest.fn(),
}));

const SERVER_ID = '11111111-2222-3333-4444-555555555555';

const baseMessage = {
  id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  channelId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  authorId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  author: {
    id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    username: 'author',
    displayName: 'Author',
  },
  content: 'hello',
  timestamp: new Date().toISOString(),
  pinned: false,
};

describe('MessageItem — pin error messages', () => {
  beforeEach(() => {
    mockPinMessageAction.mockReset();
  });

  it('shows a permission-specific message when pin fails with 403 Forbidden', async () => {
    const user = userEvent.setup();
    mockPinMessageAction.mockRejectedValue(
      new TrpcHttpError('message.pinMessage', 403, JSON.stringify({ error: { message: 'FORBIDDEN' } })),
    );

    render(<MessageItem message={baseMessage} canPin serverId={SERVER_ID} />);

    await user.click(screen.getByRole('button', { name: 'More actions' }));
    await user.click(screen.getByRole('button', { name: /pin message/i }));

    await waitFor(() => {
      expect(screen.getByText("You don't have permission to pin messages.")).toBeInTheDocument();
    });
  });
});
