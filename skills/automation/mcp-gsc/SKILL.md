---
name: mcp-gsc
description: Google Search Console MCP wrapper. Activate for SEO analytics — search queries, indexing status, sitemaps, keyword rankings. Routes to MCP tools if available, else manual CSV export fallback.
allowed-tools: Read, Bash, Glob
---

# MCP GSC Wrapper

> Google Search Console integration. Bring your own MCP server — this skill documents the tools + manual fallback.

---

## MCP Server

**Server command:** `npx -y @modelcontextprotocol/server-google-search-console` (or community equivalent)
**Required env:** `GSC_SITE_URL` (e.g., `https://example.com`), `GOOGLE_APPLICATION_CREDENTIALS`
**Setup:** [GSC API quickstart](https://developers.google.com/webmaster-tools/v1/quickstart)

## Tools exposed (when MCP configured)

| Tool | Purpose |
|---|---|
| `mcp__gsc__searchAnalytics` | Search queries, clicks, impressions, CTR, position |
| `mcp__gsc__listSitemaps` | All sitemaps + status |
| `mcp__gsc__submitSitemap` | Submit new sitemap |
| `mcp__gsc__inspectUrl` | Indexing status for a specific URL |
| `mcp__gsc__listSites` | Verified sites in GSC |
| `mcp__gsc__getCoverage` | Index coverage issues |

## Common use patterns

### Top search queries (last 28 days)
```
Tool: mcp__gsc__searchAnalytics
Args: { siteUrl: "https://example.com", startDate: "2026-05-09", endDate: "2026-06-06", dimensions: ["query"], rowLimit: 50 }
```

### Pages with low CTR
```
Tool: mcp__gsc__searchAnalytics
Args: { siteUrl, dimensions: ["page"], metrics: ["clicks", "impressions", "ctr", "position"], filter: "ctr < 0.02 AND impressions > 1000" }
```

### Indexing check
```
Tool: mcp__gsc__inspectUrl
Args: { siteUrl, inspectionUrl: "https://example.com/page" }
```

## Error handling

| Error | Cause | Fix |
|---|---|---|
| `403 PERMISSION_DENIED` | Service account not added to GSC | Add in GSC → Settings → Users |
| `404 NOT_FOUND` | Wrong `GSC_SITE_URL` (must include protocol, exact match) | Verify site URL prefix |
| `400 INVALID_ARGUMENT` | Date range too long (>16 months) | Reduce to 16 months or less |

## Manual Fallback (no MCP server)

If `mcp__gsc__*` tools not available:

1. **Ask user to export:** GSC → Performance → select date range → Export → CSV
2. **Save CSV** to `plans/marketing/<campaign>/gsc-export.csv`
3. **Read CSV** via Read tool
4. **Continue with SEO analysis** — same insights, no MCP needed

**Common exports:**
- Queries (search terms)
- Pages (URLs ranking)
- Countries (geo breakdown)
- Devices (desktop/mobile/tablet)
- Search appearance (rich results, AMP)

---

## Cross-references

- `skills/marketing/seo-technical/SKILL.md` — technical SEO (uses GSC indexing data)
- `skills/marketing/seo-content/SKILL.md` — content SEO (uses GSC query data)
- `skills/marketing/seo-schema/SKILL.md` — schema (uses GSC rich results)
