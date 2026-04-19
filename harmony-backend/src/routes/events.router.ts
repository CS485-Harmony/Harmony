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
import { createLogger } from '../lib/logger';
import { authService } from '../services/auth.service';
import { eventBus, EventChannels } from '../events/eventBus';
import type {
  MessageCreatedPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  ChannelCreatedPayload,
  ChannelUpdatedPayload,
  ChannelDeletedPayload,
  ServerUpdatedPayload,
  UserStatusChangedPayload,
  MemberJoinedPayload,
  MemberLeftPayload,
  VisibilityChangedPayload,
} from '../events/eventTypes';

export const eventsRouter = Router();
const logger = createLogger({ component: 'events-router' });

// ─── Validation ────────────────────────────────────────────────────────────────

/**
 * Validate that a channelId looks like a UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
 * Rejects empty strings, whitespace-only strings, and obviously invalid values
 * to prevent subscription to meaningless Redis channels.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
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

type EventSubscription = { unsubscribe: () => void; ready: Promise<void> };

type BufferedSseState = {
  closed: boolean;
  ready: boolean;
  pendingFrames: string[];
  heartbeat: ReturnType<typeof setInterval> | null;
};

function formatEvent(eventType: string, data: unknown): string {
  return `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
}

function createBufferedSseState(): BufferedSseState {
  return {
    closed: false,
    ready: false,
    pendingFrames: [],
    heartbeat: null,
  };
}

function cleanupSseConnection(state: BufferedSseState, subscriptions: EventSubscription[]): void {
  if (state.closed) return;
  state.closed = true;
  if (state.heartbeat) {
    clearInterval(state.heartbeat);
    state.heartbeat = null;
  }
  state.pendingFrames.length = 0;
  for (const subscription of subscriptions) {
    subscription.unsubscribe();
  }
}

function createBufferedEventWriter(
  res: Response,
  state: BufferedSseState,
): (eventType: string, data: unknown) => void {
  return (eventType: string, data: unknown) => {
    if (state.closed) return;
    const frame = formatEvent(eventType, data);
    if (!state.ready) {
      state.pendingFrames.push(frame);
      return;
    }
    res.write(frame);
  };
}

async function finalizeSseSetup(
  req: Request,
  res: Response,
  state: BufferedSseState,
  subscriptions: EventSubscription[],
  logContext: Record<string, string>,
): Promise<boolean> {
  const cleanup = () => cleanupSseConnection(state, subscriptions);
  req.on('close', cleanup);

  try {
    await Promise.all(subscriptions.map((subscription) => subscription.ready));
  } catch (err) {
    cleanup();
    logger.error({ err, ...logContext }, 'Failed to establish SSE subscriptions');
    if (!res.headersSent) {
      res.status(503).json({ error: 'Failed to establish event stream' });
    }
    return false;
  }

  if (state.closed) {
    return false;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  state.ready = true;
  for (const frame of state.pendingFrames.splice(0)) {
    res.write(frame);
  }

  state.heartbeat = setInterval(() => {
    if (state.closed) return;
    res.write(':\n\n');
  }, 30_000);

  return true;
}

// ─── Route ────────────────────────────────────────────────────────────────────

eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
  const { channelId } = req.params;

  if (!isValidUUID(channelId)) {
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

  const sseState = createBufferedSseState();
  const writeEvent = createBufferedEventWriter(res, sseState);

  // ── Subscribe to message events ──────────────────────────────────────────

  const createdSubscription = eventBus.subscribe(
    EventChannels.MESSAGE_CREATED,
    async (payload: MessageCreatedPayload) => {
      if (payload.channelId !== channelId) return;

      try {
        const message = await prisma.message.findUnique({
          where: { id: payload.messageId },
          include: MESSAGE_SSE_INCLUDE,
        });
        if (!message || message.isDeleted) return;

        writeEvent('message:created', {
          id: message.id,
          channelId: message.channelId,
          authorId: message.authorId,
          author: message.author,
          content: message.content,
          timestamp: message.createdAt.toISOString(),
          attachments: message.attachments,
          editedAt: message.editedAt ? message.editedAt.toISOString() : null,
        });
      } catch (err) {
        logger.warn(
          { err, channelId, messageId: payload.messageId },
          'Failed to hydrate SSE message:created payload',
        );
      }
    },
  );

  const editedSubscription = eventBus.subscribe(
    EventChannels.MESSAGE_EDITED,
    async (payload: MessageEditedPayload) => {
      if (payload.channelId !== channelId) return;

      try {
        const message = await prisma.message.findUnique({
          where: { id: payload.messageId },
          include: MESSAGE_SSE_INCLUDE,
        });
        if (!message || message.isDeleted) return;

        writeEvent('message:edited', {
          id: message.id,
          channelId: message.channelId,
          authorId: message.authorId,
          author: message.author,
          content: message.content,
          timestamp: message.createdAt.toISOString(),
          attachments: message.attachments,
          editedAt: message.editedAt ? message.editedAt.toISOString() : null,
        });
      } catch (err) {
        logger.warn(
          { err, channelId, messageId: payload.messageId },
          'Failed to hydrate SSE message:edited payload',
        );
      }
    },
  );

  const deletedSubscription = eventBus.subscribe(
    EventChannels.MESSAGE_DELETED,
    (payload: MessageDeletedPayload) => {
      if (payload.channelId !== channelId) return;
      writeEvent('message:deleted', { messageId: payload.messageId });
    },
  );

  const serverUpdatedSubscription = eventBus.subscribe(
    EventChannels.SERVER_UPDATED,
    (payload: ServerUpdatedPayload) => {
      if (payload.serverId !== channel.serverId) return;
      writeEvent('server:updated', {
        id: payload.serverId,
        name: payload.name,
        iconUrl: payload.iconUrl,
        description: payload.description,
        updatedAt: payload.timestamp,
      });
    },
  );

  const channelSubscriptions = [
    createdSubscription,
    editedSubscription,
    deletedSubscription,
    serverUpdatedSubscription,
  ];

  await finalizeSseSetup(req, res, sseState, channelSubscriptions, {
    route: 'channel-events',
    channelId,
    serverId: channel.serverId,
  });
});

// ─── Prisma select shape for channel SSE events ───────────────────────────────

const CHANNEL_SSE_SELECT = {
  id: true,
  serverId: true,
  name: true,
  slug: true,
  type: true,
  visibility: true,
  topic: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ─── Server-scoped SSE route — channel list updates ───────────────────────────

/**
 * GET /api/events/server/:serverId?token=<accessToken>
 *
 * Streams real-time channel events (created, updated, deleted) to authenticated,
 * authorised clients using Server-Sent Events. Scoped to a server so all members
 * see the same sidebar updates regardless of which channel they're currently viewing.
 *
 * Auth: same token-via-query-param pattern as /channel/:channelId (EventSource cannot
 * send custom headers).
 *
 * Authorisation: user must be a member of the server.
 */
eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
  const { serverId } = req.params;

  if (!isValidUUID(serverId)) {
    res.status(400).json({ error: 'Invalid serverId: must be a UUID' });
    return;
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
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

  // ── Authorisation — verify server exists and user is a member ────────────
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    select: { id: true },
  });
  if (!server) {
    res.status(404).json({ error: 'Server not found' });
    return;
  }

  const membership = await prisma.serverMember.findFirst({
    where: { userId, serverId },
    select: { userId: true },
  });
  if (!membership) {
    res.status(403).json({ error: 'You are not a member of this server' });
    return;
  }

  const sseState = createBufferedSseState();
  const writeEvent = createBufferedEventWriter(res, sseState);

  // ── Subscribe to channel events ──────────────────────────────────────────

  const channelCreatedSubscription = eventBus.subscribe(
    EventChannels.CHANNEL_CREATED,
    async (payload: ChannelCreatedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const channel = await prisma.channel.findUnique({
          where: { id: payload.channelId },
          select: CHANNEL_SSE_SELECT,
        });
        if (!channel) return;

        writeEvent('channel:created', channel);
      } catch (err) {
        logger.warn(
          { err, serverId, channelId: payload.channelId },
          'Failed to hydrate SSE channel:created payload',
        );
      }
    },
  );

  const channelUpdatedSubscription = eventBus.subscribe(
    EventChannels.CHANNEL_UPDATED,
    async (payload: ChannelUpdatedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const channel = await prisma.channel.findUnique({
          where: { id: payload.channelId },
          select: CHANNEL_SSE_SELECT,
        });
        if (!channel) return;

        writeEvent('channel:updated', channel);
      } catch (err) {
        logger.warn(
          { err, serverId, channelId: payload.channelId },
          'Failed to hydrate SSE channel:updated payload',
        );
      }
    },
  );

  const channelDeletedSubscription = eventBus.subscribe(
    EventChannels.CHANNEL_DELETED,
    (payload: ChannelDeletedPayload) => {
      if (payload.serverId !== serverId) return;
      writeEvent('channel:deleted', { channelId: payload.channelId });
    },
  );

  // ── Subscribe to member status change events ──────────────────────────────
  // Status reflects presence (ONLINE/IDLE/OFFLINE) not identity, so it is emitted
  // regardless of the user's publicProfile setting — consistent with the rationale
  // documented in PR #202 for member join/leave events.
  const statusChangedSubscription = eventBus.subscribe(
    EventChannels.USER_STATUS_CHANGED,
    (payload: UserStatusChangedPayload) => {
      if (payload.serverId !== serverId) return;
      // Normalize Prisma enum ('IDLE') to the lowercase format the frontend expects ('idle').
      writeEvent('member:statusChanged', {
        id: payload.userId,
        status: payload.status.toLowerCase(),
      });
    },
  );

  // ── Subscribe to member join/leave events ─────────────────────────────────
  // When a member joins, look up their profile and push the full user object so
  // clients can add the new member to the sidebar without a page reload.

  const memberJoinedSubscription = eventBus.subscribe(
    EventChannels.MEMBER_JOINED,
    async (payload: MemberJoinedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            status: true,
            publicProfile: true,
          },
        });
        if (!user) return;

        // Respect the publicProfile privacy flag — consistent with userService.getUser().
        // Users who have opted out of public profile display appear as Anonymous with no avatar.
        // status reflects server presence (ONLINE/IDLE/OFFLINE), not identity — intentionally
        // emitted even for private-profile users since it reveals no personally identifying information.
        const isPublic = user.publicProfile;
        writeEvent('member:joined', {
          id: user.id,
          username: isPublic ? user.username : 'Anonymous',
          displayName: isPublic ? user.displayName : undefined,
          avatar: isPublic ? (user.avatarUrl ?? undefined) : undefined,
          // Cast backend RoleTypeValue (e.g. 'MEMBER') to frontend UserRole (e.g. 'member')
          role: payload.role.toLowerCase(),
          // Cast DB UserStatus (e.g. 'ONLINE') to frontend UserStatus (e.g. 'online')
          status: user.status.toLowerCase(),
        });
      } catch (err) {
        logger.warn(
          { err, serverId, userId: payload.userId },
          'Failed to hydrate SSE member:joined payload',
        );
      }
    },
  );

  const memberLeftSubscription = eventBus.subscribe(
    EventChannels.MEMBER_LEFT,
    (payload: MemberLeftPayload) => {
      if (payload.serverId !== serverId) return;
      writeEvent('member:left', { userId: payload.userId });
    },
  );

  // ── Subscribe to visibility change events ─────────────────────────────────
  // When a channel's visibility changes, push the updated channel object so
  // connected clients can update the sidebar badge and handle access revocation
  // (PRIVATE channels become inaccessible to non-members) without a page reload.

  const visibilityChangedSubscription = eventBus.subscribe(
    EventChannels.VISIBILITY_CHANGED,
    async (payload: VisibilityChangedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const channel = await prisma.channel.findUnique({
          where: { id: payload.channelId },
          select: CHANNEL_SSE_SELECT,
        });
        if (!channel) return;

        writeEvent('channel:visibility-changed', {
          ...channel,
          // Include old visibility so clients can detect access revocation
          // (e.g. current user is viewing a channel that just became PRIVATE).
          oldVisibility: payload.oldVisibility,
        });
      } catch (err) {
        logger.warn(
          { err, serverId, channelId: payload.channelId },
          'Failed to hydrate SSE channel:visibility-changed payload',
        );
      }
    },
  );

  const serverSubscriptions = [
    channelCreatedSubscription,
    channelUpdatedSubscription,
    channelDeletedSubscription,
    statusChangedSubscription,
    memberJoinedSubscription,
    memberLeftSubscription,
    visibilityChangedSubscription,
  ];

  await finalizeSseSetup(req, res, sseState, serverSubscriptions, {
    route: 'server-events',
    serverId,
  });
});
