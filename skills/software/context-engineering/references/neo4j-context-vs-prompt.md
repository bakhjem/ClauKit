# Neo4j · Context Engineering vs Prompt Engineering

**Source**: https://neo4j.com/blog/agentic-ai/context-engineering-vs-prompt-engineering/

## The distinction

- **Prompt engineering**: optimize the wording of a single instruction. Static, one-shot.
- **Context engineering**: design the *entire pipeline* — retrieval, memory, history, tools — that produces what an agent sees on any given turn. Dynamic, multi-turn.

Karpathy and others popularized the term in mid-2025; Shopify's CEO endorsed it publicly in June 2025 as the next discipline beyond prompt engineering for production agent systems.

## Why graphs matter (Neo4j's angle)

Knowledge graphs serve as a context-engineering substrate: they let the agent traverse relations on demand instead of pre-stuffing related facts. Pattern:

1. Index domain knowledge as a property graph.
2. On each turn, run a small graph query scoped by the current task.
3. Materialize results into the context window.

This shrinks the average context size while *increasing* the relevance of what's there — the central tradeoff context engineering optimizes.

## Implications

- A retrieval system isn't optional — it's the heart of context engineering.
- Multi-agent systems amplify the discipline: each agent's context is a separately engineered surface.
- Evaluation must be end-to-end (input → context → output), not just prompt-level.

## Why authoritative

Neo4j is the leading graph-database vendor; their 2025 articles on agentic AI sit at the intersection of context engineering and retrieval — practitioner-tested at enterprise scale.
