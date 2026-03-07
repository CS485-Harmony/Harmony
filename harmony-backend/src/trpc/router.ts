import { router, publicProcedure } from './init';
import { channelRouter } from './routers/channel.router';
import { serverRouter } from './routers/server.router';
import { userRouter } from './routers/user.router';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  channel: channelRouter,
  server: serverRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
