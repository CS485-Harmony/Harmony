import { API_CONFIG } from '@/lib/constants';

export interface PublicMessageSearchResult {
  id: string;
  content: string;
  context: string;
  createdAt: string;
  editedAt?: string | null;
  author: { id: string; username: string };
}

export interface PublicMessageSearchResponse {
  results: PublicMessageSearchResult[];
  query: string;
  limit: number;
}

const EMPTY_LIMIT = 20;

function emptySearchResult(query: string): PublicMessageSearchResponse {
  return { results: [], query, limit: EMPTY_LIMIT };
}

export async function searchPublicChannelMessages(
  channelId: string,
  query: string,
): Promise<PublicMessageSearchResponse> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return emptySearchResult('');

  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/public/channels/${encodeURIComponent(channelId)}/messages/search?q=${encodeURIComponent(trimmedQuery)}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return emptySearchResult(trimmedQuery);
    return (await res.json()) as PublicMessageSearchResponse;
  } catch {
    return emptySearchResult(trimmedQuery);
  }
}
