---
name: markdown-novel-viewer
description: Serve markdown files as formatted book-like HTML via local HTTP server (mdBook, markserv, grip)
category: Documentation & Content
status: active
---

# Markdown Novel Viewer

## Purpose
Stream markdown documentation or narrative content through a local HTTP server with automatic rendering, live preview on file changes, and clean book-like formatting. Ideal for reading long-form docs, technical books, or project guides without committing to a full site build.

## When to Use
- Reading or reviewing long documentation locally before publishing
- Building book-like navigation for multi-chapter guides or tutorials
- Creating offline documentation sites for teams with one-time setup
- Testing markdown rendering and styles in a real browser
- Sharing read-only documentation via HTTP on a local network

**Do NOT use when**: Building permanent published sites (use Mintlify, mdBook CLI deployment, or static site generator), needing user authentication, or requiring advanced features (search, versioning, custom branding).

## Workflow
1. **Choose viewer** — mdBook (Rust, fastest; production-ready), markserv (Node.js, simpler), or grip (Python, GitHub markdown style)
2. **Organize markdown** — Create folder structure: `docs/`, `src/`, or flat `README.md` + `*.md` files
3. **Start server** — `mdbook serve`, `markserv`, or `grip README.md` (each auto-detects files)
4. **Open browser** — Navigate to `http://localhost:3000` (or configured port); auto-refreshes on file save
5. **Format as needed** — Most tools read `.md` files without config; mdBook optionally accepts `book.toml` for TOC and styling

## Key Concepts
### mdBook (Production Grade)
Rust-based tool used for "The Rust Programming Language" book. Auto-generates table of contents, search, syntax highlighting, and PDF export. Supports code testing (runs code samples automatically). Best for: comprehensive guides, official documentation.

### Markserv (Quick Start)
Lightweight Node.js HTTP server. Renders any markdown folder as browsable site. No config file; starts instantly. Best for: quick local previews, sharing docs on local network.

### Grip (GitHub Style)
Python tool that renders markdown exactly as GitHub does (using GitHub's API). Useful for testing GitHub-style markdown before committing. Best for: README files, GitHub Pages content.

## Example (mdBook)
```bash
# Initialize new book
mdbook init my_project

# Start local server (auto-detects chapter files in src/)
mdbook serve

# Browse to http://localhost:3000
```

**book.toml** (optional config):
```toml
[book]
title = "My Documentation"
authors = ["Author"]
language = "en"
```

## Common Pitfalls
- Leaving server running on public network (HTTP is unencrypted; localhost-only is safe)
- Assuming mdBook search works without config (enable in `book.toml`)
- Mixing markdown flavors (each tool has slight differences; test rendering)
- Forgetting to rebuild before sharing (live preview doesn't always sync; `mdbook build` ensures clean output)
- Overloading with HTML (keep markdown clean; let the tool handle rendering)

## References
- [mdBook Official Documentation](https://rust-lang.github.io/mdBook/) — Rust-based tool powering "The Rust Book"; includes search, syntax highlighting, and PDF export
- [markserv GitHub Repository](https://github.com/markserv/markserv) — Lightweight Node.js markdown server; zero configuration
- [Grip GitHub](https://github.com/joeyespo/grip) — Renders markdown with GitHub styling for local preview
