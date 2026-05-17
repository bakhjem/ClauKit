---
description: Research keywords for a topic
argument-hint: <keyword-or-topic> [--serp-features] [--gap --competitors=<url>] [--cluster] [--brief]
---

# Keyword Research: $ARGUMENTS

Activate the `seo` skill ([.claude/skills/marketing/seo/SKILL.md](.claude/skills/marketing/seo/SKILL.md)) and load `references/keyword-research.md` — single source of truth for the research pipeline, SERP-features taxonomy, and output template.

## Workflow
Follow the 7-phase pipeline in `references/keyword-research.md`:
Seed Analysis → Keyword Expansion → Keyword Data (Volume/Difficulty/CPC/Intent/Opportunity) → SERP Features (`--serp-features`) → Content Gap Analysis (`--gap`) → Keyword Clustering (`--cluster`) → Content Brief (`--brief`).

## Variant Flags (quick ref — full table in skill reference)

| Flag | Effect |
|---|---|
| `--serp-features` | SERP features analysis (snippets, PAA, etc.) |
| `--gap --competitors=<url1,url2>` | Content gap vs competitors |
| `--cluster` | Group keywords into semantic clusters |
| `--brief` | Generate ready-to-write content brief |

## Examples

```bash
/seo:keywords "project management software"
/seo:keywords "project management software" --serp-features
/seo:keywords "saas pricing" --gap --competitors=https://comp1.com,https://comp2.com
/seo:keywords "how to use ai for business" --brief
/seo:keywords "project management" --serp-features --gap --competitors=https://asana.com --cluster --brief
```
