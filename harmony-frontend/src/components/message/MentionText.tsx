'use client';

import React from 'react';

export interface MentionTextProps {
  content: string;
  /** Current user's username — self-mentions get the accent highlight. */
  currentUsername?: string;
}

const BROADCAST_MENTIONS = new Set(['everyone', 'here']);

/**
 * Renders message content with @username tokens styled as inline mention pills.
 * - @everyone / @here share the same indigo styling as regular mentions, with tooltips.
 * - Self-mentions receive a stronger indigo background.
 * - Other @username mentions are styled subtly.
 * Pass `currentUsername` from a parent component that already holds auth state.
 */
export function MentionText({ content, currentUsername }: MentionTextProps) {
  if (!content.includes('@')) {
    return <>{content}</>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  // Create a fresh regex per call so lastIndex state never bleeds between renders.
  const re = /@([a-zA-Z0-9_-]{1,32})/g;
  while ((match = re.exec(content)) !== null) {
    const [full, username] = match;
    const start = match.index;

    if (start > lastIndex) {
      parts.push(content.slice(lastIndex, start));
    }

    const lowerName = username.toLowerCase();
    const isBroadcast = BROADCAST_MENTIONS.has(lowerName);
    const isSelf = !isBroadcast && currentUsername && lowerName === currentUsername.toLowerCase();

    const tooltip = isBroadcast
      ? lowerName === 'everyone'
        ? 'Notifies all members of this channel'
        : 'Notifies online members of this channel'
      : `@${username}`;

    parts.push(
      <span
        key={key++}
        className={
          isBroadcast
            ? 'rounded px-0.5 font-semibold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/40 cursor-default'
            : isSelf
              ? 'rounded px-0.5 font-semibold text-white bg-indigo-500/70 hover:bg-indigo-500 cursor-default'
              : 'rounded px-0.5 font-semibold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/40 cursor-default'
        }
        title={tooltip}
      >
        {full}
      </span>,
    );

    lastIndex = start + full.length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return <>{parts}</>;
}
