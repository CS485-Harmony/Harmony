/**
 * issue-498-emoji-picker.test.tsx
 *
 * Tests for issue #498: emoji picker button in MessageInput.
 * Verifies that the emoji button is rendered, toggles the picker dialog,
 * and that selecting an emoji inserts it into the textarea.
 */

// ─── Module-level mock variables ─────────────────────────────────────────────

const mockSendMessageAction = jest.fn();

// ─── Jest module mocks ────────────────────────────────────────────────────────

jest.mock('@/app/actions/sendMessage', () => ({
  sendMessageAction: mockSendMessageAction,
}));

// Mock next/dynamic to render children synchronously in tests
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFn: () => Promise<{ default: React.ComponentType<unknown> }>) => {
    let ResolvedComponent: React.ComponentType<unknown> | null = null;

    const DynamicWrapper = (props: Record<string, unknown>) => {
      if (!ResolvedComponent) {
        throw new Error('Dynamic component not resolved — use mockResolvedValue in beforeEach');
      }
      return <ResolvedComponent {...props} />;
    };

    // Trigger the import so tests can intercept it
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
        onClick={() => onEmojiSelect({ native: '😀' })}
      >
        😀
      </button>
    </div>
  ),
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageInput } from '../components/channel/MessageInput';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Issue #498 — MessageInput: emoji picker', () => {
  const defaultProps = {
    channelId: 'ch-1',
    channelName: 'general',
    serverId: 'srv-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the emoji button', () => {
    render(<MessageInput {...defaultProps} />);
    expect(screen.getByRole('button', { name: /emoji/i })).toBeInTheDocument();
  });

  it('emoji button has aria-expanded=false initially', () => {
    render(<MessageInput {...defaultProps} />);
    const button = screen.getByRole('button', { name: /emoji/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking the emoji button opens the picker dialog', async () => {
    render(<MessageInput {...defaultProps} />);
    const button = screen.getByRole('button', { name: /emoji/i });

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /emoji picker/i })).toBeInTheDocument();
    });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking the emoji button again closes the picker', async () => {
    render(<MessageInput {...defaultProps} />);
    const button = screen.getByRole('button', { name: /emoji/i });

    await act(async () => {
      fireEvent.click(button);
    });
    await waitFor(() => expect(screen.getByRole('dialog', { name: /emoji picker/i })).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /emoji picker/i })).not.toBeInTheDocument();
    });
  });

  it('selecting an emoji inserts it into the textarea and closes the picker', async () => {
    render(<MessageInput {...defaultProps} />);
    const textarea = screen.getByRole('textbox', { name: 'Message #general' });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /emoji/i }));
    });

    await waitFor(() => expect(screen.getByTestId('emoji-option')).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByTestId('emoji-option'));
    });

    expect((textarea as HTMLTextAreaElement).value).toBe('😀');
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /emoji picker/i })).not.toBeInTheDocument();
    });
  });

  it('inserts emoji at cursor position in existing text', async () => {
    render(<MessageInput {...defaultProps} />);
    const textarea = screen.getByRole('textbox', { name: 'Message #general' }) as HTMLTextAreaElement;

    // Type some text
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'Hello World' } });
    });

    // Place cursor between "Hello" and " World"
    textarea.setSelectionRange(5, 5);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /emoji/i }));
    });

    await waitFor(() => expect(screen.getByTestId('emoji-option')).toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByTestId('emoji-option'));
    });

    expect(textarea.value).toBe('Hello😀 World');
  });

  it('picker is not shown in read-only mode', () => {
    render(<MessageInput {...defaultProps} isReadOnly />);
    expect(screen.queryByRole('button', { name: /emoji/i })).not.toBeInTheDocument();
  });

  it('clicking outside the picker closes it', async () => {
    render(
      <div>
        <MessageInput {...defaultProps} />
        <div data-testid='outside'>Outside</div>
      </div>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /emoji/i }));
    });

    await waitFor(() => expect(screen.getByRole('dialog', { name: /emoji picker/i })).toBeInTheDocument());

    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('outside'));
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /emoji picker/i })).not.toBeInTheDocument();
    });
  });
});
