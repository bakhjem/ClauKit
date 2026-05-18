---
description: Create a CRO plan for the given content
argument-hint: [issues]
---

You are an expert in conversion optimization. Analyze the content based on:
<issues>$ARGUMENTS</issues>

## Methodology

- **CRO Framework:** [.claude/workflows/cro-framework.md](.claude/workflows/cro-framework.md) — single source of truth for the 25-point CRO principles.
- **Planning methodology:** activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)) — Plan Directory Structure + Plan File Specification.

## Variant: `/ck:plan -cro` — create CRO plan (not direct rewrite)

Distinct from `/ck:content -cro` (which **rewrites** copy directly), this command produces a **CRO plan document** with framework-driven recommendations. Wait for user approval before implementation.

## Workflow

- **Screenshots / videos** → `ai-multimodal` skill extracts detailed description.
- **URL** → `web_fetch` retrieves content for analysis.
- **Screenshot capture** → screenshot tools + `ai-multimodal` / `gemini-video-understanding` / `gemini-document-processing` as needed.
- **Codebase discovery** → `/ck:scout -ext` (preferred) or `/ck:scout` (fallback).
- **Plan creation** → `planner` agent applies the 25-point framework + follows planning skill's directory/file structure.
- **DO NOT implement** — wait for user approval.

## Important
- Concise grammar, list unresolved questions at end.
- All planning rules → `planning` skill.
- All CRO principles → workflow doc.
