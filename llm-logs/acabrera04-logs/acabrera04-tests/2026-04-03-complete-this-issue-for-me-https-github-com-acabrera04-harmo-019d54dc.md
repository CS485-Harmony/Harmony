# Codex Conversation Export

## Metadata

- Thread ID: 019d54dc-50ea-72e2-bafe-66236cd577d2
- Timestamp: 2026-04-03T19:40:18.028Z
- CWD: /Users/allen/.codex/worktrees/9495/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: high
- Rollout Path: /Users/allen/.codex/sessions/2026/04/03/rollout-2026-04-03T15-40-18-019d54dc-50ea-72e2-bafe-66236cd577d2.jsonl

## Transcript

### Turn 1: Complete this issue for me

#### 👤 User Prompt

- Time: 2026-04-03T19:40:20.441Z

```text
Complete this issue for me https://github.com/acabrera04/Harmony/issues/289
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:40:33.142Z

I’m pulling the issue details and the repository workflow rules first, then I’ll map the requested change onto the local codebase before editing anything.

#### Tool: exec_command

```sh
rtk git remote -v
```

Output:

```text
origin	git@github.com:acabrera04/Harmony.git (fetch)
origin	git@github.com:acabrera04/Harmony.git (push)
```

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
rtk read /Users/allen/.agents/skills/tdd-workflow/SKILL.md
```

Output:

````text
---
name: tdd-workflow
description: Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage including unit, integration, and E2E tests.
origin: ECC
---

# Test-Driven Development Workflow

This skill ensures all code development follows TDD principles with comprehensive test coverage.

## When to Activate

- Writing new features or functionality
- Fixing bugs or issues
- Refactoring existing code
- Adding API endpoints
- Creating new components

## Core Principles

### 1. Tests BEFORE Code
ALWAYS write tests first, then implement code to make tests pass.

### 2. Coverage Requirements
- Minimum 80% coverage (unit + integration + E2E)
- All edge cases covered
- Error scenarios tested
- Boundary conditions verified

### 3. Test Types

#### Unit Tests
- Individual functions and utilities
- Component logic
- Pure functions
- Helpers and utilities

#### Integration Tests
- API endpoints
- Database operations
- Service interactions
- External API calls

#### E2E Tests (Playwright)
- Critical user flows
- Complete workflows
- Browser automation
- UI interactions

## TDD Workflow Steps

### Step 1: Write User Journeys
```
As a [role], I want to [action], so that [benefit]

Example:
As a user, I want to search for markets semantically,
so that I can find relevant markets even without exact keywords.
```

### Step 2: Generate Test Cases
For each user journey, create comprehensive test cases:

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
  })

  it('handles empty query gracefully', async () => {
  })

  it('falls back to substring search when Redis unavailable', async () => {
  })

  it('sorts results by similarity score', async () => {
  })
})
```

### Step 3: Run Tests (They Should Fail)
```bash
npm test
# Tests should fail - we haven't implemented yet
```

### Step 4: Implement Code
Write minimal code to make tests pass:

```typescript
export async function searchMarkets(query: string) {
}
```

### Step 5: Run Tests Again
```bash
npm test
# Tests should now pass
```

### Step 6: Refactor
Improve code quality while keeping tests green:
- Remove duplication
- Improve naming
- Optimize performance
- Enhance readability

### Step 7: Verify Coverage
```bash
npm run test:coverage
# Verify 80%+ coverage achieved
```

## Testing Patterns

### Unit Test Pattern (Jest/Vitest)
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### API Integration Test Pattern
```typescript
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('GET /api/markets', () => {
  it('returns markets successfully', async () => {
    const request = new NextRequest('http://localhost/api/markets')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('validates query parameters', async () => {
    const request = new NextRequest('http://localhost/api/markets?limit=invalid')
    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it('handles database errors gracefully', async () => {
    const request = new NextRequest('http://localhost/api/markets')
  })
})
```

### E2E Test Pattern (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href="/markets"]')

  await expect(page.locator('h1')).toContainText('Markets')

  await page.fill('input[placeholder="Search markets"]', 'election')

  await page.waitForTimeout(600)

  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  await page.click('button:has-text("Active")')

  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  await page.goto('/creator-dashboard')

  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  await page.click('button[type="submit"]')

  await expect(page.locator('text=Market created successfully')).toBeVisible()

  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

## Test File Organization

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # Unit tests
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # Integration tests
└── e2e/
    ├── markets.spec.ts               # E2E tests
    ├── trading.spec.ts
    └── auth.spec.ts
```

## Mocking External Services

### Supabase Mock
```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [{ id: 1, name: 'Test Market' }],
          error: null
        }))
      }))
    }))
  }
}))
```

### Redis Mock
```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

### OpenAI Mock
```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // Mock 1536-dim embedding
  ))
}))
```

## Test Coverage Verification

### Run Coverage Report
```bash
npm run test:coverage
```

### Coverage Thresholds
```json
{
  "jest": {
    "coverageThresholds": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Common Testing Mistakes to Avoid

### ❌ WRONG: Testing Implementation Details
```typescript
expect(component.state.count).toBe(5)
```

### ✅ CORRECT: Test User-Visible Behavior
```typescript
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

### ❌ WRONG: Brittle Selectors
```typescript
await page.click('.css-class-xyz')
```

### ✅ CORRECT: Semantic Selectors
```typescript
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

### ❌ WRONG: No Test Isolation
```typescript
```

### ✅ CORRECT: Independent Tests
```typescript
test('creates user', () => {
  const user = createTestUser()
})

test('updates user', () => {
  const user = createTestUser()
})
```

## Continuous Testing

### Watch Mode During Development
```bash
npm test -- --watch
# Tests run automatically on file changes
```

### Pre-Commit Hook
```bash
# Runs before every commit
npm test && npm run lint
```

### CI/CD Integration
```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Best Practices

1. **Write Tests First** - Always TDD
2. **One Assert Per Test** - Focus on single behavior
3. **Descriptive Test Names** - Explain what's tested
4. **Arrange-Act-Assert** - Clear test structure
5. **Mock External Dependencies** - Isolate unit tests
6. **Test Edge Cases** - Null, undefined, empty, large
7. **Test Error Paths** - Not just happy paths
8. **Keep Tests Fast** - Unit tests < 50ms each
9. **Clean Up After Tests** - No side effects
10. **Review Coverage Reports** - Identify gaps

## Success Metrics

- 80%+ code coverage achieved
- All tests passing (green)
- No skipped or disabled tests
- Fast test execution (< 30s for unit tests)
- E2E tests cover critical user flows
- Tests catch bugs before production

---

**Remember**: Tests are not optional. They are the safety net that enables confident refactoring, rapid development, and production reliability.
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:40:38.083Z

I’ve got the repo rules and I’m switching into the project’s required workflow: capture a task plan, inspect issue `#289`, and locate the affected area before deciding on tests and implementation.

#### Tool: update_plan

- Explanation: Following the repository workflow for a non-trivial issue: inspect the issue, map it to code, implement via tests-first where practical, verify, and document progress.

- Plan:
  - [in_progress] Inspect GitHub issue #289 and current repo state, then record a task plan in tasks/todo.md and post the starting issue comment
  - [pending] Identify the affected code path and write or update tests that capture the issue requirements
  - [pending] Implement the fix or feature with minimal necessary code changes
  - [pending] Run formatter, targeted tests, and relevant type/lint verification
  - [pending] Update task notes, post completion summary to the issue, and summarize results for the user

Output:

```text
Plan updated
```

#### Tool: exec_command

```sh
rtk ls
```

Output:

```text
.claude/
.github/
docs/
harmony-backend/
harmony-frontend/
llm-logs/
mockups/
planning/
scripts/
tasks/
.gitignore  66B
AGENTS.md  1.9K
CLAUDE.md  11B
README.md  53B
WORKFLOW.md  3.7K
dev-spec-guidelines.pdf  507.5K
package.json  280B

📊 7 files, 10 dirs (4 .md, 1 .pdf, 1 .gitignore, 1 .json)
```

#### Tool: exec_command

```sh
rtk git status --short
```

Output:

```text
ok ✓
```

#### Tool: exec_command

```sh
rtk read tasks/todo.md
```

Output:

```text
Error: Failed to read file: tasks/todo.md

Caused by:
    No such file or directory (os error 2)
```

#### Tool: mcp__codex_apps__github_fetch_issue

```json
{
  "issue_number": 289,
  "repo": "acabrera04/Harmony"
}
```

Output:

```text
{"issue":{"url":"https://github.com/acabrera04/Harmony/issues/289","title":"Test Specification — publicApiService.ts (frontend)","issue_number":289,"body":"## Description\nWrite an English-language test specification for `harmony-frontend/src/services/publicApiService.ts` to cover the guest public channel view flow used by `/c/{serverSlug}/{channelSlug}`.\n\n## Functions to Specify\n- `mapChannelType`\n- `mapChannelVisibility`\n- `fetchPublicServer`\n- `fetchPublicChannel`\n- `fetchPublicMessages`\n- `isChannelGuestAccessible`\n\n## Requirements\n- List every function, its purpose, and all program paths\n- Create a table with columns: **Test Purpose**, **Inputs**, **Expected Output**\n- Cover happy paths, network failures, 403/404 handling, and cache-safe null fallbacks\n- Explicitly cover guest visibility semantics for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`\n- Document the mock strategy for `fetch`, React `cache`, and API response shapes\n- Tie the spec back to `docs/dev-spec-guest-public-channel-view.md`\n- Target 80%+ code coverage of the file's reachable execution paths\n- Output: `docs/test-specs/frontend-public-api-service-spec.md`\n\n## Acceptance Criteria\n- [ ] All 6 functions listed with descriptions\n- [ ] Table covers happy paths for each function\n- [ ] Table covers 403/404/error handling paths\n- [ ] `PUBLIC_INDEXABLE` / `PUBLIC_NO_INDEX` / `PRIVATE` semantics are documented\n- [ ] Mock strategy documented\n- [ ] At least one test per function\n\n**Sprint:** 3 (P5 Testing)\n**Context:** Needed to cover the implemented Guest Public Channel View user story.\n","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"display_url":"https://github.com/acabrera04/Harmony/issues/289","display_title":"Test Specification — publicApiService.ts (frontend)"},"url":"https://github.com/acabrera04/Harmony/issues/289","title":"Test Specification — publicApiService.ts (frontend)","display_url":"https://github.com/acabrera04/Harmony/issues/289","display_title":"Test Specification — publicApiService.ts (frontend)"}
```

#### Tool: mcp__codex_apps__github_fetch_issue_comments

```json
{
  "issue_number": 289,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

```text
{"comments":[],"url":"https://github.com/acabrera04/Harmony/issues/289","title":"acabrera04/Harmony Issue #289 comments","display_url":"https://github.com/acabrera04/Harmony/issues/289","display_title":"acabrera04/Harmony Issue #289 comments"}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:41:06.729Z

The issue is a documentation/spec task, not a runtime code fix. I’m reading the target service, the linked guest-channel spec, and nearby test-spec examples so the new document matches project conventions instead of inventing a format.

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/services/publicApiService.ts
```

Output:

```text
/**
 * publicApiService — server-side service for the backend public REST API.
 * Uses fetch (not the axios api-client) so it can be called from React Server
 * Components, generateMetadata, and other server-only contexts.
 * React `cache` is used for request deduplication within a single render pass.
 */

import { cache } from 'react';
import type { Server, Channel, Message } from '@/types';
import { ChannelType, ChannelVisibility } from '@/types';
import { API_CONFIG, CACHE_DURATION } from '@/lib/constants';

type PublicServer = Omit<Server, 'ownerId'>;

interface PublicServerResponse {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  description?: string;
  memberCount: number;
  createdAt: string;
}

interface PublicChannelResponse {
  id: string;
  name: string;
  slug: string;
  serverId: string;
  type: string;
  visibility: string;
  topic?: string | null;
  position: number;
  createdAt: string;
}

interface PublicMessageResponse {
  id: string;
  content: string;
  createdAt: string;
  editedAt?: string | null;
  author: { id: string; username: string };
}

interface PublicMessagesApiResponse {
  messages: PublicMessageResponse[];
  page: number;
  pageSize: number;
}

function mapChannelType(type: string): ChannelType {
  switch (type) {
    case 'VOICE':
      return ChannelType.VOICE;
    case 'ANNOUNCEMENT':
      return ChannelType.ANNOUNCEMENT;
    default:
      return ChannelType.TEXT;
  }
}

function mapChannelVisibility(visibility: string): ChannelVisibility {
  switch (visibility) {
    case 'PUBLIC_NO_INDEX':
      return ChannelVisibility.PUBLIC_NO_INDEX;
    case 'PRIVATE':
      return ChannelVisibility.PRIVATE;
    default:
      return ChannelVisibility.PUBLIC_INDEXABLE;
  }
}

/**
 * Fetch public server info by slug.
 * Returns null on any error or if the server is not found (404).
 * Deduplicated within a single render pass via React `cache`.
 */
export const fetchPublicServer = cache(async (serverSlug: string): Promise<PublicServer | null> => {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}`,
      { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
    );
    if (!res.ok) return null;

    const data: PublicServerResponse = await res.json();
    const server: PublicServer = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      icon: data.iconUrl,
      description: data.description,
      memberCount: data.memberCount,
      createdAt: data.createdAt,
    };
    return server;
  } catch {
    return null;
  }
});

/**
 * Fetch a single public channel by server slug + channel slug.
 * - Returns null if the server or channel does not exist (404).
 * - Returns `{ isPrivate: true }` if the channel is PRIVATE (403).
 * - Returns `{ channel, isPrivate: false }` on success (200).
 * Deduplicated within a single render pass via React `cache`.
 */
export const fetchPublicChannel = cache(
  async (
    serverSlug: string,
    channelSlug: string,
  ): Promise<{ channel: Channel; isPrivate: false } | { isPrivate: true } | null> => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}/channels/${encodeURIComponent(channelSlug)}`,
        { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
      );

      if (res.status === 404) return null;
      if (res.status === 403) return { isPrivate: true };
      if (!res.ok) return null;

      const data: PublicChannelResponse = await res.json();
      const channel: Channel = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        serverId: data.serverId,
        type: mapChannelType(data.type),
        visibility: mapChannelVisibility(data.visibility),
        topic: data.topic ?? undefined,
        position: data.position,
        createdAt: data.createdAt,
      };
      return { channel, isPrivate: false };
    } catch {
      return null;
    }
  },
);

/**
 * Fetch paginated public messages for a channel.
 * Returns an empty list on error.
 */
export async function fetchPublicMessages(
  channelId: string,
  page = 1,
): Promise<{ messages: Message[]; hasMore: boolean }> {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/public/channels/${encodeURIComponent(channelId)}/messages?page=${page}`,
    );
    if (!res.ok) return { messages: [], hasMore: false };

    const data: PublicMessagesApiResponse = await res.json();
    const messages: Message[] = data.messages.map(m => ({
      id: m.id,
      channelId,
      authorId: m.author.id,
      author: { id: m.author.id, username: m.author.username },
      content: m.content,
      timestamp: m.createdAt,
      editedAt: m.editedAt ?? undefined,
    }));
    return { messages, hasMore: messages.length >= data.pageSize };
  } catch {
    return { messages: [], hasMore: false };
  }
}

/**
 * Returns true if the channel is publicly accessible (not PRIVATE and not missing).
 */
export async function isChannelGuestAccessible(
  serverSlug: string,
  channelSlug: string,
): Promise<boolean> {
  const result = await fetchPublicChannel(serverSlug, channelSlug);
  return result !== null && !result.isPrivate;
}
```

#### Tool: exec_command

```sh
rtk read docs/dev-spec-guest-public-channel-view.md
```

Output:

````text
Total output lines: 1934

# Development Specification: Guest Public Channel View

## Feature: Anonymous Access to Public Channel Content

**User Story:** As a Guest User (Searcher), I want to view the full contents of a public channel via a direct URL without being prompted to log in, so that I can get the answer to my specific question immediately without the friction of creating an account I might only use once.

> **Unified Backend Reference:** This feature's backend classes are part of the shared Harmony backend defined in [`unified-backend-architecture.md`](./unified-backend-architecture.md). The mapping from this spec's class labels to the unified module labels is in §10 of that document. Key modules contributed by this feature: **M-B2** (Access Control), **M-B4** (Content Delivery), **M-D1** (Data Access, shared).

---

## 1. Header

### Version and Date

| Version | Date       | Description                              |
|---------|------------|------------------------------------------|
| 1.0     | 2026-02-12 | Initial development specification        |
| 2.0     | 2026-02-15 | Cross-spec consolidation: label fixes, cache key alignment, convention standardization |

### Author and Role

| Author        | Role                    | Version |
|---------------|-------------------------|---------|
| Claude (AI)   | Specification Author    | 1.0, 2.0 |
| dblanc        | Project Lead            | 1.0     |
| Aiden-Barrera | Project Member          | 2.0     |

---

## 2. Architecture Diagram

### 2.1 System Overview

```mermaid
graph TB
    subgraph Actors["External Actors"]
        GuestUser["A1: Guest User\nAnonymous browser user"]
        BotUser["A2: Search Engine Bot\nGooglebot, Bingbot, etc."]
    end

    subgraph EdgeLayer["Edge Layer (CDN - CloudFlare)"]
        CacheRouter["W1.1 CacheRouter\ncheckCache()\nserveFromCache()\ncacheResponse()"]
        BotDetector["W1.2 BotDetector\ndetectBot()\napplyBotHeaders()\nrateLimitBot()"]
    end

    subgraph MGV1["M-GV1: Public View Module (Next.js SSR)"]
        PublicChannelPage["PublicChannelPage\ngetServerSideProps()\nrender()"]
        SEOMetadata["SEOMetadataComponent\ngenerateMetaTags()\ngenerateStructuredData()"]
        MessageListComp["MessageListComponent\nrender()\nloadMoreMessages()"]
        GuestPromoBanner["GuestPromoBanner\nrender()\nonJoinClick()"]
        MessageCard["MessageCard\nrender()\nformatTimestamp()"]
        ServerSidebar["ServerSidebar\nrender()\nnavigateToChannel()"]
    end

    subgraph MGV2["M-GV2: Client Interaction Module (Browser)"]
        InfiniteScrollHandler["InfiniteScrollHandler\nobserve()\nonIntersect()\nloadMore()"]
        MessageLinkHandler["MessageLinkHandler\nscrollToMessage()\nhighlightMessage()"]
        SearchHighlighter["SearchHighlighter\nparseSearchTerms()\nhighlightMatches()"]
        ShareHandler["ShareHandler\nshareToTwitter()\ncopyLink()"]
    end

    subgraph MB1["M-B1: API Gateway (Public API)"]
        PublicChannelCtrl["PublicChannelController\n(REST, public)\ngetPublicChannelPage()\ngetPublicMessages()"]
        PublicServerCtrl["PublicServerController\n(REST, public)\ngetPublicServerInfo()\ngetPublicChannelList()"]
    end

    subgraph MB2["M-B2: Access Control"]
        VisibilityGuard["VisibilityGuard\nisChannelPublic()\ngetVisibilityStatus()"]
        ContentFilter["ContentFilter\nfilterSensitiveContent()\nredactUserMentions()"]
        RateLimiter["RateLimiter\ncheckLimit()\nincrementCounter()"]
        AnonSessionMgr["AnonymousSessionManager\ngetOrCreateSession()\nstorePreference()"]
    end

    subgraph MB4["M-B4: Content Delivery"]
        MessageService["MessageService\ngetMessagesForPublicView()\ngetMessageById()"]
        AuthorService["AuthorService\ngetPublicAuthorInfo()\nanonymizeAuthor()"]
        AttachmentService["AttachmentService\ngetPublicAttachmentUrl()\nisAttachmentPublic()"]
        SEOService["SEOService\ngeneratePageTitle()\ngenerateDescription()\ngenerateStructuredData()"]
    end

    subgraph MD1["M-D1: Data Access"]
        ChannelRepo["ChannelRepository\nfindBySlug()\nfindPublicByServerId()\ngetVisibility()"]
        MessageRepo["MessageRepository\nfindByChannelPaginated()\nfindById()"]
        ServerRepo["ServerRepository\nfindBySlug()\ngetPublicInfo()"]
        UserRepo["UserRepository\nfindById()\ngetPublicProfile()"]
    end

    subgraph MD2["M-D2: Persistence (PostgreSQL)"]
        ServersTable[("servers")]
        ChannelsTable[("channels")]
        MessagesTable[("messages")]
        UsersTable[("users")]
        AttachmentsTable[("attachments")]
    end

    subgraph MD3["M-D3: Cache (Redis)"]
        VisCache["channel:{channelId}:visibility\nTTL: 3600s (M-B3 owner)"]
        MsgsCache["channel:msgs:{channelId}:page:{pageNum}\nTTL: 60s (M-B4 owner)"]
        ServerCache["server:{serverId}:info\nTTL: 300s (M-B4 owner)"]
        GuestSession["guest:session:{sessionId}\nTTL: 86400s (M-B2 owner)"]
    end

    GuestUser -->|HTTPS GET| CacheRouter
    BotUser -->|HTTPS GET| CacheRouter
    CacheRouter --> BotDetector
    CacheRouter -->|Cache Miss| PublicChannelPage
    PublicChannelPage --> SEOMetadata
    PublicChannelPage --> MessageListComp
    PublicChannelPage --> GuestPromoBanner
    PublicChannelPage --> ServerSidebar
    MessageListComp --> MessageCard
    InfiniteScrollHandler -->|REST| PublicChannelCtrl
    PublicChannelPage -->|Internal| PublicChannelCtrl
    PublicChannelPage -->|Internal| PublicServerCtrl
    PublicChannelCtrl --> VisibilityGuard
    PublicChannelCtrl --> RateLimiter
    PublicChannelCtrl --> AnonSessionMgr
    PublicChannelCtrl --> MessageService
    PublicChannelCtrl --> SEOService
    MessageService --> ContentFilter
    MessageService --> AttachmentService
    MessageService --> AuthorService
    VisibilityGuard --> ChannelRepo
    MessageService --> MessageRepo
    AuthorService --> UserRepo
    PublicServerCtrl --> ServerRepo
    ChannelRepo --> ChannelsTable
    ChannelRepo --> VisCache
    MessageRepo --> MessagesTable
    MessageRepo --> MsgsCache
    ServerRepo --> ServersTable
    ServerRepo --> ServerCache
    UserRepo --> UsersTable
    AttachmentService --> AttachmentsTable
    AnonSessionMgr --> GuestSession
