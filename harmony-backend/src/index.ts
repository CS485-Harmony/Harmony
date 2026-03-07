import { createApp } from './app';
import { cacheInvalidator } from './services/cacheInvalidator.service';

const PORT = Number(process.env.PORT) || 4000;

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`Harmony backend running on http://localhost:${PORT}`);
});

cacheInvalidator.start();

const shutdown = async () => {
  const timer = setTimeout(() => process.exit(1), 10_000);
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await cacheInvalidator.stop();
  clearTimeout(timer);
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
