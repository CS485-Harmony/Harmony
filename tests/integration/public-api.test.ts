/**
 * SSRAPI-1 through SSRAPI-7: Public API path used by SSR metadata and page rendering
 *
 * SSRAPI-1 to SSRAPI-6: cloud-read-only
 * SSRAPI-7: local-only (burst traffic test)
 */

import {
  BACKEND_URL,
  LOCAL_SEEDS,
  CLOUD_KNOWN,
  isCloud,
  localOnlyDescribe,
} from './env';

const serverSlug = isCloud ? CLOUD_KNOWN.serverSlug : LOCAL_SEEDS.server.slug;
const publicChannel = isCloud ? CLOUD_KNOWN.publicChannel : LOCAL_SEEDS.channels.publicIndexable;

describe('Public API — SSR (cloud-read-only)', () => {
  test('SSRAPI-1: public server info returns id, name, slug, memberCount', async () => {
    const res = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      id?: string;
      name?: string;
      slug?: string;
      memberCount?: number;
    };
    expect(typeof body.id).toBe('string');
    expect(typeof body.name).toBe('string');
    expect(body.slug).toBe(serverSlug);
    expect(typeof body.memberCount).toBe('number');
  });

  test('SSRAPI-2: public server list endpoint is reachable and returns an array', async () => {
    const res = await fetch(`${BACKEND_URL}/api/public/servers`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('SSRAPI-3: public channel endpoint returns id, name, visibility', async () => {
    const res = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${publicChannel}`,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      id?: string;
      name?: string;
      visibility?: string;
    };
    expect(typeof body.id).toBe('string');
    expect(typeof body.name).toBe('string');
    expect(body.visibility).toBe('PUBLIC_INDEXABLE');
  });

  test('SSRAPI-4: public channel list returns only PUBLIC_INDEXABLE channels with expected fields', async () => {
    const res = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}/channels`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      channels?: Array<{
        id?: string;
        name?: string;
        slug?: string;
        type?: string;
        topic?: unknown;
        visibility?: string;
      }>;
    };
    expect(Array.isArray(body.channels)).toBe(true);
    const channels = body.channels ?? [];
    expect(channels.length).toBeGreaterThan(0);
    for (const ch of channels) {
      expect(typeof ch.id).toBe('string');
      expect(typeof ch.name).toBe('string');
      expect(typeof ch.slug).toBe('string');
      expect(typeof ch.type).toBe('string');
      // visibility field must not be present per SSRAPI-4
      expect(ch.visibility).toBeUndefined();
    }
  });

  test('SSRAPI-5: unknown server slug returns 404', async () => {
    const res = await fetch(`${BACKEND_URL}/api/public/servers/nonexistent-server-slug-xyz`);
    expect(res.status).toBe(404);
  });

  test('SSRAPI-6: SSR metadata renders title and meta description for a public channel page', async () => {
    const { FRONTEND_URL } = await import('./env');
    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicChannel}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<title[^>]*>/i);
    expect(html).toMatch(/<meta[^>]+name=["']description["']/i);
  });
});

// SSRAPI-7 is local-only (burst traffic could affect other users on cloud IPs)
localOnlyDescribe('Public API rate limiter (local-only)', () => {
  test('SSRAPI-7: >100 requests/min from same IP returns 429', async () => {
    const endpoint = `${BACKEND_URL}/api/public/servers`;
    const requests = Array.from({ length: 110 }, () => fetch(endpoint));
    const responses = await Promise.all(requests);
    const statuses = responses.map((r) => r.status);
    const has429 = statuses.some((s) => s === 429);
    expect(has429).toBe(true);
  }, 30000);
});