```

> **Note:** All cache keys use UUID-based identifiers (e.g., `channel:{channelId}:visibility`) for consistency across all Harmony specs.

### 2.2 Information Flow Summary

| Flow ID | Source | Destination | Data | Protocol |
|---------|--------|-------------|------|----------|
| F1 | A1 Guest User | W1.1 CacheRouter | HTTP GET Request | HTTPS |
| F2 | W1.1 CacheRouter | C1.1 PublicChannelPage | Cache Miss Forward | HTTPS |
| F3 | C1.1 PublicChannelPage | C3.1 PublicChannelController | Channel Data Request | Internal |
| F4 | C3.1 PublicChannelController | C4.1 VisibilityGuard | Visibility Check | Internal |
| F5 | C4.1 VisibilityGuard | C6.1 ChannelRepository | Database Query | Internal |
| F6 | C3.1 PublicChannelController | C5.1 MessageService | Message Fetch | Internal |
| F7 | C5.1 MessageService | C6.2 MessageRepository | Paginated Query | Internal |
| F8 | C5.4 SEOService | C1.2 SEOMetadataComponent | SEO Data | Internal |
| F9 | C1.1 PublicChannelPage | W1.1 CacheRouter | Rendered HTML | HTTPS |
| F10 | W1.1 CacheRouter | A1 Guest User | Cached/Fresh Response | HTTPS |

### 2.3 Request Path Diagram

```mermaid
sequenceDiagram
    participant Guest as Guest User
    participant CDN as CDN Edge
    participant NextJS_SSR as Next.js SSR
    participant Database as Database

    Guest->>CDN: GET /c/gamedev/help
    CDN-->>CDN: Cache MISS
    CDN->>NextJS_SSR: Forward to origin
    NextJS_SSR->>Database: Check visibility
    Database-->>NextJS_SSR: visibility=PUBLIC
    NextJS_SSR->>Database: Fetch messages
    Database-->>NextJS_SSR: Message[]
    NextJS_SSR-->>NextJS_SSR: Render HTML with SEO tags
    NextJS_SSR-->>CDN: HTML + Cache-Control
    CDN-->>CDN: Store in cache
    CDN-->>Guest: HTML Response
    Guest-->>Guest: Browser renders page immediately
