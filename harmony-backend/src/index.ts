import 'dotenv/config';
import { createApp } from './app';
import { instanceId } from './lib/instance-identity';
import { createLogger } from './lib/logger';
import { parsePortEnv } from './lib/parsePortEnv';

const PORT = parsePortEnv(4000);
const HOST = '0.0.0.0';
const DISPLAY_HOST = process.env.NODE_ENV === 'development' ? 'localhost' : HOST;
const logger = createLogger({ component: 'api-bootstrap', instanceId, pid: process.pid });

const app = createApp();

const server = app.listen(PORT, HOST, () => {
  logger.info({ host: DISPLAY_HOST, port: PORT }, 'Harmony backend-api listening');
});

// NOTE: cacheInvalidator (Redis Pub/Sub subscribers) runs on backend-worker,
// NOT here. Running it on every API replica would duplicate subscriber
// connections and background side effects. See
// docs/deployment/replica-readiness-audit.md §4.1 and
// docs/deployment/deployment-architecture.md §2.2.

let shuttingDown = false;
const shutdown = async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info('Shutdown signal received');
  const timer = setTimeout(() => process.exit(1), 10_000);
  await new Promise<void>((resolve) => server.close(() => resolve()));
  clearTimeout(timer);
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
