---
name: shader
description: Write GLSL fragment shaders for procedural graphics
category: Design & Frontend
status: active
---

# Shader

## Purpose
Write GPU-accelerated fragment shaders in GLSL to create procedural textures, generative patterns, animated effects, and full-screen graphics. Fragment shaders execute per-pixel, enabling real-time visual generation, ray marching, and mathematical art.

## When to Use
- Procedural texture generation (noise, fractals, patterns)
- Real-time animated visual effects (gradients, particle systems, abstract art)
- Post-processing effects (bloom, distortion, color grading)
- Ray marching and signed distance field (SDF) rendering
- Data visualization (heatmaps, volumetric effects)
- WebGL/Canvas background animations for web interfaces
- Learning GPU compute fundamentals and parallel graphics algorithms

**Do NOT use when**: Requiring no GPU dependency (use CSS/Canvas instead), needing cross-browser compatibility on low-end devices (mobile WebGL fragmented), or building UI components (overhead not justified).

## Workflow
1. **Set up WebGL context** — Initialize canvas and WebGL context via Three.js, Babylon.js, or raw WebGL API
2. **Write fragment shader** — Code GLSL function calculating color per pixel; access uniforms (time, resolution, mouse) and texture samplers
3. **Compile & link** — Compile vertex/fragment shader pair; link into WebGL program; check for compile errors
4. **Pass uniforms** — Update time, resolution, mouse position, and other parameters each frame
5. **Render quad** — Draw full-screen quad or geometry to invoke fragment shader for every pixel
6. **Iterate & optimize** — Profile on target GPU; reduce texture lookups and branching; use precision qualifiers for mobile

## Key Concepts

### Fragment Shader Basics
A fragment shader is a tiny GPU program executed for every pixel on screen. Input: UV coordinates (0-1 texture space), uniforms (time, resolution, mouse). Output: RGBA color. Runs in parallel across thousands of GPU cores for per-pixel parallelism.

### GLSL Language
GLSL (OpenGL Shading Language) resembles C with vector/matrix types (`vec2`, `vec3`, `vec4`, `mat4`), built-in math functions (`sin`, `cos`, `length`, `normalize`), and texture sampling (`texture()`). No dynamic memory allocation; designed for GPU execution with predictable latency.

### Uniforms & Varyings
Uniforms are constant across all pixels (e.g., `time`, `resolution`); sent from CPU each frame. Varyings interpolate per-vertex (e.g., texture coordinates). Fragment shader combines both to compute per-pixel output.

### Performance Considerations
Fragment shaders run millions of times per frame (one per pixel). Minimize texture lookups, avoid branches (conditional branching serializes GPU execution), and use lower precision types on mobile. Early-exit techniques and level-of-detail reduce computation.

## Example
Animated gradient shader with time-based color cycling:
```glsl
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float t = time * 0.5;
  
  vec3 color = vec3(
    sin(uv.x + t) * 0.5 + 0.5,
    sin(uv.y + t + 2.0) * 0.5 + 0.5,
    sin(uv.x + uv.y + t) * 0.5 + 0.5
  );
  
  gl_FragColor = vec4(color, 1.0);
}
```

Use in Three.js:
```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  fragmentShader: shaderCode,
  vertexShader: `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
});
```

## Common Pitfalls
- Expensive nested loops or recursive logic (GPU serializes; causes stalls)
- Uninitialized uniforms (passing undefined values; shader produces black output)
- Texture coordinate out-of-bounds sampling (no bounds checking; undefined behavior)
- Branching heavily on per-pixel data (GPU prefers arithmetic over conditionals)
- No discard early-exit strategy (wastes computation on transparent pixels)
- Testing only on high-end GPUs (mobile WebGL has stricter precision/feature limits)
- Forgetting to set viewport/canvas size matching uniform resolution (pixel misalignment)

## References
- [The Book of Shaders](https://thebookofshaders.com) — Step-by-step GLSL tutorial from basics through advanced techniques (noise, patterns, fractals)
- [LearnOpenGL - Shaders](https://learnopengl.com/Getting-started/Shaders) — Core GLSL fundamentals, vertex/fragment shader workflows, lighting calculations
- [MDN WebGL Shaders](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders) — WebGL integration, GLSL syntax reference, compatibility notes
- [Inigo Quilez Blog](https://iquilezles.org) — Advanced techniques: SDFs, ray marching, fractals, and mathematical art
