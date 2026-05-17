---
description: Fix the agent skill based on `logs.txt` file.
argument-hint: [prompt-or-path-to-skill]
---

**Think harder.** Activate `skill-creator` skill ([.claude/skills/software/skill-creator/SKILL.md](.claude/skills/software/skill-creator/SKILL.md)) + `claude-code` + `docs-seeker` (when needed).

## Your mission
Fix the agent skill based on `./logs.txt` in the project root.

## Requirements
<user-prompt>$ARGUMENTS</user-prompt>

## Variant: `/skill:fix-logs` — log-driven skill fix

Distinct from siblings — input is `./logs.txt` (failure logs from skill execution). Diagnose root cause from logs → fix.

## Input Handling (shared with skill family)

| Input | Handler |
|---|---|
| URL (single docs page) | `Explore` subagent → traverse every internal link, no skip |
| Multiple URLs | Multiple `Explore` subagents in parallel |
| Many files | Multiple `Explore` subagents in parallel |
| GitHub URL | `repomix` to summarize (install if needed) + multiple `Explore` subagents in parallel |

## Important
- All skill-creation methodology → `skill-creator` skill (single source of truth).
