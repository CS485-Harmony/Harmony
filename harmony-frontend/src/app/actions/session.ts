'use server';

import { cookies } from 'next/headers';

// Import from the shared constants module — can't export from 'use server' files.
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

/** Maximum cookie age: 7 days (matches backend refresh token TTL). */
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/** Shape of the session payload encoded in the auth cookie. */
interface SessionPayload {
  sub: string;
  username: string;
  role: string;
}

/**
 * Sets the auth session cookie (httpOnly, SameSite=Lax).
 *
 * Encodes `payload` as base64 JSON. This is intentionally NOT signed — it is
 * used only for routing decisions in middleware. All real authorization checks
 * are enforced server-side by the backend on every API/tRPC call.
 *
 * When real JWT auth lands (#113), swap the encoded payload for the raw JWT
 * access token received from the backend.
 */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, encoded, {
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
