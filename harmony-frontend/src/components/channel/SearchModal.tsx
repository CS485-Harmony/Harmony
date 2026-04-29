/**
 * Channel Component: SearchModal
 * Overlay modal for searching messages within a channel.
 *
 * Features:
 *   - Opens via TopBar icon click or Ctrl+K / Cmd+K keyboard shortcut
 *   - Client-side filtering of mock messages by content
 *   - Result previews with author, snippet, and timestamp
 *   - Closes on Escape key or backdrop click
 *   - Focus trap + ARIA attributes for accessibility
 *
 * Ref: dev-spec-guest-public-channel-view.md — SearchBar (C1.8)
 */

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import type { Message } from '@/types';

// ─── Search logic ─────────────────────────────────────────────────────────────

type SortOrder = 'newest' | 'oldest';

function filterMessages(messages: Message[], query: string): Message[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return messages.filter(m => m.content.toLowerCase().includes(q));
}

function sortMessages(messages: Message[], order: SortOrder): Message[] {
  return [...messages].sort((a, b) => {
    const tA = new Date(a.timestamp).getTime();
    const tB = new Date(b.timestamp).getTime();
    return order === 'newest' ? tB - tA : tA - tB;
  });
}

// ─── Result item ──────────────────────────────────────────────────────────────

function ResultItem({
  message,
  query,
  onClick,
}: {
  message: Message;
  query: string;
  onClick: (message: Message) => void;
}) {
  // Highlight the matching portion of content
  const content = message.content;
  const idx = content.toLowerCase().indexOf(query.toLowerCase());

  let highlighted: React.ReactNode = content;
  if (idx !== -1 && query) {
    highlighted = (
      <>
        {content.slice(0, idx)}
        <mark className='rounded bg-yellow-200 px-0.5 not-italic'>
          {content.slice(idx, idx + query.length)}
        </mark>
        {content.slice(idx + query.length)}
      </>
    );
  }

  return (
    <button
      onClick={() => onClick(message)}
      className='flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-gray-100'
    >
      {/* Avatar */}
      {message.author.avatarUrl ? (
        <Image
          src={message.author.avatarUrl}
          alt={message.author.username}
          width={32}
          height={32}
          unoptimized
          className='mt-0.5 h-8 w-8 flex-shrink-0 rounded-full'
        />
      ) : (
        <div className='mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-600'>
          {message.author.username?.charAt(0).toUpperCase() || '?'}
        </div>
      )}

      {/* Content */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-baseline gap-2'>
          <span className='text-sm font-semibold text-gray-900'>
            {message.author.displayName ?? message.author.username}
          </span>
          <span className='text-xs text-gray-400'>{formatRelativeTime(message.timestamp)}</span>
        </div>
        <p className='mt-0.5 truncate text-sm text-gray-600'>{highlighted}</p>
      </div>
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface SearchModalProps {
  /** Messages to search through */
  messages: Message[];
  /** Name of the channel being searched (used in placeholder) */
  channelName?: string;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when a search result is selected */
  onResultSelect?: (message: Message) => void;
}

export function SearchModal({
  messages,
  channelName,
  isOpen,
  onClose,
  onResultSelect,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  // #c11: debounce search to avoid re-filtering on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  // #c40: memoize to avoid re-filtering on unrelated re-renders
  const results = useMemo(
    () => sortMessages(filterMessages(messages, debouncedQuery), sortOrder),
    [messages, debouncedQuery, sortOrder],
  );

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      // Resetting query and sort on close is intentional: next open should start clean.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setSortOrder('newest');
    }
  }, [isOpen]);

  // #c23: Ctrl+K/Cmd+K toggling is handled exclusively by HarmonyShell to avoid
  // duplicate listeners. SearchModal only handles Escape to close.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus inside the modal.
  // #c29: onKeyDown on the modal panel only fires when focus is already inside
  // it, so we don't need to check whether activeElement is outside. We simply
  // wrap Tab at the first/last boundary.
  const handleKeyDownModal = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'input, button, [href], [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  const handleResultClick = useCallback(
    (message: Message) => {
      onResultSelect?.(message);
      onClose();
    },
    [onResultSelect, onClose],
  );

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className='fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label='Search messages'
    >
      {/* Modal panel */}
      <div
        ref={modalRef}
        className='mx-4 w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl'
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDownModal}
      >
        {/* Search input */}
        <div className='flex items-center gap-3 border-b border-gray-200 px-4 py-3'>
          <svg
            className='h-5 w-5 flex-shrink-0 text-gray-400'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
          >
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.35-4.35' />
          </svg>

          <input
            ref={inputRef}
            type='text'
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={channelName ? `Search messages in #${channelName}` : 'Search messages…'}
            className='flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none'
          />

          <kbd className='hidden select-none rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 sm:inline'>
            Esc
          </kbd>

          <button
            onClick={onClose}
            aria-label='Close search'
            className='rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700'
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

        {/* Results / states */}
        <div
          className={cn('max-h-96 overflow-y-auto', results.length > 0 || query ? 'py-2' : 'py-6')}
        >
          {/* Initial hint */}
          {!query && (
            <p className='text-center text-sm text-gray-400'>
              Type to search messages
              <span className='ml-1 hidden sm:inline'>
                — press{' '}
                <kbd className='rounded border border-gray-200 bg-gray-100 px-1 py-0.5 text-xs'>
                  Ctrl+K
                </kbd>{' '}
                to toggle
              </span>
            </p>
          )}

          {/* No results — uses debouncedQuery so it only appears after debounce settles */}
          {debouncedQuery && results.length === 0 && (
            <p className='text-center text-sm text-gray-400'>
              No results found for &ldquo;{debouncedQuery}&rdquo;
            </p>
          )}

          {/* Result list */}
          {results.length > 0 && (
            <div className='px-2'>
              <div className='mb-1 flex items-center justify-between px-1'>
                <p className='text-xs text-gray-400'>
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
                <div className='flex items-center gap-1' role='group' aria-label='Sort order'>
                  <button
                    onClick={() => setSortOrder('newest')}
                    aria-pressed={sortOrder === 'newest'}
                    className={cn(
                      'rounded px-2 py-0.5 text-xs transition-colors',
                      sortOrder === 'newest'
                        ? 'bg-indigo-100 font-medium text-indigo-700'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
                    )}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortOrder('oldest')}
                    aria-pressed={sortOrder === 'oldest'}
                    className={cn(
                      'rounded px-2 py-0.5 text-xs transition-colors',
                      sortOrder === 'oldest'
                        ? 'bg-indigo-100 font-medium text-indigo-700'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
                    )}
                  >
                    Oldest
                  </button>
                </div>
              </div>
              {results.map(message => (
                <ResultItem
                  key={message.id}
                  message={message}
                  query={debouncedQuery}
                  onClick={handleResultClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
