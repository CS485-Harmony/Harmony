import { router, publicProcedure } from './init';
import { channelRouter } from './routers/channel.router';
import { serverRouter } from './routers/server.router';
import { serverMemberRouter } from './routers/serverMember.router';
import { messageRouter } from './routers/message.router';
import { userRouter } from './routers/user.router';
import { attachmentRouter } from './routers/attachment.router';
import { voiceRouter } from './routers/voice.router';
import { reactionRouter } from './routers/reaction.router';
import { inviteRouter } from './routers/invite.router';
import { permissionRouter } from './routers/permission.router';
import { notificationRouter } from './routers/notification.router';
import { channelMemberRouter } from './routers/channelMember.router';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  channel: channelRouter,
  channelMember: channelMemberRouter,
  server: serverRouter,
  serverMember: serverMemberRouter,
  message: messageRouter,
  user: userRouter,
  attachment: attachmentRouter,
  voice: voiceRouter,
  reaction: reactionRouter,
  invite: inviteRouter,
  permission: permissionRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
