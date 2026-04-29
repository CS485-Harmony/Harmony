import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SeoPreviewSection } from '@/components/settings/SeoPreviewSection';
import {
  fetchSeoPreview,
  fetchSeoRegenerationStatus,
  saveSeoOverrides,
  triggerSeoRegeneration,
} from '@/app/settings/[serverSlug]/[channelSlug]/actions';

jest.mock('@/app/settings/[serverSlug]/[channelSlug]/actions', () => ({
  fetchSeoPreview: jest.fn(),
  fetchSeoRegenerationStatus: jest.fn(),
  saveSeoOverrides: jest.fn(),
  triggerSeoRegeneration: jest.fn(),
}));

const mockFetchSeoPreview = fetchSeoPreview as jest.MockedFunction<typeof fetchSeoPreview>;
const mockFetchSeoRegenerationStatus = fetchSeoRegenerationStatus as jest.MockedFunction<
  typeof fetchSeoRegenerationStatus
>;
const mockSaveSeoOverrides = saveSeoOverrides as jest.MockedFunction<typeof saveSeoOverrides>;
const mockTriggerSeoRegeneration = triggerSeoRegeneration as jest.MockedFunction<
  typeof triggerSeoRegeneration
>;

function buildPreview(overrides: Partial<Awaited<ReturnType<typeof fetchSeoPreview>>> = {}) {
  return {
    title: 'Generated title',
    description: 'Generated description',
    ogTitle: 'Generated title',
    ogDescription: 'Generated description',
    ogImage: 'https://example.com/og.png',
    keywords: ['harmony', 'seo'],
    generatedAt: '2026-04-23T14:00:00.000Z',
    isCustom: false,
    generatedTitle: 'Generated title',
    generatedDescription: 'Generated description',
    customTitle: null,
    customDescription: null,
    customOgImage: null,
    searchPreview: {
      title: 'Generated title',
      description: 'Generated description',
      url: 'https://harmony.chat/c/demo/general',
    },
    socialPreview: {
      title: 'Generated title',
      description: 'Generated description',
      image: 'https://example.com/og.png',
    },
    ...overrides,
  };
}

describe('SeoPreviewSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchSeoPreview.mockResolvedValue(buildPreview());
  });

  it('hides the override UI for non-admin viewers', () => {
    render(<SeoPreviewSection serverSlug='demo' channelSlug='general' canManageSeo={false} />);

    expect(screen.getByText(/only available to server admins/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save overrides/i })).not.toBeInTheDocument();
  });

  it('shows inline validation and submits valid overrides', async () => {
    mockSaveSeoOverrides.mockResolvedValue(
      buildPreview({
        title: 'Custom title',
        description: 'Custom description',
        isCustom: true,
        customTitle: 'Custom title',
        customDescription: 'Custom description',
        customOgImage: 'https://example.com/custom-og.png',
        searchPreview: {
          title: 'Custom title',
          description: 'Custom description',
          url: 'https://harmony.chat/c/demo/general',
        },
        socialPreview: {
          title: 'Custom title',
          description: 'Custom description',
          image: 'https://example.com/og.png',
        },
      }),
    );

    render(<SeoPreviewSection serverSlug='demo' channelSlug='general' canManageSeo />);

    const titleInput = await screen.findByLabelText(/custom title/i);
    const descriptionInput = screen.getByLabelText(/custom description/i);
    const ogImageInput = screen.getByLabelText(/custom social image url/i);
    const saveButton = screen.getByRole('button', { name: /save overrides/i });

    fireEvent.change(titleInput, { target: { value: 'x'.repeat(71) } });
    expect(screen.getByText(/70 characters or fewer/i)).toBeInTheDocument();
    expect(saveButton).toBeDisabled();

    fireEvent.change(titleInput, { target: { value: 'Custom title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Custom description' } });
    fireEvent.change(ogImageInput, { target: { value: 'https://example.com/custom-og.png' } });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockSaveSeoOverrides).toHaveBeenCalledWith('demo', 'general', {
        customTitle: 'Custom title',
        customDescription: 'Custom description',
        customOgImage: 'https://example.com/custom-og.png',
      }),
    );

    expect(await screen.findByText('Custom override active')).toBeInTheDocument();
  });

  it('polls regeneration status until the job succeeds and refreshes the preview', async () => {
    jest.useFakeTimers();
    mockTriggerSeoRegeneration.mockResolvedValue({
      jobId: 'job-1',
      status: 'queued',
      pollUrl: '/api/admin/channels/channel-1/meta-tags/jobs/job-1',
    });
    mockFetchSeoRegenerationStatus
      .mockResolvedValueOnce({
        jobId: 'job-1',
        channelId: 'channel-1',
        status: 'queued',
        attempts: 0,
        startedAt: null,
        completedAt: null,
        errorCode: null,
        errorMessage: null,
      })
      .mockResolvedValueOnce({
        jobId: 'job-1',
        channelId: 'channel-1',
        status: 'processing',
        attempts: 1,
        startedAt: '2026-04-23T14:00:01.000Z',
        completedAt: null,
        errorCode: null,
        errorMessage: null,
      })
      .mockResolvedValueOnce({
        jobId: 'job-1',
        channelId: 'channel-1',
        status: 'succeeded',
        attempts: 1,
        startedAt: '2026-04-23T14:00:01.000Z',
        completedAt: '2026-04-23T14:00:02.000Z',
        errorCode: null,
        errorMessage: null,
      });
    mockFetchSeoPreview.mockResolvedValueOnce(buildPreview()).mockResolvedValueOnce(
      buildPreview({
        title: 'Regenerated title',
        description: 'Regenerated description',
        generatedTitle: 'Regenerated title',
        generatedDescription: 'Regenerated description',
        searchPreview: {
          title: 'Regenerated title',
          description: 'Regenerated description',
          url: 'https://harmony.chat/c/demo/general',
        },
        socialPreview: {
          title: 'Regenerated title',
          description: 'Regenerated description',
          image: 'https://example.com/og.png',
        },
      }),
    );

    render(<SeoPreviewSection serverSlug='demo' channelSlug='general' canManageSeo />);

    fireEvent.click(await screen.findByRole('button', { name: /regenerate metadata/i }));

    await waitFor(() => expect(mockFetchSeoRegenerationStatus).toHaveBeenCalledTimes(1));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    await waitFor(() => expect(mockFetchSeoRegenerationStatus).toHaveBeenCalledTimes(2));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    await waitFor(() => expect(mockFetchSeoRegenerationStatus).toHaveBeenCalledTimes(3));
    await waitFor(() => expect(mockFetchSeoPreview).toHaveBeenCalledTimes(2));
    expect(await screen.findAllByText('Regenerated title')).toHaveLength(3);
    expect(screen.getByText(/succeeded/i)).toBeInTheDocument();

    jest.useRealTimers();
  });
});
