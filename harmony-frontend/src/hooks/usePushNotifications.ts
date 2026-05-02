'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export type PushPermissionState = 'unsupported' | 'default' | 'granted' | 'denied';

export interface UsePushNotificationsReturn {
  permissionState: PushPermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  enable: () => Promise<void>;
  disable: () => Promise<void>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [permissionState, setPermissionState] = useState<PushPermissionState>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check current subscription state on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPermissionState('unsupported');
      return;
    }

    setPermissionState(Notification.permission as PushPermissionState);

    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    }).catch(() => {});
  }, []);

  const enable = useCallback(async () => {
    if (permissionState === 'unsupported') return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch VAPID public key from the backend
      const { vapidPublicKey } = await apiClient.trpcQuery<{ vapidPublicKey: string }>(
        'notification.getVapidPublicKey',
      );

      const permission = await Notification.requestPermission();
      setPermissionState(permission as PushPermissionState);
      if (permission !== 'granted') {
        setError('Notification permission denied');
        return;
      }

      // Register service worker if not already registered
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as any,
      });

      const json = sub.toJSON();
      await apiClient.trpcMutation('notification.subscribe', {
        endpoint: json.endpoint,
        p256dh: json.keys?.p256dh ?? '',
        auth: json.keys?.auth ?? '',
      });

      setIsSubscribed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable notifications');
    } finally {
      setIsLoading(false);
    }
  }, [permissionState]);

  const disable = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await apiClient.trpcMutation('notification.unsubscribe', { endpoint: sub.endpoint });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { permissionState, isSubscribed, isLoading, error, enable, disable };
}
