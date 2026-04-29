import { getApiBaseUrl } from '@/lib/runtime-config';
import { rewriteSitemapLocOrigins } from '@/lib/seo-sitemap';

export const SITEMAP_REVALIDATE_SECONDS = 300;

const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': `public, max-age=${SITEMAP_REVALIDATE_SECONDS}, stale-while-revalidate=${SITEMAP_REVALIDATE_SECONDS}`,
};

/**
 * Cache sitemap responses via frontend/platform caching so transient backend
 * failures do not turn every crawler request into a live dependency on the API
 * origin.
 */
export async function proxySitemapXml(request: Request, apiPath: string): Promise<Response> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${apiPath}`, {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
    });
  } catch {
    return new Response('Unable to reach sitemap source.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  if (!response.ok) {
    return new Response(
      response.status === 404 ? 'Sitemap not found.' : 'Unable to generate sitemap.',
      {
        status: response.status === 404 ? 404 : 502,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      },
    );
  }

  const xml = await response.text();

  return new Response(rewriteSitemapLocOrigins(xml, request), {
    headers: XML_HEADERS,
  });
}
