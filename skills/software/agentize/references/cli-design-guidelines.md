# CLI Design for AI Agents

**Source**: https://clig.dev/ (CLI Guidelines)

## Why CLI ergonomics matter for agents

Even when wrapping a CLI behind MCP, the CLI itself is what executes. Good CLI design makes the MCP layer thin and the failure modes predictable.

## Principles that translate well to agents

- **Be helpful** — every subcommand has `--help`. The MCP wrapper can surface this verbatim in tool descriptions.
- **Be concise** — output one thing on stdout (the result), one channel for diagnostics (stderr). Agents parse stdout; mixed-channel output causes flaky tool parsing.
- **Be machine-readable** — support `--json` (or `--format json`). Tables look nice but break parsers.
- **Exit codes matter** — 0 for success, non-zero for failure, distinct codes per failure class. Agents branch on exit codes.

## What to do per subcommand

- **Validate inputs early** — fail fast with a clear message; agents can recover from explicit "X must be one of Y" much better than from generic stack traces.
- **Side-effect commands need `--dry-run`** — surfaces what would happen without doing it. The MCP `confirm: false` mode maps directly to `--dry-run`.
- **Long-running commands need `--watch`** — agents shouldn't have to poll; emit progress events.

## Examples to copy

- `gh` (GitHub CLI) — well-structured subcommands, consistent flags, `--json` everywhere.
- `kubectl` — `verb resource [name] [flags]` grammar; once learned, all subcommands are predictable.
- `git` — venerable; not always agent-friendly (output parsing varies per subcommand).

## Why authoritative

`clig.dev` is the most-cited modern CLI design reference; it codifies practices that GitHub, Heroku, and Cloud Native Computing Foundation tools follow.
