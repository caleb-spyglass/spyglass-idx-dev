# ADR-001: Choice of Next.js + Vercel

**Status:** Accepted  
**Date:** 2025-02-03  
**Deciders:** Spyglass Realty Engineering  

## Context

We needed a framework and hosting platform for a real estate IDX application with these requirements:

- **SEO-critical:** Community and listing pages need server-rendered HTML for search engines
- **Fast time-to-market:** Small team, need to ship quickly
- **Interactive maps:** Heavy client-side interactivity (Leaflet, filters, search)
- **API proxy:** Must hide MLS API keys from the browser
- **WordPress integration:** Needs to embed in existing WordPress site via iframe
- **Low ops burden:** No dedicated DevOps — deployment should be push-to-deploy

### Alternatives Considered

1. **WordPress plugin (PHP)** — Would integrate natively with existing site, but poor interactivity, hard to build complex map/filter UIs, and slow development cycle.
2. **React SPA + Express API** — Maximum flexibility but requires separate hosting for frontend and backend, manual CI/CD, and no built-in SSR for SEO.
3. **Remix + Fly.io** — Good SSR story, but smaller ecosystem, and Fly requires more ops knowledge than Vercel.
4. **Next.js + AWS/Render** — Next.js is great, but self-hosting means managing servers, SSL, CDN, and deployments manually.

## Decision

Use **Next.js 16** (App Router with React Server Components) deployed on **Vercel**.

- **Next.js** provides SSR for SEO, API Routes for key proxying, and excellent React ecosystem support
- **Vercel** provides zero-config deployment, edge CDN, serverless functions, and automatic preview deployments
- **App Router** gives us React Server Components for data fetching without client-side waterfalls

## Consequences

### Positive

- **Zero-ops deployment:** `git push` → production in ~60 seconds
- **Built-in API routes:** Server-side API key protection without a separate backend
- **SSR + Static:** Community pages can be server-rendered for SEO while search is client-interactive
- **Preview deploys:** Every PR gets a unique URL for testing
- **Edge CDN:** Fast globally, important for real estate (local market but mobile users)
- **TypeScript-first:** Full-stack type safety

### Negative

- **Vercel lock-in:** While Next.js is open source, some features (Edge Middleware, analytics) are Vercel-specific
- **Serverless cold starts:** API routes may have ~200ms cold start on first request
- **Cost at scale:** Vercel pricing can spike with high bandwidth/function invocations
- **Community polygon data:** 4,145 polygons loaded per function invocation (serverless = no persistent memory)

### Mitigations

- Keep deployment portable by avoiding Vercel-specific features where possible
- Use `next.revalidate` caching to reduce function invocations
- Monitor Vercel usage and upgrade plan if needed
