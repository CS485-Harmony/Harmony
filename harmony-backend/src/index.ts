import 'dotenv/config';
import { createApp } from './app';
import { cacheInvalidator } from './services/cacheInvalidator.service';

const rawPort = process.env.PORT;
const PORT =
  rawPort === undefined
    ? 4000
    : (() => {
        if (rawPort.trim() === '') {
          throw new Error(`Invalid PORT environment variable: value is blank. Expected an integer between 1 and 65535.`);
        }
        const port = Number(rawPort);
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
          throw new Error(`Invalid PORT environment variable: "${rawPort}". Expected an integer between 1 and 65535.`);
        }
        return port;
      })();
const HOST = '0.0.0.0';
const DISPLAY_HOST = process.env.NODE_ENV === 'development' ? 'localhost' : HOST;

const app = createApp();

const server = app.listen(PORT, HOST, () => {
  console.log(`Harmony backend listening at http://${DISPLAY_HOST}:${PORT} (bound to ${HOST}:${PORT})`);
});

cacheInvalidator.start().catch((err) => console.error('[cacheInvalidator] start failed:', err));

let shuttingDown = false;
const shutdown = async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  const timer = setTimeout(() => process.exit(1), 10_000);
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await cacheInvalidator.stop();
  clearTimeout(timer);
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
