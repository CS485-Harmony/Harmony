/**
 * Channel Settings Page (M1 Admin Dashboard — CL-C1.1 ChannelSettings)
 * Client component — handles sidebar nav, auth guard, and editable Overview section.
 * Ref: dev-spec-channel-visibility-toggle.md
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn, getUserErrorMessage } from '@/lib/utils';
import {
  saveChannelSettings,
  fetchAuditLog,
} from '@/app/settings/[serverSlug]/[channelSlug]/actions';
import { VisibilityToggle } from '@/components/channel/VisibilityToggle';
import { SeoPreviewSection } from '@/components/settings/SeoPreviewSection';
import type { Channel } from '@/types';
import type { AuditLogEntry, AuditLogPage } from '@/services/channelService';
import { ChannelVisibility } from '@/types';

// ─── Discord colour tokens ────────────────────────────────────────────────────

const BG = {
  base: 'bg-[#313338]',
  sidebar: 'bg-[#2f3136]',
  active: 'bg-[#3d4148]',
  input: 'bg-[#1e1f22]',
};

// ─── Sidebar sections ─────────────────────────────────────────────────────────

type Section = 'overview' | 'permissions' | 'visibility' | 'seo';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'visibility', label: 'Visibility' },
  { id: 'seo', label: 'SEO Preview' },
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
      setSaveError(getUserErrorMessage(err, 'Failed to save changes.'));
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

// ─── Permissions section ──────────────────────────────────────────────────────
// Mirrors the permission matrix in harmony-backend/src/services/permission.service.ts.
// This is a read-only reference view — roles are assigned at the server level,
// not the channel level, so there is no mutation API needed here.

// Must stay in sync with RoleType in harmony-backend/src/services/permission.service.ts
type PermissionRole = 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER' | 'GUEST';

interface PermissionRow {
  label: string;
  /** Which roles have this permission (all higher-privilege roles inherit it). */
  allowedFrom: PermissionRole;
}

/** Role hierarchy: index 0 = highest privilege. */
const ROLE_HIERARCHY: PermissionRole[] = ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST'];

/** Returns true if `role` is at or above `threshold` in the hierarchy. */
function hasPermission(role: PermissionRole, threshold: PermissionRole): boolean {
  return ROLE_HIERARCHY.indexOf(role) <= ROLE_HIERARCHY.indexOf(threshold);
}

// Channel-scoped actions only. Server-level actions (e.g. manage members, delete server)
// are intentionally omitted — they are not channel permissions and would be misleading here.
const CHANNEL_PERMISSIONS: PermissionRow[] = [
  { label: 'View channel', allowedFrom: 'GUEST' },
  { label: 'Send messages', allowedFrom: 'MEMBER' },
  { label: 'Edit own messages', allowedFrom: 'MEMBER' },
  { label: 'Delete own messages', allowedFrom: 'MEMBER' },
  { label: 'Delete any message', allowedFrom: 'MODERATOR' },
  { label: 'Pin messages', allowedFrom: 'MODERATOR' },
  { label: 'Manage channel settings', allowedFrom: 'ADMIN' },
  { label: 'Manage channel visibility', allowedFrom: 'ADMIN' },
  { label: 'Create / delete channels', allowedFrom: 'ADMIN' },
];

const ROLE_LABELS: Record<PermissionRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MODERATOR: 'Mod',
  MEMBER: 'Member',
  GUEST: 'Guest',
};

function CheckIcon() {
  return (
    <svg
      className='mx-auto h-4 w-4 text-[#3ba55c]'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2.5}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M20 6 9 17l-5-5' />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg
      className='mx-auto h-4 w-4 text-gray-600'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M5 12h14' />
    </svg>
  );
}

