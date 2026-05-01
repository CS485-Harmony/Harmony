/**
 * issue-563-reply-button-focus.test.tsx
 *
 * Regression tests for issue #563: clicking the reply button must focus
 * the MessageInput textarea so the user can type immediately.
 *
 * Follows the pattern in issue-238-message-input-aria-label.test.tsx —
 * render MessageInput in isolation, use rerender to simulate prop changes,
 * and assert with toHaveFocus().
 */

const mockSendMessageAction = jest.fn();
const mockCreateReplyAction = jest.fn();

jest.mock('@/app/actions/sendMessage', () => ({
  sendMessageAction: mockSendMessageAction,
}));

jest.mock('@/app/actions/createReply', () => ({
  createReplyAction: mockCreateReplyAction,
}));

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageInput } from '../components/channel/MessageInput';
import type { Message } from '@/types';

const defaultProps = {
  channelId: 'ch-1',
  channelName: 'general',
  serverId: 'srv-1',
};

const fakeMessage: Message = {
  id: 'msg-1',
  channelId: 'ch-1',
  authorId: 'user-1',
  author: { id: 'user-1', username: 'alice' },
  content: 'Hello world',
  timestamp: new Date().toISOString(),
  attachments: [],
};

describe('Issue #563 — Reply button focuses MessageInput textarea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('focuses the textarea when replyingTo transitions from null → message', () => {
    const { rerender } = render(<MessageInput {...defaultProps} replyingTo={null} />);

    const textarea = screen.getByRole('textbox', { name: 'Message #general' });
    // Blur to simulate the user clicking elsewhere before hitting Reply
    textarea.blur();
    expect(textarea).not.toHaveFocus();

    rerender(<MessageInput {...defaultProps} replyingTo={fakeMessage} />);
    expect(textarea).toHaveFocus();
  });

  it('re-focuses when the reply target changes to a different message', () => {
    const { rerender } = render(<MessageInput {...defaultProps} replyingTo={fakeMessage} />);
    const textarea = screen.getByRole('textbox', { name: 'Message #general' });

    const anotherMessage: Message = { ...fakeMessage, id: 'msg-2', content: 'Other message' };
    rerender(<MessageInput {...defaultProps} replyingTo={anotherMessage} />);
    expect(textarea).toHaveFocus();
  });

  it('shows the "Replying to <author>" banner when replyingTo is set', () => {
    render(<MessageInput {...defaultProps} replyingTo={fakeMessage} />);
    expect(screen.getByText(/Replying to/i)).toBeInTheDocument();
    expect(screen.getByText(fakeMessage.author.username)).toBeInTheDocument();
  });

  it('does not show the reply banner when replyingTo is null', () => {
    render(<MessageInput {...defaultProps} replyingTo={null} />);
    expect(screen.queryByText(/Replying to/i)).not.toBeInTheDocument();
  });

  it('calls onCancelReply when the Cancel button is clicked', () => {
    const onCancelReply = jest.fn();
    render(<MessageInput {...defaultProps} replyingTo={fakeMessage} onCancelReply={onCancelReply} />);

    const cancelBtn = screen.getByRole('button', { name: /cancel reply/i });
    cancelBtn.click();
    expect(onCancelReply).toHaveBeenCalledTimes(1);
  });
});
