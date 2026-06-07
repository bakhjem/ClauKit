---
description: Content creation — blog posts, social, video scripts, copy
argument-hint: blog|social|video|copy <topic>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: blog)
REST: $2..$n (action-specific arguments)

## Workflow

Activate content-strategist agent + the action-specific skills.

### Actions

- **`blog`** — SEO-optimized long-form blog post (E-E-A-T compliant)
  - skills: `copywriting`, `seo-content`, `copy-editing`
- **`social`** — Multi-platform social content (Twitter, LinkedIn, Instagram)
  - skills: `social-content`, `copywriting`
- **`video`** — Video script (hook + body + CTA) for short-form or long-form
  - skills: `copywriting`, `video-producer`
- **`copy`** — Conversion copy — landing pages, ads, CTAs
  - skills: `copywriting`, `cro`

## Output

Results written to `plans/marketing/<campaign>/content/<asset>.<ext>`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `skills/marketing/README.md`.

## Examples

```
blog|social|video|copy blog <example-target>
```
