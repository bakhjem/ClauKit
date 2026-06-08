# Error Handling

WP REST returns errors as JSON: `{ "code": "...", "message": "...", "data": { "status": <http> } }`.

| HTTP | Typical `code` | Cause | Fix |
|---|---|---|---|
| 400 | `rest_invalid_param`, `rest_missing_callback_param` | invalid / missing body field | validate body; check required fields (title/content) |
| 401 | `rest_not_logged_in`, `incorrect_password` | bad Application Password / wrong `WP_USER` | regenerate Application Password; verify env; ensure HTTPS |
| 403 | `rest_cannot_create`, `rest_forbidden` | user lacks capability (`edit_posts`/`publish_posts`) OR security plugin/WAF block | grant role; allow-list REST route; check non-JSON HTML body = host/WAF block |
| 404 | `rest_no_route`, `rest_post_invalid_id` | REST disabled, wrong route, or bad id | check permalinks (not "Plain"); confirm `/wp-json/` reachable; verify id |
| 413 | — | upload too large | resize media (imagemagick skill); raise host limits or SFTP |
| 429 | — | security-plugin / host rate limit (WP has no native limit) | exponential backoff, retry |
| 5xx | — | server / plugin fatal | check site health; retry once; surface to user |

## Backoff pattern (429 / transient 5xx)

```bash
for attempt in 1 2 3; do
  resp=$(curl -s -w '\n%{http_code}' -u "$WP_USER:$WP_APP_PASSWORD" ... )
  code=$(echo "$resp" | tail -1)
  [ "$code" -lt 429 ] && break
  sleep $((2 ** attempt))   # 2s, 4s, 8s
done
```

## Diagnosing 403 (block vs capability)

- JSON body with `rest_cannot_*` → genuine WP capability issue (fix the role).
- HTML body (WAF page) or empty → host/security-plugin block (allow-list the REST route or the agent IP).

## Never on error

- Never retry a write blindly (risks duplicates) — re-run the idempotent upsert lookup first.
- Never log `$WP_APP_PASSWORD` in error output. Redact auth headers before surfacing curl errors.
