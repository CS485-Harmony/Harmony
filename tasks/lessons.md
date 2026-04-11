# Lessons Learned

Shared knowledge base for the Harmony team. Add an entry whenever a mistake is caught, a better approach is discovered, or an AI agent is corrected.

---

## Template

**Date:** YYYY-MM-DD  
**Caught by:** [Human: @username] or [AI Agent: Copilot/Cursor]  
**Related Issue:** #<number> (optional)  
**Mistake / Situation:** One sentence describing what went wrong or what was unclear.  
**Rule / Fix:** The actionable rule derived — written so it prevents the same mistake next time.

---

## Log

<!-- Most recent entries at the top -->

**Date:** 2026-04-11  
**Caught by:** [Human: user]  
**Related Issue:** #313  
**Mistake / Situation:** I changed the password verifier flow but left backend-only PBKDF2 helpers and E2E bootstrap code deriving with the literal hex salt string instead of decoded salt bytes, so browser auth and E2E diverged from local service tests.  
**Rule / Fix:** When introducing a client/server crypto contract, centralize or explicitly mirror the byte-level encoding rules across backend helpers, tests, seed data, and E2E bootstraps; verify at least one browser-facing path, not just service-level tests.

**Date:** 2026-04-11  
**Caught by:** [Human: user]  
**Related Issue:** #313  
**Mistake / Situation:** I updated auth-related tests for the new verifier contract but missed another backend suite that still called `authService.register` with the old 3-argument signature, which broke CI.  
**Rule / Fix:** After changing any shared service contract, grep the full repo for old call sites and run at least the affected package typecheck before pushing so stale compile-time usages do not escape to CI.

**Date:** 2026-04-11  
**Caught by:** [Human: user]  
**Related Issue:** #313  
**Mistake / Situation:** I began patching the auth implementation in the same pass as test creation instead of first proving the security regression with a failing test run.  
**Rule / Fix:** For every non-trivial Harmony code change, especially security work, do strict red-green-refactor: write or update the regression tests first, run them to capture the red state, and only then modify implementation.

**Date:** 2026-04-04  
**Caught by:** [Human: @acabrera04]  
**Related Issue:** N/A  
**Mistake / Situation:** I assumed serial CI workers and relaxed auth throttles were enough, but the WebKit-only auth flake was still tied to running the Next frontend in dev mode inside GitHub Actions.  
**Rule / Fix:** For browser E2E in CI, prefer production-style frontend serving (`build + start`) over `next dev`; dev-mode tooling can introduce non-product flakiness that hides the real signal of the suite.

**Date:** 2026-04-04  
**Caught by:** [Human: @acabrera04]  
**Related Issue:** N/A  
**Mistake / Situation:** I kept a browser matrix in the PR-gating CI path even after reproducing that only WebKit was flaky under CI-mode E2E, which blocked the suite without proving a product defect.  
**Rule / Fix:** Keep every-PR E2E checks focused on the stable smoke browser for this repo, and move additional browser coverage like WebKit to non-blocking or follow-up coverage until the browser-specific flake has a rooted product cause.

**Date:** 2026-04-01  
**Caught by:** [Human: @acabrera04]  
**Related Issue:** N/A  
**Mistake / Situation:** The new E2E suite passed locally but still failed in CI because production-style auth rate limits and full worker parallelism interacted badly with concurrent browser runs.  
**Rule / Fix:** When adding full-stack E2E to CI, review backend throttles and shared-state assumptions explicitly; either relax them for `NODE_ENV=e2e` or reduce CI concurrency so auth/setup traffic cannot invalidate the suite.

**Date:** 2026-03-31  
**Caught by:** [AI Agent: Claude]  
**Related Issue:** N/A  
**Mistake / Situation:** The E2E suite mixed selector expectations based on route slugs with UI labels rendered from channel display names, and one startup preflight used a one-shot auth check while the rest of setup retried.  
**Rule / Fix:** E2E assertions must target the exact accessibility text the UI renders, not adjacent seed identifiers, and all backend readiness checks should share the same retry semantics so cold-start timing does not create false failures.

**Date:** 2026-03-31  
**Caught by:** [AI Agent: Claude]  
**Related Issue:** N/A  
**Mistake / Situation:** E2E preflight initially verified seeded content but skipped critical auth assumptions, and the shared E2E helper encoded environment defaults too implicitly.  
**Rule / Fix:** E2E preconditions must verify every special-case fixture the suite depends on, including auth overrides, and shared test helpers should avoid hidden runtime defaults like hardcoded `NODE_ENV`.

**Date:** 2026-03-31  
**Caught by:** [AI Agent: Claude]  
**Related Issue:** N/A  
**Mistake / Situation:** The first true-E2E pass duplicated stack constants across TS and Node launcher files and allowed local server reuse, which made reruns stateful and brittle.  
**Rule / Fix:** For stateful E2E stacks, keep shared ports/URLs/test credentials in one cross-runtime JS module and force the backend launcher to restart/reset locally unless there is an explicit reason to preserve state.
**Date:** 2026-03-31  
**Caught by:** [Human: user]  
**Related Issue:** N/A  
**Mistake / Situation:** I left brittle expectations inside integration-test helpers, used a vacuous exclusion assertion in a membership-scoping test, hardcoded a slug-collision suffix, and missed unauthenticated plus join/leave coverage in the server lifecycle suite.  
**Rule / Fix:** In Harmony integration tests, keep helpers assertion-light with descriptive failures, avoid vacuous negatives by asserting the response shape/status first, never hardcode collision suffixes when uniqueness is data-dependent, and cover both unauthenticated access and core membership transitions for authenticated server flows.

**Date:** 2026-03-31  
**Caught by:** [Human: user]  
**Related Issue:** N/A  
**Mistake / Situation:** I initially called a mocked page-level test an integration test and also let a backend integration suite depend on state created in a prior `it` block.  
**Rule / Fix:** In this repo, only call a test "integration" when it crosses real module boundaries without mocking application internals, and keep each integration test self-contained so it does not rely on execution order across `it` blocks.
**Date:** 2026-04-03  
**Caught by:** [Human: user]  
**Mistake / Situation:** I renamed the branch and PR for a log export when the user meant to rename the exported log file itself.  
**Rule / Fix:** When a user asks to "rename it" during log-export/PR work, confirm whether the target is the file, branch, PR, or commit before changing GitHub metadata; if context strongly points to the artifact path, rename the file first.
