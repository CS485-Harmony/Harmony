const scheduleUpdateMock = jest.fn();

jest.mock('../src/workers/metaTagUpdate.queue', () => ({
  metaTagUpdateQueue: {
    scheduleUpdate: scheduleUpdateMock,
  },
  META_TAG_UPDATE_DEBOUNCE_MS: 60_000,
}));

import { EventListener } from '../src/workers/eventListener';

describe('EventListener', () => {
  const listener = new EventListener();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('schedules regeneration jobs for message and visibility events', async () => {
    await listener.onMessageCreated({
      messageId: 'msg-1',
      channelId: 'channel-1',
      authorId: 'user-1',
      timestamp: new Date().toISOString(),
    });

    await listener.onMessageEdited({
      messageId: 'msg-1',
      channelId: 'channel-1',
      timestamp: new Date().toISOString(),
    });

    await listener.onMessageDeleted({
      messageId: 'msg-1',
      channelId: 'channel-1',
      timestamp: new Date().toISOString(),
    });

    await listener.onVisibilityChanged({
      channelId: 'channel-2',
      serverId: 'server-1',
      oldVisibility: 'PRIVATE',
      newVisibility: 'PUBLIC_INDEXABLE',
      actorId: 'user-1',
      timestamp: new Date().toISOString(),
    });

    expect(scheduleUpdateMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        channelId: 'channel-1',
        triggeredBy: 'message',
      }),
    );
    expect(scheduleUpdateMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        channelId: 'channel-1',
        triggeredBy: 'edit',
      }),
    );
    expect(scheduleUpdateMock).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        channelId: 'channel-1',
        triggeredBy: 'message',
      }),
    );
    expect(scheduleUpdateMock).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        channelId: 'channel-2',
        triggeredBy: 'visibility',
        priority: 'high',
      }),
    );
  });
});
