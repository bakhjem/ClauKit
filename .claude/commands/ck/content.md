---
description: ⚡⚡ Write creative & smart copy (-fast: quick · -good: research-driven)
argument-hint: [user-request] [-fast|-good]
---

Write creative & smart copy for this user request:
<user_request>$ARGUMENTS</user_request>

## Mode dispatch (inspect `$ARGUMENTS` for flags)

| Flag | Mode |
|---|---|
| `-fast` | **quick** — copywriter agent only (default) |
| `-good` | **research-driven** — researcher + scout + planner + copywriter |

If no flag → default to `-fast` mode.

## `-fast` mode — quick

- If the user provides screenshots, use `ai-multimodal` skill to analyze and describe the context.
- If the user provides videos, use `ai-multimodal` (`video-analysis`) skill to analyze video content.
- Use `copywriter` agent to write the copy, then report back to main agent.

## `-good` mode — research-driven

- If the user provides screenshots, use `ai-multimodal` skill to analyze and describe the context in detail.
- If the user provides videos, use `ai-multimodal` (`video-analysis`) skill to analyze video content.
- Use multiple `researcher` agents in parallel to search for relevant information, then report back to main agent.
- Use `/ck:scout -ext` (preferred) or `/ck:scout` (fallback) slash command to search the codebase for files needed to complete the task.
- Use `planner` agent to plan the copy, make sure it can satisfy the user request.
- Use `copywriter` agent to write the copy based on the plan, then report back to main agent.

## Specialized siblings (not flags)
- `/ck:content:enhance` — analyze + enhance existing copy
- `/ck:content:cro` — CRO-focused content optimization
