import { TRPCError } from '@trpc/server';
import { Prisma, UserStatus } from '@prisma/client';
import { isSystemAdmin } from '../lib/admin.utils';
import { eventBus, EventChannels } from '../events/eventBus';
import { userRepository } from '../repositories/user.repository';
import { serverMemberRepository } from '../repositories/serverMember.repository';

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
   * The publicProfile flag itself is also masked (returned as true) so callers
   * cannot infer whether a user has a private profile.
   * Credential fields (passwordHash, email) are never returned.
   */
  async getUser(userId: string) {
    const user = await userRepository.findById(userId);
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
    const user = await userRepository.findSelf(userId);
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }
    return {
      ...user,
      isSystemAdmin: await isSystemAdmin(userId),
    };
  },

  async updateUser(userId: string, patch: UpdateUserInput) {
    try {
      const updated = await userRepository.update(userId, {
        ...(patch.displayName !== undefined && { displayName: patch.displayName }),
        ...(patch.avatarUrl !== undefined && { avatarUrl: patch.avatarUrl }),
        ...(patch.publicProfile !== undefined && { publicProfile: patch.publicProfile }),
        ...(patch.status !== undefined && { status: patch.status }),
      });

      // When status changes, publish one event per server the user belongs to so
      // all connected members of those servers can update their member sidebar in real time.
      // Status reflects presence only (not identity), so we publish for all servers
      // regardless of the user's publicProfile setting.
      if (patch.status !== undefined) {
        const memberships = await serverMemberRepository.findByUserIdSelect(userId);
        for (const { serverId } of memberships) {
          void eventBus.publish(EventChannels.USER_STATUS_CHANGED, {
            userId,
            serverId,
            status: patch.status,
          });
        }
      }

      return updated;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }
      throw e;
    }
  },
};
