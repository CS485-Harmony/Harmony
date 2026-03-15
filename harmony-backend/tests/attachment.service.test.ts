/**
 * Attachment service tests — Issue #112
 *
 * Covers:
 *   - validateUpload: allowed types pass, disallowed types and oversized files throw
 *   - listByMessage: returns attachments for a real message, throws on missing/deleted
 *
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { attachmentService, ALLOWED_CONTENT_TYPES, MAX_FILE_SIZE_BYTES } from '../src/services/attachment.service';

const prisma = new PrismaClient();

let userId: string;
let serverId: string;
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
  if (userId) await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  await prisma.$disconnect();
});

// ─── validateUpload ───────────────────────────────────────────────────────────

describe('attachmentService.validateUpload', () => {
  it('passes for an allowed content type within size limit', () => {
    expect(() => attachmentService.validateUpload('image/png', 1024)).not.toThrow();
  });

  it('throws BAD_REQUEST for a disallowed content type', () => {
    expect(() => attachmentService.validateUpload('application/x-executable', 100)).toThrow(
      TRPCError,
    );
    try {
      attachmentService.validateUpload('application/x-executable', 100);
    } catch (err) {
      expect((err as TRPCError).code).toBe('BAD_REQUEST');
    }
  });

  it('throws BAD_REQUEST when file exceeds the 25 MB limit', () => {
    expect(() =>
      attachmentService.validateUpload('image/jpeg', MAX_FILE_SIZE_BYTES + 1),
    ).toThrow(TRPCError);
    try {
      attachmentService.validateUpload('image/jpeg', MAX_FILE_SIZE_BYTES + 1);
    } catch (err) {
      expect((err as TRPCError).code).toBe('BAD_REQUEST');
    }
  });

  it('passes exactly at the size limit', () => {
    expect(() =>
      attachmentService.validateUpload('image/jpeg', MAX_FILE_SIZE_BYTES),
    ).not.toThrow();
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
    const results = await attachmentService.listByMessage(messageId);
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
    const results = await attachmentService.listByMessage(bare.id);
    expect(results).toHaveLength(0);
    // Cleanup
    await prisma.message.delete({ where: { id: bare.id } });
  });

  it('throws NOT_FOUND for a nonexistent message ID', async () => {
    await expect(
      attachmentService.listByMessage('00000000-0000-0000-0000-000000000000'),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('throws NOT_FOUND for a soft-deleted message', async () => {
    const deleted = await prisma.message.create({
      data: { channelId, authorId: userId, content: 'Deleted', isDeleted: true },
    });
    await expect(attachmentService.listByMessage(deleted.id)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    await prisma.message.delete({ where: { id: deleted.id } });
  });
});
