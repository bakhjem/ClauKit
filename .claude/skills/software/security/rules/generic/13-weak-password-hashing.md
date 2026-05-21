<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/13-weak-password-hashing.md (MIT) -->

---
id: WEAK-PASSWORD-HASHING
severity_max: CRITICAL
applies_to: all
---

# Weak Password Hashing

## Intent
Detects passwords stored using cryptographically weak or fast hashing algorithms (MD5, SHA1, SHA256, SHA512, plain text) that can be reversed via rainbow tables or GPU brute-force. Only adaptive, memory-hard functions are acceptable for passwords.

## Detection
- Look for: `md5(password)`, `sha1(password)`, `sha256(password)`, `sha512(password)` used to store passwords
- Look for: `hashlib.md5(password)`, `hashlib.sha1(password)` in Python
- Look for: `crypto.createHash('md5')`, `crypto.createHash('sha1')`, `crypto.createHash('sha256')` for passwords
- Look for: plain text storage — storing password directly in DB without any hashing
- Look for: `base64.encode(password)` — encoding is not hashing
- Look for: custom "hashing" — `password + salt` without proper KDF
- Confirm: is this a password field? Variable name should contain `password`, `passwd`, `pwd`, `secret` + is being stored to DB

## Severity assessment
- CRITICAL when: MD5 or SHA1 used for password storage (easily cracked)
- CRITICAL when: plain text password stored
- HIGH when: SHA256/SHA512 without salt (rainbow table vulnerable) or with static salt
- Downgrade to MEDIUM when: SHA256 with per-user salt (still weak but harder to crack en masse)
- Skip when: bcrypt (`bcrypt.hash()`), argon2 (`argon2.hash()`), scrypt (`crypto.scrypt()`), PBKDF2 with high iterations used

## Remediation
1. Use bcrypt with cost factor ≥12: `bcrypt.hash(password, 12)`
2. Use argon2id (preferred for new systems): `argon2.hash(password)`
3. Use scrypt or PBKDF2 with iterations ≥100,000 as alternatives
4. Migrate existing weak hashes: re-hash on next login
5. Never store, log, or transmit plain-text passwords

## Example (vulnerable)
```javascript
// MD5 — completely broken for passwords
const passwordHash = crypto.createHash('md5').update(password).digest('hex');
await User.create({ email, passwordHash });

// SHA256 without salt
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

```python
import hashlib
password_hash = hashlib.sha1(password.encode()).hexdigest()  # weak
```

## Example (safe)
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
await User.create({ email, passwordHash });

// Verify
const isValid = await bcrypt.compare(inputPassword, user.passwordHash);
```

```python
import argon2
ph = argon2.PasswordHasher()
password_hash = ph.hash(password)  # argon2id by default

# Verify
ph.verify(password_hash, input_password)
```
