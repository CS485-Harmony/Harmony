import { proxySitemapXml } from '@/lib/sitemap-response';

// Next route segment config must stay a literal so the build can statically
// analyze it; keep this in sync with SITEMAP_REVALIDATE_SECONDS.
export const revalidate = 300;

interface RouteContext {
  params: Promise<unknown>;
}

/**
 * Per-server sitemap entrypoints stay on the frontend host and serve a cached
 * proxy of the backend XML generator, revalidating periodically, so crawlers
 * never need the API domain as the primary SEO surface.
 */
export async function GET(request: Request, context: RouteContext) {
  const params = context?.params ? await context.params : undefined;
  const { serverSlug } = (params ?? {}) as {
    serverSlug?: string | string[];
  };
  if (typeof serverSlug !== 'string') {
    return new Response('Sitemap not found.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return proxySitemapXml(request, `/sitemap/${encodeURIComponent(serverSlug)}.xml`);
}
