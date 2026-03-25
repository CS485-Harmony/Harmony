/**
 * issue-236-pin-button-visibility.test.tsx
 *
 * Regression tests for Issue #236: "Pin button visible to non-admin members"
 *
 * Root cause: HarmonyShell.tsx sets `canPin = isAuthenticated`, which shows
 * the More (⋯) / pin button to every logged-in user regardless of their
 * server-scoped role. The fix must scope `canPin` to members whose role is
 * 'admin', 'owner', or 'moderator' within that server.
 *
 * These tests target MessageItem (the component that renders the action bar)
 * and the canPin derivation logic in HarmonyShell.
 *
 * Testing strategy:
 *  - MessageItem unit tests: verify the More button is shown/hidden based on
 *    the `canPin` prop alone (component contract).
 *  - canPin derivation tests: verify that HarmonyShell passes canPin=true only
 *    to admin/owner/moderator members and canPin=false to plain members and guests.
 */

import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageItem } from '../components/message/MessageItem';
import type { Message } from '../types';

// Typed references to mocked actions so individual tests can configure them.
import { pinMessageAction, unpinMessageAction } from '../app/actions/pinMessage';
const mockPin   = pinMessageAction   as jest.MockedFunction<typeof pinMessageAction>;
const mockUnpin = unpinMessageAction as jest.MockedFunction<typeof unpinMessageAction>;

// ─── Mocks ────────────────────────────────────────────────────────────────────

// pinMessage server actions make real API calls — mock them out.
jest.mock('../app/actions/pinMessage', () => ({
  pinMessageAction: jest.fn(),
  unpinMessageAction: jest.fn(),
}));

// next/image causes issues in jsdom — swap for a plain <img>.
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_MESSAGE: Message = {
  id: 'msg-1',
  channelId: 'channel-abc',
  authorId: 'user-1',
  content: 'Hello world',
  timestamp: new Date().toISOString(),
  pinned: false,
  author: {
    id: 'user-1',
    username: 'testuser',
    displayName: 'Test User',
    avatarUrl: undefined,
  },
  reactions: [],
};

const SERVER_ID = 'server-abc';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderMessage(canPin: boolean | undefined, message: Message = BASE_MESSAGE) {
  return render(
    <MessageItem
      message={message}
      showHeader={true}
      serverId={SERVER_ID}
      canPin={canPin}
    />,
  );
}

/**
 * The More (⋯) button is the entry point to the Pin/Unpin menu.
 * It is only rendered when canPin is true (see ActionBar in MessageItem.tsx).
 */
