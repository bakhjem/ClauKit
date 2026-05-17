---
title: Use Supabase CLI for Local Dev and Migration Workflows
impact: HIGH
impactDescription: Reproducible schema, branch-friendly DB changes, no dashboard drift
tags: cli, migrations, local-dev, schema
---

## Use Supabase CLI for Local Dev and Migration Workflows

Editing schema in the Studio Dashboard creates "drift" — local checkouts and CI don't know about the change. The CLI-driven flow makes schema part of the repo: write SQL migrations, apply them locally, push to remote. `supabase start` runs the full stack (Postgres + GoTrue + PostgREST + Storage + Realtime + Inbucket) in Docker so feature branches can iterate without touching production.

**Incorrect (edit live DB via Dashboard, no migration files):**

```bash
# Developer A clicks "New table" in the Dashboard.
# Developer B pulls main — schema is gone from their local DB.
# CI runs tests against a stale fixture. Production drifts further.

# When someone finally runs `db diff`, they get a 500-line migration
# that's impossible to review or revert.
```

**Correct (link, write migrations, push):**

```bash
# One-time setup
supabase init                          # creates supabase/ folder
supabase link --project-ref <ref>      # binds repo to remote project
supabase start                         # boots local stack on :54321

# Day-to-day: write SQL migrations
supabase migration new add_posts_table
# → creates supabase/migrations/20260516120000_add_posts_table.sql
```

```sql
-- supabase/migrations/20260516120000_add_posts_table.sql
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  body        text,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy posts_read_own on public.posts
  for select to authenticated
  using (author_id = (select auth.uid()));

create index posts_author_created_idx on public.posts (author_id, created_at desc);
```

```bash
# Apply locally
supabase db reset                      # nukes + replays all migrations
# or non-destructive:
supabase migration up

# Generate types after schema change
supabase gen types typescript --local > src/types/database.types.ts

# Capture changes made via Studio UI back into a migration file
supabase db diff -f some_change

# Push to remote (prompts for confirmation)
supabase db push

# Pull remote schema if someone bypassed migrations
supabase db pull
```

Project layout:

```
supabase/
├── config.toml                # local stack ports, auth providers, etc.
├── migrations/
│   ├── 20260516120000_add_posts_table.sql
│   └── 20260516153000_add_rls_policies.sql
├── seed.sql                   # ran after migrations on `db reset`
└── functions/
    └── send-welcome/index.ts
```

CI tips:

- Pin the CLI version in CI (`supabase --version` >= the one developers use). The `supabase/setup-cli` GitHub Action is canonical.
- Run `supabase db lint` + a `supabase db reset` against a throwaway DB on every PR — catches forgotten policies, missing FKs.
- For staging/preview branches, use **Supabase Branching**: each Git branch gets its own ephemeral Postgres. Configure once in the Dashboard; `supabase db push` from CI targets the branch automatically.

Common pitfalls:

- **Hand-editing old migration timestamps** breaks idempotency on machines that already ran them. Always add a NEW migration.
- **`db push` after manual Dashboard changes**: it will refuse if remote has unknown migrations. Run `supabase db pull` first to capture them.
- **Seed data in migrations**: don't. Keep migrations schema-only; put data in `seed.sql` (local) or a separate idempotent script (prod).

References:
- https://supabase.com/docs/guides/local-development
- https://supabase.com/docs/reference/cli/supabase-migration-new
- https://supabase.com/docs/guides/deployment/branching
