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
import { getAccessToken } from '@/lib/api-client';

export interface UseChannelEventsOptions {
  channelId: string;
  onMessageCreated: (msg: Message) => void;
  onMessageEdited: (msg: Message) => void;
  onMessageDeleted: (messageId: string) => void;
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
  enabled = true,
}: UseChannelEventsOptions): UseChannelEventsResult {
  const [isConnected, setIsConnected] = useState(false);

  // Keep stable references to callbacks so the effect doesn't re-run on every render.
  // Updated via useLayoutEffect (before paint) so the EventSource handlers always call
  // the latest version without the effect needing them as dependencies.
  const onCreatedRef = useRef(onMessageCreated);
  const onEditedRef = useRef(onMessageEdited);
  const onDeletedRef = useRef(onMessageDeleted);

  useLayoutEffect(() => {
    onCreatedRef.current = onMessageCreated;
    onEditedRef.current = onMessageEdited;
    onDeletedRef.current = onMessageDeleted;
  });

  useEffect(() => {
    if (!enabled || !channelId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    const token = getAccessToken();
    if (!token) return; // unauthenticated — don't attempt connection
    const url = `${apiUrl}/api/events/channel/${channelId}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    // ── Event handlers ──────────────────────────────────────────────────────

    const handleCreated = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        onCreatedRef.current(msg);
      } catch {
        // Ignore malformed payloads — server bug or network corruption
      }
    };

    const handleEdited = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        onEditedRef.current(msg);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleDeleted = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { messageId: string };
        onDeletedRef.current(payload.messageId);
      } catch {
        // Ignore malformed payloads
      }
    };

    es.addEventListener('message:created', handleCreated);
    es.addEventListener('message:edited', handleEdited);
    es.addEventListener('message:deleted', handleDeleted);

    // Track whether the connection ever opened successfully.
    // If onerror fires before onopen it's a permanent failure (4xx/5xx from the
    // server or a network error before the stream started) — close immediately
    // instead of letting EventSource retry with a stale/invalid token.
    let everOpened = false;

    es.onopen = () => {
      everOpened = true;
      setIsConnected(true);
    };
    es.onerror = () => {
      setIsConnected(false);
      if (!everOpened) {
        // Never successfully opened — likely a 401/403. Stop retrying.
        es.close();
      }
    };

    return () => {
      es.removeEventListener('message:created', handleCreated);
      es.removeEventListener('message:edited', handleEdited);
      es.removeEventListener('message:deleted', handleDeleted);
      es.close();
      setIsConnected(false);
    };
  }, [channelId, enabled]);

  return { isConnected };
}
