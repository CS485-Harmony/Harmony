'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn, getUserErrorMessage } from '@/lib/utils';
import { listInvitesAction, generateInviteAction, deleteInviteAction } from '@/app/settings/[serverSlug]/actions';
import type { InviteInfo } from '@/app/settings/[serverSlug]/actions';
import { getPublicBaseUrl } from '@/lib/runtime-config';

function inviteUrl(code: string): string {
  return `${getPublicBaseUrl()}/invite/${code}`;
}

function expiryLabel(expiresAt: string | null): string {
  if (!expiresAt) return 'Never';
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Expired';
  const hours = Math.ceil(diff / 3600000);
  return hours < 24 ? `${hours}h` : `${Math.ceil(hours / 24)}d`;
}

export function InviteSection({ serverSlug }: { serverSlug: string }) {
  const [invites, setInvites] = useState<InviteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInvitesAction(serverSlug);
      setInvites(data);
    } catch (err) {
      setError(getUserErrorMessage(err, 'Failed to load invites.'));
    } finally {
      setLoading(false);
    }
  }, [serverSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const invite = await generateInviteAction(serverSlug);
      setInvites(prev => [invite, ...prev]);
    } catch (err) {
      setError(getUserErrorMessage(err, 'Failed to generate invite.'));
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(inviteId: string) {
    try {
      await deleteInviteAction(serverSlug, inviteId);
      setInvites(prev => prev.filter(i => i.id !== inviteId));
    } catch (err) {
      setError(getUserErrorMessage(err, 'Failed to delete invite.'));
    }
  }

  async function handleCopy(code: string) {
    await navigator.clipboard.writeText(inviteUrl(code));
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(c => (c === code ? null : c)), 2000);
  }

  return (
    <div className='max-w-lg space-y-6'>
      <div>
        <h2 className='mb-1 text-xl font-semibold text-white'>Invites</h2>
        <p className='text-sm text-gray-400'>
          Generate invite links so people can join this server directly.
        </p>
      </div>

      <button
        type='button'
        onClick={handleGenerate}
        disabled={generating}
        className='rounded bg-[#5865f2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4752c4] disabled:opacity-60'
      >
        {generating ? 'Generating…' : 'Generate Invite Link'}
      </button>

      {error && (
        <p role='alert' className='text-sm text-red-400'>
          {error}
        </p>
      )}

      {loading ? (
        <p className='text-sm text-gray-400'>Loading invites…</p>
      ) : invites.length === 0 ? (
        <p className='text-sm text-gray-400'>No active invite links. Generate one above.</p>
      ) : (
        <ul className='space-y-2'>
          {invites.map(invite => (
            <li
              key={invite.id}
              className='flex items-center gap-3 rounded-lg bg-[#2f3136] px-4 py-3'
            >
              <div className='min-w-0 flex-1 space-y-0.5'>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-sm text-white'>{invite.code}</span>
                  {invite.maxUses !== null && (
                    <span className='rounded bg-[#1e1f22] px-1.5 py-0.5 text-xs text-gray-400'>
                      {invite.uses}/{invite.maxUses} uses
                    </span>
                  )}
                  {invite.maxUses === null && (
                    <span className='text-xs text-gray-500'>{invite.uses} uses</span>
                  )}
                </div>
                <p className='text-xs text-gray-500'>
                  By {invite.creator.displayName || invite.creator.username} · Expires:{' '}
                  {expiryLabel(invite.expiresAt)}
                </p>
              </div>

              <button
                type='button'
                onClick={() => handleCopy(invite.code)}
                title='Copy invite link'
                className={cn(
                  'flex-shrink-0 rounded px-2.5 py-1 text-xs font-medium transition-colors',
                  copiedCode === invite.code
                    ? 'bg-[#3ba55c] text-white'
                    : 'bg-[#4f545c] text-gray-200 hover:bg-[#686d73]',
                )}
              >
                {copiedCode === invite.code ? 'Copied!' : 'Copy'}
              </button>

              <button
                type='button'
                onClick={() => handleDelete(invite.id)}
                title='Delete invite'
                aria-label='Delete invite'
                className='flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:text-red-400'
              >
                <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                  <path d='M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6' />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