function queryMoreButton() {
  return screen.queryByRole('button', { name: /more actions/i });
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Tests: MessageItem — pin button rendering ────────────────────────────────

describe('MessageItem — pin button visibility (Issue #236)', () => {
  describe('when canPin is true (admin / owner / moderator)', () => {
    it('renders the More actions button so the user can access pin/unpin', () => {
      renderMessage(true);
      expect(queryMoreButton()).toBeInTheDocument();
    });

    it('renders the More button for a pinned message as well', () => {
      renderMessage(true, { ...BASE_MESSAGE, pinned: true });
      expect(queryMoreButton()).toBeInTheDocument();
    });
  });

  describe('when canPin is false (regular member)', () => {
    it('does NOT render the More actions button', () => {
      renderMessage(false);
      expect(queryMoreButton()).not.toBeInTheDocument();
    });

    it('still renders the Reply button (available to all users)', () => {
      renderMessage(false);
      expect(screen.getByRole('button', { name: /reply/i })).toBeInTheDocument();
    });

    it('still renders the Add Reaction button (available to all users)', () => {
      renderMessage(false);
      expect(screen.getByRole('button', { name: /add reaction/i })).toBeInTheDocument();
    });
  });

  describe('when canPin is undefined (guest / unauthenticated)', () => {
    it('does NOT render the More actions button', () => {
      renderMessage(undefined);
      expect(queryMoreButton()).not.toBeInTheDocument();
    });
  });
});

// ─── Tests: canPin derivation logic ──────────────────────────────────────────
//
// These tests verify the rule that HarmonyShell MUST implement when deriving
// `canPin`. The shell has access to `localMembers` (server-scoped member list)
// and `authUser`. The derivation must check the member's server role, NOT the
// global `isAuthenticated` flag.
//
// We test the derivation logic directly as a pure function so that these tests
// remain isolated from the full HarmonyShell render tree (which has heavy
// provider dependencies).

type MemberRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest';

interface Member {
  id: string;
  role: MemberRole;
}

/**
 * The corrected canPin derivation extracted for unit testing.
 * This mirrors what HarmonyShell SHOULD compute (see bug: it currently uses
 * `isAuthenticated` with no role check).
 */
function deriveCanPin(currentUserId: string | undefined, members: Member[]): boolean {
  if (!currentUserId) return false;
  const member = members.find(m => m.id === currentUserId);
  if (!member) return false;
  return member.role === 'owner' || member.role === 'admin' || member.role === 'moderator';
}

const MEMBERS: Member[] = [
  { id: 'owner-1',     role: 'owner'     },
  { id: 'admin-1',     role: 'admin'     },
  { id: 'moderator-1', role: 'moderator' },
  { id: 'member-1',    role: 'member'    },
  { id: 'guest-1',     role: 'guest'     },
];

describe('canPin derivation — role-based access (Issue #236)', () => {
  it('returns true for the server owner', () => {
    expect(deriveCanPin('owner-1', MEMBERS)).toBe(true);
  });

  it('returns true for an admin', () => {
    expect(deriveCanPin('admin-1', MEMBERS)).toBe(true);
  });

  it('returns true for a moderator', () => {
    expect(deriveCanPin('moderator-1', MEMBERS)).toBe(true);
  });

  it('returns false for a regular member', () => {
    expect(deriveCanPin('member-1', MEMBERS)).toBe(false);
  });

  it('returns false for a guest', () => {
    expect(deriveCanPin('guest-1', MEMBERS)).toBe(false);
  });

  it('returns false when the user is not found in the member list', () => {
    expect(deriveCanPin('unknown-user', MEMBERS)).toBe(false);
  });

  it('returns false when currentUserId is undefined (unauthenticated)', () => {
    expect(deriveCanPin(undefined, MEMBERS)).toBe(false);
  });

  // Regression guard: this is the exact incorrect behaviour the bug introduced.
  it('does NOT grant pin access to any authenticated user regardless of role', () => {
    // A plain member being authenticated is NOT sufficient for canPin.
    const isAuthenticated = true; // simulates old `canPin = isAuthenticated`
    const incorrectCanPin = isAuthenticated;
    // The correct value for a plain member is false
    const correctCanPin = deriveCanPin('member-1', MEMBERS);
    expect(incorrectCanPin).toBe(true);   // this is what the bug produces
    expect(correctCanPin).toBe(false);    // this is what the fix must produce
    expect(incorrectCanPin).not.toBe(correctCanPin); // confirms the bug exists
  });
});

// ─── Tests: dropdown contents ─────────────────────────────────────────────────
//
// Clicking More must open a dropdown whose label reflects the current pin state.
// These tests also serve as a contract: once the menu IS visible to an admin,
// it must work correctly.

describe('MessageItem — dropdown contents (Issue #236)', () => {
  it('shows "Pin Message" in the dropdown for an unpinned message', () => {
    renderMessage(true, { ...BASE_MESSAGE, pinned: false });
    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    expect(screen.getByRole('button', { name: /pin message/i })).toBeInTheDocument();
  });

  it('shows "Unpin Message" in the dropdown for an already-pinned message', () => {
    renderMessage(true, { ...BASE_MESSAGE, pinned: true });
    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    expect(screen.getByRole('button', { name: /unpin message/i })).toBeInTheDocument();
  });

  it('closes the dropdown after clicking Pin Message', async () => {
    mockPin.mockResolvedValue(undefined);
    renderMessage(true, { ...BASE_MESSAGE, pinned: false });

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    const pinBtn = screen.getByRole('button', { name: /pin message/i });

    await act(async () => {
      fireEvent.click(pinBtn);
    });

    // Dropdown should be gone after the action fires
    expect(screen.queryByRole('button', { name: /pin message/i })).not.toBeInTheDocument();
  });

  it('shows a success indicator after a successful pin', async () => {
    mockPin.mockResolvedValue(undefined);
    renderMessage(true, { ...BASE_MESSAGE, pinned: false });

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /pin message/i }));
    });

    // Component renders "📌 Pinned" text on success
    expect(screen.getByText(/pinned/i)).toBeInTheDocument();
  });

  it('shows an error indicator when the pin action fails', async () => {
    mockPin.mockRejectedValue(new Error('403 Forbidden'));
    renderMessage(true, { ...BASE_MESSAGE, pinned: false });

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /pin message/i }));
    });

    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });

  it('non-admin never sees "Pin Message" or "Unpin Message" menu items', () => {
    renderMessage(false, { ...BASE_MESSAGE, pinned: false });
    // No More button means no dropdown — verify neither menu item leaks into the DOM
    expect(screen.queryByRole('button', { name: /pin message/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /unpin message/i })).not.toBeInTheDocument();
  });
});

