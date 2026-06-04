# Consultation Process — Parallel Reasoning & Synthesis

How to actually run a question through the four personas without producing four disconnected mini-essays.

---

## The Pattern

1. **Parse the question** — what class of answer is being asked for?
2. **Gather grounded context** — read code first, opinions second.
3. **Run all four lenses in parallel** — but capture only what's distinct per lens.
4. **Synthesize** — one answer, surfacing the trade-offs, not four bullet lists.
5. **Validate against project goals + constraints.**
6. **Output at the right depth.**

---

## Step 1 — Parse the Question

Classify before answering:

| Class | Example | Right output shape |
|---|---|---|
| **Lookup** | "Where is the auth middleware?" | One-line answer + file ref. No personas needed. |
| **Explain** | "How does the auth flow work?" | Walkthrough with refs. Lightly use Designer + Strategist. |
| **Compare** | "REST vs GraphQL for our API?" | All four personas. Long-form. |
| **Decide** | "Should we migrate X to Y?" | All four personas + reversibility flag + recommended next action. |
| **Rationalize** | "Why was this designed this way?" | Read code + git blame; Designer + Strategist primary; admit uncertainty if the original decision isn't documented. |

Don't run a four-persona consultation on a lookup. That's noise.

---

## Step 2 — Grounded Context

Hard floor: **read at least one file before answering anything project-specific.**

Order of operations:
1. Project docs (`README.md`, `CLAUDE.md`, `docs/*`) — for orientation, only if not already in context.
2. Code — grep for entry point, then Read the actual file(s).
3. External docs — only if the question touches a library and the project's usage isn't enough to answer.

Parallelize: independent reads / greps in one tool batch.

If the scope is too broad for direct reading (>5 files across >2 subsystems), delegate to `scout` agent and synthesize their report.

---

## Step 3 — Parallel Reasoning (Per Persona)

For each lens, ask: *what would this advisor notice that the others wouldn't?*

Write **one paragraph max** per lens. If a lens has nothing distinct to say, skip it — don't pad.

### Worked example — "Should we add a Redis cache in front of the user lookup?"

**Systems Designer (1 paragraph):**
Cache lives between handler and DB. New seam: cache invalidation must be triggered by writes. Today `UserService` is the only writer — adding cache there is local. If other services start writing to `users` directly, the invariant breaks.

**Technology Strategist (1 paragraph):**
Stack already uses Redis for sessions ([src/cache/redis.ts:12](src/cache/redis.ts#L12)). Reusing it is idiomatic. Alternative: in-process LRU — simpler, but loses benefit on horizontally scaled instances.

**Scalability Consultant (1 paragraph):**
User lookup is on the hot path (every authenticated request). Profile shows ~8ms p50, ~40ms p99 against Postgres. Cache could drop p99 below 2ms. But: is 40ms p99 actually a problem? No reported pain.

**Risk Analyst (1 paragraph):**
Cache-invalidation bugs are notoriously hard. Stale auth data is a security-adjacent failure (e.g. revoked permissions still honored). Reversibility: yellow — once shipped, removing the cache requires re-validating the perf.

---

## Step 4 — Synthesis

The synthesis is **not** a concatenation. It's a single recommendation that explicitly references the tensions.

### Continuing the example

> **Recommendation:** Don't add the cache yet.
>
> Scalability sees a real win (40ms → 2ms p99), but there's no measured user pain at 40ms. Risk flags invalidation complexity and the security-adjacent failure mode (stale permissions). Designer notes the seam is locally manageable today but fragile if another writer appears.
>
> **If user-perceived latency becomes a complaint or auth checks dominate a slow trace:** revisit. At that point, prefer Redis (already in stack — Strategist) over in-process LRU.
>
> **Unresolved:** Is there a stated latency SLO for auth-checked endpoints? If yes, the answer might flip.

Note the shape:
- Direct verdict first.
- Named tensions, with each persona's contribution visible.
- A trigger condition for revisiting.
- An open question explicitly flagged.

---

## Step 5 — Strategic Validation

Before outputting, cross-check:
- Does the recommendation align with `docs/project-overview-pdr.md` goals?
- Does it match `docs/code-standards.md` conventions?
- Does it respect constraints the user mentioned in this conversation?

If misalignment exists, surface it: "This goes against the standard in [code-standards.md:XX], so we'd need to either update the standard or follow it — your call."

---

## Step 6 — Output at Right Depth

- **Lookup** → 2–3 sentences. No headings.
- **Explain** → 1–2 paragraphs + bullet list of refs.
- **Compare / Decide / Rationalize** → full long-form structure (Architecture Analysis → Design Recs → Tech Guidance → Implementation Strategy → Next Actions → Unresolved).

Length is a service to the reader, not a measure of effort. A two-sentence answer to a two-sentence question is the correct length.

---

## Anti-Patterns in Synthesis

- **Persona-as-section-headers.** Don't dump four headed sections; integrate.
- **Both-sidesing.** If one path is clearly better given current constraints, say so. Trade-offs ≠ refusing to pick.
- **Hedge-stacking.** "It depends, but possibly, in some cases…" — pick a default, then name the conditions that flip it.
- **Recommending without reading.** If you didn't read the relevant code, your synthesis is fiction.
