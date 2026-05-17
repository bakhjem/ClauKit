---
name: supabase
description: Supabase platform usage — Auth + RLS policies, Client SDK (JS/Dart/Swift), Storage, Realtime, Edge Functions, and migrations via Supabase CLI. Use this skill when integrating Supabase into an app, writing RLS policies, calling supabase-js, handling storage uploads, subscribing to realtime, deploying Edge Functions, or running CLI migrations. Complements `supabase-postgres-best-practices` (which focuses on raw Postgres performance/SQL).
license: MIT
metadata:
  type: knowledge
  category: database/platform
  version: "1.0.0"
  date: 2026-05-16
---

# Supabase Platform

App-layer guidance for building with Supabase. Pairs with `supabase-postgres-best-practices` (Postgres tuning, indexing, schema) — this skill covers the platform pieces *above* SQL: Auth/RLS patterns from the app's point of view, client SDK ergonomics, Storage, Realtime, Edge Functions, and the CLI-driven migration workflow.

## When to Apply

Read these references when:

- Writing or reviewing RLS policies that reference `auth.uid()` / `auth.jwt()`
- Deciding between `anon`, `authenticated`, and `service_role` keys
- Calling Supabase from a client (supabase-js, Flutter, Swift) and want type-safe / error-safe patterns
- Designing Storage buckets and access control
- Subscribing to Realtime channels (postgres_changes, broadcast, presence)
- Writing Edge Functions in Deno that talk to the database under a user's JWT
- Running `supabase` CLI for local dev, `db diff`, `db push`, and policy deployment

## Categories

| Prefix | Category |
|--------|----------|
| `auth-` | Auth + RLS policies (app-layer) |
| `client-` | Client SDK patterns (supabase-js focused, notes for Dart/Swift) |
| `storage-` | Storage buckets, RLS on `storage.objects`, upload patterns |
| `edge-` | Edge Functions (Deno runtime) |
| `migration-` | Supabase CLI, local dev, schema/policy deployment |

## How to Use

Each reference in `references/` follows the format:

- Frontmatter: `title`, `impact`, `impactDescription`, `tags`
- A 1–2 sentence "why it matters"
- **Incorrect** example showing the common mistake
- **Correct** example with explanation
- Links to official docs

For Postgres-internal concerns (indexes, EXPLAIN, vacuum, connection pooling, RLS *performance* like wrapping `auth.uid()` in `(select auth.uid())`), see the sibling skill `supabase-postgres-best-practices`.

## References

- https://supabase.com/docs
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/reference/javascript
- https://supabase.com/docs/guides/storage
- https://supabase.com/docs/guides/realtime
- https://supabase.com/docs/guides/functions
- https://supabase.com/docs/guides/local-development
