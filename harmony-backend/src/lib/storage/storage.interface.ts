// Storage provider abstraction — swap LocalStorageProvider for S3StorageProvider
// by setting STORAGE_PROVIDER=s3 (and the relevant S3 env vars) in production.

export interface UploadOptions {
  filename: string;
  contentType: string;
  data: Buffer;
}

export interface UploadResult {
  /** Public URL callers use to fetch the file. */
  url: string;
  /** Resolved filename (may differ from input if sanitized/de-duped). */
  filename: string;
}

export interface StorageProvider {
  upload(options: UploadOptions): Promise<UploadResult>;
  delete(filename: string): Promise<void>;
}
