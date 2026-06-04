<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/09-ssrf.md (MIT) -->

---
id: SSRF
severity_max: HIGH
applies_to: all
---

# Server-Side Request Forgery (SSRF)

## Intent
Detects when user-controlled URLs or hostnames are used in server-side HTTP requests without validation, allowing attackers to make the server fetch internal resources (AWS metadata, internal APIs, databases) or scan internal network topology.

## Detection
- Look for: `fetch(userInput)`, `axios.get(userInput)`, `requests.get(userInput)`, `http.Get(userInput)` where userInput is L1
- Look for: `url`, `endpoint`, `webhook`, `callback`, `redirect` parameters from request body/query passed to HTTP client
- Look for: URL construction from L1 parts — `http://` + `req.body.host` + `/api`
- Look for: file fetching from user-supplied URL — image proxy, link preview, webhook delivery
- Trace: L1 URL/hostname → HTTP client call without URL validation

## Severity assessment
- HIGH when: L1 URL flows directly to server-side HTTP request without allowlist
- HIGH when: redirect target from user input used as fetch destination
- Downgrade to MEDIUM when: URL is partially validated (scheme check only — `startsWith('https://')` — insufficient, can still reach internal IPs)
- Skip when: strict allowlist of permitted domains enforced, or URL parsed and host validated against allowlist before request

## Remediation
1. Validate URL against explicit allowlist of permitted domains/IPs
2. Parse URL and reject private IP ranges (10.x, 172.16-31.x, 192.168.x, 127.x, 169.254.x, ::1)
3. Use a dedicated SSRF-protection library (ssrf-filter for Node.js, `validators.url` + private IP check for Python)
4. Disable HTTP redirects or validate redirect targets
5. Apply network egress controls — server should only reach permitted external hosts

## Example (vulnerable)
```javascript
// Express — webhook URL from user
app.post('/webhooks', authenticate, async (req, res) => {
  const { url } = req.body;  // L1
  const result = await fetch(url);  // SSRF — can reach internal services
  res.json(await result.json());
});
```

## Example (safe)
```javascript
const { SsrfFilter } = require('ssrf-filter');
const ssrfFilter = new SsrfFilter();

app.post('/webhooks', authenticate, async (req, res) => {
  const { url } = req.body;
  try {
    await ssrfFilter.fetch(url);  // validates against private IPs/localhost
  } catch (e) {
    return res.status(400).json({ error: 'Invalid webhook URL' });
  }
});
```
