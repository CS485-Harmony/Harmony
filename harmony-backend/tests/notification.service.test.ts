/**
 * notification.service.test.ts — Issue #574
 *
 * Verifies that markAsRead and markAllAsRead correctly persist read-state
 * changes in the database.
 *
 * Uses a mocked Prisma client so the suite runs without a live database.
 */

// ─── Prisma mock ──────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

import { prisma } from '../src/db/prisma';
import { notificationService } from '../src/services/notification.service';

const mockPrisma = prisma as unknown as {
  notification: {
    findMany: jest.Mock;
    count: jest.Mock;
    updateMany: jest.Mock;
  };
};

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const USER_ID = '00000000-0000-0000-0000-000000000001';
const NOTIF_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

describe('notificationService.markAsRead', () => {
  it('calls updateMany with the correct notificationId and userId', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });

    await notificationService.markAsRead(NOTIF_ID, USER_ID);

    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
      where: { id: NOTIF_ID, userId: USER_ID },
      data: { read: true },
    });
  });

  it('returns the batch payload from updateMany', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });

    const result = await notificationService.markAsRead(NOTIF_ID, USER_ID);

    expect(result).toEqual({ count: 1 });
  });

  it('returns count 0 when no matching notification is found', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 0 });

    const result = await notificationService.markAsRead(NOTIF_ID, USER_ID);

    expect(result).toEqual({ count: 0 });
  });

  it('does not update notifications belonging to a different user', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 0 });

    await notificationService.markAsRead(NOTIF_ID, 'other-user-id');

    // The where clause must include the userId guard
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ userId: 'other-user-id' }) }),
    );
  });
});

describe('notificationService.markAllAsRead', () => {
  it('calls updateMany scoped to the userId and only unread notifications', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 3 });

    await notificationService.markAllAsRead(USER_ID);

    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: USER_ID, read: false },
      data: { read: true },
    });
  });

  it('returns the batch payload from updateMany', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });

    const result = await notificationService.markAllAsRead(USER_ID);

    expect(result).toEqual({ count: 5 });
  });

  it('returns count 0 when there are no unread notifications', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 0 });

    const result = await notificationService.markAllAsRead(USER_ID);

    expect(result).toEqual({ count: 0 });
  });
});

describe('notificationService.getUnreadCount', () => {
  it('counts only unread notifications for the given user', async () => {
    mockPrisma.notification.count.mockResolvedValue(2);

    const count = await notificationService.getUnreadCount(USER_ID);

    expect(count).toBe(2);
    expect(mockPrisma.notification.count).toHaveBeenCalledWith({
      where: { userId: USER_ID, read: false },
    });
  });
});
