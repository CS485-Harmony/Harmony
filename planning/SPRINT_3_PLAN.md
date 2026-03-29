# Testing Sprint Plan — March 29 – April 5, 2026

## Context
Harmony is a search-engine-indexable chat app (Discord-like). Sprints 1–2 built out requirements, dev specs, frontend, and backend. This sprint adds comprehensive unit testing for 4 core untested files (2 frontend, 2 backend), CI workflow automation, and documentation updates.

**Assignment:** P5: Testing
**Due:** Sunday, April 5, 2026, 11:59 PM AOE

## Team
5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI

## Tech Stack (Testing)
- Jest 29.7 (backend) / Jest 30.3 (frontend)
- Supertest 7.0 (backend HTTP testing)
- @testing-library/react 16.3 (frontend)
- ts-jest (TypeScript transpilation)
- GitHub Actions (CI/CD)

---

## Files Under Test

| # | Side | File | Functions | Why |
|---|------|------|-----------|-----|
| 1 | Backend | `harmony-backend/src/services/auth.service.ts` | 5 (`register`, `login`, `logout`, `refreshTokens`, `verifyAccessToken`) | Core auth — every user story depends on it, security-critical, untested |
| 2 | Backend | `harmony-backend/src/services/server.service.ts` | 10 (`getPublicServers`, `getAllServers`, `getMemberServers`, `getServer`, `createServer`, `updateServer`, `deleteServer`, `incrementMemberCount`, `decrementMemberCount`, `getMembers`) | Primary domain object — server CRUD + membership counts, untested |
| 3 | Frontend | `harmony-frontend/src/services/serverService.ts` | 11 (`getServers`, `getServer`, `getServerAuthenticated`, `getServerMembers`, `updateServer`, `deleteServer`, `joinServer`, `createServer`, `getServerMembersWithRole`, `changeMemberRole`, `removeMember`) | Frontend API layer for server management, untested |
| 4 | Frontend | `harmony-frontend/src/services/channelService.ts` | 8 (`getChannels`, `getChannel`, `updateVisibility`, `updateChannel`, `createChannel`, `getAuditLog`, `deleteChannel`) | Frontend API layer for channels + SEO visibility toggle, untested |

---

## Issues (10 total)

### Phase 1: TEST SPECIFICATIONS + CI SETUP — Days 1–2 (March 29–30)

**1. Test Specification — `auth.service.ts`**
- Write English-language test spec document for all 5 functions
- List every function, its purpose, and all program paths
- Create table: test purpose, inputs, expected output
- Cover happy paths, error paths (invalid credentials, expired tokens, duplicate email), and edge cases
- Target 80%+ code coverage of all execution paths
- Output: `docs/test-specs/auth-service-spec.md`
- Assignee: **Aiden-Barrera**
- Due: March 30

**2. Test Specification — `server.service.ts`**
- Write English-language test spec document for all 10 functions
- List every function, its purpose, and all program paths
- Create table: test purpose, inputs, expected output
- Cover happy paths, error paths (not found, duplicate slugs, unauthorized), and edge cases
- Target 80%+ code coverage of all execution paths
- Output: `docs/test-specs/server-service-spec.md`
- Assignee: **declanblanc**
- Due: March 30

**3. Test Specification — `serverService.ts` (frontend)**
- Write English-language test spec document for all 11 functions
- List every function, its purpose, and all program paths
- Create table: test purpose, inputs, expected output
- Cover happy paths, API error handling (network failures, 401/403/404), and edge cases
- Describe mock strategy for `apiClient` / `ApiClient`
- Target 80%+ code coverage of all execution paths
- Output: `docs/test-specs/frontend-server-service-spec.md`
- Assignee: **FardeenI**
- Due: March 30

**4. Test Specification — `channelService.ts` (frontend)**
- Write English-language test spec document for all 8 functions
- List every function, its purpose, and all program paths
- Create table: test purpose, inputs, expected output
- Cover happy paths, API error handling, visibility enum edge cases
- Describe mock strategy for `apiClient` / `ApiClient`
- Target 80%+ code coverage of all execution paths
- Output: `docs/test-specs/frontend-channel-service-spec.md`
- Assignee: **AvanishKulkarni**
- Due: March 30

**5. GitHub Actions — CI Workflows**
- Create `.github/workflows/run-frontend-tests.yml`
  - Trigger on every push and PR
  - Checkout code, setup Node.js 20, install deps, run frontend tests
- Create `.github/workflows/run-backend-tests.yml`
  - Trigger on every push and PR
  - Checkout code, setup Node.js 20, install deps
  - Start PostgreSQL + Redis services
  - Run Prisma generate + migrate, then run backend tests
- Reference existing `ci.yml` for service configuration patterns
- Test by pushing a small change and verifying green checkmarks in Actions tab
- No dependencies — can start immediately using existing tests in the repo
- Assignee: **acabrera04**
- Due: March 30

