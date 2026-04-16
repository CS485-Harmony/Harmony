import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import type { StorageProvider, UploadOptions, UploadResult } from './storage.interface';
import { MIME_TO_EXT } from './mime-types';

/**
 * Cloudflare R2 storage provider via the S3-compatible API.
 *
 * Required environment variables:
 *   R2_ACCOUNT_ID       — Cloudflare account ID (used to build the R2 endpoint URL)
 *   AWS_ACCESS_KEY_ID   — R2 API token key ID
 *   AWS_SECRET_ACCESS_KEY — R2 API token secret
 *   S3_BUCKET           — R2 bucket name
 *   R2_PUBLIC_URL       — Base public URL for serving files (custom domain or
 *                         the default R2 public bucket URL, e.g.
 *                         https://pub-<token>.r2.dev)
 *
 * Upload keys are UUIDs with an extension derived from the validated MIME type,
 * matching the same extension-spoofing protection in LocalStorageProvider.
 *
 * File deletion uses DeleteObjectCommand. R2 treats deletes for non-existent
 * keys as a success (idempotent), so no special handling is needed.
 */

export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    const bucket = process.env.S3_BUCKET;
    const publicUrl = process.env.R2_PUBLIC_URL;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accountId || !bucket || !publicUrl || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'S3StorageProvider requires: R2_ACCOUNT_ID, AWS_ACCESS_KEY_ID, ' +
          'AWS_SECRET_ACCESS_KEY, S3_BUCKET, R2_PUBLIC_URL',
      );
    }

    this.bucket = bucket;
    // Strip trailing slashes so URL joins are consistent
    this.publicUrl = publicUrl.replace(/\/+$/, '');

    this.client = new S3Client({
      // R2 requires region 'auto'; any other value is rejected
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    const ext = MIME_TO_EXT[options.contentType] ?? '.bin';
    const key = `${randomUUID()}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: options.data,
        ContentType: options.contentType,
      }),
    );

    return {
      url: `${this.publicUrl}/${key}`,
      filename: key,
    };
  }

  async delete(filename: string): Promise<void> {
    // Reject any path with directory separators to prevent traversal (mirrors local.provider.ts)
    if (filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename');
    }

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: filename,
      }),
    );
  }
}
