# dependency-cruiser

**Source**: https://github.com/sverweij/dependency-cruiser

## What it is

A static analysis tool for JavaScript and TypeScript codebases. Inspects import statements to build a dependency graph and applies user-defined rules to that graph.

## Capabilities used by ck-graphify

- **Cycle detection**: surfaces circular imports as graph rule violations, with file + line.
- **Layer constraints**: encode architectural rules ("controllers must not import models directly") as rules; the tool fails on violations.
- **Output formats**: JSON (machine-readable, feed into your own graph store), DOT (Graphviz), HTML report.
- **Pluggable parsers**: works with Babel, Swc, or built-in TypeScript compiler.

## Typical pipeline

1. `depcruise --output-type json src` → JSON dependency graph.
2. Pipe to your indexer; merge with AST-level call graph for richer queries.
3. Add rules in `.dependency-cruiser.js` to enforce architecture in CI.

## When to prefer over rolling your own

dependency-cruiser is the right choice when:
- Repo is JS/TS-only.
- You want *answers* (cycles, orphans, architecture violations), not a framework.
- You want CI integration via a single binary.

When to roll your own with tree-sitter: polyglot repos, custom edge types (calls, type references), or graph queries beyond what depcruise's rule language supports.

## Why authoritative

Widely adopted JS/TS dep tool; clear semantics, active maintenance, used in many production CI setups.
