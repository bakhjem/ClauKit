---
name: tanstack
description: TanStack full-stack React framework with Server Components, Streaming, and Type-Safe Routing
category: Build & Deploy
status: active
---

# TanStack

## Purpose

Leverage TanStack's ecosystem—Start (full-stack framework), Query (server-state management), Form (headless validation)—to build type-safe, streaming-enabled applications with minimal boilerplate and maximum developer ergonomics.

## When to Use

- Building full-stack React apps with file-based routing, SSR, and streaming
- Managing server-state (data fetching, caching, mutations) across React/Vue/Svelte/Angular
- Handling complex form validation with async validation and nested fields
- Need framework-agnostic, headless form solutions with zero dependencies
- Streaming responses and progressive rendering for fast perceived performance

**Do NOT use when**: Building static-only sites (use pure Next.js), simple SPAs without data fetching, or projects without TypeScript (TanStack emphasizes type safety).

## Workflow

1. **Choose TanStack Start** (or integrate Query+Form into existing app)
   - `npm create tanstack-router@latest my-app` for new projects
   - Leverages TanStack Router for fully type-safe file-based routing
   - Includes server functions (RPC-like calls) and streaming support

2. **Set up TanStack Query** for server-state management
   - Define query keys and fetch functions (`useQuery`, `useMutation`)
   - Configure caching, stale time, and refetch strategies
   - Automatic background refetching and optimistic updates

3. **Implement TanStack Form** for client-side form validation
   - Create form instances with field validators
   - Use headless (framework-agnostic) form state binding
   - Add async validation with debouncing for real-time feedback

4. **Deploy** to any platform supporting Node.js/serverless
   - Works on traditional servers, Vercel, Netlify, Fly.io, etc.
   - Streaming works out-of-the-box for progressive rendering

## Key Concepts

### TanStack Start
Full-stack React framework combining file-based routing (via TanStack Router) with server-side rendering and streaming. Outputs "full-document SSR" and server functions (RPCs) that remain type-safe across client/server boundaries. Enables building applications that deploy anywhere JavaScript runs.

### TanStack Query
Asynchronous state management library focused on server-state (not global state). Handles fetching, caching, background syncing, and mutations. Framework-specific implementations (`@tanstack/react-query`, `@tanstack/vue-query`, etc.) share the same core patterns. Significantly reduces boilerplate vs. manual `useState` + `useEffect`.

### TanStack Form
Headless form state management with first-class TypeScript support. Granularly reactive—only relevant components re-render on state change. Zero dependencies, minimal bundle size. Works across React, Vue, Solid, Svelte, Angular, Lit, and vanilla JS. No imposed abstractions; compose directly in components.

## Example

**TanStack Start Server Function:**
```typescript
// routes/api/posts.ts (server-only)
export async function getPosts() {
  const data = await db.posts.findMany()
  return data
}
```

**Client-side Usage with Query:**
```typescript
import { useQuery } from '@tanstack/react-query'
import { getPosts } from './routes/api/posts'

export function Posts() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts()
  })
  // Fully typed, zero manual serialization
}
```

**TanStack Form Example:**
```typescript
const form = useForm({
  defaultValues: { email: '', password: '' },
  validators: {
    onChange: ({ value }) => {
      if (!value.email) return 'Email required'
    }
  },
  onSubmit: ({ value }) => submitForm(value)
})

<input {...form.register('email')} />
{form.state.fieldMeta.email.errors[0]}
```

## Common Pitfalls

- Forgetting TanStack Query caches results—manually refetching defeats its purpose
- Over-nesting Suspense boundaries with Start; use streaming instead for progressive loading
- Mixing TanStack Form field state with external state managers (Redux, Zustand) causes sync issues
- Not typing query keys consistently; use `as const` for type-safe key arrays
- Server functions in Start must be in routes, not components; hydration mismatches occur otherwise

## References

- [TanStack Start](https://tanstack.com/start/latest) — Full-stack React framework with file-based routing and streaming
- [TanStack Query](https://tanstack.com/query/latest) — Server-state management and data fetching across frameworks
- [TanStack Form](https://tanstack.com/form/latest) — Headless form validation with zero dependencies
- [TanStack Router](https://tanstack.com/router/latest) — Type-safe, file-based routing foundation for Start
