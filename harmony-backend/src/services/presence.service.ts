import { UserStatus } from '@prisma/client';
import { redis } from '../db/redis';
import { createLogger } from '../lib/logger';
import { userRepository } from '../repositories/user.repository';
import { userService } from './user.service';

const PRESENCE_LEASE_SET = 'presence:leases';
export const PRESENCE_LEASE_TTL_MS = 75_000;
const PRESENCE_SWEEP_INTERVAL_MS = 15_000;

const logger = createLogger({ component: 'presence-service' });
let sweeper: ReturnType<typeof setInterval> | null = null;
type ActivePresenceStatus = Extract<UserStatus, 'ONLINE' | 'IDLE'>;

async function updateUserStatusIfChanged(userId: string, status: UserStatus): Promise<void> {
  const user = await userRepository.findSelf(userId);
  if (!user) return;

  if (user.status !== status) {
    await userService.updateUser(userId, { status });
  }
}

export const presenceService = {
  async renewLease(userId: string, status: ActivePresenceStatus): Promise<void> {
    const expiresAt = Date.now() + PRESENCE_LEASE_TTL_MS;
    await redis.zadd(PRESENCE_LEASE_SET, expiresAt, userId);
    await updateUserStatusIfChanged(userId, status);
  },

  async expireStaleLeases(now = Date.now()): Promise<number> {
    const expiredUserIds = await redis.zrangebyscore(PRESENCE_LEASE_SET, 0, now);
    let expiredCount = 0;

    for (const userId of expiredUserIds) {
      const removed = await redis.eval(
        `
          local score = redis.call("ZSCORE", KEYS[1], ARGV[1])
          if score and tonumber(score) <= tonumber(ARGV[2]) then
            return redis.call("ZREM", KEYS[1], ARGV[1])
          end
          return 0
        `,
        1,
        PRESENCE_LEASE_SET,
        userId,
        String(now),
      );
      if (removed !== 1) continue;

      try {
        await updateUserStatusIfChanged(userId, UserStatus.OFFLINE);
        expiredCount += 1;
      } catch (err) {
        logger.warn({ err, userId }, 'Failed to expire stale presence lease');
      }
    }

    return expiredCount;
  },

  startSweeper(): void {
    if (sweeper !== null || process.env.NODE_ENV === 'test') return;

    sweeper = setInterval(() => {
      presenceService
        .expireStaleLeases()
        .catch((err) => logger.warn({ err }, 'Presence lease sweep failed'));
    }, PRESENCE_SWEEP_INTERVAL_MS);
    sweeper.unref?.();
  },

  stopSweeper(): void {
    if (sweeper === null) return;
    clearInterval(sweeper);
    sweeper = null;
  },
};
