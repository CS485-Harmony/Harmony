/**
 * Type Definitions: Message
 * Based on dev spec data schemas
 */

export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  author: Author;
  content: string;
  timestamp: Date | string;
  attachments?: Attachment[];
  editedAt?: Date | string;
  reactions?: Reaction[];
  /** True when this message has been pinned in its channel. */
  pinned?: boolean;
  /** ID of the parent message when this is a reply; null/undefined for top-level messages. */
  parentMessageId?: string | null;
  /** Number of non-deleted replies on a top-level message. */
  replyCount?: number;
}

/**
 * Author is the message-embedded snapshot of a user.
 * Uses `avatarUrl` (full URL string) to match API response shape,
 * while the User entity uses `avatar` for the same field.
 * messageService maps User.avatar → Author.avatarUrl when constructing messages.
 */
export interface Author {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface Attachment {
  id: string;
  messageId: string;
  url: string;
  filename: string;
  type: string;
  size: number;
}

/** Attachment data returned by the upload endpoint, ready to attach to a message. */
export interface AttachmentInput {
  url: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}

export interface MessageDTO {
  id: string;
  channelId: string;
  author: Author;
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  editedAt?: string;
}
