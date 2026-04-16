/**
 * NoChannelsContent — empty-state content rendered inside EmptyShell when the
 * user is a member of the server but has no accessible text or announcement
 * channels (e.g. all channels are private and they lack the required role).
 *
 * Designed to be mounted as children of EmptyShell, which provides the outer
 * 3-column layout (ServerRail + ChannelSidebar with empty channel list).
 */

export function NoChannelsContent() {
  return (
    <div className='text-center'>
      <p className='text-xl font-bold text-white'>No accessible channels</p>
      <p className='mt-2 text-sm text-gray-400'>
        You don&apos;t have access to any channels in this server.
        <br />
        Contact a server admin to get access.
      </p>
    </div>
  );
}
