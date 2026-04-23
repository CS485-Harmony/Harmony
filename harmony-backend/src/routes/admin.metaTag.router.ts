/**
 * Admin meta-tag REST endpoints — Issue #353 (§9, §10)
 *
 * Routes:
 *   GET  /api/admin/channels/:channelId/meta-tags
 *   PUT  /api/admin/channels/:channelId/meta-tags
 *   POST /api/admin/channels/:channelId/meta-tags/jobs
 *   GET  /api/admin/channels/:channelId/meta-tags/jobs/:jobId
 *
 * Authorization: server admin only (ADMIN or OWNER role on the channel's server).
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.middleware';
import { metaTagRepository } from '../repositories/metaTag.repository';
import { metaTagService } from '../services/metaTag/metaTagService';
import { permissionService } from '../services/permission.service';
import { prisma } from '../db/prisma';
import { redis } from '../db/redis';
import { createLogger } from '../lib/logger';
import type {
  MetaTagPreview,
  MetaTagJobStatus,
  ChannelContext,
  ChannelVisibility as ServiceChannelVisibility,
  MessageContext,
} from '../services/metaTag/types';

const logger = createLogger({ component: 'admin-meta-tag-router' });

const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

// ─── Validation schemas ───────────────────────────────────────────────────────

const metaTagOverrideSchema = z.object({
  customTitle: z.string().max(70).optional().nullable(),
  customDescription: z.string().max(200).optional().nullable(),
  customOgImage: z.string().url().max(500).optional().nullable(),
});

// ─── Redis job helpers ────────────────────────────────────────────────────────

const JOB_TTL_SECONDS = 86400; // 24 hours
const IDEMPOTENCY_TTL_SECONDS = 60;

function jobKey(jobId: string): string {
  return `meta-tag:job:${jobId}`;
}

function idempotencyKey(channelId: string, key: string): string {
  return `meta-tag:idempotency:${channelId}:${key}`;
}

async function storeJob(job: MetaTagJobStatus): Promise<void> {
  await redis.set(jobKey(job.jobId), JSON.stringify(job), 'EX', JOB_TTL_SECONDS);
}

async function getJob(jobId: string): Promise<MetaTagJobStatus | null> {
  const raw = await redis.get(jobKey(jobId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MetaTagJobStatus;
  } catch {
    logger.warn(
      { jobId, key: jobKey(jobId) },
      'Failed to parse meta-tag job from Redis — treating as not found',
    );
    return null;
  }
}

// ─── Background regeneration ──────────────────────────────────────────────────

/**
 * Runs meta tag regeneration for a job that was previously stored in Redis as `queued`.
 * Transitions the job through `processing` → `succeeded` | `failed`.
 * Exported for direct use in tests.
 */
export async function processRegenerationJob(channelId: string, jobId: string): Promise<void> {
  const startedAt = new Date().toISOString();

  try {
    await storeJob({
      jobId,
      channelId,
      status: 'processing',
      attempts: 1,
      startedAt,
      completedAt: null,
      errorCode: null,
      errorMessage: null,
    });

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: { server: { select: { name: true, slug: true } } },
    });

    if (!channel) throw new Error('Channel not found during regeneration');

    const rawMessages = await prisma.message.findMany({
      where: { channelId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { author: { select: { displayName: true } } },
    });

    const channelCtx: ChannelContext = {
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      topic: channel.topic,
      serverName: channel.server.name,
      serverSlug: channel.server.slug,
      canonicalUrl: metaTagService.buildCanonicalUrl(channel.server.slug, channel.slug),
      visibility: channel.visibility as unknown as ServiceChannelVisibility,
    };

    const msgCtxs: MessageContext[] = rawMessages.map((m) => ({
      content: m.content,
      createdAt: m.createdAt,
      authorDisplayName: m.author.displayName,
    }));

    const tags = await metaTagService.generateMetaTagsFromContext(channelCtx, msgCtxs);

    await metaTagRepository.saveGeneratedFields(channelId, {
      title: tags.title,
      description: tags.description,
      ogTitle: tags.openGraph.ogTitle,
      ogDescription: tags.openGraph.ogDescription,
      ogImage: tags.openGraph.ogImage,
      twitterCard: tags.twitter.card,
      keywords: tags.keywords.join(','),
      structuredData: tags.structuredData as unknown as Prisma.InputJsonValue,
      contentHash: randomUUID(),
      needsRegeneration: tags.needsRegeneration ?? false,
      generatedAt: new Date(),
    });

    await storeJob({
      jobId,
      channelId,
      status: 'succeeded',
      attempts: 1,
      startedAt,
      completedAt: new Date().toISOString(),
      errorCode: null,
      errorMessage: null,
    });

    logger.info({ jobId, channelId }, 'Meta tag regeneration succeeded');
  } catch (err) {
    logger.error({ err, jobId, channelId }, 'Meta tag regeneration failed');
    await storeJob({
      jobId,
      channelId,
      status: 'failed',
      attempts: 1,
      startedAt,
      completedAt: new Date().toISOString(),
      errorCode: 'REGEN_FAILED',
      errorMessage: err instanceof Error ? err.message : 'Unknown error',
    }).catch((storeErr) =>
      logger.error({ err: storeErr, jobId }, 'Failed to store failed job status'),
    );
  }
}

