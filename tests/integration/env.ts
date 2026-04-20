/**
 * Environment configuration for integration tests.
 *
 * TEST_TARGET=local  (default) — tests run against localhost services.
 * TEST_TARGET=cloud             — tests run against deployed URLs; local-only tests skip.
 *
 * BACKEND_URL  overrides the backend base URL (e.g. https://api.harmony.chat).
 * FRONTEND_URL overrides the frontend base URL (e.g. https://harmony.chat).
 */

export type TestTarget = 'local' | 'cloud';

const raw = (process.env.TEST_TARGET ?? 'local').toLowerCase();
if (raw !== 'local' && raw !== 'cloud') {
  throw new Error(`TEST_TARGET must be "local" or "cloud", got "${raw}"`);
}

export const TARGET: TestTarget = raw as TestTarget;
export const isLocal = TARGET === 'local';
export const isCloud = TARGET === 'cloud';

export const BACKEND_URL = (
  process.env.BACKEND_URL ?? (isCloud ? 'https://api.harmony.chat' : 'http://localhost:4000')
).replace(/\/$/, '');

export const FRONTEND_URL = (
  process.env.FRONTEND_URL ?? (isCloud ? 'https://harmony.chat' : 'http://localhost:3000')
).replace(/\/$/, '');

/**
 * Returns true when the current test should be skipped in cloud mode.
 * Usage: test.skipIf(cloudOnly())('...', ...) or check at the top of a test.
 */
export const cloudOnly = (): boolean => isCloud;

/**
 * Convenience wrapper: wraps a describe block so all tests inside skip in cloud mode.
 * Pass the classification label as documentation.
 */
export const localOnlyDescribe = (label: string, fn: () => void): void => {
  const wrapper = isCloud ? describe.skip : describe;
  wrapper(`[local-only] ${label}`, fn);
};

/**
 * Convenience wrapper: wraps a test so it skips in cloud mode.
 */
export const localOnlyTest = (name: string, fn: jest.ProvidesCallback, timeout?: number): void => {
  const wrapper = isCloud ? test.skip : test;
  wrapper(name, fn, timeout);
};

/**
 * Convenience wrapper: wraps a test so it skips when running in cloud mode
 * without a CLOUD_TEST_ACCESS_TOKEN. Keeps the test active in local mode
 * (where login() always provides a token) and in cloud mode when the token
 * is provisioned.
 */
export const cloudTokenTest = (name: string, fn: jest.ProvidesCallback, timeout?: number): void => {
  const needsSkip = isCloud && !process.env.CLOUD_TEST_ACCESS_TOKEN;
  (needsSkip ? test.skip : test)(name, fn, timeout);
};

// Known mock-seed data used by local tests (harmony-backend/src/dev/mock-seed-data.json).
// Server server-001 is "harmony-hq".
export const LOCAL_SEEDS = {
  server: {
    slug: 'harmony-hq',
  },
  channels: {
    publicIndexable: 'general', // visibility=PUBLIC_INDEXABLE
    publicNoIndex: 'introductions', // visibility=PUBLIC_NO_INDEX
    private: 'staff-only', // visibility=PRIVATE
  },
  alice: {
    email: 'alice_admin@mock.harmony.test',
    password: 'HarmonyAdmin123!',
  },
} as const;

// Known cloud URLs used by cloud smoke tests. Explicit env vars still win, but
// automated CI should not depend on a hard-coded production slug pair that can
// drift as deployed data changes.
export const CLOUD_KNOWN = {
  serverSlug: process.env.CLOUD_TEST_SERVER_SLUG ?? 'harmony-hq',
  publicChannel: process.env.CLOUD_TEST_PUBLIC_CHANNEL ?? 'general',
} as const;

export type CloudFixture = {
  serverId?: string;
  serverSlug: string;
  publicChannel: string;
};

let cloudFixturePromise: Promise<CloudFixture> | null = null;

async function resolveCloudFixtureFromPublicApi(): Promise<CloudFixture> {
  const serversRes = await fetch(`${BACKEND_URL}/api/public/servers`);
  if (!serversRes.ok) {
    throw new Error(
      `Cloud fixture discovery failed: GET /api/public/servers returned ${serversRes.status}`,
    );
  }

  const servers = (await serversRes.json()) as Array<{
    id?: string;
    slug?: string;
  }>;
  for (const server of servers) {
    if (!server.slug) continue;

    const channelsRes = await fetch(`${BACKEND_URL}/api/public/servers/${server.slug}/channels`);
    if (!channelsRes.ok) continue;

    const channelsBody = (await channelsRes.json()) as {
      channels?: Array<{ slug?: string }>;
    };
    const publicChannel = channelsBody.channels?.find((channel) => channel.slug)?.slug;
    if (!publicChannel) continue;

    return {
      serverId: server.id,
      serverSlug: server.slug,
      publicChannel,
    };
  }

  throw new Error(
    'Cloud fixture discovery failed: no public server/channel pair is available at the configured BACKEND_URL',
  );
}

export async function getCloudFixture(): Promise<CloudFixture> {
  if (!isCloud) {
    return {
      serverSlug: LOCAL_SEEDS.server.slug,
      publicChannel: LOCAL_SEEDS.channels.publicIndexable,
    };
  }

  const envServerSlug = process.env.CLOUD_TEST_SERVER_SLUG;
  const envPublicChannel = process.env.CLOUD_TEST_PUBLIC_CHANNEL;
  if (envServerSlug && envPublicChannel) {
    return {
      serverSlug: envServerSlug,
      publicChannel: envPublicChannel,
      serverId: process.env.CLOUD_TEST_SERVER_ID,
    };
  }

  if (!cloudFixturePromise) {
    cloudFixturePromise = resolveCloudFixtureFromPublicApi();
  }
  return cloudFixturePromise;
}
