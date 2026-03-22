/**
 * Component: BrowseServersModal
 * Lets authenticated users discover and join public servers.
 * Fetches GET /api/public/servers and renders one card per server.
 * Already-joined servers show "Open" for direct navigation; others show "Join".
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { apiClient } from '@/lib/api-client';
import { getUserErrorMessage } from '@/lib/utils';
import { joinServerAction } from '@/app/channels/actions';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicServerEntry {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  description?: string;
  memberCount: number;
}

export interface BrowseServersModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** IDs of servers the current user has already joined — determines "Join" vs "Open". */
  joinedServerIds: Set<string>;
  /**
   * Maps serverId → default channel slug for already-joined servers.
   * Used to build the navigation URL when clicking "Open".
   */
  defaultChannelByServerId: Map<string, string>;
  /** URL base path for channel navigation — matches HarmonyShell basePath. */
  basePath?: string;
}

// ─── Server card ──────────────────────────────────────────────────────────────

function ServerCard({
  server,
  isMember,
  isJoining,
  anyJoining,
  onJoin,
  onOpen,
}: {
  server: PublicServerEntry;
  isMember: boolean;
  isJoining: boolean;
  anyJoining: boolean;
  onJoin: () => void;
  onOpen: () => void;
}) {
  const initials = server.name
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className='flex items-center gap-4 rounded-lg bg-[#2f3136] px-4 py-3'>
      {/* Server icon */}
      <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[24px] bg-[#5865f2] text-sm font-bold text-white'>
        {server.iconUrl ? (
          <Image
            src={server.iconUrl}
            alt={server.name}
            width={48}
            height={48}
            unoptimized
            className='h-full w-full object-cover'
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Info */}
      <div className='min-w-0 flex-1'>
        <p className='truncate font-semibold text-white'>{server.name}</p>
        {server.description && (
          <p className='truncate text-xs text-gray-400'>{server.description}</p>
        )}
        <p className='text-xs text-gray-500'>
          {server.memberCount.toLocaleString()} member{server.memberCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Action */}
      {isMember ? (
        <button
          type='button'
          onClick={onOpen}
          className='flex-shrink-0 rounded bg-[#3ba55c] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#2d7d46]'
        >
          Open
        </button>
      ) : (
        <button
          type='button'
          onClick={onJoin}
          disabled={anyJoining}
          className={cn(
            'flex-shrink-0 rounded px-3 py-1.5 text-sm font-medium text-white',
            isJoining
              ? 'cursor-wait bg-[#5865f2] opacity-70'
              : 'bg-[#5865f2] hover:bg-[#4752c4] disabled:opacity-50',
          )}
        >
          {isJoining ? 'Joining…' : 'Join'}
        </button>
      )}
    </li>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function BrowseServersModal({
  isOpen,
  onClose,
  joinedServerIds,
  defaultChannelByServerId,
  basePath = '/channels',
}: BrowseServersModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);

  const [servers, setServers] = useState<PublicServerEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  // serverId being joined right now, or null.
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Fetch public servers each time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setFetchError('');
    setServers([]);
    setLoading(true);
    apiClient
      .get<PublicServerEntry[]>('/api/public/servers')
      .then(data => setServers(data))
      .catch((err: unknown) => {
        setFetchError(getUserErrorMessage(err, 'Failed to load public servers.'));
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Escape to close (blocked while a join is in flight).
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !joiningId) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, joiningId, onClose]);

  // Focus trap.
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, []);

  async function handleJoin(server: PublicServerEntry) {
    setJoiningId(server.id);
    try {
      const { channelSlug } = await joinServerAction(server.id);
      showToast({ message: `Joined ${server.name}!`, type: 'success' });
      onClose();
      router.push(`${basePath}/${server.slug}/${channelSlug}`);
    } catch (err) {
      showToast({ message: getUserErrorMessage(err, 'Could not join server.'), type: 'error' });
    } finally {
      setJoiningId(null);
    }
  }

  function handleOpen(server: PublicServerEntry) {
    const channelSlug = defaultChannelByServerId.get(server.id) ?? 'general';
    onClose();
    router.push(`${basePath}/${server.slug}/${channelSlug}`);
  }

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
      onClick={joiningId ? undefined : onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='browse-servers-title'
    >
      <div
        ref={modalRef}
        className='flex w-full max-w-lg flex-col rounded-lg bg-[#36393f] shadow-xl'
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b border-black/20 px-6 py-4'>
          <div>
            <h2 id='browse-servers-title' className='text-xl font-bold text-white'>
              Browse Public Servers
            </h2>
            <p className='mt-0.5 text-sm text-gray-400'>
              Discover communities open to everyone.
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={!!joiningId}
            aria-label='Close'
            className='rounded p-1 text-gray-400 hover:text-white disabled:opacity-50'
          >
            <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round'>
              <path d='M18 6 6 18M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto px-6 py-4'>
          {loading && (
            <div className='flex items-center justify-center py-16 text-gray-400'>
              <svg className='mr-2 h-5 w-5 animate-spin' viewBox='0 0 24 24' fill='none'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
              </svg>
              Loading servers…
            </div>
          )}

          {!loading && fetchError && (
            <p className='py-16 text-center text-sm text-red-400'>{fetchError}</p>
          )}

          {!loading && !fetchError && servers.length === 0 && (
            <p className='py-16 text-center text-sm text-gray-400'>
              No public servers available yet.
            </p>
          )}

          {!loading && !fetchError && servers.length > 0 && (
            <ul className='space-y-2'>
              {servers.map(server => (
                <ServerCard
                  key={server.id}
                  server={server}
                  isMember={joinedServerIds.has(server.id)}
                  isJoining={joiningId === server.id}
                  anyJoining={joiningId !== null}
                  onJoin={() => void handleJoin(server)}
                  onOpen={() => handleOpen(server)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
