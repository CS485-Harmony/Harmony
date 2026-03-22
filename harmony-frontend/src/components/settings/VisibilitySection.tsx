/**
 * Visibility Section — server settings panel for managing public/private visibility.
 */

'use client';

import { useState } from 'react';
import { cn, getUserErrorMessage } from '@/lib/utils';
import { saveServerSettings } from '@/app/settings/[serverSlug]/actions';
import type { Server } from '@/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface VisibilitySectionProps {
  server: Server;
  serverSlug: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VisibilitySection({ server, serverSlug }: VisibilitySectionProps) {
  // Default to public (true) when isPublic is not set on the server object
  const [isPublic, setIsPublic] = useState(server.isPublic ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      await saveServerSettings(serverSlug, { isPublic });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(getUserErrorMessage(err, 'Failed to save visibility setting.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className='max-w-lg space-y-6'>
      <div>
        <h2 className='mb-1 text-xl font-semibold text-white'>Privacy</h2>
        <p className='text-sm text-gray-400'>Control who can find and join this server.</p>
      </div>

      {/* Radio options */}
      <fieldset className='space-y-3'>
        <legend className='sr-only'>Server visibility</legend>

        <label
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded p-3 transition-colors',
            isPublic ? 'bg-[#3d4148]' : 'bg-[#2f3136] hover:bg-[#36393f]',
          )}
        >
          <input
            type='radio'
            name='visibility'
            value='public'
            checked={isPublic}
            onChange={() => setIsPublic(true)}
            className='mt-0.5 accent-[#5865f2]'
          />
          <div>
            <p className='text-sm font-medium text-white'>Public</p>
            <p className='text-xs text-gray-400'>Anyone can find and join this server</p>
          </div>
        </label>

        <label
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded p-3 transition-colors',
            !isPublic ? 'bg-[#3d4148]' : 'bg-[#2f3136] hover:bg-[#36393f]',
          )}
        >
          <input
            type='radio'
            name='visibility'
            value='private'
            checked={!isPublic}
            onChange={() => setIsPublic(false)}
            className='mt-0.5 accent-[#5865f2]'
          />
          <div>
            <p className='text-sm font-medium text-white'>Private</p>
            <p className='text-xs text-gray-400'>Only people with an invite can join</p>
          </div>
        </label>
      </fieldset>

      {/* Save */}
      <div className='space-y-2'>
        <button
          type='button'
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'rounded px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#5865f2] disabled:opacity-60',
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
