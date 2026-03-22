/**
 * useServerEvents — Issue #185 / #186 / #187 / #231
 *
 * Subscribes to real-time SSE events for a server.
 * Handles channel list updates (created/updated/deleted), member list
 * updates (joined/left), member status changes, and visibility changes
 * over the single /api/events/server/:serverId endpoint.
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
 *     onChannelVisibilityChanged: (ch, oldVis) => { ... },
 *   });
 */

'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Channel, ChannelVisibility } from '@/types/channel';
import type { User, UserStatus } from '@/types/user';
import { getAccessToken } from '@/lib/api-client';

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
  /**
   * Called when a channel's visibility changes. The updated channel object is
   * provided along with the previous visibility so callers can detect access
   * revocation (e.g. a PUBLIC channel became PRIVATE). Optional.
   */
  onChannelVisibilityChanged?: (channel: Channel, oldVisibility: ChannelVisibility) => void;
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
  onChannelVisibilityChanged,
  enabled = true,
}: UseServerEventsOptions): void {
  // Keep stable references to callbacks so the effect doesn't re-run on every render.
  const onCreatedRef = useRef(onChannelCreated);
  const onUpdatedRef = useRef(onChannelUpdated);
  const onDeletedRef = useRef(onChannelDeleted);
  const onMemberJoinedRef = useRef(onMemberJoined);
  const onMemberLeftRef = useRef(onMemberLeft);
  const onMemberStatusChangedRef = useRef(onMemberStatusChanged);
  const onVisibilityChangedRef = useRef(onChannelVisibilityChanged);

  useLayoutEffect(() => {
    onCreatedRef.current = onChannelCreated;
    onUpdatedRef.current = onChannelUpdated;
    onDeletedRef.current = onChannelDeleted;
    onMemberJoinedRef.current = onMemberJoined;
    onMemberLeftRef.current = onMemberLeft;
    onMemberStatusChangedRef.current = onMemberStatusChanged;
    onVisibilityChangedRef.current = onChannelVisibilityChanged;
  });

  useEffect(() => {
    if (!enabled || !serverId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    const token = getAccessToken();
    if (!token) return;

    const url = `${apiUrl}/api/events/server/${serverId}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    const handleCreated = (event: MessageEvent<string>) => {
      try {
        const channel = JSON.parse(event.data) as Channel;
        onCreatedRef.current(channel);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleUpdated = (event: MessageEvent<string>) => {
      try {
        const channel = JSON.parse(event.data) as Channel;
        onUpdatedRef.current(channel);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleDeleted = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { channelId: string };
        onDeletedRef.current(payload.channelId);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleMemberJoined = (event: MessageEvent<string>) => {
      try {
        const user = JSON.parse(event.data) as User;
        onMemberJoinedRef.current?.(user);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleMemberLeft = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { userId: string };
        onMemberLeftRef.current?.(payload.userId);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleMemberStatusChanged = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { id: string; status: UserStatus };
        onMemberStatusChangedRef.current?.(payload);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleVisibilityChanged = (event: MessageEvent<string>) => {
      try {
        // The backend sends the full updated channel object plus oldVisibility.
        const payload = JSON.parse(event.data) as Channel & { oldVisibility: ChannelVisibility };
        const { oldVisibility, ...channel } = payload;
        onVisibilityChangedRef.current?.(channel, oldVisibility);
      } catch {
        // Ignore malformed payloads
      }
    };

    es.addEventListener('channel:created', handleCreated);
    es.addEventListener('channel:updated', handleUpdated);
    es.addEventListener('channel:deleted', handleDeleted);
    es.addEventListener('member:joined', handleMemberJoined);
    es.addEventListener('member:left', handleMemberLeft);
    es.addEventListener('member:statusChanged', handleMemberStatusChanged);
    es.addEventListener('channel:visibility-changed', handleVisibilityChanged);

    let everOpened = false;

    es.onopen = () => {
      everOpened = true;
    };
    es.onerror = () => {
      if (!everOpened) {
        // Never successfully opened — likely 401/403. Stop retrying.
        es.close();
      }
    };

    return () => {
      es.removeEventListener('channel:created', handleCreated);
      es.removeEventListener('channel:updated', handleUpdated);
      es.removeEventListener('channel:deleted', handleDeleted);
      es.removeEventListener('member:joined', handleMemberJoined);
      es.removeEventListener('member:left', handleMemberLeft);
      es.removeEventListener('member:statusChanged', handleMemberStatusChanged);
      es.removeEventListener('channel:visibility-changed', handleVisibilityChanged);
      es.close();
    };
  }, [serverId, enabled]);
}
