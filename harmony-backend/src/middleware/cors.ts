import cors from 'cors';
import type { CorsOptions } from 'cors';

const defaultAllowedOrigins = ['http://localhost:3000'];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Build allowed origins at request time so env-based URLs reflect current configuration
    const allowedOrigins = [
      ...defaultAllowedOrigins,
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ];
    // Allow server-to-server requests (no origin) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origin not allowed'));
    }
  },
  credentials: true,
};

export default cors(corsOptions);