```

### 2.4 Rationale

The archtecture diagram is justified because client server split abstracts from the guest the authorization logic the server handles and caching requests significantly helps with performance for storing the same content that will be served to many users. Furthermore, the importance of authorization lies in the fact whether a channel is public or not, to make sure guests can't see private channels. 

---

## 3. Class Diagram

```mermaid
classDiagram
    class IPublicContentProvider {
        <<interface>>
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicChannelProvider {
        -channelRepo
        -visibilityGuard
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicMessageProvider {
        -messageRepo
        -contentFilter
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicServerProvider {
        -serverRepo
        -channelRepo
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class VisibilityGuard {
        -channelRepo
        -cache
        +isChannelPublic()
        +isServerPublic()
        +getVisibilityStatus()
    }

    class ContentFilter {
        -patterns
        +filterSensitiveContent()
        +redactUserMentions()
        +sanitizeForDisplay()
        +sanitizeAttachments()
    }

    class PublicChannelPage {
        <<React Component>>
        +serverSlug string
        +channelSlug string
        +initialData PageData
        +getServerSideProps()
        +render()
    }

    class SEOMetadataComponent {
        +title string
        +description string
        +canonicalUrl string
        +generateMetaTags()
        +generateStructuredData()
    }

    class MessageListComponent {
        +messages Message[]
        +hasMore boolean
        +render()
        +loadMoreMessages()
        +scrollToMessage()
    }

    class GuestPromoBanner {
        +serverName string
        +channelName string
        +memberCount number
        +render()
        +onJoinClick()
        +onDismiss()
    }

    class MessageCard {
        +message Message
        +author AuthorDTO
        +render()
        +formatTimestamp()
        +renderAttachments()
    }

    class ServerSidebar {
        +serverInfo ServerDTO
        +publicChannels ChannelDTO[]
        +render()
        +navigateToChannel()
    }

    class Channel {
        <<Entity>>
        +id UUID
        +serverId UUID
        +name string
        +slug string
        +visibility Enum
        +topic string
    }

    class Message {
        <<Entity>>
        +id UUID
        +channelId UUID
        +authorId UUID
        +content string
        +createdAt DateTime
        +editedAt DateTime
        +isDeleted boolean
    }

    class Server {
        <<Entity>>
        +id UUID
        +name string
        +slug string
        +description string
        +isPublic boolean
        +memberCount number
    }

    class User {
        <<Entity>>
        +id UUID
        +username string
        +displayName string
        +avatarUrl string
        +publicProfile boolean
    }

    class Attachment {
        <<Entity>>
        +id UUID
        +messageId UUID
        +filename string
        +url string
        +contentType string
        +sizeBytes number
    }

    class ChannelRepository {
        +findBySlug()
        +findPublicByServerId()
        +getVisibility()
    }

    class MessageRepository {
        +findByChannelPaginated()
        +findById()
        +countByChannel()
    }

    class ServerRepository {
        +findBySlug()
        +getPublicInfo()
    }

    class UserRepository {
        +findById()
        +getPublicProfile()
    }

    IPublicContentProvider <|.. PublicChannelProvider
    IPublicContentProvider <|.. PublicMessageProvider
    IPublicContentProvider <|.. PublicServerProvider
    PublicChannelProvider o-- VisibilityGuard
    PublicMessageProvider o-- ContentFilter
    PublicChannelPage *-- SEOMetadataComponent
    PublicChannelPage *-- MessageListComponent
    PublicChannelPage *-- GuestPromoBanner
    PublicChannelPage *-- ServerSidebar
    MessageListComponent *-- MessageCard
    VisibilityGuard ..> ChannelRepository
    Channel "1" o-- "many" Message
    Server "1" o-- "many" Channel
    Message o-- Attachment
    ChannelRepository ..> Channel
    MessageRepository ..> Message
    ServerRepository ..> Server
    UserRepository ..> User
```

### 3.1 Rationale

The class diagram clearly separates the entities that will be needed for displaying the public channel to the guest user, specifically with only grabbing public entities such as the server, messages and owner of the message to avoid exposing private channel information. 

---

## 4. List of Classes

### 4.1 Edge Layer (W1)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-W1.1 | CacheRouter | Edge Worker | Routes requests through CDN cache, determines cache hit/miss, manages cache keys |
| CL-W1.2 | BotDetector | Edge Worker | Identifies search engine bots vs human users, applies appropriate rate limits and headers |

### 4.2 Public View Module (M1)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C1.1 | PublicChannelPage | Page Component | Main Next.js page component for rendering public channel content with SSR |
| CL-C1.2 | SEOMetadataComponent | UI Component | Generates and renders SEO meta tags, Open Graph tags, and structured data |
| CL-C1.3 | MessageListComponent | UI Component | Renders paginated list of messages with infinite scroll support |
| CL-C1.4 | GuestPromoBanner | UI Component | Non-intrusive banner encouraging guests to join the community |
| CL-C1.5 | MessageCard | UI Component | Renders individual message with author info, timestamp, and attachments |
| CL-C1.6 | ServerSidebar | UI Component | Displays server info and list of other public channels for navigation |

### 4.3 Client Interaction Module (M2)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C2.1 | InfiniteScrollHandler | Client Component | Manages intersection observer for loading more messages on scroll |
| CL-C2.2 | MessageLinkHandler | Client Component | Handles deep links to specific messages, scrolls and highlights target |
| CL-C2.3 | SearchHighlighter | Client Component | Highlights search terms from referrer URL in message content |
| CL-C2.4 | ShareHandler | Client Component | Provides sharing functionality for messages and channel links |

### 4.4 Public API Module (M3)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C3.1 | PublicChannelController | Controller | Handles API requests for public channel data without authentication |
| CL-C3.2 | PublicServerController | Controller | Handles API requests for public server information |

### 4.5 Access Control Module (M4)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C4.1 | VisibilityGuard | Service | Checks channel/server visibility before serving content to guests |
| CL-C4.2 | ContentFilter | Service | Filters sensitive content, redacts private mentions from public view |
| CL-C4.3 | RateLimiter | Middleware | Prevents abuse by limiting request rate for anonymous users |
| CL-C4.4 | AnonymousSessionManager | Service | Manages lightweight sessions for guests to store preferences |

### 4.6 Content Delivery Module (M5)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C5.1 | MessageService | Service | Retrieves and formats messages for public display |
| CL-C5.2 | AuthorService | Service | Provides public author information, respects privacy settings |
| CL-C5.3 | AttachmentService | Service | Manages public access to message attachments |
| CL-C5.4 | SEOService | Service | Generates SEO metadata, structured data, and canonical URLs |

### 4.7 Data Access Module (M6)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C6.1 | ChannelRepository | Repository | Data access for channel entities with visibility filtering |
| CL-C6.2 | MessageRepository | Repository | Data access for messages with pagination support |
| CL-C6.3 | ServerRepository | Repository | Data access for server entities |
| CL-C6.4 | UserRepository | Repository | Data access for user public profile data |

### 4.8 Data Transfer Objects

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-D1 | PublicChannelDTO | DTO | Public-safe channel data for API responses |
| CL-D2 | PublicMessageDTO | DTO | Public-safe message data with permalink |
| CL-D3 | PublicAuthorDTO | DTO | Public author info without user ID |
| CL-D4 | PublicServerDTO | DTO | Public server info for display |
| CL-D5 | PageDataDTO | DTO | Combined data for SSR page rendering |
| CL-D6 | SEODataDTO | DTO | SEO metadata for page head |

#### PublicChannelDTO Fields

```typescript
interface PublicChannelDTO {
  id: string;           // Channel UUID
  name: string;         // Display name
  slug: string;         // URL-safe identifier
  topic: string;        // Channel topic/description
  messageCount: number; // Total messages in channel (computed, not a DB column)
  serverSlug: string;   // Parent server's slug
}
```

#### ChannelVisibility Enum

```typescript
enum ChannelVisibility {
  PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',   // Visible to guests and indexed by search engines
  PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',     // Visible to guests but not indexed
  PRIVATE = 'PRIVATE'                      // Only visible to authenticated members
}
```

### 4.9 Domain Entities

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-D7 | Channel | Entity | Channel domain entity with visibility state |
| CL-D8 | Message | Entity | Message domain entity |
| CL-D9 | Server | Entity | Server domain entity |
| CL-D10 | User | Entity | User domain entity with privacy settings |
| CL-D11 | Attachment | Entity | Message attachment entity |

### 4.10 Rationale

The list of classes clearly states the moving parts for ensuring guest user can access public channels and their messages, with handling caching. The classes cover all the responsibilities needed for this feature to function from route handling to retrieving the public data to formatting the response to the guest. The inclusion of caching and bot detection justified since retrieval of the same content from multiple guest is unnecessary more work on the server. 

---

## 5. State Diagrams

### 5.1 System State Variables

| Variable | Type | Description |
|----------|------|-------------|
| request.path | string | Current URL path being requested |
| channel.visibility | ChannelVisibility | Visibility state of requested channel |
| cache.status | CacheStatus | Whether response is cached (HIT/MISS/STALE) |
| guest.sessionId | string | Anonymous session identifier |
| page.loadState | LoadState | Current page loading state |
| messages.pagination | PaginationState | Current pagination position |

> **Convention:** `is_public` (boolean) applies to **servers** — whether the server appears in discovery. `visibility` (enum: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`) applies to **channels** — whether channel content is accessible to guests and/or indexed by search engines.

### 5.2 Page Load State Machine

```mermaid
stateDiagram-v2
    [*] --> S1 : GET /c/{server}/{channel}

    S1 : S1: Edge Cache Check\ncache.status=CHECKING
    S2 : S2: Serve Cached\ncache.status=HIT\nresponse.source=EDGE
    S3 : S3: Origin Request\ncache.status=MISS\nrequest.forwarded=true
    S4 : S4: Visibility Check\nchannel.visibility=?
    S5 : S5: Access Denied\nerror=403 OR redirect=true
    S6 : S6: Fetch Content\nmessages=loading\nserver=loading
    S7 : S7: Render Page\npage.loadState=COMPLETE\nseo.tags=generated
    S8 : S8: Cache Response\ncache.stored=true\ncache.ttl=60s
    S9 : S9: Response Delivered\npage.loadState=DELIVERED

    S1 --> S2 : Cache hit (valid or stale <300s)\n[return cached HTML; stale triggers background revalidation]
    S1 --> S3 : Cache miss or expired\n[forward to origin]
    S3 --> S4 : Always\n[query database]
    S4 --> S5 : visibility != PUBLIC_*\n[return 403 or redirect]
    S4 --> S6 : visibility = PUBLIC_*\n[query messages]
    S6 --> S7 : Content retrieved\n[generate HTML]
    S7 --> S8 : Rendering complete\n[store in edge cache]
    S2 --> S9 : Response ready\n[send to client]
    S8 --> S9 : Response ready\n[send to client]
    S5 --> S9 : Response ready\n[send to client]
```

### 5.3 Message Loading State Machine (Client-Side Hydration)

```mermaid
stateDiagram-v2
    [*] --> M1 : Page hydrated\n(initial messages rendered)

    M1 : M1: Initial View\nmessages.count=initialBatch\npagination.hasMore=true\nscroll.position=top
    M2 : M2: Loading More\nloading=true\npagination.page++
    M3 : M3: Scrolling to Message\ntargetMessage=id\nscroll.behavior=smooth
    M4 : M4: Messages Appended\nmessages+=newBatch\nloading=false
    M5 : M5: Message Highlighted\nhighlight.visible=true\nhighlight.ttl=3s

    M1 --> M2 : Scroll to bottom
    M1 --> M3 : Click message link
    M2 --> M4 : API returns
    M3 --> M5 : Message found
    M4 --> M1 : Return to browsing state
    M5 --> M1 : Return to browsing state
```

### 5.4 Access Denial State Machine

```mermaid
stateDiagram-v2
    [*] --> D1 : Private channel requested\n(visibility=PRIVATE)

    D1 : D1: Evaluate Response\nserver.isPublic=?\nreferrer.source=?
    D2 : D2: Show Login Prompt\n"Log in to view this channel"\n+ explain why + link to join
    D3 : D3: Show Server Landing\nRedirect to /s/{server}\nShow public channels list
    D4 : D4: Show 404 Not Found\nChannel does not exist or is private\n(no info leak)

    D1 --> D2 : From search engine\n[403 + Login prompt]
    D1 --> D3 : Server is public\n[Redirect to server landing]
    D1 --> D4 : Server is private OR channel not found\n[404 Not Found]
```

### 5.5 Rationale

These states were chosen to show the phases a guest can be for viewing a public channel, the states handle critical edge cases a guest can experience since the endpoints are publicily accessible such as trying to visit a private channel or channel that isn't cached. The state also has no login redirect due to the fact that this feature is supposed allow anonymous users to access public channels. Importantly each state has a clear end to each phase so the guest ins't stuck in a loop state that they can't get out off.

---

## 6. Flow Charts

### 6.1 Scenario: Guest Views Public Channel from Search Result

**Scenario Description:** A guest user clicks a search result link that leads to a public channel. The system serves the full content without any login prompts, allowing the user to immediately access the information they were searching for.

```mermaid
flowchart TD
    Start(["START: Guest clicks search result\nURL: /c/gamedev/help-and-questions?m=abc123\nReferrer: google.com search"])
    F11["F1.1 Request reaches CloudFlare edge\nCacheRouter.checkCache()"]
    CacheHit{"F1.2: Cache hit?"}
    F13["F1.3 Serve cached HTML response"]
    F14["F1.4 Forward to origin server"]
    F15["F1.5 Parse URL params\nserverSlug, channelSlug, messageId"]
    F16["F1.6 Look up channel\nChannelRepository.findBySlug(serverSlug, channelSlug)"]
    ChExists{"F1.7: Channel exists?"}
    F18["F1.8 Return 404\nChannel not found"]
    F19["F1.9 Check visibility\nVisibilityGuard.isChannelPublic(channelId)"]
    IsPublic{"F1.10: Is PUBLIC_INDEXABLE\nor PUBLIC_NO_INDEX?"}
    F111["F1.11 Handle private channel\n(See Flow 6.2)"]
    F112["F1.12 Fetch server info\nServerRepository.getPublicInfo(serverId)"]
    F113["F1.13 Fetch public channels for sidebar\nChannelRepository.findPublicByServerId()"]
    F114["F1.14 Fetch messages\nMessageService.getMessagesForPublic…7311 tokens truncated…nteger
        '403':
          description: Channel is not public
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AccessDeniedResponse'
        '404':
          description: Channel not found
        '429':
          description: Rate limit exceeded

  /api/public/servers/{serverSlug}:
    get:
      summary: Get public server information
      parameters:
        - name: serverSlug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Server info retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PublicServerDTO'
        '404':
          description: Server not found or not public

  /api/public/channels/{channelId}/messages/{messageId}:
    get:
      summary: Get single public message (deep link)
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: messageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Message retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PublicMessageDTO'
        '403':
          description: Channel is not public
        '404':
          description: Message or channel not found

  /api/public/servers/{serverSlug}/channels:
    get:
      summary: Get list of public channels in server
      parameters:
        - name: serverSlug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Public channels listed
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PublicChannelDTO'
        '404':
          description: Server not found or not public

  /s/{serverSlug}:
    get:
      summary: Server landing page (SSR)
      description: Renders server landing page with list of public channels
      parameters:
        - name: serverSlug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Server landing page HTML
          content:
            text/html:
              schema:
                type: string
        '404':
          description: Server not found or not public

components:
  schemas:
    PublicMessagesResponse:
      type: object
      properties:
        messages:
          type: array
          items:
            $ref: '#/components/schemas/PublicMessageDTO'
        pagination:
          type: object
          properties:
            page:
              type: integer
            limit:
              type: integer
            total:
              type: integer
            hasMore:
              type: boolean
            nextCursor:
              type: string

    PublicMessageDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        content:
          type: string
          description: Sanitized message content
        author:
          $ref: '#/components/schemas/PublicAuthorDTO'
        timestamp:
          type: string
          format: date-time
        editedAt:
          type: string
          format: date-time
          nullable: true
        attachments:
          type: array
          items:
            $ref: '#/components/schemas/PublicAttachmentDTO'
        permalink:
          type: string
          format: uri
          description: Direct link to this message

    PublicAuthorDTO:
      type: object
      description: Author info without exposing user ID
      properties:
        displayName:
          type: string
        avatarUrl:
          type: string
          format: uri
          nullable: true
        isBot:
          type: boolean

    PublicAttachmentDTO:
      type: object
      properties:
        id:
          type: string
        filename:
          type: string
        url:
          type: string
          format: uri
        contentType:
          type: string
        thumbnailUrl:
          type: string
          format: uri
          nullable: true

    PublicServerDTO:
      type: object
      properties:
        name:
          type: string
        slug:
          type: string
        description:
          type: string
        iconUrl:
          type: string
          format: uri
        memberCount:
          type: integer
        publicChannelCount:
          type: integer

    AccessDeniedResponse:
      type: object
      properties:
        error:
          type: string
          example: "CHANNEL_NOT_PUBLIC"
        message:
          type: string
          example: "This channel requires membership to view"
        serverSlug:
          type: string
          description: Server slug for redirect (if server is public)
```

### 10.3 Cross-Spec Event Integration

When `VISIBILITY_CHANGED` is emitted by the Channel Visibility Toggle spec:

| New Visibility | Downstream Action (Guest View Spec) |
|---------------|--------------------------------------|
| `PUBLIC_INDEXABLE` | Warm guest view cache for channel |
| `PUBLIC_NO_INDEX` | Keep guest view cache (public content, but update X-Robots-Tag) |
| `PRIVATE` | Invalidate guest view cache; return 403/404 |

### 10.4 Rationale 

The public interfaces categories appropriately define the public method this featur needs for other modules to intercat with. For the public api, the public method serve its purpose for providing the necessary entry points other modules need to allow guests to view public channels without logging in. The access controls purpose is to protect private channels from being accessed by guests, verifying that the channel is public. Content delivery and data access purpose is guest receiving the public information the channel has. 

---

## 11. Data Schemas

### 11.1 Database Tables

#### D7.1 ServersTable

**Runtime Class:** CL-D9 Server

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique server identifier | 16 bytes |
| name | VARCHAR(100) | NOT NULL | Display name | ~40 bytes |
| slug | VARCHAR(100) | NOT NULL, UNIQUE, INDEX | URL-safe identifier | ~30 bytes |
| description | TEXT | NULL | Server description | ~200 bytes |
| icon_url | VARCHAR(500) | NULL | Server icon URL | ~100 bytes |
| is_public | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether server appears in discovery | 1 byte |
| member_count | INTEGER | NOT NULL, DEFAULT 0 | Cached member count | 4 bytes |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL | Creation time | 8 bytes |

**Indexes:**
```sql
CREATE INDEX idx_servers_slug ON servers(slug);
CREATE INDEX idx_servers_public ON servers(is_public) WHERE is_public = true;
```

**Storage Estimate:** ~400 bytes per server

#### D7.2 ChannelsTable

**Runtime Class:** CL-D7 Channel

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique channel identifier | 16 bytes |
| server_id | UUID | FOREIGN KEY, NOT NULL, INDEX | Parent server | 16 bytes |
| name | VARCHAR(100) | NOT NULL | Display name | ~40 bytes |
| slug | VARCHAR(100) | NOT NULL, INDEX | URL-safe identifier (unique per server) | ~30 bytes |
| visibility | visibility_enum | NOT NULL, DEFAULT 'PRIVATE' | Visibility state | 1 byte |
| topic | TEXT | NULL | Channel topic/description | ~100 bytes |
| position | INTEGER | NOT NULL, DEFAULT 0 | Sort order | 4 bytes |
| indexed_at | TIMESTAMP WITH TIME ZONE | NULL | When channel was added to sitemap | 8 bytes |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Creation time | 8 bytes |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last modification timestamp | 8 bytes |

> **Note:** `messageCount` (shown in `PublicChannelDTO`) is computed via `COUNT(*)` query on the messages table, not stored as a column. The `visibility` column uses the `visibility_enum` type (not a boolean); see toggle spec for the `is_public` boolean on the `servers` table.

**Indexes (Canonical Set — merged from all specs):**
```sql
-- Composite index for server-scoped visibility queries (from toggle spec)
CREATE INDEX idx_channels_server_visibility ON channels(server_id, visibility);

-- Unique slug per server
CREATE UNIQUE INDEX idx_channels_server_slug ON channels(server_id, slug);

-- Partial index for all public channels (guest view queries)
CREATE INDEX idx_channels_visibility ON channels(visibility)
  WHERE visibility IN ('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX');

-- Partial index for indexable channels (sitemap generation, from toggle spec)
CREATE INDEX idx_channels_visibility_indexed ON channels(visibility, indexed_at)
  WHERE visibility = 'PUBLIC_INDEXABLE';
```

**Storage Estimate:** ~239 bytes per channel

#### D7.3 MessagesTable

**Runtime Class:** CL-D8 Message

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique message identifier | 16 bytes |
| channel_id | UUID | FOREIGN KEY, NOT NULL, INDEX | Parent channel | 16 bytes |
| author_id | UUID | FOREIGN KEY, NOT NULL | Message author | 16 bytes |
| content | TEXT | NOT NULL | Message content | ~500 bytes avg |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, INDEX | Creation time | 8 bytes |
| edited_at | TIMESTAMP WITH TIME ZONE | NULL | Last edit time | 8 bytes |
| is_deleted | BOOLEAN | NOT NULL, DEFAULT FALSE | Soft delete flag | 1 byte |

**Indexes:**
```sql
CREATE INDEX idx_messages_channel_time ON messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_channel_not_deleted ON messages(channel_id, created_at DESC)
  WHERE is_deleted = false;
```

**Storage Estimate:** ~565 bytes per message

#### D7.4 UsersTable

**Runtime Class:** CL-D10 User

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique user identifier | 16 bytes |
| username | VARCHAR(32) | NOT NULL, UNIQUE | Login username | ~20 bytes |
| display_name | VARCHAR(100) | NOT NULL | Public display name | ~40 bytes |
| avatar_url | VARCHAR(500) | NULL | Avatar image URL | ~100 bytes |
| public_profile | BOOLEAN | NOT NULL, DEFAULT TRUE | Show in public channels | 1 byte |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL | Registration time | 8 bytes |

**Storage Estimate:** ~185 bytes per user

#### D7.5 AttachmentsTable

**Runtime Class:** CL-D11 Attachment

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique attachment identifier | 16 bytes |
| message_id | UUID | FOREIGN KEY, NOT NULL, INDEX | Parent message | 16 bytes |
| filename | VARCHAR(255) | NOT NULL | Original filename | ~50 bytes |
| url | VARCHAR(500) | NOT NULL | Storage URL | ~150 bytes |
| content_type | VARCHAR(100) | NOT NULL | MIME type | ~30 bytes |
| size_bytes | BIGINT | NOT NULL | File size | 8 bytes |

**Storage Estimate:** ~270 bytes per attachment

### 11.2 Cache Schemas

#### D8.1 ChannelVisibilityCache

**Key Pattern:** `channel:{channelId}:visibility`
**Value Type:** String (enum value: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`)
**TTL:** 3600 seconds (1 hour)
**Invalidation:** On visibility change via admin toggle

#### D8.2 PublicMessagesCache

**Key Pattern:** `channel:msgs:{channelId}:page:{pageNum}`
**Value Type:** JSON array of PublicMessageDTO
**TTL:** 60 seconds
**Invalidation:** On new message in channel

#### D8.3 ServerInfoCache

**Key Pattern:** `server:{serverId}:info`
**Value Type:** JSON PublicServerDTO
**TTL:** 300 seconds (5 minutes)
**Invalidation:** On server info update

#### D8.4 GuestSessionCache

**Key Pattern:** `guest:session:{sessionId}`
**Value Type:** JSON `{ preferences: object, createdAt: timestamp }`
**TTL:** 86400 seconds (24 hours)
**Purpose:** Store guest preferences (dismissed banners, etc.)

### 11.3 Storage Estimates

| Data Type | Records (Est.) | Per Record | Total Est. | Growth Rate |
|-----------|---------------|------------|------------|-------------|
| Servers | 10,000 | 400 bytes | 4 MB | 100/month |
| Channels | 100,000 | 215 bytes | 21.5 MB | 1,000/month |
| Messages | 100,000,000 | 565 bytes | 56.5 GB | 1M/month |
| Users | 1,000,000 | 185 bytes | 185 MB | 10,000/month |
| Attachments | 10,000,000 | 270 bytes | 2.7 GB | 100,000/month |

### 11.4 Rationale 

The data schemas covers the data required for rendering the feature of public channel view. The three important tables needed being server, channels, and messages, all handle the public information that guests will be given, however the schemas clearly denote the information that will be given to guests only, meaning guests that haven't logged in. 

---

## 12. Security and Privacy

### 12.1 Temporarily Stored PII

| PII Type | Justification | Entry Point | Processing Path | Disposal | Protection |
|----------|---------------|-------------|-----------------|----------|------------|
| IP Address | Rate limiting, abuse prevention | HTTP request | RateLimiter -> Redis | TTL expiry (1 hour) | Not logged in plaintext; stored as SHA-256 hash for rate limit bucket keys |
| User Agent | Bot detection | HTTP request | BotDetector | Not stored | Used only for classification |
| Search Terms (from referrer) | Feature: highlight matching terms | HTTP Referer header | SearchHighlighter (client-side only) | Not sent to server | Client-side only; not logged |

### 12.2 Long-Term Stored PII Exposure

| PII Type | Stored Location | Exposure in Public View | Mitigation |
|----------|-----------------|------------------------|------------|
| User ID | D7.3 Messages.author_id | NOT exposed in PublicAuthorDTO | Stripped at AuthorService layer |
| Username | D7.4 Users.username | NOT exposed | Only display_name shown |
| Display Name | D7.4 Users.display_name | Exposed (user's choice) | User can opt out via public_profile |
| Avatar URL | D7.4 Users.avatar_url | Exposed (user's choice) | User can opt out via public_profile |
| Message Content | D7.3 Messages.content | Exposed (in public channels) | Content filter applied |

### 12.3 Privacy Controls

**User Privacy Settings:**
- `public_profile` flag: If false, author shown as "Anonymous" in public views
- Users can delete messages (soft delete, not shown in public view)
- Users can edit messages (edited_at shown in public view)

**Content Filtering:**
- @mentions of users with `public_profile=false` are redacted
- Email addresses detected and redacted
- Phone numbers detected and redacted
- Private channel links filtered out

### 12.4 Data Flow for Public View

```mermaid
flowchart LR
    subgraph DB["Database"]
        MsgTable["Messages table\n(id, channel_id, author_id,\ncontent, created_at, is_deleted)"]
        UsersTable["Users table\n(id, username, display_name,\navatar_url, public_profile)"]
    end

    subgraph Server["Server"]
        MsgService["MessageService\n- id → kept\n- channel_id → filtered out\n- author_id → lookup user\n- content → filter content\n- created_at → kept\n- is_deleted → if true, skip"]
        AuthService["AuthorService\n- id → NOT exposed\n- username → NOT exposed\n- display_name → getDisplayName()\n- avatar_url → if public_profile=true\n- public_profile → check flag\n\nIf public_profile=false:\n  displayName='Anonymous'\n  avatarUrl=null"]
    end

    subgraph Client["Client"]
        MsgDTO["PublicMessageDTO\n(id, content, timestamp,\nauthor: PublicAuthorDTO)"]
        AuthorDTO["PublicAuthorDTO\n(displayName, avatarUrl)\n[no userId exposed]"]
    end

    MsgTable --> MsgService --> MsgDTO
    UsersTable --> AuthService --> AuthorDTO
    MsgService --> AuthService
```

### 12.5 Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 12.6 Bot and Abuse Protection

| Protection | Implementation | Threshold |
|------------|----------------|-----------|
| Rate Limiting | Token bucket per IP | 100 req/min for humans, 1000 req/min for verified bots |
| Bot Detection | User-Agent analysis | Verified bots whitelisted |
| Scraping Prevention | CAPTCHA on suspicious patterns | After 500 page views/hour |
| DDoS Protection | CloudFlare WAF | Automatic |

### 12.7 Customer-Visible Privacy Policy Points

- Messages in public channels are visible to anyone, including search engines
- Your display name and avatar appear with your messages in public channels
- You can opt out of public display by setting your profile to private
- We do not track or store identifying information about anonymous viewers
- Search engines may cache public content; cached content remains after channel is made private

### 12.8 Guest User Restrictions

| Action | Allowed | Notes |
|--------|---------|-------|
| View public channel messages | Yes | Core feature |
| View public channel attachments | Yes | If attachment is in a public channel |
| Navigate between public channels | Yes | Via server sidebar |
| Copy message permalink | Yes | Client-side only |
| Share message/channel link | Yes | Client-side only |
| Send messages | No | Requires authentication |
| React to messages | No | Requires authentication |
| View private channels | No | Returns 403/404 |
| View member list | No | Privacy protection |
| Access user profiles | No | Only public display name and avatar shown inline |
| Download message history | No | Not exposed to guests |
| Use search within channel | No | Not available for guests (future feature) |

### 12.9 Rationale 

The security and privacy answers obvious concerns for handling messages that are publicily accessible to anyone. The restriction on guest users are enforced for security purposes such as not being able to interact with the channel without verifying who you are, meaning public channels are read only. Privacy purposes users who send messages in public channels can opt out of revealing their profile information and instead have it be anonymous. 

---

## 13. Risks to Completion

### 13.1 Technology Risks

| Technology | Learning Curve | Design Difficulty | Implementation | Verification | Maintenance |
|------------|----------------|-------------------|----------------|--------------|-------------|
| T3: Next.js SSR | Medium | Medium | Medium | Medium | Medium |
| T11: CloudFlare Edge | Medium | High | Medium | High | Low |
| T17: sanitize-html | Low | Low | Low | Medium | Low |
| T18: schema-dts | Low | Medium | Low | Medium | Low |
| T20: sharp | Low | Low | Low | Low | Low |
| T21: Lighthouse CI | Medium | Low | Medium | N/A | Low |

### 13.2 Component Risks

| Component | Risk | Mitigation |
|-----------|------|------------|
| SSR Performance | Slow TTFB affects SEO | Edge caching; ISR; streaming |
| Content Filtering | Regex performance on large content | Timeouts; message size limits |
| Infinite Scroll | SEO crawlers can't follow | Pagination fallback links; sitemap |
| Cache Invalidation | Stale content shown | Short TTLs; explicit invalidation |
| Bot Detection | False positives block real users | Verify bot list; appeal process |

### 13.3 SEO-Specific Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| JavaScript-dependent content | Crawlers may not execute JS | SSR for all content |
| Slow page load | Poor Core Web Vitals | Edge caching; image optimization |
| Duplicate content | Ranking penalty | Canonical URLs; proper pagination |
| Thin content pages | Not indexed | Minimum message threshold for indexing |
| Frequent content changes | Crawl budget waste | Last-modified headers; sitemap priority |

### 13.4 Off-the-Shelf Considerations

| Technology | Customization | Source | Support | Cost |
|------------|---------------|--------|---------|------|
| Next.js | SSR config, caching | Open source | Vercel paid | Free |
| CloudFlare | Edge rules, workers | SaaS | Paid tiers | $20+/mo |
| sanitize-html | None needed | Open source | Community | Free |
| Lighthouse CI | Thresholds | Open source | Community | Free |

### 13.5 Contingency Plans

| Risk | Trigger | Contingency |
|------|---------|-------------|
| SSR overload | > 2s TTFB p95 | Increase ISR; reduce initial messages |
| Cache stampede | Origin overload on cache miss | Stale-while-revalidate; request coalescing |
| Privacy incident | PII leaked in public view | Immediate hotfix; user notification |
| SEO ranking drop | > 20% traffic decrease | Audit with Search Console; fix issues |

### 13.6 Rationale 

The risks to completion covers the fact that an assessment was done on the tech stack chosen for learning curve, maintainability, and long term viability. The technology chosen are well documentated and have ongoing support, reducing any future risk for developing Harmony. 

---

## Appendix A: SEO Optimization Checklist

### Page Structure
- [ ] Unique, descriptive `<title>` per page
- [ ] Meta description under 160 characters
- [ ] Canonical URL on every page
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] JSON-LD structured data (DiscussionForumPosting)
- [ ] Breadcrumb schema

### Technical SEO
- [ ] Server-side rendering for all content
- [ ] Mobile-responsive design
- [ ] Fast TTFB (< 500ms)
- [ ] Core Web Vitals passing
- [ ] XML sitemap including all public channels
- [ ] robots.txt allowing crawlers
- [ ] Proper HTTP status codes (404 for missing, 403 for private)

### Content Accessibility
- [ ] All messages readable without JavaScript
- [ ] Pagination with `<link rel="next/prev">`
- [ ] Deep links to specific messages work
- [ ] Images have alt text
- [ ] Semantic HTML structure

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| SSR | Server-Side Rendering - generating HTML on the server before sending to client |
| TTFB | Time to First Byte - time until browser receives first byte of response |
| ISR | Incremental Static Regeneration - Next.js feature for updating static pages |
| Hydration | Process of attaching JavaScript event handlers to server-rendered HTML |
| Core Web Vitals | Google's metrics for page experience (LCP, FID, CLS) |
| JSON-LD | JavaScript Object Notation for Linked Data - structured data format |
| Canonical URL | The preferred URL for a page to avoid duplicate content issues |
| Stale-While-Revalidate | Cache strategy serving stale content while fetching fresh |
| Edge Worker | Code running at CDN edge locations |
| Guest User | Anonymous visitor without an account |
| EventBus | Redis Pub/Sub messaging layer for cross-service event communication |
| tRPC | End-to-end typesafe API framework for TypeScript; used for authenticated internal APIs |
| Visibility Enum | `ChannelVisibility` enum with values: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE` |

---

## Appendix C: Document References

- Dev Spec: Channel Visibility Toggle (cross-referenced for cache keys, ChannelRepository, EventBus, and `channels` table schema)
- Dev Spec: SEO Meta Tag Generation (cross-referenced for event integration and MetaTagService)
- Platform Architecture Overview (separate document)
- Harmony Security Policy (separate document)
````

#### Tool: exec_command

```sh
rtk grep -n "test-spec" docs harmony-frontend | head -n 200
```

Output:

```text
🔍 0 for 'test-spec'
```

#### Tool: exec_command

```sh
rtk grep -n "publicApiService" -S
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:41:14.299Z

I have the service behavior and the linked feature spec. Next I’m checking the docs tree for any existing test-spec conventions and then I’ll draft the new spec directly against the actual execution paths in `publicApiService.ts`.

#### Tool: exec_command

```sh
rtk tree docs -L 2
```

Output:

```text
Error: tree command not found. Install it first:
- macOS: brew install tree
- Ubuntu/Debian: sudo apt install tree
- Fedora/RHEL: sudo dnf install tree
- Arch: sudo pacman -S tree
```

#### Tool: exec_command

```sh
rtk grep -n "## .*Test|# .*Test|Mock Strategy|Expected Output" docs -S
```

Output:

```text
🔍 57 in 5F:

📄 docs/test-specs/auth-service-spec.md (8):
     1: # Auth Service Test Specification
    19: ## 2. Shared Test Setup and Assumptions
   125: ## 4. Detailed Test Cases
   131: | Test Purpose | Inputs | Expected Output |
   153: | Test Purpose | Inputs | Expected Output |
   170: | Test Purpose | Inputs | Expected Output |
   181: | Test Purpose | Inputs | Expected Output |
   199: | Test Purpose | Inputs | Expected Output |

📄 docs/test-specs/frontend-channel-service-spec.md (11):
     1: # Channel Service Test Specification (Frontend)
    18: ## 2. Shared Test Setup and Assumptions
   108: ## 4. Detailed Test Cases
   114: | Test Purpose | Inputs | Expected Output |
   125: | Test Purpose | Inputs | Expected Output |
   142: | Test Purpose | Inputs | Expected Output |
   153: | Test Purpose | Inputs | Expected Output |
   165: | Test Purpose | Inputs | Expected Output |
   176: | Test Purpose | Inputs | Expected Output |
   194: | Test Purpose | Inputs | Expected Output |
  +1

📄 docs/test-specs/frontend-server-service-spec.md (15):
     1: # Server Service Test Specification (Frontend)
    22: ## 2. Shared Test Setup and Assumptions
   144: ## 4. Detailed Test Cases
   150: | Test Purpose | Inputs | Expected Output |
   163: | Test Purpose | Inputs | Expected Output |
   178: | Test Purpose | Inputs | Expected Output |
   191: | Test Purpose | Inputs | Expected Output |
   209: | Test Purpose | Inputs | Expected Output |
   224: | Test Purpose | Inputs | Expected Output |
   234: | Test Purpose | Inputs | Expected Output |
  +5

📄 docs/test-specs/server-member-service-spec.md (9):
     1: # Server Member Service Test Specification
    17: ## 2. Shared Test Setup and Assumptions
    97: ## 4. Detailed Test Cases
   103: | Test Purpose                                     | Inputs                  ...
   112: | Test Purpose                                 | Inputs                      ...
   124: | Test Purpose                                | Inputs                       ...
   135: | Test Purpose                                       | Inputs                ...
   146: | Test Purpose                                                               ...
   161: | Test Purpose                                          | Inputs             ...

📄 docs/test-specs/server-service-spec.md (14):
     1: # Server Service Test Specification
    24: ## 2. Shared Test Setup and Assumptions
   162: ## 4. Detailed Test Cases
   168: | Test Purpose                                            | Inputs           ...
   184: | Test Purpose                                     | Inputs                  ...
   196: | Test Purpose                           | Inputs                            ...
   207: | Test Purpose                                 | Inputs                      ...
   218: | Test Purpose                    | Inputs                                   ...
   227: | Test Purpose                                                   | Inputs    ...
   243: | Test Purpose                                                 | Inputs      ...
  +4

... +10
```

#### Tool: exec_command

```sh
rtk grep -n "PUBLIC_NO_INDEX|PUBLIC_INDEXABLE|PRIVATE" harmony-frontend/src/types -S
```

Output:

```text
🔍 3 in 1F:

📄 harmony-frontend/src/types/channel.ts (3):
    27: PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',
    28: PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',
    29: PRIVATE = 'PRIVATE',
```

#### Tool: exec_command

```sh
rtk read docs/test-specs/frontend-channel-service-spec.md
```

Output:

````text
# Channel Service Test Specification (Frontend)

## 1. Overview

This document defines the English-language test specification for `harmony-frontend/src/services/channelService.ts`.
It covers all seven exported service functions:

- `getChannels`
- `getChannel`
- `updateVisibility`
- `updateChannel`
- `createChannel`
- `getAuditLog`
- `deleteChannel`

The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.

## 2. Shared Test Setup and Assumptions

- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.
- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path.
- Reset all mocks between tests to ensure isolation.
- Use `console.warn` spies to assert that `toFrontendChannel` and `toAuditLogEntry` emit validation warnings for malformed API responses.
- The `getChannel` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.
- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.
- `ChannelVisibility` enum values under test: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`.

## 3. Function Purposes and Program Paths

### 3.1 `getChannels`

Purpose: fetch all channels for a server (including PRIVATE channels) via the authenticated tRPC `channel.getChannels` endpoint.

Program paths:

- `trpcQuery` resolves with a non-empty array; each raw record is adapted and returned.
- `trpcQuery` resolves with `null` or `undefined`; the function returns `[]`.
- `trpcQuery` rejects; the error propagates to the caller uncaught.

### 3.2 `getChannel`

Purpose: return a single channel by server slug and channel slug, or `null` if not found. Tries the public REST endpoint first to support unauthenticated guest views, then falls back to authenticated tRPC.

Program paths:

- `publicGet` for the server resolves with `null`; function returns `null` immediately.
- `publicGet` for the server rejects; the rejection propagates uncaught to the caller (this call sits outside both `try` blocks).
- Server resolves; public channel list resolves and contains a matching slug; channel is returned with `visibility` hardcoded to `PUBLIC_INDEXABLE`.
- Server resolves; public channel list resolves with `null`; falls through to tRPC fallback.
- Server resolves; public channel list resolves but contains no matching slug; falls through to tRPC fallback.
- Server resolves; public channel list `publicGet` call throws; falls through to tRPC fallback.
- tRPC fallback resolves with channel data; channel is returned.
- tRPC fallback resolves with `null`/falsy; function returns `null`.
- tRPC fallback rejects; function catches the error, logs it, and returns `null`.

### 3.3 `updateVisibility`

Purpose: update a channel's visibility via the authenticated tRPC `channel.setVisibility` mutation. Returns `void`.

Program paths:

- `trpcMutate` resolves; function returns `void`.
- `trpcMutate` rejects; error propagates to the caller.

### 3.4 `updateChannel`

Purpose: update a channel's `name` and/or `topic` metadata via tRPC. Only defined patch keys are forwarded.

Program paths:

- Patch includes both `name` and `topic`; both are forwarded and the adapted result is returned.
- Patch includes only `name` (no `topic`); only `name` is forwarded.
- Patch includes only `topic` (no `name`); only `topic` is forwarded.
- Patch is empty (`{}`); neither key is forwarded; adapted result is still returned.
- `trpcMutate` rejects; error propagates to the caller.

### 3.5 `createChannel`

Purpose: create a new channel via tRPC `channel.createChannel` and return the adapted `Channel`.

Program paths:

- All required fields are provided; `trpcMutate` resolves; adapted channel is returned.
- `trpcMutate` rejects; error propagates to the caller.

### 3.6 `getAuditLog`

Purpose: fetch a paginated visibility audit log for a channel via tRPC `channel.getAuditLog`.

Program paths:

- `trpcQuery` resolves with a populated `entries` array and `total`; each entry is adapted and returned.
- `trpcQuery` resolves with an empty `entries` array; returns `{ entries: [], total: 0 }`.
- Options are partially provided (`limit` only, `offset` only, or `startDate` only); present keys are forwarded.
- Options are omitted entirely; query is called with only `serverId` and `channelId`.
- An entry has an invalid or missing `timestamp`; `toAuditLogEntry` falls back to epoch ISO string and emits a `console.warn`.
- `trpcQuery` rejects; error propagates to the caller.

### 3.7 `deleteChannel`

Purpose: delete a channel via tRPC and return `true` on success.

Program paths:

- `trpcMutate` resolves; function returns `true`.
- `trpcMutate` rejects; error propagates to the caller.

## 4. Detailed Test Cases

### 4.1 `getChannels`

Description: fetches the full channel list for a server, adapting each record from the raw backend shape.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted channels for a server | `serverId = "s1"`; `trpcQuery` resolves with two valid raw channel records | Returns an array of two `Channel` objects with all fields correctly mapped |
| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` | Returns `[]` |
| Return empty array when API returns undefined | `serverId = "s1"`; `trpcQuery` resolves with `undefined` | Returns `[]` |
| Propagate rejection to caller | `serverId = "s1"`; `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |

### 4.2 `getChannel`

Description: fetches a single channel by slug pair, attempting the public REST endpoint before falling back to authenticated tRPC.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return null when server lookup fails | `serverSlug = "my-server"`; `publicGet` for server resolves with `null` | Returns `null`; no further network calls are made |
| Propagate rejection when server lookup rejects | `serverSlug = "my-server"`; `publicGet` for server rejects with a network error | Promise rejects with the same error; rejection is not caught |
| Return channel from public endpoint on slug match | Server resolves; public channel list contains a record with matching `channelSlug` | Returns `Channel` with `visibility = PUBLIC_INDEXABLE`; `serverId` filled from server lookup |
| Supplement missing public fields with defaults | Public channel record omits `position` and `createdAt` | Returned channel has `position = 0` and `createdAt` equal to epoch ISO string |
| Fall through to tRPC when public channel list returns null | Server resolves; `publicGet` for channels resolves with `null`; tRPC resolves with channel data | Returns the tRPC-adapted `Channel`; does not log an error |
| Fall through to tRPC when slug not in public list | Server resolves; public channel list has no matching slug; tRPC resolves with channel data | Returns the tRPC-adapted `Channel` |
| Fall through to tRPC when public endpoint throws | Server resolves; public channels `publicGet` throws; tRPC resolves with channel data | Returns the tRPC-adapted `Channel`; thrown error is swallowed silently |
| Return null when tRPC resolves with falsy value | Server resolves; public endpoint miss; tRPC resolves with `null` | Returns `null` |
| Return null when tRPC rejects | Server resolves; public endpoint miss; tRPC rejects | Returns `null`; logs error via `console.error` |
| Correctly set visibility to PUBLIC_INDEXABLE for public hit | Server resolves; public list match with any `visibility` value in raw record | Returned channel always has `visibility = PUBLIC_INDEXABLE` regardless of raw field |

### 4.3 `updateVisibility`

Description: sends a visibility mutation to the backend with no return value.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Successfully set visibility to PUBLIC_INDEXABLE | `channelId = "c1"`, `visibility = PUBLIC_INDEXABLE`, `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, channelId, visibility }` |
| Successfully set visibility to PUBLIC_NO_INDEX | `channelId = "c1"`, `visibility = PUBLIC_NO_INDEX`, `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with correct args |
| Successfully set visibility to PRIVATE | `channelId = "c1"`, `visibility = PRIVATE`, `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with correct args |
| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the same error |

### 4.4 `updateChannel`

Description: sends partial channel metadata updates, forwarding only the keys that are explicitly set.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Update both name and topic | `patch = { name: "general", topic: "chat" }`; `trpcMutate` resolves with a full channel record | Returns adapted `Channel`; mutation called with `name` and `topic` |
| Update name only | `patch = { name: "general" }`; `trpcMutate` resolves | Returns adapted `Channel`; mutation called without `topic` key |
| Update topic only | `patch = { topic: "new topic" }`; `trpcMutate` resolves | Returns adapted `Channel`; mutation called without `name` key |
| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Channel`; mutation called with only `serverId` and `channelId` |
| Propagate rejection to caller | Valid patch; `trpcMutate` rejects | Promise rejects with the underlying error |

### 4.5 `createChannel`

Description: creates a new channel and returns the backend-confirmed record.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Create channel with all fields | Full `Channel` object minus `id`, `createdAt`, `updatedAt`; `trpcMutate` resolves with full record | Returns adapted `Channel`; mutation called with `serverId`, `name`, `slug`, `type`, `visibility`, `topic`, and `position`; `description` is not forwarded |
| Create channel with optional fields absent | `topic` omitted; `description` is accepted in the input type but not forwarded to the mutation; `trpcMutate` resolves | Returns adapted `Channel`; `topic` passed as `undefined` in mutation args; `description` not present in mutation payload |
| Create channel with each visibility value | `visibility = PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, or `PRIVATE`; `trpcMutate` resolves | Returns adapted `Channel` with the correct `visibility` field |
| Propagate rejection to caller | Valid input; `trpcMutate` rejects | Promise rejects with the underlying error |

### 4.6 `getAuditLog`

Description: fetches a paginated audit log, adapting each entry and validating field types.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return entries and total from API | `serverId`, `channelId`; `trpcQuery` resolves with two valid entries and `total = 2` | Returns `{ entries: [AuditLogEntry, AuditLogEntry], total: 2 }` |
| Return empty list | `serverId`, `channelId`; `trpcQuery` resolves with `{ entries: [], total: 0 }` | Returns `{ entries: [], total: 0 }` |
| Forward limit option | `options = { limit: 10 }`; `trpcQuery` resolves | `trpcQuery` called with `{ serverId, channelId, limit: 10 }` |
| Forward offset option | `options = { offset: 5 }`; `trpcQuery` resolves | `trpcQuery` called with `{ serverId, channelId, offset: 5 }` |
| Forward startDate option | `options = { startDate: "2026-01-01T00:00:00.000Z" }`; `trpcQuery` resolves | `trpcQuery` called with `{ serverId, channelId, startDate: "2026-01-01T00:00:00.000Z" }` |
| Omit options when none provided | `options` not passed; `trpcQuery` resolves | `trpcQuery` called with only `serverId` and `channelId` |
| Fall back to epoch string for non-string timestamp | Entry has `timestamp = 42` (a number); `trpcQuery` resolves | `AuditLogEntry.timestamp` equals epoch ISO; `console.warn` emitted |
| Fall back to epoch string for invalid timestamp | Entry has `timestamp = "not-a-date"`; `trpcQuery` resolves | `AuditLogEntry.timestamp` equals epoch ISO; `console.warn` emitted |
| Fall back to epoch string for missing timestamp | Entry has no `timestamp` field; `trpcQuery` resolves | `AuditLogEntry.timestamp` equals epoch ISO; `console.warn` emitted |
| Warn only on missing/non-string core fields | Entry has missing or non-string `id`, `channelId`, `actorId`, or `action`; `trpcQuery` resolves | Each problematic core field emits a `console.warn`; function still returns an entry; no warnings expected for `oldValue`, `newValue`, `ipAddress`, or `userAgent` |
| Propagate rejection to caller | Valid args; `trpcQuery` rejects | Promise rejects with the underlying error |

### 4.7 `deleteChannel`

Description: deletes a channel and signals success via a boolean return value.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return true on successful deletion | `channelId = "c1"`, `serverId = "s1"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ serverId, channelId }` |
| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |

## 5. Edge Cases to Explicitly Validate

- `getChannels` must not suppress transport errors; callers that use the channel count for position computation depend on the error surfacing to avoid data corruption.
- `getChannel` uses `cache()` wrapping; test the inner async function directly by mocking at the transport layer.
- The public REST hit in `getChannel` always overrides the raw `visibility` field with `PUBLIC_INDEXABLE`; the test must confirm this even when the raw record contains a different value.
- Missing `position` and `createdAt` from public channel records are filled with defaults (`0` and epoch ISO); tests should assert these exact defaults.
- `updateChannel` must only forward `name` and `topic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.
- `toFrontendChannel` emits `console.warn` when any of its guarded fields (`id`, `serverId`, `slug`, `createdAt`) are missing or non-string; tests should cover at least one warning for each. `toAuditLogEntry` emits `console.warn` when any of its guarded fields (`id`, `channelId`, `actorId`, `action`) are missing or non-string; tests should likewise exercise each warning condition at least once. No warnings are emitted for `oldValue`, `newValue`, `ipAddress`, or `userAgent`.
- `toAuditLogEntry` falls back to an epoch ISO timestamp for any non-string or unparseable `timestamp` value; all three cases (non-string, invalid-string, missing) must be tested, and corresponding `console.warn` calls should be asserted.
- All three `ChannelVisibility` values (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`) must appear in at least one test for `updateVisibility` and `createChannel`.

## 6. Mock Strategy

All external dependencies are mocked at the module level with `jest.mock`:

```
jest.mock('@/lib/trpc-client', () => ({
  trpcQuery:  jest.fn(),
  trpcMutate: jest.fn(),
  publicGet:  jest.fn(),
}));
```

Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.

- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` to test propagation; resolve with `null`/`undefined` to test null-guard branches.
- **`trpcMutate`** — resolve to test `updateVisibility`, `updateChannel`, `createChannel`, and `deleteChannel` happy paths; reject to test error propagation in each.
- **`publicGet`** — resolve with a server object (containing at minimum `{ id: "s1" }`) to simulate a successful server lookup; resolve with `null` to test the early-return path; resolve with a channels payload or throw to test the public channel list branches.
- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings; restore spies in `afterEach`.

## 7. Coverage Expectation

The cases above are intended to cover:

- all seven exported functions,
- every explicit null-guard and early-return branch,
- successful transport call paths and their return value adaption,
- all transport rejection paths and their propagation behavior,
- public-REST-to-tRPC fallback logic in `getChannel`,
- all three `ChannelVisibility` enum values,
- field-level validation warnings in `toFrontendChannel` and `toAuditLogEntry`, and
- optional field defaults (missing `position`, `createdAt`, `topic`).

Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.
````

#### Tool: exec_command

```sh
rtk read docs/test-specs/frontend-server-service-spec.md
```

Output:

````text
# Server Service Test Specification (Frontend)

## 1. Overview

This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.
It covers all eleven exported service functions:

- `getServers`
- `getServer`
- `getServerAuthenticated`
- `getServerMembers`
- `updateServer`
- `deleteServer`
- `joinServer`
- `createServer`
- `getServerMembersWithRole`
- `changeMemberRole`
- `removeMember`

The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.

## 2. Shared Test Setup and Assumptions

- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.
- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.
- Reset all mocks between tests to ensure isolation.
- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.
- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.
- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.
- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.
- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.
- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.

## 3. Function Purposes and Program Paths

### 3.1 `getServers`

Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.

Program paths:

- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.
- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.
- `trpcQuery` rejects; the error propagates to the caller uncaught.

### 3.2 `getServer`

Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.

Program paths:

- `publicGet` resolves with a valid server record; adapted `Server` is returned.
- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.
- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.

### 3.3 `getServerAuthenticated`

Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.

Program paths:

- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.
- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.
- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.

### 3.4 `getServerMembers`

Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).

Program paths:

- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.
- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.
- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.

### 3.5 `updateServer`

Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.

Program paths:

- Patch includes all four editable fields; all are forwarded and the adapted result is returned.
- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.
- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

### 3.6 `deleteServer`

Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.

Program paths:

- `trpcMutate` resolves; function returns `true`.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

### 3.7 `joinServer`

Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.

Program paths:

- `trpcMutate` resolves; function returns `void`.
- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.

### 3.8 `createServer`

Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default "general" channel. `isPublic` defaults to `false` when omitted from the input.

Program paths:

- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.
- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

### 3.9 `getServerMembersWithRole`

Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.

Program paths:

- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.
- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.
- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.
- `trpcQuery` rejects; the error propagates to the caller uncaught.

### 3.10 `changeMemberRole`

Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.

Program paths:

- `trpcMutate` resolves; function returns `void`.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

### 3.11 `removeMember`

Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.

Program paths:

- `trpcMutate` resolves; function returns `void`.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

## 4. Detailed Test Cases

### 4.1 `getServers`

Description: fetches the full list of public servers, adapting each record from the raw backend shape.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |
| Return empty array when API returns null | `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |
| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |
| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |
| Map iconUrl to icon field | Raw record has `iconUrl: "https://example.com/icon.png"` and no `icon` field | Returned `Server.icon` equals `"https://example.com/icon.png"` |
| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |

### 4.2 `getServer`

Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted server for valid API response | `slug = "my-server"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |
| Return null for 404 (publicGet resolves null) | `slug = "my-server"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |
| Return null when API rejects with network error | `slug = "my-server"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |
| Return null when API rejects with 401 | `slug = "my-server"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |
| URL-encodes the slug | `slug = "my server"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |
| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"id"` |
| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"slug"` |
| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"createdAt"` |

### 4.3 `getServerAuthenticated`

Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted server for valid API response | `slug = "my-server"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |
| Return null when API returns null | `slug = "my-server"`; `trpcQuery` resolves with `null` | Returns `null` |
| Return null when API returns falsy | `slug = "my-server"`; `trpcQuery` resolves with `false` | Returns `null` |
| Return null when API rejects with 401 | `slug = "my-server"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |
| Return null when API rejects with 403 | `slug = "my-server"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |
| Forward slug to tRPC query | `slug = "test-server"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: "test-server" })` |

### 4.4 `getServerMembers`

Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted members for valid API response | `serverId = "s1"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |
| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |
| Return empty array when API rejects with network error | `serverId = "s1"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |
| Return empty array when API rejects with 401 | `serverId = "s1"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |
| Map OWNER role to owner | Raw member has `role: "OWNER"` | Returned `User.role` equals `"owner"` |
| Map ADMIN role to admin | Raw member has `role: "ADMIN"` | Returned `User.role` equals `"admin"` |
| Map unknown role to member | Raw member has `role: "SUPERUSER"` | Returned `User.role` equals `"member"` |
| Map ONLINE status to online | Raw member's user has `status: "ONLINE"` | Returned `User.status` equals `"online"` |
| Map DND status to dnd | Raw member's user has `status: "DND"` | Returned `User.status` equals `"dnd"` |
| Map unknown status to offline | Raw member's user has `status: "INVISIBLE"` | Returned `User.status` equals `"offline"` |
| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |

### 4.5 `updateServer`

Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Update all four editable fields | `patch = { name: "New", description: "Desc", icon: "url", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |
| Update name only | `patch = { name: "New Name" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |
| Update description only | `patch = { description: "New desc" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |
| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |
| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |
| Map icon patch key to iconUrl mutation key | `patch = { icon: "https://example.com/img.png" }`; `trpcMutate` resolves | Mutation receives `iconUrl: "https://example.com/img.png"` and no `icon` key |
| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |
| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |

### 4.6 `deleteServer`

Description: deletes a server and signals success via a boolean return value.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return true on successful deletion | `id = "s1"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: "s1" }` |
| Propagate 401 unauthorized rejection | `id = "s1"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |
| Propagate rejection to caller | `id = "s1"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |

### 4.7 `joinServer`

Description: joins a public server; throws on private servers or duplicate membership.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return void on successful join | `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: "s1" }` |
| Propagate 401 unauthorized rejection | `serverId = "s1"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |
| Propagate rejection for private server | `serverId = "s1"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
| Propagate rejection for duplicate membership | `serverId = "s1"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |

