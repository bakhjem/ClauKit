---
description: ⚡⚡ Analyze and fix UI issues
argument-hint: [issue]
---

Follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)).

`ui-ux-designer` subagent reads `./docs/design-guidelines.md` then fixes:
<issue>$ARGUMENTS</issue>

## Variant: `/fix:ui` — UI-specialist pipeline

- **Stage [2]** (multimodal): if screenshots/videos → `ai-multimodal` skill for detailed issue description.
- **Stage [3]** (diagnose): `ui-ux-designer` subagent (NOT `debugger`).
- **Stage [4]** (plan): SKIP — go directly to implement.
- **Stage [5]** (implement): `ui-ux-designer` applies fix step by step.
- **Stage [6]** (verify): two-layer check:
  - Screenshot exact parent container + `ai-multimodal` analysis (also `video-analysis` / `document-extraction` as needed) → verify design-guideline match.
  - `chrome-devtools` skill → verify implementation match.
  - `tester` agent → compile + ensure no regressions.
  - If issues remain → loop back to [5].
- **Post-impl (user approves):** `project-manager` + `docs-manager` subagents in parallel → update plan progress · `./docs/*` · `./docs/project-roadmap.md`.
- **Post-impl (user rejects):** ask reasons, loop the pipeline.
- **Final:** summary + ask about commit/push → `git-manager`.

**Companion skills:** `ai-multimodal` (generate + verify visual assets), `ImageMagick` (image edits — bg removal, crop, resize), `chrome-devtools` (browser verification).

## Distinct from siblings
- Specialist agent = `ui-ux-designer` (not `debugger`).
- Multi-layer visual verification (screenshot + AI analysis + chrome-devtools).
- Post-impl docs update + commit flow (like `/fix:hard`).
