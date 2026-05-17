---
title: Forward the User's JWT into Edge Functions to Preserve RLS
impact: HIGH
impactDescription: Function inherits caller's identity; RLS still applies
tags: edge-functions, auth, jwt, rls
---

## Forward the User's JWT into Edge Functions to Preserve RLS

By default, Edge Functions require a valid JWT (the platform 401s before your code runs). But inside the function, if you create the Supabase client with `SERVICE_ROLE_KEY`, you bypass RLS — every DB call runs as superuser. The correct pattern for "act on behalf of the user" is to pass the caller's `Authorization` header through to a client built with `ANON_KEY`, so policies see `auth.uid()` as the real user.

**Incorrect (service_role inside function, treats every caller as god):**

```ts
Deno.serve(async (req) => {
  // service_role => RLS bypassed. A signed-in user can now read/write
  // ANY row, even if the policy would normally deny it.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { user_id, new_role } = await req.json();
  // Caller could pass any user_id — no permission check.
  await supabase.from("users").update({ role: new_role }).eq("id", user_id);
  return new Response("ok");
});
```

**Correct (forward caller JWT for RLS-bound work; service_role only for explicit admin steps after authorization):**

```ts
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "missing auth" }, 401);

  // Client #1 — acts as the caller. RLS is enforced.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  // Confirm who we are (also verifies the JWT signature)
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return json({ error: "invalid token" }, 401);

  // Now any query runs under that user's RLS
  const { data: me } = await supabase
    .from("users").select("id, role").eq("id", user.id).single();

  // Authorize: only admins can change roles
  if (me?.role !== "admin") return json({ error: "forbidden" }, 403);

  // Privileged step that legitimately needs to bypass RLS,
  // AFTER we've checked permission ourselves:
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { user_id, new_role } = await req.json();
  const { error } = await admin
    .from("users").update({ role: new_role }).eq("id", user_id);
  if (error) return json({ error: error.message }, 500);

  return json({ ok: true });
});
```

Calling from the client:

```ts
// supabase-js automatically attaches the current session's JWT
// to functions.invoke calls.
const { data, error } = await supabase.functions.invoke("change-role", {
  body: { user_id: targetId, new_role: "editor" },
});
```

Public (no-auth) endpoints:

```bash
# Disable the platform's auth gate for webhooks, OAuth callbacks, etc.
supabase functions deploy public-webhook --no-verify-jwt
```

Inside such functions, verify the request yourself (HMAC, shared secret, IP allowlist) — never just trust `req.body`.

Key takeaways:

- **Two clients, two roles.** anon-key client (forwards JWT) for user-scoped work, service-role client *only* after explicit authorization.
- `supabase.auth.getUser()` actually verifies the JWT against GoTrue. Prefer it over decoding the token yourself.
- For webhooks deployed with `--no-verify-jwt`, validate the source (Stripe-Signature, GitHub-Hub-Signature, etc.) before trusting any input.

References:
- https://supabase.com/docs/guides/functions/auth
- https://supabase.com/docs/guides/functions/jwt-secret
