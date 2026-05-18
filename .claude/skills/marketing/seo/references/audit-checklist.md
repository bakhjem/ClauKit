# SEO Audit — Canonical Checklist

Single source of truth for `/ck:seo:audit` command. Defines the audit pipeline + output template.

## Audit Process (7 phases)

### 1. Page Analysis
- Fetch URL (via `playwright_navigate`)
- Check status code, load time
- Identify HTTPS, mobile-friendliness
- Detect CDN, hosting, technology stack

### 2. On-Page SEO Check
- Title tag (50-60 chars optimal)
- Meta description (150-160 chars optimal)
- H1-H6 heading structure
- Image alt texts
- Internal/external links
- URL structure
- Open Graph tags
- Twitter cards

### 3. Technical SEO
- Core Web Vitals (estimate LCP, INP, CLS)
- Schema markup presence + validation
- Canonical tags
- robots.txt, sitemap.xml
- hreflang tags
- Mixed content issues
- Broken link detection

### 4. Content Analysis
- Content length + quality
- Keyword usage + density
- E-E-A-T signals
- FAQ sections
- Readability score
- Content freshness

### 5. Competitor Comparison (`--compare`)
Compare your page against competitor URLs across: SEO Score · Word Count · Title Length · Backlinks · Domain Authority. Output **Gap Analysis** (competitor strengths you lack, opportunities they miss, content gaps).

### 6. Historical Trend (`--trend --days=<n>`)
Track score changes · traffic estimates · ranking keywords · Core Web Vitals progress over n days (typical: 30/60/90).

### 7. Site-wide Crawl (`--crawl --limit=<n>`)
Full-site analysis: all pages audited · site architecture · internal linking · duplicate content · orphan pages · redirect chains. Default limit: 50 pages.

## Variant Flags

| Flag | Effect |
|---|---|
| `--compare <url1,url2,...>` | Enable phase 5 (competitor gap analysis) |
| `--trend --days=<n>` | Enable phase 6 (historical trend) |
| `--crawl --limit=<n>` | Enable phase 7 (site-wide crawl) |
| `--full` | All phases + all checks |
| `--mobile` | Mobile-specific audit only |
| `--technical` | Phases 1+3 only (technical deep-dive) |

## Output Template

```markdown
# SEO Audit: [URL]
Generated: [Date]

## OVERVIEW
URL · Status · Load Time · Mobile-Friendly · HTTPS · Technology · Crawl Depth

## SCORE
[XX/100] — [Grade]
Previous Score: [XX/100] ([+X/-X] from last audit)

## COMPETITOR COMPARISON (--compare)
### Score Comparison
| Metric | You | Comp1 | Comp2 |
|---|---|---|---|
| SEO Score · Word Count · Schema · Images Optimized |...|...|...|

### Gap Analysis
- **You Rank, They Don't:** [keywords]
- **They Rank, You Don't:** [URL — keyword]
- **Shared Opportunities:** [features both miss]

## HISTORICAL TREND (--trend)
| Date | Score | Change |
|---|---|---|

## CRITICAL ISSUES (Fix Immediately)
- [Issue] — [Impact]

## HIGH PRIORITY (Fix This Week)
- [Issue] — [Impact]

## MEDIUM PRIORITY (Fix This Month)
- [Issue] — [Impact]

## STRENGTHS
- [Strength]

## TECHNICAL DETAILS

### Core Web Vitals
| Metric | Value | Status |
|---|---|---|
| LCP / INP / CLS | ... | Good/Poor |

### Schema Found
- [Type]

### On-Page Elements
- Title: [XX chars] — Optimal/Short/Long
- Meta: [XX chars] — Optimal/Short/Long
- Headings: H1(1), H2(X), H3(X)
- Images: Total(X), With Alt(X), Without Alt(X)

## SITE CRAWL SUMMARY (--crawl)
- Pages Crawled: [XXX] · Issues: Critical(X) · Warnings(X) · Notices(X)
### Top Issues
1. [Issue] — [X] pages
### Site Architecture
- Max depth: [X] clicks from home · Orphan pages: [X] · Avg links/page: [X]

## ACTION PLAN
### Immediate (Today)
1. [Critical fix]
### This Week
1. [High priority fix]
### This Month
1. [Medium priority fix]

## NEXT STEPS
/ck:seo:keywords [related-keyword]
/ck:seo:schema [type]
/ck:seo:audit [competitor-url] --compare
```
