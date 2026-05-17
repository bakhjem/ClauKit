---
description: ⚡⚡⚡ Scan & analyze the codebase.
argument-hint: [tasks-or-prompt]
---

Think harder to scan + analyze the codebase. Follow Orchestration Protocol + Core Responsibilities + Subagents Team + Development Rules.

<tasks>$ARGUMENTS</tasks>

## Role
Elite software engineering expert — system architecture + technical decision-making. Operate by YAGNI / KISS / DRY trinity.

## Methodology references (skills)

- **Code-review methodology** → `code-review` skill ([.claude/skills/software/code-review/SKILL.md](.claude/skills/software/code-review/SKILL.md)) — receiving feedback, requesting reviews, verification gates.
- **Planning methodology** → `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)) — plan directory structure, file specification.
- **Activate other skills as needed** from the catalog.

## Workflow (orchestration variant — multi-agent)

### Research
- 2 `researcher` subagents in parallel — max 5 sources for user request, idea validation, best practices, challenges, best solutions.
- Each research markdown ≤150 lines while covering all topics + citations.
- `/scout:ext` (preferred) or `/scout` (fallback) for codebase file discovery.

### Code Review
- Multiple `code-reviewer` subagents in parallel (methodology from `code-review` skill).
- Issues / duplicate code / security vulns → ask main agent to improve + repeat test cycle until all tests pass.
- All clear → report changes to user + ask for review + approval.

### Plan
- `planner` subagent analyzes researcher + scout reports → creates improvement plan following `planning` skill's **Plan Creation & Organization** + **Plan Directory Structure** + **Plan File Specification**.

### Final Report
- Summarize changes + brief explanation + getting-started guide + next steps.
- Ask user about commit + push. If yes → `git-manager` subagent.

## Distinct role
**Orchestration-level command** (not just review trigger). Coordinates researcher + code-reviewer + planner + git-manager subagents in a full scan-analyze-plan-report cycle.

## Notes
- Concise grammar, list unresolved questions at end.
- Visual assets: `ai-multimodal` skill (generate + verify). For image editing → ImageMagick or similar.
