import { execFileSync, spawn } from 'node:child_process';
import {
  backendEnv,
  BACKEND_URL,
  DEV_ADMIN_EMAIL,
  DEV_ADMIN_PASSWORD,
  DATABASE_URL,
  DEFAULT_JOIN_SERVER_SLUG,
  resolveE2EPaths,
  SEEDED_PRIVATE_CHANNEL,
  SEEDED_PUBLIC_CHANNEL,
} from './stack.shared.mjs';

const { backendDir, composeFile, composeProject } = resolveE2EPaths();
let setupFinished = false;
let teardownFinished = false;
let backend;
let fatalExitCode = 0;

function run(command, args, env = process.env) {
  execFileSync(command, args, {
    cwd: backendDir,
    env,
    stdio: 'inherit',
  });
}

function teardownInfra() {
  if (teardownFinished || !setupFinished) return;
  teardownFinished = true;
  run('docker', ['compose', '-f', composeFile, '-p', composeProject, 'down', '-v']);
}

async function waitForCondition(check, label, timeoutMs = 30_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      if (await check()) return;
    } catch {}

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${label}.`);
}

async function waitFor(url, predicate, label, timeoutMs = 30_000) {
  await waitForCondition(async () => {
    const response = await fetch(url);
    return predicate(response);
  }, label, timeoutMs);
}

async function verifySeedPreconditions() {
  await waitFor(`${BACKEND_URL}/health`, async response => response.ok, 'backend health check');

  await waitFor(
    `${BACKEND_URL}/api/public/servers/${DEFAULT_JOIN_SERVER_SLUG}`,
    async response => {
      if (!response.ok) return false;
      const body = await response.json();
      return body.slug === DEFAULT_JOIN_SERVER_SLUG;
    },
    'default join server fixture',
  );

  await waitFor(
    `${BACKEND_URL}/api/public/servers/${SEEDED_PUBLIC_CHANNEL.serverSlug}/channels/${SEEDED_PUBLIC_CHANNEL.channelSlug}`,
    async response => {
      if (!response.ok) return false;
      const body = await response.json();
      return body.slug === SEEDED_PUBLIC_CHANNEL.channelSlug;
    },
    'public channel fixture',
  );

  await waitFor(
    `${BACKEND_URL}/api/public/servers/${SEEDED_PRIVATE_CHANNEL.serverSlug}/channels/${SEEDED_PRIVATE_CHANNEL.channelSlug}`,
    async response => response.status === 403,
    'private channel fixture',
  );

  await waitForCondition(async () => {
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: DEV_ADMIN_EMAIL,
        password: DEV_ADMIN_PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      return false;
    }

    const authPayload = await loginResponse.json();
    return (
      typeof authPayload.accessToken === 'string' &&
      typeof authPayload.refreshToken === 'string'
    );
  }, 'dev admin login fixture');
}

function handleFatal(error) {
  console.error(error);
  fatalExitCode = 1;
  if (backend) {
    backend.kill('SIGTERM');
    return;
  }

  teardownInfra();
  process.exit(fatalExitCode);
}

async function main() {
  run('docker', ['compose', '-f', composeFile, '-p', composeProject, 'up', '-d', '--wait']);
  setupFinished = true;

  run('npx', ['prisma', 'migrate', 'reset', '--force', '--skip-generate', '--skip-seed'], {
    ...process.env,
    DATABASE_URL,
  });
  run('npm', ['run', 'db:seed:mock'], {
    ...process.env,
    DATABASE_URL,
  });

  backend = spawn('npm', ['run', 'dev'], {
    cwd: backendDir,
    env: {
      ...backendEnv(),
      NODE_ENV: 'e2e',
    },
    stdio: 'inherit',
  });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      backend.kill(signal);
    });
  }

  process.on('uncaughtException', handleFatal);
  process.on('unhandledRejection', handleFatal);

  await verifySeedPreconditions();

  backend.on('exit', (code, signal) => {
    teardownInfra();

    if (fatalExitCode !== 0) {
      process.exit(fatalExitCode);
      return;
    }

    if (signal) {
      process.exit(0);
      return;
    }

    process.exit(code ?? 0);
  });
}

void main().catch(handleFatal);
