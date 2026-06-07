---
description: Marketing plan — bootstrap or update plans/marketing-context.md (ICP, positioning, voice)
argument-hint: [fast|full]
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: fast)
REST: $2..$n (action-specific arguments)

## Workflow

Activate the `product-marketing` skill (skills/marketing/product-marketing/SKILL.md). It is the hub for marketing context.

### Actions

- **`fast`** — Skip interview, scaffold context from existing docs (README, docs/)
  - skills: `product-marketing`
- **`full`** — Full interview mode (default) — 8 questions, one at a time
  - skills: `product-marketing`, `customer-research`

## Output

Results written to `plans/marketing-context.md`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `skills/marketing/README.md`.

## Examples

```
[fast|full] fast <example-target>
```
