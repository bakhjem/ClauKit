---
name: plans-kanban
description: Apply Kanban methodology to the plans/ folder — surface what's in progress, what's blocked, and what's next, using folder structure and frontmatter rather than external boards.
category: Project Tracking
status: active
---

# Plans Kanban

## Purpose

Treat the `plans/` directory as a Kanban board. Each plan is a card; its **state** (backlog, in-progress, review, done, archived) is the folder it lives in or a frontmatter field. No external tool required.

Distinct from `[[planning]]` (writing plans) and `[[project-management]]`-style agents (coordinating teams). This skill is purely about *organizing* plan files so the team can see flow.

## When to Use

- `plans/` has grown past ~10 plans and the latest-modified date is no longer a useful sort
- Multiple plans are in flight; need to see at-a-glance what's stalled
- Onboarding: new contributor asks "what's actively being built right now?"
- Want WIP limits (work-in-progress caps) without buying a Jira seat

Activation phrases: *"organize plans/ folder"*, *"what's in progress / blocked?"*, *"plan board"*, *"kanban for plans/"*

## Folder Layout

```
plans/
├── 00-backlog/        # not started; rough scope
├── 10-in-progress/    # actively being implemented
├── 20-review/         # implementation done, awaiting review
├── 30-done/           # merged, verified
└── 90-archived/       # cancelled or deferred plans
```

Numeric prefix keeps the states in flow order when listing alphabetically. Plans are moved between folders with `git mv`, preserving history.

## Frontmatter Schema

Every `plan.md` carries:

```yaml
---
title: <short name>
status: backlog | in-progress | review | done | archived
owner: @username
created: YYYY-MM-DD
updated: YYYY-MM-DD
blocked_by: [<plan-name>, <plan-name>]    # optional
unblocks: [<plan-name>]                    # optional
target_completion: YYYY-MM-DD              # optional
---
```

`status` mirrors the folder; the duplication is intentional — if they disagree, something moved without updating, and the bash queries below flag it.

## Workflow

1. **New plan** → create in `00-backlog/`; write frontmatter; commit.
2. **Start work** → `git mv` to `10-in-progress/`; update `status`, set `updated`. WIP limit: 3 plans per owner in `10-in-progress/`.
3. **Implementation done** → `git mv` to `20-review/`; assign reviewer in PR.
4. **Approved / merged** → `git mv` to `30-done/`; update `updated`.
5. **Cancelled** → `git mv` to `90-archived/`; add a `cancelled_reason:` field.
6. **Blocked** → stay in current folder; populate `blocked_by:`; surface via query.

## Query Helpers

Folder-only design works because the queries are one-liners. Save these as bash scripts in `scripts/plans/`:

```bash
# in-progress plans
ls plans/10-in-progress/

# blocked plans
grep -lR '^blocked_by: \[.\+\]' plans/10-in-progress/

# WIP limit per owner
grep -lR '^owner:' plans/10-in-progress/ | xargs grep -h '^owner:' | sort | uniq -c

# critical path (plans that unblock the most others)
grep -lR '^unblocks:' plans/ | xargs grep -h '^unblocks:' | sort | uniq -c | sort -nr | head
```

## Future Enhancement

A git `post-commit` hook could enforce status↔folder consistency and warn when a plan stays in `10-in-progress/` for >14 days. Out of scope for this skill — flag if the manual workflow drifts.

## Anti-Patterns

- **Skipping the move**: plan implementation merges but `plan.md` still says `in-progress`. Fix: include the `git mv` in the PR that closes the plan.
- **No WIP limit**: backlog → in-progress floods, nothing finishes. Enforce a per-owner cap (3 is a reasonable default).
- **Archive amnesia**: cancelled plans deleted instead of archived. Keep them — they document what was tried and why it stopped.

## References

See `references/`:
- `kanban-guide-scrum-teams.md` — core Kanban principles for software teams
- `lean-software-flow.md` — WIP limits and flow optimization
- `git-as-task-tracker.md` — using git history as the audit log

## Cross-links

`[[planning]]`, `[[orchestrate]]`, `[[journal]]`, `[[retro]]`
