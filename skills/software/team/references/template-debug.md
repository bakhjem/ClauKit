# Debug Template — Competing Hypotheses

Use when a bug's root cause is ambiguous and multiple plausible explanations exist. Spawn N debuggers, give each a distinct hypothesis, evaluate head-to-head.

## When the Debug Template Wins

- Symptom is **reproducible** but cause is unknown — needs investigation, not a known-fix.
- 2-4 plausible root causes exist (e.g. race condition vs. stale cache vs. retry logic).
- Single-investigator path-dependence is the risk: one debugger chases the wrong lead and burns context.
- Bug is high-stakes (payment flow, data loss) — wrong fix is worse than slow fix.

## When to Skip

- Cause is already known — just fix it (`/ck:fix`).
- Symptom isn't reproducible — competing hypotheses are unfalsifiable; gather more telemetry first.
- Only one hypothesis is plausible — single debugger is enough.

## The 4 Phases

### Phase 1 — Assign

Lead drafts N hypotheses (one per debugger). Each hypothesis is:
- **Falsifiable**: there's a concrete experiment that would disprove it.
- **Distinct**: not a subset of another hypothesis.
- **Scoped**: investigation budget defined (files to read, tests to run).

Example for "race condition in payment flow":
- H1 — webhook handler re-enters before DB transaction commits (concurrency)
- H2 — Redis cache holds stale order status across retries (caching)
- H3 — third-party callback retries while our retry loop is still pending (external)

Each debugger gets one hypothesis + investigation budget.

### Phase 2 — Investigate (parallel)

Each debugger independently:
1. Reads relevant code paths.
2. Runs targeted tests / reproductions.
3. Gathers evidence **for** their hypothesis.
4. **Critically**: also tries to **disprove** their own hypothesis.

No cross-talk yet — independence prevents groupthink.

### Phase 3 — Score

Each debugger posts a report card:
- Confidence (0-100%): how strongly evidence supports their hypothesis.
- Disconfirming evidence: what would rule it out (if anything emerged).
- Key files / lines that matter.

Lead tabulates. Two outcomes:
- **One hypothesis dominates** (≥70% confidence, others <30%) → converge, draft fix.
- **No clear winner** → go to Phase 4.

### Phase 4 — Converge

If no clear winner, lead chooses one of:
- **Cross-investigate** — each debugger reviews the others' evidence; report back if their confidence shifts.
- **Hypothesis merge** — two hypotheses look like they might both be true (e.g. caching + retry); spawn a single debugger to investigate the combined model.
- **Halt and gather** — all hypotheses weak → bug doesn't have enough telemetry; pause, add logging, retry.

## Anti-Patterns

- **Same hypothesis with different words**: "stale cache" vs. "cache invalidation bug" → really one hypothesis. Reject at Phase 1.
- **Confirmation only**: debuggers gather only supporting evidence, never disconfirming. Always require both.
- **Premature consensus**: lead picks a winner before scoring is complete. Discipline matters most when time pressure is high.
- **Hypothesis with no experiment**: "maybe it's flaky infra" with no way to test → not a hypothesis, it's a shrug.

## Example Spawn

```
/ck:team debug "payment webhook returns 500 randomly" --debuggers 3
```

Lead drafts 3 hypotheses, assigns one per debugger, sets 30-min investigation budget, then runs scoring. If H2 (cache) wins → spawn a single dev to fix; if no winner → cross-investigate or gather telemetry.

## Pairing with Fix

After convergence, debug team's job is done. The fix itself is a separate concern:
- Simple fix → lead writes it directly.
- Complex fix → spawn a `cook` template with 1 dev.
- Multiple fixes needed (defense in depth) → spawn `cook` team with N devs, one per fix.
