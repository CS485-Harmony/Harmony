# Final Project Sprint Plan — April 10 – May 3, 2026

## Context
This plan covers the remaining work required to finish Harmony (search-engine-indexable chat app) from today (2026-04-10) through 2026-05-03. It spans two sprints:

- **Sprint 4 — Deployment (April 10–19):** execute `planning/SPRINT_4_PLAN.md` (P6 Deployment on Vercel + Railway). That plan is already detailed and not re-derived here — this doc references it and tracks it as a milestone.
- **Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3):** finish the SEO Meta Tag Generation feature against `docs/dev-spec-seo-meta-tag-generation.md`, verify it on the deployed Vercel + Railway stack, and produce the final project submission package.

Harmony's headline feature is SEO-indexable public channels, so the project cannot be considered "done" until the SEO meta tag generation feature's acceptance criteria (AC-1 through AC-10 in §14 of the dev spec) are satisfied against the live production deployment.

## Team
5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI

---

## Sprint 4 — Deployment (April 10–19)

Sprint 4 is defined in detail in `planning/SPRINT_4_PLAN.md`. This section only restates milestones and exit criteria so Sprint 5 can assume a concrete starting state.

### Sprint 4 exit criteria (must be true before Sprint 5 starts)
- Public Vercel frontend URL live on the apex domain
- Public Railway backend URL live on `api.<frontend-domain>`
- `backend-api` running with **2+ replicas**; `backend-worker` running as singleton
- Redis-backed shared rate limiting and Cloudflare R2 attachment storage in production
- Single-owner Prisma migration runner; `backend-api` replicas do not race migrations
- `.github/workflows/run-integration-tests.yml`, `deploy-railway.yml`, `deploy-vercel.yml` merged and green
- Branch protection on `main` with required checks
- `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md` committed and current
- README updated for user-facing and deployer-facing instructions
- P6 submission package assembled (links, logs, reflection, LLM logs)

