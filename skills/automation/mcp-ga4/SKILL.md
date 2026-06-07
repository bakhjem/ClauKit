---
name: mcp-ga4
description: Google Analytics 4 MCP wrapper. Activate when user needs traffic reports, real-time data, attribution, or any GA4 metrics. Routes to MCP tools if available, else falls back to manual CSV export.
allowed-tools: Read, Bash, Glob
---

# MCP GA4 Wrapper

> Google Analytics 4 integration. Bring your own MCP server — this skill documents the tools + manual fallback.

---

## MCP Server

**Server command:** `npx -y @modelcontextprotocol/server-google-analytics`
**Required env:** `GA4_PROPERTY_ID`, `GOOGLE_APPLICATION_CREDENTIALS` (path to service account JSON)
**Setup:** [Google Analytics Data API quickstart](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries)

## Tools exposed (when MCP configured)

| Tool | Purpose |
|---|---|
| `mcp__ga4__runReport` | Run custom GA4 report (dimensions, metrics, date range) |
| `mcp__ga4__getRealtimeData` | Real-time active users + current events |
| `mcp__ga4__getTrafficSources` | Channel/source/medium breakdown |
| `mcp__ga4__getPageMetrics` | Per-page views, bounce, time-on-page |
| `mcp__ga4__getConversions` | Conversion events + goal completions |
| `mcp__ga4__getAudienceData` | Demographics, geo, tech |

## Common use patterns

### Traffic overview (last 30 days)
```
Tool: mcp__ga4__runReport
Args: { dimensions: ["date"], metrics: ["sessions", "users", "pageviews"], dateRange: "30daysAgo" }
```

### Top pages by conversions
```
Tool: mcp__ga4__runReport
Args: { dimensions: ["pagePath"], metrics: ["conversions", "sessions"], dateRange: "30daysAgo", orderBy: "conversions DESC", limit: 20 }
```

### Real-time active users
```
Tool: mcp__ga4__getRealtimeData
```

## Error handling

| Error | Cause | Fix |
|---|---|---|
| `403 PERMISSION_DENIED` | Service account lacks access | Add service account to GA4 property as Viewer |
| `404 NOT_FOUND` | Wrong `GA4_PROPERTY_ID` | Verify property ID in GA4 Admin |
| `429 RATE_LIMITED` | Quota exceeded | Wait 60s, retry, or reduce metric count |

## Manual Fallback (no MCP server)

If `mcp__ga4__*` tools not available:

1. **Ask user to export:** GA4 → Reports → select report → Export (top right) → CSV
2. **Save CSV** to `plans/marketing/<campaign>/ga4-export.csv`
3. **Read CSV** via Read tool
4. **Continue with analysis** — same insights, no MCP needed

**Common exports:**
- Acquisition report (channels × sessions)
- Engagement report (pages × views)
- Conversions report (events × completions)
- Real-time (snapshot)

---

## Cross-references

- `skills/automation/marketing-orchestrator/SKILL.md` — multi-MCP coordination
- `.claude/workflows/automation-rules.md` — MCP usage policy
- `skills/marketing/analytics/SKILL.md` — analytics methodology
