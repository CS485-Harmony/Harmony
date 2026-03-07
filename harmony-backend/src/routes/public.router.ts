import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '../db/prisma';
import { ChannelVisibility } from '@prisma/client';
import { cacheMiddleware } from '../middleware/cache.middleware';
import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from '../services/cache.service';

export const publicRouter = Router();

// Guest rate limiter per §5.3: 60 req / 1 min per IP
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

publicRouter.use(publicLimiter);

/**
 * GET /api/public/channels/:channelId/messages
 * Returns paginated messages for a PUBLIC_INDEXABLE channel.
 * Uses cache middleware with stale-while-revalidate.
 */
publicRouter.get(
  '/channels/:channelId/messages',
  cacheMiddleware({
    ttl: CacheTTL.channelMessages,
    staleTtl: CacheTTL.channelMessages, // keep stale data for an extra TTL window
    keyFn: (req: Request) => CacheKeys.channelMessages(req.params.channelId, Number(req.query.page) || 1),
  }),
  async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = 50;

      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        select: { id: true, visibility: true },
      });

      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      const messages = await prisma.message.findMany({
        where: { channelId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          content: true,
          createdAt: true,
          editedAt: true,
          author: { select: { id: true, username: true } },
        },
      });

      res.set('Cache-Control', `public, max-age=${CacheTTL.channelMessages}`);
      res.json({ messages, page, pageSize });
    } catch (err) {
      console.error('Public messages route error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
);

/**
 * GET /api/public/channels/:channelId/messages/:messageId
 * Returns a single message from a PUBLIC_INDEXABLE channel.
 * Uses cache middleware with stale-while-revalidate.
 */
publicRouter.get(
  '/channels/:channelId/messages/:messageId',
  cacheMiddleware({
    ttl: CacheTTL.channelMessages,
    staleTtl: CacheTTL.channelMessages,
    keyFn: (req: Request) => `channel:msg:${sanitizeKeySegment(req.params.channelId)}:${sanitizeKeySegment(req.params.messageId)}`,
  }),
  async (req: Request, res: Response) => {
    try {
      const { channelId, messageId } = req.params;

      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        select: { id: true, visibility: true },
      });

      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      const message = await prisma.message.findFirst({
        where: { id: messageId, channelId, isDeleted: false },
        select: {
          id: true,
          content: true,
          createdAt: true,
          editedAt: true,
          author: { select: { id: true, username: true } },
        },
      });

      if (!message) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }

      res.set('Cache-Control', `public, max-age=${CacheTTL.channelMessages}`);
      res.json(message);
    } catch (err) {
      console.error('Public message route error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
);

/**
 * GET /api/public/servers/:serverSlug
 * Returns public server info. Uses getOrRevalidate for SWR.
 * Cache key: server:{serverId}:info per §4.4.
 */
publicRouter.get(
  '/servers/:serverSlug',
  async (req: Request, res: Response) => {
    try {
      const server = await prisma.server.findUnique({
        where: { slug: req.params.serverSlug },
        select: { id: true, name: true, slug: true, iconUrl: true, description: true, memberCount: true, createdAt: true },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }

      const cacheKey = CacheKeys.serverInfo(server.id);
      const cacheOpts = { ttl: CacheTTL.serverInfo, staleTtl: CacheTTL.serverInfo };

      // Check cache state for X-Cache header
      let xCache = 'MISS';
      try {
        const entry = await cacheService.get(cacheKey);
        if (entry) {
          xCache = cacheService.isStale(entry, CacheTTL.serverInfo) ? 'STALE' : 'HIT';
        }
      } catch { /* Redis error */ }

      const data = await cacheService.getOrRevalidate(
        cacheKey,
        async () => server, // fetcher — server already fetched from DB above
        cacheOpts,
      );

      res.set('X-Cache', xCache);
      res.set('X-Cache-Key', cacheKey);
      res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
      res.json(data);
    } catch (err) {
      console.error('Public server route error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * GET /api/public/servers/:serverSlug/channels
 * Returns public channels for a server. Uses getOrRevalidate for SWR.
 * Cache key: server:{serverId}:public_channels per §4.4.
 */
publicRouter.get(
  '/servers/:serverSlug/channels',
  async (req: Request, res: Response) => {
    try {
      const server = await prisma.server.findUnique({
        where: { slug: req.params.serverSlug },
        select: { id: true },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }

      const cacheKey = `server:${sanitizeKeySegment(server.id)}:public_channels`;
      const cacheOpts = { ttl: CacheTTL.serverInfo, staleTtl: CacheTTL.serverInfo };

      const fetcher = async () => {
        const channels = await prisma.channel.findMany({
          where: { serverId: server.id, visibility: ChannelVisibility.PUBLIC_INDEXABLE },
          orderBy: { position: 'asc' },
          select: { id: true, name: true, slug: true, type: true, topic: true },
        });
        return { channels };
      };

      // Check cache state for X-Cache header
      let xCache = 'MISS';
      try {
        const entry = await cacheService.get(cacheKey);
        if (entry) {
          xCache = cacheService.isStale(entry, CacheTTL.serverInfo) ? 'STALE' : 'HIT';
        }
      } catch { /* Redis error */ }

      const data = await cacheService.getOrRevalidate(cacheKey, fetcher, cacheOpts);

      res.set('X-Cache', xCache);
      res.set('X-Cache-Key', cacheKey);
      res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
      res.json(data);
    } catch (err) {
      console.error('Public channels route error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);
