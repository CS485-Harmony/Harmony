/**
 * useServerEvents.test.tsx — Issue #185 / #186 / #187 / #189 / #231
 *
 * Tests the useServerEvents hook that subscribes to real-time SSE events for
 * channel list updates, member list updates, member status changes, visibility
 * changes, message events, and server:updated events.
 *
 * EventSource is mocked to avoid actual network connections.
 */

import { renderHook, act } from '@testing-library/react';
import { useServerEvents } from '../hooks/useServerEvents';
import { ChannelType, ChannelVisibility } from '../types/channel';
import type { Channel } from '../types/channel';
import type { Message } from '../types/message';
import type { User } from '../types/user';

// ─── Mock api-client ──────────────────────────────────────────────────────────

jest.mock('../lib/api-client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

// ─── Mock EventSource ─────────────────────────────────────────────────────────

type EventSourceHandler = (event: MessageEvent) => void;

interface MockEventSourceInstance {
  url: string;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  close: jest.Mock;
  onerror: ((event: Event) => void) | null;
  onopen: ((event: Event) => void) | null;
  simulateEvent: (type: string, data: unknown) => void;
  simulateOpen: () => void;
  simulateError: () => void;
}

let mockEventSourceInstance: MockEventSourceInstance | null = null;

const MockEventSource = jest.fn().mockImplementation((url: string) => {
  const handlers = new Map<string, EventSourceHandler[]>();

  const instance: MockEventSourceInstance = {
    url,
    addEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      if (!handlers.has(type)) handlers.set(type, []);
      handlers.get(type)!.push(handler);
    }),
    removeEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      const list = handlers.get(type) ?? [];
      handlers.set(
        type,
        list.filter(h => h !== handler),
      );
    }),
    close: jest.fn(),
    onerror: null,
    onopen: null,

    simulateEvent(type: string, data: unknown) {
      const event = new MessageEvent(type, { data: JSON.stringify(data) });
      (handlers.get(type) ?? []).forEach(h => h(event));
    },

    simulateOpen() {
      if (this.onopen) this.onopen(new Event('open'));
    },

    simulateError() {
      if (this.onerror) this.onerror(new Event('error'));
    },
  };

  mockEventSourceInstance = instance;
  return instance;
});

(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CONNECTING = 0;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).OPEN = 1;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CLOSED = 2;

Object.defineProperty(global, 'EventSource', {
  writable: true,
  value: MockEventSource,
});

// ─── Fixture data ─────────────────────────────────────────────────────────────

const SERVER_ID = '550e8400-e29b-41d4-a716-446655440010';
const API_URL = 'http://localhost:4000';

const MOCK_CHANNEL: Channel = {
  id: 'ch-001',
  serverId: SERVER_ID,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const MOCK_USER: User = {
  id: 'user-new',
  username: 'newmember',
  displayName: 'New Member',
  status: 'online',
  role: 'member',
};

const MOCK_MESSAGE: Message = {
  id: 'msg-001',
  channelId: 'ch-001',
  authorId: 'user-001',
  author: { id: 'user-001', username: 'alice', displayName: 'Alice' },
  content: 'Hello world',
  timestamp: '2024-01-01T00:00:00.000Z',
  attachments: [],
};

// ─── Setup ────────────────────────────────────────────────────────────────────

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  mockEventSourceInstance = null;
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
  process.env = originalEnv;
});

// ─── Connection ───────────────────────────────────────────────────────────────

describe('useServerEvents — connection', () => {
  it('creates an EventSource with the correct server URL', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    expect(MockEventSource).toHaveBeenCalledWith(
      `${API_URL}/api/events/server/${SERVER_ID}?token=mock-token`,
    );
  });

  it('does NOT create EventSource when enabled=false', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        enabled: false,
      }),
    );

    expect(MockEventSource).not.toHaveBeenCalled();
  });

  it('closes the EventSource on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    unmount();

    expect(mockEventSourceInstance?.close).toHaveBeenCalled();
  });

  it('registers listeners for all eleven event types', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined: jest.fn(),
        onMemberLeft: jest.fn(),
        onMemberStatusChanged: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        onServerUpdated: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(addedTypes).toContain('channel:created');
    expect(addedTypes).toContain('channel:updated');
    expect(addedTypes).toContain('channel:deleted');
    expect(addedTypes).toContain('member:joined');
    expect(addedTypes).toContain('member:left');
    expect(addedTypes).toContain('member:statusChanged');
    expect(addedTypes).toContain('channel:visibility-changed');
    expect(addedTypes).toContain('message:created');
    expect(addedTypes).toContain('message:edited');
    expect(addedTypes).toContain('message:deleted');
    expect(addedTypes).toContain('server:updated');
  });
});

