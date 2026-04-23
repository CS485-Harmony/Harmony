import { Worker, type Job } from 'bullmq';
import { createLogger } from '../lib/logger';
import { metaTagService } from '../services/metaTag/metaTagService';
import {
  buildMetaTagUpdateRedisConnection,
  META_TAG_UPDATE_QUEUE_NAME,
  type MetaTagUpdateJobData,
} from './metaTagUpdate.queue';

const logger = createLogger({ component: 'meta-tag-update-worker' });

let worker: Worker<MetaTagUpdateJobData> | null = null;
let startPromise: Promise<void> | null = null;

export async function processMetaTagUpdateJob(
  job: Job<MetaTagUpdateJobData>,
): Promise<void> {
  await metaTagService.generateMetaTags(job.data.channelId, {
    forceRegenerate: true,
  });
}

export function startMetaTagUpdateWorker(): Promise<void> {
  if (startPromise) return startPromise;

  startPromise = (async () => {
    if (!worker) {
      worker = new Worker<MetaTagUpdateJobData>(
        META_TAG_UPDATE_QUEUE_NAME,
        processMetaTagUpdateJob,
        {
          connection: buildMetaTagUpdateRedisConnection({
            // BullMQ consumers use blocking commands and must not time out waiting
            // for Redis responses during long-lived worker operation.
            maxRetriesPerRequest: null,
          }),
          concurrency: 1,
        },
      );

      worker.on('failed', (job, err) => {
        logger.error(
          {
            err,
            jobId: job?.id ?? null,
            channelId: job?.data.channelId ?? null,
          },
          'Meta tag update job failed',
        );
      });
    }

    await worker.waitUntilReady();
    logger.info('Meta tag update worker ready');
  })().catch((err) => {
    startPromise = null;
    throw err;
  });

  return startPromise;
}

export async function stopMetaTagUpdateWorker(): Promise<void> {
  const activeStart = startPromise;
  if (activeStart) {
    await activeStart.catch(() => undefined);
  }

  startPromise = null;
  if (!worker) return;

  const activeWorker = worker;
  worker = null;
  await activeWorker.close();
}
