---
name: coding-level
description: Declare or infer a programming experience level (0-5) so explanations, examples, and suggestions adapt — verbose with safety nets at level 1, terse with idioms at level 5.
category: Meta / Adaptive Output
status: active
---

# Coding Level

## Purpose

A single explicit setting that tunes output depth across all other skills. Set it once per session (or per project); other skills read it to decide how much to explain, which idioms are safe, and how much hand-holding to include.

Orthogonal to all other skills — `[[planning]]`, `[[code-review]]`, `[[debugging]]`, `[[problem-solving]]` all read this to scale their output.

## The 6 Levels

| Level | Label | Output style |
|---|---|---|
| **0** | Absolute beginner | Define every term; show full code, not snippets; warn about every footgun; expect copy-paste, not adaptation. |
| **1** | Beginner | Define jargon on first use; full examples; explain *why* before *how*. |
| **2** | Advanced beginner | Skip basics; explain non-obvious choices; show short, complete examples. |
| **3** | Intermediate | Idioms allowed; reference docs by name; explain trade-offs, not syntax. |
| **4** | Advanced | Terse code; assume framework knowledge; lead with the decision, not the rationale. |
| **5** | Expert | Bullet points and code; no preamble; cite by PEP/RFC number; assume edge-case awareness. |

## When to Use

- New session with a contributor whose background you don't know
- Pairing across a skill gap (senior + junior on same task)
- Onboarding docs — write the same content at level 1 and level 4
- Self-review: am I over-explaining? am I being cryptic?

Activation phrases: *"set coding level to..."*, *"explain at junior level"*, *"terse, expert-mode answers"*, *"adjust depth for..."*

## How Other Skills Adapt

Each skill should check `coding-level` (default: 3) and adjust:

- `[[debugging]]` — at level 1, walk through hypotheses one at a time; at level 5, list root-cause candidates as a bullet list.
- `[[code-review]]` — at level 1, suggest fixes with examples; at level 5, name the principle violated (`SRP`, `LSP`) and move on.
- `[[planning]]` — at level 1, every step has a verification check; at level 5, plan is a checklist of headers.

## Assessment Heuristics (when level isn't declared)

If the user hasn't set a level, infer from signals:

- **Vocabulary**: "function vs method vs procedure" distinctions used → ≥3.
- **Questions**: "how do I..." → likely 1–2. "trade-offs between..." → likely 3–4. "what's the canonical idiom for..." → likely 4–5.
- **Code style**: variable names, error handling, abstraction level — all signal experience.
- **Tooling references**: mentions of `valgrind`, `strace`, `perf`, type-narrowing → ≥4.

When uncertain, ask once: "What level — 1–5 — should I aim for?"

## Anti-Patterns

- **One-size-fits-all level**: forcing every skill to level 3. Some content (math, distributed systems) needs higher floors regardless.
- **Mid-conversation level shifts without acknowledgment**: confuses readers. Announce changes: "Switching to terser style per your preference."
- **Patronizing at low levels**: simplifying ≠ infantilizing. Beginners deserve real explanations, not just dumbed-down ones.
- **Ignoring domain skill asymmetry**: same developer is level 5 in API design, level 2 in ML ops. A global level erases that. Allow domain-scoped overrides.

## Output Examples (same task, different levels)

Task: *"How do I fetch JSON from this URL?"*

- **Level 1**: "Use the `fetch` function. Here is a full example with try/catch and an explanation of what `await` does..."
- **Level 3**: "`const r = await fetch(url); const data = await r.json();` — wrap in try/catch; check `r.ok` before parsing."
- **Level 5**: "`fetch(url).then(r=>r.json())` — assumes 2xx; for production add `if (!r.ok) throw new Error(r.status)`."

The information is the same; the framing, scaffolding, and pace differ by level.

## References

See `references/`:
- `stackoverflow-developer-skill-levels.md` — 5-level measurement framework
- `bloom-taxonomy-for-coding.md` — cognitive complexity model
- `cefr-language-model-applied.md` — adaptive proficiency analog

## Cross-links

`[[planning]]`, `[[code-review]]`, `[[debugging]]`, `[[problem-solving]]`
