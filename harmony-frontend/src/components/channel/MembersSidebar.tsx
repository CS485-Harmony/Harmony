/**
 * Channel Component: MembersSidebar
 * Right-side panel listing server members with Discord-style online/offline sections.
 * Toggleable from TopBar; renders as an overlay on mobile.
 * Ref: dev-spec-guest-public-channel-view.md — C1.7 MembersSidebar
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { UserProfilePopover } from '@/components/shared/UserProfilePopover';
import type { User, UserRole, UserStatus } from '@/types';

// ─── Status dot ───────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<UserStatus, string> = {
  online: 'bg-green-500',
  idle: 'bg-yellow-400',
  dnd: 'bg-red-500',
  offline: 'bg-gray-400',
};

function StatusDot({ status }: { status: UserStatus }) {
  return (
    <span
      className={cn('block h-2.5 w-2.5 rounded-full ring-2 ring-[#2f3136]', STATUS_COLOR[status])}
      aria-label={status}
    />
  );
}

// ─── Role ordering and labels ─────────────────────────────────────────────────

const ROLE_ORDER: UserRole[] = ['owner', 'admin', 'moderator', 'member', 'guest'];
const ROLE_LABEL: Record<UserRole, string> = {
  owner: 'Owners',
  admin: 'Admins',
  moderator: 'Moderators',
  member: 'Members',
  guest: 'Guests',
};

const ONLINE_STATUSES: UserStatus[] = ['online', 'idle', 'dnd'];

type RoleGroup = {
  key: UserRole;
  label: string;
  users: User[];
};

type MemberSection = {
  key: 'online' | 'offline';
  label: 'Online' | 'Offline';
  roleGroups: RoleGroup[];
};

function roleRank(role: UserRole): number {
  return ROLE_ORDER.indexOf(role);
}

function compareMembers(a: User, b: User): number {
  const roleDelta = roleRank(a.role) - roleRank(b.role);
  if (roleDelta !== 0) return roleDelta;

  const aName = (a.displayName ?? a.username).toLowerCase();
  const bName = (b.displayName ?? b.username).toLowerCase();
  return aName.localeCompare(bName);
}

function groupMembersByRole(members: User[]): RoleGroup[] {
  return ROLE_ORDER.map(role => {
    const users = members.filter(member => member.role === role).sort(compareMembers);
    return {
      key: role,
      label: ROLE_LABEL[role],
      users,
    };
  }).filter(group => group.users.length > 0);
}

function groupMembers(members: User[]): MemberSection[] {
  const onlineUsers = members.filter(member => ONLINE_STATUSES.includes(member.status));
  const offlineUsers = members.filter(member => member.status === 'offline');

  const sections: MemberSection[] = [
    { key: 'online', label: 'Online', roleGroups: groupMembersByRole(onlineUsers) },
    { key: 'offline', label: 'Offline', roleGroups: groupMembersByRole(offlineUsers) },
  ];

  return sections.filter(section => section.roleGroups.length > 0);
}

// ─── Member row ───────────────────────────────────────────────────────────────

function MemberRow({ user }: { user: User }) {
  const isOffline = user.status === 'offline';
  const [profileAnchorRect, setProfileAnchorRect] = useState<DOMRect | null>(null);

  return (
    <>
      <div
        role='button'
        tabIndex={0}
        className={cn(
          'flex items-center gap-2.5 rounded px-2 py-1.5 transition-colors hover:bg-white/10 cursor-pointer',
          isOffline && 'opacity-40',
        )}
        onClick={e => setProfileAnchorRect((e.currentTarget as HTMLDivElement).getBoundingClientRect())}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setProfileAnchorRect(e.currentTarget.getBoundingClientRect()); } }}
      >
        {/* Avatar + status dot */}
        <div className='relative flex-shrink-0'>
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={32}
              height={32}
              unoptimized
              className='h-8 w-8 rounded-full'
            />
          ) : (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-sm font-semibold text-white'>
              {user.username.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <span className='absolute -bottom-0.5 -right-0.5'>
            <StatusDot status={user.status} />
          </span>
        </div>

        {/* Name */}
        <span className='truncate text-sm font-medium text-gray-300'>
          {user.displayName ?? user.username}
        </span>
      </div>
      {profileAnchorRect && (
        <UserProfilePopover
          userId={user.id}
          seed={{ username: user.username, displayName: user.displayName, avatarUrl: user.avatar }}
          anchorRect={profileAnchorRect}
          onClose={() => setProfileAnchorRect(null)}
        />
      )}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface MembersSidebarProps {
  /** List of server members to display */
  members: User[];
  /** Whether the sidebar is visible */
  isOpen: boolean;
  /** Callback to close the sidebar (used by mobile overlay close button) */
  onClose?: () => void;
}

export function MembersSidebar({ members, isOpen, onClose }: MembersSidebarProps) {
  const groups = groupMembers(members);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/40 sm:hidden'
          onClick={onClose}
          aria-hidden='true'
        />
      )}

      {/* Sidebar panel */}
      <aside
        aria-label='Members list'
        className={cn(
          'flex w-60 flex-col bg-[#2f3136]',
          // Hidden when closed, visible when open
          !isOpen && 'hidden',
          // Mobile: fixed overlay from right; desktop: static in layout flow
          isOpen && 'fixed inset-y-0 right-0 z-30 flex sm:static sm:z-auto',
        )}
      >
        {/* Close button — mobile only */}
        <div className='flex items-center justify-between border-b border-black/20 px-4 py-3 sm:hidden'>
          <h2 className='text-xs font-semibold uppercase tracking-wide text-gray-400'>Members</h2>
          <button
            onClick={onClose}
            aria-label='Close members list'
            className='rounded p-1 text-gray-400 hover:bg-white/10 hover:text-gray-200'
          >
            <svg
              className='h-4 w-4'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path d='M18 6L6 18M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Member groups */}
        <div className='flex-1 overflow-y-auto p-3'>
          {groups.map(({ key, label, roleGroups }) => (
            <div key={key} className='mb-4'>
              <p className='mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                {label} — {roleGroups.reduce((count, group) => count + group.users.length, 0)}
              </p>
              {roleGroups.map(group => (
                <div key={`${key}-${group.key}`} className='mb-3 last:mb-0'>
                  <p className='mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500'>
                    {group.label} — {group.users.length}
                  </p>
                  <ul className='list-none space-y-0.5'>
                    {group.users.map(user => (
                      <li key={user.id}>
                        <MemberRow user={user} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          {members.length === 0 && <p className='px-2 text-sm text-gray-500'>No members found.</p>}
        </div>
      </aside>
    </>
  );
}
