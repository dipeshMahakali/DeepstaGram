import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';
import { StorageProvider, StorageFile } from './storage.interface';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = env.LOCAL_STORAGE_PATH;
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: StorageFile, folder = 'media'): Promise<{ url: string; key: string }> {
    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const ext = path.extname(file.filename) || '.bin';
    const key = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(this.uploadDir, key);

    await fs.promises.writeFile(filePath, file.buffer);

    return {
      url: this.getPublicUrl(key),
      key,
    };
  }

  async delete(key: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }

  getPublicUrl(key: string): string {
    return `${env.STORAGE_BASE_URL}/${key}`;
  }
}
