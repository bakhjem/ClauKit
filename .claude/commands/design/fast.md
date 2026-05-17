---
description: Create a quick design
argument-hint: [tasks]
---

**Think hard.** Plan & start working on these tasks:
<tasks>$ARGUMENTS</tasks>

`ui-ux-designer` agent activates the canonical design skills (`aesthetic` + `frontend-design`) — no need to re-list here.

## Variant: `/design:fast` — minimal workflow

Distinct from siblings — fastest variant, no research phase.

## Workflow
1. `ui-ux-designer` subagent → start design directly.
2. Default stack: pure HTML/CSS/JS (unless user specifies otherwise).
3. Report to user → ask review/approve.
4. On approval → update `./docs/design-guidelines.md` if needed.

## Notes
- Generate visual assets with `ai-multimodal` skill; verify quality with same skill.
- All design methodology → `ui-ux-designer` agent (auto-activates `aesthetic`).
