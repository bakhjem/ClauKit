# Cook Template — Parallel Implementation

Use the `cook` template when 3+ independent features can be implemented in parallel by separate dev teammates. One **lead** coordinates; N **devs** own implementation.

## When the Cook Template Wins

- Backlog has 3+ features with **disjoint file ownership** (e.g. `auth/`, `notifications/`, `dashboard/`).
- Features share dependencies but those deps are **already stable** (no in-flight churn on shared modules).
- Lead can produce a coherent plan up front (use `--plan-approval` to gate before fanout).

## When to Skip

- Features touch overlapping files (use `[[cook]]` skill sequentially instead).
- Only one feature is ready — single dev + `/ck:cook` beats team setup cost.
- Shared infra still in flux — devs will collide on every commit.

## Roles

| Role | Count | Responsibility |
|---|---|---|
| Lead | 1 | Plan, assign, mediate, consolidate. Does **not** own implementation files if `--delegate`. |
| Dev (teammate) | N (`--devs N`) | Own a feature slice end-to-end: implement + unit-test + self-review. |

## File-Ownership Patterns

Choose one — mixing patterns is a top source of merge conflicts:

1. **By feature folder** — each dev owns `src/<feature>/**`. Best when features are physically isolated.
2. **By layer** — dev A owns `api/`, dev B owns `ui/`, dev C owns `db/`. Best for full-stack work on a single feature.
3. **By file glob** — explicit ownership of named files. Best when refactoring across a tree.

Record ownership in the team's shared task list at spawn time. Conflicts after spawn = lead's mistake.

## Shared Modules

Files that multiple devs need but no one owns (e.g. `utils/types.ts`, `db/schema.ts`):

- **Read-only by default**: devs can read but not edit shared modules.
- **Lead-mediated writes**: if a dev needs a shared-module change, they post a task for the lead. Lead either makes the change or assigns one dev to do it; other devs wait or stub.
- **No silent edits**: a dev editing a shared module without lead approval = merge-conflict generator.

## Lead Modes

| Mode | Lead behavior |
|---|---|
| (default) | Lead plans, assigns, mediates, **and** may pick up loose tasks. |
| `--delegate` | Lead coordinates only — never touches code. Use when lead is sonnet/opus and devs are haiku (cost optimization). |
| `--plan-approval` | Lead pauses after planning; user reviews; only then fanout to devs. Use for high-stakes features. |

## Merge Sequencing

Devs commit independently. Lead consolidates:

1. Each dev pushes to their own branch (or commits to owned files only).
2. Lead reviews diffs in order of risk (lowest-risk first, isolating the riskiest for last).
3. If two devs touched the same file → halt, run conflict-resolution playbook (see `failure-recovery.md`).
4. Lead runs integration tests across all merged work before declaring done.

## Anti-Patterns

- **Lead also implements**: lead's role is coordination — implementing burns their context window and starves coordination cycles. Use `--delegate` if tempted.
- **Devs without owned files**: "pick up any task" leads to two devs touching the same file. Always assign owned files at spawn.
- **No integration test**: each dev passes their own unit tests; nobody runs the combined suite. Lead **must** run integration after merge.
- **Parallel for the sake of it**: 1 dev + sequential cook is faster than 3 devs fighting over a 50-line file.

## Example Spawn

```
/ck:team cook "implement auth + notifications + dashboard" --devs 3 --plan-approval
```

Resulting team:
- `lead` — drafts plan covering all three features and ownership table; pauses for user approval.
- `dev-auth` — owns `src/auth/**` + `api/auth/**`.
- `dev-notifications` — owns `src/notifications/**` + `api/notifications/**`.
- `dev-dashboard` — owns `src/dashboard/**` + `ui/dashboard/**`.
- Shared (`db/schema.ts`, `utils/types.ts`) → lead-mediated.
