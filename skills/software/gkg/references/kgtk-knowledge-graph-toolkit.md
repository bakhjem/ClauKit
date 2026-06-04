# KGTK · Knowledge Graph Toolkit (USC)

**Source**: https://usc-isi-i2.github.io/kgtk/

## Scope

KGTK is a framework — not just an extractor — covering the full KG lifecycle:

- **Import** — read from RDF, Neo4j, CSV, Wikidata dumps.
- **Transform** — filter, project, merge, deduplicate.
- **Validate** — schema checks, statistical anomaly detection.
- **Query** — KGTK Query language; SPARQL-like but tabular.
- **Export** — emit to graph DBs, RDF, JSON-LD.

## When KGTK is the right tool

- The corpus is large (>1M triples) and the graph is multi-source — KGTK is engineered for hyper-relational graphs.
- You need reproducible pipelines — KGTK commands compose into shell pipelines (`kgtk import ... | kgtk filter ... | kgtk export ...`).
- Validation is a first-class concern — schema enforcement, type checks, statistical outlier detection.

## Trade-offs vs LLM-based extraction

- KGTK assumes you already have structured input (or have run extraction separately). It doesn't extract from raw prose; pair it with `kg-gen` or spaCy for the extract step.
- Learning curve is non-trivial — the query language is its own dialect.

## Typical pipeline alongside `gkg`

1. Use `kg-gen` or spaCy to extract triples from prose.
2. Pipe into KGTK for validation, deduplication, enrichment.
3. Export to Neo4j or JSON for query in agents.

## Why authoritative

Developed by USC's Information Sciences Institute, used in DARPA programs and academic large-graph projects; comprehensive and well-documented.
