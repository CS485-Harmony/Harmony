/**
 * MetaTag repository integration tests — Issue #352
 *
 * Verifies AC-7: background regeneration must never overwrite a non-null
 * customTitle or customDescription set by an admin.
 *
 * Requires DATABASE_URL pointing at a running Postgres instance.
 */

import { PrismaClient, ChannelVisibility } from '@prisma/client';
import { metaTagRepository } from '../src/repositories/metaTag.repository';

const prisma = new PrismaClient();
const ts = Date.now();

let userId: string;
let serverId: string;
let channelId: string;

const BASE_TAGS = {
  title: 'Generated Title',
  description: 'Generated description text',
  ogTitle: 'OG Generated Title',
  ogDescription: 'OG Generated description text',
  twitterCard: 'summary',
  keywords: 'test,channel',
  structuredData: { '@type': 'WebPage' },
  contentHash: 'abc123def456',
  needsRegeneration: false,
  generatedAt: new Date(),
};

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: `metatag-test-${ts}@test.local`,
      username: `metatag_${ts}`,
      passwordHash: 'hashed',
      displayName: 'MetaTag Tester',
    },
  });
  userId = user.id;

  const server = await prisma.server.create({
    data: {
      name: `MetaTag Test Server ${ts}`,
      slug: `metatag-srv-${ts}`,
      ownerId: userId,
    },
  });
  serverId = server.id;

  const channel = await prisma.channel.create({
    data: {
      serverId,
      name: 'meta-test-channel',
      slug: `meta-ch-${ts}`,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    },
  });
  channelId = channel.id;
});

afterAll(async () => {
  await prisma.generatedMetaTags.deleteMany({ where: { channelId } });
  await prisma.channel.delete({ where: { id: channelId } });
  await prisma.server.delete({ where: { id: serverId } });
  await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});

// ─── findByChannelId ────────────────────────────────────────────────────────

describe('metaTagRepository.findByChannelId', () => {
  it('returns null when no record exists', async () => {
    const result = await metaTagRepository.findByChannelId(channelId);
    expect(result).toBeNull();
  });
});

// ─── create & findByChannelId ───────────────────────────────────────────────

describe('metaTagRepository.create', () => {
  it('creates a meta tag record with no custom overrides', async () => {
    const created = await metaTagRepository.create({ channelId, ...BASE_TAGS });
    expect(created.channelId).toBe(channelId);
    expect(created.customTitle).toBeNull();
    expect(created.customDescription).toBeNull();
    expect(created.customOgImage).toBeNull();

    const found = await metaTagRepository.findByChannelId(channelId);
    expect(found).not.toBeNull();
    expect(found!.title).toBe('Generated Title');
  });
});

// ─── AC-7: saveGeneratedFields ──────────────────────────────────────────────

describe('metaTagRepository.saveGeneratedFields — AC-7', () => {
  const REGEN_FIELDS = {
    title: 'Regenerated Title',
    description: 'Regenerated description',
    ogTitle: 'OG Regenerated',
    ogDescription: 'OG Regenerated desc',
    twitterCard: 'summary',
    keywords: 'regen,test',
    structuredData: { '@type': 'WebPage', name: 'Regen' } as Record<string, unknown>,
    contentHash: 'regen_hash_789',
    needsRegeneration: false,
    generatedAt: new Date(),
  };

  it('AC-7: does not overwrite non-null customTitle set by admin', async () => {
    await metaTagRepository.updateCustomOverrides(channelId, {
      customTitle: 'Admin Custom Title',
    });

    await metaTagRepository.saveGeneratedFields(channelId, REGEN_FIELDS);

    const record = await metaTagRepository.findByChannelId(channelId);
    expect(record!.customTitle).toBe('Admin Custom Title');
    // Generated title field should NOT have been updated due to AC-7 guard
    expect(record!.title).toBe('Generated Title');
  });

  it('AC-7: does not overwrite non-null customDescription set by admin', async () => {
    await metaTagRepository.updateCustomOverrides(channelId, {
      customDescription: 'Admin Custom Description',
    });

    await metaTagRepository.saveGeneratedFields(channelId, REGEN_FIELDS);

    const record = await metaTagRepository.findByChannelId(channelId);
    expect(record!.customDescription).toBe('Admin Custom Description');
    expect(record!.title).toBe('Generated Title');
  });

  it('AC-7: updates generated fields when no custom overrides are set', async () => {
    // Clear overrides
    await metaTagRepository.updateCustomOverrides(channelId, {
      customTitle: null,
      customDescription: null,
    });

    const rowsUpdated = await metaTagRepository.saveGeneratedFields(channelId, REGEN_FIELDS);

    expect(rowsUpdated).toBe(1);
    const record = await metaTagRepository.findByChannelId(channelId);
    expect(record!.title).toBe('Regenerated Title');
    expect(record!.description).toBe('Regenerated description');
  });
});

// ─── updateCustomOverrides ──────────────────────────────────────────────────

describe('metaTagRepository.updateCustomOverrides', () => {
  it('can set and clear customOgImage', async () => {
    await metaTagRepository.updateCustomOverrides(channelId, {
      customOgImage: 'https://cdn.example.com/custom.png',
    });
    let record = await metaTagRepository.findByChannelId(channelId);
    expect(record!.customOgImage).toBe('https://cdn.example.com/custom.png');

    await metaTagRepository.updateCustomOverrides(channelId, { customOgImage: null });
    record = await metaTagRepository.findByChannelId(channelId);
    expect(record!.customOgImage).toBeNull();
  });
});
