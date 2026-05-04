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
  fetchSseTicket: jest.fn(() => Promise.resolve('mock-ticket')),
  refreshAccessToken: jest.fn(() => Promise.resolve()),
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

/**
 * The hooks use an async connect() that awaits fetchSseTicket before creating
 * the EventSource. Even though the mock resolves immediately, the await still
 * defers to the microtask queue. flushPromises drains it so the EventSource
 * exists by the time assertions run.
 */
const flushPromises = () => act(async () => {});

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
  it('creates an EventSource with the correct server URL', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );
    await flushPromises();

    expect(MockEventSource).toHaveBeenCalledWith(
      `${API_URL}/api/events/server/${SERVER_ID}?ticket=mock-ticket`,
    );
  });

  it('does NOT create EventSource when enabled=false', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        enabled: false,
      }),
    );
    await flushPromises();

    expect(MockEventSource).not.toHaveBeenCalled();
  });

  it('closes the EventSource on unmount', async () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );
    await flushPromises();

    unmount();

    expect(mockEventSourceInstance?.close).toHaveBeenCalled();
  });

  it('registers listeners for all fourteen event types', async () => {
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
        onVoiceUserJoined: jest.fn(),
        onVoiceUserLeft: jest.fn(),
        onVoiceStateChanged: jest.fn(),
      }),
    );
    await flushPromises();

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
    expect(addedTypes).toContain('voice:userJoined');
    expect(addedTypes).toContain('voice:userLeft');
    expect(addedTypes).toContain('voice:stateChanged');
  });
});

// ─── Channel event handling ───────────────────────────────────────────────────

describe('useServerEvents — channel events', () => {
  it('calls onChannelCreated with parsed channel on channel:created event', async () => {
    const onChannelCreated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated,
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:created', MOCK_CHANNEL);
    });

    expect(onChannelCreated).toHaveBeenCalledTimes(1);
    expect(onChannelCreated).toHaveBeenCalledWith(MOCK_CHANNEL);
  });

  it('calls onChannelUpdated with parsed channel on channel:updated event', async () => {
    const onChannelUpdated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated,
        onChannelDeleted: jest.fn(),
      }),
    );
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:updated', {
        ...MOCK_CHANNEL,
        name: 'renamed',
      });
    });

    expect(onChannelUpdated).toHaveBeenCalledTimes(1);
    expect(onChannelUpdated).toHaveBeenCalledWith({ ...MOCK_CHANNEL, name: 'renamed' });
  });

  it('calls onChannelDeleted with channelId on channel:deleted event', async () => {
    const onChannelDeleted = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted,
      }),
    );
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:deleted', { channelId: 'ch-001' });
    });

    expect(onChannelDeleted).toHaveBeenCalledTimes(1);
    expect(onChannelDeleted).toHaveBeenCalledWith('ch-001');
  });
});

// ─── Member event handling ────────────────────────────────────────────────────

describe('useServerEvents — member events', () => {
  it('calls onMemberJoined with parsed User on member:joined event', async () => {
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
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:joined', MOCK_USER);
    });

    expect(onMemberJoined).toHaveBeenCalledTimes(1);
    expect(onMemberJoined).toHaveBeenCalledWith(MOCK_USER);
  });

  it('calls onMemberLeft with userId on member:left event', async () => {
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
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:left', { userId: 'user-new' });
    });

    expect(onMemberLeft).toHaveBeenCalledTimes(1);
    expect(onMemberLeft).toHaveBeenCalledWith('user-new');
  });

  it('does not throw when onMemberJoined is not provided', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberJoined intentionally omitted
      }),
    );
    await flushPromises();

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:joined', MOCK_USER);
      });
    }).not.toThrow();
  });

  it('does not throw when onMemberLeft is not provided', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberLeft intentionally omitted
      }),
    );
    await flushPromises();

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:left', { userId: 'user-new' });
      });
    }).not.toThrow();
  });

  it('removes member:joined and member:left listeners on unmount', async () => {
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
    await flushPromises();

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('member:joined');
    expect(removedTypes).toContain('member:left');
  });

  it('does not call onMemberJoined on malformed JSON', async () => {
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
    await flushPromises();

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
  it('calls onMemberStatusChanged with id and status on member:statusChanged event', async () => {
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
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:statusChanged', {
        id: 'user-new',
        status: 'idle',
      });
    });

    expect(onMemberStatusChanged).toHaveBeenCalledTimes(1);
    expect(onMemberStatusChanged).toHaveBeenCalledWith({ id: 'user-new', status: 'idle' });
  });

  it('does not throw when onMemberStatusChanged is not provided', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberStatusChanged intentionally omitted
      }),
    );
    await flushPromises();

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:statusChanged', {
          id: 'user-new',
          status: 'offline',
        });
      });
    }).not.toThrow();
  });

  it('removes member:statusChanged listener on unmount', async () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged: jest.fn(),
      }),
    );
    await flushPromises();

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('member:statusChanged');
  });

  it('does not call onMemberStatusChanged on malformed JSON', async () => {
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
    await flushPromises();

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
  it('registers a listener for channel:visibility-changed', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );
    await flushPromises();

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(addedTypes).toContain('channel:visibility-changed');
  });

  it('calls onChannelVisibilityChanged with channel and oldVisibility on event', async () => {
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
    await flushPromises();

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

  it('does not throw when onChannelVisibilityChanged is not provided', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onChannelVisibilityChanged intentionally omitted
      }),
    );
    await flushPromises();

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

  it('removes channel:visibility-changed listener on unmount', async () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );
    await flushPromises();

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('channel:visibility-changed');
  });

  it('does not call onChannelVisibilityChanged on malformed JSON', async () => {
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
    await flushPromises();

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

  it('logs when the EventSource connection fails before opening', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );
    await flushPromises();

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
  it('calls onMessageCreated with parsed message on message:created event', async () => {
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
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:created', MOCK_MESSAGE);
    });

    expect(onMessageCreated).toHaveBeenCalledTimes(1);
    expect(onMessageCreated).toHaveBeenCalledWith(MOCK_MESSAGE);
  });

  it('calls onMessageEdited with parsed message on message:edited event', async () => {
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
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:edited', {
        ...MOCK_MESSAGE,
        content: 'edited content',
      });
    });

    expect(onMessageEdited).toHaveBeenCalledTimes(1);
    expect(onMessageEdited).toHaveBeenCalledWith({ ...MOCK_MESSAGE, content: 'edited content' });
  });

  it('calls onMessageDeleted with messageId and channelId on message:deleted event', async () => {
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
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:deleted', {
        messageId: 'msg-001',
        channelId: 'ch-001',
      });
    });

    expect(onMessageDeleted).toHaveBeenCalledTimes(1);
    expect(onMessageDeleted).toHaveBeenCalledWith('msg-001', 'ch-001');
  });

  it('does not throw when message callbacks are not provided', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );
    await flushPromises();

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

  it('removes message listeners on unmount', async () => {
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
    await flushPromises();

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('message:created');
    expect(removedTypes).toContain('message:edited');
    expect(removedTypes).toContain('message:deleted');
  });

  it('does not call onMessageCreated on malformed JSON', async () => {
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
    await flushPromises();

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
  it('calls onServerUpdated with parsed server on server:updated event', async () => {
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
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('server:updated', MOCK_SERVER);
    });

    expect(onServerUpdated).toHaveBeenCalledTimes(1);
    expect(onServerUpdated).toHaveBeenCalledWith(MOCK_SERVER);
  });

  it('does not throw when onServerUpdated is not provided', async () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );
    await flushPromises();

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('server:updated', {
          id: SERVER_ID,
          name: 'Updated Server',
        });
      });
    }).not.toThrow();
  });

  it('removes server:updated listener on unmount', async () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onServerUpdated: jest.fn(),
      }),
    );
    await flushPromises();

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('server:updated');
  });
});

