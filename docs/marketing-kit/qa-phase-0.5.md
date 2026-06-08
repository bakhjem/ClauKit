# Phase 0.5 — Kit Manifest System QA

**Date:** 260607
**Branch:** feat/kit-manifest
**Status:** ✅ All 5 tests pass (TS3 expected-fail until Phase 1+ builds the marketing kit)

## TS1: `ck init --kit list`

```
📦 Available kits (3):

  both         v1.0.0    Combined Engineer + Marketing Kit — /ck: and /mk: namespaces
  engineer     v1.3.1    Engineer Kit — software engineering, /ck: namespace (default)
  marketing    v0.1.0    Marketing Kit + Marketing Automation — /mk: namespace, 48 skills, 10 agents, 12 commands, 5 workflows, 5 MCP wrappers, 6 automation skills
```
✅ **PASS** — All 3 kits listed with versions + descriptions

## TS2: `ck init --kit engineer` (fresh tmp dir)

13 paths copied:
- `.claude/agents/{engineering,specialists,operations,research}/`
- `.claude/commands/ck/`
- `skills/{software,global}/`
- `.claude/workflows/{primary,development-rules,orchestration-protocol,documentation-management,fix-pipeline,cro-framework}.md`

✅ **PASS**

## TS3: `ck init --kit marketing` (fresh tmp dir)

Pre-flight catches 11 missing paths (expected — Phases 1+ create them):
- `.claude/agents/marketing/`
- `.claude/commands/mk/`
- `skills/automation/`
- `.claude/workflows/{marketing,sales,crm,video,design}-workflow.md`
- `.claude/workflows/marketing-rules.md`
- `.claude/workflows/automation-rules.md`

⚠️ **EXPECTED** — Kit manifest system correctly refuses to install a kit with missing paths. Will pass once Phases 1+ are complete.

## TS4: `ck init --kit nonexistent` (negative)

```
❌ Unknown kit: 'nonexistent'
   Available kits: both, engineer, marketing
EXIT: 1
```
✅ **PASS** — Clear error message with available kits list

## TS5: `ck init --kit marketing` (in-repo, where paths don't yet exist)

Pre-flight catches missing paths — no destructive writes. Existing files (engineer kit paths) are left untouched.

✅ **PASS** — Pre-flight gate prevents accidental overwrites

## Implementation Notes

### Bugs fixed during testing

1. **`getKitPaths` accessed `kit.paths` instead of `kit.manifest.paths`** — wrapper/metadata indirection bug. Fixed by accepting either form (manifest or resolved kit).
2. **Broken symlink handling** — `copyDirectory` now catches and skips broken symlinks with a warning instead of crashing.
3. **Windows `copyFileSync` ENOENT on `\.claude` paths** — replaced with stream-based `copyFileSafe` (readFileSync + writeFileSync). The `\.` segment in source paths triggered ENOENT in Node's `copyFileSync` on Windows, even though the files were accessible via `lstatSync`/`readFileSync`.

### Modularization

`ck.js` split into 6 modules under `bin/lib/`:
- `ck.js` (119 lines) — main entry, init/update/help dispatch
- `kit-resolver.js` (125 lines) — manifest loading, kit resolution, path validation
- `file-copier.js` (108 lines) — recursive copy with symlink dereferencing
- `metadata-writer.js` (37 lines) — `.claude/metadata.json` writer
- `github-client.js` (99 lines) — `ck update` GitHub API client
- `cli-parser.js` (87 lines) — argv parsing + help text

All under 200-line limit per dev rules.
