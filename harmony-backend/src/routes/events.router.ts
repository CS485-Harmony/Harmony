/**
 * SSE Router — Issue #180
 *
 * POST /api/events/ticket
 *   Requires Authorization: Bearer <accessToken>.
 *   Returns a one-shot nonce stored in Redis for 60 s.
 *
 * GET /api/events/channel/:channelId?ticket=<nonce>
 * GET /api/events/server/:serverId?ticket=<nonce>
 * GET /api/events/user?ticket=<nonce>
 *
 * Streams real-time events using Server-Sent Events.
 *
 * Auth: EventSource cannot send custom headers, so a short-lived one-shot ticket
 * is used instead of passing the JWT directly in the query string. The frontend
 * calls POST /api/events/ticket first, then opens the EventSource with ?ticket=<nonce>.
 * The nonce is consumed immediately on first use, preventing replay.
 */

import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { redis } from '../db/redis';
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
  UserProfileUpdatedPayload,
  MemberJoinedPayload,
  MemberLeftPayload,
  VisibilityChangedPayload,
  UserMentionedPayload,
  ReactionAddedPayload,
  ReactionRemovedPayload,
  UserJoinedVoicePayload,
  UserLeftVoicePayload,
  VoiceStateChangedPayload,
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

// ─── SSE ticket helpers ───────────────────────────────────────────────────────

const TICKET_TTL_SECONDS = 60;

function ticketKey(nonce: string): string {
  return `sse:ticket:${nonce}`;
}

/**
 * Atomically read and delete the ticket key so concurrent requests cannot both
 * redeem the same one-shot nonce. Lua works on all Redis versions (GETDEL alone is 6.2+).
 */
const REDEEM_TICKET_LUA = `
local v = redis.call('GET', KEYS[1])
if v == false then return false end
redis.call('DEL', KEYS[1])
return v
`;

/**
 * Exchange a one-shot nonce for the userId it was issued for, then delete it.
 * Returns null if the nonce does not exist or has expired.
 */
async function redeemTicket(nonce: string): Promise<string | null> {
  const key = ticketKey(nonce);
  const raw = (await redis.eval(REDEEM_TICKET_LUA, 1, key)) as string | boolean | null;
  if (raw === false || raw == null) return null;
  return typeof raw === 'string' ? raw : String(raw);
}

// ─── Ticket issuance endpoint ─────────────────────────────────────────────────

/**
 * POST /api/events/ticket
 *
 * Requires Authorization: Bearer <accessToken>.
 * Returns { ticket: <nonce> } — the nonce must be passed as ?ticket=<nonce>
 * when opening an SSE connection. The nonce is valid for 60 seconds and can
 * only be used once.
 */
eventsRouter.post('/ticket', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  let userId: string;
  try {
    const payload = authService.verifyAccessToken(authHeader.slice(7));
    userId = payload.sub;
  } catch {
    res.status(401).json({ error: 'Invalid or expired access token' });
    return;
  }

  const nonce = crypto.randomUUID();
  await redis.set(ticketKey(nonce), userId, 'EX', TICKET_TTL_SECONDS);
  res.json({ ticket: nonce });
});

// ─── Prisma select shape (matches frontend Message type) ──────────────────────