// ─── Admin authorization middleware ──────────────────────────────────────────

/**
 * Verifies that the authenticated user is a server admin (ADMIN or OWNER role)
 * for the server that owns the requested channel.
 *
 * Attaches `req.serverId` to the request for downstream handlers.
 * Responds 404 if the channel does not exist; 403 if the user lacks the role.
 */
async function requireServerAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { channelId } = req.params;
  const userId = (req as AuthenticatedRequest).userId;

  try {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { id: true, serverId: true },
    });

    if (!channel) {
      res.status(404).json({ error: 'Channel not found' });
      return;
    }

    // channel:manage_visibility is held by ADMIN and OWNER roles only
    const allowed = await permissionService.checkPermission(
      userId,
      channel.serverId,
      'channel:manage_visibility',
    );

    if (!allowed) {
      res.status(403).json({ error: 'Server admin role required' });
      return;
    }

    (req as Request & { serverId: string }).serverId = channel.serverId;
    next();
  } catch (err) {
    logger.error({ err, channelId, userId }, 'Admin auth check failed');
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── Preview builder ──────────────────────────────────────────────────────────

function buildPreview(
  record: NonNullable<Awaited<ReturnType<typeof metaTagRepository.findByChannelId>>>,
): MetaTagPreview {
  const isCustom = Boolean(record.customTitle ?? record.customDescription ?? record.customOgImage);
  const title = record.customTitle ?? record.title;
  const description = record.customDescription ?? record.description;
  const ogTitle = record.customTitle ?? record.ogTitle;
  const ogDescription = record.customDescription ?? record.ogDescription;
  const ogImage = record.customOgImage ?? record.ogImage ?? '';
  const keywords = record.keywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    keywords,
    generatedAt: record.generatedAt.toISOString(),
    isCustom,
    searchPreview: { title, description, url: `${BASE_URL}/channels/${record.channelId}` },
    socialPreview: { title: ogTitle, description: ogDescription, image: ogImage },
  };
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const adminMetaTagRouter = Router();

// All routes require authentication
adminMetaTagRouter.use(requireAuth);

/**
 * GET /api/admin/channels/:channelId/meta-tags
 * Returns the current effective meta tags for the channel as a preview.
 */
adminMetaTagRouter.get(
  '/channels/:channelId/meta-tags',
  requireServerAdmin,
  async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      const record = await metaTagRepository.findByChannelId(channelId);

      if (!record) {
        res.status(404).json({ error: 'Meta tags not found for this channel' });
        return;
      }

      res.json(buildPreview(record));
    } catch (err) {
      logger.error({ err, channelId: req.params.channelId }, 'GET meta-tags failed');
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * PUT /api/admin/channels/:channelId/meta-tags
 * Updates custom override fields. Validates lengths per AC-3.
 */
adminMetaTagRouter.put(
  '/channels/:channelId/meta-tags',
  requireServerAdmin,
  async (req: Request, res: Response) => {
    const { channelId } = req.params;

    const parsed = metaTagOverrideSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({
        error: 'Validation error',
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    // Build partial update — only include fields explicitly present in the body.
    // Omitted fields are left unchanged; explicit null clears the override.
    const d = parsed.data;
    const overrides: {
      customTitle?: string | null;
      customDescription?: string | null;
      customOgImage?: string | null;
    } = {};
    if (d.customTitle !== undefined) overrides.customTitle = d.customTitle;
    if (d.customDescription !== undefined) overrides.customDescription = d.customDescription;
    if (d.customOgImage !== undefined) overrides.customOgImage = d.customOgImage;

    try {
      const existing = await metaTagRepository.findByChannelId(channelId);
      if (!existing) {
        res.status(404).json({ error: 'Meta tags not found for this channel' });
        return;
      }

      // Route through service: sanitizes HTML/PII, HTML-encodes text, invalidates cache (AC-8/§12.3)
      const updated = await metaTagService.setCustomOverrides(channelId, overrides);

      res.json(buildPreview(updated));
    } catch (err) {
      logger.error({ err, channelId }, 'PUT meta-tags failed');
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);

/**
 * POST /api/admin/channels/:channelId/meta-tags/jobs
 * Schedules an async regeneration job.
 * Supports idempotency via Idempotency-Key header (deduplicates within 60s).
 */
adminMetaTagRouter.post(
  '/channels/:channelId/meta-tags/jobs',
  requireServerAdmin,
  async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const rawIdempotencyHeader = req.headers['idempotency-key'];
    const idempotencyHeader = Array.isArray(rawIdempotencyHeader)
      ? rawIdempotencyHeader[0]
      : rawIdempotencyHeader;
    const apiBase = process.env.BASE_URL ?? `${req.protocol}://${req.get('host')}`;

    try {
      const jobId = randomUUID();
      const now = new Date().toISOString();

      // Atomic idempotency deduplication (AC-6).
      // SET NX ensures only one concurrent request wins the key; the loser reads back the winner's jobId.
      if (idempotencyHeader) {
        const iKey = idempotencyKey(channelId, idempotencyHeader);
        const acquired = await redis.set(iKey, jobId, 'EX', IDEMPOTENCY_TTL_SECONDS, 'NX');
        if (acquired === null) {
          const existingJobId = await redis.get(iKey);
          const pollUrl = `${apiBase}/api/admin/channels/${channelId}/meta-tags/jobs/${existingJobId ?? jobId}`;
          res.status(202).json({
            jobId: existingJobId ?? jobId,
            status: 'deduplicated',
            idempotencyKey: idempotencyHeader,
            pollUrl,
          });
          return;
        }
      }

      const job: MetaTagJobStatus = {
        jobId,
        channelId,
        status: 'queued',
        attempts: 0,
        startedAt: null,
        completedAt: null,
        errorCode: null,
        errorMessage: null,
      };

      await storeJob(job);
      setImmediate(() => void processRegenerationJob(channelId, jobId));

      logger.info({ jobId, channelId, idempotencyKey: idempotencyHeader }, 'Meta tag job queued');

      const pollUrl = `${apiBase}/api/admin/channels/${channelId}/meta-tags/jobs/${jobId}`;
      res.status(202).json({
        jobId,
        status: 'queued',
        idempotencyKey: idempotencyHeader ?? null,
        pollUrl,
        createdAt: now,
      });
    } catch (err) {
      logger.error({ err, channelId }, 'POST meta-tags jobs failed');
      res.status(500).json({ error: 'Failed to schedule regeneration job' });
    }
  },
);

/**
 * GET /api/admin/channels/:channelId/meta-tags/jobs/:jobId
 * Returns the current status of a regeneration job.
 */
adminMetaTagRouter.get(
  '/channels/:channelId/meta-tags/jobs/:jobId',
  requireServerAdmin,
  async (req: Request, res: Response) => {
    const { channelId, jobId } = req.params;

    try {
      const job = await getJob(jobId);

      if (!job || job.channelId !== channelId) {
        res.status(404).json({ error: 'Job not found' });
        return;
      }

      res.json(job);
    } catch (err) {
      logger.error({ err, channelId, jobId }, 'GET meta-tag job status failed');
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);
