<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/18-missing-rate-limit.md (MIT) -->

---
id: MISSING-RATE-LIMIT
severity_max: HIGH
applies_to: all
---

# Missing Rate Limit

## Intent
Detects sensitive endpoints (excluding auth — covered by BRUTE-FORCE rule) that lack rate limiting, enabling DoS attacks, data enumeration, or automated abuse of expensive operations like search, email sending, OTP generation, and payment processing.

## Detection
- Look for: search endpoints without rate limiting — `/search`, `/find`, `/query` accepting user input with no throttle
- Look for: email/notification sending endpoints — `/send-email`, `/notify`, `/invite` without limit
- Look for: OTP generation (distinct from OTP verification) — `/request-otp`, `/resend-code` without limit
- Look for: expensive computation endpoints (AI inference, report generation, export) without throttle
- Look for: public API endpoints with no rate limiting at all
- Check for: absence of rate limit middleware — `express-rate-limit`, `slowapi`, `django-ratelimit`, Nginx `limit_req`
- Note: login/auth endpoints are covered by BRUTE-FORCE rule; this rule covers OTHER sensitive endpoints

## Severity assessment
- HIGH when: endpoint triggers external service (email, SMS, payment) with no rate limit — enables financial DoS
- HIGH when: search or enumeration endpoint with no rate limit — enables data harvesting
- Downgrade to MEDIUM when: operation is cheap internally but could be abused for spam
- Downgrade to LOW when: endpoint is already authenticated AND user's actions are logged/auditable
- Skip when: rate limiting middleware properly applied, or operation is idempotent and cheap with no external cost

## Remediation
1. Apply rate limiting to all public and sensitive endpoints
2. Use per-user limits for authenticated endpoints (not just per-IP)
3. For external service calls: add hard caps (e.g., max 10 emails/hour/user)
4. Return `429 Too Many Requests` with `Retry-After` header
5. Consider token bucket or sliding window algorithm for smooth rate limiting

## Example (vulnerable)
```javascript
// Express — search endpoint with DB query, no rate limit
app.get('/search', authenticate, async (req, res) => {
  const results = await db.query(
    'SELECT * FROM products WHERE name ILIKE $1',
    [`%${req.query.q}%`]
  );
  res.json(results);
});

// Email sending without limit
app.post('/send-invite', authenticate, async (req, res) => {
  await sendEmail(req.body.email, 'Invitation', inviteTemplate);
  res.json({ sent: true });
});
```

## Example (safe)
```javascript
const rateLimit = require('express-rate-limit');

const searchLimiter = rateLimit({ windowMs: 60_000, max: 30 });  // 30/min
const emailLimiter = rateLimit({ windowMs: 3_600_000, max: 10 });  // 10/hour

app.get('/search', authenticate, searchLimiter, async (req, res) => {
  const results = await db.query('SELECT * FROM products WHERE name ILIKE $1', [`%${req.query.q}%`]);
  res.json(results);
});

app.post('/send-invite', authenticate, emailLimiter, async (req, res) => {
  await sendEmail(req.body.email, 'Invitation', inviteTemplate);
  res.json({ sent: true });
});
```
