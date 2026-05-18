---
description: Add new reference files or scripts to a skill
argument-hint: [skill-name] [reference-or-script-prompt]
---

**Think harder.** Activate `skill-creator` skill ([.claude/skills/software/skill-creator/SKILL.md](.claude/skills/software/skill-creator/SKILL.md)) + `claude-code` + `docs-seeker` (when needed).

## Arguments
- `$1`: skill name (required, default: "") — if missing → ask user
- `$2`: reference/script prompt (required, default: "") — if missing → ask user

## Your mission
Add new reference files or scripts to a skill at `.claude/skills/$1/`.

## Requirements
<reference-or-script-prompt>$2</reference-or-script-prompt>

## Variant: `/ck:skill:add` — extend existing skill

Distinct from `/ck:skill:create` (new skill) — this variant **adds** references/scripts to an **existing** skill at the given path.

## Input Handling (shared with skill family)

| Input | Handler |
|---|---|
| URL (single docs page) | `Explore` subagent → traverse every internal link, no skip |
| Multiple URLs | Multiple `Explore` subagents in parallel |
| Many files | Multiple `Explore` subagents in parallel |
| GitHub URL | `repomix` to summarize (install if needed) + multiple `Explore` subagents in parallel |

## Important
- All skill-creation methodology + progressive-disclosure rules → `skill-creator` skill (single source of truth).
- `SKILL.md` + reference files must be token-efficient for **progressive disclosure**.