// ─── Voice presence events ────────────────────────────────────────────────────

describe('useServerEvents — voice presence events', () => {
  it('calls onVoiceUserJoined with channelId and userId on voice:userJoined event', async () => {
    const onVoiceUserJoined = jest.fn();

    renderHook(() =>
      useServerEvents({ serverId: SERVER_ID, onChannelCreated: jest.fn(), onChannelUpdated: jest.fn(), onChannelDeleted: jest.fn(), onVoiceUserJoined }),
    );
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('voice:userJoined', {
        channelId: 'ch-001',
        userId: 'user-001',
      });
    });

    expect(onVoiceUserJoined).toHaveBeenCalledTimes(1);
    expect(onVoiceUserJoined).toHaveBeenCalledWith({ channelId: 'ch-001', userId: 'user-001' });
  });

  it('calls onVoiceUserLeft with channelId and userId on voice:userLeft event', async () => {
    const onVoiceUserLeft = jest.fn();

    renderHook(() =>
      useServerEvents({ serverId: SERVER_ID, onChannelCreated: jest.fn(), onChannelUpdated: jest.fn(), onChannelDeleted: jest.fn(), onVoiceUserLeft }),
    );
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('voice:userLeft', {
        channelId: 'ch-001',
        userId: 'user-001',
      });
    });

    expect(onVoiceUserLeft).toHaveBeenCalledTimes(1);
    expect(onVoiceUserLeft).toHaveBeenCalledWith({ channelId: 'ch-001', userId: 'user-001' });
  });

  it('calls onVoiceStateChanged with full payload on voice:stateChanged event', async () => {
    const onVoiceStateChanged = jest.fn();

    renderHook(() =>
      useServerEvents({ serverId: SERVER_ID, onChannelCreated: jest.fn(), onChannelUpdated: jest.fn(), onChannelDeleted: jest.fn(), onVoiceStateChanged }),
    );
    await flushPromises();

    act(() => {
      mockEventSourceInstance!.simulateEvent('voice:stateChanged', {
        channelId: 'ch-001',
        userId: 'user-001',
        muted: true,
        deafened: false,
      });
    });

    expect(onVoiceStateChanged).toHaveBeenCalledTimes(1);
    expect(onVoiceStateChanged).toHaveBeenCalledWith({
      channelId: 'ch-001',
      userId: 'user-001',
      muted: true,
      deafened: false,
    });
  });

  it('does not throw when voice callbacks are not provided', async () => {
    renderHook(() => useServerEvents({ serverId: SERVER_ID, onChannelCreated: jest.fn(), onChannelUpdated: jest.fn(), onChannelDeleted: jest.fn() }));
    await flushPromises();

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('voice:userJoined', { channelId: 'ch-001', userId: 'u1' });
        mockEventSourceInstance!.simulateEvent('voice:userLeft', { channelId: 'ch-001', userId: 'u1' });
        mockEventSourceInstance!.simulateEvent('voice:stateChanged', { channelId: 'ch-001', userId: 'u1', muted: false, deafened: false });
      });
    }).not.toThrow();
  });

  it('removes voice listeners on unmount', async () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onVoiceUserJoined: jest.fn(),
        onVoiceUserLeft: jest.fn(),
        onVoiceStateChanged: jest.fn(),
      }),
    );
    await flushPromises();

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('voice:userJoined');
    expect(removedTypes).toContain('voice:userLeft');
    expect(removedTypes).toContain('voice:stateChanged');
  });
});
