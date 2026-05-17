---
title: Structure Deno Edge Functions with CORS, JSON, and Secrets
impact: HIGH
impactDescription: Avoids CORS pitfalls, leaked secrets, and cold-start surprises
tags: edge-functions, deno, cors, secrets
---

## Structure Deno Edge Functions with CORS, JSON, and Secrets

Edge Functions run on Deno Deploy at Supabase's edge. Three things bite first-time authors: (1) browsers preflight cross-origin requests and the function must answer `OPTIONS`, (2) `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` are auto-injected — never re-declare them in `.env` files inside the function, (3) imports must be URL-based (npm specifiers or `jsr:` / `https://`), there is no `node_modules`.

**Incorrect (no CORS, secrets via custom env names, sync work blocks):**

```ts
// supabase/functions/send-welcome/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Hard-coded URL? Browser will fail preflight from any other origin.
Deno.serve(async (req) => {
  // No OPTIONS handler -> browsers reject the call before this runs
  const body = await req.json();

  const supabase = createClient(
    Deno.env.get("MY_SUPABASE_URL")!,           // wrong: var doesn't exist
    Deno.env.get("MY_SERVICE_ROLE_KEY")!,       // wrong: re-named
  );

  // Synchronous-ish heavy work; no response shape
  await sendEmail(body.email);
  return new Response("ok");
});
```

**Correct (CORS helper, built-in env, JSON helpers, error envelope):**

```ts
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",  // tighten in prod
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
```

```ts
// supabase/functions/send-welcome/index.ts
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // 1. Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email) return json({ error: "email required" }, 400);

    // Auto-injected env vars — DO NOT add to .env
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { error } = await supabase.from("welcome_log").insert({ email });
    if (error) return json({ error: error.message }, 500);

    return json({ ok: true });
  } catch (err) {
    console.error(err);  // surfaces in `supabase functions logs`
    return json({ error: "unexpected" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
```

Deploy + secrets:

```bash
# Auto-injected (NEVER set manually):
#   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
#   SUPABASE_DB_URL, SB_EXECUTION_ID

# Custom secrets — anything else:
supabase secrets set RESEND_API_KEY=re_xxx SENTRY_DSN=https://...

# List / unset
supabase secrets list
supabase secrets unset RESEND_API_KEY

# Deploy
supabase functions deploy send-welcome
# Local invoke against a running `supabase start` stack:
supabase functions serve send-welcome --env-file ./supabase/.env.local
```

Tips:

- Prefer `jsr:` and `npm:` specifiers over `https://esm.sh/...` — they cache better and are pinned to a registry.
- Cold starts run on every new isolate. Keep top-level imports lean; lazy-load heavy deps inside the handler if only some paths need them.
- Logs are accessible via `supabase functions logs <name>` (CLI) or the Dashboard. `console.error` shows up red, with stack traces.
- A function's max wall time is 400s (paid) / 150s (free) and 256MB RAM. Long jobs → queue + return 202.

References:
- https://supabase.com/docs/guides/functions
- https://supabase.com/docs/guides/functions/secrets
- https://supabase.com/docs/guides/functions/cors
