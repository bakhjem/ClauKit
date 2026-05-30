---
name: supabase
description: Supabase-specific patterns Claude gets wrong — RLS per-operation policies (with check vs using), (select auth.uid()) performance trick, and service_role key security. Use when writing RLS policies, optimizing auth.uid() queries, or deciding which Supabase key to use.
license: MIT
metadata:
  type: knowledge
  category: database/platform
  version: "2.0.0"
  date: 2026-05-29
---

# Supabase

Focused on the 3 patterns Claude consistently gets wrong. Everything else Claude already knows.

## When to Apply

- Writing or reviewing RLS policies (especially `with check` vs `using` per operation)
- Any policy that calls `auth.uid()` — wrap it in `(select auth.uid())`
- Deciding which Supabase key to expose (`anon` vs `service_role`)

## References

| File | Why it matters |
|------|---------------|
| `auth-rls-policies.md` | `with check` vs `using` per-operation — Claude routinely writes `for all` (footgun) or swaps the clauses |
| `security-rls-performance.md` | `(select auth.uid())` pattern — 100x perf gain on large tables; extremely easy to miss |
| `auth-service-role-vs-anon.md` | `NEXT_PUBLIC_SERVICE_ROLE_KEY` anti-pattern — concrete Next.js code Claude commonly pastes incorrectly |

## References

- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/database/postgres/row-level-security
