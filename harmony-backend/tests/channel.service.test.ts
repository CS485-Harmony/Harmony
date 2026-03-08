/**
 * Channel service tests — Issue #100
 *
 * Covers happy-path CRUD operations and the VOICE ≠ PUBLIC_INDEXABLE guard.
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { channelService } from '../src/services/channel.service';

const prisma = new PrismaClient();

let serverId: string;
let channelId: string;

beforeAll(async () => {
  const server = await prisma.server.create({
    data: {
      name: 'Channel Test Server',
      slug: `channel-test-${Date.now()}`,
      isPublic: false,
    },
  });
  serverId = server.id;
});

afterAll(async () => {
  if (serverId) {
    await prisma.server.delete({ where: { id: serverId } }).catch(() => {});
  }
  await prisma.$disconnect();
});

// ─── createChannel ────────────────────────────────────────────────────────────

describe('channelService.createChannel', () => {
  it('creates a TEXT PRIVATE channel', async () => {
    const channel = await channelService.createChannel({
      serverId,
      name: 'general',
      slug: 'general',
      type: 'TEXT',
      visibility: 'PRIVATE',
      position: 0,
    });
    channelId = channel.id;
    expect(channel.id).toBeTruthy();
    expect(channel.name).toBe('general');
    expect(channel.type).toBe('TEXT');
    expect(channel.visibility).toBe('PRIVATE');
  });

  it('rejects VOICE + PUBLIC_INDEXABLE', async () => {
    await expect(
      channelService.createChannel({
        serverId,
        name: 'voice-pub',
        slug: 'voice-pub',
        type: 'VOICE',
        visibility: 'PUBLIC_INDEXABLE',
      }),
    ).rejects.toThrow(TRPCError);
  });

  it('rejects duplicate slug within same server', async () => {
    await expect(
      channelService.createChannel({
        serverId,
        name: 'General Dup',
        slug: 'general',
        type: 'TEXT',
        visibility: 'PRIVATE',
      }),
    ).rejects.toThrow(TRPCError);
  });

  it('rejects unknown serverId', async () => {
    await expect(
      channelService.createChannel({
        serverId: '00000000-0000-0000-0000-000000000000',
        name: 'orphan',
        slug: 'orphan',
        type: 'TEXT',
        visibility: 'PRIVATE',
      }),
    ).rejects.toThrow(TRPCError);
  });
});

// ─── getChannels ──────────────────────────────────────────────────────────────

describe('channelService.getChannels', () => {
  it('returns all channels for a server', async () => {
    const channels = await channelService.getChannels(serverId);
    expect(Array.isArray(channels)).toBe(true);
    expect(channels.length).toBeGreaterThanOrEqual(1);
    expect(channels.every((c) => c.serverId === serverId)).toBe(true);
  });
});

// ─── getChannelBySlug ─────────────────────────────────────────────────────────

describe('channelService.getChannelBySlug', () => {
  let serverSlug: string;

  beforeAll(async () => {
    const server = await prisma.server.findUnique({ where: { id: serverId } });
    serverSlug = server!.slug;
  });

  it('resolves channel by server slug + channel slug', async () => {
    const channel = await channelService.getChannelBySlug(serverSlug, 'general');
    expect(channel.slug).toBe('general');
    expect(channel.serverId).toBe(serverId);
  });

  it('throws NOT_FOUND for unknown server slug', async () => {
    await expect(
      channelService.getChannelBySlug('no-such-server', 'general'),
    ).rejects.toThrow(TRPCError);
  });

  it('throws NOT_FOUND for unknown channel slug', async () => {
    await expect(
      channelService.getChannelBySlug(serverSlug, 'no-such-channel'),
    ).rejects.toThrow(TRPCError);
  });
});

// ─── updateChannel ────────────────────────────────────────────────────────────

describe('channelService.updateChannel', () => {
  it('updates name and topic', async () => {
    const updated = await channelService.updateChannel(channelId, serverId, {
      name: 'general-updated',
      topic: 'A new topic',
    });
    expect(updated.name).toBe('general-updated');
    expect(updated.topic).toBe('A new topic');
  });

  it('updates position', async () => {
    const updated = await channelService.updateChannel(channelId, serverId, { position: 5 });
    expect(updated.position).toBe(5);
  });

  it('throws NOT_FOUND for unknown channelId', async () => {
    await expect(
      channelService.updateChannel('00000000-0000-0000-0000-000000000000', serverId, { name: 'x' }),
    ).rejects.toThrow(TRPCError);
  });

  it('throws NOT_FOUND when channelId belongs to a different server', async () => {
    const otherServer = await prisma.server.create({
      data: { name: 'Other Server', slug: `other-server-${Date.now()}`, isPublic: false },
    });
    await expect(
      channelService.updateChannel(channelId, otherServer.id, { name: 'x' }),
    ).rejects.toThrow(TRPCError);
    await prisma.server.delete({ where: { id: otherServer.id } }).catch(() => {});
  });
});

// ─── createDefaultChannel ─────────────────────────────────────────────────────

describe('channelService.createDefaultChannel', () => {
  let defaultServerId: string;

  beforeAll(async () => {
    const server = await prisma.server.create({
      data: {
        name: 'Default Channel Server',
        slug: `default-ch-test-${Date.now()}`,
        isPublic: false,
      },
    });
    defaultServerId = server.id;
  });

  afterAll(async () => {
    if (defaultServerId) {
      await prisma.server.delete({ where: { id: defaultServerId } }).catch(() => {});
    }
  });

  it('creates a "general" TEXT PRIVATE channel at position 0', async () => {
    const channel = await channelService.createDefaultChannel(defaultServerId);
    expect(channel.name).toBe('general');
    expect(channel.slug).toBe('general');
    expect(channel.type).toBe('TEXT');
    expect(channel.visibility).toBe('PRIVATE');
    expect(channel.position).toBe(0);
  });
});

// ─── deleteChannel ────────────────────────────────────────────────────────────

describe('channelService.deleteChannel', () => {
  it('hard-deletes a channel', async () => {
    const channel = await channelService.createChannel({
      serverId,
      name: 'to-delete',
      slug: 'to-delete',
      type: 'TEXT',
      visibility: 'PRIVATE',
    });
    await channelService.deleteChannel(channel.id, serverId);
    const found = await prisma.channel.findUnique({ where: { id: channel.id } });
    expect(found).toBeNull();
  });

  it('throws NOT_FOUND for already-deleted or unknown channel', async () => {
    await expect(
      channelService.deleteChannel('00000000-0000-0000-0000-000000000000', serverId),
    ).rejects.toThrow(TRPCError);
  });

  it('throws NOT_FOUND when channelId belongs to a different server', async () => {
    const channel = await channelService.createChannel({
      serverId,
      name: 'cross-server-test',
      slug: `cross-server-${Date.now()}`,
      type: 'TEXT',
      visibility: 'PRIVATE',
    });
    const otherServer = await prisma.server.create({
      data: { name: 'Other Server 2', slug: `other-server2-${Date.now()}`, isPublic: false },
    });
    await expect(
      channelService.deleteChannel(channel.id, otherServer.id),
    ).rejects.toThrow(TRPCError);
    await prisma.server.delete({ where: { id: otherServer.id } }).catch(() => {});
    await channelService.deleteChannel(channel.id, serverId);
  });
});
