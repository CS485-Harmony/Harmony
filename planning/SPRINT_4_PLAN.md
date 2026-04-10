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
  - README and env matrix document storage setup
  - Attachment flow works end-to-end in deployed environment
- Assignee: **AvanishKulkarni**
- Due: April 11
- Blocked by: #2
- Unblocks: #14, #15

**5. Split `backend-api` and Singleton `backend-worker`**
- Move background-only startup behavior into a dedicated worker process
- Ensure duplicated subscribers / cache invalidation / sitemap upkeep do not run on every API replica
- Keep API replicas focused on HTTP/tRPC/SSE request handling
- Use **Redis pub/sub fan-out** as the explicit SSE strategy so each API replica can deliver shared events to its own connected clients without sticky-session requirements
- Add lightweight replica observability for validation:
  - instance identity in structured logs
  - instance/replica identity on health output and/or response headers
- Add startup commands for both Railway backend services
- Use `docs/deployment/replica-readiness-audit.md` to drive the split and record the final `backend-api` / `backend-worker` ownership model there and in `docs/deployment/deployment-architecture.md`
- Acceptance criteria:
  - `backend-api` can run with 2+ replicas without duplicate singleton background side effects
  - `backend-worker` runs with 1 replica and owns singleton event-driven tasks
  - SSE behavior across 2+ replicas follows the documented Redis fan-out strategy and no sticky-session dependency remains in the production design
  - Replica identity is externally observable enough to prove load balancing across 2+ API replicas
  - `backend-worker` health check and restart expectations are documented and wired into deployment assumptions
  - Service responsibilities are documented
- Assignee: **declanblanc**
- Backup owner: **acabrera04**
- Due: April 12
- Blocked by: #2
- Unblocks: #7, #11, #14

### Phase 2: Frontend and Integration Foundations — April 10–13

**6. Frontend Production Configuration for Vercel**
- Add production-safe frontend configuration:
  - absolute canonical URLs
  - `metadataBase`
  - `robots.txt` on the frontend apex domain
  - sitemap support on the frontend apex domain
  - production API base URL handling
- Make the SEO ownership boundary explicit:
  - frontend apex domain owns the canonical public SEO artifacts: canonical URLs, `metadataBase`, `robots.txt`, sitemap entrypoints, and any sitemap index exposed to crawlers
  - frontend sitemap entrypoints are implemented through Next.js route handlers that fetch backend sitemap/XML data at request time
  - backend SEO routes may continue to generate sitemap/XML data as an internal or transitional source, but they are not the canonical crawler-facing host in production
  - no SEO artifact should require crawlers to use the API subdomain as the primary source of truth
- Ensure frontend still supports localhost development cleanly
- Use `docs/deployment/deployment-architecture.md` as the source of truth for domain ownership, public URLs, and SEO host decisions
- Acceptance criteria:
  - Public pages generate correct production metadata
  - Canonical host ownership is explicit and consistent across frontend and backend docs/code
  - Frontend/API cross-origin auth behavior is consistent with the documented auth and CORS contract
  - Frontend can target local and cloud backends without code edits
  - SEO-critical pages render correctly on the public domain
- Assignee: **declanblanc**
- Backup owner: **AvanishKulkarni**
- Due: April 11
- Blocked by: #1
- Unblocks: #12, #16

**7. Railway Project Provisioning and Service Wiring**
- Create/configure the Railway project and services:
  - `backend-api`
  - `backend-worker`
  - `postgres`
  - `redis`
- Configure internal networking, service env vars, health checks, deploy commands, and domains
- Ensure `backend-api` and `backend-worker` both connect to the same Postgres and Redis instances
- Provision services and env vars to match `docs/deployment/deployment-architecture.md`, and use `docs/deployment/replica-readiness-audit.md` for replica-safety requirements
- Acceptance criteria:
  - Railway project is provisioned
  - Domains/env vars/health checks are configured
  - Postgres and Redis env vars use Railway private/internal connection strings for service-to-service traffic
  - Backend CORS and auth-related env/config are aligned with the documented frontend/API contract
  - `backend-worker` has a health check and restart-on-failure behavior configured
  - `backend-api` and `backend-worker` both boot successfully in Railway
- Assignee: **FardeenI**
- Backup owner: **Aiden-Barrera**
- Due: April 13
- Blocked by: #1, #5
- Unblocks: #11, #14, #15

**8. Integration Test Specification**
- Write an English-language integration test specification for all frontend-backend code paths that must work in deployment
- Cover at least:
  - guest public channel rendering
  - login / auth refresh path
  - public API path used by SSR metadata/page rendering
  - visibility change impact on public indexing behavior
  - attachment path if production storage is in scope
  - SSE/realtime smoke behavior if kept in deployed flow
- Declare the cloud-mode data-isolation strategy:
  - default choice for this sprint is **read-only cloud smoke coverage** against deployed URLs
  - any write-path cloud tests require a separately documented isolated environment before they are allowed
- Reference `docs/deployment/deployment-architecture.md` for deployment topology and `docs/deployment/replica-readiness-audit.md` for replica-sensitive scenarios that need validation
- Acceptance criteria:
  - Every FE-BE pathway has at least one test case
  - Spec includes local-only vs cloud-only notes where relevant
  - Cloud-mode tests are explicitly classified as read-only or isolated-environment-only
  - Spec is stored under `docs/test-specs/`
- Assignee: **FardeenI**
- Due: April 11
- Blocked by: #1
- Unblocks: #9, #10, #15

**9. Integration Test Implementation + Environment Matrix**
- Implement the integration tests from the spec
- Support two execution targets:
  - `local`: starts local frontend/backend dependencies and runs against localhost
  - `cloud`: runs against already-deployed frontend/backend URLs without starting local app servers
- Add environment selection via explicit env vars or script arguments
- Document which tests are:
  - portable across both targets
  - local-only because they depend on reset/seed control
  - cloud-only because they validate deployed behavior
- Keep cloud-target coverage read-only by default:
  - health and reachability
  - guest public channel rendering
  - public SSR metadata and canonical URL fetches
  - sitemap/robots fetches
  - SSE connect/disconnect smoke checks without mutating shared production state
- Capture/structure output for both local and cloud runs
- Keep target URLs, environment contracts, and replica-sensitive validations aligned with `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md`
- Acceptance criteria:
  - Tests run in a local configuration
  - Tests run in a cloud configuration
  - Cloud mode does not require local frontend/backend startup
  - Cloud-mode tests cannot mutate non-isolated deployed state unless a separately documented isolated environment exists
  - Any environment-specific exceptions are documented
- Assignee: **Aiden-Barrera**
- Due: April 14
- Blocked by: #8, #6, #7
- Unblocks: #10, #14, #15

### Phase 3: CI/CD and Deployment Automation — April 10–14

**10. GitHub Action — `run-integration-tests.yml`**
- Create `.github/workflows/run-integration-tests.yml`
- Install frontend/backend dependencies
- Set up the required environment for integration tests
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
