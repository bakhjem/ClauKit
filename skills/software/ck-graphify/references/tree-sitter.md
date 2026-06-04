# Tree-sitter

**Source**: https://tree-sitter.github.io/tree-sitter/

## What it is

A parser-generator framework + runtime. Tree-sitter produces a concrete syntax tree (CST) for source code in one of ~40 supported languages — JavaScript, TypeScript, Python, Rust, Go, Java, C/C++, Ruby, and more — through a single API.

## Why it fits code graphing

- **Language-agnostic API**: one traversal style works across all supported languages — vital when graphing a polyglot repo.
- **Incremental parsing**: when a file changes, tree-sitter re-parses only the affected subtree. Critical at scale.
- **Error recovery**: returns a usable tree even for syntactically broken code, so an in-progress edit doesn't break your graph.
- **Query DSL**: tree-sitter ships a Lisp-like query language for pattern-matching tree nodes; use it to extract definitions and uses without hand-writing visitor code per language.

## Typical pipeline

1. Install language grammar (npm or system package).
2. `parse(source)` → tree.
3. Run a captured-name query (e.g. `(function_declaration name: (identifier) @fn.def)`) to extract symbol definitions.
4. Run a use query (`(call_expression function: (identifier) @fn.use)`) for references.
5. Emit (defs, uses) into your graph store.

## Adoption signals

GitHub uses tree-sitter for syntax highlighting and code navigation; Neovim, Atom, and Helix use it for editor features. The breadth of production use is a strong stability signal.

## Why authoritative

Tree-sitter is the de-facto multi-language parsing framework for code-analysis tools in 2025; the official site is the canonical reference.
