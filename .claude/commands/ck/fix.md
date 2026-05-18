---
description: ⚡⚡ Analyze and fix issues (combinable flags: --auto · --review · --quick · --parallel)
argument-hint: [issues] [--auto] [--review] [--quick] [--parallel]
---

If there is an existing markdown implementation plan, use `/ck:code <path-to-plan>` to implement it.

Otherwise, follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)).

## Mission
<issues>$ARGUMENTS</issues>

## Flags (combinable — parse `$ARGUMENTS` and apply ALL matching modifiers)

| Flag | Effect |
|---|---|
| *(none)* | **default** — full pipeline: diagnose → plan → implement → verify → post-impl docs/roadmap update. No review. Sequential. |
| `--auto` | **auto-detect** — inspect the issue and automatically enable other flags (e.g. add `--review` for risky/security changes, `--parallel` for independent issues, `--quick` for trivial). Report which flags were chosen and why before running. |
| `--review` | **+ review** — add Stage [7] `code-reviewer` subagent. Critical findings loop back to implement + retest. |
| `--quick` | **minimal** — skip planning (Stage [4]) and post-impl docs/roadmap update. Use `debugger` only at diagnose (no `researcher`). Combine with `--review` to add review back. |
| `--parallel` | **parallel subagents** — at Stage [3] run `debugger` + `researcher` in parallel; spawn multiple researchers/testers concurrently where independent. |

## Pipeline (stages from `fix-pipeline.md`)

Apply the matrix below in order. Each stage runs unless its row is marked SKIP by the active flag set.

| Stage | Default | `--quick` | `--review` | `--parallel` |
|---|---|---|---|---|
| [2] Multimodal (screenshots/videos → `ai-multimodal`) | ✓ | ✓ | ✓ | ✓ |
| [3] Diagnose (`debugger` + `researcher`) | `debugger` + `researcher`, sequential | `debugger` only | unchanged | run subagents in parallel |
| [4] Plan (`planner` writes implementation plan) | ✓ | **SKIP** | unchanged | — |
| [5] Implement (main agent) | ✓ | ✓ | ✓ | ✓ |
| [6] Verify (`tester`) | ✓ | ✓ | ✓ | spawn multiple `tester`s if independent suites |
| [7] Review (`code-reviewer`) | **SKIP** | **SKIP** | **+ enabled** | unchanged |
| Post-impl: `project-manager` + `docs-manager` parallel → plan progress · docs · `./docs/project-roadmap.md` | ✓ | **SKIP** | unchanged | ✓ |
| Final: summary → ask commit/push → `git-manager` | ✓ | ✓ | ✓ | ✓ |

**Failure loop:** verification failure → back to [3] (re-diagnose). Review failure → back to [5] (re-implement + retest).

## Thinking budget by flag combo

| Combo | Budget |
|---|---|
| `--quick` (alone or with `--parallel`) | **Think hard** |
| default / `--review` / `--parallel` | **Think harder** |
| `--auto` (router) | **Ultrathink** the routing decision, then think at the budget of the chosen combo |
| Anything including `--quick --review` (most-everything-on minimal) | **Think harder** |

## Companion skills
- `problem-solving` — activates during diagnose for root-cause synthesis.
- `sequential-thinking` — break complex problems into steps (default + `--review`).
- `ai-multimodal` — Stage [2], plus visual-asset generation if needed.

## Specialized siblings (not flags — they have distinct *inputs*, not different pipeline shapes)
- `/ck:fix:logs` · `/ck:fix:ci` — input from log files / CI URL instead of issue text
- `/ck:fix:test` · `/ck:fix:types` · `/ck:fix:ui` — specialized inputs/agents

## Examples
- `/ck:fix payment webhook 500s` — default full pipeline, no review, sequential.
- `/ck:fix --quick typo in login button label` — minimal pipeline.
- `/ck:fix --review session token leak in middleware` — full pipeline + code-reviewer.
- `/ck:fix --auto refactor 3 unrelated services` — let auto pick flags (likely `--parallel --review`).
- `/ck:fix --quick --review --parallel hot patches across 5 modules` — minimal stages but reviewed, run in parallel.
