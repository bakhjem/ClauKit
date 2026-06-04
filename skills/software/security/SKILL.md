---
name: security
description: Complete security suite — expert mindset + active code scanner. Covers OWASP 2025, supply chain, L1-L4 data flow analysis, 21 vulnerability rules (Go/PHP/Python/TS language-specific overrides), SMALL/LARGE scan modes, bilingual output (vi/en). Use when scanning code for security vulnerabilities, doing security audits, or applying security mindset. Triggers on "scan security", "kiểm tra bảo mật", "security audit", "review security".
allowed-tools: Read, Glob, Grep, Bash
---

# Security — Complete Suite

> Think like an attacker. Scan like a machine. Defend like an expert.

Two complementary layers:
- **Strategic layer** → `references/mindset.md`: OWASP 2025, supply chain, threat modeling, risk prioritization, cloud security
- **Tactical layer** → Active scanner: 21 rules, L1-L4 data flow, SMALL/LARGE mode, language-specific overrides

## Quick Reference

| Use case | Action |
|---|---|
| Security mindset / threat modeling | Load `references/mindset.md` |
| Scan entire repo | `/ck:fix` with security context OR activate this skill + run scanner workflow below |
| OWASP checklist review | Load `references/checklists.md` |
| Understand data flow analysis | Load `references/data-flow-classification.md` |

## Invocation (Scanner)

| Scope | Command |
|---|---|
| Entire repo (default) | `/security` or activate skill, run workflow |
| Uncommitted changes | Add `uncommitted` or `diff` arg |
| Staged files | Add `staged` arg |
| Recent commits | Add `commit within Xdays` arg |
| Specific commit | Add `commit id <sha>` arg |
| Pull request | Add `pr id <number>` arg |

**Output language:** append `lang=en` or `--en` (default: `vi`)

## Core Principle: Reasoning-First (NOT pattern-match)

Before flagging any issue, classify data sources L1–L4 — see `references/data-flow-classification.md`.

| Level | Source | Trust |
|---|---|---|
| L1 | User input (req.body, $_GET, params…) | NEVER trust |
| L2 | Database / persistent storage | Semi-trust |
| L3 | Internal code / hardcoded config | Trust |
| L4 | System / env vars / framework constants | Trust |

**Only flag when: L1 data → dangerous sink + no sanitization.**

## Scanner Workflow

### Step 0 — Parse args & gather files
Run bash ONCE to detect scope, lang, file list, routing decision. Save to `security-reports/scan-<timestamp>.md`.

### Step 1 — Load i18n
- `lang=vi` → `references/i18n/vi.md`
- `lang=en` → `references/i18n/en.md`

### Step 2 — Detect primary language
Read `references/language-detection.md`. Language ≥30% of files = primary. Load `rules/languages/<lang>/` overlay if available.

### Step 3 — Route by size

| Condition | Threshold | Mode |
|---|---|---|
| Main-lang files | ≤20 | SMALL |
| Main-lang files | >20 | LARGE |
| Total files | ≤30 | SMALL |
| Total files | >30 | LARGE |
| Commit timespan | ≤14 days | SMALL |
| Commit timespan | >14 days | LARGE |

ANY LARGE condition → use LARGE mode. Read matching workflow: `workflows/small-review.md` or `workflows/large-review.md`.

### Step 4 — Apply 21 rules

| # | ID | Severity |
|---|---|---|
| 1 | HARDCODED-SECRET | CRITICAL |
| 2 | SQL-INJECTION | CRITICAL |
| 3 | XSS | HIGH |
| 4 | IDOR | HIGH |
| 5 | SLOPSQUATTING | CRITICAL |
| 6 | BRUTE-FORCE | HIGH |
| 7 | MASS-ASSIGNMENT | CRITICAL |
| 8 | INSECURE-DESERIALIZATION | CRITICAL |
| 9 | SSRF | HIGH |
| 10 | PATH-TRAVERSAL | HIGH |
| 11 | CSRF | HIGH |
| 12 | BROKEN-ACCESS-CONTROL | CRITICAL |
| 13 | WEAK-PASSWORD-HASHING | CRITICAL |
| 14 | JWT-NONE-ALGORITHM | CRITICAL |
| 15 | CORS-MISCONFIG | HIGH |
| 16 | UNRESTRICTED-FILE-UPLOAD | CRITICAL |
| 17 | VERBOSE-ERROR-DEBUG-MODE | HIGH |
| 18 | MISSING-RATE-LIMIT | HIGH |
| 19 | RACE-CONDITION | HIGH |
| 20 | OUTDATED-DEPENDENCY | HIGH |
| 21 | COMMAND-INJECTION | CRITICAL |

For each rule: Read rule file → understand intent → apply with L1-L4 analysis → language overlay overrides generic if same ID.

### Step 5 — Generate report
Follow `references/output-format.md`. Verdict: CRITICAL findings = FAIL, HIGH only = WARN, else PASS.

## References (lazy load)
- `references/mindset.md` — strategic layer: OWASP 2025, supply chain, cloud, risk scoring
- `references/data-flow-classification.md` — L1-L4 trust classification + worked examples
- `references/checklists.md` — OWASP audit checklists
- `references/output-format.md` — report template spec
- `references/language-detection.md` — primary language detection algorithm
- `references/chunking-strategy.md` — LARGE mode file chunking
- `references/sub-agent-prompts.md` — LARGE mode sub-agent instructions
- `references/i18n/vi.md` + `references/i18n/en.md` — localization strings

## Guardrails
- License first: check LICENSE before copying any external code
- Provenance: ported files get `Adapted from <url>@<sha>:<path> (<license>)` header
- No drive-by deps: only add deps the ported code actually needs
- Trust local conventions over source style
- Reports use `security-reports/scan-<timestamp>.md` (not `vbsec-reports/`)
