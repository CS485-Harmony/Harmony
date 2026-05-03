import fs from 'node:fs';
import path from 'node:path';

export const FRONTEND_PORT = 3100;
export const BACKEND_PORT = 4100;
export const POSTGRES_PORT = 55432;
export const REDIS_PORT = 56379;

export const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;
export const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
export const DATABASE_URL = `postgresql://harmony:harmony@localhost:${POSTGRES_PORT}/harmony_e2e`;
export const REDIS_URL = `redis://:e2esecret@localhost:${REDIS_PORT}`;

export const DEV_ADMIN_EMAIL = 'admin@harmony.dev';
export const DEV_ADMIN_PASSWORD = 'admin';

export const SIGNUP_USER = {
  username: 'e2e_member',
  displayName: 'E2E Member',
  password: 'password123',
};

export function cleanEnv(env = process.env) {
  return Object.fromEntries(Object.entries(env).filter(([, value]) => typeof value === 'string'));
}

export function frontendEnv(env = process.env) {
  return {
    ...cleanEnv(env),
    PORT: String(FRONTEND_PORT),
    NEXT_PUBLIC_API_URL: BACKEND_URL,
    JWT_ACCESS_SECRET: 'harmony-e2e-access-secret',
  };
}

export function backendEnv(env = process.env) {
  return {
    ...cleanEnv(env),
    PORT: String(BACKEND_PORT),
    DATABASE_URL,
    REDIS_URL,
    FRONTEND_URL,
    JWT_ACCESS_SECRET: 'harmony-e2e-access-secret',
    JWT_REFRESH_SECRET: 'harmony-e2e-refresh-secret',
    JWT_ACCESS_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_DAYS: '7',
    TWILIO_MOCK: 'true',
    LOCAL_UPLOAD_BASE_URL: BACKEND_URL,
  };
}

export function resolveE2EPaths(cwd = process.cwd()) {
  const repoRoot = path.resolve(cwd, '..');
  const backendDir = path.join(repoRoot, 'harmony-backend');

  return {
    repoRoot,
    backendDir,
    composeFile: path.join(backendDir, 'docker-compose.e2e.yml'),
    composeProject: 'harmony-e2e',
  };
}

function loadSeedSnapshot() {
  const { backendDir } = resolveE2EPaths();
  const seedPath = path.join(backendDir, 'src/dev/mock-seed-data.json');
  try {
    return JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error(
        `Missing E2E seed snapshot at ${seedPath}. Ensure the Harmony backend mock seed files are present before running Playwright.`,
      );
    }

    throw error;
  }
}

const snapshot = loadSeedSnapshot();

// Registration auto-joins this server in backend auth.service; keep this value
// aligned with that backend contract and fail fast in launcher preflight if it drifts.
export const DEFAULT_JOIN_SERVER_SLUG = 'harmony-hq';

const defaultJoinServer = snapshot.servers.find(server => server.slug === DEFAULT_JOIN_SERVER_SLUG);
if (!defaultJoinServer) {
  throw new Error(
    `Seed snapshot is missing the default join server slug "${DEFAULT_JOIN_SERVER_SLUG}".`,
  );
}

const publicChannel = snapshot.channels.find(
  channel => channel.serverId === defaultJoinServer.id && channel.visibility === 'PUBLIC_INDEXABLE',
);
if (!publicChannel) {
  throw new Error(
    `Seed snapshot is missing a public channel for server "${DEFAULT_JOIN_SERVER_SLUG}".`,
  );
}

const privateChannel = snapshot.channels.find(
  channel => channel.serverId === defaultJoinServer.id && channel.visibility === 'PRIVATE',
);
if (!privateChannel) {
  throw new Error(
    `Seed snapshot is missing a private channel for server "${DEFAULT_JOIN_SERVER_SLUG}".`,
  );
}

const welcomeMessage = snapshot.messages.find(message => message.channelId === publicChannel.id);
if (!welcomeMessage) {
  throw new Error(`Seed snapshot is missing a message for public channel "${publicChannel.slug}".`);
}

export const SEEDED_PUBLIC_CHANNEL = {
  serverSlug: defaultJoinServer.slug,
  serverName: defaultJoinServer.name,
  channelSlug: publicChannel.slug,
  channelName: publicChannel.name,
  welcomeText: welcomeMessage.content,
};

export const SEEDED_PRIVATE_CHANNEL = {
  serverSlug: defaultJoinServer.slug,
  channelName: privateChannel.name,
  channelSlug: privateChannel.slug,
};
