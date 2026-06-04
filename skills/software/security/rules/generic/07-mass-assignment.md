<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/07-mass-assignment.md (MIT) -->

---
id: MASS-ASSIGNMENT
severity_max: CRITICAL
applies_to: all
---

# Mass Assignment

## Intent
Detects when entire request body objects are assigned to data models without field filtering, allowing attackers to set unintended fields such as `isAdmin`, `role`, `balance`, or `verified` by including them in the request payload.

## Detection
- Look for: `Object.assign(model, req.body)` — entire body merged into object
- Look for: `user.update(req.body)` or `User.create(req.body)` without field allowlist
- Look for: Mongoose — `User.findByIdAndUpdate(id, req.body)` without `select` or field filtering
- Look for: SQLAlchemy — `model.__dict__.update(request.json)`
- Look for: Rails-style — `User.update(params)` without `params.permit(...)`
- Look for: NestJS — DTO not used, raw `@Body() body: any` passed to service
- Trace: L1 (req.body) → model update/create without an explicit allowlist of accepted fields

## Severity assessment
- CRITICAL when: model contains sensitive fields (`isAdmin`, `role`, `permissions`, `balance`, `verified`, `emailVerified`) and body is assigned without filtering
- HIGH when: filtering exists but is incomplete (blocklist approach — removing sensitive fields) rather than allowlist
- Downgrade to MEDIUM when: fields are validated but via blocklist (attacker can add new fields not yet blocked)
- Skip when: explicit allowlist applied — `pick(req.body, ['name', 'email'])`, DTO with `@IsString()` decorators, `params.permit(:name, :email)` in Rails

## Remediation
1. Always use an explicit allowlist of permitted fields
2. Use DTOs/schema validation (NestJS DTO, Pydantic model, Zod schema)
3. Never pass raw `req.body` to ORM create/update
4. Use separate input types for create vs update operations

## Example (vulnerable)
```javascript
// Any sensitive field in body (isAdmin: true) gets saved
app.put('/users/:id', authenticate, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});
```

## Example (safe)
```javascript
const { pick } = require('lodash');

app.put('/users/:id', authenticate, async (req, res) => {
  const allowedFields = ['name', 'email', 'bio', 'avatarUrl'];
  const safeBody = pick(req.body, allowedFields);  // explicit allowlist
  const user = await User.findByIdAndUpdate(req.params.id, safeBody, { new: true });
  res.json(user);
});
```