function PermissionsSection() {
  return (
    <div className='max-w-2xl space-y-6'>
      <div>
        <h2 className='mb-1 text-xl font-semibold text-white'>Channel Permissions</h2>
        <p className='text-sm text-gray-400'>
          Permissions are determined by each member&apos;s server role. Role assignment is managed
          in Server Settings.
        </p>
      </div>

      {/* Permission matrix table */}
      <div className='overflow-x-auto rounded-md border border-[#40444b]'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-[#40444b] bg-[#2f3136]'>
              {/* Empty header for the action label column */}
              <th
                scope='col'
                className='px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'
              >
                Permission
              </th>
              {ROLE_HIERARCHY.map(role => (
                <th
                  key={role}
                  scope='col'
                  className='px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-400'
                >
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CHANNEL_PERMISSIONS.map((row, idx) => (
              <tr key={row.label} className={idx % 2 === 0 ? 'bg-[#36393f]' : 'bg-[#2f3136]'}>
                <td className='px-4 py-2 text-gray-300'>{row.label}</td>
                {ROLE_HIERARCHY.map(role => {
                  // Compute once per cell to avoid redundant calls across the 9×5 matrix
                  const allowed = hasPermission(role, row.allowedFrom);
                  return (
                    <td key={role} className='px-3 py-2 text-center'>
                      {allowed ? <CheckIcon /> : <DashIcon />}
                      <span className='sr-only'>{allowed ? 'Allowed' : 'Not allowed'}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className='text-xs text-gray-500'>
        To change a member&apos;s role, go to{' '}
        <span className='text-gray-400'>Server Settings → Members</span>.
      </p>
    </div>
  );
}

// ─── Visibility Section (toggle + audit log) ──────────────────────────────────

const VISIBILITY_LABEL: Record<ChannelVisibility, string> = {
  [ChannelVisibility.PUBLIC_INDEXABLE]: 'Public (Search Indexed)',
  [ChannelVisibility.PUBLIC_NO_INDEX]: 'Public (Not Indexed)',
  [ChannelVisibility.PRIVATE]: 'Private',
};

function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) {
    return <p className='text-sm text-gray-500'>No visibility changes recorded yet.</p>;
  }
  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left text-xs text-gray-400'>
        <thead>
          <tr className='border-b border-[#40444b]'>
            <th className='pb-2 pr-4 font-semibold uppercase tracking-wide'>Date</th>
            <th className='pb-2 pr-4 font-semibold uppercase tracking-wide'>From</th>
            <th className='pb-2 font-semibold uppercase tracking-wide'>To</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => {
            const oldVis = (entry.oldValue as { visibility?: string }).visibility as
              | ChannelVisibility
              | undefined;
            const newVis = (entry.newValue as { visibility?: string }).visibility as
              | ChannelVisibility
              | undefined;
            return (
              <tr key={entry.id} className='border-b border-[#2f3136]'>
                <td className='py-2 pr-4 whitespace-nowrap'>
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td className='py-2 pr-4'>{oldVis ? (VISIBILITY_LABEL[oldVis] ?? oldVis) : '—'}</td>
                <td className='py-2'>{newVis ? (VISIBILITY_LABEL[newVis] ?? newVis) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const AUDIT_PAGE_SIZE = 10;

function VisibilitySection({
  channel,
  serverSlug,
  disabled,
}: {
  channel: Channel;
  serverSlug: string;
  disabled: boolean;
}) {
  const [auditLog, setAuditLog] = useState<AuditLogPage | null>(null);
  const [auditOffset, setAuditOffset] = useState(0);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  // Monotonically-incrementing token: only the response from the latest in-flight
  // request is applied. Older in-flight fetches (channel switch, rapid pagination)
  // compare against this ref and discard their results if they are stale.
  const requestTokenRef = useRef(0);

  const loadAuditLog = useCallback(
    async (offset: number) => {
      const token = ++requestTokenRef.current;
      setAuditLoading(true);
      setAuditError(null);
      try {
        const page = await fetchAuditLog(serverSlug, channel.slug, {
          limit: AUDIT_PAGE_SIZE,
          offset,
        });
        if (requestTokenRef.current !== token) return; // stale — discard
        setAuditLog(page);
        setAuditOffset(offset); // commit offset only after a successful load — keeps range text in sync with displayed entries
      } catch (err) {
        if (requestTokenRef.current !== token) return;
        setAuditError(getUserErrorMessage(err, 'Failed to load audit log.'));
      } finally {
        if (requestTokenRef.current === token) setAuditLoading(false);
      }
    },
    [serverSlug, channel.slug],
  );

  // Load audit log when section mounts or channel changes.
  useEffect(() => {
    setAuditOffset(0);
    void loadAuditLog(0);
  }, [loadAuditLog]);

  function handlePrev() {
    void loadAuditLog(Math.max(0, auditOffset - AUDIT_PAGE_SIZE));
  }

  function handleNext() {
    void loadAuditLog(auditOffset + AUDIT_PAGE_SIZE);
  }

  // Reset to page 0 and reload after a visibility change.
  function handleVisibilityChanged() {
    void loadAuditLog(0);
  }

  const hasMore = auditLog !== null && auditOffset + AUDIT_PAGE_SIZE < auditLog.total;

  return (
    <div className='max-w-lg space-y-8'>
      <VisibilityToggle
        serverSlug={serverSlug}
        channelSlug={channel.slug}
        initialVisibility={channel.visibility}
        disabled={disabled}
        onVisibilityChanged={handleVisibilityChanged}
      />

      {/* Audit log */}
      <div>
        <h3 className='mb-3 text-sm font-semibold uppercase tracking-wide text-gray-300'>
          Visibility Change History
        </h3>

        {/* Initial load spinner — only shown before first data arrives */}
        {auditLoading && !auditLog && (
          <div className='flex items-center gap-2 text-sm text-gray-400'>
            <svg
              className='h-4 w-4 animate-spin'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path d='M21 12a9 9 0 1 1-6.219-8.56' />
            </svg>
            Loading…
          </div>
        )}

        {!auditLoading && auditError && (
          <p role='alert' className='text-sm text-red-400'>
            {auditError}
          </p>
        )}

        {/* Keep previous entries visible while paginating to avoid height collapse
            and scroll jump. Dim the table to signal the update is in-flight. */}
        {auditLog && (
          <div className={cn('transition-opacity', auditLoading ? 'opacity-50' : 'opacity-100')}>
            <AuditLogTable entries={auditLog.entries} />
            {auditLog.total > AUDIT_PAGE_SIZE && (
              <div className='mt-3 flex items-center gap-3 text-xs text-gray-400'>
                <button
                  type='button'
                  onClick={handlePrev}
                  disabled={auditOffset === 0 || auditLoading}
                  className='rounded px-2 py-1 hover:bg-[#3d4148] disabled:opacity-40'
                >
                  ← Prev
                </button>
                <span>
                  {auditOffset + 1}–{Math.min(auditOffset + AUDIT_PAGE_SIZE, auditLog.total)} of{' '}
                  {auditLog.total}
                </span>
                <button
                  type='button'
                  onClick={handleNext}
                  disabled={!hasMore || auditLoading}
                  className='rounded px-2 py-1 hover:bg-[#3d4148] disabled:opacity-40'
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Loading spinner ──────────────────────────────────────────────────────────

export interface ChannelSettingsPageProps {
  channel: Channel;
  serverSlug: string;
  serverOwnerId?: string;
  canManageSeo?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChannelSettingsPage({
  channel,
  serverSlug,
  serverOwnerId: _serverOwnerId,
  canManageSeo = true,
}: ChannelSettingsPageProps) {
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
            <svg
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
              aria-hidden='true'
              focusable='false'
            >
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              />
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
          {activeSection === 'permissions' && <PermissionsSection />}
          {activeSection === 'visibility' && (
            <VisibilitySection channel={channel} serverSlug={serverSlug} disabled={false} />
          )}
          {activeSection === 'seo' && (
            <SeoPreviewSection
              serverSlug={serverSlug}
              channelSlug={channel.slug}
              canManageSeo={canManageSeo}
            />
          )}
        </div>
      </main>
    </div>
  );
}
