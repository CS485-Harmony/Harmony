/**
 * Component: UserStatusBar
 * Discord-style user info bar shown at the bottom of the ChannelSidebar.
 * Displays avatar, username, discriminator tag, status indicator,
 * mic/headphone toggles (wired to VoiceContext — affect real Twilio tracks when in voice),
 * a voice-settings popover (audio device selection without navigation), and a settings gear.
 *
 * Ref: Issue #28, Issue #603
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { User, UserStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useVoiceOptional } from '@/contexts/VoiceContext';
import { useAudioDevices } from '@/hooks/useAudioDevices';
import { MicLevelMeter, SpeakerTest } from '@/components/settings/AudioDeviceTests';

// ─── Status colour map ────────────────────────────────────────────────────────

const STATUS_COLOR: Record<UserStatus, string> = {
  online: 'bg-green-500',
  idle: 'bg-yellow-400',
  dnd: 'bg-red-500',
  offline: 'bg-gray-400',
};

const STATUS_LABEL: Record<UserStatus, string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline',
};

// ─── Voice settings popover ───────────────────────────────────────────────────

/**
 * Compact audio device selector that floats above the status bar.
 * Lets users change input/output devices and test them without navigating
 * away from the current channel (which would disconnect them from voice).
 */
function VoiceSettingsPopover({ onClose }: { onClose: () => void }) {
  const {
    inputDevices,
    outputDevices,
    selectedInputId,
    selectedOutputId,
    setSelectedInputId,
    setSelectedOutputId,
    supportsOutputSelection,
    permissionDenied,
    requestPermission,
  } = useAudioDevices();

  const hasLabels = inputDevices.some(d => d.label && !d.label.startsWith('Microphone ('));
  const needsPermission = !hasLabels && inputDevices.length <= 1;

  const selectClass =
    'w-full rounded bg-[#111214] px-2 py-1 text-xs text-gray-200 border border-[#3d4148] focus:outline-none focus:border-indigo-500';

  return (
    <div className='absolute bottom-full left-0 right-0 z-50 rounded-t-lg border border-[#3d4148] border-b-0 bg-[#1e1f22] shadow-lg'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-[#3d4148] px-3 py-2'>
        <span className='text-xs font-semibold uppercase tracking-wide text-gray-300'>
          Voice &amp; Audio
        </span>
        <button
          type='button'
          onClick={onClose}
          aria-label='Close voice settings'
          className='rounded p-0.5 text-gray-400 hover:bg-[#3d4148] hover:text-white'
        >
          <svg className='h-3.5 w-3.5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.5} strokeLinecap='round' aria-hidden='true'>
            <path d='M18 6 6 18M6 6l12 12' />
          </svg>
        </button>
      </div>

      <div className='space-y-4 p-3'>
        {/* Input device */}
        <div>
          <label className='mb-1 block text-[11px] font-bold uppercase tracking-wide text-gray-400'>
            Input Device
          </label>
          {needsPermission ? (
            <div className='space-y-1.5'>
              <p className='text-[11px] text-yellow-400'>
                Grant microphone permission to see your devices.
              </p>
              {permissionDenied ? (
                <p className='text-[11px] text-red-400'>
                  Access denied — allow it in browser settings.
                </p>
              ) : (
                <button
                  type='button'
                  onClick={requestPermission}
                  className='rounded px-2.5 py-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors'
                >
                  Allow Mic Access
                </button>
              )}
            </div>
          ) : (
            <>
              <select
                value={selectedInputId}
                onChange={e => setSelectedInputId(e.target.value)}
                className={selectClass}
                aria-label='Input device'
              >
                <option value='default'>Default</option>
                {inputDevices
                  .filter(d => d.deviceId !== 'default')
                  .map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
              </select>
              <MicLevelMeter deviceId={selectedInputId} />
            </>
          )}
        </div>

        {/* Output device */}
        <div>
          <label className='mb-1 block text-[11px] font-bold uppercase tracking-wide text-gray-400'>
            Output Device
          </label>
          {!supportsOutputSelection ? (
            <p className='text-[11px] text-yellow-400'>
              Output selection not supported in this browser.
            </p>
          ) : outputDevices.length === 0 ? (
            <p className='text-[11px] text-gray-400'>No output devices found.</p>
          ) : (
            <>
              <select
                value={selectedOutputId}
                onChange={e => setSelectedOutputId(e.target.value)}
                className={selectClass}
                aria-label='Output device'
              >
                <option value='default'>Default</option>
                {outputDevices
                  .filter(d => d.deviceId !== 'default')
                  .map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
              </select>
              <SpeakerTest deviceId={selectedOutputId} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface UserStatusBarProps {
  currentUser: User;
  isAuthenticated: boolean;
}

export function UserStatusBar({ currentUser, isAuthenticated }: UserStatusBarProps) {
  const pathname = usePathname();
  const voice = useVoiceOptional();
  const connectedChannelName = voice?.connectedChannelName ?? null;
  const connectedChannelId = voice?.connectedChannelId ?? null;
  const isMuted = voice?.isMuted ?? false;
  const isDeafened = voice?.isDeafened ?? false;

  const isInVoice = connectedChannelId !== null;

  const userInitial = currentUser.username?.[0]?.toUpperCase() ?? '?';
  const settingsHref = `/settings?returnTo=${encodeURIComponent(pathname)}`;

  // Voice settings popover state
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);
  const popoverContainerRef = useRef<HTMLDivElement>(null);

  // Close the popover when the user clicks outside of it.
  useEffect(() => {
    if (!audioSettingsOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (popoverContainerRef.current && !popoverContainerRef.current.contains(e.target as Node)) {
        setAudioSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [audioSettingsOpen]);

  return (
    <div className={cn('flex flex-shrink-0 flex-col bg-[#292b2f]', isInVoice ? 'h-auto' : 'h-[52px]')}>
      {/* Voice channel connection indicator */}
      {isInVoice && (
        <div className='flex w-full items-center justify-between border-b border-black/20 px-2 py-1 text-[11px] text-green-400'>
          <div className='min-w-0'>
            <p className='font-semibold leading-tight'>Voice Connected</p>
            <p className='truncate leading-tight opacity-80'>#{connectedChannelName}</p>
          </div>
          <button
            type='button'
            onClick={() => { if (voice) void voice.leaveChannel(); }}
            title='Disconnect from voice'
            aria-label='Disconnect from voice channel'
            className='ml-2 flex-shrink-0 rounded p-1 text-red-400 hover:bg-red-500/10 hover:text-red-300'
          >
            <svg className='h-3.5 w-3.5' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
              <path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/>
              <line x1='1' y1='1' x2='23' y2='23' stroke='currentColor' strokeWidth='2' strokeLinecap='round'/>
            </svg>
          </button>
        </div>
      )}

      {/* Popover container — wraps the trigger button and the floating panel so
          click-outside detection works correctly via a single ref. */}
      <div ref={popoverContainerRef} className='relative flex h-[52px] items-center gap-2 px-2'>
        {/* Avatar + status indicator */}
        <div className='relative flex-shrink-0'>
          {currentUser.avatar ? (
            <Image
              src={currentUser.avatar}
              alt={currentUser.username}
              width={32}
              height={32}
              className='h-8 w-8 rounded-full'
              unoptimized
            />
          ) : (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white'>
              {userInitial}
            </div>
          )}
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[#292b2f]',
              STATUS_COLOR[currentUser.status],
            )}
            title={STATUS_LABEL[currentUser.status]}
          />
        </div>

        {/* Username + discriminator */}
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-medium leading-tight text-white'>
            {currentUser.displayName ?? currentUser.username}
          </p>
          <p className='truncate text-[11px] leading-tight text-gray-400'>#{currentUser.username}</p>
        </div>

        {/* Action icons */}
        <div className='flex flex-shrink-0 items-center'>
          {/* Mic toggle — only functional when connected to a voice channel */}
          <button
            onClick={() => { if (voice) void voice.setMuted(!isMuted); }}
            disabled={!isInVoice}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className='rounded p-1 text-gray-400 hover:bg-[#3a3c41] hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400'
          >
            {isMuted ? (
              <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
                <path d='M6.7 11H5c0 1.19.37 2.3 1 3.22L3.28 16.9l1.41 1.41 15.89-15.89-1.41-1.41L13 7.18V6c0-1.66-1.34-3-3-3S7 4.34 7 6v5h-.3zM9 6c0-.55.45-1 1-1s1 .45 1 1v1.18L9 9.18V6zm3.89 6.11L9 16.01V16c0 1.66 1.34 3 3 3 1.3 0 2.41-.84 2.83-2H12v-1h3c.28 0 .55-.04.81-.09l-2.92-2.92zM19 11h-1.7c0 .58-.1 1.13-.27 1.64l1.27 1.27c.44-.88.7-1.87.7-2.91zM14.98 19.54l-1.42 1.42C14.32 21.62 15.13 22 16 22h0c1.1 0 2-.9 2-2v0-1h-2v1c0 .14-.03.27-.08.39-.18.44-.6.73-1.08.73-.36 0-.68-.15-.91-.39z' />
              </svg>
            ) : (
              <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
                <path d='M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z' />
                <path d='M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z' />
              </svg>
            )}
          </button>

          {/* Headphone toggle — only functional when connected to a voice channel */}
          <button
            onClick={() => { if (voice) void voice.setDeafened(!isDeafened); }}
            disabled={!isInVoice}
            title={isDeafened ? 'Undeafen' : 'Deafen'}
            aria-label={isDeafened ? 'Undeafen' : 'Deafen'}
            className='rounded p-1 text-gray-400 hover:bg-[#3a3c41] hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400'
          >
            {isDeafened ? (
              <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
                <path d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z' />
              </svg>
            ) : (
              <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
                <path d='M12 3C7.03 3 3 7.03 3 12v7c0 1.1.9 2 2 2h3v-6H5v-3c0-3.87 3.13-7 7-7s7 3.13 7 7v3h-3v6h3c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9z' />
              </svg>
            )}
          </button>

          {/* Voice settings — opens an inline popover so device changes
              don't require navigating away (which would disconnect voice). */}
          <button
            type='button'
            onClick={() => setAudioSettingsOpen(o => !o)}
            title='Voice & Audio Settings'
            aria-label='Voice and Audio Settings'
            aria-expanded={audioSettingsOpen}
            className={cn(
              'rounded p-1 transition-colors',
              audioSettingsOpen
                ? 'bg-[#3a3c41] text-white'
                : 'text-gray-400 hover:bg-[#3a3c41] hover:text-white',
            )}
          >
            {/* Sliders / tune icon */}
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
              <path d='M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z' />
            </svg>
          </button>

          {/* Settings gear */}
          {isAuthenticated ? (
            <Link
              href={settingsHref}
              title='User Settings'
              aria-label='User Settings'
              className='rounded p-1 text-gray-400 hover:bg-[#3a3c41] hover:text-white'
            >
              <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' focusable='false'>
                <path d='M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' />
              </svg>
            </Link>
          ) : (
            <Link
              href='/auth/login'
              title='Log In'
              className='rounded bg-[#5865f2] px-2 py-1 text-xs font-medium text-white hover:bg-[#4752c4]'
            >
              Log In
            </Link>
          )}
        </div>

        {/* Floating voice settings panel */}
        {audioSettingsOpen && <VoiceSettingsPopover onClose={() => setAudioSettingsOpen(false)} />}
      </div>
    </div>
  );
}
