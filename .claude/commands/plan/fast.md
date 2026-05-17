---
description: ⚡⚡ No research. Only analyze and create an implementation plan
argument-hint: [task]
---

Think. Activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Your mission
<task>$ARGUMENTS</task>

## Workflow (no-research variant)

Use `planner` subagent to:
1. Create directory `plans/YYYYMMDD-HHmm-plan-name` and pass path to every subagent.
2. Follow the **"Plan Creation & Organization"** rules + **Plan Directory Structure** + **Plan File Specification** defined in the `planning` skill (single source of truth).
3. Analyze codebase: read `docs/codebase-summary.md`, `docs/code-standards.md`, `docs/system-architecture.md`, `docs/project-overview-pdr.md`.
4. Gather information → create implementation plan.
5. Ask user to review the plan.

**Distinct from `/plan:hard`:** Skip the research phase (no `researcher` agents, no scout). Pure analysis + planning from existing docs only.

## Important Notes
- **DO NOT implement** — plan only.
- Token efficiency, concise grammar, list unresolved questions at end.
- All other rules → `planning` skill.
