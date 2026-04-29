import crypto from 'crypto';
import { RoleType, ServerInvite } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { prisma } from '../db/prisma';
import { inviteRepository } from '../repositories/invite.repository';
import { serverRepository } from '../repositories/server.repository';
import { serverMemberRepository } from '../repositories/serverMember.repository';
import { enforceJoinRateLimit } from './serverMember.service';
import { eventBus, EventChannels } from '../events/eventBus';

function generateCode(): string {
  return crypto.randomBytes(8).toString('base64url');
}

export interface InviteWithCreator extends ServerInvite {
  creator: { id: string; username: string; displayName: string };
}

export interface InvitePreview {
  code: string;
  server: {
    id: string;
    name: string;
    slug: string;
    iconUrl: string | null;
    description: string | null;
    memberCount: number;
  };
  uses: number;
  maxUses: number | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export const inviteService = {
  /**
   * Generate a new invite code for a server.
   * Caller must already hold server:manage_members (enforced by router).
   */
  async generate(
    serverId: string,
    creatorId: string,
    opts?: { maxUses?: number; expiresAt?: Date },
  ): Promise<InviteWithCreator> {
    const server = await serverRepository.findByIdSelect(serverId, { id: true });
    if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });

    const code = generateCode();
    const invite = await inviteRepository.create({
      code,
      serverId,
      creatorId,
      maxUses: opts?.maxUses ?? null,
      expiresAt: opts?.expiresAt ?? null,
    });

    const inviteWithCreator = await inviteRepository.findByIdWithCreator(invite.id);
    if (!inviteWithCreator) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to load created invite' });
    }
    return inviteWithCreator as InviteWithCreator;
  },

  /**
   * List all invite codes for a server.
   * Caller must already hold server:manage_members (enforced by router).
   */
  async list(serverId: string): Promise<InviteWithCreator[]> {
    return inviteRepository.findByServerId(serverId) as Promise<InviteWithCreator[]>;
  },

  /**
   * Delete an invite code. Only the creator or ADMIN+ may delete.
   */
  async delete(id: string, serverId: string, _actorId: string): Promise<void> {
    const invite = await inviteRepository.findById(id);
    if (!invite || invite.serverId !== serverId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found' });
    }
    await inviteRepository.delete(id);
  },

  /**
   * Look up invite metadata for public preview without consuming the invite.
   * Used by the /invite/[code] page before the user decides to join.
   */
  async preview(code: string): Promise<InvitePreview | null> {
    const invite = await inviteRepository.findByCodeWithServer(code);
    if (!invite) return null;

    if (invite.expiresAt && invite.expiresAt < new Date()) return null;
    if (invite.maxUses !== null && invite.uses >= invite.maxUses) return null;

    return {
      code: invite.code,
      server: invite.server,
      uses: invite.uses,
      maxUses: invite.maxUses,
      expiresAt: invite.expiresAt,
      createdAt: invite.createdAt,
    };
  },

  /**
   * Redeem an invite code: join the server identified by the code.
   * Bypasses isPublic check — invite codes work for private servers too.
   * If the user is already a member, returns success without incrementing uses.
   */
  async redeem(
    code: string,
    userId: string,
  ): Promise<{ serverId: string; serverSlug: string; alreadyMember: boolean }> {
    await enforceJoinRateLimit(userId);

    const invite = await inviteRepository.findByCodeWithServer(code);
    if (!invite) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found or expired' });

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'This invite has expired' });
    }
    if (invite.maxUses !== null && invite.uses >= invite.maxUses) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'This invite has reached its maximum uses' });
    }

    const existing = await serverMemberRepository.findByUserAndServer(userId, invite.serverId);
    if (existing) {
      return { serverId: invite.serverId, serverSlug: invite.server.slug, alreadyMember: true };
    }

    await prisma.$transaction(async (tx) => {
      // Atomic enforcement of maxUses — checked first so losing-race transactions
      // roll back before any member/count writes are attempted.
      const incResult = await inviteRepository.conditionalIncrementUses(invite.id, invite.maxUses, tx);
      if (incResult.count === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'This invite has reached its maximum uses' });
      }
      await serverMemberRepository.create({ userId, serverId: invite.serverId, role: 'MEMBER' }, tx);
      await serverRepository.update(invite.serverId, { memberCount: { increment: 1 } }, tx);
    });

    void eventBus.publish(EventChannels.MEMBER_JOINED, {
      userId,
      serverId: invite.serverId,
      role: 'MEMBER' as RoleType,
      timestamp: new Date().toISOString(),
    });

    return { serverId: invite.serverId, serverSlug: invite.server.slug, alreadyMember: false };
  },
};
