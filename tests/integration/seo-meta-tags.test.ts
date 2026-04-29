/**
 * SEO Meta Tag Generation — AC-1 through AC-10
 * Traceable one-to-one to §14 of docs/dev-spec-seo-meta-tag-generation.md
 *
 * Cloud-read-only: AC-1, AC-2, AC-8, crawler-UA assertions (3 public channels)
 * Local-only (write path): AC-3, AC-4, AC-5, AC-6, AC-7, AC-10
 * test.todo: AC-9 (requires fault injection, covered by backend unit tests)
 *
 * Write-path ACs (AC-3 through AC-7, AC-10) fall back to local evidence because
 * an isolated Sprint 5 staging environment was not provisioned in time. This
 * limitation is documented in docs/deployment/deployment-architecture.md §12.2.
 */

import {
  BACKEND_URL,
  FRONTEND_URL,
  LOCAL_SEEDS,
  isCloud,
  localOnlyDescribe,
  getCloudFixture,
} from './env';
import { login } from './helpers/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractMetaContent(html: string, name: string): string | null {
  const m =
    html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
    html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'));
  return m?.[1] ?? null;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1]?.trim() ?? null;
}

function extractJsonLd(html: string): Record<string, unknown> | null {
  const m = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!m) return null;
  try {
    return JSON.parse(m[1]) as Record<string, unknown>;
  } catch {
    console.error('extractJsonLd: failed to parse JSON-LD:', m[1]);
    return null;
  }
}

async function pollUntil<T>(
  fn: () => Promise<T>,
  predicate: (v: T) => boolean,
  opts: { intervalMs?: number; timeoutMs?: number } = {},
): Promise<T> {
  const interval = opts.intervalMs ?? 500;
  const timeout = opts.timeoutMs ?? 4000;
  const polls = Math.ceil(timeout / interval);
  let last: T = await fn();
  for (let i = 0; i < polls; i++) {
    if (predicate(last)) return last;
    await new Promise((r) => setTimeout(r, interval));
    last = await fn();
  }
  return last;
}

// PII / profanity patterns mirrored from contentFilter.ts for assertion
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(?:\+?\d[\d\s\-().]{6,}\d)/;
const MENTION_RE = /@[\w.]+/;
const PROFANITY_LIST = [
  'fuck',
  'shit',
  'ass',
  'bitch',
  'bastard',
  'crap',
  'cunt',
  'dick',
  'piss',
  'cock',
  'pussy',
  'asshole',
  'bullshit',
  'damn',
  'hell',
];
const PROFANITY_RE = new RegExp(`\\b(${PROFANITY_LIST.join('|')})\\b`, 'i');

// ─── Cloud-read-only: AC-1, AC-2, AC-8, and crawler-UA ────────────────────────

