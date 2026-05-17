---
description: ⚡⚡⚡ Intelligent plan creation with prompt enhancement
argument-hint: [task]
---

Activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Your mission
<task>$ARGUMENTS</task>

## Workflow (intelligent router)

1. Analyze the task; ask for more details if needed.
2. **Decide complexity:** route to `/plan:fast` (simple, no research) or `/plan:hard` (complex, needs research).
3. Execute the chosen SlashCommand with an **enhanced prompt** — a detailed-instructions version of the task description.

## Distinct role
This command is the **router** for the `/plan*` family. For other variants:
- `/plan:fast` — no research
- `/plan:hard` — research + multi-researcher
- `/plan:two` — 2 approaches with trade-offs
- `/plan:ci` — fix GitHub Actions failures
- `/plan:cro` — Conversion Rate Optimization plan

## Important Notes
- **DO NOT implement** — plan only.
- Concise grammar, list unresolved questions at end.
- All planning rules → `planning` skill.
