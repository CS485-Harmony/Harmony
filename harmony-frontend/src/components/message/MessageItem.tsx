/**
 * Component: MessageItem
 * Individual message row matching Discord's message style.
 * Supports a full variant (avatar + author + timestamp + content) and a
 * compact variant (no avatar/name) for grouped follow-up messages.
 *
 * ActionBar: appears on hover/focus. Shows Reply (functional) and Add Reaction
 * stub for all users. Shows a "More" (⋯) dropdown with "Pin/Unpin Message" for
 * users with message:pin permission (MODERATOR, ADMIN, OWNER), and "Edit
 * Message" for the message's own author.
 *
 * Replies: messages with a parentMessage show a Discord-style inline reply
 * banner above the content. Clicking the banner scrolls to the parent message.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { formatMessageTimestamp, formatTimeOnly } from '@/lib/utils';
import { pinMessageAction, unpinMessageAction } from '@/app/actions/pinMessage';
import { editMessageAction } from '@/app/actions/editMessage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { Message, Reaction } from '@/types';

// ─── AttachmentList ───────────────────────────────────────────────────────────

function AttachmentList({ attachments }: { attachments: Message['attachments'] }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className='mt-1.5 flex flex-col gap-2'>
      {attachments.map(a => {
        const isImage = a.type?.startsWith('image/');
        if (isImage) {
          return (
            <a
              key={a.id}
              href={a.url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block max-w-sm'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.url} alt={a.filename} className='max-h-64 rounded-md object-contain' />
            </a>
          );
        }
        return (
          <a
            key={a.id}
            href={a.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-blue-400 hover:bg-white/10 hover:text-blue-300 transition-colors w-fit'
          >
            <svg
              className='h-4 w-4 flex-shrink-0'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              aria-hidden='true'
            >
              <path d='M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48' />
            </svg>
            <span className='truncate max-w-xs'>{a.filename}</span>
          </a>
        );
      })}
    </div>
  );
}

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

// ─── ReplyBanner ──────────────────────────────────────────────────────────────

function ReplyBanner({ parentMessage }: { parentMessage: NonNullable<Message['parentMessage']> }) {
  const handleClick = () => {
    const el = document.querySelector(`[data-message-id="${parentMessage.id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const label = parentMessage.isDeleted
    ? 'Original message deleted'
    : `${parentMessage.author.displayName ?? parentMessage.author.username}: ${parentMessage.content}`;

  return (
    <button
      type='button'
      onClick={handleClick}
      title={label}
      className='mb-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors max-w-full'
      aria-label={`Jump to replied message from ${parentMessage.author.displayName ?? parentMessage.author.username}`}
    >
      <svg className='h-3 w-3 flex-shrink-0 rotate-180' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
        <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
      </svg>
      {parentMessage.isDeleted ? (
        <span className='italic text-gray-500'>Original message deleted</span>
      ) : (
        <>
          <span className='font-medium text-gray-300 flex-shrink-0'>
            {parentMessage.author.displayName ?? parentMessage.author.username}
          </span>
          <span className='min-w-0 truncate'>{parentMessage.content}</span>
        </>
      )}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PinMenuIcon() {
  return (
    <svg
      className='h-3.5 w-3.5 flex-shrink-0'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      aria-hidden='true'
    >
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

// ─── Hover action bar ─────────────────────────────────────────────────────────

type PinState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hover/focus-within action bar for a message.
 * Reply triggers onReplyClick (opens thread for authenticated users).
 * More (⋯) is rendered when canPin or isOwnMessage is true, and opens a
 * dropdown with Pin/Unpin (canPin) and Edit Message (isOwnMessage).
 */
