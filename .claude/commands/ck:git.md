---
description: Git operations dispatcher (flags -cm -cp -pr -merge)
argument-hint: -cm | -cp | -pr [to-branch] [from-branch] | -merge [pr-number|target-branch]
---

## Variables

FLAG: $1 (one of `-cm`, `-cp`, `-pr`, `-merge`)
ARG1: $2
ARG2: $3

## Workflow

Dispatch to the matching operation based on {FLAG}. Use `git-manager` agent for all git/GitHub work.

### `-cm` — commit only
- Stage all files and create a meaningful commit based on the changes.
- **DO NOT push** to remote.

### `-cp` — commit + push
- Stage all files, create a meaningful commit, and push to remote.

### `-pr` — create pull request
- TO_BRANCH: {ARG1} (defaults to `main`)
- FROM_BRANCH: {ARG2} (defaults to current branch)
- Create a PR from {FROM_BRANCH} → {TO_BRANCH}.
- If `gh` is not installed/authorized, instruct user to install and authorize GitHub CLI first.

### `-merge` — merge PR or branch (interactive)
Detect context, then **ask the user** to confirm the merge strategy before acting:
1. Detect: is `gh` available? Does the current branch have an open PR? Is {ARG1} a PR number or a target branch name?
2. Offer choices (pick the relevant ones):
   - **Merge via `gh pr merge`** (squash / merge-commit / rebase, optionally `--delete-branch`) — preferred when a PR exists.
   - **Local merge** — checkout target branch, pull, merge current branch in, push.
3. Wait for user's choice, then execute.
4. If {ARG1} is a number → treat as PR number. If a string → treat as target branch.

## Notes
- If {FLAG} is missing or not one of the four above, print usage and exit.
- For `-pr` and `-merge`, require `gh` CLI for GitHub operations; otherwise guide the user to install/auth it.
- **NEVER** force-push, reset hard, or skip hooks unless the user explicitly asks.
