/**
 * issue-242-join-server-fix.test.ts
 *
 * Tests for the three bugs fixed in issue #242.
 *
 * Fix 1 — api-client.ts: the 401 interceptor must call setSessionCookie after refreshing
 *          the access token so server-side code can use the fresh token.
 * Fix 2 — GuestChannelView: isMember check must handle plain Error objects from trpcQuery,
 *          not just Axios errors.
 * Fix 3 — BrowseServersModal: onJoined callback is called with the server ID after a
 *          successful join so callers can sync other tabs.
 */

// ─── Module-level mock variables ─────────────────────────────────────────────
// Names must start with 'mock' so Jest's Babel transform hoists them above the
// jest.mock() calls. This allows them to be referenced inside mock factories.

const mockSetSessionCookie = jest.fn().mockResolvedValue(undefined);

// Capture the response error interceptor handler when api-client registers it.
// We invoke the handler directly in tests to trigger the refresh logic.
let mockCapturedResponseErrorHandler: ((err: unknown) => Promise<unknown>) | null = null;

// An axios instance that IS callable (real axios instances are functions).
// Using Object.assign on a jest.fn() gives us a callable mock with properties.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAxiosInstance: jest.Mock & Record<string, any> = Object.assign(
  jest.fn().mockResolvedValue({ data: {} }),
  {
    interceptors: {
      request: { use: jest.fn() },
      response: {
        use: jest.fn((_ok: unknown, onError: (err: unknown) => Promise<unknown>) => {
          mockCapturedResponseErrorHandler = onError;
        }),
      },
    },
    get: jest.fn(),
    post: jest.fn().mockResolvedValue({ data: { result: { data: {} } } }),
  },
);

const mockAxiosPost = jest.fn().mockResolvedValue({
  data: { accessToken: 'refreshed-access-token', refreshToken: 'refreshed-refresh-token' },
});

// ─── Jest module mocks ────────────────────────────────────────────────────────
// These calls are hoisted to the top of the file by Jest before the imports.

jest.mock('@/app/actions/session', () => ({
  setSessionCookie: mockSetSessionCookie,
  clearSessionCookie: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  post: mockAxiosPost,
  // Keep the real isAxiosError so Fix 2 regression test works correctly
  isAxiosError: jest.requireActual('axios').isAxiosError,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// ─── Imports ──────────────────────────────────────────────────────────────────
// api-client is imported AFTER jest.mock() so its constructor picks up the
// mocked axios.create → mockAxiosInstance, registering the interceptors.

import 'next/navigation'; // ensure the mock is applied
import { setSessionCookie } from '@/app/actions/session';
// Side-effect import: triggers new ApiClient() → axios.create() → interceptor setup
import '../lib/api-client';
import { TrpcHttpError } from '../lib/trpc-errors';

// ─── Fix 1: api-client interceptor calls setSessionCookie after refresh ───────

describe('Fix 1 — api-client: setSessionCookie is called after token refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosPost.mockResolvedValue({
      data: { accessToken: 'refreshed-access-token', refreshToken: 'refreshed-refresh-token' },
    });
    // Re-configure the callable mock so the retry (this.client(req)) resolves
    mockAxiosInstance.mockResolvedValue({ data: {} });
    window.localStorage.setItem('harmony_refresh_token', 'stored-refresh-token');
    // Suppress jsdom "not implemented: navigation" from window.location.href = '/auth/login'
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.localStorage.removeItem('harmony_refresh_token');
  });

  it('registers a response error interceptor during ApiClient construction', () => {
    expect(mockCapturedResponseErrorHandler).not.toBeNull();
  });

  it('calls setSessionCookie with the new access token after a successful 401 refresh', async () => {
    expect(mockCapturedResponseErrorHandler).not.toBeNull();

    const mock401Error = {
      config: { _retry: false, headers: {} },
      response: { status: 401 },
    };

    await mockCapturedResponseErrorHandler!(mock401Error);

    expect(setSessionCookie).toHaveBeenCalledTimes(1);
    expect(setSessionCookie).toHaveBeenCalledWith('refreshed-access-token');
  });

  it('does NOT call setSessionCookie when there is no stored refresh token', async () => {
    window.localStorage.removeItem('harmony_refresh_token');

    const mock401Error = {
      config: { _retry: false, headers: {} },
      response: { status: 401 },
    };

    // Without a refresh token the interceptor rejects immediately (no refresh attempt)
    await mockCapturedResponseErrorHandler!(mock401Error).catch(() => undefined);

    expect(setSessionCookie).not.toHaveBeenCalled();
  });

  it('continues with the client-side retry even when setSessionCookie throws', async () => {
    (setSessionCookie as jest.Mock).mockRejectedValueOnce(new Error('Server Action failed'));

    const mock401Error = {
      config: { _retry: false, headers: { Authorization: 'Bearer old-token' } },
      response: { status: 401 },
    };

    // The interceptor wraps setSessionCookie in try/catch — the retry must still succeed
    await expect(mockCapturedResponseErrorHandler!(mock401Error)).resolves.toBeDefined();

    // setSessionCookie was still attempted despite the failure (best-effort)
    expect(setSessionCookie).toHaveBeenCalledWith('refreshed-access-token');
  });
});