// ─── Channel event handling ───────────────────────────────────────────────────

describe('useServerEvents — channel events', () => {
  it('calls onChannelCreated with parsed channel on channel:created event', () => {
    const onChannelCreated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated,
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:created', MOCK_CHANNEL);
    });

    expect(onChannelCreated).toHaveBeenCalledTimes(1);
    expect(onChannelCreated).toHaveBeenCalledWith(MOCK_CHANNEL);
  });

  it('calls onChannelUpdated with parsed channel on channel:updated event', () => {
    const onChannelUpdated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated,
        onChannelDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:updated', {
        ...MOCK_CHANNEL,
        name: 'renamed',
      });
    });

    expect(onChannelUpdated).toHaveBeenCalledTimes(1);
    expect(onChannelUpdated).toHaveBeenCalledWith({ ...MOCK_CHANNEL, name: 'renamed' });
  });

  it('calls onChannelDeleted with channelId on channel:deleted event', () => {
    const onChannelDeleted = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:deleted', { channelId: 'ch-001' });
    });

    expect(onChannelDeleted).toHaveBeenCalledTimes(1);
    expect(onChannelDeleted).toHaveBeenCalledWith('ch-001');
  });
});

// ─── Member event handling ────────────────────────────────────────────────────

describe('useServerEvents — member events', () => {
  it('calls onMemberJoined with parsed User on member:joined event', () => {
    const onMemberJoined = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:joined', MOCK_USER);
    });

    expect(onMemberJoined).toHaveBeenCalledTimes(1);
    expect(onMemberJoined).toHaveBeenCalledWith(MOCK_USER);
  });

  it('calls onMemberLeft with userId on member:left event', () => {
    const onMemberLeft = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberLeft,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:left', { userId: 'user-new' });
    });

    expect(onMemberLeft).toHaveBeenCalledTimes(1);
    expect(onMemberLeft).toHaveBeenCalledWith('user-new');
  });

  it('does not throw when onMemberJoined is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberJoined intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:joined', MOCK_USER);
      });
    }).not.toThrow();
  });

  it('does not throw when onMemberLeft is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberLeft intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:left', { userId: 'user-new' });
      });
    }).not.toThrow();
  });

  it('removes member:joined and member:left listeners on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined: jest.fn(),
        onMemberLeft: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('member:joined');
    expect(removedTypes).toContain('member:left');
  });

  it('does not call onMemberJoined on malformed JSON', () => {
    const onMemberJoined = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('member:joined', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'member:joined')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onMemberJoined).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      '[frontend]',
      expect.objectContaining({
        message: 'Dropped malformed server SSE payload',
        fields: expect.objectContaining({
          feature: 'server-events',
          event: 'payload_parse_failed',
          operation: 'member:joined',
        }),
      }),
    );
  });
});

// ─── Member status change handling ───────────────────────────────────────────

describe('useServerEvents — member status change events', () => {
  it('calls onMemberStatusChanged with id and status on member:statusChanged event', () => {
    const onMemberStatusChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:statusChanged', {
        id: 'user-new',
        status: 'idle',
      });
    });

    expect(onMemberStatusChanged).toHaveBeenCalledTimes(1);
    expect(onMemberStatusChanged).toHaveBeenCalledWith({ id: 'user-new', status: 'idle' });
  });

  it('does not throw when onMemberStatusChanged is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberStatusChanged intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:statusChanged', {
          id: 'user-new',
          status: 'offline',
        });
      });
    }).not.toThrow();
  });

  it('removes member:statusChanged listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('member:statusChanged');
  });

  it('does not call onMemberStatusChanged on malformed JSON', () => {
    const onMemberStatusChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('member:statusChanged', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'member:statusChanged')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onMemberStatusChanged).not.toHaveBeenCalled();
  });
});

// ─── Visibility change event handling ────────────────────────────────────────

