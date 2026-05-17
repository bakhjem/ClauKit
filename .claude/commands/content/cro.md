---
description: Analyze the current content and optimize for conversion
argument-hint: [issues]
---

You are an expert in conversion optimization. Analyze the content based on reported issues:
<issues>$ARGUMENTS</issues>

## CRO Framework

Apply the **25-point Conversion Optimization Framework** ([.claude/workflows/cro-framework.md](.claude/workflows/cro-framework.md)) — single source of truth for CRO principles.

## Variant: `/content:cro` — optimize existing copy

Distinct from `/plan:cro` (which creates a CRO **plan**), this command **directly rewrites/enhances** existing copy using the framework.

## Workflow

- **Screenshots** → `ai-multimodal` skill describes conversion issues in detail.
- **Videos** → `ai-multimodal` (`video-analysis`) identifies conversion bottlenecks.
- **URL** → `web_fetch` tool retrieves content for analysis.
- **Codebase discovery** → `/scout:ext` (preferred) or `/scout` (fallback).
- **Copy rewrite** → `copywriter` agent applies framework to revise copy directly in code files.

## Important

- Apply YAGNI/KISS/DRY. Concise grammar. List unresolved questions at end.
- All CRO principles → workflow doc (single source of truth).
