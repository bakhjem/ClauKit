---
name: mcp-sendgrid
description: SendGrid MCP wrapper. Activate for transactional email, marketing campaigns, deliverability checks, or list management. Routes to MCP tools if available, else generates email templates for manual send.
allowed-tools: Read, Bash, Write
---

# MCP SendGrid Wrapper

> SendGrid email API integration. Bring your own MCP server — this skill documents the tools + manual fallback.

---

## MCP Server

**Server command:** `npx -y @modelcontextprotocol/server-sendgrid` (or community equivalent)
**Required env:** `SENDGRID_API_KEY`, optional `SENDGRID_FROM_EMAIL` (default sender)
**Setup:** [SendGrid API keys](https://app.sendgrid.com/settings/api_keys)

## Tools exposed (when MCP configured)

| Tool | Purpose |
|---|---|
| `mcp__sendgrid__sendEmail` | Send transactional email (to, subject, html, attachments) |
| `mcp__sendgrid__sendBulkEmail` | Send to list of recipients (personalization supported) |
| `mcp__sendgrid__createTemplate` | Create reusable email template |
| `mcp__sendgrid__listTemplates` | List all templates |
| `mcp__sendgrid__addContact` | Add to contact list |
| `mcp__sendgrid__getStats` | Delivery, open, click, bounce, spam reports |

## Common use patterns

### Send welcome email
```
Tool: mcp__sendgrid__sendEmail
Args: { to: "user@example.com", from: "hello@brand.com", subject: "Welcome!", html: "<h1>Hi!</h1>..." }
```

### Create drip campaign template
```
Tool: mcp__sendgrid__createTemplate
Args: { name: "Welcome Drip - Email 1", subject: "Getting started", html: "...", design: "..." }
```

### Campaign stats
```
Tool: mcp__sendgrid__getStats
Args: { startDate: "2026-05-01", endDate: "2026-06-06", aggregation: "day" }
```

## Error handling

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Invalid `SENDGRID_API_KEY` | Regenerate key, update env |
| `403 Forbidden` | Sender not verified | Verify sender in SendGrid → Settings → Sender Auth |
| `413 Payload Too Large` | Email > 30MB | Reduce attachment size, use link instead |
| `429 Too Many Requests` | Rate limit (100/sec default) | Implement backoff, batch sends |

## Manual Fallback (no MCP server)

If `mcp__sendgrid__*` tools not available:

1. **Generate email templates** as HTML files in `plans/marketing/<campaign>/emails/<name>.html`
2. **Save personalization placeholders** ({{first_name}}, {{company}}, etc.)
3. **Provide sending instructions** to user:
   - Copy HTML to SendGrid dashboard → Marketing → Templates
   - Upload contact list (CSV with required columns)
   - Schedule or send

**Template structure:**
```html
<!DOCTYPE html>
<html>
<head><title>{{subject}}</title></head>
<body>
  <h1>Hi {{first_name}},</h1>
  <p>...</p>
  <a href="{{cta_url}}" class="cta">Get Started</a>
</body>
</html>
```

---

## Cross-references

- `skills/marketing/emails/SKILL.md` — email marketing methodology
- `skills/marketing/email-sequence/SKILL.md` — drip sequences
- `skills/automation/mcp-resend/SKILL.md` — alternative (developer-first email API)
