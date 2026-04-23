'use client';

import { useEffect, useRef, useState } from 'react';
import { getUserErrorMessage, cn } from '@/lib/utils';
import {
  fetchSeoPreview,
  fetchSeoRegenerationStatus,
  saveSeoOverrides,
  triggerSeoRegeneration,
} from '@/app/settings/[serverSlug]/[channelSlug]/actions';
import type { MetaTagJobStatus, MetaTagPreview } from '@/services/metaTagAdminService';

const TITLE_MAX = 70;
const DESCRIPTION_MAX = 200;
const OG_IMAGE_MAX = 500;

function buildValidationError(value: string, max: number, label: string): string | null {
  if (value.length <= max) return null;
  return `${label} must be ${max} characters or fewer`;
}

function StatusBadge({ status }: { status: MetaTagJobStatus['status'] }) {
  const tones: Record<MetaTagJobStatus['status'], string> = {
    queued: 'bg-amber-500/15 text-amber-200',
    processing: 'bg-blue-500/15 text-blue-200',
    succeeded: 'bg-emerald-500/15 text-emerald-200',
    failed: 'bg-red-500/15 text-red-200',
  };

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize',
        tones[status],
      )}
    >
      {status}
    </span>
  );
}

interface SeoPreviewSectionProps {
  serverSlug: string;
  channelSlug: string;
  canManageSeo: boolean;
}

