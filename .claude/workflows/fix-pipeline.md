# Fix Pipeline — Canonical Workflow

Single source of truth for the `/ck:fix` family of commands. Each `/ck:fix*` command is a **variant** that selects which input source to use and which agents to invoke for diagnosis. The implementation→test→review→report cycle is shared across all variants.

## Canonical Pipeline (7 stages)

```
[1] Input intake       → variant-specific source
[2] Multimodal extract → ai-multimodal skill if screenshots/videos provided
[3] Diagnose           → variant-specific specialist agent(s)
[4] Plan (optional)    → planner subagent for complex fixes
[5] Implement          → main agent applies fix
[6] Verify             → tester subagent runs tests
[7] Review + Report    → code-reviewer + summary back to user
```

### Stage details

**[1] Input intake** — read the issue source. Variant-specific:
- `/ck:fix` → router (auto-detect complexity, route to `:fast` or `:hard`)
- `/ck:fix --quick` → user-provided issue text
- `/ck:fix --review` → user-provided issue text (complex)
- `/ck:fix:logs` → `./logs.txt` (reproduce + pipe if missing)
- `/ck:fix:ci` → GitHub Actions URL (via `gh` command)
- `/ck:fix:test` → run test suite first, then diagnose failures
- `/ck:fix:types` → run `tsc` / `bun typecheck` / `npx tsc` first
- `/ck:fix:ui` → user-provided UI issue + design guidelines

**[2] Multimodal extract** — if user provided screenshots/videos → `ai-multimodal` skill describes in detail so root causes are predictable.

**[3] Diagnose** — variant-specific specialist:
| Variant | Diagnostic agent |
|---|---|
| `:fast` / `:hard` / `:logs` / `:ci` | `debugger` subagent |
| `:hard` (added) | `researcher` subagent (external research) |
| `:test` | `tester` first → `debugger` for failures |
| `:types` | direct: run typecheck → fix loop (no agent) |
| `:ui` | `ui-ux-designer` subagent + `chrome-devtools` skill |
| `:logs` / `:ci` (added) | `scout` subagent (locate issues in codebase) |

**[4] Plan (optional)** — `planner` subagent creates implementation plan. Triggered for:
- `:hard` (always)
- `:logs` / `:ci` / `:test` (after diagnostic reports)
- `:fast` / `:types` / `:ui` (skip — go straight to implement)

**[5] Implement** — main agent applies the fix based on diagnostic reports + plan.
- `:ui` variant uses `ui-ux-designer` for implementation
- `:hard` may use additional skills (`sequential-thinking`, `problem-solving`)

**[6] Verify** — `tester` subagent runs tests + compile.
- `:types` → loop tsc until zero errors (do NOT use `any` to pass)
- `:ui` → screenshot capture + `ai-multimodal` analysis to verify design match
- All others → standard test run

**Failure handling:** if tests fail → loop back to stage [3] (diagnose) with new evidence.

**[7] Review + Report** — `code-reviewer` subagent for code quality check; if critical issues found → loop back to [5]. When clean, summarize to user.

### Post-implementation (variant-specific, optional)

For variants `:hard` and `:ui`:
- **Project mgmt + docs update:** if user approves → `project-manager` + `docs-manager` subagents in parallel update `./docs/*` + `./docs/project-roadmap.md` + plan task status.
- **Commit:** ask user about commit/push → `git-manager` subagent.

## Companion Skills (auto-activate)

- `problem-solving` — root-cause synthesis (all variants)
- `sequential-thinking` — break complex problems into steps (`:hard`)
- `debugging` — 4-technique framework activated by `debugger` agent (all variants)
- `ai-multimodal` — screenshot/video analysis (any variant with visual input)
- `chrome-devtools` — UI verification (`:ui`)

## Shared Rules

- **Auto-activate skills** from the catalog as needed during the process.
- **No fake test data** — tests must be real, cover all cases. Do not ignore failures.
- **Repeat until clean** — diagnose → fix → test → review loop until all tests pass.
- **Final summary** — explain changes briefly, guide getting-started, suggest next steps.
- **Concise grammar** in reports. List unresolved questions at end.

## Variant Selection Matrix

| Variant | Input | Has planner? | Has researcher? | Has reviewer? | Has plan/docs update? |
|---|---|:---:|:---:|:---:|:---:|
| `/ck:fix` | router | – | – | – | – |
| `/ck:fix --quick` | text | – | – | – | – |
| `/ck:fix --review` | text | ✓ | ✓ | ✓ | ✓ |
| `/ck:fix:logs` | `logs.txt` | ✓ | – | ✓ | – |
| `/ck:fix:ci` | GH Actions URL | ✓ | – | ✓ | – |
| `/ck:fix:test` | test suite | ✓ | – | ✓ | – |
| `/ck:fix:types` | `tsc` errors | – | – | – | – |
| `/ck:fix:ui` | UI + design guide | – | – | – | ✓ |
