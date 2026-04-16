'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface PrivateChannelLockedPaneProps {
  mode: 'guest' | 'member';
  fullScreen?: boolean;
}

export function PrivateChannelLockedPane({
  mode,
  fullScreen = false,
}: PrivateChannelLockedPaneProps) {
  const router = useRouter();
  const pathname = usePathname();
  const returnUrl = encodeURIComponent(pathname);
  const isGuest = mode === 'guest';

  return (
    <div
      className={
        fullScreen
          ? 'flex h-screen flex-1 items-center justify-center bg-[#36393f] p-8'
          : 'flex flex-1 items-center justify-center p-6 md:p-8'
      }
    >
      <div className='flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-white/10 bg-[#2f3136] px-6 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#40444b]'>
          <svg
            className='h-8 w-8 text-gray-300'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
          >
            <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
            <path d='M7 11V7a5 5 0 0 1 10 0v4' />
          </svg>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-white'>This channel is private</h2>
          <p className='mt-2 text-sm text-gray-400'>
            {isGuest
              ? 'Sign up or log in to request access to this channel.'
              : "You don't have permission to view this channel. You may need to join this server or contact an administrator to request access."}
          </p>
        </div>

        <div className='flex w-full flex-col gap-2'>
          {isGuest ? (
            <>
              <Link
                href={`/auth/signup?returnUrl=${returnUrl}`}
                className='flex w-full items-center justify-center rounded-md bg-[#5865f2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4]'
              >
                Create Account
              </Link>
              <Link
                href={`/auth/login?returnUrl=${returnUrl}`}
                className='flex w-full items-center justify-center rounded-md border border-white/20 bg-[#40444b] px-4 py-2.5 text-sm font-semibold text-gray-200 transition-colors hover:bg-[#3d4148]'
              >
                Log In
              </Link>
            </>
          ) : null}
          <button
            onClick={() => router.back()}
            className={
              isGuest
                ? 'flex w-full cursor-pointer items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:text-gray-200'
                : 'flex w-full cursor-pointer items-center justify-center rounded-md border border-white/20 bg-[#40444b] px-4 py-2.5 text-sm font-semibold text-gray-200 transition-colors hover:bg-[#3d4148]'
            }
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
