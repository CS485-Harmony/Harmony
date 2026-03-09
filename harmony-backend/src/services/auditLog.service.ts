/**
 * AuditLogService (M-B3 sub-module) — dedicated service for visibility
 * audit log operations.
 *
 * Provides:
 *   - logVisibilityChange  — create a single audit entry, callable inside
 *     an existing Prisma transaction or standalone.
 *   - getVisibilityAuditLog — paginated read of audit entries for a channel,
 *     with optional date filtering.
 *
 * Retention policy: records must be kept for a minimum of 7 years per
 * compliance requirements. Automated purge jobs must not delete entries
 * whose `timestamp` falls within the 7-year window.
 */

import { Prisma, VisibilityAuditLog } from '@prisma/client';
import { prisma } from '../db/prisma';

/** Max characters stored for User-Agent — matches the @db.VarChar(500) column. */
const USER_AGENT_MAX_LEN = 500;

/** Hard cap on `limit` to prevent unbounded queries (matches messageService pattern). */
const AUDIT_LOG_MAX_LIMIT = 500;

export interface LogVisibilityChangeInput {
  channelId: string;
  actorId: string;
  /** JSON snapshot of the old visibility state, e.g. `{ visibility: 'PRIVATE' }` */
  oldValue: Prisma.InputJsonObject;
  /** JSON snapshot of the new visibility state, e.g. `{ visibility: 'PUBLIC_INDEXABLE' }` */
  newValue: Prisma.InputJsonObject;
  /** Caller's IP address — stored for compliance (IPv4 or IPv6). */
  ipAddress: string;
  /** HTTP User-Agent header value; defaults to empty string if not provided. */
  userAgent?: string;
}

export interface AuditLogPage {
  entries: VisibilityAuditLog[];
  /** Total number of matching records (before pagination). */
  total: number;
}

export interface GetAuditLogOptions {
  /** Maximum number of entries to return (default: 20). */
  limit?: number;
  /** Number of entries to skip (default: 0). */
  offset?: number;
  /** If provided, only entries at or after this timestamp are returned. */
  startDate?: Date;
}

export const auditLogService = {
  /**
   * Record a VISIBILITY_CHANGED audit event.
   *
   * Pass `tx` to run this inside an existing `prisma.$transaction` so the
   * insert is part of the same atomic unit as the channel UPDATE.
   */
  async logVisibilityChange(
    input: LogVisibilityChangeInput,
    tx?: Prisma.TransactionClient,
  ): Promise<VisibilityAuditLog> {
    const client = tx ?? prisma;
    return client.visibilityAuditLog.create({
      data: {
        channelId: input.channelId,
        actorId: input.actorId,
        action: 'VISIBILITY_CHANGED',
        oldValue: input.oldValue,
        newValue: input.newValue,
        ipAddress: input.ipAddress,
        userAgent: (input.userAgent ?? '').slice(0, USER_AGENT_MAX_LEN),
      },
    });
  },

  /**
   * Retrieve paginated audit log entries for a channel.
   *
   * Results are ordered by `timestamp DESC` (most recent first).
   * Returns both the page of entries and the total count for cursor/offset UI.
   */
  async getVisibilityAuditLog(
    channelId: string,
    options: GetAuditLogOptions = {},
  ): Promise<AuditLogPage> {
    const { limit, offset, startDate } = options;
    const clampedLimit = Math.min(Math.max(1, limit ?? 20), AUDIT_LOG_MAX_LIMIT);
    const safeOffset = Math.max(0, Math.floor(offset ?? 0));

    const where: Prisma.VisibilityAuditLogWhereInput = {
      channelId,
      ...(startDate !== undefined && { timestamp: { gte: startDate } }),
    };

    const [entries, total] = await Promise.all([
      prisma.visibilityAuditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: safeOffset,
        take: clampedLimit,
      }),
      prisma.visibilityAuditLog.count({ where }),
    ]);

    return { entries, total };
  },
};
