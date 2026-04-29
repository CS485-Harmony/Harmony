/**
 * PermissionsSection — server settings panel showing the full permission matrix.
 * Data comes from the backend's permission.getMatrix endpoint so the frontend
 * always reflects the authoritative backend definition.
 */

import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PermissionMatrix = Record<string, string[]>;

// ─── Display helpers ──────────────────────────────────────────────────────────

const ROLE_ORDER = ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST'] as const;

const ROLE_LABEL: Record<string, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  MEMBER: 'Member',
  GUEST: 'Guest',
};

const ROLE_BADGE: Record<string, string> = {
  OWNER: 'bg-purple-600',
  ADMIN: 'bg-red-600',
  MODERATOR: 'bg-blue-600',
  MEMBER: 'bg-gray-600',
  GUEST: 'bg-gray-700',
};

const ROLE_DESCRIPTION: Record<string, string> = {
  OWNER: 'Full control. Can delete the server. Cannot be assigned via role change — only transferred.',
  ADMIN: 'Manages channels, members, and server settings. Cannot delete the server.',
  MODERATOR: 'Can delete any message and pin messages. Cannot manage channels or members.',
  MEMBER: 'Default role on joining. Can send, edit, and delete own messages.',
  GUEST: 'Read-only observer. Can view public channels but cannot send messages. Not assignable via role change.',
};

/** Groups raw action strings into human-readable categories. */
const ACTION_GROUPS: { label: string; actions: string[] }[] = [
  {
    label: 'Server',
    actions: ['server:read', 'server:update', 'server:delete', 'server:manage_members'],
  },
  {
    label: 'Channels',
    actions: ['channel:read', 'channel:create', 'channel:update', 'channel:delete', 'channel:manage_visibility'],
  },
  {
    label: 'Messages',
    actions: [
      'message:read',
      'message:create',
      'message:update_own',
      'message:delete_own',
      'message:delete_any',
      'message:pin',
      'message:react',
    ],
  },
  {
    label: 'Settings',
    actions: ['settings:read', 'settings:update'],
  },
];

const ACTION_LABEL: Record<string, string> = {
  'server:read': 'View server & members',
  'server:update': 'Update server name/description',
  'server:delete': 'Delete server',
  'server:manage_members': 'Manage members (kick / change role)',
  'channel:read': 'View channels',
  'channel:create': 'Create channels',
  'channel:update': 'Edit channel settings',
  'channel:delete': 'Delete channels',
  'channel:manage_visibility': 'Change channel visibility',
  'message:read': 'Read messages',
  'message:create': 'Send messages',
  'message:update_own': 'Edit own messages',
  'message:delete_own': 'Delete own messages',
  'message:delete_any': 'Delete any message',
  'message:pin': 'Pin / unpin messages',
  'message:react': 'Add reactions',
  'settings:read': 'View server settings',
  'settings:update': 'Save server settings',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface PermissionsSectionProps {
  matrix: PermissionMatrix;
}

export function PermissionsSection({ matrix }: PermissionsSectionProps) {
  return (
    <div className='max-w-4xl space-y-8'>
      <div>
        <h2 className='text-xl font-semibold text-white'>Permissions</h2>
        <p className='mt-1 text-sm text-gray-400'>
          Role-based permissions enforced across all server actions. Higher roles inherit all
          permissions of lower roles.
        </p>
      </div>

      {/* Role descriptions */}
      <section aria-labelledby='roles-heading'>
        <h3 id='roles-heading' className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400'>
          Roles
        </h3>
        <div className='space-y-2'>
          {ROLE_ORDER.map(role => (
            <div key={role} className='flex gap-3 rounded bg-[#2f3136] px-4 py-3'>
              <span
                className={`mt-0.5 inline-block h-5 min-w-[5.5rem] rounded px-1.5 py-0.5 text-center text-xs font-medium text-white ${ROLE_BADGE[role]}`}
              >
                {ROLE_LABEL[role]}
              </span>
              <p className='text-sm text-gray-300'>{ROLE_DESCRIPTION[role]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Permission matrix table */}
      <section aria-labelledby='matrix-heading'>
        <h3 id='matrix-heading' className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400'>
          Permission Matrix
        </h3>
        <div className='overflow-x-auto rounded border border-white/10'>
          <table className='w-full min-w-[540px] border-collapse text-sm' role='grid'>
            <thead>
              <tr className='border-b border-white/10 bg-[#1e1f22]'>
                <th
                  scope='col'
                  className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400'
                >
                  Action
                </th>
                {ROLE_ORDER.map(role => (
                  <th
                    key={role}
                    scope='col'
                    className='px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400'
                  >
                    {ROLE_LABEL[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTION_GROUPS.map(group => (
                <React.Fragment key={group.label}>
                  <tr className='border-t border-white/10 bg-[#25262a]'>
                    <td
                      colSpan={ROLE_ORDER.length + 1}
                      className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500'
                    >
                      {group.label}
                    </td>
                  </tr>
                  {group.actions.map((action, idx) => (
                    <tr
                      key={action}
                      className={`border-t border-white/5 ${idx % 2 === 0 ? 'bg-[#2f3136]' : 'bg-[#2b2d31]'}`}
                    >
                      <td className='px-4 py-2 text-gray-300'>{ACTION_LABEL[action] ?? action}</td>
                      {ROLE_ORDER.map(role => {
                        const hasPermission = matrix[role]?.includes(action) ?? false;
                        return (
                          <td key={role} className='px-3 py-2 text-center'>
                            {hasPermission ? (
                              <span aria-label='Allowed' className='text-green-400'>
                                ✓
                              </span>
                            ) : (
                              <span aria-label='Not allowed' className='text-gray-600'>
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
