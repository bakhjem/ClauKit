---
name: ai-artist
description: Generate images via Nano Banana with curated prompts
category: AI Generation & Multimodal
status: active
---

# AI Artist

## Purpose

Generate high-quality images using Google's Nano Banana image models (Gemini API) with prompt engineering best practices. Leverage reference images, specific photographic language, and composition cues to produce consistent, professional visuals.

## When to Use

- Marketing and product photography (mockups, concept art)
- Social media content and blog headers
- UI/UX design mockups and placeholder imagery
- Icon and illustration generation
- Style exploration and rapid visual iteration
- Batch image generation with reference consistency (up to 14 reference images per request)

**Do NOT use when**: Legal/copyright-sensitive content, deepfakes, or images requiring pixel-perfect technical precision.

## Workflow

1. **Define Visual Scope** — Establish subject, setting, lighting, composition style, and photographic language.

2. **Craft Detailed Prompt** — Include subject (what), environment (where), lighting (how), composition (perspective), and style (aesthetic). Use 50–100+ words.

3. **Add Reference Images** — (Optional) Provide up to 14 reference images for style transfer, character consistency, or compositional guidance. Nano Banana uses these to inform output.

4. **Generate & Iterate** — Submit prompt. Review output. Refine prompt based on results (adjust lighting, composition, style) and regenerate.

5. **Post-Process** — Export images for design use. Integrate into mockups, marketing collateral, or UI designs.

## Key Concepts

### Photographic & Cinematic Language
Instead of abstract descriptions, use professional photography terminology. E.g., instead of "a mug," write "A photorealistic product photo of a ceramic coffee mug, soft natural lighting from the left, white background, sharp focus, commercial photography style, 4K detail." Terms like "wide-angle shot," "macro shot," "low-angle perspective," "85mm portrait lens," "Dutch angle," "shallow depth of field" translate into visual composition cues.

### Prompt Structure
Best results combine: **Subject** (what/who) + **Environment** (where/context) + **Lighting** (how it's lit, time of day, mood) + **Composition** (framing, perspective, focal point) + **Style** (photographic, cinematic, painting, illustration, art style).

### Reference Images for Consistency
Nano Banana accepts up to 14 reference images per request. Use them for: style transfer (apply a reference painting's aesthetic to new subjects), character consistency (same person across multiple images), or compositional guidance (match framing and perspective).

### Model Selection
- **Nano Banana 2** (Feb 2026): High efficiency, lower price ($0.02/image), ideal for high-volume batch generation.
- **Nano Banana Pro**: Highest quality ($0.06/image), best for hero images and critical visuals.
- **Imagen 4 tiers**: Premium options for ultra-high fidelity.

### Thinking Level & Advanced Features
Gemini 3 models use dynamic thinking by default, allowing the model to reason through complex prompts before generating images. Control reasoning depth with the `thinking_level` parameter for balance between speed and accuracy.

## Example

**Prompt (Weak):**
"A futuristic city at night"

**Prompt (Strong):**
"A futuristic cyberpunk megacity at night, neon-lit skyscrapers piercing through smog, flying vehicles with glowing trails, seen from a low-angle wide-angle perspective (24mm lens), neon blues and purples dominant, rain-slicked streets reflecting neon lights, cinematic lighting with volumetric fog, shot in the style of Blade Runner 2049, ultra-detailed, 8K, photorealistic."

**With Reference:**
Add 3 reference images: one cyberpunk aesthetic, one night city lighting, one neon color palette. Nano Banana uses these to guide generation.

**Output:** Consistent, detailed, cohesive cyberpunk scene suitable for concept art, marketing, or game design.

## Common Pitfalls

- **Vague prompts**: "A beautiful landscape" produces mediocre results. Be specific: terrain, season, time of day, weather, perspective.
- **Ignoring photographic language**: Abstract descriptions underutilize the model. Use lens terms, lighting positions, focal lengths.
- **No reference images**: Missing style consistency across batches. Provide 1–3 key references.
- **Overloaded prompts**: 200+ words of contradictions confuse the model. Prioritize 5–10 key attributes.
- **Ignoring thinking_level**: Fast generation (low thinking) sacrifices quality. Balance with project needs.
- **Not iterating**: First output is rarely perfect. Use results to refine and regenerate.

## References

- [Google Gemini Image Generation API](https://ai.google.dev/gemini-api/docs/image-generation) — Official API docs for Nano Banana and Imagen models
- [Nano Banana Prompting Guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana) — Google Cloud's comprehensive prompt engineering strategies
- [Gemini Prompt Design Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) — Official best practices for effective prompts
- [Gemini Image API 2026 Guide](https://blog.laozhang.ai/en/posts/gemini-image-api-guide-2026) — Updated pricing, model selection, and advanced features
