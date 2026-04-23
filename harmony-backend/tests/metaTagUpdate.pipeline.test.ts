const startRuntimeMock = jest.fn();
const stopRuntimeMock = jest.fn();
const startWorkerMock = jest.fn();
const stopWorkerMock = jest.fn();
const closeQueueMock = jest.fn();

jest.mock('../src/workers/metaTagUpdate.runtime', () => ({
  startMetaTagUpdateRuntime: startRuntimeMock,
  stopMetaTagUpdateRuntime: stopRuntimeMock,
}));

jest.mock('../src/workers/metaTagUpdate.worker', () => ({
  startMetaTagUpdateWorker: startWorkerMock,
  stopMetaTagUpdateWorker: stopWorkerMock,
}));

jest.mock('../src/workers/metaTagUpdate.queue', () => ({
  metaTagUpdateQueue: {
    close: closeQueueMock,
  },
}));

import {
  startMetaTagUpdatePipeline,
  stopMetaTagUpdatePipeline,
} from '../src/workers/metaTagUpdate.pipeline';

describe('metaTagUpdate pipeline', () => {
  beforeEach(async () => {
    startRuntimeMock.mockResolvedValue(undefined);
    stopRuntimeMock.mockResolvedValue(undefined);
    startWorkerMock.mockResolvedValue(undefined);
    stopWorkerMock.mockResolvedValue(undefined);
    closeQueueMock.mockResolvedValue(undefined);
    await stopMetaTagUpdatePipeline();
    jest.clearAllMocks();
  });

  it('starts the BullMQ consumer before subscribing to Redis events', async () => {
    await startMetaTagUpdatePipeline();

    expect(startWorkerMock).toHaveBeenCalledTimes(1);
    expect(startRuntimeMock).toHaveBeenCalledTimes(1);
    expect(startWorkerMock.mock.invocationCallOrder[0]).toBeLessThan(
      startRuntimeMock.mock.invocationCallOrder[0],
    );
  });

  it('stops runtime, consumer, and queue connections during shutdown', async () => {
    await startMetaTagUpdatePipeline();
    await stopMetaTagUpdatePipeline();

    expect(stopRuntimeMock).toHaveBeenCalledTimes(1);
    expect(stopWorkerMock).toHaveBeenCalledTimes(1);
    expect(closeQueueMock).toHaveBeenCalledTimes(1);
  });
});
