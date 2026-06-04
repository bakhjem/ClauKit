# Awesome KG Construction Tools (curated list)

**Source**: https://github.com/kg-construct/awesome-kgc-tools

## What it is

A curated GitHub list of tools for knowledge graph construction across the full stack: ingestion, extraction, mapping, validation, query, visualization.

## Categories worth knowing

### Extraction (text → triples)

- **kg-gen** — LLM-based, schema-aware (see separate ref).
- **REBEL** — pretrained model for relation extraction.
- **OpenIE** — Stanford's open information extraction; lighter than LLM.
- **spaCy + custom rules** — fast, cheap baseline.

### Mapping (structured data → graph)

- **R2RML / RML** — declarative mappings from CSV/JSON/RDB to RDF.
- **Morph-KGC** — open-source RML engine.

### Storage / query

- **Neo4j** — most popular labeled property graph DB; Cypher.
- **Memgraph** — Neo4j-compatible, faster on streaming workloads.
- **Apache Jena** — RDF + SPARQL.
- **DuckDB + graph plugins** — SQL-first, lightweight option for analytics-style queries.

### Validation

- **SHACL** — Shapes Constraint Language; declarative schema validation for RDF.
- **PyShEx** — Python implementation of Shape Expressions.

## How to use this list

Pick **one** tool per stage (extract / map / store / query / validate). Mixing many makes the pipeline brittle. Start small: extract → store → query, add validation when the schema stabilizes.

## Why authoritative

The `kg-construct` GitHub org curates the list with contributions from the KG construction research community; it's the most-linked starting point for tool selection.
