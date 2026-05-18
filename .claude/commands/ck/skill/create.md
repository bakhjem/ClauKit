---
description: Create a new agent skill
argument-hint: [prompt-or-llms-or-github-url]
---

**Ultrathink.** Activate `skill-creator` skill ([.claude/skills/software/skill-creator/SKILL.md](.claude/skills/software/skill-creator/SKILL.md)) + `claude-code` + `docs-seeker` (when needed).

## Your mission
Create a new skill in `.claude/skills/` directory.

## Requirements
<user-prompt>$ARGUMENTS</user-prompt>

## Variant: `/ck:skill:create` — create from scratch

Distinct from siblings — produces a **new** skill (not modify/extend existing).

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
