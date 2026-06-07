# CRM Workflow (5-phase)

Customer relationship automation. Linear.

**Trigger:** `/mk:nurture <lead-stage>`
**Agent:** `crm-specialist`
**Required input:** `plans/marketing-context.md`
**Output dir:** `plans/marketing/<campaign>/nurture/`

---

## Phase 1 — Calendar

Schedule meetings, follow-ups, re-engagement touchpoints. Use MCP calendar tool if available.
*Output:* `schedule.json` (lead-id, event, datetime, channel).

## Phase 2 — Forms

Capture leads via forms (Typeform, HubSpot, custom). Skills: `signup`, `cro`.
*Output:* `form-config.md` (form fields, validation, post-submit flow).

## Phase 3 — Tasks

Auto-assign tasks to sales/crm-specialist based on lead stage.
*Output:* `task-rules.md` (stage → action mapping).

## Phase 4 — Email (Gmail/SendGrid/Resend)

Send transactional + nurture emails via MCP wrapper (`mcp-sendgrid` or `mcp-resend`).
Manual fallback: generate templates, ask user to send.
*Output:* `email-templates/<stage>.html`.

## Phase 5 — BigQuery (Data warehouse)

Sync CRM data to BigQuery for analytics + dashboards. Use MCP BigQuery server if available.
*Output:* `bigquery-schema.sql` (table definitions, scheduled queries).

---

**Idempotency:** All actions keyed by lead-id + stage. Re-runs are no-ops if action already completed.
**Privacy:** PII redacted in logs. Full PII only in CRM.