describe('SEO Meta Tags — cloud-read-only', () => {
  let serverSlug: string = LOCAL_SEEDS.server.slug;
  let channels: readonly string[] = LOCAL_SEEDS.channels.publicIndexableAll;
  let crawlerTargets: ReadonlyArray<{ serverSlug: string; channelSlug: string }> =
    LOCAL_SEEDS.channels.publicIndexableAll.map((channelSlug) => ({
      serverSlug: LOCAL_SEEDS.server.slug,
      channelSlug,
    }));

  beforeAll(async () => {
    if (!isCloud) return;
    const fixture = await getCloudFixture();
    serverSlug = fixture.serverSlug;
    channels = fixture.publicChannels;
    crawlerTargets = fixture.publicChannelTargets;
  });

  /**
   * AC-1: Every public channel page serves non-empty <title> and
   * <meta name="description"> tags.
   */
  describe('AC-1: <title> and <meta name="description"> present on public channel pages', () => {
    if (isCloud) {
      test('AC-1: discovered cloud public channel has non-empty <title> and description meta', async () => {
        const slug = channels[0];
        const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${slug}`);
        expect(res.status).toBe(200);
        const html = await res.text();

        const title = extractTitle(html);
        expect(title).not.toBeNull();
        expect((title ?? '').length).toBeGreaterThan(0);

        const desc = extractMetaContent(html, 'description');
        expect(desc).not.toBeNull();
        expect((desc ?? '').length).toBeGreaterThan(0);
      });
    } else {
      test.each(LOCAL_SEEDS.channels.publicIndexableAll.map((c) => [c]))(
        'AC-1: channel "%s" has non-empty <title> and description meta',
        async (channelSlug) => {
          const slug = channelSlug as string;
          const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${slug}`);
          expect(res.status).toBe(200);
          const html = await res.text();

          const title = extractTitle(html);
          expect(title).not.toBeNull();
          expect((title ?? '').length).toBeGreaterThan(0);

          const desc = extractMetaContent(html, 'description');
          expect(desc).not.toBeNull();
          expect((desc ?? '').length).toBeGreaterThan(0);
        },
      );
    }
  });

  /**
   * Crawler-UA: Googlebot fetch of at least 3 public channels returns non-empty
   * <title>, <meta name="description">, and valid JSON-LD.
   *
   * In cloud mode a single test iterates all discovered channels and asserts
   * that at least 3 were found — satisfying the full AC-crawler-UA requirement.
   * In local mode each seed channel runs as a separate test.each case.
   */
  describe('Crawler-UA: Googlebot sees SEO tags and valid JSON-LD', () => {
    async function assertCrawlerUa(target: {
      serverSlug: string;
      channelSlug: string;
    }): Promise<void> {
      const res = await fetch(`${FRONTEND_URL}/c/${target.serverSlug}/${target.channelSlug}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      });
      expect(res.status).toBe(200);
      const html = await res.text();

      const title = extractTitle(html);
      expect(title).not.toBeNull();
      expect((title ?? '').length).toBeGreaterThan(0);

      const desc = extractMetaContent(html, 'description');
      expect(desc).not.toBeNull();
      expect((desc ?? '').length).toBeGreaterThan(0);

      const jsonLd = extractJsonLd(html);
      expect(jsonLd).not.toBeNull();
      expect(jsonLd?.['@type']).toBe('DiscussionForumPosting');
      expect(typeof (jsonLd as Record<string, unknown>)?.headline).toBe('string');
      expect(((jsonLd as Record<string, unknown>)?.headline as string).length).toBeGreaterThan(0);
    }

    if (isCloud) {
      test('Crawler-UA: Googlebot fetches ≥3 cloud public channels with SEO tags and JSON-LD', async () => {
        expect(crawlerTargets.length).toBeGreaterThanOrEqual(3);
        for (const target of crawlerTargets) {
          await assertCrawlerUa(target);
        }
      });
    } else {
      test.each(LOCAL_SEEDS.channels.publicIndexableAll.map((c) => [c]))(
        'Googlebot fetch of "%s" returns title, description, and JSON-LD',
        async (channelSlug) => {
          await assertCrawlerUa({
            serverSlug,
            channelSlug: channelSlug as string,
          });
        },
      );
    }
  });

  /**
   * AC-2: Auto-generated title length ≤60 chars; description 50-160 chars.
   * Verified via the backend meta-tags API (generatedTitle / generatedDescription).
   */
  describe('AC-2: length bounds on auto-generated title and description', () => {
    test.each(
      isCloud
        ? [[LOCAL_SEEDS.channels.publicIndexable]]
        : LOCAL_SEEDS.channels.publicIndexableAll.map((c) => [c]),
    )('AC-2: "%s" generated title ≤60 chars and description 50-160 chars', async (channelSlug) => {
      const slug = isCloud ? channels[0] : (channelSlug as string);
      const res = await fetch(
        `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${slug}/meta-tags`,
      );
      expect(res.status).toBe(200);

      const body = (await res.json()) as {
        generatedTitle?: string;
        generatedDescription?: string;
      };

      expect(typeof body.generatedTitle).toBe('string');
      expect((body.generatedTitle ?? '').length).toBeGreaterThan(0);
      expect((body.generatedTitle ?? '').length).toBeLessThanOrEqual(60);

      expect(typeof body.generatedDescription).toBe('string');
      expect((body.generatedDescription ?? '').length).toBeGreaterThanOrEqual(50);
      expect((body.generatedDescription ?? '').length).toBeLessThanOrEqual(160);
    });
  });

  /**
   * AC-8: Generated tags exclude PII and profanity for fixture-safe public channels.
   * The contentFilter replaces emails with [email], mentions with [user], and
   * profanity with asterisks — so the raw patterns should not appear.
   */
  describe('AC-8: no PII or profanity in generated tags for fixture channels', () => {
    test.each(
      isCloud
        ? [[LOCAL_SEEDS.channels.publicIndexable]]
        : LOCAL_SEEDS.channels.publicIndexableAll.map((c) => [c]),
    )('AC-8: "%s" tags do not contain raw email, @mention, or profanity', async (channelSlug) => {
      const slug = isCloud ? channels[0] : (channelSlug as string);
      const res = await fetch(
        `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${slug}/meta-tags`,
      );
      expect(res.status).toBe(200);

      const body = (await res.json()) as {
        generatedTitle?: string;
        generatedDescription?: string;
      };
      const title = body.generatedTitle ?? '';
      const description = body.generatedDescription ?? '';

      // No raw email addresses
      expect(title).not.toMatch(EMAIL_RE);
      expect(description).not.toMatch(EMAIL_RE);

      // No phone numbers
      expect(title).not.toMatch(PHONE_RE);
      expect(description).not.toMatch(PHONE_RE);

      // No @mention patterns
      expect(title).not.toMatch(MENTION_RE);
      expect(description).not.toMatch(MENTION_RE);

      // No profanity words
      expect(title).not.toMatch(PROFANITY_RE);
      expect(description).not.toMatch(PROFANITY_RE);
    });
  });
});

// ─── Local-only: write-path ACs ───────────────────────────────────────────────

localOnlyDescribe('SEO Meta Tags — local-only (write path)', () => {
  const serverSlug = LOCAL_SEEDS.server.slug;
  let accessToken: string;
  let channelId: string;
  let serverId: string;

  beforeAll(async () => {
    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
    if (!tokens.accessToken) throw new Error('login failed: no accessToken returned');
    accessToken = tokens.accessToken;

    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
    if (!serverRes.ok)
      throw new Error(`Could not fetch server ${serverSlug}: HTTP ${serverRes.status}`);
    const serverBody = (await serverRes.json()) as { id?: string };
    if (!serverBody.id) throw new Error('Could not resolve serverId for harmony-hq');
    serverId = serverBody.id;

    const channelRes = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
    if (!channelRes.ok)
      throw new Error(
        `Could not fetch channel ${LOCAL_SEEDS.channels.publicIndexable}: HTTP ${channelRes.status}`,
      );
    const channelBody = (await channelRes.json()) as { id?: string };
    if (!channelBody.id) throw new Error('Could not resolve channelId for general channel');
    channelId = channelBody.id;
  });

  afterAll(async () => {
    if (!accessToken || !channelId || !serverId) return;

    // Restore channel visibility to PUBLIC_INDEXABLE
    const visRes = await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_INDEXABLE' }),
    });
    if (!visRes.ok) {
      console.error(`afterAll: setVisibility cleanup failed with status ${visRes.status}`);
    }

    // Clear any custom overrides written during tests
    const clearRes = await fetch(`${BACKEND_URL}/api/admin/channels/${channelId}/meta-tags`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ customTitle: null, customDescription: null, customOgImage: null }),
    });
    if (!clearRes.ok) {
      console.error(`afterAll: meta-tag override cleanup failed with status ${clearRes.status}`);
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

  async function putMetaTagOverrides(overrides: {
    customTitle?: string | null;
    customDescription?: string | null;
    customOgImage?: string | null;
  }): Promise<Response> {
    return fetch(`${BACKEND_URL}/api/admin/channels/${channelId}/meta-tags`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(overrides),
    });
  }

  async function postRegenJob(idempotencyKey?: string): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
    return fetch(`${BACKEND_URL}/api/admin/channels/${channelId}/meta-tags/jobs`, {
      method: 'POST',
      headers,
    });
  }

  /**
   * AC-3: Effective override limits enforced:
   *   customTitle ≤70 chars, customDescription ≤200 chars.
   */
  test('AC-3: customTitle >70 chars is rejected with 422', async () => {
    const res = await putMetaTagOverrides({ customTitle: 'x'.repeat(71) });
    expect(res.status).toBe(422);
  });

  test('AC-3: customDescription >200 chars is rejected with 422', async () => {
    const res = await putMetaTagOverrides({ customDescription: 'y'.repeat(201) });
    expect(res.status).toBe(422);
  });

  test('AC-3: valid override within limits (title ≤70, description ≤200) is accepted', async () => {
    const res = await putMetaTagOverrides({
      customTitle: 'x'.repeat(70),
      customDescription: 'y'.repeat(200),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { customTitle?: string; customDescription?: string };
    expect(body.customTitle).toBe('x'.repeat(70));
    expect(body.customDescription).toBe('y'.repeat(200));
  });

  /**
   * AC-5: Regeneration API returns jobId and supports status polling to
   * terminal states (succeeded/failed).
   */
  test('AC-5: POST regeneration job returns 202 with jobId and pollUrl', async () => {
    const res = await postRegenJob();
    expect(res.status).toBe(202);
    const body = (await res.json()) as {
      jobId?: string;
      status?: string;
      pollUrl?: string;
    };
    expect(typeof body.jobId).toBe('string');
    expect(body.jobId!.length).toBeGreaterThan(0);
    expect(['queued', 'deduplicated']).toContain(body.status);
    expect(typeof body.pollUrl).toBe('string');
  });

  test('AC-5: job status endpoint returns a valid job record', async () => {
    const postRes = await postRegenJob();
    expect(postRes.status).toBe(202);
    const { jobId } = (await postRes.json()) as { jobId: string };

    const statusRes = await fetch(
      `${BACKEND_URL}/api/admin/channels/${channelId}/meta-tags/jobs/${jobId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    expect(statusRes.status).toBe(200);
    const job = (await statusRes.json()) as {
      jobId?: string;
      channelId?: string;
      status?: string;
    };
    expect(job.jobId).toBe(jobId);
    expect(job.channelId).toBe(channelId);
    expect(['queued', 'processing', 'succeeded', 'failed']).toContain(job.status);
  });

  test('AC-5: job eventually reaches terminal state (succeeded or failed)', async () => {
    const postRes = await postRegenJob();
    expect(postRes.status).toBe(202);
    const { jobId } = (await postRes.json()) as { jobId: string };

    const job = await pollUntil(
      () =>
        fetch(`${BACKEND_URL}/api/admin/channels/${channelId}/meta-tags/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((r) => r.json() as Promise<{ status?: string }>),
      (j) => j.status === 'succeeded' || j.status === 'failed',
      { timeoutMs: 10000 },
    );
    expect(['succeeded', 'failed']).toContain(job.status);
  }, 15000);

  /**
   * AC-6: Idempotency key deduplicates repeated regenerate requests within 60s.
   */
  test('AC-6: same Idempotency-Key within 60s returns the same jobId with status deduplicated', async () => {
    const key = `test-idem-${Date.now()}`;

    const first = await postRegenJob(key);
    expect(first.status).toBe(202);
    const firstBody = (await first.json()) as { jobId: string; status: string };
    expect(firstBody.status).toBe('queued');

    const second = await postRegenJob(key);
    expect(second.status).toBe(202);
    const secondBody = (await second.json()) as { jobId: string; status: string };
    expect(secondBody.status).toBe('deduplicated');
    expect(secondBody.jobId).toBe(firstBody.jobId);
  });

  /**
   * AC-7: Custom overrides are never overwritten by background regeneration.
   */
  test('AC-7: custom override persists after a completed background regeneration job', async () => {
    const markerTitle = 'AC7-Custom-Override-Test';

    // Set a custom override
    const putRes = await putMetaTagOverrides({ customTitle: markerTitle });
    expect(putRes.status).toBe(200);

    // Trigger regeneration
    const postRes = await postRegenJob();
    expect(postRes.status).toBe(202);
    const { jobId } = (await postRes.json()) as { jobId: string };

    // Wait for job to reach terminal state
    await pollUntil(
      () =>
        fetch(`${BACKEND_URL}/api/admin/channels/${channelId}/meta-tags/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((r) => r.json() as Promise<{ status?: string }>),
      (j) => j.status === 'succeeded' || j.status === 'failed',
      { timeoutMs: 10000 },
    );

    // Verify custom override is still present
    const getRes = await fetch(`${BACKEND_URL}/api/admin/channels/${channelId}/meta-tags`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(getRes.status).toBe(200);
    const meta = (await getRes.json()) as { customTitle?: string | null; title?: string };
    expect(meta.customTitle).toBe(markerTitle);
    // The effective title should reflect the override
    expect(meta.title).toBe(markerTitle);
  }, 15000);

  /**
   * AC-9: On NLP failure/timeout, fallback tags are returned and
   * needs_regeneration=true is persisted.
   *
   * This criterion requires fault injection (e.g., patching the NLP module to
   * throw/timeout). It is not testable without mocking in a pure integration
   * environment. Coverage is provided by harmony-backend unit tests for
   * MetaTagService and contentFilter.
   */
  test.todo(
    'AC-9: NLP failure returns fallback tags with needs_regeneration=true — requires fault injection, covered by backend unit tests',
  );

  /**
   * AC-4: onVisibilityChanged(PRIVATE) invalidates MetaTag cache.
   * AC-10: De-index workflow executes when channel visibility changes from
   * public to private (public meta-tags endpoint returns 404; sitemap excludes channel).
   *
   * Both ACs are verified together via the visibility change integration path.
   */
  test('AC-4/AC-10: changing channel to PRIVATE removes it from meta-tags public API and sitemap', async () => {
    // Ensure the channel starts PUBLIC_INDEXABLE
    const setRes = await setVisibility('PUBLIC_INDEXABLE');
    expect(setRes.ok).toBe(true);

    // Confirm meta-tags are accessible while PUBLIC_INDEXABLE
    const beforeRes = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}/meta-tags`,
    );
    expect(beforeRes.status).toBe(200);

    // Change to PRIVATE
    expect((await setVisibility('PRIVATE')).ok).toBe(true);

    // Public meta-tags endpoint must return 404 after going PRIVATE
    const metaRes = await pollUntil(
      () =>
        fetch(
          `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}/meta-tags`,
        ),
      (r) => r.status === 404,
      { timeoutMs: 4000 },
    );
    expect(metaRes.status).toBe(404);

    // Sitemap must no longer contain the channel URL (cache invalidation)
    const sitemapTarget = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    const sitemapText = await pollUntil(
      () => fetch(`${BACKEND_URL}/sitemap/${serverSlug}.xml`).then((r) => r.text()),
      (text) => !text.includes(sitemapTarget),
      { timeoutMs: 4000 },
    );
    expect(sitemapText).not.toContain(sitemapTarget);
  }, 15000);
});
