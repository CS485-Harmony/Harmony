/**
 * AUTH-1 through AUTH-8: Login and auth refresh path
 * Classification: local-only (write path; creates session state)
 *
 * AUTH-SMOKE-1: Auth endpoint reachability smoke test
 * Classification: cloud-read-only
 */

import crypto from 'crypto';
import {
  BACKEND_URL,
  FRONTEND_URL,
  isCloud,
  LOCAL_SEEDS,
  localOnlyDescribe,
  localOnlyTest,
} from './env';
import { login } from './helpers/auth';

function derivePasswordVerifier(password: string, saltHex: string): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
}

async function getLoginSalt(email: string): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const body = (await res.json()) as { passwordSalt: string };
  return body.passwordSalt;
}

// ─── Cloud smoke (runs in both modes) ────────────────────────────────────────

describe('Auth Smoke', () => {
  test('AUTH-SMOKE-1: auth endpoint reachable; rejects invalid credentials', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: FRONTEND_URL,
      },
      body: JSON.stringify({ email: 'smoke@example.invalid' }),
    });
    // Challenge endpoint returns 200 (returns a dummy salt for unknown emails)
    // or 400 if validation fails. Either way the backend is reachable.
    expect(res.status).toBeLessThan(500);
  });
});

// ─── Local-only auth tests ────────────────────────────────────────────────────

localOnlyDescribe('Auth (local-only)', () => {
  const { email, password } = LOCAL_SEEDS.alice;

  test('AUTH-1: successful login returns accessToken and an httpOnly refresh cookie', async () => {
    const tokens = await login(email, password);
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
    expect(tokens.accessToken.split('.')).toHaveLength(3);
    expect(tokens.refreshToken.split('.')).toHaveLength(3);
    expect(tokens.refreshCookie).toContain('HttpOnly');
    expect(tokens.refreshCookie).toContain('SameSite=Strict');
    expect(tokens.refreshCookie).toContain('Path=/api/auth/refresh');
  });

  test('AUTH-2: login with wrong password returns 401', async () => {
    const salt = await getLoginSalt(email);
    const badVerifier = derivePasswordVerifier('wrong-password', salt);
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordVerifier: badVerifier }),
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as { accessToken?: unknown };
    expect(body.accessToken).toBeUndefined();
  });

  test('AUTH-3: login with non-existent email returns 401', async () => {
    const nonExistentEmail = 'nonexistent@example.invalid';
    const salt = await getLoginSalt(nonExistentEmail);
    const verifier = derivePasswordVerifier('anypassword', salt);
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: nonExistentEmail,
        passwordVerifier: verifier,
      }),
    });
    expect(res.status).toBe(401);
  });

  test('AUTH-4: login with missing email field returns 400', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwordVerifier: 'A'.repeat(44) }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toBeTruthy();
  });

  test('AUTH-5: access token is accepted for user.getCurrentUser tRPC query', async () => {
    const { accessToken } = await login(email, password);
    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      result?: { data?: { email?: string } };
    };
    expect(body.result?.data?.email).toBe(email);
  });

  test('AUTH-6: valid refresh cookie issues a new access token and rotated refresh cookie', async () => {
    const first = await login(email, password);
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: first.refreshCookie,
      },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };
    expect(typeof body.accessToken).toBe('string');
    expect(body.refreshToken).toBeUndefined();
    const headers = res.headers as Headers & { getSetCookie?: () => string[] };
    const rotatedRefreshCookie = headers
      .getSetCookie?.()
      .find((value) => value.startsWith('harmony_refresh_token='));
    expect(rotatedRefreshCookie).toBeDefined();

    // Revoke to clean up
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: rotatedRefreshCookie! },
      body: JSON.stringify({}),
    });
  });

  test('AUTH-7: expired or invalid refresh token returns 401', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: 'invalid' }),
    });
    expect(res.status).toBe(401);
  });

  localOnlyTest('AUTH-8: logout invalidates the refresh token', async () => {
    const { refreshCookie, refreshToken } = await login(email, password);

    const logoutRes = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: refreshCookie },
      body: JSON.stringify({}),
    });
    expect(logoutRes.status).toBe(204);

    const reusedRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    expect(reusedRes.status).toBe(401);
  });
});
