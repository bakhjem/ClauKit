---
description: Skill operations dispatcher (add · create · optimize · fix-logs)
argument-hint: add [skill-name] [prompt] | create [prompt-or-url] | optimize [skill-name] [prompt] | fix-logs [prompt-or-path]
---

## Variables

ACTION: $1 (one of `add`, `create`, `optimize`, `fix-logs`)
ARG1: $2
ARG2: $3

## Activation

Activate `skill-creator` skill ([.claude/skills/software/skill-creator/SKILL.md](.claude/skills/software/skill-creator/SKILL.md)) + `claude-code` + `docs-seeker` (when needed). For `optimize`, also activate `planning` skill ([.claude/skills/software/planning/SKILL.md](.claude/skills/software/planning/SKILL.md)).

## Workflow

Dispatch to the matching operation based on {ACTION}.

### `add` — extend existing skill (**Think harder.**)
- SKILL: {ARG1} (required) — if missing → ask user
- PROMPT: {ARG2} (required) — if missing → ask user
- Mission: add new reference files or scripts to skill at `.claude/skills/{SKILL}/`.
- Distinct from `create` (new skill) — this variant **adds** references/scripts to an **existing** skill.

### `create` — create from scratch (**Ultrathink.**)
- PROMPT: {ARG1}…{ARGN} (= `$ARGUMENTS` minus the action)
- Mission: create a new skill in `.claude/skills/` directory.
- Distinct from siblings — produces a **new** skill (not modify/extend existing).

### `optimize` — refactor existing skill, plan-first (**Think harder.**)
- SKILL: {ARG1} (default: `*` — all skills)
- PROMPT: {ARG2} (default: empty)
- Mission: propose a plan to optimize existing skill in `.claude/skills/{SKILL}/`. When done, ask user to review:
  - **Approve** → write plan per "Output Requirements" → ask if implement
  - **Reject** → revise or ask clarifying question (one at a time) → repeat review
- Distinct from siblings — produces an **optimization plan** before any changes. No code edits without approval.
- **Output Requirements**: follow **Plan Directory Structure** + **Plan File Specification** from `planning` skill. Plus skill-specific rules from `skill-creator` skill (token efficiency for progressive disclosure; `SKILL.md` + references structured for lazy loading).

### `fix-logs` — log-driven skill fix (**Think harder.**)
- PROMPT: {ARG1}…{ARGN} (= `$ARGUMENTS` minus the action) — optional path-to-skill or extra context
- Mission: fix the agent skill based on `./logs.txt` in the project root.
- Distinct from siblings — input is `./logs.txt` (failure logs from skill execution). Diagnose root cause from logs → fix.

## Input Handling (shared across all actions)

| Input | Handler |
|---|---|
| URL (single docs page) | `Explore` subagent → traverse every internal link, no skip |
| Multiple URLs | Multiple `Explore` subagents in parallel |
| Many files | Multiple `Explore` subagents in parallel |
| GitHub URL | `repomix` to summarize (install if needed) + multiple `Explore` subagents in parallel |

## Notes
- If {ACTION} is missing or not one of the four above, print usage and exit.
- All skill-creation methodology + progressive-disclosure rules → `skill-creator` skill (single source of truth).
- All plan structure → `planning` skill.
- `SKILL.md` + reference files must be token-efficient for **progressive disclosure**.

## Examples
- `/ck:cc-skill add my-skill "add reference doc for X API"` — extend existing skill.
- `/ck:cc-skill create "create skill for parsing CSV with edge cases"` — new skill from prompt.
- `/ck:cc-skill create https://docs.example.com/api` — new skill from docs URL.
- `/ck:cc-skill optimize my-skill "reduce token usage"` — plan-first refactor.
- `/ck:cc-skill optimize` — optimize all skills (`*`).
- `/ck:cc-skill fix-logs` — diagnose & fix from `./logs.txt`.
