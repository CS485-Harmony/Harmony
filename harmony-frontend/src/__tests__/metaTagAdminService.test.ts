jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';
import {
  triggerMetaTagRegeneration,
  getMetaTagRegenerationStatus,
} from '@/services/metaTagAdminService';

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockFetch = jest.fn();

global.fetch = mockFetch as unknown as typeof fetch;

function makeCookieStore(token = 'test-auth-token') {
  return {
    get: jest.fn((name: string) => (name === 'auth_token' ? { value: token } : undefined)),
  };
}

function makeResponse(body: unknown, init: { ok?: boolean; status?: number } = {}): Response {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('metaTagAdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookies.mockResolvedValue(makeCookieStore() as never);
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  it('posts regeneration requests to the jobs endpoint', async () => {
    mockFetch.mockResolvedValue(
      makeResponse({
        jobId: 'job-1',
        status: 'queued',
        pollUrl: '/api/admin/channels/channel-1/meta-tags/jobs/job-1',
      }),
    );

    await triggerMetaTagRegeneration('channel/with space');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/admin/channels/channel%2Fwith%20space/meta-tags/jobs',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-auth-token',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    );
  });

  it('fetches regeneration status from the job-specific endpoint', async () => {
    mockFetch.mockResolvedValue(
      makeResponse({
        jobId: 'job-1',
        channelId: 'channel-1',
        status: 'succeeded',
        attempts: 1,
        startedAt: '2026-04-25T15:00:00.000Z',
        completedAt: '2026-04-25T15:00:01.000Z',
        errorCode: null,
        errorMessage: null,
      }),
    );

    await getMetaTagRegenerationStatus('channel-1', 'job-1');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/api/admin/channels/channel-1/meta-tags/jobs/job-1',
      {
        headers: {
          Authorization: 'Bearer test-auth-token',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    );
  });
});
