---
description: ⚡ Analyze and fix small issues [FAST]
argument-hint: [issues]
---

**Think hard.** Follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)).

## Mission
<issues>$ARGUMENTS</issues>

## Variant: `/fix:fast` — minimal pipeline

- **Stage [2]** (multimodal): if screenshots/videos → `ai-multimodal` skill.
- **Stage [3]** (diagnose): `debugger` subagent only.
- **Stage [4]** (plan): SKIP — go directly to implement.
- **Stage [5]** (implement): main agent applies fix.
- **Stage [6]** (verify): `tester` subagent.
- **Stage [7]** (review): SKIP code-reviewer — just summarize to user.
- **Failure loop:** back to stage [3].

**Companion skill:** `problem-solving` activates during diagnose.

## Distinct from siblings
- `/fix:hard` — full pipeline with researcher + planner + code-reviewer + docs update
- `/fix:logs` / `/fix:ci` — input from log files / CI URL instead of issue text
- `/fix:test` / `/fix:types` / `/fix:ui` — specialized inputs/agents
