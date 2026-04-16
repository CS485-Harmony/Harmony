import cors from 'cors';
import type { CorsOptions } from 'cors';

export class CorsError extends Error {
  constructor() {
    super('CORS: origin not allowed');
    this.name = 'CorsError';
  }
}

const defaultAllowedOrigins = ['http://localhost:3000'];

// FRONTEND_URL may be a comma-separated list of allowed origins so that
// preview and production frontend URLs can both be permitted without a
// separate deployment (e.g. "https://harmony-dun-omega.vercel.app,https://harmony.chat").
function parseFrontendOrigins(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Build allowed origins at request time so env-based URLs reflect current configuration
    const allowedOrigins = [
      ...defaultAllowedOrigins,
      ...parseFrontendOrigins(process.env.FRONTEND_URL),
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
