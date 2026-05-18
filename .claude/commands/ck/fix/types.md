---
description: ⚡ Fix type errors
---

Follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)).

## Variant: `/ck:fix:types` — typecheck-driven (minimal)

- **Stage [1]** (input): run `bun run typecheck` OR `tsc` OR `npx tsc`.
- **Stages [3]–[5]** collapsed: direct fix loop — read errors, apply fix, re-run typecheck.
- **No agents** — main agent works directly.
- **Loop** until typecheck shows zero errors.

## Hard Rules
- Fix **all** type errors. Repeat until clean.
- **Do NOT use `any`** just to pass the typecheck — fix at the source.

## Distinct from siblings
- Simplest variant — no subagents, no planner, no reviewer.
- Tight feedback loop directly against `tsc`/`bun typecheck`.
