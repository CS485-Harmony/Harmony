import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import express from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { storageProvider } from '../lib/storage';
import { LocalStorageProvider } from '../lib/storage/local.provider';
import {
  attachmentService,
  AttachmentValidationError,
  MAX_FILE_SIZE_BYTES,
} from '../services/attachment.service';
import { detectMimeType } from '../lib/mime-detect';

export const attachmentRouter = Router();

// ─── Multer setup ─────────────────────────────────────────────────────────────

// Memory storage: we validate before writing, so we don't want disk writes from multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

// ─── Upload endpoint ──────────────────────────────────────────────────────────

/**
 * POST /api/attachments/upload
 * Accepts a single multipart file field named "file".
 * Validates content-type and size, stores via storageProvider, returns metadata.
 *
 * Response:
 *   { url: string, filename: string, contentType: string, sizeBytes: number }
 */
attachmentRouter.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file provided. Use field name "file".' });
        return;
      }

      const { originalname, mimetype, buffer, size } = req.file;

      // Validate declared MIME type and size against whitelist before touching the buffer
      try {
        attachmentService.validateUpload(mimetype, size);
      } catch (err) {
        if (err instanceof AttachmentValidationError) {
          res.status(400).json({ error: err.message });
          return;
        }
        throw err;
      }

      // Magic-byte detection: verify actual file contents match the declared MIME type.
      // Prevents a client from bypassing the whitelist by declaring "image/png" for a
      // shell script or other malicious payload.
      const detectedMime = await detectMimeType(buffer);

      // text/plain has no magic bytes — file-type returns undefined for it.
      // For all other whitelisted types, the detected MIME must match.
      if (mimetype !== 'text/plain') {
        if (!detectedMime || detectedMime !== mimetype) {
          res.status(400).json({
            error: `File content does not match declared type "${mimetype}"`,
          });
          return;
        }
      }

      // Sanitize the original filename to alphanumeric + dot + hyphen + underscore.
      // path.basename alone strips path separators but still allows special chars
      // that could appear misleading in the DB record or error messages.
      const safeOriginalname = path.basename(originalname).replace(/[^a-zA-Z0-9._-]/g, '_');

      const result = await storageProvider.upload({
        filename: safeOriginalname,
        contentType: mimetype,
        data: buffer,
      });

      res.status(201).json({
        url: result.url,
        filename: result.filename,
        contentType: mimetype,
        sizeBytes: size,
      });
    } catch (err) {
      console.error('Attachment upload error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
);

// ─── Multer error handler ────────────────────────────────────────────────────

/**
 * Catches multer-specific errors (e.g. LIMIT_FILE_SIZE) and maps them to
 * appropriate 4xx responses before they reach the global 500 error handler.
 */
// Unscoped so it catches errors from any route on this router, not just /upload.
attachmentRouter.use((err: unknown, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    res.status(status).json({ error: err.message });
    return;
  }
  next(err);
});

// ─── Local file serving (dev only) ───────────────────────────────────────────

/**
 * GET /api/attachments/files/:filename
 * Serves files from the local upload directory.
 * In production (STORAGE_PROVIDER=s3) files are served via CDN; this route is a no-op.
 */
if (process.env.STORAGE_PROVIDER !== 's3' && storageProvider instanceof LocalStorageProvider) {
  const uploadDir = storageProvider.getUploadDir();
  attachmentRouter.use('/files', express.static(uploadDir));
}
