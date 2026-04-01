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
