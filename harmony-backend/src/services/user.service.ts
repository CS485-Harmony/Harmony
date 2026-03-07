import { TRPCError } from '@trpc/server';
import { Prisma, UserStatus } from '@prisma/client';
import { prisma } from '../db/prisma';

export interface UpdateUserInput {
  displayName?: string;
  avatarUrl?: string | null;
  publicProfile?: boolean;
  status?: UserStatus;
}

/**
 * Fields returned when viewing another user's profile.
 * Excludes all credential fields (passwordHash, email).
 */
const PUBLIC_PROFILE_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  publicProfile: true,
  status: true,
  createdAt: true,
} as const;

/**
 * Fields returned for the authenticated user's own profile.
 * Includes email (visible to self) but never passwordHash.
 */
const SELF_PROFILE_SELECT = {
  id: true,
  email: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  publicProfile: true,
  status: true,
  createdAt: true,
} as const;

export const userService = {
  /**
   * Returns a user's profile by ID, respecting the publicProfile privacy flag.
   * Users with publicProfile=false are returned anonymised — per architecture §4.1:
   * "Users with public_profile = false are displayed as 'Anonymous' with no avatar."
   * The publicProfile flag itself is also masked (returned as true) so callers
   * cannot infer whether a user has a private profile.
   * Credential fields (passwordHash, email) are never returned.
   */
  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: PUBLIC_PROFILE_SELECT,
    });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    if (!user.publicProfile) {
      return {
        ...user,
        username: 'anonymous',
        displayName: 'Anonymous',
        avatarUrl: null,
        publicProfile: true, // mask the flag — callers cannot infer private status
        status: UserStatus.OFFLINE,
      };
    }
    return user;
  },

  /**
   * Returns the full safe profile for the currently authenticated user.
   * Bypasses the publicProfile privacy filter — a user always sees their own data.
   * Never returns passwordHash.
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: SELF_PROFILE_SELECT,
    });
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    return user;
  },

  async updateUser(userId: string, patch: UpdateUserInput) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        select: SELF_PROFILE_SELECT,
        data: {
          ...(patch.displayName !== undefined && { displayName: patch.displayName }),
          ...(patch.avatarUrl !== undefined && { avatarUrl: patch.avatarUrl }),
          ...(patch.publicProfile !== undefined && { publicProfile: patch.publicProfile }),
          ...(patch.status !== undefined && { status: patch.status }),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }
      throw e;
    }
  },
};
