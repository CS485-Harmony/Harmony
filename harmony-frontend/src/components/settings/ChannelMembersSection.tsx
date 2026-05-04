'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, getUserErrorMessage } from '@/lib/utils';
import {
  fetchChannelMembers,
  addChannelMemberAction,
  removeChannelMemberAction,
  fetchServerMembersForChannel,
} from '@/app/settings/[serverSlug]/[channelSlug]/actions';
import type { ChannelMemberEntry } from '@/services/channelService';
import type { ServerMemberInfo } from '@/types';
import type { Channel } from '@/types';

const BG = {
  row: 'bg-[#2f3136]',
  input: 'bg-[#1e1f22]',
};

function MemberAvatar({ user }: { user: { displayName: string; username: string; avatarUrl: string | null } }) {
  const initials = (user.displayName ?? user.username).slice(0, 2).toUpperCase();
  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={user.displayName ?? user.username}
        className='h-9 w-9 flex-shrink-0 rounded-full object-cover'
      />
    );
  }
  return (
    <div className='flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white'>
      {initials}
    </div>
  );
}

export function ChannelMembersSection({
  channel,
  serverSlug,
}: {
  channel: Channel;
  serverSlug: string;
}) {
  const [members, setMembers] = useState<ChannelMemberEntry[]>([]);
  const [serverMembers, setServerMembers] = useState<ServerMemberInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [addSearch, setAddSearch] = useState('');
  const [adding, setAdding] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [channelMembers, allServerMembers] = await Promise.all([
        fetchChannelMembers(serverSlug, channel.slug),
        fetchServerMembersForChannel(serverSlug),
      ]);
      setMembers(channelMembers);
      setServerMembers(allServerMembers);
    } catch (err) {
      setError(getUserErrorMessage(err, 'Failed to load members.'));
    } finally {
      setLoading(false);
    }
  }, [serverSlug, channel.slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleRemove(userId: string) {
    setRemoving(userId);
    setRemoveError(null);
    try {
      await removeChannelMemberAction(serverSlug, channel.slug, userId);
      setMembers(prev => prev.filter(m => m.userId !== userId));
      setRemoveConfirm(null);
    } catch (err) {
      setRemoveError(getUserErrorMessage(err, 'Failed to remove member.'));
    } finally {
      setRemoving(null);
    }
  }

  async function handleAdd(userId: string) {
    setAdding(userId);
    setAddError(null);
    try {
      await addChannelMemberAction(serverSlug, channel.slug, userId);
      await load();
      setAddSearch('');
    } catch (err) {
      setAddError(getUserErrorMessage(err, 'Failed to add member.'));
    } finally {
      setAdding(null);
    }
  }

  const memberUserIds = new Set(members.map(m => m.userId));
  const addableMembers = serverMembers.filter(
    sm =>
      !memberUserIds.has(sm.userId) &&
      (sm.role === 'member' || sm.role === 'guest' || sm.role === 'moderator') &&
      (addSearch === '' ||
        sm.username.toLowerCase().includes(addSearch.toLowerCase()) ||
        (sm.displayName ?? '').toLowerCase().includes(addSearch.toLowerCase())),
  );

  return (
    <div className='max-w-lg space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-white'>Channel Members</h2>
        <p className='mt-1 text-sm text-gray-400'>
          Manage which server members have explicit access to{' '}
          <span className='font-medium text-gray-200'>#{channel.name}</span>. Admins and owners
          always have access.
        </p>
      </div>

      {loading && (
        <p className='text-sm text-gray-400'>Loading…</p>
      )}
      {error && <p className='text-sm text-red-400'>{error}</p>}

      {/* Current channel members */}
      {!loading && members.length === 0 && (
        <p className='text-sm text-gray-400'>
          No explicit members yet. Add server members below to grant private channel access.
        </p>
      )}

      {members.length > 0 && (
        <div className='space-y-2'>
          <h3 className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
            Members — {members.length}
          </h3>
          {members.map(member => (
            <div
              key={member.userId}
              className={cn('flex items-center gap-3 rounded px-3 py-2', BG.row)}
            >
              <MemberAvatar user={member.user} />
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-white'>{member.user.displayName}</p>
                <p className='truncate text-xs text-gray-400'>@{member.user.username}</p>
              </div>
              {removeConfirm === member.userId ? (
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-400'>Remove?</span>
                  <button
                    type='button'
                    onClick={() => void handleRemove(member.userId)}
                    disabled={removing === member.userId}
                    className='rounded px-2 py-1 text-xs bg-red-700 hover:bg-red-800 text-white disabled:opacity-50'
                  >
                    {removing === member.userId ? 'Removing…' : 'Yes'}
                  </button>
                  <button
                    type='button'
                    onClick={() => setRemoveConfirm(null)}
                    className='rounded px-2 py-1 text-xs text-gray-400 hover:text-white'
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type='button'
                  onClick={() => setRemoveConfirm(member.userId)}
                  className='text-xs text-gray-400 hover:text-red-400'
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {removeError && <p className='text-xs text-red-400'>{removeError}</p>}
        </div>
      )}

      {/* Add member */}
      <div className='space-y-2'>
        <h3 className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
          Add Member
        </h3>
        <input
          type='text'
          placeholder='Search server members…'
          value={addSearch}
          onChange={e => setAddSearch(e.target.value)}
          className={cn(
            'w-full rounded px-3 py-1.5 text-sm text-gray-200 border border-[#3d4148] focus:outline-none focus:border-indigo-500',
            BG.input,
          )}
        />
        {addError && <p className='text-xs text-red-400'>{addError}</p>}
        {addableMembers.length === 0 && addSearch !== '' && (
          <p className='text-xs text-gray-500'>No matching server members found.</p>
        )}
        <div className='max-h-48 overflow-y-auto space-y-1'>
          {addableMembers.map(sm => (
            <div
              key={sm.userId}
              className={cn('flex items-center gap-3 rounded px-3 py-2', BG.row)}
            >
              <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white'>
                {(sm.displayName ?? sm.username).slice(0, 2).toUpperCase()}
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-white'>{sm.displayName ?? sm.username}</p>
                <p className='truncate text-xs text-gray-400'>@{sm.username}</p>
              </div>
              <button
                type='button'
                onClick={() => void handleAdd(sm.userId)}
                disabled={adding === sm.userId}
                className='rounded px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
              >
                {adding === sm.userId ? 'Adding…' : 'Add'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
