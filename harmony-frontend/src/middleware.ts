/**
 * Next.js Middleware — Server-Side Route Protection (Issue #119)
 *
 * Intercepts requests to protected routes and redirects unauthenticated users
 * to /auth/login immediately, eliminating the 3-4s client-side spinner (#71).
 *
 * Protected routes:
 *   /channels/*  — require authentication
 *   /settings/*  — require authentication (role enforcement is page-level)
 *
 * The middleware reads the `auth_token` httpOnly cookie set by the
 * `setSessionCookie` server action (or, after #113, by the backend directly).
 *
 * The cookie is verified with the same JWT_ACCESS_SECRET used by the backend
 * before protected routes are allowed through.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose/jwt/verify';
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

// NOTE: Role-based access for /settings/* is intentionally NOT enforced here.
// Roles in the backend are server-scoped (stored in ServerMember, not User),
// so the middleware cannot reliably determine admin status for a given server.
// /settings/* pages must enforce this themselves via a server component that
// fetches the server's membership and checks ownerId / role.

interface SessionPayload {
  sub: string;
  username: string;
}

/**
 * Verifies the signed access-token cookie before using its claims for routing.
 *
 * Returns null if the cookie is missing, malformed, expired, signed with the
 * wrong secret, or missing the required subject claim.
 */
async function verifySessionCookie(cookieValue: string): Promise<SessionPayload | null> {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  if (!accessSecret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(cookieValue, new TextEncoder().encode(accessSecret), {
      algorithms: ['HS256'],
    });

    if (typeof payload.sub !== 'string') {
      return null;
    }

    return {
      sub: payload.sub,
      username: typeof payload.username === 'string' ? payload.username : '',
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isChannelsRoute = pathname.startsWith('/channels/') || pathname === '/channels';
  const isSettingsRoute = pathname.startsWith('/settings/') || pathname === '/settings';

  if (!isChannelsRoute && !isSettingsRoute) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // ── Unauthenticated ───────────────────────────────────────────────────────
  if (!tokenCookie?.value) {
    // /channels/[serverSlug]/[channelSlug] → hand off to the public guest route
    // which checks visibility and renders or shows a locked pane accordingly.
    const channelRouteMatch = pathname.match(/^\/channels\/([^/]+)\/([^/]+)$/);
    if (channelRouteMatch) {
      const guestUrl = new URL(`/c/${channelRouteMatch[1]}/${channelRouteMatch[2]}`, request.url);
      return NextResponse.redirect(guestUrl);
    }

    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySessionCookie(tokenCookie.value);

  // Malformed cookie — treat as unauthenticated
  if (!session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear the bad cookie
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/channels/:path*', '/settings/:path*'],
};
