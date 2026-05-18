---
description: Generate JSON-LD schema markup
argument-hint: <schema-type> [parameters] [--auto <url>] [--validate] [--nested]
---

# Schema Generation: $ARGUMENTS

Activate the `seo` skill ([.claude/skills/marketing/seo/SKILL.md](.claude/skills/marketing/seo/SKILL.md)) and load `references/schema-templates.md` — single source of truth for schema-type taxonomy, JSON-LD templates, implementation guide, and output template.

## Workflow
1. **Parse request** — identify schema type + parameters.
2. **Gather info** — extract from context or prompt the user (`--auto` extracts from URL).
3. **Generate JSON-LD** using canonical templates in `references/schema-templates.md`.
4. **Provide implementation** — code + where to add it (HTML `<head>` preferred).

## Variant Flags (quick ref — full taxonomy in skill reference)

| Flag | Effect |
|---|---|
| `--auto <url>` | Auto-generate schema from URL content |
| `--validate` | Validate existing schema on a URL (syntax + Rich Results eligibility) |
| `--nested` | Create connected schemas with `@graph` nesting |
| `--extract` | Extract and enhance existing schema |

## Supported Types (quick ref — full table in skill reference)

`Product` · `Pricing` · `Article` · `FAQ` · `HowTo` · `LocalBusiness` · `Organization` · `Event` · `Course` · `Review` · `Person` · `WebSite` · `WebPage` · `VideoObject` · `BreadcrumbList`

### Supported Nested Combinations
- `Organization` + `LocalBusiness` + `OpeningHoursSpecification`
- `Product` + `Offer` + `AggregateRating`
- `Article` + `Author` + `Organization` + `Publisher`
- `Event` + `Offer` + `Location` + `Organization`

## Examples

```bash
/ck:seo:schema product "My SaaS Product"
/ck:seo:schema faq
/ck:seo:schema article "Blog Post Title"
/ck:seo:schema auto https://example.com/blog/post-title
/ck:seo:schema validate --url=https://example.com
/ck:seo:schema nested organization localbusiness --city="Hanoi" --country="VN"
```
