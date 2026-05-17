# Anthropic · Effective Context Engineering for AI Agents

**Source**: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

## Core thesis

Anthropic distinguishes **context engineering** from prompt engineering: prompt engineering tunes a single instruction; context engineering shapes the entire information environment an agent operates in. For long-running, multi-turn, tool-using agents, the latter dominates quality.

## The six layers (Anthropic framing)

1. **System message** — identity, policies, durable behavior.
2. **Persistent memory** — user/project facts retrieved across sessions.
3. **Retrieved knowledge** — RAG content fetched per turn.
4. **Tools** — schemas + descriptions count as context.
5. **History** — prior turns; the silent budget killer.
6. **Current task** — the user's most recent message.

## Key practices

- **Just-in-time retrieval** beats stuffing everything into the system prompt. Pull only what the current task needs.
- **Tool-schema cost is real**: each tool definition is tokens on every request. Lazy-load or partition by sub-agent.
- **Compaction over truncation**: when history overflows, summarize rather than drop — preserves continuity.
- **Measure before tuning**: instrument input-token mix by layer; you cannot optimize blind.
- **Cache awareness**: Anthropic's prompt cache has a 5-minute TTL; structuring the front of your context to be stable maximizes hits.

## Why authoritative

Published by Anthropic Engineering as the canonical statement of how the makers of Claude recommend designing context for Claude-powered agents.
