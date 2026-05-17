---
title: Use Custom JWT Claims for Role-Based Access Control
impact: HIGH
impactDescription: One JWT read replaces a per-request DB lookup for roles
tags: auth, jwt, claims, rbac, hooks
---

## Use Custom JWT Claims for Role-Based Access Control

Embedding role/tenant info in the JWT lets RLS policies branch on it via `auth.jwt()` without joining a `members` or `roles` table on every query. Supabase supports this through **Auth Hooks** (the `custom_access_token_hook`), which run a `security definer` Postgres function on every token mint/refresh.

**Incorrect (join a roles table inside every policy):**

```sql
-- Every SELECT on `documents` now triggers a subquery against
-- `user_roles` for the row's tenant. Adds latency and prevents
-- index-only scans on `documents`.
create policy documents_admin_read on documents
  for select
  to authenticated
  using (
    exists (
      select 1 from user_roles
      where user_id = (select auth.uid())
        and tenant_id = documents.tenant_id
        and role = 'admin'
    )
  );
```

**Correct (claim set once at token mint, read cheaply in policies):**

```sql
-- 1. Hook function — runs when Auth GoTrue mints/refreshes a token
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  claims jsonb;
  user_role text;
begin
  select role into user_role
  from public.user_roles
  where user_id = (event->>'user_id')::uuid
  limit 1;

  claims := event->'claims';
  if user_role is not null then
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  else
    claims := jsonb_set(claims, '{user_role}', '"member"');
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

-- 2. Register the hook in Supabase Dashboard:
--    Authentication → Hooks → Custom Access Token → public.custom_access_token_hook

-- 3. Use the claim in RLS — no joins
create policy documents_admin_read on documents
  for select
  to authenticated
  using (
    (auth.jwt() ->> 'user_role') = 'admin'
    or author_id = (select auth.uid())
  );
```

Client-side (claims are also visible to the app):

```ts
const { data: { session } } = await supabase.auth.getSession();
const role = session?.user.app_metadata?.user_role
          ?? (session?.access_token && parseJwt(session.access_token).user_role);
```

Caveats:

- Claims are **stale until the next token refresh** (default 1h). For role changes that must apply instantly, also revoke the session: `supabase.auth.admin.signOut(userId, 'others')`.
- Keep claims small — every request carries the JWT. Don't shove arrays of permissions in; store a single role string and check in policies.
- `app_metadata` is server-controlled (safe for roles). `user_metadata` is user-editable — never read it in RLS.

References:
- https://supabase.com/docs/guides/auth/auth-hooks
- https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook
