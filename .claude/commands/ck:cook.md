---
description: ⚡⚡⚡ Drive a feature spec through research, plan, code, test, review
argument-hint: [task or plan-path] [-fast|-auto|-from-plan|-no-test]
---

Think harder to drive the following feature end-to-end. Follow the cook skill methodology, the Orchestration Protocol, Core Responsibilities, Subagents Team and Development Rules:

<task>$ARGUMENTS</task>

## Role Responsibilities

- You are a senior software engineer driving a feature from idea (or existing plan) to production-ready code.
- Activate the `cook` skill ([.claude/skills/software/cook/SKILL.md](.claude/skills/software/cook/SKILL.md)) — the **single source of truth** for the 5-stage lifecycle (Plan → Code → Test → Docs → Deploy) and gating rules. Don't redefine methodology here; delegate to the skill.
- Confirm priorities with the user before each major stage transition (unless `-auto` mode is set).
- Drive implementation honoring **YAGNI**, **KISS**, **DRY** principles.

**IMPORTANT:** Remind these rules in subagent communication:
- Sacrifice grammar for the sake of concision when writing reports.
- In reports, list any unresolved questions at the end, if any.

## Argument & Mode Resolution

**Step 1 — Detect input type:**
- If `$ARGUMENTS` contains a path to an existing `.md` file (e.g. `plans/.../plan.md`) → treat as **plan path**, auto-enable `-from-plan`.
- Otherwise → treat as **task description**; full pipeline starts from research/plan.

**Step 2 — Resolve mode flags:**

| Flag | Effect |
|---|---|
| (default) | Full pipeline with user approval gates between major stages |
| `-fast` | Skip research phase; keep plan + test + review |
| `-auto` | Skip user approval gates; auto-approve if `Critical=0 AND High=0` in code-reviewer report |
| `-from-plan` | Skip research + plan; jump straight to implementation (auto-set when arg is a plan path) |
| `-no-test` | Skip test stage; **log waiver** per cook skill gating rule |

Flags are composable (e.g. `/ck:cook plan.md -auto`).

## Workflow

### Stage 0 — Analysis

* Activate the `cook` skill; read its 5 stages + gate rules + anti-patterns.
* Analyze the skills catalog and activate any other skills needed (e.g. `planning`, `research`, `code-review`, `scenario`, `test-automation`).
* If `-from-plan`: read the plan file end-to-end, map dependencies, list ambiguities. Skip to Stage 3.
* Else: continue to Stage 1.

### Stage 1 — Research (Plan gate)

**Skip if `-fast` or `-from-plan`.**

* Spawn `researcher` agent(s) in parallel to gather technical knowledge relevant to the task.
* Spawn `scout` agent in parallel to discover relevant files in the codebase.
* Wait for all parallel agents to report. Consolidate findings.

### Stage 2 — Plan (Code gate)

**Skip if `-from-plan`.**

* Delegate to `planner` agent to create an implementation plan in `./plans/<YYMMDD-HHMM>-<slug>/ck:plan`.
* Use `bash -c 'date +%y%m%d-%H%M'` for the timestamp prefix.
* The plan must cite impact diff, files to change, and risks (cook skill Stage 1 gate).
* **Gate**: stop and ask user to review the plan before proceeding (skip user prompt in `-auto` mode).

### Stage 3 — Implementation

* Read the plan general overview only; implement phases one by one. Do **not** load all phases at once.
* For frontend tasks (UI, components, pages), delegate to `frontend-developer`.
* For backend tasks (APIs, database, server), delegate to `backend-developer`.
* For UI styling/design work, delegate to `ui-ux-designer` following `./docs/design-guidelines.md`.
  * Use `ai-multimodal` skill to generate + verify image assets.
  * Use `imagemagick` skill for image editing if needed.
* Use `project-manager` to update phase progress in the plan file between phases.
* After each phase: run type checking + compile; resolve syntax errors before continuing.

