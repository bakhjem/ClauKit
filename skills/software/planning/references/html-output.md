# HTML Output (`-o html`)

Single DRY source for rendering a plan as a self-contained `plan.html`. The `/ck:plan` command, the `planning` SKILL, and the `planner` agent only POINT here — all HTML guidance lives in this file once.

## When to use

When `-o html` is passed to `/ck:plan`. Two entry points, SAME fill procedure below:
1. **At plan creation** — `/ck:plan <task> -o html`: render `plan.html` right after the markdown plan is written.
2. **Convert existing plan** — `/ck:plan <path-to-plan.md> -o html`: skip planning, just (re)render `plan.html` from an existing plan dir's markdown (refresh a stale snapshot).

Default (no flag) = markdown only; do NOT generate html.

Markdown (`plan.md` + `phase-*.md`) is the SINGLE SOURCE OF TRUTH. `plan.html` is a one-directional, hand-authored **view** derived from the markdown. Never edit html by hand; never read it back; cook never touches it. Re-running either entry point overwrites `plan.html` with a fresh snapshot.

## Hard constraints (checklist — all must hold)

- [ ] **Single file** — one `plan.html` in the plan dir, embedding ALL phases (not one html per phase).
- [ ] **Self-contained** — full document: `<!doctype html><html><head><style>…</style></head><body>…</body></html>`.
- [ ] **No external origins** — no `<link>`, no CDN, no `<script src>`, no external fonts/images, no `@import`, no `fetch`/`XHR`. Inline `<style>` only.
- [ ] **Offline** — opens via `file://` in any browser with ZERO network requests.
- [ ] **Prefer ZERO JS** — every feature below is pure HTML/CSS. Add inline JS only if a feature truly needs it (justify) and it stays `file://`-safe (no external calls, no CSP violation).
- [ ] **Responsive** — `max-width` container, no horizontal body scroll; wide code/tables wrapped in `overflow-x:auto`.
- [ ] **Print-safe** — `@media print` expands all `<details>`.

## The 4 rendering techniques

### 1. Collapsible phases — native `<details>` (zero JS)

```html
<section id="phase-1">
  <details open>
    <summary>Phase 1 — Setup <span class="badge done">done</span></summary>
    <p>…phase content…</p>
  </details>
</section>
```
`<details open>` is keyboard-accessible and `file://`-safe. No JS. `open` attribute = expanded by default.

### 2. Status badges + progress bar — pure CSS

Planner counts checkboxes in each phase's Todo list: `- [x]` = done, `- [ ]` = open. `pct = round(done / total * 100)`. Write the percentage as an inline `width` — NO JS computation at render time.

```html
<div class="bar"><div class="bar-fill" style="width:75%"></div></div>
<span class="pct">75% (3/4 phases)</span>
```
Badge class by phase status:
- `done` — all checkboxes checked
- `in-progress` — some checked
- `todo` — none checked

```html
<span class="badge done">done</span>
<span class="badge in-progress">in-progress</span>
<span class="badge todo">todo</span>
```

### 3. Diagrams as CSS/flex boxes (NOT mermaid)

Render architecture / data-flow / dependency diagrams as flex rows/columns of boxes joined by arrow glyphs. See "Accepted deviation" below for why not mermaid.

```html
<div class="diagram">
  <div class="node">plan.md</div>
  <span class="arrow">→</span>
  <div class="node">html-output.md</div>
  <span class="arrow">→</span>
  <div class="node">plan.html</div>
</div>
```
Vertical flow: set `.diagram{flex-direction:column}` and use `↓` arrows. Keep diagrams small (≤ ~8 nodes); for larger graphs, summarize or split.

### 4. Syntax-highlighted code — hand-tokenized spans + inline CSS theme

Wrap tokens in `<span>` with a small class palette; colors come from the inline theme. Planner tokenizes by hand — keep large blocks summarized to bound token cost.

Token palette: `kw` (keyword), `str` (string), `com` (comment), `fn` (function/name), `num` (number). Leave operators/plain text unwrapped.

```html
<pre><code><span class="kw">const</span> <span class="fn">slug</span> = <span class="str">"plan-html"</span>; <span class="com">// derived</span></code></pre>
```

