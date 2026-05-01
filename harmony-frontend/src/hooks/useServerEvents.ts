/**
 * useServerEvents — Issue #185 / #186 / #187 / #189 / #231
 *
 * Subscribes to real-time SSE events for a server.
 * Handles channel list updates (created/updated/deleted), member list
 * updates (joined/left), member status changes, visibility changes, and
 * message events (created/edited/deleted) over the single
 * /api/events/server/:serverId endpoint.
 *
 * Message events are scoped to the whole server; callers that only want
 * messages for the current channel should filter by channelId in their
 * callback.
 *
 * Uses the native EventSource API (no library needed).
 *
 * Usage:
 *   useServerEvents({
 *     serverId,
 *     onChannelCreated: (ch) => setChannels(prev => [...prev, ch]),
 *     onChannelUpdated: (ch) => setChannels(prev => prev.map(c => c.id === ch.id ? ch : c)),
 *     onChannelDeleted: (id) => setChannels(prev => prev.filter(c => c.id !== id)),
 *     onMemberJoined: (user) => setMembers(prev => [...prev, user]),
 *     onMemberLeft: (userId) => setMembers(prev => prev.filter(m => m.id !== userId)),
 *     onMemberStatusChanged: ({ id, status }) => setMembers(prev =>
 *       prev.map(m => m.id === id ? { ...m, status } : m)
 *     ),
 *     onMemberProfileUpdated: ({ id, username, displayName, avatarUrl }) => {
 *       setMembers(prev => prev.map(m => m.id === id ? { ...m, username, displayName, avatarUrl } : m));
 *       setMessages(prev => prev.map(msg =>
 *         msg.author.id === id ? { ...msg, author: { ...msg.author, username, displayName, avatarUrl } } : msg
 *       ));
 *     },
 *     onChannelVisibilityChanged: (ch, oldVis) => { ... },
 *     onMessageCreated: (msg) => { if (msg.channelId === activeChannelId) append(msg); },
 *     onMessageEdited: (msg) => { if (msg.channelId === activeChannelId) update(msg); },
 *     onMessageDeleted: (messageId, channelId) => { if (channelId === activeChannelId) remove(messageId); },
 *     onServerUpdated: (server) => updateServer(server),
 *   });
 */

'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Channel, ChannelVisibility } from '@/types/channel';
import type { Message } from '@/types/message';
import type { User, UserStatus } from '@/types/user';
import type { Server } from '@/types/server';
import { getAccessToken, refreshAccessToken, fetchSseTicket } from '@/lib/api-client';
import { createFrontendLogger } from '@/lib/frontend-logger';
import { getApiBaseUrl } from '@/lib/runtime-config';

const logger = createFrontendLogger({ component: 'use-server-events' });

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 2_000;

export interface UseServerEventsOptions {
  serverId: string;
  onChannelCreated: (channel: Channel) => void;
  onChannelUpdated: (channel: Channel) => void;
  onChannelDeleted: (channelId: string) => void;
  /** Called when a member joins the server. Optional. */
  onMemberJoined?: (user: User) => void;
  /** Called with the userId when a member leaves or is kicked. Optional. */
  onMemberLeft?: (userId: string) => void;
  /** Called when a member's presence status changes (online/idle/offline). Optional. */
  onMemberStatusChanged?: (data: { id: string; status: UserStatus }) => void;
  /** Called when a member's display name, avatar, or username changes. Optional. */
  onMemberProfileUpdated?: (data: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  }) => void;
  /**
   * Called when a channel's visibility changes. The updated channel object is
   * provided along with the previous visibility so callers can detect access
   * revocation (e.g. a PUBLIC channel became PRIVATE). Optional.
   */
  onChannelVisibilityChanged?: (channel: Channel, oldVisibility: ChannelVisibility) => void;
  /** Called when a new message is created in any channel of the server. Filter by msg.channelId as needed. Optional. */
  onMessageCreated?: (msg: Message) => void;
  /** Called when a message is edited in any channel of the server. Filter by msg.channelId as needed. Optional. */
  onMessageEdited?: (msg: Message) => void;
  /** Called when a message is deleted in any channel of the server. Provides messageId and channelId. Optional. */
  onMessageDeleted?: (messageId: string, channelId: string) => void;
  /** Called when server metadata (name, icon, description) changes. Optional. */
  onServerUpdated?: (server: Server) => void;
  /** Called when a reaction is added to a message in any channel of the server. Optional. */
  onReactionAdded?: (data: { messageId: string; channelId: string; userId: string; emoji: string }) => void;
  /** Called when a reaction is removed from a message in any channel of the server. Optional. */
  onReactionRemoved?: (data: { messageId: string; channelId: string; userId: string; emoji: string }) => void;
  /** Set to false to disable the connection (e.g. for unauthenticated guests). Defaults to true. */
  enabled?: boolean;
}

