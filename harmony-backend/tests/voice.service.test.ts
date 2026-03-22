/**
 * Voice service tests — run against real Redis in mock Twilio mode.
 *
 * Each test uses a unique channelId to prevent cross-test pollution.
 * All Redis keys created during a test are cleaned up in afterEach.
 */

// Enable mock mode before any module is imported.
process.env.TWILIO_MOCK = 'true';
process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://:devsecret@localhost:6379';

import { randomUUID } from 'crypto';
import { redis } from '../src/db/redis';
import { voiceService } from '../src/services/voice.service';

// Track keys created in each test for deterministic cleanup.
const keysToClean: string[] = [];

function participantsKey(channelId: string) {
  return `voice:channel:${channelId}:participants`;
}
function userVoiceKey(userId: string) {
  return `voice:user:${userId}:voice`;
}

afterEach(async () => {
  if (keysToClean.length > 0) {
    await redis.del(...keysToClean);
    keysToClean.length = 0;
  }
});

afterAll(async () => {
  await redis.quit();
});

// ─── generateToken ───────────────────────────────────────────────────────────

describe('voiceService.generateToken', () => {
  it('returns a string token in mock mode', () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    const token = voiceService.generateToken(userId, channelId);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('returns an opaque mock token (does not embed internal IDs)', () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    const token = voiceService.generateToken(userId, channelId);
    // Opaque placeholder — internal user/channel IDs must not appear in mock tokens.
    expect(token).toBe('mock-token');
    expect(token).not.toContain(userId);
    expect(token).not.toContain(channelId);
  });
});

// ─── join ────────────────────────────────────────────────────────────────────

describe('voiceService.join', () => {
  it('adds the user to the Redis set and returns a token', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    const result = await voiceService.join(userId, channelId);

    expect(typeof result.token).toBe('string');
    expect(result.token).toBe('mock-token');

    const isMember = await redis.sismember(participantsKey(channelId), userId);
    expect(isMember).toBe(1);
  });

  it('returns the participant list including the joining user', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    const result = await voiceService.join(userId, channelId);

    expect(result.participants).toHaveLength(1);
    expect(result.participants[0].userId).toBe(userId);
    expect(result.participants[0].muted).toBe(false);
    expect(result.participants[0].deafened).toBe(false);
  });

  it('supports multiple users joining the same channel', async () => {
    const userA = randomUUID();
    const userB = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userA), userVoiceKey(userB));

    await voiceService.join(userA, channelId);
    const result = await voiceService.join(userB, channelId);

    const userIds = result.participants.map((p) => p.userId).sort();
    expect(userIds).toEqual([userA, userB].sort());
  });
});

// ─── join (edge cases) ───────────────────────────────────────────────────────

describe('voiceService.join (edge cases)', () => {
  it('is idempotent — double-join does not duplicate the participant', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    await voiceService.join(userId, channelId);
    const result = await voiceService.join(userId, channelId);

    // Redis SADD is idempotent — the user appears exactly once.
    expect(result.participants.filter((p) => p.userId === userId)).toHaveLength(1);
    const count = await redis.scard(participantsKey(channelId));
    expect(count).toBe(1);
  });
});

// ─── leave ───────────────────────────────────────────────────────────────────

describe('voiceService.leave', () => {
  it('removes the user from the Redis set', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    await voiceService.join(userId, channelId);
    await voiceService.leave(userId, channelId);

    const isMember = await redis.sismember(participantsKey(channelId), userId);
    expect(isMember).toBe(0);
  });

  it('leaves the set empty when the last user leaves', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    await voiceService.join(userId, channelId);
    await voiceService.leave(userId, channelId);

    const remaining = await redis.scard(participantsKey(channelId));
    expect(remaining).toBe(0);
  });

  it('removes only the leaving user when others remain', async () => {
    const userA = randomUUID();
    const userB = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userA), userVoiceKey(userB));

    await voiceService.join(userA, channelId);
    await voiceService.join(userB, channelId);
    await voiceService.leave(userA, channelId);

    const remaining = await redis.smembers(participantsKey(channelId));
    expect(remaining).toEqual([userB]);
  });

  it('is a no-op when user was never in the channel (graceful leave)', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    // Should resolve without throwing even if user was never in the channel.
    await expect(voiceService.leave(userId, channelId)).resolves.toBeUndefined();
    const count = await redis.scard(participantsKey(channelId));
    expect(count).toBe(0);
  });
});

// ─── updateState ─────────────────────────────────────────────────────────────

describe('voiceService.updateState', () => {
  it('updates the muted flag in Redis', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    await voiceService.join(userId, channelId);
    await voiceService.updateState(userId, channelId, { muted: true, deafened: false });

    const hash = await redis.hgetall(userVoiceKey(userId));
    expect(hash.muted).toBe('1');
    expect(hash.deafened).toBe('0');
  });

  it('updates the deafened flag in Redis', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    await voiceService.join(userId, channelId);
    await voiceService.updateState(userId, channelId, { muted: false, deafened: true });

    const hash = await redis.hgetall(userVoiceKey(userId));
    expect(hash.muted).toBe('0');
    expect(hash.deafened).toBe('1');
  });
});

// ─── getParticipants ─────────────────────────────────────────────────────────

describe('voiceService.getParticipants', () => {
  it('returns an empty array when nobody is in the channel', async () => {
    const channelId = randomUUID();
    const participants = await voiceService.getParticipants(channelId);
    expect(participants).toEqual([]);
  });

  it('reflects updated mute/deafen state after updateState', async () => {
    const userId = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userId));

    await voiceService.join(userId, channelId);
    await voiceService.updateState(userId, channelId, { muted: true, deafened: true });

    const participants = await voiceService.getParticipants(channelId);

    expect(participants).toHaveLength(1);
    expect(participants[0].userId).toBe(userId);
    expect(participants[0].muted).toBe(true);
    expect(participants[0].deafened).toBe(true);
  });

  it('returns all participants with their individual states', async () => {
    const userA = randomUUID();
    const userB = randomUUID();
    const channelId = randomUUID();
    keysToClean.push(participantsKey(channelId), userVoiceKey(userA), userVoiceKey(userB));

    await voiceService.join(userA, channelId);
    await voiceService.join(userB, channelId);
    await voiceService.updateState(userA, channelId, { muted: true, deafened: false });

    const participants = await voiceService.getParticipants(channelId);
    const byId = Object.fromEntries(participants.map((p) => [p.userId, p]));

    expect(byId[userA].muted).toBe(true);
    expect(byId[userA].deafened).toBe(false);
    expect(byId[userB].muted).toBe(false);
    expect(byId[userB].deafened).toBe(false);
  });
});
