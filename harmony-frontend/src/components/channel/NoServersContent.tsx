'use client';

/**
 * NoServersContent — empty-state content rendered inside EmptyShell when the
 * user has no server memberships. Offers paths to browse public servers or
 * create a new one.
 *
 * Designed to be mounted as children of EmptyShell, which provides the outer
 * 3-column layout (ServerRail + empty main area) and owns the modal state via
 * EmptyShellModalContext. Buttons delegate to those shell-owned modals so there
 * is only one modal tree on the page.
 */

import { useEmptyShellModals } from '@/components/layout/EmptyShell';

export function NoServersContent() {
  const shellModals = useEmptyShellModals();

  return (
    <div className='text-center'>
      <p className='text-xl font-bold text-white'>No servers yet</p>
      <p className='mt-2 text-sm text-gray-400'>
        You haven&apos;t joined any servers. Find a community or create your own.
      </p>

      <div className='mt-6 flex justify-center gap-3'>
        <button
          type='button'
          onClick={() => shellModals?.openBrowseServers()}
          className='rounded bg-[#3ba55c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2d7d46]'
        >
          Browse Servers
        </button>
        <button
          type='button'
          onClick={() => shellModals?.openCreateServer()}
          className='rounded bg-[#5865f2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4752c4]'
        >
          Create a Server
        </button>
      </div>
    </div>
  );
}
