/**
 * useServerListSync — Issue #188
 *
 * Syncs server list state across all open browser tabs for the same user
 * using the BroadcastChannel API. When a user creates or joins a server,
 * other tabs receive the message and call router.refresh() to update the
 * server rail without a full page reload.
 *
 * The current tab posts messages but does NOT refresh itself — the caller
 * is responsible for updating local state immediately so the current tab
 * already has the new server.
 *
 * Usage:
 *   const { notifyServerCreated, notifyServerJoined } = useServerListSync();
 *   // After creating a server:
 *   notifyServerCreated(server.id); // broadcasts to other tabs
 */

'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const CHANNEL_NAME = 'harmony:server-list';

type ServerListMessage =
  | { type: 'server:created'; serverId: string }
  | { type: 'server:joined'; serverId: string };

export interface UseServerListSyncResult {
  notifyServerCreated: (serverId: string) => void;
  notifyServerJoined: (serverId: string) => void;
}

export function useServerListSync(): UseServerListSyncResult {
  const router = useRouter();
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const bc = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = bc;

    bc.onmessage = (event: MessageEvent<ServerListMessage>) => {
      const msg = event.data;
      if (msg.type === 'server:created' || msg.type === 'server:joined') {
        router.refresh();
      }
    };

    return () => {
      bc.close();
      channelRef.current = null;
    };
  }, [router]);

  const notifyServerCreated = (serverId: string): void => {
    channelRef.current?.postMessage({ type: 'server:created', serverId });
  };

  const notifyServerJoined = (serverId: string): void => {
    channelRef.current?.postMessage({ type: 'server:joined', serverId });
  };

  return { notifyServerCreated, notifyServerJoined };
}
