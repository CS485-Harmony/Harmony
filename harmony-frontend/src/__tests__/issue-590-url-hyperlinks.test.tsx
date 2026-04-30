/**
 * issue-590-url-hyperlinks.test.tsx
 *
 * Regression test for issue #590: URLs in messages must be rendered as
 * clickable hyperlinks opening in a new tab, not as plain text.
 */

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
  usePathname: () => '/c/test-server/general',
  useRouter: () => ({ push: jest.fn() }),
}));

const baseMessage: Message = {
  id: 'msg-link-1',
  channelId: 'channel-1',
  authorId: 'user-1',
  author: { id: 'user-1', username: 'alice', displayName: 'Alice' },
  content: '',
  timestamp: '2026-04-30T00:00:00.000Z',
  attachments: [],
};

describe('Issue #590 — URL hyperlinks in messages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { id: 'user-2' } });
  });

  it('AC-1: renders a standalone URL as a clickable anchor', () => {
    render(<MessageItem message={{ ...baseMessage, content: 'https://example.com' }} />);
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('AC-2: link opens in a new tab', () => {
    render(<MessageItem message={{ ...baseMessage, content: 'https://example.com' }} />);
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('renders a URL inline alongside surrounding text', () => {
    render(
      <MessageItem
        message={{ ...baseMessage, content: 'Check this out: https://google.com and let me know' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'https://google.com' });
    expect(link).toBeInTheDocument();
    expect(screen.getByText(/Check this out:/)).toBeInTheDocument();
    expect(screen.getByText(/and let me know/)).toBeInTheDocument();
  });

  it('does not render a plain-text URL as an anchor (no URL in content)', () => {
    render(<MessageItem message={{ ...baseMessage, content: 'hello world' }} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('embeds video URLs without also creating a hyperlink', () => {
    const mp4 = 'https://example.com/video.mp4';
    render(<MessageItem message={{ ...baseMessage, content: mp4 }} />);
    // Video embed should be present
    const video = document.querySelector('video');
    expect(video).not.toBeNull();
    // The video URL should NOT also appear as an <a> link
    expect(screen.queryByRole('link', { name: mp4 })).not.toBeInTheDocument();
  });
});