function ActionBar({
  messageId,
  serverId,
  canPin,
  initialPinned,
  isOwnMessage,
  onEditClick,
  onReplyClick,
}: {
  messageId: string;
  serverId?: string;
  canPin?: boolean;
  initialPinned?: boolean;
  isOwnMessage?: boolean;
  onEditClick?: () => void;
  onReplyClick?: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
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
        errorTimerRef.current = setTimeout(() => {
          setPinState('idle');
          setPinErrorMsg('');
        }, 3000);
      }
    } catch {
      const msg = `Failed to ${verb} message. Please try again.`;
      setPinErrorMsg(msg);
      setPinState('error');
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setPinState('idle');
        setPinErrorMsg('');
      }, 3000);
    }
  }, [isPinned, messageId, serverId]);

  return (
    <div className='absolute -top-3 right-4 z-10 flex items-center rounded-md border border-white/10 bg-[#2f3136] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'>
      {/* Inline pin feedback */}
      {pinState === 'success' && (
        <span className='px-2 text-xs text-green-400'>{isPinned ? '📌 Pinned' : 'Unpinned'}</span>
      )}
      {pinState === 'error' && <span className='px-2 text-xs text-red-400'>{pinErrorMsg}</span>}

      {/* Reply — redirects guests to login; opens thread for authenticated users */}
      <button
        type='button'
        aria-label='Reply'
        title='Reply'
        onClick={
          !isAuthenticated
            ? () => router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
            : onReplyClick
        }
        className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
      >
        <svg
          className='h-4 w-4'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
          focusable='false'
        >
          <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
        </svg>
      </button>

      {/* Add Reaction — redirects guests to login; stub for authenticated users */}
      <button
        type='button'
        aria-label='Add Reaction'
        title='Add Reaction'
        onClick={
          !isAuthenticated
            ? () => router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
            : undefined
        }
        className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
      >
        <svg
          className='h-4 w-4'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
          focusable='false'
        >
          <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-3.5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.476 2.37a.75.75 0 0 0-1.06-1.06 4.5 4.5 0 0 1-6.832 0 .75.75 0 0 0-1.061 1.06 6 6 0 0 0 8.953 0z' />
        </svg>
      </button>

      {/* More — rendered when user can pin or is the message author */}
      {(canPin || isOwnMessage) && (
        <div ref={moreRef} className='relative'>
          <button
            type='button'
            aria-label='More actions'
            title='More'
            aria-expanded={isMoreOpen}
            onClick={() => setIsMoreOpen(v => !v)}
            className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
          >
            <svg
              className='h-4 w-4'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
              focusable='false'
            >
              <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
            </svg>
          </button>

          {isMoreOpen && (
            <div className='absolute right-0 top-full mt-1 min-w-[160px] rounded-md border border-white/10 bg-[#18191c] py-1 shadow-xl z-20'>
              {isOwnMessage && (
                <button
                  type='button'
                  onClick={() => {
                    setIsMoreOpen(false);
                    onEditClick?.();
                  }}
                  className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white transition-colors'
                >
                  <svg
                    className='h-3.5 w-3.5 flex-shrink-0'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    aria-hidden='true'
                  >
                    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                    <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                  </svg>
                  Edit Message
                </button>
              )}
              {canPin && (
                <button
                  type='button'
                  onClick={handlePinToggle}
                  disabled={pinState === 'loading'}
                  className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white disabled:opacity-50 transition-colors'
                >
                  <PinMenuIcon />
                  {isPinned ? 'Unpin Message' : 'Pin Message'}
                </button>
              )}
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
  onReplyClick,
}: {
  message: Message;
  /** Set to false for grouped follow-up messages from the same author. Hides the avatar and author line. */
  showHeader?: boolean;
  /** When true, shows the pin/unpin option in the action bar. Grant to MODERATOR+. */
  canPin?: boolean;
  /** Required for pin actions. Passed alongside canPin. */
  serverId?: string;
  /** Called when the user clicks Reply on this message. */
  onReplyClick?: (message: Message) => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [avatarError, setAvatarError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);
  const [localContent, setLocalContent] = useState<string | undefined>(undefined);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Render-phase derived-state reset: when the avatar URL changes (including A→B→A),
  // reset avatarError so the new URL is always attempted.
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(message.author.avatarUrl);
  if (prevAvatarUrl !== message.author.avatarUrl) {
    setPrevAvatarUrl(message.author.avatarUrl);
    if (avatarError) setAvatarError(false);
  }

  // Keep editContent in sync when message content changes externally (e.g. via SSE)
  const [prevContent, setPrevContent] = useState(message.content);
  if (!isEditing && prevContent !== message.content) {
    setPrevContent(message.content);
    setEditContent(message.content);
    if (localContent !== undefined) setLocalContent(undefined);
  }

  const isOwnMessage = !!user && user.id === message.author.id;

  const handleEditClick = useCallback(() => {
    const current = localContent ?? message.content;
    setEditContent(current);
    setIsEditing(true);
    setTimeout(() => {
      const el = editTextareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 0);
  }, [localContent, message.content]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditContent(localContent ?? message.content);
  }, [localContent, message.content]);

  const handleEditSave = useCallback(async () => {
    const trimmed = editContent.trim();
    const currentContent = localContent ?? message.content;
    if (!trimmed || trimmed === currentContent || !serverId) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const result = await editMessageAction(message.id, serverId, trimmed);
    setIsSaving(false);
    if (result.ok) {
      setIsEditing(false);
      setLocalContent(result.message.content);
    } else {
      const msg = result.forbidden
        ? "You don't have permission to edit this message."
        : 'Failed to edit message. Please try again.';
      showToast({ message: msg, type: 'error' });
    }
  }, [editContent, localContent, message.content, message.id, serverId, showToast]);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleEditSave();
      } else if (e.key === 'Escape') {
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel],
  );

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

  const handleReplyClick = useCallback(() => {
    onReplyClick?.(message);
  }, [onReplyClick, message]);

  const actionBar = (
    <ActionBar
      messageId={message.id}
      serverId={serverId}
      canPin={canPin}
      initialPinned={!!message.pinned}
      isOwnMessage={isOwnMessage}
      onEditClick={handleEditClick}
      onReplyClick={handleReplyClick}
    />
  );

  const editUi = (
    <div className='mt-0.5'>
      <textarea
        ref={editTextareaRef}
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
        onKeyDown={handleEditKeyDown}
        disabled={isSaving}
        rows={3}
        className='w-full resize-none rounded-md bg-[#40444b] px-3 py-2 text-sm text-[#dcddde] outline-none focus:ring-1 focus:ring-[#5865f2] disabled:opacity-50'
        aria-label='Edit message'
      />
      <div className='mt-1 flex items-center gap-2 text-xs text-gray-400'>
        <span>
          escape to{' '}
          <button
            type='button'
            onClick={handleEditCancel}
            className='text-[#5865f2] hover:underline'
          >
            cancel
          </button>
          {' · '}enter to{' '}
          <button
            type='button'
            onClick={handleEditSave}
            disabled={isSaving}
            className='text-[#5865f2] hover:underline disabled:opacity-50'
          >
            save
          </button>
        </span>
      </div>
    </div>
  );

  if (!showHeader) {
    return (
      <div
        data-message-id={message.id}
        className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
      >
        {message.parentMessage && <div className='ml-14 pt-1'><ReplyBanner parentMessage={message.parentMessage} /></div>}
        <div className='flex gap-4'>
          {!isEditing && actionBar}
          {/* Spacer aligns content with the 40px avatar of the header row */}
          <div className='w-10 flex-shrink-0 text-right'>
            <span className='invisible text-[10px] text-gray-500 group-hover:visible group-focus-within:visible'>
              {formatTimeOnly(message.timestamp)}
            </span>
          </div>
          <div className='min-w-0 flex-1'>
            {isEditing ? (
              editUi
            ) : (
              <p className='whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
                {localContent ?? message.content}
                {(message.editedAt || localContent !== undefined) && (
                  <span className='ml-1 text-[10px] text-gray-500'>(edited)</span>
                )}
              </p>
            )}
            <AttachmentList attachments={message.attachments} />
            <ReactionList reactions={message.reactions ?? []} messageId={message.id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-message-id={message.id}
      className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
    >
      {message.parentMessage && <div className='ml-14 pt-1'><ReplyBanner parentMessage={message.parentMessage} /></div>}
      <div className='flex gap-4'>
        {!isEditing && actionBar}
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
            {(message.editedAt || localContent !== undefined) && (
              <span className='text-[10px] text-gray-500'>(edited)</span>
            )}
          </div>
          {isEditing ? (
            editUi
          ) : (
            <p className='mt-0.5 whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
              {localContent ?? message.content}
            </p>
          )}
          <AttachmentList attachments={message.attachments} />
          <ReactionList reactions={message.reactions ?? []} messageId={message.id} />
        </div>
      </div>
    </div>
  );
}
