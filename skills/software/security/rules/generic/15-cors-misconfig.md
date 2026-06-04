<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/15-cors-misconfig.md (MIT) -->

---
id: CORS-MISCONFIG
severity_max: HIGH
applies_to: all
---

# CORS Misconfiguration

## Intent
Detects CORS configurations that allow any origin to make credentialed requests or that dynamically reflect the request Origin without validation, enabling malicious websites to make authenticated API calls on behalf of users.

## Detection
- Look for: `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` — browsers reject this but misconfig indicates intent
- Look for: dynamically reflecting origin — `res.setHeader('Access-Control-Allow-Origin', req.headers.origin)` without validation
- Look for: `cors({ origin: '*', credentials: true })` configuration
- Look for: `origin: true` in cors options (reflects any origin with credentials)
- Look for: regex origin matching that is too permissive — `origin.endsWith('.example.com')` vulnerable to `attacker.example.com`
- Look for: `origin: (origin, cb) => cb(null, true)` — always allowing any origin with credentials

## Severity assessment
- HIGH when: any origin reflected back with credentials enabled (authenticated CORS bypass)
- HIGH when: wildcard `*` origin on endpoints that set auth cookies or return sensitive data
- Downgrade to MEDIUM when: wildcard `*` on public endpoints with no auth/session data
- Downgrade to LOW when: wildcard on completely public data endpoints (e.g., public CDN)
- Skip when: explicit allowlist of trusted origins validated before reflecting, no credentials used with wildcard

## Remediation
1. Use explicit allowlist: `origin: ['https://app.example.com', 'https://admin.example.com']`
2. Never combine `origin: true` (reflect all) with `credentials: true`
3. For dynamic origin validation: exact match against allowlist, not substring/regex
4. Set `SameSite=Strict` on auth cookies as defense in depth
5. Audit CORS headers in production with browser devtools

## Example (vulnerable)
```javascript
// Reflects any origin with credentials
app.use(cors({
  origin: true,           // reflects req.headers.origin blindly
  credentials: true,      // allows cookies/auth headers
}));

// Manual reflection without validation
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);  // any origin
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
```

## Example (safe)
```javascript
const ALLOWED_ORIGINS = [
  'https://app.example.com',
  'https://admin.example.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```
