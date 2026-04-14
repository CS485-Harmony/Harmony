/**
 * Indexing service & SEO endpoint tests — Issue #107
 *
 * Covers sitemap generation for PUBLIC_INDEXABLE channels,
 * robots.txt endpoint, and sitemap updates on visibility changes.
 *
 * Requires DATABASE_URL pointing at a running Postgres instance
 * and REDIS_URL for cache tests.
 */

import { ChannelVisibility, ChannelType } from '@prisma/client';
import { prisma } from '../src/db/prisma';
import { indexingService } from '../src/services/indexing.service';
import { cacheService } from '../src/services/cache.service';
import { createApp } from '../src/app';
import request from 'supertest';

let serverId: string;
let serverSlug: string;
let userId: string;
let indexableChannelId: string;
let privateChannelId: string;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  app = createApp();

  const user = await prisma.user.create({
    data: {
      email: `sitemap-test-${Date.now()}@test.com`,
      username: `sitemap-test-${Date.now()}`,
      passwordHash: '$2a$10$placeholder',
      displayName: 'Sitemap Test User',
    },
  });
  userId = user.id;

  serverSlug = `sitemap-test-${Date.now()}`;
  const server = await prisma.server.create({
    data: {
      name: 'Sitemap Test Server',
      slug: serverSlug,
      isPublic: true,
      ownerId: userId,
    },
  });
  serverId = server.id;

  const indexableChannel = await prisma.channel.create({
    data: {
      serverId,
      name: 'public-channel',
      slug: 'public-channel',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
      position: 0,
    },
  });
  indexableChannelId = indexableChannel.id;

  const privateChannel = await prisma.channel.create({
    data: {
      serverId,
      name: 'private-channel',
      slug: 'private-channel',
      type: ChannelType.TEXT,
      visibility: ChannelVisibility.PRIVATE,
      position: 1,
    },
  });
  privateChannelId = privateChannel.id;
});

afterAll(async () => {
  await prisma.channel.deleteMany({ where: { serverId } });
  await prisma.server.delete({ where: { id: serverId } });
  await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});

describe('indexingService.generateSitemap', () => {
  it('generates a sitemap index that points crawlers at the frontend host', async () => {
    const xml = await indexingService.generateSitemapIndex();

    expect(xml).not.toBeNull();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain(`/sitemap/${serverSlug}`);
  });

  it('returns null for non-existent server', async () => {
    const result = await indexingService.generateSitemap('non-existent-server-slug');
    expect(result).toBeNull();
  });

  it('generates valid XML sitemap with PUBLIC_INDEXABLE channels only', async () => {
    const xml = await indexingService.generateSitemap(serverSlug);

    expect(xml).not.toBeNull();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain(`/c/${serverSlug}/public-channel`);
    expect(xml).not.toContain('private-channel');
    expect(xml).toContain('<changefreq>daily</changefreq>');
    expect(xml).toContain('<priority>0.7</priority>');
    expect(xml).toContain('<lastmod>');
  });

  it('returns empty urlset when server has no PUBLIC_INDEXABLE channels', async () => {
    // Create a server with no indexable channels
    const emptySlug = `empty-sitemap-${Date.now()}`;
    const emptyServer = await prisma.server.create({
      data: {
        name: 'Empty Server',
        slug: emptySlug,
        isPublic: true,
        ownerId: userId,
      },
    });

    const xml = await indexingService.generateSitemap(emptySlug);
    expect(xml).not.toBeNull();
    expect(xml).toContain('<urlset');
    expect(xml).not.toContain('<url>');

    await prisma.server.delete({ where: { id: emptyServer.id } });
  });
});

describe('indexingService.onVisibilityChanged', () => {
  let invalidateSpy: jest.SpyInstance;

  beforeEach(() => {
    invalidateSpy = jest.spyOn(cacheService, 'invalidate');
  });

  afterEach(() => {
    invalidateSpy.mockRestore();
  });

  it('invalidates sitemap cache when channel becomes PUBLIC_INDEXABLE', async () => {
    await indexingService.generateSitemap(serverSlug);

    await indexingService.onVisibilityChanged({
      channelId: privateChannelId,
      oldVisibility: 'PRIVATE',
      newVisibility: 'PUBLIC_INDEXABLE',
    });

    expect(invalidateSpy).toHaveBeenCalledWith(expect.stringContaining('sitemap:'));
  });

  it('invalidates sitemap cache when channel leaves PUBLIC_INDEXABLE', async () => {
    await indexingService.generateSitemap(serverSlug);

    await indexingService.onVisibilityChanged({
      channelId: indexableChannelId,
      oldVisibility: 'PUBLIC_INDEXABLE',
      newVisibility: 'PRIVATE',
    });

    expect(invalidateSpy).toHaveBeenCalledWith(expect.stringContaining('sitemap:'));
  });

  it('does not invalidate cache when visibility change does not involve PUBLIC_INDEXABLE', async () => {
    await indexingService.onVisibilityChanged({
      channelId: privateChannelId,
      oldVisibility: 'PRIVATE',
      newVisibility: 'PUBLIC_NO_INDEX',
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});

describe('GET /robots.txt', () => {
  it('returns robots.txt with correct directives', async () => {
    const res = await request(app).get('/robots.txt');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toContain('User-agent: *');
    expect(res.text).toContain('Allow: /c/');
    expect(res.text).toContain('Disallow: /api/');
    expect(res.text).toContain('Disallow: /trpc/');
    expect(res.text).toContain('Sitemap:');
  });
});

describe('GET /sitemap-index.xml', () => {
  it('returns the sitemap index for the frontend host', async () => {
    const res = await request(app).get('/sitemap-index.xml');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/xml/);
    expect(res.text).toContain(`/sitemap/${serverSlug}`);
  });
});

describe('GET /sitemap/:serverSlug.xml', () => {
  it('returns XML sitemap for valid server', async () => {
    const res = await request(app).get(`/sitemap/${serverSlug}.xml`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/xml/);
    expect(res.text).toContain('<?xml version="1.0"');
    expect(res.text).toContain(`/c/${serverSlug}/public-channel`);
    expect(res.text).not.toContain('private-channel');
  });

  it('returns 404 for non-existent server', async () => {
    const res = await request(app).get('/sitemap/non-existent-server.xml');

    expect(res.status).toBe(404);
  });
});
