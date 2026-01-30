---
description: Perform comprehensive SEO audit of a URL
argument-hint: <url-to-audit>
---

# SEO Audit: $ARGUMENTS

Use the seo-specialist agent to perform a comprehensive SEO audit.

## Workflow

1. **Fetch the page** using playwright_navigate to get HTML content
2. **Parse and analyze** the page for SEO issues
3. **Generate audit report** with score and recommendations

## Audit Process

### 1. Page Analysis
- Fetch URL: $ARGUMENTS
- Check status code, load time
- Identify HTTPS, mobile-friendliness

### 2. On-Page SEO Check
- Title tag (50-60 chars optimal)
- Meta description (150-160 chars optimal)
- H1-H6 heading structure
- Image alt texts
- Internal/external links
- URL structure

### 3. Technical SEO
- Core Web Vitals (estimate LCP, INP, CLS)
- Schema markup presence
- Canonical tags
- robots.txt, sitemap

### 4. Content Analysis
- Content length and quality
- Keyword usage and density
- E-E-A-T signals
- FAQ sections

### 5. Generate Report
- Calculate SEO score (0-100)
- Categorize issues: Critical, High, Medium
- List strengths
- Provide action plan

## Output Format

```
# SEO Audit: [URL]
Generated: [Date]

## OVERVIEW
URL: [url]
Status: [200 OK]
Load Time: [x.xs]
Mobile-Friendly: Yes/No
HTTPS: Yes/No

## SCORE
[XX/100] - [Grade]

## CRITICAL ISSUES (Fix Immediately)
- Issue 1
- Issue 2

## HIGH PRIORITY (Fix This Week)
- Issue 1
- Issue 2

## MEDIUM PRIORITY (Fix This Month)
- Issue 1
- Issue 2

## STRENGTHS
- Strength 1
- Strength 2

## ACTION PLAN
1. [Critical fix]
2. [High priority fix]
...

## NEXT STEPS
/seo keywords [related-keyword]
/seo schema [type]
```

## Examples

**Basic audit:**
```
/seo audit https://example.com/pricing
```

**Full audit with screenshots:**
```
/seo audit https://example.com/blog/post-1
```
