---
description: Optimize an existing agent skill
argument-hint: [skill-name] [prompt]
---

**Think harder.** Activate `skill-creator` skill ([.claude/skills/software/skill-creator/SKILL.md](.claude/skills/software/skill-creator/SKILL.md)) + `claude-code` + `docs-seeker` (when needed). Plan structure → activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Arguments
- `SKILL`: `$1` (default: `*` — all skills)
- `PROMPT`: `$2` (default: empty)

## Your mission
Propose a plan to optimize existing skill in `.claude/skills/${SKILL}/`. When done, ask user to review:
- **Approve** → write plan per "Output Requirements" → ask if implement
- **Reject** → revise or ask clarifying question (one at a time) → repeat review

## Additional instructions
<additional-instructions>$PROMPT</additional-instructions>

## Variant: `/skill:optimize` — refactor existing skill (plan-first)

Distinct from siblings — produces an **optimization plan** before any changes. No code edits without approval.

## Output Requirements

Follow **Plan Directory Structure** + **Plan File Specification** from `planning` skill (single source of truth). Plus skill-specific rules from `skill-creator` skill:
- Token efficiency for progressive disclosure
- `SKILL.md` + reference files structured for lazy loading

## Important
- All skill methodology → `skill-creator` skill.
- All plan structure → `planning` skill.
