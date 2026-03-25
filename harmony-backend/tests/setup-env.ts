/**
 * Load `.env` from the backend package root regardless of Jest’s current working directory.
 * Keeps DATABASE_URL and secrets available to integration tests that use Prisma.
 */
import path from 'node:path';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '../.env'), quiet: true });
