import request from 'supertest';
import { createApp } from '../src/app';
import type { Express } from 'express';

let app: Express;

beforeAll(() => {
  app = createApp();
});

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', service: 'backend-api' });
    expect(typeof res.body.instanceId).toBe('string');
    expect(res.body.instanceId.length).toBeGreaterThan(0);
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('returns X-Instance-Id header matching body instanceId', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.headers['x-instance-id']).toBe(res.body.instanceId);
  });
});

describe('GET /trpc/health', () => {
  it('returns 200 with tRPC result envelope', async () => {
    const res = await request(app).get('/trpc/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ result: { data: { status: 'ok' } } });
    expect(typeof res.body.result.data.timestamp).toBe('string');
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: 'Not found' });
  });
});

describe('CORS', () => {
  it('returns 403 for disallowed origins', async () => {
    const res = await request(app).get('/health').set('Origin', 'https://evil.example.com');
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ error: 'CORS: origin not allowed' });
  });

  it('allows requests from localhost:3000', async () => {
    const res = await request(app).get('/health').set('Origin', 'http://localhost:3000');
    expect(res.status).toBe(200);
  });

  describe('FRONTEND_URL comma-separated origins', () => {
    const originalEnv = process.env.FRONTEND_URL;

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env.FRONTEND_URL;
      } else {
        process.env.FRONTEND_URL = originalEnv;
      }
    });

    it('allows the single URL when FRONTEND_URL has no comma', async () => {
      process.env.FRONTEND_URL = 'https://harmony-dun-omega.vercel.app';
      const res = await request(createApp())
        .get('/health')
        .set('Origin', 'https://harmony-dun-omega.vercel.app');
      expect(res.status).toBe(200);
    });

    it('allows all URLs when FRONTEND_URL is comma-separated', async () => {
      process.env.FRONTEND_URL = 'https://harmony-dun-omega.vercel.app,https://harmony.chat';
      const freshApp = createApp();

      const r1 = await request(freshApp)
        .get('/health')
        .set('Origin', 'https://harmony-dun-omega.vercel.app');
      expect(r1.status).toBe(200);

      const r2 = await request(freshApp).get('/health').set('Origin', 'https://harmony.chat');
      expect(r2.status).toBe(200);
    });

    it('rejects origins not in the comma-separated list', async () => {
      process.env.FRONTEND_URL = 'https://harmony-dun-omega.vercel.app,https://harmony.chat';
      const res = await request(createApp())
        .get('/health')
        .set('Origin', 'https://evil.example.com');
      expect(res.status).toBe(403);
    });
  });
});
