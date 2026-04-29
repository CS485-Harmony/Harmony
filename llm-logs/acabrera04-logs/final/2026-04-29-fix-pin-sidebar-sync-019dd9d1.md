# Codex Conversation Export

## Metadata

- Thread ID: 019dd9d1-afec-7b91-ae32-113b1e05ff94
- Timestamp: 2026-04-29T15:18:11.186Z
- CWD: /Users/allen/.codex/worktrees/cafd/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.3-codex
- Reasoning Effort: medium
- Rollout Path: /Users/allen/.codex/sessions/2026/04/29/rollout-2026-04-29T11-18-11-019dd9d1-afec-7b91-ae32-113b1e05ff94.jsonl

## Transcript

### Turn 1: https://github.com/CS485-Harmony/Harmony/issues/500 complete this

#### 👤 User Prompt

- Time: 2026-04-29T15:18:12.770Z

```text
https://github.com/CS485-Harmony/Harmony/issues/500 complete this issue. The pin sidebar is there, however it does not update in real time when a message is pinned, only when it's closed and reopened. Also clicking the pin button should also close the sidebar
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:18:18.835Z

I’ll implement the real-time pin sidebar update and the auto-close behavior on pin click. First I’m checking `WORKFLOW.md` and then tracing the pin/sidebar state flow in the frontend to patch it in the right place.

#### Tool: exec_command

```sh
rtk read WORKFLOW.md
```

Output:

````text
## Workflow Orchestration
### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean 
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop 
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
This project uses a **hybrid approach**: `tasks/todo.md` for AI context, GitHub Issues as the canonical tracker on the Harmony Project Board (course requirement).

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items (local scratch pad for AI context)
2. **Identify the Issue**: If the task maps to an existing GitHub Issue, note the issue number at the top of `tasks/todo.md`
3. **Announce Start**: Post an opening comment to the issue — `gh issue comment <number> --body "..."` — describing what will be done
4. **Track Progress**: Mark items complete in `tasks/todo.md` as you go; post a comment to the issue at meaningful milestones (e.g., after a major step or when blocked)
5. **Explain Changes**: High-level summary at each step
6. **Document Results**: Add a review section to `tasks/todo.md` and post a final summary comment to the issue when complete
7. **Capture Lessons**: Update `tasks/lessons.md` after corrections. Post the new lessons learned as a comment to the issue.

### Issue Comment Format
Use this structure for issue comments to keep the audit trail readable:

```
**[AI Agent — <Step>]**

<What was done or decided>

<Any blockers, decisions, or next steps>
```

Example steps: `Starting`, `In Progress`, `Blocked`, `Complete`

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Lean Context Files**: Keep AGENTS.md and similar files to only non-obvious, non-discoverable essentials. Research shows context file bloat decreases task success rates and increases inference cost by 20%+ with 2–4 extra steps per task (Gloaguen et al., 2026).


#### Taken from https://x.com/mdancho84/status/2023738764841894352

Gloaguen, T., Mündler, N., Müller, M., Raychev, V., & Vechev, M. (2026, February 12). Evaluating AGENTS.MD: Are Repository-Level context Files helpful for coding agents? arXiv.org. https://arxiv.org/abs/2602.11988
````

#### Tool: exec_command

```sh
rtk grep -n "pin|pinned|sidebar" harmony-frontend/src
```

Output:

```text
123 matches in 35F:

[file] harmony-frontend/.../__tests__/private-channel-pane-lock.test.tsx (4):
    38: ChannelSidebar: () => <div>Channel sidebar</div>,
    72: MembersSidebar: () => <div>Members sidebar</div>,
   182: expect(screen.getByText('Channel sidebar')).toBeInTheDocument();
   194: expect(screen.getByText('Channel sidebar')).toBeInTheDocument();

[file] harmony-frontend/.../__tests__/publicApiService.test.ts (1):
   155: label: 'private visibility mapping in a successful payload',

[file] harmony-frontend/src/__tests__/seo-routes.test.ts (1):
    77: '<?xml version="1.0"?><sitemapindex><sitemap><loc>https://harmony.chat/sitema...

[file] harmony-frontend/.../__tests__/serverService.test.ts (1):
   796: // ── toFrontendServer field mapping (tested indirectly) ────────────────────...

[file] harmony-frontend/.../actions/getPinnedMessages.ts (1):
     7: * Server action to fetch pinned messages for a channel.

[file] harmony-frontend/src/app/actions/pinMessage.ts (6):
     8: * Server actions for pinning/unpinning messages.
     9: * Require message:pin permission (MODERATOR, ADMIN, OWNER) — enforced by the ...
    12: export async function pinMessageAction(messageId: string, serverId: string): ...
    14: await trpcMutate('message.pinMessage', { messageId, serverId });
    21: export async function unpinMessageAction(messageId: string, serverId: string)...
    23: await trpcMutate('message.unpinMessage', { messageId, serverId });

[file] harmony-frontend/src/app/actions/sendMessage.ts (1):
     7: * Server action wrapping sendMessage for use in client components.

[file] harmony-frontend/.../[channelSlug]/loading.tsx (2):
    18: {/* Channel sidebar */}
    60: {/* Members sidebar */}

[file] harmony-frontend/.../[serverSlug]/page.tsx (4):
    56: // can still reach private channels by clicking them in the channel sidebar.
    90: // Only show channels members can actually navigate to in the sidebar. Private
    93: const sidebarChannels = showNoAccessMessage
   105: channels={sidebarChannels}

[file] harmony-frontend/.../[channelSlug]/actions.ts (1):
    62: // Invalidate at layout level so sidebars (channel lists) across all pages

[file] harmony-frontend/src/components/README.md (1):
    37: - `ServerSidebar.tsx` - Server navigation sidebar (C1.6)

[file] harmony-frontend/.../channel/ChannelPageContent.tsx (1):
    14: /** When true, uses the /c basePath so sidebar links stay on the guest route. */

