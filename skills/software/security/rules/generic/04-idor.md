<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/04-idor.md (MIT) -->

---
id: IDOR
severity_max: HIGH
applies_to: all
---

# Insecure Direct Object Reference (IDOR)

## Intent
Detects when object identifiers from user input are used directly to access resources without verifying the requesting user owns or is authorized to access that resource, allowing attackers to access other users' data by changing IDs.

## Detection
- Look for: ID from request params/body used in DB query without ownership filter
  - Pattern: `findById(req.params.id)` or `WHERE id = $1` without `AND user_id = $currentUser`
- Look for: `req.params.id`, `req.query.id`, `req.body.id` → DB fetch → return data without auth check
- Look for: file retrieval by name/ID from request without checking ownership
- Look for: update/delete operations using L1 ID without verifying resource belongs to caller
- Trace: L1 ID → resource lookup → no secondary ownership/permission check

## Severity assessment
- HIGH when: authenticated users can access other users' private resources by changing ID
- HIGH when: IDs are sequential integers (trivially enumerable)
- Downgrade to MEDIUM when: IDs are UUIDs (harder to guess, but still a vulnerability if no auth check)
- Skip when: ownership check present — `WHERE id = ? AND user_id = ?`, RBAC/permission check verifies access before returning

## Remediation
1. Always filter by authenticated user — `WHERE id = ? AND owner_id = current_user_id`
2. Use UUIDs instead of sequential integers (defense in depth, not primary fix)
3. Implement centralized authorization layer / policy-based access control
4. Return 403 Forbidden (not 404) for unauthorized resource access to avoid enumeration

## Example (vulnerable)
```javascript
// Express — no ownership check
app.get('/api/documents/:id', authenticate, async (req, res) => {
  const doc = await Document.findById(req.params.id);  // L1 id, no user filter
  res.json(doc);
});

app.put('/api/orders/:id', authenticate, async (req, res) => {
  await Order.update({ id: req.params.id }, req.body);  // any user can update any order
});
```

## Example (safe)
```javascript
app.get('/api/documents/:id', authenticate, async (req, res) => {
  const doc = await Document.findOne({
    id: req.params.id,
    ownerId: req.user.id  // ownership enforced
  });
  if (!doc) return res.status(403).json({ error: 'Forbidden' });
  res.json(doc);
});
```
