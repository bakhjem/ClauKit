---
name: remotion
description: Create programmatic videos in React, render to MP4
category: AI Generation & Multimodal
status: active
---

# Remotion

## Purpose

Create real MP4 videos programmatically using React components. Combine JavaScript logic, animations, and dynamic data to produce professional videos at scale with render flexibility (local, server-side, or serverless Lambda).

## When to Use

- Data-driven video generation (personalized, batch-rendered videos)
- Animated explainer videos or product demos
- Marketing campaigns with programmatic variations
- Video editing as code (versioning, templates, testing)
- High-volume video production (100s/1000s of unique videos)
- Integrating video into applications with custom editing UI

**Do NOT use when**: Quick one-off videos (use traditional video editors), real-time streaming, or non-deterministic content.

## Workflow

1. **Initialize Project** — Run `npx create-video@latest` to scaffold a Remotion project with example composition.

2. **Create Compositions** — Write React components as video scenes. Use CSS or Tailwind for styling, JavaScript for animations, and props for dynamic content.

3. **Parametrize & Preview** — Pass data (text, images, JSON) to compositions. Develop and preview in Remotion Studio at `http://localhost:3000`.

4. **Set Render Config** — Define frame rate (30/60fps), dimensions (1080p/4K), codec, and output path.

5. **Render Videos** — Choose render target: local (CLI), server-side (Node.js), or serverless (Remotion Lambda). Export as MP4/WebM with optional audio.

## Key Concepts

### Composition: Video as React Component
A composition is a React component that returns JSX describing your video. Import `Composition`, `Sequence` (timeline segments), `Img`, `AbsoluteFill` (fullscreen layer), and animation utilities. Example:

```jsx
export const MyVideo = ({ name, duration }) => (
  <AbsoluteFill style={{ background: '#fff' }}>
    <h1>{name}</h1>
    <motion.div animate={{ opacity: [0, 1] }} transition={{ duration }} />
  </AbsoluteFill>
);
```

### Parametrization: Dynamic Content
Pass props to compositions as JSON or query params. Render videos programmatically with different names, images, colors, durations. Enables batch generation (100s of personalized videos).

### Rendering Options
- **Local**: `npx remotion render` on your machine. Quick iteration, CPU-intensive.
- **Server-side**: Deploy composition to a Node.js server. Accept render requests via API.
- **Remotion Lambda**: Serverless AWS Lambda rendering. Scales to 1000s of concurrent renders. Charged per minute.

### Timeline & Sequencing
Use `<Sequence>` to define when elements appear. Control frameRate, durationInFrames. Compose complex timelines by nesting sequences. Animations sync to frame count, ensuring deterministic output.

### Audio Integration
Embed audio tracks (MP3, WAV) via `<Audio>` component. Sync to video duration. Mix multiple audio layers.

## Example

**Scenario:** Generate personalized birthday videos for 100 customers.

**Composition:**
```jsx
import { AbsoluteFill, Img, Sequence } from 'remotion';

export const BirthdayVideo = ({ name, imageSrc }) => {
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(to right, #FF6B6B, #FFE66D)' }}>
      <Sequence durationInFrames={120}>
        <h1 style={{ fontSize: 64, color: '#fff', textAlign: 'center' }}>Happy Birthday, {name}!</h1>
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Sequence>
    </AbsoluteFill>
  );
};
```

**Render Script:**
```js
const customers = ['Alice', 'Bob', 'Carol'];
customers.forEach(({ name, imageSrc }) => {
  render({
    composition: BirthdayVideo,
    props: { name, imageSrc },
    fps: 30,
    durationInFrames: 240,
    codec: 'h264',
    outputPath: `./videos/${name}-birthday.mp4`,
  });
});
```

**Result:** 100 unique birthday videos, versioned in Git, rendered in parallel via Lambda.

## Common Pitfalls

- **Non-deterministic content**: Don't use `Math.random()` or `new Date()` inside render. Determinism = cacheable, reproducible videos.
- **Ignoring frame-based timing**: Think in frames (e.g., 300 frames @ 30fps = 10s), not seconds. Off-by-one frame errors compound.
- **Heavy CPU renders**: 4K 60fps videos burn CPU. Use Lambda for scale or downgrade resolution locally.
- **Missing parametrization**: Hardcoding content prevents batch generation—always extract as props.
- **Audio sync issues**: Test audio duration matches video durationInFrames. Audio libraries vary; test codec compatibility.
- **Complex nested sequences**: Debugging timelines with 10+ nested sequences is painful. Flatten or use composition variables.

## References

- [Remotion Documentation](https://www.remotion.dev/) — Official docs, API reference, and tutorials
- [Remotion GitHub Repository](https://github.com/remotion-dev/remotion) — Source code, issues, and examples
- [Produce Videos in React with Remotion](https://blog.openreplay.com/produce-videos-in-react-with-remotion/) — In-depth tutorial and use case exploration
- [Deep Dive into Remotion Framework](http://blog.brightcoding.dev/2025/09/13/make-videos-with-react-code-a-deep-dive-into-remotion/) — Advanced patterns and Lambda rendering
