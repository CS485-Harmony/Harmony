/**
 * Auth Service (M4 — real backend integration, Issue #113)
 *
 * Replaces the mock implementation with real calls to:
 *   REST  /api/auth/login   /api/auth/register   /api/auth/logout
 *   tRPC  user.getCurrentUser   user.updateUser
 *
 * Token strategy:
 *   - accessToken  : kept in module memory (cleared on page refresh, never in localStorage)
 *   - refreshToken : stored in localStorage so sessions survive page reloads
 *
 * The api-client handles silent token refresh automatically on 401 responses.
 */

import type { User, UserStatus } from '@/types';
import {
  apiClient,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from '@/lib/api-client';
import { derivePasswordVerifier } from '@/lib/passwordAuth';

// ─── Backend response shapes ──────────────────────────────────────────────────

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
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

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns the current authenticated user by fetching from the backend.
 * Returns null if no access token is present or the token is expired/invalid.
 * The api-client will silently refresh the access token if a refresh token is
 * available, so callers rarely need to handle 401 themselves.
 */
export async function getCurrentUser(): Promise<User | null> {
  // No access token and no refresh token → definitely not logged in
  if (!getAccessToken() && !getRefreshToken()) return null;
  try {
    const user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
    return mapBackendUser(user);
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
  setTokens(tokens.accessToken, tokens.refreshToken);

  const user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
  return mapBackendUser(user);
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
  setTokens(tokens.accessToken, tokens.refreshToken);

  let user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');

  // Backend defaults displayName to username; override if the user chose a different one.
  if (displayName && displayName !== username) {
    user = await apiClient.trpcMutation<BackendUser>('user.updateUser', { displayName });
  }

  return mapBackendUser(user);
}

/**
 * Revokes the stored refresh token on the server and clears local token storage.
 */
export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await apiClient.post('/api/auth/logout', { refreshToken });
    } catch {
      // Best-effort: clear tokens locally even if the server call fails
    }
  }
  clearTokens();
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
  return mapBackendUser(updated);
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
