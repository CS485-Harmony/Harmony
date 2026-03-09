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

const BASE = API_CONFIG.BASE_URL;

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
 * GET from the public REST API. Throws on non-2xx responses.
 */
export async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api/public${path}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });
  if (!res.ok) {
    if (res.status === 404) return null as T;
    throw new Error(`Public API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ─── tRPC HTTP helpers ────────────────────────────────────────────────────────

/**
 * Calls a tRPC query procedure via HTTP GET.
 * Input is JSON-serialized as a query parameter.
 */
export async function trpcQuery<T>(
  procedure: string,
  input?: unknown,
): Promise<T> {
  const url = new URL(`${BASE}/trpc/${procedure}`);
  if (input !== undefined) {
    url.searchParams.set('input', JSON.stringify(input));
  }

  const token = await getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`tRPC query error [${procedure}]: ${res.status} — ${body}`);
  }

  const json = await res.json();
  return json.result?.data as T;
}

/**
 * Calls a tRPC mutation procedure via HTTP POST.
 */
export async function trpcMutate<T>(
  procedure: string,
  input?: unknown,
): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}/trpc/${procedure}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input ?? {}),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`tRPC mutation error [${procedure}]: ${res.status} — ${body}`);
  }

  const json = await res.json();
  return json.result?.data as T;
}
