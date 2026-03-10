/**
 * Shared auth constants used by both the Next.js middleware (Edge runtime)
 * and server actions. Kept in a plain module (no 'use server' directive) so
 * both consumers can import without restriction.
 */

export const AUTH_COOKIE_NAME = 'auth_token';
