---
title: Generate Types and Narrow Selects with supabase-js
impact: HIGH
impactDescription: Compile-time safety + smaller payloads
tags: client, supabase-js, typescript, types, codegen
---

## Generate Types and Narrow Selects with supabase-js

`supabase-js` is fully typed when you pass the generated `Database` interface to `createClient`. Skipping codegen yields `any` everywhere; passing it but using `select('*')` gives types but ships every column over the wire — including columns that should never reach the client.

**Incorrect (no Database generic, wildcard select):**

```ts
import { createClient } from "@supabase/supabase-js";

// `data` is `any[]` — typos, missing nullability, no autocomplete
const supabase = createClient(url, anonKey);

const { data, error } = await supabase
  .from("users")
  .select("*"); // ships internal columns (email_verified_at, deleted_at, …)
```

**Correct (codegen + narrow select + relationship typing):**

```bash
# CLI: regenerate after every migration. Wire into CI/pre-commit.
supabase gen types typescript \
  --project-id "$SUPABASE_PROJECT_ID" \
  --schema public \
  > src/types/database.types.ts
```

```ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export const supabase = createClient<Database>(url, anonKey);

// Narrow to the columns you actually render. PostgREST returns
// only these bytes; types follow.
const { data, error } = await supabase
  .from("posts")
  .select("id, title, created_at, author:users(id, display_name)")
  .eq("published", true)
  .order("created_at", { ascending: false })
  .limit(20);

// data is fully typed:
//   { id: string; title: string; created_at: string;
//     author: { id: string; display_name: string } | null }[] | null
```

Tips:

- Treat `database.types.ts` as a build artifact — regenerate in CI; never hand-edit.
- For embeds (`author:users(...)`), the `author` field's nullability depends on whether the FK is `not null`. If you see `T | null` where you expect `T`, fix the FK.
- For single-row queries use `.single()` (errors if 0 or >1 rows) or `.maybeSingle()` (returns `null` if 0). Avoid `data[0]` — it silently passes `[]`.
- `Database['public']['Tables']['posts']['Row']` is the canonical type for a full row; use it instead of redeclaring.

Dart / Swift equivalents:

```dart
// Flutter — supabase_flutter generates types via supabase_codegen package
final posts = await supabase
    .from('posts')
    .select('id, title, author:users(id, display_name)')
    .eq('published', true);
```

```swift
// swift-supabase — typed via Decodable structs
struct Post: Decodable { let id: UUID; let title: String }
let posts: [Post] = try await supabase
  .from("posts")
  .select("id, title")
  .eq("published", true)
  .execute()
  .value
```

References:
- https://supabase.com/docs/guides/api/rest/generating-types
- https://supabase.com/docs/reference/javascript/select