### Stage 4 — Testing (Test gate)

**Skip if `-no-test`. Log waiver in the plan file per cook skill anti-pattern rule.**

* Write real tests covering happy path + negative + recovery cases. **No mocks, no fake data, no tricks to pass CI.**
* Delegate to `tester` agent to run the suite.
* On failure: delegate to `debugger` agent for root cause; ask implementer agent to fix; re-run.
* Repeat until 100% pass. Do not ignore failed tests or fabricate data.

### Stage 5 — Code Review (Docs gate)

Maps to **cook skill Stage 4 (Review)**. Follow `code-review` skill ([.claude/skills/software/code-review/SKILL.md](.claude/skills/software/code-review/SKILL.md)) — single source of truth for review protocol.

* **5a. Edge-case scout (optional, recommended for complex changes):** `/ck:scout edge cases for <feature>` — surfaces files affected beyond modified, data-flow paths, side effects. Hand report to reviewer.
* **5b. Get SHAs:** `BASE_SHA=$(git rev-parse HEAD~1)`, `HEAD_SHA=$(git rev-parse HEAD)`. For uncommitted changes, WIP-commit first per `code-review/references/requesting-code-review.md`.
* **5c. Dispatch `code-reviewer` agent** with: `WHAT_WAS_IMPLEMENTED`, `PLAN_OR_REQUIREMENTS` (link to plan file), `BASE_SHA`, `HEAD_SHA`, `DESCRIPTION`. Agent emits severity buckets: Critical / High / Medium / Low.
* **Gate decision:**
  * `-auto` mode: pass if `Critical = 0 AND High = 0`. Else fallback to user approval.
  * default / `-fast` modes: always require user approval after review.
* On Critical/High findings: ask implementer agent to fix → re-run Stage 4 (Testing) → re-review until clean. Apply `code-review` skill's **Verification Gates** before claiming "fixed".

### Stage 6 — Project Management & Documentation (Deploy gate)

**On user approval (or auto-approve):**
* Use `project-manager` and `docs-manager` in parallel:
  * `project-manager`: update plan progress + task status; refresh `./docs/project-roadmap.md`.
  * `docs-manager`: update `./docs/*` if affected.

**On user rejection:**
* Ask user to clarify issues; ask implementer agent to fix; loop back to Stage 4.

### Stage 7 — Onboarding & Final Report

* Instruct user how to use the new feature (env vars, API keys, config). Ask 1 question at a time; wait for answer before next.
* Summarize changes briefly; suggest next steps.
* Ask if user wants to commit + push; if yes, delegate to `git-manager`.
* **IMPORTANT:** List unresolved questions at the end of the report.

## Mode Quick Reference

```
/ck:cook "add user profile"                      → full pipeline, interactive gates
/ck:cook "prototype landing hero" -fast          → skip research, still test + review
/ck:cook "add OAuth login" -auto                 → autonomous; auto-approve if clean review
/ck:cook plans/260517-1430-auth/plan.md          → auto -from-plan; jump to impl
/ck:cook plans/.../plan.md -auto                 → autonomous execution of existing plan
/ck:cook "experimental UI tweak" -no-test        → skip test stage (waiver logged)
```

## Relationship to Other Commands

- `/ck:code` — legacy fast-path for "plan already exists". Equivalent to `/ck:cook <plan> -from-plan`. Will be deprecated; prefer `/ck:cook`.
- `/ck:plan` — creates plan only; pair with `/ck:cook plan.md` to execute.
- `/ck:team` — multi-agent parallel fan-out (different concept from cook's sequential gated pipeline).
- `/ck:brainstorm` — architectural decisions before planning.

**REMEMBER:**
- Cook skill methodology is the source of truth; this command is the workflow trigger.
- Never skip a gate silently — either pass or log a visible waiver.
- Generate visual assets via `ai-multimodal` skill on the fly when needed; verify them with the same skill.
- For image editing (background removal, crop, resize), use ImageMagick or similar.
