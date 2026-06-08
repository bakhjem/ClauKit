# Taxonomies (Categories & Tags)

Categories: `/wp-json/wp/v2/categories`. Tags: `/wp-json/wp/v2/tags`. Posts reference them by **ID** (`categories:[3,5]`, `tags:[7]`).

## Read / find existing

```bash
# Find category id by slug
curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  "$WP_SITE_URL/wp-json/wp/v2/categories?slug=marketing&_fields=id,name,slug" | jq '.[0].id // empty'
# List all tags
curl -s -u "$WP_USER:$WP_APP_PASSWORD" "$WP_SITE_URL/wp-json/wp/v2/tags?per_page=100&_fields=id,name,slug"
```

## Create-if-missing (idempotent)

Never blind-create — dedup by slug first:

```bash
NAME="Content Marketing"; SLUG="content-marketing"
ID=$(curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  "$WP_SITE_URL/wp-json/wp/v2/categories?slug=$SLUG" | jq -r '.[0].id // empty')
if [ -z "$ID" ]; then
  ID=$(curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
    -X POST "$WP_SITE_URL/wp-json/wp/v2/categories" \
    -d '{"name":"'"$NAME"'","slug":"'"$SLUG"'"}' | jq -r '.id')
fi
echo "category id=$ID"
```

Tags: identical at `/wp-json/wp/v2/tags`.

## Attach to a post

Include the resolved IDs in the post body (see `posts-and-pages.md`):

```json
{ "categories": [3], "tags": [7, 12] }
```

## Pitfalls

- Creating a category/tag requires `manage_categories` / `edit_terms` capability → `403` otherwise; fall back to existing terms only.
- Passing a name string instead of an ID in `categories`/`tags` silently fails — always resolve to IDs first.
- Duplicate-name terms with different slugs are possible; prefer slug lookup over name.
