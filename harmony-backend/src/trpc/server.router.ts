import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, authedProcedure, publicProcedure } from './init';
import { ServerService } from '../services/server.service';

const serverService = new ServerService();

export const serverRouter = router({
  getServers: publicProcedure.query(async () => {
    return serverService.getServers();
  }),

  getServer: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const server = await serverService.getServer(input.slug);
      if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
      return server;
    }),

  createServer: authedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(2000).optional(),
        iconUrl: z.string().url().max(500).optional(),
        isPublic: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return serverService.createServer({ ...input, ownerId: ctx.userId });
    }),

  updateServer: authedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(2000).optional(),
        iconUrl: z.string().url().max(500).optional(),
        isPublic: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return serverService.updateServer(id, ctx.userId, data);
    }),

  deleteServer: authedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return serverService.deleteServer(input.id, ctx.userId);
    }),
});
