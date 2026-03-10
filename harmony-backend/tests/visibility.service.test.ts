/**
 * Visibility service tests — Issue #105
 *
 * Covers all visibility state transitions per §5.2 of
 * dev-spec-channel-visibility-toggle.md, the VOICE guard,
 * indexedAt timestamp management, and event emission.
 *
 * Requires DATABASE_URL pointing at a running Postgres instance
 * and REDIS_URL for event bus tests.
 */

import { ChannelVisibility, ChannelType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { visibilityService, SetVisibilityInput } from '../src/services/visibility.service';
import { eventBus, EventChannels, VisibilityChangedPayload } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';

let serverId: string;
let userId: string;
let textChannelId: string;
let voiceChannelId: string;
let otherServerId: string | null = null;

const makeInput = (
  channelId: string,
  visibility: ChannelVisibility,
): SetVisibilityInput => ({
  channelId,
  serverId,
  visibility,
  actorId: userId,
  ip: '127.0.0.1',
  userAgent: 'test-agent',
});

beforeAll(async () => {
  // Create a test user for audit log foreign key
  const user = await prisma.user.create({
    data: {
      email: `vis-test-${Date.now()}@test.com`,
      username: `vis-test-${Date.now()}`,
      passwordHash: '$2a$10$placeholder',
      displayName: 'Vis Test User',
    },
  });
  userId = user.id;

  const server = await prisma.server.create({
    data: {
      name: 'Visibility Test Server',
      slug: `vis-test-${Date.now()}`,
      isPublic: false,
      ownerId: userId,
    },
  });
  serverId = server.id;

  const textChannel = await prisma.channel.create({
    data: {
      serverId,
      name: 'vis-text',
      slug: 'vis-text',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
      position: 0,
    },
  });
  textChannelId = textChannel.id;

  const voiceChannel = await prisma.channel.create({
    data: {
      serverId,
      name: 'vis-voice',
      slug: 'vis-voice',
      type: ChannelType.VOICE,
      visibility: ChannelVisibility.PRIVATE,
      position: 1,
    },
  });
  voiceChannelId = voiceChannel.id;
});

afterAll(async () => {
  if (otherServerId) {
    await prisma.server.delete({ where: { id: otherServerId } }).catch((err) => {
      console.error('Cleanup: failed to delete other test server:', err);
    });
  }
  if (serverId) {
    await prisma.server.delete({ where: { id: serverId } }).catch((err) => {
      console.error('Cleanup: failed to delete test server:', err);
    });
  }
  if (userId) {
    await prisma.user.delete({ where: { id: userId } }).catch((err) => {
      console.error('Cleanup: failed to delete test user:', err);
    });
  }
  await eventBus.disconnect();
  await prisma.$disconnect();
});

// ─── getVisibility ───────────────────────────────────────────────────────────

describe('visibilityService.getVisibility', () => {
  it('returns the current visibility of a channel', async () => {
    const visibility = await visibilityService.getVisibility(textChannelId, serverId);
    expect(visibility).toBe(ChannelVisibility.PRIVATE);
  });

  it('throws NOT_FOUND for unknown channelId', async () => {
    await expect(
      visibilityService.getVisibility('00000000-0000-0000-0000-000000000000', serverId),
    ).rejects.toThrow(TRPCError);
  });

  it('throws NOT_FOUND when channelId does not belong to serverId', async () => {
    await expect(
      visibilityService.getVisibility(textChannelId, '00000000-0000-0000-0000-000000000000'),
    ).rejects.toThrow(TRPCError);
  });
});

// ─── State transitions (§5.2) ────────────────────────────────────────────────

describe('visibilityService.setVisibility — state transitions', () => {
  // Helper to reset channel to a known state before each transition test
  async function resetChannel(channelId: string, vis: ChannelVisibility) {
    await prisma.channel.update({
      where: { id: channelId },
      data: { visibility: vis, indexedAt: null },
    });
  }

  // S1 → S3: PRIVATE → PUBLIC_INDEXABLE
  it('PRIVATE → PUBLIC_INDEXABLE: sets indexedAt', async () => {
    await resetChannel(textChannelId, ChannelVisibility.PRIVATE);

    const result = await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PUBLIC_INDEXABLE),
    );

    expect(result.success).toBe(true);
    expect(result.oldVisibility).toBe(ChannelVisibility.PRIVATE);
    expect(result.newVisibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);

    const channel = await prisma.channel.findUnique({ where: { id: textChannelId } });
    expect(channel!.visibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);
    expect(channel!.indexedAt).not.toBeNull();
  });

  // S1 → S2: PRIVATE → PUBLIC_NO_INDEX
  it('PRIVATE → PUBLIC_NO_INDEX: indexedAt remains null', async () => {
    await resetChannel(textChannelId, ChannelVisibility.PRIVATE);

    const result = await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PUBLIC_NO_INDEX),
    );

    expect(result.success).toBe(true);
    expect(result.oldVisibility).toBe(ChannelVisibility.PRIVATE);
    expect(result.newVisibility).toBe(ChannelVisibility.PUBLIC_NO_INDEX);

    const channel = await prisma.channel.findUnique({ where: { id: textChannelId } });
    expect(channel!.indexedAt).toBeNull();
  });

  // S2 → S3: PUBLIC_NO_INDEX → PUBLIC_INDEXABLE
  it('PUBLIC_NO_INDEX → PUBLIC_INDEXABLE: sets indexedAt', async () => {
    await resetChannel(textChannelId, ChannelVisibility.PUBLIC_NO_INDEX);

    const result = await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PUBLIC_INDEXABLE),
    );

    expect(result.success).toBe(true);
    expect(result.oldVisibility).toBe(ChannelVisibility.PUBLIC_NO_INDEX);
    expect(result.newVisibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);

    const channel = await prisma.channel.findUnique({ where: { id: textChannelId } });
    expect(channel!.indexedAt).not.toBeNull();
  });

  // S3 → S2: PUBLIC_INDEXABLE → PUBLIC_NO_INDEX
  it('PUBLIC_INDEXABLE → PUBLIC_NO_INDEX: indexedAt unchanged', async () => {
    // Start with PUBLIC_INDEXABLE + a known indexedAt
    const knownDate = new Date('2026-01-01T00:00:00Z');
    await prisma.channel.update({
      where: { id: textChannelId },
      data: { visibility: ChannelVisibility.PUBLIC_INDEXABLE, indexedAt: knownDate },
    });

    const result = await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PUBLIC_NO_INDEX),
    );

    expect(result.success).toBe(true);
    expect(result.oldVisibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);
    expect(result.newVisibility).toBe(ChannelVisibility.PUBLIC_NO_INDEX);

    const channel = await prisma.channel.findUnique({ where: { id: textChannelId } });
    expect(channel!.visibility).toBe(ChannelVisibility.PUBLIC_NO_INDEX);
    expect(channel!.indexedAt).toEqual(knownDate);
  });

  // S3 → S1: PUBLIC_INDEXABLE → PRIVATE (clears indexedAt)
  it('PUBLIC_INDEXABLE → PRIVATE: clears indexedAt', async () => {
    await prisma.channel.update({
      where: { id: textChannelId },
      data: {
        visibility: ChannelVisibility.PUBLIC_INDEXABLE,
        indexedAt: new Date(),
      },
    });

    const result = await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PRIVATE),
    );

    expect(result.success).toBe(true);
    expect(result.oldVisibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);
    expect(result.newVisibility).toBe(ChannelVisibility.PRIVATE);

    const channel = await prisma.channel.findUnique({ where: { id: textChannelId } });
    expect(channel!.visibility).toBe(ChannelVisibility.PRIVATE);
    expect(channel!.indexedAt).toBeNull();
  });

  // S2 → S1: PUBLIC_NO_INDEX → PRIVATE
  it('PUBLIC_NO_INDEX → PRIVATE: clears indexedAt', async () => {
    // Set indexedAt to a non-null value so we can verify it gets cleared
    await prisma.channel.update({
      where: { id: textChannelId },
      data: { visibility: ChannelVisibility.PUBLIC_NO_INDEX, indexedAt: new Date('2026-01-01T00:00:00Z') },
    });

    const result = await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PRIVATE),
    );

    expect(result.success).toBe(true);
    expect(result.oldVisibility).toBe(ChannelVisibility.PUBLIC_NO_INDEX);
    expect(result.newVisibility).toBe(ChannelVisibility.PRIVATE);

    const channel = await prisma.channel.findUnique({ where: { id: textChannelId } });
    expect(channel!.indexedAt).toBeNull();
  });

  // No-op: same visibility
  it('same visibility (no-op): succeeds without changing indexedAt', async () => {
    await resetChannel(textChannelId, ChannelVisibility.PRIVATE);

    const result = await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PRIVATE),
    );

    expect(result.success).toBe(true);
    expect(result.oldVisibility).toBe(ChannelVisibility.PRIVATE);
    expect(result.newVisibility).toBe(ChannelVisibility.PRIVATE);
  });
});

