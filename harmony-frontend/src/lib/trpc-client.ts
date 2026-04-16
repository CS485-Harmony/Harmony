/**
 * Server-side tRPC/API client for calling the Harmony backend.
 *
 * Uses plain HTTP (fetch) to call:
 *   - /api/public/*  for unauthenticated reads (servers, channels, messages)
 *   - /trpc/*        for authenticated tRPC procedures (mutations, authed queries)
 *
 * Designed for use in Next.js Server Components and Server Actions (server-side only).
 */

import { API_CONFIG } from './constants';
import { cookies } from 'next/headers';
import { createFrontendLogger } from './frontend-logger';
import { TrpcHttpError } from './trpc-errors';

export { TrpcHttpError } from './trpc-errors';

const logger = createFrontendLogger({ component: 'trpc-client' });

// ─── Auth helper ──────────────────────────────────────────────────────────────

/**
 * Reads the auth token from the cookie store (Next.js server-side).
 * Returns undefined if no token is available.
 */
async function getAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value;
  } catch {
    // cookies() throws when called outside a request context (e.g. build time)
    return undefined;
  }
}

// ─── Public REST helpers ──────────────────────────────────────────────────────

/**
 * GET from the public REST API. Returns null on 404, throws on other non-2xx responses.
 * Return type is `T | null` to make 404 handling explicit at call sites.
 */
export async function publicGet<T>(path: string): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  let res: Response;
  try {
    res = await fetch(`${API_CONFIG.BASE_URL}/api/public${path}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
      signal: controller.signal,
    });
  } catch (error) {
    logger.error('Public API request threw before completion', {
      feature: 'public-api',
      event: 'request_exception',
      method: 'GET',
      route: path,
      error,
    });
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    if (res.status === 404) return null;
    logger.warn('Public API request failed', {
      feature: 'public-api',
      event: 'http_failure',
      method: 'GET',
      route: path,
      statusCode: res.status,
    });
    throw new Error(`Public API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── tRPC HTTP helpers ────────────────────────────────────────────────────────

/**
 * Calls a tRPC query procedure via HTTP GET.
 * Input is JSON-serialized as a query parameter.
 */
export async function trpcQuery<T>(procedure: string, input?: unknown): Promise<T> {
  const url = new URL(`${API_CONFIG.BASE_URL}/trpc/${procedure}`);
  if (input !== undefined) {
    url.searchParams.set('input', JSON.stringify(input));
  }

  const token = await getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers,
      cache: 'no-store',
      signal: controller.signal,
    });
  } catch (error) {
    logger.error('tRPC query request threw before completion', {
      feature: 'trpc',
      event: 'request_exception',
      method: 'GET',
      procedure,
      route: `/trpc/${procedure}`,
      error,
    });
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text();
    logger.warn('tRPC query failed', {
      feature: 'trpc',
      event: 'http_failure',
      method: 'GET',
      procedure,
      route: `/trpc/${procedure}`,
      statusCode: res.status,
    });
    throw new TrpcHttpError(procedure, res.status, body);
  }

  const json = await res.json();
  const data = json.result?.data;
  if (data === undefined) {
    logger.error('tRPC query response missing result.data', {
      feature: 'trpc',
      event: 'invalid_response',
      method: 'GET',
      procedure,
      route: `/trpc/${procedure}`,
    });
    throw new Error(`tRPC query [${procedure}]: response missing result.data`);
  }
  return data as T;
}

// ─── Session user helper ──────────────────────────────────────────────────────

interface BackendSessionUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  status: 'ONLINE' | 'IDLE' | 'DND' | 'OFFLINE';
  isSystemAdmin?: boolean;
}

/**
 * Returns the currently authenticated user using the server-side cookie,
 * or null if no valid session exists.
 *
 * Safe to call from Server Components and Server Actions — uses the httpOnly
 * `auth_token` cookie forwarded to the backend as a Bearer token.
 */
export async function getSessionUser(): Promise<{
  id: string;
  username: string;
  displayName: string;
  isSystemAdmin: boolean;
} | null> {
  const token = await getAuthToken();
  if (!token) return null;
  try {
    const user = await trpcQuery<BackendSessionUser>('user.getCurrentUser');
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName ?? user.username,
      isSystemAdmin: user.isSystemAdmin ?? false,
    };
  } catch {
    return null;
  }
}

/**
 * Calls a tRPC mutation procedure via HTTP POST.
 */
export async function trpcMutate<T>(procedure: string, input?: unknown): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  let res: Response;
  try {
    res = await fetch(`${API_CONFIG.BASE_URL}/trpc/${procedure}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input ?? {}),
      signal: controller.signal,
    });
  } catch (error) {
    logger.error('tRPC mutation request threw before completion', {
      feature: 'trpc',
      event: 'request_exception',
      method: 'POST',
      procedure,
      route: `/trpc/${procedure}`,
      error,
    });
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text();
    logger.warn('tRPC mutation failed', {
      feature: 'trpc',
      event: 'http_failure',
      method: 'POST',
      procedure,
      route: `/trpc/${procedure}`,
      statusCode: res.status,
    });
    throw new TrpcHttpError(procedure, res.status, body);
  }

  const json = await res.json();
  const data = json.result?.data;
  if (data === undefined) {
    logger.error('tRPC mutation response missing result.data', {
      feature: 'trpc',
      event: 'invalid_response',
      method: 'POST',
      procedure,
      route: `/trpc/${procedure}`,
    });
    throw new Error(`tRPC mutation [${procedure}]: response missing result.data`);
  }
  return data as T;
}