### 4.8 `createServer`

Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Create server with all fields | `input = { name: "My Server", description: "Desc", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |
| Default isPublic to false when omitted | `input = { name: "My Server" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |
| Create public server | `input = { name: "My Server", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |
| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |
| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |

### 4.9 `getServerMembersWithRole`

Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted member info for valid response | `serverId = "s1"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |
| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |
| Map OWNER role to owner | Raw entry has `role: "OWNER"` | Returned `ServerMemberInfo.role` equals `"owner"` |
| Map MODERATOR role to moderator | Raw entry has `role: "MODERATOR"` | Returned `ServerMemberInfo.role` equals `"moderator"` |
| Map unknown role to member fallback | Raw entry has `role: "SUPERUSER"` | Returned `ServerMemberInfo.role` equals `"member"` |
| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |
| Forward displayName from user | Raw entry's user has `displayName: "Alice"` | Returned `ServerMemberInfo.displayName` equals `"Alice"` |
| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |
| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |
| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |

### 4.10 `changeMemberRole`

Description: changes a server member's role via a tRPC mutation.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Change role to ADMIN | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "ADMIN"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "ADMIN" }` |
| Change role to MODERATOR | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "MODERATOR"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "MODERATOR" }` |
| Change role to MEMBER | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "MEMBER"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "MEMBER" }` |
| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |
| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |

### 4.11 `removeMember`

Description: removes a server member via a tRPC mutation.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return void on successful removal | `serverId = "s1"`, `targetUserId = "u1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: "s1", targetUserId: "u1" }` |
| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |
| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |

