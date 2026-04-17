import { getApiBaseUrl } from '@/lib/runtime-config';
import { rewriteSitemapLocOrigins } from '@/lib/seo-sitemap';

export const dynamic = 'force-dynamic';

/**
 * The crawler-facing sitemap index lives on the frontend apex host. The XML is
 * still sourced from the backend so the backend remains the data producer while
 * the frontend owns the public SEO entrypoint.
 */
export async function GET(request: Request) {
  const response = await fetch(`${getApiBaseUrl()}/sitemap-index.xml`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return new Response('Unable to generate sitemap index.', {
      status: response.status === 404 ? 404 : 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const xml = await response.text();

  return new Response(rewriteSitemapLocOrigins(xml, request), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=300',
    },
  });
}
