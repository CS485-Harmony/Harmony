/**
 * Public invite page: /invite/[code]
 * Fetches invite preview (server info) and lets authenticated users join.
 * Unauthenticated users are redirected to login with a returnUrl.
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/trpc-client';
import { InvitePageClient } from './InvitePageClient';
import { API_CONFIG } from '@/lib/constants';

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
  createdAt: string;
}

async function fetchInvitePreview(code: string): Promise<InvitePreview | null> {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/public/invites/${encodeURIComponent(code)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json() as Promise<InvitePreview>;
  } catch {
    return null;
  }
}

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const [preview, user] = await Promise.all([fetchInvitePreview(code), getSessionUser()]);

  if (!preview) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#313338]'>
        <div className='w-full max-w-sm rounded-lg bg-[#36393f] p-8 text-center shadow-xl'>
          <h1 className='mb-2 text-xl font-bold text-white'>Invite Invalid</h1>
          <p className='text-sm text-gray-400'>
            This invite link is expired, has reached its maximum uses, or does not exist.
          </p>
          <Link
            href='/channels'
            className='mt-6 inline-block rounded bg-[#5865f2] px-5 py-2 text-sm font-medium text-white hover:bg-[#4752c4]'
          >
            Go to Harmony
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect(`/auth/login?returnUrl=/invite/${code}`);
  }

  return <InvitePageClient preview={preview} code={code} />;
}
