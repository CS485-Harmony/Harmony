'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { getAccessToken, fetchSseTicket } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  messageId: string;
  channelId: string;
  serverId: string;
  read: boolean;
  createdAt: string;
  message: {
    id: string;
    content: string;
    isDeleted: boolean;
    author: { id: string; username: string; displayName: string; avatarUrl: string | null };
  };
}

interface NotificationBellProps {
  /** When provided, the component connects to the user SSE stream for real-time badges. */
  userId?: string;
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
      <path d='M13.73 21a2 2 0 0 1-3.46 0' />
    </svg>
  );
}

function formatRelativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.trpcQuery<Notification[]>('notification.getNotifications');
      setNotifications(data ?? []);
    } catch {
      // ignore — network errors shouldn't crash the bell
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!userId) return;
    loadNotifications();
  }, [userId, loadNotifications]);

  // Real-time updates via user SSE stream
  useEffect(() => {
    if (!userId) return;
    const token = getAccessToken();
    if (!token) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    let cancelled = false;

    (async () => {
      let ticket: string;
      try {
        ticket = await fetchSseTicket(apiBase, token);
      } catch {
        return; // abort silently — notification bell is non-critical
      }
      if (cancelled) return;

      const url = `${apiBase}/api/events/user?ticket=${encodeURIComponent(ticket)}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.addEventListener('notification:mention', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data) as {
            id: string;
            messageId: string;
            channelId: string;
            serverId: string;
            authorId: string;
            authorUsername: string;
            timestamp: string;
            read: boolean;
          };
          const optimistic: Notification = {
            id: payload.id,
            type: 'mention',
            messageId: payload.messageId,
            channelId: payload.channelId,
            serverId: payload.serverId,
            read: false,
            createdAt: payload.timestamp,
            message: {
              id: payload.messageId,
              content: '',
              isDeleted: false,
              author: {
                id: payload.authorId,
                username: payload.authorUsername,
                displayName: payload.authorUsername,
                avatarUrl: null,
              },
            },
          };
          setNotifications((prev) => [optimistic, ...prev].slice(0, 50));
        } catch {
          // malformed payload — ignore
        }
      });
    })();

    return () => {
      cancelled = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [userId]);

  // Close panel on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.trpcMutation('notification.markAsRead', { notificationId: id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch {
      // ignore — non-critical, badge will self-correct on next load
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.trpcMutation('notification.markAllAsRead');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore — non-critical, badge will self-correct on next load
    }
  };

  if (!userId) return null;

  return (
    <div ref={panelRef} className='relative'>
      <button
        type='button'
        title='Notifications'
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup='dialog'
        onClick={toggleOpen}
        className='relative flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200'
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span
            aria-hidden='true'
            className='absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold leading-none text-white'
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role='dialog'
          aria-label='Notifications panel'
          className='absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-white/10 bg-[#2f3136] shadow-2xl'
        >
          {/* Header */}
          <div className='flex items-center justify-between border-b border-white/10 px-4 py-2.5'>
            <span className='font-semibold text-white text-sm'>Notifications</span>
            {unreadCount > 0 && (
              <button
                type='button'
                onClick={markAllAsRead}
                className='text-xs text-indigo-400 hover:text-indigo-300 transition-colors'
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <ul className='max-h-80 overflow-y-auto'>
            {isLoading && (
              <li className='px-4 py-6 text-center text-sm text-gray-400'>Loading…</li>
            )}
            {!isLoading && notifications.length === 0 && (
              <li className='px-4 py-6 text-center text-sm text-gray-400'>
                No notifications yet.
              </li>
            )}
            {!isLoading &&
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5',
                    !n.read && 'bg-indigo-500/10',
                  )}
                >
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs text-gray-300'>
                      <span className='font-semibold text-white'>
                        @{n.message.author.username}
                      </span>{' '}
                      mentioned you
                    </p>
                    {n.message.content && !n.message.isDeleted && (
                      <p className='mt-0.5 truncate text-xs text-gray-400'>
                        {n.message.content}
                      </p>
                    )}
                    <p className='mt-0.5 text-[10px] text-gray-500'>
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      type='button'
                      onClick={() => markAsRead(n.id)}
                      title='Mark as read'
                      className='mt-0.5 flex-shrink-0 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors'
                    >
                      ✓
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
