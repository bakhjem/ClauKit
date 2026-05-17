---
name: ui-ux-pro-max
description: 50+ styles, 161 color palettes, 57 font pairs
category: Design & Frontend
status: active
---

# UI/UX Pro Max

## Purpose

Comprehensive UI/UX design workflow integrating 50+ design styles, 161 scientifically-balanced color palettes, and 57 curated font pairs from Material Design 3, Apple HIG, and modern web best practices. Systematically select and apply design tokens to ensure accessibility, hierarchy, and brand consistency.

## When to Use

- Building new design systems from scratch
- Selecting color palettes and typography for projects
- Ensuring accessibility (WCAG AA+) compliance across designs
- Creating cohesive visual language across products
- Design audit and refactoring of existing interfaces
- Training teams on design system fundamentals

**Do NOT use when**: Quick mockups or experimental prototypes where perfect consistency is not required.

## Workflow

1. **Define Design Constraints** — Establish platform (web, iOS, Android), audience, accessibility level, and brand mood (modern, minimal, playful, corporate).

2. **Select Color Palette** — Choose from 161 palettes organized by mood and use case. Leverage semantic color roles (Primary, Secondary, Success, Warning, Error) and ensure all text meets WCAG AA contrast ratios.

3. **Choose Typography** — Select from 57 font pairs (Heading + Body). Apply Material Design 3's scale: Display, Headline, Title, Body, Label—each in Small, Medium, Large variants.

4. **Build Component Hierarchy** — Layer colors, typography, spacing, and shadows to create clear visual hierarchy. Use grayscale first to test contrast without color distraction.

5. **Validate & Iterate** — Cross-check designs against Material Design 3, Apple HIG, and Rauno Freiberg's Web Interface Guidelines. Test for dark mode support and touch target sizes.

## Key Concepts

### Color Systems
Material Design 3 uses HCT (Hue, Chroma, Tone) color space for perceptually accurate palettes that work across light and dark modes. Each palette includes semantic roles: Primary (brand), Secondary (accent), Tertiary (alternative), Success, Warning, Error, with corresponding "On" roles for text contrast.

### Semantic Typography
A constrained type scale ensures hierarchy without overwhelming choice. Display (largest, rare headlines) → Headline (section titles) → Title (subsections) → Body (readable content) → Label (UI controls). Each level has 3 variants (Small, Medium, Large) for responsive scaling.

### Spacing & Rhythm
Use consistent spacing scales (4, 8, 12, 16, 24, 32, 48, 64px) derived from your base unit. Apply to margin, padding, gap. Rhythmic spacing creates visual cohesion and makes layouts predictable.

### Accessibility-First Design
Minimum touch targets 44×44 points (iOS) or 48×48 dp (Material). Text contrast ratios: AA for body (4.5:1), AAA for small text (7:1). Support Dynamic Type/scalable fonts. Test with screen readers.

### Design System Tokens
Export decisions as design tokens (CSS vars, JSON): `--color-primary`, `--font-headline-medium`, `--spacing-md`. Centralize tokens in configuration, not scattered in components.

## Example

**Scenario:** Building a financial app for desktop and mobile.

- **Color Palette**: Choose "Trust + Security" (blues/teals, calm mood) from 161 options. Assign Primary (brand blue #1F77E0), Secondary (teal accent), Success (green for gains), Error (red for losses).
- **Typography**: Pair "Inter" (body, modern sans-serif) with "Plus Jakarta Sans" (headline, bold friendly).
- **Components**: Apply Material Design 3 scale—Headline/Large for transaction titles, Body/Medium for amounts, Label/Small for metadata. Use Success green for positive changes, Error red for negatives.
- **Spacing**: 16px base grid. Cards: 16px padding. Form inputs: 12px inner spacing.
- **Accessibility**: Ensure all text ≥ 4.5:1 contrast. Touch buttons ≥ 44px tall on mobile.

## Common Pitfalls

- **Ignoring contrast**: Color choices fail accessibility audits. Always verify WCAG AA minimums (https://webaim.org/resources/contrastchecker/).
- **Too many shades**: Using custom colors instead of constrained palette fragments consistency. Stick to 5–9 shades per hue.
- **Mixing unrelated pairs**: Pairing a modern sans-serif with a decorative serif creates confusion. Stick to curated pairs.
- **Forgetting dark mode**: Design in both light and dark contexts. Use semantic tokens so theme switching is automatic.
- **Untested responsive scaling**: Typography scales and spacing may break on small screens. Test Mobile-First.

## References

- [Material Design 3 Styles & Tokens](https://m3.material.io/styles) — Official color, typography, shape, motion guidelines
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) — iOS/macOS design principles and component specs
- [Refactoring UI: Building Your Color Palette](https://refactoringui.com/previews/building-your-color-palette) — Systematic color system methodology
- [Tailwind CSS Best Practices](https://samioda.com/en/blog/tailwind-css-best-practices) — Design token strategy and component abstraction
- [Web Interface Guidelines by Rauno Freiberg](https://interfaces.rauno.me/) — Interaction patterns and detailed UI affordances
