'use client';

/**
 * GifPickerPopover
 * Pixabay-powered GIF search popover for the message input toolbar.
 * Shows popular GIFs on open; switches to search results as the user types.
 * Click a GIF to fire onGifSelect with the full-quality URL.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { GifResult } from '@/app/api/gifs/route';

export interface GifPickerPopoverProps {
  onGifSelect: (url: string) => void;
}

function useGifSearch(query: string) {
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = query.trim()
      ? `/api/gifs?q=${encodeURIComponent(query.trim())}`
      : `/api/gifs`;

    const timer = setTimeout(() => {
      // State updates inside the timer callback avoid triggering the
      // react-hooks/set-state-in-effect lint rule (no synchronous setState in body).
      setIsLoading(true);
      setError(null);

      fetch(url)
        .then(r => r.json())
        .then((data: { gifs?: GifResult[]; error?: string }) => {
          if (cancelled) return;
          if (data.error) {
            setError(data.error);
            setGifs([]);
          } else {
            setGifs(data.gifs ?? []);
          }
        })
        .catch(() => {
          if (!cancelled) setError('Failed to load GIFs');
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, query.trim() ? 350 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { gifs, isLoading, error };
}

export function GifPickerPopover({ onGifSelect }: GifPickerPopoverProps) {
  const [query, setQuery] = useState('');
  const { gifs, isLoading, error } = useGifSearch(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (url: string) => {
      onGifSelect(url);
    },
    [onGifSelect],
  );

  return (
    <div
      role='dialog'
      aria-label='GIF picker'
      className='flex w-80 flex-col overflow-hidden rounded-lg border border-black/30 bg-[#2f3136] shadow-xl'
      style={{ maxHeight: '400px' }}
    >
      {/* Search bar */}
      <div className='flex items-center gap-2 border-b border-black/20 px-3 py-2'>
        <svg
          className='h-4 w-4 shrink-0 text-gray-400'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <circle cx='11' cy='11' r='8' />
          <line x1='21' y1='21' x2='16.65' y2='16.65' />
        </svg>
        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search Pixabay GIFs…'
          className='flex-1 bg-transparent text-sm text-[#dcddde] placeholder-gray-500 outline-none'
          aria-label='Search GIFs'
        />
        {query && (
          <button
            type='button'
            aria-label='Clear search'
            onClick={() => setQuery('')}
            className='text-gray-400 hover:text-gray-200'
          >
            ×
          </button>
        )}
      </div>

      {/* GIF grid */}
      <div className='flex-1 overflow-y-auto p-2' aria-label='GIF results'>
        {isLoading && (
          <div className='flex items-center justify-center py-8'>
            <svg
              className='h-5 w-5 animate-spin text-gray-400'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
            >
              <circle cx='12' cy='12' r='10' strokeOpacity={0.25} />
              <path d='M12 2a10 10 0 0 1 10 10' />
            </svg>
          </div>
        )}

        {!isLoading && error && (
          <p className='py-8 text-center text-sm text-red-400'>{error}</p>
        )}

        {!isLoading && !error && gifs.length === 0 && (
          <p className='py-8 text-center text-sm text-gray-500'>
            {query ? 'No GIFs found' : 'No trending GIFs available'}
          </p>
        )}

        {!isLoading && !error && gifs.length > 0 && (
          <div className='grid grid-cols-2 gap-1'>
            {gifs.map(gif => (
              <button
                key={gif.id}
                type='button'
                title={gif.title || 'GIF'}
                aria-label={gif.title || 'GIF'}
                onClick={() => handleSelect(gif.url)}
                className='group relative overflow-hidden rounded bg-[#40444b] transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gif.previewUrl}
                  alt={gif.title || 'GIF'}
                  loading='lazy'
                  className='h-24 w-full object-cover'
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pixabay attribution */}
      <div className='border-t border-black/20 px-3 py-1.5 text-center'>
        <span className='text-xs text-gray-500'>Powered by Pixabay</span>
      </div>
    </div>
  );
}
