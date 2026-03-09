/**
 * AuditLogService tests — Issue #106
 *
 * Covers:
 *   - logVisibilityChange: creates a VisibilityAuditLog entry with correct fields
 *   - logVisibilityChange: works inside a Prisma transaction (tx parameter)
 *   - getVisibilityAuditLog: returns paginated results ordered newest-first
 *   - getVisibilityAuditLog: respects limit and offset
 *   - getVisibilityAuditLog: filters by startDate
 *   - getVisibilityAuditLog: returns empty page for channel with no entries
 *
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { ChannelType, ChannelVisibility } from '@prisma/client';
import {
  auditLogService,
  LogVisibilityChangeInput,
} from '../src/services/auditLog.service';
import { prisma } from '../src/db/prisma';

let userId: string;
let serverId: string;
let channelId: string;
let otherChannelId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: `audit-test-${Date.now()}@test.com`,
      username: `audit-test-${Date.now()}`,
      passwordHash: '$2a$10$placeholder',
      displayName: 'Audit Test User',
    },
  });
  userId = user.id;

  const server = await prisma.server.create({
    data: {
      name: 'Audit Test Server',
      slug: `audit-test-${Date.now()}`,
      isPublic: false,
      ownerId: userId,
    },
  });
  serverId = server.id;

  const channel = await prisma.channel.create({
    data: {
      serverId,
      name: 'audit-channel',
      slug: 'audit-channel',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
      position: 0,
    },
  });
  channelId = channel.id;

  const otherChannel = await prisma.channel.create({
    data: {
      serverId,
      name: 'audit-other',
      slug: 'audit-other',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
      position: 1,
    },
  });
  otherChannelId = otherChannel.id;
});

afterAll(async () => {
  if (serverId) {
    await prisma.server.delete({ where: { id: serverId } }).catch((err) => {
      console.error('Cleanup: failed to delete test server:', err);
    });
  }
  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch((err) => {
      console.error('Cleanup: failed to delete test user:', err);
    });
  }
  await prisma.$disconnect();
});

const makeLogInput = (overrides: Partial<LogVisibilityChangeInput> = {}): LogVisibilityChangeInput => ({
  channelId,
  actorId: userId,
  oldValue: { visibility: 'PRIVATE' },
  newValue: { visibility: 'PUBLIC_NO_INDEX' },
  ipAddress: '127.0.0.1',
  userAgent: 'test-agent/1.0',
  ...overrides,
});

// ─── logVisibilityChange ──────────────────────────────────────────────────────

describe('auditLogService.logVisibilityChange', () => {
  afterEach(async () => {
    // Clean up entries created by this suite so failures here don't leave stale rows
    // that could affect other suites if outer afterAll cleanup fails.
    await prisma.visibilityAuditLog.deleteMany({ where: { actorId: userId, channelId } });
  });
  it('creates a VisibilityAuditLog entry with correct fields', async () => {
    const entry = await auditLogService.logVisibilityChange(makeLogInput());

    expect(entry.id).toBeTruthy();
    expect(entry.channelId).toBe(channelId);
    expect(entry.actorId).toBe(userId);
    expect(entry.action).toBe('VISIBILITY_CHANGED');
    expect(entry.oldValue).toEqual({ visibility: 'PRIVATE' });
    expect(entry.newValue).toEqual({ visibility: 'PUBLIC_NO_INDEX' });
    expect(entry.ipAddress).toBe('127.0.0.1');
    expect(entry.userAgent).toBe('test-agent/1.0');
    expect(entry.timestamp).toBeInstanceOf(Date);
  });

  it('defaults userAgent to empty string when not provided', async () => {
    const entry = await auditLogService.logVisibilityChange(
      makeLogInput({ userAgent: undefined }),
    );
    expect(entry.userAgent).toBe('');
  });

  it('stores IPv6 addresses', async () => {
    const entry = await auditLogService.logVisibilityChange(
      makeLogInput({ ipAddress: '::1' }),
    );
    expect(entry.ipAddress).toBe('::1');
  });

  it('works inside a Prisma transaction (tx parameter)', async () => {
    let entryId: string | undefined;

    await prisma.$transaction(async (tx) => {
      const entry = await auditLogService.logVisibilityChange(
        makeLogInput({ newValue: { visibility: 'PUBLIC_INDEXABLE' } }),
        tx,
      );
      entryId = entry.id;
    });

    expect(entryId).toBeTruthy();
    const persisted = await prisma.visibilityAuditLog.findUnique({
      where: { id: entryId! },
    });
    expect(persisted).not.toBeNull();
    expect(persisted!.newValue).toEqual({ visibility: 'PUBLIC_INDEXABLE' });
  });
});

// ─── getVisibilityAuditLog ────────────────────────────────────────────────────

describe('auditLogService.getVisibilityAuditLog', () => {
  // Seed several audit log entries for the pagination tests
  let seededIds: string[] = [];

  beforeAll(async () => {
    // Insert 5 entries for channelId with known timestamps spread over 5 days
    const base = new Date('2026-01-05T12:00:00Z');
    for (let i = 0; i < 5; i++) {
      const ts = new Date(base.getTime() - i * 24 * 60 * 60 * 1000); // day i ago
      const entry = await prisma.visibilityAuditLog.create({
        data: {
          channelId,
          actorId: userId,
          action: 'VISIBILITY_CHANGED',
          oldValue: { visibility: 'PRIVATE' },
          newValue: { visibility: 'PUBLIC_NO_INDEX' },
          ipAddress: '10.0.0.1',
          userAgent: 'seed-agent',
          timestamp: ts,
        },
      });
      seededIds.push(entry.id);
    }
  });

  afterAll(async () => {
    // Remove seeded entries so they don't interfere with other tests
    if (seededIds.length > 0) {
      await prisma.visibilityAuditLog.deleteMany({
        where: { id: { in: seededIds } },
      });
      seededIds = [];
    }
  });

  it('returns entries for a channel ordered newest-first', async () => {
    const page = await auditLogService.getVisibilityAuditLog(channelId);
    expect(page.entries.length).toBeGreaterThanOrEqual(5);
    // Verify descending order
    for (let i = 1; i < page.entries.length; i++) {
      expect(page.entries[i - 1].timestamp.getTime()).toBeGreaterThanOrEqual(
        page.entries[i].timestamp.getTime(),
      );
    }
  });

  it('returns the correct total count', async () => {
    const page = await auditLogService.getVisibilityAuditLog(channelId);
    // total should be at least the 5 we seeded
    expect(page.total).toBeGreaterThanOrEqual(5);
    expect(page.total).toBeGreaterThanOrEqual(page.entries.length);
  });

  it('respects the limit option', async () => {
    const page = await auditLogService.getVisibilityAuditLog(channelId, { limit: 2 });
    expect(page.entries.length).toBeLessThanOrEqual(2);
  });

  it('respects the offset option for pagination', async () => {
    const first = await auditLogService.getVisibilityAuditLog(channelId, { limit: 2, offset: 0 });
    const second = await auditLogService.getVisibilityAuditLog(channelId, { limit: 2, offset: 2 });

    // No overlap between pages
    const firstIds = first.entries.map((e) => e.id);
    const secondIds = second.entries.map((e) => e.id);
    const overlap = firstIds.filter((id) => secondIds.includes(id));
    expect(overlap).toHaveLength(0);
  });

  it('filters entries by startDate', async () => {
    // Use a startDate that only includes the most-recent 3 of our 5 seeded entries
    // Seeded entries are at day-0, day-1, day-2, day-3, day-4 relative to 2026-01-05
    // Day-2 (3 days ago) → startDate = 2026-01-03
    const startDate = new Date('2026-01-03T00:00:00Z');
    const page = await auditLogService.getVisibilityAuditLog(channelId, { startDate });

    // All returned entries must be at or after startDate
    for (const entry of page.entries) {
      expect(entry.timestamp.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
    }
  });

  it('returns an empty page for a channel with no audit entries', async () => {
    const page = await auditLogService.getVisibilityAuditLog(otherChannelId);
    expect(page.entries).toHaveLength(0);
    expect(page.total).toBe(0);
  });

  it('returns an empty page for an unknown channelId', async () => {
    const page = await auditLogService.getVisibilityAuditLog(
      '00000000-0000-0000-0000-000000000000',
    );
    expect(page.entries).toHaveLength(0);
    expect(page.total).toBe(0);
  });
});
