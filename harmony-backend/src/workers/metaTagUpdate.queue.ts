import { Queue, type JobsOptions, type RedisOptions } from 'bullmq';
import { createLogger } from '../lib/logger';

export const META_TAG_UPDATE_QUEUE_NAME = 'meta-tag-updates';

function parseDebounceMs(): number {
  const raw = Number(process.env.META_TAG_UPDATE_DEBOUNCE_MS ?? 60_000);
  return Number.isFinite(raw) && raw > 0 ? raw : 60_000;
}

export const META_TAG_UPDATE_DEBOUNCE_MS = parseDebounceMs();

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

export function buildMetaTagUpdateRedisConnection(
  overrides: Partial<RedisOptions> = {},
): RedisOptions {
  return {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
    // Producer calls are awaited by request/worker code paths, so Redis write
    // failures should surface promptly instead of hanging on unbounded retries.
    maxRetriesPerRequest: 3,
    ...overrides,
  };
}

function getQueue(): Queue<MetaTagUpdateJobData> {
  if (!queue) {
    queue = new Queue<MetaTagUpdateJobData>(META_TAG_UPDATE_QUEUE_NAME, {
      connection: buildMetaTagUpdateRedisConnection(),
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

function buildFollowUpIdempotencyKey(idempotencyKey: string): string {
  return `${idempotencyKey}:followup`;
}

function toBullMqPriority(priority: MetaTagUpdatePriority): number | undefined {
  if (priority === 'high') return 1;
  if (priority === 'normal') return 5;
  return 10;
}

export const metaTagUpdateQueue = {
  buildJobId,

  async getJob(jobId: string) {
    return getQueue().getJob(jobId);
  },

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

    const enqueueJob = async (
      scheduledJobId: string,
      scheduledJobData: MetaTagUpdateJobData,
      status: 'queued' | 'deduplicated',
    ) => {
      await jobQueue.add(META_TAG_UPDATE_QUEUE_NAME, scheduledJobData, {
        ...addOptions,
        jobId: scheduledJobId,
      });
      return { jobId: scheduledJobId, status };
    };

    const scheduleFollowUp = async () => {
      const followUpIdempotencyKey = buildFollowUpIdempotencyKey(idempotencyKey);
      const followUpJobId = buildJobId(input.channelId, followUpIdempotencyKey);
      const followUpJob = await jobQueue.getJob(followUpJobId);
      const followUpJobData: MetaTagUpdateJobData = {
        ...jobData,
        jobId: followUpJobId,
        idempotencyKey: followUpIdempotencyKey,
      };

      if (!followUpJob) {
        return enqueueJob(followUpJobId, followUpJobData, 'queued');
      }

      const followUpState = await followUpJob.getState();
      if (
        followUpState === 'delayed' ||
        followUpState === 'waiting' ||
        followUpState === 'prioritized' ||
        followUpState === 'completed' ||
        followUpState === 'failed'
      ) {
        await followUpJob.remove();
        return enqueueJob(
          followUpJobId,
          followUpJobData,
          followUpState === 'completed' || followUpState === 'failed' ? 'queued' : 'deduplicated',
        );
      }

      logger.info(
        { jobId: followUpJobId, channelId: input.channelId, state: followUpState },
        'Meta tag update follow-up already in flight',
      );
      return { jobId: followUpJobId, status: 'deduplicated' as const };
    };

    if (existingJob) {
      const state = await existingJob.getState();
      if (state === 'delayed' || state === 'waiting' || state === 'prioritized') {
        await existingJob.remove();
        return enqueueJob(jobId, jobData, 'deduplicated');
      }

      if (state === 'completed' || state === 'failed') {
        await existingJob.remove();
        return enqueueJob(jobId, jobData, 'queued');
      }

      logger.info(
        { jobId, channelId: input.channelId, state },
        'Meta tag update already in flight, scheduling follow-up',
      );
      return scheduleFollowUp();
    }

    return enqueueJob(jobId, jobData, 'queued');
  },

  async close(): Promise<void> {
    if (!queue) return;
    await queue.close();
    queue = null;
  },
};
