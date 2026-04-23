import { createLogger } from '../lib/logger';
import { metaTagUpdateQueue } from './metaTagUpdate.queue';
import { startMetaTagUpdateRuntime, stopMetaTagUpdateRuntime } from './metaTagUpdate.runtime';
import { startMetaTagUpdateWorker, stopMetaTagUpdateWorker } from './metaTagUpdate.worker';

const logger = createLogger({ component: 'meta-tag-update-pipeline' });

let startPromise: Promise<void> | null = null;

export function startMetaTagUpdatePipeline(): Promise<void> {
  if (startPromise) return startPromise;

  startPromise = (async () => {
    // Start the BullMQ consumer before subscribing to Redis domain events so
    // the worker can immediately drain any jobs the event listeners enqueue.
    await startMetaTagUpdateWorker();
    await startMetaTagUpdateRuntime();
    logger.info('Meta tag update pipeline ready');
  })().catch((err) => {
    startPromise = null;
    throw err;
  });

  return startPromise;
}

export async function stopMetaTagUpdatePipeline(): Promise<void> {
  const activeStart = startPromise;
  if (activeStart) {
    await activeStart.catch(() => undefined);
  }

  startPromise = null;
  await stopMetaTagUpdateRuntime();
  await stopMetaTagUpdateWorker();
  await metaTagUpdateQueue.close();
}
