---
description: Perform comprehensive SEO audit of a URL
argument-hint: <url-to-audit> [--compare <competitors>] [--trend --days=<n>] [--crawl --limit=<n>]
---

# SEO Audit: $ARGUMENTS

Activate the `seo` skill ([.claude/skills/marketing/seo/SKILL.md](.claude/skills/marketing/seo/SKILL.md)) and load `references/audit-checklist.md` — single source of truth for the audit pipeline, variant flags, and output template.

## Workflow
1. **Fetch** target page via `playwright_navigate`.
2. **Analyze** following the 7-phase pipeline in `references/audit-checklist.md`:
   Page Analysis → On-Page SEO → Technical SEO → Content Analysis → Competitor Comparison (`--compare`) → Historical Trend (`--trend`) → Site-wide Crawl (`--crawl`).
3. **Generate report** using the canonical output template (from same reference).

## Variant Flags (quick ref — full table in skill reference)

| Flag | Effect |
|---|---|
| `--compare <url1,url2>` | Competitor gap analysis |
| `--trend --days=<n>` | Historical trend (30/60/90 days) |
| `--crawl --limit=<n>` | Full site crawl (default 50 pages) |
| `--full` | All phases + all checks |
| `--mobile` | Mobile-specific audit |
| `--technical` | Technical SEO deep-dive only |

## Examples

```bash
/seo:audit https://example.com/pricing
/seo:audit https://example.com/pricing --compare=https://comp1.com,https://comp2.com
/seo:audit https://example.com --crawl --limit=100
/seo:audit https://example.com --full --compare=https://comp1.com --trend --days=30
```
