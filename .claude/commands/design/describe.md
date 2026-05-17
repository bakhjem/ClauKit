---
description: Describe a design based on screenshot/video
argument-hint: [screenshot]
---

**Think hard.** Describe the design from this screenshot/video so a developer can implement it:
<screenshot>$ARGUMENTS</screenshot>

## Methodology
- `ui-ux-designer` agent activates canonical design skills (`aesthetic` + `frontend-design`).
- Plan structure → activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)) — Plan Directory Structure + File Specification.

## Variant: `/design:describe` — describe + plan only (no implementation)

Distinct from `/design:screenshot` (which **implements**) — this variant only **describes** and produces an **implementation plan**. Hand-off doc for developers.

## Workflow
1. `ai-multimodal` skill → describe screenshot/video in super detail. Cover every element: style · position · interaction · animation · transition · color · border · icon · font (predict **Google Fonts name + size** — don't default to Inter/Poppins) · spacing · padding · margin · size · shape · texture · material · light · shadow · reflection · refraction · blur · glow · image · background transparency.
2. `ui-ux-designer` subagent → create implementation plan via `planning` skill's progressive disclosure structure.
3. Report plan summary to user. **No implementation.**

## Notes
- All plan structure → `planning` skill. All design methodology → `ui-ux-designer` agent.
