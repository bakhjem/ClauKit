---
title: Never Ship the service_role Key to a Client
impact: CRITICAL
impactDescription: Prevents full-database compromise via leaked key
tags: auth, service-role, anon, secrets, security
---

## Never Ship the service_role Key to a Client

Supabase issues three keys: `anon` (public, RLS-bound), `authenticated` (role assumed after sign-in, also RLS-bound), and `service_role` (bypasses RLS, full DB access). The `service_role` key must live only in trusted server-side environments — leaking it is equivalent to giving an attacker `postgres` superuser.

**Incorrect (service_role on the client, or in a public env var):**

```ts
// app/lib/supabase.ts — runs in the browser!
import { createClient } from "@supabase/supabase-js";

// NEXT_PUBLIC_* vars are inlined into the JS bundle.
// Anyone can read this in DevTools.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!, // ← LEAKED
);
```

```bash
# .env.local committed to git
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

**Correct (anon on client, service_role only on server / Edge Function):**

```ts
// app/lib/supabase.ts — browser
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // public, RLS-bound
);
```

```ts
// app/lib/supabase-admin.ts — server-only (Node route handler / Edge Function)
import { createClient } from "@supabase/supabase-js";

// Note: no NEXT_PUBLIC_ prefix => not bundled to client
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
```

```ts
// app/api/admin/route.ts — server only
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  // Authorize the caller FIRST with normal auth.
  // Then use admin client for the privileged operation.
  const { data } = await supabaseAdmin.from("users").update(...);
}
```

Rules of thumb:

- `anon` key → browser, mobile apps, public sites. Always paired with RLS.
- `authenticated` is a Postgres role, not a key — it's what `anon` becomes after a successful sign-in. Same key, different `role` claim in the JWT.
- `service_role` → server-side only. Treat it like a database password. Rotate immediately if exposed (Project Settings → API → Reset).
- Even on the server, prefer the user's JWT when possible (creates an audit trail via `auth.uid()`). Reach for `service_role` only for cron jobs, webhooks, or admin endpoints that have *already* authorized the caller through another mechanism.

Reference: https://supabase.com/docs/guides/api/api-keys
