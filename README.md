# Spyglass IDX

Real estate listing search for the Austin metro area. Powered by Repliers MLS API, deployed on Vercel.

**Production:** https://spyglass-idx.vercel.app  
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Leaflet  
**Governance:** [Enterprise Architecture Guidelines v1.0](./docs/spyglass_enterprise_arch.pdf), February 2026

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/SpyglassRealty/spyglass-idx.git
cd spyglass-idx

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — at minimum set REPLIERS_API_KEY

# 4. Run
npm run dev
# → http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

Set in `.env.local` (local) or **Vercel Dashboard → Settings → Environment Variables** (production).

| Variable | Required | Description |
|---|---|---|
| `REPLIERS_API_KEY` | **Yes** | Repliers MLS API key |
| `REPLIERS_API_URL` | No | Repliers base URL (default: `https://api.repliers.io`) |
| `FUB_API_KEY` | No | Follow Up Boss CRM key (leads degrade gracefully without) |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for SEO |

Full list: [RUNBOOK.md § Environment Variables](./RUNBOOK.md#2-environment-variables)

## Deploy

Push to `main` → Vercel auto-deploys. Manual: `npx vercel --prod`.

See [RUNBOOK.md](./RUNBOOK.md) for full deployment, rollback, and troubleshooting procedures.

## Test

```bash
npm run build   # Type-checks + compiles all routes
npm run lint    # Linting
```

> **Note:** No unit test suite yet. Build + lint is the current verification gate. See roadmap.

## Project Structure

```
src/
├── app/
│   ├── api/            # API route handlers (serverless)
│   │   ├── listings/   # MLS search endpoints
│   │   ├── communities/# Community data + stats
│   │   ├── nlp-search/ # AI natural-language search
│   │   └── leads/      # Lead capture → Follow Up Boss
│   ├── communities/    # Community pages (SSR)
│   ├── listing/        # Listing detail pages (SSR)
│   └── favorites/      # Client-side favorites (localStorage)
├── components/         # React components
├── data/               # Static community polygon data (4,145 polygons)
├── hooks/              # Custom React hooks
├── lib/                # Server-side utilities
│   ├── repliers-api.ts # Repliers MLS client (timeout + retry)
│   ├── follow-up-boss.ts # FUB CRM client (timeout + retry)
│   ├── logger.ts       # Structured JSON logging
│   ├── nlp-guard.ts    # NLP prompt firewall
│   ├── rate-limit.ts   # Token-bucket rate limiter
│   └── fetch-with-retry.ts # Resilient fetch wrapper
└── types/              # TypeScript type definitions
```

## Documentation

| Document | Purpose |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | C4 diagrams, tech stack, data flows, deployment |
| [SECURITY.md](./SECURITY.md) | Threat model, data classification, security checklist |
| [RUNBOOK.md](./RUNBOOK.md) | Operations, incidents, rollback, monitoring |
| [ADR/](./ADR/) | Architecture Decision Records (5 active) |
| [openapi.yaml](./openapi.yaml) | API contract (OpenAPI 3.1) |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full C4 diagrams. High-level:

```
Browsers → Vercel (Next.js SSR + API Routes) → Repliers API (MLS)
                                              → Follow Up Boss (CRM)
                                              → Census API (Stats)
```

## License

Proprietary — Spyglass Realty. All rights reserved.
