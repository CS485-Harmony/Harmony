/**
 * useServerListSync.test.tsx — Issue #188
 *
 * Tests the useServerListSync hook that syncs server list state across
 * browser tabs using the BroadcastChannel API.
 *
 * BroadcastChannel and next/navigation are mocked to avoid browser/framework
 * dependencies in the test environment.
 */

import { renderHook, act } from '@testing-library/react';
import { useServerListSync } from '../hooks/useServerListSync';

// ─── Mock next/navigation ─────────────────────────────────────────────────────

const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

// ─── Mock BroadcastChannel ────────────────────────────────────────────────────

interface MockBroadcastChannelInstance {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null;
  postMessage: jest.Mock;
  close: jest.Mock;
  /** Test helper: simulate receiving a message from another tab */
  simulateMessage: (data: unknown) => void;
}

let mockBroadcastChannelInstance: MockBroadcastChannelInstance | null = null;

const MockBroadcastChannel = jest.fn().mockImplementation((name: string) => {
  const instance: MockBroadcastChannelInstance = {
    name,
    onmessage: null,
    postMessage: jest.fn(),
    close: jest.fn(),
    simulateMessage(data: unknown) {
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', { data }));
      }
    },
  };
  mockBroadcastChannelInstance = instance;
  return instance;
});

Object.defineProperty(global, 'BroadcastChannel', {
  writable: true,
  value: MockBroadcastChannel,
});

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockBroadcastChannelInstance = null;
});

// ─── Channel creation ─────────────────────────────────────────────────────────

describe('useServerListSync — channel setup', () => {
  it('creates a BroadcastChannel named "harmony:server-list"', () => {
    renderHook(() => useServerListSync());

    expect(MockBroadcastChannel).toHaveBeenCalledWith('harmony:server-list');
  });

  it('closes the BroadcastChannel on unmount', () => {
    const { unmount } = renderHook(() => useServerListSync());

    unmount();

    expect(mockBroadcastChannelInstance?.close).toHaveBeenCalledTimes(1);
  });
});

// ─── Receiving messages (from other tabs) ────────────────────────────────────

describe('useServerListSync — receiving messages', () => {
  it('calls router.refresh() when receiving a server:created message', () => {
    renderHook(() => useServerListSync());

    act(() => {
      mockBroadcastChannelInstance!.simulateMessage({ type: 'server:created', serverId: 'srv-1' });
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls router.refresh() when receiving a server:joined message', () => {
    renderHook(() => useServerListSync());

    act(() => {
      mockBroadcastChannelInstance!.simulateMessage({ type: 'server:joined', serverId: 'srv-2' });
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('does NOT call router.refresh() for an unrecognized message type', () => {
    renderHook(() => useServerListSync());

    act(() => {
      mockBroadcastChannelInstance!.simulateMessage({ type: 'server:deleted', serverId: 'srv-3' });
    });

    expect(mockRefresh).not.toHaveBeenCalled();
  });
});

// ─── Sending notifications (to other tabs) ───────────────────────────────────

describe('useServerListSync — notifyServerCreated', () => {
  it('posts a server:created message on the channel', () => {
    const { result } = renderHook(() => useServerListSync());

    act(() => {
      result.current.notifyServerCreated('srv-abc');
    });

    expect(mockBroadcastChannelInstance?.postMessage).toHaveBeenCalledWith({
      type: 'server:created',
      serverId: 'srv-abc',
    });
  });

  it('does NOT call router.refresh() when sending (current tab already has update)', () => {
    const { result } = renderHook(() => useServerListSync());

    act(() => {
      result.current.notifyServerCreated('srv-abc');
    });

    expect(mockRefresh).not.toHaveBeenCalled();
  });
});

describe('useServerListSync — notifyServerJoined', () => {
  it('posts a server:joined message on the channel', () => {
    const { result } = renderHook(() => useServerListSync());

    act(() => {
      result.current.notifyServerJoined('srv-xyz');
    });

    expect(mockBroadcastChannelInstance?.postMessage).toHaveBeenCalledWith({
      type: 'server:joined',
      serverId: 'srv-xyz',
    });
  });

  it('does NOT call router.refresh() when sending (current tab already has update)', () => {
    const { result } = renderHook(() => useServerListSync());

    act(() => {
      result.current.notifyServerJoined('srv-xyz');
    });

    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
