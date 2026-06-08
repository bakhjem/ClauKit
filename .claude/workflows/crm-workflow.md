# CRM Workflow (5-phase)

Customer relationship automation. Linear.

**Trigger:** `/mk:nurture <lead-stage>`
**Agent:** `crm-specialist`
**Required input:** `plans/marketing-context.md`
**Output dir:** `plans/marketing/<campaign-name>/nurture/`
**Orchestration:** This workflow is typically invoked by `/mk:campaign` (which resolves `<campaign-name>`). When run standalone, Phase 0 prompts for `<campaign-name>`.

---

## Phase 0 — Setup (gate)

Verify `plans/marketing-context.md` exists. If absent → hard-fail, direct to `/mk:plan`.
If `<campaign-name>` not passed by orchestrator → prompt: "Campaign name? (used for output dir)".
Confirm with user before each phase transition.

## Phase 1 — Calendar

Schedule meetings, follow-ups, re-engagement touchpoints.
MCP calendar wrapper not yet available. **Manual mode:** generate `schedule.json` template → user imports into calendar manually.
*Output:* `schedule.json` (lead-id, event, datetime, channel).

## Phase 2 — Forms

Capture leads via forms (Typeform, HubSpot, custom). Skills: `signup`, `cro`.
*Output:* `form-config.md` (form fields, validation, post-submit flow).

## Phase 3 — Tasks

Auto-assign tasks to sales/crm-specialist based on lead stage.
*Output:* `task-rules.md` (stage → action mapping).

## Phase 4 — Email (SendGrid/Resend)

Send transactional + nurture emails via MCP wrapper (`mcp-sendgrid` or `mcp-resend`).
Manual fallback: generate templates, ask user to send.
*Output:* `email-templates/<stage>.html`.

## Phase 5 — BigQuery (Data warehouse)

Sync CRM data to BigQuery for analytics + dashboards.
MCP BigQuery server not yet available as a wrapper. **Manual mode:** generate schema SQL + scheduled query templates → user runs in BigQuery console.
*Output:* `bigquery-schema.sql` (table definitions, scheduled queries).

---

**Idempotency:** All actions keyed by `campaign-name + lead-id + stage`. Re-runs are no-ops if action already completed. (See automation-rules R5 — canonical key, no timestamp.)
**Privacy:** PII redacted in logs. Full PII only in CRM — never written to `plans/marketing/`. (automation-rules R4)
**Phase-skip:** Confirm with user before skipping any phase (automation-rules R2).