const MESSAGE_SSE_INCLUDE = {
  author: {
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  },
  attachments: {
    select: { id: true, filename: true, url: true, contentType: true },
  },
  parent: {
    select: {
      id: true,
      content: true,
      isDeleted: true,
      author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
    },
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

function formatEvent(eventType: string, data: unknown, id?: string): string {
  const idLine = id !== undefined ? `id: ${id}\n` : '';
  return `${idLine}event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
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
): (eventType: string, data: unknown, id?: string) => void {
  return (eventType: string, data: unknown, id?: string) => {
    if (state.closed) return;
    const frame = formatEvent(eventType, data, id);
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
  replayFrames?: () => Promise<string[]>,
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

  // Replay missed events (Last-Event-ID) before flushing the live buffer.
  // This fills the reconnect gap: DB range [lastEventId, subscribeStartTime],
  // buffer range [subscribeStartTime, ∞) — no overlap, no duplicates.
  if (replayFrames) {
    try {
      const frames = await replayFrames();
      for (const frame of frames) {
        res.write(frame);
      }
    } catch (err) {
      logger.warn({ err, ...logContext }, 'Last-Event-ID replay failed; continuing without replay');
    }
  }

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

  // ── Auth — one-shot ticket exchanged via POST /api/events/ticket ─────────
  const ticket = typeof req.query.ticket === 'string' ? req.query.ticket : null;
  if (!ticket) {
    res.status(401).json({ error: 'Missing ticket query parameter' });
    return;
  }

  const userId = await redeemTicket(ticket);
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired SSE ticket' });
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

  // ── Last-Event-ID replay — capture subscription start time and last ID ────
  const subscribeStartTime = new Date();
  const lastEventId =
    (typeof req.headers['last-event-id'] === 'string' ? req.headers['last-event-id'] : null) ??
    (typeof req.query.lastEventId === 'string' ? req.query.lastEventId : null);

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

        writeEvent(
          'message:created',
          {
            id: message.id,
            channelId: message.channelId,
            authorId: message.authorId,
            author: message.author,
            content: message.content,
            timestamp: message.createdAt.toISOString(),
            attachments: message.attachments,
            editedAt: message.editedAt ? message.editedAt.toISOString() : null,
            parentMessageId: message.parentMessageId,
            parentMessage: message.parent
              ? {
                  id: message.parent.id,
                  content: message.parent.isDeleted ? '' : message.parent.content,
                  isDeleted: message.parent.isDeleted,
                  author: message.parent.author,
                }
              : null,
          },
          message.createdAt.toISOString(),
        );
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
      writeEvent('message:deleted', {
        messageId: payload.messageId,
        channelId: payload.channelId,
      });
    },
  );

  const serverUpdatedSubscription = eventBus.subscribe(
    EventChannels.SERVER_UPDATED,
    (payload: ServerUpdatedPayload) => {
      if (payload.serverId !== channel.serverId) return;
      writeEvent('server:updated', {
        id: payload.serverId,
        name: payload.name,
        icon: payload.iconUrl ?? undefined,
        description: payload.description,
        updatedAt: payload.timestamp,
      });
    },
  );

  const reactionAddedSubscription = eventBus.subscribe(
    EventChannels.REACTION_ADDED,
    (payload: ReactionAddedPayload) => {
      if (payload.channelId !== channelId) return;
      writeEvent('reaction:added', {
        messageId: payload.messageId,
        channelId: payload.channelId,
        userId: payload.userId,
        emoji: payload.emoji,
      });
    },
  );

  const reactionRemovedSubscription = eventBus.subscribe(
    EventChannels.REACTION_REMOVED,
    (payload: ReactionRemovedPayload) => {
      if (payload.channelId !== channelId) return;
      writeEvent('reaction:removed', {
        messageId: payload.messageId,
        channelId: payload.channelId,
        userId: payload.userId,
        emoji: payload.emoji,
      });
    },
  );

  const channelSubscriptions = [
    createdSubscription,
    editedSubscription,
    deletedSubscription,
    serverUpdatedSubscription,
    reactionAddedSubscription,
    reactionRemovedSubscription,
  ];

  // ── Replay messages missed during reconnect gap ──────────────────────────
  const replayFrames = lastEventId
    ? async (): Promise<string[]> => {
        const lastTs = new Date(lastEventId);
        if (isNaN(lastTs.getTime())) return [];
        const missed = await prisma.message.findMany({
          where: {
            channelId,
            isDeleted: false,
            createdAt: { gt: lastTs, lt: subscribeStartTime },
          },
          include: MESSAGE_SSE_INCLUDE,
          orderBy: { createdAt: 'asc' },
        });
        return missed.map((msg) =>
          formatEvent(
            'message:created',
            {
              id: msg.id,
              channelId: msg.channelId,
              authorId: msg.authorId,
              author: msg.author,
              content: msg.content,
              timestamp: msg.createdAt.toISOString(),
              attachments: msg.attachments,
              editedAt: msg.editedAt ? msg.editedAt.toISOString() : null,
              parentMessageId: msg.parentMessageId,
              parentMessage: msg.parent
                ? {
                    id: msg.parent.id,
                    content: msg.parent.isDeleted ? '' : msg.parent.content,
                    isDeleted: msg.parent.isDeleted,
                    author: msg.parent.author,
                  }
                : null,
            },
            msg.createdAt.toISOString(),
          ),
        );
      }
    : undefined;

  await finalizeSseSetup(
    req,
    res,
    sseState,
    channelSubscriptions,
    { route: 'channel-events', channelId, serverId: channel.serverId },
    replayFrames,
  );
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
 * GET /api/events/server/:serverId?ticket=<nonce>
 *
 * Streams real-time server events to authenticated, authorised clients using
 * Server-Sent Events. Scoped to a server so all members see the same sidebar,
 * member, message, and server updates regardless of which channel they are viewing.
 *
 * Auth: one-shot ticket pattern — call POST /api/events/ticket first, then
 * pass the returned nonce as ?ticket=<nonce>.
 *
 * Authorisation: user must be a member of the server.
 */
eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
  const { serverId } = req.params;

  if (!isValidUUID(serverId)) {
    res.status(400).json({ error: 'Invalid serverId: must be a UUID' });
    return;
  }

  // ── Auth — one-shot ticket ────────────────────────────────────────────────
  const ticket = typeof req.query.ticket === 'string' ? req.query.ticket : null;
  if (!ticket) {
    res.status(401).json({ error: 'Missing ticket query parameter' });
    return;
  }

  const userId = await redeemTicket(ticket);
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired SSE ticket' });
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

  // ── Last-Event-ID replay — capture subscription start time and last ID ────
  const subscribeStartTime = new Date();
  const lastEventId =
    (typeof req.headers['last-event-id'] === 'string' ? req.headers['last-event-id'] : null) ??
    (typeof req.query.lastEventId === 'string' ? req.query.lastEventId : null);

  const sseState = createBufferedSseState();
  const writeEvent = createBufferedEventWriter(res, sseState);
  const serverChannelIds = new Set<string>();
  const subscriptions: EventSubscription[] = [];
  let cleanedUp = false;

  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    cleanupSseConnection(sseState, subscriptions);
  };
  req.on('close', cleanup);

  // Register create/delete subscriptions before the preload query so channel-ID
  // tracking stays correct if channels change while the initial lookup is in flight.
  const channelCreatedSubscription = eventBus.subscribe(
    EventChannels.CHANNEL_CREATED,
    async (payload: ChannelCreatedPayload) => {
      if (payload.serverId !== serverId) return;
      serverChannelIds.add(payload.channelId);

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
  subscriptions.push(channelCreatedSubscription);

  const channelDeletedSubscription = eventBus.subscribe(
    EventChannels.CHANNEL_DELETED,
    (payload: ChannelDeletedPayload) => {
      if (payload.serverId !== serverId) return;
      serverChannelIds.delete(payload.channelId);
      writeEvent('channel:deleted', { channelId: payload.channelId });
    },
  );
  subscriptions.push(channelDeletedSubscription);

  let serverChannels: { id: string }[];
  try {
    serverChannels = await prisma.channel.findMany({
      where: { serverId },
      select: { id: true },
    });
  } catch (err) {
    cleanup();
    logger.error({ err, serverId }, 'Failed to preload channel IDs for server SSE');
    if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
    return;
  }
  for (const currentChannel of serverChannels) {
    serverChannelIds.add(currentChannel.id);
  }

  if (cleanedUp) return;

  const messageCreatedSubscription = eventBus.subscribe(
    EventChannels.MESSAGE_CREATED,
    async (payload: MessageCreatedPayload) => {
      if (!serverChannelIds.has(payload.channelId)) return;

      try {
        const message = await prisma.message.findUnique({
          where: { id: payload.messageId },
          include: MESSAGE_SSE_INCLUDE,
        });
        if (!message || message.isDeleted) return;

        writeEvent(
          'message:created',
          {
            id: message.id,
            channelId: message.channelId,
            authorId: message.authorId,
            author: message.author,
            content: message.content,
            timestamp: message.createdAt.toISOString(),
            attachments: message.attachments,
            editedAt: message.editedAt ? message.editedAt.toISOString() : null,
            parentMessageId: message.parentMessageId,
            parentMessage: message.parent
              ? {
                  id: message.parent.id,
                  content: message.parent.isDeleted ? '' : message.parent.content,
                  isDeleted: message.parent.isDeleted,
                  author: message.parent.author,
                }
              : null,
          },
          message.createdAt.toISOString(),
        );
      } catch (err) {
        logger.warn(
          { err, serverId, messageId: payload.messageId },
          'Failed to hydrate SSE message:created payload on server endpoint',
        );
      }
    },
  );
  subscriptions.push(messageCreatedSubscription);

  const messageEditedSubscription = eventBus.subscribe(
    EventChannels.MESSAGE_EDITED,
    async (payload: MessageEditedPayload) => {
      if (!serverChannelIds.has(payload.channelId)) return;

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
          { err, serverId, messageId: payload.messageId },
          'Failed to hydrate SSE message:edited payload on server endpoint',
        );
      }
    },
  );
  subscriptions.push(messageEditedSubscription);

  const messageDeletedSubscription = eventBus.subscribe(
    EventChannels.MESSAGE_DELETED,
    (payload: MessageDeletedPayload) => {
      if (!serverChannelIds.has(payload.channelId)) return;
      writeEvent('message:deleted', {
        messageId: payload.messageId,
        channelId: payload.channelId,
      });
    },
  );
  subscriptions.push(messageDeletedSubscription);

  const serverUpdatedSubscription = eventBus.subscribe(
    EventChannels.SERVER_UPDATED,
    (payload: ServerUpdatedPayload) => {
      if (payload.serverId !== serverId) return;
      writeEvent('server:updated', {
        id: payload.serverId,
        name: payload.name,
        icon: payload.iconUrl ?? undefined,
        description: payload.description,
        updatedAt: payload.timestamp,
      });
    },
  );
  subscriptions.push(serverUpdatedSubscription);

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
  subscriptions.push(channelUpdatedSubscription);

  // Status reflects presence (ONLINE/IDLE/OFFLINE) not identity, so it is emitted
  // regardless of the user's publicProfile setting — consistent with the rationale
  // documented in PR #202 for member join/leave events.
  const statusChangedSubscription = eventBus.subscribe(
    EventChannels.USER_STATUS_CHANGED,
    (payload: UserStatusChangedPayload) => {
      if (payload.serverId !== serverId) return;
      writeEvent('member:statusChanged', {
        id: payload.userId,
        status: payload.status.toLowerCase(),
      });
    },
  );
  subscriptions.push(statusChangedSubscription);

  const profileUpdatedSubscription = eventBus.subscribe(
    EventChannels.USER_PROFILE_UPDATED,
    async (payload: UserProfileUpdatedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            publicProfile: true,
          },
        });
        if (!user) return;

        const isPublic = user.publicProfile;
        writeEvent('member:profileUpdated', {
          id: user.id,
          username: isPublic ? user.username : 'Anonymous',
          displayName: isPublic ? (user.displayName ?? undefined) : undefined,
          avatarUrl: isPublic ? (user.avatarUrl ?? undefined) : undefined,
        });
      } catch (err) {
        logger.warn(
          { err, serverId, userId: payload.userId },
          'Failed to hydrate SSE member:profileUpdated payload',
        );
      }
    },
  );
  subscriptions.push(profileUpdatedSubscription);

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

        const isPublic = user.publicProfile;
        writeEvent('member:joined', {
          id: user.id,
          username: isPublic ? user.username : 'Anonymous',
          displayName: isPublic ? user.displayName : undefined,
          avatar: isPublic ? (user.avatarUrl ?? undefined) : undefined,
          role: payload.role.toLowerCase(),
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
  subscriptions.push(memberJoinedSubscription);

  const memberLeftSubscription = eventBus.subscribe(
    EventChannels.MEMBER_LEFT,
    (payload: MemberLeftPayload) => {
      if (payload.serverId !== serverId) return;
      writeEvent('member:left', { userId: payload.userId });
    },
  );
  subscriptions.push(memberLeftSubscription);

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
  subscriptions.push(visibilityChangedSubscription);

  const serverReactionAddedSubscription = eventBus.subscribe(
    EventChannels.REACTION_ADDED,
    (payload: ReactionAddedPayload) => {
      if (!serverChannelIds.has(payload.channelId)) return;
      writeEvent('reaction:added', {
        messageId: payload.messageId,
        channelId: payload.channelId,
        userId: payload.userId,
        emoji: payload.emoji,
      });
    },
  );
  subscriptions.push(serverReactionAddedSubscription);

  const serverReactionRemovedSubscription = eventBus.subscribe(
    EventChannels.REACTION_REMOVED,
    (payload: ReactionRemovedPayload) => {
      if (!serverChannelIds.has(payload.channelId)) return;
      writeEvent('reaction:removed', {
        messageId: payload.messageId,
        channelId: payload.channelId,
        userId: payload.userId,
        emoji: payload.emoji,
      });
    },
  );
  subscriptions.push(serverReactionRemovedSubscription);

  const voiceUserJoinedSubscription = eventBus.subscribe(
    EventChannels.USER_JOINED_VOICE,
    (payload: UserJoinedVoicePayload) => {
      if (!serverChannelIds.has(payload.channelId)) return;
      writeEvent('voice:userJoined', { channelId: payload.channelId, userId: payload.userId });
    },
  );
  subscriptions.push(voiceUserJoinedSubscription);

  const voiceUserLeftSubscription = eventBus.subscribe(
    EventChannels.USER_LEFT_VOICE,
    (payload: UserLeftVoicePayload) => {
      if (!serverChannelIds.has(payload.channelId)) return;
      writeEvent('voice:userLeft', { channelId: payload.channelId, userId: payload.userId });
    },
  );
  subscriptions.push(voiceUserLeftSubscription);

  const voiceStateChangedSubscription = eventBus.subscribe(
    EventChannels.VOICE_STATE_CHANGED,
    (payload: VoiceStateChangedPayload) => {
      if (!serverChannelIds.has(payload.channelId)) return;
      writeEvent('voice:stateChanged', {
        channelId: payload.channelId,
        userId: payload.userId,
        muted: payload.muted,
        deafened: payload.deafened,
      });
    },
  );
  subscriptions.push(voiceStateChangedSubscription);

  // ── Replay messages missed during reconnect gap ──────────────────────────
  const serverReplayFrames = lastEventId
    ? async (): Promise<string[]> => {
        const lastTs = new Date(lastEventId);
        if (isNaN(lastTs.getTime())) return [];
        const channelIdList = [...serverChannelIds];
        if (channelIdList.length === 0) return [];
        const missed = await prisma.message.findMany({
          where: {
            channelId: { in: channelIdList },
            isDeleted: false,
            createdAt: { gt: lastTs, lt: subscribeStartTime },
          },
          include: MESSAGE_SSE_INCLUDE,
          orderBy: { createdAt: 'asc' },
        });
        return missed.map((msg) =>
          formatEvent(
            'message:created',
            {
              id: msg.id,
              channelId: msg.channelId,
              authorId: msg.authorId,
              author: msg.author,
              content: msg.content,
              timestamp: msg.createdAt.toISOString(),
              attachments: msg.attachments,
              editedAt: msg.editedAt ? msg.editedAt.toISOString() : null,
              parentMessageId: msg.parentMessageId,
              parentMessage: msg.parent
                ? {
                    id: msg.parent.id,
                    content: msg.parent.isDeleted ? '' : msg.parent.content,
                    isDeleted: msg.parent.isDeleted,
                    author: msg.parent.author,
                  }
                : null,
            },
            msg.createdAt.toISOString(),
          ),
        );
      }
    : undefined;

  await finalizeSseSetup(req, res, sseState, subscriptions, { route: 'server-events', serverId }, serverReplayFrames);
});

// ─── User-scoped notification SSE route ──────────────────────────────────────

/**
 * GET /api/events/user?ticket=<nonce>
 *
 * Streams real-time mention notifications to the authenticated user.
 * Each connected client only receives events addressed to their own userId.
 */
eventsRouter.get('/user', async (req: Request, res: Response) => {
  const ticket = typeof req.query.ticket === 'string' ? req.query.ticket : null;
  if (!ticket) {
    res.status(401).json({ error: 'Missing ticket query parameter' });
    return;
  }

  const userId = await redeemTicket(ticket);
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired SSE ticket' });
    return;
  }

  const sseState = createBufferedSseState();
  const writeEvent = createBufferedEventWriter(res, sseState);

  const mentionSubscription = eventBus.subscribe(
    EventChannels.USER_MENTIONED,
    (payload: UserMentionedPayload) => {
      if (payload.userId !== userId) return;
      writeEvent('notification:mention', {
        id: payload.notificationId,
        messageId: payload.messageId,
        channelId: payload.channelId,
        serverId: payload.serverId,
        authorId: payload.authorId,
        authorUsername: payload.authorUsername,
        timestamp: payload.timestamp,
        read: false,
      });
    },
  );

  await finalizeSseSetup(req, res, sseState, [mentionSubscription], { route: 'user-events', userId });
});