### Phase 2: UNIT TEST IMPLEMENTATION — Days 2–4 (March 30 – April 1)

**6. Unit Tests — `auth.service.ts`**
- Implement Jest tests from spec in `harmony-backend/tests/auth.service.test.ts`
- Mock Prisma client and bcrypt/JWT dependencies
- Generate one test at a time via LLM to prevent hallucination
- Verify no duplicate or overlapping test cases
- Run tests locally, fix any failures (use LLM for 3 alternative fixes)
- **Acceptance criteria:** 80%+ code coverage (run Jest with `--coverage`), capture coverage report for submission
- Assignee: **Aiden-Barrera**
- Due: April 1
- Depends on: #1

**7. Unit Tests — `server.service.ts`**
- Implement Jest tests from spec in `harmony-backend/tests/server.service.test.ts`
- Mock Prisma client
- Generate one test at a time via LLM to prevent hallucination
- Verify no duplicate or overlapping test cases
- Run tests locally, fix any failures
- **Acceptance criteria:** 80%+ code coverage (run Jest with `--coverage`), capture coverage report for submission
- Assignee: **declanblanc**
- Due: April 1
- Depends on: #2

**8. Unit Tests — `serverService.ts` (frontend)**
- Implement Jest tests from spec in `harmony-frontend/src/__tests__/serverService.test.ts`
- Mock `apiClient` and `ApiClient` imports from `@/lib/api-client`
- Generate one test at a time via LLM to prevent hallucination
- Verify no duplicate or overlapping test cases
- Run tests locally, fix any failures
- **Acceptance criteria:** 80%+ code coverage (run Jest with `--coverage`), capture coverage report for submission
- Assignee: **FardeenI**
- Due: April 1
- Depends on: #3

**9. Unit Tests — `channelService.ts` (frontend)**
- Implement Jest tests from spec in `harmony-frontend/src/__tests__/channelService.test.ts`
- Mock `apiClient` and `ApiClient` imports from `@/lib/api-client`
- Generate one test at a time via LLM to prevent hallucination
- Verify no duplicate or overlapping test cases
- Run tests locally, fix any failures
- **Acceptance criteria:** 80%+ code coverage (run Jest with `--coverage`), capture coverage report for submission
- Assignee: **AvanishKulkarni**
- Due: April 1
- Depends on: #4

### Phase 3: DOCUMENTATION & SUBMISSION — Days 5–7 (April 3–5)

**10. README Update & Final Submission**
- Update `README.md` with:
  - Instructions to manually run frontend tests (frameworks, libraries, commands)
  - Instructions to manually run backend tests (frameworks, libraries, commands)
- Compile final submission document with all 17 deliverables
- Collect and include all LLM interaction logs with model name/version
- Note: 500-word reflection is written collaboratively as a group
- Assignee: **acabrera04**
- Due: April 5
- Depends on: #6, #7, #8, #9

---

## Assignment Summary

| Developer | Issues | Focus Area |
|-----------|--------|------------|
| acabrera04 | #5, #10 | CI workflows (both YAML files), README update/submission |
| Aiden-Barrera | #1, #6 | Auth service test spec + unit tests |
| AvanishKulkarni | #4, #9 | Channel service (FE) test spec + unit tests |
| declanblanc | #2, #7 | Server service (BE) test spec + unit tests |
| FardeenI | #3, #8 | Server service (FE) test spec + unit tests |

## Dependency Graph

```
Phase 1 (Specs + CI)              Phase 2 (Tests + Coverage)       Phase 3 (Docs)

#1 Auth Spec ───────────────────► #6 Auth Tests (80%+) ────────┐
#2 Server Spec ─────────────────► #7 Server Tests (80%+) ──────┤
#3 FE Server Spec ──────────────► #8 FE Server Tests (80%+) ───┼──► #10 README + Reflection
#4 FE Channel Spec ─────────────► #9 FE Channel Tests (80%+) ──┘        + Submission
#5 CI YAML (no dependencies) ──────────────────────────────────┘

Note: 500-word reflection is a group effort, not tracked as an individual issue.
```

## Timeline

| Date | Milestone |
|------|-----------|
| March 29 (Sat) | Sprint kickoff, begin test specs + CI workflows |
| March 30 (Sun) | All 4 test specs complete, CI workflows verified, begin unit test implementation |
| April 1 (Tue) | All 4 test files complete, tests passing locally, 80%+ coverage verified |
| April 3 (Thu) | README updated, reflection draft |
| April 5 (Sat) | Final submission compiled and turned in |

## Notes
- Use LLM to generate test specs and unit tests (course requirement)
- Generate **one unit test at a time** to prevent LLM hallucination
- All tests must be isolated — no cross-network calls between frontend and backend
- Frontend tests must mock the API client; backend tests must mock Prisma
- Save all LLM interaction logs for submission deliverable #17
- Existing `ci.yml` already runs tests on push/PR — new workflow files are separate as required by the assignment
