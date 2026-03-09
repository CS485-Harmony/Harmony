import { initTRPC, TRPCError } from '@trpc/server';
import type { Request } from 'express';
import { authService } from '../services/auth.service';
import { permissionService, type Action } from '../services/permission.service';

export interface TRPCContext {
  userId: string | null;
  ip: string;
  userAgent: string;
}

export function createContext({ req }: { req: Request }): TRPCContext {
  let userId: string | null = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = authService.verifyAccessToken(authHeader.slice(7));
      userId = payload.sub;
    } catch {
      // Invalid token — context userId remains null; authedProcedure will reject
    }
  }

  return { userId, ip: req.ip ?? '', userAgent: req.get('user-agent') ?? '' };
}

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

/** Use for unauthenticated procedures (health, public REST). */
export const publicProcedure = t.procedure;

/** Use for all admin/authenticated tRPC procedures.
 *  Throws UNAUTHORIZED if no userId is present in context. */
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

/**
 * Returns a procedure that requires the caller to hold the given `action`
 * permission inside the server identified by `input.serverId`.
 *
 * Usage:
 *   withPermission('channel:create')
 *     .input(z.object({ serverId: z.string().uuid(), ... }))
 *     .mutation(...)
 *
 * The input schema MUST include `serverId: string` (UUID).
 *
 * Throws:
 *   - BAD_REQUEST  — `serverId` is absent from the input
 *   - FORBIDDEN    — caller is not a member, lacks the action, or the server
 *                    does not exist (NOT_FOUND is collapsed to FORBIDDEN to
 *                    prevent callers from probing arbitrary server UUIDs)
 */
export function withPermission(action: Action) {
  return authedProcedure.use(async ({ ctx, getRawInput, next }) => {
    const raw = await getRawInput();
    const input = raw as { serverId?: unknown };
    const serverId = input?.serverId;
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (typeof serverId !== 'string' || !UUID_RE.test(serverId)) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'serverId must be a valid UUID' });
    }
    try {
      await permissionService.requirePermission(ctx.userId, serverId, action);
    } catch (err) {
      if (err instanceof TRPCError && err.code === 'NOT_FOUND') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
      }
      throw err;
    }
    return next();
  });
}
