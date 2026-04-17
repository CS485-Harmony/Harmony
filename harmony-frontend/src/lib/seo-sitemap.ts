function getRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  url.pathname = '';
  url.search = '';
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}

export function rewriteSitemapLocOrigins(xml: string, request: Request): string {
  const requestUrl = new URL(getRequestOrigin(request));

  return xml.replace(/<loc>([^<]+)<\/loc>/g, (_match, rawUrl: string) => {
    try {
      const url = new URL(rawUrl);
      url.protocol = requestUrl.protocol;
      url.host = requestUrl.host;
      return `<loc>${url.toString()}</loc>`;
    } catch {
      return `<loc>${rawUrl}</loc>`;
    }
  });
}
