/**
 * publicApiService — server-side service for the backend public REST API.
 * Uses fetch (not the axios api-client) so it can be called from React Server
 * Components, generateMetadata, and other server-only contexts.
 * React `cache` is used for request deduplication within a single render pass.
 */

import { cache } from 'react';
import type { Server, Channel, Message } from '@/types';
import { ChannelType, ChannelVisibility } from '@/types';
import { API_CONFIG, CACHE_DURATION } from '@/lib/constants';

type PublicServer = Omit<Server, 'ownerId'>;

// ─── Response shapes from the backend ─────────────────────────────────────────

interface PublicServerResponse {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  description?: string;
  memberCount: number;
  createdAt: string;
}

interface PublicChannelResponse {
  id: string;
  name: string;
  slug: string;
  serverId: string;
  type: string;
  visibility: string;
  topic?: string | null;
  position: number;
  createdAt: string;
}

interface PublicMessageResponse {
  id: string;
  content: string;
  createdAt: string;
  editedAt?: string | null;
  author: { id: string; username: string };
}

interface PublicMessagesApiResponse {
  messages: PublicMessageResponse[];
  page: number;
  pageSize: number;
}

export interface PublicMetaTagResponse {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  generatedAt: string;
  visibility: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mapChannelType(type: string): ChannelType {
  switch (type) {
    case 'VOICE':
      return ChannelType.VOICE;
    case 'ANNOUNCEMENT':
      return ChannelType.ANNOUNCEMENT;
    default:
      return ChannelType.TEXT;
  }
}

function mapChannelVisibility(visibility: string): ChannelVisibility {
  switch (visibility) {
    case 'PUBLIC_NO_INDEX':
      return ChannelVisibility.PUBLIC_NO_INDEX;
    case 'PRIVATE':
      return ChannelVisibility.PRIVATE;
    default:
      return ChannelVisibility.PUBLIC_INDEXABLE;
  }
}

// ─── Public API functions ──────────────────────────────────────────────────────

/**
 * Fetch public server info by slug.
 * Returns null on any error or if the server is not found (404).
 * Deduplicated within a single render pass via React `cache`.
 */
export const fetchPublicServer = cache(async (serverSlug: string): Promise<PublicServer | null> => {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}`,
      { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
    );
    if (!res.ok) return null;

    const data: PublicServerResponse = await res.json();
    const server: PublicServer = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      icon: data.iconUrl,
      description: data.description,
      memberCount: data.memberCount,
      createdAt: data.createdAt,
    };
    return server;
  } catch {
    return null;
  }
});

/**
 * Fetch a single public channel by server slug + channel slug.
 * - Returns null if the server or channel does not exist (404).
 * - Returns `{ isPrivate: true }` if the channel is PRIVATE (403).
 * - Returns `{ channel, isPrivate: false }` on success (200).
 * Deduplicated within a single render pass via React `cache`.
 */
export const fetchPublicChannel = cache(
  async (
    serverSlug: string,
    channelSlug: string,
  ): Promise<{ channel: Channel; isPrivate: false } | { isPrivate: true } | null> => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}/channels/${encodeURIComponent(channelSlug)}`,
        {
          // Visibility changes must be reflected immediately in guest page access
          // control and metadata. Caching this fetch causes the public page to
          // keep serving stale indexable/private state after a toggle.
          cache: 'no-store',
        },
      );

      if (res.status === 404) return null;
      if (res.status === 403) return { isPrivate: true };
      if (!res.ok) return null;

      const data: PublicChannelResponse = await res.json();
      const channel: Channel = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        serverId: data.serverId,
        type: mapChannelType(data.type),
        visibility: mapChannelVisibility(data.visibility),
        topic: data.topic ?? undefined,
        position: data.position,
        createdAt: data.createdAt,
      };
      return { channel, isPrivate: false };
    } catch {
      return null;
    }
  },
);

/**
 * Fetch paginated public messages for a channel.
 * Returns an empty list on error.
 */
export async function fetchPublicMessages(
  channelId: string,
  page = 1,
): Promise<{ messages: Message[]; hasMore: boolean }> {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/public/channels/${encodeURIComponent(channelId)}/messages?page=${page}`,
    );
    if (!res.ok) return { messages: [], hasMore: false };

    const data: PublicMessagesApiResponse = await res.json();
    const messages: Message[] = data.messages.map(m => ({
      id: m.id,
      channelId,
      authorId: m.author.id,
      author: { id: m.author.id, username: m.author.username },
      content: m.content,
      timestamp: m.createdAt,
      editedAt: m.editedAt ?? undefined,
    }));
    return { messages, hasMore: messages.length >= data.pageSize };
  } catch {
    return { messages: [], hasMore: false };
  }
}

/**
 * Returns true if the channel is publicly accessible (not PRIVATE and not missing).
 */
export async function isChannelGuestAccessible(
  serverSlug: string,
  channelSlug: string,
): Promise<boolean> {
  const result = await fetchPublicChannel(serverSlug, channelSlug);
  return result !== null && !result.isPrivate;
}

export interface PublicChannelListItem {
  id: string;
  name: string;
  slug: string;
  /** Included for channel-type icon rendering in the sidebar. */
  type: ChannelType;
  topic?: string;
}

/**
 * Fetch all public (PUBLIC_INDEXABLE + PUBLIC_NO_INDEX) channels for a server.
 * Returns an empty array on error or if the server is not found.
 * Deduplicated within a single render pass via React `cache`.
 */
export const fetchPublicChannels = cache(
  async (serverSlug: string): Promise<PublicChannelListItem[]> => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}/channels`,
        { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
      );
      if (!res.ok) return [];
      const data: {
        channels: Array<{ id: string; name: string; slug: string; type: string; topic?: string | null }>;
      } = await res.json();
      return data.channels.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        type: mapChannelType(c.type),
        topic: c.topic ?? undefined,
      }));
    } catch {
      return [];
    }
  },
);

export const fetchPublicMetaTags = cache(
  async (serverSlug: string, channelSlug: string): Promise<PublicMetaTagResponse | null> => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}/channels/${encodeURIComponent(channelSlug)}/meta-tags`,
        {
          cache: 'no-store',
        },
      );

      if (!res.ok) return null;
      return (await res.json()) as PublicMetaTagResponse;
    } catch {
      return null;
    }
  },
);
