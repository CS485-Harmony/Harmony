import { Queue, type JobsOptions, type RedisOptions } from 'bullmq';
import { createLogger } from '../lib/logger';

export const META_TAG_UPDATE_QUEUE_NAME = 'meta-tag-updates';
export const META_TAG_UPDATE_DEBOUNCE_MS = 60_000;

export type MetaTagUpdateTrigger = 'message' | 'edit' | 'manual' | 'schedule' | 'visibility';
export type MetaTagUpdatePriority = 'high' | 'normal' | 'low';

export interface MetaTagUpdateJobData {
  jobId: string;
  channelId: string;
  priority: MetaTagUpdatePriority;
  triggeredBy: MetaTagUpdateTrigger;
  idempotencyKey: string;
  status: 'queued' | 'processing' | 'succeeded' | 'failed';
  attemptCount: number;
  queuedAt: string;
}

export interface ScheduleMetaTagUpdateInput {
  channelId: string;
  triggeredBy: MetaTagUpdateTrigger;
  priority?: MetaTagUpdatePriority;
  idempotencyKey?: string;
  delayMs?: number;
}

const logger = createLogger({ component: 'meta-tag-update-queue' });

let queue: Queue<MetaTagUpdateJobData> | null = null;

function getRedisConnection(): RedisOptions {
  return {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
    // Producer calls are awaited by request/worker code paths, so Redis write
    // failures should surface promptly instead of hanging on unbounded retries.
    maxRetriesPerRequest: 3,
  };
}

function getQueue(): Queue<MetaTagUpdateJobData> {
  if (!queue) {
    queue = new Queue<MetaTagUpdateJobData>(META_TAG_UPDATE_QUEUE_NAME, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 60_000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    });
  }
  return queue;
}

function buildJobId(channelId: string, idempotencyKey: string): string {
  return `meta-tag-update:${channelId}:${idempotencyKey}`;
}

function toBullMqPriority(priority: MetaTagUpdatePriority): number | undefined {
  if (priority === 'high') return 1;
  if (priority === 'normal') return 5;
  return 10;
}

export const metaTagUpdateQueue = {
  buildJobId,

  async scheduleUpdate(input: ScheduleMetaTagUpdateInput): Promise<{
    jobId: string;
    status: 'queued' | 'deduplicated';
  }> {
    const delayMs = input.delayMs ?? META_TAG_UPDATE_DEBOUNCE_MS;
    // Default to a channel-scoped dedupe bucket so bursts of create/edit/delete
    // events collapse into one delayed regeneration job for that channel.
    const idempotencyKey = input.idempotencyKey ?? 'channel';
    const jobId = buildJobId(input.channelId, idempotencyKey);
    const jobQueue = getQueue();
    const existingJob = await jobQueue.getJob(jobId);

    const jobData: MetaTagUpdateJobData = {
      jobId,
      channelId: input.channelId,
      priority: input.priority ?? 'normal',
      triggeredBy: input.triggeredBy,
      idempotencyKey,
      status: 'queued',
      attemptCount: 0,
      queuedAt: new Date().toISOString(),
    };

    const addOptions: JobsOptions = {
      jobId,
      delay: delayMs,
      priority: toBullMqPriority(jobData.priority),
    };

    if (existingJob) {
      const state = await existingJob.getState();
      if (state === 'delayed' || state === 'waiting' || state === 'prioritized') {
        await existingJob.remove();
        await jobQueue.add(META_TAG_UPDATE_QUEUE_NAME, jobData, addOptions);
        return { jobId, status: 'deduplicated' };
      }

      logger.info({ jobId, channelId: input.channelId, state }, 'Meta tag update already in flight');
      return { jobId, status: 'deduplicated' };
    }

    await jobQueue.add(META_TAG_UPDATE_QUEUE_NAME, jobData, addOptions);
    return { jobId, status: 'queued' };
  },

  async close(): Promise<void> {
    if (!queue) return;
    await queue.close();
    queue = null;
  },
};
