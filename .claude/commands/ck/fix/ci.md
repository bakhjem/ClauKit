---
description: ⚡ Analyze Github Actions logs and fix issues
argument-hint: [github-actions-url]
---

Follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)).

## Github Actions URL
<url>$ARGUMENTS</url>

## Variant: `/ck:fix:ci` — CI-failure-driven

- **Stage [1]** (input): `debugger` subagent reads GitHub Actions logs via `gh` command.
- **Stage [3]** (diagnose): `debugger` finds root causes from CI logs.
- **Stage [3b]** (locate): `scout` subagent → find exact code location of issues.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` subagent.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3b] (re-scout).

## Notes
- If `gh` not available → instruct user to install + authorize GitHub CLI first.

## Distinct from siblings
- Input source = GitHub Actions URL (remote, fetched via `gh`).
- Similar to `/ck:fix:logs` but for remote CI runs instead of local log file.
