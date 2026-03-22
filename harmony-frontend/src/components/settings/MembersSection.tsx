/**
 * Members Section — server settings panel for managing server membership and roles.
 */

'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  getServerMembersAction,
  changeMemberRoleAction,
  removeMemberAction,
} from '@/app/settings/[serverSlug]/actions';
import type { ServerMemberInfo } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleOption = 'ADMIN' | 'MODERATOR' | 'MEMBER';

interface MemberRowState {
  changingRole: boolean;
  kickConfirm: boolean;
  kicking: boolean;
  roleError: string | null;
  kickError: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_BADGE_CLASSES: Record<ServerMemberInfo['role'], string> = {
  owner: 'bg-purple-600',
  admin: 'bg-red-600',
  moderator: 'bg-blue-600',
  member: 'bg-gray-600',
  guest: 'bg-gray-700',
};

const ROLE_LABEL: Record<ServerMemberInfo['role'], string> = {
  owner: 'Owner',
  admin: 'Admin',
  moderator: 'Moderator',
  member: 'Member',
  guest: 'Guest',
};

const ROLE_OPTIONS: { value: RoleOption; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MODERATOR', label: 'Moderator' },
  { value: 'MEMBER', label: 'Member' },
];

const FRONTEND_TO_BACKEND_ROLE: Record<string, RoleOption> = {
  admin: 'ADMIN',
  moderator: 'MODERATOR',
  member: 'MEMBER',
  // Guest is a read-only role — no backend promotion path to it via changeRole,
  // so map it to MEMBER so the select reflects the closest editable role.
  guest: 'MEMBER',
};

const BG = {
  base: 'bg-[#313338]',
  row: 'bg-[#2f3136]',
  active: 'bg-[#3d4148]',
  input: 'bg-[#1e1f22]',
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function MemberAvatar({ member }: { member: ServerMemberInfo }) {
  const initials = (member.displayName ?? member.username).slice(0, 2).toUpperCase();
  if (member.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.avatarUrl}
        alt={member.displayName ?? member.username}
        className='h-9 w-9 flex-shrink-0 rounded-full object-cover'
      />
    );
  }
  return (
    <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#5865f2] text-xs font-semibold text-white'>
      {initials}
    </div>
  );
}

// ─── Member row ───────────────────────────────────────────────────────────────

interface MemberRowProps {
  member: ServerMemberInfo;
  serverSlug: string;
  isCurrentUser: boolean;
  canCurrentUserManage: boolean;
  onRoleChanged: (userId: string, newRole: ServerMemberInfo['role']) => void;
  onRemoved: (userId: string) => void;
}

