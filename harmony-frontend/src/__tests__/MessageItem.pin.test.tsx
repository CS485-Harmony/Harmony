/**
 * Pin UI tests — Issue #248
 *
 * Validates the two frontend bugs:
 *
 * 1. canPin derivation: HarmonyShell.tsx:189 derives `canPin = isAuthenticated`,
 *    which means every logged-in user sees the pin button regardless of role.
 *    It should be gated on the user's server role (MODERATOR+).
 *
 * 2. Error feedback: When a pin/unpin action fails, the UI shows a static
 *    "Failed" label and swallows the backend's permission error message.
 */

import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageItem } from '../components/message/MessageItem';
import type { Message } from '../types';

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Mock next/image to render a plain <img>
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockPinMessageAction = jest.fn();
const mockUnpinMessageAction = jest.fn();

jest.mock('../app/actions/pinMessage', () => ({
  pinMessageAction: (...args: unknown[]) => mockPinMessageAction(...args),
  unpinMessageAction: (...args: unknown[]) => mockUnpinMessageAction(...args),
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const SERVER_ID = '00000000-0000-0000-0000-000000000001';

const baseMessage: Message = {
  id: 'msg-1',
  channelId: 'ch-1',
  authorId: 'user-1',
  author: {
    id: 'user-1',
    username: 'testuser',
    displayName: 'Test User',
    avatarUrl: null as unknown as string,
  },
  content: 'Hello, world!',
  timestamp: new Date('2025-01-01T12:00:00Z'),
  pinned: false,
};

const pinnedMessage: Message = {
  ...baseMessage,
  id: 'msg-2',
  pinned: true,
};

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockPinMessageAction.mockReset();
  mockUnpinMessageAction.mockReset();
});

// ─── 1. BUG: canPin = isAuthenticated (HarmonyShell.tsx:189) ─────────────────
// This test reproduces the root cause. HarmonyShell computes:
//   const canPin = isAuthenticated;
// An authenticated MEMBER gets canPin=true, which is wrong. The expected
// derivation should check the user's server role (MODERATOR+).

describe('BUG: canPin derivation in HarmonyShell is wrong', () => {
  // Replicate the buggy logic from HarmonyShell.tsx line 189
  function deriveCanPin_BUGGY(isAuthenticated: boolean): boolean {
    return isAuthenticated;
  }

  // What the fix should look like: role-aware derivation
  const PIN_ROLES = ['MODERATOR', 'ADMIN', 'OWNER'];
  function deriveCanPin_FIXED(isAuthenticated: boolean, userServerRole: string | null): boolean {
    return isAuthenticated && userServerRole !== null && PIN_ROLES.includes(userServerRole);
  }

  it('BUGGY: authenticated MEMBER gets canPin=true (proves the bug)', () => {
    // This is the actual behavior — the bug
    expect(deriveCanPin_BUGGY(true)).toBe(true);
  });

  it('FIXED: authenticated MEMBER should get canPin=false', () => {
    expect(deriveCanPin_FIXED(true, 'MEMBER')).toBe(false);
  });

  it('FIXED: authenticated GUEST should get canPin=false', () => {
    expect(deriveCanPin_FIXED(true, 'GUEST')).toBe(false);
  });

  it('FIXED: authenticated MODERATOR should get canPin=true', () => {
    expect(deriveCanPin_FIXED(true, 'MODERATOR')).toBe(true);
  });

  it('FIXED: authenticated ADMIN should get canPin=true', () => {
    expect(deriveCanPin_FIXED(true, 'ADMIN')).toBe(true);
  });

  it('FIXED: authenticated OWNER should get canPin=true', () => {
    expect(deriveCanPin_FIXED(true, 'OWNER')).toBe(true);
  });

  it('FIXED: unauthenticated user should get canPin=false', () => {
    expect(deriveCanPin_FIXED(false, null)).toBe(false);
  });

  it('BUG IN CONTEXT: MEMBER sees pin button because HarmonyShell passes canPin=true', () => {
    // HarmonyShell passes canPin={isAuthenticated} to MessageList → MessageItem.
    // For an authenticated MEMBER, isAuthenticated=true, so canPin=true.
    // This means the "More actions" button renders when it shouldn't.
    const isAuthenticated = true;
    const canPin = deriveCanPin_BUGGY(isAuthenticated); // true (BUG)

    render(
      <MessageItem message={baseMessage} canPin={canPin} serverId={SERVER_ID} />,
    );

    // BUG PROVEN: The pin button IS visible for a MEMBER
    expect(screen.getByLabelText('More actions')).toBeInTheDocument();
  });
});

// ─── 2. Pin button visibility at component level ─────────────────────────────

describe('Pin button visibility gating', () => {
  it('shows "More actions" button when canPin is true', () => {
    render(
      <MessageItem message={baseMessage} canPin={true} serverId={SERVER_ID} />,
    );
    expect(screen.getByLabelText('More actions')).toBeInTheDocument();
  });

  it('hides "More actions" button when canPin is false', () => {
    render(
      <MessageItem message={baseMessage} canPin={false} serverId={SERVER_ID} />,
    );
    expect(screen.queryByLabelText('More actions')).not.toBeInTheDocument();
  });

  it('hides "More actions" button when canPin is omitted', () => {
    render(
      <MessageItem message={baseMessage} serverId={SERVER_ID} />,
    );
    expect(screen.queryByLabelText('More actions')).not.toBeInTheDocument();
  });

  it('shows Pin Message option in dropdown when More is clicked', async () => {
    render(
      <MessageItem message={baseMessage} canPin={true} serverId={SERVER_ID} />,
    );

    const moreButton = screen.getByLabelText('More actions');
    await act(async () => {
      fireEvent.click(moreButton);
    });

    expect(screen.getByText('Pin Message')).toBeInTheDocument();
  });

  it('shows Unpin Message option for already-pinned messages', async () => {
    render(
      <MessageItem message={pinnedMessage} canPin={true} serverId={SERVER_ID} />,
    );

    const moreButton = screen.getByLabelText('More actions');
    await act(async () => {
      fireEvent.click(moreButton);
    });

    expect(screen.getByText('Unpin Message')).toBeInTheDocument();
  });

  it('does NOT show Pin/Unpin for a MEMBER (canPin=false) even though they are authenticated', () => {
    // This is the core bug: canPin was derived from isAuthenticated instead of role
    render(
      <MessageItem message={baseMessage} canPin={false} serverId={SERVER_ID} />,
    );
    expect(screen.queryByLabelText('More actions')).not.toBeInTheDocument();
    expect(screen.queryByText('Pin Message')).not.toBeInTheDocument();
  });
});

// ─── 2. Pin action success feedback ─────────────────────────────────────────

describe('Pin action — success path', () => {
  it('calls pinMessageAction and shows success feedback', async () => {
    mockPinMessageAction.mockResolvedValueOnce(undefined);

    render(
      <MessageItem message={baseMessage} canPin={true} serverId={SERVER_ID} />,
    );

    // Open dropdown and click Pin
    await act(async () => {
      fireEvent.click(screen.getByLabelText('More actions'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Pin Message'));
    });

    expect(mockPinMessageAction).toHaveBeenCalledWith('msg-1', SERVER_ID);

    await waitFor(() => {
      expect(screen.getByText(/Pinned/)).toBeInTheDocument();
    });
  });

  it('calls unpinMessageAction for a pinned message', async () => {
    mockUnpinMessageAction.mockResolvedValueOnce(undefined);

    render(
      <MessageItem message={pinnedMessage} canPin={true} serverId={SERVER_ID} />,
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText('More actions'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Unpin Message'));
    });

    expect(mockUnpinMessageAction).toHaveBeenCalledWith('msg-2', SERVER_ID);
  });
});

// ─── 3. Error feedback — the "Failed" bug ───────────────────────────────────

describe('Pin action — error feedback', () => {
  it('shows generic "Failed" on error (current behavior — bug)', async () => {
    // The current code catches the error and shows a static "Failed" label
    // without the backend's permission message. This test documents the bug.
    const permissionError = new Error('You do not have permission to perform \'message:pin\'');
    mockPinMessageAction.mockRejectedValueOnce(permissionError);

    render(
      <MessageItem message={baseMessage} canPin={true} serverId={SERVER_ID} />,
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText('More actions'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Pin Message'));
    });

    // BUG: The UI shows a generic "Failed" instead of the error message
    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
  });

  it('does NOT surface the backend permission error message (documenting the bug)', async () => {
    const permissionError = new Error('You do not have permission to perform \'message:pin\'');
    mockPinMessageAction.mockRejectedValueOnce(permissionError);

    render(
      <MessageItem message={baseMessage} canPin={true} serverId={SERVER_ID} />,
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText('More actions'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Pin Message'));
    });

    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    // The backend message is NOT shown — this proves the bug exists
    expect(screen.queryByText(/permission/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/not have permission/i)).not.toBeInTheDocument();
  });
});

// ─── 4. canPin=false should fully suppress pin UI (acceptance criteria) ──────

describe('Acceptance criteria — MEMBERs and GUESTs see no pin UI', () => {
  it('Reply and Add Reaction buttons are still visible when canPin is false', () => {
    render(
      <MessageItem message={baseMessage} canPin={false} serverId={SERVER_ID} />,
    );
    // Reply and Add Reaction are always shown
    expect(screen.getByLabelText('Reply')).toBeInTheDocument();
    expect(screen.getByLabelText('Add Reaction')).toBeInTheDocument();
  });

  it('no pin-related UI is rendered when canPin is false', () => {
    render(
      <MessageItem message={baseMessage} canPin={false} serverId={SERVER_ID} />,
    );
    expect(screen.queryByLabelText('More actions')).not.toBeInTheDocument();
    expect(screen.queryByText('Pin Message')).not.toBeInTheDocument();
    expect(screen.queryByText('Unpin Message')).not.toBeInTheDocument();
  });
});
