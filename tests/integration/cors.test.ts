/**
 * CORS-1 through CORS-3: CORS Header Verification
 * Classification: cloud-read-only
 */

import { BACKEND_URL, FRONTEND_URL, isCloud, LOCAL_SEEDS } from './env';
import { login } from './helpers/auth';

const allowedOrigin = FRONTEND_URL;

describe('CORS Header Verification', () => {
  test('CORS-1: OPTIONS preflight returns correct CORS headers for allowed origin', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: allowedOrigin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    // Some servers return 200 or 204 for preflight
    expect([200, 204]).toContain(res.status);
    const acao = res.headers.get('access-control-allow-origin');
    expect(acao).toBe(allowedOrigin);
    const acac = res.headers.get('access-control-allow-credentials');
    expect(acac).toBe('true');
  });

  test('CORS-2: OPTIONS preflight from unlisted origin is rejected', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil.example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    const acao = res.headers.get('access-control-allow-origin');
    // Either 403 with error body, or no ACAO header (browser would block)
    const isBlocked =
      res.status === 403 || acao === null || acao === '' || acao === 'null';
    expect(isBlocked).toBe(true);
  });

  test('CORS-3: authenticated SSR fetch includes Authorization bearer and backend returns 200', async () => {
    if (isCloud) {
      // In cloud mode this test requires a provisioned test account token.
      // Skip when CLOUD_TEST_ACCESS_TOKEN is not set.
      const token = process.env.CLOUD_TEST_ACCESS_TOKEN;
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
      return;
    }

    // Local mode: login with alice_admin and call an authenticated endpoint
    const { accessToken } = await login(
      LOCAL_SEEDS.alice.email,
      LOCAL_SEEDS.alice.password,
    );
    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: FRONTEND_URL,
      },
    });
    expect(res.status).toBe(200);
  });
});
