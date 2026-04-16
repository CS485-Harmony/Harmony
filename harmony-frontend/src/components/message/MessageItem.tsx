/**
 * Component: MessageItem
 * Individual message row matching Discord's message style.
 * Supports a full variant (avatar + author + timestamp + content) and a
 * compact variant (no avatar/name) for grouped follow-up messages.
 *
 * ActionBar: appears on hover/focus. Shows Reply and Add Reaction stubs for
 * all users. Shows a "More" (⋯) dropdown with "Pin/Unpin Message" for users
 * with message:pin permission (MODERATOR, ADMIN, OWNER).
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { formatMessageTimestamp, formatTimeOnly } from '@/lib/utils';
import { pinMessageAction, unpinMessageAction } from '@/app/actions/pinMessage';
import type { Message, Reaction } from '@/types';

// ─── ReactionList ─────────────────────────────────────────────────────────────

function ReactionList({ reactions, messageId }: { reactions: Reaction[]; messageId: string }) {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div className='mt-1 flex flex-wrap gap-1'>
      {reactions.map(r => (
        <button
          key={`${r.emoji}-${messageId}`}
          type='button'
          aria-label={`React with ${r.emoji} (${r.count} ${r.count !== 1 ? 'reactions' : 'reaction'})`}
          className='flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300 hover:bg-white/10'
        >
          <span>{r.emoji}</span>
          <span>{r.count}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PinMenuIcon() {
  return (
    <svg className='h-3.5 w-3.5 flex-shrink-0' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} aria-hidden='true'>
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

// ─── Hover action bar ─────────────────────────────────────────────────────────

type PinState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hover/focus-within action bar for a message.
 * Reply and Add Reaction are stubs (future issues).
 * More (⋯) is only rendered when canPin is true, and opens a dropdown with
 * Pin/Unpin — which calls the backend and tracks state locally.
 */
