---
description: ⚡⚡⚡⚡⚡ Bootstrap a new project step by step
argument-hint: [user-requirements]
---

**Ultrathink** to plan & bootstrap a new project. Activate `bootstrap` skill ([.claude/skills/software/development/bootstrap/SKILL.md](.claude/skills/software/development/bootstrap/SKILL.md)).

## User's Objectives & Requirements
<user-requirements>$ARGUMENTS</user-requirements>

## Workflow

Follow the **Canonical Bootstrap Workflow** in the `bootstrap` skill (10-phase pipeline: Git Init → Research → Tech Stack → Planning → Wireframe & Design → Implementation → Testing → Code Review → Documentation → Onboarding → Final Report).

## Variant: `/bootstrap` — high-interaction step-by-step

- **High user interaction:** ask one question at a time, wait for answer before next step.
- **Approval gates:** tech stack approval · plan approval · design approval · final commit/push approval.
- **Question style:** Start with clarifying questions ("Brutal Honesty" approach — challenge unrealistic/over-engineered ideas). Skip questions only when user already answered.

## Distinct from siblings
- `/bootstrap:auto` — medium interaction, fewer approvals
- `/bootstrap:auto:fast` — low interaction, parallel research+planning

## Important
- **DO NOT implement** before plan is approved by user.
- All other rules → `bootstrap` skill.
