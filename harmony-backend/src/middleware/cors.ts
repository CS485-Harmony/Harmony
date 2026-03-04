import cors from 'cors';
import type { CorsOptions } from 'cors';

export class CorsError extends Error {
  constructor() {
    super('CORS: origin not allowed');
    this.name = 'CorsError';
  }
}

const defaultAllowedOrigins = ['http://localhost:3000'];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Build allowed origins at request time so env-based URLs reflect current configuration
    const allowedOrigins = [
      ...defaultAllowedOrigins,
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ];
    // Allow server-to-server requests (no Origin header) so internal callers
    // and health-check probes work without a CORS preflight.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new CorsError());
    }
  },
  credentials: true,
};

export default cors(corsOptions);
