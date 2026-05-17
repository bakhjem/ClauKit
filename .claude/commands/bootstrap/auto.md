---
description: ⚡⚡⚡⚡ Bootstrap a new project automatically
argument-hint: [user-requirements]
---

**Ultrathink** to plan & bootstrap a new project automatically. Activate `bootstrap` skill ([.claude/skills/software/development/bootstrap/SKILL.md](.claude/skills/software/development/bootstrap/SKILL.md)).

## User's Objectives & Requirements
<user-requirements>$ARGUMENTS</user-requirements>

## Workflow

Follow the **Canonical Bootstrap Workflow** in the `bootstrap` skill (10-phase pipeline).

## Variant: `/bootstrap:auto` — medium-interaction automated

- **Minimal user interaction** — no clarification questions; proceed with reasonable defaults.
- **Approval gates:** design approval · final commit/push approval.
- **Phase 0 (Git Init):** auto-init without asking (use `main` branch).
- **Skip Phase 2 step "Ask user for tech stack"** — directly use `planner` + `researcher` to choose.
- **Skip Phase 1 questioning** — straight to research.

## Distinct from siblings
- `/bootstrap` — high interaction, multiple approval gates
- `/bootstrap:auto:fast` — low interaction, parallel research+planning, no push to remote

## Important
- All workflow rules → `bootstrap` skill (canonical 10-phase pipeline).
