---
description: Documentation operations dispatcher (init · update · summarize)
argument-hint: init | update [additional-requests] | summarize [focused-topics] [should-scan-codebase]
---

## Variables

ACTION: $1 (one of `init`, `update`, `summarize`)
ARG1: $2
ARG2: $3

## Activation

Use `docs-manager` agent for all documentation work. Treat `docs/` as the single source of truth.

## Workflow

Dispatch to the matching operation based on {ACTION}.

### `init` — create initial documentation (⚡⚡⚡⚡)
- Mission: analyze the codebase and **create** initial documentation from scratch.
- Files to produce:
  - `docs/project-overview-pdr.md` — project overview + PDR (Product Development Requirements)
  - `docs/codebase-summary.md` — codebase summary
  - `docs/code-standards.md` — codebase structure + code standards
  - `docs/system-architecture.md` — system architecture
  - `README.md` — initial documentation (keep under 300 lines)
- Distinct from siblings — produces **new** docs (no prior docs assumed).

### `update` — update existing documentation (⚡⚡⚡)
- ADDITIONAL_REQUESTS: {ARG1}…{ARGN} (= `$ARGUMENTS` minus the action) — optional extra instructions
- Mission: analyze the codebase and **update** existing documentation.
- Files to refresh:
  - `README.md` (keep under 300 lines)
  - `docs/project-overview-pdr.md` — project overview + PDR
  - `docs/codebase-summary.md` — codebase summary
  - `docs/code-standards.md` — codebase structure + code standards
  - `docs/system-architecture.md` — system architecture
  - `docs/project-roadmap.md` — project roadmap
  - `docs/deployment-guide.md` *[optional]* — deployment guide
  - `docs/design-guidelines.md` *[optional]* — design guidelines
- Distinct from siblings — **updates** existing docs (does not create from scratch, does not summarize-only).

### `summarize` — summary report only (⚡)
- FOCUSED_TOPICS: {ARG1} (default: `all`)
- SHOULD_SCAN_CODEBASE: {ARG2} (`Boolean`, default: `false`)
- Mission: analyze the codebase based on `docs/codebase-summary.md` and **respond with a summary report**.
- Distinct from siblings — **read-only report**, does not write/update doc files unless user explicitly requests.
- Do not scan the entire codebase unless `SHOULD_SCAN_CODEBASE=true` or the user explicitly requests it.

## Notes
- If {ACTION} is missing or not one of the three above, print usage and exit.
- Use `docs/` directory as the single source of truth for documentation.
- Concise grammar in reports. List unresolved questions at end.
- **IMPORTANT**: For `init` and `update`, **do not** start implementing code — docs only.

## Examples
- `/ck:docs init` — bootstrap initial documentation for the project.
- `/ck:docs update` — refresh all docs to match current codebase.
- `/ck:docs update "focus on the new auth module"` — targeted update.
- `/ck:docs summarize` — quick summary report from existing docs.
- `/ck:docs summarize "auth, payments" true` — focused summary with codebase scan.
