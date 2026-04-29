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

  describe('onVisibilityChanged — three F8 branches (B12/B16/B17)', () => {
    type Visibility = 'PUBLIC_INDEXABLE' | 'PUBLIC_NO_INDEX' | 'PRIVATE';

    function makeEvent(oldVisibility: Visibility, newVisibility: Visibility) {
      return {
        channelId: 'channel-vis',
        serverId: 'server-1',
        oldVisibility,
        newVisibility,
        actorId: 'user-1',
        timestamp: new Date().toISOString(),
      };
    }

    const highPriorityVisibilityJob = expect.objectContaining({
      channelId: 'channel-vis',
      triggeredBy: 'visibility',
      priority: 'high',
    });

    it('PUBLIC_INDEXABLE → PRIVATE (B12): schedules high-priority job for DB cleanup', async () => {
      await listener.onVisibilityChanged(makeEvent('PUBLIC_INDEXABLE', 'PRIVATE'));
      expect(scheduleUpdateMock).toHaveBeenCalledTimes(1);
      expect(scheduleUpdateMock).toHaveBeenCalledWith(highPriorityVisibilityJob);
    });

    it('PUBLIC_NO_INDEX → PRIVATE (B12): schedules high-priority job for DB cleanup', async () => {
      await listener.onVisibilityChanged(makeEvent('PUBLIC_NO_INDEX', 'PRIVATE'));
      expect(scheduleUpdateMock).toHaveBeenCalledTimes(1);
      expect(scheduleUpdateMock).toHaveBeenCalledWith(highPriorityVisibilityJob);
    });

    it('PUBLIC_INDEXABLE → PUBLIC_NO_INDEX (B16): schedules high-priority regen for noindex', async () => {
      await listener.onVisibilityChanged(makeEvent('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX'));
      expect(scheduleUpdateMock).toHaveBeenCalledTimes(1);
      expect(scheduleUpdateMock).toHaveBeenCalledWith(highPriorityVisibilityJob);
    });

    it('PRIVATE → PUBLIC_NO_INDEX (B16): schedules high-priority regen for noindex', async () => {
      await listener.onVisibilityChanged(makeEvent('PRIVATE', 'PUBLIC_NO_INDEX'));
      expect(scheduleUpdateMock).toHaveBeenCalledTimes(1);
      expect(scheduleUpdateMock).toHaveBeenCalledWith(highPriorityVisibilityJob);
    });

    it('PRIVATE → PUBLIC_INDEXABLE (B17): schedules high-priority regen for index,follow', async () => {
      await listener.onVisibilityChanged(makeEvent('PRIVATE', 'PUBLIC_INDEXABLE'));
      expect(scheduleUpdateMock).toHaveBeenCalledTimes(1);
      expect(scheduleUpdateMock).toHaveBeenCalledWith(highPriorityVisibilityJob);
    });

    it('PUBLIC_NO_INDEX → PUBLIC_INDEXABLE (B17): schedules high-priority regen for index,follow', async () => {
      await listener.onVisibilityChanged(makeEvent('PUBLIC_NO_INDEX', 'PUBLIC_INDEXABLE'));
      expect(scheduleUpdateMock).toHaveBeenCalledTimes(1);
      expect(scheduleUpdateMock).toHaveBeenCalledWith(highPriorityVisibilityJob);
    });
  });
});