### Sprint 4 key dates
| Date | Milestone |
|------|-----------|
| Apr 11 (Sat) | Architecture + scale audit locked (#1, #2) |
| Apr 12 (Sun) | API/worker split done; CD workflows scaffolded (#5, #11, #12) |
| Apr 14 (Tue) | Vercel live, integration tests running local + cloud (#9, #16) |
| Apr 16 (Thu) | Branch protection enabled (#13) |
| Apr 18 (Sat) | Multi-replica validation evidence captured (#14) |
| Apr 19 (Sun) | P6 submission package complete (#15) |

---

## Sprint 5 — SEO Feature Completion, Polish, and Final Submission (April 20 – May 3)

### Goal
Ship the SEO Meta Tag Generation feature end-to-end on the deployed Vercel + Railway stack, verified against dev spec §14 acceptance criteria, and deliver the final project submission package by Sunday, May 3.

### Scope anchor
Dev spec: `docs/dev-spec-seo-meta-tag-generation.md`
- Modules M1–M5 (page rendering, meta tag generation, content analysis, background processing, caching)
- Classes C1.1–C6.x per §3 / §4
- APIs / public interfaces per §9 / §10
- Acceptance criteria AC-1 through AC-10 per §14

### Sprint 5 guardrails
- All work on feature branches with PR review (branch protection is live from Sprint 4)
- Every PR must pass `run-integration-tests` + unit workflows before merge
- No backend code that re-introduces process-local singletons on `backend-api` replicas — new SEO subscribers/workers land on `backend-worker` only
- Cache writes go through Redis (`MetaTagCache` / C2.6), not process memory
- All destructive schema changes follow the expand/contract convention established in Sprint 4

---

### Phase A — SEO backend core (April 20–23)

**S1. Meta tag generation service skeleton (M2)**
- Implement `MetaTagService`, `TitleGenerator`, `DescriptionGenerator`, `OpenGraphGenerator`, `StructuredDataGenerator` (CL-C2.5), and `MetaTagCache` per dev spec §3/§4
- Wire Redis-backed `MetaTagCache` with configurable TTL
- Unit tests for template application, length limits (AC-2), sanitization, fallback behavior (AC-9)
- Acceptance criteria:
  - Classes C2.1–C2.6 exist with the method signatures named in dev spec §3/§4
  - `TitleGenerator` enforces ≤60 char auto-generated titles; `DescriptionGenerator` enforces 50–160 char auto-generated descriptions (AC-2)
  - `MetaTagCache` is backed by Redis (not process memory) and honors a configurable TTL
  - On NLP/timeout failure, `MetaTagService` returns fallback tags and flags `needsRegeneration=true` (AC-9)
  - Unit tests cover template application, length limits, sanitization, and fallback paths and pass in CI
- Assignee: **declanblanc**
- Backup: **acabrera04**
- Due: Apr 22
- Blocked by: Sprint 4 exit criteria

**S2. Content analysis module (M3)**
- Implement `ContentAnalyzer`, `KeywordExtractor`, `TextSummarizer`, `TopicClassifier`
- Ensure deterministic fallbacks so `MetaTagService` can degrade to template-only output on NLP timeout
- Unit tests covering keyword extraction, summarization, and fallback paths
- Acceptance criteria:
  - Classes C3.1–C3.4 exist with the method signatures named in dev spec §3/§4
  - `ContentAnalyzer.analyzeThread()` returns keywords, summary, and topic category for a fixture thread
  - Deterministic fallback returns a valid (non-null) result within the configured timeout budget when the NLP path is stubbed to fail
  - Unit tests cover stop-word filtering, frequency scoring, summarization, topic classification, and timeout/fallback paths
- Assignee: **Aiden-Barrera**
- Backup: **declanblanc**
- Due: Apr 22
- Blocked by: none (parallel with S1)

**S3. Data schema + persistence for meta tag overrides (§11)**
- Prisma migration for meta tag storage fields (`customTitle`, `customDescription`, `needsRegeneration`, cache metadata) per dev spec §11
- Respect Sprint 4 expand/contract migration rules so rollout is safe with 2+ API replicas
- Custom overrides must never be overwritten by background regeneration (AC-7)
- Acceptance criteria:
  - Prisma migration adds all fields in dev spec §11 and applies cleanly via the single Sprint 4 migration runner
  - Migration is expand-only (no destructive drops) so it coexists with old `backend-api` replicas during rolling restart
  - Persistence layer enforces that a background regeneration write cannot overwrite a non-null `customTitle` or `customDescription` (AC-7), verified by an integration test
  - Schema is documented in `docs/deployment/deployment-architecture.md` or the SEO dev spec appendix
- Assignee: **FardeenI**
- Backup: **AvanishKulkarni**
- Due: Apr 22
- Blocked by: Sprint 4 migration-runner ownership

**S4. Admin REST endpoints (§9, §10)**
- Implement the admin-only meta-tag endpoints exactly as defined in dev spec §9/§10:
  - `GET /api/admin/channels/{channelId}/meta-tags`
  - `PUT /api/admin/channels/{channelId}/meta-tags` with override validation (customTitle ≤70, customDescription ≤200 — AC-3)
  - `POST /api/admin/channels/{channelId}/meta-tags/jobs` returning `jobId` with idempotency key (AC-5, AC-6)
  - `GET /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}` status polling
- Authorization is **server admin only** per dev spec §12 ("Only server admins can set custom meta tags"). Channel creators/owners without the server-admin role must not reach these endpoints.
- API integration tests for each endpoint
- Acceptance criteria:
  - All four endpoints are mounted under `/api/admin/channels/...` matching dev spec §9 paths exactly
  - `PUT` rejects `customTitle >70` and `customDescription >200` with a validation error (AC-3)
  - `POST .../jobs` returns a `jobId` and the status endpoint reports terminal states `succeeded`/`failed` (AC-5)
  - Repeat `POST` with the same idempotency key within 60s returns the existing `jobId` and does not enqueue a duplicate job (AC-6)
  - All endpoints enforce server-admin authorization; non-admins (including channel creators without admin role) get 403
  - Supertest integration tests cover success, validation failure, non-admin rejection, and idempotency
- Assignee: **FardeenI**
- Due: Apr 23
- Blocked by: S1, S3

---

### Phase B — Background processing + visibility lifecycle (April 22–25)

**S5. Background meta tag update worker (M4) on `backend-worker`**
- Implement `MetaTagUpdateWorker`, `EventListener`, and job queue integration
- Subscribe to `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events on the shared Redis event bus
- Worker must run as singleton only (enforced by Sprint 4 topology)
- Debounce/batch regeneration so noisy channels don't overwhelm the pipeline
- Acceptance criteria:
  - `MetaTagUpdateWorker` runs only inside the `backend-worker` process; `backend-api` replicas do not subscribe to regeneration events
  - Worker consumes `MessageCreated`, `MessageEdited`, `MessageDeleted`, `VisibilityChanged` events and schedules regeneration jobs
  - Debounce/batch window collapses repeated events for the same channel into a single regeneration job within the configured window
  - Worker restart does not duplicate in-flight jobs (job queue dedupes by channel + idempotency key)
  - Integration test simulates burst traffic and asserts a single regeneration job is produced per debounce window
- Assignee: **Aiden-Barrera**
- Backup: **declanblanc**
- Due: Apr 24
- Blocked by: S1, S2

**S6. Visibility transition + de-indexing workflow (AC-4, AC-10)**
- Handle all three branches of the `VISIBILITY_CHANGED` event per dev spec §6 flow F8 and §9.1 cross-spec visibility contract:
  - `→ PRIVATE`: invalidate `MetaTagCache` (`meta:channel:{channelId}`), purge CDN, remove sitemap URL, request search-engine removal; never serve stale tags while private
  - `→ PUBLIC_NO_INDEX`: regenerate tags with `robots=noindex`, invalidate cache, keep channel publicly reachable but exclude from indexable sitemap set
  - `→ PUBLIC_INDEXABLE`: high-priority regeneration, invalidate cache, keep canonical URL in sitemap with refreshed `lastmod`
- Integration tests covering all three directions and cache/sitemap side effects
- Acceptance criteria:
  - `PUBLIC_INDEXABLE → PRIVATE` invalidates the `MetaTagCache` entry and removes the URL from the sitemap within one regeneration cycle (AC-4, AC-10)
  - `PUBLIC_INDEXABLE → PUBLIC_NO_INDEX` regenerates with `robots=noindex`, invalidates cache, and removes the channel from the indexable sitemap set while the page remains publicly reachable
  - `PRIVATE → PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX → PUBLIC_INDEXABLE` re-enqueue high-priority regeneration and the channel (re)appears in the sitemap
  - Subsequent SSR requests return `noindex` meta where required and 404/403 public body for PRIVATE
  - End-to-end integration test covers the full `PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE` matrix and asserts cache + sitemap state at each step
- Assignee: **declanblanc**
- Due: Apr 25
- Blocked by: S5

**S7. Security + content filtering (§12, AC-8)**
- PII and profanity filters on generated titles/descriptions
- Ensure overrides and generated tags cannot inject HTML/attributes into rendered `<head>`
- Unit tests with fixture content covering PII/profanity/XSS
- Acceptance criteria:
  - Generated tags for the PII/profanity fixture corpus contain no flagged content (AC-8)
  - HTML/attribute injection attempts in `customTitle`/`customDescription` are escaped or rejected on write and on render
  - `<head>` output for a crafted XSS fixture passes a snapshot test showing escaped output
  - Filter behavior is covered by unit tests and documented in `docs/dev-spec-seo-meta-tag-generation.md` §12 cross-reference
- Assignee: **AvanishKulkarni**
- Backup: **Aiden-Barrera**
- Due: Apr 25
- Blocked by: S1

---

### Phase C — Frontend rendering + SEO surface (April 23–27)

**S8. `PublicChannelPage` + `generateMetadata` integration (M1)**
- Server-render meta tags, Open Graph tags, Twitter cards, canonical URL, and JSON-LD `DiscussionForumPosting`
- Use the Next.js **App Router** `generateMetadata` export in `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx` (already scaffolded) to fetch tags from the backend at request time; JSON-LD is injected via a component in `page.tsx` since `Metadata` doesn't cover structured data
- Use App Router route handlers / metadata routes (`app/sitemap.ts`, `app/robots.ts`) for crawler-facing entrypoints — do **not** introduce `getServerSideProps` or `pages/` router code
- Canonical host is the frontend apex domain per Sprint 4 SEO ownership decision — no crawler-facing artifact may point at the API subdomain
- Unit/E2E tests: every public channel page serves non-empty `<title>` and `<meta name="description">` (AC-1)
- Acceptance criteria:
  - Every public channel page SSR-renders non-empty `<title>` and `<meta name="description">` for the fixture corpus (AC-1)
  - Open Graph, Twitter card, and JSON-LD `DiscussionForumPosting` tags are present and validate against Google Rich Results test
  - Canonical URL is the frontend apex domain; no `<link rel="canonical">` or sitemap URL points at the API subdomain
  - Meta tag fetch uses the backend API at request time and degrades to template fallback if the backend is unreachable
  - E2E test (Playwright or crawler UA fetch) asserts tags on at least 3 representative public channels
- Assignee: **declanblanc**
- Due: Apr 26
- Blocked by: S4, Sprint 4 #6 (frontend prod config)

**S9. Sitemap + robots.txt finalization**
- Ensure Next.js route handlers for sitemap/sitemap index fetch from backend at request time and serve under the frontend apex domain
- `robots.txt` respects `PUBLIC_NO_INDEX` and `PRIVATE` visibility
- Smoke test that private channels do not appear in sitemap
- Acceptance criteria:
  - `https://<frontend-apex>/sitemap.xml` and `https://<frontend-apex>/robots.txt` resolve on the frontend apex domain (not the API subdomain)
  - Sitemap includes only `PUBLIC_INDEXABLE` channels; `PUBLIC_NO_INDEX` and `PRIVATE` channels are excluded
  - Channels flipped to `PRIVATE` disappear from sitemap on the next regeneration cycle
  - `robots.txt` allows crawling of public paths and disallows non-public areas
  - Smoke test asserts sitemap exclusion behavior for a fixture private channel
- Assignee: **AvanishKulkarni**
- Backup: **FardeenI**
- Due: Apr 27
- Blocked by: S6, S8

**S10. Meta tag admin UI (server-admin override flow)**
- UI under server/channel admin settings for **server admins** to view generated tags, override title/description, and trigger manual regeneration with job status polling. Authorization matches dev spec §12: only server admins can set custom meta tags.
- Respect `customTitle`/`customDescription` length limits with client-side validation
- Talks to the admin endpoints from S4 (`/api/admin/channels/{channelId}/meta-tags` and `.../jobs/{jobId}`)
- Acceptance criteria:
  - Admin settings page exposes a "SEO Preview" section showing current generated + override values
  - A server admin can submit `customTitle` (≤70) and `customDescription` (≤200) with inline validation matching server-side rules
  - A server admin can trigger regeneration and sees live job status transitioning through `pending` → `succeeded`/`failed`
  - Non-admin users (including channel creators without the admin role) do not see the override UI
  - Frontend unit tests cover validation, submit, job polling, and admin-vs-non-admin rendering
- Assignee: **acabrera04**
- Backup: **declanblanc**
- Due: Apr 27
- Blocked by: S4

---

### Phase D — End-to-end verification on production (April 27–30)

**S11. Integration tests for SEO feature (local + cloud + isolated staging)**
- Extend the Sprint 4 integration test suite with cases covering AC-1 through AC-10
- Split AC coverage by execution target so the read-only cloud rule from Sprint 4 is not violated:
  - **Read-only paths against production deployed URLs:** AC-1 (tags present), AC-2 (length bounds on already-generated tags), AC-8 (no PII/profanity in fixture-safe public channels), and any AC that only needs fetch-and-assert
  - **Write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10):** run against an **isolated staging environment** provisioned for Sprint 5 (separate Railway project/environment + isolated Postgres + isolated Redis + dedicated Vercel preview) so visibility flips, regeneration jobs, override persistence, and fallback injection never touch the instructor-reviewed production dataset
  - `local` mode still runs the full AC-1..AC-10 matrix deterministically on seeded data and remains the CI source of truth
- Add test cases for crawler view of public pages (fetch as Googlebot UA, assert tags present)
- Acceptance criteria:
  - Test cases exist and are traceable one-to-one to AC-1 through AC-10 in dev spec §14
  - Suite runs in `local` mode via `run-integration-tests.yml` and passes on PR with full AC-1..AC-10 coverage
  - Read-only cloud mode runs against production URLs and does not mutate production data
  - Write-path AC coverage runs against a documented isolated staging environment, documented alongside the Sprint 4 isolation rules in `docs/deployment/deployment-architecture.md`
  - Crawler-UA fetches (`User-Agent: Googlebot`) of at least 3 public channels return non-empty `<title>`/`<meta name="description">` and valid JSON-LD
  - Test output is captured as an artifact for submission evidence
  - If the isolated staging environment cannot be provisioned in time, write-path ACs fall back to `local` evidence and the limitation is explicitly documented in the submission reflection
- Assignee: **Aiden-Barrera**
- Due: Apr 29
- Blocked by: S8, S9, S10

**S12. Deployed validation + evidence capture**
- Run the read-only cloud portion of the SEO suite against the deployed production Vercel + Railway stack and the write-path portion against the isolated staging environment provisioned in S11
- Verify: meta tags render through the Vercel edge, cache hits are served from Redis, background regeneration triggered by worker reaches the cache observable by both API replicas, and visibility-driven sitemap/`noindex` behavior works across `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`
- Use Sprint 4 replica observability (instance identity headers/logs) to confirm tags render consistently regardless of which `backend-api` replica served the SSR fetch
- Capture screenshots, crawler-view HTML, and structured-data validator output (Google Rich Results test) for submission
- Acceptance criteria:
  - Read-only cloud tests pass against the deployed production stack without mutating production data
  - Write-path tests pass against the isolated staging stack
  - Evidence bundle exists under `docs/submission/seo-evidence/` containing: crawler-view HTML, Rich Results test screenshots, replica-identity headers from at least two distinct `backend-api` replicas, and a cache-hit log sample
  - Visibility transitions for all three states (`PUBLIC_INDEXABLE ↔ PUBLIC_NO_INDEX ↔ PRIVATE`) are verified and captured as evidence (AC-4, AC-10)
  - Tag output is identical across both API replicas for the same channel within one cache TTL
  - Every AC-1..AC-10 item has at least one linked piece of evidence in the bundle, with the target environment (production / staging / local) labeled
  - Any AC for which only `local` evidence exists is flagged explicitly in the bundle and the reflection
- Assignee: **declanblanc**
- Backup: **Aiden-Barrera**
- Due: Apr 30
- Blocked by: S11

**S13. Bug bash + polish**
- Full-team bug bash across deployed app: auth, channels, messaging, attachments, SEO, realtime
- Triage to `must-fix-for-submission` vs `accept-as-known-limitation`
- Fix must-fix items only; document the rest in the reflection
- Acceptance criteria:
  - Each developer logs at least one bug-bash session against the deployed stack and files GitHub issues for findings
  - Every finding is triaged with a label (`must-fix-for-submission` or `known-limitation`)
  - All `must-fix-for-submission` issues are merged to `main` and redeployed before S15 starts
  - `known-limitation` issues are summarized in the reflection document
  - Post-bash smoke run of the cloud integration suite is green
- Assignee: **whole team**, coordinator: **FardeenI**
- Due: May 1
- Blocked by: S12

---

### Phase E — Final submission package (May 1–3)

**S14. README + deployer guide final pass**
- Fold SEO feature usage, override flow, and regeneration behavior into README
- Update deployer guide with any new env vars introduced in Phase A–C (NLP keys, R2 bucket for OG images if any, etc.)
- Acceptance criteria:
  - README documents: how to view generated SEO tags, how a server admin overrides them, and how regeneration is triggered
  - Deployer guide lists every new env var added during Sprint 5 with purpose and example value
  - README links to the deployed frontend URL, backend URL, and submission evidence bundle
  - A fresh contributor can follow README instructions to run the app locally and see SEO tags on a public channel
- Assignee: **acabrera04**
- Due: May 2
- Blocked by: S10

**S15. Final project submission package**
- Compile final deliverable checklist:
  - Public frontend URL + public backend URL (from Sprint 4)
  - Links to every dev spec document under `docs/`
  - Links to SEO feature PRs and commits
  - Integration test specs + code + local/cloud run output
  - All GitHub Actions workflow links (`run-integration-tests`, `deploy-vercel`, `deploy-railway`)
  - Branch protection screenshot
  - Acceptance criteria AC-1..AC-10 verification evidence (from S12)
  - Reflection document (lessons learned, what worked, what didn't, per-developer contributions)
  - LLM interaction logs under `llm-logs/` with model/version labels
- Acceptance criteria:
  - Every checklist item above has a resolved link or committed artifact (no TBDs)
  - Submission document lives in `planning/FINAL_SUBMISSION.md` or `docs/submission/` and is linked from the README
  - All AC-1..AC-10 items map to evidence produced in S12
  - Each developer is named against at least one deliverable in the contributions section
  - Submission is reviewed and signed off by at least one other teammate before May 3 EOD
- Assignee: **acabrera04**
- Backup: **FardeenI**
- Due: May 3
- Blocked by: S12, S13, S14

**S16. Final reflection + retrospective**
- Team retrospective on the full project (Sprints 1–5)
- Each developer contributes a short written reflection to the submission doc
- Acceptance criteria:
  - Retrospective meeting held with all 5 developers attending (synchronously or async with written input)
  - Each developer submits a ≥150-word written reflection covering what they built, what they learned, and what they would change
  - Consolidated retrospective section merged into `FINAL_SUBMISSION.md` before S15 sign-off
  - Known limitations from S13 are captured in the reflection with mitigation notes
- Assignee: **whole team**, coordinator: **declanblanc**
- Due: May 3
- Blocked by: S15 draft

---

## Sprint 5 assignment summary

| Developer | Issues | Focus |
|-----------|--------|-------|
| acabrera04 | S10, S14, S15 | Override UI, README, final submission package |
| Aiden-Barrera | S2, S5, S11 | Content analysis, background worker, SEO integration tests |
| AvanishKulkarni | S7, S9 | Security filters, sitemap/robots |
| declanblanc | S1, S6, S8, S12, S16 | Meta tag service core, visibility lifecycle, frontend rendering, prod validation |
| FardeenI | S3, S4, S13 coordinator | Schema/migration, API endpoints, bug bash coordination |

## Sprint 5 critical path

```text
S1 Meta tag service  ─┐
S2 Content analysis  ─┼─► S4 APIs ─► S8 Frontend ─┐
S3 Schema/migration  ─┘                           │
                                                  ├─► S11 SEO tests ─► S12 Prod validation ─► S13 Bug bash ─► S15 Submission
S5 Worker (needs S1, S2) ─► S6 Visibility ────────┘
S7 Security (needs S1) ──────────────────────────►
S9 Sitemap (needs S6, S8) ───────────────────────►
S10 Override UI (needs S4) ──────────────────────►
                                                   S14 README (needs S10) ─► S15
                                                   S16 Retrospective (parallel)
```

## Sprint 5 timeline

| Date | Milestone |
|------|-----------|
| Apr 20 (Mon) | Sprint 5 kickoff; Phase A work begins on feature branches |
| Apr 22 (Wed) | S1, S2, S3 merged (backend core + schema) |
| Apr 23 (Thu) | S4 merged (SEO APIs live); Phase B starts |
| Apr 25 (Sat) | S5, S6, S7 merged (worker + visibility + security) |
| Apr 26 (Sun) | S8 merged (frontend SSR meta tag rendering) |
| Apr 27 (Mon) | S9, S10 merged (sitemap, override UI) |
| Apr 29 (Wed) | S11 merged; SEO integration tests running in CI and cloud |
| Apr 30 (Thu) | S12 complete; production evidence captured for AC-1..AC-10 |
| May 1 (Fri) | S13 bug bash complete; must-fix items merged |
| May 2 (Sat) | S14 README final pass merged |
| May 3 (Sun) | S15 submission package delivered; S16 retrospective complete |

## Sprint 5 deliverables checklist

The project is not complete until all of the following exist:

- All SEO dev-spec acceptance criteria AC-1 through AC-10 verified per the S11/S12 split-evidence model: read-only ACs (AC-1, AC-2, AC-8 fixture-safe) against the deployed production Vercel + Railway stack; write-path ACs (AC-3, AC-4, AC-5, AC-6, AC-7, AC-9, AC-10) against the isolated staging environment; full AC-1..AC-10 coverage in `local` mode in CI. Any AC falling back to `local`-only evidence must be explicitly flagged in the submission and reflection.
- SEO meta tag generation service, content analysis, background worker, admin overrides API, and frontend App Router SSR integration merged to `main`
- Server-admin override UI shipped (per dev spec §12 admin-only authorization)
- Sitemap and robots.txt correctly respect all three visibility states (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`)
- Local integration tests covering the full AC matrix passing in CI; read-only cloud + isolated staging suites passing out-of-band against their respective environments
- Validation evidence bundle: crawler-view HTML, Rich Results test output, cache/regeneration screenshots, replica-observability confirmation — with each artifact labeled by target environment (production / staging / local)
- README updated for SEO feature and any new env vars
- Final submission package in `planning/` or `docs/submission/` with links, logs, and reflection
- LLM interaction logs archived under `llm-logs/`
- Team retrospective recorded

## Notes

- Sprint 4 must hit its exit criteria by April 19 or Sprint 5's Phase A will slip. If Sprint 4 slips, cut Sprint 5 Phase C non-essentials (e.g., S10 override UI can degrade to backend-only override via API + curl documented in README).
- If NLP/summarization work (S2) is at risk, fall back to the template-only path in dev spec §14 fallback (AC-9) and document the degradation.
- Tests targeting the production Vercel + Railway deployment remain read-only throughout Sprint 5 to protect the instructor-reviewed dataset. Any mutation-driven AC coverage runs against the isolated Sprint 5 staging environment (separate Railway project + isolated Postgres + isolated Redis + dedicated Vercel preview), per S11/S12.
- Keep `tasks/todo.md` and GitHub Issues in sync per `WORKFLOW.md`; every Sprint 5 item above should become a GitHub Issue on the Harmony Project Board at Sprint 5 kickoff on April 20.
