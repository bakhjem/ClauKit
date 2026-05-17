# Monorepo vs Polyrepo Trade-offs

**Sources**:
- https://oneuptime.com/blog/post/2026-02-26-argocd-best-practices-repository-structure/view
- https://medium.com/code-factory-berlin/github-repository-structure-best-practices-248e6effc405

## When monorepo wins

- **Shared code is real and changes often** — types, utilities, design system used by 3+ apps.
- **Atomic cross-cutting changes** — renaming an API shape and all its callers in one PR.
- **Uniform tooling** — one ESLint, one Prettier, one CI config covers everything.
- **Visibility** — anyone can browse all the code; no hidden internal repos.

## When polyrepo wins

- **Teams are independent and decoupled** — Team A's deployment never blocks Team B.
- **Wildly different stacks** — a Rust service and a Swift app share little tooling benefit.
- **Open-source boundaries** — public libs need their own repo for stars, issues, releases.
- **Compliance / access control** — different repos can have different access rules; monorepos can't.

## Migration patterns

1. **Polyrepo → Monorepo**: import each repo as a subtree with `git subtree add --prefix=apps/foo …`. Preserves history. Switch CI per app, then trim duplicate tooling.
2. **Monorepo → Polyrepo**: rare and painful. Usually triggered by genuine independence (a service is sold or open-sourced). Use `git subtree split` to extract history per directory.

## Tool selection inside a monorepo

| Tool | Best when |
|---|---|
| **pnpm workspaces** | JS/TS monorepo, minimal extra config |
| **Turborepo** | Need remote build cache + parallel task graph |
| **Nx** | Polyglot, plugin-rich, has its own generators |
| **Bazel** | Very large, multi-language, build correctness paramount |

Pick by smallest tool that solves *today's* pain — Bazel for a 10-package repo is over-engineered.

## Why authoritative

OneUptime's ArgoCD guide and the Code Factory Berlin write-up are widely linked in monorepo discussions; both reflect production migrations rather than theory.