## 5. Edge Cases to Explicitly Validate

- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.
- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.
- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.
- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.
- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.
- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.
- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.
- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.
- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.
- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.
- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.
- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.
- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.

## 6. Mock Strategy

> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.

All external dependencies are mocked at the module level with `jest.mock`:

```
jest.mock('@/lib/trpc-client', () => ({
  trpcQuery:  jest.fn(),
  trpcMutate: jest.fn(),
  publicGet:  jest.fn(),
}));
```

Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.

- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code for 401/403/404) to test propagation; resolve with `null` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`. Note: `trpcQuery` throws rather than resolving `undefined` (see implementation in `@/lib/trpc-client.ts`), so `undefined` is not a valid mock return value.
- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.
- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.
- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.

### Fixture Shapes

Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.

**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):

```
{
  id: "server-1",
  name: "Test Server",
  slug: "test-server",
  iconUrl: undefined,
  description: undefined,
  bannerUrl: undefined,
  memberCount: 5,
  createdAt: "2026-01-01T00:00:00.000Z",
}
```

**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):

```
{
  id: "server-1",
  name: "Test Server",
  slug: "test-server",
  ownerId: "user-1",
  iconUrl: undefined,
  icon: undefined,
  description: undefined,
  bannerUrl: undefined,
  memberCount: 5,
  isPublic: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}
```

**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):

```
{
  userId: "user-1",
  serverId: "server-1",
  role: "MEMBER",
  joinedAt: "2026-01-01T00:00:00.000Z",
  user: {
    id: "user-1",
    username: "alice",
    displayName: "Alice",
    avatarUrl: null,
    status: "ONLINE",
  },
}
```

## 7. Coverage Expectation

The cases above are intended to cover:

- all eleven exported functions,
- every explicit null-guard and early-return branch,
- successful transport call paths and their return value adaptation,
- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,
- the `publicGet`-based REST path in `getServer` and its error swallowing,
- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,
- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),
- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,
- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),
- `updateServer` selective key forwarding (all four keys individually and combined), and
- the `isPublic` default (`false`) in `createServer`.

Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.
````

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/types/channel.ts
```

Output:

```text
/**
 * Type Definitions: Channel
 * Based on dev spec data schemas
 */

export enum ChannelType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  slug: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  topic?: string;
  position: number;
  description?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export enum ChannelVisibility {
  PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',
  PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',
  PRIVATE = 'PRIVATE',
}

export interface ChannelDTO {
  id: string;
  serverId: string;
  name: string;
  slug: string;
  description?: string;
  visibility: ChannelVisibility;
  memberCount?: number;
}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:41:31.543Z

I’m at the point of making file changes: first the local task tracker required by `WORKFLOW.md`, then the spec document in `docs/test-specs/`, keeping the format aligned with the existing frontend service specs.

#### Tool: mcp__codex_apps__github_add_comment_to_issue

```json
{
  "repo_full_name": "acabrera04/Harmony",
  "pr_number": 289,
  "comment": "**[AI Agent — Starting]**\n\nI’m drafting the frontend test specification for `harmony-frontend/src/services/publicApiService.ts` and aligning it to the guest public channel view behavior described in `docs/dev-spec-guest-public-channel-view.md`.\n\nI’ve already pulled the issue requirements, the repository workflow rules, the target service implementation, and existing test-spec examples. Next I’m writing the spec to cover all six functions, their happy/error paths, guest visibility semantics, and the required mock strategy."
}
```

Output:

```text
{"id":4184927243}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:42:09.970Z

I’ve got enough context to draft the actual spec now. I’m encoding the real branch behavior of `publicApiService.ts`, including the null/empty fallbacks and the 403-versus-404 distinctions, rather than restating only the issue text.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:43:36.668Z

The spec draft is in place. I’m reviewing it against the acceptance criteria now and updating the task tracker before I post the completion note back to the issue.

#### Tool: exec_command

```sh
rtk read docs/test-specs/frontend-public-api-service-spec.md
```

Output:

````text
# Public API Service Test Specification (Frontend)

## 1. Overview

This document defines the English-language test specification for [`harmony-frontend/src/services/publicApiService.ts`](/Users/allen/.codex/worktrees/9495/Harmony/harmony-frontend/src/services/publicApiService.ts).
It covers all six functions in the module:

- `mapChannelType`
- `mapChannelVisibility`
- `fetchPublicServer`
- `fetchPublicChannel`
- `fetchPublicMessages`
- `isChannelGuestAccessible`

These tests support the guest public channel view flow for `/c/{serverSlug}/{channelSlug}` and should be read alongside [`docs/dev-spec-guest-public-channel-view.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/dev-spec-guest-public-channel-view.md), which defines the product semantics:

- `PUBLIC_INDEXABLE`: guest-accessible and indexable by search engines
- `PUBLIC_NO_INDEX`: guest-accessible but not indexable
- `PRIVATE`: not guest-accessible; public-channel requests should be denied rather than rendered

The goal is to cover the success paths, explicit error handling, guest visibility semantics, and cache-safe fallbacks needed to reach at least 80% of the file's reachable execution paths.

## 2. Shared Test Setup and Assumptions

- Mock `global.fetch` with Jest or Vitest so tests can control `ok`, `status`, and `json()` behavior for each request.
- Mock React's `cache` as an identity wrapper so the cached exports remain callable without cross-test memoization:

```ts
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: <T extends (...args: any[]) => any>(fn: T) => fn,
}));
```

- Reset all mocks between tests to avoid leakage between cached and non-cached scenarios.
- Use response fixtures that match the file's internal API shapes:
  - `PublicServerResponse`
  - `PublicChannelResponse`
  - `PublicMessagesApiResponse`
- When asserting request construction, verify that `encodeURIComponent` is reflected in the URL for `serverSlug`, `channelSlug`, and `channelId`.
- For `fetchPublicServer` and `fetchPublicChannel`, assert that `fetch` receives `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }`.
- For `fetchPublicMessages`, assert that the request omits the React-cache wrapper and uses the expected `?page=` query string.
- The spec intentionally treats React `cache()` internals as framework behavior, not service logic. Tests should validate observable service behavior, not React memoization implementation details.

## 3. Function Purposes and Program Paths

### 3.1 `mapChannelType`

Purpose: normalize backend channel type strings into the frontend `ChannelType` enum.

Program paths:

- Input is `'VOICE'`; returns `ChannelType.VOICE`.
- Input is `'ANNOUNCEMENT'`; returns `ChannelType.ANNOUNCEMENT`.
- Input is any other string; returns `ChannelType.TEXT`.

### 3.2 `mapChannelVisibility`

Purpose: normalize backend visibility strings into the frontend `ChannelVisibility` enum.

Program paths:

- Input is `'PUBLIC_NO_INDEX'`; returns `ChannelVisibility.PUBLIC_NO_INDEX`.
- Input is `'PRIVATE'`; returns `ChannelVisibility.PRIVATE`.
- Input is `'PUBLIC_INDEXABLE'` or any unknown string; returns `ChannelVisibility.PUBLIC_INDEXABLE`.

### 3.3 `fetchPublicServer`

Purpose: fetch public server metadata by slug for the guest public channel page. Returns `null` for any non-success result so server-side rendering can fail closed without throwing.

Program paths:

- `fetch` resolves with `ok = true`; JSON is mapped into a `PublicServer` object and returned.
- `fetch` resolves with `ok = false` (including 403, 404, or 500); returns `null`.
- `fetch` rejects; returns `null`.

### 3.4 `fetchPublicChannel`

Purpose: fetch a single public channel by `serverSlug` and `channelSlug` while preserving the distinction between missing content and private content.

Program paths:

- `fetch` resolves with `status = 404`; returns `null`.
- `fetch` resolves with `status = 403`; returns `{ isPrivate: true }`.
- `fetch` resolves with another non-OK status; returns `null`.
- `fetch` resolves with `ok = true`; JSON is mapped into `Channel` and returned as `{ channel, isPrivate: false }`.
- `fetch` rejects; returns `null`.

### 3.5 `fetchPublicMessages`

Purpose: fetch paginated guest-visible messages for a public channel. Returns an empty result on any failure so the page can render safely without crashing.

Program paths:

- `fetch` resolves with `ok = true`; API messages are mapped into frontend `Message` objects and `hasMore` is derived from `messages.length >= pageSize`.
- `fetch` resolves with `ok = false`; returns `{ messages: [], hasMore: false }`.
- `fetch` rejects; returns `{ messages: [], hasMore: false }`.

### 3.6 `isChannelGuestAccessible`

Purpose: provide a boolean answer for whether a guest can access a channel based on `fetchPublicChannel`.

Program paths:

- `fetchPublicChannel` returns `{ channel, isPrivate: false }`; returns `true`.
- `fetchPublicChannel` returns `{ isPrivate: true }`; returns `false`.
- `fetchPublicChannel` returns `null`; returns `false`.

## 4. Detailed Test Cases

### 4.1 `mapChannelType`

Description: maps backend strings to the frontend enum with a TEXT default.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Map voice channels correctly | `type = "VOICE"` | Returns `ChannelType.VOICE` |
| Map announcement channels correctly | `type = "ANNOUNCEMENT"` | Returns `ChannelType.ANNOUNCEMENT` |
| Default unknown values to text | `type = "TEXT"`, `"UNKNOWN"`, or `""` | Returns `ChannelType.TEXT` |

### 4.2 `mapChannelVisibility`

Description: maps backend visibility strings to the frontend enum and preserves guest-visibility semantics from the guest public channel view spec.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Preserve no-index public visibility | `visibility = "PUBLIC_NO_INDEX"` | Returns `ChannelVisibility.PUBLIC_NO_INDEX`; semantics remain guest-accessible but not search-indexable |
| Preserve private visibility | `visibility = "PRIVATE"` | Returns `ChannelVisibility.PRIVATE`; semantics remain not guest-accessible |
| Preserve indexable public visibility | `visibility = "PUBLIC_INDEXABLE"` | Returns `ChannelVisibility.PUBLIC_INDEXABLE`; semantics remain guest-accessible and indexable |
| Default unknown visibility to indexable public | `visibility = "UNRECOGNIZED_VALUE"` | Returns `ChannelVisibility.PUBLIC_INDEXABLE` as the helper's safe default |

### 4.3 `fetchPublicServer`

Description: fetches public server metadata and suppresses all failures by returning `null`.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped public server on success | `serverSlug = "gamedev"`; `fetch` resolves `200` with a valid `PublicServerResponse` | Returns a server object with `iconUrl` mapped to `icon`, and the remaining fields copied correctly |
| URL-encode the server slug | `serverSlug = "game dev"`; `fetch` resolves successfully | `fetch` is called with `/api/public/servers/game%20dev` |
| Forward ISR revalidation options | Valid slug; `fetch` resolves successfully | `fetch` is called with `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }` |
| Return null on 404 | Valid slug; `fetch` resolves with `ok = false`, `status = 404` | Returns `null` |
| Return null on 403 | Valid slug; `fetch` resolves with `ok = false`, `status = 403` | Returns `null` |
| Return null on generic server error | Valid slug; `fetch` resolves with `ok = false`, `status = 500` | Returns `null` |
| Return null on network rejection | Valid slug; `fetch` rejects with a network error | Returns `null`; promise does not reject |

### 4.4 `fetchPublicChannel`

Description: fetches a guest-visible channel and distinguishes private-channel denial from missing-channel fallback.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped public channel on success | `serverSlug = "gamedev"`, `channelSlug = "help"`; `fetch` resolves `200` with a valid `PublicChannelResponse` | Returns `{ channel, isPrivate: false }` with `type`, `visibility`, and `topic` mapped correctly |
| Map `VOICE` channel type | Successful `200` response with `type = "VOICE"` | Returned `channel.type` is `ChannelType.VOICE` |
| Map `ANNOUNCEMENT` channel type | Successful `200` response with `type = "ANNOUNCEMENT"` | Returned `channel.type` is `ChannelType.ANNOUNCEMENT` |
| Default unknown channel type to text | Successful `200` response with `type = "UNSUPPORTED"` | Returned `channel.type` is `ChannelType.TEXT` |
| Preserve `PUBLIC_INDEXABLE` on success | Successful `200` response with `visibility = "PUBLIC_INDEXABLE"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_INDEXABLE` |
| Preserve `PUBLIC_NO_INDEX` on success | Successful `200` response with `visibility = "PUBLIC_NO_INDEX"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_NO_INDEX` |
| Preserve `PRIVATE` value when returned in a 200 payload | Successful `200` response with `visibility = "PRIVATE"` | Returned `channel.visibility` is `ChannelVisibility.PRIVATE`; this is a mapper assertion even though the expected public API behavior is a 403 for private channels |
| Default unknown visibility to indexable public | Successful `200` response with `visibility = "UNKNOWN"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_INDEXABLE` |
| Convert `null` topic to `undefined` | Successful `200` response with `topic = null` | Returned `channel.topic` is `undefined` |
| URL-encode both slugs | `serverSlug = "game dev"`, `channelSlug = "help & support"` | `fetch` is called with `/api/public/servers/game%20dev/channels/help%20%26%20support` |
| Forward ISR revalidation options | Valid slugs; `fetch` resolves successfully | `fetch` is called with `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }` |
| Return null on 404 | Valid slugs; `fetch` resolves with `status = 404` | Returns `null` |
| Return private sentinel on 403 | Valid slugs; `fetch` resolves with `status = 403` | Returns `{ isPrivate: true }` |
| Return null on other non-OK status | Valid slugs; `fetch` resolves with `status = 500` | Returns `null` |
| Return null on network rejection | Valid slugs; `fetch` rejects with a network error | Returns `null`; promise does not reject |

### 4.5 `fetchPublicMessages`

Description: fetches paginated public messages and converts them into the frontend message shape.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped messages and `hasMore = true` when page is full | `channelId = "c1"`, `page = 1`; `fetch` resolves `200` with `messages.length === pageSize` | Returns mapped `Message[]`; `hasMore` is `true` |
| Return mapped messages and `hasMore = false` when page is partial | `channelId = "c1"`, `page = 2`; `fetch` resolves `200` with `messages.length < pageSize` | Returns mapped `Message[]`; `hasMore` is `false` |
| Default `page` to 1 | `channelId = "c1"`; `page` argument omitted | `fetch` is called with `?page=1` |
| Forward explicit page number | `channelId = "c1"`, `page = 3` | `fetch` is called with `?page=3` |
| URL-encode channel id | `channelId = "channel/with space"` | `fetch` is called with `/api/public/channels/channel%2Fwith%20space/messages?page=1` |
| Map author and timestamp fields correctly | Successful `200` response with one `PublicMessageResponse` | Returned message contains `channelId`, `authorId`, nested `author`, `content`, and `timestamp = createdAt` |
| Convert `editedAt = null` to `undefined` | Successful `200` response with `editedAt = null` | Returned message has `editedAt` equal to `undefined` |
| Return empty fallback on 404 | Valid inputs; `fetch` resolves with `ok = false`, `status = 404` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on 403 | Valid inputs; `fetch` resolves with `ok = false`, `status = 403` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on generic server error | Valid inputs; `fetch` resolves with `ok = false`, `status = 500` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on network rejection | Valid inputs; `fetch` rejects with a network error | Returns `{ messages: [], hasMore: false }`; promise does not reject |

### 4.6 `isChannelGuestAccessible`

Description: reduces the public-channel fetch result to a guest-accessibility boolean.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return true for guest-accessible public channel | Mock `fetchPublicChannel` to resolve `{ channel: <Channel>, isPrivate: false }` | Returns `true` |
| Return false for explicit private denial | Mock `fetchPublicChannel` to resolve `{ isPrivate: true }` | Returns `false` |
| Return false for not-found channel | Mock `fetchPublicChannel` to resolve `null` | Returns `false` |
| Treat `PUBLIC_INDEXABLE` channel result as accessible | Successful `fetchPublicChannel` response whose nested `channel.visibility` is `PUBLIC_INDEXABLE` | Returns `true` |
| Treat `PUBLIC_NO_INDEX` channel result as accessible | Successful `fetchPublicChannel` response whose nested `channel.visibility` is `PUBLIC_NO_INDEX` | Returns `true` |
| Treat missing or failed channel lookup as inaccessible | `fetchPublicChannel` returns `null` because of 404 or network failure | Returns `false` |

## 5. Edge Cases to Explicitly Validate

- `mapChannelType` defaults every unknown backend string to `ChannelType.TEXT`; at least one unsupported literal should exercise this branch.
- `mapChannelVisibility` defaults every unknown backend string to `ChannelVisibility.PUBLIC_INDEXABLE`; at least one unsupported literal should exercise this branch.
- `fetchPublicServer` and `fetchPublicChannel` are wrapped in React `cache()`, but the spec should validate the underlying request and return behavior rather than cache memoization internals.
- `fetchPublicServer` suppresses all failures uniformly as `null`; tests should cover 403, 404, 500, and rejected `fetch` calls.
- `fetchPublicChannel` distinguishes 403 from every other failure. `403` must produce `{ isPrivate: true }`, while `404`, `500`, and rejected `fetch` calls must all return `null`.
- `fetchPublicChannel` maps `topic: null` to `topic: undefined`; this null-coercion should be asserted explicitly.
- `fetchPublicMessages` derives `hasMore` from `messages.length >= pageSize`, not from a dedicated API boolean. Tests should include both equality and less-than cases.
- `fetchPublicMessages` suppresses all failures uniformly as `{ messages: [], hasMore: false }`; tests should cover 403, 404, 500, and rejected `fetch` calls.
- `isChannelGuestAccessible` depends on the wrapper result from `fetchPublicChannel`, not directly on the nested `channel.visibility` field. Public success responses for both `PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX` should be treated as accessible.
- The guest public channel view spec expects private channels to fail before render. Therefore, the primary privacy assertion should be the `403 -> { isPrivate: true } -> false` chain across `fetchPublicChannel` and `isChannelGuestAccessible`.

## 6. Mock Strategy

All network behavior is mocked at the `fetch` boundary.

```ts
const fetchMock = jest.spyOn(global, 'fetch');
```

Reset the spy in `beforeEach` / `afterEach` so each test fully controls request order and return values.

- **`fetch` success responses**: return lightweight `Response`-like objects with `ok`, `status`, and `json()`:

```ts
fetchMock.mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => fixture,
} as Response);
```

- **`fetch` failure responses**: return `ok: false` with the desired `status` (`403`, `404`, `500`) to exercise null and empty-result fallbacks.
- **`fetch` network failures**: use `mockRejectedValue(new Error('network error'))` to verify that every async function in this file fails closed instead of propagating the rejection.
- **React `cache`**: mock `cache` as an identity wrapper for unit tests so repeated calls do not share memoized results across test cases. The goal is deterministic branch coverage, not React integration coverage.
- **API response fixtures**:
  - `PublicServerResponse` fixture should include `id`, `name`, `slug`, `iconUrl`, `description`, `memberCount`, and `createdAt`.
  - `PublicChannelResponse` fixture should include `id`, `name`, `slug`, `serverId`, `type`, `visibility`, `topic`, `position`, and `createdAt`.
  - `PublicMessagesApiResponse` fixture should include `messages`, `page`, and `pageSize`; each message fixture should include `id`, `content`, `createdAt`, optional `editedAt`, and `author`.
- **Spying on internal helpers**:
  - Unit tests may exercise `mapChannelType` and `mapChannelVisibility` directly if the test file is colocated with the module or the helpers are exposed for test access.
  - `isChannelGuestAccessible` tests should spy on or mock `fetchPublicChannel` so each accessibility branch can be asserted directly without duplicating lower-level fetch setup in every test.

## 7. Coverage Expectation

The cases above are intended to cover:

- all six functions listed in issue #289,
- every branch in both mapping helpers,
- successful request construction and response mapping for the three fetch-driven functions,
- all documented non-success states (`403`, `404`, generic non-OK, and network failure),
- cache-safe null and empty fallbacks used by the guest public channel page,
- guest visibility semantics for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`, and
- the boolean accessibility reduction performed by `isChannelGuestAccessible`.

Executing this specification should yield at least 80% coverage of the file's reachable execution paths, with any remaining uncovered paths limited to framework-level behavior outside the module's direct branching logic.
````

#### Tool: exec_command

