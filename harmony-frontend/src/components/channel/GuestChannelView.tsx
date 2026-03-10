/**
 * GuestChannelView — simplified layout for anonymous public channel access.
 * No ServerRail, no ChannelSidebar, no MessageInput.
 * Wraps content in VisibilityGuard so PRIVATE channels show AccessDeniedPage.
 * Ref: dev-spec-guest-public-channel-view.md — M1, C1.1 PublicChannelPage
 */

import { notFound } from 'next/navigation';
import {
  fetchPublicServer,
  fetchPublicChannel,
  fetchPublicMessages,
} from '@/services/publicApiService';
import { AuthRedirect } from '@/components/channel/AuthRedirect';
import { VisibilityGuard } from '@/components/channel/VisibilityGuard';
import { MessageList } from '@/components/channel/MessageList';
import { GuestPromoBanner } from '@/components/channel/GuestPromoBanner';
import { ChannelVisibility } from '@/types';
import type { Server, Channel } from '@/types';

type PublicServer = Omit<Server, 'ownerId'>;

// ─── Guest Header ─────────────────────────────────────────────────────────────

function GuestHeader({ server, memberCount }: { server: PublicServer; memberCount: number }) {
  return (
    <header className='flex h-14 shrink-0 items-center gap-3 border-b border-black/20 bg-[#2f3136] px-4'>
      {/* Harmony logo wordmark */}
      <span className='text-lg font-bold text-[#5865f2]'>Harmony</span>

      {/* Divider */}
      <span className='text-gray-600' aria-hidden='true'>
        /
      </span>

      {/* Server name */}
      <span className='text-sm font-semibold text-white'>{server.name}</span>

      {/* Member count */}
      <span className='ml-auto flex items-center gap-1.5 text-xs text-gray-400'>
        <svg
          className='h-3.5 w-3.5'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
          focusable='false'
        >
          <path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' />
        </svg>
        {memberCount.toLocaleString()} members
      </span>
    </header>
  );
}

// ─── Channel Header ───────────────────────────────────────────────────────────

function ChannelHeader({ channel }: { channel: Channel }) {
  return (
    <div className='flex shrink-0 items-center gap-2 border-b border-black/20 bg-[#36393f] px-4 py-3'>
      <svg
        className='h-5 w-5 shrink-0 text-gray-400'
        viewBox='0 0 24 24'
        fill='currentColor'
        aria-hidden='true'
        focusable='false'
      >
        <path d='M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.871 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41001 9L8.35001 15H14.35L15.41 9H9.41001Z' />
      </svg>
      <h1 className='text-sm font-semibold text-white'>{channel.name}</h1>
      {channel.topic && (
        <>
          <span className='text-gray-600' aria-hidden='true'>
            |
          </span>
          <p className='truncate text-sm text-gray-400'>{channel.topic}</p>
        </>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface GuestChannelViewProps {
  serverSlug: string;
  channelSlug: string;
}

export async function GuestChannelView({ serverSlug, channelSlug }: GuestChannelViewProps) {
  const [server, channelResult] = await Promise.all([
    fetchPublicServer(serverSlug),
    fetchPublicChannel(serverSlug, channelSlug),
  ]);

  if (!server || !channelResult) notFound();

  if (channelResult.isPrivate) {
    return (
      <div className='flex h-screen flex-col overflow-hidden bg-[#36393f] font-sans'>
        <AuthRedirect to={`/channels/${serverSlug}/${channelSlug}`} />
        <GuestHeader server={server} memberCount={server.memberCount ?? 0} />
        <VisibilityGuard visibility={ChannelVisibility.PRIVATE} isLoading={false}>
          {null}
        </VisibilityGuard>
      </div>
    );
  }

  const { channel } = channelResult;
  const { messages } = await fetchPublicMessages(channel.id);
  const sortedMessages = [...messages].reverse();
  const memberCount = server.memberCount ?? 0;

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-[#36393f] font-sans'>
      <AuthRedirect to={`/channels/${serverSlug}/${channelSlug}`} />
      <GuestHeader server={server} memberCount={memberCount} />

      <VisibilityGuard visibility={channel.visibility} isLoading={false}>
        <div className='flex flex-1 flex-col overflow-hidden'>
          <ChannelHeader channel={channel} />

          <div className='flex flex-1 flex-col overflow-hidden'>
            <MessageList key={channel.id} channel={channel} messages={sortedMessages} />
            <GuestPromoBanner serverName={server.name} memberCount={memberCount} />
          </div>
        </div>
      </VisibilityGuard>
    </div>
  );
}
