import { TRPCError } from '@trpc/server';
import { prisma } from '../db/prisma';

// ─── Validation constants ─────────────────────────────────────────────────────

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Whitelist of accepted MIME types.
 * Add new types here — rejection is the secure default.
 */
export const ALLOWED_CONTENT_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Documents
  'application/pdf',
  'text/plain',
  // Common office formats
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// ─── Service ──────────────────────────────────────────────────────────────────

export const attachmentService = {
  /**
   * Validate that a file upload is within accepted type and size limits.
   * Throws a TRPCError (mapped to HTTP 400 by the REST router) on failure.
   */
  validateUpload(contentType: string, sizeBytes: number): void {
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Unsupported content type: ${contentType}`,
      });
    }
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `File exceeds the 25 MB limit (received ${sizeBytes} bytes)`,
      });
    }
  },

  /**
   * Return all attachments for a given message.
   * The caller is responsible for verifying the message is visible to the requester
   * (enforced at the tRPC router layer via withPermission).
   */
  async listByMessage(messageId: string) {
    // Confirm the message exists and is not deleted before returning attachments
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true, isDeleted: true },
    });

    if (!message || message.isDeleted) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found' });
    }

    return prisma.attachment.findMany({
      where: { messageId },
      select: {
        id: true,
        filename: true,
        url: true,
        contentType: true,
        // sizeBytes (BigInt) is intentionally excluded — tRPC's default
        // JSON transformer cannot serialize BigInt. Clients read it from the
        // HTTP Content-Length header or a dedicated metadata endpoint.
      },
    });
  },
};
