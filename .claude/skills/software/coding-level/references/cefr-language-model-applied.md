# CEFR · Adaptive Proficiency Model (Applied)

**Source**: https://www.coe.int/en/web/language-policy/cefr

## The CEFR scale

Originally for natural-language learners, the Common European Framework of Reference uses 6 levels (A1, A2, B1, B2, C1, C2). Two design choices port well to coding:

1. **Behavioral descriptors** — each level is described by what the learner can *do*, not what they know.
2. **Adaptive content** — textbooks, exams, and CEFR-aligned materials are written at one explicit level.

## Why this matters for AI output

LLM responses today are mostly level-agnostic — the same answer ships to a beginner and an expert. CEFR's lesson: every piece of content should be tagged to a level, and consumers pick.

`coding-level` is the CEFR-style tag for AI coding assistance.

## CEFR → coding-level mapping

| CEFR | coding-level | Behavior summary |
|---|---|---|
| A1 | 0 | Recognizes syntax; needs full examples |
| A2 | 1 | Modifies examples; basic debugging |
| B1 | 2 | Builds small features unaided |
| B2 | 3 | Plans medium features; refactors with care |
| C1 | 4 | Designs systems; reviews others' code |
| C2 | 5 | Mentors; sets standards; teaches the language itself |

## What we *don't* port

CEFR has formal assessment regimes (exams, certifications). `coding-level` deliberately does not — the goal is output-tuning, not credentialing.

## Why authoritative

CEFR is the global standard for language proficiency assessment; the Council of Europe's framework is referenced across education, immigration, and employment systems worldwide.
