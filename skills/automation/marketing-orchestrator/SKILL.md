---
name: marketing-orchestrator
description: Multi-MCP marketing orchestrator. Activated by /mk:campaign and Phase 9 (Measure) of the marketing workflow. Coordinates across GA4, GSC, SendGrid/Resend, and ReviewWeb MCP wrappers for full-funnel campaign execution + measurement.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# Marketing Orchestrator

> Multi-MCP coordinator for end-to-end marketing campaigns. Not a single-MCP wrapper — activates multiple wrappers in sequence based on workflow phase.

---

## When this skill activates

- **Implicit:** `/mk:campaign` (full 10-phase marketing workflow) — orchestrator runs the entire pipeline.
- **Implicit:** Phase 9 (Measure) of marketing-workflow.md — pulls metrics from multiple sources.
- **Explicit:** "Orchestrate the marketing campaign" or "Coordinate GA4 + email + reviews for the launch."

## What it does

Coordinates across:

| MCP / Source | Used for | Phase |
|---|---|---|
| `mcp-ga4` | Traffic, conversions, attribution | 9 (Measure) |
| `mcp-gsc` | SEO rankings, indexing, CTR | 9 (Measure) |
| `mcp-sendgrid` / `mcp-resend` | Email campaign execution | 7 (Publish) |
| `mcp-reviewweb` | Review sentiment, competitor comparison | 9 (Measure) |

## Workflow integration

Orchestrator runs the full 10-phase marketing workflow:

```
Phase 0  Setup (verify marketing-context.md)
Phase 1  Research (customer + trends, parallel)
Phase 2  Insights (synthesize)
Phase 3  Strategy (define pillars, channels, metrics)
Phase 4  Plan (assets, owners, deadlines)
Phase 5  Create (copy + visuals + video, parallel)
Phase 6  Edit (copy + SEO + CRO review)
Phase 7  Publish (deploy to channels; uses email MCPs)
Phase 8  Promote (paid + influencer)
Phase 9  Measure (uses GA4 + GSC + ReviewWeb MCPs)
Phase 10 Optimize (decisions → loop to Phase 3)
```

## Decision logic

| Phase | Action | MCP / Skill |
|---|---|---|
| 0 | Check `plans/marketing-context.md` exists | — |
| 1A | Customer interviews + jobs-to-be-done | `customer-research` |
| 1B | Competitor + trend scan | `competitor-profiling`, `marketing-ideas` |
| 2 | Synthesize insights | `content-strategist` agent |
| 3 | Strategy + positioning | `content-strategist` agent |
| 4 | Build execution plan | `planner` agent |
| 5A | Copywriting (parallel) | `copywriting`, `content-strategy` |
| 5B | Visuals (parallel) | `ai-artist`, `video-producer` |
| 6 | Multi-track review | `copy-editing`, `seo-content`, `cro` |
| 7 | Email publish | `mcp-sendgrid` or `mcp-resend` (fallback: templates) |
| 7 | Blog/social publish | manual or `mcp-buffer` (future) |
| 8 | Paid amplification | `ads`, `ad-creative`, MCP ads (future) |
| 9 | Pull metrics | `mcp-ga4` + `mcp-gsc` (fallback: CSV) |
| 9 | Sentiment check | `mcp-reviewweb` (fallback: paste) |
| 10 | Optimize decisions | analysis → loop |

## Output

All artifacts written to `plans/marketing/<campaign-name>/`:
- `README.md` — campaign brief
- `research.md`, `insights.md`, `strategy.md`, `plan.md`
- `content/`, `visuals/`, `video/`
- `emails/`, `ads/`
- `metrics-report.md`, `optimize-decisions.md`

## Coordination rules

1. **Sequential phases** (0-4, 6, 9, 10) — wait for completion before next.
2. **Parallel tracks** (1, 5) — run concurrently, merge at end.
3. **User confirmation** — between each major phase transition.
4. **Idempotency** — re-runs must not duplicate resources.
5. **Privacy** — PII redacted in logs (per `.claude/workflows/automation-rules.md`).

## Cross-references

- `.claude/workflows/marketing-workflow.md` — 10-phase pipeline (source of truth)
- `.claude/workflows/automation-rules.md` — MCP + idempotency + PII rules
- `.claude/workflows/marketing-rules.md` — content quality rules
- All `mcp-*` wrappers — coordinated by this skill
- `agents/marketing/campaign-manager.md` — primary agent persona
- `plans/marketing-context.md` — required input
