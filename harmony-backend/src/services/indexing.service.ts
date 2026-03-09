/**
 * IndexingService — manages sitemap data for PUBLIC_INDEXABLE channels.
 *
 * Provides:
 *   - addToSitemap(channelId)   — marks a channel for sitemap inclusion
 *   - removeFromSitemap(channelId) — removes a channel from sitemap
 *   - generateSitemap(serverSlug)  — builds XML sitemap for a server
 *
 * Listens to VISIBILITY_CHANGED events to keep sitemap data in sync.
 */

import { ChannelVisibility } from '@prisma/client';
import { prisma } from '../db/prisma';
import { cacheService, sanitizeKeySegment } from './cache.service';
import type { VisibilityChangedPayload } from '../events/eventTypes';

const SITEMAP_CACHE_TTL = 300; // 5 minutes
const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

export const CacheKeys_Sitemap = {
  serverSitemap: (serverSlug: string) => `sitemap:${sanitizeKeySegment(serverSlug)}`,
};

export const indexingService = {
  /**
   * Invalidate the sitemap cache for the channel's server so the channel
   * appears in the next generated sitemap.
   */
  async addToSitemap(channelId: string): Promise<void> {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true, server: { select: { slug: true } } },
    });
    if (!channel) return;

    await cacheService.invalidate(CacheKeys_Sitemap.serverSitemap(channel.server.slug));
  },

  /**
   * Remove a channel from the sitemap. Clears indexed_at and invalidates
   * the cached sitemap so the channel no longer appears on next generation.
   */
  async removeFromSitemap(channelId: string): Promise<void> {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true, server: { select: { slug: true } } },
    });
    if (!channel) return;

    await prisma.channel.update({
      where: { id: channelId },
      data: { indexedAt: null },
    });

    await cacheService.invalidate(CacheKeys_Sitemap.serverSitemap(channel.server.slug));
  },

  /**
   * Generate a sitemap XML string for all PUBLIC_INDEXABLE channels in a server.
   * Uses stale-while-revalidate caching via getOrRevalidate.
   */
  async generateSitemap(serverSlug: string): Promise<string | null> {
    const server = await prisma.server.findUnique({
      where: { slug: serverSlug },
      select: { id: true, slug: true },
    });

    if (!server) return null;

    const cacheKey = CacheKeys_Sitemap.serverSitemap(serverSlug);

    return cacheService.getOrRevalidate(
      cacheKey,
      async () => {
        const channels = await prisma.channel.findMany({
          where: {
            serverId: server.id,
            visibility: ChannelVisibility.PUBLIC_INDEXABLE,
          },
          orderBy: { position: 'asc' },
          select: {
            slug: true,
            updatedAt: true,
          },
        });
        return buildSitemapXml(server.slug, channels);
      },
      { ttl: SITEMAP_CACHE_TTL },
    );
  },

  /**
   * Handle a visibility change event — update sitemap accordingly.
   */
  async onVisibilityChanged(
    payload: Pick<VisibilityChangedPayload, 'channelId' | 'oldVisibility' | 'newVisibility'>,
  ): Promise<void> {
    if (payload.newVisibility === 'PUBLIC_INDEXABLE') {
      await this.addToSitemap(payload.channelId);
    } else if (payload.oldVisibility === 'PUBLIC_INDEXABLE') {
      await this.removeFromSitemap(payload.channelId);
    }
  },
};

function buildSitemapXml(
  serverSlug: string,
  channels: { slug: string; updatedAt: Date }[],
): string {
  const urls = channels
    .map(
      (ch) =>
        `  <url>\n    <loc>${escapeXml(BASE_URL)}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(ch.slug)}</loc>\n    <lastmod>${ch.updatedAt.toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