// ─── VOICE guard ─────────────────────────────────────────────────────────────

describe('visibilityService.setVisibility — VOICE guard', () => {
  it('rejects VOICE channel → PUBLIC_INDEXABLE', async () => {
    await expect(
      visibilityService.setVisibility(
        makeInput(voiceChannelId, ChannelVisibility.PUBLIC_INDEXABLE),
      ),
    ).rejects.toThrow(TRPCError);
  });

  it('allows VOICE channel → PUBLIC_NO_INDEX', async () => {
    const result = await visibilityService.setVisibility(
      makeInput(voiceChannelId, ChannelVisibility.PUBLIC_NO_INDEX),
    );
    expect(result.success).toBe(true);
  });

  it('allows VOICE channel → PRIVATE', async () => {
    const result = await visibilityService.setVisibility(
      makeInput(voiceChannelId, ChannelVisibility.PRIVATE),
    );
    expect(result.success).toBe(true);
  });
});

// ─── NOT_FOUND guard ─────────────────────────────────────────────────────────

describe('visibilityService.setVisibility — error cases', () => {
  it('throws NOT_FOUND for unknown channelId', async () => {
    await expect(
      visibilityService.setVisibility(
        makeInput('00000000-0000-0000-0000-000000000000', ChannelVisibility.PUBLIC_INDEXABLE),
      ),
    ).rejects.toThrow(TRPCError);
  });

  it('throws NOT_FOUND when channelId does not belong to serverId', async () => {
    // Create a second server to test cross-server rejection
    const otherServer = await prisma.server.create({
      data: {
        name: 'Other Server',
        slug: `other-server-${Date.now()}`,
        isPublic: false,
        ownerId: userId,
      },
    });
    otherServerId = otherServer.id;

    const input: SetVisibilityInput = {
      channelId: textChannelId,
      serverId: otherServer.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
      actorId: userId,
      ip: '127.0.0.1',
    };

    await expect(visibilityService.setVisibility(input)).rejects.toThrow(TRPCError);
  });
});

