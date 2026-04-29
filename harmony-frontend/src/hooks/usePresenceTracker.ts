'use client';

import { useEffect, useRef } from 'react';
import { getAccessToken } from '@/lib/api-client';
import { createFrontendLogger } from '@/lib/frontend-logger';
import { getApiBaseUrl } from '@/lib/runtime-config';
import type { UserStatus } from '@/types/user';

type PresenceStatus = 'ONLINE' | 'IDLE';
type FrontendPresenceStatus = Extract<UserStatus, 'online' | 'idle'>;

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const PRESENCE_INTERVAL_MS = 30_000;
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'focus'];

const logger = createFrontendLogger({ component: 'presence-tracker' });

function postPresence(status: PresenceStatus): void {
  const token = getAccessToken();
  if (!token) return;

  fetch(`${getApiBaseUrl()}/api/presence/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  }).catch(error => {
    logger.warn('Presence update failed', {
      feature: 'presence',
      event: 'status_update_failed',
      method: 'POST',
      route: '/api/presence/status',
      error,
    });
  });
}

function toFrontendStatus(status: PresenceStatus): FrontendPresenceStatus {
  return status === 'ONLINE' ? 'online' : 'idle';
}

export function usePresenceTracker(
  enabled: boolean,
  onStatusChanged?: (status: FrontendPresenceStatus) => void,
): void {
  const statusRef = useRef<PresenceStatus>('ONLINE');
  const lastActivePostRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const clearIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
    const clearHeartbeatTimer = () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };

    const setPresence = (status: PresenceStatus, force = false) => {
      const now = Date.now();
      if (!force && statusRef.current === status) return;
      if (!force && status === 'ONLINE' && now - lastActivePostRef.current < PRESENCE_INTERVAL_MS) {
        return;
      }

      statusRef.current = status;
      onStatusChanged?.(toFrontendStatus(status));
      if (status === 'ONLINE') lastActivePostRef.current = now;
      postPresence(status);
    };

    const armIdleTimer = () => {
      clearIdleTimer();
      idleTimerRef.current = setTimeout(() => {
        setPresence('IDLE', true);
      }, IDLE_TIMEOUT_MS);
    };

    const markActive = () => {
      setPresence('ONLINE');
      armIdleTimer();
    };

    setPresence('ONLINE', true);
    armIdleTimer();
    heartbeatTimerRef.current = setInterval(() => {
      postPresence(statusRef.current);
    }, PRESENCE_INTERVAL_MS);
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, markActive, { passive: true });
    }

    return () => {
      clearIdleTimer();
      clearHeartbeatTimer();
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, markActive);
      }
    };
  }, [enabled, onStatusChanged]);
}
