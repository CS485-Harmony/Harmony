import os from 'os';
import crypto from 'crypto';

// A stable per-process identifier used to prove load balancing across replicas.
// - On Railway, os.hostname() resolves to the replica's container hostname,
//   which is distinct per replica and visible in platform logs.
// - A short random suffix disambiguates local dev where multiple processes
//   share the same machine hostname.
// The value is computed once per process so every log line, /health response,
// and X-Instance-Id header from a given replica reports the same id.

function compute(): string {
  const override = process.env.INSTANCE_ID?.trim();
  if (override) return override;

  const host = (() => {
    try {
      return os.hostname() || 'unknown';
    } catch {
      return 'unknown';
    }
  })();
  // Hash the hostname so internal infrastructure details are not exposed
  // externally via X-Instance-Id or /health while still producing a value
  // that is unique per replica and stable across log lines.
  const hostId = crypto.createHash('sha256').update(host).digest('hex').slice(0, 12);
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${hostId}-${suffix}`;
}

export const instanceId: string = compute();
