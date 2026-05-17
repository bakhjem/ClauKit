# SEO Keyword Research — Canonical Process

Single source of truth for `/seo:keywords` command. Defines the research pipeline + SERP-features taxonomy + output template.

## Research Process (7 phases)

### 1. Seed Analysis
- Identify primary keyword
- Determine search intent (Informational · Commercial · Transactional)
- Estimate market size

### 2. Keyword Expansion
Generate variations across:
- Match types (broad, phrase, exact)
- Long-tail variations
- Question-based queries
- Comparison keywords
- Competitor-related terms

### 3. Keyword Data (Estimated)
For each keyword estimate:
- **Search Volume** — monthly searches (estimated)
- **Difficulty** — competition level (0-100)
- **CPC** — cost per click (USD, estimated)
- **Intent** — Informational / Commercial / Transactional
- **Opportunity** — Very High / High / Medium / Low
- **SERP Features** — featured snippets, PAA, etc.

### 4. SERP Features Analysis (`--serp-features`)

| SERP Feature | Description | Content Strategy |
|---|---|---|
| Featured Snippet | Box at top answering question | Q&A structure, lists |
| People Also Ask | Expandable Q&A list | Target question keywords |
| Knowledge Panel | Brand/info box | Build entity authority |
| Local Pack | Map with 3 local results | Local SEO optimization |
| Image Pack | Image carousel | Optimized images |
| Video Results | YouTube/videos | Create video content |
| Shopping Results | Product listings | E-commerce optimization |
| Reviews | Star ratings | Review schema |
| Top Stories | News articles | News content strategy |

### 5. Content Gap Analysis (`--gap --competitors=<urls>`)
Compare against competitors:
- Keywords they rank for that you don't
- Topics they cover that you miss
- Backlink opportunities
- Content format gaps

### 6. Keyword Clustering (`--cluster`)
Group related keywords into topic clusters:
- Semantic similarity
- Intent alignment per cluster
- Content pillar recommendations
- Internal linking strategy

### 7. Content Brief Generation (`--brief`)
Generate ready-to-write briefs:
- Target keyword + LSI terms
- Optimal structure (H2, H3 outline)
- Word count recommendations
- Competitor content analysis
- Schema recommendations

## Variant Flags

| Flag | Effect |
|---|---|
| `--serp-features` | Enable phase 4 (SERP features taxonomy) |
| `--gap --competitors=<urls>` | Enable phase 5 (gap analysis) |
| `--cluster` | Enable phase 6 (clustering) |
| `--brief` | Enable phase 7 (content brief) |

## Output Template

```markdown
# Keyword Research: [Seed Term]
Generated: [Date]

## PRIMARY KEYWORDS (High Intent)
### 1. [Keyword]
- Volume: [X,XXX]/month
- Difficulty: [XX]/100
- CPC: $[X.XX]
- Intent: [Type]
- Opportunity: [Level]
- SERP Features: [Snippet | PAA | Local | Shopping | None]

## SECONDARY KEYWORDS (Medium Intent)
### [Keyword]...

## LONG-TAIL KEYWORDS (Low Competition)
### [Keyword]...

## SERP FEATURES ANALYSIS (--serp-features)
**Featured Snippet Opportunities:**
- [Keyword] — Q&A format
**People Also Ask Targets:**
- [Question keyword] — answer directly
**Content Type Recommendations:**
- [Keyword] — video / image-heavy

## SEARCH INTENT ANALYSIS
**Informational** (Early Stage) → blog/educational
**Commercial Investigation** (Mid) → comparison/reviews
**Transactional** (Late) → pricing/conversion

## CONTENT GAP ANALYSIS (--gap)
**You Rank, Competitors Don't:** [Keyword] — strengthen position
**Competitors Rank, You Don't:** [Keyword] — [URL] — create content
**Opportunity Score:** [Keyword] — Very High (low comp, high intent)

## KEYWORD CLUSTERS (--cluster)
### Cluster 1: [Topic]
- [Keyword 1] · [Keyword 2] · [Keyword 3]
- Recommended Pillar: [Pillar Page]

## CONTENT BRIEF (--brief)
**Target Keyword:** [Keyword]
**Word Count:** [X,XXX] words
**Content Type:** Guide | Tutorial | Comparison | Listicle

### Recommended Structure
1. H2: Introduction (150 words)
2. H2: [Section 1] → H3 subsections
3. H2: [Section 2] → ...

### Competitor Analysis
- [URL 1]: [X] words, structure notes
### Schema to Add
- Article · FAQ (if Q&A)

## CONTENT STRATEGY
### Immediate Wins (Create First)
1. [Content Title] — target keyword · format · SERP feature

### Long-term Authority
- [Content ideas]

## KEYWORD PRIORITIZATION
### Priority 1 (This Month)
1. [Keyword] — [reason]
### Priority 2 (Next Month)
1. [Keyword] — [reason]

## NEXT STEPS
/seo:audit [url]
/seo:schema [type]
/content [content-type] [title]
```
