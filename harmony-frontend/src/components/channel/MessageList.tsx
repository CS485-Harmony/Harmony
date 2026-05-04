/**
 * Channel Component: MessageList
 * Scrollable, chronological message feed with author grouping, date separators,
 * a welcome header, and smart auto-scroll.
 * Based on dev spec C1.3 MessageListComponent
 */

'use client';

import { useRef, useLayoutEffect, useCallback, useEffect, useMemo } from 'react';
import { MessageItem } from '@/components/message/MessageItem';
import { formatDate } from '@/lib/utils';
import { ChannelVisibility } from '@/types';
import type { Channel, Message } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type MessageGroup = { messages: Message[]; dateLabel: string };

/**
 * Groups consecutive messages by author (within a 5-minute window) and
 * annotates each group with a date label for use by DateSeparator.
 * #c31: guards against NaN timestamps so grouping never silently breaks.
 */
function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prev = messages[i - 1];
    const sameAuthor = prev && prev.author.id === msg.author.id;
    const msgTime = new Date(msg.timestamp).getTime();
    const prevTime = prev ? new Date(prev.timestamp).getTime() : NaN;
    const withinTime =
      prev && !isNaN(msgTime) && !isNaN(prevTime) && msgTime - prevTime < 5 * 60 * 1000;
    // Do not group messages across midnight — date separators rely on group boundaries
    const sameDay =
      prev &&
      !isNaN(msgTime) &&
      !isNaN(prevTime) &&
      new Date(msgTime).toDateString() === new Date(prevTime).toDateString();

    const dateLabel = isNaN(msgTime) ? '' : formatDate(new Date(msgTime));

    if (sameAuthor && withinTime && sameDay) {
      groups[groups.length - 1].messages.push(msg);
    } else {
      groups.push({ messages: [msg], dateLabel });
    }
  }

  return groups;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateSeparator({ label }: { label: string }) {
  return (
    <div className='flex items-center gap-4 px-4 py-2'>
      <hr className='flex-1 border-[#40444b]' />
      <span className='text-xs font-medium text-gray-400'>{label}</span>
      <hr className='flex-1 border-[#40444b]' />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MessageListProps {
  channel: Channel;
  messages: Message[];
  /** Server ID passed to MessageItem for pin/unpin actions. */
  serverId?: string;
  /** When true, shows the pin/unpin option on message hover. Grant to MODERATOR+. */
  canPin?: boolean;
  /** When true, shows delete for messages the user doesn't own. Grant to MODERATOR+. */
  canDeleteAny?: boolean;
  /** Authenticated user's username — forwarded to MessageItem for self-mention highlight. */
  currentUsername?: string;
  /** Channels in the current server — forwarded for #channel pill resolution. */
  channels?: { slug: string; name: string }[];
  /** Current server slug — forwarded for #channel pill hrefs. */
  serverSlug?: string;
  /** Called when the user clicks Reply on a message. */
  onReplyClick?: (message: Message) => void;
  /** Called when the user clicks pin/unpin on a message. */
  onPinToggle?: (messageId: string, pinned: boolean) => void;
  /** Called after the user successfully deletes a message. */
  onDelete?: (messageId: string) => void;
  /** Whether there are older messages to load via pagination. */
  hasMoreOlder?: boolean;
  /** Whether older messages are currently being fetched. */
  isLoadingOlder?: boolean;
  /** Called when the user requests loading older messages. */
  onLoadOlderMessages?: () => void;
}

export function MessageList({
  channel,
  messages,
  serverId,
  canPin,
  canDeleteAny,
  currentUsername,
  channels,
  serverSlug,
  onReplyClick,
  onPinToggle,
  onDelete,
  hasMoreOlder,
  isLoadingOlder,
  onLoadOlderMessages,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // #c7: only auto-scroll when user is already near the bottom
  const isNearBottomRef = useRef(true);
  // Track whether the initial mount scroll has happened so we jump instantly
  // to the bottom on load rather than smoothly scrolling from the top.
  const hasMountedRef = useRef(false);
  // Saved scroll height before a prepend operation — restored in useLayoutEffect
  // to prevent the viewport from jumping when older messages are added at the top.
  const savedScrollHeightRef = useRef(0);

  const triggerLoadOlder = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) savedScrollHeightRef.current = el.scrollHeight;
    onLoadOlderMessages?.();
  }, [onLoadOlderMessages]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom <= 100;
    // Auto-load older messages when the user scrolls within 200px of the top
    if (el.scrollTop <= 200 && hasMoreOlder && !isLoadingOlder) {
      triggerLoadOlder();
    }
  }, [hasMoreOlder, isLoadingOlder, triggerLoadOlder]);

  // When any message content grows in height (images, videos, embeds loading),
  // re-anchor the scroll position to the bottom if the user was already there.
  // ResizeObserver is used instead of onLoad handlers so that ALL sources of
  // height change are covered (attachments, inline video embeds, avatars, etc.).
  useEffect(() => {
    const scrollEl = scrollContainerRef.current;
    const contentEl = contentRef.current;
    if (!scrollEl || !contentEl) return;
    const observer = new ResizeObserver(() => {
      if (isNearBottomRef.current) {
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    });
    observer.observe(contentEl);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    // Nothing to scroll to yet — don't mark as mounted so that the first
    // real messages get the instant-scroll path instead of smooth scroll.
    if (messages.length === 0) return;

    if (!hasMountedRef.current) {
      // Initial load: jump instantly so the user starts at the bottom
      hasMountedRef.current = true;
      const el = scrollContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    } else if (savedScrollHeightRef.current > 0) {
      // Older messages were prepended — restore scroll so the viewport doesn't jump
      const el = scrollContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight - savedScrollHeightRef.current;
      savedScrollHeightRef.current = 0;
    } else if (isNearBottomRef.current) {
      // New message while already near bottom: smooth scroll
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const groups = useMemo(() => groupMessages(messages), [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className='flex-1 overflow-y-auto py-4'
      onScroll={handleScroll}
      role='log'
      aria-label={`Messages in #${channel.name}`}
      aria-live='polite'
      aria-relevant='additions'
    >
      {/* Load older messages */}
      {(hasMoreOlder || isLoadingOlder) && (
        <div className='flex justify-center px-4 pb-2 pt-1'>
          {isLoadingOlder ? (
            <span className='text-xs text-gray-400'>Loading older messages…</span>
          ) : (
            <button
              onClick={triggerLoadOlder}
              className='rounded px-3 py-1 text-xs font-medium text-gray-300 hover:bg-[#40444b] hover:text-white'
            >
              Load older messages
            </button>
          )}
        </div>
      )}

      {/* Channel welcome header */}
      <div className='px-4 pb-4'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#40444b]'>
          <svg
            className='h-8 w-8 text-white'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.871 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41001 9L8.35001 15H14.35L15.41 9H9.41001Z' />
          </svg>
        </div>
        <h2 className='mt-2 text-3xl font-bold text-white'>Welcome to #{channel.name}!</h2>
        {channel.topic && <p className='mt-1 text-sm text-gray-400'>{channel.topic}</p>}
        <div className='mt-1 text-xs text-gray-500'>
          {channel.visibility === ChannelVisibility.PUBLIC_INDEXABLE &&
            '🌐 Public · Indexed by search engines'}
          {channel.visibility === ChannelVisibility.PUBLIC_NO_INDEX && '👁 Public · Not indexed'}
          {channel.visibility === ChannelVisibility.PRIVATE && '🔒 Private channel'}
        </div>
      </div>

      {/* Message groups with date separators */}
      <div ref={contentRef} className='space-y-4'>
        {groups.map((group, gi) => {
          const prevGroup = groups[gi - 1];
          const showDateSeparator =
            gi > 0 && prevGroup && group.dateLabel && prevGroup.dateLabel !== group.dateLabel;
          return (
            <div key={group.messages[0]?.id || gi}>
              {showDateSeparator && <DateSeparator label={group.dateLabel} />}
              {group.messages.map((msg, mi) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  showHeader={mi === 0}
                  serverId={serverId}
                  canPin={canPin}
                  canDeleteAny={canDeleteAny}
                  currentUsername={currentUsername}
                  channels={channels}
                  serverSlug={serverSlug}
                  onReplyClick={onReplyClick}
                  onPinToggle={onPinToggle}
                  onDelete={onDelete}
                />
              ))}
            </div>
          );
        })}
      </div>

      {messages.length === 0 && (
        <p className='px-4 text-sm text-gray-500'>No messages yet. Start the conversation!</p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
