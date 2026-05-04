'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  searchPublicChannelMessages,
  type PublicMessageSearchResult,
} from '@/services/publicMessageSearchService';

interface GuestMessageSearchProps {
  channelId: string;
  channelName: string;
}

function formatSearchTimestamp(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function SearchResultItem({ result }: { result: PublicMessageSearchResult }) {
  return (
    <li className='rounded-md px-3 py-2 text-left hover:bg-white/5'>
      <div className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5'>
        <span className='text-sm font-semibold text-white'>{result.author.username}</span>
        <time className='text-xs text-gray-400' dateTime={result.createdAt}>
          {formatSearchTimestamp(result.createdAt)}
        </time>
      </div>
      <p className='mt-1 line-clamp-3 text-sm leading-5 text-gray-300'>{result.context}</p>
    </li>
  );
}

export function GuestMessageSearch({ channelId, channelName }: GuestMessageSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicMessageSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setIsLoading(false);
    setHasSearched(false);
  }, []);

  const handleQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
    if (!nextQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) closeSearch();
        else openSearch();
      }
      if (event.key === 'Escape') closeSearch();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch, isOpen, openSearch]);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [isOpen]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    let cancelled = false;
    const searchTimer = window.setTimeout(async () => {
      setIsLoading(true);
      const response = await searchPublicChannelMessages(channelId, trimmedQuery);
      if (cancelled) return;
      setResults(response.results);
      setIsLoading(false);
      setHasSearched(true);
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(searchTimer);
    };
  }, [channelId, query]);

  return (
    <>
      <button
        type='button'
        onClick={openSearch}
        className='ml-auto inline-flex h-8 shrink-0 items-center gap-2 rounded-md border border-white/10 bg-[#40444b] px-3 text-xs font-medium text-gray-200 transition-colors hover:bg-[#4b5058] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5865f2]'
        aria-label='Search messages'
      >
        <svg
          className='h-4 w-4'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth={2}
          aria-hidden='true'
        >
          <circle cx='11' cy='11' r='8' />
          <path d='m21 21-4.35-4.35' />
        </svg>
        <span className='hidden sm:inline'>Search</span>
      </button>

      {isOpen && (
        <div
          className='fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20'
          role='dialog'
          aria-modal='true'
          aria-label='Search public channel messages'
          onClick={closeSearch}
        >
          <div
            className='w-full max-w-xl overflow-hidden rounded-lg border border-white/10 bg-[#2f3136] shadow-2xl'
            onClick={event => event.stopPropagation()}
          >
            <div className='flex items-center gap-3 border-b border-black/20 px-4 py-3'>
              <svg
                className='h-5 w-5 shrink-0 text-gray-400'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                aria-hidden='true'
              >
                <circle cx='11' cy='11' r='8' />
                <path d='m21 21-4.35-4.35' />
              </svg>
              <input
                ref={inputRef}
                type='search'
                value={query}
                onChange={event => handleQueryChange(event.target.value)}
                placeholder={`Search messages in #${channelName}`}
                className='min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-gray-400 focus:outline-none'
              />
              <button
                type='button'
                onClick={closeSearch}
                aria-label='Close search'
                className='rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white'
              >
                <svg
                  className='h-4 w-4'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  aria-hidden='true'
                >
                  <path d='M18 6 6 18M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='max-h-96 overflow-y-auto p-2'>
              {!query.trim() && (
                <p className='px-3 py-6 text-center text-sm text-gray-400'>
                  Type a keyword to search this channel.
                </p>
              )}
              {isLoading && (
                <p className='px-3 py-6 text-center text-sm text-gray-400'>Searching...</p>
              )}
              {!isLoading && hasSearched && results.length === 0 && (
                <p className='px-3 py-6 text-center text-sm text-gray-400'>No messages found.</p>
              )}
              {!isLoading && results.length > 0 && (
                <ul className='space-y-1' aria-label='Search results'>
                  {results.map(result => (
                    <SearchResultItem key={result.id} result={result} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
