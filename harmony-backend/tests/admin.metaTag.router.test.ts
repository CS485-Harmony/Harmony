/**
 * Admin meta-tag REST endpoint tests — Issue #353
 *
 * Coverage:
 *   GET  /api/admin/channels/:channelId/meta-tags
 *   PUT  /api/admin/channels/:channelId/meta-tags
 *   POST /api/admin/channels/:channelId/meta-tags/jobs
 *   GET  /api/admin/channels/:channelId/meta-tags/jobs/:jobId
 *
 * All external dependencies (Prisma, Redis, permissionService, authService)
 * are mocked so no running database or Redis instance is required.
 */

import request from 'supertest';
import { createApp } from '../src/app';
import type { Express } from 'express';
import { processAdminRegenerationJob } from '../src/services/metaTag/metaTagService';
import type { MetaTagJobStatus } from '../src/services/metaTag/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_TOKEN = 'valid-admin-token';
const NON_ADMIN_TOKEN = 'non-admin-token';
const ADMIN_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const NON_ADMIN_USER_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

const CHANNEL_ID = '11111111-1111-1111-1111-111111111111';
const SERVER_ID = '22222222-2222-2222-2222-222222222222';

// ─── Auth mock ───────────────────────────────────────────────────────────────

jest.mock('../src/services/auth.service', () => ({
  authService: {
    verifyAccessToken: jest.fn((token: string) => {
      if (token === VALID_TOKEN) return { sub: ADMIN_USER_ID };
      if (token === NON_ADMIN_TOKEN) return { sub: NON_ADMIN_USER_ID };
      throw new Error('Invalid token');
    }),
  },
}));

// ─── Prisma mock ──────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    channel: { findUnique: jest.fn() },
    message: { findMany: jest.fn() },
  },
}));

import { prisma } from '../src/db/prisma';
const mockPrisma = prisma as unknown as {
  channel: { findUnique: jest.Mock };
  message: { findMany: jest.Mock };
};

// ─── Permission service mock ──────────────────────────────────────────────────

jest.mock('../src/services/permission.service', () => ({
  permissionService: {
    checkPermission: jest.fn(),
    requirePermission: jest.fn(),
  },
}));

import { permissionService } from '../src/services/permission.service';
const mockPermission = permissionService as unknown as {
  checkPermission: jest.Mock;
  requirePermission: jest.Mock;
};

// ─── MetaTag repository mock ──────────────────────────────────────────────────

jest.mock('../src/repositories/metaTag.repository', () => ({
  metaTagRepository: {
    findByChannelId: jest.fn(),
    updateCustomOverrides: jest.fn(),
    saveGeneratedFields: jest.fn(),
  },
}));

import { metaTagRepository } from '../src/repositories/metaTag.repository';
const mockMetaTagRepo = metaTagRepository as unknown as {
  findByChannelId: jest.Mock;
  updateCustomOverrides: jest.Mock;
  saveGeneratedFields: jest.Mock;
};

// ─── Audit log service mock ───────────────────────────────────────────────────

jest.mock('../src/services/auditLog.service', () => ({
  auditLogService: {
    logChannelAuditAction: jest.fn(),
  },
}));

import { auditLogService } from '../src/services/auditLog.service';
const mockAuditLogService = auditLogService as unknown as {
  logChannelAuditAction: jest.Mock;
};

// ─── Redis mock ───────────────────────────────────────────────────────────────

const redisStore = new Map<string, string>();

jest.mock('../src/db/redis', () => ({
  redis: {
    get: jest.fn(async (key: string) => redisStore.get(key) ?? null),
    set: jest.fn(async (key: string, value: string, ...args: unknown[]) => {
      // Honour SET ... NX semantics: return null without writing if key already exists
      if (args.includes('NX') && redisStore.has(key)) return null;
      redisStore.set(key, value);
      return 'OK';
    }),
    del: jest.fn(async (key: string) => {
      redisStore.delete(key);
      return 1;
    }),
  },
}));

// ─── Fixture data ─────────────────────────────────────────────────────────────

const META_TAG_RECORD = {
  id: 'mt-00000000-0000-0000-0000-000000000001',
  channelId: CHANNEL_ID,
  title: 'Generated Title',
  description: 'Generated description for the channel.',
  ogTitle: 'OG Generated Title',
  ogDescription: 'OG Generated description.',
  ogImage: 'https://example.com/og.png',
  twitterCard: 'summary',
  keywords: 'tag1,tag2,tag3',
  structuredData: { '@type': 'WebPage' },
  contentHash: 'abc123',
  needsRegeneration: false,
  generatedAt: new Date('2025-01-01T00:00:00Z'),
  schemaVersion: 1,
  customTitle: null,
  customDescription: null,
  customOgImage: null,
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
};

