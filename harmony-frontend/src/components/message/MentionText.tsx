'use client';

import React from 'react';
import Link from 'next/link';

export interface MentionTextProps {
  content: string;
  /** Current user's username — self-mentions get the accent highlight. */
  currentUsername?: string;
  /** Channels in the current server — used to resolve #channel-name pills. */
  channels?: { slug: string; name: string }[];
  /** Current server slug — used to build href for #channel pills. */
  serverSlug?: string;
}

const BROADCAST_MENTIONS = new Set(['everyone', 'here']);

/**
 * Renders message content with @username and #channel-name tokens styled as pills.
 * - @everyone / @here get tooltips describing broadcast scope.
 * - Self-mentions get a stronger indigo background.
 * - #channel pills are clickable Links when the channel exists in the current server.
 */
export function MentionText({ content, currentUsername, channels, serverSlug }: MentionTextProps) {
  if (!content.includes('@') && !content.includes('#')) {
    return <>{content}</>;
  }

  const channelMap = new Map(channels?.map((c) => [c.slug.toLowerCase(), c]) ?? []);

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Single pass: match @username and #channel-name tokens only at start or after whitespace
  // to avoid false positives in URL fragments (e.g. https://example.com/#section) or foo#bar.
  // [\w-] covers letters, digits, underscores, and hyphens (for hyphenated usernames).
  const re = /(?<!\S)(?:@([\w-]{1,32})|#([\w-]{1,100}))/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(content)) !== null) {
    const start = match.index;
    if (start > lastIndex) {
      parts.push(content.slice(lastIndex, start));
    }

    if (match[1] !== undefined) {
      // @username pill
      const username = match[1];
      const lowerName = username.toLowerCase();
      const isBroadcast = BROADCAST_MENTIONS.has(lowerName);
      const isSelf = !isBroadcast && !!currentUsername && lowerName === currentUsername.toLowerCase();

      const tooltip = isBroadcast
        ? lowerName === 'everyone'
          ? 'Notifies all members of this channel'
          : 'Notifies online members of this channel'
        : `@${username}`;

      parts.push(
        <span
          key={key++}
          className={
            isSelf
              ? 'rounded px-0.5 font-semibold text-white bg-indigo-500/70 hover:bg-indigo-500 cursor-default'
              : 'rounded px-0.5 font-semibold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/40 cursor-default'
          }
          title={tooltip}
        >
          @{username}
        </span>,
      );
    } else {
      // #channel-name pill
      const rawSlug = match[2];
      const channel = channelMap.get(rawSlug.toLowerCase());
      const pillClass =
        'rounded px-0.5 font-semibold text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/40';

      if (channel && serverSlug) {
        parts.push(
          <Link
            key={key++}
            href={`/c/${serverSlug}/${channel.slug}`}
            className={`${pillClass} cursor-pointer`}
            title={`#${channel.name}`}
          >
            #{rawSlug}
          </Link>,
        );
      } else {
        parts.push(
          <span
            key={key++}
            className={`${pillClass} cursor-default`}
            title={`#${rawSlug}`}
          >
            #{rawSlug}
          </span>,
        );
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return <>{parts}</>;
}
