/**
 * ThreadView — inline threaded reply view for a parent message.
 *
 * Shows paginated replies indented under the parent, with a reply composer
 * at the bottom. Replies are loaded lazily when the thread is first expanded.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { formatMessageTimestamp } from '@/lib/utils';
import { getThreadMessagesAction } from '@/app/actions/getThreadMessages';
import { createReplyAction } from '@/app/actions/createReply';
import { useToast } from '@/hooks/useToast';
import { appendUniqueReplies } from '@/lib/message-threading';
import type { Message } from '@/types';

// ─── ReplyItem ────────────────────────────────────────────────────────────────

function ReplyItem({ reply }: { reply: Message }) {
  const [avatarError, setAvatarError] = useState(false);
  const initial = reply.author.username?.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className='flex gap-3 py-1'>
      {reply.author.avatarUrl && !avatarError ? (
        <Image
          src={reply.author.avatarUrl}
          alt={reply.author.username}
          width={28}
          height={28}
          unoptimized
          className='mt-0.5 h-7 w-7 flex-shrink-0 rounded-full'
          onError={() => setAvatarError(true)}
        />
      ) : (
        <div className='mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#5865f2] text-xs font-bold text-white'>
          {initial}
        </div>
      )}
      <div className='min-w-0 flex-1'>
        <div className='flex items-baseline gap-2'>
          <span className='text-sm font-medium text-white'>
            {reply.author.displayName ?? reply.author.username}
          </span>
          <span className='text-[11px] text-gray-400'>
            {formatMessageTimestamp(reply.timestamp)}
          </span>
          {reply.editedAt && <span className='text-[10px] text-gray-500'>(edited)</span>}
        </div>
        <p className='mt-0.5 whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
          {reply.content}
        </p>
      </div>
    </div>
  );
}

// ─── ReplyComposer ────────────────────────────────────────────────────────────

interface ReplyComposerProps {
  parentMessageId: string;
  channelId: string;
  serverId: string;
  parentAuthorName: string;
  onReplySent: (reply: Message) => void;
  onCancel: () => void;
}

function ReplyComposer({
  parentMessageId,
  channelId,
  serverId,
  parentAuthorName,
  onReplySent,
  onCancel,
}: ReplyComposerProps) {
  const [value, setValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleSend = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    setError(null);
    const result = await createReplyAction(parentMessageId, channelId, serverId, trimmed);
    setIsSending(false);
    if (result.ok) {
      setValue('');
      onReplySent(result.message);
    } else {
      const msg = result.forbidden
        ? "You don't have permission to reply in this channel."
        : 'Failed to send reply. Please try again.';
      setError(msg);
      showToast({ message: msg, type: 'error' });
    }
  }, [value, isSending, parentMessageId, channelId, serverId, onReplySent, showToast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className='mt-2 rounded-md border border-white/10 bg-[#40444b] px-3 py-2'>
      <p className='mb-1 text-[11px] text-gray-400'>
        Replying to <span className='font-medium text-white'>{parentAuthorName}</span>
        <button
          type='button'
          onClick={onCancel}
          className='ml-2 text-gray-500 hover:text-gray-300 transition-colors'
          aria-label='Cancel reply'
        >
          ✕
        </button>
      </p>
      {error && (
        <p className='mb-1 text-xs text-red-400' role='alert'>
          {error}
        </p>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
        rows={1}
        placeholder='Write a reply… (Enter to send, Shift+Enter for newline, Esc to cancel)'
        aria-label='Reply content'
        className='w-full resize-none bg-transparent text-sm leading-relaxed text-[#dcddde] placeholder-gray-500 outline-none disabled:opacity-50'
        style={{ maxHeight: '160px', overflowY: 'auto' }}
      />
      <div className='mt-1 flex items-center justify-end gap-2 text-xs text-gray-400'>
        <button type='button' onClick={onCancel} className='hover:text-gray-200 transition-colors'>
          Cancel
        </button>
        <button
          type='button'
          onClick={handleSend}
          disabled={isSending || !value.trim()}
          className='rounded bg-[#5865f2] px-2 py-0.5 text-white hover:bg-[#4752c4] disabled:opacity-50 transition-colors'
        >
          {isSending ? 'Sending…' : 'Reply'}
        </button>
      </div>
    </div>
  );
}

// ─── ThreadView ───────────────────────────────────────────────────────────────

export interface ThreadViewProps {
  parentMessage: Message;
  channelId: string;
  serverId: string;
  /** Reply created outside this component, e.g. via channel composer or SSE. */
  incomingReply?: Message;
}

