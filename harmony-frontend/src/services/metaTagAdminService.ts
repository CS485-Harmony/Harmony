import { cookies } from 'next/headers';
import { API_CONFIG } from '@/lib/constants';

export interface MetaTagPreview {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  keywords: string[];
  generatedAt: string;
  isCustom: boolean;
  generatedTitle: string;
  generatedDescription: string;
  customTitle: string | null;
  customDescription: string | null;
  customOgImage?: string | null;
  searchPreview: { title: string; description: string; url: string };
  socialPreview: { title: string; description: string; image: string };
}

export interface MetaTagJobAccepted {
  jobId: string;
  status: 'queued' | 'deduplicated';
  pollUrl: string;
}

export interface MetaTagJobStatus {
  jobId: string;
  channelId: string;
  status: 'queued' | 'processing' | 'succeeded' | 'failed';
  attempts: number;
  startedAt: string | null;
  completedAt: string | null;
  errorCode: string | null;
  errorMessage: string | null;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    throw new Error('Authentication required');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(await getAuthHeaders()),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // Ignore JSON parse failures and preserve the HTTP status fallback.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getMetaTagPreview(channelId: string): Promise<MetaTagPreview> {
  return requestJson<MetaTagPreview>(
    `/api/admin/channels/${encodeURIComponent(channelId)}/meta-tags`,
  );
}

export async function updateMetaTagOverrides(
  channelId: string,
  overrides: {
    customTitle?: string | null;
    customDescription?: string | null;
    customOgImage?: string | null;
  },
): Promise<MetaTagPreview> {
  return requestJson<MetaTagPreview>(
    `/api/admin/channels/${encodeURIComponent(channelId)}/meta-tags`,
    {
      method: 'PUT',
      body: JSON.stringify(overrides),
    },
  );
}

export async function triggerMetaTagRegeneration(channelId: string): Promise<MetaTagJobAccepted> {
  return requestJson<MetaTagJobAccepted>(
    `/api/admin/channels/${encodeURIComponent(channelId)}/meta-tags`,
    {
      method: 'POST',
    },
  );
}

export async function getMetaTagRegenerationStatus(
  channelId: string,
  jobId: string,
): Promise<MetaTagJobStatus> {
  return requestJson<MetaTagJobStatus>(
    `/api/admin/channels/${encodeURIComponent(channelId)}/meta-tags/jobs/${encodeURIComponent(jobId)}`,
  );
}
