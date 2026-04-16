/**
 * SEO routes — backend XML sources for sitemap.xml and robots.txt.
 *
 * The deployment architecture makes the frontend apex domain the canonical
 * crawler-facing SEO surface. These backend routes continue to generate the
 * underlying XML/text so frontend route handlers can proxy them on the public
 * host without asking crawlers to use the API subdomain directly.
 *
 * - GET /sitemap-index.xml       — sitemap index consumed by the frontend host
 * - GET /sitemap/:serverSlug.xml — dynamic sitemap of PUBLIC_INDEXABLE channels
 * - GET /robots.txt              — legacy/transitional robots directives
 */

import { Router, Request, Response } from 'express';
import { createLogger } from '../lib/logger';
import { indexingService } from '../services/indexing.service';

export const seoRouter = Router();
const logger = createLogger({ component: 'seo-router' });

seoRouter.get('/sitemap-index.xml', async (_req: Request, res: Response) => {
  try {
    const xml = await indexingService.generateSitemapIndex();
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=300');
    res.send(xml);
  } catch (err) {
    logger.error({ err }, 'Sitemap index generation failed');
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * GET /robots.txt
 * Instructs crawlers to allow /c/ routes (public channel pages).
 */
seoRouter.get('/robots.txt', (_req: Request, res: Response) => {
  const body = [
    'User-agent: *',
    'Allow: /c/',
    'Disallow: /api/',
    'Disallow: /trpc/',
    `Sitemap: ${process.env.BASE_URL ?? 'https://harmony.chat'}/sitemap.xml`,
  ].join('\n');

  res.set('Content-Type', 'text/plain');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(body);
});

/**
 * GET /sitemap/:serverSlug.xml
 * Returns a dynamic XML sitemap containing all PUBLIC_INDEXABLE channels
 * for the given server. The frontend proxies this route on the apex domain.
 */
seoRouter.get('/sitemap/:serverSlug.xml', async (req: Request, res: Response) => {
  try {
    const { serverSlug } = req.params;
    const xml = await indexingService.generateSitemap(serverSlug);

    if (!xml) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    logger.error({ err, serverSlug: req.params.serverSlug }, 'Sitemap generation failed');
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
