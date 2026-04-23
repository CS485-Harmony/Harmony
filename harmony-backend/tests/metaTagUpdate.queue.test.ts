const addMock = jest.fn();
const getJobMock = jest.fn();
const closeMock = jest.fn();
const removeMock = jest.fn();
const getStateMock = jest.fn();

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: addMock,
    getJob: getJobMock,
    close: closeMock,
  })),
}));

import { metaTagUpdateQueue } from '../src/workers/metaTagUpdate.queue';

describe('metaTagUpdateQueue.scheduleUpdate', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    getJobMock.mockResolvedValue(null);
    addMock.mockResolvedValue(undefined);
    closeMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);
    getStateMock.mockResolvedValue('delayed');
    await metaTagUpdateQueue.close();
  });

  it('deduplicates burst traffic for the same channel into one stable job id', async () => {
    const existingJob = {
      remove: removeMock,
      getState: getStateMock,
    };

    getJobMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(existingJob);

    const first = await metaTagUpdateQueue.scheduleUpdate({
      channelId: 'channel-1',
      triggeredBy: 'message',
    });

    const second = await metaTagUpdateQueue.scheduleUpdate({
      channelId: 'channel-1',
      triggeredBy: 'edit',
    });

    expect(first.jobId).toBe('meta-tag-update:channel-1:channel');
    expect(second.jobId).toBe(first.jobId);
    expect(second.status).toBe('deduplicated');
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledTimes(2);
  });

  it('uses bounded Redis retries for the producer connection', async () => {
    await metaTagUpdateQueue.scheduleUpdate({
      channelId: 'channel-2',
      triggeredBy: 'manual',
    });

    const { Queue } = jest.requireMock('bullmq') as {
      Queue: jest.Mock;
    };
    expect(Queue.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        connection: expect.objectContaining({
          maxRetriesPerRequest: 3,
        }),
      }),
    );
  });

  it('requeues work after a prior job completed', async () => {
    const existingJob = {
      remove: removeMock,
      getState: jest.fn().mockResolvedValue('completed'),
    };
    getJobMock.mockResolvedValue(existingJob);

    const result = await metaTagUpdateQueue.scheduleUpdate({
      channelId: 'channel-3',
      triggeredBy: 'message',
    });

    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      jobId: 'meta-tag-update:channel-3:channel',
      status: 'queued',
    });
  });

  it('schedules a delayed follow-up job when the current job is active', async () => {
    const activeJob = {
      remove: removeMock,
      getState: jest.fn().mockResolvedValue('active'),
    };
    getJobMock
      .mockResolvedValueOnce(activeJob)
      .mockResolvedValueOnce(null);

    const result = await metaTagUpdateQueue.scheduleUpdate({
      channelId: 'channel-4',
      triggeredBy: 'edit',
    });

    expect(addMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledWith(
      'meta-tag-updates',
      expect.objectContaining({
        channelId: 'channel-4',
        idempotencyKey: 'channel:followup',
        triggeredBy: 'edit',
      }),
      expect.objectContaining({
        jobId: 'meta-tag-update:channel-4:channel:followup',
        delay: 60_000,
      }),
    );
    expect(result).toEqual({
      jobId: 'meta-tag-update:channel-4:channel:followup',
      status: 'queued',
    });
  });
});
