---
name: onboarding
description: Use when a new developer (or a returning one after long absence) needs a fast, guided codebase orientation. Produces a 10-minute structured tour — project purpose → tech stack → entry points → key modules → dev setup → first-task suggestions. Triggers on "/ck:onboard", "where do I start", "give me a tour of this codebase", "new to this repo". Does NOT implement — orient + advise only.
metadata:
  version: "1.0.0"
---

# Onboarding — Guided Codebase Tour

Structured orientation methodology for new (or returning) developers. Replace "click around for 30 min" with a 10-min grounded tour referencing real files and existing docs.

## Core Principle

**Read before tour, tour before code.** Every claim in the tour must trace back to a real file or doc — no fabricated structure, no guessed responsibilities.

Honor **YAGNI / KISS / DRY**. Default to surfacing what already exists in `./docs/*` and `./README.md`; do NOT regenerate documentation. **Be concise** — every minute over 10 is a minute the dev could spend coding.

## When to Use

Activate when the user:
- Invokes `/ck:onboard`
- Says "I'm new here, where do I start?"
- Says "give me a tour" / "walk me through this codebase"
- Returns to a project after weeks/months and asks "what was this again?"
- Onboarding a teammate via Claude

**Skip / hand off when:**
- User wants implementation → `/ck:cook` or `/ck:plan`
- User wants a specific file lookup → `/ck:scout` or `/ck:ask`
- User wants deep architectural Q&A → `/ck:ask` + `ask` skill
- User wants to bootstrap a NEW project from scratch → `/ck:bootstrap`

## 6-Phase Tour Protocol

Run sequentially. Skip a phase only when the doc that would fill it is missing — and flag the gap.

### Phase 1 — Read existing orientation docs (PARALLEL, read-only)

Read in parallel, do NOT regenerate:
- `./README.md` — project purpose, install, quickstart
- `./CLAUDE.md` — project rules / Claude-specific guidance
- `./docs/project-overview-pdr.md` — product requirements
- `./docs/codebase-summary.md` — structure summary
- `./docs/system-architecture.md` — architecture
- `./docs/code-standards.md` — conventions
- `./docs/project-roadmap.md` — where it's going

If a doc is missing, note it under "Documentation gaps" in the final tour.

### Phase 2 — Tech stack inventory

From `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` / etc:
- Runtime + version
- Framework(s)
- Key dependencies (top 5–10, not the full list)
- Build / test / lint tooling

Cite the manifest file path so the dev can verify.

### Phase 3 — Entry points map

Locate using `Glob` + manifest scripts:
- App entry (e.g. `src/main.ts`, `app/page.tsx`, `cmd/server/main.go`)
- Test entry / runner config
- CLI entry (if any) — `package.json#bin`, `cli.js`, etc
- Deployment trigger (`Dockerfile`, CI workflows in `.github/workflows/`)

Output: 3–5 paths max with one-line purpose each.

### Phase 4 — Key modules (top-level structure)

Use `tree -L 2` or equivalent on source root. Annotate each top-level folder with:
- Purpose (1 line)
- "Touch this when…" hint

Do NOT enumerate every file — that's what `/ck:scout` is for.

### Phase 5 — Dev setup verification

From README + manifest, list the **shortest path to a running dev environment**:
1. Install deps command
2. Env file / secrets setup (point to `.env.example` if exists)
3. DB / service prerequisites
4. Run command
5. Verify command (test / health check)

If steps are unclear, flag under "Setup gaps".

### Phase 6 — First-task suggestions

Suggest 1–3 starter actions, ranked by leverage:
- **Read this first** — single most important file/doc
- **Try this** — small safe action (run tests, start dev server, run `/ck:watzup`)
- **Build this** — first meaningful change candidate (look at `TODO` / `FIXME` / open issues if available)

## Output Format

A single markdown report. Aim for ≤300 lines / ≤10-min read.

```markdown
# Codebase Tour — <project-name>

## 1. What this project does
<2-3 sentences from README + project-overview-pdr>

## 2. Tech stack
- Runtime: <X>
- Framework: <Y>
- Notable deps: <list>
- Source: <manifest path>

## 3. Entry points
| Path | Purpose |
|---|---|
| `src/main.ts` | app boot |
| `tests/*` | test suite |

## 4. Folder map
- `src/` — <purpose>; touch when <…>
- `lib/` — <purpose>; touch when <…>
- ...

## 5. Run it locally
```bash
<install>
<env-setup>
<run>
<verify>
```

## 6. Suggested first actions
1. Read: <path>
2. Try: <command>
3. Build: <small task>

## Documentation gaps (if any)
- Missing: <doc-path>

## Setup gaps (if any)
- Unclear: <step>
```

## Hard Rules

- **No implementation.** Tour only — do not edit files, do not run dev server.
- **No fabricated paths / modules / commands.** Verify every path exists before mentioning.
- **Don't regenerate existing docs.** Read what's there; flag what's missing.
- **Cap at 10-min read.** Cut depth, not breadth — the dev will drill in with `/ck:ask` and `/ck:scout`.
- **Sacrifice grammar for concision.**
- **List documentation + setup gaps at the end** when present.

## Related Skills / Agents / Commands

- `/ck:onboard` command — primary trigger (this skill activates from it)
- `/ck:scout` — when user wants to drill into specific files post-tour
- `/ck:ask` + `ask` skill — for deeper architectural Q&A after tour
- `/ck:bootstrap` — when there is NO project yet (different starting point)
- `/ck:watzup` — for returning devs who want recent-change summary
- `docs-manager` agent — when tour reveals doc gaps worth filling
