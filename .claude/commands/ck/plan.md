---
description: ⚡⚡⚡ Intelligent plan creation (router · -fast: no research · -hard: research-heavy)
argument-hint: [task] [-fast|-hard]
---

Activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Your mission
<task>$ARGUMENTS</task>

## Mode dispatch (inspect `$ARGUMENTS` for flags)

| Flag | Mode | Thinking budget |
|---|---|---|
| *(none)* | **auto-detect** — analyze task, route to fast or hard | (router) |
| `-fast` | **fast** — analysis + planning only, no research | Think |
| `-hard` | **hard** — research-heavy, multi-researcher | Think harder |

## Default mode (no flag) — router

1. Analyze the task; ask for more details if needed.
2. **Decide complexity** → execute `-fast` or `-hard` mode below with an enhanced prompt (detailed-instructions version of the task description).

## `-fast` mode — no research

Use `planner` subagent to:
1. Create directory `plans/YYYYMMDD-HHmm-plan-name` and pass path to every subagent.
2. Follow the **"Plan Creation & Organization"** rules + **Plan Directory Structure** + **Plan File Specification** defined in the `planning` skill (single source of truth).
3. Analyze codebase: read `docs/codebase-summary.md`, `docs/code-standards.md`, `docs/system-architecture.md`, `docs/project-overview-pdr.md`.
4. Gather information → create implementation plan.
5. Ask user to review the plan.

**Distinct from `-hard`:** Skip the research phase (no `researcher` agents, no scout). Pure analysis + planning from existing docs only.

## `-hard` mode — research-heavy

1. Create directory `plans/YYYYMMDD-HHmm-plan-name` and pass path to every subagent.
2. Follow the **"Plan Creation & Organization"** rules + **Plan Directory Structure** + **Plan File Specification** defined in the `planning` skill (single source of truth).
3. Use up to **2 `researcher` agents in parallel** — each researches a different aspect, max 5 tool calls each.
4. Analyze codebase: read `docs/codebase-summary.md`, `docs/code-standards.md`, `docs/system-architecture.md`, `docs/project-overview-pdr.md`.
   - **Only if** `codebase-summary.md` missing or >3 days old → use `/ck:scout` to discover relevant files.
5. Main agent passes all research + scout report filepaths to `planner` subagent to produce the implementation plan.
6. Receive plan from `planner`, ask user to review.

**Research output:** Each research markdown report ≤150 lines while covering all topics + citations.

**Distinct from `-fast`:** Includes the research phase (multiple researchers in parallel + conditional scout).

## Specialized siblings (not flags)
- `/ck:plan:two` — 2 approaches with trade-offs
- `/ck:plan:ci` — fix GitHub Actions failures
- `/ck:plan:cro` — Conversion Rate Optimization plan

## Important Notes
- **DO NOT implement** — plan only.
- Token efficiency, concise grammar, list unresolved questions at end.
- All planning rules → `planning` skill.
