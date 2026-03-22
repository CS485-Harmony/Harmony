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

/**
 * Maps validated MIME types to stored file extensions.
 * Extension is derived from the server-verified content type (never from the
 * user-supplied filename) to prevent extension spoofing (e.g. uploading a
 * shell script with a .png name and having it served as active content).
 */
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

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
    // Derive extension from the server-verified content type, not the original filename.
    // Falls back to .bin for any unknown type so files are served as opaque downloads
    // rather than potentially as executable content.
    const ext = MIME_TO_EXT[options.contentType] ?? '.bin';
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
