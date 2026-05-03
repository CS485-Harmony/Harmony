'use server';

import { cookies } from 'next/headers';

// Import from the shared constants module — can't export from 'use server' files.
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

/** Maximum cookie age: 7 days (matches backend refresh token TTL). */
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/**
 * Sets the auth session cookie (httpOnly, SameSite=Lax).
 *
 * Stores the raw JWT access token so that server-side tRPC calls
 * (in trpc-client.ts) can forward it as a Bearer token to the backend.
 * The middleware verifies the JWT signature before making routing decisions.
 */
export async function setSessionCookie(accessToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

/**
 * Clears the auth session cookie on logout.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
