# SEO Meta (Yoast / RankMath)

SEO plugins store meta (title, description, canonical, OG, focus keyword) as post meta. Whether it is **writable over REST** depends on the plugin + site config. Always **discover first, then write, else fall back**.

## Step 1 — Discover what's exposed

```bash
# Which SEO routes/fields exist?
curl -s "$WP_SITE_URL/wp-json/" | jq -r '.routes | keys[]' | grep -Ei 'yoast|rank' || echo "no SEO REST routes"
# On a post, does Yoast expose its head JSON (read)?
curl -s -u "$WP_USER:$WP_APP_PASSWORD" "$WP_SITE_URL/wp-json/wp/v2/posts/$ID?_fields=yoast_head_json" | jq '.yoast_head_json // "no yoast_head_json"'
```

## Yoast SEO

- **Read:** `yoast_head_json` field on posts (title, description, OG, canonical, schema) — exposed by default in recent Yoast.
- **Write:** Yoast meta keys (`_yoast_wpseo_title`, `_yoast_wpseo_metadesc`, `_yoast_wpseo_focuskw`, `_yoast_wpseo_canonical`) are NOT writable via core REST unless registered `show_in_rest`. Options:
  - Yoast's own REST API (plugin-dependent) — check discovery.
  - A site mu-plugin that `register_meta`s those keys with `show_in_rest: true` → then write via `meta`:
    ```bash
    curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
      -X POST "$WP_SITE_URL/wp-json/wp/v2/posts/$ID" \
      -d '{"meta":{"_yoast_wpseo_title":"SEO Title","_yoast_wpseo_metadesc":"Meta description ≤155 chars"}}'
    ```

## RankMath

- Meta keys: `rank_math_title`, `rank_math_description`, `rank_math_focus_keyword`, `rank_math_canonical_url`.
- Same constraint — writable via `meta` only if registered `show_in_rest`. RankMath also offers a content-analysis REST namespace on some versions (check discovery).

## Step 2 — Write (if exposed)

Use the `meta` object on the post body (see snippets above). Confirm the write took by re-reading the field.

## Step 3 — Manual fallback (NO writable SEO REST surface)

If neither plugin exposes writable meta, DON'T fail. Emit the SEO block as markdown and instruct the user to paste it into the post's SEO panel:

```markdown
### SEO meta for "<post title>" — paste into Yoast/RankMath panel
- SEO title: <≤60 chars>
- Meta description: <≤155 chars>
- Focus keyword: <kw>
- Canonical: <url or leave default>
- OG title / OG description: <...>
```

## Notes

- Description length: Yoast ~155, RankMath ~160 chars — keep concise.
- Writing unregistered meta keys silently no-ops (returns 200 but value not stored) — always verify with a read-back.
