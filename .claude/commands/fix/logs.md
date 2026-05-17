---
description: ⚡ Analyze logs and fix issues
argument-hint: [issue]
---

Follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)).

## Mission
<issue>$ARGUMENTS</issue>

## Variant: `/fix:logs` — log-driven

- **Stage [1]** (input): read `./logs.txt`. If missing → reproduce issue first and pipe output to `./logs.txt`.
- **Stage [3]** (diagnose): `debugger` subagent reads `./logs.txt` → find root causes.
- **Stage [3b]** (locate): `scout` subagent → find exact code location of issues.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` subagent.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3b] (re-scout).

## Distinct from siblings
- Input source = local log file (not user text, not CI URL).
- Adds `scout` subagent to bridge logs → code location.
