# Posts & Pages

Posts live at `/wp-json/wp/v2/posts`; pages at `/wp-json/wp/v2/pages` (identical body shape). Examples use posts.

## Body fields

| Field | Type | Note |
|---|---|---|
| `title` | string | rendered as post title |
| `content` | string (HTML) | post body |
| `excerpt` | string | summary / meta-ish |
| `slug` | string | URL slug — the idempotency key |
| `status` | string | `draft` (default) · `publish` · `future` · `pending` · `private` |
| `categories` | int[] | category IDs (see `taxonomies.md`) |
| `tags` | int[] | tag IDs |
| `featured_media` | int | media ID (see `media.md`) |
| `date` | ISO 8601 | for `status:"future"` scheduling |
| `meta` | object | custom/SEO meta if registered `show_in_rest` (see `seo-meta.md`) |

## DRAFT DEFAULT gate (MANDATORY)

> Publishing to a live site is outward-facing and hard to reverse. ALWAYS send `status:"draft"` unless the user explicitly requested live publish (e.g. `--publish`) AND the model has echoed the target URL + title and received an explicit "yes". Only then send `status:"publish"`.

## Idempotent upsert (by slug)

```bash
SLUG="my-post-slug"
EXISTING=$(curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  "$WP_SITE_URL/wp-json/wp/v2/posts?slug=$SLUG&status=draft,publish,future,pending,private" \
  | jq -r '.[0].id // empty')

BODY='{"title":"My Title","content":"<p>Body HTML</p>","excerpt":"Summary","slug":"'"$SLUG"'","status":"draft","categories":[3],"tags":[7]}'

if [ -n "$EXISTING" ]; then
  # UPDATE existing — never create a duplicate
  curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
    -X POST "$WP_SITE_URL/wp-json/wp/v2/posts/$EXISTING" -d "$BODY" | jq '{id, link, status}'
else
  # CREATE new
  curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
    -X POST "$WP_SITE_URL/wp-json/wp/v2/posts" -d "$BODY" | jq '{id, link, status}'
fi
```

Querying with all statuses in the slug lookup prevents a "draft exists but search only checked publish → duplicate" bug.

## Publish an existing draft (after confirmation)

```bash
curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
  -X POST "$WP_SITE_URL/wp-json/wp/v2/posts/$ID" -d '{"status":"publish"}' | jq '{id, link, status}'
```

## List / get (read)

```bash
# List recent published
curl -s -u "$WP_USER:$WP_APP_PASSWORD" "$WP_SITE_URL/wp-json/wp/v2/posts?status=publish&per_page=10&_fields=id,slug,title,link"
# Single by id (edit context returns raw content + meta)
curl -s -u "$WP_USER:$WP_APP_PASSWORD" "$WP_SITE_URL/wp-json/wp/v2/posts/$ID?context=edit"
```

## Pages

Same shape at `/wp-json/wp/v2/pages`. Pages also support `parent` (int) and `menu_order` (int).

## Pitfalls

- `content` with raw HTML may be sanitized by WP's `kses` unless the user has `unfiltered_html` capability — don't rely on `<script>`/iframes surviving.
- A slug collision across post types is possible; scope the lookup to the right endpoint (`posts` vs `pages`).
- Pagination: responses cap at `per_page=100`; loop with `&page=N` (header `X-WP-TotalPages`) for full audits.
