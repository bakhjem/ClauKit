# Quality Patterns (ClauKit orchestration form)

Five patterns borrowed from Claude Code's dynamic-workflow feature, expressed as **ClauKit fan-out/pipeline over the Agent tool** — never native JS `agent()/parallel()/pipeline()`. The orchestrator runs the loop in the main session; each ▸ is one Agent-tool call to a persona via `subagent_type`.

These are the *real value-add* over "just more agents": they make a run repeatably trustworthy, not just bigger.

## 1. Adversarial verify

Filters plausible-but-wrong findings before they reach the report.

```
for each finding F from a finder stage:
  ▸ spawn N independent skeptic Agents (same persona, fresh context)
      prompt: "Try to REFUTE this finding: <F>. Default refuted=true if uncertain."
  collect verdicts → if majority refute → DROP F (log it for inspect)
                      else              → CONFIRM F
```

- Skeptics must be **independent** (no shared context, no seeing each other's verdict).
- "Default refuted if unsure" biases toward dropping weak findings — confirmed-only report.
- Skeptics may run a **cheaper model** (budget axis) — they only judge, not generate.
- Log dropped findings so the user can inspect false-negative risk.

## 2. Judge panel

For open-ended design/plan tasks where the solution space is wide.

```
▸ spawn N attempt Agents, each a DIFFERENT angle
    (e.g. MVP-first · risk-first · user-first)
▸ spawn judge Agent(s): score each attempt on stated criteria
synthesize: take the winner, graft best ideas from runners-up
```

Beats one-attempt-iterated because independent angles explore corners a single chain never visits.

## 3. Loop-until-dry

For unknown-size discovery (bugs, dead code, edge cases) where a single pass misses the tail.

```
seen = {}; dryRounds = 0
while dryRounds < K:                       # K = consecutive empty rounds, e.g. 2
  ▸ run finder stage (may be a fan-out)
  fresh = results not in seen
  if fresh is empty: dryRounds += 1; continue
  dryRounds = 0; add fresh to seen
  (optionally) ▸ verify fresh via adversarial verify
```

- Dedup against **everything seen** (not just confirmed) — else rejected findings reappear and it never converges.
- The orchestrator holds `seen` + `dryRounds` in main-session context (the plan lives here, not in background JS).

## 4. Multi-modal sweep

When one search angle won't find everything — each agent is blind to what the others surface.

```
▸ Agent A: search by-container (dirs, modules)
▸ Agent B: search by-content  (grep patterns, strings)
▸ Agent C: search by-entity   (symbols, types, routes)
merge + dedup → union coverage
```

Run in parallel (fan-out). Useful for audits where coverage matters more than any single method.

## 5. Completeness critic

The final guard against "looks done."

```
▸ critic Agent: "What's missing? — a modality not run, a claim unverified,
                  a source unread, a dimension not covered?"
critic's findings → become the next round of work (feeds back to finders)
```

Pair with loop-until-dry for exhaustive coverage.

## Composing patterns

Real flows chain these. Example — **exhaustive review**:

```
loop-until-dry {
  multi-modal sweep (finders)         # broad coverage
    → dedup vs seen                   # plain orchestrator logic, not an agent
    → adversarial verify (per fresh finding, diverse lenses)
}
→ completeness critic (one final pass)
→ orchestrator synthesizes confirmed-only report
```

**Diverse-lens verify**: when a finding can fail in more than one way, give each skeptic a distinct lens (correctness / security / reproducibility) instead of N identical refuters — diversity catches failure modes redundancy can't.

## No silent caps

If a flow bounds coverage (top-N findings, no-retry, sampling), the orchestrator must **state what was dropped** in the report. Silent truncation reads as "covered everything" when it didn't — the opposite of the trust these patterns buy.
