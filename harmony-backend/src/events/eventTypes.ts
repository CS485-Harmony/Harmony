// ─── Shared domain types ──────────────────────────────────────────────────────

/** Canonical visibility values — mirrors the Prisma ChannelVisibility enum. */
export type ChannelVisibilityValue = 'PUBLIC_INDEXABLE' | 'PUBLIC_NO_INDEX' | 'PRIVATE';

// ─── Event channel names ──────────────────────────────────────────────────────

export const EventChannels = {
  VISIBILITY_CHANGED: 'harmony:VISIBILITY_CHANGED',
  MESSAGE_CREATED: 'harmony:MESSAGE_CREATED',
  MESSAGE_EDITED: 'harmony:MESSAGE_EDITED',
  MESSAGE_DELETED: 'harmony:MESSAGE_DELETED',
  META_TAGS_UPDATED: 'harmony:META_TAGS_UPDATED',
  MEMBER_JOINED: 'harmony:MEMBER_JOINED',
  MEMBER_LEFT: 'harmony:MEMBER_LEFT',
  USER_JOINED_VOICE: 'harmony:USER_JOINED_VOICE',
  USER_LEFT_VOICE: 'harmony:USER_LEFT_VOICE',
  VOICE_STATE_CHANGED: 'harmony:VOICE_STATE_CHANGED',
  CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
  CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
  CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
  SERVER_UPDATED: 'harmony:SERVER_UPDATED',
  USER_STATUS_CHANGED: 'harmony:USER_STATUS_CHANGED',
  USER_PROFILE_UPDATED: 'harmony:USER_PROFILE_UPDATED',
  REACTION_ADDED: 'harmony:REACTION_ADDED',
  REACTION_REMOVED: 'harmony:REACTION_REMOVED',
  USER_MENTIONED: 'harmony:USER_MENTIONED',
} as const;

export type EventChannelName = (typeof EventChannels)[keyof typeof EventChannels];

// ─── Event payload types ──────────────────────────────────────────────────────

export interface VisibilityChangedPayload {
  channelId: string;
  serverId: string;
  oldVisibility: ChannelVisibilityValue;
  newVisibility: ChannelVisibilityValue;
  actorId: string;
  timestamp: string; // ISO 8601
}

export interface MessageCreatedPayload {
  messageId: string;
  channelId: string;
  authorId: string;
  /** Present only when the message is a thread reply; absent for top-level channel messages. */
  parentMessageId?: string;
  timestamp: string;
}

export interface MessageEditedPayload {
  messageId: string;
  channelId: string;
  timestamp: string;
}

export interface MessageDeletedPayload {
  messageId: string;
  channelId: string;
  timestamp: string;
}

export interface MetaTagsUpdatedPayload {
  channelId: string;
  version: number;
  timestamp: string;
}

export type RoleTypeValue = 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER' | 'GUEST';

export interface MemberJoinedPayload {
  userId: string;
  serverId: string;
  role: RoleTypeValue;
  timestamp: string;
}

export interface MemberLeftPayload {
  userId: string;
  serverId: string;
  reason: 'LEFT' | 'KICKED';
  timestamp: string;
}

export interface UserJoinedVoicePayload {
  userId: string;
  channelId: string;
  timestamp: string;
}

export interface UserLeftVoicePayload {
  userId: string;
  channelId: string;
  timestamp: string;
}

export interface VoiceStateChangedPayload {
  userId: string;
  channelId: string;
  muted: boolean;
  deafened: boolean;
  timestamp: string;
}

export interface ChannelCreatedPayload {
  channelId: string;
  serverId: string;
  timestamp: string;
}

export interface ChannelUpdatedPayload {
  channelId: string;
  serverId: string;
  timestamp: string;
}

export interface ChannelDeletedPayload {
  channelId: string;
  serverId: string;
  timestamp: string;
}

export interface ServerUpdatedPayload {
  serverId: string;
  name?: string;
  iconUrl?: string | null;
  description?: string | null;
  timestamp: string;
}

export interface UserStatusChangedPayload {
  userId: string;
  serverId: string;
  /** Prisma UserStatus enum value; normalized to lowercase before emitting over SSE. */
  status: 'ONLINE' | 'IDLE' | 'DND' | 'OFFLINE';
}

export interface UserProfileUpdatedPayload {
  userId: string;
  serverId: string;
  timestamp: string;
}

export interface ReactionAddedPayload {
  messageId: string;
  channelId: string;
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface ReactionRemovedPayload {
  messageId: string;
  channelId: string;
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface UserMentionedPayload {
  notificationId: string;
  userId: string;
  messageId: string;
  channelId: string;
  serverId: string;
  authorId: string;
  authorUsername: string;
  timestamp: string;
}

// Map each channel to its payload type for type-safe subscribe/publish
export interface EventPayloadMap {
  [EventChannels.VISIBILITY_CHANGED]: VisibilityChangedPayload;
  [EventChannels.MESSAGE_CREATED]: MessageCreatedPayload;
  [EventChannels.MESSAGE_EDITED]: MessageEditedPayload;
  [EventChannels.MESSAGE_DELETED]: MessageDeletedPayload;
  [EventChannels.META_TAGS_UPDATED]: MetaTagsUpdatedPayload;
  [EventChannels.MEMBER_JOINED]: MemberJoinedPayload;
  [EventChannels.MEMBER_LEFT]: MemberLeftPayload;
  [EventChannels.USER_JOINED_VOICE]: UserJoinedVoicePayload;
  [EventChannels.USER_LEFT_VOICE]: UserLeftVoicePayload;
  [EventChannels.VOICE_STATE_CHANGED]: VoiceStateChangedPayload;
  [EventChannels.CHANNEL_CREATED]: ChannelCreatedPayload;
  [EventChannels.CHANNEL_UPDATED]: ChannelUpdatedPayload;
  [EventChannels.CHANNEL_DELETED]: ChannelDeletedPayload;
  [EventChannels.SERVER_UPDATED]: ServerUpdatedPayload;
  [EventChannels.USER_STATUS_CHANGED]: UserStatusChangedPayload;
  [EventChannels.USER_PROFILE_UPDATED]: UserProfileUpdatedPayload;
  [EventChannels.REACTION_ADDED]: ReactionAddedPayload;
  [EventChannels.REACTION_REMOVED]: ReactionRemovedPayload;
  [EventChannels.USER_MENTIONED]: UserMentionedPayload;
}

export type EventHandler<C extends EventChannelName> = (payload: EventPayloadMap[C]) => void;
