---
description: ⚡⚡⚡ Research, analyze, and create an implementation plan
argument-hint: [task]
---

Think harder. Activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Your mission
<task>$ARGUMENTS</task>

## Workflow (research-heavy variant)

1. Create directory `plans/YYYYMMDD-HHmm-plan-name` and pass path to every subagent.
2. Follow the **"Plan Creation & Organization"** rules + **Plan Directory Structure** + **Plan File Specification** defined in the `planning` skill (single source of truth).
3. Use up to **2 `researcher` agents in parallel** — each researches a different aspect, max 5 tool calls each.
4. Analyze codebase: read `docs/codebase-summary.md`, `docs/code-standards.md`, `docs/system-architecture.md`, `docs/project-overview-pdr.md`.
   - **Only if** `codebase-summary.md` missing or >3 days old → use `/scout` to discover relevant files.
5. Main agent passes all research + scout report filepaths to `planner` subagent to produce the implementation plan.
6. Receive plan from `planner`, ask user to review.

**Research output:** Each research markdown report ≤150 lines while covering all topics + citations.

**Distinct from `/plan:fast`:** Includes the research phase (multiple researchers in parallel + conditional scout).

## Important Notes
- **DO NOT implement** — plan only.
- Token efficiency, concise grammar, list unresolved questions at end.
- All other rules → `planning` skill.
