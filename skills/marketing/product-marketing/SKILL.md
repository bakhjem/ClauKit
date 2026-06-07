---
name: product-marketing
description: Foundation marketing skill. Create or update the marketing context hub (plans/marketing-context.md) — ICP, positioning, brand voice, competitors, goals, channels. Activated by /mk:plan and the first run of any /mk: command when the hub is missing.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# Product Marketing (Hub)

> Foundation skill for the ClauKit marketing kit. Creates/updates `plans/marketing-context.md` — the single source of truth for all marketing output.

---

## When this skill activates

- **Implicit:** any `/mk:` command detects the context hub is missing → auto-activates `/mk:plan` flow.
- **Explicit:** `/mk:plan` or "Set up our marketing context" or "Refresh marketing plan".

## Why this matters

Every marketing output (copy, campaigns, content, emails) needs:
1. **ICP** — who are we talking to?
2. **Positioning** — what makes us different?
3. **Brand voice** — how do we sound?
4. **Competitors** — who else is in the space?
5. **Goals** — what are we trying to achieve?
6. **Channels** — where do we reach them?
7. **Stage & budget** — what's realistic?

Without this context, marketing output is generic, off-brand, and wasted effort.

---

## Workflow (6 sections, ~15 min)

### 1. Detect & load

Check for `plans/marketing-context.md`:
- **Exists** → load, ask which sections to update
- **Missing** → proceed to section 2 (interview)

### 2. Interview (one question at a time)

Ask in this order. Capture answers verbatim. Skip if user already provided info.

1. **Product** — "What's the product/service? One sentence."
2. **ICP** — "Who is the ideal customer? (role, industry, company size, pain point)"
3. **Positioning** — "Why us vs alternatives? What's the unfair advantage?"
4. **Brand voice** — "Pick 2-3 adjectives. Who is your brand NOT like?"
5. **Competitors** — "Name 2-4 main competitors + 1-line each."
6. **Goals** — "Top 1-3 goals this quarter/year? (revenue / signups / awareness / etc.)"
7. **Channels** — "Where does your ICP hang out? (LinkedIn, Twitter, SEO, podcasts, communities, events, paid ads)"
8. **Stage & budget** — "Pre-launch / early / growth / mature? Monthly marketing budget range?"

### 3. Synthesize positioning statement

From ICP + positioning, draft a one-line positioning statement:
```
For [ICP] who [pain point], [product] is a [category] that [key benefit]. Unlike [alternative], we [unfair advantage].
```

### 4. Write `plans/marketing-context.md`

Use the output schema below. Use today's date (YYMMDD) for `Updated`.

### 5. Confirm

Show the generated file. Ask: "Anything to add, remove, or change?"

### 6. Recommend next steps

Based on goals + stage:
- Pre-launch → `/mk:campaign launch`
- Growth → `/mk:content` + `/mk:ads`
- Lead gen → `/mk:leads` + `/mk:nurture`
- SEO focus → `/mk:seo audit`

---

## Output schema: `plans/marketing-context.md`

```markdown
# Marketing Context
**Product:** [name]
**Updated:** [YYMMDD]

## 1. Ideal Customer Profile (ICP)
- **Role:** [job titles]
- **Industry:** [vertical]
- **Company size:** [employees / revenue]
- **Pain point:** [what keeps them up at night]
- **Buying trigger:** [what makes them look for a solution]

## 2. Positioning Statement
[One-sentence template filled in]

## 3. Brand Voice
- **Tone:** [3 adjectives]
- **We're NOT like:** [competitor archetypes to avoid]
- **Forbidden words:** [jargon, hype terms, etc.]
- **Signature phrases:** [taglines, recurring CTAs]

## 4. Competitors
| Competitor | Positioning | Weakness |
|---|---|---|
| | | |

## 5. Goals
- **Q:** [quarter goal with metric]
- **H1/H2:** [half-year goal]
- **Year:** [annual goal]

## 6. Primary Channels
| Channel | Priority (1-5) | Reason |
|---|---|---|
| | | |

## 7. Stage & Budget
- **Stage:** [pre-launch / early / growth / mature]
- **Monthly budget:** [range]
- **Team:** [solo / 2-5 / 6+]

## 8. Notes & Constraints
[Anything else — compliance, brand partnerships, etc.]
```

---

## Update mode

When the file already exists, ask: "What changed?"
- New product/feature → update sections 1, 2
- New competitors → update section 4
- New goals → update section 5
- New channels → update section 6
- Refresh stage/budget → update section 7

Only modify the sections the user mentions. Keep history via `git diff`.

---

## Cross-references

- `.claude/workflows/marketing-rules.md` — content quality rules
- `skills/marketing/marketing-plan/` — converts this context into a quarterly plan
- `skills/marketing/customer-research/` — deeper ICP discovery (interviews, surveys)
- `skills/marketing/competitor-profiling/` — deep-dive on competitors
- All `/mk:` commands — read from this file

## Provenance

Adapted from `coreyhaines31/marketingskills` → `skills/product-marketing/`. ClauKit adaptations: ClauKit frontmatter, output target = `plans/marketing-context.md`, removed external registry references, added 6-section workflow + update mode.
