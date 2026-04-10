/**
 * issue-238-message-input-aria-label.test.tsx
 *
 * Regression test for issue #238: message compose textarea must expose an
 * aria-label so screen readers and assistive technologies can discover and
 * describe the field.
 *
 * The textarea must have aria-label="Message #<channelName>" so it appears
 * in the accessibility tree when a user navigates to any channel.
 */

// ─── Module-level mock variables ─────────────────────────────────────────────

const mockSendMessageAction = jest.fn();

// ─── Jest module mocks ────────────────────────────────────────────────────────

jest.mock('@/app/actions/sendMessage', () => ({
  sendMessageAction: mockSendMessageAction,
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageInput } from '../components/channel/MessageInput';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Issue #238 — MessageInput: textarea aria-label accessibility', () => {
  const defaultProps = {
    channelId: 'ch-1',
    channelName: 'general',
    serverId: 'srv-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a textarea with aria-label matching the channel name', () => {
    render(<MessageInput {...defaultProps} />);

    const textarea = screen.getByRole('textbox', { name: 'Message #general' });
    expect(textarea).toBeInTheDocument();
  });

  it('aria-label updates when channelName prop changes', () => {
    const { rerender } = render(<MessageInput {...defaultProps} channelName='announcements' />);

    expect(screen.getByRole('textbox', { name: 'Message #announcements' })).toBeInTheDocument();

    rerender(<MessageInput {...defaultProps} channelName='off-topic' />);

    expect(screen.getByRole('textbox', { name: 'Message #off-topic' })).toBeInTheDocument();
  });

  it('textarea is reachable via getByLabelText (screen-reader lookup)', () => {
    render(<MessageInput {...defaultProps} />);

    // Assistive technologies resolve aria-label via getByLabelText
    const textarea = screen.getByLabelText('Message #general');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });

  it('does not render a textarea when isReadOnly is true', () => {
    render(<MessageInput {...defaultProps} isReadOnly />);

    // Read-only view shows a permission notice, no textarea
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText(/do not have permission/i)).toBeInTheDocument();
  });
});
