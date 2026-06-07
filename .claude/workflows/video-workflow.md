# Video Workflow (6-phase)

AI video production pipeline. Mostly linear with parallel tracks in Phase 3.

**Trigger:** `/mk:video <video-concept>`
**Agent:** `video-producer`
**Required input:** `plans/marketing-context.md`
**Output dir:** `plans/marketing/<campaign>/video/`

---

## Phase 1 — Script

Hook → problem → solution → proof → CTA. Skills: `copywriting`, `video-producer`.
*Output:* `script.md` (scene-by-scene, ~60-180s video).

## Phase 2 — Voiceover

TTS generation. Skills: `ai-multimodal` (TTS), `ai-multimodal` (voice cloning).
*Output:* `voiceover.mp3` + timing notes.

## Phase 3 — Visuals (parallel)

**Track A:** AI-generated images (DALL-E, Midjourney, Stable Diffusion). Skills: `ai-artist`, `ai-multimodal`.
**Track B:** 3D / motion graphics (if needed). Skills: `threejs`, `remotion`.
*Output:* `visuals/` (PNG/MP4 per scene).

## Phase 4 — Edit

Assemble scenes, add captions, brand overlay, transitions, music. Skills: `ui-styling` (caption styles), `remotion`.
*Output:* `rough-cut.mp4` (editable timeline).

## Phase 5 — Render

Final render at target resolutions (1080p, 720p, 9:16 for shorts). Skills: `remotion`.
*Output:* `final-<resolution>.mp4` (multiple variants).

## Phase 6 — Distribute

Publish to platforms (YouTube, TikTok, Instagram Reels, LinkedIn). Skills: `social-content`, `video-producer`.
*Output:* `distribution-log.md` (URLs, platform-specific metadata).

---

**Conventions:** Each scene is one image + one VO segment. Total video length: 60-180s for short-form, 5-15min for long-form. Brand colors/typography pulled from `marketing-context.md`.