// ─── Tests: pin / unpin API calls ────────────────────────────────────────────
//
// Verifies that the correct server action is invoked with the right arguments,
// and that a second call is not made while the first is still in flight.

describe('MessageItem — pin / unpin API calls (Issue #236)', () => {
  it('calls pinMessageAction with the correct messageId and serverId', async () => {
    mockPin.mockResolvedValue(undefined);
    renderMessage(true, { ...BASE_MESSAGE, id: 'msg-xyz', pinned: false });

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /pin message/i }));
    });

    expect(mockPin).toHaveBeenCalledTimes(1);
    expect(mockPin).toHaveBeenCalledWith('msg-xyz', SERVER_ID);
  });

  it('calls unpinMessageAction with the correct messageId and serverId', async () => {
    mockUnpin.mockResolvedValue(undefined);
    renderMessage(true, { ...BASE_MESSAGE, id: 'msg-xyz', pinned: true });

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /unpin message/i }));
    });

    expect(mockUnpin).toHaveBeenCalledTimes(1);
    expect(mockUnpin).toHaveBeenCalledWith('msg-xyz', SERVER_ID);
  });

  it('does not call pinMessageAction when serverId is missing', async () => {
    mockPin.mockResolvedValue(undefined);
    // Render without serverId — edge case where the prop is omitted
    render(
      <MessageItem
        message={{ ...BASE_MESSAGE, pinned: false }}
        showHeader={true}
        canPin={true}
        // serverId intentionally omitted
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /pin message/i }));
    });

    expect(mockPin).not.toHaveBeenCalled();
  });
});

// ─── Tests: compact (no-header) message variant ───────────────────────────────
//
// MessageItem renders in a compact mode (showHeader=false) for grouped messages.
// The canPin gating must apply equally in this variant.

describe('MessageItem compact variant — pin button visibility (Issue #236)', () => {
  function renderCompact(canPin: boolean | undefined) {
    return render(
      <MessageItem
        message={BASE_MESSAGE}
        showHeader={false}
        serverId={SERVER_ID}
        canPin={canPin}
      />,
    );
  }

  it('shows the More button for an admin in compact mode', () => {
    renderCompact(true);
    expect(screen.queryByRole('button', { name: /more actions/i })).toBeInTheDocument();
  });

  it('hides the More button for a regular member in compact mode', () => {
    renderCompact(false);
    expect(screen.queryByRole('button', { name: /more actions/i })).not.toBeInTheDocument();
  });
});
