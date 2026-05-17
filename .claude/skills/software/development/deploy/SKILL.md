---
name: deploy
description: Auto-detect stack and deploy to 15+ platforms (Vercel, Netlify, Cloudflare, Render, Fly.io, etc.)
category: Build & Deploy
status: active
---

# Deploy

## Purpose

Detect application stack from source code (Next.js, React, Vue, Node.js, Python, etc.) and automatically deploy to the most suitable platform, handling build configuration, environment variables, and CI/CD workflows with minimal manual intervention.

## When to Use

- Deploying web applications (static, SSR, serverless, full-stack)
- Need zero-config or minimal-config deployments
- Building for multiple deployment targets (dev, staging, production)
- Integrating GitHub/GitLab push-to-deploy workflows
- Scaling from prototype to production without refactoring

**Do NOT use when**: Deploying to private infrastructure (self-hosted servers), Kubernetes clusters requiring custom manifests, or legacy applications with bespoke build processes.

## Workflow

1. **Detect project stack:**
   - Analyze `package.json` (Node.js/frontend frameworks), `requirements.txt`/`pyproject.toml` (Python), `Gemfile` (Ruby), `go.mod` (Go), `Dockerfile` (containers)
   - Identify framework (Next.js, React, Vue, Svelte, Astro, etc.) via dependencies
   - Determine build output location and runtime requirements

2. **Select deployment platform:**
   - **Full-stack (Node.js + SSR):** Vercel (Next.js first-class), Netlify, Render, Fly.io
   - **Frontend-only (SPA/static):** Vercel, Netlify, Cloudflare Pages, AWS Amplify
   - **Python/Django/FastAPI:** Render, Fly.io, Google Cloud Run, Heroku (legacy)
   - **Ruby on Rails:** Fly.io, Render, Heroku
   - **Containers/custom:** Render, Fly.io, Google Cloud Run, AWS ECS

3. **Configure deployment:**
   - Connect Git repository (GitHub, GitLab, Bitbucket)
   - Set environment variables (API keys, database URLs, secrets)
   - Configure build command and output directory (auto-detected if standard)
   - Choose deployment region and scaling tier

4. **Trigger and monitor deployment:**
   - Deploy on Git push (CI/CD automation)
   - Review preview deployments before merging
   - Monitor logs, metrics, uptime
   - Set up automatic rollbacks on build failure

5. **Post-deployment tasks:**
   - Configure custom domains and DNS
   - Set up monitoring, alerts, APM
   - Configure database backups (if using managed Postgres, Redis)
   - Document deployment checklist for team

## Key Concepts

### Vercel
AI Cloud platform optimized for Next.js and React. Native support for App Router, Server Components, streaming. Global CDN, automatic image optimization, edge middleware. Zero-config for Next.js; minimal setup for other frameworks. Generous free tier.

### Netlify
All-in-one platform for static sites and serverless. Supports 15+ frameworks (Astro, React, Next.js, Vue, Svelte, etc.). Git-based deployments, edge functions, managed forms, database + blobs. Drag-and-drop upload option. Free tier with bandwidth limits.

### Cloudflare Pages
Static site hosting on Cloudflare's global network. Git integration (GitHub, GitLab). CLI deployment via `wrangler`. Integrates with Cloudflare Workers for serverless compute. Fast, reliable CDN. Free tier with project limits.

### Render
Modern, full-featured platform supporting Node.js, Python, Ruby, Go, Rust, Docker. Web services, static sites, background workers, cron jobs. Managed Postgres, Redis, persistent volumes. YAML-based "Blueprints" for infrastructure-as-code. Free tier available.

### Fly.io
Global infrastructure for containerized apps. Kubernetes support via Fly Kubernetes. Managed Postgres, persistent volumes, Redis (Upstash). Automatic scaling, health checks, rolling deployments. Deploy anywhere with `flyctl`.

### Google Cloud Run
Serverless container execution. Pay-per-use pricing. Auto-scales from zero. Supports any containerized app (Node.js, Python, Go, etc.). Integration with Cloud Build for CI/CD. Cold start latency acceptable for most workloads.

## Example

**Auto-detect and deploy Next.js to Vercel:**
```bash
# Push to GitHub
git push origin main

# Vercel auto-detects Next.js, builds, deploys
# Automatically sets NEXT_PUBLIC_* env vars from .env.local
# Generates preview URL for each pull request
```

**Deploy Python FastAPI to Render:**
```bash
# Render detects Python, runs pip install on requirements.txt
# Uses Procfile or gunicorn for server command
# Manages environment variables, auto-deploys on push
```

**Deploy static site to Cloudflare Pages:**
```bash
# CLI deployment
npm install -g wrangler
wrangler pages deploy dist/

# Or Git-based: connect repo, specify build command (npm run build), output dir (dist)
```

**Deploy Docker container to Fly.io:**
```bash
flyctl launch  # Interactive setup, creates fly.toml
flyctl deploy  # Builds and deploys

# flyctl dashboard shows logs, metrics, deploy history
```

## Common Pitfalls

- Not configuring environment variables before first deploy; app fails due to missing API keys/secrets
- Hardcoding production URLs in code; use environment variables (NEXT_PUBLIC_API_URL, etc.)
- Deploying without `.gitignore`; node_modules, .env pushed to repo (some platforms auto-skip)
- Not setting up custom domains; production traffic on platform-assigned URL (SEO, branding issues)
- Skipping preview deployments; merging broken PRs to main
- Assuming auto-detected build command correct; verify `npm run build` output matches platform expectations
- Not monitoring logs after deploy; issues only discovered when users report
- Leaving dev/test databases exposed; restrict access with authentication, VPCs

## References

- [Vercel Docs](https://vercel.com/docs) — Next.js-native deployment, global CDN, edge middleware
- [Netlify Docs](https://docs.netlify.com/) — Full-stack platform supporting 15+ frameworks
- [Cloudflare Pages](https://pages.cloudflare.com/) — Static and serverless on global network
- [Render Docs](https://render.com/docs) — Multi-language platform with managed databases
- [Fly.io Docs](https://fly.io/docs/) — Global infrastructure, Kubernetes, managed services
- [Google Cloud Run](https://cloud.google.com/run/docs) — Serverless containers, pay-per-use
