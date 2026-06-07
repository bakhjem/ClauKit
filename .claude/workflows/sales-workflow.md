# Sales Workflow (5-phase)

Lead generation → conversion pipeline. Linear.

**Trigger:** `/mk:leads <icp-description>`
**Agents:** `email-specialist`, `crm-specialist`
**Required input:** `plans/marketing-context.md`
**Output dir:** `plans/marketing/<campaign>/`

---

## Phase 1 — Generate

Cold outreach to ICP. Skills: `cold-email`, `prospecting`, `email-specialist`.
*Output:* outreach list (`leads-raw.csv` — PII-redacted per automation-rules.md).

## Phase 2 — Qualify

Lead scoring (ICP fit, intent signals, engagement). Skills: `customer-research`, `market-researcher` agent.
*Output:* `leads-qualified.csv` (with score, tier).

## Phase 3 — Nurture

Drip sequences by tier. Skills: `email-sequence`, `user-onboarding`, `email-specialist` agent.
*Output:* `nurture-sequences/<tier>.md` (3-7 emails per tier).

## Phase 4 — Convert

Sales handoff + conversion assets. Skills: `signup`, `cro`, `paywalls`.
*Output:* `conversion-assets/` (case studies, demos, pricing one-pagers).

## Phase 5 — Retain

Customer success + lifecycle. Skills: `customer-research`, `crm-specialist`, `user-onboarding`.
*Output:* `retention-plan.md` (onboarding, expansion, re-engagement).

---

**Idempotency:** Re-running must not duplicate outreach (use idempotency keys: lead-id + campaign-name + step).
**Privacy:** All output CSVs PII-redacted. Full PII only in CRM (not committed to repo).
