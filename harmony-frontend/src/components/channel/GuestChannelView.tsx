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
  fetchPublicChannels,
  fetchPublicMessages,
} from '@/services/publicApiService';
import { ServerSidebar } from '@/components/server/ServerSidebar';
import { getChannels } from '@/services/channelService';
import { TrpcHttpError } from '@/lib/trpc-errors';
import { AuthRedirect } from '@/components/channel/AuthRedirect';
import { joinServerAction } from '@/app/channels/actions';
import { VisibilityGuard } from '@/components/channel/VisibilityGuard';
import { MessageList } from '@/components/channel/MessageList';
import { GuestPromoBanner } from '@/components/channel/GuestPromoBanner';
import { GuestHeader } from '@/components/channel/GuestHeader';
import { PrivateChannelLockedPane } from '@/components/channel/PrivateChannelLockedPane';
import { GuestMessageSearch } from '@/components/channel/GuestMessageSearch';
import type { Channel } from '@/types';

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
      <GuestMessageSearch channelId={channel.id} channelName={channel.name} />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface GuestChannelViewProps {
  serverSlug: string;
  channelSlug: string;
}

export async function GuestChannelView({ serverSlug, channelSlug }: GuestChannelViewProps) {
  const [server, channelResult, publicChannels] = await Promise.all([
    fetchPublicServer(serverSlug),
    fetchPublicChannel(serverSlug, channelSlug),
    fetchPublicChannels(serverSlug),
  ]);

  if (!server || !channelResult) notFound();

  // Check if the authenticated user is a member of this server.
  // Only redirect members to the full /channels/ view; non-members stay here
  // so we don't create a redirect loop (ChannelPageContent → /c/ → /channels/ → loop).
  //
  // Error handling:
  //   - Success  → confirmed member; redirect to /channels/
  //   - 403      → confirmed non-member (valid token, no ServerMember row); stay on guest view
  //   - 401/other → expired/invalid token; membership unknown — still render AuthRedirect so
  //                 the client can redirect after the token is refreshed client-side.
  //                 If the user turns out not to be a member, ChannelPageContent will redirect
  //                 back here with a valid token and we'll get a 403, stopping any loop.
  let isMember = false;
  try {
    await getChannels(server.id);
    isMember = true;
  } catch (err: unknown) {
    // trpcQuery throws TrpcHttpError — check status directly rather than parsing
    // the message string, which would couple us to the error format in trpc-client.
    isMember = !(err instanceof TrpcHttpError && err.status === 403);
  }

  // Bind the server ID so GuestHeader (a client component) never imports next/cache directly.
  const boundJoinAction = joinServerAction.bind(null, server.id);

  if (channelResult.isPrivate) {
    return (
      <div className='flex h-screen flex-col overflow-hidden bg-[#36393f] font-sans'>
        {isMember && <AuthRedirect to={`/channels/${serverSlug}/${channelSlug}`} />}
        <GuestHeader server={server} joinAction={boundJoinAction} />
        <div className='flex flex-1 overflow-hidden'>
          <ServerSidebar serverInfo={server} publicChannels={publicChannels} />
          <PrivateChannelLockedPane mode='guest' />
        </div>
      </div>
    );
  }

  const { channel } = channelResult;
  const { messages } = await fetchPublicMessages(channel.id);
  const sortedMessages = [...messages].reverse();
  const memberCount = server.memberCount ?? 0;

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-[#36393f] font-sans'>
      {isMember && <AuthRedirect to={`/channels/${serverSlug}/${channelSlug}`} />}
      <GuestHeader server={server} joinAction={boundJoinAction} />

      <div className='flex flex-1 overflow-hidden'>
        <ServerSidebar
          serverInfo={server}
          publicChannels={publicChannels}
          currentChannelId={channel.id}
        />

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
    </div>
  );
}
