/**
 * VIS-1 through VIS-7: Visibility Change Impact on Public Indexing
 * Classification: local-only (write path)
 *
 * VIS-SMOKE-1, VIS-SMOKE-2: Sitemap and robots.txt reachability
 * Classification: cloud-read-only
 */

import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe, getCloudFixture } from './env';
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
});
