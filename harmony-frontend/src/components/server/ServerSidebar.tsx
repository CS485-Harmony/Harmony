/**
 * Server Component: ServerSidebar
 * Displays server info and list of other public channels for navigation.
 * Currently used in the guest public-channel view.
 * Based on dev spec C1.6 ServerSidebar.
 */

import Link from 'next/link';
import type { PublicChannelListItem } from '@/services/publicApiService';

interface ServerSidebarProps {
  serverInfo: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  publicChannels: PublicChannelListItem[];
  currentChannelId?: string;
}

export function ServerSidebar({
  serverInfo,
  publicChannels,
  currentChannelId,
}: ServerSidebarProps) {
  return (
    <aside className='flex w-60 shrink-0 flex-col overflow-hidden bg-[#2f3136]'>
      {/* Server name header */}
      <div className='flex h-12 shrink-0 items-center border-b border-black/20 px-4 shadow-sm'>
        <h2 className='truncate text-sm font-semibold text-white'>{serverInfo.name}</h2>
      </div>

      {/* Channel list */}
      <nav className='flex-1 overflow-y-auto px-2 py-2' aria-label='Public channels'>
        <p className='mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400'>
          Public Channels
        </p>

        {publicChannels.length === 0 ? (
          <p className='px-2 py-1 text-xs text-gray-500'>No public channels</p>
        ) : (
          <ul className='space-y-0.5'>
            {publicChannels.map(channel => {
              const isActive = channel.id === currentChannelId;
              return (
                <li key={channel.id}>
                  <Link
                    href={`/c/${serverInfo.slug}/${channel.slug}`}
                    title={channel.topic}
                    className={`flex items-center gap-1.5 rounded px-2 py-1 text-sm transition-colors ${
                      isActive
                        ? 'bg-[#3d4148] font-medium text-white'
                        : 'text-gray-400 hover:bg-[#35373c] hover:text-gray-200'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className='shrink-0 text-gray-500' aria-hidden='true'>
                      #
                    </span>
                    <span className='truncate'>{channel.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* Server description footer */}
      {serverInfo.description && (
        <div className='shrink-0 border-t border-black/20 px-4 py-3'>
          <p className='text-xs text-gray-500 line-clamp-3'>{serverInfo.description}</p>
        </div>
      )}
    </aside>
  );
}
