/**
 * useChannelEvents.test.tsx — Issue #180
 *
 * Tests the useChannelEvents hook that subscribes to real-time SSE events
 * for a channel.
 *
 * EventSource is mocked to avoid actual network connections.
 */

import { renderHook, act } from '@testing-library/react';
import { useChannelEvents } from '../hooks/useChannelEvents';
import type { Message } from '../types/message';

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
  // Test helper: fire a named event
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

// Attach constants so it passes `x instanceof EventSource` in some environments
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CONNECTING = 0;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).OPEN = 1;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CLOSED = 2;

Object.defineProperty(global, 'EventSource', {
  writable: true,
  value: MockEventSource,
});

// ─── Fixture data ─────────────────────────────────────────────────────────────

const CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
const API_URL = 'http://localhost:4000';

const MOCK_MESSAGE: Message = {
  id: 'msg-001',
  channelId: CHANNEL_ID,
  authorId: 'user-001',
  author: { id: 'user-001', username: 'alice', displayName: 'Alice' },
  content: 'Hello!',
  timestamp: '2024-01-01T00:00:00.000Z',
  attachments: [],
};

// ─── Setup ────────────────────────────────────────────────────────────────────

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  mockEventSourceInstance = null;
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };
});

afterEach(() => {
  process.env = originalEnv;
});

// ─── Connection ───────────────────────────────────────────────────────────────

describe('useChannelEvents — connection', () => {
  it('creates an EventSource with the correct URL', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    expect(MockEventSource).toHaveBeenCalledWith(
      `${API_URL}/api/events/channel/${CHANNEL_ID}?token=mock-token`,
    );
  });

  it('does NOT create EventSource when enabled=false', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        enabled: false,
      }),
    );

    expect(MockEventSource).not.toHaveBeenCalled();
  });

  it('closes the EventSource on unmount', () => {
    const { unmount } = renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    unmount();

    expect(mockEventSourceInstance?.close).toHaveBeenCalled();
  });

  it('re-creates EventSource when channelId changes', () => {
    const { rerender } = renderHook(
      ({ channelId }: { channelId: string }) =>
        useChannelEvents({
          channelId,
          onMessageCreated: jest.fn(),
          onMessageEdited: jest.fn(),
          onMessageDeleted: jest.fn(),
        }),
      { initialProps: { channelId: CHANNEL_ID } },
    );

    expect(MockEventSource).toHaveBeenCalledTimes(1);

    rerender({ channelId: '550e8400-e29b-41d4-a716-446655440002' });

    expect(MockEventSource).toHaveBeenCalledTimes(2);
  });
});

// ─── Event handling ───────────────────────────────────────────────────────────

describe('useChannelEvents — event handling', () => {
  it('calls onMessageCreated with parsed message on message:created event', () => {
    const onMessageCreated = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated,
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
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
    const editedMessage = {
      ...MOCK_MESSAGE,
      content: 'edited',
      editedAt: '2024-01-01T01:00:00.000Z',
    };

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited,
        onMessageDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:edited', editedMessage);
    });

    expect(onMessageEdited).toHaveBeenCalledTimes(1);
    expect(onMessageEdited).toHaveBeenCalledWith(editedMessage);
  });

  it('calls onMessageDeleted with messageId on message:deleted event', () => {
    const onMessageDeleted = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:deleted', { messageId: 'msg-001' });
    });

    expect(onMessageDeleted).toHaveBeenCalledTimes(1);
    expect(onMessageDeleted).toHaveBeenCalledWith('msg-001');
  });

  it('registers event listeners for all three event types', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);
    expect(addedTypes).toContain('message:created');
    expect(addedTypes).toContain('message:edited');
    expect(addedTypes).toContain('message:deleted');
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('useChannelEvents — edge cases', () => {
  it('does not throw when receiving malformed JSON in an event', () => {
    const onMessageCreated = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated,
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
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

    // Malformed JSON should not call the handler
    expect(onMessageCreated).not.toHaveBeenCalled();
  });

  it('removes event listeners on unmount', () => {
    const { unmount } = renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    unmount();

    expect(mockEventSourceInstance!.removeEventListener).toHaveBeenCalled();
  });
});
