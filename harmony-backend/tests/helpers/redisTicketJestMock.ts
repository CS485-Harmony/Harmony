/**
 * In-memory Redis mock for SSE one-shot ticket redemption (GETDEL / legacy get+del).
 * Pre-seeds {@link SSE_TEST_TICKET} → {@link SSE_TEST_USER_ID} to match auth mocks.
 */

export const SSE_TEST_TICKET = '550e8400-e29b-41d4-a716-446655440099';
export const SSE_TEST_USER_ID = 'test-user-id';

export function redisTicketMockFactory(): { redis: Record<string, jest.Mock> } {
  const store = new Map<string, string>();

  return {
    redis: {
      set: jest.fn((key: string, val: string) => {
        store.set(key, val);
        return Promise.resolve('OK');
      }),
      eval: jest.fn((_script: string, _numKeys: number, key: string) => {
        const v = store.get(key);
        if (v === undefined) return Promise.resolve(false);
        store.delete(key);
        return Promise.resolve(v);
      }),
      connect: jest.fn().mockResolvedValue(undefined),
      quit: jest.fn().mockResolvedValue(undefined),
      get: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
      del: jest.fn((key: string) => {
        store.delete(key);
        return Promise.resolve(1);
      }),
    },
  };
}

/** Call from test beforeEach so each case gets a fresh one-shot ticket in the mock store. */
export function seedSseTestTicket(redis: { set: jest.Mock }): void {
  redis.set(`sse:ticket:${SSE_TEST_TICKET}`, SSE_TEST_USER_ID);
}
