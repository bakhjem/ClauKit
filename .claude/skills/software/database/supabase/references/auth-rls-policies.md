---
title: Write RLS Policies with auth.uid() and Per-Operation Splits
impact: CRITICAL
impactDescription: Database-enforced access control; prevents tenant data leaks
tags: rls, auth, policies, multi-tenant, security
---

## Write RLS Policies with auth.uid() and Per-Operation Splits

Supabase populates `auth.uid()` from the JWT in the `Authorization: Bearer …` header. Every user-reachable table must have RLS enabled and explicit policies — `enable row level security` without policies denies all rows. Prefer one policy per operation (`select`, `insert`, `update`, `delete`) over `for all`: a single broad policy often forces you to weaken `using` to also serve as a `with check`, which silently lets users insert rows they cannot read.

**Incorrect (one broad `for all` policy, plus a write-only that lacks `with check`):**

```sql
alter table posts enable row level security;

-- "for all" forces the same predicate for read AND write.
-- A user can update someone else's post to themselves because
-- the predicate is evaluated on the NEW row, not the old one.
create policy posts_owner on posts
  for all
  to authenticated
  using (author_id = auth.uid());

-- Insert policy with no `with check` => Postgres treats it as
-- a permissive policy that allows any insert that satisfies `using`,
-- which is `true` here. Users can insert posts as someone else.
create policy posts_insert on posts
  for insert
  to authenticated
  using (true);
```

**Correct (separate policies, `with check` on writes, `(select auth.uid())` for performance):**

```sql
alter table posts enable row level security;

-- READ: caller can only see their own posts
create policy posts_select on posts
  for select
  to authenticated
  using (author_id = (select auth.uid()));

-- INSERT: NEW row's author_id must match caller. `using` is N/A for insert.
create policy posts_insert on posts
  for insert
  to authenticated
  with check (author_id = (select auth.uid()));

-- UPDATE: old row owned by caller (`using`) AND new row still owned (`with check`)
create policy posts_update on posts
  for update
  to authenticated
  using      (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

-- DELETE: only `using` applies
create policy posts_delete on posts
  for delete
  to authenticated
  using (author_id = (select auth.uid()));
```

Notes:

- Always wrap `auth.uid()` in `(select auth.uid())`. Postgres caches the subquery result per statement instead of re-calling the function per row. See `security-rls-performance.md` (same `supabase/references/` folder).
- `to authenticated` excludes the `anon` role from these policies — anonymous calls see nothing. Add a separate `to anon` policy only if public access is intentional.
- For multi-tenant designs, replace `author_id = auth.uid()` with a `tenant_id` lookup, typically via a `security definer` helper function that reads the caller's tenant from a `members` table.

Reference: https://supabase.com/docs/guides/database/postgres/row-level-security
