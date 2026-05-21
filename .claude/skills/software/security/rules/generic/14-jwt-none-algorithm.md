<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/14-jwt-none-algorithm.md (MIT) -->

---
id: JWT-NONE-ALGORITHM
severity_max: CRITICAL
applies_to: all
---

# JWT None Algorithm / Algorithm Confusion

## Intent
Detects JWT verification implementations that accept `alg: none` (no signature verification) or don't restrict accepted algorithms, enabling attackers to forge tokens by crafting a JWT with `alg: none` and arbitrary claims, or by switching from RS256 to HS256 using the public key as the secret.

## Detection
- Look for: `jwt.verify(token, secret)` without `algorithms` option specified — accepts any algorithm including `none`
- Look for: `jwt.verify(token, secret, {})` — empty options, no algorithm restriction
- Look for: manually parsing JWT header without verifying algorithm before verification
- Look for: `if (alg === 'none') { skipVerification() }` — explicit none handling
- Look for: `jwt.decode(token)` used for auth decisions without `jwt.verify()` — decode does NOT verify signature
- Look for: accepting `alg` from token header to choose verification method (algorithm confusion)

## Severity assessment
- CRITICAL when: `jwt.verify()` without `algorithms` whitelist — allows `none` algorithm attack
- CRITICAL when: `jwt.decode()` (no signature check) used for access control decisions
- HIGH when: algorithm whitelist present but includes both asymmetric and symmetric (RS256 + HS256) — confusion attack possible
- Downgrade to MEDIUM when: some algorithm restriction but missing edge cases
- Skip when: `algorithms: ['RS256']` or `algorithms: ['HS256']` explicitly specified and single algorithm used

## Remediation
1. Always specify `algorithms` whitelist in `jwt.verify()`: `{ algorithms: ['HS256'] }`
2. Never use `jwt.decode()` for authorization — it skips signature verification
3. Never accept algorithm from token header — enforce server-side
4. Use RS256 (asymmetric) for distributed systems; HS256 (symmetric) for single-service
5. Rotate secrets periodically; use strong secrets (≥256 bits for HS256)

## Example (vulnerable)
```javascript
// jsonwebtoken — no algorithm restriction
const payload = jwt.verify(token, process.env.JWT_SECRET);
// Attacker can craft: header={alg:"none"}, payload={admin:true}, no signature

// Using decode for auth (no verification)
const payload = jwt.decode(token);  // NEVER verify signature
if (payload.userId) { allowAccess(); }
```

```python
# PyJWT — no algorithms specified
payload = jwt.decode(token, secret, options={"verify_signature": False})  # verification disabled
```

## Example (safe)
```javascript
// Explicit algorithm whitelist
const payload = jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ['HS256'],  // only accept HS256
  issuer: 'myapp',
  audience: 'myapp-users',
});
```

```python
# PyJWT — explicit algorithm
payload = jwt.decode(token, secret, algorithms=['HS256'])
```
