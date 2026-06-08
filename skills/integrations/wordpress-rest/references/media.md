# Media

Upload to `/wp-json/wp/v2/media`. Returns an object with `id` → use as a post's `featured_media`.

## Upload (raw binary + Content-Disposition)

```bash
curl -s -u "$WP_USER:$WP_APP_PASSWORD" \
  -H "Content-Disposition: attachment; filename=hero.jpg" \
  -H "Content-Type: image/jpeg" \
  --data-binary @hero.jpg \
  -X POST "$WP_SITE_URL/wp-json/wp/v2/media" \
  | jq '{id, source_url, mime_type}'
```

The `filename` in `Content-Disposition` is REQUIRED — without it WP rejects the upload (400 `rest_upload_no_content_disposition`).

## Set alt text + caption (SEO + a11y)

After upload, patch metadata on the returned media `id`:

```bash
curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
  -X POST "$WP_SITE_URL/wp-json/wp/v2/media/$MEDIA_ID" \
  -d '{"alt_text":"Descriptive alt for SEO/a11y","caption":"Optional caption","title":"Image title"}'
```

## Attach as featured image

```bash
curl -s -u "$WP_USER:$WP_APP_PASSWORD" -H 'Content-Type: application/json' \
  -X POST "$WP_SITE_URL/wp-json/wp/v2/posts/$POST_ID" \
  -d '{"featured_media":'"$MEDIA_ID"'}'
```

## Helper script

`scripts/wp-media-upload.js <file> [mime]` wraps the multipart/binary POST and prints the JSON `{id, source_url}`. Reads creds from env only.

## Pitfalls

- Large files may hit the host's `upload_max_filesize` / `post_max_size` (PHP) → `413`. Resize first (use `imagemagick` skill) or upload via SFTP + register.
- `Content-Type` must match the real file type or WP rejects (`rest_upload_unknown_error`).
- Idempotency: media has no slug-dedup. To avoid re-uploading the same asset on re-runs, search by `?search=<filename>` first and reuse the existing `id` if found.
