---
description: ⚡⚡ Content operations dispatcher (router · fast good enhance cro)
argument-hint: [user-request] [fast|good|enhance|cro]
---

## Variables

MODE: `$1` if it matches `fast`, `good`, `enhance`, or `cro`; else absent (default: `fast`)
REST: remaining arguments after MODE

## Mode dispatch

| Mode | Notes |
|---|---|
| *(none)* | `fast` (default) |
| `fast` | **quick** — copywriter agent only |
| `good` | **research-driven** — researcher + scout + planner + copywriter |
| `enhance` | **analyze + enhance** — improve existing copy from reported issues |
| `cro` | **CRO rewrite** — direct rewrite using 25-point CRO framework |

## `fast` — quick (default)

Write creative & smart copy for this user request:
<user_request>$ARGUMENTS</user_request>

- Screenshots → `ai-multimodal` skill to describe context.
- Videos → `ai-multimodal` (`video-analysis`) skill.
- Use `copywriter` agent → write copy → report back to main agent.

## `good` — research-driven

Write copy backed by research:
<user_request>{REST}</user_request>

- Screenshots → `ai-multimodal` skill (detailed description).
- Videos → `ai-multimodal` (`video-analysis`).
- Multiple `researcher` agents in parallel → relevant information → report back.
- `/scout -ext` (preferred) or `/scout` (fallback) → discover relevant codebase files.
- `planner` agent → plan the copy to satisfy the user request.
- `copywriter` agent → write copy from plan → report back.

## `enhance` — analyze + enhance existing copy

Enhance copy based on reported issues:
<issues>{REST}</issues>

- Screenshots → `ai-multimodal` skill describes issues in detail (context for copywriter).
- Videos → `ai-multimodal` (`video-analysis`) extracts copy issues.
- `/scout -ext` (preferred) or `/scout` (fallback) → search codebase for files.
- `copywriter` agent → write enhanced copy directly into code files → report back.

## `cro` — CRO-focused rewrite

Optimize copy for conversion. You are an expert in conversion optimization. Analyze content based on reported issues:
<issues>{REST}</issues>

**CRO Framework:** Apply the **25-point Conversion Optimization Framework** ([.claude/workflows/cro-framework.md](.claude/workflows/cro-framework.md)) — single source of truth for CRO principles.

**Distinct from `/plan cro`** (which creates a CRO **plan**), this command **directly rewrites/enhances** existing copy using the framework.

Workflow:
- Screenshots → `ai-multimodal` skill describes conversion issues in detail.
- Videos → `ai-multimodal` (`video-analysis`) identifies conversion bottlenecks.
- URL → `web_fetch` tool retrieves content for analysis.
- `/scout -ext` (preferred) or `/scout` (fallback) → codebase discovery.
- `copywriter` agent → apply framework → revise copy directly in code files.

## Notes
- If MODE is absent, default to `fast`.
- Apply YAGNI/KISS/DRY. Concise grammar. List unresolved questions at end.
- All CRO principles → workflow doc (single source of truth).
