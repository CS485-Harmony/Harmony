import { generateMetadata } from '@/app/c/[serverSlug]/[channelSlug]/page';
import {
  fetchPublicChannel,
  fetchPublicMetaTags,
  fetchPublicServer,
} from '@/services/publicApiService';
import { ChannelType, ChannelVisibility } from '@/types';

jest.mock('next/cache', () => ({ revalidatePath: jest.fn(), revalidateTag: jest.fn() }));

jest.mock('@/services/publicApiService', () => ({
  fetchPublicServer: jest.fn(),
  fetchPublicChannel: jest.fn(),
  fetchPublicMetaTags: jest.fn(),
}));

const mockFetchPublicServer = fetchPublicServer as jest.MockedFunction<typeof fetchPublicServer>;
const mockFetchPublicChannel = fetchPublicChannel as jest.MockedFunction<typeof fetchPublicChannel>;
const mockFetchPublicMetaTags = fetchPublicMetaTags as jest.MockedFunction<
  typeof fetchPublicMetaTags
>;

describe('public channel metadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prefers persisted SEO metadata over the fallback public channel values', async () => {
    mockFetchPublicServer.mockResolvedValue({
      id: 'server-1',
      name: 'Game Dev Hub',
      slug: 'game-dev-hub',
      createdAt: '2026-04-23T00:00:00.000Z',
    });
    mockFetchPublicChannel.mockResolvedValue({
      isPrivate: false,
      channel: {
        id: 'channel-1',
        serverId: 'server-1',
        name: 'unity',
        slug: 'unity',
        type: ChannelType.TEXT,
        visibility: ChannelVisibility.PUBLIC_INDEXABLE,
        topic: 'Fallback topic',
        position: 0,
        createdAt: '2026-04-23T00:00:00.000Z',
      },
    });
    mockFetchPublicMetaTags.mockResolvedValue({
      title: 'Custom SEO Title',
      description: 'Custom SEO Description',
      ogTitle: 'Custom OG Title',
      ogDescription: 'Custom OG Description',
      ogImage: 'https://example.com/custom.png',
      generatedAt: '2026-04-23T00:00:00.000Z',
      visibility: 'PUBLIC_INDEXABLE',
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ serverSlug: 'game-dev-hub', channelSlug: 'unity' }),
    });

    expect(metadata.title).toBe('Custom SEO Title');
    expect(metadata.description).toBe('Custom SEO Description');
    expect(metadata.openGraph).toMatchObject({
      title: 'Custom OG Title',
      description: 'Custom OG Description',
      images: [{ url: 'https://example.com/custom.png' }],
    });
  });
});
