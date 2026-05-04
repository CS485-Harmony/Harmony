/**
 * issue-568-seo-action-guard.test.ts
 *
 * Verifies that server actions backed by resolveChannelForSeo reject requests
 * for non-PUBLIC_INDEXABLE channels.
 */

import { ChannelVisibility, ChannelType } from '@/types';
import type { Channel } from '@/types';

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGetChannel = jest.fn();
const mockGetMetaTagPreview = jest.fn();
const mockUpdateMetaTagOverrides = jest.fn();
const mockTriggerMetaTagRegeneration = jest.fn();
const mockGetMetaTagRegenerationStatus = jest.fn();

jest.mock('@/services/channelService', () => ({
  getChannel: (...args: unknown[]) => mockGetChannel(...args),
  getAuditLog: jest.fn(),
  updateChannel: jest.fn(),
}));

jest.mock('@/services/serverService', () => ({
  getServer: jest.fn(),
}));

jest.mock('@/services/metaTagAdminService', () => ({
  getMetaTagPreview: (...args: unknown[]) => mockGetMetaTagPreview(...args),
  updateMetaTagOverrides: (...args: unknown[]) => mockUpdateMetaTagOverrides(...args),
  triggerMetaTagRegeneration: (...args: unknown[]) => mockTriggerMetaTagRegeneration(...args),
  getMetaTagRegenerationStatus: (...args: unknown[]) =>
    mockGetMetaTagRegenerationStatus(...args),
}));

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildChannel(visibility: ChannelVisibility): Channel {
  return {
    id: 'ch-1',
    serverId: 'srv-1',
    name: 'general',
    slug: 'general',
    type: ChannelType.TEXT,
    visibility,
    position: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('resolveChannelForSeo guard (issue #568)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSeoPreview', () => {
    it('rejects for PUBLIC_NO_INDEX', async () => {
      const { fetchSeoPreview } = await import(
        '@/app/settings/[serverSlug]/[channelSlug]/actions'
      );
      mockGetChannel.mockResolvedValue(buildChannel(ChannelVisibility.PUBLIC_NO_INDEX));
      await expect(fetchSeoPreview('my-server', 'general')).rejects.toThrow(
        /only available for PUBLIC_INDEXABLE/i,
      );
    });

    it('rejects for PRIVATE', async () => {
      const { fetchSeoPreview } = await import(
        '@/app/settings/[serverSlug]/[channelSlug]/actions'
      );
      mockGetChannel.mockResolvedValue(buildChannel(ChannelVisibility.PRIVATE));
      await expect(fetchSeoPreview('my-server', 'general')).rejects.toThrow(
        /only available for PUBLIC_INDEXABLE/i,
      );
    });

    it('succeeds for PUBLIC_INDEXABLE', async () => {
      const { fetchSeoPreview } = await import(
        '@/app/settings/[serverSlug]/[channelSlug]/actions'
      );
      mockGetChannel.mockResolvedValue(buildChannel(ChannelVisibility.PUBLIC_INDEXABLE));
      mockGetMetaTagPreview.mockResolvedValue({ title: 'Title' });
      await expect(fetchSeoPreview('my-server', 'general')).resolves.toBeDefined();
    });
  });

  describe('saveSeoOverrides', () => {
    it('rejects for PRIVATE channels', async () => {
      const { saveSeoOverrides } = await import(
        '@/app/settings/[serverSlug]/[channelSlug]/actions'
      );
      mockGetChannel.mockResolvedValue(buildChannel(ChannelVisibility.PRIVATE));
      await expect(saveSeoOverrides('my-server', 'general', {})).rejects.toThrow(
        /only available for PUBLIC_INDEXABLE/i,
      );
    });
  });

  describe('triggerSeoRegeneration', () => {
    it('rejects for PUBLIC_NO_INDEX channels', async () => {
      const { triggerSeoRegeneration } = await import(
        '@/app/settings/[serverSlug]/[channelSlug]/actions'
      );
      mockGetChannel.mockResolvedValue(buildChannel(ChannelVisibility.PUBLIC_NO_INDEX));
      await expect(triggerSeoRegeneration('my-server', 'general')).rejects.toThrow(
        /only available for PUBLIC_INDEXABLE/i,
      );
    });
  });
});
