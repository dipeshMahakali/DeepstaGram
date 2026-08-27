import { env } from '../../config/env';
import { StorageProvider } from './storage.interface';
import { LocalStorageProvider } from './local.storage';

let storageInstance: StorageProvider;

export function getStorageProvider(): StorageProvider {
  if (!storageInstance) {
    if (env.STORAGE_PROVIDER === 'r2' || env.STORAGE_PROVIDER === 's3') {
      // Cloudflare R2 / S3 provider can be instantiated here when credentials exist
      storageInstance = new LocalStorageProvider();
    } else {
      storageInstance = new LocalStorageProvider();
    }
  }
  return storageInstance;
}
