---
description: ⚡⚡ Analyze and fix issues (variants ci logs test types ui · combinable --auto --review --quick --parallel)
argument-hint: [issues] [ci|logs|test|types|ui] [--auto] [--review] [--quick] [--parallel]
---

## Variables

ARGS: `$ARGUMENTS` (full input)
VARIANT: `$1` if it matches one of `ci`, `logs`, `test`, `types`, `ui`; else absent
MODIFIERS: any `--auto`, `--review`, `--quick`, `--parallel` flags (combinable)
ISSUES: ARGS minus VARIANT and MODIFIERS

If there is an existing markdown implementation plan, use `/cook <path-to-plan>` to implement it.

## Dispatch

1. Inspect ARGS. If VARIANT present → dispatch to **Variant Workflows** below (each has its own pipeline shape and input source).
2. Otherwise → run **Default Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)) on ISSUES with MODIFIERS.

## Default Pipeline (no variant)

### Mission
<issues>{ISSUES}</issues>

### Modifier flags (combinable — parse ARGS and apply ALL matching)

| Flag | Effect |
|---|---|
| *(none)* | **default** — full pipeline: diagnose → plan → implement → verify → post-impl docs/roadmap update. No review. Sequential. |
| `--auto` | **auto-detect** — inspect the issue and automatically enable other flags (e.g. add `--review` for risky/security changes, `--parallel` for independent issues, `--quick` for trivial). Report which flags were chosen and why before running. |
| `--review` | **+ review** — add Stage [7] `code-reviewer` subagent. Critical findings loop back to implement + retest. |
| `--quick` | **minimal** — skip planning (Stage [4]) and post-impl docs/roadmap update. Use `debugger` only at diagnose (no `researcher`). Combine with `--review` to add review back. |
| `--parallel` | **parallel subagents** — at Stage [3] run `debugger` + `researcher` in parallel; spawn multiple researchers/testers concurrently where independent. |

### Pipeline (stages from `fix-pipeline.md`)

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

### Thinking budget by flag combo

| Combo | Budget |
|---|---|
| `--quick` (alone or with `--parallel`) | **Think hard** |
| default / `--review` / `--parallel` | **Think harder** |
| `--auto` (router) | **Ultrathink** the routing decision, then think at the budget of the chosen combo |
| `--quick --review` (most-everything-on minimal) | **Think harder** |

### Companion skills
- `problem-solving` — activates during diagnose for root-cause synthesis.
- `sequential-thinking` — break complex problems into steps (default + `--review`).
- `ai-multimodal` — Stage [2], plus visual-asset generation if needed.

## Variant Workflows (distinct inputs / pipeline shapes)

Each variant follows the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)) with the differences listed.

### `logs` — log-driven (⚡)

**Input:** local `./logs.txt`
<issue>{ISSUES}</issue>

- **Stage [1]** (input): read `./logs.txt`. If missing → reproduce issue first and pipe output to `./logs.txt`.
- **Stage [3]** (diagnose): `debugger` subagent reads `./logs.txt` → find root causes.
- **Stage [3b]** (locate): `scout` subagent → find exact code location of issues.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` subagent.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3b] (re-scout).

**Distinct:** input = local log file. Adds `scout` subagent to bridge logs → code location.

### `ci` — CI-failure-driven (⚡)

**Input:** GitHub Actions URL
<url>{ISSUES}</url>

- **Stage [1]** (input): `debugger` subagent reads GitHub Actions logs via `gh` command.
- **Stage [3]** (diagnose): `debugger` finds root causes from CI logs.
- **Stage [3b]** (locate): `scout` subagent → find exact code location of issues.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` subagent.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3b] (re-scout).
- If `gh` not available → instruct user to install + authorize GitHub CLI first.

**Distinct:** input = GitHub Actions URL (remote, fetched via `gh`). Like `logs` but for remote CI runs.

### `test` — test-first (⚡⚡)

**Input:** running test suite
<issues>{ISSUES}</issues>

- **Stage [1]** (input): `tester` subagent compiles code + fixes syntax errors first.
- **Stage [3]** (diagnose): `tester` runs test suite → failures handed to `debugger` for root-cause.
- **Stage [4]** (plan): `planner` subagent creates plan from reports.
- **Stage [5]** (implement): main agent.
- **Stage [6]** (verify): `tester` re-runs tests.
- **Stage [7]** (review): `code-reviewer` subagent (quick pass).
- **Failure loop:** back to stage [3] (re-diagnose).

**Distinct:** input = running test suite. `tester` runs BEFORE `debugger` (inverse of other variants).

### `types` — typecheck-driven, minimal (⚡)

- **Stage [1]** (input): run `bun run typecheck` OR `tsc` OR `npx tsc`.
- **Stages [3]–[5]** collapsed: direct fix loop — read errors, apply fix, re-run typecheck.
- **No agents** — main agent works directly.
- **Loop** until typecheck shows zero errors.

**Hard rules:**
- Fix **all** type errors. Repeat until clean.
- **Do NOT use `any`** just to pass the typecheck — fix at the source.

**Distinct:** simplest variant — no subagents, no planner, no reviewer. Tight feedback loop directly against `tsc`/`bun typecheck`.

### `ui` — UI-specialist pipeline (⚡⚡)

`ui-ux-designer` subagent reads `./docs/design-guidelines.md` then fixes:
<issue>{ISSUES}</issue>

- **Stage [2]** (multimodal): if screenshots/videos → `ai-multimodal` skill for detailed issue description.
- **Stage [3]** (diagnose): `ui-ux-designer` subagent (NOT `debugger`).
- **Stage [4]** (plan): SKIP — go directly to implement.
- **Stage [5]** (implement): `ui-ux-designer` applies fix step by step.
- **Stage [6]** (verify): two-layer check:
  - Screenshot exact parent container + `ai-multimodal` analysis (also `video-analysis` / `document-extraction` as needed) → verify design-guideline match.
  - `chrome-devtools` skill → verify implementation match.
  - `tester` agent → compile + ensure no regressions.
  - If issues remain → loop back to [5].
- **Post-impl (user approves):** `project-manager` + `docs-manager` subagents in parallel → update plan progress · `./docs/*` · `./docs/project-roadmap.md`.
- **Post-impl (user rejects):** ask reasons, loop the pipeline.
- **Final:** summary + ask about commit/push → `git-manager`.

**Companion skills:** `ai-multimodal` (generate + verify visual assets), `ImageMagick` (image edits — bg removal, crop, resize), `chrome-devtools` (browser verification).

**Distinct:** specialist agent = `ui-ux-designer` (not `debugger`). Multi-layer visual verification (screenshot + AI analysis + chrome-devtools). Post-impl docs update + commit flow (like `/fix --review`).

## Examples
- `/fix payment webhook 500s` — default full pipeline.
- `/fix --quick typo in login button label` — minimal pipeline.
- `/fix --review session token leak in middleware` — full pipeline + code-reviewer.
- `/fix --auto refactor 3 unrelated services` — auto picks flags.
- `/fix --quick --review --parallel hot patches across 5 modules` — minimal stages but reviewed, run in parallel.
- `/fix logs` — log-driven from `./logs.txt`.
- `/fix ci https://github.com/org/repo/actions/runs/123` — CI-failure-driven.
- `/fix test` — test-first.
- `/fix types` — typecheck-driven minimal.
- `/fix ui "card spacing on /pricing is off"` — UI specialist pipeline.
