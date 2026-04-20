# Codex Conversation Export

## Metadata

- Thread ID: 019d7965-15b6-71f2-8d63-2b595f212231
- Timestamp: 2026-04-10T21:56:01.083Z
- CWD: /Users/allen/repos/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: high
- Rollout Path: /Users/allen/.codex/sessions/2026/04/10/rollout-2026-04-10T17-56-01-019d7965-15b6-71f2-8d63-2b595f212231.jsonl

## Transcript

### Turn 1: Review

#### 👤 User Prompt

- Time: 2026-04-10T21:56:03.828Z

```text
Review https://github.com/CS485-Harmony/Harmony/pull/315
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T21:56:15.512Z

Reviewing PR `#315` against the repo’s review rules first, then I’ll inspect the diff and verify the changed code paths locally before writing findings.

#### Tool: exec_command

```sh
rtk read .github/PR_REVIEW.md
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
rtk git status --short
```

Output:

```text
?? "P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html"
?? "P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? "P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? deployment-options.md
?? harmony-backend/coverage/
?? load-test.js
```

#### Tool: exec_command

```sh
rtk git remote -v
```

Output:

```text
origin	git@github.com:acabrera04/Harmony.git (fetch)
origin	git@github.com:acabrera04/Harmony.git (push)
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T21:56:25.091Z

I’ve loaded the repo’s review checklist and the PR-specific rules. Next I’m pulling the PR patch plus existing review comments so I can avoid duplicate feedback and focus on correctness and regressions.

#### Tool: mcp__codex_apps__github_fetch_pr

```json
{
  "pr_number": 315,
  "repo_full_name": "CS485-Harmony/Harmony"
}
```

Output:

````text
{"pull_request":{"url":"https://github.com/CS485-Harmony/Harmony/pull/315","number":315,"state":"open","merged":false,"mergeable":true,"draft":false,"body":"## Summary\n- Stacks on top of #311 (Sprint 4 deployment plan)\n- Adds `planning/FINAL_PROJECT_SPRINT_PLAN.md` covering Apr 10 – May 3\n- Sprint 5 (Apr 20 – May 3): 16 issues across 5 phases to finish SEO meta tag generation feature, validate on deployed stack, run bug bash, and deliver final submission package\n\n## Test plan\n- [ ] Review phase breakdown and owner assignments\n- [ ] Confirm Sprint 4 exit criteria align with #311 scope\n- [ ] Confirm AC-1..AC-10 coverage maps to dev spec §14\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","title":"Add Sprint 5 final project plan through May 3","base":"codex/sprint-4-deployment-plan","base_sha":"faba6e20e895363aa8a866c01cdb25436e6a3cef","head":"sprint-5-final-project-plan","head_sha":"f2a88098851f02772e8ed36746641c958e3cfbbd","merge_commit_sha":"a21c000f1ed5cc33eac40edf634d3cee0debb9e8","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"requested_reviewers":null,"diff":"@@ -0,0 +1,2 @@\n+# Session Log 2026-04-09-184230\n+\n@@ -0,0 +1,292 @@\n+# Final Project Sprint Plan — April 10 – May 3, 2026\n+\n+## Context\n+This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:\n+\n+- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.\n+- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.\n+\n+Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered \"done\" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.\n+\n+## Team\n+5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI\n+\n+---\n+\n+## Sprint 4 — Deployment (April 10–19)\n+\n+Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.\n+\n+### Sprint 4 exit criteria (must be true before Sprint 5 starts)\n+- Public Vercel frontend URL live on the apex domain\n+- Public Railway backend URL live on `api.<frontend-domain>`\n+- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton\n+- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production\n+- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations\n+- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green\n+- Branch protection on `main` with required checks\n+- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current\n+- README updated for user-facing and deployer-facing instructions\n+- P6 submission package assembled (links, logs, reflection, LLM logs)\n+\n+### Sprint 4 key dates\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |\n+| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |\n+| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |\n+| Apr 16 (Thu) | Branch protection enabled (#13) |\n+| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |\n+| Apr 19 (Sun) | P6 submission package complete (#15) |\n+\n+---\n+\n+## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)\n+\n+### Goal\n+Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.\n+\n+### Scope anchor\n+Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`\n+- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)\n+- Classes C1.1–C6.x per §3 / §4\n+- APIs / public interfaces per §9 / §10\n+- Acceptance criteria AC-1 through AC-10 per §14\n+\n+### Sprint 5 guardrails\n+- All work on feature branches with PR review (branch protection is live from Sprint 4)\n+- Every PR must pass `run-integration-tests` + unit workflows before merge\n+- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only\n+- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory\n+- All destructive schema changes follow the expand/contract convention established in Sprint 4\n+\n+---\n+\n+### Phase A — SEO backend core (April 20–23)\n+\n+**S1. Meta tag generation service skeleton (M2)**\n+- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGen`, and `MetaTagCache` per dev spec §3/§4\n+- Wire Redis-backed `MetaTagCache` with configurable TTL\n+- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)\n+- Assignee: **declanblanc**\n+- Backup: **acabrera04**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 exit criteria\n+\n+**S2. Content analysis module (M3)**\n+- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`\n+- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout\n+- Unit tests covering keyword extraction, summarization, and fallback paths\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 22\n+- Blocked by: none (parallel with S1)\n+\n+**S3. Data schema + persistence for meta tag overrides (§11)**\n+- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11\n+- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas\n+- Custom overrides must never be overwritten by background regeneration (AC-7)\n+- Assignee: **FardeenI**\n+- Backup: **AvanishKulkarni**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 migration-runner ownership\n+\n+**S4. REST + tRPC endpoints (§9, §10)**\n+- `GET /api/channels/:id/meta-tags`\n+- `PUT /api/channels/:id/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)\n+- `POST /api/channels/:id/meta-tags/regenerate` returning `jobId` with idempotency key (AC-5, AC-6)\n+- `GET /api/channels/:id/meta-tags/regenerate/:jobId` status polling\n+- API integration tests for each endpoint\n+- Assignee: **FardeenI**\n+- Due: Apr 23\n+- Blocked by: S1, S3\n+\n+---\n+\n+### Phase B — Background processing + visibility lifecycle (April 22–25)\n+\n+**S5. Background meta tag update worker (M4) on `backend-worker`**\n+- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration\n+- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus\n+- Worker must run as singleton only (enforced by Sprint 4 topology)\n+- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 24\n+- Blocked by: S1, S2\n+\n+**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**\n+- On `VISIBILITY_CHANGED → PRIVATE`: invalidate `MetaTagCache`, remove sitemap URL, flip `noindex`\n+- On `VISIBILITY_CHANGED → PUBLIC_INDEXABLE`: re-enqueue regeneration\n+- Integration tests covering both directions and cache/sitemap side effects\n+- Assignee: **declanblanc**\n+- Due: Apr 25\n+- Blocked by: S5\n+\n+**S7. Security + content filtering (§12, AC-8)**\n+- PII and profanity filters on generated titles/descriptions\n+- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`\n+- Unit tests with fixture content covering PII/profanity/XSS\n+- Assignee: **AvanishKulkarni**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 25\n+- Blocked by: S1\n+\n+---\n+\n+### Phase C — Frontend rendering + SEO surface (April 23–27)\n+\n+**S8. `HeadComponent` + `PublicChannelPage` integration (M1)**\n+- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`\n+- Use `getServerSideProps` / Next.js route handlers to fetch meta tags from backend at request time\n+- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain\n+- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name=\"description\">` (AC-1)\n+- Assignee: **declanblanc**\n+- Due: Apr 26\n+- Blocked by: S4, Sprint 4 #6 (frontend prod config)\n+\n+**S9. Sitemap + robots.txt finalization**\n+- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain\n+- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility\n+- Smoke test that private channels do not appear in sitemap\n+- Assignee: **AvanishKulkarni**\n+- Backup: **FardeenI**\n+- Due: Apr 27\n+- Blocked by: S6, S8\n+\n+**S10. Meta tag admin UI (creator override flow)**\n+- UI under channel settings for creator to view generated tags, override title/description, and trigger manual regeneration with job status polling\n+- Respect `customTitle`/`customDescription` length limits with client-side validation\n+- Assignee: **acabrera04**\n+- Backup: **declanblanc**\n+- Due: Apr 27\n+- Blocked by: S4\n+\n+---\n+\n+### Phase D — End-to-end verification on production (April 27–30)\n+\n+**S11. Integration tests for SEO feature (local + cloud)**\n+- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10\n+- Cloud-mode coverage stays read-only (reuse Sprint 4 isolation rules) — no mutation of the instructor-reviewed production dataset\n+- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)\n+- Assignee: **Aiden-Barrera**\n+- Due: Apr 29\n+- Blocked by: S8, S9, S10\n+\n+**S12. Production validation + evidence capture**\n+- Run cloud-target SEO integration suite against the deployed Vercel + Railway stack\n+- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, `noindex`/sitemap removal works on visibility flip\n+- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch\n+- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission\n+- Assignee: **declanblanc**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 30\n+- Blocked by: S11\n+\n+**S13. Bug bash + polish**\n+- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime\n+- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`\n+- Fix must-fix items only; document the rest in the reflection\n+- Assignee: **whole team**, coordinator: **FardeenI**\n+- Due: May 1\n+- Blocked by: S12\n+\n+---\n+\n+### Phase E — Final submission package (May 1–3)\n+\n+**S14. README + deployer guide final pass**\n+- Fold SEO feature usage, override flow, and regeneration behavior into README\n+- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)\n+- Assignee: **acabrera04**\n+- Due: May 2\n+- Blocked by: S10\n+\n+**S15. Final project submission package**\n+- Compile final deliverable checklist:\n+  - Public frontend URL + public backend URL (from Sprint 4)\n+  - Links to every dev spec document under `docs/`\n+  - Links to SEO feature PRs and commits\n+  - Integration test specs + code + local/cloud run output\n+  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)\n+  - Branch protection screenshot\n+  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)\n+  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)\n+  - LLM interaction logs under `llm-logs/` with model/version labels\n+- Assignee: **acabrera04**\n+- Backup: **FardeenI**\n+- Due: May 3\n+- Blocked by: S12, S13, S14\n+\n+**S16. Final reflection + retrospective**\n+- Team retrospective on the full project (Sprints 1–5)\n+- Each developer contributes a short written reflection to the submission doc\n+- Assignee: **whole team**, coordinator: **declanblanc**\n+- Due: May 3\n+- Blocked by: S15 draft\n+\n+---\n+\n+## Sprint 5 assignment summary\n+\n+| Developer | Issues | Focus |\n+|-----------|--------|-------|\n+| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |\n+| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |\n+| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |\n+| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |\n+| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |\n+\n+## Sprint 5 critical path\n+\n+```text\n+S1 Meta tag service  ─┐\n+S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐\n+S3 Schema/migration  ─┘                           │\n+                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission\n+S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘\n+S7 Security (needs S1) ──────────────────────────►\n+S9 Sitemap (needs S6, S8) ───────────────────────►\n+S10 Override UI (needs S4) ──────────────────────►\n+                                                   S14 README (needs S10) ─► S15\n+                                                   S16 Retrospective (parallel)\n+```\n+\n+## Sprint 5 timeline\n+\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |\n+| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |\n+| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |\n+| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |\n+| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |\n+| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |\n+| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |\n+| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |\n+| May 1 (Fri) | S13 bug bash complete; must-fix items merged |\n+| May 2 (Sat) | S14 README final pass merged |\n+| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |\n+\n+## Sprint 5 deliverables checklist\n+\n+The project is not complete until all of the following exist:\n+\n+- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack\n+- SEO meta tag generation service, content analysis, background worker, overrides API, and frontend SSR integration merged to `main`\n+- Creator override UI shipped\n+- Sitemap and robots.txt correctly respect channel visibility\n+- Cloud + local integration tests covering SEO paths passing in CI\n+- Production validation evidence: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation\n+- README updated for SEO feature and any new env vars\n+- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection\n+- LLM interaction logs archived under `llm-logs/`\n+- Team retrospective recorded\n+\n+## Notes\n+\n+- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).\n+- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.\n+- Cloud-mode tests remain read-only throughout Sprint 5 to protect the instructor-reviewed deployment.\n+- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.","comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #DD3EpVizF5G4FlNN76EvtXcdAIjUyUH2x/ZrE8QyuZo=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255LzdBZ3NDajd6U0huOUxXVVlhR0VjWHVwVmRKUnciLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/7AgsCj7zSHn9LWUYaGEcXupVdJRw) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 9:53pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:53:05Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/7AgsCj7zSHn9LWUYaGEcXupVdJRw\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 9:53pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"}],"created_at":"2026-04-10T21:52:55Z","updated_at":"2026-04-10T21:53:32Z","closed_at":null,"merged_at":null,"commits":2,"changed_files":2,"additions":294,"deletions":0,"display_url":"https://github.com/CS485-Harmony/Harmony/pull/315","display_title":"Add Sprint 5 final project plan through May 3"},"url":"https://github.com/CS485-Harmony/Harmony/pull/315","title":"Add Sprint 5 final project plan through May 3","diff":"@@ -0,0 +1,2 @@\n+# Session Log 2026-04-09-184230\n+\n@@ -0,0 +1,292 @@\n+# Final Project Sprint Plan — April 10 – May 3, 2026\n+\n+## Context\n+This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:\n+\n+- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.\n+- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.\n+\n+Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered \"done\" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.\n+\n+## Team\n+5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI\n+\n+---\n+\n+## Sprint 4 — Deployment (April 10–19)\n+\n+Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.\n+\n+### Sprint 4 exit criteria (must be true before Sprint 5 starts)\n+- Public Vercel frontend URL live on the apex domain\n+- Public Railway backend URL live on `api.<frontend-domain>`\n+- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton\n+- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production\n+- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations\n+- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green\n+- Branch protection on `main` with required checks\n+- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current\n+- README updated for user-facing and deployer-facing instructions\n+- P6 submission package assembled (links, logs, reflection, LLM logs)\n+\n+### Sprint 4 key dates\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |\n+| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |\n+| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |\n+| Apr 16 (Thu) | Branch protection enabled (#13) |\n+| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |\n+| Apr 19 (Sun) | P6 submission package complete (#15) |\n+\n+---\n+\n+## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)\n+\n+### Goal\n+Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.\n+\n+### Scope anchor\n+Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`\n+- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)\n+- Classes C1.1–C6.x per §3 / §4\n+- APIs / public interfaces per §9 / §10\n+- Acceptance criteria AC-1 through AC-10 per §14\n+\n+### Sprint 5 guardrails\n+- All work on feature branches with PR review (branch protection is live from Sprint 4)\n+- Every PR must pass `run-integration-tests` + unit workflows before merge\n+- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only\n+- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory\n+- All destructive schema changes follow the expand/contract convention established in Sprint 4\n+\n+---\n+\n+### Phase A — SEO backend core (April 20–23)\n+\n+**S1. Meta tag generation service skeleton (M2)**\n+- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGen`, and `MetaTagCache` per dev spec §3/§4\n+- Wire Redis-backed `MetaTagCache` with configurable TTL\n+- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)\n+- Assignee: **declanblanc**\n+- Backup: **acabrera04**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 exit criteria\n+\n+**S2. Content analysis module (M3)**\n+- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`\n+- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout\n+- Unit tests covering keyword extraction, summarization, and fallback paths\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 22\n+- Blocked by: none (parallel with S1)\n+\n+**S3. Data schema + persistence for meta tag overrides (§11)**\n+- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11\n+- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas\n+- Custom overrides must never be overwritten by background regeneration (AC-7)\n+- Assignee: **FardeenI**\n+- Backup: **AvanishKulkarni**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 migration-runner ownership\n+\n+**S4. REST + tRPC endpoints (§9, §10)**\n+- `GET /api/channels/:id/meta-tags`\n+- `PUT /api/channels/:id/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)\n+- `POST /api/channels/:id/meta-tags/regenerate` returning `jobId` with idempotency key (AC-5, AC-6)\n+- `GET /api/channels/:id/meta-tags/regenerate/:jobId` status polling\n+- API integration tests for each endpoint\n+- Assignee: **FardeenI**\n+- Due: Apr 23\n+- Blocked by: S1, S3\n+\n+---\n+\n+### Phase B — Background processing + visibility lifecycle (April 22–25)\n+\n+**S5. Background meta tag update worker (M4) on `backend-worker`**\n+- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration\n+- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus\n+- Worker must run as singleton only (enforced by Sprint 4 topology)\n+- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 24\n+- Blocked by: S1, S2\n+\n+**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**\n+- On `VISIBILITY_CHANGED → PRIVATE`: invalidate `MetaTagCache`, remove sitemap URL, flip `noindex`\n+- On `VISIBILITY_CHANGED → PUBLIC_INDEXABLE`: re-enqueue regeneration\n+- Integration tests covering both directions and cache/sitemap side effects\n+- Assignee: **declanblanc**\n+- Due: Apr 25\n+- Blocked by: S5\n+\n+**S7. Security + content filtering (§12, AC-8)**\n+- PII and profanity filters on generated titles/descriptions\n+- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`\n+- Unit tests with fixture content covering PII/profanity/XSS\n+- Assignee: **AvanishKulkarni**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 25\n+- Blocked by: S1\n+\n+---\n+\n+### Phase C — Frontend rendering + SEO surface (April 23–27)\n+\n+**S8. `HeadComponent` + `PublicChannelPage` integration (M1)**\n+- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`\n+- Use `getServerSideProps` / Next.js route handlers to fetch meta tags from backend at request time\n+- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain\n+- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name=\"description\">` (AC-1)\n+- Assignee: **declanblanc**\n+- Due: Apr 26\n+- Blocked by: S4, Sprint 4 #6 (frontend prod config)\n+\n+**S9. Sitemap + robots.txt finalization**\n+- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain\n+- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility\n+- Smoke test that private channels do not appear in sitemap\n+- Assignee: **AvanishKulkarni**\n+- Backup: **FardeenI**\n+- Due: Apr 27\n+- Blocked by: S6, S8\n+\n+**S10. Meta tag admin UI (creator override flow)**\n+- UI under channel settings for creator to view generated tags, override title/description, and trigger manual regeneration with job status polling\n+- Respect `customTitle`/`customDescription` length limits with client-side validation\n+- Assignee: **acabrera04**\n+- Backup: **declanblanc**\n+- Due: Apr 27\n+- Blocked by: S4\n+\n+---\n+\n+### Phase D — End-to-end verification on production (April 27–30)\n+\n+**S11. Integration tests for SEO feature (local + cloud)**\n+- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10\n+- Cloud-mode coverage stays read-only (reuse Sprint 4 isolation rules) — no mutation of the instructor-reviewed production dataset\n+- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)\n+- Assignee: **Aiden-Barrera**\n+- Due: Apr 29\n+- Blocked by: S8, S9, S10\n+\n+**S12. Production validation + evidence capture**\n+- Run cloud-target SEO integration suite against the deployed Vercel + Railway stack\n+- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, `noindex`/sitemap removal works on visibility flip\n+- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch\n+- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission\n+- Assignee: **declanblanc**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 30\n+- Blocked by: S11\n+\n+**S13. Bug bash + polish**\n+- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime\n+- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`\n+- Fix must-fix items only; document the rest in the reflection\n+- Assignee: **whole team**, coordinator: **FardeenI**\n+- Due: May 1\n+- Blocked by: S12\n+\n+---\n+\n+### Phase E — Final submission package (May 1–3)\n+\n+**S14. README + deployer guide final pass**\n+- Fold SEO feature usage, override flow, and regeneration behavior into README\n+- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)\n+- Assignee: **acabrera04**\n+- Due: May 2\n+- Blocked by: S10\n+\n+**S15. Final project submission package**\n+- Compile final deliverable checklist:\n+  - Public frontend URL + public backend URL (from Sprint 4)\n+  - Links to every dev spec document under `docs/`\n+  - Links to SEO feature PRs and commits\n+  - Integration test specs + code + local/cloud run output\n+  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)\n+  - Branch protection screenshot\n+  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)\n+  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)\n+  - LLM interaction logs under `llm-logs/` with model/version labels\n+- Assignee: **acabrera04**\n+- Backup: **FardeenI**\n+- Due: May 3\n+- Blocked by: S12, S13, S14\n+\n+**S16. Final reflection + retrospective**\n+- Team retrospective on the full project (Sprints 1–5)\n+- Each developer contributes a short written reflection to the submission doc\n+- Assignee: **whole team**, coordinator: **declanblanc**\n+- Due: May 3\n+- Blocked by: S15 draft\n+\n+---\n+\n+## Sprint 5 assignment summary\n+\n+| Developer | Issues | Focus |\n+|-----------|--------|-------|\n+| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |\n+| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |\n+| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |\n+| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |\n+| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |\n+\n+## Sprint 5 critical path\n+\n+```text\n+S1 Meta tag service  ─┐\n+S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐\n+S3 Schema/migration  ─┘                           │\n+                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission\n+S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘\n+S7 Security (needs S1) ──────────────────────────►\n+S9 Sitemap (needs S6, S8) ───────────────────────►\n+S10 Override UI (needs S4) ──────────────────────►\n+                                                   S14 README (needs S10) ─► S15\n+                                                   S16 Retrospective (parallel)\n+```\n+\n+## Sprint 5 timeline\n+\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |\n+| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |\n+| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |\n+| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |\n+| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |\n+| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |\n+| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |\n+| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |\n+| May 1 (Fri) | S13 bug bash complete; must-fix items merged |\n+| May 2 (Sat) | S14 README final pass merged |\n+| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |\n+\n+## Sprint 5 deliverables checklist\n+\n+The project is not complete until all of the following exist:\n+\n+- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack\n+- SEO meta tag generation service, content analysis, background worker, overrides API, and frontend SSR integration merged to `main`\n+- Creator override UI shipped\n+- Sitemap and robots.txt correctly respect channel visibility\n+- Cloud + local integration tests covering SEO paths passing in CI\n+- Production validation evidence: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation\n+- README updated for SEO feature and any new env vars\n+- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection\n+- LLM interaction logs archived under `llm-logs/`\n+- Team retrospective recorded\n+\n+## Notes\n+\n+- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).\n+- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.\n+- Cloud-mode tests remain read-only throughout Sprint 5 to protect the instructor-reviewed deployment.\n+- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.","comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #DD3EpVizF5G4FlNN76EvtXcdAIjUyUH2x/ZrE8QyuZo=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255LzdBZ3NDajd6U0huOUxXVVlhR0VjWHVwVmRKUnciLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/7AgsCj7zSHn9LWUYaGEcXupVdJRw) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 9:53pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:53:05Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/7AgsCj7zSHn9LWUYaGEcXupVdJRw\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 9:53pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"}],"display_url":"https://github.com/CS485-Harmony/Harmony/pull/315","display_title":"Add Sprint 5 final project plan through May 3"}
````

#### Tool: mcp__codex_apps__github_fetch_pr_comments

```json
{
  "pr_number": 315,
  "repo_full_name": "CS485-Harmony/Harmony"
}
```

Output:

```text
{"comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #DD3EpVizF5G4FlNN76EvtXcdAIjUyUH2x/ZrE8QyuZo=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255LzdBZ3NDajd6U0huOUxXVVlhR0VjWHVwVmRKUnciLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/7AgsCj7zSHn9LWUYaGEcXupVdJRw) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 9:53pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:53:05Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/7AgsCj7zSHn9LWUYaGEcXupVdJRw\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 9:53pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"}],"url":"https://github.com/CS485-Harmony/Harmony/pull/315","title":"CS485-Harmony/Harmony PR #315 comments","display_url":"https://github.com/CS485-Harmony/Harmony/pull/315","display_title":"CS485-Harmony/Harmony PR #315 comments"}
```

#### Tool: mcp__codex_apps__github_fetch_issue_comments

```json
{
  "issue_number": 315,
  "repo_full_name": "CS485-Harmony/Harmony"
}
```

Output:

```text
{"comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #DD3EpVizF5G4FlNN76EvtXcdAIjUyUH2x/ZrE8QyuZo=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255LzdBZ3NDajd6U0huOUxXVVlhR0VjWHVwVmRKUnciLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/7AgsCj7zSHn9LWUYaGEcXupVdJRw) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 9:53pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":null,"review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/7AgsCj7zSHn9LWUYaGEcXupVdJRw\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 9:53pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"}],"url":"https://github.com/CS485-Harmony/Harmony/issues/315","title":"CS485-Harmony/Harmony Issue #315 comments","display_url":"https://github.com/CS485-Harmony/Harmony/issues/315","display_title":"CS485-Harmony/Harmony Issue #315 comments"}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T21:56:41.214Z

The PR is documentation-only, so the review hinges on whether the plan is internally consistent with the existing sprint plan and the SEO spec. I’m checking those source documents now and looking for schedule, dependency, or acceptance-criteria mismatches.

#### Tool: mcp__codex_apps__github_list_pr_changed_filenames

```json
{
  "pr_number": 315,
  "repo_full_name": "CS485-Harmony/Harmony"
}
```

Output:

```text
{"filenames":["llm-logs/2026-04-09-184230-session-c9f15ca0.md","planning/FINAL_PROJECT_SPRINT_PLAN.md"]}
```

#### Tool: exec_command

```sh
rtk read planning/SPRINT_4_PLAN.md
```

Output:

````text
Total output lines: 581

# Deployment Sprint Plan — April 10–19, 2026

## Context
Harmony is a search-engine-indexable chat application with a Next.js frontend and an Express + tRPC backend backed by PostgreSQL and Redis. Sprint 4 adapts the P6 deployment assignment to a **Vercel + Railway** production stack:

- **Frontend hosting:** Vercel
- **Backend hosting:** Railway
- **Database:** Railway Postgres
- **Cache / event bus:** Railway Redis
- **Public deployment goal:** keep the app deployed through instructor review
- **Scaling goal:** support **2 or more backend API replicas** on Railway while keeping background event processing correct

This sprint must cover the substance of **P6 Deployment** while ignoring the AWS-only platform choice. The plan therefore replaces:

- AWS Lambda/API Gateway with Railway backend services
- AWS Amplify with Vercel frontend hosting
- AWS CD workflows with Vercel/Railway CD workflows

Integration testing for this sprint uses a dual-target model: `local` for deterministic development verification and `cloud` for validation of the real deployed multi-replica system.

The assignment requirements we still must satisfy are:

1. Publicly deploy frontend and backend
2. Automate deployment from GitHub
3. Add integration test specifications and implementation
4. Run integration tests locally and in the cloud
5. Add GitHub Actions for integration tests
6. Adopt GitHub hygiene and branch protection
7. Update README with user-facing and deployer-facing instructions
8. Produce the final submission artifacts, links, logs, and reflection

**Assignment:** P6: Deployment  
**Due:** Sunday, April 19, 2026, 11:59 PM AOE

## Team
5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI

## Target Architecture

### Public Services
- `frontend` on Vercel
- `backend-api` on Railway with **2+ replicas**

### Internal / Stateful Services
- `backend-worker` on Railway with **1 replica only**
- `postgres` on Railway
- `redis` on Railway

### Domain Layout
- `https://<frontend-domain>` -> Vercel
- `https://api.<frontend-domain>` -> Railway `backend-api`

### Multi-Backend Railway Rules
To safely support 2+ backend replicas, the sprint must remove or isolate process-local production state:

- Public/auth rate limiting must use **Redis-backed shared storage**
- File uploads must use **shared object storage**, not local disk
- Background subscribers / cache invalidation / sitemap updates must run in a **singleton worker**
- API replicas must be stateless apart from live SSE client connections
- Deployment verification must prove that 2+ API replicas behave correctly behind Railway load balancing

### Explicit Production Decisions
- **SEO ownership:** the **Vercel frontend apex domain** is the canonical public SEO surface. `robots.txt`, sitemap/index entrypoints, canonical URLs, and `metadataBase` must resolve on the frontend domain, not the API subdomain.
- **Sitemap handoff:** the frontend apex domain serves crawler-facing sitemap entrypoints through **Next.js route handlers** that fetch sitemap/XML data from the backend at request time. The backend may generate sitemap data, but the API subdomain is not the direct crawl target in production.
- **Attachment storage target:** production uploads use **Cloudflare R2 via an S3-compatible provider**. Local filesystem storage remains development-only.
- **SSE strategy:** multi-replica realtime uses **Redis pub/sub fan-out on every `backend-api` replica**. Each replica subscribes to the shared event bus and pushes matching events to its own connected SSE clients. The production design must not depend on sticky sessions at the Railway load balancer.
- **Migration ownership:** exactly **one migration runner** owns `prisma migrate deploy` during production rollout. `backend-api` replicas must not run Prisma migrations on startup. The migration runner may be a one-shot Railway job or a controlled pre-deploy step attached to the worker rollout.
- **Railway service networking:** `backend-api` and `backend-worker` must use **Railway private/internal connection strings** for Postgres and Redis in production, not public TCP proxy endpoints.
- **Auth & CORS contract:** production frontend and API traffic is cross-origin across sibling subdomains, so the deployment architecture must explicitly define:
  - the backend CORS allowlist for production and preview frontend origins
  - **browser-to-backend auth uses Bearer access tokens in the `Authorization` header**, matching the current application model; API authentication must not depend on browser cookies being sent cross-origin to the backend
  - any frontend-only session cookie used for Next.js middleware remains a frontend concern and is not the backend auth transport
  - the CSRF posture for the chosen auth transport; with bearer-header auth as the primary backend mechanism, CSRF protection focuses on avoiding cookie-authenticated state-changing backend routes
- **Proxy trust model:** production Express instances run with **one trusted proxy hop** (`trust proxy = 1` or equivalent one-hop behavior) so rate limiting uses real client IPs without trusting arbitrary forwarded chains.
- **Worker resilience:** `backend-worker` is configured with a health check and restart-on-failure behavior. If the worker is unavailable, API request handling should remain available while worker-owned side effects degrade gracefully rather than crashing request paths.
- **Deploy authority:** **GitHub Actions** is the single source of truth for production deploys. Provider-native Git auto-deploys may be used for previews, but production promotion must be driven by the GitHub workflows in this sprint.
- **Cloud test data hygiene:** cloud-target validation uses **read-only smoke checks against deployed URLs** unless a separate isolated staging environment is provisioned. Cloud-mode tests must not mutate the instructor-reviewed production dataset.

---

## P6 Coverage Map

| P6 Requirement | Vercel + Railway Adaptation | Covered By Issues |
|---|---|---|
| Publicly deploy frontend | Deploy Next.js app to Vercel | #6, #12, #16 |
| Publicly deploy backend | Deploy Express/tRPC app to Railway | #5, #7, #11 |
| Publish backend public interfaces via REST | Keep Railway backend public routes stable and production-configured | #1, #5, #7 |
| Integration test specification | Write English-language integration spec for FE-BE paths | #8 |
| Integration tests on localhost | Add env-aware local integration test flow | #9 |
| Integration tests in cloud | Run same test suite against deployed Vercel + Railway URLs | #9, #14 |
| GitHub Action for integration tests | Add `run-integration-tests.yml` | #10 |
| Continuous deployment | Add backend and frontend deployment workflows for Railway and Vercel | #11, #12 |
| GitHub hygiene / branch protection | Require PRs and required checks before merge | #13 |
| README update | Add user-facing run instructions and deployer guide | #15 |
| Submission links, logs, reflection | Final packaging and artifact checklist | #15 |

---

## Issues (16 total)

> **Note:** Issues are written so they can be opened directly on GitHub with the dependency notes preserved in the body. "Blocked by" means the issue should not be considered complete until those upstream issues land. "Unblocks" is included to make sequencing explicit for the team.

### Phase 1: Architecture, Production Readiness, and Scaling Design — April 10–11

**1. Deployment Architecture + Environment Matrix**
- Define the final Vercel + Railway topology:
  - `frontend`
  - `backend-api`
  - `backend-worker`
  - `postgres`
  - `redis`
- Document production env vars for frontend, backend API, and worker
- Define domain plan (`frontend` domain + `api` subdomain)
- Define promotion flow for preview vs production
- Produce and save a reference document at `docs/deployment/deployment-architecture.md`
  - this document is the canonical reference for service topology, domain ownership, env vars, deploy authority, and preview vs production behavior
  - later deployment issues should link to and update this document instead of redefining architecture assumptions
- Acceptance criteria:
  - Clear service inventory
  - Clear env var matrix
  - Clear ownership of public vs internal services
  - Explicit decision that `backend-api` scales to 2+ replicas and `backend-worker` stays singleton
  - `docs/deployment/deployment-architecture.md` records the production auth transport, cookie/header contract, CORS allowlist, and CSRF posture for the frontend/API split
  - `docs/deployment/deployment-architecture.md` exists and is usable as the canonical reference for downstream issues
- Assignee: **acabrera04**
- Backup owner: **declanblanc**
- Due: April 10
- Blocked by: none
- Unblocks: #2, #6, #7, #8, #16

**2. Backend Scale Audit for Railway Replicas**
- Audit the current backend for state that will break with 2+ API replicas
- Confirm and document the required changes for:
  - in-memory rate limiting
  - local filesystem attachment storage
  - duplicate startup subscribers / background jobs
  - SSE behavior behind load balancing
  - proxy/IP handling
- Produce and save a reference document at `docs/deployment/replica-readiness-audit.md`
  - include the concrete "replica-safe backend" checklist for implementation
  - include must-fix items, acceptable demo-time risks, and explicit ownership boundaries between `backend-api` and `backend-worker`
  - later scaling/deployment issues should cite this document when implementing or validating replica-safe behavior
- Acceptance criteria:
  - Checklist references the actual code areas that must change
  - Risks are prioritized into must-fix vs acceptable-for-demo
  - `backend-api` vs `backend-worker` responsibilities are finalized
  - `docs/deployment/replica-readiness-audit.md` exists and is detailed enough for downstream implementation/validation issues to reference directly
- Assignee: **declanblanc**
- Backup owner: **acabrera04**
- Due: April 10
- Blocked by: #1
- Unblocks: #3, #4, #5, #14

**3. Shared Rate Limiting + Proxy-Aware Networking**
- Replace process-local rate limiting with shared Redis-backed limiting
- Replace or unify **both** current implementations:
  - auth endpoint limiting using `express-rate-limit`
  - public-route token bucket limiting
- Ensure auth and public API rate limits remain correct across 2+ replicas
- Configure Express proxy awareness so client IP handling works correctly behind Railway
- Use `docs/deployment/replica-readiness-audit.md` as the implementation checklist and update it with final decisions
- Acceptance criteria:
  - Public and auth rate limits are shared across replicas
  - No process-local auth or public-route limit counters remain in production code paths
  - Redis-backed limiter mutations are atomic; non-atomic `INCR` + separate `EXPIRE` style patterns are explicitly disallowed for production rate-limit state
  - Production proxy trust is explicitly configured for a **single Railway hop** (`trust proxy = 1` or equivalent) and documented in deployment docs
  - Rate limit behavior is covered by tests or verification notes
- Assignee: **Aiden-Barrera**
- Due: April 11
- Blocked by: #2
- Unblocks: #14

**4. Production Attachment Storage Provider**
- Implement a production storage provider backed by **Cloudflare R2 via an S3-compatible interface**
- Keep local storage available for development only
- Add env-driven provider selection and document required secrets
- Ensure uploaded files remain accessible regardless of which API replica serves subsequent requests
- Follow `docs/deployment/replica-readiness-audit.md` for replica-safe storage requirements and update `docs/deployment/deployment-architecture.md` with the final env/config contract
- Acceptance criteria:
  - Production does not rely on local filesystem attachment serving
  - The chosen production provider is Cloudflare R2, documented as such in code and setup docs
  - README and env matrix document …1908 tokens truncated…ts
- Run the local-target integration suite in CI
- Keep the workflow name and job names stable so they can be required in branch protection
- Document how cloud-target integration tests are invoked outside CI when deployed URLs are available
- Reference `docs/deployment/deployment-architecture.md` for environment inputs and `docs/deployment/replica-readiness-audit.md` for any replica-sensitive checks excluded from local CI
- Acceptance criteria:
  - Workflow passes on a PR
  - Workflow is usable as a required status check
  - YAML is committed and documented
- Assignee: **FardeenI**
- Due: April 15
- Blocked by: #8, #9
- Unblocks: #13, #15

**11. GitHub Action — `deploy-railway.yml`**
- Create backend CD workflow for Railway
- Start from the already-provisioned Railway project tied to the current project state so the workflow can be scaffolded and dry-run this weekend
- Deploy `backend-api` and `backend-worker` on pushes to `main`
- Ensure migrations / build / deploy ordering is safe
- Use GitHub secrets for Railway authentication
- Treat GitHub Actions as the production deploy authority and document any provider-native auto-deploy settings that must be disabled or restricted
- Implement the workflow against the service topology and env contract defined in `docs/deployment/deployment-architecture.md`
- If final backend service split details are still landing, create the workflow early and finish the final production wiring immediately after #5 and #7
- Acceptance criteria:
  - Workflow deploys backend services without manual intervention
  - Production deploy authority is unambiguous and documented
  - Exactly one migration runner performs `prisma migrate deploy`, and `backend-api` replicas are prevented from racing migrations on startup
  - Schema rollout rules follow an **expand/contract** convention so destructive migrations are not introduced in the same deploy that must coexist with old API replicas during rolling restart
  - Deploys target the correct Railway environment
  - Deployment process is documented in README
- Assignee: **FardeenI**
- Backup owner: **Aiden-Barrera**
- Due: April 12
- Blocked by: #5, #7
- Unblocks: #14, #15

**12. GitHub Action — `deploy-vercel.yml`**
- Create frontend CD workflow for Vercel
- Start from the already-provisioned Vercel project tied to the current project state so the workflow can be scaffolded and dry-run this weekend
- Build/deploy frontend on pushes to `main`
- Ensure preview/production environment variables are configured properly
- Use GitHub secrets/tokens safely
- Treat GitHub Actions as the production deploy authority and document any provider-native auto-deploy settings that must be disabled or restricted
- Implement the workflow against the domain/env decisions in `docs/deployment/deployment-architecture.md`
- If final frontend production config is still landing, create the workflow early and finish the final production wiring immediately after #6 and #16
- Acceptance criteria:
  - Workflow deploys frontend without manual intervention
  - Production deploy authority is unambiguous and documented
  - Production deploy points at the production backend URL
  - Deployment process is documented in README
- Assignee: **declanblanc**
- Backup owner: **AvanishKulkarni**
- Due: April 12
- Blocked by: #6, #16
- Unblocks: #15

**13. GitHub Hygiene and Branch Protection**
- Enforce feature branch workflow
- Configure branch protection for `main`
- Require PR review before merge
- Require passing status checks before merge
- Record the exact required checks to enable:
  - existing unit test workflows
  - `run-integration-tests`
- Reference `docs/deployment/deployment-architecture.md` when documenting the production deploy authority and required checks tied to production promotion
- Acceptance criteria:
  - Direct pushes to `main` are blocked
  - PR review is required
  - Required status checks are enabled
  - Team workflow is documented
- Assignee: **Aiden-Barrera**
- Due: April 16
- Blocked by: #10
- Unblocks: #15

**16. Vercel Project Setup, Domains, and Preview/Prod Verification**
- Create/configure the Vercel project
- Bind the production domain
- Configure preview and production environment variables
- Verify frontend is talking to the correct Railway backend in production
- Configure domains and env vars to match `docs/deployment/deployment-architecture.md`
- Acceptance criteria:
  - Preview deployment works
  - Production deployment works
  - Domain and environment configuration are documented
- Assignee: **declanblanc**
- Backup owner: **FardeenI**
- Due: April 14
- Blocked by: #1, #6
- Unblocks: #12, #14, #15

### Phase 4: Multi-Replica Validation, Documentation, and Submission — April 16–19

**14. Railway Multi-Replica Validation and Deployment Evidence**
- Scale `backend-api` to **2 or more replicas** on Railway
- Keep `backend-worker` at **1 replica**
- Verify and capture evidence for:
  - public page loads through the deployed frontend
  - authenticated API behavior through multiple API replicas
  - shared rate limiting across replicas
  - attachment access independent of serving replica
  - cache invalidation / indexing behavior via singleton worker
  - SSE/realtime smoke verification in deployed environment
- Run the cloud-target integration/smoke suite against the deployed system
- Keep deployed-environment smoke verification read-only unless a separate isolated cloud test environment is explicitly provisioned
- Use the replica observability added in #5 to prove requests were served across 2+ API replicas via headers, health output, and/or structured logs
- Capture logs/screenshots/test output needed for submission
- Validate against the expected topology in `docs/deployment/deployment-architecture.md` and the replica-safety checklist in `docs/deployment/replica-readiness-audit.md`
- Acceptance criteria:
  - Live deployment is stable with `backend-api` at 2+ replicas
  - No replica-specific failures are observed for required paths
  - Proxy-aware rate limiting is validated against the documented one-hop trust model
  - Cloud-target tests pass against deployed URLs
  - Evidence clearly distinguishes deployed-system validation from localhost validation
- Assignee: **declanblanc**
- Backup owner: **Aiden-Barrera**
- Due: April 18
- Blocked by: #3, #4, #5, #7, #9, #11, #16
- Unblocks: #15

**15. README, Final Artifact Collection, and Submission Package**
- Update `README.md` with:
  - how web users access the deployed app
  - how to run the app locally
  - how a forked user sets up Vercel + Railway deployment
  - how CI/CD and branch protection are expected to work
- Fold in the final decisions captured in `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md`
- Compile the final P6-equivalent artifact checklist:
  - frontend deployment URL
  - backend deployment URL
  - integration test specification link
  - integration test code links
  - localhost test output
  - cloud test output
  - `run-integration-tests.yml` link
  - `deploy-vercel.yml` link
  - `deploy-railway.yml` link
  - README link
  - reflection placeholder/coordination
  - LLM log collection
- Acceptance criteria:
  - README is complete and accurate
  - Submission checklist has no missing artifacts
  - Team knows who owns final reflection/log collation
- Assignee: **acabrera04**
- Backup owner: **FardeenI**
- Due: April 19
- Blocked by: #4, #8, #9, #10, #11, #12, #13, #14, #16

---

## Assignment Summary

| Developer | Issues | Focus Area |
|-----------|--------|------------|
| acabrera04 | #1, #15 | Architecture/env matrix, final packaging |
| Aiden-Barrera | #3, #9, #13 | Shared rate limiting, integration test implementation, branch protection |
| AvanishKulkarni | #4 | Production storage |
| declanblanc | #2, #5, #6, #12, #14, #16 | Replica-safety audit, API/worker split, Vercel config/deploy, multi-replica validation |
| FardeenI | #7, #8, #10, #11 | Railway provisioning, integration test spec, integration-test CI, backend CD |

## Critical Path Backup Coverage

| Critical Issue | Primary | Backup |
|---|---|---|
| #1 Deployment Architecture + Environment Matrix | acabrera04 | declanblanc |
| #2 Backend Scale Audit for Railway Replicas | declanblanc | acabrera04 |
| #5 Split `backend-api` and Singleton `backend-worker` | declanblanc | acabrera04 |
| #7 Railway Project Provisioning and Service Wiring | FardeenI | Aiden-Barrera |
| #11 `deploy-railway.yml` | FardeenI | Aiden-Barrera |
| #14 Railway Multi-Replica Validation and Deployment Evidence | declanblanc | Aiden-Barrera |
| #15 README, Final Artifact Collection, and Submission Package | acabrera04 | FardeenI |

---

## Dependency Graph

```text
Foundation
==========
#1 Deployment Architecture + Env Matrix
  -> #2 Backend Scale Audit
  -> #6 Frontend Production Config
  -> #7 Railway Provisioning
  -> #8 Integration Test Spec
  -> #16 Vercel Project Setup

Scaling Safety
==============
#2 Backend Scale Audit
  -> #3 Shared Rate Limiting
  -> #4 Production Storage
  -> #5 API/Worker Split

Deployable App
==============
#5 API/Worker Split -> #7 Railway Provisioning -> #11 deploy-railway.yml
#6 Frontend Production Config -> #16 Vercel Setup -> #12 deploy-vercel.yml

Testing
=======
#8 Integration Test Spec -> #9 Integration Tests -> #10 run-integration-tests.yml

GitHub Hygiene
==============
#10 run-integration-tests.yml -> #13 Branch Protection

Final Validation
================
#3, #4, #5, #7, #9, #11, #16 -> #14 Multi-Replica Validation

Submission
==========
#4, #8, #9, #10, #11, #12, #13, #14, #16 -> #15 Final Packaging
```

---

## Timeline

| Date | Milestone |
|------|-----------|
| April 10 (Fri) | Sprint kickoff, architecture alignment, issue creation, and start of Issues #1 and #2 |
| April 11 (Sat) | Issues #1 and #2 complete; deployment/scaling approach locked; `deploy-railway.yml` and `deploy-vercel.yml` scaffolded against the existing Railway/Vercel projects; dry-run verification started |
| April 12 (Sun) | API/worker split complete; backend ready for Railway service split; `deploy-railway.yml` and `deploy-vercel.yml` finalized for the current project state |
| April 13 (Mon) | Railway provisioning/service wiring confirmed against the finalized CD workflows |
| April 14 (Tue) | Vercel project live; integration tests running locally and against cloud env; `run-integration-tests.yml` complete |
| April 16 (Thu) | Branch protection enabled; CD path verified through PR merge |
| April 18 (Sat) | Railway running with 2+ API replicas; deployment evidence captured |
| April 19 (Sun) | README finalized; submission package and reflection/log checklist complete |

---

## Deliverables Checklist

The sprint is not complete until all of the following exist:

- Public Vercel frontend URL
- Public Railway backend URL
- Railway backend deployed with **2+ `backend-api` replicas**
- Singleton Railway `backend-worker`
- Integration test specification document
- Integration test code committed
- Local integration test output captured
- Cloud-target integration or smoke test output captured against deployed URLs
- `.github/workflows/run-integration-tests.yml`
- `.github/workflows/deploy-railway.yml`
- `.github/workflows/deploy-vercel.yml`
- Branch protection enabled on `main`
- Updated `README.md`
- Final submission checklist document/materials
- Reflection ownership assigned
- LLM interaction logs collected with model/version labels

---

## Notes

- We are intentionally satisfying the **intent** of P6 using Vercel + Railway rather than AWS.
- The backend **must not** be considered successfully deployed until it has been verified with **2 or more Railway API replicas**.
- `backend-worker` is a deliberate singleton to prevent duplicate background event processing.
- Any production reliance on local filesystem storage or in-memory shared state is a sprint blocker.
- All work should proceed on feature branches with PR review; no direct pushes to `main`.
````

#### Tool: exec_command

```sh
rtk read docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
Total output lines: 3161

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
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M3 Content Analysis Module                                                │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C3.1 ContentAnalyzer        │    │ C3.2 KeywordExtractor           │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ keywordExtractor: ref       │    │ stopWords: Set<string>          │   │  │
│  │  │ summarizer: ref             │    │ ─────────────────────────────── │   │  │
│  │  │ topicClassifier: ref         │    │ extractKeywords()               │   │  │
│  │  │ ─────────────────────────── │    │ extractPhrases()                │   │  │
│  │  │ analyzeThread()             │───►│ scoreByFrequency()              │   │  │
│  │  │ getTopicCategory()          │    └─────────────────────────────────┘   │  │
│  │  │ getSentiment()              │                                          │  │
│  │  │ getReadingLevel()           │                                          │  │
│  │  └─────────────────────────────┘    ┌─────────────────────────────────┐   │  │
│  │  ┌─────────────────────────────┐    │ C3.4 TopicClassifier             │   │  │
│  │  │ C3.3 TextSummarizer         │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ categories: Category[]          │   │  │
│  │  │ maxSentences: number        │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ classify()                      │   │  │
│  │  │ summarize()                 │    │ getTop()                        │   │  │
│  │  │ extractFirstSentence()      │    │ getKeywords()                   │   │  │
│  │  │ extractKeySentences()       │    └─────────────────────────────────┘   │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M4 Background Processing Module                                           │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C4.1 MetaTagUpdateWorker    │    │ C4.2 EventListener              │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ queue: JobQueue             │    │ eventBus: EventBus              │   │  │
│  │  │ metaTagService: ref         │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ onMessageCreated()              │   │  │
│  │  │ processJob()                │◄───│ onMessageEdited()               │   │  │
│  │  │ scheduleUpdate()            │    │ onMessageDeleted()              │   │  │
│  │  │ batchProcess()              │    │ onVisibilityChanged()           │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────┐                                          │  │
│  │  │ C4.3 SitemapUpdater         │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ updateLastModified()         │                                          │  │
│  │  │ notifySearchEngines()       │                                          │  │
│  │  │ requestDeindex()            │                                          │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M5 Data Access Module                                                     │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C5.1 ChannelRepository      │    │ C5.2 MessageRepository          │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ database: DatabaseClient    │    │ database: DatabaseClient        │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ findById(), findBySlug(),     │    │ findRecentByChannel()            │   │  │
│  │  │ update(), findPublicByServer │    │ findFirstMessage()               │   │  │
│  │  │ Id(), getVisibility(),      │    │ getMessageCount()               │   │  │
│  │  │ getMetadata()               │    │                                 │   │  │
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
│  │  │ slug: VARCHAR(100)          │    │ content: TEXT          …42229 tokens truncated…an adapter that delegates generation to `MetaTagService.getOrGenerateCached()` from this spec.

#### Cross-Spec Visibility Event Contract (`VISIBILITY_CHANGED`)

| New Visibility | Expected Payload Fields | SEO Action |
|----------------|-------------------------|------------|
| `PUBLIC_INDEXABLE` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration, refresh tags, keep canonical URL indexable |
| `PUBLIC_NO_INDEX` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration with `noindex` directives while keeping page publicly accessible |
| `PRIVATE` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Invalidate cache, remove/purge URL, request de-index/removal |

### 10.2 Admin API Interface

```yaml
openapi: 3.0.3
info:
  title: Harmony Meta Tag Management API
  version: 1.0.0

paths:
  /api/admin/channels/{channelId}/meta-tags:
    get:
      summary: Get current meta tags for channel
      security:
        - bearerAuth: []
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Meta tags retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MetaTagPreview'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden (admin role required)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Channel not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

    put:
      summary: Update meta tags (custom override)
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MetaTagOverride'
      responses:
        '200':
          description: Meta tags updated
        '401':
          description: Unauthorized
        '403':
          description: Forbidden (admin role required)
        '404':
          description: Channel not found
        '422':
          description: Validation error (length, format, sanitization)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

    post:
      summary: Regenerate meta tags asynchronously
      security:
        - bearerAuth: []
      parameters:
        - name: Idempotency-Key
          in: header
          required: false
          schema:
            type: string
          description: Optional dedupe key for safe retries
      responses:
        '202':
          description: Regeneration scheduled (or deduplicated)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RegenerationJobAccepted'
        '401':
          description: Unauthorized
        '403':
          description: Forbidden (admin role required)
        '404':
          description: Channel not found
        '409':
          description: Duplicate active request without valid idempotency key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Queue or scheduling failure
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}:
    get:
      summary: Get regeneration job status
      security:
        - bearerAuth: []
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: jobId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Job status retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MetaTagJobStatus'
        '401':
          description: Unauthorized
        '403':
          description: Forbidden (admin role required)
        '404':
          description: Channel/job not found

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    MetaTagPreview:
      type: object
      properties:
        title:
          type: string
          description: Effective title served in HTML (generated <=60; custom override <=70)
          maxLength: 70
        description:
          type: string
          description: Effective description served in HTML (generated <=160; custom override <=200)
          maxLength: 200
        ogTitle:
          type: string
        ogDescription:
          type: string
        ogImage:
          type: string
          format: uri
        keywords:
          type: array
          items:
            type: string
        generatedAt:
          type: string
          format: date-time
        isCustom:
          type: boolean
        searchPreview:
          $ref: '#/components/schemas/SearchPreview'
        socialPreview:
          $ref: '#/components/schemas/SocialPreview'

    MetaTagOverride:
      type: object
      properties:
        customTitle:
          type: string
          maxLength: 70
        customDescription:
          type: string
          maxLength: 200
        customOgImage:
          type: string
          format: uri

    RegenerationJobAccepted:
      type: object
      properties:
        jobId:
          type: string
        status:
          type: string
          enum: [queued, deduplicated]
        idempotencyKey:
          type: string
          nullable: true
        pollUrl:
          type: string
          format: uri

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

    SearchPreview:
      type: object
      properties:
        title:
          type: string
        url:
          type: string
        description:
          type: string

    SocialPreview:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        image:
          type: string
```

### 10.3 Rationale
The LLM did a good job of generating the correct interface and APIs for the feature. It went into depth on how the API can be called and the different responses it needed to have. We only reprompted to ensure that this section was consistent with the classes made in previous sections.

---

## 11. Data Schemas

### 11.1 Database Tables

#### D6.1 ChannelsTable (Canonical Shared Schema)

**Runtime Class:** CL-E1 Channel

This feature consumes the canonical `channels` schema maintained by the channel visibility spec (`docs/dev-spec-channel-visibility-toggle.md`, Section 11.1 D7.1) to avoid drift.

| Column | Database Type | Constraints | Description |
|--------|---------------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique channel identifier |
| server_id | UUID | FOREIGN KEY → servers(id), NOT NULL, INDEX | Parent server reference |
| name | VARCHAR(100) | NOT NULL | Display name |
| slug | VARCHAR(100) | NOT NULL, UNIQUE per server | URL-safe identifier |
| visibility | visibility_enum | NOT NULL, DEFAULT 'PRIVATE' | Canonical visibility state |
| topic | TEXT | NULL | Channel topic/description |
| position | INTEGER | NOT NULL, DEFAULT 0 | Display order within server |
| indexed_at | TIMESTAMP WITH TIME ZONE | NULL | When channel was added to sitemap |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last modification timestamp |

**Visibility Enum:** `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`

**Canonical Index Set (shared):** `idx_channels_server_visibility`, `idx_channels_server_slug`, `idx_channels_visibility_indexed`, `idx_channels_visibility`

#### D6.2 MessagesTable and D6.4 ServersTable (Shared References)

Message and server schemas are shared with the guest public channel view spec and must remain source-aligned there to prevent cross-spec schema drift.

#### D6.3 GeneratedMetaTagsTable

**Runtime Class:** CL-E3 GeneratedMetaTags

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique record identifier | 16 bytes |
| channel_id | UUID | FOREIGN KEY, UNIQUE, INDEX | Associated channel | 16 bytes |
| title | VARCHAR(70) | NOT NULL | SEO title tag | 70 bytes |
| description | VARCHAR(200) | NOT NULL | Meta description | 200 bytes |
| og_title | VARCHAR(95) | NOT NULL | Open Graph title | 95 bytes |
| og_description | VARCHAR(300) | NOT NULL | Open Graph description | 300 bytes |
| og_image | VARCHAR(500) | NULL | Preview image URL | 500 bytes |
| twitter_card | VARCHAR(20) | NOT NULL, DEFAULT 'summary' | Twitter card type | 20 bytes |
| keywords | TEXT[] | NOT NULL, DEFAULT '{}' | Extracted keywords | ~200 bytes |
| structured_data | JSONB | NOT NULL | JSON-LD data | ~1000 bytes |
| custom_title | VARCHAR(70) | NULL | Admin override title | 70 bytes |
| custom_description | VARCHAR(200) | NULL | Admin override description | 200 bytes |
| custom_og_image | VARCHAR(500) | NULL | Admin override image | 500 bytes |
| content_hash | VARCHAR(64) | NOT NULL | SHA-256 of source content | 64 bytes |
| needs_regeneration | BOOLEAN | NOT NULL, DEFAULT false | Set when fallback generation is used and retry is required | 1 byte |
| generated_at | TIMESTAMP WITH TIME ZONE | NOT NULL | Last generation time | 8 bytes |
| version | INTEGER | NOT NULL, DEFAULT 1 | Generation version | 4 bytes |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation | 8 bytes |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update | 8 bytes |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_meta_tags_channel ON generated_meta_tags(channel_id);
CREATE INDEX idx_meta_tags_generated ON generated_meta_tags(generated_at);
```

**Length Normalization Policy:**
- Auto-generated `title` values are limited to 60 chars and auto-generated `description` values to 160 chars.
- Database/API allow up to 70/200 to support intentional admin overrides.
- Rendering must always use sanitized effective values and must not exceed schema max lengths.

**Content Hash Calculation:** `content_hash = SHA-256(join(last_100_non_deleted_message_contents, "\n"))`. Author IDs, timestamps, and attachment metadata are excluded so metadata-only updates do not force regeneration.

**Storage Estimate:** ~3.4 KB per channel

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
```typescript
{
  jobId: string,          // Queue job identifier
  channelId: string,      // UUID
  priority: 'high' | 'normal' | 'low',
  triggeredBy: 'message' | 'edit' | 'manual' | 'schedule' | 'visibility',
  idempotencyKey?: string,
  status: 'queued' | 'processing' | 'succeeded' | 'failed',
  attemptCount: number,
  lastError?: string
}
```
**Default Delay:** 60 seconds (debounce)
**Max Attempts:** 3
**Backoff:** Exponential (1min, 5min, 15min)
**Deduplication Window:** 60 seconds per `(channelId, idempotencyKey)`

### 11.4 Rationale
This section needed reprompting to ensure alignment across the data schemas in each spec. Besides that, these are valid schemas to use for our app and provides us a good way to store our data. The database tables will be stored in a PostgreSQL database adn the caching layer will be in a Redis service. This allows us to have quick access to recent meta tag generations and to easily serve the search engine.

---

## 12. Security and Privacy

### 12.1 Content Filtering for Meta Tags

| Filter Type | Implementation | Purpose |
|-------------|----------------|---------|
| PII Detection | Regex for emails, phones, names | Prevent personal info in search results |
| Profanity Filter | Word list + pattern matching | Prevent inappropriate previews |
| Private Mention Redaction | Remove @mentions of private users | Respect user privacy settings |
| URL Sanitization | Remove internal/private links | Prevent link leakage |
| HTML Entity Encoding | Encode special characters | Prevent XSS |

### 12.2 Data Flow Security

```
Message Content                 Content Analysis              Meta Tag Output
───────────────                 ────────────────              ───────────────
    │                                │                              │
    │                                │                              │
    ▼                                ▼                              ▼
┌─────────────┐              ┌─────────────────┐            ┌─────────────────┐
│ Raw content │─────────────►│ Sanitize input  │            │ HTML-encoded    │
│ from DB     │              │ - Remove HTML   │            │ output          │
│             │              │ - Normalize     │            │                 │
│             │              │   whitespace    │            │ Safe for        │
│             │              └────────┬────────┘            │ embedding in    │
│             │                       │                     │ <meta> tags     │
└─────────────┘                       ▼                     └─────────────────┘
                             ┌─────────────────┐
                             │ Filter PII      │
                             │ - Emails        │
                             │ - Phone numbers │
                             │ - @mentions     │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Filter profanity│
                             │ - Word list     │
                             │ - Replace with  │
                             │   asterisks     │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Generate tags   │
                             │ from clean      │
                             │ content         │
                             └─────────────────┘
```

### 12.3 Admin Override Security

- Only server admins can set custom meta tags
- Custom tags still undergo sanitization
- Audit log records all custom tag changes
- Rate limiting on regeneration requests

### 12.4 Search Engine Guidelines Compliance

| Guideline | Implementation |
|-----------|----------------|
| No keyword stuffing | Limit keywords to 5-10 relevant terms |
| Accurate descriptions | Summarize actual content, not clickbait |
| No cloaking | Same content for bots and users |
| Unique titles | Template ensures uniqueness per channel |
| Appropriate length | Auto-generated title <=60 and description <=160; effective tags may be up to 70/200 only when admin overrides are explicitly configured |

### 12.5 Rationale
Security is an absolute need for this kind of product and this flow provides for us a way to keep our users data secure while still allowing search engines to index our public servers. No changes were needed from the LLM's response.

---

## 13. Risks to Completion

### 13.1 Technology Risks

| Technology | Learning Curve | Design Difficulty | Implementation | Verification | Maintenance |
|------------|----------------|-------------------|----------------|--------------|-------------|
| T8: natural (NLP) | Medium | Medium | Medium | High | Medium |
| T9: compromise | Medium | Low | Low | Medium | Low |
| T7: BullMQ | Low | Low | Low | Low | Low |
| T10: schema-dts | Low | Medium | Low | Medium | Low |

### 13.2 Algorithm Risks

| Component | Risk | Mitigation |
|-----------|------|------------|
| Keyword Extraction | Low relevance keywords | Human review for top channels; feedback loop |
| Text Summarization | Awkward truncation | Sentence-boundary aware truncation |
| Topic Classification | Misclassification | Fallback to generic; expandable categories |
| Title Generation | Generic/duplicate titles | Template variants; uniqueness check |

### 13.3 Quality Assurance Challenges

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Subjective quality | Hard to automate testing | A/B testing; CTR monitoring |
| Language variations | Non-English content | Language detection; appropriate templates |
| Content diversity | Different channel types | Multiple generation strategies |
| Evolving SEO best practices | Outdated optimization | Regular review; configurable parameters |

### 13.4 Contingency Plans

| Risk | Trigger | Contingency |
|------|---------|-------------|
| NLP library issues | >5% error rate | Fallback to simple extraction |
| Queue overload | >1000 pending jobs | Batch processing; priority queue |
| Poor search rankings | CTR <1% | Manual review; algorithm tuning |
| Generation too slow | >5s per channel | Pre-generate on schedule |

### 13.5 Rollout and Feature Flag Plan

| Phase | Scope | Gate | Rollback Trigger |
|-------|-------|------|------------------|
| Phase 1: Shadow | Generate + store tags, do not serve | Manual QA on 100 sampled channels | Any PII/profanity leak |
| Phase 2: Limited Serve | Serve auto tags for 10% of public channels | CTR/search impressions no worse than control | >5% job failures or quality alerts |
| Phase 3: Full Serve | Serve for all eligible public channels | Stable metrics for 7 consecutive days | Any Critical alert from §7.6 |

**Feature Flags:**
- `FEATURE_SEO_META_TAGS`: master switch for serving generated tags.
- `FEATURE_SEO_META_TAGS_SHADOW_MODE`: generate-only mode with no serving impact.
- `FEATURE_SEO_DEINDEX_ON_PRIVATE`: enables automatic de-index workflow on privacy transitions.

**Rollback Procedure:** disable `FEATURE_SEO_META_TAGS` to immediately revert to fallback templates while jobs continue in shadow mode for diagnostics.

### 13.6 Rationale
This is a large application so these are some of the valid risks to complete this feature. The LLM is justified in all of these risks for maintain this platform for a long period of time. The only addition was adding a rollout plan so that we can test the meta tags and see how the system responds.

---

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

### 14.1 Rationale
This is something extra that the LLM added after a review of the spec. This will be helpful for the LLM to know that this feature is finished and fully working.

## Appendix A: Meta Tag Templates

### Title Templates

```
"{ChannelName} - {ServerName} | Harmony"

"{MessagePreview} - {ChannelName} | Harmony"

"{TopKeyword} Discussion - {ServerName}"
```

### Description Templates

```
"Join the discussion about {topics} in {ServerName}.
{SummarySentence} {MessageCount} messages from {AuthorCount} members."

"Community discussion channel for {topics}.
Part of the {ServerName} community on Harmony."
```

### Structured Data Template (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "DiscussionForumPosting",
  "headline": "{title}",
  "description": "{description}",
  "url": "{canonicalUrl}",
  "datePublished": "{firstMessageDate}",
  "dateModified": "{lastMessageDate}",
  "author": {
    "@type": "Organization",
    "name": "{serverName}"
  },
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": "{messageCount}"
  },
  "isPartOf": {
    "@type": "WebSite",
    "name": "Harmony",
    "url": "https://harmony.app"
  }
}
```

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| Meta Tags | HTML elements in <head> that provide metadata about the page |
| Open Graph | Protocol for social media link previews (og: tags) |
| Twitter Card | Twitter's format for rich link previews |
| JSON-LD | JavaScript Object Notation for Linked Data (structured data) |
| Rich Snippet | Enhanced search result with additional information |
| SERP | Search Engine Results Page |
| CTR | Click-Through Rate - percentage of impressions resulting in clicks |
| Canonical URL | The authoritative URL for a page |
| NLP | Natural Language Processing |
| Debounce | Technique to limit how often a function runs |
````

#### Tool: exec_command

```sh
rtk grep -n "AC-|Acceptance Criteria|meta-tags|regenerate|StructuredData|JSON-LD|sitemap|robots|PUBLIC_NO_INDEX|PUBLIC_INDEXABLE|PRIVATE" docs/dev-spec-seo-meta-tag-generation.md planning/SPRINT_4_PLAN.md
```

Output:

```text
🔍 106 in 2F:

📄 docs/dev-spec-seo-meta-tag-generation.md (96):
    71: │  │  │ getServerSideProps()        │───►│ renderStructuredData()          │ ...
   105: │  │  │ C2.5 StructuredDataGen      │    │ ─────────────────────────────── │ ...
   345: │ Generate JSON-LD│
   472: │ + robots: string        │     │ + ogType: string        │
   480: │ CL-D4 StructuredData    │     ├─────────────────────────┤...
   561: │ + renderStructuredData()     │
   630: | CL-C2.5 | StructuredDataGenerator | Service | Generates JSON-LD structured ...
   648: | CL-C4.3 | SitemapUpdater | Service | Updates sitemap lastmod and pings sear...
   665: | CL-D4 | StructuredData | DTO | JSON-LD structured data |
   792: │ JSON-LD in <script>           │
  +86

📄 planning/SPRINT_4_PLAN.md (10):
    58: - Background subscribers / cache invalidation / sitemap updates must run in a...
    63: - **SEO ownership:** the **Vercel frontend apex domain** is the canonical pub...
    64: - **Sitemap handoff:** the frontend apex domain serves crawler-facing sitemap...
   191: - Ensure duplicated subscribers / cache invalidation / sitemap upkeep do not ...
   218: - `robots.txt` on the frontend apex domain
   219: - sitemap support on the frontend apex domain
   222: - frontend apex domain owns the canonical public SEO artifacts: canonical URL...
   223: - frontend sitemap entrypoints are implemented through Next.js route handlers...
   224: - backend SEO routes may continue to generate sitemap/XML data as an internal...
   299: - sitemap/robots fetches

... +86
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T21:57:02.725Z

I’ve found one likely contradiction already: the plan says cloud validation stays read-only, but several acceptance criteria require mutations on the deployed stack. I’m checking the current frontend/backend structure as well so I can separate real spec drift from harmless wording.

#### Tool: exec_command

```sh
rtk grep -n "getServerSideProps|app/|pages/|route.ts|route.js|metadataBase|generateMetadata" harmony-frontend -g '!**/node_modules/**'
```

Output:

```text
🔍 26 in 22F:

📄 harmony-frontend/README.md (3):
    40: You can start editing the page by modifying `src/app/page.tsx`.
    56: │   ├── app/                    # Next.js App Router
    88: - **`app/`** - Next.js 14 App Router with pages, layouts, and routing

📄 harmony-frontend/.../__tests__/VisibilityToggle.test.tsx (1):
    19: jest.mock('../app/settings/[serverSlug]/[channelSlug]/updateVisibility', () =...

📄 harmony-frontend/.../__tests__/issue-242-join-server-fix.test.ts (2):
    50: jest.mock('@/app/actions/session', () => ({
    71: import { setSessionCookie } from '@/app/actions/session';

📄 harmony-frontend/.../[channelSlug]/page.tsx (1):
    10: export async function generateMetadata({ params }: PageProps): Promise<Metada...

📄 harmony-frontend/.../[channelSlug]/loading.tsx (1):
     6: export { default } from '@/app/c/[serverSlug]/[channelSlug]/loading';

📄 harmony-frontend/src/app/global-error.tsx (1):
     6: * thrown in the root layout (app/layout.tsx) and must render its own

📄 harmony-frontend/.../channel/CreateChannelModal.tsx (1):
    13: import { createChannelAction } from '@/app/actions/createChannel';

📄 harmony-frontend/.../channel/MessageInput.tsx (1):
    12: import { sendMessageAction } from '@/app/actions/sendMessage';

📄 harmony-frontend/.../channel/PinnedMessagesPanel.tsx (1):
    11: import { getPinnedMessagesAction } from '@/app/actions/getPinnedMessages';

📄 harmony-frontend/.../channel/VisibilityToggle.tsx (1):
    14: import { updateChannelVisibility } from '@/app/settings/[serverSlug]/[channel...

📄 harmony-frontend/.../message/MessageItem.tsx (1):
    17: import { pinMessageAction, unpinMessageAction } from '@/app/actions/pinMessage';

📄 harmony-frontend/.../server-rail/BrowseServersModal.tsx (1):
    17: import { joinServerAction } from '@/app/channels/actions';

📄 harmony-frontend/.../server-rail/CreateServerModal.tsx (1):
     5: import { createServerAction } from '@/app/channels/actions';

📄 harmony-frontend/.../settings/ChannelSettingsPage.tsx (1):
    13: import { saveChannelSettings, fetchAuditLog } from '@/app/settings/[serverSlu...

📄 harmony-frontend/.../settings/MembersSection.tsx (1):
    14: } from '@/app/settings/[serverSlug]/actions';

📄 harmony-frontend/.../settings/ServerSettingsPage.tsx (1):
    13: import { saveServerSettings, deleteServerAction } from '@/app/settings/[serve...

📄 harmony-frontend/.../settings/UserSettingsPage.tsx (1):
    16: import { isChannelGuestAccessible } from '@/app/settings/actions';

📄 harmony-frontend/.../settings/VisibilitySection.tsx (1):
     9: import { saveServerSettings } from '@/app/settings/[serverSlug]/actions';

📄 harmony-frontend/src/context/AuthContext.tsx (1):
     8: import { setSessionCookie, clearSessionCookie } from '@/app/actions/session';

📄 harmony-frontend/src/lib/api-client.ts (1):
     7: import { setSessionCookie } from '@/app/actions/session';

📄 harmony-frontend/src/services/publicApiService.ts (1):
     4: * Components, generateMetadata, and other server-only contexts.

📄 harmony-frontend/tailwind.config.ts (2):
     3: './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
     5: './src/app/**/*.{js,ts,jsx,tsx,mdx}',
```

#### Tool: exec_command

```sh
rtk grep -n "meta-tags/jobs|/api/admin/channels|/api/channels/.*/meta-tags|PUBLIC_NO_INDEX|VISIBILITY_CHANGED|needs_regeneration|Idempotency-Key|MetaTag" docs/dev-spec-seo-meta-tag-generation.md docs/dev-spec-channel-visibility-toggle.md
```

Output:

```text
🔍 153 in 2F:

📄 docs/dev-spec-channel-visibility-toggle.md (16):
   337: state "PUBLIC_NO_INDEX (indexedAt=null, robots=noindex)" as PUBLIC_NO_INDEX
   340: PRIVATE --> PUBLIC_NO_INDEX : setVisibility(PUBLIC_NO_INDEX)
   343: PUBLIC_NO_INDEX --> PRIVATE : setVisibility(PRIVATE)
   344: PUBLIC_NO_INDEX --> PUBLIC_INDEXABLE : setVisibility(PUBLIC_INDEXABLE) - add ...
   347: PUBLIC_INDEXABLE --> PUBLIC_NO_INDEX : setVisibility(PUBLIC_NO_INDEX) - remov...
   402: F115["F1.15 Emit VISIBILITY_CHANGED event"]
   426: 1. Emit `VISIBILITY_CHANGED` event via EventBus (Redis Pub/Sub)
   448: F212["F2.12 Set X-Robots-Tag header\nPUBLIC_INDEXABLE → index,follow\nPUBLIC_...
   489: 1. Emit `VISIBILITY_CHANGED` event via EventBus (Redis Pub/Sub)
   606: | `VISIBILITY_CHANGED` | Channel Visibility Toggle (this spec) | Emitted when...
  +6

📄 docs/dev-spec-seo-meta-tag-generation.md (137):
    66: │  │  │ serverSlug: string          │    │ meta: MetaTagSet                │ ...
    68: │  │  │ messages: Message[]         │    │ renderMetaTags()                │ ...
    69: │  │  │ metaTags: MetaTagSet        │    │ renderOpenGraph()               │ ...
    78: │  │  │ C2.1 MetaTagService         │    │ C2.2 TitleGenerator             │ ...
    87: │  │  │ generateMetaTags()          │◄───│ applyTemplate()                 │ ...
    91: │  │  │ getMetaTagsForPreview()     │                                        ...
   104: │  │  ┌─────────────────────────────┐    │ C2.6 MetaTagCache               │ ...
   141: │  │  │ C4.1 MetaTagUpdateWorker    │    │ C4.2 EventListener              │ ...
   172: │  │  │ C5.3 MetaTagRepository      │                                        ...
   202: │  │  │ D6.3 GeneratedMetaTagsTable │    │ D6.4 ServersTable               │ ...
  +127

... +133
```

#### Tool: exec_command

```sh
rtk grep -n "read-only|AC-1|AC-10|cloud-target|production dataset|mutate|staging" planning/FINAL_PROJECT_SPRINT_PLAN.md
```

Output:

```text
rg: planning/FINAL_PROJECT_SPRINT_PLAN.md: IO error for operation on planning/FINAL_PROJECT_SPRINT_PLAN.md: No such file or directory (os error 2)
🔍 0 for 'read-only|AC-1|AC-10|cloud-target|production dataset|mutate|staging'
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T21:57:16.031Z

I’ve confirmed the frontend is already on Next.js App Router with `generateMetadata`, so I’m fetching the exact file contents from the PR head branch to anchor the review to real line numbers rather than the raw patch.

#### Tool: mcp__codex_apps__github_fetch_file

```json
{
  "repository_full_name": "CS485-Harmony/Harmony",
  "path": "planning/FINAL_PROJECT_SPRINT_PLAN.md",
  "ref": "sprint-5-final-project-plan"
}
```

Output:

````text
[{"type":"text","text":"{\"content\": \"# Final Project Sprint Plan \\u2014 April 10 \\u2013 May 3, 2026\\n\\n## Context\\nThis plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:\\n\\n- **Sprint 4 \\u2014 Deployment (April 10\\u201319):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here \\u2014 this doc references it and tracks it as a milestone.\\n- **Sprint 5 \\u2014 SEO Feature Completion, Polish, and Final Submission (April 20 \\u2013 May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.\\n\\nHarmony's headline feature is SEO-indexable public channels, so the project cannot be considered \\\"done\\\" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in \\u00a714 of the dev spec) are satisfied against the live production deployment.\\n\\n## Team\\n5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI\\n\\n---\\n\\n## Sprint 4 \\u2014 Deployment (April 10\\u201319)\\n\\nSprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.\\n\\n### Sprint 4 exit criteria (must be true before Sprint 5 starts)\\n- Public Vercel frontend URL live on the apex domain\\n- Public Railway backend URL live on `api.<frontend-domain>`\\n- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton\\n- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production\\n- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations\\n- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green\\n- Branch protection on `main` with required checks\\n- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current\\n- README updated for user-facing and deployer-facing instructions\\n- P6 submission package assembled (links, logs, reflection, LLM logs)\\n\\n### Sprint 4 key dates\\n| Date | Milestone |\\n|------|-----------|\\n| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |\\n| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |\\n| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |\\n| Apr 16 (Thu) | Branch protection enabled (#13) |\\n| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |\\n| Apr 19 (Sun) | P6 submission package complete (#15) |\\n\\n---\\n\\n## Sprint 5 \\u2014 SEO Feature Completion, Polish, and Final Submission (April 20 \\u2013 May 3)\\n\\n### Goal\\nShip the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec \\u00a714 acceptance criteria, and deliver the final project submission package by Sunday, May 3.\\n\\n### Scope anchor\\nDev spec: `docs/dev-spec-seo-meta-tag-generation.md`\\n- Modules M1\\u2013M5 (page rendering, meta tag generation, content analysis, background processing, caching)\\n- Classes C1.1\\u2013C6.x per \\u00a73 / \\u00a74\\n- APIs / public interfaces per \\u00a79 / \\u00a710\\n- Acceptance criteria AC-1 through AC-10 per \\u00a714\\n\\n### Sprint 5 guardrails\\n- All work on feature branches with PR review (branch protection is live from Sprint 4)\\n- Every PR must pass `run-integration-tests` + unit workflows before merge\\n- No backend code that re-introduces process-local singletons on `backend-api` replicas \\u2014 new SEO subscribers/workers land on `backend-worker` only\\n- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory\\n- All destructive schema changes follow the expand/contract convention established in Sprint 4\\n\\n---\\n\\n### Phase A \\u2014 SEO backend core (April 20\\u201323)\\n\\n**S1. Meta tag generation service skeleton (M2)**\\n- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGen`, and `MetaTagCache` per dev spec \\u00a73/\\u00a74\\n- Wire Redis-backed `MetaTagCache` with configurable TTL\\n- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)\\n- Assignee: **declanblanc**\\n- Backup: **acabrera04**\\n- Due: Apr 22\\n- Blocked by: Sprint 4 exit criteria\\n\\n**S2. Content analysis module (M3)**\\n- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`\\n- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout\\n- Unit tests covering keyword extraction, summarization, and fallback paths\\n- Assignee: **Aiden-Barrera**\\n- Backup: **declanblanc**\\n- Due: Apr 22\\n- Blocked by: none (parallel with S1)\\n\\n**S3. Data schema + persistence for meta tag overrides (\\u00a711)**\\n- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec \\u00a711\\n- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas\\n- Custom overrides must never be overwritten by background regeneration (AC-7)\\n- Assignee: **FardeenI**\\n- Backup: **AvanishKulkarni**\\n- Due: Apr 22\\n- Blocked by: Sprint 4 migration-runner ownership\\n\\n**S4. REST + tRPC endpoints (\\u00a79, \\u00a710)**\\n- `GET /api/channels/:id/meta-tags`\\n- `PUT /api/channels/:id/meta-tags` with override validation (customTitle \\u226470, customDescription \\u2264200 \\u2014 AC-3)\\n- `POST /api/channels/:id/meta-tags/regenerate` returning `jobId` with idempotency key (AC-5, AC-6)\\n- `GET /api/channels/:id/meta-tags/regenerate/:jobId` status polling\\n- API integration tests for each endpoint\\n- Assignee: **FardeenI**\\n- Due: Apr 23\\n- Blocked by: S1, S3\\n\\n---\\n\\n### Phase B \\u2014 Background processing + visibility lifecycle (April 22\\u201325)\\n\\n**S5. Background meta tag update worker (M4) on `backend-worker`**\\n- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration\\n- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus\\n- Worker must run as singleton only (enforced by Sprint 4 topology)\\n- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline\\n- Assignee: **Aiden-Barrera**\\n- Backup: **declanblanc**\\n- Due: Apr 24\\n- Blocked by: S1, S2\\n\\n**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**\\n- On `VISIBILITY_CHANGED \\u2192 PRIVATE`: invalidate `MetaTagCache`, remove sitemap URL, flip `noindex`\\n- On `VISIBILITY_CHANGED \\u2192 PUBLIC_INDEXABLE`: re-enqueue regeneration\\n- Integration tests covering both directions and cache/sitemap side effects\\n- Assignee: **declanblanc**\\n- Due: Apr 25\\n- Blocked by: S5\\n\\n**S7. Security + content filtering (\\u00a712, AC-8)**\\n- PII and profanity filters on generated titles/descriptions\\n- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`\\n- Unit tests with fixture content covering PII/profanity/XSS\\n- Assignee: **AvanishKulkarni**\\n- Backup: **Aiden-Barrera**\\n- Due: Apr 25\\n- Blocked by: S1\\n\\n---\\n\\n### Phase C \\u2014 Frontend rendering + SEO surface (April 23\\u201327)\\n\\n**S8. `HeadComponent` + `PublicChannelPage` integration (M1)**\\n- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`\\n- Use `getServerSideProps` / Next.js route handlers to fetch meta tags from backend at request time\\n- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision \\u2014 no crawler-facing artifact may point at the API subdomain\\n- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name=\\\"description\\\">` (AC-1)\\n- Assignee: **declanblanc**\\n- Due: Apr 26\\n- Blocked by: S4, Sprint 4 #6 (frontend prod config)\\n\\n**S9. Sitemap + robots.txt finalization**\\n- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain\\n- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility\\n- Smoke test that private channels do not appear in sitemap\\n- Assignee: **AvanishKulkarni**\\n- Backup: **FardeenI**\\n- Due: Apr 27\\n- Blocked by: S6, S8\\n\\n**S10. Meta tag admin UI (creator override flow)**\\n- UI under channel settings for creator to view generated tags, override title/description, and trigger manual regeneration with job status polling\\n- Respect `customTitle`/`customDescription` length limits with client-side validation\\n- Assignee: **acabrera04**\\n- Backup: **declanblanc**\\n- Due: Apr 27\\n- Blocked by: S4\\n\\n---\\n\\n### Phase D \\u2014 End-to-end verification on production (April 27\\u201330)\\n\\n**S11. Integration tests for SEO feature (local + cloud)**\\n- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10\\n- Cloud-mode coverage stays read-only (reuse Sprint 4 isolation rules) \\u2014 no mutation of the instructor-reviewed production dataset\\n- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)\\n- Assignee: **Aiden-Barrera**\\n- Due: Apr 29\\n- Blocked by: S8, S9, S10\\n\\n**S12. Production validation + evidence capture**\\n- Run cloud-target SEO integration suite against the deployed Vercel + Railway stack\\n- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, `noindex`/sitemap removal works on visibility flip\\n- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch\\n- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission\\n- Assignee: **declanblanc**\\n- Backup: **Aiden-Barrera**\\n- Due: Apr 30\\n- Blocked by: S11\\n\\n**S13. Bug bash + polish**\\n- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime\\n- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`\\n- Fix must-fix items only; document the rest in the reflection\\n- Assignee: **whole team**, coordinator: **FardeenI**\\n- Due: May 1\\n- Blocked by: S12\\n\\n---\\n\\n### Phase E \\u2014 Final submission package (May 1\\u20133)\\n\\n**S14. README + deployer guide final pass**\\n- Fold SEO feature usage, override flow, and regeneration behavior into README\\n- Update deployer guide with any new env vars introduced in Phase A\\u2013C (NLP keys, R2 bucket for OG images if any, etc.)\\n- Assignee: **acabrera04**\\n- Due: May 2\\n- Blocked by: S10\\n\\n**S15. Final project submission package**\\n- Compile final deliverable checklist:\\n  - Public frontend URL + public backend URL (from Sprint 4)\\n  - Links to every dev spec document under `docs/`\\n  - Links to SEO feature PRs and commits\\n  - Integration test specs + code + local/cloud run output\\n  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)\\n  - Branch protection screenshot\\n  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)\\n  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)\\n  - LLM interaction logs under `llm-logs/` with model/version labels\\n- Assignee: **acabrera04**\\n- Backup: **FardeenI**\\n- Due: May 3\\n- Blocked by: S12, S13, S14\\n\\n**S16. Final reflection + retrospective**\\n- Team retrospective on the full project (Sprints 1\\u20135)\\n- Each developer contributes a short written reflection to the submission doc\\n- Assignee: **whole team**, coordinator: **declanblanc**\\n- Due: May 3\\n- Blocked by: S15 draft\\n\\n---\\n\\n## Sprint 5 assignment summary\\n\\n| Developer | Issues | Focus |\\n|-----------|--------|-------|\\n| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |\\n| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |\\n| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |\\n| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |\\n| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |\\n\\n## Sprint 5 critical path\\n\\n```text\\nS1 Meta tag service  \\u2500\\u2510\\nS2 Content analysis  \\u2500\\u253c\\u2500\\u25ba S4 APIs \\u2500\\u25ba S8 Frontend \\u2500\\u2510\\nS3 Schema/migration  \\u2500\\u2518                           \\u2502\\n                                                  \\u251c\\u2500\\u25ba S11 SEO tests \\u2500\\u25ba S12 Prod validation \\u2500\\u25ba S13 Bug bash \\u2500\\u25ba S15 Submission\\nS5 Worker (needs S1, S2) \\u2500\\u25ba S6 Visibility \\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2518\\nS7 Security (needs S1) \\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u25ba\\nS9 Sitemap (needs S6, S8) \\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u25ba\\nS10 Override UI (needs S4) \\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u25ba\\n                                                   S14 README (needs S10) \\u2500\\u25ba S15\\n                                                   S16 Retrospective (parallel)\\n```\\n\\n## Sprint 5 timeline\\n\\n| Date | Milestone |\\n|------|-----------|\\n| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |\\n| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |\\n| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |\\n| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |\\n| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |\\n| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |\\n| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |\\n| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |\\n| May 1 (Fri) | S13 bug bash complete; must-fix items merged |\\n| May 2 (Sat) | S14 README final pass merged |\\n| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |\\n\\n## Sprint 5 deliverables checklist\\n\\nThe project is not complete until all of the following exist:\\n\\n- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack\\n- SEO meta tag generation service, content analysis, background worker, overrides API, and frontend SSR integration merged to `main`\\n- Creator override UI shipped\\n- Sitemap and robots.txt correctly respect channel visibility\\n- Cloud + local integration tests covering SEO paths passing in CI\\n- Production validation evidence: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation\\n- README updated for SEO feature and any new env vars\\n- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection\\n- LLM interaction logs archived under `llm-logs/`\\n- Team retrospective recorded\\n\\n## Notes\\n\\n- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).\\n- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec \\u00a714 fallback (AC-9) and document the degradation.\\n- Cloud-mode tests remain read-only throughout Sprint 5 to protect the instructor-reviewed deployment.\\n- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.\\n\", \"encoding\": \"utf-8\", \"sha\": \"cb05d1c5764cbccb57a5ddc2bc154a9d5be812c6\", \"display_url\": \"https://github.com/CS485-Harmony/Harmony/blob/sprint-5-final-project-plan/planning/FINAL_PROJECT_SPRINT_PLAN.md\", \"display_title\": \"FINAL_PROJECT_SPRINT_PLAN.md\"}"}]
````

#### Tool: exec_command

```sh
nl -ba harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx | sed -n '1,220p'
```

Output:

```text
zsh:1: no matches found: harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx
```

#### Tool: exec_command

```sh
nl -ba docs/dev-spec-seo-meta-tag-generation.md | sed -n '2540,2660p'
```

Output:

````text
  2540	  description: string;
  2541	  ogTitle: string;
  2542	  ogDescription: string;
  2543	  ogImage: string;
  2544	  keywords: string[];
  2545	  structuredData: JSON;
  2546	  generatedAt: DateTime;
  2547	  contentHash: string;
  2548	  version: number;
  2549	}
  2550	```
  2551	
  2552	### 9.7 Rationale
  2553	This gives us good APIs to utilize in our implementation. Everything is kept seperate and is modularized which makes for good development practice. We did need to reprompt to ensure that all classes and methods mentioned previoiusly in section 3 were present in this section and vice versa. 
  2554	
  2555	---
  2556	
  2557	## 10. Public Interfaces
  2558	
  2559	### 10.1 Cross-Module Interface Usage
  2560	
  2561	#### Used by Page Rendering (M1) from Meta Tag Generation (M2):
  2562	
  2563	| Method | Class | Used For |
  2564	|--------|-------|----------|
  2565	| getOrGenerateCached() | MetaTagService | SSR meta tag injection |
  2566	| generateMetaTags() | MetaTagService | Force regeneration |
  2567	
  2568	#### Used by Meta Tag Generation (M2) from Content Analysis (M3):
  2569	
  2570	| Method | Class | Used For |
  2571	|--------|-------|----------|
  2572	| analyzeThread() | ContentAnalyzer | Content understanding |
  2573	| getTopicCategory() | ContentAnalyzer | Topic categorization |
  2574	| getSentiment() | ContentAnalyzer | Sentiment analysis |
  2575	| getReadingLevel() | ContentAnalyzer | Reading level assessment |
  2576	| extractKeywords() | KeywordExtractor | Keyword meta tag |
  2577	| extractPhrases() | KeywordExtractor | Multi-word keyword extraction |
  2578	| scoreByFrequency() | KeywordExtractor | Keyword relevance scoring |
  2579	| summarize() | TextSummarizer | Description generation |
  2580	| extractFirstSentence() | TextSummarizer | Fallback description extraction |
  2581	| extractKeySentences() | TextSummarizer | Key sentence extraction |
  2582	| classify() | TopicClassifier | Topic classification |
  2583	| getTop() | TopicClassifier | Top category selection |
  2584	| getKeywords() | TopicClassifier | Topic-related keyword extraction |
  2585	
  2586	#### Used by Meta Tag Generation (M2) from Data Access (M5):
  2587	
  2588	| Method | Class | Used For |
  2589	|--------|-------|----------|
  2590	| findById() | ChannelRepository | Resolve channel for admin and regeneration paths |
  2591	| findBySlug() | ChannelRepository | Resolve canonical route channel for SSR generation |
  2592	| findPublicByServerId() | ChannelRepository | Enumerate public channels for sitemap/meta refresh sweeps |
  2593	| getVisibility() | ChannelRepository | Visibility gating for serving/de-index decisions |
  2594	| getMetadata() | ChannelRepository | Channel/server metadata for title/description templates |
  2595	| findByChannelId() | MetaTagRepository | Retrieve existing tags |
  2596	| upsert() | MetaTagRepository | Persist new tags |
  2597	| getLastGenerated() | MetaTagRepository | Check tag freshness |
  2598	| findRecentByChannel() | MessageRepository | Get content for analysis |
  2599	| findFirstMessage() | MessageRepository | Get first message for fallback description |
  2600	| getMessageCount() | MessageRepository | Get message count for structured data |
  2601	
  2602	#### Used by Background Processing (M4) from Meta Tag Generation (M2):
  2603	
  2604	| Method | Class | Used For |
  2605	|--------|-------|----------|
  2606	| generateMetaTags() | MetaTagService | Background regeneration |
  2607	| invalidateCache() | MetaTagService | Cache management |
  2608	| scheduleRegeneration() | MetaTagService | Queue background meta tag updates |
  2609	
  2610	**Cross-Reference:** The guest public channel view feature's `SEOService` is an adapter that delegates generation to `MetaTagService.getOrGenerateCached()` from this spec.
  2611	
  2612	#### Cross-Spec Visibility Event Contract (`VISIBILITY_CHANGED`)
  2613	
  2614	| New Visibility | Expected Payload Fields | SEO Action |
  2615	|----------------|-------------------------|------------|
  2616	| `PUBLIC_INDEXABLE` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration, refresh tags, keep canonical URL indexable |
  2617	| `PUBLIC_NO_INDEX` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration with `noindex` directives while keeping page publicly accessible |
  2618	| `PRIVATE` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Invalidate cache, remove/purge URL, request de-index/removal |
  2619	
  2620	### 10.2 Admin API Interface
  2621	
  2622	```yaml
  2623	openapi: 3.0.3
  2624	info:
  2625	  title: Harmony Meta Tag Management API
  2626	  version: 1.0.0
  2627	
  2628	paths:
  2629	  /api/admin/channels/{channelId}/meta-tags:
  2630	    get:
  2631	      summary: Get current meta tags for channel
  2632	      security:
  2633	        - bearerAuth: []
  2634	      parameters:
  2635	        - name: channelId
  2636	          in: path
  2637	          required: true
  2638	          schema:
  2639	            type: string
  2640	            format: uuid
  2641	      responses:
  2642	        '200':
  2643	          description: Meta tags retrieved
  2644	          content:
  2645	            application/json:
  2646	              schema:
  2647	                $ref: '#/components/schemas/MetaTagPreview'
  2648	        '401':
  2649	          description: Unauthorized
  2650	          content:
  2651	            application/json:
  2652	              schema:
  2653	                $ref: '#/components/schemas/ErrorResponse'
  2654	        '403':
  2655	          description: Forbidden (admin role required)
  2656	          content:
  2657	            application/json:
  2658	              schema:
  2659	                $ref: '#/components/schemas/ErrorResponse'
  2660	        '404':
````

#### Tool: exec_command

```sh
nl -ba docs/dev-spec-channel-visibility-toggle.md | sed -n '330,360p;440,455p;600,615p'
```

Output:

````text
   330	### 5.2 Channel Visibility State Machine
   331	
   332	```mermaid
   333	stateDiagram-v2
   334	    [*] --> PRIVATE : Channel created (default)
   335	
   336	    state "PRIVATE (indexedAt=null, robots=noindex nofollow)" as PRIVATE
   337	    state "PUBLIC_NO_INDEX (indexedAt=null, robots=noindex)" as PUBLIC_NO_INDEX
   338	    state "PUBLIC_INDEXABLE (indexedAt=now, robots=index follow)" as PUBLIC_INDEXABLE
   339	
   340	    PRIVATE --> PUBLIC_NO_INDEX : setVisibility(PUBLIC_NO_INDEX)
   341	    PRIVATE --> PUBLIC_INDEXABLE : setVisibility(PUBLIC_INDEXABLE) - add to sitemap, notify search engines
   342	
   343	    PUBLIC_NO_INDEX --> PRIVATE : setVisibility(PRIVATE)
   344	    PUBLIC_NO_INDEX --> PUBLIC_INDEXABLE : setVisibility(PUBLIC_INDEXABLE) - add to sitemap, notify search engines
   345	
   346	    PUBLIC_INDEXABLE --> PRIVATE : setVisibility(PRIVATE) - remove from sitemap, request de-index
   347	    PUBLIC_INDEXABLE --> PUBLIC_NO_INDEX : setVisibility(PUBLIC_NO_INDEX) - remove from sitemap, set noindex
   348	```
   349	
   350	### 5.3 Admin Action State Diagram
   351	
   352	```mermaid
   353	stateDiagram-v2
   354	    [*] --> A1 : Admin views channel
   355	
   356	    A1 : A1: Settings Page Loaded\nisLoading=false
   357	    A2 : A2: Confirmation Dialog\npendingVisibility=new
   358	    A3 : A3: Updating\nisLoading=true
   359	    A4 : A4: Error State\nerrorMessage=msg
   360	    A5 : A5: Success State\nvisibility=updated
   440	    F24["F2.4 Query DB"]
   441	    F26["F2.6 Cache result"]
   442	    F25["F2.5 Use cached value"]
   443	    ChExists{Channel exists?}
   444	    Return404["Return 404"]
   445	    IsPublic{"Is PUBLIC_*?"}
   446	    Return403["Return 403"]
   447	    F211["F2.11 Fetch messages"]
   448	    F212["F2.12 Set X-Robots-Tag header\nPUBLIC_INDEXABLE → index,follow\nPUBLIC_NO_INDEX → noindex"]
   449	    F213["F2.13 Add canonical URL + structured data"]
   450	    F214["F2.14 Return HTML with SEO metadata"]
   451	    End(["END: Response sent"])
   452	
   453	    Start --> F21 --> F22 --> CacheHit
   454	    CacheHit -->|No| F24 --> F26 --> ChExists
   455	    CacheHit -->|Yes| F25 --> ChExists
   600	**Technology:** Redis Pub/Sub (T6)
   601	
   602	Event types consumed/produced across specs:
   603	
   604	| Event | Source Spec | Description |
   605	|-------|-------------|-------------|
   606	| `VISIBILITY_CHANGED` | Channel Visibility Toggle (this spec) | Emitted when channel visibility state changes |
   607	| `MESSAGE_CREATED` | SEO Meta Tag Generation | New message in a public channel |
   608	| `MESSAGE_EDITED` | SEO Meta Tag Generation | Message edited in a public channel |
   609	| `MESSAGE_DELETED` | SEO Meta Tag Generation | Message deleted from a public channel |
   610	| `META_TAGS_UPDATED` | SEO Meta Tag Generation | Meta tags regenerated for a channel |
   611	
   612	### 8.2 Rationale
   613	
   614	Significant reprompting was necessary here because of conflicting tech stacks across each spec. This spec was missing DOMPurify, which would be needed to sanitize and generate sitemaps with other public content. The communication APIs being a mix of RPC and REST was also detected by the LLM here, requiring prompting to fix it. The LLM then determined to use RPC for authenticated internal APIs, while public endpoints would be REST for compatibility with web indexers.
   615
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T21:58:44.915Z

The main gaps are now narrowed to three areas: API path drift from the spec, a missing `PUBLIC_NO_INDEX` transition in the visibility workflow, and a likely impossible validation plan for production-only acceptance checks. I’m pulling the exact supporting lines for each before I write the bundled review.

#### Tool: exec_command

```sh
rg --files harmony-frontend/src/app | rg '/\[serverSlug\]/\[channelSlug\]/page\.tsx$'
```

Output:

```text
harmony-frontend/src/app/channels/[serverSlug]/[channelSlug]/page.tsx
harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx
harmony-frontend/src/app/settings/[serverSlug]/[channelSlug]/page.tsx
```

#### Tool: exec_command

```sh
nl -ba docs/dev-spec-seo-meta-tag-generation.md | sed -n '2628,2755p'
```

Output:

```text
  2628	paths:
  2629	  /api/admin/channels/{channelId}/meta-tags:
  2630	    get:
  2631	      summary: Get current meta tags for channel
  2632	      security:
  2633	        - bearerAuth: []
  2634	      parameters:
  2635	        - name: channelId
  2636	          in: path
  2637	          required: true
  2638	          schema:
  2639	            type: string
  2640	            format: uuid
  2641	      responses:
  2642	        '200':
  2643	          description: Meta tags retrieved
  2644	          content:
  2645	            application/json:
  2646	              schema:
  2647	                $ref: '#/components/schemas/MetaTagPreview'
  2648	        '401':
  2649	          description: Unauthorized
  2650	          content:
  2651	            application/json:
  2652	              schema:
  2653	                $ref: '#/components/schemas/ErrorResponse'
  2654	        '403':
  2655	          description: Forbidden (admin role required)
  2656	          content:
  2657	            application/json:
  2658	              schema:
  2659	                $ref: '#/components/schemas/ErrorResponse'
  2660	        '404':
  2661	          description: Channel not found
  2662	          content:
  2663	            application/json:
  2664	              schema:
  2665	                $ref: '#/components/schemas/ErrorResponse'
  2666	
  2667	    put:
  2668	      summary: Update meta tags (custom override)
  2669	      security:
  2670	        - bearerAuth: []
  2671	      requestBody:
  2672	        content:
  2673	          application/json:
  2674	            schema:
  2675	              $ref: '#/components/schemas/MetaTagOverride'
  2676	      responses:
  2677	        '200':
  2678	          description: Meta tags updated
  2679	        '401':
  2680	          description: Unauthorized
  2681	        '403':
  2682	          description: Forbidden (admin role required)
  2683	        '404':
  2684	          description: Channel not found
  2685	        '422':
  2686	          description: Validation error (length, format, sanitization)
  2687	          content:
  2688	            application/json:
  2689	              schema:
  2690	                $ref: '#/components/schemas/ErrorResponse'
  2691	
  2692	    post:
  2693	      summary: Regenerate meta tags asynchronously
  2694	      security:
  2695	        - bearerAuth: []
  2696	      parameters:
  2697	        - name: Idempotency-Key
  2698	          in: header
  2699	          required: false
  2700	          schema:
  2701	            type: string
  2702	          description: Optional dedupe key for safe retries
  2703	      responses:
  2704	        '202':
  2705	          description: Regeneration scheduled (or deduplicated)
  2706	          content:
  2707	            application/json:
  2708	              schema:
  2709	                $ref: '#/components/schemas/RegenerationJobAccepted'
  2710	        '401':
  2711	          description: Unauthorized
  2712	        '403':
  2713	          description: Forbidden (admin role required)
  2714	        '404':
  2715	          description: Channel not found
  2716	        '409':
  2717	          description: Duplicate active request without valid idempotency key
  2718	          content:
  2719	            application/json:
  2720	              schema:
  2721	                $ref: '#/components/schemas/ErrorResponse'
  2722	        '500':
  2723	          description: Queue or scheduling failure
  2724	          content:
  2725	            application/json:
  2726	              schema:
  2727	                $ref: '#/components/schemas/ErrorResponse'
  2728	
  2729	  /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}:
  2730	    get:
  2731	      summary: Get regeneration job status
  2732	      security:
  2733	        - bearerAuth: []
  2734	      parameters:
  2735	        - name: channelId
  2736	          in: path
  2737	          required: true
  2738	          schema:
  2739	            type: string
  2740	            format: uuid
  2741	        - name: jobId
  2742	          in: path
  2743	          required: true
  2744	          schema:
  2745	            type: string
  2746	      responses:
  2747	        '200':
  2748	          description: Job status retrieved
  2749	          content:
  2750	            application/json:
  2751	              schema:
  2752	                $ref: '#/components/schemas/MetaTagJobStatus'
  2753	        '401':
  2754	          description: Unauthorized
  2755	        '403':
```

#### Tool: exec_command

```sh
node - <<'NODE'
const fs=require('fs');
const text=JSON.parse(fs.readFileSync('/tmp/final_project_plan_fetch.json','utf8')).content;
const lines=text.split('\n');
for (const [i,l] of lines.entries()) {
  if (/S4\. REST \+ tRPC endpoints|GET \/api\/channels|S6\. Visibility transition|PUBLIC_INDEXABLE|Cloud-mode coverage stays read-only|Run cloud-target SEO integration suite|AC-1 through AC-10 verified|getServerSideProps/.test(l)) console.log(String(i+1).padStart(4), l);
}
NODE
```

Output:

```text
  94 **S4. REST + tRPC endpoints (§9, §10)**
  95 - `GET /api/channels/:id/meta-tags`
  98 - `GET /api/channels/:id/meta-tags/regenerate/:jobId` status polling
 118 **S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**
 120 - On `VISIBILITY_CHANGED → PUBLIC_INDEXABLE`: re-enqueue regeneration
 141 - Use `getServerSideProps` / Next.js route handlers to fetch meta tags from backend at request time
 171 - Cloud-mode coverage stays read-only (reuse Sprint 4 isolation rules) — no mutation of the instructor-reviewed production dataset
 178 - Run cloud-target SEO integration suite against the deployed Vercel + Railway stack
 276 - All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack
```

#### Tool: exec_command

````sh
cat > /tmp/final_project_plan_fetch.json <<'EOF'
{"content":"# Final Project Sprint Plan — April 10 – May 3, 2026\n\n## Context\nThis plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:\n\n- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.\n- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.\n\nHarmony's headline feature is SEO-indexable public channels, so the project cannot be considered \"done\" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.\n\n## Team\n5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI\n\n---\n\n## Sprint 4 — Deployment (April 10–19)\n\nSprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.\n\n### Sprint 4 exit criteria (must be true before Sprint 5 starts)\n- Public Vercel frontend URL live on the apex domain\n- Public Railway backend URL live on `api.<frontend-domain>`\n- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton\n- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production\n- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations\n- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green\n- Branch protection on `main` with required checks\n- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current\n- README updated for user-facing and deployer-facing instructions\n- P6 submission package assembled (links, logs, reflection, LLM logs)\n\n### Sprint 4 key dates\n| Date | Milestone |\n|------|-----------|\n| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |\n| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |\n| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |\n| Apr 16 (Thu) | Branch protection enabled (#13) |\n| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |\n| Apr 19 (Sun) | P6 submission package complete (#15) |\n\n---\n\n## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)\n\n### Goal\nShip the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.\n\n### Scope anchor\nDev spec: `docs/dev-spec-seo-meta-tag-generation.md`\n- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)\n- Classes C1.1–C6.x per §3 / §4\n- APIs / public interfaces per §9 / §10\n- Acceptance criteria AC-1 through AC-10 per §14\n\n### Sprint 5 guardrails\n- All work on feature branches with PR review (branch protection is live from Sprint 4)\n- Every PR must pass `run-integration-tests` + unit workflows before merge\n- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only\n- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory\n- All destructive schema changes follow the expand/contract convention established in Sprint 4\n\n---\n\n### Phase A — SEO backend core (April 20–23)\n\n**S1. Meta tag generation service skeleton (M2)**\n- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGen`, and `MetaTagCache` per dev spec §3/§4\n- Wire Redis-backed `MetaTagCache` with configurable TTL\n- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)\n- Assignee: **declanblanc**\n- Backup: **acabrera04**\n- Due: Apr 22\n- Blocked by: Sprint 4 exit criteria\n\n**S2. Content analysis module (M3)**\n- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`\n- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout\n- Unit tests covering keyword extraction, summarization, and fallback paths\n- Assignee: **Aiden-Barrera**\n- Backup: **declanblanc**\n- Due: Apr 22\n- Blocked by: none (parallel with S1)\n\n**S3. Data schema + persistence for meta tag overrides (§11)**\n- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11\n- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas\n- Custom overrides must never be overwritten by background regeneration (AC-7)\n- Assignee: **FardeenI**\n- Backup: **AvanishKulkarni**\n- Due: Apr 22\n- Blocked by: Sprint 4 migration-runner ownership\n\n**S4. REST + tRPC endpoints (§9, §10)**\n- `GET /api/channels/:id/meta-tags`\n- `PUT /api/channels/:id/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)\n- `POST /api/channels/:id/meta-tags/regenerate` returning `jobId` with idempotency key (AC-5, AC-6)\n- `GET /api/channels/:id/meta-tags/regenerate/:jobId` status polling\n- API integration tests for each endpoint\n- Assignee: **FardeenI**\n- Due: Apr 23\n- Blocked by: S1, S3\n\n---\n\n### Phase B — Background processing + visibility lifecycle (April 22–25)\n\n**S5. Background meta tag update worker (M4) on `backend-worker`**\n- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration\n- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus\n- Worker must run as singleton only (enforced by Sprint 4 topology)\n- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline\n- Assignee: **Aiden-Barrera**\n- Backup: **declanblanc**\n- Due: Apr 24\n- Blocked by: S1, S2\n\n**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**\n- On `VISIBILITY_CHANGED → PRIVATE`: invalidate `MetaTagCache`, remove sitemap URL, flip `noindex`\n- On `VISIBILITY_CHANGED → PUBLIC_INDEXABLE`: re-enqueue regeneration\n- Integration tests covering both directions and cache/sitemap side effects\n- Assignee: **declanblanc**\n- Due: Apr 25\n- Blocked by: S5\n\n**S7. Security + content filtering (§12, AC-8)**\n- PII and profanity filters on generated titles/descriptions\n- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`\n- Unit tests with fixture content covering PII/profanity/XSS\n- Assignee: **AvanishKulkarni**\n- Backup: **Aiden-Barrera**\n- Due: Apr 25\n- Blocked by: S1\n\n---\n\n### Phase C — Frontend rendering + SEO surface (April 23–27)\n\n**S8. `HeadComponent` + `PublicChannelPage` integration (M1)**\n- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`\n- Use `getServerSideProps` / Next.js route handlers to fetch meta tags from backend at request time\n- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain\n- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name=\"description\">` (AC-1)\n- Assignee: **declanblanc**\n- Due: Apr 26\n- Blocked by: S4, Sprint 4 #6 (frontend prod config)\n\n**S9. Sitemap + robots.txt finalization**\n- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain\n- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility\n- Smoke test that private channels do not appear in sitemap\n- Assignee: **AvanishKulkarni**\n- Backup: **FardeenI**\n- Due: Apr 27\n- Blocked by: S6, S8\n\n**S10. Meta tag admin UI (creator override flow)**\n- UI under channel settings for creator to view generated tags, override title/description, and trigger manual regeneration with job status polling\n- Respect `customTitle`/`customDescription` length limits with client-side validation\n- Assignee: **acabrera04**\n- Backup: **declanblanc**\n- Due: Apr 27\n- Blocked by: S4\n\n---\n\n### Phase D — End-to-end verification on production (April 27–30)\n\n**S11. Integration tests for SEO feature (local + cloud)**\n- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10\n- Cloud-mode coverage stays read-only (reuse Sprint 4 isolation rules) — no mutation of the instructor-reviewed production dataset\n- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)\n- Assignee: **Aiden-Barrera**\n- Due: Apr 29\n- Blocked by: S8, S9, S10\n\n**S12. Production validation + evidence capture**\n- Run cloud-target SEO integration suite against the deployed Vercel + Railway stack\n- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, `noindex`/sitemap removal works on visibility flip\n- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch\n- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission\n- Assignee: **declanblanc**\n- Backup: **Aiden-Barrera**\n- Due: Apr 30\n- Blocked by: S11\n\n**S13. Bug bash + polish**\n- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime\n- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`\n- Fix must-fix items only; document the rest in the reflection\n- Assignee: **whole team**, coordinator: **FardeenI**\n- Due: May 1\n- Blocked by: S12\n\n---\n\n### Phase E — Final submission package (May 1–3)\n\n**S14. README + deployer guide final pass**\n- Fold SEO feature usage, override flow, and regeneration behavior into README\n- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)\n- Assignee: **acabrera04**\n- Due: May 2\n- Blocked by: S10\n\n**S15. Final project submission package**\n- Compile final deliverable checklist:\n  - Public frontend URL + public backend URL (from Sprint 4)\n  - Links to every dev spec document under `docs/`\n  - Links to SEO feature PRs and commits\n  - Integration test specs + code + local/cloud run output\n  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)\n  - Branch protection screenshot\n  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)\n  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)\n  - LLM interaction logs under `llm-logs/` with model/version labels\n- Assignee: **acabrera04**\n- Backup: **FardeenI**\n- Due: May 3\n- Blocked by: S12, S13, S14\n\n**S16. Final reflection + retrospective**\n- Team retrospective on the full project (Sprints 1–5)\n- Each developer contributes a short written reflection to the submission doc\n- Assignee: **whole team**, coordinator: **declanblanc**\n- Due: May 3\n- Blocked by: S15 draft\n\n---\n\n## Sprint 5 assignment summary\n\n| Developer | Issues | Focus |\n|-----------|--------|-------|\n| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |\n| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |\n| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |\n| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |\n| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |\n\n## Sprint 5 critical path\n\n```text\nS1 Meta tag service  ─┐\nS2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐\nS3 Schema/migration  ─┘                           │\n                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission\nS5 Worker (needs S1, S2) ─► S6 Visibility ────────┘\nS7 Security (needs S1) ──────────────────────────►\nS9 Sitemap (needs S6, S8) ───────────────────────►\nS10 Override UI (needs S4) ──────────────────────►\n                                                   S14 README (needs S10) ─► S15\n                                                   S16 Retrospective (parallel)\n```\n\n## Sprint 5 timeline\n\n| Date | Milestone |\n|------|-----------|\n| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |\n| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |\n| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |\n| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |\n| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |\n| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |\n| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |\n| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |\n| May 1 (Fri) | S13 bug bash complete; must-fix items merged |\n| May 2 (Sat) | S14 README final pass merged |\n| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |\n\n## Sprint 5 deliverables checklist\n\nThe project is not complete until all of the following exist:\n\n- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack\n- SEO meta tag generation service, content analysis, background worker, overrides API, and frontend SSR integration merged to `main`\n- Creator override UI shipped\n- Sitemap and robots.txt correctly respect channel visibility\n- Cloud + local integration tests covering SEO paths passing in CI\n- Production validation evidence: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation\n- README updated for SEO feature and any new env vars\n- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection\n- LLM interaction logs archived under `llm-logs/`\n- Team retrospective recorded\n\n## Notes\n\n- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).\n- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.\n- Cloud-mode tests remain read-only throughout Sprint 5 to protect the instructor-reviewed deployment.\n- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.\n"}
EOF
````

Output:

```text

```

#### Tool: exec_command

```sh
nl -ba 'harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx' | sed -n '1,140p'
```

Output:

```text
     1	import type { Metadata } from 'next';
     2	import { GuestChannelView } from '@/components/channel/GuestChannelView';
     3	import { fetchPublicServer, fetchPublicChannel } from '@/services/publicApiService';
     4	import { ChannelVisibility } from '@/types';
     5	
     6	interface PageProps {
     7	  params: Promise<{ serverSlug: string; channelSlug: string }>;
     8	}
     9	
    10	export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    11	  const { serverSlug, channelSlug } = await params;
    12	  const [server, channelResult] = await Promise.all([
    13	    fetchPublicServer(serverSlug),
    14	    fetchPublicChannel(serverSlug, channelSlug),
    15	  ]);
    16	
    17	  const channel = channelResult && !channelResult.isPrivate ? channelResult.channel : null;
    18	  const channelName = channel?.name ?? channelSlug;
    19	  const serverName = server?.name ?? serverSlug;
    20	  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;
    21	  const description = channel?.topic ?? server?.description ?? `Join ${serverName} on Harmony`;
    22	  const title = `${channelName} - ${serverName} | Harmony`;
    23	  const canonicalUrl = `/c/${serverSlug}/${channelSlug}`;
    24	
    25	  return {
    26	    title,
    27	    description,
    28	    robots: { index: isIndexable, follow: true },
    29	    alternates: { canonical: canonicalUrl },
    30	    openGraph: {
    31	      title,
    32	      description,
    33	      type: 'website',
    34	      url: canonicalUrl,
    35	    },
    36	  };
    37	}
    38	
    39	export default async function GuestChannelPage({ params }: PageProps) {
    40	  const { serverSlug, channelSlug } = await params;
    41	  return <GuestChannelView serverSlug={serverSlug} channelSlug={channelSlug} />;
    42	}
```

#### Tool: exec_command

```sh
nl -ba 'harmony-frontend/src/app/channels/[serverSlug]/[channelSlug]/page.tsx' | sed -n '1,140p'
```

Output:

```text
     1	import { ChannelPageContent } from '@/components/channel/ChannelPageContent';
     2	
     3	interface PageProps {
     4	  params: Promise<{ serverSlug: string; channelSlug: string }>;
     5	}
     6	
     7	export default async function AuthenticatedChannelPage({ params }: PageProps) {
     8	  const { serverSlug, channelSlug } = await params;
     9	  return <ChannelPageContent serverSlug={serverSlug} channelSlug={channelSlug} />;
    10	}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T21:59:03.934Z

I have enough to write the review, but I’m fetching the PR branch into `FETCH_HEAD` first so the final findings can point at exact local file paths and line numbers instead of quoting from GitHub’s JSON.

#### Tool: exec_command

```sh
rtk git fetch https://github.com/CS485-Harmony/Harmony.git sprint-5-final-project-plan
```

Output:

```text
ok fetched (1 new refs)
```

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '88,105p;116,124p;138,145p;168,180p;272,279p'
```

Output:

```text
    88	  - `ContentAnalyzer.analyzeThread()` returns keywords, summary, and topic category for a fixture thread
    89	  - Deterministic fallback returns a valid (non-null) result within the configured timeout budget when the NLP path is stubbed to fail
    90	  - Unit tests cover stop-word filtering, frequency scoring, summarization, topic classification, and timeout/fallback paths
    91	- Assignee: **Aiden-Barrera**
    92	- Backup: **declanblanc**
    93	- Due: Apr 22
    94	- Blocked by: none (parallel with S1)
    95	
    96	**S3. Data schema + persistence for meta tag overrides (§11)**
    97	- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11
    98	- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas
    99	- Custom overrides must never be overwritten by background regeneration (AC-7)
   100	- Acceptance criteria:
   101	  - Prisma migration adds all fields in dev spec §11 and applies cleanly via the single Sprint 4 migration runner
   102	  - Migration is expand-only (no destructive drops) so it coexists with old `backend-api` replicas during rolling restart
   103	  - Persistence layer enforces that a background regeneration write cannot overwrite a non-null `customTitle` or `customDescription` (AC-7), verified by an integration test
   104	  - Schema is documented in `docs/deployment/deployment-architecture.md` or the SEO dev spec appendix
   105	- Assignee: **FardeenI**
   116	- Acceptance criteria:
   117	  - All four endpoints are reachable and documented in dev spec §9/§10 terms
   118	  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)
   119	  - `POST .../regenerate` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)
   120	  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)
   121	  - All endpoints enforce channel-creator authorization; non-owners get 403
   122	  - Supertest integration tests cover success, validation failure, auth failure, and idempotency
   123	- Assignee: **FardeenI**
   124	- Due: Apr 23
   138	  - Worker consumes `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events and schedules regeneration jobs
   139	  - Debounce/batch window collapses repeated events for the same channel into a single regeneration job within the configured window
   140	  - Worker restart does not duplicate in-flight jobs (job queue dedupes by channel + idempotency key)
   141	  - Integration test simulates burst traffic and asserts a single regeneration job is produced per debounce window
   142	- Assignee: **Aiden-Barrera**
   143	- Backup: **declanblanc**
   144	- Due: Apr 24
   145	- Blocked by: S1, S2
   168	  - Filter behavior is covered by unit tests and documented in `docs/dev-spec-seo-meta-tag-generation.md` §12 cross-reference
   169	- Assignee: **AvanishKulkarni**
   170	- Backup: **Aiden-Barrera**
   171	- Due: Apr 25
   172	- Blocked by: S1
   173	
   174	---
   175	
   176	### Phase C — Frontend rendering + SEO surface (April 23–27)
   177	
   178	**S8. `HeadComponent` + `PublicChannelPage` integration (M1)**
   179	- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`
   180	- Use `getServerSideProps` / Next.js route handlers to fetch meta tags from backend at request time
   272	### Phase E — Final submission package (May 1–3)
   273	
   274	**S14. README + deployer guide final pass**
   275	- Fold SEO feature usage, override flow, and regeneration behavior into README
   276	- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)
   277	- Acceptance criteria:
   278	  - README documents: how to view generated SEO tags, how a creator overrides them, and how regeneration is triggered
   279	  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value
```

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:llm-logs/2026-04-09-184230-session-c9f15ca0.md | nl -ba | sed -n '1,40p'
```

Output:

```text
     1	# Session Log 2026-04-09-184230
     2
```

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '106,132p;146,166p;178,196p;228,245p;308,320p'
```

Output:

```text
   106	- Backup: **AvanishKulkarni**
   107	- Due: Apr 22
   108	- Blocked by: Sprint 4 migration-runner ownership
   109	
   110	**S4. REST + tRPC endpoints (§9, §10)**
   111	- `GET /api/channels/:id/meta-tags`
   112	- `PUT /api/channels/:id/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)
   113	- `POST /api/channels/:id/meta-tags/regenerate` returning `jobId` with idempotency key (AC-5, AC-6)
   114	- `GET /api/channels/:id/meta-tags/regenerate/:jobId` status polling
   115	- API integration tests for each endpoint
   116	- Acceptance criteria:
   117	  - All four endpoints are reachable and documented in dev spec §9/§10 terms
   118	  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)
   119	  - `POST .../regenerate` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)
   120	  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)
   121	  - All endpoints enforce channel-creator authorization; non-owners get 403
   122	  - Supertest integration tests cover success, validation failure, auth failure, and idempotency
   123	- Assignee: **FardeenI**
   124	- Due: Apr 23
   125	- Blocked by: S1, S3
   126	
   127	---
   128	
   129	### Phase B — Background processing + visibility lifecycle (April 22–25)
   130	
   131	**S5. Background meta tag update worker (M4) on `backend-worker`**
   132	- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration
   146	
   147	**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**
   148	- On `VISIBILITY_CHANGED → PRIVATE`: invalidate `MetaTagCache`, remove sitemap URL, flip `noindex`
   149	- On `VISIBILITY_CHANGED → PUBLIC_INDEXABLE`: re-enqueue regeneration
   150	- Integration tests covering both directions and cache/sitemap side effects
   151	- Acceptance criteria:
   152	  - Flipping a channel from `PUBLIC_INDEXABLE` to `PRIVATE` invalidates the `MetaTagCache` entry and removes the URL from the sitemap within one regeneration cycle (AC-4, AC-10)
   153	  - Subsequent SSR requests for that channel return `noindex` meta and 404/403 public body as appropriate
   154	  - Flipping back to `PUBLIC_INDEXABLE` re-enqueues a regeneration job and the channel reappears in the sitemap
   155	  - End-to-end integration test covers `PUBLIC_INDEXABLE → PRIVATE → PUBLIC_INDEXABLE` transition and asserts cache + sitemap state at each step
   156	- Assignee: **declanblanc**
   157	- Due: Apr 25
   158	- Blocked by: S5
   159	
   160	**S7. Security + content filtering (§12, AC-8)**
   161	- PII and profanity filters on generated titles/descriptions
   162	- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`
   163	- Unit tests with fixture content covering PII/profanity/XSS
   164	- Acceptance criteria:
   165	  - Generated tags for the PII/profanity fixture corpus contain no flagged content (AC-8)
   166	  - HTML/attribute injection attempts in `customTitle`/`customDescription` are escaped or rejected on write and on render
   178	**S8. `HeadComponent` + `PublicChannelPage` integration (M1)**
   179	- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`
   180	- Use `getServerSideProps` / Next.js route handlers to fetch meta tags from backend at request time
   181	- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain
   182	- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name="description">` (AC-1)
   183	- Acceptance criteria:
   184	  - Every public channel page SSR-renders non-empty `<title>` and `<meta name="description">` for the fixture corpus (AC-1)
   185	  - Open Graph, Twitter card, and JSON-LD `DiscussionForumPosting` tags are present and validate against Google Rich Results test
   186	  - Canonical URL is the frontend apex domain; no `<link rel="canonical">` or sitemap URL points at the API subdomain
   187	  - Meta tag fetch uses the backend API at request time and degrades to template fallback if the backend is unreachable
   188	  - E2E test (Playwright or crawler UA fetch) asserts tags on at least 3 representative public channels
   189	- Assignee: **declanblanc**
   190	- Due: Apr 26
   191	- Blocked by: S4, Sprint 4 #6 (frontend prod config)
   192	
   193	**S9. Sitemap + robots.txt finalization**
   194	- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain
   195	- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility
   196	- Smoke test that private channels do not appear in sitemap
   228	- Cloud-mode coverage stays read-only (reuse Sprint 4 isolation rules) — no mutation of the instructor-reviewed production dataset
   229	- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)
   230	- Acceptance criteria:
   231	  - Test cases exist and are traceable one-to-one to AC-1 through AC-10 in dev spec §14
   232	  - Suite runs in `local` mode via `run-integration-tests.yml` and passes on PR
   233	  - Suite runs in `cloud` mode against deployed URLs and is read-only (no writes to production dataset)
   234	  - Crawler-UA fetches (`User-Agent: Googlebot`) of at least 3 public channels return non-empty `<title>`/`<meta name="description">` and valid JSON-LD
   235	  - Test output is captured as an artifact for submission evidence
   236	- Assignee: **Aiden-Barrera**
   237	- Due: Apr 29
   238	- Blocked by: S8, S9, S10
   239	
   240	**S12. Production validation + evidence capture**
   241	- Run cloud-target SEO integration suite against the deployed Vercel + Railway stack
   242	- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, `noindex`/sitemap removal works on visibility flip
   243	- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch
   244	- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission
   245	- Acceptance criteria:
   308	**S16. Final reflection + retrospective**
   309	- Team retrospective on the full project (Sprints 1–5)
   310	- Each developer contributes a short written reflection to the submission doc
   311	- Acceptance criteria:
   312	  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)
   313	  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change
   314	  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off
   315	  - Known limitations from S13 are captured in the reflection with mitigation notes
   316	- Assignee: **whole team**, coordinator: **declanblanc**
   317	- Due: May 3
   318	- Blocked by: S15 draft
   319	
   320	---
```

#### Tool: exec_command

```sh
nl -ba 'harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx' | sed -n '1,40p'
```

Output:

```text
     1	import type { Metadata } from 'next';
     2	import { GuestChannelView } from '@/components/channel/GuestChannelView';
     3	import { fetchPublicServer, fetchPublicChannel } from '@/services/publicApiService';
     4	import { ChannelVisibility } from '@/types';
     5	
     6	interface PageProps {
     7	  params: Promise<{ serverSlug: string; channelSlug: string }>;
     8	}
     9	
    10	export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    11	  const { serverSlug, channelSlug } = await params;
    12	  const [server, channelResult] = await Promise.all([
    13	    fetchPublicServer(serverSlug),
    14	    fetchPublicChannel(serverSlug, channelSlug),
    15	  ]);
    16	
    17	  const channel = channelResult && !channelResult.isPrivate ? channelResult.channel : null;
    18	  const channelName = channel?.name ?? channelSlug;
    19	  const serverName = server?.name ?? serverSlug;
    20	  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;
    21	  const description = channel?.topic ?? server?.description ?? `Join ${serverName} on Harmony`;
    22	  const title = `${channelName} - ${serverName} | Harmony`;
    23	  const canonicalUrl = `/c/${serverSlug}/${channelSlug}`;
    24	
    25	  return {
    26	    title,
    27	    description,
    28	    robots: { index: isIndexable, follow: true },
    29	    alternates: { canonical: canonicalUrl },
    30	    openGraph: {
    31	      title,
    32	      description,
    33	      type: 'website',
    34	      url: canonicalUrl,
    35	    },
    36	  };
    37	}
    38	
    39	export default async function GuestChannelPage({ params }: PageProps) {
    40	  const { serverSlug, channelSlug } = await params;
```

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '240,290p'
```

Output:

```text
   240	**S12. Production validation + evidence capture**
   241	- Run cloud-target SEO integration suite against the deployed Vercel + Railway stack
   242	- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, `noindex`/sitemap removal works on visibility flip
   243	- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch
   244	- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission
   245	- Acceptance criteria:
   246	  - Cloud integration suite passes against the deployed Vercel + Railway stack
   247	  - Evidence bundle exists under `docs/submission/seo-evidence/` containing: crawler-view HTML, Rich Results test screenshots, replica-identity headers from at least two distinct `backend-api` replicas, and a cache-hit log sample
   248	  - Visibility flip scenario (`PUBLIC_INDEXABLE → PRIVATE`) is verified live and captured as evidence (AC-4, AC-10)
   249	  - Tag output is identical across both API replicas for the same channel within one cache TTL
   250	  - Every AC-1..AC-10 item has at least one linked piece of evidence in the bundle
   251	- Assignee: **declanblanc**
   252	- Backup: **Aiden-Barrera**
   253	- Due: Apr 30
   254	- Blocked by: S11
   255	
   256	**S13. Bug bash + polish**
   257	- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime
   258	- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`
   259	- Fix must-fix items only; document the rest in the reflection
   260	- Acceptance criteria:
   261	  - Each developer logs at least one bug-bash session against the deployed stack and files GitHub issues for findings
   262	  - Every finding is triaged with a label (`must-fix-for-submission` or `known-limitation`)
   263	  - All `must-fix-for-submission` issues are merged to `main` and redeployed before S15 starts
   264	  - `known-limitation` issues are summarized in the reflection document
   265	  - Post-bash smoke run of the cloud integration suite is green
   266	- Assignee: **whole team**, coordinator: **FardeenI**
   267	- Due: May 1
   268	- Blocked by: S12
   269	
   270	---
   271	
   272	### Phase E — Final submission package (May 1–3)
   273	
   274	**S14. README + deployer guide final pass**
   275	- Fold SEO feature usage, override flow, and regeneration behavior into README
   276	- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)
   277	- Acceptance criteria:
   278	  - README documents: how to view generated SEO tags, how a creator overrides them, and how regeneration is triggered
   279	  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value
   280	  - README links to the deployed frontend URL, backend URL, and submission evidence bundle
   281	  - A fresh contributor can follow README instructions to run the app locally and see SEO tags on a public channel
   282	- Assignee: **acabrera04**
   283	- Due: May 2
   284	- Blocked by: S10
   285	
   286	**S15. Final project submission package**
   287	- Compile final deliverable checklist:
   288	  - Public frontend URL + public backend URL (from Sprint 4)
   289	  - Links to every dev spec document under `docs/`
   290	  - Links to SEO feature PRs and commits
```

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '286,340p'
```

Output:

````text
   286	**S15. Final project submission package**
   287	- Compile final deliverable checklist:
   288	  - Public frontend URL + public backend URL (from Sprint 4)
   289	  - Links to every dev spec document under `docs/`
   290	  - Links to SEO feature PRs and commits
   291	  - Integration test specs + code + local/cloud run output
   292	  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)
   293	  - Branch protection screenshot
   294	  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)
   295	  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)
   296	  - LLM interaction logs under `llm-logs/` with model/version labels
   297	- Acceptance criteria:
   298	  - Every checklist item above has a resolved link or committed artifact (no TBDs)
   299	  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README
   300	  - All AC-1..AC-10 items map to evidence produced in S12
   301	  - Each developer is named against at least one deliverable in the contributions section
   302	  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD
   303	- Assignee: **acabrera04**
   304	- Backup: **FardeenI**
   305	- Due: May 3
   306	- Blocked by: S12, S13, S14
   307	
   308	**S16. Final reflection + retrospective**
   309	- Team retrospective on the full project (Sprints 1–5)
   310	- Each developer contributes a short written reflection to the submission doc
   311	- Acceptance criteria:
   312	  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)
   313	  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change
   314	  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off
   315	  - Known limitations from S13 are captured in the reflection with mitigation notes
   316	- Assignee: **whole team**, coordinator: **declanblanc**
   317	- Due: May 3
   318	- Blocked by: S15 draft
   319	
   320	---
   321	
   322	## Sprint 5 assignment summary
   323	
   324	| Developer | Issues | Focus |
   325	|-----------|--------|-------|
   326	| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |
   327	| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |
   328	| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |
   329	| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |
   330	| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |
   331	
   332	## Sprint 5 critical path
   333	
   334	```text
   335	S1 Meta tag service  ─┐
   336	S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐
   337	S3 Schema/migration  ─┘                           │
   338	                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission
   339	S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘
   340	S7 Security (needs S1) ──────────────────────────►
````

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '350,390p'
```

Output:

```text
   350	|------|-----------|
   351	| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |
   352	| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |
   353	| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |
   354	| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |
   355	| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |
   356	| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |
   357	| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |
   358	| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |
   359	| May 1 (Fri) | S13 bug bash complete; must-fix items merged |
   360	| May 2 (Sat) | S14 README final pass merged |
   361	| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |
   362	
   363	## Sprint 5 deliverables checklist
   364	
   365	The project is not complete until all of the following exist:
   366	
   367	- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack
   368	- SEO meta tag generation service, content analysis, background worker, overrides API, and frontend SSR integration merged to `main`
   369	- Creator override UI shipped
   370	- Sitemap and robots.txt correctly respect channel visibility
   371	- Cloud + local integration tests covering SEO paths passing in CI
   372	- Production validation evidence: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation
   373	- README updated for SEO feature and any new env vars
   374	- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection
   375	- LLM interaction logs archived under `llm-logs/`
   376	- Team retrospective recorded
   377	
   378	## Notes
   379	
   380	- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).
   381	- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.
   382	- Cloud-mode tests remain read-only throughout Sprint 5 to protect the instructor-reviewed deployment.
   383	- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.
```

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '193,214p'
```

Output:

```text
   193	**S9. Sitemap + robots.txt finalization**
   194	- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain
   195	- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility
   196	- Smoke test that private channels do not appear in sitemap
   197	- Acceptance criteria:
   198	  - `https://<frontend-apex>/sitemap.xml` and `https://<frontend-apex>/robots.txt` resolve on the frontend apex domain (not the API subdomain)
   199	  - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `PRIVATE` channels are excluded
   200	  - Channels flipped to `PRIVATE` disappear from sitemap on the next regeneration cycle
   201	  - `robots.txt` allows crawling of public paths and disallows non-public areas
   202	  - Smoke test asserts sitemap exclusion behavior for a fixture private channel
   203	- Assignee: **AvanishKulkarni**
   204	- Backup: **FardeenI**
   205	- Due: Apr 27
   206	- Blocked by: S6, S8
   207	
   208	**S10. Meta tag admin UI (creator override flow)**
   209	- UI under channel settings for creator to view generated tags, override title/description, and trigger manual regeneration with job status polling
   210	- Respect `customTitle`/`customDescription` length limits with client-side validation
   211	- Acceptance criteria:
   212	  - Channel settings page exposes a "SEO Preview" section showing current generated + override values
   213	  - Creator can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules
   214	  - Creator can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:07:33.954Z

There’s a second spec drift in the auth model: the plan turns meta-tag overrides into a channel-creator feature, while the spec defines these endpoints as admin-only. I’m pulling the exact lines so that one is anchored as cleanly as the API-path issue.

#### Tool: exec_command

```sh
nl -ba docs/dev-spec-seo-meta-tag-generation.md | sed -n '2745,2775p;3055,3085p'
```

Output:

````text
  2745	            type: string
  2746	      responses:
  2747	        '200':
  2748	          description: Job status retrieved
  2749	          content:
  2750	            application/json:
  2751	              schema:
  2752	                $ref: '#/components/schemas/MetaTagJobStatus'
  2753	        '401':
  2754	          description: Unauthorized
  2755	        '403':
  2756	          description: Forbidden (admin role required)
  2757	        '404':
  2758	          description: Channel/job not found
  2759	
  2760	components:
  2761	  securitySchemes:
  2762	    bearerAuth:
  2763	      type: http
  2764	      scheme: bearer
  2765	      bearerFormat: JWT
  2766	
  2767	  schemas:
  2768	    MetaTagPreview:
  2769	      type: object
  2770	      properties:
  2771	        title:
  2772	          type: string
  2773	          description: Effective title served in HTML (generated <=60; custom override <=70)
  2774	          maxLength: 70
  2775	        description:
  3055	                             │ content         │
  3056	                             └─────────────────┘
  3057	```
  3058	
  3059	### 12.3 Admin Override Security
  3060	
  3061	- Only server admins can set custom meta tags
  3062	- Custom tags still undergo sanitization
  3063	- Audit log records all custom tag changes
  3064	- Rate limiting on regeneration requests
  3065	
  3066	### 12.4 Search Engine Guidelines Compliance
  3067	
  3068	| Guideline | Implementation |
  3069	|-----------|----------------|
  3070	| No keyword stuffing | Limit keywords to 5-10 relevant terms |
  3071	| Accurate descriptions | Summarize actual content, not clickbait |
  3072	| No cloaking | Same content for bots and users |
  3073	| Unique titles | Template ensures uniqueness per channel |
  3074	| Appropriate length | Auto-generated title <=60 and description <=160; effective tags may be up to 70/200 only when admin overrides are explicitly configured |
  3075	
  3076	### 12.5 Rationale
  3077	Security is an absolute need for this kind of product and this flow provides for us a way to keep our users data secure while still allowing search engines to index our public servers. No changes were needed from the LLM's response.
  3078	
  3079	---
  3080	
  3081	## 13. Risks to Completion
  3082	
  3083	### 13.1 Technology Risks
  3084	
  3085	| Technology | Learning Curve | Design Difficulty | Implementation | Verification | Maintenance |
````

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '208,220p;286,302p'
```

Output:

```text
   208	**S10. Meta tag admin UI (creator override flow)**
   209	- UI under channel settings for creator to view generated tags, override title/description, and trigger manual regeneration with job status polling
   210	- Respect `customTitle`/`customDescription` length limits with client-side validation
   211	- Acceptance criteria:
   212	  - Channel settings page exposes a "SEO Preview" section showing current generated + override values
   213	  - Creator can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules
   214	  - Creator can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`
   215	  - Non-creators do not see the override UI (or see it disabled)
   216	  - Frontend unit tests cover validation, submit, and job polling flows
   217	- Assignee: **acabrera04**
   218	- Backup: **declanblanc**
   219	- Due: Apr 27
   220	- Blocked by: S4
   286	**S15. Final project submission package**
   287	- Compile final deliverable checklist:
   288	  - Public frontend URL + public backend URL (from Sprint 4)
   289	  - Links to every dev spec document under `docs/`
   290	  - Links to SEO feature PRs and commits
   291	  - Integration test specs + code + local/cloud run output
   292	  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)
   293	  - Branch protection screenshot
   294	  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)
   295	  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)
   296	  - LLM interaction logs under `llm-logs/` with model/version labels
   297	- Acceptance criteria:
   298	  - Every checklist item above has a resolved link or committed artifact (no TBDs)
   299	  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README
   300	  - All AC-1..AC-10 items map to evidence produced in S12
   301	  - Each developer is named against at least one deliverable in the contributions section
   302	  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:08:50.259Z

I’m making one temporary detached worktree from `FETCH_HEAD` so the review can cite the PR file as a real local path. It won’t touch your current branch or the dirty files in the main checkout.

#### Tool: exec_command

```sh
rtk git worktree add --detach /tmp/harmony-pr315 FETCH_HEAD
```

Output:

```text
ok ✓
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:09:19.931Z

**Checklist**
- [ ] `Prioritize Logic over Style`: The PR introduces substantive planning defects, not style issues: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.
- [ ] `Security First`: The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the spec.
- [ ] `Architectural Alignment`: Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.
- [ ] `Issue Completion`: The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.
- [x] `No Nitpicking`: Feedback is limited to correctness, security, and spec alignment.
- [x] `Avoid Repetition`: I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.
- [x] `Iterative Reviews`: This is my first pass on the PR, so there were no earlier comments from me to re-check.
- [x] `Prevent CI Failures`: This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.

**Bundled Review**
1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Those criteria depend on state changes, so this needs either a staging dataset/environment or an explicit allowance for controlled reversible mutations during validation.
2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.
3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.

Residual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using [`generateMetadata`]( /Users/allen/repos/Harmony/harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx#L10 ). I would at least update that wording so the plan does not steer implementation toward the wrong Next.js API.

Inspection only; no tests were run because this was a documentation review.

### Turn 2: post it when you're

#### 👤 User Prompt

- Time: 2026-04-10T22:09:20.057Z

```text
post it when you're done
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:09:37.911Z

I’ve got three blocking findings. I’m posting them now as a single PR review with the required checklist and line-referenced notes.

#### Tool: mcp__codex_apps__github_add_review_to_pr

```json
{
  "action": "REQUEST_CHANGES",
  "commit_id": "f2a88098851f02772e8ed36746641c958e3cfbbd",
  "file_comments": [],
  "pr_number": 315,
  "repo_full_name": "CS485-Harmony/Harmony",
  "review": "- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.\n- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.\n- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.\n- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.\n- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.\n- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.\n- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.\n- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.\n\n1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.\n\n2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.\n\n3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.\n\nResidual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API."
}
```

Output:

```text
[{"type":"text","text":"Error code: FORBIDDENError: GitHub API error 403: {\"message\":\"Resource not accessible by integration\",\"documentation_url\":\"https://docs.github.com/rest/pulls/reviews#create-a-review-for-a-pull-request\",\"status\":\"403\"}"}]
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:09:56.482Z

The GitHub connector doesn’t have permission to submit reviews on this repo. I’m falling back to the local `gh` CLI and will post the same review from there if auth is available.

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
git branch --show-current
```

Output:

```text
codex/sprint-4-deployment-plan
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:10:00.502Z

`gh` is authenticated with repo-scoped access, so I can post the review directly from the terminal.

#### Tool: exec_command

```sh
cat > /tmp/pr315-review.md <<'EOF'
- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.
- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.
- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.
- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.
- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.
- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.
- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.
- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.

1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.

2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.

3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.

Residual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.
EOF

gh pr review 315 --repo CS485-Harmony/Harmony --request-changes --body-file /tmp/pr315-review.md
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:10:18.636Z

Posted as a `REQUEST_CHANGES` review on PR `#315`.

The GitHub app connector was blocked with `403 Resource not accessible by integration`, so I submitted the same review via `gh` using the local authenticated account instead.

### Turn 3: # Review findings: ## Finding 1

#### 👤 User Prompt

- Time: 2026-04-10T22:11:01.842Z

```text
# Review findings:

## Finding 1 (/tmp/harmony-pr315/planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155) [added]
[P2] PUBLIC_NO_INDEX transition is missing from S6

S6 only plans `PRIVATE` and `PUBLIC_INDEXABLE` transitions, but both the SEO spec and the channel-visibility spec require `PUBLIC_NO_INDEX` as a first-class visibility state with its own `VISIBILITY_CHANGED` handling. As written, the plan has no task or test guaranteeing that `PUBLIC_INDEXABLE -> PUBLIC_NO_INDEX` removes the sitemap entry while keeping the page public with `noindex` behavior.

## My request for Codex:
how to fix the github app connector since this was a new repo transferred to an org
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:11:09.908Z

I’m checking what the GitHub connector can currently see for this org/repo so I can tell you whether this is an installation issue, a permission issue, or just stale repo setup after the transfer.

#### Tool: mcp__codex_apps__github_list_installations

```json
{}
```

Output:

```text
{"installations":[{"id":119468366,"account_login":"acabrera04","account_id":145043651,"account_type":"User","account_avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","html_url":"https://github.com/settings/installations/119468366","events":["check_run","check_suite","commit_comment","issues","issue_comment","pull_request","pull_request_review","pull_request_review_comment","pull_request_review_thread","repository","status","sub_issues"]}]}
```

#### Tool: mcp__codex_apps__github_list_installed_accounts

```json
{}
```

Output:

```text
{"accounts":[{"login":"acabrera04","is_user_account":true,"is_organization_account":false}]}
```

#### Tool: mcp__codex_apps__github_search_installed_repositories_v2

```json
{
  "query": "Harmony",
  "limit": 20,
  "include_search_index_status": true
}
```

Output:

```text
{"repositories":[]}
```

#### Tool: mcp__codex_apps__github_get_user_login

```json
{}
```

Output:

```text
{"login":"acabrera04","id":145043651}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:11:17.443Z

The connector only has a GitHub App installation on your personal account `acabrera04`; it has no organization installation for `CS485-Harmony`. That matches the `403 Resource not accessible by integration` on PR review. I’m checking whether your account is in the org so I can give the shortest recovery path.

#### Tool: mcp__codex_apps__github_list_user_orgs

```json
{}
```

Output:

```text
{"orgs":[]}
```

#### Tool: mcp__codex_apps__github_list_user_org_memberships

```json
{}
```

Output:

```text
{"orgs":[]}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:11:35.306Z

The connector is failing because the GitHub App is not installed on the org that now owns the repo.

Current state I checked:
- The connector only sees one installation: personal account `acabrera04`
- It sees no org installation for `CS485-Harmony`
- That is why PR review writes fail with `403 Resource not accessible by integration`

When a repo is transferred, the old user-account installation does not automatically grant the app access under the new org owner. You need to install or reconfigure the app on the org.

**Fix**
1. Have a `CS485-Harmony` org owner open the GitHub App installation page for this Codex/GitHub connector.
2. Install the app on the `CS485-Harmony` organization, not just on `acabrera04`.
3. Grant it access to either:
   - all repositories in the org, or
   - specifically `CS485-Harmony/Harmony`
4. If the app already appears installed on the org, open its installation settings and make sure `Harmony` is included in the selected repositories.
5. If your org uses approval restrictions or SSO, approve the app there too.
6. Reopen the Codex session after that so the connector refreshes its installation list.

**How to verify it’s fixed**
After reinstalling, the connector should show:
- an installation whose account is `CS485-Harmony`
- the repo should appear in installed-repo search
- PR review/comment actions should stop returning `403 Resource not accessible by integration`

**If you want the exact GitHub UI path**
- Organization `CS485-Harmony`
- `Settings`
- `GitHub Apps` or `Installed GitHub Apps`
- Find the Codex/OpenAI GitHub app
- `Configure`
- Add `Harmony` to repository access

If you want, I can help you verify it once the org owner installs it.

### Turn 4: # Review findings: ## Finding 1

#### 👤 User Prompt

- Time: 2026-04-10T22:13:34.976Z

```text
# Review findings:

## Finding 1 (/tmp/harmony-pr315/planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155) [added]
[P2] PUBLIC_NO_INDEX transition is missing from S6

S6 only plans `PRIVATE` and `PUBLIC_INDEXABLE` transitions, but both the SEO spec and the channel-visibility spec require `PUBLIC_NO_INDEX` as a first-class visibility state with its own `VISIBILITY_CHANGED` handling. As written, the plan has no task or test guaranteeing that `PUBLIC_INDEXABLE -> PUBLIC_NO_INDEX` removes the sitemap entry while keeping the page public with `noindex` behavior.

## My request for Codex:
Set a polling loop to automatically re-review this pr when he pushes new changes
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:13:50.737Z

Assuming hourly checks on the Harmony workspace and only acting when PR `#315` gets a new head commit.

### Turn 5: do every 10

#### 👤 User Prompt

- Time: 2026-04-10T22:14:00.014Z

```text
do every 10 minutes
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:14:05.362Z

10-minute automations aren’t supported in this app’s scheduler. The shortest supported interval here is hourly.

If you want, I can:
- create the hourly version here, or
- set up a local cron/launchd job in the repo that runs every 10 minutes instead.

### Turn 6: he made changes, review again and post your

#### 👤 User Prompt

- Time: 2026-04-10T22:16:02.007Z

```text
he made changes, review again and post your review
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:16:17.892Z

Re-reviewing PR `#315` from the updated head. I’m checking the new diff against the specs and previous feedback, then I’ll post a fresh review if anything still blocks approval.

#### Tool: exec_command

```sh
rtk read .github/PR_REVIEW.md
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

#### Tool: mcp__codex_apps__github_fetch_pr

```json
{
  "pr_number": 315,
  "repo_full_name": "CS485-Harmony/Harmony"
}
```

Output:

````text
{"pull_request":{"url":"https://github.com/CS485-Harmony/Harmony/pull/315","number":315,"state":"open","merged":false,"mergeable":true,"draft":false,"body":"## Summary\n- Stacks on top of #311 (Sprint 4 deployment plan)\n- Adds `planning/FINAL_PROJECT_SPRINT_PLAN.md` covering Apr 10 – May 3\n- Sprint 5 (Apr 20 – May 3): 16 issues across 5 phases to finish SEO meta tag generation feature, validate on deployed stack, run bug bash, and deliver final submission package\n\n## Test plan\n- [ ] Review phase breakdown and owner assignments\n- [ ] Confirm Sprint 4 exit criteria align with #311 scope\n- [ ] Confirm AC-1..AC-10 coverage maps to dev spec §14\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","title":"Add Sprint 5 final project plan through May 3","base":"codex/sprint-4-deployment-plan","base_sha":"faba6e20e895363aa8a866c01cdb25436e6a3cef","head":"sprint-5-final-project-plan","head_sha":"9dc07b41974e29037501159dbcc6a06b39512235","merge_commit_sha":"d1b751d77a47499a080d6ba2d3d31c0b888889b4","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"requested_reviewers":null,"diff":"@@ -0,0 +1,2 @@\n+# Session Log 2026-04-09-184230\n+\n@@ -0,0 +1,397 @@\n+# Final Project Sprint Plan — April 10 – May 3, 2026\n+\n+## Context\n+This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:\n+\n+- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.\n+- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.\n+\n+Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered \"done\" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.\n+\n+## Team\n+5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI\n+\n+---\n+\n+## Sprint 4 — Deployment (April 10–19)\n+\n+Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.\n+\n+### Sprint 4 exit criteria (must be true before Sprint 5 starts)\n+- Public Vercel frontend URL live on the apex domain\n+- Public Railway backend URL live on `api.<frontend-domain>`\n+- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton\n+- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production\n+- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations\n+- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green\n+- Branch protection on `main` with required checks\n+- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current\n+- README updated for user-facing and deployer-facing instructions\n+- P6 submission package assembled (links, logs, reflection, LLM logs)\n+\n+### Sprint 4 key dates\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |\n+| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |\n+| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |\n+| Apr 16 (Thu) | Branch protection enabled (#13) |\n+| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |\n+| Apr 19 (Sun) | P6 submission package complete (#15) |\n+\n+---\n+\n+## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)\n+\n+### Goal\n+Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.\n+\n+### Scope anchor\n+Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`\n+- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)\n+- Classes C1.1–C6.x per §3 / §4\n+- APIs / public interfaces per §9 / §10\n+- Acceptance criteria AC-1 through AC-10 per §14\n+\n+### Sprint 5 guardrails\n+- All work on feature branches with PR review (branch protection is live from Sprint 4)\n+- Every PR must pass `run-integration-tests` + unit workflows before merge\n+- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only\n+- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory\n+- All destructive schema changes follow the expand/contract convention established in Sprint 4\n+\n+---\n+\n+### Phase A — SEO backend core (April 20–23)\n+\n+**S1. Meta tag generation service skeleton (M2)**\n+- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGenerator` (CL-C2.5), and `MetaTagCache` per dev spec §3/§4\n+- Wire Redis-backed `MetaTagCache` with configurable TTL\n+- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)\n+- Acceptance criteria:\n+  - Classes C2.1–C2.6 exist with the method signatures named in dev spec §3/§4\n+  - `TitleGenerator` enforces ≤60 char auto-generated titles; `DescriptionGenerator` enforces 50–160 char auto-generated descriptions (AC-2)\n+  - `MetaTagCache` is backed by Redis (not process memory) and honors a configurable TTL\n+  - On NLP/timeout failure, `MetaTagService` returns fallback tags and flags `needsRegeneration=true` (AC-9)\n+  - Unit tests cover template application, length limits, sanitization, and fallback paths and pass in CI\n+- Assignee: **declanblanc**\n+- Backup: **acabrera04**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 exit criteria\n+\n+**S2. Content analysis module (M3)**\n+- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`\n+- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout\n+- Unit tests covering keyword extraction, summarization, and fallback paths\n+- Acceptance criteria:\n+  - Classes C3.1–C3.4 exist with the method signatures named in dev spec §3/§4\n+  - `ContentAnalyzer.analyzeThread()` returns keywords, summary, and topic category for a fixture thread\n+  - Deterministic fallback returns a valid (non-null) result within the configured timeout budget when the NLP path is stubbed to fail\n+  - Unit tests cover stop-word filtering, frequency scoring, summarization, topic classification, and timeout/fallback paths\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 22\n+- Blocked by: none (parallel with S1)\n+\n+**S3. Data schema + persistence for meta tag overrides (§11)**\n+- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11\n+- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas\n+- Custom overrides must never be overwritten by background regeneration (AC-7)\n+- Acceptance criteria:\n+  - Prisma migration adds all fields in dev spec §11 and applies cleanly via the single Sprint 4 migration runner\n+  - Migration is expand-only (no destructive drops) so it coexists with old `backend-api` replicas during rolling restart\n+  - Persistence layer enforces that a background regeneration write cannot overwrite a non-null `customTitle` or `customDescription` (AC-7), verified by an integration test\n+  - Schema is documented in `docs/deployment/deployment-architecture.md` or the SEO dev spec appendix\n+- Assignee: **FardeenI**\n+- Backup: **AvanishKulkarni**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 migration-runner ownership\n+\n+**S4. Admin REST endpoints (§9, §10)**\n+- Implement the admin-only meta-tag endpoints exactly as defined in dev spec §9/§10:\n+  - `GET /api/admin/channels/{channelId}/meta-tags`\n+  - `PUT /api/admin/channels/{channelId}/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)\n+  - `POST /api/admin/channels/{channelId}/meta-tags/jobs` returning `jobId` with idempotency key (AC-5, AC-6)\n+  - `GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` status polling\n+- Authorization is **server admin only** per dev spec §12 (\"Only server admins can set custom meta tags\"). Channel creators/owners without the server-admin role must not reach these endpoints.\n+- API integration tests for each endpoint\n+- Acceptance criteria:\n+  - All four endpoints are mounted under `/api/admin/channels/...` matching dev spec §9 paths exactly\n+  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)\n+  - `POST .../jobs` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)\n+  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)\n+  - All endpoints enforce server-admin authorization; non-admins (including channel creators without admin role) get 403\n+  - Supertest integration tests cover success, validation failure, non-admin rejection, and idempotency\n+- Assignee: **FardeenI**\n+- Due: Apr 23\n+- Blocked by: S1, S3\n+\n+---\n+\n+### Phase B — Background processing + visibility lifecycle (April 22–25)\n+\n+**S5. Background meta tag update worker (M4) on `backend-worker`**\n+- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration\n+- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus\n+- Worker must run as singleton only (enforced by Sprint 4 topology)\n+- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline\n+- Acceptance criteria:\n+  - `MetaTagUpdateWorker` runs only inside the `backend-worker` process; `backend-api` replicas do not subscribe to regeneration events\n+  - Worker consumes `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events and schedules regeneration jobs\n+  - Debounce/batch window collapses repeated events for the same channel into a single regeneration job within the configured window\n+  - Worker restart does not duplicate in-flight jobs (job queue dedupes by channel + idempotency key)\n+  - Integration test simulates burst traffic and asserts a single regeneration job is produced per debounce window\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 24\n+- Blocked by: S1, S2\n+\n+**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**\n+- Handle all three branches of the `VISIBILITY_CHANGED` event per dev spec §6 flow F8 and §9.1 cross-spec visibility contract:\n+  - `→ PRIVATE`: invalidate `MetaTagCache` (`meta:channel:{channelId}`), purge CDN, remove sitemap URL, request search-engine removal; never serve stale tags while private\n+  - `→ PUBLIC_NO_INDEX`: regenerate tags with `robots=noindex`, invalidate cache, keep channel publicly reachable but exclude from indexable sitemap set\n+  - `→ PUBLIC_INDEXABLE`: high-priority regeneration, invalidate cache, keep canonical URL in sitemap with refreshed `lastmod`\n+- Integration tests covering all three directions and cache/sitemap side effects\n+- Acceptance criteria:\n+  - `PUBLIC_INDEXABLE → PRIVATE` invalidates the `MetaTagCache` entry and removes the URL from the sitemap within one regeneration cycle (AC-4, AC-10)\n+  - `PUBLIC_INDEXABLE → PUBLIC_NO_INDEX` regenerates with `robots=noindex`, invalidates cache, and removes the channel from the indexable sitemap set while the page remains publicly reachable\n+  - `PRIVATE → PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX → PUBLIC_INDEXABLE` re-enqueue high-priority regeneration and the channel (re)appears in the sitemap\n+  - Subsequent SSR requests return `noindex` meta where required and 404/403 public body for PRIVATE\n+  - End-to-end integration test covers the full `PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE` matrix and asserts cache + sitemap state at each step\n+- Assignee: **declanblanc**\n+- Due: Apr 25\n+- Blocked by: S5\n+\n+**S7. Security + content filtering (§12, AC-8)**\n+- PII and profanity filters on generated titles/descriptions\n+- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`\n+- Unit tests with fixture content covering PII/profanity/XSS\n+- Acceptance criteria:\n+  - Generated tags for the PII/profanity fixture corpus contain no flagged content (AC-8)\n+  - HTML/attribute injection attempts in `customTitle`/`customDescription` are escaped or rejected on write and on render\n+  - `<head>` output for a crafted XSS fixture passes a snapshot test showing escaped output\n+  - Filter behavior is covered by unit tests and documented in `docs/dev-spec-seo-meta-tag-generation.md` §12 cross-reference\n+- Assignee: **AvanishKulkarni**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 25\n+- Blocked by: S1\n+\n+---\n+\n+### Phase C — Frontend rendering + SEO surface (April 23–27)\n+\n+**S8. `PublicChannelPage` + `generateMetadata` integration (M1)**\n+- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`\n+- Use the Next.js **App Router** `generateMetadata` export in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx` (already scaffolded) to fetch tags from the backend at request time; JSON-LD is injected via a component in `page.tsx` since `Metadata` doesn't cover structured data\n+- Use App Router route handlers / metadata routes (`app/sitemap.ts`, `app/robots.ts`) for crawler-facing entrypoints — do **not** introduce `getServerSideProps` or `pages/` router code\n+- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain\n+- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name=\"description\">` (AC-1)\n+- Acceptance criteria:\n+  - Every public channel page SSR-renders non-empty `<title>` and `<meta name=\"description\">` for the fixture corpus (AC-1)\n+  - Open Graph, Twitter card, and JSON-LD `DiscussionForumPosting` tags are present and validate against Google Rich Results test\n+  - Canonical URL is the frontend apex domain; no `<link rel=\"canonical\">` or sitemap URL points at the API subdomain\n+  - Meta tag fetch uses the backend API at request time and degrades to template fallback if the backend is unreachable\n+  - E2E test (Playwright or crawler UA fetch) asserts tags on at least 3 representative public channels\n+- Assignee: **declanblanc**\n+- Due: Apr 26\n+- Blocked by: S4, Sprint 4 #6 (frontend prod config)\n+\n+**S9. Sitemap + robots.txt finalization**\n+- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain\n+- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility\n+- Smoke test that private channels do not appear in sitemap\n+- Acceptance criteria:\n+  - `https://<frontend-apex>/sitemap.xml` and `https://<frontend-apex>/robots.txt` resolve on the frontend apex domain (not the API subdomain)\n+  - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `PRIVATE` channels are excluded\n+  - Channels flipped to `PRIVATE` disappear from sitemap on the next regeneration cycle\n+  - `robots.txt` allows crawling of public paths and disallows non-public areas\n+  - Smoke test asserts sitemap exclusion behavior for a fixture private channel\n+- Assignee: **AvanishKulkarni**\n+- Backup: **FardeenI**\n+- Due: Apr 27\n+- Blocked by: S6, S8\n+\n+**S10. Meta tag admin UI (server-admin override flow)**\n+- UI under server/channel admin settings for **server admins** to view generated tags, override title/description, and trigger manual regeneration with job status polling. Authorization matches dev spec §12: only server admins can set custom meta tags.\n+- Respect `customTitle`/`customDescription` length limits with client-side validation\n+- Talks to the admin endpoints from S4 (`/api/admin/channels/{channelId}/meta-tags` and `.../jobs/{jobId}`)\n+- Acceptance criteria:\n+  - Admin settings page exposes a \"SEO Preview\" section showing current generated + override values\n+  - A server admin can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules\n+  - A server admin can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`\n+  - Non-admin users (including channel creators without the admin role) do not see the override UI\n+  - Frontend unit tests cover validation, submit, job polling, and admin-vs-non-admin rendering\n+- Assignee: **acabrera04**\n+- Backup: **declanblanc**\n+- Due: Apr 27\n+- Blocked by: S4\n+\n+---\n+\n+### Phase D — End-to-end verification on production (April 27–30)\n+\n+**S11. Integration tests for SEO feature (local + cloud + isolated staging)**\n+- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10\n+- Split AC coverage by execution target so the read-only cloud rule from Sprint 4 is not violated:\n+  - **Read-only paths against production deployed URLs:** AC-1 (tags present), AC-2 (length bounds on already-generated tags), AC-8 (no PII/profanity in fixture-safe public channels), and any AC that only needs fetch-and-assert\n+  - **Write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10):** run against an **isolated staging environment** provisioned for Sprint 5 (separate Railway project/environment + isolated Postgres + isolated Redis + dedicated Vercel preview) so visibility flips, regeneration jobs, override persistence, and fallback injection never touch the instructor-reviewed production dataset\n+  - `local` mode still runs the full AC-1..AC-10 matrix deterministically on seeded data and remains the CI source of truth\n+- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)\n+- Acceptance criteria:\n+  - Test cases exist and are traceable one-to-one to AC-1 through AC-10 in dev spec §14\n+  - Suite runs in `local` mode via `run-integration-tests.yml` and passes on PR with full AC-1..AC-10 coverage\n+  - Read-only cloud mode runs against production URLs and does not mutate production data\n+  - Write-path AC coverage runs against a documented isolated staging environment, documented alongside the Sprint 4 isolation rules in `docs/deployment/deployment-architecture.md`\n+  - Crawler-UA fetches (`User-Agent: Googlebot`) of at least 3 public channels return non-empty `<title>`/`<meta name=\"description\">` and valid JSON-LD\n+  - Test output is captured as an artifact for submission evidence\n+  - If the isolated staging environment cannot be provisioned in time, write-path ACs fall back to `local` evidence and the limitation is explicitly documented in the submission reflection\n+- Assignee: **Aiden-Barrera**\n+- Due: Apr 29\n+- Blocked by: S8, S9, S10\n+\n+**S12. Deployed validation + evidence capture**\n+- Run the read-only cloud portion of the SEO suite against the deployed production Vercel + Railway stack and the write-path portion against the isolated staging environment provisioned in S11\n+- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, and visibility-driven sitemap/`noindex` behavior works across `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`\n+- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch\n+- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission\n+- Acceptance criteria:\n+  - Read-only cloud tests pass against the deployed production stack without mutating production data\n+  - Write-path tests pass against the isolated staging stack\n+  - Evidence bundle exists under `docs/submission/seo-evidence/` containing: crawler-view HTML, Rich Results test screenshots, replica-identity headers from at least two distinct `backend-api` replicas, and a cache-hit log sample\n+  - Visibility transitions for all three states (`PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE`) are verified and captured as evidence (AC-4, AC-10)\n+  - Tag output is identical across both API replicas for the same channel within one cache TTL\n+  - Every AC-1..AC-10 item has at least one linked piece of evidence in the bundle, with the target environment (production / staging / local) labeled\n+  - Any AC for which only `local` evidence exists is flagged explicitly in the bundle and the reflection\n+- Assignee: **declanblanc**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 30\n+- Blocked by: S11\n+\n+**S13. Bug bash + polish**\n+- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime\n+- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`\n+- Fix must-fix items only; document the rest in the reflection\n+- Acceptance criteria:\n+  - Each developer logs at least one bug-bash session against the deployed stack and files GitHub issues for findings\n+  - Every finding is triaged with a label (`must-fix-for-submission` or `known-limitation`)\n+  - All `must-fix-for-submission` issues are merged to `main` and redeployed before S15 starts\n+  - `known-limitation` issues are summarized in the reflection document\n+  - Post-bash smoke run of the cloud integration suite is green\n+- Assignee: **whole team**, coordinator: **FardeenI**\n+- Due: May 1\n+- Blocked by: S12\n+\n+---\n+\n+### Phase E — Final submission package (May 1–3)\n+\n+**S14. README + deployer guide final pass**\n+- Fold SEO feature usage, override flow, and regeneration behavior into README\n+- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)\n+- Acceptance criteria:\n+  - README documents: how to view generated SEO tags, how a server admin overrides them, and how regeneration is triggered\n+  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value\n+  - README links to the deployed frontend URL, backend URL, and submission evidence bundle\n+  - A fresh contributor can follow README instructions to run the app locally and see SEO tags on a public channel\n+- Assignee: **acabrera04**\n+- Due: May 2\n+- Blocked by: S10\n+\n+**S15. Final project submission package**\n+- Compile final deliverable checklist:\n+  - Public frontend URL + public backend URL (from Sprint 4)\n+  - Links to every dev spec document under `docs/`\n+  - Links to SEO feature PRs and commits\n+  - Integration test specs + code + local/cloud run output\n+  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)\n+  - Branch protection screenshot\n+  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)\n+  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)\n+  - LLM interaction logs under `llm-logs/` with model/version labels\n+- Acceptance criteria:\n+  - Every checklist item above has a resolved link or committed artifact (no TBDs)\n+  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README\n+  - All AC-1..AC-10 items map to evidence produced in S12\n+  - Each developer is named against at least one deliverable in the contributions section\n+  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD\n+- Assignee: **acabrera04**\n+- Backup: **FardeenI**\n+- Due: May 3\n+- Blocked by: S12, S13, S14\n+\n+**S16. Final reflection + retrospective**\n+- Team retrospective on the full project (Sprints 1–5)\n+- Each developer contributes a short written reflection to the submission doc\n+- Acceptance criteria:\n+  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)\n+  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change\n+  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off\n+  - Known limitations from S13 are captured in the reflection with mitigation notes\n+- Assignee: **whole team**, coordinator: **declanblanc**\n+- Due: May 3\n+- Blocked by: S15 draft\n+\n+---\n+\n+## Sprint 5 assignment summary\n+\n+| Developer | Issues | Focus |\n+|-----------|--------|-------|\n+| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |\n+| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |\n+| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |\n+| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |\n+| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |\n+\n+## Sprint 5 critical path\n+\n+```text\n+S1 Meta tag service  ─┐\n+S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐\n+S3 Schema/migration  ─┘                           │\n+                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission\n+S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘\n+S7 Security (needs S1) ──────────────────────────►\n+S9 Sitemap (needs S6, S8) ───────────────────────►\n+S10 Override UI (needs S4) ──────────────────────►\n+                                                   S14 README (needs S10) ─► S15\n+                                                   S16 Retrospective (parallel)\n+```\n+\n+## Sprint 5 timeline\n+\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |\n+| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |\n+| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |\n+| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |\n+| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |\n+| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |\n+| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |\n+| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |\n+| May 1 (Fri) | S13 bug bash complete; must-fix items merged |\n+| May 2 (Sat) | S14 README final pass merged |\n+| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |\n+\n+## Sprint 5 deliverables checklist\n+\n+The project is not complete until all of the following exist:\n+\n+- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack\n+- SEO meta tag generation service, content analysis, background worker, overrides API, and frontend SSR integration merged to `main`\n+- Creator override UI shipped\n+- Sitemap and robots.txt correctly respect channel visibility\n+- Cloud + local integration tests covering SEO paths passing in CI\n+- Production validation evidence: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation\n+- README updated for SEO feature and any new env vars\n+- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection\n+- LLM interaction logs archived under `llm-logs/`\n+- Team retrospective recorded\n+\n+## Notes\n+\n+- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).\n+- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.\n+- Cloud-mode tests remain read-only throughout Sprint 5 to protect the instructor-reviewed deployment.\n+- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.","comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #BzXVz5sHWXMWJF3KzBoBsJKiCgjuW/7CcBvltNVNAAY=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255L0RIUzdVb01xUDMxY3g5MjZuYmJ5QmJaYmY4TEwiLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/DHS7UoMqP31cx926nbbyBbZbf8LL) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 9:58pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:53:05Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/DHS7UoMqP31cx926nbbyBbZbf8LL\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 9:58pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917354","body":"S1 lists `StructuredDataGen`, but the SEO meta-tag dev spec’s class inventory uses `StructuredDataGenerator` (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917354,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S1 lists <code class=\"notranslate\">StructuredDataGen</code>, but the SEO meta-tag dev spec’s class inventory uses <code class=\"notranslate\">StructuredDataGenerator</code> (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917379","body":"S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines `/api/admin/channels/{channelId}/meta-tags` for GET/PUT/POST and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` for polling, with `Idempotency-Key` as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917379,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> for GET/PUT/POST and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code> for polling, with <code class=\"notranslate\">Idempotency-Key</code> as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917397","body":"This task references `getServerSideProps`, but the frontend is already using the Next.js App Router (`src/app/...`) and `generateMetadata` for SSR meta tags (e.g., `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`). Consider updating the plan to reference App Router mechanisms (`generateMetadata`, metadata routes, route handlers) so the implementation guidance matches the current codebase.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917397,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">This task references <code class=\"notranslate\">getServerSideProps</code>, but the frontend is already using the Next.js App Router (<code class=\"notranslate\">src/app/...</code>) and <code class=\"notranslate\">generateMetadata</code> for SSR meta tags (e.g., <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>). Consider updating the plan to reference App Router mechanisms (<code class=\"notranslate\">generateMetadata</code>, metadata routes, route handlers) so the implementation guidance matches the current codebase.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092675467","body":"## Pull request overview\n\nAdds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.\n\n**Changes:**\n- Add `planning/FINAL_PROJECT_SPRINT_PLAN.md` detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.\n- Add a new LLM session log stub under `llm-logs/`.\n\n### Reviewed changes\n\nCopilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.\n\n| File | Description |\n| ---- | ----------- |\n| planning/FINAL_PROJECT_SPRINT_PLAN.md | New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3 |\n| llm-logs/2026-04-09-184230-session-c9f15ca0.md | Adds a minimal session-log header entry |\n\n\n\n\n\n---\n\n💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4092675467,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Add <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md</code> detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.</li>\n<li>Add a new LLM session log stub under <code class=\"notranslate\">llm-logs/</code>.</li>\n</ul>\n<h3 dir=\"auto\">Reviewed changes</h3>\n<p dir=\"auto\">Copilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th>File</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>planning/FINAL_PROJECT_SPRINT_PLAN.md</td>\n<td>New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3</td>\n</tr>\n<tr>\n<td>llm-logs/2026-04-09-184230-session-c9f15ca0.md</td>\n<td>Adds a minimal session-log header entry</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092717329","body":"- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.\n- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.\n- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.\n- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.\n- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.\n- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.\n- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.\n- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.\n\n1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.\n\n2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.\n\n3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.\n\nResidual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.\n","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4092717329,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:10:13Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Prioritize Logic over Style:</strong> The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Security First:</strong> The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Architectural Alignment:</strong> Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Feedback is limited to correctness, security, and spec alignment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> This is my first pass on the PR, so there were no earlier comments from me to re-check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.</li>\n</ul>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382</code> makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215</code> drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code>, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155</code> leaves out the <code class=\"notranslate\">PUBLIC_NO_INDEX</code> branch of the visibility state machine. The current specs require <code class=\"notranslate\">VISIBILITY_CHANGED</code> handling for <code class=\"notranslate\">PUBLIC_INDEXABLE</code>, <code class=\"notranslate\">PUBLIC_NO_INDEX</code>, and <code class=\"notranslate\">PRIVATE</code>; the sprint plan only schedules work and tests for private and re-indexable states.</p>\n</li>\n</ol>\n<p dir=\"auto\">Residual risk: <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180</code> tells the assignee to use <code class=\"notranslate\">getServerSideProps</code>, but the public channel route is already App Router code using <code class=\"notranslate\">generateMetadata</code> in <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969692","body":"Fixed in 9dc07b4. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969692,"pull_request_review_id":4092729940,"in_reply_to_id":3066917354,"created_at":"2026-04-10T22:15:17Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092729940","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092729940,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:17Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969993","body":"Fixed in 9dc07b4. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969993,"pull_request_review_id":4092730293,"in_reply_to_id":3066917397,"created_at":"2026-04-10T22:15:26Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092730293","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092730293,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:26Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227097411","body":"> Re: comment 4092717329\n\nAll four points addressed in 9dc07b4:\n\n1. **Read-only cloud vs AC-4..AC-10 mutation gap:** S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.\n\n2. **Interface/auth drift:** S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.\n\n3. **Missing PUBLIC_NO_INDEX branch:** S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.\n\n4. **Residual: getServerSideProps vs App Router:** S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4227097411,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:43Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4092717329</p>\n</blockquote>\n<p dir=\"auto\">All four points addressed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>:</p>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><strong>Read-only cloud vs AC-4..AC-10 mutation gap:</strong> S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Interface/auth drift:</strong> S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Missing PUBLIC_NO_INDEX branch:</strong> S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Residual: getServerSideProps vs App Router:</strong> S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.</p>\n</li>\n</ol>"}],"created_at":"2026-04-10T21:52:55Z","updated_at":"2026-04-10T22:15:43Z","closed_at":null,"merged_at":null,"commits":4,"changed_files":2,"additions":399,"deletions":0,"display_url":"https://github.com/CS485-Harmony/Harmony/pull/315","display_title":"Add Sprint 5 final project plan through May 3"},"url":"https://github.com/CS485-Harmony/Harmony/pull/315","title":"Add Sprint 5 final project plan through May 3","diff":"@@ -0,0 +1,2 @@\n+# Session Log 2026-04-09-184230\n+\n@@ -0,0 +1,397 @@\n+# Final Project Sprint Plan — April 10 – May 3, 2026\n+\n+## Context\n+This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:\n+\n+- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.\n+- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.\n+\n+Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered \"done\" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.\n+\n+## Team\n+5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI\n+\n+---\n+\n+## Sprint 4 — Deployment (April 10–19)\n+\n+Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.\n+\n+### Sprint 4 exit criteria (must be true before Sprint 5 starts)\n+- Public Vercel frontend URL live on the apex domain\n+- Public Railway backend URL live on `api.<frontend-domain>`\n+- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton\n+- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production\n+- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations\n+- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green\n+- Branch protection on `main` with required checks\n+- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current\n+- README updated for user-facing and deployer-facing instructions\n+- P6 submission package assembled (links, logs, reflection, LLM logs)\n+\n+### Sprint 4 key dates\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |\n+| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |\n+| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |\n+| Apr 16 (Thu) | Branch protection enabled (#13) |\n+| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |\n+| Apr 19 (Sun) | P6 submission package complete (#15) |\n+\n+---\n+\n+## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)\n+\n+### Goal\n+Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.\n+\n+### Scope anchor\n+Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`\n+- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)\n+- Classes C1.1–C6.x per §3 / §4\n+- APIs / public interfaces per §9 / §10\n+- Acceptance criteria AC-1 through AC-10 per §14\n+\n+### Sprint 5 guardrails\n+- All work on feature branches with PR review (branch protection is live from Sprint 4)\n+- Every PR must pass `run-integration-tests` + unit workflows before merge\n+- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only\n+- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory\n+- All destructive schema changes follow the expand/contract convention established in Sprint 4\n+\n+---\n+\n+### Phase A — SEO backend core (April 20–23)\n+\n+**S1. Meta tag generation service skeleton (M2)**\n+- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGenerator` (CL-C2.5), and `MetaTagCache` per dev spec §3/§4\n+- Wire Redis-backed `MetaTagCache` with configurable TTL\n+- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)\n+- Acceptance criteria:\n+  - Classes C2.1–C2.6 exist with the method signatures named in dev spec §3/§4\n+  - `TitleGenerator` enforces ≤60 char auto-generated titles; `DescriptionGenerator` enforces 50–160 char auto-generated descriptions (AC-2)\n+  - `MetaTagCache` is backed by Redis (not process memory) and honors a configurable TTL\n+  - On NLP/timeout failure, `MetaTagService` returns fallback tags and flags `needsRegeneration=true` (AC-9)\n+  - Unit tests cover template application, length limits, sanitization, and fallback paths and pass in CI\n+- Assignee: **declanblanc**\n+- Backup: **acabrera04**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 exit criteria\n+\n+**S2. Content analysis module (M3)**\n+- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`\n+- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout\n+- Unit tests covering keyword extraction, summarization, and fallback paths\n+- Acceptance criteria:\n+  - Classes C3.1–C3.4 exist with the method signatures named in dev spec §3/§4\n+  - `ContentAnalyzer.analyzeThread()` returns keywords, summary, and topic category for a fixture thread\n+  - Deterministic fallback returns a valid (non-null) result within the configured timeout budget when the NLP path is stubbed to fail\n+  - Unit tests cover stop-word filtering, frequency scoring, summarization, topic classification, and timeout/fallback paths\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 22\n+- Blocked by: none (parallel with S1)\n+\n+**S3. Data schema + persistence for meta tag overrides (§11)**\n+- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11\n+- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas\n+- Custom overrides must never be overwritten by background regeneration (AC-7)\n+- Acceptance criteria:\n+  - Prisma migration adds all fields in dev spec §11 and applies cleanly via the single Sprint 4 migration runner\n+  - Migration is expand-only (no destructive drops) so it coexists with old `backend-api` replicas during rolling restart\n+  - Persistence layer enforces that a background regeneration write cannot overwrite a non-null `customTitle` or `customDescription` (AC-7), verified by an integration test\n+  - Schema is documented in `docs/deployment/deployment-architecture.md` or the SEO dev spec appendix\n+- Assignee: **FardeenI**\n+- Backup: **AvanishKulkarni**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 migration-runner ownership\n+\n+**S4. Admin REST endpoints (§9, §10)**\n+- Implement the admin-only meta-tag endpoints exactly as defined in dev spec §9/§10:\n+  - `GET /api/admin/channels/{channelId}/meta-tags`\n+  - `PUT /api/admin/channels/{channelId}/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)\n+  - `POST /api/admin/channels/{channelId}/meta-tags/jobs` returning `jobId` with idempotency key (AC-5, AC-6)\n+  - `GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` status polling\n+- Authorization is **server admin only** per dev spec §12 (\"Only server admins can set custom meta tags\"). Channel creators/owners without the server-admin role must not reach these endpoints.\n+- API integration tests for each endpoint\n+- Acceptance criteria:\n+  - All four endpoints are mounted under `/api/admin/channels/...` matching dev spec §9 paths exactly\n+  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)\n+  - `POST .../jobs` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)\n+  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)\n+  - All endpoints enforce server-admin authorization; non-admins (including channel creators without admin role) get 403\n+  - Supertest integration tests cover success, validation failure, non-admin rejection, and idempotency\n+- Assignee: **FardeenI**\n+- Due: Apr 23\n+- Blocked by: S1, S3\n+\n+---\n+\n+### Phase B — Background processing + visibility lifecycle (April 22–25)\n+\n+**S5. Background meta tag update worker (M4) on `backend-worker`**\n+- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration\n+- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus\n+- Worker must run as singleton only (enforced by Sprint 4 topology)\n+- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline\n+- Acceptance criteria:\n+  - `MetaTagUpdateWorker` runs only inside the `backend-worker` process; `backend-api` replicas do not subscribe to regeneration events\n+  - Worker consumes `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events and schedules regeneration jobs\n+  - Debounce/batch window collapses repeated events for the same channel into a single regeneration job within the configured window\n+  - Worker restart does not duplicate in-flight jobs (job queue dedupes by channel + idempotency key)\n+  - Integration test simulates burst traffic and asserts a single regeneration job is produced per debounce window\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 24\n+- Blocked by: S1, S2\n+\n+**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**\n+- Handle all three branches of the `VISIBILITY_CHANGED` event per dev spec §6 flow F8 and §9.1 cross-spec visibility contract:\n+  - `→ PRIVATE`: invalidate `MetaTagCache` (`meta:channel:{channelId}`), purge CDN, remove sitemap URL, request search-engine removal; never serve stale tags while private\n+  - `→ PUBLIC_NO_INDEX`: regenerate tags with `robots=noindex`, invalidate cache, keep channel publicly reachable but exclude from indexable sitemap set\n+  - `→ PUBLIC_INDEXABLE`: high-priority regeneration, invalidate cache, keep canonical URL in sitemap with refreshed `lastmod`\n+- Integration tests covering all three directions and cache/sitemap side effects\n+- Acceptance criteria:\n+  - `PUBLIC_INDEXABLE → PRIVATE` invalidates the `MetaTagCache` entry and removes the URL from the sitemap within one regeneration cycle (AC-4, AC-10)\n+  - `PUBLIC_INDEXABLE → PUBLIC_NO_INDEX` regenerates with `robots=noindex`, invalidates cache, and removes the channel from the indexable sitemap set while the page remains publicly reachable\n+  - `PRIVATE → PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX → PUBLIC_INDEXABLE` re-enqueue high-priority regeneration and the channel (re)appears in the sitemap\n+  - Subsequent SSR requests return `noindex` meta where required and 404/403 public body for PRIVATE\n+  - End-to-end integration test covers the full `PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE` matrix and asserts cache + sitemap state at each step\n+- Assignee: **declanblanc**\n+- Due: Apr 25\n+- Blocked by: S5\n+\n+**S7. Security + content filtering (§12, AC-8)**\n+- PII and profanity filters on generated titles/descriptions\n+- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`\n+- Unit tests with fixture content covering PII/profanity/XSS\n+- Acceptance criteria:\n+  - Generated tags for the PII/profanity fixture corpus contain no flagged content (AC-8)\n+  - HTML/attribute injection attempts in `customTitle`/`customDescription` are escaped or rejected on write and on render\n+  - `<head>` output for a crafted XSS fixture passes a snapshot test showing escaped output\n+  - Filter behavior is covered by unit tests and documented in `docs/dev-spec-seo-meta-tag-generation.md` §12 cross-reference\n+- Assignee: **AvanishKulkarni**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 25\n+- Blocked by: S1\n+\n+---\n+\n+### Phase C — Frontend rendering + SEO surface (April 23–27)\n+\n+**S8. `PublicChannelPage` + `generateMetadata` integration (M1)**\n+- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`\n+- Use the Next.js **App Router** `generateMetadata` export in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx` (already scaffolded) to fetch tags from the backend at request time; JSON-LD is injected via a component in `page.tsx` since `Metadata` doesn't cover structured data\n+- Use App Router route handlers / metadata routes (`app/sitemap.ts`, `app/robots.ts`) for crawler-facing entrypoints — do **not** introduce `getServerSideProps` or `pages/` router code\n+- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain\n+- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name=\"description\">` (AC-1)\n+- Acceptance criteria:\n+  - Every public channel page SSR-renders non-empty `<title>` and `<meta name=\"description\">` for the fixture corpus (AC-1)\n+  - Open Graph, Twitter card, and JSON-LD `DiscussionForumPosting` tags are present and validate against Google Rich Results test\n+  - Canonical URL is the frontend apex domain; no `<link rel=\"canonical\">` or sitemap URL points at the API subdomain\n+  - Meta tag fetch uses the backend API at request time and degrades to template fallback if the backend is unreachable\n+  - E2E test (Playwright or crawler UA fetch) asserts tags on at least 3 representative public channels\n+- Assignee: **declanblanc**\n+- Due: Apr 26\n+- Blocked by: S4, Sprint 4 #6 (frontend prod config)\n+\n+**S9. Sitemap + robots.txt finalization**\n+- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain\n+- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility\n+- Smoke test that private channels do not appear in sitemap\n+- Acceptance criteria:\n+  - `https://<frontend-apex>/sitemap.xml` and `https://<frontend-apex>/robots.txt` resolve on the frontend apex domain (not the API subdomain)\n+  - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `PRIVATE` channels are excluded\n+  - Channels flipped to `PRIVATE` disappear from sitemap on the next regeneration cycle\n+  - `robots.txt` allows crawling of public paths and disallows non-public areas\n+  - Smoke test asserts sitemap exclusion behavior for a fixture private channel\n+- Assignee: **AvanishKulkarni**\n+- Backup: **FardeenI**\n+- Due: Apr 27\n+- Blocked by: S6, S8\n+\n+**S10. Meta tag admin UI (server-admin override flow)**\n+- UI under server/channel admin settings for **server admins** to view generated tags, override title/description, and trigger manual regeneration with job status polling. Authorization matches dev spec §12: only server admins can set custom meta tags.\n+- Respect `customTitle`/`customDescription` length limits with client-side validation\n+- Talks to the admin endpoints from S4 (`/api/admin/channels/{channelId}/meta-tags` and `.../jobs/{jobId}`)\n+- Acceptance criteria:\n+  - Admin settings page exposes a \"SEO Preview\" section showing current generated + override values\n+  - A server admin can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules\n+  - A server admin can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`\n+  - Non-admin users (including channel creators without the admin role) do not see the override UI\n+  - Frontend unit tests cover validation, submit, job polling, and admin-vs-non-admin rendering\n+- Assignee: **acabrera04**\n+- Backup: **declanblanc**\n+- Due: Apr 27\n+- Blocked by: S4\n+\n+---\n+\n+### Phase D — End-to-end verification on production (April 27–30)\n+\n+**S11. Integration tests for SEO feature (local + cloud + isolated staging)**\n+- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10\n+- Split AC coverage by execution target so the read-only cloud rule from Sprint 4 is not violated:\n+  - **Read-only paths against production deployed URLs:** AC-1 (tags present), AC-2 (length bounds on already-generated tags), AC-8 (no PII/profanity in fixture-safe public channels), and any AC that only needs fetch-and-assert\n+  - **Write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10):** run against an **isolated staging environment** provisioned for Sprint 5 (separate Railway project/environment + isolated Postgres + isolated Redis + dedicated Vercel preview) so visibility flips, regeneration jobs, override persistence, and fallback injection never touch the instructor-reviewed production dataset\n+  - `local` mode still runs the full AC-1..AC-10 matrix deterministically on seeded data and remains the CI source of truth\n+- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)\n+- Acceptance criteria:\n+  - Test cases exist and are traceable one-to-one to AC-1 through AC-10 in dev spec §14\n+  - Suite runs in `local` mode via `run-integration-tests.yml` and passes on PR with full AC-1..AC-10 coverage\n+  - Read-only cloud mode runs against production URLs and does not mutate production data\n+  - Write-path AC coverage runs against a documented isolated staging environment, documented alongside the Sprint 4 isolation rules in `docs/deployment/deployment-architecture.md`\n+  - Crawler-UA fetches (`User-Agent: Googlebot`) of at least 3 public channels return non-empty `<title>`/`<meta name=\"description\">` and valid JSON-LD\n+  - Test output is captured as an artifact for submission evidence\n+  - If the isolated staging environment cannot be provisioned in time, write-path ACs fall back to `local` evidence and the limitation is explicitly documented in the submission reflection\n+- Assignee: **Aiden-Barrera**\n+- Due: Apr 29\n+- Blocked by: S8, S9, S10\n+\n+**S12. Deployed validation + evidence capture**\n+- Run the read-only cloud portion of the SEO suite against the deployed production Vercel + Railway stack and the write-path portion against the isolated staging environment provisioned in S11\n+- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, and visibility-driven sitemap/`noindex` behavior works across `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`\n+- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch\n+- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission\n+- Acceptance criteria:\n+  - Read-only cloud tests pass against the deployed production stack without mutating production data\n+  - Write-path tests pass against the isolated staging stack\n+  - Evidence bundle exists under `docs/submission/seo-evidence/` containing: crawler-view HTML, Rich Results test screenshots, replica-identity headers from at least two distinct `backend-api` replicas, and a cache-hit log sample\n+  - Visibility transitions for all three states (`PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE`) are verified and captured as evidence (AC-4, AC-10)\n+  - Tag output is identical across both API replicas for the same channel within one cache TTL\n+  - Every AC-1..AC-10 item has at least one linked piece of evidence in the bundle, with the target environment (production / staging / local) labeled\n+  - Any AC for which only `local` evidence exists is flagged explicitly in the bundle and the reflection\n+- Assignee: **declanblanc**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 30\n+- Blocked by: S11\n+\n+**S13. Bug bash + polish**\n+- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime\n+- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`\n+- Fix must-fix items only; document the rest in the reflection\n+- Acceptance criteria:\n+  - Each developer logs at least one bug-bash session against the deployed stack and files GitHub issues for findings\n+  - Every finding is triaged with a label (`must-fix-for-submission` or `known-limitation`)\n+  - All `must-fix-for-submission` issues are merged to `main` and redeployed before S15 starts\n+  - `known-limitation` issues are summarized in the reflection document\n+  - Post-bash smoke run of the cloud integration suite is green\n+- Assignee: **whole team**, coordinator: **FardeenI**\n+- Due: May 1\n+- Blocked by: S12\n+\n+---\n+\n+### Phase E — Final submission package (May 1–3)\n+\n+**S14. README + deployer guide final pass**\n+- Fold SEO feature usage, override flow, and regeneration behavior into README\n+- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)\n+- Acceptance criteria:\n+  - README documents: how to view generated SEO tags, how a server admin overrides them, and how regeneration is triggered\n+  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value\n+  - README links to the deployed frontend URL, backend URL, and submission evidence bundle\n+  - A fresh contributor can follow README instructions to run the app locally and see SEO tags on a public channel\n+- Assignee: **acabrera04**\n+- Due: May 2\n+- Blocked by: S10\n+\n+**S15. Final project submission package**\n+- Compile final deliverable checklist:\n+  - Public frontend URL + public backend URL (from Sprint 4)\n+  - Links to every dev spec document under `docs/`\n+  - Links to SEO feature PRs and commits\n+  - Integration test specs + code + local/cloud run output\n+  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)\n+  - Branch protection screenshot\n+  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)\n+  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)\n+  - LLM interaction logs under `llm-logs/` with model/version labels\n+- Acceptance criteria:\n+  - Every checklist item above has a resolved link or committed artifact (no TBDs)\n+  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README\n+  - All AC-1..AC-10 items map to evidence produced in S12\n+  - Each developer is named against at least one deliverable in the contributions section\n+  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD\n+- Assignee: **acabrera04**\n+- Backup: **FardeenI**\n+- Due: May 3\n+- Blocked by: S12, S13, S14\n+\n+**S16. Final reflection + retrospective**\n+- Team retrospective on the full project (Sprints 1–5)\n+- Each developer contributes a short written reflection to the submission doc\n+- Acceptance criteria:\n+  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)\n+  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change\n+  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off\n+  - Known limitations from S13 are captured in the reflection with mitigation notes\n+- Assignee: **whole team**, coordinator: **declanblanc**\n+- Due: May 3\n+- Blocked by: S15 draft\n+\n+---\n+\n+## Sprint 5 assignment summary\n+\n+| Developer | Issues | Focus |\n+|-----------|--------|-------|\n+| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |\n+| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |\n+| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |\n+| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |\n+| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |\n+\n+## Sprint 5 critical path\n+\n+```text\n+S1 Meta tag service  ─┐\n+S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐\n+S3 Schema/migration  ─┘                           │\n+                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission\n+S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘\n+S7 Security (needs S1) ──────────────────────────►\n+S9 Sitemap (needs S6, S8) ───────────────────────►\n+S10 Override UI (needs S4) ──────────────────────►\n+                                                   S14 README (needs S10) ─► S15\n+                                                   S16 Retrospective (parallel)\n+```\n+\n+## Sprint 5 timeline\n+\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |\n+| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |\n+| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |\n+| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |\n+| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |\n+| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |\n+| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |\n+| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |\n+| May 1 (Fri) | S13 bug bash complete; must-fix items merged |\n+| May 2 (Sat) | S14 README final pass merged |\n+| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |\n+\n+## Sprint 5 deliverables checklist\n+\n+The project is not complete until all of the following exist:\n+\n+- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack\n+- SEO meta tag generation service, content analysis, background worker, overrides API, and frontend SSR integration merged to `main`\n+- Creator override UI shipped\n+- Sitemap and robots.txt correctly respect channel visibility\n+- Cloud + local integration tests covering SEO paths passing in CI\n+- Production validation evidence: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation\n+- README updated for SEO feature and any new env vars\n+- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection\n+- LLM interaction logs archived under `llm-logs/`\n+- Team retrospective recorded\n+\n+## Notes\n+\n+- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).\n+- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.\n+- Cloud-mode tests remain read-only throughout Sprint 5 to protect the instructor-reviewed deployment.\n+- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.","comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #BzXVz5sHWXMWJF3KzBoBsJKiCgjuW/7CcBvltNVNAAY=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255L0RIUzdVb01xUDMxY3g5MjZuYmJ5QmJaYmY4TEwiLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/DHS7UoMqP31cx926nbbyBbZbf8LL) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 9:58pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:53:05Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/DHS7UoMqP31cx926nbbyBbZbf8LL\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 9:58pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917354","body":"S1 lists `StructuredDataGen`, but the SEO meta-tag dev spec’s class inventory uses `StructuredDataGenerator` (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917354,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S1 lists <code class=\"notranslate\">StructuredDataGen</code>, but the SEO meta-tag dev spec’s class inventory uses <code class=\"notranslate\">StructuredDataGenerator</code> (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917379","body":"S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines `/api/admin/channels/{channelId}/meta-tags` for GET/PUT/POST and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` for polling, with `Idempotency-Key` as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917379,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> for GET/PUT/POST and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code> for polling, with <code class=\"notranslate\">Idempotency-Key</code> as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917397","body":"This task references `getServerSideProps`, but the frontend is already using the Next.js App Router (`src/app/...`) and `generateMetadata` for SSR meta tags (e.g., `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`). Consider updating the plan to reference App Router mechanisms (`generateMetadata`, metadata routes, route handlers) so the implementation guidance matches the current codebase.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917397,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">This task references <code class=\"notranslate\">getServerSideProps</code>, but the frontend is already using the Next.js App Router (<code class=\"notranslate\">src/app/...</code>) and <code class=\"notranslate\">generateMetadata</code> for SSR meta tags (e.g., <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>). Consider updating the plan to reference App Router mechanisms (<code class=\"notranslate\">generateMetadata</code>, metadata routes, route handlers) so the implementation guidance matches the current codebase.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092675467","body":"## Pull request overview\n\nAdds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.\n\n**Changes:**\n- Add `planning/FINAL_PROJECT_SPRINT_PLAN.md` detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.\n- Add a new LLM session log stub under `llm-logs/`.\n\n### Reviewed changes\n\nCopilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.\n\n| File | Description |\n| ---- | ----------- |\n| planning/FINAL_PROJECT_SPRINT_PLAN.md | New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3 |\n| llm-logs/2026-04-09-184230-session-c9f15ca0.md | Adds a minimal session-log header entry |\n\n\n\n\n\n---\n\n💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4092675467,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Add <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md</code> detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.</li>\n<li>Add a new LLM session log stub under <code class=\"notranslate\">llm-logs/</code>.</li>\n</ul>\n<h3 dir=\"auto\">Reviewed changes</h3>\n<p dir=\"auto\">Copilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th>File</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>planning/FINAL_PROJECT_SPRINT_PLAN.md</td>\n<td>New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3</td>\n</tr>\n<tr>\n<td>llm-logs/2026-04-09-184230-session-c9f15ca0.md</td>\n<td>Adds a minimal session-log header entry</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092717329","body":"- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.\n- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.\n- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.\n- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.\n- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.\n- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.\n- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.\n- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.\n\n1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.\n\n2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.\n\n3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.\n\nResidual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.\n","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4092717329,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:10:13Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Prioritize Logic over Style:</strong> The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Security First:</strong> The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Architectural Alignment:</strong> Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Feedback is limited to correctness, security, and spec alignment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> This is my first pass on the PR, so there were no earlier comments from me to re-check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.</li>\n</ul>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382</code> makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215</code> drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code>, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155</code> leaves out the <code class=\"notranslate\">PUBLIC_NO_INDEX</code> branch of the visibility state machine. The current specs require <code class=\"notranslate\">VISIBILITY_CHANGED</code> handling for <code class=\"notranslate\">PUBLIC_INDEXABLE</code>, <code class=\"notranslate\">PUBLIC_NO_INDEX</code>, and <code class=\"notranslate\">PRIVATE</code>; the sprint plan only schedules work and tests for private and re-indexable states.</p>\n</li>\n</ol>\n<p dir=\"auto\">Residual risk: <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180</code> tells the assignee to use <code class=\"notranslate\">getServerSideProps</code>, but the public channel route is already App Router code using <code class=\"notranslate\">generateMetadata</code> in <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969692","body":"Fixed in 9dc07b4. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969692,"pull_request_review_id":4092729940,"in_reply_to_id":3066917354,"created_at":"2026-04-10T22:15:17Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092729940","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092729940,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:17Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969993","body":"Fixed in 9dc07b4. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969993,"pull_request_review_id":4092730293,"in_reply_to_id":3066917397,"created_at":"2026-04-10T22:15:26Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092730293","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092730293,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:26Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227097411","body":"> Re: comment 4092717329\n\nAll four points addressed in 9dc07b4:\n\n1. **Read-only cloud vs AC-4..AC-10 mutation gap:** S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.\n\n2. **Interface/auth drift:** S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.\n\n3. **Missing PUBLIC_NO_INDEX branch:** S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.\n\n4. **Residual: getServerSideProps vs App Router:** S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4227097411,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:43Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4092717329</p>\n</blockquote>\n<p dir=\"auto\">All four points addressed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>:</p>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><strong>Read-only cloud vs AC-4..AC-10 mutation gap:</strong> S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Interface/auth drift:</strong> S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Missing PUBLIC_NO_INDEX branch:</strong> S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Residual: getServerSideProps vs App Router:</strong> S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.</p>\n</li>\n</ol>"}],"display_url":"https://github.com/CS485-Harmony/Harmony/pull/315","display_title":"Add Sprint 5 final project plan through May 3"}
````

#### Tool: mcp__codex_apps__github_fetch_pr_comments

```json
{
  "pr_number": 315,
  "repo_full_name": "CS485-Harmony/Harmony"
}
```

Output:

```text
{"comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #BzXVz5sHWXMWJF3KzBoBsJKiCgjuW/7CcBvltNVNAAY=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255L0RIUzdVb01xUDMxY3g5MjZuYmJ5QmJaYmY4TEwiLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/DHS7UoMqP31cx926nbbyBbZbf8LL) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 9:58pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:53:05Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/DHS7UoMqP31cx926nbbyBbZbf8LL\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 9:58pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917354","body":"S1 lists `StructuredDataGen`, but the SEO meta-tag dev spec’s class inventory uses `StructuredDataGenerator` (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917354,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S1 lists <code class=\"notranslate\">StructuredDataGen</code>, but the SEO meta-tag dev spec’s class inventory uses <code class=\"notranslate\">StructuredDataGenerator</code> (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917379","body":"S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines `/api/admin/channels/{channelId}/meta-tags` for GET/PUT/POST and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` for polling, with `Idempotency-Key` as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917379,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> for GET/PUT/POST and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code> for polling, with <code class=\"notranslate\">Idempotency-Key</code> as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917397","body":"This task references `getServerSideProps`, but the frontend is already using the Next.js App Router (`src/app/...`) and `generateMetadata` for SSR meta tags (e.g., `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`). Consider updating the plan to reference App Router mechanisms (`generateMetadata`, metadata routes, route handlers) so the implementation guidance matches the current codebase.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917397,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">This task references <code class=\"notranslate\">getServerSideProps</code>, but the frontend is already using the Next.js App Router (<code class=\"notranslate\">src/app/...</code>) and <code class=\"notranslate\">generateMetadata</code> for SSR meta tags (e.g., <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>). Consider updating the plan to reference App Router mechanisms (<code class=\"notranslate\">generateMetadata</code>, metadata routes, route handlers) so the implementation guidance matches the current codebase.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092675467","body":"## Pull request overview\n\nAdds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.\n\n**Changes:**\n- Add `planning/FINAL_PROJECT_SPRINT_PLAN.md` detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.\n- Add a new LLM session log stub under `llm-logs/`.\n\n### Reviewed changes\n\nCopilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.\n\n| File | Description |\n| ---- | ----------- |\n| planning/FINAL_PROJECT_SPRINT_PLAN.md | New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3 |\n| llm-logs/2026-04-09-184230-session-c9f15ca0.md | Adds a minimal session-log header entry |\n\n\n\n\n\n---\n\n💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4092675467,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Add <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md</code> detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.</li>\n<li>Add a new LLM session log stub under <code class=\"notranslate\">llm-logs/</code>.</li>\n</ul>\n<h3 dir=\"auto\">Reviewed changes</h3>\n<p dir=\"auto\">Copilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th>File</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>planning/FINAL_PROJECT_SPRINT_PLAN.md</td>\n<td>New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3</td>\n</tr>\n<tr>\n<td>llm-logs/2026-04-09-184230-session-c9f15ca0.md</td>\n<td>Adds a minimal session-log header entry</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092717329","body":"- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.\n- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.\n- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.\n- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.\n- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.\n- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.\n- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.\n- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.\n\n1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.\n\n2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.\n\n3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.\n\nResidual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.\n","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4092717329,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:10:13Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Prioritize Logic over Style:</strong> The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Security First:</strong> The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Architectural Alignment:</strong> Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Feedback is limited to correctness, security, and spec alignment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> This is my first pass on the PR, so there were no earlier comments from me to re-check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.</li>\n</ul>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382</code> makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215</code> drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code>, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155</code> leaves out the <code class=\"notranslate\">PUBLIC_NO_INDEX</code> branch of the visibility state machine. The current specs require <code class=\"notranslate\">VISIBILITY_CHANGED</code> handling for <code class=\"notranslate\">PUBLIC_INDEXABLE</code>, <code class=\"notranslate\">PUBLIC_NO_INDEX</code>, and <code class=\"notranslate\">PRIVATE</code>; the sprint plan only schedules work and tests for private and re-indexable states.</p>\n</li>\n</ol>\n<p dir=\"auto\">Residual risk: <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180</code> tells the assignee to use <code class=\"notranslate\">getServerSideProps</code>, but the public channel route is already App Router code using <code class=\"notranslate\">generateMetadata</code> in <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969692","body":"Fixed in 9dc07b4. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969692,"pull_request_review_id":4092729940,"in_reply_to_id":3066917354,"created_at":"2026-04-10T22:15:17Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092729940","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092729940,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:17Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969993","body":"Fixed in 9dc07b4. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969993,"pull_request_review_id":4092730293,"in_reply_to_id":3066917397,"created_at":"2026-04-10T22:15:26Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092730293","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092730293,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:26Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227097411","body":"> Re: comment 4092717329\n\nAll four points addressed in 9dc07b4:\n\n1. **Read-only cloud vs AC-4..AC-10 mutation gap:** S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.\n\n2. **Interface/auth drift:** S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.\n\n3. **Missing PUBLIC_NO_INDEX branch:** S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.\n\n4. **Residual: getServerSideProps vs App Router:** S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4227097411,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:43Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4092717329</p>\n</blockquote>\n<p dir=\"auto\">All four points addressed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>:</p>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><strong>Read-only cloud vs AC-4..AC-10 mutation gap:</strong> S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Interface/auth drift:</strong> S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Missing PUBLIC_NO_INDEX branch:</strong> S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Residual: getServerSideProps vs App Router:</strong> S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.</p>\n</li>\n</ol>"}],"url":"https://github.com/CS485-Harmony/Harmony/pull/315","title":"CS485-Harmony/Harmony PR #315 comments","display_url":"https://github.com/CS485-Harmony/Harmony/pull/315","display_title":"CS485-Harmony/Harmony PR #315 comments"}
```

#### Tool: exec_command

```sh
gh pr view 315 --repo CS485-Harmony/Harmony --comments
```

Output:

```text
author:	vercel
association:	none
edited:	true
status:	none
--
[vc]: #BzXVz5sHWXMWJF3KzBoBsJKiCgjuW/7CcBvltNVNAAY=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255L0RIUzdVb01xUDMxY3g5MjZuYmJ5QmJaYmY4TEwiLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19
The latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).

| Project | Deployment | Actions | Updated (UTC) |
| :--- | :----- | :------ | :------ |
| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/DHS7UoMqP31cx926nbbyBbZbf8LL) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 9:58pm |


--
author:	copilot-pull-request-reviewer
association:	contributor
edited:	false
status:	commented
--
## Pull request overview

Adds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.

**Changes:**
- Add `planning/FINAL_PROJECT_SPRINT_PLAN.md` detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.
- Add a new LLM session log stub under `llm-logs/`.

### Reviewed changes

Copilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.

| File | Description |
| ---- | ----------- |
| planning/FINAL_PROJECT_SPRINT_PLAN.md | New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3 |
| llm-logs/2026-04-09-184230-session-c9f15ca0.md | Adds a minimal session-log header entry |





---

💡 <a href="/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.
--
author:	acabrera04
association:	member
edited:	false
status:	changes requested
--
- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.
- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.
- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.
- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.
- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.
- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.
- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.
- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.

1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.

2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.

3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.

Residual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.

--
author:	AvanishKulkarni
association:	member
edited:	false
status:	none
--
> Re: comment 4092717329

All four points addressed in 9dc07b4:

1. **Read-only cloud vs AC-4..AC-10 mutation gap:** S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.

2. **Interface/auth drift:** S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.

3. **Missing PUBLIC_NO_INDEX branch:** S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.

4. **Residual: getServerSideProps vs App Router:** S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.
--
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:16:33.867Z

The previous blockers were addressed in the new commit. I’m doing one more pass over the updated plan for any remaining spec drift before I post either approval or a new blocking review.

#### Tool: exec_command

```sh
rtk git fetch https://github.com/CS485-Harmony/Harmony.git sprint-5-final-project-plan
```

Output:

```text
ok fetched (1 new refs)
```

#### Tool: exec_command

```sh
rtk git show 9dc07b41974e29037501159dbcc6a06b39512235:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '1,260p;260,430p'
```

Output:

```text
fatal: path 'planning/FINAL_PROJECT_SPRINT_PLAN.md' does not exist in '9dc07b41974e29037501159dbcc6a06b39512235'
```

#### Tool: exec_command

```sh
rtk grep -n "server admins|/api/admin/channels|PUBLIC_NO_INDEX|generateMetadata|staging environment|local-only evidence|FINAL_SUBMISSION|llm-logs|tasks/todo.md" docs/dev-spec-seo-meta-tag-generation.md docs/dev-spec-channel-visibility-toggle.md planning/SPRINT_4_PLAN.md
```

Output:

```text
🔍 24 in 3F:

📄 docs/dev-spec-channel-visibility-toggle.md (10):
   337: state "PUBLIC_NO_INDEX (indexedAt=null, robots=noindex)" as PUBLIC_NO_INDEX
   340: PRIVATE --> PUBLIC_NO_INDEX : setVisibility(PUBLIC_NO_INDEX)
   343: PUBLIC_NO_INDEX --> PRIVATE : setVisibility(PRIVATE)
   344: PUBLIC_NO_INDEX --> PUBLIC_INDEXABLE : setVisibility(PUBLIC_INDEXABLE) - add ...
   347: PUBLIC_INDEXABLE --> PUBLIC_NO_INDEX : setVisibility(PUBLIC_NO_INDEX) - remov...
   448: F212["F2.12 Set X-Robots-Tag header\nPUBLIC_INDEXABLE → index,follow\nPUBLIC_...
   842: enum: [PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE]
   872: | `PUBLIC_NO_INDEX` | Update meta tags (add noindex) | Keep guest view cache ...
   906: CREATE TYPE visibility_enum AS ENUM ('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', '...
   923: WHERE visibility IN ('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX');

📄 docs/dev-spec-seo-meta-tag-generation.md (13):
   970: | `VISIBILITY_CHANGED` where `newVisibility = PUBLIC_NO_INDEX` | `B0 → B3 (Qu...
  1440: **Scenario Description:** A channel transitions from `PUBLIC_INDEXABLE` or `P...
  1461: │ (e.g., PUBLIC_NO_INDEX  │     │ Server.MetaTagService.        │
  1500: < PUBLIC_NO_INDEX?              >
  1776: **Scenario Description:** A channel transitions from `PRIVATE` to `PUBLIC_IND...
  1797: │ Server.MetaTagRepository.    │            │ PUBLIC_NO_INDEX               │...
  1807: │ [F8.7] Generate      │  │ [F8.8] Force     │ │ PUBLIC_NO_INDEX →           ...
  1845: │   addUrl(channelUrl)          │  │ PUBLIC_NO_INDEX channels      │
  2617: | `PUBLIC_NO_INDEX` | `channelId`, `oldVisibility`, `newVisibility`, `actorId...
  2629: /api/admin/channels/{channelId}/meta-tags:
  +3

📄 planning/SPRINT_4_PLAN.md (1):
    77: - **Cloud test data hygiene:** cloud-target validation uses **read-only smoke...

... +3
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:16:46.597Z

I’ve confirmed the new head SHA; the remaining step is just reading the current PR file from `FETCH_HEAD` and checking for any new mismatches introduced during the fixes.

#### Tool: exec_command

```sh
rtk git rev-parse FETCH_HEAD
```

Output:

```text
9dc07b41974e29037501159dbcc6a06b39512235
```

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:planning/FINAL_PROJECT_SPRINT_PLAN.md | nl -ba | sed -n '1,430p'
```

Output:

````text
     1	# Final Project Sprint Plan — April 10 – May 3, 2026
     2	
     3	## Context
     4	This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:
     5	
     6	- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.
     7	- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.
     8	
     9	Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered "done" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.
    10	
    11	## Team
    12	5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI
    13	
    14	---
    15	
    16	## Sprint 4 — Deployment (April 10–19)
    17	
    18	Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.
    19	
    20	### Sprint 4 exit criteria (must be true before Sprint 5 starts)
    21	- Public Vercel frontend URL live on the apex domain
    22	- Public Railway backend URL live on `api.<frontend-domain>`
    23	- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton
    24	- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production
    25	- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations
    26	- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green
    27	- Branch protection on `main` with required checks
    28	- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current
    29	- README updated for user-facing and deployer-facing instructions
    30	- P6 submission package assembled (links, logs, reflection, LLM logs)
    31	
    32	### Sprint 4 key dates
    33	| Date | Milestone |
    34	|------|-----------|
    35	| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |
    36	| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |
    37	| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |
    38	| Apr 16 (Thu) | Branch protection enabled (#13) |
    39	| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |
    40	| Apr 19 (Sun) | P6 submission package complete (#15) |
    41	
    42	---
    43	
    44	## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)
    45	
    46	### Goal
    47	Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.
    48	
    49	### Scope anchor
    50	Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`
    51	- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)
    52	- Classes C1.1–C6.x per §3 / §4
    53	- APIs / public interfaces per §9 / §10
    54	- Acceptance criteria AC-1 through AC-10 per §14
    55	
    56	### Sprint 5 guardrails
    57	- All work on feature branches with PR review (branch protection is live from Sprint 4)
    58	- Every PR must pass `run-integration-tests` + unit workflows before merge
    59	- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only
    60	- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory
    61	- All destructive schema changes follow the expand/contract convention established in Sprint 4
    62	
    63	---
    64	
    65	### Phase A — SEO backend core (April 20–23)
    66	
    67	**S1. Meta tag generation service skeleton (M2)**
    68	- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGenerator` (CL-C2.5), and `MetaTagCache` per dev spec §3/§4
    69	- Wire Redis-backed `MetaTagCache` with configurable TTL
    70	- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)
    71	- Acceptance criteria:
    72	  - Classes C2.1–C2.6 exist with the method signatures named in dev spec §3/§4
    73	  - `TitleGenerator` enforces ≤60 char auto-generated titles; `DescriptionGenerator` enforces 50–160 char auto-generated descriptions (AC-2)
    74	  - `MetaTagCache` is backed by Redis (not process memory) and honors a configurable TTL
    75	  - On NLP/timeout failure, `MetaTagService` returns fallback tags and flags `needsRegeneration=true` (AC-9)
    76	  - Unit tests cover template application, length limits, sanitization, and fallback paths and pass in CI
    77	- Assignee: **declanblanc**
    78	- Backup: **acabrera04**
    79	- Due: Apr 22
    80	- Blocked by: Sprint 4 exit criteria
    81	
    82	**S2. Content analysis module (M3)**
    83	- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`
    84	- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout
    85	- Unit tests covering keyword extraction, summarization, and fallback paths
    86	- Acceptance criteria:
    87	  - Classes C3.1–C3.4 exist with the method signatures named in dev spec §3/§4
    88	  - `ContentAnalyzer.analyzeThread()` returns keywords, summary, and topic category for a fixture thread
    89	  - Deterministic fallback returns a valid (non-null) result within the configured timeout budget when the NLP path is stubbed to fail
    90	  - Unit tests cover stop-word filtering, frequency scoring, summarization, topic classification, and timeout/fallback paths
    91	- Assignee: **Aiden-Barrera**
    92	- Backup: **declanblanc**
    93	- Due: Apr 22
    94	- Blocked by: none (parallel with S1)
    95	
    96	**S3. Data schema + persistence for meta tag overrides (§11)**
    97	- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11
    98	- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas
    99	- Custom overrides must never be overwritten by background regeneration (AC-7)
   100	- Acceptance criteria:
   101	  - Prisma migration adds all fields in dev spec §11 and applies cleanly via the single Sprint 4 migration runner
   102	  - Migration is expand-only (no destructive drops) so it coexists with old `backend-api` replicas during rolling restart
   103	  - Persistence layer enforces that a background regeneration write cannot overwrite a non-null `customTitle` or `customDescription` (AC-7), verified by an integration test
   104	  - Schema is documented in `docs/deployment/deployment-architecture.md` or the SEO dev spec appendix
   105	- Assignee: **FardeenI**
   106	- Backup: **AvanishKulkarni**
   107	- Due: Apr 22
   108	- Blocked by: Sprint 4 migration-runner ownership
   109	
   110	**S4. Admin REST endpoints (§9, §10)**
   111	- Implement the admin-only meta-tag endpoints exactly as defined in dev spec §9/§10:
   112	  - `GET /api/admin/channels/{channelId}/meta-tags`
   113	  - `PUT /api/admin/channels/{channelId}/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)
   114	  - `POST /api/admin/channels/{channelId}/meta-tags/jobs` returning `jobId` with idempotency key (AC-5, AC-6)
   115	  - `GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` status polling
   116	- Authorization is **server admin only** per dev spec §12 ("Only server admins can set custom meta tags"). Channel creators/owners without the server-admin role must not reach these endpoints.
   117	- API integration tests for each endpoint
   118	- Acceptance criteria:
   119	  - All four endpoints are mounted under `/api/admin/channels/...` matching dev spec §9 paths exactly
   120	  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)
   121	  - `POST .../jobs` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)
   122	  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)
   123	  - All endpoints enforce server-admin authorization; non-admins (including channel creators without admin role) get 403
   124	  - Supertest integration tests cover success, validation failure, non-admin rejection, and idempotency
   125	- Assignee: **FardeenI**
   126	- Due: Apr 23
   127	- Blocked by: S1, S3
   128	
   129	---
   130	
   131	### Phase B — Background processing + visibility lifecycle (April 22–25)
   132	
   133	**S5. Background meta tag update worker (M4) on `backend-worker`**
   134	- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration
   135	- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus
   136	- Worker must run as singleton only (enforced by Sprint 4 topology)
   137	- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline
   138	- Acceptance criteria:
   139	  - `MetaTagUpdateWorker` runs only inside the `backend-worker` process; `backend-api` replicas do not subscribe to regeneration events
   140	  - Worker consumes `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events and schedules regeneration jobs
   141	  - Debounce/batch window collapses repeated events for the same channel into a single regeneration job within the configured window
   142	  - Worker restart does not duplicate in-flight jobs (job queue dedupes by channel + idempotency key)
   143	  - Integration test simulates burst traffic and asserts a single regeneration job is produced per debounce window
   144	- Assignee: **Aiden-Barrera**
   145	- Backup: **declanblanc**
   146	- Due: Apr 24
   147	- Blocked by: S1, S2
   148	
   149	**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**
   150	- Handle all three branches of the `VISIBILITY_CHANGED` event per dev spec §6 flow F8 and §9.1 cross-spec visibility contract:
   151	  - `→ PRIVATE`: invalidate `MetaTagCache` (`meta:channel:{channelId}`), purge CDN, remove sitemap URL, request search-engine removal; never serve stale tags while private
   152	  - `→ PUBLIC_NO_INDEX`: regenerate tags with `robots=noindex`, invalidate cache, keep channel publicly reachable but exclude from indexable sitemap set
   153	  - `→ PUBLIC_INDEXABLE`: high-priority regeneration, invalidate cache, keep canonical URL in sitemap with refreshed `lastmod`
   154	- Integration tests covering all three directions and cache/sitemap side effects
   155	- Acceptance criteria:
   156	  - `PUBLIC_INDEXABLE → PRIVATE` invalidates the `MetaTagCache` entry and removes the URL from the sitemap within one regeneration cycle (AC-4, AC-10)
   157	  - `PUBLIC_INDEXABLE → PUBLIC_NO_INDEX` regenerates with `robots=noindex`, invalidates cache, and removes the channel from the indexable sitemap set while the page remains publicly reachable
   158	  - `PRIVATE → PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX → PUBLIC_INDEXABLE` re-enqueue high-priority regeneration and the channel (re)appears in the sitemap
   159	  - Subsequent SSR requests return `noindex` meta where required and 404/403 public body for PRIVATE
   160	  - End-to-end integration test covers the full `PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE` matrix and asserts cache + sitemap state at each step
   161	- Assignee: **declanblanc**
   162	- Due: Apr 25
   163	- Blocked by: S5
   164	
   165	**S7. Security + content filtering (§12, AC-8)**
   166	- PII and profanity filters on generated titles/descriptions
   167	- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`
   168	- Unit tests with fixture content covering PII/profanity/XSS
   169	- Acceptance criteria:
   170	  - Generated tags for the PII/profanity fixture corpus contain no flagged content (AC-8)
   171	  - HTML/attribute injection attempts in `customTitle`/`customDescription` are escaped or rejected on write and on render
   172	  - `<head>` output for a crafted XSS fixture passes a snapshot test showing escaped output
   173	  - Filter behavior is covered by unit tests and documented in `docs/dev-spec-seo-meta-tag-generation.md` §12 cross-reference
   174	- Assignee: **AvanishKulkarni**
   175	- Backup: **Aiden-Barrera**
   176	- Due: Apr 25
   177	- Blocked by: S1
   178	
   179	---
   180	
   181	### Phase C — Frontend rendering + SEO surface (April 23–27)
   182	
   183	**S8. `PublicChannelPage` + `generateMetadata` integration (M1)**
   184	- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`
   185	- Use the Next.js **App Router** `generateMetadata` export in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx` (already scaffolded) to fetch tags from the backend at request time; JSON-LD is injected via a component in `page.tsx` since `Metadata` doesn't cover structured data
   186	- Use App Router route handlers / metadata routes (`app/sitemap.ts`, `app/robots.ts`) for crawler-facing entrypoints — do **not** introduce `getServerSideProps` or `pages/` router code
   187	- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain
   188	- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name="description">` (AC-1)
   189	- Acceptance criteria:
   190	  - Every public channel page SSR-renders non-empty `<title>` and `<meta name="description">` for the fixture corpus (AC-1)
   191	  - Open Graph, Twitter card, and JSON-LD `DiscussionForumPosting` tags are present and validate against Google Rich Results test
   192	  - Canonical URL is the frontend apex domain; no `<link rel="canonical">` or sitemap URL points at the API subdomain
   193	  - Meta tag fetch uses the backend API at request time and degrades to template fallback if the backend is unreachable
   194	  - E2E test (Playwright or crawler UA fetch) asserts tags on at least 3 representative public channels
   195	- Assignee: **declanblanc**
   196	- Due: Apr 26
   197	- Blocked by: S4, Sprint 4 #6 (frontend prod config)
   198	
   199	**S9. Sitemap + robots.txt finalization**
   200	- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain
   201	- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility
   202	- Smoke test that private channels do not appear in sitemap
   203	- Acceptance criteria:
   204	  - `https://<frontend-apex>/sitemap.xml` and `https://<frontend-apex>/robots.txt` resolve on the frontend apex domain (not the API subdomain)
   205	  - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `PRIVATE` channels are excluded
   206	  - Channels flipped to `PRIVATE` disappear from sitemap on the next regeneration cycle
   207	  - `robots.txt` allows crawling of public paths and disallows non-public areas
   208	  - Smoke test asserts sitemap exclusion behavior for a fixture private channel
   209	- Assignee: **AvanishKulkarni**
   210	- Backup: **FardeenI**
   211	- Due: Apr 27
   212	- Blocked by: S6, S8
   213	
   214	**S10. Meta tag admin UI (server-admin override flow)**
   215	- UI under server/channel admin settings for **server admins** to view generated tags, override title/description, and trigger manual regeneration with job status polling. Authorization matches dev spec §12: only server admins can set custom meta tags.
   216	- Respect `customTitle`/`customDescription` length limits with client-side validation
   217	- Talks to the admin endpoints from S4 (`/api/admin/channels/{channelId}/meta-tags` and `.../jobs/{jobId}`)
   218	- Acceptance criteria:
   219	  - Admin settings page exposes a "SEO Preview" section showing current generated + override values
   220	  - A server admin can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules
   221	  - A server admin can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`
   222	  - Non-admin users (including channel creators without the admin role) do not see the override UI
   223	  - Frontend unit tests cover validation, submit, job polling, and admin-vs-non-admin rendering
   224	- Assignee: **acabrera04**
   225	- Backup: **declanblanc**
   226	- Due: Apr 27
   227	- Blocked by: S4
   228	
   229	---
   230	
   231	### Phase D — End-to-end verification on production (April 27–30)
   232	
   233	**S11. Integration tests for SEO feature (local + cloud + isolated staging)**
   234	- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10
   235	- Split AC coverage by execution target so the read-only cloud rule from Sprint 4 is not violated:
   236	  - **Read-only paths against production deployed URLs:** AC-1 (tags present), AC-2 (length bounds on already-generated tags), AC-8 (no PII/profanity in fixture-safe public channels), and any AC that only needs fetch-and-assert
   237	  - **Write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10):** run against an **isolated staging environment** provisioned for Sprint 5 (separate Railway project/environment + isolated Postgres + isolated Redis + dedicated Vercel preview) so visibility flips, regeneration jobs, override persistence, and fallback injection never touch the instructor-reviewed production dataset
   238	  - `local` mode still runs the full AC-1..AC-10 matrix deterministically on seeded data and remains the CI source of truth
   239	- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)
   240	- Acceptance criteria:
   241	  - Test cases exist and are traceable one-to-one to AC-1 through AC-10 in dev spec §14
   242	  - Suite runs in `local` mode via `run-integration-tests.yml` and passes on PR with full AC-1..AC-10 coverage
   243	  - Read-only cloud mode runs against production URLs and does not mutate production data
   244	  - Write-path AC coverage runs against a documented isolated staging environment, documented alongside the Sprint 4 isolation rules in `docs/deployment/deployment-architecture.md`
   245	  - Crawler-UA fetches (`User-Agent: Googlebot`) of at least 3 public channels return non-empty `<title>`/`<meta name="description">` and valid JSON-LD
   246	  - Test output is captured as an artifact for submission evidence
   247	  - If the isolated staging environment cannot be provisioned in time, write-path ACs fall back to `local` evidence and the limitation is explicitly documented in the submission reflection
   248	- Assignee: **Aiden-Barrera**
   249	- Due: Apr 29
   250	- Blocked by: S8, S9, S10
   251	
   252	**S12. Deployed validation + evidence capture**
   253	- Run the read-only cloud portion of the SEO suite against the deployed production Vercel + Railway stack and the write-path portion against the isolated staging environment provisioned in S11
   254	- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, and visibility-driven sitemap/`noindex` behavior works across `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`
   255	- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch
   256	- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission
   257	- Acceptance criteria:
   258	  - Read-only cloud tests pass against the deployed production stack without mutating production data
   259	  - Write-path tests pass against the isolated staging stack
   260	  - Evidence bundle exists under `docs/submission/seo-evidence/` containing: crawler-view HTML, Rich Results test screenshots, replica-identity headers from at least two distinct `backend-api` replicas, and a cache-hit log sample
   261	  - Visibility transitions for all three states (`PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE`) are verified and captured as evidence (AC-4, AC-10)
   262	  - Tag output is identical across both API replicas for the same channel within one cache TTL
   263	  - Every AC-1..AC-10 item has at least one linked piece of evidence in the bundle, with the target environment (production / staging / local) labeled
   264	  - Any AC for which only `local` evidence exists is flagged explicitly in the bundle and the reflection
   265	- Assignee: **declanblanc**
   266	- Backup: **Aiden-Barrera**
   267	- Due: Apr 30
   268	- Blocked by: S11
   269	
   270	**S13. Bug bash + polish**
   271	- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime
   272	- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`
   273	- Fix must-fix items only; document the rest in the reflection
   274	- Acceptance criteria:
   275	  - Each developer logs at least one bug-bash session against the deployed stack and files GitHub issues for findings
   276	  - Every finding is triaged with a label (`must-fix-for-submission` or `known-limitation`)
   277	  - All `must-fix-for-submission` issues are merged to `main` and redeployed before S15 starts
   278	  - `known-limitation` issues are summarized in the reflection document
   279	  - Post-bash smoke run of the cloud integration suite is green
   280	- Assignee: **whole team**, coordinator: **FardeenI**
   281	- Due: May 1
   282	- Blocked by: S12
   283	
   284	---
   285	
   286	### Phase E — Final submission package (May 1–3)
   287	
   288	**S14. README + deployer guide final pass**
   289	- Fold SEO feature usage, override flow, and regeneration behavior into README
   290	- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)
   291	- Acceptance criteria:
   292	  - README documents: how to view generated SEO tags, how a server admin overrides them, and how regeneration is triggered
   293	  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value
   294	  - README links to the deployed frontend URL, backend URL, and submission evidence bundle
   295	  - A fresh contributor can follow README instructions to run the app locally and see SEO tags on a public channel
   296	- Assignee: **acabrera04**
   297	- Due: May 2
   298	- Blocked by: S10
   299	
   300	**S15. Final project submission package**
   301	- Compile final deliverable checklist:
   302	  - Public frontend URL + public backend URL (from Sprint 4)
   303	  - Links to every dev spec document under `docs/`
   304	  - Links to SEO feature PRs and commits
   305	  - Integration test specs + code + local/cloud run output
   306	  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)
   307	  - Branch protection screenshot
   308	  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)
   309	  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)
   310	  - LLM interaction logs under `llm-logs/` with model/version labels
   311	- Acceptance criteria:
   312	  - Every checklist item above has a resolved link or committed artifact (no TBDs)
   313	  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README
   314	  - All AC-1..AC-10 items map to evidence produced in S12
   315	  - Each developer is named against at least one deliverable in the contributions section
   316	  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD
   317	- Assignee: **acabrera04**
   318	- Backup: **FardeenI**
   319	- Due: May 3
   320	- Blocked by: S12, S13, S14
   321	
   322	**S16. Final reflection + retrospective**
   323	- Team retrospective on the full project (Sprints 1–5)
   324	- Each developer contributes a short written reflection to the submission doc
   325	- Acceptance criteria:
   326	  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)
   327	  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change
   328	  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off
   329	  - Known limitations from S13 are captured in the reflection with mitigation notes
   330	- Assignee: **whole team**, coordinator: **declanblanc**
   331	- Due: May 3
   332	- Blocked by: S15 draft
   333	
   334	---
   335	
   336	## Sprint 5 assignment summary
   337	
   338	| Developer | Issues | Focus |
   339	|-----------|--------|-------|
   340	| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |
   341	| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |
   342	| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |
   343	| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |
   344	| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |
   345	
   346	## Sprint 5 critical path
   347	
   348	```text
   349	S1 Meta tag service  ─┐
   350	S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐
   351	S3 Schema/migration  ─┘                           │
   352	                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission
   353	S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘
   354	S7 Security (needs S1) ──────────────────────────►
   355	S9 Sitemap (needs S6, S8) ───────────────────────►
   356	S10 Override UI (needs S4) ──────────────────────►
   357	                                                   S14 README (needs S10) ─► S15
   358	                                                   S16 Retrospective (parallel)
   359	```
   360	
   361	## Sprint 5 timeline
   362	
   363	| Date | Milestone |
   364	|------|-----------|
   365	| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |
   366	| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |
   367	| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |
   368	| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |
   369	| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |
   370	| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |
   371	| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |
   372	| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |
   373	| May 1 (Fri) | S13 bug bash complete; must-fix items merged |
   374	| May 2 (Sat) | S14 README final pass merged |
   375	| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |
   376	
   377	## Sprint 5 deliverables checklist
   378	
   379	The project is not complete until all of the following exist:
   380	
   381	- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against the deployed Vercel + Railway stack
   382	- SEO meta tag generation service, content analysis, background worker, overrides API, and frontend SSR integration merged to `main`
   383	- Creator override UI shipped
   384	- Sitemap and robots.txt correctly respect channel visibility
   385	- Cloud + local integration tests covering SEO paths passing in CI
   386	- Production validation evidence: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation
   387	- README updated for SEO feature and any new env vars
   388	- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection
   389	- LLM interaction logs archived under `llm-logs/`
   390	- Team retrospective recorded
   391	
   392	## Notes
   393	
   394	- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).
   395	- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.
   396	- Cloud-mode tests remain read-only throughout Sprint 5 to protect the instructor-reviewed deployment.
   397	- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.
````

#### Tool: exec_command

```sh
rtk git show FETCH_HEAD:llm-logs/2026-04-09-184230-session-c9f15ca0.md | nl -ba | sed -n '1,40p'
```

Output:

```text
     1	# Session Log 2026-04-09-184230
     2
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:17:00.035Z

The main sections are fixed, but the bottom-line deliverables checklist still has two stale statements from the old version. I’m anchoring those exact lines now and then I’ll post a smaller follow-up review instead of repeating the earlier points.

#### Tool: exec_command

```sh
gh pr diff 315 --repo CS485-Harmony/Harmony -- planning/FINAL_PROJECT_SPRINT_PLAN.md | sed -n '360,395p'
```

Output:

```text
accepts at most 1 arg(s), received 2
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:17:14.954Z

I’ve narrowed it to two stale checklist lines near the end of the plan. Everything else I flagged earlier appears addressed. I’m posting a short follow-up `REQUEST_CHANGES` review that only calls out those remaining inconsistencies.

#### Tool: exec_command

```sh
cat > /tmp/pr315-rereview.md <<'EOF'
- [ ] **Prioritize Logic over Style:** Most of the earlier planning defects are fixed, but the final deliverables checklist still contains stale acceptance language that conflicts with the corrected task definitions.
- [ ] **Security First:** The implementation sections now correctly scope overrides to server admins, but the deliverables checklist still says a creator override UI must ship, which reintroduces auth ambiguity.
- [ ] **Architectural Alignment:** S4/S10/S11/S12 were updated to match the specs, but the bottom-line completion criteria still reflect the old creator-auth and production-only verification model.
- [ ] **Issue Completion:** The checklist at the end still overstates what must be verified specifically on the deployed production stack, even though S11/S12 now intentionally split evidence across production, staging, and local.
- [x] **No Nitpicking:** Feedback is limited to remaining correctness and consistency gaps in the plan.
- [x] **Avoid Repetition:** I am only calling out stale checklist language that remains after the previous issues were fixed.
- [x] **Iterative Reviews:** I re-checked the updated head and confirmed the earlier S4/S6/S8/S10/S11/S12 concerns were addressed before writing this follow-up.
- [x] **Prevent CI Failures:** This is still a docs-only PR; the risk is incorrect implementation guidance, not immediate pipeline breakage.

1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:381` still says all AC-1..AC-10 must be verified against the deployed Vercel + Railway stack. That conflicts with the corrected S11/S12 plan, which now intentionally splits evidence across production, isolated staging, and in some fallback cases local-only evidence. As written, the final checklist silently reintroduces the same impossible production-only gate the rest of the document just fixed.

2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:383` still says "Creator override UI shipped," but S4 and S10 were correctly changed to a server-admin-only override model. Leaving "creator" in the deliverables checklist makes the acceptance target inconsistent with the plan’s actual auth contract.
EOF

gh pr review 315 --repo CS485-Harmony/Harmony --request-changes --body-file /tmp/pr315-rereview.md
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:17:28.332Z

Posted a follow-up `REQUEST_CHANGES` review on PR `#315`.

The earlier blockers are fixed. The new review only calls out the two stale checklist lines that still contradict the corrected plan:
- the final checklist still says all ACs must be verified on the deployed production stack
- the final checklist still says “Creator override UI” even though the plan now correctly scopes overrides to server admins

### Turn 7: review again and

#### 👤 User Prompt

- Time: 2026-04-10T22:19:27.407Z

```text
review again and post
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:19:42.861Z

Re-reviewing PR `#315` from the current head. I’m checking the latest diff against the remaining review comments, then I’ll post an approval or another blocking review and resolve any addressed threads I can.

#### Tool: mcp__codex_apps__github_fetch_pr

```json
{
  "pr_number": 315,
  "repo_full_name": "CS485-Harmony/Harmony"
}
```

Output:

````text
{"pull_request":{"url":"https://github.com/CS485-Harmony/Harmony/pull/315","number":315,"state":"open","merged":false,"mergeable":true,"draft":false,"body":"## Summary\n- Stacks on top of #311 (Sprint 4 deployment plan)\n- Adds `planning/FINAL_PROJECT_SPRINT_PLAN.md` covering Apr 10 – May 3\n- Sprint 5 (Apr 20 – May 3): 16 issues across 5 phases to finish SEO meta tag generation feature, validate on deployed stack, run bug bash, and deliver final submission package\n\n## Test plan\n- [ ] Review phase breakdown and owner assignments\n- [ ] Confirm Sprint 4 exit criteria align with #311 scope\n- [ ] Confirm AC-1..AC-10 coverage maps to dev spec §14\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","title":"Add Sprint 5 final project plan through May 3","base":"codex/sprint-4-deployment-plan","base_sha":"faba6e20e895363aa8a866c01cdb25436e6a3cef","head":"sprint-5-final-project-plan","head_sha":"fc567b5478e37984564e23fd3579e32cb0ac9ce8","merge_commit_sha":"4b9990e03d70704f37547c6dfcb29234511ec6ba","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"requested_reviewers":null,"diff":"@@ -0,0 +1,2 @@\n+# Session Log 2026-04-09-184230\n+\n@@ -0,0 +1,397 @@\n+# Final Project Sprint Plan — April 10 – May 3, 2026\n+\n+## Context\n+This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:\n+\n+- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.\n+- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.\n+\n+Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered \"done\" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.\n+\n+## Team\n+5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI\n+\n+---\n+\n+## Sprint 4 — Deployment (April 10–19)\n+\n+Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.\n+\n+### Sprint 4 exit criteria (must be true before Sprint 5 starts)\n+- Public Vercel frontend URL live on the apex domain\n+- Public Railway backend URL live on `api.<frontend-domain>`\n+- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton\n+- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production\n+- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations\n+- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green\n+- Branch protection on `main` with required checks\n+- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current\n+- README updated for user-facing and deployer-facing instructions\n+- P6 submission package assembled (links, logs, reflection, LLM logs)\n+\n+### Sprint 4 key dates\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |\n+| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |\n+| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |\n+| Apr 16 (Thu) | Branch protection enabled (#13) |\n+| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |\n+| Apr 19 (Sun) | P6 submission package complete (#15) |\n+\n+---\n+\n+## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)\n+\n+### Goal\n+Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.\n+\n+### Scope anchor\n+Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`\n+- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)\n+- Classes C1.1–C6.x per §3 / §4\n+- APIs / public interfaces per §9 / §10\n+- Acceptance criteria AC-1 through AC-10 per §14\n+\n+### Sprint 5 guardrails\n+- All work on feature branches with PR review (branch protection is live from Sprint 4)\n+- Every PR must pass `run-integration-tests` + unit workflows before merge\n+- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only\n+- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory\n+- All destructive schema changes follow the expand/contract convention established in Sprint 4\n+\n+---\n+\n+### Phase A — SEO backend core (April 20–23)\n+\n+**S1. Meta tag generation service skeleton (M2)**\n+- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGenerator` (CL-C2.5), and `MetaTagCache` per dev spec §3/§4\n+- Wire Redis-backed `MetaTagCache` with configurable TTL\n+- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)\n+- Acceptance criteria:\n+  - Classes C2.1–C2.6 exist with the method signatures named in dev spec §3/§4\n+  - `TitleGenerator` enforces ≤60 char auto-generated titles; `DescriptionGenerator` enforces 50–160 char auto-generated descriptions (AC-2)\n+  - `MetaTagCache` is backed by Redis (not process memory) and honors a configurable TTL\n+  - On NLP/timeout failure, `MetaTagService` returns fallback tags and flags `needsRegeneration=true` (AC-9)\n+  - Unit tests cover template application, length limits, sanitization, and fallback paths and pass in CI\n+- Assignee: **declanblanc**\n+- Backup: **acabrera04**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 exit criteria\n+\n+**S2. Content analysis module (M3)**\n+- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`\n+- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout\n+- Unit tests covering keyword extraction, summarization, and fallback paths\n+- Acceptance criteria:\n+  - Classes C3.1–C3.4 exist with the method signatures named in dev spec §3/§4\n+  - `ContentAnalyzer.analyzeThread()` returns keywords, summary, and topic category for a fixture thread\n+  - Deterministic fallback returns a valid (non-null) result within the configured timeout budget when the NLP path is stubbed to fail\n+  - Unit tests cover stop-word filtering, frequency scoring, summarization, topic classification, and timeout/fallback paths\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 22\n+- Blocked by: none (parallel with S1)\n+\n+**S3. Data schema + persistence for meta tag overrides (§11)**\n+- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11\n+- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas\n+- Custom overrides must never be overwritten by background regeneration (AC-7)\n+- Acceptance criteria:\n+  - Prisma migration adds all fields in dev spec §11 and applies cleanly via the single Sprint 4 migration runner\n+  - Migration is expand-only (no destructive drops) so it coexists with old `backend-api` replicas during rolling restart\n+  - Persistence layer enforces that a background regeneration write cannot overwrite a non-null `customTitle` or `customDescription` (AC-7), verified by an integration test\n+  - Schema is documented in `docs/deployment/deployment-architecture.md` or the SEO dev spec appendix\n+- Assignee: **FardeenI**\n+- Backup: **AvanishKulkarni**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 migration-runner ownership\n+\n+**S4. Admin REST endpoints (§9, §10)**\n+- Implement the admin-only meta-tag endpoints exactly as defined in dev spec §9/§10:\n+  - `GET /api/admin/channels/{channelId}/meta-tags`\n+  - `PUT /api/admin/channels/{channelId}/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)\n+  - `POST /api/admin/channels/{channelId}/meta-tags/jobs` returning `jobId` with idempotency key (AC-5, AC-6)\n+  - `GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` status polling\n+- Authorization is **server admin only** per dev spec §12 (\"Only server admins can set custom meta tags\"). Channel creators/owners without the server-admin role must not reach these endpoints.\n+- API integration tests for each endpoint\n+- Acceptance criteria:\n+  - All four endpoints are mounted under `/api/admin/channels/...` matching dev spec §9 paths exactly\n+  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)\n+  - `POST .../jobs` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)\n+  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)\n+  - All endpoints enforce server-admin authorization; non-admins (including channel creators without admin role) get 403\n+  - Supertest integration tests cover success, validation failure, non-admin rejection, and idempotency\n+- Assignee: **FardeenI**\n+- Due: Apr 23\n+- Blocked by: S1, S3\n+\n+---\n+\n+### Phase B — Background processing + visibility lifecycle (April 22–25)\n+\n+**S5. Background meta tag update worker (M4) on `backend-worker`**\n+- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration\n+- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus\n+- Worker must run as singleton only (enforced by Sprint 4 topology)\n+- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline\n+- Acceptance criteria:\n+  - `MetaTagUpdateWorker` runs only inside the `backend-worker` process; `backend-api` replicas do not subscribe to regeneration events\n+  - Worker consumes `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events and schedules regeneration jobs\n+  - Debounce/batch window collapses repeated events for the same channel into a single regeneration job within the configured window\n+  - Worker restart does not duplicate in-flight jobs (job queue dedupes by channel + idempotency key)\n+  - Integration test simulates burst traffic and asserts a single regeneration job is produced per debounce window\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 24\n+- Blocked by: S1, S2\n+\n+**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**\n+- Handle all three branches of the `VISIBILITY_CHANGED` event per dev spec §6 flow F8 and §9.1 cross-spec visibility contract:\n+  - `→ PRIVATE`: invalidate `MetaTagCache` (`meta:channel:{channelId}`), purge CDN, remove sitemap URL, request search-engine removal; never serve stale tags while private\n+  - `→ PUBLIC_NO_INDEX`: regenerate tags with `robots=noindex`, invalidate cache, keep channel publicly reachable but exclude from indexable sitemap set\n+  - `→ PUBLIC_INDEXABLE`: high-priority regeneration, invalidate cache, keep canonical URL in sitemap with refreshed `lastmod`\n+- Integration tests covering all three directions and cache/sitemap side effects\n+- Acceptance criteria:\n+  - `PUBLIC_INDEXABLE → PRIVATE` invalidates the `MetaTagCache` entry and removes the URL from the sitemap within one regeneration cycle (AC-4, AC-10)\n+  - `PUBLIC_INDEXABLE → PUBLIC_NO_INDEX` regenerates with `robots=noindex`, invalidates cache, and removes the channel from the indexable sitemap set while the page remains publicly reachable\n+  - `PRIVATE → PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX → PUBLIC_INDEXABLE` re-enqueue high-priority regeneration and the channel (re)appears in the sitemap\n+  - Subsequent SSR requests return `noindex` meta where required and 404/403 public body for PRIVATE\n+  - End-to-end integration test covers the full `PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE` matrix and asserts cache + sitemap state at each step\n+- Assignee: **declanblanc**\n+- Due: Apr 25\n+- Blocked by: S5\n+\n+**S7. Security + content filtering (§12, AC-8)**\n+- PII and profanity filters on generated titles/descriptions\n+- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`\n+- Unit tests with fixture content covering PII/profanity/XSS\n+- Acceptance criteria:\n+  - Generated tags for the PII/profanity fixture corpus contain no flagged content (AC-8)\n+  - HTML/attribute injection attempts in `customTitle`/`customDescription` are escaped or rejected on write and on render\n+  - `<head>` output for a crafted XSS fixture passes a snapshot test showing escaped output\n+  - Filter behavior is covered by unit tests and documented in `docs/dev-spec-seo-meta-tag-generation.md` §12 cross-reference\n+- Assignee: **AvanishKulkarni**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 25\n+- Blocked by: S1\n+\n+---\n+\n+### Phase C — Frontend rendering + SEO surface (April 23–27)\n+\n+**S8. `PublicChannelPage` + `generateMetadata` integration (M1)**\n+- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`\n+- Use the Next.js **App Router** `generateMetadata` export in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx` (already scaffolded) to fetch tags from the backend at request time; JSON-LD is injected via a component in `page.tsx` since `Metadata` doesn't cover structured data\n+- Use App Router route handlers / metadata routes (`app/sitemap.ts`, `app/robots.ts`) for crawler-facing entrypoints — do **not** introduce `getServerSideProps` or `pages/` router code\n+- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain\n+- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name=\"description\">` (AC-1)\n+- Acceptance criteria:\n+  - Every public channel page SSR-renders non-empty `<title>` and `<meta name=\"description\">` for the fixture corpus (AC-1)\n+  - Open Graph, Twitter card, and JSON-LD `DiscussionForumPosting` tags are present and validate against Google Rich Results test\n+  - Canonical URL is the frontend apex domain; no `<link rel=\"canonical\">` or sitemap URL points at the API subdomain\n+  - Meta tag fetch uses the backend API at request time and degrades to template fallback if the backend is unreachable\n+  - E2E test (Playwright or crawler UA fetch) asserts tags on at least 3 representative public channels\n+- Assignee: **declanblanc**\n+- Due: Apr 26\n+- Blocked by: S4, Sprint 4 #6 (frontend prod config)\n+\n+**S9. Sitemap + robots.txt finalization**\n+- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain\n+- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility\n+- Smoke test that private channels do not appear in sitemap\n+- Acceptance criteria:\n+  - `https://<frontend-apex>/sitemap.xml` and `https://<frontend-apex>/robots.txt` resolve on the frontend apex domain (not the API subdomain)\n+  - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `PRIVATE` channels are excluded\n+  - Channels flipped to `PRIVATE` disappear from sitemap on the next regeneration cycle\n+  - `robots.txt` allows crawling of public paths and disallows non-public areas\n+  - Smoke test asserts sitemap exclusion behavior for a fixture private channel\n+- Assignee: **AvanishKulkarni**\n+- Backup: **FardeenI**\n+- Due: Apr 27\n+- Blocked by: S6, S8\n+\n+**S10. Meta tag admin UI (server-admin override flow)**\n+- UI under server/channel admin settings for **server admins** to view generated tags, override title/description, and trigger manual regeneration with job status polling. Authorization matches dev spec §12: only server admins can set custom meta tags.\n+- Respect `customTitle`/`customDescription` length limits with client-side validation\n+- Talks to the admin endpoints from S4 (`/api/admin/channels/{channelId}/meta-tags` and `.../jobs/{jobId}`)\n+- Acceptance criteria:\n+  - Admin settings page exposes a \"SEO Preview\" section showing current generated + override values\n+  - A server admin can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules\n+  - A server admin can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`\n+  - Non-admin users (including channel creators without the admin role) do not see the override UI\n+  - Frontend unit tests cover validation, submit, job polling, and admin-vs-non-admin rendering\n+- Assignee: **acabrera04**\n+- Backup: **declanblanc**\n+- Due: Apr 27\n+- Blocked by: S4\n+\n+---\n+\n+### Phase D — End-to-end verification on production (April 27–30)\n+\n+**S11. Integration tests for SEO feature (local + cloud + isolated staging)**\n+- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10\n+- Split AC coverage by execution target so the read-only cloud rule from Sprint 4 is not violated:\n+  - **Read-only paths against production deployed URLs:** AC-1 (tags present), AC-2 (length bounds on already-generated tags), AC-8 (no PII/profanity in fixture-safe public channels), and any AC that only needs fetch-and-assert\n+  - **Write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10):** run against an **isolated staging environment** provisioned for Sprint 5 (separate Railway project/environment + isolated Postgres + isolated Redis + dedicated Vercel preview) so visibility flips, regeneration jobs, override persistence, and fallback injection never touch the instructor-reviewed production dataset\n+  - `local` mode still runs the full AC-1..AC-10 matrix deterministically on seeded data and remains the CI source of truth\n+- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)\n+- Acceptance criteria:\n+  - Test cases exist and are traceable one-to-one to AC-1 through AC-10 in dev spec §14\n+  - Suite runs in `local` mode via `run-integration-tests.yml` and passes on PR with full AC-1..AC-10 coverage\n+  - Read-only cloud mode runs against production URLs and does not mutate production data\n+  - Write-path AC coverage runs against a documented isolated staging environment, documented alongside the Sprint 4 isolation rules in `docs/deployment/deployment-architecture.md`\n+  - Crawler-UA fetches (`User-Agent: Googlebot`) of at least 3 public channels return non-empty `<title>`/`<meta name=\"description\">` and valid JSON-LD\n+  - Test output is captured as an artifact for submission evidence\n+  - If the isolated staging environment cannot be provisioned in time, write-path ACs fall back to `local` evidence and the limitation is explicitly documented in the submission reflection\n+- Assignee: **Aiden-Barrera**\n+- Due: Apr 29\n+- Blocked by: S8, S9, S10\n+\n+**S12. Deployed validation + evidence capture**\n+- Run the read-only cloud portion of the SEO suite against the deployed production Vercel + Railway stack and the write-path portion against the isolated staging environment provisioned in S11\n+- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, and visibility-driven sitemap/`noindex` behavior works across `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`\n+- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch\n+- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission\n+- Acceptance criteria:\n+  - Read-only cloud tests pass against the deployed production stack without mutating production data\n+  - Write-path tests pass against the isolated staging stack\n+  - Evidence bundle exists under `docs/submission/seo-evidence/` containing: crawler-view HTML, Rich Results test screenshots, replica-identity headers from at least two distinct `backend-api` replicas, and a cache-hit log sample\n+  - Visibility transitions for all three states (`PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE`) are verified and captured as evidence (AC-4, AC-10)\n+  - Tag output is identical across both API replicas for the same channel within one cache TTL\n+  - Every AC-1..AC-10 item has at least one linked piece of evidence in the bundle, with the target environment (production / staging / local) labeled\n+  - Any AC for which only `local` evidence exists is flagged explicitly in the bundle and the reflection\n+- Assignee: **declanblanc**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 30\n+- Blocked by: S11\n+\n+**S13. Bug bash + polish**\n+- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime\n+- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`\n+- Fix must-fix items only; document the rest in the reflection\n+- Acceptance criteria:\n+  - Each developer logs at least one bug-bash session against the deployed stack and files GitHub issues for findings\n+  - Every finding is triaged with a label (`must-fix-for-submission` or `known-limitation`)\n+  - All `must-fix-for-submission` issues are merged to `main` and redeployed before S15 starts\n+  - `known-limitation` issues are summarized in the reflection document\n+  - Post-bash smoke run of the cloud integration suite is green\n+- Assignee: **whole team**, coordinator: **FardeenI**\n+- Due: May 1\n+- Blocked by: S12\n+\n+---\n+\n+### Phase E — Final submission package (May 1–3)\n+\n+**S14. README + deployer guide final pass**\n+- Fold SEO feature usage, override flow, and regeneration behavior into README\n+- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)\n+- Acceptance criteria:\n+  - README documents: how to view generated SEO tags, how a server admin overrides them, and how regeneration is triggered\n+  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value\n+  - README links to the deployed frontend URL, backend URL, and submission evidence bundle\n+  - A fresh contributor can follow README instructions to run the app locally and see SEO tags on a public channel\n+- Assignee: **acabrera04**\n+- Due: May 2\n+- Blocked by: S10\n+\n+**S15. Final project submission package**\n+- Compile final deliverable checklist:\n+  - Public frontend URL + public backend URL (from Sprint 4)\n+  - Links to every dev spec document under `docs/`\n+  - Links to SEO feature PRs and commits\n+  - Integration test specs + code + local/cloud run output\n+  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)\n+  - Branch protection screenshot\n+  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)\n+  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)\n+  - LLM interaction logs under `llm-logs/` with model/version labels\n+- Acceptance criteria:\n+  - Every checklist item above has a resolved link or committed artifact (no TBDs)\n+  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README\n+  - All AC-1..AC-10 items map to evidence produced in S12\n+  - Each developer is named against at least one deliverable in the contributions section\n+  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD\n+- Assignee: **acabrera04**\n+- Backup: **FardeenI**\n+- Due: May 3\n+- Blocked by: S12, S13, S14\n+\n+**S16. Final reflection + retrospective**\n+- Team retrospective on the full project (Sprints 1–5)\n+- Each developer contributes a short written reflection to the submission doc\n+- Acceptance criteria:\n+  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)\n+  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change\n+  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off\n+  - Known limitations from S13 are captured in the reflection with mitigation notes\n+- Assignee: **whole team**, coordinator: **declanblanc**\n+- Due: May 3\n+- Blocked by: S15 draft\n+\n+---\n+\n+## Sprint 5 assignment summary\n+\n+| Developer | Issues | Focus |\n+|-----------|--------|-------|\n+| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |\n+| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |\n+| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |\n+| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |\n+| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |\n+\n+## Sprint 5 critical path\n+\n+```text\n+S1 Meta tag service  ─┐\n+S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐\n+S3 Schema/migration  ─┘                           │\n+                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission\n+S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘\n+S7 Security (needs S1) ──────────────────────────►\n+S9 Sitemap (needs S6, S8) ───────────────────────►\n+S10 Override UI (needs S4) ──────────────────────►\n+                                                   S14 README (needs S10) ─► S15\n+                                                   S16 Retrospective (parallel)\n+```\n+\n+## Sprint 5 timeline\n+\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |\n+| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |\n+| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |\n+| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |\n+| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |\n+| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |\n+| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |\n+| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |\n+| May 1 (Fri) | S13 bug bash complete; must-fix items merged |\n+| May 2 (Sat) | S14 README final pass merged |\n+| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |\n+\n+## Sprint 5 deliverables checklist\n+\n+The project is not complete until all of the following exist:\n+\n+- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified per the S11/S12 split-evidence model: read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against the deployed production Vercel + Railway stack; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment; full AC-1..AC-10 coverage in `local` mode in CI. Any AC falling back to `local`-only evidence must be explicitly flagged in the submission and reflection.\n+- SEO meta tag generation service, content analysis, background worker, admin overrides API, and frontend App Router SSR integration merged to `main`\n+- Server-admin override UI shipped (per dev spec §12 admin-only authorization)\n+- Sitemap and robots.txt correctly respect all three visibility states (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`)\n+- Local integration tests covering the full AC matrix passing in CI; read-only cloud + isolated staging suites passing out-of-band against their respective environments\n+- Validation evidence bundle: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation — with each artifact labeled by target environment (production / staging / local)\n+- README updated for SEO feature and any new env vars\n+- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection\n+- LLM interaction logs archived under `llm-logs/`\n+- Team retrospective recorded\n+\n+## Notes\n+\n+- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).\n+- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.\n+- Tests targeting the production Vercel + Railway deployment remain read-only throughout Sprint 5 to protect the instructor-reviewed dataset. Any mutation-driven AC coverage runs against the isolated Sprint 5 staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview), per S11/S12.\n+- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.","comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #fL+Yvpfazc/5dO0rnuLD/I7ktBdat4v4fiPh8351w4I=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255LzVRbnZwVmN2TEdBeFQxQzZVVHdIU2JEZEI4QWciLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/5QnvpVcvLGAxT1C6UTwHSbDdB8Ag) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 10:19pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:53:05Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/5QnvpVcvLGAxT1C6UTwHSbDdB8Ag\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 10:19pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917354","body":"S1 lists `StructuredDataGen`, but the SEO meta-tag dev spec’s class inventory uses `StructuredDataGenerator` (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917354,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S1 lists <code class=\"notranslate\">StructuredDataGen</code>, but the SEO meta-tag dev spec’s class inventory uses <code class=\"notranslate\">StructuredDataGenerator</code> (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917379","body":"S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines `/api/admin/channels/{channelId}/meta-tags` for GET/PUT/POST and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` for polling, with `Idempotency-Key` as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917379,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> for GET/PUT/POST and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code> for polling, with <code class=\"notranslate\">Idempotency-Key</code> as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917397","body":"This task references `getServerSideProps`, but the frontend is already using the Next.js App Router (`src/app/...`) and `generateMetadata` for SSR meta tags (e.g., `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`). Consider updating the plan to reference App Router mechanisms (`generateMetadata`, metadata routes, route handlers) so the implementation guidance matches the current codebase.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917397,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">This task references <code class=\"notranslate\">getServerSideProps</code>, but the frontend is already using the Next.js App Router (<code class=\"notranslate\">src/app/...</code>) and <code class=\"notranslate\">generateMetadata</code> for SSR meta tags (e.g., <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>). Consider updating the plan to reference App Router mechanisms (<code class=\"notranslate\">generateMetadata</code>, metadata routes, route handlers) so the implementation guidance matches the current codebase.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092675467","body":"## Pull request overview\n\nAdds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.\n\n**Changes:**\n- Add `planning/FINAL_PROJECT_SPRINT_PLAN.md` detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.\n- Add a new LLM session log stub under `llm-logs/`.\n\n### Reviewed changes\n\nCopilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.\n\n| File | Description |\n| ---- | ----------- |\n| planning/FINAL_PROJECT_SPRINT_PLAN.md | New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3 |\n| llm-logs/2026-04-09-184230-session-c9f15ca0.md | Adds a minimal session-log header entry |\n\n\n\n\n\n---\n\n💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4092675467,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Add <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md</code> detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.</li>\n<li>Add a new LLM session log stub under <code class=\"notranslate\">llm-logs/</code>.</li>\n</ul>\n<h3 dir=\"auto\">Reviewed changes</h3>\n<p dir=\"auto\">Copilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th>File</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>planning/FINAL_PROJECT_SPRINT_PLAN.md</td>\n<td>New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3</td>\n</tr>\n<tr>\n<td>llm-logs/2026-04-09-184230-session-c9f15ca0.md</td>\n<td>Adds a minimal session-log header entry</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092717329","body":"- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.\n- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.\n- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.\n- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.\n- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.\n- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.\n- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.\n- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.\n\n1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.\n\n2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.\n\n3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.\n\nResidual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.\n","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4092717329,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:10:13Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Prioritize Logic over Style:</strong> The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Security First:</strong> The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Architectural Alignment:</strong> Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Feedback is limited to correctness, security, and spec alignment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> This is my first pass on the PR, so there were no earlier comments from me to re-check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.</li>\n</ul>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382</code> makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215</code> drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code>, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155</code> leaves out the <code class=\"notranslate\">PUBLIC_NO_INDEX</code> branch of the visibility state machine. The current specs require <code class=\"notranslate\">VISIBILITY_CHANGED</code> handling for <code class=\"notranslate\">PUBLIC_INDEXABLE</code>, <code class=\"notranslate\">PUBLIC_NO_INDEX</code>, and <code class=\"notranslate\">PRIVATE</code>; the sprint plan only schedules work and tests for private and re-indexable states.</p>\n</li>\n</ol>\n<p dir=\"auto\">Residual risk: <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180</code> tells the assignee to use <code class=\"notranslate\">getServerSideProps</code>, but the public channel route is already App Router code using <code class=\"notranslate\">generateMetadata</code> in <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969692","body":"Fixed in 9dc07b4. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969692,"pull_request_review_id":4092729940,"in_reply_to_id":3066917354,"created_at":"2026-04-10T22:15:17Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092729940","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092729940,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:17Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969993","body":"Fixed in 9dc07b4. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969993,"pull_request_review_id":4092730293,"in_reply_to_id":3066917397,"created_at":"2026-04-10T22:15:26Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092730293","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092730293,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:26Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227097411","body":"> Re: comment 4092717329\n\nAll four points addressed in 9dc07b4:\n\n1. **Read-only cloud vs AC-4..AC-10 mutation gap:** S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.\n\n2. **Interface/auth drift:** S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.\n\n3. **Missing PUBLIC_NO_INDEX branch:** S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.\n\n4. **Residual: getServerSideProps vs App Router:** S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4227097411,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:43Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4092717329</p>\n</blockquote>\n<p dir=\"auto\">All four points addressed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>:</p>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><strong>Read-only cloud vs AC-4..AC-10 mutation gap:</strong> S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Interface/auth drift:</strong> S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Missing PUBLIC_NO_INDEX branch:</strong> S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Residual: getServerSideProps vs App Router:</strong> S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.</p>\n</li>\n</ol>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092735271","body":"- [ ] **Prioritize Logic over Style:** Most of the earlier planning defects are fixed, but the final deliverables checklist still contains stale acceptance language that conflicts with the corrected task definitions.\n- [ ] **Security First:** The implementation sections now correctly scope overrides to server admins, but the deliverables checklist still says a creator override UI must ship, which reintroduces auth ambiguity.\n- [ ] **Architectural Alignment:** S4/S10/S11/S12 were updated to match the specs, but the bottom-line completion criteria still reflect the old creator-auth and production-only verification model.\n- [ ] **Issue Completion:** The checklist at the end still overstates what must be verified specifically on the deployed production stack, even though S11/S12 now intentionally split evidence across production, staging, and local.\n- [x] **No Nitpicking:** Feedback is limited to remaining correctness and consistency gaps in the plan.\n- [x] **Avoid Repetition:** I am only calling out stale checklist language that remains after the previous issues were fixed.\n- [x] **Iterative Reviews:** I re-checked the updated head and confirmed the earlier S4/S6/S8/S10/S11/S12 concerns were addressed before writing this follow-up.\n- [x] **Prevent CI Failures:** This is still a docs-only PR; the risk is incorrect implementation guidance, not immediate pipeline breakage.\n\n1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:381` still says all AC-1..AC-10 must be verified against the deployed Vercel + Railway stack. That conflicts with the corrected S11/S12 plan, which now intentionally splits evidence across production, isolated staging, and in some fallback cases local-only evidence. As written, the final checklist silently reintroduces the same impossible production-only gate the rest of the document just fixed.\n\n2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:383` still says \"Creator override UI shipped,\" but S4 and S10 were correctly changed to a server-admin-only override model. Leaving \"creator\" in the deliverables checklist makes the acceptance target inconsistent with the plan’s actual auth contract.\n","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4092735271,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:17:25Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Prioritize Logic over Style:</strong> Most of the earlier planning defects are fixed, but the final deliverables checklist still contains stale acceptance language that conflicts with the corrected task definitions.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Security First:</strong> The implementation sections now correctly scope overrides to server admins, but the deliverables checklist still says a creator override UI must ship, which reintroduces auth ambiguity.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Architectural Alignment:</strong> S4/S10/S11/S12 were updated to match the specs, but the bottom-line completion criteria still reflect the old creator-auth and production-only verification model.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> The checklist at the end still overstates what must be verified specifically on the deployed production stack, even though S11/S12 now intentionally split evidence across production, staging, and local.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Feedback is limited to remaining correctness and consistency gaps in the plan.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> I am only calling out stale checklist language that remains after the previous issues were fixed.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> I re-checked the updated head and confirmed the earlier S4/S6/S8/S10/S11/S12 concerns were addressed before writing this follow-up.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> This is still a docs-only PR; the risk is incorrect implementation guidance, not immediate pipeline breakage.</li>\n</ul>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:381</code> still says all AC-1..AC-10 must be verified against the deployed Vercel + Railway stack. That conflicts with the corrected S11/S12 plan, which now intentionally splits evidence across production, isolated staging, and in some fallback cases local-only evidence. As written, the final checklist silently reintroduces the same impossible production-only gate the rest of the document just fixed.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:383</code> still says \"Creator override UI shipped,\" but S4 and S10 were correctly changed to a server-admin-only override model. Leaving \"creator\" in the deliverables checklist makes the acceptance target inconsistent with the plan’s actual auth contract.</p>\n</li>\n</ol>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066978650","body":"Fixed in 9dc07b4. S4 endpoints now match the dev spec admin API exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}, with server-admin-only authorization per §12.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066978650,"pull_request_review_id":4092738376,"in_reply_to_id":3066917379,"created_at":"2026-04-10T22:18:46Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. S4 endpoints now match the dev spec admin API exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}, with server-admin-only authorization per §12.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092738376","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092738376,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:18:46Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227108729","body":"> Re: comment 4092735271\n\nBoth points fixed in fc567b5:\n\n1. **Stale production-only gate:** The final deliverables checklist now explicitly reflects the S11/S12 split-evidence model — read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against production, write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment, and full AC-1..AC-10 coverage in local CI. Any AC falling back to local-only evidence must be flagged in the submission and reflection. The Notes section was also updated so the cloud read-only rule points at the staging carve-out instead of blocking all mutations.\n\n2. **Creator override UI language:** Checklist line rewritten to 'Server-admin override UI shipped (per dev spec §12 admin-only authorization)', matching the S4/S10 admin-only auth contract. Also expanded the visibility checklist item to name all three states (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE) for consistency with the corrected S6.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4227108729,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:18:57Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4092735271</p>\n</blockquote>\n<p dir=\"auto\">Both points fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/fc567b5478e37984564e23fd3579e32cb0ac9ce8/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/fc567b5478e37984564e23fd3579e32cb0ac9ce8\"><tt>fc567b5</tt></a>:</p>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><strong>Stale production-only gate:</strong> The final deliverables checklist now explicitly reflects the S11/S12 split-evidence model — read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against production, write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment, and full AC-1..AC-10 coverage in local CI. Any AC falling back to local-only evidence must be flagged in the submission and reflection. The Notes section was also updated so the cloud read-only rule points at the staging carve-out instead of blocking all mutations.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Creator override UI language:</strong> Checklist line rewritten to 'Server-admin override UI shipped (per dev spec §12 admin-only authorization)', matching the S4/S10 admin-only auth contract. Also expanded the visibility checklist item to name all three states (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE) for consistency with the corrected S6.</p>\n</li>\n</ol>"}],"created_at":"2026-04-10T21:52:55Z","updated_at":"2026-04-10T22:19:17Z","closed_at":null,"merged_at":null,"commits":5,"changed_files":2,"additions":399,"deletions":0,"display_url":"https://github.com/CS485-Harmony/Harmony/pull/315","display_title":"Add Sprint 5 final project plan through May 3"},"url":"https://github.com/CS485-Harmony/Harmony/pull/315","title":"Add Sprint 5 final project plan through May 3","diff":"@@ -0,0 +1,2 @@\n+# Session Log 2026-04-09-184230\n+\n@@ -0,0 +1,397 @@\n+# Final Project Sprint Plan — April 10 – May 3, 2026\n+\n+## Context\n+This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:\n+\n+- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.\n+- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.\n+\n+Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered \"done\" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.\n+\n+## Team\n+5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI\n+\n+---\n+\n+## Sprint 4 — Deployment (April 10–19)\n+\n+Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.\n+\n+### Sprint 4 exit criteria (must be true before Sprint 5 starts)\n+- Public Vercel frontend URL live on the apex domain\n+- Public Railway backend URL live on `api.<frontend-domain>`\n+- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton\n+- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production\n+- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations\n+- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green\n+- Branch protection on `main` with required checks\n+- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current\n+- README updated for user-facing and deployer-facing instructions\n+- P6 submission package assembled (links, logs, reflection, LLM logs)\n+\n+### Sprint 4 key dates\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |\n+| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |\n+| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |\n+| Apr 16 (Thu) | Branch protection enabled (#13) |\n+| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |\n+| Apr 19 (Sun) | P6 submission package complete (#15) |\n+\n+---\n+\n+## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)\n+\n+### Goal\n+Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.\n+\n+### Scope anchor\n+Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`\n+- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)\n+- Classes C1.1–C6.x per §3 / §4\n+- APIs / public interfaces per §9 / §10\n+- Acceptance criteria AC-1 through AC-10 per §14\n+\n+### Sprint 5 guardrails\n+- All work on feature branches with PR review (branch protection is live from Sprint 4)\n+- Every PR must pass `run-integration-tests` + unit workflows before merge\n+- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only\n+- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory\n+- All destructive schema changes follow the expand/contract convention established in Sprint 4\n+\n+---\n+\n+### Phase A — SEO backend core (April 20–23)\n+\n+**S1. Meta tag generation service skeleton (M2)**\n+- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGenerator` (CL-C2.5), and `MetaTagCache` per dev spec §3/§4\n+- Wire Redis-backed `MetaTagCache` with configurable TTL\n+- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)\n+- Acceptance criteria:\n+  - Classes C2.1–C2.6 exist with the method signatures named in dev spec §3/§4\n+  - `TitleGenerator` enforces ≤60 char auto-generated titles; `DescriptionGenerator` enforces 50–160 char auto-generated descriptions (AC-2)\n+  - `MetaTagCache` is backed by Redis (not process memory) and honors a configurable TTL\n+  - On NLP/timeout failure, `MetaTagService` returns fallback tags and flags `needsRegeneration=true` (AC-9)\n+  - Unit tests cover template application, length limits, sanitization, and fallback paths and pass in CI\n+- Assignee: **declanblanc**\n+- Backup: **acabrera04**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 exit criteria\n+\n+**S2. Content analysis module (M3)**\n+- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`\n+- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout\n+- Unit tests covering keyword extraction, summarization, and fallback paths\n+- Acceptance criteria:\n+  - Classes C3.1–C3.4 exist with the method signatures named in dev spec §3/§4\n+  - `ContentAnalyzer.analyzeThread()` returns keywords, summary, and topic category for a fixture thread\n+  - Deterministic fallback returns a valid (non-null) result within the configured timeout budget when the NLP path is stubbed to fail\n+  - Unit tests cover stop-word filtering, frequency scoring, summarization, topic classification, and timeout/fallback paths\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 22\n+- Blocked by: none (parallel with S1)\n+\n+**S3. Data schema + persistence for meta tag overrides (§11)**\n+- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11\n+- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas\n+- Custom overrides must never be overwritten by background regeneration (AC-7)\n+- Acceptance criteria:\n+  - Prisma migration adds all fields in dev spec §11 and applies cleanly via the single Sprint 4 migration runner\n+  - Migration is expand-only (no destructive drops) so it coexists with old `backend-api` replicas during rolling restart\n+  - Persistence layer enforces that a background regeneration write cannot overwrite a non-null `customTitle` or `customDescription` (AC-7), verified by an integration test\n+  - Schema is documented in `docs/deployment/deployment-architecture.md` or the SEO dev spec appendix\n+- Assignee: **FardeenI**\n+- Backup: **AvanishKulkarni**\n+- Due: Apr 22\n+- Blocked by: Sprint 4 migration-runner ownership\n+\n+**S4. Admin REST endpoints (§9, §10)**\n+- Implement the admin-only meta-tag endpoints exactly as defined in dev spec §9/§10:\n+  - `GET /api/admin/channels/{channelId}/meta-tags`\n+  - `PUT /api/admin/channels/{channelId}/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)\n+  - `POST /api/admin/channels/{channelId}/meta-tags/jobs` returning `jobId` with idempotency key (AC-5, AC-6)\n+  - `GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` status polling\n+- Authorization is **server admin only** per dev spec §12 (\"Only server admins can set custom meta tags\"). Channel creators/owners without the server-admin role must not reach these endpoints.\n+- API integration tests for each endpoint\n+- Acceptance criteria:\n+  - All four endpoints are mounted under `/api/admin/channels/...` matching dev spec §9 paths exactly\n+  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)\n+  - `POST .../jobs` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)\n+  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)\n+  - All endpoints enforce server-admin authorization; non-admins (including channel creators without admin role) get 403\n+  - Supertest integration tests cover success, validation failure, non-admin rejection, and idempotency\n+- Assignee: **FardeenI**\n+- Due: Apr 23\n+- Blocked by: S1, S3\n+\n+---\n+\n+### Phase B — Background processing + visibility lifecycle (April 22–25)\n+\n+**S5. Background meta tag update worker (M4) on `backend-worker`**\n+- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration\n+- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus\n+- Worker must run as singleton only (enforced by Sprint 4 topology)\n+- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline\n+- Acceptance criteria:\n+  - `MetaTagUpdateWorker` runs only inside the `backend-worker` process; `backend-api` replicas do not subscribe to regeneration events\n+  - Worker consumes `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events and schedules regeneration jobs\n+  - Debounce/batch window collapses repeated events for the same channel into a single regeneration job within the configured window\n+  - Worker restart does not duplicate in-flight jobs (job queue dedupes by channel + idempotency key)\n+  - Integration test simulates burst traffic and asserts a single regeneration job is produced per debounce window\n+- Assignee: **Aiden-Barrera**\n+- Backup: **declanblanc**\n+- Due: Apr 24\n+- Blocked by: S1, S2\n+\n+**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**\n+- Handle all three branches of the `VISIBILITY_CHANGED` event per dev spec §6 flow F8 and §9.1 cross-spec visibility contract:\n+  - `→ PRIVATE`: invalidate `MetaTagCache` (`meta:channel:{channelId}`), purge CDN, remove sitemap URL, request search-engine removal; never serve stale tags while private\n+  - `→ PUBLIC_NO_INDEX`: regenerate tags with `robots=noindex`, invalidate cache, keep channel publicly reachable but exclude from indexable sitemap set\n+  - `→ PUBLIC_INDEXABLE`: high-priority regeneration, invalidate cache, keep canonical URL in sitemap with refreshed `lastmod`\n+- Integration tests covering all three directions and cache/sitemap side effects\n+- Acceptance criteria:\n+  - `PUBLIC_INDEXABLE → PRIVATE` invalidates the `MetaTagCache` entry and removes the URL from the sitemap within one regeneration cycle (AC-4, AC-10)\n+  - `PUBLIC_INDEXABLE → PUBLIC_NO_INDEX` regenerates with `robots=noindex`, invalidates cache, and removes the channel from the indexable sitemap set while the page remains publicly reachable\n+  - `PRIVATE → PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX → PUBLIC_INDEXABLE` re-enqueue high-priority regeneration and the channel (re)appears in the sitemap\n+  - Subsequent SSR requests return `noindex` meta where required and 404/403 public body for PRIVATE\n+  - End-to-end integration test covers the full `PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE` matrix and asserts cache + sitemap state at each step\n+- Assignee: **declanblanc**\n+- Due: Apr 25\n+- Blocked by: S5\n+\n+**S7. Security + content filtering (§12, AC-8)**\n+- PII and profanity filters on generated titles/descriptions\n+- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`\n+- Unit tests with fixture content covering PII/profanity/XSS\n+- Acceptance criteria:\n+  - Generated tags for the PII/profanity fixture corpus contain no flagged content (AC-8)\n+  - HTML/attribute injection attempts in `customTitle`/`customDescription` are escaped or rejected on write and on render\n+  - `<head>` output for a crafted XSS fixture passes a snapshot test showing escaped output\n+  - Filter behavior is covered by unit tests and documented in `docs/dev-spec-seo-meta-tag-generation.md` §12 cross-reference\n+- Assignee: **AvanishKulkarni**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 25\n+- Blocked by: S1\n+\n+---\n+\n+### Phase C — Frontend rendering + SEO surface (April 23–27)\n+\n+**S8. `PublicChannelPage` + `generateMetadata` integration (M1)**\n+- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`\n+- Use the Next.js **App Router** `generateMetadata` export in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx` (already scaffolded) to fetch tags from the backend at request time; JSON-LD is injected via a component in `page.tsx` since `Metadata` doesn't cover structured data\n+- Use App Router route handlers / metadata routes (`app/sitemap.ts`, `app/robots.ts`) for crawler-facing entrypoints — do **not** introduce `getServerSideProps` or `pages/` router code\n+- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain\n+- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name=\"description\">` (AC-1)\n+- Acceptance criteria:\n+  - Every public channel page SSR-renders non-empty `<title>` and `<meta name=\"description\">` for the fixture corpus (AC-1)\n+  - Open Graph, Twitter card, and JSON-LD `DiscussionForumPosting` tags are present and validate against Google Rich Results test\n+  - Canonical URL is the frontend apex domain; no `<link rel=\"canonical\">` or sitemap URL points at the API subdomain\n+  - Meta tag fetch uses the backend API at request time and degrades to template fallback if the backend is unreachable\n+  - E2E test (Playwright or crawler UA fetch) asserts tags on at least 3 representative public channels\n+- Assignee: **declanblanc**\n+- Due: Apr 26\n+- Blocked by: S4, Sprint 4 #6 (frontend prod config)\n+\n+**S9. Sitemap + robots.txt finalization**\n+- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain\n+- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility\n+- Smoke test that private channels do not appear in sitemap\n+- Acceptance criteria:\n+  - `https://<frontend-apex>/sitemap.xml` and `https://<frontend-apex>/robots.txt` resolve on the frontend apex domain (not the API subdomain)\n+  - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `PRIVATE` channels are excluded\n+  - Channels flipped to `PRIVATE` disappear from sitemap on the next regeneration cycle\n+  - `robots.txt` allows crawling of public paths and disallows non-public areas\n+  - Smoke test asserts sitemap exclusion behavior for a fixture private channel\n+- Assignee: **AvanishKulkarni**\n+- Backup: **FardeenI**\n+- Due: Apr 27\n+- Blocked by: S6, S8\n+\n+**S10. Meta tag admin UI (server-admin override flow)**\n+- UI under server/channel admin settings for **server admins** to view generated tags, override title/description, and trigger manual regeneration with job status polling. Authorization matches dev spec §12: only server admins can set custom meta tags.\n+- Respect `customTitle`/`customDescription` length limits with client-side validation\n+- Talks to the admin endpoints from S4 (`/api/admin/channels/{channelId}/meta-tags` and `.../jobs/{jobId}`)\n+- Acceptance criteria:\n+  - Admin settings page exposes a \"SEO Preview\" section showing current generated + override values\n+  - A server admin can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules\n+  - A server admin can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`\n+  - Non-admin users (including channel creators without the admin role) do not see the override UI\n+  - Frontend unit tests cover validation, submit, job polling, and admin-vs-non-admin rendering\n+- Assignee: **acabrera04**\n+- Backup: **declanblanc**\n+- Due: Apr 27\n+- Blocked by: S4\n+\n+---\n+\n+### Phase D — End-to-end verification on production (April 27–30)\n+\n+**S11. Integration tests for SEO feature (local + cloud + isolated staging)**\n+- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10\n+- Split AC coverage by execution target so the read-only cloud rule from Sprint 4 is not violated:\n+  - **Read-only paths against production deployed URLs:** AC-1 (tags present), AC-2 (length bounds on already-generated tags), AC-8 (no PII/profanity in fixture-safe public channels), and any AC that only needs fetch-and-assert\n+  - **Write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10):** run against an **isolated staging environment** provisioned for Sprint 5 (separate Railway project/environment + isolated Postgres + isolated Redis + dedicated Vercel preview) so visibility flips, regeneration jobs, override persistence, and fallback injection never touch the instructor-reviewed production dataset\n+  - `local` mode still runs the full AC-1..AC-10 matrix deterministically on seeded data and remains the CI source of truth\n+- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)\n+- Acceptance criteria:\n+  - Test cases exist and are traceable one-to-one to AC-1 through AC-10 in dev spec §14\n+  - Suite runs in `local` mode via `run-integration-tests.yml` and passes on PR with full AC-1..AC-10 coverage\n+  - Read-only cloud mode runs against production URLs and does not mutate production data\n+  - Write-path AC coverage runs against a documented isolated staging environment, documented alongside the Sprint 4 isolation rules in `docs/deployment/deployment-architecture.md`\n+  - Crawler-UA fetches (`User-Agent: Googlebot`) of at least 3 public channels return non-empty `<title>`/`<meta name=\"description\">` and valid JSON-LD\n+  - Test output is captured as an artifact for submission evidence\n+  - If the isolated staging environment cannot be provisioned in time, write-path ACs fall back to `local` evidence and the limitation is explicitly documented in the submission reflection\n+- Assignee: **Aiden-Barrera**\n+- Due: Apr 29\n+- Blocked by: S8, S9, S10\n+\n+**S12. Deployed validation + evidence capture**\n+- Run the read-only cloud portion of the SEO suite against the deployed production Vercel + Railway stack and the write-path portion against the isolated staging environment provisioned in S11\n+- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, and visibility-driven sitemap/`noindex` behavior works across `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`\n+- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch\n+- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission\n+- Acceptance criteria:\n+  - Read-only cloud tests pass against the deployed production stack without mutating production data\n+  - Write-path tests pass against the isolated staging stack\n+  - Evidence bundle exists under `docs/submission/seo-evidence/` containing: crawler-view HTML, Rich Results test screenshots, replica-identity headers from at least two distinct `backend-api` replicas, and a cache-hit log sample\n+  - Visibility transitions for all three states (`PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE`) are verified and captured as evidence (AC-4, AC-10)\n+  - Tag output is identical across both API replicas for the same channel within one cache TTL\n+  - Every AC-1..AC-10 item has at least one linked piece of evidence in the bundle, with the target environment (production / staging / local) labeled\n+  - Any AC for which only `local` evidence exists is flagged explicitly in the bundle and the reflection\n+- Assignee: **declanblanc**\n+- Backup: **Aiden-Barrera**\n+- Due: Apr 30\n+- Blocked by: S11\n+\n+**S13. Bug bash + polish**\n+- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime\n+- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`\n+- Fix must-fix items only; document the rest in the reflection\n+- Acceptance criteria:\n+  - Each developer logs at least one bug-bash session against the deployed stack and files GitHub issues for findings\n+  - Every finding is triaged with a label (`must-fix-for-submission` or `known-limitation`)\n+  - All `must-fix-for-submission` issues are merged to `main` and redeployed before S15 starts\n+  - `known-limitation` issues are summarized in the reflection document\n+  - Post-bash smoke run of the cloud integration suite is green\n+- Assignee: **whole team**, coordinator: **FardeenI**\n+- Due: May 1\n+- Blocked by: S12\n+\n+---\n+\n+### Phase E — Final submission package (May 1–3)\n+\n+**S14. README + deployer guide final pass**\n+- Fold SEO feature usage, override flow, and regeneration behavior into README\n+- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)\n+- Acceptance criteria:\n+  - README documents: how to view generated SEO tags, how a server admin overrides them, and how regeneration is triggered\n+  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value\n+  - README links to the deployed frontend URL, backend URL, and submission evidence bundle\n+  - A fresh contributor can follow README instructions to run the app locally and see SEO tags on a public channel\n+- Assignee: **acabrera04**\n+- Due: May 2\n+- Blocked by: S10\n+\n+**S15. Final project submission package**\n+- Compile final deliverable checklist:\n+  - Public frontend URL + public backend URL (from Sprint 4)\n+  - Links to every dev spec document under `docs/`\n+  - Links to SEO feature PRs and commits\n+  - Integration test specs + code + local/cloud run output\n+  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)\n+  - Branch protection screenshot\n+  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)\n+  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)\n+  - LLM interaction logs under `llm-logs/` with model/version labels\n+- Acceptance criteria:\n+  - Every checklist item above has a resolved link or committed artifact (no TBDs)\n+  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README\n+  - All AC-1..AC-10 items map to evidence produced in S12\n+  - Each developer is named against at least one deliverable in the contributions section\n+  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD\n+- Assignee: **acabrera04**\n+- Backup: **FardeenI**\n+- Due: May 3\n+- Blocked by: S12, S13, S14\n+\n+**S16. Final reflection + retrospective**\n+- Team retrospective on the full project (Sprints 1–5)\n+- Each developer contributes a short written reflection to the submission doc\n+- Acceptance criteria:\n+  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)\n+  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change\n+  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off\n+  - Known limitations from S13 are captured in the reflection with mitigation notes\n+- Assignee: **whole team**, coordinator: **declanblanc**\n+- Due: May 3\n+- Blocked by: S15 draft\n+\n+---\n+\n+## Sprint 5 assignment summary\n+\n+| Developer | Issues | Focus |\n+|-----------|--------|-------|\n+| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |\n+| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |\n+| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |\n+| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |\n+| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |\n+\n+## Sprint 5 critical path\n+\n+```text\n+S1 Meta tag service  ─┐\n+S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐\n+S3 Schema/migration  ─┘                           │\n+                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission\n+S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘\n+S7 Security (needs S1) ──────────────────────────►\n+S9 Sitemap (needs S6, S8) ───────────────────────►\n+S10 Override UI (needs S4) ──────────────────────►\n+                                                   S14 README (needs S10) ─► S15\n+                                                   S16 Retrospective (parallel)\n+```\n+\n+## Sprint 5 timeline\n+\n+| Date | Milestone |\n+|------|-----------|\n+| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |\n+| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |\n+| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |\n+| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |\n+| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |\n+| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |\n+| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |\n+| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |\n+| May 1 (Fri) | S13 bug bash complete; must-fix items merged |\n+| May 2 (Sat) | S14 README final pass merged |\n+| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |\n+\n+## Sprint 5 deliverables checklist\n+\n+The project is not complete until all of the following exist:\n+\n+- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified per the S11/S12 split-evidence model: read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against the deployed production Vercel + Railway stack; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment; full AC-1..AC-10 coverage in `local` mode in CI. Any AC falling back to `local`-only evidence must be explicitly flagged in the submission and reflection.\n+- SEO meta tag generation service, content analysis, background worker, admin overrides API, and frontend App Router SSR integration merged to `main`\n+- Server-admin override UI shipped (per dev spec §12 admin-only authorization)\n+- Sitemap and robots.txt correctly respect all three visibility states (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`)\n+- Local integration tests covering the full AC matrix passing in CI; read-only cloud + isolated staging suites passing out-of-band against their respective environments\n+- Validation evidence bundle: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation — with each artifact labeled by target environment (production / staging / local)\n+- README updated for SEO feature and any new env vars\n+- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection\n+- LLM interaction logs archived under `llm-logs/`\n+- Team retrospective recorded\n+\n+## Notes\n+\n+- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).\n+- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.\n+- Tests targeting the production Vercel + Railway deployment remain read-only throughout Sprint 5 to protect the instructor-reviewed dataset. Any mutation-driven AC coverage runs against the isolated Sprint 5 staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview), per S11/S12.\n+- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.","comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227007005","body":"[vc]: #fL+Yvpfazc/5dO0rnuLD/I7ktBdat4v4fiPh8351w4I=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255LzVRbnZwVmN2TEdBeFQxQzZVVHdIU2JEZEI4QWciLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/5QnvpVcvLGAxT1C6UTwHSbDdB8Ag) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 10:19pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4227007005,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:53:05Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/5QnvpVcvLGAxT1C6UTwHSbDdB8Ag\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 10, 2026 10:19pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917354","body":"S1 lists `StructuredDataGen`, but the SEO meta-tag dev spec’s class inventory uses `StructuredDataGenerator` (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917354,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S1 lists <code class=\"notranslate\">StructuredDataGen</code>, but the SEO meta-tag dev spec’s class inventory uses <code class=\"notranslate\">StructuredDataGenerator</code> (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917379","body":"S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines `/api/admin/channels/{channelId}/meta-tags` for GET/PUT/POST and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` for polling, with `Idempotency-Key` as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917379,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:33Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> for GET/PUT/POST and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code> for polling, with <code class=\"notranslate\">Idempotency-Key</code> as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066917397","body":"This task references `getServerSideProps`, but the frontend is already using the Next.js App Router (`src/app/...`) and `generateMetadata` for SSR meta tags (e.g., `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`). Consider updating the plan to reference App Router mechanisms (`generateMetadata`, metadata routes, route handlers) so the implementation guidance matches the current codebase.","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3066917397,"pull_request_review_id":4092675467,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">This task references <code class=\"notranslate\">getServerSideProps</code>, but the frontend is already using the Next.js App Router (<code class=\"notranslate\">src/app/...</code>) and <code class=\"notranslate\">generateMetadata</code> for SSR meta tags (e.g., <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>). Consider updating the plan to reference App Router mechanisms (<code class=\"notranslate\">generateMetadata</code>, metadata routes, route handlers) so the implementation guidance matches the current codebase.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092675467","body":"## Pull request overview\n\nAdds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.\n\n**Changes:**\n- Add `planning/FINAL_PROJECT_SPRINT_PLAN.md` detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.\n- Add a new LLM session log stub under `llm-logs/`.\n\n### Reviewed changes\n\nCopilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.\n\n| File | Description |\n| ---- | ----------- |\n| planning/FINAL_PROJECT_SPRINT_PLAN.md | New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3 |\n| llm-logs/2026-04-09-184230-session-c9f15ca0.md | Adds a minimal session-log header entry |\n\n\n\n\n\n---\n\n💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4092675467,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T21:56:34Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Add <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md</code> detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.</li>\n<li>Add a new LLM session log stub under <code class=\"notranslate\">llm-logs/</code>.</li>\n</ul>\n<h3 dir=\"auto\">Reviewed changes</h3>\n<p dir=\"auto\">Copilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th>File</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>planning/FINAL_PROJECT_SPRINT_PLAN.md</td>\n<td>New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3</td>\n</tr>\n<tr>\n<td>llm-logs/2026-04-09-184230-session-c9f15ca0.md</td>\n<td>Adds a minimal session-log header entry</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092717329","body":"- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.\n- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.\n- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.\n- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.\n- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.\n- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.\n- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.\n- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.\n\n1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.\n\n2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.\n\n3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.\n\nResidual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.\n","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4092717329,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:10:13Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Prioritize Logic over Style:</strong> The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Security First:</strong> The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Architectural Alignment:</strong> Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Feedback is limited to correctness, security, and spec alignment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> This is my first pass on the PR, so there were no earlier comments from me to re-check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.</li>\n</ul>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382</code> makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215</code> drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags</code> and <code class=\"notranslate\">/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}</code>, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155</code> leaves out the <code class=\"notranslate\">PUBLIC_NO_INDEX</code> branch of the visibility state machine. The current specs require <code class=\"notranslate\">VISIBILITY_CHANGED</code> handling for <code class=\"notranslate\">PUBLIC_INDEXABLE</code>, <code class=\"notranslate\">PUBLIC_NO_INDEX</code>, and <code class=\"notranslate\">PRIVATE</code>; the sprint plan only schedules work and tests for private and re-indexable states.</p>\n</li>\n</ol>\n<p dir=\"auto\">Residual risk: <code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180</code> tells the assignee to use <code class=\"notranslate\">getServerSideProps</code>, but the public channel route is already App Router code using <code class=\"notranslate\">generateMetadata</code> in <code class=\"notranslate\">harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx</code>. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969692","body":"Fixed in 9dc07b4. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969692,"pull_request_review_id":4092729940,"in_reply_to_id":3066917354,"created_at":"2026-04-10T22:15:17Z","review":null,"side":"RIGHT","line":69,"start_line":67,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092729940","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092729940,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:17Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066969993","body":"Fixed in 9dc07b4. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066969993,"pull_request_review_id":4092730293,"in_reply_to_id":3066917397,"created_at":"2026-04-10T22:15:26Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092730293","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092730293,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:26Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227097411","body":"> Re: comment 4092717329\n\nAll four points addressed in 9dc07b4:\n\n1. **Read-only cloud vs AC-4..AC-10 mutation gap:** S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.\n\n2. **Interface/auth drift:** S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.\n\n3. **Missing PUBLIC_NO_INDEX branch:** S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.\n\n4. **Residual: getServerSideProps vs App Router:** S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4227097411,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:15:43Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4092717329</p>\n</blockquote>\n<p dir=\"auto\">All four points addressed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>:</p>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><strong>Read-only cloud vs AC-4..AC-10 mutation gap:</strong> S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Interface/auth drift:</strong> S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Missing PUBLIC_NO_INDEX branch:</strong> S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Residual: getServerSideProps vs App Router:</strong> S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.</p>\n</li>\n</ol>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092735271","body":"- [ ] **Prioritize Logic over Style:** Most of the earlier planning defects are fixed, but the final deliverables checklist still contains stale acceptance language that conflicts with the corrected task definitions.\n- [ ] **Security First:** The implementation sections now correctly scope overrides to server admins, but the deliverables checklist still says a creator override UI must ship, which reintroduces auth ambiguity.\n- [ ] **Architectural Alignment:** S4/S10/S11/S12 were updated to match the specs, but the bottom-line completion criteria still reflect the old creator-auth and production-only verification model.\n- [ ] **Issue Completion:** The checklist at the end still overstates what must be verified specifically on the deployed production stack, even though S11/S12 now intentionally split evidence across production, staging, and local.\n- [x] **No Nitpicking:** Feedback is limited to remaining correctness and consistency gaps in the plan.\n- [x] **Avoid Repetition:** I am only calling out stale checklist language that remains after the previous issues were fixed.\n- [x] **Iterative Reviews:** I re-checked the updated head and confirmed the earlier S4/S6/S8/S10/S11/S12 concerns were addressed before writing this follow-up.\n- [x] **Prevent CI Failures:** This is still a docs-only PR; the risk is incorrect implementation guidance, not immediate pipeline breakage.\n\n1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:381` still says all AC-1..AC-10 must be verified against the deployed Vercel + Railway stack. That conflicts with the corrected S11/S12 plan, which now intentionally splits evidence across production, isolated staging, and in some fallback cases local-only evidence. As written, the final checklist silently reintroduces the same impossible production-only gate the rest of the document just fixed.\n\n2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:383` still says \"Creator override UI shipped,\" but S4 and S10 were correctly changed to a server-admin-only override model. Leaving \"creator\" in the deliverables checklist makes the acceptance target inconsistent with the plan’s actual auth contract.\n","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4092735271,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:17:25Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Prioritize Logic over Style:</strong> Most of the earlier planning defects are fixed, but the final deliverables checklist still contains stale acceptance language that conflicts with the corrected task definitions.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Security First:</strong> The implementation sections now correctly scope overrides to server admins, but the deliverables checklist still says a creator override UI must ship, which reintroduces auth ambiguity.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Architectural Alignment:</strong> S4/S10/S11/S12 were updated to match the specs, but the bottom-line completion criteria still reflect the old creator-auth and production-only verification model.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> The checklist at the end still overstates what must be verified specifically on the deployed production stack, even though S11/S12 now intentionally split evidence across production, staging, and local.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Feedback is limited to remaining correctness and consistency gaps in the plan.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> I am only calling out stale checklist language that remains after the previous issues were fixed.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> I re-checked the updated head and confirmed the earlier S4/S6/S8/S10/S11/S12 concerns were addressed before writing this follow-up.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> This is still a docs-only PR; the risk is incorrect implementation guidance, not immediate pipeline breakage.</li>\n</ul>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:381</code> still says all AC-1..AC-10 must be verified against the deployed Vercel + Railway stack. That conflicts with the corrected S11/S12 plan, which now intentionally splits evidence across production, isolated staging, and in some fallback cases local-only evidence. As written, the final checklist silently reintroduces the same impossible production-only gate the rest of the document just fixed.</p>\n</li>\n<li>\n<p dir=\"auto\"><code class=\"notranslate\">planning/FINAL_PROJECT_SPRINT_PLAN.md:383</code> still says \"Creator override UI shipped,\" but S4 and S10 were correctly changed to a server-admin-only override model. Leaving \"creator\" in the deliverables checklist makes the acceptance target inconsistent with the plan’s actual auth contract.</p>\n</li>\n</ol>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#discussion_r3066978650","body":"Fixed in 9dc07b4. S4 endpoints now match the dev spec admin API exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}, with server-admin-only authorization per §12.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":3066978650,"pull_request_review_id":4092738376,"in_reply_to_id":3066917379,"created_at":"2026-04-10T22:18:46Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/9dc07b41974e29037501159dbcc6a06b39512235\"><tt>9dc07b4</tt></a>. S4 endpoints now match the dev spec admin API exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}, with server-admin-only authorization per §12.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#pullrequestreview-4092738376","body":"","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4092738376,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:18:46Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/315#issuecomment-4227108729","body":"> Re: comment 4092735271\n\nBoth points fixed in fc567b5:\n\n1. **Stale production-only gate:** The final deliverables checklist now explicitly reflects the S11/S12 split-evidence model — read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against production, write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment, and full AC-1..AC-10 coverage in local CI. Any AC falling back to local-only evidence must be flagged in the submission and reflection. The Notes section was also updated so the cloud read-only rule points at the staging carve-out instead of blocking all mutations.\n\n2. **Creator override UI language:** Checklist line rewritten to 'Server-admin override UI shipped (per dev spec §12 admin-only authorization)', matching the S4/S10 admin-only auth contract. Also expanded the visibility checklist item to name all three states (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE) for consistency with the corrected S6.","user":{"login":"AvanishKulkarni","name":"AvanishKulkarni","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/55012494?v=4","id":55012494},"id":4227108729,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-10T22:18:57Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4092735271</p>\n</blockquote>\n<p dir=\"auto\">Both points fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/fc567b5478e37984564e23fd3579e32cb0ac9ce8/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/fc567b5478e37984564e23fd3579e32cb0ac9ce8\"><tt>fc567b5</tt></a>:</p>\n<ol dir=\"auto\">\n<li>\n<p dir=\"auto\"><strong>Stale production-only gate:</strong> The final deliverables checklist now explicitly reflects the S11/S12 split-evidence model — read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against production, write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment, and full AC-1..AC-10 coverage in local CI. Any AC falling back to local-only evidence must be flagged in the submission and reflection. The Notes section was also updated so the cloud read-only rule points at the staging carve-out instead of blocking all mutations.</p>\n</li>\n<li>\n<p dir=\"auto\"><strong>Creator override UI language:</strong> Checklist line rewritten to 'Server-admin override UI shipped (per dev spec §12 admin-only authorization)', matching the S4/S10 admin-only auth contract. Also expanded the visibility checklist item to name all three states (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE) for consistency with the corrected S6.</p>\n</li>\n</ol>"}],"display_url":"https://github.com/CS485-Harmony/Harmony/pull/315","display_title":"Add Sprint 5 final project plan through May 3"}
````

#### Tool: exec_command

```sh
gh pr view 315 --repo CS485-Harmony/Harmony --comments
```

Output:

```text
author:	vercel
association:	none
edited:	true
status:	none
--
[vc]: #fL+Yvpfazc/5dO0rnuLD/I7ktBdat4v4fiPh8351w4I=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255LzVRbnZwVmN2TEdBeFQxQzZVVHdIU2JEZEI4QWciLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAiLCJuZXh0Q29tbWl0U3RhdHVzIjoiREVQTE9ZRUQiLCJsaXZlRmVlZGJhY2siOnsicmVzb2x2ZWQiOjAsInVucmVzb2x2ZWQiOjAsInRvdGFsIjowLCJsaW5rIjoiaGFybW9ueS1naXQtc3ByaW50LTUtZmluYWwtcHJvLTgxZmI3Ny1kZWNsYW5zLXByb2plY3RzLTE0MWE4YjRjLnZlcmNlbC5hcHAifSwicm9vdERpcmVjdG9yeSI6Imhhcm1vbnktZnJvbnRlbmQifV19
The latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).

| Project | Deployment | Actions | Updated (UTC) |
| :--- | :----- | :------ | :------ |
| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/5QnvpVcvLGAxT1C6UTwHSbDdB8Ag) | [Preview](https://harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-sprint-5-final-pro-81fb77-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 10, 2026 10:19pm |


--
author:	copilot-pull-request-reviewer
association:	contributor
edited:	false
status:	commented
--
## Pull request overview

Adds the final-project plan for Sprint 5 (and references Sprint 4) to guide completion of the SEO meta-tag generation feature and final submission deliverables through May 3, 2026.

**Changes:**
- Add `planning/FINAL_PROJECT_SPRINT_PLAN.md` detailing Sprint 4 exit criteria + Sprint 5 phases, assignments, critical path, and deliverables.
- Add a new LLM session log stub under `llm-logs/`.

### Reviewed changes

Copilot reviewed 2 out of 2 changed files in this pull request and generated 3 comments.

| File | Description |
| ---- | ----------- |
| planning/FINAL_PROJECT_SPRINT_PLAN.md | New end-to-end schedule/ownership plan for finishing SEO meta tags and submission work through May 3 |
| llm-logs/2026-04-09-184230-session-c9f15ca0.md | Adds a minimal session-log header entry |





---

💡 <a href="/CS485-Harmony/Harmony/new/main?filename=.github/instructions/*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.
--
author:	acabrera04
association:	member
edited:	false
status:	changes requested
--
- [ ] **Prioritize Logic over Style:** The PR introduces planning defects that would send implementation in the wrong direction: an impossible validation gate, interface/auth drift from the approved spec, and incomplete visibility-state coverage.
- [ ] **Security First:** The plan changes meta-tag overrides from admin-only to creator/owner access, which weakens the security model defined in the SEO spec.
- [ ] **Architectural Alignment:** Several tasks no longer match the SEO and channel-visibility specs, so downstream implementation would start from the wrong contract.
- [ ] **Issue Completion:** The document claims AC-1..AC-10 will be verified on the deployed stack, but the read-only cloud rule prevents several of those acceptance checks from actually happening.
- [x] **No Nitpicking:** Feedback is limited to correctness, security, and spec alignment.
- [x] **Avoid Repetition:** I did not find prior substantive review feedback on this PR beyond the Vercel bot comment.
- [x] **Iterative Reviews:** This is my first pass on the PR, so there were no earlier comments from me to re-check.
- [x] **Prevent CI Failures:** This docs-only PR is unlikely to break the current pipeline directly; the risks are downstream implementation and validation failures.

1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:228-250, 367-382` makes the final acceptance gate impossible as written. The plan says cloud validation is read-only, but it also requires live deployed evidence for AC-4 through AC-10. Several of those criteria need mutations: visibility flips, regeneration requests, override persistence, and fallback persistence checks. Without a staging dataset/environment or an explicit carve-out for reversible production mutations, the acceptance gate here is not actually achievable.

2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:110-121, 208-215` drifts from the approved interface and authorization model. The SEO spec defines admin-only endpoints at `/api/admin/channels/{channelId}/meta-tags` and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}`, and it explicitly says only server admins can set custom meta tags and trigger those flows. This plan switches both the routes and the auth model to creator/owner semantics.

3. `planning/FINAL_PROJECT_SPRINT_PLAN.md:147-155` leaves out the `PUBLIC_NO_INDEX` branch of the visibility state machine. The current specs require `VISIBILITY_CHANGED` handling for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`; the sprint plan only schedules work and tests for private and re-indexable states.

Residual risk: `planning/FINAL_PROJECT_SPRINT_PLAN.md:178-180` tells the assignee to use `getServerSideProps`, but the public channel route is already App Router code using `generateMetadata` in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`. I would update that wording so the plan does not steer implementation toward the wrong Next.js API.

--
author:	AvanishKulkarni
association:	member
edited:	false
status:	none
--
> Re: comment 4092717329

All four points addressed in 9dc07b4:

1. **Read-only cloud vs AC-4..AC-10 mutation gap:** S11/S12 now split AC coverage by target. Read-only ACs (AC-1, AC-2, AC-8 fixture-safe) run against production URLs; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) run against a documented isolated staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview). Local mode remains the CI source of truth with full AC-1..AC-10 coverage. Fallback to local-only evidence is explicitly allowed and must be flagged in the reflection.

2. **Interface/auth drift:** S4 endpoints now match the SEO spec exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET .../jobs/{jobId}. Authorization is server-admin-only per §12; S10 override UI was rescoped from creator/owner to server admin, and S4 acceptance criteria require non-admins (including channel creators without the admin role) to be rejected with 403.

3. **Missing PUBLIC_NO_INDEX branch:** S6 now covers all three VISIBILITY_CHANGED branches (PRIVATE, PUBLIC_NO_INDEX, PUBLIC_INDEXABLE) matching dev spec §6 flow F8 and the cross-spec visibility contract in §9.1. The end-to-end integration test covers the full PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE matrix.

4. **Residual: getServerSideProps vs App Router:** S8 retitled and rewritten to use generateMetadata in the existing App Router page at harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx, plus app/sitemap.ts and app/robots.ts metadata routes. Explicitly forbids introducing getServerSideProps or pages/ router code.
--
author:	acabrera04
association:	member
edited:	false
status:	changes requested
--
- [ ] **Prioritize Logic over Style:** Most of the earlier planning defects are fixed, but the final deliverables checklist still contains stale acceptance language that conflicts with the corrected task definitions.
- [ ] **Security First:** The implementation sections now correctly scope overrides to server admins, but the deliverables checklist still says a creator override UI must ship, which reintroduces auth ambiguity.
- [ ] **Architectural Alignment:** S4/S10/S11/S12 were updated to match the specs, but the bottom-line completion criteria still reflect the old creator-auth and production-only verification model.
- [ ] **Issue Completion:** The checklist at the end still overstates what must be verified specifically on the deployed production stack, even though S11/S12 now intentionally split evidence across production, staging, and local.
- [x] **No Nitpicking:** Feedback is limited to remaining correctness and consistency gaps in the plan.
- [x] **Avoid Repetition:** I am only calling out stale checklist language that remains after the previous issues were fixed.
- [x] **Iterative Reviews:** I re-checked the updated head and confirmed the earlier S4/S6/S8/S10/S11/S12 concerns were addressed before writing this follow-up.
- [x] **Prevent CI Failures:** This is still a docs-only PR; the risk is incorrect implementation guidance, not immediate pipeline breakage.

1. `planning/FINAL_PROJECT_SPRINT_PLAN.md:381` still says all AC-1..AC-10 must be verified against the deployed Vercel + Railway stack. That conflicts with the corrected S11/S12 plan, which now intentionally splits evidence across production, isolated staging, and in some fallback cases local-only evidence. As written, the final checklist silently reintroduces the same impossible production-only gate the rest of the document just fixed.

2. `planning/FINAL_PROJECT_SPRINT_PLAN.md:383` still says "Creator override UI shipped," but S4 and S10 were correctly changed to a server-admin-only override model. Leaving "creator" in the deliverables checklist makes the acceptance target inconsistent with the plan’s actual auth contract.

--
author:	AvanishKulkarni
association:	member
edited:	false
status:	none
--
> Re: comment 4092735271

Both points fixed in fc567b5:

1. **Stale production-only gate:** The final deliverables checklist now explicitly reflects the S11/S12 split-evidence model — read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against production, write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment, and full AC-1..AC-10 coverage in local CI. Any AC falling back to local-only evidence must be flagged in the submission and reflection. The Notes section was also updated so the cloud read-only rule points at the staging carve-out instead of blocking all mutations.

2. **Creator override UI language:** Checklist line rewritten to 'Server-admin override UI shipped (per dev spec §12 admin-only authorization)', matching the S4/S10 admin-only auth contract. Also expanded the visibility checklist item to name all three states (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE) for consistency with the corrected S6.
--
```

#### Tool: exec_command

```sh
gh pr diff 315 --repo CS485-Harmony/Harmony
```

Output:

````text
diff --git a/llm-logs/2026-04-09-184230-session-c9f15ca0.md b/llm-logs/2026-04-09-184230-session-c9f15ca0.md
new file mode 100644
index 0000000..1ac8adb
--- /dev/null
+++ b/llm-logs/2026-04-09-184230-session-c9f15ca0.md
@@ -0,0 +1,2 @@
+# Session Log 2026-04-09-184230
+
diff --git a/planning/FINAL_PROJECT_SPRINT_PLAN.md b/planning/FINAL_PROJECT_SPRINT_PLAN.md
new file mode 100644
index 0000000..a2ff696
--- /dev/null
+++ b/planning/FINAL_PROJECT_SPRINT_PLAN.md
@@ -0,0 +1,397 @@
+# Final Project Sprint Plan — April 10 – May 3, 2026
+
+## Context
+This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:
+
+- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.
+- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.
+
+Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered "done" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.
+
+## Team
+5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI
+
+---
+
+## Sprint 4 — Deployment (April 10–19)
+
+Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.
+
+### Sprint 4 exit criteria (must be true before Sprint 5 starts)
+- Public Vercel frontend URL live on the apex domain
+- Public Railway backend URL live on `api.<frontend-domain>`
+- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton
+- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production
+- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations
+- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green
+- Branch protection on `main` with required checks
+- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current
+- README updated for user-facing and deployer-facing instructions
+- P6 submission package assembled (links, logs, reflection, LLM logs)
+
+### Sprint 4 key dates
+| Date | Milestone |
+|------|-----------|
+| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |
+| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |
+| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |
+| Apr 16 (Thu) | Branch protection enabled (#13) |
+| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |
+| Apr 19 (Sun) | P6 submission package complete (#15) |
+
+---
+
+## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)
+
+### Goal
+Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.
+
+### Scope anchor
+Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`
+- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)
+- Classes C1.1–C6.x per §3 / §4
+- APIs / public interfaces per §9 / §10
+- Acceptance criteria AC-1 through AC-10 per §14
+
+### Sprint 5 guardrails
+- All work on feature branches with PR review (branch protection is live from Sprint 4)
+- Every PR must pass `run-integration-tests` + unit workflows before merge
+- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only
+- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory
+- All destructive schema changes follow the expand/contract convention established in Sprint 4
+
+---
+
+### Phase A — SEO backend core (April 20–23)
+
+**S1. Meta tag generation service skeleton (M2)**
+- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGenerator` (CL-C2.5), and `MetaTagCache` per dev spec §3/§4
+- Wire Redis-backed `MetaTagCache` with configurable TTL
+- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)
+- Acceptance criteria:
+  - Classes C2.1–C2.6 exist with the method signatures named in dev spec §3/§4
+  - `TitleGenerator` enforces ≤60 char auto-generated titles; `DescriptionGenerator` enforces 50–160 char auto-generated descriptions (AC-2)
+  - `MetaTagCache` is backed by Redis (not process memory) and honors a configurable TTL
+  - On NLP/timeout failure, `MetaTagService` returns fallback tags and flags `needsRegeneration=true` (AC-9)
+  - Unit tests cover template application, length limits, sanitization, and fallback paths and pass in CI
+- Assignee: **declanblanc**
+- Backup: **acabrera04**
+- Due: Apr 22
+- Blocked by: Sprint 4 exit criteria
+
+**S2. Content analysis module (M3)**
+- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`
+- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout
+- Unit tests covering keyword extraction, summarization, and fallback paths
+- Acceptance criteria:
+  - Classes C3.1–C3.4 exist with the method signatures named in dev spec §3/§4
+  - `ContentAnalyzer.analyzeThread()` returns keywords, summary, and topic category for a fixture thread
+  - Deterministic fallback returns a valid (non-null) result within the configured timeout budget when the NLP path is stubbed to fail
+  - Unit tests cover stop-word filtering, frequency scoring, summarization, topic classification, and timeout/fallback paths
+- Assignee: **Aiden-Barrera**
+- Backup: **declanblanc**
+- Due: Apr 22
+- Blocked by: none (parallel with S1)
+
+**S3. Data schema + persistence for meta tag overrides (§11)**
+- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11
+- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas
+- Custom overrides must never be overwritten by background regeneration (AC-7)
+- Acceptance criteria:
+  - Prisma migration adds all fields in dev spec §11 and applies cleanly via the single Sprint 4 migration runner
+  - Migration is expand-only (no destructive drops) so it coexists with old `backend-api` replicas during rolling restart
+  - Persistence layer enforces that a background regeneration write cannot overwrite a non-null `customTitle` or `customDescription` (AC-7), verified by an integration test
+  - Schema is documented in `docs/deployment/deployment-architecture.md` or the SEO dev spec appendix
+- Assignee: **FardeenI**
+- Backup: **AvanishKulkarni**
+- Due: Apr 22
+- Blocked by: Sprint 4 migration-runner ownership
+
+**S4. Admin REST endpoints (§9, §10)**
+- Implement the admin-only meta-tag endpoints exactly as defined in dev spec §9/§10:
+  - `GET /api/admin/channels/{channelId}/meta-tags`
+  - `PUT /api/admin/channels/{channelId}/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)
+  - `POST /api/admin/channels/{channelId}/meta-tags/jobs` returning `jobId` with idempotency key (AC-5, AC-6)
+  - `GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` status polling
+- Authorization is **server admin only** per dev spec §12 ("Only server admins can set custom meta tags"). Channel creators/owners without the server-admin role must not reach these endpoints.
+- API integration tests for each endpoint
+- Acceptance criteria:
+  - All four endpoints are mounted under `/api/admin/channels/...` matching dev spec §9 paths exactly
+  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)
+  - `POST .../jobs` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)
+  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)
+  - All endpoints enforce server-admin authorization; non-admins (including channel creators without admin role) get 403
+  - Supertest integration tests cover success, validation failure, non-admin rejection, and idempotency
+- Assignee: **FardeenI**
+- Due: Apr 23
+- Blocked by: S1, S3
+
+---
+
+### Phase B — Background processing + visibility lifecycle (April 22–25)
+
+**S5. Background meta tag update worker (M4) on `backend-worker`**
+- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration
+- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus
+- Worker must run as singleton only (enforced by Sprint 4 topology)
+- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline
+- Acceptance criteria:
+  - `MetaTagUpdateWorker` runs only inside the `backend-worker` process; `backend-api` replicas do not subscribe to regeneration events
+  - Worker consumes `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events and schedules regeneration jobs
+  - Debounce/batch window collapses repeated events for the same channel into a single regeneration job within the configured window
+  - Worker restart does not duplicate in-flight jobs (job queue dedupes by channel + idempotency key)
+  - Integration test simulates burst traffic and asserts a single regeneration job is produced per debounce window
+- Assignee: **Aiden-Barrera**
+- Backup: **declanblanc**
+- Due: Apr 24
+- Blocked by: S1, S2
+
+**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**
+- Handle all three branches of the `VISIBILITY_CHANGED` event per dev spec §6 flow F8 and §9.1 cross-spec visibility contract:
+  - `→ PRIVATE`: invalidate `MetaTagCache` (`meta:channel:{channelId}`), purge CDN, remove sitemap URL, request search-engine removal; never serve stale tags while private
+  - `→ PUBLIC_NO_INDEX`: regenerate tags with `robots=noindex`, invalidate cache, keep channel publicly reachable but exclude from indexable sitemap set
+  - `→ PUBLIC_INDEXABLE`: high-priority regeneration, invalidate cache, keep canonical URL in sitemap with refreshed `lastmod`
+- Integration tests covering all three directions and cache/sitemap side effects
+- Acceptance criteria:
+  - `PUBLIC_INDEXABLE → PRIVATE` invalidates the `MetaTagCache` entry and removes the URL from the sitemap within one regeneration cycle (AC-4, AC-10)
+  - `PUBLIC_INDEXABLE → PUBLIC_NO_INDEX` regenerates with `robots=noindex`, invalidates cache, and removes the channel from the indexable sitemap set while the page remains publicly reachable
+  - `PRIVATE → PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX → PUBLIC_INDEXABLE` re-enqueue high-priority regeneration and the channel (re)appears in the sitemap
+  - Subsequent SSR requests return `noindex` meta where required and 404/403 public body for PRIVATE
+  - End-to-end integration test covers the full `PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE` matrix and asserts cache + sitemap state at each step
+- Assignee: **declanblanc**
+- Due: Apr 25
+- Blocked by: S5
+
+**S7. Security + content filtering (§12, AC-8)**
+- PII and profanity filters on generated titles/descriptions
+- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`
+- Unit tests with fixture content covering PII/profanity/XSS
+- Acceptance criteria:
+  - Generated tags for the PII/profanity fixture corpus contain no flagged content (AC-8)
+  - HTML/attribute injection attempts in `customTitle`/`customDescription` are escaped or rejected on write and on render
+  - `<head>` output for a crafted XSS fixture passes a snapshot test showing escaped output
+  - Filter behavior is covered by unit tests and documented in `docs/dev-spec-seo-meta-tag-generation.md` §12 cross-reference
+- Assignee: **AvanishKulkarni**
+- Backup: **Aiden-Barrera**
+- Due: Apr 25
+- Blocked by: S1
+
+---
+
+### Phase C — Frontend rendering + SEO surface (April 23–27)
+
+**S8. `PublicChannelPage` + `generateMetadata` integration (M1)**
+- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`
+- Use the Next.js **App Router** `generateMetadata` export in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx` (already scaffolded) to fetch tags from the backend at request time; JSON-LD is injected via a component in `page.tsx` since `Metadata` doesn't cover structured data
+- Use App Router route handlers / metadata routes (`app/sitemap.ts`, `app/robots.ts`) for crawler-facing entrypoints — do **not** introduce `getServerSideProps` or `pages/` router code
+- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain
+- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name="description">` (AC-1)
+- Acceptance criteria:
+  - Every public channel page SSR-renders non-empty `<title>` and `<meta name="description">` for the fixture corpus (AC-1)
+  - Open Graph, Twitter card, and JSON-LD `DiscussionForumPosting` tags are present and validate against Google Rich Results test
+  - Canonical URL is the frontend apex domain; no `<link rel="canonical">` or sitemap URL points at the API subdomain
+  - Meta tag fetch uses the backend API at request time and degrades to template fallback if the backend is unreachable
+  - E2E test (Playwright or crawler UA fetch) asserts tags on at least 3 representative public channels
+- Assignee: **declanblanc**
+- Due: Apr 26
+- Blocked by: S4, Sprint 4 #6 (frontend prod config)
+
+**S9. Sitemap + robots.txt finalization**
+- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain
+- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility
+- Smoke test that private channels do not appear in sitemap
+- Acceptance criteria:
+  - `https://<frontend-apex>/sitemap.xml` and `https://<frontend-apex>/robots.txt` resolve on the frontend apex domain (not the API subdomain)
+  - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `PRIVATE` channels are excluded
+  - Channels flipped to `PRIVATE` disappear from sitemap on the next regeneration cycle
+  - `robots.txt` allows crawling of public paths and disallows non-public areas
+  - Smoke test asserts sitemap exclusion behavior for a fixture private channel
+- Assignee: **AvanishKulkarni**
+- Backup: **FardeenI**
+- Due: Apr 27
+- Blocked by: S6, S8
+
+**S10. Meta tag admin UI (server-admin override flow)**
+- UI under server/channel admin settings for **server admins** to view generated tags, override title/description, and trigger manual regeneration with job status polling. Authorization matches dev spec §12: only server admins can set custom meta tags.
+- Respect `customTitle`/`customDescription` length limits with client-side validation
+- Talks to the admin endpoints from S4 (`/api/admin/channels/{channelId}/meta-tags` and `.../jobs/{jobId}`)
+- Acceptance criteria:
+  - Admin settings page exposes a "SEO Preview" section showing current generated + override values
+  - A server admin can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules
+  - A server admin can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`
+  - Non-admin users (including channel creators without the admin role) do not see the override UI
+  - Frontend unit tests cover validation, submit, job polling, and admin-vs-non-admin rendering
+- Assignee: **acabrera04**
+- Backup: **declanblanc**
+- Due: Apr 27
+- Blocked by: S4
+
+---
+
+### Phase D — End-to-end verification on production (April 27–30)
+
+**S11. Integration tests for SEO feature (local + cloud + isolated staging)**
+- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10
+- Split AC coverage by execution target so the read-only cloud rule from Sprint 4 is not violated:
+  - **Read-only paths against production deployed URLs:** AC-1 (tags present), AC-2 (length bounds on already-generated tags), AC-8 (no PII/profanity in fixture-safe public channels), and any AC that only needs fetch-and-assert
+  - **Write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10):** run against an **isolated staging environment** provisioned for Sprint 5 (separate Railway project/environment + isolated Postgres + isolated Redis + dedicated Vercel preview) so visibility flips, regeneration jobs, override persistence, and fallback injection never touch the instructor-reviewed production dataset
+  - `local` mode still runs the full AC-1..AC-10 matrix deterministically on seeded data and remains the CI source of truth
+- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)
+- Acceptance criteria:
+  - Test cases exist and are traceable one-to-one to AC-1 through AC-10 in dev spec §14
+  - Suite runs in `local` mode via `run-integration-tests.yml` and passes on PR with full AC-1..AC-10 coverage
+  - Read-only cloud mode runs against production URLs and does not mutate production data
+  - Write-path AC coverage runs against a documented isolated staging environment, documented alongside the Sprint 4 isolation rules in `docs/deployment/deployment-architecture.md`
+  - Crawler-UA fetches (`User-Agent: Googlebot`) of at least 3 public channels return non-empty `<title>`/`<meta name="description">` and valid JSON-LD
+  - Test output is captured as an artifact for submission evidence
+  - If the isolated staging environment cannot be provisioned in time, write-path ACs fall back to `local` evidence and the limitation is explicitly documented in the submission reflection
+- Assignee: **Aiden-Barrera**
+- Due: Apr 29
+- Blocked by: S8, S9, S10
+
+**S12. Deployed validation + evidence capture**
+- Run the read-only cloud portion of the SEO suite against the deployed production Vercel + Railway stack and the write-path portion against the isolated staging environment provisioned in S11
+- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, and visibility-driven sitemap/`noindex` behavior works across `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`
+- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch
+- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission
+- Acceptance criteria:
+  - Read-only cloud tests pass against the deployed production stack without mutating production data
+  - Write-path tests pass against the isolated staging stack
+  - Evidence bundle exists under `docs/submission/seo-evidence/` containing: crawler-view HTML, Rich Results test screenshots, replica-identity headers from at least two distinct `backend-api` replicas, and a cache-hit log sample
+  - Visibility transitions for all three states (`PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE`) are verified and captured as evidence (AC-4, AC-10)
+  - Tag output is identical across both API replicas for the same channel within one cache TTL
+  - Every AC-1..AC-10 item has at least one linked piece of evidence in the bundle, with the target environment (production / staging / local) labeled
+  - Any AC for which only `local` evidence exists is flagged explicitly in the bundle and the reflection
+- Assignee: **declanblanc**
+- Backup: **Aiden-Barrera**
+- Due: Apr 30
+- Blocked by: S11
+
+**S13. Bug bash + polish**
+- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime
+- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`
+- Fix must-fix items only; document the rest in the reflection
+- Acceptance criteria:
+  - Each developer logs at least one bug-bash session against the deployed stack and files GitHub issues for findings
+  - Every finding is triaged with a label (`must-fix-for-submission` or `known-limitation`)
+  - All `must-fix-for-submission` issues are merged to `main` and redeployed before S15 starts
+  - `known-limitation` issues are summarized in the reflection document
+  - Post-bash smoke run of the cloud integration suite is green
+- Assignee: **whole team**, coordinator: **FardeenI**
+- Due: May 1
+- Blocked by: S12
+
+---
+
+### Phase E — Final submission package (May 1–3)
+
+**S14. README + deployer guide final pass**
+- Fold SEO feature usage, override flow, and regeneration behavior into README
+- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)
+- Acceptance criteria:
+  - README documents: how to view generated SEO tags, how a server admin overrides them, and how regeneration is triggered
+  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value
+  - README links to the deployed frontend URL, backend URL, and submission evidence bundle
+  - A fresh contributor can follow README instructions to run the app locally and see SEO tags on a public channel
+- Assignee: **acabrera04**
+- Due: May 2
+- Blocked by: S10
+
+**S15. Final project submission package**
+- Compile final deliverable checklist:
+  - Public frontend URL + public backend URL (from Sprint 4)
+  - Links to every dev spec document under `docs/`
+  - Links to SEO feature PRs and commits
+  - Integration test specs + code + local/cloud run output
+  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)
+  - Branch protection screenshot
+  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)
+  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)
+  - LLM interaction logs under `llm-logs/` with model/version labels
+- Acceptance criteria:
+  - Every checklist item above has a resolved link or committed artifact (no TBDs)
+  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README
+  - All AC-1..AC-10 items map to evidence produced in S12
+  - Each developer is named against at least one deliverable in the contributions section
+  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD
+- Assignee: **acabrera04**
+- Backup: **FardeenI**
+- Due: May 3
+- Blocked by: S12, S13, S14
+
+**S16. Final reflection + retrospective**
+- Team retrospective on the full project (Sprints 1–5)
+- Each developer contributes a short written reflection to the submission doc
+- Acceptance criteria:
+  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)
+  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change
+  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off
+  - Known limitations from S13 are captured in the reflection with mitigation notes
+- Assignee: **whole team**, coordinator: **declanblanc**
+- Due: May 3
+- Blocked by: S15 draft
+
+---
+
+## Sprint 5 assignment summary
+
+| Developer | Issues | Focus |
+|-----------|--------|-------|
+| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |
+| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |
+| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |
+| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |
+| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |
+
+## Sprint 5 critical path
+
+```text
+S1 Meta tag service  ─┐
+S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐
+S3 Schema/migration  ─┘                           │
+                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission
+S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘
+S7 Security (needs S1) ──────────────────────────►
+S9 Sitemap (needs S6, S8) ───────────────────────►
+S10 Override UI (needs S4) ──────────────────────►
+                                                   S14 README (needs S10) ─► S15
+                                                   S16 Retrospective (parallel)
+```
+
+## Sprint 5 timeline
+
+| Date | Milestone |
+|------|-----------|
+| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |
+| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |
+| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |
+| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |
+| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |
+| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |
+| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |
+| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |
+| May 1 (Fri) | S13 bug bash complete; must-fix items merged |
+| May 2 (Sat) | S14 README final pass merged |
+| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |
+
+## Sprint 5 deliverables checklist
+
+The project is not complete until all of the following exist:
+
+- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified per the S11/S12 split-evidence model: read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against the deployed production Vercel + Railway stack; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment; full AC-1..AC-10 coverage in `local` mode in CI. Any AC falling back to `local`-only evidence must be explicitly flagged in the submission and reflection.
+- SEO meta tag generation service, content analysis, background worker, admin overrides API, and frontend App Router SSR integration merged to `main`
+- Server-admin override UI shipped (per dev spec §12 admin-only authorization)
+- Sitemap and robots.txt correctly respect all three visibility states (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`)
+- Local integration tests covering the full AC matrix passing in CI; read-only cloud + isolated staging suites passing out-of-band against their respective environments
+- Validation evidence bundle: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation — with each artifact labeled by target environment (production / staging / local)
+- README updated for SEO feature and any new env vars
+- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection
+- LLM interaction logs archived under `llm-logs/`
+- Team retrospective recorded
+
+## Notes
+
+- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).
+- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.
+- Tests targeting the production Vercel + Railway deployment remain read-only throughout Sprint 5 to protect the instructor-reviewed dataset. Any mutation-driven AC coverage runs against the isolated Sprint 5 staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview), per S11/S12.
+- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.
````

#### Tool: exec_command

```sh
rtk read .github/PR_REVIEW.md
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

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:20:06.094Z

The updated plan looks materially better. I’m checking for any unresolved review threads and one last consistency pass before I either approve or leave a final non-blocking note.

#### Tool: exec_command

```sh
gh api graphql -f query='query { repository(owner:"CS485-Harmony", name:"Harmony") { pullRequest(number:315) { reviewThreads(first:50) { nodes { id isResolved isOutdated path comments(first:10){nodes{id body author{login}} } } } } } }'
```

Output:

```text
{"data":{"repository":{"pullRequest":{"reviewThreads":{"nodes":[{"id":"PRRT_kwDORIrGY856P1a8","isResolved":true,"isOutdated":false,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","comments":{"nodes":[{"id":"PRRC_kwDORIrGY862zXHq","body":"S1 lists `StructuredDataGen`, but the SEO meta-tag dev spec’s class inventory uses `StructuredDataGenerator` (CL-C2.5). To avoid implementation confusion, align the class name here with the spec’s canonical name (or explicitly note any intentional deviation).","author":{"login":"copilot-pull-request-reviewer"}},{"id":"PRRC_kwDORIrGY862zj5c","body":"Fixed in 9dc07b4. Renamed to StructuredDataGenerator (CL-C2.5) in S1 to match the dev spec class inventory.","author":{"login":"AvanishKulkarni"}}]}},{"id":"PRRT_kwDORIrGY856P1bR","isResolved":true,"isOutdated":true,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","comments":{"nodes":[{"id":"PRRC_kwDORIrGY862zXID","body":"S4’s REST endpoints don’t match the dev spec’s Admin API interface (which defines `/api/admin/channels/{channelId}/meta-tags` for GET/PUT/POST and `/api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` for polling, with `Idempotency-Key` as a request header). Either update these paths/methods to match the spec or clarify that this plan intentionally introduces a different public/admin API surface.","author":{"login":"copilot-pull-request-reviewer"}},{"id":"PRRC_kwDORIrGY862zmFa","body":"Fixed in 9dc07b4. S4 endpoints now match the dev spec admin API exactly: GET/PUT /api/admin/channels/{channelId}/meta-tags, POST /api/admin/channels/{channelId}/meta-tags/jobs, GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}, with server-admin-only authorization per §12.","author":{"login":"AvanishKulkarni"}}]}},{"id":"PRRT_kwDORIrGY856P1bc","isResolved":true,"isOutdated":true,"path":"planning/FINAL_PROJECT_SPRINT_PLAN.md","comments":{"nodes":[{"id":"PRRC_kwDORIrGY862zXIV","body":"This task references `getServerSideProps`, but the frontend is already using the Next.js App Router (`src/app/...`) and `generateMetadata` for SSR meta tags (e.g., `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`). Consider updating the plan to reference App Router mechanisms (`generateMetadata`, metadata routes, route handlers) so the implementation guidance matches the current codebase.","author":{"login":"copilot-pull-request-reviewer"}},{"id":"PRRC_kwDORIrGY862zj-J","body":"Fixed in 9dc07b4. S8 now uses the App Router generateMetadata export in harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx and App Router metadata routes (app/sitemap.ts, app/robots.ts), and explicitly forbids introducing getServerSideProps or pages/ router code.","author":{"login":"AvanishKulkarni"}}]}}]}}}}}
```

#### Tool: exec_command

```sh
rtk grep -n "production evidence captured for AC-1..AC-10|deployed Vercel \+ Railway stack|Creator override UI|server-admin override UI|split-evidence model|PUBLIC_NO_INDEX" /tmp/harmony-pr315/planning/FINAL_PROJECT_SPRINT_PLAN.md
```

Output:

```text
🔍 9 in 2F:

📄 /.../planning/FINAL_PROJECT_SPRINT_PLAN.md (8):
    47: Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + ...
   195: - `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility
   199: - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `P...
   241: - Run cloud-target SEO integration suite against the deployed Vercel + Railwa...
   246: - Cloud integration suite passes against the deployed Vercel + Railway stack
   358: | Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |
   367: - All SEO dev-spec acceptance criteria AC-1 through AC-10 verified against th...
   369: - Creator override UI shipped

📄 7 (1):
     0: ** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta...
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:20:15.976Z

I’m not finding any remaining blocking issues in the current head. The prior spec-drift and validation problems have been corrected, and the remaining review threads are already resolved. I’m posting an approval now.

#### Tool: exec_command

```sh
cat > /tmp/pr315-approve.md <<'EOF'
- [x] **Prioritize Logic over Style:** The earlier planning inconsistencies have been corrected, and the current document is logically consistent with the implementation path it describes.
- [x] **Security First:** The override and regeneration flows now consistently use the server-admin-only authorization model from the SEO spec.
- [x] **Architectural Alignment:** The updated plan now matches the SEO and channel-visibility specs on API surface, visibility-state handling, and Next.js App Router usage.
- [x] **Issue Completion:** The acceptance-criteria mapping is now covered through the split-evidence model across local, production read-only, and isolated staging validation.
- [x] **No Nitpicking:** No remaining issues are stylistic; I am not calling out any non-essential wording.
- [x] **Avoid Repetition:** Earlier concerns were re-checked and appear addressed in the new commits.
- [x] **Iterative Reviews:** I reviewed the updated head specifically against the prior change requests and confirmed the previously blocking issues were fixed.
- [x] **Prevent CI Failures:** This remains a documentation-only PR and I do not see new problems that would obviously break the pipeline or misdirect implementation.

No findings. The previously reported blockers around production-vs-staging validation, admin endpoint/auth drift, `PUBLIC_NO_INDEX` handling, App Router guidance, and the stale final checklist language all appear to be resolved in the current version of `planning/FINAL_PROJECT_SPRINT_PLAN.md`.
EOF

gh pr review 315 --repo CS485-Harmony/Harmony --approve --body-file /tmp/pr315-approve.md
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-10T22:20:25.951Z

Posted an `APPROVE` review on PR `#315`.

I re-checked the current head against the earlier blockers and didn’t find any remaining review findings.
