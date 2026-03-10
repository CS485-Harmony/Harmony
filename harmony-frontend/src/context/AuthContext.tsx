'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types';
import * as authService from '@/services/authService';
import { setSessionCookie, clearSessionCookie } from '@/app/actions/session';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, displayName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<Pick<User, 'displayName' | 'status'>>) => Promise<void>;
  /**
   * Returns true if the current user has admin-level access.
   * Pass `serverOwnerId` to check ownership of a specific server — this is the
   * reliable path since User.role is not populated from the backend.
   * Without `serverOwnerId`, falls back to checking User.role (always 'member'
   * until a global-role endpoint is added).
   */
  isAdmin: (serverOwnerId?: string) => boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: try to restore session via the refresh token (if present).
  // The api-client will transparently use the stored refresh token to get
  // a fresh access token if needed. If a user is restored, also refresh the
  // httpOnly middleware cookie so server-side route protection stays active.
  useEffect(() => {
    authService
      .getCurrentUser()
      .then(async restored => {
        if (restored) {
          setUser(restored);
          // Re-set the httpOnly cookie so middleware can continue protecting
          // routes without requiring a full re-login.
          await setSessionCookie({ sub: restored.id, username: restored.username, role: restored.role });
        }
      })
      .catch(() => {
        // No valid session — stay logged out
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    // Set httpOnly session cookie so middleware can protect routes server-side.
    // When #113 lands with real JWT, this call is replaced by the backend
    // setting the cookie via Set-Cookie on the /api/auth/login response.
    await setSessionCookie({ sub: loggedInUser.id, username: loggedInUser.username, role: loggedInUser.role });
  }, []);

  const register = useCallback(
    async (email: string, username: string, displayName: string, password: string) => {
      const newUser = await authService.register(email, username, displayName, password);
      setUser(newUser);
      await setSessionCookie({ sub: newUser.id, username: newUser.username, role: newUser.role });
    },
    [],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    await clearSessionCookie();
  }, []);

  const updateUser = useCallback(
    async (patch: Partial<Pick<User, 'displayName' | 'status'>>) => {
      const updated = await authService.updateCurrentUser(patch);
      setUser(updated);
    },
    [],
  );

  const isAdmin = useCallback((serverOwnerId?: string) => {
    if (!user) return false;
    if (serverOwnerId) return user.id === serverOwnerId;
    return user.role === 'owner' || user.role === 'admin';
  }, [user]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
