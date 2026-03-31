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
**Caught by:** [Human: @user]  
**Related Issue:** #269  
**Mistake / Situation:** I assumed integration testing was blocked after the initial Docker check failed and started converting the service spec to mocked unit tests.  
**Rule / Fix:** Before changing a test strategy because local infrastructure looks unavailable, re-check whether the dependency can be started or quickly unblocked and prefer the repo's intended environment when the user can provide it.
