# ClauKit Marketing Kit

> Everything you need to automate your marketing workflow, from campaign planning to community engagement.

## What's included

- **48 marketing skills** (SEO, content, email, ads, CRO, research, growth, etc.)
- **7 marketing agents** (content-strategist, market-researcher, email-specialist, 4 SEO specialists)
- **12 commands** under `/mk:` namespace
- **5 workflow files** (marketing 10-phase, sales 5-phase, crm 5-phase, video 6-phase, design 5-phase)
- **5 MCP wrappers** (ga4, gsc, sendgrid, resend, reviewweb) — with manual fallback
- **6 automation skills** (5 MCP wrappers + marketing-orchestrator)

## Quick start

```bash
# 1. Install marketing kit
ck init --kit marketing

# 2. Setup hub context (one-time, required)
#    Activates: /mk:plan → product-marketing skill
#    Output: plans/marketing-context.md (ICP, positioning, brand voice)
mk:plan

# 3. Run a full campaign
mk:campaign <campaign-name>
```

## Commands

| Command | Purpose | Skills activated |
|---|---|---|
| `/mk:plan` | Create marketing context (ICP, positioning, brand voice) | product-marketing, marketing-plan, marketing-psychology |
| `/mk:seo` | SEO operations (uses claude-seo engine) | claude-seo (25 sub-skills) |
| `/mk:content` | Content creation (blog, social, video, copy) | content-strategy, copywriting, copy-editing, social, video |
| `/mk:email` | Email & messaging (campaign, cold, drip, sms) | emails, cold-email, sms |
| `/mk:ads` | Paid advertising (google, meta, creative, ab-test) | ads, ad-creative, ab-testing |
| `/mk:cro` | Conversion optimization (audit, landing, signup, email) | cro, signup, paywalls, popups |
| `/mk:research` | Market research (market, competitor, customer, icp) | customer-research, competitor-profiling, competitors, marketing-ideas |
| `/mk:growth` | Growth tactics (launch, referral, free-tool) | launch, free-tools, co-marketing, community-marketing |
| `/mk:campaign` | Full marketing campaign pipeline (10-phase) | marketing-orchestrator + all workflow skills |
| `/mk:leads` | Lead generation pipeline (sales 5-phase) | cold-email, prospecting, email-specialist |
| `/mk:nurture` | Lifecycle nurture sequence (crm 5-phase) | crm-specialist, email-specialist, customer-research |
| `/mk:video` | AI video production (video 6-phase) | video-producer, copywriting, ai-artist, remotion |

## Workflows

All in `.claude/workflows/`:

### 1. `marketing-workflow.md` — 10 phases (end-to-end campaign)

```
Phase 0: Setup (one-time) → marketing-context.md
  ↓
Phase 1: Research ─┐
                   ├→ Phase 2: Insights → Phase 3: Strategy
Phase 1b: Trends ─┘                         ↓
                                     Phase 4: Plan
                                           ↓
                          Phase 5: Create (parallel: copy + visual + video)
                                           ↓
                          Phase 6: Edit (copy + SEO + CRO)
                                           ↓
                          Phase 7: Publish
                                           ↓
                          Phase 8: Promote (paid + influencer)
                                           ↓
                          Phase 9: Measure (GA4 + GSC)
                                           ↓
                          Phase 10: Optimize → (loop to Phase 3)
```

### 2. `sales-workflow.md` — 5 phases

```
Generate → Qualify → Nurture → Convert → Retain
```

### 3. `crm-workflow.md` — 5 phases

```
Calendar → Forms → Tasks → Gmail → BigQuery
```

### 4. `video-workflow.md` — 6 phases

```
Script → Voiceover → Visuals → Edit → Render → Distribute
```

### 5. `design-workflow.md` — 5 phases

```
Concept → Model → Shader → Animate → Export
```

## Claude-SEO Engine ⭐

The marketing kit uses `AgriciDaniel/claude-seo` (8.4k stars, 271 tests) as its SEO backbone. This is the production-grade SEO engine that runs **25 sub-skills in parallel** with **18 specialist agents**.

### Architecture (3-layer)

```
User → /mk:seo audit <url>           (Layer 1: Directive)
        ↓
  skills/marketing/seo/SKILL.md     (Layer 2: Orchestrator)
        ↓
  - Industry detection (SaaS, local, ecommerce, publisher, agency)
  - Parallel dispatch (up to 15 sub-skills simultaneously)
  - Synthesis via 10-principle framework (PERCEIVE → ANALYZE → VALIDATE → ACT)
        ↓
  25 sub-skills + 18 agents         (Layer 3: Execution)
        ↓
  Output: plans/<name>/seo-audit-report.md
          (each finding has a falsifiability check)
```

