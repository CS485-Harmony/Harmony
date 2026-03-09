/**
 * Channel Settings Page (M1 Admin Dashboard — CL-C1.1 ChannelSettings)
 * Client component — handles sidebar nav, auth guard, and editable Overview section.
 * Ref: dev-spec-channel-visibility-toggle.md
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { saveChannelSettings } from '@/app/settings/[serverSlug]/[channelSlug]/actions';
import { VisibilityToggle } from '@/components/channel/VisibilityToggle';
import type { Channel } from '@/types';

// ─── Discord colour tokens ────────────────────────────────────────────────────

const BG = {
  base: 'bg-[#313338]',
  sidebar: 'bg-[#2f3136]',
  active: 'bg-[#3d4148]',
  input: 'bg-[#1e1f22]',
};

// ─── Sidebar sections ─────────────────────────────────────────────────────────

type Section = 'overview' | 'permissions' | 'visibility';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'visibility', label: 'Visibility' },
];

// ─── Overview section ─────────────────────────────────────────────────────────

function OverviewSection({
  channel,
  serverSlug,
  onSave,
}: {
  channel: Channel;
  serverSlug: string;
  onSave: (savedName: string) => void;
}) {
  const [name, setName] = useState(channel.name);
  const [topic, setTopic] = useState(channel.topic ?? '');
  const [description, setDescription] = useState(channel.description ?? '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Synchronous re-entrancy lock: prevents two rapid clicks from dispatching
  // concurrent saves before React can re-render and disable the button.
  const isSavingRef = useRef(false);
  // Always reflects the current channel.id regardless of closure age —
  // used to guard stale async saves that complete after a channel switch.
  const currentChannelIdRef = useRef(channel.id);
  currentChannelIdRef.current = channel.id;
  // Monotonically-incrementing token: only the latest save invocation can apply
  // post-await state updates, preventing older in-flight saves from overwriting
  // results from a newer one (e.g. channel A → B → A rapid save scenario).
  const saveCounterRef = useRef(0);

  // Render-phase derived-state reset: when the channel changes (e.g. navigating
  // between channel settings without unmounting), reset all form fields immediately
  // so stale values from the previous channel don't persist for even one render.
  const [prevChannelId, setPrevChannelId] = useState(channel.id);
  if (prevChannelId !== channel.id) {
    setPrevChannelId(channel.id);
    setName(channel.name);
    setTopic(channel.topic ?? '');
    setDescription(channel.description ?? '');
    setSaved(false);
    setSaveError(null);
    setSaving(false);
    isSavingRef.current = false;
    if (savedTimerRef.current) {
      clearTimeout(savedTimerRef.current);
      savedTimerRef.current = null;
    }
  }

  useEffect(
    () => () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    },
    [],
  );

  async function handleSave() {
    if (isSavingRef.current) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setSaveError('Channel name cannot be empty');
      return;
    }
    // Capture the channel being saved so we can ignore completion if the user
    // navigates to a different channel before this async request resolves.
    const savedForChannelId = channel.id;
    const thisToken = ++saveCounterRef.current;
    isSavingRef.current = true;
    setSaving(true);
    setSaveError(null);
    try {
      await saveChannelSettings(serverSlug, channel.slug, {
        name: trimmedName,
        topic: topic.trim(),
        description: description.trim(),
      });
      if (currentChannelIdRef.current !== savedForChannelId || saveCounterRef.current !== thisToken)
        return;
      setSaved(true);
      onSave(trimmedName);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      if (currentChannelIdRef.current !== savedForChannelId || saveCounterRef.current !== thisToken)
        return;
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      if (
        currentChannelIdRef.current === savedForChannelId &&
        saveCounterRef.current === thisToken
      ) {
        isSavingRef.current = false;
        setSaving(false);
      }
    }
  }

  return (
    <div className='max-w-lg space-y-6'>
      <div>
        <h2 className='mb-4 text-xl font-semibold text-white'>Channel Overview</h2>
      </div>

      {/* Channel Name */}
      <div>
        <label
          htmlFor='channel-name'
          className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
        >
          Channel Name
        </label>
        <input
          id='channel-name'
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          className={cn(
            'w-full rounded px-3 py-2 text-sm text-white placeholder-gray-500 outline-none',
            'focus:ring-2 focus:ring-[#5865f2]',
            BG.input,
          )}
        />
      </div>

      {/* Topic */}
      <div>
        <label
          htmlFor='channel-topic'
          className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
        >
          Channel Topic
        </label>
        <input
          id='channel-topic'
          type='text'
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder='Let members know what this channel is about'
          className={cn(
            'w-full rounded px-3 py-2 text-sm text-white placeholder-gray-500 outline-none',
            'focus:ring-2 focus:ring-[#5865f2]',
            BG.input,
          )}
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor='channel-description'
          className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
        >
          Description
        </label>
        <textarea
          id='channel-description'
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          placeholder='Add a longer description for this channel'
          className={cn(
            'w-full resize-none rounded px-3 py-2 text-sm text-white placeholder-gray-500 outline-none',
            'focus:ring-2 focus:ring-[#5865f2]',
            BG.input,
          )}
        />
      </div>

      {/* Save */}
      <div className='space-y-2'>
        <button
          type='button'
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'rounded px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5865f2] transition-colors disabled:opacity-60',
            saved ? 'bg-[#3ba55c] hover:bg-[#2d8a4d]' : 'bg-[#5865f2] hover:bg-[#4752c4]',
          )}
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
        {saveError && (
          <p role='alert' className='text-sm text-red-400'>
            {saveError}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Coming-soon stub ─────────────────────────────────────────────────────────

function ComingSoonSection({ label }: { label: string }) {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <div className='mb-3 text-4xl'>🚧</div>
      <p className='text-lg font-semibold text-white'>{label}</p>
      <p className='mt-1 text-sm text-gray-400'>This section is coming soon.</p>
    </div>
  );
}

// ─── Loading spinner ──────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div
      className={cn('flex h-screen items-center justify-center', BG.base)}
      role='status'
      aria-live='polite'
    >
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-[#5865f2] border-t-transparent' />
      <span className='sr-only'>Loading…</span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChannelSettingsPageProps {
  channel: Channel;
  serverSlug: string;
  serverOwnerId?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChannelSettingsPage({ channel, serverSlug, serverOwnerId }: ChannelSettingsPageProps) {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [displayName, setDisplayName] = useState(channel.name);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Render-phase derived-state reset: keep sidebar heading and back-button text
  // in sync when channel prop changes without unmounting this component.
  const [prevChannelId, setPrevChannelId] = useState(channel.id);
  if (prevChannelId !== channel.id) {
    setPrevChannelId(channel.id);
    setDisplayName(channel.name);
    setActiveSection('overview');
    setIsSidebarOpen(false);
  }

  const backHref = `/channels/${serverSlug}/${channel.slug}`;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !isAdmin(serverOwnerId)) {
      router.replace(backHref);
    }
  }, [isLoading, isAuthenticated, isAdmin, router, backHref, serverOwnerId]);

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated || !isAdmin(serverOwnerId)) return <LoadingScreen />;

  return (
    <div className={cn('flex h-screen overflow-hidden', BG.base)}>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/40 sm:hidden'
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden='true'
          role='presentation'
        />
      )}

      {/* Settings sidebar */}
      <aside
        id='settings-sidebar'
        className={cn(
          'w-60 flex-shrink-0 flex-col overflow-y-auto px-2 py-4',
          BG.sidebar,
          // Mobile: hidden by default, shown as fixed overlay when toggled
          isSidebarOpen ? 'fixed inset-y-0 left-0 z-30 flex' : 'hidden sm:flex',
        )}
      >
        {/* Channel name heading */}
        <div className='mb-2 px-2'>
          <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
            #{displayName}
          </p>
        </div>

        {/* Nav items */}
        <nav aria-label='Settings sections'>
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type='button'
              onClick={() => {
                setActiveSection(id);
                setIsSidebarOpen(false);
              }}
              aria-current={activeSection === id ? 'page' : undefined}
              className={cn(
                'w-full cursor-pointer rounded px-2 py-1.5 text-left text-sm transition-colors',
                activeSection === id
                  ? cn(BG.active, 'font-medium text-white')
                  : 'text-gray-400 hover:bg-[#393c43] hover:text-gray-200',
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className='flex flex-1 flex-col overflow-y-auto'>
        {/* Top bar with back button */}
        <div className='flex h-12 flex-shrink-0 items-center border-b border-black/20 px-4 sm:px-6'>
          {/* Mobile sidebar toggle */}
          <button
            type='button'
            onClick={() => setIsSidebarOpen(true)}
            className='mr-2 flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-[#3d4148] hover:text-white sm:hidden'
            aria-label='Open settings menu'
            aria-expanded={isSidebarOpen}
            aria-controls='settings-sidebar'
          >
            <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true' focusable='false'>
              <path fillRule='evenodd' d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' clipRule='evenodd' />
            </svg>
          </button>
          <button
            type='button'
            onClick={() => router.push(backHref)}
            className='flex cursor-pointer items-center gap-1.5 text-sm text-gray-400 hover:text-white'
          >
            <svg
              className='h-4 w-4'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
              focusable='false'
            >
              <path d='m15 18-6-6 6-6' />
            </svg>
            Back to #{displayName}
          </button>
        </div>

        {/* Section content */}
        <div className='px-4 py-6 sm:px-10 sm:py-8'>
          {activeSection === 'overview' && (
            <OverviewSection channel={channel} serverSlug={serverSlug} onSave={setDisplayName} />
          )}
          {activeSection === 'permissions' && <ComingSoonSection label='Permissions' />}
          {activeSection === 'visibility' && (
            <VisibilityToggle
              serverSlug={serverSlug}
              channelSlug={channel.slug}
              initialVisibility={channel.visibility}
              disabled={!isAdmin(serverOwnerId)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
