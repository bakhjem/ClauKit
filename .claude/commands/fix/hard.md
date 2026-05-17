---
description: ⚡⚡⚡ Use subagents to plan and fix hard issues
argument-hint: [issues]
---

**Ultrathink.** Follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)) — full variant.

## Mission
<issues>$ARGUMENTS</issues>

## Variant: `/fix:hard` — full pipeline

All 7 stages + post-implementation:
- **Stage [2]** (multimodal): if screenshots/videos → `ai-multimodal` skill.
- **Stage [3]** (diagnose): `debugger` + `researcher` subagents (research root causes online if needed).
- **Stage [4]** (plan): `planner` subagent creates implementation plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` subagent writes test cases + runs tests. Failures → loop back via `debugger`.
- **Stage [7]** (review): `code-reviewer` subagent. Critical issues → loop back to implement + retest.
- **Post-impl (user approves):** `project-manager` + `docs-manager` subagents in parallel → update plan progress · docs · `./docs/project-roadmap.md`.
- **Post-impl (user rejects):** ask reasons, loop the entire pipeline.
- **Final:** summary + ask about commit/push → `git-manager`.

**Companion skills:** `sequential-thinking` (break complex problems into steps), `problem-solving` (root-cause synthesis), `ai-multimodal` + `ImageMagick` (visual assets if needed).

## Distinct from siblings
Highest-complexity variant — only one with researcher + project-manager + docs-manager loop.
