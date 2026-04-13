import express from 'express';
import request from 'supertest';

jest.mock('../src/services/indexing.service', () => ({
  indexingService: {
    generateSitemapIndex: jest.fn(),
    generateSitemap: jest.fn(),
  },
}));

import { seoRouter } from '../src/routes/seo.router';
import { indexingService } from '../src/services/indexing.service';

const mockIndexingService = indexingService as unknown as {
  generateSitemapIndex: jest.Mock;
  generateSitemap: jest.Mock;
};

describe('seoRouter', () => {
  const app = express();
  app.use(seoRouter);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a sitemap index sourced from indexingService', async () => {
    mockIndexingService.generateSitemapIndex.mockResolvedValue(
      '<?xml version="1.0"?><sitemapindex />',
    );

    const res = await request(app).get('/sitemap-index.xml');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/xml/);
    expect(res.headers['cache-control']).toContain('max-age=300');
    expect(res.text).toContain('<sitemapindex');
  });

  it('returns a per-server sitemap sourced from indexingService', async () => {
    mockIndexingService.generateSitemap.mockResolvedValue('<?xml version="1.0"?><urlset />');

    const res = await request(app).get('/sitemap/demo.xml');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/xml/);
    expect(mockIndexingService.generateSitemap).toHaveBeenCalledWith('demo');
  });

  it('includes the frontend sitemap entrypoint in robots.txt', async () => {
    const res = await request(app).get('/robots.txt');

    expect(res.status).toBe(200);
    expect(res.text).toContain('User-agent: *');
    expect(res.text).toContain('Sitemap: https://harmony.chat/sitemap.xml');
  });
});
