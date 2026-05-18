---
description: Analyze Github Actions logs and provide a plan to fix the issues
argument-hint: [github-actions-url]
---

Activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Github Actions URL
$ARGUMENTS

## Workflow (CI-failure variant)

Use `planner` subagent to:
1. Read the GitHub Actions logs via `gh` command.
2. Analyze and find root causes.
3. Produce a detailed fix plan.

**Output:** ≥2 implementation approaches with clear trade-offs + pros/cons + recommended approach.

**Distinct from `/ck:plan -hard`:** Source of truth is CI logs (not codebase analysis); root-cause-first framing.

## Important Notes
- **Ask user for confirmation before implementing.**
- Concise grammar, list unresolved questions at end.
- All other rules → `planning` skill.
