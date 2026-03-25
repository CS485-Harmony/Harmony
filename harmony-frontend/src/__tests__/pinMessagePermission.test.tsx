/**
 * pinMessagePermission.test.tsx — Issue #236
 *
 * TDD test suite for the pin-message button visibility fix.
 *
 * Oracle: The "More actions" (⋯) button and "Pin Message" dropdown item in the
 * message action bar MUST only be visible to users whose role is MODERATOR,
 * ADMIN, or OWNER. Users with a MEMBER or GUEST role must never see the
 * button, regardless of authentication state.
 *
 * Comparator: Manual frontend testing — hover over a message as users of each
 * role and confirm the "More actions" button and "Pin Message" item appear or
 * are absent as expected. The component-level tests below mirror that visual
 * check programmatically.
 *
 * Current failure mode (the bug):
 *   HarmonyShell.tsx derives canPin from isAuthenticated alone:
 *     const canPin = isAuthenticated;
 *   This means every authenticated user — including MEMBERs and GUESTs — sees
 *   the pin button even though the backend will reject their pin attempts with
 *   403. The fix must:
 *     1. Extract a canPinForRole(role) helper that returns true only for
 *        MODERATOR, ADMIN, and OWNER.
 *     2. Replace `canPin = isAuthenticated` with
 *        `canPin = isAuthenticated && canPinForRole(currentUserRole)`.
 *
 * Test structure:
 *   Section A — MessageItem component: verifies the "More actions" button
 *     appears / is absent based on the canPin prop passed to MessageItem.
 *     These tests document the *contract* the component already honours and
 *     will serve as a regression safety net.
 *
 *   Section B — canPinForRole() utility: verifies the role → boolean mapping
 *     that the fix must introduce. These tests FAIL until the utility is
 *     created at src/lib/permissions.ts and exported as canPinForRole.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageItem } from '../components/message/MessageItem';
import type { Message } from '../types';
import type { UserRole } from '../types/user';

// ─── Mocks ────────────────────────────────────────────────────────────────────

// next/image renders an <img> in the test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

jest.mock('../lib/utils', () => ({
  formatMessageTimestamp: () => 'Today at 12:00 PM',
  formatTimeOnly: () => '12:00 PM',
}));

jest.mock('../app/actions/pinMessage', () => ({
  pinMessageAction: jest.fn().mockResolvedValue(undefined),
  unpinMessageAction: jest.fn().mockResolvedValue(undefined),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE_MESSAGE: Message = {
  id: 'msg-1',
  channelId: 'ch-1',
  authorId: 'user-1',
  author: {
    id: 'user-1',
    username: 'testuser',
    displayName: 'Test User',
  },
  content: 'Hello, world!',
  timestamp: new Date('2024-01-01T12:00:00Z'),
  pinned: false,
};

const SERVER_ID = 'server-1';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderMessage(canPin: boolean | undefined) {
  return render(
    <MessageItem
      message={BASE_MESSAGE}
      canPin={canPin}
      serverId={SERVER_ID}
    />,
  );
}

// ─── Section A: MessageItem component — pin button visibility ─────────────────
//
// These tests verify the visual contract of MessageItem:
// the "More actions" button is gated by the canPin prop.
// They will pass today (the component already honours the prop correctly)
// and act as a regression guard after the fix.

describe('MessageItem — pin button visibility based on canPin prop', () => {
  it('shows the "More actions" button when canPin is true', () => {
    renderMessage(true);
    expect(screen.getByRole('button', { name: /more actions/i })).toBeInTheDocument();
  });

  it('does not show the "More actions" button when canPin is false', () => {
    renderMessage(false);
    expect(screen.queryByRole('button', { name: /more actions/i })).not.toBeInTheDocument();
  });

  it('does not show the "More actions" button when canPin is undefined (default)', () => {
    renderMessage(undefined);
    expect(screen.queryByRole('button', { name: /more actions/i })).not.toBeInTheDocument();
  });

  it('shows the "Pin Message" dropdown item after clicking "More actions" when canPin is true', () => {
    renderMessage(true);
    fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
    expect(screen.getByRole('button', { name: /pin message/i })).toBeInTheDocument();
  });

  it('does not expose a "Pin Message" item to users with canPin false', () => {
    renderMessage(false);
    // The dropdown trigger itself must be absent — no path to reach pin/unpin
    expect(screen.queryByRole('button', { name: /pin message/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /unpin message/i })).not.toBeInTheDocument();
  });
});

// ─── Section B: canPinForRole() — role → permission mapping ──────────────────
//
// These tests verify the helper that the fix must introduce.
// They FAIL until src/lib/permissions.ts is created and canPinForRole is
// exported from it.
//
// Import is deferred inside the tests so that the Section A tests above run
// even before the fix is applied (a missing module would otherwise abort the
// whole file at parse time).

describe('canPinForRole — permission helper (requires fix: src/lib/permissions.ts)', () => {
  let canPinForRole: (role: UserRole) => boolean;

  beforeAll(async () => {
    // Dynamic import so missing module produces a clear per-test failure
    // rather than crashing the whole suite.
    try {
      // @ts-expect-error — module does not exist yet; will be created as part of the fix
      const mod = await import('../lib/permissions');
      canPinForRole = mod.canPinForRole;
    } catch {
      // The module does not exist yet — tests below will fail with a
      // descriptive message once canPinForRole is accessed.
      canPinForRole = undefined as unknown as typeof canPinForRole;
    }
  });

  const privilegedRoles: UserRole[] = ['owner', 'admin', 'moderator'];
  const unprivilegedRoles: UserRole[] = ['member', 'guest'];

  it.each(privilegedRoles)(
    'returns true for role "%s" (allowed to pin)',
    (role) => {
      expect(canPinForRole).toBeDefined();
      expect(canPinForRole(role)).toBe(true);
    },
  );

  it.each(unprivilegedRoles)(
    'returns false for role "%s" (not allowed to pin)',
    (role) => {
      expect(canPinForRole).toBeDefined();
      expect(canPinForRole(role)).toBe(false);
    },
  );
});
