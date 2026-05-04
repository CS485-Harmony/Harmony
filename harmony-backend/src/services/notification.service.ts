import { prisma } from '../db/prisma';

const NOTIFICATION_INCLUDE = {
  message: {
    select: {
      id: true,
      content: true,
      isDeleted: true,
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
    },
  },
  channel: {
    select: {
      slug: true,
      name: true,
      server: { select: { slug: true, name: true } },
    },
  },
} as const;

export const notificationService = {
  /** Return the 50 most-recent notifications for a user (read + unread). */
  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: NOTIFICATION_INCLUDE,
    });
  },

  /** Count unread notifications for a user. */
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({ where: { userId, read: false } });
  },

  /** Mark a single notification as read (must belong to userId). */
  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  },

  /** Mark all unread notifications for a user as read. */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },
};