```sh
rtk git diff --stat
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk git diff -- docs/test-specs/frontend-public-api-service-spec.md tasks/todo.md
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:43:43.228Z

This is a spec-only issue, so I’m not running build or test commands; the repo instructions explicitly exempt specification work from that step. I’m just closing out the workflow artifacts now: marking the task tracker complete and posting the issue summary.

#### Tool: mcp__codex_apps__github_add_comment_to_issue

```json
{
  "repo_full_name": "acabrera04/Harmony",
  "pr_number": 289,
  "comment": "**[AI Agent — Complete]**\n\nCompleted the requested English-language test specification at `docs/test-specs/frontend-public-api-service-spec.md`.\n\nThe document now covers all six requested functions, lists each function's purpose and program paths, includes per-function test tables with **Test Purpose / Inputs / Expected Output**, and documents the guest visibility semantics for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE` in the context of the `/c/{serverSlug}/{channelSlug}` flow from `docs/dev-spec-guest-public-channel-view.md`.\n\nIt also documents the mock strategy for `fetch`, React `cache`, and the public API response shapes, while covering happy paths, `403`/`404` handling, generic non-OK responses, and the cache-safe null/empty fallbacks used by this service.\n\nPer repository guidance for specification work, I did not run build or test commands."
}
```

Output:

```text
{"id":4184935065}
```

#### Tool: update_plan

- Explanation: Issue #289 was completed as a documentation/spec task. The spec file was added, the local task tracker was updated, and start/completion comments were posted back to the GitHub issue.

- Plan:
  - [completed] Inspect GitHub issue #289 and current repo state, then record a task plan in tasks/todo.md and post the starting issue comment
  - [completed] Identify the affected code path and write or update tests that capture the issue requirements
  - [completed] Implement the fix or feature with minimal necessary code changes
  - [completed] Run formatter, targeted tests, and relevant type/lint verification
  - [completed] Update task notes, post completion summary to the issue, and summarize results for the user

Output:

```text
Plan updated
```

#### Tool: exec_command

```sh
rtk git status --short
```

Output:

```text
?? docs/test-specs/frontend-public-api-service-spec.md
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:44:12.254Z

Completed issue #289 by adding [`docs/test-specs/frontend-public-api-service-spec.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/test-specs/frontend-public-api-service-spec.md). The spec covers all six requested functions, their purpose and reachable program paths, per-function test tables, 403/404/error handling, cache-safe null/empty fallbacks, the `PUBLIC_INDEXABLE` / `PUBLIC_NO_INDEX` / `PRIVATE` guest semantics, and the mock strategy for `fetch`, React `cache`, and API response shapes. It also ties the service behavior back to [`docs/dev-spec-guest-public-channel-view.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/dev-spec-guest-public-channel-view.md).

I also followed the repo workflow by recording the task in the local tracker and posting start/completion comments on the GitHub issue. No build or test commands were run, because the repository instructions explicitly exempt specification-only work.

### Turn 2: Great make a PR not in draft for the

#### 👤 User Prompt

- Time: 2026-04-03T19:44:30.197Z

```text
Great make a PR not in draft for the issue
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:44:43.570Z

I’m preparing the branch, commit, and PR now. First I’m checking the current branch and diff scope so I can push only the issue work and open a ready PR with the correct issue linkage.

#### Tool: exec_command

```sh
rtk git branch --show-current
```

Output:

```text
*
```

#### Tool: exec_command

```sh
rtk git status --short
```

Output:

```text
?? docs/test-specs/frontend-public-api-service-spec.md
```

#### Tool: exec_command

```sh
rtk git diff --stat
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk read /Users/allen/.codex/plugins/cache/openai-curated/github/f78e3ad49297672a905eb7afb6aa0cef34edc79e/skills/yeet/SKILL.md
```

Output:

```text
---
name: "yeet"
description: "Publish local changes to GitHub by confirming scope, committing intentionally, pushing the branch, and opening a draft PR through the GitHub app from this plugin, with `gh` used only as a fallback where connector coverage is insufficient."
---

# GitHub Publish Changes

## Overview

Use this skill only when the user explicitly wants the full publish flow from the local checkout: branch setup if needed, staging, commit, push, and opening a pull request.

This workflow is hybrid:

- Use local `git` for branch creation, staging, commit, and push.
- Prefer the GitHub app from this plugin for pull request creation after the branch is on the remote.
- Use `gh` as a fallback for current-branch PR discovery, auth checks, or PR creation when the connector path cannot infer the repository or head branch cleanly.

## Prerequisites

- Require GitHub CLI `gh`. Check `gh --version`. If missing, ask the user to install `gh` and stop.
- Require authenticated `gh` session. Run `gh auth status`. If not authenticated, ask the user to run `gh auth login` (and re-run `gh auth status`) before continuing.
- Require a local git repository with a clean understanding of which changes belong in the PR.

## Naming conventions

- Branch: `codex/{description}` when starting from main/master/default.
- Commit: `{description}` (terse).
- PR title: `[codex] {description}` summarizing the full diff.

## Workflow

1. Confirm intended scope.
   - Run `git status -sb` and inspect the diff before staging.
   - If the working tree contains unrelated changes, do not default to `git add -A`. Ask the user which files belong in the PR.
2. Determine the branch strategy.
   - If on `main`, `master`, or another default branch, create `codex/{description}`.
   - Otherwise stay on the current branch.
3. Stage only the intended changes.
   - Prefer explicit file paths when the worktree is mixed.
   - Use `git add -A` only when the user has confirmed the whole worktree belongs in scope.
4. Commit tersely with the confirmed description.
5. Run the most relevant checks available if they have not already been run.
   - If checks fail due to missing dependencies or tools, install what is needed and rerun once.
6. Push with tracking: `git push -u origin $(git branch --show-current)`.
7. Open a draft PR.
   - Prefer the GitHub app from this plugin for PR creation after the push succeeds.
   - Derive `repository_full_name` from the remote, for example by normalizing `git remote get-url origin` or by using `gh repo view --json nameWithOwner`.
   - Derive `head_branch` from `git branch --show-current`.
   - Derive `base_branch` from the user request when specified; otherwise use the remote default branch, for example via `gh repo view --json defaultBranchRef`.
   - If the branch is being pushed from a fork or the PR target differs from the remote that was just pushed, prefer `gh pr create` fallback because the connector PR creation flow expects one repository target and may not encode cross-repo head semantics cleanly.
   - If connector-based PR creation cannot infer the repository or branch cleanly, fall back to `gh pr create --draft --fill --head $(git branch --show-current)`.
   - Write the PR body to a temp file with real newlines when using CLI fallback so the markdown renders cleanly.
8. Summarize the result with branch name, commit, PR target, validation, and anything the user still needs to confirm.

## Write Safety

- Never stage unrelated user changes silently.
- Never push without confirming scope when the worktree is mixed.
- Default to a draft PR unless the user explicitly asks for a ready-for-review PR.
- If the repository does not appear to be connected to an accessible GitHub remote, stop and explain the blocker before making assumptions.

## PR Body Expectations

The PR description should use real Markdown prose and cover:

- what changed
- why it changed
- the user or developer impact
- the root cause when the PR is a fix
- the checks used to validate it
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:44:57.077Z

I’m on a detached HEAD in the worktree, so I need to create a feature branch before I can publish. I’m checking GitHub auth and the repo’s default branch next, then I’ll stage only the new spec file and commit with the required Harmony co-author trailer.

#### Tool: exec_command

```sh
gh --version
```

Output:

```text
gh version 2.87.2 (2026-02-20)
https://github.com/cli/cli/releases/tag/v2.87.2
```

#### Tool: exec_command

```sh
gh auth status
```

Output:

```text
github.com
  ✓ Logged in to github.com account acabrera04 (keyring)
  - Active account: true
  - Git operations protocol: ssh
  - Token: gho_************************************
  - Token scopes: 'admin:public_key', 'gist', 'project', 'read:org', 'repo', 'workflow'
```

#### Tool: exec_command

```sh
gh repo view --json nameWithOwner,defaultBranchRef
```

Output:

```text
{"defaultBranchRef":{"name":"main"},"nameWithOwner":"acabrera04/Harmony"}
```

#### Tool: exec_command

```sh
rtk git status -sb
```

Output:

```text
## HEAD (no branch)
?? docs/test-specs/frontend-public-api-service-spec.md
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:45:05.785Z

I’ve confirmed the repo and auth state. I’m creating a dedicated branch for issue `#289` and staging only [`docs/test-specs/frontend-public-api-service-spec.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/test-specs/frontend-public-api-service-spec.md), since that’s the only tracked change that belongs in the PR.

#### Tool: exec_command

```sh
rtk git switch -c codex/issue-289-public-api-service-spec
```

Output:

```text
Switched to a new branch 'codex/issue-289-public-api-service-spec'
```

#### Tool: exec_command

```sh
rtk git add docs/test-specs/frontend-public-api-service-spec.md
```

Output:

```text
ok ✓ 1 file changed, 255 insertions(+)
```

#### Tool: exec_command

```sh
rtk git diff --cached --stat
```

Output:

```text
.../test-specs/frontend-public-api-service-spec.md | 255 +++++++++++++++++++++
 1 file changed, 255 insertions(+)
```

#### Tool: exec_command

```sh
rtk git diff --cached -- docs/test-specs/frontend-public-api-service-spec.md
```

Output:

````text
.../test-specs/frontend-public-api-service-spec.md | 255 +++++++++++++++++++++
 1 file changed, 255 insertions(+)

--- Changes ---

