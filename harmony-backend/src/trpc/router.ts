import { router, publicProcedure } from './init';
import { channelRouter } from './routers/channel.router';
import { userRouter } from './routers/user.router';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  channel: channelRouter,
});

export type AppRouter = typeof appRouter;
