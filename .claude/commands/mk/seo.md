---
description: SEO operations — routes through AgriciDaniel/claude-seo engine (25 sub-skills + 18 agents in parallel)
argument-hint: audit|keywords|ai|programmatic|schema <target>
---

## Pre-flight (HARD FAIL)

**If `plans/marketing-context.md` is missing, refuse to run and direct user to `/mk:plan`.**

Per .claude/workflows/marketing-rules.md, every `/mk:` command requires the marketing context hub. The only exception is `/mk:plan` itself.

## Variables

ACTION: $1 (default: audit)
REST: $2..$n (action-specific arguments)

## Workflow

Activate the `seo` skill (skills/marketing/seo/SKILL.md) — the claude-seo orchestrator. It dispatches the 24 sub-skills in parallel based on industry detection.

### Actions

- **`audit`** — Full SEO audit (technical + content + backlinks + schema). Target may be a URL, OR a live WordPress post (`wp:<id>` or a WP URL) — fetched read-only via REST then analyzed.
  - skills: `seo-audit`, `seo-technical`, `seo-content`, `seo-schema`; + `wordpress-rest` (when target is a WP post — fetch live content via REST before analysis)
  - WP flow (read-only): preflight `GET /wp-json/` → `GET /wp-json/wp/v2/posts/<id>?context=edit` (or resolve slug from URL) → normalize {title, content, excerpt, Yoast/RankMath meta} → run claude-seo analysis. No writes during audit.
- **`keywords`** — Keyword research with SERP analysis + content brief
  - skills: `seo-content-brief`, `seo-cluster`
- **`ai`** — AI-search optimization (GEO — ChatGPT, Perplexity, Claude citations)
  - skills: `seo-geo`
- **`programmatic`** — Programmatic SEO — template pages at scale
  - skills: `seo-programmatic`, `programmatic-seo`
- **`schema`** — JSON-LD schema generation + validation
  - skills: `seo-schema`

## Output

Results written to `plans/marketing/<target>/seo-<action>-report.md`

## Notes

- Concise grammar in reports. List unresolved questions at end.
- PII redaction enforced for all customer/lead data (see .claude/workflows/automation-rules.md).
- Idempotency: re-runs must not duplicate resources (emails, leads, video assets).
- WordPress audit: read-only (GET). Credentials via env only (`WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`). No writes during audit.
- Cross-references: `.claude/workflows/marketing-rules.md`, `.claude/workflows/automation-rules.md`, `skills/marketing/README.md`, `skills/integrations/wordpress-rest/SKILL.md`.

## Examples

```
audit|keywords|ai|programmatic|schema audit <example-target>
audit wp:123                            # audit a live WordPress post by id
audit https://example.com/my-article/   # audit a live WP article by URL
```
