import { GET as getRobots } from '@/app/robots.txt/route';
import { GET as getSitemapIndex } from '@/app/sitemap.xml/route';
import { GET as getLegacyServerSitemap } from '@/app/sitemap/[serverSlug]/route';
import { GET as getServerSitemap } from '@/app/sitemap/[serverSlug].xml/route';
import { SITEMAP_REVALIDATE_SECONDS } from '@/lib/sitemap-response';

const originalEnv = process.env;
const originalFetch = global.fetch;
const originalRequest = global.Request;
const originalResponse = global.Response;

class TestHeaders {
  private values = new Map<string, string>();

  constructor(init?: Record<string, string>) {
    Object.entries(init ?? {}).forEach(([key, value]) => {
      this.values.set(key.toLowerCase(), value);
    });
  }

  get(key: string): string | null {
    return this.values.get(key.toLowerCase()) ?? null;
  }
}

class TestResponse {
  readonly status: number;
  readonly ok: boolean;
  readonly headers: TestHeaders;
  readonly body: string;

  constructor(body = '', init: { status?: number; headers?: Record<string, string> } = {}) {
    this.body = body;
    this.status = init.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new TestHeaders(init.headers);
  }

  async text(): Promise<string> {
    return this.body;
  }
}

class TestRequest {
  constructor(public readonly url: string) {}
}

describe('frontend SEO route handlers', () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_BASE_URL: 'https://harmony.chat',
      NEXT_PUBLIC_API_URL: 'https://api.harmony.chat',
    };
    global.Request = TestRequest as unknown as typeof global.Request;
    global.Response = TestResponse as unknown as typeof global.Response;
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    global.Request = originalRequest;
    global.Response = originalResponse;
  });

  it('serves robots.txt from the frontend host with a sitemap directive', async () => {
    const response = await getRobots();

    expect(response.headers.get('content-type')).toContain('text/plain');
    await expect(response.text()).resolves.toContain('Sitemap: https://harmony.chat/sitemap.xml');
  });

  it('rewrites the sitemap index to the current frontend host', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(
        '<?xml version="1.0"?><sitemapindex><sitemap><loc>https://harmony.chat/sitemap/harmony-hq.xml</loc></sitemap></sitemapindex>',
        { status: 200 },
      ),
    );

    const response = await getSitemapIndex(new Request('http://localhost:3000/sitemap.xml'));

    expect(global.fetch).toHaveBeenCalledWith('https://api.harmony.chat/sitemap-index.xml', {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
    });
    await expect(response.text()).resolves.toContain(
      '<loc>http://localhost:3000/sitemap/harmony-hq.xml</loc>',
    );
    expect(response.headers.get('content-type')).toContain('application/xml');
  });

  it('proxies per-server sitemap XML from the backend API origin', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(
        '<?xml version="1.0"?><urlset><url><loc>https://harmony.chat/c/demo/general</loc></url></urlset>',
        { status: 200 },
      ),
    );

    const response = await getServerSitemap(new Request('https://harmony.chat/sitemap/demo.xml'), {
      params: Promise.resolve({ serverSlug: 'demo' }),
    });

    expect(global.fetch).toHaveBeenCalledWith('https://api.harmony.chat/sitemap/demo.xml', {
      next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
    });
    await expect(response.text()).resolves.toContain(
      '<loc>https://harmony.chat/c/demo/general</loc>',
    );
  });

  it('rewrites per-server sitemap XML to the current frontend host', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      new Response(
        '<?xml version="1.0"?><urlset><url><loc>https://harmony.chat/c/demo/general</loc></url></urlset>',
        { status: 200 },
      ),
    );

    const response = await getServerSitemap(new Request('http://localhost:3000/sitemap/demo.xml'), {
      params: Promise.resolve({ serverSlug: 'demo' }),
    });

    await expect(response.text()).resolves.toContain(
      '<loc>http://localhost:3000/c/demo/general</loc>',
    );
  });

  it('redirects legacy non-.xml sitemap URLs to the canonical endpoint', async () => {
    const response = await getLegacyServerSitemap(
      new Request('https://harmony.chat/sitemap/demo'),
      {
        params: Promise.resolve({ serverSlug: 'demo' }),
      },
    );

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe('https://harmony.chat/sitemap/demo.xml');
  });
});