// ─── Setup ────────────────────────────────────────────────────────────────────

let app: Express;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  redisStore.clear();
  jest.clearAllMocks();

  // Default: channel exists with server data (required by requireServerAdmin and processRegenerationJob)
  mockPrisma.channel.findUnique.mockResolvedValue({
    id: CHANNEL_ID,
    serverId: SERVER_ID,
    name: 'general',
    slug: 'general',
    topic: null,
    visibility: 'PUBLIC_INDEXABLE',
    server: { name: 'Test Server', slug: 'test-server' },
  });

  // Default: no messages
  mockPrisma.message.findMany.mockResolvedValue([]);

  // Default: saveGeneratedFields succeeds
  mockMetaTagRepo.saveGeneratedFields.mockResolvedValue(1);

  // Default: audit log insert succeeds
  mockAuditLogService.logChannelAuditAction.mockResolvedValue(undefined);

  // Default: admin user has permission; non-admin does not
  mockPermission.checkPermission.mockImplementation(async (userId: string) => {
    return userId === ADMIN_USER_ID;
  });
});

// ─── GET /api/admin/channels/:channelId/meta-tags ─────────────────────────────

describe('GET /api/admin/channels/:channelId/meta-tags', () => {
  const url = `/api/admin/channels/${CHANNEL_ID}/meta-tags`;

  it('returns 401 when no Authorization header is provided', async () => {
    const res = await request(app).get(url);
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not a server admin', async () => {
    const res = await request(app).get(url).set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`);
    expect(res.status).toBe(403);
  });

  it('returns 404 when channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);
    const res = await request(app).get(url).set('Authorization', `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 when meta tags record does not exist', async () => {
    mockMetaTagRepo.findByChannelId.mockResolvedValue(null);
    const res = await request(app).get(url).set('Authorization', `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(404);
  });

  it('returns 200 with MetaTagPreview on success', async () => {
    mockMetaTagRepo.findByChannelId.mockResolvedValue(META_TAG_RECORD);
    const res = await request(app).get(url).set('Authorization', `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      title: META_TAG_RECORD.title,
      description: META_TAG_RECORD.description,
      ogTitle: META_TAG_RECORD.ogTitle,
      ogDescription: META_TAG_RECORD.ogDescription,
      isCustom: false,
      generatedAt: META_TAG_RECORD.generatedAt.toISOString(),
      keywords: ['tag1', 'tag2', 'tag3'],
    });
    expect(res.body).toHaveProperty('searchPreview');
    expect(res.body).toHaveProperty('socialPreview');
  });

  it('sets isCustom=true when customTitle is present', async () => {
    const withCustom = { ...META_TAG_RECORD, customTitle: 'My Custom Title' };
    mockMetaTagRepo.findByChannelId.mockResolvedValue(withCustom);
    const res = await request(app).get(url).set('Authorization', `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.isCustom).toBe(true);
    expect(res.body.title).toBe('My Custom Title');
  });
});

// ─── PUT /api/admin/channels/:channelId/meta-tags ─────────────────────────────

describe('PUT /api/admin/channels/:channelId/meta-tags', () => {
  const url = `/api/admin/channels/${CHANNEL_ID}/meta-tags`;

  it('returns 401 when no Authorization header is provided', async () => {
    const res = await request(app).put(url).send({ customTitle: 'New Title' });
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not a server admin', async () => {
    const res = await request(app)
      .put(url)
      .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      .send({ customTitle: 'New Title' });
    expect(res.status).toBe(403);
  });

  it('returns 422 when customTitle exceeds 70 chars (AC-3)', async () => {
    const res = await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customTitle: 'x'.repeat(71) });
    expect(res.status).toBe(422);
  });

  it('returns 422 when customDescription exceeds 200 chars (AC-3)', async () => {
    const res = await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customDescription: 'x'.repeat(201) });
    expect(res.status).toBe(422);
  });

  it('returns 422 when customOgImage is not a valid URL', async () => {
    const res = await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customOgImage: 'not-a-url' });
    expect(res.status).toBe(422);
  });

  it('returns 404 when meta tags record does not exist', async () => {
    mockMetaTagRepo.findByChannelId.mockResolvedValue(null);
    const res = await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customTitle: 'New Title' });
    expect(res.status).toBe(404);
  });

  it('returns 200 with updated preview on success', async () => {
    const updated = { ...META_TAG_RECORD, customTitle: 'My Title', customDescription: 'My Desc' };
    mockMetaTagRepo.findByChannelId.mockResolvedValue(META_TAG_RECORD);
    mockMetaTagRepo.updateCustomOverrides.mockResolvedValue(updated);

    const res = await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customTitle: 'My Title', customDescription: 'My Desc' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('My Title');
    expect(res.body.isCustom).toBe(true);
    // Only explicitly provided fields are forwarded — customOgImage was absent so must not be set
    expect(mockMetaTagRepo.updateCustomOverrides).toHaveBeenCalledWith(CHANNEL_ID, {
      customTitle: 'My Title',
      customDescription: 'My Desc',
    });
    expect(mockAuditLogService.logChannelAuditAction).toHaveBeenCalledWith({
      channelId: CHANNEL_ID,
      actorId: ADMIN_USER_ID,
      action: 'META_TAG_OVERRIDE_UPDATED',
      oldValue: {
        customTitle: null,
        customDescription: null,
        customOgImage: null,
      },
      newValue: {
        customTitle: 'My Title',
        customDescription: 'My Desc',
        customOgImage: null,
      },
      ipAddress: '::ffff:127.0.0.1',
      userAgent: undefined,
    });
  });

  it('does not clear an existing override when only one field is provided (partial update)', async () => {
    mockMetaTagRepo.findByChannelId.mockResolvedValue(META_TAG_RECORD);
    mockMetaTagRepo.updateCustomOverrides.mockResolvedValue({
      ...META_TAG_RECORD,
      customTitle: 'New Title Only',
    });

    await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customTitle: 'New Title Only' });

    // customDescription and customOgImage must NOT appear in the call — omitting them preserves DB values
    expect(mockMetaTagRepo.updateCustomOverrides).toHaveBeenCalledWith(CHANNEL_ID, {
      customTitle: 'New Title Only',
    });
  });

  it('passes explicit null through to clear an override', async () => {
    mockMetaTagRepo.findByChannelId.mockResolvedValue({
      ...META_TAG_RECORD,
      customTitle: 'Old Title',
    });
    mockMetaTagRepo.updateCustomOverrides.mockResolvedValue(META_TAG_RECORD);

    await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customTitle: null });

    expect(mockMetaTagRepo.updateCustomOverrides).toHaveBeenCalledWith(CHANNEL_ID, {
      customTitle: null,
    });
  });

  it('strips HTML tags from customTitle and customDescription before storing (AC-8)', async () => {
    mockMetaTagRepo.findByChannelId.mockResolvedValue(META_TAG_RECORD);
    mockMetaTagRepo.updateCustomOverrides.mockResolvedValue(META_TAG_RECORD);

    await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customTitle: '<b>Bold</b> Title', customDescription: '<em>Italic</em> Desc' });

    expect(mockMetaTagRepo.updateCustomOverrides).toHaveBeenCalledWith(CHANNEL_ID, {
      customTitle: 'Bold Title',
      customDescription: 'Italic Desc',
    });
  });

  it('redacts email PII from customDescription before storing (AC-8)', async () => {
    mockMetaTagRepo.findByChannelId.mockResolvedValue(META_TAG_RECORD);
    mockMetaTagRepo.updateCustomOverrides.mockResolvedValue(META_TAG_RECORD);

    await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customDescription: 'Contact admin@example.com for help' });

    expect(mockMetaTagRepo.updateCustomOverrides).toHaveBeenCalledWith(CHANNEL_ID, {
      customDescription: 'Contact [email] for help',
    });
  });

  it('accepts customTitle exactly 70 chars', async () => {
    const title70 = 'x'.repeat(70);
    const updated = { ...META_TAG_RECORD, customTitle: title70 };
    mockMetaTagRepo.findByChannelId.mockResolvedValue(META_TAG_RECORD);
    mockMetaTagRepo.updateCustomOverrides.mockResolvedValue(updated);

    const res = await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customTitle: title70 });

    expect(res.status).toBe(200);
  });

  it('accepts customDescription exactly 200 chars', async () => {
    const desc200 = 'x'.repeat(200);
    const updated = { ...META_TAG_RECORD, customDescription: desc200 };
    mockMetaTagRepo.findByChannelId.mockResolvedValue(META_TAG_RECORD);
    mockMetaTagRepo.updateCustomOverrides.mockResolvedValue(updated);

    const res = await request(app)
      .put(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send({ customDescription: desc200 });

    expect(res.status).toBe(200);
  });
});

// ─── POST /api/admin/channels/:channelId/meta-tags/jobs ───────────────────────

describe('POST /api/admin/channels/:channelId/meta-tags/jobs', () => {
  const url = `/api/admin/channels/${CHANNEL_ID}/meta-tags/jobs`;

  it('returns 401 when no Authorization header is provided', async () => {
    const res = await request(app).post(url);
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not a server admin', async () => {
    const res = await request(app).post(url).set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`);
    expect(res.status).toBe(403);
  });

  it('returns 404 when channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);
    const res = await request(app).post(url).set('Authorization', `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(404);
  });

  it('returns 202 with jobId and pollUrl on success (AC-5)', async () => {
    const res = await request(app).post(url).set('Authorization', `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty('jobId');
    expect(res.body).toHaveProperty('pollUrl');
    expect(res.body.status).toBe('queued');
    expect(typeof res.body.jobId).toBe('string');
  });

  it('returns deduplicated status when same idempotency key used within 60s (AC-6)', async () => {
    const idem = 'my-idempotency-key-001';

    // First request — creates the job
    const first = await request(app)
      .post(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .set('Idempotency-Key', idem);

    expect(first.status).toBe(202);
    expect(first.body.status).toBe('queued');
    const firstJobId = first.body.jobId as string;

    // Second request with same key — should deduplicate
    const second = await request(app)
      .post(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .set('Idempotency-Key', idem);

    expect(second.status).toBe(202);
    expect(second.body.status).toBe('deduplicated');
    expect(second.body.jobId).toBe(firstJobId);
  });

  it('creates a new job when a different idempotency key is used', async () => {
    const first = await request(app)
      .post(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .set('Idempotency-Key', 'key-A');

    const second = await request(app)
      .post(url)
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .set('Idempotency-Key', 'key-B');

    expect(first.status).toBe(202);
    expect(second.status).toBe(202);
    expect(first.body.jobId).not.toBe(second.body.jobId);
  });
});

// ─── GET /api/admin/channels/:channelId/meta-tags/jobs/:jobId ─────────────────

describe('GET /api/admin/channels/:channelId/meta-tags/jobs/:jobId', () => {
  const JOB_ID = 'job-0000-0000-0000-000000000001';
  const url = `/api/admin/channels/${CHANNEL_ID}/meta-tags/jobs/${JOB_ID}`;

  it('returns 401 when no Authorization header is provided', async () => {
    const res = await request(app).get(url);
    expect(res.status).toBe(401);
  });

  it('returns 403 when user is not a server admin', async () => {
    const res = await request(app).get(url).set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`);
    expect(res.status).toBe(403);
  });

  it('returns 404 when job does not exist', async () => {
    const res = await request(app).get(url).set('Authorization', `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 when jobId belongs to a different channel', async () => {
    // Store a job for a different channel
    const wrongJob = {
      jobId: JOB_ID,
      channelId: 'different-channel-id',
      status: 'queued',
      attempts: 0,
      startedAt: null,
      completedAt: null,
      errorCode: null,
      errorMessage: null,
    };
    redisStore.set(`meta-tag:job:${JOB_ID}`, JSON.stringify(wrongJob));

    const res = await request(app).get(url).set('Authorization', `Bearer ${VALID_TOKEN}`);
    expect(res.status).toBe(404);
  });

  it('returns 200 with job status when job exists (AC-5)', async () => {
    const job = {
      jobId: JOB_ID,
      channelId: CHANNEL_ID,
      status: 'queued',
      attempts: 0,
      startedAt: null,
      completedAt: null,
      errorCode: null,
      errorMessage: null,
    };
    redisStore.set(`meta-tag:job:${JOB_ID}`, JSON.stringify(job));

    const res = await request(app).get(url).set('Authorization', `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      jobId: JOB_ID,
      channelId: CHANNEL_ID,
      status: 'queued',
      attempts: 0,
    });
  });

  it('round-trips: POST job then GET status returns a valid terminal or transitional state', async () => {
    const postRes = await request(app)
      .post(`/api/admin/channels/${CHANNEL_ID}/meta-tags/jobs`)
      .set('Authorization', `Bearer ${VALID_TOKEN}`);

    expect(postRes.status).toBe(202);
    // POST response always reflects the initial queued state (sent before background processing)
    expect(postRes.body.status).toBe('queued');
    const { jobId } = postRes.body as { jobId: string };

    const getRes = await request(app)
      .get(`/api/admin/channels/${CHANNEL_ID}/meta-tags/jobs/${jobId}`)
      .set('Authorization', `Bearer ${VALID_TOKEN}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.jobId).toBe(jobId);
    expect(getRes.body.channelId).toBe(CHANNEL_ID);
    // Status advances asynchronously; all three states are valid at poll time
    expect(['queued', 'processing', 'succeeded', 'failed']).toContain(getRes.body.status);
  });

  it('returns 404 when the Redis value is corrupt JSON (parse guard)', async () => {
    redisStore.set(`meta-tag:job:${JOB_ID}`, 'not-valid-json');

    const res = await request(app).get(url).set('Authorization', `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(404);
  });
});

// ─── processRegenerationJob — terminal state transitions (AC-5) ───────────────

describe('processRegenerationJob terminal states (AC-5)', () => {
  const JOB_ID = 'regen-test-job-0000-0000-000000000001';

  function seedQueuedJob(jobId: string): MetaTagJobStatus {
    const job: MetaTagJobStatus = {
      jobId,
      channelId: CHANNEL_ID,
      status: 'queued',
      attempts: 0,
      startedAt: null,
      completedAt: null,
      errorCode: null,
      errorMessage: null,
    };
    redisStore.set(`meta-tag:job:${jobId}`, JSON.stringify(job));
    return job;
  }

  it('transitions job to succeeded after successful regeneration', async () => {
    seedQueuedJob(JOB_ID);

    await processAdminRegenerationJob(CHANNEL_ID, JOB_ID);

    const stored = redisStore.get(`meta-tag:job:${JOB_ID}`);
    const parsed = JSON.parse(stored!) as MetaTagJobStatus;
    expect(parsed.status).toBe('succeeded');
    expect(parsed.attempts).toBe(1);
    expect(parsed.startedAt).not.toBeNull();
    expect(parsed.completedAt).not.toBeNull();
    expect(parsed.errorCode).toBeNull();
    expect(mockMetaTagRepo.saveGeneratedFields).toHaveBeenCalledWith(CHANNEL_ID, expect.any(Object));
  });

  it('transitions job to processing before succeeding', async () => {
    seedQueuedJob(JOB_ID);

    // Capture intermediate state by intercepting the second storeJob call
    const states: string[] = [];
    const origSet = redisStore.set.bind(redisStore);
    jest.spyOn(redisStore, 'set').mockImplementation((key, value) => {
      try {
        const parsed = JSON.parse(value) as MetaTagJobStatus;
        if (parsed.jobId === JOB_ID) states.push(parsed.status);
      } catch { /* not a job record */ }
      return origSet(key, value);
    });

    await processAdminRegenerationJob(CHANNEL_ID, JOB_ID);

    expect(states).toContain('processing');
    expect(states).toContain('succeeded');
    expect(states.indexOf('processing')).toBeLessThan(states.indexOf('succeeded'));

    jest.restoreAllMocks();
  });

  it('transitions job to failed when channel is not found', async () => {
    seedQueuedJob(JOB_ID);
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    await processAdminRegenerationJob(CHANNEL_ID, JOB_ID);

    const stored = redisStore.get(`meta-tag:job:${JOB_ID}`);
    const parsed = JSON.parse(stored!) as MetaTagJobStatus;
    expect(parsed.status).toBe('failed');
    expect(parsed.errorCode).toBe('REGEN_FAILED');
    expect(parsed.errorMessage).toContain('Channel not found');
  });

  it('transitions job to failed when saveGeneratedFields throws', async () => {
    seedQueuedJob(JOB_ID);
    mockMetaTagRepo.saveGeneratedFields.mockRejectedValue(new Error('DB write error'));

    await processAdminRegenerationJob(CHANNEL_ID, JOB_ID);

    const stored = redisStore.get(`meta-tag:job:${JOB_ID}`);
    const parsed = JSON.parse(stored!) as MetaTagJobStatus;
    expect(parsed.status).toBe('failed');
    expect(parsed.errorCode).toBe('REGEN_FAILED');
    expect(parsed.errorMessage).toBe('DB write error');
  });

  it('GET job endpoint returns succeeded state after processRegenerationJob resolves', async () => {
    seedQueuedJob(JOB_ID);
    await processAdminRegenerationJob(CHANNEL_ID, JOB_ID);

    const res = await request(app)
      .get(`/api/admin/channels/${CHANNEL_ID}/meta-tags/jobs/${JOB_ID}`)
      .set('Authorization', `Bearer ${VALID_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('succeeded');
    expect(res.body.jobId).toBe(JOB_ID);
  });
});
