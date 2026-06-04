<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/11-csrf.md (MIT) -->

---
id: CSRF
severity_max: HIGH
applies_to: all
---

# Cross-Site Request Forgery (CSRF)

## Intent
Detects state-changing endpoints (POST, PUT, PATCH, DELETE) that lack CSRF token validation, allowing malicious websites to trigger authenticated actions on behalf of logged-in users by exploiting browser cookie auto-attachment.

## Detection
- Look for: mutation route handlers (POST/PUT/PATCH/DELETE) using cookie-based session auth
- Check for: absence of CSRF middleware applied to these routes
  - Express: no `csurf`, `csrf-csrf`, or `express-csrf` middleware
  - Django: `@csrf_exempt` decorator on mutation views, or `CsrfViewMiddleware` missing from settings
  - Laravel: routes in `$except` array of `VerifyCsrfToken` middleware
  - Spring: `.csrf().disable()` in security config
- Look for: APIs that use cookies for auth AND accept `Content-Type: application/json` without `SameSite` cookie attribute
- Note: APIs using only Authorization header (Bearer token) are NOT CSRF vulnerable — no auto-attachment

## Severity assessment
- HIGH when: cookie-session auth + mutation endpoints + no CSRF token + no SameSite=Strict/Lax
- Downgrade to MEDIUM when: SameSite=Lax or Strict is set (mitigates most CSRF but not all)
- Skip when: stateless JWT auth via Authorization header (CSRF not applicable), or CSRF middleware correctly applied to all mutation routes, or custom header check (`X-Requested-With`) applied

## Remediation
1. Apply CSRF middleware to all state-changing routes
2. Set `SameSite=Strict` or `SameSite=Lax` on session cookies
3. For SPAs: use `Double Submit Cookie` or `Synchronizer Token` pattern
4. For pure APIs: use Authorization header (Bearer) instead of cookies — CSRF-immune

## Example (vulnerable)
```javascript
// Express — cookie session, no CSRF protection
app.post('/transfer-funds', sessionAuth, async (req, res) => {
  // Any site can forge this POST with user's cookies attached
  await transferFunds(req.session.userId, req.body.toAccount, req.body.amount);
  res.json({ success: true });
});
```

## Example (safe)
```javascript
const { doubleCsrf } = require('csrf-csrf');
const { generateToken, doubleCsrfProtection } = doubleCsrf({ getSecret: () => process.env.CSRF_SECRET });

// Apply CSRF protection to all mutation routes
app.post('/transfer-funds', sessionAuth, doubleCsrfProtection, async (req, res) => {
  await transferFunds(req.session.userId, req.body.toAccount, req.body.amount);
  res.json({ success: true });
});
```
