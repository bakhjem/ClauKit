# GitHub · Best Practices for Repositories

**Source**: https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories

## Repository hygiene

- **README at root** — explains what the repo is, how to build, how to contribute. First file a visitor sees.
- **LICENSE at root** — without one, "all rights reserved" applies by default; that surprises contributors.
- **CODE_OF_CONDUCT.md** and **CONTRIBUTING.md** — explicit expectations reduce friction in open repos.
- **`.gitignore` tuned to the stack** — never commit `node_modules`, `__pycache__`, build artifacts, or env files.
- **CI config at root** (`.github/workflows/`) — visible and discoverable.

## Branch and history

- Keep branches short-lived; long-running branches diverge and explode at merge time.
- Use protected branches for `main`; require PR review and passing CI.
- Squash or rebase per team preference — but pick one and stick with it; mixed strategies make `git log` hard to read.

## Scaling considerations

- For monorepos, use **CODEOWNERS** to route reviews per directory.
- Use **GitHub Issue Forms** to standardize bug reports; reduces back-and-forth in triage.
- Public repos: add **SECURITY.md** describing how to report vulnerabilities responsibly.

## Why authoritative

GitHub's official docs; reflects how the platform expects repos to be structured for its tooling (PR reviews, code search, dependency graph) to work well.
