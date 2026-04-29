/**
 * Server Settings Page (Admin Dashboard)
 * Client component — handles sidebar nav, auth guard, Overview, and Danger Zone.
 * Mirrors the structure of ChannelSettingsPage.
 */

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn, getUserErrorMessage } from '@/lib/utils';
import { saveServerSettings, deleteServerAction } from '@/app/settings/[serverSlug]/actions';
import { MembersSection } from '@/components/settings/MembersSection';
import { VisibilitySection } from '@/components/settings/VisibilitySection';
import { InviteSection } from '@/components/settings/InviteSection';
import { PermissionsSection } from '@/components/settings/PermissionsSection';
import type { PermissionMatrix } from '@/components/settings/PermissionsSection';
import type { Server } from '@/types';

// ─── Discord colour tokens ────────────────────────────────────────────────────

const BG = {
  base: 'bg-[#313338]',
  sidebar: 'bg-[#2f3136]',
  active: 'bg-[#3d4148]',
  input: 'bg-[#1e1f22]',
};

// ─── Sidebar sections ─────────────────────────────────────────────────────────

type Section = 'overview' | 'members' | 'invites' | 'privacy' | 'permissions' | 'danger-zone';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'invites', label: 'Invites' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'danger-zone', label: 'Danger Zone' },
];

// ─── Overview section ─────────────────────────────────────────────────────────

function OverviewSection({
  server,
  onSave,
}: {
  server: Server;
  onSave: (savedName: string) => void;
}) {
  const [name, setName] = useState(server.name);
  const [description, setDescription] = useState(server.description ?? '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const currentServerIdRef = useRef(server.id);
  currentServerIdRef.current = server.id;
  const saveCounterRef = useRef(0);

  const [prevServerId, setPrevServerId] = useState(server.id);
  if (prevServerId !== server.id) {
    setPrevServerId(server.id);
    setName(server.name);
    setDescription(server.description ?? '');
    setSaved(false);
    setSaveError(null);
    setSaving(false);
    isSavingRef.current = false;
    if (savedTimerRef.current) {
      clearTimeout(savedTimerRef.current);
      savedTimerRef.current = null;
    }
  }

  async function handleSave() {
    if (isSavingRef.current) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setSaveError('Server name cannot be empty');
      return;
    }
    const savedForServerId = server.id;
    const thisToken = ++saveCounterRef.current;
    isSavingRef.current = true;
    setSaving(true);
    setSaveError(null);
    try {
      await saveServerSettings(server.slug, {
        name: trimmedName,
        description: description.trim(),
      });
      if (currentServerIdRef.current !== savedForServerId || saveCounterRef.current !== thisToken)
        return;
      setSaved(true);
      onSave(trimmedName);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      if (currentServerIdRef.current !== savedForServerId || saveCounterRef.current !== thisToken)
        return;
      setSaveError(getUserErrorMessage(err, 'Failed to save changes.'));
    } finally {
      if (currentServerIdRef.current === savedForServerId && saveCounterRef.current === thisToken) {
        isSavingRef.current = false;
        setSaving(false);
      }
    }
  }

  return (
    <div className='max-w-lg space-y-6'>
      <div>
        <h2 className='mb-4 text-xl font-semibold text-white'>Server Overview</h2>
      </div>

      {/* Server Name */}
      <div>
        <label
          htmlFor='server-name'
          className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
        >
          Server Name
        </label>
        <input
          id='server-name'
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

      {/* Description */}
      <div>
        <label
          htmlFor='server-description'
          className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
        >
          Description
        </label>
        <textarea
          id='server-description'
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          placeholder='What is this server about?'
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

// ─── Danger Zone section ──────────────────────────────────────────────────────

function DangerZoneSection({ server }: { server: Server }) {
  const [confirmStep, setConfirmStep] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteServerAction(server.slug);
      // deleteServerAction redirects — execution won't reach here on success
    } catch (err) {
      setDeleting(false);
      setDeleteError(getUserErrorMessage(err, 'Failed to delete server.'));
    }
  }

  return (
    <div className='max-w-lg space-y-6'>
      <h2 className='mb-4 text-xl font-semibold text-white'>Danger Zone</h2>

      <div className='rounded border border-red-500/40 bg-red-950/20 p-4'>
        <p className='mb-1 font-medium text-red-400'>Delete this server</p>
        <p className='mb-4 text-sm text-gray-400'>
          Permanently deletes <span className='font-semibold text-white'>{server.name}</span> and
          all its channels. This action cannot be undone.
        </p>

        {!confirmStep ? (
          <button
            type='button'
            onClick={() => setConfirmStep(true)}
            className='rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
          >
            Delete Server
          </button>
        ) : (
          <div className='space-y-3'>
            <p className='text-sm font-medium text-red-300'>Are you sure? This cannot be undone.</p>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={handleDelete}
                disabled={deleting}
                className='rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60'
              >
                {deleting ? 'Deleting…' : 'Yes, Delete Server'}
              </button>
              <button
                type='button'
                onClick={() => {
                  setConfirmStep(false);
                  setDeleteError(null);
                }}
                disabled={deleting}
                className='rounded bg-[#4f545c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#686d73] focus:outline-none focus:ring-2 focus:ring-[#5865f2] disabled:opacity-60'
              >
                Cancel
              </button>
            </div>
            {deleteError && (
              <p role='alert' className='text-sm text-red-400'>
                {deleteError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export interface ServerSettingsPageProps {
  server: Server;
  serverSlug: string;
  canDeleteServer?: boolean;
  permissionMatrix?: PermissionMatrix | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ServerSettingsPage({
  server,
  serverSlug,
  canDeleteServer = false,
  permissionMatrix,
}: ServerSettingsPageProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [displayName, setDisplayName] = useState(server.name);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const backHref = `/channels/${serverSlug}`;

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
          isSidebarOpen ? 'fixed inset-y-0 left-0 z-30 flex' : 'hidden sm:flex',
        )}
      >
        {/* Server name heading */}
        <div className='mb-2 px-2'>
          <p className='text-xs font-semibold uppercase tracking-wide text-gray-400'>
            {displayName}
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
                id === 'danger-zone' &&
                  activeSection !== 'danger-zone' &&
                  'text-red-400 hover:text-red-300',
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
            Back to {displayName}
          </button>
        </div>

        {/* Section content */}
        <div className='px-4 py-6 sm:px-10 sm:py-8'>
          {activeSection === 'overview' && (
            <OverviewSection key={server.id} server={server} onSave={setDisplayName} />
          )}
          {activeSection === 'members' && <MembersSection serverSlug={serverSlug} />}
          {activeSection === 'invites' && <InviteSection serverSlug={serverSlug} />}
          {activeSection === 'privacy' && (
            <VisibilitySection server={server} serverSlug={serverSlug} />
          )}
          {activeSection === 'permissions' && (
            permissionMatrix == null ? (
              <div className='max-w-lg space-y-3'>
                <h2 className='text-xl font-semibold text-white'>Permissions</h2>
                <p className='text-sm text-red-400'>
                  Failed to load the permission matrix. Please refresh the page.
                </p>
              </div>
            ) : (
              <PermissionsSection matrix={permissionMatrix} />
            )
          )}
          {activeSection === 'danger-zone' &&
            (canDeleteServer ? (
              <DangerZoneSection server={server} />
            ) : (
              <div className='max-w-lg space-y-3'>
                <h2 className='text-xl font-semibold text-white'>Danger Zone</h2>
                <p className='text-sm text-gray-400'>
                  Only the server owner can delete this server.
                </p>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