// ─── Audit log creation ──────────────────────────────────────────────────────

describe('visibilityService.setVisibility — audit logging', () => {
  it('creates an audit log entry on visibility change', async () => {
    // Reset to known state
    await prisma.channel.update({
      where: { id: textChannelId },
      data: { visibility: ChannelVisibility.PRIVATE, indexedAt: null },
    });

    const result = await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PUBLIC_NO_INDEX),
    );

    expect(result.auditLogId).toBeTruthy();

    const auditEntry = await prisma.visibilityAuditLog.findUnique({
      where: { id: result.auditLogId },
    });
    expect(auditEntry).not.toBeNull();
    expect(auditEntry!.channelId).toBe(textChannelId);
    expect(auditEntry!.actorId).toBe(userId);
    expect(auditEntry!.action).toBe('VISIBILITY_CHANGED');
  });
});

// ─── Event emission ──────────────────────────────────────────────────────────

describe('visibilityService.setVisibility — VISIBILITY_CHANGED event', () => {
  it('emits a VISIBILITY_CHANGED event after successful change', async () => {
    // Reset to known state
    await prisma.channel.update({
      where: { id: textChannelId },
      data: { visibility: ChannelVisibility.PRIVATE, indexedAt: null },
    });

    // Collect all received payloads. Expose a Promise that resolves as soon
    // as the subscription callback delivers a payload for our target channel,
    // eliminating the timing-dependent setTimeout wait.
    const receivedPayloads: unknown[] = [];
    let resolveOnEvent!: (p: VisibilityChangedPayload) => void;
    const eventReceived = new Promise<VisibilityChangedPayload>(
      (resolve) => { resolveOnEvent = resolve; },
    );

    const { unsubscribe, ready } = eventBus.subscribe(
      EventChannels.VISIBILITY_CHANGED,
      (payload) => {
        receivedPayloads.push(payload);
        if (payload.channelId === textChannelId) {
          resolveOnEvent(payload);
        }
      },
    );

    await ready;

    await visibilityService.setVisibility(
      makeInput(textChannelId, ChannelVisibility.PUBLIC_INDEXABLE),
    );

    // Wait for the callback to fire rather than using a fixed timeout, but
    // guard against hanging indefinitely if the event is never delivered.
    // Clear the timer after the race to avoid a dangling handle that keeps
    // the Node.js event loop alive after the test finishes.
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () =>
          reject(
            new Error(
              `Timed out waiting for VISIBILITY_CHANGED event for channel ${textChannelId}`,
            ),
          ),
        2000,
      );
    });

    const payload = await Promise.race<VisibilityChangedPayload>([
      eventReceived,
      timeoutPromise,
    ]);

    clearTimeout(timeoutId!);

    expect(receivedPayloads.length).toBeGreaterThanOrEqual(1);
    expect(payload.channelId).toBe(textChannelId);
    expect(payload.oldVisibility).toBe(ChannelVisibility.PRIVATE);
    expect(payload.newVisibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);
    expect(payload.actorId).toBe(userId);

    unsubscribe();
  });
});
