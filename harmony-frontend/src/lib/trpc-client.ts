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
import { TrpcHttpError } from './trpc-errors';

export { TrpcHttpError } from './trpc-errors';

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
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/public${path}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
      signal: controller.signal,
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Public API error: ${res.status}`);
    }
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
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
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new TrpcHttpError(procedure, res.status, body);
  }

  const json = await res.json();
  const data = json.result?.data;
  if (data === undefined)
    throw new Error(`tRPC query [${procedure}]: response missing result.data`);
  return data as T;
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
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new TrpcHttpError(procedure, res.status, body);
  }

  const json = await res.json();
  const data = json.result?.data;
  if (data === undefined)
    throw new Error(`tRPC mutation [${procedure}]: response missing result.data`);
  return data as T;
}
