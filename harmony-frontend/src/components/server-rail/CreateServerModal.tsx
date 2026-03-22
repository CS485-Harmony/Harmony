'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { createServerAction } from '@/app/channels/actions';
import type { Server, Channel } from '@/types';
import { getUserErrorMessage } from '@/lib/utils';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (server: Server, defaultChannel: Channel) => void;
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function CreateServerModal({ isOpen, onClose, onCreated }: CreateServerModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setIsPublic(false);
      setError('');
      setCreating(false);
      // Delay focus so the modal has rendered
      requestAnimationFrame(() => nameInputRef.current?.focus());
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !creating) onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, creating]);

  // Focus trap
  const handleKeyDownModal = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'input, textarea, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
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
    },
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Server name is required.');
      return;
    }
    if (trimmed.length > 100) {
      setError('Server name must be 100 characters or fewer.');
      return;
    }
    if (!nameToSlug(trimmed)) {
      setError('Server name must contain at least one letter or number.');
      return;
    }

    setError('');
    setCreating(true);

    try {
      const { server, defaultChannel } = await createServerAction(trimmed, description.trim() || undefined, isPublic);
      showToast({ message: `Server "${server.name}" created!`, type: 'success' });
      onCreated(server, defaultChannel);
      onClose();
    } catch (err) {
      const message = getUserErrorMessage(err, 'Failed to create server.');
      setError(message);
      showToast({ message, type: 'error' });
    } finally {
      setCreating(false);
    }
  }

  if (!isOpen) return null;

  const slug = nameToSlug(name);

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
      onClick={creating ? undefined : onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='create-server-title'
    >
      <div
        ref={modalRef}
        className='w-full max-w-md rounded-lg bg-[#36393f] p-6 shadow-xl'
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDownModal}
      >
        <h2 id='create-server-title' className='mb-1 text-xl font-bold text-white'>
          Create a Server
        </h2>
        <p className='mb-5 text-sm text-gray-400'>
          Give your server a name and an optional description.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Server name */}
          <label
            htmlFor='server-name'
            className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'
          >
            Server Name <span className='text-red-400'>*</span>
          </label>
          <input
            ref={nameInputRef}
            id='server-name'
            type='text'
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder='My Awesome Server'
            disabled={creating}
            maxLength={100}
            className='mb-1 w-full rounded bg-[#1e1f22] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#5865f2] disabled:opacity-50'
          />
          {slug && (
            <p className='mb-4 text-xs text-gray-500'>
              Slug: <span className='text-gray-400'>{slug}</span>
            </p>
          )}
          {!slug && <div className='mb-4' />}

          {/* Description */}
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
            placeholder='What is this server about?'
            disabled={creating}
            rows={3}
            className='mb-4 w-full resize-none rounded bg-[#1e1f22] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#5865f2] disabled:opacity-50'
          />

          {/* Visibility */}
          <p className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-300'>
            Visibility
          </p>
          <div className='mb-4 flex gap-2'>
            <button
              type='button'
              onClick={() => setIsPublic(false)}
              disabled={creating}
              className={`flex-1 rounded border px-3 py-2 text-sm transition-colors ${
                !isPublic
                  ? 'border-[#5865f2] bg-[#5865f2]/10 text-white'
                  : 'border-[#3a3c41] bg-[#1e1f22] text-gray-400 hover:border-gray-500 hover:text-gray-300'
              } disabled:opacity-50`}
            >
              <span className='font-medium'>Private</span>
              <span className='mt-0.5 block text-[11px] opacity-70'>Invite only</span>
            </button>
            <button
              type='button'
              onClick={() => setIsPublic(true)}
              disabled={creating}
              className={`flex-1 rounded border px-3 py-2 text-sm transition-colors ${
                isPublic
                  ? 'border-[#3ba55c] bg-[#3ba55c]/10 text-white'
                  : 'border-[#3a3c41] bg-[#1e1f22] text-gray-400 hover:border-gray-500 hover:text-gray-300'
              } disabled:opacity-50`}
            >
              <span className='font-medium'>Public</span>
              <span className='mt-0.5 block text-[11px] opacity-70'>Listed in Browse</span>
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className='mb-3 text-sm text-red-400'>{error}</p>
          )}

          {/* Buttons */}
          <div className='flex justify-end gap-3'>
            <button
              type='button'
              onClick={onClose}
              disabled={creating}
              className='rounded px-4 py-2 text-sm font-medium text-gray-300 hover:text-white disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={creating || !name.trim()}
              className='rounded bg-[#5865f2] px-4 py-2 text-sm font-medium text-white hover:bg-[#4752c4] disabled:opacity-50'
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
