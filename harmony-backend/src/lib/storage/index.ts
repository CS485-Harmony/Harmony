import type { StorageProvider } from './storage.interface';
import { LocalStorageProvider } from './local.provider';

// Factory: add cases here as new providers are implemented (e.g. 's3')
function createStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? 'local';
  if (provider === 'local') return new LocalStorageProvider();
  throw new Error(`Unknown STORAGE_PROVIDER: "${provider}". Supported: local`);
}

export const storageProvider: StorageProvider = createStorageProvider();
export type { StorageProvider } from './storage.interface';
