---
description: ⚡⚡ Run test suite and fix issues
argument-hint: [issues]
---

Follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)).

## Reported Issues
<issues>$ARGUMENTS</issues>

## Variant: `/ck:fix:test` — test-first

- **Stage [1]** (input): `tester` subagent compiles code + fixes syntax errors first.
- **Stage [3]** (diagnose): `tester` runs test suite → failures handed to `debugger` for root-cause.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` re-runs tests.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3] (re-diagnose).

## Distinct from siblings
- Input source = running test suite (not external logs/URL/text).
- `tester` runs BEFORE `debugger` (inverse of other variants).
