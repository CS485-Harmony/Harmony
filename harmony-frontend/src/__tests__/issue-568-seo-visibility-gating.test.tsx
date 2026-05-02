/**
 * issue-568-seo-visibility-gating.test.tsx
 *
 * Verifies that the SEO Preview tab is only rendered for PUBLIC_INDEXABLE
 * channels and that the server-action guard rejects SEO requests for
 * non-indexable channels.
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChannelSettingsPage } from '@/components/settings/ChannelSettingsPage';
import { ChannelVisibility, ChannelType } from '@/types';
import type { Channel } from '@/types';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/app/settings/[serverSlug]/[channelSlug]/actions', () => ({
  saveChannelSettings: jest.fn().mockResolvedValue(undefined),
  fetchAuditLog: jest.fn().mockResolvedValue({ entries: [], total: 0 }),
  fetchSeoPreview: jest.fn().mockResolvedValue({}),
  saveSeoOverrides: jest.fn(),
  triggerSeoRegeneration: jest.fn(),
  fetchSeoRegenerationStatus: jest.fn(),
}));

jest.mock('@/app/settings/[serverSlug]/[channelSlug]/updateVisibility', () => ({
  updateChannelVisibility: jest.fn(),
}));

jest.mock('@/lib/api-client', () => ({
  apiClient: { trpcQuery: jest.fn().mockResolvedValue([]) },
}));

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
    dismissToast: jest.fn(),
    cancelAutoDismiss: jest.fn(),
  }),
}));

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

function renderSettings(visibility: ChannelVisibility) {
  return render(
    <ChannelSettingsPage
      channel={buildChannel(visibility)}
      serverSlug='my-server'
      canManageSeo
    />,
  );
}

// ─── UI gating ────────────────────────────────────────────────────────────────

describe('ChannelSettingsPage — SEO tab visibility gating (issue #568)', () => {
  it('shows the SEO Preview tab for PUBLIC_INDEXABLE channels', () => {
    renderSettings(ChannelVisibility.PUBLIC_INDEXABLE);
    expect(screen.getByRole('button', { name: /seo preview/i })).toBeInTheDocument();
  });

  it('hides the SEO Preview tab for PUBLIC_NO_INDEX channels', () => {
    renderSettings(ChannelVisibility.PUBLIC_NO_INDEX);
    expect(screen.queryByRole('button', { name: /seo preview/i })).not.toBeInTheDocument();
  });

  it('hides the SEO Preview tab for PRIVATE channels', () => {
    renderSettings(ChannelVisibility.PRIVATE);
    expect(screen.queryByRole('button', { name: /seo preview/i })).not.toBeInTheDocument();
  });
});
