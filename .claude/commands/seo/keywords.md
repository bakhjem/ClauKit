---
description: Research keywords for a topic
argument-hint: <keyword-or-topic>
---

# Keyword Research: $ARGUMENTS

Use the seo-specialist agent to perform keyword research and analysis.

## Workflow

1. **Analyze the seed term** - understand intent and context
2. **Generate keyword variations** - expand the seed into related terms
3. **Research keywords** - estimate volume, difficulty, CPC
4. **Categorize results** - Primary, Secondary, Long-tail
5. **Create content strategy** - recommendations for content creation

## Research Process

### 1. Seed Analysis
- Identify primary keyword: $ARGUMENTS
- Determine search intent (Informational, Commercial, Transactional)
- Estimate market size

### 2. Keyword Expansion
Generate variations across:
- Different match types (broad, phrase, exact)
- Long-tail variations
- Question-based queries
- Comparison keywords
- Competitor-related terms

### 3. Keyword Data (Estimated)
For each keyword, estimate:
- **Search Volume**: Monthly searches (estimated)
- **Difficulty**: Competition level (0-100)
- **CPC**: Cost per click (USD, estimated)
- **Intent**: Informational/Commercial/Transactional
- **Opportunity**: Very High/High/Medium/Low

### 4. Categorization

#### Primary Keywords (High Volume, High Intent)
- Core terms directly related to seed
- High commercial intent
- Priority for main pages

#### Secondary Keywords (Medium Volume, Medium Intent)
- Supporting terms
- Good for blog/content
- Lower competition

#### Long-tail Keywords (Low Volume, Low Competition)
- Specific, detailed queries
- High conversion potential
- Easier to rank

### 5. Content Strategy
- Topic clusters
- Content types (blog, guide, comparison)
- Content calendar recommendations

## Output Format

```
# Keyword Research: [Seed Term]
Generated: [Date]

## PRIMARY KEYWORDS (High Intent)

### 1. [Keyword]
- Volume: [X,XXX]/month
- Difficulty: [XX]/100
- CPC: $[X.XX]
- Intent: [Type]
- Opportunity: [Level]

### 2. [Keyword]
...

## SECONDARY KEYWORDS (Medium Intent)

### 3. [Keyword]
...

## LONG-TAIL KEYWORDS (Low Competition)

### 10. [Keyword]
...

## SEARCH INTENT ANALYSIS

**Informational** (Early Stage):
- Keywords for blog posts
- Educational content

**Commercial Investigation** (Mid Stage):
- Keywords for comparison pages
- Reviews and lists

**Transactional** (Late Stage):
- Keywords for pricing pages
- Direct conversion

## CONTENT STRATEGY

### Immediate Wins (Create First):
1. [Content Title]
   - Target: [keyword]
   - Format: [type]

2. [Content Title]
   - Target: [keyword]
   - Format: [type]

### Long-term Authority:
- [Content ideas]

## KEYWORD PRIORITIZATION

### Priority 1 (This Month):
1. [Keyword] - [Reason]
2. [Keyword] - [Reason]

### Priority 2 (Next Month):
1. [Keyword] - [Reason]
2. [Keyword] - [Reason]

## NEXT STEPS
/seo audit [url]
/content [content-type] [title]
```

## Examples

**Basic keyword research:**
```
/seo keywords "project management software"
```

**Long-tail research:**
```
/seo keywords "best project management software for small teams"
```

**Competitor-focused research:**
```
/seo keywords "asana alternatives"
```
