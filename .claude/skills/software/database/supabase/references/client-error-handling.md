---
title: Handle the { data, error } Tuple — supabase-js Never Throws on Query Errors
impact: HIGH
impactDescription: Avoids silent failures and uncaught nulls
tags: client, supabase-js, error-handling, postgrest
---

## Handle the { data, error } Tuple — supabase-js Never Throws on Query Errors

Unlike `fetch`, supabase-js *resolves* the promise on PostgREST/Postgres errors and returns `{ data: null, error: PostgrestError }`. Wrapping calls in `try/catch` alone misses query errors entirely; you must inspect `error` on every call. RLS denials surface as empty `data` (not an error), which is its own footgun.

**Incorrect (try/catch only; ignores error tuple; misreads RLS denials):**

```ts
try {
  const { data } = await supabase.from("posts").select("*");
  // data is null on error — this crashes downstream
  return data.map(renderPost);
} catch (e) {
  // Never reached for query errors. Only network failures land here.
  console.error(e);
}
```

```ts
// RLS denial returns [] — code assumes "post doesn't exist"
// when really "you can't see it"
const { data } = await supabase.from("posts").select().eq("id", id).single();
if (!data) return notFound(); // wrong on a 403-like denial
```

**Correct (check error first, distinguish PostgREST codes):**

```ts
const { data, error } = await supabase
  .from("posts")
  .select("id, title")
  .eq("id", id)
  .single();

if (error) {
  // PostgrestError: { code, message, details, hint }
  if (error.code === "PGRST116") {
    // "Results contain 0 rows" — .single() failed
    return notFound();
  }
  if (error.code === "42501") {
    // insufficient_privilege — RLS denied
    return forbidden();
  }
  // Log and bubble up; never swallow
  log.error({ err: error }, "post lookup failed");
  throw new Error(error.message);
}

return render(data); // data is non-null here, types narrow it
```

Helper for repetitive call sites:

```ts
export async function unwrap<T>(
  res: Promise<{ data: T | null; error: PostgrestError | null }>,
): Promise<T> {
  const { data, error } = await res;
  if (error) throw Object.assign(new Error(error.message), { cause: error });
  if (data === null) throw new Error("Expected data, got null");
  return data;
}

// usage
const post = await unwrap(supabase.from("posts").select("*").eq("id", id).single());
```

Common PostgREST error codes worth handling explicitly:

| Code | Meaning | Fix |
|------|---------|-----|
| `PGRST116` | `.single()` returned 0 or >1 rows | Use `.maybeSingle()` if 0 is valid |
| `PGRST301` | JWT expired | Refresh session, retry once |
| `23505` | unique_violation | Show "already exists" UX |
| `23503` | foreign_key_violation | FK target missing |
| `42501` | insufficient_privilege | RLS denied — distinguish from 404 |

Auth errors (`supabase.auth.*`) use the same shape but with `AuthError` codes (`invalid_credentials`, `user_already_exists`, `email_not_confirmed`, …).

References:
- https://supabase.com/docs/reference/javascript/db-handling-errors
- https://postgrest.org/en/stable/references/errors.html
