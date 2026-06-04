<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/01-hardcoded-secret.md (MIT) -->

---
id: HARDCODED-SECRET
severity_max: CRITICAL
applies_to: all
---

# Hardcoded Secret

## Intent
Detects API keys, passwords, tokens, and credentials committed directly in source code. Hardcoded secrets are exposed to anyone with repo access and persist in git history even after removal.

## Detection
- Look for: variable assignments where name contains `key`, `secret`, `password`, `token`, `api_key`, `apikey`, `credential`, `passwd`, `auth`
- Look for: known key prefixes — `sk-`, `pk-`, `ghp_`, `ghs_`, `AKIA`, `AIza`, `ya29.`, `xoxb-`, `xoxp-`, `glpat-`, `SG.`
- Look for: high-entropy quoted strings (>20 chars, mixed alphanumeric + symbols) assigned to sensitive variable names
- Look for: connection strings containing credentials — `mongodb://user:pass@`, `postgres://user:pass@`, `redis://:pass@`
- Look for: `-----BEGIN (RSA|EC|PRIVATE) KEY-----` in any file
- Trace: value is L3 (literal in code) — not from env or config injection

## Severity assessment
- CRITICAL when: real-looking secret (high entropy, known prefix pattern, or connection string with credentials)
- HIGH when: placeholder-pattern but still in code (e.g., `password = "changeme"`)
- Downgrade to MEDIUM/skip when: obvious placeholder — `"your-api-key-here"`, `"<TOKEN>"`, `"xxx"`, `"todo"`, test fixture files with clearly fake values
- Skip when: value comes from `process.env`, `os.environ`, `config.get()`, vault/secrets-manager call

## Remediation
1. Rotate the exposed secret immediately
2. Move to environment variable: `process.env.API_KEY` / `os.environ['API_KEY']`
3. Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
4. Add secret patterns to `.gitignore` and pre-commit hooks (git-secrets, gitleaks)
5. Audit git history with `git log -S "secret_value"` and purge if needed

## Example (vulnerable)
```javascript
const client = new Stripe('sk-live-4xKjH8mNpQ2rT9vW3uL7eY1bF5cA6dZ0');
const db = mongoose.connect('mongodb://admin:SuperSecret123@prod-db:27017/app');
```

## Example (safe)
```javascript
const client = new Stripe(process.env.STRIPE_SECRET_KEY);
const db = mongoose.connect(process.env.MONGODB_URI);
```
