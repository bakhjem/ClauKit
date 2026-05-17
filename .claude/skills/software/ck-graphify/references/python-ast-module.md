# Python `ast` module

**Source**: https://docs.python.org/3/library/ast.html

## What it is

Python's standard-library module for parsing Python source into an abstract syntax tree and walking it. Ships with every Python install — no dependencies.

## Why it suits code graphing

- **Built-in**: zero install for Python-only graphing pipelines.
- **Visitor pattern**: `ast.NodeVisitor` makes traversal idiomatic; override `visit_FunctionDef`, `visit_ClassDef`, `visit_Call`, etc.
- **Source location preserved**: every node carries `lineno` and `col_offset` — critical for emitting graph nodes that link back to source.
- **Stable API**: the AST shape changes only with new language features (e.g. pattern matching in 3.10); old code keeps working.

## Typical extraction

```python
import ast
tree = ast.parse(open(path).read())
for node in ast.walk(tree):
    if isinstance(node, ast.FunctionDef):
        emit_node(kind='fn', name=node.name, file=path, line=node.lineno)
    elif isinstance(node, ast.Call):
        callee = getattr(node.func, 'id', None) or getattr(node.func, 'attr', None)
        if callee:
            emit_edge(kind='calls', to=callee, file=path, line=node.lineno)
```

## Limits

- **Static only**: dynamic dispatch (`getattr`, `__getattr__`), `eval`, decorators that mutate behavior — all invisible.
- **Single-file scope**: `ast` doesn't resolve imports across files. You compose multiple parses to get a repo-level graph.
- **No type inference**: for type-resolved call edges, layer mypy or pyright on top.

## When to layer additional tools

- **mypy / pyright** for type-resolved calls.
- **rope / jedi** for symbol resolution and rename-aware traversal.
- **tree-sitter-python** when you also need to graph non-Python files in the same pipeline.

## Why authoritative

Official Python documentation; the canonical reference for Python static analysis.