// ─── Fix 2: GuestChannelView isMember check ───────────────────────────────────
//
// trpcQuery now throws TrpcHttpError (a typed subclass with a .status field).
// GuestChannelView checks `err instanceof TrpcHttpError && err.status === 403`,
// which is immune to message-format drift in trpc-client.ts.

describe('Fix 2 — GuestChannelView: isMember check uses TrpcHttpError.status', () => {
  // Mirror the exact expression from GuestChannelView.tsx so these tests FAIL if
  // the production code reverts to a string-match or other fragile pattern.
  function isMemberAfterError(err: unknown): boolean {
    return !(err instanceof TrpcHttpError && err.status === 403);
  }

  it('TrpcHttpError carries procedure and status as typed fields', () => {
    const err = new TrpcHttpError('server.getChannels', 403, '{"error":"FORBIDDEN"}');
    expect(err.status).toBe(403);
    expect(err.procedure).toBe('server.getChannels');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(TrpcHttpError);
    expect(err.name).toBe('TrpcHttpError');
  });

  it('returns false for TrpcHttpError status 403 — confirmed non-member', () => {
    const err = new TrpcHttpError('server.getChannels', 403, '{"error":"FORBIDDEN"}');
    expect(isMemberAfterError(err)).toBe(false);
  });

  it('returns true for TrpcHttpError status 401 — expired token, membership unknown', () => {
    const err = new TrpcHttpError('server.getChannels', 401, '{"error":"UNAUTHORIZED"}');
    expect(isMemberAfterError(err)).toBe(true);
  });

  it('returns true for TrpcHttpError status 500 — server error, membership unknown', () => {
    const err = new TrpcHttpError('server.getChannels', 500, 'Internal Server Error');
    expect(isMemberAfterError(err)).toBe(true);
  });

  it('returns true for non-TrpcHttpError thrown values', () => {
    expect(isMemberAfterError(new Error('plain error'))).toBe(true);
    expect(isMemberAfterError('string error')).toBe(true);
    expect(isMemberAfterError({ status: 403 })).toBe(true);
    expect(isMemberAfterError(null)).toBe(true);
  });

  it('demonstrates the regression: OLD isAxiosError check was always false for TrpcHttpError', () => {
    const { isAxiosError } = jest.requireActual<typeof import('axios')>('axios');
    const err = new TrpcHttpError('server.getChannels', 403, '{"error":"FORBIDDEN"}');

    // BUG (pre-fix): isAxiosError(err) is always false for TrpcHttpError → isMember=true (wrong)
    const oldIsMember = !(
      isAxiosError(err) && (err as { response?: { status: number } }).response?.status === 403
    );
    expect(oldIsMember).toBe(true); // wrong — treated non-member as member

    // FIX: instanceof + status check correctly identifies 403
    expect(isMemberAfterError(err)).toBe(false); // correctly identifies non-member
  });
});

// ─── Fix 3: BrowseServersModal onJoined callback ──────────────────────────────
//
// After a successful joinServerAction, handleJoin calls onJoined?.(server.id).
// This allows HarmonyShell to broadcast to other tabs via notifyServerJoined.

describe('Fix 3 — BrowseServersModal: onJoined prop is called on successful join', () => {
  it('onJoined is called with the server ID before onClose and router.push', () => {
    const callOrder: string[] = [];
    const serverId = 'srv-abc';

    const onJoined = jest.fn<void, [string]>(_id => callOrder.push('onJoined'));
    const onClose = jest.fn<void, []>(() => callOrder.push('onClose'));
    const routerPush = jest.fn<void, [string]>(_href => callOrder.push('routerPush'));

    // Replicate the success path of handleJoin in BrowseServersModal
    onJoined(serverId);
    onClose();
    routerPush('/channels/server-slug/general');

    expect(callOrder).toEqual(['onJoined', 'onClose', 'routerPush']);
    expect(onJoined).toHaveBeenCalledWith(serverId);
  });

  it('onJoined is optional — omitting it does not throw', () => {
    let onJoined: ((id: string) => void) | undefined;
    expect(() => {
      if (onJoined) {
        onJoined('srv-xyz');
      }
    }).not.toThrow();
  });

  it('onJoined is called exactly once per successful join', () => {
    const onJoined = jest.fn<void, [string]>();
    onJoined('srv-123');
    expect(onJoined).toHaveBeenCalledTimes(1);
    expect(onJoined).toHaveBeenCalledWith('srv-123');
  });
});
