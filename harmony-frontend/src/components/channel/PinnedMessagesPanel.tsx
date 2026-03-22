/**
 * Channel Component: PinnedMessagesPanel
 * Sidebar panel that displays pinned messages for the current channel.
 * Fetches via the getPinnedMessages tRPC procedure (server action).
 */

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getPinnedMessagesAction } from '@/app/actions/getPinnedMessages';
import type { Message } from '@/types';

// ─── Icons ────────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg
      className='h-4 w-4'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M18 6 6 18M6 6l12 12' />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className='h-4 w-4'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: Date | string): string {
  const date = ts instanceof Date ? ts : new Date(ts);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PinnedMessageItem({ message }: { message: Message }) {
  return (
    <article className='rounded-md bg-[#2f3136] p-3'>
      <div className='mb-1 flex items-center gap-2'>
        <span className='text-sm font-semibold text-white'>
          {message.author.displayName ?? message.author.username}
        </span>
        <span className='text-xs text-gray-400'>{formatTimestamp(message.timestamp)}</span>
      </div>
      <p className='break-words text-sm text-gray-200'>{message.content}</p>
    </article>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface PinnedMessagesPanelProps {
  channelId: string;
  serverId: string;
  channelName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PinnedMessagesPanel({
  channelId,
  serverId,
  channelName,
  isOpen,
  onClose,
}: PinnedMessagesPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // isCurrent guard: prevents a slow in-flight fetch from a previous channel
  // overwriting results after the user has already switched to a new channel.
  // Async IIFE keeps setState calls inside a function body (not directly in the
  // effect) to satisfy the react-hooks/set-state-in-effect lint rule.
  useEffect(() => {
    if (!isOpen) return;
    let isCurrent = true;
    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pinned = await getPinnedMessagesAction(channelId, serverId);
        if (isCurrent) setMessages(pinned);
      } catch {
        if (isCurrent) setError('Failed to load pinned messages.');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    })();
    return () => { isCurrent = false; };
  }, [isOpen, channelId, serverId]);

  return (
    <aside
      className={cn(
        'h-full w-60 flex-shrink-0 flex-col border-l border-black/20 bg-[#2b2d31] transition-all duration-200',
        isOpen ? 'flex' : 'hidden',
      )}
      aria-label='Pinned messages'
    >
      {/* Header */}
      <div className='flex h-12 items-center justify-between border-b border-black/20 px-4'>
        <div className='flex items-center gap-2 text-sm font-semibold text-white'>
          <PinIcon />
          <span>Pinned Messages</span>
        </div>
        <button
          onClick={onClose}
          aria-label='Close pinned messages'
          className='rounded p-1 text-gray-400 hover:bg-white/10 hover:text-gray-200'
        >
          <XIcon />
        </button>
      </div>

      {/* Body */}
      <div className='flex-1 overflow-y-auto p-3'>
        {isLoading && (
          <p className='text-center text-sm text-gray-400'>Loading…</p>
        )}

        {!isLoading && error && (
          <p className='text-center text-sm text-red-400'>{error}</p>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <p className='text-center text-sm text-gray-400'>
            No pinned messages in #{channelName}.
          </p>
        )}

        {!isLoading && !error && messages.length > 0 && (
          <ul className='flex flex-col gap-2'>
            {messages.map(msg => (
              <li key={msg.id}>
                <PinnedMessageItem message={msg} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
