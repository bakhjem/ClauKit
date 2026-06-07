---
name: mcp-reviewweb
description: ReviewWeb MCP wrapper. Activate for reputation audits, review monitoring, sentiment analysis. Routes to MCP tools if available, else asks user to paste reviews for analysis.
allowed-tools: Read, Bash, Write
---

# MCP ReviewWeb Wrapper

> ReviewWeb reputation monitoring integration. Bring your own MCP server.

---

## MCP Server

**Server command:** `npx -y @modelcontextprotocol/server-reviewweb` (or community equivalent)
**Required env:** `REVIEWWEB_API_KEY`
**Setup:** [ReviewWeb API](https://www.reviewweb.com/api) (verify domain, generate key)

## Tools exposed (when MCP configured)

| Tool | Purpose |
|---|---|
| `mcp__reviewweb__listReviews` | Reviews across platforms (Google, Yelp, Trustpilot, etc.) |
| `mcp__reviewweb__getReviewById` | Single review detail |
| `mcp__reviewweb__analyzeSentiment` | Sentiment score (positive/neutral/negative) |
| `mcp__reviewweb__getTrends` | Sentiment trend over time |
| `mcp__reviewweb__getCompetitorReviews` | Competitor review data |
| `mcp__reviewweb__respondToReview` | Post public response |

## Common use patterns

### Recent negative reviews
```
Tool: mcp__reviewweb__listReviews
Args: { sentiment: "negative", dateRange: "30days", platforms: ["google", "yelp"], limit: 20 }
```

### Sentiment trend
```
Tool: mcp__reviewweb__getTrends
Args: { period: "monthly", platforms: ["google"] }
```

### Competitor comparison
```
Tool: mcp__reviewweb__getCompetitorReviews
Args: { competitors: ["competitor-a.com", "competitor-b.com"], dateRange: "90days" }
```

## Error handling

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Invalid `REVIEWWEB_API_KEY` | Regenerate in ReviewWeb dashboard |
| `403 Forbidden` | Domain not verified for review monitoring | Add + verify domain in ReviewWeb |
| `429 Rate Limited` | Quota exceeded | Reduce request frequency, upgrade plan |

## Manual Fallback (no MCP server)

If `mcp__reviewweb__*` tools not available:

1. **Ask user to paste reviews** — collect from Google Business, Yelp, Trustpilot, G2, etc.
2. **Save to file:** `plans/marketing/<campaign>/reviews-paste.md`
3. **Analyze manually:**
   - Sentiment scoring (positive/neutral/negative keywords)
   - Common themes (recurring complaints, praise)
   - Urgency (mentions of churn, support tickets, refunds)
4. **Generate response templates** for negative reviews

**Review analysis framework:**
- **Sentiment:** 👍 positive / 😐 neutral / 👎 negative
- **Theme:** product / support / pricing / bugs / UX
- **Urgency:** low / medium / high (churn risk, public complaint)
- **Response template:** acknowledgment + resolution + escalation

---

## Cross-references

- `skills/marketing/customer-research/SKILL.md` — customer research methodology
- `skills/marketing/cro/SKILL.md` — review-driven conversion optimization
- `.claude/workflows/automation-rules.md` — privacy (PII redaction in pasted reviews)
