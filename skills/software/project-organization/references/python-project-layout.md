# Python · Project Layout Best Practices

**Source**: https://realpython.com/ref/best-practices/project-layout/

## The `src/` layout

The recommended layout for installable Python packages:

```
my_project/
├── src/
│   └── my_package/
│       ├── __init__.py
│       └── ...
├── tests/
├── docs/
├── pyproject.toml
└── README.md
```

Why `src/`? It forces tests to import the **installed** package, not the working directory. Catches missing-from-wheel bugs that flat layouts hide until release.

## `pyproject.toml` consolidates

Modern Python (3.11+) puts build, dependency, and tool config in one file:

- `[project]` — package metadata, dependencies
- `[tool.black]`, `[tool.ruff]`, `[tool.pytest.ini_options]` — replaces multiple dotfiles

Aim to delete `setup.py`, `setup.cfg`, `requirements*.txt` (or generate them from `pyproject.toml`).

## Tests

- `tests/` mirrors `src/my_package/` structure.
- Each test file imports from `my_package`, never from a relative path.
- Configure pytest to discover from `tests/`: `[tool.pytest.ini_options] testpaths = ["tests"]`.

## When to deviate

- **Applications** (not libraries) can use a flat layout — they're not installed elsewhere.
- **Notebook-heavy projects** add a `notebooks/` directory alongside `src/`.
- **Mono-repos** wrap multiple Python packages under one `packages/` or `libs/` dir.

## Why authoritative

Real Python is the most-cited practical-guides site for Python; reflects PEP 517/518/621 and Python Packaging Authority recommendations.
