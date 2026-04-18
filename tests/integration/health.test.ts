/**
 * HC-1: Backend API health endpoint
 * Classification: cloud-read-only
 */

import { BACKEND_URL } from './env';

describe('Health Check', () => {
  test('HC-1: backend /health responds with HTTP 200', async () => {
    const res = await fetch(`${BACKEND_URL}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBeTruthy();
  });
});
