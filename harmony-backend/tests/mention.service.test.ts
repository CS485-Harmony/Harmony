/**
 * Mention service tests — Issue #517
 *
 * Covers:
 *   - extractMentionedUsernames: parses tokens correctly, handles edge cases,
 *     is stateless across repeated calls (no shared regex lastIndex bleed)
 *   - processMentions: creates mention + notification rows, skips self-mentions,
 *     skips non-members, and is idempotent (no duplicate notifications on edits)
 *
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { PrismaClient } from '@prisma/client';
import { extractMentionedUsernames, extractBroadcastMentions, processMentions, processBroadcastMentions } from '../src/services/mention.service';

const prisma = new PrismaClient();

// ── Fixtures ──────────────────────────────────────────────────────────────────

let authorId: string;
let mentionedUserId: string;
let outsiderUserId: string;
let serverId: string;
let channelId: string;
let messageId: string;

beforeAll(async () => {
  const ts = Date.now();

  const author = await prisma.user.create({
    data: {
      email: `mention-author-${ts}@test.com`,
      username: `mention_author_${ts}`,
      passwordHash: 'x',
      displayName: 'Author',
    },
  });
  authorId = author.id;

  const mentioned = await prisma.user.create({
    data: {
      email: `mention-target-${ts}@test.com`,
      username: `mention_target_${ts}`,
      passwordHash: 'x',
      displayName: 'Mentioned',
    },
  });
  mentionedUserId = mentioned.id;

  const outsider = await prisma.user.create({
    data: {
      email: `mention-outsider-${ts}@test.com`,
      username: `mention_outsider_${ts}`,
      passwordHash: 'x',
      displayName: 'Outsider',
    },
  });
  outsiderUserId = outsider.id;

  const server = await prisma.server.create({
    data: {
      name: `Mention Test Server ${ts}`,
      slug: `mention-test-${ts}`,
      ownerId: authorId,
    },
  });
  serverId = server.id;

  // Author and mentioned are members; outsider is not.
  await prisma.serverMember.createMany({
    data: [
      { userId: authorId, serverId, role: 'OWNER' },
      { userId: mentionedUserId, serverId, role: 'MEMBER' },
    ],
  });

  const channel = await prisma.channel.create({
    data: {
      serverId,
      name: 'general',
      slug: 'general',
    },
  });
  channelId = channel.id;

  const message = await prisma.message.create({
    data: {
      channelId,
      authorId,
      content: 'placeholder',
    },
  });
  messageId = message.id;
});

afterAll(async () => {
  // Clean up in reverse-dependency order
  await prisma.notification.deleteMany({ where: { messageId } });
  await prisma.messageMention.deleteMany({ where: { messageId } });
  await prisma.message.delete({ where: { id: messageId } });
  await prisma.serverMember.deleteMany({ where: { serverId } });
  await prisma.channel.delete({ where: { id: channelId } });
  await prisma.server.delete({ where: { id: serverId } });
  await prisma.user.deleteMany({
    where: { id: { in: [authorId, mentionedUserId, outsiderUserId] } },
  });
  await prisma.$disconnect();
});

// ── extractMentionedUsernames ─────────────────────────────────────────────────

describe('extractMentionedUsernames', () => {
  it('extracts a single username', () => {
    expect(extractMentionedUsernames('hello @alice!')).toEqual(['alice']);
  });

  it('extracts multiple unique usernames', () => {
    const result = extractMentionedUsernames('@bob and @alice said hi to @bob');
    expect(result.sort()).toEqual(['alice', 'bob']);
  });

  it('normalises to lowercase', () => {
    expect(extractMentionedUsernames('@Alice @ALICE')).toEqual(['alice']);
  });

  it('returns empty array when no mentions', () => {
    expect(extractMentionedUsernames('no mentions here')).toEqual([]);
  });

  it('does not bleed lastIndex across repeated calls', () => {
    // Calling with the same content twice must return the same result.
    const a = extractMentionedUsernames('@foo bar');
    const b = extractMentionedUsernames('@foo bar');
    expect(a).toEqual(b);
    expect(a).toEqual(['foo']);
  });

  it('handles content starting mid-word after @', () => {
    // Email-style addresses should not be over-matched beyond the word boundary
    expect(extractMentionedUsernames('email@domain.com')).toEqual(['domain']);
  });
});

// ── extractBroadcastMentions ──────────────────────────────────────────────────

describe('extractBroadcastMentions', () => {
  it('detects @everyone', () => {
    expect(extractBroadcastMentions('hey @everyone listen up')).toEqual(['everyone']);
  });

  it('detects @here', () => {
    expect(extractBroadcastMentions('ping @here please')).toEqual(['here']);
  });

  it('detects both tokens when both appear', () => {
    const result = extractBroadcastMentions('@everyone and @here');
    expect(result.sort()).toEqual(['everyone', 'here']);
  });

  it('deduplicates repeated tokens', () => {
    expect(extractBroadcastMentions('@everyone @everyone')).toEqual(['everyone']);
  });

  it('is case-insensitive', () => {
    expect(extractBroadcastMentions('@EVERYONE @HERE')).toEqual(expect.arrayContaining(['everyone', 'here']));
  });

  it('does NOT match @hereford (substring false positive)', () => {
    expect(extractBroadcastMentions('ask @hereford about it')).toEqual([]);
  });

  it('does NOT match @everyone123 (trailing alphanumeric)', () => {
    expect(extractBroadcastMentions('@everyone123 is not a broadcast')).toEqual([]);
  });

  it('returns empty array when no broadcast tokens present', () => {
    expect(extractBroadcastMentions('hello @alice')).toEqual([]);
  });
});

// ── processMentions ───────────────────────────────────────────────────────────

describe('processMentions', () => {
  beforeEach(async () => {
    // Reset mention and notification rows before each test
    await prisma.notification.deleteMany({ where: { messageId } });
    await prisma.messageMention.deleteMany({ where: { messageId } });
  });

  const baseParams = () => ({
    messageId,
    channelId,
    serverId,
    authorId,
    authorUsername: 'mention_author',
    content: '',
  });

  it('creates a MessageMention and Notification for a valid member mention', async () => {
    await processMentions({
      ...baseParams(),
      content: `hello @mention_target_${Date.now().toString().slice(-5)}`,
    });
    // Use the actual username from the fixture instead
    await processMentions({
      messageId,
      channelId,
      serverId,
      authorId,
      authorUsername: 'author',
      content: `hey @${(await prisma.user.findUnique({ where: { id: mentionedUserId }, select: { username: true } }))!.username}`,
    });

    const mention = await prisma.messageMention.findFirst({ where: { messageId, userId: mentionedUserId } });
    expect(mention).not.toBeNull();

    const notif = await prisma.notification.findFirst({ where: { messageId, userId: mentionedUserId } });
    expect(notif).not.toBeNull();
    expect(notif?.type).toBe('mention');
    expect(notif?.read).toBe(false);
  });

  it('does not create a notification for the message author (self-mention)', async () => {
    const authorUser = await prisma.user.findUnique({ where: { id: authorId }, select: { username: true } });
    await processMentions({
      ...baseParams(),
      content: `@${authorUser!.username}`,
    });

    const notif = await prisma.notification.findFirst({ where: { messageId, userId: authorId } });
    expect(notif).toBeNull();
  });

  it('does not create a notification for a user not in the server', async () => {
    const outsiderUser = await prisma.user.findUnique({ where: { id: outsiderUserId }, select: { username: true } });
    await processMentions({
      ...baseParams(),
      content: `@${outsiderUser!.username}`,
    });

    const notif = await prisma.notification.findFirst({ where: { messageId, userId: outsiderUserId } });
    expect(notif).toBeNull();
  });

  it('is idempotent — calling twice does not create duplicate notifications', async () => {
    const mentionedUser = await prisma.user.findUnique({ where: { id: mentionedUserId }, select: { username: true } });
    const content = `@${mentionedUser!.username}`;

    await processMentions({ ...baseParams(), content });
    await processMentions({ ...baseParams(), content }); // simulates an edit

    const notifCount = await prisma.notification.count({ where: { messageId, userId: mentionedUserId, type: 'mention' } });
    expect(notifCount).toBe(1);

    const mentionCount = await prisma.messageMention.count({ where: { messageId, userId: mentionedUserId } });
    expect(mentionCount).toBe(1);
  });

  it('is a no-op when content has no mentions', async () => {
    await processMentions({ ...baseParams(), content: 'no mentions here' });

    const notifCount = await prisma.notification.count({ where: { messageId } });
    expect(notifCount).toBe(0);
  });
});

// ── processBroadcastMentions ──────────────────────────────────────────────────

describe('processBroadcastMentions', () => {
  const ts2 = Date.now() + 1;

  let bcastAuthorId: string;
  let onlineUserId: string;
  let idleUserId: string;
  let offlineUserId: string;
  let bcastServerId: string;
  let bcastChannelId: string;
  let bcastMessageId: string;

  beforeAll(async () => {
    const author = await prisma.user.create({
      data: { email: `bc-author-${ts2}@test.com`, username: `bc_author_${ts2}`, passwordHash: 'x', displayName: 'BcAuthor' },
    });
    bcastAuthorId = author.id;

    const online = await prisma.user.create({
      data: { email: `bc-online-${ts2}@test.com`, username: `bc_online_${ts2}`, passwordHash: 'x', displayName: 'Online', status: 'ONLINE' },
    });
    onlineUserId = online.id;

    const idle = await prisma.user.create({
      data: { email: `bc-idle-${ts2}@test.com`, username: `bc_idle_${ts2}`, passwordHash: 'x', displayName: 'Idle', status: 'IDLE' },
    });
    idleUserId = idle.id;

    const offline = await prisma.user.create({
      data: { email: `bc-offline-${ts2}@test.com`, username: `bc_offline_${ts2}`, passwordHash: 'x', displayName: 'Offline', status: 'OFFLINE' },
    });
    offlineUserId = offline.id;

    const server = await prisma.server.create({
      data: { name: `Broadcast Test Server ${ts2}`, slug: `bc-test-${ts2}`, ownerId: bcastAuthorId },
    });
    bcastServerId = server.id;

    await prisma.serverMember.createMany({
      data: [
        { userId: bcastAuthorId, serverId: bcastServerId, role: 'OWNER' },
        { userId: onlineUserId, serverId: bcastServerId, role: 'MEMBER' },
        { userId: idleUserId, serverId: bcastServerId, role: 'MEMBER' },
        { userId: offlineUserId, serverId: bcastServerId, role: 'MEMBER' },
      ],
    });

    const channel = await prisma.channel.create({
      data: { serverId: bcastServerId, name: 'general', slug: 'general' },
    });
    bcastChannelId = channel.id;

    const message = await prisma.message.create({
      data: { channelId: bcastChannelId, authorId: bcastAuthorId, content: 'placeholder' },
    });
    bcastMessageId = message.id;
  });

  afterAll(async () => {
    await prisma.notification.deleteMany({ where: { messageId: bcastMessageId } });
    await prisma.messageMention.deleteMany({ where: { messageId: bcastMessageId } });
    await prisma.message.delete({ where: { id: bcastMessageId } });
    await prisma.serverMember.deleteMany({ where: { serverId: bcastServerId } });
    await prisma.channel.delete({ where: { id: bcastChannelId } });
    await prisma.server.delete({ where: { id: bcastServerId } });
    await prisma.user.deleteMany({ where: { id: { in: [bcastAuthorId, onlineUserId, idleUserId, offlineUserId] } } });
  });

  beforeEach(async () => {
    await prisma.notification.deleteMany({ where: { messageId: bcastMessageId } });
    await prisma.messageMention.deleteMany({ where: { messageId: bcastMessageId } });
  });

  const baseParams = () => ({
    messageId: bcastMessageId,
    channelId: bcastChannelId,
    serverId: bcastServerId,
    authorId: bcastAuthorId,
    authorUsername: `bc_author_${ts2}`,
    content: '',
  });

  it('@everyone notifies all members (online, idle, and offline), excluding the author', async () => {
    await processBroadcastMentions({ ...baseParams(), content: '@everyone listen up' });

    const notifiedIds = (await prisma.notification.findMany({ where: { messageId: bcastMessageId } })).map((n) => n.userId);
    expect(notifiedIds).toContain(onlineUserId);
    expect(notifiedIds).toContain(idleUserId);
    expect(notifiedIds).toContain(offlineUserId);
    expect(notifiedIds).not.toContain(bcastAuthorId);
  });

  it('@here notifies only ONLINE and IDLE members, not OFFLINE, and not the author', async () => {
    await processBroadcastMentions({ ...baseParams(), content: '@here check this out' });

    const notifiedIds = (await prisma.notification.findMany({ where: { messageId: bcastMessageId } })).map((n) => n.userId);
    expect(notifiedIds).toContain(onlineUserId);
    expect(notifiedIds).toContain(idleUserId);
    expect(notifiedIds).not.toContain(offlineUserId);
    expect(notifiedIds).not.toContain(bcastAuthorId);
  });

  it('when @everyone and @here both appear, each eligible user receives at most one notification', async () => {
    await processBroadcastMentions({ ...baseParams(), content: '@everyone and @here please read' });

    const allNotified = await prisma.notification.findMany({ where: { messageId: bcastMessageId } });
    const userIds = allNotified.map((n) => n.userId);

    // No duplicate notifications for any single user
    const uniqueUserIds = new Set(userIds);
    expect(userIds.length).toBe(uniqueUserIds.size);

    // @everyone takes precedence — all non-author members notified
    expect(uniqueUserIds).toContain(onlineUserId);
    expect(uniqueUserIds).toContain(idleUserId);
    expect(uniqueUserIds).toContain(offlineUserId);
  });
});