function MemberRow({ member, serverSlug, isCurrentUser, canCurrentUserManage, onRoleChanged, onRemoved }: MemberRowProps) {
  const [state, setState] = useState<MemberRowState>({
    changingRole: false,
    kickConfirm: false,
    kicking: false,
    roleError: null,
    kickError: null,
  });

  const isOwner = member.role === 'owner';
  const canManage = !isOwner && !isCurrentUser && canCurrentUserManage;

  async function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as RoleOption;
    setState(s => ({ ...s, changingRole: true, roleError: null }));
    try {
      await changeMemberRoleAction(serverSlug, member.userId, newRole);
      const frontendRole = newRole.toLowerCase() as ServerMemberInfo['role'];
      onRoleChanged(member.userId, frontendRole);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to change role';
      setState(s => ({ ...s, roleError: msg }));
    } finally {
      setState(s => ({ ...s, changingRole: false }));
    }
  }

  async function handleKickConfirm() {
    setState(s => ({ ...s, kicking: true, kickError: null }));
    try {
      await removeMemberAction(serverSlug, member.userId);
      onRemoved(member.userId);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to kick member';
      setState(s => ({ ...s, kicking: false, kickError: msg }));
    }
  }

  const backendRole = FRONTEND_TO_BACKEND_ROLE[member.role] ?? 'MEMBER';

  return (
    <div className={cn('flex flex-col gap-1 rounded px-3 py-2', BG.row)}>
      <div className='flex items-center gap-3'>
        <MemberAvatar member={member} />

        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <span className='truncate text-sm font-medium text-white'>
              {member.displayName ?? member.username}
            </span>
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-xs font-medium text-white',
                ROLE_BADGE_CLASSES[member.role],
              )}
            >
              {ROLE_LABEL[member.role]}
            </span>
            {isCurrentUser && (
              <span className='text-xs text-gray-500'>(you)</span>
            )}
          </div>
          <p className='truncate text-xs text-gray-500'>@{member.username}</p>
        </div>

        {canManage && (
          <div className='flex flex-shrink-0 items-center gap-2'>
            <select
              value={backendRole}
              onChange={handleRoleChange}
              disabled={state.changingRole}
              className={cn(
                'rounded px-2 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-[#5865f2] disabled:opacity-60',
                BG.input,
              )}
              aria-label={`Change role for ${member.displayName ?? member.username}`}
            >
              {ROLE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {!state.kickConfirm ? (
              <button
                type='button'
                onClick={() => setState(s => ({ ...s, kickConfirm: true }))}
                className='rounded px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300'
              >
                Kick
              </button>
            ) : (
              <div className='flex items-center gap-1'>
                <span className='text-xs text-red-400'>Are you sure?</span>
                <button
                  type='button'
                  onClick={handleKickConfirm}
                  disabled={state.kicking}
                  className='rounded px-2 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-900/30 disabled:opacity-60'
                >
                  {state.kicking ? 'Kicking…' : 'Kick'}
                </button>
                <button
                  type='button'
                  onClick={() => setState(s => ({ ...s, kickConfirm: false, kickError: null }))}
                  disabled={state.kicking}
                  className='rounded px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-[#3d4148] disabled:opacity-60'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {state.roleError && (
        <p role='alert' className='text-xs text-red-400'>
          {state.roleError}
        </p>
      )}
      {state.kickError && (
        <p role='alert' className='text-xs text-red-400'>
          {state.kickError}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface MembersSectionProps {
  serverId: string;
  serverSlug: string;
}

export function MembersSection({ serverId, serverSlug }: MembersSectionProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<ServerMemberInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getServerMembersAction(serverId)
      .then(data => {
        if (!cancelled) {
          setMembers(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to load members';
          setError(msg);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [serverId]);

  function handleRoleChanged(userId: string, newRole: ServerMemberInfo['role']) {
    setMembers(prev => prev.map(m => m.userId === userId ? { ...m, role: newRole } : m));
  }

  function handleRemoved(userId: string) {
    setMembers(prev => prev.filter(m => m.userId !== userId));
  }

  const currentUserMember = members.find(m => m.userId === user?.id);
  const canCurrentUserManage =
    currentUserMember?.role === 'owner' || currentUserMember?.role === 'admin';

  if (loading) {
    return (
      <div className='flex items-center justify-center py-16' role='status' aria-live='polite'>
        <div className='h-6 w-6 animate-spin rounded-full border-4 border-[#5865f2] border-t-transparent' />
        <span className='sr-only'>Loading members…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-lg py-8'>
        <p role='alert' className='text-sm text-red-400'>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-2xl space-y-4'>
      <h2 className='text-xl font-semibold text-white'>
        {members.length} {members.length === 1 ? 'Member' : 'Members'}
      </h2>

      {members.length === 0 ? (
        <p className='text-sm text-gray-400'>No members found.</p>
      ) : (
        <div className='space-y-1'>
          {members.map(member => (
            <MemberRow
              key={member.userId}
              member={member}
              serverSlug={serverSlug}
              isCurrentUser={user?.id === member.userId}
              canCurrentUserManage={canCurrentUserManage}
              onRoleChanged={handleRoleChanged}
              onRemoved={handleRemoved}
            />
          ))}
        </div>
      )}
    </div>
  );
}