export function ThreadView({ parentMessage, channelId, serverId, incomingReply }: ThreadViewProps) {
  const [replies, setReplies] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const initializedRef = useRef(false);
  const incomingReplyId =
    incomingReply?.parentMessageId === parentMessage.id ? incomingReply.id : null;
  const [prevIncomingReplyId, setPrevIncomingReplyId] = useState<string | null>(null);
  if (incomingReplyId !== prevIncomingReplyId) {
    setPrevIncomingReplyId(incomingReplyId);
    if (incomingReplyId && incomingReply) {
      setReplies(prev => appendUniqueReplies(prev, [incomingReply]));
    }
  }

  const loadReplies = useCallback(
    async (cursor?: string) => {
      setIsLoading(true);
      setLoadError(null);
      const result = await getThreadMessagesAction(parentMessage.id, channelId, serverId, cursor);
      setIsLoading(false);
      if (result.ok) {
        setReplies(prev =>
          cursor
            ? appendUniqueReplies(prev, result.replies)
            : appendUniqueReplies(result.replies, prev),
        );
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } else {
        setLoadError(result.error);
      }
    },
    [parentMessage.id, channelId, serverId],
  );

  // Load on first render only
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    let isCurrent = true;
    void (async () => {
      setIsLoading(true);
      setLoadError(null);
      const result = await getThreadMessagesAction(parentMessage.id, channelId, serverId);
      if (!isCurrent) return;
      setIsLoading(false);
      if (result.ok) {
        setReplies(prev => appendUniqueReplies(result.replies, prev));
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      } else {
        setLoadError(result.error);
      }
    })();
    return () => {
      isCurrent = false;
    };
  }, [parentMessage.id, channelId, serverId]);

  const handleReplySent = useCallback((reply: Message) => {
    setReplies(prev => appendUniqueReplies(prev, [reply]));
    setIsComposerOpen(false);
  }, []);

  return (
    <div className='ml-14 mt-1 border-l-2 border-white/10 pl-3'>
      {isLoading && replies.length === 0 && (
        <p className='py-2 text-xs text-gray-500'>Loading replies…</p>
      )}
      {loadError && <p className='py-1 text-xs text-red-400'>{loadError}</p>}

      {replies.map(reply => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}

      {hasMore && (
        <button
          type='button'
          onClick={() => loadReplies(nextCursor ?? undefined)}
          disabled={isLoading}
          className='mt-1 text-xs text-[#5865f2] hover:underline disabled:opacity-50'
        >
          {isLoading ? 'Loading…' : 'Load more replies'}
        </button>
      )}

      {isComposerOpen ? (
        <ReplyComposer
          parentMessageId={parentMessage.id}
          channelId={channelId}
          serverId={serverId}
          parentAuthorName={parentMessage.author.displayName ?? parentMessage.author.username}
          onReplySent={handleReplySent}
          onCancel={() => setIsComposerOpen(false)}
        />
      ) : (
        <button
          type='button'
          onClick={() => setIsComposerOpen(true)}
          className='mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-[#5865f2] transition-colors'
          aria-label='Add a reply'
        >
          <svg className='h-3.5 w-3.5' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
            <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
          </svg>
          Reply
        </button>
      )}
    </div>
  );
}
