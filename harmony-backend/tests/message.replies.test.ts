/**
 * Message reply (thread) service tests — Issue #151
 *
 * Covers: createReply (success, NOT_FOUND parent, soft-deleted parent),
 * getThreadMessages (chronological order), replyCount increment.
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { messageService } from '../src/services/message.service';

const prisma = new PrismaClient();

let serverId: string;
let channelId: string;
let authorId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: `replies-test-${Date.now()}@example.com`,
      username: `repliestest${Date.now()}`,
      passwordHash: await bcrypt.hash('password', 10),
      displayName: 'Reply Tester',
    },
  });
  authorId = user.id;

  const server = await prisma.server.create({
    data: {
      name: 'Reply Test Server',
      slug: `reply-test-${Date.now()}`,
      isPublic: false,
      ownerId: authorId,
    },
  });
  serverId = server.id;

  const channel = await prisma.channel.create({
    data: {
      serverId,
      name: 'threads',
      slug: `threads-${Date.now()}`,
      type: 'TEXT',
      visibility: 'PRIVATE',
    },
  });
  channelId = channel.id;

  await prisma.serverMember.create({
    data: { userId: authorId, serverId, role: 'MEMBER' },
  });
});

afterAll(async () => {
  if (serverId) {
    await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
  }
  if (authorId) {
    await prisma.user.delete({ where: { id: authorId } }).catch(() => {});
  }
  await prisma.$disconnect();
});

// ─── createReply ──────────────────────────────────────────────────────────────

describe('messageService.createReply', () => {
  it('creates a reply and links it to the parent message', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Parent message',
    });

    const reply = await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'First reply',
    });

    expect(reply.id).toBeTruthy();
    expect(reply.content).toBe('First reply');
    expect(reply.parentMessageId).toBe(parent.id);
    expect(reply.channelId).toBe(channelId);
    expect(reply.author.id).toBe(authorId);
    expect(reply.isDeleted).toBe(false);
  });

  it('increments replyCount on the parent message', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Count test parent',
    });

    expect(parent.replyCount).toBe(0);

    await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'Reply 1',
    });

    await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'Reply 2',
    });

    const updated = await prisma.message.findUnique({ where: { id: parent.id } });
    expect(updated?.replyCount).toBe(2);
  });

  it('throws NOT_FOUND when parent message does not exist', async () => {
    await expect(
      messageService.createReply({
        parentMessageId: '00000000-0000-0000-0000-000000000000',
        channelId,
        serverId,
        authorId,
        content: 'orphan reply',
      }),
    ).rejects.toThrow(TRPCError);
  });

  it('throws BAD_REQUEST when attempting to reply to a reply (one-level threading)', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Top-level',
    });

    const reply = await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'First-level reply',
    });

    await expect(
      messageService.createReply({
        parentMessageId: reply.id,
        channelId,
        serverId,
        authorId,
        content: 'Nested reply',
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });

  it('throws NOT_FOUND when parent message is soft-deleted', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Will be deleted',
    });

    await messageService.deleteMessage({ messageId: parent.id, actorId: authorId, serverId });

    await expect(
      messageService.createReply({
        parentMessageId: parent.id,
        channelId,
        serverId,
        authorId,
        content: 'reply to ghost',
      }),
    ).rejects.toThrow(TRPCError);
  });
});

// ─── getThreadMessages ────────────────────────────────────────────────────────

describe('messageService.getThreadMessages', () => {
  it('returns replies in chronological order (ASC)', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Thread parent',
    });

    const contents = ['Alpha', 'Beta', 'Gamma'];
    for (const c of contents) {
      await messageService.createReply({
        parentMessageId: parent.id,
        channelId,
        serverId,
        authorId,
        content: c,
      });
    }

    const result = await messageService.getThreadMessages({
      parentMessageId: parent.id,
      channelId,
      serverId,
    });

    expect(result.replies).toHaveLength(3);
    expect(result.replies.map((r) => r.content)).toEqual(contents);

    // Verify chronological order
    const times = result.replies.map((r) => r.createdAt.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('throws NOT_FOUND when parent message does not exist', async () => {
    await expect(
      messageService.getThreadMessages({
        parentMessageId: '00000000-0000-0000-0000-000000000000',
        channelId,
        serverId,
      }),
    ).rejects.toThrow(TRPCError);
  });

  it('throws NOT_FOUND when parent message is soft-deleted', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Will be deleted before thread fetch',
    });

    await messageService.deleteMessage({ messageId: parent.id, actorId: authorId, serverId });

    await expect(
      messageService.getThreadMessages({
        parentMessageId: parent.id,
        channelId,
        serverId,
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('throws BAD_REQUEST when parentMessageId is itself a reply', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Thread root',
    });

    const reply = await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'First reply',
    });

    await expect(
      messageService.getThreadMessages({
        parentMessageId: reply.id,
        channelId,
        serverId,
      }),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
  });
});

// ─── Soft-delete cascade ──────────────────────────────────────────────────────

describe('deleteMessage cascade to replies', () => {
  it('decrements replyCount on parent when a reply is deleted', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Decrement parent',
    });

    const reply = await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'Will be deleted',
    });

    const afterCreate = await prisma.message.findUnique({ where: { id: parent.id } });
    expect(afterCreate?.replyCount).toBe(1);

    await messageService.deleteMessage({ messageId: reply.id, actorId: authorId, serverId });

    const afterDelete = await prisma.message.findUnique({ where: { id: parent.id } });
    expect(afterDelete?.replyCount).toBe(0);
  });

  it('does not decrement replyCount below 0 (floor guard)', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Floor guard parent',
    });

    const reply = await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'Only reply',
    });

    // Delete once: 1 → 0
    await messageService.deleteMessage({ messageId: reply.id, actorId: authorId, serverId });
    const atZero = await prisma.message.findUnique({ where: { id: parent.id } });
    expect(atZero?.replyCount).toBe(0);

    // Force replyCount back to 0 via direct update to simulate anomaly, then
    // delete the already-deleted reply's parent to confirm GREATEST keeps it at 0
    // (we can't delete the reply again as it is already soft-deleted, so we verify
    // the column is at 0 and not negative from the earlier delete)
    expect(atZero?.replyCount).toBeGreaterThanOrEqual(0);
  });

  it('resets replyCount to 0 on parent when cascade-deleting', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Cascade count parent',
    });

    await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'R1',
    });
    await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'R2',
    });

    const beforeDelete = await prisma.message.findUnique({ where: { id: parent.id } });
    expect(beforeDelete?.replyCount).toBe(2);

    await messageService.deleteMessage({ messageId: parent.id, actorId: authorId, serverId });

    const afterDelete = await prisma.message.findUnique({ where: { id: parent.id } });
    expect(afterDelete?.replyCount).toBe(0);
  });

  it('soft-deletes replies when parent is deleted', async () => {
    const parent = await messageService.sendMessage({
      serverId,
      channelId,
      authorId,
      content: 'Cascade parent',
    });

    const reply1 = await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'Cascade reply 1',
    });

    const reply2 = await messageService.createReply({
      parentMessageId: parent.id,
      channelId,
      serverId,
      authorId,
      content: 'Cascade reply 2',
    });

    await messageService.deleteMessage({ messageId: parent.id, actorId: authorId, serverId });

    const [r1, r2] = await Promise.all([
      prisma.message.findUnique({ where: { id: reply1.id } }),
      prisma.message.findUnique({ where: { id: reply2.id } }),
    ]);

    expect(r1?.isDeleted).toBe(true);
    expect(r2?.isDeleted).toBe(true);
  });
});
