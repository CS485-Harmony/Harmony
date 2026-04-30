/**
 * Default secrets for tests and CI when .env / workflow env omits them.
 * Loaded after dotenv/config so local .env still wins when present.
 */
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';
