/**
 * Channel Component: MessageInput
 * Message composition bar at the bottom of the channel view.
 * Supports multi-line input, Enter-to-send, character limit, file attachments,
 * emoji picker, and read-only guest state.
 * Ref: dev-spec-guest-public-channel-view.md — M3, CL-C3
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { sendMessageAction } from '@/app/actions/sendMessage';
import { createReplyAction } from '@/app/actions/createReply';
import type { Message, AttachmentInput } from '@/types';

// Lazy-load the heavy emoji picker bundle so it doesn't block the initial render
const EmojiPickerPopover = dynamic(
  () =>
    import('@/components/channel/EmojiPickerPopover').then(m => ({
      default: m.EmojiPickerPopover,
    })),
  { ssr: false },
);

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
  /** When set, shows a "Replying to X" banner and sends as a reply to this message */
  replyingTo?: Message | null;
  /** Called when the user dismisses the reply banner */
  onCancelReply?: () => void;
}

export function MessageInput({
  channelId,
  channelName,
  serverId,
  isReadOnly = false,
  onMessageSent,
  replyingTo,
  onCancelReply,
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<AttachmentInput[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // On channel switch: clear draft, clear attachments, clear any send error, and autofocus
  useEffect(() => {
    setValue('');
    setSendError(null);
    setPendingAttachments([]);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  }, [channelId]);

  // Close picker when clicking outside the popover
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Auto-resize: grow up to ~8 lines, then scroll
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [value]);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so selecting the same file again triggers onChange
    e.target.value = '';

    setIsUploading(true);
    setSendError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/attachments/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          typeof body?.error === 'string'
            ? body.error
            : res.status === 401
              ? 'You must be logged in to upload files.'
              : res.status === 413
                ? 'File is too large (max 25 MB).'
                : 'Upload failed. Unsupported file type or server error.';
        setSendError(msg);
        return;
      }

      const attachment = (await res.json()) as AttachmentInput;
      setPendingAttachments(prev => [...prev, attachment]);
    } catch {
      setSendError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      textareaRef.current?.focus();
    }
  }, []);

  const removeAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = useCallback(
    (emoji: { native: string }) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart ?? value.length;
      const end = textarea.selectionEnd ?? value.length;
      const next = value.slice(0, start) + emoji.native + value.slice(end);

      if (next.length <= MAX_CHARS) {
        setValue(next);
        // Restore focus and move cursor after the inserted emoji
        requestAnimationFrame(() => {
          const pos = start + emoji.native.length;
          textarea.focus();
          textarea.setSelectionRange(pos, pos);
        });
      }

      setShowEmojiPicker(false);
    },
    [value],
  );

  const handleSend = useCallback(async () => {
    const trimmed = value.trim();
    if ((!trimmed && !pendingAttachments.length) || isSending || isUploading || isReadOnly) return;
    setIsSending(true);
    setSendError(null);
    try {
      let msg: Message;
      if (replyingTo) {
        const result = await createReplyAction(replyingTo.id, channelId, serverId, trimmed);
        if (!result.ok) {
          setSendError(
            result.forbidden
              ? "You don't have permission to reply in this channel."
              : 'Failed to send reply. Please try again.',
          );
          return;
        }
        msg = result.message;
      } else {
        msg = await sendMessageAction(
          channelId,
          trimmed,
          serverId,
          pendingAttachments.length ? pendingAttachments : undefined,
        );
      }
      setValue('');
      setPendingAttachments([]);
      onMessageSent?.(msg);
    } catch {
      setSendError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  }, [
    value,
    isSending,
    isUploading,
    isReadOnly,
    channelId,
    serverId,
    onMessageSent,
    pendingAttachments,
    replyingTo,
  ]);

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
    <div className='relative flex-shrink-0 px-4 pb-6 pt-2'>
      {replyingTo && (
        <div className='mb-1 flex items-center gap-2 rounded-t bg-[#36393f] px-3 py-1.5 text-xs text-gray-400'>
          <svg className='h-3.5 w-3.5 flex-shrink-0' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
            <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
          </svg>
          <span>
            Replying to{' '}
            <span className='font-medium text-white'>
              {replyingTo.author.displayName ?? replyingTo.author.username}
            </span>
          </span>
          <span className='ml-1 truncate text-gray-500'>{replyingTo.content}</span>
          <button
            type='button'
            aria-label='Cancel reply'
            onClick={onCancelReply}
            className='ml-auto flex-shrink-0 text-gray-500 hover:text-gray-200 transition-colors'
          >
            ✕
          </button>
        </div>
      )}
      {sendError && (
        <p className='mb-1 px-1 text-xs text-red-400' role='alert'>
          {sendError}
        </p>
      )}

      {/* Pending attachment chips */}
      {pendingAttachments.length > 0 && (
        <div className='mb-1 flex flex-wrap gap-1 px-1' aria-label='Pending attachments'>
          {pendingAttachments.map((att, i) => (
            <span
              key={`${att.url}-${i}`}
              className='flex items-center gap-1 rounded bg-[#36393f] px-2 py-1 text-xs text-gray-300'
            >
              <svg className='h-3 w-3 flex-shrink-0' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z' />
              </svg>
              <span className='max-w-[120px] truncate'>{att.filename}</span>
              <button
                type='button'
                aria-label={`Remove attachment ${att.filename}`}
                onClick={() => removeAttachment(i)}
                className='ml-0.5 text-gray-400 hover:text-gray-100'
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div
        className={cn(
          'flex items-end gap-1 rounded-lg bg-[#40444b] px-2 py-2',
          isAtLimit && 'ring-1 ring-red-500/60',
        )}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          className='hidden'
          aria-hidden='true'
          onChange={handleFileChange}
          accept='image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        />

        {/* Attachment button */}
        <button
          type='button'
          title={isUploading ? 'Uploading…' : 'Attach file'}
          aria-label={isUploading ? 'Uploading file' : 'Attach file'}
          aria-busy={isUploading}
          disabled={isUploading || isSending}
          onClick={handleAttachClick}
          className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isUploading ? (
            /* Spinner while uploading */
            <svg
              className='h-4 w-4 animate-spin'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
            >
              <circle cx='12' cy='12' r='10' strokeOpacity={0.25} />
              <path d='M12 2a10 10 0 0 1 10 10' />
            </svg>
          ) : (
            <svg className='h-5 w-5' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z' />
            </svg>
          )}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={replyingTo ? `Reply to ${replyingTo.author.displayName ?? replyingTo.author.username}…` : `Message #${channelName}`}
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
          <div ref={emojiPickerRef} className='relative'>
            <button
              type='button'
              title='Emoji'
              aria-label='Emoji'
              aria-expanded={showEmojiPicker}
              aria-haspopup='dialog'
              onClick={() => setShowEmojiPicker(prev => !prev)}
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

            {showEmojiPicker && (
              <div
                role='dialog'
                aria-label='Emoji picker'
                className='absolute bottom-full right-0 z-50 mb-2'
              >
                <EmojiPickerPopover onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
