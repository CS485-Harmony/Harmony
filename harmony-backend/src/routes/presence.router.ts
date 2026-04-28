import { NextFunction, Router, Request, Response } from 'express';
import { UserStatus } from '@prisma/client';
import { z } from 'zod';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.middleware';
import { presenceService } from '../services/presence.service';

export const presenceRouter = Router();

const PresenceStatusSchema = z.enum([UserStatus.ONLINE, UserStatus.IDLE]);
const PresenceBodySchema = z.object({ status: PresenceStatusSchema });

presenceRouter.post(
  '/status',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = PresenceBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    try {
      await presenceService.renewLease((req as AuthenticatedRequest).userId, parsed.data.status);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
);
