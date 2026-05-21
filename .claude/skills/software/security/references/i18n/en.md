<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/references/i18n/en.md (MIT) -->

# i18n — English (en)

## Report Header

| Key | Text |
|---|---|
| header.title | Security Scan Report |
| header.scope | Scope |
| header.files_scanned | Files scanned |
| header.primary_lang | Primary language |
| header.mode | Scan mode |
| header.date | Date |
| header.output_lang | Output language |

## Verdict

| Key | Text |
|---|---|
| verdict.fail | FAIL |
| verdict.warn | WARN |
| verdict.pass | PASS |
| verdict.fail_desc | Critical vulnerabilities found — immediate action required. |
| verdict.warn_desc | High-severity issues found — review and remediate before release. |
| verdict.pass_desc | No critical or high-severity issues found. |

## Section Titles

| Key | Text |
|---|---|
| section.critical | CRITICAL Findings |
| section.high | HIGH Findings |
| section.medium | MEDIUM Findings |
| section.low | LOW Findings |
| section.passed | Passed Checks |
| section.next_steps | Next Steps |

## Finding Fields

| Key | Text |
|---|---|
| finding.file | File |
| finding.line | Line |
| finding.rule | Rule |
| finding.severity | Severity |
| finding.description | Description |
| finding.why_dangerous | Why it's dangerous |
| finding.attack_scenario | Attack scenario |
| finding.code_before | Vulnerable code |
| finding.code_after | Fixed code |
| finding.impact | Impact |
| finding.fix | Recommended fix |
| finding.references | References |

## Severity Labels

| Key | Text |
|---|---|
| severity.critical | CRITICAL |
| severity.high | HIGH |
| severity.medium | MEDIUM |
| severity.low | LOW |

## Messages

| Key | Text |
|---|---|
| msg.no_findings_critical | No critical findings. |
| msg.no_findings_high | No high-severity findings. |
| msg.report_saved | Report saved to |
| msg.gitignore_warning | Warning: security-reports/ is not in .gitignore. Consider adding it to avoid committing scan reports. |
| msg.disclaimer | This report is a reference — not a substitute for professional security audit. |
| msg.chunk_failed | Chunk scan failed — results may be incomplete for |
| msg.scan_complete | Scan complete. |

## Mode Labels

| Key | Text |
|---|---|
| mode.small | SMALL (inline scan) |
| mode.large | LARGE (chunked + sub-agents) |
