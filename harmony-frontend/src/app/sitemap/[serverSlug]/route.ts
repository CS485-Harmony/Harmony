import { getApiBaseUrl } from '@/lib/runtime-config';
import { rewriteSitemapLocOrigins } from '@/lib/seo-sitemap';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ serverSlug: string }>;
}

/**
 * Per-server sitemap entrypoints stay on the frontend host and proxy the
 * backend XML generator at request time so crawlers never need the API domain
 * as the primary SEO surface.
 */
export async function GET(request: Request, context: RouteContext) {
  const { serverSlug } = await context.params;
  const response = await fetch(`${getApiBaseUrl()}/sitemap/${encodeURIComponent(serverSlug)}.xml`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return new Response('Sitemap not found.', {
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
