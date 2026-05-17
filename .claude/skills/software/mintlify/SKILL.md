---
name: mintlify
description: Build interactive documentation sites with Mintlify, MDX components, and OpenAPI playground integration
category: Documentation & Content
status: active
---

# Mintlify

## Purpose
Deploy AI-native documentation with interactive API playgrounds, embedded React components via MDX, and smart search in minutes. Mintlify handles infrastructure so teams focus on content rather than site setup.

## When to Use
- Launching product/API documentation (SaaS, libraries, platforms)
- Adding interactive API explorers without custom coding
- Mixing markdown narrative with interactive code components
- Needing professional defaults with minimal configuration
- Publishing to custom domain with built-in analytics

**Do NOT use when**: Building static blogs (use mdBook or Quarto instead), creating internal-only docs (no auth layer), or needing offline-first documentation.

## Workflow
1. **Initialize project** — `mintlify init` creates starter structure (docs folder, config.json)
2. **Configure metadata** — Set title, logo, colors, navigation in `mint.json`
3. **Write markdown** — Each `.md` file becomes a page; organize into folders for sections
4. **Embed components** — Import React components within markdown using MDX syntax (JSX inside `.md`)
5. **Add OpenAPI** — Reference OpenAPI spec in config; Mintlify auto-generates interactive endpoint docs
6. **Deploy** — `mintlify publish` to Mintlify cloud or connect GitHub for auto-deploy on push

## Key Concepts
### MDX: Markdown + JSX
MDX lets you import React components inside markdown. Write prose normally, then drop in `<ComponentName />` when you need interactivity (callouts, tabs, code playgrounds, charts). Compiles to JavaScript at build time—no runtime overhead.

### OpenAPI Integration
Paste your OpenAPI spec URL; Mintlify auto-generates endpoint documentation with request/response examples and an interactive "Try It" playground. Users test endpoints without leaving docs.

### Smart Search
Full-text search across all pages without config. Includes SEO optimization and analytics tracking out-of-box.

## Example
**mint.json** (config):
```json
{
  "name": "Acme API",
  "logo": "logo.png",
  "api": {
    "baseUrl": "https://api.example.com",
    "auth": "bearer"
  }
}
```

**docs/overview.md** (with embedded component):
```markdown
# Getting Started

<CardGroup>
  <Card title="Installation" icon="download">Install via npm or pip</Card>
  <Card title="API Reference" icon="code">View all endpoints</Card>
</CardGroup>
```

## Common Pitfalls
- Ignoring MDX syntax rules (JSX must be valid; unclosed tags break the build)
- Storing sensitive data in docs (API keys, secrets; use environment variables)
- Inconsistent folder structure (makes navigation confusing; use flat hierarchies)
- Forgetting to update OpenAPI spec (auto-generated docs become stale)
- Over-styling with custom components (lean on built-ins for consistency)

## References
- [Mintlify Documentation](https://mintlify.com/docs) — Official setup and deployment guide
- [MDX Specification](https://mdxjs.com/) — JSX in markdown; framework-agnostic component syntax
- [OpenAPI Specification](https://spec.openapis.org/) — Standard for API documentation and contract testing
