/**
 * Voice Service — manages Twilio Programmable Video room state via Redis.
 *
 * Design rationale:
 * - Redis is the source of truth for who is in a voice channel and their
 *   mute/deafen state. Twilio rooms are created implicitly on first join
 *   and destroyed when the last participant leaves.
 * - Mock mode is enabled when TWILIO_MOCK=true OR when any required credential
 *   is absent. This lets the service run in CI / local dev without real
 *   Twilio credentials while still exercising all Redis state logic.
 * - Twilio AccessToken / VideoGrant are imported lazily inside generateToken
 *   so they are never evaluated in mock mode, avoiding credential errors.
 */

import { redis } from '../db/redis';
import { createLogger } from '../lib/logger';
import { eventBus, EventChannels } from '../events/eventBus';

// ─── TTL ────────────────────────────────────────────────────────────────────

/** 24 hours — refreshed on every join. */
const VOICE_TTL_SECONDS = 86_400;
const logger = createLogger({ component: 'voice-service' });

// ─── Redis key helpers ───────────────────────────────────────────────────────

/**
 * Sanitize an identifier before embedding it in a Redis key.
 * Strips any character outside [a-zA-Z0-9\-_] to prevent key namespace
 * collisions from crafted userId / channelId values (e.g., colons in JWT subs).
 */
function sanitizeSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9\-_]/g, '');
}

/** Redis Set of userIds currently in a voice channel. Exported for router-layer membership checks. */
export function participantsKey(channelId: string): string {
  return `voice:channel:${sanitizeSegment(channelId)}:participants`;
}

/** Redis Hash with fields: channelId, muted (0/1), deafened (0/1). */
function userVoiceKey(userId: string): string {
  return `voice:user:${sanitizeSegment(userId)}:voice`;
}

// ─── Mock / real mode detection ──────────────────────────────────────────────

function isMockMode(): boolean {
  if (process.env.TWILIO_MOCK === 'true') return true;
  const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET } = process.env;
  return !TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET;
}

// ─── Twilio room helpers (real mode only) ────────────────────────────────────

/**
 * Ensure a Twilio Video room exists before the client SDK connects.
 * Does NOT specify a room type — uses the account's configured default,
 * since legacy explicit types (go, group) now return error 53113.
 * Silently ignores 53113 (already exists). Other errors are re-thrown.
 */
async function ensureTwilioRoom(channelId: string): Promise<void> {
  try {
    const twilio = await import('twilio');
    const client = twilio.default(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET, {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
    });
    await client.video.v1.rooms.create({ uniqueName: channelId });
  } catch (err: unknown) {
    const code = (err as { code?: number }).code;
    if (code === 53113) {
      return;
    }
    logger.warn({ err, channelId, code }, 'Failed to pre-create Twilio room');
    // Non-fatal: if pre-creation fails, let TwilioVideo.connect() attempt auto-create.
    // This handles accounts with "Auto-create Rooms" enabled in the Twilio console.
  }
}

/**
 * Attempt to destroy the Twilio Video room identified by `channelId`.
 * Errors are logged but not re-thrown — a stale room is recoverable;
 * blocking the last-leave flow on a Twilio API error is not acceptable.
 */
