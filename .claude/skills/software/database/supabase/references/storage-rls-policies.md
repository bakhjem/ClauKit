---
title: Secure Storage Buckets with RLS on storage.objects
impact: CRITICAL
impactDescription: Prevents public bucket leaks and cross-user file access
tags: storage, rls, buckets, security
---

## Secure Storage Buckets with RLS on storage.objects

Storage in Supabase is Postgres rows: every file lives as a row in `storage.objects`. Bucket-level "public/private" only controls whether anon can `GET` an object by URL — it does **not** restrict who can upload, list, or delete. All authorization beyond that runs through RLS policies on `storage.objects`, scoped by `bucket_id` and the file's path (`name`).

**Incorrect (public bucket as the only control; no upload policy):**

```sql
-- Bucket is "public", so anyone with the URL can read.
-- But because no policy restricts insert on storage.objects, anon
-- can also UPLOAD arbitrary files (defacement, malware hosting).
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- (no policies added)
```

**Correct (private bucket + path-scoped policies):**

```sql
-- Convention: each user's files live under `{user_id}/...`
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', false);

-- READ: signed URLs only (no public listing)
create policy avatars_read on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- UPLOAD: only into your own folder
create policy avatars_insert on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- UPDATE / DELETE: same scoping
create policy avatars_update on storage.objects
  for update
  to authenticated
  using      (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy avatars_delete on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
```

Helpers PostgreSQL provides on `storage.objects`:

- `storage.foldername(name)` → `text[]` of path segments. `(storage.foldername(name))[1]` is the top folder.
- `storage.filename(name)` → final segment (`avatar.png`).
- `storage.extension(name)` → `'png'`, no dot.

Client (private bucket, signed URL):

```ts
// Upload — path is `{auth.uid()}/avatar.png`
const { data: { user } } = await supabase.auth.getUser();
const path = `${user!.id}/avatar.png`;

const { error } = await supabase
  .storage
  .from("avatars")
  .upload(path, file, { upsert: true, contentType: file.type });

// Read — generate a short-lived signed URL (1 hour)
const { data } = await supabase
  .storage
  .from("avatars")
  .createSignedUrl(path, 60 * 60);
```

Common mistakes:

- **Public bucket + RLS upload policy**: anyone can still `GET` if they know/guess the path. For sensitive files, keep the bucket private and always use signed URLs.
- **Storing files under unpredictable names without RLS**: "security through obscurity" — Supabase exposes a list endpoint that requires RLS to refuse it. Add a `select` policy or all paths leak.
- **Forgetting MIME / size limits**: enforce via bucket `allowed_mime_types` and `file_size_limit`, set when creating or via Dashboard. RLS cannot inspect file bytes.

References:
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/docs/guides/storage/buckets/fundamentals