function ActionBar({
  messageId,
  serverId,
  canPin,
  initialPinned,
}: {
  messageId: string;
  serverId?: string;
  canPin?: boolean;
  initialPinned?: boolean;
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(initialPinned ?? false);
  const [pinState, setPinState] = useState<PinState>('idle');
  const [pinErrorMsg, setPinErrorMsg] = useState('');
  const moreRef = useRef<HTMLDivElement>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click; clean up timers on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMoreOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isMoreOpen]);

  const handlePinToggle = useCallback(async () => {
    if (!serverId) return;
    setIsMoreOpen(false);
    setPinState('loading');
    const verb = isPinned ? 'unpin' : 'pin';
    try {
      const result = isPinned
        ? await unpinMessageAction(messageId, serverId)
        : await pinMessageAction(messageId, serverId);
      if (result.ok) {
        setIsPinned(prev => !prev);
        setPinState('success');
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setPinState('idle'), 2000);
      } else {
        const msg = result.forbidden
          ? `You don't have permission to ${verb} messages.`
          : `Failed to ${verb} message. Please try again.`;
        setPinErrorMsg(msg);
        setPinState('error');
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => { setPinState('idle'); setPinErrorMsg(''); }, 3000);
      }
    } catch {
      const msg = `Failed to ${verb} message. Please try again.`;
      setPinErrorMsg(msg);
      setPinState('error');
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => { setPinState('idle'); setPinErrorMsg(''); }, 3000);
    }
  }, [isPinned, messageId, serverId]);

  return (
    <div className='absolute -top-3 right-4 z-10 flex items-center rounded-md border border-white/10 bg-[#2f3136] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'>
      {/* Inline pin feedback */}
      {pinState === 'success' && (
        <span className='px-2 text-xs text-green-400'>{isPinned ? '📌 Pinned' : 'Unpinned'}</span>
      )}
      {pinState === 'error' && (
        <span className='px-2 text-xs text-red-400'>{pinErrorMsg}</span>
      )}

      {/* Reply (stub) */}
      <button
        type='button'
        aria-label='Reply'
        title='Reply'
        className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
      >
        <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
          <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
        </svg>
      </button>

      {/* Add Reaction (stub) */}
      <button
        type='button'
        aria-label='Add Reaction'
        title='Add Reaction'
        className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
      >
        <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
          <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-3.5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.476 2.37a.75.75 0 0 0-1.06-1.06 4.5 4.5 0 0 1-6.832 0 .75.75 0 0 0-1.061 1.06 6 6 0 0 0 8.953 0z' />
        </svg>
      </button>

      {/* More — only rendered when user has pin permission */}
      {canPin && (
        <div ref={moreRef} className='relative'>
          <button
            type='button'
            aria-label='More actions'
            title='More'
            aria-expanded={isMoreOpen}
            onClick={() => setIsMoreOpen(v => !v)}
            className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
          >
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
              <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
            </svg>
          </button>

          {isMoreOpen && (
            <div className='absolute right-0 top-full mt-1 min-w-[160px] rounded-md border border-white/10 bg-[#18191c] py-1 shadow-xl z-20'>
              <button
                type='button'
                onClick={handlePinToggle}
                disabled={pinState === 'loading'}
                className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white disabled:opacity-50 transition-colors'
              >
                <PinMenuIcon />
                {isPinned ? 'Unpin Message' : 'Pin Message'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MessageItem ──────────────────────────────────────────────────────────────

export function MessageItem({
  message,
  showHeader = true,
  canPin,
  serverId,
}: {
  message: Message;
  /** Set to false for grouped follow-up messages from the same author. Hides the avatar and author line. */
  showHeader?: boolean;
  /** When true, shows the pin/unpin option in the action bar. Grant to MODERATOR+. */
  canPin?: boolean;
  /** Required for pin actions. Passed alongside canPin. */
  serverId?: string;
}) {
  const [avatarError, setAvatarError] = useState(false);
  // Render-phase derived-state reset: when the avatar URL changes (including A→B→A),
  // reset avatarError so the new URL is always attempted.
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(message.author.avatarUrl);
  if (prevAvatarUrl !== message.author.avatarUrl) {
    setPrevAvatarUrl(message.author.avatarUrl);
    if (avatarError) setAvatarError(false);
  }

  // Trim first to guard against empty-string usernames — || catches "" where ?? would not.
  const trimmedUsername = message.author.username?.trim();
  const authorInitial = trimmedUsername?.charAt(0)?.toUpperCase() || '?';

  // TODO: Author name role coloring
  // The Author type embedded in Message does not carry a role field —
  // role lives on the User entity. When real auth/user data is wired up,
  // pass the user's role here and map it to a colour:
  //   owner → #f0b132 (gold), admin → #ed4245 (red),
  //   moderator → #3ba55c (green), member/guest → text-white
  const authorNameClass = 'cursor-pointer font-medium text-white hover:underline';

  const actionBar = (
    <ActionBar
      messageId={message.id}
      serverId={serverId}
      canPin={canPin}
      initialPinned={!!message.pinned}
    />
  );

  if (!showHeader) {
    return (
      <div className='group relative flex gap-4 px-4 py-0.5 hover:bg-white/[0.02]'>
        {actionBar}
        {/* Spacer aligns content with the 40px avatar of the header row */}
        <div className='w-10 flex-shrink-0 text-right'>
          <span className='invisible text-[10px] text-gray-500 group-hover:visible group-focus-within:visible'>
            {formatTimeOnly(message.timestamp)}
          </span>
        </div>
        <div className='min-w-0 flex-1'>
          <p className='whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
            {message.content}
            {message.editedAt && <span className='ml-1 text-[10px] text-gray-500'>(edited)</span>}
          </p>
          <ReactionList reactions={message.reactions ?? []} messageId={message.id} />
        </div>
      </div>
    );
  }

  return (
    <div className='group relative flex gap-4 px-4 py-0.5 hover:bg-white/[0.02]'>
      {actionBar}
      {/* Avatar */}
      <div className='mt-0.5 flex-shrink-0'>
        {message.author.avatarUrl && !avatarError ? (
          <Image
            src={message.author.avatarUrl}
            alt={message.author.username}
            width={40}
            height={40}
            unoptimized
            className='h-10 w-10 rounded-full'
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white'>
            {authorInitial}
          </div>
        )}
      </div>
      {/* Content */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-baseline gap-2'>
          <span className={authorNameClass}>
            {message.author.displayName ?? message.author.username}
          </span>
          <span className='text-[11px] text-gray-400'>
            {formatMessageTimestamp(message.timestamp)}
          </span>
          {message.editedAt && <span className='text-[10px] text-gray-500'>(edited)</span>}
        </div>
        <p className='mt-0.5 whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
          {message.content}
        </p>
        <ReactionList reactions={message.reactions ?? []} messageId={message.id} />
      </div>
    </div>
  );
}
