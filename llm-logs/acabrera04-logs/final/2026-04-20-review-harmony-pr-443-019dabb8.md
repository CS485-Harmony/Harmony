# Codex Conversation Export

## Metadata

- Thread ID: 019dabb8-56c4-7e63-bbdb-d18101c2c726
- Timestamp: 2026-04-20T16:27:58.024Z
- CWD: /Users/allen/.codex/worktrees/1042/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: medium
- Rollout Path: /Users/allen/.codex/sessions/2026/04/20/rollout-2026-04-20T12-27-58-019dabb8-56c4-7e63-bbdb-d18101c2c726.jsonl

## Transcript

### Turn 1: Review

#### 👤 User Prompt

- Time: 2026-04-20T16:28:04.145Z

```text
Review https://github.com/CS485-Harmony/Harmony/pull/443
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:28:13.041Z

Reviewing PR #443 against the repo’s review workflow first, then I’ll pull the PR diff and inspect the changed code in the local worktree before posting findings.

#### Tool: exec_command

```sh
pwd && rg -n "Harmony PR review|\.github/PR_REVIEW\.md|WORKFLOW\.md" /Users/allen/.codex/memories/MEMORY.md
```

Output:

```text
/Users/allen/.codex/worktrees/1042/Harmony
104:- The durable validation path for Harmony deployment work was: read `WORKFLOW.md` plus deployment docs, inspect Railway service metadata/logs, collect repeated `/health` probes, run the cloud-safe integration suite against the live hosts, save the bundle under `deployment/issue-330/`, then post issue updates and open the PR [Task 1]
118:# Task Group: Harmony PR review and review-resolution workflow
120:applies_to: cwd=/Users/allen/.codex/worktrees/*/Harmony; reuse_rule=safe for Harmony PR review tasks that follow the repo's `WORKFLOW.md` and `.github/PR_REVIEW.md`; verify current remote/worktree before assuming repo names or branch refs.
142:- Harmony PR review, .github/PR_REVIEW.md, WORKFLOW.md, bundled review, single bundled review, checklist of 8 guidelines, gh pr view, gh pr diff, gh pr review, gh api, file_comments expected objects not strings, acabrera04/Harmony, EmptyShell, VoiceProvider, system admin bypass, useChannelEvents, useServerEvents, SSE reconnect
187:- In Harmony PR reviews, load `WORKFLOW.md` and `.github/PR_REVIEW.md` first. The durable pattern is checklist first, then one bundled review with line-specific findings or a clear approval if the updated head is good [Task 1][Task 2][Task 3][Task 5]
```

#### Tool: exec_command

```sh
sed -n '1,220p' WORKFLOW.md
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
sed -n '1,260p' .github/PR_REVIEW.md
```

Output:

```text
# PR Review Guidelines

When conducting PR Reviews, follow these guidelines:
1. **Prioritize Logic over Style:** Ensure the code is efficient, DRY (Don't Repeat Yourself), and logically sound.
2. **Security First:** Verify that the changes do not introduce vulnerabilities (e.g., lack of input validation, exposed secrets).
3. **Architectural Alignment:** If applicable, ensure the changes adhere strictly to the patterns defined in `@../docs/unified-backend-architecture.md`.
4. **Issue Completion:** If the PR is attached to an issue, verify that the code successfully satisfies every acceptance criteria of that issue.
5. **No Nitpicking:** Do not leave comments regarding stylistic choices, formatting, or subjective naming conventions unless they violate core project readability. Focus only on critical logic, performance, or architectural flaws.
6. **Avoid Repetition:** Do not repeat feedback that has already been stated in previous reviews on this PR.
7. **Iterative Reviews:** If this is not your first review on the PR:
    - First, check if the new commits have correctly addressed your previous review comments.
    - If a previous concern has been addressed, explicitly resolve the associated comment.
8. **Prevent CI Failures:** Analyze the code for obvious issues that would break the pipeline. Specifically check for syntax errors, missing imports/dependencies, unhandled exceptions, and logic that would clearly break existing tests.

**Execution Instruction**: Before providing your code feedback, output a markdown checklist of the 8 guidelines above. Mark each one as [x] if it passes or [ ] if it fails, and briefly explain why. Then, provide your single bundled review. Use inline subcomments within that single review for specific lines of codes. Do not post multiple standalone comments.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:28:20.925Z

I’ve loaded the repo-specific review rules. Next step is pulling PR metadata, current review state, and the exact committed diff so I can avoid repeating existing comments and keep the review scoped to `HEAD`.

#### Tool: exec_command

```sh
git status --short
```

Output:

```text

```

#### Tool: exec_command

```sh
git remote -v
```

Output:

```text
origin	git@github.com:CS485-Harmony/Harmony.git (fetch)
origin	git@github.com:CS485-Harmony/Harmony.git (push)
```

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json number,title,headRefName,headRepositoryOwner,baseRefName,author,body,mergeStateStatus,reviewDecision,commits,files
```

Output:

```text
{"author":{"id":"MDQ6VXNlcjU1MDEyNDk0","is_bot":false,"login":"AvanishKulkarni","name":"Avanish Kulkarni"},"baseRefName":"main","body":"## Summary\n\n- Implements CL-C2.1–C2.6 per dev spec §3/§4 under `harmony-backend/src/services/metaTag/`\n- `MetaTagService` — facade with `generateMetaTags`, `getOrGenerateCached`, `invalidateCache`; stubs for `scheduleRegeneration`/`getRegenerationJobStatus` (wired by M4 in issue #356)\n- `TitleGenerator` — enforces ≤60 char limit with HTML sanitization and template application (AC-2)\n- `DescriptionGenerator` — enforces 50–160 char range, extends short summaries with channel context (AC-2)\n- `MetaTagCache` — Redis-backed via existing `cacheService` + `CacheKeys.metaChannel` with configurable TTL (default 3600s per spec D7.1)\n- `OpenGraphGenerator` and `StructuredDataGenerator` — skeleton implementations with correct method signatures\n- AC-9 fallback: on any generation error, `MetaTagService` returns channel-name-based fallback tags with `needsRegeneration=true`\n- 29 unit tests covering all AC items\n\n## Note on pre-existing test failure\n\n`tests/metaTag.repository.test.ts` fails with TypeScript errors about missing schema columns (`customTitle`, `customDescription`, `customOgImage`, `updatedAt`). This failure exists on `main` before this branch and is not caused by these changes.\n\n## Test plan\n\n- [x] All 29 new unit tests pass (`npx jest tests/metaTagService.test.ts`)\n- [x] No regressions in existing test suite (658 tests pass)\n- [x] TypeScript compiles cleanly for all new files\n\nCloses #350\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","commits":[{"authoredDate":"2026-04-20T13:39:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:39:37Z","messageBody":"…350)\n\nAdds CL-C2.1–C2.6 per dev spec §3/§4:\n- MetaTagService facade with generateMetaTags, getOrGenerateCached,\n  invalidateCache, and stub scheduleRegeneration/getRegenerationJobStatus\n- TitleGenerator enforcing ≤60 char limit with sanitization and templates\n- DescriptionGenerator enforcing 50–160 char range with key phrase extraction\n- OpenGraphGenerator and StructuredDataGenerator (skeleton implementations)\n- MetaTagCache backed by Redis via existing cacheService + CacheKeys.metaChannel\n- AC-9: fallback tags with needsRegeneration=true on generation failure\n- 28 unit tests covering AC-2 length limits, sanitization, cache, and fallback\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat(seo): implement M2 meta tag generation service skeleton (issue #…","oid":"e8875f5e9ef5220b017e4b2e855d8d576a8a0713"},{"authoredDate":"2026-04-20T13:42:00Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:42:00Z","messageBody":"Extends summarizeThread to append channel context when the composed\ntext falls below the 50-char minimum, satisfying AC-2 for all inputs\nincluding single-word messages. Adds a regression test.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix(seo): enforce 50-char minimum on auto-generated descriptions (AC-2)","oid":"898f94332cbe35434ecf4661c778ccb07927f1f0"},{"authoredDate":"2026-04-20T13:43:04Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T13:43:04Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"94fa035019a4c79638d269724697d5433e7563bc"},{"authoredDate":"2026-04-20T14:27:39Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T14:27:39Z","messageBody":"- titleGenerator: sanitize full composed string in generateFromMessage;\n  use replaceAll in applyTemplate to handle repeated placeholders\n- descriptionGenerator: add sanitizeText helper; sanitize channel fields\n  in summarizeThread; enforce 50-char minimum in enforceLength (AC-2)\n- openGraphGenerator: add channel param to generateTwitterCard; use\n  summary_large_image only when a real preview image is available\n- structuredDataGenerator: use BASE_URL env var in generateBreadcrumbList;\n  add stub datePublished/author fields to generateDiscussionForum\n- metaTagCache: make set() use this.ttl as single source of truth\n- metaTagService: sanitize channel context in buildFallbackTags; rename\n  internal methods to generateMetaTagsFromContext / getOrGenerateCachedFromContext;\n  add spec-aligned stub signatures for generateMetaTags(channelId),\n  getOrGenerateCached(channelId), getMetaTagsForPreview(channelId);\n  fix scheduleRegeneration return type and getRegenerationJobStatus signature\n- types: add MetaTagPreview and MetaTagJobStatus interfaces per spec\n- regenerate Prisma client; apply add_meta_tag_overrides migration so\n  metaTag.repository tests compile and pass\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings for M2 meta tag service skeleton","oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"authoredDate":"2026-04-20T16:26:29Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T16:26:29Z","messageBody":"… stubs, scheduleRegeneration return)\n\n- Replace this.generateMetaTagsFromContext with metaTagService.* to avoid destructuring hazard\n- Replace this.ttl with DEFAULT_TTL in MetaTagCache.set to avoid destructuring hazard\n- Remove extra priority/idempotencyKey fields from scheduleRegeneration return to match declared type\n- Add IMetaTagGenerator generate()/validate() stubs to TitleGenerator, DescriptionGenerator, OpenGraphGenerator (CL-I1)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings (this-binding, IMetaTagGenerator…","oid":"85d862fcc5f85f782368504916607f4eb1e45164"}],"files":[{"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","additions":98,"deletions":0},{"path":"harmony-backend/src/services/metaTag/metaTagCache.ts","additions":22,"deletions":0},{"path":"harmony-backend/src/services/metaTag/metaTagService.ts","additions":148,"deletions":0},{"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","additions":55,"deletions":0},{"path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","additions":66,"deletions":0},{"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","additions":65,"deletions":0},{"path":"harmony-backend/src/services/metaTag/types.ts","additions":93,"deletions":0},{"path":"harmony-backend/tests/metaTagService.test.ts","additions":264,"deletions":0},{"path":"llm-logs/2026-04-20-094302-session-ce430386.md","additions":784,"deletions":0}],"headRefName":"feature/issue-350-meta-tag-service-skeleton","headRepositoryOwner":{"id":"O_kgDOEFWyLA","login":"CS485-Harmony"},"mergeStateStatus":"BLOCKED","number":443,"reviewDecision":"CHANGES_REQUESTED","title":"feat(seo): M2 meta tag generation service skeleton (issue #350)"}
```

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls/443/reviews
```

Output:

````text
[{"id":4140583007,"node_id":"PRR_kwDORIrGY872zEhf","user":{"login":"declanblanc","id":49934576,"node_id":"MDQ6VXNlcjQ5OTM0NTc2","avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","gravatar_id":"","url":"https://api.github.com/users/declanblanc","html_url":"https://github.com/declanblanc","followers_url":"https://api.github.com/users/declanblanc/followers","following_url":"https://api.github.com/users/declanblanc/following{/other_user}","gists_url":"https://api.github.com/users/declanblanc/gists{/gist_id}","starred_url":"https://api.github.com/users/declanblanc/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/declanblanc/subscriptions","organizations_url":"https://api.github.com/users/declanblanc/orgs","repos_url":"https://api.github.com/users/declanblanc/repos","events_url":"https://api.github.com/users/declanblanc/events{/privacy}","received_events_url":"https://api.github.com/users/declanblanc/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"## PR Review Checklist\n\n- [x] **1. Logic over Style** — Core logic is sound and the generation pipeline is coherent; concerns raised below are architectural, not stylistic.\n- [ ] **2. Security First** — `structuredDataGenerator.ts` hardcodes `https://harmony.chat` in `generateBreadcrumbList()` instead of reading `BASE_URL`, creating a potential data-leak path in non-production environments (staging/preview could expose wrong canonical URLs to crawlers).\n- [ ] **3. Architectural Alignment** — Multiple public method signatures diverge from the spec-defined contracts (§9.1). See details below.\n- [ ] **4. Issue Completion** — AC-9 (fallback + `needsRegeneration`) is covered, but AC-2 minimum length enforcement is incomplete, and several other acceptance criteria depend on correct method signatures that are not yet aligned (AC-5, AC-6 require `scheduleRegeneration` to return `{ jobId, status }`, not `void`).\n- [x] **5. No Nitpicking** — Only architectural and correctness issues raised.\n- [x] **6. Avoid Repetition** — First review on this PR.\n- [x] **7. Iterative Reviews** — First review.\n- [ ] **8. Prevent CI Failures** — The PR description acknowledges `tests/metaTag.repository.test.ts` is failing. That test failure exists on `main` and should be resolved before or alongside this PR to prevent CI regressions from compounding.\n\n---\n\n## Required Changes\n\n### 1. Method signatures must match the spec API contract (§9.1.1)\n\nThe spec defines these signatures for `MetaTagService`:\n\n```typescript\ngenerateMetaTags(channelId: string, options?: { forceRegenerate?: boolean, includeStructuredData?: boolean }): Promise<MetaTagSet>\ngetOrGenerateCached(channelId: string): Promise<MetaTagSet>\nscheduleRegeneration(channelId: string, priority?: 'high' | 'normal' | 'low', idempotencyKey?: string): Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\ngetMetaTagsForPreview(channelId: string): Promise<MetaTagPreview>\n```\n\nThe implementation instead takes `(channel: ChannelContext, messages: MessageContext[])` — pre-fetched data — rather than a `channelId`. This is a contract-breaking departure: the spec intends `MetaTagService` to own resolution (looking up channel and messages internally, not receiving them from callers). More importantly, the stubs for `scheduleRegeneration` and `getRegenerationJobStatus` have the wrong signatures:\n\n- `scheduleRegeneration` returns `Promise<void>` but must return `Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>`. AC-5/AC-6 directly test this return shape.\n- `getRegenerationJobStatus` only accepts `_channelId` but the spec signature requires `(channelId: string, jobId: string)`.\n- `getMetaTagsForPreview` returns `Promise<MetaTagSet>` but the spec return type is `Promise<MetaTagPreview>`, which is a different shape (includes `searchPreview`, `socialPreview`, `isCustom`, `generatedAt`).\n\nEven as stubs, these signatures must match the spec so callers and future implementations are correct by construction.\n\n### 2. `IMetaTagGenerator` (CL-I1) interface is not implemented by any class\n\nThe spec (§3, §4.8) defines:\n\n```typescript\ninterface IMetaTagGenerator {\n  generate(): MetaTagSet;\n  validate(): boolean;\n}\n```\n\n`TitleGenerator`, `DescriptionGenerator`, and `OpenGraphGenerator` are all listed in the class diagram as implementing this interface. None of them do. The interface exists in `types.ts` but is never referenced. Since the spec explicitly lists this as `CL-I1` with an `implements` relationship, the skeleton is incomplete on this point.\n\n### 3. `DescriptionGenerator.enforceLength` does not enforce the minimum\n\n`enforceLength()` only truncates — it never pads or adjusts content that is below 50 characters. The method name implies it enforces both bounds (50–160). Callers that use `enforceLength` directly (e.g., `buildFallbackTags` in `metaTagService.ts`) can produce descriptions shorter than 50 chars, violating AC-2. The minimum enforcement should be present in `enforceLength` or the method should be renamed `truncateToMaxLength` to be accurate about what it does.\n\n### 4. Hardcoded base URL in `structuredDataGenerator.ts`\n\n`generateBreadcrumbList()` builds `https://harmony.chat/s/${channel.serverSlug}` with a hardcoded domain, but `metaTagService.ts` correctly reads `process.env.BASE_URL ?? 'https://harmony.chat'`. The structured data generator must use the same `BASE_URL` env var for consistency across environments. In a preview/staging deployment this will emit the wrong domain in JSON-LD output, potentially causing Google Search Console to reject the structured data.\n\n### 5. Twitter card type is always `summary_large_image`\n\nThe spec (§9.1.4) states: \"default to `summary`; switch to `summary_large_image` only when a valid large preview image is available.\" The implementation hardcodes `summary_large_image` in all cases. `selectPreviewImage` currently always returns the default image, so this always produces the large-image variant even when no real preview exists. The skeleton should either default to `summary` or apply the conditional logic specified.\n\n### 6. `generateDiscussionForum` omits required JSON-LD fields\n\nPer spec Appendix A and the flow diagrams (F1.19), `DiscussionForumPosting` requires `datePublished`, `dateModified`, and `author` to produce valid rich snippet schema. The current implementation returns:\n\n```typescript\n{ '@context', '@type', headline, description, mainEntity }\n```\n\nWithout `datePublished` and `author`, Google will not render a rich result for this structured data. These can be `null`/`undefined` stubs for now — the issue is they are not present at all in the return type or implementation, making the skeleton incorrect for downstream consumers.\n\n### 7. Pre-existing test failure in `metaTag.repository.test.ts`\n\nThe PR description notes this failure exists on `main`. Merging this PR without resolving it compounds the CI signal, making it harder to distinguish new regressions from pre-existing ones. This test failure should be fixed as part of this PR or tracked in a separate linked issue before merge.","state":"CHANGES_REQUESTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140583007","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140583007"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T13:50:40Z","commit_id":"94fa035019a4c79638d269724697d5433e7563bc"},{"id":4140585233,"node_id":"PRR_kwDORIrGY872zFER","user":{"login":"copilot-pull-request-reviewer[bot]","id":175728472,"node_id":"BOT_kgDOCnlnWA","avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","gravatar_id":"","url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D","html_url":"https://github.com/apps/copilot-pull-request-reviewer","followers_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/followers","following_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/following{/other_user}","gists_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/gists{/gist_id}","starred_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/subscriptions","organizations_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/orgs","repos_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/repos","events_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/events{/privacy}","received_events_url":"https://api.github.com/users/copilot-pull-request-reviewer%5Bbot%5D/received_events","type":"Bot","user_view_type":"public","site_admin":false},"body":"## Pull request overview\n\nIntroduces the backend skeleton for M2 SEO meta tag generation under `harmony-backend/src/services/metaTag/`, including generators, a Redis-backed cache, and unit tests to validate basic length/sanitization/fallback behavior.\n\n**Changes:**\n- Added `MetaTagService` facade plus `MetaTagCache` (Redis via existing `cacheService`/`CacheKeys.metaChannel`).\n- Implemented initial `TitleGenerator`/`DescriptionGenerator` plus skeleton `OpenGraphGenerator`/`StructuredDataGenerator`.\n- Added Jest unit tests covering generators, cache behavior, and fallback behavior.\n\n### Reviewed changes\n\nCopilot reviewed 9 out of 9 changed files in this pull request and generated 14 comments.\n\n<details>\n<summary>Show a summary per file</summary>\n\n| File | Description |\r\n| ---- | ----------- |\r\n| harmony-backend/src/services/metaTag/types.ts | Adds DTOs/interfaces for meta tag generation outputs and inputs. |\r\n| harmony-backend/src/services/metaTag/titleGenerator.ts | Implements title generation, sanitization, truncation, and template application. |\r\n| harmony-backend/src/services/metaTag/descriptionGenerator.ts | Implements description generation, key phrase extraction, and length enforcement. |\r\n| harmony-backend/src/services/metaTag/openGraphGenerator.ts | Adds OG/Twitter tag generator skeleton and defaults. |\r\n| harmony-backend/src/services/metaTag/structuredDataGenerator.ts | Adds JSON-LD generator skeleton (discussion forum, breadcrumb, org, web page). |\r\n| harmony-backend/src/services/metaTag/metaTagCache.ts | Adds Redis-backed get/set/invalidate wrapper for meta tag cache. |\r\n| harmony-backend/src/services/metaTag/metaTagService.ts | Adds facade orchestration, caching entrypoint, invalidation, and fallback behavior. |\r\n| harmony-backend/tests/metaTagService.test.ts | Adds unit tests for generators, cache wrapper, and MetaTagService behavior. |\n</details>\n\n\n\n\n\n\n---\n\n💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140585233","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"CONTRIBUTOR","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140585233"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T13:51:03Z","commit_id":"94fa035019a4c79638d269724697d5433e7563bc"},{"id":4140854805,"node_id":"PRR_kwDORIrGY8720G4V","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140854805","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140854805"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:27:52Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140855532,"node_id":"PRR_kwDORIrGY8720HDs","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140855532","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140855532"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:27:59Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140856232,"node_id":"PRR_kwDORIrGY8720HOo","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140856232","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140856232"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:28:05Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140856988,"node_id":"PRR_kwDORIrGY8720Hac","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140856988","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140856988"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:28:12Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140857830,"node_id":"PRR_kwDORIrGY8720Hnm","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140857830","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140857830"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:28:19Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140858768,"node_id":"PRR_kwDORIrGY8720H2Q","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140858768","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140858768"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:28:26Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140859741,"node_id":"PRR_kwDORIrGY8720IFd","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140859741","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140859741"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:28:34Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140860628,"node_id":"PRR_kwDORIrGY8720ITU","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140860628","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140860628"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:28:42Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140861444,"node_id":"PRR_kwDORIrGY8720IgE","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140861444","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140861444"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:28:49Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140862434,"node_id":"PRR_kwDORIrGY8720Ivi","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140862434","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140862434"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:28:57Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140863259,"node_id":"PRR_kwDORIrGY8720I8b","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140863259","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140863259"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:29:05Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140864157,"node_id":"PRR_kwDORIrGY8720JKd","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140864157","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140864157"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:29:12Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140865135,"node_id":"PRR_kwDORIrGY8720JZv","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140865135","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140865135"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:29:20Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4140866088,"node_id":"PRR_kwDORIrGY8720Joo","user":{"login":"AvanishKulkarni","id":55012494,"node_id":"MDQ6VXNlcjU1MDEyNDk0","avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","gravatar_id":"","url":"https://api.github.com/users/AvanishKulkarni","html_url":"https://github.com/AvanishKulkarni","followers_url":"https://api.github.com/users/AvanishKulkarni/followers","following_url":"https://api.github.com/users/AvanishKulkarni/following{/other_user}","gists_url":"https://api.github.com/users/AvanishKulkarni/gists{/gist_id}","starred_url":"https://api.github.com/users/AvanishKulkarni/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/AvanishKulkarni/subscriptions","organizations_url":"https://api.github.com/users/AvanishKulkarni/orgs","repos_url":"https://api.github.com/users/AvanishKulkarni/repos","events_url":"https://api.github.com/users/AvanishKulkarni/events{/privacy}","received_events_url":"https://api.github.com/users/AvanishKulkarni/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"","state":"COMMENTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140866088","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4140866088"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T14:29:28Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"id":4141409312,"node_id":"PRR_kwDORIrGY8722OQg","user":{"login":"FardeenI","id":144937568,"node_id":"U_kgDOCKOSYA","avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","gravatar_id":"","url":"https://api.github.com/users/FardeenI","html_url":"https://github.com/FardeenI","followers_url":"https://api.github.com/users/FardeenI/followers","following_url":"https://api.github.com/users/FardeenI/following{/other_user}","gists_url":"https://api.github.com/users/FardeenI/gists{/gist_id}","starred_url":"https://api.github.com/users/FardeenI/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/FardeenI/subscriptions","organizations_url":"https://api.github.com/users/FardeenI/orgs","repos_url":"https://api.github.com/users/FardeenI/repos","events_url":"https://api.github.com/users/FardeenI/events{/privacy}","received_events_url":"https://api.github.com/users/FardeenI/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"- [ ] **Prioritize Logic over Style:** Mostly solid, but there’s a `this`-binding hazard in `metaTagService` (and `MetaTagCache`) that can cause runtime failures if methods are destructured.\n- [ ] **Security First:** A full LLM session log is committed under `llm-logs/` (includes local paths + tool output). This is a real data-leak risk and shouldn’t land in `main`.\n- [ ] **Architectural Alignment:** Core structure matches the spec intent, but a couple stub contracts are still inconsistent (see `scheduleRegeneration`).\n- [ ] **Issue Completion:** The skeleton looks close, but the accidental log file + contract mismatch should be fixed before merge.\n- [x] **No Nitpicking:** Feedback below is limited to correctness, security, and future breakage risks.\n- [x] **Avoid Repetition:** I’m not rehashing the already-resolved spec-signature threads.\n- [x] **Iterative Reviews:** Prior review threads appear resolved; focusing only on remaining issues.\n- [ ] **Prevent CI Failures:** CI is green, but the `this` pitfall can still break runtime usage patterns.\n\n## Review (Request changes)\n\n### 1) 🚫 Remove committed session log (security/privacy)\n**File:** `llm-logs/2026-04-20-094302-session-ce430386.md`\n\nThis appears to be an exported agent conversation log (includes local filesystem paths like `/Users/...` and detailed tool outputs). Even if nothing secret is present *today*, it’s an easy footgun and shouldn’t be versioned.\n\n**Actionable fix:**\n- `git rm llm-logs/2026-04-20-094302-session-ce430386.md`\n- Add an ignore rule so it doesn’t happen again (pick the narrowest that matches project intent), e.g.:\n  - `llm-logs/*.md` (or `llm-logs/**` if the whole folder is meant to be local-only)\n\n### 2) Avoid `this` inside exported object-literal services (runtime hazard)\nIf any caller does destructuring, e.g. `const { getOrGenerateCachedFromContext } = metaTagService;`, `this` becomes `undefined` and `this.generateMetaTagsFromContext(...)` will throw.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// current\nconst tags = await this.generateMetaTagsFromContext(channel, messages);\n\n// suggested (no this-binding hazard)\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\n// or refactor helpers outside the object and call them directly\n```\n\nRelated: `MetaTagCache.set()` uses `ttl ?? this.ttl` with the same hazard.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagCache.ts`\n```ts\n// current\nawait cacheService.set(key, tags, { ttl: ttl ?? this.ttl });\n\n// suggested\nawait cacheService.set(key, tags, { ttl: ttl ?? DEFAULT_TTL });\n```\n\n### 3) `scheduleRegeneration` signature/return type mismatch\nRight now the function *returns* `{ priority, idempotencyKey }` conditionally, but the declared return type omits them, and the parameters are positional instead of an options object.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// suggested contract (matches how this will likely be called + avoids positional arg confusion)\nasync scheduleRegeneration(\n  channelId: string,\n  options?: { priority?: 'high' | 'normal' | 'low'; idempotencyKey?: string },\n): Promise<{\n  jobId: string;\n  status: 'queued' | 'deduplicated';\n  priority?: 'high' | 'normal' | 'low';\n  idempotencyKey?: string;\n}> {\n  return {\n    jobId: `meta-tag-regeneration:${channelId}`,\n    status: 'queued',\n    priority: options?.priority,\n    idempotencyKey: options?.idempotencyKey,\n  };\n}\n```\n(Alternatively: keep the simpler return type, but then remove the extra returned fields so the stub is honest.)\n\n---\n\nOnce those are addressed, this looks in good shape to merge: CI is green, tests cover the key length/sanitization/fallback paths, and the service structure is a good foundation for M4 wiring.\n","state":"CHANGES_REQUESTED","html_url":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4141409312","pull_request_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443","author_association":"MEMBER","_links":{"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/443#pullrequestreview-4141409312"},"pull_request":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/443"}},"submitted_at":"2026-04-20T15:42:01Z","commit_id":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}]
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:28:30.627Z

The PR already has earlier requested-changes reviews, so I’m checking only the newest `HEAD` against `main` and looking specifically for anything still broken after those fixes rather than rehashing resolved threads.

#### Tool: exec_command

```sh
git branch --show-current
```

Output:

```text

```

#### Tool: exec_command

```sh
git fetch origin pull/443/head:pr-443
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * [new ref]         refs/pull/443/head -> pr-443
```

#### Tool: exec_command

```sh
gh api graphql -f query='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{isResolved path comments(first:20){nodes{author{login} body url createdAt}}}}}}}' -F owner=CS485-Harmony -F repo=Harmony -F number=443
```

Output:

````text
{"data":{"repository":{"pullRequest":{"reviewThreads":{"nodes":[{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagService.generateMetaTags signature diverges from the dev spec referenced by this PR (spec defines generateMetaTags(channelId, options?) and expects the service to fetch context internally). Either align the method signature/behavior to the spec or update the spec/PR description so downstream integrations don’t drift.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142149","createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. The context-driven implementation is renamed to generateMetaTagsFromContext(channel, messages) for unit tests. A spec-aligned stub generateMetaTags(channelId, options?) is added that throws 'not implemented — wired by M4 (issue #356)'. Callers will be updated to the spec signature when the channel-resolver is wired in M4.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111398713","createdAt":"2026-04-20T14:29:20Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"scheduleRegeneration stub does not match the spec return shape (spec expects a jobId and queued/deduplicated status, plus optional priority/idempotencyKey). Even as a stub, keeping the spec signature/return type will prevent a breaking refactor when M4 wires the queue.\n```suggestion\n  async scheduleRegeneration(\n    channelId: string,\n    options?: { priority?: string; idempotencyKey?: string },\n  ): Promise<{\n    jobId: string;\n    status: 'queued' | 'deduplicated';\n    priority?: string;\n    idempotencyKey?: string;\n  }> {\n    // Queuing logic wired by M4 MetaTagUpdateWorker.\n    // Keep the stub contract aligned with the queue spec to avoid a breaking API change later.\n    return {\n      jobId: `meta-tag-regeneration:${channelId}`,\n      status: 'queued',\n      priority: options?.priority,\n      idempotencyKey: options?.idempotencyKey,\n    };\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142223","createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. scheduleRegeneration now returns Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> with the stub returning a placeholder jobId, matching the spec contract for AC-5/AC-6.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111395320","createdAt":"2026-04-20T14:28:49Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getRegenerationJobStatus stub signature differs from the spec (spec takes both channelId and jobId and returns a MetaTagJobStatus object). Keeping the correct parameters/return type now will make M4 wiring straightforward.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142302","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. getRegenerationJobStatus now takes (channelId: string, jobId: string) and returns Promise<MetaTagJobStatus | null>. MetaTagJobStatus type added to types.ts per spec.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111394608","createdAt":"2026-04-20T14:28:42Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"OpenGraphGenerator.generateOGTags signature doesn’t match the dev spec for CL-C2.4 (spec describes channel/server/analysis-driven generation). If this module is meant to satisfy the spec interface for later wiring, adjust the signature (or add an adapter) to avoid refactors.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142353","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"generateOGTags already accepts channel as its first parameter (unchanged). The related generateTwitterCard signature was aligned with spec in 177c384 (channel is now the first param). The broader spec-signature alignment for generateMetaTags/getOrGenerateCached is addressed separately — see those threads.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111399582","createdAt":"2026-04-20T14:29:28Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/types.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagSet includes needsRegeneration, but the dev spec’s CL-D1 MetaTagSet DTO doesn’t include this field (needs_regeneration is modeled in persistence metadata). Consider keeping regeneration status separate (wrapper type) or update the DTO/spec consistently to avoid contract drift.\n```suggestion\n  keywords: string[];\n}\n\nexport interface MetaTagSetWithRegenerationStatus {\n  metaTags: MetaTagSet;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142384","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Won't fix: The existing unit tests directly assert tags.needsRegeneration (AC-9 test, fallback test), so removing the field from MetaTagSet would break them. Keeping it on the DTO for now; can be split into a wrapper type when the full persistence layer lands in M3/M4.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111397887","createdAt":"2026-04-20T14:29:12Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"DescriptionGenerator.enforceLength only truncates >160 chars and never enforces the 50-char minimum, so generateFromMessages can return descriptions shorter than 50 characters for short channel/server names or very short messages (violates AC-2). Update the length policy to guarantee MIN_LENGTH before returning (e.g., append more context deterministically).\n```suggestion\n  padToMinimumLength(text: string): string {\n    const additions = [\n      ' Join the discussion.',\n      ' Explore the latest updates.',\n      ' Connect with the community.',\n    ];\n\n    let padded = text.trim();\n    if (padded.length === 0) {\n      padded = 'Join the discussion and explore the latest updates.';\n    }\n\n    let additionIndex = 0;\n    while (padded.length < MIN_LENGTH) {\n      padded += additions[additionIndex % additions.length];\n      additionIndex += 1;\n    }\n\n    return padded;\n  },\n\n  enforceLength(text: string): string {\n    let result = text;\n    if (result.length < MIN_LENGTH) {\n      result = this.padToMinimumLength(result);\n    }\n\n    if (result.length > MAX_LENGTH) {\n      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';\n    }\n    return result;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142433","createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. enforceLength now pads text below 50 chars by appending context phrases before truncating. All AC-2 unit tests pass.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111391256","createdAt":"2026-04-20T14:28:12Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"TitleGenerator.generateFromMessage sanitizes only message.content; channel.serverName is appended without sanitization/normalization. Since server names are user-controlled, sanitize the full composed string (or sanitize serverName separately) before truncation to keep title output consistently safe.\n```suggestion\n    const raw = `${message.content} — ${channel.serverName}`;\n    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142492","createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Now sanitizes the full composed string (message.content + channel.serverName) via sanitizeForTitle before truncation.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111389802","createdAt":"2026-04-20T14:27:58Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"applyTemplate uses String.replace per variable, which only replaces the first occurrence of each placeholder. If a template repeats a placeholder (common in localized templates), later occurrences will remain unreplaced. Use a global replacement strategy (e.g., replaceAll or a global RegExp) per key.\n```suggestion\n      (result, [key, value]) => result.replaceAll(`{${key}}`, value),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142532","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Changed result.replace to result.replaceAll so all occurrences of each placeholder are substituted.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111389110","createdAt":"2026-04-20T14:27:52Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"summarizeThread interpolates channel.name and channel.serverName directly into the output without sanitizing/normalizing them. Since these are user-controlled strings, meta descriptions can contain HTML/attribute-breaking characters. Sanitize channel/server fields the same way you sanitize message content.\n```suggestion\n  sanitizeText(text: string): string {\n    return text.replace(/<[^>]*>/g, '').replace(/\\s+/g, ' ').trim();\n  },\n\n  summarizeThread(messages: MessageContext[], channel: ChannelContext): string {\n    const serverName = this.sanitizeText(channel.serverName);\n    const channelName = this.sanitizeText(channel.name);\n    const suffix = ` — Join the discussion on ${serverName}.`;\n\n    if (messages.length === 0) {\n      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;\n      return this.enforceLength(base);\n    }\n\n    const first = this.sanitizeText(messages[0].content);\n    const prefix = `${serverName} › #${channelName}: `;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142575","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added sanitizeText helper to DescriptionGenerator; summarizeThread now sanitizes channel.name and channel.serverName before interpolation.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111390561","createdAt":"2026-04-20T14:28:05Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getOrGenerateCached currently requires ChannelContext + MessageContext[] + optional ttl, but the spec API is getOrGenerateCached(channelId) with caching handled internally. Consider aligning the signature (and moving message fetching inside) to match the spec contract.\n```suggestion\n  async resolveChannelContext(_channelId: string): Promise<ChannelContext> {\n    throw new Error('metaTagService.resolveChannelContext must be implemented with channel lookup');\n  },\n\n  async resolveMessageContexts(_channelId: string): Promise<MessageContext[]> {\n    throw new Error('metaTagService.resolveMessageContexts must be implemented with message lookup');\n  },\n\n  async getOrGenerateCached(\n    channelOrId: ChannelContext | string,\n    messagesOrTtl?: MessageContext[] | number,\n    ttl?: number,\n  ): Promise<MetaTagSet> {\n    const channelId = typeof channelOrId === 'string' ? channelOrId : channelOrId.id;\n    const cached = await MetaTagCache.get(channelId);\n    if (cached) return cached;\n\n    const channel =\n      typeof channelOrId === 'string'\n        ? await this.resolveChannelContext(channelOrId)\n        : channelOrId;\n    const messages =\n      typeof channelOrId === 'string'\n        ? await this.resolveMessageContexts(channelOrId)\n        : Array.isArray(messagesOrTtl)\n          ? messagesOrTtl\n          : [];\n    const cacheTtl =\n      typeof messagesOrTtl === 'number'\n        ? messagesOrTtl\n        : ttl;\n\n    const tags = await this.generateMetaTags(channel, messages);\n    await MetaTagCache.set(channel.id, tags, cacheTtl);\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142625","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added spec-aligned stub getOrGenerateCached(channelId: string) that throws 'not implemented — wired by M4'. The context-driven variant is renamed to getOrGenerateCachedFromContext(channel, messages, ttl?) for use in unit tests and internal generation flow.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111397023","createdAt":"2026-04-20T14:29:05Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagCache.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagCache exposes a ttl property, but set() defaults to DEFAULT_TTL rather than the exported ttl field, so MetaTagCache.ttl is effectively unused/misleading. Consider making ttl the single source of truth (or remove the field).","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142686","createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. set() now uses ttl ?? this.ttl so MetaTagCache.ttl is the single source of truth for the default TTL.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111392031","createdAt":"2026-04-20T14:28:19Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateBreadcrumbList hard-codes the https://harmony.chat domain for the server URL. Use the same configurable BASE_URL/origin used elsewhere so structured data is correct in staging/dev/alternate deployments.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142725","createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateBreadcrumbList now reads process.env.BASE_URL ?? 'https://harmony.chat' consistent with metaTagService.ts.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111392817","createdAt":"2026-04-20T14:28:26Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateTwitterCard signature also diverges from the spec’s CL-C2.4 API (spec is channel/server/analysis-based, not raw strings). Consider aligning the public API now (even if the implementation is still a skeleton).\n```suggestion\n  generateTwitterCard(\n    channel: ChannelContext,\n    title: string,\n    description: string,\n    image?: string,\n  ): TwitterCardTags {\n    return {\n      card: 'summary_large_image',\n      title,\n      description,\n      image: image ?? this.selectPreviewImage(channel),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142775","createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateTwitterCard now accepts channel as the first parameter (matching spec CL-C2.4). Also fixed the card type: uses 'summary' by default, only 'summary_large_image' when a non-default preview image is available.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111393786","createdAt":"2026-04-20T14:28:34Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"buildFallbackTags uses raw channel/server names and only truncates/enforces max length; it does not sanitize. Because fallback is used on generation errors, it should still produce sanitized values to avoid unsafe content flowing into rendered <head>. Route fallback strings through the same sanitization/normalization as the main generators.\n```suggestion\nimport sanitizeHtml from 'sanitize-html';\n\nconst logger = createLogger({ component: 'meta-tag-service' });\n\nconst BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';\n\nfunction sanitizeMetaText(value: string): string {\n  return sanitizeHtml(value, {\n    allowedTags: [],\n    allowedAttributes: {},\n  }).replace(/\\s+/g, ' ').trim();\n}\n\nfunction buildFallbackTags(channel: ChannelContext): MetaTagSet {\n  const sanitizedChannel: ChannelContext = {\n    ...channel,\n    name: sanitizeMetaText(channel.name),\n    serverName: sanitizeMetaText(channel.serverName),\n  };\n  const title = `${sanitizedChannel.name} — ${sanitizedChannel.serverName}`;\n  const description = `Discussions in #${sanitizedChannel.name} on ${sanitizedChannel.serverName}.`;\n  return {\n    title: TitleGenerator.truncateWithEllipsis(title),\n    description: DescriptionGenerator.enforceLength(description),\n    canonical: sanitizedChannel.canonicalUrl,\n    robots: 'index, follow',\n    openGraph: OpenGraphGenerator.generateOGTags(sanitizedChannel, title, description),\n    twitter: OpenGraphGenerator.generateTwitterCard(title, description),\n    structuredData: StructuredDataGenerator.generateDiscussionForum(sanitizedChannel, title, description),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142829","createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. buildFallbackTags now runs channel fields through sanitizeChannelContext (which uses TitleGenerator.sanitizeForTitle) before any interpolation — no new dependency needed since the regex sanitizer is already in scope.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111396192","createdAt":"2026-04-20T14:28:57Z"}]}}]}}}}}
````

#### Tool: exec_command

```sh
git diff --stat origin/main..pr-443
```

Output:

```text
 .github/workflows/run-frontend-e2e.yml             |   4 +
 docs/deployment/replica-readiness-audit.md         |  12 +-
 harmony-backend/src/events/eventBus.ts             |   4 -
 harmony-backend/src/routes/events.router.ts        | 293 ++++----
 .../src/services/metaTag/descriptionGenerator.ts   |  98 +++
 .../src/services/metaTag/metaTagCache.ts           |  22 +
 .../src/services/metaTag/metaTagService.ts         | 148 ++++
 .../src/services/metaTag/openGraphGenerator.ts     |  55 ++
 .../services/metaTag/structuredDataGenerator.ts    |  66 ++
 .../src/services/metaTag/titleGenerator.ts         |  65 ++
 harmony-backend/src/services/metaTag/types.ts      |  93 +++
 .../src/services/serverMember.service.ts           |  25 -
 harmony-backend/tests/events.router.server.test.ts | 111 +--
 harmony-backend/tests/events.router.test.ts        | 112 ---
 harmony-backend/tests/helpers/async.ts             |  27 -
 harmony-backend/tests/metaTagService.test.ts       | 264 +++++++
 harmony-backend/tests/serverMember.test.ts         |  67 +-
 llm-logs/2026-04-20-094302-session-ce430386.md     | 784 +++++++++++++++++++++
 llm-logs/2026-04-20-094337-session-e79268af.md     | 478 -------------
 llm-logs/2026-04-20-100616-session-12bb34ec.md     | 468 ------------
 .../claude-conversation-2026-04-18-b42b9611.md     | 141 ----
 .../claude-conversation-2026-04-20-c779de46.md     | 209 ------
 .../claude-conversation-2026-04-20-cc169300.md     | 255 -------
 tests/integration/attachments.test.ts              |  14 +-
 tests/integration/env.ts                           |  11 -
 25 files changed, 1748 insertions(+), 2078 deletions(-)
```

#### Tool: exec_command

```sh
git diff --unified=80 origin/main..pr-443 -- harmony-backend/src/services/metaTag/metaTagService.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/metaTagService.ts b/harmony-backend/src/services/metaTag/metaTagService.ts
new file mode 100644
index 0000000..f835a91
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagService.ts
@@ -0,0 +1,148 @@
+// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
+import { TitleGenerator } from './titleGenerator';
+import { DescriptionGenerator } from './descriptionGenerator';
+import { OpenGraphGenerator } from './openGraphGenerator';
+import { StructuredDataGenerator } from './structuredDataGenerator';
+import { MetaTagCache } from './metaTagCache';
+import type {
+  MetaTagSet,
+  ChannelContext,
+  MessageContext,
+  MetaTagPreview,
+  MetaTagJobStatus,
+} from './types';
+import { createLogger } from '../../lib/logger';
+
+const logger = createLogger({ component: 'meta-tag-service' });
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+function sanitizeChannelContext(channel: ChannelContext): ChannelContext {
+  return {
+    ...channel,
+    name: TitleGenerator.sanitizeForTitle(channel.name),
+    serverName: TitleGenerator.sanitizeForTitle(channel.serverName),
+  };
+}
+
+function buildFallbackTags(channel: ChannelContext): MetaTagSet {
+  const safe = sanitizeChannelContext(channel);
+  const title = `${safe.name} — ${safe.serverName}`;
+  const description = `Discussions in #${safe.name} on ${safe.serverName}.`;
+  return {
+    title: TitleGenerator.truncateWithEllipsis(title),
+    description: DescriptionGenerator.enforceLength(description),
+    canonical: safe.canonicalUrl,
+    robots: 'index, follow',
+    openGraph: OpenGraphGenerator.generateOGTags(safe, title, description),
+    twitter: OpenGraphGenerator.generateTwitterCard(safe, title, description),
+    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, title, description),
+    keywords: [],
+    needsRegeneration: true,
+  };
+}
+
+export const metaTagService = {
+  /**
+   * Generate meta tags from pre-resolved context (used internally and in unit tests).
+   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
+   */
+  async generateMetaTagsFromContext(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
+    try {
+      const title = TitleGenerator.generateFromThread(messages, channel);
+      const description = DescriptionGenerator.generateFromMessages(messages, channel);
+      const og = OpenGraphGenerator.generateOGTags(channel, title, description);
+      const twitter = OpenGraphGenerator.generateTwitterCard(channel, title, description, og.ogImage);
+      const structuredData = StructuredDataGenerator.generateDiscussionForum(
+        channel,
+        title,
+        description,
+      );
+      const keywords = DescriptionGenerator.extractKeyPhrases(messages);
+
+      return {
+        title,
+        description,
+        canonical: channel.canonicalUrl,
+        robots: 'index, follow',
+        openGraph: og,
+        twitter,
+        structuredData,
+        keywords,
+        needsRegeneration: false,
+      };
+    } catch (err) {
+      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
+      return buildFallbackTags(channel);
+    }
+  },
+
+  /**
+   * Spec-aligned stub: generateMetaTags(channelId, options?).
+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
+   */
+  async generateMetaTags(
+    _channelId: string,
+    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
+  ): Promise<MetaTagSet> {
+    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  /**
+   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
+   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
+   */
+  async getOrGenerateCachedFromContext(
+    channel: ChannelContext,
+    messages: MessageContext[],
+    ttl?: number,
+  ): Promise<MetaTagSet> {
+    const cached = await MetaTagCache.get(channel.id);
+    if (cached) return cached;
+
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    await MetaTagCache.set(channel.id, tags, ttl);
+    return tags;
+  },
+
+  /**
+   * Spec-aligned stub: getOrGenerateCached(channelId).
+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
+   */
+  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
+    throw new Error('getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  async invalidateCache(channelId: string): Promise<void> {
+    await MetaTagCache.invalidate(channelId);
+  },
+
+  // scheduleRegeneration and getRegenerationJobStatus are stubs —
+  // full implementation depends on M4 (worker/queue) from issue #356
+  async scheduleRegeneration(
+    channelId: string,
+    _priority?: 'high' | 'normal' | 'low',
+    _idempotencyKey?: string,
+  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
+    // Queuing logic wired by M4 MetaTagUpdateWorker
+    return {
+      jobId: `meta-tag-regeneration:${channelId}`,
+      status: 'queued',
+    };
+  },
+
+  async getRegenerationJobStatus(
+    _channelId: string,
+    _jobId: string,
+  ): Promise<MetaTagJobStatus | null> {
+    return null;
+  },
+
+  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
+    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
+    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;
+  },
+};
```

#### Tool: exec_command

```sh
git diff --unified=80 origin/main..pr-443 -- harmony-backend/src/services/metaTag/structuredDataGenerator.ts harmony-backend/src/services/metaTag/openGraphGenerator.ts harmony-backend/src/services/metaTag/metaTagCache.ts harmony-backend/src/services/metaTag/types.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/metaTagCache.ts b/harmony-backend/src/services/metaTag/metaTagCache.ts
new file mode 100644
index 0000000..c915c14
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagCache.ts
@@ -0,0 +1,22 @@
+// CL-C2.6 MetaTagCache — Redis-backed cache for generated meta tags (D7.1)
+import { cacheService, CacheKeys } from '../cache.service';
+import type { MetaTagSet } from './types';
+
+const DEFAULT_TTL = 3600; // seconds, per spec D7.1
+
+export const MetaTagCache = {
+  ttl: DEFAULT_TTL,
+
+  async get(channelId: string): Promise<MetaTagSet | null> {
+    const entry = await cacheService.get<MetaTagSet>(CacheKeys.metaChannel(channelId));
+    return entry?.data ?? null;
+  },
+
+  async set(channelId: string, tags: MetaTagSet, ttl?: number): Promise<void> {
+    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl: ttl ?? DEFAULT_TTL });
+  },
+
+  async invalidate(channelId: string): Promise<void> {
+    await cacheService.invalidate(CacheKeys.metaChannel(channelId));
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/openGraphGenerator.ts b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
new file mode 100644
index 0000000..67346a1
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
@@ -0,0 +1,55 @@
+// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
+import type { ChannelContext, OpenGraphTags, TwitterCardTags, MetaTagSet, IMetaTagGenerator } from './types';
+
+const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
+const SITE_NAME = 'Harmony';
+const TWITTER_SITE = '@harmonychat';
+
+export const OpenGraphGenerator: IMetaTagGenerator & {
+  defaultImage: string;
+  generateOGTags(channel: ChannelContext, title: string, description: string): OpenGraphTags;
+  generateTwitterCard(channel: ChannelContext, title: string, description: string, image?: string): TwitterCardTags;
+  selectPreviewImage(channel: ChannelContext): string;
+} = {
+  defaultImage: DEFAULT_IMAGE,
+
+  generateOGTags(channel: ChannelContext, title: string, description: string): OpenGraphTags {
+    return {
+      ogTitle: title,
+      ogDescription: description,
+      ogImage: this.selectPreviewImage(channel),
+      ogType: 'website',
+      ogUrl: channel.canonicalUrl,
+      ogSiteName: SITE_NAME,
+    };
+  },
+
+  generateTwitterCard(
+    channel: ChannelContext,
+    title: string,
+    description: string,
+    image?: string,
+  ): TwitterCardTags {
+    const resolvedImage = image ?? this.selectPreviewImage(channel);
+    const isCustomImage = resolvedImage !== DEFAULT_IMAGE;
+    return {
+      card: isCustomImage ? 'summary_large_image' : 'summary',
+      title,
+      description,
+      image: resolvedImage,
+      site: TWITTER_SITE,
+    };
+  },
+
+  selectPreviewImage(_channel: ChannelContext): string {
+    return DEFAULT_IMAGE;
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('OpenGraphGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('OpenGraphGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
new file mode 100644
index 0000000..4a765ad
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
@@ -0,0 +1,66 @@
+// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
+import type { ChannelContext, StructuredData } from './types';
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+export const StructuredDataGenerator = {
+  generateDiscussionForum(channel: ChannelContext, title: string, description: string): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'DiscussionForumPosting',
+      headline: title,
+      description,
+      // author and datePublished are stub fields — populated by M4 when message data is available
+      author: undefined,
+      datePublished: undefined,
+      dateModified: undefined,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+
+  generateBreadcrumbList(channel: ChannelContext): object {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'BreadcrumbList',
+      itemListElement: [
+        {
+          '@type': 'ListItem',
+          position: 1,
+          name: channel.serverName,
+          item: `${BASE_URL}/s/${channel.serverSlug}`,
+        },
+        {
+          '@type': 'ListItem',
+          position: 2,
+          name: channel.name,
+          item: channel.canonicalUrl,
+        },
+      ],
+    };
+  },
+
+  generateOrganization(): object {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'Organization',
+      name: 'Harmony',
+      url: 'https://harmony.chat',
+    };
+  },
+
+  generateWebPage(channel: ChannelContext, title: string, description: string): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'WebPage',
+      headline: title,
+      description,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/types.ts b/harmony-backend/src/services/metaTag/types.ts
new file mode 100644
index 0000000..c84a649
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/types.ts
@@ -0,0 +1,93 @@
+// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)
+
+export interface OpenGraphTags {
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  ogType: string;
+  ogUrl: string;
+  ogSiteName: string;
+}
+
+export interface TwitterCardTags {
+  card: string;
+  title: string;
+  description: string;
+  image: string;
+  site: string;
+}
+
+export interface StructuredData {
+  '@context': string;
+  '@type': string;
+  headline: string;
+  description: string;
+  author?: object;
+  datePublished?: string;
+  dateModified?: string;
+  mainEntity?: object;
+  breadcrumb?: object;
+}
+
+export interface MetaTagSet {
+  title: string;
+  description: string;
+  canonical: string;
+  robots: string;
+  openGraph: OpenGraphTags;
+  twitter: TwitterCardTags;
+  structuredData: StructuredData;
+  keywords: string[];
+  needsRegeneration?: boolean;
+}
+
+export interface ContentAnalysis {
+  keywords: string[];
+  topics: string[];
+  summary: string;
+  sentiment: string;
+  readingLevel: string;
+}
+
+export interface IMetaTagGenerator {
+  generate(): MetaTagSet;
+  validate(): boolean;
+}
+
+export interface MetaTagPreview {
+  title: string;
+  description: string;
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  keywords: string[];
+  generatedAt: string;
+  isCustom: boolean;
+  searchPreview: { title: string; description: string; url: string };
+  socialPreview: { title: string; description: string; image: string };
+}
+
+export interface MetaTagJobStatus {
+  jobId: string;
+  channelId: string;
+  status: 'queued' | 'processing' | 'succeeded' | 'failed';
+  attempts: number;
+  startedAt: string | null;
+  completedAt: string | null;
+}
+
+export interface ChannelContext {
+  id: string;
+  name: string;
+  slug: string;
+  topic?: string | null;
+  serverName: string;
+  serverSlug: string;
+  canonicalUrl: string;
+}
+
+export interface MessageContext {
+  content: string;
+  createdAt: Date;
+  authorDisplayName?: string;
+}
```

#### Tool: exec_command

```sh
git diff --unified=80 origin/main..pr-443 -- harmony-backend/src/services/metaTag/titleGenerator.ts harmony-backend/src/services/metaTag/descriptionGenerator.ts harmony-backend/tests/metaTagService.test.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/descriptionGenerator.ts b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
new file mode 100644
index 0000000..31f1ed9
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
@@ -0,0 +1,98 @@
+// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
+import type { MessageContext, ChannelContext, MetaTagSet, IMetaTagGenerator } from './types';
+
+const MAX_LENGTH = 160;
+const MIN_LENGTH = 50;
+
+export const DescriptionGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  minLength: number;
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string;
+  extractKeyPhrases(messages: MessageContext[]): string[];
+  sanitizeText(text: string): string;
+  summarizeThread(messages: MessageContext[], channel: ChannelContext): string;
+  enforceLength(text: string): string;
+} = {
+  maxLength: MAX_LENGTH,
+  minLength: MIN_LENGTH,
+
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
+    const summary = this.summarizeThread(messages, channel);
+    return this.enforceLength(summary);
+  },
+
+  extractKeyPhrases(messages: MessageContext[]): string[] {
+    const combined = messages.map((m) => m.content).join(' ');
+    const words = combined
+      .toLowerCase()
+      .replace(/<[^>]*>/g, '')
+      .replace(/[^a-z0-9\s]/g, ' ')
+      .split(/\s+/)
+      .filter((w) => w.length > 3);
+
+    const freq = new Map<string, number>();
+    for (const word of words) {
+      freq.set(word, (freq.get(word) ?? 0) + 1);
+    }
+
+    return [...freq.entries()]
+      .sort((a, b) => b[1] - a[1])
+      .slice(0, 5)
+      .map(([word]) => word);
+  },
+
+  sanitizeText(text: string): string {
+    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
+  },
+
+  summarizeThread(messages: MessageContext[], channel: ChannelContext): string {
+    const serverName = this.sanitizeText(channel.serverName);
+    const channelName = this.sanitizeText(channel.name);
+    const suffix = ` — Join the discussion on ${serverName}.`;
+
+    if (messages.length === 0) {
+      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;
+      return this.enforceLength(base);
+    }
+
+    const first = this.sanitizeText(messages[0].content);
+    const prefix = `${serverName} › #${channelName}: `;
+    let text = prefix + first;
+
+    if (text.length < MIN_LENGTH) {
+      text = text + suffix;
+    }
+
+    return this.enforceLength(text);
+  },
+
+  enforceLength(text: string): string {
+    let result = text;
+
+    if (result.length < MIN_LENGTH) {
+      const additions = [
+        ' Join the discussion.',
+        ' Explore the latest updates.',
+        ' Connect with the community.',
+      ];
+      let i = 0;
+      while (result.length < MIN_LENGTH) {
+        result += additions[i % additions.length];
+        i++;
+      }
+    }
+
+    if (result.length > MAX_LENGTH) {
+      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+    }
+    return result;
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('DescriptionGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('DescriptionGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/titleGenerator.ts b/harmony-backend/src/services/metaTag/titleGenerator.ts
new file mode 100644
index 0000000..0365b11
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/titleGenerator.ts
@@ -0,0 +1,65 @@
+// CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
+import type { ChannelContext, MessageContext, MetaTagSet, IMetaTagGenerator } from './types';
+
+const MAX_LENGTH = 60;
+
+const CHANNEL_TEMPLATE = '{channelName} — {serverName}';
+
+export const TitleGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  generateFromChannel(channel: ChannelContext): string;
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string;
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string;
+  truncateWithEllipsis(text: string): string;
+  sanitizeForTitle(text: string): string;
+  applyTemplate(template: string, vars: Record<string, string>): string;
+} = {
+  maxLength: MAX_LENGTH,
+
+  generateFromChannel(channel: ChannelContext): string {
+    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(
+      '{serverName}',
+      channel.serverName,
+    );
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string {
+    const raw = `${message.content} — ${channel.serverName}`;
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string {
+    if (messages.length === 0) {
+      return this.generateFromChannel(channel);
+    }
+    return this.generateFromMessage(messages[0], channel);
+  },
+
+  truncateWithEllipsis(text: string): string {
+    if (text.length <= MAX_LENGTH) return text;
+    return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+  },
+
+  sanitizeForTitle(text: string): string {
+    return text
+      .replace(/<[^>]*>/g, '')
+      .replace(/\s+/g, ' ')
+      .trim();
+  },
+
+  applyTemplate(template: string, vars: Record<string, string>): string {
+    return Object.entries(vars).reduce(
+      (result, [key, value]) => result.replaceAll(`{${key}}`, value),
+      template,
+    );
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('TitleGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('TitleGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/tests/metaTagService.test.ts b/harmony-backend/tests/metaTagService.test.ts
new file mode 100644
index 0000000..13d05af
--- /dev/null
+++ b/harmony-backend/tests/metaTagService.test.ts
@@ -0,0 +1,264 @@
+/**
+ * Unit tests for M2 Meta Tag Generation Service skeleton — Issue #350
+ *
+ * Covers AC-2 (length limits), sanitization, template application,
+ * and AC-9 (fallback on failure, needsRegeneration=true).
+ *
+ * MetaTagCache uses Redis via cacheService — mocked here for unit speed.
+ */
+
+jest.mock('../src/services/cache.service', () => ({
+  cacheService: {
+    get: jest.fn(),
+    set: jest.fn(),
+    invalidate: jest.fn(),
+    getOrRevalidate: jest.fn(),
+  },
+  CacheKeys: {
+    metaChannel: (id: string) => `meta:channel:${id}`,
+    channelVisibility: (id: string) => `channel:${id}:visibility`,
+    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
+    serverInfo: (id: string) => `server:${id}:info`,
+    analysisChannel: (id: string) => `analysis:channel:${id}`,
+  },
+  sanitizeKeySegment: (s: string) => s.replace(/[*?\[\]]/g, ''),
+}));
+
+import { TitleGenerator } from '../src/services/metaTag/titleGenerator';
+import { DescriptionGenerator } from '../src/services/metaTag/descriptionGenerator';
+import { MetaTagCache } from '../src/services/metaTag/metaTagCache';
+import { metaTagService } from '../src/services/metaTag/metaTagService';
+import { cacheService } from '../src/services/cache.service';
+import type { ChannelContext, MessageContext } from '../src/services/metaTag/types';
+
+const mockCacheService = cacheService as jest.Mocked<typeof cacheService>;
+
+const channel: ChannelContext = {
+  id: 'chan-001',
+  name: 'unity-physics-help',
+  slug: 'unity-physics-help',
+  topic: 'Ask about Unity physics',
+  serverName: 'Game Dev Hub',
+  serverSlug: 'game-dev-hub',
+  canonicalUrl: 'https://harmony.chat/c/game-dev-hub/unity-physics-help',
+};
+
+const messages: MessageContext[] = [
+  { content: 'How do I handle collision detection in Unity?', createdAt: new Date() },
+  { content: 'Use OnCollisionEnter for physics-based collisions.', createdAt: new Date() },
+];
+
+beforeEach(() => {
+  jest.clearAllMocks();
+});
+
+// ─── TitleGenerator ──────────────────────────────────────────────────────────
+
+describe('TitleGenerator', () => {
+  it('maxLength is 60', () => {
+    expect(TitleGenerator.maxLength).toBe(60);
+  });
+
+  it('generateFromChannel produces title ≤60 chars', () => {
+    const title = TitleGenerator.generateFromChannel(channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+  });
+
+  it('truncates long titles with ellipsis and stays ≤60 chars', () => {
+    const longChannel: ChannelContext = {
+      ...channel,
+      name: 'this-is-a-very-long-channel-name-that-exceeds-limits',
+      serverName: 'An Extremely Long Server Name That Will Overflow',
+    };
+    const title = TitleGenerator.generateFromChannel(longChannel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title.endsWith('…')).toBe(true);
+  });
+
+  it('sanitizeForTitle strips HTML tags', () => {
+    const result = TitleGenerator.sanitizeForTitle('<b>Hello</b> <em>world</em>');
+    expect(result).toBe('Hello world');
+  });
+
+  it('sanitizeForTitle collapses whitespace', () => {
+    const result = TitleGenerator.sanitizeForTitle('foo   bar\n  baz');
+    expect(result).toBe('foo bar baz');
+  });
+
+  it('applyTemplate replaces template variables', () => {
+    const result = TitleGenerator.applyTemplate('{channelName} on {serverName}', {
+      channelName: 'general',
+      serverName: 'My Server',
+    });
+    expect(result).toBe('general on My Server');
+  });
+
+  it('generateFromThread falls back to channel when no messages', () => {
+    const title = TitleGenerator.generateFromThread([], channel);
+    expect(title).toBe(TitleGenerator.generateFromChannel(channel));
+  });
+
+  it('generateFromMessage uses first message content', () => {
+    const title = TitleGenerator.generateFromMessage(messages[0], channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title).toContain('Game Dev Hub');
+  });
+});
+
+// ─── DescriptionGenerator ───────────────────────────────────────────────────
+
+describe('DescriptionGenerator', () => {
+  it('maxLength is 160', () => {
+    expect(DescriptionGenerator.maxLength).toBe(160);
+  });
+
+  it('minLength is 50', () => {
+    expect(DescriptionGenerator.minLength).toBe(50);
+  });
+
+  it('generateFromMessages produces description 50-160 chars', () => {
+    const desc = DescriptionGenerator.generateFromMessages(messages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('truncates long descriptions to ≤160 chars with ellipsis', () => {
+    const longMessages: MessageContext[] = [
+      {
+        content: 'A'.repeat(200),
+        createdAt: new Date(),
+      },
+    ];
+    const desc = DescriptionGenerator.generateFromMessages(longMessages, channel);
+    expect(desc.length).toBeLessThanOrEqual(160);
+    expect(desc.endsWith('…')).toBe(true);
+  });
+
+  it('returns text unchanged when within valid range', () => {
+    const valid = 'A'.repeat(80);
+    expect(DescriptionGenerator.enforceLength(valid)).toBe(valid);
+  });
+
+  it('AC-2: generateFromMessages produces ≥50 chars even for a very short message', () => {
+    const shortMessages: MessageContext[] = [{ content: 'hi', createdAt: new Date() }];
+    const desc = DescriptionGenerator.generateFromMessages(shortMessages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('extractKeyPhrases returns non-empty array for non-empty messages', () => {
+    const phrases = DescriptionGenerator.extractKeyPhrases(messages);
+    expect(Array.isArray(phrases)).toBe(true);
+    expect(phrases.length).toBeGreaterThan(0);
+  });
+
+  it('summarizeThread falls back to channel description when no messages', () => {
+    const summary = DescriptionGenerator.summarizeThread([], channel);
+    expect(summary).toContain(channel.name);
+    expect(summary.length).toBeGreaterThanOrEqual(50);
+    expect(summary.length).toBeLessThanOrEqual(160);
+  });
+});
+
+// ─── MetaTagCache ────────────────────────────────────────────────────────────
+
+describe('MetaTagCache', () => {
+  it('ttl defaults to 3600', () => {
+    expect(MetaTagCache.ttl).toBe(3600);
+  });
+
+  it('get returns null on cache miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toBeNull();
+    expect(mockCacheService.get).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('get returns cached data on hit', async () => {
+    const fakeSet = { title: 'Cached Title' } as never;
+    mockCacheService.get.mockResolvedValue({ data: fakeSet, createdAt: Date.now() });
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toEqual(fakeSet);
+  });
+
+  it('set calls cacheService.set with correct key and ttl', async () => {
+    mockCacheService.set.mockResolvedValue(undefined);
+    const tags = { title: 'T' } as never;
+    await MetaTagCache.set('chan-001', tags, 1800);
+    expect(mockCacheService.set).toHaveBeenCalledWith(
+      'meta:channel:chan-001',
+      tags,
+      { ttl: 1800 },
+    );
+  });
+
+  it('invalidate calls cacheService.invalidate with correct key', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await MetaTagCache.invalidate('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+});
+
+// ─── MetaTagService ──────────────────────────────────────────────────────────
+
+describe('metaTagService', () => {
+  it('generateMetaTagsFromContext returns valid MetaTagSet', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(tags.title.length).toBeLessThanOrEqual(60);
+    expect(tags.description.length).toBeGreaterThanOrEqual(50);
+    expect(tags.description.length).toBeLessThanOrEqual(160);
+    expect(tags.canonical).toBe(channel.canonicalUrl);
+    expect(tags.needsRegeneration).toBe(false);
+  });
+
+  it('generateMetaTagsFromContext sets robots to index, follow', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.robots).toBe('index, follow');
+  });
+
+  it('generateMetaTagsFromContext includes openGraph and twitter tags', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.openGraph.ogTitle).toBeDefined();
+    expect(tags.twitter.card).toBeDefined();
+  });
+
+  it('AC-9: returns fallback with needsRegeneration=true on generation error', async () => {
+    const spy = jest
+      .spyOn(TitleGenerator, 'generateFromThread')
+      .mockImplementation(() => { throw new Error('NLP timeout'); });
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    spy.mockRestore();
+    expect(tags.needsRegeneration).toBe(true);
+    expect(tags.title.length).toBeGreaterThan(0);
+  });
+
+  it('getOrGenerateCachedFromContext returns cache hit without regenerating', async () => {
+    const cachedTags = { title: 'Cached', needsRegeneration: false } as never;
+    mockCacheService.get.mockResolvedValue({ data: cachedTags, createdAt: Date.now() });
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    expect(tags).toEqual(cachedTags);
+    expect(mockCacheService.set).not.toHaveBeenCalled();
+  });
+
+  it('getOrGenerateCachedFromContext generates and caches on miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    mockCacheService.set.mockResolvedValue(undefined);
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(mockCacheService.set).toHaveBeenCalled();
+  });
+
+  it('invalidateCache delegates to MetaTagCache.invalidate', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await metaTagService.invalidateCache('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('buildCanonicalUrl constructs correct path', () => {
+    const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
+    expect(url).toContain('/c/game-dev-hub/unity-physics-help');
+  });
+});
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:28:52.357Z

The branch isn’t cleanly scoped to just the meta-tag service. I’m checking the full `main..HEAD` range now, because the PR currently carries unrelated backend, test, docs, workflow, and log-file changes that also need review coverage.

#### Tool: exec_command

```sh
git log --oneline --decorate --no-merges origin/main..pr-443
```

Output:

```text
85d862f (pr-443) fix: address PR #443 review findings (this-binding, IMetaTagGenerator stubs, scheduleRegeneration return)
177c384 (origin/feature/issue-350-meta-tag-service-skeleton) fix: address PR #443 review findings for M2 meta tag service skeleton
94fa035 chore: add llm logs
898f943 fix(seo): enforce 50-char minimum on auto-generated descriptions (AC-2)
e8875f5 feat(seo): implement M2 meta tag generation service skeleton (issue #350)
```

#### Tool: exec_command

```sh
git diff --name-only origin/main..pr-443
```

Output:

```text
.github/workflows/run-frontend-e2e.yml
docs/deployment/replica-readiness-audit.md
harmony-backend/src/events/eventBus.ts
harmony-backend/src/routes/events.router.ts
harmony-backend/src/services/metaTag/descriptionGenerator.ts
harmony-backend/src/services/metaTag/metaTagCache.ts
harmony-backend/src/services/metaTag/metaTagService.ts
harmony-backend/src/services/metaTag/openGraphGenerator.ts
harmony-backend/src/services/metaTag/structuredDataGenerator.ts
harmony-backend/src/services/metaTag/titleGenerator.ts
harmony-backend/src/services/metaTag/types.ts
harmony-backend/src/services/serverMember.service.ts
harmony-backend/tests/events.router.server.test.ts
harmony-backend/tests/events.router.test.ts
harmony-backend/tests/helpers/async.ts
harmony-backend/tests/metaTagService.test.ts
harmony-backend/tests/serverMember.test.ts
llm-logs/2026-04-20-094302-session-ce430386.md
llm-logs/2026-04-20-094337-session-e79268af.md
llm-logs/2026-04-20-100616-session-12bb34ec.md
llm-logs/declanblanc/claude-conversation-2026-04-18-b42b9611.md
llm-logs/declanblanc/claude-conversation-2026-04-20-c779de46.md
llm-logs/declanblanc/claude-conversation-2026-04-20-cc169300.md
tests/integration/attachments.test.ts
tests/integration/env.ts
```

#### Tool: exec_command

```sh
git diff --unified=40 origin/main..pr-443 -- harmony-backend/src/routes/events.router.ts harmony-backend/tests/events.router.server.test.ts harmony-backend/tests/events.router.test.ts harmony-backend/src/events/eventBus.ts harmony-backend/src/services/serverMember.service.ts harmony-backend/tests/serverMember.test.ts
```

Output:

```text
Total output lines: 1719

diff --git a/harmony-backend/src/events/eventBus.ts b/harmony-backend/src/events/eventBus.ts
index 22b8651..aad763c 100644
--- a/harmony-backend/src/events/eventBus.ts
+++ b/harmony-backend/src/events/eventBus.ts
@@ -10,84 +10,80 @@
  *   application after DB lookup — they never contain raw user input.
  */
 
 import Redis from 'ioredis';
 import { redis } from '../db/redis';
 import { createLogger } from '../lib/logger';
 import { EventChannelName, EventPayloadMap, EventHandler, EventChannels } from './eventTypes';
 
 export { EventChannels, EventChannelName, EventPayloadMap, EventHandler };
 export type {
   VisibilityChangedPayload,
   MessageCreatedPayload,
   MessageEditedPayload,
   MessageDeletedPayload,
   MetaTagsUpdatedPayload,
   ServerUpdatedPayload,
   ReactionAddedPayload,
   ReactionRemovedPayload,
 } from './eventTypes';
 
 let subscriberClient: Redis | null = null;
 const logger = createLogger({ component: 'event-bus' });
 
 // Central handler registry — maps each Redis channel to its active JS handlers.
 // A single 'message' listener on the ioredis client dispatches to these sets,
 // avoiding per-subscription client.on() calls that accumulate and trigger
 // MaxListenersExceededWarning under concurrent SSE connections.
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const channelHandlers = new Map<string, Set<(payload: any) => void>>();
 
 // Per-channel ready promise — resolves when Redis confirms the subscription.
 // All subscribers on the same channel share this promise so latecomers don't
 // get a false-immediate-ready before the handshake completes.
 const channelReadyPromises = new Map<string, Promise<void>>();
 
 function getSubscriberClient(): Redis {
   if (!subscriberClient) {
     subscriberClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
       maxRetriesPerRequest: null, // subscriber clients must not timeout on blocked commands
       lazyConnect: true,
-      // Subscriber connections cannot issue INFO; skipping the ready check prevents
-      // ioredis from calling INFO on reconnect which would throw an unhandled error
-      // and crash the backend process.
-      enableReadyCheck: false,
     });
 
     // Single dispatcher — routes all incoming Redis messages to registered JS handlers.
     // This replaces per-subscription client.on('message', ...) calls, keeping the
     // ioredis emitter's listener count at 1 regardless of how many SSE connections exist.
     subscriberClient.on('message', (ch: string, rawMessage: string) => {
       const handlers = channelHandlers.get(ch);
       if (!handlers) return;
       let payload: unknown;
       try {
         payload = JSON.parse(rawMessage);
       } catch (err) {
         logger.error({ err, channel: ch }, 'Failed to parse event payload');
         return;
       }
       for (const handler of handlers) {
         try {
           handler(payload);
         } catch (err) {
           logger.error({ err, channel: ch }, 'Event handler threw synchronously');
         }
       }
     });
   }
   return subscriberClient;
 }
 
 export const eventBus = {
   /**
    * Publish a typed event. Fire-and-forget: errors are logged, not thrown,
    * so a Redis hiccup never blocks the calling service transaction.
    */
   async publish<C extends EventChannelName>(
     channel: C,
     payload: EventPayloadMap[C],
   ): Promise<void> {
     try {
       await redis.publish(channel, JSON.stringify(payload));
     } catch (err) {
       logger.warn({ err, channel }, 'Failed to publish event');
diff --git a/harmony-backend/src/routes/events.router.ts b/harmony-backend/src/routes/events.router.ts
index 0be88d2..0cb3fe7 100644
--- a/harmony-backend/src/routes/events.router.ts
+++ b/harmony-backend/src/routes/events.router.ts
@@ -25,631 +25,594 @@ import type {
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
 
-type EventSubscription = { unsubscribe: () => void; ready: Promise<void> };
-
-type BufferedSseState = {
-  closed: boolean;
-  ready: boolean;
-  pendingFrames: string[];
-  heartbeat: ReturnType<typeof setInterval> | null;
-};
-
-function formatEvent(eventType: string, data: unknown): string {
-  return `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
-}
-
-function createBufferedSseState(): BufferedSseState {
-  return {
-    closed: false,
-    ready: false,
-    pendingFrames: [],
-    heartbeat: null,
-  };
-}
-
-function cleanupSseConnection(state: BufferedSseState, subscriptions: EventSubscription[]): void {
-  if (state.closed) return;
-  state.closed = true;
-  if (state.heartbeat) {
-    clearInterval(state.heartbeat);
-    state.heartbeat = null;
-  }
-  state.pendingFrames.length = 0;
-  for (const subscription of subscriptions) {
-    subscription.unsubscribe();
-  }
-}
-
-function createBufferedEventWriter(
-  res: Response,
-  state: BufferedSseState,
-): (eventType: string, data: unknown) => void {
-  return (eventType: string, data: unknown) => {
-    if (state.closed) return;
-    const frame = formatEvent(eventType, data);
-    if (!state.ready) {
-      state.pendingFrames.push(frame);
-      return;
-    }
-    res.write(frame);
-  };
-}
-
-async function finalizeSseSetup(
-  req: Request,
-  res: Response,
-  state: BufferedSseState,
-  subscriptions: EventSubscription[],
-  logContext: Record<string, string>,
-): Promise<boolean> {
-  const cleanup = () => cleanupSseConnection(state, subscriptions);
-  req.on('close', cleanup);
-
-  try {
-    await Promise.all(subscriptions.map((subscription) => subscription.ready));
-  } catch (err) {
-    cleanup();
-    logger.error({ err, ...logContext }, 'Failed to establish SSE subscriptions');
-    if (!res.headersSent) {
-      res.status(503).json({ error: 'Failed to establish event stream' });
-    }
-    return false;
-  }
-
-  if (state.closed) {
-    return false;
-  }
-
-  res.setHeader('Content-Type', 'text/event-stream');
-  res.setHeader('Cache-Control', 'no-cache');
-  res.setHeader('Connection', 'keep-alive');
-  res.setHeader('X-Accel-Buffering', 'no');
-  res.flushHeaders();
-
-  state.ready = true;
-  for (const frame of state.pendingFrames.splice(0)) {
-    res.write(frame);
-  }
-
-  state.heartbeat = setInterval(() => {
-    if (state.closed) return;
-    res.write(':\n\n');
-  }, 30_000);
-
-  return true;
+function sendEvent(res: Response, eventType: string, data: unknown): void {
+  res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
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
 
-  const sseState = createBufferedSseState();
-  const writeEvent = createBufferedEventWriter(res, sseState);
+  // ── SSE headers ──────────────────────────────────────────────────────────
+  res.setHeader('Content-Type', 'text/event-stream');
+  res.setHeader('Cache-Control', 'no-cache');
+  res.setHeader('Connection', 'keep-alive');
+  res.setHeader('X-Accel-Buffering', 'no');
+  res.flushHeaders();
 
   // ── Subscribe to message events ──────────────────────────────────────────
 
-  const createdSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubCreated } = eventBus.subscribe(
     EventChannels.MESSAGE_CREATED,
     async (payload: MessageCreatedPayload) => {
       if (payload.channelId !== channelId) return;
 
       try {
         const message = await prisma.message.findUnique({
           where: { id: payload.messageId },
           include: MESSAGE_SSE_INCLUDE,
         });
         if (!message || message.isDeleted) return;
 
-        writeEvent('message:created', {
+        sendEvent(res, 'message:created', {
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
 
-  const editedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubEdited } = eventBus.subscribe(
     EventChannels.MESSAGE_EDITED,
     async (payload: MessageEditedPayload) => {
       if (payload.channelId !== channelId) return;
 
       try {
         const message = await prisma.message.findUnique({
           where: { id: payload.messageId },
           include: MESSAGE_SSE_INCLUDE,
         });
         if (!message || message.isDeleted) return;
 
-        writeEvent('message:edited', {
+        sendEvent(res, 'message:edited', {
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
 
-  const deletedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubDeleted } = eventBus.subscribe(
     EventChannels.MESSAGE_DELETED,
     (payload: MessageDeletedPayload) => {
       if (payload.channelId !== channelId) return;
-      writeEvent('message:deleted', {
+      // Include channelId so the payload shape is consistent with the server endpoint.
+      sendEvent(res, 'message:deleted', {
         messageId: payload.messageId,
         channelId: payload.channelId,
       });
     },
   );
 
-  const serverUpdatedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubServerUpdated } = eventBus.subscribe(
     EventChannels.SERVER_UPDATED,
     (payload: ServerUpdatedPayload) => {
       if (payload.serverId !== channel.serverId) return;
-      writeEvent('server:updated', {
+      sendEvent(res, 'server:updated', {
         id: payload.serverId,
         name: payload.name,
+        // Use 'icon' to match the frontend Server type (Server.icon, not iconUrl)
         icon: payload.iconUrl ?? undefined,
         description: payload.description,
         updatedAt: payload.timestamp,
       });
     },
   );
 
-  const channelSubscriptions = [
-    createdSubscription,
-    editedSubscription,
-    deletedSubscription,
-    serverUpdatedSubscription,
-  ];
-
-  await finalizeSseSetup(req, res, sseState, channelSubscriptions, {
-    route: 'channel-events',
-    channelId,
-    serverId: channel.serverId,
+  // ── Heartbeat — keeps the connection alive through proxies ───────────────
+  const heartbeat = setInterval(() => {
+    res.write(':\n\n');
+  }, 30_000);
+
+  // ── Cleanup on client disconnect ─────────────────────────────────────────
+  req.on('close', () => {
+    clearInterval(heartbeat);
+    unsubCreated();
+    unsubEdited();
+    unsubDeleted();
+    unsubServerUpdated();
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
- * Streams real-time server events to authenticated, authorised clients using
- * Server-Sent Events. Scoped to a server so all members see the same sidebar,
- * member, message, and server updates regardless of which channel they are viewing.
+ * Streams real-time channel events (created, updated, deleted) to authenticated,
+ * authorised clients using Server-Sent Events. Scoped to a server so all members
+ * see the same sidebar updates regardless of which channel they're currently viewing.
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
 
-  const sseState = createBufferedSseState();
-  const writeEvent = createBufferedEventWriter(res, sseState);
+  // ── Initialize channel ID set — registered before findMany so any CHANNEL_CREATED
+  //    events that fire during the preload query are captured by the handler below.
+  //    Message events carry channelId but not serverId; this set is the filter.
   const serverChannelIds = new Set<string>();
-  const subscriptions: EventSubscription[] = [];
-  let cleanedUp = false;
 
+  // ── Idempotent cleanup — registered before any subscription so that a client
+  //    disconnect or preload failure during setup always releases all handlers.
+  const cleanupFns: Array<() => void> = [];
+  let cleanedUp = false;
   const cleanup = () => {
     if (cleanedUp) return;
     cleanedUp = true;
-    cleanupSseConnection(sseState, subscriptions);
+    for (const fn of cleanupFns) fn();
   };
   req.on('close', cleanup);
 
-  // Register create/delete subscriptions before the preload query so channel-ID
-  // tracking stays correct if channels change while the initial lookup is in flight.
-  const channelCreatedSubscription = eventBus.subscribe(
+  // ── Subscribe CHANNEL_CREATED / CHANNEL_DELETED before findMany ───────────
+  // Registering these two handlers before the preload query closes the race window:
+  // if a channel is created (or deleted) while findMany is awaiting, the handler
+  // mutates serverChannelIds synchronously so subsequent message events for that
+  // channel are correctly forwarded (or suppressed). Handlers skip res.write()
+  // until headers are flushed, using res.headersSent as the gate.
+  // Teardown is registered (above) before these subscriptions so a disconnect or
+  // preload failure during setup always releases them.
+  const { unsubscribe: unsubChannelCreated } = eventBus.subscribe(
     EventChannels.CHANNEL_CREATED,
     async (payload: ChannelCreatedPayload) => {
       if (payload.serverId !== serverId) return;
       serverChannelIds.add(payload.channelId);
-
+      if (!res.headersSent) return; // headers not flushed yet — skip SSE write
       try {
         const channel = await prisma.channel.findUnique({
           where: { id: payload.channelId },
           select: CHANNEL_SSE_SELECT,
         });
         if (!channel) return;
-
-        writeEvent('channel:created', channel);
+        sendEvent(res, 'channel:created', channel);
       } catch (err) {
         logger.warn(
           { err, serverId, channelId: payload.channelId },
           'Failed to hydrate SSE channel:created payload',
         );
       }
     },
   );
-  subscriptions.push(channelCreatedSubscription);
+  cleanupFns.push(unsubChannelCreated);
 
-  const channelDeletedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubChannelDeleted } = eventBus.subscribe(
     EventChannels.CHANNEL_DELETED,
     (payload: ChannelDeletedPayload) => {
       if (payload.serverId !== serverId) return;
       serverChannelIds.delete(payload.channelId);
-      writeEvent('channel:deleted', { channelId: payload.channelId });
+      if (!res.headersSent) return;
+      sendEvent(res, 'channel:deleted', { channelId: payload.channelId });
     },
   );
-  subscriptions.push(channelDeletedSubscription);
+  cleanupFns.push(unsubChannelDeleted);
 
+  // ── Preload existing channel IDs — handlers above capture creations/deletions
+  //    that race with this await.
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
-  for (const currentChannel of serverChannels) {
-    serverChannelIds.add(currentChannel.id);
-  }
+  for (const c of serverChannels) serverChannelIds.add(c.id);
 
+  // Guard: if the client disconnected while findMany was in flight, cleanup()
+  // has already fired (cleanedUp === true) and the early subscriptions are
+  // released. Stop here so no further handlers are registered under a dead conn.
   if (cleanedUp) return;
 
-  const messageCreatedSubscription = eventBus.subscribe(
+  // ── SSE headers ──────────────────────────────────────────────────────────
+  res.setHeader('Content-Type', 'text/event-stream');
+  res.setHeader('Cache-Control', 'no-cache');
+  res.setHeader('Connection', 'keep-alive');
+  res.setHeader('X-Accel-Buffering', 'no');
+  res.flushHeaders();
+
+  // ── Subscribe to message events ──────────────────────────────────────────
+
+  const { unsubscribe: unsubMessageCreated } = eventBus.subscribe(
     EventChannels.MESSAGE_CREATED,
     async (payload: MessageCreatedPayload) => {
       if (!serverChannelIds.has(payload.channelId)) return;
 
       try {
         const message = await prisma.message.findUnique({
           where: { id: payload.messageId },
           include: MESSAGE_SSE_INCLUDE,
         });
         if (!message || message.isDeleted) return;
 
-        writeEvent('message:created', {
+        sendEvent(res, 'message:created', {
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
           'Failed to hydrate SSE message:created payload on server endpoint',
         );
       }
     },
   );
-  subscriptions.push(messageCreatedSubscription);
+  cleanupFns.push(unsubMessageCreated);
 
-  const messageEditedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubMessageEdited } = eventBus.subscribe(
     EventChannels.MESSAGE_EDITED,
     async (payload: MessageEditedPayload) => {
       if (!serverChannelIds.has(payload.channelId)) return;
 
       try {
         const message = await prisma.message.findUnique({
           where: { id: payload.messageId },
           include: MESSAGE_SSE_INCLUDE,
         });
         if (!message || message.isDeleted) return;
 
-        writeEvent('message:edited', {
+        sendEvent(res, 'message:edited', {
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
-  subscriptions.push(messageEditedSubscription);
+  cleanupFns.push(unsubMessageEdited);
 
-  const messageDeletedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubMessageDeleted } = eventBus.subscribe(
     EventChannels.MESSAGE_DELETED,
     (payload: MessageDeletedPayload) => {
       if (!serverChannelIds.has(payload.channelId)) return;
-      writeEvent('message:deleted', {
+      sendEvent(res, 'message:deleted', {
         messageId: payload.messageId,
         channelId: payload.channelId,
       });
     },
   );
-  subscriptions.push(messageDeletedSubscription);
+  cleanupFns.push(unsubMessageDeleted);
 
-  const serverUpdatedSubscription = eventBus.subscribe(
+  // ── Subscribe to server:updated events ───────────────────────────────────
+
+  const { unsubscribe: unsubServerUpdated } = eventBus.subscribe(
     EventChannels.SERVER_UPDATED,
     (payload: ServerUpdatedPayload) => {
       if (payload.serverId !== serverId) return;
-      writeEvent('server:updated', {
+      sendEvent(res, 'server:updated', {
         id: payload.serverId,
         name: payload.name,
+        // Use 'icon' to match the frontend Server type (Server.icon, not iconUrl)
         icon: payload.iconUrl ?? undefined,
         description: payload.description,
         updatedAt: payload.timestamp,
       });
     },
   );
-  subscriptions.push(serverUpdatedSubscription);
+  cleanupFns.push(unsubServerUpdated);
+
+  // ── Subscribe to remaining channel events ────────────────────────────────
 
-  const channelUpdatedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubChannelUpdated } = eventBus.subscribe(
     EventChannels.CHANNEL_UPDATED,
     async (payload: ChannelUpdatedPayload) => {
       if (payload.serverId !== serverId) return;
 
       try {
         const channel = await prisma.channel.findUnique({
           where: { id: payload.channelId },
           select: CHANNEL_SSE_SELECT,
         });
         if (!channel) return;
 
-        writeEvent('channel:updated', channel);
+        sendEvent(res, 'channel:updated', channel);
       } catch (err) {
         logger.warn(
           { err, serverId, channelId: payload.channelId },
           'Failed to hydrate SSE channel:updated payload',
         );
       }
     },
   );
-  subscriptions.push(channelUpdatedSubscription);
+  cleanupFns.push(unsubChannelUpdated);
 
+  // ── Subscribe to member status change events ──────────────────────────────
   // Status reflects presence (ONLINE/IDLE/OFFLINE) not identity, so it is emitted
   // regardless of the user's publicProfile setting — consistent with the rationale
   // documented in PR #202 for member join/leave events.
-  const statusChangedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubStatusChanged } = eventBus.subscribe(
     EventChannels.USER_STATUS_CHANGED,
     (payload: UserStatusChangedPayload) => {
       if (payload.serverId !== serverId) return;
-      writeEvent('member:statusChanged', {
+      // Normalize Prisma enum ('IDLE') to the lowercase format the frontend expects ('idle').
+      sendEvent(res, 'member:statusChanged', {
         id: payload.userId,
         status: payload.status.toLowerCase(),
       });
     },
   );
-  subscriptions.push(statusChangedSubscription);
+  cleanupFns.push(unsubStatusChanged);
 
-  const memberJoinedSubscription = eventBus.subscribe(
+  // ── Subscribe to member join/leave events ─────────────────────────────────
+  // When a member joins, look up their profile and push the full user object so
+  // clients can add the new member to the sidebar without a page reload.
+
+  const { unsubscribe: unsubMemberJoined } = eventBus.subscribe(
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
 
+        // Respect the publicProfile privacy flag — consistent with userService.getUser().
+        // Users who have opted out of public profile display appear as Anonymous with no avatar.
+        // status reflects server presence (ONLINE/IDLE/OFFLINE), not identity — intentionally
+        // emitted even for private-profile users since it reveals no personally identifying information.
         const isPublic = user.publicProfile;
-        writeEvent('member:joined', {
+        sendEvent(res, 'member:joined', {
           id: user.id,
           username: isPublic ? user.username : 'Anonymous',
           displayName: isPublic ? user.displayName : undefined,
           avatar: isPublic ? (user.avatarUrl ?? undefined) : undefined,
+          // Cast backend RoleTypeValue (e.g. 'MEMBER') to frontend UserRole (e.g. 'member')
           role: payload.role.toLowerCase(),
+          // Cast DB UserStatus (e.g. 'ONLINE') to frontend UserStatus (e.g. 'online')
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
-  subscriptions.push(memberJoinedSubscription);
+  cleanupFns.push(unsubMemberJoined);
 
-  const memberLeftSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubMemberLeft } = eventBus.subscribe(
     EventChannels.MEMBER_LEFT,
     (payload: MemberLeftPayload) => {
       if (payload.serverId !== serverId) return;
-      writeEvent('member:left', { userId: payload.userId });
+      sendEvent(res, 'member:left', { userId: payload.userId });
     },
   );
-  subscriptions.push(memberLeftSubscription);
+  cleanupFns.push(unsubMemberLeft);
+
+  // ── Subscribe to visibility change events ─────────────────────────────────
+  // When a channel's visibility changes, push the updated channel object so
+  // connected clients can update the sidebar badge and handle access revocation
+  // (PRIVATE channels become inaccessible to non-members) without a page reload.
 
-  const visibilityChangedSubscription = eventBus.subscribe(
+  const { unsubscribe: unsubVisibilityChanged } = eventBus.subscribe(
     EventChannels.VISIBILITY_CHANGED,
     async (payload: VisibilityChangedPayload) => {
       if (payload.serverId !== serverId) return;
 
       try {
         const channel = await prisma.channel.findUnique({
           where: { id: payload.channelId },
           select: CHANNEL_SSE_SELECT,
         });
         if (!channel) return;
 
-        writeEvent('channel:visibility-changed', {
+        sendEvent(res, 'channel:visibility-changed', {
           ...channel,
+          // Include old visibility so clients can detect access revocation
+          // (e.g. current user is viewing a channel that just became PRIVA…716 tokens truncated…xOf(role);
 }
 
 export const serverMemberService = {
   /**
    * Add the server owner as an OWNER member. Called when a server is created.
    * Accepts an optional transaction client so callers can include this work in a larger transaction.
    */
   async addOwner(userId: string, serverId: string, tx?: Prisma.TransactionClient): Promise<ServerMember> {
     const run = async (client: Prisma.TransactionClient) => {
       const member = await serverMemberRepository.create(
         { userId, serverId, role: 'OWNER' },
         client,
       );
       await serverRepository.update(serverId, { memberCount: { increment: 1 } }, client);
       return member;
     };
     return tx ? run(tx) : prisma.$transaction(run);
   },
 
   /**
    * Join a server as a MEMBER (default role).
    * Throws CONFLICT if already a member. Rejects private servers.
    */
   async joinServer(userId: string, serverId: string): Promise<ServerMember> {
-    await enforceJoinRateLimit(userId);
-
     const server = await serverRepository.findById(serverId);
     if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
     if (!server.isPublic) {
       throw new TRPCError({ code: 'FORBIDDEN', message: 'This server is private' });
     }
 
     try {
       const member = await prisma.$transaction(async (tx) => {
         const created = await serverMemberRepository.create(
           { userId, serverId, role: 'MEMBER' },
           tx,
         );
         await serverRepository.update(serverId, { memberCount: { increment: 1 } }, tx);
         return created;
       });
 
       void eventBus.publish(EventChannels.MEMBER_JOINED, {
         userId,
         serverId,
         role: 'MEMBER' as RoleType,
         timestamp: new Date().toISOString(),
       });
 
       return member;
     } catch (err) {
       if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
         throw new TRPCError({ code: 'CONFLICT', message: 'Already a member of this server' });
       }
       throw err;
     }
   },
 
   /**
    * Leave a server. Owners cannot leave — they must transfer ownership or delete.
    */
   async leaveServer(userId: string, serverId: string): Promise<void> {
     const membership = await serverMemberRepository.findByUserAndServer(userId, serverId);
     if (!membership) throw new TRPCError({ code: 'NOT_FOUND', message: 'Not a member of this server' });
     if (membership.role === 'OWNER') {
       throw new TRPCError({ code: 'BAD_REQUEST', message: 'Server owner cannot leave. Transfer ownership or delete the server.' });
diff --git a/harmony-backend/tests/events.router.server.test.ts b/harmony-backend/tests/events.router.server.test.ts
index c4db903..5b88301 100644
--- a/harmony-backend/tests/events.router.server.test.ts
+++ b/harmony-backend/tests/events.router.server.test.ts
@@ -1,59 +1,56 @@
 /**
  * events.router.server.test.ts — Issue #185
  *
  * Integration tests for GET /api/events/server/:serverId.
  * eventBus, prisma, and authService are mocked — no running Redis/DB needed.
  */
 
 import http from 'http';
 import request from 'supertest';
 import { createApp } from '../src/app';
 import { eventBus } from '../src/events/eventBus';
 import { prisma } from '../src/db/prisma';
-import { createDeferred, waitFor } from './helpers/async';
 import type { Express } from 'express';
-import type { ChannelCreatedPayload } from '../src/events/eventTypes';
 
 const VALID_TOKEN = 'valid-token';
 const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440001';
-const CREATED_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440009';
 
 // ─── Mock eventBus ─────────────────────────────────────────────────────────────
 
 jest.mock('../src/events/eventBus', () => ({
   eventBus: {
     subscribe: jest.fn(),
     publish: jest.fn().mockResolvedValue(undefined),
   },
   EventChannels: {
     MESSAGE_CREATED: 'harmony:MESSAGE_CREATED',
     MESSAGE_EDITED: 'harmony:MESSAGE_EDITED',
     MESSAGE_DELETED: 'harmony:MESSAGE_DELETED',
     CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
     CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
     CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
   },
 }));
 
 // ─── Mock authService ──────────────────────────────────────────────────────────
 
 jest.mock('../src/services/auth.service', () => ({
   authService: {
     verifyAccessToken: jest.fn(() => ({ sub: 'test-user-id' })),
   },
 }));
 
 // ─── Mock Prisma ───────────────────────────────────────────────────────────────
 
 jest.mock('../src/db/prisma', () => ({
   prisma: {
     message: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
     channel: { findUnique: jest.fn(), findMany: jest.fn() },
     server: { findUnique: jest.fn() },
     serverMember: { findFirst: jest.fn() },
   },
 }));
 
 // ─── Mock cacheService ─────────────────────────────────────────────────────────
 
 jest.mock('../src/services/cache.service', () => ({
@@ -95,243 +92,141 @@ function sseGet(
         res.destroy();
         resolve({ statusCode, headers });
       }, timeoutMs);
       res.on('close', () => {
         clearTimeout(timer);
         resolve({ statusCode, headers });
       });
     });
 
     req.on('error', reject);
     req.setTimeout(timeoutMs + 500, () => {
       req.destroy();
       reject(new Error('Request timed out'));
     });
   });
 }
 
 // ─── Test setup ───────────────────────────────────────────────────────────────
 
 const mockSubscribe = eventBus.subscribe as jest.Mock;
 
 let app: Express;
 let server: http.Server;
 
 beforeAll((done) => {
   mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
   app = createApp();
   server = app.listen(0, done);
 });
 
 afterAll((done) => {
   server.close(done);
 });
 
 beforeEach(() => {
   jest.clearAllMocks();
   mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
   (prisma.server.findUnique as jest.Mock).mockResolvedValue({ id: VALID_SERVER_ID });
   (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
   (prisma.channel.findMany as jest.Mock).mockResolvedValue([]);
-  (prisma.channel.findUnique as jest.Mock).mockResolvedValue({
-    id: CREATED_CHANNEL_ID,
-    serverId: VALID_SERVER_ID,
-    name: 'general',
-    slug: 'general',
-    type: 'TEXT',
-    visibility: 'PUBLIC_INDEXABLE',
-    topic: null,
-    position: 0,
-    createdAt: new Date('2026-04-19T10:00:00.000Z'),
-    updatedAt: new Date('2026-04-19T10:00:00.000Z'),
-  });
 });
 
 // ─── SSE headers ──────────────────────────────────────────────────────────────
 
 describe('GET /api/events/server/:serverId — SSE headers', () => {
   const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;
 
   it('sets Content-Type: text/event-stream', async () => {
     const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
     expect(headers['content-type']).toMatch(/text\/event-stream/);
   });
 
   it('sets Cache-Control: no-cache', async () => {
     const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
     expect(headers['cache-control']).toBe('no-cache');
   });
 
   it('sets Connection: keep-alive', async () => {
     const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
     expect(headers['connection']).toBe('keep-alive');
   });
 
   it('sets X-Accel-Buffering: no', async () => {
     const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
     expect(headers['x-accel-buffering']).toBe('no');
   });
 
   it('subscribes to all three CHANNEL event channels', async () => {
     await sseGet(server, sseUrl(VALID_SERVER_ID));
 
     const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
     expect(subscribedChannels).toContain('harmony:CHANNEL_CREATED');
     expect(subscribedChannels).toContain('harmony:CHANNEL_UPDATED');
     expect(subscribedChannels).toContain('harmony:CHANNEL_DELETED');
   });
 });
 
-describe('GET /api/events/server/:serverId — subscription readiness', () => {
-  const sseUrl = `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`;
-
-  it('waits for all server-scoped subscriptions before flushing SSE headers', async () => {
-    const ready = createDeferred<void>();
-    mockSubscribe.mockImplementation(() => ({
-      unsubscribe: jest.fn(),
-      ready: ready.promise,
-    }));
-
-    const addr = server.address();
-    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
-    const port = addr.port;
-
-    let headersReceived = false;
-    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
-      headersReceived = true;
-      res.resume();
-    });
-
-    await new Promise((resolve) => setTimeout(resolve, 75));
-    expect(headersReceived).toBe(false);
-
-    ready.resolve();
-    await waitFor(() => headersReceived);
-
-    req.destroy();
-  });
-
-  it('buffers server events that arrive before the stream becomes live', async () => {
-    const ready = createDeferred<void>();
-    const responseStarted = createDeferred<void>();
-    let channelCreatedHandler: ((payload: ChannelCreatedPayload) => Promise<void>) | null = null;
-
-    mockSubscribe.mockImplementation(
-      (channel: string, handler: (payload: ChannelCreatedPayload) => Promise<void>) => {
-        if (channel === 'harmony:CHANNEL_CREATED') {
-          channelCreatedHandler = handler;
-        }
-        return {
-          unsubscribe: jest.fn(),
-          ready: ready.promise,
-        };
-      },
-    );
-
-    const addr = server.address();
-    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
-    const port = addr.port;
-
-    const chunks: string[] = [];
-    let response: http.IncomingMessage | null = null;
-    await new Promise<void>((resolve, reject) => {
-      const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
-        response = res;
-        responseStarted.resolve();
-        res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
-        res.on('error', reject);
-      });
-
-      req.on('error', reject);
-
-      setTimeout(async () => {
-        if (!channelCreatedHandler) {
-          reject(new Error('CHANNEL_CREATED handler was not registered'));
-          return;
-        }
-
-        await channelCreatedHandler({
-          channelId: CREATED_CHANNEL_ID,
-          serverId: VALID_SERVER_ID,
-          timestamp: new Date('2026-04-19T10:00:00.000Z').toISOString(),
-        });
-
-        ready.resolve();
-        await responseStarted.promise;
-
-        setTimeout(() => {
-          response?.destroy();
-          req.destroy();
-          resolve();
-        }, 75);
-      }, 50);
-    });
-
-    const body = chunks.join('');
-    expect(body).toContain('event: channel:created');
-    expect(body).toContain(CREATED_CHANNEL_ID);
-    expect(body).toContain('"name":"general"');
-  });
-});
-
 // ─── Input validation ──────────────────────────────────────────────────────────
 
 describe('GET /api/events/server/:serverId — input validation', () => {
   it('returns 400 for a short non-UUID serverId', async () => {
     const res = await request(app).get('/api/events/server/not-valid');
     expect(res.status).toBe(400);
   });
 
   it('returns 400 for a numeric-only serverId', async () => {
     const res = await request(app).get('/api/events/server/12345');
     expect(res.status).toBe(400);
   });
 
   it('accepts a valid UUID-formatted serverId and returns 200', async () => {
     const { statusCode } = await sseGet(
       server,
       `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
     );
     expect(statusCode).toBe(200);
   });
 });
 
 // ─── Auth ─────────────────────────────────────────────────────────────────────
 
 describe('GET /api/events/server/:serverId — auth', () => {
   it('returns 401 when token is missing', async () => {
     const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}`);
     expect(res.status).toBe(401);
   });
 
   it('returns 401 when token is invalid', async () => {
     const { authService } = await import('../src/services/auth.service');
     (authService.verifyAccessToken as jest.Mock).mockImplementationOnce(() => {
       throw new Error('invalid token');
     });
 
-    const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}?token=bad-token`);
+    const res = await request(app).get(
+      `/api/events/server/${VALID_SERVER_ID}?token=bad-token`,
+    );
     expect(res.status).toBe(401);
   });
 });
 
 // ─── Authorisation ─────────────────────────────────────────────────────────────
 
 describe('GET /api/events/server/:serverId — authorisation', () => {
   it('returns 404 when server is not found', async () => {
     (prisma.server.findUnique as jest.Mock).mockResolvedValueOnce(null);
 
     const res = await request(app).get(
       `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
     );
     expect(res.status).toBe(404);
   });
 
   it('returns 403 when user is not a member of the server', async () => {
     (prisma.serverMember.findFirst as jest.Mock).mockResolvedValueOnce(null);
 
     const res = await request(app).get(
       `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
     );
     expect(res.status).toBe(403);
   });
 });
diff --git a/harmony-backend/tests/events.router.test.ts b/harmony-backend/tests/events.router.test.ts
index 1085761..470757f 100644
--- a/harmony-backend/tests/events.router.test.ts
+++ b/harmony-backend/tests/events.router.test.ts
@@ -1,59 +1,57 @@
 /**
  * events.router.test.ts — Issue #180
  *
  * Integration tests for the SSE endpoint GET /api/events/channel/:channelId.
  * eventBus, prisma, and cacheService are mocked so no running Redis/DB is needed.
  *
  * SSE connections are tested by starting a real HTTP server on a random port and
  * using Node's built-in http.get(), which handles streaming responses correctly
  * without supertest hanging on open connections.
  */
 
 import http from 'http';
 import request from 'supertest';
 import { createApp } from '../src/app';
 import { eventBus } from '../src/events/eventBus';
 import { prisma } from '../src/db/prisma';
-import { createDeferred, waitFor } from './helpers/async';
 import type { Express } from 'express';
-import type { MessageCreatedPayload } from '../src/events/eventTypes';
 
 const VALID_TOKEN = 'valid-token';
 
 // ─── Mock eventBus ─────────────────────────────────────────────────────────────
 
 jest.mock('../src/events/eventBus', () => ({
   eventBus: {
     subscribe: jest.fn(),
     publish: jest.fn().mockResolvedValue(undefined),
   },
   EventChannels: {
     MESSAGE_CREATED: 'harmony:MESSAGE_CREATED',
     MESSAGE_EDITED: 'harmony:MESSAGE_EDITED',
     MESSAGE_DELETED: 'harmony:MESSAGE_DELETED',
   },
 }));
 
 // ─── Mock authService ──────────────────────────────────────────────────────────
 
 jest.mock('../src/services/auth.service', () => ({
   authService: {
     verifyAccessToken: jest.fn(() => ({ sub: 'test-user-id' })),
   },
 }));
 
 // ─── Mock Prisma ───────────────────────────────────────────────────────────────
 
 jest.mock('../src/db/prisma', () => ({
   prisma: {
     message: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
     channel: { findUnique: jest.fn() },
     serverMember: { findFirst: jest.fn() },
   },
 }));
 
 // ─── Mock cacheService ─────────────────────────────────────────────────────────
 
 jest.mock('../src/services/cache.service', () => ({
   cacheService: {
     get: jest.fn().mockResolvedValue(null),
@@ -137,176 +135,66 @@ beforeEach(() => {
   (prisma.channel.findUnique as jest.Mock).mockResolvedValue({ serverId: 'test-server-id' });
   (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
 });
 
 // ─── SSE headers ──────────────────────────────────────────────────────────────
 
 describe('GET /api/events/channel/:channelId — SSE headers', () => {
   const VALID_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
   const sseUrl = (id: string) => `/api/events/channel/${id}?token=${VALID_TOKEN}`;
 
   it('sets Content-Type: text/event-stream', async () => {
     const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
     expect(headers['content-type']).toMatch(/text\/event-stream/);
   });
 
   it('sets Cache-Control: no-cache', async () => {
     const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
     expect(headers['cache-control']).toBe('no-cache');
   });
 
   it('sets Connection: keep-alive', async () => {
     const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
     expect(headers['connection']).toBe('keep-alive');
   });
 
   it('sets X-Accel-Buffering: no', async () => {
     const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
     expect(headers['x-accel-buffering']).toBe('no');
   });
 
   it('subscribes to all three MESSAGE event channels', async () => {
     await sseGet(server, sseUrl(VALID_CHANNEL_ID));
 
     const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
     expect(subscribedChannels).toContain('harmony:MESSAGE_CREATED');
     expect(subscribedChannels).toContain('harmony:MESSAGE_EDITED');
     expect(subscribedChannels).toContain('harmony:MESSAGE_DELETED');
   });
 });
 
-describe('GET /api/events/channel/:channelId — subscription readiness', () => {
-  const VALID_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
-  const sseUrl = `/api/events/channel/${VALID_CHANNEL_ID}?token=${VALID_TOKEN}`;
-
-  it('waits for all subscription handshakes before flushing SSE headers', async () => {
-    const ready = createDeferred<void>();
-    mockSubscribe.mockImplementation(() => ({
-      unsubscribe: jest.fn(),
-      ready: ready.promise,
-    }));
-
-    const addr = server.address();
-    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
-    const port = addr.port;
-
-    let headersReceived = false;
-    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
-      headersReceived = true;
-      res.resume();
-    });
-
-    await new Promise((resolve) => setTimeout(resolve, 75));
-    expect(headersReceived).toBe(false);
-
-    ready.resolve();
-    await waitFor(() => headersReceived);
-
-    req.destroy();
-  });
-
-  it('buffers message events that arrive before the stream becomes live', async () => {
-    const ready = createDeferred<void>();
-    const responseStarted = createDeferred<void>();
-    let createdHandler: ((payload: MessageCreatedPayload) => Promise<void>) | null = null;
-
-    mockSubscribe.mockImplementation(
-      (channel: string, handler: (payload: MessageCreatedPayload) => Promise<void>) => {
-        if (channel === 'harmony:MESSAGE_CREATED') {
-          createdHandler = handler;
-        }
-        return {
-          unsubscribe: jest.fn(),
-          ready: ready.promise,
-        };
-      },
-    );
-
-    (prisma.message.findUnique as jest.Mock).mockResolvedValue({
-      id: 'message-1',
-      channelId: VALID_CHANNEL_ID,
-      authorId: 'author-1',
-      author: {
-        id: 'author-1',
-        username: 'alice',
-        displayName: 'Alice',
-        avatarUrl: null,
-      },
-      content: 'hello from the setup window',
-      createdAt: new Date('2026-04-19T10:00:00.000Z'),
-      editedAt: null,
-      attachments: [],
-      isDeleted: false,
-    });
-
-    const addr = server.address();
-    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
-    const port = addr.port;
-
-    const chunks: string[] = [];
-    let response: http.IncomingMessage | null = null;
-    await new Promise<void>((resolve, reject) => {
-      const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
-        response = res;
-        responseStarted.resolve();
-        res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
-        res.on('error', reject);
-      });
-
-      req.on('error', reject);
-
-      setTimeout(async () => {
-        if (!createdHandler) {
-          reject(new Error('MESSAGE_CREATED handler was not registered'));
-          return;
-        }
-
-        await createdHandler({
-          messageId: 'message-1',
-          channelId: VALID_CHANNEL_ID,
-          authorId: 'author-1',
-          timestamp: new Date('2026-04-19T10:00:00.000Z').toISOString(),
-        });
-
-        ready.resolve();
-        await responseStarted.promise;
-
-        setTimeout(() => {
-          response?.destroy();
-          req.destroy();
-          resolve();
-        }, 75);
-      }, 50);
-    });
-
-    const body = chunks.join('');
-    expect(body).toContain('event: message:created');
-    expect(body).toContain('hello from the setup window');
-  });
-});
-
 // ─── Input validation ──────────────────────────────────────────────────────────
 
 describe('GET /api/events/channel/:channelId — input validation', () => {
   it('returns 400 for a short non-UUID channelId', async () => {
     const res = await request(app).get('/api/events/channel/not-valid');
     expect(res.status).toBe(400);
   });
 
   it('returns 400 for a numeric-only channelId', async () => {
     const res = await request(app).get('/api/events/channel/12345');
     expect(res.status).toBe(400);
   });
 
   it('returns 400 for a channelId with spaces', async () => {
     const res = await request(app).get('/api/events/channel/not%20a%20uuid');
     expect(res.status).toBe(400);
   });
 
   it('accepts a valid UUID-formatted channelId and returns 200', async () => {
     const { statusCode } = await sseGet(
       server,
       `/api/events/channel/550e8400-e29b-41d4-a716-446655440001?token=${VALID_TOKEN}`,
     );
     expect(statusCode).toBe(200);
   });
 });
diff --git a/harmony-backend/tests/serverMember.test.ts b/harmony-backend/tests/serverMember.test.ts
index 76dcf06..b068df8 100644
--- a/harmony-backend/tests/serverMember.test.ts
+++ b/harmony-backend/tests/serverMember.test.ts
@@ -1,44 +1,43 @@
 import { PrismaClient } from '@prisma/client';
 import { TRPCError } from '@trpc/server';
-import { redis } from '../src/db/redis';
-import { serverMemberService, JOIN_RATE_MAX, JOIN_RATE_WINDOW_SECS } from '../src/services/serverMember.service';
+import { serverMemberService } from '../src/services/serverMember.service';
 
 describe('serverMemberService (integration)', () => {
   const prisma = new PrismaClient();
 
   let ownerUserId: string;
   let memberUserId: string;
   let otherUserId: string;
   let serverId: string;
   let privateServerId: string;
 
   beforeAll(async () => {
     const ts = Date.now();
 
     // Create test users
     const owner = await prisma.user.create({
       data: {
         email: `sm-owner-${ts}@example.com`,
         username: `sm_owner_${ts}`,
         passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
         displayName: 'SM Owner',
       },
     });
     ownerUserId = owner.id;
 
     const member = await prisma.user.create({
       data: {
         email: `sm-member-${ts}@example.com`,
         username: `sm_member_${ts}`,
         passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
         displayName: 'SM Member',
       },
     });
     memberUserId = member.id;
 
     const other = await prisma.user.create({
       data: {
         email: `sm-other-${ts}@example.com`,
         username: `sm_other_${ts}`,
         passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
         displayName: 'SM Other',
@@ -87,144 +86,80 @@ describe('serverMemberService (integration)', () => {
 
   describe('joinServer', () => {
     it('allows a user to join a server as MEMBER', async () => {
       const membership = await serverMemberService.joinServer(memberUserId, serverId);
       expect(membership.userId).toBe(memberUserId);
       expect(membership.serverId).toBe(serverId);
       expect(membership.role).toBe('MEMBER');
     });
 
     it('increments the server member count', async () => {
       const server = await prisma.server.findUnique({ where: { id: serverId } });
       // Owner (1) + member (1) = 2
       expect(server!.memberCount).toBe(2);
     });
 
     it('throws CONFLICT if user is already a member', async () => {
       const err = await serverMemberService
         .joinServer(memberUserId, serverId)
         .catch((e: TRPCError) => e);
       expect(err).toBeInstanceOf(TRPCError);
       expect((err as TRPCError).code).toBe('CONFLICT');
     });
 
     it('throws NOT_FOUND for non-existent server', async () => {
       const err = await serverMemberService
         .joinServer(memberUserId, '00000000-0000-0000-0000-000000000000')
         .catch((e: TRPCError) => e);
       expect(err).toBeInstanceOf(TRPCError);
       expect((err as TRPCError).code).toBe('NOT_FOUND');
     });
 
     it('throws FORBIDDEN when joining a private server', async () => {
       const err = await serverMemberService
         .joinServer(memberUserId, privateServerId)
         .catch((e: TRPCError) => e);
       expect(err).toBeInstanceOf(TRPCError);
       expect((err as TRPCError).code).toBe('FORBIDDEN');
     });
   });
 
-  // ─── Join Rate Limiting ─────────────────────────────────────────────────────
-
-  describe('joinServer rate limiting', () => {
-    let rateLimitUserId: string;
-    const rateLimitKey = () => `rl:join:${rateLimitUserId}`;
-    // Non-existent serverId so we can test rate limiting without DB side effects.
-    // The rate limit check runs before the server lookup, so NOT_FOUND means the limit passed.
-    const NON_EXISTENT_SERVER = '00000000-0000-0000-0000-000000000000';
-
-    beforeAll(async () => {
-      const ts = Date.now();
-      const user = await prisma.user.create({
-        data: {
-          email: `sm-ratelimit-${ts}@example.com`,
-          username: `sm_ratelimit_${ts}`,
-          passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
-          displayName: 'SM RateLimit',
-        },
-      });
-      rateLimitUserId = user.id;
-    });
-
-    afterAll(async () => {
-      await redis.del(rateLimitKey());
-      await prisma.user.delete({ where: { id: rateLimitUserId } }).catch(() => {});
-    });
-
-    beforeEach(async () => {
-      await redis.del(rateLimitKey());
-    });
-
-    it('allows joins up to the rate limit', async () => {
-      // Set counter to one below the limit; next call increments to JOIN_RATE_MAX (still allowed)
-      await redis.set(rateLimitKey(), JOIN_RATE_MAX - 1, 'EX', JOIN_RATE_WINDOW_SECS);
-
-      const err = await serverMemberService
-        .joinServer(rateLimitUserId, NON_EXISTENT_SERVER)
-        .catch((e: TRPCError) => e);
-      expect(err).toBeInstanceOf(TRPCError);
-      expect((err as TRPCError).code).toBe('NOT_FOUND'); // rate limit passed; server lookup failed
-    });
-
-    it('blocks the (JOIN_RATE_MAX + 1)th join with TOO_MANY_REQUESTS', async () => {
-      // Pre-fill the counter at the limit; next INCR pushes it over
-      await redis.set(rateLimitKey(), JOIN_RATE_MAX, 'EX', JOIN_RATE_WINDOW_SECS);
-
-      const err = await serverMemberService
-        .joinServer(rateLimitUserId, NON_EXISTENT_SERVER)
-        .catch((e: TRPCError) => e);
-      expect(err).toBeInstanceOf(TRPCError);
-      expect((err as TRPCError).code).toBe('TOO_MANY_REQUESTS');
-    });
-
-    it('rate limit resets after the window expires', async () => {
-      // Simulate an expired key — no Redis key means counter starts fresh
-      // (key was cleared in beforeEach)
-      const err = await serverMemberService
-        .joinServer(rateLimitUserId, NON_EXISTENT_SERVER)
-        .catch((e: TRPCError) => e);
-      expect(err).toBeInstanceOf(TRPCError);
-      expect((err as TRPCError).code).toBe('NOT_FOUND'); // rate limit passed; server lookup failed
-    });
-  });
-
   // ─── Get Server Members ─────────────────────────────────────────────────────
 
   describe('getServerMembers', () => {
     it('returns all members with user info and roles', async () => {
       const members = await serverMemberService.getServerMembers(serverId);
       expect(members.length).toBe(2);
 
       const ownerMember = members.find((m) => m.userId === ownerUserId);
       expect(ownerMember).toBeDefined();
       expect(ownerMember!.role).toBe('OWNER');
       expect(ownerMember!.user.username).toBeDefined();
 
       const regularMember = members.find((m) => m.userId === memberUserId);
       expect(regularMember).toBeDefined();
       expect(regularMember!.role).toBe('MEMBER');
     });
 
     it('orders by role hierarchy then join date', async () => {
       const members = await serverMemberService.getServerMembers(serverId);
       // OWNER should come before MEMBER in role ordering
       expect(members[0].role).toBe('OWNER');
       expect(members[1].role).toBe('MEMBER');
     });
 
     it('throws NOT_FOUND for non-existent server', async () => {
       const err = await serverMemberService
         .getServerMembers('00000000-0000-0000-0000-000000000000')
         .catch((e: TRPCError) => e);
       expect(err).toBeInstanceOf(TRPCError);
       expect((err as TRPCError).code).toBe('NOT_FOUND');
     });
   });
 
   // ─── Change Role ────────────────────────────────────────────────────────────
 
   describe('changeRole', () => {
     it('allows owner to promote a member to MODERATOR', async () => {
       const updated = await serverMemberService.changeRole(
         memberUserId,
         serverId,
```

#### Tool: exec_command

```sh
git diff --unified=40 origin/main..pr-443 -- .github/workflows/run-frontend-e2e.yml docs/deployment/replica-readiness-audit.md tests/integration/attachments.test.ts tests/integration/env.ts .gitignore
```

Output:

```text
diff --git a/.github/workflows/run-frontend-e2e.yml b/.github/workflows/run-frontend-e2e.yml
index 5e8922f..6f315d5 100644
--- a/.github/workflows/run-frontend-e2e.yml
+++ b/.github/workflows/run-frontend-e2e.yml
@@ -1,43 +1,47 @@
 name: Frontend E2E
 
 on:
+  push:
+    branches: [main, master]
+  pull_request:
+    branches: [main, master]
   workflow_dispatch:
 
 jobs:
   frontend-e2e:
     name: Run Frontend E2E Tests
     runs-on: ubuntu-latest
     timeout-minutes: 20
     steps:
       - uses: actions/checkout@v4
 
       - uses: actions/setup-node@v4
         with:
           node-version: 20
           cache: npm
           cache-dependency-path: |
             harmony-frontend/package-lock.json
             harmony-backend/package-lock.json
 
       - name: Install frontend dependencies
         working-directory: harmony-frontend
         run: npm ci
 
       - name: Install backend dependencies
         working-directory: harmony-backend
         run: npm ci
 
       - name: Install Playwright browsers
         working-directory: harmony-frontend
         run: npx playwright install --with-deps chromium
 
       - name: Run frontend E2E tests
         working-directory: harmony-frontend
         run: npm run test:e2e
 
       - name: Upload Playwright artifacts
         if: failure()
         uses: actions/upload-artifact@v4
         with:
           name: playwright-artifacts
           path: |
diff --git a/docs/deployment/replica-readiness-audit.md b/docs/deployment/replica-readiness-audit.md
index ac766fd..9f561c6 100644
--- a/docs/deployment/replica-readiness-audit.md
+++ b/docs/deployment/replica-readiness-audit.md
@@ -1,198 +1,200 @@
 # Replica Readiness Audit
 
 ## 1. Purpose
 
 This document audits the `backend-api` service for state that will break or degrade under 2+ Railway replicas. It is the canonical reference for replica-safety in the Harmony backend. Downstream implementation issues (#318, #319, #320, #330) must cite this document when implementing or validating replica-safe behavior.
 
 All findings are grounded in the actual codebase as of the audit date (2026-04-11) and reference specific file paths and line ranges.
 
 Reference document for topology and ownership context: `docs/deployment/deployment-architecture.md`.
 
 ---
 
 ## 2. Audit Summary
 
 | Area | Location | Severity | Status |
 |---|---|---|---|
 | In-memory rate limiting (auth routes) | `src/app.ts` | **Must-fix** | Resolved (#318) — Redis-backed `RedisStore` via `rate-limit-redis` |
 | In-memory rate limiting (public/token-bucket) | `src/middleware/rate-limit.middleware.ts` | **Must-fix** | Resolved (#318) — replaced with Redis-backed `express-rate-limit` |
 | Trust proxy not configured | `src/app.ts` | **Must-fix** | Resolved (#318) — `TRUST_PROXY_HOPS` env var gates `trust proxy` setting |
 | Local filesystem attachment storage | `src/lib/storage/local.provider.ts` | Resolved (#319) | `S3StorageProvider` (Cloudflare R2) registered when `STORAGE_PROVIDER=s3` |
 | Duplicate cacheInvalidator on API replicas | `src/index.ts` | Resolved (#320) | Moved to `backend-worker` singleton |
-| SSE correctness across replicas | `src/routes/events.router.ts` | Resolved (#412) | SSE routes await Redis subscription readiness before flushing the stream |
+| SSE correctness across replicas | `src/routes/events.router.ts` | Mostly safe — known startup window | Redis Pub/Sub fan-out; `ready` not awaited |
 
 ---
 
 ## 3. Must-Fix Items
 
 ### 3.1 In-Memory Rate Limiting — Auth Routes — RESOLVED (#318)
 
 **File:** `harmony-backend/src/app.ts`
 
 `express-rate-limit` defaults to an in-process `MemoryStore`. With N replicas, each replica maintains an independent counter. A client can make `N × max` requests before hitting a limit — effectively multiplying the allowed rate by the replica count. For production login brute-force protection (`max: 10`) this is a security regression.
 
 **Resolution (#318):** Limiters (`loginLimiter`, `registerLimiter`, `refreshLimiter`) are now created inside `createApp()` and wired to a `RedisStore` (from the `rate-limit-redis` package) when `NODE_ENV === 'production'`. Each limiter gets its own store instance with a unique key prefix (`rl:login:`, `rl:register:`, `rl:refresh:`) so route counters are independent in Redis. `rate-limit-redis` uses a Lua script for atomic increment+expiry — no non-atomic INCR + EXPIRE pattern. In dev/test, `MemoryStore` (the default) is used automatically when no store is passed.
 
 **Owner:** `backend-api`
 
 ---
 
 ### 3.2 In-Memory Rate Limiting — Public API Token Bucket — RESOLVED (#318)
 
 **File:** `harmony-backend/src/middleware/rate-limit.middleware.ts`
 
 The custom token-bucket rate limiter stored per-IP state in a module-level `Map`. This state was local to the Node.js process and not shared across replicas. With N replicas, the effective public API rate limit became `N × 100` requests per minute per IP.
 
 **Resolution (#318):** The in-process `Map<string, TokenBucket>` and all associated token-bucket logic are removed. The middleware now exports `createPublicRateLimiter(store?)` — a factory that returns a standard `express-rate-limit` middleware (fixed-window, 100 req/min per IP) backed by a `RedisStore` (prefix `rl:public:`) in production. Algorithm trade-off: continuous token-bucket is replaced by fixed-window; this is acceptable for a public read API and avoids a Lua token-bucket implementation. `publicRouter` was converted from a module-level singleton to a `createPublicRouter(store?)` factory so `createApp()` can inject the same `rateLimitStore` option used for auth limiters.
 
 **Owner:** `backend-api`
 
 ---
 
 ### 3.3 Trust Proxy Not Configured — RESOLVED (#318)
 
 **File:** `harmony-backend/src/app.ts`
 
 Without `app.set('trust proxy', N)`, Express reads `req.ip` from the socket's remote address. Behind Railway's HTTP proxy, the socket address is the proxy's IP, not the client's. All rate limiters key on `req.ip`, so they collapse all clients into a single bucket — effectively disabling per-IP limiting for the entire deployment.
 
 **Resolution (#318):** `createApp()` reads `TRUST_PROXY_HOPS` from the environment and calls `app.set('trust proxy', trustProxyHops)` when the value is a positive integer. The setting is absent (0) in local dev so clients cannot spoof `X-Forwarded-For`. Set `TRUST_PROXY_HOPS=1` in Railway to unwrap one proxy hop. An empty or non-integer value throws at startup to prevent silent misconfiguration.
 
 **Owner:** `backend-api`
 
 ---
 
 ### 3.4 Local Filesystem Attachment Storage
 
 **Files:**
 - `harmony-backend/src/lib/storage/local.provider.ts` — writes to `./uploads` on the local instance disk
 - `harmony-backend/src/lib/storage/index.ts` — factory, only supports `'local'`; throws for any other value
 
 `LocalStorageProvider` writes uploaded files to `./uploads` (or `LOCAL_UPLOAD_DIR`) on the instance's ephemeral local disk. Files uploaded to replica A are inaccessible from replica B. A client whose upload landed on replica A will receive a 404 if a subsequent file-serve request is routed to replica B.
 
 The deployment architecture document references `STORAGE_PROVIDER=s3` as the required production value, but the S3 provider is not yet implemented. The factory throws `Unknown STORAGE_PROVIDER: "s3"` if that value is set.
 
 **Fix:** Implement an `S3StorageProvider` (or equivalent object storage — Railway also supports Cloudflare R2 or any S3-compatible endpoint) and register it in the factory when `STORAGE_PROVIDER=s3`. Uploaded files must be written to shared object storage so any replica can serve them. The `upload()` and `delete()` interface is already defined in `src/lib/storage/storage.interface.ts`.
 
 **This is a hard blocker for running 2+ replicas with file upload/serve functionality.**
 
 **Owner:** `backend-api`
 
 ---
 
 ## 4. Acceptable for Demo — Not Blocking
 
 ### 4.1 Duplicate cacheInvalidator Subscriptions on API Replicas — RESOLVED (#320)
 
 **Files (post-split):**
 - `harmony-backend/src/worker.ts` — owns `cacheInvalidator.start()`
 - `harmony-backend/src/index.ts` — no longer imports or starts `cacheInvalidator`
 
 `cacheInvalidator.start()` opens Redis Pub/Sub subscriber connections and registers handlers for `VISIBILITY_CHANGED`, `MESSAGE_CREATED`, `MESSAGE_EDITED`, and `MESSAGE_DELETED`. Before #320 this ran on every `backend-api` replica, duplicating subscriber connections and redundantly firing `indexingService.onVisibilityChanged()` on visibility transitions.
 
 **Resolution (#320):** The backend process was split into two Railway services:
 
 - `backend-api` (`src/index.ts`) — stateless HTTP/tRPC/SSE, 2+ replicas, no background subscribers.
 - `backend-worker` (`src/worker.ts`) — singleton, owns `cacheInvalidator` and any future Pub/Sub subscribers or queue consumers. Exposes a tiny `GET /health` endpoint for Railway health checks and graceful restarts.
 
 With this split, exactly one process subscribes to each Redis channel regardless of API replica count, which eliminates duplicate Postgres writes on `PUBLIC_INDEXABLE` → non-indexable visibility transitions and halves-or-better the number of idle Redis subscriber connections.
 
 **Owner:** `backend-worker`
 
 ---
 
-### 4.2 SSE Behind Load Balancing — Resolved (#412)
+### 4.2 SSE Behind Load Balancing — Mostly Safe (Known Startup Window)
 
 **File:** `harmony-backend/src/routes/events.router.ts`
 
 SSE connections are long-lived HTTP streams. Railway's load balancer routes each new SSE connection to one replica, and that connection remains on that replica for its lifetime.
 
 Because SSE event delivery is backed by `eventBus.subscribe()` which uses a Redis Pub/Sub subscriber, every replica receives every published event. A client connected to replica A will receive events published by code running on replica B, because replica A has an active Redis subscription on the relevant channel.
 
-**Resolution (#412):** Both SSE routes in `src/routes/events.router.ts` now wait for every Redis `SUBSCRIBE` handshake to resolve before flushing SSE headers. Events that arrive after handler registration but before the stream becomes live are buffered in memory and flushed immediately after readiness completes, so the first connection on a freshly started replica cannot miss events solely because Redis had not yet confirmed the subscription set.
+**Known limitation — subscription readiness window:** `eventBus.subscribe()` returns a `{ unsubscribe, ready }` pair where `ready` resolves once Redis confirms the SUBSCRIBE handshake. The SSE router does not currently await `ready` before accepting the stream as live. On the very first SSE connection to a freshly started replica (when no other subscriber holds the channel open), there is a brief window between calling `subscribe()` and the Redis handshake completing during which events published by other replicas may be missed. Subsequent connections on the same replica are not affected because the subscriber client is already active.
+
+**Impact:** Low probability in practice — the window is a single RTT to Redis and only applies to first-connection-on-fresh-replica scenarios. For the current demo scale this is acceptable. To eliminate the window entirely, the SSE handler should await `ready` before sending the initial response headers, or implement client-side reconnect with a `Last-Event-ID` to replay missed events.
 
 The `X-Accel-Buffering: no` response header (`events.router.ts:116`) instructs nginx-style reverse proxies to disable response buffering for SSE connections, which is required for real-time delivery.
 
 **No sticky-session load balancing is required.** Railway's default round-robin routing is correct for the SSE endpoints.
 
 **Verify at deploy time:** Confirm Railway's proxy allows long-lived HTTP/1.1 connections and does not impose a timeout shorter than the SSE heartbeat interval (30 s). If a gateway timeout is shorter than 30 s, reduce the heartbeat interval in `events.router.ts:200,429`.
 
 **Owner:** No code change required for demo. Await `ready` or add `Last-Event-ID` replay before production multi-replica rollout.
 
 ---
 
 ## 5. Replica-Safe Backend Checklist
 
 Use this checklist when validating that `backend-api` is ready to run at 2+ replicas.
 
 ### Must-Fix (block multi-replica deployment)
 
 - [x] **Rate limiting — Redis store** *(resolved in #318)*: Auth limiters in `createApp()` use `RedisStore` (prefix `rl:login:` / `rl:register:` / `rl:refresh:`) in production. Atomic via Lua script. Dev/test falls back to `MemoryStore`.
 - [x] **Rate limiting — token bucket** *(resolved in #318)*: In-process `Map` removed. `createPublicRateLimiter(store?)` factory uses Redis-backed `express-rate-limit` (prefix `rl:public:`, 100 req/min fixed-window) in production.
 - [x] **Trust proxy** *(resolved in #318)*: `TRUST_PROXY_HOPS` env var gates `app.set('trust proxy', N)` in `createApp()`. Set `TRUST_PROXY_HOPS=1` in Railway. Numeric hop count prevents XFF spoofing in local dev.
 - [x] **Attachment storage — S3** *(resolved in #319)*: `S3StorageProvider` implemented in `src/lib/storage/s3.provider.ts` using Cloudflare R2 via the S3-compatible API. Factory in `src/lib/storage/index.ts` registers the provider when `STORAGE_PROVIDER=s3`. Set `STORAGE_PROVIDER=s3` and required R2 env vars in Railway production (see `docs/deployment/deployment-architecture.md §6.2`).
 
 ### Ownership Migrations (should happen before production, acceptable for demo)
 
 - [x] **Move cacheInvalidator to backend-worker** *(resolved in #320)*: `cacheInvalidator.start()` is removed from `src/index.ts` and now runs from `src/worker.ts` on the singleton `backend-worker` Railway service.
 
 ### Deploy-Time Verifications (no code change needed)
 
 - [ ] **Railway proxy keepalive**: Confirm Railway's proxy timeout is greater than the SSE heartbeat interval (30 s) so SSE connections are not prematurely closed.
-- [x] **SSE subscription readiness** *(resolved in #412)*: `events.router.ts` now waits for all `eventBus.subscribe().ready` promises before flushing SSE headers and buffers any events that arrive during that setup window (§4.2).
+- [ ] **SSE subscription readiness**: Consider awaiting `eventBus.subscribe().ready` in the SSE handler, or implementing `Last-Event-ID` replay, to eliminate the brief missed-event window on first connection to a fresh replica (§4.2).
 - [ ] **Redis store connection**: Confirm the Redis-backed rate-limit and token-bucket stores use the same `REDIS_URL` as the rest of the backend.
 - [ ] **S3 credentials**: Confirm `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `S3_BUCKET` (or equivalent) are set in Railway before enabling `STORAGE_PROVIDER=s3`.
 
 ---
 
 ## 6. `backend-api` vs `backend-worker` Responsibility Boundaries
 
 This section is the authoritative boundary decision. Downstream issues that create or move code across this boundary must update this table.
 
 Entry points (post #320):
 
 - `backend-api`: `harmony-backend/src/index.ts` — Railway start command `npm run start:api`.
 - `backend-worker`: `harmony-backend/src/worker.ts` — Railway start command `npm run start:worker`.
 
 | Responsibility | Service | Rationale |
 |---|---|---|
 | HTTP request/response handling | `backend-api` | Stateless per-request; safe to run N replicas |
 | tRPC endpoint | `backend-api` | Stateless; safe to run N replicas |
 | Auth routes (`/api/auth/*`) | `backend-api` | Stateless; per-request session check |
 | Public REST routes (`/api/public/*`) | `backend-api` | Stateless; cached reads from Redis/Postgres |
 | SSE event streams (`/api/events/*`) | `backend-api` | Long-lived but stateless — Redis Pub/Sub fan-out; no sticky sessions required |
 | File upload endpoint (`/api/attachments/upload`) | `backend-api` | Stateless once S3 storage is in place |
 | File serve (`/api/attachments/files/*`) | `backend-api` (dev only) / CDN (prod) | Local serve removed when `STORAGE_PROVIDER=s3` |
 | Health check (`GET /health`) | `backend-api` | Per-instance readiness check; includes `instanceId` + `X-Instance-Id` header |
 | Redis Pub/Sub cache invalidator | `backend-worker` | Must not run N times; single subscriber per channel |
 | Sitemap/meta regeneration jobs | `backend-worker` | Long-running background; must not multiply with replica count |
 | Future queue consumers | `backend-worker` | Singleton ownership required for exactly-once processing |
 | Worker health check (`GET /health`) | `backend-worker` | Tiny `http.createServer` endpoint; Railway restart target |
 
 ### 6.1 SSE Fan-Out Strategy (No Sticky Sessions)
 
 The production SSE strategy is explicit Redis Pub/Sub fan-out:
 
 1. A message-producing request lands on any `backend-api` replica and calls `eventBus.publish(channel, payload)` — this `PUBLISH`es on the shared Redis instance.
 2. Every `backend-api` replica holds an active Redis subscriber (lazily opened by `eventBus.subscribe`) for each SSE channel it currently serves.
 3. Because all replicas share one Redis, every replica receives the published event and pushes it down to its locally-connected SSE clients.
 
-This means a client connected to replica A receives events produced on replica B without any sticky-session requirement. Railway's default round-robin load balancing is correct for `/api/events/*`. As of #412, the SSE router waits for all Redis subscription handshakes before treating a connection as live, eliminating the previous first-connection startup window.
+This means a client connected to replica A receives events produced on replica B without any sticky-session requirement. Railway's default round-robin load balancing is correct for `/api/events/*`. See §4.2 for the known startup window on the first SSE connection to a freshly started replica.
 
 ### 6.2 Replica Identity Observability
 
 To prove load balancing across 2+ `backend-api` replicas, each process computes a stable `instanceId` (`harmony-backend/src/lib/instance-identity.ts`, derived from `os.hostname()` plus a short random suffix; overridable with `INSTANCE_ID`) and exposes it via:
 
 - **`X-Instance-Id` response header** — stamped on every `backend-api` response via middleware in `createApp()`. Verify distribution with e.g. `for i in 1 2 3 4 5 6; do curl -sI https://api.harmony.chat/health | grep -i x-instance-id; done` — the values should cycle across replicas.
 - **`GET /health` JSON body** — returns `{ status, service, instanceId, timestamp }` so the same identity is visible without reading headers, and is distinguishable between `backend-api` and `backend-worker`.
 - **Structured startup logs** — both `src/index.ts` and `src/worker.ts` log their `instanceId` and `pid` at boot, so Railway logs can be grouped by replica.
 
 ---
 
 ## 7. Downstream Issue Map
 
 | Issue | Dependency on this document |
 |---|---|
 | #318 | Implement Redis-backed rate limiting (§3.1, §3.2, §5 checklist) |
 | #319 | Implement S3 attachment storage (§3.4, §5 checklist) |
 | #320 | Split `backend-api` / `backend-worker`, add replica identity observability, migrate `cacheInvalidator` (§4.1, §6) |
 | #330 | Provision `backend-worker` on Railway using the boundary defined here |
diff --git a/tests/integration/attachments.test.ts b/tests/integration/attachments.test.ts
index 416f4d2..71993ad 100644
--- a/tests/integration/attachments.test.ts
+++ b/tests/integration/attachments.test.ts
@@ -1,117 +1,123 @@
 /**
  * ATT-1 through ATT-6: Attachment Upload and Retrieval
  * Classification:
  *   ATT-2:           cloud-safe (unauthenticated rejection; no write)
  *   ATT-3, ATT-4,
  *   ATT-6:           cloud-safe when CLOUD_TEST_ACCESS_TOKEN is provisioned
  *                    (validation rejects before storage write)
  *   ATT-1, ATT-5:    local-only (successful uploads create durable objects and
  *                    there is no public cleanup endpoint for shared cloud envs)
  */
 
-import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe, cloudTokenTest } from './env';
+import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe } from './env';
 import { login } from './helpers/auth';
 
 describe('Attachments Smoke (cloud-safe)', () => {
   let accessToken = '';
 
   beforeAll(async () => {
     if (isCloud) {
       accessToken = process.env.CLOUD_TEST_ACCESS_TOKEN ?? '';
       return;
     }
 
     const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
     accessToken = tokens.accessToken;
   });
 
   function buildFormData(content: Buffer | string, filename: string, mimeType: string): FormData {
     const form = new FormData();
     const blobContent = typeof content === 'string' ? content : new Uint8Array(content);
     const blob = new Blob([blobContent], { type: mimeType });
     form.append('file', blob, filename);
     return form;
   }
 
   function minimalPng(): Buffer {
     // 1x1 transparent PNG (67 bytes)
     return Buffer.from(
       '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
       'hex',
     );
   }
 
   test('ATT-2: upload without authentication returns 401', async () => {
     const form = buildFormData(minimalPng(), 'test.png', 'image/png');
     const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
       method: 'POST',
       body: form,
     });
     expect(res.status).toBe(401);
   });
 
-  cloudTokenTest('ATT-3: upload of a disallowed file type returns 400', async () => {
+  test('ATT-3: upload of a disallowed file type returns 400', async () => {
+    if (!accessToken) return;
+
     const form = buildFormData(Buffer.from('MZ'), 'test.exe', 'application/octet-stream');
     const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
       method: 'POST',
       headers: { Authorization: `Bearer ${accessToken}` },
       body: form,
     });
     expect(res.status).toBe(400);
     const body = (await res.json()) as { error?: string };
     expect(body.error).toBeTruthy();
   });
 
-  cloudTokenTest('ATT-4: upload of a file exceeding 25 MB returns 400 or 413', async () => {
+  test('ATT-4: upload of a file exceeding 25 MB returns 400 or 413', async () => {
+    if (!accessToken) return;
+
     // 26 MB of zeros declared as PNG (size validation fires before magic-byte check)
     const bigBuffer = Buffer.alloc(26 * 1024 * 1024, 0);
     const form = buildFormData(bigBuffer, 'big.png', 'image/png');
     const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
       method: 'POST',
       headers: { Authorization: `Bearer ${accessToken}` },
       body: form,
     });
     expect([400, 413]).toContain(res.status);
   }, 30000);
 
-  cloudTokenTest('ATT-6: magic-byte mismatch is rejected - text file renamed to .png', async () => {
+  test('ATT-6: magic-byte mismatch is rejected - text file renamed to .png', async () => {
+    if (!accessToken) return;
+
     const textContent = Buffer.from('This is not a PNG file\n');
     const form = buildFormData(textContent, 'fake.png', 'image/png');
     const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
       method: 'POST',
       headers: { Authorization: `Bearer ${accessToken}` },
       body: form,
     });
     expect(res.status).toBe(400);
     const body = (await res.json()) as { error?: string };
     expect(body.error).toBeTruthy();
   });
 });
 
 localOnlyDescribe('Attachments (local-only)', () => {
   let accessToken: string;
 
   beforeAll(async () => {
     const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
     accessToken = tokens.accessToken;
   });
 
   function buildFormData(content: Buffer | string, filename: string, mimeType: string): FormData {
     const form = new FormData();
     const blobContent = typeof content === 'string' ? content : new Uint8Array(content);
     const blob = new Blob([blobContent], { type: mimeType });
     form.append('file', blob, filename);
     return form;
   }
 
   function minimalPng(): Buffer {
     // 1x1 transparent PNG (67 bytes)
     return Buffer.from(
       '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
       'hex',
     );
   }
 
   test('ATT-1: authenticated user can upload a valid PNG image', async () => {
     const form = buildFormData(minimalPng(), 'test.png', 'image/png');
     const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
diff --git a/tests/integration/env.ts b/tests/integration/env.ts
index c4a330b..4b09c0e 100644
--- a/tests/integration/env.ts
+++ b/tests/integration/env.ts
@@ -13,91 +13,80 @@ export type TestTarget = 'local' | 'cloud';
 const raw = (process.env.TEST_TARGET ?? 'local').toLowerCase();
 if (raw !== 'local' && raw !== 'cloud') {
   throw new Error(`TEST_TARGET must be "local" or "cloud", got "${raw}"`);
 }
 
 export const TARGET: TestTarget = raw as TestTarget;
 export const isLocal = TARGET === 'local';
 export const isCloud = TARGET === 'cloud';
 
 export const BACKEND_URL = (
   process.env.BACKEND_URL ?? (isCloud ? 'https://api.harmony.chat' : 'http://localhost:4000')
 ).replace(/\/$/, '');
 
 export const FRONTEND_URL = (
   process.env.FRONTEND_URL ?? (isCloud ? 'https://harmony.chat' : 'http://localhost:3000')
 ).replace(/\/$/, '');
 
 /**
  * Returns true when the current test should be skipped in cloud mode.
  * Usage: test.skipIf(cloudOnly())('...', ...) or check at the top of a test.
  */
 export const cloudOnly = (): boolean => isCloud;
 
 /**
  * Convenience wrapper: wraps a describe block so all tests inside skip in cloud mode.
  * Pass the classification label as documentation.
  */
 export const localOnlyDescribe = (label: string, fn: () => void): void => {
   const wrapper = isCloud ? describe.skip : describe;
   wrapper(`[local-only] ${label}`, fn);
 };
 
 /**
  * Convenience wrapper: wraps a test so it skips in cloud mode.
  */
 export const localOnlyTest = (name: string, fn: jest.ProvidesCallback, timeout?: number): void => {
   const wrapper = isCloud ? test.skip : test;
   wrapper(name, fn, timeout);
 };
 
-/**
- * Convenience wrapper: wraps a test so it skips when running in cloud mode
- * without a CLOUD_TEST_ACCESS_TOKEN. Keeps the test active in local mode
- * (where login() always provides a token) and in cloud mode when the token
- * is provisioned.
- */
-export const cloudTokenTest = (name: string, fn: jest.ProvidesCallback, timeout?: number): void => {
-  const needsSkip = isCloud && !process.env.CLOUD_TEST_ACCESS_TOKEN;
-  (needsSkip ? test.skip : test)(name, fn, timeout);
-};
-
 // Known mock-seed data used by local tests (harmony-backend/src/dev/mock-seed-data.json).
 // Server server-001 is "harmony-hq".
 export const LOCAL_SEEDS = {
   server: {
     slug: 'harmony-hq',
   },
   channels: {
     publicIndexable: 'general', // visibility=PUBLIC_INDEXABLE
     publicNoIndex: 'introductions', // visibility=PUBLIC_NO_INDEX
     private: 'staff-only', // visibility=PRIVATE
   },
   alice: {
     email: 'alice_admin@mock.harmony.test',
     password: 'HarmonyAdmin123!',
   },
 } as const;
 
 // Known cloud URLs used by cloud smoke tests. Explicit env vars still win, but
 // automated CI should not depend on a hard-coded production slug pair that can
 // drift as deployed data changes.
 export const CLOUD_KNOWN = {
   serverSlug: process.env.CLOUD_TEST_SERVER_SLUG ?? 'harmony-hq',
   publicChannel: process.env.CLOUD_TEST_PUBLIC_CHANNEL ?? 'general',
 } as const;
 
 export type CloudFixture = {
   serverId?: string;
   serverSlug: string;
   publicChannel: string;
 };
 
 let cloudFixturePromise: Promise<CloudFixture> | null = null;
 
 async function resolveCloudFixtureFromPublicApi(): Promise<CloudFixture> {
   const serversRes = await fetch(`${BACKEND_URL}/api/public/servers`);
   if (!serversRes.ok) {
     throw new Error(
       `Cloud fixture discovery failed: GET /api/public/servers returned ${serversRes.status}`,
     );
   }
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:28:59.732Z

There’s drift between the local `origin/main` snapshot and the actual PR metadata, so I’m refreshing refs before I finalize any findings. I don’t want to flag unrelated changes that are already on current `main`.

#### Tool: exec_command

```sh
git fetch origin main
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            main       -> FETCH_HEAD
```

#### Tool: exec_command

```sh
gh pr diff 443 --repo CS485-Harmony/Harmony --name-only
```

Output:

```text
harmony-backend/src/services/metaTag/descriptionGenerator.ts
harmony-backend/src/services/metaTag/metaTagCache.ts
harmony-backend/src/services/metaTag/metaTagService.ts
harmony-backend/src/services/metaTag/openGraphGenerator.ts
harmony-backend/src/services/metaTag/structuredDataGenerator.ts
harmony-backend/src/services/metaTag/titleGenerator.ts
harmony-backend/src/services/metaTag/types.ts
harmony-backend/tests/metaTagService.test.ts
llm-logs/2026-04-20-094302-session-ce430386.md
llm-logs/2026-04-20-122835-session-b13d715d.md
```

#### Tool: exec_command

```sh
gh pr diff 443 --repo CS485-Harmony/Harmony --patch
```

Output:

````text
Total output lines: 3170

From e8875f5e9ef5220b017e4b2e855d8d576a8a0713 Mon Sep 17 00:00:00 2001
From: Avanish Kulkarni <55012494+AvanishKulkarni@users.noreply.github.com>
Date: Mon, 20 Apr 2026 09:39:37 -0400
Subject: [PATCH 1/6] feat(seo): implement M2 meta tag generation service
 skeleton (issue #350)
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit

Adds CL-C2.1–C2.6 per dev spec §3/§4:
- MetaTagService facade with generateMetaTags, getOrGenerateCached,
  invalidateCache, and stub scheduleRegeneration/getRegenerationJobStatus
- TitleGenerator enforcing ≤60 char limit with sanitization and templates
- DescriptionGenerator enforcing 50–160 char range with key phrase extraction
- OpenGraphGenerator and StructuredDataGenerator (skeleton implementations)
- MetaTagCache backed by Redis via existing cacheService + CacheKeys.metaChannel
- AC-9: fallback tags with needsRegeneration=true on generation failure
- 28 unit tests covering AC-2 length limits, sanitization, cache, and fallback

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
---
 .../services/metaTag/descriptionGenerator.ts  |  52 ++++
 .../src/services/metaTag/metaTagCache.ts      |  22 ++
 .../src/services/metaTag/metaTagService.ts    |  95 +++++++
 .../services/metaTag/openGraphGenerator.ts    |  35 +++
 .../metaTag/structuredDataGenerator.ts        |  60 ++++
 .../src/services/metaTag/titleGenerator.ts    |  49 ++++
 harmony-backend/src/services/metaTag/types.ts |  71 +++++
 harmony-backend/tests/metaTagService.test.ts  | 257 ++++++++++++++++++
 8 files changed, 641 insertions(+)
 create mode 100644 harmony-backend/src/services/metaTag/descriptionGenerator.ts
 create mode 100644 harmony-backend/src/services/metaTag/metaTagCache.ts
 create mode 100644 harmony-backend/src/services/metaTag/metaTagService.ts
 create mode 100644 harmony-backend/src/services/metaTag/openGraphGenerator.ts
 create mode 100644 harmony-backend/src/services/metaTag/structuredDataGenerator.ts
 create mode 100644 harmony-backend/src/services/metaTag/titleGenerator.ts
 create mode 100644 harmony-backend/src/services/metaTag/types.ts
 create mode 100644 harmony-backend/tests/metaTagService.test.ts

diff --git a/harmony-backend/src/services/metaTag/descriptionGenerator.ts b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
new file mode 100644
index 00000000..30bf3ae8
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
@@ -0,0 +1,52 @@
+// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
+import type { MessageContext, ChannelContext } from './types';
+
+const MAX_LENGTH = 160;
+const MIN_LENGTH = 50;
+
+export const DescriptionGenerator = {
+  maxLength: MAX_LENGTH,
+  minLength: MIN_LENGTH,
+
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
+    const summary = this.summarizeThread(messages, channel);
+    return this.enforceLength(summary);
+  },
+
+  extractKeyPhrases(messages: MessageContext[]): string[] {
+    const combined = messages.map((m) => m.content).join(' ');
+    const words = combined
+      .toLowerCase()
+      .replace(/<[^>]*>/g, '')
+      .replace(/[^a-z0-9\s]/g, ' ')
+      .split(/\s+/)
+      .filter((w) => w.length > 3);
+
+    const freq = new Map<string, number>();
+    for (const word of words) {
+      freq.set(word, (freq.get(word) ?? 0) + 1);
+    }
+
+    return [...freq.entries()]
+      .sort((a, b) => b[1] - a[1])
+      .slice(0, 5)
+      .map(([word]) => word);
+  },
+
+  summarizeThread(messages: MessageContext[], channel: ChannelContext): string {
+    if (messages.length === 0) {
+      const base = `Discussions in #${channel.name} on ${channel.serverName}.`;
+      return this.enforceLength(base);
+    }
+    const first = messages[0].content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
+    const prefix = `${channel.serverName} › #${channel.name}: `;
+    return this.enforceLength(prefix + first);
+  },
+
+  enforceLength(text: string): string {
+    if (text.length > MAX_LENGTH) {
+      return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+    }
+    return text;
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/metaTagCache.ts b/harmony-backend/src/services/metaTag/metaTagCache.ts
new file mode 100644
index 00000000..6205999f
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagCache.ts
@@ -0,0 +1,22 @@
+// CL-C2.6 MetaTagCache — Redis-backed cache for generated meta tags (D7.1)
+import { cacheService, CacheKeys } from '../cache.service';
+import type { MetaTagSet } from './types';
+
+const DEFAULT_TTL = 3600; // seconds, per spec D7.1
+
+export const MetaTagCache = {
+  ttl: DEFAULT_TTL,
+
+  async get(channelId: string): Promise<MetaTagSet | null> {
+    const entry = await cacheService.get<MetaTagSet>(CacheKeys.metaChannel(channelId));
+    return entry?.data ?? null;
+  },
+
+  async set(channelId: string, tags: MetaTagSet, ttl: number = DEFAULT_TTL): Promise<void> {
+    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl });
+  },
+
+  async invalidate(channelId: string): Promise<void> {
+    await cacheService.invalidate(CacheKeys.metaChannel(channelId));
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/metaTagService.ts b/harmony-backend/src/services/metaTag/metaTagService.ts
new file mode 100644
index 00000000..f690baf1
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagService.ts
@@ -0,0 +1,95 @@
+// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
+import { TitleGenerator } from './titleGenerator';
+import { DescriptionGenerator } from './descriptionGenerator';
+import { OpenGraphGenerator } from './openGraphGenerator';
+import { StructuredDataGenerator } from './structuredDataGenerator';
+import { MetaTagCache } from './metaTagCache';
+import type { MetaTagSet, ChannelContext, MessageContext } from './types';
+import { createLogger } from '../../lib/logger';
+
+const logger = createLogger({ component: 'meta-tag-service' });
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+function buildFallbackTags(channel: ChannelContext): MetaTagSet {
+  const title = `${channel.name} — ${channel.serverName}`;
+  const description = `Discussions in #${channel.name} on ${channel.serverName}.`;
+  return {
+    title: TitleGenerator.truncateWithEllipsis(title),
+    description: DescriptionGenerator.enforceLength(description),
+    canonical: channel.canonicalUrl,
+    robots: 'index, follow',
+    openGraph: OpenGraphGenerator.generateOGTags(channel, title, description),
+    twitter: OpenGraphGenerator.generateTwitterCard(title, description),
+    structuredData: StructuredDataGenerator.generateDiscussionForum(channel, title, description),
+    keywords: [],
+    needsRegeneration: true,
+  };
+}
+
+export const metaTagService = {
+  async generateMetaTags(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
+    try {
+      const title = TitleGenerator.generateFromThread(messages, channel);
+      const description = DescriptionGenerator.generateFromMessages(messages, channel);
+      const og = OpenGraphGenerator.generateOGTags(channel, title, description);
+      const twitter = OpenGraphGenerator.generateTwitterCard(title, description, og.ogImage);
+      const structuredData = StructuredDataGenerator.generateDiscussionForum(
+        channel,
+        title,
+        description,
+      );
+      const keywords = DescriptionGenerator.extractKeyPhrases(messages);
+
+      return {
+        title,
+        description,
+        canonical: channel.canonicalUrl,
+        robots: 'index, follow',
+        openGraph: og,
+        twitter,
+        structuredData,
+        keywords,
+        needsRegeneration: false,
+      };
+    } catch (err) {
+      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
+      return buildFallbackTags(channel);
+    }
+  },
+
+  async getOrGenerateCached(
+    channel: ChannelContext,
+    messages: MessageContext[],
+    ttl?: number,
+  ): Promise<MetaTagSet> {
+    const cached = await MetaTagCache.get(channel.id);
+    if (cached) return cached;
+
+    const tags = await this.generateMetaTags(channel, messages);
+    await MetaTagCache.set(channel.id, tags, ttl);
+    return tags;
+  },
+
+  async invalidateCache(channelId: string): Promise<void> {
+    await MetaTagCache.invalidate(channelId);
+  },
+
+  // scheduleRegeneration and getRegenerationJobStatus are stubs —
+  // full implementation depends on M4 (worker/queue) from issue #356
+  async scheduleRegeneration(_channelId: string): Promise<void> {
+    // Queuing logic wired by M4 MetaTagUpdateWorker
+  },
+
+  async getRegenerationJobStatus(_channelId: string): Promise<{ status: string } | null> {
+    return null;
+  },
+
+  async getMetaTagsForPreview(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
+    return this.generateMetaTags(channel, messages);
+  },
+
+  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
+    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/openGraphGenerator.ts b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
new file mode 100644
index 00000000..163c6552
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
@@ -0,0 +1,35 @@
+// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
+import type { ChannelContext, OpenGraphTags, TwitterCardTags } from './types';
+
+const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
+const SITE_NAME = 'Harmony';
+const TWITTER_SITE = '@harmonychat';
+
+export const OpenGraphGenerator = {
+  defaultImage: DEFAULT_IMAGE,
+
+  generateOGTags(channel: ChannelContext, title: string, description: string): OpenGraphTags {
+    return {
+      ogTitle: title,
+      ogDescription: description,
+      ogImage: this.selectPreviewImage(channel),
+      ogType: 'website',
+      ogUrl: channel.canonicalUrl,
+      ogSiteName: SITE_NAME,
+    };
+  },
+
+  generateTwitterCard(title: string, description: string, image?: string): TwitterCardTags {
+    return {
+      card: 'summary_large_image',
+      title,
+      description,
+      image: image ?? DEFAULT_IMAGE,
+      site: TWITTER_SITE,
+    };
+  },
+
+  selectPreviewImage(_channel: ChannelContext): string {
+    return DEFAULT_IMAGE;
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
new file mode 100644
index 00000000..4b2b9eff
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
@@ -0,0 +1,60 @@
+// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
+import type { ChannelContext, StructuredData } from './types';
+
+export const StructuredDataGenerator = {
+  generateDiscussionForum(channel: ChannelContext, title: string, description: string): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'DiscussionForumPosting',
+      headline: title,
+      description,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+
+  generateBreadcrumbList(channel: ChannelContext): object {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'BreadcrumbList',
+      itemListElement: [
+        {
+          '@type': 'ListItem',
+          position: 1,
+          name: channel.serverName,
+          item: `https://harmony.chat/s/${channel.serverSlug}`,
+        },
+        {
+          '@type': 'ListItem',
+          position: 2,
+          name: channel.name,
+          item: channel.canonicalUrl,
+        },
+      ],
+    };
+  },
+
+  generateOrganization(): object {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'Organization',
+      name: 'Harmony',
+      url: 'https://harmony.chat',
+    };
+  },
+
+  generateWebPage(channel: ChannelContext, title: string, description: string): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'WebPage',
+      headline: title,
+      description,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/titleGenerator.ts b/harmony-backend/src/services/metaTag/titleGenerator.ts
new file mode 100644
index 00000000..e4ad895c
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/titleGenerator.ts
@@ -0,0 +1,49 @@
+// CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
+import type { ChannelContext, MessageContext } from './types';
+
+const MAX_LENGTH = 60;
+
+const CHANNEL_TEMPLATE = '{channelName} — {serverName}';
+
+export const TitleGenerator = {
+  maxLength: MAX_LENGTH,
+
+  generateFromChannel(channel: ChannelContext): string {
+    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(
+      '{serverName}',
+      channel.serverName,
+    );
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string {
+    const raw = `${this.sanitizeForTitle(message.content)} — ${channel.serverName}`;
+    return this.truncateWithEllipsis(raw);
+  },
+
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string {
+    if (messages.length === 0) {
+      return this.generateFromChannel(channel);
+    }
+    return this.generateFromMessage(messages[0], channel);
+  },
+
+  truncateWithEllipsis(text: string): string {
+    if (text.length <= MAX_LENGTH) return text;
+    return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+  },
+
+  sanitizeForTitle(text: string): string {
+    return text
+      .replace(/<[^>]*>/g, '')
+      .replace(/\s+/g, ' ')
+      .trim();
+  },
+
+  applyTemplate(template: string, vars: Record<string, string>): string {
+    return Object.entries(vars).reduce(
+      (result, [key, value]) => result.replace(`{${key}}`, value),
+      template,
+    );
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/types.ts b/harmony-backend/src/services/metaTag/types.ts
new file mode 100644
index 00000000..5365afca
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/types.ts
@@ -0,0 +1,71 @@
+// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)
+
+export interface OpenGraphTags {
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  ogType: string;
+  ogUrl: string;
+  ogSiteName: string;
+}
+
+export interface TwitterCardTags {
+  card: string;
+  title: string;
+  description: string;
+  image: string;
+  site: string;
+}
+
+export interface StructuredData {
+  '@context': string;
+  '@type': string;
+  headline: string;
+  description: string;
+  author?: object;
+  datePublished?: string;
+  dateModified?: string;
+  mainEntity?: object;
+  breadcrumb?: object;
+}
+
+export interface MetaTagSet {
+  title: string;
+  description: string;
+  canonical: string;
+  robots: string;
+  openGraph: OpenGraphTags;
+  twitter: TwitterCardTags;
+  structuredData: StructuredData;
+  keywords: string[];
+  needsRegeneration?: boolean;
+}
+
+export interface ContentAnalysis {
+  keywords: string[];
+  topics: string[];
+  summary: string;
+  sentiment: string;
+  readingLevel: string;
+}
+
+export interface IMetaTagGenerator {
+  generate(): MetaTagSet;
+  validate(): boolean;
+}
+
+export interface ChannelContext {
+  id: string;
+  name: string;
+  slug: string;
+  topic?: string | null;
+  serverName: string;
+  serverSlug: string;
+  canonicalUrl: string;
+}
+
+export interface MessageContext {
+  content: string;
+  createdAt: Date;
+  authorDisplayName?: string;
+}
diff --git a/harmony-backend/tests/metaTagService.test.ts b/harmony-backend/tests/metaTagService.test.ts
new file mode 100644
index 00000000..726853a6
--- /dev/null
+++ b/harmony-backend/tests/metaTagService.test.ts
@@ -0,0 +1,257 @@
+/**
+ * Unit tests for M2 Meta Tag Generation Service skeleton — Issue #350
+ *
+ * Covers AC-2 (length limits), sanitization, template application,
+ * and AC-9 (fallback on failure, needsRegeneration=true).
+ *
+ * MetaTagCache uses Redis via cacheService — mocked here for unit speed.
+ */
+
+jest.mock('../src/services/cache.service', () => ({
+  cacheService: {
+    get: jest.fn(),
+    set: jest.fn(),
+    invalidate: jest.fn(),
+    getOrRevalidate: jest.fn(),
+  },
+  CacheKeys: {
+    metaChannel: (id: string) => `meta:channel:${id}`,
+    channelVisibility: (id: string) => `channel:${id}:visibility`,
+    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
+    serverInfo: (id: string) => `server:${id}:info`,
+    analysisChannel: (id: string) => `analysis:channel:${id}`,
+  },
+  sanitizeKeySegment: (s: string) => s.replace(/[*?\[\]]/g, ''),
+}));
+
+import { TitleGenerator } from '../src/services/metaTag/titleGenerator';
+import { DescriptionGenerator } from '../src/services/metaTag/descriptionGenerator';
+import { MetaTagCache } from '../src/services/metaTag/metaTagCache';
+import { metaTagService } from '../src/services/metaTag/metaTagService';
+import { cacheService } from '../src/services/cache.service';
+import type { ChannelContext, MessageContext } from '../src/services/metaTag/types';
+
+const mockCacheService = cacheService as jest.Mocked<typeof cacheService>;
+
+const channel: ChannelContext = {
+  id: 'chan-001',
+  name: 'unity-physics-help',
+  slug: 'unity-physics-help',
+  topic: 'Ask about Unity physics',
+  serverName: 'Game Dev Hub',
+  serverSlug: 'game-dev-hub',
+  canonicalUrl: 'https://harmony.chat/c/game-dev-hub/unity-physics-help',
+};
+
+const messages: MessageContext[] = [
+  { content: 'How do I handle collision detection in Unity?', createdAt: new Date() },
+  { content: 'Use OnCollisionEnter for physics-based collisions.', createdAt: new Date() },
+];
+
+beforeEach(() => {
+  jest.clearAllMocks();
+});
+
+// ─── TitleGenerator ──────────────────────────────────────────────────────────
+
+describe('TitleGenerator', () => {
+  it('maxLength is 60', () => {
+    expect(TitleGenerator.maxLength).toBe(60);
+  });
+
+  it('generateFromChannel produces title ≤60 chars', () => {
+    const title = TitleGenerator.generateFromChannel(channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+  });
+
+  it('truncates long titles with ellipsis and stays ≤60 chars', () => {
+    const longChannel: ChannelContext = {
+      ...channel,
+      name: 'this-is-a-very-long-channel-name-that-exceeds-limits',
+      serverName: 'An Extremely Long Server Name That Will Overflow',
+    };
+    const title = TitleGenerator.generateFromChannel(longChannel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title.endsWith('…')).toBe(true);
+  });
+
+  it('sanitizeForTitle strips HTML tags', () => {
+    const result = TitleGenerator.sanitizeForTitle('<b>Hello</b> <em>world</em>');
+    expect(result).toBe('Hello world');
+  });
+
+  it('sanitizeForTitle collapses whitespace', () => {
+    const result = TitleGenerator.sanitizeForTitle('foo   bar\n  baz');
+    expect(result).toBe('foo bar baz');
+  });
+
+  it('applyTemplate replaces template variables', () => {
+    const result = TitleGenerator.applyTemplate('{channelName} on {serverName}', {
+      channelName: 'general',
+      serverName: 'My Server',
+    });
+    expect(result).toBe('general on My Server');
+  });
+
+  it('generateFromThread falls back to channel when no messages', () => {
+    const title = TitleGenerator.generateFromThread([], channel);
+    expect(title).toBe(TitleGenerator.generateFromChannel(channel));
+  });
+
+  it('generateFromMessage uses first message content', () => {
+    const title = TitleGenerator.generateFromMessage(messages[0], channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title).toContain('Game Dev Hub');
+  });
+});
+
+// ─── DescriptionGenerator ───────────────────────────────────────────────────
+
+describe('DescriptionGenerator', () => {
+  it('maxLength is 160', () => {
+    expect(DescriptionGenerator.maxLength).toBe(160);
+  });
+
+  it('minLength is 50', () => {
+    expect(DescriptionGenerator.minLength).toBe(50);
+  });
+
+  it('generateFromMessages produces description 50-160 chars', () => {
+    const desc = DescriptionGenerator.generateFromMessages(messages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('truncates long descriptions to ≤160 chars with ellipsis', () => {
+    const longMessages: MessageContext[] = [
+      {
+        content: 'A'.repeat(200),
+        createdAt: new Date(),
+      },
+    ];
+    const desc = DescriptionGenerator.generateFromMessages(longMessages, channel);
+    expect(desc.length).toBeLessThanOrEqual(160);
+    expect(desc.endsWith('…')).toBe(true);
+  });
+
+  it('returns text unchanged when within valid range', () => {
+    const valid = 'A'.repeat(80);
+    expect(DescriptionGenerator.enforceLength(valid)).toBe(valid);
+  });
+
+  it('extractKeyPhrases returns non-empty array for non-empty messages', () => {
+    const phrases = DescriptionGenerator.extractKeyPhrases(messages);
+    expect(Array.isArray(phrases)).toBe(true);
+    expect(phrases.length).toBeGreaterThan(0);
+  });
+
+  it('summarizeThread falls back to channel description when no messages', () => {
+    const summary = DescriptionGenerator.summarizeThread([], channel);
+    expect(summary).toContain(channel.name);
+    expect(summary.length).toBeGreaterThanOrEqual(50);
+    expect(summary.length).toBeLessThanOrEqual(160);
+  });
+});
+
+// ─── MetaTagCache ────────────────────────────────────────────────────────────
+
+describe('MetaTagCache', () => {
+  it('ttl defaults to 3600', () => {
+    expect(MetaTagCache.ttl).toBe(3600);
+  });
+
+  it('get returns null on cache miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toBeNull();
+    expect(mockCacheService.get).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('get returns cached data on hit', async () => {
+    const fakeSet = { title: 'Cached Title' } as never;
+    mockCacheService.get.mockResolvedValue({ data: fakeSet, createdAt: Date.now() });
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toEqual(fakeSet);
+  });
+
+  it('set calls cacheService.set with correct key and ttl', async () => {
+    mockCacheService.set.mockResolvedValue(undefined);
+    const tags = { title: 'T' } as never;
+    await MetaTagCache.set('chan-001', tags, 1800);
+    expect(mockCacheService.set).toHaveBeenCalledWith(
+      'meta:channel:chan-001',
+      tags,
+      { ttl: 1800 },
+    );
+  });
+
+  it('invalidate calls cacheService.invalidate with correct key', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await MetaTagCache.invalidate('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+});
+
+// ─── MetaTagService ──────────────────────────────────────────────────────────
+
+describe('metaTagService', () => {
+  it('generateMetaTags returns valid MetaTagSet', async () => {
+    const tags = await metaTagService.generateMetaTags(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(tags.title.length).toBeLessThanOrEqual(60);
+    expect(tags.description.length).toBeGreaterThanOrEqual(50);
+    expect(tags.description.length).toBeLessThanOrEqual(160);
+    expect(tags.canonical).toBe(channel.canonicalUrl);
+    expect(tags.needsRegeneration).toBe(false);
+  });
+
+  it('generateMetaTags sets robots to index, follow', async () => {
+    const tags = await metaTagService.generateMetaTags(channel, messages);
+    expect(tags.robots).toBe('index, follow');
+  });
+
+  it('generateMetaTags includes openGraph and twitter tags', async () => {
+    const tags = await metaTagService.generateMetaTags(channel, messages);
+    expect(tags.openGraph.ogTitle).toBeDefined();
+    expect(tags.twitter.card).toBeDefined();
+  });
+
+  it('AC-9: returns fallback with needsRegeneration=true on generation error', async () => {
+    const spy = jest
+      .spyOn(TitleGenerator, 'generateFromThread')
+      .mockImplementation(() => { throw new Error('NLP timeout'); });
+    const tags = await metaTagService.generateMetaTags(channel, messages);
+    spy.mockRestore();
+    expect(tags.needsRegeneration).toBe(true);
+    expect(tags.title.length).toBeGreaterThan(0);
+  });
+
+  it('getOrGenerateCached returns cache hit without regenerating', async () => {
+    const cachedTags = { title: 'Cached', needsRegeneration: false } as never;
+    mockCacheService.get.mockResolvedValue({ data: cachedTags, createdAt: Date.now() });
+
+    const tags = await metaTagService.getOrGenerateCached(channel, messages);
+    expect(tags).toEqual(cachedTags);
+    expect(mockCacheService.set).not.toHaveBeenCalled();
+  });
+
+  it('getOrGenerateCached generates and caches on miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    mockCacheService.set.mockResolvedValue(undefined);
+
+    const tags = await metaTagService.getOrGenerateCached(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(mockCacheService.set).toHaveBeenCalled();
+  });
+
+  it('invalidateCache delegates to MetaTagCache.invalidate', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await metaTagService.invalidateCache('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('buildCanonicalUrl constructs correct path', () => {
+    const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
+    expect(url).toContain('/c/game-dev-hub/unity-physics-help');
+  });
+});

From 898f94332cbe35434ecf4661c778ccb07927f1f0 Mon Sep 17 00:00:00 2001
From: Avanish Kulkarni <55012494+AvanishKulkarni@users.noreply.github.com>
Date: Mon, 20 Apr 2026 09:42:00 -0400
Subject: [PATCH 2/6] fix(seo): enforce 50-char minimum on auto-generated
 descriptions (AC-2)

Extends summarizeThread to append channel context when the composed
text falls below the 50-char minimum, satisfying AC-2 for all inputs
including single-word messages. Adds a regression test.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
---
 .../src/services/metaTag/descriptionGenerator.ts    | 13 +++++++++++--
 harmony-backend/tests/metaTagService.test.ts        |  7 +++++++
 2 files changed, 18 insertions(+), 2 deletions(-)

diff --git a/harmony-backend/src/services/metaTag/descriptionGenerator.ts b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
index 30bf3ae8..b2d14184 100644
--- a/harmony-backend/src/services/metaTag/descriptionGenerator.ts
+++ b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
@@ -34,13 +34,22 @@ export const DescriptionGenerator = {
   },
 
   summarizeThread(messages: MessageContext[], channel: ChannelContext): string {
+    const suffix = ` — Join the discussion on ${channel.serverName}.`;
+
     if (messages.length === 0) {
-      const base = `Discussions in #${channel.name} on ${channel.serverName}.`;
+      const base = `Discussions in #${channel.name} on ${channel.serverName}. Join today.`;
       return this.enforceLength(base);
     }
+
     const first = messages[0].content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
     const prefix = `${channel.serverName} › #${channel.name}: `;
-    return this.enforceLength(prefix + first);
+    let text = prefix + first;
+
+    if (text.length < MIN_LENGTH) {
+      text = text + suffix;
+    }
+
+    return this.enforceLength(text);
   },
 
   enforceLength(text: string): string {
diff --git a/harmony-backend/tests/metaTagService.test.ts b/harmony-backend/tests/metaTagService.test.ts
index 726853a6..18e0cfa6 100644
--- a/harmony-backend/tests/metaTagService.test.ts
+++ b/harmony-backend/tests/metaTagService.test.ts
@@ -139,6 +139,13 @@ describe('DescriptionGenerator', () => {
     expect(DescriptionGenerator.enforceLength(valid)).toBe(valid);
   });
 
+  it('AC-2: generateFromMessages produces ≥50 chars even for a very short message', () => {
+    const shortMessages: MessageContext[] = [{ content: 'hi', createdAt: new Date() }];
+    const desc = DescriptionGenerator.generateFromMessages(shortMessages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
   it('extractKeyPhrases returns non-empty array for non-empty messages', () => {
     const phrases = DescriptionGenerator.extractKeyPhrases(messages);
     expect(Array.isArray(phrases)).toBe(true);

From 94fa035019a4c79638d269724697d5433e7563bc Mon Sep 17 00:00:00 2001
From: Avanish Kulkarni <55012494+AvanishKulkarni@users.noreply.github.com>
Date: Mon, 20 Apr 2026 09:43:04 -0400
Subject: [PATCH 3/6] chore: add llm logs

---
 .../2026-04-20-094302-session-ce430386.md     | 784 ++++++++++++++++++
 1 file changed, 784 insertions(+)
 create mode 100644 llm-logs/2026-04-20-094302-session-ce430386.md

diff --git a/llm-logs/2026-04-20-094302-session-ce430386.md b/llm-logs/2026-04-20-094302-session-ce430386.md
new file mode 100644
index 00000000..f84131df
--- /dev/null
+++ b/llm-logs/2026-04-20-094302-session-ce430386.md
@@ -0,0 +1,784 @@
+# Session Log 2026-04-20-094302
+
+## User
+
+complete https://github.com/CS485-Harmony/Harmony/issues/350 in a new branch
+
+## Assistant
+
+**Tool call: `ToolSearch`**
+```json
+{
+  "query": "select:WebFetch",
+  "max_results": 1
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "gh issue view 350 --repo CS485-Harmony/Harmony"
+}
+```
+
+## Assistant
+
+Let me read the relevant dev spec and check the blocking issue status.
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "gh issue view 331 --repo CS485-Harmony/Harmony --json state,title"
+}
+```
+
+## Assistant
+
+**Tool call: `Glob`**
+```json
+{
+  "pattern": "docs/**/*seo*"
+}
+```
+
+## Assistant
+
+**Tool call: `Glob`**
+```json
+{
+  "pattern": "docs/**/*meta*"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/docs/dev-spec-seo-meta-tag-generation.md"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/docs/dev-spec-seo-meta-tag-generation.md",
+  "limit": 300
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/docs/dev-spec-seo-meta-tag-generation.md",
+  "offset": 300,
+  "limit": 400
+}
+```
+
+## Assistant
+
+Let me now look at the backend structure to understand the file layout.
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/docs/dev-spec-seo-meta-tag-generation.md",
+  "offset": 700,
+  "limit": 300
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/ && ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/repositories/ && ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests/"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/repositories/metaTag.repository.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/cache.service.ts | head -60"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/ | grep -i seo; ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/ | grep -i meta; ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests/ | grep -i seo; ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests/ | grep -i meta"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests/seo.router.test.ts | head -60"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/indexing.service.ts | head -100"
+}
+```
+
+## Assistant
+
+Let me also check the existing tests for the meta tag repository and check if any SEO-related services already exist.
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests/metaTag.repository.test.ts | head -80"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "ls /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/ | sort"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "grep -A5 \"GeneratedMetaTags\" /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/prisma/schema.prisma | head -50"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/cache.service.ts | grep -A10 \"getOrRevalidate\""
+}
+```
+
+## Assistant
+
+Now let me create the branch, set up the todo, post the opening comment, then implement.
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "git checkout -b feature/issue-350-meta-tag-service-skeleton"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests/cache.service.test.ts | head -60"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/visibility.service.ts | head -50"
+}
+```
+
+## Assistant
+
+Now I have enough context. Let me write the todo file and then implement.
+
+## Assistant
+
+**Tool call: `Write`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/tasks/todo.md",
+  "content": "# Issue #350: Meta Tag Generation Service Skeleton (M2)\n\n## Tasks\n- [x] Create feature branch\n- [ ] Implement DTOs: MetaTagSet, OpenGraphTags, TwitterCardTags, StructuredData, ContentAnalysis\n- [ ] Implement IMetaTagGenerator interface\n- [ ] Implement TitleGenerator (CL-C2.2) \u2014 enforces \u226460 char limit\n- [ ] Implement DescriptionGenerator (CL-C2.3) \u2014 enforces 50-160 char range\n- [ ] Implement OpenGraphGenerator (CL-C2.4) \u2014 stub\n- [ ] Implement StructuredDataGenerator (CL-C2.5) \u2014 stub\n- [ ] Implement MetaTagCache (CL-C2.6) \u2014 Redis-backed via cacheService\n- [ ] Implement MetaTagService (CL-C2.1) \u2014 facade with fallback/needsRegeneration\n- [ ] Write unit tests for TitleGenerator, DescriptionGenerator, MetaTagCache, fallback behavior\n- [ ] Run tests and confirm passing\n- [ ] Post opening comment on issue\n- [ ] Commit and push\n\n## Review\nTBD\n"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "ls /Users/bigfa/Documents/GitHub/Harmony/tasks/ 2>/dev/null || echo \"no tasks dir\""
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/tasks/todo.md",
+  "limit": 5
+}
+```
+
+## Assistant
+
+**Tool call: `Write`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/tasks/todo.md",
+  "content": "# Issue #350: Meta Tag Generation Service Skeleton (M2)\n\nGitHub Issue: https://github.com/CS485-Harmony/Harmony/issues/350\nBranch: `feature/issue-350-meta-tag-service-skeleton`\n\n## Tasks\n- [x] Create feature branch\n- [ ] Implement DTOs and IMetaTagGenerator interface\n- [ ] Implement TitleGenerator (CL-C2.2) \u2014 enforces \u226460 char limit\n- [ ] Implement DescriptionGenerator (CL-C2.3) \u2014 enforces 50-160 char range\n- [ ] Implement OpenGraphGenerator (CL-C2.4) \u2014 stub\n- [ ] Implement StructuredDataGenerator (CL-C2.5) \u2014 stub\n- [ ] Implement MetaTagCache (CL-C2.6) \u2014 Redis-backed via cacheService\n- [ ] Implement MetaTagService (CL-C2.1) \u2014 facade with fallback/needsRegeneration\n- [ ] Write unit tests\n- [ ] Run tests and confirm passing\n- [ ] Commit and push\n\n## Review\nTBD\n"
+}
+```
+
+## Assistant
+
+Now let me implement the service files. I'll start with the types/DTOs and the generators:
+
+## Assistant
+
+**Tool call: `Write`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/types.ts",
+  "content": "// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)\n\nexport interface OpenGraphTags {\n  ogTitle: string;\n  ogDescription: string;\n  ogImage: string;\n  ogType: string;\n  ogUrl: string;\n  ogSiteName: string;\n}\n\nexport interface TwitterCardTags {\n  card: string;\n  title: string;\n  description: string;\n  image: string;\n  site: string;\n}\n\nexport interface StructuredData {\n  '@context': string;\n  '@type': string;\n  headline: string;\n  description: string;\n  author?: object;\n  datePublished?: string;\n  dateModified?: string;\n  mainEntity?: object;\n  breadcrumb?: object;\n}\n\nexport interface MetaTagSet {\n  title: string;\n  description: string;\n  canonical: string;\n  robots: string;\n  openGraph: OpenGraphTags;\n  twitter: TwitterCardTags;\n  structuredData: StructuredData;\n  keywords: string[];\n  needsRegeneration?: boolean;\n}\n\nexport interface ContentAnalysis {\n  keywords: string[];\n  topics: string[];\n  summary: string;\n  sentiment: string;\n  readingLevel: string;\n}\n\nexport interface IMetaTagGenerator {\n  generate(): MetaTagSet;\n  validate(): boolean;\n}\n\nexport interface ChannelContext {\n  id: string;\n  name: string;\n  slug: string;\n  topic?: string | null;\n  serverName: string;\n  serverSlug: string;\n  canonicalUrl: string;\n}\n\nexport interface MessageContext {\n  content: string;\n  createdAt: Date;\n  authorDisplayName?: string;\n}\n"
+}
+```
+
+## Assistant
+
+**Tool call: `Write`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/titleGenerator.ts",
+  "content": "// CL-C2.2 TitleGenerator \u2014 generates SEO-optimized titles (AC-2: \u226460 chars)\nimport type { ChannelContext, MessageContext } from './types';\n\nconst MAX_LENGTH = 60;\n\nconst CHANNEL_TEMPLATE = '{channelName} \u2014 {serverName}';\n\nexport const TitleGenerator = {\n  maxLength: MAX_LENGTH,\n\n  generateFromChannel(channel: ChannelContext): string {\n    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(\n      '{serverName}',\n      channel.serverName,\n    );\n    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));\n  },\n\n  generateFromMessage(message: MessageContext, channel: ChannelContext): string {\n    const raw = `${this.sanitizeForTitle(message.content)} \u2014 ${channel.serverName}`;\n    return this.truncateWithEllipsis(raw);\n  },\n\n  generateFromThread(messages: MessageContext[], …17324 tokens truncated…{
     return DEFAULT_IMAGE;
   },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('OpenGraphGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('OpenGraphGenerator.validate() not yet implemented — wired by M4');
+  },
 };
diff --git a/harmony-backend/src/services/metaTag/titleGenerator.ts b/harmony-backend/src/services/metaTag/titleGenerator.ts
index 28607e9f..0365b11d 100644
--- a/harmony-backend/src/services/metaTag/titleGenerator.ts
+++ b/harmony-backend/src/services/metaTag/titleGenerator.ts
@@ -1,11 +1,19 @@
 // CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
-import type { ChannelContext, MessageContext } from './types';
+import type { ChannelContext, MessageContext, MetaTagSet, IMetaTagGenerator } from './types';
 
 const MAX_LENGTH = 60;
 
 const CHANNEL_TEMPLATE = '{channelName} — {serverName}';
 
-export const TitleGenerator = {
+export const TitleGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  generateFromChannel(channel: ChannelContext): string;
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string;
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string;
+  truncateWithEllipsis(text: string): string;
+  sanitizeForTitle(text: string): string;
+  applyTemplate(template: string, vars: Record<string, string>): string;
+} = {
   maxLength: MAX_LENGTH,
 
   generateFromChannel(channel: ChannelContext): string {
@@ -46,4 +54,12 @@ export const TitleGenerator = {
       template,
     );
   },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('TitleGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('TitleGenerator.validate() not yet implemented — wired by M4');
+  },
 };

From c3a7a608c10576b751659ca1926be95566392b28 Mon Sep 17 00:00:00 2001
From: Avanish Kulkarni <55012494+AvanishKulkarni@users.noreply.github.com>
Date: Mon, 20 Apr 2026 12:28:37 -0400
Subject: [PATCH 6/6] chore: add llm logs

---
 .../2026-04-20-122835-session-b13d715d.md     | 942 ++++++++++++++++++
 1 file changed, 942 insertions(+)
 create mode 100644 llm-logs/2026-04-20-122835-session-b13d715d.md

diff --git a/llm-logs/2026-04-20-122835-session-b13d715d.md b/llm-logs/2026-04-20-122835-session-b13d715d.md
new file mode 100644
index 00000000..324c0517
--- /dev/null
+++ b/llm-logs/2026-04-20-122835-session-b13d715d.md
@@ -0,0 +1,942 @@
+# Session Log 2026-04-20-122835
+
+## User
+
+<command-message>resolve-reviews</command-message>
+<command-name>/resolve-reviews</command-name>
+
+## User
+
+Base directory for this skill: /Users/bigfa/Documents/GitHub/Harmony/.claude/skills/resolve-reviews
+
+Automatically resolve all review comments (both human and bot) on the current PR. Uses a two-phase workflow: fix all existing issues, then poll for new ones until quiet.
+
+## Prerequisites
+
+All commands below use `npx agent-reviews`. If the project uses a different package manager, substitute the appropriate runner (e.g., `pnpm dlx agent-reviews` for pnpm, `yarn dlx agent-reviews` for Yarn, `bunx agent-reviews` for Bun). Honor the user's package manager preference throughout.
+
+**Cloud environments only** (e.g., Codespaces, remote agents): verify git author identity so CI checks can map commits to the user. Run `git config --global --get user.email` and if empty or a placeholder, set it manually. Skip this check in local environments.
+
+## Phase 1: FETCH & FIX (synchronous)
+
+### Step 1: Fetch All Comments (Expanded)
+
+Run `npx agent-reviews --unanswered --expanded`
+
+The CLI auto-detects the current branch, finds the associated PR, and authenticates via `gh` CLI or environment variables. If anything fails (no token, no PR, CLI not installed), it exits with a clear error message.
+
+This shows all unanswered comments (both human and bot) with full detail: complete comment body (no truncation), diff hunk (code context), and all replies. Each comment shows its ID in brackets (e.g., `[12345678]`).
+
+If zero comments are returned, print "No unanswered comments found" and skip to Phase 2.
+
+### Step 3: Process Each Unanswered Comment
+
+For each comment from the expanded output, apply the appropriate evaluation based on whether the author is a bot or a human.
+
+#### For Bot Comments
+
+Read the referenced code and determine:
+
+1. **TRUE POSITIVE** - A real bug that needs fixing
+2. **FALSE POSITIVE** - Not actually a bug (intentional behavior, bot misunderstanding)
+3. **UNCERTAIN** - Not sure; ask the user
+
+**Likely TRUE POSITIVE:**
+- Code obviously violates stated behavior
+- Missing null checks on potentially undefined values
+- Type mismatches or incorrect function signatures
+- Logic errors in conditionals
+- Missing error handling for documented failure cases
+
+**Likely FALSE POSITIVE:**
+- Bot doesn't understand the framework/library patterns
+- Code is intentionally structured that way (with comments explaining why)
+- Bot is flagging style preferences, not bugs
+- The "bug" is actually a feature or intentional behavior
+- Bot misread the code flow
+
+#### For Human Comments
+
+Read the referenced code and the reviewer's comment. Human reviewers are generally more accurate and context-aware than bots. Determine:
+
+1. **ACTIONABLE** - The reviewer identified a real issue or requested a concrete change
+2. **DISCUSSION** - The comment raises a valid point but the right approach is unclear
+3. **ALREADY ADDRESSED** - The concern has already been fixed or is no longer relevant
+
+**Likely ACTIONABLE:**
+- Reviewer points out a bug or logic error
+- Reviewer requests a specific code change
+- Reviewer identifies missing edge cases or error handling
+
+**Likely DISCUSSION -- ask the user:**
+- Reviewer suggests an architectural change you're unsure about
+- Comment involves a tradeoff (performance vs readability, etc.)
+- The feedback is subjective without team consensus
+
+#### When UNCERTAIN -- ask the user
+
+For both bot and human comments:
+- The fix would require architectural changes
+- You're genuinely unsure if the behavior is intentional
+- Multiple valid interpretations exist
+- The fix could have unintended side effects
+
+#### Act on Evaluation
+
+**If TRUE POSITIVE / ACTIONABLE:** Fix the code. Track the comment ID and a brief description of the fix.
+
+**If FALSE POSITIVE:** Do NOT change the code. Track the comment ID and the reason it's not a real bug.
+
+**If DISCUSSION:** Ask the user to consult the PR author. Apply their decision and track it.
+
+**If ALREADY ADDRESSED:** Track the comment ID and note why.
+
+**If UNCERTAIN:** Ask the user. If they say skip, track it as skipped.
+
+Do NOT reply to comments yet. Replies happen after the commit (Step 5).
+
+### Step 4: Commit and Push
+
+After evaluating and fixing ALL unanswered comments:
+
+1. Run your project's lint and type-check
+2. Stage, commit, and push:
+   ```bash
+   git add -A
+   git commit -m "fix: address PR review findings
+
+   {List of changes made, grouped by reviewer/bot}"
+   git push
+   ```
+3. Capture the commit hash from the output.
+
+### Step 5: Reply to All Comments
+
+Now that the commit hash exists, reply to every processed comment. The `--resolve` flag marks the review thread as resolved on GitHub.
+
+**For each TRUE POSITIVE / ACTIONABLE:**
+
+Run `npx agent-reviews --reply <comment_id> "Fixed in {hash}. {Brief description of the fix}" --resolve`
+
+**For each FALSE POSITIVE:**
+
+Run `npx agent-reviews --reply <comment_id> "Won't fix: {reason}. {Explanation of why this is intentional or not applicable}" --resolve`
+
+**For each DISCUSSION (after user decision):**
+
+Run `npx agent-reviews --reply <comment_id> "{Outcome}. {Explanation of the decision and any changes made}" --resolve`
+
+**For each ALREADY ADDRESSED:**
+
+Run `npx agent-reviews --reply <comment_id> "Already addressed. {Explanation of when/how this was fixed}" --resolve`
+
+**For each SKIPPED:**
+
+Run `npx agent-reviews --reply <comment_id> "Skipped per user request" --resolve`
+
+**DO NOT start Phase 2 until all replies are posted.**
+
+---
+
+## Phase 2: POLL FOR NEW COMMENTS (loop until quiet)
+
+The watcher exits immediately when new comments are found (after a 5s grace period to catch batch posts). This means you run it in a loop: start watcher, process any comments it returns, restart watcher, repeat until the watcher times out with no new comments.
+
+### Step 6: Start Watcher Loop
+
+Repeat the following until the watcher exits with no new comments:
+
+**6a.** Launch the watcher in the background:
+
+Run `npx agent-reviews --watch` as a background task.
+
+**6b.** Wait for the background command to complete (default 10 minutes; override with `--timeout`).
+
+**6c.** Check the output:
+
+- **If new comments were found** (output contains `EXITING WITH NEW COMMENTS`):
+  1. Use `--detail <id>` to read each new comment's full detail
+  2. Process them exactly as in Phase 1, Steps 3-5 (evaluate, fix, commit, push, reply)
+  3. **Go back to Step 6a** to restart the watcher
+
+- **If no new comments** (output contains `WATCH COMPLETE`):
+  Stop looping and move to the Summary Report.
+
+---
+
+## Summary Report
+
+After both phases complete, provide a summary:
+
+```text
+## PR Review Resolution Summary
+
+### Results
+- Fixed: X issues
+- Already addressed: X
+- Won't fix (false positives): X
+- Discussion resolved: X
+- Skipped per user: X
+
+### By Reviewer/Bot
+#### cursor[bot]
+- {description} - Fixed in {commit}
+- {description} - Won't fix: {reason}
+
+#### @reviewer-name
+- {description} - Fixed in {commit}
+
+### Status
+All findings addressed. Watch completed.
+```
+
+## Important Notes
+
+### Response Policy
+- **Every comment gets a response** - No silent ignores
+- For bots: responses help train them and prevent re-raised false positives
+- For humans: replies keep reviewers informed and unblock approvals
+
+### User Interaction
+- Ask the user when uncertain about a finding
+- Don't guess on architectural or business logic questions
+- It's better to ask than to make a wrong fix or wrong dismissal
+- Human reviewers often have context you don't - defer to the author when unsure
+
+### Best Practices
+- Verify findings before fixing - bots have false positives, humans rarely do
+- Keep fixes minimal and focused - don't refactor unrelated code
+- Ensure type-check and lint pass before committing
+- Group related fixes into a single commit
+- Copilot `suggestion` blocks often contain ready-to-use fixes
+- If a human reviewer suggests a specific code change, prefer their version unless it introduces issues
+
+## Assistant
+
+I'll start Phase 1 by fetching all unanswered PR review comments.
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "npx agent-reviews --unanswered --expanded 2>&1",
+  "description": "Fetch all unanswered PR review comments"
+}
+```
+
+## Assistant
+
+I have 2 human review comments with multiple issues. Let me read the relevant files before planning fixes.
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "find /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag -type f | sort",
+  "description": "List metaTag service files"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/metaTagService.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/metaTagCache.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/types.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/structuredDataGenerator.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/descriptionGenerator.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/openGraphGenerator.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/titleGenerator.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "find /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests -name \"*metaTag*\" -o -name \"*meta-tag*\" -o -name \"*meta_tag*\" 2>/dev/null | sort",
+  "description": "Find metaTag test files"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests/metaTag.repository.test.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "find /Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/repositories -name \"*metaTag*\" -o -name \"*meta-tag*\" 2>/dev/null | sort",
+  "description": "Find metaTag repository files"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "ls /Users/bigfa/Documents/GitHub/Harmony/llm-logs/ 2>/dev/null",
+  "description": "List llm-logs directory"
+}
+```
+
+## Assistant
+
+Let me check the repository and the test failure.
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/repositories/metaTag.repository.ts"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cd /Users/bigfa/Documents/GitHub/Harmony/harmony-backend && npx tsc --noEmit 2>&1 | head -50",
+  "description": "Check TypeScript errors"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "grep -n \"GeneratedMetaTags\\|generatedMetaTags\" prisma/schema.prisma 2>/dev/null | head -20",
+  "description": "Check if GeneratedMetaTags model exists in Prisma schema"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "npx prisma migrate status 2>&1 | tail -20",
+  "description": "Check Prisma migration status"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "npx jest tests/metaTag.repository.test.ts --no-coverage 2>&1 | tail -30",
+  "description": "Run the failing repository test"
+}
+```
+
+## Assistant
+
+Let me now call advisor to get guidance before making changes.
+
+## Assistant
+
+Good guidance. Let me start with the fixes in order.
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cd /Users/bigfa/Documents/GitHub/Harmony && git ls-files \"llm-logs/2026-04-20-094302-session-ce430386.md\"",
+  "description": "Check if log file is git-tracked"
+}
+```
+
+## Assistant
+
+The file is tracked. Let me fix all issues now.
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "git rm \"llm-logs/2026-04-20-094302-session-ce430386.md\"",
+  "description": "Remove tracked log file from git"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cat /Users/bigfa/Documents/GitHub/Harmony/.gitignore 2>/dev/null | grep -i \"llm-logs\" || echo \"not found\"",
+  "description": "Check existing gitignore for llm-logs entries"
+}
+```
+
+## Assistant
+
+**Tool call: `Read`**
+```json
+{
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/.gitignore",
+  "limit": 10
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/.gitignore",
+  "old_string": "tasks/todo.md\n.claude/*\n.env*\n*.local*\n.idea/*\n.playwright-cli/*",
+  "new_string": "tasks/todo.md\n.claude/*\n.env*\n*.local*\n.idea/*\n.playwright-cli/*\nllm-logs/*.md"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/.gitignore",
+  "old_string": "tasks/todo.md\n.claude/*\n.env*\n*.local*\n.idea/*\n.playwright-cli/*",
+  "new_string": "tasks/todo.md\n.claude/*\n.env*\n*.local*\n.idea/*\n.playwright-cli/*\nllm-logs/"
+}
+```
+
+## User
+
+[Request interrupted by user for tool use]
+
+## User
+
+Do not do anything at all to @llm-logs/ it is not your concern
+
+## Assistant
+
+Understood — leaving llm-logs entirely alone. I'll address the remaining code issues and reply to the log-file comment explaining it's managed separately.
+
+Now fixing the real code issues:
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/metaTagService.ts",
+  "old_string": "    const tags = await this.generateMetaTagsFromContext(channel, messages);",
+  "new_string": "    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/metaTagService.ts",
+  "old_string": "    return {\n      jobId: `meta-tag-regeneration:${channelId}`,\n      status: 'queued',\n      ...(priority !== undefined && { priority }),\n      ...(idempotencyKey !== undefined && { idempotencyKey }),\n    };",
+  "new_string": "    return {\n      jobId: `meta-tag-regeneration:${channelId}`,\n      status: 'queued',\n    };"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/metaTagCache.ts",
+  "old_string": "    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl: ttl ?? this.ttl });",
+  "new_string": "    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl: ttl ?? DEFAULT_TTL });"
+}
+```
+
+## Assistant
+
+Now add `generate()` and `validate()` stubs to the generators to satisfy the `IMetaTagGenerator` interface:
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/titleGenerator.ts",
+  "old_string": "// CL-C2.2 TitleGenerator \u2014 generates SEO-optimized titles (AC-2: \u226460 chars)\nimport type { ChannelContext, MessageContext } from './types';",
+  "new_string": "// CL-C2.2 TitleGenerator \u2014 generates SEO-optimized titles (AC-2: \u226460 chars)\nimport type { ChannelContext, MessageContext, MetaTagSet, IMetaTagGenerator } from './types';"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/titleGenerator.ts",
+  "old_string": "export const TitleGenerator = {\n  maxLength: MAX_LENGTH,",
+  "new_string": "export const TitleGenerator: IMetaTagGenerator & {\n  maxLength: number;\n  generateFromChannel(channel: ChannelContext): string;\n  generateFromMessage(message: MessageContext, channel: ChannelContext): string;\n  generateFromThread(messages: MessageContext[], channel: ChannelContext): string;\n  truncateWithEllipsis(text: string): string;\n  sanitizeForTitle(text: string): string;\n  applyTemplate(template: string, vars: Record<string, string>): string;\n} = {\n  maxLength: MAX_LENGTH,"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/titleGenerator.ts",
+  "old_string": "  applyTemplate(template: string, vars: Record<string, string>): string {\n    return Object.entries(vars).reduce(\n      (result, [key, value]) => result.replaceAll(`{${key}}`, value),\n      template,\n    );\n  },\n};",
+  "new_string": "  applyTemplate(template: string, vars: Record<string, string>): string {\n    return Object.entries(vars).reduce(\n      (result, [key, value]) => result.replaceAll(`{${key}}`, value),\n      template,\n    );\n  },\n\n  // CL-I1 stubs \u2014 full generate/validate wired by M4\n  generate(): MetaTagSet {\n    throw new Error('TitleGenerator.generate() not yet implemented \u2014 wired by M4');\n  },\n  validate(): boolean {\n    throw new Error('TitleGenerator.validate() not yet implemented \u2014 wired by M4');\n  },\n};"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/descriptionGenerator.ts",
+  "old_string": "// CL-C2.3 DescriptionGenerator \u2014 generates meta descriptions (AC-2: 50-160 chars)\nimport type { MessageContext, ChannelContext } from './types';",
+  "new_string": "// CL-C2.3 DescriptionGenerator \u2014 generates meta descriptions (AC-2: 50-160 chars)\nimport type { MessageContext, ChannelContext, MetaTagSet, IMetaTagGenerator } from './types';"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/descriptionGenerator.ts",
+  "old_string": "export const DescriptionGenerator = {\n  maxLength: MAX_LENGTH,\n  minLength: MIN_LENGTH,",
+  "new_string": "export const DescriptionGenerator: IMetaTagGenerator & {\n  maxLength: number;\n  minLength: number;\n  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string;\n  extractKeyPhrases(messages: MessageContext[]): string[];\n  sanitizeText(text: string): string;\n  summarizeThread(messages: MessageContext[], channel: ChannelContext): string;\n  enforceLength(text: string): string;\n} = {\n  maxLength: MAX_LENGTH,\n  minLength: MIN_LENGTH,"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/descriptionGenerator.ts",
+  "old_string": "  enforceLength(text: string): string {\n    let result = text;\n\n    if (result.length < MIN_LENGTH) {\n      const additions = [\n        ' Join the discussion.',\n        ' Explore the latest updates.',\n        ' Connect with the community.',\n      ];\n      let i = 0;\n      while (result.length < MIN_LENGTH) {\n        result += additions[i % additions.length];\n        i++;\n      }\n    }\n\n    if (result.length > MAX_LENGTH) {\n      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '\u2026';\n    }\n    return result;\n  },\n};",
+  "new_string": "  enforceLength(text: string): string {\n    let result = text;\n\n    if (result.length < MIN_LENGTH) {\n      const additions = [\n        ' Join the discussion.',\n        ' Explore the latest updates.',\n        ' Connect with the community.',\n      ];\n      let i = 0;\n      while (result.length < MIN_LENGTH) {\n        result += additions[i % additions.length];\n        i++;\n      }\n    }\n\n    if (result.length > MAX_LENGTH) {\n      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '\u2026';\n    }\n    return result;\n  },\n\n  // CL-I1 stubs \u2014 full generate/validate wired by M4\n  generate(): MetaTagSet {\n    throw new Error('DescriptionGenerator.generate() not yet implemented \u2014 wired by M4');\n  },\n  validate(): boolean {\n    throw new Error('DescriptionGenerator.validate() not yet implemented \u2014 wired by M4');\n  },\n};"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/openGraphGenerator.ts",
+  "old_string": "// CL-C2.4 OpenGraphGenerator \u2014 generates OG and Twitter Card tags\nimport type { ChannelContext, OpenGraphTags, TwitterCardTags } from './types';",
+  "new_string": "// CL-C2.4 OpenGraphGenerator \u2014 generates OG and Twitter Card tags\nimport type { ChannelContext, OpenGraphTags, TwitterCardTags, MetaTagSet, IMetaTagGenerator } from './types';"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/openGraphGenerator.ts",
+  "old_string": "export const OpenGraphGenerator = {\n  defaultImage: DEFAULT_IMAGE,",
+  "new_string": "export const OpenGraphGenerator: IMetaTagGenerator & {\n  defaultImage: string;\n  generateOGTags(channel: ChannelContext, title: string, description: string): OpenGraphTags;\n  generateTwitterCard(channel: ChannelContext, title: string, description: string, image?: string): TwitterCardTags;\n  selectPreviewImage(channel: ChannelContext): string;\n} = {\n  defaultImage: DEFAULT_IMAGE,"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/openGraphGenerator.ts",
+  "old_string": "  selectPreviewImage(_channel: ChannelContext): string {\n    return DEFAULT_IMAGE;\n  },\n};",
+  "new_string": "  selectPreviewImage(_channel: ChannelContext): string {\n    return DEFAULT_IMAGE;\n  },\n\n  // CL-I1 stubs \u2014 full generate/validate wired by M4\n  generate(): MetaTagSet {\n    throw new Error('OpenGraphGenerator.generate() not yet implemented \u2014 wired by M4');\n  },\n  validate(): boolean {\n    throw new Error('OpenGraphGenerator.validate() not yet implemented \u2014 wired by M4');\n  },\n};"
+}
+```
+
+## Assistant
+
+Now verify TypeScript and tests:
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cd /Users/bigfa/Documents/GitHub/Harmony/harmony-backend && npx tsc --noEmit 2>&1",
+  "description": "Check TypeScript errors"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "npx eslint src/services/metaTag/ --max-warnings=0 2>&1",
+  "description": "Lint the metaTag service files"
+}
+```
+
+## Assistant
+
+**Tool call: `Edit`**
+```json
+{
+  "replace_all": false,
+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/metaTagService.ts",
+  "old_string": "  async scheduleRegeneration(\n    channelId: string,\n    priority?: 'high' | 'normal' | 'low',\n    idempotencyKey?: string,\n  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {",
+  "new_string": "  async scheduleRegeneration(\n    channelId: string,\n    _priority?: 'high' | 'normal' | 'low',\n    _idempotencyKey?: string,\n  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "npx eslint src/services/metaTag/ --max-warnings=0 2>&1 && npx tsc --noEmit 2>&1",
+  "description": "Verify lint and TypeScript both pass"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "npx jest tests/metaTagService.test.ts --no-coverage 2>&1 | tail -20",
+  "description": "Run metaTag service tests"
+}
+```
+
+## Assistant
+
+All tests pass. Now commit and push:
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "cd /Users/bigfa/Documents/GitHub/Harmony && git diff --staged && git status",
+  "description": "Check staged changes and status"
+}
+```
+
+## Assistant
+
+I need to unstage the llm-logs file deletion since the user wants me to leave that folder alone:
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "git restore --staged \"llm-logs/2026-04-20-094302-session-ce430386.md\" && git checkout -- \"llm-logs/2026-04-20-094302-session-ce430386.md\" 2>&1; echo \"exit: $?\"",
+  "description": "Unstage and restore the llm-logs file deletion"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "git diff --staged --name-only && git status --short",
+  "description": "Verify staged changes are only code files"
+}
+```
+
+## Assistant
+
+Only the 5 code files staged. Now commit and push:
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "git commit -m \"$(cat <<'EOF'\nfix: address PR #443 review findings (this-binding, IMetaTagGenerator stubs, scheduleRegeneration return)\n\n- Replace this.generateMetaTagsFromContext with metaTagService.* to avoid destructuring hazard\n- Replace this.ttl with DEFAULT_TTL in MetaTagCache.set to avoid destructuring hazard\n- Remove extra priority/idempotencyKey fields from scheduleRegeneration return to match declared type\n- Add IMetaTagGenerator generate()/validate() stubs to TitleGenerator, DescriptionGenerator, OpenGraphGenerator (CL-I1)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\nEOF\n)\"",
+  "description": "Commit the fixes"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "git add harmony-backend/src/services/metaTag/descriptionGenerator.ts harmony-backend/src/services/metaTag/metaTagCache.ts harmony-backend/src/services/metaTag/metaTagService.ts harmony-backend/src/services/metaTag/openGraphGenerator.ts harmony-backend/src/services/metaTag/titleGenerator.ts && git commit -m \"$(cat <<'EOF'\nfix: address PR #443 review findings (this-binding, IMetaTagGenerator stubs, scheduleRegeneration return)\n\n- Replace this.generateMetaTagsFromContext with metaTagService.* to avoid destructuring hazard\n- Replace this.ttl with DEFAULT_TTL in MetaTagCache.set to avoid destructuring hazard\n- Remove extra priority/idempotencyKey fields from scheduleRegeneration return to match declared type\n- Add IMetaTagGenerator generate()/validate() stubs to TitleGenerator, DescriptionGenerator, OpenGraphGenerator (CL-I1)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\nEOF\n)\"",
+  "description": "Stage and commit the code fixes"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "git push 2>&1",
+  "description": "Push to remote"
+}
+```
+
+## Assistant
+
+Pushed. Now reply to all comments:
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "HASH=85d862f\n\nnpx agent-reviews --reply 4141409312 \"Fixed in ${HASH}. (1) The llm-logs folder is project-managed and not in scope for this PR \u2014 that directory is intentionally maintained separately. (2) Fixed this-binding hazard: metaTagService.ts now calls metaTagService.generateMetaTagsFromContext() directly (no this); MetaTagCache.set() now uses DEFAULT_TTL constant instead of this.ttl. (3) Fixed scheduleRegeneration: removed the extra priority/idempotencyKey spread from the return value so the actual return matches the declared Promise<{jobId, status}> type.\" --resolve 2>&1",
+  "description": "Reply to FardeenI's review"
+}
+```
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "HASH=85d862f\n\nnpx agent-reviews --reply 4140583007 \"Thanks for the detailed review. Here's the status of each item:\n\n1. **Method signatures** \u2014 Already addressed in the prior fix commit (177c384): generateMetaTags(channelId, options?), getOrGenerateCached(channelId), scheduleRegeneration returns Promise<{jobId,status}>, getRegenerationJobStatus(channelId, jobId), getMetaTagsForPreview returns Promise<MetaTagPreview>.\n\n2. **IMetaTagGenerator (CL-I1)** \u2014 Fixed in ${HASH}. Added generate()/validate() stubs to TitleGenerator, DescriptionGenerator, and OpenGraphGenerator so all three satisfy the interface structurally. Full implementation wired by M4.\n\n3. **enforceLength minimum** \u2014 Already fixed in 898f943: enforceLength() now pads short text by appending from an additions array until \u226550 chars.\n\n4. **Hardcoded BASE_URL** \u2014 Already using process.env.BASE_URL ?? 'https://harmony.chat' in structuredDataGenerator.ts (line 4) and generateBreadcrumbList uses \\${BASE_URL}/s/\\${channel.serverSlug}.\n\n5. **Twitter card type** \u2014 Already conditional: generateTwitterCard() uses isCustomImage ? 'summary_large_image' : 'summary', defaulting to summary when no custom image is available.\n\n6. **generateDiscussionForum JSON-LD fields** \u2014 author, datePublished, and dateModified are present in the return object as explicit undefined stubs. The StructuredData interface includes all three as optional fields. These will be populated by M4 when message data is wired.\n\n7. **Pre-existing test failure** \u2014 metaTag.repository.test.ts passes locally against the current schema. The CI failure appears to be an environment issue (missing migration in CI). Tracked separately from this skeleton PR.\" --resolve 2>&1",
+  "description": "Reply to declanblanc's review"
+}
+```
+
+## Assistant
+
+Phase 1 complete. Now starting Phase 2 — watching for new comments:
+
+## Assistant
+
+**Tool call: `Bash`**
+```json
+{
+  "command": "npx agent-reviews --watch 2>&1",
+  "description": "Watch for new PR review comments (10-minute timeout)",
+  "timeout": 660000
+}
+```
+
+## User
+
+[Request interrupted by user for tool use]
+
+## User
+
+<command-message>export-logs</command-message>
+<command-name>/export-logs</command-name>
+
+## User
+
+Base directory for this skill: /Users/bigfa/Documents/GitHub/Harmony/.claude/skills/export-logs
+
+Export the current session's conversation log to `llm-logs/` with a timestamp filename, then commit and push it.
+
+## Steps
+
+### Step 1: Write the export script to a temp file
+
+Write the following content exactly to `/tmp/harmony_export_logs.py`:
+
+```python
+import os, glob, json, subprocess
+from datetime import datetime
+
+cwd = os.getcwd()
+project_key = cwd.replace('/', '-').replace('.', '-')
+project_dir = os.path.expanduser(f'~/.claude/projects/{project_key}')
+
+if not os.path.isdir(project_dir):
+    print(f'ERROR: project dir not found: {project_dir}')
+    exit(1)
+
+files = glob.glob(os.path.join(project_dir, '*.jsonl'))
+if not files:
+    print('ERROR: no session JSONL files found')
+    exit(1)
+
+latest = max(files, key=os.path.getmtime)
+session_id = os.path.splitext(os.path.basename(latest))[0]
+short_id = session_id[:8]
+
+now = datetime.now()
+date_str = now.strftime('%Y-%m-%d')
+time_str = now.strftime('%H%M%S')
+outfile = f'llm-logs/{date_str}-{time_str}-session-{short_id}.md'
+
+os.makedirs('llm-logs', exist_ok=True)
+
+lines = []
+with open(latest) as f:
+    for line in f:
+        line = line.strip()
+        if not line:
+            continue
+        try:
+            lines.append(json.loads(line))
+        except json.JSONDecodeError:
+            continue
+
+md = [f'# Session Log {date_str}-{time_str}\n']
+
+for entry in lines:
+    t = entry.get('type')
+    if t == 'user':
+        msg = entry.get('message', {})
+        content = msg.get('content', '')
+        if isinstance(content, list):
+            texts = [b.get('text', '') for b in content if isinstance(b, dict) and b.get('type') == 'text']
+            content = '\n'.join(texts)
+        if content.strip():
+            md.append(f'## User\n\n{content.strip()}\n')
+    elif t == 'assistant':
+        msg = entry.get('message', {})
+        content = msg.get('content', '')
+        if isinstance(content, list):
+            parts = []
+            for b in content:
+                if not isinstance(b, dict):
+                    continue
+                if b.get('type') == 'text':
+                    parts.append(b.get('text', ''))
+                elif b.get('type') == 'tool_use':
+                    name = b.get('name', 'tool')
+                    inp = b.get('input', {})
+                    inp_str = json.dumps(inp, indent=2) if inp else ''
+                    parts.append(f'**Tool call: `{name}`**\n```json\n{inp_str}\n```')
+                elif b.get('type') == 'tool_result':
+                    result_content = b.get('content', '')
+                    if isinstance(result_content, list):
+                        result_content = '\n'.join(
+                            r.get('text', '') for r in result_content if isinstance(r, dict)
+                        )
+                    parts.append(f'**Tool result:**\n```\n{str(result_content)[:2000]}\n```')
+            content = '\n\n'.join(p for p in parts if p.strip())
+        if content.strip():
+            md.append(f'## Assistant\n\n{content.strip()}\n')
+
+with open(outfile, 'w') as f:
+    f.write('\n'.join(md) + '\n')
+
+print(f'OUTFILE={outfile}')
+```
+
+### Step 2: Run the script
+
+```bash
+python3 /tmp/harmony_export_logs.py
+```
+
+Capture `OUTFILE` from the output (the line starting with `OUTFILE=`). If the script exits with an error, report it and stop.
+
+### Step 3: Commit and push
+
+Stage only the new log file, commit with the canonical message, and push:
+
+```bash
+git add "$OUTFILE"
+git commit -m "chore: add llm logs"
+git push
+```
+
+If `git push` fails because the remote branch does not exist yet, re-run with `-u origin HEAD`.
+
+### Step 4: Report
+
+Tell the user:
+- The log file path that was written
+- The commit hash
+- Whether the push succeeded
+
+## Assistant
+
+**Tool call: `Write`**
+```json
+{
+  "file_path": "/tmp/harmony_export_logs.py",
+  "content": "import os, glob, json, subprocess\nfrom datetime import datetime\n\ncwd = os.getcwd()\nproject_key = cwd.replace('/', '-').replace('.', '-')\nproject_dir = os.path.expanduser(f'~/.claude/projects/{project_key}')\n\nif not os.path.isdir(project_dir):\n    print(f'ERROR: project dir not found: {project_dir}')\n    exit(1)\n\nfiles = glob.glob(os.path.join(project_dir, '*.jsonl'))\nif not files:\n    print('ERROR: no session JSONL files found')\n    exit(1)\n\nlatest = max(files, key=os.path.getmtime)\nsession_id = os.path.splitext(os.path.basename(latest))[0]\nshort_id = session_id[:8]\n\nnow = datetime.now()\ndate_str = now.strftime('%Y-%m-%d')\ntime_str = now.strftime('%H%M%S')\noutfile = f'llm-logs/{date_str}-{time_str}-session-{short_id}.md'\n\nos.makedirs('llm-logs', exist_ok=True)\n\nlines = []\nwith open(latest) as f:\n    for line in f:\n        line = line.strip()\n        if not line:\n            continue\n        try:\n            lines.append(json.loads(line))\n        except json.JSONDecodeError:\n            continue\n\nmd = [f'# Session Log {date_str}-{time_str}\\n']\n\nfor entry in lines:\n    t = entry.get('type')\n    if t == 'user':\n        msg = entry.get('message', {})\n        content = msg.get('content', '')\n        if isinstance(content, list):\n            texts = [b.get('text', '') for b in content if isinstance(b, dict) and b.get('type') == 'text']\n            content = '\\n'.join(texts)\n        if content.strip():\n            md.append(f'## User\\n\\n{content.strip()}\\n')\n    elif t == 'assistant':\n        msg = entry.get('message', {})\n        content = msg.get('content', '')\n        if isinstance(content, list):\n            parts = []\n            for b in content:\n                if not isinstance(b, dict):\n                    continue\n                if b.get('type') == 'text':\n                    parts.append(b.get('text', ''))\n                elif b.get('type') == 'tool_use':\n                    name = b.get('name', 'tool')\n                    inp = b.get('input', {})\n                    inp_str = json.dumps(inp, indent=2) if inp else ''\n                    parts.append(f'**Tool call: `{name}`**\\n```json\\n{inp_str}\\n```')\n                elif b.get('type') == 'tool_result':\n                    result_content = b.get('content', '')\n                    if isinstance(result_content, list):\n                        result_content = '\\n'.join(\n                            r.get('text', '') for r in result_content if isinstance(r, dict)\n                        )\n                    parts.append(f'**Tool result:**\\n```\\n{str(result_content)[:2000]}\\n```')\n            content = '\\n\\n'.join(p for p in parts if p.strip())\n        if content.strip():\n            md.append(f'## Assistant\\n\\n{content.strip()}\\n')\n\nwith open(outfile, 'w') as f:\n    f.write('\\n'.join(md) + '\\n')\n\nprint(f'OUTFILE={outfile}')\n"
+}
+```
+
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:29:35.832Z

I’ve narrowed it to actual `HEAD` files from the PR. One correctness issue stands out in the cache path, and I’m pulling exact line references now before I post the review.

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/metaTagService.ts | nl -ba | sed -n '1,220p'
```

Output:

```text
     1	// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
     2	import { TitleGenerator } from './titleGenerator';
     3	import { DescriptionGenerator } from './descriptionGenerator';
     4	import { OpenGraphGenerator } from './openGraphGenerator';
     5	import { StructuredDataGenerator } from './structuredDataGenerator';
     6	import { MetaTagCache } from './metaTagCache';
     7	import type {
     8	  MetaTagSet,
     9	  ChannelContext,
    10	  MessageContext,
    11	  MetaTagPreview,
    12	  MetaTagJobStatus,
    13	} from './types';
    14	import { createLogger } from '../../lib/logger';
    15	
    16	const logger = createLogger({ component: 'meta-tag-service' });
    17	
    18	const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
    19	
    20	function sanitizeChannelContext(channel: ChannelContext): ChannelContext {
    21	  return {
    22	    ...channel,
    23	    name: TitleGenerator.sanitizeForTitle(channel.name),
    24	    serverName: TitleGenerator.sanitizeForTitle(channel.serverName),
    25	  };
    26	}
    27	
    28	function buildFallbackTags(channel: ChannelContext): MetaTagSet {
    29	  const safe = sanitizeChannelContext(channel);
    30	  const title = `${safe.name} — ${safe.serverName}`;
    31	  const description = `Discussions in #${safe.name} on ${safe.serverName}.`;
    32	  return {
    33	    title: TitleGenerator.truncateWithEllipsis(title),
    34	    description: DescriptionGenerator.enforceLength(description),
    35	    canonical: safe.canonicalUrl,
    36	    robots: 'index, follow',
    37	    openGraph: OpenGraphGenerator.generateOGTags(safe, title, description),
    38	    twitter: OpenGraphGenerator.generateTwitterCard(safe, title, description),
    39	    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, title, description),
    40	    keywords: [],
    41	    needsRegeneration: true,
    42	  };
    43	}
    44	
    45	export const metaTagService = {
    46	  /**
    47	   * Generate meta tags from pre-resolved context (used internally and in unit tests).
    48	   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
    49	   */
    50	  async generateMetaTagsFromContext(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
    51	    try {
    52	      const title = TitleGenerator.generateFromThread(messages, channel);
    53	      const description = DescriptionGenerator.generateFromMessages(messages, channel);
    54	      const og = OpenGraphGenerator.generateOGTags(channel, title, description);
    55	      const twitter = OpenGraphGenerator.generateTwitterCard(channel, title, description, og.ogImage);
    56	      const structuredData = StructuredDataGenerator.generateDiscussionForum(
    57	        channel,
    58	        title,
    59	        description,
    60	      );
    61	      const keywords = DescriptionGenerator.extractKeyPhrases(messages);
    62	
    63	      return {
    64	        title,
    65	        description,
    66	        canonical: channel.canonicalUrl,
    67	        robots: 'index, follow',
    68	        openGraph: og,
    69	        twitter,
    70	        structuredData,
    71	        keywords,
    72	        needsRegeneration: false,
    73	      };
    74	    } catch (err) {
    75	      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
    76	      return buildFallbackTags(channel);
    77	    }
    78	  },
    79	
    80	  /**
    81	   * Spec-aligned stub: generateMetaTags(channelId, options?).
    82	   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
    83	   */
    84	  async generateMetaTags(
    85	    _channelId: string,
    86	    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
    87	  ): Promise<MetaTagSet> {
    88	    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
    89	  },
    90	
    91	  /**
    92	   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
    93	   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
    94	   */
    95	  async getOrGenerateCachedFromContext(
    96	    channel: ChannelContext,
    97	    messages: MessageContext[],
    98	    ttl?: number,
    99	  ): Promise<MetaTagSet> {
   100	    const cached = await MetaTagCache.get(channel.id);
   101	    if (cached) return cached;
   102	
   103	    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
   104	    await MetaTagCache.set(channel.id, tags, ttl);
   105	    return tags;
   106	  },
   107	
   108	  /**
   109	   * Spec-aligned stub: getOrGenerateCached(channelId).
   110	   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
   111	   */
   112	  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
   113	    throw new Error('getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)');
   114	  },
   115	
   116	  async invalidateCache(channelId: string): Promise<void> {
   117	    await MetaTagCache.invalidate(channelId);
   118	  },
   119	
   120	  // scheduleRegeneration and getRegenerationJobStatus are stubs —
   121	  // full implementation depends on M4 (worker/queue) from issue #356
   122	  async scheduleRegeneration(
   123	    channelId: string,
   124	    _priority?: 'high' | 'normal' | 'low',
   125	    _idempotencyKey?: string,
   126	  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
   127	    // Queuing logic wired by M4 MetaTagUpdateWorker
   128	    return {
   129	      jobId: `meta-tag-regeneration:${channelId}`,
   130	      status: 'queued',
   131	    };
   132	  },
   133	
   134	  async getRegenerationJobStatus(
   135	    _channelId: string,
   136	    _jobId: string,
   137	  ): Promise<MetaTagJobStatus | null> {
   138	    return null;
   139	  },
   140	
   141	  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
   142	    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
   143	  },
   144	
   145	  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
   146	    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;
   147	  },
   148	};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/metaTagCache.ts | nl -ba | sed -n '1,120p'
```

Output:

```text
     1	// CL-C2.6 MetaTagCache — Redis-backed cache for generated meta tags (D7.1)
     2	import { cacheService, CacheKeys } from '../cache.service';
     3	import type { MetaTagSet } from './types';
     4	
     5	const DEFAULT_TTL = 3600; // seconds, per spec D7.1
     6	
     7	export const MetaTagCache = {
     8	  ttl: DEFAULT_TTL,
     9	
    10	  async get(channelId: string): Promise<MetaTagSet | null> {
    11	    const entry = await cacheService.get<MetaTagSet>(CacheKeys.metaChannel(channelId));
    12	    return entry?.data ?? null;
    13	  },
    14	
    15	  async set(channelId: string, tags: MetaTagSet, ttl?: number): Promise<void> {
    16	    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl: ttl ?? DEFAULT_TTL });
    17	  },
    18	
    19	  async invalidate(channelId: string): Promise<void> {
    20	    await cacheService.invalidate(CacheKeys.metaChannel(channelId));
    21	  },
    22	};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/types.ts | nl -ba | sed -n '1,160p'
```

Output:

```text
     1	// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)
     2	
     3	export interface OpenGraphTags {
     4	  ogTitle: string;
     5	  ogDescription: string;
     6	  ogImage: string;
     7	  ogType: string;
     8	  ogUrl: string;
     9	  ogSiteName: string;
    10	}
    11	
    12	export interface TwitterCardTags {
    13	  card: string;
    14	  title: string;
    15	  description: string;
    16	  image: string;
    17	  site: string;
    18	}
    19	
    20	export interface StructuredData {
    21	  '@context': string;
    22	  '@type': string;
    23	  headline: string;
    24	  description: string;
    25	  author?: object;
    26	  datePublished?: string;
    27	  dateModified?: string;
    28	  mainEntity?: object;
    29	  breadcrumb?: object;
    30	}
    31	
    32	export interface MetaTagSet {
    33	  title: string;
    34	  description: string;
    35	  canonical: string;
    36	  robots: string;
    37	  openGraph: OpenGraphTags;
    38	  twitter: TwitterCardTags;
    39	  structuredData: StructuredData;
    40	  keywords: string[];
    41	  needsRegeneration?: boolean;
    42	}
    43	
    44	export interface ContentAnalysis {
    45	  keywords: string[];
    46	  topics: string[];
    47	  summary: string;
    48	  sentiment: string;
    49	  readingLevel: string;
    50	}
    51	
    52	export interface IMetaTagGenerator {
    53	  generate(): MetaTagSet;
    54	  validate(): boolean;
    55	}
    56	
    57	export interface MetaTagPreview {
    58	  title: string;
    59	  description: string;
    60	  ogTitle: string;
    61	  ogDescription: string;
    62	  ogImage: string;
    63	  keywords: string[];
    64	  generatedAt: string;
    65	  isCustom: boolean;
    66	  searchPreview: { title: string; description: string; url: string };
    67	  socialPreview: { title: string; description: string; image: string };
    68	}
    69	
    70	export interface MetaTagJobStatus {
    71	  jobId: string;
    72	  channelId: string;
    73	  status: 'queued' | 'processing' | 'succeeded' | 'failed';
    74	  attempts: number;
    75	  startedAt: string | null;
    76	  completedAt: string | null;
    77	}
    78	
    79	export interface ChannelContext {
    80	  id: string;
    81	  name: string;
    82	  slug: string;
    83	  topic?: string | null;
    84	  serverName: string;
    85	  serverSlug: string;
    86	  canonicalUrl: string;
    87	}
    88	
    89	export interface MessageContext {
    90	  content: string;
    91	  createdAt: Date;
    92	  authorDisplayName?: string;
    93	}
```

#### Tool: exec_command

```sh
rg -n "getRegenerationJobStatus|scheduleRegeneration|MetaTagPreview|MetaTagJobStatus" docs harmony-backend -g '!node_modules'
```

Output:

```text
docs/unified-backend-architecture.md:638:        +scheduleRegeneration(channelId) void
docs/dev-spec-seo-meta-tag-generation.md:90:│  │  │ scheduleRegeneration()      │                                          │  │
docs/dev-spec-seo-meta-tag-generation.md:92:│  │  │ getRegenerationJobStatus()  │                                          │  │
docs/dev-spec-seo-meta-tag-generation.md:425:                            │ + scheduleRegeneration()    │
docs/dev-spec-seo-meta-tag-generation.md:427:                            │ + getRegenerationJobStatus()│
docs/dev-spec-seo-meta-tag-generation.md:2024:scheduleRegeneration(
docs/dev-spec-seo-meta-tag-generation.md:2033:): Promise<MetaTagPreview>
docs/dev-spec-seo-meta-tag-generation.md:2036:getRegenerationJobStatus(
docs/dev-spec-seo-meta-tag-generation.md:2039:): Promise<MetaTagJobStatus>
docs/dev-spec-seo-meta-tag-generation.md:2608:| scheduleRegeneration() | MetaTagService | Queue background meta tag updates |
docs/dev-spec-seo-meta-tag-generation.md:2647:                $ref: '#/components/schemas/MetaTagPreview'
docs/dev-spec-seo-meta-tag-generation.md:2752:                $ref: '#/components/schemas/MetaTagJobStatus'
docs/dev-spec-seo-meta-tag-generation.md:2768:    MetaTagPreview:
docs/dev-spec-seo-meta-tag-generation.md:2828:    MetaTagJobStatus:
```

#### Tool: exec_command

```sh
gh pr checks 443 --repo CS485-Harmony/Harmony
```

Output:

```text
Run Backend Tests	pending	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24678024225/job/72167346417	
Frontend Lint and Build	pass	40s	https://github.com/CS485-Harmony/Harmony/actions/runs/24678024241/job/72167346284	
Run Integration Tests	pending	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24678024235/job/72167346239	
Backend Lint and Build	pass	24s	https://github.com/CS485-Harmony/Harmony/actions/runs/24678024241/job/72167346283	
Run Frontend Tests	pass	23s	https://github.com/CS485-Harmony/Harmony/actions/runs/24678024275/job/72167346227	
Run Cloud Integration Tests	skipping	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24678024235/job/72167346684	
Vercel Preview Comments	pass	0	https://vercel.com/github	
Vercel	pending	0	https://vercel.com/declans-projects-141a8b4c/harmony/8VBaPooYV4Ko7kwX2txhLbNg9cyc	Vercel is deploying your app
```

#### Tool: exec_command

```sh
sed -n '2018,2044p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
// Invalidate cached meta tags
invalidateCache(
  channelId: string
): Promise<void>

// Schedule background regeneration
scheduleRegeneration(
  channelId: string,
  priority?: 'high' | 'normal' | 'low',
  idempotencyKey?: string
): Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>

// Get meta tags for admin preview
getMetaTagsForPreview(
  channelId: string
): Promise<MetaTagPreview>

// Poll status for a regeneration job
getRegenerationJobStatus(
  channelId: string,
  jobId: string
): Promise<MetaTagJobStatus>
```

**Generation and Override Rules:**
- Auto-generated values target SEO limits (`title <= 60`, `description <= 160`).
- Admin overrides (`custom_title`, `custom_description`, `custom_og_image`) always take precedence over generated values when present.
````

#### Tool: exec_command

```sh
sed -n '2828,2864p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

```text
    MetaTagJobStatus:
      type: object
      properties:
        jobId:
          type: string
        channelId:
          type: string
          format: uuid
        status:
          type: string
          enum: [queued, processing, succeeded, failed]
        attempts:
          type: integer
        startedAt:
          type: string
          format: date-time
          nullable: true
        completedAt:
          type: string
          format: date-time
          nullable: true
        errorCode:
          type: string
          nullable: true
        errorMessage:
          type: string
          nullable: true

    ErrorResponse:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        requestId:
          type: string
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:30:07.152Z

I’ve got the review text ready: one new runtime-behavior bug in the cache path, plus one remaining API-contract mismatch that wasn’t actually fixed on the latest head. I’m posting that as a single bundled `REQUEST_CHANGES` review now.

#### Tool: exec_command

````sh
cat >/tmp/review443.md <<'EOF'
## PR Review Checklist

- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.
- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.
- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.
- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.
- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.
- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.
- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.
- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.

## Review (Request changes)

### 1. Do not cache fallback tags returned from a generation failure
**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)

`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:

```ts
const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
await MetaTagCache.set(channel.id, tags, ttl);
```

That means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.

**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.

### 2. `getRegenerationJobStatus` still does not match the published spec contract
**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`

The spec says:

```ts
getRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>
```

But the implementation still publishes:

```ts
async getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {
  return null;
}
```

and the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.

**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.
EOF

gh pr review 443 --repo CS485-Harmony/Harmony --request-changes --body-file /tmp/review443.md
````

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 6687,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 4000
}
```

Output:

```text
Chunk ID: 9ede3b
Wall time: 0.0000 seconds
Process exited with code 1
Original token count: 36
Output:
failed to create review: Post "https://api.github.com/graphql": read tcp 10.196.35.131:53189->140.82.114.6:443: read: connection reset by peer
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:32:27.309Z

GitHub dropped the first review submission on a network reset. I’m retrying the exact same bundled review once.

#### Tool: exec_command

```sh
gh pr review 443 --repo CS485-Harmony/Harmony --request-changes --body-file /tmp/review443.md
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 37859,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 4000
}
```

Output:

```text
Chunk ID: 7667ed
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:32:55.662Z

Findings:

1. `harmony-backend/src/services/metaTag/metaTagService.ts:95-105`  
`getOrGenerateCachedFromContext()` caches whatever `generateMetaTagsFromContext()` returns. On the failure path, that return value is the degraded fallback payload with `needsRegeneration: true`, so a transient generator error gets written into Redis and then served for the full cache TTL. That effectively poisons the channel cache with fallback SEO data instead of retrying generation on the next read.

2. `harmony-backend/src/services/metaTag/metaTagService.ts:134-138` and `harmony-backend/src/services/metaTag/types.ts:70-76`  
`getRegenerationJobStatus()` still does not match the published spec contract. The spec says it returns `Promise<MetaTagJobStatus>`, but the implementation returns `Promise<MetaTagJobStatus | null>`, and the local `MetaTagJobStatus` DTO is still missing the spec’s `errorCode` / `errorMessage` fields. For a skeleton PR whose goal is spec-aligned contracts, that mismatch is still blocking.

I posted a bundled `REQUEST_CHANGES` review on PR #443 with those findings. At review time, `Backend Tests`, `Integration Tests`, and `Vercel` were still pending.

<oai-mem-citation>
<citation_entries>
MEMORY.md:187-187|note=[used Harmony review workflow reminder to load WORKFLOW.md and PR_REVIEW.md first]
MEMORY.md:118-120|note=[used Harmony PR review workflow memory entry for repo-specific review process]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>

### Turn 2: and post

#### 👤 User Prompt

- Time: 2026-04-20T16:32:55.699Z

```text
and post it
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:33:05.185Z

Checking whether the review actually landed on GitHub. If it didn’t, I’ll post it again now.

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json reviews
```

Output:

````text
{"reviews":[{"id":"PRR_kwDORIrGY872zEhf","author":{"login":"declanblanc"},"authorAssociation":"MEMBER","body":"## PR Review Checklist\n\n- [x] **1. Logic over Style** — Core logic is sound and the generation pipeline is coherent; concerns raised below are architectural, not stylistic.\n- [ ] **2. Security First** — `structuredDataGenerator.ts` hardcodes `https://harmony.chat` in `generateBreadcrumbList()` instead of reading `BASE_URL`, creating a potential data-leak path in non-production environments (staging/preview could expose wrong canonical URLs to crawlers).\n- [ ] **3. Architectural Alignment** — Multiple public method signatures diverge from the spec-defined contracts (§9.1). See details below.\n- [ ] **4. Issue Completion** — AC-9 (fallback + `needsRegeneration`) is covered, but AC-2 minimum length enforcement is incomplete, and several other acceptance criteria depend on correct method signatures that are not yet aligned (AC-5, AC-6 require `scheduleRegeneration` to return `{ jobId, status }`, not `void`).\n- [x] **5. No Nitpicking** — Only architectural and correctness issues raised.\n- [x] **6. Avoid Repetition** — First review on this PR.\n- [x] **7. Iterative Reviews** — First review.\n- [ ] **8. Prevent CI Failures** — The PR description acknowledges `tests/metaTag.repository.test.ts` is failing. That test failure exists on `main` and should be resolved before or alongside this PR to prevent CI regressions from compounding.\n\n---\n\n## Required Changes\n\n### 1. Method signatures must match the spec API contract (§9.1.1)\n\nThe spec defines these signatures for `MetaTagService`:\n\n```typescript\ngenerateMetaTags(channelId: string, options?: { forceRegenerate?: boolean, includeStructuredData?: boolean }): Promise<MetaTagSet>\ngetOrGenerateCached(channelId: string): Promise<MetaTagSet>\nscheduleRegeneration(channelId: string, priority?: 'high' | 'normal' | 'low', idempotencyKey?: string): Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\ngetMetaTagsForPreview(channelId: string): Promise<MetaTagPreview>\n```\n\nThe implementation instead takes `(channel: ChannelContext, messages: MessageContext[])` — pre-fetched data — rather than a `channelId`. This is a contract-breaking departure: the spec intends `MetaTagService` to own resolution (looking up channel and messages internally, not receiving them from callers). More importantly, the stubs for `scheduleRegeneration` and `getRegenerationJobStatus` have the wrong signatures:\n\n- `scheduleRegeneration` returns `Promise<void>` but must return `Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>`. AC-5/AC-6 directly test this return shape.\n- `getRegenerationJobStatus` only accepts `_channelId` but the spec signature requires `(channelId: string, jobId: string)`.\n- `getMetaTagsForPreview` returns `Promise<MetaTagSet>` but the spec return type is `Promise<MetaTagPreview>`, which is a different shape (includes `searchPreview`, `socialPreview`, `isCustom`, `generatedAt`).\n\nEven as stubs, these signatures must match the spec so callers and future implementations are correct by construction.\n\n### 2. `IMetaTagGenerator` (CL-I1) interface is not implemented by any class\n\nThe spec (§3, §4.8) defines:\n\n```typescript\ninterface IMetaTagGenerator {\n  generate(): MetaTagSet;\n  validate(): boolean;\n}\n```\n\n`TitleGenerator`, `DescriptionGenerator`, and `OpenGraphGenerator` are all listed in the class diagram as implementing this interface. None of them do. The interface exists in `types.ts` but is never referenced. Since the spec explicitly lists this as `CL-I1` with an `implements` relationship, the skeleton is incomplete on this point.\n\n### 3. `DescriptionGenerator.enforceLength` does not enforce the minimum\n\n`enforceLength()` only truncates — it never pads or adjusts content that is below 50 characters. The method name implies it enforces both bounds (50–160). Callers that use `enforceLength` directly (e.g., `buildFallbackTags` in `metaTagService.ts`) can produce descriptions shorter than 50 chars, violating AC-2. The minimum enforcement should be present in `enforceLength` or the method should be renamed `truncateToMaxLength` to be accurate about what it does.\n\n### 4. Hardcoded base URL in `structuredDataGenerator.ts`\n\n`generateBreadcrumbList()` builds `https://harmony.chat/s/${channel.serverSlug}` with a hardcoded domain, but `metaTagService.ts` correctly reads `process.env.BASE_URL ?? 'https://harmony.chat'`. The structured data generator must use the same `BASE_URL` env var for consistency across environments. In a preview/staging deployment this will emit the wrong domain in JSON-LD output, potentially causing Google Search Console to reject the structured data.\n\n### 5. Twitter card type is always `summary_large_image`\n\nThe spec (§9.1.4) states: \"default to `summary`; switch to `summary_large_image` only when a valid large preview image is available.\" The implementation hardcodes `summary_large_image` in all cases. `selectPreviewImage` currently always returns the default image, so this always produces the large-image variant even when no real preview exists. The skeleton should either default to `summary` or apply the conditional logic specified.\n\n### 6. `generateDiscussionForum` omits required JSON-LD fields\n\nPer spec Appendix A and the flow diagrams (F1.19), `DiscussionForumPosting` requires `datePublished`, `dateModified`, and `author` to produce valid rich snippet schema. The current implementation returns:\n\n```typescript\n{ '@context', '@type', headline, description, mainEntity }\n```\n\nWithout `datePublished` and `author`, Google will not render a rich result for this structured data. These can be `null`/`undefined` stubs for now — the issue is they are not present at all in the return type or implementation, making the skeleton incorrect for downstream consumers.\n\n### 7. Pre-existing test failure in `metaTag.repository.test.ts`\n\nThe PR description notes this failure exists on `main`. Merging this PR without resolving it compounds the CI signal, making it harder to distinguish new regressions from pre-existing ones. This test failure should be fixed as part of this PR or tracked in a separate linked issue before merge.","submittedAt":"2026-04-20T13:50:40Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":"94fa035019a4c79638d269724697d5433e7563bc"}},{"id":"PRR_kwDORIrGY872zFER","author":{"login":"copilot-pull-request-reviewer"},"authorAssociation":"CONTRIBUTOR","body":"## Pull request overview\n\nIntroduces the backend skeleton for M2 SEO meta tag generation under `harmony-backend/src/services/metaTag/`, including generators, a Redis-backed cache, and unit tests to validate basic length/sanitization/fallback behavior.\n\n**Changes:**\n- Added `MetaTagService` facade plus `MetaTagCache` (Redis via existing `cacheService`/`CacheKeys.metaChannel`).\n- Implemented initial `TitleGenerator`/`DescriptionGenerator` plus skeleton `OpenGraphGenerator`/`StructuredDataGenerator`.\n- Added Jest unit tests covering generators, cache behavior, and fallback behavior.\n\n### Reviewed changes\n\nCopilot reviewed 9 out of 9 changed files in this pull request and generated 14 comments.\n\n<details>\n<summary>Show a summary per file</summary>\n\n| File | Description |\r\n| ---- | ----------- |\r\n| harmony-backend/src/services/metaTag/types.ts | Adds DTOs/interfaces for meta tag generation outputs and inputs. |\r\n| harmony-backend/src/services/metaTag/titleGenerator.ts | Implements title generation, sanitization, truncation, and template application. |\r\n| harmony-backend/src/services/metaTag/descriptionGenerator.ts | Implements description generation, key phrase extraction, and length enforcement. |\r\n| harmony-backend/src/services/metaTag/openGraphGenerator.ts | Adds OG/Twitter tag generator skeleton and defaults. |\r\n| harmony-backend/src/services/metaTag/structuredDataGenerator.ts | Adds JSON-LD generator skeleton (discussion forum, breadcrumb, org, web page). |\r\n| harmony-backend/src/services/metaTag/metaTagCache.ts | Adds Redis-backed get/set/invalidate wrapper for meta tag cache. |\r\n| harmony-backend/src/services/metaTag/metaTagService.ts | Adds facade orchestration, caching entrypoint, invalidation, and fallback behavior. |\r\n| harmony-backend/tests/metaTagService.test.ts | Adds unit tests for generators, cache wrapper, and MetaTagService behavior. |\n</details>\n\n\n\n\n\n\n---\n\n💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","submittedAt":"2026-04-20T13:51:03Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"94fa035019a4c79638d269724697d5433e7563bc"}},{"id":"PRR_kwDORIrGY8720G4V","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:27:52Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720HDs","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:27:59Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720HOo","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:28:05Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720Hac","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:28:12Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720Hnm","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:28:19Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720H2Q","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:28:26Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720IFd","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:28:34Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720ITU","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:28:42Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720IgE","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:28:49Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720Ivi","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:28:57Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720I8b","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:29:05Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720JKd","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:29:12Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720JZv","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:29:20Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8720Joo","author":{"login":"AvanishKulkarni"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-20T14:29:28Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8722OQg","author":{"login":"FardeenI"},"authorAssociation":"MEMBER","body":"- [ ] **Prioritize Logic over Style:** Mostly solid, but there’s a `this`-binding hazard in `metaTagService` (and `MetaTagCache`) that can cause runtime failures if methods are destructured.\n- [ ] **Security First:** A full LLM session log is committed under `llm-logs/` (includes local paths + tool output). This is a real data-leak risk and shouldn’t land in `main`.\n- [ ] **Architectural Alignment:** Core structure matches the spec intent, but a couple stub contracts are still inconsistent (see `scheduleRegeneration`).\n- [ ] **Issue Completion:** The skeleton looks close, but the accidental log file + contract mismatch should be fixed before merge.\n- [x] **No Nitpicking:** Feedback below is limited to correctness, security, and future breakage risks.\n- [x] **Avoid Repetition:** I’m not rehashing the already-resolved spec-signature threads.\n- [x] **Iterative Reviews:** Prior review threads appear resolved; focusing only on remaining issues.\n- [ ] **Prevent CI Failures:** CI is green, but the `this` pitfall can still break runtime usage patterns.\n\n## Review (Request changes)\n\n### 1) 🚫 Remove committed session log (security/privacy)\n**File:** `llm-logs/2026-04-20-094302-session-ce430386.md`\n\nThis appears to be an exported agent conversation log (includes local filesystem paths like `/Users/...` and detailed tool outputs). Even if nothing secret is present *today*, it’s an easy footgun and shouldn’t be versioned.\n\n**Actionable fix:**\n- `git rm llm-logs/2026-04-20-094302-session-ce430386.md`\n- Add an ignore rule so it doesn’t happen again (pick the narrowest that matches project intent), e.g.:\n  - `llm-logs/*.md` (or `llm-logs/**` if the whole folder is meant to be local-only)\n\n### 2) Avoid `this` inside exported object-literal services (runtime hazard)\nIf any caller does destructuring, e.g. `const { getOrGenerateCachedFromContext } = metaTagService;`, `this` becomes `undefined` and `this.generateMetaTagsFromContext(...)` will throw.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// current\nconst tags = await this.generateMetaTagsFromContext(channel, messages);\n\n// suggested (no this-binding hazard)\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\n// or refactor helpers outside the object and call them directly\n```\n\nRelated: `MetaTagCache.set()` uses `ttl ?? this.ttl` with the same hazard.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagCache.ts`\n```ts\n// current\nawait cacheService.set(key, tags, { ttl: ttl ?? this.ttl });\n\n// suggested\nawait cacheService.set(key, tags, { ttl: ttl ?? DEFAULT_TTL });\n```\n\n### 3) `scheduleRegeneration` signature/return type mismatch\nRight now the function *returns* `{ priority, idempotencyKey }` conditionally, but the declared return type omits them, and the parameters are positional instead of an options object.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// suggested contract (matches how this will likely be called + avoids positional arg confusion)\nasync scheduleRegeneration(\n  channelId: string,\n  options?: { priority?: 'high' | 'normal' | 'low'; idempotencyKey?: string },\n): Promise<{\n  jobId: string;\n  status: 'queued' | 'deduplicated';\n  priority?: 'high' | 'normal' | 'low';\n  idempotencyKey?: string;\n}> {\n  return {\n    jobId: `meta-tag-regeneration:${channelId}`,\n    status: 'queued',\n    priority: options?.priority,\n    idempotencyKey: options?.idempotencyKey,\n  };\n}\n```\n(Alternatively: keep the simpler return type, but then remove the extra returned fields so the stub is honest.)\n\n---\n\nOnce those are addressed, this looks in good shape to merge: CI is green, tests cover the key length/sanitization/fallback paths, and the service structure is a good foundation for M4 wiring.\n","submittedAt":"2026-04-20T15:42:01Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"}},{"id":"PRR_kwDORIrGY8723mNT","author":{"login":"acabrera04"},"authorAssociation":"MEMBER","body":"## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n","submittedAt":"2026-04-20T16:30:25Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":"c3a7a608c10576b751659ca1926be95566392b28"}},{"id":"PRR_kwDORIrGY8723p2q","author":{"login":"acabrera04"},"authorAssociation":"MEMBER","body":"## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n","submittedAt":"2026-04-20T16:32:29Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":"c3a7a608c10576b751659ca1926be95566392b28"}}]}
````

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls/443/reviews | jq 'map({id,user:.user.login,state,submitted_at,body})[-5:]'
```

Output:

````text
[
  {
    "id": 4140865135,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-20T14:29:20Z",
    "body": ""
  },
  {
    "id": 4140866088,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-20T14:29:28Z",
    "body": ""
  },
  {
    "id": 4141409312,
    "user": "FardeenI",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T15:42:01Z",
    "body": "- [ ] **Prioritize Logic over Style:** Mostly solid, but there’s a `this`-binding hazard in `metaTagService` (and `MetaTagCache`) that can cause runtime failures if methods are destructured.\n- [ ] **Security First:** A full LLM session log is committed under `llm-logs/` (includes local paths + tool output). This is a real data-leak risk and shouldn’t land in `main`.\n- [ ] **Architectural Alignment:** Core structure matches the spec intent, but a couple stub contracts are still inconsistent (see `scheduleRegeneration`).\n- [ ] **Issue Completion:** The skeleton looks close, but the accidental log file + contract mismatch should be fixed before merge.\n- [x] **No Nitpicking:** Feedback below is limited to correctness, security, and future breakage risks.\n- [x] **Avoid Repetition:** I’m not rehashing the already-resolved spec-signature threads.\n- [x] **Iterative Reviews:** Prior review threads appear resolved; focusing only on remaining issues.\n- [ ] **Prevent CI Failures:** CI is green, but the `this` pitfall can still break runtime usage patterns.\n\n## Review (Request changes)\n\n### 1) 🚫 Remove committed session log (security/privacy)\n**File:** `llm-logs/2026-04-20-094302-session-ce430386.md`\n\nThis appears to be an exported agent conversation log (includes local filesystem paths like `/Users/...` and detailed tool outputs). Even if nothing secret is present *today*, it’s an easy footgun and shouldn’t be versioned.\n\n**Actionable fix:**\n- `git rm llm-logs/2026-04-20-094302-session-ce430386.md`\n- Add an ignore rule so it doesn’t happen again (pick the narrowest that matches project intent), e.g.:\n  - `llm-logs/*.md` (or `llm-logs/**` if the whole folder is meant to be local-only)\n\n### 2) Avoid `this` inside exported object-literal services (runtime hazard)\nIf any caller does destructuring, e.g. `const { getOrGenerateCachedFromContext } = metaTagService;`, `this` becomes `undefined` and `this.generateMetaTagsFromContext(...)` will throw.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// current\nconst tags = await this.generateMetaTagsFromContext(channel, messages);\n\n// suggested (no this-binding hazard)\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\n// or refactor helpers outside the object and call them directly\n```\n\nRelated: `MetaTagCache.set()` uses `ttl ?? this.ttl` with the same hazard.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagCache.ts`\n```ts\n// current\nawait cacheService.set(key, tags, { ttl: ttl ?? this.ttl });\n\n// suggested\nawait cacheService.set(key, tags, { ttl: ttl ?? DEFAULT_TTL });\n```\n\n### 3) `scheduleRegeneration` signature/return type mismatch\nRight now the function *returns* `{ priority, idempotencyKey }` conditionally, but the declared return type omits them, and the parameters are positional instead of an options object.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// suggested contract (matches how this will likely be called + avoids positional arg confusion)\nasync scheduleRegeneration(\n  channelId: string,\n  options?: { priority?: 'high' | 'normal' | 'low'; idempotencyKey?: string },\n): Promise<{\n  jobId: string;\n  status: 'queued' | 'deduplicated';\n  priority?: 'high' | 'normal' | 'low';\n  idempotencyKey?: string;\n}> {\n  return {\n    jobId: `meta-tag-regeneration:${channelId}`,\n    status: 'queued',\n    priority: options?.priority,\n    idempotencyKey: options?.idempotencyKey,\n  };\n}\n```\n(Alternatively: keep the simpler return type, but then remove the extra returned fields so the stub is honest.)\n\n---\n\nOnce those are addressed, this looks in good shape to merge: CI is green, tests cover the key length/sanitization/fallback paths, and the service structure is a good foundation for M4 wiring.\n"
  },
  {
    "id": 4141769555,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:30:25Z",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n"
  },
  {
    "id": 4141784490,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:32:29Z",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n"
  }
]
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T16:33:16.814Z

It’s posted.

GitHub shows two `REQUEST_CHANGES` reviews from `acabrera04` on PR #443, submitted on April 20, 2026 at `16:30:25Z` and `16:32:29Z`. The second one is a duplicate from the retry after the network reset, but the review content is there on the PR now.

<oai-mem-citation>
<citation_entries>
MEMORY.md:187-187|note=[used Harmony review workflow reminder to verify the review was actually posted]
MEMORY.md:118-120|note=[used Harmony PR review workflow memory entry for repo-specific review process]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>

### Turn 3: <environment_context> <shell>zsh</shell>

#### 👤 User Prompt

- Time: 2026-04-21T19:22:26.373Z

```text
<environment_context>
  <shell>zsh</shell>
  <current_date>2026-04-21</current_date>
  <timezone>America/New_York</timezone>
</environment_context>
```

_No assistant or tool activity recorded after this prompt._

### Turn 4: review

#### 👤 User Prompt

- Time: 2026-04-21T19:22:26.376Z

```text
review again
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:22:36.768Z

Re-reviewing PR #443 from the latest head. I’ll reload the repo review rules, compare the newest commits against the prior findings, and post either approval or remaining requested changes.

#### Tool: exec_command

```sh
sed -n '1,220p' WORKFLOW.md
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
sed -n '1,260p' .github/PR_REVIEW.md
```

Output:

```text
# PR Review Guidelines

When conducting PR Reviews, follow these guidelines:
1. **Prioritize Logic over Style:** Ensure the code is efficient, DRY (Don't Repeat Yourself), and logically sound.
2. **Security First:** Verify that the changes do not introduce vulnerabilities (e.g., lack of input validation, exposed secrets).
3. **Architectural Alignment:** If applicable, ensure the changes adhere strictly to the patterns defined in `@../docs/unified-backend-architecture.md`.
4. **Issue Completion:** If the PR is attached to an issue, verify that the code successfully satisfies every acceptance criteria of that issue.
5. **No Nitpicking:** Do not leave comments regarding stylistic choices, formatting, or subjective naming conventions unless they violate core project readability. Focus only on critical logic, performance, or architectural flaws.
6. **Avoid Repetition:** Do not repeat feedback that has already been stated in previous reviews on this PR.
7. **Iterative Reviews:** If this is not your first review on the PR:
    - First, check if the new commits have correctly addressed your previous review comments.
    - If a previous concern has been addressed, explicitly resolve the associated comment.
8. **Prevent CI Failures:** Analyze the code for obvious issues that would break the pipeline. Specifically check for syntax errors, missing imports/dependencies, unhandled exceptions, and logic that would clearly break existing tests.

**Execution Instruction**: Before providing your code feedback, output a markdown checklist of the 8 guidelines above. Mark each one as [x] if it passes or [ ] if it fails, and briefly explain why. Then, provide your single bundled review. Use inline subcomments within that single review for specific lines of codes. Do not post multiple standalone comments.
```

#### Tool: exec_command

```sh
rg -n "Harmony PR review|PR review workflow|review-resolution" /Users/allen/.codex/memories/MEMORY.md
```

Output:

```text
155:# Task Group: Harmony PR review and review-resolution workflow
157:applies_to: cwd=/Users/allen/.codex/worktrees/*/Harmony; reuse_rule=safe for Harmony PR review tasks that follow the repo's `WORKFLOW.md` and `.github/PR_REVIEW.md`; verify current remote/worktree before assuming repo names or branch refs.
189:- Harmony PR review, .github/PR_REVIEW.md, WORKFLOW.md, bundled review, single bundled review, checklist of 8 guidelines, gh pr view, gh pr diff, gh pr review, gh api, file_comments expected objects not strings, acabrera04/Harmony, EmptyShell, VoiceProvider, system admin bypass, useChannelEvents, useServerEvents, SSE reconnect
234:- In Harmony PR reviews, load `WORKFLOW.md` and `.github/PR_REVIEW.md` first. The durable pattern is checklist first, then one bundled review with line-specific findings or a clear approval if the updated head is good [Task 1][Task 2][Task 3][Task 4][Task 6]
243:- For Harmony review-resolution work, `npx agent-reviews --pr <number> --unanswered --expanded` is the reliable fetch path when branch auto-detection fails. After replying, `npx agent-reviews --pr <number> --watch --timeout 60` is the clean way to confirm no new comments arrived [Task 5]
291:- symptom: `agent-reviews` says "No open PR found for branch" -> cause: the local remote still points at the wrong repository namespace -> fix: update `origin` to the canonical repo before rerunning the review-resolution tooling [Task 1]
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:22:47.810Z

The worktree is clean and the review rules require a single bundled review with the 8-point checklist. I’m fetching the latest PR head and existing review state now so I can avoid duplicate feedback.

#### Tool: exec_command

```sh
git fetch origin main pull/443/head:pr-443 --force
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            main               -> FETCH_HEAD
   85d862f..883e71d  refs/pull/443/head -> pr-443
```

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json number,title,headRefName,baseRefName,headRefOid,reviewDecision,mergeStateStatus,commits,files
```

Output:

```text
{"baseRefName":"main","commits":[{"authoredDate":"2026-04-20T13:39:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:39:37Z","messageBody":"…350)\n\nAdds CL-C2.1–C2.6 per dev spec §3/§4:\n- MetaTagService facade with generateMetaTags, getOrGenerateCached,\n  invalidateCache, and stub scheduleRegeneration/getRegenerationJobStatus\n- TitleGenerator enforcing ≤60 char limit with sanitization and templates\n- DescriptionGenerator enforcing 50–160 char range with key phrase extraction\n- OpenGraphGenerator and StructuredDataGenerator (skeleton implementations)\n- MetaTagCache backed by Redis via existing cacheService + CacheKeys.metaChannel\n- AC-9: fallback tags with needsRegeneration=true on generation failure\n- 28 unit tests covering AC-2 length limits, sanitization, cache, and fallback\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat(seo): implement M2 meta tag generation service skeleton (issue #…","oid":"e8875f5e9ef5220b017e4b2e855d8d576a8a0713"},{"authoredDate":"2026-04-20T13:42:00Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:42:00Z","messageBody":"Extends summarizeThread to append channel context when the composed\ntext falls below the 50-char minimum, satisfying AC-2 for all inputs\nincluding single-word messages. Adds a regression test.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix(seo): enforce 50-char minimum on auto-generated descriptions (AC-2)","oid":"898f94332cbe35434ecf4661c778ccb07927f1f0"},{"authoredDate":"2026-04-20T13:43:04Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T13:43:04Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"94fa035019a4c79638d269724697d5433e7563bc"},{"authoredDate":"2026-04-20T14:27:39Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T14:27:39Z","messageBody":"- titleGenerator: sanitize full composed string in generateFromMessage;\n  use replaceAll in applyTemplate to handle repeated placeholders\n- descriptionGenerator: add sanitizeText helper; sanitize channel fields\n  in summarizeThread; enforce 50-char minimum in enforceLength (AC-2)\n- openGraphGenerator: add channel param to generateTwitterCard; use\n  summary_large_image only when a real preview image is available\n- structuredDataGenerator: use BASE_URL env var in generateBreadcrumbList;\n  add stub datePublished/author fields to generateDiscussionForum\n- metaTagCache: make set() use this.ttl as single source of truth\n- metaTagService: sanitize channel context in buildFallbackTags; rename\n  internal methods to generateMetaTagsFromContext / getOrGenerateCachedFromContext;\n  add spec-aligned stub signatures for generateMetaTags(channelId),\n  getOrGenerateCached(channelId), getMetaTagsForPreview(channelId);\n  fix scheduleRegeneration return type and getRegenerationJobStatus signature\n- types: add MetaTagPreview and MetaTagJobStatus interfaces per spec\n- regenerate Prisma client; apply add_meta_tag_overrides migration so\n  metaTag.repository tests compile and pass\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings for M2 meta tag service skeleton","oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"authoredDate":"2026-04-20T16:26:29Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T16:26:29Z","messageBody":"… stubs, scheduleRegeneration return)\n\n- Replace this.generateMetaTagsFromContext with metaTagService.* to avoid destructuring hazard\n- Replace this.ttl with DEFAULT_TTL in MetaTagCache.set to avoid destructuring hazard\n- Remove extra priority/idempotencyKey fields from scheduleRegeneration return to match declared type\n- Add IMetaTagGenerator generate()/validate() stubs to TitleGenerator, DescriptionGenerator, OpenGraphGenerator (CL-I1)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings (this-binding, IMetaTagGenerator…","oid":"85d862fcc5f85f782368504916607f4eb1e45164"},{"authoredDate":"2026-04-20T16:28:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T16:28:37Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"c3a7a608c10576b751659ca1926be95566392b28"},{"authoredDate":"2026-04-21T19:19:46Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:19:46Z","messageBody":"…k, contract alignment\n\n- Align generator signatures to spec §9.1: extractKeyPhrases(content, maxPhrases),\n  summarizeThread(messages), generateOGTags/generateTwitterCard(channel, server, analysis),\n  selectPreviewImage(channel, messages), generateDiscussionForum(channel, messages, server),\n  generateBreadcrumbList(server, channel), generateOrganization(server),\n  generateWebPage(channel, metaTags)\n- Fix this-binding hazard in OpenGraphGenerator (selectPreviewImage calls)\n- Do not cache fallback tags when needsRegeneration=true — prevents transient failures\n  from poisoning the Redis cache for the full TTL\n- Fix getRegenerationJobStatus: remove | null, throw not-implemented to match spec contract\n- Add errorCode/errorMessage fields to MetaTagJobStatus per spec §9.1 / OpenAPI schema\n- Add regression test: getOrGenerateCachedFromContext must not write to cache on failure\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings — spec signatures, cache fallbac…","oid":"883e71d96e3e7c383767da13cc6331a61b3b074d"}],"files":[{"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","additions":99,"deletions":0},{"path":"harmony-backend/src/services/metaTag/metaTagCache.ts","additions":22,"deletions":0},{"path":"harmony-backend/src/services/metaTag/metaTagService.ts","additions":162,"deletions":0},{"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","additions":60,"deletions":0},{"path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","additions":71,"deletions":0},{"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","additions":65,"deletions":0},{"path":"harmony-backend/src/services/metaTag/types.ts","additions":95,"deletions":0},{"path":"harmony-backend/tests/metaTagService.test.ts","additions":294,"deletions":0},{"path":"llm-logs/2026-04-20-094302-session-ce430386.md","additions":784,"deletions":0},{"path":"llm-logs/2026-04-20-122835-session-b13d715d.md","additions":942,"deletions":0}],"headRefName":"feature/issue-350-meta-tag-service-skeleton","headRefOid":"883e71d96e3e7c383767da13cc6331a61b3b074d","mergeStateStatus":"BLOCKED","number":443,"reviewDecision":"CHANGES_REQUESTED","title":"feat(seo): M2 meta tag generation service skeleton (issue #350)"}
```

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls/443/reviews | jq 'map({id,user:.user.login,state,submitted_at,commit_id,body})[-8:]'
```

Output:

````text
[
  {
    "id": 4140864157,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-20T14:29:12Z",
    "commit_id": "177c3840e118d1c429fe3cd0f10bc40ad842eb32",
    "body": ""
  },
  {
    "id": 4140865135,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-20T14:29:20Z",
    "commit_id": "177c3840e118d1c429fe3cd0f10bc40ad842eb32",
    "body": ""
  },
  {
    "id": 4140866088,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-20T14:29:28Z",
    "commit_id": "177c3840e118d1c429fe3cd0f10bc40ad842eb32",
    "body": ""
  },
  {
    "id": 4141409312,
    "user": "FardeenI",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T15:42:01Z",
    "commit_id": "177c3840e118d1c429fe3cd0f10bc40ad842eb32",
    "body": "- [ ] **Prioritize Logic over Style:** Mostly solid, but there’s a `this`-binding hazard in `metaTagService` (and `MetaTagCache`) that can cause runtime failures if methods are destructured.\n- [ ] **Security First:** A full LLM session log is committed under `llm-logs/` (includes local paths + tool output). This is a real data-leak risk and shouldn’t land in `main`.\n- [ ] **Architectural Alignment:** Core structure matches the spec intent, but a couple stub contracts are still inconsistent (see `scheduleRegeneration`).\n- [ ] **Issue Completion:** The skeleton looks close, but the accidental log file + contract mismatch should be fixed before merge.\n- [x] **No Nitpicking:** Feedback below is limited to correctness, security, and future breakage risks.\n- [x] **Avoid Repetition:** I’m not rehashing the already-resolved spec-signature threads.\n- [x] **Iterative Reviews:** Prior review threads appear resolved; focusing only on remaining issues.\n- [ ] **Prevent CI Failures:** CI is green, but the `this` pitfall can still break runtime usage patterns.\n\n## Review (Request changes)\n\n### 1) 🚫 Remove committed session log (security/privacy)\n**File:** `llm-logs/2026-04-20-094302-session-ce430386.md`\n\nThis appears to be an exported agent conversation log (includes local filesystem paths like `/Users/...` and detailed tool outputs). Even if nothing secret is present *today*, it’s an easy footgun and shouldn’t be versioned.\n\n**Actionable fix:**\n- `git rm llm-logs/2026-04-20-094302-session-ce430386.md`\n- Add an ignore rule so it doesn’t happen again (pick the narrowest that matches project intent), e.g.:\n  - `llm-logs/*.md` (or `llm-logs/**` if the whole folder is meant to be local-only)\n\n### 2) Avoid `this` inside exported object-literal services (runtime hazard)\nIf any caller does destructuring, e.g. `const { getOrGenerateCachedFromContext } = metaTagService;`, `this` becomes `undefined` and `this.generateMetaTagsFromContext(...)` will throw.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// current\nconst tags = await this.generateMetaTagsFromContext(channel, messages);\n\n// suggested (no this-binding hazard)\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\n// or refactor helpers outside the object and call them directly\n```\n\nRelated: `MetaTagCache.set()` uses `ttl ?? this.ttl` with the same hazard.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagCache.ts`\n```ts\n// current\nawait cacheService.set(key, tags, { ttl: ttl ?? this.ttl });\n\n// suggested\nawait cacheService.set(key, tags, { ttl: ttl ?? DEFAULT_TTL });\n```\n\n### 3) `scheduleRegeneration` signature/return type mismatch\nRight now the function *returns* `{ priority, idempotencyKey }` conditionally, but the declared return type omits them, and the parameters are positional instead of an options object.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// suggested contract (matches how this will likely be called + avoids positional arg confusion)\nasync scheduleRegeneration(\n  channelId: string,\n  options?: { priority?: 'high' | 'normal' | 'low'; idempotencyKey?: string },\n): Promise<{\n  jobId: string;\n  status: 'queued' | 'deduplicated';\n  priority?: 'high' | 'normal' | 'low';\n  idempotencyKey?: string;\n}> {\n  return {\n    jobId: `meta-tag-regeneration:${channelId}`,\n    status: 'queued',\n    priority: options?.priority,\n    idempotencyKey: options?.idempotencyKey,\n  };\n}\n```\n(Alternatively: keep the simpler return type, but then remove the extra returned fields so the stub is honest.)\n\n---\n\nOnce those are addressed, this looks in good shape to merge: CI is green, tests cover the key length/sanitization/fallback paths, and the service structure is a good foundation for M4 wiring.\n"
  },
  {
    "id": 4141769555,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:30:25Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n"
  },
  {
    "id": 4141784490,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:32:29Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n"
  },
  {
    "id": 4141792373,
    "user": "FardeenI",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:33:39Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "- [x] **Prioritize Logic over Style:** Focusing on correctness/contract drift (not formatting).\n- [x] **Security First:** No secrets added; sanitization added for user-controlled strings.\n- [ ] **Architectural Alignment:** Several public method signatures still diverge from `docs/dev-spec-seo-meta-tag-generation.md` §9.1.*.\n- [ ] **Issue Completion:** Issue #350 AC requires spec-named signatures; a few are still mismatched.\n- [x] **No Nitpicking:** No style-only feedback.\n- [x] **Avoid Repetition:** Not repeating already-addressed review threads.\n- [x] **Iterative Reviews:** Considered existing review threads before adding new feedback.\n- [x] **Prevent CI Failures:** CI is green; requested changes are contract/spec alignment to prevent future breakage.\n\n---\n\n## Requested changes (actionable)\n\n### 1) Align generator method signatures to the SEO spec (Issue #350 AC)\nRight now the M2 “skeleton” compiles/tests, but several exported method signatures don’t match the spec prototypes in `docs/dev-spec-seo-meta-tag-generation.md` §9.1. That’s likely to cause downstream integration churn when M3/M4 wiring lands.\n\n**`harmony-backend/src/services/metaTag/openGraphGenerator.ts`**\nSpec expects:\n- `generateOGTags(channel: Channel, server: Server, analysis: ContentAnalysis): OpenGraphTags`\n- `generateTwitterCard(channel: Channel, server: Server, analysis: ContentAnalysis): TwitterCardTags`\n- `selectPreviewImage(channel: Channel, messages: Message[]): string | null`\n\nCurrent signatures are `(channel, title, description)` and `selectPreviewImage(channel): string`.\n\n**Suggestion:** keep your current placeholder logic, but change the exported signatures to match spec and adapt callers (e.g. in `MetaTagService`, pass a placeholder `analysis` for now and ignore unused args in the generator).\n\n**`harmony-backend/src/services/metaTag/structuredDataGenerator.ts`**\nSpec expects:\n- `generateDiscussionForum(channel, messages, server)`\n- `generateBreadcrumbList(server, channel)`\n- `generateOrganization(server)`\n- `generateWebPage(channel, metaTags)`\n\nCurrent signatures are `(channel, title, description)` / `(channel)` / `()` / `(channel, title, description)`.\n\n**Suggestion:** change signatures to spec and keep stubs internally (you can still leave `author/datePublished` unset until M4).\n\n**`harmony-backend/src/services/metaTag/descriptionGenerator.ts`**\nSpec expects:\n- `extractKeyPhrases(content: string, maxPhrases: number): string[]`\n- `summarizeThread(messages: Message[]): string`\n\nCurrent `extractKeyPhrases(messages[])` and `summarizeThread(messages, channel)` diverge.\n\n**Suggestion:** add/rename the spec-shaped methods (they can be thin wrappers around your current logic: join messages -> content; keep `maxPhrases` configurable rather than hardcoded to 5).\n\n### 2) Spec return type for `getRegenerationJobStatus`\nIn `harmony-backend/src/services/metaTag/metaTagService.ts`, spec has `Promise<MetaTagJobStatus>`; current stub returns `Promise<MetaTagJobStatus | null>`.\n\n**Suggestion:** for a stub, prefer throwing `not implemented` (or return a placeholder status) to keep the signature aligned.\n\n### 3) (Optional) PR signal/noise\nThis PR includes 2 new `llm-logs/*.md` artifacts. If those are required by process, OK—just noting it makes reviews harder to scan.\n"
  },
  {
    "id": 4150247194,
    "user": "chatgpt-codex-connector[bot]",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:18:02Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "\n### 💡 Codex Review\n\nHere are some automated review suggestions for this pull request.\n\n**Reviewed commit:** `c3a7a608c1`\n    \n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment \"@codex review\".\n\nIf Codex has suggestions, it will comment; otherwise it will react with 👍.\n\n\n\n\nCodex can also answer questions or update the PR. Try commenting \"@codex address that feedback\".\n            \n</details>"
  }
]
````

#### Tool: exec_command

```sh
gh api graphql -f query='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{isResolved path line comments(first:20){nodes{author{login} body url createdAt}}}}}}}' -F owner=CS485-Harmony -F repo=Harmony -F number=443
```

Output:

````text
{"data":{"repository":{"pullRequest":{"reviewThreads":{"nodes":[{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagService.generateMetaTags signature diverges from the dev spec referenced by this PR (spec defines generateMetaTags(channelId, options?) and expects the service to fetch context internally). Either align the method signature/behavior to the spec or update the spec/PR description so downstream integrations don’t drift.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142149","createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. The context-driven implementation is renamed to generateMetaTagsFromContext(channel, messages) for unit tests. A spec-aligned stub generateMetaTags(channelId, options?) is added that throws 'not implemented — wired by M4 (issue #356)'. Callers will be updated to the spec signature when the channel-resolver is wired in M4.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111398713","createdAt":"2026-04-20T14:29:20Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"scheduleRegeneration stub does not match the spec return shape (spec expects a jobId and queued/deduplicated status, plus optional priority/idempotencyKey). Even as a stub, keeping the spec signature/return type will prevent a breaking refactor when M4 wires the queue.\n```suggestion\n  async scheduleRegeneration(\n    channelId: string,\n    options?: { priority?: string; idempotencyKey?: string },\n  ): Promise<{\n    jobId: string;\n    status: 'queued' | 'deduplicated';\n    priority?: string;\n    idempotencyKey?: string;\n  }> {\n    // Queuing logic wired by M4 MetaTagUpdateWorker.\n    // Keep the stub contract aligned with the queue spec to avoid a breaking API change later.\n    return {\n      jobId: `meta-tag-regeneration:${channelId}`,\n      status: 'queued',\n      priority: options?.priority,\n      idempotencyKey: options?.idempotencyKey,\n    };\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142223","createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. scheduleRegeneration now returns Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> with the stub returning a placeholder jobId, matching the spec contract for AC-5/AC-6.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111395320","createdAt":"2026-04-20T14:28:49Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getRegenerationJobStatus stub signature differs from the spec (spec takes both channelId and jobId and returns a MetaTagJobStatus object). Keeping the correct parameters/return type now will make M4 wiring straightforward.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142302","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. getRegenerationJobStatus now takes (channelId: string, jobId: string) and returns Promise<MetaTagJobStatus | null>. MetaTagJobStatus type added to types.ts per spec.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111394608","createdAt":"2026-04-20T14:28:42Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"OpenGraphGenerator.generateOGTags signature doesn’t match the dev spec for CL-C2.4 (spec describes channel/server/analysis-driven generation). If this module is meant to satisfy the spec interface for later wiring, adjust the signature (or add an adapter) to avoid refactors.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142353","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"generateOGTags already accepts channel as its first parameter (unchanged). The related generateTwitterCard signature was aligned with spec in 177c384 (channel is now the first param). The broader spec-signature alignment for generateMetaTags/getOrGenerateCached is addressed separately — see those threads.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111399582","createdAt":"2026-04-20T14:29:28Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/types.ts","line":40,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagSet includes needsRegeneration, but the dev spec’s CL-D1 MetaTagSet DTO doesn’t include this field (needs_regeneration is modeled in persistence metadata). Consider keeping regeneration status separate (wrapper type) or update the DTO/spec consistently to avoid contract drift.\n```suggestion\n  keywords: string[];\n}\n\nexport interface MetaTagSetWithRegenerationStatus {\n  metaTags: MetaTagSet;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142384","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Won't fix: The existing unit tests directly assert tags.needsRegeneration (AC-9 test, fallback test), so removing the field from MetaTagSet would break them. Keeping it on the DTO for now; can be split into a wrapper type when the full persistence layer lands in M3/M4.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111397887","createdAt":"2026-04-20T14:29:12Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"DescriptionGenerator.enforceLength only truncates >160 chars and never enforces the 50-char minimum, so generateFromMessages can return descriptions shorter than 50 characters for short channel/server names or very short messages (violates AC-2). Update the length policy to guarantee MIN_LENGTH before returning (e.g., append more context deterministically).\n```suggestion\n  padToMinimumLength(text: string): string {\n    const additions = [\n      ' Join the discussion.',\n      ' Explore the latest updates.',\n      ' Connect with the community.',\n    ];\n\n    let padded = text.trim();\n    if (padded.length === 0) {\n      padded = 'Join the discussion and explore the latest updates.';\n    }\n\n    let additionIndex = 0;\n    while (padded.length < MIN_LENGTH) {\n      padded += additions[additionIndex % additions.length];\n      additionIndex += 1;\n    }\n\n    return padded;\n  },\n\n  enforceLength(text: string): string {\n    let result = text;\n    if (result.length < MIN_LENGTH) {\n      result = this.padToMinimumLength(result);\n    }\n\n    if (result.length > MAX_LENGTH) {\n      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';\n    }\n    return result;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142433","createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. enforceLength now pads text below 50 chars by appending context phrases before truncating. All AC-2 unit tests pass.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111391256","createdAt":"2026-04-20T14:28:12Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"TitleGenerator.generateFromMessage sanitizes only message.content; channel.serverName is appended without sanitization/normalization. Since server names are user-controlled, sanitize the full composed string (or sanitize serverName separately) before truncation to keep title output consistently safe.\n```suggestion\n    const raw = `${message.content} — ${channel.serverName}`;\n    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142492","createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Now sanitizes the full composed string (message.content + channel.serverName) via sanitizeForTitle before truncation.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111389802","createdAt":"2026-04-20T14:27:58Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"applyTemplate uses String.replace per variable, which only replaces the first occurrence of each placeholder. If a template repeats a placeholder (common in localized templates), later occurrences will remain unreplaced. Use a global replacement strategy (e.g., replaceAll or a global RegExp) per key.\n```suggestion\n      (result, [key, value]) => result.replaceAll(`{${key}}`, value),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142532","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Changed result.replace to result.replaceAll so all occurrences of each placeholder are substituted.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111389110","createdAt":"2026-04-20T14:27:52Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"summarizeThread interpolates channel.name and channel.serverName directly into the output without sanitizing/normalizing them. Since these are user-controlled strings, meta descriptions can contain HTML/attribute-breaking characters. Sanitize channel/server fields the same way you sanitize message content.\n```suggestion\n  sanitizeText(text: string): string {\n    return text.replace(/<[^>]*>/g, '').replace(/\\s+/g, ' ').trim();\n  },\n\n  summarizeThread(messages: MessageContext[], channel: ChannelContext): string {\n    const serverName = this.sanitizeText(channel.serverName);\n    const channelName = this.sanitizeText(channel.name);\n    const suffix = ` — Join the discussion on ${serverName}.`;\n\n    if (messages.length === 0) {\n      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;\n      return this.enforceLength(base);\n    }\n\n    const first = this.sanitizeText(messages[0].content);\n    const prefix = `${serverName} › #${channelName}: `;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142575","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added sanitizeText helper to DescriptionGenerator; summarizeThread now sanitizes channel.name and channel.serverName before interpolation.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111390561","createdAt":"2026-04-20T14:28:05Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getOrGenerateCached currently requires ChannelContext + MessageContext[] + optional ttl, but the spec API is getOrGenerateCached(channelId) with caching handled internally. Consider aligning the signature (and moving message fetching inside) to match the spec contract.\n```suggestion\n  async resolveChannelContext(_channelId: string): Promise<ChannelContext> {\n    throw new Error('metaTagService.resolveChannelContext must be implemented with channel lookup');\n  },\n\n  async resolveMessageContexts(_channelId: string): Promise<MessageContext[]> {\n    throw new Error('metaTagService.resolveMessageContexts must be implemented with message lookup');\n  },\n\n  async getOrGenerateCached(\n    channelOrId: ChannelContext | string,\n    messagesOrTtl?: MessageContext[] | number,\n    ttl?: number,\n  ): Promise<MetaTagSet> {\n    const channelId = typeof channelOrId === 'string' ? channelOrId : channelOrId.id;\n    const cached = await MetaTagCache.get(channelId);\n    if (cached) return cached;\n\n    const channel =\n      typeof channelOrId === 'string'\n        ? await this.resolveChannelContext(channelOrId)\n        : channelOrId;\n    const messages =\n      typeof channelOrId === 'string'\n        ? await this.resolveMessageContexts(channelOrId)\n        : Array.isArray(messagesOrTtl)\n          ? messagesOrTtl\n          : [];\n    const cacheTtl =\n      typeof messagesOrTtl === 'number'\n        ? messagesOrTtl\n        : ttl;\n\n    const tags = await this.generateMetaTags(channel, messages);\n    await MetaTagCache.set(channel.id, tags, cacheTtl);\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142625","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added spec-aligned stub getOrGenerateCached(channelId: string) that throws 'not implemented — wired by M4'. The context-driven variant is renamed to getOrGenerateCachedFromContext(channel, messages, ttl?) for use in unit tests and internal generation flow.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111397023","createdAt":"2026-04-20T14:29:05Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagCache.ts","line":11,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagCache exposes a ttl property, but set() defaults to DEFAULT_TTL rather than the exported ttl field, so MetaTagCache.ttl is effectively unused/misleading. Consider making ttl the single source of truth (or remove the field).","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142686","createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. set() now uses ttl ?? this.ttl so MetaTagCache.ttl is the single source of truth for the default TTL.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111392031","createdAt":"2026-04-20T14:28:19Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","line":37,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateBreadcrumbList hard-codes the https://harmony.chat domain for the server URL. Use the same configurable BASE_URL/origin used elsewhere so structured data is correct in staging/dev/alternate deployments.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142725","createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateBreadcrumbList now reads process.env.BASE_URL ?? 'https://harmony.chat' consistent with metaTagService.ts.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111392817","createdAt":"2026-04-20T14:28:26Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateTwitterCard signature also diverges from the spec’s CL-C2.4 API (spec is channel/server/analysis-based, not raw strings). Consider aligning the public API now (even if the implementation is still a skeleton).\n```suggestion\n  generateTwitterCard(\n    channel: ChannelContext,\n    title: string,\n    description: string,\n    image?: string,\n  ): TwitterCardTags {\n    return {\n      card: 'summary_large_image',\n      title,\n      description,\n      image: image ?? this.selectPreviewImage(channel),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142775","createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateTwitterCard now accepts channel as the first parameter (matching spec CL-C2.4). Also fixed the card type: uses 'summary' by default, only 'summary_large_image' when a non-default preview image is available.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111393786","createdAt":"2026-04-20T14:28:34Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"buildFallbackTags uses raw channel/server names and only truncates/enforces max length; it does not sanitize. Because fallback is used on generation errors, it should still produce sanitized values to avoid unsafe content flowing into rendered <head>. Route fallback strings through the same sanitization/normalization as the main generators.\n```suggestion\nimport sanitizeHtml from 'sanitize-html';\n\nconst logger = createLogger({ component: 'meta-tag-service' });\n\nconst BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';\n\nfunction sanitizeMetaText(value: string): string {\n  return sanitizeHtml(value, {\n    allowedTags: [],\n    allowedAttributes: {},\n  }).replace(/\\s+/g, ' ').trim();\n}\n\nfunction buildFallbackTags(channel: ChannelContext): MetaTagSet {\n  const sanitizedChannel: ChannelContext = {\n    ...channel,\n    name: sanitizeMetaText(channel.name),\n    serverName: sanitizeMetaText(channel.serverName),\n  };\n  const title = `${sanitizedChannel.name} — ${sanitizedChannel.serverName}`;\n  const description = `Discussions in #${sanitizedChannel.name} on ${sanitizedChannel.serverName}.`;\n  return {\n    title: TitleGenerator.truncateWithEllipsis(title),\n    description: DescriptionGenerator.enforceLength(description),\n    canonical: sanitizedChannel.canonicalUrl,\n    robots: 'index, follow',\n    openGraph: OpenGraphGenerator.generateOGTags(sanitizedChannel, title, description),\n    twitter: OpenGraphGenerator.generateTwitterCard(title, description),\n    structuredData: StructuredDataGenerator.generateDiscussionForum(sanitizedChannel, title, description),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142829","createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. buildFallbackTags now runs channel fields through sanitizeChannelContext (which uses TitleGenerator.sanitizeForTitle) before any interpolation — no new dependency needed since the regex sanitizer is already in scope.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111396192","createdAt":"2026-04-20T14:28:57Z"}]}},{"isResolved":false,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":78,"comments":{"nodes":[{"author":{"login":"chatgpt-codex-connector"},"body":"**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Derive robots directive from channel visibility**\n\nThis path always emits `robots: 'index, follow'`, which is incorrect for channels that are `PUBLIC_NO_INDEX` (and potentially private states) and can lead crawlers to index content that was explicitly configured not to be indexed. I checked the existing visibility model in `harmony-backend/src/trpc/routers/channel.router.ts` (which already supports `PUBLIC_NO_INDEX`), so this service should carry visibility in `ChannelContext` and map it to the correct robots directive instead of hardcoding index/follow.\n\nUseful? React with 👍 / 👎.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119804427","createdAt":"2026-04-21T19:18:02Z"}]}},{"isResolved":false,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":160,"comments":{"nodes":[{"author":{"login":"chatgpt-codex-connector"},"body":"**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Encode canonical URL path segments**\n\n`buildCanonicalUrl` interpolates raw slugs directly into the URL, so reserved characters in `serverSlug`/`channelSlug` (e.g. spaces, `?`, `#`, `/`) will produce invalid or misparsed canonical links. This is actionable because channel slug input is not regex-restricted in the API layer (only min/max length), and other URL generation in this repo already URL-encodes slugs for safety. Use `encodeURIComponent` for both path segments before concatenation.\n\nUseful? React with 👍 / 👎.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119804431","createdAt":"2026-04-21T19:18:02Z"}]}}]}}}}}
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:22:58.448Z

The latest commit claims to address the prior cache-poisoning and contract findings. I’m reading the updated meta-tag service and tests against the spec now, including two unresolved automated comments on robots handling and URL encoding.

#### Tool: exec_command

```sh
git diff --stat origin/main..pr-443
```

Output:

```text
 .github/workflows/run-frontend-e2e.yml             |   4 +
 docs/deployment/replica-readiness-audit.md         |  12 +-
 harmony-backend/src/events/eventBus.ts             |   4 -
 harmony-backend/src/routes/events.router.ts        | 293 +++----
 .../src/services/metaTag/descriptionGenerator.ts   |  99 +++
 .../src/services/metaTag/metaTagCache.ts           |  22 +
 .../src/services/metaTag/metaTagService.ts         | 162 ++++
 .../src/services/metaTag/openGraphGenerator.ts     |  60 ++
 .../services/metaTag/structuredDataGenerator.ts    |  71 ++
 .../src/services/metaTag/titleGenerator.ts         |  65 ++
 harmony-backend/src/services/metaTag/types.ts      |  95 +++
 .../src/services/serverMember.service.ts           |  25 -
 harmony-backend/tests/events.router.server.test.ts | 111 +--
 harmony-backend/tests/events.router.test.ts        | 112 ---
 harmony-backend/tests/helpers/async.ts             |  27 -
 harmony-backend/tests/metaTagService.test.ts       | 294 +++++++
 harmony-backend/tests/serverMember.test.ts         |  67 +-
 llm-logs/2026-04-20-094302-session-ce430386.md     | 784 +++++++++++++++++
 llm-logs/2026-04-20-094337-session-e79268af.md     | 478 -----------
 llm-logs/2026-04-20-100616-session-12bb34ec.md     | 468 ----------
 llm-logs/2026-04-20-122835-session-b13d715d.md     | 942 +++++++++++++++++++++
 .../claude-conversation-2026-04-18-b42b9611.md     | 141 ---
 .../claude-conversation-2026-04-20-c779de46.md     | 209 -----
 .../claude-conversation-2026-04-20-cc169300.md     | 255 ------
 tests/integration/attachments.test.ts              |  14 +-
 tests/integration/env.ts                           |  11 -
 26 files changed, 2747 insertions(+), 2078 deletions(-)
```

#### Tool: exec_command

```sh
git diff --unified=80 origin/main..pr-443 -- harmony-backend/src/services/metaTag/metaTagService.ts harmony-backend/tests/metaTagService.test.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/metaTagService.ts b/harmony-backend/src/services/metaTag/metaTagService.ts
new file mode 100644
index 0000000..92e704e
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagService.ts
@@ -0,0 +1,162 @@
+// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
+import { TitleGenerator } from './titleGenerator';
+import { DescriptionGenerator } from './descriptionGenerator';
+import { OpenGraphGenerator } from './openGraphGenerator';
+import { StructuredDataGenerator } from './structuredDataGenerator';
+import { MetaTagCache } from './metaTagCache';
+import type {
+  MetaTagSet,
+  ChannelContext,
+  MessageContext,
+  MetaTagPreview,
+  MetaTagJobStatus,
+  ContentAnalysis,
+} from './types';
+import { createLogger } from '../../lib/logger';
+
+const logger = createLogger({ component: 'meta-tag-service' });
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+function sanitizeChannelContext(channel: ChannelContext): ChannelContext {
+  return {
+    ...channel,
+    name: TitleGenerator.sanitizeForTitle(channel.name),
+    serverName: TitleGenerator.sanitizeForTitle(channel.serverName),
+  };
+}
+
+function buildFallbackTags(channel: ChannelContext): MetaTagSet {
+  const safe = sanitizeChannelContext(channel);
+  const title = `${safe.name} — ${safe.serverName}`;
+  const description = `Discussions in #${safe.name} on ${safe.serverName}.`;
+  const analysis: ContentAnalysis = {
+    keywords: [],
+    topics: [TitleGenerator.truncateWithEllipsis(title)],
+    summary: DescriptionGenerator.enforceLength(description),
+    sentiment: 'neutral',
+    readingLevel: 'basic',
+  };
+  return {
+    title: TitleGenerator.truncateWithEllipsis(title),
+    description: DescriptionGenerator.enforceLength(description),
+    canonical: safe.canonicalUrl,
+    robots: 'index, follow',
+    openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
+    twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
+    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
+    keywords: [],
+    needsRegeneration: true,
+  };
+}
+
+export const metaTagService = {
+  /**
+   * Generate meta tags from pre-resolved context (used internally and in unit tests).
+   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
+   */
+  async generateMetaTagsFromContext(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
+    try {
+      const title = TitleGenerator.generateFromThread(messages, channel);
+      const description = DescriptionGenerator.generateFromMessages(messages, channel);
+      const keywords = DescriptionGenerator.extractKeyPhrases(messages.map((m) => m.content).join(' '), 5);
+      const analysis: ContentAnalysis = {
+        keywords,
+        topics: [title],
+        summary: description,
+        sentiment: 'neutral',
+        readingLevel: 'basic',
+      };
+      const og = OpenGraphGenerator.generateOGTags(channel, {}, analysis);
+      const twitter = OpenGraphGenerator.generateTwitterCard(channel, {}, analysis, og.ogImage);
+      const structuredData = StructuredDataGenerator.generateDiscussionForum(channel, messages, {});
+
+      return {
+        title,
+        description,
+        canonical: channel.canonicalUrl,
+        robots: 'index, follow',
+        openGraph: og,
+        twitter,
+        structuredData,
+        keywords,
+        needsRegeneration: false,
+      };
+    } catch (err) {
+      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
+      return buildFallbackTags(channel);
+    }
+  },
+
+  /**
+   * Spec-aligned stub: generateMetaTags(channelId, options?).
+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
+   */
+  async generateMetaTags(
+    _channelId: string,
+    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
+  ): Promise<MetaTagSet> {
+    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  /**
+   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
+   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
+   */
+  async getOrGenerateCachedFromContext(
+    channel: ChannelContext,
+    messages: MessageContext[],
+    ttl?: number,
+  ): Promise<MetaTagSet> {
+    const cached = await MetaTagCache.get(channel.id);
+    if (cached) return cached;
+
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    // Do not cache fallback tags — a transient failure must not poison the cache for the full TTL
+    if (!tags.needsRegeneration) {
+      await MetaTagCache.set(channel.id, tags, ttl);
+    }
+    return tags;
+  },
+
+  /**
+   * Spec-aligned stub: getOrGenerateCached(channelId).
+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
+   */
+  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
+    throw new Error('getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  async invalidateCache(channelId: string): Promise<void> {
+    await MetaTagCache.invalidate(channelId);
+  },
+
+  // scheduleRegeneration and getRegenerationJobStatus are stubs —
+  // full implementation depends on M4 (worker/queue) from issue #356
+  async scheduleRegeneration(
+    channelId: string,
+    _priority?: 'high' | 'normal' | 'low',
+    _idempotencyKey?: string,
+  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
+    // Queuing logic wired by M4 MetaTagUpdateWorker
+    return {
+      jobId: `meta-tag-regeneration:${channelId}`,
+      status: 'queued',
+    };
+  },
+
+  async getRegenerationJobStatus(
+    _channelId: string,
+    _jobId: string,
+  ): Promise<MetaTagJobStatus> {
+    throw new Error('getRegenerationJobStatus not yet implemented — wired by M4 (issue #356)');
+  },
+
+  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
+    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
+    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;
+  },
+};
diff --git a/harmony-backend/tests/metaTagService.test.ts b/harmony-backend/tests/metaTagService.test.ts
new file mode 100644
index 0000000..8b04f98
--- /dev/null
+++ b/harmony-backend/tests/metaTagService.test.ts
@@ -0,0 +1,294 @@
+/**
+ * Unit tests for M2 Meta Tag Generation Service skeleton — Issue #350
+ *
+ * Covers AC-2 (length limits), sanitization, template application,
+ * and AC-9 (fallback on failure, needsRegeneration=true).
+ *
+ * MetaTagCache uses Redis via cacheService — mocked here for unit speed.
+ */
+
+jest.mock('../src/services/cache.service', () => ({
+  cacheService: {
+    get: jest.fn(),
+    set: jest.fn(),
+    invalidate: jest.fn(),
+    getOrRevalidate: jest.fn(),
+  },
+  CacheKeys: {
+    metaChannel: (id: string) => `meta:channel:${id}`,
+    channelVisibility: (id: string) => `channel:${id}:visibility`,
+    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
+    serverInfo: (id: string) => `server:${id}:info`,
+    analysisChannel: (id: string) => `analysis:channel:${id}`,
+  },
+  sanitizeKeySegment: (s: string) => s.replace(/[*?\[\]]/g, ''),
+}));
+
+import { TitleGenerator } from '../src/services/metaTag/titleGenerator';
+import { DescriptionGenerator } from '../src/services/metaTag/descriptionGenerator';
+import { MetaTagCache } from '../src/services/metaTag/metaTagCache';
+import { metaTagService } from '../src/services/metaTag/metaTagService';
+import { cacheService } from '../src/services/cache.service';
+import type { ChannelContext, MessageContext } from '../src/services/metaTag/types';
+
+const mockCacheService = cacheService as jest.Mocked<typeof cacheService>;
+
+const channel: ChannelContext = {
+  id: 'chan-001',
+  name: 'unity-physics-help',
+  slug: 'unity-physics-help',
+  topic: 'Ask about Unity physics',
+  serverName: 'Game Dev Hub',
+  serverSlug: 'game-dev-hub',
+  canonicalUrl: 'https://harmony.chat/c/game-dev-hub/unity-physics-help',
+};
+
+const messages: MessageContext[] = [
+  { content: 'How do I handle collision detection in Unity?', createdAt: new Date() },
+  { content: 'Use OnCollisionEnter for physics-based collisions.', createdAt: new Date() },
+];
+
+beforeEach(() => {
+  jest.clearAllMocks();
+});
+
+// ─── TitleGenerator ──────────────────────────────────────────────────────────
+
+describe('TitleGenerator', () => {
+  it('maxLength is 60', () => {
+    expect(TitleGenerator.maxLength).toBe(60);
+  });
+
+  it('generateFromChannel produces title ≤60 chars', () => {
+    const title = TitleGenerator.generateFromChannel(channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+  });
+
+  it('truncates long titles with ellipsis and stays ≤60 chars', () => {
+    const longChannel: ChannelContext = {
+      ...channel,
+      name: 'this-is-a-very-long-channel-name-that-exceeds-limits',
+      serverName: 'An Extremely Long Server Name That Will Overflow',
+    };
+    const title = TitleGenerator.generateFromChannel(longChannel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title.endsWith('…')).toBe(true);
+  });
+
+  it('sanitizeForTitle strips HTML tags', () => {
+    const result = TitleGenerator.sanitizeForTitle('<b>Hello</b> <em>world</em>');
+    expect(result).toBe('Hello world');
+  });
+
+  it('sanitizeForTitle collapses whitespace', () => {
+    const result = TitleGenerator.sanitizeForTitle('foo   bar\n  baz');
+    expect(result).toBe('foo bar baz');
+  });
+
+  it('applyTemplate replaces template variables', () => {
+    const result = TitleGenerator.applyTemplate('{channelName} on {serverName}', {
+      channelName: 'general',
+      serverName: 'My Server',
+    });
+    expect(result).toBe('general on My Server');
+  });
+
+  it('generateFromThread falls back to channel when no messages', () => {
+    const title = TitleGenerator.generateFromThread([], channel);
+    expect(title).toBe(TitleGenerator.generateFromChannel(channel));
+  });
+
+  it('generateFromMessage uses first message content', () => {
+    const title = TitleGenerator.generateFromMessage(messages[0], channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title).toContain('Game Dev Hub');
+  });
+});
+
+// ─── DescriptionGenerator ───────────────────────────────────────────────────
+
+describe('DescriptionGenerator', () => {
+  it('maxLength is 160', () => {
+    expect(DescriptionGenerator.maxLength).toBe(160);
+  });
+
+  it('minLength is 50', () => {
+    expect(DescriptionGenerator.minLength).toBe(50);
+  });
+
+  it('generateFromMessages produces description 50-160 chars', () => {
+    const desc = DescriptionGenerator.generateFromMessages(messages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('truncates long descriptions to ≤160 chars with ellipsis', () => {
+    const longMessages: MessageContext[] = [
+      {
+        content: 'A'.repeat(200),
+        createdAt: new Date(),
+      },
+    ];
+    const desc = DescriptionGenerator.generateFromMessages(longMessages, channel);
+    expect(desc.length).toBeLessThanOrEqual(160);
+    expect(desc.endsWith('…')).toBe(true);
+  });
+
+  it('returns text unchanged when within valid range', () => {
+    const valid = 'A'.repeat(80);
+    expect(DescriptionGenerator.enforceLength(valid)).toBe(valid);
+  });
+
+  it('AC-2: generateFromMessages produces ≥50 chars even for a very short message', () => {
+    const shortMessages: MessageContext[] = [{ content: 'hi', createdAt: new Date() }];
+    const desc = DescriptionGenerator.generateFromMessages(shortMessages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('extractKeyPhrases returns non-empty array for non-empty content', () => {
+    const content = messages.map((m) => m.content).join(' ');
+    const phrases = DescriptionGenerator.extractKeyPhrases(content, 5);
+    expect(Array.isArray(phrases)).toBe(true);
+    expect(phrases.length).toBeGreaterThan(0);
+  });
+
+  it('extractKeyPhrases respects maxPhrases limit', () => {
+    const content = messages.map((m) => m.content).join(' ');
+    const phrases = DescriptionGenerator.extractKeyPhrases(content, 2);
+    expect(phrases.length).toBeLessThanOrEqual(2);
+  });
+
+  it('summarizeThread returns empty string for no messages', () => {
+    const summary = DescriptionGenerator.summarizeThread([]);
+    expect(summary).toBe('');
+  });
+
+  it('summarizeThread returns first message content for non-empty messages', () => {
+    const summary = DescriptionGenerator.summarizeThread(messages);
+    expect(summary.length).toBeGreaterThan(0);
+  });
+
+  it('generateFromMessages includes channel info for empty messages', () => {
+    const desc = DescriptionGenerator.generateFromMessages([], channel);
+    expect(desc).toContain(channel.name);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+});
+
+// ─── MetaTagCache ────────────────────────────────────────────────────────────
+
+describe('MetaTagCache', () => {
+  it('ttl defaults to 3600', () => {
+    expect(MetaTagCache.ttl).toBe(3600);
+  });
+
+  it('get returns null on cache miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toBeNull();
+    expect(mockCacheService.get).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('get returns cached data on hit', async () => {
+    const fakeSet = { title: 'Cached Title' } as never;
+    mockCacheService.get.mockResolvedValue({ data: fakeSet, createdAt: Date.now() });
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toEqual(fakeSet);
+  });
+
+  it('set calls cacheService.set with correct key and ttl', async () => {
+    mockCacheService.set.mockResolvedValue(undefined);
+    const tags = { title: 'T' } as never;
+    await MetaTagCache.set('chan-001', tags, 1800);
+    expect(mockCacheService.set).toHaveBeenCalledWith(
+      'meta:channel:chan-001',
+      tags,
+      { ttl: 1800 },
+    );
+  });
+
+  it('invalidate calls cacheService.invalidate with correct key', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await MetaTagCache.invalidate('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+});
+
+// ─── MetaTagService ──────────────────────────────────────────────────────────
+
+describe('metaTagService', () => {
+  it('generateMetaTagsFromContext returns valid MetaTagSet', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(tags.title.length).toBeLessThanOrEqual(60);
+    expect(tags.description.length).toBeGreaterThanOrEqual(50);
+    expect(tags.description.length).toBeLessThanOrEqual(160);
+    expect(tags.canonical).toBe(channel.canonicalUrl);
+    expect(tags.needsRegeneration).toBe(false);
+  });
+
+  it('generateMetaTagsFromContext sets robots to index, follow', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.robots).toBe('index, follow');
+  });
+
+  it('generateMetaTagsFromContext includes openGraph and twitter tags', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.openGraph.ogTitle).toBeDefined();
+    expect(tags.twitter.card).toBeDefined();
+  });
+
+  it('AC-9: returns fallback with needsRegeneration=true on generation error', async () => {
+    const spy = jest
+      .spyOn(TitleGenerator, 'generateFromThread')
+      .mockImplementation(() => { throw new Error('NLP timeout'); });
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    spy.mockRestore();
+    expect(tags.needsRegeneration).toBe(true);
+    expect(tags.title.length).toBeGreaterThan(0);
+  });
+
+  it('getOrGenerateCachedFromContext returns cache hit without regenerating', async () => {
+    const cachedTags = { title: 'Cached', needsRegeneration: false } as never;
+    mockCacheService.get.mockResolvedValue({ data: cachedTags, createdAt: Date.now() });
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    expect(tags).toEqual(cachedTags);
+    expect(mockCacheService.set).not.toHaveBeenCalled();
+  });
+
+  it('getOrGenerateCachedFromContext generates and caches on miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    mockCacheService.set.mockResolvedValue(undefined);
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(mockCacheService.set).toHaveBeenCalled();
+  });
+
+  it('getOrGenerateCachedFromContext does not cache fallback tags on generation failure', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    const spy = jest
+      .spyOn(TitleGenerator, 'generateFromThread')
+      .mockImplementation(() => { throw new Error('NLP timeout'); });
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    spy.mockRestore();
+
+    expect(tags.needsRegeneration).toBe(true);
+    expect(mockCacheService.set).not.toHaveBeenCalled();
+  });
+
+  it('invalidateCache delegates to MetaTagCache.invalidate', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await metaTagService.invalidateCache('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('buildCanonicalUrl constructs correct path', () => {
+    const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
+    expect(url).toContain('/c/game-dev-hub/unity-physics-help');
+  });
+});
```

#### Tool: exec_command

```sh
git diff --unified=80 origin/main..pr-443 -- harmony-backend/src/services/metaTag/descriptionGenerator.ts harmony-backend/src/services/metaTag/openGraphGenerator.ts harmony-backend/src/services/metaTag/structuredDataGenerator.ts harmony-backend/src/services/metaTag/titleGenerator.ts harmony-backend/src/services/metaTag/types.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/descriptionGenerator.ts b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
new file mode 100644
index 0000000..73d84f5
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
@@ -0,0 +1,99 @@
+// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
+import type { MessageContext, ChannelContext, MetaTagSet, IMetaTagGenerator } from './types';
+
+const MAX_LENGTH = 160;
+const MIN_LENGTH = 50;
+
+export const DescriptionGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  minLength: number;
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string;
+  extractKeyPhrases(content: string, maxPhrases: number): string[];
+  sanitizeText(text: string): string;
+  summarizeThread(messages: MessageContext[]): string;
+  enforceLength(text: string): string;
+} = {
+  maxLength: MAX_LENGTH,
+  minLength: MIN_LENGTH,
+
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
+    const serverName = this.sanitizeText(channel.serverName);
+    const channelName = this.sanitizeText(channel.name);
+    const suffix = ` — Join the discussion on ${serverName}.`;
+
+    if (messages.length === 0) {
+      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;
+      return this.enforceLength(base);
+    }
+
+    const summary = this.summarizeThread(messages);
+    const prefix = `${serverName} › #${channelName}: `;
+    let text = prefix + summary;
+
+    if (text.length < MIN_LENGTH) {
+      text = text + suffix;
+    }
+
+    return this.enforceLength(text);
+  },
+
+  // Spec: extractKeyPhrases(content: string, maxPhrases: number): string[]
+  extractKeyPhrases(content: string, maxPhrases: number): string[] {
+    const words = content
+      .toLowerCase()
+      .replace(/<[^>]*>/g, '')
+      .replace(/[^a-z0-9\s]/g, ' ')
+      .split(/\s+/)
+      .filter((w) => w.length > 3);
+
+    const freq = new Map<string, number>();
+    for (const word of words) {
+      freq.set(word, (freq.get(word) ?? 0) + 1);
+    }
+
+    return [...freq.entries()]
+      .sort((a, b) => b[1] - a[1])
+      .slice(0, maxPhrases)
+      .map(([word]) => word);
+  },
+
+  sanitizeText(text: string): string {
+    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
+  },
+
+  // Spec: summarizeThread(messages: Message[]): string — channel context handled by generateFromMessages
+  summarizeThread(messages: MessageContext[]): string {
+    if (messages.length === 0) return '';
+    return this.sanitizeText(messages[0].content);
+  },
+
+  enforceLength(text: string): string {
+    let result = text;
+
+    if (result.length < MIN_LENGTH) {
+      const additions = [
+        ' Join the discussion.',
+        ' Explore the latest updates.',
+        ' Connect with the community.',
+      ];
+      let i = 0;
+      while (result.length < MIN_LENGTH) {
+        result += additions[i % additions.length];
+        i++;
+      }
+    }
+
+    if (result.length > MAX_LENGTH) {
+      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+    }
+    return result;
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('DescriptionGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('DescriptionGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/openGraphGenerator.ts b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
new file mode 100644
index 0000000..8ce445d
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
@@ -0,0 +1,60 @@
+// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
+import type { ChannelContext, OpenGraphTags, TwitterCardTags, MetaTagSet, IMetaTagGenerator, ContentAnalysis } from './types';
+
+const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
+const SITE_NAME = 'Harmony';
+const TWITTER_SITE = '@harmonychat';
+
+export const OpenGraphGenerator: IMetaTagGenerator & {
+  defaultImage: string;
+  // Spec §9.1.4: generateOGTags(channel, server, analysis)
+  generateOGTags(channel: ChannelContext, server: unknown, analysis: ContentAnalysis): OpenGraphTags;
+  // Spec §9.1.4: generateTwitterCard(channel, server, analysis)
+  generateTwitterCard(channel: ChannelContext, server: unknown, analysis: ContentAnalysis, image?: string): TwitterCardTags;
+  // Spec §9.1.4: selectPreviewImage(channel, messages): string | null
+  selectPreviewImage(channel: ChannelContext, messages: unknown[]): string | null;
+} = {
+  defaultImage: DEFAULT_IMAGE,
+
+  // M2 skeleton: title from analysis.topics[0], description from analysis.summary; full NLP integration by M4
+  generateOGTags(channel: ChannelContext, _server: unknown, analysis: ContentAnalysis): OpenGraphTags {
+    return {
+      ogTitle: analysis.topics[0] ?? channel.name,
+      ogDescription: analysis.summary,
+      ogImage: OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE,
+      ogType: 'website',
+      ogUrl: channel.canonicalUrl,
+      ogSiteName: SITE_NAME,
+    };
+  },
+
+  generateTwitterCard(
+    channel: ChannelContext,
+    _server: unknown,
+    analysis: ContentAnalysis,
+    image?: string,
+  ): TwitterCardTags {
+    const resolvedImage = image ?? OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE;
+    const isCustomImage = resolvedImage !== DEFAULT_IMAGE;
+    return {
+      card: isCustomImage ? 'summary_large_image' : 'summary',
+      title: analysis.topics[0] ?? channel.name,
+      description: analysis.summary,
+      image: resolvedImage,
+      site: TWITTER_SITE,
+    };
+  },
+
+  // M2 skeleton: always returns default image; real selection by M4 (messages/channel avatars)
+  selectPreviewImage(_channel: ChannelContext, _messages: unknown[]): string | null {
+    return DEFAULT_IMAGE;
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('OpenGraphGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('OpenGraphGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
new file mode 100644
index 0000000..24adea2
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
@@ -0,0 +1,71 @@
+// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
+import type { ChannelContext, MessageContext, MetaTagSet, StructuredData } from './types';
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+export const StructuredDataGenerator = {
+  // Spec §9.1.5: generateDiscussionForum(channel, messages, server)
+  // M2 skeleton: derived from channel context; message/server integration by M4
+  generateDiscussionForum(channel: ChannelContext, _messages: MessageContext[], _server: unknown): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'DiscussionForumPosting',
+      headline: `${channel.name} — ${channel.serverName}`,
+      description: `Discussions in #${channel.name} on ${channel.serverName}.`,
+      // author and datePublished are stub fields — populated by M4 when message data is available
+      author: undefined,
+      datePublished: undefined,
+      dateModified: undefined,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+
+  // Spec §9.1.5: generateBreadcrumbList(server, channel)
+  generateBreadcrumbList(_server: unknown, channel: ChannelContext): object {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'BreadcrumbList',
+      itemListElement: [
+        {
+          '@type': 'ListItem',
+          position: 1,
+          name: channel.serverName,
+          item: `${BASE_URL}/s/${channel.serverSlug}`,
+        },
+        {
+          '@type': 'ListItem',
+          position: 2,
+          name: channel.name,
+          item: channel.canonicalUrl,
+        },
+      ],
+    };
+  },
+
+  // Spec §9.1.5: generateOrganization(server)
+  generateOrganization(_server: unknown): object {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'Organization',
+      name: 'Harmony',
+      url: BASE_URL,
+    };
+  },
+
+  // Spec §9.1.5: generateWebPage(channel, metaTags)
+  generateWebPage(channel: ChannelContext, metaTags: MetaTagSet): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'WebPage',
+      headline: metaTags.title,
+      description: metaTags.description,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/titleGenerator.ts b/harmony-backend/src/services/metaTag/titleGenerator.ts
new file mode 100644
index 0000000..0365b11
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/titleGenerator.ts
@@ -0,0 +1,65 @@
+// CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
+import type { ChannelContext, MessageContext, MetaTagSet, IMetaTagGenerator } from './types';
+
+const MAX_LENGTH = 60;
+
+const CHANNEL_TEMPLATE = '{channelName} — {serverName}';
+
+export const TitleGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  generateFromChannel(channel: ChannelContext): string;
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string;
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string;
+  truncateWithEllipsis(text: string): string;
+  sanitizeForTitle(text: string): string;
+  applyTemplate(template: string, vars: Record<string, string>): string;
+} = {
+  maxLength: MAX_LENGTH,
+
+  generateFromChannel(channel: ChannelContext): string {
+    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(
+      '{serverName}',
+      channel.serverName,
+    );
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string {
+    const raw = `${message.content} — ${channel.serverName}`;
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string {
+    if (messages.length === 0) {
+      return this.generateFromChannel(channel);
+    }
+    return this.generateFromMessage(messages[0], channel);
+  },
+
+  truncateWithEllipsis(text: string): string {
+    if (text.length <= MAX_LENGTH) return text;
+    return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+  },
+
+  sanitizeForTitle(text: string): string {
+    return text
+      .replace(/<[^>]*>/g, '')
+      .replace(/\s+/g, ' ')
+      .trim();
+  },
+
+  applyTemplate(template: string, vars: Record<string, string>): string {
+    return Object.entries(vars).reduce(
+      (result, [key, value]) => result.replaceAll(`{${key}}`, value),
+      template,
+    );
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('TitleGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('TitleGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/types.ts b/harmony-backend/src/services/metaTag/types.ts
new file mode 100644
index 0000000..3e68d4d
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/types.ts
@@ -0,0 +1,95 @@
+// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)
+
+export interface OpenGraphTags {
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  ogType: string;
+  ogUrl: string;
+  ogSiteName: string;
+}
+
+export interface TwitterCardTags {
+  card: string;
+  title: string;
+  description: string;
+  image: string;
+  site: string;
+}
+
+export interface StructuredData {
+  '@context': string;
+  '@type': string;
+  headline: string;
+  description: string;
+  author?: object;
+  datePublished?: string;
+  dateModified?: string;
+  mainEntity?: object;
+  breadcrumb?: object;
+}
+
+export interface MetaTagSet {
+  title: string;
+  description: string;
+  canonical: string;
+  robots: string;
+  openGraph: OpenGraphTags;
+  twitter: TwitterCardTags;
+  structuredData: StructuredData;
+  keywords: string[];
+  needsRegeneration?: boolean;
+}
+
+export interface ContentAnalysis {
+  keywords: string[];
+  topics: string[];
+  summary: string;
+  sentiment: string;
+  readingLevel: string;
+}
+
+export interface IMetaTagGenerator {
+  generate(): MetaTagSet;
+  validate(): boolean;
+}
+
+export interface MetaTagPreview {
+  title: string;
+  description: string;
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  keywords: string[];
+  generatedAt: string;
+  isCustom: boolean;
+  searchPreview: { title: string; description: string; url: string };
+  socialPreview: { title: string; description: string; image: string };
+}
+
+export interface MetaTagJobStatus {
+  jobId: string;
+  channelId: string;
+  status: 'queued' | 'processing' | 'succeeded' | 'failed';
+  attempts: number;
+  startedAt: string | null;
+  completedAt: string | null;
+  errorCode: string | null;
+  errorMessage: string | null;
+}
+
+export interface ChannelContext {
+  id: string;
+  name: string;
+  slug: string;
+  topic?: string | null;
+  serverName: string;
+  serverSlug: string;
+  canonicalUrl: string;
+}
+
+export interface MessageContext {
+  content: string;
+  createdAt: Date;
+  authorDisplayName?: string;
+}
```

#### Tool: exec_command

```sh
gh pr diff 443 --repo CS485-Harmony/Harmony --name-only
```

Output:

```text
harmony-backend/src/services/metaTag/descriptionGenerator.ts
harmony-backend/src/services/metaTag/metaTagCache.ts
harmony-backend/src/services/metaTag/metaTagService.ts
harmony-backend/src/services/metaTag/openGraphGenerator.ts
harmony-backend/src/services/metaTag/structuredDataGenerator.ts
harmony-backend/src/services/metaTag/titleGenerator.ts
harmony-backend/src/services/metaTag/types.ts
harmony-backend/tests/metaTagService.test.ts
llm-logs/2026-04-20-094302-session-ce430386.md
llm-logs/2026-04-20-122835-session-b13d715d.md
```

#### Tool: exec_command

```sh
rg -n "robots|PUBLIC_NO_INDEX|NO_INDEX|index, follow|noindex|canonical|buildCanonicalUrl|serverSlug|channelSlug" docs/dev-spec-seo-meta-tag-generation.md harmony-backend/src -g '!node_modules'
```

Output:

```text
docs/dev-spec-seo-meta-tag-generation.md:66:│  │  │ serverSlug: string          │    │ meta: MetaTagSet                │   │  │
docs/dev-spec-seo-meta-tag-generation.md:67:│  │  │ channelSlug: string         │    │ ─────────────────────────────── │   │  │
docs/dev-spec-seo-meta-tag-generation.md:471:│ + canonical: string     │     │ + ogImage: string       │
docs/dev-spec-seo-meta-tag-generation.md:472:│ + robots: string        │     │ + ogType: string        │
docs/dev-spec-seo-meta-tag-generation.md:542:│ - serverSlug: string         │
docs/dev-spec-seo-meta-tag-generation.md:543:│ - channelSlug: string        │
docs/dev-spec-seo-meta-tag-generation.md:858:        PRIVATE  /  NO_INDEX|  INDEXABLE\                 │ Get last 100 messages        │
docs/dev-spec-seo-meta-tag-generation.md:863: │ Invalidate meta cache    │ │ Regen with robots=       │       /                \
docs/dev-spec-seo-meta-tag-generation.md:864: │ Purge CDN URL            │ │   noindex                │      / No               \ Yes
docs/dev-spec-seo-meta-tag-generation.md:941:│ B4: Worker Picks Up    │ VISIBILITY_CHANGED → NO_INDEX    │ B16: Regen (no-index)   │ Regen with noindex, exclude from  │
docs/dev-spec-seo-meta-tag-generation.md:949:│                        │                                  │                         │ robots=noindex                    │
docs/dev-spec-seo-meta-tag-generation.md:969:| `VISIBILITY_CHANGED` where `newVisibility = PUBLIC_INDEXABLE` | `B0 → B3 (Queue) → B17 (Regen indexable) → B7 → B11 (Complete)` | Queue high-priority regeneration, invalidate `meta:channel:{channelId}`, keep canonical URL in sitemap with refreshed `lastmod` | Retry queue enqueue with backoff; keep last known tags until regeneration succeeds |
docs/dev-spec-seo-meta-tag-generation.md:970:| `VISIBILITY_CHANGED` where `newVisibility = PUBLIC_NO_INDEX` | `B0 → B3 (Queue) → B16 (Regen no-index) → B7 → B11 (Complete)` | Regenerate tags with `robots=noindex`, invalidate `meta:channel:{channelId}`, keep channel public but excluded from indexable sitemap set | Retry queue enqueue with backoff; continue serving public tags with noindex policy |
docs/dev-spec-seo-meta-tag-generation.md:1111:                │             │  │ og:url (canonical)            │
docs/dev-spec-seo-meta-tag-generation.md:1440:**Scenario Description:** A channel transitions from `PUBLIC_INDEXABLE` or `PUBLIC_NO_INDEX` to `PRIVATE`. Existing tags must stop being served and search engines must be notified to drop stale indexed content.
docs/dev-spec-seo-meta-tag-generation.md:1461:    │ (e.g., PUBLIC_NO_INDEX  │     │ Server.MetaTagService.        │
docs/dev-spec-seo-meta-tag-generation.md:1500:                                    < PUBLIC_NO_INDEX?              >
docs/dev-spec-seo-meta-tag-generation.md:1520:**Ownership Boundary:** De-indexing requests tied to visibility transitions are initiated here; the canonical visibility state remains owned by the channel visibility feature.
docs/dev-spec-seo-meta-tag-generation.md:1776:**Scenario Description:** A channel transitions from `PRIVATE` to `PUBLIC_INDEXABLE` or `PUBLIC_NO_INDEX`, or switches between the two public states. Meta tags must be generated (or re-served), the sitemap updated, and indexing directives set according to the target visibility.
docs/dev-spec-seo-meta-tag-generation.md:1797:  │ Server.MetaTagRepository.    │            │ PUBLIC_NO_INDEX               │
docs/dev-spec-seo-meta-tag-generation.md:1802:   < F8.5: Records exist? >                    │ [F8.6] Update robots meta    │
docs/dev-spec-seo-meta-tag-generation.md:1806:┌──────────────────────┐  ┌──────────────────┐ │   "index, follow"            │
docs/dev-spec-seo-meta-tag-generation.md:1807:│ [F8.7] Generate      │  │ [F8.8] Force     │ │ PUBLIC_NO_INDEX →            │
docs/dev-spec-seo-meta-tag-generation.md:1808:│ fresh meta tags      │  │ regeneration of  │ │   "noindex, follow"          │
docs/dev-spec-seo-meta-tag-generation.md:1845:        │   addUrl(channelUrl)          │  │ PUBLIC_NO_INDEX channels      │
docs/dev-spec-seo-meta-tag-generation.md:1875:**Ownership Boundary:** The canonical visibility state is owned by the channel visibility feature; this flow reacts to the emitted `VISIBILITY_CHANGED` event and manages the SEO/meta tag consequences only.
docs/dev-spec-seo-meta-tag-generation.md:2365:  serverSlug: string,
docs/dev-spec-seo-meta-tag-generation.md:2366:  channelSlug: string
docs/dev-spec-seo-meta-tag-generation.md:2443:  canonical: string;
docs/dev-spec-seo-meta-tag-generation.md:2444:  robots: string;
docs/dev-spec-seo-meta-tag-generation.md:2591:| findBySlug() | ChannelRepository | Resolve canonical route channel for SSR generation |
docs/dev-spec-seo-meta-tag-generation.md:2616:| `PUBLIC_INDEXABLE` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration, refresh tags, keep canonical URL indexable |
docs/dev-spec-seo-meta-tag-generation.md:2617:| `PUBLIC_NO_INDEX` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration with `noindex` directives while keeping page publicly accessible |
docs/dev-spec-seo-meta-tag-generation.md:2900:This feature consumes the canonical `channels` schema maintained by the channel visibility spec (`docs/dev-spec-channel-visibility-toggle.md`, Section 11.1 D7.1) to avoid drift.
docs/dev-spec-seo-meta-tag-generation.md:2915:**Visibility Enum:** `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`
docs/dev-spec-seo-meta-tag-generation.md:3195:  "url": "{canonicalUrl}",
harmony-backend/src/routes/public.router.ts:164: * GET /api/public/servers/:serverSlug
harmony-backend/src/routes/public.router.ts:168:router.get('/servers/:serverSlug', async (req: Request, res: Response) => {
harmony-backend/src/routes/public.router.ts:171:      where: { slug: req.params.serverSlug },
harmony-backend/src/routes/public.router.ts:213:    logger.error({ err, serverSlug: req.params.serverSlug }, 'Public server route failed');
harmony-backend/src/routes/public.router.ts:219: * GET /api/public/servers/:serverSlug/channels
harmony-backend/src/routes/public.router.ts:223:router.get('/servers/:serverSlug/channels', async (req: Request, res: Response) => {
harmony-backend/src/routes/public.router.ts:226:      where: { slug: req.params.serverSlug },
harmony-backend/src/routes/public.router.ts:265:    logger.error({ err, serverSlug: req.params.serverSlug }, 'Public channels route failed');
harmony-backend/src/routes/public.router.ts:271: * GET /api/public/servers/:serverSlug/channels/:channelSlug
harmony-backend/src/routes/public.router.ts:273: * Supports PUBLIC_INDEXABLE and PUBLIC_NO_INDEX channels for guest access.
harmony-backend/src/routes/public.router.ts:276:  '/servers/:serverSlug/channels/:channelSlug',
harmony-backend/src/routes/public.router.ts:280:        where: { slug: req.params.serverSlug },
harmony-backend/src/routes/public.router.ts:290:        where: { serverId: server.id, slug: req.params.channelSlug },
harmony-backend/src/routes/public.router.ts:318:        { err, serverSlug: req.params.serverSlug, channelSlug: req.params.channelSlug },
harmony-backend/src/services/channel.service.ts:32:  async getChannelBySlug(serverSlug: string, channelSlug: string) {
harmony-backend/src/services/channel.service.ts:33:    const server = await serverRepository.findBySlug(serverSlug);
harmony-backend/src/services/channel.service.ts:38:    const channel = await channelRepository.findByServerAndSlug(server.id, channelSlug);
harmony-backend/src/routes/seo.router.ts:2: * SEO routes — backend XML sources for sitemap.xml and robots.txt.
harmony-backend/src/routes/seo.router.ts:4: * The deployment architecture makes the frontend apex domain the canonical
harmony-backend/src/routes/seo.router.ts:10: * - GET /sitemap/:serverSlug.xml — dynamic sitemap of PUBLIC_INDEXABLE channels
harmony-backend/src/routes/seo.router.ts:11: * - GET /robots.txt              — legacy/transitional robots directives
harmony-backend/src/routes/seo.router.ts:36: * GET /robots.txt
harmony-backend/src/routes/seo.router.ts:39:seoRouter.get('/robots.txt', (_req: Request, res: Response) => {
harmony-backend/src/routes/seo.router.ts:54: * GET /sitemap/:serverSlug.xml
harmony-backend/src/routes/seo.router.ts:58:seoRouter.get('/sitemap/:serverSlug.xml', async (req: Request, res: Response) => {
harmony-backend/src/routes/seo.router.ts:60:    const { serverSlug } = req.params;
harmony-backend/src/routes/seo.router.ts:61:    const xml = await indexingService.generateSitemap(serverSlug);
harmony-backend/src/routes/seo.router.ts:72:    logger.error({ err, serverSlug: req.params.serverSlug }, 'Sitemap generation failed');
harmony-backend/src/services/indexing.service.ts:8: *   - generateSitemap(serverSlug)  — builds XML sitemap for a server
harmony-backend/src/services/indexing.service.ts:23:  serverSitemap: (serverSlug: string) => `sitemap:${sanitizeKeySegment(serverSlug)}`,
harmony-backend/src/services/indexing.service.ts:71:  async generateSitemap(serverSlug: string): Promise<string | null> {
harmony-backend/src/services/indexing.service.ts:72:    const server = await serverRepository.findBySlugSelect(serverSlug, { id: true, slug: true });
harmony-backend/src/services/indexing.service.ts:76:    const cacheKey = CacheKeys_Sitemap.serverSitemap(serverSlug);
harmony-backend/src/services/indexing.service.ts:103:  serverSlug: string,
harmony-backend/src/services/indexing.service.ts:109:        `  <url>\n    <loc>${escapeXml(BASE_URL)}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(ch.slug)}</loc>\n    <lastmod>${ch.updatedAt.toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`,
harmony-backend/src/services/indexing.service.ts:116:function buildSitemapIndexXml(serverSlugs: string[]): string {
harmony-backend/src/services/indexing.service.ts:117:  const sitemaps = serverSlugs
harmony-backend/src/services/indexing.service.ts:119:      (serverSlug) =>
harmony-backend/src/services/indexing.service.ts:120:        `  <sitemap>\n    <loc>${escapeXml(BASE_URL)}/sitemap/${encodeURIComponent(serverSlug)}</loc>\n  </sitemap>`,
harmony-backend/src/events/eventTypes.ts:4:export type ChannelVisibilityValue = 'PUBLIC_INDEXABLE' | 'PUBLIC_NO_INDEX' | 'PRIVATE';
harmony-backend/src/app.ts:140:  // SEO endpoints (robots.txt, sitemaps) — before auth so they're publicly accessible
harmony-backend/src/app.ts:142:  // frontend apex domain owns the canonical crawler-facing entrypoints.
harmony-backend/src/trpc/routers/channel.router.ts:8:const ChannelVisibilitySchema = z.enum(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);
harmony-backend/src/trpc/routers/channel.router.ts:18:    .input(z.object({ serverId: z.string().uuid(), serverSlug: z.string(), channelSlug: z.string() }))
harmony-backend/src/trpc/routers/channel.router.ts:19:    .query(({ input }) => channelService.getChannelBySlug(input.serverSlug, input.channelSlug)),
harmony-backend/src/dev/mock-seed-data.json:151:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:184:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:261:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:283:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:338:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:1875:      "content": "📦 **PR #7 merged** — TypeScript types for Server, Channel, Message, User. Visibility enum values locked in: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`.",
harmony-backend/src/dev/mock-seed-data.json:1992:      "content": "📦 **Discord-like shell wired up** — `/c/:serverSlug/:channelSlug` route live. `npm run dev` shows the full layout now!",
```

#### Tool: exec_command

```sh
rg -n "visibility|PUBLIC_INDEXABLE|PUBLIC_NO_INDEX|PRIVATE" harmony-backend/src/trpc harmony-backend/src/routes harmony-backend/src/services -g '!node_modules'
```

Output:

```text
harmony-backend/src/services/cache.service.ts:27:  channelVisibility: (id: string) => `channel:${sanitizeKeySegment(id)}:visibility`,
harmony-backend/src/routes/public.router.ts:25: * Returns paginated messages for a PUBLIC_INDEXABLE channel.
harmony-backend/src/routes/public.router.ts:44:        select: { id: true, visibility: true },
harmony-backend/src/routes/public.router.ts:47:      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/routes/public.router.ts:79: * Returns a single message from a PUBLIC_INDEXABLE channel.
harmony-backend/src/routes/public.router.ts:96:        select: { id: true, visibility: true },
harmony-backend/src/routes/public.router.ts:99:      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/routes/public.router.ts:240:        where: { serverId: server.id, visibility: ChannelVisibility.PUBLIC_INDEXABLE },
harmony-backend/src/routes/public.router.ts:272: * Returns channel info by slug. Returns 403 for PRIVATE channels, 404 if not found.
harmony-backend/src/routes/public.router.ts:273: * Supports PUBLIC_INDEXABLE and PUBLIC_NO_INDEX channels for guest access.
harmony-backend/src/routes/public.router.ts:297:          visibility: true,
harmony-backend/src/routes/public.router.ts:309:      if (channel.visibility === ChannelVisibility.PRIVATE) {
harmony-backend/src/routes/events.router.ts:14: * owns the requested channel, preventing access to PRIVATE channels by non-members.
harmony-backend/src/routes/events.router.ts:318:  visibility: true,
harmony-backend/src/routes/events.router.ts:625:  const visibilityChangedSubscription = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:637:        writeEvent('channel:visibility-changed', {
harmony-backend/src/routes/events.router.ts:644:          'Failed to hydrate SSE channel:visibility-changed payload',
harmony-backend/src/routes/events.router.ts:649:  subscriptions.push(visibilityChangedSubscription);
harmony-backend/src/services/cacheInvalidator.service.ts:6: *   VISIBILITY_CHANGED  → channel:{id}:visibility
harmony-backend/src/services/cacheInvalidator.service.ts:69:        // Update sitemap on visibility changes
harmony-backend/src/services/cacheInvalidator.service.ts:75:              'Sitemap update on visibility change failed',
harmony-backend/src/routes/seo.router.ts:10: * - GET /sitemap/:serverSlug.xml — dynamic sitemap of PUBLIC_INDEXABLE channels
harmony-backend/src/routes/seo.router.ts:55: * Returns a dynamic XML sitemap containing all PUBLIC_INDEXABLE channels
harmony-backend/src/services/visibility.service.ts:2: * ChannelVisibilityService (M-B3) — owns the visibility state machine
harmony-backend/src/services/visibility.service.ts:3: * and audit logging for channel visibility changes.
harmony-backend/src/services/visibility.service.ts:25:  visibility: ChannelVisibility;
harmony-backend/src/services/visibility.service.ts:36:  /** Null when the request was a no-op (visibility unchanged — no audit entry created). */
harmony-backend/src/services/visibility.service.ts:40:export const visibilityService = {
harmony-backend/src/services/visibility.service.ts:42:   * Get the current visibility of a channel.
harmony-backend/src/services/visibility.service.ts:52:    return channel.visibility;
harmony-backend/src/services/visibility.service.ts:56:   * Change a channel's visibility.
harmony-backend/src/services/visibility.service.ts:64:    const { channelId, serverId, visibility, actorId, ip, userAgent = '' } = input;
harmony-backend/src/services/visibility.service.ts:74:      // No-op guard: skip DB write, audit log, and event emission if visibility is unchanged.
harmony-backend/src/services/visibility.service.ts:75:      if (current.visibility === visibility) {
harmony-backend/src/services/visibility.service.ts:76:        return { isNoOp: true as const, oldVisibility: current.visibility };
harmony-backend/src/services/visibility.service.ts:79:      // VOICE channels cannot be made PUBLIC_INDEXABLE
harmony-backend/src/services/visibility.service.ts:80:      if (current.type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/services/visibility.service.ts:83:          message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
harmony-backend/src/services/visibility.service.ts:90:          visibility,
harmony-backend/src/services/visibility.service.ts:91:          // §6.3: set indexedAt only when transitioning TO PUBLIC_INDEXABLE (not on no-op updates)
harmony-backend/src/services/visibility.service.ts:92:          ...(visibility === ChannelVisibility.PUBLIC_INDEXABLE &&
harmony-backend/src/services/visibility.service.ts:93:            current.visibility !== ChannelVisibility.PUBLIC_INDEXABLE && { indexedAt: new Date() }),
harmony-backend/src/services/visibility.service.ts:94:          // §5.2: clear indexedAt when transitioning TO PRIVATE
harmony-backend/src/services/visibility.service.ts:95:          ...(visibility === ChannelVisibility.PRIVATE &&
harmony-backend/src/services/visibility.service.ts:96:            current.visibility !== ChannelVisibility.PRIVATE && { indexedAt: null }),
harmony-backend/src/services/visibility.service.ts:105:          oldValue: { visibility: current.visibility },
harmony-backend/src/services/visibility.service.ts:106:          newValue: { visibility },
harmony-backend/src/services/visibility.service.ts:113:      return { isNoOp: false as const, updatedChannel: updated, auditEntry: audit, oldVisibility: current.visibility };
harmony-backend/src/services/visibility.service.ts:121:        newVisibility: visibility,
harmony-backend/src/services/visibility.service.ts:131:      newVisibility: visibility,
harmony-backend/src/services/visibility.service.ts:140:      newVisibility: visibility,
harmony-backend/src/services/indexing.service.ts:2: * IndexingService — manages sitemap data for PUBLIC_INDEXABLE channels.
harmony-backend/src/services/indexing.service.ts:68:   * Generate a sitemap XML string for all PUBLIC_INDEXABLE channels in a server.
harmony-backend/src/services/indexing.service.ts:89:   * Handle a visibility change event — update sitemap accordingly.
harmony-backend/src/services/indexing.service.ts:94:    if (payload.newVisibility === 'PUBLIC_INDEXABLE') {
harmony-backend/src/services/indexing.service.ts:96:    } else if (payload.oldVisibility === 'PUBLIC_INDEXABLE') {
harmony-backend/src/services/channel.service.ts:14:  visibility: ChannelVisibility;
harmony-backend/src/services/channel.service.ts:47:    const { serverId, name, slug, type, visibility, topic, position = 0 } = input;
harmony-backend/src/services/channel.service.ts:49:    // VOICE channels cannot be PUBLIC_INDEXABLE
harmony-backend/src/services/channel.service.ts:50:    if (type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/services/channel.service.ts:53:        message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
harmony-backend/src/services/channel.service.ts:72:    const channel = await channelRepository.create({ serverId, name, slug, type, visibility, topic, position }, tx);
harmony-backend/src/services/channel.service.ts:77:      // Write-through: cache new visibility and invalidate server channel list (best-effort)
harmony-backend/src/services/channel.service.ts:79:        .set(CacheKeys.channelVisibility(channel.id), channel.visibility, {
harmony-backend/src/services/channel.service.ts:85:            'Failed to cache channel visibility after creation',
harmony-backend/src/services/channel.service.ts:173:          'Failed to invalidate channel visibility cache after deletion',
harmony-backend/src/services/channel.service.ts:214:      visibility: isPublic ? ChannelVisibility.PUBLIC_INDEXABLE : ChannelVisibility.PRIVATE,
harmony-backend/src/services/permission.service.ts:20:  | 'channel:manage_visibility';
harmony-backend/src/services/permission.service.ts:61:  'channel:manage_visibility',
harmony-backend/src/trpc/routers/channel.router.ts:4:import { visibilityService } from '../../services/visibility.service';
harmony-backend/src/trpc/routers/channel.router.ts:8:const ChannelVisibilitySchema = z.enum(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);
harmony-backend/src/trpc/routers/channel.router.ts:16:  /** Requires channel:read — prevents leaking PRIVATE channel metadata to non-members. */
harmony-backend/src/trpc/routers/channel.router.ts:28:        visibility: ChannelVisibilitySchema.default('PRIVATE'),
harmony-backend/src/trpc/routers/channel.router.ts:56:  /** Change a channel's visibility. Requires channel:manage_visibility (admin+). */
harmony-backend/src/trpc/routers/channel.router.ts:57:  setVisibility: withPermission('channel:manage_visibility')
harmony-backend/src/trpc/routers/channel.router.ts:62:        visibility: ChannelVisibilitySchema,
harmony-backend/src/trpc/routers/channel.router.ts:66:      visibilityService.setVisibility({
harmony-backend/src/trpc/routers/channel.router.ts:69:        visibility: input.visibility,
harmony-backend/src/trpc/routers/channel.router.ts:76:  /** Read a channel's visibility. Requires channel:read with serverId. */
harmony-backend/src/trpc/routers/channel.router.ts:79:    .query(({ input }) => visibilityService.getVisibility(input.channelId, input.serverId)),
harmony-backend/src/trpc/routers/channel.router.ts:82:   * Retrieve paginated visibility audit log for a channel.
harmony-backend/src/trpc/routers/channel.router.ts:83:   * Requires channel:manage_visibility (admin+) because audit rows contain
harmony-backend/src/trpc/routers/channel.router.ts:87:  getAuditLog: withPermission('channel:manage_visibility')
harmony-backend/src/trpc/routers/channel.router.ts:101:      await visibilityService.getVisibility(input.channelId, input.serverId);
harmony-backend/src/services/auditLog.service.ts:2: * AuditLogService (M-B3 sub-module) — dedicated service for visibility
harmony-backend/src/services/auditLog.service.ts:28:  /** JSON snapshot of the old visibility state, e.g. `{ visibility: 'PRIVATE' }` */
harmony-backend/src/services/auditLog.service.ts:30:  /** JSON snapshot of the new visibility state, e.g. `{ visibility: 'PUBLIC_INDEXABLE' }` */
harmony-backend/src/services/server.service.ts:92:  /** Dev admin: returns all servers regardless of visibility. */
```

#### Tool: exec_command

```sh
gh pr checks 443 --repo CS485-Harmony/Harmony
```

Output:

```text
Backend Lint and Build	pass	26s	https://github.com/CS485-Harmony/Harmony/actions/runs/24741760516/job/72383017489	
Frontend Lint and Build	pass	42s	https://github.com/CS485-Harmony/Harmony/actions/runs/24741760516/job/72383017474	
Run Backend Tests	pass	1m19s	https://github.com/CS485-Harmony/Harmony/actions/runs/24741760513/job/72383017437	
Run Frontend Tests	pass	28s	https://github.com/CS485-Harmony/Harmony/actions/runs/24741760551/job/72383017407	
Run Integration Tests	pass	2m8s	https://github.com/CS485-Harmony/Harmony/actions/runs/24741760507/job/72383017374	
Vercel Preview Comments	pass	0	https://vercel.com/github	
Run Cloud Integration Tests	skipping	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24741760507/job/72383017901	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/GUiDVJSrVZk5fwFncpZuqhts4cjs	Deployment has completed
```

#### Tool: exec_command

```sh
rg -n "slug.*regex|channelSlug|serverSlug|z\.string\(\).*slug|slug:" harmony-backend/src harmony-backend/prisma -g '!node_modules'
```

Output:

```text
harmony-backend/src/services/indexing.service.ts:8: *   - generateSitemap(serverSlug)  — builds XML sitemap for a server
harmony-backend/src/services/indexing.service.ts:23:  serverSitemap: (serverSlug: string) => `sitemap:${sanitizeKeySegment(serverSlug)}`,
harmony-backend/src/services/indexing.service.ts:71:  async generateSitemap(serverSlug: string): Promise<string | null> {
harmony-backend/src/services/indexing.service.ts:72:    const server = await serverRepository.findBySlugSelect(serverSlug, { id: true, slug: true });
harmony-backend/src/services/indexing.service.ts:76:    const cacheKey = CacheKeys_Sitemap.serverSitemap(serverSlug);
harmony-backend/src/services/indexing.service.ts:103:  serverSlug: string,
harmony-backend/src/services/indexing.service.ts:104:  channels: { slug: string; updatedAt: Date }[],
harmony-backend/src/services/indexing.service.ts:109:        `  <url>\n    <loc>${escapeXml(BASE_URL)}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(ch.slug)}</loc>\n    <lastmod>${ch.updatedAt.toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`,
harmony-backend/src/services/indexing.service.ts:116:function buildSitemapIndexXml(serverSlugs: string[]): string {
harmony-backend/src/services/indexing.service.ts:117:  const sitemaps = serverSlugs
harmony-backend/src/services/indexing.service.ts:119:      (serverSlug) =>
harmony-backend/src/services/indexing.service.ts:120:        `  <sitemap>\n    <loc>${escapeXml(BASE_URL)}/sitemap/${encodeURIComponent(serverSlug)}</loc>\n  </sitemap>`,
harmony-backend/src/services/server.service.ts:65:  fn: (slug: string) => Promise<Server>,
harmony-backend/src/services/server.service.ts:103:  async getServer(slug: string): Promise<Server | null> {
harmony-backend/src/services/server.service.ts:117:        const server = await serverRepository.create({ ...input, slug: s }, tx);
harmony-backend/src/services/server.service.ts:139:        serverRepository.update(id, { ...data, slug: s }),
harmony-backend/src/services/auth.service.ts:224:      { slug: 'harmony-hq', isPublic: true },
harmony-backend/src/services/channel.service.ts:12:  slug: string;
harmony-backend/src/services/channel.service.ts:32:  async getChannelBySlug(serverSlug: string, channelSlug: string) {
harmony-backend/src/services/channel.service.ts:33:    const server = await serverRepository.findBySlug(serverSlug);
harmony-backend/src/services/channel.service.ts:38:    const channel = await channelRepository.findByServerAndSlug(server.id, channelSlug);
harmony-backend/src/services/channel.service.ts:212:      slug: 'general',
harmony-backend/src/routes/public.router.ts:148:        slug: true,
harmony-backend/src/routes/public.router.ts:164: * GET /api/public/servers/:serverSlug
harmony-backend/src/routes/public.router.ts:168:router.get('/servers/:serverSlug', async (req: Request, res: Response) => {
harmony-backend/src/routes/public.router.ts:171:      where: { slug: req.params.serverSlug },
harmony-backend/src/routes/public.router.ts:175:        slug: true,
harmony-backend/src/routes/public.router.ts:213:    logger.error({ err, serverSlug: req.params.serverSlug }, 'Public server route failed');
harmony-backend/src/routes/public.router.ts:219: * GET /api/public/servers/:serverSlug/channels
harmony-backend/src/routes/public.router.ts:223:router.get('/servers/:serverSlug/channels', async (req: Request, res: Response) => {
harmony-backend/src/routes/public.router.ts:226:      where: { slug: req.params.serverSlug },
harmony-backend/src/routes/public.router.ts:242:        select: { id: true, name: true, slug: true, type: true, topic: true },
harmony-backend/src/routes/public.router.ts:265:    logger.error({ err, serverSlug: req.params.serverSlug }, 'Public channels route failed');
harmony-backend/src/routes/public.router.ts:271: * GET /api/public/servers/:serverSlug/channels/:channelSlug
harmony-backend/src/routes/public.router.ts:276:  '/servers/:serverSlug/channels/:channelSlug',
harmony-backend/src/routes/public.router.ts:280:        where: { slug: req.params.serverSlug },
harmony-backend/src/routes/public.router.ts:290:        where: { serverId: server.id, slug: req.params.channelSlug },
harmony-backend/src/routes/public.router.ts:294:          slug: true,
harmony-backend/src/routes/public.router.ts:318:        { err, serverSlug: req.params.serverSlug, channelSlug: req.params.channelSlug },
harmony-backend/src/routes/events.router.ts:316:  slug: true,
harmony-backend/src/routes/seo.router.ts:10: * - GET /sitemap/:serverSlug.xml — dynamic sitemap of PUBLIC_INDEXABLE channels
harmony-backend/src/routes/seo.router.ts:54: * GET /sitemap/:serverSlug.xml
harmony-backend/src/routes/seo.router.ts:58:seoRouter.get('/sitemap/:serverSlug.xml', async (req: Request, res: Response) => {
harmony-backend/src/routes/seo.router.ts:60:    const { serverSlug } = req.params;
harmony-backend/src/routes/seo.router.ts:61:    const xml = await indexingService.generateSitemap(serverSlug);
harmony-backend/src/routes/seo.router.ts:72:    logger.error({ err, serverSlug: req.params.serverSlug }, 'Sitemap generation failed');
harmony-backend/src/dev/mockSeed.ts:17:  slug: string;
harmony-backend/src/dev/mockSeed.ts:31:  slug: string;
harmony-backend/src/dev/mockSeed.ts:175:      slug: server.slug,
harmony-backend/src/dev/mockSeed.ts:202:      slug: channel.slug,
harmony-backend/src/dev/mockSeed.ts:315:    where: { slug: { in: raw.servers.map((server) => server.slug) } },
harmony-backend/src/dev/mockSeed.ts:316:    select: { id: true, slug: true },
harmony-backend/src/dev/mockSeed.ts:327:        slug: channel.slug,
harmony-backend/src/dev/mockSeed.ts:330:    select: { id: true, serverId: true, slug: true },
harmony-backend/src/dev/mockSeed.ts:405:            slug: server.slug,
harmony-backend/src/dev/mockSeed.ts:424:            slug: channel.slug,
harmony-backend/src/repositories/channel.repository.ts:15:  findByServerAndSlug(serverId: string, slug: string, client: Client = prisma) {
harmony-backend/src/repositories/channel.repository.ts:16:    return client.channel.findUnique({ where: { serverId_slug: { serverId, slug } } });
harmony-backend/src/repositories/channel.repository.ts:29:      select: { serverId: true, server: { select: { slug: true } } },
harmony-backend/src/repositories/channel.repository.ts:40:      select: { slug: true, updatedAt: true },
harmony-backend/src/trpc/routers/server.router.ts:18:    .input(z.object({ slug: z.string().min(1) }))
harmony-backend/src/trpc/routers/channel.router.ts:18:    .input(z.object({ serverId: z.string().uuid(), serverSlug: z.string(), channelSlug: z.string() }))
harmony-backend/src/trpc/routers/channel.router.ts:19:    .query(({ input }) => channelService.getChannelBySlug(input.serverSlug, input.channelSlug)),
harmony-backend/src/trpc/routers/channel.router.ts:26:        slug: z.string().min(1).max(100),
harmony-backend/src/repositories/server.repository.ts:7:  findBySlug(slug: string, client: Client = prisma) {
harmony-backend/src/repositories/server.repository.ts:35:  findBySlugSelect<T extends Prisma.ServerSelect>(slug: string, select: T, client: Client = prisma) {
harmony-backend/src/repositories/server.repository.ts:43:      select: { slug: true },
harmony-backend/src/repositories/server.repository.ts:51:  countBySlug(slug: string, client: Client = prisma) {
harmony-backend/src/dev/mock-seed-data.json:1992:      "content": "📦 **Discord-like shell wired up** — `/c/:serverSlug/:channelSlug` route live. `npm run dev` shows the full layout now!",
```

#### Tool: exec_command

```sh
sed -n '1,130p' harmony-backend/src/trpc/routers/channel.router.ts && sed -n '1,120p' harmony-backend/src/services/channel.service.ts && sed -n '90,125p' harmony-backend/src/services/indexing.service.ts
```

Output:

```text
import { z } from 'zod';
import { router, withPermission } from '../init';
import { channelService } from '../../services/channel.service';
import { visibilityService } from '../../services/visibility.service';
import { auditLogService } from '../../services/auditLog.service';

const ChannelTypeSchema = z.enum(['TEXT', 'VOICE', 'ANNOUNCEMENT']);
const ChannelVisibilitySchema = z.enum(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);

export const channelRouter = router({
  /** Requires server membership (server:read) — prevents leaking channel metadata to non-members. */
  getChannels: withPermission('server:read')
    .input(z.object({ serverId: z.string().uuid() }))
    .query(({ input }) => channelService.getChannels(input.serverId)),

  /** Requires channel:read — prevents leaking PRIVATE channel metadata to non-members. */
  getChannel: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), serverSlug: z.string(), channelSlug: z.string() }))
    .query(({ input }) => channelService.getChannelBySlug(input.serverSlug, input.channelSlug)),

  createChannel: withPermission('channel:create')
    .input(
      z.object({
        serverId: z.string().uuid(),
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        type: ChannelTypeSchema.default('TEXT'),
        visibility: ChannelVisibilitySchema.default('PRIVATE'),
        topic: z.string().optional(),
        position: z.number().int().min(0).optional(),
      }),
    )
    .mutation(({ input }) => channelService.createChannel(input)),

  updateChannel: withPermission('channel:update')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        topic: z.string().optional(),
        position: z.number().int().min(0).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { channelId, serverId, ...patch } = input;
      return channelService.updateChannel(channelId, serverId, patch);
    }),

  deleteChannel: withPermission('channel:delete')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .mutation(({ input }) =>
      channelService.deleteChannel(input.channelId, input.serverId),
    ),

  /** Change a channel's visibility. Requires channel:manage_visibility (admin+). */
  setVisibility: withPermission('channel:manage_visibility')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        visibility: ChannelVisibilitySchema,
      }),
    )
    .mutation(({ input, ctx }) =>
      visibilityService.setVisibility({
        channelId: input.channelId,
        serverId: input.serverId,
        visibility: input.visibility,
        actorId: ctx.userId,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      }),
    ),

  /** Read a channel's visibility. Requires channel:read with serverId. */
  getVisibility: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .query(({ input }) => visibilityService.getVisibility(input.channelId, input.serverId)),

  /**
   * Retrieve paginated visibility audit log for a channel.
   * Requires channel:manage_visibility (admin+) because audit rows contain
   * sensitive per-actor metadata (ipAddress, userAgent).
   * Uses serverId to verify the channel belongs to the caller's server.
   */
  getAuditLog: withPermission('channel:manage_visibility')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        limit: z.number().int().min(1).max(100).optional(),
        offset: z.number().int().min(0).optional(),
        startDate: z.string().datetime().optional(),
      }),
    )
    .query(async ({ input }) => {
      // withPermission validates the caller has admin rights in `serverId`, but does NOT
      // verify that `channelId` belongs to that server. Without this check, an admin of
      // server A could supply a channelId from server B and read its audit data.
      await visibilityService.getVisibility(input.channelId, input.serverId);
      return auditLogService.getVisibilityAuditLog(input.channelId, {
        limit: input.limit,
        offset: input.offset,
        startDate: input.startDate !== undefined ? new Date(input.startDate) : undefined,
      });
    }),
});
import { TRPCError } from '@trpc/server';
import { ChannelType, ChannelVisibility, Prisma } from '@prisma/client';
import { createLogger } from '../lib/logger';
import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from './cache.service';
import { eventBus, EventChannels } from '../events/eventBus';
import { channelRepository } from '../repositories/channel.repository';
import { serverRepository } from '../repositories/server.repository';

export interface CreateChannelInput {
  serverId: string;
  name: string;
  slug: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  topic?: string;
  position?: number;
}

export interface UpdateChannelInput {
  name?: string;
  topic?: string;
  position?: number;
}

const logger = createLogger({ component: 'channel-service' });

export const channelService = {
  async getChannels(serverId: string) {
    return channelRepository.findByServerId(serverId);
  },

  async getChannelBySlug(serverSlug: string, channelSlug: string) {
    const server = await serverRepository.findBySlug(serverSlug);
    if (!server) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    }

    const channel = await channelRepository.findByServerAndSlug(server.id, channelSlug);
    if (!channel) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });
    }

    return channel;
  },

  async createChannel(input: CreateChannelInput, tx?: Prisma.TransactionClient) {
    const { serverId, name, slug, type, visibility, topic, position = 0 } = input;

    // VOICE channels cannot be PUBLIC_INDEXABLE
    if (type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
      });
    }

    // Verify server exists
    const server = await serverRepository.findById(serverId, tx);
    if (!server) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    }

    // Check slug uniqueness per server
    const existing = await channelRepository.findByServerAndSlug(serverId, slug, tx);
    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Channel slug already exists in this server',
      });
    }

    const channel = await channelRepository.create({ serverId, name, slug, type, visibility, topic, position }, tx);

    // Skip cache/event side effects when participating in an outer transaction — they must
    // not fire before the transaction commits, or they may leak state if the tx rolls back.
    if (!tx) {
      // Write-through: cache new visibility and invalidate server channel list (best-effort)
      cacheService
        .set(CacheKeys.channelVisibility(channel.id), channel.visibility, {
          ttl: CacheTTL.channelVisibility,
        })
        .catch((err) =>
          logger.warn(
            { err, channelId: channel.id },
            'Failed to cache channel visibility after creation',
          ),
        );
      cacheService
        .invalidate(`server:${sanitizeKeySegment(serverId)}:public_channels`)
        .catch((err) =>
          logger.warn(
            { err, serverId },
            'Failed to invalidate public channel cache after channel creation',
          ),
        );

      // Notify connected clients (fire-and-forget)
      eventBus
        .publish(EventChannels.CHANNEL_CREATED, {
          channelId: channel.id,
          serverId: channel.serverId,
          timestamp: new Date().toISOString(),
        })
        .catch((err) =>
          logger.warn(
            { err, channelId: channel.id, serverId },
            'Failed to publish channel created event',
          ),
        );
    }

    return channel;
  },

  async updateChannel(channelId: string, serverId: string, patch: UpdateChannelInput) {
    const channel = await channelRepository.findById(channelId);
    if (!channel || channel.serverId !== serverId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this server' });
    }

   */
  async onVisibilityChanged(
    payload: Pick<VisibilityChangedPayload, 'channelId' | 'oldVisibility' | 'newVisibility'>,
  ): Promise<void> {
    if (payload.newVisibility === 'PUBLIC_INDEXABLE') {
      await this.addToSitemap(payload.channelId);
    } else if (payload.oldVisibility === 'PUBLIC_INDEXABLE') {
      await this.removeFromSitemap(payload.channelId);
    }
  },
};

function buildSitemapXml(
  serverSlug: string,
  channels: { slug: string; updatedAt: Date }[],
): string {
  const urls = channels
    .map(
      (ch) =>
        `  <url>\n    <loc>${escapeXml(BASE_URL)}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(ch.slug)}</loc>\n    <lastmod>${ch.updatedAt.toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function buildSitemapIndexXml(serverSlugs: string[]): string {
  const sitemaps = serverSlugs
    .map(
      (serverSlug) =>
        `  <sitemap>\n    <loc>${escapeXml(BASE_URL)}/sitemap/${encodeURIComponent(serverSlug)}</loc>\n  </sitemap>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>`;
}
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/metaTagService.ts | nl -ba | sed -n '45,170p'
```

Output:

```text
    45	    openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
    46	    twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
    47	    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
    48	    keywords: [],
    49	    needsRegeneration: true,
    50	  };
    51	}
    52	
    53	export const metaTagService = {
    54	  /**
    55	   * Generate meta tags from pre-resolved context (used internally and in unit tests).
    56	   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
    57	   */
    58	  async generateMetaTagsFromContext(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
    59	    try {
    60	      const title = TitleGenerator.generateFromThread(messages, channel);
    61	      const description = DescriptionGenerator.generateFromMessages(messages, channel);
    62	      const keywords = DescriptionGenerator.extractKeyPhrases(messages.map((m) => m.content).join(' '), 5);
    63	      const analysis: ContentAnalysis = {
    64	        keywords,
    65	        topics: [title],
    66	        summary: description,
    67	        sentiment: 'neutral',
    68	        readingLevel: 'basic',
    69	      };
    70	      const og = OpenGraphGenerator.generateOGTags(channel, {}, analysis);
    71	      const twitter = OpenGraphGenerator.generateTwitterCard(channel, {}, analysis, og.ogImage);
    72	      const structuredData = StructuredDataGenerator.generateDiscussionForum(channel, messages, {});
    73	
    74	      return {
    75	        title,
    76	        description,
    77	        canonical: channel.canonicalUrl,
    78	        robots: 'index, follow',
    79	        openGraph: og,
    80	        twitter,
    81	        structuredData,
    82	        keywords,
    83	        needsRegeneration: false,
    84	      };
    85	    } catch (err) {
    86	      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
    87	      return buildFallbackTags(channel);
    88	    }
    89	  },
    90	
    91	  /**
    92	   * Spec-aligned stub: generateMetaTags(channelId, options?).
    93	   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
    94	   */
    95	  async generateMetaTags(
    96	    _channelId: string,
    97	    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
    98	  ): Promise<MetaTagSet> {
    99	    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
   100	  },
   101	
   102	  /**
   103	   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
   104	   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
   105	   */
   106	  async getOrGenerateCachedFromContext(
   107	    channel: ChannelContext,
   108	    messages: MessageContext[],
   109	    ttl?: number,
   110	  ): Promise<MetaTagSet> {
   111	    const cached = await MetaTagCache.get(channel.id);
   112	    if (cached) return cached;
   113	
   114	    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
   115	    // Do not cache fallback tags — a transient failure must not poison the cache for the full TTL
   116	    if (!tags.needsRegeneration) {
   117	      await MetaTagCache.set(channel.id, tags, ttl);
   118	    }
   119	    return tags;
   120	  },
   121	
   122	  /**
   123	   * Spec-aligned stub: getOrGenerateCached(channelId).
   124	   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
   125	   */
   126	  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
   127	    throw new Error('getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)');
   128	  },
   129	
   130	  async invalidateCache(channelId: string): Promise<void> {
   131	    await MetaTagCache.invalidate(channelId);
   132	  },
   133	
   134	  // scheduleRegeneration and getRegenerationJobStatus are stubs —
   135	  // full implementation depends on M4 (worker/queue) from issue #356
   136	  async scheduleRegeneration(
   137	    channelId: string,
   138	    _priority?: 'high' | 'normal' | 'low',
   139	    _idempotencyKey?: string,
   140	  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
   141	    // Queuing logic wired by M4 MetaTagUpdateWorker
   142	    return {
   143	      jobId: `meta-tag-regeneration:${channelId}`,
   144	      status: 'queued',
   145	    };
   146	  },
   147	
   148	  async getRegenerationJobStatus(
   149	    _channelId: string,
   150	    _jobId: string,
   151	  ): Promise<MetaTagJobStatus> {
   152	    throw new Error('getRegenerationJobStatus not yet implemented — wired by M4 (issue #356)');
   153	  },
   154	
   155	  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
   156	    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
   157	  },
   158	
   159	  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
   160	    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;
   161	  },
   162	};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/types.ts | nl -ba | sed -n '70,100p'
```

Output:

```text
    70	export interface MetaTagJobStatus {
    71	  jobId: string;
    72	  channelId: string;
    73	  status: 'queued' | 'processing' | 'succeeded' | 'failed';
    74	  attempts: number;
    75	  startedAt: string | null;
    76	  completedAt: string | null;
    77	  errorCode: string | null;
    78	  errorMessage: string | null;
    79	}
    80	
    81	export interface ChannelContext {
    82	  id: string;
    83	  name: string;
    84	  slug: string;
    85	  topic?: string | null;
    86	  serverName: string;
    87	  serverSlug: string;
    88	  canonicalUrl: string;
    89	}
    90	
    91	export interface MessageContext {
    92	  content: string;
    93	  createdAt: Date;
    94	  authorDisplayName?: string;
    95	}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:23:38.868Z

The prior cache and `MetaTagJobStatus` findings are fixed in `883e71d`, and CI is green. The remaining blockers are the two unresolved automated review comments: robots directives ignore channel visibility, and canonical URL building does not encode slug path segments.

#### Tool: exec_command

```sh
cat >/tmp/review443-rereview.md <<'EOF'
## PR Review Checklist

- [ ] **1. Logic over Style** — The previous cache-poisoning issue is fixed, but the current head still hardcodes `robots: 'index, follow'` for all generated tags even though the SEO spec requires `PUBLIC_NO_INDEX` channels to emit `noindex`.
- [x] **2. Security First** — I did not find a new code-level security issue in the latest meta-tag changes. The existing `llm-logs/` concern has already been raised separately and I am not repeating it here.
- [ ] **3. Architectural Alignment** — The new service still does not carry visibility through `ChannelContext`, so it cannot satisfy the spec’s visibility-driven robots behavior.
- [ ] **4. Issue Completion** — The prior findings on fallback caching and `MetaTagJobStatus` are fixed, but the remaining robots/canonical URL issues still block the M2 skeleton from matching the SEO feature behavior.
- [x] **5. No Nitpicking** — This review is limited to correctness/contract issues.
- [x] **6. Avoid Repetition** — I am not adding duplicate inline comments; the remaining blockers are the two existing unresolved automated comments on this PR.
- [x] **7. Iterative Reviews** — Re-reviewed the latest commit `883e71d`; the two issues from my prior review are resolved.
- [x] **8. Prevent CI Failures** — Current GitHub checks are green; the remaining issues are behavioral gaps not caught by CI.

## Review (Request changes)

The latest commit fixes the two blockers from my previous review:

- `getOrGenerateCachedFromContext()` no longer caches fallback tags with `needsRegeneration=true`, and there is a regression test for that path.
- `getRegenerationJobStatus()` now has the spec return type, and `MetaTagJobStatus` includes `errorCode` / `errorMessage`.

I’m still requesting changes because two existing unresolved automated comments are valid and should be addressed before merge:

1. `MetaTagSet.robots` is always `index, follow`. The spec explicitly requires `PUBLIC_NO_INDEX` to regenerate/serve `noindex, follow`, so `ChannelContext` needs visibility or equivalent policy input before tags are generated.

2. `buildCanonicalUrl(serverSlug, channelSlug)` interpolates raw path segments. Channel slugs are only validated as non-empty strings with max length, and the existing sitemap implementation already uses `encodeURIComponent`, so this helper should encode both slug segments too.

Once those are fixed, I do not see remaining blockers in the meta-tag skeleton.
EOF

gh pr review 443 --repo CS485-Harmony/Harmony --request-changes --body-file /tmp/review443-rereview.md
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:23:55.520Z

The re-review has been posted as `REQUEST_CHANGES`. I’m verifying GitHub recorded it cleanly.

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls/443/reviews | jq 'map({id,user:.user.login,state,submitted_at,commit_id,body})[-3:]'
```

Output:

```text
[
  {
    "id": 4141792373,
    "user": "FardeenI",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:33:39Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "- [x] **Prioritize Logic over Style:** Focusing on correctness/contract drift (not formatting).\n- [x] **Security First:** No secrets added; sanitization added for user-controlled strings.\n- [ ] **Architectural Alignment:** Several public method signatures still diverge from `docs/dev-spec-seo-meta-tag-generation.md` §9.1.*.\n- [ ] **Issue Completion:** Issue #350 AC requires spec-named signatures; a few are still mismatched.\n- [x] **No Nitpicking:** No style-only feedback.\n- [x] **Avoid Repetition:** Not repeating already-addressed review threads.\n- [x] **Iterative Reviews:** Considered existing review threads before adding new feedback.\n- [x] **Prevent CI Failures:** CI is green; requested changes are contract/spec alignment to prevent future breakage.\n\n---\n\n## Requested changes (actionable)\n\n### 1) Align generator method signatures to the SEO spec (Issue #350 AC)\nRight now the M2 “skeleton” compiles/tests, but several exported method signatures don’t match the spec prototypes in `docs/dev-spec-seo-meta-tag-generation.md` §9.1. That’s likely to cause downstream integration churn when M3/M4 wiring lands.\n\n**`harmony-backend/src/services/metaTag/openGraphGenerator.ts`**\nSpec expects:\n- `generateOGTags(channel: Channel, server: Server, analysis: ContentAnalysis): OpenGraphTags`\n- `generateTwitterCard(channel: Channel, server: Server, analysis: ContentAnalysis): TwitterCardTags`\n- `selectPreviewImage(channel: Channel, messages: Message[]): string | null`\n\nCurrent signatures are `(channel, title, description)` and `selectPreviewImage(channel): string`.\n\n**Suggestion:** keep your current placeholder logic, but change the exported signatures to match spec and adapt callers (e.g. in `MetaTagService`, pass a placeholder `analysis` for now and ignore unused args in the generator).\n\n**`harmony-backend/src/services/metaTag/structuredDataGenerator.ts`**\nSpec expects:\n- `generateDiscussionForum(channel, messages, server)`\n- `generateBreadcrumbList(server, channel)`\n- `generateOrganization(server)`\n- `generateWebPage(channel, metaTags)`\n\nCurrent signatures are `(channel, title, description)` / `(channel)` / `()` / `(channel, title, description)`.\n\n**Suggestion:** change signatures to spec and keep stubs internally (you can still leave `author/datePublished` unset until M4).\n\n**`harmony-backend/src/services/metaTag/descriptionGenerator.ts`**\nSpec expects:\n- `extractKeyPhrases(content: string, maxPhrases: number): string[]`\n- `summarizeThread(messages: Message[]): string`\n\nCurrent `extractKeyPhrases(messages[])` and `summarizeThread(messages, channel)` diverge.\n\n**Suggestion:** add/rename the spec-shaped methods (they can be thin wrappers around your current logic: join messages -> content; keep `maxPhrases` configurable rather than hardcoded to 5).\n\n### 2) Spec return type for `getRegenerationJobStatus`\nIn `harmony-backend/src/services/metaTag/metaTagService.ts`, spec has `Promise<MetaTagJobStatus>`; current stub returns `Promise<MetaTagJobStatus | null>`.\n\n**Suggestion:** for a stub, prefer throwing `not implemented` (or return a placeholder status) to keep the signature aligned.\n\n### 3) (Optional) PR signal/noise\nThis PR includes 2 new `llm-logs/*.md` artifacts. If those are required by process, OK—just noting it makes reviews harder to scan.\n"
  },
  {
    "id": 4150247194,
    "user": "chatgpt-codex-connector[bot]",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:18:02Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "\n### 💡 Codex Review\n\nHere are some automated review suggestions for this pull request.\n\n**Reviewed commit:** `c3a7a608c1`\n    \n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment \"@codex review\".\n\nIf Codex has suggestions, it will comment; otherwise it will react with 👍.\n\n\n\n\nCodex can also answer questions or update the PR. Try commenting \"@codex address that feedback\".\n            \n</details>"
  },
  {
    "id": 4150273985,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-21T19:23:52Z",
    "commit_id": "883e71d96e3e7c383767da13cc6331a61b3b074d",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — The previous cache-poisoning issue is fixed, but the current head still hardcodes `robots: 'index, follow'` for all generated tags even though the SEO spec requires `PUBLIC_NO_INDEX` channels to emit `noindex`.\n- [x] **2. Security First** — I did not find a new code-level security issue in the latest meta-tag changes. The existing `llm-logs/` concern has already been raised separately and I am not repeating it here.\n- [ ] **3. Architectural Alignment** — The new service still does not carry visibility through `ChannelContext`, so it cannot satisfy the spec’s visibility-driven robots behavior.\n- [ ] **4. Issue Completion** — The prior findings on fallback caching and `MetaTagJobStatus` are fixed, but the remaining robots/canonical URL issues still block the M2 skeleton from matching the SEO feature behavior.\n- [x] **5. No Nitpicking** — This review is limited to correctness/contract issues.\n- [x] **6. Avoid Repetition** — I am not adding duplicate inline comments; the remaining blockers are the two existing unresolved automated comments on this PR.\n- [x] **7. Iterative Reviews** — Re-reviewed the latest commit `883e71d`; the two issues from my prior review are resolved.\n- [x] **8. Prevent CI Failures** — Current GitHub checks are green; the remaining issues are behavioral gaps not caught by CI.\n\n## Review (Request changes)\n\nThe latest commit fixes the two blockers from my previous review:\n\n- `getOrGenerateCachedFromContext()` no longer caches fallback tags with `needsRegeneration=true`, and there is a regression test for that path.\n- `getRegenerationJobStatus()` now has the spec return type, and `MetaTagJobStatus` includes `errorCode` / `errorMessage`.\n\nI’m still requesting changes because two existing unresolved automated comments are valid and should be addressed before merge:\n\n1. `MetaTagSet.robots` is always `index, follow`. The spec explicitly requires `PUBLIC_NO_INDEX` to regenerate/serve `noindex, follow`, so `ChannelContext` needs visibility or equivalent policy input before tags are generated.\n\n2. `buildCanonicalUrl(serverSlug, channelSlug)` interpolates raw path segments. Channel slugs are only validated as non-empty strings with max length, and the existing sitemap implementation already uses `encodeURIComponent`, so this helper should encode both slug segments too.\n\nOnce those are fixed, I do not see remaining blockers in the meta-tag skeleton.\n"
  }
]
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:24:02.400Z

Re-reviewed latest head `883e71d` and posted `REQUEST_CHANGES`.

The prior blockers are fixed:
- fallback tags are no longer cached
- `getRegenerationJobStatus` / `MetaTagJobStatus` now align with the spec

Remaining blockers I posted:
- `robots` is still always `index, follow`; `PUBLIC_NO_INDEX` needs `noindex, follow`
- `buildCanonicalUrl()` still interpolates raw slug path segments instead of `encodeURIComponent`

All current GitHub checks are green.

<oai-mem-citation>
<citation_entries>
MEMORY.md:234-234|note=[used Harmony review workflow reminder to post checklist and bundled review]
MEMORY.md:155-157|note=[used Harmony PR review workflow memory entry for repo-specific review process]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>

### Turn 5: Note on pre-existing test failure tests/metaTag.repository.test.ts

#### 👤 User Prompt

- Time: 2026-04-21T19:28:43.095Z

```text
Note on pre-existing test failure

tests/metaTag.repository.test.ts fails with TypeScript errors about missing schema columns (customTitle, customDescription, customOgImage, updatedAt). This failure exists on main before this branch and is not caused by these changes.
the PR description has this? does this make sense or is it something that the author should fix
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:28:52.489Z

Checking the current PR description and the repo state around `metaTag.repository.test.ts` before giving a recommendation.

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json body,headRefOid,baseRefName,headRefName
```

Output:

```text
{"baseRefName":"main","body":"## Summary\n\n- Implements CL-C2.1–C2.6 per dev spec §3/§4 under `harmony-backend/src/services/metaTag/`\n- `MetaTagService` — facade with `generateMetaTags`, `getOrGenerateCached`, `invalidateCache`; stubs for `scheduleRegeneration`/`getRegenerationJobStatus` (wired by M4 in issue #356)\n- `TitleGenerator` — enforces ≤60 char limit with HTML sanitization and template application (AC-2)\n- `DescriptionGenerator` — enforces 50–160 char range, extends short summaries with channel context (AC-2)\n- `MetaTagCache` — Redis-backed via existing `cacheService` + `CacheKeys.metaChannel` with configurable TTL (default 3600s per spec D7.1)\n- `OpenGraphGenerator` and `StructuredDataGenerator` — skeleton implementations with correct method signatures\n- AC-9 fallback: on any generation error, `MetaTagService` returns channel-name-based fallback tags with `needsRegeneration=true`\n- 29 unit tests covering all AC items\n\n## Note on pre-existing test failure\n\n`tests/metaTag.repository.test.ts` fails with TypeScript errors about missing schema columns (`customTitle`, `customDescription`, `customOgImage`, `updatedAt`). This failure exists on `main` before this branch and is not caused by these changes.\n\n## Test plan\n\n- [x] All 29 new unit tests pass (`npx jest tests/metaTagService.test.ts`)\n- [x] No regressions in existing test suite (658 tests pass)\n- [x] TypeScript compiles cleanly for all new files\n\nCloses #350\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","headRefName":"feature/issue-350-meta-tag-service-skeleton","headRefOid":"b5a5950f129a9aa73b77045e0c827a140b466ffb"}
```

#### Tool: exec_command

```sh
rg -n "metaTag.repository|customTitle|customDescription|customOgImage|updatedAt" harmony-backend/tests harmony-backend/src harmony-backend/prisma docs -g '!node_modules'
```

Output:

```text
docs/unified-backend-architecture.md:170:        +updatedAt: DateTime
harmony-backend/prisma/schema.prisma:140:  updatedAt  DateTime          @updatedAt @map("updated_at") @db.Timestamptz
harmony-backend/prisma/schema.prisma:255:  customTitle         String?  @map("custom_title") @db.VarChar(70)
harmony-backend/prisma/schema.prisma:257:  customDescription   String?  @map("custom_description") @db.VarChar(200)
harmony-backend/prisma/schema.prisma:259:  customOgImage       String?  @map("custom_og_image") @db.VarChar(500)
harmony-backend/prisma/schema.prisma:261:  updatedAt           DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
harmony-backend/tests/metaTag.repository.test.ts:5: * customTitle or customDescription set by an admin.
harmony-backend/tests/metaTag.repository.test.ts:11:import { metaTagRepository } from '../src/repositories/metaTag.repository';
harmony-backend/tests/metaTag.repository.test.ts:105:    expect(created.customTitle).toBeNull();
harmony-backend/tests/metaTag.repository.test.ts:106:    expect(created.customDescription).toBeNull();
harmony-backend/tests/metaTag.repository.test.ts:107:    expect(created.customOgImage).toBeNull();
harmony-backend/tests/metaTag.repository.test.ts:135:  it('AC-7: does not overwrite non-null customTitle set by admin', async () => {
harmony-backend/tests/metaTag.repository.test.ts:137:      customTitle: 'Admin Custom Title',
harmony-backend/tests/metaTag.repository.test.ts:144:    expect(record!.customTitle).toBe('Admin Custom Title');
harmony-backend/tests/metaTag.repository.test.ts:149:  it('AC-7: does not overwrite non-null customDescription set by admin', async () => {
harmony-backend/tests/metaTag.repository.test.ts:151:      customDescription: 'Admin Custom Description',
harmony-backend/tests/metaTag.repository.test.ts:158:    expect(record!.customDescription).toBe('Admin Custom Description');
harmony-backend/tests/metaTag.repository.test.ts:165:      customTitle: null,
harmony-backend/tests/metaTag.repository.test.ts:166:      customDescription: null,
harmony-backend/tests/metaTag.repository.test.ts:177:  it('bumps updatedAt on every successful saveGeneratedFields call', async () => {
harmony-backend/tests/metaTag.repository.test.ts:179:    const beforeUpdatedAt = before!.updatedAt.getTime();
harmony-backend/tests/metaTag.repository.test.ts:189:    expect(after!.updatedAt.getTime()).toBeGreaterThan(beforeUpdatedAt);
harmony-backend/tests/metaTag.repository.test.ts:200:  it('can set and clear customOgImage', async () => {
harmony-backend/tests/metaTag.repository.test.ts:202:      customOgImage: 'https://cdn.example.com/custom.png',
harmony-backend/tests/metaTag.repository.test.ts:205:    expect(record!.customOgImage).toBe('https://cdn.example.com/custom.png');
harmony-backend/tests/metaTag.repository.test.ts:207:    await metaTagRepository.updateCustomOverrides(channelId, { customOgImage: null });
harmony-backend/tests/metaTag.repository.test.ts:209:    expect(record!.customOgImage).toBeNull();
harmony-backend/tests/mock-seed.test.ts:133:        updatedAt: '2024-01-01T00:00:00Z',
docs/dev-spec-channel-visibility-toggle.md:190:        +updatedAt DateTime
harmony-backend/tests/channel.service.events.test.ts:80:  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
docs/p4-backend-modules.md:417:  updatedAt  DateTime          @updatedAt
harmony-backend/tests/events.router.server.test.ts:145:    updatedAt: new Date('2026-04-19T10:00:00.000Z'),
harmony-backend/src/services/indexing.service.ts:104:  channels: { slug: string; updatedAt: Date }[],
harmony-backend/src/services/indexing.service.ts:109:        `  <url>\n    <loc>${escapeXml(BASE_URL)}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(ch.slug)}</loc>\n    <lastmod>${ch.updatedAt.toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`,
harmony-backend/tests/events.router.visibility.test.ts:129:  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
docs/test-specs/frontend-server-service-spec.md:333:**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):
docs/test-specs/frontend-server-service-spec.md:348:**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):
docs/test-specs/frontend-server-service-spec.md:363:  updatedAt: "2026-01-01T00:00:00.000Z",
docs/test-specs/frontend-channel-service-spec.md:167:| Create channel with all fields | Full `Channel` object minus `id`, `createdAt`, `updatedAt`; `trpcMutate` resolves with full record | Returns adapted `Channel`; mutation called with `serverId`, `name`, `slug`, `type`, `visibility`, `topic`, and `position`; `description` is not forwarded |
harmony-backend/src/repositories/channel.repository.ts:40:      select: { slug: true, updatedAt: true },
harmony-backend/src/dev/mockSeed.ts:24:  updatedAt: string;
harmony-backend/src/dev/mockSeed.ts:209:      updatedAt: createdAt,
harmony-backend/src/dev/mockSeed.ts:431:            updatedAt: channel.updatedAt,
harmony-backend/tests/server.service.test.ts:93:    updatedAt: new Date('2024-01-01'),
harmony-backend/src/repositories/metaTag.repository.ts:35:      customTitle?: string | null;
harmony-backend/src/repositories/metaTag.repository.ts:36:      customDescription?: string | null;
harmony-backend/src/repositories/metaTag.repository.ts:37:      customOgImage?: string | null;
harmony-backend/src/repositories/metaTag.repository.ts:49:   * AC-7: Never overwrites non-null customTitle or customDescription.
harmony-backend/src/repositories/metaTag.repository.ts:57:          customTitle: null,
harmony-backend/src/repositories/metaTag.repository.ts:58:          customDescription: null,
docs/dev-spec-seo-meta-tag-generation.md:2090:**Length Policy:** `TitleGenerator` output is capped at 60 characters. Longer admin overrides are allowed via `MetaTagOverride.customTitle` (max 70).
docs/dev-spec-seo-meta-tag-generation.md:2115:**Length Policy:** `DescriptionGenerator` output is capped at 160 characters. Longer admin overrides are allowed via `MetaTagOverride.customDescription` (max 200).
docs/dev-spec-seo-meta-tag-generation.md:2803:        customTitle:
docs/dev-spec-seo-meta-tag-generation.md:2806:        customDescription:
docs/dev-spec-seo-meta-tag-generation.md:2809:        customOgImage:
docs/dev-spec-seo-meta-tag-generation.md:3145:| AC-3 | Effective override limits are enforced (`customTitle <=70`, `customDescription <=200`). | API validation test (`PUT /meta-tags`) |
harmony-backend/src/routes/events.router.ts:291:        updatedAt: payload.timestamp,
harmony-backend/src/routes/events.router.ts:322:  updatedAt: true,
harmony-backend/src/routes/events.router.ts:534:        updatedAt: payload.timestamp,
harmony-backend/src/dev/mock-seed-data.json:95:      "updatedAt": "2024-03-01T12:00:00.000Z"
harmony-backend/src/dev/mock-seed-data.json:107:      "updatedAt": "2024-03-10T14:30:00.000Z"
harmony-backend/src/dev/mock-seed-data.json:119:      "updatedAt": "2024-03-12T09:00:00.000Z"
```

#### Tool: exec_command

```sh
git ls-tree -r origin/main --name-only | rg 'metaTag.repository|schema.prisma|migration'
```

Output:

```text
harmony-backend/prisma/migrations/20260305161727_init/migration.sql
harmony-backend/prisma/migrations/20260305180000_add_server_owner/migration.sql
harmony-backend/prisma/migrations/20260306223212_add_user_status/migration.sql
harmony-backend/prisma/migrations/20260306223300_fix_missing_indexes/migration.sql
harmony-backend/prisma/migrations/20260307000000_add_auth_fields/migration.sql
harmony-backend/prisma/migrations/20260307032111_merge_auth_and_user_status/migration.sql
harmony-backend/prisma/migrations/20260307232000_add_rbac_server_members/migration.sql
harmony-backend/prisma/migrations/20260308000000_add_message_pinning/migration.sql
harmony-backend/prisma/migrations/20260316000000_add_message_replies/migration.sql
harmony-backend/prisma/migrations/20260321204234_add_message_reactions/migration.sql
harmony-backend/prisma/migrations/20260411224500_expand_password_hash_for_verifier_records/migration.sql
harmony-backend/prisma/migrations/20260418000000_add_meta_tag_overrides/migration.sql
harmony-backend/prisma/migrations/migration_lock.toml
harmony-backend/prisma/schema.prisma
harmony-backend/src/repositories/metaTag.repository.ts
harmony-backend/tests/metaTag.repository.test.ts
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:29:01.190Z

The PR description still contains that note. I’m checking whether `main` actually still has the schema/test mismatch now, because that determines whether the note is stale or a real external blocker.

#### Tool: exec_command

```sh
git show origin/main:harmony-backend/prisma/schema.prisma | nl -ba | sed -n '230,270p'
```

Output:

```text
   230	
   231	  channel Channel @relation(fields: [channelId], references: [id], onDelete: Cascade)
   232	  actor   User    @relation("AuditActor", fields: [actorId], references: [id])
   233	
   234	  // Both indexes below are added as raw SQL in the migration (DESC ordering
   235	  // cannot be expressed in Prisma schema DSL for composite indexes).
   236	  @@map("visibility_audit_log")
   237	}
   238	
   239	model GeneratedMetaTags {
   240	  id                  String   @id @default(uuid()) @db.Uuid
   241	  channelId           String   @unique(map: "idx_meta_tags_channel") @map("channel_id") @db.Uuid
   242	  title               String   @db.VarChar(120)
   243	  description         String   @db.VarChar(320)
   244	  ogTitle             String   @map("og_title") @db.VarChar(120)
   245	  ogDescription       String   @map("og_description") @db.VarChar(320)
   246	  ogImage             String?  @map("og_image") @db.VarChar(500)
   247	  twitterCard         String   @map("twitter_card") @db.VarChar(20)
   248	  keywords            String   @db.Text
   249	  structuredData      Json     @map("structured_data")
   250	  contentHash         String   @map("content_hash") @db.VarChar(64)
   251	  needsRegeneration   Boolean  @default(false) @map("needs_regeneration")
   252	  generatedAt         DateTime @default(now()) @map("generated_at") @db.Timestamptz
   253	  schemaVersion       Int      @default(1) @map("schema_version")
   254	  /// Admin override title — takes precedence over generated title when present.
   255	  customTitle         String?  @map("custom_title") @db.VarChar(70)
   256	  /// Admin override description — takes precedence over generated description when present.
   257	  customDescription   String?  @map("custom_description") @db.VarChar(200)
   258	  /// Admin override OG image URL — takes precedence over generated og_image when present.
   259	  customOgImage       String?  @map("custom_og_image") @db.VarChar(500)
   260	  createdAt           DateTime @default(now()) @map("created_at") @db.Timestamptz
   261	  updatedAt           DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
   262	
   263	  channel Channel @relation(fields: [channelId], references: [id], onDelete: Cascade)
   264	
   265	  // idx_meta_tags_channel is pinned via map: on the @unique above.
   266	  // idx_meta_tags_needs_regen (partial WHERE needs_regeneration = TRUE) exists in the init SQL migration.
   267	  // idx_meta_tags_generated (generated_at) is added as raw SQL in 20260418000000_add_meta_tag_overrides.
   268	  @@map("generated_meta_tags")
   269	}
```

#### Tool: exec_command

```sh
git show origin/main:harmony-backend/src/repositories/metaTag.repository.ts | nl -ba | sed -n '1,120p'
```

Output:

```text
     1	import { Prisma } from '@prisma/client';
     2	import { prisma } from '../db/prisma';
     3	
     4	type Client = Prisma.TransactionClient | typeof prisma;
     5	
     6	export type MetaTagCreateData = Prisma.GeneratedMetaTagsUncheckedCreateInput;
     7	
     8	export type GeneratedFieldsUpdate = {
     9	  title: string;
    10	  description: string;
    11	  ogTitle: string;
    12	  ogDescription: string;
    13	  ogImage?: string | null;
    14	  twitterCard: string;
    15	  keywords: string;
    16	  structuredData: Prisma.InputJsonValue;
    17	  contentHash: string;
    18	  needsRegeneration: boolean;
    19	  generatedAt: Date;
    20	  schemaVersion?: number;
    21	};
    22	
    23	export const metaTagRepository = {
    24	  findByChannelId(channelId: string, client: Client = prisma) {
    25	    return client.generatedMetaTags.findUnique({ where: { channelId } });
    26	  },
    27	
    28	  create(data: MetaTagCreateData, client: Client = prisma) {
    29	    return client.generatedMetaTags.create({ data });
    30	  },
    31	
    32	  updateCustomOverrides(
    33	    channelId: string,
    34	    overrides: {
    35	      customTitle?: string | null;
    36	      customDescription?: string | null;
    37	      customOgImage?: string | null;
    38	    },
    39	    client: Client = prisma,
    40	  ) {
    41	    return client.generatedMetaTags.update({
    42	      where: { channelId },
    43	      data: overrides,
    44	    });
    45	  },
    46	
    47	  /**
    48	   * Persist background-generated tag fields.
    49	   * AC-7: Never overwrites non-null customTitle or customDescription.
    50	   * Uses a conditional UPDATE where-clause so the constraint is enforced at the DB level.
    51	   */
    52	  saveGeneratedFields(channelId: string, fields: GeneratedFieldsUpdate, client: Client = prisma) {
    53	    return client.generatedMetaTags
    54	      .updateMany({
    55	        where: {
    56	          channelId,
    57	          customTitle: null,
    58	          customDescription: null,
    59	        },
    60	        data: {
    61	          title: fields.title,
    62	          description: fields.description,
    63	          ogTitle: fields.ogTitle,
    64	          ogDescription: fields.ogDescription,
    65	          twitterCard: fields.twitterCard,
    66	          keywords: fields.keywords,
    67	          structuredData: fields.structuredData,
    68	          contentHash: fields.contentHash,
    69	          needsRegeneration: fields.needsRegeneration,
    70	          generatedAt: fields.generatedAt,
    71	          ...(fields.ogImage !== undefined ? { ogImage: fields.ogImage } : {}),
    72	          ...(fields.schemaVersion !== undefined ? { schemaVersion: fields.schemaVersion } : {}),
    73	        },
    74	      })
    75	      .then(({ count }) => count);
    76	  },
    77	
    78	  upsert(
    79	    where: Prisma.GeneratedMetaTagsWhereUniqueInput,
    80	    update: Prisma.GeneratedMetaTagsUpdateInput,
    81	    create: MetaTagCreateData,
    82	    client: Client = prisma,
    83	  ) {
    84	    return client.generatedMetaTags.upsert({ where, update, create });
    85	  },
    86	
    87	  deleteByChannelId(channelId: string, client: Client = prisma) {
    88	    return client.generatedMetaTags.delete({ where: { channelId } });
    89	  },
    90	};
```

#### Tool: exec_command

```sh
git show origin/main:harmony-backend/tests/metaTag.repository.test.ts | nl -ba | sed -n '90,215p'
```

Output:

```text
    90	    const result = await metaTagRepository.findByChannelId(channelId);
    91	    expect(result).toBeNull();
    92	  });
    93	});
    94	
    95	// ─── create & findByChannelId ───────────────────────────────────────────────
    96	
    97	describe('metaTagRepository.create', () => {
    98	  beforeEach(async () => {
    99	    await prisma.generatedMetaTags.deleteMany({ where: { channelId } });
   100	  });
   101	
   102	  it('creates a meta tag record with no custom overrides', async () => {
   103	    const created = await metaTagRepository.create({ channelId, ...BASE_TAGS });
   104	    expect(created.channelId).toBe(channelId);
   105	    expect(created.customTitle).toBeNull();
   106	    expect(created.customDescription).toBeNull();
   107	    expect(created.customOgImage).toBeNull();
   108	
   109	    const found = await metaTagRepository.findByChannelId(channelId);
   110	    expect(found).not.toBeNull();
   111	    expect(found!.title).toBe('Generated Title');
   112	  });
   113	});
   114	
   115	// ─── AC-7: saveGeneratedFields ──────────────────────────────────────────────
   116	
   117	describe('metaTagRepository.saveGeneratedFields — AC-7', () => {
   118	  const REGEN_FIELDS = {
   119	    title: 'Regenerated Title',
   120	    description: 'Regenerated description',
   121	    ogTitle: 'OG Regenerated',
   122	    ogDescription: 'OG Regenerated desc',
   123	    twitterCard: 'summary',
   124	    keywords: 'regen,test',
   125	    structuredData: { '@type': 'WebPage', name: 'Regen' },
   126	    contentHash: 'regen_hash_789',
   127	    needsRegeneration: false,
   128	    generatedAt: new Date(),
   129	  };
   130	
   131	  beforeEach(async () => {
   132	    await seedGeneratedMetaTags();
   133	  });
   134	
   135	  it('AC-7: does not overwrite non-null customTitle set by admin', async () => {
   136	    await metaTagRepository.updateCustomOverrides(channelId, {
   137	      customTitle: 'Admin Custom Title',
   138	    });
   139	
   140	    const rowsUpdated = await metaTagRepository.saveGeneratedFields(channelId, REGEN_FIELDS);
   141	
   142	    expect(rowsUpdated).toBe(0);
   143	    const record = await metaTagRepository.findByChannelId(channelId);
   144	    expect(record!.customTitle).toBe('Admin Custom Title');
   145	    // Generated title field should NOT have been updated due to AC-7 guard
   146	    expect(record!.title).toBe('Generated Title');
   147	  });
   148	
   149	  it('AC-7: does not overwrite non-null customDescription set by admin', async () => {
   150	    await metaTagRepository.updateCustomOverrides(channelId, {
   151	      customDescription: 'Admin Custom Description',
   152	    });
   153	
   154	    const rowsUpdated = await metaTagRepository.saveGeneratedFields(channelId, REGEN_FIELDS);
   155	
   156	    expect(rowsUpdated).toBe(0);
   157	    const record = await metaTagRepository.findByChannelId(channelId);
   158	    expect(record!.customDescription).toBe('Admin Custom Description');
   159	    expect(record!.title).toBe('Generated Title');
   160	  });
   161	
   162	  it('AC-7: updates generated fields when no custom overrides are set', async () => {
   163	    // Clear overrides
   164	    await metaTagRepository.updateCustomOverrides(channelId, {
   165	      customTitle: null,
   166	      customDescription: null,
   167	    });
   168	
   169	    const rowsUpdated = await metaTagRepository.saveGeneratedFields(channelId, REGEN_FIELDS);
   170	
   171	    expect(rowsUpdated).toBe(1);
   172	    const record = await metaTagRepository.findByChannelId(channelId);
   173	    expect(record!.title).toBe('Regenerated Title');
   174	    expect(record!.description).toBe('Regenerated description');
   175	  });
   176	
   177	  it('bumps updatedAt on every successful saveGeneratedFields call', async () => {
   178	    const before = await metaTagRepository.findByChannelId(channelId);
   179	    const beforeUpdatedAt = before!.updatedAt.getTime();
   180	
   181	    // Small delay so NOW() is guaranteed to differ
   182	    await new Promise((r) => setTimeout(r, 10));
   183	    await metaTagRepository.saveGeneratedFields(channelId, {
   184	      ...REGEN_FIELDS,
   185	      title: 'Updated Again',
   186	    });
   187	
   188	    const after = await metaTagRepository.findByChannelId(channelId);
   189	    expect(after!.updatedAt.getTime()).toBeGreaterThan(beforeUpdatedAt);
   190	  });
   191	});
   192	
   193	// ─── updateCustomOverrides ──────────────────────────────────────────────────
   194	
   195	describe('metaTagRepository.updateCustomOverrides', () => {
   196	  beforeEach(async () => {
   197	    await seedGeneratedMetaTags();
   198	  });
   199	
   200	  it('can set and clear customOgImage', async () => {
   201	    await metaTagRepository.updateCustomOverrides(channelId, {
   202	      customOgImage: 'https://cdn.example.com/custom.png',
   203	    });
   204	    let record = await metaTagRepository.findByChannelId(channelId);
   205	    expect(record!.customOgImage).toBe('https://cdn.example.com/custom.png');
   206	
   207	    await metaTagRepository.updateCustomOverrides(channelId, { customOgImage: null });
   208	    record = await metaTagRepository.findByChannelId(channelId);
   209	    expect(record!.customOgImage).toBeNull();
   210	  });
   211	});
```

#### Tool: exec_command

```sh
git diff --name-only origin/main..pr-443 | rg 'prisma|metaTag.repository|schema.prisma' || true
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:29:12.306Z

`main` already has the fields in `schema.prisma`, so the wording looks stale or at least misleading. I’m checking whether this is just a generated Prisma-client issue rather than a true branch-independent failure.

#### Tool: exec_command

```sh
git branch --show-current && git rev-parse --short HEAD && git rev-parse --short origin/main && git rev-parse --short pr-443
```

Output:

```text
951a3da
951a3da
883e71d
```

#### Tool: exec_command

```sh
test -d harmony-backend/node_modules && echo node_modules-present || echo node_modules-missing; test -f harmony-backend/node_modules/.prisma/client/index.d.ts && rg -n "customTitle|customDescription|customOgImage|updatedAt" harmony-backend/node_modules/.prisma/client/index.d.ts | head -20 || true
```

Output:

```text
node_modules-missing
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/prisma/schema.prisma | nl -ba | sed -n '239,268p'
```

Output:

```text
   239	model GeneratedMetaTags {
   240	  id                  String   @id @default(uuid()) @db.Uuid
   241	  channelId           String   @unique(map: "idx_meta_tags_channel") @map("channel_id") @db.Uuid
   242	  title               String   @db.VarChar(120)
   243	  description         String   @db.VarChar(320)
   244	  ogTitle             String   @map("og_title") @db.VarChar(120)
   245	  ogDescription       String   @map("og_description") @db.VarChar(320)
   246	  ogImage             String?  @map("og_image") @db.VarChar(500)
   247	  twitterCard         String   @map("twitter_card") @db.VarChar(20)
   248	  keywords            String   @db.Text
   249	  structuredData      Json     @map("structured_data")
   250	  contentHash         String   @map("content_hash") @db.VarChar(64)
   251	  needsRegeneration   Boolean  @default(false) @map("needs_regeneration")
   252	  generatedAt         DateTime @default(now()) @map("generated_at") @db.Timestamptz
   253	  schemaVersion       Int      @default(1) @map("schema_version")
   254	  /// Admin override title — takes precedence over generated title when present.
   255	  customTitle         String?  @map("custom_title") @db.VarChar(70)
   256	  /// Admin override description — takes precedence over generated description when present.
   257	  customDescription   String?  @map("custom_description") @db.VarChar(200)
   258	  /// Admin override OG image URL — takes precedence over generated og_image when present.
   259	  customOgImage       String?  @map("custom_og_image") @db.VarChar(500)
   260	  createdAt           DateTime @default(now()) @map("created_at") @db.Timestamptz
   261	  updatedAt           DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
   262	
   263	  channel Channel @relation(fields: [channelId], references: [id], onDelete: Cascade)
   264	
   265	  // idx_meta_tags_channel is pinned via map: on the @unique above.
   266	  // idx_meta_tags_needs_regen (partial WHERE needs_regeneration = TRUE) exists in the init SQL migration.
   267	  // idx_meta_tags_generated (generated_at) is added as raw SQL in 20260418000000_add_meta_tag_overrides.
   268	  @@map("generated_meta_tags")
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:29:25.435Z

Yes, the PR description still has that note.

It does **not** make sense as written anymore. `origin/main` already has those Prisma fields in `harmony-backend/prisma/schema.prisma`:

- `customTitle`
- `customDescription`
- `customOgImage`
- `updatedAt`

So if `tests/metaTag.repository.test.ts` was failing with “missing schema columns,” that was likely a stale generated Prisma client / setup issue, not a real schema mismatch on `main`. Also, the same PR description says “No regressions in existing test suite (658 tests pass),” which directly conflicts with the “pre-existing test failure” note.

I would ask the author to **remove or update that note**. If the test is currently failing in CI, they should fix the test environment/setup, likely by ensuring `prisma generate` runs after install/migrations. If CI is green, the note is stale noise and should not stay in the PR description.

<oai-mem-citation>
<citation_entries>
MEMORY.md:234-234|note=[used Harmony review workflow context for PR review expectations]
MEMORY.md:155-157|note=[used Harmony PR review workflow memory entry for repo-specific context]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>

### Turn 6: the author pushed new changes, so review again and also add that

#### 👤 User Prompt

- Time: 2026-04-21T19:29:48.779Z

```text
the author pushed new changes, so review again and also add that comment about the PR description
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:29:57.198Z

Re-reviewing the latest PR head and I’ll include the PR-description note if it is still stale. I’ll verify the new diff, existing unresolved comments, CI, and then post one bundled review with the required checklist.

#### Tool: exec_command

```sh
sed -n '1,220p' WORKFLOW.md
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
sed -n '1,260p' .github/PR_REVIEW.md
```

Output:

```text
# PR Review Guidelines

When conducting PR Reviews, follow these guidelines:
1. **Prioritize Logic over Style:** Ensure the code is efficient, DRY (Don't Repeat Yourself), and logically sound.
2. **Security First:** Verify that the changes do not introduce vulnerabilities (e.g., lack of input validation, exposed secrets).
3. **Architectural Alignment:** If applicable, ensure the changes adhere strictly to the patterns defined in `@../docs/unified-backend-architecture.md`.
4. **Issue Completion:** If the PR is attached to an issue, verify that the code successfully satisfies every acceptance criteria of that issue.
5. **No Nitpicking:** Do not leave comments regarding stylistic choices, formatting, or subjective naming conventions unless they violate core project readability. Focus only on critical logic, performance, or architectural flaws.
6. **Avoid Repetition:** Do not repeat feedback that has already been stated in previous reviews on this PR.
7. **Iterative Reviews:** If this is not your first review on the PR:
    - First, check if the new commits have correctly addressed your previous review comments.
    - If a previous concern has been addressed, explicitly resolve the associated comment.
8. **Prevent CI Failures:** Analyze the code for obvious issues that would break the pipeline. Specifically check for syntax errors, missing imports/dependencies, unhandled exceptions, and logic that would clearly break existing tests.

**Execution Instruction**: Before providing your code feedback, output a markdown checklist of the 8 guidelines above. Mark each one as [x] if it passes or [ ] if it fails, and briefly explain why. Then, provide your single bundled review. Use inline subcomments within that single review for specific lines of codes. Do not post multiple standalone comments.
```

#### Tool: exec_command

```sh
rg -n "Harmony PR review|PR review workflow" /Users/allen/.codex/memories/MEMORY.md
```

Output:

```text
155:# Task Group: Harmony PR review and review-resolution workflow
157:applies_to: cwd=/Users/allen/.codex/worktrees/*/Harmony; reuse_rule=safe for Harmony PR review tasks that follow the repo's `WORKFLOW.md` and `.github/PR_REVIEW.md`; verify current remote/worktree before assuming repo names or branch refs.
189:- Harmony PR review, .github/PR_REVIEW.md, WORKFLOW.md, bundled review, single bundled review, checklist of 8 guidelines, gh pr view, gh pr diff, gh pr review, gh api, file_comments expected objects not strings, acabrera04/Harmony, EmptyShell, VoiceProvider, system admin bypass, useChannelEvents, useServerEvents, SSE reconnect
234:- In Harmony PR reviews, load `WORKFLOW.md` and `.github/PR_REVIEW.md` first. The durable pattern is checklist first, then one bundled review with line-specific findings or a clear approval if the updated head is good [Task 1][Task 2][Task 3][Task 4][Task 6]
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:30:06.380Z

The worktree is clean and I’ve reloaded the required review workflow. Next I’m fetching the PR head and current review/description state so the new review is scoped to the latest changes.

#### Tool: exec_command

```sh
git fetch origin main pull/443/head:pr-443 --force
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            main               -> FETCH_HEAD
   883e71d..b5a5950  refs/pull/443/head -> pr-443
```

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json number,title,body,headRefName,baseRefName,headRefOid,reviewDecision,mergeStateStatus,commits,files
```

Output:

```text
{"baseRefName":"main","body":"## Summary\n\n- Implements CL-C2.1–C2.6 per dev spec §3/§4 under `harmony-backend/src/services/metaTag/`\n- `MetaTagService` — facade with spec-aligned stubs for `generateMetaTags`, `getOrGenerateCached`, `scheduleRegeneration`, `getRegenerationJobStatus`, `getMetaTagsForPreview`, and context-based helpers for unit testing; full wiring by M4 (issue #356)\n- `TitleGenerator` — enforces ≤60 char limit with HTML sanitization and template application (AC-2)\n- `DescriptionGenerator` — enforces 50–160 char range; spec-aligned `extractKeyPhrases(content, maxPhrases)` and `summarizeThread(messages)` signatures; channel context handled in `generateFromMessages` (AC-2)\n- `OpenGraphGenerator` — spec-aligned `generateOGTags(channel, server, analysis)`, `generateTwitterCard(channel, server, analysis, image?)`, `selectPreviewImage(channel, messages): string | null`; Twitter card defaults to `summary`, upgrades to `summary_large_image` only when a non-default image is present\n- `StructuredDataGenerator` — spec-aligned `generateDiscussionForum(channel, messages, server)`, `generateBreadcrumbList(server, channel)`, `generateOrganization(server)`, `generateWebPage(channel, metaTags)`; `datePublished`/`author`/`dateModified` stub fields present for downstream consumers; `BASE_URL` env var used throughout\n- `MetaTagCache` — Redis-backed via existing `cacheService` + `CacheKeys.metaChannel` with configurable TTL (default 3600s per spec D7.1); fallback tags (`needsRegeneration: true`) are never written to cache to prevent transient failures from poisoning the cache for the full TTL\n- `MetaTagJobStatus` — includes `errorCode: string | null` and `errorMessage: string | null` per OpenAPI schema\n- `ChannelContext` — includes `visibility?: ChannelVisibility`; robots directive derived from visibility (`PUBLIC_INDEXABLE` → `index, follow`, `PUBLIC_NO_INDEX` → `noindex, follow`, `PRIVATE` → `noindex, nofollow`)\n- `buildCanonicalUrl` — slug segments encoded with `encodeURIComponent` to prevent reserved characters from producing invalid canonical links\n- AC-9 fallback: on any generation error, `MetaTagService` returns channel-name-based fallback tags with `needsRegeneration: true`\n- 37 unit tests covering AC items, visibility→robots mapping, URL encoding, and cache-fallback regression\n\n## Test plan\n\n- [x] All 37 unit tests pass (`npx jest tests/metaTagService.test.ts`)\n- [x] No regressions in existing test suite (687 tests pass, including `metaTag.repository.test.ts`)\n- [x] TypeScript compiles cleanly (`tsc --noEmit`)\n- [x] ESLint passes (no errors)\n\nCloses #350\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","commits":[{"authoredDate":"2026-04-20T13:39:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:39:37Z","messageBody":"…350)\n\nAdds CL-C2.1–C2.6 per dev spec §3/§4:\n- MetaTagService facade with generateMetaTags, getOrGenerateCached,\n  invalidateCache, and stub scheduleRegeneration/getRegenerationJobStatus\n- TitleGenerator enforcing ≤60 char limit with sanitization and templates\n- DescriptionGenerator enforcing 50–160 char range with key phrase extraction\n- OpenGraphGenerator and StructuredDataGenerator (skeleton implementations)\n- MetaTagCache backed by Redis via existing cacheService + CacheKeys.metaChannel\n- AC-9: fallback tags with needsRegeneration=true on generation failure\n- 28 unit tests covering AC-2 length limits, sanitization, cache, and fallback\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat(seo): implement M2 meta tag generation service skeleton (issue #…","oid":"e8875f5e9ef5220b017e4b2e855d8d576a8a0713"},{"authoredDate":"2026-04-20T13:42:00Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:42:00Z","messageBody":"Extends summarizeThread to append channel context when the composed\ntext falls below the 50-char minimum, satisfying AC-2 for all inputs\nincluding single-word messages. Adds a regression test.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix(seo): enforce 50-char minimum on auto-generated descriptions (AC-2)","oid":"898f94332cbe35434ecf4661c778ccb07927f1f0"},{"authoredDate":"2026-04-20T13:43:04Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T13:43:04Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"94fa035019a4c79638d269724697d5433e7563bc"},{"authoredDate":"2026-04-20T14:27:39Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T14:27:39Z","messageBody":"- titleGenerator: sanitize full composed string in generateFromMessage;\n  use replaceAll in applyTemplate to handle repeated placeholders\n- descriptionGenerator: add sanitizeText helper; sanitize channel fields\n  in summarizeThread; enforce 50-char minimum in enforceLength (AC-2)\n- openGraphGenerator: add channel param to generateTwitterCard; use\n  summary_large_image only when a real preview image is available\n- structuredDataGenerator: use BASE_URL env var in generateBreadcrumbList;\n  add stub datePublished/author fields to generateDiscussionForum\n- metaTagCache: make set() use this.ttl as single source of truth\n- metaTagService: sanitize channel context in buildFallbackTags; rename\n  internal methods to generateMetaTagsFromContext / getOrGenerateCachedFromContext;\n  add spec-aligned stub signatures for generateMetaTags(channelId),\n  getOrGenerateCached(channelId), getMetaTagsForPreview(channelId);\n  fix scheduleRegeneration return type and getRegenerationJobStatus signature\n- types: add MetaTagPreview and MetaTagJobStatus interfaces per spec\n- regenerate Prisma client; apply add_meta_tag_overrides migration so\n  metaTag.repository tests compile and pass\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings for M2 meta tag service skeleton","oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"authoredDate":"2026-04-20T16:26:29Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T16:26:29Z","messageBody":"… stubs, scheduleRegeneration return)\n\n- Replace this.generateMetaTagsFromContext with metaTagService.* to avoid destructuring hazard\n- Replace this.ttl with DEFAULT_TTL in MetaTagCache.set to avoid destructuring hazard\n- Remove extra priority/idempotencyKey fields from scheduleRegeneration return to match declared type\n- Add IMetaTagGenerator generate()/validate() stubs to TitleGenerator, DescriptionGenerator, OpenGraphGenerator (CL-I1)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings (this-binding, IMetaTagGenerator…","oid":"85d862fcc5f85f782368504916607f4eb1e45164"},{"authoredDate":"2026-04-20T16:28:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T16:28:37Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"c3a7a608c10576b751659ca1926be95566392b28"},{"authoredDate":"2026-04-21T19:19:46Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:19:46Z","messageBody":"…k, contract alignment\n\n- Align generator signatures to spec §9.1: extractKeyPhrases(content, maxPhrases),\n  summarizeThread(messages), generateOGTags/generateTwitterCard(channel, server, analysis),\n  selectPreviewImage(channel, messages), generateDiscussionForum(channel, messages, server),\n  generateBreadcrumbList(server, channel), generateOrganization(server),\n  generateWebPage(channel, metaTags)\n- Fix this-binding hazard in OpenGraphGenerator (selectPreviewImage calls)\n- Do not cache fallback tags when needsRegeneration=true — prevents transient failures\n  from poisoning the Redis cache for the full TTL\n- Fix getRegenerationJobStatus: remove | null, throw not-implemented to match spec contract\n- Add errorCode/errorMessage fields to MetaTagJobStatus per spec §9.1 / OpenAPI schema\n- Add regression test: getOrGenerateCachedFromContext must not write to cache on failure\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings — spec signatures, cache fallbac…","oid":"883e71d96e3e7c383767da13cc6331a61b3b074d"},{"authoredDate":"2026-04-21T19:26:04Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:26:04Z","messageBody":"…ents\n\n- Add ChannelVisibility type and optional visibility field to ChannelContext\n- Derive robots directive from visibility: PUBLIC_INDEXABLE → index,follow;\n  PUBLIC_NO_INDEX → noindex,follow; PRIVATE → noindex,nofollow\n- Encode serverSlug and channelSlug with encodeURIComponent in buildCanonicalUrl\n  to prevent reserved characters from producing invalid canonical links\n- Add tests for all three visibility → robots mappings and for URL encoding\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: derive robots from channel visibility, encode canonical URL segm…","oid":"b5a5950f129a9aa73b77045e0c827a140b466ffb"}],"files":[{"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","additions":99,"deletions":0},{"path":"harmony-backend/src/services/metaTag/metaTagCache.ts","additions":22,"deletions":0},{"path":"harmony-backend/src/services/metaTag/metaTagService.ts","additions":170,"deletions":0},{"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","additions":60,"deletions":0},{"path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","additions":71,"deletions":0},{"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","additions":65,"deletions":0},{"path":"harmony-backend/src/services/metaTag/types.ts","additions":99,"deletions":0},{"path":"harmony-backend/tests/metaTagService.test.ts","additions":325,"deletions":0},{"path":"llm-logs/2026-04-20-094302-session-ce430386.md","additions":784,"deletions":0},{"path":"llm-logs/2026-04-20-122835-session-b13d715d.md","additions":942,"deletions":0}],"headRefName":"feature/issue-350-meta-tag-service-skeleton","headRefOid":"b5a5950f129a9aa73b77045e0c827a140b466ffb","mergeStateStatus":"BLOCKED","number":443,"reviewDecision":"CHANGES_REQUESTED","title":"feat(seo): M2 meta tag generation service skeleton (issue #350)"}
```

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls/443/reviews | jq 'map({id,user:.user.login,state,submitted_at,commit_id,body})[-8:]'
```

Output:

````text
[
  {
    "id": 4141409312,
    "user": "FardeenI",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T15:42:01Z",
    "commit_id": "177c3840e118d1c429fe3cd0f10bc40ad842eb32",
    "body": "- [ ] **Prioritize Logic over Style:** Mostly solid, but there’s a `this`-binding hazard in `metaTagService` (and `MetaTagCache`) that can cause runtime failures if methods are destructured.\n- [ ] **Security First:** A full LLM session log is committed under `llm-logs/` (includes local paths + tool output). This is a real data-leak risk and shouldn’t land in `main`.\n- [ ] **Architectural Alignment:** Core structure matches the spec intent, but a couple stub contracts are still inconsistent (see `scheduleRegeneration`).\n- [ ] **Issue Completion:** The skeleton looks close, but the accidental log file + contract mismatch should be fixed before merge.\n- [x] **No Nitpicking:** Feedback below is limited to correctness, security, and future breakage risks.\n- [x] **Avoid Repetition:** I’m not rehashing the already-resolved spec-signature threads.\n- [x] **Iterative Reviews:** Prior review threads appear resolved; focusing only on remaining issues.\n- [ ] **Prevent CI Failures:** CI is green, but the `this` pitfall can still break runtime usage patterns.\n\n## Review (Request changes)\n\n### 1) 🚫 Remove committed session log (security/privacy)\n**File:** `llm-logs/2026-04-20-094302-session-ce430386.md`\n\nThis appears to be an exported agent conversation log (includes local filesystem paths like `/Users/...` and detailed tool outputs). Even if nothing secret is present *today*, it’s an easy footgun and shouldn’t be versioned.\n\n**Actionable fix:**\n- `git rm llm-logs/2026-04-20-094302-session-ce430386.md`\n- Add an ignore rule so it doesn’t happen again (pick the narrowest that matches project intent), e.g.:\n  - `llm-logs/*.md` (or `llm-logs/**` if the whole folder is meant to be local-only)\n\n### 2) Avoid `this` inside exported object-literal services (runtime hazard)\nIf any caller does destructuring, e.g. `const { getOrGenerateCachedFromContext } = metaTagService;`, `this` becomes `undefined` and `this.generateMetaTagsFromContext(...)` will throw.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// current\nconst tags = await this.generateMetaTagsFromContext(channel, messages);\n\n// suggested (no this-binding hazard)\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\n// or refactor helpers outside the object and call them directly\n```\n\nRelated: `MetaTagCache.set()` uses `ttl ?? this.ttl` with the same hazard.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagCache.ts`\n```ts\n// current\nawait cacheService.set(key, tags, { ttl: ttl ?? this.ttl });\n\n// suggested\nawait cacheService.set(key, tags, { ttl: ttl ?? DEFAULT_TTL });\n```\n\n### 3) `scheduleRegeneration` signature/return type mismatch\nRight now the function *returns* `{ priority, idempotencyKey }` conditionally, but the declared return type omits them, and the parameters are positional instead of an options object.\n\n**Subcomment:** `harmony-backend/src/services/metaTag/metaTagService.ts`\n```ts\n// suggested contract (matches how this will likely be called + avoids positional arg confusion)\nasync scheduleRegeneration(\n  channelId: string,\n  options?: { priority?: 'high' | 'normal' | 'low'; idempotencyKey?: string },\n): Promise<{\n  jobId: string;\n  status: 'queued' | 'deduplicated';\n  priority?: 'high' | 'normal' | 'low';\n  idempotencyKey?: string;\n}> {\n  return {\n    jobId: `meta-tag-regeneration:${channelId}`,\n    status: 'queued',\n    priority: options?.priority,\n    idempotencyKey: options?.idempotencyKey,\n  };\n}\n```\n(Alternatively: keep the simpler return type, but then remove the extra returned fields so the stub is honest.)\n\n---\n\nOnce those are addressed, this looks in good shape to merge: CI is green, tests cover the key length/sanitization/fallback paths, and the service structure is a good foundation for M4 wiring.\n"
  },
  {
    "id": 4141769555,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:30:25Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n"
  },
  {
    "id": 4141784490,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:32:29Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n"
  },
  {
    "id": 4141792373,
    "user": "FardeenI",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:33:39Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "- [x] **Prioritize Logic over Style:** Focusing on correctness/contract drift (not formatting).\n- [x] **Security First:** No secrets added; sanitization added for user-controlled strings.\n- [ ] **Architectural Alignment:** Several public method signatures still diverge from `docs/dev-spec-seo-meta-tag-generation.md` §9.1.*.\n- [ ] **Issue Completion:** Issue #350 AC requires spec-named signatures; a few are still mismatched.\n- [x] **No Nitpicking:** No style-only feedback.\n- [x] **Avoid Repetition:** Not repeating already-addressed review threads.\n- [x] **Iterative Reviews:** Considered existing review threads before adding new feedback.\n- [x] **Prevent CI Failures:** CI is green; requested changes are contract/spec alignment to prevent future breakage.\n\n---\n\n## Requested changes (actionable)\n\n### 1) Align generator method signatures to the SEO spec (Issue #350 AC)\nRight now the M2 “skeleton” compiles/tests, but several exported method signatures don’t match the spec prototypes in `docs/dev-spec-seo-meta-tag-generation.md` §9.1. That’s likely to cause downstream integration churn when M3/M4 wiring lands.\n\n**`harmony-backend/src/services/metaTag/openGraphGenerator.ts`**\nSpec expects:\n- `generateOGTags(channel: Channel, server: Server, analysis: ContentAnalysis): OpenGraphTags`\n- `generateTwitterCard(channel: Channel, server: Server, analysis: ContentAnalysis): TwitterCardTags`\n- `selectPreviewImage(channel: Channel, messages: Message[]): string | null`\n\nCurrent signatures are `(channel, title, description)` and `selectPreviewImage(channel): string`.\n\n**Suggestion:** keep your current placeholder logic, but change the exported signatures to match spec and adapt callers (e.g. in `MetaTagService`, pass a placeholder `analysis` for now and ignore unused args in the generator).\n\n**`harmony-backend/src/services/metaTag/structuredDataGenerator.ts`**\nSpec expects:\n- `generateDiscussionForum(channel, messages, server)`\n- `generateBreadcrumbList(server, channel)`\n- `generateOrganization(server)`\n- `generateWebPage(channel, metaTags)`\n\nCurrent signatures are `(channel, title, description)` / `(channel)` / `()` / `(channel, title, description)`.\n\n**Suggestion:** change signatures to spec and keep stubs internally (you can still leave `author/datePublished` unset until M4).\n\n**`harmony-backend/src/services/metaTag/descriptionGenerator.ts`**\nSpec expects:\n- `extractKeyPhrases(content: string, maxPhrases: number): string[]`\n- `summarizeThread(messages: Message[]): string`\n\nCurrent `extractKeyPhrases(messages[])` and `summarizeThread(messages, channel)` diverge.\n\n**Suggestion:** add/rename the spec-shaped methods (they can be thin wrappers around your current logic: join messages -> content; keep `maxPhrases` configurable rather than hardcoded to 5).\n\n### 2) Spec return type for `getRegenerationJobStatus`\nIn `harmony-backend/src/services/metaTag/metaTagService.ts`, spec has `Promise<MetaTagJobStatus>`; current stub returns `Promise<MetaTagJobStatus | null>`.\n\n**Suggestion:** for a stub, prefer throwing `not implemented` (or return a placeholder status) to keep the signature aligned.\n\n### 3) (Optional) PR signal/noise\nThis PR includes 2 new `llm-logs/*.md` artifacts. If those are required by process, OK—just noting it makes reviews harder to scan.\n"
  },
  {
    "id": 4150247194,
    "user": "chatgpt-codex-connector[bot]",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:18:02Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "\n### 💡 Codex Review\n\nHere are some automated review suggestions for this pull request.\n\n**Reviewed commit:** `c3a7a608c1`\n    \n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment \"@codex review\".\n\nIf Codex has suggestions, it will comment; otherwise it will react with 👍.\n\n\n\n\nCodex can also answer questions or update the PR. Try commenting \"@codex address that feedback\".\n            \n</details>"
  },
  {
    "id": 4150273985,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-21T19:23:52Z",
    "commit_id": "883e71d96e3e7c383767da13cc6331a61b3b074d",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — The previous cache-poisoning issue is fixed, but the current head still hardcodes `robots: 'index, follow'` for all generated tags even though the SEO spec requires `PUBLIC_NO_INDEX` channels to emit `noindex`.\n- [x] **2. Security First** — I did not find a new code-level security issue in the latest meta-tag changes. The existing `llm-logs/` concern has already been raised separately and I am not repeating it here.\n- [ ] **3. Architectural Alignment** — The new service still does not carry visibility through `ChannelContext`, so it cannot satisfy the spec’s visibility-driven robots behavior.\n- [ ] **4. Issue Completion** — The prior findings on fallback caching and `MetaTagJobStatus` are fixed, but the remaining robots/canonical URL issues still block the M2 skeleton from matching the SEO feature behavior.\n- [x] **5. No Nitpicking** — This review is limited to correctness/contract issues.\n- [x] **6. Avoid Repetition** — I am not adding duplicate inline comments; the remaining blockers are the two existing unresolved automated comments on this PR.\n- [x] **7. Iterative Reviews** — Re-reviewed the latest commit `883e71d`; the two issues from my prior review are resolved.\n- [x] **8. Prevent CI Failures** — Current GitHub checks are green; the remaining issues are behavioral gaps not caught by CI.\n\n## Review (Request changes)\n\nThe latest commit fixes the two blockers from my previous review:\n\n- `getOrGenerateCachedFromContext()` no longer caches fallback tags with `needsRegeneration=true`, and there is a regression test for that path.\n- `getRegenerationJobStatus()` now has the spec return type, and `MetaTagJobStatus` includes `errorCode` / `errorMessage`.\n\nI’m still requesting changes because two existing unresolved automated comments are valid and should be addressed before merge:\n\n1. `MetaTagSet.robots` is always `index, follow`. The spec explicitly requires `PUBLIC_NO_INDEX` to regenerate/serve `noindex, follow`, so `ChannelContext` needs visibility or equivalent policy input before tags are generated.\n\n2. `buildCanonicalUrl(serverSlug, channelSlug)` interpolates raw path segments. Channel slugs are only validated as non-empty strings with max length, and the existing sitemap implementation already uses `encodeURIComponent`, so this helper should encode both slug segments too.\n\nOnce those are fixed, I do not see remaining blockers in the meta-tag skeleton.\n"
  },
  {
    "id": 4150285494,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:26:22Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": ""
  },
  {
    "id": 4150285950,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:26:27Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": ""
  }
]
````

#### Tool: exec_command

```sh
gh api graphql -f query='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{isResolved path line comments(first:20){nodes{author{login} body url createdAt}}}}}}}' -F owner=CS485-Harmony -F repo=Harmony -F number=443
```

Output:

````text
{"data":{"repository":{"pullRequest":{"reviewThreads":{"nodes":[{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagService.generateMetaTags signature diverges from the dev spec referenced by this PR (spec defines generateMetaTags(channelId, options?) and expects the service to fetch context internally). Either align the method signature/behavior to the spec or update the spec/PR description so downstream integrations don’t drift.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142149","createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. The context-driven implementation is renamed to generateMetaTagsFromContext(channel, messages) for unit tests. A spec-aligned stub generateMetaTags(channelId, options?) is added that throws 'not implemented — wired by M4 (issue #356)'. Callers will be updated to the spec signature when the channel-resolver is wired in M4.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111398713","createdAt":"2026-04-20T14:29:20Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"scheduleRegeneration stub does not match the spec return shape (spec expects a jobId and queued/deduplicated status, plus optional priority/idempotencyKey). Even as a stub, keeping the spec signature/return type will prevent a breaking refactor when M4 wires the queue.\n```suggestion\n  async scheduleRegeneration(\n    channelId: string,\n    options?: { priority?: string; idempotencyKey?: string },\n  ): Promise<{\n    jobId: string;\n    status: 'queued' | 'deduplicated';\n    priority?: string;\n    idempotencyKey?: string;\n  }> {\n    // Queuing logic wired by M4 MetaTagUpdateWorker.\n    // Keep the stub contract aligned with the queue spec to avoid a breaking API change later.\n    return {\n      jobId: `meta-tag-regeneration:${channelId}`,\n      status: 'queued',\n      priority: options?.priority,\n      idempotencyKey: options?.idempotencyKey,\n    };\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142223","createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. scheduleRegeneration now returns Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> with the stub returning a placeholder jobId, matching the spec contract for AC-5/AC-6.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111395320","createdAt":"2026-04-20T14:28:49Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getRegenerationJobStatus stub signature differs from the spec (spec takes both channelId and jobId and returns a MetaTagJobStatus object). Keeping the correct parameters/return type now will make M4 wiring straightforward.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142302","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. getRegenerationJobStatus now takes (channelId: string, jobId: string) and returns Promise<MetaTagJobStatus | null>. MetaTagJobStatus type added to types.ts per spec.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111394608","createdAt":"2026-04-20T14:28:42Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"OpenGraphGenerator.generateOGTags signature doesn’t match the dev spec for CL-C2.4 (spec describes channel/server/analysis-driven generation). If this module is meant to satisfy the spec interface for later wiring, adjust the signature (or add an adapter) to avoid refactors.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142353","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"generateOGTags already accepts channel as its first parameter (unchanged). The related generateTwitterCard signature was aligned with spec in 177c384 (channel is now the first param). The broader spec-signature alignment for generateMetaTags/getOrGenerateCached is addressed separately — see those threads.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111399582","createdAt":"2026-04-20T14:29:28Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/types.ts","line":40,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagSet includes needsRegeneration, but the dev spec’s CL-D1 MetaTagSet DTO doesn’t include this field (needs_regeneration is modeled in persistence metadata). Consider keeping regeneration status separate (wrapper type) or update the DTO/spec consistently to avoid contract drift.\n```suggestion\n  keywords: string[];\n}\n\nexport interface MetaTagSetWithRegenerationStatus {\n  metaTags: MetaTagSet;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142384","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Won't fix: The existing unit tests directly assert tags.needsRegeneration (AC-9 test, fallback test), so removing the field from MetaTagSet would break them. Keeping it on the DTO for now; can be split into a wrapper type when the full persistence layer lands in M3/M4.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111397887","createdAt":"2026-04-20T14:29:12Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"DescriptionGenerator.enforceLength only truncates >160 chars and never enforces the 50-char minimum, so generateFromMessages can return descriptions shorter than 50 characters for short channel/server names or very short messages (violates AC-2). Update the length policy to guarantee MIN_LENGTH before returning (e.g., append more context deterministically).\n```suggestion\n  padToMinimumLength(text: string): string {\n    const additions = [\n      ' Join the discussion.',\n      ' Explore the latest updates.',\n      ' Connect with the community.',\n    ];\n\n    let padded = text.trim();\n    if (padded.length === 0) {\n      padded = 'Join the discussion and explore the latest updates.';\n    }\n\n    let additionIndex = 0;\n    while (padded.length < MIN_LENGTH) {\n      padded += additions[additionIndex % additions.length];\n      additionIndex += 1;\n    }\n\n    return padded;\n  },\n\n  enforceLength(text: string): string {\n    let result = text;\n    if (result.length < MIN_LENGTH) {\n      result = this.padToMinimumLength(result);\n    }\n\n    if (result.length > MAX_LENGTH) {\n      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';\n    }\n    return result;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142433","createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. enforceLength now pads text below 50 chars by appending context phrases before truncating. All AC-2 unit tests pass.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111391256","createdAt":"2026-04-20T14:28:12Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"TitleGenerator.generateFromMessage sanitizes only message.content; channel.serverName is appended without sanitization/normalization. Since server names are user-controlled, sanitize the full composed string (or sanitize serverName separately) before truncation to keep title output consistently safe.\n```suggestion\n    const raw = `${message.content} — ${channel.serverName}`;\n    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142492","createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Now sanitizes the full composed string (message.content + channel.serverName) via sanitizeForTitle before truncation.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111389802","createdAt":"2026-04-20T14:27:58Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"applyTemplate uses String.replace per variable, which only replaces the first occurrence of each placeholder. If a template repeats a placeholder (common in localized templates), later occurrences will remain unreplaced. Use a global replacement strategy (e.g., replaceAll or a global RegExp) per key.\n```suggestion\n      (result, [key, value]) => result.replaceAll(`{${key}}`, value),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142532","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Changed result.replace to result.replaceAll so all occurrences of each placeholder are substituted.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111389110","createdAt":"2026-04-20T14:27:52Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"summarizeThread interpolates channel.name and channel.serverName directly into the output without sanitizing/normalizing them. Since these are user-controlled strings, meta descriptions can contain HTML/attribute-breaking characters. Sanitize channel/server fields the same way you sanitize message content.\n```suggestion\n  sanitizeText(text: string): string {\n    return text.replace(/<[^>]*>/g, '').replace(/\\s+/g, ' ').trim();\n  },\n\n  summarizeThread(messages: MessageContext[], channel: ChannelContext): string {\n    const serverName = this.sanitizeText(channel.serverName);\n    const channelName = this.sanitizeText(channel.name);\n    const suffix = ` — Join the discussion on ${serverName}.`;\n\n    if (messages.length === 0) {\n      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;\n      return this.enforceLength(base);\n    }\n\n    const first = this.sanitizeText(messages[0].content);\n    const prefix = `${serverName} › #${channelName}: `;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142575","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added sanitizeText helper to DescriptionGenerator; summarizeThread now sanitizes channel.name and channel.serverName before interpolation.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111390561","createdAt":"2026-04-20T14:28:05Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getOrGenerateCached currently requires ChannelContext + MessageContext[] + optional ttl, but the spec API is getOrGenerateCached(channelId) with caching handled internally. Consider aligning the signature (and moving message fetching inside) to match the spec contract.\n```suggestion\n  async resolveChannelContext(_channelId: string): Promise<ChannelContext> {\n    throw new Error('metaTagService.resolveChannelContext must be implemented with channel lookup');\n  },\n\n  async resolveMessageContexts(_channelId: string): Promise<MessageContext[]> {\n    throw new Error('metaTagService.resolveMessageContexts must be implemented with message lookup');\n  },\n\n  async getOrGenerateCached(\n    channelOrId: ChannelContext | string,\n    messagesOrTtl?: MessageContext[] | number,\n    ttl?: number,\n  ): Promise<MetaTagSet> {\n    const channelId = typeof channelOrId === 'string' ? channelOrId : channelOrId.id;\n    const cached = await MetaTagCache.get(channelId);\n    if (cached) return cached;\n\n    const channel =\n      typeof channelOrId === 'string'\n        ? await this.resolveChannelContext(channelOrId)\n        : channelOrId;\n    const messages =\n      typeof channelOrId === 'string'\n        ? await this.resolveMessageContexts(channelOrId)\n        : Array.isArray(messagesOrTtl)\n          ? messagesOrTtl\n          : [];\n    const cacheTtl =\n      typeof messagesOrTtl === 'number'\n        ? messagesOrTtl\n        : ttl;\n\n    const tags = await this.generateMetaTags(channel, messages);\n    await MetaTagCache.set(channel.id, tags, cacheTtl);\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142625","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added spec-aligned stub getOrGenerateCached(channelId: string) that throws 'not implemented — wired by M4'. The context-driven variant is renamed to getOrGenerateCachedFromContext(channel, messages, ttl?) for use in unit tests and internal generation flow.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111397023","createdAt":"2026-04-20T14:29:05Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagCache.ts","line":11,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagCache exposes a ttl property, but set() defaults to DEFAULT_TTL rather than the exported ttl field, so MetaTagCache.ttl is effectively unused/misleading. Consider making ttl the single source of truth (or remove the field).","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142686","createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. set() now uses ttl ?? this.ttl so MetaTagCache.ttl is the single source of truth for the default TTL.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111392031","createdAt":"2026-04-20T14:28:19Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","line":37,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateBreadcrumbList hard-codes the https://harmony.chat domain for the server URL. Use the same configurable BASE_URL/origin used elsewhere so structured data is correct in staging/dev/alternate deployments.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142725","createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateBreadcrumbList now reads process.env.BASE_URL ?? 'https://harmony.chat' consistent with metaTagService.ts.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111392817","createdAt":"2026-04-20T14:28:26Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateTwitterCard signature also diverges from the spec’s CL-C2.4 API (spec is channel/server/analysis-based, not raw strings). Consider aligning the public API now (even if the implementation is still a skeleton).\n```suggestion\n  generateTwitterCard(\n    channel: ChannelContext,\n    title: string,\n    description: string,\n    image?: string,\n  ): TwitterCardTags {\n    return {\n      card: 'summary_large_image',\n      title,\n      description,\n      image: image ?? this.selectPreviewImage(channel),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142775","createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateTwitterCard now accepts channel as the first parameter (matching spec CL-C2.4). Also fixed the card type: uses 'summary' by default, only 'summary_large_image' when a non-default preview image is available.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111393786","createdAt":"2026-04-20T14:28:34Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"buildFallbackTags uses raw channel/server names and only truncates/enforces max length; it does not sanitize. Because fallback is used on generation errors, it should still produce sanitized values to avoid unsafe content flowing into rendered <head>. Route fallback strings through the same sanitization/normalization as the main generators.\n```suggestion\nimport sanitizeHtml from 'sanitize-html';\n\nconst logger = createLogger({ component: 'meta-tag-service' });\n\nconst BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';\n\nfunction sanitizeMetaText(value: string): string {\n  return sanitizeHtml(value, {\n    allowedTags: [],\n    allowedAttributes: {},\n  }).replace(/\\s+/g, ' ').trim();\n}\n\nfunction buildFallbackTags(channel: ChannelContext): MetaTagSet {\n  const sanitizedChannel: ChannelContext = {\n    ...channel,\n    name: sanitizeMetaText(channel.name),\n    serverName: sanitizeMetaText(channel.serverName),\n  };\n  const title = `${sanitizedChannel.name} — ${sanitizedChannel.serverName}`;\n  const description = `Discussions in #${sanitizedChannel.name} on ${sanitizedChannel.serverName}.`;\n  return {\n    title: TitleGenerator.truncateWithEllipsis(title),\n    description: DescriptionGenerator.enforceLength(description),\n    canonical: sanitizedChannel.canonicalUrl,\n    robots: 'index, follow',\n    openGraph: OpenGraphGenerator.generateOGTags(sanitizedChannel, title, description),\n    twitter: OpenGraphGenerator.generateTwitterCard(title, description),\n    structuredData: StructuredDataGenerator.generateDiscussionForum(sanitizedChannel, title, description),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142829","createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. buildFallbackTags now runs channel fields through sanitizeChannelContext (which uses TitleGenerator.sanitizeForTitle) before any interpolation — no new dependency needed since the regex sanitizer is already in scope.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111396192","createdAt":"2026-04-20T14:28:57Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"chatgpt-codex-connector"},"body":"**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Derive robots directive from channel visibility**\n\nThis path always emits `robots: 'index, follow'`, which is incorrect for channels that are `PUBLIC_NO_INDEX` (and potentially private states) and can lead crawlers to index content that was explicitly configured not to be indexed. I checked the existing visibility model in `harmony-backend/src/trpc/routers/channel.router.ts` (which already supports `PUBLIC_NO_INDEX`), so this service should carry visibility in `ChannelContext` and map it to the correct robots directive instead of hardcoding index/follow.\n\nUseful? React with 👍 / 👎.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119804427","createdAt":"2026-04-21T19:18:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in b5a5950. `ChannelContext` now has an optional `visibility` field (`PUBLIC_INDEXABLE | PUBLIC_NO_INDEX | PRIVATE`). The robots directive is derived via `getRobotsDirective(channel.visibility)` — `PUBLIC_NO_INDEX` emits `noindex, follow`, `PRIVATE` emits `noindex, nofollow`, and `PUBLIC_INDEXABLE` (or unset) emits `index, follow`.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119842438","createdAt":"2026-04-21T19:26:21Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"chatgpt-codex-connector"},"body":"**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Encode canonical URL path segments**\n\n`buildCanonicalUrl` interpolates raw slugs directly into the URL, so reserved characters in `serverSlug`/`channelSlug` (e.g. spaces, `?`, `#`, `/`) will produce invalid or misparsed canonical links. This is actionable because channel slug input is not regex-restricted in the API layer (only min/max length), and other URL generation in this repo already URL-encodes slugs for safety. Use `encodeURIComponent` for both path segments before concatenation.\n\nUseful? React with 👍 / 👎.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119804431","createdAt":"2026-04-21T19:18:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in b5a5950. Both `serverSlug` and `channelSlug` are now wrapped with `encodeURIComponent` in `buildCanonicalUrl`, consistent with the sitemap implementation. Test added to verify reserved characters are percent-encoded.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119842901","createdAt":"2026-04-21T19:26:27Z"}]}}]}}}}}
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:30:17.301Z

The PR description has already been updated: the stale “pre-existing test failure” note is gone and it now says `metaTag.repository.test.ts` passes. The two unresolved automated threads were also marked resolved; I’m verifying the actual code and CI before deciding whether to approve.

#### Tool: exec_command

```sh
git diff --unified=100 origin/main..pr-443 -- harmony-backend/src/services/metaTag/metaTagService.ts harmony-backend/src/services/metaTag/types.ts harmony-backend/tests/metaTagService.test.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/metaTagService.ts b/harmony-backend/src/services/metaTag/metaTagService.ts
new file mode 100644
index 0000000..f66e53a
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagService.ts
@@ -0,0 +1,170 @@
+// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
+import { TitleGenerator } from './titleGenerator';
+import { DescriptionGenerator } from './descriptionGenerator';
+import { OpenGraphGenerator } from './openGraphGenerator';
+import { StructuredDataGenerator } from './structuredDataGenerator';
+import { MetaTagCache } from './metaTagCache';
+import type {
+  MetaTagSet,
+  ChannelContext,
+  ChannelVisibility,
+  MessageContext,
+  MetaTagPreview,
+  MetaTagJobStatus,
+  ContentAnalysis,
+} from './types';
+import { createLogger } from '../../lib/logger';
+
+const logger = createLogger({ component: 'meta-tag-service' });
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+// Spec §9.1.1 visibility → robots mapping
+function getRobotsDirective(visibility: ChannelVisibility | undefined): string {
+  if (visibility === 'PUBLIC_NO_INDEX') return 'noindex, follow';
+  if (visibility === 'PRIVATE') return 'noindex, nofollow';
+  return 'index, follow'; // PUBLIC_INDEXABLE or unset
+}
+
+function sanitizeChannelContext(channel: ChannelContext): ChannelContext {
+  return {
+    ...channel,
+    name: TitleGenerator.sanitizeForTitle(channel.name),
+    serverName: TitleGenerator.sanitizeForTitle(channel.serverName),
+  };
+}
+
+function buildFallbackTags(channel: ChannelContext): MetaTagSet {
+  const safe = sanitizeChannelContext(channel);
+  const title = `${safe.name} — ${safe.serverName}`;
+  const description = `Discussions in #${safe.name} on ${safe.serverName}.`;
+  const analysis: ContentAnalysis = {
+    keywords: [],
+    topics: [TitleGenerator.truncateWithEllipsis(title)],
+    summary: DescriptionGenerator.enforceLength(description),
+    sentiment: 'neutral',
+    readingLevel: 'basic',
+  };
+  return {
+    title: TitleGenerator.truncateWithEllipsis(title),
+    description: DescriptionGenerator.enforceLength(description),
+    canonical: safe.canonicalUrl,
+    robots: getRobotsDirective(safe.visibility),
+    openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
+    twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
+    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
+    keywords: [],
+    needsRegeneration: true,
+  };
+}
+
+export const metaTagService = {
+  /**
+   * Generate meta tags from pre-resolved context (used internally and in unit tests).
+   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
+   */
+  async generateMetaTagsFromContext(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
+    try {
+      const title = TitleGenerator.generateFromThread(messages, channel);
+      const description = DescriptionGenerator.generateFromMessages(messages, channel);
+      const keywords = DescriptionGenerator.extractKeyPhrases(messages.map((m) => m.content).join(' '), 5);
+      const analysis: ContentAnalysis = {
+        keywords,
+        topics: [title],
+        summary: description,
+        sentiment: 'neutral',
+        readingLevel: 'basic',
+      };
+      const og = OpenGraphGenerator.generateOGTags(channel, {}, analysis);
+      const twitter = OpenGraphGenerator.generateTwitterCard(channel, {}, analysis, og.ogImage);
+      const structuredData = StructuredDataGenerator.generateDiscussionForum(channel, messages, {});
+
+      return {
+        title,
+        description,
+        canonical: channel.canonicalUrl,
+        robots: getRobotsDirective(channel.visibility),
+        openGraph: og,
+        twitter,
+        structuredData,
+        keywords,
+        needsRegeneration: false,
+      };
+    } catch (err) {
+      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
+      return buildFallbackTags(channel);
+    }
+  },
+
+  /**
+   * Spec-aligned stub: generateMetaTags(channelId, options?).
+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
+   */
+  async generateMetaTags(
+    _channelId: string,
+    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
+  ): Promise<MetaTagSet> {
+    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  /**
+   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
+   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
+   */
+  async getOrGenerateCachedFromContext(
+    channel: ChannelContext,
+    messages: MessageContext[],
+    ttl?: number,
+  ): Promise<MetaTagSet> {
+    const cached = await MetaTagCache.get(channel.id);
+    if (cached) return cached;
+
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    // Do not cache fallback tags — a transient failure must not poison the cache for the full TTL
+    if (!tags.needsRegeneration) {
+      await MetaTagCache.set(channel.id, tags, ttl);
+    }
+    return tags;
+  },
+
+  /**
+   * Spec-aligned stub: getOrGenerateCached(channelId).
+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
+   */
+  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
+    throw new Error('getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  async invalidateCache(channelId: string): Promise<void> {
+    await MetaTagCache.invalidate(channelId);
+  },
+
+  // scheduleRegeneration and getRegenerationJobStatus are stubs —
+  // full implementation depends on M4 (worker/queue) from issue #356
+  async scheduleRegeneration(
+    channelId: string,
+    _priority?: 'high' | 'normal' | 'low',
+    _idempotencyKey?: string,
+  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
+    // Queuing logic wired by M4 MetaTagUpdateWorker
+    return {
+      jobId: `meta-tag-regeneration:${channelId}`,
+      status: 'queued',
+    };
+  },
+
+  async getRegenerationJobStatus(
+    _channelId: string,
+    _jobId: string,
+  ): Promise<MetaTagJobStatus> {
+    throw new Error('getRegenerationJobStatus not yet implemented — wired by M4 (issue #356)');
+  },
+
+  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
+    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
+    return `${BASE_URL}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(channelSlug)}`;
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/types.ts b/harmony-backend/src/services/metaTag/types.ts
new file mode 100644
index 0000000..12d95e0
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/types.ts
@@ -0,0 +1,99 @@
+// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)
+
+export interface OpenGraphTags {
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  ogType: string;
+  ogUrl: string;
+  ogSiteName: string;
+}
+
+export interface TwitterCardTags {
+  card: string;
+  title: string;
+  description: string;
+  image: string;
+  site: string;
+}
+
+export interface StructuredData {
+  '@context': string;
+  '@type': string;
+  headline: string;
+  description: string;
+  author?: object;
+  datePublished?: string;
+  dateModified?: string;
+  mainEntity?: object;
+  breadcrumb?: object;
+}
+
+export interface MetaTagSet {
+  title: string;
+  description: string;
+  canonical: string;
+  robots: string;
+  openGraph: OpenGraphTags;
+  twitter: TwitterCardTags;
+  structuredData: StructuredData;
+  keywords: string[];
+  needsRegeneration?: boolean;
+}
+
+export interface ContentAnalysis {
+  keywords: string[];
+  topics: string[];
+  summary: string;
+  sentiment: string;
+  readingLevel: string;
+}
+
+export interface IMetaTagGenerator {
+  generate(): MetaTagSet;
+  validate(): boolean;
+}
+
+export interface MetaTagPreview {
+  title: string;
+  description: string;
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  keywords: string[];
+  generatedAt: string;
+  isCustom: boolean;
+  searchPreview: { title: string; description: string; url: string };
+  socialPreview: { title: string; description: string; image: string };
+}
+
+export interface MetaTagJobStatus {
+  jobId: string;
+  channelId: string;
+  status: 'queued' | 'processing' | 'succeeded' | 'failed';
+  attempts: number;
+  startedAt: string | null;
+  completedAt: string | null;
+  errorCode: string | null;
+  errorMessage: string | null;
+}
+
+// Canonical values from the SEO spec visibility model
+export type ChannelVisibility = 'PUBLIC_INDEXABLE' | 'PUBLIC_NO_INDEX' | 'PRIVATE';
+
+export interface ChannelContext {
+  id: string;
+  name: string;
+  slug: string;
+  topic?: string | null;
+  serverName: string;
+  serverSlug: string;
+  canonicalUrl: string;
+  visibility?: ChannelVisibility;
+}
+
+export interface MessageContext {
+  content: string;
+  createdAt: Date;
+  authorDisplayName?: string;
+}
diff --git a/harmony-backend/tests/metaTagService.test.ts b/harmony-backend/tests/metaTagService.test.ts
new file mode 100644
index 0000000..20e1da8
--- /dev/null
+++ b/harmony-backend/tests/metaTagService.test.ts
@@ -0,0 +1,325 @@
+/**
+ * Unit tests for M2 Meta Tag Generation Service skeleton — Issue #350
+ *
+ * Covers AC-2 (length limits), sanitization, template application,
+ * and AC-9 (fallback on failure, needsRegeneration=true).
+ *
+ * MetaTagCache uses Redis via cacheService — mocked here for unit speed.
+ */
+
+jest.mock('../src/services/cache.service', () => ({
+  cacheService: {
+    get: jest.fn(),
+    set: jest.fn(),
+    invalidate: jest.fn(),
+    getOrRevalidate: jest.fn(),
+  },
+  CacheKeys: {
+    metaChannel: (id: string) => `meta:channel:${id}`,
+    channelVisibility: (id: string) => `channel:${id}:visibility`,
+    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
+    serverInfo: (id: string) => `server:${id}:info`,
+    analysisChannel: (id: string) => `analysis:channel:${id}`,
+  },
+  sanitizeKeySegment: (s: string) => s.replace(/[*?\[\]]/g, ''),
+}));
+
+import { TitleGenerator } from '../src/services/metaTag/titleGenerator';
+import { DescriptionGenerator } from '../src/services/metaTag/descriptionGenerator';
+import { MetaTagCache } from '../src/services/metaTag/metaTagCache';
+import { metaTagService } from '../src/services/metaTag/metaTagService';
+import { cacheService } from '../src/services/cache.service';
+import type { ChannelContext, MessageContext } from '../src/services/metaTag/types';
+
+const mockCacheService = cacheService as jest.Mocked<typeof cacheService>;
+
+const channel: ChannelContext = {
+  id: 'chan-001',
+  name: 'unity-physics-help',
+  slug: 'unity-physics-help',
+  topic: 'Ask about Unity physics',
+  serverName: 'Game Dev Hub',
+  serverSlug: 'game-dev-hub',
+  canonicalUrl: 'https://harmony.chat/c/game-dev-hub/unity-physics-help',
+};
+
+const messages: MessageContext[] = [
+  { content: 'How do I handle collision detection in Unity?', createdAt: new Date() },
+  { content: 'Use OnCollisionEnter for physics-based collisions.', createdAt: new Date() },
+];
+
+beforeEach(() => {
+  jest.clearAllMocks();
+});
+
+// ─── TitleGenerator ──────────────────────────────────────────────────────────
+
+describe('TitleGenerator', () => {
+  it('maxLength is 60', () => {
+    expect(TitleGenerator.maxLength).toBe(60);
+  });
+
+  it('generateFromChannel produces title ≤60 chars', () => {
+    const title = TitleGenerator.generateFromChannel(channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+  });
+
+  it('truncates long titles with ellipsis and stays ≤60 chars', () => {
+    const longChannel: ChannelContext = {
+      ...channel,
+      name: 'this-is-a-very-long-channel-name-that-exceeds-limits',
+      serverName: 'An Extremely Long Server Name That Will Overflow',
+    };
+    const title = TitleGenerator.generateFromChannel(longChannel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title.endsWith('…')).toBe(true);
+  });
+
+  it('sanitizeForTitle strips HTML tags', () => {
+    const result = TitleGenerator.sanitizeForTitle('<b>Hello</b> <em>world</em>');
+    expect(result).toBe('Hello world');
+  });
+
+  it('sanitizeForTitle collapses whitespace', () => {
+    const result = TitleGenerator.sanitizeForTitle('foo   bar\n  baz');
+    expect(result).toBe('foo bar baz');
+  });
+
+  it('applyTemplate replaces template variables', () => {
+    const result = TitleGenerator.applyTemplate('{channelName} on {serverName}', {
+      channelName: 'general',
+      serverName: 'My Server',
+    });
+    expect(result).toBe('general on My Server');
+  });
+
+  it('generateFromThread falls back to channel when no messages', () => {
+    const title = TitleGenerator.generateFromThread([], channel);
+    expect(title).toBe(TitleGenerator.generateFromChannel(channel));
+  });
+
+  it('generateFromMessage uses first message content', () => {
+    const title = TitleGenerator.generateFromMessage(messages[0], channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title).toContain('Game Dev Hub');
+  });
+});
+
+// ─── DescriptionGenerator ───────────────────────────────────────────────────
+
+describe('DescriptionGenerator', () => {
+  it('maxLength is 160', () => {
+    expect(DescriptionGenerator.maxLength).toBe(160);
+  });
+
+  it('minLength is 50', () => {
+    expect(DescriptionGenerator.minLength).toBe(50);
+  });
+
+  it('generateFromMessages produces description 50-160 chars', () => {
+    const desc = DescriptionGenerator.generateFromMessages(messages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('truncates long descriptions to ≤160 chars with ellipsis', () => {
+    const longMessages: MessageContext[] = [
+      {
+        content: 'A'.repeat(200),
+        createdAt: new Date(),
+      },
+    ];
+    const desc = DescriptionGenerator.generateFromMessages(longMessages, channel);
+    expect(desc.length).toBeLessThanOrEqual(160);
+    expect(desc.endsWith('…')).toBe(true);
+  });
+
+  it('returns text unchanged when within valid range', () => {
+    const valid = 'A'.repeat(80);
+    expect(DescriptionGenerator.enforceLength(valid)).toBe(valid);
+  });
+
+  it('AC-2: generateFromMessages produces ≥50 chars even for a very short message', () => {
+    const shortMessages: MessageContext[] = [{ content: 'hi', createdAt: new Date() }];
+    const desc = DescriptionGenerator.generateFromMessages(shortMessages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('extractKeyPhrases returns non-empty array for non-empty content', () => {
+    const content = messages.map((m) => m.content).join(' ');
+    const phrases = DescriptionGenerator.extractKeyPhrases(content, 5);
+    expect(Array.isArray(phrases)).toBe(true);
+    expect(phrases.length).toBeGreaterThan(0);
+  });
+
+  it('extractKeyPhrases respects maxPhrases limit', () => {
+    const content = messages.map((m) => m.content).join(' ');
+    const phrases = DescriptionGenerator.extractKeyPhrases(content, 2);
+    expect(phrases.length).toBeLessThanOrEqual(2);
+  });
+
+  it('summarizeThread returns empty string for no messages', () => {
+    const summary = DescriptionGenerator.summarizeThread([]);
+    expect(summary).toBe('');
+  });
+
+  it('summarizeThread returns first message content for non-empty messages', () => {
+    const summary = DescriptionGenerator.summarizeThread(messages);
+    expect(summary.length).toBeGreaterThan(0);
+  });
+
+  it('generateFromMessages includes channel info for empty messages', () => {
+    const desc = DescriptionGenerator.generateFromMessages([], channel);
+    expect(desc).toContain(channel.name);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+});
+
+// ─── MetaTagCache ────────────────────────────────────────────────────────────
+
+describe('MetaTagCache', () => {
+  it('ttl defaults to 3600', () => {
+    expect(MetaTagCache.ttl).toBe(3600);
+  });
+
+  it('get returns null on cache miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toBeNull();
+    expect(mockCacheService.get).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('get returns cached data on hit', async () => {
+    const fakeSet = { title: 'Cached Title' } as never;
+    mockCacheService.get.mockResolvedValue({ data: fakeSet, createdAt: Date.now() });
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toEqual(fakeSet);
+  });
+
+  it('set calls cacheService.set with correct key and ttl', async () => {
+    mockCacheService.set.mockResolvedValue(undefined);
+    const tags = { title: 'T' } as never;
+    await MetaTagCache.set('chan-001', tags, 1800);
+    expect(mockCacheService.set).toHaveBeenCalledWith(
+      'meta:channel:chan-001',
+      tags,
+      { ttl: 1800 },
+    );
+  });
+
+  it('invalidate calls cacheService.invalidate with correct key', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await MetaTagCache.invalidate('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+});
+
+// ─── MetaTagService ──────────────────────────────────────────────────────────
+
+describe('metaTagService', () => {
+  it('generateMetaTagsFromContext returns valid MetaTagSet', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(tags.title.length).toBeLessThanOrEqual(60);
+    expect(tags.description.length).toBeGreaterThanOrEqual(50);
+    expect(tags.description.length).toBeLessThanOrEqual(160);
+    expect(tags.canonical).toBe(channel.canonicalUrl);
+    expect(tags.needsRegeneration).toBe(false);
+  });
+
+  it('generateMetaTagsFromContext sets robots to index, follow', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.robots).toBe('index, follow');
+  });
+
+  it('generateMetaTagsFromContext includes openGraph and twitter tags', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.openGraph.ogTitle).toBeDefined();
+    expect(tags.twitter.card).toBeDefined();
+  });
+
+  it('AC-9: returns fallback with needsRegeneration=true on generation error', async () => {
+    const spy = jest
+      .spyOn(TitleGenerator, 'generateFromThread')
+      .mockImplementation(() => { throw new Error('NLP timeout'); });
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    spy.mockRestore();
+    expect(tags.needsRegeneration).toBe(true);
+    expect(tags.title.length).toBeGreaterThan(0);
+  });
+
+  it('getOrGenerateCachedFromContext returns cache hit without regenerating', async () => {
+    const cachedTags = { title: 'Cached', needsRegeneration: false } as never;
+    mockCacheService.get.mockResolvedValue({ data: cachedTags, createdAt: Date.now() });
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    expect(tags).toEqual(cachedTags);
+    expect(mockCacheService.set).not.toHaveBeenCalled();
+  });
+
+  it('getOrGenerateCachedFromContext generates and caches on miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    mockCacheService.set.mockResolvedValue(undefined);
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(mockCacheService.set).toHaveBeenCalled();
+  });
+
+  it('getOrGenerateCachedFromContext does not cache fallback tags on generation failure', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    const spy = jest
+      .spyOn(TitleGenerator, 'generateFromThread')
+      .mockImplementation(() => { throw new Error('NLP timeout'); });
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    spy.mockRestore();
+
+    expect(tags.needsRegeneration).toBe(true);
+    expect(mockCacheService.set).not.toHaveBeenCalled();
+  });
+
+  it('invalidateCache delegates to MetaTagCache.invalidate', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await metaTagService.invalidateCache('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('buildCanonicalUrl constructs correct path', () => {
+    const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
+    expect(url).toContain('/c/game-dev-hub/unity-physics-help');
+  });
+
+  it('buildCanonicalUrl encodes reserved characters in slug segments', () => {
+    const url = metaTagService.buildCanonicalUrl('my server', 'q&a channel');
+    expect(url).toContain('/c/my%20server/q%26a%20channel');
+    expect(url).not.toContain(' ');
+    expect(url).not.toContain('&');
+  });
+
+  it('generateMetaTagsFromContext emits index,follow for PUBLIC_INDEXABLE', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(
+      { ...channel, visibility: 'PUBLIC_INDEXABLE' },
+      messages,
+    );
+    expect(tags.robots).toBe('index, follow');
+  });
+
+  it('generateMetaTagsFromContext emits noindex,follow for PUBLIC_NO_INDEX', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(
+      { ...channel, visibility: 'PUBLIC_NO_INDEX' },
+      messages,
+    );
+    expect(tags.robots).toBe('noindex, follow');
+  });
+
+  it('generateMetaTagsFromContext emits noindex,nofollow for PRIVATE', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(
+      { ...channel, visibility: 'PRIVATE' },
+      messages,
+    );
+    expect(tags.robots).toBe('noindex, nofollow');
+  });
+});
```

#### Tool: exec_command

```sh
git diff --unified=80 origin/main..pr-443 -- harmony-backend/src/services/metaTag/descriptionGenerator.ts harmony-backend/src/services/metaTag/openGraphGenerator.ts harmony-backend/src/services/metaTag/structuredDataGenerator.ts harmony-backend/src/services/metaTag/titleGenerator.ts harmony-backend/src/services/metaTag/metaTagCache.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/descriptionGenerator.ts b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
new file mode 100644
index 0000000..73d84f5
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
@@ -0,0 +1,99 @@
+// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
+import type { MessageContext, ChannelContext, MetaTagSet, IMetaTagGenerator } from './types';
+
+const MAX_LENGTH = 160;
+const MIN_LENGTH = 50;
+
+export const DescriptionGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  minLength: number;
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string;
+  extractKeyPhrases(content: string, maxPhrases: number): string[];
+  sanitizeText(text: string): string;
+  summarizeThread(messages: MessageContext[]): string;
+  enforceLength(text: string): string;
+} = {
+  maxLength: MAX_LENGTH,
+  minLength: MIN_LENGTH,
+
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
+    const serverName = this.sanitizeText(channel.serverName);
+    const channelName = this.sanitizeText(channel.name);
+    const suffix = ` — Join the discussion on ${serverName}.`;
+
+    if (messages.length === 0) {
+      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;
+      return this.enforceLength(base);
+    }
+
+    const summary = this.summarizeThread(messages);
+    const prefix = `${serverName} › #${channelName}: `;
+    let text = prefix + summary;
+
+    if (text.length < MIN_LENGTH) {
+      text = text + suffix;
+    }
+
+    return this.enforceLength(text);
+  },
+
+  // Spec: extractKeyPhrases(content: string, maxPhrases: number): string[]
+  extractKeyPhrases(content: string, maxPhrases: number): string[] {
+    const words = content
+      .toLowerCase()
+      .replace(/<[^>]*>/g, '')
+      .replace(/[^a-z0-9\s]/g, ' ')
+      .split(/\s+/)
+      .filter((w) => w.length > 3);
+
+    const freq = new Map<string, number>();
+    for (const word of words) {
+      freq.set(word, (freq.get(word) ?? 0) + 1);
+    }
+
+    return [...freq.entries()]
+      .sort((a, b) => b[1] - a[1])
+      .slice(0, maxPhrases)
+      .map(([word]) => word);
+  },
+
+  sanitizeText(text: string): string {
+    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
+  },
+
+  // Spec: summarizeThread(messages: Message[]): string — channel context handled by generateFromMessages
+  summarizeThread(messages: MessageContext[]): string {
+    if (messages.length === 0) return '';
+    return this.sanitizeText(messages[0].content);
+  },
+
+  enforceLength(text: string): string {
+    let result = text;
+
+    if (result.length < MIN_LENGTH) {
+      const additions = [
+        ' Join the discussion.',
+        ' Explore the latest updates.',
+        ' Connect with the community.',
+      ];
+      let i = 0;
+      while (result.length < MIN_LENGTH) {
+        result += additions[i % additions.length];
+        i++;
+      }
+    }
+
+    if (result.length > MAX_LENGTH) {
+      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+    }
+    return result;
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('DescriptionGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('DescriptionGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/metaTagCache.ts b/harmony-backend/src/services/metaTag/metaTagCache.ts
new file mode 100644
index 0000000..c915c14
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagCache.ts
@@ -0,0 +1,22 @@
+// CL-C2.6 MetaTagCache — Redis-backed cache for generated meta tags (D7.1)
+import { cacheService, CacheKeys } from '../cache.service';
+import type { MetaTagSet } from './types';
+
+const DEFAULT_TTL = 3600; // seconds, per spec D7.1
+
+export const MetaTagCache = {
+  ttl: DEFAULT_TTL,
+
+  async get(channelId: string): Promise<MetaTagSet | null> {
+    const entry = await cacheService.get<MetaTagSet>(CacheKeys.metaChannel(channelId));
+    return entry?.data ?? null;
+  },
+
+  async set(channelId: string, tags: MetaTagSet, ttl?: number): Promise<void> {
+    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl: ttl ?? DEFAULT_TTL });
+  },
+
+  async invalidate(channelId: string): Promise<void> {
+    await cacheService.invalidate(CacheKeys.metaChannel(channelId));
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/openGraphGenerator.ts b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
new file mode 100644
index 0000000..8ce445d
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
@@ -0,0 +1,60 @@
+// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
+import type { ChannelContext, OpenGraphTags, TwitterCardTags, MetaTagSet, IMetaTagGenerator, ContentAnalysis } from './types';
+
+const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
+const SITE_NAME = 'Harmony';
+const TWITTER_SITE = '@harmonychat';
+
+export const OpenGraphGenerator: IMetaTagGenerator & {
+  defaultImage: string;
+  // Spec §9.1.4: generateOGTags(channel, server, analysis)
+  generateOGTags(channel: ChannelContext, server: unknown, analysis: ContentAnalysis): OpenGraphTags;
+  // Spec §9.1.4: generateTwitterCard(channel, server, analysis)
+  generateTwitterCard(channel: ChannelContext, server: unknown, analysis: ContentAnalysis, image?: string): TwitterCardTags;
+  // Spec §9.1.4: selectPreviewImage(channel, messages): string | null
+  selectPreviewImage(channel: ChannelContext, messages: unknown[]): string | null;
+} = {
+  defaultImage: DEFAULT_IMAGE,
+
+  // M2 skeleton: title from analysis.topics[0], description from analysis.summary; full NLP integration by M4
+  generateOGTags(channel: ChannelContext, _server: unknown, analysis: ContentAnalysis): OpenGraphTags {
+    return {
+      ogTitle: analysis.topics[0] ?? channel.name,
+      ogDescription: analysis.summary,
+      ogImage: OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE,
+      ogType: 'website',
+      ogUrl: channel.canonicalUrl,
+      ogSiteName: SITE_NAME,
+    };
+  },
+
+  generateTwitterCard(
+    channel: ChannelContext,
+    _server: unknown,
+    analysis: ContentAnalysis,
+    image?: string,
+  ): TwitterCardTags {
+    const resolvedImage = image ?? OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE;
+    const isCustomImage = resolvedImage !== DEFAULT_IMAGE;
+    return {
+      card: isCustomImage ? 'summary_large_image' : 'summary',
+      title: analysis.topics[0] ?? channel.name,
+      description: analysis.summary,
+      image: resolvedImage,
+      site: TWITTER_SITE,
+    };
+  },
+
+  // M2 skeleton: always returns default image; real selection by M4 (messages/channel avatars)
+  selectPreviewImage(_channel: ChannelContext, _messages: unknown[]): string | null {
+    return DEFAULT_IMAGE;
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('OpenGraphGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('OpenGraphGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
new file mode 100644
index 0000000..24adea2
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
@@ -0,0 +1,71 @@
+// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
+import type { ChannelContext, MessageContext, MetaTagSet, StructuredData } from './types';
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+export const StructuredDataGenerator = {
+  // Spec §9.1.5: generateDiscussionForum(channel, messages, server)
+  // M2 skeleton: derived from channel context; message/server integration by M4
+  generateDiscussionForum(channel: ChannelContext, _messages: MessageContext[], _server: unknown): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'DiscussionForumPosting',
+      headline: `${channel.name} — ${channel.serverName}`,
+      description: `Discussions in #${channel.name} on ${channel.serverName}.`,
+      // author and datePublished are stub fields — populated by M4 when message data is available
+      author: undefined,
+      datePublished: undefined,
+      dateModified: undefined,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+
+  // Spec §9.1.5: generateBreadcrumbList(server, channel)
+  generateBreadcrumbList(_server: unknown, channel: ChannelContext): object {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'BreadcrumbList',
+      itemListElement: [
+        {
+          '@type': 'ListItem',
+          position: 1,
+          name: channel.serverName,
+          item: `${BASE_URL}/s/${channel.serverSlug}`,
+        },
+        {
+          '@type': 'ListItem',
+          position: 2,
+          name: channel.name,
+          item: channel.canonicalUrl,
+        },
+      ],
+    };
+  },
+
+  // Spec §9.1.5: generateOrganization(server)
+  generateOrganization(_server: unknown): object {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'Organization',
+      name: 'Harmony',
+      url: BASE_URL,
+    };
+  },
+
+  // Spec §9.1.5: generateWebPage(channel, metaTags)
+  generateWebPage(channel: ChannelContext, metaTags: MetaTagSet): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'WebPage',
+      headline: metaTags.title,
+      description: metaTags.description,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/titleGenerator.ts b/harmony-backend/src/services/metaTag/titleGenerator.ts
new file mode 100644
index 0000000..0365b11
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/titleGenerator.ts
@@ -0,0 +1,65 @@
+// CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
+import type { ChannelContext, MessageContext, MetaTagSet, IMetaTagGenerator } from './types';
+
+const MAX_LENGTH = 60;
+
+const CHANNEL_TEMPLATE = '{channelName} — {serverName}';
+
+export const TitleGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  generateFromChannel(channel: ChannelContext): string;
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string;
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string;
+  truncateWithEllipsis(text: string): string;
+  sanitizeForTitle(text: string): string;
+  applyTemplate(template: string, vars: Record<string, string>): string;
+} = {
+  maxLength: MAX_LENGTH,
+
+  generateFromChannel(channel: ChannelContext): string {
+    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(
+      '{serverName}',
+      channel.serverName,
+    );
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string {
+    const raw = `${message.content} — ${channel.serverName}`;
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string {
+    if (messages.length === 0) {
+      return this.generateFromChannel(channel);
+    }
+    return this.generateFromMessage(messages[0], channel);
+  },
+
+  truncateWithEllipsis(text: string): string {
+    if (text.length <= MAX_LENGTH) return text;
+    return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+  },
+
+  sanitizeForTitle(text: string): string {
+    return text
+      .replace(/<[^>]*>/g, '')
+      .replace(/\s+/g, ' ')
+      .trim();
+  },
+
+  applyTemplate(template: string, vars: Record<string, string>): string {
+    return Object.entries(vars).reduce(
+      (result, [key, value]) => result.replaceAll(`{${key}}`, value),
+      template,
+    );
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('TitleGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('TitleGenerator.validate() not yet implemented — wired by M4');
+  },
+};
```

#### Tool: exec_command

```sh
gh pr checks 443 --repo CS485-Harmony/Harmony
```

Output:

```text
Backend Lint and Build	pass	24s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032055/job/72383949876	
Frontend Lint and Build	pass	40s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032055/job/72383949891	
Run Backend Tests	pass	1m24s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032119/job/72383949744	
Run Frontend Tests	pass	26s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032042/job/72383949773	
Run Integration Tests	pass	1m57s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032066/job/72383950027	
Vercel Preview Comments	pass	0	https://vercel.com/github	
Run Cloud Integration Tests	skipping	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032066/job/72383950763	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/6b69yo8VZiRYhNx2VLxvKxw5EsJu	Deployment has completed
```

#### Tool: exec_command

```sh
git diff --name-only origin/main..pr-443
```

Output:

```text
.github/workflows/run-frontend-e2e.yml
docs/deployment/replica-readiness-audit.md
harmony-backend/src/events/eventBus.ts
harmony-backend/src/routes/events.router.ts
harmony-backend/src/services/metaTag/descriptionGenerator.ts
harmony-backend/src/services/metaTag/metaTagCache.ts
harmony-backend/src/services/metaTag/metaTagService.ts
harmony-backend/src/services/metaTag/openGraphGenerator.ts
harmony-backend/src/services/metaTag/structuredDataGenerator.ts
harmony-backend/src/services/metaTag/titleGenerator.ts
harmony-backend/src/services/metaTag/types.ts
harmony-backend/src/services/serverMember.service.ts
harmony-backend/tests/events.router.server.test.ts
harmony-backend/tests/events.router.test.ts
harmony-backend/tests/helpers/async.ts
harmony-backend/tests/metaTagService.test.ts
harmony-backend/tests/serverMember.test.ts
llm-logs/2026-04-20-094302-session-ce430386.md
llm-logs/2026-04-20-094337-session-e79268af.md
llm-logs/2026-04-20-100616-session-12bb34ec.md
llm-logs/2026-04-20-122835-session-b13d715d.md
llm-logs/declanblanc/claude-conversation-2026-04-18-b42b9611.md
llm-logs/declanblanc/claude-conversation-2026-04-20-c779de46.md
llm-logs/declanblanc/claude-conversation-2026-04-20-cc169300.md
tests/integration/attachments.test.ts
tests/integration/env.ts
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:30:38.350Z

CI is green and the stale PR-description note has been removed. One missed edge remains in the same URL-encoding family as the last review: `generateBreadcrumbList()` still builds a structured-data URL with a raw `serverSlug`; I’m checking exact line context before posting.

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/structuredDataGenerator.ts | nl -ba | sed -n '1,90p'
```

Output:

```text
     1	// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
     2	import type { ChannelContext, MessageContext, MetaTagSet, StructuredData } from './types';
     3	
     4	const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
     5	
     6	export const StructuredDataGenerator = {
     7	  // Spec §9.1.5: generateDiscussionForum(channel, messages, server)
     8	  // M2 skeleton: derived from channel context; message/server integration by M4
     9	  generateDiscussionForum(channel: ChannelContext, _messages: MessageContext[], _server: unknown): StructuredData {
    10	    return {
    11	      '@context': 'https://schema.org',
    12	      '@type': 'DiscussionForumPosting',
    13	      headline: `${channel.name} — ${channel.serverName}`,
    14	      description: `Discussions in #${channel.name} on ${channel.serverName}.`,
    15	      // author and datePublished are stub fields — populated by M4 when message data is available
    16	      author: undefined,
    17	      datePublished: undefined,
    18	      dateModified: undefined,
    19	      mainEntity: {
    20	        '@type': 'WebPage',
    21	        url: channel.canonicalUrl,
    22	      },
    23	    };
    24	  },
    25	
    26	  // Spec §9.1.5: generateBreadcrumbList(server, channel)
    27	  generateBreadcrumbList(_server: unknown, channel: ChannelContext): object {
    28	    return {
    29	      '@context': 'https://schema.org',
    30	      '@type': 'BreadcrumbList',
    31	      itemListElement: [
    32	        {
    33	          '@type': 'ListItem',
    34	          position: 1,
    35	          name: channel.serverName,
    36	          item: `${BASE_URL}/s/${channel.serverSlug}`,
    37	        },
    38	        {
    39	          '@type': 'ListItem',
    40	          position: 2,
    41	          name: channel.name,
    42	          item: channel.canonicalUrl,
    43	        },
    44	      ],
    45	    };
    46	  },
    47	
    48	  // Spec §9.1.5: generateOrganization(server)
    49	  generateOrganization(_server: unknown): object {
    50	    return {
    51	      '@context': 'https://schema.org',
    52	      '@type': 'Organization',
    53	      name: 'Harmony',
    54	      url: BASE_URL,
    55	    };
    56	  },
    57	
    58	  // Spec §9.1.5: generateWebPage(channel, metaTags)
    59	  generateWebPage(channel: ChannelContext, metaTags: MetaTagSet): StructuredData {
    60	    return {
    61	      '@context': 'https://schema.org',
    62	      '@type': 'WebPage',
    63	      headline: metaTags.title,
    64	      description: metaTags.description,
    65	      mainEntity: {
    66	        '@type': 'WebPage',
    67	        url: channel.canonicalUrl,
    68	      },
    69	    };
    70	  },
    71	};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/metaTagService.ts | nl -ba | sed -n '1,180p'
```

Output:

```text
     1	// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
     2	import { TitleGenerator } from './titleGenerator';
     3	import { DescriptionGenerator } from './descriptionGenerator';
     4	import { OpenGraphGenerator } from './openGraphGenerator';
     5	import { StructuredDataGenerator } from './structuredDataGenerator';
     6	import { MetaTagCache } from './metaTagCache';
     7	import type {
     8	  MetaTagSet,
     9	  ChannelContext,
    10	  ChannelVisibility,
    11	  MessageContext,
    12	  MetaTagPreview,
    13	  MetaTagJobStatus,
    14	  ContentAnalysis,
    15	} from './types';
    16	import { createLogger } from '../../lib/logger';
    17	
    18	const logger = createLogger({ component: 'meta-tag-service' });
    19	
    20	const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
    21	
    22	// Spec §9.1.1 visibility → robots mapping
    23	function getRobotsDirective(visibility: ChannelVisibility | undefined): string {
    24	  if (visibility === 'PUBLIC_NO_INDEX') return 'noindex, follow';
    25	  if (visibility === 'PRIVATE') return 'noindex, nofollow';
    26	  return 'index, follow'; // PUBLIC_INDEXABLE or unset
    27	}
    28	
    29	function sanitizeChannelContext(channel: ChannelContext): ChannelContext {
    30	  return {
    31	    ...channel,
    32	    name: TitleGenerator.sanitizeForTitle(channel.name),
    33	    serverName: TitleGenerator.sanitizeForTitle(channel.serverName),
    34	  };
    35	}
    36	
    37	function buildFallbackTags(channel: ChannelContext): MetaTagSet {
    38	  const safe = sanitizeChannelContext(channel);
    39	  const title = `${safe.name} — ${safe.serverName}`;
    40	  const description = `Discussions in #${safe.name} on ${safe.serverName}.`;
    41	  const analysis: ContentAnalysis = {
    42	    keywords: [],
    43	    topics: [TitleGenerator.truncateWithEllipsis(title)],
    44	    summary: DescriptionGenerator.enforceLength(description),
    45	    sentiment: 'neutral',
    46	    readingLevel: 'basic',
    47	  };
    48	  return {
    49	    title: TitleGenerator.truncateWithEllipsis(title),
    50	    description: DescriptionGenerator.enforceLength(description),
    51	    canonical: safe.canonicalUrl,
    52	    robots: getRobotsDirective(safe.visibility),
    53	    openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
    54	    twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
    55	    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
    56	    keywords: [],
    57	    needsRegeneration: true,
    58	  };
    59	}
    60	
    61	export const metaTagService = {
    62	  /**
    63	   * Generate meta tags from pre-resolved context (used internally and in unit tests).
    64	   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
    65	   */
    66	  async generateMetaTagsFromContext(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
    67	    try {
    68	      const title = TitleGenerator.generateFromThread(messages, channel);
    69	      const description = DescriptionGenerator.generateFromMessages(messages, channel);
    70	      const keywords = DescriptionGenerator.extractKeyPhrases(messages.map((m) => m.content).join(' '), 5);
    71	      const analysis: ContentAnalysis = {
    72	        keywords,
    73	        topics: [title],
    74	        summary: description,
    75	        sentiment: 'neutral',
    76	        readingLevel: 'basic',
    77	      };
    78	      const og = OpenGraphGenerator.generateOGTags(channel, {}, analysis);
    79	      const twitter = OpenGraphGenerator.generateTwitterCard(channel, {}, analysis, og.ogImage);
    80	      const structuredData = StructuredDataGenerator.generateDiscussionForum(channel, messages, {});
    81	
    82	      return {
    83	        title,
    84	        description,
    85	        canonical: channel.canonicalUrl,
    86	        robots: getRobotsDirective(channel.visibility),
    87	        openGraph: og,
    88	        twitter,
    89	        structuredData,
    90	        keywords,
    91	        needsRegeneration: false,
    92	      };
    93	    } catch (err) {
    94	      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
    95	      return buildFallbackTags(channel);
    96	    }
    97	  },
    98	
    99	  /**
   100	   * Spec-aligned stub: generateMetaTags(channelId, options?).
   101	   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
   102	   */
   103	  async generateMetaTags(
   104	    _channelId: string,
   105	    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
   106	  ): Promise<MetaTagSet> {
   107	    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
   108	  },
   109	
   110	  /**
   111	   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
   112	   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
   113	   */
   114	  async getOrGenerateCachedFromContext(
   115	    channel: ChannelContext,
   116	    messages: MessageContext[],
   117	    ttl?: number,
   118	  ): Promise<MetaTagSet> {
   119	    const cached = await MetaTagCache.get(channel.id);
   120	    if (cached) return cached;
   121	
   122	    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
   123	    // Do not cache fallback tags — a transient failure must not poison the cache for the full TTL
   124	    if (!tags.needsRegeneration) {
   125	      await MetaTagCache.set(channel.id, tags, ttl);
   126	    }
   127	    return tags;
   128	  },
   129	
   130	  /**
   131	   * Spec-aligned stub: getOrGenerateCached(channelId).
   132	   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
   133	   */
   134	  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
   135	    throw new Error('getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)');
   136	  },
   137	
   138	  async invalidateCache(channelId: string): Promise<void> {
   139	    await MetaTagCache.invalidate(channelId);
   140	  },
   141	
   142	  // scheduleRegeneration and getRegenerationJobStatus are stubs —
   143	  // full implementation depends on M4 (worker/queue) from issue #356
   144	  async scheduleRegeneration(
   145	    channelId: string,
   146	    _priority?: 'high' | 'normal' | 'low',
   147	    _idempotencyKey?: string,
   148	  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
   149	    // Queuing logic wired by M4 MetaTagUpdateWorker
   150	    return {
   151	      jobId: `meta-tag-regeneration:${channelId}`,
   152	      status: 'queued',
   153	    };
   154	  },
   155	
   156	  async getRegenerationJobStatus(
   157	    _channelId: string,
   158	    _jobId: string,
   159	  ): Promise<MetaTagJobStatus> {
   160	    throw new Error('getRegenerationJobStatus not yet implemented — wired by M4 (issue #356)');
   161	  },
   162	
   163	  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
   164	    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
   165	  },
   166	
   167	  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
   168	    return `${BASE_URL}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(channelSlug)}`;
   169	  },
   170	};
```

#### Tool: exec_command

```sh
gh pr diff 443 --repo CS485-Harmony/Harmony --name-only
```

Output:

```text
harmony-backend/src/services/metaTag/descriptionGenerator.ts
harmony-backend/src/services/metaTag/metaTagCache.ts
harmony-backend/src/services/metaTag/metaTagService.ts
harmony-backend/src/services/metaTag/openGraphGenerator.ts
harmony-backend/src/services/metaTag/structuredDataGenerator.ts
harmony-backend/src/services/metaTag/titleGenerator.ts
harmony-backend/src/services/metaTag/types.ts
harmony-backend/tests/metaTagService.test.ts
llm-logs/2026-04-20-094302-session-ce430386.md
llm-logs/2026-04-20-122835-session-b13d715d.md
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:30:45.630Z

The latest head fixed the previous robots and `buildCanonicalUrl()` issues, and the PR description no longer has the stale pre-existing-failure note. I found one remaining URL-construction gap in breadcrumb structured data, so I’m posting that as the bundled re-review now.

#### Tool: exec_command

````sh
cat >/tmp/review443-latest.md <<'EOF'
## PR Review Checklist

- [ ] **1. Logic over Style** — The prior robots and canonical helper issues are fixed, but `generateBreadcrumbList()` still builds the server breadcrumb URL with a raw `serverSlug`, so reserved characters can still produce invalid/misparsed structured-data URLs.
- [x] **2. Security First** — I did not find a new security issue in the latest code changes.
- [ ] **3. Architectural Alignment** — Breadcrumb URL generation should follow the same encoded path-segment behavior now used by `buildCanonicalUrl()` and the existing sitemap generator.
- [x] **4. Issue Completion** — The PR description has been updated correctly: the stale “pre-existing `metaTag.repository.test.ts` failure” note is gone, and the test plan now says the repository test passes.
- [x] **5. No Nitpicking** — This is a concrete URL correctness issue in generated JSON-LD, not style feedback.
- [x] **6. Avoid Repetition** — I am not repeating resolved comments about robots or `buildCanonicalUrl()`; both are fixed in `b5a5950`.
- [x] **7. Iterative Reviews** — Re-reviewed latest head `b5a5950`; previous blockers are addressed except for the related breadcrumb URL path.
- [x] **8. Prevent CI Failures** — Current GitHub checks are green; this remaining issue is a behavioral gap not covered by CI.

## Review (Request changes)

The latest push fixed the previous blockers:

- `ChannelContext.visibility` now drives `robots` correctly for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`.
- `buildCanonicalUrl()` now encodes both slug path segments.
- The stale PR-description note about `tests/metaTag.repository.test.ts` failing has been removed; the description now says the repository test passes, which matches the current schema state.

One related URL issue remains:

### Encode `serverSlug` in breadcrumb structured data
**File:** `harmony-backend/src/services/metaTag/structuredDataGenerator.ts:26-37`

`generateBreadcrumbList()` still emits the first breadcrumb item as:

```ts
item: `${BASE_URL}/s/${channel.serverSlug}`,
```

The same slug validation concern applies here as it did to `buildCanonicalUrl()`: channel/server slug inputs are not restricted to URL-safe characters, and the repo’s sitemap generator already uses `encodeURIComponent` for slug path segments. If `serverSlug` contains a space, `?`, `#`, `/`, or `&`, this JSON-LD URL can become invalid or point to the wrong path/query/fragment.

Please encode the breadcrumb path segment too, e.g.:

```ts
item: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,
```

and add a small test alongside the canonical URL encoding test.
EOF

gh pr review 443 --repo CS485-Harmony/Harmony --request-changes --body-file /tmp/review443-latest.md
````

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:31:02.121Z

The review was submitted. I’m verifying GitHub recorded it on the latest commit.

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls/443/reviews | jq 'map({id,user:.user.login,state,submitted_at,commit_id,body})[-3:]'
```

Output:

````text
[
  {
    "id": 4150285494,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:26:22Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": ""
  },
  {
    "id": 4150285950,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:26:27Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": ""
  },
  {
    "id": 4150307918,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-21T19:30:59Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — The prior robots and canonical helper issues are fixed, but `generateBreadcrumbList()` still builds the server breadcrumb URL with a raw `serverSlug`, so reserved characters can still produce invalid/misparsed structured-data URLs.\n- [x] **2. Security First** — I did not find a new security issue in the latest code changes.\n- [ ] **3. Architectural Alignment** — Breadcrumb URL generation should follow the same encoded path-segment behavior now used by `buildCanonicalUrl()` and the existing sitemap generator.\n- [x] **4. Issue Completion** — The PR description has been updated correctly: the stale “pre-existing `metaTag.repository.test.ts` failure” note is gone, and the test plan now says the repository test passes.\n- [x] **5. No Nitpicking** — This is a concrete URL correctness issue in generated JSON-LD, not style feedback.\n- [x] **6. Avoid Repetition** — I am not repeating resolved comments about robots or `buildCanonicalUrl()`; both are fixed in `b5a5950`.\n- [x] **7. Iterative Reviews** — Re-reviewed latest head `b5a5950`; previous blockers are addressed except for the related breadcrumb URL path.\n- [x] **8. Prevent CI Failures** — Current GitHub checks are green; this remaining issue is a behavioral gap not covered by CI.\n\n## Review (Request changes)\n\nThe latest push fixed the previous blockers:\n\n- `ChannelContext.visibility` now drives `robots` correctly for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`.\n- `buildCanonicalUrl()` now encodes both slug path segments.\n- The stale PR-description note about `tests/metaTag.repository.test.ts` failing has been removed; the description now says the repository test passes, which matches the current schema state.\n\nOne related URL issue remains:\n\n### Encode `serverSlug` in breadcrumb structured data\n**File:** `harmony-backend/src/services/metaTag/structuredDataGenerator.ts:26-37`\n\n`generateBreadcrumbList()` still emits the first breadcrumb item as:\n\n```ts\nitem: `${BASE_URL}/s/${channel.serverSlug}`,\n```\n\nThe same slug validation concern applies here as it did to `buildCanonicalUrl()`: channel/server slug inputs are not restricted to URL-safe characters, and the repo’s sitemap generator already uses `encodeURIComponent` for slug path segments. If `serverSlug` contains a space, `?`, `#`, `/`, or `&`, this JSON-LD URL can become invalid or point to the wrong path/query/fragment.\n\nPlease encode the breadcrumb path segment too, e.g.:\n\n```ts\nitem: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,\n```\n\nand add a small test alongside the canonical URL encoding test.\n"
  }
]
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:31:11.151Z

Posted a new `REQUEST_CHANGES` review on latest head `b5a5950`.

Summary:
- Confirmed the PR description was fixed: the stale `metaTag.repository.test.ts` failure note is gone, and it now says that test passes.
- Confirmed previous blockers were addressed: robots mapping and `buildCanonicalUrl()` encoding are fixed.
- Left one remaining requested change: `generateBreadcrumbList()` still uses raw `channel.serverSlug` in the JSON-LD breadcrumb URL and should encode it with `encodeURIComponent`, with a small regression test.

All current GitHub checks are green.

<oai-mem-citation>
<citation_entries>
MEMORY.md:234-234|note=[used Harmony review workflow reminder to post checklist and bundled review]
MEMORY.md:155-157|note=[used Harmony PR review workflow memory entry for repo-specific review process]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>

### Turn 7: also ensure that the changes are aligned with the documentation from

#### 👤 User Prompt

- Time: 2026-04-21T19:31:11.257Z

```text
also ensure that the changes are aligned with the documentation from [dev-spec-seo-meta-tag-generation.md](docs/dev-spec-seo-meta-tag-generation.md)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:31:27.456Z

I’ll cross-check the current PR head against `docs/dev-spec-seo-meta-tag-generation.md`, focusing on the method contracts, DTOs, acceptance criteria, visibility/robots behavior, canonical URLs, and cache/fallback requirements. If this changes the review outcome, I’ll post a follow-up bundled review/comment.

#### Tool: exec_command

```sh
git fetch origin main pull/443/head:pr-443 --force
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            main       -> FETCH_HEAD
```

#### Tool: exec_command

```sh
rg -n "CL-C2|CL-D|CL-I1|Acceptance Criteria|AC-|generateMetaTags\(|getOrGenerateCached\(|scheduleRegeneration\(|getMetaTagsForPreview\(|getRegenerationJobStatus\(|TitleGenerator|DescriptionGenerator|OpenGraphGenerator|StructuredDataGenerator|MetaTagCache|robots|PUBLIC_NO_INDEX|canonical|BreadcrumbList|Cache|fallback|needsRegeneration" docs/dev-spec-seo-meta-tag-generation.md
```

Output:

```text
78:│  │  │ C2.1 MetaTagService         │    │ C2.2 TitleGenerator             │   │  │
87:│  │  │ generateMetaTags()          │◄───│ applyTemplate()                 │   │  │
88:│  │  │ getOrGenerateCached()       │    └─────────────────────────────────┘   │  │
89:│  │  │ invalidateCache()           │                                          │  │
90:│  │  │ scheduleRegeneration()      │                                          │  │
91:│  │  │ getMetaTagsForPreview()     │                                          │  │
92:│  │  │ getRegenerationJobStatus()  │                                          │  │
94:│  │  ┌─────────────────────────────┐    │ C2.4 OpenGraphGenerator         │   │  │
95:│  │  │ C2.3 DescriptionGenerator   │    │ ─────────────────────────────── │   │  │
104:│  │  ┌─────────────────────────────┐    │ C2.6 MetaTagCache               │   │  │
109:│  │  │ generateBreadcrumbList()    │    │ get()                           │   │  │
228:│  │ M7 Cache Module                                                           │  │
230:│  │  │ D7.1 MetaTagCache            │    │ D7.2 ContentAnalysisCache        │ │  │
271:| F3 | C2.1 MetaTagService | C2.6 MetaTagCache | Cache lookup | Redis |
386:                            │   CL-I1 IMetaTagGenerator │
397:│ CL-C2.2 TitleGenerator. │  │ CL-C2.3 DescriptionGenerator│   │ CL-C2.4 OpenGraphGenerator│
412:                            │ CL-C2.1 MetaTagService      │
422:                            │ + generateMetaTags()        │
423:                            │ + getOrGenerateCached()     │
424:                            │ + invalidateCache()         │
425:                            │ + scheduleRegeneration()    │
426:                            │ + getMetaTagsForPreview()   │
427:                            │ + getRegenerationJobStatus()│
434:        │ CL-C3.1 ContentAnalyzer│ │ CL-C2.5 Structured         │ │ CL-C2.6 MetaTagCache│
438:        │ - topicClassifier      │ │ + generateBreadcrumbList() │ ├─────────────────────┤
466:│ CL-D1 MetaTagSet        │     │ CL-D2 OpenGraphTags     │
471:│ + canonical: string     │     │ + ogImage: string       │
472:│ + robots: string        │     │ + ogType: string        │
478:                                │ CL-D3 TwitterCardTags   │
480:│ CL-D4 StructuredData    │     ├─────────────────────────┤
489:│ + dateModified: string  │     │ CL-D5 ContentAnalysis   │
540:│ CL-C1.1 PublicChannelPage    │───────────────►│ CL-C2.1 MetaTagService       │
584:      │ CL-C4.3 SitemapUpdater       │               │ CL-C2.1 MetaTagService       │
613:Class labels in this section intentionally match Section 3 (`CL-I`, `CL-C`, `CL-D`, `CL-E`) to keep diagram and inventory references consistent.
626:| CL-C2.1 | MetaTagService | Service (Facade) | Orchestrates meta tag generation, caching, and invalidation |
627:| CL-C2.2 | TitleGenerator | Service | Generates SEO-optimized page titles from channel/message content |
628:| CL-C2.3 | DescriptionGenerator | Service | Generates meta descriptions from thread summaries |
629:| CL-C2.4 | OpenGraphGenerator | Service | Generates Open Graph and Twitter Card meta tags |
630:| CL-C2.5 | StructuredDataGenerator | Service | Generates JSON-LD structured data for rich snippets |
631:| CL-C2.6 | MetaTagCache | Service | Caches generated meta tags in Redis |
662:| CL-D1 | MetaTagSet | DTO | Complete set of meta tags for a page |
663:| CL-D2 | OpenGraphTags | DTO | Open Graph protocol tags |
664:| CL-D3 | TwitterCardTags | DTO | Twitter Card tags |
665:| CL-D4 | StructuredData | DTO | JSON-LD structured data |
666:| CL-D5 | ContentAnalysis | DTO | Results of content analysis |
680:| CL-I1 | IMetaTagGenerator | Interface | Shared `generate()` / `validate()` contract for meta tag generator classes |
714:              │ S1: Check Cache               │
720:                      < Cache Hit? >
725:    │ S2: Serve Cached     │   │ S3: Check Database            │
779:               │       │   │ Cache           │              │
803:│ S1: Check Cache    │ cache.get() returns data │ S2: Serve Cached   │ None                        │
804:│ S1: Check Cache    │ cache.get() returns null │ S3: Check Database │ Database query              │
813:│ S11: Persist       │ Saved successfully       │ S12: Render        │ Cache invalidation          │
863: │ Invalidate meta cache    │ │ Regen with robots=       │       /                \
904:                                    │ B9: Invalidate Caches        │
948:│ B16: Regen (no-index)  │ Cache invalidated                │ B7: Regenerate Tags     │ Invalidate meta cache, regen with │
949:│                        │                                  │                         │ robots=noindex                    │
950:│ B17: Regen (indexable) │ Cache invalidated                │ B7: Regenerate Tags     │ Invalidate meta cache, high-pri   │
954:│ B8: Update Database    │ Upsert succeeds                  │ B9: Invalidate Caches   │ Redis invalidate, CDN purge       │
956:│ B9: Invalidate Caches  │ Invalidation succeeds            │ B10: Notify Engines     │ Update sitemap, ping crawlers     │
957:│ B9: Invalidate Caches  │ CDN purge failure                │ B15: Partial Success    │ Retry CDN purge asynchronously    │
969:| `VISIBILITY_CHANGED` where `newVisibility = PUBLIC_INDEXABLE` | `B0 → B3 (Queue) → B17 (Regen indexable) → B7 → B11 (Complete)` | Queue high-priority regeneration, invalidate `meta:channel:{channelId}`, keep canonical URL in sitemap with refreshed `lastmod` | Retry queue enqueue with backoff; keep last known tags until regeneration succeeds |
970:| `VISIBILITY_CHANGED` where `newVisibility = PUBLIC_NO_INDEX` | `B0 → B3 (Queue) → B16 (Regen no-index) → B7 → B11 (Complete)` | Regenerate tags with `robots=noindex`, invalidate `meta:channel:{channelId}`, keep channel public but excluded from indexable sitemap set | Retry queue enqueue with backoff; continue serving public tags with noindex policy |
1019:            │ Server.MetaTagCache.get(      │
1023:                    < F1.4: Cache hit? >
1079:                │             │  │ Server.TitleGenerator.        │
1091:                │             │  │ Server.DescriptionGenerator.  │
1104:                │             │  │ Server.OpenGraphGenerator.    │
1111:                │             │  │ og:url (canonical)            │
1117:                │             │  │ Server.OpenGraphGenerator.    │
1143:                │             │  │ Server.MetaTagCache.set()     │
1281:                                                                           │ Server.MetaTagCache.          │
1440:**Scenario Description:** A channel transitions from `PUBLIC_INDEXABLE` or `PUBLIC_NO_INDEX` to `PRIVATE`. Existing tags must stop being served and search engines must be notified to drop stale indexed content.
1461:    │ (e.g., PUBLIC_NO_INDEX  │     │ Server.MetaTagService.        │
1462:    │  to PUBLIC_INDEXABLE;   │     │   invalidateCache(channelId)  │
1500:                                    < PUBLIC_NO_INDEX?              >
1508:                    └─────────────────────┘         │   generateMetaTags(channelId, │
1514:                                                    - Cache cleared
1520:**Ownership Boundary:** De-indexing requests tied to visibility transitions are initiated here; the canonical visibility state remains owned by the channel visibility feature.
1621:                                                                           │ Server.MetaTagCache.          │
1747:                                                                           │ Server.MetaTagCache.          │
1776:**Scenario Description:** A channel transitions from `PRIVATE` to `PUBLIC_INDEXABLE` or `PUBLIC_NO_INDEX`, or switches between the two public states. Meta tags must be generated (or re-served), the sitemap updated, and indexing directives set according to the target visibility.
1797:  │ Server.MetaTagRepository.    │            │ PUBLIC_NO_INDEX               │
1802:   < F8.5: Records exist? >                    │ [F8.6] Update robots meta    │
1807:│ [F8.7] Generate      │  │ [F8.8] Force     │ │ PUBLIC_NO_INDEX →            │
1812:│  .generateMetaTags(  │  │ Server.MetaTagSvc│                 │
1832:                           │ Server.MetaTagCache.          │
1845:        │   addUrl(channelUrl)          │  │ PUBLIC_NO_INDEX channels      │
1871:                        - Caches warmed
1875:**Ownership Boundary:** The canonical visibility state is owned by the channel visibility feature; this flow reacts to the emitted `VISIBILITY_CHANGED` event and manages the SEO/meta tag consequences only.
1888:| RF-1 | Meta tag generation timeout | Page renders without custom tags, uses fallbacks | Generation job killed | Use cached/stale tags; retry later | Medium | Low |
1890:| RF-3 | Cache corruption | Stale or incorrect tags | Cache-DB mismatch | Invalidate cache; regenerate | Low | Medium |
1893:| RF-6 | Keyword extraction produces nonsense | Poor search relevance | Algorithm failure | Manual review trigger; fallback keywords | Low | Medium |
1900:| CF-2 | CDN cache purge fails | Stale tags served | Cache not invalidated | Retry purge; wait for TTL | Low | Medium |
1907:| QF-1 | Title too generic | Poor click-through rate | Template fallback used | Improve generation algorithm | Medium | Medium |
1942:| Average generated title length | Generated records where `custom_title IS NULL` | <30 chars for 24h | Investigate fallback overuse |
1967:| T12 | Cloudflare | N/A | CDN | Cache invalidation API | https://www.cloudflare.com/ |
1999:#### 9.1.1 CL-C2.1 MetaTagService
2005:generateMetaTags(
2014:getOrGenerateCached(
2019:invalidateCache(
2024:scheduleRegeneration(
2031:getMetaTagsForPreview(
2036:getRegenerationJobStatus(
2048:#### 9.1.2 CL-C2.2 TitleGenerator
2090:**Length Policy:** `TitleGenerator` output is capped at 60 characters. Longer admin overrides are allowed via `MetaTagOverride.customTitle` (max 70).
2092:#### 9.1.3 CL-C2.3 DescriptionGenerator
2115:**Length Policy:** `DescriptionGenerator` output is capped at 160 characters. Longer admin overrides are allowed via `MetaTagOverride.customDescription` (max 200).
2117:#### 9.1.4 CL-C2.4 OpenGraphGenerator
2145:#### 9.1.5 CL-C2.5 StructuredDataGenerator
2157:// Generate BreadcrumbList schema
2158:generateBreadcrumbList(
2206:- Unsupported languages use deterministic fallback generation (channel/server naming + first meaningful sentence).
2207:- On analyzer exception/timeout (>5s), return fallback analysis and set `needs_regeneration=true` in persistence metadata.
2437:#### 9.5.1 CL-D1 MetaTagSet
2443:  canonical: string;
2444:  robots: string;
2452:#### 9.5.2 CL-D2 OpenGraphTags
2465:#### 9.5.3 CL-D3 TwitterCardTags
2477:#### 9.5.4 CL-D4 StructuredData
2493:#### 9.5.5 CL-D5 ContentAnalysis
2565:| getOrGenerateCached() | MetaTagService | SSR meta tag injection |
2566:| generateMetaTags() | MetaTagService | Force regeneration |
2591:| findBySlug() | ChannelRepository | Resolve canonical route channel for SSR generation |
2599:| findFirstMessage() | MessageRepository | Get first message for fallback description |
2606:| generateMetaTags() | MetaTagService | Background regeneration |
2607:| invalidateCache() | MetaTagService | Cache management |
2608:| scheduleRegeneration() | MetaTagService | Queue background meta tag updates |
2610:**Cross-Reference:** The guest public channel view feature's `SEOService` is an adapter that delegates generation to `MetaTagService.getOrGenerateCached()` from this spec.
2616:| `PUBLIC_INDEXABLE` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration, refresh tags, keep canonical URL indexable |
2617:| `PUBLIC_NO_INDEX` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration with `noindex` directives while keeping page publicly accessible |
2900:This feature consumes the canonical `channels` schema maintained by the channel visibility spec (`docs/dev-spec-channel-visibility-toggle.md`, Section 11.1 D7.1) to avoid drift.
2915:**Visibility Enum:** `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`
2943:| needs_regeneration | BOOLEAN | NOT NULL, DEFAULT false | Set when fallback generation is used and retry is required | 1 byte |
2964:### 11.2 Cache Schemas
2966:#### D7.1 MetaTagCache
2973:#### D7.2 ContentAnalysisCache
3132:**Rollback Procedure:** disable `FEATURE_SEO_META_TAGS` to immediately revert to fallback templates while jobs continue in shadow mode for diagnostics.
3139:## 14. Acceptance Criteria
3143:| AC-1 | Every public channel page serves non-empty `<title>` and `<meta name="description">` tags. | E2E crawler test |
3144:| AC-2 | Auto-generated title length is <=60 characters; auto-generated description is 50-160 characters. | Unit tests (`TitleGenerator`, `DescriptionGenerator`) |
3145:| AC-3 | Effective override limits are enforced (`customTitle <=70`, `customDescription <=200`). | API validation test (`PUT /meta-tags`) |
3146:| AC-4 | `onVisibilityChanged` handling of `VISIBILITY_CHANGED(newVisibility=PRIVATE)` invalidates cache and removes sitemap URL. | Integration test |
3147:| AC-5 | Regeneration API returns `jobId` and supports status polling to terminal states (`succeeded`/`failed`). | API integration test |
3148:| AC-6 | Idempotency key deduplicates repeated regenerate requests within 60 seconds. | API integration test |
3149:| AC-7 | Custom overrides are never overwritten by background regeneration. | Integration test with queued jobs |
3150:| AC-8 | Generated tags exclude PII and profanity for fixture content. | Security/content filter tests |
3151:| AC-9 | On NLP failure/timeout, fallback tags are returned and `needs_regeneration=true` is persisted. | Fault-injection unit/integration test |
3152:| AC-10 | De-index workflow executes when channel visibility changes from public to private. | End-to-end visibility transition test |
3195:  "url": "{canonicalUrl}",
```

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json headRefOid,body,reviewDecision,mergeStateStatus
```

Output:

```text
{"body":"## Summary\n\n- Implements CL-C2.1–C2.6 per dev spec §3/§4 under `harmony-backend/src/services/metaTag/`\n- `MetaTagService` — facade with spec-aligned stubs for `generateMetaTags`, `getOrGenerateCached`, `scheduleRegeneration`, `getRegenerationJobStatus`, `getMetaTagsForPreview`, and context-based helpers for unit testing; full wiring by M4 (issue #356)\n- `TitleGenerator` — enforces ≤60 char limit with HTML sanitization and template application (AC-2)\n- `DescriptionGenerator` — enforces 50–160 char range; spec-aligned `extractKeyPhrases(content, maxPhrases)` and `summarizeThread(messages)` signatures; channel context handled in `generateFromMessages` (AC-2)\n- `OpenGraphGenerator` — spec-aligned `generateOGTags(channel, server, analysis)`, `generateTwitterCard(channel, server, analysis, image?)`, `selectPreviewImage(channel, messages): string | null`; Twitter card defaults to `summary`, upgrades to `summary_large_image` only when a non-default image is present\n- `StructuredDataGenerator` — spec-aligned `generateDiscussionForum(channel, messages, server)`, `generateBreadcrumbList(server, channel)`, `generateOrganization(server)`, `generateWebPage(channel, metaTags)`; `datePublished`/`author`/`dateModified` stub fields present for downstream consumers; `BASE_URL` env var used throughout\n- `MetaTagCache` — Redis-backed via existing `cacheService` + `CacheKeys.metaChannel` with configurable TTL (default 3600s per spec D7.1); fallback tags (`needsRegeneration: true`) are never written to cache to prevent transient failures from poisoning the cache for the full TTL\n- `MetaTagJobStatus` — includes `errorCode: string | null` and `errorMessage: string | null` per OpenAPI schema\n- `ChannelContext` — includes `visibility?: ChannelVisibility`; robots directive derived from visibility (`PUBLIC_INDEXABLE` → `index, follow`, `PUBLIC_NO_INDEX` → `noindex, follow`, `PRIVATE` → `noindex, nofollow`)\n- `buildCanonicalUrl` — slug segments encoded with `encodeURIComponent` to prevent reserved characters from producing invalid canonical links\n- AC-9 fallback: on any generation error, `MetaTagService` returns channel-name-based fallback tags with `needsRegeneration: true`\n- 37 unit tests covering AC items, visibility→robots mapping, URL encoding, and cache-fallback regression\n\n## Test plan\n\n- [x] All 37 unit tests pass (`npx jest tests/metaTagService.test.ts`)\n- [x] No regressions in existing test suite (687 tests pass, including `metaTag.repository.test.ts`)\n- [x] TypeScript compiles cleanly (`tsc --noEmit`)\n- [x] ESLint passes (no errors)\n\nCloses #350\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","headRefOid":"b5a5950f129a9aa73b77045e0c827a140b466ffb","mergeStateStatus":"BLOCKED","reviewDecision":"CHANGES_REQUESTED"}
```

#### Tool: exec_command

```sh
gh pr checks 443 --repo CS485-Harmony/Harmony
```

Output:

```text
Backend Lint and Build	pass	24s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032055/job/72383949876	
Frontend Lint and Build	pass	40s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032055/job/72383949891	
Run Backend Tests	pass	1m24s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032119/job/72383949744	
Run Frontend Tests	pass	26s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032042/job/72383949773	
Run Integration Tests	pass	1m57s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032066/job/72383950027	
Vercel Preview Comments	pass	0	https://vercel.com/github	
Run Cloud Integration Tests	skipping	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24742032066/job/72383950763	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/6b69yo8VZiRYhNx2VLxvKxw5EsJu	Deployment has completed
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:31:40.548Z

I’m reading the spec’s exact method and DTO sections now to make sure the posted finding is complete and not missing a larger contract issue.

#### Tool: exec_command

```sh
sed -n '1999,2178p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
#### 9.1.1 CL-C2.1 MetaTagService

**Public Methods:**

```typescript
// Generate complete meta tag set for a channel
generateMetaTags(
  channelId: string,
  options?: {
    forceRegenerate?: boolean,
    includeStructuredData?: boolean
  }
): Promise<MetaTagSet>

// Get meta tags with caching
getOrGenerateCached(
  channelId: string
): Promise<MetaTagSet>

// Invalidate cached meta tags
invalidateCache(
  channelId: string
): Promise<void>

// Schedule background regeneration
scheduleRegeneration(
  channelId: string,
  priority?: 'high' | 'normal' | 'low',
  idempotencyKey?: string
): Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>

// Get meta tags for admin preview
getMetaTagsForPreview(
  channelId: string
): Promise<MetaTagPreview>

// Poll status for a regeneration job
getRegenerationJobStatus(
  channelId: string,
  jobId: string
): Promise<MetaTagJobStatus>
```

**Generation and Override Rules:**
- Auto-generated values target SEO limits (`title <= 60`, `description <= 160`).
- Admin overrides (`custom_title`, `custom_description`, `custom_og_image`) always take precedence over generated values when present.
- Background regeneration updates generated fields only and must not overwrite custom override fields.
- If NLP analysis fails or times out (>5s), generation falls back to channel/topic-based tags and marks `needs_regeneration=true`.

#### 9.1.2 CL-C2.2 TitleGenerator

**Public Methods:**

```typescript
// Generate title from channel data
generateFromChannel(
  channel: Channel,
  server: Server
): string

// Generate title for specific message deep link
generateFromMessage(
  message: Message,
  channel: Channel
): string

// Generate title for thread view
generateFromThread(
  messages: Message[],
  channel: Channel
): string
```

**Private Methods:**

```typescript
private truncateWithEllipsis(
  text: string,
  maxLength: number
): string

private sanitizeForTitle(
  text: string
): string

private applyTemplate(
  template: string,
  data: TitleData
): string
```

**Length Policy:** `TitleGenerator` output is capped at 60 characters. Longer admin overrides are allowed via `MetaTagOverride.customTitle` (max 70).

#### 9.1.3 CL-C2.3 DescriptionGenerator

**Public Methods:**

```typescript
// Generate description from messages
generateFromMessages(
  messages: Message[],
  channel: Channel
): string

// Extract key phrases for description
extractKeyPhrases(
  content: string,
  maxPhrases: number
): string[]

// Summarize thread for description
summarizeThread(
  messages: Message[]
): string
```

**Length Policy:** `DescriptionGenerator` output is capped at 160 characters. Longer admin overrides are allowed via `MetaTagOverride.customDescription` (max 200).

#### 9.1.4 CL-C2.4 OpenGraphGenerator

**Public Methods:**

```typescript
// Generate Open Graph tags
generateOGTags(
  channel: Channel,
  server: Server,
  analysis: ContentAnalysis
): OpenGraphTags

// Generate Twitter Card tags
generateTwitterCard(
  channel: Channel,
  server: Server,
  analysis: ContentAnalysis
): TwitterCardTags

// Select best preview image
selectPreviewImage(
  channel: Channel,
  messages: Message[]
): string | null
```

**Twitter Card Rule:** default to `summary`; switch to `summary_large_image` only when a valid large preview image is available.

#### 9.1.5 CL-C2.5 StructuredDataGenerator

**Public Methods:**

```typescript
// Generate DiscussionForumPosting schema
generateDiscussionForum(
  channel: Channel,
  messages: Message[],
  server: Server
): StructuredData

// Generate BreadcrumbList schema
generateBreadcrumbList(
  server: Server,
  channel: Channel
): StructuredData

// Generate Organization schema
generateOrganization(
  server: Server
): StructuredData

// Generate WebPage schema
generateWebPage(
  channel: Channel,
  metaTags: MetaTagSet
): StructuredData
```

### 9.2 Module M3: Content Analysis

#### 9.2.1 CL-C3.1 ContentAnalyzer
````

#### Tool: exec_command

```sh
sed -n '2437,2508p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
#### 9.5.1 CL-D1 MetaTagSet

```typescript
interface MetaTagSet {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: OpenGraphTags;
  twitter: TwitterCardTags;
  structuredData: JSON;
  keywords: string[];
}
```

#### 9.5.2 CL-D2 OpenGraphTags

```typescript
interface OpenGraphTags {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  ogSiteName: string;
}
```

#### 9.5.3 CL-D3 TwitterCardTags

```typescript
interface TwitterCardTags {
  card: string;
  title: string;
  description: string;
  image: string;
  site: string;
}
```

#### 9.5.4 CL-D4 StructuredData

```typescript
interface StructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: Person;
  datePublished: string;
  dateModified: string;
  mainEntity: object;
  breadcrumb: object;
}
```

#### 9.5.5 CL-D5 ContentAnalysis

```typescript
interface ContentAnalysis {
  keywords: string[];
  topics: string[];
  summary: string;
  sentiment: string;
  readingLevel: string;
}
```

### 9.6 Domain Entities

#### 9.6.1 CL-E1 Channel
````

#### Tool: exec_command

```sh
sed -n '2964,2985p' docs/dev-spec-seo-meta-tag-generation.md && sed -n '3139,3152p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

```text
### 11.2 Cache Schemas

#### D7.1 MetaTagCache

**Key Pattern:** `meta:channel:{channelId}`
**Value Type:** JSON serialized MetaTagSet
**TTL:** 3600 seconds (1 hour)
**Size:** ~2 KB per entry

#### D7.2 ContentAnalysisCache

**Key Pattern:** `analysis:channel:{channelId}`
**Value Type:** JSON serialized ContentAnalysis
**TTL:** 1800 seconds (30 minutes)
**Size:** ~500 bytes per entry

### 11.3 Job Queue Schema

#### D8.1 MetaTagUpdateQueue

**Queue Name:** `meta-tag-updates`
**Job Data:**
## 14. Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1 | Every public channel page serves non-empty `<title>` and `<meta name="description">` tags. | E2E crawler test |
| AC-2 | Auto-generated title length is <=60 characters; auto-generated description is 50-160 characters. | Unit tests (`TitleGenerator`, `DescriptionGenerator`) |
| AC-3 | Effective override limits are enforced (`customTitle <=70`, `customDescription <=200`). | API validation test (`PUT /meta-tags`) |
| AC-4 | `onVisibilityChanged` handling of `VISIBILITY_CHANGED(newVisibility=PRIVATE)` invalidates cache and removes sitemap URL. | Integration test |
| AC-5 | Regeneration API returns `jobId` and supports status polling to terminal states (`succeeded`/`failed`). | API integration test |
| AC-6 | Idempotency key deduplicates repeated regenerate requests within 60 seconds. | API integration test |
| AC-7 | Custom overrides are never overwritten by background regeneration. | Integration test with queued jobs |
| AC-8 | Generated tags exclude PII and profanity for fixture content. | Security/content filter tests |
| AC-9 | On NLP failure/timeout, fallback tags are returned and `needs_regeneration=true` is persisted. | Fault-injection unit/integration test |
| AC-10 | De-index workflow executes when channel visibility changes from public to private. | End-to-end visibility transition test |
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/descriptionGenerator.ts | nl -ba | sed -n '1,130p'; git show pr-443:harmony-backend/src/services/metaTag/openGraphGenerator.ts | nl -ba | sed -n '1,100p'
```

Output:

```text
     1	// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
     2	import type { MessageContext, ChannelContext, MetaTagSet, IMetaTagGenerator } from './types';
     3	
     4	const MAX_LENGTH = 160;
     5	const MIN_LENGTH = 50;
     6	
     7	export const DescriptionGenerator: IMetaTagGenerator & {
     8	  maxLength: number;
     9	  minLength: number;
    10	  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string;
    11	  extractKeyPhrases(content: string, maxPhrases: number): string[];
    12	  sanitizeText(text: string): string;
    13	  summarizeThread(messages: MessageContext[]): string;
    14	  enforceLength(text: string): string;
    15	} = {
    16	  maxLength: MAX_LENGTH,
    17	  minLength: MIN_LENGTH,
    18	
    19	  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
    20	    const serverName = this.sanitizeText(channel.serverName);
    21	    const channelName = this.sanitizeText(channel.name);
    22	    const suffix = ` — Join the discussion on ${serverName}.`;
    23	
    24	    if (messages.length === 0) {
    25	      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;
    26	      return this.enforceLength(base);
    27	    }
    28	
    29	    const summary = this.summarizeThread(messages);
    30	    const prefix = `${serverName} › #${channelName}: `;
    31	    let text = prefix + summary;
    32	
    33	    if (text.length < MIN_LENGTH) {
    34	      text = text + suffix;
    35	    }
    36	
    37	    return this.enforceLength(text);
    38	  },
    39	
    40	  // Spec: extractKeyPhrases(content: string, maxPhrases: number): string[]
    41	  extractKeyPhrases(content: string, maxPhrases: number): string[] {
    42	    const words = content
    43	      .toLowerCase()
    44	      .replace(/<[^>]*>/g, '')
    45	      .replace(/[^a-z0-9\s]/g, ' ')
    46	      .split(/\s+/)
    47	      .filter((w) => w.length > 3);
    48	
    49	    const freq = new Map<string, number>();
    50	    for (const word of words) {
    51	      freq.set(word, (freq.get(word) ?? 0) + 1);
    52	    }
    53	
    54	    return [...freq.entries()]
    55	      .sort((a, b) => b[1] - a[1])
    56	      .slice(0, maxPhrases)
    57	      .map(([word]) => word);
    58	  },
    59	
    60	  sanitizeText(text: string): string {
    61	    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    62	  },
    63	
    64	  // Spec: summarizeThread(messages: Message[]): string — channel context handled by generateFromMessages
    65	  summarizeThread(messages: MessageContext[]): string {
    66	    if (messages.length === 0) return '';
    67	    return this.sanitizeText(messages[0].content);
    68	  },
    69	
    70	  enforceLength(text: string): string {
    71	    let result = text;
    72	
    73	    if (result.length < MIN_LENGTH) {
    74	      const additions = [
    75	        ' Join the discussion.',
    76	        ' Explore the latest updates.',
    77	        ' Connect with the community.',
    78	      ];
    79	      let i = 0;
    80	      while (result.length < MIN_LENGTH) {
    81	        result += additions[i % additions.length];
    82	        i++;
    83	      }
    84	    }
    85	
    86	    if (result.length > MAX_LENGTH) {
    87	      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
    88	    }
    89	    return result;
    90	  },
    91	
    92	  // CL-I1 stubs — full generate/validate wired by M4
    93	  generate(): MetaTagSet {
    94	    throw new Error('DescriptionGenerator.generate() not yet implemented — wired by M4');
    95	  },
    96	  validate(): boolean {
    97	    throw new Error('DescriptionGenerator.validate() not yet implemented — wired by M4');
    98	  },
    99	};
     1	// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
     2	import type { ChannelContext, OpenGraphTags, TwitterCardTags, MetaTagSet, IMetaTagGenerator, ContentAnalysis } from './types';
     3	
     4	const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
     5	const SITE_NAME = 'Harmony';
     6	const TWITTER_SITE = '@harmonychat';
     7	
     8	export const OpenGraphGenerator: IMetaTagGenerator & {
     9	  defaultImage: string;
    10	  // Spec §9.1.4: generateOGTags(channel, server, analysis)
    11	  generateOGTags(channel: ChannelContext, server: unknown, analysis: ContentAnalysis): OpenGraphTags;
    12	  // Spec §9.1.4: generateTwitterCard(channel, server, analysis)
    13	  generateTwitterCard(channel: ChannelContext, server: unknown, analysis: ContentAnalysis, image?: string): TwitterCardTags;
    14	  // Spec §9.1.4: selectPreviewImage(channel, messages): string | null
    15	  selectPreviewImage(channel: ChannelContext, messages: unknown[]): string | null;
    16	} = {
    17	  defaultImage: DEFAULT_IMAGE,
    18	
    19	  // M2 skeleton: title from analysis.topics[0], description from analysis.summary; full NLP integration by M4
    20	  generateOGTags(channel: ChannelContext, _server: unknown, analysis: ContentAnalysis): OpenGraphTags {
    21	    return {
    22	      ogTitle: analysis.topics[0] ?? channel.name,
    23	      ogDescription: analysis.summary,
    24	      ogImage: OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE,
    25	      ogType: 'website',
    26	      ogUrl: channel.canonicalUrl,
    27	      ogSiteName: SITE_NAME,
    28	    };
    29	  },
    30	
    31	  generateTwitterCard(
    32	    channel: ChannelContext,
    33	    _server: unknown,
    34	    analysis: ContentAnalysis,
    35	    image?: string,
    36	  ): TwitterCardTags {
    37	    const resolvedImage = image ?? OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE;
    38	    const isCustomImage = resolvedImage !== DEFAULT_IMAGE;
    39	    return {
    40	      card: isCustomImage ? 'summary_large_image' : 'summary',
    41	      title: analysis.topics[0] ?? channel.name,
    42	      description: analysis.summary,
    43	      image: resolvedImage,
    44	      site: TWITTER_SITE,
    45	    };
    46	  },
    47	
    48	  // M2 skeleton: always returns default image; real selection by M4 (messages/channel avatars)
    49	  selectPreviewImage(_channel: ChannelContext, _messages: unknown[]): string | null {
    50	    return DEFAULT_IMAGE;
    51	  },
    52	
    53	  // CL-I1 stubs — full generate/validate wired by M4
    54	  generate(): MetaTagSet {
    55	    throw new Error('OpenGraphGenerator.generate() not yet implemented — wired by M4');
    56	  },
    57	  validate(): boolean {
    58	    throw new Error('OpenGraphGenerator.validate() not yet implemented — wired by M4');
    59	  },
    60	};
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:31:54.623Z

The spec cross-check found that the existing breadcrumb URL finding is documentation-aligned, and there is one more contract drift: the spec says the structured-data generator methods return `StructuredData`, but this PR exposes some of them as plain `object`. I’m posting a concise follow-up bundled review so that is captured on the PR.

#### Tool: exec_command

````sh
cat >/tmp/review443-spec-followup.md <<'EOF'
## PR Review Checklist

- [ ] **1. Logic over Style** — Cross-checking against `docs/dev-spec-seo-meta-tag-generation.md` found one remaining contract mismatch in addition to the breadcrumb URL encoding gap: some structured-data methods expose `object` instead of the spec’s `StructuredData` return type.
- [x] **2. Security First** — No new security issue found in this spec pass.
- [ ] **3. Architectural Alignment** — `StructuredDataGenerator` should match §9.1.5 method contracts, and breadcrumb URL construction should follow the same encoded segment policy as canonical/sitemap URLs.
- [x] **4. Issue Completion** — The stale PR-description note about `metaTag.repository.test.ts` has been removed and the description now aligns with the current test status.
- [x] **5. No Nitpicking** — These are API-contract and generated-URL correctness issues.
- [x] **6. Avoid Repetition** — This adds the explicit spec-return-type issue from §9.1.5; the breadcrumb encoding item is the same remaining URL issue from the latest review.
- [x] **7. Iterative Reviews** — Re-reviewed latest head `b5a5950` directly against `docs/dev-spec-seo-meta-tag-generation.md`.
- [x] **8. Prevent CI Failures** — Current checks are green; these are contract/behavior gaps not currently covered by CI.

## Review (Request changes)

I cross-checked the latest head against `docs/dev-spec-seo-meta-tag-generation.md`. Most of the previously flagged contracts are now aligned: `MetaTagService` stubs, `DescriptionGenerator`, `OpenGraphGenerator`, `MetaTagJobStatus`, visibility-derived robots, cache fallback behavior, and the PR description/test-plan wording all look consistent with the spec.

Two spec-alignment issues remain:

1. **`StructuredDataGenerator` return types drift from §9.1.5.** The spec declares all four public methods as returning `StructuredData`, including `generateBreadcrumbList(server, channel): StructuredData` and `generateOrganization(server): StructuredData`. The PR currently exposes those two as `object`. Even if the skeleton implementation is minimal, the exported method signatures should match the spec contract now so M4 wiring does not need a breaking type change later.

2. **`generateBreadcrumbList()` still uses a raw `serverSlug` in its `item` URL.** The spec uses canonical crawler-facing URLs, and the existing sitemap code plus the new `buildCanonicalUrl()` fix both encode slug path segments. Breadcrumb structured-data URLs should do the same:

```ts
item: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,
```

Please align the structured-data method signatures to §9.1.5 and add the breadcrumb slug-encoding regression test alongside the canonical URL encoding test.
EOF

gh pr review 443 --repo CS485-Harmony/Harmony --request-changes --body-file /tmp/review443-spec-followup.md
````

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:32:11.303Z

The spec-alignment follow-up review is posted. I’m verifying it landed on GitHub.

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls/443/reviews | jq 'map({id,user:.user.login,state,submitted_at,commit_id,body})[-2:]'
```

Output:

````text
[
  {
    "id": 4150307918,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-21T19:30:59Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — The prior robots and canonical helper issues are fixed, but `generateBreadcrumbList()` still builds the server breadcrumb URL with a raw `serverSlug`, so reserved characters can still produce invalid/misparsed structured-data URLs.\n- [x] **2. Security First** — I did not find a new security issue in the latest code changes.\n- [ ] **3. Architectural Alignment** — Breadcrumb URL generation should follow the same encoded path-segment behavior now used by `buildCanonicalUrl()` and the existing sitemap generator.\n- [x] **4. Issue Completion** — The PR description has been updated correctly: the stale “pre-existing `metaTag.repository.test.ts` failure” note is gone, and the test plan now says the repository test passes.\n- [x] **5. No Nitpicking** — This is a concrete URL correctness issue in generated JSON-LD, not style feedback.\n- [x] **6. Avoid Repetition** — I am not repeating resolved comments about robots or `buildCanonicalUrl()`; both are fixed in `b5a5950`.\n- [x] **7. Iterative Reviews** — Re-reviewed latest head `b5a5950`; previous blockers are addressed except for the related breadcrumb URL path.\n- [x] **8. Prevent CI Failures** — Current GitHub checks are green; this remaining issue is a behavioral gap not covered by CI.\n\n## Review (Request changes)\n\nThe latest push fixed the previous blockers:\n\n- `ChannelContext.visibility` now drives `robots` correctly for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`.\n- `buildCanonicalUrl()` now encodes both slug path segments.\n- The stale PR-description note about `tests/metaTag.repository.test.ts` failing has been removed; the description now says the repository test passes, which matches the current schema state.\n\nOne related URL issue remains:\n\n### Encode `serverSlug` in breadcrumb structured data\n**File:** `harmony-backend/src/services/metaTag/structuredDataGenerator.ts:26-37`\n\n`generateBreadcrumbList()` still emits the first breadcrumb item as:\n\n```ts\nitem: `${BASE_URL}/s/${channel.serverSlug}`,\n```\n\nThe same slug validation concern applies here as it did to `buildCanonicalUrl()`: channel/server slug inputs are not restricted to URL-safe characters, and the repo’s sitemap generator already uses `encodeURIComponent` for slug path segments. If `serverSlug` contains a space, `?`, `#`, `/`, or `&`, this JSON-LD URL can become invalid or point to the wrong path/query/fragment.\n\nPlease encode the breadcrumb path segment too, e.g.:\n\n```ts\nitem: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,\n```\n\nand add a small test alongside the canonical URL encoding test.\n"
  },
  {
    "id": 4150313187,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-21T19:32:07Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — Cross-checking against `docs/dev-spec-seo-meta-tag-generation.md` found one remaining contract mismatch in addition to the breadcrumb URL encoding gap: some structured-data methods expose `object` instead of the spec’s `StructuredData` return type.\n- [x] **2. Security First** — No new security issue found in this spec pass.\n- [ ] **3. Architectural Alignment** — `StructuredDataGenerator` should match §9.1.5 method contracts, and breadcrumb URL construction should follow the same encoded segment policy as canonical/sitemap URLs.\n- [x] **4. Issue Completion** — The stale PR-description note about `metaTag.repository.test.ts` has been removed and the description now aligns with the current test status.\n- [x] **5. No Nitpicking** — These are API-contract and generated-URL correctness issues.\n- [x] **6. Avoid Repetition** — This adds the explicit spec-return-type issue from §9.1.5; the breadcrumb encoding item is the same remaining URL issue from the latest review.\n- [x] **7. Iterative Reviews** — Re-reviewed latest head `b5a5950` directly against `docs/dev-spec-seo-meta-tag-generation.md`.\n- [x] **8. Prevent CI Failures** — Current checks are green; these are contract/behavior gaps not currently covered by CI.\n\n## Review (Request changes)\n\nI cross-checked the latest head against `docs/dev-spec-seo-meta-tag-generation.md`. Most of the previously flagged contracts are now aligned: `MetaTagService` stubs, `DescriptionGenerator`, `OpenGraphGenerator`, `MetaTagJobStatus`, visibility-derived robots, cache fallback behavior, and the PR description/test-plan wording all look consistent with the spec.\n\nTwo spec-alignment issues remain:\n\n1. **`StructuredDataGenerator` return types drift from §9.1.5.** The spec declares all four public methods as returning `StructuredData`, including `generateBreadcrumbList(server, channel): StructuredData` and `generateOrganization(server): StructuredData`. The PR currently exposes those two as `object`. Even if the skeleton implementation is minimal, the exported method signatures should match the spec contract now so M4 wiring does not need a breaking type change later.\n\n2. **`generateBreadcrumbList()` still uses a raw `serverSlug` in its `item` URL.** The spec uses canonical crawler-facing URLs, and the existing sitemap code plus the new `buildCanonicalUrl()` fix both encode slug path segments. Breadcrumb structured-data URLs should do the same:\n\n```ts\nitem: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,\n```\n\nPlease align the structured-data method signatures to §9.1.5 and add the breadcrumb slug-encoding regression test alongside the canonical URL encoding test.\n"
  }
]
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:32:20.887Z

I cross-checked latest head `b5a5950` against `docs/dev-spec-seo-meta-tag-generation.md` and posted a follow-up `REQUEST_CHANGES` review.

Spec alignment status:
- Aligned now: `MetaTagService` stubs, `DescriptionGenerator`, `OpenGraphGenerator`, `MetaTagJobStatus`, visibility-derived `robots`, cache fallback behavior, and the updated PR description/test plan.
- Still not aligned: `StructuredDataGenerator.generateBreadcrumbList()` and `generateOrganization()` return `object`, while §9.1.5 declares `StructuredData`.
- Still not aligned: `generateBreadcrumbList()` uses raw `channel.serverSlug` in its URL; it should encode the slug path segment like the sitemap and `buildCanonicalUrl()` do.

<oai-mem-citation>
<citation_entries>
MEMORY.md:234-234|note=[used Harmony review workflow reminder to post checklist and bundled review]
MEMORY.md:155-157|note=[used Harmony PR review workflow memory entry for repo-specific review process]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>

### Turn 8: review

#### 👤 User Prompt

- Time: 2026-04-21T19:35:10.953Z

```text
review again
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:35:20.915Z

Re-reviewing PR #443 at the latest head. I’ll verify the author addressed the structured-data return types and breadcrumb URL encoding, check the current spec alignment and CI, then post the required bundled review decision.

#### Tool: exec_command

```sh
sed -n '1,220p' WORKFLOW.md
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
sed -n '1,260p' .github/PR_REVIEW.md
```

Output:

```text
# PR Review Guidelines

When conducting PR Reviews, follow these guidelines:
1. **Prioritize Logic over Style:** Ensure the code is efficient, DRY (Don't Repeat Yourself), and logically sound.
2. **Security First:** Verify that the changes do not introduce vulnerabilities (e.g., lack of input validation, exposed secrets).
3. **Architectural Alignment:** If applicable, ensure the changes adhere strictly to the patterns defined in `@../docs/unified-backend-architecture.md`.
4. **Issue Completion:** If the PR is attached to an issue, verify that the code successfully satisfies every acceptance criteria of that issue.
5. **No Nitpicking:** Do not leave comments regarding stylistic choices, formatting, or subjective naming conventions unless they violate core project readability. Focus only on critical logic, performance, or architectural flaws.
6. **Avoid Repetition:** Do not repeat feedback that has already been stated in previous reviews on this PR.
7. **Iterative Reviews:** If this is not your first review on the PR:
    - First, check if the new commits have correctly addressed your previous review comments.
    - If a previous concern has been addressed, explicitly resolve the associated comment.
8. **Prevent CI Failures:** Analyze the code for obvious issues that would break the pipeline. Specifically check for syntax errors, missing imports/dependencies, unhandled exceptions, and logic that would clearly break existing tests.

**Execution Instruction**: Before providing your code feedback, output a markdown checklist of the 8 guidelines above. Mark each one as [x] if it passes or [ ] if it fails, and briefly explain why. Then, provide your single bundled review. Use inline subcomments within that single review for specific lines of codes. Do not post multiple standalone comments.
```

#### Tool: exec_command

```sh
rg -n "Harmony PR review|PR review workflow" /Users/allen/.codex/memories/MEMORY.md
```

Output:

```text
155:# Task Group: Harmony PR review and review-resolution workflow
157:applies_to: cwd=/Users/allen/.codex/worktrees/*/Harmony; reuse_rule=safe for Harmony PR review tasks that follow the repo's `WORKFLOW.md` and `.github/PR_REVIEW.md`; verify current remote/worktree before assuming repo names or branch refs.
189:- Harmony PR review, .github/PR_REVIEW.md, WORKFLOW.md, bundled review, single bundled review, checklist of 8 guidelines, gh pr view, gh pr diff, gh pr review, gh api, file_comments expected objects not strings, acabrera04/Harmony, EmptyShell, VoiceProvider, system admin bypass, useChannelEvents, useServerEvents, SSE reconnect
234:- In Harmony PR reviews, load `WORKFLOW.md` and `.github/PR_REVIEW.md` first. The durable pattern is checklist first, then one bundled review with line-specific findings or a clear approval if the updated head is good [Task 1][Task 2][Task 3][Task 4][Task 6]
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:35:30.179Z

The required review rules are loaded and the worktree is clean. I’m fetching the latest PR metadata, unresolved threads, and CI status now.

#### Tool: exec_command

```sh
git fetch origin main pull/443/head:pr-443 --force
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            main               -> FETCH_HEAD
   b5a5950..3bb2ff7  refs/pull/443/head -> pr-443
```

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json number,title,body,headRefName,baseRefName,headRefOid,reviewDecision,mergeStateStatus,commits,files
```

Output:

```text
{"baseRefName":"main","body":"## Summary\n\n- Implements CL-C2.1–C2.6 per dev spec §3/§4 under `harmony-backend/src/services/metaTag/`\n- `MetaTagService` — facade with spec-aligned stubs for `generateMetaTags`, `getOrGenerateCached`, `scheduleRegeneration`, `getRegenerationJobStatus`, `getMetaTagsForPreview`, and context-based helpers for unit testing; full wiring by M4 (issue #356)\n- `TitleGenerator` — enforces ≤60 char limit with HTML sanitization and template application (AC-2)\n- `DescriptionGenerator` — enforces 50–160 char range; spec-aligned `extractKeyPhrases(content, maxPhrases)` and `summarizeThread(messages)` signatures; channel context handled in `generateFromMessages` (AC-2)\n- `OpenGraphGenerator` — spec-aligned `generateOGTags(channel, server, analysis)`, `generateTwitterCard(channel, server, analysis, image?)`, `selectPreviewImage(channel, messages): string | null`; Twitter card defaults to `summary`, upgrades to `summary_large_image` only when a non-default image is present\n- `StructuredDataGenerator` — spec-aligned `generateDiscussionForum(channel, messages, server)`, `generateBreadcrumbList(server, channel)`, `generateOrganization(server)`, `generateWebPage(channel, metaTags)`; `datePublished`/`author`/`dateModified` stub fields present for downstream consumers; `BASE_URL` env var used throughout\n- `MetaTagCache` — Redis-backed via existing `cacheService` + `CacheKeys.metaChannel` with configurable TTL (default 3600s per spec D7.1); fallback tags (`needsRegeneration: true`) are never written to cache to prevent transient failures from poisoning the cache for the full TTL\n- `MetaTagJobStatus` — includes `errorCode: string | null` and `errorMessage: string | null` per OpenAPI schema\n- `ChannelContext` — includes `visibility?: ChannelVisibility`; robots directive derived from visibility (`PUBLIC_INDEXABLE` → `index, follow`, `PUBLIC_NO_INDEX` → `noindex, follow`, `PRIVATE` → `noindex, nofollow`)\n- `buildCanonicalUrl` — slug segments encoded with `encodeURIComponent` to prevent reserved characters from producing invalid canonical links\n- AC-9 fallback: on any generation error, `MetaTagService` returns channel-name-based fallback tags with `needsRegeneration: true`\n- 37 unit tests covering AC items, visibility→robots mapping, URL encoding, and cache-fallback regression\n\n## Test plan\n\n- [x] All 37 unit tests pass (`npx jest tests/metaTagService.test.ts`)\n- [x] No regressions in existing test suite (687 tests pass, including `metaTag.repository.test.ts`)\n- [x] TypeScript compiles cleanly (`tsc --noEmit`)\n- [x] ESLint passes (no errors)\n\nCloses #350\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","commits":[{"authoredDate":"2026-04-20T13:39:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:39:37Z","messageBody":"…350)\n\nAdds CL-C2.1–C2.6 per dev spec §3/§4:\n- MetaTagService facade with generateMetaTags, getOrGenerateCached,\n  invalidateCache, and stub scheduleRegeneration/getRegenerationJobStatus\n- TitleGenerator enforcing ≤60 char limit with sanitization and templates\n- DescriptionGenerator enforcing 50–160 char range with key phrase extraction\n- OpenGraphGenerator and StructuredDataGenerator (skeleton implementations)\n- MetaTagCache backed by Redis via existing cacheService + CacheKeys.metaChannel\n- AC-9: fallback tags with needsRegeneration=true on generation failure\n- 28 unit tests covering AC-2 length limits, sanitization, cache, and fallback\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat(seo): implement M2 meta tag generation service skeleton (issue #…","oid":"e8875f5e9ef5220b017e4b2e855d8d576a8a0713"},{"authoredDate":"2026-04-20T13:42:00Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:42:00Z","messageBody":"Extends summarizeThread to append channel context when the composed\ntext falls below the 50-char minimum, satisfying AC-2 for all inputs\nincluding single-word messages. Adds a regression test.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix(seo): enforce 50-char minimum on auto-generated descriptions (AC-2)","oid":"898f94332cbe35434ecf4661c778ccb07927f1f0"},{"authoredDate":"2026-04-20T13:43:04Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T13:43:04Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"94fa035019a4c79638d269724697d5433e7563bc"},{"authoredDate":"2026-04-20T14:27:39Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T14:27:39Z","messageBody":"- titleGenerator: sanitize full composed string in generateFromMessage;\n  use replaceAll in applyTemplate to handle repeated placeholders\n- descriptionGenerator: add sanitizeText helper; sanitize channel fields\n  in summarizeThread; enforce 50-char minimum in enforceLength (AC-2)\n- openGraphGenerator: add channel param to generateTwitterCard; use\n  summary_large_image only when a real preview image is available\n- structuredDataGenerator: use BASE_URL env var in generateBreadcrumbList;\n  add stub datePublished/author fields to generateDiscussionForum\n- metaTagCache: make set() use this.ttl as single source of truth\n- metaTagService: sanitize channel context in buildFallbackTags; rename\n  internal methods to generateMetaTagsFromContext / getOrGenerateCachedFromContext;\n  add spec-aligned stub signatures for generateMetaTags(channelId),\n  getOrGenerateCached(channelId), getMetaTagsForPreview(channelId);\n  fix scheduleRegeneration return type and getRegenerationJobStatus signature\n- types: add MetaTagPreview and MetaTagJobStatus interfaces per spec\n- regenerate Prisma client; apply add_meta_tag_overrides migration so\n  metaTag.repository tests compile and pass\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings for M2 meta tag service skeleton","oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"authoredDate":"2026-04-20T16:26:29Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T16:26:29Z","messageBody":"… stubs, scheduleRegeneration return)\n\n- Replace this.generateMetaTagsFromContext with metaTagService.* to avoid destructuring hazard\n- Replace this.ttl with DEFAULT_TTL in MetaTagCache.set to avoid destructuring hazard\n- Remove extra priority/idempotencyKey fields from scheduleRegeneration return to match declared type\n- Add IMetaTagGenerator generate()/validate() stubs to TitleGenerator, DescriptionGenerator, OpenGraphGenerator (CL-I1)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings (this-binding, IMetaTagGenerator…","oid":"85d862fcc5f85f782368504916607f4eb1e45164"},{"authoredDate":"2026-04-20T16:28:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T16:28:37Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"c3a7a608c10576b751659ca1926be95566392b28"},{"authoredDate":"2026-04-21T19:19:46Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:19:46Z","messageBody":"…k, contract alignment\n\n- Align generator signatures to spec §9.1: extractKeyPhrases(content, maxPhrases),\n  summarizeThread(messages), generateOGTags/generateTwitterCard(channel, server, analysis),\n  selectPreviewImage(channel, messages), generateDiscussionForum(channel, messages, server),\n  generateBreadcrumbList(server, channel), generateOrganization(server),\n  generateWebPage(channel, metaTags)\n- Fix this-binding hazard in OpenGraphGenerator (selectPreviewImage calls)\n- Do not cache fallback tags when needsRegeneration=true — prevents transient failures\n  from poisoning the Redis cache for the full TTL\n- Fix getRegenerationJobStatus: remove | null, throw not-implemented to match spec contract\n- Add errorCode/errorMessage fields to MetaTagJobStatus per spec §9.1 / OpenAPI schema\n- Add regression test: getOrGenerateCachedFromContext must not write to cache on failure\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings — spec signatures, cache fallbac…","oid":"883e71d96e3e7c383767da13cc6331a61b3b074d"},{"authoredDate":"2026-04-21T19:26:04Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:26:04Z","messageBody":"…ents\n\n- Add ChannelVisibility type and optional visibility field to ChannelContext\n- Derive robots directive from visibility: PUBLIC_INDEXABLE → index,follow;\n  PUBLIC_NO_INDEX → noindex,follow; PRIVATE → noindex,nofollow\n- Encode serverSlug and channelSlug with encodeURIComponent in buildCanonicalUrl\n  to prevent reserved characters from producing invalid canonical links\n- Add tests for all three visibility → robots mappings and for URL encoding\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: derive robots from channel visibility, encode canonical URL segm…","oid":"b5a5950f129a9aa73b77045e0c827a140b466ffb"},{"authoredDate":"2026-04-21T19:33:28Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:33:28Z","messageBody":"… serverSlug\n\n- Make StructuredData.headline/description optional and add index signature so\n  BreadcrumbList and Organization objects satisfy the spec §9.1.5 return type\n- Change generateBreadcrumbList and generateOrganization return types from\n  object to StructuredData, matching the spec contract\n- Encode serverSlug with encodeURIComponent in generateBreadcrumbList item URL,\n  consistent with buildCanonicalUrl and the existing sitemap generator\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: align StructuredDataGenerator return types and encode breadcrumb…","oid":"3bb2ff7b8897157f1d64be80739a29833bdee1e5"}],"files":[{"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","additions":99,"deletions":0},{"path":"harmony-backend/src/services/metaTag/metaTagCache.ts","additions":22,"deletions":0},{"path":"harmony-backend/src/services/metaTag/metaTagService.ts","additions":170,"deletions":0},{"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","additions":60,"deletions":0},{"path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","additions":71,"deletions":0},{"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","additions":65,"deletions":0},{"path":"harmony-backend/src/services/metaTag/types.ts","additions":100,"deletions":0},{"path":"harmony-backend/tests/metaTagService.test.ts","additions":325,"deletions":0},{"path":"llm-logs/2026-04-20-094302-session-ce430386.md","additions":784,"deletions":0},{"path":"llm-logs/2026-04-20-122835-session-b13d715d.md","additions":942,"deletions":0}],"headRefName":"feature/issue-350-meta-tag-service-skeleton","headRefOid":"3bb2ff7b8897157f1d64be80739a29833bdee1e5","mergeStateStatus":"BLOCKED","number":443,"reviewDecision":"CHANGES_REQUESTED","title":"feat(seo): M2 meta tag generation service skeleton (issue #350)"}
```

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls/443/reviews | jq 'map({id,user:.user.login,state,submitted_at,commit_id,body})[-8:]'
```

Output:

````text
[
  {
    "id": 4141784490,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:32:29Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — There is still one correctness bug in the cache path: fallback tags produced after a generation failure are cached, so a transient error can poison the channel’s cache with `needsRegeneration=true` output for the full TTL.\n- [ ] **2. Security First** — The PR still includes committed `llm-logs/` session exports. That concern was already raised in an earlier review and remains unresolved.\n- [ ] **3. Architectural Alignment** — `getRegenerationJobStatus` and `MetaTagJobStatus` still diverge from the dev spec contract on the current head.\n- [x] **4. Issue Completion** — The core M2 skeleton is largely in place, but the remaining cache/contract issues mean the issue is not yet ready to merge.\n- [x] **5. No Nitpicking** — Feedback below is limited to correctness and contract alignment.\n- [x] **6. Avoid Repetition** — I’m not rehashing the earlier resolved sanitizer/signature/Twitter-card comments; only remaining problems on the latest head are called out below.\n- [x] **7. Iterative Reviews** — Re-reviewing only the newest commits after the prior requested-changes round.\n- [ ] **8. Prevent CI Failures** — CI is still pending, and the cache-path bug would survive CI anyway because there is no test covering fallback caching behavior.\n\n## Review (Request changes)\n\n### 1. Do not cache fallback tags returned from a generation failure\n**File:** `harmony-backend/src/services/metaTag/metaTagService.ts` (`generateMetaTagsFromContext` at lines 50-77, `getOrGenerateCachedFromContext` at lines 95-105)\n\n`generateMetaTagsFromContext()` catches any exception and returns fallback tags with `needsRegeneration: true`. `getOrGenerateCachedFromContext()` then unconditionally writes that result into Redis:\n\n```ts\nconst tags = await metaTagService.generateMetaTagsFromContext(channel, messages);\nawait MetaTagCache.set(channel.id, tags, ttl);\n```\n\nThat means a transient failure in title/description generation will poison the cache with fallback output for up to an hour. Every later read gets the degraded fallback from cache instead of retrying generation, which defeats the point of marking the payload `needsRegeneration: true`.\n\n**Requested fix:** only cache successful generations (`needsRegeneration !== true`), or use a much shorter/error-specific TTL for fallback payloads. A regression test should cover the failure path so a thrown generator does not result in a long-lived cached fallback.\n\n### 2. `getRegenerationJobStatus` still does not match the published spec contract\n**Files:** `harmony-backend/src/services/metaTag/metaTagService.ts:134-138`, `harmony-backend/src/services/metaTag/types.ts:70-76`, `docs/dev-spec-seo-meta-tag-generation.md:2036-2039`, `docs/dev-spec-seo-meta-tag-generation.md:2828-2848`\n\nThe spec says:\n\n```ts\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\n```\n\nBut the implementation still publishes:\n\n```ts\nasync getRegenerationJobStatus(...): Promise<MetaTagJobStatus | null> {\n  return null;\n}\n```\n\nand the local `MetaTagJobStatus` type is also missing the spec’s `errorCode` and `errorMessage` fields. Since this PR is explicitly trying to land the M2 skeleton with spec-aligned contracts, this is still a breaking mismatch for callers and for any future worker wiring.\n\n**Requested fix:** make the stub signature match the spec exactly. Either return a placeholder `MetaTagJobStatus` object (with the full field set, including nullable `errorCode`/`errorMessage`) or throw a not-implemented error, but don’t ship a `null`-returning API with a narrower DTO than the published contract.\n"
  },
  {
    "id": 4141792373,
    "user": "FardeenI",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-20T16:33:39Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "- [x] **Prioritize Logic over Style:** Focusing on correctness/contract drift (not formatting).\n- [x] **Security First:** No secrets added; sanitization added for user-controlled strings.\n- [ ] **Architectural Alignment:** Several public method signatures still diverge from `docs/dev-spec-seo-meta-tag-generation.md` §9.1.*.\n- [ ] **Issue Completion:** Issue #350 AC requires spec-named signatures; a few are still mismatched.\n- [x] **No Nitpicking:** No style-only feedback.\n- [x] **Avoid Repetition:** Not repeating already-addressed review threads.\n- [x] **Iterative Reviews:** Considered existing review threads before adding new feedback.\n- [x] **Prevent CI Failures:** CI is green; requested changes are contract/spec alignment to prevent future breakage.\n\n---\n\n## Requested changes (actionable)\n\n### 1) Align generator method signatures to the SEO spec (Issue #350 AC)\nRight now the M2 “skeleton” compiles/tests, but several exported method signatures don’t match the spec prototypes in `docs/dev-spec-seo-meta-tag-generation.md` §9.1. That’s likely to cause downstream integration churn when M3/M4 wiring lands.\n\n**`harmony-backend/src/services/metaTag/openGraphGenerator.ts`**\nSpec expects:\n- `generateOGTags(channel: Channel, server: Server, analysis: ContentAnalysis): OpenGraphTags`\n- `generateTwitterCard(channel: Channel, server: Server, analysis: ContentAnalysis): TwitterCardTags`\n- `selectPreviewImage(channel: Channel, messages: Message[]): string | null`\n\nCurrent signatures are `(channel, title, description)` and `selectPreviewImage(channel): string`.\n\n**Suggestion:** keep your current placeholder logic, but change the exported signatures to match spec and adapt callers (e.g. in `MetaTagService`, pass a placeholder `analysis` for now and ignore unused args in the generator).\n\n**`harmony-backend/src/services/metaTag/structuredDataGenerator.ts`**\nSpec expects:\n- `generateDiscussionForum(channel, messages, server)`\n- `generateBreadcrumbList(server, channel)`\n- `generateOrganization(server)`\n- `generateWebPage(channel, metaTags)`\n\nCurrent signatures are `(channel, title, description)` / `(channel)` / `()` / `(channel, title, description)`.\n\n**Suggestion:** change signatures to spec and keep stubs internally (you can still leave `author/datePublished` unset until M4).\n\n**`harmony-backend/src/services/metaTag/descriptionGenerator.ts`**\nSpec expects:\n- `extractKeyPhrases(content: string, maxPhrases: number): string[]`\n- `summarizeThread(messages: Message[]): string`\n\nCurrent `extractKeyPhrases(messages[])` and `summarizeThread(messages, channel)` diverge.\n\n**Suggestion:** add/rename the spec-shaped methods (they can be thin wrappers around your current logic: join messages -> content; keep `maxPhrases` configurable rather than hardcoded to 5).\n\n### 2) Spec return type for `getRegenerationJobStatus`\nIn `harmony-backend/src/services/metaTag/metaTagService.ts`, spec has `Promise<MetaTagJobStatus>`; current stub returns `Promise<MetaTagJobStatus | null>`.\n\n**Suggestion:** for a stub, prefer throwing `not implemented` (or return a placeholder status) to keep the signature aligned.\n\n### 3) (Optional) PR signal/noise\nThis PR includes 2 new `llm-logs/*.md` artifacts. If those are required by process, OK—just noting it makes reviews harder to scan.\n"
  },
  {
    "id": 4150247194,
    "user": "chatgpt-codex-connector[bot]",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:18:02Z",
    "commit_id": "c3a7a608c10576b751659ca1926be95566392b28",
    "body": "\n### 💡 Codex Review\n\nHere are some automated review suggestions for this pull request.\n\n**Reviewed commit:** `c3a7a608c1`\n    \n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment \"@codex review\".\n\nIf Codex has suggestions, it will comment; otherwise it will react with 👍.\n\n\n\n\nCodex can also answer questions or update the PR. Try commenting \"@codex address that feedback\".\n            \n</details>"
  },
  {
    "id": 4150273985,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-21T19:23:52Z",
    "commit_id": "883e71d96e3e7c383767da13cc6331a61b3b074d",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — The previous cache-poisoning issue is fixed, but the current head still hardcodes `robots: 'index, follow'` for all generated tags even though the SEO spec requires `PUBLIC_NO_INDEX` channels to emit `noindex`.\n- [x] **2. Security First** — I did not find a new code-level security issue in the latest meta-tag changes. The existing `llm-logs/` concern has already been raised separately and I am not repeating it here.\n- [ ] **3. Architectural Alignment** — The new service still does not carry visibility through `ChannelContext`, so it cannot satisfy the spec’s visibility-driven robots behavior.\n- [ ] **4. Issue Completion** — The prior findings on fallback caching and `MetaTagJobStatus` are fixed, but the remaining robots/canonical URL issues still block the M2 skeleton from matching the SEO feature behavior.\n- [x] **5. No Nitpicking** — This review is limited to correctness/contract issues.\n- [x] **6. Avoid Repetition** — I am not adding duplicate inline comments; the remaining blockers are the two existing unresolved automated comments on this PR.\n- [x] **7. Iterative Reviews** — Re-reviewed the latest commit `883e71d`; the two issues from my prior review are resolved.\n- [x] **8. Prevent CI Failures** — Current GitHub checks are green; the remaining issues are behavioral gaps not caught by CI.\n\n## Review (Request changes)\n\nThe latest commit fixes the two blockers from my previous review:\n\n- `getOrGenerateCachedFromContext()` no longer caches fallback tags with `needsRegeneration=true`, and there is a regression test for that path.\n- `getRegenerationJobStatus()` now has the spec return type, and `MetaTagJobStatus` includes `errorCode` / `errorMessage`.\n\nI’m still requesting changes because two existing unresolved automated comments are valid and should be addressed before merge:\n\n1. `MetaTagSet.robots` is always `index, follow`. The spec explicitly requires `PUBLIC_NO_INDEX` to regenerate/serve `noindex, follow`, so `ChannelContext` needs visibility or equivalent policy input before tags are generated.\n\n2. `buildCanonicalUrl(serverSlug, channelSlug)` interpolates raw path segments. Channel slugs are only validated as non-empty strings with max length, and the existing sitemap implementation already uses `encodeURIComponent`, so this helper should encode both slug segments too.\n\nOnce those are fixed, I do not see remaining blockers in the meta-tag skeleton.\n"
  },
  {
    "id": 4150285494,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:26:22Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": ""
  },
  {
    "id": 4150285950,
    "user": "AvanishKulkarni",
    "state": "COMMENTED",
    "submitted_at": "2026-04-21T19:26:27Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": ""
  },
  {
    "id": 4150307918,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-21T19:30:59Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — The prior robots and canonical helper issues are fixed, but `generateBreadcrumbList()` still builds the server breadcrumb URL with a raw `serverSlug`, so reserved characters can still produce invalid/misparsed structured-data URLs.\n- [x] **2. Security First** — I did not find a new security issue in the latest code changes.\n- [ ] **3. Architectural Alignment** — Breadcrumb URL generation should follow the same encoded path-segment behavior now used by `buildCanonicalUrl()` and the existing sitemap generator.\n- [x] **4. Issue Completion** — The PR description has been updated correctly: the stale “pre-existing `metaTag.repository.test.ts` failure” note is gone, and the test plan now says the repository test passes.\n- [x] **5. No Nitpicking** — This is a concrete URL correctness issue in generated JSON-LD, not style feedback.\n- [x] **6. Avoid Repetition** — I am not repeating resolved comments about robots or `buildCanonicalUrl()`; both are fixed in `b5a5950`.\n- [x] **7. Iterative Reviews** — Re-reviewed latest head `b5a5950`; previous blockers are addressed except for the related breadcrumb URL path.\n- [x] **8. Prevent CI Failures** — Current GitHub checks are green; this remaining issue is a behavioral gap not covered by CI.\n\n## Review (Request changes)\n\nThe latest push fixed the previous blockers:\n\n- `ChannelContext.visibility` now drives `robots` correctly for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`.\n- `buildCanonicalUrl()` now encodes both slug path segments.\n- The stale PR-description note about `tests/metaTag.repository.test.ts` failing has been removed; the description now says the repository test passes, which matches the current schema state.\n\nOne related URL issue remains:\n\n### Encode `serverSlug` in breadcrumb structured data\n**File:** `harmony-backend/src/services/metaTag/structuredDataGenerator.ts:26-37`\n\n`generateBreadcrumbList()` still emits the first breadcrumb item as:\n\n```ts\nitem: `${BASE_URL}/s/${channel.serverSlug}`,\n```\n\nThe same slug validation concern applies here as it did to `buildCanonicalUrl()`: channel/server slug inputs are not restricted to URL-safe characters, and the repo’s sitemap generator already uses `encodeURIComponent` for slug path segments. If `serverSlug` contains a space, `?`, `#`, `/`, or `&`, this JSON-LD URL can become invalid or point to the wrong path/query/fragment.\n\nPlease encode the breadcrumb path segment too, e.g.:\n\n```ts\nitem: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,\n```\n\nand add a small test alongside the canonical URL encoding test.\n"
  },
  {
    "id": 4150313187,
    "user": "acabrera04",
    "state": "CHANGES_REQUESTED",
    "submitted_at": "2026-04-21T19:32:07Z",
    "commit_id": "b5a5950f129a9aa73b77045e0c827a140b466ffb",
    "body": "## PR Review Checklist\n\n- [ ] **1. Logic over Style** — Cross-checking against `docs/dev-spec-seo-meta-tag-generation.md` found one remaining contract mismatch in addition to the breadcrumb URL encoding gap: some structured-data methods expose `object` instead of the spec’s `StructuredData` return type.\n- [x] **2. Security First** — No new security issue found in this spec pass.\n- [ ] **3. Architectural Alignment** — `StructuredDataGenerator` should match §9.1.5 method contracts, and breadcrumb URL construction should follow the same encoded segment policy as canonical/sitemap URLs.\n- [x] **4. Issue Completion** — The stale PR-description note about `metaTag.repository.test.ts` has been removed and the description now aligns with the current test status.\n- [x] **5. No Nitpicking** — These are API-contract and generated-URL correctness issues.\n- [x] **6. Avoid Repetition** — This adds the explicit spec-return-type issue from §9.1.5; the breadcrumb encoding item is the same remaining URL issue from the latest review.\n- [x] **7. Iterative Reviews** — Re-reviewed latest head `b5a5950` directly against `docs/dev-spec-seo-meta-tag-generation.md`.\n- [x] **8. Prevent CI Failures** — Current checks are green; these are contract/behavior gaps not currently covered by CI.\n\n## Review (Request changes)\n\nI cross-checked the latest head against `docs/dev-spec-seo-meta-tag-generation.md`. Most of the previously flagged contracts are now aligned: `MetaTagService` stubs, `DescriptionGenerator`, `OpenGraphGenerator`, `MetaTagJobStatus`, visibility-derived robots, cache fallback behavior, and the PR description/test-plan wording all look consistent with the spec.\n\nTwo spec-alignment issues remain:\n\n1. **`StructuredDataGenerator` return types drift from §9.1.5.** The spec declares all four public methods as returning `StructuredData`, including `generateBreadcrumbList(server, channel): StructuredData` and `generateOrganization(server): StructuredData`. The PR currently exposes those two as `object`. Even if the skeleton implementation is minimal, the exported method signatures should match the spec contract now so M4 wiring does not need a breaking type change later.\n\n2. **`generateBreadcrumbList()` still uses a raw `serverSlug` in its `item` URL.** The spec uses canonical crawler-facing URLs, and the existing sitemap code plus the new `buildCanonicalUrl()` fix both encode slug path segments. Breadcrumb structured-data URLs should do the same:\n\n```ts\nitem: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,\n```\n\nPlease align the structured-data method signatures to §9.1.5 and add the breadcrumb slug-encoding regression test alongside the canonical URL encoding test.\n"
  }
]
````

#### Tool: exec_command

```sh
gh api graphql -f query='query($owner:String!,$repo:String!,$number:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$number){reviewThreads(first:100){nodes{isResolved path line comments(first:20){nodes{author{login} body url createdAt}}}}}}}' -F owner=CS485-Harmony -F repo=Harmony -F number=443
```

Output:

````text
{"data":{"repository":{"pullRequest":{"reviewThreads":{"nodes":[{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagService.generateMetaTags signature diverges from the dev spec referenced by this PR (spec defines generateMetaTags(channelId, options?) and expects the service to fetch context internally). Either align the method signature/behavior to the spec or update the spec/PR description so downstream integrations don’t drift.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142149","createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. The context-driven implementation is renamed to generateMetaTagsFromContext(channel, messages) for unit tests. A spec-aligned stub generateMetaTags(channelId, options?) is added that throws 'not implemented — wired by M4 (issue #356)'. Callers will be updated to the spec signature when the channel-resolver is wired in M4.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111398713","createdAt":"2026-04-20T14:29:20Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"scheduleRegeneration stub does not match the spec return shape (spec expects a jobId and queued/deduplicated status, plus optional priority/idempotencyKey). Even as a stub, keeping the spec signature/return type will prevent a breaking refactor when M4 wires the queue.\n```suggestion\n  async scheduleRegeneration(\n    channelId: string,\n    options?: { priority?: string; idempotencyKey?: string },\n  ): Promise<{\n    jobId: string;\n    status: 'queued' | 'deduplicated';\n    priority?: string;\n    idempotencyKey?: string;\n  }> {\n    // Queuing logic wired by M4 MetaTagUpdateWorker.\n    // Keep the stub contract aligned with the queue spec to avoid a breaking API change later.\n    return {\n      jobId: `meta-tag-regeneration:${channelId}`,\n      status: 'queued',\n      priority: options?.priority,\n      idempotencyKey: options?.idempotencyKey,\n    };\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142223","createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. scheduleRegeneration now returns Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> with the stub returning a placeholder jobId, matching the spec contract for AC-5/AC-6.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111395320","createdAt":"2026-04-20T14:28:49Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getRegenerationJobStatus stub signature differs from the spec (spec takes both channelId and jobId and returns a MetaTagJobStatus object). Keeping the correct parameters/return type now will make M4 wiring straightforward.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142302","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. getRegenerationJobStatus now takes (channelId: string, jobId: string) and returns Promise<MetaTagJobStatus | null>. MetaTagJobStatus type added to types.ts per spec.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111394608","createdAt":"2026-04-20T14:28:42Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"OpenGraphGenerator.generateOGTags signature doesn’t match the dev spec for CL-C2.4 (spec describes channel/server/analysis-driven generation). If this module is meant to satisfy the spec interface for later wiring, adjust the signature (or add an adapter) to avoid refactors.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142353","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"generateOGTags already accepts channel as its first parameter (unchanged). The related generateTwitterCard signature was aligned with spec in 177c384 (channel is now the first param). The broader spec-signature alignment for generateMetaTags/getOrGenerateCached is addressed separately — see those threads.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111399582","createdAt":"2026-04-20T14:29:28Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/types.ts","line":41,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagSet includes needsRegeneration, but the dev spec’s CL-D1 MetaTagSet DTO doesn’t include this field (needs_regeneration is modeled in persistence metadata). Consider keeping regeneration status separate (wrapper type) or update the DTO/spec consistently to avoid contract drift.\n```suggestion\n  keywords: string[];\n}\n\nexport interface MetaTagSetWithRegenerationStatus {\n  metaTags: MetaTagSet;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142384","createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Won't fix: The existing unit tests directly assert tags.needsRegeneration (AC-9 test, fallback test), so removing the field from MetaTagSet would break them. Keeping it on the DTO for now; can be split into a wrapper type when the full persistence layer lands in M3/M4.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111397887","createdAt":"2026-04-20T14:29:12Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"DescriptionGenerator.enforceLength only truncates >160 chars and never enforces the 50-char minimum, so generateFromMessages can return descriptions shorter than 50 characters for short channel/server names or very short messages (violates AC-2). Update the length policy to guarantee MIN_LENGTH before returning (e.g., append more context deterministically).\n```suggestion\n  padToMinimumLength(text: string): string {\n    const additions = [\n      ' Join the discussion.',\n      ' Explore the latest updates.',\n      ' Connect with the community.',\n    ];\n\n    let padded = text.trim();\n    if (padded.length === 0) {\n      padded = 'Join the discussion and explore the latest updates.';\n    }\n\n    let additionIndex = 0;\n    while (padded.length < MIN_LENGTH) {\n      padded += additions[additionIndex % additions.length];\n      additionIndex += 1;\n    }\n\n    return padded;\n  },\n\n  enforceLength(text: string): string {\n    let result = text;\n    if (result.length < MIN_LENGTH) {\n      result = this.padToMinimumLength(result);\n    }\n\n    if (result.length > MAX_LENGTH) {\n      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';\n    }\n    return result;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142433","createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. enforceLength now pads text below 50 chars by appending context phrases before truncating. All AC-2 unit tests pass.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111391256","createdAt":"2026-04-20T14:28:12Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"TitleGenerator.generateFromMessage sanitizes only message.content; channel.serverName is appended without sanitization/normalization. Since server names are user-controlled, sanitize the full composed string (or sanitize serverName separately) before truncation to keep title output consistently safe.\n```suggestion\n    const raw = `${message.content} — ${channel.serverName}`;\n    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142492","createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Now sanitizes the full composed string (message.content + channel.serverName) via sanitizeForTitle before truncation.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111389802","createdAt":"2026-04-20T14:27:58Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"applyTemplate uses String.replace per variable, which only replaces the first occurrence of each placeholder. If a template repeats a placeholder (common in localized templates), later occurrences will remain unreplaced. Use a global replacement strategy (e.g., replaceAll or a global RegExp) per key.\n```suggestion\n      (result, [key, value]) => result.replaceAll(`{${key}}`, value),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142532","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Changed result.replace to result.replaceAll so all occurrences of each placeholder are substituted.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111389110","createdAt":"2026-04-20T14:27:52Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"summarizeThread interpolates channel.name and channel.serverName directly into the output without sanitizing/normalizing them. Since these are user-controlled strings, meta descriptions can contain HTML/attribute-breaking characters. Sanitize channel/server fields the same way you sanitize message content.\n```suggestion\n  sanitizeText(text: string): string {\n    return text.replace(/<[^>]*>/g, '').replace(/\\s+/g, ' ').trim();\n  },\n\n  summarizeThread(messages: MessageContext[], channel: ChannelContext): string {\n    const serverName = this.sanitizeText(channel.serverName);\n    const channelName = this.sanitizeText(channel.name);\n    const suffix = ` — Join the discussion on ${serverName}.`;\n\n    if (messages.length === 0) {\n      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;\n      return this.enforceLength(base);\n    }\n\n    const first = this.sanitizeText(messages[0].content);\n    const prefix = `${serverName} › #${channelName}: `;\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142575","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added sanitizeText helper to DescriptionGenerator; summarizeThread now sanitizes channel.name and channel.serverName before interpolation.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111390561","createdAt":"2026-04-20T14:28:05Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getOrGenerateCached currently requires ChannelContext + MessageContext[] + optional ttl, but the spec API is getOrGenerateCached(channelId) with caching handled internally. Consider aligning the signature (and moving message fetching inside) to match the spec contract.\n```suggestion\n  async resolveChannelContext(_channelId: string): Promise<ChannelContext> {\n    throw new Error('metaTagService.resolveChannelContext must be implemented with channel lookup');\n  },\n\n  async resolveMessageContexts(_channelId: string): Promise<MessageContext[]> {\n    throw new Error('metaTagService.resolveMessageContexts must be implemented with message lookup');\n  },\n\n  async getOrGenerateCached(\n    channelOrId: ChannelContext | string,\n    messagesOrTtl?: MessageContext[] | number,\n    ttl?: number,\n  ): Promise<MetaTagSet> {\n    const channelId = typeof channelOrId === 'string' ? channelOrId : channelOrId.id;\n    const cached = await MetaTagCache.get(channelId);\n    if (cached) return cached;\n\n    const channel =\n      typeof channelOrId === 'string'\n        ? await this.resolveChannelContext(channelOrId)\n        : channelOrId;\n    const messages =\n      typeof channelOrId === 'string'\n        ? await this.resolveMessageContexts(channelOrId)\n        : Array.isArray(messagesOrTtl)\n          ? messagesOrTtl\n          : [];\n    const cacheTtl =\n      typeof messagesOrTtl === 'number'\n        ? messagesOrTtl\n        : ttl;\n\n    const tags = await this.generateMetaTags(channel, messages);\n    await MetaTagCache.set(channel.id, tags, cacheTtl);\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142625","createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added spec-aligned stub getOrGenerateCached(channelId: string) that throws 'not implemented — wired by M4'. The context-driven variant is renamed to getOrGenerateCachedFromContext(channel, messages, ttl?) for use in unit tests and internal generation flow.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111397023","createdAt":"2026-04-20T14:29:05Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagCache.ts","line":11,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagCache exposes a ttl property, but set() defaults to DEFAULT_TTL rather than the exported ttl field, so MetaTagCache.ttl is effectively unused/misleading. Consider making ttl the single source of truth (or remove the field).","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142686","createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. set() now uses ttl ?? this.ttl so MetaTagCache.ttl is the single source of truth for the default TTL.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111392031","createdAt":"2026-04-20T14:28:19Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","line":37,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateBreadcrumbList hard-codes the https://harmony.chat domain for the server URL. Use the same configurable BASE_URL/origin used elsewhere so structured data is correct in staging/dev/alternate deployments.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142725","createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateBreadcrumbList now reads process.env.BASE_URL ?? 'https://harmony.chat' consistent with metaTagService.ts.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111392817","createdAt":"2026-04-20T14:28:26Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateTwitterCard signature also diverges from the spec’s CL-C2.4 API (spec is channel/server/analysis-based, not raw strings). Consider aligning the public API now (even if the implementation is still a skeleton).\n```suggestion\n  generateTwitterCard(\n    channel: ChannelContext,\n    title: string,\n    description: string,\n    image?: string,\n  ): TwitterCardTags {\n    return {\n      card: 'summary_large_image',\n      title,\n      description,\n      image: image ?? this.selectPreviewImage(channel),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142775","createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateTwitterCard now accepts channel as the first parameter (matching spec CL-C2.4). Also fixed the card type: uses 'summary' by default, only 'summary_large_image' when a non-default preview image is available.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111393786","createdAt":"2026-04-20T14:28:34Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"buildFallbackTags uses raw channel/server names and only truncates/enforces max length; it does not sanitize. Because fallback is used on generation errors, it should still produce sanitized values to avoid unsafe content flowing into rendered <head>. Route fallback strings through the same sanitization/normalization as the main generators.\n```suggestion\nimport sanitizeHtml from 'sanitize-html';\n\nconst logger = createLogger({ component: 'meta-tag-service' });\n\nconst BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';\n\nfunction sanitizeMetaText(value: string): string {\n  return sanitizeHtml(value, {\n    allowedTags: [],\n    allowedAttributes: {},\n  }).replace(/\\s+/g, ' ').trim();\n}\n\nfunction buildFallbackTags(channel: ChannelContext): MetaTagSet {\n  const sanitizedChannel: ChannelContext = {\n    ...channel,\n    name: sanitizeMetaText(channel.name),\n    serverName: sanitizeMetaText(channel.serverName),\n  };\n  const title = `${sanitizedChannel.name} — ${sanitizedChannel.serverName}`;\n  const description = `Discussions in #${sanitizedChannel.name} on ${sanitizedChannel.serverName}.`;\n  return {\n    title: TitleGenerator.truncateWithEllipsis(title),\n    description: DescriptionGenerator.enforceLength(description),\n    canonical: sanitizedChannel.canonicalUrl,\n    robots: 'index, follow',\n    openGraph: OpenGraphGenerator.generateOGTags(sanitizedChannel, title, description),\n    twitter: OpenGraphGenerator.generateTwitterCard(title, description),\n    structuredData: StructuredDataGenerator.generateDiscussionForum(sanitizedChannel, title, description),\n```","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111142829","createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. buildFallbackTags now runs channel fields through sanitizeChannelContext (which uses TitleGenerator.sanitizeForTitle) before any interpolation — no new dependency needed since the regex sanitizer is already in scope.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3111396192","createdAt":"2026-04-20T14:28:57Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"chatgpt-codex-connector"},"body":"**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Derive robots directive from channel visibility**\n\nThis path always emits `robots: 'index, follow'`, which is incorrect for channels that are `PUBLIC_NO_INDEX` (and potentially private states) and can lead crawlers to index content that was explicitly configured not to be indexed. I checked the existing visibility model in `harmony-backend/src/trpc/routers/channel.router.ts` (which already supports `PUBLIC_NO_INDEX`), so this service should carry visibility in `ChannelContext` and map it to the correct robots directive instead of hardcoding index/follow.\n\nUseful? React with 👍 / 👎.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119804427","createdAt":"2026-04-21T19:18:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in b5a5950. `ChannelContext` now has an optional `visibility` field (`PUBLIC_INDEXABLE | PUBLIC_NO_INDEX | PRIVATE`). The robots directive is derived via `getRobotsDirective(channel.visibility)` — `PUBLIC_NO_INDEX` emits `noindex, follow`, `PRIVATE` emits `noindex, nofollow`, and `PUBLIC_INDEXABLE` (or unset) emits `index, follow`.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119842438","createdAt":"2026-04-21T19:26:21Z"}]}},{"isResolved":true,"path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"comments":{"nodes":[{"author":{"login":"chatgpt-codex-connector"},"body":"**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Encode canonical URL path segments**\n\n`buildCanonicalUrl` interpolates raw slugs directly into the URL, so reserved characters in `serverSlug`/`channelSlug` (e.g. spaces, `?`, `#`, `/`) will produce invalid or misparsed canonical links. This is actionable because channel slug input is not regex-restricted in the API layer (only min/max length), and other URL generation in this repo already URL-encodes slugs for safety. Use `encodeURIComponent` for both path segments before concatenation.\n\nUseful? React with 👍 / 👎.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119804431","createdAt":"2026-04-21T19:18:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in b5a5950. Both `serverSlug` and `channelSlug` are now wrapped with `encodeURIComponent` in `buildCanonicalUrl`, consistent with the sitemap implementation. Test added to verify reserved characters are percent-encoded.","url":"https://github.com/CS485-Harmony/Harmony/pull/443#discussion_r3119842901","createdAt":"2026-04-21T19:26:27Z"}]}}]}}}}}
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:35:41.038Z

The latest commit is `3bb2ff7` and it claims to address the last structured-data issues. I’m reading the updated files and CI before making the final review decision.

#### Tool: exec_command

```sh
git diff --unified=100 origin/main..pr-443 -- harmony-backend/src/services/metaTag/structuredDataGenerator.ts harmony-backend/src/services/metaTag/types.ts harmony-backend/tests/metaTagService.test.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
new file mode 100644
index 0000000..9729f50
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
@@ -0,0 +1,71 @@
+// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
+import type { ChannelContext, MessageContext, MetaTagSet, StructuredData } from './types';
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+export const StructuredDataGenerator = {
+  // Spec §9.1.5: generateDiscussionForum(channel, messages, server)
+  // M2 skeleton: derived from channel context; message/server integration by M4
+  generateDiscussionForum(channel: ChannelContext, _messages: MessageContext[], _server: unknown): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'DiscussionForumPosting',
+      headline: `${channel.name} — ${channel.serverName}`,
+      description: `Discussions in #${channel.name} on ${channel.serverName}.`,
+      // author and datePublished are stub fields — populated by M4 when message data is available
+      author: undefined,
+      datePublished: undefined,
+      dateModified: undefined,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+
+  // Spec §9.1.5: generateBreadcrumbList(server, channel): StructuredData
+  generateBreadcrumbList(_server: unknown, channel: ChannelContext): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'BreadcrumbList',
+      itemListElement: [
+        {
+          '@type': 'ListItem',
+          position: 1,
+          name: channel.serverName,
+          item: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,
+        },
+        {
+          '@type': 'ListItem',
+          position: 2,
+          name: channel.name,
+          item: channel.canonicalUrl,
+        },
+      ],
+    };
+  },
+
+  // Spec §9.1.5: generateOrganization(server): StructuredData
+  generateOrganization(_server: unknown): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'Organization',
+      name: 'Harmony',
+      url: BASE_URL,
+    };
+  },
+
+  // Spec §9.1.5: generateWebPage(channel, metaTags)
+  generateWebPage(channel: ChannelContext, metaTags: MetaTagSet): StructuredData {
+    return {
+      '@context': 'https://schema.org',
+      '@type': 'WebPage',
+      headline: metaTags.title,
+      description: metaTags.description,
+      mainEntity: {
+        '@type': 'WebPage',
+        url: channel.canonicalUrl,
+      },
+    };
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/types.ts b/harmony-backend/src/services/metaTag/types.ts
new file mode 100644
index 0000000..9c319ba
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/types.ts
@@ -0,0 +1,100 @@
+// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)
+
+export interface OpenGraphTags {
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  ogType: string;
+  ogUrl: string;
+  ogSiteName: string;
+}
+
+export interface TwitterCardTags {
+  card: string;
+  title: string;
+  description: string;
+  image: string;
+  site: string;
+}
+
+export interface StructuredData {
+  '@context': string;
+  '@type': string;
+  headline?: string;
+  description?: string;
+  author?: object;
+  datePublished?: string;
+  dateModified?: string;
+  mainEntity?: object;
+  breadcrumb?: object;
+  [key: string]: unknown;
+}
+
+export interface MetaTagSet {
+  title: string;
+  description: string;
+  canonical: string;
+  robots: string;
+  openGraph: OpenGraphTags;
+  twitter: TwitterCardTags;
+  structuredData: StructuredData;
+  keywords: string[];
+  needsRegeneration?: boolean;
+}
+
+export interface ContentAnalysis {
+  keywords: string[];
+  topics: string[];
+  summary: string;
+  sentiment: string;
+  readingLevel: string;
+}
+
+export interface IMetaTagGenerator {
+  generate(): MetaTagSet;
+  validate(): boolean;
+}
+
+export interface MetaTagPreview {
+  title: string;
+  description: string;
+  ogTitle: string;
+  ogDescription: string;
+  ogImage: string;
+  keywords: string[];
+  generatedAt: string;
+  isCustom: boolean;
+  searchPreview: { title: string; description: string; url: string };
+  socialPreview: { title: string; description: string; image: string };
+}
+
+export interface MetaTagJobStatus {
+  jobId: string;
+  channelId: string;
+  status: 'queued' | 'processing' | 'succeeded' | 'failed';
+  attempts: number;
+  startedAt: string | null;
+  completedAt: string | null;
+  errorCode: string | null;
+  errorMessage: string | null;
+}
+
+// Canonical values from the SEO spec visibility model
+export type ChannelVisibility = 'PUBLIC_INDEXABLE' | 'PUBLIC_NO_INDEX' | 'PRIVATE';
+
+export interface ChannelContext {
+  id: string;
+  name: string;
+  slug: string;
+  topic?: string | null;
+  serverName: string;
+  serverSlug: string;
+  canonicalUrl: string;
+  visibility?: ChannelVisibility;
+}
+
+export interface MessageContext {
+  content: string;
+  createdAt: Date;
+  authorDisplayName?: string;
+}
diff --git a/harmony-backend/tests/metaTagService.test.ts b/harmony-backend/tests/metaTagService.test.ts
new file mode 100644
index 0000000..20e1da8
--- /dev/null
+++ b/harmony-backend/tests/metaTagService.test.ts
@@ -0,0 +1,325 @@
+/**
+ * Unit tests for M2 Meta Tag Generation Service skeleton — Issue #350
+ *
+ * Covers AC-2 (length limits), sanitization, template application,
+ * and AC-9 (fallback on failure, needsRegeneration=true).
+ *
+ * MetaTagCache uses Redis via cacheService — mocked here for unit speed.
+ */
+
+jest.mock('../src/services/cache.service', () => ({
+  cacheService: {
+    get: jest.fn(),
+    set: jest.fn(),
+    invalidate: jest.fn(),
+    getOrRevalidate: jest.fn(),
+  },
+  CacheKeys: {
+    metaChannel: (id: string) => `meta:channel:${id}`,
+    channelVisibility: (id: string) => `channel:${id}:visibility`,
+    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
+    serverInfo: (id: string) => `server:${id}:info`,
+    analysisChannel: (id: string) => `analysis:channel:${id}`,
+  },
+  sanitizeKeySegment: (s: string) => s.replace(/[*?\[\]]/g, ''),
+}));
+
+import { TitleGenerator } from '../src/services/metaTag/titleGenerator';
+import { DescriptionGenerator } from '../src/services/metaTag/descriptionGenerator';
+import { MetaTagCache } from '../src/services/metaTag/metaTagCache';
+import { metaTagService } from '../src/services/metaTag/metaTagService';
+import { cacheService } from '../src/services/cache.service';
+import type { ChannelContext, MessageContext } from '../src/services/metaTag/types';
+
+const mockCacheService = cacheService as jest.Mocked<typeof cacheService>;
+
+const channel: ChannelContext = {
+  id: 'chan-001',
+  name: 'unity-physics-help',
+  slug: 'unity-physics-help',
+  topic: 'Ask about Unity physics',
+  serverName: 'Game Dev Hub',
+  serverSlug: 'game-dev-hub',
+  canonicalUrl: 'https://harmony.chat/c/game-dev-hub/unity-physics-help',
+};
+
+const messages: MessageContext[] = [
+  { content: 'How do I handle collision detection in Unity?', createdAt: new Date() },
+  { content: 'Use OnCollisionEnter for physics-based collisions.', createdAt: new Date() },
+];
+
+beforeEach(() => {
+  jest.clearAllMocks();
+});
+
+// ─── TitleGenerator ──────────────────────────────────────────────────────────
+
+describe('TitleGenerator', () => {
+  it('maxLength is 60', () => {
+    expect(TitleGenerator.maxLength).toBe(60);
+  });
+
+  it('generateFromChannel produces title ≤60 chars', () => {
+    const title = TitleGenerator.generateFromChannel(channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+  });
+
+  it('truncates long titles with ellipsis and stays ≤60 chars', () => {
+    const longChannel: ChannelContext = {
+      ...channel,
+      name: 'this-is-a-very-long-channel-name-that-exceeds-limits',
+      serverName: 'An Extremely Long Server Name That Will Overflow',
+    };
+    const title = TitleGenerator.generateFromChannel(longChannel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title.endsWith('…')).toBe(true);
+  });
+
+  it('sanitizeForTitle strips HTML tags', () => {
+    const result = TitleGenerator.sanitizeForTitle('<b>Hello</b> <em>world</em>');
+    expect(result).toBe('Hello world');
+  });
+
+  it('sanitizeForTitle collapses whitespace', () => {
+    const result = TitleGenerator.sanitizeForTitle('foo   bar\n  baz');
+    expect(result).toBe('foo bar baz');
+  });
+
+  it('applyTemplate replaces template variables', () => {
+    const result = TitleGenerator.applyTemplate('{channelName} on {serverName}', {
+      channelName: 'general',
+      serverName: 'My Server',
+    });
+    expect(result).toBe('general on My Server');
+  });
+
+  it('generateFromThread falls back to channel when no messages', () => {
+    const title = TitleGenerator.generateFromThread([], channel);
+    expect(title).toBe(TitleGenerator.generateFromChannel(channel));
+  });
+
+  it('generateFromMessage uses first message content', () => {
+    const title = TitleGenerator.generateFromMessage(messages[0], channel);
+    expect(title.length).toBeLessThanOrEqual(60);
+    expect(title).toContain('Game Dev Hub');
+  });
+});
+
+// ─── DescriptionGenerator ───────────────────────────────────────────────────
+
+describe('DescriptionGenerator', () => {
+  it('maxLength is 160', () => {
+    expect(DescriptionGenerator.maxLength).toBe(160);
+  });
+
+  it('minLength is 50', () => {
+    expect(DescriptionGenerator.minLength).toBe(50);
+  });
+
+  it('generateFromMessages produces description 50-160 chars', () => {
+    const desc = DescriptionGenerator.generateFromMessages(messages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('truncates long descriptions to ≤160 chars with ellipsis', () => {
+    const longMessages: MessageContext[] = [
+      {
+        content: 'A'.repeat(200),
+        createdAt: new Date(),
+      },
+    ];
+    const desc = DescriptionGenerator.generateFromMessages(longMessages, channel);
+    expect(desc.length).toBeLessThanOrEqual(160);
+    expect(desc.endsWith('…')).toBe(true);
+  });
+
+  it('returns text unchanged when within valid range', () => {
+    const valid = 'A'.repeat(80);
+    expect(DescriptionGenerator.enforceLength(valid)).toBe(valid);
+  });
+
+  it('AC-2: generateFromMessages produces ≥50 chars even for a very short message', () => {
+    const shortMessages: MessageContext[] = [{ content: 'hi', createdAt: new Date() }];
+    const desc = DescriptionGenerator.generateFromMessages(shortMessages, channel);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+
+  it('extractKeyPhrases returns non-empty array for non-empty content', () => {
+    const content = messages.map((m) => m.content).join(' ');
+    const phrases = DescriptionGenerator.extractKeyPhrases(content, 5);
+    expect(Array.isArray(phrases)).toBe(true);
+    expect(phrases.length).toBeGreaterThan(0);
+  });
+
+  it('extractKeyPhrases respects maxPhrases limit', () => {
+    const content = messages.map((m) => m.content).join(' ');
+    const phrases = DescriptionGenerator.extractKeyPhrases(content, 2);
+    expect(phrases.length).toBeLessThanOrEqual(2);
+  });
+
+  it('summarizeThread returns empty string for no messages', () => {
+    const summary = DescriptionGenerator.summarizeThread([]);
+    expect(summary).toBe('');
+  });
+
+  it('summarizeThread returns first message content for non-empty messages', () => {
+    const summary = DescriptionGenerator.summarizeThread(messages);
+    expect(summary.length).toBeGreaterThan(0);
+  });
+
+  it('generateFromMessages includes channel info for empty messages', () => {
+    const desc = DescriptionGenerator.generateFromMessages([], channel);
+    expect(desc).toContain(channel.name);
+    expect(desc.length).toBeGreaterThanOrEqual(50);
+    expect(desc.length).toBeLessThanOrEqual(160);
+  });
+});
+
+// ─── MetaTagCache ────────────────────────────────────────────────────────────
+
+describe('MetaTagCache', () => {
+  it('ttl defaults to 3600', () => {
+    expect(MetaTagCache.ttl).toBe(3600);
+  });
+
+  it('get returns null on cache miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toBeNull();
+    expect(mockCacheService.get).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('get returns cached data on hit', async () => {
+    const fakeSet = { title: 'Cached Title' } as never;
+    mockCacheService.get.mockResolvedValue({ data: fakeSet, createdAt: Date.now() });
+    const result = await MetaTagCache.get('chan-001');
+    expect(result).toEqual(fakeSet);
+  });
+
+  it('set calls cacheService.set with correct key and ttl', async () => {
+    mockCacheService.set.mockResolvedValue(undefined);
+    const tags = { title: 'T' } as never;
+    await MetaTagCache.set('chan-001', tags, 1800);
+    expect(mockCacheService.set).toHaveBeenCalledWith(
+      'meta:channel:chan-001',
+      tags,
+      { ttl: 1800 },
+    );
+  });
+
+  it('invalidate calls cacheService.invalidate with correct key', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await MetaTagCache.invalidate('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+});
+
+// ─── MetaTagService ──────────────────────────────────────────────────────────
+
+describe('metaTagService', () => {
+  it('generateMetaTagsFromContext returns valid MetaTagSet', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(tags.title.length).toBeLessThanOrEqual(60);
+    expect(tags.description.length).toBeGreaterThanOrEqual(50);
+    expect(tags.description.length).toBeLessThanOrEqual(160);
+    expect(tags.canonical).toBe(channel.canonicalUrl);
+    expect(tags.needsRegeneration).toBe(false);
+  });
+
+  it('generateMetaTagsFromContext sets robots to index, follow', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.robots).toBe('index, follow');
+  });
+
+  it('generateMetaTagsFromContext includes openGraph and twitter tags', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    expect(tags.openGraph.ogTitle).toBeDefined();
+    expect(tags.twitter.card).toBeDefined();
+  });
+
+  it('AC-9: returns fallback with needsRegeneration=true on generation error', async () => {
+    const spy = jest
+      .spyOn(TitleGenerator, 'generateFromThread')
+      .mockImplementation(() => { throw new Error('NLP timeout'); });
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    spy.mockRestore();
+    expect(tags.needsRegeneration).toBe(true);
+    expect(tags.title.length).toBeGreaterThan(0);
+  });
+
+  it('getOrGenerateCachedFromContext returns cache hit without regenerating', async () => {
+    const cachedTags = { title: 'Cached', needsRegeneration: false } as never;
+    mockCacheService.get.mockResolvedValue({ data: cachedTags, createdAt: Date.now() });
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    expect(tags).toEqual(cachedTags);
+    expect(mockCacheService.set).not.toHaveBeenCalled();
+  });
+
+  it('getOrGenerateCachedFromContext generates and caches on miss', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    mockCacheService.set.mockResolvedValue(undefined);
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    expect(tags.title.length).toBeGreaterThan(0);
+    expect(mockCacheService.set).toHaveBeenCalled();
+  });
+
+  it('getOrGenerateCachedFromContext does not cache fallback tags on generation failure', async () => {
+    mockCacheService.get.mockResolvedValue(null);
+    const spy = jest
+      .spyOn(TitleGenerator, 'generateFromThread')
+      .mockImplementation(() => { throw new Error('NLP timeout'); });
+
+    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
+    spy.mockRestore();
+
+    expect(tags.needsRegeneration).toBe(true);
+    expect(mockCacheService.set).not.toHaveBeenCalled();
+  });
+
+  it('invalidateCache delegates to MetaTagCache.invalidate', async () => {
+    mockCacheService.invalidate.mockResolvedValue(undefined);
+    await metaTagService.invalidateCache('chan-001');
+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
+  });
+
+  it('buildCanonicalUrl constructs correct path', () => {
+    const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
+    expect(url).toContain('/c/game-dev-hub/unity-physics-help');
+  });
+
+  it('buildCanonicalUrl encodes reserved characters in slug segments', () => {
+    const url = metaTagService.buildCanonicalUrl('my server', 'q&a channel');
+    expect(url).toContain('/c/my%20server/q%26a%20channel');
+    expect(url).not.toContain(' ');
+    expect(url).not.toContain('&');
+  });
+
+  it('generateMetaTagsFromContext emits index,follow for PUBLIC_INDEXABLE', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(
+      { ...channel, visibility: 'PUBLIC_INDEXABLE' },
+      messages,
+    );
+    expect(tags.robots).toBe('index, follow');
+  });
+
+  it('generateMetaTagsFromContext emits noindex,follow for PUBLIC_NO_INDEX', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(
+      { ...channel, visibility: 'PUBLIC_NO_INDEX' },
+      messages,
+    );
+    expect(tags.robots).toBe('noindex, follow');
+  });
+
+  it('generateMetaTagsFromContext emits noindex,nofollow for PRIVATE', async () => {
+    const tags = await metaTagService.generateMetaTagsFromContext(
+      { ...channel, visibility: 'PRIVATE' },
+      messages,
+    );
+    expect(tags.robots).toBe('noindex, nofollow');
+  });
+});
```

#### Tool: exec_command

```sh
git diff --unified=100 origin/main..pr-443 -- harmony-backend/src/services/metaTag/metaTagService.ts harmony-backend/src/services/metaTag/descriptionGenerator.ts harmony-backend/src/services/metaTag/openGraphGenerator.ts harmony-backend/src/services/metaTag/titleGenerator.ts harmony-backend/src/services/metaTag/metaTagCache.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/metaTag/descriptionGenerator.ts b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
new file mode 100644
index 0000000..73d84f5
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/descriptionGenerator.ts
@@ -0,0 +1,99 @@
+// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
+import type { MessageContext, ChannelContext, MetaTagSet, IMetaTagGenerator } from './types';
+
+const MAX_LENGTH = 160;
+const MIN_LENGTH = 50;
+
+export const DescriptionGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  minLength: number;
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string;
+  extractKeyPhrases(content: string, maxPhrases: number): string[];
+  sanitizeText(text: string): string;
+  summarizeThread(messages: MessageContext[]): string;
+  enforceLength(text: string): string;
+} = {
+  maxLength: MAX_LENGTH,
+  minLength: MIN_LENGTH,
+
+  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
+    const serverName = this.sanitizeText(channel.serverName);
+    const channelName = this.sanitizeText(channel.name);
+    const suffix = ` — Join the discussion on ${serverName}.`;
+
+    if (messages.length === 0) {
+      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;
+      return this.enforceLength(base);
+    }
+
+    const summary = this.summarizeThread(messages);
+    const prefix = `${serverName} › #${channelName}: `;
+    let text = prefix + summary;
+
+    if (text.length < MIN_LENGTH) {
+      text = text + suffix;
+    }
+
+    return this.enforceLength(text);
+  },
+
+  // Spec: extractKeyPhrases(content: string, maxPhrases: number): string[]
+  extractKeyPhrases(content: string, maxPhrases: number): string[] {
+    const words = content
+      .toLowerCase()
+      .replace(/<[^>]*>/g, '')
+      .replace(/[^a-z0-9\s]/g, ' ')
+      .split(/\s+/)
+      .filter((w) => w.length > 3);
+
+    const freq = new Map<string, number>();
+    for (const word of words) {
+      freq.set(word, (freq.get(word) ?? 0) + 1);
+    }
+
+    return [...freq.entries()]
+      .sort((a, b) => b[1] - a[1])
+      .slice(0, maxPhrases)
+      .map(([word]) => word);
+  },
+
+  sanitizeText(text: string): string {
+    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
+  },
+
+  // Spec: summarizeThread(messages: Message[]): string — channel context handled by generateFromMessages
+  summarizeThread(messages: MessageContext[]): string {
+    if (messages.length === 0) return '';
+    return this.sanitizeText(messages[0].content);
+  },
+
+  enforceLength(text: string): string {
+    let result = text;
+
+    if (result.length < MIN_LENGTH) {
+      const additions = [
+        ' Join the discussion.',
+        ' Explore the latest updates.',
+        ' Connect with the community.',
+      ];
+      let i = 0;
+      while (result.length < MIN_LENGTH) {
+        result += additions[i % additions.length];
+        i++;
+      }
+    }
+
+    if (result.length > MAX_LENGTH) {
+      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+    }
+    return result;
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('DescriptionGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('DescriptionGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/metaTagCache.ts b/harmony-backend/src/services/metaTag/metaTagCache.ts
new file mode 100644
index 0000000..c915c14
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagCache.ts
@@ -0,0 +1,22 @@
+// CL-C2.6 MetaTagCache — Redis-backed cache for generated meta tags (D7.1)
+import { cacheService, CacheKeys } from '../cache.service';
+import type { MetaTagSet } from './types';
+
+const DEFAULT_TTL = 3600; // seconds, per spec D7.1
+
+export const MetaTagCache = {
+  ttl: DEFAULT_TTL,
+
+  async get(channelId: string): Promise<MetaTagSet | null> {
+    const entry = await cacheService.get<MetaTagSet>(CacheKeys.metaChannel(channelId));
+    return entry?.data ?? null;
+  },
+
+  async set(channelId: string, tags: MetaTagSet, ttl?: number): Promise<void> {
+    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl: ttl ?? DEFAULT_TTL });
+  },
+
+  async invalidate(channelId: string): Promise<void> {
+    await cacheService.invalidate(CacheKeys.metaChannel(channelId));
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/metaTagService.ts b/harmony-backend/src/services/metaTag/metaTagService.ts
new file mode 100644
index 0000000..f66e53a
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/metaTagService.ts
@@ -0,0 +1,170 @@
+// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
+import { TitleGenerator } from './titleGenerator';
+import { DescriptionGenerator } from './descriptionGenerator';
+import { OpenGraphGenerator } from './openGraphGenerator';
+import { StructuredDataGenerator } from './structuredDataGenerator';
+import { MetaTagCache } from './metaTagCache';
+import type {
+  MetaTagSet,
+  ChannelContext,
+  ChannelVisibility,
+  MessageContext,
+  MetaTagPreview,
+  MetaTagJobStatus,
+  ContentAnalysis,
+} from './types';
+import { createLogger } from '../../lib/logger';
+
+const logger = createLogger({ component: 'meta-tag-service' });
+
+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
+
+// Spec §9.1.1 visibility → robots mapping
+function getRobotsDirective(visibility: ChannelVisibility | undefined): string {
+  if (visibility === 'PUBLIC_NO_INDEX') return 'noindex, follow';
+  if (visibility === 'PRIVATE') return 'noindex, nofollow';
+  return 'index, follow'; // PUBLIC_INDEXABLE or unset
+}
+
+function sanitizeChannelContext(channel: ChannelContext): ChannelContext {
+  return {
+    ...channel,
+    name: TitleGenerator.sanitizeForTitle(channel.name),
+    serverName: TitleGenerator.sanitizeForTitle(channel.serverName),
+  };
+}
+
+function buildFallbackTags(channel: ChannelContext): MetaTagSet {
+  const safe = sanitizeChannelContext(channel);
+  const title = `${safe.name} — ${safe.serverName}`;
+  const description = `Discussions in #${safe.name} on ${safe.serverName}.`;
+  const analysis: ContentAnalysis = {
+    keywords: [],
+    topics: [TitleGenerator.truncateWithEllipsis(title)],
+    summary: DescriptionGenerator.enforceLength(description),
+    sentiment: 'neutral',
+    readingLevel: 'basic',
+  };
+  return {
+    title: TitleGenerator.truncateWithEllipsis(title),
+    description: DescriptionGenerator.enforceLength(description),
+    canonical: safe.canonicalUrl,
+    robots: getRobotsDirective(safe.visibility),
+    openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
+    twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
+    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
+    keywords: [],
+    needsRegeneration: true,
+  };
+}
+
+export const metaTagService = {
+  /**
+   * Generate meta tags from pre-resolved context (used internally and in unit tests).
+   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
+   */
+  async generateMetaTagsFromContext(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
+    try {
+      const title = TitleGenerator.generateFromThread(messages, channel);
+      const description = DescriptionGenerator.generateFromMessages(messages, channel);
+      const keywords = DescriptionGenerator.extractKeyPhrases(messages.map((m) => m.content).join(' '), 5);
+      const analysis: ContentAnalysis = {
+        keywords,
+        topics: [title],
+        summary: description,
+        sentiment: 'neutral',
+        readingLevel: 'basic',
+      };
+      const og = OpenGraphGenerator.generateOGTags(channel, {}, analysis);
+      const twitter = OpenGraphGenerator.generateTwitterCard(channel, {}, analysis, og.ogImage);
+      const structuredData = StructuredDataGenerator.generateDiscussionForum(channel, messages, {});
+
+      return {
+        title,
+        description,
+        canonical: channel.canonicalUrl,
+        robots: getRobotsDirective(channel.visibility),
+        openGraph: og,
+        twitter,
+        structuredData,
+        keywords,
+        needsRegeneration: false,
+      };
+    } catch (err) {
+      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
+      return buildFallbackTags(channel);
+    }
+  },
+
+  /**
+   * Spec-aligned stub: generateMetaTags(channelId, options?).
+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
+   */
+  async generateMetaTags(
+    _channelId: string,
+    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
+  ): Promise<MetaTagSet> {
+    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  /**
+   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
+   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
+   */
+  async getOrGenerateCachedFromContext(
+    channel: ChannelContext,
+    messages: MessageContext[],
+    ttl?: number,
+  ): Promise<MetaTagSet> {
+    const cached = await MetaTagCache.get(channel.id);
+    if (cached) return cached;
+
+    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
+    // Do not cache fallback tags — a transient failure must not poison the cache for the full TTL
+    if (!tags.needsRegeneration) {
+      await MetaTagCache.set(channel.id, tags, ttl);
+    }
+    return tags;
+  },
+
+  /**
+   * Spec-aligned stub: getOrGenerateCached(channelId).
+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
+   */
+  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
+    throw new Error('getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  async invalidateCache(channelId: string): Promise<void> {
+    await MetaTagCache.invalidate(channelId);
+  },
+
+  // scheduleRegeneration and getRegenerationJobStatus are stubs —
+  // full implementation depends on M4 (worker/queue) from issue #356
+  async scheduleRegeneration(
+    channelId: string,
+    _priority?: 'high' | 'normal' | 'low',
+    _idempotencyKey?: string,
+  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
+    // Queuing logic wired by M4 MetaTagUpdateWorker
+    return {
+      jobId: `meta-tag-regeneration:${channelId}`,
+      status: 'queued',
+    };
+  },
+
+  async getRegenerationJobStatus(
+    _channelId: string,
+    _jobId: string,
+  ): Promise<MetaTagJobStatus> {
+    throw new Error('getRegenerationJobStatus not yet implemented — wired by M4 (issue #356)');
+  },
+
+  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
+    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
+  },
+
+  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
+    return `${BASE_URL}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(channelSlug)}`;
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/openGraphGenerator.ts b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
new file mode 100644
index 0000000..8ce445d
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
@@ -0,0 +1,60 @@
+// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
+import type { ChannelContext, OpenGraphTags, TwitterCardTags, MetaTagSet, IMetaTagGenerator, ContentAnalysis } from './types';
+
+const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
+const SITE_NAME = 'Harmony';
+const TWITTER_SITE = '@harmonychat';
+
+export const OpenGraphGenerator: IMetaTagGenerator & {
+  defaultImage: string;
+  // Spec §9.1.4: generateOGTags(channel, server, analysis)
+  generateOGTags(channel: ChannelContext, server: unknown, analysis: ContentAnalysis): OpenGraphTags;
+  // Spec §9.1.4: generateTwitterCard(channel, server, analysis)
+  generateTwitterCard(channel: ChannelContext, server: unknown, analysis: ContentAnalysis, image?: string): TwitterCardTags;
+  // Spec §9.1.4: selectPreviewImage(channel, messages): string | null
+  selectPreviewImage(channel: ChannelContext, messages: unknown[]): string | null;
+} = {
+  defaultImage: DEFAULT_IMAGE,
+
+  // M2 skeleton: title from analysis.topics[0], description from analysis.summary; full NLP integration by M4
+  generateOGTags(channel: ChannelContext, _server: unknown, analysis: ContentAnalysis): OpenGraphTags {
+    return {
+      ogTitle: analysis.topics[0] ?? channel.name,
+      ogDescription: analysis.summary,
+      ogImage: OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE,
+      ogType: 'website',
+      ogUrl: channel.canonicalUrl,
+      ogSiteName: SITE_NAME,
+    };
+  },
+
+  generateTwitterCard(
+    channel: ChannelContext,
+    _server: unknown,
+    analysis: ContentAnalysis,
+    image?: string,
+  ): TwitterCardTags {
+    const resolvedImage = image ?? OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE;
+    const isCustomImage = resolvedImage !== DEFAULT_IMAGE;
+    return {
+      card: isCustomImage ? 'summary_large_image' : 'summary',
+      title: analysis.topics[0] ?? channel.name,
+      description: analysis.summary,
+      image: resolvedImage,
+      site: TWITTER_SITE,
+    };
+  },
+
+  // M2 skeleton: always returns default image; real selection by M4 (messages/channel avatars)
+  selectPreviewImage(_channel: ChannelContext, _messages: unknown[]): string | null {
+    return DEFAULT_IMAGE;
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('OpenGraphGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('OpenGraphGenerator.validate() not yet implemented — wired by M4');
+  },
+};
diff --git a/harmony-backend/src/services/metaTag/titleGenerator.ts b/harmony-backend/src/services/metaTag/titleGenerator.ts
new file mode 100644
index 0000000..0365b11
--- /dev/null
+++ b/harmony-backend/src/services/metaTag/titleGenerator.ts
@@ -0,0 +1,65 @@
+// CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
+import type { ChannelContext, MessageContext, MetaTagSet, IMetaTagGenerator } from './types';
+
+const MAX_LENGTH = 60;
+
+const CHANNEL_TEMPLATE = '{channelName} — {serverName}';
+
+export const TitleGenerator: IMetaTagGenerator & {
+  maxLength: number;
+  generateFromChannel(channel: ChannelContext): string;
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string;
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string;
+  truncateWithEllipsis(text: string): string;
+  sanitizeForTitle(text: string): string;
+  applyTemplate(template: string, vars: Record<string, string>): string;
+} = {
+  maxLength: MAX_LENGTH,
+
+  generateFromChannel(channel: ChannelContext): string {
+    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(
+      '{serverName}',
+      channel.serverName,
+    );
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromMessage(message: MessageContext, channel: ChannelContext): string {
+    const raw = `${message.content} — ${channel.serverName}`;
+    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
+  },
+
+  generateFromThread(messages: MessageContext[], channel: ChannelContext): string {
+    if (messages.length === 0) {
+      return this.generateFromChannel(channel);
+    }
+    return this.generateFromMessage(messages[0], channel);
+  },
+
+  truncateWithEllipsis(text: string): string {
+    if (text.length <= MAX_LENGTH) return text;
+    return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
+  },
+
+  sanitizeForTitle(text: string): string {
+    return text
+      .replace(/<[^>]*>/g, '')
+      .replace(/\s+/g, ' ')
+      .trim();
+  },
+
+  applyTemplate(template: string, vars: Record<string, string>): string {
+    return Object.entries(vars).reduce(
+      (result, [key, value]) => result.replaceAll(`{${key}}`, value),
+      template,
+    );
+  },
+
+  // CL-I1 stubs — full generate/validate wired by M4
+  generate(): MetaTagSet {
+    throw new Error('TitleGenerator.generate() not yet implemented — wired by M4');
+  },
+  validate(): boolean {
+    throw new Error('TitleGenerator.validate() not yet implemented — wired by M4');
+  },
+};
```

#### Tool: exec_command

```sh
gh pr checks 443 --repo CS485-Harmony/Harmony
```

Output:

```text
Backend Lint and Build	pass	27s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348241/job/72385070627	
Frontend Lint and Build	pass	45s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348241/job/72385070585	
Run Backend Tests	pass	1m17s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348250/job/72385070682	
Run Frontend Tests	pass	29s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348281/job/72385070673	
Run Integration Tests	pass	1m55s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348272/job/72385070720	
Vercel Preview Comments	pass	0	https://vercel.com/github	
Run Cloud Integration Tests	skipping	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348272/job/72385071036	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/5zTWWgTJeiFv3xceGRb7k4dmejUJ	Deployment has completed
```

#### Tool: exec_command

```sh
git diff --name-only origin/main..pr-443
```

Output:

```text
.github/workflows/run-frontend-e2e.yml
docs/deployment/replica-readiness-audit.md
harmony-backend/src/events/eventBus.ts
harmony-backend/src/routes/events.router.ts
harmony-backend/src/services/metaTag/descriptionGenerator.ts
harmony-backend/src/services/metaTag/metaTagCache.ts
harmony-backend/src/services/metaTag/metaTagService.ts
harmony-backend/src/services/metaTag/openGraphGenerator.ts
harmony-backend/src/services/metaTag/structuredDataGenerator.ts
harmony-backend/src/services/metaTag/titleGenerator.ts
harmony-backend/src/services/metaTag/types.ts
harmony-backend/src/services/serverMember.service.ts
harmony-backend/tests/events.router.server.test.ts
harmony-backend/tests/events.router.test.ts
harmony-backend/tests/helpers/async.ts
harmony-backend/tests/metaTagService.test.ts
harmony-backend/tests/serverMember.test.ts
llm-logs/2026-04-20-094302-session-ce430386.md
llm-logs/2026-04-20-094337-session-e79268af.md
llm-logs/2026-04-20-100616-session-12bb34ec.md
llm-logs/2026-04-20-122835-session-b13d715d.md
llm-logs/declanblanc/claude-conversation-2026-04-18-b42b9611.md
llm-logs/declanblanc/claude-conversation-2026-04-20-c779de46.md
llm-logs/declanblanc/claude-conversation-2026-04-20-cc169300.md
tests/integration/attachments.test.ts
tests/integration/env.ts
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:35:59.808Z

The latest commit fixes the breadcrumb URL code path and method return annotations. I’m doing one final spec consistency pass on `StructuredData` and tests before posting approval or remaining findings.

#### Tool: exec_command

```sh
gh pr diff 443 --repo CS485-Harmony/Harmony --name-only && gh pr diff 443 --repo CS485-Harmony/Harmony --patch | rg -n "generateBreadcrumbList|encodeURIComponent\(channel.serverSlug\)|StructuredData|breadcrumb|buildCanonicalUrl|reserved characters" -C 5
```

Output:

````text
Total output lines: 638

harmony-backend/src/services/metaTag/descriptionGenerator.ts
harmony-backend/src/services/metaTag/metaTagCache.ts
harmony-backend/src/services/metaTag/metaTagService.ts
harmony-backend/src/services/metaTag/openGraphGenerator.ts
harmony-backend/src/services/metaTag/structuredDataGenerator.ts
harmony-backend/src/services/metaTag/titleGenerator.ts
harmony-backend/src/services/metaTag/types.ts
harmony-backend/tests/metaTagService.test.ts
llm-logs/2026-04-20-094302-session-ce430386.md
llm-logs/2026-04-20-122835-session-b13d715d.md
10-Adds CL-C2.1–C2.6 per dev spec §3/§4:
11-- MetaTagService facade with generateMetaTags, getOrGenerateCached,
12-  invalidateCache, and stub scheduleRegeneration/getRegenerationJobStatus
13-- TitleGenerator enforcing ≤60 char limit with sanitization and templates
14-- DescriptionGenerator enforcing 50–160 char range with key phrase extraction
15:- OpenGraphGenerator and StructuredDataGenerator (skeleton implementations)
16-- MetaTagCache backed by Redis via existing cacheService + CacheKeys.metaChannel
17-- AC-9: fallback tags with needsRegeneration=true on generation failure
18-- 28 unit tests covering AC-2 length limits, sanitization, cache, and fallback
19-
20-Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
--
131-@@ -0,0 +1,95 @@
132-+// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
133-+import { TitleGenerator } from './titleGenerator';
134-+import { DescriptionGenerator } from './descriptionGenerator';
135-+import { OpenGraphGenerator } from './openGraphGenerator';
136:+import { StructuredDataGenerator } from './structuredDataGenerator';
137-+import { MetaTagCache } from './metaTagCache';
138-+import type { MetaTagSet, ChannelContext, MessageContext } from './types';
139-+import { createLogger } from '../../lib/logger';
140-+
141-+const logger = createLogger({ component: 'meta-tag-service' });
--
150-+    description: DescriptionGenerator.enforceLength(description),
151-+    canonical: channel.canonicalUrl,
152-+    robots: 'index, follow',
153-+    openGraph: OpenGraphGenerator.generateOGTags(channel, title, description),
154-+    twitter: OpenGraphGenerator.generateTwitterCard(title, description),
155:+    structuredData: StructuredDataGenerator.generateDiscussionForum(channel, title, description),
156-+    keywords: [],
157-+    needsRegeneration: true,
158-+  };
159-+}
160-+
--
163-+    try {
164-+      const title = TitleGenerator.generateFromThread(messages, channel);
165-+      const description = DescriptionGenerator.generateFromMessages(messages, channel);
166-+      const og = OpenGraphGenerator.generateOGTags(channel, title, description);
167-+      const twitter = OpenGraphGenerator.generateTwitterCard(title, description, og.ogImage);
168:+      const structuredData = StructuredDataGenerator.generateDiscussionForum(
169-+        channel,
170-+        title,
171-+        description,
172-+      );
173-+      const keywords = DescriptionGenerator.extractKeyPhrases(messages);
--
218-+
219-+  async getMetaTagsForPreview(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
220-+    return this.generateMetaTags(channel, messages);
221-+  },
222-+
223:+  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
224-+    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;
225-+  },
226-+};
227-diff --git a/harmony-backend/src/services/metaTag/openGraphGenerator.ts b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
228-new file mode 100644
--
269-new file mode 100644
270-index 00000000..4b2b9eff
271---- /dev/null
272-+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
273-@@ -0,0 +1,60 @@
274:+// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
275:+import type { ChannelContext, StructuredData } from './types';
276-+
277:+export const StructuredDataGenerator = {
278:+  generateDiscussionForum(channel: ChannelContext, title: string, description: string): StructuredData {
279-+    return {
280-+      '@context': 'https://schema.org',
281-+      '@type': 'DiscussionForumPosting',
282-+      headline: title,
283-+      description,
--
286-+        url: channel.canonicalUrl,
287-+      },
288-+    };
289-+  },
290-+
291:+  generateBreadcrumbList(channel: ChannelContext): object {
292-+    return {
293-+      '@context': 'https://schema.org',
294-+      '@type': 'BreadcrumbList',
295-+      itemListElement: [
296-+        {
--
316-+      name: 'Harmony',
317-+      url: 'https://harmony.chat',
318-+    };
319-+  },
320-+
321:+  generateWebPage(channel: ChannelContext, title: string, description: string): StructuredData {
322-+    return {
323-+      '@context': 'https://schema.org',
324-+      '@type': 'WebPage',
325-+      headline: title,
326-+      description,
--
409-+  description: string;
410-+  image: string;
411-+  site: string;
412-+}
413-+
414:+export interface StructuredData {
415-+  '@context': string;
416-+  '@type': string;
417-+  headline: string;
418-+  description: string;
419-+  author?: object;
420-+  datePublished?: string;
421-+  dateModified?: string;
422-+  mainEntity?: object;
423:+  breadcrumb?: object;
424-+}
425-+
426-+export interface MetaTagSet {
427-+  title: string;
428-+  description: string;
429-+  canonical: string;
430-+  robots: string;
431-+  openGraph: OpenGraphTags;
432-+  twitter: TwitterCardTags;
433:+  structuredData: StructuredData;
434-+  keywords: string[];
435-+  needsRegeneration?: boolean;
436-+}
437-+
438-+export interface ContentAnalysis {
--
719-+    mockCacheService.invalidate.mockResolvedValue(undefined);
720-+    await metaTagService.invalidateCache('chan-001');
721-+    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
722-+  });
723-+
724:+  it('buildCanonicalUrl constructs correct path', () => {
725:+    const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
726-+    expect(url).toContain('/c/game-dev-hub/unity-physics-help');
727-+  });
728-+});
729-
730-From 898f94332cbe35434ecf4661c778ccb07927f1f0 Mon Sep 17 00:00:00 2001
--
1050-+
1051-+**Tool call: `Write`**
1052-+```json
1053-+{
1054-+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/tasks/todo.md",
1055:+  "content": "# Issue #350: Meta Tag Generation Service Skeleton (M2)\n\n## Tasks\n- [x] Create feature branch\n- [ ] Implement DTOs: MetaTagSet, OpenGraphTags, TwitterCardTags, StructuredData, ContentAnalysis\n- [ ] Implement IMetaTagGenerator interface\n- [ ] Implement TitleGenerator (CL-C2.2) \u2014 enforces \u226460 char limit\n- [ ] Implement DescriptionGenerator (CL-C2.3) \u2014 enforces 50-160 char range\n- [ ] Implement OpenGraphGenerator (CL-C2.4) \u2014 stub\n- [ ] Implement StructuredDataGenerator (CL-C2.5) \u2014 stub\n- [ ] Implement MetaTagCache (CL-C2.6) \u2014 Redis-backed via cacheService\n- [ ] Implement MetaTagService (CL-C2.1) \u2014 facade with fallback/needsRegeneration\n- [ ] Write unit tests for TitleGenerator, DescriptionGenerator, MetaTagCache, fallback behavior\n- [ ] Run tests and confirm passing\n- [ ] Post opening comment on issue\n- [ ] Commit and push\n\n## Review\nTBD\n"
1056-+}
1057-+```
1058-+
1059-+## Assistant
1060-+
--
1079-+
1080-+**Tool call: `Write`**
1081-+```json
1082-+{
1083-+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/tasks/todo.md",
1084:+  "content": "# Issue #350: Meta Tag Generation Service Skeleton (M2)\n\nGitHub Issue: https://github.com/CS485-Harmony/Harmony/issues/350\nBranch: `feature/issue-350-meta-tag-service-skeleton`\n\n## Tasks\n- [x] Create feature branch\n- [ ] Implement DTOs and IMetaTagGenerator interface\n- [ ] Implement TitleGenerator (CL-C2.2) \u2014 enforces \u226460 char limit\n- [ ] Implement DescriptionGenerator (CL-C2.3) \u2014 enforces 50-160 char range\n- [ ] Implement OpenGraphGenerator (CL-C2.4) \u2014 stub\n- [ ] Implement StructuredDataGenerator (CL-C2.5) \u2014 stub\n- [ ] Implement MetaTagCache (CL-C2.6) \u2014 Redis-backed via cacheService\n- [ ] Implement MetaTagService (CL-C2.1) \u2014 facade with fallback/needsRegeneration\n- [ ] Write unit tests\n- [ ] Run tests and confirm passing\n- [ ] Commit and push\n\n## Review\nTBD\n"
1085-+}
1086-+```
1087-+
1088-+## Assistant
1089-+
--
1093-+
1094-+**Tool call: `Write`**
1095-+```json
1096-+{
1097-+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/types.ts",
1098:+  "content": "// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)\n\nexport interface OpenGraphTags {\n  ogTitle: string;\n  ogDescription: string;\n  ogImage: string;\n  ogType: string;\n  ogUrl: string;\n  ogSiteName: string;\n}\n\nexport interface TwitterCardTags {\n  card: string;\n  title: string;\n  description: string;\n  image: string;\n  site: string;\n}\n\nexport interface StructuredData {\n  '@context': string;\n  '@type': string;\n  headline: string;\n  description: string;\n  author?: object;\n  datePublished?: string;\n  dateModified?: string;\n  mainEntity?: object;\n  breadcrumb?: object;\n}\n\nexport interface MetaTagSet {\n  title: string;\n  description: string;\n  canonical: string;\n  robots: string;\n  openGraph: OpenGraphTags;\n  twitter: TwitterCardTags;\n  structuredData: StructuredData;\n  keywords: string[];\n  needsRegeneration?: boolean;\n}\n\nexport interface ContentAnalysis {\n  keywords: string[];\n  topics: string[];\n  summary: string;\n  sentiment: string;\n  readingLevel: string;\n}\n\nexport interface IMetaTagGenerator {\n  generate(): MetaTagSet;\n  validate(): boolean;\n}\n\nexport interface ChannelContext {\n  id: string;\n  name: string;\n  slug: string;\n  topic?: string | null;\n  serverName: string;\n  serverSlug: string;\n  canonicalUrl: string;\n}\n\nexport interface MessageContext {\n  content: string;\n  createdAt: Date;\n  authorDisplayName?: string;\n}\n"
1099-+}
1100-+```
1101-+
1102-+## Assistant
1103-+
--
1133-+
1134-+**Tool call: `Write`**
1135-+```json
1136-+{
1137-+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/structuredDataGenerator.ts",
1138:+  "content": "// CL-C2.5 StructuredDataGenerator \u2014 generates JSON-LD structured data\nimport type { ChannelContext, StructuredData } from './types';\n\nexport const StructuredDataGenerator = {\n  generateDiscussionForum(channel: ChannelContext, title: string, description: string): StructuredData {\n    return {\n      '@context': 'https://schema.org',\n      '@type': 'DiscussionForumPosting',\n      headline: title,\n      description,\n      mainEntity: {\n        '@type': 'WebPage',\n        url: channel.canonicalUrl,\n      },\n    };\n  },\n\n  generateBreadcrumbList(channel: ChannelContext): object {\n    return {\n      '@context': 'https://schema.org',\n      '@type': 'BreadcrumbList',\n      itemListElement: [\n        {\n          '@type': 'ListItem',\n          position: 1,\n          name: channel.serverName,\n          item: `https://harmony.chat/s/${channel.serverSlug}`,\n        },\n        {\n          '@type': 'ListItem',\n          position: 2,\n          name: channel.name,\n          item: channel.canonicalUrl,\n        },\n      ],\n    };\n  },\n\n  generateOrganization(): object {\n    return {\n      '@context': 'https://schema.org',\n      '@type': 'Organization',\n      name: 'Harmony',\n      url: 'https://harmony.chat',\n    };\n  },\n\n  generateWebPage(channel: ChannelContext, title: string, description: string): StructuredData {\n    return {\n      '@context': 'https://schema.org',\n      '@type': 'WebPage',\n      headline: title,\n      description,\n      mainEntity: {\n        '@type': 'WebPage',\n        url: channel.canonicalUrl,\n      },\n    };\n  },\n};\n"
1139-+}
1140-+```
1141-+
1142-+## Assistant
1143-+
--
1175-+
1176-+**Tool call: `Write`**
1177-+```json
1178-+{
1179-+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/src/services/metaTag/metaTagService.ts",
1180:+  "content": "// CL-C2.1 MetaTagService \u2014 facade for meta tag generation, caching, and invalidation\nimport { TitleGenerator } from './titleGenerator';\nimport { DescriptionGenerator } from './descriptionGenerator';\nimport { OpenGraphGenerator } from './openGraphGenerator';\nimport { StructuredDataGenerator } from './structuredDataGenerator';\nimport { MetaTagCache } from './metaTagCache';\nimport type { MetaTagSet, ChannelContext, MessageContext } from './types';\nimport { createLogger } from '../../lib/logger';\n\nconst logger = createLogger({ component: 'meta-tag-service' });\n\nconst BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';\n\nfunction buildFallbackTags(channel: ChannelContext): MetaTagSet {\n  const title = `${channel.name} \u2014 ${channel.serverName}`;\n  const description = `Discussions in #${channel.name} on ${channel.serverName}.`;\n  return {\n    title: TitleGenerator.truncateWithEllipsis(title),\n    description: DescriptionGenerator.enforceLength(description),\n    canonical: channel.canonicalUrl,\n    robots: 'index, follow',\n    openGraph: OpenGraphGenerator.generateOGTags(channel, title, description),\n    twitter: OpenGraphGenerator.generateTwitterCard(title, description),\n    structuredData: StructuredDataGenerator.generateDiscussionForum(channel, title, description),\n    keywords: [],\n    needsRegeneration: true,\n  };\n}\n\nexport const metaTagService = {\n  async generateMetaTags(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {\n    try {\n      const title = TitleGenerator.generateFromThread(messages, channel);\n      const description = DescriptionGenerator.generateFromMessages(messages, channel);\n      const og = OpenGraphGenerator.generateOGTags(channel, title, description);\n      const twitter = OpenGraphGenerator.generateTwitterCard(title, description, og.ogImage);\n      const structuredData = StructuredDataGenerator.generateDiscussionForum(\n        channel,\n        title,\n        description,\n      );\n      const keywords = DescriptionGenerator.extractKeyPhrases(messages);\n\n      return {\n        title,\n        description,\n        canonical: channel.canonicalUrl,\n        robots: 'index, follow',\n        openGraph: og,\n        twitter,\n        structuredData,\n        keywords,\n        needsRegeneration: false,\n      };\n    } catch (err) {\n      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');\n      return buildFallbackTags(channel);\n    }\n  },\n\n  async getOrGenerateCached(\n    channel: ChannelContext,\n    messages: MessageContext[],\n    ttl?: number,\n  ): Promise<MetaTagSet> {\n    const cached = await MetaTagCache.get(channel.id);\n    if (cached) return cached;\n\n    const tags = await this.generateMetaTags(channel, messages);\n    await MetaTagCache.set(channel.id, tags, ttl);\n    return tags;\n  },\n\n  async invalidateCache(channelId: string): Promise<void> {\n    await MetaTagCache.invalidate(channelId);\n  },\n\n  // scheduleRegeneration and getRegenerationJobStatus are stubs \u2014\n  // full implementation depends on M4 (worker/queue) from issue #356\n  async scheduleRegeneration(_channelId: string): Promise<void> {\n    // Queuing logic wired by M4 MetaTagUpdateWorker\n  },\n\n  async getRegenerationJobStatus(_channelId: string): Promise<{ status: string } | null> {\n    return null;\n  },\n\n  async getMetaTagsForPreview(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {\n    return this.generateMetaTags(channel, messages);\n  },\n\n  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {\n    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;\n  },\n};\n"
1181-+}
1182-+```
1183-+
1184-+## Assistant
1185-+
--
1189-+
1190-+**Tool call: `Write`**
1191-+```json
1192-+{
1193-+  "file_path": "/Users/bigfa/Documents/GitHub/Harmony/harmony-backend/tests/metaTagService.test.ts",
1194:+  "content": "/**\n * Unit tests for M2 Meta Tag Generation Service skeleton \u2014 Issue #350\n *\n * Covers AC-2 (length limits), sanitization, template application,\n * and AC-9 (fallback on failure, needsRegeneration=true).\n *\n * MetaTagCache uses Redis via cacheService \u2014 mocked here for unit speed.\n */\n\njest.mock('../src/services/cache.service', () => ({\n  cacheService: {\n    get: jest.fn(),\n    set: jest.fn(),\n    invalidate: jest.fn(),\n    getOrRevalidate: jest.fn(),\n  },\n  CacheKeys: {\n    metaChannel: (id: string) => `meta:channel:${id}`,\n    channelVisibility: (id: string) => `channel:${id}:visibility`,\n    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,\n    serverInfo: (id: string) => `server:${id}:info`,\n    analysisChannel: (id: string) => `analysis:channel:${id}`,\n  },\n  sanitizeKeySegment: (s: string) => s.replace(/[*?\\[\\]]/g, ''),\n}));\n\nimport { TitleGenerator } from '../src/services/metaTag/titleGenerator';\nimport { DescriptionGenerator } from '../src/services/metaTag/descriptionGenerator';\nimport { MetaTagCache } from '../src/services/metaTag/metaTagCache';\nimport { metaTagService } from '../src/services/metaTag/metaTagService';\nimport { cacheService } from '../src/services/cache.service';\nimport type { ChannelContext, MessageContext } from '../src/services/metaTag/types';\n\nconst mockCacheService = cacheService as jest.Mocked<typeof cacheService>;\n\nconst channel: ChannelContext = {\n  id: 'chan-001',\n  name: 'unity-physics-help',\n  slug: 'unity-physics-help',\n  topic: 'Ask about Unity physics',\n  serverName: 'Game Dev Hub',\n  serverSlug: 'game-dev-hub',\n  canonicalUrl: 'https://harmony.chat/c/game-dev-hub/unity-physics-help',\n};\n\nconst messages: MessageContext[] = [\n  { content: 'How do I handle collision detection in Unity?', createdAt: new Date() },\n  { content: 'Use OnCollisionEnter for physics-based collisions.', createdAt: new Date() },\n];\n\nbeforeEach(() => {\n  jest.clearAllMocks();\n});\n\n// \u2500\u2500\u2500 TitleGenerator \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\ndescribe('TitleGenerator', () => {\n  it('maxLength is 60', () => {\n    expect(TitleGenerator.maxLength).toBe(60);\n  });\n\n  it('generateFromChannel produces title \u226460 chars', () => {\n    const title = TitleGenerator.generateFromChannel(channel);\n    expect(title.length).toBeLessThanOrEqual(60);\n  });\n\n  it('truncates long titles with ellipsis and stays \u226460 chars', () => {\n    const longChannel: ChannelContext = {\n      ...channel,\n      name: 'this-is-a-very-long-channel-name-that-exceeds-limits',\n      serverName: 'An Extremely Long Server Name That Will Overflow',\n    };\n    const title = TitleGenerator.generateFromChannel(longChannel);\n    expect(title.length).toBeLessThanOrEqual(60);\n    expect(title.endsWith('\u2026')).toBe(true);\n  });\n\n  it('sanitizeForTitle strips HTML tags', () => {\n    const result = TitleGenerator.sanitizeForTitle('<b>Hello</b> <em>world</em>');\n    expect(result).toBe('Hello world');\n  });\n\n  it('sanitizeForTitle collapses whitespace', () => {\n    const result = TitleGenerator.sanitizeForTitle('foo   bar\\n  baz');\n    expect(result).toBe('foo bar baz');\n  });\n\n  it('applyTemplate replaces template variables', () => {\n    const result = TitleGenerator.applyTemplate('{channelName} on {serverName}', {\n      channelName: 'general',\n      serverName: 'My Server',\n    });\n    expect(result).toBe('general on My Server');\n  });\n\n  it('generateFromThread falls back to channel when no messages', () => {\n    const title = TitleGenerator.generateFromThread([], channel);\n    expect(title).toBe(TitleGenerator.generateFromCh…3051 tokens truncated…eta-tag-service-skeleton`:
1436-+
1437-+**7 new files** under `harmony-backend/src/services/metaTag/`:
1438:+- `types.ts` — DTOs (MetaTagSet, OpenGraphTags, TwitterCardTags, StructuredData, ContentAnalysis) and `IMetaTagGenerator` interface
1439-+- `titleGenerator.ts` (CL-C2.2) — ≤60 char enforcement, HTML sanitization, template application
1440-+- `descriptionGenerator.ts` (CL-C2.3) — 50–160 char enforcement; extends short summaries with channel context so the floor holds even for 2-char messages
1441-+- `openGraphGenerator.ts` (CL-C2.4) — OG + Twitter Card generation
1442-+- `structuredDataGenerator.ts` (CL-C2.5) — JSON-LD skeleton
1443-+- `metaTagCache.ts` (CL-C2.6) — Redis-backed via existing `cacheService` + `CacheKeys.metaChannel`, 3600s default TTL
--
1602-  use replaceAll in applyTemplate to handle repeated placeholders
1603-- descriptionGenerator: add sanitizeText helper; sanitize channel fields
1604-  in summarizeThread; enforce 50-char minimum in enforceLength (AC-2)
1605-- openGraphGenerator: add channel param to generateTwitterCard; use
1606-  summary_large_image only when a real preview image is available
1607:- structuredDataGenerator: use BASE_URL env var in generateBreadcrumbList;
1608-  add stub datePublished/author fields to generateDiscussionForum
1609-- metaTagCache: make set() use this.ttl as single source of truth
1610-- metaTagService: sanitize channel context in buildFallbackTags; rename
1611-  internal methods to generateMetaTagsFromContext / getOrGenerateCachedFromContext;
1612-  add spec-aligned stub signatures for generateMetaTags(channelId),
--
1706-index f690baf1..7a95004f 100644
1707---- a/harmony-backend/src/services/metaTag/metaTagService.ts
1708-+++ b/harmony-backend/src/services/metaTag/metaTagService.ts
1709-@@ -4,36 +4,55 @@ import { DescriptionGenerator } from './descriptionGenerator';
1710- import { OpenGraphGenerator } from './openGraphGenerator';
1711: import { StructuredDataGenerator } from './structuredDataGenerator';
1712- import { MetaTagCache } from './metaTagCache';
1713--import type { MetaTagSet, ChannelContext, MessageContext } from './types';
1714-+import type {
1715-+  MetaTagSet,
1716-+  ChannelContext,
--
1744--    canonical: channel.canonicalUrl,
1745-+    canonical: safe.canonicalUrl,
1746-     robots: 'index, follow',
1747--    openGraph: OpenGraphGenerator.generateOGTags(channel, title, description),
1748--    twitter: OpenGraphGenerator.generateTwitterCard(title, description),
1749:-    structuredData: StructuredDataGenerator.generateDiscussionForum(channel, title, description),
1750-+    openGraph: OpenGraphGenerator.generateOGTags(safe, title, description),
1751-+    twitter: OpenGraphGenerator.generateTwitterCard(safe, title, description),
1752:+    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, title, description),
1753-     keywords: [],
1754-     needsRegeneration: true,
1755-   };
1756- }
1757- 
--
1766-       const title = TitleGenerator.generateFromThread(messages, channel);
1767-       const description = DescriptionGenerator.generateFromMessages(messages, channel);
1768-       const og = OpenGraphGenerator.generateOGTags(channel, title, description);
1769--      const twitter = OpenGraphGenerator.generateTwitterCard(title, description, og.ogImage);
1770-+      const twitter = OpenGraphGenerator.generateTwitterCard(channel, title, description, og.ogImage);
1771:       const structuredData = StructuredDataGenerator.generateDiscussionForum(
1772-         channel,
1773-         title,
1774-@@ -58,7 +77,22 @@ export const metaTagService = {
1775-     }
1776-   },
--
1780-+   * Spec-aligned stub: generateMetaTags(channelId, options?).
1781-+   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
1782-+   */
1783-+  async generateMetaTags(
1784-+    _channelId: string,
1785:+    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
1786-+  ): Promise<MetaTagSet> {
1787-+    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
1788-+  },
1789-+
1790-+  /**
--
1846--    return this.generateMetaTags(channel, messages);
1847-+  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
1848-+    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
1849-   },
1850- 
1851:   buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
1852-diff --git a/harmony-backend/src/services/metaTag/openGraphGenerator.ts b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
1853-index 163c6552..db6a78a9 100644
1854---- a/harmony-backend/src/services/metaTag/openGraphGenerator.ts
1855-+++ b/harmony-backend/src/services/metaTag/openGraphGenerator.ts
1856-@@ -19,12 +19,19 @@ export const OpenGraphGenerator = {
--
1879-diff --git a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
1880-index 4b2b9eff..4a765ad7 100644
1881---- a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
1882-+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
1883-@@ -1,6 +1,8 @@
1884: // CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
1885: import type { ChannelContext, StructuredData } from './types';
1886- 
1887-+const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
1888-+
1889: export const StructuredDataGenerator = {
1890:   generateDiscussionForum(channel: ChannelContext, title: string, description: string): StructuredData {
1891-     return {
1892:@@ -8,6 +10,10 @@ export const StructuredDataGenerator = {
1893-       '@type': 'DiscussionForumPosting',
1894-       headline: title,
1895-       description,
1896-+      // author and datePublished are stub fields — populated by M4 when message data is available
1897-+      author: undefined,
1898-+      datePublished: undefined,
1899-+      dateModified: undefined,
1900-       mainEntity: {
1901-         '@type': 'WebPage',
1902-         url: channel.canonicalUrl,
1903:@@ -24,7 +30,7 @@ export const StructuredDataGenerator = {
1904-           '@type': 'ListItem',
1905-           position: 1,
1906-           name: channel.serverName,
1907--          item: `https://harmony.chat/s/${channel.serverSlug}`,
1908-+          item: `${BASE_URL}/s/${channel.serverSlug}`,
--
3005-+## Assistant
3006-+
3007-+**Tool call: `Bash`**
3008-+```json
3009-+{
3010:+  "command": "HASH=85d862f\n\nnpx agent-reviews --reply 4140583007 \"Thanks for the detailed review. Here's the status of each item:\n\n1. **Method signatures** \u2014 Already addressed in the prior fix commit (177c384): generateMetaTags(channelId, options?), getOrGenerateCached(channelId), scheduleRegeneration returns Promise<{jobId,status}>, getRegenerationJobStatus(channelId, jobId), getMetaTagsForPreview returns Promise<MetaTagPreview>.\n\n2. **IMetaTagGenerator (CL-I1)** \u2014 Fixed in ${HASH}. Added generate()/validate() stubs to TitleGenerator, DescriptionGenerator, and OpenGraphGenerator so all three satisfy the interface structurally. Full implementation wired by M4.\n\n3. **enforceLength minimum** \u2014 Already fixed in 898f943: enforceLength() now pads short text by appending from an additions array until \u226550 chars.\n\n4. **Hardcoded BASE_URL** \u2014 Already using process.env.BASE_URL ?? 'https://harmony.chat' in structuredDataGenerator.ts (line 4) and generateBreadcrumbList uses \\${BASE_URL}/s/\\${channel.serverSlug}.\n\n5. **Twitter card type** \u2014 Already conditional: generateTwitterCard() uses isCustomImage ? 'summary_large_image' : 'summary', defaulting to summary when no custom image is available.\n\n6. **generateDiscussionForum JSON-LD fields** \u2014 author, datePublished, and dateModified are present in the return object as explicit undefined stubs. The StructuredData interface includes all three as optional fields. These will be populated by M4 when message data is wired.\n\n7. **Pre-existing test failure** \u2014 metaTag.repository.test.ts passes locally against the current schema. The CI failure appears to be an environment issue (missing migration in CI). Tracked separately from this skeleton PR.\" --resolve 2>&1",
3011-+  "description": "Reply to declanblanc's review"
3012-+}
3013-+```
3014-+
3015-+## Assistant
--
3180-Content-Transfer-Encoding: 8bit
3181-
3182-- Align generator signatures to spec §9.1: extractKeyPhrases(content, maxPhrases),
3183-  summarizeThread(messages), generateOGTags/generateTwitterCard(channel, server, analysis),
3184-  selectPreviewImage(channel, messages), generateDiscussionForum(channel, messages, server),
3185:  generateBreadcrumbList(server, channel), generateOrganization(server),
3186-  generateWebPage(channel, metaTags)
3187-- Fix this-binding hazard in OpenGraphGenerator (selectPreviewImage calls)
3188-- Do not cache fallback tags when needsRegeneration=true — prevents transient failures
3189-  from poisoning the Redis cache for the full TTL
3190-- Fix getRegenerationJobStatus: remove | null, throw not-implemented to match spec contract
--
3318-     description: DescriptionGenerator.enforceLength(description),
3319-     canonical: safe.canonicalUrl,
3320-     robots: 'index, follow',
3321--    openGraph: OpenGraphGenerator.generateOGTags(safe, title, description),
3322--    twitter: OpenGraphGenerator.generateTwitterCard(safe, title, description),
3323:-    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, title, description),
3324-+    openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
3325-+    twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
3326:+    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
3327-     keywords: [],
3328-     needsRegeneration: true,
3329-   };
3330-@@ -51,14 +59,17 @@ export const metaTagService = {
3331-     try {
3332-       const title = TitleGenerator.generateFromThread(messages, channel);
3333-       const description = DescriptionGenerator.generateFromMessages(messages, channel);
3334--      const og = OpenGraphGenerator.generateOGTags(channel, title, description);
3335--      const twitter = OpenGraphGenerator.generateTwitterCard(channel, title, description, og.ogImage);
3336:-      const structuredData = StructuredDataGenerator.generateDiscussionForum(
3337--        channel,
3338--        title,
3339--        description,
3340--      );
3341--      const keywords = DescriptionGenerator.extractKeyPhrases(messages);
--
3347-+        sentiment: 'neutral',
3348-+        readingLevel: 'basic',
3349-+      };
3350-+      const og = OpenGraphGenerator.generateOGTags(channel, {}, analysis);
3351-+      const twitter = OpenGraphGenerator.generateTwitterCard(channel, {}, analysis, og.ogImage);
3352:+      const structuredData = StructuredDataGenerator.generateDiscussionForum(channel, messages, {});
3353- 
3354-       return {
3355-         title,
3356-@@ -101,7 +112,10 @@ export const metaTagService = {
3357-     if (cached) return cached;
--
3449-diff --git a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
3450-index 4a765ad7..24adea2f 100644
3451---- a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
3452-+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
3453-@@ -1,15 +1,17 @@
3454: // CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
3455:-import type { ChannelContext, StructuredData } from './types';
3456:+import type { ChannelContext, MessageContext, MetaTagSet, StructuredData } from './types';
3457- 
3458- const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
3459- 
3460: export const StructuredDataGenerator = {
3461:-  generateDiscussionForum(channel: ChannelContext, title: string, description: string): StructuredData {
3462-+  // Spec §9.1.5: generateDiscussionForum(channel, messages, server)
3463-+  // M2 skeleton: derived from channel context; message/server integration by M4
3464:+  generateDiscussionForum(channel: ChannelContext, _messages: MessageContext[], _server: unknown): StructuredData {
3465-     return {
3466-       '@context': 'https://schema.org',
3467-       '@type': 'DiscussionForumPosting',
3468--      headline: title,
3469--      description,
3470-+      headline: `${channel.name} — ${channel.serverName}`,
3471-+      description: `Discussions in #${channel.name} on ${channel.serverName}.`,
3472-       // author and datePublished are stub fields — populated by M4 when message data is available
3473-       author: undefined,
3474-       datePublished: undefined,
3475:@@ -21,7 +23,8 @@ export const StructuredDataGenerator = {
3476-     };
3477-   },
3478- 
3479:-  generateBreadcrumbList(channel: ChannelContext): object {
3480:+  // Spec §9.1.5: generateBreadcrumbList(server, channel)
3481:+  generateBreadcrumbList(_server: unknown, channel: ChannelContext): object {
3482-     return {
3483-       '@context': 'https://schema.org',
3484-       '@type': 'BreadcrumbList',
3485:@@ -42,21 +45,23 @@ export const StructuredDataGenerator = {
3486-     };
3487-   },
3488- 
3489--  generateOrganization(): object {
3490-+  // Spec §9.1.5: generateOrganization(server)
--
3496--      url: 'https://harmony.chat',
3497-+      url: BASE_URL,
3498-     };
3499-   },
3500- 
3501:-  generateWebPage(channel: ChannelContext, title: string, description: string): StructuredData {
3502-+  // Spec §9.1.5: generateWebPage(channel, metaTags)
3503:+  generateWebPage(channel: ChannelContext, metaTags: MetaTagSet): StructuredData {
3504-     return {
3505-       '@context': 'https://schema.org',
3506-       '@type': 'WebPage',
3507--      headline: title,
3508--      description,
--
3601-Content-Transfer-Encoding: 8bit
3602-
3603-- Add ChannelVisibility type and optional visibility field to ChannelContext
3604-- Derive robots directive from visibility: PUBLIC_INDEXABLE → index,follow;
3605-  PUBLIC_NO_INDEX → noindex,follow; PRIVATE → noindex,nofollow
3606:- Encode serverSlug and channelSlug with encodeURIComponent in buildCanonicalUrl
3607:  to prevent reserved characters from producing invalid canonical links
3608-- Add tests for all three visibility → robots mappings and for URL encoding
3609-
3610-Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
3611----
3612- .../src/services/metaTag/metaTagService.ts    | 14 +++++++--
--
3646-     canonical: safe.canonicalUrl,
3647--    robots: 'index, follow',
3648-+    robots: getRobotsDirective(safe.visibility),
3649-     openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
3650-     twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
3651:     structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
3652-@@ -75,7 +83,7 @@ export const metaTagService = {
3653-         title,
3654-         description,
3655-         canonical: channel.canonicalUrl,
3656--        robots: 'index, follow',
--
3659-         twitter,
3660-         structuredData,
3661-@@ -157,6 +165,6 @@ export const metaTagService = {
3662-   },
3663- 
3664:   buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
3665--    return `${BASE_URL}/c/${serverSlug}/${channelSlug}`;
3666-+    return `${BASE_URL}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(channelSlug)}`;
3667-   },
3668- };
3669-diff --git a/harmony-backend/src/services/metaTag/types.ts b/harmony-backend/src/services/metaTag/types.ts
--
3691-diff --git a/harmony-backend/tests/metaTagService.test.ts b/harmony-backend/tests/metaTagService.test.ts
3692-index 8b04f986..20e1da85 100644
3693---- a/harmony-backend/tests/metaTagService.test.ts
3694-+++ b/harmony-backend/tests/metaTagService.test.ts
3695-@@ -291,4 +291,35 @@ describe('metaTagService', () => {
3696:     const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
3697-     expect(url).toContain('/c/game-dev-hub/unity-physics-help');
3698-   });
3699-+
3700:+  it('buildCanonicalUrl encodes reserved characters in slug segments', () => {
3701:+    const url = metaTagService.buildCanonicalUrl('my server', 'q&a channel');
3702-+    expect(url).toContain('/c/my%20server/q%26a%20channel');
3703-+    expect(url).not.toContain(' ');
3704-+    expect(url).not.toContain('&');
3705-+  });
3706-+
--
3730- });
3731-
3732-From 3bb2ff7b8897157f1d64be80739a29833bdee1e5 Mon Sep 17 00:00:00 2001
3733-From: Avanish Kulkarni <55012494+AvanishKulkarni@users.noreply.github.com>
3734-Date: Tue, 21 Apr 2026 15:33:28 -0400
3735:Subject: [PATCH 9/9] fix: align StructuredDataGenerator return types and
3736: encode breadcrumb serverSlug
3737-MIME-Version: 1.0
3738-Content-Type: text/plain; charset=UTF-8
3739-Content-Transfer-Encoding: 8bit
3740-
3741:- Make StructuredData.headline/description optional and add index signature so
3742-  BreadcrumbList and Organization objects satisfy the spec §9.1.5 return type
3743:- Change generateBreadcrumbList and generateOrganization return types from
3744:  object to StructuredData, matching the spec contract
3745:- Encode serverSlug with encodeURIComponent in generateBreadcrumbList item URL,
3746:  consistent with buildCanonicalUrl and the existing sitemap generator
3747-
3748-Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
3749----
3750- .../src/services/metaTag/structuredDataGenerator.ts    | 10 +++++-----
3751- harmony-backend/src/services/metaTag/types.ts          |  5 +++--
--
3753-
3754-diff --git a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
3755-index 24adea2f..9729f506 100644
3756---- a/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
3757-+++ b/harmony-backend/src/services/metaTag/structuredDataGenerator.ts
3758:@@ -23,8 +23,8 @@ export const StructuredDataGenerator = {
3759-     };
3760-   },
3761- 
3762:-  // Spec §9.1.5: generateBreadcrumbList(server, channel)
3763:-  generateBreadcrumbList(_server: unknown, channel: ChannelContext): object {
3764:+  // Spec §9.1.5: generateBreadcrumbList(server, channel): StructuredData
3765:+  generateBreadcrumbList(_server: unknown, channel: ChannelContext): StructuredData {
3766-     return {
3767-       '@context': 'https://schema.org',
3768-       '@type': 'BreadcrumbList',
3769:@@ -33,7 +33,7 @@ export const StructuredDataGenerator = {
3770-           '@type': 'ListItem',
3771-           position: 1,
3772-           name: channel.serverName,
3773--          item: `${BASE_URL}/s/${channel.serverSlug}`,
3774:+          item: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,
3775-         },
3776-         {
3777-           '@type': 'ListItem',
3778:@@ -45,8 +45,8 @@ export const StructuredDataGenerator = {
3779-     };
3780-   },
3781- 
3782--  // Spec §9.1.5: generateOrganization(server)
3783--  generateOrganization(_server: unknown): object {
3784:+  // Spec §9.1.5: generateOrganization(server): StructuredData
3785:+  generateOrganization(_server: unknown): StructuredData {
3786-     return {
3787-       '@context': 'https://schema.org',
3788-       '@type': 'Organization',
3789-diff --git a/harmony-backend/src/services/metaTag/types.ts b/harmony-backend/src/services/metaTag/types.ts
3790-index 12d95e09..9c319baf 100644
3791---- a/harmony-backend/src/services/metaTag/types.ts
3792-+++ b/harmony-backend/src/services/metaTag/types.ts
3793-@@ -20,13 +20,14 @@ export interface TwitterCardTags {
3794: export interface StructuredData {
3795-   '@context': string;
3796-   '@type': string;
3797--  headline: string;
3798--  description: string;
3799-+  headline?: string;
3800-+  description?: string;
3801-   author?: object;
3802-   datePublished?: string;
3803-   dateModified?: string;
3804-   mainEntity?: object;
3805:   breadcrumb?: object;
3806-+  [key: string]: unknown;
3807- }
3808- 
3809- export interface MetaTagSet {
````

#### Tool: exec_command

```sh
sed -n '2145,2178p' docs/dev-spec-seo-meta-tag-generation.md && sed -n '2477,2492p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
#### 9.1.5 CL-C2.5 StructuredDataGenerator

**Public Methods:**

```typescript
// Generate DiscussionForumPosting schema
generateDiscussionForum(
  channel: Channel,
  messages: Message[],
  server: Server
): StructuredData

// Generate BreadcrumbList schema
generateBreadcrumbList(
  server: Server,
  channel: Channel
): StructuredData

// Generate Organization schema
generateOrganization(
  server: Server
): StructuredData

// Generate WebPage schema
generateWebPage(
  channel: Channel,
  metaTags: MetaTagSet
): StructuredData
```

### 9.2 Module M3: Content Analysis

#### 9.2.1 CL-C3.1 ContentAnalyzer

#### 9.5.4 CL-D4 StructuredData

```typescript
interface StructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: Person;
  datePublished: string;
  dateModified: string;
  mainEntity: object;
  breadcrumb: object;
}
```
````

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/structuredDataGenerator.ts | nl -ba | sed -n '1,90p'; git show pr-443:harmony-backend/src/services/metaTag/types.ts | nl -ba | sed -n '15,35p'
```

Output:

```text
     1	// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
     2	import type { ChannelContext, MessageContext, MetaTagSet, StructuredData } from './types';
     3	
     4	const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';
     5	
     6	export const StructuredDataGenerator = {
     7	  // Spec §9.1.5: generateDiscussionForum(channel, messages, server)
     8	  // M2 skeleton: derived from channel context; message/server integration by M4
     9	  generateDiscussionForum(channel: ChannelContext, _messages: MessageContext[], _server: unknown): StructuredData {
    10	    return {
    11	      '@context': 'https://schema.org',
    12	      '@type': 'DiscussionForumPosting',
    13	      headline: `${channel.name} — ${channel.serverName}`,
    14	      description: `Discussions in #${channel.name} on ${channel.serverName}.`,
    15	      // author and datePublished are stub fields — populated by M4 when message data is available
    16	      author: undefined,
    17	      datePublished: undefined,
    18	      dateModified: undefined,
    19	      mainEntity: {
    20	        '@type': 'WebPage',
    21	        url: channel.canonicalUrl,
    22	      },
    23	    };
    24	  },
    25	
    26	  // Spec §9.1.5: generateBreadcrumbList(server, channel): StructuredData
    27	  generateBreadcrumbList(_server: unknown, channel: ChannelContext): StructuredData {
    28	    return {
    29	      '@context': 'https://schema.org',
    30	      '@type': 'BreadcrumbList',
    31	      itemListElement: [
    32	        {
    33	          '@type': 'ListItem',
    34	          position: 1,
    35	          name: channel.serverName,
    36	          item: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,
    37	        },
    38	        {
    39	          '@type': 'ListItem',
    40	          position: 2,
    41	          name: channel.name,
    42	          item: channel.canonicalUrl,
    43	        },
    44	      ],
    45	    };
    46	  },
    47	
    48	  // Spec §9.1.5: generateOrganization(server): StructuredData
    49	  generateOrganization(_server: unknown): StructuredData {
    50	    return {
    51	      '@context': 'https://schema.org',
    52	      '@type': 'Organization',
    53	      name: 'Harmony',
    54	      url: BASE_URL,
    55	    };
    56	  },
    57	
    58	  // Spec §9.1.5: generateWebPage(channel, metaTags)
    59	  generateWebPage(channel: ChannelContext, metaTags: MetaTagSet): StructuredData {
    60	    return {
    61	      '@context': 'https://schema.org',
    62	      '@type': 'WebPage',
    63	      headline: metaTags.title,
    64	      description: metaTags.description,
    65	      mainEntity: {
    66	        '@type': 'WebPage',
    67	        url: channel.canonicalUrl,
    68	      },
    69	    };
    70	  },
    71	};
    15	  description: string;
    16	  image: string;
    17	  site: string;
    18	}
    19	
    20	export interface StructuredData {
    21	  '@context': string;
    22	  '@type': string;
    23	  headline?: string;
    24	  description?: string;
    25	  author?: object;
    26	  datePublished?: string;
    27	  dateModified?: string;
    28	  mainEntity?: object;
    29	  breadcrumb?: object;
    30	  [key: string]: unknown;
    31	}
    32	
    33	export interface MetaTagSet {
    34	  title: string;
    35	  description: string;
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:36:50.207Z

I’m reviewing the latest PR head against the repo’s review workflow and the SEO meta-tag spec, then I’ll post the resulting GitHub review rather than stopping at local notes.

#### Tool: exec_command

```sh
git status --short && git rev-parse --show-toplevel && git rev-parse HEAD
```

Output:

```text
/Users/allen/.codex/worktrees/1042/Harmony
951a3dafe6b49c02fa5805197ab0195bae8bec09
```

#### Tool: exec_command

```sh
sed -n '1,220p' .github/PR_REVIEW.md
```

Output:

```text
# PR Review Guidelines

When conducting PR Reviews, follow these guidelines:
1. **Prioritize Logic over Style:** Ensure the code is efficient, DRY (Don't Repeat Yourself), and logically sound.
2. **Security First:** Verify that the changes do not introduce vulnerabilities (e.g., lack of input validation, exposed secrets).
3. **Architectural Alignment:** If applicable, ensure the changes adhere strictly to the patterns defined in `@../docs/unified-backend-architecture.md`.
4. **Issue Completion:** If the PR is attached to an issue, verify that the code successfully satisfies every acceptance criteria of that issue.
5. **No Nitpicking:** Do not leave comments regarding stylistic choices, formatting, or subjective naming conventions unless they violate core project readability. Focus only on critical logic, performance, or architectural flaws.
6. **Avoid Repetition:** Do not repeat feedback that has already been stated in previous reviews on this PR.
7. **Iterative Reviews:** If this is not your first review on the PR:
    - First, check if the new commits have correctly addressed your previous review comments.
    - If a previous concern has been addressed, explicitly resolve the associated comment.
8. **Prevent CI Failures:** Analyze the code for obvious issues that would break the pipeline. Specifically check for syntax errors, missing imports/dependencies, unhandled exceptions, and logic that would clearly break existing tests.

**Execution Instruction**: Before providing your code feedback, output a markdown checklist of the 8 guidelines above. Mark each one as [x] if it passes or [ ] if it fails, and briefly explain why. Then, provide your single bundled review. Use inline subcomments within that single review for specific lines of codes. Do not post multiple standalone comments.
```

#### Tool: exec_command

```sh
sed -n '1,180p' WORKFLOW.md
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

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:36:58.238Z

The review instructions are loaded. I’m now refreshing PR #443 metadata, checks, review threads, and the actual changed files so the approval/request decision is based on the latest pushed commit.

#### Tool: exec_command

```sh
git fetch origin main pull/443/head:pr-443 --force
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            main       -> FETCH_HEAD
```

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json title,headRefOid,reviewDecision,body,latestReviews,commits
```

Output:

````text
Total output lines: 1

{"body":"## Summary\n\n- Implements CL-C2.1–C2.6 per dev spec §3/§4 under `harmony-backend/src/services/metaTag/`\n- `MetaTagService` — facade with spec-aligned stubs for `generateMetaTags`, `getOrGenerateCached`, `scheduleRegeneration`, `getRegenerationJobStatus`, `getMetaTagsForPreview`, and context-based helpers for unit testing; full wiring by M4 (issue #356)\n- `TitleGenerator` — enforces ≤60 char limit with HTML sanitization and template application (AC-2)\n- `DescriptionGenerator` — enforces 50–160 char range; spec-aligned `extractKeyPhrases(content, maxPhrases)` and `summarizeThread(messages)` signatures; channel context handled in `generateFromMessages` (AC-2)\n- `OpenGraphGenerator` — spec-aligned `generateOGTags(channel, server, analysis)`, `generateTwitterCard(channel, server, analysis, image?)`, `selectPreviewImage(channel, messages): string | null`; Twitter card defaults to `summary`, upgrades to `summary_large_image` only when a non-default image is present\n- `StructuredDataGenerator` — spec-aligned `generateDiscussionForum(channel, messages, server)`, `generateBreadcrumbList(server, channel)`, `generateOrganization(server)`, `generateWebPage(channel, metaTags)`; `datePublished`/`author`/`dateModified` stub fields present for downstream consumers; `BASE_URL` env var used throughout\n- `MetaTagCache` — Redis-backed via existing `cacheService` + `CacheKeys.metaChannel` with configurable TTL (default 3600s per spec D7.1); fallback tags (`needsRegeneration: true`) are never written to cache to prevent transient failures from poisoning the cache for the full TTL\n- `MetaTagJobStatus` — includes `errorCode: string | null` and `errorMessage: string | null` per OpenAPI schema\n- `ChannelContext` — includes `visibility?: ChannelVisibility`; robots directive derived from visibility (`PUBLIC_INDEXABLE` → `index, follow`, `PUBLIC_NO_INDEX` → `noindex, follow`, `PRIVATE` → `noindex, nofollow`)\n- `buildCanonicalUrl` — slug segments encoded with `encodeURIComponent` to prevent reserved characters from producing invalid canonical links\n- AC-9 fallback: on any generation error, `MetaTagService` returns channel-name-based fallback tags with `needsRegeneration: true`\n- 37 unit tests covering AC items, visibility→robots mapping, URL encoding, and cache-fallback regression\n\n## Test plan\n\n- [x] All 37 unit tests pass (`npx jest tests/metaTagService.test.ts`)\n- [x] No regressions in existing test suite (687 tests pass, including `metaTag.repository.test.ts`)\n- [x] TypeScript compiles cleanly (`tsc --noEmit`)\n- [x] ESLint passes (no errors)\n\nCloses #350\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","commits":[{"authoredDate":"2026-04-20T13:39:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:39:37Z","messageBody":"…350)\n\nAdds CL-C2.1–C2.6 per dev spec §3/§4:\n- MetaTagService facade with generateMetaTags, getOrGenerateCached,\n  invalidateCache, and stub scheduleRegeneration/getRegenerationJobStatus\n- TitleGenerator enforcing ≤60 char limit with sanitization and templates\n- DescriptionGenerator enforcing 50–160 char range with key phrase extraction\n- OpenGraphGenerator and StructuredDataGenerator (skeleton implementations)\n- MetaTagCache backed by Redis via existing cacheService + CacheKeys.metaChannel\n- AC-9: fallback tags with needsRegeneration=true on generation failure\n- 28 unit tests covering AC-2 length limits, sanitization, cache, and fallback\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat(seo): implement M2 meta tag generation service skeleton (issue #…","oid":"e8875f5e9ef5220b017e4b2e855d8d576a8a0713"},{"authoredDate":"2026-04-20T13:42:00Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T13:42:00Z","messageBody":"Extends summarizeThread to append channel context when the composed\ntext falls below the 50-char minimum, satisfying AC-2 for all inputs\nincluding single-word messages. Adds a regression test.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix(seo): enforce 50-char minimum on auto-generated descriptions (AC-2)","oid":"898f94332cbe35434ecf4661c778ccb07927f1f0"},{"authoredDate":"2026-04-20T13:43:04Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T13:43:04Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"94fa035019a4c79638d269724697d5433e7563bc"},{"authoredDate":"2026-04-20T14:27:39Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T14:27:39Z","messageBody":"- titleGenerator: sanitize full composed string in generateFromMessage;\n  use replaceAll in applyTemplate to handle repeated placeholders\n- descriptionGenerator: add sanitizeText helper; sanitize channel fields\n  in summarizeThread; enforce 50-char minimum in enforceLength (AC-2)\n- openGraphGenerator: add channel param to generateTwitterCard; use\n  summary_large_image only when a real preview image is available\n- structuredDataGenerator: use BASE_URL env var in generateBreadcrumbList;\n  add stub datePublished/author fields to generateDiscussionForum\n- metaTagCache: make set() use this.ttl as single source of truth\n- metaTagService: sanitize channel context in buildFallbackTags; rename\n  internal methods to generateMetaTagsFromContext / getOrGenerateCachedFromContext;\n  add spec-aligned stub signatures for generateMetaTags(channelId),\n  getOrGenerateCached(channelId), getMetaTagsForPreview(channelId);\n  fix scheduleRegeneration return type and getRegenerationJobStatus signature\n- types: add MetaTagPreview and MetaTagJobStatus interfaces per spec\n- regenerate Prisma client; apply add_meta_tag_overrides migration so\n  metaTag.repository tests compile and pass\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings for M2 meta tag service skeleton","oid":"177c3840e118d1c429fe3cd0f10bc40ad842eb32"},{"authoredDate":"2026-04-20T16:26:29Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-20T16:26:29Z","messageBody":"… stubs, scheduleRegeneration return)\n\n- Replace this.generateMetaTagsFromContext with metaTagService.* to avoid destructuring hazard\n- Replace this.ttl with DEFAULT_TTL in MetaTagCache.set to avoid destructuring hazard\n- Remove extra priority/idempotencyKey fields from scheduleRegeneration return to match declared type\n- Add IMetaTagGenerator generate()/validate() stubs to TitleGenerator, DescriptionGenerator, OpenGraphGenerator (CL-I1)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings (this-binding, IMetaTagGenerator…","oid":"85d862fcc5f85f782368504916607f4eb1e45164"},{"authoredDate":"2026-04-20T16:28:37Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-20T16:28:37Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"c3a7a608c10576b751659ca1926be95566392b28"},{"authoredDate":"2026-04-21T19:19:46Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:19:46Z","messageBody":"…k, contract alignment\n\n- Align generator signatures to spec §9.1: extractKeyPhrases(content, maxPhrases),\n  summarizeThread(messages), generateOGTags/generateTwitterCard(channel, server, analysis),\n  selectPreviewImage(channel, messages), generateDiscussionForum(channel, messages, server),\n  generateBreadcrumbList(server, channel), generateOrganization(server),\n  generateWebPage(channel, metaTags)\n- Fix this-binding hazard in OpenGraphGenerator (selectPreviewImage calls)\n- Do not cache fallback tags when needsRegeneration=true — prevents transient failures\n  from poisoning the Redis cache for the full TTL\n- Fix getRegenerationJobStatus: remove | null, throw not-implemented to match spec contract\n- Add errorCode/errorMessage fields to MetaTagJobStatus per spec §9.1 / OpenAPI schema\n- Add regression test: getOrGenerateCachedFromContext must not write to cache on failure\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR #443 review findings — spec signatures, cache fallbac…","oid":"883e71d96e3e7c383767da13cc6331a61b3b074d"},{"authoredDate":"2026-04-21T19:26:04Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:26:04Z","messageBody":"…ents\n\n- Add ChannelVisibility type and optional visibility field to ChannelContext\n- Derive robots directive from visibility: PUBLIC_INDEXABLE → index,follow;\n  PUBLIC_NO_INDEX → noindex,follow; PRIVATE → noindex,nofollow\n- Encode serverSlug and channelSlug with encodeURIComponent in buildCanonicalUrl\n  to prevent reserved characters from producing invalid canonical links\n- Add tests for all three visibility → robots mappings and for URL encoding\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: derive robots from channel visibility, encode canonical URL segm…","oid":"b5a5950f129a9aa73b77045e0c827a140b466ffb"},{"authoredDate":"2026-04-21T19:33:28Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-21T19:33:28Z","messageBody":"… serverSlug\n\n- Make StructuredData.headline/description optional and add index signature so\n  BreadcrumbList and Organization objects satisfy the spec §9.1.5 return type\n- Change generateBreadcrumbList and generateOrganization return types from\n  object to StructuredData, matching the spec contract\n- Encode serverSlug with encodeURIComponent in generateBreadcrumbList item URL,\n  consistent with buildCanonicalUrl and the existing sitemap generator\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: align StructuredDataGenerator return types and encode breadcrumb…","oid":"3bb2ff7b8897157f1d64be80739a29833bdee1e5"}],"headRefOid":"3bb2ff7b8897157f1d64be80739a29833bdee1e5","latestReviews":[{"id":"","author":{"login":"copilot-pull-request-reviewer"},"authorAssociation":"CONTRIBUTOR","body":"## Pull request overview\n\nIntroduces the backend skeleton for M2 SEO meta tag generation under `harmony-backend/src/services/metaTag/`, including generators, a Redis-backed cache, and unit tests to validate basic len…1081 tokens truncated…— First review on this PR.\n- [x] **7. Iterative Reviews** — First review.\n- [ ] **8. Prevent CI Failures** — The PR description acknowledges `tests/metaTag.repository.test.ts` is failing. That test failure exists on `main` and should be resolved before or alongside this PR to prevent CI regressions from compounding.\n\n---\n\n## Required Changes\n\n### 1. Method signatures must match the spec API contract (§9.1.1)\n\nThe spec defines these signatures for `MetaTagService`:\n\n```typescript\ngenerateMetaTags(channelId: string, options?: { forceRegenerate?: boolean, includeStructuredData?: boolean }): Promise<MetaTagSet>\ngetOrGenerateCached(channelId: string): Promise<MetaTagSet>\nscheduleRegeneration(channelId: string, priority?: 'high' | 'normal' | 'low', idempotencyKey?: string): Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\ngetMetaTagsForPreview(channelId: string): Promise<MetaTagPreview>\n```\n\nThe implementation instead takes `(channel: ChannelContext, messages: MessageContext[])` — pre-fetched data — rather than a `channelId`. This is a contract-breaking departure: the spec intends `MetaTagService` to own resolution (looking up channel and messages internally, not receiving them from callers). More importantly, the stubs for `scheduleRegeneration` and `getRegenerationJobStatus` have the wrong signatures:\n\n- `scheduleRegeneration` returns `Promise<void>` but must return `Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>`. AC-5/AC-6 directly test this return shape.\n- `getRegenerationJobStatus` only accepts `_channelId` but the spec signature requires `(channelId: string, jobId: string)`.\n- `getMetaTagsForPreview` returns `Promise<MetaTagSet>` but the spec return type is `Promise<MetaTagPreview>`, which is a different shape (includes `searchPreview`, `socialPreview`, `isCustom`, `generatedAt`).\n\nEven as stubs, these signatures must match the spec so callers and future implementations are correct by construction.\n\n### 2. `IMetaTagGenerator` (CL-I1) interface is not implemented by any class\n\nThe spec (§3, §4.8) defines:\n\n```typescript\ninterface IMetaTagGenerator {\n  generate(): MetaTagSet;\n  validate(): boolean;\n}\n```\n\n`TitleGenerator`, `DescriptionGenerator`, and `OpenGraphGenerator` are all listed in the class diagram as implementing this interface. None of them do. The interface exists in `types.ts` but is never referenced. Since the spec explicitly lists this as `CL-I1` with an `implements` relationship, the skeleton is incomplete on this point.\n\n### 3. `DescriptionGenerator.enforceLength` does not enforce the minimum\n\n`enforceLength()` only truncates — it never pads or adjusts content that is below 50 characters. The method name implies it enforces both bounds (50–160). Callers that use `enforceLength` directly (e.g., `buildFallbackTags` in `metaTagService.ts`) can produce descriptions shorter than 50 chars, violating AC-2. The minimum enforcement should be present in `enforceLength` or the method should be renamed `truncateToMaxLength` to be accurate about what it does.\n\n### 4. Hardcoded base URL in `structuredDataGenerator.ts`\n\n`generateBreadcrumbList()` builds `https://harmony.chat/s/${channel.serverSlug}` with a hardcoded domain, but `metaTagService.ts` correctly reads `process.env.BASE_URL ?? 'https://harmony.chat'`. The structured data generator must use the same `BASE_URL` env var for consistency across environments. In a preview/staging deployment this will emit the wrong domain in JSON-LD output, potentially causing Google Search Console to reject the structured data.\n\n### 5. Twitter card type is always `summary_large_image`\n\nThe spec (§9.1.4) states: \"default to `summary`; switch to `summary_large_image` only when a valid large preview image is available.\" The implementation hardcodes `summary_large_image` in all cases. `selectPreviewImage` currently always returns the default image, so this always produces the large-image variant even when no real preview exists. The skeleton should either default to `summary` or apply the conditional logic specified.\n\n### 6. `generateDiscussionForum` omits required JSON-LD fields\n\nPer spec Appendix A and the flow diagrams (F1.19), `DiscussionForumPosting` requires `datePublished`, `dateModified`, and `author` to produce valid rich snippet schema. The current implementation returns:\n\n```typescript\n{ '@context', '@type', headline, description, mainEntity }\n```\n\nWithout `datePublished` and `author`, Google will not render a rich result for this structured data. These can be `null`/`undefined` stubs for now — the issue is they are not present at all in the return type or implementation, making the skeleton incorrect for downstream consumers.\n\n### 7. Pre-existing test failure in `metaTag.repository.test.ts`\n\nThe PR description notes this failure exists on `main`. Merging this PR without resolving it compounds the CI signal, making it harder to distinguish new regressions from pre-existing ones. This test failure should be fixed as part of this PR or tracked in a separate linked issue before merge.","submittedAt":"2026-04-20T13:50:40Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":""}},{"id":"","author":{"login":"FardeenI"},"authorAssociation":"MEMBER","body":"- [x] **Prioritize Logic over Style:** Focusing on correctness/contract drift (not formatting).\n- [x] **Security First:** No secrets added; sanitization added for user-controlled strings.\n- [ ] **Architectural Alignment:** Several public method signatures still diverge from `docs/dev-spec-seo-meta-tag-generation.md` §9.1.*.\n- [ ] **Issue Completion:** Issue #350 AC requires spec-named signatures; a few are still mismatched.\n- [x] **No Nitpicking:** No style-only feedback.\n- [x] **Avoid Repetition:** Not repeating already-addressed review threads.\n- [x] **Iterative Reviews:** Considered existing review threads before adding new feedback.\n- [x] **Prevent CI Failures:** CI is green; requested changes are contract/spec alignment to prevent future breakage.\n\n---\n\n## Requested changes (actionable)\n\n### 1) Align generator method signatures to the SEO spec (Issue #350 AC)\nRight now the M2 “skeleton” compiles/tests, but several exported method signatures don’t match the spec prototypes in `docs/dev-spec-seo-meta-tag-generation.md` §9.1. That’s likely to cause downstream integration churn when M3/M4 wiring lands.\n\n**`harmony-backend/src/services/metaTag/openGraphGenerator.ts`**\nSpec expects:\n- `generateOGTags(channel: Channel, server: Server, analysis: ContentAnalysis): OpenGraphTags`\n- `generateTwitterCard(channel: Channel, server: Server, analysis: ContentAnalysis): TwitterCardTags`\n- `selectPreviewImage(channel: Channel, messages: Message[]): string | null`\n\nCurrent signatures are `(channel, title, description)` and `selectPreviewImage(channel): string`.\n\n**Suggestion:** keep your current placeholder logic, but change the exported signatures to match spec and adapt callers (e.g. in `MetaTagService`, pass a placeholder `analysis` for now and ignore unused args in the generator).\n\n**`harmony-backend/src/services/metaTag/structuredDataGenerator.ts`**\nSpec expects:\n- `generateDiscussionForum(channel, messages, server)`\n- `generateBreadcrumbList(server, channel)`\n- `generateOrganization(server)`\n- `generateWebPage(channel, metaTags)`\n\nCurrent signatures are `(channel, title, description)` / `(channel)` / `()` / `(channel, title, description)`.\n\n**Suggestion:** change signatures to spec and keep stubs internally (you can still leave `author/datePublished` unset until M4).\n\n**`harmony-backend/src/services/metaTag/descriptionGenerator.ts`**\nSpec expects:\n- `extractKeyPhrases(content: string, maxPhrases: number): string[]`\n- `summarizeThread(messages: Message[]): string`\n\nCurrent `extractKeyPhrases(messages[])` and `summarizeThread(messages, channel)` diverge.\n\n**Suggestion:** add/rename the spec-shaped methods (they can be thin wrappers around your current logic: join messages -> content; keep `maxPhrases` configurable rather than hardcoded to 5).\n\n### 2) Spec return type for `getRegenerationJobStatus`\nIn `harmony-backend/src/services/metaTag/metaTagService.ts`, spec has `Promise<MetaTagJobStatus>`; current stub returns `Promise<MetaTagJobStatus | null>`.\n\n**Suggestion:** for a stub, prefer throwing `not implemented` (or return a placeholder status) to keep the signature aligned.\n\n### 3) (Optional) PR signal/noise\nThis PR includes 2 new `llm-logs/*.md` artifacts. If those are required by process, OK—just noting it makes reviews harder to scan.\n","submittedAt":"2026-04-20T16:33:39Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":""}},{"id":"","author":{"login":"acabrera04"},"authorAssociation":"MEMBER","body":"## PR Review Checklist\n\n- [ ] **1. Logic over Style** — Cross-checking against `docs/dev-spec-seo-meta-tag-generation.md` found one remaining contract mismatch in addition to the breadcrumb URL encoding gap: some structured-data methods expose `object` instead of the spec’s `StructuredData` return type.\n- [x] **2. Security First** — No new security issue found in this spec pass.\n- [ ] **3. Architectural Alignment** — `StructuredDataGenerator` should match §9.1.5 method contracts, and breadcrumb URL construction should follow the same encoded segment policy as canonical/sitemap URLs.\n- [x] **4. Issue Completion** — The stale PR-description note about `metaTag.repository.test.ts` has been removed and the description now aligns with the current test status.\n- [x] **5. No Nitpicking** — These are API-contract and generated-URL correctness issues.\n- [x] **6. Avoid Repetition** — This adds the explicit spec-return-type issue from §9.1.5; the breadcrumb encoding item is the same remaining URL issue from the latest review.\n- [x] **7. Iterative Reviews** — Re-reviewed latest head `b5a5950` directly against `docs/dev-spec-seo-meta-tag-generation.md`.\n- [x] **8. Prevent CI Failures** — Current checks are green; these are contract/behavior gaps not currently covered by CI.\n\n## Review (Request changes)\n\nI cross-checked the latest head against `docs/dev-spec-seo-meta-tag-generation.md`. Most of the previously flagged contracts are now aligned: `MetaTagService` stubs, `DescriptionGenerator`, `OpenGraphGenerator`, `MetaTagJobStatus`, visibility-derived robots, cache fallback behavior, and the PR description/test-plan wording all look consistent with the spec.\n\nTwo spec-alignment issues remain:\n\n1. **`StructuredDataGenerator` return types drift from §9.1.5.** The spec declares all four public methods as returning `StructuredData`, including `generateBreadcrumbList(server, channel): StructuredData` and `generateOrganization(server): StructuredData`. The PR currently exposes those two as `object`. Even if the skeleton implementation is minimal, the exported method signatures should match the spec contract now so M4 wiring does not need a breaking type change later.\n\n2. **`generateBreadcrumbList()` still uses a raw `serverSlug` in its `item` URL.** The spec uses canonical crawler-facing URLs, and the existing sitemap code plus the new `buildCanonicalUrl()` fix both encode slug path segments. Breadcrumb structured-data URLs should do the same:\n\n```ts\nitem: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,\n```\n\nPlease align the structured-data method signatures to §9.1.5 and add the breadcrumb slug-encoding regression test alongside the canonical URL encoding test.\n","submittedAt":"2026-04-21T19:32:07Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":""}}],"reviewDecision":"CHANGES_REQUESTED","title":"feat(seo): M2 meta tag generation service skeleton (issue #350)"}
````

#### Tool: exec_command

```sh
gh pr checks 443 --repo CS485-Harmony/Harmony
```

Output:

```text
Backend Lint and Build	pass	27s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348241/job/72385070627	
Frontend Lint and Build	pass	45s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348241/job/72385070585	
Run Backend Tests	pass	1m17s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348250/job/72385070682	
Run Frontend Tests	pass	29s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348281/job/72385070673	
Run Integration Tests	pass	1m55s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348272/job/72385070720	
Vercel Preview Comments	pass	0	https://vercel.com/github	
Run Cloud Integration Tests	skipping	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348272/job/72385071036	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/5zTWWgTJeiFv3xceGRb7k4dmejUJ	Deployment has completed
```

#### Tool: exec_command

```sh
gh pr diff 443 --repo CS485-Harmony/Harmony --name-only
```

Output:

```text
harmony-backend/src/services/metaTag/descriptionGenerator.ts
harmony-backend/src/services/metaTag/metaTagCache.ts
harmony-backend/src/services/metaTag/metaTagService.ts
harmony-backend/src/services/metaTag/openGraphGenerator.ts
harmony-backend/src/services/metaTag/structuredDataGenerator.ts
harmony-backend/src/services/metaTag/titleGenerator.ts
harmony-backend/src/services/metaTag/types.ts
harmony-backend/tests/metaTagService.test.ts
llm-logs/2026-04-20-094302-session-ce430386.md
llm-logs/2026-04-20-122835-session-b13d715d.md
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:37:07.849Z

The latest head is `3bb2ff7`; all required GitHub checks are passing, and the PR description now says `metaTag.repository.test.ts` passes rather than documenting it as a pre-existing failure. I’m doing one final spec-focused pass on the changed service/test files before posting.

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/structuredDataGenerator.ts
```

Output:

```text
// CL-C2.5 StructuredDataGenerator — generates JSON-LD structured data
import type { ChannelContext, MessageContext, MetaTagSet, StructuredData } from './types';

const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

export const StructuredDataGenerator = {
  // Spec §9.1.5: generateDiscussionForum(channel, messages, server)
  // M2 skeleton: derived from channel context; message/server integration by M4
  generateDiscussionForum(channel: ChannelContext, _messages: MessageContext[], _server: unknown): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      headline: `${channel.name} — ${channel.serverName}`,
      description: `Discussions in #${channel.name} on ${channel.serverName}.`,
      // author and datePublished are stub fields — populated by M4 when message data is available
      author: undefined,
      datePublished: undefined,
      dateModified: undefined,
      mainEntity: {
        '@type': 'WebPage',
        url: channel.canonicalUrl,
      },
    };
  },

  // Spec §9.1.5: generateBreadcrumbList(server, channel): StructuredData
  generateBreadcrumbList(_server: unknown, channel: ChannelContext): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: channel.serverName,
          item: `${BASE_URL}/s/${encodeURIComponent(channel.serverSlug)}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: channel.name,
          item: channel.canonicalUrl,
        },
      ],
    };
  },

  // Spec §9.1.5: generateOrganization(server): StructuredData
  generateOrganization(_server: unknown): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Harmony',
      url: BASE_URL,
    };
  },

  // Spec §9.1.5: generateWebPage(channel, metaTags)
  generateWebPage(channel: ChannelContext, metaTags: MetaTagSet): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      headline: metaTags.title,
      description: metaTags.description,
      mainEntity: {
        '@type': 'WebPage',
        url: channel.canonicalUrl,
      },
    };
  },
};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/metaTagService.ts
```

Output:

```text
// CL-C2.1 MetaTagService — facade for meta tag generation, caching, and invalidation
import { TitleGenerator } from './titleGenerator';
import { DescriptionGenerator } from './descriptionGenerator';
import { OpenGraphGenerator } from './openGraphGenerator';
import { StructuredDataGenerator } from './structuredDataGenerator';
import { MetaTagCache } from './metaTagCache';
import type {
  MetaTagSet,
  ChannelContext,
  ChannelVisibility,
  MessageContext,
  MetaTagPreview,
  MetaTagJobStatus,
  ContentAnalysis,
} from './types';
import { createLogger } from '../../lib/logger';

const logger = createLogger({ component: 'meta-tag-service' });

const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

// Spec §9.1.1 visibility → robots mapping
function getRobotsDirective(visibility: ChannelVisibility | undefined): string {
  if (visibility === 'PUBLIC_NO_INDEX') return 'noindex, follow';
  if (visibility === 'PRIVATE') return 'noindex, nofollow';
  return 'index, follow'; // PUBLIC_INDEXABLE or unset
}

function sanitizeChannelContext(channel: ChannelContext): ChannelContext {
  return {
    ...channel,
    name: TitleGenerator.sanitizeForTitle(channel.name),
    serverName: TitleGenerator.sanitizeForTitle(channel.serverName),
  };
}

function buildFallbackTags(channel: ChannelContext): MetaTagSet {
  const safe = sanitizeChannelContext(channel);
  const title = `${safe.name} — ${safe.serverName}`;
  const description = `Discussions in #${safe.name} on ${safe.serverName}.`;
  const analysis: ContentAnalysis = {
    keywords: [],
    topics: [TitleGenerator.truncateWithEllipsis(title)],
    summary: DescriptionGenerator.enforceLength(description),
    sentiment: 'neutral',
    readingLevel: 'basic',
  };
  return {
    title: TitleGenerator.truncateWithEllipsis(title),
    description: DescriptionGenerator.enforceLength(description),
    canonical: safe.canonicalUrl,
    robots: getRobotsDirective(safe.visibility),
    openGraph: OpenGraphGenerator.generateOGTags(safe, {}, analysis),
    twitter: OpenGraphGenerator.generateTwitterCard(safe, {}, analysis),
    structuredData: StructuredDataGenerator.generateDiscussionForum(safe, [], {}),
    keywords: [],
    needsRegeneration: true,
  };
}

export const metaTagService = {
  /**
   * Generate meta tags from pre-resolved context (used internally and in unit tests).
   * Production callers should prefer the spec-aligned generateMetaTags(channelId, options?).
   */
  async generateMetaTagsFromContext(channel: ChannelContext, messages: MessageContext[]): Promise<MetaTagSet> {
    try {
      const title = TitleGenerator.generateFromThread(messages, channel);
      const description = DescriptionGenerator.generateFromMessages(messages, channel);
      const keywords = DescriptionGenerator.extractKeyPhrases(messages.map((m) => m.content).join(' '), 5);
      const analysis: ContentAnalysis = {
        keywords,
        topics: [title],
        summary: description,
        sentiment: 'neutral',
        readingLevel: 'basic',
      };
      const og = OpenGraphGenerator.generateOGTags(channel, {}, analysis);
      const twitter = OpenGraphGenerator.generateTwitterCard(channel, {}, analysis, og.ogImage);
      const structuredData = StructuredDataGenerator.generateDiscussionForum(channel, messages, {});

      return {
        title,
        description,
        canonical: channel.canonicalUrl,
        robots: getRobotsDirective(channel.visibility),
        openGraph: og,
        twitter,
        structuredData,
        keywords,
        needsRegeneration: false,
      };
    } catch (err) {
      logger.warn({ err, channelId: channel.id }, 'Meta tag generation failed, using fallback');
      return buildFallbackTags(channel);
    }
  },

  /**
   * Spec-aligned stub: generateMetaTags(channelId, options?).
   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
   */
  async generateMetaTags(
    _channelId: string,
    _options?: { forceRegenerate?: boolean; includeStructuredData?: boolean },
  ): Promise<MetaTagSet> {
    throw new Error('generateMetaTags(channelId) not yet implemented — wired by M4 (issue #356)');
  },

  /**
   * Cache-backed generation from pre-resolved context (used internally and in unit tests).
   * Production callers should prefer the spec-aligned getOrGenerateCached(channelId).
   */
  async getOrGenerateCachedFromContext(
    channel: ChannelContext,
    messages: MessageContext[],
    ttl?: number,
  ): Promise<MetaTagSet> {
    const cached = await MetaTagCache.get(channel.id);
    if (cached) return cached;

    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    // Do not cache fallback tags — a transient failure must not poison the cache for the full TTL
    if (!tags.needsRegeneration) {
      await MetaTagCache.set(channel.id, tags, ttl);
    }
    return tags;
  },

  /**
   * Spec-aligned stub: getOrGenerateCached(channelId).
   * Full implementation wired by M4 (MetaTagUpdateWorker, issue #356).
   */
  async getOrGenerateCached(_channelId: string): Promise<MetaTagSet> {
    throw new Error('getOrGenerateCached(channelId) not yet implemented — wired by M4 (issue #356)');
  },

  async invalidateCache(channelId: string): Promise<void> {
    await MetaTagCache.invalidate(channelId);
  },

  // scheduleRegeneration and getRegenerationJobStatus are stubs —
  // full implementation depends on M4 (worker/queue) from issue #356
  async scheduleRegeneration(
    channelId: string,
    _priority?: 'high' | 'normal' | 'low',
    _idempotencyKey?: string,
  ): Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> {
    // Queuing logic wired by M4 MetaTagUpdateWorker
    return {
      jobId: `meta-tag-regeneration:${channelId}`,
      status: 'queued',
    };
  },

  async getRegenerationJobStatus(
    _channelId: string,
    _jobId: string,
  ): Promise<MetaTagJobStatus> {
    throw new Error('getRegenerationJobStatus not yet implemented — wired by M4 (issue #356)');
  },

  async getMetaTagsForPreview(_channelId: string): Promise<MetaTagPreview> {
    throw new Error('getMetaTagsForPreview(channelId) not yet implemented — wired by M4 (issue #356)');
  },

  buildCanonicalUrl(serverSlug: string, channelSlug: string): string {
    return `${BASE_URL}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(channelSlug)}`;
  },
};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/types.ts
```

Output:

```text
// DTOs and interfaces for M2 Meta Tag Generation (CL-D1 through CL-D5, CL-I1)

export interface OpenGraphTags {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  ogSiteName: string;
}

export interface TwitterCardTags {
  card: string;
  title: string;
  description: string;
  image: string;
  site: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  headline?: string;
  description?: string;
  author?: object;
  datePublished?: string;
  dateModified?: string;
  mainEntity?: object;
  breadcrumb?: object;
  [key: string]: unknown;
}

export interface MetaTagSet {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: OpenGraphTags;
  twitter: TwitterCardTags;
  structuredData: StructuredData;
  keywords: string[];
  needsRegeneration?: boolean;
}

export interface ContentAnalysis {
  keywords: string[];
  topics: string[];
  summary: string;
  sentiment: string;
  readingLevel: string;
}

export interface IMetaTagGenerator {
  generate(): MetaTagSet;
  validate(): boolean;
}

export interface MetaTagPreview {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  keywords: string[];
  generatedAt: string;
  isCustom: boolean;
  searchPreview: { title: string; description: string; url: string };
  socialPreview: { title: string; description: string; image: string };
}

export interface MetaTagJobStatus {
  jobId: string;
  channelId: string;
  status: 'queued' | 'processing' | 'succeeded' | 'failed';
  attempts: number;
  startedAt: string | null;
  completedAt: string | null;
  errorCode: string | null;
  errorMessage: string | null;
}

// Canonical values from the SEO spec visibility model
export type ChannelVisibility = 'PUBLIC_INDEXABLE' | 'PUBLIC_NO_INDEX' | 'PRIVATE';

export interface ChannelContext {
  id: string;
  name: string;
  slug: string;
  topic?: string | null;
  serverName: string;
  serverSlug: string;
  canonicalUrl: string;
  visibility?: ChannelVisibility;
}

export interface MessageContext {
  content: string;
  createdAt: Date;
  authorDisplayName?: string;
}
```

#### Tool: exec_command

```sh
sed -n '1,260p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
Total output lines: 260

# Development Specification: SEO Meta Tag Generation

## Feature: Automatic HTML Meta Tag Generation for Public Threads

**User Story:** As a Content Creator, I want public threads to automatically generate HTML meta tags (Title, Description) based on the conversation content, so that my community appears with relevant previews in Google search results, driving organic growth.

---

## 1 Header

### 1.1 Version and Date

| Version | Date       | Description                              |
|---------|------------|------------------------------------------|
| 1.0     | 2026-02-12 | Initial development specification        |
| 2.0     | 2026-02-15 | Update to address comments and fix inconsistencies        |

### 1.2 Author and Role

| Author        | Role                    | Version |
|---------------|-------------------------|---------|
| Claude (AI)   | Specification Author    | 1.0     |
| dblanc        | Project Lead            | 1.0     |
| acabrera04    | Project Lead            | 2.0     |
| CoPilot (AI)  | Specification Editor     | 2.0     |

---

### 1.3 Rationale
Header with versioning and authors.

## 2. Architecture Diagram

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LEGEND                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────┐  Module/Component    ─────►  Data Flow                                │
│  │      │                      ─ ─ ─►  Async/Background Flow                    │
│  └──────┘                      ══════  Bidirectional Flow                       │
│  [      ]  External System     Blue: Client   Green: Server   Orange: External  │
│  (      )  Data Store          Purple: AI/ML Services                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL ACTORS                                       │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                       │
│  │ [A1 Search Engine Bot]  │  │ [A2 Social Media        │                       │
│  │ Googlebot, Bingbot      │  │ Crawler]                │                       │
│  │ Crawls pages, reads     │  │ Facebook, Twitter,      │                       │
│  │ meta tags               │  │ LinkedIn link previews  │                       │
│  └───────────┬─────────────┘  └───────────┬─────────────┘                       │
└──────────────┼────────────────────────────┼─────────────────────────────────────┘
               │                            │
               │ Request page               │ Request page/OG tags
               ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SERVER LAYER (Application Server)                     │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M1 Page Rendering Module (Next.js SSR)                                    │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C1.1 PublicChannelPage      │    │ C1.2 HeadComponent              │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ serverSlug: string          │    │ meta: MetaTagSet                │   │  │
│  │  │ channelSlug: string         │    │ ─────────────────────────────── │   │  │
│  │  │ messages: Message[]         │    │ renderMetaTags()                │   │  │
│  │  │ metaTags: MetaTagSet        │    │ renderOpenGraph()               │   │  │
│  │  │ ─────────────────────────── │    │ renderTwitterCards()            │   │  │
│  │  │ getServerSideProps()        │───►│ renderStructuredData()          │   │  │
│  │  │ render()                    │    │ renderCanonical()               │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M2 Meta Tag Generation Module                                             │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C2.1 MetaTagService         │    │ C2.2 TitleGenerator             │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ titleGenerator: ref         │    │ maxLength: 60                   │   │  │
│  │  │ descriptionGenerator: ref   │    │ ─────────────────────────────── │   │  │
│  │  │ openGraphGenerator: ref     │    │ generateFromChannel()           │   │  │
│  │  │ structuredDataGen: ref      │    │ generateFromMessage()           │   │  │
│  │  │ cacheService: ref           │    │ generateFromThread()            │   │  │
│  │  │ contentAnalyzer: ref        │    │ truncateWithEllipsis()          │   │  │
│  │  │ ─────────────────────────── │    │ sanitizeForTitle()              │   │  │
│  │  │ generateMetaTags()          │◄───│ applyTemplate()                 │   │  │
│  │  │ getOrGenerateCached()       │    └─────────────────────────────────┘   │  │
│  │  │ invalidateCache()           │                                          │  │
│  │  │ scheduleRegeneration()      │                                          │  │
│  │  │ getMetaTagsForPreview()     │                                          │  │
│  │  │ getRegenerationJobStatus()  │                                          │  │
│  │  └─────────────────────────────┘    ┌─────────────────────────────────┐   │  │
│  │  ┌─────────────────────────────┐    │ C2.4 OpenGraphGenerator         │   │  │
│  │  │ C2.3 DescriptionGenerator   │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ defaultImage: string            │   │  │
│  │  │ maxLength: 160              │    │ ─────────────────────────────── │   │  │
│  │  │ minLength: 50               │    │ generateOGTags()                │   │  │
│  │  │ ─────────────────────────── │    │ generateTwitterCard()           │   │  │
│  │  │ generateFromMessages()      │    │ selectPreviewImage()            │   │  │
│  │  │ extractKeyPhrases()         │    └─────────────────────────────────┘   │  │
│  │  │ summarizeThread()           │                                          │  │
│  │  └─────────────────────────────┘    ┌─────────────────────────────────┐   │  │
│  │  ┌─────────────────────────────┐    │ C2.6 MetaTagCache               │   │  │
│  │  │ C2.5 StructuredDataGen      │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ cache: Redis                    │   │  │
│  │  │ ─────────────────────────── │    │ ttl: number                     │   │  │
│  │  │ generateDiscussionForum()   │    │ ─────────────────────────────── │   │  │
│  │  │ generateBreadcrumbList()    │    │ get()                           │   │  │
│  │  │ generateOrganization()      │    │ set()                           │   │  │
│  │  │ generateWebPage()           │    │ invalidate()                    │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  └─────────────────────…2105 tokens truncated…                      │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────┐                                          │  │
│  │  │ C5.3 MetaTagRepository      │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ database: DatabaseClient    │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ findByChannelId()            │                                          │  │
│  │  │ upsert()                    │                                          │  │
│  │  │ getLastGenerated()          │                                          │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Database Protocol
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER (Cloud Infrastructure)                     │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M6 Persistence Module                                                     │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ D6.1 ChannelsTable          │    │ D6.2 MessagesTable              │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ id: UUID (PK)               │    │ id: UUID (PK)                   │   │  │
│  │  │ server_id: UUID (FK)        │    │ channel_id: UUID (FK)           │   │  │
│  │  │ name: VARCHAR(100),         │    │ author_id: UUID (FK)            │   │  │
│  │  │ slug: VARCHAR(100)          │    │ content: TEXT                   │   │  │
│  │  │ visibility: ENUM            │    │ created_at: TIMESTAMP           │   │  │
│  │  │ topic: TEXT, position: INT  │    │ attachments: JSONB              │   │  │
│  │  │ indexed_at / created_at /   │    │                                 │   │  │
│  │  │ updated_at: TIMESTAMP       │    │                                 │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ D6.3 GeneratedMetaTagsTable │    │ D6.4 ServersTable               │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ id: UUID (PK)               │    │ id: UUID (PK)                   │   │  │
│  │  │ channel_id: UUID (FK,UNIQUE)│    │ name: VARCHAR(100)              │   │  │
│  │  │ title: VARCHAR(70)          │    │ slug: VARCHAR(100)              │   │  │
│  │  │ description: VARCHAR(200)   │    │ description: TEXT               │   │  │
│  │  │ og_title: VARCHAR(95)       │    │ icon_url: VARCHAR(500)          │   │  │
│  │  │ og_description: VARCHAR(300)│    └─────────────────────────────────┘   │  │
│  │  │ og_image: VARCHAR(500)      │                                          │  │
│  │  │ twitter_card: VARCHAR(20)   │                                          │  │
│  │  │ keywords: TEXT[]            │                                          │  │
│  │  │ structured_data: JSONB      │                                          │  │
│  │  │ custom_title: VARCHAR(70)   │                                          │  │
│  │  │ custom_description:         │                                          │  │
│  │  │   VARCHAR(200)              │                                          │  │
│  │  │ custom_og_image:            │                                          │  │
│  │  │   VARCHAR(500)              │                                          │  │
│  │  │ content_hash: VARCHAR(64)   │                                          │  │
│  │  │ needs_regeneration: BOOLEAN │                                          │  │
│  │  │ generated_at: TIMESTAMP     │                                          │  │
│  │  │ version: INTEGER            │                                          │  │
│  │  │ created_at / updated_at:    │                                          │  │
│  │  │   TIMESTAMP                 │                                          │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M7 Cache Module                                                           │  │
│  │  ┌──────────────────────────────┐    ┌──────────────────────────────────┐ │  │
│  │  │ D7.1 MetaTagCache            │    │ D7.2 ContentAnalysisCache        │ │  │
│  │  │ ───────────────────────────  │    │ ───────────────────────────────  │ │  │
│  │  │ key: meta:channel:{channelId}│    │ key: analysis:channel:{channelId}│ │  │
│  │  │ value: MetaTagSet            │    │ value: ContentAnalysis           │ │  │
│  │  │ ttl: 3600 seconds            │    │ ttl: 1800 seconds                │ │  │
│  │  └──────────────────────────────┘    └──────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M8 Job Queue Module                                                       │  │
│  │  ┌─────────────────────────────┐                                          │  │
│  │  │ D8.1 MetaTagUpdateQueue     │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ queue: meta-tag-updates     │                                          │  │
│  │  │ job: { jobId, channelId,    │                                          │  │
│  │  │   priority, triggeredBy,    │                                          │  │
│  │  │   idempotencyKey?, status,  │                                          │  │
│  │  │   attemptCount, lastError? }│                                          │  │
│  │  │ delay: 60 seconds (debounce)│                                          │  │
│  │  │ maxAttempts: 3              │                                          │  │
│  │  │ backoff: exponential        │                                          │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SYSTEMS                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐           │
│  │ [E1 Google Search Console]  │  │ [E2 Bing Webmaster Tools]       │           │
│  │ Indexing API                │  │ URL Submission API              │           │
│  │ Sitemap ping                │  │ Sitemap ping                    │           │
````

#### Tool: exec_command

```sh
rg -n "9\.1|StructuredData|generateBreadcrumbList|generateOrganization|Acceptance Criteria|AC-" docs/dev-spec-seo-meta-tag-generation.md
```

Output:

```text
71:│  │  │ getServerSideProps()        │───►│ renderStructuredData()          │   │  │
105:│  │  │ C2.5 StructuredDataGen      │    │ ─────────────────────────────── │   │  │
109:│  │  │ generateBreadcrumbList()    │    │ get()                           │   │  │
110:│  │  │ generateOrganization()      │    │ set()                           │   │  │
438:        │ - topicClassifier      │ │ + generateBreadcrumbList() │ ├─────────────────────┤
439:        ├────────────────────────┤ │ + generateOrganization()   │ │ + get()             │
480:│ CL-D4 StructuredData    │     ├─────────────────────────┤
561:       │ + renderStructuredData()     │
630:| CL-C2.5 | StructuredDataGenerator | Service | Generates JSON-LD structured data for rich snippets |
665:| CL-D4 | StructuredData | DTO | JSON-LD structured data |
1130:                │             │  │ Server.StructuredDataGen.      │
1155:                    │   renderStructuredData()      │
1997:### 9.1 Module M2: Meta Tag Generation
1999:#### 9.1.1 CL-C2.1 MetaTagService
2009:    includeStructuredData?: boolean
2048:#### 9.1.2 CL-C2.2 TitleGenerator
2092:#### 9.1.3 CL-C2.3 DescriptionGenerator
2117:#### 9.1.4 CL-C2.4 OpenGraphGenerator
2145:#### 9.1.5 CL-C2.5 StructuredDataGenerator
2155:): StructuredData
2158:generateBreadcrumbList(
2161:): StructuredData
2164:generateOrganization(
2166:): StructuredData
2172:): StructuredData
2477:#### 9.5.4 CL-D4 StructuredData
2480:interface StructuredData {
3139:## 14. Acceptance Criteria
3143:| AC-1 | Every public channel page serves non-empty `<title>` and `<meta name="description">` tags. | E2E crawler test |
3144:| AC-2 | Auto-generated title length is <=60 characters; auto-generated description is 50-160 characters. | Unit tests (`TitleGenerator`, `DescriptionGenerator`) |
3145:| AC-3 | Effective override limits are enforced (`customTitle <=70`, `customDescription <=200`). | API validation test (`PUT /meta-tags`) |
3146:| AC-4 | `onVisibilityChanged` handling of `VISIBILITY_CHANGED(newVisibility=PRIVATE)` invalidates cache and removes sitemap URL. | Integration test |
3147:| AC-5 | Regeneration API returns `jobId` and supports status polling to terminal states (`succeeded`/`failed`). | API integration test |
3148:| AC-6 | Idempotency key deduplicates repeated regenerate requests within 60 seconds. | API integration test |
3149:| AC-7 | Custom overrides are never overwritten by background regeneration. | Integration test with queued jobs |
3150:| AC-8 | Generated tags exclude PII and profanity for fixture content. | Security/content filter tests |
3151:| AC-9 | On NLP failure/timeout, fallback tags are returned and `needs_regeneration=true` is persisted. | Fault-injection unit/integration test |
3152:| AC-10 | De-index workflow executes when channel visibility changes from public to private. | End-to-end visibility transition test |
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/tests/metaTagService.test.ts
```

Output:

```text
/**
 * Unit tests for M2 Meta Tag Generation Service skeleton — Issue #350
 *
 * Covers AC-2 (length limits), sanitization, template application,
 * and AC-9 (fallback on failure, needsRegeneration=true).
 *
 * MetaTagCache uses Redis via cacheService — mocked here for unit speed.
 */

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
    getOrRevalidate: jest.fn(),
  },
  CacheKeys: {
    metaChannel: (id: string) => `meta:channel:${id}`,
    channelVisibility: (id: string) => `channel:${id}:visibility`,
    channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
    serverInfo: (id: string) => `server:${id}:info`,
    analysisChannel: (id: string) => `analysis:channel:${id}`,
  },
  sanitizeKeySegment: (s: string) => s.replace(/[*?\[\]]/g, ''),
}));

import { TitleGenerator } from '../src/services/metaTag/titleGenerator';
import { DescriptionGenerator } from '../src/services/metaTag/descriptionGenerator';
import { MetaTagCache } from '../src/services/metaTag/metaTagCache';
import { metaTagService } from '../src/services/metaTag/metaTagService';
import { cacheService } from '../src/services/cache.service';
import type { ChannelContext, MessageContext } from '../src/services/metaTag/types';

const mockCacheService = cacheService as jest.Mocked<typeof cacheService>;

const channel: ChannelContext = {
  id: 'chan-001',
  name: 'unity-physics-help',
  slug: 'unity-physics-help',
  topic: 'Ask about Unity physics',
  serverName: 'Game Dev Hub',
  serverSlug: 'game-dev-hub',
  canonicalUrl: 'https://harmony.chat/c/game-dev-hub/unity-physics-help',
};

const messages: MessageContext[] = [
  { content: 'How do I handle collision detection in Unity?', createdAt: new Date() },
  { content: 'Use OnCollisionEnter for physics-based collisions.', createdAt: new Date() },
];

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── TitleGenerator ──────────────────────────────────────────────────────────

describe('TitleGenerator', () => {
  it('maxLength is 60', () => {
    expect(TitleGenerator.maxLength).toBe(60);
  });

  it('generateFromChannel produces title ≤60 chars', () => {
    const title = TitleGenerator.generateFromChannel(channel);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  it('truncates long titles with ellipsis and stays ≤60 chars', () => {
    const longChannel: ChannelContext = {
      ...channel,
      name: 'this-is-a-very-long-channel-name-that-exceeds-limits',
      serverName: 'An Extremely Long Server Name That Will Overflow',
    };
    const title = TitleGenerator.generateFromChannel(longChannel);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title.endsWith('…')).toBe(true);
  });

  it('sanitizeForTitle strips HTML tags', () => {
    const result = TitleGenerator.sanitizeForTitle('<b>Hello</b> <em>world</em>');
    expect(result).toBe('Hello world');
  });

  it('sanitizeForTitle collapses whitespace', () => {
    const result = TitleGenerator.sanitizeForTitle('foo   bar\n  baz');
    expect(result).toBe('foo bar baz');
  });

  it('applyTemplate replaces template variables', () => {
    const result = TitleGenerator.applyTemplate('{channelName} on {serverName}', {
      channelName: 'general',
      serverName: 'My Server',
    });
    expect(result).toBe('general on My Server');
  });

  it('generateFromThread falls back to channel when no messages', () => {
    const title = TitleGenerator.generateFromThread([], channel);
    expect(title).toBe(TitleGenerator.generateFromChannel(channel));
  });

  it('generateFromMessage uses first message content', () => {
    const title = TitleGenerator.generateFromMessage(messages[0], channel);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toContain('Game Dev Hub');
  });
});

// ─── DescriptionGenerator ───────────────────────────────────────────────────

describe('DescriptionGenerator', () => {
  it('maxLength is 160', () => {
    expect(DescriptionGenerator.maxLength).toBe(160);
  });

  it('minLength is 50', () => {
    expect(DescriptionGenerator.minLength).toBe(50);
  });

  it('generateFromMessages produces description 50-160 chars', () => {
    const desc = DescriptionGenerator.generateFromMessages(messages, channel);
    expect(desc.length).toBeGreaterThanOrEqual(50);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it('truncates long descriptions to ≤160 chars with ellipsis', () => {
    const longMessages: MessageContext[] = [
      {
        content: 'A'.repeat(200),
        createdAt: new Date(),
      },
    ];
    const desc = DescriptionGenerator.generateFromMessages(longMessages, channel);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc.endsWith('…')).toBe(true);
  });

  it('returns text unchanged when within valid range', () => {
    const valid = 'A'.repeat(80);
    expect(DescriptionGenerator.enforceLength(valid)).toBe(valid);
  });

  it('AC-2: generateFromMessages produces ≥50 chars even for a very short message', () => {
    const shortMessages: MessageContext[] = [{ content: 'hi', createdAt: new Date() }];
    const desc = DescriptionGenerator.generateFromMessages(shortMessages, channel);
    expect(desc.length).toBeGreaterThanOrEqual(50);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it('extractKeyPhrases returns non-empty array for non-empty content', () => {
    const content = messages.map((m) => m.content).join(' ');
    const phrases = DescriptionGenerator.extractKeyPhrases(content, 5);
    expect(Array.isArray(phrases)).toBe(true);
    expect(phrases.length).toBeGreaterThan(0);
  });

  it('extractKeyPhrases respects maxPhrases limit', () => {
    const content = messages.map((m) => m.content).join(' ');
    const phrases = DescriptionGenerator.extractKeyPhrases(content, 2);
    expect(phrases.length).toBeLessThanOrEqual(2);
  });

  it('summarizeThread returns empty string for no messages', () => {
    const summary = DescriptionGenerator.summarizeThread([]);
    expect(summary).toBe('');
  });

  it('summarizeThread returns first message content for non-empty messages', () => {
    const summary = DescriptionGenerator.summarizeThread(messages);
    expect(summary.length).toBeGreaterThan(0);
  });

  it('generateFromMessages includes channel info for empty messages', () => {
    const desc = DescriptionGenerator.generateFromMessages([], channel);
    expect(desc).toContain(channel.name);
    expect(desc.length).toBeGreaterThanOrEqual(50);
    expect(desc.length).toBeLessThanOrEqual(160);
  });
});

// ─── MetaTagCache ────────────────────────────────────────────────────────────

describe('MetaTagCache', () => {
  it('ttl defaults to 3600', () => {
    expect(MetaTagCache.ttl).toBe(3600);
  });

  it('get returns null on cache miss', async () => {
    mockCacheService.get.mockResolvedValue(null);
    const result = await MetaTagCache.get('chan-001');
    expect(result).toBeNull();
    expect(mockCacheService.get).toHaveBeenCalledWith('meta:channel:chan-001');
  });

  it('get returns cached data on hit', async () => {
    const fakeSet = { title: 'Cached Title' } as never;
    mockCacheService.get.mockResolvedValue({ data: fakeSet, createdAt: Date.now() });
    const result = await MetaTagCache.get('chan-001');
    expect(result).toEqual(fakeSet);
  });

  it('set calls cacheService.set with correct key and ttl', async () => {
    mockCacheService.set.mockResolvedValue(undefined);
    const tags = { title: 'T' } as never;
    await MetaTagCache.set('chan-001', tags, 1800);
    expect(mockCacheService.set).toHaveBeenCalledWith(
      'meta:channel:chan-001',
      tags,
      { ttl: 1800 },
    );
  });

  it('invalidate calls cacheService.invalidate with correct key', async () => {
    mockCacheService.invalidate.mockResolvedValue(undefined);
    await MetaTagCache.invalidate('chan-001');
    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
  });
});

// ─── MetaTagService ──────────────────────────────────────────────────────────

describe('metaTagService', () => {
  it('generateMetaTagsFromContext returns valid MetaTagSet', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    expect(tags.title.length).toBeGreaterThan(0);
    expect(tags.title.length).toBeLessThanOrEqual(60);
    expect(tags.description.length).toBeGreaterThanOrEqual(50);
    expect(tags.description.length).toBeLessThanOrEqual(160);
    expect(tags.canonical).toBe(channel.canonicalUrl);
    expect(tags.needsRegeneration).toBe(false);
  });

  it('generateMetaTagsFromContext sets robots to index, follow', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    expect(tags.robots).toBe('index, follow');
  });

  it('generateMetaTagsFromContext includes openGraph and twitter tags', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    expect(tags.openGraph.ogTitle).toBeDefined();
    expect(tags.twitter.card).toBeDefined();
  });

  it('AC-9: returns fallback with needsRegeneration=true on generation error', async () => {
    const spy = jest
      .spyOn(TitleGenerator, 'generateFromThread')
      .mockImplementation(() => { throw new Error('NLP timeout'); });
    const tags = await metaTagService.generateMetaTagsFromContext(channel, messages);
    spy.mockRestore();
    expect(tags.needsRegeneration).toBe(true);
    expect(tags.title.length).toBeGreaterThan(0);
  });

  it('getOrGenerateCachedFromContext returns cache hit without regenerating', async () => {
    const cachedTags = { title: 'Cached', needsRegeneration: false } as never;
    mockCacheService.get.mockResolvedValue({ data: cachedTags, createdAt: Date.now() });

    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
    expect(tags).toEqual(cachedTags);
    expect(mockCacheService.set).not.toHaveBeenCalled();
  });

  it('getOrGenerateCachedFromContext generates and caches on miss', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockResolvedValue(undefined);

    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
    expect(tags.title.length).toBeGreaterThan(0);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('getOrGenerateCachedFromContext does not cache fallback tags on generation failure', async () => {
    mockCacheService.get.mockResolvedValue(null);
    const spy = jest
      .spyOn(TitleGenerator, 'generateFromThread')
      .mockImplementation(() => { throw new Error('NLP timeout'); });

    const tags = await metaTagService.getOrGenerateCachedFromContext(channel, messages);
    spy.mockRestore();

    expect(tags.needsRegeneration).toBe(true);
    expect(mockCacheService.set).not.toHaveBeenCalled();
  });

  it('invalidateCache delegates to MetaTagCache.invalidate', async () => {
    mockCacheService.invalidate.mockResolvedValue(undefined);
    await metaTagService.invalidateCache('chan-001');
    expect(mockCacheService.invalidate).toHaveBeenCalledWith('meta:channel:chan-001');
  });

  it('buildCanonicalUrl constructs correct path', () => {
    const url = metaTagService.buildCanonicalUrl('game-dev-hub', 'unity-physics-help');
    expect(url).toContain('/c/game-dev-hub/unity-physics-help');
  });

  it('buildCanonicalUrl encodes reserved characters in slug segments', () => {
    const url = metaTagService.buildCanonicalUrl('my server', 'q&a channel');
    expect(url).toContain('/c/my%20server/q%26a%20channel');
    expect(url).not.toContain(' ');
    expect(url).not.toContain('&');
  });

  it('generateMetaTagsFromContext emits index,follow for PUBLIC_INDEXABLE', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(
      { ...channel, visibility: 'PUBLIC_INDEXABLE' },
      messages,
    );
    expect(tags.robots).toBe('index, follow');
  });

  it('generateMetaTagsFromContext emits noindex,follow for PUBLIC_NO_INDEX', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(
      { ...channel, visibility: 'PUBLIC_NO_INDEX' },
      messages,
    );
    expect(tags.robots).toBe('noindex, follow');
  });

  it('generateMetaTagsFromContext emits noindex,nofollow for PRIVATE', async () => {
    const tags = await metaTagService.generateMetaTagsFromContext(
      { ...channel, visibility: 'PRIVATE' },
      messages,
    );
    expect(tags.robots).toBe('noindex, nofollow');
  });
});
```

#### Tool: exec_command

```sh
gh api graphql -f owner=CS485-Harmony -f repo=Harmony -F number=443 -f query='query($owner:String!,$repo:String!,$number:Int!){ repository(owner:$owner,name:$repo){ pullRequest(number:$number){ reviewThreads(first:50){ nodes{ isResolved comments(first:10){ nodes{ author{login} body path line originalLine createdAt } } } } } } }'
```

Output:

````text
{"data":{"repository":{"pullRequest":{"reviewThreads":{"nodes":[{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagService.generateMetaTags signature diverges from the dev spec referenced by this PR (spec defines generateMetaTags(channelId, options?) and expects the service to fetch context internally). Either align the method signature/behavior to the spec or update the spec/PR description so downstream integrations don’t drift.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":35,"createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. The context-driven implementation is renamed to generateMetaTagsFromContext(channel, messages) for unit tests. A spec-aligned stub generateMetaTags(channelId, options?) is added that throws 'not implemented — wired by M4 (issue #356)'. Callers will be updated to the spec signature when the channel-resolver is wired in M4.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":35,"createdAt":"2026-04-20T14:29:20Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"scheduleRegeneration stub does not match the spec return shape (spec expects a jobId and queued/deduplicated status, plus optional priority/idempotencyKey). Even as a stub, keeping the spec signature/return type will prevent a breaking refactor when M4 wires the queue.\n```suggestion\n  async scheduleRegeneration(\n    channelId: string,\n    options?: { priority?: string; idempotencyKey?: string },\n  ): Promise<{\n    jobId: string;\n    status: 'queued' | 'deduplicated';\n    priority?: string;\n    idempotencyKey?: string;\n  }> {\n    // Queuing logic wired by M4 MetaTagUpdateWorker.\n    // Keep the stub contract aligned with the queue spec to avoid a breaking API change later.\n    return {\n      jobId: `meta-tag-regeneration:${channelId}`,\n      status: 'queued',\n      priority: options?.priority,\n      idempotencyKey: options?.idempotencyKey,\n    };\n```","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":81,"createdAt":"2026-04-20T13:50:58Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. scheduleRegeneration now returns Promise<{ jobId: string; status: 'queued' | 'deduplicated' }> with the stub returning a placeholder jobId, matching the spec contract for AC-5/AC-6.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":81,"createdAt":"2026-04-20T14:28:49Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getRegenerationJobStatus stub signature differs from the spec (spec takes both channelId and jobId and returns a MetaTagJobStatus object). Keeping the correct parameters/return type now will make M4 wiring straightforward.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":86,"createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. getRegenerationJobStatus now takes (channelId: string, jobId: string) and returns Promise<MetaTagJobStatus | null>. MetaTagJobStatus type added to types.ts per spec.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":86,"createdAt":"2026-04-20T14:28:42Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"OpenGraphGenerator.generateOGTags signature doesn’t match the dev spec for CL-C2.4 (spec describes channel/server/analysis-driven generation). If this module is meant to satisfy the spec interface for later wiring, adjust the signature (or add an adapter) to avoid refactors.","path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"originalLine":15,"createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"generateOGTags already accepts channel as its first parameter (unchanged). The related generateTwitterCard signature was aligned with spec in 177c384 (channel is now the first param). The broader spec-signature alignment for generateMetaTags/getOrGenerateCached is addressed separately — see those threads.","path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"originalLine":15,"createdAt":"2026-04-20T14:29:28Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagSet includes needsRegeneration, but the dev spec’s CL-D1 MetaTagSet DTO doesn’t include this field (needs_regeneration is modeled in persistence metadata). Consider keeping regeneration status separate (wrapper type) or update the DTO/spec consistently to avoid contract drift.\n```suggestion\n  keywords: string[];\n}\n\nexport interface MetaTagSetWithRegenerationStatus {\n  metaTags: MetaTagSet;\n```","path":"harmony-backend/src/services/metaTag/types.ts","line":41,"originalLine":40,"createdAt":"2026-04-20T13:50:59Z"},{"author":{"login":"AvanishKulkarni"},"body":"Won't fix: The existing unit tests directly assert tags.needsRegeneration (AC-9 test, fallback test), so removing the field from MetaTagSet would break them. Keeping it on the DTO for now; can be split into a wrapper type when the full persistence layer lands in M3/M4.","path":"harmony-backend/src/services/metaTag/types.ts","line":41,"originalLine":40,"createdAt":"2026-04-20T14:29:12Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"DescriptionGenerator.enforceLength only truncates >160 chars and never enforces the 50-char minimum, so generateFromMessages can return descriptions shorter than 50 characters for short channel/server names or very short messages (violates AC-2). Update the length policy to guarantee MIN_LENGTH before returning (e.g., append more context deterministically).\n```suggestion\n  padToMinimumLength(text: string): string {\n    const additions = [\n      ' Join the discussion.',\n      ' Explore the latest updates.',\n      ' Connect with the community.',\n    ];\n\n    let padded = text.trim();\n    if (padded.length === 0) {\n      padded = 'Join the discussion and explore the latest updates.';\n    }\n\n    let additionIndex = 0;\n    while (padded.length < MIN_LENGTH) {\n      padded += additions[additionIndex % additions.length];\n      additionIndex += 1;\n    }\n\n    return padded;\n  },\n\n  enforceLength(text: string): string {\n    let result = text;\n    if (result.length < MIN_LENGTH) {\n      result = this.padToMinimumLength(result);\n    }\n\n    if (result.length > MAX_LENGTH) {\n      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';\n    }\n    return result;\n```","path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"originalLine":59,"createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. enforceLength now pads text below 50 chars by appending context phrases before truncating. All AC-2 unit tests pass.","path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"originalLine":59,"createdAt":"2026-04-20T14:28:12Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"TitleGenerator.generateFromMessage sanitizes only message.content; channel.serverName is appended without sanitization/normalization. Since server names are user-controlled, sanitize the full composed string (or sanitize serverName separately) before truncation to keep title output consistently safe.\n```suggestion\n    const raw = `${message.content} — ${channel.serverName}`;\n    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));\n```","path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"originalLine":21,"createdAt":"2026-04-20T13:51:00Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Now sanitizes the full composed string (message.content + channel.serverName) via sanitizeForTitle before truncation.","path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"originalLine":21,"createdAt":"2026-04-20T14:27:58Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"applyTemplate uses String.replace per variable, which only replaces the first occurrence of each placeholder. If a template repeats a placeholder (common in localized templates), later occurrences will remain unreplaced. Use a global replacement strategy (e.g., replaceAll or a global RegExp) per key.\n```suggestion\n      (result, [key, value]) => result.replaceAll(`{${key}}`, value),\n```","path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"originalLine":45,"createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Changed result.replace to result.replaceAll so all occurrences of each placeholder are substituted.","path":"harmony-backend/src/services/metaTag/titleGenerator.ts","line":null,"originalLine":45,"createdAt":"2026-04-20T14:27:52Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"summarizeThread interpolates channel.name and channel.serverName directly into the output without sanitizing/normalizing them. Since these are user-controlled strings, meta descriptions can contain HTML/attribute-breaking characters. Sanitize channel/server fields the same way you sanitize message content.\n```suggestion\n  sanitizeText(text: string): string {\n    return text.replace(/<[^>]*>/g, '').replace(/\\s+/g, ' ').trim();\n  },\n\n  summarizeThread(messages: MessageContext[], channel: ChannelContext): string {\n    const serverName = this.sanitizeText(channel.serverName);\n    const channelName = this.sanitizeText(channel.name);\n    const suffix = ` — Join the discussion on ${serverName}.`;\n\n    if (messages.length === 0) {\n      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;\n      return this.enforceLength(base);\n    }\n\n    const first = this.sanitizeText(messages[0].content);\n    const prefix = `${serverName} › #${channelName}: `;\n```","path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"originalLine":45,"createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added sanitizeText helper to DescriptionGenerator; summarizeThread now sanitizes channel.name and channel.serverName before interpolation.","path":"harmony-backend/src/services/metaTag/descriptionGenerator.ts","line":null,"originalLine":45,"createdAt":"2026-04-20T14:28:05Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"getOrGenerateCached currently requires ChannelContext + MessageContext[] + optional ttl, but the spec API is getOrGenerateCached(channelId) with caching handled internally. Consider aligning the signature (and moving message fetching inside) to match the spec contract.\n```suggestion\n  async resolveChannelContext(_channelId: string): Promise<ChannelContext> {\n    throw new Error('metaTagService.resolveChannelContext must be implemented with channel lookup');\n  },\n\n  async resolveMessageContexts(_channelId: string): Promise<MessageContext[]> {\n    throw new Error('metaTagService.resolveMessageContexts must be implemented with message lookup');\n  },\n\n  async getOrGenerateCached(\n    channelOrId: ChannelContext | string,\n    messagesOrTtl?: MessageContext[] | number,\n    ttl?: number,\n  ): Promise<MetaTagSet> {\n    const channelId = typeof channelOrId === 'string' ? channelOrId : channelOrId.id;\n    const cached = await MetaTagCache.get(channelId);\n    if (cached) return cached;\n\n    const channel =\n      typeof channelOrId === 'string'\n        ? await this.resolveChannelContext(channelOrId)\n        : channelOrId;\n    const messages =\n      typeof channelOrId === 'string'\n        ? await this.resolveMessageContexts(channelOrId)\n        : Array.isArray(messagesOrTtl)\n          ? messagesOrTtl\n          : [];\n    const cacheTtl =\n      typeof messagesOrTtl === 'number'\n        ? messagesOrTtl\n        : ttl;\n\n    const tags = await this.generateMetaTags(channel, messages);\n    await MetaTagCache.set(channel.id, tags, cacheTtl);\n```","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":70,"createdAt":"2026-04-20T13:51:01Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. Added spec-aligned stub getOrGenerateCached(channelId: string) that throws 'not implemented — wired by M4'. The context-driven variant is renamed to getOrGenerateCachedFromContext(channel, messages, ttl?) for use in unit tests and internal generation flow.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":70,"createdAt":"2026-04-20T14:29:05Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"MetaTagCache exposes a ttl property, but set() defaults to DEFAULT_TTL rather than the exported ttl field, so MetaTagCache.ttl is effectively unused/misleading. Consider making ttl the single source of truth (or remove the field).","path":"harmony-backend/src/services/metaTag/metaTagCache.ts","line":11,"originalLine":11,"createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. set() now uses ttl ?? this.ttl so MetaTagCache.ttl is the single source of truth for the default TTL.","path":"harmony-backend/src/services/metaTag/metaTagCache.ts","line":11,"originalLine":11,"createdAt":"2026-04-20T14:28:19Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateBreadcrumbList hard-codes the https://harmony.chat domain for the server URL. Use the same configurable BASE_URL/origin used elsewhere so structured data is correct in staging/dev/alternate deployments.","path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","line":37,"originalLine":28,"createdAt":"2026-04-20T13:51:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateBreadcrumbList now reads process.env.BASE_URL ?? 'https://harmony.chat' consistent with metaTagService.ts.","path":"harmony-backend/src/services/metaTag/structuredDataGenerator.ts","line":37,"originalLine":28,"createdAt":"2026-04-20T14:28:26Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"generateTwitterCard signature also diverges from the spec’s CL-C2.4 API (spec is channel/server/analysis-based, not raw strings). Consider aligning the public API now (even if the implementation is still a skeleton).\n```suggestion\n  generateTwitterCard(\n    channel: ChannelContext,\n    title: string,\n    description: string,\n    image?: string,\n  ): TwitterCardTags {\n    return {\n      card: 'summary_large_image',\n      title,\n      description,\n      image: image ?? this.selectPreviewImage(channel),\n```","path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"originalLine":27,"createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. generateTwitterCard now accepts channel as the first parameter (matching spec CL-C2.4). Also fixed the card type: uses 'summary' by default, only 'summary_large_image' when a non-default preview image is available.","path":"harmony-backend/src/services/metaTag/openGraphGenerator.ts","line":null,"originalLine":27,"createdAt":"2026-04-20T14:28:34Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"copilot-pull-request-reviewer"},"body":"buildFallbackTags uses raw channel/server names and only truncates/enforces max length; it does not sanitize. Because fallback is used on generation errors, it should still produce sanitized values to avoid unsafe content flowing into rendered <head>. Route fallback strings through the same sanitization/normalization as the main generators.\n```suggestion\nimport sanitizeHtml from 'sanitize-html';\n\nconst logger = createLogger({ component: 'meta-tag-service' });\n\nconst BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';\n\nfunction sanitizeMetaText(value: string): string {\n  return sanitizeHtml(value, {\n    allowedTags: [],\n    allowedAttributes: {},\n  }).replace(/\\s+/g, ' ').trim();\n}\n\nfunction buildFallbackTags(channel: ChannelContext): MetaTagSet {\n  const sanitizedChannel: ChannelContext = {\n    ...channel,\n    name: sanitizeMetaText(channel.name),\n    serverName: sanitizeMetaText(channel.serverName),\n  };\n  const title = `${sanitizedChannel.name} — ${sanitizedChannel.serverName}`;\n  const description = `Discussions in #${sanitizedChannel.name} on ${sanitizedChannel.serverName}.`;\n  return {\n    title: TitleGenerator.truncateWithEllipsis(title),\n    description: DescriptionGenerator.enforceLength(description),\n    canonical: sanitizedChannel.canonicalUrl,\n    robots: 'index, follow',\n    openGraph: OpenGraphGenerator.generateOGTags(sanitizedChannel, title, description),\n    twitter: OpenGraphGenerator.generateTwitterCard(title, description),\n    structuredData: StructuredDataGenerator.generateDiscussionForum(sanitizedChannel, title, description),\n```","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":24,"createdAt":"2026-04-20T13:51:03Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in 177c384. buildFallbackTags now runs channel fields through sanitizeChannelContext (which uses TitleGenerator.sanitizeForTitle) before any interpolation — no new dependency needed since the regex sanitizer is already in scope.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":24,"createdAt":"2026-04-20T14:28:57Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"chatgpt-codex-connector"},"body":"**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Derive robots directive from channel visibility**\n\nThis path always emits `robots: 'index, follow'`, which is incorrect for channels that are `PUBLIC_NO_INDEX` (and potentially private states) and can lead crawlers to index content that was explicitly configured not to be indexed. I checked the existing visibility model in `harmony-backend/src/trpc/routers/channel.router.ts` (which already supports `PUBLIC_NO_INDEX`), so this service should carry visibility in `ChannelContext` and map it to the correct robots directive instead of hardcoding index/follow.\n\nUseful? React with 👍 / 👎.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":67,"createdAt":"2026-04-21T19:18:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in b5a5950. `ChannelContext` now has an optional `visibility` field (`PUBLIC_INDEXABLE | PUBLIC_NO_INDEX | PRIVATE`). The robots directive is derived via `getRobotsDirective(channel.visibility)` — `PUBLIC_NO_INDEX` emits `noindex, follow`, `PRIVATE` emits `noindex, nofollow`, and `PUBLIC_INDEXABLE` (or unset) emits `index, follow`.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":67,"createdAt":"2026-04-21T19:26:21Z"}]}},{"isResolved":true,"comments":{"nodes":[{"author":{"login":"chatgpt-codex-connector"},"body":"**<sub><sub>![P2 Badge](https://img.shields.io/badge/P2-yellow?style=flat)</sub></sub>  Encode canonical URL path segments**\n\n`buildCanonicalUrl` interpolates raw slugs directly into the URL, so reserved characters in `serverSlug`/`channelSlug` (e.g. spaces, `?`, `#`, `/`) will produce invalid or misparsed canonical links. This is actionable because channel slug input is not regex-restricted in the API layer (only min/max length), and other URL generation in this repo already URL-encodes slugs for safety. Use `encodeURIComponent` for both path segments before concatenation.\n\nUseful? React with 👍 / 👎.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":146,"createdAt":"2026-04-21T19:18:02Z"},{"author":{"login":"AvanishKulkarni"},"body":"Fixed in b5a5950. Both `serverSlug` and `channelSlug` are now wrapped with `encodeURIComponent` in `buildCanonicalUrl`, consistent with the sitemap implementation. Test added to verify reserved characters are percent-encoded.","path":"harmony-backend/src/services/metaTag/metaTagService.ts","line":null,"originalLine":146,"createdAt":"2026-04-21T19:26:27Z"}]}}]}}}}}
````

#### Tool: exec_command

```sh
sed -n '1997,2180p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
### 9.1 Module M2: Meta Tag Generation

#### 9.1.1 CL-C2.1 MetaTagService

**Public Methods:**

```typescript
// Generate complete meta tag set for a channel
generateMetaTags(
  channelId: string,
  options?: {
    forceRegenerate?: boolean,
    includeStructuredData?: boolean
  }
): Promise<MetaTagSet>

// Get meta tags with caching
getOrGenerateCached(
  channelId: string
): Promise<MetaTagSet>

// Invalidate cached meta tags
invalidateCache(
  channelId: string
): Promise<void>

// Schedule background regeneration
scheduleRegeneration(
  channelId: string,
  priority?: 'high' | 'normal' | 'low',
  idempotencyKey?: string
): Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>

// Get meta tags for admin preview
getMetaTagsForPreview(
  channelId: string
): Promise<MetaTagPreview>

// Poll status for a regeneration job
getRegenerationJobStatus(
  channelId: string,
  jobId: string
): Promise<MetaTagJobStatus>
```

**Generation and Override Rules:**
- Auto-generated values target SEO limits (`title <= 60`, `description <= 160`).
- Admin overrides (`custom_title`, `custom_description`, `custom_og_image`) always take precedence over generated values when present.
- Background regeneration updates generated fields only and must not overwrite custom override fields.
- If NLP analysis fails or times out (>5s), generation falls back to channel/topic-based tags and marks `needs_regeneration=true`.

#### 9.1.2 CL-C2.2 TitleGenerator

**Public Methods:**

```typescript
// Generate title from channel data
generateFromChannel(
  channel: Channel,
  server: Server
): string

// Generate title for specific message deep link
generateFromMessage(
  message: Message,
  channel: Channel
): string

// Generate title for thread view
generateFromThread(
  messages: Message[],
  channel: Channel
): string
```

**Private Methods:**

```typescript
private truncateWithEllipsis(
  text: string,
  maxLength: number
): string

private sanitizeForTitle(
  text: string
): string

private applyTemplate(
  template: string,
  data: TitleData
): string
```

**Length Policy:** `TitleGenerator` output is capped at 60 characters. Longer admin overrides are allowed via `MetaTagOverride.customTitle` (max 70).

#### 9.1.3 CL-C2.3 DescriptionGenerator

**Public Methods:**

```typescript
// Generate description from messages
generateFromMessages(
  messages: Message[],
  channel: Channel
): string

// Extract key phrases for description
extractKeyPhrases(
  content: string,
  maxPhrases: number
): string[]

// Summarize thread for description
summarizeThread(
  messages: Message[]
): string
```

**Length Policy:** `DescriptionGenerator` output is capped at 160 characters. Longer admin overrides are allowed via `MetaTagOverride.customDescription` (max 200).

#### 9.1.4 CL-C2.4 OpenGraphGenerator

**Public Methods:**

```typescript
// Generate Open Graph tags
generateOGTags(
  channel: Channel,
  server: Server,
  analysis: ContentAnalysis
): OpenGraphTags

// Generate Twitter Card tags
generateTwitterCard(
  channel: Channel,
  server: Server,
  analysis: ContentAnalysis
): TwitterCardTags

// Select best preview image
selectPreviewImage(
  channel: Channel,
  messages: Message[]
): string | null
```

**Twitter Card Rule:** default to `summary`; switch to `summary_large_image` only when a valid large preview image is available.

#### 9.1.5 CL-C2.5 StructuredDataGenerator

**Public Methods:**

```typescript
// Generate DiscussionForumPosting schema
generateDiscussionForum(
  channel: Channel,
  messages: Message[],
  server: Server
): StructuredData

// Generate BreadcrumbList schema
generateBreadcrumbList(
  server: Server,
  channel: Channel
): StructuredData

// Generate Organization schema
generateOrganization(
  server: Server
): StructuredData

// Generate WebPage schema
generateWebPage(
  channel: Channel,
  metaTags: MetaTagSet
): StructuredData
```

### 9.2 Module M3: Content Analysis

#### 9.2.1 CL-C3.1 ContentAnalyzer

**Public Methods:**
````

#### Tool: exec_command

```sh
sed -n '2470,2505p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
  title: string;
  description: string;
  image: string;
  site: string;
}
```

#### 9.5.4 CL-D4 StructuredData

```typescript
interface StructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: Person;
  datePublished: string;
  dateModified: string;
  mainEntity: object;
  breadcrumb: object;
}
```

#### 9.5.5 CL-D5 ContentAnalysis

```typescript
interface ContentAnalysis {
  keywords: string[];
  topics: string[];
  summary: string;
  sentiment: string;
  readingLevel: string;
}
```

### 9.6 Domain Entities
````

#### Tool: exec_command

```sh
sed -n '3139,3153p' docs/dev-spec-seo-meta-tag-generation.md
```

Output:

```text
## 14. Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1 | Every public channel page serves non-empty `<title>` and `<meta name="description">` tags. | E2E crawler test |
| AC-2 | Auto-generated title length is <=60 characters; auto-generated description is 50-160 characters. | Unit tests (`TitleGenerator`, `DescriptionGenerator`) |
| AC-3 | Effective override limits are enforced (`customTitle <=70`, `customDescription <=200`). | API validation test (`PUT /meta-tags`) |
| AC-4 | `onVisibilityChanged` handling of `VISIBILITY_CHANGED(newVisibility=PRIVATE)` invalidates cache and removes sitemap URL. | Integration test |
| AC-5 | Regeneration API returns `jobId` and supports status polling to terminal states (`succeeded`/`failed`). | API integration test |
| AC-6 | Idempotency key deduplicates repeated regenerate requests within 60 seconds. | API integration test |
| AC-7 | Custom overrides are never overwritten by background regeneration. | Integration test with queued jobs |
| AC-8 | Generated tags exclude PII and profanity for fixture content. | Security/content filter tests |
| AC-9 | On NLP failure/timeout, fallback tags are returned and `needs_regeneration=true` is persisted. | Fault-injection unit/integration test |
| AC-10 | De-index workflow executes when channel visibility changes from public to private. | End-to-end visibility transition test |
```

#### Tool: exec_command

```sh
git diff --stat FETCH_HEAD..pr-443
```

Output:

```text
 .github/workflows/run-frontend-e2e.yml             |   4 +
 docs/deployment/replica-readiness-audit.md         |  12 +-
 harmony-backend/src/events/eventBus.ts             |   4 -
 harmony-backend/src/routes/events.router.ts        | 293 +++----
 .../src/services/metaTag/descriptionGenerator.ts   |  99 +++
 .../src/services/metaTag/metaTagCache.ts           |  22 +
 .../src/services/metaTag/metaTagService.ts         | 170 ++++
 .../src/services/metaTag/openGraphGenerator.ts     |  60 ++
 .../services/metaTag/structuredDataGenerator.ts    |  71 ++
 .../src/services/metaTag/titleGenerator.ts         |  65 ++
 harmony-backend/src/services/metaTag/types.ts      | 100 +++
 .../src/services/serverMember.service.ts           |  25 -
 harmony-backend/tests/events.router.server.test.ts | 111 +--
 harmony-backend/tests/events.router.test.ts        | 112 ---
 harmony-backend/tests/helpers/async.ts             |  27 -
 harmony-backend/tests/metaTagService.test.ts       | 325 +++++++
 harmony-backend/tests/serverMember.test.ts         |  67 +-
 llm-logs/2026-04-20-094302-session-ce430386.md     | 784 +++++++++++++++++
 llm-logs/2026-04-20-094337-session-e79268af.md     | 478 -----------
 llm-logs/2026-04-20-100616-session-12bb34ec.md     | 468 ----------
 llm-logs/2026-04-20-122835-session-b13d715d.md     | 942 +++++++++++++++++++++
 .../claude-conversation-2026-04-18-b42b9611.md     | 141 ---
 .../claude-conversation-2026-04-20-c779de46.md     | 209 -----
 .../claude-conversation-2026-04-20-cc169300.md     | 255 ------
 tests/integration/attachments.test.ts              |  14 +-
 tests/integration/env.ts                           |  11 -
 26 files changed, 2791 insertions(+), 2078 deletions(-)
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/openGraphGenerator.ts
```

Output:

```text
// CL-C2.4 OpenGraphGenerator — generates OG and Twitter Card tags
import type { ChannelContext, OpenGraphTags, TwitterCardTags, MetaTagSet, IMetaTagGenerator, ContentAnalysis } from './types';

const DEFAULT_IMAGE = process.env.OG_DEFAULT_IMAGE ?? 'https://harmony.chat/og-default.png';
const SITE_NAME = 'Harmony';
const TWITTER_SITE = '@harmonychat';

export const OpenGraphGenerator: IMetaTagGenerator & {
  defaultImage: string;
  // Spec §9.1.4: generateOGTags(channel, server, analysis)
  generateOGTags(channel: ChannelContext, server: unknown, analysis: ContentAnalysis): OpenGraphTags;
  // Spec §9.1.4: generateTwitterCard(channel, server, analysis)
  generateTwitterCard(channel: ChannelContext, server: unknown, analysis: ContentAnalysis, image?: string): TwitterCardTags;
  // Spec §9.1.4: selectPreviewImage(channel, messages): string | null
  selectPreviewImage(channel: ChannelContext, messages: unknown[]): string | null;
} = {
  defaultImage: DEFAULT_IMAGE,

  // M2 skeleton: title from analysis.topics[0], description from analysis.summary; full NLP integration by M4
  generateOGTags(channel: ChannelContext, _server: unknown, analysis: ContentAnalysis): OpenGraphTags {
    return {
      ogTitle: analysis.topics[0] ?? channel.name,
      ogDescription: analysis.summary,
      ogImage: OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE,
      ogType: 'website',
      ogUrl: channel.canonicalUrl,
      ogSiteName: SITE_NAME,
    };
  },

  generateTwitterCard(
    channel: ChannelContext,
    _server: unknown,
    analysis: ContentAnalysis,
    image?: string,
  ): TwitterCardTags {
    const resolvedImage = image ?? OpenGraphGenerator.selectPreviewImage(channel, []) ?? DEFAULT_IMAGE;
    const isCustomImage = resolvedImage !== DEFAULT_IMAGE;
    return {
      card: isCustomImage ? 'summary_large_image' : 'summary',
      title: analysis.topics[0] ?? channel.name,
      description: analysis.summary,
      image: resolvedImage,
      site: TWITTER_SITE,
    };
  },

  // M2 skeleton: always returns default image; real selection by M4 (messages/channel avatars)
  selectPreviewImage(_channel: ChannelContext, _messages: unknown[]): string | null {
    return DEFAULT_IMAGE;
  },

  // CL-I1 stubs — full generate/validate wired by M4
  generate(): MetaTagSet {
    throw new Error('OpenGraphGenerator.generate() not yet implemented — wired by M4');
  },
  validate(): boolean {
    throw new Error('OpenGraphGenerator.validate() not yet implemented — wired by M4');
  },
};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/descriptionGenerator.ts
```

Output:

```text
// CL-C2.3 DescriptionGenerator — generates meta descriptions (AC-2: 50-160 chars)
import type { MessageContext, ChannelContext, MetaTagSet, IMetaTagGenerator } from './types';

const MAX_LENGTH = 160;
const MIN_LENGTH = 50;

export const DescriptionGenerator: IMetaTagGenerator & {
  maxLength: number;
  minLength: number;
  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string;
  extractKeyPhrases(content: string, maxPhrases: number): string[];
  sanitizeText(text: string): string;
  summarizeThread(messages: MessageContext[]): string;
  enforceLength(text: string): string;
} = {
  maxLength: MAX_LENGTH,
  minLength: MIN_LENGTH,

  generateFromMessages(messages: MessageContext[], channel: ChannelContext): string {
    const serverName = this.sanitizeText(channel.serverName);
    const channelName = this.sanitizeText(channel.name);
    const suffix = ` — Join the discussion on ${serverName}.`;

    if (messages.length === 0) {
      const base = `Discussions in #${channelName} on ${serverName}. Join today.`;
      return this.enforceLength(base);
    }

    const summary = this.summarizeThread(messages);
    const prefix = `${serverName} › #${channelName}: `;
    let text = prefix + summary;

    if (text.length < MIN_LENGTH) {
      text = text + suffix;
    }

    return this.enforceLength(text);
  },

  // Spec: extractKeyPhrases(content: string, maxPhrases: number): string[]
  extractKeyPhrases(content: string, maxPhrases: number): string[] {
    const words = content
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    const freq = new Map<string, number>();
    for (const word of words) {
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }

    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxPhrases)
      .map(([word]) => word);
  },

  sanitizeText(text: string): string {
    return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  },

  // Spec: summarizeThread(messages: Message[]): string — channel context handled by generateFromMessages
  summarizeThread(messages: MessageContext[]): string {
    if (messages.length === 0) return '';
    return this.sanitizeText(messages[0].content);
  },

  enforceLength(text: string): string {
    let result = text;

    if (result.length < MIN_LENGTH) {
      const additions = [
        ' Join the discussion.',
        ' Explore the latest updates.',
        ' Connect with the community.',
      ];
      let i = 0;
      while (result.length < MIN_LENGTH) {
        result += additions[i % additions.length];
        i++;
      }
    }

    if (result.length > MAX_LENGTH) {
      return result.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
    }
    return result;
  },

  // CL-I1 stubs — full generate/validate wired by M4
  generate(): MetaTagSet {
    throw new Error('DescriptionGenerator.generate() not yet implemented — wired by M4');
  },
  validate(): boolean {
    throw new Error('DescriptionGenerator.validate() not yet implemented — wired by M4');
  },
};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/titleGenerator.ts
```

Output:

```text
// CL-C2.2 TitleGenerator — generates SEO-optimized titles (AC-2: ≤60 chars)
import type { ChannelContext, MessageContext, MetaTagSet, IMetaTagGenerator } from './types';

const MAX_LENGTH = 60;

const CHANNEL_TEMPLATE = '{channelName} — {serverName}';

export const TitleGenerator: IMetaTagGenerator & {
  maxLength: number;
  generateFromChannel(channel: ChannelContext): string;
  generateFromMessage(message: MessageContext, channel: ChannelContext): string;
  generateFromThread(messages: MessageContext[], channel: ChannelContext): string;
  truncateWithEllipsis(text: string): string;
  sanitizeForTitle(text: string): string;
  applyTemplate(template: string, vars: Record<string, string>): string;
} = {
  maxLength: MAX_LENGTH,

  generateFromChannel(channel: ChannelContext): string {
    const raw = CHANNEL_TEMPLATE.replace('{channelName}', channel.name).replace(
      '{serverName}',
      channel.serverName,
    );
    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
  },

  generateFromMessage(message: MessageContext, channel: ChannelContext): string {
    const raw = `${message.content} — ${channel.serverName}`;
    return this.truncateWithEllipsis(this.sanitizeForTitle(raw));
  },

  generateFromThread(messages: MessageContext[], channel: ChannelContext): string {
    if (messages.length === 0) {
      return this.generateFromChannel(channel);
    }
    return this.generateFromMessage(messages[0], channel);
  },

  truncateWithEllipsis(text: string): string {
    if (text.length <= MAX_LENGTH) return text;
    return text.slice(0, MAX_LENGTH - 1).trimEnd() + '…';
  },

  sanitizeForTitle(text: string): string {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  applyTemplate(template: string, vars: Record<string, string>): string {
    return Object.entries(vars).reduce(
      (result, [key, value]) => result.replaceAll(`{${key}}`, value),
      template,
    );
  },

  // CL-I1 stubs — full generate/validate wired by M4
  generate(): MetaTagSet {
    throw new Error('TitleGenerator.generate() not yet implemented — wired by M4');
  },
  validate(): boolean {
    throw new Error('TitleGenerator.validate() not yet implemented — wired by M4');
  },
};
```

#### Tool: exec_command

```sh
git show pr-443:harmony-backend/src/services/metaTag/metaTagCache.ts
```

Output:

```text
// CL-C2.6 MetaTagCache — Redis-backed cache for generated meta tags (D7.1)
import { cacheService, CacheKeys } from '../cache.service';
import type { MetaTagSet } from './types';

const DEFAULT_TTL = 3600; // seconds, per spec D7.1

export const MetaTagCache = {
  ttl: DEFAULT_TTL,

  async get(channelId: string): Promise<MetaTagSet | null> {
    const entry = await cacheService.get<MetaTagSet>(CacheKeys.metaChannel(channelId));
    return entry?.data ?? null;
  },

  async set(channelId: string, tags: MetaTagSet, ttl?: number): Promise<void> {
    await cacheService.set(CacheKeys.metaChannel(channelId), tags, { ttl: ttl ?? DEFAULT_TTL });
  },

  async invalidate(channelId: string): Promise<void> {
    await cacheService.invalidate(CacheKeys.metaChannel(channelId));
  },
};
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:37:40.865Z

The latest changes address the prior blockers: structured-data return types now match §9.1.5, breadcrumb server slugs are encoded, the PR description removed the stale pre-existing-failure note, and checks are green. I don’t see a remaining spec-alignment issue that warrants another changes request.

#### Tool: exec_command

```sh
cat > /tmp/pr443-review.md <<'EOF'
## PR Review Checklist

- [x] **1. Prioritize Logic over Style** — Re-reviewed latest head `3bb2ff7` for behavioral/API-contract issues rather than style.
- [x] **2. Security First** — No new security issue found; user-controlled titles/descriptions are sanitized and crawler-facing URL path segments are encoded.
- [x] **3. Architectural Alignment** — The M2 generator/service signatures now align with `docs/dev-spec-seo-meta-tag-generation.md` §9.1, including the structured-data methods from §9.1.5.
- [x] **4. Issue Completion** — The PR now covers the M2 skeleton, AC-2 length behavior, AC-9 fallback behavior, visibility-derived robots, cache fallback handling, and the expected stub contracts for later M4 wiring.
- [x] **5. No Nitpicking** — No style-only feedback added.
- [x] **6. Avoid Repetition** — Existing review threads were checked; the earlier blockers are resolved and I am not repeating prior comments.
- [x] **7. Iterative Reviews** — Confirmed the latest push addresses the previous requested changes: `StructuredData` return types, breadcrumb slug encoding, robots mapping, canonical encoding, cache fallback behavior, job-status contract, and PR description wording.
- [x] **8. Prevent CI Failures** — Current GitHub checks are green: backend/frontend lint and build, backend/frontend tests, and integration tests all pass.

## Review (Approve)

Latest head `3bb2ff7` addresses my remaining concerns. `StructuredDataGenerator.generateBreadcrumbList()` and `generateOrganization()` now return `StructuredData`, and the breadcrumb server URL uses `encodeURIComponent(channel.serverSlug)`, matching the encoded canonical URL policy and the §9.1.5 method contract.

The PR description/test plan is also corrected: the stale note about `tests/metaTag.repository.test.ts` being a pre-existing failure is gone, and the description now says the existing suite passes, including that test. That makes sense for the current PR state and avoids leaving a misleading failure caveat in the merge record.

I don’t have further blocking feedback.
EOF
gh pr review 443 --repo CS485-Harmony/Harmony --approve --body-file /tmp/pr443-review.md
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:37:59.324Z

The approval review has been submitted. I’m verifying GitHub recorded it on the expected PR/head before I close this out.

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json reviewDecision,headRefOid,latestReviews
```

Output:

````text
{"headRefOid":"3bb2ff7b8897157f1d64be80739a29833bdee1e5","latestReviews":[{"id":"","author":{"login":"copilot-pull-request-reviewer"},"authorAssociation":"CONTRIBUTOR","body":"## Pull request overview\n\nIntroduces the backend skeleton for M2 SEO meta tag generation under `harmony-backend/src/services/metaTag/`, including generators, a Redis-backed cache, and unit tests to validate basic length/sanitization/fallback behavior.\n\n**Changes:**\n- Added `MetaTagService` facade plus `MetaTagCache` (Redis via existing `cacheService`/`CacheKeys.metaChannel`).\n- Implemented initial `TitleGenerator`/`DescriptionGenerator` plus skeleton `OpenGraphGenerator`/`StructuredDataGenerator`.\n- Added Jest unit tests covering generators, cache behavior, and fallback behavior.\n\n### Reviewed changes\n\nCopilot reviewed 9 out of 9 changed files in this pull request and generated 14 comments.\n\n<details>\n<summary>Show a summary per file</summary>\n\n| File | Description |\r\n| ---- | ----------- |\r\n| harmony-backend/src/services/metaTag/types.ts | Adds DTOs/interfaces for meta tag generation outputs and inputs. |\r\n| harmony-backend/src/services/metaTag/titleGenerator.ts | Implements title generation, sanitization, truncation, and template application. |\r\n| harmony-backend/src/services/metaTag/descriptionGenerator.ts | Implements description generation, key phrase extraction, and length enforcement. |\r\n| harmony-backend/src/services/metaTag/openGraphGenerator.ts | Adds OG/Twitter tag generator skeleton and defaults. |\r\n| harmony-backend/src/services/metaTag/structuredDataGenerator.ts | Adds JSON-LD generator skeleton (discussion forum, breadcrumb, org, web page). |\r\n| harmony-backend/src/services/metaTag/metaTagCache.ts | Adds Redis-backed get/set/invalidate wrapper for meta tag cache. |\r\n| harmony-backend/src/services/metaTag/metaTagService.ts | Adds facade orchestration, caching entrypoint, invalidation, and fallback behavior. |\r\n| harmony-backend/tests/metaTagService.test.ts | Adds unit tests for generators, cache wrapper, and MetaTagService behavior. |\n</details>\n\n\n\n\n\n\n---\n\n💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","submittedAt":"2026-04-20T13:51:03Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":""}},{"id":"","author":{"login":"chatgpt-codex-connector"},"authorAssociation":"NONE","body":"\n### 💡 Codex Review\n\nHere are some automated review suggestions for this pull request.\n\n**Reviewed commit:** `c3a7a608c1`\n    \n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment \"@codex review\".\n\nIf Codex has suggestions, it will comment; otherwise it will react with 👍.\n\n\n\n\nCodex can also answer questions or update the PR. Try commenting \"@codex address that feedback\".\n            \n</details>","submittedAt":"2026-04-21T19:18:02Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":""}},{"id":"","author":{"login":"declanblanc"},"authorAssociation":"MEMBER","body":"## PR Review Checklist\n\n- [x] **1. Logic over Style** — Core logic is sound and the generation pipeline is coherent; concerns raised below are architectural, not stylistic.\n- [ ] **2. Security First** — `structuredDataGenerator.ts` hardcodes `https://harmony.chat` in `generateBreadcrumbList()` instead of reading `BASE_URL`, creating a potential data-leak path in non-production environments (staging/preview could expose wrong canonical URLs to crawlers).\n- [ ] **3. Architectural Alignment** — Multiple public method signatures diverge from the spec-defined contracts (§9.1). See details below.\n- [ ] **4. Issue Completion** — AC-9 (fallback + `needsRegeneration`) is covered, but AC-2 minimum length enforcement is incomplete, and several other acceptance criteria depend on correct method signatures that are not yet aligned (AC-5, AC-6 require `scheduleRegeneration` to return `{ jobId, status }`, not `void`).\n- [x] **5. No Nitpicking** — Only architectural and correctness issues raised.\n- [x] **6. Avoid Repetition** — First review on this PR.\n- [x] **7. Iterative Reviews** — First review.\n- [ ] **8. Prevent CI Failures** — The PR description acknowledges `tests/metaTag.repository.test.ts` is failing. That test failure exists on `main` and should be resolved before or alongside this PR to prevent CI regressions from compounding.\n\n---\n\n## Required Changes\n\n### 1. Method signatures must match the spec API contract (§9.1.1)\n\nThe spec defines these signatures for `MetaTagService`:\n\n```typescript\ngenerateMetaTags(channelId: string, options?: { forceRegenerate?: boolean, includeStructuredData?: boolean }): Promise<MetaTagSet>\ngetOrGenerateCached(channelId: string): Promise<MetaTagSet>\nscheduleRegeneration(channelId: string, priority?: 'high' | 'normal' | 'low', idempotencyKey?: string): Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>\ngetRegenerationJobStatus(channelId: string, jobId: string): Promise<MetaTagJobStatus>\ngetMetaTagsForPreview(channelId: string): Promise<MetaTagPreview>\n```\n\nThe implementation instead takes `(channel: ChannelContext, messages: MessageContext[])` — pre-fetched data — rather than a `channelId`. This is a contract-breaking departure: the spec intends `MetaTagService` to own resolution (looking up channel and messages internally, not receiving them from callers). More importantly, the stubs for `scheduleRegeneration` and `getRegenerationJobStatus` have the wrong signatures:\n\n- `scheduleRegeneration` returns `Promise<void>` but must return `Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>`. AC-5/AC-6 directly test this return shape.\n- `getRegenerationJobStatus` only accepts `_channelId` but the spec signature requires `(channelId: string, jobId: string)`.\n- `getMetaTagsForPreview` returns `Promise<MetaTagSet>` but the spec return type is `Promise<MetaTagPreview>`, which is a different shape (includes `searchPreview`, `socialPreview`, `isCustom`, `generatedAt`).\n\nEven as stubs, these signatures must match the spec so callers and future implementations are correct by construction.\n\n### 2. `IMetaTagGenerator` (CL-I1) interface is not implemented by any class\n\nThe spec (§3, §4.8) defines:\n\n```typescript\ninterface IMetaTagGenerator {\n  generate(): MetaTagSet;\n  validate(): boolean;\n}\n```\n\n`TitleGenerator`, `DescriptionGenerator`, and `OpenGraphGenerator` are all listed in the class diagram as implementing this interface. None of them do. The interface exists in `types.ts` but is never referenced. Since the spec explicitly lists this as `CL-I1` with an `implements` relationship, the skeleton is incomplete on this point.\n\n### 3. `DescriptionGenerator.enforceLength` does not enforce the minimum\n\n`enforceLength()` only truncates — it never pads or adjusts content that is below 50 characters. The method name implies it enforces both bounds (50–160). Callers that use `enforceLength` directly (e.g., `buildFallbackTags` in `metaTagService.ts`) can produce descriptions shorter than 50 chars, violating AC-2. The minimum enforcement should be present in `enforceLength` or the method should be renamed `truncateToMaxLength` to be accurate about what it does.\n\n### 4. Hardcoded base URL in `structuredDataGenerator.ts`\n\n`generateBreadcrumbList()` builds `https://harmony.chat/s/${channel.serverSlug}` with a hardcoded domain, but `metaTagService.ts` correctly reads `process.env.BASE_URL ?? 'https://harmony.chat'`. The structured data generator must use the same `BASE_URL` env var for consistency across environments. In a preview/staging deployment this will emit the wrong domain in JSON-LD output, potentially causing Google Search Console to reject the structured data.\n\n### 5. Twitter card type is always `summary_large_image`\n\nThe spec (§9.1.4) states: \"default to `summary`; switch to `summary_large_image` only when a valid large preview image is available.\" The implementation hardcodes `summary_large_image` in all cases. `selectPreviewImage` currently always returns the default image, so this always produces the large-image variant even when no real preview exists. The skeleton should either default to `summary` or apply the conditional logic specified.\n\n### 6. `generateDiscussionForum` omits required JSON-LD fields\n\nPer spec Appendix A and the flow diagrams (F1.19), `DiscussionForumPosting` requires `datePublished`, `dateModified`, and `author` to produce valid rich snippet schema. The current implementation returns:\n\n```typescript\n{ '@context', '@type', headline, description, mainEntity }\n```\n\nWithout `datePublished` and `author`, Google will not render a rich result for this structured data. These can be `null`/`undefined` stubs for now — the issue is they are not present at all in the return type or implementation, making the skeleton incorrect for downstream consumers.\n\n### 7. Pre-existing test failure in `metaTag.repository.test.ts`\n\nThe PR description notes this failure exists on `main`. Merging this PR without resolving it compounds the CI signal, making it harder to distinguish new regressions from pre-existing ones. This test failure should be fixed as part of this PR or tracked in a separate linked issue before merge.","submittedAt":"2026-04-20T13:50:40Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":""}},{"id":"","author":{"login":"FardeenI"},"authorAssociation":"MEMBER","body":"- [x] **Prioritize Logic over Style:** Focusing on correctness/contract drift (not formatting).\n- [x] **Security First:** No secrets added; sanitization added for user-controlled strings.\n- [ ] **Architectural Alignment:** Several public method signatures still diverge from `docs/dev-spec-seo-meta-tag-generation.md` §9.1.*.\n- [ ] **Issue Completion:** Issue #350 AC requires spec-named signatures; a few are still mismatched.\n- [x] **No Nitpicking:** No style-only feedback.\n- [x] **Avoid Repetition:** Not repeating already-addressed review threads.\n- [x] **Iterative Reviews:** Considered existing review threads before adding new feedback.\n- [x] **Prevent CI Failures:** CI is green; requested changes are contract/spec alignment to prevent future breakage.\n\n---\n\n## Requested changes (actionable)\n\n### 1) Align generator method signatures to the SEO spec (Issue #350 AC)\nRight now the M2 “skeleton” compiles/tests, but several exported method signatures don’t match the spec prototypes in `docs/dev-spec-seo-meta-tag-generation.md` §9.1. That’s likely to cause downstream integration churn when M3/M4 wiring lands.\n\n**`harmony-backend/src/services/metaTag/openGraphGenerator.ts`**\nSpec expects:\n- `generateOGTags(channel: Channel, server: Server, analysis: ContentAnalysis): OpenGraphTags`\n- `generateTwitterCard(channel: Channel, server: Server, analysis: ContentAnalysis): TwitterCardTags`\n- `selectPreviewImage(channel: Channel, messages: Message[]): string | null`\n\nCurrent signatures are `(channel, title, description)` and `selectPreviewImage(channel): string`.\n\n**Suggestion:** keep your current placeholder logic, but change the exported signatures to match spec and adapt callers (e.g. in `MetaTagService`, pass a placeholder `analysis` for now and ignore unused args in the generator).\n\n**`harmony-backend/src/services/metaTag/structuredDataGenerator.ts`**\nSpec expects:\n- `generateDiscussionForum(channel, messages, server)`\n- `generateBreadcrumbList(server, channel)`\n- `generateOrganization(server)`\n- `generateWebPage(channel, metaTags)`\n\nCurrent signatures are `(channel, title, description)` / `(channel)` / `()` / `(channel, title, description)`.\n\n**Suggestion:** change signatures to spec and keep stubs internally (you can still leave `author/datePublished` unset until M4).\n\n**`harmony-backend/src/services/metaTag/descriptionGenerator.ts`**\nSpec expects:\n- `extractKeyPhrases(content: string, maxPhrases: number): string[]`\n- `summarizeThread(messages: Message[]): string`\n\nCurrent `extractKeyPhrases(messages[])` and `summarizeThread(messages, channel)` diverge.\n\n**Suggestion:** add/rename the spec-shaped methods (they can be thin wrappers around your current logic: join messages -> content; keep `maxPhrases` configurable rather than hardcoded to 5).\n\n### 2) Spec return type for `getRegenerationJobStatus`\nIn `harmony-backend/src/services/metaTag/metaTagService.ts`, spec has `Promise<MetaTagJobStatus>`; current stub returns `Promise<MetaTagJobStatus | null>`.\n\n**Suggestion:** for a stub, prefer throwing `not implemented` (or return a placeholder status) to keep the signature aligned.\n\n### 3) (Optional) PR signal/noise\nThis PR includes 2 new `llm-logs/*.md` artifacts. If those are required by process, OK—just noting it makes reviews harder to scan.\n","submittedAt":"2026-04-20T16:33:39Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":""}},{"id":"","author":{"login":"acabrera04"},"authorAssociation":"MEMBER","body":"## PR Review Checklist\n\n- [x] **1. Prioritize Logic over Style** — Re-reviewed latest head `3bb2ff7` for behavioral/API-contract issues rather than style.\n- [x] **2. Security First** — No new security issue found; user-controlled titles/descriptions are sanitized and crawler-facing URL path segments are encoded.\n- [x] **3. Architectural Alignment** — The M2 generator/service signatures now align with `docs/dev-spec-seo-meta-tag-generation.md` §9.1, including the structured-data methods from §9.1.5.\n- [x] **4. Issue Completion** — The PR now covers the M2 skeleton, AC-2 length behavior, AC-9 fallback behavior, visibility-derived robots, cache fallback handling, and the expected stub contracts for later M4 wiring.\n- [x] **5. No Nitpicking** — No style-only feedback added.\n- [x] **6. Avoid Repetition** — Existing review threads were checked; the earlier blockers are resolved and I am not repeating prior comments.\n- [x] **7. Iterative Reviews** — Confirmed the latest push addresses the previous requested changes: `StructuredData` return types, breadcrumb slug encoding, robots mapping, canonical encoding, cache fallback behavior, job-status contract, and PR description wording.\n- [x] **8. Prevent CI Failures** — Current GitHub checks are green: backend/frontend lint and build, backend/frontend tests, and integration tests all pass.\n\n## Review (Approve)\n\nLatest head `3bb2ff7` addresses my remaining concerns. `StructuredDataGenerator.generateBreadcrumbList()` and `generateOrganization()` now return `StructuredData`, and the breadcrumb server URL uses `encodeURIComponent(channel.serverSlug)`, matching the encoded canonical URL policy and the §9.1.5 method contract.\n\nThe PR description/test plan is also corrected: the stale note about `tests/metaTag.repository.test.ts` being a pre-existing failure is gone, and the description now says the existing suite passes, including that test. That makes sense for the current PR state and avoids leaving a misleading failure caveat in the merge record.\n\nI don’t have further blocking feedback.\n","submittedAt":"2026-04-21T19:37:53Z","includesCreatedEdit":false,"reactionGroups":[],"state":"APPROVED","commit":{"oid":""}}],"reviewDecision":"CHANGES_REQUESTED"}
````

#### Tool: exec_command

```sh
gh pr checks 443 --repo CS485-Harmony/Harmony
```

Output:

```text
Backend Lint and Build	pass	27s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348241/job/72385070627	
Frontend Lint and Build	pass	45s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348241/job/72385070585	
Run Backend Tests	pass	1m17s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348250/job/72385070682	
Run Frontend Tests	pass	29s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348281/job/72385070673	
Run Integration Tests	pass	1m55s	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348272/job/72385070720	
Vercel Preview Comments	pass	0	https://vercel.com/github	
Run Cloud Integration Tests	skipping	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24742348272/job/72385071036	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/5zTWWgTJeiFv3xceGRb7k4dmejUJ	Deployment has completed
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:38:06.312Z

Approved PR #443 on latest head `3bb2ff7`.

I verified the SEO meta-tag changes against `docs/dev-spec-seo-meta-tag-generation.md`, confirmed the prior blockers were fixed, and included the PR-description note in the posted review: the stale `metaTag.repository.test.ts` failure caveat is gone and the description now says that test passes. Current checks are green. GitHub may still show `CHANGES_REQUESTED` because older reviews from other reviewers remain, but my latest review is `APPROVED`.

<oai-mem-citation>
<citation_entries>
MEMORY.md:234-234|note=[used Harmony review workflow reminder to post checklist and bundled review]
MEMORY.md:155-157|note=[used Harmony PR review workflow memory entry for repo-specific review process]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>

### Turn 9: [$codex-conversation-exporter](/Users/allen/repos/codex-logs-export/skil

#### 👤 User Prompt

- Time: 2026-04-21T19:38:26.260Z

```text
[$codex-conversation-exporter](/Users/allen/repos/codex-logs-export/skills/codex-conversation-exporter/SKILL.md) 019dabb8-56c4-7e63-bbdb-d18101c2c726 to the PR branch under llm-logs/acabrera04-logs/final
```

_No assistant or tool activity recorded after this prompt._

### Turn 10: <skill> <name>codex-conversation-exporter</name>

#### 👤 User Prompt

- Time: 2026-04-21T19:38:26.260Z

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

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:38:32.848Z

Using the `codex-conversation-exporter` skill because this is a Codex session-log export. I’ll switch to the PR branch, export the specified thread with the local CLI into `llm-logs/acabrera04-logs/final`, then stage/commit/push that log to the PR branch.

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## HEAD (no branch)
```

#### Tool: exec_command

```sh
git branch --show-current
```

Output:

```text

```

#### Tool: exec_command

```sh
gh pr view 443 --repo CS485-Harmony/Harmony --json headRefName,headRepositoryOwner,headRepository,headRefOid
```

Output:

```text
{"headRefName":"feature/issue-350-meta-tag-service-skeleton","headRefOid":"3bb2ff7b8897157f1d64be80739a29833bdee1e5","headRepository":{"id":"R_kgDORIrGYw","name":"Harmony","nameWithOwner":""},"headRepositoryOwner":{"id":"O_kgDOEFWyLA","login":"CS485-Harmony"}}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:38:40.368Z

The worktree is currently detached at the PR head, and the PR branch is `feature/issue-350-meta-tag-service-skeleton` in `CS485-Harmony/Harmony`. I’m going to attach this worktree to that branch before writing the export so the commit lands on the PR branch.

#### Tool: exec_command

```sh
git remote -v
```

Output:

```text
origin	git@github.com:CS485-Harmony/Harmony.git (fetch)
origin	git@github.com:CS485-Harmony/Harmony.git (push)
```

#### Tool: exec_command

```sh
git branch --list 'feature/issue-350-meta-tag-service-skeleton' 'pr-443' -vv
```

Output:

```text
  pr-443 3bb2ff7 fix: align StructuredDataGenerator return types and encode breadcrumb serverSlug
```

#### Tool: exec_command

```sh
codex-export --help
```

Output:

```text
Usage: codex-export [options] [command]

Export Codex conversation logs to Markdown

Options:
  -h, --help                   display help for command

Commands:
  list [options]
  export [options] [threadId]
  help [command]               display help for command
```

#### Tool: exec_command

```sh
git switch -C feature/issue-350-meta-tag-service-skeleton pr-443
```

Output:

```text
Previous HEAD position was 951a3da Merge pull request #444 from CS485-Harmony/fix/issue-420-explicit-skip-cloud-attachment-tests
Switched to a new branch 'feature/issue-350-meta-tag-service-skeleton'
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-21T19:38:47.133Z

The local worktree is now on the PR branch at the reviewed head. Next I’m creating the requested log directory and exporting thread `019dabb8-56c4-7e63-bbdb-d18101c2c726` there.

#### Tool: exec_command

```sh
mkdir -p llm-logs/acabrera04-logs/final && codex-export export 019dabb8-56c4-7e63-bbdb-d18101c2c726 --out llm-logs/acabrera04-logs/final
```
