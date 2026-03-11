/**
 * Type Definitions: User
 * Based on dev spec data schemas (CL-D10, CL-E*)
 */

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export type UserRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest';

export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  status: UserStatus;
  role: UserRole;
  /** True when logged in as the dev system admin (admin@harmony.dev). */
  isSystemAdmin?: boolean;
}