[file] harmony-frontend/.../channel/CreateChannelModal.tsx (3):
    87: function SpinnerIcon() {
    89: <svg className='h-4 w-4 animate-spin shrink-0' viewBox='0 0 24 24' fill='none...
   450: {isLoading && <SpinnerIcon />}

[file] harmony-frontend/.../channel/GuestChannelView.tsx (1):
    76: //                 back here with a valid token and we'll get a 403, stopping...

[file] harmony-frontend/.../channel/MembersSidebar.tsx (2):
   139: /** Whether the sidebar is visible */
   141: /** Callback to close the sidebar (used by mobile overlay close button) */

[file] harmony-frontend/.../channel/MessageInput.tsx (2):
   332: /* Spinner while uploading */
   334: className='h-4 w-4 animate-spin'

[file] harmony-frontend/.../channel/MessageList.tsx (4):
     3: * Scrollable, chronological message feed with author grouping, date separators,
    23: * #c31: guards against NaN timestamps so grouping never silently breaks.
    72: /** Server ID passed to MessageItem for pin/unpin actions. */
    74: /** When true, shows the pin/unpin option on message hover. Grant to MODERATO...

[file] harmony-frontend/.../channel/PinnedMessagesPanel.tsx (6):
     3: * Sidebar panel that displays pinned messages for the current channel.
   104: const pinned = await getPinnedMessagesAction(channelId, serverId);
   105: if (isCurrent) setMessages(pinned);
   107: if (isCurrent) setError('Failed to load pinned messages.');
   131: aria-label='Close pinned messages'
   150: No pinned messages in #{channelName}.

[file] harmony-frontend/src/components/channel/TopBar.tsx (6):
   156: /** Whether the members sidebar is currently open */
   158: /** Callback to toggle the members sidebar */
   160: /** Whether the channel sidebar drawer is currently open (mobile) */
   162: /** Callback to toggle the channel sidebar drawer (mobile) */
   166: /** Callback fired when the pinned messages icon is clicked */
   233: {/* Members sidebar toggle */}

[file] harmony-frontend/.../channel/VisibilityGuard.tsx (1):
    28: className='h-8 w-8 animate-spin'

[file] harmony-frontend/.../channel/VisibilityToggle.tsx (1):
   387: className='h-4 w-4 animate-spin'

[file] harmony-frontend/.../layout/EmptyShell.tsx (4):
     5: *   - "no servers": ServerRail with no entries, no channel sidebar, empty-sta...
     6: *   - "no channels": ServerRail with servers, channel sidebar (no active chan...
    40: /** When provided, the channel sidebar is rendered for this server. */
    42: /** Channels to display in the sidebar (pass [] for "empty channel list" appe...

[file] harmony-frontend/.../layout/HarmonyShell.tsx (9):
    70: /** Optional replacement for the center chat pane while keeping the shell vis...
   101: // #c25: track mobile channel-sidebar state so aria-expanded on hamburger ref...
   115: // Only auto-close the members sidebar on mobile so desktop keeps it open by ...
   120: // Local channels state so newly created channels appear immediately in the s...
   148: // Local members state so join/leave/status events update the sidebar without...
   201: // Show the pin UI only to users with MODERATOR+ server-scoped role, and never
   202: // while the channel is locked (pinning would be meaningless/unauthorized any...
   350: // Update the channel's visibility in the sidebar immediately.
   454: {/* 2. Channel sidebar — mobile overlay when isMenuOpen, always visible on de...

[file] harmony-frontend/.../message/MessageItem.tsx (19):
     8: * stub for all users. Shows a "More" (⋯) dropdown with "Pin/Unpin Message" for
     9: * users with message:pin permission (MODERATOR, ADMIN, OWNER), and "Edit
    22: import { pinMessageAction, unpinMessageAction } from '@/app/actions/pinMessage';
   160: * dropdown with Pin/Unpin (canPin) and Edit Message (isOwnMessage).
   185: const [pinState, setPinState] = useState<PinState>('idle');
   186: const [pinErrorMsg, setPinErrorMsg] = useState('');
   215: const verb = isPinned ? 'unpin' : 'pin';
   218: ? await unpinMessageAction(messageId, serverId)
   219: : await pinMessageAction(messageId, serverId);
   251: {/* Inline pin feedback */}
   252: {pinState === 'success' && (
   253: <span className='px-2 text-xs text-green-400'>{isPinned ? '📌 Pinned' : 'Unpin...
   255: {pinState === 'error' && <span className='px-2 text-xs text-red-400'>{pinErro...
   303: {/* More — rendered when user can pin or is the message author */}
   361: disabled={pinState === 'loading'}
   365: {isPinned ? 'Unpin Message' : 'Pin Message'}
   388: /** When true, shows the pin/unpin option in the action bar. Grant to MODERAT...
   390: /** Required for pin actions. Passed alongside canPin. */
   494: initialPinned={!!message.pinned}

[file] harmony-frontend/.../server-rail/BrowseServersModal.tsx (1):
   265: <svg className='mr-2 h-5 w-5 animate-spin' viewBox='0 0 24 24' fill='none'>

[file] harmony-frontend/.../settings/ChannelSettingsPage.tsx (12):
     3: * Client component — handles sidebar nav, auth guard, and editable Overview s...
    26: sidebar: 'bg-[#2f3136]',
   474: {/* Initial load spinner — only shown before first data arrives */}
   478: className='h-4 w-4 animate-spin'
   532: // ─── Loading spinner ──────────────────────────────────────────────────────...
   554: // Render-phase derived-state reset: keep sidebar heading and back-button text
   568: {/* Mobile sidebar backdrop */}
   578: {/* Settings sidebar */}
   580: id='settings-sidebar'
   583: BG.sidebar,
   623: {/* Mobile sidebar toggle */}
   630: aria-controls='settings-sidebar'

[file] harmony-frontend/.../settings/MembersSection.tsx (1):
   285: <div className='h-6 w-6 animate-spin rounded-full border-4 border-[#5865f2] b...

[file] harmony-frontend/.../settings/PermissionsSection.tsx (3):
    34: MODERATOR: 'Can delete any message and pin messages. Cannot manage channels o...
    57: 'message:pin',
    82: 'message:pin': 'Pin / unpin messages',

[file] harmony-frontend/.../settings/ServerSettingsPage.tsx (8):
     3: * Client component — handles sidebar nav, auth guard, Overview, and Danger Zo...
    24: sidebar: 'bg-[#2f3136]',
   282: {/* Mobile sidebar backdrop */}
   292: {/* Settings sidebar */}
   294: id='settings-sidebar'
   297: BG.sidebar,
   339: {/* Mobile sidebar toggle */}
   346: aria-controls='settings-sidebar'

[file] harmony-frontend/.../settings/UserSettingsPage.tsx (8):
     3: * Client component — Discord-style sidebar settings for the current user.
    22: sidebar: 'bg-[#2f3136]',
   377: <div className='h-8 w-8 animate-spin rounded-full border-2 border-[#5865f2] b...
   386: {/* Mobile sidebar backdrop */}
   398: id='settings-sidebar'
   401: BG.sidebar,
   445: {/* Mobile top bar with sidebar toggle and back button */}
   453: aria-controls='settings-sidebar'

[file] harmony-frontend/.../ui/TailwindTest.tsx (1):
    16: {/* Channel sidebar */}

[file] harmony-frontend/src/contexts/VoiceContext.tsx (3):
    16: *   server, fetched on mount, so the sidebar shows presence before joining.
   145: // This populates the sidebar before the user has joined any channel.
   239: // Remove local user from channelParticipants so the sidebar updates immediat...

[file] harmony-frontend/src/middleware.ts (1):
     5: * to /auth/login immediately, eliminating the 3-4s client-side spinner (#71).

[file] harmony-frontend/src/services/authService.ts (1):
    53: // ─── Mapping helpers ──────────────────────────────────────────────────────...

[file] harmony-frontend/src/types/message.ts (2):
    22: /** True when this message has been pinned in its channel. */
    23: pinned?: boolean;
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:18:25.330Z

I found the key components (`PinnedMessagesPanel`, `MessageItem`, and `HarmonyShell`). Next I’m reading those files to wire the panel refresh to live message updates and close it on pin action.

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx
```

Output:

```text
/**
 * Channel Component: PinnedMessagesPanel
 * Sidebar panel that displays pinned messages for the current channel.
 * Fetches via the getPinnedMessages tRPC procedure (server action).
 */

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getPinnedMessagesAction } from '@/app/actions/getPinnedMessages';
import type { Message } from '@/types';

// ─── Icons ────────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg
      className='h-4 w-4'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M18 6 6 18M6 6l12 12' />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className='h-4 w-4'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: Date | string): string {
  const date = ts instanceof Date ? ts : new Date(ts);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PinnedMessageItem({ message }: { message: Message }) {
  return (
    <article className='rounded-md bg-[#2f3136] p-3'>
      <div className='mb-1 flex items-center gap-2'>
        <span className='text-sm font-semibold text-white'>
          {message.author.displayName ?? message.author.username}
        </span>
        <span className='text-xs text-gray-400'>{formatTimestamp(message.timestamp)}</span>
      </div>
      <p className='break-words text-sm text-gray-200'>{message.content}</p>
    </article>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface PinnedMessagesPanelProps {
  channelId: string;
  serverId: string;
  channelName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PinnedMessagesPanel({
  channelId,
  serverId,
  channelName,
  isOpen,
  onClose,
}: PinnedMessagesPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // isCurrent guard: prevents a slow in-flight fetch from a previous channel
  // overwriting results after the user has already switched to a new channel.
  // Async IIFE keeps setState calls inside a function body (not directly in the
  // effect) to satisfy the react-hooks/set-state-in-effect lint rule.
  useEffect(() => {
    if (!isOpen) return;
    let isCurrent = true;
    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pinned = await getPinnedMessagesAction(channelId, serverId);
        if (isCurrent) setMessages(pinned);
      } catch {
        if (isCurrent) setError('Failed to load pinned messages.');
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    })();
    return () => { isCurrent = false; };
  }, [isOpen, channelId, serverId]);

  return (
    <aside
      className={cn(
        'h-full w-60 flex-shrink-0 flex-col border-l border-black/20 bg-[#2b2d31] transition-all duration-200',
        isOpen ? 'flex' : 'hidden',
      )}
      aria-label='Pinned messages'
    >
      {/* Header */}
      <div className='flex h-12 items-center justify-between border-b border-black/20 px-4'>
        <div className='flex items-center gap-2 text-sm font-semibold text-white'>
          <PinIcon />
          <span>Pinned Messages</span>
        </div>
        <button
          onClick={onClose}
          aria-label='Close pinned messages'
          className='rounded p-1 text-gray-400 hover:bg-white/10 hover:text-gray-200'
        >
          <XIcon />
        </button>
      </div>

      {/* Body */}
      <div className='flex-1 overflow-y-auto p-3'>
        {isLoading && (
          <p className='text-center text-sm text-gray-400'>Loading…</p>
        )}

        {!isLoading && error && (
          <p className='text-center text-sm text-red-400'>{error}</p>
        )}

        {!isLoading && !error && messages.length === 0 && (
          <p className='text-center text-sm text-gray-400'>
            No pinned messages in #{channelName}.
          </p>
        )}

        {!isLoading && !error && messages.length > 0 && (
          <ul className='flex flex-col gap-2'>
            {messages.map(msg => (
              <li key={msg.id}>
                <PinnedMessageItem message={msg} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/components/message/MessageItem.tsx
```

Output:

```text
/**
 * Component: MessageItem
 * Individual message row matching Discord's message style.
 * Supports a full variant (avatar + author + timestamp + content) and a
 * compact variant (no avatar/name) for grouped follow-up messages.
 *
 * ActionBar: appears on hover/focus. Shows Reply (functional) and Add Reaction
 * stub for all users. Shows a "More" (⋯) dropdown with "Pin/Unpin Message" for
 * users with message:pin permission (MODERATOR, ADMIN, OWNER), and "Edit
 * Message" for the message's own author.
 *
 * Replies: messages with a parentMessage show a Discord-style inline reply
 * banner above the content. Clicking the banner scrolls to the parent message.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { formatMessageTimestamp, formatTimeOnly } from '@/lib/utils';
import { pinMessageAction, unpinMessageAction } from '@/app/actions/pinMessage';
import { editMessageAction } from '@/app/actions/editMessage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { Message, Reaction } from '@/types';

// ─── AttachmentList ───────────────────────────────────────────────────────────

function AttachmentList({ attachments }: { attachments: Message['attachments'] }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className='mt-1.5 flex flex-col gap-2'>
      {attachments.map(a => {
        const isImage = a.type?.startsWith('image/');
        if (isImage) {
          return (
            <a
              key={a.id}
              href={a.url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block max-w-sm'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.url} alt={a.filename} className='max-h-64 rounded-md object-contain' />
            </a>
          );
        }
        return (
          <a
            key={a.id}
            href={a.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-blue-400 hover:bg-white/10 hover:text-blue-300 transition-colors w-fit'
          >
            <svg
              className='h-4 w-4 flex-shrink-0'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              aria-hidden='true'
            >
              <path d='M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48' />
            </svg>
            <span className='truncate max-w-xs'>{a.filename}</span>
          </a>
        );
      })}
    </div>
  );
}

// ─── ReactionList ─────────────────────────────────────────────────────────────

function ReactionList({ reactions, messageId }: { reactions: Reaction[]; messageId: string }) {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div className='mt-1 flex flex-wrap gap-1'>
      {reactions.map(r => (
        <button
          key={`${r.emoji}-${messageId}`}
          type='button'
          aria-label={`React with ${r.emoji} (${r.count} ${r.count !== 1 ? 'reactions' : 'reaction'})`}
          className='flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-300 hover:bg-white/10'
        >
          <span>{r.emoji}</span>
          <span>{r.count}</span>
        </button>
      ))}
    </div>
  );
}

// ─── ReplyBanner ──────────────────────────────────────────────────────────────

function ReplyBanner({ parentMessage }: { parentMessage: NonNullable<Message['parentMessage']> }) {
  const handleClick = () => {
    const el = document.querySelector(`[data-message-id="${parentMessage.id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const label = parentMessage.isDeleted
    ? 'Original message deleted'
    : `${parentMessage.author.displayName ?? parentMessage.author.username}: ${parentMessage.content}`;

  return (
    <button
      type='button'
      onClick={handleClick}
      title={label}
      className='mb-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors max-w-full'
      aria-label={`Jump to replied message from ${parentMessage.author.displayName ?? parentMessage.author.username}`}
    >
      <svg className='h-3 w-3 flex-shrink-0 rotate-180' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
        <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
      </svg>
      {parentMessage.isDeleted ? (
        <span className='italic text-gray-500'>Original message deleted</span>
      ) : (
        <>
          <span className='font-medium text-gray-300 flex-shrink-0'>
            {parentMessage.author.displayName ?? parentMessage.author.username}
          </span>
          <span className='min-w-0 truncate'>{parentMessage.content}</span>
        </>
      )}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PinMenuIcon() {
  return (
    <svg
      className='h-3.5 w-3.5 flex-shrink-0'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      aria-hidden='true'
    >
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

// ─── Hover action bar ─────────────────────────────────────────────────────────

type PinState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hover/focus-within action bar for a message.
 * Reply triggers onReplyClick (opens thread for authenticated users).
 * More (⋯) is rendered when canPin or isOwnMessage is true, and opens a
 * dropdown with Pin/Unpin (canPin) and Edit Message (isOwnMessage).
 */
function ActionBar({
  messageId,
  serverId,
  canPin,
  initialPinned,
  isOwnMessage,
  onEditClick,
  onReplyClick,
}: {
  messageId: string;
  serverId?: string;
  canPin?: boolean;
  initialPinned?: boolean;
  isOwnMessage?: boolean;
  onEditClick?: () => void;
  onReplyClick?: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [isPinned, setIsPinned] = useState(initialPinned ?? false);
  const [pinState, setPinState] = useState<PinState>('idle');
  const [pinErrorMsg, setPinErrorMsg] = useState('');
  const moreRef = useRef<HTMLDivElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click; clean up timers on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMoreOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isMoreOpen]);

  const handlePinToggle = useCallback(async () => {
    if (!serverId) return;
    setIsMoreOpen(false);
    setPinState('loading');
    const verb = isPinned ? 'unpin' : 'pin';
    try {
      const result = isPinned
        ? await unpinMessageAction(messageId, serverId)
        : await pinMessageAction(messageId, serverId);
      if (result.ok) {
        setIsPinned(prev => !prev);
        setPinState('success');
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setPinState('idle'), 2000);
      } else {
        const msg = result.forbidden
          ? `You don't have permission to ${verb} messages.`
          : `Failed to ${verb} message. Please try again.`;
        setPinErrorMsg(msg);
        setPinState('error');
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => {
          setPinState('idle');
          setPinErrorMsg('');
        }, 3000);
      }
    } catch {
      const msg = `Failed to ${verb} message. Please try again.`;
      setPinErrorMsg(msg);
      setPinState('error');
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setPinState('idle');
        setPinErrorMsg('');
      }, 3000);
    }
  }, [isPinned, messageId, serverId]);

  return (
    <div className='absolute -top-3 right-4 z-10 flex items-center rounded-md border border-white/10 bg-[#2f3136] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'>
      {/* Inline pin feedback */}
      {pinState === 'success' && (
        <span className='px-2 text-xs text-green-400'>{isPinned ? '📌 Pinned' : 'Unpinned'}</span>
      )}
      {pinState === 'error' && <span className='px-2 text-xs text-red-400'>{pinErrorMsg}</span>}

      {/* Reply — redirects guests to login; opens thread for authenticated users */}
      <button
        type='button'
        aria-label='Reply'
        title='Reply'
        onClick={
          !isAuthenticated
            ? () => router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
            : onReplyClick
        }
        className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
      >
        <svg
          className='h-4 w-4'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
          focusable='false'
        >
          <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
        </svg>
      </button>

      {/* Add Reaction — redirects guests to login; stub for authenticated users */}
      <button
        type='button'
        aria-label='Add Reaction'
        title='Add Reaction'
        onClick={
          !isAuthenticated
            ? () => router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
            : undefined
        }
        className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
      >
        <svg
          className='h-4 w-4'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
          focusable='false'
        >
          <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-3.5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.476 2.37a.75.75 0 0 0-1.06-1.06 4.5 4.5 0 0 1-6.832 0 .75.75 0 0 0-1.061 1.06 6 6 0 0 0 8.953 0z' />
        </svg>
      </button>

      {/* More — rendered when user can pin or is the message author */}
      {(canPin || isOwnMessage) && (
        <div ref={moreRef} className='relative'>
          <button
            type='button'
            aria-label='More actions'
            title='More'
            ref={moreTriggerRef}
            aria-expanded={isMoreOpen}
            onClick={() => {
              if (!isMoreOpen && moreTriggerRef.current) {
                const rect = moreTriggerRef.current.getBoundingClientRect();
                setOpenUpward(window.innerHeight - rect.bottom < 180);
              }
              setIsMoreOpen(v => !v);
            }}
            className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
          >
            <svg
              className='h-4 w-4'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
              focusable='false'
            >
              <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
            </svg>
          </button>

          {isMoreOpen && (
            <div className={`absolute right-0 min-w-[160px] rounded-md border border-white/10 bg-[#18191c] py-1 shadow-xl z-20 ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
              {isOwnMessage && (
                <button
                  type='button'
                  onClick={() => {
                    setIsMoreOpen(false);
                    onEditClick?.();
                  }}
                  className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white transition-colors'
                >
                  <svg
                    className='h-3.5 w-3.5 flex-shrink-0'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    aria-hidden='true'
                  >
                    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                    <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                  </svg>
                  Edit Message
                </button>
              )}
              {canPin && (
                <button
                  type='button'
                  onClick={handlePinToggle}
                  disabled={pinState === 'loading'}
                  className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white disabled:opacity-50 transition-colors'
                >
                  <PinMenuIcon />
                  {isPinned ? 'Unpin Message' : 'Pin Message'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MessageItem ──────────────────────────────────────────────────────────────

export function MessageItem({
  message,
  showHeader = true,
  canPin,
  serverId,
  onReplyClick,
}: {
  message: Message;
  /** Set to false for grouped follow-up messages from the same author. Hides the avatar and author line. */
  showHeader?: boolean;
  /** When true, shows the pin/unpin option in the action bar. Grant to MODERATOR+. */
  canPin?: boolean;
  /** Required for pin actions. Passed alongside canPin. */
  serverId?: string;
  /** Called when the user clicks Reply on this message. */
  onReplyClick?: (message: Message) => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [avatarError, setAvatarError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);
  const [localContent, setLocalContent] = useState<string | undefined>(undefined);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Render-phase derived-state reset: when the avatar URL changes (including A→B→A),
  // reset avatarError so the new URL is always attempted.
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(message.author.avatarUrl);
  if (prevAvatarUrl !== message.author.avatarUrl) {
    setPrevAvatarUrl(message.author.avatarUrl);
    if (avatarError) setAvatarError(false);
  }

  // Keep editContent in sync when message content changes externally (e.g. via SSE)
  const [prevContent, setPrevContent] = useState(message.content);
  if (!isEditing && prevContent !== message.content) {
    setPrevContent(message.content);
    setEditContent(message.content);
    if (localContent !== undefined) setLocalContent(undefined);
  }

  const isOwnMessage = !!user && user.id === message.author.id;

  const handleEditClick = useCallback(() => {
    const current = localContent ?? message.content;
    setEditContent(current);
    setIsEditing(true);
    setTimeout(() => {
      const el = editTextareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 0);
  }, [localContent, message.content]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditContent(localContent ?? message.content);
  }, [localContent, message.content]);

  const handleEditSave = useCallback(async () => {
    const trimmed = editContent.trim();
    const currentContent = localContent ?? message.content;
    if (!trimmed || trimmed === currentContent || !serverId) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const result = await editMessageAction(message.id, serverId, trimmed);
    setIsSaving(false);
    if (result.ok) {
      setIsEditing(false);
      setLocalContent(result.message.content);
    } else {
      const msg = result.forbidden
        ? "You don't have permission to edit this message."
        : 'Failed to edit message. Please try again.';
      showToast({ message: msg, type: 'error' });
    }
  }, [editContent, localContent, message.content, message.id, serverId, showToast]);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleEditSave();
      } else if (e.key === 'Escape') {
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel],
  );

  // Trim first to guard against empty-string usernames — || catches "" where ?? would not.
  const trimmedUsername = message.author.username?.trim();
  const authorInitial = trimmedUsername?.charAt(0)?.toUpperCase() || '?';

  // TODO: Author name role coloring
  // The Author type embedded in Message does not carry a role field —
  // role lives on the User entity. When real auth/user data is wired up,
  // pass the user's role here and map it to a colour:
  //   owner → #f0b132 (gold), admin → #ed4245 (red),
  //   moderator → #3ba55c (green), member/guest → text-white
  const authorNameClass = 'cursor-pointer font-medium text-white hover:underline';

  const handleReplyClick = useCallback(() => {
    onReplyClick?.(message);
  }, [onReplyClick, message]);

  const actionBar = (
    <ActionBar
      messageId={message.id}
      serverId={serverId}
      canPin={canPin}
      initialPinned={!!message.pinned}
      isOwnMessage={isOwnMessage}
      onEditClick={handleEditClick}
      onReplyClick={handleReplyClick}
    />
  );

  const editUi = (
    <div className='mt-0.5'>
      <textarea
        ref={editTextareaRef}
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
        onKeyDown={handleEditKeyDown}
        disabled={isSaving}
        rows={3}
        className='w-full resize-none rounded-md bg-[#40444b] px-3 py-2 text-sm text-[#dcddde] outline-none focus:ring-1 focus:ring-[#5865f2] disabled:opacity-50'
        aria-label='Edit message'
      />
      <div className='mt-1 flex items-center gap-2 text-xs text-gray-400'>
        <span>
          escape to{' '}
          <button
            type='button'
            onClick={handleEditCancel}
            className='text-[#5865f2] hover:underline'
          >
            cancel
          </button>
          {' · '}enter to{' '}
          <button
            type='button'
            onClick={handleEditSave}
            disabled={isSaving}
            className='text-[#5865f2] hover:underline disabled:opacity-50'
          >
            save
          </button>
        </span>
      </div>
    </div>
  );

  if (!showHeader) {
    return (
      <div
        data-message-id={message.id}
        className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
      >
        {message.parentMessage && <div className='ml-14 pt-1'><ReplyBanner parentMessage={message.parentMessage} /></div>}
        <div className='flex gap-4'>
          {!isEditing && actionBar}
          {/* Spacer aligns content with the 40px avatar of the header row */}
          <div className='w-10 flex-shrink-0 text-right'>
            <span className='invisible text-[10px] text-gray-500 group-hover:visible group-focus-within:visible'>
              {formatTimeOnly(message.timestamp)}
            </span>
          </div>
          <div className='min-w-0 flex-1'>
            {isEditing ? (
              editUi
            ) : (
              <p className='whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
                {localContent ?? message.content}
                {(message.editedAt || localContent !== undefined) && (
                  <span className='ml-1 text-[10px] text-gray-500'>(edited)</span>
                )}
              </p>
            )}
            <AttachmentList attachments={message.attachments} />
            <ReactionList reactions={message.reactions ?? []} messageId={message.id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-message-id={message.id}
      className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
    >
      {message.parentMessage && <div className='ml-14 pt-1'><ReplyBanner parentMessage={message.parentMessage} /></div>}
      <div className='flex gap-4'>
        {!isEditing && actionBar}
        {/* Avatar */}
        <div className='mt-0.5 flex-shrink-0'>
          {message.author.avatarUrl && !avatarError ? (
            <Image
              src={message.author.avatarUrl}
              alt={message.author.username}
              width={40}
              height={40}
              unoptimized
              className='h-10 w-10 rounded-full'
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white'>
              {authorInitial}
            </div>
          )}
        </div>
        {/* Content */}
        <div className='min-w-0 flex-1'>
          <div className='flex items-baseline gap-2'>
            <span className={authorNameClass}>
              {message.author.displayName ?? message.author.username}
            </span>
            <span className='text-[11px] text-gray-400'>
              {formatMessageTimestamp(message.timestamp)}
            </span>
            {(message.editedAt || localContent !== undefined) && (
              <span className='text-[10px] text-gray-500'>(edited)</span>
            )}
          </div>
          {isEditing ? (
            editUi
          ) : (
            <p className='mt-0.5 whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
              {localContent ?? message.content}
            </p>
          )}
          <AttachmentList attachments={message.attachments} />
          <ReactionList reactions={message.reactions ?? []} messageId={message.id} />
        </div>
      </div>
    </div>
  );
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/components/layout/HarmonyShell.tsx
```

Output:

```text
/**
 * Layout: HarmonyShell
 * Full Discord-like 3-column layout shell.
 * Wires together ServerRail, ChannelSidebar, TopBar, MessageList, MembersSidebar, SearchModal.
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { TopBar } from '@/components/channel/TopBar';
import { MembersSidebar } from '@/components/channel/MembersSidebar';
import { SearchModal } from '@/components/channel/SearchModal';
import { PinnedMessagesPanel } from '@/components/channel/PinnedMessagesPanel';
import { ChannelSidebar } from '@/components/channel/ChannelSidebar';
import { MessageInput } from '@/components/channel/MessageInput';
import { MessageList } from '@/components/channel/MessageList';
import { ServerRail } from '@/components/server-rail/ServerRail';
import { GuestPromoBanner } from '@/components/channel/GuestPromoBanner';
import { CreateChannelModal } from '@/components/channel/CreateChannelModal';
import { useAuth } from '@/hooks/useAuth';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { BrowseServersModal } from '@/components/server-rail/BrowseServersModal';
import { useServerEvents } from '@/hooks/useServerEvents';
import { useServerListSync } from '@/hooks/useServerListSync';
import { ChannelType, ChannelVisibility, UserStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { CreateServerModal } from '@/components/server-rail/CreateServerModal';
import type { Server, Channel, Message, User } from '@/types';

// ─── Discord colour tokens ────────────────────────────────────────────────────

const BG = {
  tertiary: 'bg-[#202225]',
  primary: 'bg-[#36393f]',
};

// ─── useSyncExternalStore helpers — module-level so references are stable ─────
// React re-subscribes whenever the subscribe function reference changes. Inline
// arrow functions create a new reference every render, causing the MediaQueryList
// listener to be torn down and re-added on every message receive / state update.

const subscribeToViewport = (cb: () => void) => {
  const mql = window.matchMedia('(min-width: 640px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};
const getViewportSnapshot = () => window.matchMedia('(min-width: 640px)').matches;
const getServerViewportSnapshot = () => false;

// ─── Main Shell ───────────────────────────────────────────────────────────────

export interface HarmonyShellProps {
  servers: Server[];
  currentServer: Server;
  /** Channels belonging to the current server — used by ChannelSidebar */
  channels: Channel[];
  /**
   * All channels across every server — used by ServerRail to derive the
   * correct default channel slug when navigating to another server.
   * #c32: passing only serverChannels here caused other server icons to link
   * to a non-existent route because their channels weren't in the list.
   */
  allChannels: Channel[];
  currentChannel: Channel;
  messages: Message[];
  members: User[];
  /** Base path for navigation links. Use "/c" for public guest routes, "/channels" for authenticated routes. */
  basePath?: string;
  /** Optional replacement for the center chat pane while keeping the shell visible. */
  lockedMessagePane?: React.ReactNode;
}

export function HarmonyShell({
  servers,
  currentServer,
  channels,
  allChannels,
  currentChannel,
  messages,
  members,
  basePath = '/c',
  lockedMessagePane,
}: HarmonyShellProps) {
  const isChannelLocked = lockedMessagePane !== undefined;
  // Track the user's explicit toggle preference; null means "follow viewport default".
  const [membersOverride, setMembersOverride] = useState<boolean | null>(null);

  // useSyncExternalStore: SSR returns false (getServerSnapshot), client returns live viewport.
  // No useEffect setState needed — avoids both hydration mismatch and the linter rule.
  const isDesktopViewport = useSyncExternalStore(
    subscribeToViewport,
    getViewportSnapshot,
    getServerViewportSnapshot,
  );

  const isMembersOpen = membersOverride !== null ? membersOverride : isDesktopViewport;
  const setIsMembersOpen = useCallback((val: boolean) => setMembersOverride(val), []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPinsOpen, setIsPinsOpen] = useState(false);
  // #c25: track mobile channel-sidebar state so aria-expanded on hamburger reflects reality
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Local message state so sent messages appear immediately without a page reload
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  // Track previous channel so we can reset localMessages synchronously on channel
  // switch — avoids a one-render flash where old messages show under the new channel header.
  const [prevChannelId, setPrevChannelId] = useState(currentChannel.id);
  if (prevChannelId !== currentChannel.id) {
    setPrevChannelId(currentChannel.id);
    setLocalMessages(messages);
    setIsMenuOpen(false);
    setIsPinsOpen(false);
    setReplyingTo(null);
    // Only auto-close the members sidebar on mobile so desktop keeps it open by default.
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 640px)').matches) {
      setIsMembersOpen(false);
    }
  }
  // Local channels state so newly created channels appear immediately in the sidebar.
  const [localChannels, setLocalChannels] = useState<Channel[]>(channels);
  // Map of serverId → default channel slug — used by BrowseServersModal for "Open" navigation.
  // Mirrors the same derivation in ServerRail so both always agree on the default channel.
  const defaultChannelByServerId = useMemo(() => {
    const map = new Map<string, string>();
    const textOrAnnouncement = allChannels
      .filter(c => c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT)
      .sort((a, b) => a.position - b.position);
    for (const channel of textOrAnnouncement) {
      if (!map.has(channel.serverId)) map.set(channel.serverId, channel.slug);
    }
    return map;
  }, [allChannels]);

  // Stable list of voice channel IDs for VoiceProvider — recomputed only when channels change.
  const voiceChannelIds = useMemo(
    () => localChannels.filter(c => c.type === ChannelType.VOICE).map(c => c.id),
    [localChannels],
  );
  // Track the channels prop reference so localChannels resets whenever the server
  // passes a fresh array (server navigation or revalidatePath refresh) — same
  // render-time derivation pattern used above for localMessages/prevChannelId.
  const [prevChannelsProp, setPrevChannelsProp] = useState(channels);
  if (prevChannelsProp !== channels) {
    setPrevChannelsProp(channels);
    setLocalChannels(channels);
  }
  // Local members state so join/leave/status events update the sidebar without reload.
  const [localMembers, setLocalMembers] = useState<User[]>(members);
  // Reset when the members prop changes (server navigation or SSR revalidation).
  const [prevMembersProp, setPrevMembersProp] = useState(members);
  if (prevMembersProp !== members) {
    setPrevMembersProp(members);
    setLocalMembers(members);
  }
  // Channel creation modal state.
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [createChannelDefaultType, setCreateChannelDefaultType] = useState<ChannelType>(
    ChannelType.TEXT,
  );

  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    isAdmin: checkIsAdmin,
  } = useAuth();

  const router = useRouter();
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isBrowseServersOpen, setIsBrowseServersOpen] = useState(false);
  const [localServers, setLocalServers] = useState<Server[]>(servers);
  const [prevServers, setPrevServers] = useState<Server[]>(servers);
  if (prevServers !== servers) {
    setPrevServers(servers);
    setLocalServers(servers);
  }

  const { notifyServerCreated, notifyServerJoined } = useServerListSync();

  const currentMemberRecord = useMemo(
    () => localMembers.find(m => m.id === authUser?.id),
    [localMembers, authUser?.id],
  );

  // Fallback for guest/unauthenticated view.
  const currentUser: User = authUser
    ? {
        ...authUser,
        status: currentMemberRecord?.status ?? authUser.status,
        role: currentMemberRecord?.role ?? authUser.role,
      }
    : {
        id: 'guest',
        username: 'Guest',
        displayName: 'Guest',
        status: 'online',
        role: 'guest',
      };

  // Show the pin UI only to users with MODERATOR+ server-scoped role, and never
  // while the channel is locked (pinning would be meaningless/unauthorized anyway).
  // localMembers is populated by toFrontendMember() in serverService.ts, which maps
  // the backend ServerMember.role field (server-scoped) to User.role.
  // System admins bypass membership checks — they are authorized server-side regardless.
  const canPin = useMemo(
    () =>
      isAuthenticated &&
      !isChannelLocked &&
      (authUser?.isSystemAdmin ||
        currentMemberRecord?.role === 'owner' ||
        currentMemberRecord?.role === 'admin' ||
        currentMemberRecord?.role === 'moderator'),
    [isAuthenticated, isChannelLocked, authUser?.isSystemAdmin, currentMemberRecord?.role],
  );

  const handleServerCreated = useCallback(
    (server: Server, defaultChannel: Channel) => {
      setLocalServers(prev => [...prev, server]);
      notifyServerCreated(server.id);
      router.push(`${basePath}/${server.slug}/${defaultChannel.slug}`);
    },
    [basePath, notifyServerCreated, router],
  );

  // notifyServerJoined is a stable reference from useServerListSync — pass directly.
  // Other tabs receive the broadcast and call router.refresh(); the current tab
  // navigates to the new server route which re-renders with the updated servers prop.

  const handleReplyClick = useCallback((message: Message) => {
    setReplyingTo(message);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleMessageSent = useCallback((msg: Message) => {
    // Dedup: the SSE event for the sender's own message can arrive before the tRPC
    // response (Redis pub/sub on the same backend + established SSE connection beats
    // the HTTP round-trip). Without this check, the message would be added twice.
    setLocalMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    setReplyingTo(null);
  }, []);

  // ── Real-time SSE handlers ────────────────────────────────────────────────

  const handleRealTimeCreated = useCallback(
    (msg: Message) => {
      // Filter: server endpoint delivers messages for all channels; only update
      // localMessages for the channel currently in view.
      if (msg.channelId !== currentChannel.id) return;
      // Dedup: skip if the message was already optimistically added (e.g. sent by this client)
      setLocalMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    },
    [currentChannel.id],
  );

  const handleRealTimeEdited = useCallback(
    (msg: Message) => {
      if (msg.channelId !== currentChannel.id) return;
      setLocalMessages(prev => prev.map(m => (m.id === msg.id ? msg : m)));
    },
    [currentChannel.id],
  );

  const handleRealTimeDeleted = useCallback(
    (messageId: string, channelId: string) => {
      if (channelId !== currentChannel.id) return;
      setLocalMessages(prev => prev.filter(m => m.id !== messageId));
    },
    [currentChannel.id],
  );

  const handleServerUpdated = useCallback((updatedServer: Server) => {
    setLocalServers(prev =>
      prev.map(s => (s.id === updatedServer.id ? { ...s, ...updatedServer } : s)),
    );
  }, []);

  // ── Real-time channel list updates ────────────────────────────────────────

  const handleChannelCreated = useCallback((channel: Channel) => {
    setLocalChannels(prev => {
      // Dedup: ignore if already in list (e.g. added optimistically by the creator)
      if (prev.some(c => c.id === channel.id)) return prev;
      // Insert before VOICE channels so text/announcement channels stay grouped
      const insertIdx =
        channel.type === ChannelType.VOICE
          ? prev.length
          : prev.findIndex(c => c.type === ChannelType.VOICE);
      const at = insertIdx === -1 ? prev.length : insertIdx;
      return [...prev.slice(0, at), channel, ...prev.slice(at)];
    });
  }, []);

  const handleChannelUpdated = useCallback((channel: Channel) => {
    setLocalChannels(prev => prev.map(c => (c.id === channel.id ? channel : c)));
  }, []);

  const handleChannelDeleted = useCallback(
    (channelId: string) => {
      setLocalChannels(prev => prev.filter(c => c.id !== channelId));
      // Navigate away if the deleted channel is the one currently viewed
      if (channelId === currentChannel.id) {
        router.push(`${basePath}/${currentServer.slug}`);
      }
    },
    [currentChannel.id, currentServer.slug, basePath, router],
  );

  // ── Real-time member list updates ─────────────────────────────────────────

  const handleMemberJoined = useCallback((user: User) => {
    setLocalMembers(prev => {
      // Dedup: ignore if the user is already in the list
      if (prev.some(m => m.id === user.id)) return prev;
      return [...prev, user];
    });
  }, []);

  const handleMemberLeft = useCallback((userId: string) => {
    setLocalMembers(prev => prev.filter(m => m.id !== userId));
  }, []);

  const handleMemberStatusChanged = useCallback(
    ({ id, status }: { id: string; status: UserStatus }) => {
      setLocalMembers(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
    },
    [],
  );

  const authUserStatusKey = authUser ? `${authUser.id}:${authUser.status}:${authUser.role}` : null;
  const [prevAuthUserStatusKey, setPrevAuthUserStatusKey] = useState(authUserStatusKey);
  if (authUserStatusKey !== prevAuthUserStatusKey) {
    setPrevAuthUserStatusKey(authUserStatusKey);
    if (authUser?.id) {
      setLocalMembers(prev =>
        prev.map(m =>
          m.id === authUser.id ? { ...m, status: authUser.status, role: authUser.role } : m,
        ),
      );
    }
  }

  // ── Real-time visibility changes ──────────────────────────────────────────

  const handleChannelVisibilityChanged = useCallback(
    (channel: Channel, oldVisibility: ChannelVisibility) => {
      // Update the channel's visibility in the sidebar immediately.
      setLocalChannels(prev => prev.map(c => (c.id === channel.id ? channel : c)));

      // If the current user is viewing this channel and it just became PRIVATE,
      // redirect non-admin members to the server root so VisibilityGuard can
      // gate access on re-render. Server owners and admins are not redirected
      // because they retain access to PRIVATE channels.
      // Note: useServerEvents is only enabled for authenticated users, so this
      // callback only fires for authenticated sessions.
      //
      // checkIsAdmin(ownerId) covers the server owner and system admins.
      // We look up the member record for the current user to check their
      // server-scoped role ('owner'/'admin') because checkIsAdmin() with no arg
      // checks AuthContext user.role, which is always 'member' for non-system-admin
      // users (mapBackendUser sets role: 'member' for all non-system-admin users).
      const memberRecord = localMembers.find(m => m.id === authUser?.id);
      const userIsAdminOrOwner =
        checkIsAdmin(currentServer.ownerId) ||
        memberRecord?.role === 'owner' ||
        memberRecord?.role === 'admin';
      if (
        channel.id === currentChannel.id &&
        oldVisibility !== ChannelVisibility.PRIVATE &&
        channel.visibility === ChannelVisibility.PRIVATE &&
        !userIsAdminOrOwner
      ) {
        router.push(`${basePath}/${currentServer.slug}`);
      }
    },
    [
      currentChannel.id,
      checkIsAdmin,
      currentServer.ownerId,
      basePath,
      currentServer.slug,
      router,
      localMembers,
      authUser?.id,
    ],
  );

  useServerEvents({
    serverId: currentServer.id,
    onChannelCreated: handleChannelCreated,
    onChannelUpdated: handleChannelUpdated,
    onChannelDeleted: handleChannelDeleted,
    onMemberJoined: handleMemberJoined,
    onMemberLeft: handleMemberLeft,
    onMemberStatusChanged: handleMemberStatusChanged,
    onChannelVisibilityChanged: handleChannelVisibilityChanged,
    // Message callbacks are disabled when the channel is locked (same guard as the
    // former useChannelEvents call) so locked guests don't accumulate stale state.
    onMessageCreated: isChannelLocked ? undefined : handleRealTimeCreated,
    onMessageEdited: isChannelLocked ? undefined : handleRealTimeEdited,
    onMessageDeleted: isChannelLocked ? undefined : handleRealTimeDeleted,
    onServerUpdated: handleServerUpdated,
    enabled: isAuthenticated,
  });

  // #c10/#c23: single global Ctrl+K / Cmd+K handler — SearchModal no longer needs its own
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isChannelLocked) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(v => !v);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isChannelLocked]);

  return (
    <VoiceProvider serverId={currentServer.id} voiceChannelIds={voiceChannelIds}>
      <div className='flex h-screen overflow-hidden bg-[#202225] font-sans'>
        {/* Skip-to-content: visually hidden, appears on keyboard focus (WCAG 2.4.1) */}
        <a
          href='#main-content'
          className='sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:m-2 focus-visible:rounded focus-visible:bg-[#5865f2] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline-none'
        >
          Skip to content
        </a>

        {/* 1. Server rail — uses allChannels (full set) to derive default slug per server */}
        <ServerRail
          servers={localServers}
          allChannels={allChannels}
          currentServerId={currentServer.id}
          basePath={basePath}
          isMobileVisible={isMenuOpen}
          onBrowseServers={() => setIsBrowseServersOpen(true)}
          onAddServer={
            isAuthLoading
              ? undefined
              : () => {
                  if (!isAuthenticated) {
                    router.push('/auth/login');
                    return;
                  }
                  setIsCreateServerOpen(true);
                }
          }
        />

        {/* 2. Channel sidebar — mobile overlay when isMenuOpen, always visible on desktop */}
        <ChannelSidebar
          server={currentServer}
          channels={localChannels}
          currentChannelId={currentChannel.id}
          currentUser={currentUser}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          basePath={basePath}
          isAuthenticated={isAuthenticated}
          serverId={currentServer.id}
          members={members}
          onCreateChannel={defaultType => {
            setCreateChannelDefaultType(defaultType);
            setIsCreateChannelOpen(true);
          }}
        />

        {/* 3. Main column */}
        <main
          id='main-content'
          className='flex flex-1 flex-col overflow-hidden'
          aria-label={`${currentChannel.name} channel`}
          tabIndex={-1}
        >
          <TopBar
            channel={currentChannel}
            serverSlug={currentServer.slug}
            isAdmin={checkIsAdmin(currentServer.ownerId)}
            isMembersOpen={isMembersOpen}
            onMembersToggle={() => setIsMembersOpen(!isMembersOpen)}
            onSearchOpen={isChannelLocked ? undefined : () => setIsSearchOpen(true)}
            onPinsOpen={isChannelLocked ? undefined : () => setIsPinsOpen(true)}
            disableMessageActions={isChannelLocked}
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(v => !v)}
          />

          <div className='flex flex-1 overflow-hidden'>
            <div className={cn('flex flex-1 flex-col overflow-hidden', BG.primary)}>
              {lockedMessagePane ? (
                lockedMessagePane
              ) : (
                <>
                  <MessageList
                    key={currentChannel.id}
                    channel={currentChannel}
                    messages={localMessages}
                    serverId={currentServer.id}
                    canPin={canPin}
                    onReplyClick={handleReplyClick}
                  />
                  <MessageInput
                    channelId={currentChannel.id}
                    channelName={currentChannel.name}
                    serverId={currentServer.id}
                    isReadOnly={currentUser.role === 'guest'}
                    onMessageSent={handleMessageSent}
                    replyingTo={replyingTo}
                    onCancelReply={handleCancelReply}
                  />
                  {!isAuthLoading && !isAuthenticated && (
                    <GuestPromoBanner
                      serverName={currentServer.name}
                      memberCount={currentServer.memberCount ?? members.length}
                    />
                  )}
                </>
              )}
            </div>
            {!isChannelLocked && (
              <PinnedMessagesPanel
                channelId={currentChannel.id}
                serverId={currentServer.id}
                channelName={currentChannel.name}
                isOpen={isPinsOpen}
                onClose={() => setIsPinsOpen(false)}
              />
            )}
            <MembersSidebar
              members={localMembers}
              isOpen={isMembersOpen}
              onClose={() => setIsMembersOpen(false)}
            />
          </div>
        </main>

        <CreateServerModal
          isOpen={isCreateServerOpen}
          onClose={() => setIsCreateServerOpen(false)}
          onCreated={handleServerCreated}
        />

        <BrowseServersModal
          isOpen={isBrowseServersOpen}
          onClose={() => setIsBrowseServersOpen(false)}
          joinedServerIds={new Set(localServers.map(s => s.id))}
          defaultChannelByServerId={defaultChannelByServerId}
          basePath={basePath}
          onJoined={notifyServerJoined}
        />

        {!isChannelLocked && (
          <SearchModal
            messages={localMessages}
            channelName={currentChannel.name}
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}

        {isCreateChannelOpen && (
          <CreateChannelModal
            serverId={currentServer.id}
            serverSlug={currentServer.slug}
            existingChannels={localChannels}
            defaultType={createChannelDefaultType}
            onCreated={newChannel =>
              setLocalChannels(prev => {
                // Insert before voice channels so text/announcement channels stay grouped correctly.
                const insertIdx =
                  newChannel.type === ChannelType.VOICE
                    ? prev.length
                    : prev.findIndex(c => c.type === ChannelType.VOICE);
                const at = insertIdx === -1 ? prev.length : insertIdx;
                return [...prev.slice(0, at), newChannel, ...prev.slice(at)];
              })
            }
            onClose={() => setIsCreateChannelOpen(false)}
          />
        )}
      </div>
    </VoiceProvider>
  );
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/components/channel/MessageList.tsx
```

Output:

```text
/**
 * Channel Component: MessageList
 * Scrollable, chronological message feed with author grouping, date separators,
 * a welcome header, and smart auto-scroll.
 * Based on dev spec C1.3 MessageListComponent
 */

'use client';

import { useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { MessageItem } from '@/components/message/MessageItem';
import { formatDate } from '@/lib/utils';
import { ChannelVisibility } from '@/types';
import type { Channel, Message } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type MessageGroup = { messages: Message[]; dateLabel: string };

/**
 * Groups consecutive messages by author (within a 5-minute window) and
 * annotates each group with a date label for use by DateSeparator.
 * #c31: guards against NaN timestamps so grouping never silently breaks.
 */
function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prev = messages[i - 1];
    const sameAuthor = prev && prev.author.id === msg.author.id;
    const msgTime = new Date(msg.timestamp).getTime();
    const prevTime = prev ? new Date(prev.timestamp).getTime() : NaN;
    const withinTime =
      prev && !isNaN(msgTime) && !isNaN(prevTime) && msgTime - prevTime < 5 * 60 * 1000;
    // Do not group messages across midnight — date separators rely on group boundaries
    const sameDay =
      prev &&
      !isNaN(msgTime) &&
      !isNaN(prevTime) &&
      new Date(msgTime).toDateString() === new Date(prevTime).toDateString();

    const dateLabel = isNaN(msgTime) ? '' : formatDate(new Date(msgTime));

    if (sameAuthor && withinTime && sameDay) {
      groups[groups.length - 1].messages.push(msg);
    } else {
      groups.push({ messages: [msg], dateLabel });
    }
  }

  return groups;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateSeparator({ label }: { label: string }) {
  return (
    <div className='flex items-center gap-4 px-4 py-2'>
      <hr className='flex-1 border-[#40444b]' />
      <span className='text-xs font-medium text-gray-400'>{label}</span>
      <hr className='flex-1 border-[#40444b]' />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MessageListProps {
  channel: Channel;
  messages: Message[];
  /** Server ID passed to MessageItem for pin/unpin actions. */
  serverId?: string;
  /** When true, shows the pin/unpin option on message hover. Grant to MODERATOR+. */
  canPin?: boolean;
  /** Called when the user clicks Reply on a message. */
  onReplyClick?: (message: Message) => void;
}

export function MessageList({ channel, messages, serverId, canPin, onReplyClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // #c7: only auto-scroll when user is already near the bottom
  const isNearBottomRef = useRef(true);
  // Track whether the initial mount scroll has happened so we jump instantly
  // to the bottom on load rather than smoothly scrolling from the top.
  const hasMountedRef = useRef(false);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom <= 100;
  }, []);

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      // Initial load: jump instantly so the user starts at the bottom
      hasMountedRef.current = true;
      const el = scrollContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    } else if (isNearBottomRef.current) {
      // New message while already near bottom: smooth scroll
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const groups = useMemo(() => groupMessages(messages), [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className='flex-1 overflow-y-auto py-4'
      onScroll={handleScroll}
      role='log'
      aria-label={`Messages in #${channel.name}`}
      aria-live='polite'
      aria-relevant='additions'
    >
      {/* Channel welcome header */}
      <div className='px-4 pb-4'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#40444b]'>
          <svg
            className='h-8 w-8 text-white'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.871 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41001 9L8.35001 15H14.35L15.41 9H9.41001Z' />
          </svg>
        </div>
        <h2 className='mt-2 text-3xl font-bold text-white'>Welcome to #{channel.name}!</h2>
        {channel.topic && <p className='mt-1 text-sm text-gray-400'>{channel.topic}</p>}
        <div className='mt-1 text-xs text-gray-500'>
          {channel.visibility === ChannelVisibility.PUBLIC_INDEXABLE &&
            '🌐 Public · Indexed by search engines'}
          {channel.visibility === ChannelVisibility.PUBLIC_NO_INDEX && '👁 Public · Not indexed'}
          {channel.visibility === ChannelVisibility.PRIVATE && '🔒 Private channel'}
        </div>
      </div>

      {/* Message groups with date separators */}
      <div className='space-y-4'>
        {groups.map((group, gi) => {
          const prevGroup = groups[gi - 1];
          const showDateSeparator =
            gi > 0 && prevGroup && group.dateLabel && prevGroup.dateLabel !== group.dateLabel;
          return (
            <div key={group.messages[0]?.id || gi}>
              {showDateSeparator && <DateSeparator label={group.dateLabel} />}
              {group.messages.map((msg, mi) => (
                <MessageItem key={msg.id} message={msg} showHeader={mi === 0} serverId={serverId} canPin={canPin} onReplyClick={onReplyClick} />
              ))}
            </div>
          );
        })}
      </div>

      {messages.length === 0 && (
        <p className='px-4 text-sm text-gray-500'>No messages yet. Start the conversation!</p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:18:44.095Z

I’ve isolated the root cause: the pins panel only fetches on open, so it never refetches when pin state changes. I’m now wiring a pin-change callback from `MessageItem` up to `HarmonyShell`, where I’ll both close the panel on pin click and trigger a panel refresh token so it updates immediately.

#### Tool: exec_command

```sh
rtk grep -n "interface Message|type Message" harmony-frontend/src/types/message.ts && rtk read harmony-frontend/src/types/message.ts
```

Output:

```text
2 matches in 1F:

[file] harmony-frontend/src/types/message.ts (2):
    12: export interface Message {
    67: export interface MessageDTO {

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
  /** Snapshot of the parent message for inline reply preview. Null for top-level messages. */
  parentMessage?: {
    id: string;
    content: string;
    isDeleted: boolean;
    author: Author;
  } | null;
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
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/types/index.ts
```

Output:

```text
/**
 * Barrel export for all shared TypeScript types
 */

export * from './server';
export * from './channel';
export * from './message';
export * from './user';
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:18:46.762Z

I’m applying focused edits in four frontend files: add a pin-toggle callback path, close the pins panel on pin click, and add a refresh trigger so the pinned list refetches immediately after pin/unpin events.

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:19:19.143Z

One patch hunk missed due to context drift in `HarmonyShell.tsx`; I’m reopening that file at the relevant sections and applying a precise patch.

#### Tool: exec_command

```sh
rtk grep -n "isPinsOpen|handleReplyClick|handleRealTimeEdited|PinnedMessagesPanel|MessageList" harmony-frontend/src/components/layout/HarmonyShell.tsx && rtk read harmony-frontend/src/components/layout/HarmonyShell.tsx
```

Output:

```text
11 matches in 3F:

[file] 230 (1):
     0: Message) => {

[file] 403 (1):
     0: isChannelLocked ? undefined : handleRealTimeEdited,

[file] harmony-frontend/.../layout/HarmonyShell.tsx (9):
     4: * Wires together ServerRail, ChannelSidebar, TopBar, MessageList, MembersSide...
    14: import { PinnedMessagesPanel } from '@/components/channel/PinnedMessagesPanel';
    17: import { MessageList } from '@/components/channel/MessageList';
   100: const [isPinsOpen, setIsPinsOpen] = useState(false);
   259: const handleRealTimeEdited = useCallback(
   498: <MessageList
   504: onReplyClick={handleReplyClick}
   525: <PinnedMessagesPanel
   529: isOpen={isPinsOpen}

/**
 * Layout: HarmonyShell
 * Full Discord-like 3-column layout shell.
 * Wires together ServerRail, ChannelSidebar, TopBar, MessageList, MembersSidebar, SearchModal.
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { TopBar } from '@/components/channel/TopBar';
import { MembersSidebar } from '@/components/channel/MembersSidebar';
import { SearchModal } from '@/components/channel/SearchModal';
import { PinnedMessagesPanel } from '@/components/channel/PinnedMessagesPanel';
import { ChannelSidebar } from '@/components/channel/ChannelSidebar';
import { MessageInput } from '@/components/channel/MessageInput';
import { MessageList } from '@/components/channel/MessageList';
import { ServerRail } from '@/components/server-rail/ServerRail';
import { GuestPromoBanner } from '@/components/channel/GuestPromoBanner';
import { CreateChannelModal } from '@/components/channel/CreateChannelModal';
import { useAuth } from '@/hooks/useAuth';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { BrowseServersModal } from '@/components/server-rail/BrowseServersModal';
import { useServerEvents } from '@/hooks/useServerEvents';
import { useServerListSync } from '@/hooks/useServerListSync';
import { ChannelType, ChannelVisibility, UserStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { CreateServerModal } from '@/components/server-rail/CreateServerModal';
import type { Server, Channel, Message, User } from '@/types';

// ─── Discord colour tokens ────────────────────────────────────────────────────

const BG = {
  tertiary: 'bg-[#202225]',
  primary: 'bg-[#36393f]',
};

// ─── useSyncExternalStore helpers — module-level so references are stable ─────
// React re-subscribes whenever the subscribe function reference changes. Inline
// arrow functions create a new reference every render, causing the MediaQueryList
// listener to be torn down and re-added on every message receive / state update.

const subscribeToViewport = (cb: () => void) => {
  const mql = window.matchMedia('(min-width: 640px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};
const getViewportSnapshot = () => window.matchMedia('(min-width: 640px)').matches;
const getServerViewportSnapshot = () => false;

// ─── Main Shell ───────────────────────────────────────────────────────────────

export interface HarmonyShellProps {
  servers: Server[];
  currentServer: Server;
  /** Channels belonging to the current server — used by ChannelSidebar */
  channels: Channel[];
  /**
   * All channels across every server — used by ServerRail to derive the
   * correct default channel slug when navigating to another server.
   * #c32: passing only serverChannels here caused other server icons to link
   * to a non-existent route because their channels weren't in the list.
   */
  allChannels: Channel[];
  currentChannel: Channel;
  messages: Message[];
  members: User[];
  /** Base path for navigation links. Use "/c" for public guest routes, "/channels" for authenticated routes. */
  basePath?: string;
  /** Optional replacement for the center chat pane while keeping the shell visible. */
  lockedMessagePane?: React.ReactNode;
}

export function HarmonyShell({
  servers,
  currentServer,
  channels,
  allChannels,
  currentChannel,
  messages,
  members,
  basePath = '/c',
  lockedMessagePane,
}: HarmonyShellProps) {
  const isChannelLocked = lockedMessagePane !== undefined;
  // Track the user's explicit toggle preference; null means "follow viewport default".
  const [membersOverride, setMembersOverride] = useState<boolean | null>(null);

  // useSyncExternalStore: SSR returns false (getServerSnapshot), client returns live viewport.
  // No useEffect setState needed — avoids both hydration mismatch and the linter rule.
  const isDesktopViewport = useSyncExternalStore(
    subscribeToViewport,
    getViewportSnapshot,
    getServerViewportSnapshot,
  );

  const isMembersOpen = membersOverride !== null ? membersOverride : isDesktopViewport;
  const setIsMembersOpen = useCallback((val: boolean) => setMembersOverride(val), []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPinsOpen, setIsPinsOpen] = useState(false);
  // #c25: track mobile channel-sidebar state so aria-expanded on hamburger reflects reality
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Local message state so sent messages appear immediately without a page reload
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  // Track previous channel so we can reset localMessages synchronously on channel
  // switch — avoids a one-render flash where old messages show under the new channel header.
  const [prevChannelId, setPrevChannelId] = useState(currentChannel.id);
  if (prevChannelId !== currentChannel.id) {
    setPrevChannelId(currentChannel.id);
    setLocalMessages(messages);
    setIsMenuOpen(false);
    setIsPinsOpen(false);
    setReplyingTo(null);
    // Only auto-close the members sidebar on mobile so desktop keeps it open by default.
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 640px)').matches) {
      setIsMembersOpen(false);
    }
  }
  // Local channels state so newly created channels appear immediately in the sidebar.
  const [localChannels, setLocalChannels] = useState<Channel[]>(channels);
  // Map of serverId → default channel slug — used by BrowseServersModal for "Open" navigation.
  // Mirrors the same derivation in ServerRail so both always agree on the default channel.
  const defaultChannelByServerId = useMemo(() => {
    const map = new Map<string, string>();
    const textOrAnnouncement = allChannels
      .filter(c => c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT)
      .sort((a, b) => a.position - b.position);
    for (const channel of textOrAnnouncement) {
      if (!map.has(channel.serverId)) map.set(channel.serverId, channel.slug);
    }
    return map;
  }, [allChannels]);

  // Stable list of voice channel IDs for VoiceProvider — recomputed only when channels change.
  const voiceChannelIds = useMemo(
    () => localChannels.filter(c => c.type === ChannelType.VOICE).map(c => c.id),
    [localChannels],
  );
  // Track the channels prop reference so localChannels resets whenever the server
  // passes a fresh array (server navigation or revalidatePath refresh) — same
  // render-time derivation pattern used above for localMessages/prevChannelId.
  const [prevChannelsProp, setPrevChannelsProp] = useState(channels);
  if (prevChannelsProp !== channels) {
    setPrevChannelsProp(channels);
    setLocalChannels(channels);
  }
  // Local members state so join/leave/status events update the sidebar without reload.
  const [localMembers, setLocalMembers] = useState<User[]>(members);
  // Reset when the members prop changes (server navigation or SSR revalidation).
  const [prevMembersProp, setPrevMembersProp] = useState(members);
  if (prevMembersProp !== members) {
    setPrevMembersProp(members);
    setLocalMembers(members);
  }
  // Channel creation modal state.
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [createChannelDefaultType, setCreateChannelDefaultType] = useState<ChannelType>(
    ChannelType.TEXT,
  );

  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    isAdmin: checkIsAdmin,
  } = useAuth();

  const router = useRouter();
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isBrowseServersOpen, setIsBrowseServersOpen] = useState(false);
  const [localServers, setLocalServers] = useState<Server[]>(servers);
  const [prevServers, setPrevServers] = useState<Server[]>(servers);
  if (prevServers !== servers) {
    setPrevServers(servers);
    setLocalServers(servers);
  }

  const { notifyServerCreated, notifyServerJoined } = useServerListSync();

  const currentMemberRecord = useMemo(
    () => localMembers.find(m => m.id === authUser?.id),
    [localMembers, authUser?.id],
  );

  // Fallback for guest/unauthenticated view.
  const currentUser: User = authUser
    ? {
        ...authUser,
        status: currentMemberRecord?.status ?? authUser.status,
        role: currentMemberRecord?.role ?? authUser.role,
      }
    : {
        id: 'guest',
        username: 'Guest',
        displayName: 'Guest',
        status: 'online',
        role: 'guest',
      };

  // Show the pin UI only to users with MODERATOR+ server-scoped role, and never
  // while the channel is locked (pinning would be meaningless/unauthorized anyway).
  // localMembers is populated by toFrontendMember() in serverService.ts, which maps
  // the backend ServerMember.role field (server-scoped) to User.role.
  // System admins bypass membership checks — they are authorized server-side regardless.
  const canPin = useMemo(
    () =>
      isAuthenticated &&
      !isChannelLocked &&
      (authUser?.isSystemAdmin ||
        currentMemberRecord?.role === 'owner' ||
        currentMemberRecord?.role === 'admin' ||
        currentMemberRecord?.role === 'moderator'),
    [isAuthenticated, isChannelLocked, authUser?.isSystemAdmin, currentMemberRecord?.role],
  );

  const handleServerCreated = useCallback(
    (server: Server, defaultChannel: Channel) => {
      setLocalServers(prev => [...prev, server]);
      notifyServerCreated(server.id);
      router.push(`${basePath}/${server.slug}/${defaultChannel.slug}`);
    },
    [basePath, notifyServerCreated, router],
  );

  // notifyServerJoined is a stable reference from useServerListSync — pass directly.
  // Other tabs receive the broadcast and call router.refresh(); the current tab
  // navigates to the new server route which re-renders with the updated servers prop.

  const handleReplyClick = useCallback((message: Message) => {
    setReplyingTo(message);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleMessageSent = useCallback((msg: Message) => {
    // Dedup: the SSE event for the sender's own message can arrive before the tRPC
    // response (Redis pub/sub on the same backend + established SSE connection beats
    // the HTTP round-trip). Without this check, the message would be added twice.
    setLocalMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    setReplyingTo(null);
  }, []);

  // ── Real-time SSE handlers ────────────────────────────────────────────────

  const handleRealTimeCreated = useCallback(
    (msg: Message) => {
      // Filter: server endpoint delivers messages for all channels; only update
      // localMessages for the channel currently in view.
      if (msg.channelId !== currentChannel.id) return;
      // Dedup: skip if the message was already optimistically added (e.g. sent by this client)
      setLocalMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    },
    [currentChannel.id],
  );

  const handleRealTimeEdited = useCallback(
    (msg: Message) => {
      if (msg.channelId !== currentChannel.id) return;
      setLocalMessages(prev => prev.map(m => (m.id === msg.id ? msg : m)));
    },
    [currentChannel.id],
  );

  const handleRealTimeDeleted = useCallback(
    (messageId: string, channelId: string) => {
      if (channelId !== currentChannel.id) return;
      setLocalMessages(prev => prev.filter(m => m.id !== messageId));
    },
    [currentChannel.id],
  );

  const handleServerUpdated = useCallback((updatedServer: Server) => {
    setLocalServers(prev =>
      prev.map(s => (s.id === updatedServer.id ? { ...s, ...updatedServer } : s)),
    );
  }, []);

  // ── Real-time channel list updates ────────────────────────────────────────

  const handleChannelCreated = useCallback((channel: Channel) => {
    setLocalChannels(prev => {
      // Dedup: ignore if already in list (e.g. added optimistically by the creator)
      if (prev.some(c => c.id === channel.id)) return prev;
      // Insert before VOICE channels so text/announcement channels stay grouped
      const insertIdx =
        channel.type === ChannelType.VOICE
          ? prev.length
          : prev.findIndex(c => c.type === ChannelType.VOICE);
      const at = insertIdx === -1 ? prev.length : insertIdx;
      return [...prev.slice(0, at), channel, ...prev.slice(at)];
    });
  }, []);

  const handleChannelUpdated = useCallback((channel: Channel) => {
    setLocalChannels(prev => prev.map(c => (c.id === channel.id ? channel : c)));
  }, []);

  const handleChannelDeleted = useCallback(
    (channelId: string) => {
      setLocalChannels(prev => prev.filter(c => c.id !== channelId));
      // Navigate away if the deleted channel is the one currently viewed
      if (channelId === currentChannel.id) {
        router.push(`${basePath}/${currentServer.slug}`);
      }
    },
    [currentChannel.id, currentServer.slug, basePath, router],
  );

  // ── Real-time member list updates ─────────────────────────────────────────

  const handleMemberJoined = useCallback((user: User) => {
    setLocalMembers(prev => {
      // Dedup: ignore if the user is already in the list
      if (prev.some(m => m.id === user.id)) return prev;
      return [...prev, user];
    });
  }, []);

  const handleMemberLeft = useCallback((userId: string) => {
    setLocalMembers(prev => prev.filter(m => m.id !== userId));
  }, []);

  const handleMemberStatusChanged = useCallback(
    ({ id, status }: { id: string; status: UserStatus }) => {
      setLocalMembers(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
    },
    [],
  );

  const authUserStatusKey = authUser ? `${authUser.id}:${authUser.status}:${authUser.role}` : null;
  const [prevAuthUserStatusKey, setPrevAuthUserStatusKey] = useState(authUserStatusKey);
  if (authUserStatusKey !== prevAuthUserStatusKey) {
    setPrevAuthUserStatusKey(authUserStatusKey);
    if (authUser?.id) {
      setLocalMembers(prev =>
        prev.map(m =>
          m.id === authUser.id ? { ...m, status: authUser.status, role: authUser.role } : m,
        ),
      );
    }
  }

  // ── Real-time visibility changes ──────────────────────────────────────────

  const handleChannelVisibilityChanged = useCallback(
    (channel: Channel, oldVisibility: ChannelVisibility) => {
      // Update the channel's visibility in the sidebar immediately.
      setLocalChannels(prev => prev.map(c => (c.id === channel.id ? channel : c)));

      // If the current user is viewing this channel and it just became PRIVATE,
      // redirect non-admin members to the server root so VisibilityGuard can
      // gate access on re-render. Server owners and admins are not redirected
      // because they retain access to PRIVATE channels.
      // Note: useServerEvents is only enabled for authenticated users, so this
      // callback only fires for authenticated sessions.
      //
      // checkIsAdmin(ownerId) covers the server owner and system admins.
      // We look up the member record for the current user to check their
      // server-scoped role ('owner'/'admin') because checkIsAdmin() with no arg
      // checks AuthContext user.role, which is always 'member' for non-system-admin
      // users (mapBackendUser sets role: 'member' for all non-system-admin users).
      const memberRecord = localMembers.find(m => m.id === authUser?.id);
      const userIsAdminOrOwner =
        checkIsAdmin(currentServer.ownerId) ||
        memberRecord?.role === 'owner' ||
        memberRecord?.role === 'admin';
      if (
        channel.id === currentChannel.id &&
        oldVisibility !== ChannelVisibility.PRIVATE &&
        channel.visibility === ChannelVisibility.PRIVATE &&
        !userIsAdminOrOwner
      ) {
        router.push(`${basePath}/${currentServer.slug}`);
      }
    },
    [
      currentChannel.id,
      checkIsAdmin,
      currentServer.ownerId,
      basePath,
      currentServer.slug,
      router,
      localMembers,
      authUser?.id,
    ],
  );

  useServerEvents({
    serverId: currentServer.id,
    onChannelCreated: handleChannelCreated,
    onChannelUpdated: handleChannelUpdated,
    onChannelDeleted: handleChannelDeleted,
    onMemberJoined: handleMemberJoined,
    onMemberLeft: handleMemberLeft,
    onMemberStatusChanged: handleMemberStatusChanged,
    onChannelVisibilityChanged: handleChannelVisibilityChanged,
    // Message callbacks are disabled when the channel is locked (same guard as the
    // former useChannelEvents call) so locked guests don't accumulate stale state.
    onMessageCreated: isChannelLocked ? undefined : handleRealTimeCreated,
    onMessageEdited: isChannelLocked ? undefined : handleRealTimeEdited,
    onMessageDeleted: isChannelLocked ? undefined : handleRealTimeDeleted,
    onServerUpdated: handleServerUpdated,
    enabled: isAuthenticated,
  });

  // #c10/#c23: single global Ctrl+K / Cmd+K handler — SearchModal no longer needs its own
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isChannelLocked) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(v => !v);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isChannelLocked]);

  return (
    <VoiceProvider serverId={currentServer.id} voiceChannelIds={voiceChannelIds}>
      <div className='flex h-screen overflow-hidden bg-[#202225] font-sans'>
        {/* Skip-to-content: visually hidden, appears on keyboard focus (WCAG 2.4.1) */}
        <a
          href='#main-content'
          className='sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:m-2 focus-visible:rounded focus-visible:bg-[#5865f2] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline-none'
        >
          Skip to content
        </a>

        {/* 1. Server rail — uses allChannels (full set) to derive default slug per server */}
        <ServerRail
          servers={localServers}
          allChannels={allChannels}
          currentServerId={currentServer.id}
          basePath={basePath}
          isMobileVisible={isMenuOpen}
          onBrowseServers={() => setIsBrowseServersOpen(true)}
          onAddServer={
            isAuthLoading
              ? undefined
              : () => {
                  if (!isAuthenticated) {
                    router.push('/auth/login');
                    return;
                  }
                  setIsCreateServerOpen(true);
                }
          }
        />

        {/* 2. Channel sidebar — mobile overlay when isMenuOpen, always visible on desktop */}
        <ChannelSidebar
          server={currentServer}
          channels={localChannels}
          currentChannelId={currentChannel.id}
          currentUser={currentUser}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          basePath={basePath}
          isAuthenticated={isAuthenticated}
          serverId={currentServer.id}
          members={members}
          onCreateChannel={defaultType => {
            setCreateChannelDefaultType(defaultType);
            setIsCreateChannelOpen(true);
          }}
        />

        {/* 3. Main column */}
        <main
          id='main-content'
          className='flex flex-1 flex-col overflow-hidden'
          aria-label={`${currentChannel.name} channel`}
          tabIndex={-1}
        >
          <TopBar
            channel={currentChannel}
            serverSlug={currentServer.slug}
            isAdmin={checkIsAdmin(currentServer.ownerId)}
            isMembersOpen={isMembersOpen}
            onMembersToggle={() => setIsMembersOpen(!isMembersOpen)}
            onSearchOpen={isChannelLocked ? undefined : () => setIsSearchOpen(true)}
            onPinsOpen={isChannelLocked ? undefined : () => setIsPinsOpen(true)}
            disableMessageActions={isChannelLocked}
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(v => !v)}
          />

          <div className='flex flex-1 overflow-hidden'>
            <div className={cn('flex flex-1 flex-col overflow-hidden', BG.primary)}>
              {lockedMessagePane ? (
                lockedMessagePane
              ) : (
                <>
                  <MessageList
                    key={currentChannel.id}
                    channel={currentChannel}
                    messages={localMessages}
                    serverId={currentServer.id}
                    canPin={canPin}
                    onReplyClick={handleReplyClick}
                  />
                  <MessageInput
                    channelId={currentChannel.id}
                    channelName={currentChannel.name}
                    serverId={currentServer.id}
                    isReadOnly={currentUser.role === 'guest'}
                    onMessageSent={handleMessageSent}
                    replyingTo={replyingTo}
                    onCancelReply={handleCancelReply}
                  />
                  {!isAuthLoading && !isAuthenticated && (
                    <GuestPromoBanner
                      serverName={currentServer.name}
                      memberCount={currentServer.memberCount ?? members.length}
                    />
                  )}
                </>
              )}
            </div>
            {!isChannelLocked && (
              <PinnedMessagesPanel
                channelId={currentChannel.id}
                serverId={currentServer.id}
                channelName={currentChannel.name}
                isOpen={isPinsOpen}
                onClose={() => setIsPinsOpen(false)}
              />
            )}
            <MembersSidebar
              members={localMembers}
              isOpen={isMembersOpen}
              onClose={() => setIsMembersOpen(false)}
            />
          </div>
        </main>

        <CreateServerModal
          isOpen={isCreateServerOpen}
          onClose={() => setIsCreateServerOpen(false)}
          onCreated={handleServerCreated}
        />

        <BrowseServersModal
          isOpen={isBrowseServersOpen}
          onClose={() => setIsBrowseServersOpen(false)}
          joinedServerIds={new Set(localServers.map(s => s.id))}
          defaultChannelByServerId={defaultChannelByServerId}
          basePath={basePath}
          onJoined={notifyServerJoined}
        />

        {!isChannelLocked && (
          <SearchModal
            messages={localMessages}
            channelName={currentChannel.name}
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}

        {isCreateChannelOpen && (
          <CreateChannelModal
            serverId={currentServer.id}
            serverSlug={currentServer.slug}
            existingChannels={localChannels}
            defaultType={createChannelDefaultType}
            onCreated={newChannel =>
              setLocalChannels(prev => {
                // Insert before voice channels so text/announcement channels stay grouped correctly.
                const insertIdx =
                  newChannel.type === ChannelType.VOICE
                    ? prev.length
                    : prev.findIndex(c => c.type === ChannelType.VOICE);
                const at = insertIdx === -1 ? prev.length : insertIdx;
                return [...prev.slice(0, at), newChannel, ...prev.slice(at)];
              })
            }
            onClose={() => setIsCreateChannelOpen(false)}
          />
        )}
      </div>
    </VoiceProvider>
  );
}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:19:36.346Z

Code changes are in place. I’m running formatter/typecheck/lint for the frontend package to verify there are no regressions from the new callback wiring.

#### Tool: exec_command

```sh
rtk read harmony-frontend/package.json
```

Output:

```text
{
  "name": "harmony-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:sandbox": "next build --webpack",
    "start": "next start",
    "build:local-e2e": "NEXT_PUBLIC_API_URL=http://localhost:4000 NEXT_PUBLIC_BASE_URL=http://localhost:3000 next build",
    "build:local-e2e:sandbox": "NEXT_PUBLIC_API_URL=http://localhost:4000 NEXT_PUBLIC_BASE_URL=http://localhost:3000 next build --webpack",
    "start:local-e2e": "PORT=3000 NEXT_PUBLIC_API_URL=http://localhost:4000 NEXT_PUBLIC_BASE_URL=http://localhost:3000 next start",
    "test": "jest --forceExit",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "lint": "eslint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "@emoji-mart/data": "^1.2.1",
    "axios": "^1.13.5",
    "clsx": "^2.1.1",
    "emoji-mart": "^5.6.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "tailwind-merge": "^3.4.1",
    "twilio-video": "3.0.0-preview.3"
  },
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@tailwindcss/postcss": "^4",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^30.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "eslint-config-prettier": "^10.1.8",
    "jest": "^30.3.0",
    "jest-environment-jsdom": "^30.3.0",
    "prettier": "^3.8.1",
    "tailwindcss": "^4",
    "ts-jest": "^29.4.6",
    "typescript": "5.9.3"
  }
}
```

#### Tool: exec_command

```sh
rtk git diff --stat
```

Output:

```text
.../src/components/channel/MessageList.tsx          | 21 +++++++++++++++++++--
 .../src/components/channel/PinnedMessagesPanel.tsx  |  4 +++-
 .../src/components/layout/HarmonyShell.tsx          | 21 ++++++++++++++++++++-
 .../src/components/message/MessageItem.tsx          | 12 ++++++++++--
 4 files changed, 52 insertions(+), 6 deletions(-)
```

#### Tool: exec_command

```sh
rtk pnpm --dir harmony-frontend exec prettier --write src/components/channel/PinnedMessagesPanel.tsx src/components/message/MessageItem.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx
```

Output:

```text
[rtk: No such file or directory (os error 2)]
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:19:48.910Z

The `rtk` wrapper isn’t available for `pnpm` execution in this shell, so I’m running the same verification commands directly in `harmony-frontend` now.

#### Tool: exec_command

```sh
pnpm exec prettier --write src/components/channel/PinnedMessagesPanel.tsx src/components/message/MessageItem.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx
```

Output:

```text
zsh:1: command not found: pnpm
```

#### Tool: exec_command

```sh
pnpm exec eslint src/components/channel/PinnedMessagesPanel.tsx src/components/message/MessageItem.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx
```

Output:

```text
zsh:1: command not found: pnpm
```

#### Tool: exec_command

```sh
pnpm exec tsc --noEmit
```

Output:

```text
zsh:1: command not found: pnpm
```

#### Tool: exec_command

```sh
npx prettier --write src/components/channel/PinnedMessagesPanel.tsx src/components/message/MessageItem.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx
```

Output:

```text
[warn] jsxBracketSameLine is deprecated.
src/components/channel/PinnedMessagesPanel.tsx 71ms
src/components/message/MessageItem.tsx 42ms
src/components/channel/MessageList.tsx 16ms (unchanged)
src/components/layout/HarmonyShell.tsx 31ms (unchanged)
```

#### Tool: exec_command

```sh
npx eslint src/components/channel/PinnedMessagesPanel.tsx src/components/message/MessageItem.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx
```

Output:

```text

```

#### Tool: exec_command

```sh
npx tsc --noEmit
```

Output:

```text

```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:20:01.488Z

Formatting, ESLint, and TypeScript checks passed for the touched frontend files. I’m doing a final diff review now, then I’ll summarize exactly what changed for issue #500.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony diff -- harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx harmony-frontend/src/components/message/MessageItem.tsx harmony-frontend/src/components/channel/MessageList.tsx harmony-frontend/src/components/layout/HarmonyShell.tsx
```

Output:

```text
diff --git a/harmony-frontend/src/components/channel/MessageList.tsx b/harmony-frontend/src/components/channel/MessageList.tsx
index 32eb3dd..cca89e3 100644
--- a/harmony-frontend/src/components/channel/MessageList.tsx
+++ b/harmony-frontend/src/components/channel/MessageList.tsx
@@ -75,9 +75,18 @@ interface MessageListProps {
   canPin?: boolean;
   /** Called when the user clicks Reply on a message. */
   onReplyClick?: (message: Message) => void;
+  /** Called when the user clicks pin/unpin on a message. */
+  onPinToggle?: (messageId: string, pinned: boolean) => void;
 }
 
-export function MessageList({ channel, messages, serverId, canPin, onReplyClick }: MessageListProps) {
+export function MessageList({
+  channel,
+  messages,
+  serverId,
+  canPin,
+  onReplyClick,
+  onPinToggle,
+}: MessageListProps) {
   const bottomRef = useRef<HTMLDivElement>(null);
   const scrollContainerRef = useRef<HTMLDivElement>(null);
   // #c7: only auto-scroll when user is already near the bottom
@@ -150,7 +159,15 @@ export function MessageList({ channel, messages, serverId, canPin, onReplyClick
             <div key={group.messages[0]?.id || gi}>
               {showDateSeparator && <DateSeparator label={group.dateLabel} />}
               {group.messages.map((msg, mi) => (
-                <MessageItem key={msg.id} message={msg} showHeader={mi === 0} serverId={serverId} canPin={canPin} onReplyClick={onReplyClick} />
+                <MessageItem
+                  key={msg.id}
+                  message={msg}
+                  showHeader={mi === 0}
+                  serverId={serverId}
+                  canPin={canPin}
+                  onReplyClick={onReplyClick}
+                  onPinToggle={onPinToggle}
+                />
               ))}
             </div>
           );
diff --git a/harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx b/harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx
index b437b46..e5c9266 100644
--- a/harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx
+++ b/harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx
@@ -15,13 +15,7 @@ import type { Message } from '@/types';
 
 function XIcon() {
   return (
-    <svg
-      className='h-4 w-4'
-      viewBox='0 0 24 24'
-      fill='none'
-      stroke='currentColor'
-      strokeWidth={2}
-    >
+    <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
       <path d='M18 6 6 18M6 6l12 12' />
     </svg>
   );
@@ -29,13 +23,7 @@ function XIcon() {
 
 function PinIcon() {
   return (
-    <svg
-      className='h-4 w-4'
-      viewBox='0 0 24 24'
-      fill='none'
-      stroke='currentColor'
-      strokeWidth={2}
-    >
+    <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
       <path d='M12 17v5' />
       <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
     </svg>
@@ -76,6 +64,7 @@ export interface PinnedMessagesPanelProps {
   serverId: string;
   channelName: string;
   isOpen: boolean;
+  refreshKey?: number;
   onClose: () => void;
 }
 
@@ -84,6 +73,7 @@ export function PinnedMessagesPanel({
   serverId,
   channelName,
   isOpen,
+  refreshKey = 0,
   onClose,
 }: PinnedMessagesPanelProps) {
   const [messages, setMessages] = useState<Message[]>([]);
@@ -109,8 +99,10 @@ export function PinnedMessagesPanel({
         if (isCurrent) setIsLoading(false);
       }
     })();
-    return () => { isCurrent = false; };
-  }, [isOpen, channelId, serverId]);
+    return () => {
+      isCurrent = false;
+    };
+  }, [isOpen, channelId, serverId, refreshKey]);
 
   return (
     <aside
@@ -137,18 +129,12 @@ export function PinnedMessagesPanel({
 
       {/* Body */}
       <div className='flex-1 overflow-y-auto p-3'>
-        {isLoading && (
-          <p className='text-center text-sm text-gray-400'>Loading…</p>
-        )}
+        {isLoading && <p className='text-center text-sm text-gray-400'>Loading…</p>}
 
-        {!isLoading && error && (
-          <p className='text-center text-sm text-red-400'>{error}</p>
-        )}
+        {!isLoading && error && <p className='text-center text-sm text-red-400'>{error}</p>}
 
         {!isLoading && !error && messages.length === 0 && (
-          <p className='text-center text-sm text-gray-400'>
-            No pinned messages in #{channelName}.
-          </p>
+          <p className='text-center text-sm text-gray-400'>No pinned messages in #{channelName}.</p>
         )}
 
         {!isLoading && !error && messages.length > 0 && (
diff --git a/harmony-frontend/src/components/layout/HarmonyShell.tsx b/harmony-frontend/src/components/layout/HarmonyShell.tsx
index 30e4be2..5746a19 100644
--- a/harmony-frontend/src/components/layout/HarmonyShell.tsx
+++ b/harmony-frontend/src/components/layout/HarmonyShell.tsx
@@ -98,6 +98,7 @@ export function HarmonyShell({
   const setIsMembersOpen = useCallback((val: boolean) => setMembersOverride(val), []);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const [isPinsOpen, setIsPinsOpen] = useState(false);
+  const [pinsRefreshKey, setPinsRefreshKey] = useState(0);
   // #c25: track mobile channel-sidebar state so aria-expanded on hamburger reflects reality
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   // Local message state so sent messages appear immediately without a page reload
@@ -231,6 +232,14 @@ export function HarmonyShell({
     setReplyingTo(message);
   }, []);
 
+  const handlePinToggle = useCallback((messageId: string, pinned: boolean) => {
+    setIsPinsOpen(false);
+    setLocalMessages(prev =>
+      prev.map(message => (message.id === messageId ? { ...message, pinned } : message)),
+    );
+    setPinsRefreshKey(prev => prev + 1);
+  }, []);
+
   const handleCancelReply = useCallback(() => {
     setReplyingTo(null);
   }, []);
@@ -259,7 +268,15 @@ export function HarmonyShell({
   const handleRealTimeEdited = useCallback(
     (msg: Message) => {
       if (msg.channelId !== currentChannel.id) return;
-      setLocalMessages(prev => prev.map(m => (m.id === msg.id ? msg : m)));
+      let pinStateChanged = false;
+      setLocalMessages(prev =>
+        prev.map(m => {
+          if (m.id !== msg.id) return m;
+          pinStateChanged = Boolean(m.pinned) !== Boolean(msg.pinned);
+          return msg;
+        }),
+      );
+      if (pinStateChanged) setPinsRefreshKey(prev => prev + 1);
     },
     [currentChannel.id],
   );
@@ -502,6 +519,7 @@ export function HarmonyShell({
                     serverId={currentServer.id}
                     canPin={canPin}
                     onReplyClick={handleReplyClick}
+                    onPinToggle={handlePinToggle}
                   />
                   <MessageInput
                     channelId={currentChannel.id}
@@ -527,6 +545,7 @@ export function HarmonyShell({
                 serverId={currentServer.id}
                 channelName={currentChannel.name}
                 isOpen={isPinsOpen}
+                refreshKey={pinsRefreshKey}
                 onClose={() => setIsPinsOpen(false)}
               />
             )}
diff --git a/harmony-frontend/src/components/message/MessageItem.tsx b/harmony-frontend/src/components/message/MessageItem.tsx
index eecf6cc..7a9c952 100644
--- a/harmony-frontend/src/components/message/MessageItem.tsx
+++ b/harmony-frontend/src/components/message/MessageItem.tsx
@@ -114,7 +114,12 @@ function ReplyBanner({ parentMessage }: { parentMessage: NonNullable<Message['pa
       className='mb-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors max-w-full'
       aria-label={`Jump to replied message from ${parentMessage.author.displayName ?? parentMessage.author.username}`}
     >
-      <svg className='h-3 w-3 flex-shrink-0 rotate-180' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
+      <svg
+        className='h-3 w-3 flex-shrink-0 rotate-180'
+        viewBox='0 0 24 24'
+        fill='currentColor'
+        aria-hidden='true'
+      >
         <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
       </svg>
       {parentMessage.isDeleted ? (
@@ -167,6 +172,7 @@ function ActionBar({
   isOwnMessage,
   onEditClick,
   onReplyClick,
+  onPinToggle,
 }: {
   messageId: string;
   serverId?: string;
@@ -175,6 +181,7 @@ function ActionBar({
   isOwnMessage?: boolean;
   onEditClick?: () => void;
   onReplyClick?: () => void;
+  onPinToggle?: (messageId: string, pinned: boolean) => void;
 }) {
   const { isAuthenticated } = useAuth();
   const router = useRouter();
@@ -210,6 +217,8 @@ function ActionBar({
 
   const handlePinToggle = useCallback(async () => {
     if (!serverId) return;
+    const nextPinned = !isPinned;
+    onPinToggle?.(messageId, nextPinned);
     setIsMoreOpen(false);
     setPinState('loading');
     const verb = isPinned ? 'unpin' : 'pin';
@@ -218,7 +227,7 @@ function ActionBar({
         ? await unpinMessageAction(messageId, serverId)
         : await pinMessageAction(messageId, serverId);
       if (result.ok) {
-        setIsPinned(prev => !prev);
+        setIsPinned(nextPinned);
         setPinState('success');
         if (successTimerRef.current) clearTimeout(successTimerRef.current);
         successTimerRef.current = setTimeout(() => setPinState('idle'), 2000);
@@ -244,7 +253,7 @@ function ActionBar({
         setPinErrorMsg('');
       }, 3000);
     }
-  }, [isPinned, messageId, serverId]);
+  }, [isPinned, messageId, onPinToggle, serverId]);
 
   return (
     <div className='absolute -top-3 right-4 z-10 flex items-center rounded-md border border-white/10 bg-[#2f3136] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'>
@@ -330,7 +339,9 @@ function ActionBar({
           </button>
 
           {isMoreOpen && (
-            <div className={`absolute right-0 min-w-[160px] rounded-md border border-white/10 bg-[#18191c] py-1 shadow-xl z-20 ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
+            <div
+              className={`absolute right-0 min-w-[160px] rounded-md border border-white/10 bg-[#18191c] py-1 shadow-xl z-20 ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}
+            >
               {isOwnMessage && (
                 <button
                   type='button'
@@ -381,6 +392,7 @@ export function MessageItem({
   canPin,
   serverId,
   onReplyClick,
+  onPinToggle,
 }: {
   message: Message;
   /** Set to false for grouped follow-up messages from the same author. Hides the avatar and author line. */
@@ -391,6 +403,8 @@ export function MessageItem({
   serverId?: string;
   /** Called when the user clicks Reply on this message. */
   onReplyClick?: (message: Message) => void;
+  /** Called when the user triggers a pin/unpin action for this message. */
+  onPinToggle?: (messageId: string, pinned: boolean) => void;
 }) {
   const { user } = useAuth();
   const { showToast } = useToast();
@@ -495,6 +509,7 @@ export function MessageItem({
       isOwnMessage={isOwnMessage}
       onEditClick={handleEditClick}
       onReplyClick={handleReplyClick}
+      onPinToggle={onPinToggle}
     />
   );
 
@@ -540,7 +555,11 @@ export function MessageItem({
         data-message-id={message.id}
         className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
       >
-        {message.parentMessage && <div className='ml-14 pt-1'><ReplyBanner parentMessage={message.parentMessage} /></div>}
+        {message.parentMessage && (
+          <div className='ml-14 pt-1'>
+            <ReplyBanner parentMessage={message.parentMessage} />
+          </div>
+        )}
         <div className='flex gap-4'>
           {!isEditing && actionBar}
           {/* Spacer aligns content with the 40px avatar of the header row */}
@@ -573,7 +592,11 @@ export function MessageItem({
       data-message-id={message.id}
       className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
     >
-      {message.parentMessage && <div className='ml-14 pt-1'><ReplyBanner parentMessage={message.parentMessage} /></div>}
+      {message.parentMessage && (
+        <div className='ml-14 pt-1'>
+          <ReplyBanner parentMessage={message.parentMessage} />
+        </div>
+      )}
       <div className='flex gap-4'>
         {!isEditing && actionBar}
         {/* Avatar */}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:20:08.913Z

I found one correctness issue in my first pass: I was updating local pin state before the server confirmed success. I’m fixing that now so panel-close still happens on click, but message pin state only changes after a successful response.

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:20:33.060Z

I’ve corrected the optimistic-update bug and am rerunning formatting/lint/typecheck to confirm everything is clean.

#### Tool: exec_command

```sh
npx prettier --write src/components/channel/PinnedMessagesPanel.tsx src/components/message/MessageItem.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx
```

Output:

```text
[warn] jsxBracketSameLine is deprecated.
src/components/channel/PinnedMessagesPanel.tsx 44ms (unchanged)
src/components/message/MessageItem.tsx 39ms (unchanged)
src/components/channel/MessageList.tsx 11ms (unchanged)
src/components/layout/HarmonyShell.tsx 32ms (unchanged)
```

#### Tool: exec_command

```sh
npx eslint src/components/channel/PinnedMessagesPanel.tsx src/components/message/MessageItem.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx
```

Output:

```text

```

#### Tool: exec_command

```sh
npx tsc --noEmit
```

Output:

```text

```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:20:44.640Z

Implemented issue #500 behavior in the frontend.

### What changed
- Real-time refresh for pinned sidebar:
  - Added a `refreshKey` prop to [`PinnedMessagesPanel.tsx`](/Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx) and refetches pinned messages whenever it changes.
  - `HarmonyShell` now increments that key when pin state changes from:
    - successful local pin/unpin action
    - incoming real-time edited message events where `pinned` changed

- Close pinned sidebar when pin/unpin is clicked:
  - Added a pin-action-start callback path `MessageItem -> MessageList -> HarmonyShell`.
  - On pin/unpin click, `HarmonyShell` immediately closes the pins sidebar (`setIsPinsOpen(false)`), then pin state only updates after server success.

- Wiring changes:
  - [`MessageItem.tsx`](/Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/message/MessageItem.tsx): added `onPinActionStart` and `onPinToggle` callbacks.
  - [`MessageList.tsx`](/Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/channel/MessageList.tsx): forwards those callbacks.
  - [`HarmonyShell.tsx`](/Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/layout/HarmonyShell.tsx): owns sidebar-close and refresh-key state.

### Verification run
- `npx prettier --write` on touched files
- `npx eslint` on touched files
- `npx tsc --noEmit`

All passed.

### Turn 2: run a dev server for me so I can test it

#### 👤 User Prompt

- Time: 2026-04-29T15:20:45.714Z

```text
run a dev server for me so I can test it locally
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:20:49.251Z

I’ll start the frontend dev server in `harmony-frontend` so you can test locally, then I’ll share the local URL and keep it running.

#### Tool: exec_command

```sh
npm run dev
```

Output:

```text

> harmony-frontend@0.1.0 dev
> next dev

⨯ Failed to start server
Error: listen EPERM: operation not permitted 0.0.0.0:3000
    at <unknown> (Error: listen EPERM: operation not permitted 0.0.0.0:3000)
    at new Promise (<anonymous>) {
  code: 'EPERM',
  errno: -1,
  syscall: 'listen',
  address: '0.0.0.0',
  port: 3000
}
[?25h
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:20:55.411Z

The sandbox blocked binding to port `3000`. I’m re-running the same dev server command with escalated permissions so it can listen on localhost for your testing.

### Turn 3: <turn_aborted> The user interrupted the previous turn on purpose. Any

#### 👤 User Prompt

- Time: 2026-04-29T15:20:56.499Z

```text
<turn_aborted>
The user interrupted the previous turn on purpose. Any running unified exec processes may still be running in the background. If any tools/commands were aborted, they may have partially executed.
</turn_aborted>
```

_No assistant or tool activity recorded after this prompt._

### Turn 4: make a

#### 👤 User Prompt

- Time: 2026-04-29T15:20:59.386Z

```text
make a PR
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:21:07.281Z

I’ll package the issue #500 fix into a PR: check branch/status, commit the current changes, push a `codex/` branch, and open a draft PR. I’m verifying git state first.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony status --short --branch
```

Output:

```text
## HEAD (no branch)
 M harmony-frontend/src/components/channel/MessageList.tsx
 M harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx
 M harmony-frontend/src/components/layout/HarmonyShell.tsx
 M harmony-frontend/src/components/message/MessageItem.tsx
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony remote -v
```

Output:

```text
origin	git@github.com:CS485-Harmony/Harmony.git (fetch)
origin	git@github.com:CS485-Harmony/Harmony.git (push)
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony rev-parse --abbrev-ref HEAD
```

Output:

```text
HEAD
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:21:12.608Z

You’re on detached `HEAD`, so I’m creating a new branch from current state, committing these four files with the required co-author trailer, then pushing and opening the PR.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony switch -c codex/issue-500-pin-sidebar-realtime-close-on-pin
```

Output:

```text
fatal: cannot lock ref 'refs/heads/codex/issue-500-pin-sidebar-realtime-close-on-pin': Unable to create '/Users/allen/repos/Harmony/.git/refs/heads/codex/issue-500-pin-sidebar-realtime-close-on-pin.lock': Operation not permitted
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:21:16.771Z

Branch creation was blocked by sandbox git-ref permissions. I’m re-running that exact branch creation with escalated permissions so I can continue the PR flow.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony switch -c codex/issue-500-pin-sidebar-realtime-close-on-pin
```

Output:

```text
Switched to a new branch 'codex/issue-500-pin-sidebar-realtime-close-on-pin'
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:21:28.039Z

Branch is ready. I’m reviewing the diff stat, then staging and committing with a message tied to issue #500.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony diff --stat
```

Output:

```text
 .../src/components/channel/MessageList.tsx         | 25 +++++++++++--
 .../src/components/channel/PinnedMessagesPanel.tsx | 36 ++++++-------------
 .../src/components/layout/HarmonyShell.tsx         | 25 ++++++++++++-
 .../src/components/message/MessageItem.tsx         | 42 ++++++++++++++++++----
 4 files changed, 94 insertions(+), 34 deletions(-)
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony status --short
```

Output:

```text
 M harmony-frontend/src/components/channel/MessageList.tsx
 M harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx
 M harmony-frontend/src/components/layout/HarmonyShell.tsx
 M harmony-frontend/src/components/message/MessageItem.tsx
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony add harmony-frontend/src/components/channel/MessageList.tsx harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx harmony-frontend/src/components/layout/HarmonyShell.tsx harmony-frontend/src/components/message/MessageItem.tsx && git -C /Users/allen/.codex/worktrees/cafd/Harmony commit -m "fix(frontend): live-update pinned sidebar and close panel on pin click" -m "- refresh pinned messages panel immediately after pin/unpin\n- close pinned panel when pin action is triggered\n- propagate pin callbacks through message list to shell\n\nRefs #500\n\nCo-authored-by: GPT 5.5 <noreply@openai.com>"
```

Output:

```text
fatal: Unable to create '/Users/allen/repos/Harmony/.git/worktrees/Harmony3/index.lock': Operation not permitted
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony add harmony-frontend/src/components/channel/MessageList.tsx harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx harmony-frontend/src/components/layout/HarmonyShell.tsx harmony-frontend/src/components/message/MessageItem.tsx && git -C /Users/allen/.codex/worktrees/cafd/Harmony commit -m "fix(frontend): live-update pinned sidebar and close panel on pin click" -m "- refresh pinned messages panel immediately after pin/unpin\n- close pinned panel when pin action is triggered\n- propagate pin callbacks through message list to shell\n\nRefs #500\n\nCo-authored-by: GPT 5.5 <noreply@openai.com>"
```

Output:

```text
[codex/issue-500-pin-sidebar-realtime-close-on-pin 299b4ba] fix(frontend): live-update pinned sidebar and close panel on pin click
 4 files changed, 94 insertions(+), 34 deletions(-)
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:21:46.179Z

Commit is in place. I’m pushing this branch and creating a draft PR against `main` with the issue context and testing notes.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony push -u origin codex/issue-500-pin-sidebar-realtime-close-on-pin
```

Output:

```text
remote: 
remote: Create a pull request for 'codex/issue-500-pin-sidebar-realtime-close-on-pin' on GitHub by visiting:        
remote:      https://github.com/CS485-Harmony/Harmony/pull/new/codex/issue-500-pin-sidebar-realtime-close-on-pin        
remote: 
To github.com:CS485-Harmony/Harmony.git
 * [new branch]      codex/issue-500-pin-sidebar-realtime-close-on-pin -> codex/issue-500-pin-sidebar-realtime-close-on-pin
branch 'codex/issue-500-pin-sidebar-realtime-close-on-pin' set up to track 'origin/codex/issue-500-pin-sidebar-realtime-close-on-pin'.
```

#### Tool: exec_command

```sh
gh pr create --repo CS485-Harmony/Harmony --base main --head codex/issue-500-pin-sidebar-realtime-close-on-pin --title "Fix #500: pinned sidebar real-time refresh + close-on-pin" --body "## Summary\n- refresh pinned messages sidebar immediately after successful pin/unpin actions\n- close the pinned sidebar as soon as pin/unpin is clicked\n- refetch sidebar data when message pin state changes from real-time events\n\n## Files Changed\n- harmony-frontend/src/components/layout/HarmonyShell.tsx\n- harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx\n- harmony-frontend/src/components/channel/MessageList.tsx\n- harmony-frontend/src/components/message/MessageItem.tsx\n\n## Verification\n- npx prettier --write on touched files\n- npx eslint on touched files\n- npx tsc --noEmit\n\n## Issue\nCloses #500\n\n## Notes\nI could not keep a local dev server running in this sandbox because binding to port 3000 is restricted here." --draft
```

Output:

```text
https://github.com/CS485-Harmony/Harmony/pull/548
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:22:17.881Z

PR is up: [#548](https://github.com/CS485-Harmony/Harmony/pull/548)

- Branch: `codex/issue-500-pin-sidebar-realtime-close-on-pin`
- Commit: `299b4ba`
- Includes the issue #500 fix for:
  - pinned sidebar refreshing immediately after pin/unpin
  - closing pinned sidebar when pin/unpin is clicked
  - refresh on real-time edited events where pin state changes

I also ran:
- `npx prettier --write` (touched files)
- `npx eslint` (touched files)
- `npx tsc --noEmit`

### Turn 5: resolve merge

#### 👤 User Prompt

- Time: 2026-04-29T15:30:38.261Z

```text
resolve merge conflicts
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:30:45.700Z

I’ll pull the latest `main` into your PR branch, resolve any conflicts in the touched frontend files, and re-run checks before pushing the resolved branch. I’m starting by inspecting the current git conflict state.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony status --short --branch
```

Output:

```text
## codex/issue-500-pin-sidebar-realtime-close-on-pin...origin/codex/issue-500-pin-sidebar-realtime-close-on-pin
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony rev-parse --abbrev-ref HEAD
```

Output:

```text
codex/issue-500-pin-sidebar-realtime-close-on-pin
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony fetch origin main && git -C /Users/allen/.codex/worktrees/cafd/Harmony merge origin/main
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            main       -> FETCH_HEAD
   653f127..f95fea4  main       -> origin/main
Auto-merging harmony-frontend/src/components/message/MessageItem.tsx
CONFLICT (content): Merge conflict in harmony-frontend/src/components/message/MessageItem.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:30:57.039Z

There is one real merge conflict in `harmony-frontend/src/components/message/MessageItem.tsx`. I’m opening that file now and resolving it while preserving both the incoming main changes and your pin-sidebar behavior.

#### Tool: exec_command

```sh
rtk grep -n "<<<<<<<|=======|>>>>>>>" harmony-frontend/src/components/message/MessageItem.tsx && rtk read harmony-frontend/src/components/message/MessageItem.tsx
```

Output:

```text
9 matches in 1F:

[file] harmony-frontend/.../message/MessageItem.tsx (9):
   207: <<<<<<< HEAD
   210: =======
   212: >>>>>>> origin/main
   222: <<<<<<< HEAD
   225: =======
   227: >>>>>>> origin/main
   731: <<<<<<< HEAD
   735: =======
   738: >>>>>>> origin/main

/**
 * Component: MessageItem
 * Individual message row matching Discord's message style.
 * Supports a full variant (avatar + author + timestamp + content) and a
 * compact variant (no avatar/name) for grouped follow-up messages.
 *
 * ActionBar: appears on hover/focus. Shows Reply (functional) and Add Reaction
 * stub for all users. Shows a "More" (⋯) dropdown with "Pin/Unpin Message" for
 * users with message:pin permission (MODERATOR, ADMIN, OWNER), and "Edit
 * Message" for the message's own author.
 *
 * Replies: messages with a parentMessage show a Discord-style inline reply
 * banner above the content. Clicking the banner scrolls to the parent message.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { cn, formatMessageTimestamp, formatTimeOnly } from '@/lib/utils';
import { pinMessageAction, unpinMessageAction } from '@/app/actions/pinMessage';
import { editMessageAction } from '@/app/actions/editMessage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ThreadView } from '@/components/message/ThreadView';
import { apiClient } from '@/lib/api-client';
import type { Message, Reaction } from '@/types';

const EmojiPickerPopover = dynamic(
  () =>
    import('@/components/channel/EmojiPickerPopover').then(m => ({
      default: m.EmojiPickerPopover,
    })),
  { ssr: false },
);

// ─── AttachmentList ───────────────────────────────────────────────────────────

function AttachmentList({ attachments }: { attachments: Message['attachments'] }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className='mt-1.5 flex flex-col gap-2'>
      {attachments.map(a => {
        const isImage = a.type?.startsWith('image/');
        if (isImage) {
          return (
            <a
              key={a.id}
              href={a.url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block max-w-sm'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.url} alt={a.filename} className='max-h-64 rounded-md object-contain' />
            </a>
          );
        }
        return (
          <a
            key={a.id}
            href={a.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-blue-400 hover:bg-white/10 hover:text-blue-300 transition-colors w-fit'
          >
            <svg
              className='h-4 w-4 flex-shrink-0'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              aria-hidden='true'
            >
              <path d='M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48' />
            </svg>
            <span className='truncate max-w-xs'>{a.filename}</span>
          </a>
        );
      })}
    </div>
  );
}

// ─── ReactionList ─────────────────────────────────────────────────────────────

function ReactionList({
  reactions,
  messageId,
  userId,
  onReactionClick,
}: {
  reactions: Reaction[];
  messageId: string;
  userId?: string;
  onReactionClick?: (emoji: string, alreadyReacted: boolean) => void;
}) {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div className='mt-1 flex flex-wrap gap-1'>
      {reactions.map(r => {
        const alreadyReacted = !!userId && r.userIds.includes(userId);
        return (
          <button
            key={`${r.emoji}-${messageId}`}
            type='button'
            aria-label={`React with ${r.emoji} (${r.count} ${r.count !== 1 ? 'reactions' : 'reaction'})${alreadyReacted ? ' — click to remove' : ''}`}
            aria-pressed={alreadyReacted}
            onClick={() => onReactionClick?.(r.emoji, alreadyReacted)}
            className={cn(
              'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors',
              alreadyReacted
                ? 'border-[#5865f2]/60 bg-[#5865f2]/20 text-[#5865f2] hover:bg-[#5865f2]/30'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10',
            )}
          >
            <span>{r.emoji}</span>
            <span>{r.count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── ReplyBanner ──────────────────────────────────────────────────────────────

function ReplyBanner({ parentMessage }: { parentMessage: NonNullable<Message['parentMessage']> }) {
  const handleClick = () => {
    const el = document.querySelector(`[data-message-id="${parentMessage.id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const label = parentMessage.isDeleted
    ? 'Original message deleted'
    : `${parentMessage.author.displayName ?? parentMessage.author.username}: ${parentMessage.content}`;

  return (
    <button
      type='button'
      onClick={handleClick}
      title={label}
      className='mb-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors max-w-full'
      aria-label={`Jump to replied message from ${parentMessage.author.displayName ?? parentMessage.author.username}`}
    >
      <svg
        className='h-3 w-3 flex-shrink-0 rotate-180'
        viewBox='0 0 24 24'
        fill='currentColor'
        aria-hidden='true'
      >
        <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
      </svg>
      {parentMessage.isDeleted ? (
        <span className='italic text-gray-500'>Original message deleted</span>
      ) : (
        <>
          <span className='font-medium text-gray-300 flex-shrink-0'>
            {parentMessage.author.displayName ?? parentMessage.author.username}
          </span>
          <span className='min-w-0 truncate'>{parentMessage.content}</span>
        </>
      )}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PinMenuIcon() {
  return (
    <svg
      className='h-3.5 w-3.5 flex-shrink-0'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      aria-hidden='true'
    >
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

// ─── Hover action bar ─────────────────────────────────────────────────────────

type PinState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hover/focus-within action bar for a message.
 * Reply triggers onReplyClick (opens thread for authenticated users).
 * More (⋯) is rendered when canPin or isOwnMessage is true, and opens a
 * dropdown with Pin/Unpin (canPin) and Edit Message (isOwnMessage).
 */
function ActionBar({
  messageId,
  serverId,
  channelId,
  canPin,
  initialPinned,
  isOwnMessage,
  onEditClick,
  onReplyClick,
<<<<<<< HEAD
  onPinActionStart,
  onPinToggle,
=======
  onReactionAdd,
>>>>>>> origin/main
}: {
  messageId: string;
  serverId?: string;
  channelId?: string;
  canPin?: boolean;
  initialPinned?: boolean;
  isOwnMessage?: boolean;
  onEditClick?: () => void;
  onReplyClick?: () => void;
<<<<<<< HEAD
  onPinActionStart?: () => void;
  onPinToggle?: (messageId: string, pinned: boolean) => void;
=======
  onReactionAdd?: (emoji: string) => void;
>>>>>>> origin/main
}) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [isPinned, setIsPinned] = useState(initialPinned ?? false);
  const [pinState, setPinState] = useState<PinState>('idle');
  const [pinErrorMsg, setPinErrorMsg] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click; clean up timers on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMoreOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isMoreOpen]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    function onClickOutside(e: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiSelect = useCallback(
    async (emoji: { native: string }) => {
      setShowEmojiPicker(false);
      if (!channelId || !serverId) return;
      try {
        await apiClient.trpcMutation('reaction.addReaction', {
          serverId,
          channelId,
          messageId,
          emoji: emoji.native,
        });
        onReactionAdd?.(emoji.native);
      } catch (err: unknown) {
        const code = (
          err as { response?: { data?: { error?: { json?: { code?: string } } } } }
        )?.response?.data?.error?.json?.code;
        if (code !== 'CONFLICT') {
          showToast({ message: 'Failed to add reaction. Please try again.', type: 'error' });
        }
      }
    },
    [channelId, serverId, messageId, onReactionAdd, showToast],
  );

  const handlePinToggle = useCallback(async () => {
    if (!serverId) return;
    const nextPinned = !isPinned;
    onPinActionStart?.();
    setIsMoreOpen(false);
    setPinState('loading');
    const verb = isPinned ? 'unpin' : 'pin';
    try {
      const result = isPinned
        ? await unpinMessageAction(messageId, serverId)
        : await pinMessageAction(messageId, serverId);
      if (result.ok) {
        setIsPinned(nextPinned);
        onPinToggle?.(messageId, nextPinned);
        setPinState('success');
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setPinState('idle'), 2000);
      } else {
        const msg = result.forbidden
          ? `You don't have permission to ${verb} messages.`
          : `Failed to ${verb} message. Please try again.`;
        setPinErrorMsg(msg);
        setPinState('error');
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => {
          setPinState('idle');
          setPinErrorMsg('');
        }, 3000);
      }
    } catch {
      const msg = `Failed to ${verb} message. Please try again.`;
      setPinErrorMsg(msg);
      setPinState('error');
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setPinState('idle');
        setPinErrorMsg('');
      }, 3000);
    }
  }, [isPinned, messageId, onPinActionStart, onPinToggle, serverId]);

  return (
    <div className='absolute -top-3 right-4 z-10 flex items-center rounded-md border border-white/10 bg-[#2f3136] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'>
      {/* Inline pin feedback */}
      {pinState === 'success' && (
        <span className='px-2 text-xs text-green-400'>{isPinned ? '📌 Pinned' : 'Unpinned'}</span>
      )}
      {pinState === 'error' && <span className='px-2 text-xs text-red-400'>{pinErrorMsg}</span>}

      {/* Reply — redirects guests to login; opens thread for authenticated users */}
      <button
        type='button'
        aria-label='Reply'
        title='Reply'
        onClick={
          !isAuthenticated
            ? () => router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
            : onReplyClick
        }
        className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
      >
        <svg
          className='h-4 w-4'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
          focusable='false'
        >
          <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
        </svg>
      </button>

      {/* Add Reaction — redirects guests to login; opens emoji picker for authenticated users */}
      <div ref={emojiPickerRef} className='relative'>
        <button
          type='button'
          aria-label='Add Reaction'
          title='Add Reaction'
          aria-expanded={isAuthenticated ? showEmojiPicker : undefined}
          aria-haspopup={isAuthenticated ? 'dialog' : undefined}
          onClick={
            !isAuthenticated
              ? () => router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
              : () => setShowEmojiPicker(prev => !prev)
          }
          className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
        >
          <svg
            className='h-4 w-4'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-3.5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.476 2.37a.75.75 0 0 0-1.06-1.06 4.5 4.5 0 0 1-6.832 0 .75.75 0 0 0-1.061 1.06 6 6 0 0 0 8.953 0z' />
          </svg>
        </button>
        {isAuthenticated && showEmojiPicker && (
          <div
            role='dialog'
            aria-label='Emoji picker'
            className='absolute bottom-full right-0 z-50 mb-2'
          >
            <EmojiPickerPopover onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>

      {/* More — rendered when user can pin or is the message author */}
      {(canPin || isOwnMessage) && (
        <div ref={moreRef} className='relative'>
          <button
            type='button'
            aria-label='More actions'
            title='More'
            ref={moreTriggerRef}
            aria-expanded={isMoreOpen}
            onClick={() => {
              if (!isMoreOpen && moreTriggerRef.current) {
                const rect = moreTriggerRef.current.getBoundingClientRect();
                setOpenUpward(window.innerHeight - rect.bottom < 180);
              }
              setIsMoreOpen(v => !v);
            }}
            className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
          >
            <svg
              className='h-4 w-4'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
              focusable='false'
            >
              <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
            </svg>
          </button>

          {isMoreOpen && (
            <div
              className={`absolute right-0 min-w-[160px] rounded-md border border-white/10 bg-[#18191c] py-1 shadow-xl z-20 ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}
            >
              {isOwnMessage && (
                <button
                  type='button'
                  onClick={() => {
                    setIsMoreOpen(false);
                    onEditClick?.();
                  }}
                  className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white transition-colors'
                >
                  <svg
                    className='h-3.5 w-3.5 flex-shrink-0'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    aria-hidden='true'
                  >
                    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                    <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                  </svg>
                  Edit Message
                </button>
              )}
              {canPin && (
                <button
                  type='button'
                  onClick={handlePinToggle}
                  disabled={pinState === 'loading'}
                  className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white disabled:opacity-50 transition-colors'
                >
                  <PinMenuIcon />
                  {isPinned ? 'Unpin Message' : 'Pin Message'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MessageItem ──────────────────────────────────────────────────────────────

export function MessageItem({
  message,
  showHeader = true,
  canPin,
  serverId,
  onReplyClick,
  onPinActionStart,
  onPinToggle,
}: {
  message: Message;
  /** Set to false for grouped follow-up messages from the same author. Hides the avatar and author line. */
  showHeader?: boolean;
  /** When true, shows the pin/unpin option in the action bar. Grant to MODERATOR+. */
  canPin?: boolean;
  /** Required for pin actions. Passed alongside canPin. */
  serverId?: string;
  /** Called when the user clicks Reply on this message. */
  onReplyClick?: (message: Message) => void;
  /** Called as soon as the user clicks pin/unpin for this message. */
  onPinActionStart?: () => void;
  /** Called when the user triggers a pin/unpin action for this message. */
  onPinToggle?: (messageId: string, pinned: boolean) => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [avatarError, setAvatarError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);
  const [localContent, setLocalContent] = useState<string | undefined>(undefined);
  const [localReactions, setLocalReactions] = useState<Reaction[]>(message.reactions ?? []);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const isTopLevel = !message.parentMessageId;
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [localReplyCount, setLocalReplyCount] = useState(message.replyCount ?? 0);

  // Render-phase derived-state reset: when the avatar URL changes (including A→B→A),
  // reset avatarError so the new URL is always attempted.
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(message.author.avatarUrl);
  if (prevAvatarUrl !== message.author.avatarUrl) {
    setPrevAvatarUrl(message.author.avatarUrl);
    if (avatarError) setAvatarError(false);
  }

  // Keep editContent in sync when message content changes externally (e.g. via SSE)
  const [prevContent, setPrevContent] = useState(message.content);
  if (!isEditing && prevContent !== message.content) {
    setPrevContent(message.content);
    setEditContent(message.content);
    if (localContent !== undefined) setLocalContent(undefined);
  }

  // Sync localReactions when message.reactions changes externally (e.g. via SSE)
  const [prevReactions, setPrevReactions] = useState(message.reactions);
  if (prevReactions !== message.reactions) {
    setPrevReactions(message.reactions);
    setLocalReactions(message.reactions ?? []);
  }

  const isOwnMessage = !!user && user.id === message.author.id;

  const handleReactionAdd = useCallback(
    (emoji: string) => {
      setLocalReactions(prev => {
        const existing = prev.find(r => r.emoji === emoji);
        if (existing) {
          return prev.map(r =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: r.count + 1,
                  userIds: user?.id ? [...r.userIds, user.id] : r.userIds,
                }
              : r,
          );
        }
        return [...prev, { emoji, count: 1, userIds: user?.id ? [user.id] : [] }];
      });
    },
    [user],
  );

  // Called when user clicks an existing reaction pill to add or remove their reaction.
  const handleReactionToggle = useCallback(
    async (emoji: string, alreadyReacted: boolean) => {
      if (!isAuthenticated) {
        router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!serverId) return;

      const channelId = message.channelId;
      const messageId = message.id;
      const uid = user?.id;

      if (alreadyReacted) {
        // Optimistic remove
        setLocalReactions(prev =>
          prev
            .map(r =>
              r.emoji === emoji
                ? { ...r, count: r.count - 1, userIds: r.userIds.filter(id => id !== uid) }
                : r,
            )
            .filter(r => r.count > 0),
        );
        try {
          await apiClient.trpcMutation('reaction.removeReaction', {
            serverId,
            channelId,
            messageId,
            emoji,
          });
        } catch {
          // Revert: add the reaction back
          setLocalReactions(prev => {
            const existing = prev.find(r => r.emoji === emoji);
            if (existing) {
              return prev.map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, userIds: uid ? [...r.userIds, uid] : r.userIds }
                  : r,
              );
            }
            return [...prev, { emoji, count: 1, userIds: uid ? [uid] : [] }];
          });
          showToast({ message: 'Failed to remove reaction. Please try again.', type: 'error' });
        }
      } else {
        // Optimistic add
        setLocalReactions(prev => {
          const existing = prev.find(r => r.emoji === emoji);
          if (existing) {
            return prev.map(r =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, userIds: uid ? [...r.userIds, uid] : r.userIds }
                : r,
            );
          }
          return [...prev, { emoji, count: 1, userIds: uid ? [uid] : [] }];
        });
        try {
          await apiClient.trpcMutation('reaction.addReaction', {
            serverId,
            channelId,
            messageId,
            emoji,
          });
        } catch (err: unknown) {
          const code = (err as { response?: { data?: { error?: { json?: { code?: string } } } } })
            ?.response?.data?.error?.json?.code;
          if (code === 'CONFLICT') return; // already reacted — optimistic state is correct
          // Revert: remove the optimistic reaction
          setLocalReactions(prev =>
            prev
              .map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.count - 1, userIds: r.userIds.filter(id => id !== uid) }
                  : r,
              )
              .filter(r => r.count > 0),
          );
          showToast({ message: 'Failed to add reaction. Please try again.', type: 'error' });
        }
      }
    },
    [isAuthenticated, serverId, message, user, showToast, router, pathname],
  );

  const handleEditClick = useCallback(() => {
    const current = localContent ?? message.content;
    setEditContent(current);
    setIsEditing(true);
    setTimeout(() => {
      const el = editTextareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 0);
  }, [localContent, message.content]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditContent(localContent ?? message.content);
  }, [localContent, message.content]);

  const handleEditSave = useCallback(async () => {
    const trimmed = editContent.trim();
    const currentContent = localContent ?? message.content;
    if (!trimmed || trimmed === currentContent || !serverId) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const result = await editMessageAction(message.id, serverId, trimmed);
    setIsSaving(false);
    if (result.ok) {
      setIsEditing(false);
      setLocalContent(result.message.content);
    } else {
      const msg = result.forbidden
        ? "You don't have permission to edit this message."
        : 'Failed to edit message. Please try again.';
      showToast({ message: msg, type: 'error' });
    }
  }, [editContent, localContent, message.content, message.id, serverId, showToast]);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleEditSave();
      } else if (e.key === 'Escape') {
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel],
  );

  // Trim first to guard against empty-string usernames — || catches "" where ?? would not.
  const trimmedUsername = message.author.username?.trim();
  const authorInitial = trimmedUsername?.charAt(0)?.toUpperCase() || '?';

  // TODO: Author name role coloring
  // The Author type embedded in Message does not carry a role field —
  // role lives on the User entity. When real auth/user data is wired up,
  // pass the user's role here and map it to a colour:
  //   owner → #f0b132 (gold), admin → #ed4245 (red),
  //   moderator → #3ba55c (green), member/guest → text-white
  const authorNameClass = 'cursor-pointer font-medium text-white hover:underline';

  const handleReplyClick = useCallback(() => {
    onReplyClick?.(message);
  }, [onReplyClick, message]);

  const actionBar = (
    <ActionBar
      messageId={message.id}
      serverId={serverId}
      channelId={message.channelId}
      canPin={canPin}
      initialPinned={!!message.pinned}
      isOwnMessage={isOwnMessage}
      onEditClick={handleEditClick}
<<<<<<< HEAD
      onReplyClick={handleReplyClick}
      onPinActionStart={onPinActionStart}
      onPinToggle={onPinToggle}
=======
      onReplyClick={isTopLevel ? handleReplyClick : undefined}
      onReactionAdd={handleReactionAdd}
>>>>>>> origin/main
    />
  );

  const threadToggle =
    isTopLevel && serverId ? (
      <button
        type='button'
        onClick={() => setIsThreadOpen(v => !v)}
        className='mt-1 flex items-center gap-1 text-xs text-[#5865f2] hover:underline'
        aria-expanded={isThreadOpen}
        aria-label={
          isThreadOpen
            ? 'Hide replies'
            : `View ${localReplyCount} ${localReplyCount === 1 ? 'reply' : 'replies'}`
        }
      >
        <svg className='h-3 w-3' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
        </svg>
        {isThreadOpen
          ? 'Hide replies'
          : `${localReplyCount} ${localReplyCount === 1 ? 'reply' : 'replies'}`}
      </button>
    ) : null;

  const threadView =
    isTopLevel && isThreadOpen && serverId ? (
      <ThreadView
        parentMessage={message}
        channelId={message.channelId}
        serverId={serverId}
        onReplyCountChange={delta => setLocalReplyCount(c => c + delta)}
      />
    ) : null;

  const editUi = (
    <div className='mt-0.5'>
      <textarea
        ref={editTextareaRef}
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
        onKeyDown={handleEditKeyDown}
        disabled={isSaving}
        rows={3}
        className='w-full resize-none rounded-md bg-[#40444b] px-3 py-2 text-sm text-[#dcddde] outline-none focus:ring-1 focus:ring-[#5865f2] disabled:opacity-50'
        aria-label='Edit message'
      />
      <div className='mt-1 flex items-center gap-2 text-xs text-gray-400'>
        <span>
          escape to{' '}
          <button
            type='button'
            onClick={handleEditCancel}
            className='text-[#5865f2] hover:underline'
          >
            cancel
          </button>
          {' · '}enter to{' '}
          <button
            type='button'
            onClick={handleEditSave}
            disabled={isSaving}
            className='text-[#5865f2] hover:underline disabled:opacity-50'
          >
            save
          </button>
        </span>
      </div>
    </div>
  );

  if (!showHeader) {
    return (
      <div
        data-message-id={message.id}
        className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
      >
        {message.parentMessage && (
          <div className='ml-14 pt-1'>
            <ReplyBanner parentMessage={message.parentMessage} />
          </div>
        )}
        <div className='flex gap-4'>
          {!isEditing && actionBar}
          {/* Spacer aligns content with the 40px avatar of the header row */}
          <div className='w-10 flex-shrink-0 text-right'>
            <span className='invisible whitespace-nowrap text-[10px] text-gray-500 group-hover:visible group-focus-within:visible'>
              {formatTimeOnly(message.timestamp)}
            </span>
          </div>
          <div className='min-w-0 flex-1'>
            {isEditing ? (
              editUi
            ) : (
              <p className='whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
                {localContent ?? message.content}
                {(message.editedAt || localContent !== undefined) && (
                  <span className='ml-1 text-[10px] text-gray-500'>(edited)</span>
                )}
              </p>
            )}
            <AttachmentList attachments={message.attachments} />
            <ReactionList
                reactions={localReactions}
                messageId={message.id}
                userId={user?.id}
                onReactionClick={handleReactionToggle}
              />
            {localReplyCount > 0 && threadToggle}
          </div>
        </div>
        {threadView}
      </div>
    );
  }

  return (
    <div
      data-message-id={message.id}
      className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
    >
      {message.parentMessage && (
        <div className='ml-14 pt-1'>
          <ReplyBanner parentMessage={message.parentMessage} />
        </div>
      )}
      <div className='flex gap-4'>
        {!isEditing && actionBar}
        {/* Avatar */}
        <div className='mt-0.5 flex-shrink-0'>
          {message.author.avatarUrl && !avatarError ? (
            <Image
              src={message.author.avatarUrl}
              alt={message.author.username}
              width={40}
              height={40}
              unoptimized
              className='h-10 w-10 rounded-full'
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white'>
              {authorInitial}
            </div>
          )}
        </div>
        {/* Content */}
        <div className='min-w-0 flex-1'>
          <div className='flex items-baseline gap-2'>
            <span className={authorNameClass}>
              {message.author.displayName ?? message.author.username}
            </span>
            <span className='whitespace-nowrap text-[11px] text-gray-400'>
              {formatMessageTimestamp(message.timestamp)}
            </span>
            {(message.editedAt || localContent !== undefined) && (
              <span className='text-[10px] text-gray-500'>(edited)</span>
            )}
          </div>
          {isEditing ? (
            editUi
          ) : (
            <p className='mt-0.5 whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
              {localContent ?? message.content}
            </p>
          )}
          <AttachmentList attachments={message.attachments} />
          <ReactionList
                reactions={localReactions}
                messageId={message.id}
                userId={user?.id}
                onReactionClick={handleReactionToggle}
              />
          {localReplyCount > 0 && threadToggle}
        </div>
      </div>
      {threadView}
    </div>
  );
}
```

#### Tool: exec_command

```sh
nl -ba /Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/message/MessageItem.tsx | sed -n '190,260p'; nl -ba /Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/message/MessageItem.tsx | sed -n '700,770p'
```

Output:

```text
   190	type PinState = 'idle' | 'loading' | 'success' | 'error';
   191	
   192	/**
   193	 * Hover/focus-within action bar for a message.
   194	 * Reply triggers onReplyClick (opens thread for authenticated users).
   195	 * More (⋯) is rendered when canPin or isOwnMessage is true, and opens a
   196	 * dropdown with Pin/Unpin (canPin) and Edit Message (isOwnMessage).
   197	 */
   198	function ActionBar({
   199	  messageId,
   200	  serverId,
   201	  channelId,
   202	  canPin,
   203	  initialPinned,
   204	  isOwnMessage,
   205	  onEditClick,
   206	  onReplyClick,
   207	<<<<<<< HEAD
   208	  onPinActionStart,
   209	  onPinToggle,
   210	=======
   211	  onReactionAdd,
   212	>>>>>>> origin/main
   213	}: {
   214	  messageId: string;
   215	  serverId?: string;
   216	  channelId?: string;
   217	  canPin?: boolean;
   218	  initialPinned?: boolean;
   219	  isOwnMessage?: boolean;
   220	  onEditClick?: () => void;
   221	  onReplyClick?: () => void;
   222	<<<<<<< HEAD
   223	  onPinActionStart?: () => void;
   224	  onPinToggle?: (messageId: string, pinned: boolean) => void;
   225	=======
   226	  onReactionAdd?: (emoji: string) => void;
   227	>>>>>>> origin/main
   228	}) {
   229	  const { isAuthenticated } = useAuth();
   230	  const { showToast } = useToast();
   231	  const router = useRouter();
   232	  const pathname = usePathname();
   233	  const [isMoreOpen, setIsMoreOpen] = useState(false);
   234	  const [openUpward, setOpenUpward] = useState(false);
   235	  const [isPinned, setIsPinned] = useState(initialPinned ?? false);
   236	  const [pinState, setPinState] = useState<PinState>('idle');
   237	  const [pinErrorMsg, setPinErrorMsg] = useState('');
   238	  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   239	  const moreRef = useRef<HTMLDivElement>(null);
   240	  const emojiPickerRef = useRef<HTMLDivElement>(null);
   241	  const moreTriggerRef = useRef<HTMLButtonElement>(null);
   242	  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   243	  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   244	
   245	  // Close dropdown on outside click; clean up timers on unmount
   246	  useEffect(() => {
   247	    return () => {
   248	      if (successTimerRef.current) clearTimeout(successTimerRef.current);
   249	      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
   250	    };
   251	  }, []);
   252	
   253	  useEffect(() => {
   254	    if (!isMoreOpen) return;
   255	    function onClickOutside(e: MouseEvent) {
   256	      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
   257	        setIsMoreOpen(false);
   258	      }
   259	    }
   260	    document.addEventListener('mousedown', onClickOutside);
   700	        handleEditCancel();
   701	      }
   702	    },
   703	    [handleEditSave, handleEditCancel],
   704	  );
   705	
   706	  // Trim first to guard against empty-string usernames — || catches "" where ?? would not.
   707	  const trimmedUsername = message.author.username?.trim();
   708	  const authorInitial = trimmedUsername?.charAt(0)?.toUpperCase() || '?';
   709	
   710	  // TODO: Author name role coloring
   711	  // The Author type embedded in Message does not carry a role field —
   712	  // role lives on the User entity. When real auth/user data is wired up,
   713	  // pass the user's role here and map it to a colour:
   714	  //   owner → #f0b132 (gold), admin → #ed4245 (red),
   715	  //   moderator → #3ba55c (green), member/guest → text-white
   716	  const authorNameClass = 'cursor-pointer font-medium text-white hover:underline';
   717	
   718	  const handleReplyClick = useCallback(() => {
   719	    onReplyClick?.(message);
   720	  }, [onReplyClick, message]);
   721	
   722	  const actionBar = (
   723	    <ActionBar
   724	      messageId={message.id}
   725	      serverId={serverId}
   726	      channelId={message.channelId}
   727	      canPin={canPin}
   728	      initialPinned={!!message.pinned}
   729	      isOwnMessage={isOwnMessage}
   730	      onEditClick={handleEditClick}
   731	<<<<<<< HEAD
   732	      onReplyClick={handleReplyClick}
   733	      onPinActionStart={onPinActionStart}
   734	      onPinToggle={onPinToggle}
   735	=======
   736	      onReplyClick={isTopLevel ? handleReplyClick : undefined}
   737	      onReactionAdd={handleReactionAdd}
   738	>>>>>>> origin/main
   739	    />
   740	  );
   741	
   742	  const threadToggle =
   743	    isTopLevel && serverId ? (
   744	      <button
   745	        type='button'
   746	        onClick={() => setIsThreadOpen(v => !v)}
   747	        className='mt-1 flex items-center gap-1 text-xs text-[#5865f2] hover:underline'
   748	        aria-expanded={isThreadOpen}
   749	        aria-label={
   750	          isThreadOpen
   751	            ? 'Hide replies'
   752	            : `View ${localReplyCount} ${localReplyCount === 1 ? 'reply' : 'replies'}`
   753	        }
   754	      >
   755	        <svg className='h-3 w-3' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
   756	          <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
   757	        </svg>
   758	        {isThreadOpen
   759	          ? 'Hide replies'
   760	          : `${localReplyCount} ${localReplyCount === 1 ? 'reply' : 'replies'}`}
   761	      </button>
   762	    ) : null;
   763	
   764	  const threadView =
   765	    isTopLevel && isThreadOpen && serverId ? (
   766	      <ThreadView
   767	        parentMessage={message}
   768	        channelId={message.channelId}
   769	        serverId={serverId}
   770	        onReplyCountChange={delta => setLocalReplyCount(c => c + delta)}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:31:25.611Z

I’ve resolved the conflict by combining both change sets (reaction picker/thread behavior from `main` plus your pin-sidebar callbacks). I’m now validating no conflict markers remain, then running frontend lint/typecheck before finalizing the merge commit.

#### Tool: exec_command

```sh
rg -n "<<<<<<<|=======|>>>>>>>" /Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/message/MessageItem.tsx
```

Output:

```text

```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony status --short
```

Output:

```text
A  harmony-frontend/src/__tests__/issue-497-reaction-emoji-picker.test.tsx
A  harmony-frontend/src/__tests__/issue-505-reaction-toggle.test.tsx
M  harmony-frontend/src/__tests__/server-settings-access.test.ts
M  harmony-frontend/src/app/settings/[serverSlug]/settings-access.ts
UU harmony-frontend/src/components/message/MessageItem.tsx
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:31:32.810Z

I also see new files from `origin/main` in the merge state (expected). I’ll stage the resolved file and run checks focused on `MessageItem.tsx` plus a frontend typecheck before I commit the merge.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony add harmony-frontend/src/components/message/MessageItem.tsx
```

Output:

```text
fatal: Unable to create '/Users/allen/repos/Harmony/.git/worktrees/Harmony3/index.lock': Operation not permitted
```

#### Tool: exec_command

```sh
npx prettier --write src/components/message/MessageItem.tsx
```

Output:

```text
[warn] jsxBracketSameLine is deprecated.
src/components/message/MessageItem.tsx 94ms
```

#### Tool: exec_command

```sh
npx eslint src/components/message/MessageItem.tsx
```

Output:

```text

```

#### Tool: exec_command

```sh
npx tsc --noEmit
```

Output:

```text

```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:31:37.605Z

The code checks passed; only git index writes are sandbox-blocked. I’m staging the resolved file with elevated git permissions, then committing the merge and pushing.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony add harmony-frontend/src/components/message/MessageItem.tsx
```

Output:

```text

```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony status --short --branch
```

Output:

```text
## codex/issue-500-pin-sidebar-realtime-close-on-pin...origin/codex/issue-500-pin-sidebar-realtime-close-on-pin
A  harmony-frontend/src/__tests__/issue-497-reaction-emoji-picker.test.tsx
A  harmony-frontend/src/__tests__/issue-505-reaction-toggle.test.tsx
M  harmony-frontend/src/__tests__/server-settings-access.test.ts
M  harmony-frontend/src/app/settings/[serverSlug]/settings-access.ts
M  harmony-frontend/src/components/message/MessageItem.tsx
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony commit --no-edit
```

Output:

```text
[codex/issue-500-pin-sidebar-realtime-close-on-pin dada1c5] Merge remote-tracking branch 'origin/main' into codex/issue-500-pin-sidebar-realtime-close-on-pin
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:31:56.316Z

Merge conflict is committed locally. I’m pushing the updated branch so PR #548 is conflict-free on GitHub.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony push
```

Output:

```text
To github.com:CS485-Harmony/Harmony.git
   299b4ba..dada1c5  codex/issue-500-pin-sidebar-realtime-close-on-pin -> codex/issue-500-pin-sidebar-realtime-close-on-pin
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:32:08.646Z

Merge conflicts are resolved and pushed.

- Resolved conflict in [`MessageItem.tsx`](/Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/message/MessageItem.tsx) by preserving:
  - your pin-sidebar callbacks (`onPinActionStart`, `onPinToggle`)
  - incoming `main` behavior for reactions/thread reply handling (`onReactionAdd`, top-level reply action)
- Completed merge commit: `dada1c5`
- Pushed to branch: `codex/issue-500-pin-sidebar-realtime-close-on-pin`
- PR #548 is now updated and should no longer show merge conflicts.

Validation run after resolution:
- `npx prettier --write src/components/message/MessageItem.tsx`
- `npx eslint src/components/message/MessageItem.tsx`
- `npx tsc --noEmit`

### Turn 6: also fix the pr

#### 👤 User Prompt

- Time: 2026-04-29T15:32:08.789Z

```text
also fix the pr body
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:32:13.923Z

I’ll update PR #548’s description to reflect the current scope after the merge, with clear summary, verification, and issue linkage. I’m checking the current body first, then I’ll patch it.

#### Tool: exec_command

```sh
gh pr view 548 --repo CS485-Harmony/Harmony --json title,body,baseRefName,headRefName,url
```

Output:

```text
error connecting to api.github.com
check your internet connection or https://githubstatus.com
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony status --short --branch
```

Output:

```text
## codex/issue-500-pin-sidebar-realtime-close-on-pin...origin/codex/issue-500-pin-sidebar-realtime-close-on-pin
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:32:18.375Z

The GitHub CLI call failed due to network restrictions in this sandbox. I’m retrying with escalated permissions so I can fetch and edit the PR body directly.

#### Tool: exec_command

```sh
gh pr view 548 --repo CS485-Harmony/Harmony --json title,body,baseRefName,headRefName,url
```

Output:

```text
{"baseRefName":"main","body":"## Summary\\n- refresh pinned messages sidebar immediately after successful pin/unpin actions\\n- close the pinned sidebar as soon as pin/unpin is clicked\\n- refetch sidebar data when message pin state changes from real-time events\\n\\n## Files Changed\\n- harmony-frontend/src/components/layout/HarmonyShell.tsx\\n- harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx\\n- harmony-frontend/src/components/channel/MessageList.tsx\\n- harmony-frontend/src/components/message/MessageItem.tsx\\n\\n## Verification\\n- npx prettier --write on touched files\\n- npx eslint on touched files\\n- npx tsc --noEmit\\n\\n## Issue\\nCloses #500\\n\\n## Notes\\nI could not keep a local dev server running in this sandbox because binding to port 3000 is restricted here.","headRefName":"codex/issue-500-pin-sidebar-realtime-close-on-pin","title":"Fix #500: pinned sidebar real-time refresh + close-on-pin","url":"https://github.com/CS485-Harmony/Harmony/pull/548"}
```

#### Tool: exec_command

```sh
cat >/private/tmp/pr548-body.md <<'EOF'
## Summary
- fix pinned messages sidebar so it refreshes immediately after successful pin/unpin actions
- close the pinned sidebar as soon as the user clicks pin/unpin in message actions
- trigger sidebar refresh when real-time message edits change `pinned` state
- merge latest `main` and resolve `MessageItem.tsx` conflict while preserving reaction/thread behavior

## Main Changes
- `harmony-frontend/src/components/layout/HarmonyShell.tsx`
- `harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx`
- `harmony-frontend/src/components/channel/MessageList.tsx`
- `harmony-frontend/src/components/message/MessageItem.tsx`

## Verification
- `npx prettier --write src/components/channel/PinnedMessagesPanel.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx src/components/message/MessageItem.tsx`
- `npx eslint src/components/channel/PinnedMessagesPanel.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx src/components/message/MessageItem.tsx`
- `npx tsc --noEmit`

## Issue
Closes #500
EOF

gh pr edit 548 --repo CS485-Harmony/Harmony --body-file /private/tmp/pr548-body.md
```

Output:

```text
https://github.com/CS485-Harmony/Harmony/pull/548
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:32:43.827Z

Updated PR body for [#548](https://github.com/CS485-Harmony/Harmony/pull/548).

I corrected it to reflect:
- the real-time pin sidebar behavior fix
- close-on-pin behavior
- the merge-from-`main` conflict resolution context
- current verification commands and issue linkage (`Closes #500`)

### Turn 7: run the dev server locally for me so I can

#### 👤 User Prompt

- Time: 2026-04-29T15:34:25.920Z

```text
run the dev server locally for me so I can test
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:34:29.361Z

I’ll start the frontend dev server in `harmony-frontend` and leave it running so you can test in your browser.

#### Tool: exec_command

```sh
npm run dev
```

Output:

```text

> harmony-frontend@0.1.0 dev
> next dev

▲ Next.js 16.1.6 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://10.196.27.66:3000

✓ Starting...
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
✓ Ready in 635ms
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T15:35:07.521Z

Dev server is running الآن on:

- [http://localhost:3000](http://localhost:3000)

I’ll keep it running in the background session (`60218`). If you want, I can stop/restart it after you finish testing.

### Turn 8: pinning a message shouldn't close the pin panel. And the pinned

#### 👤 User Prompt

- Time: 2026-04-29T20:29:36.518Z

```text
pinning a message shouldn't close the pin panel. And the pinned messages button (that opens the pinned messages panel) still doesn't close the panel
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T20:30:02.501Z

Understood. I’ll remove the auto-close on pin/unpin action and then fix the top-bar pinned button so it truly toggles the panel open/closed on repeated clicks. I’m checking `TopBar` and `HarmonyShell` wiring now.

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/components/channel/TopBar.tsx
```

Output:

```text
[rtk] /!\ Hook outdated — run `rtk init -g` to update
/**
 * Channel Component: TopBar
 * Full-width navigation bar displayed above the message area.
 * Shows channel name/topic on the left and action icons on the right.
 * Ref: dev-spec-channel-visibility-toggle.md — C1.3 TopBar
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { truncate } from '@/lib/utils';
import type { Channel } from '@/types';

// ─── Icons (inline SVG to avoid extra dependencies) ──────────────────────────

function HashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <line x1='4' y1='9' x2='20' y2='9' />
      <line x1='4' y1='15' x2='20' y2='15' />
      <line x1='10' y1='3' x2='8' y2='21' />
      <line x1='16' y1='3' x2='14' y2='21' />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.35-4.35' />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

function MembersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-5 w-5', className)}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
    >
      <line x1='4' y1='6' x2='20' y2='6' />
      <line x1='4' y1='12' x2='20' y2='12' />
      <line x1='4' y1='18' x2='20' y2='18' />
    </svg>
  );
}

// ─── Icon button helper ───────────────────────────────────────────────────────

function IconButton({
  onClick,
  title,
  active,
  ariaPressed,
  disabled,
  children,
}: {
  onClick?: () => void;
  title: string;
  active?: boolean;
  /** Set for toggle buttons so screen readers announce pressed state */
  ariaPressed?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={ariaPressed}
      className={cn(
        'rounded p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        active ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/10 hover:text-gray-200',
      )}
    >
      {children}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface TopBarProps {
  /** The channel currently being viewed */
  channel: Pick<Channel, 'name' | 'topic' | 'slug'>;
  /** The server slug, used to build the settings link */
  serverSlug: string;
  /** Whether the current user has admin access (owner of the server) */
  isAdmin?: boolean;
  /** Whether the members sidebar is currently open */
  isMembersOpen?: boolean;
  /** Callback to toggle the members sidebar */
  onMembersToggle?: () => void;
  /** Whether the channel sidebar drawer is currently open (mobile) */
  isMenuOpen?: boolean;
  /** Callback to toggle the channel sidebar drawer (mobile) */
  onMenuToggle?: () => void;
  /** Callback fired when the search icon is clicked */
  onSearchOpen?: () => void;
  /** Callback fired when the pinned messages icon is clicked */
  onPinsOpen?: () => void;
  /** Disable actions that would reveal message content while the channel is locked. */
  disableMessageActions?: boolean;
}

export function TopBar({
  channel,
  serverSlug,
  isAdmin = false,
  isMembersOpen,
  onMembersToggle,
  isMenuOpen,
  onMenuToggle,
  onSearchOpen,
  onPinsOpen,
  disableMessageActions = false,
}: TopBarProps) {
  const settingsHref = `/settings/${serverSlug}/${channel.slug}`;

  return (
    <header className='flex h-12 items-center gap-2 border-b border-black/20 bg-[#36393f] px-4 shadow-sm'>
      {/* ── Hamburger (mobile only) ── */}
      <button
        onClick={onMenuToggle}
        aria-label='Open channel list'
        aria-expanded={isMenuOpen ?? false}
        className='rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-gray-200 sm:hidden'
      >
        <MenuIcon />
      </button>

      {/* ── Left: channel identity ── */}
      <div className='flex min-w-0 flex-1 items-center gap-2'>
        <HashIcon className='flex-shrink-0 text-gray-400' />
        <span className='truncate font-semibold text-white'>{channel.name}</span>

        {channel.topic && (
          <>
            <span className='hidden select-none text-gray-600 sm:inline'>|</span>
            <span className='hidden min-w-0 truncate text-sm text-gray-400 sm:block'>
              {truncate(channel.topic, 80)}
            </span>
          </>
        )}
      </div>

      {/* ── Right: action icons ── */}
      <div className='flex flex-shrink-0 items-center gap-0.5'>
        {/* Search */}
        <IconButton
          onClick={disableMessageActions ? undefined : onSearchOpen}
          title='Search'
          disabled={disableMessageActions}
        >
          <SearchIcon />
        </IconButton>

        {/* Pinned messages */}
        <IconButton
          onClick={disableMessageActions ? undefined : onPinsOpen}
          title='Pinned messages'
          disabled={disableMessageActions}
        >
          <PinIcon />
        </IconButton>

        {/* Members sidebar toggle */}
        <IconButton
          onClick={onMembersToggle}
          title='Show member list'
          active={isMembersOpen}
          ariaPressed={isMembersOpen}
        >
          <MembersIcon />
        </IconButton>

        {/* Settings gear — admin/owner only */}
        {isAdmin && (
          <Link
            href={settingsHref}
            title='Channel settings'
            aria-label='Channel settings'
            className='rounded p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200'
          >
            <GearIcon />
          </Link>
        )}
      </div>
    </header>
  );
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/components/layout/HarmonyShell.tsx
```

Output:

```text
/**
 * Layout: HarmonyShell
 * Full Discord-like 3-column layout shell.
 * Wires together ServerRail, ChannelSidebar, TopBar, MessageList, MembersSidebar, SearchModal.
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { TopBar } from '@/components/channel/TopBar';
import { MembersSidebar } from '@/components/channel/MembersSidebar';
import { SearchModal } from '@/components/channel/SearchModal';
import { PinnedMessagesPanel } from '@/components/channel/PinnedMessagesPanel';
import { ChannelSidebar } from '@/components/channel/ChannelSidebar';
import { MessageInput } from '@/components/channel/MessageInput';
import { MessageList } from '@/components/channel/MessageList';
import { ServerRail } from '@/components/server-rail/ServerRail';
import { GuestPromoBanner } from '@/components/channel/GuestPromoBanner';
import { CreateChannelModal } from '@/components/channel/CreateChannelModal';
import { useAuth } from '@/hooks/useAuth';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { BrowseServersModal } from '@/components/server-rail/BrowseServersModal';
import { useServerEvents } from '@/hooks/useServerEvents';
import { useServerListSync } from '@/hooks/useServerListSync';
import { ChannelType, ChannelVisibility, UserStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { CreateServerModal } from '@/components/server-rail/CreateServerModal';
import type { Server, Channel, Message, User } from '@/types';

// ─── Discord colour tokens ────────────────────────────────────────────────────

const BG = {
  tertiary: 'bg-[#202225]',
  primary: 'bg-[#36393f]',
};

// ─── useSyncExternalStore helpers — module-level so references are stable ─────
// React re-subscribes whenever the subscribe function reference changes. Inline
// arrow functions create a new reference every render, causing the MediaQueryList
// listener to be torn down and re-added on every message receive / state update.

const subscribeToViewport = (cb: () => void) => {
  const mql = window.matchMedia('(min-width: 640px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};
const getViewportSnapshot = () => window.matchMedia('(min-width: 640px)').matches;
const getServerViewportSnapshot = () => false;

// ─── Main Shell ───────────────────────────────────────────────────────────────

export interface HarmonyShellProps {
  servers: Server[];
  currentServer: Server;
  /** Channels belonging to the current server — used by ChannelSidebar */
  channels: Channel[];
  /**
   * All channels across every server — used by ServerRail to derive the
   * correct default channel slug when navigating to another server.
   * #c32: passing only serverChannels here caused other server icons to link
   * to a non-existent route because their channels weren't in the list.
   */
  allChannels: Channel[];
  currentChannel: Channel;
  messages: Message[];
  members: User[];
  /** Base path for navigation links. Use "/c" for public guest routes, "/channels" for authenticated routes. */
  basePath?: string;
  /** Optional replacement for the center chat pane while keeping the shell visible. */
  lockedMessagePane?: React.ReactNode;
}

export function HarmonyShell({
  servers,
  currentServer,
  channels,
  allChannels,
  currentChannel,
  messages,
  members,
  basePath = '/c',
  lockedMessagePane,
}: HarmonyShellProps) {
  const isChannelLocked = lockedMessagePane !== undefined;
  // Track the user's explicit toggle preference; null means "follow viewport default".
  const [membersOverride, setMembersOverride] = useState<boolean | null>(null);

  // useSyncExternalStore: SSR returns false (getServerSnapshot), client returns live viewport.
  // No useEffect setState needed — avoids both hydration mismatch and the linter rule.
  const isDesktopViewport = useSyncExternalStore(
    subscribeToViewport,
    getViewportSnapshot,
    getServerViewportSnapshot,
  );

  const isMembersOpen = membersOverride !== null ? membersOverride : isDesktopViewport;
  const setIsMembersOpen = useCallback((val: boolean) => setMembersOverride(val), []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPinsOpen, setIsPinsOpen] = useState(false);
  const [pinsRefreshKey, setPinsRefreshKey] = useState(0);
  // #c25: track mobile channel-sidebar state so aria-expanded on hamburger reflects reality
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Local message state so sent messages appear immediately without a page reload
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  // Track previous channel so we can reset localMessages synchronously on channel
  // switch — avoids a one-render flash where old messages show under the new channel header.
  const [prevChannelId, setPrevChannelId] = useState(currentChannel.id);
  if (prevChannelId !== currentChannel.id) {
    setPrevChannelId(currentChannel.id);
    setLocalMessages(messages);
    setIsMenuOpen(false);
    setIsPinsOpen(false);
    setReplyingTo(null);
    // Only auto-close the members sidebar on mobile so desktop keeps it open by default.
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 640px)').matches) {
      setIsMembersOpen(false);
    }
  }
  // Local channels state so newly created channels appear immediately in the sidebar.
  const [localChannels, setLocalChannels] = useState<Channel[]>(channels);
  // Map of serverId → default channel slug — used by BrowseServersModal for "Open" navigation.
  // Mirrors the same derivation in ServerRail so both always agree on the default channel.
  const defaultChannelByServerId = useMemo(() => {
    const map = new Map<string, string>();
    const textOrAnnouncement = allChannels
      .filter(c => c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT)
      .sort((a, b) => a.position - b.position);
    for (const channel of textOrAnnouncement) {
      if (!map.has(channel.serverId)) map.set(channel.serverId, channel.slug);
    }
    return map;
  }, [allChannels]);

  // Stable list of voice channel IDs for VoiceProvider — recomputed only when channels change.
  const voiceChannelIds = useMemo(
    () => localChannels.filter(c => c.type === ChannelType.VOICE).map(c => c.id),
    [localChannels],
  );
  // Track the channels prop reference so localChannels resets whenever the server
  // passes a fresh array (server navigation or revalidatePath refresh) — same
  // render-time derivation pattern used above for localMessages/prevChannelId.
  const [prevChannelsProp, setPrevChannelsProp] = useState(channels);
  if (prevChannelsProp !== channels) {
    setPrevChannelsProp(channels);
    setLocalChannels(channels);
  }
  // Local members state so join/leave/status events update the sidebar without reload.
  const [localMembers, setLocalMembers] = useState<User[]>(members);
  // Reset when the members prop changes (server navigation or SSR revalidation).
  const [prevMembersProp, setPrevMembersProp] = useState(members);
  if (prevMembersProp !== members) {
    setPrevMembersProp(members);
    setLocalMembers(members);
  }
  // Channel creation modal state.
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [createChannelDefaultType, setCreateChannelDefaultType] = useState<ChannelType>(
    ChannelType.TEXT,
  );

  const {
    user: authUser,
    isAuthenticated,
    isLoading: isAuthLoading,
    isAdmin: checkIsAdmin,
  } = useAuth();

  const router = useRouter();
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isBrowseServersOpen, setIsBrowseServersOpen] = useState(false);
  const [localServers, setLocalServers] = useState<Server[]>(servers);
  const [prevServers, setPrevServers] = useState<Server[]>(servers);
  if (prevServers !== servers) {
    setPrevServers(servers);
    setLocalServers(servers);
  }

  const { notifyServerCreated, notifyServerJoined } = useServerListSync();

  const currentMemberRecord = useMemo(
    () => localMembers.find(m => m.id === authUser?.id),
    [localMembers, authUser?.id],
  );

  // Fallback for guest/unauthenticated view.
  const currentUser: User = authUser
    ? {
        ...authUser,
        status: currentMemberRecord?.status ?? authUser.status,
        role: currentMemberRecord?.role ?? authUser.role,
      }
    : {
        id: 'guest',
        username: 'Guest',
        displayName: 'Guest',
        status: 'online',
        role: 'guest',
      };

  // Show the pin UI only to users with MODERATOR+ server-scoped role, and never
  // while the channel is locked (pinning would be meaningless/unauthorized anyway).
  // localMembers is populated by toFrontendMember() in serverService.ts, which maps
  // the backend ServerMember.role field (server-scoped) to User.role.
  // System admins bypass membership checks — they are authorized server-side regardless.
  const canPin = useMemo(
    () =>
      isAuthenticated &&
      !isChannelLocked &&
      (authUser?.isSystemAdmin ||
        currentMemberRecord?.role === 'owner' ||
        currentMemberRecord?.role === 'admin' ||
        currentMemberRecord?.role === 'moderator'),
    [isAuthenticated, isChannelLocked, authUser?.isSystemAdmin, currentMemberRecord?.role],
  );

  const handleServerCreated = useCallback(
    (server: Server, defaultChannel: Channel) => {
      setLocalServers(prev => [...prev, server]);
      notifyServerCreated(server.id);
      router.push(`${basePath}/${server.slug}/${defaultChannel.slug}`);
    },
    [basePath, notifyServerCreated, router],
  );

  // notifyServerJoined is a stable reference from useServerListSync — pass directly.
  // Other tabs receive the broadcast and call router.refresh(); the current tab
  // navigates to the new server route which re-renders with the updated servers prop.

  const handleReplyClick = useCallback((message: Message) => {
    setReplyingTo(message);
  }, []);

  const handlePinActionStart = useCallback(() => {
    setIsPinsOpen(false);
  }, []);

  const handlePinToggle = useCallback((messageId: string, pinned: boolean) => {
    setLocalMessages(prev =>
      prev.map(message => (message.id === messageId ? { ...message, pinned } : message)),
    );
    setPinsRefreshKey(prev => prev + 1);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleMessageSent = useCallback((msg: Message) => {
    // Dedup: the SSE event for the sender's own message can arrive before the tRPC
    // response (Redis pub/sub on the same backend + established SSE connection beats
    // the HTTP round-trip). Without this check, the message would be added twice.
    setLocalMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    setReplyingTo(null);
  }, []);

  // ── Real-time SSE handlers ────────────────────────────────────────────────

  const handleRealTimeCreated = useCallback(
    (msg: Message) => {
      // Filter: server endpoint delivers messages for all channels; only update
      // localMessages for the channel currently in view.
      if (msg.channelId !== currentChannel.id) return;
      // Dedup: skip if the message was already optimistically added (e.g. sent by this client)
      setLocalMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    },
    [currentChannel.id],
  );

  const handleRealTimeEdited = useCallback(
    (msg: Message) => {
      if (msg.channelId !== currentChannel.id) return;
      let pinStateChanged = false;
      setLocalMessages(prev =>
        prev.map(m => {
          if (m.id !== msg.id) return m;
          pinStateChanged = Boolean(m.pinned) !== Boolean(msg.pinned);
          return msg;
        }),
      );
      if (pinStateChanged) setPinsRefreshKey(prev => prev + 1);
    },
    [currentChannel.id],
  );

  const handleRealTimeDeleted = useCallback(
    (messageId: string, channelId: string) => {
      if (channelId !== currentChannel.id) return;
      setLocalMessages(prev => prev.filter(m => m.id !== messageId));
    },
    [currentChannel.id],
  );

  const handleServerUpdated = useCallback((updatedServer: Server) => {
    setLocalServers(prev =>
      prev.map(s => (s.id === updatedServer.id ? { ...s, ...updatedServer } : s)),
    );
  }, []);

  // ── Real-time channel list updates ────────────────────────────────────────

  const handleChannelCreated = useCallback((channel: Channel) => {
    setLocalChannels(prev => {
      // Dedup: ignore if already in list (e.g. added optimistically by the creator)
      if (prev.some(c => c.id === channel.id)) return prev;
      // Insert before VOICE channels so text/announcement channels stay grouped
      const insertIdx =
        channel.type === ChannelType.VOICE
          ? prev.length
          : prev.findIndex(c => c.type === ChannelType.VOICE);
      const at = insertIdx === -1 ? prev.length : insertIdx;
      return [...prev.slice(0, at), channel, ...prev.slice(at)];
    });
  }, []);

  const handleChannelUpdated = useCallback((channel: Channel) => {
    setLocalChannels(prev => prev.map(c => (c.id === channel.id ? channel : c)));
  }, []);

  const handleChannelDeleted = useCallback(
    (channelId: string) => {
      setLocalChannels(prev => prev.filter(c => c.id !== channelId));
      // Navigate away if the deleted channel is the one currently viewed
      if (channelId === currentChannel.id) {
        router.push(`${basePath}/${currentServer.slug}`);
      }
    },
    [currentChannel.id, currentServer.slug, basePath, router],
  );

  // ── Real-time member list updates ─────────────────────────────────────────

  const handleMemberJoined = useCallback((user: User) => {
    setLocalMembers(prev => {
      // Dedup: ignore if the user is already in the list
      if (prev.some(m => m.id === user.id)) return prev;
      return [...prev, user];
    });
  }, []);

  const handleMemberLeft = useCallback((userId: string) => {
    setLocalMembers(prev => prev.filter(m => m.id !== userId));
  }, []);

  const handleMemberStatusChanged = useCallback(
    ({ id, status }: { id: string; status: UserStatus }) => {
      setLocalMembers(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
    },
    [],
  );

  const authUserStatusKey = authUser ? `${authUser.id}:${authUser.status}:${authUser.role}` : null;
  const [prevAuthUserStatusKey, setPrevAuthUserStatusKey] = useState(authUserStatusKey);
  if (authUserStatusKey !== prevAuthUserStatusKey) {
    setPrevAuthUserStatusKey(authUserStatusKey);
    if (authUser?.id) {
      setLocalMembers(prev =>
        prev.map(m =>
          m.id === authUser.id ? { ...m, status: authUser.status, role: authUser.role } : m,
        ),
      );
    }
  }

  // ── Real-time visibility changes ──────────────────────────────────────────

  const handleChannelVisibilityChanged = useCallback(
    (channel: Channel, oldVisibility: ChannelVisibility) => {
      // Update the channel's visibility in the sidebar immediately.
      setLocalChannels(prev => prev.map(c => (c.id === channel.id ? channel : c)));

      // If the current user is viewing this channel and it just became PRIVATE,
      // redirect non-admin members to the server root so VisibilityGuard can
      // gate access on re-render. Server owners and admins are not redirected
      // because they retain access to PRIVATE channels.
      // Note: useServerEvents is only enabled for authenticated users, so this
      // callback only fires for authenticated sessions.
      //
      // checkIsAdmin(ownerId) covers t[rtk] /!\ Hook outdated — run `rtk init -g` to update
he server owner and system admins.
      // We look up the member record for the current user to check their
      // server-scoped role ('owner'/'admin') because checkIsAdmin() with no arg
      // checks AuthContext user.role, which is always 'member' for non-system-admin
      // users (mapBackendUser sets role: 'member' for all non-system-admin users).
      const memberRecord = localMembers.find(m => m.id === authUser?.id);
      const userIsAdminOrOwner =
        checkIsAdmin(currentServer.ownerId) ||
        memberRecord?.role === 'owner' ||
        memberRecord?.role === 'admin';
      if (
        channel.id === currentChannel.id &&
        oldVisibility !== ChannelVisibility.PRIVATE &&
        channel.visibility === ChannelVisibility.PRIVATE &&
        !userIsAdminOrOwner
      ) {
        router.push(`${basePath}/${currentServer.slug}`);
      }
    },
    [
      currentChannel.id,
      checkIsAdmin,
      currentServer.ownerId,
      basePath,
      currentServer.slug,
      router,
      localMembers,
      authUser?.id,
    ],
  );

  useServerEvents({
    serverId: currentServer.id,
    onChannelCreated: handleChannelCreated,
    onChannelUpdated: handleChannelUpdated,
    onChannelDeleted: handleChannelDeleted,
    onMemberJoined: handleMemberJoined,
    onMemberLeft: handleMemberLeft,
    onMemberStatusChanged: handleMemberStatusChanged,
    onChannelVisibilityChanged: handleChannelVisibilityChanged,
    // Message callbacks are disabled when the channel is locked (same guard as the
    // former useChannelEvents call) so locked guests don't accumulate stale state.
    onMessageCreated: isChannelLocked ? undefined : handleRealTimeCreated,
    onMessageEdited: isChannelLocked ? undefined : handleRealTimeEdited,
    onMessageDeleted: isChannelLocked ? undefined : handleRealTimeDeleted,
    onServerUpdated: handleServerUpdated,
    enabled: isAuthenticated,
  });

  // #c10/#c23: single global Ctrl+K / Cmd+K handler — SearchModal no longer needs its own
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isChannelLocked) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(v => !v);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isChannelLocked]);

  return (
    <VoiceProvider serverId={currentServer.id} voiceChannelIds={voiceChannelIds}>
      <div className='flex h-screen overflow-hidden bg-[#202225] font-sans'>
        {/* Skip-to-content: visually hidden, appears on keyboard focus (WCAG 2.4.1) */}
        <a
          href='#main-content'
          className='sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-50 focus-visible:m-2 focus-visible:rounded focus-visible:bg-[#5865f2] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline-none'
        >
          Skip to content
        </a>

        {/* 1. Server rail — uses allChannels (full set) to derive default slug per server */}
        <ServerRail
          servers={localServers}
          allChannels={allChannels}
          currentServerId={currentServer.id}
          basePath={basePath}
          isMobileVisible={isMenuOpen}
          onBrowseServers={() => setIsBrowseServersOpen(true)}
          onAddServer={
            isAuthLoading
              ? undefined
              : () => {
                  if (!isAuthenticated) {
                    router.push('/auth/login');
                    return;
                  }
                  setIsCreateServerOpen(true);
                }
          }
        />

        {/* 2. Channel sidebar — mobile overlay when isMenuOpen, always visible on desktop */}
        <ChannelSidebar
          server={currentServer}
          channels={localChannels}
          currentChannelId={currentChannel.id}
          currentUser={currentUser}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          basePath={basePath}
          isAuthenticated={isAuthenticated}
          serverId={currentServer.id}
          members={members}
          onCreateChannel={defaultType => {
            setCreateChannelDefaultType(defaultType);
            setIsCreateChannelOpen(true);
          }}
        />

        {/* 3. Main column */}
        <main
          id='main-content'
          className='flex flex-1 flex-col overflow-hidden'
          aria-label={`${currentChannel.name} channel`}
          tabIndex={-1}
        >
          <TopBar
            channel={currentChannel}
            serverSlug={currentServer.slug}
            isAdmin={checkIsAdmin(currentServer.ownerId)}
            isMembersOpen={isMembersOpen}
            onMembersToggle={() => setIsMembersOpen(!isMembersOpen)}
            onSearchOpen={isChannelLocked ? undefined : () => setIsSearchOpen(true)}
            onPinsOpen={isChannelLocked ? undefined : () => setIsPinsOpen(true)}
            disableMessageActions={isChannelLocked}
            isMenuOpen={isMenuOpen}
            onMenuToggle={() => setIsMenuOpen(v => !v)}
          />

          <div className='flex flex-1 overflow-hidden'>
            <div className={cn('flex flex-1 flex-col overflow-hidden', BG.primary)}>
              {lockedMessagePane ? (
                lockedMessagePane
              ) : (
                <>
                  <MessageList
                    key={currentChannel.id}
                    channel={currentChannel}
                    messages={localMessages}
                    serverId={currentServer.id}
                    canPin={canPin}
                    onReplyClick={handleReplyClick}
                    onPinActionStart={handlePinActionStart}
                    onPinToggle={handlePinToggle}
                  />
                  <MessageInput
                    channelId={currentChannel.id}
                    channelName={currentChannel.name}
                    serverId={currentServer.id}
                    isReadOnly={currentUser.role === 'guest'}
                    onMessageSent={handleMessageSent}
                    replyingTo={replyingTo}
                    onCancelReply={handleCancelReply}
                  />
                  {!isAuthLoading && !isAuthenticated && (
                    <GuestPromoBanner
                      serverName={currentServer.name}
                      memberCount={currentServer.memberCount ?? members.length}
                    />
                  )}
                </>
              )}
            </div>
            {!isChannelLocked && (
              <PinnedMessagesPanel
                channelId={currentChannel.id}
                serverId={currentServer.id}
                channelName={currentChannel.name}
                isOpen={isPinsOpen}
                refreshKey={pinsRefreshKey}
                onClose={() => setIsPinsOpen(false)}
              />
            )}
            <MembersSidebar
              members={localMembers}
              isOpen={isMembersOpen}
              onClose={() => setIsMembersOpen(false)}
            />
          </div>
        </main>

        <CreateServerModal
          isOpen={isCreateServerOpen}
          onClose={() => setIsCreateServerOpen(false)}
          onCreated={handleServerCreated}
        />

        <BrowseServersModal
          isOpen={isBrowseServersOpen}
          onClose={() => setIsBrowseServersOpen(false)}
          joinedServerIds={new Set(localServers.map(s => s.id))}
          defaultChannelByServerId={defaultChannelByServerId}
          basePath={basePath}
          onJoined={notifyServerJoined}
        />

        {!isChannelLocked && (
          <SearchModal
            messages={localMessages}
            channelName={currentChannel.name}
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}

        {isCreateChannelOpen && (
          <CreateChannelModal
            serverId={currentServer.id}
            serverSlug={currentServer.slug}
            existingChannels={localChannels}
            defaultType={createChannelDefaultType}
            onCreated={newChannel =>
              setLocalChannels(prev => {
                // Insert before voice channels so text/announcement channels stay grouped correctly.
                const insertIdx =
                  newChannel.type === ChannelType.VOICE
                    ? prev.length
                    : prev.findIndex(c => c.type === ChannelType.VOICE);
                const at = insertIdx === -1 ? prev.length : insertIdx;
                return [...prev.slice(0, at), newChannel, ...prev.slice(at)];
              })
            }
            onClose={() => setIsCreateChannelOpen(false)}
          />
        )}
      </div>
    </VoiceProvider>
  );
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/components/message/MessageItem.tsx
```

Output:

```text
[rtk] /!\ Hook outdated — run `rtk init -g` to update
/**
 * Component: MessageItem
 * Individual message row matching Discord's message style.
 * Supports a full variant (avatar + author + timestamp + content) and a
 * compact variant (no avatar/name) for grouped follow-up messages.
 *
 * ActionBar: appears on hover/focus. Shows Reply (functional) and Add Reaction
 * stub for all users. Shows a "More" (⋯) dropdown with "Pin/Unpin Message" for
 * users with message:pin permission (MODERATOR, ADMIN, OWNER), and "Edit
 * Message" for the message's own author.
 *
 * Replies: messages with a parentMessage show a Discord-style inline reply
 * banner above the content. Clicking the banner scrolls to the parent message.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { cn, formatMessageTimestamp, formatTimeOnly } from '@/lib/utils';
import { pinMessageAction, unpinMessageAction } from '@/app/actions/pinMessage';
import { editMessageAction } from '@/app/actions/editMessage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ThreadView } from '@/components/message/ThreadView';
import { apiClient } from '@/lib/api-client';
import type { Message, Reaction } from '@/types';

const EmojiPickerPopover = dynamic(
  () =>
    import('@/components/channel/EmojiPickerPopover').then(m => ({
      default: m.EmojiPickerPopover,
    })),
  { ssr: false },
);

// ─── AttachmentList ───────────────────────────────────────────────────────────

function AttachmentList({ attachments }: { attachments: Message['attachments'] }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className='mt-1.5 flex flex-col gap-2'>
      {attachments.map(a => {
        const isImage = a.type?.startsWith('image/');
        if (isImage) {
          return (
            <a
              key={a.id}
              href={a.url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block max-w-sm'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.url} alt={a.filename} className='max-h-64 rounded-md object-contain' />
            </a>
          );
        }
        return (
          <a
            key={a.id}
            href={a.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-blue-400 hover:bg-white/10 hover:text-blue-300 transition-colors w-fit'
          >
            <svg
              className='h-4 w-4 flex-shrink-0'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              aria-hidden='true'
            >
              <path d='M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48' />
            </svg>
            <span className='truncate max-w-xs'>{a.filename}</span>
          </a>
        );
      })}
    </div>
  );
}

// ─── ReactionList ─────────────────────────────────────────────────────────────

function ReactionList({
  reactions,
  messageId,
  userId,
  onReactionClick,
}: {
  reactions: Reaction[];
  messageId: string;
  userId?: string;
  onReactionClick?: (emoji: string, alreadyReacted: boolean) => void;
}) {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div className='mt-1 flex flex-wrap gap-1'>
      {reactions.map(r => {
        const alreadyReacted = !!userId && r.userIds.includes(userId);
        return (
          <button
            key={`${r.emoji}-${messageId}`}
            type='button'
            aria-label={`React with ${r.emoji} (${r.count} ${r.count !== 1 ? 'reactions' : 'reaction'})${alreadyReacted ? ' — click to remove' : ''}`}
            aria-pressed={alreadyReacted}
            onClick={() => onReactionClick?.(r.emoji, alreadyReacted)}
            className={cn(
              'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors',
              alreadyReacted
                ? 'border-[#5865f2]/60 bg-[#5865f2]/20 text-[#5865f2] hover:bg-[#5865f2]/30'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10',
            )}
          >
            <span>{r.emoji}</span>
            <span>{r.count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── ReplyBanner ──────────────────────────────────────────────────────────────

function ReplyBanner({ parentMessage }: { parentMessage: NonNullable<Message['parentMessage']> }) {
  const handleClick = () => {
    const el = document.querySelector(`[data-message-id="${parentMessage.id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const label = parentMessage.isDeleted
    ? 'Original message deleted'
    : `${parentMessage.author.displayName ?? parentMessage.author.username}: ${parentMessage.content}`;

  return (
    <button
      type='button'
      onClick={handleClick}
      title={label}
      className='mb-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors max-w-full'
      aria-label={`Jump to replied message from ${parentMessage.author.displayName ?? parentMessage.author.username}`}
    >
      <svg
        className='h-3 w-3 flex-shrink-0 rotate-180'
        viewBox='0 0 24 24'
        fill='currentColor'
        aria-hidden='true'
      >
        <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
      </svg>
      {parentMessage.isDeleted ? (
        <span className='italic text-gray-500'>Original message deleted</span>
      ) : (
        <>
          <span className='font-medium text-gray-300 flex-shrink-0'>
            {parentMessage.author.displayName ?? parentMessage.author.username}
          </span>
          <span className='min-w-0 truncate'>{parentMessage.content}</span>
        </>
      )}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PinMenuIcon() {
  return (
    <svg
      className='h-3.5 w-3.5 flex-shrink-0'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      aria-hidden='true'
    >
      <path d='M12 17v5' />
      <path d='M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z' />
    </svg>
  );
}

// ─── Hover action bar ─────────────────────────────────────────────────────────

type PinState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Hover/focus-within action bar for a message.
 * Reply triggers onReplyClick (opens thread for authenticated users).
 * More (⋯) is rendered when canPin or isOwnMessage is true, and opens a
 * dropdown with Pin/Unpin (canPin) and Edit Message (isOwnMessage).
 */
function ActionBar({
  messageId,
  serverId,
  channelId,
  canPin,
  initialPinned,
  isOwnMessage,
  onEditClick,
  onReplyClick,
  onPinActionStart,
  onPinToggle,
  onReactionAdd,
}: {
  messageId: string;
  serverId?: string;
  channelId?: string;
  canPin?: boolean;
  initialPinned?: boolean;
  isOwnMessage?: boolean;
  onEditClick?: () => void;
  onReplyClick?: () => void;
  onPinActionStart?: () => void;
  onPinToggle?: (messageId: string, pinned: boolean) => void;
  onReactionAdd?: (emoji: string) => void;
}) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [isPinned, setIsPinned] = useState(initialPinned ?? false);
  const [pinState, setPinState] = useState<PinState>('idle');
  const [pinErrorMsg, setPinErrorMsg] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click; clean up timers on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isMoreOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isMoreOpen]);

  useEffect(() => {
    if (!showEmojiPicker) return;
    function onClickOutside(e: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiSelect = useCallback(
    async (emoji: { native: string }) => {
      setShowEmojiPicker(false);
      if (!channelId || !serverId) return;
      try {
        await apiClient.trpcMutation('reaction.addReaction', {
          serverId,
          channelId,
          messageId,
          emoji: emoji.native,
        });
        onReactionAdd?.(emoji.native);
      } catch (err: unknown) {
        const code = (err as { response?: { data?: { error?: { json?: { code?: string } } } } })
          ?.response?.data?.error?.json?.code;
        if (code !== 'CONFLICT') {
          showToast({ message: 'Failed to add reaction. Please try again.', type: 'error' });
        }
      }
    },
    [channelId, serverId, messageId, onReactionAdd, showToast],
  );

  const handlePinToggle = useCallback(async () => {
    if (!serverId) return;
    const nextPinned = !isPinned;
    onPinActionStart?.();
    setIsMoreOpen(false);
    setPinState('loading');
    const verb = isPinned ? 'unpin' : 'pin';
    try {
      const result = isPinned
        ? await unpinMessageAction(messageId, serverId)
        : await pinMessageAction(messageId, serverId);
      if (result.ok) {
        setIsPinned(nextPinned);
        onPinToggle?.(messageId, nextPinned);
        setPinState('success');
        if (successTimerRef.current) clearTimeout(successTimerRef.current);
        successTimerRef.current = setTimeout(() => setPinState('idle'), 2000);
      } else {
        const msg = result.forbidden
          ? `You don't have permission to ${verb} messages.`
          : `Failed to ${verb} message. Please try again.`;
        setPinErrorMsg(msg);
        setPinState('error');
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => {
          setPinState('idle');
          setPinErrorMsg('');
        }, 3000);
      }
    } catch {
      const msg = `Failed to ${verb} message. Please try again.`;
      setPinErrorMsg(msg);
      setPinState('error');
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setPinState('idle');
        setPinErrorMsg('');
      }, 3000);
    }
  }, [isPinned, messageId, onPinActionStart, onPinToggle, serverId]);

  return (
    <div className='absolute -top-3 right-4 z-10 flex items-center rounded-md border border-white/10 bg-[#2f3136] shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'>
      {/* Inline pin feedback */}
      {pinState === 'success' && (
        <span className='px-2 text-xs text-green-400'>{isPinned ? '📌 Pinned' : 'Unpinned'}</span>
      )}
      {pinState === 'error' && <span className='px-2 text-xs text-red-400'>{pinErrorMsg}</span>}

      {/* Reply — redirects guests to login; opens thread for authenticated users */}
      <button
        type='button'
        aria-label='Reply'
        title='Reply'
        onClick={
          !isAuthenticated
            ? () => router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
            : onReplyClick
        }
        className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
      >
        <svg
          className='h-4 w-4'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
          focusable='false'
        >
          <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
        </svg>
      </button>

      {/* Add Reaction — redirects guests to login; opens emoji picker for authenticated users */}
      <div ref={emojiPickerRef} className='relative'>
        <button
          type='button'
          aria-label='Add Reaction'
          title='Add Reaction'
          aria-expanded={isAuthenticated ? showEmojiPicker : undefined}
          aria-haspopup={isAuthenticated ? 'dialog' : undefined}
          onClick={
            !isAuthenticated
              ? () => router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
              : () => setShowEmojiPicker(prev => !prev)
          }
          className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
        >
          <svg
            className='h-4 w-4'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-3.5-9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.476 2.37a.75.75 0 0 0-1.06-1.06 4.5 4.5 0 0 1-6.832 0 .75.75 0 0 0-1.061 1.06 6 6 0 0 0 8.953 0z' />
          </svg>
        </button>
        {isAuthenticated && showEmojiPicker && (
          <div
            role='dialog'
            aria-label='Emoji picker'
            className='absolute bottom-full right-0 z-50 mb-2'
          >
            <EmojiPickerPopover onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>

      {/* More — rendered when user can pin or is the message author */}
      {(canPin || isOwnMessage) && (
        <div ref={moreRef} className='relative'>
          <button
            type='button'
            aria-label='More actions'
            title='More'
            ref={moreTriggerRef}
            aria-expanded={isMoreOpen}
            onClick={() => {
              if (!isMoreOpen && moreTriggerRef.current) {
                const rect = moreTriggerRef.current.getBoundingClientRect();
                setOpenUpward(window.innerHeight - rect.bottom < 180);
              }
              setIsMoreOpen(v => !v);
            }}
            className='flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors'
          >
            <svg
              className='h-4 w-4'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
              focusable='false'
            >
              <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
            </svg>
          </button>

          {isMoreOpen && (
            <div
              className={`absolute right-0 min-w-[160px] rounded-md border border-white/10 bg-[#18191c] py-1 shadow-xl z-20 ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}
            >
              {isOwnMessage && (
                <button
                  type='button'
                  onClick={() => {
                    setIsMoreOpen(false);
                    onEditClick?.();
                  }}
                  className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white transition-colors'
                >
                  <svg
                    className='h-3.5 w-3.5 flex-shrink-0'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    aria-hidden='true'
                  >
                    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                    <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                  </svg>
                  Edit Message
                </button>
              )}
              {canPin && (
                <button
                  type='button'
                  onClick={handlePinToggle}
                  disabled={pinState === 'loading'}
                  className='flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-200 hover:bg-[#5865f2] hover:text-white disabled:opacity-50 transition-colors'
                >
                  <PinMenuIcon />
                  {isPinned ? 'Unpin Message' : 'Pin Message'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MessageItem ──────────────────────────────────────────────────────────────

export function MessageItem({
  message,
  showHeader = true,
  canPin,
  serverId,
  onReplyClick,
  onPinActionStart,
  onPinToggle,
}: {
  message: Message;
  /** Set to false for grouped follow-up messages from the same author. Hides the avatar and author line. */
  showHeader?: boolean;
  /** When true, shows the pin/unpin option in the action bar. Grant to MODERATOR+. */
  canPin?: boolean;
  /** Required for pin actions. Passed alongside canPin. */
  serverId?: string;
  /** Called when the user clicks Reply on this message. */
  onReplyClick?: (message: Message) => void;
  /** Called as soon as the user clicks pin/unpin for this message. */
  onPinActionStart?: () => void;
  /** Called when the user triggers a pin/unpin action for this message. */
  onPinToggle?: (messageId: string, pinned: boolean) => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [avatarError, setAvatarError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);
  const [localContent, setLocalContent] = useState<string | undefined>(undefined);
  const [localReactions, setLocalReactions] = useState<Reaction[]>(message.reactions ?? []);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const isTopLevel = !message.parentMessageId;
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [localReplyCount, setLocalReplyCount] = useState(message.replyCount ?? 0);

  // Render-phase derived-state reset: when the avatar URL changes (including A→B→A),
  // reset avatarError so the new URL is always attempted.
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(message.author.avatarUrl);
  if (prevAvatarUrl !== message.author.avatarUrl) {
    setPrevAvatarUrl(message.author.avatarUrl);
    if (avatarError) setAvatarError(false);
  }

  // Keep editContent in sync when message content changes externally (e.g. via SSE)
  const [prevContent, setPrevContent] = useState(message.content);
  if (!isEditing && prevContent !== message.content) {
    setPrevContent(message.content);
    setEditContent(message.content);
    if (localContent !== undefined) setLocalContent(undefined);
  }

  // Sync localReactions when message.reactions changes externally (e.g. via SSE)
  const [prevReactions, setPrevReactions] = useState(message.reactions);
  if (prevReactions !== message.reactions) {
    setPrevReactions(message.reactions);
    setLocalReactions(message.reactions ?? []);
  }

  const isOwnMessage = !!user && user.id === message.author.id;

  const handleReactionAdd = useCallback(
    (emoji: string) => {
      setLocalReactions(prev => {
        const existing = prev.find(r => r.emoji === emoji);
        if (existing) {
          return prev.map(r =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: r.count + 1,
                  userIds: user?.id ? [...r.userIds, user.id] : r.userIds,
                }
              : r,
          );
        }
        return [...prev, { emoji, count: 1, userIds: user?.id ? [user.id] : [] }];
      });
    },
    [user],
  );

  // Called when user clicks an existing reaction pill to add or remove their reaction.
  const handleReactionToggle = useCallback(
    async (emoji: string, alreadyReacted: boolean) => {
      if (!isAuthenticated) {
        router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!serverId) return;

      const channelId = message.channelId;
      const messageId = message.id;
      const uid = user?.id;

      if (alreadyReacted) {
        // Optimistic remove
        setLocalReactions(prev =>
          prev
            .map(r =>
              r.emoji === emoji
                ? { ...r, count: r.count - 1, userIds: r.userIds.filter(id => id !== uid) }
                : r,
            )
            .filter(r => r.count > 0),
        );
        try {
          await apiClient.trpcMutation('reaction.removeReaction', {
            serverId,
            channelId,
            messageId,
            emoji,
          });
        } catch {
          // Revert: add the reaction back
          setLocalReactions(prev => {
            const existing = prev.find(r => r.emoji === emoji);
            if (existing) {
              return prev.map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, userIds: uid ? [...r.userIds, uid] : r.userIds }
                  : r,
              );
            }
            return [...prev, { emoji, count: 1, userIds: uid ? [uid] : [] }];
          });
          showToast({ message: 'Failed to remove reaction. Please try again.', type: 'error' });
        }
      } else {
        // Optimistic add
        setLocalReactions(prev => {
          const existing = prev.find(r => r.emoji === emoji);
          if (existing) {
            return prev.map(r =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, userIds: uid ? [...r.userIds, uid] : r.userIds }
                : r,
            );
          }
          return [...prev, { emoji, count: 1, userIds: uid ? [uid] : [] }];
        });
        try {
          await apiClient.trpcMutation('reaction.addReaction', {
            serverId,
            channelId,
            messageId,
            emoji,
          });
        } catch (err: unknown) {
          const code = (err as { response?: { data?: { error?: { json?: { code?: string } } } } })
            ?.response?.data?.error?.json?.code;
          if (code === 'CONFLICT') return; // already reacted — optimistic state is correct
          // Revert: remove the optimistic reaction
          setLocalReactions(prev =>
            prev
              .map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.count - 1, userIds: r.userIds.filter(id => id !== uid) }
                  : r,
              )
              .filter(r => r.count > 0),
          );
          showToast({ message: 'Failed to add reaction. Please try again.', type: 'error' });
        }
      }
    },
    [isAuthenticated, serverId, message, user, showToast, router, pathname],
  );

  const handleEditClick = useCallback(() => {
    const current = localContent ?? message.content;
    setEditContent(current);
    setIsEditing(true);
    setTimeout(() => {
      const el = editTextareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 0);
  }, [localContent, message.content]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditContent(localContent ?? message.content);
  }, [localContent, message.content]);

  const handleEditSave = useCallback(async () => {
    const trimmed = editContent.trim();
    const currentContent = localContent ?? message.content;
    if (!trimmed || trimmed === currentContent || !serverId) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const result = await editMessageAction(message.id, serverId, trimmed);
    setIsSaving(false);
    if (result.ok) {
      setIsEditing(false);
      setLocalContent(result.message.content);
    } else {
      const msg = result.forbidden
        ? "You don't have permission to edit this message."
        : 'Failed to edit message. Please try again.';
      showToast({ message: msg, type: 'error' });
    }
  }, [editContent, localContent, message.content, message.id, serverId, showToast]);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleEditSave();
      } else if (e.key === 'Escape') {
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel],
  );

  // Trim first to guard against empty-string usernames — || catches "" where ?? would not.
  const trimmedUsername = message.author.username?.trim();
  const authorInitial = trimmedUsername?.charAt(0)?.toUpperCase() || '?';

  // TODO: Author name role coloring
  // The Author type embedded in Message does not carry a role field —
  // role lives on the User entity. When real auth/user data is wired up,
  // pass the user's role here and map it to a colour:
  //   owner → #f0b132 (gold), admin → #ed4245 (red),
  //   moderator → #3ba55c (green), member/guest → text-white
  const authorNameClass = 'cursor-pointer font-medium text-white hover:underline';

  const handleReplyClick = useCallback(() => {
    onReplyClick?.(message);
  }, [onReplyClick, message]);

  const actionBar = (
    <ActionBar
      messageId={message.id}
      serverId={serverId}
      channelId={message.channelId}
      canPin={canPin}
      initialPinned={!!message.pinned}
      isOwnMessage={isOwnMessage}
      onEditClick={handleEditClick}
      onReplyClick={isTopLevel ? handleReplyClick : undefined}
      onPinActionStart={onPinActionStart}
      onPinToggle={onPinToggle}
      onReactionAdd={handleReactionAdd}
    />
  );

  const threadToggle =
    isTopLevel && serverId ? (
      <button
        type='button'
        onClick={() => setIsThreadOpen(v => !v)}
        className='mt-1 flex items-center gap-1 text-xs text-[#5865f2] hover:underline'
        aria-expanded={isThreadOpen}
        aria-label={
          isThreadOpen
            ? 'Hide replies'
            : `View ${localReplyCount} ${localReplyCount === 1 ? 'reply' : 'replies'}`
        }
      >
        <svg className='h-3 w-3' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
          <path d='M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z' />
        </svg>
        {isThreadOpen
          ? 'Hide replies'
          : `${localReplyCount} ${localReplyCount === 1 ? 'reply' : 'replies'}`}
      </button>
    ) : null;

  const threadView =
    isTopLevel && isThreadOpen && serverId ? (
      <ThreadView
        parentMessage={message}
        channelId={message.channelId}
        serverId={serverId}
        onReplyCountChange={delta => setLocalReplyCount(c => c + delta)}
      />
    ) : null;

  const editUi = (
    <div className='mt-0.5'>
      <textarea
        ref={editTextareaRef}
        value={editContent}
        onChange={e => setEditContent(e.target.value)}
        onKeyDown={handleEditKeyDown}
        disabled={isSaving}
        rows={3}
        className='w-full resize-none rounded-md bg-[#40444b] px-3 py-2 text-sm text-[#dcddde] outline-none focus:ring-1 focus:ring-[#5865f2] disabled:opacity-50'
        aria-label='Edit message'
      />
      <div className='mt-1 flex items-center gap-2 text-xs text-gray-400'>
        <span>
          escape to{' '}
          <button
            type='button'
            onClick={handleEditCancel}
            className='text-[#5865f2] hover:underline'
          >
            cancel
          </button>
          {' · '}enter to{' '}
          <button
            type='button'
            onClick={handleEditSave}
            disabled={isSaving}
            className='text-[#5865f2] hover:underline disabled:opacity-50'
          >
            save
          </button>
        </span>
      </div>
    </div>
  );

  if (!showHeader) {
    return (
      <div
        data-message-id={message.id}
        className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
      >
        {message.parentMessage && (
          <div className='ml-14 pt-1'>
            <ReplyBanner parentMessage={message.parentMessage} />
          </div>
        )}
        <div className='flex gap-4'>
          {!isEditing && actionBar}
          {/* Spacer aligns content with the 40px avatar of the header row */}
          <div className='w-10 flex-shrink-0 text-right'>
            <span className='invisible whitespace-nowrap text-[10px] text-gray-500 group-hover:visible group-focus-within:visible'>
              {formatTimeOnly(message.timestamp)}
            </span>
          </div>
          <div className='min-w-0 flex-1'>
            {isEditing ? (
              editUi
            ) : (
              <p className='whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
                {localContent ?? message.content}
                {(message.editedAt || localContent !== undefined) && (
                  <span className='ml-1 text-[10px] text-gray-500'>(edited)</span>
                )}
              </p>
            )}
            <AttachmentList attachments={message.attachments} />
            <ReactionList
              reactions={localReactions}
              messageId={message.id}
              userId={user?.id}
              onReactionClick={handleReactionToggle}
            />
            {localReplyCount > 0 && threadToggle}
          </div>
        </div>
        {threadView}
      </div>
    );
  }

  return (
    <div
      data-message-id={message.id}
      className='group relative flex flex-col px-4 py-0.5 hover:bg-white/[0.02]'
    >
      {message.parentMessage && (
        <div className='ml-14 pt-1'>
          <ReplyBanner parentMessage={message.parentMessage} />
        </div>
      )}
      <div className='flex gap-4'>
        {!isEditing && actionBar}
        {/* Avatar */}
        <div className='mt-0.5 flex-shrink-0'>
          {message.author.avatarUrl && !avatarError ? (
            <Image
              src={message.author.avatarUrl}
              alt={message.author.username}
              width={40}
              height={40}
              unoptimized
              className='h-10 w-10 rounded-full'
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white'>
              {authorInitial}
            </div>
          )}
        </div>
        {/* Content */}
        <div className='min-w-0 flex-1'>
          <div className='flex items-baseline gap-2'>
            <span className={authorNameClass}>
              {message.author.displayName ?? message.author.username}
            </span>
            <span className='whitespace-nowrap text-[11px] text-gray-400'>
              {formatMessageTimestamp(message.timestamp)}
            </span>
            {(message.editedAt || localContent !== undefined) && (
              <span className='text-[10px] text-gray-500'>(edited)</span>
            )}
          </div>
          {isEditing ? (
            editUi
          ) : (
            <p className='mt-0.5 whitespace-pre-line text-sm leading-relaxed text-[#dcddde]'>
              {localContent ?? message.content}
            </p>
          )}
          <AttachmentList attachments={message.attachments} />
          <ReactionList
            reactions={localReactions}
            messageId={message.id}
            userId={user?.id}
            onReactionClick={handleReactionToggle}
          />
          {localReplyCount > 0 && threadToggle}
        </div>
      </div>
      {threadView}
    </div>
  );
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/components/channel/MessageList.tsx
```

Output:

```text
[rtk] /!\ Hook outdated — run `rtk init -g` to update
/**
 * Channel Component: MessageList
 * Scrollable, chronological message feed with author grouping, date separators,
 * a welcome header, and smart auto-scroll.
 * Based on dev spec C1.3 MessageListComponent
 */

'use client';

import { useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { MessageItem } from '@/components/message/MessageItem';
import { formatDate } from '@/lib/utils';
import { ChannelVisibility } from '@/types';
import type { Channel, Message } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type MessageGroup = { messages: Message[]; dateLabel: string };

/**
 * Groups consecutive messages by author (within a 5-minute window) and
 * annotates each group with a date label for use by DateSeparator.
 * #c31: guards against NaN timestamps so grouping never silently breaks.
 */
function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prev = messages[i - 1];
    const sameAuthor = prev && prev.author.id === msg.author.id;
    const msgTime = new Date(msg.timestamp).getTime();
    const prevTime = prev ? new Date(prev.timestamp).getTime() : NaN;
    const withinTime =
      prev && !isNaN(msgTime) && !isNaN(prevTime) && msgTime - prevTime < 5 * 60 * 1000;
    // Do not group messages across midnight — date separators rely on group boundaries
    const sameDay =
      prev &&
      !isNaN(msgTime) &&
      !isNaN(prevTime) &&
      new Date(msgTime).toDateString() === new Date(prevTime).toDateString();

    const dateLabel = isNaN(msgTime) ? '' : formatDate(new Date(msgTime));

    if (sameAuthor && withinTime && sameDay) {
      groups[groups.length - 1].messages.push(msg);
    } else {
      groups.push({ messages: [msg], dateLabel });
    }
  }

  return groups;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateSeparator({ label }: { label: string }) {
  return (
    <div className='flex items-center gap-4 px-4 py-2'>
      <hr className='flex-1 border-[#40444b]' />
      <span className='text-xs font-medium text-gray-400'>{label}</span>
      <hr className='flex-1 border-[#40444b]' />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MessageListProps {
  channel: Channel;
  messages: Message[];
  /** Server ID passed to MessageItem for pin/unpin actions. */
  serverId?: string;
  /** When true, shows the pin/unpin option on message hover. Grant to MODERATOR+. */
  canPin?: boolean;
  /** Called when the user clicks Reply on a message. */
  onReplyClick?: (message: Message) => void;
  /** Called as soon as the user clicks pin/unpin on a message. */
  onPinActionStart?: () => void;
  /** Called when the user clicks pin/unpin on a message. */
  onPinToggle?: (messageId: string, pinned: boolean) => void;
}

export function MessageList({
  channel,
  messages,
  serverId,
  canPin,
  onReplyClick,
  onPinActionStart,
  onPinToggle,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // #c7: only auto-scroll when user is already near the bottom
  const isNearBottomRef = useRef(true);
  // Track whether the initial mount scroll has happened so we jump instantly
  // to the bottom on load rather than smoothly scrolling from the top.
  const hasMountedRef = useRef(false);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom <= 100;
  }, []);

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      // Initial load: jump instantly so the user starts at the bottom
      hasMountedRef.current = true;
      const el = scrollContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    } else if (isNearBottomRef.current) {
      // New message while already near bottom: smooth scroll
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const groups = useMemo(() => groupMessages(messages), [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className='flex-1 overflow-y-auto py-4'
      onScroll={handleScroll}
      role='log'
      aria-label={`Messages in #${channel.name}`}
      aria-live='polite'
      aria-relevant='additions'
    >
      {/* Channel welcome header */}
      <div className='px-4 pb-4'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#40444b]'>
          <svg
            className='h-8 w-8 text-white'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.871 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41001 9L8.35001 15H14.35L15.41 9H9.41001Z' />
          </svg>
        </div>
        <h2 className='mt-2 text-3xl font-bold text-white'>Welcome to #{channel.name}!</h2>
        {channel.topic && <p className='mt-1 text-sm text-gray-400'>{channel.topic}</p>}
        <div className='mt-1 text-xs text-gray-500'>
          {channel.visibility === ChannelVisibility.PUBLIC_INDEXABLE &&
            '🌐 Public · Indexed by search engines'}
          {channel.visibility === ChannelVisibility.PUBLIC_NO_INDEX && '👁 Public · Not indexed'}
          {channel.visibility === ChannelVisibility.PRIVATE && '🔒 Private channel'}
        </div>
      </div>

      {/* Message groups with date separators */}
      <div className='space-y-4'>
        {groups.map((group, gi) => {
          const prevGroup = groups[gi - 1];
          const showDateSeparator =
            gi > 0 && prevGroup && group.dateLabel && prevGroup.dateLabel !== group.dateLabel;
          return (
            <div key={group.messages[0]?.id || gi}>
              {showDateSeparator && <DateSeparator label={group.dateLabel} />}
              {group.messages.map((msg, mi) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  showHeader={mi === 0}
                  serverId={serverId}
                  canPin={canPin}
                  onReplyClick={onReplyClick}
                  onPinActionStart={onPinActionStart}
                  onPinToggle={onPinToggle}
                />
              ))}
            </div>
          );
        })}
      </div>

      {messages.length === 0 && (
        <p className='px-4 text-sm text-gray-500'>No messages yet. Start the conversation!</p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T20:30:10.430Z

I found both causes: `HarmonyShell` always sets `isPinsOpen` to `true` from the top-bar button, and pin actions still call `onPinActionStart` to close the panel. I’m now removing that close callback path and switching the top-bar pin button to a true toggle.

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T20:30:39.505Z

I’ve applied the behavioral fixes. I’m running formatter, ESLint, and TypeScript checks on the touched frontend files now.

#### Tool: exec_command

```sh
npx prettier --write src/components/layout/HarmonyShell.tsx src/components/channel/MessageList.tsx src/components/message/MessageItem.tsx
```

Output:

```text
[warn] jsxBracketSameLine is deprecated.
src/components/layout/HarmonyShell.tsx 80ms (unchanged)
src/components/channel/MessageList.tsx 14ms (unchanged)
src/components/message/MessageItem.tsx 41ms (unchanged)
```

#### Tool: exec_command

```sh
npx eslint src/components/layout/HarmonyShell.tsx src/components/channel/MessageList.tsx src/components/message/MessageItem.tsx
```

Output:

```text

```

#### Tool: exec_command

```sh
npx tsc --noEmit
```

Output:

```text

```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T20:30:47.275Z

Fixed both behaviors:

- Pin/unpin no longer closes the pinned panel.
- Clicking the top-bar pinned button now toggles the panel open/closed (instead of only opening it).

Updated files:
- [HarmonyShell.tsx](/Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/layout/HarmonyShell.tsx)
- [MessageList.tsx](/Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/channel/MessageList.tsx)
- [MessageItem.tsx](/Users/allen/.codex/worktrees/cafd/Harmony/harmony-frontend/src/components/message/MessageItem.tsx)

Validation:
- `npx prettier --write` (touched files)
- `npx eslint` (touched files)
- `npx tsc --noEmit`

Your dev server session should still be running on [http://localhost:3000](http://localhost:3000), so you can retest immediately.

### Turn 9: push to the

#### 👤 User Prompt

- Time: 2026-04-29T20:32:13.021Z

```text
push to the PR
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T20:32:18.216Z

I’ll commit these latest pin-panel behavior fixes to your PR branch and push them now. I’m checking the staged state first, then I’ll commit with a focused message.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony status --short --branch
```

Output:

```text
## codex/issue-500-pin-sidebar-realtime-close-on-pin...origin/codex/issue-500-pin-sidebar-realtime-close-on-pin
 M harmony-frontend/src/components/channel/MessageList.tsx
 M harmony-frontend/src/components/layout/HarmonyShell.tsx
 M harmony-frontend/src/components/message/MessageItem.tsx
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony diff --stat
```

Output:

```text
 harmony-frontend/src/components/channel/MessageList.tsx | 4 ----
 harmony-frontend/src/components/layout/HarmonyShell.tsx | 7 +------
 harmony-frontend/src/components/message/MessageItem.tsx | 9 +--------
 3 files changed, 2 insertions(+), 18 deletions(-)
```

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony add harmony-frontend/src/components/layout/HarmonyShell.tsx harmony-frontend/src/components/channel/MessageList.tsx harmony-frontend/src/components/message/MessageItem.tsx && git -C /Users/allen/.codex/worktrees/cafd/Harmony commit -m "fix(frontend): keep pins panel open on pin and toggle via topbar" -m "- remove pin-action auto-close behavior\n- make topbar pinned button toggle panel open/closed\n\nCo-authored-by: GPT 5.5 <noreply@openai.com>"
```

Output:

```text
[codex/issue-500-pin-sidebar-realtime-close-on-pin 98bbc69] fix(frontend): keep pins panel open on pin and toggle via topbar
 3 files changed, 2 insertions(+), 18 deletions(-)
```

### Turn 10: and update the pr

#### 👤 User Prompt

- Time: 2026-04-29T20:32:46.114Z

```text
and update the pr description
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T20:32:57.175Z

I’ll push commit `98bbc69` to the PR branch and then update the PR description to include this new behavior change set.

#### Tool: exec_command

```sh
git -C /Users/allen/.codex/worktrees/cafd/Harmony push
```

Output:

```text
To github.com:CS485-Harmony/Harmony.git
   dada1c5..98bbc69  codex/issue-500-pin-sidebar-realtime-close-on-pin -> codex/issue-500-pin-sidebar-realtime-close-on-pin
```

#### Tool: exec_command

```sh
cat >/private/tmp/pr548-body.md <<'EOF'
## Summary
- fix pinned messages sidebar so it refreshes immediately after successful pin/unpin actions
- keep the pinned sidebar open when pinning/unpinning from message actions
- make the top-bar pinned button a true toggle (open/close)
- trigger sidebar refresh when real-time message edits change `pinned` state
- merge latest `main` and resolve `MessageItem.tsx` conflict while preserving reaction/thread behavior

## Main Changes
- `harmony-frontend/src/components/layout/HarmonyShell.tsx`
- `harmony-frontend/src/components/channel/PinnedMessagesPanel.tsx`
- `harmony-frontend/src/components/channel/MessageList.tsx`
- `harmony-frontend/src/components/message/MessageItem.tsx`

## Verification
- `npx prettier --write src/components/channel/PinnedMessagesPanel.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx src/components/message/MessageItem.tsx`
- `npx eslint src/components/channel/PinnedMessagesPanel.tsx src/components/channel/MessageList.tsx src/components/layout/HarmonyShell.tsx src/components/message/MessageItem.tsx`
- `npx tsc --noEmit`

## Issue
Closes #500
EOF

gh pr edit 548 --repo CS485-Harmony/Harmony --body-file /private/tmp/pr548-body.md
```

Output:

```text
https://github.com/CS485-Harmony/Harmony/pull/548
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T20:33:06.914Z

Done.

- Pushed commit `98bbc69` to `codex/issue-500-pin-sidebar-realtime-close-on-pin`
- Updated PR description for [#548](https://github.com/CS485-Harmony/Harmony/pull/548) to reflect:
  - pin/unpin does **not** close the pinned panel
  - top-bar pin button now toggles panel open/closed
  - real-time pinned refresh behavior and verification steps
