/**
 * IndexingService — manages sitemap data for PUBLIC_INDEXABLE channels.
 *
 * Provides:
 *   - addToSitemap(channelId)   — marks a channel for sitemap inclusion
 *   - removeFromSitemap(channelId) — removes a channel from sitemap
 *   - generateSitemapIndex() — builds the sitemap index consumed by the frontend
 *   - generateSitemap(serverSlug)  — builds XML sitemap for a server
 *
 * Listens to VISIBILITY_CHANGED events to keep sitemap data in sync.
 */

import { cacheService, sanitizeKeySegment } from './cache.service';
import type { VisibilityChangedPayload } from '../events/eventTypes';
import { channelRepository } from '../repositories/channel.repository';
import { serverRepository } from '../repositories/server.repository';

const SITEMAP_CACHE_TTL = 300; // 5 minutes
const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

export const CacheKeys_Sitemap = {
  index: 'sitemap:index',
  serverSitemap: (serverSlug: string) => `sitemap:${sanitizeKeySegment(serverSlug)}`,
};

export const indexingService = {
  /**
   * Generate the sitemap index consumed by the frontend apex-domain route
   * handler. The backend remains the XML producer, while the frontend owns the
   * crawler-facing hostname in production.
   */
  async generateSitemapIndex(): Promise<string> {
    return cacheService.getOrRevalidate(
      CacheKeys_Sitemap.index,
      async () => {
        const servers = await serverRepository.findPublicBySlugSelect();
        return buildSitemapIndexXml(servers.map((server) => server.slug));
      },
      { ttl: SITEMAP_CACHE_TTL },
    );
  },

  /**
   * Invalidate the sitemap cache for the channel's server so the channel
   * appears in the next generated sitemap.
   */
  async addToSitemap(channelId: string): Promise<void> {
    const channel = await channelRepository.findForSitemap(channelId);
    if (!channel) return;

    await cacheService.invalidate(CacheKeys_Sitemap.serverSitemap(channel.server.slug));
  },

  /**
   * Remove a channel from the sitemap. Clears indexed_at and invalidates
   * the cached sitemap so the channel no longer appears on next generation.
   */
  async removeFromSitemap(channelId: string): Promise<void> {
    const channel = await channelRepository.findForSitemap(channelId);
    if (!channel) return;

    await channelRepository.update(channelId, { indexedAt: null });

    await cacheService.invalidate(CacheKeys_Sitemap.serverSitemap(channel.server.slug));
  },

  /**
   * Generate a sitemap XML string for all PUBLIC_INDEXABLE channels in a server.
   * Uses stale-while-revalidate caching via getOrRevalidate.
   */
  async generateSitemap(serverSlug: string): Promise<string | null> {
    const server = await serverRepository.findBySlugSelect(serverSlug, { id: true, slug: true });

    if (!server) return null;

    const cacheKey = CacheKeys_Sitemap.serverSitemap(serverSlug);

    return cacheService.getOrRevalidate(
      cacheKey,
      async () => {
        const channels = await channelRepository.findPublicIndexableByServerId(server.id);
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

function buildSitemapIndexXml(serverSlugs: string[]): string {
  const sitemaps = serverSlugs
    .map(
      (serverSlug) =>
        `  <sitemap>\n    <loc>${escapeXml(BASE_URL)}/sitemap/${encodeURIComponent(serverSlug)}.xml</loc>\n  </sitemap>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
