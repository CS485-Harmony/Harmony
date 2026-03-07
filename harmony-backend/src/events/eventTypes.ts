// ─── Event channel names ──────────────────────────────────────────────────────

export const EventChannels = {
  VISIBILITY_CHANGED: 'harmony:VISIBILITY_CHANGED',
  MESSAGE_CREATED: 'harmony:MESSAGE_CREATED',
  MESSAGE_EDITED: 'harmony:MESSAGE_EDITED',
  MESSAGE_DELETED: 'harmony:MESSAGE_DELETED',
  META_TAGS_UPDATED: 'harmony:META_TAGS_UPDATED',
} as const;

export type EventChannelName = (typeof EventChannels)[keyof typeof EventChannels];

// ─── Event payload types ──────────────────────────────────────────────────────

export interface VisibilityChangedPayload {
  channelId: string;
  serverId: string;
  oldVisibility: string;
  newVisibility: string;
  actorId: string;
  timestamp: string; // ISO 8601
}

export interface MessageCreatedPayload {
  messageId: string;
  channelId: string;
  authorId: string;
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

// Map each channel to its payload type for type-safe subscribe/publish
export interface EventPayloadMap {
  [EventChannels.VISIBILITY_CHANGED]: VisibilityChangedPayload;
  [EventChannels.MESSAGE_CREATED]: MessageCreatedPayload;
  [EventChannels.MESSAGE_EDITED]: MessageEditedPayload;
  [EventChannels.MESSAGE_DELETED]: MessageDeletedPayload;
  [EventChannels.META_TAGS_UPDATED]: MetaTagsUpdatedPayload;
}

export type EventHandler<C extends EventChannelName> = (payload: EventPayloadMap[C]) => void;
