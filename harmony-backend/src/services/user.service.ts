import { TRPCError } from '@trpc/server';
import { UserStatus } from '@prisma/client';
import { prisma } from '../db/prisma';

export interface UpdateUserInput {
  displayName?: string;
  avatarUrl?: string | null;
  publicProfile?: boolean;
  status?: UserStatus;
}

export const userService = {
  /**
   * Returns a user's profile by ID, respecting the publicProfile privacy flag.
   * Users with publicProfile=false are returned anonymised — per architecture §4.1:
   * "Users with public_profile = false are displayed as 'Anonymous' with no avatar."
   */
  async getUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    if (!user.publicProfile) {
      return {
        ...user,
        username: 'anonymous',
        displayName: 'Anonymous',
        avatarUrl: null,
        status: UserStatus.OFFLINE,
      };
    }
    return user;
  },

  /**
   * Returns the full profile for the currently authenticated user.
   * Bypasses the publicProfile privacy filter — a user always sees their own data.
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    return user;
  },

  async updateUser(userId: string, patch: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(patch.displayName !== undefined && { displayName: patch.displayName }),
        ...(patch.avatarUrl !== undefined && { avatarUrl: patch.avatarUrl }),
        ...(patch.publicProfile !== undefined && { publicProfile: patch.publicProfile }),
        ...(patch.status !== undefined && { status: patch.status }),
      },
    });
  },
};
