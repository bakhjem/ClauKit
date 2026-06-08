# Auth & Preflight

## Application Passwords (recommended for agents)

WordPress 5.6+ ships **Application Passwords** — per-user, revocable tokens for API clients. Generate at: WP Admin → Users → Profile → **Application Passwords** → name it → copy the 24-char token (spaces are cosmetic; WP strips them).

Auth = HTTP Basic over **HTTPS** (never plain HTTP — Basic sends base64, not encryption):

```
Authorization: Basic base64("$WP_USER:$WP_APP_PASSWORD")
```

## Env vars (only source of credentials)

```
WP_SITE_URL      # https://example.com  (no trailing slash)
WP_USER          # WordPress username (not email unless that's the login)
WP_APP_PASSWORD  # Application Password token
```

Never hardcode. Never echo `$WP_APP_PASSWORD`. Build the header at call time (see `scripts/wp-auth-header.js`).

## Preflight — verify connectivity (no auth needed)

```bash
curl -sf "$WP_SITE_URL/wp-json/" >/dev/null && echo "WP reachable" || echo "WP NOT reachable — check URL/permalinks/REST"
```

If this 404s: REST API may be disabled, permalinks set to "Plain", or a security plugin is blocking `/wp-json/`. Stop and surface to user — do not attempt writes.

## Authenticated capability probe

Confirm the user can actually publish before attempting writes:

```bash
curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  "$WP_SITE_URL/wp-json/wp/v2/users/me?context=edit" \
  | jq '{user: .name, can_publish: .capabilities.publish_posts, can_edit: .capabilities.edit_posts}'
```

- `401` → bad credentials (regenerate Application Password, check `WP_USER`).
- `403` → REST blocked by a security plugin, or user lacks the role.
- `capabilities.publish_posts == true` → safe to publish (still gated by draft-default policy).

## Notes

- Application Passwords are disabled over non-HTTPS by default. Use HTTPS.
- Tokens are revocable from the same profile screen — instruct users to revoke if leaked.
- Some managed hosts (WP Engine, etc.) require allow-listing the REST route or use a WAF — a `403` with an HTML body (not JSON) usually means a host/WAF block, not WP itself.
