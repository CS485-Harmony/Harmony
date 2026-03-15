import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { StorageProvider, UploadOptions, UploadResult } from './storage.interface';

/**
 * Writes uploaded files to a local directory.
 * Intended for development and CI only — in production set STORAGE_PROVIDER=s3.
 *
 * Files are served by the attachment router at:
 *   GET /api/attachments/files/:filename
 */
export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    // Allow override via env so tests can point at a tmp dir
    this.uploadDir = process.env.LOCAL_UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');
    this.baseUrl = process.env.LOCAL_UPLOAD_BASE_URL ?? 'http://localhost:4000';
    fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    const ext = path.extname(options.filename).toLowerCase();
    // Use UUID to avoid collisions and prevent path traversal via user-supplied names
    const storedName = `${randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, storedName);

    await fs.promises.writeFile(filePath, options.data);

    return {
      url: `${this.baseUrl}/api/attachments/files/${storedName}`,
      filename: storedName,
    };
  }

  async delete(filename: string): Promise<void> {
    // Reject any path with directory separators to prevent traversal
    if (filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename');
    }
    const filePath = path.join(this.uploadDir, filename);
    await fs.promises.unlink(filePath).catch(() => {
      // Silently ignore missing files — idempotent delete
    });
  }

  /** Exposed for the static file serving middleware in attachment.router.ts */
  getUploadDir(): string {
    return this.uploadDir;
  }
}