### Available sub-skills (25)

| Category | Sub-skills |
|---|---|
| Audit | `seo-audit`, `seo-page`, `seo-technical` |
| Content | `seo-content` (E-E-A-T), `seo-content-brief`, `seo-cluster` |
| Schema | `seo-schema` |
| Technical | `seo-sitemap`, `seo-images`, `seo-drift` |
| AI Search | `seo-geo` (Generative Engine Optimization) |
| Local | `seo-local`, `seo-maps` |
| Commerce | `seo-ecommerce`, `seo-hreflang` |
| Extensions | `seo-firecrawl`, `seo-dataforseo`, `seo-image-gen`, `seo-google`, `seo-backlinks`, `seo-sxo`, `seo-plan`, `seo-programmatic`, `seo-competitor-pages`, `seo-flow` |

### When to use claude-seo

- **Use claude-seo for:** full-site audit, technical SEO, content quality (E-E-A-T), schema validation, local SEO, AI-search optimization
- **Use custom `/mk:seo` for:** targeted quick checks, keyword research, programmatic SEO templates
- **Cross-reference:** both share `seo-schema` skill (single source of truth for JSON-LD templates)

### Key principle: Falsifiable findings

Every recommendation from claude-seo includes a **falsifiability check** — "how would we know this failed?" This makes every finding testable, not just opinion.

## MCPs (Bring Your Own Server)

The kit includes 5 MCP skill wrappers. **You provide the MCP server** — wrappers document the tools and parameters.

| MCP | Purpose | Required env | Manual fallback |
|---|---|---|---|
| **GA4** | Traffic reports, real-time, 200+ metrics, attribution | `GA4_PROPERTY_ID`, `GOOGLE_APPLICATION_CREDENTIALS` | Export GA4 → CSV → Read tool |
| **GSC** | SEO analytics, indexing, sitemaps, keywords | `GSC_SITE_URL`, service account | Export GSC → CSV → Read tool |
| **SendGrid** | Transactional email, marketing campaigns, analytics | `SENDGRID_API_KEY` | Generate templates, manual send |
| **Resend** | Developer-first email API, React Email | `RESEND_API_KEY` | Generate React Email components |
| **ReviewWeb** | Reputation audit, review monitoring, sentiment | `REVIEWWEB_API_KEY` | Ask user to paste reviews |

**Without MCP server:** Every wrapper has a **manual fallback mode** — generates templates, accepts CSV paste, or asks user to run steps manually. Kit still works.

## User cases

| User | Use case | Commands |
|---|---|---|
| **Solo founder** | Full campaign cycle without agency | `/mk:plan` + `/mk:campaign` |
| **SMB shop owner** | Content + ads at scale | `/mk:content` + `/mk:ads` |
| **Marketing manager** | Standardized process | All workflows (5) |
| **Agency** | Client delivery framework | All commands + workflows |
| **B2B SaaS** | Lead pipeline | `/mk:leads` + `/mk:nurture` |
| **Content creator** | Multi-platform content | `/mk:content` + `/mk:social` |
| **E-commerce** | Product + ads | `/mk:ads` + `/mk:cro` |
| **Local business** | Local SEO | `/mk:seo` + `seo-local` skill |

## Service domains

Suitable for: real estate, e-commerce, SaaS, edtech, F&B, healthcare/clinic, agencies, freelancers, B2B services, content creators.

## Hub context

All `/mk:` commands require `plans/marketing-context.md` (created by `/mk:plan`). Sections: ICP, Positioning, Brand Voice, Competitors, Goals, Channels, Stage/Budget. **Hard fail if absent** — run `/mk:plan` first.

## Related

- `CLAUDE.md` (root) — ClauKit master instructions
- `.claude/workflows/primary-workflow.md` — engineering workflow
- `docs/clauKit-registry.md` — full resource catalog
- `plans/marketing-kit/plan.md` — implementation plan (Phases 0.5-8)
- `skills/automation/` — MCP wrapper skills

## Source repos

- `AgriciDaniel/claude-seo` (8.4k stars) — SEO engine, 25 sub-skills + 18 agents
- `coreyhaines31/marketingskills` — 23 marketing skills imported
- Custom ClauKit — workflows, MCP wrappers, automation agents
