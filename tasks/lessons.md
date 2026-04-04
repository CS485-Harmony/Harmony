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
