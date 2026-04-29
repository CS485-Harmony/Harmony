/**
 * Next.js API route: Tenor GIF proxy
 * Keeps TENOR_API_KEY server-side; exposes ?q= (search) or no params (trending).
 * Requires an authenticated session (auth_token cookie) to prevent anonymous
 * API-key exhaustion. Returns { id, title, url, previewUrl }[].
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const TENOR_BASE = 'https://tenor.googleapis.com/v2';
const RESULTS_LIMIT = 24;

interface TenorMediaFormats {
  gif?: { url: string };
  tinygif?: { url: string };
  nanogif?: { url: string };
}

interface TenorResult {
  id: string;
  title: string;
  media_formats: TenorMediaFormats;
}

interface TenorResponse {
  results: TenorResult[];
}

export interface GifResult {
  id: string;
  title: string;
  /** Full-quality GIF URL inserted into the message */
  url: string;
  /** Small preview URL shown in the picker grid */
  previewUrl: string;
}

function mapResult(r: TenorResult): GifResult {
  return {
    id: r.id,
    title: r.title,
    url: r.media_formats.gif?.url ?? r.media_formats.tinygif?.url ?? '',
    previewUrl: r.media_formats.tinygif?.url ?? r.media_formats.nanogif?.url ?? r.media_formats.gif?.url ?? '',
  };
}

export async function GET(req: NextRequest) {
  // Require an authenticated session to prevent anonymous API-key exhaustion.
  const cookieStore = await cookies();
  if (!cookieStore.get('auth_token')?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.TENOR_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GIF search is not configured' }, { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  const query = searchParams.get('q')?.trim();

  const params = new URLSearchParams({
    key: apiKey,
    limit: String(RESULTS_LIMIT),
    media_filter: 'gif,tinygif,nanogif',
    contentfilter: 'medium',
  });

  const endpoint = query
    ? `${TENOR_BASE}/search?${params}&q=${encodeURIComponent(query)}`
    : `${TENOR_BASE}/featured?${params}`;

  try {
    const res = await fetch(endpoint, { next: { revalidate: 60 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Tenor API error' }, { status: 502 });
    }
    const data: TenorResponse = await res.json();
    const gifs: GifResult[] = data.results.map(mapResult).filter(g => g.url);
    return NextResponse.json({ gifs });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch GIFs' }, { status: 500 });
  }
}
