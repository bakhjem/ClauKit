---
description: Create a design based on screenshot
argument-hint: [screenshot]
---

**Think hard.** Plan & start designing to match this screenshot:
<screenshot>$ARGUMENTS</screenshot>

## Methodology
- `ui-ux-designer` agent activates canonical design skills (`aesthetic` + `frontend-design`).
- Plan structure → activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)) — Plan Directory Structure + File Specification.

## Variant: `/design:screenshot` — match exactly to a screenshot

Distinct from siblings — input is a **reference screenshot**, output must match its visual style.

## Workflow
1. `ai-multimodal` skill → describe screenshot in super detail: style, trends, fonts (predict **Google Fonts name + size** — don't default to Inter/Poppins), colors, borders, spacing, positions, sizes, shapes, textures, light/shadow, reflections, blur/glow, backgrounds, transitions.
2. `ui-ux-designer` subagent → create design plan via `planning` skill's progressive disclosure structure to match the screenshot.
3. Implement plan step by step.
4. Default stack: pure HTML/CSS/JS (unless user specifies).
5. Report to user → ask review/approve.
6. On approval → update `./docs/design-guidelines.md` if needed.

## Notes
- Storytelling · 3D · micro-interactions · interactive interfaces.
- Generate assets with `ai-multimodal`; verify with same skill.
- Background removal via `ai-multimodal` or ImageMagick.
- All plan structure → `planning` skill. All design methodology → `ui-ux-designer` agent.
