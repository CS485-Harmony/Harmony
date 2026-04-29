import { renderHook, act } from '@testing-library/react';
import { usePresenceTracker } from '../hooks/usePresenceTracker';

jest.mock('../lib/api-client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

const API_URL = 'http://localhost:4000';
const mockFetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  process.env.NEXT_PUBLIC_API_URL = API_URL;
  Object.defineProperty(global, 'fetch', { writable: true, value: mockFetch });
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('usePresenceTracker', () => {
  it('posts ONLINE when enabled', () => {
    renderHook(() => usePresenceTracker(true));

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/api/presence/status`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
        body: JSON.stringify({ status: 'ONLINE' }),
      }),
    );
  });

  it('does not post when disabled', () => {
    renderHook(() => usePresenceTracker(false));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('posts IDLE after five minutes of inactivity', () => {
    renderHook(() => usePresenceTracker(true));

    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(mockFetch).toHaveBeenLastCalledWith(
      `${API_URL}/api/presence/status`,
      expect.objectContaining({
        body: JSON.stringify({ status: 'IDLE' }),
      }),
    );
  });

  it('returns to ONLINE after activity while idle', () => {
    renderHook(() => usePresenceTracker(true));

    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });

    expect(mockFetch).toHaveBeenLastCalledWith(
      `${API_URL}/api/presence/status`,
      expect.objectContaining({
        body: JSON.stringify({ status: 'ONLINE' }),
      }),
    );
  });

  it('does not throttle the IDLE to ONLINE transition', () => {
    renderHook(() => usePresenceTracker(true));

    act(() => {
      jest.advanceTimersByTime(29 * 1000);
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      jest.advanceTimersByTime(5 * 60 * 1000);
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
    });

    expect(mockFetch).toHaveBeenLastCalledWith(
      `${API_URL}/api/presence/status`,
      expect.objectContaining({
        body: JSON.stringify({ status: 'ONLINE' }),
      }),
    );
  });

  it('renews the current presence status on a heartbeat interval', () => {
    renderHook(() => usePresenceTracker(true));

    act(() => {
      jest.advanceTimersByTime(30 * 1000);
    });

    expect(mockFetch).toHaveBeenLastCalledWith(
      `${API_URL}/api/presence/status`,
      expect.objectContaining({
        body: JSON.stringify({ status: 'ONLINE' }),
      }),
    );
  });

  it('does not mark OFFLINE on pagehide because the backend lease handles disconnects', () => {
    renderHook(() => usePresenceTracker(true));

    act(() => {
      window.dispatchEvent(new PageTransitionEvent('pagehide'));
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('reports local status changes immediately for optimistic UI updates', () => {
    const onStatusChanged = jest.fn();

    renderHook(() => usePresenceTracker(true, onStatusChanged));

    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    });

    expect(onStatusChanged).toHaveBeenNthCalledWith(1, 'online');
    expect(onStatusChanged).toHaveBeenNthCalledWith(2, 'idle');
    expect(onStatusChanged).toHaveBeenNthCalledWith(3, 'online');
  });
});
