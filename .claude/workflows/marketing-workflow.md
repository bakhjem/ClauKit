# Marketing Workflow (10-phase)

End-to-end marketing campaign pipeline. Linear with 1 parallel track + 1 optimize loop.

**Trigger:** `/mk:campaign <campaign-name>`
**Agent:** `campaign-manager`
**Required input:** `plans/marketing-context.md`
**Output dir:** `plans/marketing/<campaign-name>/`

---

## Phase 0 — Setup (one-time, gate)

Verify `plans/marketing-context.md` exists. If absent → hard-fail, direct to `/mk:plan`.
Initialize `plans/marketing/<campaign-name>/` with `README.md` (campaign brief).

## Phase 1 — Research (parallel)

**Track A:** Customer research (interviews, surveys, jobs-to-be-done). Skills: `customer-research`, `market-researcher` agent.
**Track B:** Trends (industry reports, competitor moves, viral content). Skills: `competitor-profiling`, `marketing-ideas`.
*Output:* `research.md` (synthesized findings, ~3-5 key insights).

## Phase 2 — Insights

Synthesize research into 3-5 actionable insights. Each insight: (1) observation, (2) implication, (3) falsifiability check.
*Output:* `insights.md` (5 insights max).

## Phase 3 — Strategy

Define content pillars, channel mix, key messages, success metrics. Aligned with `marketing-context.md` goals.
*Output:* `strategy.md` (1-pager, ≤500 words).

## Phase 4 — Plan

Build execution plan: assets needed, owners (agent/skills), deadlines, dependencies.
*Output:* `plan.md` (table form: asset, channel, owner, due, depends-on).

## Phase 5 — Create (parallel)

**Track A:** Copy (blog, social, email, ads). Skills: `copywriting`, `copy-editing`, `content-strategy`.
**Track B:** Visuals (images, video, infographics). Skills: `ai-artist`, `ai-multimodal`, `video-producer`.
*Output:* `content/`, `visuals/`, `video/` directories.

## Phase 6 — Edit

Three parallel review tracks:
- **Copy review** — brand voice, clarity, concision. Skill: `copy-editing`.
- **SEO check** — E-E-A-T, keywords, schema. Skills: `seo-content`, `seo-schema`.
- **CRO check** — value prop, CTA, friction. Skills: `cro`, `signup`.
*Output:* edits applied, `edits-log.md` summary.

## Phase 7 — Publish

Deploy to channels. Use automation (MCP wrappers) where possible:
- Blog/website → CMS (manual or MCP)
- Email → `mcp-sendgrid` or `mcp-resend` (with manual fallback)
- Social → Buffer/Hootsuite (manual or MCP)
*Output:* `published-log.md` (URLs, timestamps, per asset).

## Phase 8 — Promote

Paid + influencer amplification:
- Paid ads (Google, Meta, LinkedIn). Skills: `ads`, `ad-creative`.
- Influencer outreach. Skills: `cold-email`, `marketing-ideas`.
- Community engagement (Reddit, Twitter, LinkedIn, niche forums). Skills: `social-content`.
*Output:* `promotion-log.md` (channels, spend, reach).

## Phase 9 — Measure

Pull metrics. Use MCP wrappers (`mcp-ga4`, `mcp-gsc`) with manual fallback (CSV export).
- Traffic, conversions, CTR, engagement, signups, revenue.
*Output:* `metrics-report.md` (vs targets from Phase 3).

## Phase 10 — Optimize (loop)

Analyze results. Identify 1-2 biggest wins/losses. Feed back to Phase 3 (Strategy) for next iteration.
- Win: scale, document, replicate.
- Loss: diagnose, iterate, or kill.
*Output:* `optimize-decisions.md` (3-5 actions for next cycle).

---

**Note:** Phases 1 (Research) + 1b (Trends) run in parallel to save time. Phase 10 loops back to Phase 3 — marketing is iterative, not linear.

**Conventions:** Each phase output is a markdown file in the campaign dir. Phase 9 metrics + Phase 10 decisions are the only required artifacts for retrospective.
