/**
 * useChannelEvents — Issue #180
 *
 * Subscribes to real-time SSE events for a channel.
 * Uses the native EventSource API (no library needed).
 * EventSource reconnects automatically on failure.
 *
 * Usage:
 *   const { isConnected } = useChannelEvents({
 *     channelId,
 *     onMessageCreated: (msg) => setMessages(prev => [...prev, msg]),
 *     onMessageEdited: (msg) => setMessages(prev => prev.map(m => m.id === msg.id ? msg : m)),
 *     onMessageDeleted: (id) => setMessages(prev => prev.filter(m => m.id !== id)),
 *   });
 */

'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Message } from '@/types/message';
import type { Server } from '@/types/server';
import { getAccessToken, refreshAccessToken, fetchSseTicket } from '@/lib/api-client';
import { createFrontendLogger } from '@/lib/frontend-logger';
import { getApiBaseUrl } from '@/lib/runtime-config';

const logger = createFrontendLogger({ component: 'use-channel-events' });

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 2_000;

export interface UseChannelEventsOptions {
  channelId: string;
  onMessageCreated: (msg: Message) => void;
  onMessageEdited: (msg: Message) => void;
  onMessageDeleted: (messageId: string) => void;
  /** Called when a server:updated SSE event is received for the current server. Optional. */
  onServerUpdated?: (server: Server) => void;
  /** Set to false to disable the connection (e.g. for unauthenticated guests). Defaults to true. */
  enabled?: boolean;
}

export interface UseChannelEventsResult {
  isConnected: boolean;
}

export function useChannelEvents({
  channelId,
  onMessageCreated,
  onMessageEdited,
  onMessageDeleted,
  onServerUpdated,
  enabled = true,
}: UseChannelEventsOptions): UseChannelEventsResult {
  const [isConnected, setIsConnected] = useState(false);
  // Incrementing this triggers the effect to re-run with a fresh token after a
  // dropped connection (e.g. token expiry). Capped at MAX_RECONNECT_ATTEMPTS.
  const [reconnectKey, setReconnectKey] = useState(0);
  // Tracks how many consecutive reconnect attempts have been made so we can
  // apply a growing delay and bail out after repeated failures.
  const reconnectCountRef = useRef(0);

  // Keep stable references to callbacks so the effect doesn't re-run on every render.
  // Updated via useLayoutEffect (before paint) so the EventSource handlers always call
  // the latest version without the effect needing them as dependencies.
  const onCreatedRef = useRef(onMessageCreated);
  const onEditedRef = useRef(onMessageEdited);
  const onDeletedRef = useRef(onMessageDeleted);
  const onServerUpdatedRef = useRef(onServerUpdated);

  useLayoutEffect(() => {
    onCreatedRef.current = onMessageCreated;
    onEditedRef.current = onMessageEdited;
    onDeletedRef.current = onMessageDeleted;
    onServerUpdatedRef.current = onServerUpdated;
  });

  useEffect(() => {
    if (!enabled || !channelId) return;

    const apiUrl = getApiBaseUrl();
    const token = getAccessToken();
    if (!token) return; // unauthenticated — don't attempt connection

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
        logger.warn('Failed to fetch SSE ticket; aborting channel connection', {
          feature: 'channel-events',
          event: 'ticket_fetch_failed',
          source: 'sse',
          target: '/api/events/ticket',
          error: err,
        });
        return;
      }
      if (cancelled) return;

      const url = `${apiUrl}/api/events/channel/${channelId}?ticket=${encodeURIComponent(ticket)}`;
      es = new EventSource(url);

      // ── Event handlers ────────────────────────────────────────────────────

      const handleCreated = (event: MessageEvent<string>) => {
        try {
          const msg = JSON.parse(event.data) as Message;
          onCreatedRef.current(msg);
        } catch (error) {
          logger.warn('Dropped malformed channel SSE payload', {
            feature: 'channel-events',
            event: 'payload_parse_failed',
            source: 'sse',
            operation: 'message:created',
            target: '/api/events/channel/[channelId]',
            error,
          });
        }
      };

      const handleEdited = (event: MessageEvent<string>) => {
        try {
          const msg = JSON.parse(event.data) as Message;
          onEditedRef.current(msg);
        } catch (error) {
          logger.warn('Dropped malformed channel SSE payload', {
            feature: 'channel-events',
            event: 'payload_parse_failed',
            source: 'sse',
            operation: 'message:edited',
            target: '/api/events/channel/[channelId]',
            error,
          });
        }
      };

      const handleDeleted = (event: MessageEvent<string>) => {
        try {
          const payload = JSON.parse(event.data) as { messageId: string };
          onDeletedRef.current(payload.messageId);
        } catch (error) {
          logger.warn('Dropped malformed channel SSE payload', {
            feature: 'channel-events',
            event: 'payload_parse_failed',
            source: 'sse',
            operation: 'message:deleted',
            target: '/api/events/channel/[channelId]',
            error,
          });
        }
      };

      const handleServerUpdated = (event: MessageEvent<string>) => {
        try {
          const server = JSON.parse(event.data) as Server;
          onServerUpdatedRef.current?.(server);
        } catch (error) {
          logger.warn('Dropped malformed channel SSE payload', {
            feature: 'channel-events',
            event: 'payload_parse_failed',
            source: 'sse',
            operation: 'server:updated',
            target: '/api/events/channel/[channelId]',
            error,
          });
        }
      };

      es.addEventListener('message:created', handleCreated);
      es.addEventListener('message:edited', handleEdited);
      es.addEventListener('message:deleted', handleDeleted);
      es.addEventListener('server:updated', handleServerUpdated);
      activeHandlers.push(
        ['message:created', handleCreated],
        ['message:edited', handleEdited],
        ['message:deleted', handleDeleted],
        ['server:updated', handleServerUpdated],
      );

      // Track whether the connection ever opened successfully.
      // If onerror fires before onopen it's a permanent failure (4xx/5xx from the
      // server or a network error before the stream started) — close immediately
      // instead of letting EventSource retry with a stale ticket.
      let everOpened = false;

      es.onopen = () => {
        everOpened = true;
        reconnectCountRef.current = 0; // reset budget on successful connection
        setIsConnected(true);
      };
      es.onerror = () => {
        setIsConnected(false);
        logger.warn('Channel SSE connection failed', {
          feature: 'channel-events',
          event: everOpened ? 'stream_disconnected' : 'stream_failed',
          source: 'sse',
          target: '/api/events/channel/[channelId]',
        });
        if (!everOpened && reconnectCountRef.current === 0) {
          // Never successfully opened on the first attempt — likely a 401/403. Stop retrying.
          es?.close();
          return;
        }

        // The connection was previously healthy but dropped. Stop the native retry
        // loop (which would reuse a consumed ticket) and proactively refresh the
        // access token before reconnecting with a fresh ticket.
        es?.close();
        const attempt = reconnectCountRef.current;
        if (attempt >= MAX_RECONNECT_ATTEMPTS) return; // give up after cap

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
      setIsConnected(false);
    };
  }, [channelId, enabled, reconnectKey]);

  return { isConnected };
}
