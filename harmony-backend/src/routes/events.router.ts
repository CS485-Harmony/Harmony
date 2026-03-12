/**
 * SSE Router — Issue #180
 *
 * GET /api/events/channel/:channelId?token=<accessToken>
 *
 * Streams real-time message events to authenticated, authorised clients using
 * Server-Sent Events.
 *
 * Auth: the browser's native EventSource API cannot send custom headers, so the
 * access token is accepted via a `?token=` query parameter instead of the
 * Authorization header. The token is validated identically to requireAuth.
 *
 * Authorisation: verifies the authenticated user is a member of the server that
 * owns the requested channel, preventing access to PRIVATE channels by non-members.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { authService } from '../services/auth.service';
import { eventBus, EventChannels } from '../events/eventBus';
import type {
  MessageCreatedPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
} from '../events/eventTypes';

export const eventsRouter = Router();

// ─── Validation ────────────────────────────────────────────────────────────────

/**
 * Validate that a channelId looks like a UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
 * Rejects empty strings, whitespace-only strings, and obviously invalid values
 * to prevent subscription to meaningless Redis channels.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidChannelId(id: string): boolean {
  return UUID_RE.test(id.trim());
}

// ─── Prisma select shape (matches frontend Message type) ──────────────────────

const MESSAGE_SSE_INCLUDE = {
  author: {
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  },
  attachments: {
    select: { id: true, filename: true, url: true, contentType: true },
  },
} as const;

// ─── SSE helpers ──────────────────────────────────────────────────────────────

function sendEvent(res: Response, eventType: string, data: unknown): void {
  res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
}

// ─── Route ────────────────────────────────────────────────────────────────────

eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
  const { channelId } = req.params;

  if (!isValidChannelId(channelId)) {
    res.status(400).json({ error: 'Invalid channelId: must be a UUID' });
    return;
  }

  // ── Auth — accept token via query param (EventSource cannot send headers) ──
  const token = typeof req.query.token === 'string' ? req.query.token : null;
  if (!token) {
    res.status(401).json({ error: 'Missing token query parameter' });
    return;
  }

  let userId: string;
  try {
    const payload = authService.verifyAccessToken(token);
    userId = payload.sub;
  } catch {
    res.status(401).json({ error: 'Invalid or expired access token' });
    return;
  }

  // ── Authorisation — verify user is a member of the channel's server ───────
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    select: { serverId: true },
  });
  if (!channel) {
    res.status(404).json({ error: 'Channel not found' });
    return;
  }

  const membership = await prisma.serverMember.findFirst({
    where: { userId, serverId: channel.serverId },
    select: { userId: true },
  });
  if (!membership) {
    res.status(403).json({ error: 'You are not a member of this server' });
    return;
  }

  // ── SSE headers ──────────────────────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // ── Subscribe to message events ──────────────────────────────────────────

  const { unsubscribe: unsubCreated } = eventBus.subscribe(
    EventChannels.MESSAGE_CREATED,
    async (payload: MessageCreatedPayload) => {
      if (payload.channelId !== channelId) return;

      try {
        const message = await prisma.message.findUnique({
          where: { id: payload.messageId },
          include: MESSAGE_SSE_INCLUDE,
        });
        if (!message || message.isDeleted) return;

        sendEvent(res, 'message:created', {
          id: message.id,
          channelId: message.channelId,
          authorId: message.authorId,
          author: message.author,
          content: message.content,
          timestamp: message.createdAt.toISOString(),
          attachments: message.attachments,
          editedAt: message.editedAt ? message.editedAt.toISOString() : null,
        });
      } catch {
        // Silently ignore DB errors — the client will still receive future events
      }
    },
  );

  const { unsubscribe: unsubEdited } = eventBus.subscribe(
    EventChannels.MESSAGE_EDITED,
    async (payload: MessageEditedPayload) => {
      if (payload.channelId !== channelId) return;

      try {
        const message = await prisma.message.findUnique({
          where: { id: payload.messageId },
          include: MESSAGE_SSE_INCLUDE,
        });
        if (!message || message.isDeleted) return;

        sendEvent(res, 'message:edited', {
          id: message.id,
          channelId: message.channelId,
          authorId: message.authorId,
          author: message.author,
          content: message.content,
          timestamp: message.createdAt.toISOString(),
          attachments: message.attachments,
          editedAt: message.editedAt ? message.editedAt.toISOString() : null,
        });
      } catch {
        // Silently ignore DB errors
      }
    },
  );

  const { unsubscribe: unsubDeleted } = eventBus.subscribe(
    EventChannels.MESSAGE_DELETED,
    (payload: MessageDeletedPayload) => {
      if (payload.channelId !== channelId) return;
      sendEvent(res, 'message:deleted', { messageId: payload.messageId });
    },
  );

  // ── Heartbeat — keeps the connection alive through proxies ───────────────
  const heartbeat = setInterval(() => {
    res.write(':\n\n');
  }, 30_000);

  // ── Cleanup on client disconnect ─────────────────────────────────────────
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubCreated();
    unsubEdited();
    unsubDeleted();
  });
});
