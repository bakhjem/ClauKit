# kg-gen · LLM-based Knowledge Graph Generation

**Source**: https://github.com/stair-lab/kg-gen (NeurIPS 2025)

## What it is

A tool that generates knowledge graphs from text using LLMs with structured prompting. Released alongside a NeurIPS 2025 paper; designed to make extraction fast and schema-aware.

## How it works

1. **Define a schema** — entity types, relation types, and their allowed combinations.
2. **Chunk the source** — paragraphs or windowed sentences.
3. **Per chunk, prompt the LLM** with the schema and the chunk; request structured output (JSON).
4. **Merge** — de-duplicate entities across chunks by name + type; resolve relation conflicts by frequency.
5. **Validate** — drop relations whose endpoints don't match schema-allowed types.

## Strengths

- **Schema-first** — output is queryable by design, not just a soup of triples.
- **Iteration speed** — schema change → re-extract → check; minutes per loop.
- **Modern LLMs reduce extraction error** — GPT-4-class models hit ~80% precision on well-defined schemas (per the paper).

## Limits

- **Cost** — per-doc token cost scales with corpus size. Use cheap models (Haiku, Gemini Flash) for first pass.
- **Hallucination** — LLMs occasionally invent entities. Mitigate with strict schema validation and require entity surface forms be substrings of the source.
- **Long documents** — chunking loses cross-chunk context. Use a second pass over neighboring chunks for cross-reference relations.

## When to choose this over spaCy/rule-based

- The schema isn't stable yet — iteration speed matters more than cost.
- The source is well-written prose (design docs, RFCs); not noisy text (chat logs, OCR).
- Relation types include semantic predicates ("supersedes", "implements") that rules struggle with.

## Why authoritative

NeurIPS-accepted research; reflects current state of the art on text → KG extraction with LLMs.
