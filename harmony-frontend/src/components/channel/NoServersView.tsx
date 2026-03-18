'use client';

/**
 * NoServersView — shown on /channels when the user hasn't joined any servers.
 * Gives them a direct path to create one rather than a dead-end message.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateServerModal } from '@/components/server-rail/CreateServerModal';
import type { Server, Channel } from '@/types';

export function NoServersView() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreated(server: Server, defaultChannel: Channel) {
    router.push(`/channels/${server.slug}/${defaultChannel.slug}`);
  }

  return (
    <div className='flex h-screen items-center justify-center bg-[#36393f]'>
      <div className='text-center'>
        <p className='text-xl font-bold text-white'>No servers yet</p>
        <p className='mt-2 text-sm text-gray-400'>
          You haven&apos;t joined any servers. Create one to get started.
        </p>
        <button
          type='button'
          onClick={() => setIsModalOpen(true)}
          className='mt-6 rounded bg-[#5865f2] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4752c4]'
        >
          Create a Server
        </button>
      </div>

      <CreateServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
