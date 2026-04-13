import { getPublicBaseUrl } from '@/lib/runtime-config';

export const revalidate = 3600;

/**
 * The frontend apex domain owns the crawler-facing robots.txt contract in
 * production. This route stays on the public host even if the backend still
 * generates transitional SEO payloads internally.
 */
export async function GET() {
  const body = [
    'User-agent: *',
    'Allow: /c/',
    'Disallow: /api/',
    'Disallow: /trpc/',
    `Sitemap: ${getPublicBaseUrl()}/sitemap.xml`,
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
