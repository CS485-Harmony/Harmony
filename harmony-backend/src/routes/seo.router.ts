/**
 * SEO routes — sitemap.xml and robots.txt endpoints.
 *
 * - GET /sitemap/:serverSlug.xml — dynamic sitemap of PUBLIC_INDEXABLE channels
 * - GET /robots.txt              — allow crawling of /c/ routes
 */

import { Router, Request, Response } from 'express';
import { indexingService } from '../services/indexing.service';

export const seoRouter = Router();

/**
 * GET /robots.txt
 * Instructs crawlers to allow /c/ routes (public channel pages).
 *
 * NOTE: A machine-readable `Sitemap:` directive requires a sitemap index
 * endpoint (e.g. /sitemap-index.xml) that aggregates per-server sitemaps.
 * This is tracked as a follow-up — see issue #107 comments.
 */
seoRouter.get('/robots.txt', (_req: Request, res: Response) => {
  const body = [
    'User-agent: *',
    'Allow: /c/',
    'Disallow: /api/',
    'Disallow: /trpc/',
  ].join('\n');

  res.set('Content-Type', 'text/plain');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(body);
});

/**
 * GET /sitemap/:serverSlug.xml
 * Returns a dynamic XML sitemap containing all PUBLIC_INDEXABLE channels
 * for the given server.
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
    console.error('Sitemap generation error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
