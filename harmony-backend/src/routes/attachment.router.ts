import path from 'path';
import { Router, Request, Response } from 'express';
import multer from 'multer';
import express from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { storageProvider } from '../lib/storage';
import { LocalStorageProvider } from '../lib/storage/local.provider';
import { attachmentService, MAX_FILE_SIZE_BYTES } from '../services/attachment.service';

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
      const _userId = (req as AuthenticatedRequest).userId; // authenticated; logged for audit if needed

      // Validate content-type and size
      try {
        attachmentService.validateUpload(mimetype, size);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Validation failed';
        res.status(400).json({ error: message });
        return;
      }

      const result = await storageProvider.upload({
        filename: path.basename(originalname), // strip any path from original name
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
