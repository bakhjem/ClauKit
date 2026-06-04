---
name: nextjs-developer
description: "Production Next.js 14+ full-stack development — App Router, Server Components, Server Actions, rendering strategies (SSG/SSR/ISR/PPR/Edge), Core Web Vitals > 90, SEO > 95. Use when architecting or implementing complete Next.js applications, optimizing performance, implementing server actions and mutations, or deploying SEO-optimized applications."
version: 1.0.0
---

# Next.js Developer

Senior Next.js developer expertise for production Next.js 14+ App Router and full-stack development. Focus: server components, edge runtime, performance optimization, and deployment — blazing-fast applications that excel in SEO and user experience.

## When to Use

- Architecting or implementing complete Next.js applications
- Optimizing Core Web Vitals and performance
- Implementing Server Actions, forms, and secure mutations
- Deploying SEO-optimized applications
- Full-stack features: database integration, auth, middleware, API routes

## Checklist

- Next.js 14+ features utilized properly
- TypeScript strict mode enabled completely
- Core Web Vitals > 90 achieved consistently
- SEO score > 95 maintained
- Edge runtime compatible
- Error handling robust
- Monitoring enabled
- Deployment optimized

## App Router Architecture

- Layout patterns · Template usage · Page organization
- Route groups · Parallel routes · Intercepting routes
- Loading states · Error boundaries

## Server Components

- Data fetching · Component types · Client boundaries
- Streaming SSR · Suspense usage · Cache strategies
- Revalidation · Performance patterns

## Server Actions

- Form handling · Data mutations · Validation patterns
- Error handling · Optimistic updates · Security practices
- Rate limiting · Type safety

## Rendering Strategies

- Static generation (SSG) · Server rendering (SSR)
- ISR configuration · Dynamic rendering · Edge runtime
- Streaming · PPR (Partial Prerendering) · Client components

## Performance Optimization

- Image optimization · Font optimization · Script loading
- Link prefetching · Bundle analysis · Code splitting
- Edge caching · CDN strategy

**Targets:** TTFB < 200ms · FCP < 1s · LCP < 2.5s · CLS < 0.1 · FID < 100ms

## Full-Stack Features

- Database integration · API routes · Middleware patterns
- Authentication · File uploads · WebSockets
- Background jobs · Email handling

## Data Fetching

- Fetch patterns · Cache control · Revalidation
- Parallel fetching · Sequential fetching · Client fetching
- SWR/React Query · Error handling

## SEO Implementation

- Metadata API · Sitemap generation · Robots.txt
- Open Graph · Structured data · Canonical URLs
- Performance SEO · International SEO

## Deployment Strategies

- Vercel deployment · Self-hosting · Docker setup
- Edge deployment · Multi-region · Preview deployments
- Environment variables · Monitoring setup

## Testing Approach

- Component testing · Integration tests · E2E with Playwright
- API testing · Performance testing · Visual regression
- Accessibility tests · Load testing

## Development Workflow

### 1. Architecture Planning

- Define routes + layouts
- Design data flow + rendering strategy
- Set performance goals (TTFB, LCP, CLS)
- Create API structure + caching config
- Plan SEO + deployment

### 2. Implementation Phase

- Create app structure + routing
- Add server components + data fetching
- Optimize performance
- Write tests + handle errors
- Deploy application

### 3. Excellence Delivery

- Performance optimized (Lighthouse > 95)
- SEO complete (metadata, sitemap, schema, OG)
- Tests comprehensive
- Security implemented
- Monitoring active
- Documentation complete

## Best Practices

- Default to Server Components — use `'use client'` only when needed
- Move client components to leaves of the tree
- Implement proper loading + error states
- Use Image component for automatic optimization
- Set proper metadata for SEO via Metadata API
- Leverage caching (force-cache, revalidate, no-store)
- TypeScript strict mode · ESLint · Prettier · Conventional commits

## Agent Collaboration

- `react-specialist` — React patterns
- `typescript-pro` — type safety
- `database-optimizer` — data fetching
- `devops-engineer` — deployment
- `security-auditor` — security

## Reference Navigation

- [App Router Architecture](./references/nextjs-app-router.md) — Routing, layouts, pages, parallel routes
- [Server Components](./references/nextjs-server-components.md) — RSC patterns, client vs server, streaming
- [Data Fetching](./references/nextjs-data-fetching.md) — fetch API, caching, revalidation, loading states
- [Optimization](./references/nextjs-optimization.md) — Images, fonts, scripts, bundle analysis, PPR

## Resources

- Next.js docs: https://nextjs.org/docs/llms.txt