📄 docs/test-specs/frontend-public-api-service-spec.md
  @@ -0,0 +1,255 @@
  +# Public API Service Test Specification (Frontend)
  +
  +## 1. Overview
  +
  +This document defines the English-language test specification for [`harmony-frontend/src/services/publicApiService.ts`](/Users/allen/.codex/worktrees/9495/Harmony/harmony-frontend/src/services/publicApiService.ts).
  +It covers all six functions in the module:
  +
  +- `mapChannelType`
  +- `mapChannelVisibility`
  +- `fetchPublicServer`
  +- `fetchPublicChannel`
  +- `fetchPublicMessages`
  +- `isChannelGuestAccessible`
  +
  +These tests support the guest public channel view flow for `/c/{serverSlug}/{channelSlug}` and should be read alongside [`docs/dev-spec-guest-public-channel-view.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/dev-spec-guest-public-channel-view.md), which defines the product semantics:
  +
  +- `PUBLIC_INDEXABLE`: guest-accessible and indexable by search engines
  +- `PUBLIC_NO_INDEX`: guest-accessible but not indexable
  +- `PRIVATE`: not guest-accessible; public-channel requests should be denied rather than rendered
  +
  +The goal is to cover the success paths, explicit error handling, guest visibility semantics, and cache-safe fallbacks needed to reach at least 80% of the file's reachable execution paths.
  +
  +## 2. Shared Test Setup and Assumptions
  +
  +- Mock `global.fetch` with Jest or Vitest so tests can control `ok`, `status`, and `json()` behavior for each request.
  +- Mock React's `cache` as an identity wrapper so the cached exports remain callable without cross-test memoization:
  +
  +```ts
  +jest.mock('react', () => ({
  +  ...jest.requireActual('react'),
  ... (truncated)
  +255 -0
````

#### Tool: exec_command

```sh
rtk git status -sb
```

Output:

```text
## codex/issue-289-public-api-service-spec
A  docs/test-specs/frontend-public-api-service-spec.md
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:45:18.830Z

I’ve reviewed the staged scope and it’s clean: one new spec file for issue `#289`. I’m committing that now with a terse message and the required Harmony co-author trailer, then I’ll push and open a ready PR against `main`.

#### Tool: exec_command

```sh
rtk git commit -m "Add public API service test specification" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
ok ✓ codex/i
```

#### Tool: exec_command

```sh
rtk git rev-parse --short HEAD
```

Output:

```text
89d1551
```

#### Tool: exec_command

```sh
rtk git status -sb
```

Output:

```text
## codex/issue-289-public-api-service-spec
```

#### Tool: exec_command

```sh
rtk git log -1 --pretty=format:%B
```

Output:

```text
Add public API service test specification
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:45:32.734Z

The commit is in and the worktree is clean on the feature branch. I’m pushing `codex/issue-289-public-api-service-spec` to `origin` now, then I’ll open a non-draft PR that closes issue `#289`.

#### Tool: exec_command

```sh
rtk git push -u origin codex/issue-289-public-api-service-spec
```

Output:

```text
ok ✓ codex/issue-289-public-api-service-spec
```

#### Tool: mcp__codex_apps__github_create_pull_request

```json
{
  "base_branch": "main",
  "head_branch": "codex/issue-289-public-api-service-spec",
  "repository_full_name": "acabrera04/Harmony",
  "title": "[codex] Add public API service test specification",
  "body": "## Summary\n- add the frontend test specification for `harmony-frontend/src/services/publicApiService.ts`\n- cover all six functions with purposes, program paths, and per-function test tables\n- document guest visibility semantics, fetch/cache mocking strategy, and 403/404/error fallbacks for the guest public channel flow\n\n## Why\nIssue #289 requested a complete English-language test specification for the public API service that supports `/c/{serverSlug}/{channelSlug}` and ties back to `docs/dev-spec-guest-public-channel-view.md`.\n\n## Impact\nThis gives the frontend team a concrete test plan for the guest public channel view path, including privacy-sensitive `PRIVATE` handling and cache-safe null or empty fallbacks.\n\n## Validation\n- reviewed staged diff scope with `git diff --cached --stat`\n- specification-only change; no build or test commands were run per repository guidance for specs\n\nCloses #289",
  "draft": false
}
```

Output:

```text
{"url":"https://github.com/acabrera04/Harmony/pull/298","number":298,"state":"open","merged":false,"mergeable":false,"draft":false,"body":"## Summary\n- add the frontend test specification for `harmony-frontend/src/services/publicApiService.ts`\n- cover all six functions with purposes, program paths, and per-function test tables\n- document guest visibility semantics, fetch/cache mocking strategy, and 403/404/error fallbacks for the guest public channel flow\n\n## Why\nIssue #289 requested a complete English-language test specification for the public API service that supports `/c/{serverSlug}/{channelSlug}` and ties back to `docs/dev-spec-guest-public-channel-view.md`.\n\n## Impact\nThis gives the frontend team a concrete test plan for the guest public channel view path, including privacy-sensitive `PRIVATE` handling and cache-safe null or empty fallbacks.\n\n## Validation\n- reviewed staged diff scope with `git diff --cached --stat`\n- specification-only change; no build or test commands were run per repository guidance for specs\n\nCloses #289","title":"[codex] Add public API service test specification","base":"main","base_sha":"ce7d9e89861c82f99d055a3f4e4cfdc32d996289","head":"codex/issue-289-public-api-service-spec","head_sha":"89d155130898b5afb78cc1b657e02bfc2e995a45","merge_commit_sha":null,"user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"requested_reviewers":null,"diff":null,"comments":null,"created_at":"2026-04-03T19:45:42Z","updated_at":"2026-04-03T19:45:42Z","closed_at":null,"merged_at":null,"commits":1,"changed_files":null,"additions":null,"deletions":null,"display_url":"https://github.com/acabrera04/Harmony/pull/298","display_title":"[codex] Add public API service test specification"}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T19:45:50.956Z

PR is open and ready for review: [#298](https://github.com/acabrera04/Harmony/pull/298)

It’s on branch `codex/issue-289-public-api-service-spec` with commit `89d1551` and closes issue `#289`. I only included the new spec file at [`docs/test-specs/frontend-public-api-service-spec.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/test-specs/frontend-public-api-service-spec.md).

Validation for the PR was limited to diff review because this is a specification-only change and the repo guidance says not to run build/test commands for specs.

### Turn 3: [$resolve-reviews](/Users/allen/.agents/skills/resolve-reviews/SKILL.md)

#### 👤 User Prompt

- Time: 2026-04-03T20:34:12.537Z

```text
[$resolve-reviews](/Users/allen/.agents/skills/resolve-reviews/SKILL.md)
```

_No assistant or tool activity recorded after this prompt._

### Turn 4: <skill> <name>resolve-reviews</name>

#### 👤 User Prompt

- Time: 2026-04-03T20:34:12.538Z

````text
<skill>
<name>resolve-reviews</name>
<path>/Users/allen/.agents/skills/resolve-reviews/SKILL.md</path>
---
name: resolve-reviews
description: Resolve all PR review comments (human and bot) on current PR. Fetches unanswered comments, evaluates each one, fixes real issues, dismisses false positives, and replies to every comment with the outcome.
license: MIT
compatibility: Requires git, gh (GitHub CLI), and Node.js installed.
allowed-tools: Bash(npx agent-reviews *) Bash(pnpm dlx agent-reviews *) Bash(yarn dlx agent-reviews *) Bash(bunx agent-reviews *) Bash(git config *) Bash(git add *) Bash(git commit *) Bash(git push *)
metadata:
  author: pbakaus
  version: "1.0.1"
  homepage: https://github.com/pbakaus/agent-reviews
---

Automatically resolve all review comments (both human and bot) on the current PR. Uses a two-phase workflow: fix all existing issues, then poll for new ones until quiet.

## Prerequisites

All commands below use `npx agent-reviews`. If the project uses a different package manager, substitute the appropriate runner (e.g., `pnpm dlx agent-reviews` for pnpm, `yarn dlx agent-reviews` for Yarn, `bunx agent-reviews` for Bun). Honor the user's package manager preference throughout.

**Cloud environments only** (e.g., Codespaces, remote agents): verify git author identity so CI checks can map commits to the user. Run `git config --global --get user.email` and if empty or a placeholder, set it manually. Skip this check in local environments.

## Phase 1: FETCH & FIX (synchronous)

### Step 1: Fetch All Comments (Expanded)

Run `npx agent-reviews --unanswered --expanded`

The CLI auto-detects the current branch, finds the associated PR, and authenticates via `gh` CLI or environment variables. If anything fails (no token, no PR, CLI not installed), it exits with a clear error message.

This shows all unanswered comments (both human and bot) with full detail: complete comment body (no truncation), diff hunk (code context), and all replies. Each comment shows its ID in brackets (e.g., `[12345678]`).

If zero comments are returned, print "No unanswered comments found" and skip to Phase 2.

### Step 3: Process Each Unanswered Comment

For each comment from the expanded output, apply the appropriate evaluation based on whether the author is a bot or a human.

#### For Bot Comments

Read the referenced code and determine:

1. **TRUE POSITIVE** - A real bug that needs fixing
2. **FALSE POSITIVE** - Not actually a bug (intentional behavior, bot misunderstanding)
3. **UNCERTAIN** - Not sure; ask the user

**Likely TRUE POSITIVE:**
- Code obviously violates stated behavior
- Missing null checks on potentially undefined values
- Type mismatches or incorrect function signatures
- Logic errors in conditionals
- Missing error handling for documented failure cases

**Likely FALSE POSITIVE:**
- Bot doesn't understand the framework/library patterns
- Code is intentionally structured that way (with comments explaining why)
- Bot is flagging style preferences, not bugs
- The "bug" is actually a feature or intentional behavior
- Bot misread the code flow

#### For Human Comments

Read the referenced code and the reviewer's comment. Human reviewers are generally more accurate and context-aware than bots. Determine:

1. **ACTIONABLE** - The reviewer identified a real issue or requested a concrete change
2. **DISCUSSION** - The comment raises a valid point but the right approach is unclear
3. **ALREADY ADDRESSED** - The concern has already been fixed or is no longer relevant

**Likely ACTIONABLE:**
- Reviewer points out a bug or logic error
- Reviewer requests a specific code change
- Reviewer identifies missing edge cases or error handling

**Likely DISCUSSION -- ask the user:**
- Reviewer suggests an architectural change you're unsure about
- Comment involves a tradeoff (performance vs readability, etc.)
- The feedback is subjective without team consensus

#### When UNCERTAIN -- ask the user

For both bot and human comments:
- The fix would require architectural changes
- You're genuinely unsure if the behavior is intentional
- Multiple valid interpretations exist
- The fix could have unintended side effects

#### Act on Evaluation

**If TRUE POSITIVE / ACTIONABLE:** Fix the code. Track the comment ID and a brief description of the fix.

**If FALSE POSITIVE:** Do NOT change the code. Track the comment ID and the reason it's not a real bug.

**If DISCUSSION:** Ask the user to consult the PR author. Apply their decision and track it.

**If ALREADY ADDRESSED:** Track the comment ID and note why.

**If UNCERTAIN:** Ask the user. If they say skip, track it as skipped.

Do NOT reply to comments yet. Replies happen after the commit (Step 5).

### Step 4: Commit and Push

After evaluating and fixing ALL unanswered comments:

1. Run your project's lint and type-check
2. Stage, commit, and push:
   ```bash
   git add -A
   git commit -m "fix: address PR review findings

   {List of changes made, grouped by reviewer/bot}"
   git push
   ```
3. Capture the commit hash from the output.

### Step 5: Reply to All Comments

Now that the commit hash exists, reply to every processed comment. The `--resolve` flag marks the review thread as resolved on GitHub.

**For each TRUE POSITIVE / ACTIONABLE:**

Run `npx agent-reviews --reply <comment_id> "Fixed in {hash}. {Brief description of the fix}" --resolve`

**For each FALSE POSITIVE:**

Run `npx agent-reviews --reply <comment_id> "Won't fix: {reason}. {Explanation of why this is intentional or not applicable}" --resolve`

**For each DISCUSSION (after user decision):**

Run `npx agent-reviews --reply <comment_id> "{Outcome}. {Explanation of the decision and any changes made}" --resolve`

**For each ALREADY ADDRESSED:**

Run `npx agent-reviews --reply <comment_id> "Already addressed. {Explanation of when/how this was fixed}" --resolve`

**For each SKIPPED:**

Run `npx agent-reviews --reply <comment_id> "Skipped per user request" --resolve`

**DO NOT start Phase 2 until all replies are posted.**

---

## Phase 2: POLL FOR NEW COMMENTS (loop until quiet)

The watcher exits immediately when new comments are found (after a 5s grace period to catch batch posts). This means you run it in a loop: start watcher, process any comments it returns, restart watcher, repeat until the watcher times out with no new comments.

### Step 6: Start Watcher Loop

Repeat the following until the watcher exits with no new comments:

**6a.** Launch the watcher in the background:

Run `npx agent-reviews --watch` as a background task.

**6b.** Wait for the background command to complete (default 10 minutes; override with `--timeout`).

**6c.** Check the output:

- **If new comments were found** (output contains `EXITING WITH NEW COMMENTS`):
  1. Use `--detail <id>` to read each new comment's full detail
  2. Process them exactly as in Phase 1, Steps 3-5 (evaluate, fix, commit, push, reply)
  3. **Go back to Step 6a** to restart the watcher

- **If no new comments** (output contains `WATCH COMPLETE`):
  Stop looping and move to the Summary Report.

---

## Summary Report

After both phases complete, provide a summary:

```text
## PR Review Resolution Summary

### Results
- Fixed: X issues
- Already addressed: X
- Won't fix (false positives): X
- Discussion resolved: X
- Skipped per user: X

### By Reviewer/Bot
#### cursor[bot]
- {description} - Fixed in {commit}
- {description} - Won't fix: {reason}

#### @reviewer-name
- {description} - Fixed in {commit}

### Status
All findings addressed. Watch completed.
```

## Important Notes

### Response Policy
- **Every comment gets a response** - No silent ignores
- For bots: responses help train them and prevent re-raised false positives
- For humans: replies keep reviewers informed and unblock approvals

### User Interaction
- Ask the user when uncertain about a finding
- Don't guess on architectural or business logic questions
- It's better to ask than to make a wrong fix or wrong dismissal
- Human reviewers often have context you don't - defer to the author when unsure

### Best Practices
- Verify findings before fixing - bots have false positives, humans rarely do
- Keep fixes minimal and focused - don't refactor unrelated code
- Ensure type-check and lint pass before committing
- Group related fixes into a single commit
- Copilot `suggestion` blocks often contain ready-to-use fixes
- If a human reviewer suggests a specific code change, prefer their version unless it introduces issues

</skill>
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T20:34:23.463Z

Using the `resolve-reviews` skill. I’m fetching unanswered review comments for the current PR, then I’ll evaluate each finding, fix anything real, and reply on GitHub with the outcome.

#### Tool: update_plan

- Explanation: Resolving PR reviews requires fetching unanswered comments, evaluating each finding, making any required fixes, validating, then replying and resolving threads.

- Plan:
  - [in_progress] Fetch unanswered PR review comments with full context for the current branch/PR
  - [pending] Evaluate each comment and implement any necessary code or documentation fixes
  - [pending] Run relevant verification for any applied fixes, then commit and push
  - [pending] Reply to every processed review comment and resolve threads
  - [pending] Watch briefly for newly added comments and summarize the final status

Output:

```text
Plan updated
```

#### Tool: exec_command

```sh
rtk git branch --show-current
```

Output:

```text
* 
  codex/issue-289-public-api-service-spec
```

#### Tool: exec_command

```sh
node --version
```

Output:

```text
v25.6.1
```

#### Tool: exec_command

```sh
rtk git status -sb
```

Output:

```text
## codex/issue-289-public-api-service-spec
```

#### Tool: exec_command

```sh
npx agent-reviews --unanswered --expanded
```

Output:

````text
[1mFound 1 comment[0m

=== Comment [4057199311] ===
Type: REVIEW | By: declanblanc | Status: ○ no reply
URL: https://github.com/acabrera04/Harmony/pull/298#pullrequestreview-4057199311

- [x] **Logic over Style**: Spec logic is sound; program paths match the implementation accurately.
- [x] **Security First**: Documentation only; no security surface.
- [x] **Architectural Alignment**: Follows the same spec format as `docs/test-specs/channel-service-spec.md`.
- [ ] **Issue Completion**: One gap noted below — URL assertions in the spec would produce failing tests if followed as written.
- [x] **No Nitpicking**: Finding is logic-level, not stylistic.
- [x] **Avoid Repetition**: First review.
- [x] **Iterative Reviews**: First review on this PR.
- [x] **Prevent CI Failures**: Spec-only change; no CI impact from the PR itself, but the URL issue would cause failures when the implementation PR is written.

---

One issue needs addressing before merge:

**URL assertions are missing the `API_CONFIG.BASE_URL` prefix (Sections 4.3, 4.4, 4.5)**

`API_CONFIG.BASE_URL` resolves to `'http://localhost:4000'` in test environments (the `NEXT_PUBLIC_API_URL` env var is not set in Jest). Because `publicApiService.ts` builds URLs as:
```ts
`${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}`
```
`global.fetch` will receive the full absolute URL, not just the path. The spec's URL assertions — e.g., ```fetch``` is called with `/api/public/servers/game%20dev`` — show path-only strings that will not match.

Affected rows:
- Section 4.3: "URL-encode the server slug" and "Forward ISR revalidation options"
- Section 4.4: "URL-encode both slugs" and "Forward ISR revalidation options"
- Section 4.5: "Default `page` to 1", "Forward explicit page number", "URL-encode channel id"

Fix options (either works):
1. Update the expected URLs in the spec to full absolute form: `http://localhost:4000/api/public/servers/game%20dev`
2. Add a note in Section 2 that tests should mock `API_CONFIG` (or set `process.env.NEXT_PUBLIC_API_URL = ''`) so the base is empty and path-only assertions hold.
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T20:34:39.662Z

There’s one substantive review comment, and it looks actionable: the spec’s URL assertions likely don’t match the service’s actual absolute URLs in test environments. I’m confirming the constant behavior in the code before patching the spec.

#### Tool: exec_command

```sh
rtk grep -n "BASE_URL|NEXT_PUBLIC_API_URL|PUBLIC_API_REVALIDATE" harmony-frontend/src -S
```

Output:

```text
🔍 21 in 12F:

📄 harmony-frontend/.../__tests__/useChannelEvents.test.tsx (1):
   119: process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };

📄 harmony-frontend/.../__tests__/useServerEvents.test.tsx (1):
   120: process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };

📄 harmony-frontend/src/__tests__/utils.test.ts (4):
   162: const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
   165: process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
   169: process.env.NEXT_PUBLIC_BASE_URL = 'https://harmony.example';
   175: delete process.env.NEXT_PUBLIC_BASE_URL;

📄 harmony-frontend/src/app/settings/actions.ts (1):
    19: `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}/...

📄 harmony-frontend/src/contexts/VoiceContext.tsx (1):
   631: const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

📄 harmony-frontend/src/hooks/useChannelEvents.ts (1):
    67: const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

📄 harmony-frontend/src/hooks/useServerEvents.ts (1):
    87: const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';

📄 harmony-frontend/src/lib/api-client.ts (2):
    69: baseURL: API_CONFIG.BASE_URL,
   124: `${API_CONFIG.BASE_URL}/api/auth/refresh`,

📄 harmony-frontend/src/lib/constants.ts (2):
    13: BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    34: PUBLIC_API_REVALIDATE: 60, // Next.js ISR revalidation for public REST fetche...

📄 harmony-frontend/src/lib/trpc-client.ts (1):
    17: const BASE = API_CONFIG.BASE_URL;

📄 harmony-frontend/src/lib/utils.ts (1):
   126: const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

📄 harmony-frontend/src/services/publicApiService.ts (5):
    87: `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}`,
    88: { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
   122: `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}/...
   123: { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
   159: `${API_CONFIG.BASE_URL}/api/public/channels/${encodeURIComponent(channelId)}/...
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/lib/constants.ts
```

Output:

```text
/**
 * Application-wide constants
 * Aligned with dev spec requirements
 */

export const APP_NAME = 'Harmony';
export const APP_DESCRIPTION = 'Search-engine-indexable chat platform';

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Pagination constants
 */
export const PAGINATION = {
  MESSAGES_PER_PAGE: 50,
  CHANNELS_PER_PAGE: 20,
  DEFAULT_PAGE_SIZE: 20,
} as const;

/**
 * Cache durations (in seconds)
 * Based on dev spec caching strategies
 */
export const CACHE_DURATION = {
  PUBLIC_CHANNEL: 300, // 5 minutes
  SEO_METADATA: 3600, // 1 hour
  SERVER_INFO: 600, // 10 minutes
  PUBLIC_API_REVALIDATE: 60, // Next.js ISR revalidation for public REST fetches (matches backend channelMessages TTL)
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  PUBLIC_CHANNEL: '/c/[serverSlug]/[channelSlug]',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
} as const;

/** Last-resort fallback destination when no server/channel data is available */
export const DEFAULT_HOME_PATH = '/harmony-hq/general';

/**
 * Visibility states from dev spec
 * Section 5: State Diagrams
 */
export enum ChannelVisibility {
  PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',
  PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',
  PRIVATE = 'PRIVATE',
}

/**
 * Event types for EventBus (Redis Pub/Sub)
 * From dev spec Section 8.1
 */
export const EVENT_TYPES = {
  VISIBILITY_CHANGED: 'channel:visibility:changed',
  MESSAGE_CREATED: 'channel:message:created',
  CHANNEL_UPDATED: 'channel:updated',
} as const;
```

#### Tool: exec_command

```sh
rtk read docs/test-specs/frontend-public-api-service-spec.md
```

Output:

````text
# Public API Service Test Specification (Frontend)

## 1. Overview

This document defines the English-language test specification for [`harmony-frontend/src/services/publicApiService.ts`](/Users/allen/.codex/worktrees/9495/Harmony/harmony-frontend/src/services/publicApiService.ts).
It covers all six functions in the module:

- `mapChannelType`
- `mapChannelVisibility`
- `fetchPublicServer`
- `fetchPublicChannel`
- `fetchPublicMessages`
- `isChannelGuestAccessible`

These tests support the guest public channel view flow for `/c/{serverSlug}/{channelSlug}` and should be read alongside [`docs/dev-spec-guest-public-channel-view.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/dev-spec-guest-public-channel-view.md), which defines the product semantics:

- `PUBLIC_INDEXABLE`: guest-accessible and indexable by search engines
- `PUBLIC_NO_INDEX`: guest-accessible but not indexable
- `PRIVATE`: not guest-accessible; public-channel requests should be denied rather than rendered

The goal is to cover the success paths, explicit error handling, guest visibility semantics, and cache-safe fallbacks needed to reach at least 80% of the file's reachable execution paths.

## 2. Shared Test Setup and Assumptions

- Mock `global.fetch` with Jest or Vitest so tests can control `ok`, `status`, and `json()` behavior for each request.
- Mock React's `cache` as an identity wrapper so the cached exports remain callable without cross-test memoization:

```ts
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: <T extends (...args: any[]) => any>(fn: T) => fn,
}));
```

- Reset all mocks between tests to avoid leakage between cached and non-cached scenarios.
- Use response fixtures that match the file's internal API shapes:
  - `PublicServerResponse`
  - `PublicChannelResponse`
  - `PublicMessagesApiResponse`
- When asserting request construction, verify that `encodeURIComponent` is reflected in the URL for `serverSlug`, `channelSlug`, and `channelId`.
- For `fetchPublicServer` and `fetchPublicChannel`, assert that `fetch` receives `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }`.
- For `fetchPublicMessages`, assert that the request omits the React-cache wrapper and uses the expected `?page=` query string.
- The spec intentionally treats React `cache()` internals as framework behavior, not service logic. Tests should validate observable service behavior, not React memoization implementation details.

## 3. Function Purposes and Program Paths

### 3.1 `mapChannelType`

Purpose: normalize backend channel type strings into the frontend `ChannelType` enum.

Program paths:

- Input is `'VOICE'`; returns `ChannelType.VOICE`.
- Input is `'ANNOUNCEMENT'`; returns `ChannelType.ANNOUNCEMENT`.
- Input is any other string; returns `ChannelType.TEXT`.

### 3.2 `mapChannelVisibility`

Purpose: normalize backend visibility strings into the frontend `ChannelVisibility` enum.

Program paths:

- Input is `'PUBLIC_NO_INDEX'`; returns `ChannelVisibility.PUBLIC_NO_INDEX`.
- Input is `'PRIVATE'`; returns `ChannelVisibility.PRIVATE`.
- Input is `'PUBLIC_INDEXABLE'` or any unknown string; returns `ChannelVisibility.PUBLIC_INDEXABLE`.

### 3.3 `fetchPublicServer`

Purpose: fetch public server metadata by slug for the guest public channel page. Returns `null` for any non-success result so server-side rendering can fail closed without throwing.

Program paths:

- `fetch` resolves with `ok = true`; JSON is mapped into a `PublicServer` object and returned.
- `fetch` resolves with `ok = false` (including 403, 404, or 500); returns `null`.
- `fetch` rejects; returns `null`.

### 3.4 `fetchPublicChannel`

Purpose: fetch a single public channel by `serverSlug` and `channelSlug` while preserving the distinction between missing content and private content.

Program paths:

- `fetch` resolves with `status = 404`; returns `null`.
- `fetch` resolves with `status = 403`; returns `{ isPrivate: true }`.
- `fetch` resolves with another non-OK status; returns `null`.
- `fetch` resolves with `ok = true`; JSON is mapped into `Channel` and returned as `{ channel, isPrivate: false }`.
- `fetch` rejects; returns `null`.

### 3.5 `fetchPublicMessages`

Purpose: fetch paginated guest-visible messages for a public channel. Returns an empty result on any failure so the page can render safely without crashing.

Program paths:

- `fetch` resolves with `ok = true`; API messages are mapped into frontend `Message` objects and `hasMore` is derived from `messages.length >= pageSize`.
- `fetch` resolves with `ok = false`; returns `{ messages: [], hasMore: false }`.
- `fetch` rejects; returns `{ messages: [], hasMore: false }`.

### 3.6 `isChannelGuestAccessible`

Purpose: provide a boolean answer for whether a guest can access a channel based on `fetchPublicChannel`.

Program paths:

- `fetchPublicChannel` returns `{ channel, isPrivate: false }`; returns `true`.
- `fetchPublicChannel` returns `{ isPrivate: true }`; returns `false`.
- `fetchPublicChannel` returns `null`; returns `false`.

## 4. Detailed Test Cases

### 4.1 `mapChannelType`

Description: maps backend strings to the frontend enum with a TEXT default.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Map voice channels correctly | `type = "VOICE"` | Returns `ChannelType.VOICE` |
| Map announcement channels correctly | `type = "ANNOUNCEMENT"` | Returns `ChannelType.ANNOUNCEMENT` |
| Default unknown values to text | `type = "TEXT"`, `"UNKNOWN"`, or `""` | Returns `ChannelType.TEXT` |

### 4.2 `mapChannelVisibility`

Description: maps backend visibility strings to the frontend enum and preserves guest-visibility semantics from the guest public channel view spec.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Preserve no-index public visibility | `visibility = "PUBLIC_NO_INDEX"` | Returns `ChannelVisibility.PUBLIC_NO_INDEX`; semantics remain guest-accessible but not search-indexable |
| Preserve private visibility | `visibility = "PRIVATE"` | Returns `ChannelVisibility.PRIVATE`; semantics remain not guest-accessible |
| Preserve indexable public visibility | `visibility = "PUBLIC_INDEXABLE"` | Returns `ChannelVisibility.PUBLIC_INDEXABLE`; semantics remain guest-accessible and indexable |
| Default unknown visibility to indexable public | `visibility = "UNRECOGNIZED_VALUE"` | Returns `ChannelVisibility.PUBLIC_INDEXABLE` as the helper's safe default |

### 4.3 `fetchPublicServer`

Description: fetches public server metadata and suppresses all failures by returning `null`.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped public server on success | `serverSlug = "gamedev"`; `fetch` resolves `200` with a valid `PublicServerResponse` | Returns a server object with `iconUrl` mapped to `icon`, and the remaining fields copied correctly |
| URL-encode the server slug | `serverSlug = "game dev"`; `fetch` resolves successfully | `fetch` is called with `/api/public/servers/game%20dev` |
| Forward ISR revalidation options | Valid slug; `fetch` resolves successfully | `fetch` is called with `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }` |
| Return null on 404 | Valid slug; `fetch` resolves with `ok = false`, `status = 404` | Returns `null` |
| Return null on 403 | Valid slug; `fetch` resolves with `ok = false`, `status = 403` | Returns `null` |
| Return null on generic server error | Valid slug; `fetch` resolves with `ok = false`, `status = 500` | Returns `null` |
| Return null on network rejection | Valid slug; `fetch` rejects with a network error | Returns `null`; promise does not reject |

### 4.4 `fetchPublicChannel`

Description: fetches a guest-visible channel and distinguishes private-channel denial from missing-channel fallback.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped public channel on success | `serverSlug = "gamedev"`, `channelSlug = "help"`; `fetch` resolves `200` with a valid `PublicChannelResponse` | Returns `{ channel, isPrivate: false }` with `type`, `visibility`, and `topic` mapped correctly |
| Map `VOICE` channel type | Successful `200` response with `type = "VOICE"` | Returned `channel.type` is `ChannelType.VOICE` |
| Map `ANNOUNCEMENT` channel type | Successful `200` response with `type = "ANNOUNCEMENT"` | Returned `channel.type` is `ChannelType.ANNOUNCEMENT` |
| Default unknown channel type to text | Successful `200` response with `type = "UNSUPPORTED"` | Returned `channel.type` is `ChannelType.TEXT` |
| Preserve `PUBLIC_INDEXABLE` on success | Successful `200` response with `visibility = "PUBLIC_INDEXABLE"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_INDEXABLE` |
| Preserve `PUBLIC_NO_INDEX` on success | Successful `200` response with `visibility = "PUBLIC_NO_INDEX"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_NO_INDEX` |
| Preserve `PRIVATE` value when returned in a 200 payload | Successful `200` response with `visibility = "PRIVATE"` | Returned `channel.visibility` is `ChannelVisibility.PRIVATE`; this is a mapper assertion even though the expected public API behavior is a 403 for private channels |
| Default unknown visibility to indexable public | Successful `200` response with `visibility = "UNKNOWN"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_INDEXABLE` |
| Convert `null` topic to `undefined` | Successful `200` response with `topic = null` | Returned `channel.topic` is `undefined` |
| URL-encode both slugs | `serverSlug = "game dev"`, `channelSlug = "help & support"` | `fetch` is called with `/api/public/servers/game%20dev/channels/help%20%26%20support` |
| Forward ISR revalidation options | Valid slugs; `fetch` resolves successfully | `fetch` is called with `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }` |
| Return null on 404 | Valid slugs; `fetch` resolves with `status = 404` | Returns `null` |
| Return private sentinel on 403 | Valid slugs; `fetch` resolves with `status = 403` | Returns `{ isPrivate: true }` |
| Return null on other non-OK status | Valid slugs; `fetch` resolves with `status = 500` | Returns `null` |
| Return null on network rejection | Valid slugs; `fetch` rejects with a network error | Returns `null`; promise does not reject |

### 4.5 `fetchPublicMessages`

Description: fetches paginated public messages and converts them into the frontend message shape.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped messages and `hasMore = true` when page is full | `channelId = "c1"`, `page = 1`; `fetch` resolves `200` with `messages.length === pageSize` | Returns mapped `Message[]`; `hasMore` is `true` |
| Return mapped messages and `hasMore = false` when page is partial | `channelId = "c1"`, `page = 2`; `fetch` resolves `200` with `messages.length < pageSize` | Returns mapped `Message[]`; `hasMore` is `false` |
| Default `page` to 1 | `channelId = "c1"`; `page` argument omitted | `fetch` is called with `?page=1` |
| Forward explicit page number | `channelId = "c1"`, `page = 3` | `fetch` is called with `?page=3` |
| URL-encode channel id | `channelId = "channel/with space"` | `fetch` is called with `/api/public/channels/channel%2Fwith%20space/messages?page=1` |
| Map author and timestamp fields correctly | Successful `200` response with one `PublicMessageResponse` | Returned message contains `channelId`, `authorId`, nested `author`, `content`, and `timestamp = createdAt` |
| Convert `editedAt = null` to `undefined` | Successful `200` response with `editedAt = null` | Returned message has `editedAt` equal to `undefined` |
| Return empty fallback on 404 | Valid inputs; `fetch` resolves with `ok = false`, `status = 404` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on 403 | Valid inputs; `fetch` resolves with `ok = false`, `status = 403` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on generic server error | Valid inputs; `fetch` resolves with `ok = false`, `status = 500` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on network rejection | Valid inputs; `fetch` rejects with a network error | Returns `{ messages: [], hasMore: false }`; promise does not reject |

### 4.6 `isChannelGuestAccessible`

Description: reduces the public-channel fetch result to a guest-accessibility boolean.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return true for guest-accessible public channel | Mock `fetchPublicChannel` to resolve `{ channel: <Channel>, isPrivate: false }` | Returns `true` |
| Return false for explicit private denial | Mock `fetchPublicChannel` to resolve `{ isPrivate: true }` | Returns `false` |
| Return false for not-found channel | Mock `fetchPublicChannel` to resolve `null` | Returns `false` |
| Treat `PUBLIC_INDEXABLE` channel result as accessible | Successful `fetchPublicChannel` response whose nested `channel.visibility` is `PUBLIC_INDEXABLE` | Returns `true` |
| Treat `PUBLIC_NO_INDEX` channel result as accessible | Successful `fetchPublicChannel` response whose nested `channel.visibility` is `PUBLIC_NO_INDEX` | Returns `true` |
| Treat missing or failed channel lookup as inaccessible | `fetchPublicChannel` returns `null` because of 404 or network failure | Returns `false` |

## 5. Edge Cases to Explicitly Validate

- `mapChannelType` defaults every unknown backend string to `ChannelType.TEXT`; at least one unsupported literal should exercise this branch.
- `mapChannelVisibility` defaults every unknown backend string to `ChannelVisibility.PUBLIC_INDEXABLE`; at least one unsupported literal should exercise this branch.
- `fetchPublicServer` and `fetchPublicChannel` are wrapped in React `cache()`, but the spec should validate the underlying request and return behavior rather than cache memoization internals.
- `fetchPublicServer` suppresses all failures uniformly as `null`; tests should cover 403, 404, 500, and rejected `fetch` calls.
- `fetchPublicChannel` distinguishes 403 from every other failure. `403` must produce `{ isPrivate: true }`, while `404`, `500`, and rejected `fetch` calls must all return `null`.
- `fetchPublicChannel` maps `topic: null` to `topic: undefined`; this null-coercion should be asserted explicitly.
- `fetchPublicMessages` derives `hasMore` from `messages.length >= pageSize`, not from a dedicated API boolean. Tests should include both equality and less-than cases.
- `fetchPublicMessages` suppresses all failures uniformly as `{ messages: [], hasMore: false }`; tests should cover 403, 404, 500, and rejected `fetch` calls.
- `isChannelGuestAccessible` depends on the wrapper result from `fetchPublicChannel`, not directly on the nested `channel.visibility` field. Public success responses for both `PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX` should be treated as accessible.
- The guest public channel view spec expects private channels to fail before render. Therefore, the primary privacy assertion should be the `403 -> { isPrivate: true } -> false` chain across `fetchPublicChannel` and `isChannelGuestAccessible`.

## 6. Mock Strategy

All network behavior is mocked at the `fetch` boundary.

```ts
const fetchMock = jest.spyOn(global, 'fetch');
```

Reset the spy in `beforeEach` / `afterEach` so each test fully controls request order and return values.

- **`fetch` success responses**: return lightweight `Response`-like objects with `ok`, `status`, and `json()`:

```ts
fetchMock.mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => fixture,
} as Response);
```

- **`fetch` failure responses**: return `ok: false` with the desired `status` (`403`, `404`, `500`) to exercise null and empty-result fallbacks.
- **`fetch` network failures**: use `mockRejectedValue(new Error('network error'))` to verify that every async function in this file fails closed instead of propagating the rejection.
- **React `cache`**: mock `cache` as an identity wrapper for unit tests so repeated calls do not share memoized results across test cases. The goal is deterministic branch coverage, not React integration coverage.
- **API response fixtures**:
  - `PublicServerResponse` fixture should include `id`, `name`, `slug`, `iconUrl`, `description`, `memberCount`, and `createdAt`.
  - `PublicChannelResponse` fixture should include `id`, `name`, `slug`, `serverId`, `type`, `visibility`, `topic`, `position`, and `createdAt`.
  - `PublicMessagesApiResponse` fixture should include `messages`, `page`, and `pageSize`; each message fixture should include `id`, `content`, `createdAt`, optional `editedAt`, and `author`.
- **Spying on internal helpers**:
  - Unit tests may exercise `mapChannelType` and `mapChannelVisibility` directly if the test file is colocated with the module or the helpers are exposed for test access.
  - `isChannelGuestAccessible` tests should spy on or mock `fetchPublicChannel` so each accessibility branch can be asserted directly without duplicating lower-level fetch setup in every test.

## 7. Coverage Expectation

The cases above are intended to cover:

- all six functions listed in issue #289,
- every branch in both mapping helpers,
- successful request construction and response mapping for the three fetch-driven functions,
- all documented non-success states (`403`, `404`, generic non-OK, and network failure),
- cache-safe null and empty fallbacks used by the guest public channel page,
- guest visibility semantics for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`, and
- the boolean accessibility reduction performed by `isChannelGuestAccessible`.

Executing this specification should yield at least 80% coverage of the file's reachable execution paths, with any remaining uncovered paths limited to framework-level behavior outside the module's direct branching logic.
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T20:34:44.836Z

The review is correct. `API_CONFIG.BASE_URL` defaults to `http://localhost:4000`, so the spec should not imply path-only `fetch` assertions. I’m updating the document to use absolute URLs and to state that assumption explicitly in the shared setup section.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T20:35:04.312Z

The spec is patched. I’m checking the exact diff now, then I’ll commit and push this review fix as a follow-up to the PR before replying on GitHub.

#### Tool: exec_command

```sh
rtk git diff --stat
```

Output:

```text
docs/test-specs/frontend-public-api-service-spec.md | 13 +++++++------
 1 file changed, 7 insertions(+), 6 deletions(-)
```

#### Tool: exec_command

```sh
rtk git diff -- docs/test-specs/frontend-public-api-service-spec.md
```

Output:

```text
docs/test-specs/frontend-public-api-service-spec.md | 13 +++++++------
 1 file changed, 7 insertions(+), 6 deletions(-)

--- Changes ---

📄 docs/test-specs/frontend-public-api-service-spec.md
  @@ -37,7 +37,8 @@
  -- When asserting request construction, verify that `encodeURIComponent` is reflected in the URL for `serverSlug`, `channelSlug`, and `channelId`.
  +- Unless a test explicitly mocks `API_CONFIG.BASE_URL`, assume the default test-time base URL is `http://localhost:4000`, because `NEXT_PUBLIC_API_URL` is normally unset in Jest.
  +- When asserting request construction, verify that `encodeURIComponent` is reflected in the full absolute URL for `serverSlug`, `channelSlug`, and `channelId`.
   - For `fetchPublicServer` and `fetchPublicChannel`, assert that `fetch` receives `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }`.
   - For `fetchPublicMessages`, assert that the request omits the React-cache wrapper and uses the expected `?page=` query string.
   - The spec intentionally treats React `cache()` internals as framework behavior, not service logic. Tests should validate observable service behavior, not React memoization implementation details.
  @@ -136,7 +137,7 @@
  -| URL-encode the server slug | `serverSlug = "game dev"`; `fetch` resolves successfully | `fetch` is called with `/api/public/servers/game%20dev` |
  +| URL-encode the server slug | `serverSlug = "game dev"`; `fetch` resolves successfully | `fetch` is called with `http://localhost:4000/api/public/servers/game%20dev` |
   | Forward ISR revalidation options | Valid slug; `fetch` resolves successfully | `fetch` is called with `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }` |
   | Return null on 404 | Valid slug; `fetch` resolves with `ok = false`, `status = 404` | Returns `null` |
   | Return null on 403 | Valid slug; `fetch` resolves with `ok = false`, `status = 403` | Returns `null` |
  @@ -158,7 +159,7 @@
  -| URL-encode both slugs | `serverSlug = "game dev"`, `channelSlug = "help & support"` | `fetch` is called with `/api/public/servers/game%20dev/channels/help%20%26%20support` |
  +| URL-encode both slugs | `serverSlug = "game dev"`, `channelSlug = "help & support"` | `fetch` is called with `http://localhost:4000/api/public/servers/game%20dev/channels/help%20%26%20support` |
   | Forward ISR revalidation options | Valid slugs; `fetch` resolves successfully | `fetch` is called with `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }` |
   | Return null on 404 | Valid slugs; `fetch` resolves with `status = 404` | Returns `null` |
   | Return private sentinel on 403 | Valid slugs; `fetch` resolves with `status = 403` | Returns `{ isPrivate: true }` |
  @@ -173,9 +174,9 @@
  -| Default `page` to 1 | `channelId = "c1"`; `page` argument omitted | `fetch` is called with `?page=1` |
  -| Forward explicit page number | `channelId = "c1"`, `page = 3` | `fetch` is called with `?page=3` |
  -| URL-encode channel id | `channelId = "channel/with space"` | `fetch` is called with `/api/public/channels/channel%2Fwith%20space/messages?page=1` |
  +| Default `page` to 1 | `channelId = "c1"`; `page` argument omitted | `fetch` is called with `http://localhost:4000/api/public/channels/c1/messages?page=1` |
  +| Forward explicit page number | `channelId = "c1"`, `page = 3` | `fetch` is called with `http://localhost:4000/api/public/channels/c1/messages?page=3` |
  +| URL-encode channel id | `channelId = "channel/with space"` | `fetch` is called with `http://localhost:4000/api/public/channels/channel%2Fwith%20space/messages?page=1` |
   | Map author and timestamp fields correctly | Successful `200` response with one `PublicMessageResponse` | Returned message contains `channelId`, `authorId`, nested `author`, `content`, and `timestamp = createdAt` |
   | Convert `editedAt = null` to `undefined` | Successful `200` response with `editedAt = null` | Returned message has `editedAt` equal to `undefined` |
   | Return empty fallback on 404 | Valid inputs; `fetch` resolves with `ok = false`, `status = 404` | Returns `{ messages: [], hasMore: false }` |
  +7 -6
```

#### Tool: exec_command

```sh
rtk git status -sb
```

Output:

```text
## codex/issue-289-public-api-service-spec
 M docs/test-specs/frontend-public-api-service-spec.md
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T20:35:10.978Z

This is a focused doc fix: the only change is correcting the fetch URL expectations to match `API_CONFIG.BASE_URL` in tests. I’m committing and pushing that now; I’m skipping lint/typecheck again because the repo’s spec guidance says not to run build/test commands for specification work.

#### Tool: exec_command

```sh
rtk git add docs/test-specs/frontend-public-api-service-spec.md
```

Output:

```text
ok ✓ 1 file changed, 7 insertions(+), 6 deletions(-)
```

#### Tool: exec_command

```sh
rtk git diff --cached --stat
```

Output:

```text
docs/test-specs/frontend-public-api-service-spec.md | 13 +++++++------
 1 file changed, 7 insertions(+), 6 deletions(-)
```

#### Tool: exec_command

```sh
rtk git commit -m "Fix public API spec URL assertions" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
ok ✓ codex/i
```

#### Tool: exec_command

```sh
rtk git rev-parse --short HEAD
```

Output:

```text
2951e1d
```

#### Tool: exec_command

```sh
rtk git push
```

Output:

```text
ok ✓ codex/issue-289-public-api-service-spec
```

#### Tool: exec_command

```sh
rtk git status -sb
```

Output:

```text
## codex/issue-289-public-api-service-spec
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T20:35:27.925Z

The follow-up commit is pushed. I’m replying to the reviewer now with the exact fix and resolving the thread, then I’ll do a brief watch pass for any new comments.

#### Tool: exec_command

```sh
npx agent-reviews --reply 4057199311 "Fixed in 2951e1d. Updated the spec to state the default test-time API base URL and changed the affected fetch URL assertions to the full absolute form built by publicApiService.ts." --resolve
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 72870,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'npx agent-reviews --reply 4057199311 "Fixed in 2951e1d. Updated the spec to state the default test-time API base URL and changed the affected fetch URL assertions to the full absolute form built by publicApiService.ts." --resolve'
Chunk ID: 142ec5
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 46
Output:
[32m✓ Reply posted successfully[0m
  [2mhttps://github.com/acabrera04/Harmony/pull/298#issuecomment-4185103175[0m
[2mThread resolution skipped (not a review comment thread)[0m
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T20:35:38.069Z

The reviewer got a reply; GitHub treated it as a top-level review rather than an inline thread, so there was nothing to resolve mechanically. I’m doing one watcher pass now to catch any fresh comments before I close this out.

#### Tool: exec_command

```sh
npx agent-reviews --watch --timeout 60
```

Output:

```text

[1m=== PR Comments Watch Mode ===[0m
[2mPR #298: https://github.com/acabrera04/Harmony/pull/298[0m
[2mPolling every 30s, exit after 60s of inactivity[0m
[2mFilters: all, all comments[0m
[2mStarted at 2026-04-03 20:35:39[0m

[2m[2026-04-03 20:35:40] Initial state: 1 existing comments tracked[0m

[33m=== EXISTING COMMENTS ===[0m
[1m[4057199311][0m [35mREVIEW[0m by [32mdeclanblanc[0m [31m○ no reply[0m
  [2m- [x] **Logic over Style**: Spec logic is sound; program paths match the implementation accuratel...[0m
```

#### Tool: write_stdin

```json
{
  "session_id": 65632,
  "chars": "",
  "yield_time_ms": 65000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'npx agent-reviews --watch --timeout 60'
Chunk ID: 4e8c5a
Wall time: 57.0117 seconds
Process exited with code 0
Original token count: 74
Output:
[2m[2026-04-03 20:36:10] Poll #1: No new comments (31s/60s idle)[0m
[2m[2026-04-03 20:36:40] Poll #2: No new comments (61s/60s idle)[0m

[32m=== WATCH COMPLETE ===[0m
[2mNo new comments after 60s of inactivity.[0m
[2mTotal comments tracked: 1[0m
[2mExiting at 2026-04-03 20:36:40[0m
```

#### Tool: update_plan

- Explanation: Fetched the outstanding PR review, applied the only actionable fix, pushed a follow-up commit, replied to the reviewer, and completed a quiet watch pass with no new comments.

- Plan:
  - [completed] Fetch unanswered PR review comments with full context for the current branch/PR
  - [completed] Evaluate each comment and implement any necessary code or documentation fixes
  - [completed] Run relevant verification for any applied fixes, then commit and push
  - [completed] Reply to every processed review comment and resolve threads
  - [completed] Watch briefly for newly added comments and summarize the final status

Output:

```text
Plan updated
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T20:36:55.414Z

## PR Review Resolution Summary

### Results
- Fixed: 1
- Already addressed: 0
- Won't fix: 0
- Discussion required: 0
- Skipped per user: 0

### By Reviewer
#### `declanblanc`
- Absolute URL assertions were missing the `API_CONFIG.BASE_URL` prefix in the spec.
  Fixed in `2951e1d`.

### What changed
- Updated [`docs/test-specs/frontend-public-api-service-spec.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/test-specs/frontend-public-api-service-spec.md) to state the default test-time base URL assumption.
- Changed the affected `fetch` assertion examples to full absolute URLs for:
  - `fetchPublicServer`
  - `fetchPublicChannel`
  - `fetchPublicMessages`

### Validation
- Reviewed the implementation and constants to confirm `API_CONFIG.BASE_URL` defaults to `http://localhost:4000` in tests.
- Spec-only change, so I did not run lint/typecheck/build per the repo’s specification guidance.

### GitHub status
- Follow-up commit pushed to the PR branch: `2951e1d`
- Replied to the review on the PR with the fix summary.
- Watch pass completed with no new comments.

### Turn 5: [$codex-conversation-exporter](/Users/allen/repos/codex-logs-export/skil

#### 👤 User Prompt

- Time: 2026-04-03T21:40:29.446Z

```text
[$codex-conversation-exporter](/Users/allen/repos/codex-logs-export/skills/codex-conversation-exporter/SKILL.md) 019d54dc-50ea-72e2-bafe-66236cd577d2 to llm-logs/acabrera04-logs/acabrera04-tests
```

_No assistant or tool activity recorded after this prompt._

### Turn 6: <skill> <name>codex-conversation-exporter</name>

#### 👤 User Prompt

- Time: 2026-04-03T21:40:29.446Z

````text
<skill>
<name>codex-conversation-exporter</name>
<path>/Users/allen/repos/codex-logs-export/skills/codex-conversation-exporter/SKILL.md</path>
---
name: codex-conversation-exporter
description: Export Codex session logs to Markdown using the local codex-export CLI instead of reconstructing transcripts with model tokens.
---

# Codex Conversation Exporter

Use this skill when the user asks to export Codex logs, save a Codex conversation, convert a session to Markdown, or archive a transcript locally.

## Rules

- Prefer the local `codex-export` CLI over reconstructing a transcript in-model.
- If the user has not identified a session, run `codex-export list` first and show the relevant candidates.
- Default to messages plus tool activity.
- Include hidden system/developer prompts only when the user explicitly asks for them.
- Write to a user-visible path unless the user asks for stdout or another destination.
- Report the output path back to the user after a file export.

## Command patterns

List recent sessions:

```bash
codex-export list
codex-export list --limit 10
codex-export list --since 2026-03-30
```

Export by thread id:

```bash
codex-export export <thread-id>
codex-export export <thread-id> --out ~/Desktop
codex-export export <thread-id> --messages-only
codex-export export <thread-id> --all
codex-export export <thread-id> --include-hidden-prompts
codex-export export <thread-id> --stdout
```

Export by rollout path:

```bash
codex-export export --path ~/.codex/sessions/.../rollout-*.jsonl
codex-export export --path ~/.codex/sessions/.../rollout-*.jsonl --out ~/Desktop
```

## Flag guide

- `--out <file-or-dir>` writes to a specific file or directory.
- `--stdout` prints the Markdown instead of writing a file.
- `--messages-only` omits tool calls and tool outputs.
- `--all` includes low-level tool metadata and raw wrappers that are hidden by default.
- `--include-hidden-prompts` includes developer/system prompt layers.
- `--since <date>` filters `list` results.
- `--limit <n>` caps `list` results.

## Agent behavior

When the user says "export this conversation" without a thread id:

1. Run `codex-export list`.
2. Identify the most likely current session from title, cwd, and recency.
3. Export it with the default mode unless the user requested a different output.
4. Return the exact file path written.

`codex-log-export` remains available as a compatibility alias.

</skill>
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-03T21:40:43.743Z

Using the `codex-conversation-exporter` skill. I’m exporting thread `019d54dc-50ea-72e2-bafe-66236cd577d2` to the requested logs directory with the default mode, which includes messages plus tool activity.

#### Tool: exec_command

```sh
rtk read /Users/allen/repos/codex-logs-export/skills/codex-conversation-exporter/SKILL.md
```

Output:

````text
---
name: codex-conversation-exporter
description: Export Codex session logs to Markdown using the local codex-export CLI instead of reconstructing transcripts with model tokens.
---

# Codex Conversation Exporter

Use this skill when the user asks to export Codex logs, save a Codex conversation, convert a session to Markdown, or archive a transcript locally.

## Rules

- Prefer the local `codex-export` CLI over reconstructing a transcript in-model.
- If the user has not identified a session, run `codex-export list` first and show the relevant candidates.
- Default to messages plus tool activity.
- Include hidden system/developer prompts only when the user explicitly asks for them.
- Write to a user-visible path unless the user asks for stdout or another destination.
- Report the output path back to the user after a file export.

## Command patterns

List recent sessions:

```bash
codex-export list
codex-export list --limit 10
codex-export list --since 2026-03-30
```

Export by thread id:

```bash
codex-export export <thread-id>
codex-export export <thread-id> --out ~/Desktop
codex-export export <thread-id> --messages-only
codex-export export <thread-id> --all
codex-export export <thread-id> --include-hidden-prompts
codex-export export <thread-id> --stdout
```

Export by rollout path:

```bash
codex-export export --path ~/.codex/sessions/.../rollout-*.jsonl
codex-export export --path ~/.codex/sessions/.../rollout-*.jsonl --out ~/Desktop
```

## Flag guide

- `--out <file-or-dir>` writes to a specific file or directory.
- `--stdout` prints the Markdown instead of writing a file.
- `--messages-only` omits tool calls and tool outputs.
- `--all` includes low-level tool metadata and raw wrappers that are hidden by default.
- `--include-hidden-prompts` includes developer/system prompt layers.
- `--since <date>` filters `list` results.
- `--limit <n>` caps `list` results.

## Agent behavior

When the user says "export this conversation" without a thread id:

1. Run `codex-export list`.
2. Identify the most likely current session from title, cwd, and recency.
3. Export it with the default mode unless the user requested a different output.
4. Return the exact file path written.

`codex-log-export` remains available as a compatibility alias.
````

#### Tool: exec_command

```sh
codex-export export 019d54dc-50ea-72e2-bafe-66236cd577d2 --out llm-logs/acabrera04-logs/acabrera04-tests
```
