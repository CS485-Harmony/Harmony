/**
 * Channel Component: VisibilityToggle (Issue #30)
 * Three-option radio group for setting channel visibility.
 * Calls updateChannelVisibility server action and shows a toast on success/error.
 * Ref: dev-spec-channel-visibility-toggle.md — C1.2 VisibilityToggle
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { cn, getUserErrorMessage } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { ChannelVisibility } from '@/types';
import { updateChannelVisibility } from '@/app/settings/[serverSlug]/[channelSlug]/updateVisibility';

// ─── Option definitions ───────────────────────────────────────────────────────

interface VisibilityOption {
  value: ChannelVisibility;
  label: string;
  description: string;
  icon: React.ReactNode;
}

function GlobeIcon() {
  return (
    <svg
      className='h-5 w-5 shrink-0'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='10' />
      <path d='M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className='h-5 w-5 shrink-0'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className='h-5 w-5 shrink-0'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
      <path d='M7 11V7a5 5 0 0 1 10 0v4' />
    </svg>
  );
}

const OPTIONS: VisibilityOption[] = [
  {
    value: ChannelVisibility.PUBLIC_INDEXABLE,
    label: 'Public (Search Indexed)',
    description: 'Visible to search engines and anyone with the link.',
    icon: <GlobeIcon />,
  },
  {
    value: ChannelVisibility.PUBLIC_NO_INDEX,
    label: 'Public (Not Indexed)',
    description: 'Anyone with the link can view; not indexed by search engines.',
    icon: <EyeIcon />,
  },
  {
    value: ChannelVisibility.PRIVATE,
    label: 'Private',
    description: 'Only server members can access this channel.',
    icon: <LockIcon />,
  },
];

// ─── Confirmation Modal ───────────────────────────────────────────────────────

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmPrivateModal({ onConfirm, onCancel }: ConfirmModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button on open and restore the previously focused element on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    return () => {
      previouslyFocused?.focus();
    };
  }, []);

  // Trap focus inside the modal and handle Escape.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }
      if (e.key !== 'Tab') return;
      const container = containerRef.current;
      if (!container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      ref={containerRef}
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-private-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
    >
      <div className='w-full max-w-sm rounded-lg bg-[#36393f] p-6 shadow-xl'>
        <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20'>
          <LockIcon />
        </div>
        <h2 id='confirm-private-title' className='mb-2 text-lg font-semibold text-white'>
          Make channel private?
        </h2>
        <p className='mb-6 text-sm text-gray-400'>
          This will remove the channel from search engines and block guest access. Only server
          members will be able to view it.
        </p>
        <div className='flex gap-3'>
          <button
            ref={cancelRef}
            type='button'
            onClick={onCancel}
            className='flex-1 rounded px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-[#40444b]'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className='flex-1 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700'
          >
            Make Private
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface VisibilityToggleProps {
  serverSlug: string;
  channelSlug: string;
  initialVisibility: ChannelVisibility;
  /** When true, the control is rendered but not interactive (non-admin users). */
  disabled?: boolean;
  /** Called after a successful visibility change so parent components can refresh. */
  onVisibilityChanged?: (newVisibility: ChannelVisibility) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VisibilityToggle({
  serverSlug,
  channelSlug,
  initialVisibility,
  disabled = false,
  onVisibilityChanged,
}: VisibilityToggleProps) {
  const { showToast } = useToast();
  const [selected, setSelected] = useState<ChannelVisibility>(initialVisibility);
  const [pending, setPending] = useState<ChannelVisibility | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // Tracks which option owns tabIndex=0 for roving tabindex. Kept separate from
  // `selected` so arrow keys can move focus without immediately triggering saves.
  const [focusedIdx, setFocusedIdx] = useState(() =>
    Math.max(0, OPTIONS.findIndex((o) => o.value === initialVisibility)),
  );
  // Re-entrancy lock — prevents concurrent saves from a fast double-click.
  const isSavingRef = useRef(false);
  // Refs for roving tabindex arrow-key navigation.
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  async function applyVisibility(visibility: ChannelVisibility) {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    // Capture previous value for rollback on error.
    const previousVisibility = selected;
    // Optimistic update: show the new value immediately.
    setSelected(visibility);
    setFocusedIdx(OPTIONS.findIndex((o) => o.value === visibility));
    setIsLoading(true);
    try {
      await updateChannelVisibility(serverSlug, channelSlug, visibility);
      showToast({ message: 'Channel visibility updated.', type: 'success' });
      onVisibilityChanged?.(visibility);
    } catch (err) {
      // Rollback optimistic update on failure.
      setSelected(previousVisibility);
      setFocusedIdx(OPTIONS.findIndex((o) => o.value === previousVisibility));
      showToast({
        message: getUserErrorMessage(err, 'Failed to update visibility.'),
        type: 'error',
      });
    } finally {
      isSavingRef.current = false;
      setIsLoading(false);
    }
  }

  function handleSelect(value: ChannelVisibility) {
    if (disabled || isLoading || value === selected) return;
    setFocusedIdx(OPTIONS.findIndex((o) => o.value === value));
    if (value === ChannelVisibility.PRIVATE) {
      setPending(value);
      setShowConfirm(true);
    } else {
      void applyVisibility(value);
    }
  }

  function handleConfirm() {
    setShowConfirm(false);
    if (pending) void applyVisibility(pending);
    setPending(null);
  }

  function handleCancel() {
    setShowConfirm(false);
    setPending(null);
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    // Space/Enter commits the focused option (triggers save or confirmation modal).
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleSelect(OPTIONS[index].value);
      return;
    }
    // Arrow keys only move focus — selection requires explicit Space/Enter.
    // This prevents accidental saves while keyboard-browsing the options.
    const count = OPTIONS.length;
    let nextIndex: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + count) % count;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      setFocusedIdx(nextIndex);
      buttonRefs.current[nextIndex]?.focus();
    }
  }

  return (
    <>
      {showConfirm && <ConfirmPrivateModal onConfirm={handleConfirm} onCancel={handleCancel} />}

      <div className='max-w-lg space-y-6'>
        <div>
          <h2 className='mb-1 text-xl font-semibold text-white'>Channel Visibility</h2>
          <p className='text-sm text-gray-400'>
            Control who can discover and view this channel.
          </p>
        </div>

        {/* Radio group */}
        <div
          role='radiogroup'
          aria-label='Channel visibility'
          aria-busy={isLoading}
          className='space-y-2'
        >
          {OPTIONS.map((opt, idx) => {
            const isSelected = selected === opt.value;
            const isDisabled = disabled || isLoading;

            return (
              <button
                key={opt.value}
                ref={(el) => { buttonRefs.current[idx] = el; }}
                type='button'
                role='radio'
                aria-checked={isSelected}
                disabled={isDisabled}
                tabIndex={idx === focusedIdx ? 0 : -1}
                onClick={() => handleSelect(opt.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={cn(
                  'flex w-full items-start gap-4 rounded-md border px-4 py-3 text-left',
                  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2]',
                  isSelected
                    ? 'border-[#5865f2] bg-[#5865f2]/20 text-white'
                    : 'border-[#40444b] bg-[#2f3136] text-gray-300 hover:border-[#5865f2]/50 hover:bg-[#36393f]',
                  isDisabled && 'cursor-not-allowed opacity-50',
                )}
              >
                {/* Icon */}
                <span
                  className={cn(
                    'mt-0.5',
                    isSelected ? 'text-[#5865f2]' : 'text-gray-400',
                  )}
                >
                  {opt.icon}
                </span>

                {/* Label + description */}
                <span className='flex flex-col gap-0.5'>
                  <span className='text-sm font-semibold'>{opt.label}</span>
                  <span className='text-xs text-gray-400'>{opt.description}</span>
                </span>

                {/* Selected indicator */}
                {isSelected && (
                  <span className='ml-auto mt-0.5 shrink-0 text-[#5865f2]' aria-hidden='true'>
                    <svg
                      className='h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2.5}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M20 6 9 17l-5-5' />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {isLoading && (
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
            Saving…
          </div>
        )}

        {disabled && (
          <p className='text-xs text-gray-500'>Only administrators can change channel visibility.</p>
        )}
      </div>
    </>
  );
}
