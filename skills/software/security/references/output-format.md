<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/references/output-format.md (MIT) -->

# Security Scan Report — Output Format

Report path: `security-reports/scan-<timestamp>.md` (was `vbsec-reports/` in source)

## Structure (10 sections)
1. Header block (scope, files, primary lang, mode, date, lang)
2. VERDICT line + 1-line description
3. CRITICAL section (overview table + verbose blocks)
4. HIGH section (overview table + medium blocks)
5. MEDIUM section (compact table)
6. LOW section (compact table)
7. PASSED CHECKS list
8. Next steps (1-2 lines)
9. Save notification + gitignore warning (if needed)
10. JSON summary (canonical EN always)

## Verbosity by severity
- CRITICAL: overview table + full block (description, why dangerous, attack scenario, code before/after, references)
- HIGH: overview table + medium block (description, impact, fix code, references)
- MEDIUM/LOW: compact table only (file:line, rule, description)

## Rules
- All user-facing text uses i18n keys (load from `references/i18n/<lang>.md`) — never hardcode
- Code snippets always in English regardless of lang
- JSON summary always canonical English
- Each finding maps to exactly one rule_id
- Omit sections with no findings
- sum(critical+high+medium+low) == total_findings
- Mandatory footer disclaimer: "This report is a reference — not a substitute for professional security audit."
