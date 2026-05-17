# LangChain · Context Engineering for AI Agents — the 4-Bucket Strategy

**Source**: https://blog.langchain.com/context-engineering-for-agents/ (Lance Martin, 2024)

## The canonical framework

LangChain's Lance Martin synthesized practitioner techniques into a four-bucket model that has become the standard vocabulary for context engineering:

| Bucket | Definition | Example techniques |
|---|---|---|
| **Write** | Persist context *outside* the window so it can be re-loaded selectively later. | Scratchpads, plan files, journal entries, external memory stores, intermediate result caches. |
| **Select** | Pull only the relevant slices *into* the window when needed. | Vector retrieval, BM25, hybrid retrieval, cross-encoder re-ranking, query routing, metadata filters. |
| **Compress** | Reduce token cost of context without losing the load-bearing info. | Summarization, structured recaps, masking unused fields, lossy deduplication, token-aware truncation. |
| **Isolate** | Split a task across multiple agents/contexts so no single window carries everything. | Sub-agent fan-out, task partitioning, ephemeral worker agents, scoped retrieval per agent. |

## Why this framing wins

- It maps to **verbs** an engineer can act on, not abstract layers.
- It composes: real systems use all four. Most failures come from over-relying on one.
- It surfaces trade-offs explicitly: aggressive Compress trades quality for tokens; aggressive Isolate trades coordination overhead for window size.

## Practitioner heuristics

- **Compress first** for runaway sessions — fastest fix.
- **Isolate first** for cross-domain tasks (research + coding + writing) — quality jumps.
- **Select first** for noisy RAG — biggest accuracy win.
- **Write first** for long-running plans — turns the session into a persistent system.

## How this complements Anthropic's 6 layers

The 6 layers describe **what enters context** (system, memory, retrieved, tools, history, task). The 4 buckets describe **what you do about it**. The two models are orthogonal and reinforcing — both belong in a complete context-engineering toolkit.

## Why authoritative

LangChain serves as infrastructure for hundreds of thousands of production agents; this article is the most-cited 2024 summary of the discipline and the source of the now-standard 4-bucket terminology.
