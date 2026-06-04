---
name: stitch
description: Generate AI design via Google Stitch with code export
category: Design & Frontend
status: active
---

# Stitch

## Purpose

Generate production-ready UI designs from natural language prompts using Google's Stitch AI. Convert design ideas into interactive prototypes and export code in multiple frameworks (HTML/CSS, Tailwind, Vue, Angular, Flutter, SwiftUI).

## When to Use

- Rapid UI prototyping from text descriptions or wireframes
- Multi-screen app flow generation (up to 5 connected screens)
- Design system exploration before detailed mockups
- Code-first design workflows (HTML/CSS/Tailwind export)
- Iterative UI refinement with AI-powered suggestions

**Do NOT use when**: Detailed brand customization, complex animations, or bespoke illustrations are non-negotiable.

## Workflow

1. **Describe Your UI** — Write natural language prompts describing your app, screens, user flows, or component layouts. Include context (mobile/web, target user, key features).

2. **Generate Designs** — Stitch creates high-fidelity mockups with up to 5 interconnected screens. Leverage voice input for hands-free iteration.

3. **Iterate & Refine** — Use the infinite AI-native canvas to request design changes, get real-time critiques, and explore variations.

4. **Export Code** — Export designs as production-ready code in your preferred stack (HTML/CSS, Tailwind CSS, Vue.js, Angular, Flutter, SwiftUI).

## Key Concepts

### Multi-Screen Generation
Stitch 2.0 enables generating entire application flows—connected screens with navigation logic—rather than isolated components. Describe how users move between screens, and Stitch maintains visual consistency across the flow.

### AI-Driven Critique
Voice capabilities allow you to ask the AI agent for design feedback on color schemes, typography, spacing, and usability before export.

### Design Tokens & Variability
Exported code includes semantic color roles, typography scales, and spacing tokens aligned with Material Design 3 principles, ensuring consistency and maintainability.

### Infinite Canvas
Move beyond single-page mockups to explore entire design systems on an infinite, zoomable canvas.

## Example

**Prompt:**
"Create a mobile fitness app with 5 screens: login, home dashboard showing workout stats, a workout detail page with timer, exercise library with search, and user profile. Use blue and teal accent colors, modern sans-serif font. Dashboard should display current streak, calories burned, and upcoming workouts."

**Output:**
- 5 interconnected, navigable mockup screens
- Consistent typography and color system
- Exportable as Tailwind CSS components with proper semantic tokens
- Ready for React/Vue integration or further refinement

## Common Pitfalls

- **Over-specification**: Detailed prose is good; overthinking every shade loses speed advantage.
- **Ignoring export limitations**: Some complex animations may not translate cleanly to code—simplify or refine in code editor.
- **Missing context**: Stitch performs better with target platform (mobile vs. desktop) and user role context.
- **Skipping iteration**: First output is rarely perfect—use voice feedback loop for refinement.

## References

- [Stitch - Design with AI](https://stitch.withgoogle.com/) — Official Stitch platform
- [Google Labs: Introducing Stitch](https://developers.googleblog.com/stitch-a-new-way-to-design-uis/) — Launch announcement and overview
- [Google Stitch 2.0: Multi-screen & Voice](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/) — March 2026 update with infinite canvas and voice input
