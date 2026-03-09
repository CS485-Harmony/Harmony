/**
 * Channel Component: MessageInput
 * Message composition bar at the bottom of the channel view.
 * Supports multi-line input, Enter-to-send, character limit, and read-only guest state.
 * Ref: dev-spec-guest-public-channel-view.md — M3, CL-C3
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { sendMessageAction } from '@/app/actions/sendMessage';
import type { Message } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_CHARS = 2000;
/** Show remaining-char indicator when this many characters remain */
const CHAR_WARN_THRESHOLD = 200;

// ─── Component ────────────────────────────────────────────────────────────────

export interface MessageInputProps {
  channelId: string;
  channelName: string;
  serverId: string;
  /** When true, replaces the input with a permission notice (guest / read-only views) */
  isReadOnly?: boolean;
  /** Called with the newly created message after a successful send */
  onMessageSent?: (message: Message) => void;
}

export function MessageInput({
  channelId,
  channelName,
  serverId,
  isReadOnly = false,
  onMessageSent,
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // On channel switch: clear draft, clear any send error, and autofocus the
  // textarea so the user can start typing without clicking the input first
  useEffect(() => {
    setValue('');
    setSendError(null);
    textareaRef.current?.focus();
  }, [channelId]);

  // Auto-resize: grow up to ~8 lines, then scroll
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [value]);

  const handleSend = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || isSending || isReadOnly) return;
    setIsSending(true);
    setSendError(null);
    try {
      const msg = await sendMessageAction(channelId, trimmed, serverId);
      setValue('');
      onMessageSent?.(msg);
    } catch {
      setSendError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
      // Return focus to textarea after send
      textareaRef.current?.focus();
    }
  }, [value, isSending, isReadOnly, channelId, serverId, onMessageSent]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter inserts a newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Enforce hard character limit
    if (e.target.value.length <= MAX_CHARS) {
      setValue(e.target.value);
    }
  };

  // ── Read-only / guest view ──────────────────────────────────────────────────
  if (isReadOnly) {
    return (
      <div className='flex-shrink-0 px-4 pb-6 pt-2'>
        <div className='rounded-lg bg-[#40444b] px-4 py-3 text-center text-sm text-gray-400'>
          You do not have permission to send messages in this channel.
        </div>
      </div>
    );
  }

  // ── Character counter state ─────────────────────────────────────────────────
  const remaining = MAX_CHARS - value.length;
  const showCounter = remaining <= CHAR_WARN_THRESHOLD;
  const isAtLimit = remaining <= 0;

  return (
    <div className='flex-shrink-0 px-4 pb-6 pt-2'>
      {sendError && (
        <p className='mb-1 px-1 text-xs text-red-400' role='alert'>
          {sendError}
        </p>
      )}
      <div
        className={cn(
          'flex items-end gap-1 rounded-lg bg-[#40444b] px-2 py-2',
          isAtLimit && 'ring-1 ring-red-500/60',
        )}
      >
        {/* Attachment button */}
        <button
          type='button'
          title='Attach file (coming soon)'
          aria-label='Attach file'
          className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200'
        >
          <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z' />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName}`}
          rows={1}
          disabled={isSending}
          aria-label={`Message #${channelName}`}
          aria-multiline='true'
          className='flex-1 resize-none bg-transparent text-sm leading-relaxed text-[#dcddde] placeholder-gray-500 outline-none disabled:opacity-60'
          style={{ maxHeight: '240px', overflowY: 'auto' }}
        />

        {/* Right-side controls */}
        <div className='flex flex-shrink-0 items-center gap-1'>
          {/* Character counter — only visible near/at limit */}
          {showCounter && (
            <span
              className={cn(
                'min-w-[2rem] text-right text-xs tabular-nums',
                isAtLimit ? 'text-red-400' : 'text-yellow-400',
              )}
              aria-live='polite'
              aria-label={`${remaining} characters remaining`}
            >
              {remaining}
            </span>
          )}

          {/* GIF button */}
          <button
            type='button'
            title='Send GIF (coming soon)'
            aria-label='GIF'
            className='flex h-8 items-center justify-center rounded px-1.5 text-xs font-bold text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200'
          >
            GIF
          </button>

          {/* Emoji button */}
          <button
            type='button'
            title='Emoji (coming soon)'
            aria-label='Emoji'
            className='flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200'
          >
            <svg
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='M8 13s1.5 2 4 2 4-2 4-2' />
              <line x1='9' y1='9' x2='9.01' y2='9' />
              <line x1='15' y1='9' x2='15.01' y2='9' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
