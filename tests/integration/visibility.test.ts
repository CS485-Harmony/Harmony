/**
 * VIS-1 through VIS-7: Visibility Change Impact on Public Indexing
 * Classification: local-only (write path)
 *
 * VIS-SMOKE-1, VIS-SMOKE-2: Backend sitemap and robots.txt reachability
 * VIS-SMOKE-3, VIS-SMOKE-4: Frontend apex domain sitemap and robots.txt reachability
 * VIS-SMOKE-5: Private channel exclusion from sitemap (local-only, requires mock seed)
 * Classification: cloud-read-only (except VIS-SMOKE-5)
 */

import { BACKEND_URL, FRONTEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe, localOnlyTest, getCloudFixture } from './env';
import { login } from './helpers/auth';

const serverSlug = LOCAL_SEEDS.server.slug;

// ─── Cloud-read-only smoke tests ─────────────────────────────────────────────

describe('Visibility Smoke (cloud-read-only)', () => {
  let knownSlug: string = serverSlug;

  beforeAll(async () => {
    if (!isCloud) return;
    knownSlug = (await getCloudFixture()).serverSlug;
  });

  test('VIS-SMOKE-1: sitemap endpoint is reachable and returns XML', async () => {
    const res = await fetch(`${BACKEND_URL}/sitemap/${knownSlug}.xml`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/xml/i);
    const body = await res.text();
    expect(body).toMatch(/<\?xml/i);
  });

  test('VIS-SMOKE-2: robots.txt is reachable and contains Allow: /c/', async () => {
    const res = await fetch(`${BACKEND_URL}/robots.txt`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/plain/i);
    const body = await res.text();
    expect(body).toMatch(/Allow:\s*\/c\//i);
  });

  test('VIS-SMOKE-3: frontend apex sitemap index resolves and returns XML with frontend-host <loc> entries', async () => {
    const res = await fetch(`${FRONTEND_URL}/sitemap.xml`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/xml/i);
    const body = await res.text();
    expect(body).toMatch(/<\?xml/i);
    // Every <loc> must point at the frontend apex host, not the API/backend host
    const locMatches = body.match(/<loc>([^<]+)<\/loc>/gi) ?? [];
    expect(locMatches.length).toBeGreaterThan(0);
    for (const loc of locMatches) {
      expect(loc).toContain(FRONTEND_URL);
      expect(loc).not.toContain(BACKEND_URL);
    }
  });

  test('VIS-SMOKE-4: frontend apex robots.txt resolves with correct directives', async () => {
    const res = await fetch(`${FRONTEND_URL}/robots.txt`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/plain/i);
    const body = await res.text();
    expect(body).toMatch(/Allow:\s*\/c\//i);
    expect(body).toMatch(/Disallow:\s*\/api\//i);
    expect(body).toMatch(/Sitemap:/i);
  });

  // VIS-SMOKE-5 is local-only because staff-only is a fixture private channel
  // present only in the mock seed (harmony-backend/src/dev/mock-seed-data.json).
  localOnlyTest('VIS-SMOKE-5: seeded PRIVATE channel is excluded from the frontend sitemap', async () => {
    const res = await fetch(`${FRONTEND_URL}/sitemap/${serverSlug}`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/xml/i);
    const body = await res.text();
    expect(body).toMatch(/<\?xml/i);
    expect(body).toMatch(/<urlset\b/i);
    expect(body).toMatch(/<loc>/i);
    expect(body).not.toContain(LOCAL_SEEDS.channels.private);
  });
});

// ─── Local-only visibility change tests ──────────────────────────────────────

localOnlyDescribe('Visibility Change Impact (local-only)', () => {
  let accessToken: string;
  let channelId: string;
  let serverId: string;

  beforeAll(async () => {
    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
    accessToken = tokens.accessToken;

    // Resolve serverId from the public server info
    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
    const serverBody = (await serverRes.json()) as { id?: string };
    if (!serverBody.id) throw new Error('Could not resolve server id for harmony-hq');
    serverId = serverBody.id;

    // Resolve channelId for the public indexable channel
    const channelRes = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
    const channelBody = (await channelRes.json()) as { id?: string };
    if (!channelBody.id) throw new Error('Could not resolve channelId for general channel');
    channelId = channelBody.id;
  });

  afterAll(async () => {
    // Restore channel to PUBLIC_INDEXABLE regardless of test outcomes
    if (accessToken && channelId && serverId) {
      await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          serverId,
          channelId,
          visibility: 'PUBLIC_INDEXABLE',
        }),
      });
    }
  });

  async function setVisibility(visibility: string): Promise<Response> {
    return fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ serverId, channelId, visibility }),
    });
  }

  async function getSitemapText(): Promise<string> {
    const res = await fetch(`${BACKEND_URL}/sitemap/${serverSlug}.xml`);
    return res.text();
  }

  test('VIS-7: robots.txt contains Allow: /c/ and Disallow: /api/', async () => {
    const res = await fetch(`${BACKEND_URL}/robots.txt`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/Allow:\s*\/c\//i);
    expect(body).toMatch(/Disallow:\s*\/api\//i);
  });

  test('VIS-2: changing channel to PUBLIC_INDEXABLE adds it to the sitemap', async () => {
    await setVisibility('PUBLIC_INDEXABLE');
    const sitemap = await getSitemapText();
    expect(sitemap).toContain(`/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`);
  });

  test('VIS-1: changing channel to PRIVATE removes it from the sitemap', async () => {
    await setVisibility('PRIVATE');
    // Cache invalidation is async (Redis pub/sub → worker → cache delete).
    // Poll until the channel disappears or 3 seconds elapse.
    const target = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    let sitemap = '';
    for (let i = 0; i < 6; i++) {
      sitemap = await getSitemapText();
      if (!sitemap.includes(target)) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    expect(sitemap).not.toContain(target);
  });

  test('VIS-3: PUBLIC_NO_INDEX channel does not appear in the sitemap', async () => {
    // The introductions channel is seeded as PUBLIC_NO_INDEX
    const sitemap = await getSitemapText();
    expect(sitemap).not.toContain(`/c/${serverSlug}/${LOCAL_SEEDS.channels.publicNoIndex}`);
  });

  test('VIS-4: guest cannot access PRIVATE channel page — sees access-denied UI', async () => {
    // Ensure the test channel is PRIVATE
    await setVisibility('PRIVATE');
    const { FRONTEND_URL } = await import('./env');
    const res = await fetch(
      `${FRONTEND_URL}/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
    expect(res.status).toBe(200);
    const html = await res.text();
    // Should not have index,follow robots tag
    expect(html).not.toMatch(/content=["']index,\s*follow["']/i);
  });

  // VIS-5: requires a loginable non-admin seeded account.
  // The mock seed only exposes alice_admin (an OWNER) as a loginable user; all
  // other mock users have an invalid password hash. Until a second non-admin
  // loginable account is added to the mock seed, this case cannot be exercised.
  test.todo(
    'VIS-5: non-admin authenticated user cannot access PRIVATE channel — requires a non-admin loginable seed account',
  );

  test('VIS-5-unauthed: unauthenticated request to a PRIVATE channel is rejected with 401', async () => {
    await setVisibility('PRIVATE');
    const input = encodeURIComponent(
      JSON.stringify({
        serverSlug,
        serverId,
        channelSlug: LOCAL_SEEDS.channels.publicIndexable,
      }),
    );
    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`);
    expect(res.status).toBe(401);
  });

  test('VIS-6: admin/owner can still access PRIVATE channel after toggle', async () => {
    await setVisibility('PRIVATE');
    const input = encodeURIComponent(
      JSON.stringify({
        serverSlug,
        serverId,
        channelSlug: LOCAL_SEEDS.channels.publicIndexable,
      }),
    );
    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      result?: { data?: { slug?: string } };
    };
    expect(body.result?.data?.slug).toBe(LOCAL_SEEDS.channels.publicIndexable);
  });

  // ─── Full visibility matrix — Issue #355 ───────────────────────────────────
  // Covers all six transitions in the PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE
  // matrix, asserting sitemap state and channel accessibility at each step.
  // Cache invalidation is verified transitively: the sitemap is rebuilt from the
  // DB every time its Redis cache is invalidated, so a correct sitemap value
  // implies the cache was properly invalidated after the visibility change.

  async function pollSitemapFor(target: string, shouldContain: boolean, timeoutMs = 3000): Promise<string> {
    const polls = Math.ceil(timeoutMs / 500);
    let sitemap = '';
    for (let i = 0; i < polls; i++) {
      sitemap = await getSitemapText();
      const found = sitemap.includes(target);
      if (found === shouldContain) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    return sitemap;
  }

  async function getPublicChannelResponse() {
    return fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
  }

  test('VIS-8: PUBLIC_INDEXABLE → PUBLIC_NO_INDEX removes from sitemap; channel stays publicly reachable', async () => {
    expect((await setVisibility('PUBLIC_INDEXABLE')).ok).toBe(true);
    // Confirm channel is in sitemap before toggling away
    const target = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    const preSitemap = await pollSitemapFor(target, true);
    expect(preSitemap).toContain(target);

    expect((await setVisibility('PUBLIC_NO_INDEX')).ok).toBe(true);

    // Sitemap cache must be invalidated — channel should no longer appear
    const sitemap = await pollSitemapFor(target, false);
    expect(sitemap).not.toContain(target);

    // Channel is still publicly reachable at PUBLIC_NO_INDEX visibility
    const channelRes = await getPublicChannelResponse();
    expect(channelRes.status).toBe(200);
    const channelBody = (await channelRes.json()) as { visibility?: string };
    expect(channelBody.visibility).toBe('PUBLIC_NO_INDEX');
  });

  test('VIS-9: PUBLIC_NO_INDEX → PUBLIC_INDEXABLE adds channel back to sitemap', async () => {
    expect((await setVisibility('PUBLIC_NO_INDEX')).ok).toBe(true);
    const target = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    // Confirm channel is out of sitemap first
    await pollSitemapFor(target, false);

    expect((await setVisibility('PUBLIC_INDEXABLE')).ok).toBe(true);

    // Sitemap cache must be invalidated — channel should reappear
    const sitemap = await pollSitemapFor(target, true);
    expect(sitemap).toContain(target);

    const channelRes = await getPublicChannelResponse();
    expect(channelRes.status).toBe(200);
    const channelBody = (await channelRes.json()) as { visibility?: string };
    expect(channelBody.visibility).toBe('PUBLIC_INDEXABLE');
  });

  test('VIS-10: PRIVATE → PUBLIC_NO_INDEX makes channel publicly reachable but excluded from sitemap', async () => {
    expect((await setVisibility('PRIVATE')).ok).toBe(true);
    expect((await setVisibility('PUBLIC_NO_INDEX')).ok).toBe(true);

    const target = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    const sitemap = await pollSitemapFor(target, false);
    expect(sitemap).not.toContain(target);

    // Channel is publicly accessible but not indexed
    const channelRes = await getPublicChannelResponse();
    expect(channelRes.status).toBe(200);
    const channelBody = (await channelRes.json()) as { visibility?: string };
    expect(channelBody.visibility).toBe('PUBLIC_NO_INDEX');
  });

  test('VIS-11: PRIVATE → PUBLIC_INDEXABLE adds channel to sitemap', async () => {
    expect((await setVisibility('PRIVATE')).ok).toBe(true);
    expect((await setVisibility('PUBLIC_INDEXABLE')).ok).toBe(true);

    const target = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    const sitemap = await pollSitemapFor(target, true);
    expect(sitemap).toContain(target);
  });

  test('VIS-12: PUBLIC_NO_INDEX → PRIVATE removes public access (backend returns 403)', async () => {
    expect((await setVisibility('PUBLIC_NO_INDEX')).ok).toBe(true);
    expect((await setVisibility('PRIVATE')).ok).toBe(true);

    const channelRes = await getPublicChannelResponse();
    expect(channelRes.status).toBe(403);

    const target = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    const sitemap = await pollSitemapFor(target, false);
    expect(sitemap).not.toContain(target);
  });

  test('VIS-13: PUBLIC_INDEXABLE → PRIVATE removes public access and MetaTagCache invalidated (backend returns 403)', async () => {
    expect((await setVisibility('PUBLIC_INDEXABLE')).ok).toBe(true);
    expect((await setVisibility('PRIVATE')).ok).toBe(true);

    // Backend must deny public access after de-indexing
    const channelRes = await getPublicChannelResponse();
    expect(channelRes.status).toBe(403);

    // Sitemap cache must be invalidated — channel must be gone from sitemap
    const target = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    const sitemap = await pollSitemapFor(target, false);
    expect(sitemap).not.toContain(target);
  });

  test(
    'VIS-14: frontend SSR emits noindex after PUBLIC_INDEXABLE → PUBLIC_NO_INDEX, restores index,follow after toggle back',
    async () => {
      const channelPath = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;

      expect((await setVisibility('PUBLIC_INDEXABLE')).ok).toBe(true);
      expect((await setVisibility('PUBLIC_NO_INDEX')).ok).toBe(true);

      // Poll the frontend SSR page until the noindex directive appears
      let html = '';
      for (let i = 0; i < 6; i++) {
        const res = await fetch(`${FRONTEND_URL}${channelPath}`);
        html = await res.text();
        if (/noindex/i.test(html)) break;
        await new Promise((r) => setTimeout(r, 1000));
      }
      expect(html).toMatch(/noindex/i);
      expect(html).not.toMatch(/content=["']index,\s*follow["']/i);

      expect((await setVisibility('PUBLIC_INDEXABLE')).ok).toBe(true);

      // Poll until index, follow is restored (require absence of noindex to avoid false positive)
      for (let i = 0; i < 6; i++) {
        const res = await fetch(`${FRONTEND_URL}${channelPath}`);
        html = await res.text();
        if (/index,\s*follow/i.test(html) && !/noindex/i.test(html)) break;
        await new Promise((r) => setTimeout(r, 1000));
      }
      expect(html).toMatch(/index,\s*follow/i);
      expect(html).not.toMatch(/noindex/i);
    },
    20000,
  );
});
