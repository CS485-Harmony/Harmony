/**
 * Parse PORT from environment, with a per-entrypoint default.
 * Throws on blank or out-of-range values so misconfigured deployments fail fast.
 */
export function parsePortEnv(defaultPort: number): number {
  const rawPort = process.env.PORT;
  if (rawPort === undefined) return defaultPort;

  if (rawPort.trim() === '') {
    throw new Error(
      `Invalid PORT environment variable: value is blank. Expected an integer between 1 and 65535.`,
    );
  }
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid PORT environment variable: "${rawPort}". Expected an integer between 1 and 65535.`,
    );
  }
  return port;
}
