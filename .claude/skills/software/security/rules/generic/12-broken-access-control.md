<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/12-broken-access-control.md (MIT) -->

---
id: BROKEN-ACCESS-CONTROL
severity_max: CRITICAL
applies_to: all
---

# Broken Access Control

## Intent
Detects sensitive endpoints that perform privileged operations (admin actions, user management, data deletion, configuration changes) without authorization or role checks, allowing unauthorized users to escalate privileges or access restricted functionality.

## Detection
- Look for: routes with `/admin`, `/internal`, `/manage`, `/config`, `/superuser` without role check middleware
- Look for: user modification endpoints (`deleteUser`, `updateRole`, `grantPermission`) without `isAdmin` or role verification
- Look for: middleware chain where auth middleware is present but authorization (role/permission) middleware is absent
- Look for: conditional auth — `if (process.env.ENV !== 'prod') return next()` — skipping auth in non-prod
- Look for: hardcoded bypass — `if (user.email === 'admin@example.com')` instead of role system
- Look for: `isAdmin` check missing on admin-only operations

## Severity assessment
- CRITICAL when: admin/privileged routes have authentication but no authorization (any logged-in user can access)
- CRITICAL when: routes have neither authentication nor authorization
- HIGH when: some authorization exists but is incomplete (e.g., checks `isAdmin` but not ownership for sensitive ops)
- Downgrade to MEDIUM when: authorization logic exists but has edge-case gaps
- Skip when: proper RBAC/ABAC middleware applied and verified before sensitive operation

## Remediation
1. Implement centralized authorization middleware — deny by default
2. Use RBAC (Role-Based Access Control) with explicit permission grants
3. Apply authorization checks at the route AND service layer
4. Never rely on client-supplied role data — load role from server-side session/DB
5. Audit all sensitive routes with automated tests verifying 403 for unauthorized roles

## Example (vulnerable)
```javascript
// Express — authentication but no authorization check
router.delete('/admin/users/:id', authenticate, async (req, res) => {
  // Any authenticated user can delete any other user
  await User.deleteOne({ _id: req.params.id });
  res.json({ deleted: true });
});

// No auth at all on sensitive endpoint
router.get('/internal/metrics', (req, res) => {
  res.json(await getSystemMetrics());
});
```

## Example (safe)
```javascript
// Middleware: require specific role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

router.delete('/admin/users/:id', authenticate, requireRole('admin'), async (req, res) => {
  await User.deleteOne({ _id: req.params.id });
  res.json({ deleted: true });
});
```
