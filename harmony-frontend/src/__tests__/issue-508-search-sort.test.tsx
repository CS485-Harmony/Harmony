/**
 * issue-508-search-sort.test.tsx
 *
 * Regression tests for #508: newest/oldest sort controls in SearchModal.
 * Verifies default ordering (newest first) and that toggling to oldest-first
 * reorders the same result set correctly.
 */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SearchModal } from '../components/channel/SearchModal';
import type { Message } from '../types';

/* eslint-disable @next/next/no-img-element */
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={props.alt ?? ''} {...props} />
  ),
}));

const makeMessage = (id: string, content: string, timestamp: string): Message => ({
  id,
  channelId: 'ch-1',
  authorId: `author-${id}`,
  author: { id: `author-${id}`, username: `user${id}` },
  content,
  timestamp,
});

// Three messages with distinct timestamps (oldest → newest in array order)
const MESSAGES: Message[] = [
  makeMessage('1', 'hello world', '2024-01-01T10:00:00Z'),
  makeMessage('2', 'hello again', '2024-01-02T10:00:00Z'),
  makeMessage('3', 'hello there', '2024-01-03T10:00:00Z'),
];

describe('SearchModal sort controls (issue #508)', () => {
  const defaultProps = {
    messages: MESSAGES,
    isOpen: true,
    onClose: jest.fn(),
  };

  it('renders newest-first by default', async () => {
    render(<SearchModal {...defaultProps} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');

    // Wait for debounce (200ms) — userEvent typing is synchronous in jest but
    // the debounced state update needs a tick; we just query after typing settles.
    const resultButtons = await screen.findAllByRole('button', { name: /user\d/i });
    const ids = resultButtons.map(btn => within(btn).getByText(/user\d/).textContent);

    // Newest first: user3 (2024-01-03), user2 (2024-01-02), user1 (2024-01-01)
    expect(ids).toEqual(['user3', 'user2', 'user1']);
  });

  it('shows Newest button as active by default', async () => {
    render(<SearchModal {...defaultProps} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');

    await screen.findAllByRole('button', { name: /user\d/i });

    const newestBtn = screen.getByRole('button', { name: 'Newest' });
    const oldestBtn = screen.getByRole('button', { name: 'Oldest' });

    expect(newestBtn).toHaveAttribute('aria-pressed', 'true');
    expect(oldestBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('reorders results oldest-first when Oldest is clicked', async () => {
    render(<SearchModal {...defaultProps} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');

    await screen.findAllByRole('button', { name: /user\d/i });

    await userEvent.click(screen.getByRole('button', { name: 'Oldest' }));

    const resultButtons = screen.getAllByRole('button', { name: /user\d/i });
    const ids = resultButtons.map(btn => within(btn).getByText(/user\d/).textContent);

    // Oldest first: user1 (2024-01-01), user2 (2024-01-02), user3 (2024-01-03)
    expect(ids).toEqual(['user1', 'user2', 'user3']);
  });

  it('switches Oldest button to active after toggle', async () => {
    render(<SearchModal {...defaultProps} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');

    await screen.findAllByRole('button', { name: /user\d/i });
    await userEvent.click(screen.getByRole('button', { name: 'Oldest' }));

    expect(screen.getByRole('button', { name: 'Oldest' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Newest' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles back to newest-first after clicking Newest again', async () => {
    render(<SearchModal {...defaultProps} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');

    await screen.findAllByRole('button', { name: /user\d/i });

    await userEvent.click(screen.getByRole('button', { name: 'Oldest' }));
    await userEvent.click(screen.getByRole('button', { name: 'Newest' }));

    const resultButtons = screen.getAllByRole('button', { name: /user\d/i });
    const ids = resultButtons.map(btn => within(btn).getByText(/user\d/).textContent);

    expect(ids).toEqual(['user3', 'user2', 'user1']);
  });
});
