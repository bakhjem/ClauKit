---
description: Create an immersive design
argument-hint: [tasks]
---

**Think hard.** Plan & start working on these tasks:
<tasks>$ARGUMENTS</tasks>

`ui-ux-designer` agent activates canonical design skills (`aesthetic` + `frontend-design`).

## Variant: `/design:good` — research-driven award-quality design

Distinct from `/design:fast` — adds a research phase to inform award-quality output. Targets Dribbble/Behance/Awwwards/Mobbin/TheFWA-tier work.

## Workflow
1. `researcher` subagent → research design style, trends, fonts, colors, borders, spacing, element positioning.
2. `ui-ux-designer` subagent → implement based on research.
3. Default stack: pure HTML/CSS/JS (unless user specifies).
4. Report to user → ask review/approve.
5. On approval → update `./docs/design-guidelines.md` if needed.

## Notes
- Storytelling designs · immersive 3D · micro-interactions · interactive interfaces.
- Generate assets with `ai-multimodal`; verify with same skill.
- Remove backgrounds when needed (`ai-multimodal` or ImageMagick).
- All design methodology → `ui-ux-designer` agent.
