---
name: show-off
description: Create visually impressive HTML showcases using Tailwind CSS for product demos, landing pages, and social media
category: Documentation & Content
status: active
---

# Show Off

## Purpose
Build stunning single-page showcases with Tailwind CSS utility classes—no design skills needed. Combines pre-built component patterns (cards, hero sections, feature grids) with custom branding to create shareable, demo-ready HTML that impresses on GitHub Pages, product hunts, or social media.

## When to Use
- Launching a new product or feature (hero page + feature showcase)
- Building GitHub README landing pages with interactive demos
- Creating social media preview content (shareable cards, animations)
- Demonstrating before/after transformations or use cases
- Building live portfolio or case study pages

**Do NOT use when**: Creating long-form content (use blogs instead), building complex applications (not SPAs), or needing backend integration—static HTML only.

## Workflow
1. **Choose template** — Start from Tailwind Plus, Tailwindflex, or Creative Tim (copy vanilla HTML)
2. **Customize branding** — Update colors, fonts, logo, and hero copy to match brand
3. **Add feature cards** — Use grid layouts (col-span) to showcase 3-4 key differentiators with icons
4. **Embed media** — Add product screenshots, videos, or interactive demos via `<iframe>` or embedded players
5. **Polish interactions** — Add hover effects (scale, shadow), animations (fade-in, slide), smooth scrolls
6. **Optimize for sharing** — Add Open Graph meta tags, Twitter cards, clear CTA buttons
7. **Deploy** — Push to GitHub Pages, Vercel, or Netlify (all support static hosting)

## Key Concepts
### Tailwind Utility Classes
Instead of writing CSS, compose styles by stacking classes: `<div class="bg-blue-600 text-white rounded-lg p-8 hover:shadow-lg transition-shadow">`. Tailwind generates only the CSS you use—fast and minimal.

### Component Patterns (Tailwind Plus/UI)
**Hero sections** (headline + CTA + background image), **feature grids** (3-col cards with icons), **testimonial carousels**, **pricing tables**, **footer navigation**. Mix and match pre-built patterns instead of designing from scratch.

### Performance & Accessibility
Tailwind outputs plain HTML/CSS—fast to load, works offline, no JavaScript framework required. Ensure color contrast (WCAG AA), semantic HTML (`<button>` not `<div>`), and alt text for images.

## Example
```html
<!-- Hero Section -->
<section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-5xl font-bold mb-4">Ship 10x Faster</h1>
    <p class="text-xl mb-8">Deploy with confidence</p>
    <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
      Get Started
    </button>
  </div>
</section>

<!-- Feature Grid -->
<section class="grid grid-cols-3 gap-8 py-20">
  <div class="p-6 border rounded-lg hover:shadow-lg transition-shadow">
    <h3 class="font-bold mb-2">Fast</h3>
    <p>Deploy in 60 seconds</p>
  </div>
  <!-- Repeat card pattern -->
</section>
```

## Common Pitfalls
- Overloading animations (slow performance; use sparingly)
- Ignoring mobile responsiveness (test on phone; use `md:`, `lg:` breakpoints)
- Weak or missing CTA (single, visible action button; avoid "Learn More")
- Poor color contrast (fails accessibility; use Tailwind color scales)
- Embedding unoptimized images (resize before uploading; use WebP format)

## References
- [Tailwind UI Components](https://tailwindcss.com/plus) — Official pre-built components and templates
- [Tailwindflex](https://tailwindflex.com/) — Free Tailwind component library with 1000+ examples
- [Creative Tim Tailwind Components](https://www.creative-tim.com/twcomponents) — Open-source component templates
