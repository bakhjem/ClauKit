---
name: mcp-resend
description: Resend MCP wrapper. Activate for developer-first transactional email with React Email components. Routes to MCP tools if available, else generates React Email components for local rendering.
allowed-tools: Read, Bash, Write
---

# MCP Resend Wrapper

> Resend email API integration. Developer-first, React Email native.

---

## MCP Server

**Server command:** `npx -y @modelcontextprotocol/server-resend` (or community equivalent)
**Required env:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
**Setup:** [Resend API keys](https://resend.com/api-keys)

## Tools exposed (when MCP configured)

| Tool | Purpose |
|---|---|
| `mcp__resend__sendEmail` | Send transactional email (React Email component → HTML) |
| `mcp__resend__sendBatch` | Batch send (up to 100 recipients) |
| `mcp__resend__getDomains` | List verified sending domains |
| `mcp__resend__addDomain` | Add + verify new sending domain |
| `mcp__resend__getDeliveryStats` | Delivery, open, click events |

## Common use patterns

### Send with React Email component
```
Tool: mcp__resend__sendEmail
Args: {
  from: "hello@brand.com",
  to: "user@example.com",
  subject: "Welcome!",
  react: <WelcomeEmail firstName="..." />
}
```

### Batch send
```
Tool: mcp__resend__sendBatch
Args: {
  from: "newsletter@brand.com",
  subject: "Weekly Update",
  recipients: [{to: "u1@x.com", data: {name: "Alice"}}, ...]
}
```

## Error handling

| Error | Cause | Fix |
|---|---|---|
| `403 Forbidden` | Domain not verified | Add + verify domain in Resend dashboard |
| `422 Validation Error` | Invalid email/recipient | Validate with regex; check `to` is array |
| `429 Too Many Requests` | Rate limit (2/sec default, 100/sec with batch) | Batch sends, implement backoff |

## Manual Fallback (no MCP server)

If `mcp__resend__*` tools not available:

1. **Generate React Email components** in `plans/marketing/<campaign>/emails/<name>.tsx`:
   ```tsx
   import { Html, Head, Body, Container, Text, Button } from "@react-email/components";

   export default function WelcomeEmail({ firstName }: { firstName: string }) {
     return (
       <Html>
         <Head />
         <Body>
           <Container>
             <Text>Hi {firstName},</Text>
             <Button href="https://...">Get Started</Button>
           </Container>
         </Body>
       </Html>
     );
   }
   ```
2. **Install deps:** `npm install @react-email/components react`
3. **Render locally:** Use React Email's preview server (`email dev`)
4. **Send via curl:**
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer $RESEND_API_KEY" \
     -d @{"from":"...","to":"...","subject":"...","html":"..."}
   ```

---

## Cross-references

- `skills/automation/mcp-sendgrid/SKILL.md` — alternative (full-featured email)
- `skills/marketing/emails/SKILL.md` — email marketing methodology
