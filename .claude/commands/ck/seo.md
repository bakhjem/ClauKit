---
description: SEO operations dispatcher (flags -audit -keywords -schema)
argument-hint: -audit <url> [opts] | -keywords <topic> [opts] | -schema <type> [opts]
---

## Variables

FLAG: $1 (one of `-audit`, `-keywords`, `-schema`)
REST: $2..$n (action-specific arguments/options)

## Workflow

Activate the `seo` skill ([.claude/skills/marketing/seo/SKILL.md](.claude/skills/marketing/seo/SKILL.md)) and dispatch to the matching operation based on {FLAG}. Each operation loads its own reference file as single source of truth.

### `-audit` — comprehensive SEO audit of a URL

**Input:** `<url-to-audit> [--compare <competitors>] [--trend --days=<n>] [--crawl --limit=<n>] [--full] [--mobile] [--technical]`

Load `references/audit-checklist.md` — single source of truth for the audit pipeline, variant flags, and output template.

1. **Fetch** target page via `playwright_navigate`.
2. **Analyze** following the 7-phase pipeline in `references/audit-checklist.md`:
   Page Analysis → On-Page SEO → Technical SEO → Content Analysis → Competitor Comparison (`--compare`) → Historical Trend (`--trend`) → Site-wide Crawl (`--crawl`).
3. **Generate report** using the canonical output template (from same reference).

| Option | Effect |
|---|---|
| `--compare <url1,url2>` | Competitor gap analysis |
| `--trend --days=<n>` | Historical trend (30/60/90 days) |
| `--crawl --limit=<n>` | Full site crawl (default 50 pages) |
| `--full` | All phases + all checks |
| `--mobile` | Mobile-specific audit |
| `--technical` | Technical SEO deep-dive only |

### `-keywords` — keyword research for a topic

**Input:** `<keyword-or-topic> [--serp-features] [--gap --competitors=<url>] [--cluster] [--brief]`

Load `references/keyword-research.md` — single source of truth for the research pipeline, SERP-features taxonomy, and output template.

Follow the 7-phase pipeline in `references/keyword-research.md`:
Seed Analysis → Keyword Expansion → Keyword Data (Volume/Difficulty/CPC/Intent/Opportunity) → SERP Features (`--serp-features`) → Content Gap Analysis (`--gap`) → Keyword Clustering (`--cluster`) → Content Brief (`--brief`).

| Option | Effect |
|---|---|
| `--serp-features` | SERP features analysis (snippets, PAA, etc.) |
| `--gap --competitors=<url1,url2>` | Content gap vs competitors |
| `--cluster` | Group keywords into semantic clusters |
| `--brief` | Generate ready-to-write content brief |

### `-schema` — generate JSON-LD schema markup

**Input:** `<schema-type> [parameters] [--auto <url>] [--validate] [--nested] [--extract]`

Load `references/schema-templates.md` — single source of truth for schema-type taxonomy, JSON-LD templates, implementation guide, and output template.

1. **Parse request** — identify schema type + parameters.
2. **Gather info** — extract from context or prompt the user (`--auto` extracts from URL).
3. **Generate JSON-LD** using canonical templates in `references/schema-templates.md`.
4. **Provide implementation** — code + where to add it (HTML `<head>` preferred).

| Option | Effect |
|---|---|
| `--auto <url>` | Auto-generate schema from URL content |
| `--validate` | Validate existing schema on a URL (syntax + Rich Results eligibility) |
| `--nested` | Create connected schemas with `@graph` nesting |
| `--extract` | Extract and enhance existing schema |

**Supported types:** `Product` · `Pricing` · `Article` · `FAQ` · `HowTo` · `LocalBusiness` · `Organization` · `Event` · `Course` · `Review` · `Person` · `WebSite` · `WebPage` · `VideoObject` · `BreadcrumbList`

**Supported nested combinations:**
- `Organization` + `LocalBusiness` + `OpeningHoursSpecification`
- `Product` + `Offer` + `AggregateRating`
- `Article` + `Author` + `Organization` + `Publisher`
- `Event` + `Offer` + `Location` + `Organization`

## Notes
- If {FLAG} is missing or not one of the three above, print usage and exit.
- Concise grammar in reports. List unresolved questions at end.

## Examples

```bash
# Audit
/ck:seo -audit https://example.com/pricing
/ck:seo -audit https://example.com/pricing --compare=https://comp1.com,https://comp2.com
/ck:seo -audit https://example.com --crawl --limit=100
/ck:seo -audit https://example.com --full --compare=https://comp1.com --trend --days=30

# Keywords
/ck:seo -keywords "project management software"
/ck:seo -keywords "project management software" --serp-features
/ck:seo -keywords "saas pricing" --gap --competitors=https://comp1.com,https://comp2.com
/ck:seo -keywords "how to use ai for business" --brief
/ck:seo -keywords "project management" --serp-features --gap --competitors=https://asana.com --cluster --brief

# Schema
/ck:seo -schema product "My SaaS Product"
/ck:seo -schema faq
/ck:seo -schema article "Blog Post Title"
/ck:seo -schema auto https://example.com/blog/post-title
/ck:seo -schema validate --url=https://example.com
/ck:seo -schema nested organization localbusiness --city="Hanoi" --country="VN"
```
