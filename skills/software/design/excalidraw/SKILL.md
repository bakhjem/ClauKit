---
name: excalidraw
description: Hand-drawn style diagrams with Excalidraw
category: Design & Frontend
status: active
---

# Excalidraw

## Purpose
Create collaborative hand-drawn style diagrams and wireframes with end-to-end encryption. Excalidraw renders shapes, arrows, and freehand drawings as sketches to communicate design ideas, system diagrams, and collaborative whiteboarding without formal design tool overhead.

## When to Use
- Wireframing UI layouts and user flows for rapid iteration
- Architecture sketches and system design discussions
- Collaborative real-time diagramming with teams (encryption-secured)
- Informal technical drawings that benefit from casual aesthetic
- Exporting diagrams as PNG, SVG, or editable `.excalidraw` JSON format
- Creating site maps, flowcharts, and entity relationship sketches

**Do NOT use when**: Requiring formal publication-ready styling, precise node positioning/alignment, or automatic graph layout algorithms (use Mermaid or tech-graph instead).

## Workflow
1. **Access the editor** — Visit excalidraw.com or embed `@excalidraw/excalidraw` npm package into your app
2. **Draw shapes & connections** — Use rectangle, circle, diamond, arrows, lines, freehand, eraser tools from toolbar
3. **Add text labels** — Double-click shapes to annotate; use arrow tools for flow connections
4. **Customize appearance** — Set colors, stroke width, fill, background; enable dark mode if needed
5. **Enable collaboration** — Generate invite link (with end-to-end encryption) for real-time multi-user editing
6. **Export & save** — Download PNG/SVG; save JSON file for later edits; enable autosave to browser storage

## Key Concepts

### Hand-Drawn Aesthetic
Excalidraw renders all shapes with soft, irregular edges mimicking pencil sketches. This casual style reduces design pressure, making it ideal for brainstorming and early-stage design communication. Maintains hand-drawn feel even in PNG/SVG exports.

### Canvas-Based Architecture
Infinite zoomable whiteboard with panning and keyboard shortcuts (Ctrl+Z undo, delete, arrow keys). No page constraints; suitable for large, exploratory diagrams. Real-time synchronization updates all collaborative clients.

### End-to-End Encryption
Collaboration links encrypt diagram data client-side; server never sees unencrypted content. No login required for sharing. Invite links remain valid indefinitely.

### Multi-Format Export
PNG (raster), SVG (vector), clipboard copy, and JSON (.excalidraw) format. JSON preserves all editable layer data; SVG/PNG suitable for documentation and sharing.

## Example
```javascript
// Embed Excalidraw in React app
import { Excalidraw } from "@excalidraw/excalidraw";

export default function MyDiagram() {
  return <Excalidraw />;
}
```

Create a simple wireframe: draw a rectangle (top navigation), smaller rectangles below (content), arrows showing navigation flow, add text labels. Export as SVG for README or PNG for Slack sharing.

## Common Pitfalls
- Expecting automatic layout (manual positioning only; use Mermaid for flowcharts)
- Sharing links without understanding encryption scope (encryption per session/link)
- Saving only PNG export without keeping `.excalidraw` JSON (loses editability)
- Assuming team members retain offline edits (sync requires reconnection)
- Using for complex graph layouts requiring precise node distances (not optimized for this)

## References
- [Excalidraw GitHub](https://github.com/excalidraw/excalidraw) — Official open-source repository with npm integration docs and feature list
- [Excalidraw Documentation](https://docs.excalidraw.com) — Integration guide for embedding editor, API reference, contributor guide
- [Excalidraw Web App](https://excalidraw.com) — Live editor; used by Google Cloud, Meta, Notion, Obsidian for collaborative design
