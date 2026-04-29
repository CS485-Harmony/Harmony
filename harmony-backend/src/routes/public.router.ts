import { Router, Request, Response } from 'express';
import type { Store } from 'express-rate-limit';
import { prisma } from '../db/prisma';
import { ChannelVisibility } from '@prisma/client';
import { createLogger } from '../lib/logger';
import { cacheMiddleware } from '../middleware/cache.middleware';
import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from '../services/cache.service';
import { createPublicRateLimiter } from '../middleware/rate-limit.middleware';
import { metaTagService } from '../services/metaTag/metaTagService';
import { inviteService } from '../services/invite.service';

const logger = createLogger({ component: 'public-router' });

/**
 * Factory so createApp() can inject a rate-limit store (e.g. a mock in tests
 * or a RedisStore in production) without requiring a real Redis connection in
 * every test that imports the public router.
 */
export function createPublicRouter(store?: Store) {
  const router = Router();

  // Redis-backed rate limiting per Issue #318: 100 req/min per IP, shared across replicas
  router.use(createPublicRateLimiter(store));

  /**
   * GET /api/public/channels/:channelId/messages
   * Returns paginated messages for a PUBLIC_INDEXABLE channel.
   * Uses cache middleware with stale-while-revalidate.
   */
  router.get(
    '/channels/:channelId/messages',
    cacheMiddleware({
      ttl: CacheTTL.channelMessages,
      staleTtl: CacheTTL.channelMessages, // keep stale data for an extra TTL window
      keyFn: (req: Request) =>
        CacheKeys.channelMessages(req.params.channelId, Number(req.query.page) || 1),
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
        logger.error({ err, channelId: req.params.channelId }, 'Public messages route failed');
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
  router.get(
    '/channels/:channelId/messages/:messageId',
    cacheMiddleware({
      ttl: CacheTTL.channelMessages,
      staleTtl: CacheTTL.channelMessages,
      keyFn: (req: Request) =>
        `channel:msg:${sanitizeKeySegment(req.params.channelId)}:${sanitizeKeySegment(req.params.messageId)}`,
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
        logger.error(
          { err, channelId: req.params.channelId, messageId: req.params.messageId },
          'Public message route failed',
        );
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    },
  );

  /**
   * GET /api/public/servers
   * Returns a list of public servers ordered by member count (desc).
   * Used by the home page to discover a default public channel to show visitors.
   */
  router.get('/servers', async (_req: Request, res: Response) => {
    try {
      const servers = await prisma.server.findMany({
        where: { isPublic: true },
        orderBy: { memberCount: 'desc' },
        take: 20,
        select: {
          id: true,
          name: true,
          slug: true,
          iconUrl: true,
          description: true,
          memberCount: true,
          createdAt: true,
        },
      });
      res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
      res.json(servers);
    } catch (err) {
      logger.error({ err }, 'Public servers list route failed');
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/public/servers/:serverSlug
   * Returns public server info. Uses getOrRevalidate for SWR.
   * Cache key: server:{serverId}:info per §4.4.
   */
  router.get('/servers/:serverSlug', async (req: Request, res: Response) => {
    try {
      const server = await prisma.server.findUnique({
        where: { slug: req.params.serverSlug, isPublic: true },
        select: {
          id: true,
          name: true,
          slug: true,
          iconUrl: true,
          description: true,
          memberCount: true,
          createdAt: true,
        },
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
      } catch (err) {
        logger.warn({ err, cacheKey }, 'Failed to inspect public server cache state');
      }

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
      logger.error({ err, serverSlug: req.params.serverSlug }, 'Public server route failed');
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/public/servers/:serverSlug/channels
   * Returns public channels for a server. Uses getOrRevalidate for SWR.
   * Cache key: server:{serverId}:public_channels per §4.4.
   */
  router.get('/servers/:serverSlug/channels', async (req: Request, res: Response) => {
    try {
      const server = await prisma.server.findUnique({
        where: { slug: req.params.serverSlug, isPublic: true },
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
      } catch (err) {
        logger.warn({ err, cacheKey }, 'Failed to inspect public channel cache state');
      }

      const data = await cacheService.getOrRevalidate(cacheKey, fetcher, cacheOpts);

      res.set('X-Cache', xCache);
      res.set('X-Cache-Key', cacheKey);
      res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
      res.json(data);
    } catch (err) {
      logger.error({ err, serverSlug: req.params.serverSlug }, 'Public channels route failed');
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/public/servers/:serverSlug/channels/:channelSlug
   * Returns channel info by slug. Returns 403 for PRIVATE channels, 404 if not found.
   * Supports PUBLIC_INDEXABLE and PUBLIC_NO_INDEX channels for guest access.
   */
  router.get('/servers/:serverSlug/channels/:channelSlug', async (req: Request, res: Response) => {
    try {
      const server = await prisma.server.findUnique({
        where: { slug: req.params.serverSlug, isPublic: true },
        select: { id: true },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }

      const channel = await prisma.channel.findFirst({
        where: { serverId: server.id, slug: req.params.channelSlug },
        select: {
          id: true,
          name: true,
          slug: true,
          serverId: true,
          type: true,
          visibility: true,
          topic: true,
          position: true,
          createdAt: true,
        },
      });

      if (!channel) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      if (channel.visibility === ChannelVisibility.PRIVATE) {
        res.status(403).json({ error: 'Channel is private' });
        return;
      }

      res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
      res.json(channel);
    } catch (err) {
      logger.error(
        { err, serverSlug: req.params.serverSlug, channelSlug: req.params.channelSlug },
        'Public channel route failed',
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/public/servers/:serverSlug/channels/:channelSlug/meta-tags
   * Returns the persisted/generated metadata for guest-accessible channels so
   * the frontend generateMetadata path reads the same SEO source of truth that
   * admins preview and edit.
   */
  router.get(
    '/servers/:serverSlug/channels/:channelSlug/meta-tags',
    async (req: Request, res: Response) => {
      try {
        const channel = await prisma.channel.findFirst({
          where: {
            slug: req.params.channelSlug,
            server: { slug: req.params.serverSlug },
            visibility: { not: ChannelVisibility.PRIVATE },
          },
          select: {
            id: true,
            visibility: true,
          },
        });

        if (!channel) {
          res.status(404).json({ error: 'Channel not found' });
          return;
        }

        let preview;
        try {
          preview = await metaTagService.getMetaTagsForPreview(channel.id);
        } catch (previewErr) {
          logger.warn(
            {
              err: previewErr,
              serverSlug: req.params.serverSlug,
              channelSlug: req.params.channelSlug,
              channelId: channel.id,
            },
            'Primary public meta tag preview failed; falling back to on-the-fly generation',
          );
          try {
            preview = await metaTagService.getFallbackMetaTagsForPreview(channel.id);
          } catch (fallbackErr) {
            logger.warn(
              {
                err: fallbackErr,
                serverSlug: req.params.serverSlug,
                channelSlug: req.params.channelSlug,
                channelId: channel.id,
              },
              'Fallback public meta tag preview generation also failed',
            );
            throw fallbackErr;
          }
        }
        res.set('Cache-Control', 'public, max-age=60');
        res.json({
          ...preview,
          visibility: channel.visibility,
        });
      } catch (err) {
        logger.error(
          { err, serverSlug: req.params.serverSlug, channelSlug: req.params.channelSlug },
          'Public meta tags route failed',
        );
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error' });
        }
      }
    },
  );

  /**
   * GET /api/public/invites/:code
   * Returns server preview info for an invite code without consuming it.
   * Returns 404 if code is unknown, expired, or exhausted.
   */
  router.get('/invites/:code', async (req: Request, res: Response) => {
    try {
      const preview = await inviteService.preview(req.params.code);
      if (!preview) {
        res.status(404).json({ error: 'Invite not found or no longer valid' });
        return;
      }
      res.set('Cache-Control', 'no-store');
      res.json(preview);
    } catch (err) {
      logger.error({ err, code: req.params.code }, 'Public invite preview route failed');
      if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