## Skeleton template (copy + fill the `{{slots}}`)

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{PLAN_TITLE}}</title>
<style>
  :root{--bg:#0d1117;--fg:#e6edf3;--muted:#8b949e;--card:#161b22;--border:#30363d;
        --accent:#58a6ff;--done:#2ea043;--prog:#d29922;--todo:#6e7681;
        --kw:#ff7b72;--str:#a5d6ff;--com:#8b949e;--fn:#d2a8ff;--num:#79c0ff;}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);
       font:15px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
  .wrap{max-width:920px;margin:0 auto;padding:32px 20px}
  header h1{margin:0 0 6px;font-size:24px}
  .meta{color:var(--muted);font-size:13px;margin-bottom:16px}
  .bar{height:10px;background:var(--card);border:1px solid var(--border);border-radius:6px;overflow:hidden}
  .bar-fill{height:100%;background:var(--done)}
  .pct{font-size:13px;color:var(--muted);margin-left:4px}
  nav{margin:20px 0;padding:14px 16px;background:var(--card);border:1px solid var(--border);border-radius:8px}
  nav strong{display:block;margin-bottom:6px;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
  nav a{color:var(--accent);text-decoration:none;display:block;padding:3px 0}
  nav a:hover{text-decoration:underline}
  section{margin:14px 0}
  details{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:8px 16px}
  details>*:not(summary){margin-left:4px}
  summary{cursor:pointer;font-weight:600;font-size:16px;list-style:none}
  summary::-webkit-details-marker{display:none}
  summary::before{content:"▸ ";color:var(--muted)}
  details[open] summary::before{content:"▾ "}
  h3{font-size:15px;margin:16px 0 6px;color:var(--accent)}
  .badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;margin-left:8px;vertical-align:middle}
  .badge.done{background:rgba(46,160,67,.18);color:var(--done)}
  .badge.in-progress{background:rgba(210,153,34,.18);color:var(--prog)}
  .badge.todo{background:rgba(110,118,129,.2);color:var(--todo)}
  .diagram{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:12px 0;overflow-x:auto}
  .diagram.col{flex-direction:column;align-items:flex-start}
  .node{border:1px solid var(--border);background:var(--bg);border-radius:6px;padding:8px 12px;white-space:nowrap}
  .node.src{border-color:var(--done)}
  .arrow{color:var(--muted)}
  .chk{color:var(--done)}.unchk{color:var(--todo)}
  pre{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:12px;overflow-x:auto}
  code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px}
  table{border-collapse:collapse;width:100%;display:block;overflow-x:auto}
  th,td{border:1px solid var(--border);padding:6px 10px;text-align:left}
  th{background:var(--bg)}
  .kw{color:var(--kw)}.str{color:var(--str)}.com{color:var(--com)}.fn{color:var(--fn)}.num{color:var(--num)}
  footer{margin-top:28px;padding-top:14px;border-top:1px solid var(--border);color:var(--muted);font-size:12px}
  @media print{details{display:block}details summary::before{content:""}body{background:#fff;color:#000}.node,pre,nav,details{background:#fff}}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>{{PLAN_TITLE}}</h1>
    <div class="meta">{{DATE}} · {{STATUS}}</div>
    <div class="bar"><div class="bar-fill" style="width:{{PCT}}%"></div></div>
    <span class="pct">{{PCT}}% ({{DONE}}/{{TOTAL}} phases)</span>
  </header>
  <nav>{{TOC_LINKS}}</nav>
  {{PHASE_SECTIONS}}
  <footer>⚠ Snapshot generated from plan.md — markdown is the source of truth.
  Re-run <code>/ck:plan … -o html</code> to refresh.</footer>
</div>
</body>
</html>
```

`{{TOC_LINKS}}` = one `<a href="#phase-N">Phase N — name</a>` per phase.
`{{PHASE_SECTIONS}}` = the repeated `<section id="phase-N"><details open><summary>…</summary>…</details></section>` blocks.

## Fill procedure (md → html, one-directional)

1. Read `plan.md` + every `phase-*.md` in the plan dir.
2. `{{PLAN_TITLE}}`, `{{DATE}}`, `{{STATUS}}` ← from `plan.md` header.
3. Per phase: count Todo checkboxes → `done`/`total`; phase badge = done/in-progress/todo. Roll up phases: `{{DONE}}` = phases fully done, `{{TOTAL}}` = phase count, `{{PCT}} = round(DONE/TOTAL*100)`.
4. Convert md → html per phase body: headings → `<h2>/<h3>`, lists → `<ul>/<ol>`, tables → `<table>`, code fences → tokenized `<pre><code>` (technique 4), ascii/`mermaid`-style diagrams → flex boxes (technique 3), checkboxes → glyph spans `<span class="chk">✓</span>` (done) / `<span class="unchk">☐</span>` (open) + label.
5. Build `{{TOC_LINKS}}` and `{{PHASE_SECTIONS}}`.
6. Write the single `plan.html` into the plan dir alongside `plan.md`. Do NOT modify any `.md`.

## Accepted deviation — diagrams

The literal request said "Mermaid diagrams rendered". Mermaid needs `mermaid.min.js` (~3.5MB) inlined to stay self-contained — infeasible to hand-author and bloats every file. Instead diagrams use hand-authored CSS/flex boxes (technique 3): same visual goal (nodes + flow), zero deps, hand-authorable. Documented per researcher guidance.

## Snapshot / re-render contract

- `plan.html` is a **point-in-time snapshot** of the markdown at generation time.
- Editing `plan.md`/`phase-*.md` does NOT update `plan.html`. To refresh, re-run `/ck:plan … -o html`.
- The stale-marker footer makes this visible so html is never mistaken for live.
- `/ck:cook` reads ONLY markdown; it never reads, regenerates, or depends on `plan.html`.