async function destroyTwilioRoom(channelId: string): Promise<void> {
  try {
    // Dynamic import keeps twilio out of module-level evaluation in mock mode.
    // Use API Key + API Secret auth (same credential layout as generateToken).
    const twilio = await import('twilio');
    const client = twilio.default(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET, {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
    });

    // Rooms are named after channelId — fetch the in-progress room then close it.
    const rooms = await client.video.v1.rooms.list({
      uniqueName: channelId,
      status: 'in-progress',
    });
    await Promise.all(
      rooms.map((room) =>
        client.video.v1
          .rooms(room.sid)
          .update({ status: 'completed' })
          .catch((err: unknown) => {
            logger.warn({ err, channelId, roomSid: room.sid }, 'Failed to close Twilio room');
          }),
      ),
    );
  } catch (err) {
    logger.warn({ err, channelId }, 'Failed to destroy Twilio room');
  }
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface ParticipantState {
  userId: string;
  muted: boolean;
  deafened: boolean;
}

export interface UpdateStateInput {
  muted: boolean;
  deafened: boolean;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const voiceService = {
  /**
   * Generate a Twilio AccessToken granting access to the Video room named
   * after `channelId`. In mock mode, returns a deterministic fake token string.
   */
  generateToken(userId: string, channelId: string): string {
    if (isMockMode()) {
      // Return an opaque placeholder — do not embed internal user/channel IDs
      // in mock tokens, as they could be transmitted to clients and aid enumeration.
      return 'mock-token';
    }

    // Require synchronous require here — we already guard with isMockMode above.
    // AccessToken is nested under twilio.jwt, not at the top level of the module.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const twilio = require('twilio');
    const AccessToken = twilio.jwt.AccessToken;
    const { VideoGrant } = AccessToken;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID as string,
      process.env.TWILIO_API_KEY as string,
      process.env.TWILIO_API_SECRET as string,
      { identity: userId },
    );

    token.addGrant(new VideoGrant({ room: channelId }));
    return token.toJwt() as string;
  },

  /**
   * Add a user to a voice channel.
   * - Writes to Redis Set + Hash with a 24h TTL.
   * - Publishes USER_JOINED_VOICE.
   * - Returns the access token and current participant list.
   */
  async join(
    userId: string,
    channelId: string,
  ): Promise<{ token: string; participants: ParticipantState[] }> {
    const pKey = participantsKey(channelId);
    const uKey = userVoiceKey(userId);

    // Atomically add to set and initialize user hash — pipeline for efficiency.
    // HSETNX sets each field only if it does not already exist, preserving a
    // re-joining user's muted/deafened state rather than resetting it to '0'.
    const pipeline = redis.pipeline();
    pipeline.sadd(pKey, userId);
    pipeline.expire(pKey, VOICE_TTL_SECONDS);
    pipeline.hsetnx(uKey, 'channelId', channelId);
    pipeline.hsetnx(uKey, 'muted', '0');
    pipeline.hsetnx(uKey, 'deafened', '0');
    pipeline.expire(uKey, VOICE_TTL_SECONDS);
    const results = await pipeline.exec();

    if (results === null) {
      throw new Error('[VoiceService] Redis pipeline returned null on join');
    }
    const pipelineErrors = results.filter(([err]) => err !== null);
    if (pipelineErrors.length > 0) {
      throw new Error(
        `[VoiceService] Redis pipeline errors on join: ${pipelineErrors.map(([e]) => String(e)).join(', ')}`,
      );
    }

    eventBus
      .publish(EventChannels.USER_JOINED_VOICE, {
        userId,
        channelId,
        timestamp: new Date().toISOString(),
      })
      .catch((err: unknown) =>
        logger.warn({ err, channelId }, 'Failed to publish voice join event'),
      );

    if (!isMockMode()) {
      await ensureTwilioRoom(channelId);
    }

    const token = voiceService.generateToken(userId, channelId);
    const participants = await voiceService.getParticipants(channelId);

    return { token, participants };
  },

  /**
   * Remove a user from a voice channel.
   * - Cleans up Redis Set + Hash.
   * - Publishes USER_LEFT_VOICE.
   * - If the channel becomes empty, destroys the Twilio room (no-op in mock).
   *
   * Room destruction race note: we check remaining count BEFORE publishing the
   * event to minimize the window where another join could race in between the
   * srem and the scard. A stale Twilio room (user rejoins after destroy fires)
   * is acceptable — Twilio auto-creates a new room on the next join.
   */
  async leave(userId: string, channelId: string): Promise<void> {
    const pKey = participantsKey(channelId);
    const uKey = userVoiceKey(userId);

    // Remove from set and clean up user hash in one pipeline.
    const pipeline = redis.pipeline();
    pipeline.srem(pKey, userId);
    pipeline.del(uKey);
    const results = await pipeline.exec();

    if (results === null) {
      throw new Error('[VoiceService] Redis pipeline returned null on leave');
    }

    // Check remaining count BEFORE publishing so we minimize the race window
    // between the empty-check and the Twilio room destroy call.
    const remaining = await redis.scard(pKey);

    eventBus
      .publish(EventChannels.USER_LEFT_VOICE, {
        userId,
        channelId,
        timestamp: new Date().toISOString(),
      })
      .catch((err: unknown) =>
        logger.warn({ err, channelId }, 'Failed to publish voice leave event'),
      );

    if (remaining === 0 && !isMockMode()) {
      destroyTwilioRoom(channelId).catch((err: unknown) =>
        logger.warn(
          { err, channelId },
          'Failed to destroy Twilio room after final participant left',
        ),
      );
    }
  },

  /**
   * Update the muted / deafened state for a user already in a voice channel.
   * Publishes VOICE_STATE_CHANGED. Does not re-validate channel membership —
   * the router layer is responsible for ensuring the user is in the channel.
   */
  async updateState(userId: string, channelId: string, state: UpdateStateInput): Promise<void> {
    const uKey = userVoiceKey(userId);

    await redis.hset(
      uKey,
      'muted',
      state.muted ? '1' : '0',
      'deafened',
      state.deafened ? '1' : '0',
    );

    eventBus
      .publish(EventChannels.VOICE_STATE_CHANGED, {
        userId,
        channelId,
        muted: state.muted,
        deafened: state.deafened,
        timestamp: new Date().toISOString(),
      })
      .catch((err: unknown) =>
        logger.warn({ err, channelId }, 'Failed to publish voice state change event'),
      );
  },

  /**
   * Return the current participant list for a channel, including mute/deafen
   * state loaded from each participant's Redis Hash.
   */
  async getParticipants(channelId: string): Promise<ParticipantState[]> {
    const pKey = participantsKey(channelId);
    const userIds = await redis.smembers(pKey);

    if (userIds.length === 0) return [];

    // Fetch all user hashes in parallel. Filter out entries with no hash —
    // these can occur if a user's TTL expired or a crash left a stale set entry.
    // Returning a participant with no state would leak the userId of an
    // inconsistent session.
    const stateEntries = await Promise.all(
      userIds.map(async (uid) => {
        const hash = await redis.hgetall(userVoiceKey(uid));
        if (!hash || Object.keys(hash).length === 0) return null;
        return {
          userId: uid,
          muted: hash.muted === '1',
          deafened: hash.deafened === '1',
        };
      }),
    );

    return stateEntries.filter((e): e is ParticipantState => e !== null);
  },
};