describe('useServerEvents — channel:visibility-changed events', () => {
  it('registers a listener for channel:visibility-changed', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(addedTypes).toContain('channel:visibility-changed');
  });

  it('calls onChannelVisibilityChanged with channel and oldVisibility on event', () => {
    const onChannelVisibilityChanged = jest.fn();
    const updatedChannel: Channel = { ...MOCK_CHANNEL, visibility: ChannelVisibility.PRIVATE };

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:visibility-changed', {
        ...updatedChannel,
        oldVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
      });
    });

    expect(onChannelVisibilityChanged).toHaveBeenCalledTimes(1);
    // First arg is the channel without oldVisibility; second arg is the old value.
    expect(onChannelVisibilityChanged).toHaveBeenCalledWith(
      updatedChannel,
      ChannelVisibility.PUBLIC_INDEXABLE,
    );
  });

  it('does not throw when onChannelVisibilityChanged is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onChannelVisibilityChanged intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('channel:visibility-changed', {
          ...MOCK_CHANNEL,
          visibility: ChannelVisibility.PRIVATE,
          oldVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
        });
      });
    }).not.toThrow();
  });

  it('removes channel:visibility-changed listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('channel:visibility-changed');
  });

  it('does not call onChannelVisibilityChanged on malformed JSON', () => {
    const onChannelVisibilityChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('channel:visibility-changed', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'channel:visibility-changed')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onChannelVisibilityChanged).not.toHaveBeenCalled();
  });

  it('logs when the EventSource connection fails before opening', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateError();
    });

    expect(console.warn).toHaveBeenCalledWith(
      '[frontend]',
      expect.objectContaining({
        message: 'Server SSE connection failed',
        fields: expect.objectContaining({
          feature: 'server-events',
          event: 'stream_failed',
        }),
      }),
    );
  });
});

// ─── Message event handling ───────────────────────────────────────────────────

describe('useServerEvents — message events', () => {
  it('calls onMessageCreated with parsed message on message:created event', () => {
    const onMessageCreated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMessageCreated,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:created', MOCK_MESSAGE);
    });

    expect(onMessageCreated).toHaveBeenCalledTimes(1);
    expect(onMessageCreated).toHaveBeenCalledWith(MOCK_MESSAGE);
  });

  it('calls onMessageEdited with parsed message on message:edited event', () => {
    const onMessageEdited = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMessageEdited,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:edited', {
        ...MOCK_MESSAGE,
        content: 'edited content',
      });
    });

    expect(onMessageEdited).toHaveBeenCalledTimes(1);
    expect(onMessageEdited).toHaveBeenCalledWith({ ...MOCK_MESSAGE, content: 'edited content' });
  });

  it('calls onMessageDeleted with messageId and channelId on message:deleted event', () => {
    const onMessageDeleted = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMessageDeleted,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:deleted', {
        messageId: 'msg-001',
        channelId: 'ch-001',
      });
    });

    expect(onMessageDeleted).toHaveBeenCalledTimes(1);
    expect(onMessageDeleted).toHaveBeenCalledWith('msg-001', 'ch-001');
  });

  it('does not throw when message callbacks are not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('message:created', MOCK_MESSAGE);
        mockEventSourceInstance!.simulateEvent('message:edited', MOCK_MESSAGE);
        mockEventSourceInstance!.simulateEvent('message:deleted', {
          messageId: 'msg-001',
          channelId: 'ch-001',
        });
      });
    }).not.toThrow();
  });

  it('removes message listeners on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('message:created');
    expect(removedTypes).toContain('message:edited');
    expect(removedTypes).toContain('message:deleted');
  });

  it('does not call onMessageCreated on malformed JSON', () => {
    const onMessageCreated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMessageCreated,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('message:created', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'message:created')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onMessageCreated).not.toHaveBeenCalled();
  });
});

// ─── server:updated event handling ───────────────────────────────────────────

describe('useServerEvents — server:updated events', () => {
  it('calls onServerUpdated with parsed server on server:updated event', () => {
    const onServerUpdated = jest.fn();
    const MOCK_SERVER = { id: SERVER_ID, name: 'Test Server', iconUrl: null, description: null };

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onServerUpdated,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('server:updated', MOCK_SERVER);
    });

    expect(onServerUpdated).toHaveBeenCalledTimes(1);
    expect(onServerUpdated).toHaveBeenCalledWith(MOCK_SERVER);
  });

  it('does not throw when onServerUpdated is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('server:updated', {
          id: SERVER_ID,
          name: 'Updated Server',
        });
      });
    }).not.toThrow();
  });

  it('removes server:updated listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onServerUpdated: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('server:updated');
  });
});
