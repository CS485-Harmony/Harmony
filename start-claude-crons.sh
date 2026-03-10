#!/usr/bin/env bash
# Starts Claude Code with the 3 recurring cron jobs for Harmony.
# Usage: ./start-claude-crons.sh
# Tip: run inside tmux so you can detach and reconnect via SSH.

cd "$(dirname "$0")" || exit 1

claude "$(cat <<'PROMPT'
Schedule these 3 recurring cron jobs:

1. Review open PRs (every 2h at :03)
Cron: 3 */2 * * *
Prompt: Check the open PRs in the Harmony repository: https://github.com/acabrera04/Harmony/pulls. If there are open PRs not by declanblanc that are awaiting review, review them. Properly submit a review (not just a comment) requesting changes if needed. Do not leave nitpick comments.

2. Pick up assigned issues (every 2h at :17)
Cron: 17 */2 * * *
Prompt: Check if there are any issues in the Harmony repository (https://github.com/acabrera04/Harmony) assigned to declanblanc that are not already being worked on (no open PR linked to the issue) and not blocked by other incomplete issues. If there are, choose ONE to work on, create a new branch for it, implement the fix, and open a PR when complete.

3. Babysit declanblanc's open PRs (every 1h at :07)
Cron: 7 * * * *
Prompt: Check all open PRs by declanblanc in the Harmony repository (https://github.com/acabrera04/Harmony/pulls). For each open PR: review any unresolved review comments or requested changes, implement any requested code fixes on the PR's branch, reply to comments explaining what was done (or why a change won't be made), mark resolved comments as resolved where applicable. Goal: get the PR into an approvable state.
PROMPT
)" --dangerously-skip-permissions
