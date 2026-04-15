import type { StorageProvider } from './storage.interface';
import { LocalStorageProvider } from './local.provider';
import { S3StorageProvider } from './s3.provider';

// Factory: select provider via STORAGE_PROVIDER env var.
// 'local' — development only, writes to local disk (not replica-safe).
// 's3'    — production, Cloudflare R2 via S3-compatible API (replica-safe).
function createStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? 'local';
  if (provider === 'local') return new LocalStorageProvider();
  if (provider === 's3') return new S3StorageProvider();
  throw new Error(`Unknown STORAGE_PROVIDER: "${provider}". Supported: local, s3`);
}

export const storageProvider: StorageProvider = createStorageProvider();
export type { StorageProvider } from './storage.interface';
