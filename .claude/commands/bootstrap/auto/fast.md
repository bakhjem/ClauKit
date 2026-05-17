---
description: ⚡⚡⚡ Quickly bootstrap a new project automatically
argument-hint: [user-requirements]
---

**Think hard** to plan & bootstrap a new project. Activate `bootstrap` skill ([.claude/skills/software/development/bootstrap/SKILL.md](.claude/skills/software/development/bootstrap/SKILL.md)).

## User's Objectives & Requirements
<user-requirements>$ARGUMENTS</user-requirements>

## Workflow

Follow the **Canonical Bootstrap Workflow** in the `bootstrap` skill (10-phase pipeline).

## Variant: `/bootstrap:auto:fast` — low-interaction parallel

- **Lowest user interaction.** No clarification questions; reasonable defaults; no design approval gate.
- **Phase 0:** auto-init Git (`main` branch).
- **Phases 1+2+4 run in parallel** — fire all researchers simultaneously: idea-validation researchers + tech-stack researchers + design researchers. Max 2 agents per group, max 5 sources each.
- **Phase 3 (Planning):** after all parallel research completes, `ui-ux-designer` creates design guidelines + wireframes, then `planner` creates the implementation plan from all reports.
- **Phase 10 (Final Report):** `git-manager` creates commits **but does NOT push to remote**.

## Distinct from siblings
- `/bootstrap` — high interaction, multiple approval gates
- `/bootstrap:auto` — medium interaction, sequential phases, design approval

## Important
- All workflow rules → `bootstrap` skill (canonical 10-phase pipeline).
