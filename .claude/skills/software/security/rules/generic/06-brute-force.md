<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/06-brute-force.md (MIT) -->

---
id: BRUTE-FORCE
severity_max: HIGH
applies_to: all
---

# Brute Force (Missing Auth Protection)

## Intent
Detects authentication and sensitive action endpoints that lack rate limiting, account lockout, or CAPTCHA protection, enabling attackers to automate credential stuffing or password guessing attacks.

## Detection
- Look for: login/auth route handlers — `/login`, `/signin`, `/auth`, `/token`, `/oauth`
- Look for: password reset endpoints — `/reset-password`, `/forgot-password`, `/change-password`
- Look for: OTP/2FA verification endpoints — `/verify-otp`, `/confirm-code`
- Check for: absence of rate limiting middleware on these routes
  - Express: missing `express-rate-limit`, `rate-limiter-flexible`
  - NestJS: missing `@Throttle()` decorator or ThrottlerGuard
  - FastAPI: missing `slowapi` limiter
  - Django: missing `django-ratelimit` decorator
- Check for: no account lockout logic (failed attempt counter, temporary ban)
- Check for: no CAPTCHA on high-value endpoints

## Severity assessment
- HIGH when: login/auth endpoint has no rate limiting AND no lockout mechanism
- HIGH when: password reset or OTP endpoint has no rate limiting (allows OTP enumeration)
- Downgrade to MEDIUM when: some protection exists but is insufficient (e.g., rate limit too high: 1000 req/min)
- Skip when: proper rate limiter applied with reasonable threshold (≤10 failed attempts/min), OR account lockout after N failures

## Remediation
1. Apply rate limiting to all auth endpoints (5-10 requests/minute per IP)
2. Implement progressive delays after failed attempts (exponential backoff)
3. Lock accounts after N consecutive failures (with unlock mechanism)
4. Add CAPTCHA after threshold failures
5. Log and alert on brute force patterns

## Example (vulnerable)
```javascript
// Express — no rate limiting on login
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const valid = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: generateToken(user) });
});
```

## Example (safe)
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 attempts per window per IP
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/login', loginLimiter, async (req, res) => {
  // auth logic
});
```
