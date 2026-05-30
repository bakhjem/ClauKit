---
description: ⚡⚡ Guided codebase tour for new / returning devs (10-min orientation)
argument-hint: [optional-focus-area]
---

## Focus (optional)
<focus>$ARGUMENTS</focus>

## Instructions

**Activate the `onboarding` skill** ([.claude/skills/software/onboarding/SKILL.md](.claude/skills/software/onboarding/SKILL.md)) and follow its 6-phase protocol in full:

1. **Read existing docs (parallel)** — README, CLAUDE.md, docs/*
2. **Tech stack inventory** — from manifest files
3. **Entry points map** — app / test / CLI / deploy
4. **Key modules** — top-level folder purposes
5. **Dev setup verification** — shortest path to running
6. **First-task suggestions** — read / try / build

The `onboarding` skill is the single source of truth for tour methodology; this command is only the trigger.

## When focus arg is provided

If `<focus>` is non-empty (e.g. `frontend`, `auth`, `db`), bias Phases 3-4 toward that area — but still cover Phases 1-2 + 5-6 in full.

## Hard Rules

- **No implementation.** Orient only — do not edit, do not run dev server.
- **No fabricated paths.** Verify every path/module exists.
- **Cap at 10-min read.** Refer the dev to `/ck:ask` and `/ck:scout` for depth.
- **Sacrifice grammar for concision.**
- **List doc + setup gaps at the end.**

## Related

- `/ck:scout` — drill into specific files post-tour
- `/ck:ask` — deeper architectural Q&A
- `/ck:watzup` — recent-change summary for returning devs
- `/ck:bootstrap` — when there is NO project yet