export function useServerEvents({
  serverId,
  onChannelCreated,
  onChannelUpdated,
  onChannelDeleted,
  onMemberJoined,
  onMemberLeft,
  onMemberStatusChanged,
  onMemberProfileUpdated,
  onChannelVisibilityChanged,
  onMessageCreated,
  onMessageEdited,
  onMessageDeleted,
  onServerUpdated,
  onReactionAdded,
  onReactionRemoved,
  enabled = true,
}: UseServerEventsOptions): void {
  // Incrementing this triggers the effect to re-run with a fresh token after a
  // dropped connection (e.g. token expiry). Capped at MAX_RECONNECT_ATTEMPTS.
  const [reconnectKey, setReconnectKey] = useState(0);
  // Tracks how many consecutive reconnect attempts have been made.
  const reconnectCountRef = useRef(0);
  // Tracks the last SSE event id (ISO timestamp) for Last-Event-ID replay on reconnect.
  const lastEventIdRef = useRef<string | null>(null);

  // Keep stable references to callbacks so the effect doesn't re-run on every render.
  const onCreatedRef = useRef(onChannelCreated);
  const onUpdatedRef = useRef(onChannelUpdated);
  const onDeletedRef = useRef(onChannelDeleted);
  const onMemberJoinedRef = useRef(onMemberJoined);
  const onMemberLeftRef = useRef(onMemberLeft);
  const onMemberStatusChangedRef = useRef(onMemberStatusChanged);
  const onMemberProfileUpdatedRef = useRef(onMemberProfileUpdated);
  const onVisibilityChangedRef = useRef(onChannelVisibilityChanged);
  const onMessageCreatedRef = useRef(onMessageCreated);
  const onMessageEditedRef = useRef(onMessageEdited);
  const onMessageDeletedRef = useRef(onMessageDeleted);
  const onServerUpdatedRef = useRef(onServerUpdated);
  const onReactionAddedRef = useRef(onReactionAdded);
  const onReactionRemovedRef = useRef(onReactionRemoved);

  useLayoutEffect(() => {
    onCreatedRef.current = onChannelCreated;
    onUpdatedRef.current = onChannelUpdated;
    onDeletedRef.current = onChannelDeleted;
    onMemberJoinedRef.current = onMemberJoined;
    onMemberLeftRef.current = onMemberLeft;
    onMemberStatusChangedRef.current = onMemberStatusChanged;
    onMemberProfileUpdatedRef.current = onMemberProfileUpdated;
    onVisibilityChangedRef.current = onChannelVisibilityChanged;
    onMessageCreatedRef.current = onMessageCreated;
    onMessageEditedRef.current = onMessageEdited;
    onMessageDeletedRef.current = onMessageDeleted;
    onServerUpdatedRef.current = onServerUpdated;
    onReactionAddedRef.current = onReactionAdded;
    onReactionRemovedRef.current = onReactionRemoved;
  });

  useEffect(() => {
    if (!enabled || !serverId) return;

    const apiUrl = getApiBaseUrl();
    const token = getAccessToken();
    if (!token) return;

    let es: EventSource | null = null;
    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    // Tracks registered handlers so cleanup can call removeEventListener.
    const activeHandlers: Array<[string, (event: MessageEvent<string>) => void]> = [];

    const connect = async () => {
      let ticket: string;
      try {
        ticket = await fetchSseTicket(apiUrl, token);
      } catch (err) {
        logger.warn('Failed to fetch SSE ticket; aborting server connection', {
          feature: 'server-events',
          event: 'ticket_fetch_failed',
          source: 'sse',
          target: '/api/events/ticket',
          error: err,
        });
        return;
      }
      if (cancelled) return;

      let url = `${apiUrl}/api/events/server/${serverId}?ticket=${encodeURIComponent(ticket)}`;
      // On reconnect, pass the last seen event id so the server can replay missed messages.
      if (reconnectKey > 0 && lastEventIdRef.current) {
        url += `&lastEventId=${encodeURIComponent(lastEventIdRef.current)}`;
      }
      es = new EventSource(url);

    const handleCreated = (event: MessageEvent<string>) => {
      try {
        const channel = JSON.parse(event.data) as Channel;
        onCreatedRef.current(channel);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'channel:created',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleUpdated = (event: MessageEvent<string>) => {
      try {
        const channel = JSON.parse(event.data) as Channel;
        onUpdatedRef.current(channel);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'channel:updated',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleDeleted = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { channelId: string };
        onDeletedRef.current(payload.channelId);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'channel:deleted',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleMemberJoined = (event: MessageEvent<string>) => {
      try {
        const user = JSON.parse(event.data) as User;
        onMemberJoinedRef.current?.(user);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'member:joined',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleMemberLeft = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { userId: string };
        onMemberLeftRef.current?.(payload.userId);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'member:left',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleMemberStatusChanged = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { id: string; status: UserStatus };
        onMemberStatusChangedRef.current?.(payload);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'member:statusChanged',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleMemberProfileUpdated = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as {
          id: string;
          username: string;
          displayName?: string;
          avatarUrl?: string;
        };
        onMemberProfileUpdatedRef.current?.(payload);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'member:profileUpdated',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleVisibilityChanged = (event: MessageEvent<string>) => {
      try {
        // The backend sends the full updated channel object plus oldVisibility.
        const payload = JSON.parse(event.data) as Channel & { oldVisibility: ChannelVisibility };
        const { oldVisibility, ...channel } = payload;
        onVisibilityChangedRef.current?.(channel, oldVisibility);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'channel:visibility-changed',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleMessageCreated = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        // Track the last event id for Last-Event-ID replay on reconnect.
        if (event.lastEventId) lastEventIdRef.current = event.lastEventId;
        onMessageCreatedRef.current?.(msg);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'message:created',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleMessageEdited = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        onMessageEditedRef.current?.(msg);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'message:edited',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleMessageDeleted = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { messageId: string; channelId: string };
        onMessageDeletedRef.current?.(payload.messageId, payload.channelId);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'message:deleted',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleServerUpdated = (event: MessageEvent<string>) => {
      try {
        const server = JSON.parse(event.data) as Server;
        onServerUpdatedRef.current?.(server);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'server:updated',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleReactionAdded = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as {
          messageId: string;
          channelId: string;
          userId: string;
          emoji: string;
        };
        onReactionAddedRef.current?.(payload);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'reaction:added',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

    const handleReactionRemoved = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as {
          messageId: string;
          channelId: string;
          userId: string;
          emoji: string;
        };
        onReactionRemovedRef.current?.(payload);
      } catch (error) {
        logger.warn('Dropped malformed server SSE payload', {
          feature: 'server-events',
          event: 'payload_parse_failed',
          source: 'sse',
          operation: 'reaction:removed',
          target: '/api/events/server/[serverId]',
          error,
        });
      }
    };

      es.addEventListener('channel:created', handleCreated);
      es.addEventListener('channel:updated', handleUpdated);
      es.addEventListener('channel:deleted', handleDeleted);
      es.addEventListener('member:joined', handleMemberJoined);
      es.addEventListener('member:left', handleMemberLeft);
      es.addEventListener('member:statusChanged', handleMemberStatusChanged);
      es.addEventListener('member:profileUpdated', handleMemberProfileUpdated);
      es.addEventListener('channel:visibility-changed', handleVisibilityChanged);
      es.addEventListener('message:created', handleMessageCreated);
      es.addEventListener('message:edited', handleMessageEdited);
      es.addEventListener('message:deleted', handleMessageDeleted);
      es.addEventListener('server:updated', handleServerUpdated);
      es.addEventListener('reaction:added', handleReactionAdded);
      es.addEventListener('reaction:removed', handleReactionRemoved);
      activeHandlers.push(
        ['channel:created', handleCreated],
        ['channel:updated', handleUpdated],
        ['channel:deleted', handleDeleted],
        ['member:joined', handleMemberJoined],
        ['member:left', handleMemberLeft],
        ['member:statusChanged', handleMemberStatusChanged],
        ['member:profileUpdated', handleMemberProfileUpdated],
        ['channel:visibility-changed', handleVisibilityChanged],
        ['message:created', handleMessageCreated],
        ['message:edited', handleMessageEdited],
        ['message:deleted', handleMessageDeleted],
        ['server:updated', handleServerUpdated],
        ['reaction:added', handleReactionAdded],
        ['reaction:removed', handleReactionRemoved],
      );

      let everOpened = false;

      es.onopen = () => {
        everOpened = true;
        reconnectCountRef.current = 0; // reset budget on successful connection
      };
      es.onerror = () => {
        logger.warn('Server SSE connection failed', {
          feature: 'server-events',
          event: everOpened ? 'stream_disconnected' : 'stream_failed',
          source: 'sse',
          target: '/api/events/server/[serverId]',
        });
        if (!everOpened && reconnectCountRef.current === 0) {
          // Never successfully opened on the first attempt — likely 401/403. Stop retrying.
          es?.close();
          return;
        }

        // Connection dropped after being healthy. Stop native retry (stale ticket)
        // and schedule a reconnect with a proactive token refresh.
        es?.close();
        const attempt = reconnectCountRef.current;
        if (attempt >= MAX_RECONNECT_ATTEMPTS) return;

        reconnectCountRef.current += 1;
        const delay = RECONNECT_DELAY_MS * reconnectCountRef.current;
        reconnectTimer = setTimeout(() => {
          refreshAccessToken().finally(() => {
            setReconnectKey(k => k + 1);
          });
        }, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      if (es) {
        activeHandlers.forEach(([type, handler]) => es!.removeEventListener(type, handler));
        es.close();
      }
    };
  }, [serverId, enabled, reconnectKey]);
}
