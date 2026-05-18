# Agent Memory — Per-Teammate Persistence

Each teammate has a private memory directory at `.claude/agent-memory/<teammate-name>/`. Memory persists across sessions; **not** shared between teammates unless handed off explicitly.

## What to Persist

| Type | Persist? | Example |
|---|:---:|---|
| Decisions made | Yes | "Chose Postgres advisory locks over Redis SETNX — concurrency guarantees" |
| Files owned | Yes | "Owns `src/auth/**`, `api/auth/**`" |
| Investigation findings | Yes | "Webhook signature verified before parsing body — must keep order" |
| Open questions / blockers | Yes | "Waiting on schema migration before implementing endpoint" |
| Code patterns discovered | Maybe | Only if reusable outside this session |
| Raw tool output | No | Re-fetch on next session — output is stale |
| Conversation transcripts | No | Memory is a knowledge base, not a log |
| Ephemeral task state | No | That's what the task list is for |

**Test for persistence**: would this matter in a session two weeks from now? If no, drop it.

## File Conventions

Per-teammate directory layout:

```
.claude/agent-memory/<name>/
├── MEMORY.md           # index — one-line pointers to each memory file
├── decisions.md        # accumulated decisions with rationale
├── owned-files.md      # files this teammate owns (updated when ownership changes)
├── findings/           # investigation notes (one .md per topic)
│   ├── auth-flow.md
│   └── payment-retry.md
└── blockers.md         # open questions / waiting-on items
```

`MEMORY.md` is the index loaded on next session start — keep it under 100 lines.

## Handoff Protocol

When one teammate hands work to another, **never** rely on memory osmosis. Explicit handoff:

1. Outgoing teammate writes a handoff note in the **task** (not in their own memory): files touched, decisions made, gotchas.
2. Lead reads handoff note and assigns task to incoming teammate.
3. Incoming teammate reads handoff note **first**, then their own memory for context, then starts work.

If the receiving teammate needs deeper context, they message the outgoing teammate — don't guess.

## Memory Hygiene

Stale memory is worse than no memory — it sends teammates down dead paths.

- **Update on contradiction**: if a teammate discovers a prior decision is wrong, update the memory and add a `Superseded by:` line. Don't delete history; mark it obsolete.
- **Date-stamp findings**: investigation notes go stale fast. Include `Recorded: YYMMDD` so future-you can judge freshness.
- **Quarterly prune**: every ~10 sessions, review and remove memory that's no longer relevant.

## What Goes in Lead Memory vs Dev Memory

| Lead memory | Dev memory |
|---|---|
| Team-level decisions (ownership map, architecture) | Implementation decisions in owned files |
| Cross-feature dependencies discovered | Feature-specific findings |
| Risk register and waivers | Local gotchas and TODOs |
| User-facing constraints (deadlines, scope) | API contracts owned by this dev |

Lead should **not** duplicate dev-local findings — those live in dev memory.

## Anti-Patterns

- **Memory as scratchpad**: dumping every tool output into memory. Memory is curated knowledge, not a log.
- **Cross-teammate writes**: teammate A writing to teammate B's memory directory. Always go through messaging / task notes.
- **Silent handoffs**: passing work without a handoff note, relying on "they'll figure it out from the code." They won't.
- **Append-only without pruning**: memory grows unbounded; next session start drowns in stale context.

## Recovery from Memory Loss

If a teammate's memory directory is corrupted or deleted:
1. The teammate can still operate — they just start cold.
2. Lead briefs them via task notes for the immediate work.
3. Lost decisions can usually be reconstructed from git history + code comments.
4. Don't try to rebuild memory retroactively — let it accumulate naturally in the new session.
