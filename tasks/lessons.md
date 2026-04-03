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

**Date:** 2026-04-03  
**Caught by:** [Human: user]  
**Mistake / Situation:** I renamed the branch and PR for a log export when the user meant to rename the exported log file itself.  
**Rule / Fix:** When a user asks to "rename it" during log-export/PR work, confirm whether the target is the file, branch, PR, or commit before changing GitHub metadata; if context strongly points to the artifact path, rename the file first.
