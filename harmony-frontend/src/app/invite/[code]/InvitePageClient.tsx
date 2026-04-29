'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { redeemInviteAction } from './actions';
import { getUserErrorMessage } from '@/lib/utils';

interface InvitePreview {
  code: string;
  server: {
    id: string;
    name: string;
    slug: string;
    iconUrl: string | null;
    description: string | null;
    memberCount: number;
  };
  uses: number;
  maxUses: number | null;
  expiresAt: string | null;
}

export function InvitePageClient({ preview, code }: { preview: InvitePreview; code: string }) {
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { server } = preview;
  const initials = server.name
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  async function handleJoin() {
    setJoining(true);
    setError(null);
    try {
      const { serverSlug, channelSlug } = await redeemInviteAction(code);
      router.push(`/channels/${serverSlug}/${channelSlug}`);
    } catch (err) {
      setError(getUserErrorMessage(err, 'Could not join server. Please try again.'));
      setJoining(false);
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#313338]'>
      <div className='w-full max-w-sm rounded-lg bg-[#36393f] p-8 text-center shadow-xl'>
        {/* Server icon */}
        <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[30px] bg-[#5865f2] text-2xl font-bold text-white'>
          {server.iconUrl ? (
            <Image
              src={server.iconUrl}
              alt={server.name}
              width={80}
              height={80}
              unoptimized
              className='h-full w-full object-cover'
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <p className='mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400'>
          You have been invited to join
        </p>
        <h1 className='mb-1 text-2xl font-bold text-white'>{server.name}</h1>
        {server.description && (
          <p className='mb-2 text-sm text-gray-400'>{server.description}</p>
        )}
        <p className='mb-6 text-xs text-gray-500'>
          {server.memberCount.toLocaleString()} member{server.memberCount !== 1 ? 's' : ''}
        </p>

        {error && (
          <p role='alert' className='mb-4 text-sm text-red-400'>
            {error}
          </p>
        )}

        <button
          type='button'
          onClick={handleJoin}
          disabled={joining}
          className='w-full rounded bg-[#5865f2] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4] disabled:opacity-60'
        >
          {joining ? 'Joining…' : 'Accept Invite'}
        </button>
      </div>
    </div>
  );
}
