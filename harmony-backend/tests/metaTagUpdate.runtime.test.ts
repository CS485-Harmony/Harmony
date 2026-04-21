const subscribeMock = jest.fn();
const unsubscribeMock = jest.fn();
const loggerErrorMock = jest.fn();
const listenerMocks = {
  onMessageCreated: jest.fn().mockResolvedValue(undefined),
  onMessageEdited: jest.fn().mockResolvedValue(undefined),
  onMessageDeleted: jest.fn().mockResolvedValue(undefined),
  onVisibilityChanged: jest.fn().mockResolvedValue(undefined),
};

jest.mock('../src/events/eventBus', () => ({
  eventBus: {
    subscribe: subscribeMock,
  },
  EventChannels: {
    MESSAGE_CREATED: 'harmony:MESSAGE_CREATED',
    MESSAGE_EDITED: 'harmony:MESSAGE_EDITED',
    MESSAGE_DELETED: 'harmony:MESSAGE_DELETED',
    VISIBILITY_CHANGED: 'harmony:VISIBILITY_CHANGED',
  },
}));

jest.mock('../src/lib/logger', () => ({
  createLogger: jest.fn(() => ({
    error: loggerErrorMock,
    info: jest.fn(),
  })),
}));

jest.mock('../src/workers/eventListener', () => ({
  EventListener: jest.fn().mockImplementation(() => listenerMocks),
}));

import { startMetaTagUpdateRuntime, stopMetaTagUpdateRuntime } from '../src/workers/metaTagUpdate.runtime';

describe('metaTagUpdate runtime', () => {
  beforeEach(async () => {
    listenerMocks.onMessageCreated.mockResolvedValue(undefined);
    listenerMocks.onMessageEdited.mockResolvedValue(undefined);
    listenerMocks.onMessageDeleted.mockResolvedValue(undefined);
    listenerMocks.onVisibilityChanged.mockResolvedValue(undefined);
    subscribeMock.mockReturnValue({
      ready: Promise.resolve(),
      unsubscribe: unsubscribeMock,
    });
    await stopMetaTagUpdateRuntime();
    jest.clearAllMocks();
  });

  it('subscribes to regeneration events only when the worker runtime starts', async () => {
    await startMetaTagUpdateRuntime();

    expect(subscribeMock).toHaveBeenCalledTimes(4);
    expect(subscribeMock.mock.calls.map((call: [string]) => call[0])).toEqual([
      'harmony:MESSAGE_CREATED',
      'harmony:MESSAGE_EDITED',
      'harmony:MESSAGE_DELETED',
      'harmony:VISIBILITY_CHANGED',
    ]);

    await stopMetaTagUpdateRuntime();
    expect(unsubscribeMock).toHaveBeenCalledTimes(4);
  });

  it('logs async handler failures instead of leaking promise rejections', async () => {
    const handlers: Array<(payload: unknown) => void> = [];
    subscribeMock.mockImplementation((_channel: string, handler: (payload: unknown) => void) => {
      handlers.push(handler);
      return {
        ready: Promise.resolve(),
        unsubscribe: unsubscribeMock,
      };
    });
    listenerMocks.onMessageCreated.mockRejectedValueOnce(new Error('redis down'));

    await startMetaTagUpdateRuntime();
    handlers[0]?.({ channelId: 'channel-1' });
    await new Promise((resolve) => setImmediate(resolve));

    expect(loggerErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({
        err: expect.any(Error),
        eventName: 'harmony:MESSAGE_CREATED',
      }),
      'Meta tag update handler failed',
    );
  });

  it('waits for an in-flight start before clearing runtime state', async () => {
    let resolveReady!: () => void;
    const ready = new Promise<void>((resolve) => {
      resolveReady = resolve;
    });
    subscribeMock.mockReturnValue({
      ready,
      unsubscribe: unsubscribeMock,
    });

    const firstStart = startMetaTagUpdateRuntime();
    const stop = stopMetaTagUpdateRuntime();
    const secondStart = startMetaTagUpdateRuntime();

    resolveReady();
    await Promise.all([firstStart, stop, secondStart]);

    expect(subscribeMock).toHaveBeenCalledTimes(4);
    expect(unsubscribeMock).toHaveBeenCalledTimes(4);
  });
});
