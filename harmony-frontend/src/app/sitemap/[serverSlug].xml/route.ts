import { proxySitemapXml, SITEMAP_REVALIDATE_SECONDS } from '@/lib/sitemap-response';

export const revalidate = SITEMAP_REVALIDATE_SECONDS;

interface RouteContext {
  params: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Per-server sitemap entrypoints stay on the frontend host and proxy the
 * backend XML generator at request time so crawlers never need the API domain
 * as the primary SEO surface.
 */
export async function GET(request: Request, context: RouteContext) {
  const serverSlug = (await context.params).serverSlug;
  if (typeof serverSlug !== 'string') {
    return new Response('Sitemap not found.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return proxySitemapXml(request, `/sitemap/${encodeURIComponent(serverSlug)}.xml`);
}
