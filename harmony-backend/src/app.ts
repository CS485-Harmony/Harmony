import express, { NextFunction, Request, Response } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import helmet from 'helmet';
import corsMiddleware, { CorsError } from './middleware/cors';
import { appRouter } from './trpc/router';

export function createApp() {
  const app = express();

  app.use(helmet());
  // CORS must come before body parsers so error responses include CORS headers
  app.use(corsMiddleware);
  app.use(express.json());

  // Health check (plain HTTP — no tRPC client required)
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // tRPC endpoint
  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      onError({ error }) {
        console.error('tRPC error:', error);
      },
    }),
  );

  // 404 — unknown routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Global error handler — must have 4 params for Express to treat it as an error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const isCorsError = err instanceof CorsError;
    const status = isCorsError ? 403 : 500;
    const message = isCorsError ? err.message : 'Internal server error';
    if (!isCorsError) console.error('Unhandled error:', process.env.NODE_ENV === 'production' ? err.message : err);
    res.status(status).json({ error: message });
  });

  return app;
}
