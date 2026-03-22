/**
 * Attachment service tests — Issue #112
 *
 * Covers:
 *   - validateUpload: allowed types pass, disallowed types and oversized files throw
 *   - listByMessage: returns attachments for a real message, throws on missing/deleted,
 *     and rejects cross-server probing (messageId from server B with server A's ID)
 *
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { PrismaClient } from '@prisma/client';
import {
  attachmentService,
  AttachmentValidationError,
  AttachmentNotFoundError,
  ALLOWED_CONTENT_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '../src/services/attachment.service';

const prisma = new PrismaClient();

let userId: string;
let serverId: string;
let otherServerId: string;
let channelId: string;
let messageId: string;
let attachmentId: string;

beforeAll(async () => {
  const ts = Date.now();

  const user = await prisma.user.create({
    data: {
      email: `attach-test-${ts}@example.com`,
      username: `attach_test_${ts}`,
      passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
      displayName: 'Attachment Test User',
    },
  });
  userId = user.id;

  const server = await prisma.server.create({
    data: {
      name: 'Attachment Test Server',
      slug: `attach-test-${ts}`,
      isPublic: false,
      ownerId: userId,
    },
  });
  serverId = server.id;

  // Second server — used to verify cross-server probing is rejected
  const otherServer = await prisma.server.create({
    data: {
      name: 'Attachment Test Server B',
      slug: `attach-test-b-${ts}`,
      isPublic: false,
      ownerId: userId,
    },
  });
  otherServerId = otherServer.id;

  const channel = await prisma.channel.create({
    data: {
      serverId,
      name: 'attachments',
      slug: 'attachments',
    },
  });
  channelId = channel.id;

  // Create a message with one attachment directly via Prisma (bypassing sendMessage)
  const msg = await prisma.message.create({
    data: {
      channelId,
      authorId: userId,
      content: 'Test message with attachment',
      attachments: {
        create: {
          filename: 'test.png',
          url: 'http://localhost:4000/api/attachments/files/test.png',
          contentType: 'image/png',
          sizeBytes: BigInt(1024),
        },
      },
    },
    include: { attachments: true },
  });
  messageId = msg.id;
  attachmentId = msg.attachments[0].id;
});

afterAll(async () => {
  if (serverId) await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
  if (otherServerId) await prisma.server.delete({ where: { id: otherServerId } }).catch(() => {});
  if (userId) await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  await prisma.$disconnect();
});

// ─── validateUpload ───────────────────────────────────────────────────────────

describe('attachmentService.validateUpload', () => {
  it('passes for an allowed content type within size limit', () => {
    expect(() => attachmentService.validateUpload('image/png', 1024)).not.toThrow();
  });

  it('throws AttachmentValidationError for a disallowed content type', () => {
    expect(() => attachmentService.validateUpload('application/x-executable', 100)).toThrow(
      AttachmentValidationError,
    );
  });

  it('throws AttachmentValidationError when file exceeds the 25 MB limit', () => {
    expect(() => attachmentService.validateUpload('image/jpeg', MAX_FILE_SIZE_BYTES + 1)).toThrow(
      AttachmentValidationError,
    );
  });

  it('passes exactly at the size limit', () => {
    expect(() => attachmentService.validateUpload('image/jpeg', MAX_FILE_SIZE_BYTES)).not.toThrow();
  });

  it('allows all content types in the whitelist', () => {
    for (const ct of ALLOWED_CONTENT_TYPES) {
      expect(() => attachmentService.validateUpload(ct, 512)).not.toThrow();
    }
  });
});

// ─── listByMessage ────────────────────────────────────────────────────────────

describe('attachmentService.listByMessage', () => {
  it('returns attachments for an existing message', async () => {
    const results = await attachmentService.listByMessage(messageId, serverId);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(attachmentId);
    expect(results[0].filename).toBe('test.png');
    expect(results[0].contentType).toBe('image/png');
    expect(results[0]).not.toHaveProperty('sizeBytes'); // BigInt excluded
  });

  it('returns empty array for a message with no attachments', async () => {
    const bare = await prisma.message.create({
      data: { channelId, authorId: userId, content: 'No attachments here' },
    });
    const results = await attachmentService.listByMessage(bare.id, serverId);
    expect(results).toHaveLength(0);
    await prisma.message.delete({ where: { id: bare.id } });
  });

  it('throws AttachmentNotFoundError for a nonexistent message ID', async () => {
    await expect(
      attachmentService.listByMessage('00000000-0000-0000-0000-000000000000', serverId),
    ).rejects.toThrow(AttachmentNotFoundError);
  });

  it('throws AttachmentNotFoundError for a soft-deleted message', async () => {
    const deleted = await prisma.message.create({
      data: { channelId, authorId: userId, content: 'Deleted', isDeleted: true },
    });
    await expect(attachmentService.listByMessage(deleted.id, serverId)).rejects.toThrow(
      AttachmentNotFoundError,
    );
    await prisma.message.delete({ where: { id: deleted.id } });
  });

  it('throws AttachmentNotFoundError when messageId belongs to a different server (cross-server probe)', async () => {
    // messageId is in serverId's channel; passing otherServerId should be rejected
    await expect(attachmentService.listByMessage(messageId, otherServerId)).rejects.toThrow(
      AttachmentNotFoundError,
    );
  });
});
