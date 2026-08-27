export interface StorageFile {
  filename: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export interface StorageProvider {
  upload(file: StorageFile, folder?: string): Promise<{ url: string; key: string }>;
  delete(key: string): Promise<boolean>;
  getPublicUrl(key: string): string;
  createUploadUrl?(key: string, contentType: string): Promise<string>;
}
