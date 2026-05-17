---
name: llms
description: Generate llms.txt metadata file to help LLMs understand your project structure and content
category: Documentation & Content
status: active
---

# Llms

## Purpose
Create `/llms.txt` file (standardized markdown format) to help large language models navigate and understand your project. Complements robots.txt by telling LLMs what your site contains, key resources, and how to explore content—solving the context-window problem where LLMs can't read entire sites.

## When to Use
- Publishing documentation or API that LLMs may reference
- Improving LLM understanding of your codebase for better answers in chatbots
- Optimizing for AI-powered search and discovery
- Creating `/llms-full.txt` for complete documentation content in plain text
- Ensuring AI agents correctly interpret your project structure

**Do NOT use when**: Building internal-only tools (no public web presence), serving content behind authentication, or handling sensitive/proprietary information.

## Workflow
1. **Audit structure** — List main sections, key pages, API endpoints, and documentation resources
2. **Create H1 heading** — Project/site name (only required section)
3. **Add blockquote summary** — 1-2 sentences describing the project and its purpose
4. **List sections with H2 headings** — "Documentation", "API Endpoints", "Guides", etc.
5. **Add markdown links** — Format: `[Page Title](url)` with brief description after colon
6. **Create optional /llms-full.txt** — Plain-text dump of all documentation content for full context
7. **Place at root** — Save as `public/llms.txt` (or `docs/llms.txt` for static sites)

## Key Concepts
### llms.txt Format (Answer.AI Spec)
Markdown-based, human-and-AI readable. Required: H1 heading. Optional but recommended: blockquote summary, H2 sections with link lists, additional prose context. Each link includes URL and short description. NO custom extensions—standard markdown only.

### Why Markdown?
Markdown is readable by both humans and LLMs during inference. XML or JSON would be harder for LLMs to parse in constrained contexts. Simplicity beats richness.

### llms-full.txt Companion
While `/llms.txt` provides navigation and structure, `/llms-full.txt` contains complete plaintext documentation. LLMs use `/llms.txt` to understand scope, then fetch specific `/llms-full.txt` sections for detail. Reduces context waste.

## Example
```markdown
# MyProject

> MyProject is an open-source framework for building real-time web apps with minimal boilerplate.

## Getting Started

- [Installation Guide](https://docs.myproject.io/install) - Step-by-step setup
- [Quick Start](https://docs.myproject.io/quickstart) - Your first app in 5 minutes
- [API Overview](https://docs.myproject.io/api) - Core concepts and architecture

## API Reference

- [REST Endpoints](https://docs.myproject.io/api/rest) - HTTP API documentation
- [WebSocket Events](https://docs.myproject.io/api/websocket) - Real-time event streaming
- [Middleware](https://docs.myproject.io/api/middleware) - Request/response pipeline

## Community

- [GitHub Repository](https://github.com/myproject/myproject) - Source code and issue tracker
- [Discord Community](https://discord.gg/myproject) - Chat with maintainers
```

## Common Pitfalls
- Using non-standard markdown syntax (custom directives break LLM parsing; stick to CommonMark)
- Linking to authentication-required pages (LLMs can't follow; use public URLs only)
- Including outdated resources (LLMs assume links are fresh; remove dead links)
- Overloading with links (prioritize; 30-50 key resources per section is sufficient)
- Forgetting H1 heading (it's the anchor; LLMs won't understand structure without it)
- Not updating when docs change (treat llms.txt as a living file; version with your docs)

## References
- [The llms.txt Specification](https://llmstxt.org/) — Official spec and format requirements by Answer.AI
- [llms.txt Mintlify Documentation](https://www.mintlify.com/docs/ai/llmstxt) — Integration guide for documentation platforms
- [GitBook Blog: What is llms.txt](https://www.gitbook.com/blog/what-is-llms-txt) — Overview and implementation best practices
