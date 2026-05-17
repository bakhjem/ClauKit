---
description: ⚡⚡⚡⚡ Research & create an implementation plan with 2 approaches
argument-hint: [task]
---

Think harder. Activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Your mission
Use `planner` subagent to create **2 detailed implementation plans** for:
<task>$ARGUMENTS</task>

## Workflow (2-approach comparison variant)

1. Create directory `plans/YYYYMMDD-HHmm-plan-name`, pass path to every subagent.
2. Follow **Plan Creation & Organization** + **Plan Directory Structure** + **Plan File Spec** from `planning` skill.
3. Multiple `researcher` agents in parallel — each on a different aspect, max 5 tool calls each.
4. `scout` agent → discover relevant files.
5. Main agent passes all reports to `planner` with instruction:
   **Output ≥2 implementation approaches with clear trade-offs + pros/cons + recommended approach.**
6. Receive plan, ask user to review.

**Distinct from `/plan:hard`:** Mandatory 2+ approaches comparison with pros/cons table.

## Important Notes
- **DO NOT implement** — plan only.
- Token efficiency, concise grammar, list unresolved questions at end.
- All other rules → `planning` skill.
