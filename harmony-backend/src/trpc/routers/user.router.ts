import { z } from 'zod';
import { UserStatus } from '@prisma/client';
import { router, authedProcedure } from '../init';
import { userService } from '../../services/user.service';

const UserStatusSchema = z.nativeEnum(UserStatus);

export const userRouter = router({
  getCurrentUser: authedProcedure.query(({ ctx }) =>
    userService.getCurrentUser(ctx.userId),
  ),

  getUser: authedProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(({ input }) => userService.getUser(input.userId)),

  updateUser: authedProcedure
    .input(
      z.object({
        displayName: z.string().trim().min(1).max(100).optional(),
        avatarUrl: z.string().url().regex(/^https?:\/\//).max(500).nullable().optional(),
        publicProfile: z.boolean().optional(),
        status: UserStatusSchema.optional(),
      }),
    )
    .mutation(({ ctx, input }) => userService.updateUser(ctx.userId, input)),
});
