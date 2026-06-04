# Mem0 · Context Engineering AI Agents Guide

**Source**: https://mem0.ai/blog/context-engineering-ai-agents-guide

## Practical patterns

Mem0's guide focuses on what teams actually do in production. Five patterns recur:

### 1. Layered memory

- **Working memory**: current task scratchpad. Wiped between sessions.
- **Episodic memory**: per-session summaries. Retrieved by recency.
- **Semantic memory**: durable facts. Retrieved by similarity.

Storing these separately lets each be retrieved with different ranking strategies.

### 2. Context budgets per turn

Assign a hard token budget to each layer (e.g. system 5%, memory 15%, retrieved 30%, tools 10%, history 30%, task 10%). Enforce at the orchestration layer, not by hoping. When a layer exceeds budget, compact or re-rank.

### 3. Re-ranking over top-K

Naive top-K retrieval injects noise. A cross-encoder re-rank on top-50 → top-5 typically lifts answer quality more than swapping the LLM.

### 4. Tool partition by phase

Different phases of a task need different tools. Plan phase: research + read tools. Execute phase: edit + run tools. Switching tool sets between phases halves the always-loaded schema cost.

### 5. Feedback signals

Capture per-turn outcomes (success / retry / abandon) and feed back into retrieval ranking — agents that learn their own retrieval quality outperform static RAG.

## Why authoritative

Mem0 builds memory infrastructure for production AI agents; their guide reflects observations across many customer deployments rather than a single team's setup.
