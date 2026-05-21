<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/workflows/small-review.md (MIT) -->

# Small Review Workflow (SMALL mode)

For repos: ≤20 main-lang files AND ≤30 total files AND ≤14 days (commit scope).
Main agent executes inline — no sub-agents spawned.

## S1 — Load rules
Load all 21 generic rule files from `rules/generic/`. Then load language-specific overlays from `rules/languages/<detected-lang>/` if available. Overlay replaces generic for same rule ID.

## S2 — Apply rules per file
For each file in scope:
- Skip: binary files, generated files (*.min.js, *.lock unless checking deps), files >5000 lines
- Use Grep to find patterns, Read for context
- Apply L1-L4 data flow analysis — do NOT flag without tracing source
- Map each finding to exactly one rule ID

## S3 — Cross-rule checks
After per-file scan, check globally:
- SLOPSQUATTING: verify package names in dependency files exist on npm/pypi/pkg.go.dev
- OUTDATED-DEPENDENCY: check known CVE databases for listed versions
- BROKEN-ACCESS-CONTROL: check if sensitive endpoints have consistent auth middleware
- CSRF: check if state-changing routes have CSRF token validation

## S4 — Build PASSED list
List rules that were checked and found no issues.

## S5 — Determine verdict
- Any CRITICAL finding → FAIL
- No CRITICAL, any HIGH → WARN
- No CRITICAL, no HIGH → PASS

## S6 — Render report
Follow `references/output-format.md`. Use i18n keys from loaded i18n file.

## S7 — Output & save
Print report to stdout. Write identical content to `security-reports/scan-<timestamp>.md`.

## Performance target
30-80 tool calls. ~30-50K token burn.
