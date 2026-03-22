/**
 * Type Definitions: Server
 * Based on dev spec data schemas
 */

export interface Server {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  ownerId: string;
  description?: string;
  bannerUrl?: string;
  memberCount?: number;
  isPublic?: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ServerMemberInfo {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'owner' | 'admin' | 'moderator' | 'member' | 'guest';
  joinedAt: string;
}

export interface ServerDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  memberCount: number;
  publicChannelCount?: number;
}

export interface CreateServerInput {
  name: string;
  description?: string;
  /** When true the server appears in Browse Public Servers and anyone can join. */
  isPublic?: boolean;
}