export function SeoPreviewSection({
  serverSlug,
  channelSlug,
  canManageSeo,
}: SeoPreviewSectionProps) {
  const [preview, setPreview] = useState<MetaTagPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customOgImage, setCustomOgImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [jobStatus, setJobStatus] = useState<MetaTagJobStatus | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const titleError = buildValidationError(customTitle, TITLE_MAX, 'Custom title');
  const descriptionError = buildValidationError(
    customDescription,
    DESCRIPTION_MAX,
    'Custom description',
  );
  const ogImageError = buildValidationError(customOgImage, OG_IMAGE_MAX, 'Custom image URL');

  useEffect(() => {
    if (!canManageSeo) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPreview() {
      setLoading(true);
      setError(null);
      try {
        const nextPreview = await fetchSeoPreview(serverSlug, channelSlug);
        if (cancelled) return;
        setPreview(nextPreview);
        setCustomTitle(nextPreview.customTitle ?? '');
        setCustomDescription(nextPreview.customDescription ?? '');
        setCustomOgImage(nextPreview.customOgImage ?? '');
      } catch (err) {
        if (cancelled) return;
        setError(getUserErrorMessage(err, 'Failed to load SEO preview.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPreview();
    return () => {
      cancelled = true;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [serverSlug, channelSlug, canManageSeo]);

  async function refreshPreview() {
    const nextPreview = await fetchSeoPreview(serverSlug, channelSlug);
    setPreview(nextPreview);
    setCustomTitle(nextPreview.customTitle ?? '');
    setCustomDescription(nextPreview.customDescription ?? '');
    setCustomOgImage(nextPreview.customOgImage ?? '');
  }

  async function handleSave() {
    if (titleError || descriptionError || ogImageError) return;
    setSaving(true);
    setError(null);
    try {
      const nextPreview = await saveSeoOverrides(serverSlug, channelSlug, {
        customTitle: customTitle.trim() ? customTitle : null,
        customDescription: customDescription.trim() ? customDescription : null,
        customOgImage: customOgImage.trim() ? customOgImage.trim() : null,
      });
      setPreview(nextPreview);
      setCustomTitle(nextPreview.customTitle ?? '');
      setCustomDescription(nextPreview.customDescription ?? '');
      setCustomOgImage(nextPreview.customOgImage ?? '');
    } catch (err) {
      setError(getUserErrorMessage(err, 'Failed to save SEO overrides.'));
    } finally {
      setSaving(false);
    }
  }

  async function pollJob(jobId: string) {
    try {
      const status = await fetchSeoRegenerationStatus(serverSlug, channelSlug, jobId);
      setJobStatus(status);
      if (status.status === 'queued' || status.status === 'processing') {
        pollTimerRef.current = setTimeout(() => void pollJob(jobId), 300);
        return;
      }
      if (status.status === 'succeeded') {
        await refreshPreview();
      }
    } catch (err) {
      setError(getUserErrorMessage(err, 'Failed to fetch regeneration status.'));
    }
  }

  async function handleRegenerate() {
    setError(null);
    try {
      const accepted = await triggerSeoRegeneration(serverSlug, channelSlug);
      setJobStatus({
        jobId: accepted.jobId,
        channelId: 'pending',
        status: accepted.status === 'deduplicated' ? 'queued' : accepted.status,
        attempts: 0,
        startedAt: null,
        completedAt: null,
        errorCode: null,
        errorMessage: null,
      });
      await pollJob(accepted.jobId);
    } catch (err) {
      setError(getUserErrorMessage(err, 'Failed to regenerate SEO preview.'));
    }
  }

  if (!canManageSeo) {
    return <p className='text-sm text-gray-400'>SEO preview is only available to server admins.</p>;
  }

  if (loading) {
    return <p className='text-sm text-gray-400'>Loading SEO preview…</p>;
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <div>
        <h2 className='mb-1 text-xl font-semibold text-white'>SEO Preview</h2>
        <p className='text-sm text-gray-400'>
          Review the generated metadata, override title or description, and trigger a manual
          refresh.
        </p>
      </div>

      {error && (
        <p role='alert' className='text-sm text-red-400'>
          {error}
        </p>
      )}

      {preview && (
        <>
          <div className='grid gap-4 lg:grid-cols-2'>
            <div className='rounded-lg border border-[#40444b] bg-[#2b2d31] p-4'>
              <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400'>
                Generated Values
              </p>
              <dl className='space-y-3 text-sm'>
                <div>
                  <dt className='text-gray-500'>Generated title</dt>
                  <dd className='text-white'>{preview.generatedTitle}</dd>
                </div>
                <div>
                  <dt className='text-gray-500'>Generated description</dt>
                  <dd className='text-white'>{preview.generatedDescription}</dd>
                </div>
                <div>
                  <dt className='text-gray-500'>Last generated</dt>
                  <dd className='text-white'>{new Date(preview.generatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            <div className='rounded-lg border border-[#40444b] bg-[#2b2d31] p-4'>
              <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400'>
                Active Overrides
              </p>
              <dl className='space-y-3 text-sm'>
                <div>
                  <dt className='text-gray-500'>Custom title</dt>
                  <dd className='text-white'>{preview.customTitle || 'Using generated title'}</dd>
                </div>
                <div>
                  <dt className='text-gray-500'>Custom description</dt>
                  <dd className='text-white'>
                    {preview.customDescription || 'Using generated description'}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>Current mode</dt>
                  <dd className='text-white'>
                    {preview.isCustom ? 'Custom override active' : 'Generated only'}
                  </dd>
                </div>
                <div>
                  <dt className='text-gray-500'>Custom social image</dt>
                  <dd className='text-white'>{preview.customOgImage || 'Using generated image'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className='grid gap-4 lg:grid-cols-2'>
            <div className='rounded-lg border border-[#40444b] bg-[#2b2d31] p-4'>
              <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400'>
                Search Preview
              </p>
              <div className='space-y-1 rounded-md bg-[#1e1f22] p-4'>
                <p className='truncate text-sm text-[#8ab4f8]'>{preview.searchPreview.url}</p>
                <p className='text-lg text-[#99c3ff]'>{preview.searchPreview.title}</p>
                <p className='text-sm text-gray-300'>{preview.searchPreview.description}</p>
              </div>
            </div>

            <div className='rounded-lg border border-[#40444b] bg-[#2b2d31] p-4'>
              <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400'>
                Social Preview
              </p>
              <div className='space-y-3 rounded-md bg-[#1e1f22] p-4'>
                {preview.socialPreview.image && (
                  <div className='rounded bg-[#36393f] px-3 py-2 text-xs text-gray-300'>
                    Image: {preview.socialPreview.image}
                  </div>
                )}
                <div>
                  <p className='font-medium text-white'>{preview.socialPreview.title}</p>
                  <p className='text-sm text-gray-300'>{preview.socialPreview.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-4 rounded-lg border border-[#40444b] bg-[#2b2d31] p-4'>
            <div>
              <label
                htmlFor='seo-custom-title'
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
              >
                Custom Title
              </label>
              <input
                id='seo-custom-title'
                value={customTitle}
                onChange={event => setCustomTitle(event.target.value)}
                placeholder='Leave blank to use the generated title'
                className='w-full rounded bg-[#1e1f22] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#5865f2]'
              />
              <div className='mt-1 flex items-center justify-between text-xs'>
                <span className={titleError ? 'text-red-400' : 'text-gray-500'}>
                  {titleError ?? 'Max 70 characters'}
                </span>
                <span className={titleError ? 'text-red-400' : 'text-gray-500'}>
                  {customTitle.length}/{TITLE_MAX}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor='seo-custom-og-image'
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
              >
                Custom Social Image URL
              </label>
              <input
                id='seo-custom-og-image'
                value={customOgImage}
                onChange={event => setCustomOgImage(event.target.value)}
                placeholder='Leave blank to use the generated social image'
                className='w-full rounded bg-[#1e1f22] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#5865f2]'
              />
              <div className='mt-1 flex items-center justify-between text-xs'>
                <span className={ogImageError ? 'text-red-400' : 'text-gray-500'}>
                  {ogImageError ?? 'Max 500 characters'}
                </span>
                <span className={ogImageError ? 'text-red-400' : 'text-gray-500'}>
                  {customOgImage.length}/{OG_IMAGE_MAX}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor='seo-custom-description'
                className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
              >
                Custom Description
              </label>
              <textarea
                id='seo-custom-description'
                value={customDescription}
                onChange={event => setCustomDescription(event.target.value)}
                rows={4}
                placeholder='Leave blank to use the generated description'
                className='w-full resize-none rounded bg-[#1e1f22] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#5865f2]'
              />
              <div className='mt-1 flex items-center justify-between text-xs'>
                <span className={descriptionError ? 'text-red-400' : 'text-gray-500'}>
                  {descriptionError ?? 'Max 200 characters'}
                </span>
                <span className={descriptionError ? 'text-red-400' : 'text-gray-500'}>
                  {customDescription.length}/{DESCRIPTION_MAX}
                </span>
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <button
                type='button'
                onClick={handleSave}
                disabled={saving || Boolean(titleError || descriptionError || ogImageError)}
                className='rounded bg-[#5865f2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4752c4] disabled:opacity-50'
              >
                {saving ? 'Saving…' : 'Save Overrides'}
              </button>

              <button
                type='button'
                onClick={handleRegenerate}
                className='rounded bg-[#4f545c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#686d73]'
              >
                Regenerate Metadata
              </button>

              {jobStatus && (
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <StatusBadge status={jobStatus.status} />
                  {jobStatus.errorMessage && <span>{jobStatus.errorMessage}</span>}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
