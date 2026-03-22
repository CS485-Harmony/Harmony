/**
 * VisibilityToggle.test.tsx — Issue #117
 *
 * Tests the optimistic update and rollback behavior of the VisibilityToggle component.
 *
 * updateChannelVisibility (server action) is mocked to avoid real API calls.
 * useToast is mocked to avoid needing ToastProvider in the test tree.
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisibilityToggle } from '../components/channel/VisibilityToggle';
import { ChannelVisibility } from '../types';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockUpdateChannelVisibility = jest.fn();

jest.mock('../app/settings/[serverSlug]/[channelSlug]/updateVisibility', () => ({
  updateChannelVisibility: (...args: unknown[]) => mockUpdateChannelVisibility(...args),
}));

const mockShowToast = jest.fn();

jest.mock('../hooks/useToast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
    dismissToast: jest.fn(),
    cancelAutoDismiss: jest.fn(),
  }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SERVER_SLUG = 'test-server';
const CHANNEL_SLUG = 'test-channel';

function renderToggle(initialVisibility: ChannelVisibility, disabled = false) {
  const onVisibilityChanged = jest.fn();
  const utils = render(
    <VisibilityToggle
      serverSlug={SERVER_SLUG}
      channelSlug={CHANNEL_SLUG}
      initialVisibility={initialVisibility}
      disabled={disabled}
      onVisibilityChanged={onVisibilityChanged}
    />,
  );
  return { ...utils, onVisibilityChanged };
}

function getOptionButton(label: string) {
  return screen.getByRole('radio', { name: (accessibleName) =>
    accessibleName.toLowerCase().includes(label.toLowerCase()),
  });
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('VisibilityToggle — rendering', () => {
  it('renders all three options', () => {
    renderToggle(ChannelVisibility.PRIVATE);
    expect(getOptionButton('Public (Search Indexed)')).toBeInTheDocument();
    expect(getOptionButton('Public (Not Indexed)')).toBeInTheDocument();
    expect(getOptionButton('Private')).toBeInTheDocument();
  });

  it('marks the initial visibility as checked', () => {
    renderToggle(ChannelVisibility.PUBLIC_NO_INDEX);
    expect(getOptionButton('Public (Not Indexed)')).toHaveAttribute('aria-checked', 'true');
    expect(getOptionButton('Public (Search Indexed)')).toHaveAttribute('aria-checked', 'false');
    expect(getOptionButton('Private')).toHaveAttribute('aria-checked', 'false');
  });

  it('disables all options when disabled=true', () => {
    renderToggle(ChannelVisibility.PRIVATE, true);
    expect(getOptionButton('Public (Search Indexed)')).toBeDisabled();
    expect(getOptionButton('Public (Not Indexed)')).toBeDisabled();
    expect(getOptionButton('Private')).toBeDisabled();
  });

  it('shows admin-only hint when disabled', () => {
    renderToggle(ChannelVisibility.PRIVATE, true);
    expect(screen.getByText(/only administrators can change/i)).toBeInTheDocument();
  });
});

// ─── Optimistic update ────────────────────────────────────────────────────────

describe('VisibilityToggle — optimistic update', () => {
  it('immediately marks the clicked option as checked before the API resolves', async () => {
    // Defer resolution so we can observe the intermediate state
    let resolveUpdate!: () => void;
    mockUpdateChannelVisibility.mockReturnValue(
      new Promise<void>((resolve) => { resolveUpdate = resolve; }),
    );

    renderToggle(ChannelVisibility.PRIVATE);

    fireEvent.click(getOptionButton('Public (Search Indexed)'));

    // Optimistic update should be visible before the promise resolves
    expect(getOptionButton('Public (Search Indexed)')).toHaveAttribute('aria-checked', 'true');
    expect(getOptionButton('Private')).toHaveAttribute('aria-checked', 'false');

    // Clean up: resolve the pending promise
    await act(async () => { resolveUpdate(); });
  });

  it('calls onVisibilityChanged with the new visibility on success', async () => {
    mockUpdateChannelVisibility.mockResolvedValue(undefined);

    const { onVisibilityChanged } = renderToggle(ChannelVisibility.PRIVATE);

    await act(async () => {
      fireEvent.click(getOptionButton('Public (Not Indexed)'));
    });

    expect(onVisibilityChanged).toHaveBeenCalledWith(ChannelVisibility.PUBLIC_NO_INDEX);
  });

  it('shows a success toast on successful save', async () => {
    mockUpdateChannelVisibility.mockResolvedValue(undefined);

    renderToggle(ChannelVisibility.PRIVATE);

    await act(async () => {
      fireEvent.click(getOptionButton('Public (Not Indexed)'));
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success' }),
    );
  });
});

// ─── Rollback on error ────────────────────────────────────────────────────────

describe('VisibilityToggle — rollback on error', () => {
  it('reverts to the previous selection when the API call fails', async () => {
    mockUpdateChannelVisibility.mockRejectedValue(new Error('Network error'));

    renderToggle(ChannelVisibility.PRIVATE);

    await act(async () => {
      fireEvent.click(getOptionButton('Public (Search Indexed)'));
    });

    // Should have rolled back to PRIVATE
    expect(getOptionButton('Private')).toHaveAttribute('aria-checked', 'true');
    expect(getOptionButton('Public (Search Indexed)')).toHaveAttribute('aria-checked', 'false');
  });

  it('shows an error toast when the API call fails', async () => {
    mockUpdateChannelVisibility.mockRejectedValue(new Error('Network error'));

    renderToggle(ChannelVisibility.PRIVATE);

    await act(async () => {
      fireEvent.click(getOptionButton('Public (Search Indexed)'));
    });

    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error' }),
    );
  });

  it('does NOT call onVisibilityChanged when the API call fails', async () => {
    mockUpdateChannelVisibility.mockRejectedValue(new Error('Network error'));

    const { onVisibilityChanged } = renderToggle(ChannelVisibility.PRIVATE);

    await act(async () => {
      fireEvent.click(getOptionButton('Public (Search Indexed)'));
    });

    expect(onVisibilityChanged).not.toHaveBeenCalled();
  });
});

// ─── Confirmation modal (PRIVATE transition) ─────────────────────────────────

describe('VisibilityToggle — confirmation modal', () => {
  it('shows a confirmation dialog when selecting PRIVATE', () => {
    mockUpdateChannelVisibility.mockResolvedValue(undefined);
    renderToggle(ChannelVisibility.PUBLIC_NO_INDEX);

    fireEvent.click(getOptionButton('Private'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/make channel private/i)).toBeInTheDocument();
  });

  it('applies the change after confirmation', async () => {
    mockUpdateChannelVisibility.mockResolvedValue(undefined);
    renderToggle(ChannelVisibility.PUBLIC_NO_INDEX);

    fireEvent.click(getOptionButton('Private'));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /make private/i }));
    });

    expect(mockUpdateChannelVisibility).toHaveBeenCalledWith(
      SERVER_SLUG,
      CHANNEL_SLUG,
      ChannelVisibility.PRIVATE,
    );
  });

  it('cancels without changing selection', async () => {
    mockUpdateChannelVisibility.mockResolvedValue(undefined);
    renderToggle(ChannelVisibility.PUBLIC_NO_INDEX);

    fireEvent.click(getOptionButton('Private'));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    });

    expect(mockUpdateChannelVisibility).not.toHaveBeenCalled();
    expect(getOptionButton('Public (Not Indexed)')).toHaveAttribute('aria-checked', 'true');
  });
});
