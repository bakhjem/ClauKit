---
title: Test RLS Policies Before Deploying — pgtap or Anonymous Sessions
impact: CRITICAL
impactDescription: Catches policy regressions before they reach prod
tags: rls, testing, migrations, pgtap, deployment
---

## Test RLS Policies Before Deploying — pgtap or Anonymous Sessions

RLS bugs are often silent: a policy that *over-permits* still returns "correct-looking" data, and a policy that *over-restricts* shows empty arrays where there should be rows. Both pass eyeball checks. Unit-test policies with `pgtap` (runs as a real Postgres role) or with `supabase-js` against a local instance using actual user JWTs. Either way, run the tests in CI before `db push`.

**Incorrect (deploy policy without tests, eyeball in Studio):**

```sql
-- 1. Write a policy that "looks right"
create policy notes_team on notes
  for select to authenticated
  using (
    team_id in (select team_id from team_members
                where user_id = (select auth.uid()))
  );

-- 2. Open Studio as user A, see rows, ship it.
-- 3. User B (not in team) ALSO sees rows because team_members
--    has its own RLS that's permissive. The subquery returns
--    other teams' ids when running as B.
```

**Correct (pgtap test in `supabase/tests/`):**

```sql
-- supabase/tests/policies/notes_test.sql
begin;
select plan(4);

-- Helper: set the JWT-derived role + uid the way Supabase does
create or replace function tests.authenticate(uuid)
returns void language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
                     json_build_object('sub', $1, 'role', 'authenticated')::text,
                     true);
end $$;

-- Fixtures
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'a@test'),
  ('22222222-2222-2222-2222-222222222222', 'b@test');
insert into teams (id, name) values ('aaaa', 'A');
insert into team_members (team_id, user_id) values
  ('aaaa', '11111111-1111-1111-1111-111111111111');
insert into notes (id, team_id, body) values
  (1, 'aaaa', 'team A note');

-- Member of team A sees the note
select tests.authenticate('11111111-1111-1111-1111-111111111111');
select results_eq(
  $$ select count(*)::int from notes $$,
  $$ values (1) $$,
  'member of team sees note'
);

-- Non-member sees zero
select tests.authenticate('22222222-2222-2222-2222-222222222222');
select results_eq(
  $$ select count(*)::int from notes $$,
  $$ values (0) $$,
  'non-member sees nothing'
);

-- Non-member cannot insert into another team
select throws_ok(
  $$ insert into notes (team_id, body) values ('aaaa', 'sneaky') $$,
  '42501',
  'non-member insert is denied by RLS'
);

-- Anon role sees nothing
reset role;
set role anon;
select is_empty($$ select * from notes $$, 'anon sees nothing');

select * from finish();
rollback;
```

```bash
# Run all pgtap tests against the local stack
supabase test db
```

Alternative: end-to-end test with real JWTs (faster to write, slower to run):

```ts
// tests/rls.spec.ts — run against `supabase start`
import { createClient } from "@supabase/supabase-js";

const url = "http://127.0.0.1:54321";
const anon = "<local-anon-key>";

async function asUser(email: string) {
  const c = createClient(url, anon);
  await c.auth.signInWithPassword({ email, password: "test1234" });
  return c;
}

test("non-member cannot read team's notes", async () => {
  const b = await asUser("b@test.com");
  const { data } = await b.from("notes").select("*");
  expect(data).toEqual([]);
});

test("non-member insert is denied", async () => {
  const b = await asUser("b@test.com");
  const { error } = await b.from("notes").insert({ team_id: "aaaa", body: "x" });
  expect(error?.code).toBe("42501");
});
```

CI wiring:

```yaml
# .github/workflows/db.yml
- uses: supabase/setup-cli@v1
- run: supabase start
- run: supabase db reset           # apply migrations + seed
- run: supabase test db            # pgtap suite
- run: npm test                    # SDK-level tests
- if: success() && github.ref == 'refs/heads/main'
  run: supabase db push --linked
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    SUPABASE_DB_PASSWORD: ${{ secrets.SUPABASE_DB_PASSWORD }}
```

Checklist before pushing an RLS migration:

1. Every newly RLS-enabled table has at least one `select` policy AND a `with check` on writes (or it's read-only by design).
2. Tests cover: owner reads ✓, non-owner reads ✗, owner writes ✓, non-owner writes ✗, anon reads ✗.
3. Policy uses `(select auth.uid())`, not bare `auth.uid()`, when scanned tables are large.
4. No policy depends on `user_metadata` (user-editable). Use `app_metadata` or a JOIN to a server-controlled table.

References:
- https://supabase.com/docs/guides/local-development/testing/pgtap-extended
- https://pgtap.org/documentation.html
