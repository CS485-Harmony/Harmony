import { attachmentRepository } from '../repositories/attachment.repository';

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
  // Video
  'video/mp4',
  // Documents
  'application/pdf',
  'text/plain',
  // Common office formats
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// ─── Domain errors ────────────────────────────────────────────────────────────

/**
 * Thrown by validateUpload. Plain Error keeps the service transport-agnostic —
 * REST routes catch and map to 400; tRPC callers can re-throw as TRPCError.
 */
export class AttachmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AttachmentValidationError';
  }
}

/**
 * Thrown by listByMessage when the message is not found, is deleted, or
 * belongs to a different server. Plain Error — callers map to their transport's
 * not-found response (TRPCError NOT_FOUND for tRPC, 404 for REST).
 */
export class AttachmentNotFoundError extends Error {
  constructor(message = 'Message not found') {
    super(message);
    this.name = 'AttachmentNotFoundError';
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const attachmentService = {
  /**
   * Validate that a file upload is within accepted type and size limits.
   * Throws AttachmentValidationError on failure.
   */
  validateUpload(contentType: string, sizeBytes: number): void {
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      throw new AttachmentValidationError(`Unsupported content type: ${contentType}`);
    }
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new AttachmentValidationError(
        `File exceeds the 25 MB limit (received ${sizeBytes} bytes)`,
      );
    }
  },

  /**
   * Return all attachments for a given message, scoped to a server.
   * Verifies the message belongs to the given server to prevent cross-server
   * probing (a caller with message:read on server A cannot fetch attachments
   * from a message in server B by passing server A's ID).
   *
   * Throws AttachmentNotFoundError (a plain Error) so this service stays
   * transport-agnostic. The tRPC router maps it to TRPCError NOT_FOUND.
   */
  async listByMessage(messageId: string, serverId: string) {
    const message = await attachmentRepository.findMessageForAttachmentList(messageId);

    if (!message || message.isDeleted) {
      throw new AttachmentNotFoundError();
    }

    // Collapse ownership mismatch to the same error as not-found to prevent
    // callers from probing message IDs across servers.
    if (message.channel.serverId !== serverId) {
      throw new AttachmentNotFoundError();
    }

    return attachmentRepository.findByMessageId(messageId);
  },
};
