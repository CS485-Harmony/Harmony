import { router, publicProcedure } from './init';
import { channelRouter } from './routers/channel.router';
import { serverRouter } from './routers/server.router';
import { serverMemberRouter } from './routers/serverMember.router';
import { messageRouter } from './routers/message.router';
import { userRouter } from './routers/user.router';
import { attachmentRouter } from './routers/attachment.router';
import { voiceRouter } from './routers/voice.router';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  channel: channelRouter,
  server: serverRouter,
  serverMember: serverMemberRouter,
  message: messageRouter,
  user: userRouter,
  attachment: attachmentRouter,
  voice: voiceRouter,
});

export type AppRouter = typeof appRouter;
