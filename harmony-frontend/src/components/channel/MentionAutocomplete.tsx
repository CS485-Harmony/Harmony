'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export interface MentionCandidate {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface MentionAutocompleteProps {
  candidates: MentionCandidate[];
  selectedIndex: number;
  onSelect: (candidate: MentionCandidate) => void;
}

/**
 * Floating dropdown that appears above the message input when @ is typed.
 * Keyboard navigation (↑/↓/Enter/Escape) is handled by the parent MessageInput.
 */
export function MentionAutocomplete({
  candidates,
  selectedIndex,
  onSelect,
}: MentionAutocompleteProps) {
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the highlighted item scrolled into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (candidates.length === 0) return null;

  return (
    <div
      role='listbox'
      aria-label='Mention suggestions'
      className='absolute bottom-full left-0 z-50 mb-1 w-72 overflow-hidden rounded-md border border-white/10 bg-[#2f3136] shadow-xl'
    >
      <div className='px-2 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400'>
        Members — type to filter
      </div>
      <ul ref={listRef} className='max-h-48 overflow-y-auto py-1'>
        {candidates.map((c, i) => (
          <li
            key={c.id}
            role='option'
            aria-selected={i === selectedIndex}
            onMouseDown={(e) => {
              e.preventDefault(); // prevent textarea blur
              onSelect(c);
            }}
            className={`flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm transition-colors ${
              i === selectedIndex
                ? 'bg-indigo-500/30 text-white'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            {c.avatarUrl ? (
              <Image
                src={c.avatarUrl}
                alt={c.username}
                width={24}
                height={24}
                unoptimized
                className='h-6 w-6 flex-shrink-0 rounded-full'
              />
            ) : (
              <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white'>
                {c.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className='font-medium'>{c.displayName || c.username}</span>
            <span className='ml-auto text-xs text-gray-500'>@{c.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
