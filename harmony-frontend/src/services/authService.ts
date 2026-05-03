/**
 * Auth Service (M4 — real backend integration, Issue #113)
 *
 * Replaces the mock implementation with real calls to:
 *   REST  /api/auth/login   /api/auth/register   /api/auth/logout
 *   tRPC  user.getCurrentUser   user.updateUser
 *
 * Token strategy:
 *   - accessToken  : kept in module memory (cleared on page refresh, never in localStorage)
 *   - refreshToken : stored in a backend-set httpOnly cookie so sessions survive reloads
 *                    without exposing long-lived tokens to JavaScript
 *
 * The api-client handles silent token refresh automatically on 401 responses.
 */

import type { User, UserStatus } from '@/types';
import { apiClient, setTokens, clearTokens } from '@/lib/api-client';
import { derivePasswordVerifier } from '@/lib/passwordAuth';
import { clearSessionCookie, setSessionCookie } from '@/app/actions/session';

// ─── Backend response shapes ──────────────────────────────────────────────────

interface AuthTokensResponse {
  accessToken: string;
}

interface PasswordChallengeResponse {
  passwordSalt: string;
}

/** Shape returned by tRPC user.getCurrentUser (SELF_PROFILE_SELECT) */
interface BackendUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  publicProfile: boolean;
  /** Backend enum values are uppercase: ONLINE | IDLE | DND | OFFLINE */
  status: 'ONLINE' | 'IDLE' | 'DND' | 'OFFLINE';
  createdAt: string;
  /** Present when logged in as the dev system admin. */
  isSystemAdmin?: boolean;
}

const MANUAL_STATUS_KEY_PREFIX = 'harmony_manual_status';

// ─── Mapping helpers ──────────────────────────────────────────────────────────

/** Convert backend uppercase UserStatus to frontend lowercase. */
function mapStatus(s: BackendUser['status']): UserStatus {
  return s.toLowerCase() as UserStatus;
}

function mapBackendUser(b: BackendUser): User {
  return {
    id: b.id,
    username: b.username,
    displayName: b.displayName ?? b.username,
    avatar: b.avatarUrl ?? undefined,
    status: mapStatus(b.status),
    // Roles are server-scoped in the backend (stored in ServerMember, not User).
    // The global User object has no role field; use 'member' as a safe default.
    // UI that needs to check admin/owner status must compare user.id to
    // the server's ownerId or fetch server membership separately.
    role: b.isSystemAdmin ? 'owner' : 'member',
    isSystemAdmin: b.isSystemAdmin ?? false,
  };
}

function getManualStatusStorageKey(userId: string): string {
  return `${MANUAL_STATUS_KEY_PREFIX}:${userId}`;
}

export function getManualStatusOverride(
  userId: string,
): Extract<UserStatus, 'idle' | 'dnd' | 'offline'> | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(getManualStatusStorageKey(userId));
  return stored === 'idle' || stored === 'dnd' || stored === 'offline' ? stored : null;
}

function writeManualStatusOverride(userId: string, status: UserStatus | undefined): void {
  if (typeof window === 'undefined') return;
  const key = getManualStatusStorageKey(userId);
  if (status === 'idle' || status === 'dnd' || status === 'offline') {
    window.localStorage.setItem(key, status);
    return;
  }
  window.localStorage.removeItem(key);
}

function applyStoredManualStatusOverride(user: User): User {
  const manualOverride = getManualStatusOverride(user.id);
  if (manualOverride) {
    return { ...user, status: manualOverride };
  }
  return user;
}

export function shouldEnablePresenceTracking(user: Pick<User, 'id' | 'status'> | null): boolean {
  if (!user) return false;
  if (getManualStatusOverride(user.id)) return false;
  if (user.status === 'dnd') return false;
  return true;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns the current authenticated user by fetching from the backend.
 * Returns null if the session is missing or invalid. If only the httpOnly
 * refresh cookie remains after a reload, the api-client will receive a 401,
 * refresh with browser credentials, and retry this request.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
    return applyStoredManualStatusOverride(mapBackendUser(user));
  } catch {
    return null;
  }
}

/**
 * Authenticates a user with email + password.
 * Stores the returned JWT tokens and returns the fetched user profile.
 */
export async function login(email: string, password: string): Promise<User> {
  const { passwordSalt } = await apiClient.post<PasswordChallengeResponse>(
    '/api/auth/login/challenge',
    {
      email,
    },
  );
  const passwordVerifier = await derivePasswordVerifier(password, passwordSalt);
  const tokens = await apiClient.post<AuthTokensResponse>('/api/auth/login', {
    email,
    passwordVerifier,
  });
  setTokens(tokens.accessToken);
  await setSessionCookie(tokens.accessToken);

  const user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
  return applyStoredManualStatusOverride(mapBackendUser(user));
}

/**
 * Creates a new account and logs the user in.
 * If a displayName different from the username is provided, it is applied via
 * an immediate updateUser call so the profile reflects it straight away.
 */
export async function register(
  email: string,
  username: string,
  displayName: string,
  password: string,
): Promise<User> {
  const { passwordSalt } = await apiClient.post<PasswordChallengeResponse>(
    '/api/auth/register/challenge',
  );
  const passwordVerifier = await derivePasswordVerifier(password, passwordSalt);
  const tokens = await apiClient.post<AuthTokensResponse>('/api/auth/register', {
    email,
    username,
    passwordSalt,
    passwordVerifier,
  });
  setTokens(tokens.accessToken);
  await setSessionCookie(tokens.accessToken);

  let user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');

  // Backend defaults displayName to username; override if the user chose a different one.
  if (displayName && displayName !== username) {
    user = await apiClient.trpcMutation<BackendUser>('user.updateUser', { displayName });
  }

  return applyStoredManualStatusOverride(mapBackendUser(user));
}

/**
 * Revokes the httpOnly refresh cookie on the server and clears local token storage.
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/auth/logout');
  } catch {
    // Best-effort: clear tokens locally even if the server call fails
  }
  clearTokens();
  await clearSessionCookie();
}

/**
 * Updates the current user's profile fields and returns the updated user.
 * Throws if not authenticated.
 */
export async function updateCurrentUser(
  patch: Partial<Pick<User, 'displayName' | 'status'>>,
): Promise<User> {
  const input: Record<string, unknown> = {};
  if (patch.displayName !== undefined) input.displayName = patch.displayName;
  if (patch.status !== undefined) {
    // Convert frontend lowercase status to backend uppercase enum
    input.status = patch.status.toUpperCase();
  }

  const updated = await apiClient.trpcMutation<BackendUser>('user.updateUser', input);
  const mapped = mapBackendUser(updated);
  if (patch.status !== undefined) {
    writeManualStatusOverride(mapped.id, patch.status);
  }
  return applyStoredManualStatusOverride(mapped);
}

/**
 * No-op stub kept for backward-compatibility with AuthContext restore logic.
 * The real session state lives in the api-client's token storage.
 */
export function setCurrentUser(_user: User | null): void {
  // Token-based auth: no client-side user state to set here.
}

/**
 * Returns true if the current session resolves to a valid user.
 * Calls getCurrentUser() so it handles token refresh transparently —
 * a stale or revoked refresh token will return false rather than a false positive.
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
