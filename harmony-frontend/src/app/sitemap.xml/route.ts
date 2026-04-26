import { proxySitemapXml } from '@/lib/sitemap-response';

// Next route segment config must stay a literal so the build can statically
// analyze it; keep this in sync with SITEMAP_REVALIDATE_SECONDS.
export const revalidate = 300;

/**
 * The crawler-facing sitemap index lives on the frontend apex host. The XML is
 * still sourced from the backend so the backend remains the data producer while
 * the frontend owns the public SEO entrypoint.
 */
export async function GET(request: Request) {
  return proxySitemapXml(request, '/sitemap-index.xml');
}
